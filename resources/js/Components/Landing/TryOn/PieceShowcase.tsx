import React from 'react';
import { motion } from 'framer-motion';
import { LookPiece } from './looks';
import { MagnifierLens, useMagnifier } from './Magnifier';

/**
 * Large view of one garment, shown beside the model in the look view. Hover it to magnify.
 *
 * Mount it with a `key` per piece so the parent's AnimatePresence cross-fades the old piece out.
 */
export function PieceShowcase({ piece }: { piece: LookPiece }) {
    const magnifier = useMagnifier({ zoom: 2.4, size: 150 });

    return (
        <motion.div
            onClick={(event) => event.stopPropagation()}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute bottom-4 left-[38%] right-0 top-20 z-20 flex select-none flex-col items-center justify-center p-2 sm:left-[42%]"
        >
            <div className="animate-dress-reveal flex h-full w-full flex-col items-center justify-center">
                <div className="pointer-events-none mb-1 flex flex-col items-center text-center">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#736f69]">{piece.brand}</span>
                    <h4 className="mt-0.5 text-base font-medium tracking-tight text-[#151413] sm:text-lg lg:text-xl">{piece.name}</h4>
                </div>

                <div
                    {...magnifier.areaHandlers}
                    className="relative flex h-[80%] max-h-[680px] w-full max-w-[500px] cursor-zoom-in touch-none items-center justify-center"
                >
                    <span
                        aria-hidden="true"
                        className="pointer-events-none absolute bottom-4 left-1/2 h-[7%] max-h-[30px] w-[75%] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(20,16,12,0.18),rgba(20,16,12,0.06)_50%,transparent)] blur-[2px]"
                    />
                    <img
                        ref={magnifier.imageRef}
                        src={piece.image}
                        alt={piece.name}
                        draggable={false}
                        className="max-h-[94%] max-w-[94%] select-none object-contain"
                    />
                    <MagnifierLens lensRef={magnifier.lensRef} />
                </div>
            </div>
        </motion.div>
    );
}
