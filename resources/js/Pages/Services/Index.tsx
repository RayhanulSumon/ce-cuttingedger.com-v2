import React from 'react';
import { Link } from '@inertiajs/react';
import { SeoHead } from '@/Components/Common/SeoHead';
import { PageHero } from '@/Components/Common/PageHero';
import { Service } from '@/types/models';
import { ArrowUpRight, CheckCircle2, Sparkles, Layers, ArrowRight } from 'lucide-react';

interface ServicesIndexProps {
    pillars?: (Service & { children?: Service[] })[];
    services: Service[];
}

export default function Index({ pillars = [], services = [] }: ServicesIndexProps) {
    const displayPillars = pillars.length > 0
        ? pillars
        : services.filter((s) => !s.parent_id);

    return (
        <>
            <SeoHead
                title="Service Pillars & Visual Production Disciplines"
                description="Explore Cutting Edger's core offerings: E-Commerce Catalog Optimization, Color Standardization, White-Label Agency Extension, and Virtual 3D CGI Production."
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: 'Services', url: '/services' },
                ]}
            />

            <PageHero
                eyebrow="CAPABILITIES & SERVICE PILLARS"
                title="AI-DRIVEN VISUAL PERFORMANCE"
                highlight="AT ENTERPRISE SCALE."
                description="Turn raw studio photography and CAD engineering blueprints into marketplace-converting visual assets across hundreds of thousands of SKUs."
            />

            <section className="py-24 bg-[#0a0b0e]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
                    {displayPillars.map((pillar, index) => {
                        const pillarHref = `/services/${pillar.slug}`;

                        return (
                            <article
                                key={pillar.id || pillar.slug}
                                className="p-8 sm:p-14 rounded-3xl bg-[#12141c] border border-white/10 hover:border-accent/40 transition-all group shadow-2xl relative overflow-hidden"
                            >
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                                    {/* Left Column: Pillar Title & Summary */}
                                    <div className="lg:col-span-6 space-y-5">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-xs uppercase tracking-widest text-accent font-bold">
                                                [ PILLAR 0{index + 1} ]
                                            </span>
                                            {pillar.children && pillar.children.length > 0 && (
                                                <span className="text-[11px] font-mono text-neutral-400 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
                                                    {pillar.children.length} Specialized Sub-Services
                                                </span>
                                            )}
                                        </div>

                                        <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white leading-tight group-hover:text-accent transition-colors">
                                            <Link href={pillarHref}>
                                                {pillar.title}
                                            </Link>
                                        </h2>

                                        <p className="text-neutral-300 text-base leading-relaxed">
                                            {pillar.description}
                                        </p>

                                        {/* Child Sub-Services Quick Access if any */}
                                        {pillar.children && pillar.children.length > 0 && (
                                            <div className="pt-2 space-y-2.5">
                                                <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block font-bold">
                                                    Specialized Sub-Page Disciplines:
                                                </span>
                                                <div className="flex flex-wrap gap-2">
                                                    {pillar.children.map((child) => (
                                                        <Link
                                                            key={child.id || child.slug}
                                                            href={`/services/${pillar.slug}/${child.slug}`}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-accent hover:text-black border border-white/10 text-xs font-mono transition-all text-neutral-200"
                                                        >
                                                            <span>{child.title}</span>
                                                            <ArrowUpRight className="w-3 h-3" />
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="pt-4 flex items-center gap-4">
                                            <Link
                                                href={pillarHref}
                                                className="inline-flex items-center gap-2 font-display font-bold text-xs uppercase tracking-widest text-black bg-accent hover:bg-accent-hover px-6 py-3.5 rounded-full transition-colors shadow-lg"
                                            >
                                                <span>Explore Pillar Architecture</span>
                                                <ArrowUpRight className="w-4 h-4" />
                                            </Link>
                                            <Link
                                                href="/#free-trial"
                                                className="inline-flex items-center gap-2 font-mono text-xs text-neutral-400 hover:text-white transition-colors"
                                            >
                                                <span>Test 3 Free Assets</span>
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Right Column: Key Focus & Deliverables */}
                                    <div className="lg:col-span-6 bg-white/[0.02] border border-white/5 rounded-2xl p-6 sm:p-8 space-y-6">
                                        <h3 className="font-display font-bold text-lg text-white">
                                            Strategic Capabilities & SLA Standards
                                        </h3>

                                        <div className="space-y-3">
                                            {pillar.features?.map((feat, i) => (
                                                <div key={i} className="flex items-start gap-2.5 text-sm text-neutral-300">
                                                    <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                                                    <span>{feat}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="pt-4 border-t border-white/10">
                                            <span className="font-mono text-xs text-neutral-400 uppercase block mb-3 font-bold">
                                                Standard Handover Deliverables:
                                            </span>
                                            <div className="flex flex-wrap gap-2">
                                                {pillar.deliverables?.map((deliv, i) => (
                                                    <span
                                                        key={i}
                                                        className="text-xs font-mono text-neutral-300 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10"
                                                    >
                                                        {deliv}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </section>
        </>
    );
}
