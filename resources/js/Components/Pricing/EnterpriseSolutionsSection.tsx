import React from 'react';
import {
    Users,
    Cpu,
    Zap,
    ShieldCheck,
    Calendar,
    ArrowUpRight,
    Sparkles,
} from 'lucide-react';

export function EnterpriseSolutionsSection() {
    const handleOpenDiscoveryCall = () => {
        window.dispatchEvent(new CustomEvent('ce:open-discovery-call'));
    };

    const pillars = [
        {
            icon: Users,
            badge: 'Dedicated Pods',
            title: 'Dedicated Artist Squads',
            description:
                'Photoshop artists calibrated exclusively to your brand guidelines, lighting ratios, and custom PSD action sets.',
            tags: ['Named Senior QA Lead', 'Zero Style Drift', 'Dedicated Allocation'],
        },
        {
            icon: Cpu,
            badge: 'Headless Flow',
            title: 'Automated Pipeline & API',
            description:
                'Hands-free asset synchronization via automated SFTP hotfolders, AWS S3 buckets, or our direct REST API.',
            tags: ['SFTP / S3 Hotfolders', 'REST API & Webhooks', 'Raw & TIFF Batches'],
        },
        {
            icon: Zap,
            badge: '24/7 Production',
            title: 'Guaranteed Rush SLAs',
            description:
                'Round-the-clock shifts across global timezones with sub-6h priority delivery during peak seasonal launches.',
            tags: ['Sub-6h Emergency SLA', '10K+ Daily Volume', 'Overnight Delivery'],
        },
        {
            icon: ShieldCheck,
            badge: 'Enterprise Compliance',
            title: 'Security & Corporate Terms',
            description:
                'Enterprise-grade security with bilateral NDAs, encrypted cloud vaults, and consolidated Net-30 monthly billing.',
            tags: ['Strict Mutual NDA', 'Encrypted TLS Vault', 'Net-30 Corporate Terms'],
        },
    ];

    return (
        <section className="py-16 sm:py-20 bg-[#090a0e] relative overflow-hidden border-t border-[#16191f]/10">
            {/* Ambient Backlight */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[50rem] h-[20rem] bg-[#f5761a]/[0.03] rounded-full blur-[200px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Simplified, Clean Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14 space-y-2.5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-[#16191f]/10 text-[11px] font-mono uppercase tracking-[0.18em] text-[#c4540a] font-semibold">
                        <Sparkles className="w-3 h-3" />
                        <span>Enterprise Capacity</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-[#16191f] tracking-tight">
                        Enterprise & <span className="text-[#c4540a]">Volume Partnerships</span>
                    </h2>

                    <p className="text-xs sm:text-sm text-[#4a505b] font-sans leading-relaxed">
                        Dedicated retouching pods, custom rush SLAs, and direct pipeline integrations for high-volume catalogs.
                    </p>
                </div>

                {/* 4 Clean, Concise Enterprise Pillars */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-10 sm:mb-12">
                    {pillars.map((pillar, idx) => {
                        const Icon = pillar.icon;
                        return (
                            <div
                                key={idx}
                                className="group rounded-2xl sm:rounded-3xl border border-[#16191f]/10 bg-[#0f1118]/90 hover:bg-[#131520] hover:border-[#f5761a]/40 transition-all duration-300 p-6 sm:p-7 relative flex flex-col justify-between hover:shadow-[0_15px_40px_rgba(245,166,35,0.08)]"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="w-10 h-10 rounded-xl bg-[#f5761a]/10 border border-[#f5761a]/20 flex items-center justify-center text-[#c4540a] group-hover:bg-[#f5761a] group-hover:text-white transition-colors duration-300">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <span className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-[#16191f]/10 text-[10px] font-mono uppercase tracking-wider text-[#4a505b] font-medium">
                                            {pillar.badge}
                                        </span>
                                    </div>

                                    <h3 className="text-lg sm:text-xl font-display font-bold text-[#16191f] group-hover:text-[#c4540a] transition-colors">
                                        {pillar.title}
                                    </h3>

                                    <p className="text-xs sm:text-sm text-[#4a505b] leading-relaxed font-sans">
                                        {pillar.description}
                                    </p>
                                </div>

                                {/* Scannable Feature Chips */}
                                <div className="flex flex-wrap items-center gap-2 pt-5 mt-4 border-t border-[#16191f]/10">
                                    {pillar.tags.map((tag, i) => (
                                        <span
                                            key={i}
                                            className="px-2.5 py-1 rounded-md bg-white/[0.02] border border-[#16191f]/10 text-[11px] font-mono text-[#2f333a]"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Streamlined, High-Impact Enterprise Action Banner */}
                <div className="rounded-2xl sm:rounded-3xl border border-[#f5761a]/40 bg-gradient-to-r from-white via-[#f2f2f1] to-white p-6 sm:p-8 relative overflow-hidden shadow-[0_15px_50px_rgba(245,166,35,0.08)]">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
                        <div className="space-y-1.5 text-center lg:text-left">
                            <span className="text-[10px] font-mono uppercase tracking-widest text-[#c4540a] font-bold">
                                [ Tailored B2B Consultation ]
                            </span>
                            <h3 className="text-xl sm:text-2xl font-display font-bold text-[#16191f] tracking-tight">
                                Need a custom volume contract or dedicated SLA?
                            </h3>
                            <p className="text-xs sm:text-sm text-[#4a505b] max-w-xl">
                                Speak directly with our production director to calibrate a custom pilot around your exact drop schedule.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                            <button
                                type="button"
                                onClick={handleOpenDiscoveryCall}
                                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#f5761a] text-white font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#ffb834] hover:shadow-[0_0_25px_rgba(245,166,35,0.35)] transition-all cursor-pointer"
                            >
                                <Calendar className="w-4 h-4" />
                                <span>Book 15-Min Discovery Call</span>
                                <ArrowUpRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
