import React, { useEffect, useRef, useState } from 'react';
import { 
    Layers, 
    BookOpen, 
    Box, 
    Clock, 
    ArrowUpRight, 
    Activity, 
    CheckCircle2, 
    ShieldCheck 
} from 'lucide-react';
import { motion, useInView } from 'framer-motion';

interface StatItem {
    value: number;
    suffix?: string;
    badge: string;
    title: string;
    subtitle: string;
    metaLabel: string;
    metaValue: string;
    icon: React.ComponentType<{ className?: string }>;
}

function StatCard({ stat, index }: { stat: StatItem; index: number }) {
    const [count, setCount] = useState(0);
    const cardRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(cardRef, { once: true, margin: '-10% 0px' });
    const Icon = stat.icon;

    useEffect(() => {
        if (!isInView) return;

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setCount(stat.value);
            return;
        }

        const duration = 1800;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Smooth quartic ease-out
            const eased = 1 - Math.pow(1 - progress, 4);
            const currentVal = Math.floor(eased * stat.value);

            setCount(currentVal);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setCount(stat.value);
            }
        };

        requestAnimationFrame(animate);
    }, [isInView, stat.value]);

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="group relative rounded-2xl sm:rounded-3xl p-6 sm:p-7 bg-[#12141c]/60 backdrop-blur-xl border border-white/10 hover:border-[#d4ff00]/40 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-[0_15px_35px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_45px_rgba(212,255,0,0.08)]"
        >
            {/* Ambient Radial Sheen on Hover */}
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-[#d4ff00]/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />

            <div className="relative z-10">
                {/* Header: Icon & Category Capsule */}
                <div className="flex items-center justify-between gap-3 mb-6">
                    <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#d4ff00] group-hover:bg-[#d4ff00] group-hover:text-black group-hover:border-[#d4ff00] transition-all duration-300 shadow-sm shrink-0">
                        <Icon className="w-5 h-5" />
                    </div>

                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] sm:text-xs font-mono uppercase tracking-widest text-neutral-400 group-hover:text-white group-hover:border-white/20 transition-colors">
                        {stat.badge}
                    </span>
                </div>

                {/* Counter Metric */}
                <div className="flex items-baseline gap-1 my-2">
                    <span className="font-['Clash_Display',_'Syne',_sans-serif] text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-white leading-none tabular-nums group-hover:text-[#d4ff00] transition-colors">
                        {count.toLocaleString()}
                    </span>
                    {stat.suffix && (
                        <span className="font-['Clash_Display',_'Syne',_sans-serif] text-3xl sm:text-4xl font-bold text-[#d4ff00] leading-none">
                            {stat.suffix}
                        </span>
                    )}
                </div>

                {/* Title & Description */}
                <h3 className="text-base sm:text-lg font-['Clash_Display',_'Syne',_sans-serif] font-bold text-neutral-100 group-hover:text-white transition-colors tracking-tight mt-3 mb-1.5">
                    {stat.title}
                </h3>
                <p className="text-xs sm:text-sm font-sans text-neutral-400 leading-relaxed font-normal">
                    {stat.subtitle}
                </p>
            </div>

            {/* Micro Footer SLA Status Rail */}
            <div className="relative z-10 mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono">
                <span className="text-neutral-500 uppercase tracking-wider">{stat.metaLabel}</span>
                <span className="text-neutral-300 font-semibold group-hover:text-[#d4ff00] transition-colors">{stat.metaValue}</span>
            </div>

            {/* Interactive Bottom Progress Accent */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5">
                <div className="h-full w-1/4 bg-[#d4ff00]/40 group-hover:w-full group-hover:bg-[#d4ff00] transition-all duration-500 ease-out" />
            </div>
        </motion.div>
    );
}

export function StatsGrid() {
    const stats: StatItem[] = [
        {
            value: 10000,
            suffix: '+',
            badge: '2D VOLUME',
            title: 'Images Processed Daily',
            subtitle: 'High-throughput clipping paths, invisible ghost mannequins, and high-end fashion retouching.',
            metaLabel: 'AVG THROUGHPUT',
            metaValue: '15 Min / Image',
            icon: Layers,
        },
        {
            value: 450,
            suffix: '+',
            badge: 'DTP SPRINT',
            title: 'Catalog Pages Formatted',
            subtitle: 'Overnight multilingual InDesign layout, color profile matching, and pre-press prep.',
            metaLabel: 'DELIVERY SLA',
            metaValue: 'Sub-24h Sprint',
            icon: BookOpen,
        },
        {
            value: 200,
            suffix: '+',
            badge: 'SPATIAL CGI',
            title: '3D CGI Models Rendered',
            subtitle: 'Photorealistic furniture, electronics, packshots, and 360° spin interactive turntables.',
            metaLabel: 'RENDER DEPTH',
            metaValue: 'Up to 8K Ultra-HD',
            icon: Box,
        },
        {
            value: 2300,
            suffix: '+',
            badge: '24/7/365 GLOBAL',
            title: 'Continuous Shift Output',
            subtitle: 'Dedicated round-the-clock shift operation guaranteeing sub-12 hour turnaround times.',
            metaLabel: 'STUDIO UPTIME',
            metaValue: '99.98% On-Time',
            icon: Clock,
        },
    ];

    return (
        <section
            id="production-stats"
            className="relative py-18 sm:py-22 lg:py-28 bg-[#090a0d] border-t border-white/10 overflow-hidden select-none"
        >
            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 left-0 w-[45rem] h-[45rem] bg-[#d4ff00]/5 rounded-full blur-[220px] pointer-events-none" />
            <div className="absolute bottom-10 right-0 w-[40rem] h-[40rem] bg-amber-500/5 rounded-full blur-[220px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 xs:px-6 lg:px-8 relative z-10">
                {/* 2-Column Responsive Bento Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-start">
                    {/* Left Column: Eyebrow, Display Typography, Trust Metrics, & CTA */}
                    <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-5 sm:space-y-6">
                        {/* Live Production Eyebrow Badge */}
                        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#d4ff00]/10 border border-[#d4ff00]/25 text-xs font-mono uppercase tracking-widest text-[#d4ff00]">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4ff00] opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d4ff00]" />
                            </span>
                            <span>Daily Production Insights</span>
                        </div>

                        {/* Display Headline */}
                        <h2 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-['Clash_Display',_'Syne',_sans-serif] uppercase font-bold text-white tracking-tight leading-[1.08] sm:leading-[1.04]">
                            NUMBERS THAT DEFINE OUR SCALE.
                        </h2>

                        {/* Agency Manifesto Summary */}
                        <p className="text-sm sm:text-base text-neutral-400 font-sans leading-relaxed">
                            Operating around the clock across 3 synchronized global shifts. Over 100+ specialized Photoshop artists and 3D spatial engineers partner directly with international retail powerhouses, advertising agencies, and e-commerce studios requiring unmatched throughput and surgical precision.
                        </p>

                        {/* Trust Pillars */}
                        <div className="space-y-2.5 pt-2">
                            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-sans text-neutral-300">
                                <CheckCircle2 className="w-4 h-4 text-[#d4ff00] shrink-0" />
                                <span>Guaranteed sub-12 hour rush turnaround options</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-sans text-neutral-300">
                                <ShieldCheck className="w-4 h-4 text-[#d4ff00] shrink-0" />
                                <span>Strict enterprise NDA & encrypted asset pipelines</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-sans text-neutral-300">
                                <Activity className="w-4 h-4 text-[#d4ff00] shrink-0" />
                                <span>Zero-downtime 24/7/365 production shifts</span>
                            </div>
                        </div>

                        {/* Live Operational Status Box */}
                        <div className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md flex flex-col xs:flex-row xs:items-center justify-between gap-3 sm:gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#d4ff00] shadow-[0_0_8px_#d4ff00] shrink-0" />
                                <div>
                                    <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                                        Shift Status: <span className="text-white font-semibold">Active & Live</span>
                                    </div>
                                    <div className="text-[11px] font-mono text-neutral-500">
                                        100+ Artists Currently Online
                                    </div>
                                </div>
                            </div>

                            <a
                                href="#free-trial"
                                className="group inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 border border-white/15 hover:bg-[#d4ff00] hover:text-black hover:border-[#d4ff00] text-xs font-mono uppercase tracking-wider text-white transition-all duration-300 shrink-0 self-start xs:self-auto"
                            >
                                <span>Free Trial</span>
                                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </a>
                        </div>
                    </div>

                    {/* Right Column: 2x2 Bento Glass Cards */}
                    <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                        {stats.map((stat, idx) => (
                            <StatCard key={idx} stat={stat} index={idx} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
