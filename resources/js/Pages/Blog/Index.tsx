import React from 'react';
import { Link, router } from '@inertiajs/react';
import { SeoHead } from '@/Components/Common/SeoHead';
import { PageHero } from '@/Components/Common/PageHero';
import { Blog, BlogCategory } from '@/types/models';
import { ArrowUpRight, Clock, Calendar, Tag, CornerDownRight } from 'lucide-react';

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
                title="Dispatch Journal & Technical Insights"
                description="Essays, engineering deep dives, design theory, and kinetic software architecture from the team at CuttingEdger."
                keywords="web development, design theory, laravel 13, react 19, kinetic animation, software architecture"
                canonicalUrl="https://cuttingedger.com/blog"
            />

            <PageHero
                eyebrow="DISPATCH JOURNAL"
                title="THOUGHTS ON KINETICS,"
                highlight="CODE & BRAND GRAVITY."
                description="Long-form essays, technical post-mortems, and design manifestos dissecting what works on the modern web."
            />

            {/* Category Filter Pills */}
            <section
                style={{ top: 'var(--header-height)' }}
                className="py-6 bg-[#0c0d12] border-b border-white/10 sticky top-[var(--header-height,61px)] z-30 backdrop-blur-xl bg-[#0c0d12]/90 space-y-3"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Top-Level Categories */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                        <button
                            type="button"
                            onClick={() => handleCategoryFilter('all')}
                            className={`px-5 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                                activeCategory === 'all'
                                    ? 'bg-[#d4ff00] text-black font-bold shadow-[0_0_15px_rgba(212,255,0,0.3)]'
                                    : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/5'
                            }`}
                        >
                            All Essays ({blogs.length})
                        </button>

                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => handleCategoryFilter(cat.slug)}
                                className={`px-5 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                                    activeCategory === cat.slug
                                        ? 'bg-[#d4ff00] text-black font-bold shadow-[0_0_15px_rgba(212,255,0,0.3)]'
                                        : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/5'
                                }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* Subcategories (if selected category has any) */}
                    {subcategories.length > 0 && (
                        <div className="flex items-center gap-2 pt-2 border-t border-white/5 overflow-x-auto scrollbar-none">
                            <span className="text-[11px] font-mono text-neutral-500 uppercase flex items-center gap-1 shrink-0">
                                <CornerDownRight className="w-3 h-3 text-[#d4ff00]" />
                                Subtopics:
                            </span>
                            <button
                                type="button"
                                onClick={() => handleCategoryFilter(activeCategory, 'all')}
                                className={`px-3 py-1 rounded text-xs font-mono transition-all cursor-pointer ${
                                    activeSubcategory === 'all'
                                        ? 'bg-white/20 text-white font-bold'
                                        : 'text-neutral-400 hover:text-white'
                                }`}
                            >
                                All {currentCategory?.name}
                            </button>
                            {subcategories.map((sub) => (
                                <button
                                    key={sub.id}
                                    type="button"
                                    onClick={() => handleCategoryFilter(activeCategory, sub.slug)}
                                    className={`px-3 py-1 rounded text-xs font-mono transition-all cursor-pointer ${
                                        activeSubcategory === sub.slug
                                            ? 'bg-[#d4ff00]/20 text-[#d4ff00] border border-[#d4ff00]/30 font-bold'
                                            : 'text-neutral-400 hover:text-white border border-white/5'
                                    }`}
                                >
                                    {sub.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Articles Grid */}
            <section className="py-20 bg-[#0a0b0e]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {blogs.length === 0 ? (
                        <div className="text-center py-24 border border-dashed border-white/10 rounded-3xl p-8">
                            <Tag className="w-8 h-8 text-neutral-600 mx-auto mb-3" />
                            <h3 className="text-lg font-mono font-bold text-white">No dispatches found</h3>
                            <p className="text-neutral-500 text-xs font-mono mt-1">
                                No articles in this taxonomy category yet. Check back soon.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {blogs.map((blog) => (
                                <article
                                    key={blog.id || blog.slug}
                                    className="group rounded-3xl bg-[#12141c] border border-white/10 overflow-hidden flex flex-col justify-between hover:border-[#d4ff00]/50 transition-all duration-300"
                                >
                                    <Link
                                        href={`/blog/${blog.slug}`}
                                        className="block relative aspect-[16/10] overflow-hidden bg-neutral-900"
                                    >
                                        <img
                                            src={blog.cover_image}
                                            alt={blog.title}
                                            loading="lazy"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                        />
                                        <div className="absolute top-4 left-4 flex items-center gap-1.5">
                                            <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-mono text-[#d4ff00]">
                                                {blog.category?.name || 'Dispatch'}
                                            </div>
                                            {blog.subcategory && (
                                                <div className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-[10px] font-mono text-neutral-300">
                                                    {blog.subcategory.name}
                                                </div>
                                            )}
                                        </div>
                                    </Link>

                                    <div className="p-8 space-y-4">
                                        <div className="flex items-center gap-4 text-xs font-mono text-neutral-500">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3.5 h-3.5 text-[#d4ff00]" />
                                                {blog.reading_time} min read
                                            </span>
                                            {blog.author && (
                                                <span>By {blog.author.name}</span>
                                            )}
                                        </div>

                                        <h3 className="text-2xl sm:text-3xl font-display font-bold text-white group-hover:text-[#d4ff00] transition-colors leading-snug">
                                            <Link href={`/blog/${blog.slug}`}>
                                                {blog.title}
                                            </Link>
                                        </h3>

                                        <p className="text-neutral-400 text-sm line-clamp-3 leading-relaxed">
                                            {blog.excerpt}
                                        </p>

                                        {/* Tags */}
                                        {Array.isArray(blog.tags) && blog.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 pt-1">
                                                {blog.tags.slice(0, 3).map((tag, i) => (
                                                    <span
                                                        key={i}
                                                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/5 text-neutral-400"
                                                    >
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                                            <span className="text-xs font-mono text-neutral-500">
                                                {new Date(blog.published_at).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </span>
                                            <Link
                                                href={`/blog/${blog.slug}`}
                                                className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#d4ff00] group-hover:text-white transition-colors"
                                            >
                                                <span>Read Dispatch</span>
                                                <ArrowUpRight className="w-4 h-4" />
                                            </Link>
                                        </div>
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
