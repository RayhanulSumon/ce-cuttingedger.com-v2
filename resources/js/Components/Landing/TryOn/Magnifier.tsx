import React, { useCallback, useRef } from 'react';

interface MagnifierOptions {
    /** How much the lens enlarges the image. */
    zoom?: number;
    /** Lens diameter in px. */
    size?: number;
    /** Where an `object-contain` image sits inside its box vertically. */
    align?: 'center' | 'bottom';
}

/**
 * Magnifying-glass zoom: a round lens follows the pointer over an image and shows that spot enlarged.
 *
 * Put `areaHandlers` on a `position: relative` wrapper, `imageRef` on the `<img>` inside it and render
 * `<MagnifierLens lensRef={lensRef} />` as a child of the wrapper. The lens is moved by writing styles
 * directly, so tracking the pointer never re-renders React.
 */
export function useMagnifier({ zoom = 2.2, size = 190, align = 'center' }: MagnifierOptions = {}) {
    const imageRef = useRef<HTMLImageElement | null>(null);
    const lensRef = useRef<HTMLSpanElement | null>(null);

    const hide = useCallback(() => {
        if (lensRef.current) {
            lensRef.current.style.opacity = '0';
        }
    }, []);

    const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
        const image = imageRef.current;
        const lens = lensRef.current;
        if (!image || !lens || !image.naturalWidth || (event.target as HTMLElement).closest('button')) {
            hide();
            return;
        }

        // The drawn picture can be smaller than the <img> box when it is letterboxed by object-contain.
        const box = image.getBoundingClientRect();
        const fit = Math.min(box.width / image.naturalWidth, box.height / image.naturalHeight);
        const width = image.naturalWidth * fit;
        const height = image.naturalHeight * fit;
        const left = box.left + (box.width - width) / 2;
        const top = box.top + (align === 'bottom' ? box.height - height : (box.height - height) / 2);

        const x = event.clientX - left;
        const y = event.clientY - top;
        if (x < 0 || y < 0 || x > width || y > height) {
            hide();
            return;
        }

        const area = event.currentTarget.getBoundingClientRect();
        const half = size / 2;
        const source = `url("${image.currentSrc || image.src}")`;
        if (lens.style.backgroundImage !== source) {
            lens.style.backgroundImage = source;
        }
        lens.style.backgroundSize = `${(width * zoom).toFixed(1)}px ${(height * zoom).toFixed(1)}px`;
        lens.style.backgroundPosition = `${(half - x * zoom).toFixed(1)}px ${(half - y * zoom).toFixed(1)}px`;
        lens.style.transform = `translate3d(${(event.clientX - area.left - half).toFixed(1)}px,${(event.clientY - area.top - half).toFixed(1)}px,0)`;
        lens.style.width = lens.style.height = `${size}px`;
        lens.style.opacity = '1';
    };

    return {
        imageRef,
        lensRef,
        hide,
        areaHandlers: { onPointerMove, onPointerLeave: hide, onPointerCancel: hide },
    };
}

/** The lens itself. Must be a child of the element carrying the magnifier's `areaHandlers`. */
export function MagnifierLens({ lensRef }: { lensRef: React.Ref<HTMLSpanElement> }) {
    return (
        <span
            ref={lensRef}
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 z-30 rounded-full border-2 border-white bg-[#eaf1f8] bg-no-repeat opacity-0 shadow-[0_18px_44px_-14px_rgba(0,0,0,0.5)] ring-1 ring-black/10 transition-opacity duration-200 will-change-transform"
        />
    );
}
