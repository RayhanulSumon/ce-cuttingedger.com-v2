import React, { useState, useEffect } from 'react';
import { ArrowDown, ArrowUpRight, Sparkles } from 'lucide-react';
import { Button } from '@/Components/UI/Button';

export function SplitHero({ onOpenContact }: { onOpenContact?: () => void }) {
    const rotatingWords = [
        'CATEGORY LEADERS',
        'FEARLESS BRANDS',
        'KINETIC PLATFORMS',
        'RADICAL DIGITAL',
    ];

    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setReducedMotion(mediaQuery.matches);

        if (mediaQuery.matches) return;

        const interval = setInterval(() => {
            setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
        }, 2800);

        return () => clearInterval(interval);
    }, []);

    // Interactive Reel Cards
    const reelCards = [
        {
            title: 'Kinetix OS',
            category: 'Creative Engineering',
            year: '2026',
            color: 'from-purple-900/40 via-violet-950/60 to-black',
            accent: '#d4ff00',
            tag: 'Featured Flagship',
        },
        {
            title: 'Hyperion Audio',
            category: 'Brand & 3D Spatial',
            year: '2025',
            color: 'from-emerald-950/50 via-teal-950/70 to-black',
            accent: '#00f5ff',
            tag: 'Award Winner',
        },
        {
            title: 'Aura Robotics',
            category: 'Hardware Interface',
            year: '2025',
            color: 'from-amber-950/40 via-neutral-950/80 to-black',
            accent: '#ff9900',
            tag: 'Design System',
        },
    ];

    const [activeCardIndex, setActiveCardIndex] = useState(0);

    const scrollToWork = () => {
        const workSection = document.getElementById('featured-work');
        if (workSection) {
            workSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="relative min-h-[92vh] pt-32 pb-20 flex flex-col justify-between overflow-hidden">
            {/* Background Kinetic Gradients */}
            <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#d4ff00]/10 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute top-1/3 right-10 w-[30rem] h-[30rem] bg-indigo-500/10 rounded-full blur-[160px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                    
                    {/* Left Column: Kinetic Headline & Action */}
                    <div className="lg:col-span-7 space-y-8">
                        {/* Eyebrow Status Badge */}
                        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono tracking-wider uppercase text-neutral-300 backdrop-blur-md">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4ff00] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d4ff00]"></span>
                            </span>
                            <span>ACCEPTING SELECT Q3/Q4 COMMISSIONS</span>
                        </div>

                        {/* Kinetic Main H1 */}
                        <div className="space-y-2">
                            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-display font-extrabold tracking-tight leading-[1.05] text-white">
                                WE SHAPE <br />
                                UNFAIR ADVANTAGE FOR <br />
                                <span className="relative inline-block overflow-hidden h-[1.15em] align-top text-[#d4ff00]">
                                    <span
                                        key={currentWordIndex}
                                        className="inline-block transition-transform duration-500 ease-out animate-in slide-in-from-bottom-6"
                                    >
                                        {rotatingWords[currentWordIndex]}
                                    </span>
                                </span>
                            </h1>

                            <p className="text-lg sm:text-xl text-neutral-400 max-w-xl font-normal leading-relaxed pt-2">
                                CuttingEdger is a boundary-pushing design & technology agency. We transform audacious founders and global brands into untouchable market forces.
                            </p>
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-wrap items-center gap-4 pt-2">
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={scrollToWork}
                                withArrow
                            >
                                Explore Selected Work
                            </Button>

                            <Button
                                variant="secondary"
                                size="lg"
                                onClick={onOpenContact}
                            >
                                Initiate Project
                            </Button>
                        </div>

                        {/* Quick Trust Highlights */}
                        <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-6 max-w-lg">
                            <div>
                                <span className="block font-display font-extrabold text-2xl text-white">100%</span>
                                <span className="text-xs font-mono text-neutral-400 uppercase">Independent</span>
                            </div>
                            <div>
                                <span className="block font-display font-extrabold text-2xl text-[#d4ff00]">14+</span>
                                <span className="text-xs font-mono text-neutral-400 uppercase">Awwwards / FWA</span>
                            </div>
                            <div>
                                <span className="block font-display font-extrabold text-2xl text-white">&lt;0.5s</span>
                                <span className="text-xs font-mono text-neutral-400 uppercase">Edge Velocity</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Interactive 3D Work Reel Shuffle */}
                    <div className="lg:col-span-5 relative flex justify-center items-center py-8">
                        <div className="relative w-full max-w-md h-[430px]">
                            {reelCards.map((card, idx) => {
                                const offset = (idx - activeCardIndex + reelCards.length) % reelCards.length;
                                const isTop = offset === 0;

                                return (
                                    <div
                                        key={card.title}
                                        onClick={() => setActiveCardIndex((prev) => (prev + 1) % reelCards.length)}
                                        data-cursor-view="CLICK TO SHUFFLE"
                                        className={`absolute inset-0 rounded-3xl p-7 border border-white/15 bg-gradient-to-b ${card.color} backdrop-blur-xl shadow-2xl transition-all duration-700 ease-out cursor-pointer flex flex-col justify-between select-none`}
                                        style={{
                                            transform: `translateY(${offset * 18}px) scale(${1 - offset * 0.06})`,
                                            zIndex: reelCards.length - offset,
                                            opacity: 1 - offset * 0.2,
                                        }}
                                    >
                                        {/* Card Top Pill */}
                                        <div className="flex items-center justify-between">
                                            <span className="font-mono text-[11px] uppercase tracking-widest px-3 py-1 rounded-full bg-white/10 text-white/90 border border-white/10">
                                                {card.tag}
                                            </span>
                                            <span className="font-mono text-xs text-neutral-400">
                                                [{card.year}]
                                            </span>
                                        </div>

                                        {/* Visual Graphic Representation */}
                                        <div className="my-auto py-8">
                                            <div className="w-16 h-16 rounded-2xl border border-white/20 bg-white/5 flex items-center justify-center mb-6 shadow-inner">
                                                <Sparkles className="w-8 h-8 text-[#d4ff00]" />
                                            </div>
                                            <span className="font-mono text-xs uppercase tracking-widest text-[#d4ff00]">
                                                {card.category}
                                            </span>
                                            <h3 className="text-3xl font-display font-black text-white mt-1">
                                                {card.title}
                                            </h3>
                                        </div>

                                        {/* Card Bottom Strip */}
                                        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-neutral-400">
                                            <span>Case Study 0{idx + 1}</span>
                                            <div className="flex items-center gap-1.5 text-white font-medium group-hover:text-[#d4ff00]">
                                                <span>Shuffle Next</span>
                                                <ArrowUpRight className="w-4 h-4 text-[#d4ff00]" />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-8 flex items-center justify-between text-xs font-mono text-neutral-500">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#d4ff00]" />
                    <span className="uppercase tracking-widest">SCROLL TO REVEAL</span>
                </div>
                <button
                    type="button"
                    onClick={scrollToWork}
                    aria-label="Scroll down"
                    className="p-2 rounded-full border border-white/10 hover:border-[#d4ff00] hover:text-[#d4ff00] transition-colors"
                >
                    <ArrowDown className="w-4 h-4 animate-bounce" />
                </button>
            </div>
        </section>
    );
}
