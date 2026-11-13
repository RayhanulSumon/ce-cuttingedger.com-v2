import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, X } from 'lucide-react';
import { Project } from '@/types/models';
import { EASE_OUT_QUART, orderUrl, PAD_X, Reveal, SectionProps } from './shared';

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
    '/images/portfolio/portfolio-1.jpg',
    '/images/portfolio/portfolio-2.jpg',
    '/images/portfolio/portfolio-3.jpg',
    '/images/portfolio/portfolio-4.jpg',
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
        bg: '#ef5d44',
        fg: '#0f0f0e',
        label: 'AI',
        title: 'Virtual try-on',
        description: 'Show every garment on a model without a shoot. Six styled looks, shoppable piece by piece.',
        actions: [{ label: 'Start a try-on order', href: orderUrl('virtual-try-on') }],
    },
    {
        bg: '#fcdd71',
        fg: '#0f0f0e',
        label: '3D',
        title: 'CGI & Twins',
        description: 'Photoreal digital twins and 3D product renders, ready for any pose, colour or setting.',
        actions: [
            { label: 'Browse digital twins', href: '/digital-twins' },
            { label: 'Order a custom model', href: orderUrl('digital-twins') },
        ],
    },
    {
        bg: '#9fd5f7',
        fg: '#0f0f0e',
        label: '2D',
        title: 'Retouching',
        description: 'Clean, consistent retouching for apparel, jewelry and products, delivered within 24 hours.',
        actions: [
            { label: 'Explore services', href: '/services' },
            { label: 'Order retouching', href: orderUrl('retouching') },
        ],
    },
    {
        bg: '#f9f6f1',
        fg: '#0f0f0e',
        label: 'DTP',
        title: 'Catalog layout',
        description: 'Multilingual catalog formatting, raster-to-vector conversion and prepress, from one workflow.',
        actions: [{ label: 'Explore services', href: '/services' }],
    },
    {
        bg: '#151515',
        fg: '#f9f6f1',
        label: 'Video',
        title: 'Motion cut-downs',
        description: 'Short-form video cut-downs built from the same source files as your stills.',
        actions: [{ label: 'Explore services', href: '/services' }],
    },
];

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

function TileCard({ tile, onOpen, decorative }: { tile: Tile; onOpen: (tile: Tile) => void; decorative: boolean }) {
    const common = {
        type: 'button' as const,
        onClick: () => onOpen(tile),
        tabIndex: decorative ? -1 : 0,
        'aria-label': `Open ${tile.title}`,
        className:
            'group relative aspect-[0.73] w-full shrink-0 cursor-pointer overflow-hidden rounded-[18px] text-left transition-[transform,box-shadow] duration-300 hover:z-10 hover:-translate-y-1 hover:scale-[1.03] hover:shadow-[0_24px_40px_-18px_rgba(15,15,14,0.55)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f5761a] sm:rounded-[22px]',
    };

    const hoverChip = (
        <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white text-[#0f0f0e] opacity-0 shadow-md transition-[opacity,transform] duration-300 group-hover:rotate-45 group-hover:opacity-100">
            <ArrowUpRight size={16} />
        </span>
    );

    if (tile.kind === 'photo') {
        return (
            <button {...common} style={{ backgroundImage: `url(${tile.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-12 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="block text-[10px] font-semibold uppercase tracking-[0.22em] opacity-80">{tile.label}</span>
                    <span className="mt-1 block text-sm font-bold leading-tight">{tile.title}</span>
                </span>
                {hoverChip}
            </button>
        );
    }

    return (
        <button
            {...common}
            style={{ backgroundColor: tile.bg, color: tile.fg, boxShadow: tile.bg === '#f9f6f1' ? 'inset 0 0 0 1px #e9e6df' : undefined }}
        >
            <span className="flex h-full flex-col justify-between p-4 sm:p-5">
                <span className="text-[10px] font-semibold uppercase tracking-[0.25em] opacity-70">{tile.label}</span>
                <span className="text-lg font-black uppercase leading-[0.95] tracking-[-0.03em] sm:text-2xl">{tile.title}</span>
            </span>
            {hoverChip}
        </button>
    );
}

/** One vertical lane. Hovering (or focusing) a lane freezes only that lane; the others keep moving. */
function Column({
    tiles,
    direction,
    speed,
    onOpen,
}: {
    tiles: Tile[];
    direction: 'down' | 'up';
    speed: number;
    onOpen: (tile: Tile) => void;
}) {
    return (
        <div className="min-w-0 flex-1 overflow-hidden px-1 py-1">
            <div
                className={`flex flex-col gap-3 pb-3 will-change-transform hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] ${direction === 'down' ? 'landing-col-down' : 'landing-col-up'}`}
                style={{ ['--landing-col-speed' as string]: `${speed}s` }}
            >
                {[...tiles, ...tiles].map((tile, i) => (
                    <TileCard key={i} tile={tile} onOpen={onOpen} decorative={i >= tiles.length} />
                ))}
            </div>
        </div>
    );
}

/** Detail card for a tile: what it is, plus the pages it leads to. */
function TileModal({ tile, onClose }: { tile: Tile | null; onClose: () => void }) {
    useEffect(() => {
        if (!tile) {
            return;
        }
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                event.stopPropagation();
                onClose();
            }
        };
        window.addEventListener('keydown', onKeyDown, true);
        return () => window.removeEventListener('keydown', onKeyDown, true);
    }, [tile, onClose]);

    return (
        <AnimatePresence>
            {tile && (
                <motion.div
                    className="absolute inset-0 z-[500] grid place-items-center bg-black/55 p-4 backdrop-blur-sm"
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
                        className="relative grid max-h-full w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl sm:grid-cols-[0.9fr_1.1fr]"
                        initial={{ y: 24, scale: 0.97, opacity: 0 }}
                        animate={{ y: 0, scale: 1, opacity: 1 }}
                        exit={{ y: 16, scale: 0.98, opacity: 0 }}
                        transition={{ duration: 0.4, ease: EASE_OUT_QUART }}
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div
                            className="min-h-[200px] bg-cover bg-center sm:min-h-[360px]"
                            style={
                                tile.kind === 'photo'
                                    ? { backgroundImage: `url(${tile.image})` }
                                    : { backgroundColor: tile.bg, color: tile.fg }
                            }
                        >
                            {tile.kind === 'color' && (
                                <div className="flex h-full flex-col justify-between p-6">
                                    <span className="text-xs font-semibold uppercase tracking-[0.25em] opacity-70">{tile.label}</span>
                                    <span className="text-4xl font-black uppercase leading-[0.95] tracking-[-0.03em]">{tile.title}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col justify-center p-6 sm:p-9">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#5d6572]">{tile.label}</p>
                            <h3 className="mt-2 text-2xl font-extrabold tracking-[-0.02em] text-[#16191f] sm:text-3xl">{tile.title}</h3>
                            <p className="mt-3 text-[15px] leading-relaxed text-[#3a3f48]">{tile.description}</p>

                            <div className="mt-6 flex flex-wrap gap-3">
                                {tile.actions.map((action, i) => (
                                    <Link
                                        key={action.href}
                                        href={action.href}
                                        className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-transform duration-300 hover:-translate-y-0.5 ${
                                            i === 0
                                                ? 'bg-[#f5761a] text-white shadow-[0_14px_30px_-14px_rgba(245,118,26,0.9)]'
                                                : 'border border-[#16191f]/25 text-[#16191f] hover:bg-[#16191f] hover:text-white'
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
                            className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-[#16191f] text-white shadow-lg transition-transform duration-300 hover:rotate-90"
                        >
                            <X size={18} />
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

interface ShowcaseProps extends SectionProps {
    projects: Project[];
}

export const ShowcaseSection = memo(function ShowcaseSection({ active, openDemo, projects, onOverlayChange }: ShowcaseProps) {
    const [openTile, setOpenTile] = useState<Tile | null>(null);

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
        <div className="relative grid h-full w-full grid-rows-[auto_1fr] overflow-hidden bg-[#f5f4ef] md:grid-cols-[1fr_minmax(300px,48%)] md:grid-rows-1">
            <div className={`relative z-10 flex flex-col justify-center pb-4 pt-20 sm:pt-24 md:pb-8 ${PAD_X}`}>
                <Reveal active={active}>
                    <h2 className="text-[clamp(38px,7.2vw,104px)] font-black uppercase leading-[0.9] tracking-[-0.05em] text-[#0f0f0e]">
                        What we
                        <br />
                        achieved
                    </h2>
                </Reveal>
                <Reveal active={active} delay={0.16}>
                    <p className="mt-4 max-w-md text-sm leading-relaxed text-[#0f0f0e] sm:text-base md:mt-6 md:text-lg">
                        Catalogs, campaigns and digital twins delivered for fashion and e-commerce brands, from{' '}
                        <strong className="font-bold">one-off retouches</strong> to <strong className="font-bold">thousand-SKU programmes</strong>.
                    </p>
                </Reveal>
                <Reveal active={active} delay={0.26} className="mt-5 flex flex-wrap items-center gap-3 md:mt-8">
                    <Link href="/case-studies" className="rounded-full bg-[#0f0f0e] px-7 py-3.5 text-sm font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5">
                        View case studies
                    </Link>
                    <button type="button" onClick={openDemo} className="group flex items-center gap-3 text-sm font-bold">
                        <span className="grid h-8 w-8 place-items-center rounded-full bg-[#0f0f0e] text-white transition-transform duration-300 group-hover:rotate-45">
                            <ArrowUpRight size={14} />
                        </span>
                        Book a Demo
                    </button>
                </Reveal>
            </div>

            <Reveal
                active={active}
                delay={0.1}
                x="48px"
                y="0px"
                className="relative min-h-0 overflow-hidden pb-6 pr-6 pt-20 sm:pr-10 md:pb-8 md:pr-14 md:pt-24 lg:pr-20"
            >
                <div className="flex h-full gap-3.5 pl-5 sm:pl-10 md:pl-0">
                    <Column tiles={columns[0]} direction="down" speed={38} onOpen={open} />
                    <Column tiles={columns[1]} direction="up" speed={30} onOpen={open} />
                    <div className="hidden min-w-0 flex-1 sm:flex">
                        <Column tiles={columns[2]} direction="down" speed={34} onOpen={open} />
                    </div>
                </div>
            </Reveal>

            <TileModal tile={openTile} onClose={close} />
        </div>
    );
});
