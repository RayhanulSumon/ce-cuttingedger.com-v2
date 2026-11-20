import React, { useMemo, useState } from 'react';
import { Link } from '@inertiajs/react';
import { ArrowUpRight } from 'lucide-react';
import {
    CapabilityCard,
    CapabilityPageHeader,
    pathForCapability,
} from '@/Components/Capabilities/CapabilityShared';
import { SeoHead } from '@/Components/Common/SeoHead';
import { PAD_X } from '@/Components/Landing/shared';
import { Capability } from '@/types/models';

interface CapabilitiesIndexProps {
    capabilities: Capability[];
}

const ALL_TAB = 'All';

/**
 * Clean minimal Capabilities catalog index with compact header, department filter tabs,
 * and uniform 4:3 visual cards matching DigitalTwinsShowcase.
 */
export default function Index({ capabilities = [] }: CapabilitiesIndexProps) {
    const [activeTab, setActiveTab] = useState<string>(ALL_TAB);

    const tabs = useMemo(() => {
        const tags = capabilities.map((main) => main.tag || main.title);
        return [ALL_TAB, ...tags];
    }, [capabilities]);

    const visibleMainCapabilities = useMemo(() => {
        if (activeTab === ALL_TAB) {
            return capabilities;
        }
        return capabilities.filter((main) => (main.tag || main.title) === activeTab);
    }, [capabilities, activeTab]);

    const totalSpecialities = useMemo(
        () => visibleMainCapabilities.reduce((sum, main) => sum + (main.children?.length ?? 0), 0),
        [visibleMainCapabilities],
    );

    return (
        <div className="min-h-screen bg-white text-ink">
            <SeoHead
                title="Capabilities: 2D, 3D, DTP and Video"
                description="Explore CuttingEdger capabilities: 2D retouching, digital twins and virtual try-on, 3D modeling and CGI, DTP and catalog layout, and video, each with its own specialities."
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: 'Capabilities', url: '/capabilities' },
                ]}
            />

            <CapabilityPageHeader
                eyebrow="2D · 3D · DTP · Video"
                title="Capabilities"
                subtitle="2D, 3D, DTP and Video production built for fashion and e-commerce catalogs."
                ctaHref="/contact"
                ctaLabel="Request a quote"
            />

            <section className={`py-6 sm:py-8 ${PAD_X}`}>
                <div className="mx-auto max-w-[1440px]">
                    {/* Under-Header Department Filter Tabs */}
                    <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
                        <div
                            role="tablist"
                            aria-label="Filter capabilities by department"
                            className="flex items-center gap-2 overflow-x-auto py-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                        >
                            {tabs.map((tab) => {
                                const isSelected = activeTab === tab;
                                return (
                                    <button
                                        key={tab}
                                        type="button"
                                        role="tab"
                                        aria-selected={isSelected}
                                        onClick={() => setActiveTab(tab)}
                                        className={`cursor-pointer whitespace-nowrap rounded-full border px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
                                            isSelected
                                                ? 'border-ink bg-ink text-white shadow-xs'
                                                : 'border-ink/15 bg-white text-subtle hover:border-primary/60 hover:text-primary'
                                        }`}
                                    >
                                        {tab}
                                    </button>
                                );
                            })}
                        </div>

                        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-subtle">
                            {totalSpecialities} {totalSpecialities === 1 ? 'speciality' : 'specialities'}
                        </span>
                    </div>

                    {/* Flat Hairline-Separated Sections Directly on bg-white */}
                    <div className="divide-y divide-ink/10">
                        {visibleMainCapabilities.map((main, idx) => {
                            const children = main.children ?? [];

                            return (
                                <section
                                    key={main.id}
                                    className={idx === 0 ? 'pb-10' : 'py-10'}
                                >
                                    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                {main.tag && (
                                                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-primary-ink">
                                                        {main.tag}
                                                    </span>
                                                )}
                                                <h2 className="text-lg font-extrabold tracking-[-0.02em] text-ink sm:text-xl">
                                                    <Link
                                                        href={`/capabilities/${main.slug}`}
                                                        prefetch
                                                        className="transition-colors hover:text-primary"
                                                    >
                                                        {main.title}
                                                    </Link>
                                                </h2>
                                            </div>
                                            <p className="mt-1 text-xs text-subtle sm:text-sm">
                                                {main.subtitle}
                                            </p>
                                        </div>

                                        <Link
                                            href={`/capabilities/${main.slug}`}
                                            prefetch
                                            className="inline-flex items-center gap-1 text-xs font-bold text-ink transition-colors hover:text-primary"
                                        >
                                            Explore {main.tag ?? main.title}
                                            <ArrowUpRight size={13} />
                                        </Link>
                                    </div>

                                    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                                        {children.map((child) => (
                                            <li key={child.id}>
                                                <CapabilityCard
                                                    capability={child}
                                                    parent={main}
                                                    href={pathForCapability(child, main)}
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
}
