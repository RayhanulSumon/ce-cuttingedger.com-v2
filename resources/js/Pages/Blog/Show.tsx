import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from '@inertiajs/react';
import { SeoHead } from '@/Components/Common/SeoHead';
import { Blog } from '@/types/models';
import {
    Clock,
    Calendar,
    ArrowUpRight,
    ArrowRight,
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
    BookOpen,
    Layers,
    FileText,
} from 'lucide-react';

interface BlogShowProps {
    blog: Blog;
    relatedBlogs: Blog[];
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
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
        if (!blog.published_at) return 'Draft Blog';
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
            <header className="relative pt-24 sm:pt-28 pb-8 sm:pb-10 bg-[#0a0b0e] border-b border-white/10 overflow-hidden">
                {/* Ambient Kinetic Glows */}
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[750px] h-[320px] bg-gradient-to-b from-[#d4ff00]/15 via-[#d4ff00]/5 to-transparent rounded-full blur-[110px] pointer-events-none" />
                <div className="absolute top-1/4 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-[130px] pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(212,255,0,0.06),rgba(255,255,255,0))] pointer-events-none" />

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    {/* Navigation Bar / Breadcrumb Strip */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4 text-xs font-mono">
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition-all group shadow-xs text-[11px]"
                        >
                            <ArrowLeft className="w-3 h-3 text-[#d4ff00] group-hover:-translate-x-1 transition-transform" />
                            <span>Return to Blog</span>
                        </Link>

                        <div className="flex items-center gap-2 text-neutral-400 bg-black/40 px-3 py-1 rounded-full border border-white/5 backdrop-blur-xs text-[11px]">
                            <Link href="/" className="text-[#d4ff00] hover:underline font-medium transition-colors">
                                Home
                            </Link>
                            <ChevronRight className="w-3 h-3 text-neutral-600" />
                            <Link href="/blog" className="text-white/90 hover:text-white transition-colors">
                                Blog
                            </Link>
                            {blog.category && (
                                <>
                                    <ChevronRight className="w-3 h-3 text-neutral-600" />
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
                    <div className="flex flex-wrap items-center gap-2 mb-3.5">
                        {blog.category && (
                            <Link
                                href={`/blog?category=${blog.category.slug}`}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase bg-[#d4ff00]/10 text-[#d4ff00] border border-[#d4ff00]/30 hover:bg-[#d4ff00] hover:text-black transition-all shadow-[0_0_12px_rgba(212,255,0,0.15)] group"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-[#d4ff00] shadow-[0_0_6px_#d4ff00] group-hover:bg-black transition-colors" />
                                <span>{blog.category.name}</span>
                            </Link>
                        )}
                        {blog.subcategory && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono tracking-wider uppercase bg-white/[0.04] text-neutral-300 border border-white/10 backdrop-blur-xs">
                                <CornerDownRight className="w-3 h-3 text-[#d4ff00]" />
                                <span>{blog.subcategory.name}</span>
                            </span>
                        )}
                        {blog.is_featured && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase bg-amber-400/10 text-amber-300 border border-amber-400/30 shadow-[0_0_12px_rgba(251,191,36,0.15)]">
                                <Sparkles className="w-3 h-3 text-amber-300" />
                                <span>FEATURED BLOG</span>
                            </span>
                        )}
                    </div>

                    {/* Main Headline */}
                    <h1 className="text-2xl sm:text-4xl lg:text-[42px] font-display font-extrabold tracking-tight leading-[1.14] max-w-3xl bg-gradient-to-br from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent">
                        {blog.title}
                    </h1>

                    {/* Executive Synopsis Callout */}
                    {blog.excerpt && (
                        <div className="relative mt-4 sm:mt-5 p-4 sm:p-5 rounded-xl bg-gradient-to-r from-[#d4ff00]/[0.08] via-white/[0.02] to-transparent border-l-4 border-[#d4ff00] border-y border-r border-white/10 backdrop-blur-md shadow-md max-w-3xl">
                            <span className="text-[9px] font-mono text-[#d4ff00] uppercase tracking-widest block mb-1 font-bold flex items-center gap-1.5">
                                <Quote className="w-2.5 h-2.5 rotate-180 inline-block text-[#d4ff00]" />
                                EXECUTIVE SYNOPSIS
                            </span>
                            <p className="text-sm sm:text-base text-neutral-200 font-light leading-relaxed">
                                {blog.excerpt}
                            </p>
                        </div>
                    )}

                    {/* Editorial Attribution & Action Deck */}
                    <div className="mt-5 sm:mt-6 p-2.5 sm:p-3 px-4 rounded-xl bg-[#0e1017]/90 border border-white/10 backdrop-blur-xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
                        {/* Author Credentials */}
                        {blog.author ? (
                            <Link
                                href={`/team/${blog.author.slug}`}
                                className="group flex items-center gap-3 text-left shrink-0"
                            >
                                {blog.author.avatar ? (
                                    <div className="relative">
                                        <img
                                            src={blog.author.avatar}
                                            alt={blog.author.name}
                                            className="w-9 h-9 rounded-full object-cover border border-[#d4ff00]/40 group-hover:border-[#d4ff00] transition-colors shadow-[0_0_8px_rgba(212,255,0,0.2)]"
                                        />
                                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-[#0e1017]" title="Verified Author" />
                                    </div>
                                ) : (
                                    <div className="w-9 h-9 rounded-full bg-[#d4ff00]/10 border border-[#d4ff00]/40 flex items-center justify-center text-[#d4ff00] font-mono font-bold text-xs shadow-[0_0_8px_rgba(212,255,0,0.15)]">
                                        {blog.author.name.charAt(0)}
                                    </div>
                                )}
                                <div className="space-y-0.5">
                                    <div className="text-xs sm:text-sm font-display font-bold text-white group-hover:text-[#d4ff00] transition-colors flex items-center gap-1">
                                        <span>{blog.author.name}</span>
                                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#d4ff00]" />
                                    </div>
                                    <div className="text-[10px] font-mono text-neutral-400">
                                        {blog.author.role}
                                    </div>
                                </div>
                            </Link>
                        ) : (
                            <div className="flex items-center gap-2.5 shrink-0">
                                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#d4ff00] font-mono font-bold text-[10px]">
                                    CE
                                </div>
                                <div className="text-[11px] font-mono text-neutral-400">
                                    Editorial Team • CuttingEdger
                                </div>
                            </div>
                        )}

                        {/* Metadata Counters (Unified Capsule) */}
                        <div className="flex items-center flex-wrap gap-2 text-[11px] font-mono text-neutral-300 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
                            <span className="flex items-center gap-1.5">
                                <Calendar className="w-3 h-3 text-[#d4ff00]" />
                                <span>{formattedPublishDate}</span>
                            </span>

                            <span className="text-neutral-600 font-bold">•</span>

                            <span className="flex items-center gap-1.5">
                                <Clock className="w-3 h-3 text-[#d4ff00]" />
                                <span>{blog.reading_time || 5} min read</span>
                            </span>

                            {wordCount > 0 && (
                                <>
                                    <span className="text-neutral-600 font-bold">•</span>
                                    <span className="flex items-center gap-1.5">
                                        <FileText className="w-3 h-3 text-neutral-400" />
                                        <span>{wordCount.toLocaleString()} words</span>
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Interactive Share Actions */}
                        <div className="flex items-center gap-1.5 shrink-0">
                            <button
                                type="button"
                                onClick={handleCopyUrl}
                                className="h-8 px-3 rounded-lg bg-white/5 hover:bg-[#d4ff00] text-neutral-200 hover:text-black border border-white/10 hover:border-[#d4ff00] font-mono text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs group"
                                title="Copy article URL"
                            >
                                {copiedLink ? (
                                    <>
                                        <Check className="w-3 h-3 text-emerald-400 group-hover:text-black" />
                                        <span className="text-emerald-400 group-hover:text-black font-bold">Copied!</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-3 h-3 text-[#d4ff00] group-hover:text-black" />
                                        <span>Copy Link</span>
                                    </>
                                )}
                            </button>

                            <a
                                href={twitterShareUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[#d4ff00] text-neutral-300 hover:text-black border border-white/10 hover:border-[#d4ff00] flex items-center justify-center transition-all cursor-pointer shadow-xs"
                                title="Share on X (Twitter)"
                                aria-label="Share on X"
                            >
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>

                            <a
                                href={linkedinShareUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[#d4ff00] text-neutral-300 hover:text-black border border-white/10 hover:border-[#d4ff00] flex items-center justify-center transition-all cursor-pointer shadow-xs"
                                title="Share on LinkedIn"
                                aria-label="Share on LinkedIn"
                            >
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.3a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            {/* MAIN ARTICLE EDITORIAL GRID */}
            <main className="py-10 lg:py-14 bg-[#0a0b0e]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
                        {/* MAIN PROSE COLUMN (8 Cols) */}
                        <article className="lg:col-span-8 space-y-8">
                            {/* Blog Cover Image at the top of the article column */}
                            {blog.cover_image && (
                                <div className="relative group">
                                    <div
                                        className="absolute -inset-1 bg-gradient-to-r from-[#d4ff00]/15 via-cyan-500/10 to-[#d4ff00]/15 rounded-2xl sm:rounded-3xl blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-700 pointer-events-none"
                                    />
                                    <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-[16/9] border border-white/15 bg-neutral-950 shadow-[0_16px_40px_rgba(0,0,0,0.7)]">
                                        <img
                                            src={blog.cover_image}
                                            alt={blog.title}
                                            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.01]"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                                    </div>
                                </div>
                            )}

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

                            {/* POST-AUTHOR: SHARE ARTICLE */}
                            <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-[#0e1017] border border-white/10 shadow-xl space-y-6 relative overflow-hidden group">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-[#d4ff00]/10 border border-[#d4ff00]/30 flex items-center justify-center text-[#d4ff00] shrink-0">
                                            <Share2 className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h4 className="font-display font-bold text-xl text-white">
                                                Share Article
                                            </h4>
                                        </div>
                                    </div>
                                    <p className="text-xs text-neutral-400 font-mono">
                                        Distribute this blog across your network
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <button
                                        type="button"
                                        onClick={handleCopyUrl}
                                        className="h-11 rounded-xl bg-white/5 hover:bg-[#d4ff00] text-neutral-200 hover:text-black border border-white/10 hover:border-[#d4ff00] font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm group"
                                    >
                                        {copiedLink ? (
                                            <>
                                                <Check className="w-4 h-4 text-emerald-400 group-hover:text-black" />
                                                <span className="text-emerald-400 group-hover:text-black font-bold">
                                                    Link Copied!
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-4 h-4 text-[#d4ff00] group-hover:text-black" />
                                                <span>Copy Link</span>
                                            </>
                                        )}
                                    </button>

                                    <a
                                        href={twitterShareUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="h-11 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 hover:border-white/20 font-mono text-xs flex items-center justify-center gap-2 transition-all"
                                    >
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                        </svg>
                                        <span>Share on X</span>
                                    </a>

                                    <a
                                        href={linkedinShareUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="h-11 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 hover:border-white/20 font-mono text-xs flex items-center justify-center gap-2 transition-all"
                                    >
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                                            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.3a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
                                        </svg>
                                        <span>Share on LinkedIn</span>
                                    </a>
                                </div>
                            </div>
                        </article>

                        {/* RIGHT STICKY EDITORIAL SIDEBAR (4 Cols) */}
                        <aside className="lg:col-span-4 sticky top-28 space-y-6">
                            <div className="p-6 rounded-3xl bg-[#0e1017] border border-white/10 shadow-2xl relative overflow-hidden space-y-5">
                                <div className="absolute top-0 right-0 w-44 h-44 bg-[#d4ff00]/5 rounded-full blur-[60px] pointer-events-none" />

                                {/* Sidebar Header */}
                                <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-lg bg-[#d4ff00]/10 border border-[#d4ff00]/30 flex items-center justify-center text-[#d4ff00]">
                                            <BookOpen className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h3 className="font-display font-bold text-base text-white">
                                                Other Blogs
                                            </h3>
                                        </div>
                                    </div>

                                    <Link
                                        href="/blog"
                                        className="text-[11px] font-mono text-neutral-400 hover:text-[#d4ff00] flex items-center gap-1 transition-colors"
                                    >
                                        <span>View All</span>
                                        <ArrowUpRight className="w-3 h-3" />
                                    </Link>
                                </div>

                                {/* Other Blogs List */}
                                <div className="space-y-3 relative z-10">
                                    {relatedBlogs.length > 0 ? (
                                        relatedBlogs.map((otherBlog) => (
                                            <Link
                                                key={otherBlog.id}
                                                href={`/blog/${otherBlog.slug}`}
                                                className="group flex gap-3.5 p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-[#d4ff00]/40 transition-all duration-300"
                                            >
                                                {/* Thumbnail */}
                                                <div className="w-20 h-20 rounded-xl overflow-hidden bg-neutral-900 border border-white/10 shrink-0 relative">
                                                    {otherBlog.cover_image ? (
                                                        <img
                                                            src={otherBlog.cover_image}
                                                            alt={otherBlog.title}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-neutral-600">
                                                            <FileText className="w-5 h-5" />
                                                        </div>
                                                    )}
                                                    {otherBlog.category && (
                                                        <span className="absolute bottom-1 left-1 right-1 px-1 py-0.5 rounded bg-black/80 backdrop-blur-xs text-[8px] font-mono text-[#d4ff00] uppercase tracking-wider truncate text-center">
                                                            {otherBlog.category.name}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Info */}
                                                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-400">
                                                            <Clock className="w-3 h-3 text-[#d4ff00]" />
                                                            <span>{otherBlog.reading_time || 5}m read</span>
                                                            {otherBlog.author && (
                                                                <>
                                                                    <span>•</span>
                                                                    <span className="truncate">{otherBlog.author.name}</span>
                                                                </>
                                                            )}
                                                        </div>

                                                        <h4 className="font-display font-bold text-xs sm:text-sm text-neutral-100 group-hover:text-[#d4ff00] transition-colors line-clamp-2 leading-snug">
                                                            {otherBlog.title}
                                                        </h4>
                                                    </div>

                                                    <div className="flex items-center gap-1 text-[10px] font-mono text-neutral-400 group-hover:text-white transition-colors pt-1">
                                                        <span>Read Article</span>
                                                        <ArrowUpRight className="w-3 h-3 text-[#d4ff00] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                                    </div>
                                                </div>
                                            </Link>
                                        ))
                                    ) : (
                                        <div className="p-6 text-center space-y-3 rounded-2xl bg-white/[0.02] border border-white/5">
                                            <BookOpen className="w-8 h-8 text-neutral-600 mx-auto" />
                                            <p className="text-xs font-mono text-neutral-400">
                                                No additional blogs available.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Sidebar Footer Link */}
                                <div className="pt-2 relative z-10">
                                    <Link
                                        href="/blog"
                                        className="w-full h-10 rounded-xl bg-white/5 hover:bg-[#d4ff00] text-neutral-300 hover:text-black border border-white/10 hover:border-[#d4ff00] font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all duration-300 group"
                                    >
                                        <span>Explore Complete Journal</span>
                                        <ArrowUpRight className="w-3.5 h-3.5 text-[#d4ff00] group-hover:text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>

            {/* CONTINUED READING / EXPLORATION STRIP */}
            <section className="py-16 sm:py-20 bg-[#07080b] border-t border-white/10 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[250px] bg-gradient-to-r from-[#d4ff00]/10 to-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-neutral-300">
                        <Sparkles className="w-3.5 h-3.5 text-[#d4ff00]" />
                        <span>CONTINUE EXPLORING ARCHITECTURAL BLOGS</span>
                    </div>

                    <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
                        Dive Deeper Into Kinetic Code & Brand Gravity
                    </h2>

                    <p className="max-w-2xl mx-auto text-sm sm:text-base text-neutral-400 font-light leading-relaxed">
                        Browse our full archive of long-form essays, system post-mortems, and engineering manifestos.
                    </p>

                    <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                        <Link
                            href="/blog"
                            className="px-6 py-3 rounded-full bg-[#d4ff00] hover:bg-[#b8dd00] text-black font-mono text-xs font-bold transition-all shadow-[0_0_20px_rgba(212,255,0,0.3)] inline-flex items-center gap-2"
                        >
                            <span>Browse All Blogs</span>
                            <ArrowUpRight className="w-4 h-4" />
                        </Link>

                        {blog.category && (
                            <Link
                                href={`/blog?category=${blog.category.slug}`}
                                className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-200 hover:text-white font-mono text-xs font-medium transition-all inline-flex items-center gap-2"
                            >
                                <span>More in {blog.category.name}</span>
                                <ArrowRight className="w-4 h-4 text-[#d4ff00]" />
                            </Link>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}
