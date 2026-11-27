import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Crown, Layers, Sparkles } from 'lucide-react';
import { SeoHead } from '@/Components/Common/SeoHead';
import {
    DigitalTwinAttributeItem,
    DigitalTwinModel,
} from '@/Components/Landing/DigitalTwins/twins';
import { PAD_X } from '@/Components/Landing/shared';
import {
    DigitalTwinOrderConfigurator,
    TWIN_STAGE_BACKGROUND,
} from '@/Components/Services/DigitalTwinOrderConfigurator';
import { LandingLayout } from '@/Layouts/LandingLayout';

interface DigitalTwinOrderProps {
    digitalTwins?: DigitalTwinModel[];
    attributes?: DigitalTwinAttributeItem[];
    initialMode?: 'custom' | 'preset' | 'lifetime';
    initialTwinSlug?: string;
    initialReference?: string;
}

export default function DigitalTwinOrder({
    digitalTwins,
    attributes,
    initialMode = 'custom',
    initialTwinSlug = '',
    initialReference = '',
}: DigitalTwinOrderProps) {
    const [mode, setMode] = useState<'custom' | 'preset' | 'lifetime'>(initialMode);
    const [activeTwin, setActiveTwin] = useState<DigitalTwinModel | null>(null);

    return (
        <div className="min-h-screen bg-surface text-ink">
            <SeoHead
                title="Order Digital Twin — Custom AI Model Configurator & Licensing"
                description="Configure a bespoke AI Digital Twin for your fashion brand or license a ready-to-shoot 6-pose preset."
            />

            {/* Header Hero */}
            <section
                style={{ background: TWIN_STAGE_BACKGROUND }}
                className={`border-b border-ink/10 pb-6 pt-24 sm:pt-28 ${PAD_X}`}
            >
                <div className="mx-auto max-w-7xl">
                    <Link
                        href="/capabilities/2d/digital-twins"
                        prefetch
                        className="inline-flex items-center gap-1.5 text-2xs font-bold uppercase tracking-[0.18em] text-subtle transition-colors hover:text-ink"
                    >
                        <ArrowLeft size={13} />
                        Back to Digital Twins
                    </Link>

                    <div className="mt-3 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
                        <div>
                            <p className="text-2xs font-semibold uppercase tracking-[0.22em] text-primary">
                                {mode === 'custom'
                                    ? 'Digital Twin Studio // Custom Order'
                                    : 'Digital Twin Studio // Licensing'}
                            </p>
                            <h1 className="mt-1 font-display text-[clamp(24px,2.8vw,36px)] leading-[1.1] text-ink">
                                {mode === 'custom'
                                    ? 'Customize Your Digital Twin'
                                    : 'Digital Twin Studio Order'}
                            </h1>
                            <p className="mt-1.5 max-w-[58ch] text-xs leading-[1.6] text-subtle sm:text-sm">
                                {mode === 'custom'
                                    ? 'Configure your custom AI brand model specifications and submit your order.'
                                    : 'License an existing studio Digital Twin pose preset or exclusive lifetime copyright.'}
                            </p>
                        </div>

                        {initialMode === 'custom' ? (
                            <div className="inline-flex items-center gap-2 self-start rounded-full border border-ink/10 bg-surface/85 px-4 py-2 text-xs font-semibold text-ink shadow-xs lg:self-end">
                                <Sparkles size={14} className="text-primary" />
                                <span>Bespoke Brand Twin • Delivered within 1 business day</span>
                            </div>
                        ) : (
                            <div
                                role="tablist"
                                aria-label="Digital Twin Order Type"
                                className="inline-flex flex-wrap gap-1.5 rounded-2xl border border-ink/10 bg-surface/90 p-1 shadow-sm"
                            >
                                <button
                                    type="button"
                                    role="tab"
                                    aria-selected={mode === 'preset'}
                                    onClick={() => setMode('preset')}
                                    className={`flex cursor-pointer items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                                        mode === 'preset'
                                            ? 'bg-ink text-white shadow-sm'
                                            : 'text-subtle hover:bg-ink/5 hover:text-ink'
                                    }`}
                                >
                                    <Layers size={13} />
                                    Pose Preset ({activeTwin?.presetPrice ?? '$149'})
                                </button>
                                <button
                                    type="button"
                                    role="tab"
                                    aria-selected={mode === 'lifetime'}
                                    onClick={() => setMode('lifetime')}
                                    className={`flex cursor-pointer items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                                        mode === 'lifetime'
                                            ? 'bg-primary text-primary-foreground shadow-sm'
                                            : 'text-subtle hover:bg-ink/5 hover:text-ink'
                                    }`}
                                >
                                    <Crown size={13} />
                                    Lifetime ({activeTwin?.lifetimePrice ?? '$490'})
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <main className={`py-7 sm:py-10 ${PAD_X}`}>
                <div className="mx-auto max-w-7xl">
                    <DigitalTwinOrderConfigurator
                        digitalTwins={digitalTwins}
                        attributes={attributes}
                        initialMode={initialMode}
                        initialTwinSlug={initialTwinSlug}
                        initialReference={initialReference}
                        mode={mode}
                        onModeChange={setMode}
                        onActiveTwinChange={setActiveTwin}
                    />
                </div>
            </main>
        </div>
    );
}

DigitalTwinOrder.layout = (page: React.ReactNode) => <LandingLayout>{page}</LandingLayout>;
