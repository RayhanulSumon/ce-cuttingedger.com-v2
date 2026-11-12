import React, { memo, useCallback, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { OrderCta, orderUrl, Reveal, SectionIntro, SectionProps } from '../shared';
import { TwinCursor } from './TwinCursor';
import { TwinPosePreview } from './TwinPosePreview';
import { TwinPresetModal } from './TwinPresetModal';
import { TwinSpriteCrop } from './TwinSpriteCrop';
import { DIGITAL_TWINS } from './twins';
import { useTwinRunway } from './useTwinRunway';

const STAGE_BACKGROUND =
    'linear-gradient(transparent 60%, rgba(255,255,255,0.72) 100%), linear-gradient(90deg, #f1f5fa 0%, #e7eff6 38%, #eef4f9 62%, #f6f9fc 100%)';

const ROUND_BUTTON =
    'grid h-11 w-11 place-items-center rounded-full border border-[#16191f]/25 bg-white/85 text-[#16191f] transition-colors duration-300 hover:bg-[#16191f] hover:text-white';

/** "Celeste M. — Pleated Couture Twin" → ["Celeste M.", "Pleated Couture Twin"]. */
const splitTwinName = (name: string) => name.split(' — ');

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
    const [activeName, activeStyle] = splitTwinName(activeTwin.name);

    // Keep showing the last hovered twin's poses while the preview fades out.
    const previewIndex = useRef(0);
    if (runway.hoveredTwinIndex !== null) {
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
                <div className="absolute inset-0">
                    {DIGITAL_TWINS.map((twin, i) => (
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
                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute -bottom-[1.6%] left-[8%] right-[8%] h-[3.6%] rounded-[50%] bg-[radial-gradient(closest-side,rgba(70,85,105,0.24),transparent)]"
                            />
                            <TwinSpriteCrop twin={twin} className="relative block h-full w-full" />
                        </div>
                    ))}
                </div>

                <SectionIntro
                    active={active}
                    title="Digital Twins"
                    className="pointer-events-none absolute left-5 top-20 z-20 sm:left-10 sm:top-24 lg:left-16 lg:top-28"
                >
                    Shoot a garment once. Our photoreal AI models wear it in every pose, light and angle.
                </SectionIntro>

                <TwinPosePreview twin={DIGITAL_TWINS[previewIndex.current]} visible={runway.hoveredTwinIndex !== null} />

                {/* Bottom bar: front model's name · custom order · runway arrows */}
                <div className="absolute inset-x-5 bottom-6 z-20 grid grid-cols-[1fr_auto] items-end gap-x-4 gap-y-4 sm:inset-x-10 sm:bottom-10 sm:grid-cols-[1fr_auto_1fr] lg:inset-x-16">
                    <Reveal active={active} delay={0.2} className="pointer-events-none col-span-2 sm:col-span-1">
                        <div key={activeTwin.index} className="animate-card-in" aria-live="polite">
                            <p className="font-michroma text-[clamp(24px,3.4vw,50px)] leading-[1.05] tracking-[0.08em] text-[#16191f]">
                                {activeName}
                            </p>
                            <p className="mt-1.5 text-sm font-medium text-[#5d6572]">{activeStyle}</p>
                        </div>
                    </Reveal>

                    <Reveal active={active} delay={0.28} className="justify-self-start sm:justify-self-center">
                        <OrderCta href={orderUrl('digital-twins', activeTwin.name)}>Want another model? Order now</OrderCta>
                    </Reveal>

                    <Reveal active={active} delay={0.34} className="flex items-center gap-2.5 justify-self-end">
                        <button type="button" onClick={() => runway.stepLook(-1)} aria-label="Previous digital twin" className={ROUND_BUTTON}>
                            <ArrowLeft size={18} />
                        </button>
                        <button type="button" onClick={() => runway.stepLook(1)} aria-label="Next digital twin" className={ROUND_BUTTON}>
                            <ArrowRight size={18} />
                        </button>
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
