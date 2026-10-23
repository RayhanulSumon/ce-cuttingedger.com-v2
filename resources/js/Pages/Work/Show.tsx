import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { SeoHead } from '@/Components/Common/SeoHead';
import { PageHero } from '@/Components/Common/PageHero';
import { Project } from '@/types/models';
import { ArrowUpRight, Globe, Layers, CheckCircle2, Calendar, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { PageProps } from '@/types';

interface WorkShowProps {
    project: Project & {
        is_concept?: boolean;
        client_challenge?: string;
        work_done?: string;
        measurable_result?: string;
        h1_title?: string;
    };
    relatedProjects: Project[];
}

export default function Show({ project, relatedProjects = [] }: WorkShowProps) {
    const { settings } = usePage<PageProps>().props;
    const calendlyUrl = (settings as any)?.calendly_url || 'https://calendly.com/cuttingedger/discovery-call';

    const breadcrumbs = [
        { name: 'Home', url: '/' },
        { name: 'Case Studies', url: '/case-studies' },
        { name: project.title, url: `/case-studies/${project.slug}` },
    ];

    return (
        <>
            <SeoHead
                title={project.meta_title || `${project.title} — Case Study | Cutting Edger`}
                description={project.meta_description || project.summary}
                image={project.cover_image}
                breadcrumbs={breadcrumbs}
                articleSchema={{
                    headline: project.title,
                    description: project.summary,
                    image: project.cover_image,
                    datePublished: `${project.year}-01-15`,
                    dateModified: '2026-10-23',
                }}
            />

            <PageHero
                eyebrow={`CASE STUDY // ${project.client_name}`}
                title={project.h1_title || project.title}
                description={project.summary}
                backUrl="/case-studies"
                backLabel="Back to All Case Studies"
            />

            {/* Concept Work Disclaimer Banner if Concept */}
            {project.is_concept && (
                <div className="bg-cyan-950/40 border-b border-cyan-500/20 py-3 px-4 sm:px-6 lg:px-8 text-center text-xs font-mono text-cyan-300">
                    <span>💡 <strong>Concept Showcase Work:</strong> This study represents a virtual CGI prototype and pipeline benchmark engineered by Cutting Edger Studio.</span>
                </div>
            )}

            {/* Case Study Meta Strip */}
            <section className="py-8 bg-[#0c0d12] border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs font-mono">
                        <div>
                            <span className="text-neutral-500 uppercase block mb-1">Client Partner</span>
                            <span className="text-white font-medium text-sm">{project.client_name}</span>
                        </div>
                        <div>
                            <span className="text-neutral-500 uppercase block mb-1">Discipline</span>
                            <span className="text-[#d4ff00] font-medium text-sm">{project.category?.name || 'Production'}</span>
                        </div>
                        <div>
                            <span className="text-neutral-500 uppercase block mb-1">Year & Timeline</span>
                            <span className="text-white font-medium text-sm">{project.year}</span>
                        </div>
                        <div>
                            <span className="text-neutral-500 uppercase block mb-1">Store / Live URL</span>
                            {project.live_url ? (
                                <a
                                    href={project.live_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white hover:text-[#d4ff00] inline-flex items-center gap-1 font-medium text-sm transition-colors"
                                >
                                    <span>Visit Client Website</span>
                                    <ArrowUpRight className="w-3.5 h-3.5 text-[#d4ff00]" />
                                </a>
                            ) : (
                                <span className="text-neutral-500">Private Enterprise Retainer</span>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Cover Imagery */}
            <section className="py-12 bg-[#0a0b0e]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative rounded-3xl overflow-hidden aspect-[16/9] border border-white/10 bg-neutral-900 shadow-2xl">
                        <img
                            src={project.cover_image}
                            alt={`${project.title} - Main production outcome for ${project.client_name}`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </section>

            {/* Metrics Impact Section */}
            {project.metrics && project.metrics.length > 0 && (
                <section className="py-12 bg-[#0c0d12] border-y border-white/10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {project.metrics.map((metric, i) => (
                                <div key={i} className="p-8 rounded-2xl bg-[#12141c] border border-white/10 text-center space-y-2">
                                    <p className="font-display font-black text-4xl sm:text-5xl text-[#d4ff00]">
                                        {metric.value}
                                    </p>
                                    <p className="text-xs font-mono uppercase tracking-widest text-neutral-300 font-bold">
                                        {metric.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Challenge, Work Done & Quantified Result Narrative */}
            <section className="py-20 bg-[#0a0b0e]">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                    {/* The Challenge */}
                    <div className="p-8 sm:p-10 rounded-3xl bg-[#12141c] border border-white/10 space-y-4">
                        <span className="font-mono text-xs uppercase tracking-widest text-red-400 font-bold">
                            [ 01. THE SITUATION & CHALLENGE ]
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
                            Client Challenge
                        </h2>
                        <p className="text-neutral-300 text-base leading-relaxed">
                            {project.client_challenge || project.summary}
                        </p>
                    </div>

                    {/* Work Done */}
                    <div className="p-8 sm:p-10 rounded-3xl bg-[#12141c] border border-white/10 space-y-4">
                        <span className="font-mono text-xs uppercase tracking-widest text-[#d4ff00] font-bold">
                            [ 02. EXECUTION & WORK COMPLETED ]
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
                            What We Delivered
                        </h2>
                        <p className="text-neutral-300 text-base leading-relaxed">
                            {project.work_done || project.description}
                        </p>

                        {/* Deliverables List */}
                        {project.deliverables && (
                            <div className="pt-4 border-t border-white/10 space-y-3">
                                <span className="font-mono text-xs uppercase tracking-wider text-neutral-400 font-bold block">
                                    Production Assets Handed Over:
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {project.deliverables.map((deliv, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-xs font-mono text-neutral-200">
                                            <CheckCircle2 className="w-4 h-4 text-[#d4ff00] shrink-0" />
                                            <span>{deliv}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Measurable Result */}
                    <div className="p-8 sm:p-10 rounded-3xl bg-[#12141c] border border-emerald-500/30 space-y-4">
                        <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-bold">
                            [ 03. MEASURABLE COMMERCIAL OUTCOME ]
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
                            Measurable Impact
                        </h2>
                        <p className="text-neutral-300 text-base leading-relaxed">
                            {project.measurable_result || 'Reduced turnaround times by over 60% while elevating marketplace approval and click-through rates.'}
                        </p>
                    </div>

                    {/* Production Gallery */}
                    {project.gallery && project.gallery.length > 0 && (
                        <div className="space-y-6 pt-6">
                            <h3 className="font-display font-bold text-2xl text-white">
                                Production Asset Gallery
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {project.gallery.map((imgUrl, idx) => (
                                    <div
                                        key={idx}
                                        className="rounded-2xl overflow-hidden aspect-[4/3] border border-white/10 bg-neutral-900 group"
                                    >
                                        <img
                                            src={imgUrl}
                                            alt={`${project.title} detailed asset render ${idx + 1}`}
                                            loading="lazy"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Call to Action Card */}
                    <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#12141c] to-[#0a0b0e] border border-[#d4ff00]/40 text-center space-y-6 shadow-2xl">
                        <span className="font-mono text-xs uppercase tracking-widest text-[#d4ff00] font-bold">
                            [ ACHIEVE SIMILAR RESULTS FOR YOUR CATALOG ]
                        </span>
                        <h3 className="text-3xl sm:text-4xl font-display font-bold text-white">
                            Test Our Production Quality on 3 Free Assets
                        </h3>
                        <p className="text-neutral-300 text-sm max-w-xl mx-auto leading-relaxed">
                            Upload 3 of your most complex raw images. We will return retouched, marketplace-ready master files in under 24 hours.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                            <Link
                                href="/#free-trial"
                                className="px-8 py-3.5 rounded-xl bg-[#d4ff00] text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-[#bfe600] transition-all shadow-lg flex items-center gap-2"
                            >
                                <Sparkles className="w-4 h-4" />
                                <span>Request Free 3-Asset Pilot</span>
                            </Link>
                            <button
                                type="button"
                                onClick={() => window.dispatchEvent(new CustomEvent('ce:open-discovery-call'))}
                                className="px-8 py-3.5 rounded-xl border border-white/20 text-white hover:bg-white/5 font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
                            >
                                <Calendar className="w-4 h-4 text-[#d4ff00]" />
                                <span>Book 15-Min Discovery Call</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
