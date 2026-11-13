import React, { memo } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { ArrowUpRight } from 'lucide-react';
import { PageProps } from '@/types';
import { PAD_X, Reveal, SectionProps } from './shared';

interface ServiceCard {
    title: string;
    summary: string;
    href: string;
    tags: string[];
}

const MAX_CARDS = 5;

/** Shown only until the services have been created in the admin panel. */
const FALLBACK_CARDS: ServiceCard[] = [
    { title: 'Image Retouching', summary: 'Clean, consistent product and model retouching, delivered in 24 hours.', href: '/services', tags: [] },
    { title: 'Digital Twins', summary: 'Photoreal AI models that wear your garments in every pose.', href: '/digital-twins', tags: [] },
    { title: '3D & CGI', summary: 'Product modelling and rendering without a physical studio.', href: '/services', tags: [] },
    { title: 'Desktop Publishing', summary: 'Catalog layout, multilingual formatting and prepress.', href: '/services', tags: [] },
    { title: 'Video & Motion', summary: 'Short-form cut-downs from the same source files.', href: '/services', tags: [] },
];

/** Five service cards, each linking to that service's own page. */
export const ServicesSection = memo(function ServicesSection({ active, openDemo }: SectionProps) {
    const { services_nav = [] } = usePage<PageProps>().props;

    // Pillars first; if there are fewer than five, fill up with their sub-services.
    const fromAdmin: ServiceCard[] = [
        ...services_nav.map((pillar) => ({
            title: pillar.title,
            summary: pillar.subtitle ?? '',
            href: pillar.path,
            tags: pillar.children.slice(0, 3).map((child) => child.title),
        })),
        ...services_nav.flatMap((pillar) =>
            pillar.children.map((child) => ({
                title: child.title,
                summary: child.subtitle ?? '',
                href: child.path,
                tags: [] as string[],
            })),
        ),
    ].slice(0, MAX_CARDS);
    const cards = fromAdmin.length ? fromAdmin : FALLBACK_CARDS;

    return (
        <div
            data-scrollable
            className={`flex h-full w-full flex-col justify-center overflow-y-auto bg-page pb-8 pt-24 ${PAD_X}`}
        >
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                <div>
                    <Reveal active={active}>
                        <h2 className="text-[clamp(32px,5.4vw,76px)] font-extrabold leading-[0.95] tracking-[-0.035em] text-ink">
                            Capabilities
                            <br />
                            built for scale.
                        </h2>
                    </Reveal>
                    <Reveal active={active} delay={0.1}>
                        <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-2 sm:text-lg">
                            Pick a capability to see exactly what we deliver, how it works and what it costs.
                        </p>
                    </Reveal>
                </div>
                <Reveal active={active} delay={0.16} className="flex flex-wrap items-center gap-3">
                    <Link
                        href="/services"
                        className="rounded-full border border-ink px-6 py-3 text-sm font-semibold text-ink transition-colors duration-300 hover:bg-ink hover:text-white"
                    >
                        All capabilities
                    </Link>
                    <button
                        type="button"
                        onClick={openDemo}
                        className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5"
                    >
                        Book a Demo
                    </button>
                </Reveal>
            </div>

            <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-10 lg:grid-cols-6">
                {cards.map((card, i) => (
                    <li key={card.href + card.title} className={i < 2 ? 'lg:col-span-3' : 'lg:col-span-2'}>
                        <Reveal active={active} delay={0.2 + i * 0.07} y="24px" className="h-full">
                            <Link
                                href={card.href}
                                className="group flex h-full min-h-[180px] flex-col justify-between rounded-3xl border border-ink/10 bg-white p-6 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_22px_40px_-24px_color-mix(in_srgb,var(--color-ink)_35%,transparent)] sm:p-7"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <h3 className="text-xl font-extrabold leading-tight tracking-[-0.02em] text-ink sm:text-2xl">
                                        {card.title}
                                    </h3>
                                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink text-white transition-[background-color,transform] duration-300 group-hover:rotate-45 group-hover:bg-primary">
                                        <ArrowUpRight size={18} />
                                    </span>
                                </div>
                                <div className="mt-6">
                                    {card.summary && (
                                        <p className="line-clamp-3 text-sm leading-relaxed text-muted">{card.summary}</p>
                                    )}
                                    {card.tags.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-1.5">
                                            {card.tags.map((tag) => (
                                                <span key={tag} className="rounded-full bg-page px-2.5 py-1 text-[11px] font-medium text-ink-2">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </Link>
                        </Reveal>
                    </li>
                ))}
            </ul>
        </div>
    );
});
