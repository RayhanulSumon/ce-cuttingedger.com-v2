import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronUp } from 'lucide-react';

interface ScrollToTopProps {
    /** Whether the button is shown. The parent decides, so the homepage can use its sections instead of page scroll. */
    visible: boolean;
    onClick: () => void;
    /** When false, renders fixed in the corner instead of inline inside the utility dock. */
    inline?: boolean;
}

/**
 * Compact round "back to top" button that docks cleanly beside the chat launcher when visible.
 */
export function ScrollToTop({ visible, onClick, inline = true }: ScrollToTopProps) {
    return (
        <AnimatePresence>
            {visible && (
                <motion.button
                    type="button"
                    onClick={onClick}
                    aria-label="Back to top"
                    title="Back to top"
                    initial={{ opacity: 0, y: 10, scale: 0.88 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.88 }}
                    transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                    className={`${inline ? '' : 'fixed bottom-4 right-16 z-[99] sm:bottom-6 sm:right-20 '}grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-ink/15 bg-surface/90 text-ink shadow-[0_8px_20px_-10px_rgba(16,17,20,0.3)] backdrop-blur-md transition-colors duration-200 hover:border-ink hover:bg-ink hover:text-surface sm:h-10 sm:w-10`}
                >
                    <ChevronUp size={16} strokeWidth={2.2} />
                </motion.button>
            )}
        </AnimatePresence>
    );
}

/** True once the page has been scrolled down past `offset` pixels. */
export function useScrolledPast(offset = 400): boolean {
    const [scrolled, setScrolled] = React.useState(false);

    React.useEffect(() => {
        const update = () => setScrolled(window.scrollY > offset);
        update();
        window.addEventListener('scroll', update, { passive: true });
        return () => window.removeEventListener('scroll', update);
    }, [offset]);

    return scrolled;
}
