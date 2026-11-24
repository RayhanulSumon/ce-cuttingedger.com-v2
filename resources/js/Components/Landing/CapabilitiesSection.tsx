import React, { memo, useEffect, useRef } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { ArrowUpRight } from 'lucide-react';
import { CapabilityNavItem, PageProps } from '@/types';
import { OrderCta, PAD_X, PillButton, Reveal, SectionProps } from './shared';

const SLUG_IMAGES: Record<string, string> = {
    '2d': '/images/capabilities/fashion-editorial-after.webp',
    '3d': '/images/capabilities/cgi-chair-after.webp',
    dtp: '/images/capabilities/dtp-catalog-after.webp',
    video: '/images/capabilities/video-grade-after.webp',
};

const FALLBACK_IMAGES = [
    '/images/capabilities/fashion-editorial-after.webp',
    '/images/capabilities/cgi-chair-after.webp',
    '/images/capabilities/dtp-catalog-after.webp',
    '/images/capabilities/video-grade-after.webp',
] as const;

const CapabilityDepthCard = memo(function CapabilityDepthCard({
    capability,
    index,
}: {
    capability: CapabilityNavItem;
    index: number;
}) {
    const cardRef = useRef<HTMLAnchorElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const rectRef = useRef<DOMRect | null>(null);
    const rafRef = useRef(0);
    const pointerRef = useRef({ x: 0, y: 0 });
    const reducedMotionRef = useRef(false);

    useEffect(() => {
        reducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, []);

    const applyTilt = () => {
        rafRef.current = 0;
        const card = cardRef.current;
        const rect = rectRef.current;
        if (!card || !rect || rect.width <= 0 || rect.height <= 0) {
            return;
        }
        const px = pointerRef.current.x - rect.left;
        const py = pointerRef.current.y - rect.top;
        const nx = Math.max(-0.5, Math.min(0.5, px / rect.width - 0.5)) * 2;
        const ny = Math.max(-0.5, Math.min(0.5, py / rect.height - 0.5)) * 2;

        card.style.transform = `perspective(1000px) rotateX(${(-ny * 7.5).toFixed(2)}deg) rotateY(${(nx * 9.5).toFixed(2)}deg) translate3d(0, -6px, 0)`;

        if (imgRef.current) {
            imgRef.current.style.transform = `translate3d(${(-nx * 16).toFixed(1)}px, ${(-ny * 14).toFixed(1)}px, 0) scale(1.11)`;
        }
        if (contentRef.current) {
            contentRef.current.style.transform = `translate3d(${(nx * 6).toFixed(1)}px, ${(ny * 4).toFixed(1)}px, 0)`;
        }
    };

    const handlePointerEnter = (event: React.PointerEvent<HTMLAnchorElement>) => {
        if (event.pointerType !== 'mouse' || reducedMotionRef.current) {
            return;
        }
        rectRef.current = event.currentTarget.getBoundingClientRect();
        event.currentTarget.classList.add('is-tilting');
    };

    const handlePointerMove = (event: React.PointerEvent<HTMLAnchorElement>) => {
        if (event.pointerType !== 'mouse' || reducedMotionRef.current) {
            return;
        }
        if (!rectRef.current) {
            rectRef.current = event.currentTarget.getBoundingClientRect();
        }
        pointerRef.current.x = event.clientX;
        pointerRef.current.y = event.clientY;
        if (!rafRef.current) {
            rafRef.current = requestAnimationFrame(applyTilt);
        }
    };

    const handlePointerLeave = () => {
        rectRef.current = null;
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = 0;
        }
        if (cardRef.current) {
            cardRef.current.classList.remove('is-tilting');
            cardRef.current.style.transform = '';
        }
        if (imgRef.current) {
            imgRef.current.style.transform = '';
        }
        if (contentRef.current) {
            contentRef.current.style.transform = '';
        }
    };

    const imageSrc =
        capability.image ||
        SLUG_IMAGES[capability.slug] ||
        FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
    const tagLabel = capability.tag || capability.slug.toUpperCase();
    const specialtyCount = capability.children?.length ?? 0;

    return (
        <Link
            ref={cardRef}
            href={capability.path}
            prefetch
            onPointerEnter={handlePointerEnter}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            className="cap-card group/card relative flex h-[300px] w-full flex-col justify-between overflow-hidden rounded-3xl bg-secondary p-4 text-white shadow-[0_18px_40px_-22px_rgba(16,17,20,0.45),0_4px_12px_-4px_rgba(16,17,20,0.2)] ring-1 ring-inset ring-white/15 hover:shadow-[0_26px_52px_-22px_rgba(16,17,20,0.55)] hover:ring-primary/55 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:h-[380px] sm:p-5 lg:h-[clamp(360px,56vh,475px)]"
        >
            {/* Background photography with deeper parallax travel inside clipped frame */}
            <img
                ref={imgRef}
                src={imageSrc}
                alt={capability.title}
                loading="lazy"
                decoding="async"
                draggable={false}
                className="cap-card-media pointer-events-none absolute inset-0 h-full w-full scale-[1.04] object-cover"
            />

            {/* Multi-stop gradient scrim keeping upper imagery vivid and bottom text high-contrast */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(15,17,22,0.34)_0%,rgba(15,17,22,0.06)_36%,rgba(15,17,22,0.58)_68%,rgba(15,17,22,0.94)_100%)]"
            />

            {/* Subtle top glass specular highlight */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-3xl shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]"
            />

            {/* Top bar: frosted department tag badge and circular action indicator */}
            <div className="relative z-10 flex items-center justify-between gap-2">
                <span className="inline-flex items-center rounded-full border border-white/20 bg-black/35 px-3 py-1 text-2xs font-bold uppercase tracking-[0.18em] text-white/95 backdrop-blur-md">
                    {tagLabel}
                </span>

                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/20 bg-white/15 text-white backdrop-blur-md transition-[transform,background-color,border-color,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:rotate-45 group-hover/card:border-primary group-hover/card:bg-primary group-hover/card:text-primary-foreground">
                    <ArrowUpRight size={15} />
                </span>
            </div>

            {/* Bottom floating content plate with counter-parallax */}
            <div ref={contentRef} className="cap-card-content relative z-10 flex flex-col">
                <h3 className="text-base font-extrabold leading-snug tracking-[-0.02em] text-white transition-colors duration-300 group-hover/card:text-primary-soft sm:text-lg">
                    {capability.title}
                </h3>
                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-white/78">
                    {capability.subtitle}
                </p>

                <div className="mt-3.5 h-px w-full overflow-hidden bg-white/15">
                    <div className="h-full w-full origin-left scale-x-0 bg-primary transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:scale-x-100" />
                </div>

                <div className="mt-2.5 flex items-center justify-between gap-2 text-2xs font-semibold uppercase tracking-[0.14em]">
                    <span className="text-white/60">
                        {specialtyCount > 0 ? `${specialtyCount} specialities` : 'Core discipline'}
                    </span>
                    <span className="inline-flex items-center gap-1 text-white/90 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:translate-x-0.5 group-hover/card:text-primary-soft">
                        Explore
                    </span>
                </div>
            </div>
        </Link>
    );
});

/** The main capabilities (2D, 3D, DTP, Video) as dimensional editorial depth cards. Content comes from the admin panel. */
export const CapabilitiesSection = memo(function CapabilitiesSection({ active }: SectionProps) {
    const { capabilities_nav = [] } = usePage<PageProps>().props;

    return (
        <div
            data-scrollable
            className={`relative flex h-full w-full flex-col overflow-y-auto bg-page pb-12 pt-24 sm:pt-28 lg:pb-8 ${PAD_X}`}
        >
            <div className="relative z-10 mx-auto my-0 lg:my-auto w-full max-w-[1360px]">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <Reveal active={active}>
                            <h2 className="text-section font-display font-bold uppercase tracking-[-0.025em] text-ink">Core Capabilities</h2>
                        </Reveal>
                        <Reveal active={active} delay={0.08}>
                            <p className="mt-2.5 max-w-lg text-sm leading-relaxed text-muted sm:text-base">
                                Four core disciplines, built for high-volume apparel and product teams.
                            </p>
                        </Reveal>
                    </div>

                    <Reveal active={active} delay={0.14} className="flex shrink-0 flex-wrap items-center gap-2.5">
                        <PillButton href="/capabilities" variant="outline">
                            All Capabilities
                        </PillButton>
                        <OrderCta href="/book-a-demo">
                            Book a Demo
                        </OrderCta>
                    </Reveal>
                </div>

                <ul className="cap-grid mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-7 lg:grid-cols-4 lg:gap-5">
                    {capabilities_nav.map((capability, i) => (
                        <li key={capability.id} className="cap-card-wrap">
                            <Reveal active={active} delay={0.16 + i * 0.06} y="24px" className="h-full">
                                <CapabilityDepthCard capability={capability} index={i} />
                            </Reveal>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
});
