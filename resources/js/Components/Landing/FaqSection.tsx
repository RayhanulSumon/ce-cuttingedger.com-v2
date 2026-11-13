import React, { memo, useState } from 'react';
import { Link } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Mail, Plus } from 'lucide-react';
import { FAQS } from './content';
import { EASE_OUT_QUART, PAD_X, Reveal, SectionProps } from './shared';

export const FaqSection = memo(function FaqSection({ active, openDemo }: SectionProps) {
    const [open, setOpen] = useState<number | null>(0);

    return (
        <div
            data-scrollable
            className={`grid h-full w-full grid-cols-1 content-start gap-8 overflow-y-auto bg-[#f2f2f1] pb-10 pt-24 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:content-center lg:gap-16 lg:pt-20 ${PAD_X}`}
        >
            <div className="lg:pr-6">
                <Reveal active={active}>
                    <h2 className="text-[clamp(32px,4.8vw,68px)] font-extrabold leading-[0.95] tracking-[-0.035em] text-[#1d1d1d]">
                        Questions,
                        <br />
                        answered.
                    </h2>
                </Reveal>
                <Reveal active={active} delay={0.08}>
                    <p className="mt-4 max-w-md text-base leading-relaxed text-[#2f333a] sm:text-lg">
                        Turnaround, formats, pricing and confidentiality. Everything teams ask before their first order.
                    </p>
                </Reveal>

                <Reveal active={active} delay={0.16} className="mt-8 max-w-md rounded-3xl bg-[#141A26] p-6 text-white">
                    <p className="text-lg font-bold">Still have a question?</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/70">
                        Talk to the team. We reply within one business day, usually faster.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={openDemo}
                            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#141A26] transition-transform duration-300 hover:-translate-y-0.5"
                        >
                            Book a Demo
                            <ArrowUpRight size={15} />
                        </button>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold transition-colors duration-300 hover:bg-white/10"
                        >
                            <Mail size={15} />
                            Contact us
                        </Link>
                    </div>
                </Reveal>
            </div>

            <ul className="flex flex-col gap-3">
                {FAQS.map((faq, i) => {
                    const isOpen = open === i;
                    return (
                        <li key={faq.question}>
                            <Reveal active={active} delay={0.12 + i * 0.05} y="18px">
                                <div
                                    className={`rounded-2xl border bg-white transition-[border-color,box-shadow] duration-300 ${
                                        isOpen
                                            ? 'border-[#f5761a]/60 shadow-[0_18px_36px_-26px_rgba(245,118,26,0.7)]'
                                            : 'border-[#1d1d1d]/10 hover:border-[#1d1d1d]/30'
                                    }`}
                                >
                                    <button
                                        type="button"
                                        aria-expanded={isOpen}
                                        onClick={() => setOpen(isOpen ? null : i)}
                                        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
                                    >
                                        <span className="text-base font-bold leading-snug text-[#16191f] sm:text-[17px]">{faq.question}</span>
                                        <span
                                            className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition-[background-color,color,transform] duration-300 ${
                                                isOpen ? 'rotate-45 bg-[#f5761a] text-white' : 'bg-[#f2f2f1] text-[#16191f]'
                                            }`}
                                        >
                                            <Plus size={16} />
                                        </span>
                                    </button>
                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.35, ease: EASE_OUT_QUART }}
                                                className="overflow-hidden"
                                            >
                                                <p className="px-5 pb-5 pr-14 text-[15px] leading-relaxed text-[#3a3f48] sm:px-6 sm:pb-6">{faq.answer}</p>
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
    );
});
