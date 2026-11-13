import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowUpRight, Check, Clock, HelpCircle, Layers, Tag } from 'lucide-react';

export interface ChatCard {
    type: string;
    [key: string]: any;
}

interface InfoCardsProps {
    card: ChatCard;
    onAsk: (text: string) => void;
}

const SURFACE = 'rounded-2xl border border-ink/10 bg-surface p-4 text-left shadow-sm';
const LABEL = 'text-[10px] font-semibold uppercase tracking-[0.18em] text-subtle';

/** One service as a tappable row that asks the assistant for its details (information only). */
function ServiceRow({ service, onAsk }: { service: any; onAsk: (text: string) => void }) {
    return (
        <button
            type="button"
            onClick={() => onAsk(`Tell me about ${service.title}`)}
            className="group flex w-full items-start gap-3 rounded-xl px-2.5 py-2.5 text-left transition-colors hover:bg-page"
        >
            <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary-ink">
                <Layers className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-bold leading-snug text-ink">{service.title}</span>
                {service.subtitle && <span className="mt-0.5 line-clamp-2 block text-[11.5px] leading-snug text-muted">{service.subtitle}</span>}
                <span className="mt-1.5 flex flex-wrap gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-page px-2 py-0.5 text-[10.5px] font-semibold text-ink-2">
                        <Tag className="h-3 w-3" /> {service.starting_rate}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-page px-2 py-0.5 text-[10.5px] font-semibold text-ink-2">
                        <Clock className="h-3 w-3" /> {service.turnaround}
                    </span>
                </span>
            </span>
            <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-faint transition-colors group-hover:text-primary" />
        </button>
    );
}

function BulletList({ title, items }: { title: string; items: string[] }) {
    if (!items?.length) {
        return null;
    }
    return (
        <div>
            <p className={LABEL}>{title}</p>
            <ul className="mt-1.5 space-y-1">
                {items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[12px] leading-snug text-ink-2">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" strokeWidth={3} />
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export function InfoCards({ card, onAsk }: InfoCardsProps) {
    switch (card.type) {
        case 'service_catalog_card':
            return (
                <div className={`${SURFACE} space-y-1`}>
                    <p className={LABEL}>Our services</p>
                    <div className="-mx-1">
                        {(card.services ?? []).map((service: any) => (
                            <ServiceRow key={service.id ?? service.slug} service={service} onAsk={onAsk} />
                        ))}
                    </div>
                </div>
            );

        case 'service_detail_card':
            return (
                <div className={`${SURFACE} space-y-3`}>
                    <div>
                        <p className="text-sm font-bold leading-snug text-ink">{card.title}</p>
                        {card.subtitle && <p className="mt-0.5 text-[12px] leading-snug text-muted">{card.subtitle}</p>}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary-ink">
                            <Tag className="h-3 w-3" /> {card.starting_rate}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-page px-2.5 py-1 text-[11px] font-semibold text-ink-2">
                            <Clock className="h-3 w-3" /> {card.turnaround}
                        </span>
                    </div>
                    <BulletList title="What you get" items={(card.features ?? []).slice(0, 4)} />
                    <BulletList title="Deliverables" items={(card.deliverables ?? []).slice(0, 4)} />
                </div>
            );

        case 'pricing_card':
            return (
                <div className={`${SURFACE} space-y-2.5`}>
                    <p className={LABEL}>{card.title ?? 'Pricing'}</p>
                    <ul className="divide-y divide-ink/10">
                        {(card.rows ?? []).map((row: any) => (
                            <li key={row.name} className="flex items-center justify-between gap-3 py-2">
                                <span className="min-w-0">
                                    <span className="block text-[12.5px] font-semibold leading-snug text-ink">{row.name}</span>
                                    <span className="block text-[10.5px] text-subtle">{row.turnaround}</span>
                                </span>
                                <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-[11.5px] font-bold text-primary-ink">{row.rate}</span>
                            </li>
                        ))}
                    </ul>
                    {card.notes?.length > 0 && (
                        <ul className="flex flex-wrap gap-1.5 pt-0.5">
                            {card.notes.map((note: string) => (
                                <li key={note} className="rounded-full bg-page px-2.5 py-1 text-[10.5px] font-medium text-muted">
                                    {note}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            );

        case 'link_card':
            return (
                <div className={`${SURFACE} space-y-2.5`}>
                    <p className={LABEL}>{card.title}</p>
                    <div className="flex flex-wrap gap-2">
                        {(card.links ?? []).map((link: any, i: number) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                prefetch
                                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[12px] font-bold transition-[transform,background-color] duration-300 hover:-translate-y-0.5 ${
                                    i === 0 ? 'bg-primary text-primary-foreground hover:bg-primary-hover' : 'border border-ink/20 text-ink hover:bg-ink hover:text-white'
                                }`}
                            >
                                {link.label}
                                <ArrowUpRight className="h-3.5 w-3.5" />
                            </Link>
                        ))}
                    </div>
                </div>
            );

        case 'info_card': {
            const faqs: { q: string; a: string }[] = card.faqs ?? [];
            if (!faqs.length) {
                return null;
            }
            return (
                <div className={`${SURFACE} space-y-3`}>
                    <p className={`${LABEL} flex items-center gap-1.5`}>
                        <HelpCircle className="h-3.5 w-3.5" /> Answers
                    </p>
                    {faqs.map((faq) => (
                        <div key={faq.q}>
                            <p className="text-[12.5px] font-bold leading-snug text-ink">{faq.q}</p>
                            <p className="mt-1 text-[12px] leading-relaxed text-muted">{faq.a}</p>
                        </div>
                    ))}
                </div>
            );
        }

        default:
            return null;
    }
}
