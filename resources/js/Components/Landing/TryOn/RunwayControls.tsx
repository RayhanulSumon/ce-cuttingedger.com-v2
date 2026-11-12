import React from 'react';
import { LOOKS } from './looks';

interface RunwayControlsProps {
    lookIndex: number;
    playing: boolean;
    /** Autoplay is running right now (playing and nothing is pausing it). */
    progressRunning: boolean;
    onStep: (delta: number) => void;
    onSelectLook: (lookIndex: number) => void;
    onTogglePlay: () => void;
}

const ICON_BUTTON = 'group grid h-11 w-11 shrink-0 place-items-center text-[#151413] transition-opacity hover:opacity-75';

function ArrowIcon({ direction }: { direction: 'left' | 'right' }) {
    return (
        <svg
            width="26"
            height="14"
            viewBox="0 0 26 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className={`transition-transform duration-300 ${direction === 'left' ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`}
        >
            <path d={direction === 'left' ? 'M25 7H1M7 1L1 7l6 6' : 'M1 7h24M19 1l6 6-6 6'} />
        </svg>
    );
}

/** Previous / next arrows, a per-look progress strip and the autoplay toggle. */
export function RunwayControls({ lookIndex, playing, progressRunning, onStep, onSelectLook, onTogglePlay }: RunwayControlsProps) {
    return (
        <>
            <button type="button" onClick={() => onStep(-1)} aria-label="Previous look" className={ICON_BUTTON}>
                <ArrowIcon direction="left" />
            </button>

            <div className="flex min-w-0 flex-1 items-center gap-1.5">
                {LOOKS.map((look, i) => {
                    const isCurrent = i === lookIndex;
                    const fill = isCurrent
                        ? progressRunning
                            ? 'animate-rw-fill'
                            : 'scale-x-100'
                        : i < lookIndex
                          ? 'scale-x-100 opacity-35'
                          : 'scale-x-0';

                    return (
                        <button
                            key={i}
                            type="button"
                            onClick={() => onSelectLook(i)}
                            aria-current={isCurrent}
                            aria-label={`Look ${i + 1}: ${look.name}`}
                            className={`group flex h-11 flex-col justify-center gap-2 text-left transition-[width,flex-grow,color] duration-500 ${
                                isCurrent
                                    ? 'w-[140px] shrink-0 text-[#151413] sm:w-[190px]'
                                    : 'min-w-[14px] flex-1 basis-[44px] text-[#66625c] hover:text-[#151413]'
                            }`}
                        >
                            <span className="relative block h-[2px] w-full overflow-hidden bg-[#151413]/14 transition-transform group-hover:scale-y-150">
                                <span
                                    key={isCurrent && progressRunning ? `run-${lookIndex}` : 'still'}
                                    className={`absolute inset-0 origin-left bg-[#0e0e0e] ${fill}`}
                                />
                            </span>
                            <span className="block truncate text-[10px] tabular-nums tracking-[0.12em]">
                                {String(i + 1).padStart(2, '0')}
                                {isCurrent && <span className="ml-2 hidden sm:inline">{look.name}</span>}
                            </span>
                        </button>
                    );
                })}
            </div>

            <button
                type="button"
                onClick={onTogglePlay}
                aria-pressed={playing}
                aria-label={playing ? 'Pause autoplay' : 'Start autoplay'}
                className={ICON_BUTTON}
            >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d={playing ? 'M6.5 4.5h3.5v15H6.5zM14 4.5h3.5v15H14z' : 'M7 4.5v15l12.5-7.5z'} />
                </svg>
            </button>

            <button type="button" onClick={() => onStep(1)} aria-label="Next look" className={ICON_BUTTON}>
                <ArrowIcon direction="right" />
            </button>
        </>
    );
}
