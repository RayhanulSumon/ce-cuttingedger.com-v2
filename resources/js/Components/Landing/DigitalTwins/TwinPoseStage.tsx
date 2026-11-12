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
    'grid h-8 w-8 place-items-center rounded-full border border-[#16191f]/20 bg-white/80 text-[#16191f] transition-colors hover:bg-[#16191f] hover:text-white';

/** Large frame showing the selected pose, with previous / next controls. */
function FeaturedPose({ twin, poseIndex, onStepPose }: Omit<TwinPoseStageProps, 'onSelectPose'>) {
    const pose = twin.poses[poseIndex] ?? twin.poses[0];

    return (
        <div
            className="relative flex min-h-[320px] flex-col justify-between overflow-hidden rounded-2xl border border-[#d8e1ec] p-5 shadow-sm"
            style={{ background: pose.backdrop }}
        >
            <div className="relative z-10 flex items-start justify-between gap-2">
                <div>
                    <span className="font-michroma inline-block rounded-full bg-[#16191f] px-3 py-1 text-[9px] tracking-[0.18em] text-white">
                        {pose.code}
                    </span>
                    <p className="mt-2 text-base font-bold text-[#16191f]">{pose.title}</p>
                    <p className="text-xs text-[#5d6572]">{pose.angle}</p>
                </div>
                <span className="rounded-full border border-[#16191f]/15 bg-white/80 px-2.5 py-1 text-[11px] font-medium text-[#16191f]">
                    {pose.lens}
                </span>
            </div>

            <div className="relative my-2 flex min-h-[240px] flex-1 items-center justify-center">
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-2 left-1/2 h-6 w-3/5 -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(45,60,80,0.26),transparent)]"
                />
                <motion.div
                    key={`${twin.index}-${pose.id}`}
                    initial={{ opacity: 0, scale: 0.96, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: EASE_OUT_QUART }}
                    className="h-[260px] w-full max-w-[260px] sm:h-[320px] lg:h-[360px]"
                >
                    <TwinSpriteCrop twin={twin} pose={pose} />
                </motion.div>
            </div>

            <div className="relative z-10 flex items-center justify-between border-t border-[#16191f]/10 pt-3">
                <span className="font-michroma text-[10px] tracking-[0.14em] text-[#5d6572]">
                    POSE {String(poseIndex + 1).padStart(2, '0')} / {String(twin.poses.length).padStart(2, '0')}
                </span>
                <div className="flex items-center gap-2">
                    <button type="button" onClick={() => onStepPose(-1)} aria-label="Previous pose" className={STEP_BUTTON}>
                        <ArrowLeft size={14} />
                    </button>
                    <button type="button" onClick={() => onStepPose(1)} aria-label="Next pose" className={STEP_BUTTON}>
                        <ArrowRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}

/** Thumbnail grid of every pose preset for the twin. */
function PoseGallery({ twin, poseIndex, onSelectPose }: Omit<TwinPoseStageProps, 'onStepPose'>) {
    return (
        <div className="flex min-h-0 flex-col">
            <div className="mb-3 flex items-center justify-between">
                <span className="font-michroma text-[10px] tracking-[0.18em] text-[#16191f]">
                    MULTI-POSE PRESET GALLERY ({twin.poses.length} POSES)
                </span>
                <span className="text-xs text-[#737b86]">Click any pose photo to inspect</span>
            </div>

            <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-3">
                {twin.poses.map((pose, i) => {
                    const selected = i === poseIndex;
                    return (
                        <button
                            key={pose.id}
                            type="button"
                            onClick={() => onSelectPose(i)}
                            aria-pressed={selected}
                            className={`group relative flex flex-col overflow-hidden rounded-xl border text-left transition-[border-color,background-color,box-shadow] duration-300 ${
                                selected
                                    ? 'border-[#16191f] bg-white shadow-md ring-2 ring-[#16191f]/15'
                                    : 'border-[#d8e1ec] bg-white/75 hover:border-[#16191f]/50 hover:bg-white'
                            }`}
                        >
                            <div
                                className="relative flex h-36 w-full items-center justify-center overflow-hidden p-2 sm:h-40"
                                style={{ background: pose.backdrop }}
                            >
                                <span className="font-michroma absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[8px] tracking-[0.14em] text-[#16191f] shadow-xs">
                                    {pose.code}
                                </span>
                                {selected && (
                                    <span className="absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full bg-[#16191f] text-white">
                                        <Check size={11} />
                                    </span>
                                )}
                                <div className="h-full w-full transition-transform duration-500 group-hover:scale-105">
                                    <TwinSpriteCrop twin={twin} pose={pose} />
                                </div>
                            </div>
                            <div className="border-t border-[#e6ebf0] px-3 py-2">
                                <p className="truncate text-xs font-semibold text-[#16191f]">{pose.title}</p>
                                <p className="truncate text-[11px] text-[#737b86]">{pose.angle}</p>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

/** Left side of the preset modal: the featured pose next to the full pose gallery. */
export function TwinPoseStage(props: TwinPoseStageProps) {
    return (
        <div className="mt-5 grid min-h-0 flex-1 grid-cols-1 gap-5 xl:grid-cols-[minmax(280px,0.95fr)_minmax(0,1.25fr)]">
            <FeaturedPose twin={props.twin} poseIndex={props.poseIndex} onStepPose={props.onStepPose} />
            <PoseGallery twin={props.twin} poseIndex={props.poseIndex} onSelectPose={props.onSelectPose} />
        </div>
    );
}
