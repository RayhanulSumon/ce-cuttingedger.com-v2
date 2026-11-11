import { useEffect, useRef } from 'react';

/**
 * Calls `onTick` every `intervalMs` while `enabled`, honouring reduced-motion.
 */
export function useAutoplay(onTick: () => void, enabled: boolean, intervalMs = 3200): void {
    const tick = useRef(onTick);
    tick.current = onTick;

    useEffect(() => {
        if (!enabled || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }
        const id = window.setInterval(() => tick.current(), intervalMs);
        return () => window.clearInterval(id);
    }, [enabled, intervalMs]);
}

