import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { router } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { digitalTwinOrderUrl, EASE_OUT_QUART } from '../shared';
import { TwinPoseStage } from './TwinPoseStage';
import { PresetAction, TwinPresetSidebar } from './TwinPresetSidebar';
import { DIGITAL_TWINS, DigitalTwinModel } from './twins';

interface TwinPresetModalProps {
    /** Dynamic list of Digital Twins. */
    twins?: DigitalTwinModel[];
    /** Twin to show, or null when the modal is closed. */
    twinIndex: number | null;
    onSelectTwin: (index: number) => void;
    onClose: () => void;
}

/** Pause between picking a purchase action and navigating to the order page, so the confirmation is readable. */
const ACTION_FEEDBACK_MS = 220;

/**
 * Fullscreen pose-preset overlay for a digital twin.
 */
export function TwinPresetModal({ twins, twinIndex, onSelectTwin, onClose }: TwinPresetModalProps) {
    return (
        <AnimatePresence>
            {twinIndex !== null && (
                <TwinPresetPanel twins={twins} twinIndex={twinIndex} onSelectTwin={onSelectTwin} onClose={onClose} />
            )}
        </AnimatePresence>
    );
}

const MODEL_ARROW =
    'absolute top-1/3 z-20 grid h-11 w-11 place-items-center rounded-full border border-ink/20 bg-white/90 text-ink shadow-[0_8px_28px_-8px_color-mix(in_srgb,var(--color-ink)_30%,transparent)] backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-ink hover:text-white lg:top-1/2 lg:-translate-y-1/2';

function TwinPresetPanel({ twins, twinIndex, onSelectTwin, onClose }: TwinPresetModalProps & { twinIndex: number }) {
    const models = twins && twins.length > 0 ? twins : DIGITAL_TWINS;
    const [poseIndex, setPoseIndex] = useState(0);
    const [pendingAction, setPendingAction] = useState<PresetAction | null>(null);
    const actionTimer = useRef(0);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    const twin = models[twinIndex] ?? models[0];
    const poseCount = twin.poses.length;
    const pose = twin.poses[poseIndex] ?? twin.poses[0];

    // Switching twin starts again from its first pose.
    const [shownTwin, setShownTwin] = useState(twinIndex);
    if (shownTwin !== twinIndex) {
        setShownTwin(twinIndex);
        setPoseIndex(0);
        setPendingAction(null);
    }

    const stepTwin = (delta: number) => onSelectTwin((twinIndex + delta + models.length) % models.length);

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
            const mode = action === 'lifetime' ? 'lifetime' : action === 'buy' ? 'preset' : 'custom';
            router.visit(
                digitalTwinOrderUrl({
                    mode,
                    twin: twin.slug,
                    ref: twin.name,
                }),
            );
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
            {/* Left side: pose stage with previous / next model arrows on either side */}
            <motion.div
                data-scrollable
                className="relative flex min-h-0 flex-1 flex-col overflow-y-auto px-14 pb-6 pt-16 sm:px-16 lg:px-16 lg:pt-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 16, opacity: 0 }}
                transition={{ duration: 0.45, ease: EASE_OUT_QUART, delay: 0.05 }}
            >
                <TwinPoseStage twin={twin} poseIndex={poseIndex} onSelectPose={setPoseIndex} onStepPose={stepPose} />
            </motion.div>

            {/* Previous / next model — fixed at the two sides of the stage */}
            <button
                type="button"
                onClick={() => stepTwin(-1)}
                aria-label="Previous digital twin"
                className={`${MODEL_ARROW} left-3 sm:left-5`}
            >
                <ArrowLeft size={20} />
            </button>
            <button
                type="button"
                onClick={() => stepTwin(1)}
                aria-label="Next digital twin"
                className={`${MODEL_ARROW} right-3 sm:right-5 lg:right-[396px] xl:right-[426px]`}
            >
                <ArrowRight size={20} />
            </button>

            {/* Right side: Clean action sidebar with model name, description, and action buttons */}
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
                className="absolute right-5 top-5 z-10 grid h-10 w-10 place-items-center rounded-full bg-ink text-white shadow-xl transition-transform duration-300 hover:rotate-90 hover:scale-110 sm:right-7 sm:top-5"
            >
                <X size={18} />
            </button>
        </motion.div>
    );
}
