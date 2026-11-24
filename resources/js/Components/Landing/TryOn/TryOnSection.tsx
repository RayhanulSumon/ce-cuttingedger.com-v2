import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useInViewport } from '@/hooks/useInViewport';
import { OrderCta, PAD_X, Reveal, SectionIntro, SectionProps, tryOnOrderUrl } from '../shared';
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
 * Section 02 — Virtual Try-On with left-aligned intro and runway navigation.
 */
export const TryOnSection = memo(function TryOnSection({
    active,
    looks,
    embedded = false,
    onOverlayChange,
}: TryOnSectionProps) {
    const activeLooks = looks && looks.length > 0 ? looks : LOOKS;
    const [lookIndex, setLookIndex] = useState(0);
    const [lookOpen, setLookOpen] = useState(false);
    const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
    const [hotPin, setHotPin] = useState<number | null>(null);
    const rootRef = useRef<HTMLDivElement>(null);
    const cardRefs = useRef<(HTMLLIElement | null)[]>([]);
    const preloadedUrlsRef = useRef(new Set<string>());
    const inView = useInViewport(rootRef);
    const sectionActive = active && inView;

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
        running: sectionActive,
        interactive: !lookOpen,
        looks: activeLooks,
        desktopCenterXRatio: 0.63,
        desktopRadiusRatio: 0.48,
        onLookChange: handleLookChange,
        onFrontActorClick: openLook,
    });
    const { stepLook, isDragging } = runway;

    useEffect(() => {
        onOverlayChange?.(lookOpen);
    }, [lookOpen, onOverlayChange]);

    useEffect(() => () => onOverlayChange?.(false), [onOverlayChange]);

    const autoplaying = sectionActive && !lookOpen;
    const look = activeLooks[lookIndex] ?? activeLooks[0];

    // Preload only the active look's hi-res model + garment thumbnails (plus next look's piece thumbnails) on demand.
    useEffect(() => {
        if (!sectionActive || !look) {
            return;
        }
        const nextLook = activeLooks[(lookIndex + 1) % activeLooks.length];
        const urls = [
            look.modelHiRes,
            ...look.pieces.map((piece) => piece.image),
            ...(nextLook ? nextLook.pieces.map((piece) => piece.image) : []),
        ];
        urls.forEach((src) => {
            if (src && !preloadedUrlsRef.current.has(src)) {
                preloadedUrlsRef.current.add(src);
                new Image().src = src;
            }
        });
    }, [sectionActive, look, lookIndex, activeLooks]);

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

    const fadeWhenOpen = `transition-opacity duration-300 ${lookOpen ? 'pointer-events-none opacity-0' : 'opacity-100'}`;

    return (
        <div
            ref={rootRef}
            className={`relative grid h-full w-full grid-cols-1 grid-rows-[minmax(0,1fr)_auto] gap-3 overflow-hidden bg-[radial-gradient(ellipse_at_55%_35%,var(--color-surface)_0%,var(--color-page)_60%,var(--color-surface-2)_100%)] pb-6 text-ink sm:gap-4 sm:pb-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:grid-rows-1 lg:gap-8 ${embedded ? 'pt-6 sm:pt-8' : 'pt-24 sm:pt-24'} ${PAD_X}`}
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
                    titleClassName="text-section font-bold leading-tight tracking-[-0.03em]"
                    bodyClassName="text-sm text-muted sm:text-base lg:text-[17px]"
                    bodyMaxWidthClassName="max-w-[38ch]"
                    className={`relative z-20 lg:pointer-events-auto lg:absolute lg:left-0 lg:max-w-[420px] lg:-translate-y-1/2 ${
                        embedded ? 'lg:top-1/2' : 'lg:top-[calc(50%-2rem)]'
                    } ${fadeWhenOpen}`}
                    actions={
                        <OrderCta href={tryOnOrderUrl(look.modelName)} className="max-sm:h-9 max-sm:px-4">
                            Order Try-On
                        </OrderCta>
                    }
                >
                    Styled outfits from head to toe without another studio shoot. Click the front model to inspect every piece, or spin the runway.
                </SectionIntro>

                <RunwayStage
                    looks={activeLooks}
                    actorCount={runway.actorCount}
                    stageRef={runway.stageRef}
                    actorRefs={runway.actorRefs}
                    cursorRef={runway.cursorRef}
                    cursor={runway.cursor}
                    dimmed={lookOpen}
                    actorsMaskClassName="[mask-image:linear-gradient(90deg,transparent,black_9%,black_91%,transparent)] lg:[mask-image:linear-gradient(90deg,transparent_28%,black_42%,black_93%,transparent)]"
                    handlers={runway.stageHandlers}
                />

                <div className={`pointer-events-none relative z-10 -mt-2 flex flex-col items-center pb-1 lg:translate-x-[13%] ${fadeWhenOpen}`}>
                    <Reveal active={active} delay={0.2} className="flex flex-col items-center text-center whitespace-nowrap">
                        <p className="font-display text-sm sm:text-base font-bold tracking-[0.04em] text-ink leading-none drop-shadow-sm">
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

            <aside aria-label="In this look" className="relative min-h-0 lg:pb-14 lg:pt-2">
                <Reveal active={active} delay={0.2} x="36px" y="0px" className="h-full">
                    <PieceCards
                        look={look}
                        lookIndex={lookIndex}
                        hotPin={hotPin}
                        selectedPiece={lookOpen ? selectedPiece : null}
                        cardRefs={cardRefs}
                        onHotPinChange={setHotPin}
                        onSelectPiece={selectPiece}
                    />
                </Reveal>
            </aside>
        </div>
    );
});
