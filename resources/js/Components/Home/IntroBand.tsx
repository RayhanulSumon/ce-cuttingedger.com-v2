import React, { useRef } from 'react';
import { Link } from '@inertiajs/react';
import {
    motion,
    useScroll,
    useTransform,
    useMotionValue,
    useVelocity,
    useSpring,
    useAnimationFrame,
} from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

function wrap(min: number, max: number, v: number): number {
    const rangeSize = max - min;
    return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
}

interface MarqueeItem {
    text: string;
    style: 'highlight' | 'stroke' | 'filled';
}

interface KineticMarqueeRowProps {
    items: MarqueeItem[];
    baseSpeed: number; // Positive = right drift, Negative = left drift
    accentColor: string;
    bgClass: string;
    velocityFactor: any;
}

function KineticMarqueeRow({
    items,
    baseSpeed,
    accentColor,
    bgClass,
    velocityFactor,
}: KineticMarqueeRowProps) {
    const baseX = useMotionValue(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const isDraggingRef = useRef<boolean>(false);
    const isHoveredRef = useRef<boolean>(false);
    const lastPointerXRef = useRef<number>(0);

    // Infinite 4-block wrap: seamless 0% to -25% loop with zero jumps
    const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);

    useAnimationFrame((_time, delta) => {
        if (isDraggingRef.current) return;

        // Normalize delta to cap spikes on frame drops (max 32ms)
        const safeDelta = Math.min(delta, 32);

        let speed = baseSpeed;
        if (isHoveredRef.current) {
            speed *= 0.25; // calm slow drift on hover
        }

        const vFactor = velocityFactor.get();
        let moveBy = speed * (safeDelta / 1000);
        if (Math.abs(vFactor) > 0.05) {
            // Smooth, subtle scroll momentum without jarring velocity spikes
            moveBy += moveBy * Math.min(Math.abs(vFactor), 0.5);
        }

        baseX.set(baseX.get() + moveBy);
    });

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        isDraggingRef.current = true;
        lastPointerXRef.current = e.clientX;
        try {
            e.currentTarget.setPointerCapture(e.pointerId);
        } catch {}
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDraggingRef.current) return;
        const deltaX = e.clientX - lastPointerXRef.current;
        lastPointerXRef.current = e.clientX;

        const containerWidth = containerRef.current?.offsetWidth || window.innerWidth;
        const deltaPercent = (deltaX / containerWidth) * 7.5;
        baseX.set(baseX.get() + deltaPercent);
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        isDraggingRef.current = false;
        try {
            e.currentTarget.releasePointerCapture(e.pointerId);
        } catch {}
    };

    return (
        <div
            ref={containerRef}
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
            className={`py-4 ${bgClass} overflow-hidden cursor-grab active:cursor-grabbing touch-pan-y select-none relative group [contain:paint] [transform:translateZ(0)]`}
        >
            <motion.div
                style={{ x }}
                className="flex w-max will-change-transform [transform:translateZ(0)] [backface-visibility:hidden] [perspective:1000px]"
            >
                {[0, 1, 2, 3].map((blockIdx) => (
                    <div
                        key={blockIdx}
                        className="flex shrink-0 items-center gap-10 sm:gap-14 pr-10 sm:pr-14 [transform:translateZ(0)]"
                    >
                        {items.map((item, idx) => (
                            <div
                                key={`b${blockIdx}-${idx}`}
                                className="flex items-center gap-10 sm:gap-14 shrink-0 [transform:translateZ(0)]"
                            >
                                <span
                                    className={`font-['Clash_Display',_'Syne',_sans-serif] uppercase font-bold text-3xl sm:text-5xl md:text-6xl lg:text-[64px] xl:text-[76px] tracking-wide leading-none pointer-events-none [backface-visibility:hidden] [transform:translateZ(0)] ${
                                        item.style === 'highlight'
                                            ? accentColor === '#d4ff00'
                                                ? 'text-[#d4ff00] [text-shadow:0_0_25px_rgba(212,255,0,0.5),0_0_50px_rgba(212,255,0,0.2)]'
                                                : 'text-[#00f5ff] [text-shadow:0_0_25px_rgba(0,245,255,0.5),0_0_50px_rgba(0,245,255,0.2)]'
                                            : item.style === 'stroke'
                                            ? 'text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.45)]'
                                            : 'text-white/90'
                                    }`}
                                >
                                    {item.text}
                                </span>
                                <span
                                    style={{
                                        backgroundColor: accentColor,
                                        boxShadow: `0 0 15px ${accentColor}`,
                                    }}
                                    className="w-3 sm:w-3.5 h-3 sm:h-3.5 rounded-full shrink-0 pointer-events-none [transform:translateZ(0)]"
                                />
                            </div>
                        ))}
                    </div>
                ))}
            </motion.div>
        </div>
    );
}

interface InvertLineProps {
    text: string;
}

function InvertLine({ text }: InvertLineProps) {
    const lineRef = useRef<HTMLSpanElement>(null);
    const { scrollYProgress } = useScroll({
        target: lineRef,
        offset: ['start 0.88', 'end 0.45'],
    });

    const backgroundPosition = useTransform(scrollYProgress, [0, 1], ['100% 0%', '0% 0%']);

    return (
        <span ref={lineRef} className="block w-full overflow-hidden py-1 sm:py-1.5 text-center">
            <motion.span
                style={{
                    backgroundImage: 'linear-gradient(to right, #ffffff 50%, #3f424e 50%)',
                    backgroundSize: '200% 100%',
                    backgroundPosition,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    color: 'transparent',
                    display: 'inline-block',
                    transform: 'translateZ(0)',
                }}
                className="will-change-[background-position] font-['Clash_Display',_'Syne',_'Outfit',_sans-serif] text-[clamp(14px,2.95vw,52px)] font-semibold tracking-tight leading-[1.26] whitespace-nowrap"
            >
                {text}
            </motion.span>
        </span>
    );
}

export function IntroBand() {
    const sectionRef = useRef<HTMLDivElement>(null);

    // Dynamic global scroll velocity tracking
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
        damping: 50,
        stiffness: 300,
    });
    const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 1.2], {
        clamp: true,
    });

    // Core CuttingEdger studio capabilities with visual hierarchy
    const marqueeRow1: MarqueeItem[] = [
        { text: 'HIGH-END RETOUCHING', style: 'highlight' },
        { text: '3D SPATIAL CGI', style: 'stroke' },
        { text: 'COMMERCIAL CUTOUTS', style: 'filled' },
        { text: 'COLOR MASTERING', style: 'highlight' },
        { text: 'LUXURY ASSETS', style: 'stroke' },
        { text: 'PRODUCT RENDERING', style: 'filled' },
    ];

    const marqueeRow2: MarqueeItem[] = [
        { text: 'SHADOW SCULPTING', style: 'stroke' },
        { text: 'CREATIVE DIRECTION', style: 'highlight' },
        { text: 'E-COMMERCE SCALE', style: 'filled' },
        { text: 'POST-PRODUCTION', style: 'stroke' },
        { text: 'TEXTURE COMPOSITING', style: 'highlight' },
        { text: 'DYNAMIC LIGHTING', style: 'filled' },
    ];

    const manifestoLines = [
        'With over a decade of excellence in high-end visual production,',
        'CuttingEdger delivers flawless digital prep, precision retouching,',
        'and hyper-realistic 3D spatial CGI, empowering global luxury brands',
        'and leading creative agencies with uncompromising visual fidelity',
        'and industry-defining turnaround velocity.',
    ];

    return (
        <>
            {/* 1. DUAL VELOCITY KINETIC MARQUEE TRANSITION STRIP */}
            <section
                ref={sectionRef}
                className="relative py-12 sm:py-16 border-y border-white/10 bg-[#07080a] overflow-hidden select-none"
            >
                {/* Sub-label strip header */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-5 flex items-center justify-between text-[11px] font-mono uppercase tracking-widest text-neutral-500">
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#d4ff00] animate-pulse" />
                        <span>DUAL VELOCITY KINETIC STREAM</span>
                    </div>
                    <span className="hidden sm:inline-block text-neutral-600">
                        DRAG HORIZONTALLY • SCROLL TO ACCELERATE
                    </span>
                </div>

                {/* DUAL OPPOSING CONTINUOUS VELOCITY MARQUEES */}
                <div className="space-y-3 sm:space-y-4 overflow-hidden">
                    {/* Strip 1: Continuous Drift Left, Accelerates with Scroll, Draggable */}
                    <KineticMarqueeRow
                        items={marqueeRow1}
                        baseSpeed={-0.6}
                        accentColor="#d4ff00"
                        bgClass="bg-black/40 border-y border-white/5"
                        velocityFactor={velocityFactor}
                    />

                    {/* Strip 2: Continuous Drift Right, Accelerates with Scroll, Draggable */}
                    <KineticMarqueeRow
                        items={marqueeRow2}
                        baseSpeed={0.6}
                        accentColor="#00f5ff"
                        bgClass="bg-black/60 border-b border-white/5"
                        velocityFactor={velocityFactor}
                    />
                </div>
            </section>

            {/* 2. DEDICATED FULL-SCREEN STUDIO MANIFESTO STATEMENT */}
            <section className="relative min-h-[85vh] lg:min-h-screen py-24 sm:py-32 lg:py-36 flex flex-col justify-center items-center border-b border-white/10 bg-[#090a0d] overflow-hidden select-none">
                {/* Ambient Backlight Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[65rem] h-[36rem] bg-[#d4ff00]/6 rounded-full blur-[220px] pointer-events-none" />

                <div className="w-full max-w-[96%] xl:max-w-[1560px] mx-auto px-4 sm:px-6 text-center space-y-10 sm:space-y-14 relative z-10">
                    {/* 5 Equal-width lines that scrub smoothly with scroll */}
                    <div className="flex flex-col items-center w-full space-y-2 sm:space-y-3">
                        {manifestoLines.map((line, index) => (
                            <InvertLine key={index} text={line} />
                        ))}
                    </div>

                    {/* Modern Studio CTA Button */}
                    <div className="pt-2 flex justify-center">
                        <Link
                            href="/about"
                            className="inline-flex items-center gap-2.5 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full border border-white/20 bg-white/5 hover:bg-[#d4ff00] hover:text-black hover:border-[#d4ff00] text-xs sm:text-sm font-['General_Sans',_'Outfit',_sans-serif] uppercase font-bold tracking-widest text-[#f9f4e8] transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)] group cursor-pointer"
                        >
                            <span>Discover Our Studio</span>
                            <ArrowUpRight className="w-4 h-4 text-[#d4ff00] group-hover:text-black transition-colors" />
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
