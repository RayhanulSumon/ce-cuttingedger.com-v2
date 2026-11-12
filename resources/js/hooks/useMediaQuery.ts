import { useEffect, useState } from 'react';

/**
 * Tracks a CSS media query. Returns `null` until mounted so server and first client render agree.
 */
export function useMediaQuery(query: string): boolean | null {
    const [matches, setMatches] = useState<boolean | null>(null);

    useEffect(() => {
        const media = window.matchMedia(query);
        const update = () => setMatches(media.matches);
        update();
        media.addEventListener('change', update);
        return () => media.removeEventListener('change', update);
    }, [query]);

    return matches;
}
