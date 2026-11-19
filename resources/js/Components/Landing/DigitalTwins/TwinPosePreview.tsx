import React from 'react';
import { TwinSpriteCrop } from './TwinSpriteCrop';
import { DigitalTwinModel } from './twins';

const PREVIEW_COUNT = 3;

/**
 * Three large pose cards to the right of the hovered model.
 * Lives inside each model's wrapper div — tracks depth + position automatically.
 */
export function TwinPosePreview({ twin, visible }: { twin: DigitalTwinModel; visible: boolean }) {
    return (
        <div
            aria-hidden="true"
            className="pointer-events-none absolute top-[10%] flex flex-col gap-3"
            style={{ left: '106%' }}
        >
            {twin.poses.slice(0, PREVIEW_COUNT).map((pose, i) => (
                <div
                    key={pose.id}
                    style={{
                        background: pose.backdrop,
                        transitionDelay: visible ? `${i * 60}ms` : `${(PREVIEW_COUNT - 1 - i) * 30}ms`,
                        width: 160,
                        height: 220,
                    }}
                    className={`relative overflow-hidden rounded-2xl border border-white/85 shadow-[0_20px_48px_-14px_color-mix(in_srgb,var(--color-ink)_50%,transparent)] transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        visible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
                    }`}
                >
                    <span className="absolute inset-2 block">
                        <TwinSpriteCrop twin={twin} pose={pose} />
                    </span>
                </div>
            ))}
        </div>
    );
}
