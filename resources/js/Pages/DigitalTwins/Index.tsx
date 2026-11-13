import React, { useCallback, useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import { SeoHead } from '@/Components/Common/SeoHead';
import { TwinPresetModal } from '@/Components/Landing/DigitalTwins/TwinPresetModal';
import { TwinSpriteCrop } from '@/Components/Landing/DigitalTwins/TwinSpriteCrop';
import { DIGITAL_TWINS, formatDownloadCount, formatTwinAge } from '@/Components/Landing/DigitalTwins/twins';
import { OrderCta, orderUrl, PAD_X } from '@/Components/Landing/shared';
import { LandingLayout } from '@/Layouts/LandingLayout';

const ALL = 'All';

const PAGE_BACKGROUND = 'linear-gradient(90deg, #f1f5fa 0%, #e7eff6 38%, #eef4f9 62%, #f6f9fc 100%)';

/** Digital Twins catalogue — every model in a filterable grid, styled like the homepage. */
export default function DigitalTwinsIndex() {
    const [category, setCategory] = useState<string>(ALL);
    const [modalTwinIndex, setModalTwinIndex] = useState<number | null>(null);
    const closeModal = useCallback(() => setModalTwinIndex(null), []);

    const categories = useMemo(() => [ALL, ...Array.from(new Set(DIGITAL_TWINS.map((twin) => twin.archetype)))], []);
    const twins = category === ALL ? DIGITAL_TWINS : DIGITAL_TWINS.filter((twin) => twin.archetype === category);

    return (
        <div className="bg-white text-[#16191f]">
            <SeoHead
                title="Digital Twins — AI Fashion Models"
                description="Browse every photoreal AI digital twin. Filter by style and order a model for your next collection."
            />

            <section style={{ background: PAGE_BACKGROUND }} className={`pb-14 pt-28 sm:pt-32 ${PAD_X}`}>
                <h1 className="font-michroma text-[clamp(26px,3.4vw,48px)] font-normal leading-[1.15] tracking-[0.14em]">
                    Digital Twins
                </h1>
                <p className="mt-4 max-w-[52ch] text-sm leading-[1.6] text-[#5d6572] sm:text-base">
                    Shoot a garment once. Our photoreal AI models wear it in every pose, light and angle. Filter by style and pick your twin.
                </p>
            </section>

            <div className={`border-y border-[#16191f]/10 bg-white/85 py-4 ${PAD_X}`}>
                <div role="tablist" aria-label="Filter digital twins by category" className="flex [scrollbar-width:none] [&::-webkit-scrollbar]:hidden items-center gap-2 overflow-x-auto">
                    {categories.map((name) => (
                        <button
                            key={name}
                            type="button"
                            role="tab"
                            aria-selected={category === name}
                            onClick={() => setCategory(name)}
                            className={`cursor-pointer whitespace-nowrap rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-300 ${
                                category === name
                                    ? 'border-[#16191f] bg-[#16191f] text-white'
                                    : 'border-[#16191f]/15 bg-white text-[#5d6572] hover:border-[#f5761a]/60 hover:text-[#f5761a]'
                            }`}
                        >
                            {name}
                        </button>
                    ))}
                </div>
            </div>

            <main className={`py-10 sm:py-14 ${PAD_X}`}>
                <p className="mb-8 text-xs font-semibold uppercase tracking-[0.18em] text-[#5d6572]">
                    {twins.length} {twins.length === 1 ? 'model' : 'models'}
                </p>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-6">
                    {twins.map((twin) => {
                        const [name, style] = twin.name.split(' — ');

                        return (
                            <button
                                key={twin.lookNumber}
                                type="button"
                                onClick={() => setModalTwinIndex(twin.index)}
                                aria-label={`View ${name} poses`}
                                className="group cursor-pointer overflow-hidden rounded-2xl border border-[#16191f]/10 bg-white text-left shadow-[0_8px_22px_-16px_rgba(22,25,31,0.2)] transition-all duration-300 hover:-translate-y-1 hover:border-[#f5761a]/50 hover:shadow-[0_14px_34px_-16px_rgba(245,118,26,0.35)]"
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
                                    <span className="absolute inset-x-2 bottom-2 grid place-items-center rounded-full bg-[#f5761a] py-1.5 text-[10px] font-bold text-white opacity-0 transition-all duration-300 group-hover:opacity-100">
                                        View poses
                                    </span>
                                </div>
                                <div className="space-y-0.5 p-3">
                                    <h3 className="truncate text-sm font-semibold">{name}</h3>
                                    <p className="truncate text-[11px] text-[#5d6572]">{style}</p>
                                    <p className="pt-1 text-[11px] text-[#5d6572]">
                                        from <span className="font-bold text-[#16191f]">{twin.presetPrice}</span>
                                    </p>
                                    {!twin.isCopyrightSold && (
<>
                                        <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-[#f6f8fb] px-2.5 py-1 ring-1 ring-[#16191f]/10">
                                            <span className="inline-flex items-center gap-1 text-xs font-extrabold leading-none text-[#16191f]">
                                                <Download size={12} strokeWidth={2.5} className="text-[#f5761a]" />
                                                {formatDownloadCount(twin.downloadCount)}
                                            </span>
                                            <span className="text-[10px] font-medium text-[#5d6572]">downloads</span>
                                        </div>
                                        <p className="pt-1.5 text-[11px] text-[#5d6572]">{formatTwinAge(twin.listedAt)} old</p>
</>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="mt-14 flex flex-col items-center gap-3 text-center">
                    <p className="text-sm font-semibold sm:text-base">Want a custom model?</p>
                    <OrderCta href={orderUrl('digital-twins')}>Order now</OrderCta>
                </div>
            </main>

            <div className={`fixed inset-0 z-[500] ${modalTwinIndex === null ? 'pointer-events-none' : ''}`}>
                <TwinPresetModal
                    twinIndex={modalTwinIndex}
                    onSelectTwin={setModalTwinIndex}
                    onClose={closeModal}
                />
            </div>

        </div>
    );
}

DigitalTwinsIndex.layout = (page: React.ReactNode) => <LandingLayout>{page}</LandingLayout>;
