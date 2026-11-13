import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronUp } from 'lucide-react';

interface ScrollToTopProps {
    /** Whether the button is shown. The parent decides, so the homepage can use its sections instead of page scroll. */
    visible: boolean;
    onClick: () => void;
}

/**
 * Small round "back to top" button that sits just above the chat button. It fades and slides in only once
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
                    className="fixed bottom-[5rem] right-7 z-[99] grid h-8 w-8 place-items-center rounded-full bg-ink/55 text-white backdrop-blur-sm transition-colors duration-300 hover:bg-ink sm:bottom-[6rem] sm:right-[3.1rem]"
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
