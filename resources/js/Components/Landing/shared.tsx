import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowUpRight } from 'lucide-react';

export interface SectionProps {
    active: boolean;
    goTo: (index: number) => void;
    /** Called when this section opens/closes a fullscreen overlay (e.g. the Digital Twins preset modal).
     *  Home uses this to hide SideDots and Menubar while the overlay is showing. */
    onOverlayChange?: (open: boolean) => void;
}

export const SECTIONS = [
    { id: 'hero', label: 'Home' },
    { id: 'digital-twins', label: 'Digital Twins' },
    { id: 'digital-twins-alt', label: 'Digital Twins (Centered)' },
    { id: 'digital-twins-top-center', label: 'Digital Twins (Top Center)' },
    { id: 'try-on', label: 'Virtual Try-On' },
    { id: 'try-on-alt', label: 'Virtual Try-On (Centered)' },
    { id: 'try-on-top-center', label: 'Virtual Try-On (Top Center)' },
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

/** Section title with a short description and optional actions underneath. */
export function SectionIntro({
    active,
    title,
    children,
    actions,
    align = 'left',
    className = '',
    titleClassName = 'text-section',
    bodyClassName = 'text-sm text-muted sm:text-base',
    bodyMaxWidthClassName,
    cursorFree = false,
}: {
    active: boolean;
    title: string;
    children: React.ReactNode;
    actions?: React.ReactNode;
    align?: 'left' | 'center';
    className?: string;
    titleClassName?: string;
    bodyClassName?: string;
    bodyMaxWidthClassName?: string;
    /** Marks the block so custom cursors step aside while it is hovered. */
    cursorFree?: boolean;
}) {
    const isCentered = align === 'center';
    const maxWidthClass = bodyMaxWidthClassName ?? (isCentered ? 'mx-auto max-w-[58ch]' : 'max-w-[36ch]');

    return (
        <div
            className={`${cursorFree ? 'pointer-events-auto' : ''} ${isCentered ? 'text-center' : ''} ${className}`.trim()}
            data-twin-cursor-free={cursorFree ? '' : undefined}
        >
            <Reveal active={active}>
                <h2 className={`font-display text-ink ${titleClassName}`}>
                    {title}
                </h2>
            </Reveal>
            <Reveal active={active} delay={0.1}>
                <p className={`mt-2.5 leading-[1.6] sm:mt-3 ${maxWidthClass} ${bodyClassName}`}>{children}</p>
            </Reveal>
            {actions && (
                <Reveal
                    active={active}
                    delay={0.18}
                    className={`pointer-events-auto mt-4 flex flex-wrap items-center gap-2.5 sm:mt-5 ${isCentered ? 'justify-center' : ''}`}
                >
                    {actions}
                </Reveal>
            )}
        </div>
    );
}

/** Builds the dedicated Digital Twins Order / Configurator URL. */
export function digitalTwinOrderUrl(params?: {
    mode?: 'custom' | 'preset' | 'lifetime';
    twin?: string;
    ref?: string;
}): string {
    const query = new URLSearchParams();
    if (params?.mode && params.mode !== 'custom') {
        query.set('mode', params.mode);
    }
    if (params?.twin) {
        query.set('twin', params.twin);
    }
    if (params?.ref) {
        query.set('ref', params.ref);
    }
    const qs = query.toString();
    return qs ? `/digital-twins/order?${qs}` : '/digital-twins/order';
}

/** Builds the dedicated Virtual Try-On Order URL. */
export function tryOnOrderUrl(look?: string, service?: string): string {
    const query = new URLSearchParams();
    if (look) {
        query.set('look', look);
    }
    if (service && service !== 'virtual-try-on') {
        query.set('service', service);
    }
    const qs = query.toString();
    return qs ? `/virtual-try-on/order?${qs}` : '/virtual-try-on/order';
}

/** Builds the order URL depending on the target service. */
export function orderUrl(service: string, reference?: string): string {
    if (service === 'digital-twins') {
        return digitalTwinOrderUrl({ ref: reference });
    }
    return tryOnOrderUrl(reference, service);
}

/**
 * Primary call to action, shared across landing and capability sections: a matte ember pill
 * with an arrow inside it that opens the order or inquiry flow.
 */
export function OrderCta({
    href,
    ariaLabel,
    icon,
    size = 'md',
    className = '',
    children,
}: {
    href: string;
    ariaLabel?: string;
    /** Optional icon shown before the label. */
    icon?: React.ReactNode;
    size?: 'sm' | 'md';
    className?: string;
    children: React.ReactNode;
}) {
    const sizeClasses =
        size === 'sm'
            ? 'h-9 px-4 text-xs sm:h-10 sm:px-5 sm:text-xs'
            : 'h-10 px-5 text-xs sm:h-11 sm:px-6 sm:text-sm';

    return (
        <Link
            href={href}
            prefetch
            aria-label={ariaLabel}
            className={`group inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full bg-primary font-semibold text-primary-foreground shadow-[0_10px_24px_-12px_color-mix(in_srgb,var(--color-primary)_75%,transparent)] transition-[transform,background-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-primary-hover active:translate-y-0 active:scale-[0.98] ${sizeClasses} ${className}`.trim()}
        >
            {icon && <span className="grid place-items-center">{icon}</span>}
            <span>{children}</span>
            <ArrowUpRight
                size={15}
                className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
        </Link>
    );
}

export function PillButton({
    children,
    onClick,
    href,
    variant = 'dark',
    type = 'button',
    disabled,
    className = '',
}: {
    children: React.ReactNode;
    onClick?: () => void;
    href?: string;
    variant?: 'dark' | 'outline';
    type?: 'button' | 'submit';
    disabled?: boolean;
    className?: string;
}) {
    const toneClasses =
        variant === 'dark'
            ? 'bg-ink text-surface hover:bg-ink-2 hover:shadow-[0_12px_26px_-14px_rgba(16,17,20,0.45)]'
            : 'border border-ink/20 bg-surface/85 text-ink backdrop-blur-sm hover:border-ink hover:bg-ink hover:text-surface';

    const buttonClasses =
        `group inline-flex h-10 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full px-5 text-xs font-semibold transition-[transform,background-color,color,border-color,box-shadow] duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:opacity-60 sm:h-11 sm:px-6 sm:text-sm ${toneClasses} ${className}`.trim();

    if (href) {
        return (
            <Link href={href} prefetch className={buttonClasses}>
                {children}
            </Link>
        );
    }

    return (
        <button type={type} onClick={onClick} disabled={disabled} className={buttonClasses}>
            {children}
        </button>
    );
}
