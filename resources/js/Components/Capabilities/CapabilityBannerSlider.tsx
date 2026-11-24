import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Capability } from '@/types/models';
import { CapabilityBannerSlide, CapabilityVisualProfile } from './capabilityVisualConfig';

interface CapabilityBannerSliderProps {
    capability: Capability;
    parent: Capability | null;
    profile: CapabilityVisualProfile;
    quoteHref?: string;
}

const SLIDE_DURATION = 5500; // 5.5s per slide

const slideVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? '100%' : '-100%',
        opacity: 0,
        scale: 1.05,
    }),
    center: {
        x: '0%',
        opacity: 1,
        scale: 1,
        transition: {
            x: { type: 'spring' as const, stiffness: 220, damping: 28 },
            opacity: { duration: 0.5, ease: 'easeOut' as const },
            scale: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
        },
    },
    exit: (direction: number) => ({
        x: direction > 0 ? '-100%' : '100%',
        opacity: 0,
        scale: 0.98,
        transition: {
            x: { type: 'spring' as const, stiffness: 220, damping: 28 },
            opacity: { duration: 0.35, ease: 'easeIn' as const },
        },
    }),
};

/**
 * Premium Edge-to-Edge Cinematic Banner Carousel.
 *
 * Features:
 * - Fluid physics-based directional sliding with Framer Motion spring curves
 * - Cinematic Ken Burns subtle motion depth
 * - Apple-style segmented progress timer bar
 * - Touch & drag gesture flick support
 * - Frosted-glass luxury edge arrows with magnetic hover states
 */
export function CapabilityBannerSlider({
    capability,
    parent,
    profile,
}: CapabilityBannerSliderProps) {
    const slides: CapabilityBannerSlide[] = profile.banners && profile.banners.length > 0
        ? profile.banners
        : profile.samples.map((sample) => ({
            id: sample.id,
            tag: sample.tag,
            title: sample.title,
            subtitle: sample.subtitle,
            beforeImage: sample.beforeImage,
            afterImage: sample.afterImage,
            beforeLabel: sample.beforeLabel,
            afterLabel: sample.afterLabel,
        }));

    const [page, setPage] = useState(0);
    const [direction, setDirection] = useState(1);
    const [isPaused, setIsPaused] = useState(false);

    const total = slides.length;
    const currentIndex = ((page % total) + total) % total;

    const paginate = (newDirection: number) => {
        setDirection(newDirection);
        setPage((prev) => prev + newDirection);
    };

    // Auto-advance timer
    useEffect(() => {
        if (total <= 1 || isPaused) return;

        const timer = setTimeout(() => {
            paginate(1);
        }, SLIDE_DURATION);

        return () => clearTimeout(timer);
    }, [page, isPaused, total]);

    if (total === 0) return null;

    const currentSlide = slides[currentIndex];

    return (
        <div
            className="group/carousel relative w-full overflow-hidden bg-neutral-950 select-none"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            aria-roledescription="carousel"
            aria-label={`${capability.title} banner showcase`}
        >
            {/* Viewport with cinema aspect ratio */}
            <div className="relative aspect-[16/7] w-full min-h-[240px] sm:aspect-[21/8] sm:min-h-[340px] md:aspect-[2.8/1] md:min-h-[420px] lg:max-h-[500px] overflow-hidden">
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={page}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.8}
                        onDragEnd={(_e, { offset, velocity }) => {
                            const swipe = Math.abs(offset.x) * velocity.x;
                            if (swipe < -10000 || offset.x < -60) {
                                paginate(1);
                            } else if (swipe > 10000 || offset.x > 60) {
                                paginate(-1);
                            }
                        }}
                        className="absolute inset-0 h-full w-full cursor-grab active:cursor-grabbing"
                    >
                        {currentSlide.bannerImage ? (
                            /* Full-Bleed Graphic Banner with Subtle Ken-Burns Breathing */
                            <div className="relative h-full w-full overflow-hidden bg-neutral-900">
                                <motion.img
                                    src={currentSlide.bannerImage}
                                    alt={currentSlide.title || capability.title}
                                    className="h-full w-full object-cover object-center pointer-events-none"
                                    initial={{ scale: 1.03 }}
                                    animate={{ scale: 1.0 }}
                                    transition={{ duration: 5.5, ease: 'linear' }}
                                    loading="eager"
                                />
                                {/* Bottom soft edge vignette */}
                                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/25 to-transparent pointer-events-none" />
                            </div>
                        ) : (
                            /* Clean Luxury Studio Slide */
                            <div className="relative flex h-full w-full items-center justify-between overflow-hidden bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 px-8 sm:px-16 lg:px-24">
                                <div className="max-w-xl z-10 text-white">
                                    <span className="mb-2.5 inline-block rounded-full bg-primary/25 border border-primary/40 px-3 py-1 text-2xs font-bold uppercase tracking-[0.18em] text-primary-foreground backdrop-blur-md">
                                        {parent?.title ?? 'Studio Service'}
                                    </span>
                                    <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-white sm:text-3xl md:text-4xl lg:text-5xl uppercase drop-shadow-sm">
                                        {currentSlide.title}
                                    </h2>
                                    <p className="mt-2.5 line-clamp-2 text-xs sm:text-sm text-neutral-300 max-w-lg leading-relaxed">
                                        {currentSlide.subtitle}
                                    </p>
                                </div>

                                <div className="hidden sm:block h-[82%] aspect-[4/3] overflow-hidden rounded-xl border border-white/10 bg-black/40 shadow-2xl backdrop-blur-xs">
                                    <motion.img
                                        src={currentSlide.afterImage || profile.coverImage}
                                        alt={currentSlide.title}
                                        className="h-full w-full object-cover"
                                        initial={{ scale: 1.05 }}
                                        animate={{ scale: 1.0 }}
                                        transition={{ duration: 5.5, ease: 'linear' }}
                                    />
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Premium Frosted Floating Arrows */}
            {total > 1 && (
                <>
                    <button
                        type="button"
                        onClick={() => paginate(-1)}
                        aria-label="Previous slide"
                        className="absolute left-3 sm:left-6 top-1/2 z-30 -translate-y-1/2 grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-md opacity-80 transition-all duration-300 hover:opacity-100 hover:scale-110 hover:bg-white hover:text-black hover:border-white shadow-[0_8px_24px_rgba(0,0,0,0.3)] cursor-pointer"
                    >
                        <ChevronLeft size={22} strokeWidth={2.5} />
                    </button>
                    <button
                        type="button"
                        onClick={() => paginate(1)}
                        aria-label="Next slide"
                        className="absolute right-3 sm:right-6 top-1/2 z-30 -translate-y-1/2 grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-md opacity-80 transition-all duration-300 hover:opacity-100 hover:scale-110 hover:bg-white hover:text-black hover:border-white shadow-[0_8px_24px_rgba(0,0,0,0.3)] cursor-pointer"
                    >
                        <ChevronRight size={22} strokeWidth={2.5} />
                    </button>
                </>
            )}
        </div>
    );
}
