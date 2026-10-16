import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Sparkles } from 'lucide-react';
import { Button } from '@/Components/UI/Button';

export function SplitHero({ onOpenContact }: { onOpenContact?: () => void }) {
    const rotatingWords = [
        '3D MOTION & CGI',
        '2D GRAPHIC IDENTITY',
        'SPATIAL EXPERIENCES',
        'KINETIC PLATFORMS',
    ];

    const [currentWordIndex, setCurrentWordIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
        }, 3200);

        return () => clearInterval(interval);
    }, []);

    // 3D & 2D Reel Cards
    const reelCards = [
        {
            title: 'Kinetix OS',
            category: '3D Spatial Shaders',
            year: '2026',
            color: 'from-purple-950/60 via-[#10121a] to-black',
            accent: '#d4ff00',
            tag: '3D Real-Time WebGL',
            preview: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
        },
        {
            title: 'Hyperion Audio',
            category: 'Acoustic 3D Renderings',
            year: '2025',
            color: 'from-emerald-950/60 via-[#10121a] to-black',
            accent: '#00f5ff',
            tag: 'CGI Product Modeling',
            preview: 'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?auto=format&fit=crop&w=800&q=80',
        },
        {
            title: 'Vortex Capital',
            category: '2D Vector Identity',
            year: '2025',
            color: 'from-amber-950/60 via-[#10121a] to-black',
            accent: '#ff9900',
            tag: 'Brand Architecture',
            preview: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=800&q=80',
        },
    ];

    const [activeCardIndex, setActiveCardIndex] = useState(0);

    const scrollToWork = () => {
        const workSection = document.getElementById('featured-work');
        if (workSection) {
            workSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.12,
                delayChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 28 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
        },
    };

    return (
        <section className="relative min-h-[94vh] pt-32 pb-16 flex flex-col justify-between overflow-hidden bg-[#090a0d]">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 left-0 w-[32rem] h-[32rem] bg-[#d4ff00]/10 rounded-full blur-[160px] pointer-events-none" />
            <div className="absolute top-1/3 right-10 w-[36rem] h-[36rem] bg-indigo-600/10 rounded-full blur-[180px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto">
                <motion.div
                    className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Left Column: Kinetic Headline & Staggered Typography */}
                    <div className="lg:col-span-7 space-y-8">
                        {/* Eyebrow Status Badge */}
                        <motion.div variants={itemVariants}>
                            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-mono tracking-widest uppercase text-neutral-300 backdrop-blur-md">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4ff00] opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d4ff00]"></span>
                                </span>
                                <span>2D & 3D CREATIVE STUDIO COMMISSIONS</span>
                            </div>
                        </motion.div>

                        {/* Kinetic Agntix-Style Tall Condensed H1 */}
                        <div className="space-y-3">
                            <motion.h1
                                variants={itemVariants}
                                className="text-5xl sm:text-7xl xl:text-8xl font-['Antonio',_'Bebas_Neue',_'Syne',_sans-serif] uppercase font-bold tracking-tight leading-[0.95] text-white"
                            >
                                WE SHAPE <br />
                                RADICAL GRAPHICS & <br />
                                <span className="relative inline-block overflow-hidden h-[1.12em] align-top text-[#d4ff00]">
                                    <AnimatePresence mode="wait">
                                        <motion.span
                                            key={currentWordIndex}
                                            initial={{ y: 50, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            exit={{ y: -50, opacity: 0 }}
                                            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                                            className="inline-block whitespace-nowrap"
                                        >
                                            {rotatingWords[currentWordIndex]}
                                        </motion.span>
                                    </AnimatePresence>
                                </span>
                            </motion.h1>

                            <motion.p
                                variants={itemVariants}
                                className="text-lg sm:text-xl text-neutral-400 max-w-xl font-normal leading-relaxed pt-2"
                            >
                                CuttingEdger is a creative powerhouse crafting bespoke 2D visual identities, CGI 3D product visualizers, and kinetic web platforms that dominate categories.
                            </motion.p>
                        </div>

                        {/* CTAs */}
                        <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 pt-2">
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={scrollToWork}
                                withArrow
                            >
                                Explore 2D/3D Work
                            </Button>

                            <Button
                                variant="secondary"
                                size="lg"
                                onClick={onOpenContact}
                            >
                                Commission Studio
                            </Button>
                        </motion.div>

                        {/* Quick Metrics */}
                        <motion.div
                            variants={itemVariants}
                            className="pt-6 border-t border-white/10 grid grid-cols-3 gap-6 max-w-lg"
                        >
                            <div>
                                <span className="block font-['Antonio',_'Syne',_sans-serif] text-3xl font-bold text-white">
                                    350+
                                </span>
                                <span className="text-xs font-mono text-neutral-400 uppercase">3D & CGI Renders</span>
                            </div>
                            <div>
                                <span className="block font-['Antonio',_'Syne',_sans-serif] text-3xl font-bold text-[#d4ff00]">
                                    100%
                                </span>
                                <span className="text-xs font-mono text-neutral-400 uppercase">Bespoke Vector</span>
                            </div>
                            <div>
                                <span className="block font-['Antonio',_'Syne',_sans-serif] text-3xl font-bold text-white">
                                    &lt;12ms
                                </span>
                                <span className="text-xs font-mono text-neutral-400 uppercase">Shader Latency</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Interactive 3D Work Reel Shuffle with Framer Motion */}
                    <div className="lg:col-span-5 relative flex justify-center items-center py-8">
                        <div className="relative w-full max-w-md h-[450px]">
                            {reelCards.map((card, idx) => {
                                const offset = (idx - activeCardIndex + reelCards.length) % reelCards.length;
                                const isTop = offset === 0;

                                return (
                                    <motion.div
                                        key={card.title}
                                        onClick={() => setActiveCardIndex((prev) => (prev + 1) % reelCards.length)}
                                        data-cursor-view="CLICK TO SHUFFLE"
                                        animate={{
                                            y: offset * 20,
                                            scale: 1 - offset * 0.05,
                                            opacity: 1 - offset * 0.22,
                                            zIndex: reelCards.length - offset,
                                        }}
                                        transition={{
                                            type: 'spring',
                                            stiffness: 260,
                                            damping: 24,
                                        }}
                                        whileHover={isTop ? { y: -6, scale: 1.02 } : {}}
                                        className={`absolute inset-0 rounded-3xl p-7 border border-white/15 bg-gradient-to-b ${card.color} backdrop-blur-2xl shadow-2xl cursor-pointer flex flex-col justify-between select-none overflow-hidden`}
                                    >
                                        {/* Card Top Pill */}
                                        <div className="flex items-center justify-between relative z-10">
                                            <span className="font-mono text-[11px] uppercase tracking-widest px-3 py-1 rounded-full bg-white/10 text-white/90 border border-white/10">
                                                {card.tag}
                                            </span>
                                            <span className="font-mono text-xs text-neutral-400">
                                                [{card.year}]
                                            </span>
                                        </div>

                                        {/* Visual Thumbnail Preview */}
                                        <div className="relative my-auto py-4">
                                            <div className="relative rounded-2xl overflow-hidden aspect-[16/10] border border-white/10 mb-4 bg-black/40">
                                                <img
                                                    src={card.preview}
                                                    alt={card.title}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                            </div>

                                            <span className="font-mono text-xs uppercase tracking-widest text-[#d4ff00]">
                                                {card.category}
                                            </span>
                                            <h3 className="text-3xl font-['Antonio',_'Syne',_sans-serif] uppercase font-bold text-white mt-0.5">
                                                {card.title}
                                            </h3>
                                        </div>

                                        {/* Card Bottom Strip */}
                                        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-neutral-400 relative z-10">
                                            <span>Case Study 0{idx + 1}</span>
                                            <div className="flex items-center gap-1.5 text-white font-medium">
                                                <span>Shuffle Next</span>
                                                <ArrowUpRight className="w-4 h-4 text-[#d4ff00]" />
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>
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
                    className="p-2 rounded-full border border-white/10 hover:border-[#d4ff00] hover:text-[#d4ff00] transition-colors cursor-pointer"
                >
                    <ArrowDown className="w-4 h-4 animate-bounce" />
                </button>
            </div>
        </section>
    );
}
