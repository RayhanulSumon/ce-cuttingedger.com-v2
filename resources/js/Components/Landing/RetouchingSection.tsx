import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { MoveHorizontal, Sparkles } from 'lucide-react';
import { OrderCta, Reveal, SectionProps, STAGE_TRANSITION_MS } from './shared';

interface RetouchFix {
    label: string;
    image: string;
    rawFilter: string;
}

const FIXES: RetouchFix[] = [
    {
        label: 'Dust & lint removal',
        image: '/images/portfolio/portfolio-1.jpg',
        rawFilter: '[filter:contrast(0.7)_brightness(0.82)_saturate(0.45)_sepia(0.35)]',
    },
    {
        label: 'Wrinkle & crease smoothing',
        image: '/images/portfolio/portfolio-2.jpg',
        rawFilter: '[filter:contrast(0.75)_brightness(0.86)_saturate(0.5)_sepia(0.2)]',
    },
    {
        label: 'Ghost mannequin jointing',
        image: '/images/portfolio/portfolio-3.jpg',
        rawFilter: '[filter:contrast(0.72)_brightness(0.84)_saturate(0.4)_sepia(0.28)]',
    },
    {
        label: 'Colour-match to swatch',
        image: '/images/portfolio/portfolio-4.jpg',
        rawFilter: '[filter:contrast(0.74)_brightness(0.85)_saturate(0.35)_hue-rotate(-18deg)]',
    },
    {
        label: 'Shadow & reflection repair',
        image: '/images/portfolio/portfolio-1.jpg',
        rawFilter: '[filter:contrast(0.68)_brightness(0.78)_saturate(0.5)_sepia(0.25)]',
    },
    {
        label: 'Skin & fabric texture',
        image: '/images/portfolio/portfolio-2.jpg',
        rawFilter: '[filter:contrast(0.76)_brightness(0.84)_saturate(0.45)_sepia(0.3)]',
    },
];

/** Divider position (%) the comparison rests at, and where it sweeps in from on entry. */
const REST_POSITION = 52;
const ENTRY_POSITION = 96;
const KEY_STEP = 4;

const clampPercent = (value: number) => Math.max(0, Math.min(100, value));

/** Draggable before / after comparison. Sweeps open each time the section becomes active or the preset changes. */
function BeforeAfter({ active, fix }: { active: boolean; fix: RetouchFix }) {
    const [position, setPosition] = useState(ENTRY_POSITION);
    const [dragging, setDragging] = useState(false);
    const posRef = useRef(ENTRY_POSITION);
    const box = useRef<HTMLDivElement>(null);
    const clipRef = useRef<HTMLDivElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);

    const applyPosition = useCallback((next: number, instant: boolean) => {
        posRef.current = next;
        const transition = instant ? 'none' : '';
        if (clipRef.current) {
            clipRef.current.style.transition = transition;
            clipRef.current.style.clipPath = `inset(0 ${100 - next}% 0 0)`;
        }
        if (lineRef.current) {
            lineRef.current.style.transition = transition;
            lineRef.current.style.left = `${next}%`;
        }
    }, []);

    useEffect(() => {
        if (!active) {
            const reset = window.setTimeout(() => {
                applyPosition(ENTRY_POSITION, false);
                setPosition(ENTRY_POSITION);
            }, STAGE_TRANSITION_MS);
            return () => window.clearTimeout(reset);
        }
        applyPosition(ENTRY_POSITION, true);
        setPosition(ENTRY_POSITION);
        const sweep = window.setTimeout(() => {
            applyPosition(REST_POSITION, false);
            setPosition(REST_POSITION);
        }, STAGE_TRANSITION_MS * 0.45);
        return () => window.clearTimeout(sweep);
    }, [active, fix.label, applyPosition]);

    const moveTo = useCallback(
        (clientX: number) => {
            const rect = box.current?.getBoundingClientRect();
            if (rect?.width) {
                applyPosition(clampPercent(((clientX - rect.left) / rect.width) * 100), true);
            }
        },
        [applyPosition],
    );

    const endDrag = () => {
        if (!dragging) {
            return;
        }
        setDragging(false);
        setPosition(posRef.current);
    };

    // Follow the pointer 1:1 via direct DOM writes while dragging; glide for the entry sweep and keyboard steps.
    const glide = dragging ? '' : 'duration-[1100ms] ease-[cubic-bezier(0.65,0,0.35,1)]';

    return (
        <div>
            <div
                ref={box}
                className="relative mx-auto aspect-[4/3] max-h-[62vh] w-full cursor-ew-resize touch-none select-none overflow-hidden rounded-[28px] border border-ink/10 bg-surface-3 shadow-[0_28px_60px_-24px_rgba(17,19,24,0.35)]"
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
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                role="slider"
                aria-label={`Before and after retouching comparison for ${fix.label}`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(position)}
                tabIndex={0}
                onKeyDown={(event) => {
                    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                        event.preventDefault();
                        const next = clampPercent(posRef.current + (event.key === 'ArrowLeft' ? -KEY_STEP : KEY_STEP));
                        applyPosition(next, false);
                        setPosition(next);
                    }
                }}
            >
                <img src={fix.image} alt={`${fix.label} — delivered result`} draggable={false} className="absolute inset-0 h-full w-full object-cover" />
                <div
                    ref={clipRef}
                    className={`absolute inset-0 will-change-[clip-path] transition-[clip-path] ${glide}`}
                    style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
                >
                    <img
                        src={fix.image}
                        alt={`${fix.label} — raw capture`}
                        draggable={false}
                        className={`h-full w-full object-cover ${fix.rawFilter}`}
                    />
                </div>
                <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-black/65 px-3 py-1 text-2xs font-semibold uppercase tracking-widest text-white">
                    Raw
                </span>
                <span className="pointer-events-none absolute right-4 top-4 rounded-full bg-surface/90 px-3 py-1 text-2xs font-semibold uppercase tracking-widest text-ink">
                    Delivered
                </span>
                <div ref={lineRef} className={`pointer-events-none absolute inset-y-0 w-0.5 bg-surface will-change-[left] transition-[left] ${glide}`} style={{ left: `${position}%` }}>
                    <span className="absolute top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-surface text-ink shadow-xl">
                        <MoveHorizontal size={20} />
                    </span>
                </div>
            </div>
            <p className="mt-3 text-center text-xs font-medium text-subtle">
                {fix.label} · Drag or click anywhere to compare
            </p>
        </div>
    );
}

export const RetouchingSection = memo(function RetouchingSection({ active }: SectionProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const activeFix = FIXES[selectedIndex] ?? FIXES[0];

    return (
        <div
            data-scrollable
            className="grid h-full w-full grid-cols-1 items-center gap-8 overflow-y-auto bg-page px-5 pb-10 pt-24 sm:px-10 sm:pt-28 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:px-16 lg:pb-8 lg:pt-28"
        >
            <div>
                <Reveal active={active}>
                    <h2 className="text-section text-ink">Photo Retouching</h2>
                </Reveal>
                <Reveal active={active} delay={0.16}>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-muted sm:text-base">
                        AI finds the artifacts. Senior retouchers finish them. Pick a specialty or drag the handle to
                        compare the raw capture with the delivered file.
                    </p>
                </Reveal>
                <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Retouching specialties">
                    {FIXES.map((fix, i) => {
                        const isSelected = i === selectedIndex;
                        return (
                            <Reveal key={fix.label} as="span" active={active} delay={0.22 + i * 0.04} y="14px">
                                <button
                                    type="button"
                                    role="tab"
                                    aria-selected={isSelected}
                                    onClick={() => setSelectedIndex(i)}
                                    className={`cursor-pointer rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                                        isSelected
                                            ? 'border-ink bg-ink text-white shadow-sm'
                                            : 'border-ink/20 bg-surface text-ink hover:border-ink/50'
                                    }`}
                                >
                                    {fix.label}
                                </button>
                            </Reveal>
                        );
                    })}
                </div>

                <Reveal active={active} delay={0.38} className="mt-7">
                    <OrderCta href="/contact" icon={<Sparkles size={16} />}>
                        Request Retouching Quote
                    </OrderCta>
                </Reveal>
            </div>

            <Reveal active={active} delay={0.12} className="min-h-0">
                <BeforeAfter active={active} fix={activeFix} />
            </Reveal>
        </div>
    );
});
