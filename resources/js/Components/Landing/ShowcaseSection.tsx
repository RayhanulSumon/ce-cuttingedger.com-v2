import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, X } from 'lucide-react';
import { useInViewport } from '@/hooks/useInViewport';
import { Project } from '@/types/models';
import { EASE_OUT_QUART, orderUrl, PAD_X, PillButton, Reveal, SectionProps } from './shared';

interface TileAction {
    label: string;
    href: string;
}

interface Tile {
    id: string;
    kind: 'photo' | 'color';
    image?: string;
    bg?: string;
    fg?: string;
    label: string;
    title: string;
    description: string;
    actions: TileAction[];
}

const PHOTOS = [
    '/images/portfolio/portfolio-1.webp',
    '/images/portfolio/portfolio-2.webp',
    '/images/portfolio/portfolio-3.webp',
    '/images/portfolio/portfolio-4.webp',
];

interface Photo {
    image: string;
    label: string;
    title: string;
    description: string;
    actions: TileAction[];
}

const FALLBACK_PHOTO_COPY = {
    label: 'Portfolio',
    title: 'Selected work',
    description: 'A look at the catalogs, campaigns and digital twins we deliver for fashion and e-commerce brands.',
    actions: [{ label: 'View case studies', href: '/case-studies' }],
};

const COLORED_TILES = [
    {
        bg: 'var(--color-primary)',
        fg: 'var(--color-primary-foreground)',
        label: 'AI',
        title: 'Virtual try-on',
        description: 'Show every garment on a model without a shoot. Six styled looks, shoppable piece by piece.',
        actions: [{ label: 'Start a try-on order', href: orderUrl('virtual-try-on') }],
    },
    {
        bg: 'var(--color-secondary)',
        fg: 'var(--color-secondary-foreground)',
        label: '2D',
        title: 'Digital twins',
        description: 'Photoreal AI digital twins and studio models, ready for any pose, colour or setting.',
        actions: [
            { label: 'Browse digital twins', href: '/capabilities/2d/digital-twins' },
            { label: 'Order a custom model', href: orderUrl('digital-twins') },
        ],
    },
    {
        bg: 'var(--color-surface)',
        fg: 'var(--color-ink)',
        label: '2D',
        title: 'Retouching',
        description: 'Clean, consistent retouching for apparel, jewelry and products, delivered within 24 hours.',
        actions: [
            { label: 'Explore capabilities', href: '/capabilities' },
            { label: 'Order retouching', href: orderUrl('retouching') },
        ],
    },
    {
        bg: 'var(--color-surface-3)',
        fg: 'var(--color-ink)',
        label: 'DTP',
        title: 'Catalog layout',
        description: 'Multilingual catalog formatting, raster-to-vector conversion and prepress, from one workflow.',
        actions: [{ label: 'Explore capabilities', href: '/capabilities' }],
    },
    {
        bg: 'var(--color-ink-2)',
        fg: 'var(--color-surface)',
        label: 'Video',
        title: 'Motion cut-downs',
        description: 'Short-form video cut-downs built from the same source files as your stills.',
        actions: [{ label: 'Explore capabilities', href: '/capabilities' }],
    },
];

interface LaneConfig {
    direction: -1 | 1;
    speedPxPerSec: number;
    seedFraction: number;
    staggerDelay: number;
}

const LANE_CONFIGS: readonly LaneConfig[] = [
    { direction: -1, speedPxPerSec: 38, seedFraction: 0.15, staggerDelay: 0.08 },
    { direction: 1, speedPxPerSec: 44, seedFraction: 0.55, staggerDelay: 0.16 },
    { direction: -1, speedPxPerSec: 41, seedFraction: 0.35, staggerDelay: 0.24 },
];

const ENTRANCE_RAMP_MS = 850;
const LANE_MASK_CLASS = '[mask-image:linear-gradient(to_bottom,transparent_0%,black_9%,black_91%,transparent_100%)]';

/** Builds the three scrolling columns: photos and solid tiles alternate. */
function buildColumns(photos: Photo[]): Tile[][] {
    const photo = (n: number): Tile => {
        const item = photos[n % photos.length];
        return { id: `photo-${n}`, kind: 'photo', ...item };
    };
    const color = (n: number): Tile => ({ id: `color-${n}`, kind: 'color', ...COLORED_TILES[n % COLORED_TILES.length] });

    return [
        [photo(0), color(2), color(4), photo(1), color(1)],
        [color(1), photo(2), color(3), color(0), photo(3)],
        [color(2), photo(1), color(0), photo(0), color(3)],
    ];
}

const TileCard = memo(function TileCard({
    tile,
    onOpen,
    decorative,
}: {
    tile: Tile;
    onOpen: (tile: Tile) => void;
    decorative: boolean;
}) {
    const common = {
        type: 'button' as const,
        onClick: () => onOpen(tile),
        tabIndex: decorative ? -1 : 0,
        'aria-hidden': decorative || undefined,
        'aria-label': decorative ? undefined : `Open ${tile.title}`,
        className:
            'group relative aspect-[0.73] w-full shrink-0 cursor-pointer overflow-hidden rounded-[18px] text-left backface-hidden transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:z-10 hover:-translate-y-1 hover:scale-[1.025] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:rounded-[22px]',
    };

    const hoverChip = (
        <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-surface text-ink opacity-0 shadow-md transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-45 group-hover:opacity-100">
            <ArrowUpRight size={16} />
        </span>
    );

    if (tile.kind === 'photo') {
        return (
            <button {...common} className={`${common.className} bg-surface-2 ring-1 ring-inset ring-ink/8`}>
                <img
                    src={tile.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    className="pointer-events-none absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent p-4 pt-12 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="block text-2xs font-semibold uppercase tracking-[0.22em] opacity-80">{tile.label}</span>
                    <span className="mt-1 block text-sm font-bold leading-tight">{tile.title}</span>
                </span>
                {hoverChip}
            </button>
        );
    }

    return (
        <button
            {...common}
            style={{
                backgroundColor: tile.bg,
                color: tile.fg,
                boxShadow:
                    tile.bg === 'var(--color-surface)' || tile.bg === 'var(--color-surface-3)'
                        ? 'inset 0 0 0 1px var(--color-line)'
                        : 'inset 0 1px 0 rgba(255, 255, 255, 0.14)',
            }}
        >
            <span className="flex h-full flex-col justify-between p-4 sm:p-5">
                <span className="text-2xs font-semibold uppercase tracking-[0.25em] opacity-70">{tile.label}</span>
                <span className="text-lg font-black uppercase leading-[0.95] tracking-[-0.03em] sm:text-2xl">{tile.title}</span>
            </span>
            {hoverChip}
        </button>
    );
});

/** Detail card for a tile: what it is, plus the pages it leads to. */
function TileModal({ tile, onClose }: { tile: Tile | null; onClose: () => void }) {
    useEffect(() => {
        if (!tile) {
            return;
        }
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                event.stopPropagation();
                onClose();
            }
        };
        window.addEventListener('keydown', onKeyDown, true);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', onKeyDown, true);
        };
    }, [tile, onClose]);

    if (typeof document === 'undefined') {
        return null;
    }

    return createPortal(
        <AnimatePresence>
            {tile && (
                <motion.div
                    className="fixed inset-0 z-[500] flex items-center justify-center bg-ink/55 p-4 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    onClick={onClose}
                >
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-label={tile.title}
                        data-scrollable
                        className="relative grid max-h-[min(88dvh,680px)] w-full max-w-3xl overflow-y-auto rounded-3xl bg-surface shadow-2xl sm:grid-cols-[0.9fr_1.1fr]"
                        initial={{ y: 24, scale: 0.97, opacity: 0 }}
                        animate={{ y: 0, scale: 1, opacity: 1 }}
                        exit={{ y: 16, scale: 0.98, opacity: 0 }}
                        transition={{ duration: 0.4, ease: EASE_OUT_QUART }}
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div
                            className="relative min-h-[200px] overflow-hidden bg-surface-2 sm:min-h-[360px]"
                            style={tile.kind === 'color' ? { backgroundColor: tile.bg, color: tile.fg } : undefined}
                        >
                            {tile.kind === 'photo' ? (
                                <img src={tile.image} alt={tile.title} decoding="async" className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex h-full flex-col justify-between p-6">
                                    <span className="text-xs font-semibold uppercase tracking-[0.25em] opacity-70">{tile.label}</span>
                                    <span className="text-4xl font-black uppercase leading-[0.95] tracking-[-0.03em]">{tile.title}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col justify-center p-6 sm:p-9">
                            <p className="text-2xs font-semibold uppercase tracking-[0.25em] text-subtle">{tile.label}</p>
                            <h3 className="mt-2 text-2xl font-extrabold tracking-[-0.02em] text-ink sm:text-3xl">{tile.title}</h3>
                            <p className="mt-3 text-base leading-relaxed text-ink-2">{tile.description}</p>

                            <div className="mt-6 flex flex-wrap gap-3">
                                {tile.actions.map((action, i) => (
                                    <Link
                                        key={action.href}
                                        href={action.href}
                                        prefetch
                                        className={`inline-flex h-10 items-center gap-2 rounded-full px-5 text-xs font-semibold transition-transform duration-200 hover:-translate-y-0.5 sm:h-11 sm:text-sm ${
                                            i === 0
                                                ? 'bg-primary text-primary-foreground shadow-[0_10px_24px_-12px_color-mix(in_srgb,var(--color-primary)_75%,transparent)] hover:bg-primary-hover'
                                                : 'border border-ink/20 text-ink hover:border-ink hover:bg-ink hover:text-surface'
                                        }`}
                                    >
                                        {action.label}
                                        <ArrowUpRight size={15} />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close"
                            className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-ink text-surface shadow-lg transition-transform duration-300 hover:rotate-90"
                        >
                            <X size={18} />
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body,
    );
}

interface ShowcaseProps extends SectionProps {
    projects: Project[];
}

export const ShowcaseSection = memo(function ShowcaseSection({ active, projects, onOverlayChange }: ShowcaseProps) {
    const rootRef = useRef<HTMLDivElement>(null);
    const inView = useInViewport(rootRef);
    const [openTile, setOpenTile] = useState<Tile | null>(null);
    const trackRefs = useRef<(HTMLDivElement | null)[]>([]);
    const pausedRefs = useRef<[boolean, boolean, boolean]>([false, false, false]);
    const laneStateRef = useRef([
        { offset: 0, loopHeight: 0, factor: 1, seeded: false },
        { offset: 0, loopHeight: 0, factor: 1, seeded: false },
        { offset: 0, loopHeight: 0, factor: 1, seeded: false },
    ]);

    const columns = useMemo(() => {
        const fromProjects: Photo[] = projects
            .filter((project) => project.cover_image)
            .map((project) => ({
                image: project.cover_image,
                label: project.category?.name ?? 'Case study',
                title: project.title,
                description: project.summary,
                actions: [
                    { label: 'View case study', href: `/case-studies/${project.slug}` },
                    { label: 'Order something similar', href: orderUrl('retouching', project.title) },
                ],
            }));
        const fallback: Photo[] = PHOTOS.map((image) => ({ image, ...FALLBACK_PHOTO_COPY }));

        return buildColumns(fromProjects.length >= 2 ? [...fromProjects, ...fallback] : fallback);
    }, [projects]);

    // Measure half-track loop heights out of band via ResizeObserver so the RAF loop never reads layout.
    useEffect(() => {
        const measureTracks = () => {
            trackRefs.current.forEach((track, i) => {
                if (!track) {
                    return;
                }
                const half = track.scrollHeight / 2;
                if (half <= 0) {
                    return;
                }
                const lane = laneStateRef.current[i];
                lane.loopHeight = half;
                if (!lane.seeded) {
                    lane.seeded = true;
                    lane.offset = -half * LANE_CONFIGS[i].seedFraction;
                } else {
                    lane.offset = ((lane.offset % half) - half) % half;
                }
                track.style.transform = `translate3d(0, ${lane.offset.toFixed(2)}px, 0)`;
            });
        };

        measureTracks();
        const observer = new ResizeObserver(measureTracks);
        trackRefs.current.forEach((track) => {
            if (track) {
                observer.observe(track);
            }
        });
        return () => observer.disconnect();
    }, [columns]);

    // Single RAF engine driving all 3 marquee lanes with entrance ramp and smooth hover deceleration.
    useEffect(() => {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduced) {
            trackRefs.current.forEach((track) => {
                if (track) {
                    track.style.transform = 'translate3d(0, 0, 0)';
                }
            });
            return;
        }

        if (!active || !inView || openTile !== null) {
            return;
        }

        let rafId = 0;
        let lastTime = 0;
        let startTime = 0;
        let disposed = false;

        const onVisibilityChange = () => {
            if (!document.hidden) {
                lastTime = 0;
            }
        };
        document.addEventListener('visibilitychange', onVisibilityChange);

        const tick = (now: number) => {
            if (disposed) {
                return;
            }
            if (!document.hidden) {
                if (!startTime) {
                    startTime = now;
                }
                const dt = lastTime ? Math.min(0.05, (now - lastTime) / 1000) : 1 / 60;
                lastTime = now;

                const rampT = Math.min(1, (now - startTime) / ENTRANCE_RAMP_MS);
                const ramp = 1 - Math.pow(1 - rampT, 3);
                const brakeLerp = 1 - Math.exp(-8 * dt);

                for (let i = 0; i < LANE_CONFIGS.length; i++) {
                    const track = trackRefs.current[i];
                    const lane = laneStateRef.current[i];
                    if (!track || lane.loopHeight <= 0) {
                        continue;
                    }
                    const cfg = LANE_CONFIGS[i];
                    const targetFactor = pausedRefs.current[i] ? 0 : 1;
                    lane.factor += (targetFactor - lane.factor) * brakeLerp;
                    if (Math.abs(targetFactor - lane.factor) < 0.002) {
                        lane.factor = targetFactor;
                    }

                    const delta = cfg.direction * cfg.speedPxPerSec * ramp * lane.factor * dt;
                    if (delta !== 0) {
                        let next = lane.offset + delta;
                        while (next >= 0) {
                            next -= lane.loopHeight;
                        }
                        while (next < -lane.loopHeight) {
                            next += lane.loopHeight;
                        }
                        lane.offset = next;
                        track.style.transform = `translate3d(0, ${next.toFixed(2)}px, 0)`;
                    }
                }
            } else {
                lastTime = 0;
            }

            rafId = requestAnimationFrame(tick);
        };

        rafId = requestAnimationFrame(tick);
        return () => {
            disposed = true;
            cancelAnimationFrame(rafId);
            document.removeEventListener('visibilitychange', onVisibilityChange);
        };
    }, [active, inView, openTile]);

    const open = useCallback(
        (tile: Tile) => {
            setOpenTile(tile);
            onOverlayChange?.(true);
        },
        [onOverlayChange],
    );

    const close = useCallback(() => {
        setOpenTile(null);
        onOverlayChange?.(false);
    }, [onOverlayChange]);

    return (
        <div ref={rootRef} className="relative grid h-full w-full grid-rows-[auto_1fr] overflow-hidden bg-page md:grid-cols-[1fr_minmax(300px,48%)] md:grid-rows-1">
            <div className={`relative z-10 flex flex-col justify-center pb-4 pt-24 sm:pt-28 md:pb-10 md:pt-28 ${PAD_X}`}>
                <Reveal active={active}>
                    <h2 className="text-section text-ink">What We Achieved</h2>
                </Reveal>
                <Reveal active={active} delay={0.14}>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-muted sm:text-base">
                        Catalogs, campaigns and digital twins delivered for fashion and e-commerce brands, from{' '}
                        <strong className="font-semibold text-ink">one-off retouches</strong> to{' '}
                        <strong className="font-semibold text-ink">thousand-SKU programmes</strong>.
                    </p>
                </Reveal>
                <Reveal active={active} delay={0.24} className="mt-5 flex flex-wrap items-center gap-2.5 md:mt-7">
                    <PillButton href="/case-studies" variant="dark">
                        View Case Studies
                    </PillButton>
                    <PillButton href="/book-a-demo" variant="outline">
                        Book a Demo
                        <ArrowUpRight size={14} className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </PillButton>
                </Reveal>
            </div>

            <div className="relative min-h-0 overflow-hidden px-5 pb-6 pt-3 sm:px-10 md:pb-10 md:pl-0 md:pr-16 md:pt-28 lg:pr-20 lg:pt-28">
                <div className="flex h-full gap-3.5">
                    {columns.map((tiles, colIdx) => (
                        <Reveal
                            key={colIdx}
                            active={active}
                            delay={LANE_CONFIGS[colIdx].staggerDelay}
                            y="34px"
                            x="0px"
                            className={`${colIdx === 2 ? 'hidden sm:block' : ''} h-full min-w-0 flex-1`}
                        >
                            <div
                                className={`h-full w-full overflow-hidden px-1 py-1 [contain:layout_style_paint] ${LANE_MASK_CLASS}`}
                                onPointerEnter={(event) => {
                                    if (event.pointerType === 'mouse') {
                                        pausedRefs.current[colIdx] = true;
                                    }
                                }}
                                onPointerLeave={() => {
                                    pausedRefs.current[colIdx] = false;
                                }}
                                onFocus={() => {
                                    pausedRefs.current[colIdx] = true;
                                }}
                                onBlur={(event) => {
                                    if (!event.currentTarget.contains(event.relatedTarget)) {
                                        pausedRefs.current[colIdx] = false;
                                    }
                                }}
                            >
                                <div
                                    ref={(el) => {
                                        trackRefs.current[colIdx] = el;
                                    }}
                                    className="flex flex-col gap-3 pb-3 will-change-transform"
                                >
                                    {[...tiles, ...tiles].map((tile, tileIdx) => (
                                        <TileCard
                                            key={`${tile.id}-${tileIdx}`}
                                            tile={tile}
                                            onOpen={open}
                                            decorative={tileIdx >= tiles.length}
                                        />
                                    ))}
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>

            <TileModal tile={openTile} onClose={close} />
        </div>
    );
});
