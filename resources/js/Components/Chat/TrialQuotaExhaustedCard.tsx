import React from 'react';
import { AlertTriangle, Calendar, Calculator, ArrowRight, DollarSign, CheckCircle2 } from 'lucide-react';

export interface TrialQuotaExhaustedCardProps {
    card: {
        title?: string;
        client_email?: string;
        message?: string;
        starting_rate?: string;
        services?: Array<{ name: string; rate: string }>;
    };
    onSendPrompt?: (text: string) => void;
}

export function TrialQuotaExhaustedCard({ card, onSendPrompt }: TrialQuotaExhaustedCardProps) {
    const services = card.services || [
        { name: 'Clipping Path / Background Removal', rate: '$0.49 / image' },
        { name: 'Multi-Path Vector Masking', rate: '$1.25 / image' },
        { name: 'Ghost Mannequin / Invisible Symmetry', rate: '$0.99 / image' },
        { name: 'High-End E-Commerce Retouching', rate: '$1.49 / image' },
    ];

    return (
        <div className="my-2.5 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 shadow-2xl backdrop-blur-md text-left space-y-3.5">
            {/* Header */}
            <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-amber-400 text-black">
                        <AlertTriangle className="w-4 h-4" />
                    </span>
                    <div>
                        <h4 className="text-sm font-bold text-white tracking-tight">
                            {card.title || 'Free Trial Quota Limit Reached'}
                        </h4>
                        <span className="text-[10px] text-amber-300 font-mono uppercase tracking-wider block">
                            Trial Credit Previously Claimed
                        </span>
                    </div>
                </div>

                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                    Standard Rates Apply
                </span>
            </div>

            {/* Explanation Notice */}
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1.5 text-xs font-mono">
                <p className="text-white/90 leading-relaxed">
                    {card.message || 'You have already redeemed your 100% Free Trial sample quota under this email address. Free trials are limited to one trial batch per client / studio.'}
                </p>
                {card.client_email && (
                    <div className="text-[11px] text-white/50 pt-1">
                        Registered Email: <span className="text-[#00f5ff] font-semibold">{card.client_email}</span>
                    </div>
                )}
            </div>

            {/* Standard Rates Breakdown */}
            <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block font-semibold">
                    Standard Studio Production Pricing
                </span>
                <div className="grid grid-cols-1 gap-1.5">
                    {services.map((svc, idx) => (
                        <div
                            key={idx}
                            className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5 text-xs font-mono"
                        >
                            <span className="text-neutral-300 text-[11px]">{svc.name}</span>
                            <span className="font-bold text-[#d4ff00] text-xs">{svc.rate}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-1 flex flex-col sm:flex-row gap-2">
                <button
                    type="button"
                    onClick={() => onSendPrompt?.('Schedule 15-Min Technical Call')}
                    className="flex-1 py-2 px-3 rounded-xl bg-[#00f5ff] hover:bg-[#00d8e6] text-black font-semibold text-xs font-mono flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-md"
                >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Technical Call</span>
                </button>
                <button
                    type="button"
                    onClick={() => onSendPrompt?.('Show Pricing Calculator')}
                    className="flex-1 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs font-mono flex items-center justify-center gap-1.5 cursor-pointer transition-colors border border-white/10"
                >
                    <Calculator className="w-3.5 h-3.5 text-[#d4ff00]" />
                    <span>Volume Calculator</span>
                </button>
            </div>
        </div>
    );
}
