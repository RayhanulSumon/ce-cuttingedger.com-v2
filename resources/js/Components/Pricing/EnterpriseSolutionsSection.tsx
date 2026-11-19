import React from 'react';
import { ArrowUpRight, Calendar, Cpu, ShieldCheck, Users, Zap } from 'lucide-react';

const ENTERPRISE_PILLARS = [
    {
        icon: Users,
        title: 'Dedicated Artist Squads',
        description:
            'Artists calibrated exclusively to your brand guidelines, lighting ratios, and custom presets.',
    },
    {
        icon: Cpu,
        title: 'Automated Pipeline & API',
        description:
            'Hands-free asset synchronization via SFTP hotfolders, AWS S3 buckets, or direct REST API.',
    },
    {
        icon: Zap,
        title: 'Guaranteed Rush SLAs',
        description:
            'Round-the-clock shifts across global time zones with sub-6h priority delivery for peak launches.',
    },
    {
        icon: ShieldCheck,
        title: 'Security & Corporate Terms',
        description:
            'Bilateral NDAs, encrypted asset vaults, and consolidated Net-30 corporate monthly invoicing.',
    },
];

/** Enterprise capacity pillars and discovery call CTA banner styled for the light studio theme. */
export function EnterpriseSolutionsSection() {
    const handleOpenDiscoveryCall = () => {
        window.dispatchEvent(new CustomEvent('ce:open-discovery-call'));
    };

    return (
        <section className="border-t border-ink/10 bg-surface py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto mb-12 max-w-2xl space-y-3 text-center">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-primary-ink">
                        Enterprise Capacity
                    </p>
                    <h2 className="text-3xl font-display font-extrabold tracking-tight text-ink sm:text-4xl">
                        Built for high-volume <span className="text-primary">partnerships</span>
                    </h2>
                    <p className="text-sm leading-relaxed text-muted sm:text-base">
                        Dedicated production pods, rush SLAs, and direct pipeline integrations for global retail teams.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {ENTERPRISE_PILLARS.map((pillar) => {
                        const Icon = pillar.icon;
                        return (
                            <div
                                key={pillar.title}
                                className="rounded-3xl border border-ink/10 bg-page p-6 transition-colors duration-300 hover:border-primary/40"
                            >
                                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl border border-ink/10 bg-surface text-primary-ink">
                                    <Icon className="h-5 w-5" />
                                </div>
                                <h3 className="text-lg font-display font-bold leading-snug text-ink">
                                    {pillar.title}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-muted">
                                    {pillar.description}
                                </p>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-10 rounded-3xl border border-ink/10 bg-page p-6 sm:p-9">
                    <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
                        <div className="space-y-1.5 text-center lg:text-left">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary-ink">
                                Tailored B2B Consultation
                            </p>
                            <h3 className="text-xl font-display font-bold tracking-tight text-ink sm:text-2xl">
                                Need a custom volume contract or dedicated SLA?
                            </h3>
                            <p className="max-w-xl text-sm text-muted">
                                Speak directly with our production lead to scope a custom pilot around your launch schedule.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleOpenDiscoveryCall}
                            className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-hover"
                        >
                            <Calendar className="h-4 w-4" />
                            <span>Book 15-Min Discovery Call</span>
                            <ArrowUpRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
