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
            title: 'automap',
            subtitle: 'Research, UX, UI Design',
            category: 'Spatial Telemetry & Autonomous Mobility',
            year: '2026',
            deliverables: ['Spatial OS', 'Real-Time Telemetry', '3D WebGL Interface'],
            image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=85',
            slug: 'automap',
            accent: '#00f5ff',
        },
        {
            id: 2,
            title: 'kashtech\ndoyel',
            subtitle: 'Fintech Protocol, UX, UI Design',
            category: 'Algorithmic Financial Infrastructure',
            year: '2025',
            deliverables: ['Design Architecture', 'Biometric App', 'High-Frequency UX'],
            image: 'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?auto=format&fit=crop&w=1200&q=85',
            slug: 'kashtech-doyel',
            accent: '#fbb718',
        },
        {
            id: 3,
            title: 'rebrand',
            subtitle: 'Brand Strategy, Visual Identity',
            category: 'Luxury Acoustic & Spatial Computing',
            year: '2025',
            deliverables: ['Generative Identity', 'Packaging System', 'Sound Architecture'],
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=85',
            slug: 'rebrand',
            accent: '#ff5e36',
        },
        {
            id: 4,
            title: 'vortex\nspatial',
            subtitle: 'WebGL Shaders, 3D Direction',
            category: 'Autonomous Deep Ocean Telemetry',
            year: '2026',
            deliverables: ['GPU Shaders', 'Volumetric Shaders', 'Interactive Canvas'],
            image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=85',
            slug: 'vortex-spatial',
            accent: '#a855f7',
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
                {/* SECTION HEADER: AGNTIX RECENT WORK WITH KINETIC SCROLL & LIGHTNING K */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 sm:mb-20 lg:mb-24 gap-6 sm:gap-8">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-widest text-[#00f5ff] mb-4 sm:mb-6">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>[ 02 // RECENT COMMISSIONS ]</span>
                        </div>

                        {/* Title with kinetic horizontal scroll & customized lightning 'K' - Responsive on mobile */}
                        <div className="overflow-hidden sm:overflow-visible select-none max-w-full">
                            <h2 className="text-[2.25rem] xs:text-4xl sm:text-6xl md:text-7xl lg:text-[7rem] xl:text-[8.5rem] font-['Clash_Display',_'Syne',_sans-serif] uppercase font-bold text-white tracking-tight leading-[1] sm:leading-[0.88]">
                                <motion.span
                                    style={{ x: recentX }}
                                    className="block whitespace-nowrap will-change-transform text-white/90"
                                >
                                    RECENT
                                </motion.span>
                                <span className="inline-flex items-center whitespace-nowrap text-[#e0eeee]">
                                    <span>WOR</span>
                                    {/* Stylized Brutalist Lightning K */}
                                    <span className="inline-flex items-center relative text-white">
                                        <svg
                                            viewBox="0 0 78 95"
                                            fill="currentColor"
                                            className="inline-block h-[0.84em] w-auto align-baseline fill-current text-white -ml-0.5"
                                            aria-label="K"
                                        >
                                            {/* Vertical stem */}
                                            <rect x="0" y="0" width="18" height="95" />
                                            {/* Top diagonal arm */}
                                            <polygon points="18,48 55,0 78,0 35,52" />
                                            {/* Lightning bottom zag arm */}
                                            <polygon points="32,48 76,55 58,68 78,95 56,95 40,74 24,76 18,52" />
                                        </svg>
                                    </span>
                                </span>
                            </h2>
                        </div>

                        <p className="text-sm sm:text-xl lg:text-2xl text-neutral-400 font-medium max-w-sm mt-4 sm:mt-8 leading-snug tracking-tight">
                            In the creative wilderness, clients find our work truly beloved.
                        </p>
                    </div>

                    <div className="lg:pb-4">
                        <Link
                            href="/work"
                            className="inline-flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-full border border-white/20 text-xs sm:text-sm font-mono uppercase tracking-widest text-white hover:bg-white hover:text-black hover:border-white transition-all duration-300 group shadow-lg"
                        >
                            <span>Explore work</span>
                            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
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
            {/* CONTENT BLOCK - Proper responsive padding & font size */}
            <div
                className={`order-2 ${
                    isEven
                        ? 'lg:col-span-5 lg:order-2 lg:pl-8'
                        : 'lg:col-span-5 lg:order-1 lg:pr-8'
                } space-y-4 sm:space-y-6 px-1 sm:px-0`}
            >
                <div className="space-y-2 sm:space-y-3">
                    <span className="font-mono text-[11px] sm:text-xs text-neutral-400 uppercase tracking-widest block">
                        [ Case Study 0{index + 1} // {item.year} ]
                    </span>

                    <h3 className="text-2xl sm:text-4xl md:text-5xl lg:text-[4.5rem] xl:text-[5rem] font-['Antonio',_'Bebas_Neue',_sans-serif] font-normal text-[#e0eeee] hover:text-white transition-colors lowercase leading-[1.05] sm:leading-[0.9] tracking-tight whitespace-pre-line break-words">
                        <Link href={`/work/${item.slug}`}>{item.title}</Link>
                    </h3>

                    <p className="text-base sm:text-xl lg:text-2xl font-medium text-neutral-300 tracking-tight pt-0.5 sm:pt-1">
                        {item.subtitle}
                    </p>

                    <p className="text-xs sm:text-sm text-neutral-400 font-normal leading-relaxed max-w-md pt-1 sm:pt-2">
                        {item.category}. Engineered with precision architecture and kinetic interactivity.
                    </p>
                </div>

                {/* Deliverables tags */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1 sm:pt-2 pb-2 sm:pb-4">
                    {item.deliverables.map((deliv, dIdx) => (
                        <span
                            key={dIdx}
                            className="px-2.5 sm:px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] sm:text-xs font-mono uppercase tracking-wider text-neutral-300"
                        >
                            {deliv}
                        </span>
                    ))}
                </div>

                {/* Agntix Sky-Bordered Button */}
                <div className="pt-1 sm:pt-2">
                    <Link
                        href={`/work/${item.slug}`}
                        className="inline-flex items-center gap-2.5 px-6 sm:px-7 py-2.5 sm:py-3 rounded-full border border-sky-400/40 text-xs font-mono uppercase tracking-widest text-sky-300 hover:bg-sky-400 hover:text-black hover:border-sky-400 transition-all duration-300 group"
                    >
                        <span>View project</span>
                        <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
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
                                className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-[11px] sm:text-xs font-mono uppercase tracking-widest text-[#00f5ff] flex items-center gap-2 shadow-2xl"
                            >
                                <span>Explore Case Study</span>
                                <ArrowUpRight className="w-3.5 h-3.5 text-[#00f5ff]" />
                            </motion.div>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
