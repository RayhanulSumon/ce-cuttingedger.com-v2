import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowLeft, ArrowUpRight, Check, Plus } from 'lucide-react';
import { capabilityIcon } from '@/Components/Common/capabilityIcons';
import { SeoHead } from '@/Components/Common/SeoHead';
import { Capability, Project } from '@/types/models';

interface CapabilityShowProps {
    capability: Capability;
    related: Capability[];
    relatedProjects: Project[];
}

const WRAP = 'mx-auto w-full max-w-6xl px-5 sm:px-8';

function pathFor(capability: Capability, parent?: Capability | null): string {
    const owner = capability.parent ?? parent;
    return owner ? `/capabilities/${owner.slug}/${capability.slug}` : `/capabilities/${capability.slug}`;
}

function SectionTitle({ children, hint }: { children: React.ReactNode; hint?: string }) {
    return (
        <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-ink sm:text-[28px]">{children}</h2>
            {hint && <span className="hidden text-sm text-subtle sm:block">{hint}</span>}
        </div>
    );
}

/** One clean card: icon, title, one line, arrow. Used for sub-capabilities and related links. */
function CapabilityCard({ capability, href }: { capability: Capability; href: string }) {
    const Icon = capabilityIcon(capability.icon);

    return (
        <Link
            href={href}
            prefetch
            className="group flex h-full flex-col rounded-2xl border border-ink/10 bg-surface p-5 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_20px_36px_-26px_color-mix(in_srgb,var(--color-ink)_45%,transparent)]"
        >
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary-ink transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                <Icon size={20} />
            </span>
            <span className="mt-5 block text-[17px] font-bold leading-snug text-ink">{capability.title}</span>
            <span className="mt-1.5 line-clamp-2 block flex-1 text-sm leading-relaxed text-muted">{capability.subtitle}</span>
            <span className="mt-5 inline-flex items-center gap-1 text-[13px] font-semibold text-ink">
                Learn more
                <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
        </Link>
    );
}

function CheckList({ title, items }: { title: string; items: string[] }) {
    return (
        <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-subtle">{title}</h3>
            <ul className="mt-4 space-y-3">
                {items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[15px] leading-snug text-ink-2">
                        <Check size={16} strokeWidth={3} className="mt-0.5 shrink-0 text-primary" />
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
}

/** A main capability or one of its sub-capabilities. Everything shown here is edited in the admin panel. */
export default function Show({ capability, related = [], relatedProjects = [] }: CapabilityShowProps) {
    const parent = capability.parent ?? null;
    const children = capability.children ?? [];
    const features = capability.features ?? [];
    const deliverables = capability.deliverables ?? [];
    const steps = capability.process_steps ?? [];
    const faqs = capability.faqs ?? [];
    const label = capability.tag ?? parent?.tag ?? 'Capability';

    const breadcrumbs = [
        { name: 'Home', url: '/' },
        { name: 'Capabilities', url: '/capabilities' },
        ...(parent ? [{ name: parent.title, url: `/capabilities/${parent.slug}` }] : []),
        { name: capability.title, url: pathFor(capability) },
    ];

    return (
        <>
            <SeoHead
                title={capability.meta_title || `${capability.title} | CuttingEdger`}
                description={capability.meta_description || capability.subtitle}
                breadcrumbs={breadcrumbs}
                serviceSchema={{ name: capability.title, description: capability.description, serviceType: capability.title }}
                faqSchema={faqs}
            />

            {/* Hero */}
            <header className="border-b border-ink/10 bg-page pb-14 pt-36 sm:pb-20 sm:pt-44">
                <div className={WRAP}>
                    <Link
                        href={parent ? `/capabilities/${parent.slug}` : '/capabilities'}
                        prefetch
                        className="inline-flex items-center gap-2 text-sm font-medium text-subtle transition-colors hover:text-primary"
                    >
                        <ArrowLeft size={15} />
                        {parent ? parent.title : 'All capabilities'}
                    </Link>

                    <div className="mt-8 max-w-3xl">
                        <span className="inline-block rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.18em] text-primary-ink">
                            {label}
                        </span>
                        <h1 className="mt-5 text-[clamp(34px,5.4vw,64px)] font-extrabold leading-[1.04] tracking-[-0.035em] text-ink">{capability.title}</h1>
                        <p className="mt-5 text-lg leading-relaxed text-ink-2 sm:text-xl">{capability.subtitle}</p>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link
                            href={`/order?service=other&ref=${encodeURIComponent(capability.title)}`}
                            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground shadow-[0_14px_30px_-14px_color-mix(in_srgb,var(--color-primary)_90%,transparent)] transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-primary-hover"
                        >
                            Request a quote
                            <ArrowUpRight size={16} />
                        </Link>
                        <button
                            type="button"
                            onClick={() => window.dispatchEvent(new CustomEvent('ce:open-discovery-call'))}
                            className="inline-flex items-center rounded-full border border-ink/20 px-7 py-3.5 text-sm font-semibold text-ink transition-colors duration-300 hover:bg-ink hover:text-white"
                        >
                            Schedule a call
                        </button>
                    </div>
                </div>
            </header>

            <div className="space-y-16 bg-page py-14 sm:space-y-24 sm:py-20">
                {/* Specialities: the main content of a main capability */}
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

                {/* Overview */}
                <section className={WRAP}>
                    <div className="grid gap-10 rounded-3xl border border-ink/10 bg-surface p-7 sm:p-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
                        <div>
                            <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-ink sm:text-[28px]">Overview</h2>
                            <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-muted sm:text-[17px]">{capability.description}</p>
                        </div>
                        {(features.length > 0 || deliverables.length > 0) && (
                            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-1 lg:gap-10">
                                {features.length > 0 && <CheckList title="What you get" items={features} />}
                                {deliverables.length > 0 && <CheckList title="Deliverables" items={deliverables} />}
                            </div>
                        )}
                    </div>
                </section>

                {/* Process */}
                {steps.length > 0 && (
                    <section className={WRAP}>
                        <SectionTitle>How it works</SectionTitle>
                        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {steps.map((step, i) => (
                                <li key={step.title} className="rounded-2xl border border-ink/10 bg-surface p-5">
                                    <span className="text-3xl font-extrabold tracking-[-0.03em] text-primary/90">{i + 1}</span>
                                    <h3 className="mt-3 text-base font-bold text-ink">{step.title}</h3>
                                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{step.description}</p>
                                </li>
                            ))}
                        </ol>
                    </section>
                )}

                {/* Questions */}
                {faqs.length > 0 && (
                    <section className={`${WRAP} max-w-4xl`}>
                        <SectionTitle>Questions</SectionTitle>
                        <div className="space-y-3">
                            {faqs.map((faq, i) => (
                                <details key={faq.question} open={i === 0} className="group rounded-2xl border border-ink/10 bg-surface px-6 py-4 open:border-primary/40">
                                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-bold text-ink [&::-webkit-details-marker]:hidden">
                                        {faq.question}
                                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-page text-ink transition-[transform,background-color,color] duration-300 group-open:rotate-45 group-open:bg-primary group-open:text-white">
                                            <Plus size={15} />
                                        </span>
                                    </summary>
                                    <p className="pb-2 pt-3 text-[15px] leading-relaxed text-muted">{faq.answer}</p>
                                </details>
                            ))}
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
