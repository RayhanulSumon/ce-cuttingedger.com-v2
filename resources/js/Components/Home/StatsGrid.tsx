import React from 'react';
import { Link } from '@inertiajs/react';
import {
    ArrowUpRight,
    CheckCircle2,
    XCircle,
    Zap,
    ShieldCheck,
    Clock,
    Users,
    Award,
} from 'lucide-react';

interface ComparisonRow {
    dimension: string;
    traditional: string;
    cuttingEdger: string;
}

const WORKFLOW_COMPARISON: ComparisonRow[] = [
    {
        dimension: 'Turnaround Velocity',
        traditional: '3–6 Weeks (Set booking, shipping & manual post)',
        cuttingEdger: '24–48 Hours (AI-accelerated & 24/6 multi-shift pods)',
    },
    {
        dimension: 'Physical Shoot Overhead',
        traditional: 'High studio rental, travel, sample logistics & reshoot fees',
        cuttingEdger: 'Up to 60% Cost Reduction via Virtual Models & 8K 3D Twins',
    },
    {
        dimension: 'Catalog Scalability',
        traditional: 'Bottlenecked at ~50–100 assets per week',
        cuttingEdger: '10,000+ Assets / Day with 250+ Dedicated Specialists',
    },
    {
        dimension: 'Data Security & Compliance',
        traditional: 'Unverified freelance transfers & fragmented cloud folders',
        cuttingEdger: 'ISO 27001 Certified Vault, Strict NDA & Encrypted SFTP/S3',
    },
];

export function StatsGrid() {
    const metrics = [
        {
            figure: '250+',
            title: 'Specialists',
            subtitle: 'Global creative talent pool',
            icon: Users,
        },
        {
            figure: '24/6',
            title: 'Support',
            subtitle: 'Round-the-clock production cycles',
            icon: Clock,
        },
        {
            figure: '10+ YEARS',
            title: 'Experience',
            subtitle: 'Proven industry track record',
            icon: Award,
        },
        {
            figure: 'ISO 27001',
            title: 'Certified',
            subtitle: 'Enterprise data security & compliance',
            icon: ShieldCheck,
        },
    ];

    return (
        <section
            id="why-cuttingedger-section"
            className="relative bg-[#08090c] border-t border-white/10 overflow-hidden select-none"
        >
            {/* PART 1: FULL-BLEED MONOCHROME STUDIO BANNER & METRICS STRIP (Matching Reference Image) */}
            <div className="relative min-h-[540px] sm:min-h-[620px] lg:min-h-[680px] flex flex-col justify-between py-14 sm:py-20 lg:py-24 overflow-hidden">
                {/* Monochrome Multi-Monitor Creative Studio Background */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=85"
                        alt="CuttingEdger Enterprise Production Studio Floor"
                        loading="lazy"
                        className="w-full h-full object-cover object-center grayscale contrast-125 brightness-[0.38]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#08090c]/90 via-[#08090c]/45 to-[#08090c]/95" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#08090c]/85 via-transparent to-[#08090c]/85" />
                </div>

                {/* Top Row: Giant "WHY CUTTINGEDGER?" + Gold-Bordered CTA Pill */}
                <div className="max-w-7xl mx-auto px-4 xs:px-6 lg:px-8 w-full relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <h2 className="text-4xl sm:text-6xl lg:text-7xl xl:text-[5.25rem] font-display font-black uppercase tracking-tight leading-[0.98]">
                        <span className="text-white mr-3 sm:mr-4">WHY</span>
                        <span className="text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.75)]">
                            CUTTING
                        </span>
                        <br />
                        <span className="text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.75)]">
                            EDGER
                        </span>
                        <span className="text-accent [-webkit-text-stroke:0px] ml-1">?</span>
                    </h2>

                    <div className="md:pt-3">
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-black/65 hover:bg-accent text-white hover:text-black border border-accent/60 hover:border-accent backdrop-blur-md font-mono text-xs uppercase tracking-widest font-bold transition-all duration-300 shadow-[0_0_25px_rgba(245,166,35,0.2)] cursor-pointer group"
                        >
                            <span>Request A Quote</span>
                            <ArrowUpRight className="w-4 h-4 text-accent group-hover:text-black transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Link>
                    </div>
                </div>

                {/* Bottom Row Over Studio Image: Left Value Copy + Right 4 Metrics Strip */}
                <div className="max-w-7xl mx-auto px-4 xs:px-6 lg:px-8 w-full relative z-10 mt-20 sm:mt-28 lg:mt-36 pt-8 border-t border-white/15">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-end">
                        {/* Left Column: Built Around The Way Creative Teams Work */}
                        <div className="lg:col-span-5 space-y-3">
                            <h3 className="text-sm sm:text-base font-mono font-bold uppercase tracking-wider text-accent leading-snug">
                                BUILT AROUND THE WAY <br />
                                CREATIVE TEAMS WORK.
                            </h3>
                            <p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed max-w-md">
                                Our dedicated 24/6 multi-shift pods, senior art directors, and ISO 27001 certified infrastructure plug directly into your enterprise PIM, DAM, and creative pipelines.
                            </p>
                        </div>

                        {/* Right Column: 4 Core Enterprise Metrics Strip */}
                        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                            {metrics.map((metric, idx) => (
                                <div
                                    key={idx}
                                    className="space-y-1.5 border-l border-white/15 pl-4 py-1"
                                >
                                    <div className="text-2xl sm:text-3xl xl:text-4xl font-display font-black text-white tracking-tight leading-none">
                                        {metric.figure}
                                    </div>
                                    <div className="text-xs font-mono uppercase tracking-wider text-accent font-bold">
                                        {metric.title}
                                    </div>
                                    <p className="text-[11px] text-neutral-400 font-sans leading-snug">
                                        {metric.subtitle}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* PART 2: VALUE COMPARISON BLOCK — TRADITIONAL STUDIO VS. CUTTINGEDGER AI WORKFLOW */}
            <div className="max-w-7xl mx-auto px-4 xs:px-6 lg:px-8 py-14 sm:py-20 border-t border-white/10 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/25 text-[11px] font-mono uppercase tracking-widest text-accent font-semibold">
                            <Zap className="w-3.5 h-3.5" />
                            <span>ENTERPRISE VELOCITY BENCHMARK</span>
                        </div>
                        <h3 className="text-xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
                            Traditional Studio vs. <span className="text-accent">CuttingEdger AI &amp; CGI Workflow</span>
                        </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-neutral-400 font-sans max-w-md">
                        Compress multi-week physical production cycles into 24–48 hour digital turnarounds while eliminating physical shoot overhead.
                    </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-[#0d0f16] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.75)]">
                    {/* Table Header */}
                    <div className="grid grid-cols-1 md:grid-cols-12 border-b border-white/10 bg-white/[0.03] text-xs font-mono uppercase tracking-wider">
                        <div className="md:col-span-3 p-4 sm:p-5 text-neutral-400 font-semibold">
                            Production Dimension
                        </div>
                        <div className="md:col-span-4 p-4 sm:p-5 text-neutral-400 border-t md:border-t-0 md:border-l border-white/10 font-semibold">
                            Traditional Physical Studio
                        </div>
                        <div className="md:col-span-5 p-4 sm:p-5 text-accent bg-accent/[0.06] border-t md:border-t-0 md:border-l border-accent/25 font-bold flex items-center gap-2">
                            <Zap className="w-3.5 h-3.5 fill-accent text-accent" />
                            <span>CuttingEdger AI &amp; 3D CGI Pipeline</span>
                        </div>
                    </div>

                    {/* Comparison Rows */}
                    <div className="divide-y divide-white/10">
                        {WORKFLOW_COMPARISON.map((row, idx) => (
                            <div
                                key={idx}
                                className="grid grid-cols-1 md:grid-cols-12 items-center text-xs sm:text-sm font-sans hover:bg-white/[0.015] transition-colors"
                            >
                                <div className="md:col-span-3 p-4 sm:p-5 font-display font-bold text-white">
                                    {row.dimension}
                                </div>
                                <div className="md:col-span-4 p-4 sm:p-5 text-neutral-400 border-t md:border-t-0 md:border-l border-white/10 flex items-start gap-2.5">
                                    <XCircle className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                                    <span>{row.traditional}</span>
                                </div>
                                <div className="md:col-span-5 p-4 sm:p-5 text-white bg-accent/[0.03] border-t md:border-t-0 md:border-l border-accent/20 flex items-start gap-2.5 font-medium">
                                    <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                                    <span>{row.cuttingEdger}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
