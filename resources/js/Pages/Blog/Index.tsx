import React from 'react';
import { Link, router } from '@inertiajs/react';
import { SeoHead } from '@/Components/Common/SeoHead';
import { Blog, BlogCategory } from '@/types/models';
import { ArrowUpRight, Clock, Calendar, Tag, CornerDownRight, ChevronRight, Sparkles } from 'lucide-react';

interface BlogIndexProps {
    blogs: Blog[];
    categories: BlogCategory[];
    activeCategory: string;
    activeSubcategory: string;
}

export default function Index({
    blogs = [],
    categories = [],
    activeCategory = 'all',
    activeSubcategory = 'all',
}: BlogIndexProps) {
    const handleCategoryFilter = (catSlug: string, subSlug?: string) => {
        const params: Record<string, string> = {};
        if (catSlug !== 'all') params.category = catSlug;
        if (subSlug && subSlug !== 'all') params.subcategory = subSlug;

        router.get('/blog', params, { preserveState: true, preserveScroll: true });
    };

    const currentCategory = categories.find((c) => c.slug === activeCategory);
    const subcategories = currentCategory?.subcategories || [];

    return (
        <>
            <SeoHead
                title="Latest Blogs & Technical Insights"
                description="Essays, engineering deep dives, design theory, and kinetic software architecture from the team at CuttingEdger."
                keywords="web development, design theory, laravel 13, react 19, kinetic animation, software architecture"
                canonicalUrl="https://cuttingedger.com/blog"
            />

            {/* HERO BANNER SECTION (MATCHING /pricing PageHero GRADIENT EFFECT) */}
            <section className="relative pt-28 sm:pt-32 pb-10 sm:pb-12 bg-page border-b border-ink/10 overflow-hidden text-center select-none">
                {/* Ambient Background Aura (Exact /pricing PageHero styling) */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
                <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center justify-center">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-ink tracking-wider uppercase font-display">
                        LATEST BLOG
                    </h1>

                    <nav aria-label="Breadcrumb" className="mt-2.5 flex items-center justify-center gap-1.5 text-sm sm:text-base font-medium">
                        <Link
                            href="/"
                            className="text-primary-ink hover:underline transition-all cursor-pointer font-medium"
                        >
                            Home
                        </Link>
                        <ChevronRight className="w-4 h-4 text-subtle shrink-0" />
                        <span className="text-ink/90">Blog</span>
                    </nav>
                </div>
            </section>

            {/* Category Filter Pills */}
            <section
                style={{ top: 'var(--header-height)' }}
                className="py-5 bg-white border-b border-ink/10 sticky top-[var(--header-height,61px)] z-30 backdrop-blur-xl bg-white/90 space-y-3"
            >
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Top-Level Categories */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                        <button
                            type="button"
                            onClick={() => handleCategoryFilter('all')}
                            className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${activeCategory === 'all'
                                    ? 'bg-primary text-white font-bold shadow-[0_0_15px_rgba(251, 183, 24, 0.3)]'
                                    : 'bg-ink/[0.03] text-muted hover:text-ink hover:bg-ink/[0.05] border border-ink/10'
                                }`}
                        >
                            <span>All Essays</span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeCategory === 'all' ? 'bg-white/25 text-white' : 'bg-ink/[0.05] text-muted'}`}>
                                {blogs.length}
                            </span>
                        </button>

                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => handleCategoryFilter(cat.slug)}
                                className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${activeCategory === cat.slug
                                        ? 'bg-primary text-white font-bold shadow-[0_0_15px_rgba(251, 183, 24, 0.3)]'
                                        : 'bg-ink/[0.03] text-muted hover:text-ink hover:bg-ink/[0.05] border border-ink/10'
                                    }`}
                            >
                                <span>{cat.name}</span>
                                {typeof cat.blogs_count === 'number' && (
                                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeCategory === cat.slug ? 'bg-white/25 text-white' : 'bg-ink/[0.05] text-muted'}`}>
                                        {cat.blogs_count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Subcategories (if selected category has any) */}
                    {subcategories.length > 0 && (
                        <div className="flex items-center gap-2 pt-2 border-t border-ink/10 overflow-x-auto scrollbar-none">
                            <span className="text-[11px] font-mono text-subtle uppercase flex items-center gap-1 shrink-0">
                                <CornerDownRight className="w-3 h-3 text-primary-ink" />
                                Subtopics:
                            </span>
                            <button
                                type="button"
                                onClick={() => handleCategoryFilter(activeCategory, 'all')}
                                className={`px-3 py-1 rounded text-xs font-mono transition-all cursor-pointer ${activeSubcategory === 'all'
                                        ? 'bg-ink/10 text-ink font-bold'
                                        : 'text-muted hover:text-ink'
                                    }`}
                            >
                                All {currentCategory?.name}
                            </button>
                            {subcategories.map((sub) => (
                                <button
                                    key={sub.id}
                                    type="button"
                                    onClick={() => handleCategoryFilter(activeCategory, sub.slug)}
                                    className={`px-3 py-1 rounded text-xs font-mono transition-all cursor-pointer ${activeSubcategory === sub.slug
                                            ? 'bg-primary/20 text-primary-ink border border-primary/30 font-bold'
                                            : 'text-muted hover:text-ink border border-ink/10'
                                        }`}
                                >
                                    {sub.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Articles Grid (Compact 3-Column Premium Cards) */}
            <section className="py-12 sm:py-16 bg-page">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                    {blogs.length === 0 ? (
                        <div className="text-center py-20 border border-dashed border-ink/10 rounded-2xl p-8 bg-[#0c0d14]/40">
                            <Tag className="w-8 h-8 text-subtle mx-auto mb-3" />
                            <h3 className="text-base font-mono font-bold text-ink">No blogs found</h3>
                            <p className="text-subtle text-xs font-mono mt-1">
                                No articles in this taxonomy category yet. Check back soon.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 xl:gap-8">
                            {blogs.map((blog) => (
                                <article
                                    key={blog.id || blog.slug}
                                    className="group relative rounded-2xl bg-gradient-to-b from-white to-[#0c0e16] border border-ink/10 overflow-hidden flex flex-col justify-between hover:border-primary/50 hover:shadow-[0_16px_36px_rgba(0,0,0,0.65),0_0_28px_rgba(251, 183, 24, 0.08)] transition-all duration-300 hover:-translate-y-1.5"
                                >
                                    <div>
                                        {/* Media Frame (Slimmer 16:9 Cinematic Aspect) */}
                                        <Link
                                            href={`/blog/${blog.slug}`}
                                            className="block relative aspect-[16/9] overflow-hidden bg-page"
                                        >
                                            <img
                                                src={blog.cover_image}
                                                alt={blog.title}
                                                loading="lazy"
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                            />
                                            {/* Vignette Overlay for Smooth Transition */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-white via-black/25 to-transparent pointer-events-none" />

                                            {/* Badges Overlay */}
                                            <div className="absolute top-2.5 left-2.5 flex flex-wrap items-center gap-1.5">
                                                <span className="bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full border border-ink/15 text-[10px] font-mono text-primary-ink font-medium tracking-wide">
                                                    {blog.category?.name || 'Blog'}
                                                </span>
                                                {blog.subcategory && (
                                                    <span className="bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full border border-ink/10 text-[10px] font-mono text-ink-2">
                                                        {blog.subcategory.name}
                                                    </span>
                                                )}
                                            </div>

                                            {blog.is_featured && (
                                                <div className="absolute top-2.5 right-2.5">
                                                    <span className="bg-primary/15 backdrop-blur-md border border-primary/40 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold text-primary-ink tracking-wider flex items-center gap-1">
                                                        <Sparkles className="w-2.5 h-2.5 text-primary-ink" />
                                                        FEATURED
                                                    </span>
                                                </div>
                                            )}
                                        </Link>

                                        {/* Content Body (Compact Spacing & Padding) */}
                                        <div className="p-4 sm:p-5 space-y-2.5">
                                            {/* Metadata (Reading time + Date) */}
                                            <div className="flex items-center gap-2.5 text-[11px] font-mono text-muted">
                                                {blog.reading_time ? (
                                                    <>
                                                        <span className="flex items-center gap-1.5 text-ink-2">
                                                            <Clock className="w-3 h-3 text-primary-ink" />
                                                            {blog.reading_time} min read
                                                        </span>
                                                        <span className="text-subtle">•</span>
                                                    </>
                                                ) : null}
                                                <span className="flex items-center gap-1 text-muted">
                                                    <Calendar className="w-3 h-3 text-subtle" />
                                                    {new Date(blog.published_at).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                    })}
                                                </span>
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-base sm:text-lg font-display font-bold text-ink group-hover:text-primary-ink transition-colors leading-snug line-clamp-2">
                                                <Link href={`/blog/${blog.slug}`}>
                                                    {blog.title}
                                                </Link>
                                            </h3>

                                            {/* Excerpt */}
                                            <p className="text-muted text-xs sm:text-[13px] line-clamp-2 leading-relaxed">
                                                {blog.excerpt}
                                            </p>

                                            {/* Tags */}
                                            {Array.isArray(blog.tags) && blog.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1 pt-0.5">
                                                    {blog.tags.slice(0, 3).map((tag, i) => (
                                                        <span
                                                            key={i}
                                                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-ink/[0.03] border border-ink/10 text-muted hover:text-ink transition-colors"
                                                        >
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Footer Attribution Strip (Slimmer Height) */}
                                    <div className="px-4 sm:px-5 py-2.5 border-t border-ink/10 bg-[#0b0c12]/60 flex items-center justify-between mt-auto">
                                        {blog.author ? (
                                            <div className="flex items-center gap-2">
                                                {blog.author.avatar ? (
                                                    <img
                                                        src={blog.author.avatar}
                                                        alt={blog.author.name}
                                                        className="w-5 h-5 rounded-full object-cover border border-primary/40"
                                                    />
                                                ) : (
                                                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary-ink border border-primary/30 flex items-center justify-center text-[9px] font-mono font-bold">
                                                        {blog.author.name.charAt(0)}
                                                    </span>
                                                )}
                                                <span className="text-xs font-mono text-ink-2 truncate max-w-[180px]">
                                                    {blog.author.name}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-xs font-mono text-subtle">
                                                Editorial
                                            </span>
                                        )}

                                        <Link
                                            href={`/blog/${blog.slug}`}
                                            className="inline-flex items-center gap-1 text-xs font-mono font-bold text-primary-ink group-hover:text-ink transition-colors"
                                        >
                                            <span>Read</span>
                                            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
