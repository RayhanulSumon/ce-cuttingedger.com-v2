import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useAutoplay } from '@/hooks/useAutoplay';
import { Eyebrow, PAD_X, PillButton, Reveal, SectionProps } from './shared';
import { LOOKS } from './looks';

const SLOT_X = [0, 34, 56, 71, 82, 90];

export function DigitalTwinsSection({ active, openDemo }: SectionProps) {
    const [front, setFront] = useState(0);
    const count = LOOKS.length;
    const [paused, setPaused] = useState(false);
    const go = (delta: number) => setFront((f) => (f + delta + count) % count);
    useAutoplay(() => go(1), active && !paused, 3200);

    return (
        <div className="relative grid h-full w-full grid-rows-[auto_1fr] bg-white pt-20 sm:pt-24">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,#f1f5fa_0%,#e7eff6_38%,#eef4f9_62%,#f6f9fc_100%)]" />

            <div className={`relative z-10 ${PAD_X}`}>
                <Reveal active={active}>
                    <Eyebrow>01 / Digital Twins · AI generated imagery</Eyebrow>
                    <h2 className="mt-3 text-[clamp(28px,4.6vw,64px)] font-extrabold leading-[0.95] tracking-[-0.03em] text-[#16191f]">
                        One shoot.
                        <br />
                        Endless digital twins.
                    </h2>
                </Reveal>
                <Reveal active={active} delay={0.15} className="mt-4 max-w-sm text-sm leading-relaxed text-[#737b86]">
                    Shoot a garment once. We build photoreal AI models and digital twins that wear it in every pose,
                    colourway and market, with no re-shoots.
                </Reveal>
            </div>

            <div
                className="relative z-0 cursor-grab select-none overflow-hidden active:cursor-grabbing"
                onPointerEnter={() => setPaused(true)}
                onPointerLeave={() => setPaused(false)}
                role="region"
                aria-roledescription="carousel"
                aria-label="Digital twin looks"
            >
                <motion.div
                    className="absolute inset-0"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={(_, info) => {
                        if (info.offset.x < -60) go(1);
                        else if (info.offset.x > 60) go(-1);
                    }}
                >
                    {LOOKS.map((look, i) => {
                        const slot = (i - front + count) % count;
                        const scale = 1 - slot * 0.13;
                        return (
                            <motion.button
                                type="button"
                                key={look.name + i}
                                onClick={() => setFront(i)}
                                aria-label={`Show ${look.name}`}
                                className="absolute bottom-[4%] aspect-[9/16] h-[86%] origin-bottom"
                                initial={false}
                                animate={{
                                    left: `${SLOT_X[slot]}%`,
                                    scale,
                                    opacity: active ? (slot > 4 ? 0.2 : 1 - slot * 0.1) : 0,
                                    filter: `blur(${slot === 0 ? 0 : slot * 1.4}px)`,
                                    zIndex: count - slot,
                                }}
                                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <img
                                    src={look.model}
                                    alt={look.name}
                                    draggable={false}
                                    loading="eager"
                                    className="h-full w-full object-contain object-bottom"
                                />
                            </motion.button>
                        );
                    })}
                </motion.div>

                <div className="pointer-events-none absolute bottom-6 left-5 z-20 sm:bottom-8 sm:left-10 lg:left-16">
                    <p className="text-[clamp(24px,3vw,44px)] font-extrabold uppercase tracking-[0.06em] text-[#16191f]">
                        Look {String(front + 1).padStart(2, '0')}
                    </p>
                    <p className="mt-1 text-sm text-[#737b86]">{LOOKS[front].name}</p>
                </div>

                <div className="absolute bottom-6 right-5 z-20 flex items-center gap-3 sm:bottom-8 sm:right-10 lg:right-16">
                    <button
                        type="button"
                        onClick={() => go(-1)}
                        aria-label="Previous look"
                        className="grid h-11 w-11 place-items-center rounded-full border border-[#16191f]/30 bg-white/70 backdrop-blur hover:bg-[#16191f] hover:text-white"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <button
                        type="button"
                        onClick={() => go(1)}
                        aria-label="Next look"
                        className="grid h-11 w-11 place-items-center rounded-full border border-[#16191f]/30 bg-white/70 backdrop-blur hover:bg-[#16191f] hover:text-white"
                    >
                        <ArrowRight size={18} />
                    </button>
                    <span className="hidden sm:block">
                        <PillButton onClick={openDemo}>Create my twin</PillButton>
                    </span>
                </div>
            </div>
        </div>
    );
}

