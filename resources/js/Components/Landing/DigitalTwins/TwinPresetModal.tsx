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
 *
 * The wrapper only handles presence, so the panel keeps rendering the last twin
 * while it animates out instead of vanishing the moment `twinIndex` becomes null.
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
            className="absolute inset-0 z-[500] flex flex-col bg-[#f4f7fb] lg:grid lg:grid-cols-[minmax(0,1fr)_410px] xl:grid-cols-[minmax(0,1fr)_440px]"
            role="dialog"
            aria-modal="true"
            aria-label={`${twin.name} pose presets`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
        >
            <motion.div
                data-scrollable
                className="relative flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-6 pt-20 sm:px-8 sm:pt-24 lg:px-10"
                initial={{ y: 28, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 16, opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE_OUT_QUART, delay: 0.05 }}
            >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d8e1ec] pb-4">
                    <div>
                        <p className="font-michroma text-[10px] tracking-[0.2em] text-[#737b86]">
                            LOOK {twin.lookNumber} · {twin.archetype}
                        </p>
                        <h3 className="mt-1 text-xl font-bold tracking-[-0.02em] text-[#16191f] sm:text-2xl">{twin.name}</h3>
                    </div>

                    <div className="flex items-center gap-1.5" role="tablist" aria-label="Digital twins">
                        {DIGITAL_TWINS.map((item, i) => (
                            <button
                                key={item.lookNumber}
                                type="button"
                                role="tab"
                                aria-selected={i === twinIndex}
                                onClick={() => onSelectTwin(i)}
                                className={`font-michroma h-8 rounded-full px-3 text-[10px] tracking-[0.14em] transition-colors duration-300 ${
                                    i === twinIndex
                                        ? 'bg-[#16191f] text-white shadow-sm'
                                        : 'border border-[#d0dae6] bg-white/80 text-[#5a6270] hover:border-[#16191f] hover:text-[#16191f]'
                                }`}
                            >
                                #{item.lookNumber}
                            </button>
                        ))}
                    </div>
                </div>

                <TwinPoseStage twin={twin} poseIndex={poseIndex} onSelectPose={setPoseIndex} onStepPose={stepPose} />
            </motion.div>

            <motion.aside
                data-scrollable
                className="flex flex-col justify-between overflow-y-auto border-t border-[#d8e1ec] bg-white p-6 sm:p-8 lg:border-l lg:border-t-0 lg:pt-24"
                aria-label="Digital twin preset actions"
                initial={{ x: 48, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 32, opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE_OUT_QUART, delay: 0.1 }}
            >
                <TwinPresetSidebar twin={twin} pose={pose} pendingAction={pendingAction} onAction={handleAction} />
            </motion.aside>

            <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label="Close pose preset view"
                className="absolute right-5 top-5 z-10 grid h-11 w-11 place-items-center rounded-full bg-[#16191f] text-white shadow-xl transition-transform duration-300 hover:rotate-90 hover:scale-110 sm:right-8 sm:top-6"
            >
                <X size={20} />
            </button>
        </motion.div>
    );
}
