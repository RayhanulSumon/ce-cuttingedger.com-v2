import React, { useLayoutEffect, useState } from 'react';

/**
 * Largest font size (px) at which the measured words plus `extraEm` of fixed-em items
 * fill the container's parent width, capped by `maxPx`. Re-fits on resize and once fonts load.
 *
 * Pass a word ref more than once to reserve its width several times.
 *
 * Applying the result changes the container's height, which re-triggers the ResizeObserver.
 * The fit therefore only re-runs when one of its inputs (available width, cap) actually
 * changed — otherwise sub-pixel measuring differences keep nudging the size back and forth
 * forever and the text visibly shakes.
 */
export function useFitFontSize(
    container: React.RefObject<HTMLElement | null>,
    words: React.RefObject<HTMLElement | null>[],
    extraEm: number,
    maxPx: () => number,
): number | null {
    const [size, setSize] = useState<number | null>(null);

    useLayoutEffect(() => {
        let fittedFor = '';

        const fit = (force = false) => {
            const box = container.current;
            if (!box) {
                return;
            }
            const available = (box.parentElement ?? box).clientWidth;
            const cap = maxPx();
            const inputs = `${available}|${cap}`;
            if (!force && inputs === fittedFor) {
                return;
            }

            const current = parseFloat(getComputedStyle(box).fontSize);
            const wordsPx = words.reduce((sum, ref) => sum + (ref.current?.getBoundingClientRect().width ?? 0), 0);
            if (!current || !wordsPx) {
                return;
            }
            fittedFor = inputs;
            const totalEm = wordsPx / current + extraEm;
            setSize(Math.round(Math.min((available / totalEm) * 0.985, cap) * 100) / 100);
        };

        fit();
        const refit = () => fit();
        const observer = new ResizeObserver(refit);
        if (container.current?.parentElement) {
            observer.observe(container.current.parentElement);
        }
        window.addEventListener('resize', refit);
        // Word widths change once the web font replaces the fallback, so measure again.
        document.fonts?.ready.then(() => fit(true));
        return () => {
            observer.disconnect();
            window.removeEventListener('resize', refit);
        };
        // Refs and callbacks are stable for the lifetime of the caller.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return size;
}
