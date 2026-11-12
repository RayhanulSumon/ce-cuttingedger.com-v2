import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { EASE_OUT_QUART } from '../shared';
import { TwinPoseStage } from './TwinPoseStage';
import { PresetAction, TwinPresetSidebar } from './TwinPresetSidebar';
import { DIGITAL_TWINS } from './twins';

interface TwinPresetModalProps {
    /** Twin to show, or null when the modal is closed. */
    twinIndex: number | null;
    onSelectTwin: (index: number) => void;
    onClose: () => void;
    openDemo: () => void;
}

/** Pause between picking a purchase action and opening the demo form, so the confirmation is readable. */
const ACTION_FEEDBACK_MS = 260;

/**
 * Fullscreen pose-preset overlay for a digital twin.
 */
export function TwinPresetModal({ twinIndex, onSelectTwin, onClose, openDemo }: TwinPresetModalProps) {
    return (
        <AnimatePresence>
            {twinIndex !== null && (
                <TwinPresetPanel twinIndex={twinIndex} onSelectTwin={onSelectTwin} onClose={onClose} openDemo={openDemo} />
            )}
        </AnimatePresence>
    );
}

function TwinPresetPanel({ twinIndex, onSelectTwin, onClose, openDemo }: TwinPresetModalProps & { twinIndex: number }) {
    const [poseIndex, setPoseIndex] = useState(0);
    const [pendingAction, setPendingAction] = useState<PresetAction | null>(null);
    const actionTimer = useRef(0);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    const twin = DIGITAL_TWINS[twinIndex] ?? DIGITAL_TWINS[0];
    const poseCount = twin.poses.length;
    const pose = twin.poses[poseIndex] ?? twin.poses[0];
    const [twinName, twinStyle] = twin.name.split(' — ');

    // Switching twin starts again from its first pose.
    const [shownTwin, setShownTwin] = useState(twinIndex);
    if (shownTwin !== twinIndex) {
        setShownTwin(twinIndex);
        setPoseIndex(0);
        setPendingAction(null);
    }

    const stepPose = (delta: number) => setPoseIndex((current) => (current + delta + poseCount) % poseCount);

    useEffect(() => {
        closeButtonRef.current?.focus({ preventScroll: true });
        return () => window.clearTimeout(actionTimer.current);
    }, []);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                event.stopPropagation();
                onClose();
            } else if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
                event.preventDefault();
                const delta = event.key === 'ArrowRight' ? 1 : -1;
                setPoseIndex((current) => (current + delta + poseCount) % poseCount);
            }
        };
        window.addEventListener('keydown', onKeyDown, true);
        return () => window.removeEventListener('keydown', onKeyDown, true);
    }, [onClose, poseCount]);

    const handleAction = (action: PresetAction) => {
        setPendingAction(action);
        window.clearTimeout(actionTimer.current);
        actionTimer.current = window.setTimeout(() => {
            setPendingAction(null);
            openDemo();
        }, ACTION_FEEDBACK_MS);
    };

    return (
        <motion.div
            className="absolute inset-0 z-[500] flex flex-col overflow-y-auto bg-[#f4f7fb] lg:grid lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_410px] lg:overflow-hidden"
            data-scrollable
            role="dialog"
            aria-modal="true"
            aria-label={`${twin.name} pose presets`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
        >
            {/* Left side: Header (minimal top gap) + TwinPoseStage (Featured pose on left, Pose gallery with neat names on right) */}
            <motion.div
                data-scrollable
                className="relative flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-6 pt-5 sm:px-8 sm:pt-6 lg:px-8 lg:pt-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 16, opacity: 0 }}
                transition={{ duration: 0.45, ease: EASE_OUT_QUART, delay: 0.05 }}
            >
                {/* ── Top Header with tight spacing ── */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d8e1ec] pb-3.5">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-michroma inline-flex items-center gap-1 rounded-full bg-[#16191f] px-2.5 py-0.5 text-[8.5px] tracking-[0.16em] text-white">
                                LOOK {twin.lookNumber}
                            </span>
                            <span className="text-xs font-semibold text-[#5d6572]">
                                {twin.archetype} · {twin.collection}
                            </span>
                        </div>
                        <h2 className="mt-1 text-xl font-extrabold tracking-[-0.02em] text-[#16191f] sm:text-2xl">
                            {twinName} <span className="text-base font-normal text-[#737b86] sm:text-lg">— {twinStyle}</span>
                        </h2>
                    </div>

                    {/* Quick look selector pills */}
                    <div className="flex items-center gap-1 rounded-full border border-[#d8e1ec] bg-white/90 p-1 shadow-xs backdrop-blur-xs" role="tablist" aria-label="Digital twins">
                        {DIGITAL_TWINS.map((item, i) => {
                            const selected = i === twinIndex;
                            const [firstName] = item.name.split(' — ')[0].split(' ');
                            return (
                                <button
                                    key={item.lookNumber}
                                    type="button"
                                    role="tab"
                                    aria-selected={selected}
                                    onClick={() => onSelectTwin(i)}
                                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-300 ${
                                        selected
                                            ? 'bg-[#16191f] text-white shadow-xs'
                                            : 'text-[#5a6270] hover:bg-[#f1f5fa] hover:text-[#16191f]'
                                    }`}
                                >
                                    <span className="font-michroma text-[9px] tracking-[0.1em]">#{item.lookNumber}</span>
                                    <span className="hidden md:inline">{firstName}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <TwinPoseStage twin={twin} poseIndex={poseIndex} onSelectPose={setPoseIndex} onStepPose={stepPose} />
            </motion.div>

            {/* Right side: Clean action sidebar with simple model name, short description, and action buttons */}
            <motion.aside
                data-scrollable
                className="flex flex-col justify-center overflow-y-auto border-t border-[#d8e1ec] bg-white p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10"
                aria-label="Digital twin preset actions"
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 24, opacity: 0 }}
                transition={{ duration: 0.45, ease: EASE_OUT_QUART, delay: 0.1 }}
            >
                <TwinPresetSidebar twin={twin} pose={pose} pendingAction={pendingAction} onAction={handleAction} />
            </motion.aside>

            {/* Close button */}
            <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label="Close pose preset view"
                className="absolute right-5 top-5 z-10 grid h-10 w-10 place-items-center rounded-full bg-[#16191f] text-white shadow-xl transition-transform duration-300 hover:rotate-90 hover:scale-110 sm:right-7 sm:top-5"
            >
                <X size={18} />
            </button>
        </motion.div>
    );
}
