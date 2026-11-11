import React from 'react';
import { motion } from 'framer-motion';
import { PillButton, Reveal, SectionProps, SECTION_INDEX } from './shared';

const VIDEO_SRC = 'https://www.cuttingedger.com/videos/video_thumbnail.webm';
const VIDEO_POSTER =
    'https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/726b168c-da47-4682-a255-cc3e02f89bae.jpg';

export function HeroSection({ active, goTo, openDemo }: SectionProps) {
    return (
        <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#f2f2f1]">
            <svg
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 h-full w-full"
                viewBox="0 0 1600 1000"
                preserveAspectRatio="none"
            >
                {[0, 1, 2, 3, 4, 5, 6, 7].map((n) => (
                    <path
                        key={n}
                        d={`M${-100 - n * 20},${900 - n * 40} C300,${850 - n * 30} 600,${400 - n * 20} 1700,${100 - n * 30}`}
                        stroke="#fff"
                        strokeWidth={1.5 + (n % 4)}
                        opacity={0.55 + (n % 3) * 0.12}
                        fill="none"
                    />
                ))}
            </svg>

            <h1
                className="relative z-10 flex items-center justify-center whitespace-nowrap font-extrabold leading-[0.8] tracking-[-0.045em] text-[#1d1d1d]"
                style={{ fontSize: 'min(19.6vh, 13.2vw)' }}
                aria-label="Cutting Edger"
            >
                <motion.span
                    initial={false}
                    animate={active ? { x: 0, opacity: 1 } : { x: '8%', opacity: 0 }}
                    transition={{ duration: 1.1, ease: [0.4, 0, 0.2, 1], delay: active ? 0.2 : 0 }}
                    className="hidden sm:inline-block"
                >
                    CUTTING
                </motion.span>
                <motion.span
                    initial={false}
                    animate={
                        active
                            ? { width: '3.62em', opacity: 1, marginInline: '0.085em' }
                            : { width: '0.012em', opacity: 0, marginInline: '0.03em' }
                    }
                    transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1], delay: active ? 0.3 : 0 }}
                    className="relative hidden h-[1.81em] shrink-0 overflow-hidden rounded-full bg-[#d8d3cf] sm:block"
                >
                    <video
                        className="absolute left-1/2 top-0 h-full min-w-full -translate-x-1/2 object-cover"
                        src={VIDEO_SRC}
                        poster={VIDEO_POSTER}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                    />
                </motion.span>
                <motion.span
                    initial={false}
                    animate={active ? { x: 0, opacity: 1 } : { x: '-8%', opacity: 0 }}
                    transition={{ duration: 1.1, ease: [0.4, 0, 0.2, 1], delay: active ? 0.2 : 0 }}
                    className="hidden sm:inline-block"
                >
                    EDGER
                </motion.span>

                <span className="flex flex-col items-center gap-3 sm:hidden" style={{ fontSize: '0.8em' }}>
                    <span>CUTTING</span>
                    <span className="block h-[1.2em] w-[70vw] overflow-hidden rounded-3xl bg-[#d8d3cf]">
                        <video
                            className="h-full w-full object-cover"
                            src={VIDEO_SRC}
                            poster={VIDEO_POSTER}
                            autoPlay
                            muted
                            loop
                            playsInline
                        />
                    </span>
                    <span>EDGER</span>
                </span>
            </h1>

            <Reveal active={active} delay={0.9} className="relative z-10 mt-10 max-w-xl px-6 text-center">
                <p className="text-sm leading-relaxed text-[#3a3a3a] sm:text-base">
                    Transform your apparel and product photography with next-generation AI-integrated image editing and
                    expert post-production. Save time, reduce production costs, and scale your visual content without
                    compromising quality.
                </p>
                <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                    <PillButton onClick={openDemo}>Book a Demo</PillButton>
                    <PillButton dark={false} onClick={() => goTo(SECTION_INDEX['digital-twins'])}>
                        Explore capabilities
                    </PillButton>
                </div>
            </Reveal>

            <Reveal active={active} delay={1.2} className="absolute bottom-6 z-10 text-[11px] uppercase tracking-[0.3em] text-[#3a3a3a]/60">
                Scroll to explore
            </Reveal>
        </div>
    );
}

