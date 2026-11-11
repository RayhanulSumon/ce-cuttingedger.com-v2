import React from 'react';
import { motion } from 'framer-motion';

export interface SectionProps {
    active: boolean;
    goTo: (index: number) => void;
    openDemo: () => void;
}

export const SECTIONS = [
    { id: 'hero', label: 'Home' },
    { id: 'digital-twins', label: 'Digital Twins' },
    { id: 'try-on', label: 'Virtual Try-On' },
    { id: 'retouching', label: 'Retouching' },
    { id: 'showcase', label: 'Showcase' },
    { id: 'clients', label: 'Clients' },
    { id: 'case-study', label: 'Case Study' },
    { id: 'book-demo', label: 'Book a Demo' },
    { id: 'faq', label: 'FAQ' },
    { id: 'contact', label: 'Contact' },
] as const;

export const SECTION_INDEX = Object.fromEntries(SECTIONS.map((s, i) => [s.id, i])) as Record<
    (typeof SECTIONS)[number]['id'],
    number
>;

/** Shared gutters so every section lines up with the menubar. */
export const PAD_X = 'px-5 sm:px-10 lg:px-16';
export const PAD_Y = 'pt-20 pb-6 sm:pt-24 sm:pb-8';

const EASE = [0.22, 1, 0.36, 1] as const;

/** Content that re-plays its entrance every time its section becomes active. */
export function Reveal({
    active,
    delay = 0,
    className = '',
    children,
}: {
    active: boolean;
    delay?: number;
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <motion.div
            className={className}
            initial={false}
            animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
            transition={{ duration: 0.8, ease: EASE, delay: active ? 0.35 + delay : 0 }}
        >
            {children}
        </motion.div>
    );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
    return (
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#3a3a3a]/70">{children}</p>
    );
}

export function PillButton({
    children,
    onClick,
    dark = true,
    type = 'button',
    disabled,
}: {
    children: React.ReactNode;
    onClick?: () => void;
    dark?: boolean;
    type?: 'button' | 'submit';
    disabled?: boolean;
}) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-transform duration-300 hover:-translate-y-0.5 disabled:opacity-60 ${
                dark ? 'bg-[#1b1b1b] text-white' : 'border border-[#1b1b1b] text-[#1b1b1b] hover:bg-[#1b1b1b] hover:text-white'
            }`}
        >
            {children}
        </button>
    );
}

