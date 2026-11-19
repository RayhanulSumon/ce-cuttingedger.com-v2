import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from '@inertiajs/react';
import { ArrowLeft, ChevronDown, Clock } from 'lucide-react';
import { TwinPresetModal } from '@/Components/Landing/DigitalTwins/TwinPresetModal';
import { TwinSpriteCrop } from '@/Components/Landing/DigitalTwins/TwinSpriteCrop';
import { DIGITAL_TWINS, DigitalTwinModel } from '@/Components/Landing/DigitalTwins/twins';
import { digitalTwinOrderUrl, OrderCta, PAD_X } from '@/Components/Landing/shared';
import { Capability } from '@/types/models';

const ALL = 'All';
const UPCOMING = 'Upcoming';
const INITIAL_ROWS = 2;
const ROWS_PER_LOAD = 2;
const CARD_STAGE_BACKGROUND = 'linear-gradient(90deg, #f1f5fa 0%, #e7eff6 38%, #eef4f9 62%, #f6f9fc 100%)';

const CATEGORY_ORDER = ['Female', 'Male'] as const;

interface DigitalTwinsShowcaseProps {
    capability?: Capability;
    parent?: Capability | null;
    digitalTwins?: DigitalTwinModel[];
}

function isUpcomingTwin(twin: DigitalTwinModel): boolean {
    return Boolean(twin.isUpcoming) || twin.archetype.trim().toLowerCase() === 'upcoming';
}

function categoryOf(twin: DigitalTwinModel): string {
    if (isUpcomingTwin(twin)) {
        return UPCOMING;
    }

    return twin.archetype.trim() || 'Editorial';
}

function twinKey(twin: DigitalTwinModel): string {
    return String(twin.id ?? twin.slug ?? twin.lookNumber);
}

/** Matches `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6` so each Load More reveals full rows. */
function useColumnsPerRow(): number {
    const getColumns = () => {
        if (typeof window === 'undefined') {
            return 6;
        }
        if (window.innerWidth >= 1280) {
            return 6;
        }
        if (window.innerWidth >= 1024) {
            return 4;
        }
        if (window.innerWidth >= 640) {
            return 3;
        }
        return 2;
    };

    const [columns, setColumns] = useState<number>(getColumns);

    useEffect(() => {
        const update = () => setColumns(getColumns());
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    return columns;
}

/**
 * Digital Twins catalog page with a clean minimal top header, under-header category tabs,
 * 2-row initial grid with Load More (+2 rows) pagination, and a dedicated Upcoming preview card.
 */
export function DigitalTwinsShowcase({ capability, parent, digitalTwins }: DigitalTwinsShowcaseProps) {
    const fallbackUpcoming = useMemo(
        () => DIGITAL_TWINS.find((twin) => isUpcomingTwin(twin)),
        [],
    );

    const allTwins = useMemo(() => {
        const base = digitalTwins && digitalTwins.length > 0 ? digitalTwins : DIGITAL_TWINS;
        const upcomingModels = base.filter((twin) => isUpcomingTwin(twin));

        if (upcomingModels.length === 1) {
            return base;
        }

        if (upcomingModels.length > 1) {
            let keptUpcoming = false;
            return base.filter((twin) => {
                if (!isUpcomingTwin(twin)) {
                    return true;
                }
                if (keptUpcoming) {
                    return false;
                }
                keptUpcoming = true;
                return true;
            });
        }

        return fallbackUpcoming ? [...base, fallbackUpcoming] : base;
    }, [digitalTwins, fallbackUpcoming]);

    const releasedTwins = useMemo(
        () => allTwins.filter((twin) => !isUpcomingTwin(twin)),
        [allTwins],
    );

    const [category, setCategory] = useState<string>(ALL);
    const [visibleRows, setVisibleRows] = useState<number>(INITIAL_ROWS);
    const [modalTwinIndex, setModalTwinIndex] = useState<number | null>(null);
    const [upcomingActiveKey, setUpcomingActiveKey] = useState<string | null>(null);
    const colsPerRow = useColumnsPerRow();

    const closeModal = useCallback(() => setModalTwinIndex(null), []);

    const categories = useMemo(() => {
        const present = new Set(allTwins.map(categoryOf));
        const ordered = [
            ...CATEGORY_ORDER.filter((name) => present.has(name)),
            ...Array.from(present).filter(
                (name) => !CATEGORY_ORDER.includes(name as (typeof CATEGORY_ORDER)[number]) && name !== UPCOMING,
            ),
        ];

        if (present.has(UPCOMING)) {
            ordered.push(UPCOMING);
        }

        return [ALL, ...ordered];
    }, [allTwins]);

    const twins = useMemo(
        () => (category === ALL ? allTwins : allTwins.filter((twin) => categoryOf(twin) === category)),
        [allTwins, category],
    );

    const visibleLimit = visibleRows * colsPerRow;
    const visibleTwins = twins.slice(0, visibleLimit);
    const hasMore = visibleTwins.length < twins.length;

    const handleSelectCategory = (name: string) => {
        setCategory(name);
        setVisibleRows(INITIAL_ROWS);
        setUpcomingActiveKey(null);
    };

    const handleCardClick = (twin: DigitalTwinModel) => {
        if (isUpcomingTwin(twin)) {
            const key = twinKey(twin);
            setUpcomingActiveKey((current) => (current === key ? null : key));
            return;
        }

        setUpcomingActiveKey(null);
        const releasedIdx = releasedTwins.findIndex((item) => twinKey(item) === twinKey(twin));
        setModalTwinIndex(releasedIdx >= 0 ? releasedIdx : 0);
    };

    return (
        <div className="min-h-screen bg-white text-ink">
            {/* Clean Top Header */}
            <header className={`border-b border-ink/10 bg-white pb-6 pt-20 sm:pb-7 sm:pt-24 ${PAD_X}`}>
                <div className="mx-auto flex max-w-[1440px] flex-wrap items-end justify-between gap-4">
                    <div>
                        {capability && (
                            <Link
                                href={parent ? `/capabilities/${parent.slug}` : '/capabilities'}
                                prefetch
                                className="mb-2 inline-flex items-center gap-1.5 text-xs font-medium text-subtle transition-colors hover:text-primary"
                            >
                                <ArrowLeft size={13} />
                                {parent ? `Back to ${parent.title}` : 'All capabilities'}
                            </Link>
                        )}
                        <h1 className="font-michroma text-[clamp(24px,2.8vw,36px)] font-normal leading-[1.12] tracking-[0.12em] text-ink">
                            {capability?.title ?? 'Digital Twins'}
                        </h1>
                    </div>

                    <OrderCta href={digitalTwinOrderUrl({ mode: 'custom' })}>Order custom model</OrderCta>
                </div>
            </header>

            {/* Category Filter Toolbar + 2-Row Paginated Grid */}
            <section className={`py-6 sm:py-8 ${PAD_X}`}>
                <div className="mx-auto max-w-[1440px]">
                    {/* Clean Category Bar Under Header */}
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                        <div
                            role="tablist"
                            aria-label="Filter digital twins by category"
                            className="flex items-center gap-2 overflow-x-auto py-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                        >
                            {categories.map((name) => {
                                const isSelected = category === name;

                                return (
                                    <button
                                        key={name}
                                        type="button"
                                        role="tab"
                                        aria-selected={isSelected}
                                        onClick={() => handleSelectCategory(name)}
                                        className={`cursor-pointer whitespace-nowrap rounded-full border px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
                                            isSelected
                                                ? 'border-ink bg-ink text-white shadow-sm'
                                                : 'border-ink/15 bg-white text-subtle hover:border-primary/60 hover:text-primary'
                                        }`}
                                    >
                                        {name}
                                    </button>
                                );
                            })}
                        </div>

                        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-subtle">
                            Showing {visibleTwins.length} of {twins.length} {twins.length === 1 ? 'model' : 'models'}
                        </span>
                    </div>

                    {/* Models Grid */}
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-6">
                        {visibleTwins.map((twin) => {
                            const [name, style] = twin.name.split(' — ');
                            const categoryName = categoryOf(twin);
                            const upcoming = isUpcomingTwin(twin);
                            const key = twinKey(twin);
                            const showUpcomingNotice = upcoming && upcomingActiveKey === key;

                            return (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => handleCardClick(twin)}
                                    aria-label={upcoming ? `${name} — Upcoming` : `View ${name} poses`}
                                    className={`group cursor-pointer overflow-hidden rounded-2xl border bg-white text-left shadow-[0_8px_22px_-16px_color-mix(in_srgb,var(--color-ink)_20%,transparent)] transition-all duration-300 hover:-translate-y-1 ${
                                        showUpcomingNotice
                                            ? 'border-ink/40 ring-2 ring-ink/15'
                                            : 'border-ink/10 hover:border-primary/50 hover:shadow-[0_14px_34px_-16px_color-mix(in_srgb,var(--color-primary)_35%,transparent)]'
                                    }`}
                                >
                                    <div className="relative aspect-[3/4] overflow-hidden" style={{ background: CARD_STAGE_BACKGROUND }}>
                                        <TwinSpriteCrop
                                            twin={twin}
                                            className={`h-full w-full object-contain transition-transform duration-500 ${
                                                upcoming ? 'opacity-80 group-hover:scale-[1.03]' : 'group-hover:scale-[1.04]'
                                            }`}
                                        />

                                        {upcoming ? (
                                            <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-ink px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-white shadow-sm">
                                                <Clock size={10} />
                                                Upcoming
                                            </span>
                                        ) : (
                                            twin.isCopyrightSold && (
                                                <span className="absolute left-2 top-2 rounded-full bg-red-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-white shadow-[0_6px_14px_-6px_rgba(220,38,38,0.7)]">
                                                    Sold out
                                                </span>
                                            )
                                        )}

                                        {showUpcomingNotice ? (
                                            <div
                                                role="status"
                                                className="absolute inset-0 flex flex-col items-center justify-center bg-ink/60 p-3 text-center backdrop-blur-[2px]"
                                            >
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-ink shadow-md">
                                                    <Clock size={12} />
                                                    Upcoming
                                                </span>
                                                <span className="mt-2 text-[11px] font-medium text-white/90">
                                                    Coming soon
                                                </span>
                                            </div>
                                        ) : (
                                            <span
                                                className={`absolute inset-x-2 bottom-2 grid place-items-center rounded-full py-1.5 text-[10px] font-bold text-white opacity-0 transition-all duration-300 group-hover:opacity-100 ${
                                                    upcoming ? 'bg-ink' : 'bg-primary'
                                                }`}
                                            >
                                                {upcoming ? 'Upcoming' : 'View poses'}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-baseline justify-between gap-2 p-3">
                                        <div className="min-w-0">
                                            <h2 className="truncate text-sm font-semibold text-ink">{name}</h2>
                                            <p className="truncate text-[11px] text-subtle">{style || categoryName}</p>
                                        </div>
                                        <span className={`shrink-0 text-xs font-bold ${upcoming ? 'text-subtle' : 'text-ink'}`}>
                                            {upcoming ? UPCOMING : twin.presetPrice}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Load More (+2 Rows) Pagination */}
                    {hasMore && (
                        <div className="mt-8 flex justify-center">
                            <button
                                type="button"
                                onClick={() => setVisibleRows((rows) => rows + ROWS_PER_LOAD)}
                                className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-ink/20 bg-white px-6 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-ink shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-ink hover:bg-ink hover:text-white active:translate-y-0"
                            >
                                Load more
                                <ChevronDown size={14} />
                            </button>
                        </div>
                    )}
                </div>
            </section>

            <div className={`fixed inset-0 z-[500] ${modalTwinIndex === null ? 'pointer-events-none' : ''}`}>
                <TwinPresetModal
                    twins={releasedTwins}
                    twinIndex={modalTwinIndex}
                    onSelectTwin={setModalTwinIndex}
                    onClose={closeModal}
                />
            </div>
        </div>
    );
}
