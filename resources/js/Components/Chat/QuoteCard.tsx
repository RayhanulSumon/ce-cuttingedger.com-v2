import React from 'react';
import { Tag, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export interface QuoteCardProps {
    card: {
        service_name: string;
        service_slug: string;
        complexity: string;
        quantity: number;
        unit_price: string;
        regular_total?: string | null;
        total_price: string;
        currency: string;
        turnaround: string;
        discount_applied?: string | null;
        free_trial_eligible?: boolean;
        call_to_action?: string;
    };
    onSelectReply: (reply: string) => void;
    onUploadClick?: () => void;
}

export function QuoteCard({ card, onSelectReply, onUploadClick }: QuoteCardProps) {
    const isFreeTrial = Boolean(card.free_trial_eligible);

    return (
        <div className="my-2 p-4 rounded-2xl bg-[#12141a]/95 border border-[#d4ff00]/30 shadow-2xl backdrop-blur-md text-left">
            <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2.5 mb-3">
                <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-[#d4ff00]/10 text-[#d4ff00]">
                        <Tag className="w-4 h-4" />
                    </span>
                    <div>
                        <h4 className="text-sm font-bold text-white tracking-tight">{card.service_name}</h4>
                        <span className="text-[11px] text-white/50 font-mono uppercase tracking-wider">
                            {card.complexity} • {card.turnaround}
                        </span>
                    </div>
                </div>
                {isFreeTrial && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#d4ff00] text-black">
                        <Sparkles className="w-3 h-3" /> Free Trial Eligible
                    </span>
                )}
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3 bg-white/5 p-2.5 rounded-xl text-xs font-mono">
                <div>
                    <span className="text-white/40 block text-[10px]">QUANTITY</span>
                    <span className="text-white font-semibold">{card.quantity} {card.quantity === 1 ? 'image' : 'images'}</span>
                </div>
                <div>
                    <span className="text-white/40 block text-[10px]">UNIT RATE</span>
                    <span className="text-white font-semibold">${card.unit_price} / img</span>
                </div>
                {card.discount_applied && (
                    <div className="col-span-2 pt-1 border-t border-white/5 text-[#00f5ff] text-[11px] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-[#00f5ff]" />
                        <span>{card.discount_applied}</span>
                    </div>
                )}
            </div>

            <div className="flex items-baseline justify-between pt-1 mb-3">
                <span className="text-xs text-white/60 font-medium">Estimated Total:</span>
                <div className="text-right flex items-baseline gap-1.5 justify-end">
                    {isFreeTrial && card.regular_total && (
                        <span className="text-xs line-through text-white/40 font-mono">
                            ${card.regular_total}
                        </span>
                    )}
                    <span className="text-xl font-bold font-mono text-[#d4ff00] tracking-tight">
                        ${card.total_price}
                    </span>
                    <span className="text-[10px] text-white/40 font-mono">
                        {isFreeTrial ? 'USD (ZERO COST)' : 'USD'}
                    </span>
                </div>
            </div>

            <button
                type="button"
                onClick={() => {
                    if (isFreeTrial) {
                        // Directly claim the 3 free trial edits without opening file picker modal
                        onSelectReply('Claim 3 Free Sample Edits');
                    } else {
                        // For large batches, open file picker to upload batch
                        if (onUploadClick) {
                            onUploadClick();
                        }
                        onSelectReply('I confirm this quote and want to upload my batch');
                    }
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-[#d4ff00] hover:bg-[#b8dd00] text-black font-semibold text-xs font-mono tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-[#d4ff00]/20 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
                <span>{card.call_to_action || (isFreeTrial ? 'Claim 3 Free Sample Edits ($0.00 Zero Cost)' : 'Confirm Quote & Upload Batch')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
            </button>
        </div>
    );
}
