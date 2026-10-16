import React from 'react';
import { Link, router } from '@inertiajs/react';
import { SeoHead } from '@/Components/Common/SeoHead';
import { PageHero } from '@/Components/Common/PageHero';
import { Post, Category } from '@/types/models';
import { ArrowUpRight, Clock, Calendar } from 'lucide-react';

interface BlogIndexProps {
    posts: Post[];
    categories: Category[];
    activeCategory: string;
}

export default function Index({
    posts = [],
    categories = [],
    activeCategory = 'all',
}: BlogIndexProps) {
    const handleCategoryFilter = (slug: string) => {
        router.get(
            '/blog',
            slug === 'all' ? {} : { category: slug },
            { preserveState: true, preserveScroll: true }
        );
    };

    return (
        <>
            <SeoHead
                title="Dispatch Journal & Technical Insights"
                description="Essays, engineering deep dives, and design theory from the partners at CuttingEdger."
            />

            <PageHero
                eyebrow="DISPATCH JOURNAL"
                title="THOUGHTS ON KINETICS,"
                highlight="CODE & BRAND GRAVITY."
                description="Long-form essays, technical post-mortems, and design manifestos dissecting what works on the modern web."
            />

            {/* Category Filter Pills */}
            <section className="py-8 bg-[#0c0d12] border-b border-white/10 sticky top-[72px] z-30 backdrop-blur-xl bg-[#0c0d12]/90">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                        <button
                            type="button"
                            onClick={() => handleCategoryFilter('all')}
                            className={`px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                                activeCategory === 'all'
                                    ? 'bg-[#d4ff00] text-black font-bold shadow-[0_0_15px_rgba(212,255,0,0.3)]'
                                    : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/5'
                            }`}
                        >
                            All Essays ({posts.length})
                        </button>

                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => handleCategoryFilter(cat.slug)}
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

            {/* Articles Grid */}
            <section className="py-20 bg-[#0a0b0e]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {posts.map((post) => (
                            <article
                                key={post.id || post.slug}
                                className="group rounded-3xl bg-[#12141c] border border-white/10 overflow-hidden flex flex-col justify-between hover:border-[#d4ff00]/50 transition-all duration-300"
                            >
                                <Link
                                    href={`/blog/${post.slug}`}
                                    className="block relative aspect-[16/10] overflow-hidden bg-neutral-900"
                                >
                                    <img
                                        src={post.cover_image}
                                        alt={post.title}
                                        loading="lazy"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                    />
                                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-mono text-[#d4ff00]">
                                        {post.category?.name || 'Insight'}
                                    </div>
                                </Link>

                                <div className="p-8 space-y-4">
                                    <div className="flex items-center gap-4 text-xs font-mono text-neutral-500">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5 text-[#d4ff00]" />
                                            {post.reading_time} min read
                                        </span>
                                        {post.author && (
                                            <span>By {post.author.name}</span>
                                        )}
                                    </div>

                                    <h3 className="text-2xl sm:text-3xl font-display font-bold text-white group-hover:text-[#d4ff00] transition-colors leading-snug">
                                        <Link href={`/blog/${post.slug}`}>
                                            {post.title}
                                        </Link>
                                    </h3>

                                    <p className="text-neutral-400 text-sm line-clamp-3 leading-relaxed">
                                        {post.excerpt}
                                    </p>

                                    <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                                        <span className="text-xs font-mono text-neutral-500">
                                            {new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                        <Link
                                            href={`/blog/${post.slug}`}
                                            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#d4ff00] group-hover:text-white transition-colors"
                                        >
                                            <span>Read Essay</span>
                                            <ArrowUpRight className="w-4 h-4" />
                                        </Link>
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
