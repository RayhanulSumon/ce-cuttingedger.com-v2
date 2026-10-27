import React from 'react';
import { Link, router } from '@inertiajs/react';
import { SeoHead } from '@/Components/Common/SeoHead';
import { PageHero } from '@/Components/Common/PageHero';
import { Project, Category } from '@/types/models';
import { ArrowUpRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface WorkIndexProps {
    projects: Project[];
    categories: Category[];
    activeCategory: string;
}

export default function Index({
    projects = [],
    categories = [],
    activeCategory = 'all',
}: WorkIndexProps) {
    const handleFilter = (slug: string) => {
        router.get(
            '/case-studies',
            slug === 'all' ? {} : { category: slug },
            { preserveState: true, preserveScroll: true }
        );
    };

    return (
        <>
            <SeoHead
                title="Client Case Studies & Visual Performance Results"
                description="Explore real-world case studies from Cutting Edger: 4,800+ SKU ghost mannequin rollouts, macro fine jewelry retouching, and 3D furniture CGI modeling."
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: 'Case Studies', url: '/case-studies' },
                ]}
            />

            <PageHero
                eyebrow="PORTFOLIO & CASE STUDIES"
                title="MEASURABLE VISUAL"
                highlight="PERFORMANCE PROOF."
                description="Explore how Cutting Edger optimizes high-volume catalog production, Delta-E color fidelity, and 3D virtual staging for global commerce brands."
            />

            {/* Category Filter Pills */}
            <section
                style={{ top: 'var(--header-height)' }}
                className="py-8 bg-[#0c0d12] border-b border-white/10 sticky top-[var(--header-height,61px)] z-30 backdrop-blur-xl bg-[#0c0d12]/90"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                        <button
                            type="button"
                            onClick={() => handleFilter('all')}
                            className={`px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                                activeCategory === 'all'
                                    ? 'bg-accent text-black font-bold shadow-[0_0_15px_rgba(251, 183, 24, 0.3)]'
                                    : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/5'
                            }`}
                        >
                            All Results ({projects.length})
                        </button>

                        {categories.map((cat) => (
                            <button
                                key={cat.id || cat.slug}
                                type="button"
                                onClick={() => handleFilter(cat.slug)}
                                className={`px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                                    activeCategory === cat.slug
                                        ? 'bg-accent text-black font-bold shadow-[0_0_15px_rgba(251, 183, 24, 0.3)]'
                                        : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/5'
                                }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Case Studies Grid */}
            <section className="py-20 bg-[#0a0b0e]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                        {projects.map((project, idx) => (
                            <article
                                key={project.id || project.slug}
                                className="group p-6 sm:p-8 rounded-3xl bg-[#12141c] border border-white/10 hover:border-accent/40 transition-all shadow-xl flex flex-col justify-between"
                            >
                                <div className="space-y-4">
                                    {/* Cover Image Container */}
                                    <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-neutral-900 border border-white/5">
                                        <img
                                            src={project.cover_image}
                                            alt={project.title}
                                            loading={idx < 2 ? 'eager' : 'lazy'}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                                        {/* Badges Overlay */}
                                        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                                            {project.is_concept ? (
                                                <span className="px-3 py-1 rounded-full bg-cyan-400/20 border border-cyan-400/40 text-cyan-300 font-mono text-[11px] font-bold uppercase backdrop-blur-md">
                                                    [ Concept Showcase ]
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-[11px] font-bold uppercase backdrop-blur-md">
                                                    ✓ Client Case Study
                                                </span>
                                            )}
                                        </div>

                                        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-white/90">
                                            <span className="font-bold text-accent">{project.client_name}</span>
                                            <span>{project.year}</span>
                                        </div>
                                    </div>

                                    <h2 className="text-2xl font-display font-bold text-white group-hover:text-accent transition-colors">
                                        <Link href={`/case-studies/${project.slug}`}>
                                            {project.title}
                                        </Link>
                                    </h2>

                                    <p className="text-neutral-400 text-sm leading-relaxed line-clamp-3">
                                        {project.summary}
                                    </p>

                                    {/* Quantified Metrics Pills */}
                                    {project.metrics && project.metrics.length > 0 && (
                                        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5">
                                            {project.metrics.slice(0, 3).map((m, i) => (
                                                <div key={i} className="text-center p-2 rounded-xl bg-white/[0.02]">
                                                    <p className="font-display font-black text-sm text-accent">{m.value}</p>
                                                    <p className="text-[10px] font-mono text-neutral-400 truncate">{m.label}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="pt-6 mt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                                    <span className="text-neutral-400">{project.category?.name || 'Production'}</span>
                                    <Link
                                        href={`/case-studies/${project.slug}`}
                                        className="text-accent font-bold inline-flex items-center gap-1 group-hover:underline"
                                    >
                                        <span>Read Full Study</span>
                                        <ArrowUpRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
