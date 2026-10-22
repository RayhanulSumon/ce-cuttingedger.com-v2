import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import { motion, useInView } from 'framer-motion';

interface FunFactRowProps {
    value: number;
    suffix?: string;
    badge: string;
    title: string;
    subtitle?: string;
}

function FunFactRow({ value, suffix = '', badge, title, subtitle }: FunFactRowProps) {
    const [count, setCount] = useState(0);
    const rowRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(rowRef, { once: true, margin: '-10% 0px' });

    useEffect(() => {
        if (!isInView) return;

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setCount(value);
            return;
        }

        const duration = 2000;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Smooth quint ease-out
            const eased = 1 - Math.pow(1 - progress, 5);
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
        <div
            ref={rowRef}
            className="group py-10 sm:py-14 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-colors duration-300 hover:border-white/25"
        >
            {/* Massive Counter on Left */}
            <div className="flex items-baseline">
                <span className="font-display text-7xl sm:text-8xl lg:text-[110px] xl:text-[125px] font-black tracking-tight text-white leading-none select-none group-hover:text-[#d4ff00] transition-colors tabular-nums">
                    {count}
                </span>
                {suffix && (
                    <span className="font-display text-5xl sm:text-6xl lg:text-8xl font-black text-[#d4ff00] leading-none ml-1 select-none">
                        {suffix}
                    </span>
                )}
            </div>

            {/* Badge & Title on Right */}
            <div className="sm:text-right space-y-2.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-widest text-[#d4ff00]">
                    <span>{badge}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-neutral-200 group-hover:text-white transition-colors tracking-tight leading-tight">
                    {title}
                </h3>
                {subtitle && (
                    <p className="text-xs sm:text-sm font-sans text-neutral-400 font-normal max-w-sm sm:ml-auto">
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    );
}

export function StatsGrid() {
    const stats: FunFactRowProps[] = [
        {
            value: 10000,
            suffix: '+',
            badge: '[ DAILY VOLUME ]',
            title: 'Images Processed Daily',
            subtitle: 'High-throughput 2D clipping, ghost mannequin, and high-end fashion retouching.',
        },
        {
            value: 450,
            suffix: '+',
            badge: '[ DTP SPRINT ]',
            title: 'Pages Formatted',
            subtitle: 'Overnight multilingual desktop publishing and InDesign catalog production.',
        },
        {
            value: 200,
            suffix: '+',
            badge: '[ 3D SPATIAL ]',
            title: '3D CGI Models Rendered',
            subtitle: 'Photorealistic furniture, consumer electronics, and 360° spin turntables.',
        },
        {
            value: 2300,
            suffix: '+',
            badge: '[ 24/7/365 ]',
            title: 'Hours of Production',
            subtitle: 'Dedicated round-the-clock shift operation ensuring sub-12 hour turnarounds.',
        },
    ];

    return (
        <section
            id="fun-facts-section"
            className="relative py-28 sm:py-36 bg-[#090a0d] border-t border-white/10 overflow-hidden select-none"
        >
            {/* Ambient Lighting */}
            <div className="absolute top-1/3 left-10 w-[40rem] h-[40rem] bg-[#d4ff00]/5 rounded-full blur-[200px] pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-[35rem] h-[35rem] bg-[#ff5e36]/5 rounded-full blur-[200px] pointer-events-none" />

            <div className="w-full max-w-[96%] xl:max-w-[1560px] 2xl:max-w-[1750px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
                {/* Asymmetric 2-Column Layout matching Agntix Design Studio */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
                    {/* Left Column: Fun Facts Eyebrow, Display Headline, and Manifesto Paragraph */}
                    <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-widest text-[#d4ff00]">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Daily Production Insights</span>
                        </div>

                        <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-[76px] xl:text-[88px] font-display font-extrabold text-white tracking-tight leading-[0.98]">
                            Numbers that Speak Volumes
                        </h2>

                        <p className="text-base sm:text-lg text-neutral-400 font-sans leading-relaxed pt-2 max-w-lg">
                            Operating 24 hours a day with 100+ specialized Photoshop artists and 3D CGI modelers. 
                            We partner directly with international retail powerhouses, advertising agencies, and e-commerce studios requiring unmatched scale and surgical precision.
                        </p>

                        <div className="pt-4">
                            <a
                                href="#site-footer"
                                className="group inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 bg-white/5 hover:bg-[#d4ff00] hover:text-black hover:border-[#d4ff00] text-xs font-mono uppercase tracking-widest text-white transition-all duration-300"
                            >
                                <span>Start A Conversation</span>
                                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                            </a>
                        </div>
                    </div>

                    {/* Right Column: 3 Stacked Horizontal Stat Rows */}
                    <div className="lg:col-span-7 divide-y divide-white/10">
                        {stats.map((stat, idx) => (
                            <FunFactRow key={idx} {...stat} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
