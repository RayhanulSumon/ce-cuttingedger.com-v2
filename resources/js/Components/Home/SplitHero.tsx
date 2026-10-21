import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Sparkles } from 'lucide-react';
import { Button } from '@/Components/ui/button';

export function SplitHero({ onOpenContact }: { onOpenContact?: () => void }) {
    const heroRef = useRef<HTMLDivElement>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const activeAnimsRef = useRef<(Animation | null)[]>([]);
    const mousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const cacheMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const isInsideRef = useRef<boolean>(false);
    const cardIndexRef = useRef<number>(0);
    const zIndexCounterRef = useRef<number>(1);

    // Rotating kinetic agency disciplines
    const rotatingWords = [
        '3D SPATIAL CGI',
        '2D BRAND IDENTITY',
        'KINETIC SHADERS',
        'MOTION DIRECTION',
    ];
    const [currentWordIndex, setCurrentWordIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
        }, 3200);
        return () => clearInterval(interval);
    }, [rotatingWords.length]);

    // Curated high-res editorial showcase gallery (16 cards to ensure zero overlap glitches)
    const gallery = [
        {
            title: 'Kinetix OS',
            category: '3D Spatial Shaders',
            image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=700&q=80',
        },
        {
            title: 'Hyperion Audio',
            category: 'Acoustic CGI Modeling',
            image: 'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?auto=format&fit=crop&w=700&q=80',
        },
        {
            title: 'Vortex Protocol',
            category: 'Brand Architecture',
            image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80',
        },
        {
            title: 'Aura Dynamics',
            category: 'Telemetry Interface',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80',
        },
        {
            title: 'Sculptural Modern',
            category: '3D Spatial CGI',
            image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=700&q=80',
        },
        {
            title: 'Neon Horizon',
            category: 'Editorial Visuals',
            image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=80',
        },
        {
            title: 'Kinetic Shaders',
            category: 'WebGL Direction',
            image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=700&q=80',
        },
        {
            title: 'Ethereal Motion',
            category: 'Generative Art',
            image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=700&q=80',
        },
        {
            title: 'Monolith Brutalism',
            category: 'Spatial Identity',
            image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=700&q=80',
        },
        {
            title: 'Vektor Studio',
            category: 'Dynamic Systems',
            image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=700&q=80',
        },
        {
            title: 'Chromatic Shift',
            category: 'Light Shaders',
            image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=700&q=80',
        },
        {
            title: 'Cyber Matrix',
            category: 'Procedural CGI',
            image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=700&q=80',
        },
        {
            title: 'Prism Optics',
            category: 'Kinetic Glass',
            image: 'https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&w=700&q=80',
        },
        {
            title: 'Typographic Grid',
            category: 'Creative Direction',
            image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=700&q=80',
        },
        {
            title: 'Synapse Interface',
            category: 'Product Systems',
            image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=700&q=80',
        },
        {
            title: 'Collective Edge',
            category: 'Team Vanguard',
            image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=700&q=80',
        },
    ];

    // Spawns and animates the next image in the sequence using Agntix's exact physics
    const showNextImage = useCallback(() => {
        zIndexCounterRef.current += 1;
        const idx = cardIndexRef.current;
        cardIndexRef.current = (cardIndexRef.current + 1) % gallery.length;

        const el = cardRefs.current[idx];
        if (!el) return;

        // Cancel previous animation if this specific card was still animating
        if (activeAnimsRef.current[idx]) {
            activeAnimsRef.current[idx]?.cancel();
        }

        const cardW = 250;
        const cardH = 225;
        const startX = cacheMousePosRef.current.x - cardW / 2;
        const startY = cacheMousePosRef.current.y - cardH / 2;
        const endX = mousePosRef.current.x - cardW / 2;
        const endY = mousePosRef.current.y - cardH / 2;

        el.style.zIndex = String(zIndexCounterRef.current);

        // Exact Agntix 2-phase GPU motion:
        // 1. (0 to 0.4s): smoothly glides from cacheMousePos to mousePos (scale: 1, opacity: 1)
        // 2. (0.4s to 0.8s): smoothly scales down to 0.2 and dissolves to opacity 0 at mousePos
        const anim = el.animate(
            [
                {
                    opacity: 1,
                    transform: `translate3d(${startX}px, ${startY}px, 0) scale(1)`,
                    easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
                    offset: 0,
                },
                {
                    opacity: 1,
                    transform: `translate3d(${endX}px, ${endY}px, 0) scale(1)`,
                    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
                    offset: 0.5,
                },
                {
                    opacity: 0,
                    transform: `translate3d(${endX}px, ${endY}px, 0) scale(0.2)`,
                    offset: 1,
                },
            ],
            {
                duration: 800,
                fill: 'forwards',
            }
        );

        activeAnimsRef.current[idx] = anim;

        anim.onfinish = () => {
            if (activeAnimsRef.current[idx] === anim) {
                activeAnimsRef.current[idx] = null;
            }
        };
    }, [gallery.length]);

    // Independent requestAnimationFrame render loop with linear interpolation (lerp)
    useEffect(() => {
        let animationFrameId: number;
        const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b;

        const render = () => {
            if (isInsideRef.current) {
                // Smoothly interpolate between cached mouse position and current mouse position (0.1 lerp)
                cacheMousePosRef.current.x = lerp(
                    cacheMousePosRef.current.x || mousePosRef.current.x,
                    mousePosRef.current.x,
                    0.1
                );
                cacheMousePosRef.current.y = lerp(
                    cacheMousePosRef.current.y || mousePosRef.current.y,
                    mousePosRef.current.y,
                    0.1
                );

                // Calculate distance between current cursor position and last triggered position
                const dist = Math.hypot(
                    mousePosRef.current.x - lastMousePosRef.current.x,
                    mousePosRef.current.y - lastMousePosRef.current.y
                );

                // Distance threshold (75px) to show the next image in the trail
                if (dist > 75) {
                    lastMousePosRef.current = { ...mousePosRef.current };
                    showNextImage();
                }
            }

            animationFrameId = requestAnimationFrame(render);
        };

        animationFrameId = requestAnimationFrame(render);
        return () => cancelAnimationFrame(animationFrameId);
    }, [showNextImage]);

    // Lightweight pointer handlers (0 React re-renders, strictly updating refs)
    const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!heroRef.current) return;
        const rect = heroRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        isInsideRef.current = true;
        mousePosRef.current = { x, y };
        cacheMousePosRef.current = { x, y };
        lastMousePosRef.current = { x, y };
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!heroRef.current) return;
        const rect = heroRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        if (!isInsideRef.current) {
            isInsideRef.current = true;
            cacheMousePosRef.current = { x, y };
            lastMousePosRef.current = { x, y };
        }
        mousePosRef.current = { x, y };
    }, []);

    const handleMouseLeave = useCallback(() => {
        isInsideRef.current = false;
    }, []);

    // 3D & 2D Interactive Work Reel Shuffle Cards
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
            if (typeof window !== 'undefined' && (window as any).lenis) {
                (window as any).lenis.scrollTo(workSection, { offset: -30 });
            } else {
                workSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <section
            ref={heroRef}
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative min-h-[94vh] pt-32 pb-16 flex flex-col justify-between overflow-hidden bg-[#090a0d] text-white select-none"
        >
            {/* AMBIENT BACKGROUND GLOWS */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-0 w-[36rem] h-[36rem] bg-[#d4ff00]/10 rounded-full blur-[170px]" />
                <div className="absolute top-1/3 right-10 w-[40rem] h-[40rem] bg-indigo-600/15 rounded-full blur-[190px]" />
            </div>

            {/* PRE-MOUNTED HIGH-PERFORMANCE TRAIL CARDS POOL (AGNTIX 16-CARD HARDWARE ACCELERATED POOL) */}
            <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
                {gallery.map((item, idx) => (
                    <div
                        key={idx}
                        ref={(el) => {
                            cardRefs.current[idx] = el;
                        }}
                        style={{
                            opacity: 0,
                            transform: 'translate3d(-9999px, -9999px, 0)',
                        }}
                        className="pointer-events-none absolute w-[240px] sm:w-[250px] h-[215px] sm:h-[225px] rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_20px_rgba(212,255,0,0.1)] border border-white/20 will-change-transform bg-neutral-900"
                    >
                        <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover object-center scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-3.5">
                            <span className="font-mono text-[10px] uppercase tracking-widest text-[#d4ff00]">
                                {item.category}
                            </span>
                            <span className="font-['Antonio',_'Bebas_Neue',_sans-serif] uppercase text-sm font-bold text-white tracking-wider">
                                {item.title}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* MAIN MODERN AGENCY HERO CONTENT (Option A Modern Format) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                    {/* Left Column: Kinetic Headline & Rotating Disciplines */}
                    <div className="lg:col-span-7 space-y-8">
                        {/* Eyebrow Status Badge */}
                        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-neutral-300">
                            <span className="w-2 h-2 rounded-full bg-[#d4ff00] animate-pulse" />
                            <span className="uppercase tracking-widest">
                                AVAILABLE FOR COMMISSIONS // 2026 ARCHITECTURE
                            </span>
                        </div>

                        {/* Kinetic Main Headline */}
                        <div className="space-y-4">
                            <h1 className="text-5xl sm:text-7xl lg:text-[5.5rem] font-['Antonio',_'Bebas_Neue',_'Syne',_sans-serif] uppercase font-bold text-white tracking-tight leading-[1.02]">
                                WE SCULPT <br />
                                UNFAIR ADVANTAGE FOR <br />
                                <span className="overflow-hidden h-[1.25em] relative block text-[#d4ff00] pt-1">
                                    <AnimatePresence mode="wait">
                                        <motion.span
                                            key={rotatingWords[currentWordIndex]}
                                            initial={{ y: 35, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            exit={{ y: -35, opacity: 0 }}
                                            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                                            className="block whitespace-nowrap"
                                        >
                                            IN {rotatingWords[currentWordIndex]}
                                        </motion.span>
                                    </AnimatePresence>
                                </span>
                            </h1>

                            <p className="text-lg sm:text-xl text-neutral-400 max-w-xl font-normal leading-relaxed pt-2">
                                CuttingEdger is a boundary-pushing design &amp; technology agency. We transform audacious founders and global brands into untouchable market forces.
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
                                <span className="block font-['Antonio',_'Bebas_Neue',_sans-serif] font-bold text-3xl text-white">100%</span>
                                <span className="text-xs font-mono text-neutral-400 uppercase">Independent</span>
                            </div>
                            <div>
                                <span className="block font-['Antonio',_'Bebas_Neue',_sans-serif] font-bold text-3xl text-[#d4ff00]">14+</span>
                                <span className="text-xs font-mono text-neutral-400 uppercase">Awwwards / FWA</span>
                            </div>
                            <div>
                                <span className="block font-['Antonio',_'Bebas_Neue',_sans-serif] font-bold text-3xl text-white">&lt;0.5s</span>
                                <span className="text-xs font-mono text-neutral-400 uppercase">Edge Velocity</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Interactive 3D Work Reel Shuffle */}
                    <div className="lg:col-span-5 relative flex justify-center items-center py-8">
                        <div className="relative w-full max-w-md h-[430px]">
                            {reelCards.map((card, idx) => {
                                const offset = (idx - activeCardIndex + reelCards.length) % reelCards.length;

                                return (
                                    <div
                                        key={card.title}
                                        onClick={() => setActiveCardIndex((prev) => (prev + 1) % reelCards.length)}
                                        data-cursor-view="CLICK TO SHUFFLE"
                                        className={`absolute inset-0 rounded-3xl p-7 border border-white/15 bg-gradient-to-b ${card.color} backdrop-blur-xl shadow-2xl transition-all duration-700 ease-out cursor-pointer flex flex-col justify-between select-none group`}
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
                                            <div className="w-16 h-16 rounded-2xl border border-white/20 bg-white/5 flex items-center justify-center mb-6 shadow-inner group-hover:bg-[#d4ff00]/10 transition-colors">
                                                <Sparkles className="w-8 h-8 text-[#d4ff00]" />
                                            </div>
                                            <span className="font-mono text-xs uppercase tracking-widest text-[#d4ff00]">
                                                {card.category}
                                            </span>
                                            <h3 className="text-3xl font-['Antonio',_'Bebas_Neue',_sans-serif] uppercase font-bold text-white mt-1">
                                                {card.title}
                                            </h3>
                                        </div>

                                        {/* Card Bottom Strip */}
                                        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-neutral-400">
                                            <span>Case Study 0{idx + 1}</span>
                                            <div className="flex items-center gap-1.5 text-white font-medium group-hover:text-[#d4ff00] transition-colors">
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-8 flex items-center justify-between text-xs font-mono text-neutral-500 relative z-20">
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
