import React, { useState } from 'react';
import { Check, ArrowUpRight, ShieldCheck, Zap, Sparkles, Layers, Box, Cpu, Eye } from 'lucide-react';

interface PricingTier {
    id: string;
    name: string;
    badge: string;
    description: string;
    pricingLabel: string;
    pricingSubtext: string;
    sla: string;
    capacity: string;
    popular?: boolean;
    buttonText: string;
    icon: React.ComponentType<{ className?: string }>;
    features: { bold: string; text: string }[];
}

export function PricingCardsSection() {
    const [activeTab, setActiveTab] = useState<'2d' | '3d'>('2d');

    // 2D Catalog Retouching & Post-Production Tiers
    const tiers2D: PricingTier[] = [
        {
            id: 'starter-2d',
            name: 'Essential Studio',
            badge: 'Catalog Prep',
            icon: Layers,
            description: 'Spotless product cutouts, vector clipping paths, and clean catalog delivery.',
            pricingLabel: 'Per-Asset Volume Quote',
            pricingSubtext: 'No monthly minimum • Pay as you go',
            sla: '24h Standard SLA',
            capacity: 'Up to 500 assets/day',
            buttonText: 'Request Volume Quote',
            features: [
                { bold: '100% Hand-drawn', text: 'pen clipping paths & alpha masks' },
                { bold: 'Pure white (RGB 255)', text: '& transparent format exports' },
                { bold: 'Natural drop shadows', text: '& studio reflection sculpting' },
                { bold: '3-Stage human QA', text: 'with unlimited free revisions' },
            ],
        },
        {
            id: 'pro-2d',
            name: 'Pro Commercial',
            badge: 'High-Velocity Retail',
            popular: true,
            icon: Sparkles,
            description: 'Master retouching for fashion, apparel brands, and fast-moving creative agencies.',
            pricingLabel: 'Studio Monthly Retainer',
            pricingSubtext: 'Guaranteed daily throughput • Priority rush',
            sla: '12–18h Rush SLA',
            capacity: '500 to 3,000+ assets/day',
            buttonText: 'Request Retainer Quote',
            features: [
                { bold: 'Everything in Essential', text: 'included as standard' },
                { bold: '3D Ghost mannequin', text: 'neckline jointing & symmetry' },
                { bold: 'Frequency separation', text: 'high-end skin & apparel retouching' },
                { bold: 'Colorway swaps', text: '& delta-E fabric swatch matching' },
            ],
        },
        {
            id: 'enterprise-2d',
            name: 'Enterprise Vanguard',
            badge: 'Bespoke 24/7',
            icon: ShieldCheck,
            description: 'Dedicated infrastructure for global retailers, marketplaces, and high-volume catalogs.',
            pricingLabel: 'Custom Enterprise Contract',
            pricingSubtext: 'Dedicated artist squad • Executive SLA',
            sla: 'Sub-6h Priority SLA',
            capacity: 'Unlimited dedicated shifts',
            buttonText: 'Contact Enterprise',
            features: [
                { bold: 'Everything in Pro Commercial', text: 'included' },
                { bold: 'Dedicated 24/7 squad', text: 'synchronized across global timezones' },
                { bold: 'Automated SFTP / S3', text: '& direct API pipeline integration' },
                { bold: 'Guaranteed peak burst', text: 'capacity during seasonal drops' },
            ],
        },
    ];

    // 3D CGI & Spatial Assets Tiers
    const tiers3D: PricingTier[] = [
        {
            id: 'starter-3d',
            name: '3D Product Modeling',
            badge: 'CAD & Mesh Topology',
            icon: Box,
            description: 'High-fidelity 3D mesh reconstruction from industrial CAD, sketches, or 2D photo references.',
            pricingLabel: 'Per-Model Volume Quote',
            pricingSubtext: 'Commercial ownership • Multi-format exports',
            sla: '48h Initial Turnaround',
            capacity: 'Up to 50 models/month',
            buttonText: 'Request 3D Model Quote',
            features: [
                { bold: 'Industrial CAD conversion', text: 'from STEP, IGES, Rhino & SolidWorks' },
                { bold: 'Clean quad topology', text: 'optimized for real-time web & mobile' },
                { bold: 'Accurate micron scale', text: 'exact dimension matching to spec sheets' },
                { bold: 'Multi-format exports', text: 'GLTF, USDZ, FBX, OBJ & Blender source' },
            ],
        },
        {
            id: 'pro-3d',
            name: 'Photorealistic CGI',
            badge: 'Virtual Photography',
            popular: true,
            icon: Sparkles,
            description: 'Hyper-realistic virtual studio renders with infinite camera angles and zero physical reshoots.',
            pricingLabel: 'CGI Catalog Retainer',
            pricingSubtext: 'Multi-angle batch outputs • Photoreal 8K PBR',
            sla: '24–48h Render Delivery',
            capacity: '100 to 500+ renders/month',
            buttonText: 'Request CGI Quote',
            features: [
                { bold: 'Everything in 3D Modeling', text: 'included' },
                { bold: '8K PBR material maps', text: 'procedural leather, glass, metals & fabrics' },
                { bold: 'Virtual studio lighting', text: 'cyclorama, architectural & studio HDRI' },
                { bold: 'Infinite colorway swaps', text: 'instant digital variations on demand' },
            ],
        },
        {
            id: 'enterprise-3d',
            name: '3D Configurator & AR',
            badge: 'Spatial & Web3D',
            icon: Cpu,
            description: 'Interactive web 3D product configurators, 360° spin viewers, and Apple Vision / iOS AR spatial assets.',
            pricingLabel: 'Custom Spatial Contract',
            pricingSubtext: 'Dedicated 3D pipeline squad • Engine integration',
            sla: 'Continuous Sprint SLA',
            capacity: 'Full enterprise integration',
            buttonText: 'Contact Spatial Team',
            features: [
                { bold: 'Everything in Photorealistic CGI', text: 'included' },
                { bold: 'Interactive 3D viewers', text: 'lightweight WebGL / Three.js / Babylon' },
                { bold: 'QuickLook & WebXR AR', text: 'instant 1-tap mobile augmented reality' },
                { bold: 'Headless PIM / CMS', text: 'automated 3D asset syndication' },
            ],
        },
    ];

    const currentTiers = activeTab === '2d' ? tiers2D : tiers3D;

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
        <section
            id="pricing-plans-section"
            className="relative py-16 sm:py-20 bg-[#08090d] border-t border-white/[0.06] select-none overflow-hidden"
        >
            {/* Ambient Lighting */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[25rem] bg-accent/[0.04] rounded-full blur-[180px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 xs:px-6 lg:px-8 relative z-10">
                {/* Minimalist Centered Header */}
                <div className="text-center max-w-4xl mx-auto mb-10 sm:mb-12 space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono uppercase tracking-[0.2em] text-accent font-semibold">
                        <span>Production Capacity & SLAs</span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight">
                        Bespoke <span className="text-accent">Production Tiers</span>
                    </h2>

                    <p className="text-sm sm:text-base text-neutral-400 font-sans leading-relaxed max-w-2xl mx-auto">
                        Select between high-volume 2D catalog retouching or full 3D CGI and spatial asset pipelines.
                    </p>

                    {/* Interactive 2D vs 3D Tab Switcher */}
                    <div className="pt-4 flex items-center justify-center">
                        <div className="inline-flex p-1.5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md shadow-lg">
                            <button
                                type="button"
                                onClick={() => setActiveTab('2d')}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider font-bold transition-all duration-300 cursor-pointer ${
                                    activeTab === '2d'
                                        ? 'bg-accent text-black shadow-[0_0_20px_rgba(245,166,35,0.35)]'
                                        : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
                                }`}
                            >
                                <Layers className="w-4 h-4" />
                                <span>2D Retouching (3 Tiers)</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab('3d')}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider font-bold transition-all duration-300 cursor-pointer ${
                                    activeTab === '3d'
                                        ? 'bg-accent text-black shadow-[0_0_20px_rgba(245,166,35,0.35)]'
                                        : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
                                }`}
                            >
                                <Box className="w-4 h-4" />
                                <span>3D CGI & Spatial (3 Tiers)</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 3 Minimalist Tier Cards for Selected Tab */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                    {currentTiers.map((tier) => {
                        const isFeatured = tier.popular;
                        const Icon = tier.icon;

                        return (
                            <div
                                key={tier.id}
                                className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                                    isFeatured
                                        ? 'bg-gradient-to-b from-[#141724] to-[#0e1017] border-2 border-accent/50 shadow-[0_0_40px_rgba(245,166,35,0.12)]'
                                        : 'bg-gradient-to-b from-[#11131a] to-[#0c0d12] border border-white/[0.08] hover:border-white/20'
                                }`}
                            >
                                {/* Featured Ribbon */}
                                {isFeatured && (
                                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
                                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-accent text-black text-[10px] font-mono uppercase tracking-widest font-black shadow-lg">
                                            <Zap className="w-3 h-3 fill-black text-black" />
                                            <span>Most Requested Tier</span>
                                        </span>
                                    </div>
                                )}

                                <div>
                                    {/* Header: Icon + Badge + Title */}
                                    <div className="flex items-center justify-between gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-accent">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.06]">
                                            {tier.badge}
                                        </span>
                                    </div>

                                    <h3 className="text-xl sm:text-2xl font-display font-bold text-white mb-2">
                                        {tier.name}
                                    </h3>

                                    <p className="text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed mb-6">
                                        {tier.description}
                                    </p>

                                    {/* Distinct Engagement & Billing Model */}
                                    <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] mb-5">
                                        <div className="text-sm sm:text-base font-display font-bold text-white">
                                            {tier.pricingLabel}
                                        </div>
                                        <div className="text-[11px] font-sans text-neutral-400 mt-0.5">
                                            {tier.pricingSubtext}
                                        </div>
                                    </div>

                                    {/* High-Contrast 2-Column SLA & Capacity Spec Bar */}
                                    <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-black/30 border border-white/[0.05] mb-6 text-xs font-mono">
                                        <div>
                                            <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-0.5">
                                                Turnaround SLA
                                            </span>
                                            <span className="text-white font-bold">
                                                {tier.sla}
                                            </span>
                                        </div>
                                        <div className="border-l border-white/[0.07] pl-3">
                                            <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-0.5">
                                                Throughput
                                            </span>
                                            <span className="text-white font-bold">
                                                {tier.capacity}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Scannable Feature List with Bold Keywords */}
                                    <div className="space-y-2.5 mb-6">
                                        {tier.features.map((feature, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-start gap-2.5 text-xs sm:text-[13px] text-neutral-300 font-sans leading-snug"
                                            >
                                                <Check className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                                                <span>
                                                    <strong className="text-white font-medium">{feature.bold}</strong> {feature.text}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Action Button */}
                                <div className="pt-3">
                                    <button
                                        type="button"
                                        onClick={() => handleOpenContact(tier.name)}
                                        className={`group w-full py-3.5 px-5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${
                                            isFeatured
                                                ? 'bg-accent text-black hover:bg-white shadow-[0_4px_20px_rgba(245,166,35,0.3)] hover:shadow-[0_4px_25px_rgba(255,255,255,0.4)]'
                                                : 'bg-white/[0.05] hover:bg-white hover:text-black text-white border border-white/10 hover:border-white'
                                        }`}
                                    >
                                        <span>{tier.buttonText}</span>
                                        <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Minimalist Bottom Assurance Strip */}
                <div className="mt-12 p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/25 flex items-center justify-center text-accent shrink-0">
                            <ShieldCheck className="w-4 h-4 text-accent" />
                        </div>
                        <div>
                            <h4 className="text-xs sm:text-sm font-display font-bold text-white">
                                Risk-Free Proof Of Concept Pilot
                            </h4>
                            <p className="text-[11px] sm:text-xs text-neutral-400 font-sans">
                                Test our turnaround and precision on 3 of your actual production files with zero commitment.
                            </p>
                        </div>
                    </div>

                    <a
                        href="#free-trial"
                        className="px-4 py-2 rounded-xl bg-white/5 hover:bg-accent hover:text-black border border-white/10 hover:border-accent text-xs font-mono uppercase tracking-wider text-white font-semibold transition-all duration-300 shrink-0 cursor-pointer"
                    >
                        Try 3 Files Free →
                    </a>
                </div>
            </div>
        </section>
    );
}
