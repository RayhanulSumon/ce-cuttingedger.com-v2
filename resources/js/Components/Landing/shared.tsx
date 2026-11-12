import React from 'react';
import { Link } from '@inertiajs/react';
import { WandSparkles } from 'lucide-react';

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

/** Section title with a short description underneath. Shared by the Digital Twins and Try-On sections. */
export function SectionIntro({
    active,
    title,
    children,
    className = '',
}: {
    active: boolean;
    title: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={className}>
            <Reveal active={active}>
                <h2 className="font-michroma text-[clamp(22px,2.6vw,36px)] font-normal leading-[1.15] tracking-[0.14em] text-[#16191f]">
                    {title}
                </h2>
            </Reveal>
            <Reveal active={active} delay={0.1}>
                <p className="mt-3 max-w-[36ch] text-sm leading-[1.6] text-[#5d6572]">{children}</p>
            </Reveal>
        </div>
    );
}

/** Builds the custom order page URL, pre-filled with what the visitor was looking at. */
export function orderUrl(service: string, reference?: string): string {
    const query = new URLSearchParams({ service });
    if (reference) {
        query.set('ref', reference);
    }
    return `/order?${query.toString()}`;
}

/** Black, gold-rimmed call to action that opens the custom order form on its own page. */
export function OrderCta({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="group inline-flex items-center gap-2.5 rounded-xl border border-[#e9b949] bg-[#0b0b0b] h-11 px-6 text-base font-medium text-white shadow-[0_16px_34px_-16px_rgba(11,11,11,0.75)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:border-[#f7d27a] hover:shadow-[0_18px_38px_-14px_rgba(233,185,73,0.55)] active:translate-y-0"
        >
            <WandSparkles size={19} className="text-[#e9b949] transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110" />
            {children}
        </Link>
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
