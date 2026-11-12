import React, { memo, useMemo } from 'react';
import { Link } from '@inertiajs/react';
import { ArrowUpRight } from 'lucide-react';
import { Project } from '@/types/models';
import { PAD_X, Reveal, SectionProps } from './shared';

interface Tile {
    kind: 'photo' | 'color';
    image?: string;
    bg?: string;
    fg?: string;
    label?: string;
    title?: string;
}

const PHOTOS = [
    '/images/portfolio/portfolio-1.jpg',
    '/images/portfolio/portfolio-2.jpg',
    '/images/portfolio/portfolio-3.jpg',
    '/images/portfolio/portfolio-4.jpg',
];

const COLORS = [
    { bg: '#ef5d44', fg: '#0f0f0e' },
    { bg: '#fcdd71', fg: '#0f0f0e' },
    { bg: '#9fd5f7', fg: '#0f0f0e' },
    { bg: '#f9f6f1', fg: '#0f0f0e' },
    { bg: '#151515', fg: '#f9f6f1' },
];

const CAPTIONS = [
    { label: '2D', title: 'Retouching' },
    { label: '3D', title: 'CGI & Twins' },
    { label: 'DTP', title: 'Catalog layout' },
    { label: 'Video', title: 'Motion cut-downs' },
    { label: 'AI', title: 'Virtual try-on' },
];

/** Builds the three scrolling columns: photos and solid tiles alternate, as in the showcase demo. */
function buildColumns(photos: string[]): Tile[][] {
    const photo = (n: number): Tile => ({ kind: 'photo', image: photos[n % photos.length] });
    const color = (n: number): Tile => ({ kind: 'color', ...COLORS[n % COLORS.length], ...CAPTIONS[n % CAPTIONS.length] });

    return [
        [photo(0), color(2), color(4), photo(1), color(1)],
        [color(1), photo(2), color(3), color(0), photo(3)],
        [color(2), photo(1), color(0), photo(0), color(3)],
    ];
}

function TileCard({ tile }: { tile: Tile }) {
    if (tile.kind === 'photo') {
        return (
            <div
                className="aspect-[0.73] w-full shrink-0 rounded-[18px] bg-[#e2dfd7] bg-cover bg-center sm:rounded-[22px]"
                style={{ backgroundImage: `url(${tile.image})` }}
            />
        );
    }

    return (
        <div
            className="flex aspect-[0.73] w-full shrink-0 flex-col justify-between rounded-[18px] p-4 sm:rounded-[22px] sm:p-5"
            style={{ backgroundColor: tile.bg, color: tile.fg, boxShadow: tile.bg === '#f9f6f1' ? 'inset 0 0 0 1px #e9e6df' : undefined }}
        >
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] opacity-70">{tile.label}</span>
            <span className="text-lg font-black uppercase leading-[0.95] tracking-[-0.03em] sm:text-2xl">{tile.title}</span>
        </div>
    );
}

function Column({ tiles, direction, speed }: { tiles: Tile[]; direction: 'down' | 'up'; speed: number }) {
    return (
        <div className="min-w-0 flex-1 overflow-hidden" aria-hidden="true">
            <div
                className={`flex flex-col gap-3 pb-3 will-change-transform ${direction === 'down' ? 'landing-col-down' : 'landing-col-up'}`}
                style={{ ['--landing-col-speed' as string]: `${speed}s` }}
            >
                {[...tiles, ...tiles].map((tile, i) => (
                    <TileCard key={i} tile={tile} />
                ))}
            </div>
        </div>
    );
}

interface ShowcaseProps extends SectionProps {
    projects: Project[];
}

export const ShowcaseSection = memo(function ShowcaseSection({ active, openDemo, projects }: ShowcaseProps) {
    const columns = useMemo(() => {
        const covers = projects.map((p) => p.cover_image).filter(Boolean);
        return buildColumns(covers.length >= 2 ? [...covers, ...PHOTOS] : PHOTOS);
    }, [projects]);

    return (
        <div className="relative grid h-full w-full grid-rows-[auto_1fr] overflow-hidden bg-[#f5f4ef] md:grid-cols-[1fr_minmax(300px,48%)] md:grid-rows-1">
            <div className={`relative z-10 flex flex-col justify-center pb-4 pt-20 sm:pt-24 md:pb-8 ${PAD_X}`}>
                <Reveal active={active}>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#0f0f0e]/60">04 / Showcase</p>
                </Reveal>
                <Reveal active={active} delay={0.08}>
                    <h2 className="mt-3 text-[clamp(38px,7.2vw,104px)] font-black uppercase leading-[0.9] tracking-[-0.05em] text-[#0f0f0e]">
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
                    <Column tiles={columns[0]} direction="down" speed={38} />
                    <Column tiles={columns[1]} direction="up" speed={30} />
                    <div className="hidden min-w-0 flex-1 sm:flex">
                        <Column tiles={columns[2]} direction="down" speed={34} />
                    </div>
                </div>
            </Reveal>
        </div>
    );
});
