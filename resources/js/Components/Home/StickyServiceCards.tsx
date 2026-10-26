import React, { useRef, useState, useMemo } from 'react';
import { Link } from '@inertiajs/react';
import {
    motion,
    useScroll,
    useTransform,
    useMotionValueEvent,
    useMotionValue,
    useSpring,
} from 'framer-motion';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { Service } from '@/types/models';

interface ServiceCardItem {
    id: number | string;
    title: string;
    slug: string;
    image: string;
    categories: string[];
    year: string | number;
    description: string;
}

const DEFAULT_SERVICES: ServiceCardItem[] = [
    {
        id: 1,
        title: 'E-Commerce Catalog Optimization',
        slug: 'ecommerce-catalog-optimization',
        image: '/images/portfolio/portfolio-4.jpg',
        categories: ['Vector Clipping Path', 'Ghost Mannequin', 'Alpha Masking'],
        year: 2026,
        description: 'Industrial-scale clipping paths, hand-drawn Bézier curves, multi-channel masking, and ghost mannequin composites for high-volume retailers.',
    },
    {
        id: 2,
        title: 'Color Standardization Services',
        slug: 'color-standardization',
        image: '/images/portfolio/portfolio-1.jpg',
        categories: ['Delta-E Swatch Matching', 'Apparel Colorways', 'Pantone Tuning'],
        year: 2026,
        description: 'Sub-1 Delta-E physical fabric swatch calibration, specular highlight balancing, and multi-colorway batch generation without reshoots.',
    },
    {
        id: 3,
        title: 'White-Label Agency Extension',
        slug: 'white-label-agency-extension',
        image: '/images/portfolio/portfolio-2.jpg',
        categories: ['Strict NDA Bandwidth', '24/7 Overnight Studio', 'Sub-12h SLA'],
        year: 2026,
        description: 'Dedicated overnight production bandwidth for advertising agencies and commercial studios under airtight non-disclosure agreements.',
    },
    {
        id: 4,
        title: 'Virtual Production & CGI Studio',
        slug: 'virtual-production-cgi',
        image: '/images/portfolio/portfolio-3.jpg',
        categories: ['3D Furniture Modeling', 'Photorealistic CGI Renders', '8K AR Ready'],
        year: 2026,
        description: 'From CAD blueprints to 8K photorealistic digital twins. PBR material physics, studio lighting environments, and interactive WebGL assets.',
    },
];

interface CardViewProps {
    item: ServiceCardItem;
    style: any;
    zIndex: number;
    dimOpacity?: any;
}

function CardView({ item, style, zIndex, dimOpacity }: CardViewProps) {
    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);
    const [isHovered, setIsHovered] = useState(false);

    // High performance GPU spring physics (0 React re-renders on mousemove)
    const springConfig = { damping: 28, stiffness: 350, mass: 0.15 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (
        <motion.article
            style={{
                ...style,
                zIndex,
                transformOrigin: 'top center',
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
            className="absolute inset-0 w-full h-full rounded-[24px] sm:rounded-[36px] overflow-hidden border border-white/15 bg-neutral-950 shadow-[0_25px_70px_rgba(0,0,0,0.85)] group select-none will-change-transform [transform:translateZ(0)] [backface-visibility:hidden]"
        >
            {/* Full-bleed background image */}
            <div className="absolute inset-0 z-0">
                <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                {/* Layered vignette gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/50 pointer-events-none" />
                
                {/* Hardware-accelerated dim overlay (replaces expensive CSS filter:brightness) */}
                {dimOpacity && (
                    <motion.div
                        style={{ opacity: dimOpacity }}
                        className="absolute inset-0 bg-black pointer-events-none transition-opacity"
                    />
                )}
            </div>

            {/* Clickable Card Link to Service */}
            <Link
                href={`/services/${item.slug}`}
                className="absolute inset-0 z-20"
                aria-label={`Explore ${item.title} service`}
            />

            {/* Card Top Bar: Frosted Glass Capsule Pills */}
            <div className="relative z-30 p-6 sm:p-8 lg:p-10 flex items-center justify-between pointer-events-none">
                {/* Left: Categories */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    {item.categories.map((cat, cIdx) => (
                        <span
                            key={cIdx}
                            className="px-3.5 sm:px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs font-mono uppercase tracking-wider text-white font-medium shadow-sm group-hover:border-white/40 transition-colors"
                        >
                            {cat}
                        </span>
                    ))}
                </div>

                {/* Right: Year Tag */}
                <span className="px-3.5 sm:px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs font-mono text-white font-semibold shadow-sm">
                    [{item.year}]
                </span>
            </div>

            {/* Card Bottom Bar: Unobstructed Image with Title & CTA */}
            <div className="absolute bottom-6 sm:bottom-8 inset-x-6 sm:inset-x-8 lg:inset-x-10 z-30 flex flex-col sm:flex-row sm:items-end justify-between gap-4 pointer-events-none">
                <div className="space-y-2 max-w-xl">
                    <span className="px-4 sm:px-5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs font-mono font-bold text-[#d4ff00] uppercase tracking-wider shadow-lg inline-block">
                        Discipline 0{item.id}
                    </span>
                    <h3 className="text-2xl sm:text-4xl lg:text-5xl font-['Clash_Display',_'Syne',_sans-serif] uppercase font-bold text-white tracking-tight leading-tight">
                        {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed line-clamp-2">
                        {item.description}
                    </p>
                </div>

                {/* Direct Action Pill */}
                <div className="pointer-events-auto shrink-0">
                    <span className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-[#d4ff00] text-black font-display font-bold text-xs uppercase tracking-wider group-hover:bg-[#c2eb00] group-hover:shadow-[0_0_20px_rgba(212,255,0,0.4)] transition-all">
                        <span>Explore Discipline</span>
                        <ArrowUpRight className="w-4 h-4 text-black stroke-[2.5]" />
                    </span>
                </div>
            </div>

            {/* Hardware-Accelerated Frosted Dark Glass GPU Mouse Follower Pill */}
            <motion.div
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{
                    opacity: isHovered ? 1 : 0,
                    scale: isHovered ? 1 : 0.7,
                }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="pointer-events-none absolute top-0 left-0 z-40 hidden sm:flex items-center gap-2.5 px-4 py-2 rounded-full bg-black/85 backdrop-blur-xl border border-white/25 text-white shadow-[0_20px_45px_rgba(0,0,0,0.9),0_0_20px_rgba(212,255,0,0.18)] will-change-transform select-none"
            >
                <span className="w-2 h-2 rounded-full bg-[#d4ff00] shadow-[0_0_8px_#d4ff00] shrink-0" />
                <span className="font-['Clash_Display',_'Syne',_sans-serif] text-[11px] uppercase font-semibold tracking-wider text-white whitespace-nowrap">
                    Explore Service
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#d4ff00]" />
            </motion.div>
        </motion.article>
    );
}

interface StickyServiceCardsProps {
    services?: Service[];
}

export function StickyServiceCards({ services }: StickyServiceCardsProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    // Track total scroll progress across the collapsible cards journey
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    const progress = scrollYProgress;

    // Active Card Pagination Tracker
    useMotionValueEvent(progress, 'change', (latest) => {
        if (latest < 0.28) setActiveIndex(0);
        else if (latest < 0.58) setActiveIndex(1);
        else if (latest < 0.85) setActiveIndex(2);
        else setActiveIndex(3);
    });

    // Dynamic resolution prioritizing core services
    const activeCards: ServiceCardItem[] = useMemo(() => {
        if (!services || services.length === 0) {
            return DEFAULT_SERVICES;
        }

        const slugImageMap: Record<string, { image: string; fallbackCategories: string[]; description: string }> = {
            'high-end-model-retouch': {
                image: '/images/portfolio/portfolio-1.jpg',
                fallbackCategories: ['High-End Fashion & Jewelry', 'Model Retouch'],
                description: 'Micro dodge & burn skin contouring and frequency separation while preserving authentic pores and natural texture.',
            },
            'ghost-mannequin': {
                image: '/images/portfolio/portfolio-2.jpg',
                fallbackCategories: ['Invisible Mannequin', 'Apparel Retouch'],
                description: 'Seamless 3D hollow neck and hem joint composites with natural fabric drape and custom drop shadows.',
            },
            'jewelry-retouch': {
                image: '/images/portfolio/portfolio-3.jpg',
                fallbackCategories: ['Fine Jewelry Retouch', 'Gemstone Polish'],
                description: 'Macro facet fire sharpening, platinum luster balancing, and zero-glare white background isolation.',
            },
            'background-removal': {
                image: '/images/portfolio/portfolio-4.jpg',
                fallbackCategories: ['Vector Clipping Path', 'Alpha Masking'],
                description: 'Hand-drawn pen tool vector paths with multi-channel separation for color swaps and crisp edge isolation.',
            },
        };

        const desiredSlugs = ['high-end-model-retouch', 'ghost-mannequin', 'jewelry-retouch', 'background-removal'];
        const matched = desiredSlugs
            .map((slug) => services.find((s) => s.slug === slug))
            .filter((s): s is Service => Boolean(s));

        const pool = matched.length === 4 ? matched : services.slice(0, 4);

        return pool.map((s, i) => {
            const config = slugImageMap[s.slug] || {
                image: `/images/portfolio/portfolio-${(i % 4) + 1}.jpg`,
                fallbackCategories: ['Specialist Discipline'],
                description: s.description || 'Enterprise visual post-production engineered for maximum marketplace conversion.',
            };
            const categories = s.slug === 'high-end-model-retouch'
                ? ['High-End Fashion & Jewelry']
                : s.marquee_label
                ? s.marquee_label.split(' · ').slice(0, 2)
                : config.fallbackCategories;

            return {
                id: i + 1,
                title: s.title,
                slug: s.slug,
                image: config.image,
                categories,
                year: 2026,
                description: config.description,
            };
        });
    }, [services]);

    // =========================================================================
    // SILKY SMOOTH CARD STACK PHYSICS (One After Another On Scroll)
    // 100% GPU Hardware Accelerated, 0 Dropped Frames, 0 Brightness Filter Jank
    // =========================================================================

    // Card 0: Starts active, gently scales and recedes as Card 1 arrives
    const card0Scale = useTransform(progress, [0, 0.08, 0.32, 0.38, 0.62, 0.68, 0.92], [1, 1, 0.92, 0.92, 0.85, 0.85, 0.78]);
    const card0Y = useTransform(progress, [0, 0.08, 0.32, 0.38, 0.62, 0.68, 0.92], [0, 0, -22, -22, -42, -42, -60]);
    const card0Dim = useTransform(progress, [0, 0.08, 0.32, 0.62], [0, 0, 0.35, 0.60]);

    // Card 1: Smoothly slides up over Card 0 (0.08 -> 0.32), then scales down as Card 2 arrives
    const card1TranslateY = useTransform(progress, [0, 0.08, 0.32], ['102%', '102%', '0%']);
    const card1Scale = useTransform(progress, [0.32, 0.38, 0.62, 0.68, 0.92], [1, 1, 0.92, 0.92, 0.85]);
    const card1Y = useTransform(progress, [0.32, 0.38, 0.62, 0.68, 0.92], [0, 0, -22, -22, -42]);
    const card1Dim = useTransform(progress, [0.32, 0.38, 0.62], [0, 0, 0.35]);

    // Card 2: Smoothly slides up over Card 1 (0.38 -> 0.62), then scales down as Card 3 arrives
    const card2TranslateY = useTransform(progress, [0, 0.38, 0.62], ['102%', '102%', '0%']);
    const card2Scale = useTransform(progress, [0.62, 0.68, 0.92], [1, 1, 0.92]);
    const card2Y = useTransform(progress, [0.62, 0.68, 0.92], [0, 0, -22]);
    const card2Dim = useTransform(progress, [0.62, 0.68, 0.92], [0, 0, 0.35]);

    // Card 3: Final card slides up over Card 2 (0.68 -> 0.92)
    const card3TranslateY = useTransform(progress, [0, 0.68, 0.92], ['102%', '102%', '0%']);

    // Smooth click-to-scroll to any card
    const scrollToCard = (index: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const scrollTop = window.scrollY + rect.top;
        const totalHeight = containerRef.current.offsetHeight - window.innerHeight;
        const targets = [0.02, 0.34, 0.64, 0.94];
        const targetY = scrollTop + targets[index] * totalHeight;

        if (typeof window !== 'undefined' && (window as any).lenis) {
            (window as any).lenis.scrollTo(targetY);
        } else {
            window.scrollTo({ top: targetY, behavior: 'smooth' });
        }
    };

    return (
        <section
            id="featured-services"
            className="relative py-14 sm:py-18 lg:py-22 bg-[#090a0d] border-t border-white/10 select-none"
        >
            {/* Ambient Background Glow */}
            <div className="absolute top-1/4 right-0 w-[55rem] h-[55rem] bg-[#d4ff00]/5 rounded-full blur-[220px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 pb-6 border-b border-white/10 gap-6">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-widest text-[#d4ff00]">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>[ 01 // CORE DISCIPLINES & SERVICES ]</span>
                            </div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-neutral-400">
                                <span className="text-[#d4ff00] font-semibold">0{activeIndex + 1}</span>
                                <span>/</span>
                                <span>04</span>
                            </div>
                        </div>

                        <h2 className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-['Clash_Display',_'Syne',_sans-serif] uppercase font-bold text-white tracking-tight leading-none">
                            ENGINEERED FOR IMPACT.
                        </h2>
                    </div>

                    <Link
                        href="/services"
                        className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-widest text-neutral-300 hover:text-black hover:bg-[#d4ff00] hover:border-[#d4ff00] transition-all duration-300 shadow-sm"
                    >
                        <span>View All Services ({services?.length || '6+'})</span>
                        <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </Link>
                </div>

                {/* Interactive Discipline Switcher Pills (Clickable navigation synced with scroll) */}
                <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-4 mb-6 sm:mb-8 scrollbar-none">
                    {activeCards.map((card, idx) => {
                        const isActive = idx === activeIndex;
                        return (
                            <button
                                key={card.id}
                                type="button"
                                onClick={() => scrollToCard(idx)}
                                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-300 whitespace-nowrap cursor-pointer flex items-center gap-2 border ${
                                    isActive
                                        ? 'bg-[#d4ff00] text-black font-bold border-[#d4ff00] shadow-[0_0_20px_rgba(212,255,0,0.3)]'
                                        : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border-white/10'
                                }`}
                            >
                                <span className={isActive ? 'text-black font-extrabold' : 'text-[#d4ff00]'}>
                                    0{idx + 1}.
                                </span>
                                <span>{card.title}</span>
                            </button>
                        );
                    })}
                </div>

                {/* PINNED COLLAPSIBLE CARDS CONTAINER: STACKS ONE AFTER ANOTHER ON SCROLL */}
                <div ref={containerRef} className="relative h-[260vh] sm:h-[300vh]">
                    {/* Sticky Viewport Window */}
                    <div className="sticky top-20 sm:top-24 h-[58vh] sm:h-[64vh] lg:h-[68vh] min-h-[420px] max-h-[660px] w-full rounded-[24px] sm:rounded-[36px] overflow-visible">
                        {/* Card 0 */}
                        <CardView
                            item={activeCards[0]}
                            zIndex={10}
                            style={{
                                scale: card0Scale,
                                y: card0Y,
                            }}
                            dimOpacity={card0Dim}
                        />

                        {/* Card 1: Slides up over Card 0 */}
                        <motion.div
                            style={{
                                y: card1TranslateY,
                                zIndex: 20,
                            }}
                            className="absolute inset-0 w-full h-full pointer-events-auto"
                        >
                            <CardView
                                item={activeCards[1]}
                                zIndex={20}
                                style={{
                                    scale: card1Scale,
                                    y: card1Y,
                                }}
                                dimOpacity={card1Dim}
                            />
                        </motion.div>

                        {/* Card 2: Slides up over Card 1 */}
                        <motion.div
                            style={{
                                y: card2TranslateY,
                                zIndex: 30,
                            }}
                            className="absolute inset-0 w-full h-full pointer-events-auto"
                        >
                            <CardView
                                item={activeCards[2]}
                                zIndex={30}
                                style={{
                                    scale: card2Scale,
                                    y: card2Y,
                                }}
                                dimOpacity={card2Dim}
                            />
                        </motion.div>

                        {/* Card 3: Slides up over Card 2 */}
                        <motion.div
                            style={{
                                y: card3TranslateY,
                                zIndex: 40,
                            }}
                            className="absolute inset-0 w-full h-full pointer-events-auto"
                        >
                            <CardView
                                item={activeCards[3]}
                                zIndex={40}
                                style={{
                                    scale: 1,
                                    y: 0,
                                }}
                            />
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
