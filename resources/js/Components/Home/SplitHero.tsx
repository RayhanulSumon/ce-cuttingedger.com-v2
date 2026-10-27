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
        'IMAGE EDITING',
        '3D CGI & PRODUCT',
        'GHOST MANNEQUIN',
        'JEWELRY RETOUCH',
        'CLIPPING PATHS',
        'DESKTOP PUBLISHING',
    ];
    const [currentWordIndex, setCurrentWordIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
        }, 2800);
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

    const isScrollingRef = useRef<boolean>(false);
    const clientPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const lastClientPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

    // Spawns and animates the next image in the sequence using Agntix's exact physics
    const showNextImage = useCallback(() => {
        if (isScrollingRef.current) return;
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

    // Track active scrolling to prevent trail card flickering while scrolling
    useEffect(() => {
        let scrollTimeout: ReturnType<typeof setTimeout>;
        const onScroll = () => {
            isScrollingRef.current = true;
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                isScrollingRef.current = false;
                if (heroRef.current && isInsideRef.current) {
                    const rect = heroRef.current.getBoundingClientRect();
                    const x = clientPosRef.current.x - rect.left;
                    const y = clientPosRef.current.y - rect.top;
                    mousePosRef.current = { x, y };
                    cacheMousePosRef.current = { x, y };
                    lastMousePosRef.current = { x, y };
                    lastClientPosRef.current = { ...clientPosRef.current };
                }
            }, 100);
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', onScroll);
            clearTimeout(scrollTimeout);
        };
    }, []);

    // Independent requestAnimationFrame render loop with linear interpolation (lerp)
    useEffect(() => {
        let animationFrameId: number;
        const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b;

        const render = () => {
            if (isInsideRef.current && !isScrollingRef.current) {
                // Smoothly interpolate between cached mouse position and current mouse position (0.15 lerp)
                cacheMousePosRef.current.x = lerp(
                    cacheMousePosRef.current.x || mousePosRef.current.x,
                    mousePosRef.current.x,
                    0.15
                );
                cacheMousePosRef.current.y = lerp(
                    cacheMousePosRef.current.y || mousePosRef.current.y,
                    mousePosRef.current.y,
                    0.15
                );

                // Calculate distance based strictly on physical SCREEN movement (clientX/Y)
                // This guarantees zero false triggers when the window scrolls!
                const dist = Math.hypot(
                    clientPosRef.current.x - lastClientPosRef.current.x,
                    clientPosRef.current.y - lastClientPosRef.current.y
                );

                // Distance threshold (75px) to show the next image in the trail
                if (dist > 75) {
                    lastClientPosRef.current = { ...clientPosRef.current };
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
        clientPosRef.current = { x: e.clientX, y: e.clientY };
        lastClientPosRef.current = { x: e.clientX, y: e.clientY };
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
            lastClientPosRef.current = { x: e.clientX, y: e.clientY };
        }
        mousePosRef.current = { x, y };
        clientPosRef.current = { x: e.clientX, y: e.clientY };
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
            accent: '#fbb718',
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
            className="relative min-h-[100svh] lg:min-h-[calc(100vh-4.5rem)] xl:min-h-[94vh] pt-24 sm:pt-28 lg:pt-24 xl:pt-28 2xl:pt-32 pb-6 sm:pb-8 lg:pb-6 xl:pb-10 flex flex-col justify-between overflow-hidden bg-[#090a0d] text-white select-none"
        >
            {/* AMBIENT BACKGROUND GLOWS */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-0 w-[36rem] h-[36rem] bg-accent/10 rounded-full blur-[170px]" />
                <div className="absolute top-1/3 right-10 w-[40rem] h-[40rem] bg-indigo-600/15 rounded-full blur-[190px]" />
            </div>

            {/* PRE-MOUNTED HIGH-PERFORMANCE TRAIL CARDS POOL (AGNTIX 16-CARD HARDWARE ACCELERATED POOL) */}
            <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden hidden md:block">
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
                        className="pointer-events-none absolute w-[240px] sm:w-[250px] h-[215px] sm:h-[225px] rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_20px_rgba(251,183,24,0.1)] border border-white/20 will-change-transform bg-neutral-900"
                    >
                        <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover object-center scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-3.5">
                            <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
                                {item.category}
                            </span>
                            <span className="font-display text-sm font-bold text-white tracking-wide">
                                {item.title}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* MAIN MODERN AGENCY HERO CONTENT */}
            <div className="max-w-7xl mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 w-full my-auto relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 xl:gap-8 items-center">
                    {/* Left Column: Kinetic Headline & Rotating Disciplines */}
                    <div className="lg:col-span-7 space-y-4 sm:space-y-6 lg:space-y-4 xl:space-y-6 2xl:space-y-7">
                        {/* Eyebrow Status Badge */}
                        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] sm:text-xs font-mono text-neutral-300">
                            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                            <span className="uppercase tracking-widest">
                                AVAILABLE FOR COMMISSIONS // 2026 ARCHITECTURE
                            </span>
                        </div>

                        {/* Kinetic Main Headline with perfect wrapping and responsive font size */}
                        <div className="space-y-2.5 sm:space-y-3">
                            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-[2.75rem] xl:text-[3.65rem] 2xl:text-[4.5rem] font-['Clash_Display',_'Syne',_'Outfit',_sans-serif] uppercase font-bold text-white tracking-tight leading-[1.08] lg:leading-[1.06]">
                                ARE YOU <br />
                                LOOKING FOR <br />
                                <span className="flex items-baseline flex-wrap gap-x-3 text-white">
                                    <span className="overflow-hidden min-h-[1.2em] h-[1.25em] inline-block relative text-accent max-w-full">
                                        <AnimatePresence mode="wait">
                                            <motion.span
                                                key={rotatingWords[currentWordIndex]}
                                                initial={{ y: 35, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                exit={{ y: -35, opacity: 0 }}
                                                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                                                className="inline-block whitespace-nowrap"
                                            >
                                                {rotatingWords[currentWordIndex]}
                                            </motion.span>
                                        </AnimatePresence>
                                    </span>
                                </span>
                            </h1>

                            <p className="text-sm sm:text-base lg:text-sm xl:text-base 2xl:text-lg text-neutral-300 max-w-xl font-['Roboto',_sans-serif] font-black leading-relaxed pt-0.5 tracking-wide">
                                CuttingEdger delivers surgical 2D photo editing and photorealistic 3D product CGI for high-growth e-commerce brands, fashion houses, and advertising agencies worldwide.
                            </p>
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1 sm:pt-2">
                            <Button asChild size="lg" className="h-10 sm:h-11 px-5 sm:px-6 text-xs sm:text-sm">
                                <a href="#trial-uploader-section">
                                    Try 3 Images Free
                                    <ArrowUpRight className="w-4 h-4" />
                                </a>
                            </Button>

                            <Button
                                variant="secondary"
                                size="lg"
                                onClick={onOpenContact}
                                className="h-10 sm:h-11 px-5 sm:px-6 text-xs sm:text-sm"
                            >
                                Instant Volume Quote
                            </Button>
                        </div>

                        {/* Quick Trust Highlights */}
                        <div className="pt-4 sm:pt-5 xl:pt-6 border-t border-white/10 grid grid-cols-3 gap-3 sm:gap-6 max-w-lg">
                            <div>
                                <span className="block font-['Clash_Display',_'Syne',_sans-serif] font-bold text-xl sm:text-2xl xl:text-3xl text-white">10K+</span>
                                <span className="text-[10px] sm:text-xs font-mono text-neutral-400 uppercase tracking-wider">Daily Images</span>
                            </div>
                            <div>
                                <span className="block font-['Clash_Display',_'Syne',_sans-serif] font-bold text-xl sm:text-2xl xl:text-3xl text-accent">99.8%</span>
                                <span className="text-[10px] sm:text-xs font-mono text-neutral-400 uppercase tracking-wider">First-Pass QA</span>
                            </div>
                            <div>
                                <span className="block font-['Clash_Display',_'Syne',_sans-serif] font-bold text-xl sm:text-2xl xl:text-3xl text-white">&lt;12h</span>
                                <span className="text-[10px] sm:text-xs font-mono text-neutral-400 uppercase tracking-wider">Turnaround SLA</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: High-Impact Visual Showcase Cards with Rich Imagery */}
                    <div className="lg:col-span-5 relative flex justify-center items-center py-4 lg:py-0">
                        <div className="relative w-full max-w-[280px] xs:max-w-xs sm:max-w-sm lg:max-w-[340px] xl:max-w-md h-[310px] xs:h-[350px] sm:h-[390px] lg:h-[370px] xl:h-[430px] 2xl:h-[470px]">
                            {reelCards.map((card, idx) => {
                                const offset = (idx - activeCardIndex + reelCards.length) % reelCards.length;

                                return (
                                    <div
                                        key={card.title}
                                        onClick={() => setActiveCardIndex((prev) => (prev + 1) % reelCards.length)}
                                        data-cursor-view="CLICK TO SHUFFLE"
                                        className={`absolute inset-0 rounded-[24px] sm:rounded-[28px] overflow-hidden border border-white/15 bg-[#10121a] shadow-[0_30px_90px_rgba(0,0,0,0.95)] transition-all duration-700 ease-out cursor-pointer flex flex-col justify-between select-none group`}
                                        style={{
                                            transform: `translateY(${offset * 14}px) scale(${1 - offset * 0.05})`,
                                            zIndex: reelCards.length - offset,
                                            opacity: 1 - offset * 0.18,
                                        }}
                                    >
                                        {/* Background Showcase Imagery */}
                                        <div className="absolute inset-0">
                                            <img
                                                src={card.preview}
                                                alt={card.title}
                                                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 contrast-110"
                                            />
                                            {/* Layered Film Vignette Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60" />
                                        </div>

                                        {/* Card Top Pill Badge */}
                                        <div className="relative z-10 p-4 sm:p-5 xl:p-6 flex items-center justify-between">
                                            <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white/90 border border-white/20">
                                                {card.tag}
                                            </span>
                                            <span className="font-mono text-[11px] sm:text-xs text-white/80 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-black/40 backdrop-blur-md">
                                                [{card.year}]
                                            </span>
                                        </div>

                                        {/* Bottom Information Section */}
                                        <div className="relative z-10 p-4 sm:p-5 xl:p-6 space-y-2 sm:space-y-3 bg-gradient-to-t from-black/95 via-black/80 to-transparent pt-8 sm:pt-10 xl:pt-12">
                                            <div className="flex items-center justify-between">
                                                <span className="font-mono text-[11px] sm:text-xs uppercase tracking-widest text-accent font-semibold">
                                                    {card.category}
                                                </span>
                                                <span className="text-[10px] font-mono uppercase text-neutral-400">
                                                    0{idx + 1} / 0{reelCards.length}
                                                </span>
                                            </div>

                                            <h3 className="text-2xl sm:text-3xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-['Clash_Display',_'Syne',_sans-serif] uppercase font-bold text-white tracking-wide">
                                                {card.title}
                                            </h3>

                                            {/* Shuffle Trigger Footer */}
                                            <div className="pt-2 sm:pt-3 border-t border-white/10 flex items-center justify-between text-[11px] sm:text-xs font-mono">
                                                <span className="text-neutral-400">Click to shuffle</span>
                                                <div className="flex items-center gap-1.5 text-white font-semibold group-hover:text-accent transition-colors">
                                                    <span>Next Reel</span>
                                                    <ArrowUpRight className="w-3.5 h-3.5 text-accent transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                                </div>
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-4 sm:pt-6 lg:pt-3 xl:pt-6 flex items-center justify-between text-xs font-mono text-neutral-500 relative z-20">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent" />
                    <span className="uppercase tracking-widest text-[11px] sm:text-xs">SCROLL TO REVEAL</span>
                </div>
                <button
                    type="button"
                    onClick={scrollToWork}
                    aria-label="Scroll down"
                    className="p-1.5 sm:p-2 rounded-full border border-white/10 hover:border-accent hover:text-accent transition-colors cursor-pointer"
                >
                    <ArrowDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-bounce" />
                </button>
            </div>
        </section>
    );
}
