import React, { memo, useState } from 'react';
import { Link } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Mail, Plus } from 'lucide-react';
import { FAQS } from './content';
import { EASE_OUT_QUART, PAD_X, Reveal, SectionProps } from './shared';

export const FaqSection = memo(function FaqSection({ active }: SectionProps) {
    const [open, setOpen] = useState<number | null>(0);

    return (
        <div
            data-scrollable
            className={`relative flex h-full w-full flex-col overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden bg-page pb-4 pt-16 sm:pt-18 lg:pb-5 lg:pt-16 xl:pb-6 xl:pt-20 ${PAD_X}`}
        >
            <div className="relative z-10 mx-auto my-auto w-full max-w-[1360px]">
                <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-10 xl:gap-16">
                    {/* Left Column: Heading, description, 2 editorial labels, and Contact CTA */}
                    <div className="flex flex-col justify-center">
                        <Reveal active={active}>
                            <h2 className="text-section font-display font-bold uppercase tracking-[-0.025em] text-ink">
                                Questions, Answered.
                            </h2>
                        </Reveal>
                        <Reveal active={active} delay={0.08}>
                            <p className="mt-2 max-w-md text-xs sm:text-sm xl:text-base leading-relaxed text-muted">
                                Turnaround, formats, pricing and confidentiality. Everything teams ask before their first production order.
                            </p>
                        </Reveal>

                        {/* 2 Clean Editorial Labels */}
                        <Reveal active={active} delay={0.14} className="mt-3.5 xl:mt-5 flex flex-col gap-2 xl:gap-3 border-l-2 border-primary/45 pl-3.5 sm:pl-4 xl:pl-5">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-ink">
                                    24-Hour Production SLA
                                </p>
                                <p className="mt-0.5 text-xs text-muted sm:text-sm leading-relaxed">
                                    Overnight batch retouching delivered ahead of retail launch deadlines.
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-ink">
                                    Enterprise NDA & Security
                                </p>
                                <p className="mt-0.5 text-xs text-muted sm:text-sm leading-relaxed">
                                    Client files are isolated and never used to train public AI models.
                                </p>
                            </div>
                        </Reveal>

                        <Reveal active={active} delay={0.2} className="mt-3.5 xl:mt-5 max-w-md rounded-2xl bg-secondary p-3.5 sm:p-4 xl:p-5 text-white shadow-sm">
                            <p className="text-sm sm:text-base font-bold">Still have a question?</p>
                            <p className="mt-1 text-xs leading-relaxed text-white/70">
                                Talk directly to our technical studio leads. We reply within one business day, usually faster.
                            </p>
                            <div className="mt-3 xl:mt-3.5 flex flex-wrap gap-2">
                                <Link
                                    href="/book-a-demo"
                                    prefetch
                                    className="inline-flex h-8 xl:h-9 items-center gap-1.5 rounded-full bg-surface px-3.5 xl:px-4 text-xs font-semibold text-secondary transition-transform duration-200 hover:-translate-y-0.5"
                                >
                                    Book a Demo
                                    <ArrowUpRight size={14} />
                                </Link>
                                <Link
                                    href="/contact"
                                    prefetch
                                    className="inline-flex h-8 xl:h-9 items-center gap-1.5 rounded-full border border-white/25 px-3.5 xl:px-4 text-xs font-semibold text-white transition-colors duration-200 hover:bg-white/10"
                                >
                                    <Mail size={14} />
                                    Contact Us
                                </Link>
                            </div>
                        </Reveal>
                    </div>

                    {/* Right Column: All 7 FAQs */}
                    <div className="flex flex-col">
                        <ul className="flex flex-col gap-1.5 sm:gap-2 xl:gap-2.5">
                            {FAQS.map((faq, i) => {
                                const isOpen = open === i;
                                return (
                                    <li key={faq.question}>
                                        <Reveal active={active} delay={0.1 + i * 0.03} y="12px">
                                            <div
                                                className={`rounded-xl sm:rounded-2xl border bg-surface transition-[border-color,box-shadow] duration-300 ${
                                                    isOpen
                                                        ? 'border-ink/30 shadow-[0_10px_24px_-16px_rgba(16,17,20,0.2)]'
                                                        : 'border-ink/10 hover:border-ink/25'
                                                }`}
                                            >
                                                <button
                                                    type="button"
                                                    aria-expanded={isOpen}
                                                    onClick={() => setOpen(isOpen ? null : i)}
                                                    className="flex w-full items-center justify-between gap-3 px-3.5 py-2 sm:px-4 sm:py-2.5 lg:py-2 xl:py-3.5 text-left"
                                                >
                                                    <span className="text-xs sm:text-sm lg:text-[13.5px] xl:text-base font-bold leading-snug text-ink">{faq.question}</span>
                                                    <span
                                                        className={`grid h-6 w-6 xl:h-7 xl:w-7 shrink-0 place-items-center rounded-full transition-[background-color,color,transform] duration-300 ${
                                                            isOpen ? 'rotate-45 bg-primary text-primary-foreground' : 'bg-page text-ink'
                                                        }`}
                                                    >
                                                        <Plus className="h-3.5 w-3.5 xl:h-4 xl:w-4" />
                                                    </span>
                                                </button>
                                                <AnimatePresence initial={false}>
                                                    {isOpen && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.3, ease: EASE_OUT_QUART }}
                                                            className="overflow-hidden"
                                                        >
                                                            <p className="px-3.5 pb-2.5 pt-0 pr-8 text-xs sm:text-[13px] xl:text-sm leading-relaxed text-ink-2 sm:px-4 sm:pb-3 xl:pb-4 xl:pr-10">{faq.answer}</p>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </Reveal>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
});
