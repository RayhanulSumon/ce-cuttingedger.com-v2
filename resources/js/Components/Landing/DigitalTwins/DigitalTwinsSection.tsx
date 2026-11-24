import React, { memo, useCallback, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
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

/** Shifted desktop X depth stops so the runway sits cleanly in the right ~65% beside the centered-left intro. */
const DESKTOP_CENTERED_X_STOPS = [1.24, 0.80, 0.62, 0.50, 0.415, 0.35, 0.295] as const;

interface DigitalTwinsSectionProps extends SectionProps {
    twins?: DigitalTwinModel[];
}

/** Section 01 — a runway of AI digital twins with left-aligned intro and runway navigation. */
export const DigitalTwinsSection = memo(function DigitalTwinsSection({
    active,
    twins,
    onOverlayChange,
}: DigitalTwinsSectionProps) {
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

    const runway = useTwinRunway({
        running: active && modalTwinIndex === null,
        twins: models,
        desktopXStops: DESKTOP_CENTERED_X_STOPS,
        onOpenTwin: openModal,
    });
    const activeTwin = models[runway.activeTwinIndex] ?? models[0];

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
                className={`relative isolate h-full w-full touch-pan-y select-none overflow-hidden ${runway.cursorMode === 'hidden' ? '' : 'lg:cursor-none'}`}
                style={{ background: STAGE_BACKGROUND }}
            >
                <div className="absolute inset-0 z-0 isolate overflow-hidden sm:[mask-image:linear-gradient(90deg,transparent_26%,black_40%)]">
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

                                {/* Model name & Sold Out stamp — directly on the front active model */}
                                {isFrontModel && <TwinNameLabel twin={twin} />}

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
                    titleClassName="text-[clamp(32px,3.4vw,46px)] font-bold leading-[1.04]"
                    bodyClassName="text-sm text-muted sm:text-base lg:text-[17px] leading-relaxed"
                    bodyMaxWidthClassName="max-w-[38ch]"
                    className="absolute left-5 top-24 z-20 max-w-[calc(100%-2.5rem)] sm:left-10 sm:top-1/2 sm:max-w-[390px] sm:-translate-y-1/2 lg:left-16 lg:max-w-[430px]"
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
                    Shoot a garment once. Our photoreal AI models preserve exact fabric drape and studio lighting across every pose and angle.
                </SectionIntro>

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
