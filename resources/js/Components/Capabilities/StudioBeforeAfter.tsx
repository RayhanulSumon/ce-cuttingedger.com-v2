import React, { useCallback, useEffect, useRef, useState } from 'react';
import { MoveHorizontal } from 'lucide-react';

interface StudioBeforeAfterProps {
    beforeImage: string;
    afterImage: string;
    alt: string;
    beforeLabel?: string;
    afterLabel?: string;
    aspectClass?: string;
    compact?: boolean;
    sweepKey?: string;
}

const clampPercent = (value: number) => Math.max(2, Math.min(98, value));

/**
 * Gallery-grade Before / After split comparison slider.
 * Renders identical full-bleed layers with crisp pointer-capture drag and keyboard support.
 */
export function StudioBeforeAfter({
    beforeImage,
    afterImage,
    alt,
    beforeLabel = 'Before',
    afterLabel = 'After',
    aspectClass = 'aspect-[16/10]',
    compact = false,
    sweepKey,
}: StudioBeforeAfterProps) {
    const [position, setPosition] = useState(50);
    const [dragging, setDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!sweepKey) {
            return;
        }
        if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setPosition(50);
            return;
        }
        setPosition(68);
        const timer = window.setTimeout(() => setPosition(50), 90);
        return () => window.clearTimeout(timer);
    }, [sweepKey]);

    const updateFromClientX = useCallback((clientX: number) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect || rect.width <= 0) {
            return;
        }
        setPosition(clampPercent(((clientX - rect.left) / rect.width) * 100));
    }, []);

    return (
        <div
            ref={containerRef}
            role="slider"
            tabIndex={0}
            aria-label={`Before and after comparison for ${alt}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(position)}
            onPointerDown={(event) => {
                event.currentTarget.setPointerCapture(event.pointerId);
                setDragging(true);
                updateFromClientX(event.clientX);
            }}
            onPointerMove={(event) => {
                if (dragging) {
                    updateFromClientX(event.clientX);
                }
            }}
            onPointerUp={() => setDragging(false)}
            onPointerCancel={() => setDragging(false)}
            onKeyDown={(event) => {
                if (event.key === 'ArrowLeft') {
                    event.preventDefault();
                    setPosition((prev) => clampPercent(prev - 4));
                } else if (event.key === 'ArrowRight') {
                    event.preventDefault();
                    setPosition((prev) => clampPercent(prev + 4));
                }
            }}
            className={`group relative w-full ${aspectClass} cursor-ew-resize touch-none select-none overflow-hidden rounded-2xl border border-ink/10 bg-[#f4f7fb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary`}
        >
            {/* After layer (base full frame) */}
            <img
                src={afterImage}
                alt={`${alt} — ${afterLabel}`}
                draggable={false}
                className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover"
            />

            {/* Before layer (clipped from left edge to divider) */}
            <div
                className={`pointer-events-none absolute inset-0 will-change-[clip-path] ${
                    dragging ? '' : 'transition-[clip-path] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]'
                }`}
                style={{
                    clipPath: `inset(0 ${100 - position}% 0 0)`,
                    WebkitClipPath: `inset(0 ${100 - position}% 0 0)`,
                }}
            >
                <img
                    src={beforeImage}
                    alt={`${alt} — ${beforeLabel}`}
                    draggable={false}
                    className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover"
                />
            </div>

            {/* Minimal corner labels */}
            <span
                className={`pointer-events-none absolute left-3 top-3 z-10 rounded-full bg-ink/75 font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-xs ${
                    compact ? 'px-2.5 py-0.5 text-[9px]' : 'px-3 py-1 text-[10px]'
                }`}
            >
                {beforeLabel}
            </span>
            <span
                className={`pointer-events-none absolute right-3 top-3 z-10 rounded-full border border-ink/10 bg-white/90 font-semibold uppercase tracking-[0.14em] text-ink shadow-2xs backdrop-blur-xs ${
                    compact ? 'px-2.5 py-0.5 text-[9px]' : 'px-3 py-1 text-[10px]'
                }`}
            >
                {afterLabel}
            </span>

            {/* Vertical divider line & handle */}
            <div
                className={`pointer-events-none absolute inset-y-0 z-20 -translate-x-1/2 will-change-[left] ${
                    dragging ? '' : 'transition-[left] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]'
                }`}
                style={{ left: `${position}%` }}
            >
                <div className="h-full w-[1.5px] bg-white/95 shadow-[0_0_8px_rgba(22,25,31,0.35)]" />
                <span
                    className={`absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border bg-white shadow-md transition-[transform,border-color,color] duration-150 ${
                        compact ? 'h-8 w-8' : 'h-9 w-9 sm:h-10 sm:w-10'
                    } ${
                        dragging
                            ? 'scale-105 border-primary text-primary'
                            : 'border-ink/10 text-ink group-hover:border-primary group-hover:text-primary'
                    }`}
                >
                    <MoveHorizontal size={compact ? 14 : 16} />
                </span>
            </div>
        </div>
    );
}
