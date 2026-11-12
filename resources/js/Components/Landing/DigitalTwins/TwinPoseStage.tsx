import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
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
    'grid h-10 w-10 place-items-center rounded-full border border-[#16191f]/20 bg-white/85 text-[#16191f] transition-colors hover:bg-[#16191f] hover:text-white';

/** Strip of every pose for the twin: a column beside the stage on desktop, a row under it on phones. */
function PoseThumbnails({ twin, poseIndex, onSelectPose }: Omit<TwinPoseStageProps, 'onStepPose'>) {
    return (
        <div className="flex gap-2 lg:flex-col" role="tablist" aria-label="Poses">
            {twin.poses.map((pose, i) => {
                const selected = i === poseIndex;
                return (
                    <button
                        key={pose.id}
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        aria-label={`${pose.code}: ${pose.title}`}
                        onClick={() => onSelectPose(i)}
                        style={{ background: pose.backdrop }}
                        className={`relative h-20 min-w-0 flex-1 overflow-hidden rounded-xl border transition-[border-color,box-shadow,opacity] duration-300 lg:h-auto lg:min-h-0 ${
                            selected
                                ? 'border-[#16191f] shadow-md ring-2 ring-[#16191f]/15'
                                : 'border-[#d8e1ec] opacity-70 hover:border-[#16191f]/50 hover:opacity-100'
                        }`}
                    >
                        {/* Absolutely placed so the artwork never dictates the thumbnail's height. */}
                        <span className="absolute inset-1 block">
                            <TwinSpriteCrop twin={twin} pose={pose} />
                        </span>
                    </button>
                );
            })}
        </div>
    );
}

/** The selected pose, as large as the modal allows. */
function FeaturedPose({ twin, poseIndex, onStepPose }: Omit<TwinPoseStageProps, 'onSelectPose'>) {
    const pose = twin.poses[poseIndex] ?? twin.poses[0];

    return (
        <div
            className="relative min-h-[44vh] flex-1 overflow-hidden rounded-3xl border border-[#d8e1ec] lg:min-h-0"
            style={{ background: pose.backdrop }}
        >
            <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-[3%] left-1/2 h-[5%] w-2/5 -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(45,60,80,0.26),transparent)]"
            />
            <motion.div
                key={`${twin.index}-${pose.id}`}
                initial={{ opacity: 0, scale: 0.97, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE_OUT_QUART }}
                className="absolute inset-x-4 bottom-[4%] top-[3%]"
            >
                <TwinSpriteCrop twin={twin} pose={pose} />
            </motion.div>

            <div className="absolute left-4 top-4">
                <span className="font-michroma inline-block rounded-full bg-[#16191f] px-3 py-1 text-[9px] tracking-[0.18em] text-white">
                    {pose.code}
                </span>
                <p className="mt-2 text-sm font-bold text-[#16191f]">{pose.title}</p>
            </div>

            <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <button type="button" onClick={() => onStepPose(-1)} aria-label="Previous pose" className={STEP_BUTTON}>
                    <ArrowLeft size={16} />
                </button>
                <button type="button" onClick={() => onStepPose(1)} aria-label="Next pose" className={STEP_BUTTON}>
                    <ArrowRight size={16} />
                </button>
            </div>
        </div>
    );
}

/** Left side of the pose modal: thumbnails next to one large pose. */
export function TwinPoseStage(props: TwinPoseStageProps) {
    return (
        <div className="flex min-h-0 flex-1 flex-col-reverse gap-3 lg:grid lg:grid-cols-[88px_minmax(0,1fr)] lg:gap-4">
            <PoseThumbnails twin={props.twin} poseIndex={props.poseIndex} onSelectPose={props.onSelectPose} />
            <FeaturedPose twin={props.twin} poseIndex={props.poseIndex} onStepPose={props.onStepPose} />
        </div>
    );
}
