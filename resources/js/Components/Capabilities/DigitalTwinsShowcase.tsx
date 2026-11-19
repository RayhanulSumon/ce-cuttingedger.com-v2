import React, { useCallback, useMemo, useState } from 'react';
import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { TwinPresetModal } from '@/Components/Landing/DigitalTwins/TwinPresetModal';
import { TwinSpriteCrop } from '@/Components/Landing/DigitalTwins/TwinSpriteCrop';
import { DIGITAL_TWINS, DigitalTwinModel } from '@/Components/Landing/DigitalTwins/twins';
import { digitalTwinOrderUrl, OrderCta, PAD_X } from '@/Components/Landing/shared';
import { Capability } from '@/types/models';

const ALL = 'All';
const PAGE_BACKGROUND = 'linear-gradient(90deg, #f1f5fa 0%, #e7eff6 38%, #eef4f9 62%, #f6f9fc 100%)';

interface DigitalTwinsShowcaseProps {
    capability?: Capability;
    parent?: Capability | null;
    digitalTwins?: DigitalTwinModel[];
}

/**
 * Visual-first Digital Twins showcase with a compact header, inline category filters,
 * minimal model cards and the interactive 6-pose preset modal.
 */
export function DigitalTwinsShowcase({ capability, parent, digitalTwins }: DigitalTwinsShowcaseProps) {
    const allTwins = digitalTwins && digitalTwins.length > 0 ? digitalTwins : DIGITAL_TWINS;
    const [category, setCategory] = useState<string>(ALL);
    const [modalTwinIndex, setModalTwinIndex] = useState<number | null>(null);
    const closeModal = useCallback(() => setModalTwinIndex(null), []);

    const categories = useMemo(() => [ALL, ...Array.from(new Set(allTwins.map((twin) => twin.archetype)))], [allTwins]);
    const twins = category === ALL ? allTwins : allTwins.filter((twin) => twin.archetype === category);

    return (
        <div className="bg-white text-ink">
            <header style={{ background: PAGE_BACKGROUND }} className={`border-b border-ink/10 pb-4 pt-20 sm:pt-24 ${PAD_X}`}>
                <div className="mx-auto max-w-[1440px]">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            {capability && (
                                <Link
                                    href={parent ? `/capabilities/${parent.slug}` : '/capabilities'}
                                    prefetch
                                    className="mb-1.5 inline-flex items-center gap-1.5 text-xs font-medium text-subtle transition-colors hover:text-primary"
                                >
                                    <ArrowLeft size={13} />
                                    {parent ? `Back to ${parent.title}` : 'All capabilities'}
                                </Link>
                            )}
                            <h1 className="font-michroma text-[clamp(22px,2.8vw,34px)] font-normal leading-[1.12] tracking-[0.12em] text-ink">
                                {capability?.title ?? 'Digital Twins'}
                            </h1>
                        </div>

                        <OrderCta href={digitalTwinOrderUrl({ mode: 'custom' })}>Order custom model</OrderCta>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <div
                            role="tablist"
                            aria-label="Filter digital twins by category"
                            className="flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                        >
                            {categories.map((name) => (
                                <button
                                    key={name}
                                    type="button"
                                    role="tab"
                                    aria-selected={category === name}
                                    onClick={() => setCategory(name)}
                                    className={`cursor-pointer whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                                        category === name
                                            ? 'border-ink bg-ink text-white'
                                            : 'border-ink/15 bg-white/85 text-subtle hover:border-primary/60 hover:text-primary'
                                    }`}
                                >
                                    {name}
                                </button>
                            ))}
                        </div>

                        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-subtle">
                            {twins.length} {twins.length === 1 ? 'model' : 'models'}
                        </span>
                    </div>
                </div>
            </header>

            <section className={`py-6 sm:py-8 ${PAD_X}`}>
                <div className="mx-auto max-w-[1440px]">
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-6">
                        {twins.map((twin) => {
                            const [name, style] = twin.name.split(' — ');
                            const fullIdx = allTwins.findIndex(
                                (item) => (item.id && item.id === twin.id) || item.lookNumber === twin.lookNumber,
                            );

                            return (
                                <button
                                    key={twin.id ?? twin.lookNumber}
                                    type="button"
                                    onClick={() => setModalTwinIndex(fullIdx >= 0 ? fullIdx : twin.index)}
                                    aria-label={`View ${name} poses`}
                                    className="group cursor-pointer overflow-hidden rounded-2xl border border-ink/10 bg-white text-left shadow-[0_8px_22px_-16px_color-mix(in_srgb,var(--color-ink)_20%,transparent)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_14px_34px_-16px_color-mix(in_srgb,var(--color-primary)_35%,transparent)]"
                                >
                                    <div className="relative aspect-[3/4] overflow-hidden" style={{ background: PAGE_BACKGROUND }}>
                                        <TwinSpriteCrop
                                            twin={twin}
                                            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.04]"
                                        />
                                        {twin.isCopyrightSold && (
                                            <span className="absolute left-2 top-2 rounded-full bg-red-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-white shadow-[0_6px_14px_-6px_rgba(220,38,38,0.7)]">
                                                Sold out
                                            </span>
                                        )}
                                        <span className="absolute inset-x-2 bottom-2 grid place-items-center rounded-full bg-primary py-1.5 text-[10px] font-bold text-white opacity-0 transition-all duration-300 group-hover:opacity-100">
                                            View poses
                                        </span>
                                    </div>
                                    <div className="flex items-baseline justify-between gap-2 p-3">
                                        <div className="min-w-0">
                                            <h2 className="truncate text-sm font-semibold text-ink">{name}</h2>
                                            <p className="truncate text-[11px] text-subtle">{style || twin.archetype}</p>
                                        </div>
                                        <span className="shrink-0 text-xs font-bold text-ink">{twin.presetPrice}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            <div className={`fixed inset-0 z-[500] ${modalTwinIndex === null ? 'pointer-events-none' : ''}`}>
                <TwinPresetModal
                    twins={allTwins}
                    twinIndex={modalTwinIndex}
                    onSelectTwin={setModalTwinIndex}
                    onClose={closeModal}
                />
            </div>
        </div>
    );
}
