import React, { useEffect, useRef, useState } from 'react';

interface StatItemProps {
    value: number;
    prefix?: string;
    suffix?: string;
    decimals?: number;
    label: string;
    caption: string;
    badge: string;
}

function AnimatedCounter({ value, prefix = '', suffix = '', decimals = 0, label, caption, badge }: StatItemProps) {
    const [count, setCount] = useState(0);
    const elementRef = useRef<HTMLDivElement>(null);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    setHasAnimated(true);

                    // Check prefers-reduced-motion
                    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                        setCount(value);
                        return;
                    }

                    const duration = 2000;
                    const startTime = performance.now();

                    const animate = (currentTime: number) => {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        // Easing out quint
                        const eased = 1 - Math.pow(1 - progress, 5);
                        const currentVal = eased * value;

                        setCount(currentVal);

                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        } else {
                            setCount(value);
                        }
                    };

                    requestAnimationFrame(animate);
                }
            },
            { threshold: 0.25 }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => observer.disconnect();
    }, [value, hasAnimated]);

    const formattedValue = decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toString();

    return (
        <div
            ref={elementRef}
            className="relative p-8 sm:p-10 rounded-3xl bg-[#12141a] border border-white/10 hover:border-[#d4ff00]/40 transition-all duration-300 flex flex-col justify-between group"
        >
            <div className="flex items-center justify-between mb-8">
                <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
                    {badge}
                </span>
                <span className="w-2 h-2 rounded-full bg-[#d4ff00] opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="space-y-3">
                <div className="text-5xl sm:text-7xl font-display font-black text-white tracking-tight flex items-baseline gap-1">
                    <span className="text-[#d4ff00]">{prefix}</span>
                    <span>{formattedValue}</span>
                    <span className="text-[#d4ff00]">{suffix}</span>
                </div>
                <h4 className="text-lg sm:text-xl font-display font-bold text-white">
                    {label}
                </h4>
            </div>

            <p className="mt-6 pt-6 border-t border-white/10 text-xs sm:text-sm text-neutral-400 font-mono leading-relaxed">
                "{caption}"
            </p>
        </div>
    );
}

export function StatsGrid() {
    const stats: StatItemProps[] = [
        {
            value: 480,
            prefix: '$',
            suffix: 'M+',
            label: 'Client Capital Created',
            caption: 'Our founders don’t just raise bridge rounds; they architect category-defining monopolies.',
            badge: 'Metric // 01',
        },
        {
            value: 99.4,
            suffix: '%',
            decimals: 1,
            label: 'On-Time Sprint Velocity',
            caption: 'Production deadlines are sacred commitments, not flexible artistic suggestions.',
            badge: 'Metric // 02',
        },
        {
            value: 14,
            suffix: '',
            label: 'International Honors',
            caption: 'Awwwards Site of the Year, FWA of the Day, and prestigious Red Dot accolades.',
            badge: 'Metric // 03',
        },
    ];

    return (
        <section className="relative py-28 bg-[#0a0b0e] border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                    <span className="font-mono text-xs uppercase tracking-widest text-[#d4ff00] block">
                        [ 03 // QUANTIFIABLE PROOF ]
                    </span>
                    <h2 className="text-4xl sm:text-6xl font-display font-extrabold text-white tracking-tight">
                        NUMBERS DON’T LIE.
                    </h2>
                    <p className="text-neutral-400 text-sm sm:text-base">
                        Behind every kinetic interface and sculptural brand identity is rigorous engineering and cold, hard ROI.
                    </p>
                </div>

                {/* 3 Animated Counters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {stats.map((stat, i) => (
                        <AnimatedCounter key={i} {...stat} />
                    ))}
                </div>
            </div>
        </section>
    );
}
