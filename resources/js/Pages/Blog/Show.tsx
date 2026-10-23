import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from '@inertiajs/react';
import { SeoHead } from '@/Components/Common/SeoHead';
import { Blog } from '@/types/models';
import {
    Clock,
    Calendar,
    ArrowUpRight,
    Share2,
    Tag,
    CornerDownRight,
    ArrowLeft,
    Copy,
    Check,
    Sparkles,
    ChevronRight,
    Quote,
    ExternalLink,
    Compass,
    BookOpen,
    Layers,
    FileText,
} from 'lucide-react';

interface BlogShowProps {
    blog: Blog;
    relatedBlogs: Blog[];
}

interface TocItem {
    id: string;
    text: string;
    level: number;
}

/**
 * Slugify a heading string into a valid URL anchor id
 */
function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

/**
 * Renders inline markdown text (bold, italic, links, inline code)
 */
function renderInlineFormatting(text: string): React.ReactNode {
    // Split by markdown inline tokens
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`|\[.*?\]\(.*?\))/g);

    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return (
                <strong key={index} className="text-white font-semibold">
                    {part.slice(2, -2)}
                </strong>
            );
        }
        if (part.startsWith('*') && part.endsWith('*')) {
            return (
                <em key={index} className="italic text-neutral-200">
                    {part.slice(1, -1)}
                </em>
            );
        }
        if (part.startsWith('`') && part.endsWith('`')) {
            return (
                <code
                    key={index}
                    className="px-1.5 py-0.5 rounded bg-[#12131a] text-[#d4ff00] border border-white/10 font-mono text-[0.875em]"
                >
                    {part.slice(1, -1)}
                </code>
            );
        }
        const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
        if (linkMatch) {
            const [, linkText, linkUrl] = linkMatch;
            const isExternal = linkUrl.startsWith('http');
            return (
                <a
                    key={index}
                    href={linkUrl}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    className="text-[#d4ff00] underline decoration-[#d4ff00]/40 hover:decoration-[#d4ff00] underline-offset-4 transition-colors font-medium inline-flex items-center gap-0.5"
                >
                    <span>{linkText}</span>
                    {isExternal && <ExternalLink className="w-3 h-3 inline-block" />}
                </a>
            );
        }
        return part;
    });
}

/**
 * Interactive Code Snippet with Copy Confirmation
 */
function CodeBlock({ code, language }: { code: string; language?: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="my-6 rounded-2xl overflow-hidden border border-white/10 bg-[#07080c] shadow-2xl group">
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#0d0f16] border-b border-white/10 text-xs font-mono text-neutral-400">
                <div className="flex items-center gap-2">
                    <span className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </span>
                    <span className="ml-2 uppercase text-[11px] font-semibold text-[#d4ff00]">
                        {language || 'CODE SNIPPET'}
                    </span>
                </div>
                <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors cursor-pointer text-[11px]"
                    title="Copy snippet"
                >
                    {copied ? (
                        <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 font-bold">Copied!</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                        </>
                    )}
                </button>
            </div>
            <pre className="p-5 font-mono text-xs sm:text-sm text-neutral-200 overflow-x-auto leading-relaxed">
                <code>{code}</code>
            </pre>
        </div>
    );
}

export default function Show({ blog, relatedBlogs = [] }: BlogShowProps) {
    const [copiedLink, setCopiedLink] = useState(false);
    const [readingProgress, setReadingProgress] = useState(0);
    const [activeHeadingId, setActiveHeadingId] = useState<string>('');

    // Extract table of contents items from blog body
    const tocItems = useMemo<TocItem[]>(() => {
        if (!blog.body) return [];
        const lines = blog.body.split('\n');
        const items: TocItem[] = [];

        lines.forEach((line) => {
            const trimmed = line.trim();
            if (trimmed.startsWith('## ')) {
                const text = trimmed.replace(/^##\s+/, '').trim();
                if (text) {
                    items.push({ id: slugify(text), text, level: 2 });
                }
            } else if (trimmed.startsWith('### ')) {
                const text = trimmed.replace(/^###\s+/, '').trim();
                if (text) {
                    items.push({ id: slugify(text), text, level: 3 });
                }
            }
        });

        return items;
    }, [blog.body]);

    // Word count calculation
    const wordCount = useMemo(() => {
        if (!blog.body) return 0;
        const clean = blog.body.replace(/<[^>]*>/g, ' ');
        return clean.split(/\s+/).filter(Boolean).length;
    }, [blog.body]);

    // Scroll reading progress tracker
    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (totalHeight > 0) {
                const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
                setReadingProgress(progress);
            }

            // Scroll spy for active heading in TOC
            if (tocItems.length > 0) {
                const headingElements = tocItems
                    .map((item) => document.getElementById(item.id))
                    .filter(Boolean) as HTMLElement[];

                for (let i = headingElements.length - 1; i >= 0; i--) {
                    const el = headingElements[i];
                    const rect = el.getBoundingClientRect();
                    if (rect.top <= 140) {
                        setActiveHeadingId(el.id);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [tocItems]);

    const handleCopyUrl = useCallback(() => {
        if (typeof window !== 'undefined') {
            navigator.clipboard.writeText(window.location.href);
            setCopiedLink(true);
            setTimeout(() => setCopiedLink(false), 2200);
        }
    }, []);

    const shareUrl = typeof window !== 'undefined' ? window.location.href : `https://cuttingedger.com/blog/${blog.slug}`;
    const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(shareUrl)}`;
    const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

    const formattedPublishDate = useMemo(() => {
        if (!blog.published_at) return 'Draft Dispatch';
        return new Date(blog.published_at).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    }, [blog.published_at]);

    const articleJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: blog.meta_title || blog.title,
        description: blog.meta_description || blog.excerpt,
        image: blog.og_image || blog.cover_image,
        keywords: blog.meta_keywords || (Array.isArray(blog.tags) ? blog.tags.join(', ') : ''),
        author: {
            '@type': 'Person',
            name: blog.author?.name || 'CuttingEdger Lead Architect',
        },
        publisher: {
            '@type': 'Organization',
            name: 'CuttingEdger',
            logo: {
                '@type': 'ImageObject',
                url: 'https://cuttingedger.com/logo.png',
            },
        },
        datePublished: blog.published_at,
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': blog.canonical_url || `https://cuttingedger.com/blog/${blog.slug}`,
        },
    };

    return (
        <>
            <SeoHead
                title={blog.meta_title || blog.title}
                description={blog.meta_description || blog.excerpt}
                keywords={blog.meta_keywords}
                robots={blog.robots || 'index, follow'}
                canonicalUrl={blog.canonical_url || `https://cuttingedger.com/blog/${blog.slug}`}
                image={blog.og_image || blog.cover_image}
                type="article"
                jsonLd={articleJsonLd}
            />

            {/* Scroll Reading Progress Bar */}
            <div className="fixed top-0 left-0 right-0 h-[3px] bg-transparent z-[60] pointer-events-none">
                <div
                    className="h-full bg-[#d4ff00] shadow-[0_0_12px_rgba(212,255,0,0.8)] transition-all duration-100 ease-out"
                    style={{ width: `${readingProgress}%` }}
                />
            </div>

            {/* EDITORIAL HERO SECTION */}
            <header className="relative pt-32 pb-14 bg-[#0a0b0e] border-b border-white/10 overflow-hidden">
                {/* Ambient Kinetic Glows */}
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#d4ff00]/15 via-[#d4ff00]/5 to-transparent rounded-full blur-[130px] pointer-events-none" />
                <div className="absolute top-1/3 right-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    {/* Navigation Bar / Breadcrumb Strip */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-8 text-xs font-mono">
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition-all group"
                        >
                            <ArrowLeft className="w-3.5 h-3.5 text-[#d4ff00] group-hover:-translate-x-1 transition-transform" />
                            <span>Return to Journal</span>
                        </Link>

                        <div className="flex items-center gap-2 text-neutral-400">
                            <Link href="/" className="hover:text-white transition-colors">
                                Home
                            </Link>
                            <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
                            <Link href="/blog" className="hover:text-white transition-colors">
                                Journal
                            </Link>
                            {blog.category && (
                                <>
                                    <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
                                    <Link
                                        href={`/blog?category=${blog.category.slug}`}
                                        className="text-[#d4ff00] hover:underline"
                                    >
                                        {blog.category.name}
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Taxonomy Category Badges */}
                    <div className="flex flex-wrap items-center gap-2.5 mb-6">
                        {blog.category && (
                            <Link
                                href={`/blog?category=${blog.category.slug}`}
                                className="px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-[#d4ff00]/10 text-[#d4ff00] border border-[#d4ff00]/30 hover:bg-[#d4ff00] hover:text-black transition-all"
                            >
                                {blog.category.name}
                            </Link>
                        )}
                        {blog.subcategory && (
                            <span className="px-3 py-1 rounded-full text-xs font-mono tracking-wider uppercase bg-white/5 text-neutral-300 border border-white/10 flex items-center gap-1.5">
                                <CornerDownRight className="w-3 h-3 text-[#d4ff00]" />
                                {blog.subcategory.name}
                            </span>
                        )}
                        {blog.is_featured && (
                            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-amber-400/10 text-amber-300 border border-amber-400/30 flex items-center gap-1.5">
                                <Sparkles className="w-3 h-3 text-amber-300" />
                                HERO DISPATCH
                            </span>
                        )}
                    </div>

                    {/* Main Headline */}
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight leading-[1.08] max-w-4xl">
                        {blog.title}
                    </h1>

                    {/* Executive Synopsis */}
                    {blog.excerpt && (
                        <p className="mt-6 text-lg sm:text-xl lg:text-2xl text-neutral-300 font-light leading-relaxed border-l-2 border-[#d4ff00] pl-5 sm:pl-6 max-w-3xl">
                            {blog.excerpt}
                        </p>
                    )}

                    {/* Editorial Attribution & Action Bar */}
                    <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-6">
                        {/* Author Credentials */}
                        {blog.author ? (
                            <Link
                                href={`/team/${blog.author.slug}`}
                                className="group flex items-center gap-3.5 text-left"
                            >
                                {blog.author.avatar ? (
                                    <img
                                        src={blog.author.avatar}
                                        alt={blog.author.name}
                                        className="w-12 h-12 rounded-full object-cover border-2 border-white/10 group-hover:border-[#d4ff00] transition-colors shadow-md"
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-[#d4ff00]/10 border border-[#d4ff00]/40 flex items-center justify-center text-[#d4ff00] font-mono font-bold text-sm">
                                        {blog.author.name.charAt(0)}
                                    </div>
                                )}
                                <div className="space-y-0.5">
                                    <div className="text-sm font-display font-bold text-white group-hover:text-[#d4ff00] transition-colors flex items-center gap-1.5">
                                        <span>{blog.author.name}</span>
                                        <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#d4ff00]" />
                                    </div>
                                    <div className="text-xs font-mono text-neutral-400">
                                        {blog.author.role}
                                    </div>
                                </div>
                            </Link>
                        ) : (
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#d4ff00] font-mono font-bold text-xs">
                                    CE
                                </div>
                                <div className="text-xs font-mono text-neutral-400">
                                    Editorial Team • CuttingEdger
                                </div>
                            </div>
                        )}

                        {/* Metadata Counters */}
                        <div className="flex flex-wrap items-center gap-5 text-xs font-mono text-neutral-400">
                            <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                                <Calendar className="w-3.5 h-3.5 text-[#d4ff00]" />
                                <span>{formattedPublishDate}</span>
                            </span>

                            <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                                <Clock className="w-3.5 h-3.5 text-[#d4ff00]" />
                                <span>{blog.reading_time || 5} min read</span>
                            </span>

                            {wordCount > 0 && (
                                <span className="hidden sm:inline-flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                                    <FileText className="w-3.5 h-3.5 text-neutral-400" />
                                    <span>{wordCount.toLocaleString()} words</span>
                                </span>
                            )}
                        </div>

                        {/* Interactive Share Actions */}
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handleCopyUrl}
                                className="h-9 px-3.5 rounded-full bg-white/5 hover:bg-[#d4ff00] text-neutral-300 hover:text-black border border-white/10 hover:border-[#d4ff00] font-mono text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                                title="Copy article URL"
                            >
                                {copiedLink ? (
                                    <>
                                        <Check className="w-3.5 h-3.5 text-black" />
                                        <span className="font-bold">Link Copied!</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-3.5 h-3.5" />
                                        <span>Copy Link</span>
                                    </>
                                )}
                            </button>

                            <a
                                href={twitterShareUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#d4ff00] text-neutral-300 hover:text-black border border-white/10 hover:border-[#d4ff00] flex items-center justify-center transition-all"
                                title="Share on X (Twitter)"
                                aria-label="Share on X"
                            >
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>

                            <a
                                href={linkedinShareUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#d4ff00] text-neutral-300 hover:text-black border border-white/10 hover:border-[#d4ff00] flex items-center justify-center transition-all"
                                title="Share on LinkedIn"
                                aria-label="Share on LinkedIn"
                            >
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.3a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            {/* CINEMA COVER MEDIA SHOWCASE */}
            {blog.cover_image && (
                <section className="pt-10 pb-6 bg-[#0a0b0e]">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="relative group">
                            {/* Ambient Glow Reflection */}
                            <div
                                className="absolute -inset-2 bg-gradient-to-r from-[#d4ff00]/15 via-cyan-500/10 to-[#d4ff00]/15 rounded-3xl blur-2xl opacity-40 group-hover:opacity-75 transition-opacity duration-700 pointer-events-none"
                            />

                            <div className="relative rounded-3xl overflow-hidden aspect-[16/9] border border-white/15 bg-neutral-950 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
                                <img
                                    src={blog.cover_image}
                                    alt={blog.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.01]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                                <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6">
                                    <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-[10px] font-mono text-neutral-300 tracking-wider uppercase">
                                        EDITORIAL FRAME // 16:9 CINEMA
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* MAIN ARTICLE EDITORIAL GRID */}
            <main className="py-12 lg:py-16 bg-[#0a0b0e]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                        {/* MAIN PROSE COLUMN (8 Cols) */}
                        <article className="lg:col-span-8 space-y-8">
                            <div className="space-y-6 text-neutral-200 font-sans text-base sm:text-lg lg:text-[19px] leading-[1.8] font-normal">
                                {blog.body.split('\n\n').map((block, idx) => {
                                    const trimmed = block.trim();
                                    if (!trimmed) return null;

                                    // Raw HTML block support
                                    if (trimmed.startsWith('<') && trimmed.endsWith('>')) {
                                        return (
                                            <div
                                                key={idx}
                                                dangerouslySetInnerHTML={{ __html: trimmed }}
                                                className="prose-html space-y-4"
                                            />
                                        );
                                    }

                                    // Heading 1
                                    if (trimmed.startsWith('# ')) {
                                        const headingText = trimmed.replace(/^#\s+/, '');
                                        const headingId = slugify(headingText);
                                        return (
                                            <h2
                                                key={idx}
                                                id={headingId}
                                                className="scroll-mt-32 text-2xl sm:text-4xl font-display font-extrabold text-white pt-8 pb-3 border-b border-white/10 group flex items-center justify-between"
                                            >
                                                <span>{headingText}</span>
                                                <a
                                                    href={`#${headingId}`}
                                                    className="opacity-0 group-hover:opacity-100 text-[#d4ff00] text-sm font-mono transition-opacity ml-2"
                                                    title="Direct section link"
                                                >
                                                    #
                                                </a>
                                            </h2>
                                        );
                                    }

                                    // Heading 2
                                    if (trimmed.startsWith('## ')) {
                                        const headingText = trimmed.replace(/^##\s+/, '');
                                        const headingId = slugify(headingText);
                                        return (
                                            <h3
                                                key={idx}
                                                id={headingId}
                                                className="scroll-mt-32 text-xl sm:text-2xl lg:text-3xl font-display font-bold text-white pt-6 pb-1 text-[#d4ff00] group flex items-center justify-between"
                                            >
                                                <span>{headingText}</span>
                                                <a
                                                    href={`#${headingId}`}
                                                    className="opacity-0 group-hover:opacity-100 text-[#d4ff00] text-xs font-mono transition-opacity ml-2"
                                                    title="Direct section link"
                                                >
                                                    #
                                                </a>
                                            </h3>
                                        );
                                    }

                                    // Heading 3
                                    if (trimmed.startsWith('### ')) {
                                        const headingText = trimmed.replace(/^###\s+/, '');
                                        const headingId = slugify(headingText);
                                        return (
                                            <h4
                                                key={idx}
                                                id={headingId}
                                                className="scroll-mt-32 text-lg sm:text-xl font-display font-semibold text-white pt-4"
                                            >
                                                {headingText}
                                            </h4>
                                        );
                                    }

                                    // Blockquote
                                    if (trimmed.startsWith('> ')) {
                                        const quoteText = trimmed.replace(/^>\s+/, '');
                                        return (
                                            <blockquote
                                                key={idx}
                                                className="relative my-8 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#d4ff00]/10 via-white/[0.02] to-transparent border-l-4 border-[#d4ff00] border-y border-r border-white/5"
                                            >
                                                <Quote className="w-8 h-8 text-[#d4ff00]/40 absolute top-4 right-4 pointer-events-none" />
                                                <p className="font-display italic text-lg sm:text-xl text-neutral-100 leading-relaxed">
                                                    &ldquo;{quoteText}&rdquo;
                                                </p>
                                            </blockquote>
                                        );
                                    }

                                    // Code Blocks
                                    if (trimmed.startsWith('```')) {
                                        const firstLineEnd = trimmed.indexOf('\n');
                                        const lang = firstLineEnd !== -1 ? trimmed.slice(3, firstLineEnd).trim() : '';
                                        const codeContent = trimmed
                                            .replace(/^```[a-z]*\n?/, '')
                                            .replace(/\n?```$/, '');
                                        return (
                                            <CodeBlock
                                                key={idx}
                                                code={codeContent}
                                                language={lang}
                                            />
                                        );
                                    }

                                    // Unordered List
                                    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                                        const items = trimmed
                                            .split('\n')
                                            .map((l) => l.replace(/^[-*]\s+/, '').trim())
                                            .filter(Boolean);
                                        return (
                                            <ul key={idx} className="my-6 space-y-3 pl-2">
                                                {items.map((item, itemIdx) => (
                                                    <li
                                                        key={itemIdx}
                                                        className="flex items-start gap-3 text-neutral-300"
                                                    >
                                                        <span className="w-1.5 h-1.5 rounded-full bg-[#d4ff00] mt-2.5 shrink-0 shadow-[0_0_6px_#d4ff00]" />
                                                        <span className="flex-1">
                                                            {renderInlineFormatting(item)}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        );
                                    }

                                    // Standard Paragraph with Markdown formatting
                                    return (
                                        <p key={idx} className="leading-relaxed">
                                            {renderInlineFormatting(trimmed)}
                                        </p>
                                    );
                                })}
                            </div>

                            {/* Tags Section */}
                            {Array.isArray(blog.tags) && blog.tags.length > 0 && (
                                <div className="mt-14 pt-8 border-t border-white/10 space-y-3">
                                    <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-400">
                                        <Tag className="w-3.5 h-3.5 text-[#d4ff00]" />
                                        <span>Categorized Topics & Tags</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {blog.tags.map((tag, i) => (
                                            <Link
                                                key={i}
                                                href={`/blog?category=all`}
                                                className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-[#d4ff00]/10 border border-white/10 hover:border-[#d4ff00]/40 text-neutral-300 hover:text-[#d4ff00] font-mono text-xs transition-all"
                                            >
                                                #{tag}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Author Spotlight Profile Card */}
                            {blog.author && (
                                <div className="mt-14 p-8 rounded-3xl bg-gradient-to-br from-[#12141c] via-[#0d0f15] to-[#0a0b0e] border border-white/10 shadow-2xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4ff00]/5 rounded-full blur-[80px] pointer-events-none" />

                                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10 text-center sm:text-left">
                                        {blog.author.avatar ? (
                                            <img
                                                src={blog.author.avatar}
                                                alt={blog.author.name}
                                                className="w-20 h-20 rounded-2xl object-cover border-2 border-[#d4ff00]/40 group-hover:border-[#d4ff00] transition-colors shrink-0 shadow-xl"
                                            />
                                        ) : (
                                            <div className="w-20 h-20 rounded-2xl bg-[#d4ff00]/10 border border-[#d4ff00]/40 flex items-center justify-center text-[#d4ff00] font-mono font-bold text-xl shrink-0">
                                                {blog.author.name.charAt(0)}
                                            </div>
                                        )}

                                        <div className="space-y-3 flex-1 min-w-0">
                                            <div className="space-y-1">
                                                <span className="font-mono text-[11px] uppercase tracking-widest text-[#d4ff00] block">
                                                    [ DISPATCH AUTHOR ]
                                                </span>
                                                <h3 className="font-display font-extrabold text-2xl text-white">
                                                    {blog.author.name}
                                                </h3>
                                                <p className="text-xs font-mono text-neutral-400">
                                                    {blog.author.role}
                                                </p>
                                            </div>

                                            {blog.author.bio && (
                                                <p className="text-sm text-neutral-300 leading-relaxed">
                                                    {blog.author.bio}
                                                </p>
                                            )}

                                            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                                                <Link
                                                    href={`/team/${blog.author.slug}`}
                                                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#d4ff00] text-black font-mono text-xs font-bold hover:bg-[#b8dd00] transition-all shadow-md"
                                                >
                                                    <span>View Member Profile</span>
                                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                                </Link>

                                                {blog.author.social_links?.twitter && (
                                                    <a
                                                        href={blog.author.social_links.twitter}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                                                        aria-label="Author Twitter"
                                                    >
                                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                                                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                                        </svg>
                                                    </a>
                                                )}

                                                {blog.author.social_links?.linkedin && (
                                                    <a
                                                        href={blog.author.social_links.linkedin}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                                                        aria-label="Author LinkedIn"
                                                    >
                                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                                                            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.3a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
                                                        </svg>
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </article>

                        {/* STICKY EDITORIAL SIDEBAR (4 Cols) */}
                        <aside className="lg:col-span-4 sticky top-28 space-y-6">
                            {/* Table of Contents Card (If headings exist) */}
                            {tocItems.length > 0 && (
                                <div className="p-6 rounded-2xl bg-[#0e1017] border border-white/10 shadow-xl space-y-4">
                                    <div className="flex items-center gap-2 pb-3 border-b border-white/10 text-xs font-mono font-bold uppercase tracking-wider text-white">
                                        <Compass className="w-4 h-4 text-[#d4ff00]" />
                                        <span>On This Page</span>
                                    </div>

                                    <nav className="space-y-1.5 text-xs font-mono max-h-[360px] overflow-y-auto scrollbar-none pr-1">
                                        {tocItems.map((item, idx) => {
                                            const isActive = activeHeadingId === item.id;
                                            return (
                                                <a
                                                    key={idx}
                                                    href={`#${item.id}`}
                                                    className={`block py-1.5 transition-all truncate ${
                                                        item.level === 3 ? 'pl-4 text-[11px]' : 'pl-2 font-medium'
                                                    } ${
                                                        isActive
                                                            ? 'text-[#d4ff00] border-l-2 border-[#d4ff00] bg-[#d4ff00]/5 font-bold'
                                                            : 'text-neutral-400 hover:text-white border-l-2 border-transparent'
                                                    }`}
                                                >
                                                    {item.text}
                                                </a>
                                            );
                                        })}
                                    </nav>
                                </div>
                            )}

                            {/* Share This Dispatch Box */}
                            <div className="p-6 rounded-2xl bg-[#0e1017] border border-white/10 shadow-xl space-y-4">
                                <div className="flex items-center gap-2 pb-3 border-b border-white/10 text-xs font-mono font-bold uppercase tracking-wider text-white">
                                    <Share2 className="w-4 h-4 text-[#d4ff00]" />
                                    <span>Share Article</span>
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                    <button
                                        type="button"
                                        onClick={handleCopyUrl}
                                        className="h-10 rounded-xl bg-white/5 hover:bg-[#d4ff00] text-neutral-300 hover:text-black border border-white/10 hover:border-[#d4ff00] font-mono text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                                    >
                                        {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                        <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                                    </button>

                                    <a
                                        href={twitterShareUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="h-10 rounded-xl bg-white/5 hover:bg-[#d4ff00] text-neutral-300 hover:text-black border border-white/10 hover:border-[#d4ff00] font-mono text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all"
                                    >
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                        </svg>
                                        <span>Post</span>
                                    </a>

                                    <a
                                        href={linkedinShareUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="h-10 rounded-xl bg-white/5 hover:bg-[#d4ff00] text-neutral-300 hover:text-black border border-white/10 hover:border-[#d4ff00] font-mono text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all"
                                    >
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                                            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.3a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
                                        </svg>
                                        <span>Share</span>
                                    </a>
                                </div>
                            </div>

                            {/* Build With Us Call to Action */}
                            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#12141c] to-[#0a0b0e] border border-[#d4ff00]/30 shadow-2xl relative overflow-hidden space-y-4">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4ff00]/10 rounded-full blur-[40px] pointer-events-none" />

                                <div className="space-y-1 relative z-10">
                                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#d4ff00]">
                                        RADICAL DIGITAL ARCHITECTURE
                                    </span>
                                    <h4 className="font-display font-bold text-lg text-white">
                                        Elevate Your Digital Platform
                                    </h4>
                                    <p className="text-xs text-neutral-400 leading-relaxed">
                                        We design and engineer high-performance web systems, kinetic UIs, and full-stack software.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        if (typeof window !== 'undefined') {
                                            window.dispatchEvent(new CustomEvent('ce:open-discovery-call'));
                                        }
                                    }}
                                    className="w-full h-10 rounded-xl bg-[#d4ff00] hover:bg-[#b8dd00] text-black font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(212,255,0,0.25)] cursor-pointer"
                                >
                                    <span>Schedule Discovery Call</span>
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>

            {/* CONTINUED READING / RELATED DISPATCHES */}
            {relatedBlogs.length > 0 && (
                <section className="py-20 lg:py-24 bg-[#07080b] border-t border-white/10">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
                            <div className="space-y-1.5">
                                <span className="font-mono text-xs uppercase tracking-widest text-[#d4ff00] block">
                                    [ CONTINUED READING ]
                                </span>
                                <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-white">
                                    More Architectural Essays
                                </h2>
                            </div>

                            <Link
                                href="/blog"
                                className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-neutral-400 hover:text-[#d4ff00] transition-colors"
                            >
                                <span>Browse All Entries</span>
                                <ArrowUpRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {relatedBlogs.map((rel) => (
                                <Link
                                    key={rel.id}
                                    href={`/blog/${rel.slug}`}
                                    className="group rounded-3xl bg-[#0f1118] border border-white/10 overflow-hidden hover:border-[#d4ff00]/50 transition-all flex flex-col shadow-xl"
                                >
                                    <div className="relative aspect-[16/9] bg-neutral-900 overflow-hidden">
                                        <img
                                            src={rel.cover_image}
                                            alt={rel.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                                        {rel.category && (
                                            <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-[10px] font-mono text-[#d4ff00] uppercase tracking-wider">
                                                {rel.category.name}
                                            </span>
                                        )}
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-400">
                                                <Clock className="w-3 h-3 text-[#d4ff00]" />
                                                <span>{rel.reading_time || 5} min read</span>
                                            </div>

                                            <h3 className="text-lg font-display font-bold text-white group-hover:text-[#d4ff00] transition-colors line-clamp-2 leading-snug">
                                                {rel.title}
                                            </h3>

                                            {rel.excerpt && (
                                                <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                                                    {rel.excerpt}
                                                </p>
                                            )}
                                        </div>

                                        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono text-neutral-400 group-hover:text-white transition-colors">
                                            <span>Read Dispatch</span>
                                            <ArrowUpRight className="w-3.5 h-3.5 text-[#d4ff00] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}
