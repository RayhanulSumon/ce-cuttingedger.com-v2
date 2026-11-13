import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { MoveHorizontal } from 'lucide-react';
import { Eyebrow, Reveal, SectionProps, STAGE_TRANSITION_MS } from './shared';

const IMAGE = '/images/portfolio/portfolio-1.jpg';
const FIXES = [
    'Dust & lint removal',
    'Wrinkle & crease smoothing',
    'Ghost mannequin jointing',
    'Colour-match to swatch',
    'Shadow & reflection repair',
    'Skin & fabric texture',
];

/** Divider position (%) the comparison rests at, and where it sweeps in from on entry. */
const REST_POSITION = 52;
const ENTRY_POSITION = 96;
const KEY_STEP = 4;

const clampPercent = (value: number) => Math.max(0, Math.min(100, value));

/** Draggable before / after comparison. Sweeps open each time the section becomes active. */
function BeforeAfter({ active }: { active: boolean }) {
    const [position, setPosition] = useState(ENTRY_POSITION);
    const [dragging, setDragging] = useState(false);
    const box = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!active) {
            const reset = window.setTimeout(() => setPosition(ENTRY_POSITION), STAGE_TRANSITION_MS);
            return () => window.clearTimeout(reset);
        }
        const sweep = window.setTimeout(() => setPosition(REST_POSITION), STAGE_TRANSITION_MS * 0.7);
        return () => window.clearTimeout(sweep);
    }, [active]);

    const moveTo = useCallback((clientX: number) => {
        const rect = box.current?.getBoundingClientRect();
        if (rect?.width) {
            setPosition(clampPercent(((clientX - rect.left) / rect.width) * 100));
        }
    }, []);

    // Follow the pointer 1:1 while dragging; glide for the entry sweep and keyboard steps.
    const glide = dragging ? '' : 'duration-[1100ms] ease-[cubic-bezier(0.65,0,0.35,1)]';

    return (
        <div
            ref={box}
            className="relative mx-auto aspect-[4/3] max-h-[62vh] w-full cursor-ew-resize touch-none select-none overflow-hidden rounded-[28px] bg-[#d8d3cf] shadow-2xl"
            onPointerDown={(event) => {
                event.currentTarget.setPointerCapture(event.pointerId);
                setDragging(true);
                moveTo(event.clientX);
            }}
            onPointerMove={(event) => {
                if (dragging) {
                    moveTo(event.clientX);
                }
            }}
            onPointerUp={() => setDragging(false)}
            onPointerCancel={() => setDragging(false)}
            role="slider"
            aria-label="Before and after retouching comparison"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(position)}
            tabIndex={0}
            onKeyDown={(event) => {
                if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                    event.preventDefault();
                    setPosition((current) => clampPercent(current + (event.key === 'ArrowLeft' ? -KEY_STEP : KEY_STEP)));
                }
            }}
        >
            <img src={IMAGE} alt="Retouched result" draggable={false} className="absolute inset-0 h-full w-full object-cover" />
            <div
                className={`absolute inset-0 transition-[clip-path] ${glide}`}
                style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
            >
                <img
                    src={IMAGE}
                    alt="Raw capture"
                    draggable={false}
                    className="h-full w-full object-cover [filter:contrast(0.7)_brightness(0.82)_saturate(0.45)_sepia(0.35)_blur(0.6px)]"
                />
            </div>
            <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white">
                Raw
            </span>
            <span className="absolute right-4 top-4 rounded-full bg-white/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-black">
                Delivered
            </span>
            <div className={`absolute inset-y-0 w-0.5 bg-white transition-[left] ${glide}`} style={{ left: `${position}%` }}>
                <span className="absolute top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-ink shadow-xl">
                    <MoveHorizontal size={20} />
                </span>
            </div>
        </div>
    );
}

export const RetouchingSection = memo(function RetouchingSection({ active }: SectionProps) {
    return (
        <div
            data-scrollable
            className="grid h-full w-full grid-cols-1 items-center gap-8 overflow-y-auto bg-page px-5 pb-8 pt-24 sm:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:px-16"
        >
            <div>
                <Reveal active={active}>
                    <Eyebrow>Retouching · Artifact remedy</Eyebrow>
                </Reveal>
                <Reveal active={active} delay={0.08}>
                    <h2 className="mt-3 text-[clamp(28px,4.6vw,64px)] font-extrabold leading-[0.95] tracking-[-0.03em] text-ink">
                        Every flaw,
                        <br />
                        quietly fixed.
                    </h2>
                </Reveal>
                <Reveal active={active} delay={0.16}>
                    <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-2">
                        AI finds the artifacts. Senior retouchers finish them. Drag the handle to compare the raw capture
                        with the delivered file.
                    </p>
                </Reveal>
                <div className="mt-6 flex flex-wrap gap-2">
                    {FIXES.map((fix, i) => (
                        <Reveal
                            key={fix}
                            as="span"
                            active={active}
                            delay={0.26 + i * 0.05}
                            y="14px"
                            className="rounded-full border border-ink/20 bg-white px-4 py-2 text-xs font-medium text-ink"
                        >
                            {fix}
                        </Reveal>
                    ))}
                </div>
            </div>

            <Reveal active={active} delay={0.12} className="min-h-0">
                <BeforeAfter active={active} />
            </Reveal>
        </div>
    );
});
