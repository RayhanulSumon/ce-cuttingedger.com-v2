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
            <section className="py-8 bg-white border-b border-ink/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs font-mono">
                        <div>
                            <span className="text-subtle uppercase block mb-1">Client Partner</span>
                            <span className="text-ink font-medium text-sm">{project.client_name}</span>
                        </div>
                        <div>
                            <span className="text-subtle uppercase block mb-1">Discipline</span>
                            <span className="text-primary-ink font-medium text-sm">{project.category?.name || 'Production'}</span>
                        </div>
                        <div>
                            <span className="text-subtle uppercase block mb-1">Year & Timeline</span>
                            <span className="text-ink font-medium text-sm">{project.year}</span>
                        </div>
                        <div>
                            <span className="text-subtle uppercase block mb-1">Store / Live URL</span>
                            {project.live_url ? (
                                <a
                                    href={project.live_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-ink hover:text-primary-ink inline-flex items-center gap-1 font-medium text-sm transition-colors"
                                >
                                    <span>Visit Client Website</span>
                                    <ArrowUpRight className="w-3.5 h-3.5 text-primary-ink" />
                                </a>
                            ) : (
                                <span className="text-subtle">Private Enterprise Retainer</span>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Cover Imagery */}
            <section className="py-12 bg-page">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative rounded-3xl overflow-hidden aspect-[16/9] border border-ink/10 bg-white shadow-2xl">
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
                <section className="py-12 bg-white border-y border-ink/10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {project.metrics.map((metric, i) => (
                                <div key={i} className="p-8 rounded-2xl bg-white border border-ink/10 text-center space-y-2">
                                    <p className="font-display font-black text-4xl sm:text-5xl text-primary-ink">
                                        {metric.value}
                                    </p>
                                    <p className="text-xs font-mono uppercase tracking-widest text-ink-2 font-bold">
                                        {metric.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Challenge, Work Done & Quantified Result Narrative */}
            <section className="py-20 bg-page">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                    {/* The Challenge */}
                    <div className="p-8 sm:p-10 rounded-3xl bg-white border border-ink/10 space-y-4">
                        <span className="font-mono text-xs uppercase tracking-widest text-red-400 font-bold">
                            [ 01. THE SITUATION & CHALLENGE ]
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink">
                            Client Challenge
                        </h2>
                        <p className="text-ink-2 text-base leading-relaxed">
                            {project.client_challenge || project.summary}
                        </p>
                    </div>

                    {/* Work Done */}
                    <div className="p-8 sm:p-10 rounded-3xl bg-white border border-ink/10 space-y-4">
                        <span className="font-mono text-xs uppercase tracking-widest text-primary-ink font-bold">
                            [ 02. EXECUTION & WORK COMPLETED ]
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink">
                            What We Delivered
                        </h2>
                        <p className="text-ink-2 text-base leading-relaxed">
                            {project.work_done || project.description}
                        </p>

                        {/* Deliverables List */}
                        {project.deliverables && (
                            <div className="pt-4 border-t border-ink/10 space-y-3">
                                <span className="font-mono text-xs uppercase tracking-wider text-muted font-bold block">
                                    Production Assets Handed Over:
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {project.deliverables.map((deliv, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-xs font-mono text-ink-2">
                                            <CheckCircle2 className="w-4 h-4 text-primary-ink shrink-0" />
                                            <span>{deliv}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Measurable Result */}
                    <div className="p-8 sm:p-10 rounded-3xl bg-white border border-emerald-500/30 space-y-4">
                        <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-bold">
                            [ 03. MEASURABLE COMMERCIAL OUTCOME ]
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink">
                            Measurable Impact
                        </h2>
                        <p className="text-ink-2 text-base leading-relaxed">
                            {project.measurable_result || 'Reduced turnaround times by over 60% while elevating marketplace approval and click-through rates.'}
                        </p>
                    </div>

                    {/* Production Gallery */}
                    {project.gallery && project.gallery.length > 0 && (
                        <div className="space-y-6 pt-6">
                            <h3 className="font-display font-bold text-2xl text-ink">
                                Production Asset Gallery
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {project.gallery.map((imgUrl, idx) => (
                                    <div
                                        key={idx}
                                        className="rounded-2xl overflow-hidden aspect-[4/3] border border-ink/10 bg-white group"
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
                    <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-white to-page border border-primary/40 text-center space-y-6 shadow-2xl">
                        <span className="font-mono text-xs uppercase tracking-widest text-primary-ink font-bold">
                            [ ACHIEVE SIMILAR RESULTS FOR YOUR CATALOG ]
                        </span>
                        <h3 className="text-3xl sm:text-4xl font-display font-bold text-ink">
                            Test Our Production Quality on 3 Free Assets
                        </h3>
                        <p className="text-ink-2 text-sm max-w-xl mx-auto leading-relaxed">
                            Upload 3 of your most complex raw images. We will return retouched, marketplace-ready master files in under 24 hours.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                            <Link
                                href="/#free-trial"
                                className="px-8 py-3.5 rounded-xl bg-primary text-white font-display font-bold text-xs uppercase tracking-wider hover:bg-primary-hover transition-all shadow-lg flex items-center gap-2"
                            >
                                <Sparkles className="w-4 h-4" />
                                <span>Request Free 3-Asset Pilot</span>
                            </Link>
                            <button
                                type="button"
                                onClick={() => window.dispatchEvent(new CustomEvent('ce:open-discovery-call'))}
                                className="px-8 py-3.5 rounded-xl border border-ink/20 text-ink hover:bg-ink/[0.03] font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
                            >
                                <Calendar className="w-4 h-4 text-primary-ink" />
                                <span>Book 15-Min Discovery Call</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
