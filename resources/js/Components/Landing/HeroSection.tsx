import React, { memo, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useFitFontSize } from '@/hooks/useFitFontSize';
import { useInViewport } from '@/hooks/useInViewport';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { PAD_X, PillButton, Reveal, SectionProps, SECTION_INDEX } from './shared';

const VIDEO_SRC = 'https://www.cuttingedger.com/videos/video_thumbnail.webm';
const VIDEO_POSTER =
    'https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/726b168c-da47-4682-a255-cc3e02f89bae.jpg';

/** Width of the video pill and the gap either side of it, in em of the title font size. */
const PILL_EM = 3.1;
const GAP_EM = 0.14;
/** The words start touching at the centre line and are pushed apart as the pill opens. */
const WORD_OFFSET_EM = PILL_EM / 2;

/** Looping banner clip. Only decodes while the hero is on screen. */
function BannerVideo({ playing }: { playing: boolean }) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) {
            return;
        }
        if (playing) {
            video.play().catch(() => undefined);
        } else {
            video.pause();
        }
    }, [playing]);

    return (
        <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover object-center"
            src={VIDEO_SRC}
            poster={VIDEO_POSTER}
            muted
            loop
            playsInline
            preload="metadata"
        />
    );
}

const SLIDES = [
    '/images/portfolio/portfolio-1.webp',
    '/images/portfolio/portfolio-2.webp',
    '/images/portfolio/portfolio-3.webp',
    '/images/portfolio/portfolio-4.webp',
];
const SLIDE_INTERVAL_MS = 5000;

/** Cross-fading image slideshow behind the hero, held at low opacity under a paper veil so typography stays crisp. */
function BackgroundSlider({ playing }: { playing: boolean }) {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (!playing) {
            return;
        }
        const timer = window.setInterval(() => setCurrent((index) => (index + 1) % SLIDES.length), SLIDE_INTERVAL_MS);
        return () => window.clearInterval(timer);
    }, [playing]);

    return (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden opacity-30">
            {SLIDES.map((src, i) => (
                <img
                    key={src}
                    src={src}
                    alt=""
                    loading={i === 0 ? 'eager' : 'lazy'}
                    data-current={i === current}
                    decoding="async"
                    className="hero-slide absolute inset-0 h-full w-full object-cover"
                />
            ))}
            <div className="absolute inset-0 bg-page/35" />
        </div>
    );
}

const PILL_BASE = 'relative block shrink-0 overflow-hidden rounded-[0.2em] bg-surface-3 bg-cover bg-center';
const pillPoster = { backgroundImage: `url(${VIDEO_POSTER})` };

export const HeroSection = memo(function HeroSection({ active, goTo }: SectionProps) {
    const rootRef = useRef<HTMLDivElement>(null);
    const inView = useInViewport(rootRef);
    const playing = active && inView;
    const rowRef = useRef<HTMLSpanElement>(null);
    const cuttingRef = useRef<HTMLSpanElement>(null);
    const edgerRef = useRef<HTMLSpanElement>(null);
    const spacerRef = useRef<HTMLSpanElement>(null);
    const stackRef = useRef<HTMLSpanElement>(null);
    const stackWordRef = useRef<HTMLSpanElement>(null);
    const [mounted, setMounted] = useState(false);
    const isWide = useMediaQuery('(min-width: 640px)');

    // Desktop row: CUTTING + pill + EDGER + invisible spacer (= CUTTING − EDGER) + 2 gaps.
    // Effective word width is 2 × CUTTING, so CUTTING is measured twice.
    const rowSize = useFitFontSize(rowRef, [cuttingRef, cuttingRef], PILL_EM + GAP_EM * 2, () => window.innerHeight * 0.2);
    const stackSize = useFitFontSize(stackRef, [stackWordRef], 0, () => window.innerHeight * 0.14);

    // Spacer width = CUTTING − EDGER, so the pill sits on the exact centre of the viewport.
    useLayoutEffect(() => {
        const sync = () => {
            const cuttingWidth = cuttingRef.current?.getBoundingClientRect().width ?? 0;
            const edgerWidth = edgerRef.current?.getBoundingClientRect().width ?? 0;
            if (spacerRef.current) {
                spacerRef.current.style.width = `${Math.max(0, cuttingWidth - edgerWidth).toFixed(2)}px`;
            }
        };
        sync();
        document.fonts?.ready.then(sync);
        const observer = new ResizeObserver(sync);
        if (rowRef.current) {
            observer.observe(rowRef.current);
        }
        return () => observer.disconnect();
    }, [rowSize]);

    // Play the entrance on first load exactly as when scrolling back to the hero:
    // paint the hidden state first, then flip to shown on the next frame.
    useEffect(() => {
        let second = 0;
        const first = requestAnimationFrame(() => {
            second = requestAnimationFrame(() => setMounted(true));
        });
        return () => {
            cancelAnimationFrame(first);
            cancelAnimationFrame(second);
        };
    }, []);

    const show = active && mounted;

    return (
        <div ref={rootRef} className={`relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-page pb-10 pt-20 ${PAD_X}`}>
            <BackgroundSlider playing={playing} />

            <h1 className="hero-title relative z-10 w-full text-ink" aria-label="Cutting Edger">
                {/* Tablet / desktop: CUTTING [banner] EDGER on one centred line. */}
                <span
                    ref={rowRef}
                    className="hidden w-full items-center justify-center gap-[0.14em] whitespace-nowrap font-extrabold leading-none tracking-[-0.045em] sm:flex"
                    style={{ fontSize: rowSize ? `${rowSize}px` : 'min(15vh, 8vw)' }}
                    aria-hidden="true"
                >
                    <Reveal as="span" ref={cuttingRef} active={show} x={`${WORD_OFFSET_EM}em`} y="0px">
                        CUTTING
                    </Reveal>
                    <Reveal
                        as="span"
                        variant="clip"
                        active={show}
                        className={`${PILL_BASE} h-[1.55em]`}
                    >
                        <span className="block h-full" style={{ width: `${PILL_EM}em`, ...pillPoster }} />
                        {isWide === true && <BannerVideo playing={playing} />}
                    </Reveal>
                    <Reveal as="span" ref={edgerRef} active={show} x={`-${WORD_OFFSET_EM}em`} y="0px">
                        EDGER
                    </Reveal>
                    {/* Negative margin cancels the flex gap this extra item would add, which pushed the pill off-centre. */}
                    <span ref={spacerRef} aria-hidden="true" className="-ml-[0.14em] shrink-0" style={{ width: 0 }} />
                </span>

                {/* Phones: stacked */}
                <span
                    ref={stackRef}
                    className="flex flex-col items-center gap-[0.16em] font-extrabold leading-none tracking-[-0.045em] sm:hidden"
                    style={{ fontSize: stackSize ? `${stackSize}px` : 'min(18vw, 12vh)' }}
                    aria-hidden="true"
                >
                    <Reveal as="span" ref={stackWordRef} active={show} y="0.35em">
                        CUTTING
                    </Reveal>
                    <Reveal
                        as="span"
                        variant="clip"
                        active={show}
                        delay={0.1}
                        className={`${PILL_BASE} h-[2.2em] w-full`}
                    >
                        <span className="block h-full w-full" style={pillPoster} />
                        {isWide === false && <BannerVideo playing={playing} />}
                    </Reveal>
                    <Reveal as="span" active={show} y="-0.35em">
                        EDGER
                    </Reveal>
                </span>
            </h1>

            <Reveal active={show} delay={0.7} className="relative z-10 mt-8 max-w-xl text-center sm:mt-10">
                <p className="text-base font-medium leading-[1.65] text-ink-2 sm:text-lg lg:text-[19px]">
                    Photoreal AI models, virtual try-on, and senior retouching for apparel and product brands—built to scale catalogs without studio bottlenecks.
                </p>
            </Reveal>
            <Reveal active={show} delay={0.85} className="relative z-10 mt-6 flex flex-wrap items-center justify-center gap-3 transform-gpu">
                <PillButton href="/book-a-demo" variant="dark">Book a Demo</PillButton>
                <PillButton variant="outline" onClick={() => goTo(SECTION_INDEX['digital-twins'])}>
                    Explore Capabilities
                </PillButton>
            </Reveal>

            {/* Minimalist interactive scroll indicator icon (No text, click to scroll) */}
            <Reveal active={show} delay={1.1} className="absolute bottom-5 z-20">
                <button
                    type="button"
                    aria-label="Scroll to next section"
                    onClick={(e) => {
                        e.preventDefault();
                        goTo(SECTION_INDEX['digital-twins']);
                    }}
                    className="group flex flex-col items-center justify-center p-2 rounded-full cursor-pointer transition-all duration-300 hover:scale-110 focus:outline-none"
                >
                    <div className="flex h-8 w-5 items-start justify-center rounded-full border-[1.5px] border-ink/30 pt-1.5 transition-colors group-hover:border-primary shadow-xs">
                        <div className="h-1.5 w-1 animate-bounce rounded-full bg-ink/60 transition-colors group-hover:bg-primary" />
                    </div>
                </button>
            </Reveal>
        </div>
    );
});
