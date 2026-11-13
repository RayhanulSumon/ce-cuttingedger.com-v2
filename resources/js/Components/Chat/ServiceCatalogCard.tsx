import React, { useState } from 'react';
import {
    Layers,
    Scissors,
    Shirt,
    Sparkles,
    Gem,
    Box,
    FileSpreadsheet,
    Clock,
    DollarSign,
    ChevronDown,
    ChevronUp,
    ArrowRight,
    CheckCircle2,
    Calendar,
    Calculator,
    Shield,
} from 'lucide-react';

export interface ServiceItem {
    id: number;
    slug: string;
    title: string;
    subtitle: string;
    icon?: string;
    accent_color?: string;
    starting_rate: string;
    turnaround: string;
    features: string[];
    deliverables: string[];
}

export interface ServiceCatalogCardProps {
    card: {
        type: string;
        title?: string;
        subtitle?: string;
        services?: ServiceItem[];
        trial_banner?: string;
        // Or single service detail
        slug?: string;
        description?: string;
        features?: string[];
        deliverables?: string[];
        sample_formats?: string[];
        starting_rate?: string;
        turnaround?: string;
        accent_color?: string;
    };
    onSendPrompt?: (text: string) => void;
}

export function ServiceCatalogCard({ card, onSendPrompt }: ServiceCatalogCardProps) {
    const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

    // Icon resolver helper
    const getServiceIcon = (iconName?: string, slug?: string) => {
        if (slug?.includes('mannequin') || iconName === 'Shirt') return <Shirt className="w-4 h-4" />;
        if (slug?.includes('background') || iconName === 'Scissors') return <Scissors className="w-4 h-4" />;
        if (slug?.includes('model') || iconName === 'Sparkles') return <Sparkles className="w-4 h-4" />;
        if (slug?.includes('jewelry') || iconName === 'Gem') return <Gem className="w-4 h-4" />;
        if (slug?.includes('3d') || iconName === 'Box') return <Box className="w-4 h-4" />;
        if (slug?.includes('dtp') || iconName === 'FileSpreadsheet') return <FileSpreadsheet className="w-4 h-4" />;
        return <Layers className="w-4 h-4" />;
    };

    // If this is a single service detail card
    if (card.type === 'service_detail_card') {
        const accentColor = card.accent_color || '#00f5ff';
        return (
            <div className="my-2.5 p-4 rounded-2xl bg-white/95 border border-primary/30 shadow-2xl backdrop-blur-md text-left space-y-3">
                <div className="flex items-start justify-between gap-3 border-b border-ink/10 pb-3">
                    <div className="flex items-center gap-2.5">
                        <span
                            className="p-2 rounded-xl text-black flex items-center justify-center font-bold"
                            style={{ backgroundColor: accentColor }}
                        >
                            {getServiceIcon(card.icon, card.slug)}
                        </span>
                        <div>
                            <span className="text-[10px] font-mono uppercase tracking-wider text-primary-ink block">
                                Technical Specification
                            </span>
                            <h4 className="text-sm font-bold text-ink tracking-tight">{card.title}</h4>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-[11px] font-mono font-bold text-primary-ink block">
                            {card.starting_rate}
                        </span>
                        <span className="text-[10px] text-ink/50 font-mono flex items-center gap-1 justify-end">
                            <Clock className="w-3 h-3" />
                            {card.turnaround}
                        </span>
                    </div>
                </div>

                {card.description && (
                    <p className="text-xs text-ink/70 leading-relaxed">
                        {card.description}
                    </p>
                )}

                {/* Features & Deliverables Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                    {card.features && card.features.length > 0 && (
                        <div className="p-2.5 rounded-xl bg-ink/[0.03] border border-ink/10 space-y-1.5">
                            <span className="text-[10px] text-primary-ink uppercase tracking-wider block font-bold">
                                Key Highlights
                            </span>
                            {card.features.map((feat, i) => (
                                <div key={i} className="flex items-start gap-1.5 text-ink/80 text-[11px]">
                                    <CheckCircle2 className="w-3 h-3 text-primary-ink shrink-0 mt-0.5" />
                                    <span>{feat}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {card.deliverables && card.deliverables.length > 0 && (
                        <div className="p-2.5 rounded-xl bg-ink/[0.03] border border-ink/10 space-y-1.5">
                            <span className="text-[10px] text-primary-ink uppercase tracking-wider block font-bold">
                                Master Deliverables
                            </span>
                            {card.deliverables.map((deliv, i) => (
                                <div key={i} className="flex items-start gap-1.5 text-ink/80 text-[11px]">
                                    <ArrowRight className="w-3 h-3 text-primary-ink shrink-0 mt-0.5" />
                                    <span>{deliv}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Direct Action CTA Buttons */}
                <div className="flex items-center gap-2 pt-1">
                    <button
                        type="button"
                        onClick={() => onSendPrompt?.(`Calculate volume price for ${card.title}`)}
                        className="flex-1 py-2 px-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold text-xs font-mono flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                    >
                        <Calculator className="w-3.5 h-3.5" />
                        <span>Get Instant Quote</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => onSendPrompt?.(`Book technical intake call for ${card.title}`)}
                        className="py-2 px-3 rounded-xl bg-ink/[0.05] hover:bg-ink/10 text-ink font-mono text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                        <Calendar className="w-3.5 h-3.5 text-primary-ink" />
                        <span>Book Call</span>
                    </button>
                </div>
            </div>
        );
    }

    // Otherwise render full service catalog list
    const services = card.services || [];

    return (
        <div className="my-2.5 p-3.5 sm:p-4 rounded-2xl bg-white/95 border border-ink/15 shadow-2xl backdrop-blur-md text-left space-y-3">
            <div className="flex items-center justify-between border-b border-ink/10 pb-2.5">
                <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-primary/15 text-primary-ink">
                        <Layers className="w-4 h-4" />
                    </span>
                    <div>
                        <h4 className="text-sm font-bold text-ink tracking-tight">
                            {card.title || 'Studio Production Services'}
                        </h4>
                        <p className="text-[10px] text-ink/50 font-mono">
                            {card.subtitle || 'Senior human retouchers • 100% Pen Tool precision'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Service Cards List */}
            <div className="space-y-2">
                {services.map((s) => {
                    const isExpanded = expandedSlug === s.slug;
                    return (
                        <div
                            key={s.id || s.slug}
                            className={`rounded-xl border transition-all ${
                                isExpanded
                                    ? 'bg-white/8 border-primary/40 shadow-lg'
                                    : 'bg-white/4 border-ink/10 hover:border-ink/15'
                            }`}
                        >
                            <div className="p-2.5 flex items-center justify-between gap-2.5">
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-black font-bold"
                                        style={{ backgroundColor: s.accent_color || 'var(--color-primary)' }}
                                    >
                                        {getServiceIcon(s.icon, s.slug)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-ink truncate">{s.title}</p>
                                        <p className="text-[10px] text-ink/60 truncate font-mono">
                                            {s.starting_rate} • {s.turnaround}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => setExpandedSlug(isExpanded ? null : s.slug)}
                                        className="py-1 px-2 rounded-lg bg-ink/[0.03] hover:bg-ink/[0.05] text-[11px] text-ink/70 hover:text-ink font-mono flex items-center gap-1 transition-colors cursor-pointer"
                                        title={isExpanded ? 'Collapse' : 'View Specs'}
                                    >
                                        <span>{isExpanded ? 'Less' : 'Specs'}</span>
                                        {isExpanded ? (
                                            <ChevronUp className="w-3 h-3" />
                                        ) : (
                                            <ChevronDown className="w-3 h-3" />
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onSendPrompt?.(`Get quote for ${s.title}`)}
                                        className="py-1 px-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-[11px] font-mono font-bold flex items-center gap-1 transition-all cursor-pointer"
                                    >
                                        <span>Quote</span>
                                        <ArrowRight className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>

                            {/* Expanded Spec Panel */}
                            {isExpanded && (
                                <div className="px-3 pb-3 pt-1 border-t border-ink/10 space-y-2 animate-in fade-in duration-200">
                                    <p className="text-[11px] text-ink/75">{s.subtitle}</p>

                                    {s.features && s.features.length > 0 && (
                                        <div className="space-y-1">
                                            <span className="text-[9px] font-mono uppercase tracking-wider text-primary-ink font-semibold">
                                                Technical Highlights
                                            </span>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-ink/80 font-mono">
                                                {s.features.map((f, fIdx) => (
                                                    <div key={fIdx} className="flex items-center gap-1.5">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                        <span>{f}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="pt-2 flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => onSendPrompt?.(`Book technical call for ${s.title}`)}
                                            className="py-1.5 px-2.5 rounded-lg bg-ink/[0.05] hover:bg-ink/10 text-ink text-[11px] font-mono flex items-center gap-1.5 cursor-pointer"
                                        >
                                            <Calendar className="w-3 h-3 text-primary-ink" />
                                            <span>Schedule Call</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onSendPrompt?.(`Tell me about ${s.title} deliverables and formats`)}
                                            className="text-[11px] text-primary-ink hover:underline font-mono py-1 px-2"
                                        >
                                            View Full SLA & Formats →
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Trial Banner */}
            <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/25 flex items-center gap-2 text-[11px] font-mono text-ink/80">
                <Shield className="w-3.5 h-3.5 text-primary-ink shrink-0" />
                <span>{card.trial_banner || 'All services include 3 Free Sample Edits with zero upfront billing.'}</span>
            </div>
        </div>
    );
}
