import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { CustomOrderCta, orderUrl, PAD_X, Reveal, SectionIntro, SectionProps } from '../shared';
import { LOOKS } from './looks';
import { LookView } from './LookView';
import { PieceCards } from './PieceCards';
import { RunwayStage } from './RunwayStage';
import { useRingRunway } from './useRingRunway';

/** How long each look stays at the front before the ring turns by itself. */
const AUTOPLAY_MS = 5000;

/**
 * Section 02 — a ring runway of styled looks. Clicking the front model opens the look view,
 * where each garment can be inspected beside the model.
 */
export const TryOnSection = memo(function TryOnSection({ active, onOverlayChange }: SectionProps) {
    const [lookIndex, setLookIndex] = useState(0);
    const [lookOpen, setLookOpen] = useState(false);
    const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
    const [hotPin, setHotPin] = useState<number | null>(null);
    const cardRefs = useRef<(HTMLLIElement | null)[]>([]);

    const handleLookChange = useCallback((index: number) => {
        setLookIndex(index);
        setHotPin(null);
    }, []);

    const openLook = useCallback(() => {
        setSelectedPiece(null);
        setLookOpen(true);
    }, []);

    const closeLook = useCallback(() => {
        setLookOpen(false);
        setSelectedPiece(null);
        setHotPin(null);
    }, []);

    const runway = useRingRunway({
        running: active,
        interactive: !lookOpen,
        onLookChange: handleLookChange,
        onFrontActorClick: openLook,
    });
    const { stepLook, isDragging } = runway;

    // The look view is a fullscreen overlay: tell Home to pause section scrolling and hide its chrome.
    useEffect(() => {
        onOverlayChange?.(lookOpen);
    }, [lookOpen, onOverlayChange]);

    useEffect(() => () => onOverlayChange?.(false), [onOverlayChange]);

    const autoplaying = active && !lookOpen;

    // Warm the cache for every garment once the section is first shown, so cards never wipe in empty.
    const preloaded = useRef(false);
    useEffect(() => {
        if (!active || preloaded.current) {
            return;
        }
        preloaded.current = true;
        new Set(LOOKS.flatMap((item) => item.pieces.map((piece) => piece.image))).forEach((src) => {
            new Image().src = src;
        });
    }, [active]);

    useEffect(() => {
        if (!autoplaying) {
            return;
        }
        const timer = window.setTimeout(() => {
            if (!isDragging()) {
                stepLook(1);
            }
        }, AUTOPLAY_MS);
        return () => window.clearTimeout(timer);
    }, [autoplaying, lookIndex, stepLook, isDragging]);

    /** Escape / click-outside: close the open garment first, then the look view. */
    const dismiss = useCallback(() => {
        if (selectedPiece !== null) {
            setSelectedPiece(null);
        } else {
            closeLook();
        }
    }, [selectedPiece, closeLook]);

    useEffect(() => {
        if (!lookOpen) {
            return;
        }
        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                event.stopPropagation();
                dismiss();
            }
        };
        window.addEventListener('keydown', onKey, true);
        return () => window.removeEventListener('keydown', onKey, true);
    }, [lookOpen, dismiss]);

    /** Shared by the markers on the model and the sidebar cards: toggles a garment's large view. */
    const selectPiece = (pieceIndex: number) => {
        if (!lookOpen) {
            openLook();
        } else if (selectedPiece === pieceIndex) {
            setSelectedPiece(null);
            setHotPin(null);
            return;
        }
        setSelectedPiece(pieceIndex);
        setHotPin(pieceIndex);
        cardRefs.current[pieceIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    };

    const look = LOOKS[lookIndex] ?? LOOKS[0];
    const fadeWhenOpen = `transition-opacity duration-300 ${lookOpen ? 'pointer-events-none opacity-0' : 'opacity-100'}`;

    return (
        <div
            className={`relative grid h-full w-full grid-cols-1 grid-rows-[minmax(0,1fr)_auto] gap-4 overflow-hidden bg-[radial-gradient(ellipse_at_55%_35%,#f2f6fa_0%,#e7eff7_60%,#dde8f2_100%)] pb-6 pt-20 text-[#151413] sm:pb-8 sm:pt-24 lg:grid-cols-[minmax(0,1fr)_280px] lg:grid-rows-1 lg:gap-8 ${PAD_X}`}
        >
            {/* Floor shade spans the whole section, so the runway and its controls sit on one seamless backdrop. */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-[46%] bg-[linear-gradient(to_top,rgba(21,20,19,0.08),rgba(21,20,19,0.025)_55%,transparent)]"
            />

            <div className="relative flex min-h-0 flex-col">
                <SectionIntro active={active} title="Virtual Try-On" className={`relative z-10 ${fadeWhenOpen}`}>
                    Six looks, styled head to toe. Click the front model to shop each piece, or drag to spin the runway.
                </SectionIntro>

                <RunwayStage
                    stageRef={runway.stageRef}
                    actorRefs={runway.actorRefs}
                    cursorRef={runway.cursorRef}
                    cursor={runway.cursor}
                    dimmed={lookOpen}
                    handlers={runway.stageHandlers}
                />

                <div className={`relative z-10 flex flex-col items-center gap-1 pt-1 ${fadeWhenOpen}`}>
                    <Reveal active={active} delay={0.2} className="flex flex-col items-center gap-2 text-center">
                        <p className="font-michroma text-sm tracking-[0.14em] text-ink sm:text-base">{look.modelName}</p>
                        <div className="flex items-center gap-1.5" role="img" aria-label={`Look ${lookIndex + 1} of ${LOOKS.length}`}>
                            {LOOKS.map((_, i) => (
                                <span
                                    key={i}
                                    className={`h-1 rounded-full transition-all duration-500 ${i === lookIndex ? 'w-6 bg-primary' : 'w-1.5 bg-ink/20'}`}
                                />
                            ))}
                        </div>
                    </Reveal>
                </div>

                <LookView
                    open={lookOpen}
                    look={look}
                    lookIndex={lookIndex}
                    selectedPiece={selectedPiece}
                    hotPin={hotPin}
                    onHotPinChange={setHotPin}
                    onPinClick={selectPiece}
                    onDismiss={dismiss}
                    onClose={closeLook}
                    getOriginRect={runway.getFrontActorRect}
                />
            </div>

            <CustomOrderCta
                active={active}
                href={orderUrl('virtual-try-on', look.name)}
                question="Want this look on your own garments?"
                buttonLabel="Start Try-On Now"
                className={fadeWhenOpen}
            />

            <aside aria-label="In this look" className="relative min-h-0 lg:pt-2">
                <Reveal active={active} delay={0.2} x="36px" y="0px" className="h-full">
                    <PieceCards
                        look={look}
                        lookIndex={lookIndex}
                        hotPin={hotPin}
                        selectedPiece={lookOpen ? selectedPiece : null}
                        cardRefs={cardRefs}
                        onHotPinChange={setHotPin}
                        onSelect={selectPiece}
                    />
                </Reveal>
            </aside>
        </div>
    );
});
