import React from 'react';
import { Look } from './looks';

interface PieceCardsProps {
    look: Look;
    lookIndex: number;
    hotPin: number | null;
    /** Garment currently open in the look view, or null. */
    selectedPiece: number | null;
    cardRefs: React.RefObject<(HTMLLIElement | null)[]>;
    onHotPinChange: (pieceIndex: number | null) => void;
    onSelect: (pieceIndex: number) => void;
}

/** Delay between one card's garment wiping in and the next. */
const STAGGER_MS = 110;

/**
 * Sidebar list of the garments in the current look.
 *
 * The white cards stay put; when the runway moves to another look only their contents change —
 * each garment wipes up into its card, one after the other.
 */
export function PieceCards({
    look,
    lookIndex,
    hotPin,
    selectedPiece,
    cardRefs,
    onHotPinChange,
    onSelect,
}: PieceCardsProps) {
    return (
        <ul role="list" className="flex h-44 flex-row gap-3 overflow-x-auto [scrollbar-width:none] lg:h-full lg:flex-col lg:overflow-visible [&::-webkit-scrollbar]:hidden">
            {look.pieces.map((piece, i) => {
                const pieceKey = `${lookIndex}-${i}`;
                const isHot = hotPin === i;
                const isSelected = selectedPiece === i;
                const delay = { animationDelay: `${i * STAGGER_MS}ms` };

                return (
                    <li
                        key={i}
                        ref={(el) => {
                            cardRefs.current[i] = el;
                        }}
                        onMouseEnter={() => onHotPinChange(i)}
                        onMouseLeave={() => onHotPinChange(null)}
                        onClick={() => onSelect(i)}
                        className={`group relative flex min-h-0 min-w-[170px] flex-1 cursor-pointer select-none flex-col overflow-hidden rounded-2xl border border-white bg-[linear-gradient(165deg,#ffffff_0%,#f6f9fc_55%,#eaf1f7_100%)] p-3 shadow-[0_14px_30px_-20px_rgba(45,65,95,0.45)] transition-[box-shadow,translate] duration-300 lg:min-w-0 ${
                            isSelected
                                ? 'shadow-[0_18px_36px_-18px_rgba(45,65,95,0.6)] ring-2 ring-[#f5761a]'
                                : isHot
                                  ? 'shadow-[0_18px_36px_-18px_rgba(45,65,95,0.6)] ring-1 ring-[#f5761a]/70'
                                  : 'hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-18px_rgba(45,65,95,0.6)]'
                        }`}
                    >
                        <div className="relative z-10 flex items-center">
                            <span
                                className={`grid h-6 min-w-6 place-items-center rounded-full px-1.5 text-[10px] font-bold tabular-nums transition-colors duration-300 ${
                                    isSelected || isHot
                                        ? 'bg-[#f5761a] text-white'
                                        : 'bg-[#dfe8f1] text-[#3d4857] group-hover:bg-[#f5761a] group-hover:text-white'
                                }`}
                            >
                                {String(i + 1).padStart(2, '0')}
                            </span>
                        </div>

                        <div className="relative my-1 min-h-0 flex-1">
                            <img
                                key={pieceKey}
                                src={piece.image}
                                alt={piece.name}
                                decoding="async"
                                draggable={false}
                                style={delay}
                                className="animate-wipe-up absolute inset-0 h-full w-full object-contain transition-[scale] duration-500 group-hover:scale-105"
                            />
                        </div>

                        <h4
                            key={pieceKey}
                            style={delay}
                            className="animate-card-in relative z-10 min-w-0 truncate text-[11px] font-semibold uppercase tracking-[0.10em] text-[#151413]"
                        >
                            {piece.name}
                        </h4>
                    </li>
                );
            })}
        </ul>
    );
}
