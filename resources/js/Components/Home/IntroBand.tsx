import React, { useRef } from 'react';
import { Link } from '@inertiajs/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

interface InvertLineProps {
    text: string;
}

function InvertLine({ text }: InvertLineProps) {
    const lineRef = useRef<HTMLSpanElement>(null);
    const { scrollYProgress } = useScroll({
        target: lineRef,
        offset: ['start 0.92', 'end 0.48'],
    });

    const backgroundPosition = useTransform(scrollYProgress, [0, 1], ['100% 0%', '0% 0%']);

    return (
        <span ref={lineRef} className="block w-full overflow-hidden py-1 sm:py-1.5 text-center">
            <motion.span
                style={{
                    // Unrevealed base text opacity set to 48% (rgba(255,255,255,0.48)) so fast scrollers never miss core text
                    backgroundImage:
                        'linear-gradient(to right, #ffffff 50%, rgba(255, 255, 255, 0.48) 50%)',
                    backgroundSize: '200% 100%',
                    backgroundPosition,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    color: 'transparent',
                    display: 'inline-block',
                    transform: 'translateZ(0)',
                }}
                className="will-change-[background-position] font-display font-extrabold text-lg sm:text-2xl md:text-3xl lg:text-[clamp(22px,2.75vw,44px)] tracking-tight leading-snug sm:leading-[1.28] max-w-full px-2 sm:px-0"
            >
                {text}
            </motion.span>
        </span>
    );
}

export function IntroBand() {
    const manifestoLines = [
        'With over a decade of excellence in high-end visual production,',
        'CuttingEdger delivers flawless digital prep, precision retouching,',
        'and hyper-realistic 3D spatial CGI, empowering global luxury brands',
        'and leading creative agencies with uncompromising visual fidelity',
        'and industry-defining turnaround velocity.',
    ];

    return (
        <section
            id="intro-value-proposition"
            className="relative py-20 sm:py-28 lg:py-32 flex flex-col justify-center items-center bg-[#090a0d] overflow-hidden select-none"
        >
            {/* Ambient Backlight Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[30rem] bg-accent/[0.04] rounded-full blur-[200px] pointer-events-none" />

            <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 text-center space-y-8 sm:space-y-10 relative z-10">
                {/* 5 Lines with 48% minimum base opacity that illuminate to 100% white on scroll */}
                <div className="flex flex-col items-center w-full space-y-1.5 sm:space-y-2">
                    {manifestoLines.map((line, index) => (
                        <InvertLine key={index} text={line} />
                    ))}
                </div>

                {/* Centered Studio Pill CTA matching reference layout */}
                <div className="pt-2 flex justify-center">
                    <Link
                        href="/about"
                        className="inline-flex items-center gap-2 px-7 sm:px-8 py-3 sm:py-3.5 rounded-full border border-white/20 bg-white/[0.04] hover:bg-accent hover:text-black hover:border-accent text-xs font-mono uppercase font-bold tracking-widest text-neutral-200 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)] group cursor-pointer"
                    >
                        <span>Discover Our Studio</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-accent group-hover:text-black transition-colors" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
