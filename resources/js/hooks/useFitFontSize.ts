import React, { useLayoutEffect, useState } from 'react';

/**
 * Largest font size (px) at which the measured words plus `extraEm` of fixed-em items
 * fill the container's parent width, capped by `maxPx`. Re-fits on resize and once fonts load.
 *
 * Pass a word ref more than once to reserve its width several times.
 */
export function useFitFontSize(
    container: React.RefObject<HTMLElement | null>,
    words: React.RefObject<HTMLElement | null>[],
    extraEm: number,
    maxPx: () => number,
): number | null {
    const [size, setSize] = useState<number | null>(null);

    useLayoutEffect(() => {
        const fit = () => {
            const box = container.current;
            if (!box) {
                return;
            }
            const current = parseFloat(getComputedStyle(box).fontSize);
            const wordsPx = words.reduce((sum, ref) => sum + (ref.current?.offsetWidth ?? 0), 0);
            if (!current || !wordsPx) {
                return;
            }
            const totalEm = wordsPx / current + extraEm;
            const available = (box.parentElement ?? box).clientWidth;
            setSize(Math.min((available / totalEm) * 0.985, maxPx()));
        };

        fit();
        const observer = new ResizeObserver(fit);
        if (container.current?.parentElement) {
            observer.observe(container.current.parentElement);
        }
        document.fonts?.ready.then(fit);
        return () => observer.disconnect();
        // Refs and callbacks are stable for the lifetime of the caller.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return size;
}
