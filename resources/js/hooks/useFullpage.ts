import { useCallback, useEffect, useRef, useState } from 'react';

const LOCK_MS = 1000;
const WHEEL_THRESHOLD = 24;
const SWIPE_THRESHOLD = 48;

/**
 * Whether the element under the pointer is an inner scroll area that can still
 * scroll in the requested direction (so the wheel scrolls it instead of changing section).
 */
function innerScrollerCanScroll(target: EventTarget | null, direction: 1 | -1): boolean {
    let node = target instanceof HTMLElement ? target : null;

    while (node && node !== document.body) {
        if (node.dataset.scrollable !== undefined) {
            const atTop = node.scrollTop <= 0;
            const atBottom = node.scrollTop + node.clientHeight >= node.scrollHeight - 2;
            const overflowing = node.scrollHeight > node.clientHeight + 2;

            if (overflowing && ((direction === 1 && !atBottom) || (direction === -1 && !atTop))) {
                return true;
            }
        }
        node = node.parentElement;
    }

    return false;
}

/**
 * Single-page "fullpage" navigation: one wheel tick / swipe / key press moves exactly one section.
 *
 * @return {{ index: number, goTo: (next: number) => void, next: () => void, prev: () => void }}
 */
export function useFullpage(count: number, enabled = true) {
    const [index, setIndex] = useState(0);
    const indexRef = useRef(0);
    const lockedUntil = useRef(0);
    const touchStartY = useRef<number | null>(null);

    const goTo = useCallback(
        (nextIndex: number) => {
            const clamped = Math.max(0, Math.min(count - 1, nextIndex));
            if (clamped === indexRef.current) {
                return;
            }
            indexRef.current = clamped;
            lockedUntil.current = Date.now() + LOCK_MS;
            setIndex(clamped);
        },
        [count],
    );

    const step = useCallback(
        (direction: 1 | -1) => {
            if (Date.now() < lockedUntil.current) {
                return;
            }
            goTo(indexRef.current + direction);
        },
        [goTo],
    );

    useEffect(() => {
        if (!enabled) {
            return;
        }

        const onWheel = (event: WheelEvent) => {
            if (event.defaultPrevented) {
                return;
            }
            const delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : 0;
            if (Math.abs(delta) < WHEEL_THRESHOLD) {
                return;
            }
            const direction = delta > 0 ? 1 : -1;
            if (innerScrollerCanScroll(event.target, direction)) {
                return;
            }
            event.preventDefault();
            step(direction);
        };

        const onKey = (event: KeyboardEvent) => {
            if (event.defaultPrevented) {
                return;
            }
            const tag = (event.target as HTMLElement)?.tagName;
            if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) {
                return;
            }
            if (['ArrowDown', 'PageDown'].includes(event.key) || (event.key === ' ' && !event.shiftKey)) {
                if (tag === 'BUTTON' || tag === 'A') {
                    if (event.key === ' ') {
                        return;
                    }
                }
                event.preventDefault();
                step(1);
            } else if (['ArrowUp', 'PageUp'].includes(event.key) || (event.key === ' ' && event.shiftKey)) {
                event.preventDefault();
                step(-1);
            } else if (event.key === 'Home') {
                event.preventDefault();
                goTo(0);
            } else if (event.key === 'End') {
                event.preventDefault();
                goTo(count - 1);
            }
        };

        const onTouchStart = (event: TouchEvent) => {
            touchStartY.current = event.touches[0].clientY;
        };

        const onTouchEnd = (event: TouchEvent) => {
            if (touchStartY.current === null) {
                return;
            }
            const delta = touchStartY.current - event.changedTouches[0].clientY;
            touchStartY.current = null;
            if (Math.abs(delta) < SWIPE_THRESHOLD) {
                return;
            }
            const direction = delta > 0 ? 1 : -1;
            if (innerScrollerCanScroll(event.target, direction)) {
                return;
            }
            step(direction);
        };

        window.addEventListener('wheel', onWheel, { passive: false });
        window.addEventListener('keydown', onKey);
        window.addEventListener('touchstart', onTouchStart, { passive: true });
        window.addEventListener('touchend', onTouchEnd, { passive: true });

        return () => {
            window.removeEventListener('wheel', onWheel);
            window.removeEventListener('keydown', onKey);
            window.removeEventListener('touchstart', onTouchStart);
            window.removeEventListener('touchend', onTouchEnd);
        };
    }, [count, enabled, goTo, step]);

    return {
        index,
        goTo,
        next: () => step(1),
        prev: () => step(-1),
    };
}

