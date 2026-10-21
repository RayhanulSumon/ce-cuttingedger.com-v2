import React from 'react';
import { Link } from '@inertiajs/react';
import { SeoHead } from '@/Components/Common/SeoHead';
import { PageHero } from '@/Components/Common/PageHero';
import { Service, Project } from '@/types/models';
import { ArrowUpRight, Check, ArrowRight } from 'lucide-react';
import { Button } from '@/Components/ui/button';

interface ServiceShowProps {
    service: Service;
    otherServices: Service[];
    relatedProjects: Project[];
}

export default function Show({
    service,
    otherServices = [],
    relatedProjects = [],
}: ServiceShowProps) {
    return (
        <>
            <SeoHead
                title={`${service.title} — Capabilities`}
                description={service.subtitle}
            />

            <PageHero
                eyebrow={`CAPABILITIES // ${service.marquee_label}`}
                title={service.title}
                description={service.subtitle}
                backUrl="/services"
                backLabel="All Disciplines"
            />

            {/* Overview & Deliverables Deep Dive */}
            <section className="py-24 bg-[#0c0d12] border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        <div className="lg:col-span-7 space-y-6">
                            <span className="font-mono text-xs uppercase tracking-widest text-[#d4ff00]">
                                [ DISCIPLINE OVERVIEW ]
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
                                Built for market leaders who demand precision.
                            </h2>
                            <p className="text-neutral-300 text-lg leading-relaxed">
                                {service.description}
                            </p>

                            <div className="pt-6 space-y-4">
                                <h3 className="font-display font-bold text-xl text-white">
                                    Strategic Pillars & Principles
                                </h3>
                                <div className="space-y-3">
                                    {service.features?.map((feat, i) => (
                                        <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                            <div className="w-5 h-5 rounded-full bg-[#d4ff00]/10 border border-[#d4ff00] text-black flex items-center justify-center shrink-0 mt-0.5">
                                                <Check className="w-3 h-3 text-[#d4ff00]" />
                                            </div>
                                            <span className="text-neutral-200 text-sm font-medium">{feat}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Sidebar: Deliverables & Quick Commission CTA */}
                        <div className="lg:col-span-5 space-y-8">
                            <div className="p-8 rounded-3xl bg-[#12141c] border border-white/10 space-y-6">
                                <h3 className="font-display font-bold text-xl text-white">
                                    What We Hand Over
                                </h3>
                                <ul className="space-y-3">
                                    {service.deliverables?.map((deliv, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-neutral-300 font-mono">
                                            <span className="text-[#d4ff00]">→</span>
                                            <span>{deliv}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="pt-6 border-t border-white/10">
                                    <Link
                                        href="/contact"
                                        className="w-full bg-[#d4ff00] text-black font-display font-bold text-sm tracking-wider uppercase py-4 px-6 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#c2eb00] transition-colors"
                                    >
                                        <span>Commission This Discipline</span>
                                        <ArrowUpRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>

                            {/* Other Disciplines Quick Navigation */}
                            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                                <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 block mb-3">
                                    Explore Other Disciplines
                                </span>
                                <div className="space-y-2">
                                    {otherServices.map((s) => (
                                        <Link
                                            key={s.id}
                                            href={`/services/${s.slug}`}
                                            className="flex items-center justify-between p-2.5 rounded-lg hover:bg-white/5 text-sm text-neutral-300 hover:text-[#d4ff00] transition-colors"
                                        >
                                            <span>{s.title}</span>
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
