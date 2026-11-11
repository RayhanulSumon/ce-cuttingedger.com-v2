import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Project } from '@/types/models';
import { CASE_STUDIES } from './content';
import { Eyebrow, Reveal, SectionProps } from './shared';

interface CaseStudyProps extends SectionProps {
    projects: Project[];
}

export function CaseStudySection({ active, projects }: CaseStudyProps) {
    const [index, setIndex] = useState(0);
    const study = CASE_STUDIES[index];
    const linked = projects[index];

    return (
        <div className="flex h-full w-full flex-col bg-white px-6 pb-8 pt-24 sm:px-14">
            <Reveal active={active} className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <Eyebrow>06 / Case study</Eyebrow>
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
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        style={{ backgroundColor: study.background }}
                        className="grid h-full overflow-hidden rounded-[28px] text-[#F2F4F8] lg:grid-cols-[1fr_1.1fr]"
                    >
                        <div className="flex flex-col justify-end gap-4 p-6 sm:p-10">
                            <span className="text-xs font-medium uppercase tracking-widest opacity-70">{study.category}</span>
                            <h3 className="text-[clamp(26px,3.6vw,52px)] font-extrabold leading-none tracking-[-0.02em]">{study.title}</h3>
                            <p className="max-w-md text-sm leading-relaxed opacity-80">{study.summary}</p>
                            <dl className="flex flex-wrap gap-8">
                                {study.metrics.map((m) => (
                                    <div key={m.label}>
                                        <dt className="sr-only">{m.label}</dt>
                                        <dd className="text-3xl font-extrabold">{m.value}</dd>
                                        <p className="text-xs opacity-70">{m.label}</p>
                                    </div>
                                ))}
                            </dl>
                            <Link
                                href={linked ? `/case-studies/${linked.slug}` : '/case-studies'}
                                className="mt-1 w-fit rounded-full bg-[#F2F4F8] px-6 py-3 text-sm font-semibold text-[#141A26]"
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
}

