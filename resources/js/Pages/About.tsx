import React from 'react';
import { Link } from '@inertiajs/react';
import { SeoHead } from '@/Components/Common/SeoHead';
import { PageHero } from '@/Components/Common/PageHero';
import { TeamMember } from '@/types/models';
import {
    ArrowUpRight,
    BookOpen,
    Box,
    Compass,
    Layers,
    ShieldCheck,
    Sparkles,
    Video,
    Zap,
} from 'lucide-react';

interface AboutProps {
    leadership: TeamMember[];
}

const STUDIO_METRICS = [
    { value: '170+', label: 'Global Retail & Agency Partners' },
    { value: '24h', label: 'Standard Batch Turnaround' },
    { value: '99.8%', label: 'First-Pass QA Approval Rate' },
    { value: '24/7', label: 'Dual-Shift Studio Production' },
];

const DIVISIONS = [
    {
        tag: '2D Studio',
        icon: Layers,
        title: '2D Retouching, Digital Twins & Try-On',
        description:
            'Hand-drawn clipping paths, hair masking, ghost mannequin compositing, fashion & jewelry retouching, AI digital twins, and virtual try-on.',
        href: '/capabilities/2d',
    },
    {
        tag: '3D & CGI',
        icon: Box,
        title: '3D Modeling & CGI Virtual Staging',
        description:
            'CAD-to-CGI product meshes, photoreal PBR textures, 360-degree spins, and virtual architectural room environments.',
        href: '/capabilities/3d',
    },
    {
        tag: 'DTP & Layout',
        icon: BookOpen,
        title: 'DTP & Multilingual Catalog Layout',
        description:
            'Lookbooks, print-ready seasonal catalogs, packaging prepress, and automated multilingual typesetting.',
        href: '/capabilities/dtp',
    },
    {
        tag: 'Video & Motion',
        icon: Video,
        title: 'Video Editing & Campaign Motion',
        description:
            'High-converting e-commerce product reels, color grading, and multi-ratio social campaign cut-downs.',
        href: '/capabilities/video',
    },
];

const PILLARS = [
    {
        icon: Sparkles,
        title: 'Artisan Craft + AI Precision',
        description:
            'Every asset is refined by specialist retouchers and 3D artists, using AI acceleration only where it speeds delivery without compromising natural fabric drape, hair detail, or edge accuracy.',
    },
    {
        icon: Zap,
        title: '24-Hour Turnaround at Scale',
        description:
            'Dual-shift production pipelines engineered to deliver overnight batches and multi-thousand-SKU seasonal launches ahead of retail deadlines.',
    },
    {
        icon: Compass,
        title: 'Two-Step QA & Style-Guide Presets',
        description:
            'We build custom brand presets from your visual guidelines and inspect every file through a two-tier quality control check so 10,000 SKUs look like one cohesive shoot.',
    },
    {
        icon: ShieldCheck,
        title: 'NDA Confidentiality & Asset Security',
        description:
            'Encrypted storage, strict project NDAs, white-label agency support, and a zero-compromise guarantee that client imagery is never used to train public AI models.',
    },
];

export default function About({ leadership = [] }: AboutProps) {
    return (
        <>
            <SeoHead
                title="About CuttingEdger — AI-Integrated Visual Production & Post-Production Studio"
                description="Founded in 2019, CuttingEdger partners with 170+ global fashion, luxury, and e-commerce brands to deliver 24-hour 2D retouching, AI digital twins, virtual try-on, 3D CGI, DTP, and video production at scale."
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: 'About', url: '/about' },
                ]}
            />

            <PageHero
                eyebrow="ABOUT CUTTINGEDGER"
                title="HIGH-VOLUME VISUAL PRODUCTION."
                highlight="HAND-FINISHED AT STUDIO SCALE."
                description="Founded in 2019, CuttingEdger is an AI-integrated post-production studio combining specialist retouchers, 3D CGI artists, and proprietary AI workflows to turn raw product and fashion photography into high-converting catalog imagery."
            />

            {/* Studio Narrative & Metrics */}
            <section className="py-20 sm:py-24 bg-surface border-b border-ink/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
                        <div className="lg:col-span-5 space-y-6">
                            <div className="space-y-3">
                                <span className="font-mono text-xs uppercase tracking-widest text-primary-ink block">
                                    [ OUR STUDIO STORY ]
                                </span>
                                <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-display font-extrabold text-ink leading-[1.12] tracking-tight">
                                    Where artisan retouching meets AI-driven catalog velocity.
                                </h2>
                            </div>

                            <div className="grid grid-cols-2 gap-3.5 pt-2">
                                {STUDIO_METRICS.map((metric) => (
                                    <div
                                        key={metric.label}
                                        className="rounded-2xl border border-ink/10 bg-page p-5 space-y-1"
                                    >
                                        <p className="text-2xl sm:text-3xl font-display font-extrabold text-primary-ink">
                                            {metric.value}
                                        </p>
                                        <p className="text-xs font-medium text-muted leading-snug">
                                            {metric.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="lg:col-span-7 space-y-6 text-ink-2 text-base sm:text-lg font-normal leading-relaxed lg:pt-6">
                            <p>
                                Modern fashion, footwear, jewelry, furniture, and e-commerce brands
                                cannot afford post-shoot bottlenecks when seasonal launches depend on
                                thousands of SKUs going live simultaneously. CuttingEdger was built
                                to eliminate that friction—keeping every garment drape, natural skin
                                texture, gemstone facet, and Delta-E color profile faithful to your
                                brand style guide.
                            </p>
                            <p className="text-muted text-base leading-relaxed">
                                Rather than splitting work across disconnected freelancers and
                                vendors, we bring traditional hand-drawn clipping paths, ghost
                                mannequin compositing, and macro retouching together with
                                next-generation <strong className="text-ink font-semibold">Digital Twins</strong>,{' '}
                                <strong className="text-ink font-semibold">Virtual Try-On</strong>,{' '}
                                <strong className="text-ink font-semibold">3D CGI staging</strong>,{' '}
                                <strong className="text-ink font-semibold">multilingual DTP catalogs</strong>, and{' '}
                                <strong className="text-ink font-semibold">e-commerce video cut-downs</strong>{' '}
                                under one connected studio roof.
                            </p>
                            <p className="text-muted text-base leading-relaxed">
                                Backed by 24/7 dual-shift production teams, dedicated client
                                coordinators across global time zones, and custom brand presets, we
                                scale seamlessly from boutique lookbooks to enterprise rollouts of
                                10,000+ images without compromising craft.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Connected Studio Capabilities Strip (4 Core Divisions) */}
            <section className="py-20 sm:py-24 bg-page border-b border-ink/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
                        <div className="space-y-2 max-w-2xl">
                            <span className="font-mono text-xs uppercase tracking-widest text-primary-ink block">
                                [ CONNECTED DIVISIONS ]
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-ink tracking-tight">
                                Four studio disciplines. One unified pipeline.
                            </h2>
                        </div>

                        <Link
                            href="/capabilities"
                            prefetch
                            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary-ink hover:text-ink transition-colors shrink-0"
                        >
                            <span>Explore All Capabilities</span>
                            <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {DIVISIONS.map((division) => {
                            const IconComponent = division.icon;
                            return (
                                <Link
                                    key={division.href}
                                    href={division.href}
                                    prefetch
                                    className="group rounded-3xl bg-surface border border-ink/10 hover:border-primary/40 p-7 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between shadow-xs"
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-6">
                                            <span className="w-12 h-12 rounded-2xl bg-page border border-ink/10 flex items-center justify-center text-primary-ink group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-colors">
                                                <IconComponent className="w-5 h-5" />
                                            </span>
                                            <span className="font-mono text-[10px] uppercase tracking-widest text-subtle">
                                                {division.tag}
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-display font-bold text-ink group-hover:text-primary-ink transition-colors mb-2.5 leading-snug">
                                            {division.title}
                                        </h3>
                                        <p className="text-sm text-muted leading-relaxed">
                                            {division.description}
                                        </p>
                                    </div>

                                    <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink group-hover:text-primary-ink transition-colors">
                                        <span>View Discipline</span>
                                        <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Foundational Operational Pillars */}
            <section className="py-20 sm:py-24 bg-surface border-b border-ink/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
                        <span className="font-mono text-xs uppercase tracking-widest text-primary-ink block">
                            [ FOUNDATIONAL PILLARS ]
                        </span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-ink tracking-tight">
                            HOW WE OPERATE.
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {PILLARS.map((pillar, i) => {
                            const IconComponent = pillar.icon;
                            return (
                                <div
                                    key={pillar.title}
                                    className="p-7 rounded-3xl bg-page border border-ink/10 hover:border-primary/40 transition-colors flex flex-col justify-between group"
                                >
                                    <div>
                                        <div className="w-12 h-12 rounded-2xl bg-surface border border-ink/10 flex items-center justify-center mb-6 text-primary-ink group-hover:scale-105 transition-transform">
                                            <IconComponent className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-lg font-display font-bold text-ink mb-3 leading-snug">
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

            {/* Studio Leadership */}
            <section className="py-20 sm:py-24 bg-page border-b border-ink/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
                        <div>
                            <span className="font-mono text-xs uppercase tracking-widest text-primary-ink block mb-2">
                                [ STUDIO LEADERSHIP ]
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-display font-bold text-ink">
                                The team steering every production pipeline.
                            </h2>
                        </div>
                        <Link
                            href="/team"
                            prefetch
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
                                prefetch
                                className="group rounded-2xl bg-surface border border-ink/10 overflow-hidden hover:border-primary/40 transition-colors shadow-xs"
                            >
                                <div className="aspect-[4/5] bg-page overflow-hidden">
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

            {/* Bottom Conversion CTA */}
            <section className="py-20 sm:py-24 bg-surface">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="rounded-3xl border border-ink/10 bg-page p-8 sm:p-12 lg:p-14 space-y-6">
                        <span className="font-mono text-xs uppercase tracking-widest text-primary-ink block">
                            [ PARTNER WITH CUTTINGEDGER ]
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-ink tracking-tight max-w-2xl mx-auto">
                            Ready to scale your catalog post-production?
                        </h2>
                        <p className="text-sm sm:text-base text-muted leading-relaxed max-w-2xl mx-auto">
                            Send a sample batch for a complimentary quality test or walk through our
                            2D, Digital Twin, 3D CGI, DTP, and Video pipelines with our production
                            team.
                        </p>

                        <div className="pt-2 flex flex-wrap items-center justify-center gap-3.5">
                            <Link
                                href="/contact"
                                prefetch
                                className="inline-flex items-center gap-2 rounded-full bg-primary hover:bg-primary-hover text-white px-7 py-3.5 text-sm font-bold transition-all shadow-sm hover:-translate-y-0.5"
                            >
                                <span>Start a Project / Contact Us</span>
                                <ArrowUpRight className="w-4 h-4" />
                            </Link>
                            <Link
                                href="/capabilities"
                                prefetch
                                className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-surface hover:border-primary/40 text-ink hover:text-primary-ink px-7 py-3.5 text-sm font-semibold transition-all"
                            >
                                <span>Explore Capabilities</span>
                                <ArrowUpRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
