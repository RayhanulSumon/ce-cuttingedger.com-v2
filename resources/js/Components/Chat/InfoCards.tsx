import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowUpRight, Check, HelpCircle, Layers } from 'lucide-react';

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
        case 'capability_catalog_card':
            return (
                <div className={`${SURFACE} space-y-1`}>
                    <p className={LABEL}>Our capabilities</p>
                    <div className="-mx-1">
                        {(card.capabilities ?? []).map((capability: any) => (
                            <div key={capability.id} className="rounded-xl px-2.5 py-2.5">
                                <Link href={capability.path} prefetch className="group flex items-start gap-3">
                                    <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-[11px] font-bold text-primary-ink">
                                        {capability.tag ?? <Layers className="h-4 w-4" />}
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className="block text-[13px] font-bold leading-snug text-ink group-hover:text-primary-ink">{capability.title}</span>
                                        <span className="mt-0.5 line-clamp-2 block text-[11.5px] leading-snug text-muted">{capability.subtitle}</span>
                                    </span>
                                    <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-faint transition-colors group-hover:text-primary" />
                                </Link>
                                {capability.children?.length > 0 && (
                                    <div className="ml-11 mt-2 flex flex-wrap gap-1.5">
                                        {capability.children.map((child: any) => (
                                            <button
                                                key={child.path}
                                                type="button"
                                                onClick={() => onAsk(`Tell me about ${child.title}`)}
                                                className="rounded-full bg-page px-2.5 py-1 text-[10.5px] font-semibold text-ink-2 transition-colors hover:bg-primary/10 hover:text-primary-ink"
                                            >
                                                {child.title}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            );

        case 'capability_detail_card':
            return (
                <div className={`${SURFACE} space-y-3`}>
                    <div>
                        {card.tag && <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-ink">{card.tag}</p>}
                        <p className="text-sm font-bold leading-snug text-ink">{card.title}</p>
                        {card.subtitle && <p className="mt-0.5 text-[12px] leading-snug text-muted">{card.subtitle}</p>}
                    </div>
                    <BulletList title="What you get" items={card.features ?? []} />
                    <BulletList title="Deliverables" items={card.deliverables ?? []} />
                    {card.children?.length > 0 && (
                        <div>
                            <p className={LABEL}>Specialities</p>
                            <div className="mt-1.5 flex flex-wrap gap-1.5">
                                {card.children.map((child: any) => (
                                    <button
                                        key={child.path}
                                        type="button"
                                        onClick={() => onAsk(`Tell me about ${child.title}`)}
                                        className="rounded-full bg-page px-2.5 py-1 text-[10.5px] font-semibold text-ink-2 transition-colors hover:bg-primary/10 hover:text-primary-ink"
                                    >
                                        {child.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    <Link href={card.path} prefetch className="inline-flex items-center gap-1.5 text-[12px] font-bold text-primary-ink hover:underline">
                        Open the full page <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
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
