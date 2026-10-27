import React, { useRef, useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { Project } from '@/types/models';

interface ShowcaseProjectItem {
    id: number | string;
    title: string;
    subtitle: string;
    category: string;
    year: string | number;
    deliverables: string[];
    image: string;
    slug: string;
    accent: string;
}

interface RecentWorkShowcaseProps {
    projects?: Project[];
}

export function RecentWorkShowcase({ projects }: RecentWorkShowcaseProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Section scroll progress for kinetic typography shift
    const { scrollYProgress: sectionScroll } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start'],
    });

    const rawRecentX = useTransform(sectionScroll, [0, 1], [-80, 80]);
    const recentX = isMobile ? 0 : rawRecentX;

    // Curated flagship case studies matching Agntix Design Agency reference
    const defaultItems: ShowcaseProjectItem[] = [
        {
            id: 1,
            title: 'Automotive 3D Studio',
            subtitle: '3D CGI Modeling & Lighting Calibration',
            category: 'High-polygon vehicle staging and lighting calibration',
            year: '2026',
            deliverables: ['3D WebGL', 'Lighting Shaders', 'Virtual Rigging'],
            image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=85',
            slug: 'automotive-3d',
            accent: '#f5a623',
        },
        {
            id: 2,
            title: 'Nordic Luxury Outerwear',
            subtitle: 'Ghost Mannequin & Color Matching',
            category: 'High-volume apparel retouching and joint harmonization',
            year: '2025',
            deliverables: ['Ghost Mannequin', 'Symmetry Alignment', 'Fabric Texture'],
            image: 'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?auto=format&fit=crop&w=1200&q=85',
            slug: 'nordic-luxury',
            accent: '#f5a623',
        },
        {
            id: 3,
            title: 'High-Sheen Audio Hardware',
            subtitle: 'Swatch Matching & Reflection Clean-up',
            category: 'Micro-retouching across brushed metallic finishes',
            year: '2025',
            deliverables: ['Color Swatches', 'Reflection Control', 'Clipping Paths'],
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=85',
            slug: 'audio-hardware',
            accent: '#f5a623',
        },
        {
            id: 4,
            title: 'Precision Watchmaking',
            subtitle: 'Macro Focus Stacking & Dust Removal',
            category: 'Sub-pixel artifact eradication for luxury timepieces',
            year: '2026',
            deliverables: ['Macro Retouching', 'Focus Stacking', 'Alpha Masking'],
            image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=85',
            slug: 'precision-watchmaking',
            accent: '#f5a623',
        },
    ];

    // Merge or fallback to default flagship items
    const items: ShowcaseProjectItem[] = defaultItems.map((item, idx) => {
        if (projects && projects[idx]) {
            const p = projects[idx];
            return {
                ...item,
                title: p.title.toLowerCase(),
                subtitle: p.deliverables?.slice(0, 3).join(', ') || item.subtitle,
                category: p.category?.name || item.category,
                year: p.year || item.year,
                deliverables: p.deliverables || item.deliverables,
                image: p.cover_image || item.image,
                slug: p.slug || item.slug,
            };
        }
        return item;
    });

    return (
        <section
            ref={sectionRef}
            className="relative py-14 sm:py-24 lg:py-28 xl:py-32 bg-[#08090b] text-white overflow-hidden border-t border-white/10"
        >
            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 right-0 w-[55rem] h-[55rem] bg-[#00f5ff]/5 rounded-full blur-[220px] pointer-events-none" />
            <div className="absolute bottom-1/4 left-0 w-[50rem] h-[50rem] bg-accent/5 rounded-full blur-[200px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 xs:px-6 lg:px-8 w-full">
                {/* SECTION HEADER */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 sm:mb-18 lg:mb-20 gap-6 sm:gap-8 pb-8 border-b border-white/10">
                    <div className="space-y-3 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/25 text-[11px] font-mono uppercase tracking-[0.2em] text-accent font-semibold">
                            <Sparkles className="w-3 h-3" />
                            <span>Featured Case Studies</span>
                        </div>

                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold uppercase text-white tracking-tight leading-none">
                            Recent <span className="text-accent">Work</span>
                        </h2>

                        <p className="text-xs sm:text-sm md:text-base text-neutral-400 font-sans leading-relaxed">
                            Selected high-volume catalog retouching, color standardization, and 3D CGI deployments for global brands.
                        </p>
                    </div>

                    <div className="lg:pb-1">
                        <Link
                            href="/work"
                            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full border border-white/15 bg-white/[0.04] text-xs font-mono uppercase tracking-wider text-white hover:bg-accent hover:text-black hover:border-accent transition-all duration-300 group shadow-md shrink-0 cursor-pointer"
                        >
                            <span>Explore All Work</span>
                            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Link>
                    </div>
                </div>

                {/* SHOWCASE ITEMS: AGNTIX ALTERNATING ZIG-ZAG WITH SLIDING TILT PHYSICS */}
                <div className="space-y-12 sm:space-y-24 lg:space-y-32">
                    {items.map((item, index) => {
                        const isEven = index % 2 === 1;

                        return (
                            <ShowcaseRow
                                key={item.id}
                                item={item}
                                isEven={isEven}
                                index={index}
                                isMobile={isMobile}
                            />
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function ShowcaseRow({
    item,
    isEven,
    index,
    isMobile,
}: {
    item: ShowcaseProjectItem;
    isEven: boolean;
    index: number;
    isMobile: boolean;
}) {
    const rowRef = useRef<HTMLDivElement>(null);
    const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
    const [isHovered, setIsHovered] = useState(false);

    // Scroll progress for the row: drives dynamic slide-in & rotation physics
    const { scrollYProgress } = useScroll({
        target: rowRef,
        offset: ['start 0.95', 'center 0.55'],
    });

    // Dynamic Agntix signature entrance on desktop, subtle on mobile to prevent overflow
    const initialX = isMobile ? 0 : (isEven ? -220 : 220);
    const initialRot = isMobile ? 0 : (isEven ? -6 : 6);

    const scrollX = useTransform(scrollYProgress, [0, 1], [initialX, 0]);
    const scrollRotate = useTransform(scrollYProgress, [0, 1], [initialRot, 0]);
    const scrollScale = useTransform(scrollYProgress, [0, 1], [isMobile ? 0.98 : 0.94, 1]);
    const scrollOpacity = useTransform(scrollYProgress, [0, 0.35], [0.4, 1]);

    // Interactive mouse 3D tilt (desktop only)
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isMobile) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setMousePos({ x, y });
    };

    const tiltX = !isMobile && isHovered ? (mousePos.y - 0.5) * -12 : 0;
    const tiltY = !isMobile && isHovered ? (mousePos.x - 0.5) * 12 : 0;

    return (
        <div
            ref={rowRef}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-14 items-center"
        >
            {/* CONTENT BLOCK - Balanced editorial proportions */}
            <div
                className={`order-2 ${
                    isEven
                        ? 'lg:col-span-5 lg:order-2 lg:pl-6 xl:pl-8'
                        : 'lg:col-span-5 lg:order-1 lg:pr-6 xl:pr-8'
                } space-y-4 sm:space-y-5 px-1 sm:px-0`}
            >
                <div className="space-y-2 sm:space-y-3">
                    <span className="font-mono text-[11px] sm:text-xs text-accent uppercase tracking-widest block font-semibold">
                        [ Case Study 0{index + 1} // {item.year} ]
                    </span>

                    <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display font-bold text-white hover:text-accent transition-colors capitalize leading-tight tracking-tight">
                        <Link href={`/work/${item.slug}`}>{item.title.replace(/\n/g, ' ')}</Link>
                    </h3>

                    <p className="text-sm sm:text-base font-semibold text-neutral-300 tracking-tight">
                        {item.subtitle}
                    </p>

                    <p className="text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed max-w-md pt-0.5">
                        {item.category}. Engineered with precision architecture and catalog consistency.
                    </p>
                </div>

                {/* Deliverables tags */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1 pb-1">
                    {item.deliverables.map((deliv, dIdx) => (
                        <span
                            key={dIdx}
                            className="px-2.5 sm:px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] sm:text-xs font-mono uppercase tracking-wider text-neutral-300"
                        >
                            {deliv}
                        </span>
                    ))}
                </div>

                {/* Accent Action Button */}
                <div className="pt-2">
                    <Link
                        href={`/work/${item.slug}`}
                        className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-accent/40 bg-accent/5 text-xs font-mono uppercase tracking-wider text-accent hover:bg-accent hover:text-black hover:border-accent transition-all duration-300 group shadow-sm"
                    >
                        <span>View Case Study</span>
                        <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                </div>
            </div>

            {/* SKEWED / TILTED PARALLAX THUMBNAIL */}
            <div
                className={`order-1 ${
                    isEven
                        ? 'lg:col-span-7 lg:order-1'
                        : 'lg:col-span-7 lg:order-2'
                }`}
            >
                <motion.div
                    style={{
                        x: scrollX,
                        rotate: scrollRotate,
                        scale: scrollScale,
                        opacity: scrollOpacity,
                        transform: 'translateZ(0)',
                    }}
                    className="w-full will-change-transform [backface-visibility:hidden]"
                >
                    <motion.div
                        onMouseMove={handleMouseMove}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => {
                            setIsHovered(false);
                            setMousePos({ x: 0.5, y: 0.5 });
                        }}
                        animate={{
                            rotateX: tiltX,
                            rotateY: tiltY,
                            scale: isHovered && !isMobile ? 1.02 : 1,
                        }}
                        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
                        style={{ transformStyle: 'preserve-3d' }}
                        className="relative rounded-[20px] sm:rounded-[36px] overflow-hidden border border-white/15 bg-neutral-900 shadow-[0_20px_60px_rgba(0,0,0,0.85)] group cursor-pointer select-none"
                    >
                        <Link href={`/work/${item.slug}`} className="block relative aspect-[16/11] w-full overflow-hidden">
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-106 will-change-transform"
                            />
                            {/* Ambient dark vignette */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-25 transition-opacity duration-500" />

                            {/* Dynamic Glare Sheen following cursor (desktop only) */}
                            <div
                                className="absolute inset-0 pointer-events-none transition-opacity duration-300 hidden sm:block"
                                style={{
                                    opacity: isHovered ? 0.35 : 0,
                                    background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(255,255,255,0.3) 0%, transparent 60%)`,
                                }}
                            />

                            {/* Floating Cursor Pill */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{
                                    opacity: isHovered ? 1 : 0,
                                    scale: isHovered ? 1 : 0.8,
                                }}
                                transition={{ duration: 0.25 }}
                                className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-[11px] sm:text-xs font-mono uppercase tracking-widest text-accent flex items-center gap-2 shadow-2xl"
                            >
                                <span>Explore Case Study</span>
                                <ArrowUpRight className="w-3.5 h-3.5 text-accent" />
                            </motion.div>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
