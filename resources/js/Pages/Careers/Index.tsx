import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { SeoHead } from '@/Components/Common/SeoHead';
import { PageHero } from '@/Components/Common/PageHero';
import { Job } from '@/types/models';
import { ArrowUpRight, MapPin, Briefcase, Sparkles, Zap, Globe, CheckCircle2, ChevronRight } from 'lucide-react';

interface CareersIndexProps {
    openings: Job[];
}

export default function Index({ openings = [] }: CareersIndexProps) {
    const [selectedDept, setSelectedDept] = useState<string>('All');

    // Extract unique departments for filter tabs
    const departments = ['All', ...Array.from(new Set(openings.map((j) => j.department).filter(Boolean)))];

    const filteredJobs =
        selectedDept === 'All' ? openings : openings.filter((j) => j.department === selectedDept);

    return (
        <>
            <SeoHead
                title="Careers & Open Positions — Cutting Edger"
                description="Join CuttingEdger. We are looking for relentless creative engineers, master Photoshop retouchers, and 3D spatial designers."
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: 'Careers', url: '/careers' },
                ]}
            />

            {/* Compact, Clean Studio Hero */}
            <PageHero
                compact={true}
                eyebrow="Careers & Opportunities"
                title="Build with our"
                highlight="creative production squad."
                description="We work on high-stakes digital catalogs for category-defining global brands. Zero micromanagement, zero pointless meetings, purely craft and velocity."
            >
                {/* Clean Perks & Culture Row */}
                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-xs text-neutral-300 font-mono">
                        <Zap className="w-3.5 h-3.5 text-accent" />
                        <span>High-Velocity Workflow</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-xs text-neutral-300 font-mono">
                        <Globe className="w-3.5 h-3.5 text-accent" />
                        <span>100% Remote & Global Studio</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-xs text-neutral-300 font-mono">
                        <Sparkles className="w-3.5 h-3.5 text-accent" />
                        <span>Top 5% Industry Compensation</span>
                    </span>
                </div>
            </PageHero>

            {/* Job Listings Section */}
            <section className="py-12 sm:py-16 bg-[#08090d] relative min-h-[50vh]">
                {/* Subtle Ambient Lighting */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[25rem] bg-accent/[0.03] rounded-full blur-[200px] pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    {/* Header Controls: Count & Department Filter Tabs */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-white/10 gap-4">
                        <div className="flex items-center gap-3">
                            <span className="font-mono text-xs uppercase tracking-widest text-accent font-semibold">
                                [ Active Vacancies ({openings.length}) ]
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[11px] font-mono text-emerald-400 font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Actively Interviewing
                            </span>
                        </div>

                        {/* Department Filters (if more than 1 department) */}
                        {departments.length > 2 && (
                            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                                {departments.map((dept) => (
                                    <button
                                        key={dept}
                                        type="button"
                                        onClick={() => setSelectedDept(dept)}
                                        className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                                            selectedDept === dept
                                                ? 'bg-accent text-black font-bold shadow-sm'
                                                : 'bg-white/[0.03] text-neutral-400 hover:text-white hover:bg-white/[0.06] border border-white/5'
                                        }`}
                                    >
                                        {dept}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Jobs Grid / List */}
                    {filteredJobs.length > 0 ? (
                        <div className="space-y-4">
                            {filteredJobs.map((job) => (
                                <Link
                                    key={job.id || job.slug}
                                    href={`/careers/${job.slug}`}
                                    className="group relative p-6 sm:p-7 rounded-2xl bg-gradient-to-b from-[#11131c]/90 to-[#0b0c11]/90 border border-white/10 hover:border-accent/50 hover:bg-[#141622] hover:shadow-[0_20px_50px_rgba(245,166,35,0.08)] transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden"
                                >
                                    {/* Left Accent Hover Indicator */}
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="space-y-2.5 max-w-3xl">
                                        {/* Metadata Row */}
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="px-2.5 py-1 rounded-md bg-accent/10 border border-accent/25 text-[11px] font-mono font-semibold text-accent uppercase tracking-wider">
                                                {job.department}
                                            </span>
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/5 text-xs font-mono text-neutral-300">
                                                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                                                <span>{job.location_type}</span>
                                            </span>
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/5 text-xs font-mono text-neutral-400">
                                                <Briefcase className="w-3.5 h-3.5 text-neutral-400" />
                                                <span>{job.experience_level}</span>
                                            </span>
                                        </div>

                                        {/* Job Title */}
                                        <h3 className="text-xl sm:text-2xl font-display font-bold text-white group-hover:text-accent transition-colors flex items-center gap-2">
                                            <span>{job.title}</span>
                                            <ChevronRight className="w-4 h-4 text-accent opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 hidden sm:inline-block" />
                                        </h3>

                                        {/* Overview Description */}
                                        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans line-clamp-2">
                                            {job.overview}
                                        </p>

                                        {/* Preview First 2 Responsibilities / Tags if available */}
                                        {job.responsibilities && job.responsibilities.length > 0 && (
                                            <div className="hidden sm:flex flex-wrap items-center gap-2 pt-1">
                                                {job.responsibilities.slice(0, 2).map((resp, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="inline-flex items-center gap-1 text-[11px] font-mono text-neutral-400 bg-white/[0.02] px-2 py-0.5 rounded border border-white/5"
                                                    >
                                                        <CheckCircle2 className="w-3 h-3 text-accent/70" />
                                                        <span className="truncate max-w-xs">{resp}</span>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Button */}
                                    <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
                                        <span className="px-5 py-2.5 rounded-xl bg-white/[0.04] group-hover:bg-accent group-hover:text-black border border-white/10 group-hover:border-accent text-white font-display font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center gap-2 shadow-sm group-hover:shadow-[0_0_20px_rgba(245,166,35,0.35)]">
                                            <span>View Role & Apply</span>
                                            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                            <Briefcase className="w-8 h-8 text-neutral-500 mx-auto" />
                            <p className="text-base text-white font-display font-medium">No active openings in this department.</p>
                            <p className="text-xs text-neutral-400">Select "All" to view positions across the studio.</p>
                        </div>
                    )}

                    {/* Spontaneous Application / Talent Pool Banner */}
                    <div className="mt-10 sm:mt-12 p-6 sm:p-9 rounded-3xl bg-gradient-to-r from-[#11131c] via-[#0d0f15] to-[#11131c] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="space-y-1.5 text-center sm:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent font-mono text-xs uppercase tracking-wider font-semibold">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>General Applications</span>
                            </div>
                            <h4 className="text-lg sm:text-xl font-display font-bold text-white">
                                Don't see your exact role listed?
                            </h4>
                            <p className="text-xs sm:text-sm text-neutral-400 max-w-xl leading-relaxed">
                                We are always looking for master Photoshop retouchers, 3D CGI artists, and production engineers. Reach out to our leadership directly.
                            </p>
                        </div>
                        <Link
                            href="/contact"
                            className="px-6 py-2.5 rounded-xl bg-accent text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-[#ffb834] transition-all shrink-0 shadow-lg cursor-pointer"
                        >
                            Submit Portfolio ↗
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
