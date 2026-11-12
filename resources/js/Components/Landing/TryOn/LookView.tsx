import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Look } from './looks';
import { PieceShowcase } from './PieceShowcase';
import { useZoomPan } from './useZoomPan';
import { ZoomControls } from './ZoomControls';

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

const MODEL_MAX_ZOOM = 2.2;
const modelPanLimit = (zoom: number) => ({ x: 120 * (zoom - 1), y: 220 * (zoom - 1) });

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

/** Numbered hotspots over the model, one per garment in the look. */
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
            className={`absolute inset-0 z-10 transition-opacity duration-300 ${
                visible ? 'opacity-100 delay-[420ms]' : 'pointer-events-none opacity-0'
            }`}
        >
            {look.pins.map((pin, pinIndex) => {
                const piece = look.pieces[pinIndex];
                const isHot = hotPin === pinIndex;
                const isSelected = selectedPiece === pinIndex;

                return (
                    <button
                        key={pinIndex}
                        type="button"
                        style={{ left: `${pin.left}%`, top: `${pin.top}%` }}
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
                        className="group absolute -ml-[22px] -mt-[22px] grid h-[44px] w-[44px] cursor-pointer place-items-center"
                    >
                        <span
                            className={`relative grid h-7 w-7 place-items-center rounded-full text-[11px] font-semibold leading-none shadow-[0_4px_14px_-4px_rgba(0,0,0,0.35)] transition-[scale,background-color,color,box-shadow] duration-300 ${
                                isSelected
                                    ? 'scale-125 bg-[#0e0e0e] text-white shadow-[0_0_0_6px_rgba(14,14,14,0.22),0_8px_20px_-6px_rgba(0,0,0,0.45)] ring-2 ring-white'
                                    : isHot
                                      ? 'scale-120 bg-[#0e0e0e] text-white shadow-[0_0_0_5px_rgba(14,14,14,0.18)]'
                                      : 'bg-white/95 text-[#151413] group-hover:scale-120 group-hover:bg-[#0e0e0e] group-hover:text-white'
                            }`}
                        >
                            <span aria-hidden="true" className="animate-rw-ring pointer-events-none absolute -inset-[5px] rounded-full border border-white/80" />
                            <span aria-hidden="true" className="animate-rw-ring-delayed pointer-events-none absolute -inset-[5px] rounded-full border border-white/55" />
                            {pinIndex + 1}
                        </span>

                        {piece && (
                            <span
                                className={`pointer-events-none absolute left-[calc(100%-6px)] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-medium tracking-[0.04em] text-[#151413] shadow-[0_10px_26px_-12px_rgba(0,0,0,0.4)] transition-[translate,scale,opacity] duration-300 ${
                                    isSelected || isHot
                                        ? 'translate-x-0 scale-100 opacity-100'
                                        : '-translate-x-2 scale-95 opacity-0 group-hover:translate-x-0 group-hover:scale-100 group-hover:opacity-100'
                                }`}
                            >
                                {piece.name}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}

/**
 * Close-up of the current look: a zoomable model with garment hotspots,
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
    const viewer = useZoomPan({ maxZoom: MODEL_MAX_ZOOM, step: 0.35, focusZoom: 1.6, panLimit: modelPanLimit });
    const resetZoom = viewer.reset;

    useModelFlight(figureRef, open, getOriginRect);

    // Leave or change look → back to 100% so the flight and the next look start clean.
    useEffect(() => {
        resetZoom();
    }, [open, lookIndex, resetZoom]);

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
                ref={viewer.containerRef}
                {...viewer.containerHandlers}
                onClick={(event) => {
                    if (event.target === event.currentTarget) {
                        onDismiss();
                    }
                }}
                className={`absolute inset-x-4 bottom-4 top-8 flex select-none items-end justify-center sm:inset-x-8 sm:bottom-6 sm:top-10 ${
                    viewer.zoom > 1 ? 'cursor-grab touch-none active:cursor-grabbing' : 'cursor-zoom-out'
                }`}
            >
                {/* figure: flight · inner: slides aside for the garment · innermost: zoom + pan */}
                <div ref={figureRef} className="relative aspect-[9/16] h-full max-h-full origin-bottom cursor-default will-change-transform">
                    <div
                        className={`h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                            piece ? '-translate-x-[24%] lg:-translate-x-[48%] xl:-translate-x-[50%]' : 'translate-x-0'
                        }`}
                    >
                        <div
                            ref={(el) => {
                                viewer.targetRef.current = el;
                            }}
                            className="relative h-full w-full origin-bottom"
                        >
                            <span aria-hidden="true" className={CONTACT_SHADOW} />
                            <img
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
                        </div>
                    </div>
                </div>

                <div className="pointer-events-none absolute bottom-4 left-6 z-20">
                    <ZoomControls
                        zoom={viewer.zoom}
                        maxZoom={MODEL_MAX_ZOOM}
                        subject="model"
                        onZoomIn={viewer.zoomIn}
                        onZoomOut={viewer.zoomOut}
                        onReset={viewer.reset}
                    />
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

            <p className="pointer-events-none absolute inset-x-0 bottom-4 text-center text-[10px] uppercase tracking-[0.2em] text-[#66625c]">
                {piece ? 'Click another dot or card to switch pieces' : 'Tap a dot to shop the piece'}
            </p>
        </div>
    );
}
