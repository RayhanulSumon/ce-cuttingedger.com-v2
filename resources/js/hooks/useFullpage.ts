import { useCallback, useEffect, useRef, useState } from 'react';

/** Accumulated wheel travel (px) that counts as one deliberate "next section" gesture. */
const WHEEL_THRESHOLD = 40;
/** A pause this long between wheel events starts a new gesture. */
const WHEEL_GESTURE_GAP_MS = 160;
/** Deltas at or above this come from a notched mouse wheel, never from trackpad inertia. */
const MOUSE_TICK_DELTA = 50;
/** A jump this large over the previous delta means the user flicked again mid-inertia. */
const REFLICK_DELTA = 12;
const LINE_HEIGHT_PX = 40;
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
 * Single-page "fullpage" navigation: one wheel gesture / swipe / key press moves exactly one section.
 *
 * - Wheel input is accumulated per gesture, so slow trackpad scrolling still registers, and the
 *   inertia tail of a swipe cannot trigger a second section change once the lock expires.
 * - `goTo` calls that arrive mid-transition are queued and run when the transition has finished,
 *   so the stage never has to interrupt a running animation.
 *
 * @param count        number of sections
 * @param transitionMs length of one section change; input is locked for this long
 * @param enabled      set false to suspend wheel / key / touch handling (e.g. while an overlay is open)
 * @param initialIndex section to open on (e.g. when arriving from another page's menu)
 */
export function useFullpage(count: number, transitionMs: number, enabled = true, initialIndex = 0) {
    const [index, setIndex] = useState(initialIndex);
    const indexRef = useRef(initialIndex);
    const lockedUntil = useRef(0);
    const queuedTimer = useRef(0);
    const touchStartY = useRef<number | null>(null);
    const wheel = useRef({ sum: 0, lastTime: 0, lastAbs: 0, consumed: false });

    const goTo = useCallback(
        (nextIndex: number) => {
            const clamped = Math.max(0, Math.min(count - 1, nextIndex));
            window.clearTimeout(queuedTimer.current);

            const wait = lockedUntil.current - performance.now();
            if (wait > 0) {
                queuedTimer.current = window.setTimeout(() => goTo(clamped), wait + 16);
                return;
            }
            if (clamped === indexRef.current) {
                return;
            }
            indexRef.current = clamped;
            lockedUntil.current = performance.now() + transitionMs;
            setIndex(clamped);
        },
        [count, transitionMs],
    );

    const step = useCallback(
        (direction: 1 | -1) => {
            if (performance.now() < lockedUntil.current) {
                return;
            }
            goTo(indexRef.current + direction);
        },
        [goTo],
    );

    useEffect(() => () => window.clearTimeout(queuedTimer.current), []);

    useEffect(() => {
        if (!enabled) {
            return;
        }

        const onWheel = (event: WheelEvent) => {
            if (event.defaultPrevented || event.ctrlKey) {
                return;
            }
            if (Math.abs(event.deltaY) < Math.abs(event.deltaX) || event.deltaY === 0) {
                return;
            }
            const delta = event.deltaMode === WheelEvent.DOM_DELTA_LINE ? event.deltaY * LINE_HEIGHT_PX : event.deltaY;
            const direction = delta > 0 ? 1 : -1;
            const gesture = wheel.current;

            if (innerScrollerCanScroll(event.target, direction)) {
                gesture.sum = 0;
                return;
            }
            event.preventDefault();

            const now = performance.now();
            const abs = Math.abs(delta);
            const isNewGesture = now - gesture.lastTime > WHEEL_GESTURE_GAP_MS;

            if (isNewGesture || abs >= MOUSE_TICK_DELTA || abs > gesture.lastAbs + REFLICK_DELTA) {
                gesture.consumed = false;
            }
            if (isNewGesture || Math.sign(gesture.sum) !== direction) {
                gesture.sum = 0;
            }
            gesture.lastTime = now;
            gesture.lastAbs = abs;

            if (now < lockedUntil.current) {
                gesture.consumed = true;
                gesture.sum = 0;
                return;
            }
            if (gesture.consumed) {
                return;
            }

            gesture.sum += delta;
            if (Math.abs(gesture.sum) >= WHEEL_THRESHOLD) {
                gesture.sum = 0;
                gesture.consumed = true;
                step(direction);
            }
        };

        const onKey = (event: KeyboardEvent) => {
            if (event.defaultPrevented) {
                return;
            }
            const tag = (event.target as HTMLElement | null)?.tagName ?? '';
            if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) {
                return;
            }
            const isSpace = event.key === ' ';
            if (isSpace && (tag === 'BUTTON' || tag === 'A')) {
                return;
            }

            if (['ArrowDown', 'PageDown'].includes(event.key) || (isSpace && !event.shiftKey)) {
                event.preventDefault();
                step(1);
            } else if (['ArrowUp', 'PageUp'].includes(event.key) || (isSpace && event.shiftKey)) {
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
            touchStartY.current = event.touches.length === 1 ? event.touches[0].clientY : null;
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

    return { index, goTo };
}
