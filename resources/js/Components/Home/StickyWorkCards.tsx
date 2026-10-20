import React, { useRef, useState } from 'react';
import { Link } from '@inertiajs/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { Project } from '@/types/models';

interface PortfolioItem {
    id: number | string;
    title: string;
    slug: string;
    image: string;
    categories: string[];
    year: string | number;
}

const AGNTIX_WORKS: PortfolioItem[] = [
    {
        id: 1,
        title: 'Electro Hub',
        slug: 'electro-hub',
        image: '/images/portfolio/portfolio-1.jpg',
        categories: ['Web Design', 'Web Development'],
        year: 2025,
    },
    {
        id: 2,
        title: 'Creative Vision',
        slug: 'creative-vision',
        image: '/images/portfolio/portfolio-2.jpg',
        categories: ['Web Design', 'Web Development'],
        year: 2025,
    },
    {
        id: 3,
        title: 'Design Essence',
        slug: 'design-essence',
        image: '/images/portfolio/portfolio-3.jpg',
        categories: ['Spatial CGI', '3D WebGL'],
        year: 2025,
    },
    {
        id: 4,
        title: 'Innovative Works',
        slug: 'innovative-works',
        image: '/images/portfolio/portfolio-4.jpg',
        categories: ['Brand Architecture', 'Motion Design'],
        year: 2026,
    },
];

interface CardViewProps {
    item: PortfolioItem;
    style: any;
    zIndex: number;
}

function CardView({ item, style, zIndex }: CardViewProps) {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    return (
        <motion.article
            style={{
                ...style,
                zIndex,
                transformOrigin: 'top center',
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onMouseMove={handleMouseMove}
            className="absolute inset-0 w-full h-full rounded-[24px] sm:rounded-[36px] overflow-hidden border border-white/15 bg-neutral-950 shadow-[0_25px_70px_rgba(0,0,0,0.85)] group select-none will-change-transform"
        >
            {/* Full-bleed background image */}
            <div className="absolute inset-0 z-0">
                <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                {/* Vignette gradients matching Agntix .des-portfolio-thumb::after */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40 pointer-events-none" />
            </div>

            {/* Clickable Card Link */}
            <Link
                href={`/work/${item.slug}`}
                className="absolute inset-0 z-20"
                aria-label={`View ${item.title} demo`}
            />

            {/* Card Top Bar: Frosted Glass Capsule Pills (.des-portfolio-category) */}
            <div className="relative z-30 p-6 sm:p-10 lg:p-12 flex items-center justify-between pointer-events-none">
                {/* Left: Categories */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    {item.categories.map((cat, cIdx) => (
                        <span
                            key={cIdx}
                            className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-sans uppercase tracking-wider text-white font-medium shadow-sm group-hover:border-white/40 transition-colors"
                        >
                            {cat}
                        </span>
                    ))}
                </div>

                {/* Right: Year Tag (.portfolio-meta) */}
                <span className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-mono text-white font-semibold shadow-sm">
                    {item.year}
                </span>
            </div>

            {/* Card Bottom Bar: Massive Centered Title (.des-portfolio-title) */}
            <div className="absolute bottom-10 sm:bottom-14 lg:bottom-16 inset-x-0 z-30 text-center px-4 pointer-events-none">
                <h3 className="font-['Antonio',_'Bebas_Neue',_'Syne',_sans-serif] text-5xl sm:text-7xl md:text-8xl lg:text-[120px] xl:text-[145px] font-bold uppercase text-[#f9f4e8] tracking-tight leading-none group-hover:text-[#d4ff00] transition-colors drop-shadow-[0_15px_30px_rgba(0,0,0,0.95)]">
                    {item.title}
                </h3>
            </div>

            {/* Interactive Floating Mouse Follower Cursor Badge ("View Demo") */}
            {isHovered && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        x: mousePos.x - 45,
                        y: mousePos.y - 45,
                    }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{
                        type: 'spring',
                        stiffness: 350,
                        damping: 25,
                        mass: 0.2,
                    }}
                    className="pointer-events-none absolute top-0 left-0 z-40 hidden sm:flex items-center justify-center w-[90px] h-[90px] rounded-full bg-[#d4ff00] text-black font-['Antonio',_'Bebas_Neue',_sans-serif] text-sm uppercase font-bold tracking-wider leading-tight text-center shadow-[0_0_30px_rgba(212,255,0,0.6)]"
                >
                    <span>
                        View <br /> Demo
                    </span>
                </motion.div>
            )}
        </motion.article>
    );
}

interface StickyWorkCardsProps {
    projects?: Project[];
}

export function StickyWorkCards({ projects }: StickyWorkCardsProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    // Track total scroll progress across the 4-card collapsible journey
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    // Direct synchronous binding with Lenis smooth scroll - zero sluggish lag, 100% fluid!
    const progress = scrollYProgress;

    // =========================================================================
    // EXACT COLLAPSIBLE MECHANISM:
    // When the next card arrives on top, the previous card:
    // 1. Reduces scale (1.0 -> 0.85 -> 0.72)
    // 2. Pulls upward (top up: y: 0 -> -32px -> -58px)
    // 3. Dims subtly (brightness & opacity decrease)
    // =========================================================================

    // Card 0 (Electro Hub): Starts active
    // Card 1 arrives: 0.12 -> 0.36
    // Card 2 arrives: 0.40 -> 0.64
    // Card 3 arrives: 0.68 -> 0.92
    const card0Scale = useTransform(progress, [0, 0.12, 0.36, 0.40, 0.64, 0.68, 0.92], [1, 1, 0.86, 0.86, 0.76, 0.76, 0.68]);
    const card0Y = useTransform(progress, [0, 0.12, 0.36, 0.40, 0.64, 0.68, 0.92], [0, 0, -32, -32, -56, -56, -76]);
    const card0Opacity = useTransform(progress, [0, 0.12, 0.36, 0.40, 0.64], [1, 1, 0.6, 0.6, 0.3]);
    const card0Brightness = useTransform(progress, [0, 0.12, 0.36, 0.40, 0.64], ['100%', '100%', '65%', '65%', '40%']);

    // Card 1 (Creative Vision): Slides up from 105% to 0% between 0.12 and 0.36
    const card1TranslateY = useTransform(progress, [0, 0.12, 0.36], ['105%', '105%', '0%']);
    const card1Scale = useTransform(progress, [0.36, 0.40, 0.64, 0.68, 0.92], [1, 1, 0.86, 0.86, 0.76]);
    const card1Y = useTransform(progress, [0.36, 0.40, 0.64, 0.68, 0.92], [0, 0, -32, -32, -56]);
    const card1Opacity = useTransform(progress, [0.36, 0.40, 0.64], [1, 1, 0.6]);
    const card1Brightness = useTransform(progress, [0.36, 0.40, 0.64], ['100%', '100%', '65%']);

    // Card 2 (Design Essence): Slides up from 105% to 0% between 0.40 and 0.64
    const card2TranslateY = useTransform(progress, [0, 0.40, 0.64], ['105%', '105%', '0%']);
    const card2Scale = useTransform(progress, [0.64, 0.68, 0.92], [1, 1, 0.86]);
    const card2Y = useTransform(progress, [0.64, 0.68, 0.92], [0, 0, -32]);
    const card2Opacity = useTransform(progress, [0.64, 0.68, 0.92], [1, 1, 0.6]);
    const card2Brightness = useTransform(progress, [0.64, 0.68, 0.92], ['100%', '100%', '65%']);

    // Card 3 (Innovative Works): Slides up from 105% to 0% between 0.68 and 0.92
    const card3TranslateY = useTransform(progress, [0, 0.68, 0.92], ['105%', '105%', '0%']);

    return (
        <section
            id="featured-work"
            className="relative py-20 sm:py-28 bg-[#090a0d] border-t border-white/10 select-none"
        >
            {/* Ambient Background Glow */}
            <div className="absolute top-1/4 right-0 w-[55rem] h-[55rem] bg-[#d4ff00]/5 rounded-full blur-[220px] pointer-events-none" />

            <div className="w-full max-w-[96%] xl:max-w-[1560px] 2xl:max-w-[1750px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 pb-6 border-b border-white/10 gap-6">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-widest text-[#d4ff00]">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>[ 01 // SELECTED COMMISSIONS ]</span>
                        </div>
                        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-['Antonio',_'Bebas_Neue',_'Syne',_sans-serif] uppercase font-bold text-white tracking-tight leading-none">
                            ENGINEERED FOR IMPACT.
                        </h2>
                    </div>

                    <Link
                        href="/work"
                        className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-widest text-neutral-300 hover:text-black hover:bg-[#d4ff00] hover:border-[#d4ff00] transition-all duration-300 shadow-sm"
                    >
                        <span>View All Archives (24+)</span>
                        <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </Link>
                </div>

                {/* PINNED COLLAPSIBLE CARDS CONTAINER (.des-portfolio-wrap) */}
                <div ref={containerRef} className="relative h-[320vh] sm:h-[360vh]">
                    {/* Sticky Viewport Window */}
                    <div className="sticky top-16 sm:top-20 lg:top-24 h-[65vh] sm:h-[75vh] lg:h-[82vh] min-h-[480px] max-h-[850px] w-full rounded-[24px] sm:rounded-[36px] overflow-visible">
                        {/* Card 0: Electro Hub */}
                        <CardView
                            item={AGNTIX_WORKS[0]}
                            zIndex={10}
                            style={{
                                scale: card0Scale,
                                y: card0Y,
                                opacity: card0Opacity,
                                filter: `brightness(${card0Brightness})`,
                            }}
                        />

                        {/* Card 1: Creative Vision (slides up over Card 0, then scales down & pulls up) */}
                        <motion.div
                            style={{
                                y: card1TranslateY,
                                zIndex: 20,
                            }}
                            className="absolute inset-0 w-full h-full pointer-events-auto"
                        >
                            <CardView
                                item={AGNTIX_WORKS[1]}
                                zIndex={20}
                                style={{
                                    scale: card1Scale,
                                    y: card1Y,
                                    opacity: card1Opacity,
                                    filter: `brightness(${card1Brightness})`,
                                }}
                            />
                        </motion.div>

                        {/* Card 2: Design Essence (slides up over Card 1, then scales down & pulls up) */}
                        <motion.div
                            style={{
                                y: card2TranslateY,
                                zIndex: 30,
                            }}
                            className="absolute inset-0 w-full h-full pointer-events-auto"
                        >
                            <CardView
                                item={AGNTIX_WORKS[2]}
                                zIndex={30}
                                style={{
                                    scale: card2Scale,
                                    y: card2Y,
                                    opacity: card2Opacity,
                                    filter: `brightness(${card2Brightness})`,
                                }}
                            />
                        </motion.div>

                        {/* Card 3: Innovative Works (slides up over Card 2 to complete the collapse stack) */}
                        <motion.div
                            style={{
                                y: card3TranslateY,
                                zIndex: 40,
                            }}
                            className="absolute inset-0 w-full h-full pointer-events-auto"
                        >
                            <CardView
                                item={AGNTIX_WORKS[3]}
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
