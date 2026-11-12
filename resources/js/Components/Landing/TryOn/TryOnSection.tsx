import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Eyebrow, Reveal, SectionProps } from '../shared';
import { LOOKS } from './looks';
import { LookView } from './LookView';
import { PieceCards } from './PieceCards';
import { RunwayControls } from './RunwayControls';
import { RunwayStage } from './RunwayStage';
import { useRingRunway } from './useRingRunway';

/** How long each look stays at the front while autoplay is on. Matches `.animate-rw-fill`. */
const AUTOPLAY_MS = 5000;

const toggleKey = (key: string) => (previous: Record<string, boolean>) => ({ ...previous, [key]: !previous[key] });

/**
 * Section 02 — a ring runway of styled looks. Clicking the front model opens the look view,
 * where each garment can be inspected beside the model.
 */
export const TryOnSection = memo(function TryOnSection({ active, onOverlayChange }: SectionProps) {
    const [lookIndex, setLookIndex] = useState(0);
    const [lookOpen, setLookOpen] = useState(false);
    const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
    const [hotPin, setHotPin] = useState<number | null>(null);
    const [playing, setPlaying] = useState(true);
    const [added, setAdded] = useState<Record<string, boolean>>({});
    const [wishlist, setWishlist] = useState<Record<string, boolean>>({});
    const cardRefs = useRef<(HTMLLIElement | null)[]>([]);

    const handleLookChange = useCallback((index: number) => {
        setLookIndex(index);
        setHotPin(null);
    }, []);

    const openLook = useCallback(() => {
        setPlaying(false);
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

    const autoplaying = active && playing && !lookOpen;

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

    /** Shared by the pins on the model and the sidebar cards: toggles a garment's large view. */
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
        <div className="relative grid h-full w-full grid-cols-1 gap-3 overflow-hidden bg-[radial-gradient(ellipse_at_55%_35%,#f2f6fa_0%,#e7eff7_60%,#dde8f2_100%)] p-3 pt-16 text-[#151413] sm:p-5 sm:pt-20 lg:grid-cols-[minmax(0,1fr)_270px] lg:gap-4 lg:p-6 lg:pt-20 xl:grid-cols-[minmax(0,1fr)_290px]">
            <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
                <div className={`relative z-10 px-5 pt-3 sm:px-10 sm:pt-5 lg:px-14 ${fadeWhenOpen}`}>
                    <Reveal active={active}>
                        <Eyebrow>02 / Virtual Try-On</Eyebrow>
                    </Reveal>
                    <Reveal active={active} delay={0.08}>
                        <h2 className="mt-1.5 text-[clamp(28px,3.8vw,46px)] font-normal leading-[1.06] tracking-[-0.02em] text-[#151413]">
                            Try the Look.
                        </h2>
                    </Reveal>
                    <Reveal active={active} delay={0.16}>
                        <p className="mt-1.5 max-w-[38ch] text-xs leading-[1.55] text-[#66625c]">
                            Six looks, styled head to toe. Tap the front model to view pins, or drag to spin the runway.
                        </p>
                    </Reveal>
                </div>

                <RunwayStage
                    stageRef={runway.stageRef}
                    actorRefs={runway.actorRefs}
                    cursorRef={runway.cursorRef}
                    cursor={runway.cursor}
                    dimmed={lookOpen}
                    handlers={runway.stageHandlers}
                />

                <div className={`relative z-10 px-4 pb-5 pt-1.5 sm:px-11 sm:pb-7 ${fadeWhenOpen}`}>
                    <Reveal active={active} delay={0.24} className="flex w-full items-center gap-3 sm:gap-5">
                        <RunwayControls
                            lookIndex={lookIndex}
                            playing={playing}
                            progressRunning={autoplaying}
                            onStep={runway.stepLook}
                            onSelectLook={runway.goToLook}
                            onTogglePlay={() => setPlaying((current) => !current)}
                        />
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

            <aside aria-label="In this look" className="relative flex h-full flex-col">
                <Reveal active={active} delay={0.2} x="36px" y="0px" className="flex h-full flex-col justify-between overflow-hidden">
                    <PieceCards
                        look={look}
                        lookIndex={lookIndex}
                        hotPin={hotPin}
                        selectedPiece={lookOpen ? selectedPiece : null}
                        added={added}
                        wishlist={wishlist}
                        cardRefs={cardRefs}
                        onHotPinChange={setHotPin}
                        onSelect={selectPiece}
                        onToggleAdded={(key) => setAdded(toggleKey(key))}
                        onToggleWishlist={(key) => setWishlist(toggleKey(key))}
                    />
                </Reveal>
            </aside>
        </div>
    );
});
