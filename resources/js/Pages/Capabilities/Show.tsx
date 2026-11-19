import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowLeft, ArrowUpRight, Check } from 'lucide-react';
import { DigitalTwinsShowcase } from '@/Components/Capabilities/DigitalTwinsShowcase';
import { VirtualTryOnFittingRoom } from '@/Components/Capabilities/VirtualTryOnFittingRoom';
import { capabilityIcon } from '@/Components/Common/capabilityIcons';
import { SeoHead } from '@/Components/Common/SeoHead';
import { DigitalTwinModel } from '@/Components/Landing/DigitalTwins/twins';
import { Capability, Project } from '@/types/models';

interface CapabilityShowProps {
    capability: Capability;
    related: Capability[];
    relatedProjects: Project[];
    digitalTwins?: DigitalTwinModel[];
}

const WRAP = 'mx-auto w-full max-w-6xl px-5 sm:px-8';

function pathFor(capability: Capability, parent?: Capability | null): string {
    const owner = capability.parent ?? parent;
    return owner ? `/capabilities/${owner.slug}/${capability.slug}` : `/capabilities/${capability.slug}`;
}

function quoteUrlFor(capability: Capability): string {
    if (capability.slug === 'virtual-try-on') {
        return '/virtual-try-on/quote';
    }
    if (capability.slug === 'digital-twins') {
        return '/digital-twins/order';
    }
    return `/order?service=other&ref=${encodeURIComponent(capability.title)}`;
}

const CUSTOM_CAPABILITY_VIEWS: Record<string, (props: CapabilityShowProps & { parent: Capability | null }) => React.ReactNode> = {
    'virtual-try-on': ({ capability, parent }) => (
        <VirtualTryOnFittingRoom capability={capability} parent={parent} />
    ),
    'digital-twins': ({ capability, parent, digitalTwins }) => (
        <DigitalTwinsShowcase capability={capability} parent={parent} digitalTwins={digitalTwins} />
    ),
};

function SectionTitle({ children, hint }: { children: React.ReactNode; hint?: string }) {
    return (
        <div className="mb-5 flex items-end justify-between gap-4">
            <h2 className="text-xl font-extrabold tracking-[-0.02em] text-ink sm:text-2xl">{children}</h2>
            {hint && <span className="hidden text-xs font-medium text-subtle sm:block">{hint}</span>}
        </div>
    );
}

/** One clean visual card: cover image (or icon), title, one line, arrow. */
function CapabilityCard({ capability, href }: { capability: Capability; href: string }) {
    const Icon = capabilityIcon(capability.icon);

    return (
        <Link
            href={href}
            prefetch
            className="group flex h-full flex-col rounded-2xl border border-ink/10 bg-surface p-4 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_20px_36px_-26px_color-mix(in_srgb,var(--color-ink)_45%,transparent)]"
        >
            {capability.image ? (
                <div className="mb-4 aspect-[4/3] w-full overflow-hidden rounded-xl bg-page">
                    <img
                        src={capability.image}
                        alt={capability.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                </div>
            ) : (
                <span className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary-ink transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                    <Icon size={20} />
                </span>
            )}
            <span className="block text-[16px] font-bold leading-snug text-ink">{capability.title}</span>
            <span className="mt-1 line-clamp-2 block flex-1 text-xs leading-relaxed text-muted">{capability.subtitle}</span>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-ink">
                Explore
                <ArrowUpRight size={13} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
        </Link>
    );
}

function PillList({ title, items }: { title: string; items: string[] }) {
    return (
        <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-subtle">{title}</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
                {items.map((item) => (
                    <li
                        key={item}
                        className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-page px-3.5 py-1.5 text-xs font-semibold text-ink-2"
                    >
                        <Check size={13} strokeWidth={3} className="shrink-0 text-primary" />
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
}

/** A main capability or one of its sub-capabilities. Custom views override the layout while keeping dynamic SEO. */
export default function Show(props: CapabilityShowProps) {
    const { capability, related = [], relatedProjects = [] } = props;
    const parent = capability.parent ?? null;
    const children = capability.children ?? [];
    const features = capability.features ?? [];
    const deliverables = capability.deliverables ?? [];
    const faqs = capability.faqs ?? [];
    const label = capability.tag ?? parent?.tag ?? 'Capability';

    const breadcrumbs = [
        { name: 'Home', url: '/' },
        { name: 'Capabilities', url: '/capabilities' },
        ...(parent ? [{ name: parent.title, url: `/capabilities/${parent.slug}` }] : []),
        { name: capability.title, url: pathFor(capability) },
    ];

    const seoHead = (
        <SeoHead
            title={capability.meta_title || `${capability.title} | CuttingEdger`}
            description={capability.meta_description || capability.subtitle}
            breadcrumbs={breadcrumbs}
            serviceSchema={{ name: capability.title, description: capability.description, serviceType: capability.title }}
            faqSchema={faqs}
        />
    );

    const customView = CUSTOM_CAPABILITY_VIEWS[capability.slug]?.({ ...props, parent });
    if (customView) {
        return (
            <>
                {seoHead}
                {customView}
            </>
        );
    }

    return (
        <>
            {seoHead}

            {/* Compact visual header */}
            <header className="border-b border-ink/10 bg-page pb-6 pt-24 sm:pb-8 sm:pt-28">
                <div className={WRAP}>
                    <Link
                        href={parent ? `/capabilities/${parent.slug}` : '/capabilities'}
                        prefetch
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-subtle transition-colors hover:text-primary"
                    >
                        <ArrowLeft size={14} />
                        {parent ? parent.title : 'All capabilities'}
                    </Link>

                    <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl">
                            <span className="inline-block rounded-full bg-primary/10 px-3 py-0.5 text-[11px] font-bold uppercase tracking-[0.18em] text-primary-ink">
                                {label}
                            </span>
                            <h1 className="mt-2.5 text-[clamp(28px,4vw,46px)] font-extrabold leading-[1.06] tracking-[-0.03em] text-ink">
                                {capability.title}
                            </h1>
                            <p className="mt-2 text-base leading-relaxed text-ink-2">{capability.subtitle}</p>
                        </div>

                        <div className="flex shrink-0 flex-wrap gap-2.5">
                            <Link
                                href={quoteUrlFor(capability)}
                                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-6 py-3 text-xs font-bold text-primary-foreground shadow-[0_12px_26px_-12px_color-mix(in_srgb,var(--color-primary)_90%,transparent)] transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-primary-hover sm:text-sm"
                            >
                                Request a quote
                                <ArrowUpRight size={15} />
                            </Link>
                            <button
                                type="button"
                                onClick={() => window.dispatchEvent(new CustomEvent('ce:open-discovery-call'))}
                                className="inline-flex items-center rounded-full border border-ink/20 px-6 py-3 text-xs font-semibold text-ink transition-colors duration-300 hover:bg-ink hover:text-white sm:text-sm"
                            >
                                Schedule a call
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="space-y-12 bg-page py-10 sm:space-y-16 sm:py-14">
                {/* Specialities: visual cards for sub-capabilities */}
                {children.length > 0 && (
                    <section className={WRAP}>
                        <SectionTitle hint={`${children.length} specialities`}>Specialities</SectionTitle>
                        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {children.map((child) => (
                                <li key={child.id}>
                                    <CapabilityCard capability={child} href={pathFor(child, capability)} />
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* Visual highlight & compact feature/deliverable pills */}
                {(capability.image || features.length > 0 || deliverables.length > 0) && (
                    <section className={WRAP}>
                        <div
                            className={`grid gap-6 rounded-3xl border border-ink/10 bg-surface p-6 sm:p-8 ${
                                capability.image && (features.length > 0 || deliverables.length > 0)
                                    ? 'lg:grid-cols-[minmax(0,260px)_1fr] lg:items-center lg:gap-10'
                                    : ''
                            }`}
                        >
                            {capability.image && (
                                <div className="aspect-[3/4] w-full max-w-[260px] overflow-hidden rounded-2xl border border-ink/10 bg-page">
                                    <img
                                        src={capability.image}
                                        alt={capability.title}
                                        loading="lazy"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            )}
                            {(features.length > 0 || deliverables.length > 0) && (
                                <div className="space-y-6">
                                    {features.length > 0 && <PillList title="What you get" items={features} />}
                                    {deliverables.length > 0 && <PillList title="Deliverables" items={deliverables} />}
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* Recent work */}
                {relatedProjects.length > 0 && (
                    <section className={WRAP}>
                        <SectionTitle>Recent work</SectionTitle>
                        <ul className="grid gap-4 sm:grid-cols-2">
                            {relatedProjects.map((project) => (
                                <li key={project.id}>
                                    <Link
                                        href={`/case-studies/${project.slug}`}
                                        prefetch
                                        className="group block overflow-hidden rounded-2xl border border-ink/10 bg-surface transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-primary/40"
                                    >
                                        {project.cover_image && (
                                            <img src={project.cover_image} alt={project.title} loading="lazy" className="aspect-[16/9] w-full object-cover" />
                                        )}
                                        <span className="block p-5">
                                            <span className="block text-base font-bold text-ink">{project.title}</span>
                                            <span className="mt-1 line-clamp-2 block text-sm text-muted">{project.summary}</span>
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* Related */}
                {related.length > 0 && (
                    <section className={WRAP}>
                        <SectionTitle>{parent ? `More in ${parent.title}` : 'Other capabilities'}</SectionTitle>
                        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {related.map((item) => (
                                <li key={item.id}>
                                    <CapabilityCard capability={item} href={pathFor(item, parent)} />
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </div>
        </>
    );
}
