import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { router, usePage } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { PageProps } from '@/types';
import { digitalTwinOrderUrl, EASE_OUT_QUART } from '../shared';
import { TwinPoseStage } from './TwinPoseStage';
import { PresetAction, TwinPresetSidebar } from './TwinPresetSidebar';
import { DIGITAL_TWINS, DigitalTwinModel, TwinPosePreset } from './twins';

interface MailtoUserContext {
    name?: string;
    email?: string;
    company?: string | null;
    phone?: string | null;
}

type TwinPageProps = PageProps & {
    auth?: {
        user?: MailtoUserContext | null;
    };
};

const DIGITAL_TWIN_ORDER_EMAIL = 'info@cuttingedger.com';

/** Builds a pre-filled `mailto:` URL containing the selected Digital Twin license and pose details. */
function buildDigitalTwinMailtoUrl(
    action: 'buy' | 'lifetime',
    twin: DigitalTwinModel,
    pose: TwinPosePreset,
    user?: MailtoUserContext | null,
): string {
    const [name] = twin.name.split(' — ');
    const isLifetime = action === 'lifetime';

    const subject = isLifetime
        ? `Buy Lifetime Copyright — ${name} (Look ${twin.lookNumber}) — ${twin.lifetimePrice}`
        : `Buy Digital Twin Preset — ${name} (Look ${twin.lookNumber}) — ${twin.presetPrice}`;

    const packageLabel = isLifetime
        ? 'Buy lifetime copyright (Full commercial rights)'
        : `Buy this preset (All ${twin.poses.length} poses included)`;
    const price = isLifetime ? twin.lifetimePrice : twin.presetPrice;
    const posesIncluded = twin.poses.map((p) => p.shortName || p.title).join(', ');

    const bodyLines = [
        'Hello CuttingEdger Studio,',
        '',
        isLifetime
            ? 'I would like to purchase the exclusive Lifetime Copyright for the Digital Twin below:'
            : 'I would like to purchase the Digital Twin pose preset below:',
        '',
        `Model: ${name} (Look ${twin.lookNumber})`,
        `Category: ${twin.archetype}`,
        `Package: ${packageLabel}`,
        `Price: ${price}`,
        `Poses Included (${twin.poses.length}): ${posesIncluded}`,
        `Viewed Pose: ${pose.shortName || pose.code} — ${pose.title} (${pose.angle} · ${pose.lens})`,
        `Model Description: ${twin.description}`,
        '',
        'Client Details:',
        `Name: ${user?.name ?? ''}`,
        `Work Email: ${user?.email ?? ''}`,
        `Brand / Company: ${user?.company ?? ''}`,
        `Phone / WhatsApp: ${user?.phone ?? ''}`,
        'Notes: ',
    ];

    const body = bodyLines.join('\n');

    return `mailto:${DIGITAL_TWIN_ORDER_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

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
    'absolute top-[220px] z-20 grid h-9 w-9 place-items-center rounded-full border border-ink/20 bg-surface/90 text-ink shadow-[0_8px_28px_-8px_color-mix(in_srgb,var(--color-ink)_30%,transparent)] backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-ink hover:text-white sm:top-1/3 sm:h-11 sm:w-11 lg:top-1/2 lg:-translate-y-1/2';

function TwinPresetPanel({ twins, twinIndex, onSelectTwin, onClose }: TwinPresetModalProps & { twinIndex: number }) {
    const { auth } = usePage<TwinPageProps>().props;
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

        if (action === 'buy' || action === 'lifetime') {
            if (typeof window !== 'undefined') {
                window.location.href = buildDigitalTwinMailtoUrl(action, twin, pose, auth?.user);
            }
            actionTimer.current = window.setTimeout(() => {
                setPendingAction(null);
            }, 1800);
            return;
        }

        actionTimer.current = window.setTimeout(() => {
            setPendingAction(null);
            router.visit(
                digitalTwinOrderUrl({
                    mode: 'custom',
                    twin: twin.slug,
                    ref: twin.name,
                }),
            );
        }, ACTION_FEEDBACK_MS);
    };

    return (
        <motion.div
            className="fixed inset-0 z-[500] flex flex-col overflow-y-auto bg-surface-2 lg:absolute lg:grid lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_410px] lg:overflow-hidden"
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
                className="relative flex shrink-0 flex-col px-4 pb-6 pt-16 sm:px-16 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pt-6"
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
                className={`${MODEL_ARROW} left-2 sm:left-5`}
            >
                <ArrowLeft size={18} />
            </button>
            <button
                type="button"
                onClick={() => stepTwin(1)}
                aria-label="Next digital twin"
                className={`${MODEL_ARROW} right-2 sm:right-5 lg:right-[396px] xl:right-[426px]`}
            >
                <ArrowRight size={18} />
            </button>

            {/* Right side: Clean action sidebar with model name, description, and action buttons */}
            <motion.aside
                data-scrollable
                className="flex shrink-0 flex-col justify-center border-t border-line bg-surface p-5 pb-10 sm:p-8 lg:overflow-y-auto lg:border-l lg:border-t-0 lg:p-10"
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
                className="fixed right-4 top-4 z-30 grid h-10 w-10 place-items-center rounded-full bg-ink text-white shadow-xl transition-transform duration-300 hover:rotate-90 hover:scale-110 lg:absolute lg:right-7 lg:top-5"
            >
                <X size={18} />
            </button>
        </motion.div>
    );
}
