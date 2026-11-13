import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowUpRight, Check } from 'lucide-react';
import { capabilityIcon } from '@/Components/Common/capabilityIcons';
import { PageHero } from '@/Components/Common/PageHero';
import { SeoHead } from '@/Components/Common/SeoHead';
import { Capability, Project } from '@/types/models';

interface CapabilityShowProps {
    capability: Capability;
    related: Capability[];
    relatedProjects: Project[];
}

function pathFor(capability: Capability, parent?: Capability | null): string {
    const owner = capability.parent ?? parent;
    return owner ? `/capabilities/${owner.slug}/${capability.slug}` : `/capabilities/${capability.slug}`;
}

function BulletCard({ title, items }: { title: string; items: string[] }) {
    if (items.length === 0) {
        return null;
    }

    return (
        <div className="rounded-3xl border border-ink/10 bg-surface p-6 sm:p-8">
            <h2 className="text-xl font-extrabold tracking-[-0.02em] text-ink">{title}</h2>
            <ul className="mt-5 space-y-3">
                {items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[15px] leading-relaxed text-ink-2">
                        <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/10 text-primary-ink">
                            <Check size={12} strokeWidth={3} />
                        </span>
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
    const steps = capability.process_steps ?? [];
    const faqs = capability.faqs ?? [];
    const Icon = capabilityIcon(capability.icon);

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

            <PageHero
                eyebrow={parent ? `${parent.tag ?? parent.title} · Capability` : 'Capability'}
                title={capability.title}
                description={capability.subtitle}
                backUrl={parent ? `/capabilities/${parent.slug}` : '/capabilities'}
                backLabel={parent ? `Back to ${parent.title}` : 'All capabilities'}
            />

            <section className="bg-page py-14 sm:py-20">
                <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14">
                        <div>
                            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-ink text-white">
                                <Icon size={26} />
                            </span>
                            <p className="mt-6 max-w-2xl whitespace-pre-line text-lg leading-relaxed text-ink-2">{capability.description}</p>

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
                                    className="inline-flex items-center gap-2 rounded-full border border-ink/25 px-7 py-3.5 text-sm font-semibold text-ink transition-colors duration-300 hover:bg-ink hover:text-white"
                                >
                                    Schedule a call
                                </button>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            <BulletCard title="What you get" items={capability.features ?? []} />
                            <BulletCard title="Deliverables" items={capability.deliverables ?? []} />
                        </div>
                    </div>

                    {children.length > 0 && (
                        <div>
                            <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-ink sm:text-3xl">Specialities</h2>
                            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {children.map((child) => (
                                    <li key={child.id}>
                                        <Link
                                            href={pathFor(child, capability)}
                                            prefetch
                                            className="group flex h-full flex-col justify-between gap-6 rounded-3xl border border-ink/10 bg-surface p-6 transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-primary/50"
                                        >
                                            <span>
                                                <span className="block text-lg font-bold leading-snug text-ink">{child.title}</span>
                                                <span className="mt-2 block text-sm leading-relaxed text-muted">{child.subtitle}</span>
                                            </span>
                                            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-ink">
                                                Learn more <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {steps.length > 0 && (
                        <div>
                            <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-ink sm:text-3xl">How it works</h2>
                            <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                {steps.map((step, i) => (
                                    <li key={step.title} className="rounded-3xl border border-ink/10 bg-surface p-6">
                                        <span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-sm font-bold text-white">{i + 1}</span>
                                        <h3 className="mt-4 text-base font-bold text-ink">{step.title}</h3>
                                        <p className="mt-1.5 text-sm leading-relaxed text-muted">{step.description}</p>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    )}

                    {faqs.length > 0 && (
                        <div>
                            <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-ink sm:text-3xl">Questions</h2>
                            <div className="mt-6 grid gap-4 lg:grid-cols-2">
                                {faqs.map((faq) => (
                                    <div key={faq.question} className="rounded-3xl border border-ink/10 bg-surface p-6">
                                        <h3 className="text-base font-bold text-ink">{faq.question}</h3>
                                        <p className="mt-2 text-[15px] leading-relaxed text-muted">{faq.answer}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {relatedProjects.length > 0 && (
                        <div>
                            <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-ink sm:text-3xl">Recent work</h2>
                            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                                {relatedProjects.map((project) => (
                                    <li key={project.id}>
                                        <Link
                                            href={`/case-studies/${project.slug}`}
                                            prefetch
                                            className="group block overflow-hidden rounded-3xl border border-ink/10 bg-surface transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-primary/50"
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
                        </div>
                    )}

                    {related.length > 0 && (
                        <div>
                            <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-ink sm:text-3xl">{parent ? `More in ${parent.title}` : 'Other capabilities'}</h2>
                            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                {related.map((item) => (
                                    <li key={item.id}>
                                        <Link
                                            href={pathFor(item, parent)}
                                            prefetch
                                            className="group flex h-full flex-col rounded-3xl border border-ink/10 bg-surface p-5 transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-primary/50"
                                        >
                                            {item.tag && <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary-ink">{item.tag}</span>}
                                            <span className="mt-1 text-base font-bold leading-snug text-ink">{item.title}</span>
                                            <span className="mt-1.5 line-clamp-3 text-sm text-muted">{item.subtitle}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
