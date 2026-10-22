import React from 'react';
import { Link, router } from '@inertiajs/react';
import { SeoHead } from '@/Components/Common/SeoHead';
import { PageHero } from '@/Components/Common/PageHero';
import { Project, Category } from '@/types/models';
import { ArrowUpRight } from 'lucide-react';

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
            '/work',
            slug === 'all' ? {} : { category: slug },
            { preserveState: true, preserveScroll: true }
        );
    };

    return (
        <>
            <SeoHead
                title="Work Archives & Case Studies"
                description="Explore selected client commissions in software architecture, brand systems, and 3D spatial experiences."
            />

            <PageHero
                eyebrow="SELECTED ARCHIVES"
                title="CATALOG OF RADICAL"
                highlight="DIGITAL CRAFT."
                description="A curated index of production flagships engineered for venture-backed founders and ambitious category leaders."
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
                                    ? 'bg-[#d4ff00] text-black font-bold shadow-[0_0_15px_rgba(212,255,0,0.3)]'
                                    : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/5'
                            }`}
                        >
                            All Commissions ({projects.length})
                        </button>

                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => handleFilter(cat.slug)}
                                className={`px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                                    activeCategory === cat.slug
                                        ? 'bg-[#d4ff00] text-black font-bold shadow-[0_0_15px_rgba(212,255,0,0.3)]'
                                        : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/5'
                                }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Work Grid */}
            <section className="py-20 bg-[#0a0b0e]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {projects.map((project, index) => (
                            <article
                                key={project.id || project.slug}
                                className="group relative rounded-3xl bg-[#12141c] border border-white/10 overflow-hidden flex flex-col justify-between hover:border-[#d4ff00]/50 transition-all duration-500"
                            >
                                {/* Media Container */}
                                <Link
                                    href={`/work/${project.slug}`}
                                    data-cursor-view="EXPLORE"
                                    className="block relative aspect-[16/10] overflow-hidden bg-neutral-900"
                                >
                                    <img
                                        src={project.cover_image}
                                        alt={project.title}
                                        loading="lazy"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                    />
                                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-mono text-[#d4ff00]">
                                        {project.category?.name || 'Commission'}
                                    </div>
                                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-mono text-neutral-400">
                                        [{project.year}]
                                    </div>
                                </Link>

                                {/* Project Details */}
                                <div className="p-8 space-y-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <span className="font-mono text-xs uppercase text-neutral-400 block mb-1">
                                                {project.client_name}
                                            </span>
                                            <h3 className="text-2xl sm:text-3xl font-display font-black text-white group-hover:text-[#d4ff00] transition-colors">
                                                <Link href={`/work/${project.slug}`}>
                                                    {project.title}
                                                </Link>
                                            </h3>
                                        </div>

                                        <Link
                                            href={`/work/${project.slug}`}
                                            className="w-10 h-10 rounded-full border border-white/10 group-hover:border-[#d4ff00] group-hover:bg-[#d4ff00] group-hover:text-black flex items-center justify-center transition-all shrink-0 mt-1"
                                        >
                                            <ArrowUpRight className="w-5 h-5" />
                                        </Link>
                                    </div>

                                    <p className="text-sm text-neutral-400 line-clamp-2 leading-relaxed">
                                        {project.summary}
                                    </p>

                                    <div className="pt-2 flex flex-wrap gap-2">
                                        {project.deliverables?.map((deliv, i) => (
                                            <span
                                                key={i}
                                                className="text-[11px] font-mono text-neutral-400 bg-white/5 px-2.5 py-1 rounded border border-white/5"
                                            >
                                                {deliv}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
