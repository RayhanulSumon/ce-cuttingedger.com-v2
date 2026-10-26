import React from 'react';
import { Check, Sparkles, ArrowUpRight, Zap, ShieldCheck, Clock, Layers } from 'lucide-react';

interface PricingTier {
    id: string;
    name: string;
    badge: string;
    description: string;
    sla: string;
    capacity: string;
    popular?: boolean;
    buttonText: string;
    features: string[];
}

export function PricingCardsSection() {
    const tiers: PricingTier[] = [
        {
            id: 'starter',
            name: 'Essential Studio',
            badge: 'STANDARD CATALOG PREP',
            description:
                'Engineered for emerging e-commerce brands, Amazon/Shopify sellers, and boutique catalogs requiring spotless product cutouts and rapid turnarounds.',
            sla: '24-Hour Standard SLA',
            capacity: 'Up to 500 images / day',
            buttonText: 'Request For Pricing',
            features: [
                '100% Hand-drawn pen vector clipping paths',
                'Pure white (RGB 255, 255, 255) & transparent alpha cutouts',
                'Basic dust, speck & scratch micro-cleaning',
                'Natural drop shadow & studio reflection sculpting',
                'Standard web RGB optimization & format exports',
                '3-Stage human QA inspection before delivery',
                'Unlimited free revisions until complete satisfaction',
            ],
        },
        {
            id: 'pro',
            name: 'Pro Commercial',
            badge: 'HIGH-VELOCITY RETAIL',
            popular: true,
            description:
                'Tailored for established fashion brands, high-volume apparel retailers, and creative agencies requiring master retouching and dedicated daily capacity.',
            sla: '12–18 Hour Rush SLA',
            capacity: '500 to 3,000+ images / day',
            buttonText: 'Request For Pricing',
            features: [
                'Everything included in Essential Studio',
                '3D Invisible ghost mannequin neckline jointing & symmetry',
                'High-end fashion skin retouching (frequency separation)',
                'Macro jewelry facet polish & specular highlight tuning',
                'Multi-channel multipath masking & component isolation',
                'Complex fabric colorway swaps & pantone matching',
                'Dedicated Senior Art Director & project coordinator',
                'Direct Slack / Microsoft Teams communication channel',
            ],
        },
        {
            id: 'enterprise',
            name: 'Enterprise Vanguard',
            badge: 'BESPOKE 24/7 PARTNERSHIP',
            description:
                'Bespoke production infrastructure for global luxury houses, international e-commerce marketplaces, and CGI 3D digital asset creation pipelines.',
            sla: 'Under 6-Hour Priority Sprint SLA',
            capacity: 'Unlimited Dedicated Capacity',
            buttonText: 'Request Custom Quote',
            features: [
                'Everything in Pro Commercial included',
                '3D CAD-to-photorealistic CGI rendering & PBR texturing',
                'Automated SFTP / AWS S3 hot-folder batch processing',
                'Direct API integration for automated asset handoff',
                '24/7/365 round-the-clock artist shifts across global hubs',
                'Enterprise-grade NDA, SOC2 storage & encrypted transfers',
                'Custom automated naming conventions & metadata tags',
                'Executive SLA guarantee with dedicated account director',
            ],
        },
    ];

    const handleOpenContact = (planName: string) => {
        if (typeof window !== 'undefined') {
            window.dispatchEvent(
                new CustomEvent('ce:open-contact', {
                    detail: { plan: planName },
                })
            );
        }
    };

    return (
        <section id="pricing-plans-section" className="relative py-20 sm:py-28 bg-[#08090d] border-t border-white/10 select-none overflow-hidden">
            {/* Ambient Lighting Accents */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70rem] h-[35rem] bg-accent/5 rounded-full blur-[240px] pointer-events-none" />
            <div className="absolute bottom-0 right-10 w-[30rem] h-[30rem] bg-accent/4 rounded-full blur-[200px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 xs:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-widest text-accent">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>[ BESPOKE PRODUCTION TIERS ]</span>
                    </div>

                    <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight leading-[1.08]">
                        Scalable Production. <br />
                        <span className="text-accent">Predictable Value.</span>
                    </h2>

                    <p className="text-sm sm:text-base text-neutral-400 font-sans leading-relaxed">
                        No rigid per-click fees or hidden charges. Every brand receives a bespoke volume quote tailored to your exact SKU complexity, turnaround SLA, and monthly throughput.
                    </p>
                </div>

                {/* 3 Tier Cards Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-8 items-stretch">
                    {tiers.map((tier) => {
                        const isFeatured = tier.popular;

                        return (
                            <div
                                key={tier.id}
                                className={`relative rounded-3xl p-7 sm:p-9 flex flex-col justify-between transition-all duration-300 ${
                                    isFeatured
                                        ? 'bg-[#10121a] border-2 border-accent shadow-[0_0_50px_rgba(251,183,24,0.15)] lg:-translate-y-2'
                                        : 'bg-[#0e0f15] border border-white/10 hover:border-white/20'
                                }`}
                            >
                                {/* Featured Ribbon Pill */}
                                {isFeatured && (
                                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
                                        <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-accent text-black text-[11px] font-mono uppercase tracking-widest font-black shadow-lg">
                                            <Zap className="w-3 h-3 fill-black text-black" />
                                            <span>MOST REQUESTED TIER</span>
                                        </span>
                                    </div>
                                )}

                                <div>
                                    {/* Eyebrow Badge */}
                                    <div className="mb-4">
                                        <span
                                            className={`text-[11px] font-mono uppercase tracking-wider font-semibold ${
                                                isFeatured ? 'text-accent' : 'text-neutral-400'
                                            }`}
                                        >
                                            {tier.badge}
                                        </span>
                                    </div>

                                    {/* Tier Title */}
                                    <h3 className="text-2xl sm:text-3xl font-display font-bold text-white mb-3">
                                        {tier.name}
                                    </h3>

                                    <p className="text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed mb-6">
                                        {tier.description}
                                    </p>

                                    {/* Quote Request Price Box (No Dollar Amount) */}
                                    <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 mb-6 space-y-1">
                                        <div className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
                                            Volume Pricing
                                        </div>
                                        <div className="text-xl sm:text-2xl font-display font-extrabold text-white">
                                            Custom Volume Quote
                                        </div>
                                        <div className="text-[11px] font-sans text-neutral-400">
                                            Tailored rates based on batch volume &amp; asset complexity
                                        </div>
                                    </div>

                                    {/* SLA & Capacity Highlights */}
                                    <div className="grid grid-cols-2 gap-3 mb-6 pb-6 border-b border-white/10 text-left">
                                        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                                            <div className="flex items-center gap-1.5 text-neutral-400 text-[10px] font-mono uppercase tracking-wider">
                                                <Clock className="w-3 h-3 text-accent" />
                                                <span>Speed</span>
                                            </div>
                                            <div className="text-xs sm:text-[13px] font-semibold text-white">
                                                {tier.sla}
                                            </div>
                                        </div>

                                        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                                            <div className="flex items-center gap-1.5 text-neutral-400 text-[10px] font-mono uppercase tracking-wider">
                                                <Layers className="w-3 h-3 text-accent" />
                                                <span>Capacity</span>
                                            </div>
                                            <div className="text-xs sm:text-[13px] font-semibold text-white">
                                                {tier.capacity}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Feature Checklist */}
                                    <div className="space-y-3 mb-8">
                                        <div className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-semibold mb-2">
                                            Deliverables &amp; Guarantees:
                                        </div>
                                        {tier.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-[13px] text-neutral-300 font-sans leading-snug">
                                                <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                                                <span>{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Action Button */}
                                <div className="pt-2">
                                    <button
                                        type="button"
                                        onClick={() => handleOpenContact(tier.name)}
                                        className={`w-full py-4 px-6 rounded-2xl font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${
                                            isFeatured
                                                ? 'bg-accent text-black hover:bg-accent-hover shadow-[0_0_30px_rgba(251,183,24,0.35)]'
                                                : 'bg-white/10 text-white hover:bg-accent hover:text-black hover:shadow-[0_0_25px_rgba(251,183,24,0.3)]'
                                        }`}
                                    >
                                        <span>{tier.buttonText}</span>
                                        <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom Trust Assurance Strip */}
                <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent shrink-0">
                            <ShieldCheck className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                            <h4 className="text-base sm:text-lg font-display font-bold text-white">
                                Risk-Free Proof Of Concept Pilot
                            </h4>
                            <p className="text-xs sm:text-sm text-neutral-400 font-sans">
                                Test our surgical accuracy on 3 of your real production files before signing any agreement.
                            </p>
                        </div>
                    </div>

                    <a
                        href="#trial-uploader-section"
                        className="px-6 py-3 rounded-full border border-white/20 bg-white/5 hover:bg-accent hover:text-black hover:border-accent text-xs font-mono uppercase tracking-wider text-white font-bold transition-all duration-300 shrink-0 cursor-pointer"
                    >
                        Upload 3 Test Images Free
                    </a>
                </div>
            </div>
        </section>
    );
}
