import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowUpRight, Calendar, Check } from 'lucide-react';

const ENTERPRISE_PERKS = [
    'Dedicated artist squads',
    'SFTP / S3 / REST API',
    'Sub-6h rush SLAs',
    'NDA & Net-30 invoicing',
];

/** Compact enterprise volume CTA band with key capacity highlights. */
export function EnterpriseSolutionsSection() {
    return (
        <section className="border-t border-ink/10 bg-surface py-10 sm:py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col justify-between gap-6 rounded-2xl border border-ink/10 bg-page p-6 sm:rounded-3xl sm:p-8 lg:flex-row lg:items-center">
                    <div className="space-y-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary-ink">
                            Enterprise &amp; High Volume
                        </p>
                        <h2 className="text-xl font-display font-bold tracking-tight text-ink sm:text-2xl">
                            Need a dedicated squad or custom SLA?
                        </h2>
                        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-ink-2 sm:text-sm">
                            {ENTERPRISE_PERKS.map((perk) => (
                                <li key={perk} className="inline-flex items-center gap-1.5">
                                    <Check className="h-3.5 w-3.5 shrink-0 text-primary-ink" />
                                    <span>{perk}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <Link
                        href="/book-a-demo"
                        prefetch
                        className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-primary-hover"
                    >
                        <Calendar className="h-4 w-4" />
                        <span>Book a Demo</span>
                        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
