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

/** Sidebar list of the garments in the current look. Re-enters with a stagger whenever the look changes. */
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
        <ul
            role="list"
            className="flex h-full flex-row gap-2.5 overflow-x-auto p-1 lg:flex-col lg:justify-between lg:overflow-hidden lg:p-0"
        >
            {look.pieces.map((piece, i) => {
                const pieceKey = `${lookIndex}-${i}`;
                const isHot = hotPin === i;
                const isSelected = selectedPiece === i;
                const isAdded = Boolean(added[pieceKey]);
                const isWishlisted = Boolean(wishlist[pieceKey]);

                return (
                    <li
                        key={pieceKey}
                        ref={(el) => {
                            cardRefs.current[i] = el;
                        }}
                        onMouseEnter={() => onHotPinChange(i)}
                        onMouseLeave={() => onHotPinChange(null)}
                        onClick={() => onSelect(i)}
                        style={{ animationDelay: `${i * 70}ms` }}
                        className={`animate-card-in group relative flex min-h-0 min-w-[200px] flex-1 cursor-pointer select-none flex-col justify-between rounded-xl bg-white p-3 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] transition-[box-shadow,translate] duration-300 sm:p-3.5 lg:min-w-0 ${
                            isSelected
                                ? 'shadow-md ring-2 ring-[#151413]'
                                : isHot
                                  ? 'shadow-md ring-1 ring-[#151413]/30'
                                  : 'hover:-translate-y-0.5 hover:shadow-md'
                        }`}
                    >
                        <div className="flex items-center justify-between">
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
                                className={`grid h-[19px] w-[19px] place-items-center rounded-full text-[9px] font-bold transition-colors duration-300 ${
                                    isSelected || isHot
                                        ? 'bg-[#0e0e0e] text-white shadow-sm'
                                        : 'bg-[#151413]/10 text-[#151413] group-hover:bg-[#0e0e0e] group-hover:text-white'
                                }`}
                            >
                                {i + 1}
                            </span>
                        </div>

                        <div className="my-1 flex min-h-0 flex-1 items-center justify-center py-1">
                            <img
                                src={piece.image}
                                alt={piece.name}
                                loading="lazy"
                                decoding="async"
                                draggable={false}
                                className="max-h-[90px] w-auto max-w-[85%] object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.06)] transition-transform duration-500 group-hover:scale-105 sm:max-h-[105px] xl:max-h-[120px]"
                            />
                        </div>

                        <div className="flex items-end justify-between gap-2 pt-0.5">
                            <h4 className="min-w-0 truncate text-[11px] font-semibold uppercase tracking-[0.10em] text-[#151413]">
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
