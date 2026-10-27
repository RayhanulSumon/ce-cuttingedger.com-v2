import React, { useEffect, useRef, useState } from 'react';
import { Layers, BookOpen, Box, Clock, ArrowUpRight } from 'lucide-react';
import { useInView } from 'framer-motion';

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-10% 0px' });

    useEffect(() => {
        if (!isInView) return;

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setCount(value);
            return;
        }

        const duration = 1600;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            const currentVal = Math.floor(eased * value);

            setCount(currentVal);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setCount(value);
            }
        };

        requestAnimationFrame(animate);
    }, [isInView, value]);

    return (
        <span ref={ref} className="tabular-nums">
            {count.toLocaleString()}
            {suffix && <span className="text-accent">{suffix}</span>}
        </span>
    );
}

export function StatsGrid() {
    const stats = [
        {
            value: 10000,
            suffix: '+',
            label: 'Images Daily',
            detail: 'Sub-15m turnaround',
            icon: Layers,
        },
        {
            value: 450,
            suffix: '+',
            label: 'Catalog Pages',
            detail: 'Overnight DTP sprints',
            icon: BookOpen,
        },
        {
            value: 200,
            suffix: '+',
            label: '3D CGI Models',
            detail: 'Photorealistic 8K UHD',
            icon: Box,
        },
        {
            value: 99.98,
            suffix: '%',
            isDecimal: true,
            label: 'On-Time SLA',
            detail: '24/7/365 global shifts',
            icon: Clock,
        },
    ];

    return (
        <section
            id="production-stats"
            className="relative py-20 sm:py-24 bg-[#090a0d] border-t border-white/[0.06] overflow-hidden"
        >
            {/* Subtle Ambient Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(251,183,24,0.06),transparent)] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 xs:px-6 lg:px-8 relative z-10">
                {/* Minimalist Centered Header */}
                <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-18 space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                        <span>Daily Production Scale</span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight">
                        Numbers that define our scale.
                    </h2>

                    <p className="text-sm sm:text-base text-neutral-400 font-sans leading-relaxed">
                        Continuous 24/7 throughput engineered for global retail powerhouses and creative studios.
                    </p>
                </div>

                {/* Minimalist 4-Column Metric Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {stats.map((stat, idx) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={idx}
                                className="group relative rounded-2xl p-7 sm:p-8 bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.07] hover:border-accent/40 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                            >
                                {/* Subtle Hover Glow */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-neutral-400 group-hover:text-accent group-hover:border-accent/30 transition-colors">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                                            0{idx + 1}
                                        </span>
                                    </div>

                                    {/* Metric Digits */}
                                    <div className="text-4xl sm:text-5xl font-display font-black tracking-tight text-white group-hover:text-accent transition-colors">
                                        {stat.isDecimal ? (
                                            <span>
                                                99.98<span className="text-accent">%</span>
                                            </span>
                                        ) : (
                                            <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                                        )}
                                    </div>

                                    {/* Metric Label & Detail */}
                                    <h3 className="text-base sm:text-lg font-display font-bold text-neutral-100 mt-3 group-hover:text-white transition-colors">
                                        {stat.label}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-neutral-400 font-sans mt-1">
                                        {stat.detail}
                                    </p>
                                </div>

                                {/* Minimal Accent Line on Bottom */}
                                <div className="relative z-10 mt-6 pt-4 border-t border-white/[0.05] flex items-center justify-between text-[11px] font-mono text-neutral-500 group-hover:text-neutral-300 transition-colors">
                                    <span>Verified SLA</span>
                                    <span className="text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                                        Live Active →
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Minimalist Bottom Bar */}
                <div className="mt-12 text-center">
                    <a
                        href="#free-trial"
                        className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-400 hover:text-accent transition-colors group"
                    >
                        <span>Experience our production velocity with 3 free trial assets</span>
                        <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-accent" />
                    </a>
                </div>
            </div>
        </section>
    );
}


