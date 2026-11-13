import React from 'react';
import { Link } from '@inertiajs/react';
import { SeoHead } from '@/Components/Common/SeoHead';
import { PageHero } from '@/Components/Common/PageHero';
import { TeamMember } from '@/types/models';
import { ArrowUpRight, ShieldCheck, Zap, Sparkles, Compass } from 'lucide-react';

interface AboutProps {
    leadership: TeamMember[];
}

export default function About({ leadership = [] }: AboutProps) {
    const pillars = [
        {
            icon: Sparkles,
            title: 'Radical Craft',
            description: 'We reject generic design templates. Every project begins with a blank slate, bespoke typographic explorations, and sculptural spatial design.',
        },
        {
            icon: Zap,
            title: 'Microsecond Velocity',
            description: 'Beauty without speed is a failure. We engineer hyper-optimized code architectures that deliver sub-second global responses and zero layout shifts.',
        },
        {
            icon: Compass,
            title: 'Unapologetic Character',
            description: 'In an internet saturated with safe gray software, distinct brand personality is the only moat that compounds over decades.',
        },
        {
            icon: ShieldCheck,
            title: 'Military-Grade Engineering',
            description: 'Behind the kinetic art is rigorous full-stack architecture, comprehensive automated test coverage, and enterprise-grade resilience.',
        },
    ];

    return (
        <>
            <SeoHead
                title="Philosophy & Studio Architecture"
                description="CuttingEdger is an independent digital agency sculpting brand identities and kinetic software for ambitious category leaders."
            />

            <PageHero
                eyebrow="ABOUT CUTTINGEDGER"
                title="WE ENGINEER EXPERIENCES THAT"
                highlight="REFUSE TO BE IGNORED."
                description="Founded in 2019, CuttingEdger is a bespoke collective of designers, creative engineers, and brand strategists. We partner with visionaries to build lasting digital dominance."
            />

            {/* Philosophy Narrative */}
            <section className="py-24 bg-white border-b border-ink/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-5 space-y-4">
                            <span className="font-mono text-xs uppercase tracking-widest text-primary-ink">
                                [ OUR CONVICTION ]
                            </span>
                            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-ink leading-tight">
                                Crafting dopamine through code & form.
                            </h2>
                        </div>

                        <div className="lg:col-span-7 space-y-6 text-ink-2 text-lg sm:text-xl font-normal leading-relaxed">
                            <p>
                                The contemporary internet is drowning in sea-of-sameness software. SaaS landing pages copy the same three cards; brands adopt the same safe geometric fonts; apps strip away all tactile humanity in pursuit of uninspired efficiency.
                            </p>
                            <p className="text-muted text-base">
                                We believe in the power of visceral emotion. When a user interacts with a button that responds with calculated spring physics, or scrolls through an editorial canvas with synchronized shader lighting, their brain registers genuine craft. That craft transforms casual visitors into fanatical brand evangelists.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4 Pillars Grid */}
            <section className="py-28 bg-page">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                        <span className="font-mono text-xs uppercase tracking-widest text-primary-ink">
                            [ FOUNDATIONAL PILLARS ]
                        </span>
                        <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-ink">
                            HOW WE OPERATE.
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {pillars.map((pillar, i) => {
                            const IconComponent = pillar.icon;
                            return (
                                <div
                                    key={i}
                                    className="p-8 rounded-3xl bg-white border border-ink/10 hover:border-primary/40 transition-colors flex flex-col justify-between group"
                                >
                                    <div>
                                        <div className="w-12 h-12 rounded-2xl bg-ink/[0.03] border border-ink/10 flex items-center justify-center mb-6 text-primary-ink group-hover:scale-110 transition-transform">
                                            <IconComponent className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl font-display font-bold text-ink mb-3">
                                            {pillar.title}
                                        </h3>
                                        <p className="text-sm text-muted leading-relaxed">
                                            {pillar.description}
                                        </p>
                                    </div>
                                    <span className="font-mono text-[10px] text-subtle uppercase tracking-widest mt-8 block">
                                        Pillar // 0{i + 1}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Leadership Spotlight */}
            <section className="py-24 bg-white border-t border-ink/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
                        <div>
                            <span className="font-mono text-xs uppercase tracking-widest text-primary-ink block mb-2">
                                [ STUDIO LEADERSHIP ]
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-display font-bold text-ink">
                                The partners steering the ship.
                            </h2>
                        </div>
                        <Link
                            href="/team"
                            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary-ink hover:text-ink transition-colors"
                        >
                            <span>View Full Collective</span>
                            <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {leadership.map((member) => (
                            <Link
                                key={member.id}
                                href={`/team/${member.slug}`}
                                className="group rounded-2xl bg-white border border-ink/10 overflow-hidden hover:border-primary/40 transition-colors"
                            >
                                <div className="aspect-[4/5] bg-white overflow-hidden">
                                    <img
                                        src={member.avatar}
                                        alt={member.name}
                                        className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                                    />
                                </div>
                                <div className="p-4 space-y-1">
                                    <h4 className="font-display font-bold text-ink group-hover:text-primary-ink transition-colors">
                                        {member.name}
                                    </h4>
                                    <p className="text-xs font-mono text-muted">
                                        {member.role}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
