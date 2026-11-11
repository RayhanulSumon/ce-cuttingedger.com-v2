import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Eyebrow, Reveal, SectionProps } from './shared';
import { LOOKS } from './looks';

export function TryOnSection({ active }: SectionProps) {
    const [index, setIndex] = useState(0);
    const [pin, setPin] = useState<number | null>(null);
    const look = LOOKS[index];

    return (
        <div className="relative grid h-full w-full grid-cols-1 bg-white pt-20 sm:pt-24 lg:grid-cols-[1fr_380px]">
            <div className="relative flex min-h-0 flex-col px-6 sm:px-14">
                <Reveal active={active}>
                    <Eyebrow>02 / Virtual Try-On</Eyebrow>
                    <h2 className="mt-3 text-[clamp(28px,4.6vw,64px)] font-extrabold leading-[0.95] tracking-[-0.03em] text-[#151413]">
                        Try the Look.
                    </h2>
                    <p className="mt-2 text-sm text-[#66625c]">Six looks, styled head to toe. Tap a pin to see the piece.</p>
                </Reveal>

                <div className="relative mt-3 flex min-h-0 flex-1 items-end justify-center pb-16">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={index}
                            className="relative h-full max-h-[620px] aspect-[9/16]"
                            initial={{ opacity: 0, x: 40 }}
                            animate={active ? { opacity: 1, x: 0 } : { opacity: 0 }}
                            exit={{ opacity: 0, x: -40 }}
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <img src={look.model} alt={look.name} draggable={false} className="h-full w-full object-contain object-bottom" />
                            {look.pins.map((p, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    aria-label={`${i + 1}: ${look.pieces[i].name}`}
                                    onMouseEnter={() => setPin(i)}
                                    onMouseLeave={() => setPin(null)}
                                    onFocus={() => setPin(i)}
                                    onBlur={() => setPin(null)}
                                    style={{ left: `${p.left}%`, top: `${p.top}%` }}
                                    className="absolute grid h-7 w-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#0e0e0e] text-[11px] font-bold text-white shadow-lg ring-4 ring-white/70 transition-transform hover:scale-125"
                                >
                                    {i + 1}
                                    {pin === i && (
                                        <span className="absolute left-9 top-1/2 -translate-y-1/2 whitespace-nowrap rounded bg-[#0e0e0e] px-2.5 py-1 text-xs font-medium">
                                            {look.pieces[i].name}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </motion.div>
                    </AnimatePresence>

                    <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-3">
                        {LOOKS.map((l, i) => (
                            <button
                                key={l.name + i}
                                type="button"
                                onClick={() => setIndex(i)}
                                aria-label={`Look ${i + 1}: ${l.name}`}
                                aria-current={i === index}
                                className="group flex flex-col items-center gap-1.5"
                            >
                                <span className={`h-[3px] rounded-full bg-[#151413] transition-all ${i === index ? 'w-12' : 'w-6 opacity-30 group-hover:opacity-60'}`} />
                                <span className="text-[10px] font-semibold tracking-widest text-[#66625c]">0{i + 1}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <aside className="hidden border-l border-[#c8c8c8] bg-white p-8 lg:block" aria-label="In this look">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#66625c]">In this look</p>
                <p className="mt-2 text-2xl font-bold text-[#151413]">{look.name}</p>
                <p className="text-sm text-[#66625c]">{look.description}</p>
                <ul className="mt-6 space-y-3">
                    {look.pieces.map((p, i) => (
                        <li
                            key={p.name + i}
                            className={`flex items-center gap-4 bg-[#DFDFDF] p-3 transition-all ${pin === i ? 'ring-2 ring-[#0e0e0e]' : ''}`}
                        >
                            <span className="relative h-20 w-20 shrink-0 overflow-hidden bg-white">
                                <img src={p.image} alt="" loading="lazy" className="h-full w-full object-contain" />
                                <span className="absolute left-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-[#0e0e0e] text-[10px] font-bold text-white">
                                    {i + 1}
                                </span>
                            </span>
                            <span className="min-w-0 flex-1">
                                <span className="block text-[10px] uppercase tracking-widest text-[#66625c]">{p.brand}</span>
                                <span className="block truncate text-sm font-semibold text-[#151413]">{p.name}</span>
                            </span>
                            <Plus size={18} className="text-[#151413]" />
                        </li>
                    ))}
                </ul>
            </aside>
        </div>
    );
}

