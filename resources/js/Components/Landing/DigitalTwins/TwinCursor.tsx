import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TwinCursorMode } from './useTwinRunway';

const SHAPE: Record<TwinCursorMode, string> = {
    hidden: 'h-[96px] w-[96px] scale-50 opacity-0',
    ring: 'h-[42px] w-[42px] scale-100 border-[2px] border-ink/50 opacity-100',
    drag: 'h-[42px] w-[100px] scale-100 border-[2px] border-ink/40 bg-white/70 opacity-100 shadow-[0_6px_16px_-10px_color-mix(in_srgb,var(--color-ink)_25%,transparent)]',
    dragging:
        'h-[42px] w-[112px] scale-[0.94] border-[2px] border-primary/45 bg-primary/25 opacity-100 shadow-[0_12px_28px_-12px_color-mix(in_srgb,var(--color-primary)_55%,transparent)]',
    view: 'h-[96px] w-[96px] scale-100 bg-ink opacity-100 shadow-[0_14px_34px_-10px_color-mix(in_srgb,var(--color-ink)_60%,transparent)] ring-2 ring-white/70',
    buy: 'h-[96px] w-[96px] scale-100 bg-primary opacity-100 shadow-[0_14px_34px_-10px_color-mix(in_srgb,var(--color-primary)_85%,transparent)] ring-2 ring-white/70',
};

const SPRING = 'ease-[cubic-bezier(0.22,1,0.36,1)]';

/** Follower cursor for the runway. Positioned by `useTwinRunway` through `cursorRef`. */
export function TwinCursor({ cursorRef, mode }: { cursorRef: React.Ref<HTMLDivElement>; mode: TwinCursorMode }) {
    const isDrag = mode === 'drag' || mode === 'dragging';
    const isDragging = mode === 'dragging';

    return (
        <div
            ref={cursorRef}
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 z-[150] hidden will-change-transform lg:block"
        >
            <div
                className={`relative grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full transition-[width,height,opacity,scale,background-color,border-color,box-shadow] duration-500 ${SPRING} ${SHAPE[mode]}`}
            >
                {mode === 'buy' && (
                    <span className="select-none pl-[0.2em] text-[13px] font-extrabold tracking-[0.2em] text-white">BUY</span>
                )}

                {mode === 'view' && (
                    <span className="select-none pl-[0.2em] text-[13px] font-extrabold tracking-[0.2em] text-white">VIEW</span>
                )}

                {isDrag && (
                    <>
                        <ChevronLeft
                            size={13}
                            strokeWidth={2.6}
                            className={`absolute left-2.5 transition-all duration-500 ${SPRING} ${
                                isDragging ? '-translate-x-0.5 text-primary opacity-100' : 'translate-x-0 text-ink/45 opacity-80'
                            }`}
                        />
                        <span
                            className={`font-michroma pl-[0.18em] text-[8px] text-ink transition-all duration-500 ${SPRING} ${
                                isDragging ? 'tracking-[0.28em] opacity-90' : 'tracking-[0.2em] opacity-100'
                            }`}
                        >
                            DRAG
                        </span>
                        <ChevronRight
                            size={13}
                            strokeWidth={2.6}
                            className={`absolute right-2.5 transition-all duration-500 ${SPRING} ${
                                isDragging ? 'translate-x-0.5 text-primary opacity-100' : 'translate-x-0 text-ink/45 opacity-80'
                            }`}
                        />
                    </>
                )}
            </div>
        </div>
    );
}
