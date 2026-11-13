import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TwinCursorMode } from './useTwinRunway';

const SHAPE: Record<TwinCursorMode, string> = {
    hidden: 'h-[96px] w-[96px] scale-50 opacity-0',
    ring: 'h-[42px] w-[42px] scale-100 border-[2px] border-ink/50 opacity-100',
    drag: 'h-[46px] w-[116px] scale-100 border border-white/70 bg-white/60 opacity-100 backdrop-blur-md shadow-[0_12px_28px_-12px_color-mix(in_srgb,var(--color-ink)_45%,transparent),inset_0_1px_0_rgba(255,255,255,0.9)]',
    dragging:
        'h-[46px] w-[138px] scale-[0.96] border border-white/40 bg-gradient-to-b from-[color-mix(in_srgb,var(--color-primary)_78%,white)] to-primary opacity-100 shadow-[0_18px_36px_-10px_color-mix(in_srgb,var(--color-primary)_80%,transparent),inset_0_1px_0_rgba(255,255,255,0.5)]',
    view: 'h-[92px] w-[92px] scale-100 border border-white/30 bg-gradient-to-br from-ink/90 to-ink opacity-100 shadow-[0_16px_36px_-12px_color-mix(in_srgb,var(--color-ink)_65%,transparent),inset_0_1px_0_rgba(255,255,255,0.28)]',
    buy: 'h-[92px] w-[92px] scale-100 border border-white/40 bg-gradient-to-b from-[color-mix(in_srgb,var(--color-primary)_78%,white)] to-primary opacity-100 shadow-[0_22px_44px_-10px_color-mix(in_srgb,var(--color-primary)_80%,transparent),0_6px_14px_-6px_color-mix(in_srgb,var(--color-primary)_60%,transparent),inset_0_1px_0_rgba(255,255,255,0.55)]',
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
                    <span aria-hidden="true" className="absolute inset-x-3 top-1 h-1/2 rounded-full bg-gradient-to-b from-white/40 to-transparent" />
                )}

                {(mode === 'buy' || mode === 'view') && (
                    <span className="relative select-none pl-[0.2em] text-[13px] font-extrabold tracking-[0.2em] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]">
                        {mode === 'buy' ? 'BUY' : 'VIEW'}
                    </span>
                )}

                {isDrag && (
                    <>
                        <span
                            className={`absolute left-3 grid transition-[left,color] duration-500 ${SPRING} ${isDragging ? '!left-2 text-white' : 'text-ink/70'}`}
                        >
                            <ChevronLeft
                                size={15}
                                strokeWidth={2.8}
                                style={isDragging ? undefined : { animation: 'twin-nudge-left 1.4s ease-in-out infinite' }}
                            />
                        </span>
                        <span
                            className={`select-none pl-[0.2em] text-[10px] font-extrabold transition-[letter-spacing,color] duration-500 ${SPRING} ${
                                isDragging ? 'tracking-[0.34em] text-white' : 'tracking-[0.22em] text-ink'
                            }`}
                        >
                            DRAG
                        </span>
                        <span
                            className={`absolute right-3 grid transition-[right,color] duration-500 ${SPRING} ${isDragging ? '!right-2 text-white' : 'text-ink/70'}`}
                        >
                            <ChevronRight
                                size={15}
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
