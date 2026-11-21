import { RefObject, useEffect, useState } from 'react';

/**
 * Tracks whether `ref` is within (or near) the viewport via IntersectionObserver.
 * Defaults to `false` when IntersectionObserver is available so off-screen mobile
 * sections stay idle until scrolled near.
 */
export function useInViewport(ref: RefObject<Element | null>, rootMargin = '120px'): boolean {
    const [inView, setInView] = useState<boolean>(() => typeof IntersectionObserver === 'undefined');

    useEffect(() => {
        const el = ref.current;
        if (!el || typeof IntersectionObserver === 'undefined') {
            setInView(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                setInView(entry.isIntersecting);
            },
            { rootMargin, threshold: 0.01 },
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [ref, rootMargin]);

    return inView;
}
