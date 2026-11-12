import React from 'react';
import { motion } from 'framer-motion';
import { LookPiece } from './looks';
import { useZoomPan } from './useZoomPan';
import { ZoomControls } from './ZoomControls';

const MAX_ZOOM = 2.5;
const panLimit = (zoom: number) => ({ x: 140 * (zoom - 1), y: 140 * (zoom - 1) });

/**
 * Large view of one garment, shown beside the model in the look view.
 *
 * Mount it with a `key` per piece: zoom and pan then reset on their own when the piece changes,
 * and the parent's AnimatePresence cross-fades the old piece out.
 */
export function PieceShowcase({ piece }: { piece: LookPiece }) {
    const viewer = useZoomPan({ maxZoom: MAX_ZOOM, step: 0.4, focusZoom: 1.8, panLimit });

    return (
        <motion.div
            onClick={(event) => event.stopPropagation()}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute bottom-4 left-[38%] right-0 top-20 z-20 flex touch-none select-none flex-col items-center justify-center p-2 sm:left-[42%]"
        >
            <div className="animate-dress-reveal flex h-full w-full flex-col items-center justify-center">
                <div className="pointer-events-none mb-1 flex flex-col items-center text-center">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#736f69]">{piece.brand}</span>
                    <h4 className="mt-0.5 text-base font-medium tracking-tight text-[#151413] sm:text-lg lg:text-xl">{piece.name}</h4>
                </div>

                <div
                    ref={viewer.containerRef}
                    {...viewer.containerHandlers}
                    className={`relative flex h-[76%] max-h-[660px] w-full max-w-[480px] items-center justify-center ${
                        viewer.zoom > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'
                    }`}
                >
                    <span
                        aria-hidden="true"
                        className="pointer-events-none absolute bottom-4 left-1/2 h-[7%] max-h-[30px] w-[75%] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(20,16,12,0.18),rgba(20,16,12,0.06)_50%,transparent)] blur-[2px]"
                    />
                    <img
                        ref={(el) => {
                            viewer.targetRef.current = el;
                        }}
                        src={piece.image}
                        alt={piece.name}
                        draggable={false}
                        className="max-h-[92%] max-w-[92%] select-none object-contain drop-shadow-[0_16px_36px_rgba(0,0,0,0.08)] will-change-transform"
                    />
                </div>

                <div className="pointer-events-none absolute bottom-4 right-4 z-20 sm:right-8">
                    <ZoomControls
                        zoom={viewer.zoom}
                        maxZoom={MAX_ZOOM}
                        subject="piece"
                        onZoomIn={viewer.zoomIn}
                        onZoomOut={viewer.zoomOut}
                        onReset={viewer.reset}
                    />
                </div>
            </div>
        </motion.div>
    );
}
