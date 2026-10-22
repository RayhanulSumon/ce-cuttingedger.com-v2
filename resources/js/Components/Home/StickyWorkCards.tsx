import React, { useRef, useState } from 'react';
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
import { Project } from '@/types/models';

interface PortfolioItem {
    id: number | string;
    title: string;
    slug: string;
    image: string;
    categories: string[];
    year: string | number;
}

const DEFAULT_STUDIO_WORKS: PortfolioItem[] = [
    {
        id: 1,
        title: 'Electro Spatial',
        slug: 'electro-spatial',
        image: '/images/portfolio/portfolio-1.jpg',
        categories: ['3D Spatial CGI', 'High-End Retouching'],
        year: 2026,
    },
    {
        id: 2,
        title: 'Creative Vision',
        slug: 'creative-vision',
        image: '/images/portfolio/portfolio-2.jpg',
        categories: ['Commercial Retouch', 'Color Grading'],
        year: 2025,
    },
    {
        id: 3,
        title: 'Design Essence',
        slug: 'design-essence',
        image: '/images/portfolio/portfolio-3.jpg',
        categories: ['Spatial CGI', 'Product Render'],
        year: 2025,
    },
    {
        id: 4,
        title: 'Innovative Works',
        slug: 'innovative-works',
        image: '/images/portfolio/portfolio-4.jpg',
        categories: ['Brand Architecture', 'Luxury Assets'],
        year: 2026,
    },
];

interface CardViewProps {
    item: PortfolioItem;
    style: any;
    zIndex: number;
}

function CardView({ item, style, zIndex }: CardViewProps) {
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
                {/* Vignette gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/45 pointer-events-none" />
            </div>

            {/* Clickable Card Link */}
            <Link
                href={`/work/${item.slug}`}
                className="absolute inset-0 z-20"
                aria-label={`View ${item.title} case study`}
            />

            {/* Card Top Bar: Frosted Glass Capsule Pills */}
            <div className="relative z-30 p-6 sm:p-8 lg:p-10 flex items-center justify-between pointer-events-none">
                {/* Left: Categories */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    {item.categories.map((cat, cIdx) => (
                        <span
                            key={cIdx}
                            className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-sans uppercase tracking-wider text-white font-medium shadow-sm group-hover:border-white/40 transition-colors"
                        >
                            {cat}
                        </span>
                    ))}
                </div>

                {/* Right: Year Tag */}
                <span className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-mono text-white font-semibold shadow-sm">
                    [{item.year}]
                </span>
            </div>

            {/* Card Bottom Bar: Unobstructed Image with Clean Title Pill */}
            <div className="absolute bottom-6 sm:bottom-8 inset-x-6 sm:inset-x-8 z-30 flex items-center justify-between pointer-events-none">
                <span className="px-4 sm:px-5 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-['Clash_Display',_'Syne',_sans-serif] font-bold text-white uppercase tracking-wider shadow-lg">
                    {item.title}
                </span>

                {/* Mobile tap indicator */}
                <span className="sm:hidden px-3.5 py-1.5 rounded-full bg-[#d4ff00] text-black text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                    <span>View</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
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
                    Explore Case
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#d4ff00]" />
            </motion.div>
        </motion.article>
    );
}

interface StickyWorkCardsProps {
    projects?: Project[];
}

export function StickyWorkCards({ projects }: StickyWorkCardsProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    // Track total scroll progress across the 4-card collapsible journey
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    const progress = scrollYProgress;

    // Active Card Pagination Tracker
    useMotionValueEvent(progress, 'change', (latest) => {
        if (latest < 0.25) setActiveIndex(0);
        else if (latest < 0.52) setActiveIndex(1);
        else if (latest < 0.80) setActiveIndex(2);
        else setActiveIndex(3);
    });

    // Dynamic resolution from real database projects with studio fallback
    const activeWorks: PortfolioItem[] =
        projects && projects.length >= 4
            ? projects.slice(0, 4).map((p, i) => ({
                  id: p.id,
                  title: p.title,
                  slug: p.slug,
                  image: p.featured_image || p.thumbnail_image || DEFAULT_STUDIO_WORKS[i].image,
                  categories: p.category ? [p.category.name] : DEFAULT_STUDIO_WORKS[i].categories,
                  year: p.year || (p.created_at ? new Date(p.created_at).getFullYear() : 2026),
              }))
            : DEFAULT_STUDIO_WORKS;

    // =========================================================================
    // COLLAPSIBLE SCALE & STACK MECHANISM
    // =========================================================================

    // Card 0: Starts active
    const card0Scale = useTransform(progress, [0, 0.12, 0.36, 0.40, 0.64, 0.68, 0.92], [1, 1, 0.88, 0.88, 0.78, 0.78, 0.70]);
    const card0Y = useTransform(progress, [0, 0.12, 0.36, 0.40, 0.64, 0.68, 0.92], [0, 0, -28, -28, -50, -50, -68]);
    const card0Opacity = useTransform(progress, [0, 0.12, 0.36, 0.40, 0.64], [1, 1, 0.65, 0.65, 0.35]);
    const card0Brightness = useTransform(progress, [0, 0.12, 0.36, 0.40, 0.64], ['100%', '100%', '70%', '70%', '45%']);

    // Card 1: Slides up from 105% to 0%
    const card1TranslateY = useTransform(progress, [0, 0.12, 0.36], ['105%', '105%', '0%']);
    const card1Scale = useTransform(progress, [0.36, 0.40, 0.64, 0.68, 0.92], [1, 1, 0.88, 0.88, 0.78]);
    const card1Y = useTransform(progress, [0.36, 0.40, 0.64, 0.68, 0.92], [0, 0, -28, -28, -50]);
    const card1Opacity = useTransform(progress, [0.36, 0.40, 0.64], [1, 1, 0.65]);
    const card1Brightness = useTransform(progress, [0.36, 0.40, 0.64], ['100%', '100%', '70%']);

    // Card 2: Slides up from 105% to 0%
    const card2TranslateY = useTransform(progress, [0, 0.40, 0.64], ['105%', '105%', '0%']);
    const card2Scale = useTransform(progress, [0.64, 0.68, 0.92], [1, 1, 0.88]);
    const card2Y = useTransform(progress, [0.64, 0.68, 0.92], [0, 0, -28]);
    const card2Opacity = useTransform(progress, [0.64, 0.68, 0.92], [1, 1, 0.65]);
    const card2Brightness = useTransform(progress, [0.64, 0.68, 0.92], ['100%', '100%', '70%']);

    // Card 3: Slides up from 105% to 0%
    const card3TranslateY = useTransform(progress, [0, 0.68, 0.92], ['105%', '105%', '0%']);

    return (
        <section
            id="featured-work"
            className="relative py-14 sm:py-18 lg:py-22 bg-[#090a0d] border-t border-white/10 select-none"
        >
            {/* Ambient Background Glow */}
            <div className="absolute top-1/4 right-0 w-[55rem] h-[55rem] bg-[#d4ff00]/5 rounded-full blur-[220px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 pb-6 border-b border-white/10 gap-6">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-widest text-[#d4ff00]">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>[ 01 // SELECTED COMMISSIONS ]</span>
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
                        href="/work"
                        className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-widest text-neutral-300 hover:text-black hover:bg-[#d4ff00] hover:border-[#d4ff00] transition-all duration-300 shadow-sm"
                    >
                        <span>View All Archives ({projects?.length || '24+'})</span>
                        <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </Link>
                </div>

                {/* PINNED COLLAPSIBLE CARDS CONTAINER (.des-portfolio-wrap) */}
                <div ref={containerRef} className="relative h-[320vh] sm:h-[360vh]">
                    {/* Sticky Viewport Window: Safe Height to Guarantee Bottom Title Visibility */}
                    <div className="sticky top-16 sm:top-20 lg:top-24 h-[58vh] sm:h-[64vh] lg:h-[68vh] min-h-[400px] max-h-[660px] w-full rounded-[24px] sm:rounded-[36px] overflow-visible">
                        {/* Card 0 */}
                        <CardView
                            item={activeWorks[0]}
                            zIndex={10}
                            style={{
                                scale: card0Scale,
                                y: card0Y,
                                opacity: card0Opacity,
                                filter: `brightness(${card0Brightness})`,
                            }}
                        />

                        {/* Card 1 */}
                        <motion.div
                            style={{
                                y: card1TranslateY,
                                zIndex: 20,
                            }}
                            className="absolute inset-0 w-full h-full pointer-events-auto"
                        >
                            <CardView
                                item={activeWorks[1]}
                                zIndex={20}
                                style={{
                                    scale: card1Scale,
                                    y: card1Y,
                                    opacity: card1Opacity,
                                    filter: `brightness(${card1Brightness})`,
                                }}
                            />
                        </motion.div>

                        {/* Card 2 */}
                        <motion.div
                            style={{
                                y: card2TranslateY,
                                zIndex: 30,
                            }}
                            className="absolute inset-0 w-full h-full pointer-events-auto"
                        >
                            <CardView
                                item={activeWorks[2]}
                                zIndex={30}
                                style={{
                                    scale: card2Scale,
                                    y: card2Y,
                                    opacity: card2Opacity,
                                    filter: `brightness(${card2Brightness})`,
                                }}
                            />
                        </motion.div>

                        {/* Card 3 */}
                        <motion.div
                            style={{
                                y: card3TranslateY,
                                zIndex: 40,
                            }}
                            className="absolute inset-0 w-full h-full pointer-events-auto"
                        >
                            <CardView
                                item={activeWorks[3]}
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
