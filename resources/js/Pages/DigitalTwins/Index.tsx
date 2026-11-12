import React, { useCallback, useMemo, useState } from 'react';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { SeoHead } from '@/Components/Common/SeoHead';
import { DemoModal } from '@/Components/Landing/DemoModal';
import { TwinPresetModal } from '@/Components/Landing/DigitalTwins/TwinPresetModal';
import { TwinSpriteCrop } from '@/Components/Landing/DigitalTwins/TwinSpriteCrop';
import { DIGITAL_TWINS } from '@/Components/Landing/DigitalTwins/twins';
import { PAD_X } from '@/Components/Landing/shared';

const ALL = 'All';

const PAGE_BACKGROUND = 'linear-gradient(90deg, #f1f5fa 0%, #e7eff6 38%, #eef4f9 62%, #f6f9fc 100%)';

/** Digital Twins catalogue — every model in a filterable grid, styled like the homepage. */
export default function DigitalTwinsIndex() {
    const [category, setCategory] = useState<string>(ALL);
    const [demoOpen, setDemoOpen] = useState(false);
    const [modalTwinIndex, setModalTwinIndex] = useState<number | null>(null);
    const closeModal = useCallback(() => setModalTwinIndex(null), []);
    const closeDemo = useCallback(() => setDemoOpen(false), []);

    const categories = useMemo(() => [ALL, ...Array.from(new Set(DIGITAL_TWINS.map((twin) => twin.archetype)))], []);
    const twins = category === ALL ? DIGITAL_TWINS : DIGITAL_TWINS.filter((twin) => twin.archetype === category);

    return (
        <div className="min-h-screen bg-white text-[#16191f]">
            <SeoHead
                title="Digital Twins — AI Fashion Models"
                description="Browse every photoreal AI digital twin. Filter by style and order a model for your next collection."
            />

            <header className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between bg-white/80 py-4 text-sm font-medium backdrop-blur-md ${PAD_X}`}>
                <Link href="/" className="text-base font-extrabold tracking-[-0.04em]" aria-label="CuttingEdger home">
                    CUTTING  EDGER
                </Link>
                <div className="flex items-center gap-3">
                    <Link
                        href="/"
                        className="hidden items-center gap-2 rounded-full border border-[#16191f]/15 bg-white px-4 py-2.5 text-xs font-semibold transition-colors hover:border-[#f5761a]/60 hover:text-[#f5761a] sm:inline-flex"
                    >
                        <ArrowLeft size={14} />
                        Back to home
                    </Link>
                    <button
                        type="button"
                        onClick={() => setDemoOpen(true)}
                        className="rounded-full bg-[#1b1b1b] px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#333]"
                    >
                        Book a Demo
                    </button>
                </div>
            </header>

            <section style={{ background: PAGE_BACKGROUND }} className={`pb-14 pt-32 sm:pt-36 ${PAD_X}`}>
                <h1 className="font-michroma text-[clamp(26px,3.4vw,48px)] font-normal leading-[1.15] tracking-[0.14em]">
                    Digital Twins
                </h1>
                <p className="mt-4 max-w-[52ch] text-sm leading-[1.6] text-[#5d6572] sm:text-base">
                    Shoot a garment once. Our photoreal AI models wear it in every pose, light and angle. Filter by style and pick your twin.
                </p>
            </section>

            <div className={`sticky top-[64px] z-30 border-y border-[#16191f]/10 bg-white/85 py-4 backdrop-blur-md ${PAD_X}`}>
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
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="mt-14 flex justify-center">
                    <button
                        type="button"
                        onClick={() => setDemoOpen(true)}
                        className="group inline-flex items-center gap-3 rounded-full border border-[#16191f]/15 bg-white p-1.5 pl-4 shadow-[0_10px_28px_-10px_rgba(22,25,31,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#f5761a]/60"
                    >
                        <span className="flex items-center gap-2 text-sm font-semibold">
                            <Sparkles size={14} className="text-[#f5761a]" />
                            Want a custom model?
                        </span>
                        <span className="rounded-full bg-[#f5761a] px-3.5 py-1.5 text-xs font-bold text-white">Talk to us</span>
                    </button>
                </div>
            </main>

            <div className={`fixed inset-0 z-[500] ${modalTwinIndex === null ? 'pointer-events-none' : ''}`}>
                <TwinPresetModal
                    twinIndex={modalTwinIndex}
                    onSelectTwin={setModalTwinIndex}
                    onClose={closeModal}
                    openDemo={() => setDemoOpen(true)}
                />
            </div>

            <DemoModal open={demoOpen} onClose={closeDemo} />
        </div>
    );
}

DigitalTwinsIndex.layout = (page: React.ReactNode) => page;
