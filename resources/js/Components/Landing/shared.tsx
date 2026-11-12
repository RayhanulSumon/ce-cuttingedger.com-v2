import React from 'react';

export interface SectionProps {
    active: boolean;
    goTo: (index: number) => void;
    openDemo: () => void;
    /** Called when this section opens/closes a fullscreen overlay (e.g. the Digital Twins preset modal).
     *  Home uses this to hide SideDots and Menubar while the overlay is showing. */
    onOverlayChange?: (open: boolean) => void;
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

/** Sections with a dark background: the menubar, side dots and progress bar switch to light ink on these. */
export const DARK_SECTIONS: readonly number[] = [SECTION_INDEX['book-demo'], SECTION_INDEX.contact];

/** Length of one section change. Drives the stage keyframes, the input lock and the reveal reset. */
export const STAGE_TRANSITION_MS = 1000;

/** How far into a section change its content starts to reveal, so the motion lands with the panel. */
const REVEAL_BASE_DELAY_S = 0.42;

/** Shared gutters so every section lines up with the menubar. */
export const PAD_X = 'px-5 sm:px-10 lg:px-16';
export const PAD_Y = 'pt-20 pb-6 sm:pt-24 sm:pb-8';

export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
export const EASE_OUT_QUART = [0.22, 1, 0.36, 1] as const;

type RevealTag = 'div' | 'span' | 'p';

interface RevealProps {
    active: boolean;
    /** Extra stagger in seconds on top of the shared base delay. */
    delay?: number;
    className?: string;
    children?: React.ReactNode;
    as?: RevealTag;
    /** Horizontal start offset as a CSS length (e.g. `'1.5em'`). */
    x?: string;
    /** Vertical start offset as a CSS length. Defaults to 28px. */
    y?: string;
    /** `clip` opens the element from its centre line instead of sliding it. */
    variant?: 'slide' | 'clip';
    ref?: React.Ref<HTMLElement>;
}

/**
 * Content that replays its entrance every time its section becomes active.
 *
 * Pure CSS transitions on transform / opacity / clip-path (see `.lp-reveal` in app.css),
 * so reveals run on the compositor and stay smooth while the stage is moving.
 */
export function Reveal({
    active,
    delay = 0,
    className = '',
    children,
    as: Tag = 'div',
    x,
    y,
    variant = 'slide',
    ref,
}: RevealProps) {
    const style = {
        '--reveal-delay': `${REVEAL_BASE_DELAY_S + delay}s`,
        ...(x !== undefined ? { '--reveal-x': x } : {}),
        ...(y !== undefined ? { '--reveal-y': y } : {}),
    } as React.CSSProperties;

    return (
        <Tag
            ref={ref as React.Ref<never>}
            data-shown={active}
            className={`${variant === 'clip' ? 'lp-clip' : 'lp-reveal'} ${className}`}
            style={style}
        >
            {children}
        </Tag>
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
            className={`inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-[transform,background-color,color,box-shadow] duration-300 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 ${
                dark
                    ? 'bg-[#1b1b1b] text-white hover:shadow-[0_12px_28px_-12px_rgba(0,0,0,0.55)]'
                    : 'border border-[#1b1b1b] text-[#1b1b1b] hover:bg-[#1b1b1b] hover:text-white'
            }`}
        >
            {children}
        </button>
    );
}
