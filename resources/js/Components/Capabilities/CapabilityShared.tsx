import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { OrderCta, PAD_X } from '@/Components/Landing/shared';
import { Capability } from '@/types/models';
import { getCapabilityCoverImage } from './capabilityVisualConfig';

export function pathForCapability(capability: Capability, parent?: Capability['parent'] | Capability | null): string {
    if (capability.path) {
        return capability.path;
    }
    const owner = capability.parent ?? parent;
    return owner ? `/capabilities/${owner.slug}/${capability.slug}` : `/capabilities/${capability.slug}`;
}

export function quoteUrlForCapability(capability: Capability, parent?: Capability['parent'] | Capability | null): string {
    if (capability.slug === 'virtual-try-on') {
        return '/virtual-try-on/order';
    }
    if (capability.slug === 'digital-twins') {
        return '/digital-twins/order';
    }
    const service = parent?.title ?? capability.parent?.title ?? capability.title;
    return `/contact?service=${encodeURIComponent(service)}&capability=${encodeURIComponent(capability.title)}`;
}

interface CapabilityPageHeaderProps {
    backHref?: string;
    backLabel?: string;
    eyebrow?: string;
    title: string;
    subtitle?: string;
    ctaHref: string;
    ctaLabel?: string;
}

/**
 * Shared compact top header across all capability pages, aligned with DigitalTwinsShowcase.
 */
export function CapabilityPageHeader({
    backHref,
    backLabel,
    eyebrow,
    title,
    subtitle,
    ctaHref,
    ctaLabel = 'Request a quote',
}: CapabilityPageHeaderProps) {
    return (
        <header className={`border-b border-ink/10 bg-surface pb-6 pt-20 sm:pb-7 sm:pt-24 ${PAD_X}`}>
            <div className="mx-auto flex max-w-[1440px] flex-wrap items-end justify-between gap-4">
                <div>
                    {backHref && backLabel ? (
                        <Link
                            href={backHref}
                            prefetch
                            className="mb-2 inline-flex items-center gap-1.5 text-xs font-medium text-subtle transition-colors hover:text-primary"
                        >
                            <ArrowLeft size={13} />
                            {backLabel}
                        </Link>
                    ) : (
                        eyebrow && (
                            <p className="mb-1.5 text-2xs font-bold uppercase tracking-[0.2em] text-primary-ink">
                                {eyebrow}
                            </p>
                        )
                    )}

                    <h1 className="text-[clamp(24px,2.8vw,38px)] font-extrabold leading-[1.08] tracking-[-0.03em] text-ink">
                        {title}
                    </h1>

                    {subtitle && (
                        <p className="mt-1.5 max-w-2xl text-sm text-subtle">
                            {subtitle}
                        </p>
                    )}
                </div>

                <OrderCta href={ctaHref}>{ctaLabel}</OrderCta>
            </div>
        </header>
    );
}

/**
 * Uniform minimalist capability card with clean 4:3 studio image and 2-line footer.
 */
export function CapabilityCard({
    capability,
    parent,
    href,
}: {
    capability: Capability;
    parent?: Capability | null;
    href: string;
}) {
    const coverImage = getCapabilityCoverImage(capability, parent);

    return (
        <Link
            href={href}
            prefetch
            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink/10 bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_14px_34px_-18px_color-mix(in_srgb,var(--color-ink)_25%,transparent)]"
        >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-2">
                <img
                    src={coverImage}
                    alt={capability.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <span className="absolute right-2.5 top-2.5 grid h-7 w-7 place-items-center rounded-full bg-surface/95 text-ink opacity-0 shadow-xs transition-all duration-200 group-hover:bg-primary group-hover:text-primary-foreground group-hover:opacity-100">
                    <ArrowUpRight size={13} />
                </span>
            </div>

            <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-4">
                <div>
                    {capability.tag && (
                        <span className="mb-1 inline-block text-2xs font-semibold uppercase tracking-wider text-primary">
                            {capability.tag}
                        </span>
                    )}
                    <h3 className="text-sm font-bold text-ink transition-colors group-hover:text-primary sm:text-base">
                        {capability.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-subtle">
                        {capability.subtitle}
                    </p>
                </div>
            </div>
        </Link>
    );
}
