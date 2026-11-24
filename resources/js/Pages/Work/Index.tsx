import React from 'react';
import { router } from '@inertiajs/react';
import { SeoHead } from '@/Components/Common/SeoHead';
import { PageHero } from '@/Components/Common/PageHero';
import { CaseStudyCard } from '@/Components/Work/CaseStudyCard';
import { Project, Category } from '@/types/models';

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
                className="py-8 bg-surface border-b border-ink/10 sticky top-[var(--header-height,61px)] z-30 backdrop-blur-xl bg-surface/90"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                        <button
                            type="button"
                            onClick={() => handleFilter('all')}
                            className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                                activeCategory === 'all'
                                    ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                                    : 'bg-ink/[0.03] text-muted hover:text-ink hover:bg-ink/[0.05] border border-ink/10'
                            }`}
                        >
                            All Results ({projects.length})
                        </button>

                        {categories.map((cat) => (
                            <button
                                key={cat.id || cat.slug}
                                type="button"
                                onClick={() => handleFilter(cat.slug)}
                                className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                                    activeCategory === cat.slug
                                        ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                                        : 'bg-ink/[0.03] text-muted hover:text-ink hover:bg-ink/[0.05] border border-ink/10'
                                }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Case Studies Grid */}
            <section className="py-20 bg-page">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                        {projects.map((project, idx) => (
                            <CaseStudyCard
                                key={project.id || project.slug}
                                project={project}
                                priority={idx < 2}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
