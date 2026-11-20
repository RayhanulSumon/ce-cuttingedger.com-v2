import React, { useEffect, useMemo, useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { SeoHead } from '@/Components/Common/SeoHead';
import { EASE_OUT_EXPO } from '@/Components/Landing/shared';
import { Blog, BlogCategory } from '@/types/models';
import {
    ArrowUpRight,
    ChevronLeft,
    ChevronRight,
    CornerDownRight,
    Sparkles,
    Tag,
} from 'lucide-react';

interface BlogIndexProps {
    blogs: Blog[];
    featuredBlog?: Blog | null;
    featuredBlogs?: Blog[];
    categories: BlogCategory[];
    activeCategory: string;
    activeSubcategory: string;
}

const PER_PAGE = 4;

const heroImageVariants = {
    enter: (dir: number) => ({
        x: dir >= 0 ? '100%' : '-100%',
        scale: 1.05,
        opacity: 1,
    }),
    center: {
        x: '0%',
        scale: 1,
        opacity: 1,
    },
    exit: (dir: number) => ({
        x: dir >= 0 ? '-35%' : '35%',
        scale: 0.96,
        opacity: 0,
    }),
};

const heroContentVariants = {
    enter: (dir: number) => ({
        opacity: 0,
        x: dir >= 0 ? 110 : -110,
    }),
    center: {
        opacity: 1,
        x: 0,
    },
    exit: (dir: number) => ({
        opacity: 0,
        x: dir >= 0 ? -90 : 90,
    }),
};

const blogCardVariants = {
    hidden: (isEven: boolean) => ({
        opacity: 0,
        x: isEven ? -72 : 72,
        y: 16,
    }),
    visible: {
        opacity: 1,
        x: 0,
        y: 0,
        transition: {
            duration: 0.75,
            ease: EASE_OUT_EXPO,
        },
    },
};

const blogImageVariants = {
    hidden: (isEven: boolean) => ({
        clipPath: isEven
            ? 'inset(0 100% 0 0 round 16px)'
            : 'inset(0 0 0 100% round 16px)',
        scale: 1.06,
    }),
    visible: {
        clipPath: 'inset(0 0% 0 0% round 16px)',
        scale: 1,
        transition: {
            duration: 0.85,
            delay: 0.08,
            ease: EASE_OUT_EXPO,
        },
    },
};

const blogTextVariants = {
    hidden: (isEven: boolean) => ({
        opacity: 0,
        x: isEven ? 24 : -24,
    }),
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.65,
            delay: 0.14,
            ease: EASE_OUT_EXPO,
        },
    },
};

function formatPublishDate(dateValue?: string | null): string {
    if (!dateValue) {
        return 'Editorial';
    }

    return new Date(dateValue).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
}

export default function Index({
    blogs = [],
    featuredBlog = null,
    featuredBlogs = [],
    categories = [],
    activeCategory = 'all',
    activeSubcategory = 'all',
}: BlogIndexProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [activeFeaturedIndex, setActiveFeaturedIndex] = useState(0);
    const [slideDirection, setSlideDirection] = useState(1);
    const [heroPaused, setHeroPaused] = useState(false);

    useEffect(() => {
        setCurrentPage(1);
    }, [activeCategory, activeSubcategory, blogs.length]);

    const featuredList = useMemo(() => {
        if (featuredBlogs && featuredBlogs.length > 0) {
            return featuredBlogs;
        }
        const flagged = blogs.filter((b) => b.is_featured);
        if (flagged.length > 0) {
            return flagged;
        }
        if (featuredBlog) {
            return [featuredBlog];
        }
        return blogs.slice(0, 1);
    }, [featuredBlogs, featuredBlog, blogs]);

    useEffect(() => {
        setActiveFeaturedIndex(0);
    }, [featuredList.length]);

    useEffect(() => {
        if (featuredList.length <= 1 || heroPaused) {
            return;
        }
        const timer = window.setInterval(() => {
            setSlideDirection(1);
            setActiveFeaturedIndex((prev) => (prev + 1) % featuredList.length);
        }, 6000);
        return () => window.clearInterval(timer);
    }, [featuredList.length, heroPaused]);

    const safeFeaturedIndex =
        featuredList.length > 0 ? activeFeaturedIndex % featuredList.length : 0;
    const heroBlog = featuredList[safeFeaturedIndex] || null;

    const prevFeatured = () => {
        if (featuredList.length <= 1) {
            return;
        }
        setSlideDirection(-1);
        setActiveFeaturedIndex(
            (prev) => (prev - 1 + featuredList.length) % featuredList.length
        );
    };

    const nextFeatured = () => {
        if (featuredList.length <= 1) {
            return;
        }
        setSlideDirection(1);
        setActiveFeaturedIndex((prev) => (prev + 1) % featuredList.length);
    };

    const handleCategoryFilter = (catSlug: string, subSlug?: string) => {
        setCurrentPage(1);

        const params: Record<string, string> = {};
        if (catSlug !== 'all') {
            params.category = catSlug;
        }
        if (subSlug && subSlug !== 'all') {
            params.subcategory = subSlug;
        }

        router.get('/blog', params, { preserveState: true, preserveScroll: true });
    };

    const currentCategory = categories.find((c) => c.slug === activeCategory);
    const subcategories = currentCategory?.subcategories || [];

    const totalPages = Math.max(1, Math.ceil(blogs.length / PER_PAGE));
    const safePage = Math.min(currentPage, totalPages);

    const paginatedBlogs = useMemo(() => {
        const start = (safePage - 1) * PER_PAGE;
        return blogs.slice(start, start + PER_PAGE);
    }, [blogs, safePage]);

    const goToPage = (page: number) => {
        const clamped = Math.max(1, Math.min(totalPages, page));
        setCurrentPage(clamped);

        if (typeof document !== 'undefined') {
            document
                .getElementById('latest-blogs')
                ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <>
            <SeoHead
                title="Latest Blogs & Technical Insights"
                description="Essays, engineering deep dives, visual production workflows, and creative technology insights from the team at CuttingEdger."
                keywords="retouching, 3d cgi, e-commerce visual production, digital twins, virtual try-on, software engineering"
                canonicalUrl="https://cuttingedger.com/blog"
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: 'Blog', url: '/blog' },
                ]}
            />

            {/* TOP FEATURED BLOG HERO BANNER */}
            <section
                onMouseEnter={() => setHeroPaused(true)}
                onMouseLeave={() => setHeroPaused(false)}
                className="relative min-h-[440px] sm:min-h-[520px] lg:min-h-[560px] flex items-end overflow-hidden bg-secondary pt-28 pb-10 sm:pb-14"
            >
                <AnimatePresence initial={false} custom={slideDirection}>
                    {heroBlog?.cover_image ? (
                        <motion.img
                            key={`hero-img-${heroBlog.id || heroBlog.slug}`}
                            src={heroBlog.cover_image}
                            alt={heroBlog.title}
                            custom={slideDirection}
                            variants={heroImageVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.85, ease: EASE_OUT_EXPO }}
                            className="absolute inset-0 w-full h-full object-cover object-center"
                        />
                    ) : (
                        <motion.div
                            key="hero-fallback-bg"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary to-primary/30"
                        />
                    )}
                </AnimatePresence>

                {/* Dark readability overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/25 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none" />

                {featuredList.length > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={prevFeatured}
                            aria-label="Previous featured post"
                            className="hidden sm:flex absolute left-6 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full border border-white/25 bg-black/40 hover:bg-primary hover:border-primary text-white items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            type="button"
                            onClick={nextFeatured}
                            aria-label="Next featured post"
                            className="hidden sm:flex absolute right-6 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full border border-white/25 bg-black/40 hover:bg-primary hover:border-primary text-white items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </>
                )}

                <div className="max-w-7xl mx-auto w-full px-5 sm:px-16 lg:px-20 2xl:px-8 relative z-10">
                    {heroBlog ? (
                        <AnimatePresence initial={false} custom={slideDirection} mode="wait">
                            <motion.div
                                key={`hero-content-${heroBlog.id || heroBlog.slug}`}
                                custom={slideDirection}
                                variants={heroContentVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.65, ease: EASE_OUT_EXPO }}
                                className="max-w-3xl"
                            >
                                <div className="mb-4 flex flex-wrap items-center gap-2.5">
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white shadow-[0_8px_24px_rgba(245,118,26,0.4)]">
                                        <Sparkles className="w-3.5 h-3.5" />
                                        <span>Featured Post</span>
                                    </span>
                                </div>

                                <h1 className="max-w-2xl text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-white leading-[1.12] tracking-tight">
                                    <Link
                                        href={`/blog/${heroBlog.slug}`}
                                        prefetch
                                        className="hover:text-primary transition-colors"
                                    >
                                        {heroBlog.title}
                                    </Link>
                                </h1>

                                <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-y-4 sm:divide-x sm:divide-white/25 pt-6 text-white">
                                    <div className="pr-4 sm:pr-6">
                                        <span className="block text-[11px] font-medium text-white/65">
                                            Published On
                                        </span>
                                        <span className="mt-0.5 block text-xs sm:text-sm font-semibold text-white">
                                            {formatPublishDate(heroBlog.published_at)}
                                        </span>
                                    </div>

                                    <div className="pr-4 sm:px-6">
                                        <span className="block text-[11px] font-medium text-white/65">
                                            Category
                                        </span>
                                        <span className="mt-0.5 block text-xs sm:text-sm font-semibold text-white">
                                            {heroBlog.category?.name || 'Editorial'}
                                        </span>
                                    </div>

                                    <div className="pr-4 sm:px-6">
                                        <span className="block text-[11px] font-medium text-white/65">
                                            Author
                                        </span>
                                        <span className="mt-0.5 block text-xs sm:text-sm font-semibold text-white">
                                            {heroBlog.author?.name || 'CE Production'}
                                        </span>
                                    </div>

                                    <div className="sm:pl-6">
                                        <span className="block text-[11px] font-medium text-white/65">
                                            {heroBlog.reading_time || 5} Min Read
                                        </span>
                                        <Link
                                            href={`/blog/${heroBlog.slug}`}
                                            prefetch
                                            className="mt-0.5 inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-white hover:text-primary transition-colors"
                                        >
                                            <span>Read Full Article</span>
                                            <ArrowUpRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                </div>

                                {featuredList.length > 1 && (
                                    <div className="mt-6 flex items-center gap-2 sm:hidden">
                                        <button
                                            type="button"
                                            onClick={prevFeatured}
                                            aria-label="Previous featured post"
                                            className="w-10 h-10 rounded-full border border-white/25 bg-black/40 hover:bg-primary hover:border-primary text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={nextFeatured}
                                            aria-label="Next featured post"
                                            className="w-10 h-10 rounded-full border border-white/25 bg-black/40 hover:bg-primary hover:border-primary text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    ) : (
                        <div className="max-w-2xl">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-white leading-[1.12] tracking-tight">
                                CuttingEdger Journal &amp; Technical Insights
                            </h1>
                            <p className="mt-3 text-sm sm:text-base text-white/75 leading-relaxed">
                                Essays, visual production workflows, and engineering insights from
                                our studio team.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* LATEST BLOGS HEADER & CATEGORY FILTER BAR */}
            <section id="latest-blogs" className="bg-surface border-b border-ink/10 py-5 sm:py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-ink tracking-tight">
                            Latest Blogs
                        </h2>

                        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                            <button
                                type="button"
                                onClick={() => handleCategoryFilter('all')}
                                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                                    activeCategory === 'all'
                                        ? 'bg-primary text-white font-bold shadow-[0_6px_20px_rgba(245,118,26,0.28)] border border-primary'
                                        : 'bg-page text-muted border border-ink/10 hover:border-primary/40 hover:text-ink'
                                }`}
                            >
                                ALL
                            </button>

                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => handleCategoryFilter(cat.slug)}
                                    className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                                        activeCategory === cat.slug
                                            ? 'bg-primary text-white font-bold shadow-[0_6px_20px_rgba(245,118,26,0.28)] border border-primary'
                                            : 'bg-page text-muted border border-ink/10 hover:border-primary/40 hover:text-ink'
                                    }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {subcategories.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-ink/10 flex items-center gap-2 overflow-x-auto scrollbar-none">
                            <span className="text-[11px] font-mono text-subtle uppercase flex items-center gap-1 shrink-0">
                                <CornerDownRight className="w-3 h-3 text-primary-ink" />
                                Subtopics:
                            </span>
                            <button
                                type="button"
                                onClick={() => handleCategoryFilter(activeCategory, 'all')}
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                                    activeSubcategory === 'all'
                                        ? 'bg-ink text-white font-semibold'
                                        : 'bg-page text-muted hover:text-ink border border-ink/10'
                                }`}
                            >
                                All {currentCategory?.name}
                            </button>
                            {subcategories.map((sub) => (
                                <button
                                    key={sub.id}
                                    type="button"
                                    onClick={() => handleCategoryFilter(activeCategory, sub.slug)}
                                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                                        activeSubcategory === sub.slug
                                            ? 'bg-primary/15 text-primary-ink border border-primary/40 font-semibold'
                                            : 'bg-page text-muted hover:text-ink border border-ink/10'
                                    }`}
                                >
                                    {sub.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ALTERNATING HORIZONTAL BLOG CARDS LIST */}
            <section className="py-12 sm:py-16 bg-page relative overflow-x-hidden">
                {/* Subtle vertical editorial grid lines & warm primary ambient glow */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(to_right,var(--color-ink)_1px,transparent_1px)] [background-size:180px_100%]"
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute top-24 right-4 sm:right-1/4 w-72 h-72 sm:w-[480px] sm:h-[480px] max-w-full rounded-full bg-primary/[0.06] blur-[140px]"
                />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    {blogs.length === 0 ? (
                        <div className="text-center py-20 border border-dashed border-ink/15 rounded-[28px] p-8 bg-surface">
                            <Tag className="w-8 h-8 text-subtle mx-auto mb-3" />
                            <h3 className="text-lg font-display font-bold text-ink">No blogs found</h3>
                            <p className="text-muted text-sm mt-1">
                                No articles in this category yet. Check back soon or switch categories.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-8 sm:space-y-10">
                                {paginatedBlogs.map((blog, idx) => {
                                    const isEven = idx % 2 === 0;

                                    return (
                                        <motion.div
                                            key={blog.id || blog.slug}
                                            initial="hidden"
                                            whileInView="visible"
                                            viewport={{
                                                once: true,
                                                amount: 0.18,
                                                margin: '0px 0px -40px 0px',
                                            }}
                                        >
                                            <motion.article
                                                custom={isEven}
                                                variants={blogCardVariants}
                                                className="group rounded-[28px] bg-surface border border-ink/10 p-5 sm:p-7 lg:p-8 shadow-[0_20px_48px_-20px_rgba(15,23,42,0.08)] hover:border-primary/40 transition-colors duration-300"
                                            >
                                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-center">
                                                    {/* Cover Image */}
                                                    <motion.div
                                                        custom={isEven}
                                                        variants={blogImageVariants}
                                                        className={`lg:col-span-6 ${
                                                            isEven ? 'lg:order-1' : 'lg:order-2'
                                                        }`}
                                                    >
                                                        <Link
                                                            href={`/blog/${blog.slug}`}
                                                            prefetch
                                                            className="block relative aspect-[16/10] rounded-2xl overflow-hidden bg-page border border-ink/10"
                                                        >
                                                            <img
                                                                src={blog.cover_image}
                                                                alt={blog.title}
                                                                loading={idx < 2 ? 'eager' : 'lazy'}
                                                                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                                                            />
                                                        </Link>
                                                    </motion.div>

                                                    {/* Content Block */}
                                                    <motion.div
                                                        custom={isEven}
                                                        variants={blogTextVariants}
                                                        className={`lg:col-span-6 ${
                                                            isEven ? 'lg:order-2' : 'lg:order-1'
                                                        } space-y-4 sm:space-y-5 lg:px-3`}
                                                    >
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <span className="text-sm sm:text-base font-semibold text-primary-ink">
                                                                {blog.category?.name || 'Editorial'}
                                                            </span>
                                                            {blog.subcategory && (
                                                                <span className="text-xs font-medium text-subtle">
                                                                    · {blog.subcategory.name}
                                                                </span>
                                                            )}
                                                        </div>

                                                        <h3 className="text-2xl sm:text-3xl lg:text-[36px] font-display font-extrabold text-ink leading-[1.16] tracking-tight group-hover:text-primary-ink transition-colors">
                                                            <Link href={`/blog/${blog.slug}`} prefetch>
                                                                {blog.title}
                                                            </Link>
                                                        </h3>

                                                        <p className="text-sm sm:text-base text-muted leading-relaxed line-clamp-3">
                                                            {blog.excerpt}
                                                        </p>

                                                        <div className="pt-1">
                                                            <Link
                                                                href={`/blog/${blog.slug}`}
                                                                prefetch
                                                                className="inline-flex items-center gap-2 rounded-full border border-primary/50 bg-primary/[0.06] hover:bg-primary text-primary-ink hover:text-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest transition-all duration-300"
                                                            >
                                                                <span>Read Blog</span>
                                                                <ArrowUpRight className="w-3.5 h-3.5" />
                                                            </Link>
                                                        </div>
                                                    </motion.div>
                                                </div>
                                            </motion.article>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* PAGINATION BAR */}
                            {totalPages > 1 && (
                                <nav
                                    aria-label="Blog pagination"
                                    className="pt-10 sm:pt-12 flex flex-wrap items-center justify-center gap-2"
                                >
                                    <button
                                        type="button"
                                        onClick={() => goToPage(safePage - 1)}
                                        disabled={safePage === 1}
                                        className="px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium text-muted hover:text-ink disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                                    >
                                        &laquo; Previous
                                    </button>

                                    {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                                        (pageNum) => (
                                            <button
                                                key={pageNum}
                                                type="button"
                                                onClick={() => goToPage(pageNum)}
                                                aria-current={
                                                    pageNum === safePage ? 'page' : undefined
                                                }
                                                className={`w-9 h-9 rounded-lg text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center ${
                                                    pageNum === safePage
                                                        ? 'bg-primary text-white font-bold shadow-[0_6px_18px_rgba(245,118,26,0.28)]'
                                                        : 'bg-surface border border-ink/10 text-ink-2 hover:border-primary/40 hover:text-ink font-medium'
                                                }`}
                                            >
                                                {pageNum}
                                            </button>
                                        )
                                    )}

                                    <button
                                        type="button"
                                        onClick={() => goToPage(safePage + 1)}
                                        disabled={safePage === totalPages}
                                        className="px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium text-muted hover:text-ink disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                                    >
                                        Next &raquo;
                                    </button>
                                </nav>
                            )}
                        </>
                    )}
                </div>
            </section>
        </>
    );
}
