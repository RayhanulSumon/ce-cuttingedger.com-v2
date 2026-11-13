import React, { memo, useState } from 'react';
import { Link } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Project } from '@/types/models';
import { CASE_STUDIES } from './content';
import { EASE_OUT_QUART, Eyebrow, Reveal, SectionProps } from './shared';

interface CaseStudyProps extends SectionProps {
    projects: Project[];
}

export const CaseStudySection = memo(function CaseStudySection({ active, projects }: CaseStudyProps) {
    const [index, setIndex] = useState(0);
    const study = CASE_STUDIES[index];
    const linked = projects[index];

    return (
        <div data-scrollable className="overflow-y-auto flex h-full w-full flex-col bg-white px-5 pb-8 pt-24 sm:px-10 lg:px-16">
            <Reveal active={active} className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <Eyebrow>Case study</Eyebrow>
                    <h2 className="mt-3 text-[clamp(28px,4.6vw,64px)] font-extrabold leading-[0.95] tracking-[-0.03em] text-[#141A26]">
                        Results, not promises.
                    </h2>
                </div>
                <div className="flex gap-2" role="tablist" aria-label="Case studies">
                    {CASE_STUDIES.map((c, i) => (
                        <button
                            key={c.title}
                            type="button"
                            role="tab"
                            aria-selected={i === index}
                            onClick={() => setIndex(i)}
                            className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                                i === index ? 'bg-[#2B4BFF] text-white' : 'border border-[#CBD2DE] text-[#5A6478] hover:border-[#141A26]'
                            }`}
                        >
                            {c.client}
                        </button>
                    ))}
                </div>
            </Reveal>

            <Reveal active={active} delay={0.15} className="mt-6 min-h-0 flex-1">
                <AnimatePresence mode="wait">
                    <motion.article
                        key={index}
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12, transition: { duration: 0.2, ease: 'easeIn' } }}
                        transition={{ duration: 0.5, ease: EASE_OUT_QUART }}
                        style={{ backgroundColor: study.background }}
                        className="grid h-full min-h-[460px] overflow-hidden rounded-[28px] text-[#F2F4F8] lg:grid-cols-[1fr_1.1fr]"
                    >
                        <div className="flex flex-col justify-end gap-4 p-6 sm:p-10">
                            <span className="text-xs font-medium uppercase tracking-widest opacity-70">{study.category}</span>
                            <h3 className="text-[clamp(26px,3.6vw,52px)] font-extrabold leading-none tracking-[-0.02em]">{study.title}</h3>
                            <p className="max-w-md text-sm leading-relaxed opacity-80">{study.summary}</p>
                            <dl className="flex flex-wrap gap-8">
                                {study.metrics.map((m) => (
                                    <div key={m.label} className="flex flex-col-reverse">
                                        <dt className="text-xs opacity-70">{m.label}</dt>
                                        <dd className="text-3xl font-extrabold">{m.value}</dd>
                                    </div>
                                ))}
                            </dl>
                            <Link
                                href={linked ? `/case-studies/${linked.slug}` : '/case-studies'}
                                className="mt-1 w-fit rounded-full bg-[#F2F4F8] px-5 py-3 text-sm font-semibold text-[#141A26] transition-transform duration-300 hover:-translate-y-0.5"
                            >
                                Read the case study
                            </Link>
                        </div>
                        <div
                            className="hidden min-h-0 bg-cover bg-center lg:block"
                            style={{ backgroundImage: `url(${linked?.cover_image || study.image})` }}
                            role="img"
                            aria-label={study.title}
                        />
                    </motion.article>
                </AnimatePresence>
            </Reveal>
        </div>
    );
});

