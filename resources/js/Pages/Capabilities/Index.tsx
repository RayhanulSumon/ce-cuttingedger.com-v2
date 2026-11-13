import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowUpRight } from 'lucide-react';
import { capabilityIcon } from '@/Components/Common/capabilityIcons';
import { PageHero } from '@/Components/Common/PageHero';
import { SeoHead } from '@/Components/Common/SeoHead';
import { Capability } from '@/types/models';

interface CapabilitiesIndexProps {
    capabilities: Capability[];
}

/** Every main capability with its sub-capabilities. All content is managed in the admin panel. */
export default function Index({ capabilities = [] }: CapabilitiesIndexProps) {
    return (
        <>
            <SeoHead
                title="Capabilities: 2D, 3D, DTP and Video"
                description="Explore CuttingEdger capabilities: 2D retouching, 3D and digital twins, DTP and catalog layout, and video, each with its own specialities."
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: 'Capabilities', url: '/capabilities' },
                ]}
            />

            <PageHero
                eyebrow="Capabilities"
                title="Four capabilities."
                highlight="One connected studio."
                description="2D, 3D, DTP and Video, each with the specialities your catalog and campaigns need. Pick one to see what we deliver and how it works."
            />

            <section className="bg-page py-16 sm:py-20">
                <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
                    {capabilities.map((capability) => {
                        const Icon = capabilityIcon(capability.icon);
                        const children = capability.children ?? [];

                        return (
                            <article key={capability.id} className="rounded-3xl border border-ink/10 bg-surface p-6 sm:p-10">
                                <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
                                    <div>
                                        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-ink text-white">
                                            <Icon size={26} />
                                        </span>
                                        {capability.tag && (
                                            <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.22em] text-primary-ink">{capability.tag}</p>
                                        )}
                                        <h2 className="mt-1 text-3xl font-extrabold leading-tight tracking-[-0.03em] text-ink sm:text-4xl">
                                            <Link href={`/capabilities/${capability.slug}`} prefetch className="transition-colors hover:text-primary">
                                                {capability.title}
                                            </Link>
                                        </h2>
                                        <p className="mt-3 max-w-xl text-base leading-relaxed text-ink-2">{capability.subtitle}</p>
                                        <Link
                                            href={`/capabilities/${capability.slug}`}
                                            prefetch
                                            className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-primary"
                                        >
                                            Explore {capability.tag ?? capability.title}
                                            <ArrowUpRight size={16} />
                                        </Link>
                                    </div>

                                    <ul className="grid gap-3 sm:grid-cols-2">
                                        {children.map((child) => (
                                            <li key={child.id}>
                                                <Link
                                                    href={`/capabilities/${capability.slug}/${child.slug}`}
                                                    prefetch
                                                    className="group flex h-full items-start gap-3 rounded-2xl border border-ink/10 bg-page p-4 transition-[transform,border-color,background-color] duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-surface"
                                                >
                                                    <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-surface text-primary-ink transition-colors group-hover:bg-primary group-hover:text-white">
                                                        {React.createElement(capabilityIcon(child.icon), { size: 17 })}
                                                    </span>
                                                    <span className="min-w-0">
                                                        <span className="block text-sm font-bold leading-snug text-ink">{child.title}</span>
                                                        <span className="mt-0.5 line-clamp-2 block text-[12.5px] leading-snug text-muted">{child.subtitle}</span>
                                                    </span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </section>
        </>
    );
}
