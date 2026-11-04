import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowUpRight } from 'lucide-react';

interface CinematicImageCard {
    id: string;
    title: string;
    category: string;
    roiMetric: string;
    image: string;
    /** RGB tuple "R, G, B" used to dynamically shift the section background glow as cards scroll */
    ambientRgb: [number, number, number];
}

const CINEMATIC_CARDS: CinematicImageCard[] = [
    {
        id: 'scene-1',
        title: 'Luxury Evening Editorial',
        category: 'AI Virtual Shoot',
        roiMetric: '60% Cost Reduction',
        image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=85',
        ambientRgb: [196, 134, 68],
    },
    {
        id: 'scene-2',
        title: 'Coastal Horizon Campaign',
        category: 'Outdoor Color Grading',
        roiMetric: '24h Global Delivery',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=85',
        ambientRgb: [56, 138, 168],
    },
    {
        id: 'scene-3',
        title: 'Botanical Skincare Macro',
        category: 'Beauty & Skin Retouch',
        roiMetric: 'Sub-1 ΔE Color Match',
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=85',
        ambientRgb: [214, 152, 112],
    },
    {
        id: 'scene-4',
        title: 'Artisanal Citrus & Botanicals',
        category: '3D CGI & Tabletop Prep',
        roiMetric: '70% Faster Than Shoot',
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=900&q=85',
        ambientRgb: [224, 162, 54],
    },
    {
        id: 'scene-5',
        title: 'Organic Culinary Lifestyle',
        category: 'Editorial Retouching',
        roiMetric: '3.2x Ad Engagement',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=85',
        ambientRgb: [74, 158, 118],
    },
    {
        id: 'scene-6',
        title: 'Night Urban Motorsport',
        category: 'Automotive CGI & Matte',
        roiMetric: '8K Spatial Environment',
        image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=900&q=85',
        ambientRgb: [62, 118, 186],
    },
    {
        id: 'scene-7',
        title: 'Atelier Craft & Texture',
        category: 'Luxury Detail Grading',
        roiMetric: '10,000+ Assets / Day',
        image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=85',
        ambientRgb: [204, 146, 82],
    },
    {
        id: 'scene-8',
        title: 'Haute Horlogerie Chrono',
        category: '3D Spatial Product CGI',
        roiMetric: 'Zero Physical Samples',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85',
        ambientRgb: [188, 154, 78],
    },
    {
        id: 'scene-9',
        title: 'Elixir Glassware Refraction',
        category: 'Caustics & Fluid CGI',
        roiMetric: '4.4x ROAS Lift',
        image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=85',
        ambientRgb: [168, 102, 178],
    },
    {
        id: 'scene-10',
        title: 'Avant-Garde Couture Lookbook',
        category: 'Ghost Mannequin & AI',
        roiMetric: '4,500 SKUs in 12h SLA',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=85',
        ambientRgb: [198, 96, 122],
    },
];

const TOTAL_CARDS = CINEMATIC_CARDS.length;

function wrapSigned(value: number, period: number): number {
    const half = period / 2;
    return ((((value + half) % period) + period) % period) - half;
}

/**
 * Computes compact, refined 3D hollow-curve parameters for slot offset `u`.
 * Keeps card width sleek (`scaleX` ~ 0.96..1.03) so side cards never look bloated,
 * while `scaleY` + `perspective` + `rotateY` form a smooth concave 3D arch.
 */
function getHollowCurveMetrics(u: number, cardW: number, perspectivePx: number) {
    const clampedU = Math.max(-4.5, Math.min(4.5, u));

    // Left side (u < 0) -> positive rotateY; Right side (u > 0) -> negative rotateY
    const angleDeg = -clampedU * 11.2;
    const angleRad = (angleDeg * Math.PI) / 180;

    // Gentle width & height curve so side cards curve up in 3D without becoming oversized
    const scaleX = 0.96 + 0.008 * clampedU * clampedU;
    const scaleY = 0.88 + 0.025 * clampedU * clampedU;

    const halfW = (cardW * scaleX) / 2;
    const sinA = Math.sin(angleRad);
    const cosA = Math.cos(angleRad);

    const denomLeft = Math.max(0.42, 1 - (halfW * sinA) / perspectivePx);
    const denomRight = Math.max(0.42, 1 + (halfW * sinA) / perspectivePx);

    const projLeft = -(halfW * cosA) / denomLeft;
    const projRight = (halfW * cosA) / denomRight;
    const projWidth = projRight - projLeft;

    return {
        angleDeg,
        scaleX,
        scaleY,
        projWidth,
    };
}

function interpolateAmbientRgb(progress: number, offset: number): [number, number, number] {
    const pos = (((progress + offset) % TOTAL_CARDS) + TOTAL_CARDS) % TOTAL_CARDS;
    const idx0 = Math.floor(pos) % TOTAL_CARDS;
    const idx1 = (idx0 + 1) % TOTAL_CARDS;
    const frac = pos - Math.floor(pos);

    const c0 = CINEMATIC_CARDS[idx0].ambientRgb;
    const c1 = CINEMATIC_CARDS[idx1].ambientRgb;

    return [
        Math.round(c0[0] + (c1[0] - c0[0]) * frac),
        Math.round(c0[1] + (c1[1] - c0[1]) * frac),
        Math.round(c0[2] + (c1[2] - c0[2]) * frac),
    ];
}

export function VideoShowcase() {
    const sectionRef = useRef<HTMLElement | null>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
    const reflectionRefs = useRef<(HTMLDivElement | null)[]>([]);

    // Dynamic background glow refs that shift colors & parallax as cards move
    const bgLeftGlowRef = useRef<HTMLDivElement | null>(null);
    const bgCenterGlowRef = useRef<HTMLDivElement | null>(null);
    const bgRightGlowRef = useRef<HTMLDivElement | null>(null);
    const bgFloorGlowRef = useRef<HTMLDivElement | null>(null);
    const bgSectionTintRef = useRef<HTMLDivElement | null>(null);

    const [activeCenterIndex, setActiveCenterIndex] = useState<number>(3);

    // Start at index 3 so scene-1..scene-7 span slots [-3..+3] matching the reference image
    const progressRef = useRef<number>(3);
    const lastReportedIndexRef = useRef<number>(3);
    const velocityRef = useRef<number>(0);
    const isDraggingRef = useRef<boolean>(false);
    const isHoveredRef = useRef<boolean>(false);
    const lastPointerXRef = useRef<number>(0);
    const scrollParallaxYRef = useRef<number>(0);

    const renderHollowCurve = useCallback(() => {
        const vw = typeof window !== 'undefined' ? window.innerWidth : 1440;

        // Compact, balanced portrait card dimensions matching the reference screenshot
        const cardW = vw < 640 ? 136 : vw < 1024 ? 158 : 178;
        const gap = vw < 640 ? 10 : 15;
        const perspectivePx = vw < 640 ? 380 : 440;

        const currentProgress = progressRef.current;

        // Update active center card index for subtle blurred background image crossfade
        const roundedCenter =
            ((Math.round(currentProgress) % TOTAL_CARDS) + TOTAL_CARDS) % TOTAL_CARDS;
        if (roundedCenter !== lastReportedIndexRef.current) {
            lastReportedIndexRef.current = roundedCenter;
            setActiveCenterIndex(roundedCenter);
        }

        // Dynamic ambient background colors interpolated from left (-2), center (0), and right (+2) cards
        const [lR, lG, lB] = interpolateAmbientRgb(currentProgress, -2);
        const [cR, cG, cB] = interpolateAmbientRgb(currentProgress, 0);
        const [rR, rG, rB] = interpolateAmbientRgb(currentProgress, 2);

        if (bgLeftGlowRef.current) {
            bgLeftGlowRef.current.style.background = `radial-gradient(circle, rgba(${lR}, ${lG}, ${lB}, 0.34) 0%, rgba(${lR}, ${lG}, ${lB}, 0) 70%)`;
        }
        if (bgCenterGlowRef.current) {
            bgCenterGlowRef.current.style.background = `radial-gradient(circle, rgba(${cR}, ${cG}, ${cB}, 0.30) 0%, rgba(${cR}, ${cG}, ${cB}, 0) 72%)`;
        }
        if (bgRightGlowRef.current) {
            bgRightGlowRef.current.style.background = `radial-gradient(circle, rgba(${rR}, ${rG}, ${rB}, 0.34) 0%, rgba(${rR}, ${rG}, ${rB}, 0) 70%)`;
        }
        if (bgFloorGlowRef.current) {
            bgFloorGlowRef.current.style.background = `linear-gradient(90deg, rgba(${lR}, ${lG}, ${lB}, 0.26) 0%, rgba(${cR}, ${cG}, ${cB}, 0.32) 50%, rgba(${rR}, ${rG}, ${rB}, 0.26) 100%)`;
        }
        if (bgSectionTintRef.current) {
            bgSectionTintRef.current.style.background = `radial-gradient(ellipse 80% 55% at 50% 48%, rgba(${cR}, ${cG}, ${cB}, 0.14) 0%, rgba(${lR}, ${lG}, ${lB}, 0.06) 45%, rgba(5, 5, 7, 0) 80%)`;
        }

        // Integrate projected card widths so horizontal gaps stay uniform at all times
        const computeCenterX = (u: number): number => {
            if (Math.abs(u) < 1e-4) {
                return 0;
            }
            const steps = 14;
            const du = u / steps;
            let x = 0;
            for (let s = 0; s < steps; s++) {
                const midU = (s + 0.5) * du;
                const { projWidth } = getHollowCurveMetrics(midU, cardW, perspectivePx);
                x += (projWidth + gap) * du;
            }
            return x;
        };

        const verticalParallax = scrollParallaxYRef.current;

        for (let i = 0; i < TOTAL_CARDS; i++) {
            const el = cardRefs.current[i];
            if (!el) {
                continue;
            }

            const u = wrapSigned(i - currentProgress, TOTAL_CARDS);
            const absU = Math.abs(u);

            if (absU > 4.1) {
                el.style.opacity = '0';
                el.style.pointerEvents = 'none';
                el.style.transform = 'translate3d(-9999px, 0, 0)';
                continue;
            }

            const { angleDeg, scaleX, scaleY } = getHollowCurveMetrics(u, cardW, perspectivePx);
            const centerX = computeCenterX(u);

            // Parallax-based opacity: center cards are 1.0, smoothly attenuating toward the outer wings
            const parallaxOpacity =
                absU <= 1.1
                    ? 1
                    : absU <= 3.3
                      ? Math.max(0.42, 1 - Math.pow((absU - 1.1) / 2.4, 1.35) * 0.52)
                      : Math.max(0, 0.48 * (1 - (absU - 3.3) / 0.8));

            // Subtle vertical parallax wave per slot + page scroll parallax
            const slotParallaxY = verticalParallax * (1 - Math.min(1, absU * 0.18));

            el.style.opacity = parallaxOpacity.toFixed(3);
            el.style.pointerEvents = parallaxOpacity > 0.25 ? 'auto' : 'none';
            el.style.zIndex = String(Math.round(50 + absU * 10));

            el.style.transform = `translate3d(${centerX.toFixed(1)}px, ${slotParallaxY.toFixed(1)}px, 0px) perspective(${perspectivePx}px) rotateY(${angleDeg.toFixed(2)}deg) scale3d(${scaleX.toFixed(3)}, ${scaleY.toFixed(3)}, 1)`;

            // Inner image horizontal parallax shift + depth brightness
            const imgEl = imgRefs.current[i];
            if (imgEl) {
                const parallaxShiftX = Math.max(-18, Math.min(18, -u * 5.5));
                const brightness = 1 - Math.min(0.28, absU * 0.065);
                imgEl.style.transform = `scale(1.16) translate3d(${parallaxShiftX.toFixed(1)}px, 0, 0)`;
                imgEl.style.filter = `brightness(${brightness.toFixed(2)})`;
            }

            // Floor reflection opacity modulated by parallax offset
            const reflEl = reflectionRefs.current[i];
            if (reflEl) {
                const reflOpacity = Math.max(0.08, 0.36 * parallaxOpacity);
                reflEl.style.opacity = reflOpacity.toFixed(3);
            }
        }
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (!sectionRef.current || typeof window === 'undefined') {
                return;
            }
            const rect = sectionRef.current.getBoundingClientRect();
            const vh = window.innerHeight || 900;
            // Normalized progress [-1 .. +1] as section passes through viewport center
            const centerOffset = (rect.top + rect.height / 2 - vh / 2) / (vh * 0.7);
            scrollParallaxYRef.current = Math.max(-1, Math.min(1, centerOffset)) * -14;
        };

        handleScroll();
        renderHollowCurve();

        let rafId: number;
        const tick = () => {
            if (!isDraggingRef.current) {
                if (Math.abs(velocityRef.current) > 0.0003) {
                    progressRef.current =
                        ((progressRef.current + velocityRef.current) % TOTAL_CARDS + TOTAL_CARDS) %
                        TOTAL_CARDS;
                    velocityRef.current *= 0.93;
                } else {
                    velocityRef.current = 0;
                    const autoDelta = isHoveredRef.current ? 0.0006 : 0.0018;
                    progressRef.current = (progressRef.current + autoDelta) % TOTAL_CARDS;
                }
            }

            renderHollowCurve();
            rafId = requestAnimationFrame(tick);
        };

        rafId = requestAnimationFrame(tick);
        window.addEventListener('resize', renderHollowCurve);
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener('resize', renderHollowCurve);
            window.removeEventListener(
                'scroll',
                handleScroll as EventListener
            );
        };
    }, [renderHollowCurve]);

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        isDraggingRef.current = true;
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

        const slotDelta = -deltaX / 190;
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
            const slotDelta = delta / 240;
            progressRef.current =
                ((progressRef.current + slotDelta) % TOTAL_CARDS + TOTAL_CARDS) % TOTAL_CARDS;
            velocityRef.current = slotDelta * 0.35;
            renderHollowCurve();
        }
    };

    const activeCard = CINEMATIC_CARDS[activeCenterIndex] ?? CINEMATIC_CARDS[3];

    return (
        <section
            ref={sectionRef}
            id="portfolio-case-study-showcase"
            className="relative py-14 sm:py-20 lg:py-24 bg-[#050507] border-t border-white/10 overflow-hidden select-none"
        >
            {/* DYNAMIC PARALLAX BACKGROUND LAYERS THAT CHANGE WITH ACTIVE CARDS */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                {/* Soft blurred active card image aura in the background */}
                <img
                    key={activeCard.id}
                    src={activeCard.image}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover opacity-[0.14] blur-[95px] scale-125 transition-all duration-1000"
                />

                {/* Smoothly interpolated radial color tint across the section */}
                <div
                    ref={bgSectionTintRef}
                    className="absolute inset-0 transition-colors duration-300"
                />

                {/* Left, Center, and Right dynamic color glows behind the hollow arch */}
                <div
                    ref={bgLeftGlowRef}
                    className="absolute top-[22%] left-[8%] w-[38%] h-[240px] rounded-full blur-[90px]"
                />
                <div
                    ref={bgCenterGlowRef}
                    className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[48%] h-[220px] rounded-full blur-[95px]"
                />
                <div
                    ref={bgRightGlowRef}
                    className="absolute top-[22%] right-[8%] w-[38%] h-[240px] rounded-full blur-[90px]"
                />

                {/* Dynamic Floor Ambient Glow at Bottom */}
                <div
                    ref={bgFloorGlowRef}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[82%] max-w-5xl h-[130px] rounded-full blur-[95px]"
                />

                {/* Dark top & bottom edge vignette so section blends seamlessly */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#050507] via-transparent to-[#050507]" />
            </div>

            {/* TOP HEADER & HAND-DRAWN "Elevate your brand" ANNOTATION */}
            <div className="max-w-6xl mx-auto px-4 xs:px-6 lg:px-8 relative z-30 mb-4 sm:mb-6">
                <div className="relative text-center max-w-3xl mx-auto">
                    <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-[2.65rem] font-display font-extrabold uppercase tracking-[0.04em] bg-gradient-to-r from-[#d2ad63] via-[#f3d99f] to-[#c49746] bg-clip-text text-transparent leading-tight">
                        CRAFTING CINEMATIC MOMENTS
                    </h2>

                    <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm lg:text-base text-[#b5afa4] font-serif leading-relaxed max-w-md mx-auto">
                        Elevate your visual presence with expert high-end <br className="hidden sm:inline" />
                        creative production.
                    </p>

                    {/* Top-Right Hand-Drawn Annotation ("Elevate your brand") */}
                    <div className="hidden md:flex flex-col items-center absolute -top-1 right-0 lg:right-2 pointer-events-none select-none">
                        <div className="rotate-[14deg] text-center">
                            <span className="block font-serif italic text-sm lg:text-base text-[#e0cfa9] leading-tight">
                                Elevate
                            </span>
                            <span className="block font-serif italic text-sm lg:text-base text-[#e0cfa9] leading-tight">
                                your brand
                            </span>
                            <svg
                                className="w-20 h-2.5 stroke-[#c8a668] fill-none stroke-[1.6] -mt-0.5"
                                viewBox="0 0 100 12"
                            >
                                <path d="M4,8 Q50,2 96,9" strokeLinecap="round" />
                            </svg>
                        </div>
                        <svg
                            className="w-12 h-14 stroke-[#c8a668] fill-none stroke-[1.5] -mt-1 ml-5"
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

            {/* 3D HOLLOW CONCAVE IMAGE STAGE (Compact & Proportionate) */}
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
                className="relative w-full h-[310px] sm:h-[360px] lg:h-[400px] flex items-center justify-center cursor-grab active:cursor-grabbing touch-pan-y z-20"
            >
                {CINEMATIC_CARDS.map((card, idx) => (
                    <div
                        key={card.id}
                        ref={(el) => {
                            cardRefs.current[idx] = el;
                        }}
                        className="absolute left-1/2 top-1/2 w-[136px] sm:w-[158px] lg:w-[178px] h-[204px] sm:h-[236px] lg:h-[264px] -ml-[68px] sm:-ml-[79px] lg:-ml-[89px] -mt-[114px] sm:-mt-[130px] lg:-mt-[144px] will-change-transform group"
                    >
                        {/* MAIN PORTRAIT IMAGE CARD (Pure Image, No Video Controls) */}
                        <div className="relative w-full h-full rounded-[16px] sm:rounded-[18px] overflow-hidden border border-[#ddb974]/45 group-hover:border-[#f5dfa6] bg-[#101116] shadow-[0_20px_50px_rgba(0,0,0,0.92),0_0_22px_rgba(214,180,114,0.12)] transition-colors duration-300">
                            <img
                                ref={(el) => {
                                    imgRefs.current[idx] = el;
                                }}
                                src={card.image}
                                alt={card.title}
                                draggable={false}
                                className="w-full h-full object-cover object-center pointer-events-none will-change-transform"
                            />

                            {/* Subtle edge shading */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/10 opacity-45 group-hover:opacity-80 transition-opacity duration-300 pointer-events-none" />

                            {/* Subtle Hover Caption (Image Portfolio Context Only) */}
                            <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none text-left">
                                <span className="inline-block px-2 py-0.5 rounded-full bg-black/75 border border-[#d6b472]/40 text-[9px] font-mono uppercase tracking-wider text-[#f3d99f] mb-1">
                                    {card.roiMetric}
                                </span>
                                <h3 className="font-display text-xs sm:text-sm font-bold text-white leading-snug line-clamp-1">
                                    {card.title}
                                </h3>
                            </div>
                        </div>

                        {/* GLOSSY FLOOR REFLECTION UNDER EACH 3D IMAGE CARD */}
                        <div
                            ref={(el) => {
                                reflectionRefs.current[idx] = el;
                            }}
                            aria-hidden="true"
                            className="pointer-events-none absolute left-0 right-0 -bottom-[76px] h-[68px] rounded-[16px] overflow-hidden opacity-35 blur-[8px] scale-y-[-1]"
                            style={{
                                WebkitMaskImage:
                                    'linear-gradient(to bottom, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0) 82%)',
                                maskImage:
                                    'linear-gradient(to bottom, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0) 82%)',
                            }}
                        >
                            <img
                                src={card.image}
                                alt=""
                                draggable={false}
                                className="w-full h-full object-cover object-bottom"
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* BOTTOM CTA ("GET STARTED ↗") & HAND-DRAWN "It's time" ARROW */}
            <div className="relative z-30 mt-1 sm:mt-2 text-center">
                <div className="inline-flex items-center justify-center relative">
                    <div className="hidden xs:flex flex-col items-start absolute -top-10 -right-22 sm:-right-26 pointer-events-none select-none">
                        <span className="font-serif italic text-xs sm:text-sm text-[#d8c7a6] tracking-wide ml-2">
                            It&apos;s time
                        </span>
                        <svg
                            className="w-11 h-9 stroke-[#c8a668] fill-none stroke-[1.5] -mt-0.5"
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
                        href="/contact"
                        className="group inline-flex items-center gap-2 px-6 sm:px-7 py-3 rounded-xl bg-[#0e0c08]/90 hover:bg-[#d4a853] text-[#f3e5c8] hover:text-black border border-[#c8a258]/60 hover:border-[#f3d99f] font-sans font-semibold text-xs uppercase tracking-[0.16em] transition-all duration-300 shadow-[0_0_26px_rgba(200,162,88,0.26),inset_0_1px_0_rgba(255,255,255,0.12)] cursor-pointer"
                    >
                        <span>GET STARTED</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-[#d4a853] group-hover:text-black transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                </div>
            </div>
        </section>
    );
}
