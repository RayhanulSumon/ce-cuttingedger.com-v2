import React, { memo, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Client, Testimonial } from '@/types/models';
import { REVIEW_FALLBACK, ReviewEntry } from './content';
import { PAD_X, Reveal, SectionIntro, SectionProps } from './shared';

const FALLBACK_NAMES = ['Zara Studio', 'Northline', 'Aurelle', 'Maison Vell', 'Kōrin', 'Atelier 9', 'Oakhouse', 'Lumen & Co'];
const MIN_LANE_ITEMS = 6;
const FADE_MASK = '[mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]';

interface ClientsProps extends SectionProps {
    clients: Client[];
    testimonials: Testimonial[];
}

interface Logo {
    name: string;
    src?: string;
}

function fill<T>(items: T[], min: number): T[] {
    const out = [...items];
    while (out.length > 0 && out.length < min) {
        out.push(...items);
    }
    return out;
}

function LogoLane({
    logos,
    direction,
    speed,
}: {
    logos: Logo[];
    direction: 'down' | 'up';
    speed: number;
}) {
    return (
        <div className={`min-h-0 min-w-0 flex-1 overflow-hidden px-1 py-1 ${FADE_MASK}`}>
            <div
                className={`flex flex-col gap-3.5 pb-3.5 will-change-transform hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] ${
                    direction === 'down' ? 'landing-col-down' : 'landing-col-up'
                }`}
                style={{ ['--landing-col-speed' as string]: `${speed}s` }}
            >
                {[...logos, ...logos].map((logo, i) => (
                    <div
                        key={`${logo.name}-${i}`}
                        aria-hidden={i >= logos.length}
                        className="flex h-24 w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-ink/8 bg-white p-1.5 transition-[border-color,box-shadow] duration-300 hover:border-ink/20 hover:shadow-[0_14px_28px_-20px_color-mix(in_srgb,var(--color-ink)_35%,transparent)] sm:h-28"
                    >
                        {logo.src ? (
                            <img
                                src={logo.src}
                                alt={logo.name}
                                loading="lazy"
                                decoding="async"
                                className="h-full w-full scale-110 object-contain mix-blend-multiply"
                            />
                        ) : (
                            <span className="text-center text-base font-extrabold tracking-tight text-ink/75 sm:text-lg">
                                {logo.name}
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function ReviewCard({ quote, name, role, rating }: ReviewEntry & { rating?: number }) {
    return (
        <figure className="flex h-full flex-col justify-between rounded-3xl border border-ink/10 bg-white p-6 shadow-[0_14px_34px_-26px_color-mix(in_srgb,var(--color-ink)_35%,transparent)]">
            <div>
                <div className="flex gap-0.5 text-primary" aria-label={`${rating ?? 5} out of 5 stars`}>
                    {Array.from({ length: rating ?? 5 }, (_, i) => (
                        <Star key={i} size={14} fill="currentColor" />
                    ))}
                </div>
                <blockquote className="mt-3 text-sm leading-relaxed text-[#2a2d33] sm:text-[15px]">&ldquo;{quote}&rdquo;</blockquote>
            </div>
            <figcaption className="mt-4 border-t border-ink/8 pt-3.5 text-sm">
                <span className="font-bold text-ink">{name}</span>
                {role && <span className="text-subtle"> · {role}</span>}
            </figcaption>
        </figure>
    );
}

export const ClientsSection = memo(function ClientsSection({ active, clients, testimonials }: ClientsProps) {
    const [reviewIndex, setReviewIndex] = useState(0);
    const [reviewPaused, setReviewPaused] = useState(false);

    const allLogos: Logo[] = clients.length
        ? clients.map((c) => ({ name: c.name, src: c.logo_light || c.logo_dark }))
        : FALLBACK_NAMES.map((name) => ({ name }));

    const third = Math.ceil(allLogos.length / 3);
    const laneOne = fill(allLogos.slice(0, third), MIN_LANE_ITEMS);
    const laneTwo = fill(allLogos.slice(third, third * 2).length ? allLogos.slice(third, third * 2) : allLogos, MIN_LANE_ITEMS);
    const laneThree = fill(allLogos.slice(third * 2).length ? allLogos.slice(third * 2) : allLogos, MIN_LANE_ITEMS);

    const reviews: (ReviewEntry & { rating?: number })[] = testimonials.length
        ? testimonials.map((t) => ({
              quote: t.quote,
              name: t.client_name,
              role: [t.client_role, t.client_company].filter(Boolean).join(', '),
              rating: t.rating,
          }))
        : REVIEW_FALLBACK;

    const safeIndex = reviewIndex % reviews.length;
    const stepReview = (delta: number) => {
        setReviewIndex((current) => (current + delta + reviews.length) % reviews.length);
    };

    useEffect(() => {
        if (!active || reviewPaused || reviews.length <= 1) {
            return;
        }
        const timer = window.setInterval(() => {
            setReviewIndex((current) => (current + 1) % reviews.length);
        }, 4500);
        return () => window.clearInterval(timer);
    }, [active, reviewPaused, reviews.length]);

    return (
        <div className="relative grid h-full w-full grid-rows-[auto_1fr] overflow-hidden bg-page md:grid-cols-[1fr_minmax(320px,46%)] md:grid-rows-1">
            {/* Left column: big heading, description, and testimonial slider */}
            <div className={`relative z-10 flex flex-col justify-center pb-4 pt-14 sm:pt-20 md:py-8 ${PAD_X}`}>
                <SectionIntro
                    active={active}
                    title="Clients & Testimonials"
                    titleClassName="text-[clamp(28px,3.6vw,52px)] font-bold"
                    bodyClassName="text-base font-semibold text-ink-2 sm:text-lg"
                >
                    Trusted by global fashion, footwear and jewelry brands shipping at scale.
                </SectionIntro>

                <Reveal active={active} delay={0.22} className="mt-6 max-w-xl md:mt-8">
                    <div
                        onMouseEnter={() => setReviewPaused(true)}
                        onMouseLeave={() => setReviewPaused(false)}
                        onFocus={() => setReviewPaused(true)}
                        onBlur={() => setReviewPaused(false)}
                    >
                        {/* All reviews share one grid cell so the container height locks to the tallest review (zero layout shift). */}
                        <div className="grid">
                            {reviews.map((review, i) => {
                                const isCurrent = i === safeIndex;
                                return (
                                    <div
                                        key={`${review.name}-${i}`}
                                        aria-hidden={!isCurrent}
                                        className={`col-start-1 row-start-1 transition-opacity duration-300 ${
                                            isCurrent ? 'opacity-100' : 'pointer-events-none opacity-0'
                                        }`}
                                    >
                                        <ReviewCard {...review} />
                                    </div>
                                );
                            })}
                        </div>

                    {reviews.length > 1 && (
                        <div className="mt-3.5 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-1.5" role="tablist" aria-label="Testimonials">
                                {reviews.map((_, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        role="tab"
                                        aria-selected={i === safeIndex}
                                        aria-label={`Testimonial ${i + 1}`}
                                        onClick={() => setReviewIndex(i)}
                                        className={`h-1.5 rounded-full transition-all duration-300 ${
                                            i === safeIndex ? 'w-6 bg-primary' : 'w-1.5 bg-ink/20 hover:bg-ink/40'
                                        }`}
                                    />
                                ))}
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => stepReview(-1)}
                                    aria-label="Previous testimonial"
                                    className="grid h-9 w-9 place-items-center rounded-full border border-ink/15 bg-white text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => stepReview(1)}
                                    aria-label="Next testimonial"
                                    className="grid h-9 w-9 place-items-center rounded-full border border-ink/15 bg-white text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                    </div>
                </Reveal>
            </div>

            {/* Right column: compact vertical scrolling logo lanes, matching ShowcaseSection */}
            <Reveal
                active={active}
                delay={0.12}
                x="48px"
                y="0px"
                className="relative h-72 min-h-0 overflow-hidden pb-6 pr-5 pt-2 sm:pr-10 md:h-full md:pb-8 md:pr-14 md:pt-24 lg:pr-20"
            >
                <div className="flex h-full gap-3 pl-5 sm:pl-10 md:pl-0">
                    <LogoLane logos={laneOne} direction="down" speed={38} />
                    <LogoLane logos={laneTwo} direction="up" speed={32} />
                    <div className="hidden min-w-0 flex-1 sm:flex">
                        <LogoLane logos={laneThree} direction="down" speed={35} />
                    </div>
                </div>
            </Reveal>
        </div>
    );
});
