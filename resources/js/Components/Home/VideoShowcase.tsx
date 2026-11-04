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
        poster: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=85',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    },
    {
        id: 'scene-2',
        title: 'Coastal Cliffside Expedition',
        category: 'Outdoor & Apparel Film',
        roiMetric: '3.2x Brand Recall',
        duration: '0:15',
        poster: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=85',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    },
    {
        id: 'scene-3',
        title: 'Lumina Skincare Ritual',
        category: 'Macro Beauty Retouch & Motion',
        roiMetric: '+48% Conversion Lift',
        duration: '0:20',
        poster: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=85',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    },
    {
        id: 'scene-4',
        title: 'Artisan Citrus & Botanicals',
        category: '3D CGI & Tabletop Motion',
        roiMetric: '3.4x Ad Engagement',
        duration: '0:12',
        poster: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=800&q=85',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    },
    {
        id: 'scene-5',
        title: 'Modern Culinary & Lifestyle',
        category: 'Commercial Brand Film',
        roiMetric: '5x Faster Rollout',
        duration: '0:22',
        poster: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=85',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    },
    {
        id: 'scene-6',
        title: 'Urban Dusk Rain Velocity',
        category: 'Automotive & Kinetic CGI',
        roiMetric: '70% Lower Shoot Overhead',
        duration: '0:18',
        poster: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=85',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    },
    {
        id: 'scene-7',
        title: 'Tactile Botanicals & Craft',
        category: 'Luxury Packaging & Prep',
        roiMetric: '24h Global Turnaround',
        duration: '0:16',
        poster: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=85',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    },
    {
        id: 'scene-8',
        title: 'Haute Horlogerie 3D Twin',
        category: '8K Spatial Product CGI',
        roiMetric: 'Zero Physical Reshoots',
        duration: '0:14',
        poster: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=85',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    },
];

// Tripled array for seamless infinite bi-directional scrolling & dragging
const LOOP_CARDS = [...CINEMATIC_CARDS, ...CINEMATIC_CARDS, ...CINEMATIC_CARDS];

export function VideoShowcase() {
    const [activeVideo, setActiveVideo] = useState<CinematicCardItem | null>(null);
    const [isMuted, setIsMuted] = useState(true);

    const viewportRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

    // Scroll & drag physics refs (0 React re-renders during 60fps animation)
    const offsetRef = useRef<number>(0);
    const velocityRef = useRef<number>(0);
    const isDraggingRef = useRef<boolean>(false);
    const isHoveredRef = useRef<boolean>(false);
    const dragDistanceRef = useRef<number>(0);
    const lastPointerXRef = useRef<number>(0);
    const singleSetWidthRef = useRef<number>(0);

    // Measure single set width and apply real-time 3D concave panoramic transforms per card
    const updateCurveTransforms = useCallback(() => {
        const viewport = viewportRef.current;
        const track = trackRef.current;
        if (!viewport || !track) {
            return;
        }

        const firstCard = cardRefs.current[0];
        const secondCard = cardRefs.current[1];
        if (firstCard && secondCard) {
            const stepWidth = secondCard.offsetLeft - firstCard.offsetLeft;
            singleSetWidthRef.current = stepWidth * CINEMATIC_CARDS.length;
        }

        const setWidth = singleSetWidthRef.current;
        if (setWidth > 0) {
            // Keep offset wrapped inside the middle set [-2 * setWidth, -setWidth] for infinite scrolling in both directions
            if (offsetRef.current <= -setWidth * 2) {
                offsetRef.current += setWidth;
            } else if (offsetRef.current >= -setWidth * 0.5) {
                offsetRef.current -= setWidth;
            }
        }

        track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;

        const viewportRect = viewport.getBoundingClientRect();
        const viewportCenterX = viewportRect.left + viewportRect.width / 2;
        const halfSpan = Math.max(viewportRect.width * 0.52, 320);

        for (let i = 0; i < cardRefs.current.length; i++) {
            const cardEl = cardRefs.current[i];
            if (!cardEl) {
                continue;
            }

            const rect = cardEl.getBoundingClientRect();
            const cardCenterX = rect.left + rect.width / 2;

            // Normalized horizontal position: -1 (left edge) -> 0 (center) -> +1 (right edge)
            const normX = Math.max(-1.35, Math.min(1.35, (cardCenterX - viewportCenterX) / halfSpan));
            const absX = Math.abs(normX);
            const curveQuad = normX * normX;

            // Concave cylindrical panorama math matching the uploaded image:
            // Center cards sit deeper & slightly shorter; outer cards rise taller & angle inward toward the viewer
            const scaleY = 0.88 + curveQuad * 0.24;
            const scaleX = 0.96 + curveQuad * 0.06;
            const rotateY = -normX * 22;
            const translateZ = curveQuad * 55;
            const brightness = 1 - Math.min(0.28, absX * 0.16);

            cardEl.style.transform = `perspective(1200px) translate3d(0, 0, ${translateZ.toFixed(1)}px) rotateY(${rotateY.toFixed(2)}deg) scale(${scaleX.toFixed(3)}, ${scaleY.toFixed(3)})`;
            cardEl.style.filter = `brightness(${brightness.toFixed(2)})`;
            cardEl.style.zIndex = String(Math.round(50 + curveQuad * 30));
        }
    }, []);

    // Initialize position into the middle set and run 60fps animation loop
    useEffect(() => {
        const initTimer = setTimeout(() => {
            const firstCard = cardRefs.current[0];
            const secondCard = cardRefs.current[1];
            if (firstCard && secondCard) {
                const stepWidth = secondCard.offsetLeft - firstCard.offsetLeft;
                singleSetWidthRef.current = stepWidth * CINEMATIC_CARDS.length;
                offsetRef.current = -singleSetWidthRef.current;
                updateCurveTransforms();
            }
        }, 30);

        let rafId: number;
        const animate = () => {
            if (!isDraggingRef.current) {
                // Apply momentum decay from user drag or wheel scroll
                if (Math.abs(velocityRef.current) > 0.05) {
                    offsetRef.current += velocityRef.current;
                    velocityRef.current *= 0.93;
                } else {
                    velocityRef.current = 0;
                    // Gentle continuous cinematic drift (slows down on hover)
                    const autoSpeed = isHoveredRef.current ? -0.18 : -0.48;
                    offsetRef.current += autoSpeed;
                }
            }

            updateCurveTransforms();
            rafId = requestAnimationFrame(animate);
        };

        rafId = requestAnimationFrame(animate);
        window.addEventListener('resize', updateCurveTransforms);

        return () => {
            clearTimeout(initTimer);
            cancelAnimationFrame(rafId);
            window.removeEventListener('resize', updateCurveTransforms);
        };
    }, [updateCurveTransforms]);

    // Pointer drag handlers for smooth mouse & touch dragging
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

        offsetRef.current += deltaX;
        velocityRef.current = deltaX * 0.85;
        updateCurveTransforms();
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

    // Horizontal trackpad / shift+wheel scrolling support
    const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey) {
            e.preventDefault();
            const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
            offsetRef.current -= delta * 0.85;
            velocityRef.current = -delta * 0.35;
            updateCurveTransforms();
        }
    };

    const handleCardClick = (item: CinematicCardItem) => {
        // Ignore click if user was dragging the carousel
        if (dragDistanceRef.current > 8) {
            return;
        }
        setActiveVideo(item);
    };

    return (
        <section
            id="portfolio-case-study-showcase"
            className="relative py-20 sm:py-26 lg:py-32 bg-[#050507] border-t border-white/10 overflow-hidden select-none"
        >
            {/* Warm Golden Arch Glow Behind Cards (Matching Reference Image) */}
            <div className="absolute top-[28%] left-1/2 -translate-x-1/2 w-[78%] max-w-6xl h-[180px] bg-gradient-to-r from-[#b88938]/25 via-[#d8ad56]/18 to-[#b88938]/25 rounded-full blur-[95px] pointer-events-none" />

            {/* Warm Golden Floor Reflection Glow at Bottom */}
            <div className="absolute bottom-14 left-1/2 -translate-x-1/2 w-[70%] max-w-5xl h-[160px] bg-[#c89a42]/20 rounded-full blur-[110px] pointer-events-none" />

            {/* TOP HEADER & HAND-DRAWN "Elevate your brand" ANNOTATION */}
            <div className="max-w-7xl mx-auto px-4 xs:px-6 lg:px-8 relative z-20 mb-8 sm:mb-12">
                <div className="relative text-center max-w-4xl mx-auto">
                    <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-[3.35rem] font-display font-extrabold uppercase tracking-[0.04em] bg-gradient-to-r from-[#d2ad63] via-[#f3d99f] to-[#c49746] bg-clip-text text-transparent leading-tight">
                        CRAFTING CINEMATIC MOMENTS
                    </h2>

                    <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg text-[#b5afa4] font-serif leading-relaxed max-w-xl mx-auto">
                        Elevate your visual presence with expert high-end <br className="hidden sm:inline" />
                        creative production.
                    </p>

                    {/* Top-Right Hand-Drawn Annotation ("Elevate your brand") matching screenshot */}
                    <div className="hidden md:flex flex-col items-center absolute -top-2 right-0 lg:right-4 xl:right-8 pointer-events-none select-none">
                        <div className="rotate-[14deg] text-center">
                            <span className="block font-serif italic text-base lg:text-lg text-[#e0cfa9] leading-tight">
                                Elevate
                            </span>
                            <span className="block font-serif italic text-base lg:text-lg text-[#e0cfa9] leading-tight">
                                your brand
                            </span>
                            {/* Hand-drawn underline */}
                            <svg
                                className="w-24 h-3 stroke-[#c8a668] fill-none stroke-[1.6] -mt-0.5"
                                viewBox="0 0 100 12"
                            >
                                <path d="M4,8 Q50,2 96,9" strokeLinecap="round" />
                            </svg>
                        </div>
                        {/* Curved arrow pointing down-left toward the right cards */}
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

            {/* 3D CONCAVE PANORAMIC SCROLLABLE / DRAGGABLE CAROUSEL STAGE */}
            <div
                ref={viewportRef}
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
                className="relative w-full overflow-hidden py-8 sm:py-12 cursor-grab active:cursor-grabbing touch-pan-y z-10"
            >
                {/* Subtle left/right edge atmospheric vignette */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-20 bg-gradient-to-r from-[#050507] to-transparent z-30" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-20 bg-gradient-to-l from-[#050507] to-transparent z-30" />

                <div
                    ref={trackRef}
                    className="flex items-center gap-4 sm:gap-5 lg:gap-6 w-max will-change-transform px-6"
                >
                    {LOOP_CARDS.map((card, idx) => (
                        <div
                            key={`${card.id}-${idx}`}
                            ref={(el) => {
                                cardRefs.current[idx] = el;
                            }}
                            onClick={() => handleCardClick(card)}
                            className="relative shrink-0 w-[185px] sm:w-[215px] md:w-[235px] lg:w-[250px] h-[290px] sm:h-[330px] md:h-[355px] lg:h-[375px] will-change-transform transition-shadow duration-300 group"
                            style={{
                                transformStyle: 'preserve-3d',
                            }}
                        >
                            {/* MAIN PORTRAIT CARD */}
                            <div className="relative w-full h-full rounded-[20px] sm:rounded-[24px] overflow-hidden border border-[#d6b472]/40 group-hover:border-[#f3d99f]/90 bg-[#101116] shadow-[0_22px_55px_rgba(0,0,0,0.92),0_0_25px_rgba(214,180,114,0.12)]">
                                <img
                                    src={card.poster}
                                    alt={card.title}
                                    draggable={false}
                                    loading="lazy"
                                    className="w-full h-full object-cover object-center pointer-events-none transition-transform duration-700 group-hover:scale-105"
                                />

                                {/* Subtle cinematic film gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/15 opacity-60 group-hover:opacity-90 transition-opacity duration-300 pointer-events-none" />

                                {/* Hover-Only Play & Context Overlay (keeps cards clean like screenshot by default) */}
                                <div className="absolute inset-0 flex flex-col justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                    <div className="flex items-center justify-between">
                                        <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-[#d6b472]/40 text-[10px] font-mono uppercase tracking-wider text-[#f3d99f] font-semibold">
                                            {card.roiMetric}
                                        </span>
                                        <span className="px-2 py-0.5 rounded-full bg-black/70 text-[10px] font-mono text-neutral-300">
                                            {card.duration}
                                        </span>
                                    </div>

                                    <div className="mx-auto my-auto w-11 h-11 rounded-full bg-black/60 backdrop-blur-md border border-[#f3d99f]/60 text-[#f3d99f] flex items-center justify-center shadow-lg">
                                        <Play className="w-4 h-4 fill-current ml-0.5" />
                                    </div>

                                    <div className="text-left">
                                        <span className="block font-mono text-[10px] uppercase tracking-wider text-[#d6b472]">
                                            {card.category}
                                        </span>
                                        <h3 className="font-display text-xs sm:text-sm font-bold text-white leading-snug">
                                            {card.title}
                                        </h3>
                                    </div>
                                </div>
                            </div>

                            {/* GLOSSY FLOOR REFLECTION BELOW CARD (Matching Reference Image) */}
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute left-0 right-0 -bottom-[92px] h-[84px] rounded-[20px] overflow-hidden opacity-35 blur-[8px] scale-y-[-1]"
                                style={{
                                    WebkitMaskImage:
                                        'linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 85%)',
                                    maskImage:
                                        'linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 85%)',
                                }}
                            >
                                <img
                                    src={card.poster}
                                    alt=""
                                    draggable={false}
                                    loading="lazy"
                                    className="w-full h-full object-cover object-bottom"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* BOTTOM CTA ("GET STARTED ↗") & HAND-DRAWN "It's time" ARROW (Matching Reference Image) */}
            <div className="relative z-20 mt-10 sm:mt-14 text-center">
                <div className="inline-flex items-center justify-center relative">
                    {/* Hand-drawn "It's time" + Curved Arrow pointing to right side of button */}
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
