import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Capability } from '@/types/models';
import { CapabilityBannerSlide, CapabilityVisualProfile } from './capabilityVisualConfig';

interface CapabilityBannerSliderProps {
    capability: Capability;
    parent: Capability | null;
    profile: CapabilityVisualProfile;
    quoteHref?: string;
}

/**
 * Direct Full-Width Hero Slider Banner for Sub-Capability single pages.
 * Spans 100% edge-to-edge (no side margins, no rounded corners), matching the classic CuttingEdger main site.
 */
export function CapabilityBannerSlider({
    capability,
    parent,
    profile,
}: CapabilityBannerSliderProps) {
    // Collect slides: prefer profile.banners if available, otherwise generate from profile.samples
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

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const total = slides.length;

    const goTo = (index: number) => {
        setCurrentIndex((index + total) % total);
    };

    const next = () => goTo(currentIndex + 1);
    const prev = () => goTo(currentIndex - 1);

    // Auto-advance every 5.5 seconds unless paused
    useEffect(() => {
        if (total <= 1 || isPaused) return;

        timerRef.current = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % total);
        }, 5500);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [currentIndex, isPaused, total]);

    if (total === 0) return null;

    return (
        <div
            className="group/slider relative w-full overflow-hidden bg-surface-2"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            aria-roledescription="carousel"
            aria-label={`${capability.title} banner slider`}
        >
            {/* Viewport: Full Width with 21:9 to 16:9 responsive aspect ratio */}
            <div className="relative aspect-[16/7] w-full min-h-[220px] sm:aspect-[21/8] sm:min-h-[320px] md:aspect-[2.7/1] md:min-h-[380px] lg:max-h-[480px]">
                {slides.map((slide, idx) => {
                    const isActive = idx === currentIndex;

                    return (
                        <div
                            key={slide.id}
                            className={`absolute inset-0 transition-opacity duration-600 ease-in-out ${
                                isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
                            }`}
                            aria-hidden={!isActive}
                        >
                            {slide.bannerImage ? (
                                /* Full-Bleed Graphic Banner */
                                <div className="h-full w-full bg-surface-2">
                                    <img
                                        src={slide.bannerImage}
                                        alt={slide.title || capability.title}
                                        className="h-full w-full object-cover object-center select-none"
                                        loading={idx === 0 ? 'eager' : 'lazy'}
                                    />
                                </div>
                            ) : (
                                /* Clean Wide Panoramic Studio Slide */
                                <div className="relative flex h-full w-full items-center justify-between overflow-hidden bg-gradient-to-r from-surface via-surface-2 to-surface px-8 sm:px-16 lg:px-24">
                                    <div className="max-w-xl z-10">
                                        <span className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-2xs font-bold uppercase tracking-[0.16em] text-primary">
                                            {parent?.title ?? 'Specialized Service'}
                                        </span>
                                        <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-ink sm:text-3xl md:text-4xl lg:text-5xl uppercase">
                                            {slide.title}
                                        </h2>
                                        <p className="mt-2 line-clamp-2 text-xs sm:text-sm text-subtle max-w-lg">
                                            {slide.subtitle}
                                        </p>
                                    </div>

                                    <div className="hidden sm:block h-[80%] aspect-[4/3] overflow-hidden rounded-xl border border-ink/10 bg-white shadow-md">
                                        <img
                                            src={slide.afterImage || profile.coverImage}
                                            alt={slide.title}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Slider Navigation: Clean Left & Right Edge Arrows */}
            {total > 1 && (
                <>
                    <button
                        type="button"
                        onClick={prev}
                        aria-label="Previous slide"
                        className="absolute left-2 sm:left-4 top-1/2 z-20 -translate-y-1/2 grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-full bg-black/35 text-white backdrop-blur-xs transition-all hover:bg-black/70 hover:scale-105 cursor-pointer"
                    >
                        <ChevronLeft size={24} strokeWidth={2.5} />
                    </button>
                    <button
                        type="button"
                        onClick={next}
                        aria-label="Next slide"
                        className="absolute right-2 sm:right-4 top-1/2 z-20 -translate-y-1/2 grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-full bg-black/35 text-white backdrop-blur-xs transition-all hover:bg-black/70 hover:scale-105 cursor-pointer"
                    >
                        <ChevronRight size={24} strokeWidth={2.5} />
                    </button>

                    {/* Indicator Dots */}
                    <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/40 px-3 py-1 backdrop-blur-xs">
                        {slides.map((s, idx) => (
                            <button
                                key={s.id}
                                type="button"
                                onClick={() => goTo(idx)}
                                aria-label={`Go to slide ${idx + 1}`}
                                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                                    idx === currentIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'
                                }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
