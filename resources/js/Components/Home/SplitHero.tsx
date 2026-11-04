import React, { useState, useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Play,
    ArrowRight,
    ArrowUpRight,
    ShieldCheck,
    Sparkles,
    X,
    Volume2,
    VolumeX,
    Calendar,
    Layers,
    Box,
    Cpu,
    Film,
} from 'lucide-react';

interface HeroSlide {
    id: string;
    number: string;
    tabLabel: string;
    subtitle: string;
    categoryTag: string;
    metricBadge: string;
    poster: string;
    videoUrl: string;
    accentGlow: string;
    icon: React.ComponentType<{ className?: string }>;
}

const SLIDE_DURATION_MS = 6000; // Hold slides for 6 seconds on auto-play, pausing on hover

const HERO_SLIDES: HeroSlide[] = [
    {
        id: 'ai-commercials',
        number: '01',
        tabLabel: '01. AI Commercials',
        subtitle: 'Generative video & virtual model campaigns',
        categoryTag: 'GENERATIVE AI & VIRTUAL TALENT',
        metricBadge: '60% Faster Campaign Launch • Zero Location Overhead',
        poster: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1920&q=85',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        accentGlow: 'from-blue-600/35 via-indigo-900/30 to-[#07080c]',
        icon: Cpu,
    },
    {
        id: '3d-spatial-cgi',
        number: '02',
        tabLabel: '02. 3D Spatial CGI',
        subtitle: 'Photorealistic product renders & 3D assets',
        categoryTag: '8K DIGITAL TWINS & ANAMORPHIC CGI',
        metricBadge: 'Sub-Millimeter CAD Accuracy • PBR Shaders',
        poster: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=85',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        accentGlow: 'from-cyan-600/30 via-blue-950/35 to-[#07080c]',
        icon: Box,
    },
    {
        id: 'high-volume-retouching',
        number: '03',
        tabLabel: '03. High-Volume Retouching',
        subtitle: 'Precision e-commerce scaling',
        categoryTag: 'SURGICAL DIGITAL PREP & RETOUCHING',
        metricBadge: '10,000+ Assets/Day • 99.8% First-Pass QA',
        poster: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1920&q=85',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        accentGlow: 'from-amber-500/25 via-indigo-950/35 to-[#07080c]',
        icon: Layers,
    },
    {
        id: 'corporate-motion',
        number: '04',
        tabLabel: '04. Corporate Motion',
        subtitle: 'Broadcast-ready brand films',
        categoryTag: 'BROADCAST & MULTI-CHANNEL MOTION',
        metricBadge: '4K/8K Mastering • Global Localization Ready',
        poster: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1920&q=85',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        accentGlow: 'from-indigo-500/30 via-slate-900/40 to-[#07080c]',
        icon: Film,
    },
];

export function SplitHero({ onOpenContact }: { onOpenContact?: () => void }) {
    const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [isShowreelOpen, setIsShowreelOpen] = useState<boolean>(false);
    const [isMuted, setIsMuted] = useState<boolean>(true);
    const [elapsedMs, setElapsedMs] = useState<number>(0);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const activeSlide = HERO_SLIDES[activeTabIndex];

    // 6-second auto-advance timer that pauses on user hover
    useEffect(() => {
        if (isHovered || isShowreelOpen) {
            return;
        }

        const interval = 60;
        const timer = setInterval(() => {
            setElapsedMs((prev) => {
                if (prev + interval >= SLIDE_DURATION_MS) {
                    setActiveTabIndex((current) => (current + 1) % HERO_SLIDES.length);
                    return 0;
                }
                return prev + interval;
            });
        }, interval);

        return () => clearInterval(timer);
    }, [isHovered, isShowreelOpen]);

    // Ensure background video plays smoothly on tab switch
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.load();
            videoRef.current.play().catch(() => {
                // Autoplay fallback uses high-res poster image seamlessly
            });
        }
    }, [activeTabIndex]);

    const handleSelectTab = (index: number) => {
        setActiveTabIndex(index);
        setElapsedMs(0);
    };

    const handleNextSlide = () => {
        setActiveTabIndex((prev) => (prev + 1) % HERO_SLIDES.length);
        setElapsedMs(0);
    };

    const handleBookDiscoveryCall = () => {
        if (onOpenContact) {
            onOpenContact();
            return;
        }
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('ce:open-discovery-call'));
        }
    };

    const progressPercent = Math.min(100, (elapsedMs / SLIDE_DURATION_MS) * 100);

    return (
        <section
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative min-h-[92svh] lg:min-h-screen pt-24 sm:pt-28 lg:pt-32 pb-8 sm:pb-12 flex flex-col justify-between overflow-hidden bg-[#07080c] text-white select-none"
        >
            {/* FULL-BLEED CINEMATIC BACKGROUND MEDIA SHOWCASE (Compressed Video + Fallback Poster) */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeSlide.id}
                        initial={{ opacity: 0, scale: 1.04 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute inset-0 w-full h-full"
                    >
                        {/* High-Resolution Editorial Fallback Poster */}
                        <img
                            src={activeSlide.poster}
                            alt={activeSlide.tabLabel}
                            className="absolute inset-0 w-full h-full object-cover object-center lg:object-[65%_center] filter contrast-110 brightness-90"
                        />

                        {/* Lightweight Compressed Background Video (< 3.5MB stream) */}
                        <video
                            ref={videoRef}
                            poster={activeSlide.poster}
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            className="absolute inset-0 w-full h-full object-cover object-center lg:object-[65%_center] opacity-45 mix-blend-luminosity"
                        >
                            <source src={activeSlide.videoUrl} type="video/mp4" />
                        </video>

                        {/* Cinematic Blue/Indigo & Dark Luxury Atmospheric Overlays matching reference layout */}
                        <div
                            className={`absolute inset-0 bg-gradient-to-r from-[#070913]/95 via-[#0b132b]/75 to-transparent`}
                        />
                        <div
                            className={`absolute inset-0 bg-gradient-to-t ${activeSlide.accentGlow} opacity-90`}
                        />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_42%,rgba(56,189,248,0.18),transparent_55%)] pointer-events-none" />
                        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#07080c] via-[#07080c]/85 to-transparent pointer-events-none" />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* MAIN HERO CONTENT GRID */}
            <div className="max-w-7xl mx-auto px-4 xs:px-6 lg:px-8 w-full my-auto relative z-10 pt-4 sm:pt-8 pb-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                    {/* Left Side (Fixed Enterprise Value Proposition & CTAs) */}
                    <div className="lg:col-span-8 xl:col-span-7 space-y-5 sm:space-y-6">
                        {/* Eyebrow Tag */}
                        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.07] backdrop-blur-md border border-white/15 text-[11px] sm:text-xs font-mono text-accent tracking-[0.16em] uppercase font-semibold shadow-lg">
                            <span>✦ ENTERPRISE CREATIVE &amp; AI PRODUCTION STUDIO</span>
                        </div>

                        {/* Headline (H1) */}
                        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[3.5rem] xl:text-[4.1rem] font-display font-black text-white tracking-tight leading-[1.06]">
                            Enterprise Visual Production,{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffe484] via-accent to-[#f59e0b]">
                                Accelerated by AI &amp; 3D CGI.
                            </span>
                        </h1>

                        {/* Sub-headline */}
                        <p className="text-sm sm:text-base lg:text-lg text-neutral-200/90 max-w-2xl font-sans font-normal leading-relaxed">
                            We empower global luxury brands and corporate agencies with flawless digital prep, precision retouching, and hyper-realistic spatial content at unmatched turnaround velocity.
                        </p>

                        {/* Fixed CTAs */}
                        <div className="flex flex-wrap items-center gap-3.5 sm:gap-4 pt-2">
                            <button
                                type="button"
                                onClick={handleBookDiscoveryCall}
                                className="h-12 sm:h-13 px-6 sm:px-8 rounded-full text-xs sm:text-sm font-display font-bold uppercase tracking-wider bg-gradient-to-b from-[#fcd34d] via-accent to-[#e09214] text-black hover:brightness-110 hover:shadow-[0_0_30px_rgba(245,166,35,0.5)] transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer shadow-xl active:scale-[0.98]"
                            >
                                <Calendar className="w-4 h-4 text-black stroke-[2.5]" />
                                <span>Book a Discovery Call</span>
                                <ArrowUpRight className="w-4 h-4 text-black stroke-[2.5]" />
                            </button>

                            <button
                                type="button"
                                onClick={() => setIsShowreelOpen(true)}
                                className="h-12 sm:h-13 px-6 sm:px-8 rounded-full text-xs sm:text-sm font-display font-bold uppercase tracking-wider bg-black/40 hover:bg-white/15 text-white border border-white/30 hover:border-accent backdrop-blur-md transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.98] group"
                            >
                                <span>Explore Our Showreel</span>
                                <span className="w-6 h-6 rounded-full bg-accent/20 border border-accent/50 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-black transition-colors">
                                    <Play className="w-3 h-3 fill-current ml-0.5" />
                                </span>
                            </button>
                        </div>

                        {/* Lower-left Enterprise Security & Scale Trust Pill (matching reference bottom-left badge) */}
                        <div className="pt-4 sm:pt-6 flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-mono text-neutral-300">
                            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-black/45 backdrop-blur-md border border-white/10">
                                <ShieldCheck className="w-4 h-4 text-accent shrink-0" />
                                <span>ISO 27001 Certified Security</span>
                            </div>
                            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-black/45 backdrop-blur-md border border-white/10">
                                <Sparkles className="w-4 h-4 text-accent shrink-0" />
                                <span>24–48h Turnaround SLA</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Live Active Showcase Telemetry HUD Card */}
                    <div className="lg:col-span-4 xl:col-span-5 flex lg:justify-end">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeSlide.id}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -16 }}
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                className="w-full max-w-sm rounded-3xl p-5 sm:p-6 bg-black/55 backdrop-blur-xl border border-white/15 shadow-[0_25px_70px_rgba(0,0,0,0.85)] space-y-4"
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <span className="px-3 py-1 rounded-full bg-accent/15 border border-accent/30 text-[10px] font-mono uppercase tracking-widest text-accent font-bold">
                                        {activeSlide.categoryTag}
                                    </span>
                                    <span className="font-mono text-xs text-neutral-400">
                                        {activeSlide.number} / 04
                                    </span>
                                </div>

                                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 group cursor-pointer" onClick={() => setIsShowreelOpen(true)}>
                                    <img
                                        src={activeSlide.poster}
                                        alt={activeSlide.tabLabel}
                                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-md border border-white/30 flex items-center justify-center text-white group-hover:bg-accent group-hover:text-black group-hover:border-accent transition-all">
                                            <Play className="w-4 h-4 fill-current ml-0.5" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-neutral-200">
                                        <span>ACTIVE REEL PREVIEW</span>
                                        <span className="text-accent font-bold">WATCH 4K ▶</span>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <h2 className="text-lg sm:text-xl font-display font-bold text-white">
                                        {activeSlide.tabLabel}
                                    </h2>
                                    <p className="text-xs sm:text-sm text-neutral-300 font-sans">
                                        {activeSlide.subtitle}
                                    </p>
                                </div>

                                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-accent">
                                    <span>{activeSlide.metricBadge}</span>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* BOTTOM BAR: 4 CLICKABLE INTERACTIVE TABS + PROGRESS INDICATOR + NEXT ARROW */}
            <div className="max-w-7xl mx-auto px-4 xs:px-6 lg:px-8 w-full relative z-10">
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-4 border-t border-white/15">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 flex-1">
                        {HERO_SLIDES.map((slide, idx) => {
                            const isActive = idx === activeTabIndex;
                            const Icon = slide.icon;

                            return (
                                <button
                                    key={slide.id}
                                    type="button"
                                    onClick={() => handleSelectTab(idx)}
                                    className={`relative text-left p-3.5 sm:p-4 rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer group ${
                                        isActive
                                            ? 'bg-white/[0.11] border-accent/60 shadow-[0_0_25px_rgba(245,166,35,0.18)]'
                                            : 'bg-black/40 hover:bg-white/[0.06] border-white/10 hover:border-white/25'
                                    } backdrop-blur-md`}
                                >
                                    {/* Auto-play 6s Progress Bar at bottom of active tab */}
                                    {isActive && (
                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                                            <div
                                                className="h-full bg-accent transition-all duration-75 ease-linear"
                                                style={{ width: `${progressPercent}%` }}
                                            />
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between gap-2 mb-1">
                                        <span
                                            className={`font-mono text-xs sm:text-[13px] font-bold tracking-wider uppercase ${
                                                isActive ? 'text-accent' : 'text-white group-hover:text-accent'
                                            } transition-colors`}
                                        >
                                            [ {slide.tabLabel} ]
                                        </span>
                                        <Icon
                                            className={`w-3.5 h-3.5 shrink-0 ${
                                                isActive ? 'text-accent' : 'text-neutral-500 group-hover:text-neutral-300'
                                            }`}
                                        />
                                    </div>
                                    <p className="text-[11px] sm:text-xs text-neutral-300/90 font-sans line-clamp-1">
                                        {slide.subtitle}
                                    </p>
                                </button>
                            );
                        })}
                    </div>

                    {/* Right Arrow Control matching reference image */}
                    <div className="hidden lg:flex items-center pl-2">
                        <button
                            type="button"
                            onClick={handleNextSlide}
                            aria-label="Next Showcase Slide"
                            className="w-12 h-12 rounded-2xl bg-white/[0.06] hover:bg-accent text-white hover:text-black border border-white/15 hover:border-accent flex items-center justify-center transition-all duration-300 cursor-pointer shadow-lg"
                        >
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* SHOWREEL MODAL LIGHTBOX */}
            {isShowreelOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4"
                    onClick={() => setIsShowreelOpen(false)}
                >
                    <div
                        className="relative w-full max-w-4xl aspect-video bg-[#0b0d13] rounded-3xl overflow-hidden border border-white/20 shadow-[0_25px_90px_rgba(0,0,0,0.95)]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <video
                            src={activeSlide.videoUrl}
                            poster={activeSlide.poster}
                            autoPlay
                            loop
                            muted={isMuted}
                            controls
                            playsInline
                            className="w-full h-full object-cover"
                        />

                        <div className="absolute top-4 inset-x-4 flex items-center justify-between z-20 pointer-events-none">
                            <div className="flex items-center gap-2 pointer-events-auto">
                                <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-xs font-mono text-accent border border-white/15">
                                    CuttingEdger Showreel — {activeSlide.tabLabel}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setIsMuted(!isMuted)}
                                    className="p-2 rounded-full bg-black/70 backdrop-blur-md text-white hover:text-accent border border-white/15 transition-colors cursor-pointer"
                                >
                                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsShowreelOpen(false)}
                                className="p-2 rounded-full bg-black/70 backdrop-blur-md text-white hover:bg-accent hover:text-black border border-white/15 transition-all cursor-pointer pointer-events-auto"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
