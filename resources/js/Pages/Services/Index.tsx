import React from 'react';
import { Link } from '@inertiajs/react';
import { SeoHead } from '@/Components/Common/SeoHead';
import { PageHero } from '@/Components/Common/PageHero';
import { Service } from '@/types/models';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface ServicesIndexProps {
    services: Service[];
}

export default function Index({ services = [] }: ServicesIndexProps) {
    return (
        <>
            <SeoHead
                title="Capabilities & Studio Disciplines"
                description="Explore CuttingEdger's core offerings across Product Design, Brand Architecture, Kinetic 3D, and Full-Stack Engineering."
            />

            <PageHero
                eyebrow="CAPABILITIES & DISCIPLINES"
                title="RADICAL EXECUTION ACROSS"
                highlight="EVERY DIGITAL TOUCHPOINT."
                description="We partner with founding teams and enterprise innovators to craft category-defining digital assets from zero to launch."
            />

            <section className="py-24 bg-[#0a0b0e]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
                    {services.map((service, index) => (
                        <article
                            key={service.id || service.slug}
                            className="p-8 sm:p-14 rounded-3xl bg-[#12141c] border border-white/10 hover:border-[#d4ff00]/40 transition-colors group"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                                <div className="lg:col-span-5 space-y-4">
                                    <span className="font-mono text-xs uppercase tracking-widest text-[#d4ff00]">
                                        [ DISCIPLINE 0{index + 1} ]
                                    </span>
                                    <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white leading-tight group-hover:text-[#d4ff00] transition-colors">
                                        <Link href={`/services/${service.slug}`}>
                                            {service.title}
                                        </Link>
                                    </h2>
                                    <p className="text-neutral-400 text-base leading-relaxed">
                                        {service.description}
                                    </p>

                                    <div className="pt-4">
                                        <Link
                                            href={`/services/${service.slug}`}
                                            className="inline-flex items-center gap-2 font-display font-bold text-xs uppercase tracking-widest text-black bg-[#d4ff00] hover:bg-[#c2eb00] px-6 py-3.5 rounded-full transition-colors"
                                        >
                                            <span>Explore Discipline Details</span>
                                            <ArrowUpRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>

                                <div className="lg:col-span-7 bg-white/[0.02] border border-white/5 rounded-2xl p-6 sm:p-8 space-y-6">
                                    <h3 className="font-display font-bold text-lg text-white">
                                        Key Focus & Deliverables
                                    </h3>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {service.features?.map((feat, i) => (
                                            <div key={i} className="flex items-start gap-2.5 text-sm text-neutral-300">
                                                <CheckCircle2 className="w-4 h-4 text-[#d4ff00] shrink-0 mt-0.5" />
                                                <span>{feat}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-4 border-t border-white/10">
                                        <span className="font-mono text-xs text-neutral-500 uppercase block mb-3">
                                            Handed Over Artifacts:
                                        </span>
                                        <div className="flex flex-wrap gap-2">
                                            {service.deliverables?.map((deliv, i) => (
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
                    ))}
                </div>
            </section>
        </>
    );
}
