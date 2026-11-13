import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TwinCursorMode } from './useTwinRunway';

const SHAPE: Record<TwinCursorMode, string> = {
    hidden: 'h-[96px] w-[96px] scale-50 opacity-0',
    ring: 'h-[42px] w-[42px] scale-100 border-[2px] border-ink/50 opacity-100',
    drag: 'h-[38px] w-[98px] scale-100 border border-white/70 bg-white/60 opacity-100 backdrop-blur-md shadow-[0_12px_28px_-12px_color-mix(in_srgb,var(--color-ink)_45%,transparent),inset_0_1px_0_rgba(255,255,255,0.9)]',
    dragging:
        'h-[38px] w-[116px] scale-[0.96] border border-white/70 bg-white/60 opacity-100 backdrop-blur-md shadow-[0_8px_20px_-12px_color-mix(in_srgb,var(--color-ink)_45%,transparent),inset_0_1px_0_rgba(255,255,255,0.9)]',
    view: 'h-[80px] w-[80px] scale-100 border border-white/35 bg-gradient-to-b from-[color-mix(in_srgb,var(--color-ink)_82%,white)] to-ink opacity-100 shadow-[0_16px_32px_-10px_color-mix(in_srgb,var(--color-ink)_60%,transparent),inset_0_1px_0_rgba(255,255,255,0.35)]',
    buy: 'h-[80px] w-[80px] scale-100 border border-white/35 bg-gradient-to-b from-[color-mix(in_srgb,var(--color-primary)_86%,white)] to-primary opacity-100 shadow-[0_16px_32px_-10px_color-mix(in_srgb,var(--color-primary)_72%,transparent),inset_0_1px_0_rgba(255,255,255,0.45)]',
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
                className={`relative grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full transition-[width,height,opacity,scale,background-color,border-color,box-shadow] duration-300 ${SPRING} ${SHAPE[mode]}`}
            >
                {(mode === 'buy' || mode === 'view') && (
                    <span aria-hidden="true" className="absolute inset-x-3 top-1 h-[42%] rounded-full bg-gradient-to-b from-white/25 to-transparent" />
                )}

                {(mode === 'buy' || mode === 'view') && (
                    <span className="relative select-none pl-[0.2em] text-[12px] font-extrabold tracking-[0.18em] text-white">
                        {mode === 'buy' ? 'BUY' : 'VIEW'}
                    </span>
                )}

                {isDrag && (
                    <>
                        <span
                            className={`absolute left-2.5 grid transition-[left,color] duration-300 ${SPRING} ${isDragging ? '!left-2 text-primary' : 'text-ink/70'}`}
                        >
                            <ChevronLeft
                                size={13}
                                strokeWidth={2.8}
                                style={isDragging ? undefined : { animation: 'twin-nudge-left 1.4s ease-in-out infinite' }}
                            />
                        </span>
                        <span
                            className={`select-none pl-[0.2em] text-[9px] font-extrabold transition-[letter-spacing,color] duration-300 ${SPRING} ${
                                isDragging ? 'tracking-[0.34em] text-ink' : 'tracking-[0.22em] text-ink'
                            }`}
                        >
                            DRAG
                        </span>
                        <span
                            className={`absolute right-2.5 grid transition-[right,color] duration-300 ${SPRING} ${isDragging ? '!right-2 text-primary' : 'text-ink/70'}`}
                        >
                            <ChevronRight
                                size={13}
                                strokeWidth={2.8}
                                style={isDragging ? undefined : { animation: 'twin-nudge-right 1.4s ease-in-out infinite' }}
                            />
                        </span>
                    </>
                )}
            </div>
        </div>
    );
}
