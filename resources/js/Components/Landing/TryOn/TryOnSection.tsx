import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { OrderCta, orderUrl, PAD_X, Reveal, SectionIntro, SectionProps } from '../shared';
import { LOOKS } from './looks';
import { LookView } from './LookView';
import { PieceCards } from './PieceCards';
import { RunwayStage } from './RunwayStage';
import { useRingRunway } from './useRingRunway';

/** How long each look stays at the front before the ring turns by itself. */
const AUTOPLAY_MS = 5000;

const ROUND_BUTTON =
    'grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[#151413]/25 bg-white/85 text-[#151413] transition-colors duration-300 hover:bg-[#151413] hover:text-white';

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
    const [added, setAdded] = useState<Record<string, boolean>>({});
    const [wishlist, setWishlist] = useState<Record<string, boolean>>({});
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

                <div className={`relative z-10 pt-3 ${fadeWhenOpen}`}>
                    <Reveal active={active} delay={0.24} className="flex items-center justify-between gap-3">
                        <button type="button" onClick={() => runway.stepLook(-1)} aria-label="Previous look" className={ROUND_BUTTON}>
                            <ArrowLeft size={18} />
                        </button>
                        <OrderCta href={orderUrl('virtual-try-on', look.name)}>Order this look</OrderCta>
                        <button type="button" onClick={() => runway.stepLook(1)} aria-label="Next look" className={ROUND_BUTTON}>
                            <ArrowRight size={18} />
                        </button>
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

            <aside aria-label="In this look" className="relative min-h-0">
                <Reveal active={active} delay={0.2} x="36px" y="0px" className="h-full">
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
