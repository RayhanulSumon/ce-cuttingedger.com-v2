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
    'grid h-9 w-9 place-items-center rounded-full border border-ink/20 bg-surface/85 text-ink shadow-xs transition-colors hover:bg-ink hover:text-white';

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
    const showsFloor = pose.yEndFrac >= 0.95;
    const isMidCrop = !showsFloor && pose.yStartFrac >= 0.1;

    return (
        <div
            className="relative flex h-full min-h-[420px] flex-col justify-between overflow-hidden rounded-2xl border border-line p-4 shadow-xs sm:p-5"
            style={{ background: pose.backdrop }}
        >
            <div className="relative z-10 flex items-start justify-between gap-2">
                <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-1 text-2xs font-bold uppercase tracking-[0.16em] text-surface shadow-xs">
                        {poseName}
                    </span>
                    <p className="mt-2 text-base font-bold text-ink sm:text-lg">{pose.title}</p>
                    <p className="text-xs text-subtle">{pose.angle}</p>
                </div>
                <span className="rounded-full border border-ink/15 bg-surface/85 px-3 py-1 text-2xs font-medium text-ink shadow-xs">
                    {pose.lens}
                </span>
            </div>

            {/* Main model showcase — fills full stage height with floor shadow anchored directly beneath the shoes */}
            <div
                className={`relative mt-2 flex h-[400px] min-h-0 w-full justify-center overflow-hidden sm:h-[480px] lg:h-auto lg:flex-1 ${
                    isMidCrop ? 'items-center py-2' : showsFloor ? 'items-end pb-3' : 'items-end'
                }`}
            >
                <motion.div
                    key={`${twin.index}-${pose.id}`}
                    initial={{ opacity: 0, scale: 0.98, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: EASE_OUT_QUART }}
                    className={`relative flex h-full w-full justify-center ${isMidCrop ? 'items-center' : 'items-end'}`}
                >
                    <span className="relative inline-flex h-full max-w-full items-end justify-center">
                        {showsFloor && (
                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute -bottom-1.5 left-1/2 z-0 h-4 w-[82%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(35,45,60,0.28),transparent)]"
                            />
                        )}
                        <TwinSpriteCrop twin={twin} pose={pose} className="relative z-10 block h-full w-auto max-w-full select-none" />
                    </span>
                </motion.div>
            </div>

            <div className="relative z-10 flex items-center justify-between border-t border-ink/10 pt-3">
                <span className="text-2xs font-semibold uppercase tracking-[0.14em] text-subtle">
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
            <div className="grid min-h-0 flex-1 grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-rows-2">
                {twin.poses.map((pose, i) => {
                    const selected = i === poseIndex;
                    const poseName = getShortPoseName(pose.id);
                    const showsFloor = pose.yEndFrac >= 0.95;
                    const isMidCrop = !showsFloor && pose.yStartFrac >= 0.1;

                    return (
                        <button
                            key={pose.id}
                            type="button"
                            onClick={() => onSelectPose(i)}
                            aria-pressed={selected}
                            style={{ background: pose.backdrop }}
                            className={`group relative flex aspect-[3/4] w-full flex-col justify-between overflow-hidden rounded-2xl border px-2.5 pt-2.5 text-left transition-all duration-300 lg:aspect-auto lg:h-full ${
                                showsFloor ? 'pb-2.5' : 'pb-0'
                            } ${
                                selected
                                    ? 'border-ink shadow-lg ring-2 ring-ink/20 scale-[1.01]'
                                    : 'border-line hover:border-ink/50 hover:shadow-md'
                            }`}
                        >
                            {/* Top badge row: Direct pose name (Front, Side, Close-Up, Back, Detail, Stride) */}
                            <div className="relative z-10 flex w-full items-center justify-between">
                                <span className="rounded-full bg-surface/95 px-2.5 py-0.5 text-2xs font-bold uppercase tracking-[0.14em] text-ink shadow-xs backdrop-blur-xs">
                                    {poseName}
                                </span>
                                {selected && (
                                    <span className="grid h-5 w-5 place-items-center rounded-full bg-ink text-white shadow-xs">
                                        <Check size={11} strokeWidth={3} />
                                    </span>
                                )}
                            </div>

                            {/* Centered Model Sprite — fills card naturally with floor shadow only on full-body poses */}
                            <div
                                className={`relative flex min-h-0 flex-1 justify-center overflow-hidden pt-1 transition-transform duration-300 group-hover:scale-105 ${
                                    isMidCrop ? 'items-center pb-2' : 'items-end'
                                }`}
                            >
                                <span className="relative inline-flex h-full max-w-full items-end justify-center">
                                    {showsFloor && (
                                        <span
                                            aria-hidden="true"
                                            className="pointer-events-none absolute -bottom-0.5 left-1/2 z-0 h-2.5 w-[78%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(35,45,60,0.24),transparent)]"
                                        />
                                    )}
                                    <TwinSpriteCrop twin={twin} pose={pose} className="relative z-10 block h-full w-auto max-w-full select-none" />
                                </span>
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
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-5 lg:grid-cols-[minmax(360px,1.12fr)_minmax(0,1.22fr)]">
            <FeaturedPose twin={props.twin} poseIndex={props.poseIndex} onStepPose={props.onStepPose} />
            <PoseGallery twin={props.twin} poseIndex={props.poseIndex} onSelectPose={props.onSelectPose} />
        </div>
    );
}
