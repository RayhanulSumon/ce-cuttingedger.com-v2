import React from 'react';
import { Link } from '@inertiajs/react';
import { SeoHead } from '@/Components/Common/SeoHead';
import { PageHero } from '@/Components/Common/PageHero';
import { Job } from '@/types/models';
import { ArrowUpRight, MapPin, Briefcase } from 'lucide-react';

interface CareersIndexProps {
    openings: Job[];
}

export default function Index({ openings = [] }: CareersIndexProps) {
    return (
        <>
            <SeoHead
                title="Careers & Open Positions"
                description="Join CuttingEdger. We are looking for relentless creative engineers, 3D spatial designers, and brand architects."
            />

            <PageHero
                eyebrow="CAREERS & OPPORTUNITIES"
                title="BUILD WITH THE MOST"
                highlight="AUDACIOUS CREATIVE SQUAD."
                description="We work on high-stakes digital flagships for category-defining brands. No micromanagement, no pointless meetings, purely craft and velocity."
            />

            <section className="py-24 bg-[#0a0b0e]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-12 pb-6 border-b border-white/10">
                        <span className="font-mono text-xs uppercase tracking-widest text-accent">
                            [ ACTIVE VACANCIES ({openings.length}) ]
                        </span>
                        <span className="font-mono text-xs text-neutral-400">
                            100% Remote / Global
                        </span>
                    </div>

                    <div className="space-y-6">
                        {openings.map((job) => (
                            <Link
                                key={job.id || job.slug}
                                href={`/careers/${job.slug}`}
                                className="group p-8 sm:p-10 rounded-3xl bg-[#12141c] border border-white/10 hover:border-accent/50 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6"
                            >
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-accent">
                                            {job.department}
                                        </span>
                                        <span className="text-xs font-mono text-neutral-400 flex items-center gap-1">
                                            <MapPin className="w-3.5 h-3.5" />
                                            {job.location_type}
                                        </span>
                                        <span className="text-xs font-mono text-neutral-500">
                                            [{job.experience_level}]
                                        </span>
                                    </div>

                                    <h3 className="text-2xl sm:text-3xl font-display font-bold text-white group-hover:text-accent transition-colors">
                                        {job.title}
                                    </h3>

                                    <p className="text-sm text-neutral-400 max-w-2xl line-clamp-2">
                                        {job.overview}
                                    </p>
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                    <span className="font-display font-bold text-xs uppercase tracking-wider text-black bg-accent group-hover:bg-accent-hover px-5 py-3 rounded-full transition-colors flex items-center gap-1.5">
                                        <span>View Role & Apply</span>
                                        <ArrowUpRight className="w-4 h-4" />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
