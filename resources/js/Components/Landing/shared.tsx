import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowUpRight, Sparkles } from 'lucide-react';

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
    { id: 'capabilities', label: 'Capabilities' },
    { id: 'faq', label: 'FAQ' },
    { id: 'contact', label: 'Contact' },
] as const;

export const SECTION_INDEX = Object.fromEntries(SECTIONS.map((s, i) => [s.id, i])) as Record<
    (typeof SECTIONS)[number]['id'],
    number
>;

/** Sections with a dark background: the menubar, side dots and progress bar switch to light ink on these. */
export const DARK_SECTIONS: readonly number[] = [];

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
    titleClassName = 'text-[clamp(22px,2.6vw,36px)] font-normal',
    bodyClassName = 'text-sm text-subtle',
    cursorFree = false,
}: {
    active: boolean;
    title: string;
    children: React.ReactNode;
    className?: string;
    titleClassName?: string;
    bodyClassName?: string;
    /** Marks the block so custom cursors step aside while it is hovered. */
    cursorFree?: boolean;
}) {
    return (
        <div className={className} data-twin-cursor-free={cursorFree ? '' : undefined}>
            <Reveal active={active}>
                <h2 className={`font-michroma leading-[1.15] tracking-[0.14em] text-ink ${titleClassName}`}>
                    {title}
                </h2>
            </Reveal>
            <Reveal active={active} delay={0.1}>
                <p className={`mt-3 max-w-[36ch] leading-[1.6] ${bodyClassName}`}>{children}</p>
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

/**
 * Primary call to action, shared by every landing section: a solid orange pill with an arrow
 * inside it that opens the custom order form on its own page.
 */
export function OrderCta({
    href,
    ariaLabel,
    icon,
    children,
}: {
    href: string;
    ariaLabel?: string;
    /** Optional icon shown before the label. */
    icon?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <Link
            href={href}
            aria-label={ariaLabel}
            className="group relative inline-flex h-11 cursor-pointer items-center gap-2 overflow-hidden rounded-full bg-primary px-6 text-sm font-bold text-white shadow-[0_14px_30px_-14px_color-mix(in_srgb,var(--color-primary)_90%,transparent)] transition-[transform,background-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-[0_18px_36px_-12px_color-mix(in_srgb,var(--color-primary)_95%,transparent)] active:translate-y-0 active:scale-95"
        >
            <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)] opacity-0 transition-[translate,opacity] duration-700 group-hover:translate-x-[320%] group-hover:opacity-100"
            />
            {icon && <span className="relative grid place-items-center">{icon}</span>}
            <span className="relative">{children}</span>
            <ArrowUpRight size={16} className="relative transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-1" />
        </Link>
    );
}

/**
 * Bottom-left call to action shared by Digital Twins and Virtual Try-On:
 * the question sits above, the order button underneath.
 */
export function CustomOrderCta({
    active,
    href,
    question,
    buttonLabel,
    delay = 0.28,
    className = '',
}: {
    active: boolean;
    href: string;
    question: string;
    buttonLabel: string;
    delay?: number;
    className?: string;
}) {
    return (
        <div className={`absolute bottom-6 left-5 z-20 sm:bottom-10 sm:left-10 lg:left-16 ${className}`} data-twin-cursor-free>
            <Reveal active={active} delay={delay} className="flex flex-col items-start gap-2.5">
                <p className="pl-1 text-sm font-semibold leading-none text-ink sm:text-base">{question}</p>
                <OrderCta href={href} icon={<Sparkles size={16} />}>
                    {buttonLabel}
                </OrderCta>
            </Reveal>
        </div>
    );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
    return (
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-ink-2/70">{children}</p>
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
                    ? 'bg-ink text-white hover:shadow-[0_12px_28px_-12px_rgba(0,0,0,0.55)]'
                    : 'border border-ink text-ink hover:bg-ink hover:text-white'
            }`}
        >
            {children}
        </button>
    );
}
