import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Look } from './looks';
import { MagnifierLens, useMagnifier } from './Magnifier';
import { PieceShowcase } from './PieceShowcase';

interface LookViewProps {
    open: boolean;
    look: Look;
    lookIndex: number;
    /** Index of the garment shown beside the model, or null. */
    selectedPiece: number | null;
    hotPin: number | null;
    onHotPinChange: (pinIndex: number | null) => void;
    onPinClick: (pinIndex: number) => void;
    /** Click on empty space: closes the open garment first, then the look view. */
    onDismiss: () => void;
    onClose: () => void;
    /** Screen rect of the runway's front model — where the big model flies from and back to. */
    getOriginRect: () => DOMRect | null;
}

const OPEN_FLIGHT = { duration: 720, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' };
const CLOSE_FLIGHT = { duration: 560, easing: 'cubic-bezier(0.65, 0, 0.35, 1)' };

const STUDIO_BACKDROP = 'bg-[radial-gradient(ellipse_at_55%_35%,#f2f6fa_0%,#e7eff7_60%,#dde8f2_100%)]';

const CONTACT_SHADOW =
    'pointer-events-none absolute bottom-0 left-[58%] h-[9%] max-h-[46px] min-h-[14px] w-[150%] -translate-x-1/2 translate-y-1/2 bg-[radial-gradient(closest-side,rgba(20,16,12,0.30),rgba(20,16,12,0.14)_45%,rgba(20,16,12,0.04)_75%,transparent)] blur-[2px]';

/**
 * Shared-element flight: the big model grows out of the runway's front model on open
 * and shrinks back onto it on close, so the two views read as one continuous move.
 * Runs on the Web Animations API (transform only → compositor).
 */
function useModelFlight(
    figureRef: React.RefObject<HTMLDivElement | null>,
    open: boolean,
    getOriginRect: () => DOMRect | null,
) {
    const wasOpen = useRef(open);

    useLayoutEffect(() => {
        const figure = figureRef.current;
        if (!figure || open === wasOpen.current) {
            return;
        }
        wasOpen.current = open;

        figure.getAnimations().forEach((animation) => animation.cancel());
        const origin = getOriginRect();
        const rest = figure.getBoundingClientRect();
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!origin || !rest.height || reduced) {
            return;
        }

        // The figure scales about its bottom centre, so match bottom-centre to bottom-centre.
        const scale = origin.height / rest.height;
        const dx = origin.left + origin.width / 2 - (rest.left + rest.width / 2);
        const dy = origin.bottom - rest.bottom;
        const onRunway = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0) scale(${scale.toFixed(4)})`;
        const inView = 'translate3d(0, 0, 0) scale(1)';

        if (open) {
            figure.animate([{ transform: onRunway }, { transform: inView }], OPEN_FLIGHT);
        } else {
            figure.animate([{ transform: inView }, { transform: onRunway }], { ...CLOSE_FLIGHT, fill: 'forwards' });
        }
        // `getOriginRect` is read at flight time only.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);
}

/**
 * Numbered garment markers. Each number sits in the clear space left of the model and a thin
 * leader line points to the garment, so nothing covers the outfit itself.
 */
function LookPins({
    look,
    visible,
    selectedPiece,
    hotPin,
    onHotPinChange,
    onPinClick,
}: Pick<LookViewProps, 'look' | 'selectedPiece' | 'hotPin' | 'onHotPinChange' | 'onPinClick'> & { visible: boolean }) {
    return (
        <div
            className={`pointer-events-none absolute inset-0 z-10 transition-opacity duration-300 ${
                visible ? 'opacity-100 delay-[420ms]' : 'opacity-0'
            }`}
        >
            {look.pins.map((pin, pinIndex) => {
                const piece = look.pieces[pinIndex];
                const isSelected = selectedPiece === pinIndex;
                const isLit = isSelected || hotPin === pinIndex;

                return (
                    <div
                        key={pinIndex}
                        style={{ top: `${pin.top}%`, width: `${pin.left}%` }}
                        className="absolute left-0 flex -translate-y-1/2 items-center"
                    >
                        <button
                            type="button"
                            aria-label={`${pinIndex + 1}: ${piece?.name ?? ''}`}
                            aria-pressed={isSelected}
                            onMouseEnter={() => onHotPinChange(pinIndex)}
                            onMouseLeave={() => onHotPinChange(null)}
                            onFocus={() => onHotPinChange(pinIndex)}
                            onBlur={() => onHotPinChange(null)}
                            onClick={(event) => {
                                event.stopPropagation();
                                onPinClick(pinIndex);
                            }}
                            className={`relative grid h-11 w-11 shrink-0 cursor-pointer place-items-center ${visible ? 'pointer-events-auto' : ''}`}
                        >
                            <span
                                className={`relative grid h-8 w-8 place-items-center rounded-full text-xs font-bold leading-none shadow-[0_4px_14px_-4px_rgba(0,0,0,0.35)] transition-[scale,background-color,color] duration-300 ${
                                    isLit ? 'scale-115 bg-[#0e0e0e] text-white' : 'bg-white text-[#151413]'
                                }`}
                            >
                                <span aria-hidden="true" className="animate-rw-ring pointer-events-none absolute -inset-[5px] rounded-full border border-[#151413]/30" />
                                {pinIndex + 1}
                            </span>
                            {piece && (
                                <span
                                    className={`pointer-events-none absolute bottom-full left-1 mb-0.5 whitespace-nowrap rounded-full bg-white px-3 py-1.5 text-[11px] font-medium tracking-[0.04em] text-[#151413] shadow-[0_10px_26px_-12px_rgba(0,0,0,0.4)] transition-[translate,opacity] duration-300 ${
                                        isLit ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
                                    }`}
                                >
                                    {piece.name}
                                </span>
                            )}
                        </button>

                        {/* Leader line with an arrowhead ending on the garment. */}
                        <span
                            aria-hidden="true"
                            className={`h-px min-w-0 flex-1 transition-colors duration-300 ${isLit ? 'bg-[#0e0e0e]' : 'bg-[#151413]/35'}`}
                        />
                        <svg
                            aria-hidden="true"
                            width="7"
                            height="10"
                            viewBox="0 0 7 10"
                            className={`-ml-px shrink-0 transition-colors duration-300 ${isLit ? 'text-[#0e0e0e]' : 'text-[#151413]/45'}`}
                        >
                            <path d="M0 0l7 5-7 5z" fill="currentColor" />
                        </svg>
                    </div>
                );
            })}
        </div>
    );
}

/**
 * Close-up of the current look: the model with numbered garment markers and a magnifier,
 * and the selected garment shown large beside it.
 */
export function LookView({
    open,
    look,
    lookIndex,
    selectedPiece,
    hotPin,
    onHotPinChange,
    onPinClick,
    onDismiss,
    onClose,
    getOriginRect,
}: LookViewProps) {
    const figureRef = useRef<HTMLDivElement>(null);
    const magnifier = useMagnifier({ zoom: 2.2, size: 150, align: 'bottom' });
    const hideLens = magnifier.hide;

    useModelFlight(figureRef, open, getOriginRect);

    useEffect(() => {
        hideLens();
    }, [open, lookIndex, selectedPiece, hideLens]);

    const piece = selectedPiece !== null ? look.pieces[selectedPiece] : undefined;

    return (
        <div
            role="region"
            aria-label="View look"
            aria-hidden={!open}
            inert={!open}
            data-open={open}
            className="look-view absolute inset-0 z-40"
        >
            <div onClick={onDismiss} className={`absolute inset-0 cursor-zoom-out ${STUDIO_BACKDROP}`} />

            <div
                onClick={(event) => {
                    if (event.target === event.currentTarget) {
                        onDismiss();
                    }
                }}
                className="absolute inset-x-4 bottom-4 top-8 flex cursor-zoom-out select-none items-end justify-center sm:inset-x-8 sm:bottom-6 sm:top-10"
            >
                {/* figure: flight · inner: slides aside for the garment · innermost: magnifier area */}
                <div ref={figureRef} className="relative aspect-[9/16] h-full max-h-full origin-bottom will-change-transform">
                    <div
                        className={`h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                            piece ? '-translate-x-[24%] lg:-translate-x-[48%] xl:-translate-x-[50%]' : 'translate-x-0'
                        }`}
                    >
                        <div {...magnifier.areaHandlers} className="relative h-full w-full cursor-zoom-in touch-none">
                            <span aria-hidden="true" className={CONTACT_SHADOW} />
                            <img
                                ref={magnifier.imageRef}
                                src={look.modelHiRes}
                                alt={look.name}
                                draggable={false}
                                decoding="async"
                                className="pointer-events-none h-full w-full select-none object-contain object-bottom"
                            />
                            <LookPins
                                look={look}
                                visible={open}
                                selectedPiece={selectedPiece}
                                hotPin={hotPin}
                                onHotPinChange={onHotPinChange}
                                onPinClick={onPinClick}
                            />
                            <MagnifierLens lensRef={magnifier.lensRef} />
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>{piece && <PieceShowcase key={`${lookIndex}-${selectedPiece}`} piece={piece} />}</AnimatePresence>

            <div className="pointer-events-none absolute inset-x-0 top-0 z-50 flex items-start justify-between gap-4 px-6 pt-4 sm:px-10 sm:pt-5">
                <p className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tabular-nums tracking-[0.2em] text-[#66625c]">
                        Look {String(lookIndex + 1).padStart(2, '0')}
                    </span>
                    <span className="text-lg font-normal leading-[1.1] text-[#151413] sm:text-xl">{look.name}</span>
                </p>
                <button
                    type="button"
                    onClick={(event) => {
                        event.stopPropagation();
                        onClose();
                    }}
                    aria-label="Close look view"
                    className="pointer-events-auto grid h-12 w-12 shrink-0 cursor-pointer place-items-center rounded-full border border-[#151413]/25 bg-white text-[#151413] shadow-md transition-[rotate,scale,border-color] duration-300 hover:rotate-90 hover:border-[#151413] active:scale-95"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                        <path d="M5 5l14 14M19 5L5 19" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
