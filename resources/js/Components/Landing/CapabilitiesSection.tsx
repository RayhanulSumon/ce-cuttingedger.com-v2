import React, { memo } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { ArrowUpRight } from 'lucide-react';
import { capabilityIcon } from '@/Components/Common/capabilityIcons';
import { PageProps } from '@/types';
import { PAD_X, Reveal, SectionProps } from './shared';

/** The main capabilities (2D, 3D, DTP, Video) as cards, each opening its own page. Content comes from the admin panel. */
export const CapabilitiesSection = memo(function CapabilitiesSection({ active, openDemo }: SectionProps) {
    const { capabilities_nav = [] } = usePage<PageProps>().props;

    return (
        <div data-scrollable className={`flex h-full w-full flex-col justify-center overflow-y-auto bg-page pb-8 pt-24 ${PAD_X}`}>
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
                            Four capabilities, many specialities. Pick one to see exactly what we deliver and how it works.
                        </p>
                    </Reveal>
                </div>
                <Reveal active={active} delay={0.16} className="flex flex-wrap items-center gap-3">
                    <Link
                        href="/capabilities"
                        prefetch
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

            <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-10 lg:grid-cols-4">
                {capabilities_nav.map((capability, i) => {
                    const Icon = capabilityIcon(capability.icon);

                    return (
                        <li key={capability.id}>
                            <Reveal active={active} delay={0.2 + i * 0.07} y="24px" className="h-full">
                                <Link
                                    href={capability.path}
                                    prefetch
                                    className="group flex h-full min-h-[260px] flex-col justify-between rounded-3xl border border-ink/10 bg-surface p-6 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_22px_40px_-24px_color-mix(in_srgb,var(--color-ink)_35%,transparent)] sm:p-7"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-ink text-white transition-[background-color,transform] duration-300 group-hover:-rotate-6 group-hover:bg-primary">
                                            <Icon size={22} />
                                        </span>
                                        <span className="grid h-9 w-9 place-items-center rounded-full bg-page text-ink transition-[background-color,color,transform] duration-300 group-hover:rotate-45 group-hover:bg-primary group-hover:text-white">
                                            <ArrowUpRight size={16} />
                                        </span>
                                    </div>

                                    <div className="mt-8">
                                        {capability.tag && (
                                            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary-ink">{capability.tag}</p>
                                        )}
                                        <h3 className="mt-1 text-xl font-extrabold leading-tight tracking-[-0.02em] text-ink sm:text-2xl">{capability.title}</h3>
                                        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{capability.subtitle}</p>

                                        {capability.children.length > 0 && (
                                            <div className="mt-4 flex flex-wrap gap-1.5">
                                                {capability.children.slice(0, 3).map((child) => (
                                                    <span key={child.id} className="rounded-full bg-page px-2.5 py-1 text-[11px] font-medium text-ink-2">
                                                        {child.title}
                                                    </span>
                                                ))}
                                                {capability.children.length > 3 && (
                                                    <span className="rounded-full bg-page px-2.5 py-1 text-[11px] font-semibold text-subtle">
                                                        +{capability.children.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            </Reveal>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
});
