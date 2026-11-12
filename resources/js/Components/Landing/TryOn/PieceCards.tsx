import React from 'react';
import { Check, Heart, Plus } from 'lucide-react';
import { Look } from './looks';

interface PieceCardsProps {
    look: Look;
    lookIndex: number;
    hotPin: number | null;
    /** Garment currently open in the look view, or null. */
    selectedPiece: number | null;
    /** Keys (`"look-piece"`) of garments added to the look / saved to the wishlist. */
    added: Record<string, boolean>;
    wishlist: Record<string, boolean>;
    cardRefs: React.RefObject<(HTMLLIElement | null)[]>;
    onHotPinChange: (pieceIndex: number | null) => void;
    onSelect: (pieceIndex: number) => void;
    onToggleAdded: (pieceKey: string) => void;
    onToggleWishlist: (pieceKey: string) => void;
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
    added,
    wishlist,
    cardRefs,
    onHotPinChange,
    onSelect,
    onToggleAdded,
    onToggleWishlist,
}: PieceCardsProps) {
    return (
        <ul role="list" className="flex h-44 flex-row gap-3 overflow-x-auto [scrollbar-width:none] lg:h-full lg:flex-col lg:overflow-visible [&::-webkit-scrollbar]:hidden">
            {look.pieces.map((piece, i) => {
                const pieceKey = `${lookIndex}-${i}`;
                const isHot = hotPin === i;
                const isSelected = selectedPiece === i;
                const isAdded = Boolean(added[pieceKey]);
                const isWishlisted = Boolean(wishlist[pieceKey]);
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
                        className={`group relative flex min-h-0 min-w-[170px] flex-1 cursor-pointer select-none flex-col overflow-hidden rounded-2xl bg-white p-3 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] transition-[box-shadow,translate] duration-300 lg:min-w-0 ${
                            isSelected
                                ? 'shadow-md ring-2 ring-[#151413]'
                                : isHot
                                  ? 'shadow-md ring-1 ring-[#151413]/30'
                                  : 'hover:-translate-y-0.5 hover:shadow-md'
                        }`}
                    >
                        <div className="relative z-10 flex items-center justify-between">
                            <button
                                type="button"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    onToggleWishlist(pieceKey);
                                }}
                                aria-pressed={isWishlisted}
                                aria-label={`Wishlist ${piece.name}`}
                                className="grid h-6 w-6 place-items-center text-[#151413] transition-transform hover:scale-120"
                            >
                                <Heart size={15} strokeWidth={1.5} className={isWishlisted ? 'fill-[#151413]' : ''} />
                            </button>
                            <span
                                className={`grid h-5 w-5 place-items-center rounded-full text-[10px] font-bold transition-colors duration-300 ${
                                    isSelected || isHot
                                        ? 'bg-[#0e0e0e] text-white'
                                        : 'bg-[#151413]/10 text-[#151413] group-hover:bg-[#0e0e0e] group-hover:text-white'
                                }`}
                            >
                                {i + 1}
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

                        <div className="relative z-10 flex items-end justify-between gap-2">
                            <h4
                                key={pieceKey}
                                style={delay}
                                className="animate-card-in min-w-0 truncate text-[11px] font-semibold uppercase tracking-[0.10em] text-[#151413]"
                            >
                                {piece.name}
                            </h4>
                            <button
                                type="button"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    onToggleAdded(pieceKey);
                                }}
                                aria-pressed={isAdded}
                                aria-label={`Add ${piece.name} to look`}
                                className={`grid h-6 w-6 shrink-0 place-items-center rounded-full transition-[scale,background-color,color] duration-300 ${
                                    isAdded ? 'bg-[#0e0e0e] text-white' : 'text-[#151413] hover:scale-120'
                                }`}
                            >
                                {isAdded ? <Check size={14} strokeWidth={2} /> : <Plus size={16} strokeWidth={1.5} />}
                            </button>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}
