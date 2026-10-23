import React from 'react';
import {
    Users,
    Cpu,
    Zap,
    ShieldCheck,
    Calendar,
    ArrowUpRight,
    CheckCircle2,
    Sparkles,
    FileText,
    Clock,
    FolderSync,
    BadgeCheck,
} from 'lucide-react';

export function EnterpriseSolutionsSection() {
    const handleOpenDiscoveryCall = () => {
        window.dispatchEvent(new CustomEvent('ce:open-discovery-call'));
    };

    const pillars = [
        {
            icon: Users,
            badge: 'Dedicated Pod Model',
            title: 'Dedicated Artist Squads',
            description:
                'Get a dedicated squad of certified Photoshop artists trained exclusively on your brand guidelines, lighting ratios, and custom PSD action sets. Zero aesthetic drift.',
            metrics: ['Named Senior QA Lead', 'Consistent artist allocation', 'Custom stylebook calibration'],
        },
        {
            icon: Cpu,
            badge: 'Headless Workflow',
            title: 'Automated Hotfolder & API Pipeline',
            description:
                'Skip manual uploads. Seamlessly sync assets via automated SFTP hotfolders, AWS S3 buckets, Asana, Dropbox, or connect directly through our REST API & Webhooks.',
            metrics: ['Automated file routing', 'Custom metadata retention', 'Raw & TIFF batch support'],
        },
        {
            icon: Zap,
            badge: 'Guaranteed Capacity',
            title: 'Ultra-Fast Rush SLAs & High Capacity',
            description:
                'Round-the-clock 24/7 production across global time zones. Scale up to 10,000+ assets daily with guaranteed 6h or 12h turnaround SLAs even during peak retail seasons.',
            metrics: ['Sub-6h rush SLA on demand', 'Overnight delivery guarantee', 'Peak season surge capacity'],
        },
        {
            icon: ShieldCheck,
            badge: 'Enterprise Compliance',
            title: 'Strict Security, NDA & Net-30 Invoicing',
            description:
                'Enterprise-grade security with bilateral NDAs, encrypted TLS asset storage, dedicated account director, and monthly consolidated Net-30 billing terms for corporate accounts.',
            metrics: ['Strict mutual NDA executed', 'Enterprise TLS cloud vault', 'Net-30 corporate invoicing'],
        },
    ];

    return (
        <section className="py-20 sm:py-28 bg-[#0a0b0e] relative overflow-hidden border-t border-white/10">
            {/* Ambient Backlight */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[55rem] h-[25rem] bg-[#d4ff00]/5 rounded-full blur-[200px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-widest text-[#d4ff00]">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>[ ENTERPRISE & VOLUME PARTNERSHIPS ]</span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-white tracking-tight leading-[1.1]">
                        Engineered for High-Volume <br />
                        <span className="text-[#d4ff00]">Brands, Studios & Global Retailers.</span>
                    </h2>

                    <p className="text-sm sm:text-base text-neutral-400 font-sans leading-relaxed">
                        Processing thousands of product images monthly? We integrate dedicated retouching pods directly into your production pipeline with custom SLAs and corporate billing.
                    </p>
                </div>

                {/* 4 Strategic Enterprise Pillars */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12">
                    {pillars.map((pillar, idx) => {
                        const Icon = pillar.icon;
                        return (
                            <div
                                key={idx}
                                className="group rounded-3xl border border-white/10 bg-[#0e1017]/90 backdrop-blur-xl p-8 hover:border-[#d4ff00]/40 transition-all duration-300 relative flex flex-col justify-between hover:shadow-[0_0_30px_rgba(212,255,0,0.08)]"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-[#d4ff00]/10 border border-[#d4ff00]/20 flex items-center justify-center text-[#d4ff00] group-hover:bg-[#d4ff00] group-hover:text-black transition-colors duration-300">
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                                            {pillar.badge}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-display font-bold text-white mb-3">
                                        {pillar.title}
                                    </h3>

                                    <p className="text-sm text-neutral-400 leading-relaxed mb-6 font-sans">
                                        {pillar.description}
                                    </p>
                                </div>

                                <ul className="space-y-2.5 pt-4 border-t border-white/10">
                                    {pillar.metrics.map((metric, i) => (
                                        <li key={i} className="flex items-center gap-2.5 text-xs font-mono text-neutral-300">
                                            <CheckCircle2 className="w-4 h-4 text-[#d4ff00] shrink-0" />
                                            <span>{metric}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>

                {/* High-Impact Enterprise CTA Banner Card */}
                <div className="rounded-3xl border-2 border-[#d4ff00] bg-gradient-to-br from-[#12141e] via-[#0d0f16] to-[#0a0b0e] p-8 sm:p-12 relative overflow-hidden shadow-[0_0_50px_rgba(212,255,0,0.12)]">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-[#d4ff00]/10 rounded-full blur-[90px] pointer-events-none" />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                        {/* Left Info Column */}
                        <div className="lg:col-span-7 space-y-4">
                            <span className="text-xs font-mono uppercase tracking-widest text-[#d4ff00] font-bold flex items-center gap-2">
                                <BadgeCheck className="w-4 h-4" />
                                <span>TAILORED B2B CONTRACTS & DISCOVERY SESSIONS</span>
                            </span>

                            <h3 className="text-2xl sm:text-4xl font-display font-black text-white tracking-tight leading-snug">
                                Need a Custom Enterprise SLA or Tailored Retainer?
                            </h3>

                            <p className="text-sm text-neutral-300 font-sans leading-relaxed max-w-xl">
                                Schedule a 15-minute consultation with our Enterprise Production Director. We will evaluate your volume, test sample workflows, and structure a custom package tailored to your exact release schedule.
                            </p>

                            {/* Trust Metrics Pill Row */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
                                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 text-center">
                                    <div className="text-lg font-mono font-bold text-[#d4ff00]">50K+</div>
                                    <div className="text-[10px] font-mono text-neutral-400 uppercase">Monthly Capacity</div>
                                </div>
                                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 text-center">
                                    <div className="text-lg font-mono font-bold text-white">&lt; 6 Hours</div>
                                    <div className="text-[10px] font-mono text-neutral-400 uppercase">Emergency Rush</div>
                                </div>
                                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 text-center">
                                    <div className="text-lg font-mono font-bold text-white">100%</div>
                                    <div className="text-[10px] font-mono text-neutral-400 uppercase">Hand Pen Paths</div>
                                </div>
                                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 text-center">
                                    <div className="text-lg font-mono font-bold text-white">Net-30</div>
                                    <div className="text-[10px] font-mono text-neutral-400 uppercase">Monthly Terms</div>
                                </div>
                            </div>
                        </div>

                        {/* Right Action Column */}
                        <div className="lg:col-span-5 flex flex-col gap-3.5 lg:items-end justify-center">
                            <button
                                type="button"
                                onClick={handleOpenDiscoveryCall}
                                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#d4ff00] text-black font-display font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 hover:bg-[#c2eb00] hover:shadow-[0_0_30px_rgba(212,255,0,0.4)] transition-all cursor-pointer select-none"
                            >
                                <Calendar className="w-4 h-4 stroke-[2.5]" />
                                <span>Book 15-Min Discovery Call</span>
                                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                            </button>

                            <a
                                href="#trial-uploader-section"
                                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white/5 border border-white/15 text-white font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-white/10 hover:border-white/30 transition-all cursor-pointer select-none text-center"
                            >
                                <FileText className="w-3.5 h-3.5 text-[#d4ff00]" />
                                <span>Test Our Quality (Free 3-Asset Pilot)</span>
                            </a>

                            <p className="text-[11px] font-mono text-neutral-400 text-center lg:text-right mt-1">
                                Strict mutual NDA signed before production begins.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
