import React, { useRef } from 'react';
import { Link } from '@inertiajs/react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface InvertLineProps {
    text: string;
}

function InvertLine({ text }: InvertLineProps) {
    const lineRef = useRef<HTMLSpanElement>(null);
    const { scrollYProgress } = useScroll({
        target: lineRef,
        offset: ['start 0.88', 'end 0.45'],
    });

    // Exact Agntix GSAP .tp_text_invert_3 behavior:
    // Background gradient is 200% width: Left half = #f9f4e8 (cream-white), Right half = #383C3E (muted dark gray)
    // Directly bound to scrollYProgress (smoothed by Lenis globally) for instant, 120fps fluid scrubbing with zero spring lag!
    const backgroundPosition = useTransform(scrollYProgress, [0, 1], ['100% 0%', '0% 0%']);

    return (
        <span ref={lineRef} className="block w-full overflow-hidden py-0.5 sm:py-1 text-center">
            <motion.span
                style={{
                    backgroundImage: 'linear-gradient(to right, #f9f4e8 50%, #383c3e 50%)',
                    backgroundSize: '200% 100%',
                    backgroundPosition,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    color: 'transparent',
                    display: 'inline-block',
                    transform: 'translateZ(0)',
                }}
                className="will-change-[background-position] font-['MangoGrotesque',_'Antonio',_'Roboto_Condensed',_sans-serif] text-[20px] xs:text-[24px] sm:text-[34px] md:text-[46px] lg:text-[58px] xl:text-[68px] font-normal tracking-[0.5px] sm:tracking-[1px] leading-[1.08] sm:leading-[1.12] whitespace-nowrap"
            >
                {text}
            </motion.span>
        </span>
    );
}

export function IntroBand() {
    const sectionRef = useRef<HTMLDivElement>(null);

    // Scroll progress for dual opposing marquees (direct 1:1 binding, zero sluggish lag)
    const { scrollYProgress: marqueeScroll } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start'],
    });

    const xTop = useTransform(marqueeScroll, [0, 1], ['0%', '-30%']);
    const xBottom = useTransform(marqueeScroll, [0, 1], ['-30%', '0%']);

    // Exact Agntix Design Studio marquee copy
    const marqueeRow1 = [
        'Digital Experience',
        'Online Interaction',
        'Virtual Engagement',
        'Digital Experience',
        'Online Interaction',
    ];

    const marqueeRow2 = [
        'Virtual Engagement',
        'Digital Experience',
        'Online Interaction',
        'Virtual Engagement',
        'Digital Experience',
    ];

    // Exact 5-line typography matching Agntix Design Studio reference screenshot
    const manifestoLines = [
        'With over 10 years of experience as a versatile Front-End and',
        'Full-Stack Developer, I excel in crafting a wide range of solutions,',
        'from dynamic web applications and interactive configurators to',
        'robust backend automation software, ensuring innovative and',
        'effective outcomes for any project.',
    ];

    return (
        <section
            ref={sectionRef}
            className="relative pt-24 sm:pt-28 pb-32 sm:pb-40 border-y border-white/10 bg-[#090a0d] overflow-hidden select-none"
        >
            {/* Ambient Backlight */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[30rem] bg-[#d4ff00]/5 rounded-full blur-[180px] pointer-events-none" />

            {/* DUAL OPPOSING SCROLL-LINKED MARQUEES (.des-text-moving-area) */}
            <div className="space-y-4 pb-20 sm:pb-28 overflow-hidden">
                {/* Strip 1: Moves Left on Scroll */}
                <div className="py-3 bg-black/40 border-y border-white/5 overflow-hidden">
                    <motion.div
                        style={{ x: xTop }}
                        className="flex items-center gap-10 whitespace-nowrap will-change-transform"
                    >
                        {[...marqueeRow1, ...marqueeRow1, ...marqueeRow1].map((item, idx) => (
                            <div key={`r1-${idx}`} className="flex items-center gap-10">
                                <span className="font-['Antonio',_'Bebas_Neue',_'Syne',_sans-serif] uppercase font-bold text-5xl sm:text-7xl md:text-8xl lg:text-[100px] text-neutral-300 tracking-tight leading-none hover:text-[#d4ff00] transition-colors">
                                    {item}
                                </span>
                                <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#d4ff00] shadow-[0_0_15px_rgba(212,255,0,0.8)] shrink-0" />
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Strip 2: Moves Right on Scroll */}
                <div className="py-3 bg-black/60 border-b border-white/5 overflow-hidden">
                    <motion.div
                        style={{ x: xBottom }}
                        className="flex items-center gap-10 whitespace-nowrap will-change-transform"
                    >
                        {[...marqueeRow2, ...marqueeRow2, ...marqueeRow2].map((item, idx) => (
                            <div key={`r2-${idx}`} className="flex items-center gap-10">
                                <span className="font-['Antonio',_'Bebas_Neue',_'Syne',_sans-serif] uppercase font-bold text-5xl sm:text-7xl md:text-8xl lg:text-[100px] text-neutral-400 hover:text-white transition-colors tracking-tight leading-none">
                                    {item}
                                </span>
                                <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#ff5e36] shadow-[0_0_15px_rgba(255,94,54,0.8)] shrink-0" />
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* CENTERED ABOUT MANIFESTO STATEMENT (5 BALANCED LINES MATCHING REFERENCE) */}
            <div className="max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 text-center space-y-8 sm:space-y-10">
                {/* 5 Equal-width lines that span edge-to-edge */}
                <div className="flex flex-col items-center w-full space-y-0 sm:space-y-0.5">
                    {manifestoLines.map((line, index) => (
                        <InvertLine key={index} text={line} />
                    ))}
                </div>

                {/* Exact rectangular button matching reference screenshot (.tp-btn-border) */}
                <div className="pt-4 flex justify-center">
                    <Link
                        href="/about"
                        className="inline-block px-8 py-2.5 rounded-[6px] border border-white/20 bg-neutral-950/80 hover:bg-[#f9f4e8] hover:text-black hover:border-[#f9f4e8] text-base sm:text-lg font-['MangoGrotesque',_'Antonio',_'Roboto_Condensed',_sans-serif] tracking-wider text-[#f9f4e8] transition-all duration-300 shadow-sm"
                    >
                        More About Us
                    </Link>
                </div>
            </div>
        </section>
    );
}
