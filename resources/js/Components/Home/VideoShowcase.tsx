import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, ArrowUpRight, X, Volume2, VolumeX } from 'lucide-react';

interface CinematicCardItem {
    id: string;
    title: string;
    category: string;
    roiMetric: string;
    duration: string;
    poster: string;
    videoUrl: string;
}

const CINEMATIC_CARDS: CinematicCardItem[] = [
    {
        id: 'scene-1',
        title: 'Luxury Evening Editorial',
        category: 'AI Virtual Campaign',
        roiMetric: '60% Cost Reduction',
        duration: '0:18',
        poster: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=900&q=85',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    },
    {
        id: 'scene-2',
        title: 'Coastal Cliffside Expedition',
        category: 'Outdoor & Apparel Film',
        roiMetric: '3.2x Brand Recall',
        duration: '0:15',
        poster: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=85',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    },
    {
        id: 'scene-3',
        title: 'Lumina Skincare Ritual',
        category: 'Macro Beauty Retouch & Motion',
        roiMetric: '+48% Conversion Lift',
        duration: '0:20',
        poster: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=85',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    },
    {
        id: 'scene-4',
        title: 'Artisan Citrus & Botanicals',
        category: '3D CGI & Tabletop Motion',
        roiMetric: '3.4x Ad Engagement',
        duration: '0:12',
        poster: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=900&q=85',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    },
    {
        id: 'scene-5',
        title: 'Modern Culinary & Lifestyle',
        category: 'Commercial Brand Film',
        roiMetric: '5x Faster Rollout',
        duration: '0:22',
        poster: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=85',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    },
    {
        id: 'scene-6',
        title: 'Urban Dusk Rain Velocity',
        category: 'Automotive & Kinetic CGI',
        roiMetric: '70% Lower Shoot Overhead',
        duration: '0:18',
        poster: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=900&q=85',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    },
    {
        id: 'scene-7',
        title: 'Tactile Botanicals & Craft',
        category: 'Luxury Packaging & Prep',
        roiMetric: '24h Global Turnaround',
        duration: '0:16',
        poster: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=85',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    },
    {
        id: 'scene-8',
        title: 'Haute Horlogerie 3D Twin',
        category: '8K Spatial Product CGI',
        roiMetric: 'Zero Physical Reshoots',
        duration: '0:14',
        poster: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=85',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    },
    {
        id: 'scene-9',
        title: 'Sculptural Perfume CGI',
        category: 'Refractive Glass & Fluid 3D',
        roiMetric: '4.1x ROAS Performance',
        duration: '0:16',
        poster: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=85',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    },
    {
        id: 'scene-10',
        title: 'Nordic Atelier Lookbook',
        category: 'Ghost Mannequin & Grading',
        roiMetric: '4,500 SKUs in 12h SLA',
        duration: '0:19',
        poster: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=85',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    },
    {
        id: 'scene-11',
        title: 'Acoustic Spatial Hardware',
        category: 'CAD-to-8K Product Twin',
        roiMetric: '65% Faster Launch',
        duration: '0:15',
        poster: 'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?auto=format&fit=crop&w=900&q=85',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    },
    {
        id: 'scene-12',
        title: 'Fine Diamond & Platinum Fire',
        category: 'Macro Jewelry Retouch',
        roiMetric: '99.8% First-Pass QA',
        duration: '0:17',
        poster: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=85',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    },
];

const TOTAL_CARDS = CINEMATIC_CARDS.length;

function wrapSigned(value: number, period: number): number {
    const half = period / 2;
    return ((((value + half) % period) + period) % period) - half;
}

/**
 * Computes exact hollow-curve 3D transform parameters for any continuous slot offset u.
 * Ensures adjacent cards' inner & outer vertical edges align along a continuous concave arch
 * with uniform horizontal gaps and dramatic 3D trapezoid perspective.
 */
function getHollowCurveMetrics(u: number, cardW: number, perspectivePx: number) {
    const clampedU = Math.max(-4.5, Math.min(4.5, u));
    // Negative u (left side) -> positive rotateY so left (outer) edge comes forward & grows taller
    // Positive u (right side) -> negative rotateY so right (outer) edge comes forward & grows taller
    const angleDeg = -clampedU * 13.5;
    const angleRad = (angleDeg * Math.PI) / 180;

    // Concave hollow scale: center (u=0) is deepest/smallest (0.82), outer edges rise smoothly to ~1.45+
    const scale = 0.82 + 0.068 * clampedU * clampedU;

    const halfW = (cardW * scale) / 2;
    const sinA = Math.sin(angleRad);
    const cosA = Math.cos(angleRad);

    // Exact projected left and right horizontal extents under perspective(d) rotateY(angle)
    const denomLeft = Math.max(0.35, 1 - (halfW * sinA) / perspectivePx);
    const denomRight = Math.max(0.35, 1 + (halfW * sinA) / perspectivePx);

    const projLeft = -(halfW * cosA) / denomLeft; // negative px from card center
    const projRight = (halfW * cosA) / denomRight; // positive px from card center
    const projWidth = projRight - projLeft;

    return {
        angleDeg,
        scale,
        projWidth,
    };
}

export function VideoShowcase() {
    const [activeVideo, setActiveVideo] = useState<CinematicCardItem | null>(null);
    const [isMuted, setIsMuted] = useState(true);

    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const imgRefs = useRef<(HTMLImageElement | null)[]>([]);

    // Start at index 3 so scene-1..scene-7 span slots [-3..+3] across the viewport
    const progressRef = useRef<number>(3);
    const velocityRef = useRef<number>(0);
    const isDraggingRef = useRef<boolean>(false);
    const isHoveredRef = useRef<boolean>(false);
    const dragDistanceRef = useRef<number>(0);
    const lastPointerXRef = useRef<number>(0);

    const renderHollowCurve = useCallback(() => {
        const vw = typeof window !== 'undefined' ? window.innerWidth : 1440;

        // Large portrait card dimensions matching the reference layout
        const cardW = vw < 640 ? 195 : vw < 1024 ? 225 : 250;
        const gap = vw < 640 ? 14 : 18;
        const perspectivePx = vw < 640 ? 420 : 480;

        const currentProgress = progressRef.current;

        // Numerical integration of projected card width along u so gaps stay 100% uniform while scrolling
        const computeCenterX = (u: number): number => {
            if (Math.abs(u) < 1e-4) {
                return 0;
            }
            const steps = 16;
            const du = u / steps;
            let x = 0;
            for (let s = 0; s < steps; s++) {
                const midU = (s + 0.5) * du;
                const { projWidth } = getHollowCurveMetrics(midU, cardW, perspectivePx);
                x += (projWidth + gap) * du;
            }
            return x;
        };

        for (let i = 0; i < TOTAL_CARDS; i++) {
            const el = cardRefs.current[i];
            if (!el) {
                continue;
            }

            const u = wrapSigned(i - currentProgress, TOTAL_CARDS);
            const absU = Math.abs(u);

            if (absU > 4.2) {
                el.style.opacity = '0';
                el.style.pointerEvents = 'none';
                el.style.transform = 'translate3d(-9999px, 0, 0)';
                continue;
            }

            const { angleDeg, scale } = getHollowCurveMetrics(u, cardW, perspectivePx);
            const centerX = computeCenterX(u);

            // Fade only at far offscreen edges (> 3.6 slots)
            const edgeOpacity = absU > 3.5 ? Math.max(0, 1 - (absU - 3.5) / 0.7) : 1;

            el.style.opacity = String(edgeOpacity.toFixed(3));
            el.style.pointerEvents = edgeOpacity > 0.2 ? 'auto' : 'none';
            el.style.zIndex = String(Math.round(50 + absU * 15));

            // Direct per-card perspective(480px) + rotateY + scale guarantees dramatic 3D trapezoid hollow curve in all browsers
            el.style.transform = `translate3d(${centerX.toFixed(1)}px, 0px, 0px) perspective(${perspectivePx}px) rotateY(${angleDeg.toFixed(2)}deg) scale(${scale.toFixed(3)})`;

            const imgEl = imgRefs.current[i];
            if (imgEl) {
                const brightness = 1 - Math.min(0.22, absU * 0.05);
                imgEl.style.filter = `brightness(${brightness.toFixed(2)})`;
            }
        }
    }, []);

    useEffect(() => {
        renderHollowCurve();

        let rafId: number;
        const tick = () => {
            if (!isDraggingRef.current) {
                if (Math.abs(velocityRef.current) > 0.0004) {
                    progressRef.current =
                        ((progressRef.current + velocityRef.current) % TOTAL_CARDS + TOTAL_CARDS) %
                        TOTAL_CARDS;
                    velocityRef.current *= 0.93;
                } else {
                    velocityRef.current = 0;
                    const autoDelta = isHoveredRef.current ? 0.0007 : 0.002;
                    progressRef.current = (progressRef.current + autoDelta) % TOTAL_CARDS;
                }
            }

            renderHollowCurve();
            rafId = requestAnimationFrame(tick);
        };

        rafId = requestAnimationFrame(tick);
        window.addEventListener('resize', renderHollowCurve);

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener('resize', renderHollowCurve);
        };
    }, [renderHollowCurve]);

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        isDraggingRef.current = true;
        dragDistanceRef.current = 0;
        velocityRef.current = 0;
        lastPointerXRef.current = e.clientX;
        try {
            e.currentTarget.setPointerCapture(e.pointerId);
        } catch {}
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDraggingRef.current) {
            return;
        }
        const deltaX = e.clientX - lastPointerXRef.current;
        lastPointerXRef.current = e.clientX;
        dragDistanceRef.current += Math.abs(deltaX);

        const slotDelta = -deltaX / 240;
        progressRef.current =
            ((progressRef.current + slotDelta) % TOTAL_CARDS + TOTAL_CARDS) % TOTAL_CARDS;
        velocityRef.current = slotDelta * 0.85;
        renderHollowCurve();
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDraggingRef.current) {
            return;
        }
        isDraggingRef.current = false;
        try {
            e.currentTarget.releasePointerCapture(e.pointerId);
        } catch {}
    };

    const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey) {
            e.preventDefault();
            const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
            const slotDelta = delta / 300;
            progressRef.current =
                ((progressRef.current + slotDelta) % TOTAL_CARDS + TOTAL_CARDS) % TOTAL_CARDS;
            velocityRef.current = slotDelta * 0.35;
            renderHollowCurve();
        }
    };

    const handleCardClick = (item: CinematicCardItem) => {
        if (dragDistanceRef.current > 8) {
            return;
        }
        setActiveVideo(item);
    };

    return (
        <section
            id="portfolio-case-study-showcase"
            className="relative py-20 sm:py-28 lg:py-32 bg-[#050507] border-t border-white/10 overflow-hidden select-none"
        >
            {/* Warm Golden Arch Glow Behind the Upper Hollow Curve */}
            <div className="absolute top-[24%] left-1/2 -translate-x-1/2 w-[85%] max-w-6xl h-[220px] bg-gradient-to-r from-[#c49238]/30 via-[#e5bd68]/20 to-[#c49238]/30 rounded-full blur-[105px] pointer-events-none" />

            {/* Warm Golden Floor Reflection Glow at Bottom */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[78%] max-w-5xl h-[180px] bg-[#c89a42]/24 rounded-full blur-[115px] pointer-events-none" />

            {/* TOP HEADER & HAND-DRAWN "Elevate your brand" ANNOTATION */}
            <div className="max-w-7xl mx-auto px-4 xs:px-6 lg:px-8 relative z-30 mb-6 sm:mb-10">
                <div className="relative text-center max-w-4xl mx-auto">
                    <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-[3.4rem] font-display font-extrabold uppercase tracking-[0.04em] bg-gradient-to-r from-[#d2ad63] via-[#f3d99f] to-[#c49746] bg-clip-text text-transparent leading-tight">
                        CRAFTING CINEMATIC MOMENTS
                    </h2>

                    <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg text-[#b5afa4] font-serif leading-relaxed max-w-xl mx-auto">
                        Elevate your visual presence with expert high-end <br className="hidden sm:inline" />
                        creative production.
                    </p>

                    {/* Top-Right Hand-Drawn Annotation ("Elevate your brand") */}
                    <div className="hidden md:flex flex-col items-center absolute -top-2 right-0 lg:right-4 xl:right-6 pointer-events-none select-none">
                        <div className="rotate-[14deg] text-center">
                            <span className="block font-serif italic text-base lg:text-lg text-[#e0cfa9] leading-tight">
                                Elevate
                            </span>
                            <span className="block font-serif italic text-base lg:text-lg text-[#e0cfa9] leading-tight">
                                your brand
                            </span>
                            <svg
                                className="w-24 h-3 stroke-[#c8a668] fill-none stroke-[1.6] -mt-0.5"
                                viewBox="0 0 100 12"
                            >
                                <path d="M4,8 Q50,2 96,9" strokeLinecap="round" />
                            </svg>
                        </div>
                        <svg
                            className="w-14 h-16 stroke-[#c8a668] fill-none stroke-[1.5] -mt-1 ml-6"
                            viewBox="0 0 60 70"
                        >
                            <path
                                d="M22,4 Q48,26 24,58 M24,58 L22,46 M24,58 L36,53"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                </div>
            </div>

            {/* 3D HOLLOW CONCAVE PANORAMIC STAGE */}
            <div
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                onMouseEnter={() => {
                    isHoveredRef.current = true;
                }}
                onMouseLeave={() => {
                    isHoveredRef.current = false;
                    isDraggingRef.current = false;
                }}
                onWheel={handleWheel}
                className="relative w-full h-[460px] sm:h-[540px] lg:h-[600px] flex items-center justify-center cursor-grab active:cursor-grabbing touch-pan-y z-20"
            >
                {CINEMATIC_CARDS.map((card, idx) => (
                    <div
                        key={card.id}
                        ref={(el) => {
                            cardRefs.current[idx] = el;
                        }}
                        onClick={() => handleCardClick(card)}
                        className="absolute left-1/2 top-1/2 w-[195px] sm:w-[225px] lg:w-[250px] h-[310px] sm:h-[360px] lg:h-[390px] -ml-[97.5px] sm:-ml-[112.5px] lg:-ml-[125px] -mt-[175px] sm:-mt-[200px] lg:-mt-[215px] will-change-transform group"
                    >
                        {/* MAIN PORTRAIT CARD */}
                        <div className="relative w-full h-full rounded-[20px] sm:rounded-[24px] overflow-hidden border border-[#ddb974]/45 group-hover:border-[#f5dfa6] bg-[#101116] shadow-[0_25px_65px_rgba(0,0,0,0.95),0_0_28px_rgba(214,180,114,0.14)] transition-colors duration-300">
                            <img
                                ref={(el) => {
                                    imgRefs.current[idx] = el;
                                }}
                                src={card.poster}
                                alt={card.title}
                                draggable={false}
                                className="w-full h-full object-cover object-center pointer-events-none transition-transform duration-700 group-hover:scale-105"
                            />

                            {/* Subtle film gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/15 opacity-55 group-hover:opacity-90 transition-opacity duration-300 pointer-events-none" />

                            {/* Hover-Only Play & Context Overlay */}
                            <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                <div className="flex items-center justify-between gap-1">
                                    <span className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-[#d6b472]/45 text-[10px] font-mono uppercase tracking-wider text-[#f3d99f] font-semibold">
                                        {card.roiMetric}
                                    </span>
                                    <span className="px-2 py-0.5 rounded-full bg-black/75 text-[10px] font-mono text-neutral-300">
                                        {card.duration}
                                    </span>
                                </div>

                                <div className="mx-auto my-auto w-12 h-12 rounded-full bg-black/65 backdrop-blur-md border border-[#f3d99f]/65 text-[#f3d99f] flex items-center justify-center shadow-xl">
                                    <Play className="w-5 h-5 fill-current ml-0.5" />
                                </div>

                                <div className="text-left">
                                    <span className="block font-mono text-[10px] uppercase tracking-wider text-[#d6b472]">
                                        {card.category}
                                    </span>
                                    <h3 className="font-display text-sm sm:text-base font-bold text-white leading-snug">
                                        {card.title}
                                    </h3>
                                </div>
                            </div>
                        </div>

                        {/* GLOSSY FLOOR REFLECTION DIRECTLY UNDER EACH 3D CARD */}
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute left-0 right-0 -bottom-[105px] h-[95px] rounded-[20px] overflow-hidden opacity-40 blur-[9px] scale-y-[-1]"
                            style={{
                                WebkitMaskImage:
                                    'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 82%)',
                                maskImage:
                                    'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 82%)',
                            }}
                        >
                            <img
                                src={card.poster}
                                alt=""
                                draggable={false}
                                className="w-full h-full object-cover object-bottom"
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* BOTTOM CTA ("GET STARTED ↗") & HAND-DRAWN "It's time" ARROW */}
            <div className="relative z-30 mt-2 sm:mt-4 text-center">
                <div className="inline-flex items-center justify-center relative">
                    <div className="hidden xs:flex flex-col items-start absolute -top-11 -right-24 sm:-right-28 pointer-events-none select-none">
                        <span className="font-serif italic text-sm sm:text-base text-[#d8c7a6] tracking-wide ml-2">
                            It&apos;s time
                        </span>
                        <svg
                            className="w-12 h-10 stroke-[#c8a668] fill-none stroke-[1.5] -mt-0.5"
                            viewBox="0 0 52 44"
                        >
                            <path
                                d="M36,4 Q32,26 6,32 M6,32 L14,25 M6,32 L15,37"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>

                    <a
                        href="/contact?intent=video-production"
                        className="group inline-flex items-center gap-2.5 px-7 sm:px-8 py-3.5 rounded-xl bg-[#0e0c08]/90 hover:bg-[#d4a853] text-[#f3e5c8] hover:text-black border border-[#c8a258]/60 hover:border-[#f3d99f] font-sans font-semibold text-xs sm:text-sm uppercase tracking-[0.16em] transition-all duration-300 shadow-[0_0_30px_rgba(200,162,88,0.28),inset_0_1px_0_rgba(255,255,255,0.12)] cursor-pointer"
                    >
                        <span>GET STARTED</span>
                        <ArrowUpRight className="w-4 h-4 text-[#d4a853] group-hover:text-black transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                </div>
            </div>

            {/* Video Lightbox Modal */}
            {activeVideo && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4"
                    onClick={() => setActiveVideo(null)}
                >
                    <div
                        className="relative w-full max-w-sm sm:max-w-md aspect-[9/16] max-h-[85vh] bg-[#0c0d12] rounded-3xl overflow-hidden border border-[#d6b472]/40 shadow-[0_25px_80px_rgba(0,0,0,0.95)]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <video
                            src={activeVideo.videoUrl}
                            poster={activeVideo.poster}
                            autoPlay
                            loop
                            muted={isMuted}
                            playsInline
                            className="w-full h-full object-cover"
                        />

                        <div className="absolute top-4 inset-x-4 flex items-center justify-between z-20">
                            <div className="flex items-center gap-2">
                                <span className="px-3 py-1 rounded-full bg-black/75 border border-[#d6b472]/40 text-[#f3d99f] text-[11px] font-mono font-bold">
                                    {activeVideo.roiMetric}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setIsMuted(!isMuted)}
                                    className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white hover:text-accent border border-white/10 transition-colors cursor-pointer"
                                >
                                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={() => setActiveVideo(null)}
                                className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-accent hover:text-black border border-white/10 transition-all cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="absolute bottom-4 inset-x-4 p-4 rounded-2xl bg-black/80 backdrop-blur-md border border-white/15 z-20 space-y-1">
                            <span className="font-mono text-[10px] uppercase tracking-wider text-[#d6b472] font-semibold block">
                                {activeVideo.category}
                            </span>
                            <h4 className="font-display text-base font-bold text-white">
                                {activeVideo.title}
                            </h4>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
