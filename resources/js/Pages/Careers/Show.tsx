import React, { useState } from 'react';
import { SeoHead } from '@/Components/Common/SeoHead';
import { PageHero } from '@/Components/Common/PageHero';
import { Job } from '@/types/models';
import { CheckCircle2, ArrowUpRight, Send } from 'lucide-react';

interface CareerShowProps {
    job: Job;
}

export default function Show({ job }: CareerShowProps) {
    const [applied, setApplied] = useState(false);

    return (
        <>
            <SeoHead
                title={`${job.title} — Careers`}
                description={job.overview}
            />

            <PageHero
                compact={true}
                eyebrow={`CAREERS // ${job.department}`}
                title={job.title}
                description={job.overview}
                backUrl="/careers"
                backLabel="All Open Positions"
            />

            <section className="py-20 bg-[#f2f2f1]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Job Description & Requirements */}
                        <div className="lg:col-span-8 space-y-12">
                            {/* Responsibilities */}
                            <div className="space-y-4">
                                <h3 className="text-2xl font-display font-bold text-[#16191f]">
                                    What You Will Champion
                                </h3>
                                <ul className="space-y-3">
                                    {job.responsibilities?.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm sm:text-base text-[#2f333a]">
                                            <CheckCircle2 className="w-5 h-5 text-[#c4540a] shrink-0 mt-0.5" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Requirements */}
                            <div className="space-y-4 pt-6 border-t border-[#16191f]/10">
                                <h3 className="text-2xl font-display font-bold text-[#16191f]">
                                    What You Bring To The Table
                                </h3>
                                <ul className="space-y-3">
                                    {job.requirements?.map((req, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm sm:text-base text-[#2f333a]">
                                            <span className="text-[#c4540a] font-mono font-bold">→</span>
                                            <span>{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Benefits */}
                            <div className="space-y-4 pt-6 border-t border-[#16191f]/10">
                                <h3 className="text-2xl font-display font-bold text-[#16191f]">
                                    Perks & Compensation
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {job.benefits?.map((ben, i) => (
                                        <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-[#16191f]/10 text-sm text-[#2f333a] font-mono">
                                            {ben}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Application Card */}
                        <div className="lg:col-span-4">
                            <div className="sticky top-28 p-8 rounded-3xl bg-white border border-[#16191f]/10 space-y-6">
                                <div>
                                    <span className="font-mono text-xs uppercase tracking-widest text-[#c4540a] block mb-2">
                                        READY TO APPLY?
                                    </span>
                                    <h4 className="text-xl font-display font-bold text-[#16191f]">
                                        Send Your Portfolio
                                    </h4>
                                    <p className="text-xs text-[#4a505b] mt-1">
                                        Send your GitHub, live flagships, or Figma file directly to our talent team.
                                    </p>
                                </div>

                                {applied ? (
                                    <div className="p-4 rounded-xl bg-[#f5761a]/10 border border-[#f5761a] text-[#c4540a] text-xs font-mono">
                                        Application link received! We will inspect your portfolio within 48 hours.
                                    </div>
                                ) : (
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            setApplied(true);
                                        }}
                                        className="space-y-4"
                                    >
                                        <div>
                                            <label className="block text-xs font-mono text-[#4a505b] mb-1">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="Ada Lovelace"
                                                className="w-full bg-[#16191f]/[0.03] border border-[#16191f]/10 rounded-xl px-4 py-3 text-sm text-[#16191f] focus:outline-none focus:border-[#f5761a]"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-mono text-[#4a505b] mb-1">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                placeholder="ada@domain.com"
                                                className="w-full bg-[#16191f]/[0.03] border border-[#16191f]/10 rounded-xl px-4 py-3 text-sm text-[#16191f] focus:outline-none focus:border-[#f5761a]"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-mono text-[#4a505b] mb-1">
                                                Portfolio / GitHub URL
                                            </label>
                                            <input
                                                type="url"
                                                required
                                                placeholder="https://github.com/..."
                                                className="w-full bg-[#16191f]/[0.03] border border-[#16191f]/10 rounded-xl px-4 py-3 text-sm text-[#16191f] focus:outline-none focus:border-[#f5761a]"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full bg-[#f5761a] text-white font-display font-bold py-3.5 px-6 rounded-xl hover:bg-[#e0650c] flex items-center justify-center gap-2 transition-colors cursor-pointer"
                                        >
                                            <span>Transmit Application</span>
                                            <Send className="w-4 h-4" />
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
