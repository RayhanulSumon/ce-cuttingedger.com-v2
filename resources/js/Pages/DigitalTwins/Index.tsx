import React, { useMemo, useState } from 'react';
import { SeoHead } from '@/Components/Common/SeoHead';
import { PageHero } from '@/Components/Common/PageHero';
import { TwinSpriteCrop } from '@/Components/Landing/DigitalTwins/TwinSpriteCrop';
import { DIGITAL_TWINS } from '@/Components/Landing/DigitalTwins/twins';
import { orderUrl } from '@/Components/Landing/shared';
import { ArrowUpRight } from 'lucide-react';

const ALL = 'All';

export default function DigitalTwinsIndex() {
    const [category, setCategory] = useState<string>(ALL);

    const categories = useMemo(() => [ALL, ...Array.from(new Set(DIGITAL_TWINS.map((twin) => twin.archetype)))], []);
    const twins = category === ALL ? DIGITAL_TWINS : DIGITAL_TWINS.filter((twin) => twin.archetype === category);

    return (
        <>
            <SeoHead
                title="Digital Twins — AI Fashion Models"
                description="Browse every photoreal AI digital twin. Filter by style and order a model for your next collection."
            />

            <PageHero
                compact={true}
                eyebrow="DIGITAL TWINS"
                title="Every model,"
                highlight="every look."
                description="Photoreal AI models that wear your garments in any pose, light and angle. Filter by style and pick your twin."
            />

            <section
                style={{ top: 'var(--header-height)' }}
                className="sticky z-30 border-b border-white/10 bg-[#0c0d12]/90 py-5 backdrop-blur-xl"
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div role="tablist" aria-label="Filter digital twins by category" className="scrollbar-none flex items-center gap-2 overflow-x-auto">
                        {categories.map((name) => (
                            <button
                                key={name}
                                type="button"
                                role="tab"
                                aria-selected={category === name}
                                onClick={() => setCategory(name)}
                                className={`cursor-pointer whitespace-nowrap rounded-full border px-5 py-2.5 font-mono text-xs uppercase tracking-wider transition-all ${
                                    category === name
                                        ? 'border-accent bg-accent font-bold text-black'
                                        : 'border-white/5 bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                {name}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-[#0a0b0e] py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <p className="mb-8 font-mono text-xs uppercase tracking-widest text-neutral-500">
                        {twins.length} {twins.length === 1 ? 'model' : 'models'}
                    </p>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {twins.map((twin) => {
                            const [name, style] = twin.name.split(' — ');

                            return (
                                <a
                                    key={twin.lookNumber}
                                    href={orderUrl('digital-twins', twin.name)}
                                    className="group overflow-hidden rounded-3xl border border-white/10 bg-[#12141c] transition-all duration-300 hover:-translate-y-1 hover:border-accent/40"
                                >
                                    <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-b from-[#eef3f9] to-[#dde7f2]">
                                        <TwinSpriteCrop
                                            twin={twin}
                                            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                                        />
                                        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-[#16191f]">
                                            {twin.archetype}
                                        </span>
                                    </div>
                                    <div className="space-y-3 p-6">
                                        <div>
                                            <h3 className="font-display text-xl font-bold text-white">{name}</h3>
                                            <p className="text-sm text-neutral-400">{style}</p>
                                        </div>
                                        <p className="font-mono text-[11px] uppercase tracking-wider text-neutral-500">{twin.collection}</p>
                                        <div className="flex items-center justify-between pt-1">
                                            <span className="text-sm text-neutral-300">
                                                {twin.poses.length} poses · from <span className="font-bold text-white">{twin.presetPrice}</span>
                                            </span>
                                            <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-accent">
                                                Order
                                                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                                            </span>
                                        </div>
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                </div>
            </section>
        </>
    );
}
