import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { EASE_OUT_QUART } from '../shared';
import { TwinSpriteCrop } from './TwinSpriteCrop';
import { DigitalTwinModel } from './twins';

interface TwinPoseStageProps {
    twin: DigitalTwinModel;
    poseIndex: number;
    onSelectPose: (index: number) => void;
    onStepPose: (delta: number) => void;
}

const STEP_BUTTON =
    'grid h-9 w-9 place-items-center rounded-full border border-ink/20 bg-white/85 text-ink shadow-xs transition-colors hover:bg-ink hover:text-white';

/** Direct, clean pose names (Front, Side, Close-Up, Back, Detail, Stride) instead of POSE 01, POSE 02. */
export function getShortPoseName(id: string): string {
    switch (id) {
        case 'pose-01':
            return 'Front';
        case 'pose-02':
            return 'Side';
        case 'pose-03':
            return 'Close-Up';
        case 'pose-04':
            return 'Back';
        case 'pose-05':
            return 'Detail';
        case 'pose-06':
            return 'Stride';
        default:
            return 'Pose';
    }
}

/** Large inspection view showing the selected pose, fitted properly without cutting off head or feet. */
export function FeaturedPose({ twin, poseIndex, onStepPose }: Omit<TwinPoseStageProps, 'onSelectPose'>) {
    const pose = twin.poses[poseIndex] ?? twin.poses[0];
    const poseName = getShortPoseName(pose.id);

    return (
        <div
            className="relative flex h-full min-h-[420px] flex-col justify-between overflow-hidden rounded-2xl border border-[#d8e1ec] p-5 shadow-xs"
            style={{ background: pose.backdrop }}
        >
            <div className="relative z-10 flex items-start justify-between gap-2">
                <div>
                    <span className="font-michroma inline-flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-1 text-[9px] font-bold tracking-[0.18em] text-white shadow-xs uppercase">
                        {poseName}
                    </span>
                    <p className="mt-2 text-base font-bold text-ink sm:text-lg">{pose.title}</p>
                    <p className="text-xs text-subtle">{pose.angle}</p>
                </div>
                <span className="rounded-full border border-ink/15 bg-white/85 px-3 py-1 text-[11px] font-medium text-ink shadow-xs">
                    {pose.lens}
                </span>
            </div>

            {/* Main model showcase — properly framed so head, dress and shoes fit without clipping */}
            <div className="relative my-2 flex flex-1 items-center justify-center min-h-[300px]">
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-3 left-1/2 h-6 w-3/4 -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(45,60,80,0.22),transparent)]"
                />
                <motion.div
                    key={`${twin.index}-${pose.id}`}
                    initial={{ opacity: 0, scale: 0.98, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: EASE_OUT_QUART }}
                    className="relative flex h-full max-h-[460px] w-full items-center justify-center p-2"
                >
                    <TwinSpriteCrop twin={twin} pose={pose} className="h-full w-auto max-h-full block select-none" />
                </motion.div>
            </div>

            <div className="relative z-10 flex items-center justify-between border-t border-ink/10 pt-3">
                <span className="font-michroma text-[10px] tracking-[0.14em] text-subtle uppercase">
                    {poseName} · {poseIndex + 1} / {twin.poses.length}
                </span>
                <div className="flex items-center gap-2">
                    <button type="button" onClick={() => onStepPose(-1)} aria-label="Previous pose" className={STEP_BUTTON}>
                        <ArrowLeft size={15} />
                    </button>
                    <button type="button" onClick={() => onStepPose(1)} aria-label="Next pose" className={STEP_BUTTON}>
                        <ArrowRight size={15} />
                    </button>
                </div>
            </div>
        </div>
    );
}

/** Thumbnail grid of every pose preset — showing direct names (Front, Side, Close-Up, Back, Detail, Stride). */
export function PoseGallery({ twin, poseIndex, onSelectPose }: Omit<TwinPoseStageProps, 'onStepPose'>) {
    return (
        <div className="flex h-full min-h-0 flex-col">
            <div className="grid min-h-0 flex-1 grid-cols-2 gap-3 sm:grid-cols-3">
                {twin.poses.map((pose, i) => {
                    const selected = i === poseIndex;
                    const poseName = getShortPoseName(pose.id);

                    return (
                        <button
                            key={pose.id}
                            type="button"
                            onClick={() => onSelectPose(i)}
                            aria-pressed={selected}
                            style={{ background: pose.backdrop }}
                            className={`group relative flex aspect-[3/4] w-full flex-col justify-between overflow-hidden rounded-2xl border p-2.5 text-left transition-all duration-300 ${
                                selected
                                    ? 'border-ink shadow-lg ring-2 ring-ink/20 scale-[1.01]'
                                    : 'border-[#d8e1ec] hover:border-ink/50 hover:shadow-md'
                            }`}
                        >
                            {/* Top badge row: Direct pose name (Front, Side, Close-Up, Back, Detail, Stride) */}
                            <div className="relative z-10 flex w-full items-center justify-between">
                                <span className="font-michroma rounded-full bg-white/95 px-2.5 py-0.5 text-[8.5px] font-bold tracking-[0.14em] text-ink shadow-xs backdrop-blur-xs uppercase">
                                    {poseName}
                                </span>
                                {selected && (
                                    <span className="grid h-5 w-5 place-items-center rounded-full bg-ink text-white shadow-xs">
                                        <Check size={11} strokeWidth={3} />
                                    </span>
                                )}
                            </div>

                            {/* Centered Model Sprite — fills card naturally without extra labels underneath */}
                            <div className="relative flex flex-1 items-center justify-center overflow-hidden pt-1 transition-transform duration-300 group-hover:scale-105">
                                <span
                                    aria-hidden="true"
                                    className="pointer-events-none absolute bottom-1 left-1/2 h-3.5 w-3/4 -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(45,60,80,0.2),transparent)]"
                                />
                                <TwinSpriteCrop twin={twin} pose={pose} className="h-full w-auto max-h-full block select-none" />
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

/** Left side of the preset modal: featured pose next to full pose gallery. */
export function TwinPoseStage(props: TwinPoseStageProps) {
    return (
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-5 lg:grid-cols-[minmax(300px,0.92fr)_minmax(0,1.35fr)]">
            <FeaturedPose twin={props.twin} poseIndex={props.poseIndex} onStepPose={props.onStepPose} />
            <PoseGallery twin={props.twin} poseIndex={props.poseIndex} onSelectPose={props.onSelectPose} />
        </div>
    );
}
