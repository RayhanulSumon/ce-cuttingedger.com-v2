import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { FAQS } from './content';
import { Eyebrow, Reveal, SectionProps } from './shared';

export function FaqSection({ active }: SectionProps) {
    const [open, setOpen] = useState<number | null>(0);

    return (
        <div
            data-scrollable
            className="grid h-full w-full grid-cols-1 gap-8 overflow-y-auto bg-[#f2f2f1] px-6 pb-10 pt-24 sm:px-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:pt-28"
        >
            <Reveal active={active}>
                <Eyebrow>08 / FAQ</Eyebrow>
                <h2 className="mt-3 text-[clamp(28px,4.6vw,64px)] font-extrabold leading-[0.95] tracking-[-0.03em] text-[#1d1d1d]">
                    Questions,
                    <br />
                    answered.
                </h2>
            </Reveal>
            <Reveal active={active} delay={0.12}>
                <ul className="divide-y divide-[#1d1d1d]/15 border-y border-[#1d1d1d]/15">
                    {FAQS.map((faq, i) => {
                        const isOpen = open === i;
                        return (
                            <li key={faq.question}>
                                <button
                                    type="button"
                                    aria-expanded={isOpen}
                                    onClick={() => setOpen(isOpen ? null : i)}
                                    className="flex w-full items-center justify-between gap-6 py-5 text-left"
                                >
                                    <span className="text-base font-semibold text-[#1d1d1d] sm:text-lg">{faq.question}</span>
                                    <Plus size={20} className={`shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} />
                                </button>
                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                            className="overflow-hidden"
                                        >
                                            <p className="max-w-xl pb-5 text-sm leading-relaxed text-[#3a3a3a]">{faq.answer}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </li>
                        );
                    })}
                </ul>
            </Reveal>
        </div>
    );
}

