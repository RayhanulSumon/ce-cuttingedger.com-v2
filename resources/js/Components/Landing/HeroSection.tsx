import React, { useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { PAD_X, PillButton, Reveal, SectionProps, SECTION_INDEX } from './shared';

const VIDEO_SRC = 'https://www.cuttingedger.com/videos/video_thumbnail.webm';
const VIDEO_POSTER =
    'https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/726b168c-da47-4682-a255-cc3e02f89bae.jpg';

const PILL_EM = 3.1;
const GAP_EM = 0.14;
const EASE = [0.4, 0, 0.2, 1] as const;

function BannerVideo() {
    return (
        <video
            className="absolute inset-0 h-full w-full object-cover"
            src={VIDEO_SRC}
            poster={VIDEO_POSTER}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
        />
    );
}


/**
 * Largest font size (px) at which the measured words plus `extraEm` of fixed-em items
 * fill the container width, capped by `maxPx`. Re-fits on resize and once fonts load.
 */
function useFitFontSize(
    container: React.RefObject<HTMLElement | null>,
    words: React.RefObject<HTMLElement | null>[],
    extraEm: number,
    maxPx: () => number,
): number | null {
    const [size, setSize] = useState<number | null>(null);

    useLayoutEffect(() => {
        const fit = () => {
            const box = container.current;
            if (!box) {
                return;
            }
            const current = parseFloat(getComputedStyle(box).fontSize);
            const wordsPx = words.reduce((sum, ref) => sum + (ref.current?.offsetWidth ?? 0), 0);
            if (!current || !wordsPx) {
                return;
            }
            const totalEm = wordsPx / current + extraEm;
            const available = (box.parentElement ?? box).clientWidth;
            setSize(Math.min((available / totalEm) * 0.985, maxPx()));
        };

        fit();
        const observer = new ResizeObserver(fit);
        if (container.current?.parentElement) {
            observer.observe(container.current.parentElement);
        }
        document.fonts?.ready.then(fit);
        return () => observer.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return size;
}
export function HeroSection({ active, goTo, openDemo }: SectionProps) {
    const rowRef = useRef<HTMLSpanElement>(null);
    const cuttingRef = useRef<HTMLSpanElement>(null);
    const edgerRef = useRef<HTMLSpanElement>(null);
    const stackRef = useRef<HTMLSpanElement>(null);
    const stackWordRef = useRef<HTMLSpanElement>(null);

    // Desktop: CUTTING + banner(3.1em) + EDGER + two 0.14em gaps; phones: stacked CUTTING.
    const rowSize = useFitFontSize(rowRef, [cuttingRef, edgerRef], PILL_EM + GAP_EM * 2, () => window.innerHeight * 0.2);
    const stackSize = useFitFontSize(stackRef, [stackWordRef], 0, () => window.innerHeight * 0.14);

    return (
        <div className={`relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#f2f2f1] pb-10 pt-20 ${PAD_X}`}>
            <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1600 1000" preserveAspectRatio="none">
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

            <h1 className="relative z-10 w-full text-[#1d1d1d]" aria-label="Cutting Edger">
                {/* Tablet / desktop: CUTTING [banner] EDGER on one centred line */}
                <span
                    ref={rowRef}
                    className="hidden w-full items-center justify-center gap-[0.14em] whitespace-nowrap font-extrabold leading-none tracking-[-0.045em] sm:flex"
                    style={{ fontSize: rowSize ? `${rowSize}px` : 'min(15vh, 8vw)' }}
                    aria-hidden="true"
                >
                    <motion.span
                        ref={cuttingRef}
                        initial={false}
                        animate={active ? { x: 0, opacity: 1 } : { x: 24, opacity: 0 }}
                        transition={{ duration: 1.1, ease: EASE, delay: active ? 0.2 : 0 }}
                    >
                        CUTTING
                    </motion.span>
                    <motion.span
                        initial={false}
                        animate={active ? { width: `${PILL_EM}em`, opacity: 1 } : { width: '0.05em', opacity: 0 }}
                        transition={{ duration: 1.4, ease: EASE, delay: active ? 0.3 : 0 }}
                        className="relative block h-[1.55em] shrink-0 overflow-hidden rounded-[0.2em] bg-[#d8d3cf]"
                    >
                        <BannerVideo />
                    </motion.span>
                    <motion.span
                        ref={edgerRef}
                        initial={false}
                        animate={active ? { x: 0, opacity: 1 } : { x: -24, opacity: 0 }}
                        transition={{ duration: 1.1, ease: EASE, delay: active ? 0.2 : 0 }}
                    >
                        EDGER
                    </motion.span>
                </span>

                {/* Phones: stacked */}
                <span
                    ref={stackRef}
                    className="flex flex-col items-center gap-[0.12em] font-extrabold leading-none tracking-[-0.045em] sm:hidden"
                    style={{ fontSize: stackSize ? `${stackSize}px` : 'min(18vw, 12vh)' }}
                    aria-hidden="true"
                >
                    <span ref={stackWordRef}>CUTTING</span>
                    <motion.span
                        initial={false}
                        animate={active ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0.6 }}
                        transition={{ duration: 1.1, ease: EASE, delay: active ? 0.3 : 0 }}
                        className="relative block h-[1.3em] w-full overflow-hidden rounded-[0.2em] bg-[#d8d3cf]"
                    >
                        <BannerVideo />
                    </motion.span>
                    <span>EDGER</span>
                </span>
            </h1>

            <Reveal active={active} delay={0.9} className="relative z-10 mt-8 max-w-xl text-center sm:mt-10">
                <p className="text-sm leading-relaxed text-[#3a3a3a] sm:text-base">
                    Transform your apparel and product photography with next-generation AI-integrated image editing and
                    expert post-production. Save time, reduce production costs, and scale your visual content without
                    compromising quality.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    <PillButton onClick={openDemo}>Book a Demo</PillButton>
                    <PillButton dark={false} onClick={() => goTo(SECTION_INDEX['digital-twins'])}>
                        Explore capabilities
                    </PillButton>
                </div>
            </Reveal>

            <Reveal active={active} delay={1.2} className="absolute bottom-5 z-10 hidden text-[11px] uppercase tracking-[0.3em] text-[#3a3a3a]/60 sm:block">
                Scroll to explore
            </Reveal>
        </div>
    );
}
