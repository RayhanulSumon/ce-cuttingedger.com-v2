import React from 'react';
import { TwinCursorMode } from './useTwinRunway';

const SHAPE: Record<TwinCursorMode, string> = {
    hidden: 'h-[96px] w-[96px] scale-50 opacity-0',
    ring: 'h-[42px] w-[42px] border-[2px] border-[#16191f]/50 opacity-100',
    drag: 'h-[42px] w-[100px] border-[2px] border-[#16191f]/40 bg-white/70 opacity-100',
    buy: 'h-[96px] w-[96px] bg-[#f5761a] opacity-100 shadow-[0_14px_34px_-10px_rgba(245,118,26,0.85)] ring-2 ring-white/70',
};

/** Follower cursor for the runway. Positioned by `useTwinRunway` through `cursorRef`. */
export function TwinCursor({ cursorRef, mode }: { cursorRef: React.Ref<HTMLDivElement>; mode: TwinCursorMode }) {
    return (
        <div
            ref={cursorRef}
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 z-[150] hidden will-change-transform lg:block"
        >
            <div
                className={`grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full transition-[width,height,opacity,scale,background-color,border-color] duration-200 ease-out ${SHAPE[mode]}`}
            >
                {mode === 'buy' && (
                    <span className="select-none pl-[0.2em] text-[13px] font-extrabold tracking-[0.2em] text-white">BUY</span>
                )}
                {mode === 'drag' && (
                    <span className="font-michroma pl-[0.18em] text-[8px] tracking-[0.2em] text-[#16191f]">DRAG</span>
                )}
            </div>
        </div>
    );
}
