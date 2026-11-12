import React from 'react';
import { TwinSpriteCrop } from './TwinSpriteCrop';
import { DigitalTwinModel } from './twins';

/** How many of the twin's poses to tease on hover. */
const PREVIEW_COUNT = 3;

/**
 * Three pose cards stacked on the right edge of the runway, shown while a model is hovered.
 * Preview only — clicking the model opens the full pose view.
 */
export function TwinPosePreview({ twin, visible }: { twin: DigitalTwinModel; visible: boolean }) {
    return (
        <div
            aria-hidden="true"
            className="pointer-events-none absolute right-14 top-1/2 z-[140] hidden -translate-y-1/2 flex-col gap-3 sm:flex lg:right-16"
        >
            {twin.poses.slice(0, PREVIEW_COUNT).map((pose, i) => (
                <div
                    key={pose.id}
                    style={{ background: pose.backdrop, transitionDelay: visible ? `${i * 70}ms` : '0ms' }}
                    className={`relative h-[clamp(120px,19vh,176px)] w-[clamp(92px,14.5vh,132px)] overflow-hidden rounded-2xl border border-white/80 p-2 shadow-[0_18px_40px_-18px_rgba(22,25,31,0.45)] transition-[opacity,translate] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        visible ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'
                    }`}
                >
                    <TwinSpriteCrop twin={twin} pose={pose} />
                    <span className="font-michroma absolute bottom-1.5 left-1.5 rounded-full bg-white/90 px-1.5 py-0.5 text-[7px] tracking-[0.12em] text-[#16191f]">
                        {pose.code}
                    </span>
                </div>
            ))}
        </div>
    );
}
