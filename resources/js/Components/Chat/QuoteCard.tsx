import React, { useState } from 'react';
import {
    Tag,
    Sparkles,
    CheckCircle2,
    ArrowRight,
    SlidersHorizontal,
    Info,
    Minus,
    Plus,
    Layers,
    Scissors,
    Shirt,
    Gem,
    User,
    Box,
} from 'lucide-react';

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
        complexity_rates?: Record<string, { rate: number; label: string; desc: string }>;
        base_rates?: Record<string, number>;
    };
    onSelectReply: (reply: string) => void;
    onUploadClick?: () => void;
}

const SERVICE_RATES: Record<string, { title: string; rates: Record<string, number>; icon: React.ElementType }> = {
    'background-removal': {
        title: 'Clipping Path / Cutout',
        icon: Scissors,
        rates: { simple: 0.45, medium: 0.85, complex: 1.75, super_complex: 3.20 },
    },
    'ghost-mannequin': {
        title: 'Ghost Mannequin Joint',
        icon: Shirt,
        rates: { simple: 0.95, medium: 1.45, complex: 2.40, super_complex: 3.80 },
    },
    'high-end-model-retouch': {
        title: 'Model & Skin Retouch',
        icon: User,
        rates: { simple: 1.80, medium: 3.20, complex: 5.50, super_complex: 9.50 },
    },
    'jewelry-retouch': {
        title: 'Fine Jewelry Retouch',
        icon: Gem,
        rates: { simple: 1.95, medium: 3.60, complex: 6.20, super_complex: 11.00 },
    },
    '3d-modeling': {
        title: '3D CGI Product Modeling',
        icon: Box,
        rates: { simple: 25.00, medium: 55.00, complex: 110.00, super_complex: 220.00 },
    },
};

const COMPLEXITY_META: Record<string, { label: string; example: string }> = {
    simple: { label: 'Simple', example: 'Clean solid edges, boxes, shoes, single bottle' },
    medium: { label: 'Medium', example: 'Multiple cutouts, soft fabric edges, 2-3 interior holes' },
    complex: { label: 'Complex', example: 'Fine hair, netting, bicycles, intricate multipaths' },
    super_complex: { label: 'Super Complex', example: 'Fine jewelry, transparent lace, wireframes' },
};

export function QuoteCard({ card, onSelectReply, onUploadClick }: QuoteCardProps) {
    const initialSlug = SERVICE_RATES[card.service_slug] ? card.service_slug : 'background-removal';
    const initialComplexity = (card.complexity?.toLowerCase().replace(/\s+/g, '_') || 'simple') in COMPLEXITY_META
        ? card.complexity.toLowerCase().replace(/\s+/g, '_')
        : 'simple';

    const [serviceKey, setServiceKey] = useState<string>(initialSlug);
    const [complexity, setComplexity] = useState<string>(initialComplexity);
    const [quantity, setQuantity] = useState<number>(Math.max(1, card.quantity || 50));

    const activeService = SERVICE_RATES[serviceKey] || SERVICE_RATES['background-removal'];
    const baseRate = activeService.rates[complexity] ?? activeService.rates.simple;

    // Volume Discount Calculation
    let discountPercent = 0;
    if (quantity >= 500) {
        discountPercent = 35;
    } else if (quantity >= 100) {
        discountPercent = 20;
    } else if (quantity >= 25) {
        discountPercent = 10;
    }

    const discountedUnit = Math.round(baseRate * (1 - discountPercent / 100) * 100) / 100;
    const isFreeTrial = quantity <= 3;
    const rawTotal = Math.round(discountedUnit * quantity * 100) / 100;
    const displayTotal = isFreeTrial ? '0.00' : rawTotal.toFixed(2);

    const handleQtyPreset = (qty: number) => {
        setQuantity(qty);
    };

    return (
        <div className="my-2 p-4 rounded-2xl bg-[#12141a]/95 border border-[#d4ff00]/40 shadow-2xl backdrop-blur-md text-left space-y-3.5">
            {/* Header */}
            <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-[#d4ff00]/10 text-[#d4ff00]">
                        <Tag className="w-4 h-4" />
                    </span>
                    <div>
                        <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                            <span>{activeService.title}</span>
                        </h4>
                        <span className="text-[10px] text-white/50 font-mono">
                            Volume & Complexity Rate Estimator
                        </span>
                    </div>
                </div>
                {isFreeTrial && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#d4ff00] text-black shrink-0">
                        <Sparkles className="w-3 h-3" /> Free Trial ($0)
                    </span>
                )}
            </div>

            {/* Service Category Switcher */}
            <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-white/50 block mb-1.5">
                    1. Select Service Category
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {Object.entries(SERVICE_RATES).map(([key, s]) => {
                        const Icon = s.icon;
                        const isSelected = serviceKey === key;
                        return (
                            <button
                                key={key}
                                type="button"
                                onClick={() => setServiceKey(key)}
                                className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex items-center gap-2 ${
                                    isSelected
                                        ? 'bg-[#d4ff00]/15 border-[#d4ff00] text-white font-semibold'
                                        : 'bg-white/5 border-white/5 text-white/70 hover:bg-white/10'
                                }`}
                            >
                                <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#d4ff00]' : 'text-white/40'}`} />
                                <span className="text-xs truncate">{s.title}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Image Complexity Section */}
            <div>
                <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-white/50 flex items-center gap-1">
                        <span>2. Image Complexity</span>
                    </span>
                    <span className="text-[10px] text-[#d4ff00] font-mono">
                        Base: ${baseRate.toFixed(2)} / img
                    </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {Object.entries(COMPLEXITY_META).map(([key, meta]) => {
                        const isSelected = complexity === key;
                        const rateVal = activeService.rates[key] ?? 0;
                        return (
                            <button
                                key={key}
                                type="button"
                                onClick={() => setComplexity(key)}
                                className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                                    isSelected
                                        ? 'bg-[#d4ff00] text-black border-[#d4ff00] shadow-md font-bold'
                                        : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                                }`}
                            >
                                <div className="text-xs">{meta.label}</div>
                                <div className={`text-[10px] font-mono ${isSelected ? 'text-black/80' : 'text-[#d4ff00]'}`}>
                                    ${rateVal.toFixed(2)}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Complexity Explanation Note */}
                <div className="mt-2 p-2 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] text-white/70 font-sans flex items-start gap-1.5">
                    <Info className="w-3.5 h-3.5 text-[#00f5ff] shrink-0 mt-0.5" />
                    <span>
                        <strong className="text-white capitalize">{complexity.replace('_', ' ')}</strong>: {COMPLEXITY_META[complexity]?.example}. Prices scale with edge detail, cutout holes, and transparency.
                    </span>
                </div>
            </div>

            {/* Quantity / Batch Volume */}
            <div>
                <div className="flex items-center justify-between mb-1.5 text-xs font-mono">
                    <span className="text-[10px] uppercase tracking-wider text-white/50">
                        3. Quantity / Volume
                    </span>
                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            onClick={() => setQuantity((q) => Math.max(1, q - 10))}
                            className="p-1 rounded bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                        >
                            <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-white font-bold w-12 text-center">{quantity}</span>
                        <button
                            type="button"
                            onClick={() => setQuantity((q) => q + 25)}
                            className="p-1 rounded bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                        >
                            <Plus className="w-3 h-3" />
                        </button>
                    </div>
                </div>

                {/* Preset Chips */}
                <div className="flex flex-wrap gap-1.5">
                    {[
                        { label: '3 (Free Trial)', qty: 3 },
                        { label: '25 (-10%)', qty: 25 },
                        { label: '100 (-20%)', qty: 100 },
                        { label: '500+ (-35%)', qty: 500 },
                    ].map((p) => (
                        <button
                            key={p.qty}
                            type="button"
                            onClick={() => handleQtyPreset(p.qty)}
                            className={`text-xs font-mono px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                                quantity === p.qty
                                    ? 'bg-[#00f5ff] text-black font-bold border-[#00f5ff]'
                                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                            }`}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Summary Price Box */}
            <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs font-mono space-y-1.5">
                <div className="flex items-center justify-between text-white/60">
                    <span>Effective Unit Rate:</span>
                    <div className="text-right">
                        {discountPercent > 0 && (
                            <span className="text-[10px] text-emerald-400 mr-1.5 font-bold">
                                {discountPercent}% OFF
                            </span>
                        )}
                        <span className="text-white font-bold">${discountedUnit.toFixed(2)} / img</span>
                    </div>
                </div>

                <div className="flex items-baseline justify-between pt-1 border-t border-white/5">
                    <span className="text-white/70 font-semibold">Estimated Total:</span>
                    <div className="text-right flex items-baseline gap-1.5">
                        {isFreeTrial && (
                            <span className="text-xs line-through text-white/40 font-mono">
                                ${(discountedUnit * quantity).toFixed(2)}
                            </span>
                        )}
                        <span className="text-lg font-bold text-[#d4ff00]">
                            ${displayTotal}
                        </span>
                        <span className="text-[10px] text-white/50">
                            {isFreeTrial ? 'USD (ZERO COST)' : 'USD'}
                        </span>
                    </div>
                </div>
            </div>

            {/* CTA Button */}
            <button
                type="button"
                onClick={() => {
                    if (isFreeTrial) {
                        onSelectReply('Claim 3 Free Sample Edits');
                    } else {
                        if (onUploadClick) {
                            onUploadClick();
                        }
                        onSelectReply(`I would like a quote for ${quantity} ${activeService.title} images (${complexity} complexity)`);
                    }
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-[#d4ff00] hover:bg-[#b8dd00] text-black font-semibold text-xs font-mono tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-[#d4ff00]/20 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
                <span>
                    {isFreeTrial
                        ? 'Claim 3 Free Sample Edits ($0.00 Zero Cost)'
                        : `Proceed with ${quantity} Images ($${displayTotal})`}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
            </button>
        </div>
    );
}
