import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronUp } from 'lucide-react';

interface ScrollToTopProps {
    /** Whether the button is shown. The parent decides, so the homepage can use its sections instead of page scroll. */
    visible: boolean;
    onClick: () => void;
}

/**
 * Small round "back to top" button that sits to the left of the chat button. It fades and slides in only once
 * there is somewhere to go back to.
 */
export function ScrollToTop({ visible, onClick }: ScrollToTopProps) {
    return (
        <AnimatePresence>
            {visible && (
                <motion.button
                    type="button"
                    onClick={onClick}
                    aria-label="Back to top"
                    title="Back to top"
                    initial={{ opacity: 0, y: 14, scale: 0.85 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 14, scale: 0.85 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="fixed bottom-5 right-[5.25rem] z-[99] grid h-11 w-11 place-items-center rounded-full border border-ink/10 bg-surface text-ink shadow-[0_10px_24px_-10px_color-mix(in_srgb,var(--color-ink)_45%,transparent)] transition-colors duration-300 hover:bg-ink hover:text-white sm:bottom-8 sm:right-[7.25rem]"
                >
                    <ChevronUp size={20} strokeWidth={2.4} />
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
