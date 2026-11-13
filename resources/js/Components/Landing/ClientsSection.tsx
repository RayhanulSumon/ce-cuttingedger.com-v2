import React, { memo } from 'react';
import { Star } from 'lucide-react';
import { Client, Testimonial } from '@/types/models';
import { REVIEW_FALLBACK, ReviewEntry } from './content';
import { PAD_X, Reveal, SectionProps } from './shared';

const FALLBACK_NAMES = ['Zara Studio', 'Northline', 'Aurelle', 'Maison Vell', 'Kōrin', 'Atelier 9', 'Oakhouse', 'Lumen & Co', 'Veridian', 'Halcyon'];

/** A lane needs enough items that half of it (the loop length) is taller than the viewport. */
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

/** Repeats a list until it has at least `min` items. */
function fill<T>(items: T[], min: number): T[] {
    const out = [...items];
    while (out.length > 0 && out.length < min) {
        out.push(...items);
    }
    return out;
}

/** A vertically looping lane. Hovering a lane freezes only that lane. */
function Lane({
    direction,
    speed,
    className = '',
    children,
}: {
    direction: 'down' | 'up';
    speed: number;
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <div className={`min-h-0 min-w-0 flex-1 overflow-hidden ${FADE_MASK} ${className}`}>
            <div
                className={`flex flex-col gap-4 will-change-transform hover:[animation-play-state:paused] ${direction === 'down' ? 'landing-col-down' : 'landing-col-up'}`}
                style={{ ['--landing-col-speed' as string]: `${speed}s` }}
            >
                {children}
                <div aria-hidden="true" className="flex flex-col gap-4">
                    {children}
                </div>
            </div>
        </div>
    );
}

function LogoCard({ name, src }: Logo) {
    return (
        <div className="flex aspect-[5/3] w-full shrink-0 items-center justify-center rounded-3xl border border-[#1d1d1d]/10 bg-white p-6 transition-shadow duration-300 hover:shadow-[0_18px_34px_-22px_rgba(22,25,31,0.4)]">
            {src ? (
                <img src={src} alt={name} loading="lazy" decoding="async" className="max-h-full max-w-[88%] object-contain" />
            ) : (
                <span className="text-center text-2xl font-extrabold tracking-tight text-[#1d1d1d]/75 sm:text-3xl">{name}</span>
            )}
        </div>
    );
}

function ReviewCard({ quote, name, role, rating }: ReviewEntry & { rating?: number }) {
    return (
        <figure className="w-full shrink-0 rounded-3xl border border-[#1d1d1d]/10 bg-white p-6">
            <div className="flex gap-0.5 text-[#f5761a]" aria-label={`${rating ?? 5} out of 5 stars`}>
                {Array.from({ length: rating ?? 5 }, (_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                ))}
            </div>
            <blockquote className="mt-3 text-[15px] leading-relaxed text-[#2a2d33]">&ldquo;{quote}&rdquo;</blockquote>
            <figcaption className="mt-4 text-sm">
                <span className="font-bold text-[#16191f]">{name}</span>
                {role && <span className="text-[#5d6572]"> · {role}</span>}
            </figcaption>
        </figure>
    );
}

export const ClientsSection = memo(function ClientsSection({ active, clients, testimonials }: ClientsProps) {
    const logos: Logo[] = clients.length
        ? clients.map((c) => ({ name: c.name, src: c.logo_light || c.logo_dark }))
        : FALLBACK_NAMES.map((name) => ({ name }));
    const half = Math.ceil(logos.length / 2);
    const laneOne = fill(logos.slice(0, half), MIN_LANE_ITEMS);
    const laneTwo = fill(logos.slice(half).length ? logos.slice(half) : logos, MIN_LANE_ITEMS);

    const reviews: (ReviewEntry & { rating?: number })[] = testimonials.length
        ? testimonials.map((t) => ({
              quote: t.quote,
              name: t.client_name,
              role: [t.client_role, t.client_company].filter(Boolean).join(', '),
              rating: t.rating,
          }))
        : REVIEW_FALLBACK;
    const reviewList = fill(reviews, 3);

    return (
        <div className="grid h-full w-full grid-rows-[minmax(0,1fr)_minmax(0,1fr)] overflow-hidden bg-[#f2f2f1] md:grid-cols-2 md:grid-rows-1">
            <div className={`relative flex min-h-0 flex-col pb-4 pt-20 sm:pt-24 md:pb-8 ${PAD_X}`}>
                <Reveal active={active}>
                    <h2 className="max-w-xl text-[clamp(28px,4.2vw,60px)] font-extrabold leading-[0.98] tracking-[-0.03em] text-[#1d1d1d]">
                        Trusted by brands that ship at scale.
                    </h2>
                </Reveal>
                <Reveal active={active} delay={0.1}>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-[#2f333a] sm:text-base">
                        Fashion, footwear and jewelry teams rely on us for catalogs, campaigns and digital twins.
                    </p>
                </Reveal>
                <Reveal active={active} delay={0.2} className="mt-5 flex min-h-0 flex-1 flex-col">
                    <Lane direction="down" speed={44} className="flex-1">
                        {reviewList.map((review, i) => (
                            <ReviewCard key={i} {...review} />
                        ))}
                    </Lane>
                </Reveal>
            </div>

            <Reveal active={active} delay={0.12} x="40px" y="0px" className={`flex min-h-0 gap-4 pb-4 pr-5 pt-4 sm:pr-10 md:pb-8 md:pr-14 md:pt-24 lg:pr-16`}>
                <Lane direction="up" speed={36}>
                    {laneOne.map((logo, i) => (
                        <LogoCard key={logo.name + i} {...logo} />
                    ))}
                </Lane>
                <Lane direction="down" speed={42}>
                    {laneTwo.map((logo, i) => (
                        <LogoCard key={logo.name + i} {...logo} />
                    ))}
                </Lane>
            </Reveal>
        </div>
    );
});
