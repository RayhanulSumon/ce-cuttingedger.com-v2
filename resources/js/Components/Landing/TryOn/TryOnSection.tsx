import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { CustomOrderCta, PAD_X, Reveal, SectionIntro, SectionProps, tryOnQuoteUrl } from '../shared';
import { Look, LOOKS } from './looks';
import { LookView } from './LookView';
import { PieceCards } from './PieceCards';
import { RunwayStage } from './RunwayStage';
import { useRingRunway } from './useRingRunway';

/** How long each look stays at the front before the ring turns by itself. */
const AUTOPLAY_MS = 5000;

interface TryOnSectionProps extends SectionProps {
    looks?: Look[];
    embedded?: boolean;
}

/**
 * Section 02 — a ring runway of styled looks. Clicking the front model opens the look view,
 * where each garment can be inspected beside the model.
 */
export const TryOnSection = memo(function TryOnSection({ active, looks, embedded = false, onOverlayChange }: TryOnSectionProps) {
    const activeLooks = looks && looks.length > 0 ? looks : LOOKS;
    const [lookIndex, setLookIndex] = useState(0);
    const [lookOpen, setLookOpen] = useState(false);
    const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
    const [hotPin, setHotPin] = useState<number | null>(null);
    const cardRefs = useRef<(HTMLLIElement | null)[]>([]);

    const handleLookChange = useCallback((index: number) => {
        setLookIndex(index);
        setSelectedPiece(null);
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
        looks: activeLooks,
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
        new Set(activeLooks.flatMap((item) => [item.modelHiRes, ...item.pieces.map((piece) => piece.image)])).forEach((src) => {
            new Image().src = src;
        });
    }, [active, activeLooks]);

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
            } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                event.preventDefault();
                stepLook(event.key === 'ArrowRight' ? 1 : -1);
            }
        };
        window.addEventListener('keydown', onKey, true);
        return () => window.removeEventListener('keydown', onKey, true);
    }, [lookOpen, dismiss, stepLook]);

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

    const look = activeLooks[lookIndex] ?? activeLooks[0];
    const fadeWhenOpen = `transition-opacity duration-300 ${lookOpen ? 'pointer-events-none opacity-0' : 'opacity-100'}`;

    return (
        <div
            className={`relative grid h-full w-full grid-cols-1 grid-rows-[minmax(0,1fr)_auto_auto] gap-3 overflow-hidden bg-[radial-gradient(ellipse_at_55%_35%,var(--color-surface)_0%,var(--color-page)_60%,var(--color-surface-2)_100%)] pb-6 text-ink sm:gap-4 sm:pb-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:grid-rows-1 lg:gap-8 ${embedded ? 'pt-6 sm:pt-8' : 'pt-20 sm:pt-24'} ${PAD_X}`}
        >
            {/* Floor shade spans the whole section, so the runway and its controls sit on one seamless backdrop. */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-[46%] bg-[linear-gradient(to_top,rgba(21,20,19,0.08),rgba(21,20,19,0.025)_55%,transparent)]"
            />

            <div className="relative flex min-h-[60svh] flex-col lg:min-h-0">
                <SectionIntro
                    active={active}
                    title="Virtual Try-On"
                    titleClassName="text-[clamp(24px,3vw,40px)]"
                    bodyClassName="text-sm text-muted sm:text-base"
                    className={`relative z-10 ${fadeWhenOpen}`}
                >
                    Styled looks, head to toe. Click the front model to inspect each piece, or drag to spin the runway.
                </SectionIntro>

                <RunwayStage
                    looks={activeLooks}
                    actorCount={runway.actorCount}
                    stageRef={runway.stageRef}
                    actorRefs={runway.actorRefs}
                    cursorRef={runway.cursorRef}
                    cursor={runway.cursor}
                    dimmed={lookOpen}
                    handlers={runway.stageHandlers}
                />

                <div className={`pointer-events-none relative z-10 -mt-2 flex flex-col items-center pb-1 ${fadeWhenOpen}`}>
                    <Reveal active={active} delay={0.2} className="flex flex-col items-center text-center whitespace-nowrap">
                        <p className="font-display text-xs sm:text-sm font-bold tracking-[0.04em] text-ink leading-none drop-shadow-sm">
                            {look.modelName}
                        </p>
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
                    onStepLook={stepLook}
                    onDismiss={dismiss}
                    onClose={closeLook}
                    getOriginRect={runway.getFrontActorRect}
                />
            </div>

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

            <CustomOrderCta
                active={active}
                href={tryOnQuoteUrl(look.modelName)}
                question="Want this look on your own garments?"
                buttonLabel="Request Try-On Quote"
                className={`${fadeWhenOpen} max-lg:static`}
            />
        </div>
    );
});
