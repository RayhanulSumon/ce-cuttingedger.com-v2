import React, { useState } from 'react';
import { Tag, Sparkles, ArrowRight, ChevronDown } from 'lucide-react';

export interface QuoteCardProps {
    card: {
        service_name: string;
        service_slug?: string;
        complexity?: string;
        quantity?: number;
        unit_price?: string;
        regular_total?: string | null;
        total_price?: string;
        currency?: string;
        turnaround?: string;
        discount_applied?: string | null;
        free_trial_eligible?: boolean;
        call_to_action?: string;
        base_rates?: Record<string, number>;
    };
    onSelectReply: (reply: string) => void;
    onUploadClick?: () => void;
}

const SERVICE_OPTIONS: Record<string, { title: string; rates: Record<string, number> }> = {
    'background-removal': {
        title: 'Clipping Path / Cutout',
        rates: { simple: 0.45, medium: 0.85, complex: 1.75 },
    },
    'ghost-mannequin': {
        title: 'Ghost Mannequin Joint',
        rates: { simple: 0.95, medium: 1.45, complex: 2.40 },
    },
    'high-end-model-retouch': {
        title: 'Model & Skin Retouch',
        rates: { simple: 1.80, medium: 3.20, complex: 5.50 },
    },
    'jewelry-retouch': {
        title: 'Fine Jewelry Retouch',
        rates: { simple: 1.95, medium: 3.60, complex: 6.20 },
    },
    '3d-modeling': {
        title: '3D CGI Product Modeling',
        rates: { simple: 25.00, medium: 55.00, complex: 110.00 },
    },
};

export function QuoteCard({ card, onSelectReply, onUploadClick }: QuoteCardProps) {
    const initialSlug = (card.service_slug && SERVICE_OPTIONS[card.service_slug])
        ? card.service_slug
        : 'background-removal';

    const [serviceKey, setServiceKey] = useState<string>(initialSlug);

    const currentService = SERVICE_OPTIONS[serviceKey] || SERVICE_OPTIONS['background-removal'];
    const rates = currentService.rates;

    const initialComplexity = card.complexity?.toLowerCase().includes('complex')
        ? 'complex'
        : (card.complexity?.toLowerCase().includes('medium') ? 'medium' : 'simple');

    const [complexity, setComplexity] = useState<string>(initialComplexity);
    const [quantity, setQuantity] = useState<number>(card.quantity && card.quantity > 3 ? card.quantity : 3);

    const baseRate = rates[complexity] ?? rates.simple ?? 0.45;
    const isFreeTrial = quantity <= 3;

    // Volume discount
    const discountPercent = quantity >= 100 ? 20 : (quantity >= 25 ? 10 : 0);
    const unitPrice = Math.round(baseRate * (1 - discountPercent / 100) * 100) / 100;
    const totalPrice = isFreeTrial ? '0.00' : (unitPrice * quantity).toFixed(2);

    return (
        <div className="my-2 p-3.5 rounded-2xl bg-[#14161f] border border-white/10 shadow-xl text-left space-y-3">
            {/* Header: Compact Service Dropdown & Turnaround */}
            <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="p-1.5 rounded-lg bg-accent/10 text-accent shrink-0">
                        <Tag className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="relative">
                            <select
                                value={serviceKey}
                                onChange={(e) => setServiceKey(e.target.value)}
                                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-2 py-1 pr-6 text-xs font-bold text-white focus:outline-none focus:border-accent cursor-pointer appearance-none transition-colors"
                            >
                                {Object.entries(SERVICE_OPTIONS).map(([key, item]) => (
                                    <option key={key} value={key} className="bg-[#14161f] text-white">
                                        {item.title}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="w-3.5 h-3.5 text-white/50 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                        <span className="text-[10px] text-white/50 font-mono block mt-0.5 px-0.5">
                            {card.turnaround || '24h Studio Turnaround'}
                        </span>
                    </div>
                </div>
                {isFreeTrial && (
                    <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent text-black shrink-0 self-start mt-1">
                        <Sparkles className="w-2.5 h-2.5" /> Free ($0)
                    </span>
                )}
            </div>

            {/* Complexity Pills: Simple, Medium, Complex */}
            <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] text-white/50 font-mono shrink-0">Complexity:</span>
                <div className="flex gap-1">
                    {[
                        { key: 'simple', label: 'Simple', price: rates.simple ?? 0.45 },
                        { key: 'medium', label: 'Medium', price: rates.medium ?? 0.85 },
                        { key: 'complex', label: 'Complex', price: rates.complex ?? 1.75 },
                    ].map((c) => {
                        const active = complexity === c.key;
                        return (
                            <button
                                key={c.key}
                                type="button"
                                onClick={() => setComplexity(c.key)}
                                className={`px-2 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer border ${
                                    active
                                        ? 'bg-accent text-black font-bold border-accent'
                                        : 'bg-white/5 text-white/70 border-white/5 hover:bg-white/10'
                                }`}
                            >
                                {c.label} <span className={active ? 'text-black/80 font-normal' : 'text-accent'}>${c.price.toFixed(2)}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Quantity Pills */}
            <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] text-white/50 font-mono shrink-0">Quantity:</span>
                <div className="flex gap-1">
                    {[
                        { qty: 3, label: '3 (Free)' },
                        { qty: 25, label: '25' },
                        { qty: 100, label: '100+ (-20%)' },
                    ].map((q) => {
                        const active = quantity === q.qty;
                        return (
                            <button
                                key={q.qty}
                                type="button"
                                onClick={() => setQuantity(q.qty)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer border ${
                                    active
                                        ? 'bg-white text-black font-bold border-white'
                                        : 'bg-white/5 text-white/70 border-white/5 hover:bg-white/10'
                                }`}
                            >
                                {q.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Price & Primary Action */}
            <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-3">
                <div>
                    <span className="text-[10px] text-white/50 block font-mono">Estimate:</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-base font-bold text-accent font-mono">${totalPrice}</span>
                        <span className="text-[10px] text-white/50 font-mono">
                            {isFreeTrial ? 'USD (Free)' : `($${unitPrice.toFixed(2)}/img)`}
                        </span>
                    </div>
                </div>

                {isFreeTrial ? (
                    <button
                        type="button"
                        onClick={() => onSelectReply('Claim 3 Free Sample Edits')}
                        className="py-1.5 px-3 rounded-xl bg-accent hover:bg-[#bce600] text-black font-semibold text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                    >
                        <span>Test 3 Free</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={() => onSelectReply(`Proceed with order for ${quantity} ${currentService.title} images (${complexity} complexity, $${totalPrice})`)}
                        className="py-1.5 px-3 rounded-xl bg-accent hover:bg-[#bce600] text-black font-semibold text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                    >
                        <span>Proceed to Order</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>
        </div>
    );
}
