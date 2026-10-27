import { useEffect } from 'react';
import Lenis from 'lenis';
import { router } from '@inertiajs/react';

// Singleton instance to prevent duplicate loops and memory churn on page transitions
let globalLenis: Lenis | null = null;

export function getLenis(): Lenis | null {
    return globalLenis;
}

export function useSmoothScroll() {
    useEffect(() => {
        // Respect prefers-reduced-motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            return;
        }

        // Initialize single global Lenis instance
        if (!globalLenis) {
            globalLenis = new Lenis({
                lerp: 0.1, // Silky organic fluid inertia without lag
                wheelMultiplier: 1.0, // Natural 1:1 mouse wheel response
                touchMultiplier: 1.0, // Natural 1:1 touch/trackpad response
                autoRaf: true, // Let Lenis manage its synchronized high-precision RAF loop
                autoResize: true,
            });

            // Expose globally for smooth scrollTo triggers (anchor links, top buttons)
            if (typeof window !== 'undefined') {
                (window as any).lenis = globalLenis;
            }
        }

        // Reset scroll position cleanly on Inertia page transitions
        const removeNavigateListener = router.on('navigate', () => {
            globalLenis?.scrollTo(0, { immediate: true });
        });

        return () => {
            removeNavigateListener();
        };
    }, []);
}
