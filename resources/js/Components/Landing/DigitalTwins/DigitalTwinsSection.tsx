import React, { memo, useCallback, useRef, useState } from 'react';
import { Link } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { CustomOrderCta, orderUrl, Reveal, SectionIntro, SectionProps } from '../shared';
import { TwinCursor } from './TwinCursor';
import { TwinNameLabel } from './TwinNameLabel';
import { TwinPosePreview } from './TwinPosePreview';
import { TwinPresetModal } from './TwinPresetModal';
import { TwinSpriteCrop } from './TwinSpriteCrop';
import { DIGITAL_TWINS } from './twins';
import { useTwinRunway } from './useTwinRunway';

const STAGE_BACKGROUND =
    'linear-gradient(transparent 60%, rgba(255,255,255,0.72) 100%), linear-gradient(90deg, #f1f5fa 0%, #e7eff6 38%, #eef4f9 62%, #f6f9fc 100%)';

const SIDE_ARROW =
    'grid h-12 w-12 cursor-pointer place-items-center rounded-full border border-ink/20 bg-white/90 text-ink shadow-[0_8px_32px_-8px_color-mix(in_srgb,var(--color-ink)_22%,transparent)] backdrop-blur-sm transition-all duration-300 hover:bg-ink hover:text-white hover:scale-110 hover:shadow-[0_12px_40px_-10px_color-mix(in_srgb,var(--color-ink)_45%,transparent)]';

/** Section 01 — a runway of AI digital twins; clicking one opens its pose-preset modal. */
export const DigitalTwinsSection = memo(function DigitalTwinsSection({ active, onOverlayChange }: SectionProps) {
    const [modalTwinIndex, setModalTwinIndex] = useState<number | null>(null);

    const openModal = useCallback(
        (index: number) => {
            setModalTwinIndex(index);
            onOverlayChange?.(true);
        },
        [onOverlayChange],
    );

    const closeModal = useCallback(() => {
        setModalTwinIndex(null);
        onOverlayChange?.(false);
    }, [onOverlayChange]);

    const runway = useTwinRunway({ running: active && modalTwinIndex === null, onOpenTwin: openModal });
    const activeTwin = DIGITAL_TWINS[runway.activeTwinIndex] ?? DIGITAL_TWINS[0];

    // Only track preview on the ACTIVE (front) model — never on blurry background models.
    const previewIndex = useRef(0);
    if (runway.hoveredTwinIndex !== null && runway.hoveredTwinIndex === runway.activeTwinIndex) {
        previewIndex.current = runway.hoveredTwinIndex;
    }

    const selectTwinInModal = (index: number) => {
        runway.focusTwin(index);
        setModalTwinIndex(index);
    };

    return (
        <div className="relative h-full w-full select-none overflow-hidden bg-white">
            <section
                ref={runway.stageRef}
                aria-label="Digital Twins runway. Hover a model to preview its poses, click to see every pose and buy, or drag to step through the models."
                {...runway.stageHandlers}
                className={`relative h-full w-full touch-pan-y select-none overflow-hidden ${runway.cursorMode === 'hidden' ? '' : 'lg:cursor-none'}`}
                style={{ background: STAGE_BACKGROUND }}
            >
                <div className="absolute inset-0 overflow-hidden">
                    {DIGITAL_TWINS.map((twin, i) => {
                        const isFrontModel = i === runway.activeTwinIndex;
                        const isHovered = runway.hoveredTwinIndex === i && isFrontModel;
                        const showPreview = isFrontModel && i === previewIndex.current;

                        return (
                            <div
                                key={twin.lookNumber}
                                ref={(el) => {
                                    runway.modelRefs.current[i] = el;
                                }}
                                data-twin-model={i}
                                role="button"
                                tabIndex={0}
                                aria-label={`View ${twin.name} poses`}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter' || event.key === ' ') {
                                        event.preventDefault();
                                        openModal(i);
                                    }
                                }}
                                className="absolute left-0 top-0 origin-top-left will-change-transform"
                            >
                                {/* Ground shadow */}
                                <span
                                    aria-hidden="true"
                                    className="pointer-events-none absolute -bottom-[1.6%] left-[8%] right-[8%] h-[3.6%] rounded-[50%] bg-[radial-gradient(closest-side,rgba(70,85,105,0.24),transparent)]"
                                />

                                <TwinSpriteCrop twin={twin} className="relative block h-full w-full" />

                                {/* Model name only — directly under the front active model */}
                                {isFrontModel && <TwinNameLabel twin={twin} />}

                                {/* Pose preview cards — 3 large cards to the right of the front model on hover */}
                                {showPreview && (
                                    <TwinPosePreview twin={twin} visible={isHovered} />
                                )}
                            </div>
                        );
                    })}
                </div>

                <SectionIntro
                    active={active}
                    title="Digital Twins"
                    cursorFree
                    titleClassName="text-[clamp(28px,3.6vw,52px)] font-bold"
                    bodyClassName="text-base font-semibold text-ink-2 sm:text-lg"
                    className="pointer-events-none absolute left-5 top-20 z-20 sm:left-10 sm:top-24 lg:left-16 lg:top-28"
                >
                    Shoot a garment once. Our photoreal AI models wear it in every pose, light and angle.
                </SectionIntro>

                {/* ── Left arrow — left edge, vertically centred ── */}
                <Reveal active={active} delay={0.3} className="pointer-events-auto absolute left-4 top-1/2 z-30 -translate-y-1/2 sm:left-6 lg:left-8">
                    <button
                        type="button"
                        onClick={() => runway.stepLook(-1)}
                        aria-label="Previous digital twin"
                        className={SIDE_ARROW}
                    >
                        <ArrowLeft size={20} />
                    </button>
                </Reveal>

                {/* ── Right arrow — right edge, vertically centred ── */}
                <Reveal active={active} delay={0.34} className="pointer-events-auto absolute right-4 top-1/2 z-30 -translate-y-1/2 sm:right-6 lg:right-8">
                    <button
                        type="button"
                        onClick={() => runway.stepLook(1)}
                        aria-label="Next digital twin"
                        className={SIDE_ARROW}
                    >
                        <ArrowRight size={20} />
                    </button>
                </Reveal>

                <CustomOrderCta
                    active={active}
                    href={orderUrl('digital-twins', activeTwin.name)}
                    question="Want a custom model?"
                    buttonLabel="Order now"
                />

                {/* Right side bottom: Explore more -> full catalogue */}
                <div className="absolute bottom-6 right-[8rem] z-20 sm:bottom-10 sm:right-[9.5rem]">
                    <Reveal active={active} delay={0.32}>
                        <Link
                            href="/digital-twins"
                            className="group inline-flex cursor-pointer items-center gap-2 rounded-full border border-ink/15 bg-white/80 px-5 py-3 text-xs font-semibold text-ink shadow-[0_10px_28px_-12px_color-mix(in_srgb,var(--color-ink)_15%,transparent)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/60 hover:bg-white hover:text-primary active:scale-95 sm:text-sm"
                        >
                            Explore more
                            <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Link>
                    </Reveal>
                </div>

                <TwinCursor cursorRef={runway.cursorRef} mode={runway.cursorMode} />
            </section>

            <TwinPresetModal
                twinIndex={modalTwinIndex}
                onSelectTwin={selectTwinInModal}
                onClose={closeModal}
            />
        </div>
    );
});
