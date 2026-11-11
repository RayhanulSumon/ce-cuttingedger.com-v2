import React, { useCallback, useRef, useState } from 'react';
import { MoveHorizontal } from 'lucide-react';
import { Eyebrow, Reveal, SectionProps } from './shared';

const IMAGE = '/images/portfolio/portfolio-1.jpg';
const FIXES = ['Dust & lint removal', 'Wrinkle & crease smoothing', 'Ghost mannequin jointing', 'Colour-match to swatch', 'Shadow & reflection repair', 'Skin & fabric texture'];

export function RetouchingSection({ active }: SectionProps) {
    const [pos, setPos] = useState(52);
    const box = useRef<HTMLDivElement>(null);

    const move = useCallback((clientX: number) => {
        const rect = box.current?.getBoundingClientRect();
        if (!rect) {
            return;
        }
        setPos(Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)));
    }, []);

    return (
        <div data-scrollable className="overflow-y-auto grid h-full w-full grid-cols-1 items-center gap-8 bg-[#f2f2f1] px-5 pb-8 pt-24 sm:px-10 lg:px-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
                <Reveal active={active}>
                    <Eyebrow>03 / Retouching · Artifact remedy</Eyebrow>
                    <h2 className="mt-3 text-[clamp(28px,4.6vw,64px)] font-extrabold leading-[0.95] tracking-[-0.03em] text-[#1d1d1d]">
                        Every flaw,
                        <br />
                        quietly fixed.
                    </h2>
                    <p className="mt-4 max-w-md text-sm leading-relaxed text-[#3a3a3a]">
                        AI finds the artifacts. Senior retouchers finish them. Drag the handle to compare the raw capture
                        with the delivered file.
                    </p>
                </Reveal>
                <Reveal active={active} delay={0.15} className="mt-6 flex flex-wrap gap-2">
                    {FIXES.map((fix) => (
                        <span key={fix} className="rounded-full border border-[#1d1d1d]/20 bg-white px-4 py-2 text-xs font-medium text-[#1d1d1d]">
                            {fix}
                        </span>
                    ))}
                </Reveal>
            </div>

            <Reveal active={active} delay={0.1} className="min-h-0">
                <div
                    ref={box}
                    className="relative mx-auto aspect-[4/3] max-h-[62vh] w-full cursor-ew-resize touch-none select-none overflow-hidden rounded-[28px] bg-[#d8d3cf] shadow-2xl"
                    onPointerDown={(e) => {
                        e.currentTarget.setPointerCapture(e.pointerId);
                        move(e.clientX);
                    }}
                    onPointerMove={(e) => {
                        if (e.buttons) {
                            move(e.clientX);
                        }
                    }}
                    role="slider"
                    aria-label="Before and after retouching comparison"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(pos)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'ArrowLeft') setPos((p) => Math.max(0, p - 4));
                        if (e.key === 'ArrowRight') setPos((p) => Math.min(100, p + 4));
                    }}
                >
                    <img src={IMAGE} alt="Retouched result" draggable={false} className="absolute inset-0 h-full w-full object-cover" />
                    <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
                        <img
                            src={IMAGE}
                            alt="Raw capture"
                            draggable={false}
                            className="h-full w-full object-cover [filter:contrast(0.7)_brightness(0.82)_saturate(0.45)_sepia(0.35)_blur(0.6px)]"
                        />
                    </div>
                    <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white">Raw</span>
                    <span className="absolute right-4 top-4 rounded-full bg-white/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-black">Delivered</span>
                    <div className="absolute inset-y-0 w-0.5 bg-white" style={{ left: `${pos}%` }}>
                        <span className="absolute top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-[#1d1d1d] shadow-xl">
                            <MoveHorizontal size={20} />
                        </span>
                    </div>
                </div>
            </Reveal>
        </div>
    );
}

