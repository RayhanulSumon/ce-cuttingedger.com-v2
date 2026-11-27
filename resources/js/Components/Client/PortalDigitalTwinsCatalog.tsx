import React, { useCallback, useMemo, useState } from 'react';
import { Clock } from 'lucide-react';
import { TwinPresetModal } from '@/Components/Landing/DigitalTwins/TwinPresetModal';
import { TwinSpriteCrop } from '@/Components/Landing/DigitalTwins/TwinSpriteCrop';
import { DIGITAL_TWINS, DigitalTwinModel } from '@/Components/Landing/DigitalTwins/twins';
import { TWIN_STAGE_BACKGROUND } from '@/Components/Services/DigitalTwinOrderConfigurator';

const ALL = 'All';
const UPCOMING = 'Coming Soon';

function isUpcomingTwin(twin: DigitalTwinModel): boolean {
    return (
        Boolean(twin.isUpcoming) ||
        twin.archetype.trim().toLowerCase() === 'upcoming' ||
        twin.archetype.trim().toLowerCase() === 'coming soon'
    );
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

interface PortalDigitalTwinsCatalogProps {
    digitalTwins?: DigitalTwinModel[];
    onCustomizeTwin: (twin: DigitalTwinModel) => void;
}

/**
 * In-portal Studio Digital Twins catalog using the exact same TwinSpriteCrop cards and TwinPresetModal
 * as the public frontend. Clicking "Customize a model like {name}" jumps straight into the
 * in-portal DigitalTwinOrderConfigurator with that twin selected.
 */
export function PortalDigitalTwinsCatalog({
    digitalTwins,
    onCustomizeTwin,
}: PortalDigitalTwinsCatalogProps) {
    const allTwins = useMemo(
        () => (digitalTwins && digitalTwins.length > 0 ? digitalTwins : DIGITAL_TWINS),
        [digitalTwins]
    );
    const releasedTwins = useMemo(
        () => allTwins.filter((twin) => !isUpcomingTwin(twin)),
        [allTwins]
    );

    const [category, setCategory] = useState<string>(ALL);
    const [modalTwinIndex, setModalTwinIndex] = useState<number | null>(null);

    const closeModal = useCallback(() => setModalTwinIndex(null), []);

    const categories = useMemo(() => {
        const present = new Set(allTwins.map(categoryOf));
        const standard = ['Female', 'Male', 'Kids'];
        const extra = Array.from(present).filter((name) => !standard.includes(name) && name !== UPCOMING);
        const ordered = [...standard.filter((name) => present.has(name)), ...extra];
        if (present.has(UPCOMING)) {
            ordered.push(UPCOMING);
        }
        return [ALL, ...ordered];
    }, [allTwins]);

    const visibleTwins = useMemo(
        () => (category === ALL ? allTwins : allTwins.filter((twin) => categoryOf(twin) === category)),
        [allTwins, category]
    );

    const handleCardClick = (twin: DigitalTwinModel) => {
        if (isUpcomingTwin(twin)) {
            return;
        }
        const idx = releasedTwins.findIndex((item) => twinKey(item) === twinKey(twin));
        setModalTwinIndex(idx >= 0 ? idx : 0);
    };

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div
                    role="tablist"
                    aria-label="Filter digital twins by category"
                    className="flex items-center gap-2 overflow-x-auto py-0.5"
                >
                    {categories.map((name) => {
                        const isSelected = category === name;
                        return (
                            <button
                                key={name}
                                type="button"
                                role="tab"
                                aria-selected={isSelected}
                                onClick={() => setCategory(name)}
                                className={`cursor-pointer whitespace-nowrap rounded-full border px-4 py-1.5 text-xs font-semibold transition-all ${
                                    isSelected
                                        ? 'border-ink bg-ink text-white shadow-xs'
                                        : 'border-line bg-surface text-subtle hover:border-primary/60 hover:text-primary'
                                }`}
                            >
                                {name}
                            </button>
                        );
                    })}
                </div>

                <span className="text-2xs font-semibold uppercase tracking-[0.16em] text-subtle">
                    {visibleTwins.length} {visibleTwins.length === 1 ? 'model' : 'models'}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {visibleTwins.map((twin) => {
                    const [name, style] = twin.name.split(' — ');
                    const upcoming = isUpcomingTwin(twin);
                    const key = twinKey(twin);

                    return (
                        <button
                            key={key}
                            type="button"
                            onClick={() => handleCardClick(twin)}
                            disabled={upcoming}
                            className={`group overflow-hidden rounded-2xl border border-line bg-surface text-left shadow-xs transition-all duration-300 ${
                                upcoming
                                    ? 'cursor-not-allowed opacity-75'
                                    : 'cursor-pointer hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md'
                            }`}
                        >
                            <div
                                className="relative aspect-[3/4] overflow-hidden"
                                style={{ background: TWIN_STAGE_BACKGROUND }}
                            >
                                <TwinSpriteCrop
                                    twin={twin}
                                    className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.04]"
                                />
                                {upcoming ? (
                                    <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-ink px-2.5 py-1 text-2xs font-bold uppercase tracking-[0.1em] text-white">
                                        <Clock size={10} />
                                        Coming Soon
                                    </span>
                                ) : (
                                    twin.isCopyrightSold && (
                                        <span className="absolute left-2 top-2 rounded-full bg-danger px-2.5 py-1 text-2xs font-bold uppercase tracking-[0.1em] text-white">
                                            Sold out
                                        </span>
                                    )
                                )}
                                {!upcoming && (
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:bg-black/15 group-hover:opacity-100 backdrop-blur-[1px]">
                                        <span className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground shadow-lg">
                                            View Poses
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-baseline justify-between gap-2 p-3">
                                <div className="min-w-0">
                                    <h3 className="truncate text-sm font-semibold text-ink">{name}</h3>
                                    <p className="truncate text-2xs text-subtle">
                                        {style || categoryOf(twin)}
                                    </p>
                                </div>
                                <span className="shrink-0 text-xs font-bold text-ink">
                                    {upcoming ? 'Soon' : twin.presetPrice}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>

            <div className={`fixed inset-0 z-[500] ${modalTwinIndex === null ? 'pointer-events-none' : ''}`}>
                <TwinPresetModal
                    twins={releasedTwins}
                    twinIndex={modalTwinIndex}
                    onSelectTwin={setModalTwinIndex}
                    onClose={closeModal}
                    onCustomizeTwin={(twin) => {
                        setModalTwinIndex(null);
                        onCustomizeTwin(twin);
                    }}
                />
            </div>
        </div>
    );
}
