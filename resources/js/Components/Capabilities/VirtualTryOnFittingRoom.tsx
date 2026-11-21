import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Capability } from '@/types/models';

interface GarmentOption {
    id: number;
    name: string;
    rackImage: string;
    modelLayer: string;
}

type RackSlot = -2 | -1 | 0 | 1 | 2;

const JACKETS: GarmentOption[] = [
    {
        id: 0,
        name: 'Sky Hooded Puffer',
        rackImage: '/images/try-on-fitt/jacket-0.webp',
        modelLayer: '/images/try-on-fitt/model-top-0.webp',
    },
    {
        id: 1,
        name: 'Midnight Hooded Puffer',
        rackImage: '/images/try-on-fitt/jacket-2.webp',
        modelLayer: '/images/try-on-fitt/model-top-2.webp',
    },
    {
        id: 2,
        name: 'Crimson Zip Hoodie',
        rackImage: '/images/try-on-fitt/jacket-3.webp',
        modelLayer: '/images/try-on-fitt/model-top-3.webp',
    },
    {
        id: 3,
        name: 'Colour-Block Sherpa Jacket',
        rackImage: '/images/try-on-fitt/jacket-4.webp',
        modelLayer: '/images/try-on-fitt/model-top-4.webp',
    },
    {
        id: 4,
        name: 'Camel Quilted Puffer',
        rackImage: '/images/try-on-fitt/jacket-1.webp',
        modelLayer: '/images/try-on-fitt/model-top-1.webp',
    },
];

const PANTS: GarmentOption[] = [
    {
        id: 0,
        name: 'Stone Pleated Trouser',
        rackImage: '/images/try-on-fitt/pant-0.webp',
        modelLayer: '/images/try-on-fitt/model-bottom-0.webp',
    },
    {
        id: 1,
        name: 'Obsidian Street Cargo',
        rackImage: '/images/try-on-fitt/pant-4.webp',
        modelLayer: '/images/try-on-fitt/model-bottom-4.webp',
    },
    {
        id: 2,
        name: 'Sage Parachute Cargo',
        rackImage: '/images/try-on-fitt/pant-3.webp',
        modelLayer: '/images/try-on-fitt/model-bottom-3.webp',
    },
    {
        id: 3,
        name: 'Cream Tapered Jogger',
        rackImage: '/images/try-on-fitt/pant-2.webp',
        modelLayer: '/images/try-on-fitt/model-bottom-2.webp',
    },
    {
        id: 4,
        name: 'Grey Utility Cargo',
        rackImage: '/images/try-on-fitt/pant-1.webp',
        modelLayer: '/images/try-on-fitt/model-bottom-1.webp',
    },
];

const JACKET_SLOT_CLASS: Record<RackSlot, string> = {
    [-2]: 'left-[10%] sm:left-[11%] w-[74px] sm:w-[104px] lg:w-[126px] opacity-85 scale-95 z-10 hover:opacity-100 hover:scale-105',
    [-1]: 'left-[24.5%] sm:left-[25.5%] w-[110px] sm:w-[154px] lg:w-[188px] opacity-100 scale-100 z-15 drop-shadow-[0_18px_28px_rgba(0,0,0,0.10)] hover:scale-105',
    [0]: 'left-1/2 w-[124px] sm:w-[166px] lg:w-[196px] opacity-0 scale-105 z-25 pointer-events-none',
    [1]: 'left-[75.5%] sm:left-[74.5%] w-[110px] sm:w-[154px] lg:w-[188px] opacity-100 scale-100 z-15 drop-shadow-[0_18px_28px_rgba(0,0,0,0.10)] hover:scale-105',
    [2]: 'left-[90%] sm:left-[89%] w-[74px] sm:w-[104px] lg:w-[126px] opacity-85 scale-95 z-10 hover:opacity-100 hover:scale-105',
};

const PANT_SLOT_CLASS: Record<RackSlot, string> = {
    [-2]: 'left-[10%] sm:left-[11%] w-[46px] sm:w-[66px] lg:w-[80px] opacity-85 scale-95 z-10 hover:opacity-100 hover:scale-105',
    [-1]: 'left-[24.5%] sm:left-[25.5%] w-[72px] sm:w-[104px] lg:w-[128px] opacity-100 scale-100 z-15 drop-shadow-[0_18px_28px_rgba(0,0,0,0.10)] hover:scale-105',
    [0]: 'left-1/2 w-[88px] sm:w-[116px] lg:w-[138px] opacity-0 scale-105 z-25 pointer-events-none',
    [1]: 'left-[75.5%] sm:left-[74.5%] w-[72px] sm:w-[104px] lg:w-[128px] opacity-100 scale-100 z-15 drop-shadow-[0_18px_28px_rgba(0,0,0,0.10)] hover:scale-105',
    [2]: 'left-[90%] sm:left-[89%] w-[46px] sm:w-[66px] lg:w-[80px] opacity-85 scale-95 z-10 hover:opacity-100 hover:scale-105',
};

/** Wrap an index difference across a 5-item circular rack into slots -2..+2. */
function circularSlot(index: number, activeIndex: number, count: number): RackSlot {
    let delta = (index - activeIndex + count) % count;
    if (delta > count / 2) {
        delta -= count;
    }
    return delta as RackSlot;
}

/** Handles mouse drag, touch swipe, and horizontal trackpad scroll without blocking vertical scroll. */
function useRackGestures(onStep: (delta: -1 | 1) => void) {
    const startX = useRef<number | null>(null);
    const lastWheelAt = useRef(0);

    return {
        onPointerDown: (event: React.PointerEvent) => {
            startX.current = event.clientX;
        },
        onPointerUp: (event: React.PointerEvent) => {
            if (startX.current === null) {
                return;
            }
            const dx = event.clientX - startX.current;
            startX.current = null;
            if (Math.abs(dx) >= 28) {
                onStep(dx < 0 ? 1 : -1);
            }
        },
        onPointerCancel: () => {
            startX.current = null;
        },
        onWheel: (event: React.WheelEvent) => {
            if (Math.abs(event.deltaX) <= Math.abs(event.deltaY) || Math.abs(event.deltaX) <= 18) {
                return;
            }
            const now = performance.now();
            if (now - lastWheelAt.current < 420) {
                return;
            }
            lastWheelAt.current = now;
            onStep(event.deltaX > 0 ? 1 : -1);
        },
    };
}

interface FittingRackProps {
    items: GarmentOption[];
    activeIndex: number;
    slotClasses: Record<RackSlot, string>;
    positionClass: string;
    labelPrefix: string;
    onSelect: (index: number) => void;
    onStep: (delta: -1 | 1) => void;
}

/**
 * Horizontal mix-and-match rack (-2, -1, 0, +1, +2) where garments glide smoothly
 * onto the standing model (`left: 50%`) on click, drag, or horizontal scroll.
 */
function FittingRack({
    items,
    activeIndex,
    slotClasses,
    positionClass,
    labelPrefix,
    onSelect,
    onStep,
}: FittingRackProps) {
    const gestureHandlers = useRackGestures(onStep);
    const prevSlots = useRef<number[]>(items.map((_, i) => circularSlot(i, activeIndex, items.length)));
    const nextSlots = items.map((_, i) => circularSlot(i, activeIndex, items.length));

    useEffect(() => {
        prevSlots.current = nextSlots;
    });

    return (
        <div
            {...gestureHandlers}
            className={`absolute inset-x-0 z-10 touch-pan-y cursor-grab active:cursor-grabbing ${positionClass}`}
        >
            {items.map((item, idx) => {
                const slot = nextSlots[idx];
                const prevSlot = prevSlots.current[idx] ?? slot;
                const isWrapping = Math.abs(slot - prevSlot) > 2;

                return (
                    <button
                        key={item.id}
                        type="button"
                        onClick={() => onSelect(idx)}
                        tabIndex={slot === 0 ? -1 : 0}
                        aria-hidden={slot === 0}
                        aria-label={`Try ${labelPrefix}: ${item.name}`}
                        className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer ${
                            isWrapping
                                ? 'transition-none opacity-0'
                                : 'transition-all duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)]'
                        } focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink ${slotClasses[slot]}`}
                    >
                        <img
                            src={item.rackImage}
                            alt={item.name}
                            draggable={false}
                            className="block h-auto w-full select-none object-contain"
                        />
                    </button>
                );
            })}
        </div>
    );
}

interface VirtualTryOnFittingRoomProps {
    capability: Capability;
    parent: Capability | null;
}

/**
 * Clean full-width, full-viewport Virtual Try-On Fitting Room experience matching
 * the Jiro Fitt design with minimal back/quote header and bottom outfit caption.
 */
export function VirtualTryOnFittingRoom({ capability, parent }: VirtualTryOnFittingRoomProps) {
    const [topIndex, setTopIndex] = useState(0);
    const [bottomIndex, setBottomIndex] = useState(0);

    const activeJacket = JACKETS[topIndex];
    const activePant = PANTS[bottomIndex];

    const stepTop = useCallback((delta: -1 | 1) => {
        setTopIndex((prev) => (prev + delta + JACKETS.length) % JACKETS.length);
    }, []);

    const stepBottom = useCallback((delta: -1 | 1) => {
        setBottomIndex((prev) => (prev + delta + PANTS.length) % PANTS.length);
    }, []);

    // Warm browser cache and play one subtle entrance step so visitors see the attach motion once.
    useEffect(() => {
        [...JACKETS, ...PANTS].forEach((item) => {
            new Image().src = item.rackImage;
            new Image().src = item.modelLayer;
        });

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        const timer = window.setTimeout(() => {
            stepBottom(-1);
        }, 600);

        return () => window.clearTimeout(timer);
    }, [stepBottom]);

    return (
        <section
            aria-label={capability.title}
            className="relative flex min-h-[100svh] w-full flex-col justify-between overflow-hidden bg-surface pb-6 pt-20 text-ink select-none sm:pb-8 sm:pt-24"
        >
            {/* Minimal Top Header */}
            <div className="flex flex-wrap items-start justify-between gap-3 px-4 sm:px-10 lg:block lg:px-0">
                <div className="lg:absolute lg:left-10 lg:top-24 lg:z-30">
                    <Link
                        href={parent ? `/capabilities/${parent.slug}` : '/capabilities'}
                        prefetch
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-subtle transition-colors hover:text-ink"
                    >
                        <ArrowLeft size={13} />
                        {parent ? `Back to ${parent.title}` : 'All capabilities'}
                    </Link>
                    <h1 className="mt-1.5 font-serif text-[26px] sm:text-[34px] font-normal leading-none tracking-[-0.02em] text-ink">
                        Fitting Room
                    </h1>
                </div>

                <div className="lg:absolute lg:right-10 lg:top-24 lg:z-30">
                    <Link
                        href="/virtual-try-on/quote"
                        prefetch
                        className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 sm:px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-[0_10px_24px_-12px_color-mix(in_srgb,var(--color-primary)_85%,transparent)] transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-primary-hover sm:text-sm"
                    >
                        Request a quote
                        <ArrowUpRight size={14} />
                    </Link>
                </div>
            </div>

            {/* Full-Width Interactive Fitting Stage */}
            <div className="relative mx-auto my-auto flex h-[430px] w-full max-w-[1440px] items-center justify-center overflow-hidden sm:h-[540px] lg:h-[600px]">
                <FittingRack
                    items={JACKETS}
                    activeIndex={topIndex}
                    slotClasses={JACKET_SLOT_CLASS}
                    positionClass="top-[16%] h-[34%] sm:top-[15%] sm:h-[36%]"
                    labelPrefix="jacket"
                    onSelect={setTopIndex}
                    onStep={stepTop}
                />

                <FittingRack
                    items={PANTS}
                    activeIndex={bottomIndex}
                    slotClasses={PANT_SLOT_CLASS}
                    positionClass="top-[52%] h-[35%] sm:top-[51%] sm:h-[37%]"
                    labelPrefix="pant"
                    onSelect={setBottomIndex}
                    onStep={stepBottom}
                />

                {/* Full-Body Overlapping Layers (137x389): Lower Pant (z-10) + Upper Jacket & Hands (z-20) */}
                <div className="relative z-20 aspect-[137/389] w-[158px] sm:w-[194px] lg:w-[224px]">
                    <AnimatePresence mode="sync" initial={false}>
                        <motion.img
                            key={`bottom-${activePant.id}`}
                            src={activePant.modelLayer}
                            alt={activePant.name}
                            draggable={false}
                            initial={{ opacity: 0.25, scale: 0.99 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                            className="pointer-events-none absolute inset-0 z-10 block h-full w-full select-none object-contain"
                        />
                    </AnimatePresence>

                    <AnimatePresence mode="sync" initial={false}>
                        <motion.img
                            key={`top-${activeJacket.id}`}
                            src={activeJacket.modelLayer}
                            alt={activeJacket.name}
                            draggable={false}
                            initial={{ opacity: 0.25, scale: 0.99 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                            className="pointer-events-none absolute inset-0 z-20 block h-full w-full select-none object-contain"
                        />
                    </AnimatePresence>
                </div>
            </div>

            {/* Clean Bottom Outfit Caption */}
            <div className="mx-auto flex flex-wrap items-center justify-center gap-8 px-5 text-xs sm:gap-10 sm:text-sm">
                <p>
                    <span className="text-subtle">Jacket</span>{' '}
                    <strong className="font-semibold text-ink">{activeJacket.name}</strong>
                </p>
                <p>
                    <span className="text-subtle">Pant</span>{' '}
                    <strong className="font-semibold text-ink">{activePant.name}</strong>
                </p>
            </div>
        </section>
    );
}
