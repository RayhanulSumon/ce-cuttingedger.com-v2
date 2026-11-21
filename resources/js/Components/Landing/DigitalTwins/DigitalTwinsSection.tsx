import React, { memo, useCallback, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { digitalTwinOrderUrl, OrderCta, PillButton, Reveal, SectionIntro, SectionProps } from '../shared';
import { TwinCursor } from './TwinCursor';
import { TwinNameLabel } from './TwinNameLabel';
import { TwinPosePreview } from './TwinPosePreview';
import { TwinPresetModal } from './TwinPresetModal';
import { TwinSpriteCrop } from './TwinSpriteCrop';
import { DIGITAL_TWINS, DigitalTwinModel } from './twins';
import { useTwinRunway } from './useTwinRunway';

const STAGE_BACKGROUND =
    'linear-gradient(transparent 60%, color-mix(in srgb, var(--color-surface) 72%, transparent) 100%), linear-gradient(90deg, var(--color-page) 0%, var(--color-surface-2) 55%, var(--color-surface) 100%)';

const SIDE_ARROW =
    'grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-ink/15 bg-surface/85 text-ink shadow-[0_8px_24px_-10px_rgba(16,17,20,0.25)] backdrop-blur-md transition-colors duration-200 hover:border-ink hover:bg-ink hover:text-surface sm:h-11 sm:w-11';

interface DigitalTwinsSectionProps extends SectionProps {
    twins?: DigitalTwinModel[];
}

/** Section 01 — a runway of AI digital twins; clicking one opens its pose-preset modal. */
export const DigitalTwinsSection = memo(function DigitalTwinsSection({ active, twins, onOverlayChange }: DigitalTwinsSectionProps) {
    const models = twins && twins.length > 0 ? twins : DIGITAL_TWINS;
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

    const runway = useTwinRunway({ running: active && modalTwinIndex === null, twins: models, onOpenTwin: openModal });
    const activeTwin = models[runway.activeTwinIndex] ?? models[0];

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
        <div className="relative h-full w-full select-none overflow-hidden bg-surface">
            <section
                ref={runway.stageRef}
                aria-label="Digital Twins runway. Hover a model to preview its poses, click to see every pose and buy, or drag to step through the models."
                {...runway.stageHandlers}
                className={`relative h-full w-full touch-pan-y select-none overflow-hidden ${runway.cursorMode === 'hidden' ? '' : 'lg:cursor-none'}`}
                style={{ background: STAGE_BACKGROUND }}
            >
                <div className="absolute inset-0 overflow-hidden">
                    {models.map((twin, i) => {
                        const isFrontModel = i === runway.activeTwinIndex;
                        const isHovered = runway.hoveredTwinIndex === i && isFrontModel;
                        const showPreview = isFrontModel && i === previewIndex.current;

                        return (
                            <div
                                key={twin.id ?? twin.lookNumber ?? i}
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

                                {/* Pose preview cards — 3 large cards to the right of the front model on hover */}
                                {showPreview && <TwinPosePreview twin={twin} visible={isHovered} />}
                            </div>
                        );
                    })}
                </div>

                <SectionIntro
                    active={active}
                    title="Digital Twins"
                    cursorFree
                    titleClassName="text-section"
                    bodyClassName="text-sm text-muted sm:text-base"
                    className="absolute left-5 top-24 z-20 max-w-[calc(100%-2.5rem)] sm:left-10 sm:top-24 sm:w-fit lg:left-16 lg:top-28"
                    actions={
                        <>
                            <OrderCta
                                href={digitalTwinOrderUrl({ mode: 'custom', twin: activeTwin.slug, ref: activeTwin.name })}
                                className="max-sm:h-9 max-sm:px-4"
                            >
                                Order Custom Model
                            </OrderCta>
                            <PillButton
                                href="/capabilities/2d/digital-twins"
                                variant="outline"
                                className="max-sm:h-9 max-sm:px-4"
                            >
                                Explore Catalog
                                <ArrowUpRight size={14} className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                            </PillButton>
                        </>
                    }
                >
                    Shoot a garment once. Our photoreal AI models wear it in every pose, light and angle.
                </SectionIntro>

                {/* ── Left arrow — left edge ── */}
                <Reveal active={active} delay={0.3} className="pointer-events-auto absolute left-3 top-[60%] z-30 -translate-y-1/2 sm:left-6 sm:top-1/2 lg:left-8">
                    <button
                        type="button"
                        onClick={() => runway.stepLook(-1)}
                        aria-label="Previous digital twin"
                        className={SIDE_ARROW}
                    >
                        <ArrowLeft size={18} />
                    </button>
                </Reveal>

                {/* ── Right arrow — right edge ── */}
                <Reveal active={active} delay={0.34} className="pointer-events-auto absolute right-3 top-[60%] z-30 -translate-y-1/2 sm:right-6 sm:top-1/2 lg:right-8">
                    <button
                        type="button"
                        onClick={() => runway.stepLook(1)}
                        aria-label="Next digital twin"
                        className={SIDE_ARROW}
                    >
                        <ArrowRight size={18} />
                    </button>
                </Reveal>

                {/* Unscaled active twin caption */}
                <Reveal
                    active={active}
                    delay={0.28}
                    className="pointer-events-none absolute bottom-5 left-1/2 z-20 -translate-x-1/2 sm:bottom-7 sm:left-[74.4%]"
                >
                    <TwinNameLabel twin={activeTwin} index={runway.activeTwinIndex} total={models.length} />
                </Reveal>

                <TwinCursor cursorRef={runway.cursorRef} mode={runway.cursorMode} />
            </section>

            <TwinPresetModal
                twins={models}
                twinIndex={modalTwinIndex}
                onSelectTwin={selectTwinInModal}
                onClose={closeModal}
            />
        </div>
    );
});
