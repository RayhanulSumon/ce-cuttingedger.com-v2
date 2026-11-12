import React, { memo, useCallback, useState } from 'react';
import { ArrowLeft, ArrowRight, Eye } from 'lucide-react';
import { Eyebrow, Reveal, SectionProps } from '../shared';
import { TwinCursor } from './TwinCursor';
import { TwinPresetModal } from './TwinPresetModal';
import { TwinSpriteCrop } from './TwinSpriteCrop';
import { DIGITAL_TWINS, TWIN_FIRST_LOOK } from './twins';
import { useTwinRunway } from './useTwinRunway';

const TWIN_COUNT = DIGITAL_TWINS.length;

const STAGE_BACKGROUND =
    'linear-gradient(transparent 60%, rgba(255,255,255,0.72) 100%), linear-gradient(90deg, #f1f5fa 0%, #e7eff6 38%, #eef4f9 62%, #f6f9fc 100%)';

const ROUND_BUTTON =
    'grid h-11 w-11 place-items-center rounded-full border border-[#16191f]/25 bg-white/85 text-[#16191f] transition-colors duration-300 hover:bg-[#16191f] hover:text-white';

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

    const selectTwinInModal = (index: number) => {
        runway.focusTwin(index);
        setModalTwinIndex(index);
    };

    return (
        <div className="relative h-full w-full select-none overflow-hidden bg-white">
            <section
                ref={runway.stageRef}
                aria-label="Digital Twins runway lookbook. Hover a model and click View to inspect pose presets, or drag to step through looks."
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
                            aria-label={`View ${twin.name} pose presets`}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter' || event.key === ' ') {
                                    event.preventDefault();
                                    openModal(i);
                                }
                            }}
                            className="group absolute left-0 top-0 origin-top-left will-change-transform lg:cursor-none"
                        >
                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute -bottom-[1.6%] left-[8%] right-[8%] h-[3.6%] rounded-[50%] bg-[radial-gradient(closest-side,rgba(70,85,105,0.24),transparent)]"
                            />
                            <TwinSpriteCrop twin={twin} className="relative block h-full w-full" />
                            <span
                                aria-hidden="true"
                                className="font-michroma pointer-events-none absolute -bottom-5 left-1/2 w-max max-w-[140px] -translate-x-1/2 truncate text-center text-[8px] tracking-[0.14em] text-[#16191f]/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                            >
                                {twin.name.split(' — ')[0]}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Intro */}
                <div className="pointer-events-none absolute left-5 top-20 z-20 max-w-[420px] sm:left-10 sm:top-24 lg:left-14 lg:top-28">
                    <Reveal active={active}>
                        <Eyebrow>01 / Digital Twins · AI Generated Imagery</Eyebrow>
                    </Reveal>
                    <Reveal active={active} delay={0.08}>
                        <h2 className="font-michroma mt-2.5 text-[clamp(18px,2vw,26px)] font-normal leading-[1.2] tracking-[0.16em] text-[#16191f]">
                            Spring Summer 2027
                        </h2>
                    </Reveal>
                    <Reveal active={active} delay={0.16}>
                        <p className="mt-3 hidden text-xs leading-[1.62] tracking-[0.012em] text-[#737b86] sm:block sm:text-sm">
                            A study in softness and strength. Shoot a garment once — our photoreal AI digital twins wear it
                            across every studio pose, lighting preset, and lookbook angle. Hover any model and click{' '}
                            <strong className="font-semibold text-[#16191f]">View</strong> to explore pose presets.
                        </p>
                    </Reveal>
                </div>

                {/* Rolling look counter + actions */}
                <div className="absolute bottom-6 left-5 z-20 sm:bottom-10 sm:left-10 lg:left-14">
                    <Reveal active={active} delay={0.24}>
                        <div className="font-michroma pointer-events-none flex items-center gap-3 text-[clamp(22px,2.4vw,34px)] leading-[38px] tracking-[0.14em] text-[#16191f]">
                            <span>Look</span>
                            <span className="h-[38px] overflow-hidden" aria-hidden="true">
                                <span ref={runway.counterRef} className="block will-change-transform">
                                    {Array.from({ length: TWIN_COUNT + 1 }, (_, i) => (
                                        <b key={i} className="block h-[38px] font-normal">
                                            {TWIN_FIRST_LOOK + (i % TWIN_COUNT)}
                                        </b>
                                    ))}
                                </span>
                            </span>
                            <span className="sr-only" aria-live="polite">
                                {activeTwin.lookNumber}
                            </span>
                        </div>

                        <p className="mt-0.5 text-xs font-medium text-[#737b86]">{activeTwin.name}</p>

                        <div className="mt-3 flex flex-wrap items-center gap-4">
                            <button
                                type="button"
                                onClick={() => openModal(runway.activeTwinIndex)}
                                className="font-michroma inline-flex items-center gap-2 border-b border-[#16191f] pb-1 text-[10px] tracking-[0.14em] text-[#16191f] transition-opacity hover:opacity-70"
                            >
                                <Eye size={13} />
                                View Pose Presets ({activeTwin.poses.length} Poses)
                            </button>
                            <button
                                type="button"
                                onClick={openDemo}
                                className="font-michroma inline-block border-b border-[#737b86] pb-1 text-[10px] tracking-[0.14em] text-[#737b86] transition-colors hover:border-[#16191f] hover:text-[#16191f]"
                            >
                                Create My Twin
                            </button>
                        </div>
                    </Reveal>
                </div>

                {/* Runway navigation */}
                <div className="absolute bottom-6 right-5 z-20 sm:bottom-10 sm:right-10 lg:right-14">
                    <Reveal active={active} delay={0.32} className="flex items-center gap-2.5">
                        <button type="button" onClick={() => runway.stepLook(-1)} aria-label="Previous digital twin" className={ROUND_BUTTON}>
                            <ArrowLeft size={18} />
                        </button>
                        <button
                            type="button"
                            onClick={() => openModal(runway.activeTwinIndex)}
                            className="font-michroma hidden h-11 items-center gap-2 rounded-full bg-[#16191f] px-5 text-[10px] tracking-[0.16em] text-white shadow-sm transition-colors duration-300 hover:bg-black sm:inline-flex"
                        >
                            <Eye size={14} />
                            View Poses
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
