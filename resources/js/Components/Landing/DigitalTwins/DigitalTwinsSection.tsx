import React, { memo, useCallback, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { OrderCta, orderUrl, Reveal, SectionIntro, SectionProps } from '../shared';
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
    'grid h-12 w-12 place-items-center rounded-full border border-[#16191f]/20 bg-white/90 text-[#16191f] shadow-[0_8px_32px_-8px_rgba(22,25,31,0.22)] backdrop-blur-sm transition-all duration-300 hover:bg-[#16191f] hover:text-white hover:scale-110 hover:shadow-[0_12px_40px_-10px_rgba(22,25,31,0.45)]';

/** Section 01 — a runway of AI digital twins; clicking one opens its pose-preset modal. */
export const DigitalTwinsSection = memo(function DigitalTwinsSection({ active, openDemo, onOverlayChange }: SectionProps) {
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
                className="relative h-full w-full touch-pan-y select-none overflow-hidden lg:cursor-none"
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
                                className="absolute left-0 top-0 origin-top-left will-change-transform lg:cursor-none"
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

                {/* ── Left side bottom: Interactive "Want a custom model? Order now" CTA ── */}
                <div className="absolute left-5 bottom-6 z-20 sm:left-10 sm:bottom-10 lg:left-16">
                    <Reveal active={active} delay={0.28}>
                        <OrderCta
                            href={orderUrl('digital-twins', activeTwin.name)}
                            label="Want a custom model?"
                            ariaLabel={`Want a custom model? Order now for ${activeTwin.name}`}
                        >
                            Order now
                        </OrderCta>
                    </Reveal>
                </div>

                <TwinCursor cursorRef={runway.cursorRef} mode={runway.cursorMode} />
            </section>

            <TwinPresetModal
                twinIndex={modalTwinIndex}
                onSelectTwin={selectTwinInModal}
                onClose={closeModal}
                openDemo={openDemo}
            />
        </div>
    );
});
