import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { SeoHead } from '@/Components/Common/SeoHead';
import { SocialIcon } from '@/Components/Landing/SocialIcon';
import { PageProps } from '@/types';
import { Blog } from '@/types/models';
import {
    ArrowUpRight,
    Calendar,
    Check,
    ChevronLeft,
    ChevronRight,
    Copy,
    ExternalLink,
    Heart,
    Mail,
    Quote,
    Share2,
    User,
} from 'lucide-react';

type AdjacentBlog = Pick<Blog, 'id' | 'title' | 'slug' | 'cover_image' | 'published_at'>;

interface BlogShowProps {
    blog: Blog;
    relatedBlogs: Blog[];
    previousBlog?: AdjacentBlog | null;
    nextBlog?: AdjacentBlog | null;
}

interface TocItem {
    id: string;
    label: string;
    level: number;
}

interface ServiceSlide {
    id: string | number;
    tag: string;
    title: string;
    subtitle: string;
    href: string;
    image: string;
}

const FALLBACK_SERVICE_IMAGES = [
    '/images/portfolio/portfolio-1.webp',
    '/images/portfolio/portfolio-2.webp',
    '/images/portfolio/portfolio-3.webp',
    '/images/portfolio/portfolio-4.webp',
];

const DEFAULT_SOCIALS = [
    { name: 'LinkedIn', url: 'https://www.linkedin.com/company/cutting-edger/' },
    { name: 'Instagram', url: 'https://www.instagram.com/cuttingedgerinc/' },
    { name: 'YouTube', url: 'https://www.youtube.com/channel/UCJS-gaoOogk-552jQfRYPBQ' },
    { name: 'X', url: 'https://x.com/cutting_edger' },
    { name: 'Behance', url: 'https://www.behance.net/3dartist7/' },
    { name: 'Pinterest', url: 'https://www.pinterest.com/CuttingEdgerTeam2019/' },
];

const FALLBACK_SERVICES: ServiceSlide[] = [
    {
        id: 'fallback-2d',
        tag: '2D Studio',
        title: '2D Retouching & Post-Production',
        subtitle: 'Clean, consistent product and model imagery edited by hand and verified twice.',
        href: '/capabilities/2d',
        image: '/images/portfolio/portfolio-1.jpg',
    },
    {
        id: 'fallback-3d',
        tag: '3D & CGI',
        title: '3D Modeling & Virtual Staging',
        subtitle: 'Photorealistic product renders, lookbooks, and architectural scenes at scale.',
        href: '/capabilities/3d',
        image: '/images/portfolio/portfolio-2.jpg',
    },
    {
        id: 'fallback-dtp',
        tag: 'DTP & Layout',
        title: 'Desktop Publishing & Catalogs',
        subtitle: 'Print-ready lookbooks, packaging artwork, and automated multi-language layouts.',
        href: '/capabilities/dtp',
        image: '/images/portfolio/portfolio-3.jpg',
    },
    {
        id: 'fallback-video',
        tag: 'Video',
        title: 'Video Editing & Motion',
        subtitle: 'High-impact e-commerce video reels, color grading, and campaign cutdowns.',
        href: '/capabilities/video',
        image: '/images/portfolio/portfolio-4.jpg',
    },
];

function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function stripHtmlTags(html: string): string {
    return html.replace(/<[^>]*>/g, '').trim();
}

function extractTableOfContents(body: string): TocItem[] {
    if (!body) {
        return [];
    }

    const withoutCodeBlocks = body.replace(/```[\s\S]*?```/g, '');
    const items: TocItem[] = [];
    const seenIds = new Map<string, number>();

    const registerHeading = (rawTitle: string, level: number) => {
        const cleanTitle = stripHtmlTags(rawTitle).replace(/[*_`]/g, '').trim();
        if (!cleanTitle) {
            return;
        }
        const baseId = slugify(cleanTitle) || `section-${items.length + 1}`;
        const count = (seenIds.get(baseId) ?? 0) + 1;
        seenIds.set(baseId, count);
        const id = count > 1 ? `${baseId}-${count}` : baseId;
        items.push({ id, label: cleanTitle, level });
    };

    const lines = withoutCodeBlocks.split('\n');
    for (const line of lines) {
        const trimmed = line.trim();
        const mdMatch = trimmed.match(/^(#{1,3})\s+(.+)$/);
        if (mdMatch) {
            registerHeading(mdMatch[2], mdMatch[1].length);
            continue;
        }

        const htmlRegex = /<h([1-3])(?:\s[^>]*)?>([\s\S]*?)<\/h\1>/gi;
        let htmlMatch: RegExpExecArray | null;
        while ((htmlMatch = htmlRegex.exec(trimmed)) !== null) {
            registerHeading(htmlMatch[2], Number(htmlMatch[1]));
        }
    }

    return items;
}

function injectHtmlHeadingIds(html: string): string {
    return html.replace(/<h([1-3])([^>]*)>([\s\S]*?)<\/h\1>/gi, (fullMatch, level, attrs, inner) => {
        if (/\sid\s*=/.test(attrs)) {
            return fullMatch;
        }
        const id = slugify(stripHtmlTags(inner));
        if (!id) {
            return fullMatch;
        }
        return `<h${level}${attrs} id="${id}">${inner}</h${level}>`;
    });
}

function renderInlineFormatting(text: string): React.ReactNode {
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`|\[.*?\]\(.*?\))/g);

    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return (
                <strong key={index} className="text-ink font-semibold">
                    {part.slice(2, -2)}
                </strong>
            );
        }
        if (part.startsWith('*') && part.endsWith('*')) {
            return (
                <em key={index} className="italic text-ink-2">
                    {part.slice(1, -1)}
                </em>
            );
        }
        if (part.startsWith('`') && part.endsWith('`')) {
            return (
                <code
                    key={index}
                    className="px-1.5 py-0.5 rounded bg-page text-primary-ink border border-ink/10 text-[0.875em]"
                >
                    {part.slice(1, -1)}
                </code>
            );
        }
        const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
        if (linkMatch) {
            const [, linkText, linkUrl] = linkMatch;
            const isExternal = linkUrl.startsWith('http');
            if (!isExternal && linkUrl.startsWith('/')) {
                return (
                    <Link
                        key={index}
                        href={linkUrl}
                        prefetch
                        className="text-primary-ink underline decoration-primary/40 hover:decoration-primary underline-offset-4 transition-colors font-medium inline-flex items-center gap-0.5"
                    >
                        <span>{linkText}</span>
                    </Link>
                );
            }
            return (
                <a
                    key={index}
                    href={linkUrl}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    className="text-primary-ink underline decoration-primary/40 hover:decoration-primary underline-offset-4 transition-colors font-medium inline-flex items-center gap-0.5"
                >
                    <span>{linkText}</span>
                    {isExternal && <ExternalLink className="w-3 h-3 inline-block" />}
                </a>
            );
        }
        return part;
    });
}

function CodeBlock({ code, language }: { code: string; language?: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="my-6 rounded-2xl overflow-hidden border border-ink/15 bg-secondary shadow-md">
            <div className="flex items-center justify-between px-4 py-2.5 bg-black/25 border-b border-white/10 text-xs font-mono text-white/75">
                <div className="flex items-center gap-2">
                    <span className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-danger/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-warning/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-success/80" />
                    </span>
                    <span className="ml-2 uppercase text-2xs font-semibold text-primary">
                        {language || 'CODE SNIPPET'}
                    </span>
                </div>
                <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 hover:bg-white/15 text-white/85 hover:text-white transition-colors cursor-pointer text-2xs"
                    title="Copy snippet"
                >
                    {copied ? (
                        <>
                            <Check className="w-3.5 h-3.5 text-success" />
                            <span className="text-success font-bold">Copied!</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                        </>
                    )}
                </button>
            </div>
            <pre className="p-5 font-mono text-xs sm:text-sm text-secondary-foreground overflow-x-auto leading-relaxed">
                <code>{code}</code>
            </pre>
        </div>
    );
}

function ServiceCardSlider({ slides }: { slides: ServiceSlide[] }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        if (slides.length <= 1 || paused) {
            return;
        }
        const timer = window.setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => window.clearInterval(timer);
    }, [slides.length, paused]);

    const current = slides[activeIndex] ?? slides[0];
    if (!current) {
        return null;
    }

    const prevSlide = () => setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
    const nextSlide = () => setActiveIndex((prev) => (prev + 1) % slides.length);

    return (
        <div
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            className="rounded-2xl bg-surface border border-ink/10 overflow-hidden shadow-sm"
        >
            <div className="relative aspect-[16/11] bg-secondary overflow-hidden">
                <img
                    src={current.image}
                    alt={current.title}
                    className="w-full h-full object-cover transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 pointer-events-none" />

                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2 z-10">
                    <span className="px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-2xs font-bold uppercase tracking-wider shadow-xs">
                        {current.tag}
                    </span>

                    {slides.length > 1 && (
                        <div className="flex items-center gap-1.5">
                            <button
                                type="button"
                                onClick={prevSlide}
                                aria-label="Previous service"
                                className="w-7 h-7 rounded-full bg-black/50 hover:bg-primary text-primary-foreground flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={nextSlide}
                                aria-label="Next service"
                                className="w-7 h-7 rounded-full bg-black/50 hover:bg-primary text-primary-foreground flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>

                <div className="absolute bottom-3.5 left-4 right-4 z-10 text-white">
                    <h4 className="text-base sm:text-lg font-display font-bold leading-snug">
                        {current.title}
                    </h4>
                    <p className="mt-1 text-xs text-white/80 line-clamp-2 leading-relaxed">
                        {current.subtitle}
                    </p>
                    <Link
                        href={current.href}
                        prefetch
                        className="mt-2.5 inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-white transition-colors"
                    >
                        <span>Explore Service</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>

            {slides.length > 1 && (
                <div className="px-4 py-2.5 bg-surface border-t border-ink/10 flex items-center justify-between">
                    <span className="text-2xs font-medium text-subtle uppercase tracking-wider">
                        Our Capabilities
                    </span>
                    <div className="flex items-center gap-1.5">
                        {slides.map((slide, idx) => (
                            <button
                                key={slide.id}
                                type="button"
                                onClick={() => setActiveIndex(idx)}
                                aria-label={`Show ${slide.title}`}
                                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                                    idx === activeIndex ? 'w-5 bg-primary' : 'w-1.5 bg-ink/20 hover:bg-ink/40'
                                }`}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function Show({
    blog,
    relatedBlogs = [],
    previousBlog = null,
    nextBlog = null,
}: BlogShowProps) {
    const { settings, capabilities_nav = [] } = usePage<PageProps>().props;
    const [copiedLink, setCopiedLink] = useState(false);
    const [readingProgress, setReadingProgress] = useState(0);

    const likeStorageKey = `ce_blog_like_${blog.slug}`;
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(() => 18 + ((blog.id || 1) % 15));

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }
        const storedLiked = window.localStorage.getItem(likeStorageKey) === '1';
        setLiked(storedLiked);
        const baseCount = 18 + ((blog.id || 1) % 15);
        setLikesCount(storedLiked ? baseCount + 1 : baseCount);
    }, [blog.id, likeStorageKey]);

    const handleToggleLike = () => {
        const nextLiked = !liked;
        setLiked(nextLiked);
        setLikesCount((prev) => (nextLiked ? prev + 1 : Math.max(0, prev - 1)));
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(likeStorageKey, nextLiked ? '1' : '0');
        }
    };

    const { data, setData, post, processing, errors, reset } = useForm({ email: '' });
    const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

    const handleNewsletterSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        post('/newsletter', {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                reset('email');
                setNewsletterSubscribed(true);
            },
        });
    };

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

    const shareUrl =
        typeof window !== 'undefined'
            ? window.location.href
            : `https://cuttingedger.com/blog/${blog.slug}`;

    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(shareUrl)}`;
    const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    const pinterestShareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&media=${encodeURIComponent(blog.cover_image || '')}&description=${encodeURIComponent(blog.title)}`;
    const emailShareUrl = `mailto:?subject=${encodeURIComponent(blog.title)}&body=${encodeURIComponent(shareUrl)}`;

    const formattedPublishDate = useMemo(() => {
        if (!blog.published_at) {
            return 'Editorial Dispatch';
        }
        return new Date(blog.published_at).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    }, [blog.published_at]);

    const tocItems = useMemo(() => {
        const parsed = extractTableOfContents(blog.body);
        if (parsed.length > 0) {
            return parsed;
        }
        return [
            { id: 'article-content', label: 'Article Overview', level: 2 },
            { id: 'author-bio', label: 'About the Author', level: 2 },
            ...(relatedBlogs.length > 0 ? [{ id: 'related-posts', label: 'Related Posts', level: 2 }] : []),
        ];
    }, [blog.body, relatedBlogs.length]);

    const serviceSlides: ServiceSlide[] = useMemo(() => {
        if (!capabilities_nav || capabilities_nav.length === 0) {
            return FALLBACK_SERVICES;
        }

        return capabilities_nav.map((cap, idx) => ({
            id: cap.id,
            tag: cap.tag || 'Service',
            title: cap.title,
            subtitle: cap.subtitle,
            href: cap.path || `/capabilities/${cap.slug}`,
            image: cap.image || FALLBACK_SERVICE_IMAGES[idx % FALLBACK_SERVICE_IMAGES.length],
        }));
    }, [capabilities_nav]);

    const socials = useMemo(() => {
        const configured = Object.entries(settings?.socials ?? {})
            .filter(([, url]) => Boolean(url))
            .map(([name, url]) => ({
                name: name.charAt(0).toUpperCase() + name.slice(1),
                url: url as string,
            }));

        return configured.length > 0 ? configured : DEFAULT_SOCIALS;
    }, [settings?.socials]);

    const handleTocClick = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        const target = document.getElementById(id);
        if (target) {
            event.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const articleJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: blog.meta_title || blog.title,
        description: blog.meta_description || blog.excerpt,
        image: blog.og_image || blog.cover_image,
        keywords: blog.meta_keywords || (Array.isArray(blog.tags) ? blog.tags.join(', ') : ''),
        author: {
            '@type': 'Person',
            name: blog.author?.name || 'CE Production',
        },
        publisher: {
            '@type': 'Organization',
            name: 'CuttingEdger',
            logo: {
                '@type': 'ImageObject',
                url: 'https://cuttingedger.com/images/ce/ce_logo_word.png',
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
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: 'Blog', url: '/blog' },
                    { name: blog.title, url: `/blog/${blog.slug}` },
                ]}
                jsonLd={articleJsonLd}
            />

            {/* Scroll Reading Progress Bar */}
            <div className="fixed top-0 left-0 right-0 h-[3px] bg-transparent z-[60] pointer-events-none">
                <div
                    className="h-full bg-primary shadow-[0_0_12px_rgba(245,118,26,0.75)] transition-all duration-100 ease-out"
                    style={{ width: `${readingProgress}%` }}
                />
            </div>

            {/* TOP FULL-WIDTH HERO BANNER */}
            <header className="relative min-h-[360px] sm:min-h-[440px] lg:min-h-[480px] flex items-center overflow-hidden bg-secondary pt-28 pb-12 sm:pb-16">
                {blog.cover_image ? (
                    <img
                        src={blog.cover_image}
                        alt={blog.title}
                        className="absolute inset-0 w-full h-full object-cover object-center"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary to-primary/30" />
                )}

                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/40 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

                <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-10">
                    <h1 className="max-w-3xl text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-white leading-[1.15] tracking-tight">
                        {blog.title}
                    </h1>

                    <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm font-medium text-white/90">
                        <span className="inline-flex items-center gap-1.5">
                            <User className="w-4 h-4 text-primary" />
                            <span>by {blog.author?.name || 'CE Production'}</span>
                        </span>
                        <span className="text-white/40">|</span>
                        <span className="inline-flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span>{formattedPublishDate}</span>
                        </span>
                    </div>
                </div>
            </header>

            {/* MAIN 2-COLUMN EDITORIAL SECTION */}
            <main className="py-12 sm:py-16 bg-page">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                        {/* LEFT COLUMN: ARTICLE BODY, AUTHOR CARD, SHARE BAR */}
                        <div className="lg:col-span-8 space-y-6 min-w-0">
                            <article
                                id="article-content"
                                className="rounded-3xl bg-surface border border-ink/10 p-6 sm:p-10 lg:p-12 shadow-sm"
                            >
                                <div className="space-y-6 text-ink-2 font-sans text-base sm:text-lg leading-[1.85] font-normal">
                                    {blog.body.split('\n\n').map((block, idx) => {
                                        const trimmed = block.trim();
                                        if (!trimmed) {
                                            return null;
                                        }

                                        // Raw HTML block support with injected anchor IDs on headings
                                        if (trimmed.startsWith('<') && trimmed.endsWith('>')) {
                                            const htmlWithIds = injectHtmlHeadingIds(trimmed);
                                            return (
                                                <div
                                                    key={idx}
                                                    dangerouslySetInnerHTML={{ __html: htmlWithIds }}
                                                    className="prose-html space-y-4 [&_h1]:scroll-mt-28 [&_h1]:text-2xl [&_h1]:sm:text-3xl [&_h1]:font-display [&_h1]:font-extrabold [&_h1]:text-ink [&_h1]:pt-4 [&_h2]:scroll-mt-28 [&_h2]:text-xl [&_h2]:sm:text-2xl [&_h2]:font-display [&_h2]:font-bold [&_h2]:text-ink [&_h2]:pt-4 [&_h3]:scroll-mt-28 [&_h3]:text-lg [&_h3]:font-display [&_h3]:font-semibold [&_h3]:text-ink [&_h3]:pt-2 [&_a]:text-primary-ink [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_img]:rounded-2xl"
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
                                                    className="scroll-mt-28 text-2xl sm:text-3xl font-display font-extrabold text-ink pt-4 pb-2 border-b border-ink/10 group flex items-center justify-between"
                                                >
                                                    <span>{headingText}</span>
                                                    <a
                                                        href={`#${headingId}`}
                                                        className="opacity-0 group-hover:opacity-100 text-primary-ink text-sm transition-opacity ml-2"
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
                                                    className="scroll-mt-28 text-xl sm:text-2xl font-display font-bold text-ink pt-4 group flex items-center justify-between"
                                                >
                                                    <span>{headingText}</span>
                                                    <a
                                                        href={`#${headingId}`}
                                                        className="opacity-0 group-hover:opacity-100 text-primary-ink text-xs transition-opacity ml-2"
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
                                                    className="scroll-mt-28 text-lg sm:text-xl font-display font-semibold text-ink pt-3"
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
                                                    className="relative my-6 p-6 sm:p-7 rounded-2xl bg-page border-l-4 border-primary"
                                                >
                                                    <Quote className="w-7 h-7 text-primary/30 absolute top-4 right-4 pointer-events-none" />
                                                    <p className="font-display italic text-lg sm:text-xl text-ink leading-relaxed">
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
                                                .replace(/^```[a-zA-Z0-9_-]*\n?/, '')
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
                                                .map((line) => line.replace(/^[-*]\s+/, '').trim())
                                                .filter(Boolean);
                                            return (
                                                <ul key={idx} className="my-5 space-y-2.5 pl-1">
                                                    {items.map((item, itemIdx) => (
                                                        <li
                                                            key={itemIdx}
                                                            className="flex items-start gap-3 text-ink-2"
                                                        >
                                                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                                                            <span className="flex-1">
                                                                {renderInlineFormatting(item)}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            );
                                        }

                                        // Standard Paragraph
                                        return (
                                            <p key={idx} className="leading-relaxed">
                                                {renderInlineFormatting(trimmed)}
                                            </p>
                                        );
                                    })}
                                </div>

                                {/* Optional Tags Row */}
                                {Array.isArray(blog.tags) && blog.tags.length > 0 && (
                                    <div className="mt-10 pt-6 border-t border-ink/10 flex flex-wrap items-center gap-2">
                                        {blog.tags.map((tag, i) => (
                                            <Link
                                                key={i}
                                                href="/blog"
                                                prefetch
                                                className="px-3 py-1 rounded-full bg-page hover:bg-primary/10 border border-ink/10 hover:border-primary/40 text-xs font-medium text-muted hover:text-primary-ink transition-colors"
                                            >
                                                #{tag}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </article>

                            {/* AUTHOR BIO CARD */}
                            <section
                                id="author-bio"
                                className="rounded-2xl bg-surface border border-ink/10 p-6 sm:p-7 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-5"
                            >
                                {blog.author?.avatar ? (
                                    <img
                                        src={blog.author.avatar}
                                        alt={blog.author.name}
                                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border border-ink/15 shrink-0"
                                    />
                                ) : (
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary-ink font-display font-bold text-xl shrink-0">
                                        {(blog.author?.name || 'C').charAt(0)}
                                    </div>
                                )}

                                <div className="text-center sm:text-left space-y-1.5 flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1">
                                        {blog.author?.slug ? (
                                            <Link
                                                href={`/team/${blog.author.slug}`}
                                                prefetch
                                                className="text-base sm:text-lg font-display font-bold text-ink hover:text-primary-ink transition-colors"
                                            >
                                                {blog.author.name}
                                            </Link>
                                        ) : (
                                            <h3 className="text-base sm:text-lg font-display font-bold text-ink">
                                                {blog.author?.name || 'CE Production'}
                                            </h3>
                                        )}
                                        {blog.author?.role && (
                                            <span className="text-xs font-medium text-primary-ink">
                                                {blog.author.role}
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-xs sm:text-sm text-muted leading-relaxed">
                                        {blog.author?.bio ||
                                            'Visual production specialists and creative engineers at CuttingEdger sharing insights on 2D retouching, 3D CGI, and high-volume e-commerce workflows.'}
                                    </p>
                                </div>
                            </section>

                            {/* SHARE BAR */}
                            <div className="rounded-2xl bg-surface border border-ink/10 px-5 py-3.5 shadow-sm flex flex-wrap items-center justify-between gap-4">
                                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-ink">
                                    <Share2 className="w-4 h-4 text-ink" />
                                    <span>Share</span>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={handleToggleLike}
                                        aria-pressed={liked}
                                        className={`h-9 px-3 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                                            liked
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-ink text-surface hover:bg-primary hover:text-primary-foreground'
                                        }`}
                                        title="Like this article"
                                    >
                                        <span>{likesCount}</span>
                                        <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-current' : ''}`} />
                                    </button>

                                    <a
                                        href={facebookShareUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Share on Facebook"
                                        title="Share on Facebook"
                                        className="w-9 h-9 rounded-lg bg-ink text-surface hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
                                    >
                                        <SocialIcon name="facebook" size={14} />
                                    </a>

                                    <a
                                        href={twitterShareUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Share on X"
                                        title="Share on X"
                                        className="w-9 h-9 rounded-lg bg-ink text-surface hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
                                    >
                                        <SocialIcon name="twitter" size={14} />
                                    </a>

                                    <a
                                        href={linkedinShareUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Share on LinkedIn"
                                        title="Share on LinkedIn"
                                        className="w-9 h-9 rounded-lg bg-ink text-surface hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
                                    >
                                        <SocialIcon name="linkedin" size={14} />
                                    </a>

                                    <a
                                        href={pinterestShareUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Share on Pinterest"
                                        title="Share on Pinterest"
                                        className="w-9 h-9 rounded-lg bg-ink text-surface hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
                                    >
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
                                            <path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29-.09-.78-.17-1.98.04-2.83.18-.77 1.18-5.01 1.18-5.01s-.3-.6-.3-1.49c0-1.4.81-2.44 1.82-2.44.86 0 1.27.64 1.27 1.42 0 .86-.55 2.15-.84 3.35-.24 1 .5 1.82 1.49 1.82 1.79 0 3.17-1.89 3.17-4.61 0-2.41-1.73-4.1-4.21-4.1-2.87 0-4.55 2.15-4.55 4.37 0 .86.33 1.79.75 2.3.08.1.09.19.07.29-.08.31-.25 1-.28 1.14-.04.18-.14.22-.33.13-1.24-.58-2.01-2.39-2.01-3.85 0-3.13 2.28-6.01 6.57-6.01 3.45 0 6.13 2.46 6.13 5.75 0 3.43-2.16 6.19-5.16 6.19-1.01 0-1.96-.52-2.28-1.14l-.62 2.37c-.22.86-.83 1.94-1.24 2.6.93.29 1.92.44 2.95.44 5.52 0 10-4.48 10-10S17.52 2 12 2z" />
                                        </svg>
                                    </a>

                                    <a
                                        href={emailShareUrl}
                                        aria-label="Share via Email"
                                        title="Share via Email"
                                        className="w-9 h-9 rounded-lg bg-ink text-surface hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
                                    >
                                        <Mail className="w-3.5 h-3.5" />
                                    </a>

                                    <button
                                        type="button"
                                        onClick={handleCopyUrl}
                                        aria-label="Copy article link"
                                        title="Copy article link"
                                        className="w-9 h-9 rounded-lg bg-ink text-surface hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors cursor-pointer"
                                    >
                                        {copiedLink ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT SIDEBAR: TOC, SERVICE SLIDER, CONNECT & NEWSLETTER */}
                        <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
                            {/* Widget 1: Table of Content */}
                            <div className="rounded-2xl bg-surface border border-ink/10 p-6 shadow-sm">
                                <h3 className="text-sm font-display font-bold text-ink pb-3 mb-2 border-b border-ink/10">
                                    Table of Content
                                </h3>
                                <nav aria-label="Table of contents">
                                    {tocItems.map((item) => (
                                        <a
                                            key={item.id}
                                            href={`#${item.id}`}
                                            onClick={(event) => handleTocClick(event, item.id)}
                                            className={`block border-b border-ink/10 py-2.5 last:border-b-0 text-xs sm:text-sm text-ink-2 hover:text-primary-ink transition-colors ${
                                                item.level >= 3 ? 'pl-3 text-muted' : ''
                                            }`}
                                        >
                                            {item.label}
                                        </a>
                                    ))}
                                </nav>
                            </div>

                            {/* Widget 2: Service Card Slider */}
                            <ServiceCardSlider slides={serviceSlides} />

                            {/* Widget 3: Connect & Follow + Newsletter */}
                            <div className="rounded-2xl bg-surface border border-ink/10 p-6 shadow-sm space-y-6">
                                <div className="space-y-4">
                                    <div className="bg-ink text-white text-center py-2.5 px-4 rounded-lg text-2xs font-bold uppercase tracking-[0.2em]">
                                        Connect &amp; Follow
                                    </div>

                                    <ul className="flex items-center justify-center flex-wrap gap-2.5">
                                        {socials.map((social) => (
                                            <li key={social.name}>
                                                <a
                                                    href={social.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    aria-label={social.name}
                                                    title={social.name}
                                                    className="w-9 h-9 rounded-full border border-ink/10 bg-page text-ink hover:bg-primary hover:text-primary-foreground hover:border-primary flex items-center justify-center transition-colors"
                                                >
                                                    <SocialIcon name={social.name} size={15} />
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="border-t border-ink/10 pt-6 text-center space-y-3">
                                    <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-ink">
                                        Newsletter
                                    </h4>
                                    <p className="text-xs text-muted leading-relaxed">
                                        Enter your email address below to subscribe to our newsletter
                                    </p>

                                    {newsletterSubscribed ? (
                                        <p
                                            role="status"
                                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-ink px-4 py-3 text-xs font-semibold text-white w-full"
                                        >
                                            <Check className="w-4 h-4 text-primary" />
                                            <span>You are subscribed!</span>
                                        </p>
                                    ) : (
                                        <form onSubmit={handleNewsletterSubmit} className="space-y-2.5">
                                            <label htmlFor="blog-sidebar-newsletter" className="sr-only">
                                                Email address
                                            </label>
                                            <input
                                                id="blog-sidebar-newsletter"
                                                type="email"
                                                required
                                                value={data.email}
                                                onChange={(event) => setData('email', event.target.value)}
                                                placeholder="Your email address"
                                                autoComplete="email"
                                                className="w-full rounded-lg border border-ink/15 bg-page px-3.5 py-2.5 text-sm text-ink placeholder:text-faint focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            />
                                            {errors.email && (
                                                <p className="text-xs text-danger text-left">{errors.email}</p>
                                            )}
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="w-full rounded-lg bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs uppercase tracking-[0.18em] py-3 transition-colors cursor-pointer disabled:opacity-60"
                                            >
                                                {processing ? 'Subscribing...' : 'Subscribe'}
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>

            {/* PREVIOUS POST / NEXT POST NAVIGATION STRIP */}
            {(previousBlog || nextBlog) && (
                <section className="bg-surface border-y border-ink/10 py-7 sm:py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                            {previousBlog ? (
                                <Link
                                    href={`/blog/${previousBlog.slug}`}
                                    prefetch
                                    className="group flex items-center gap-4 text-left"
                                >
                                    <ChevronLeft className="w-5 h-5 text-subtle group-hover:text-primary-ink group-hover:-translate-x-0.5 transition-all shrink-0" />
                                    {previousBlog.cover_image ? (
                                        <img
                                            src={previousBlog.cover_image}
                                            alt={previousBlog.title}
                                            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border border-ink/15 shrink-0"
                                        />
                                    ) : (
                                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-page border border-ink/15 shrink-0" />
                                    )}
                                    <div className="min-w-0">
                                        <span className="block text-xs font-medium text-subtle">
                                            Previous Post:
                                        </span>
                                        <span className="mt-0.5 block text-sm sm:text-base font-display font-bold text-ink group-hover:text-primary-ink transition-colors line-clamp-2">
                                            {previousBlog.title}
                                        </span>
                                    </div>
                                </Link>
                            ) : (
                                <div className="hidden md:block" />
                            )}

                            {nextBlog && (
                                <Link
                                    href={`/blog/${nextBlog.slug}`}
                                    prefetch
                                    className="group flex items-center justify-end gap-4 text-right md:col-start-2"
                                >
                                    <div className="min-w-0">
                                        <span className="block text-xs font-medium text-subtle">
                                            Next Post:
                                        </span>
                                        <span className="mt-0.5 block text-sm sm:text-base font-display font-bold text-ink group-hover:text-primary-ink transition-colors line-clamp-2">
                                            {nextBlog.title}
                                        </span>
                                    </div>
                                    {nextBlog.cover_image ? (
                                        <img
                                            src={nextBlog.cover_image}
                                            alt={nextBlog.title}
                                            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border border-ink/15 shrink-0"
                                        />
                                    ) : (
                                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-page border border-ink/15 shrink-0" />
                                    )}
                                    <ChevronRight className="w-5 h-5 text-subtle group-hover:text-primary-ink group-hover:translate-x-0.5 transition-all shrink-0" />
                                </Link>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* RELATED POSTS SECTION (3-COLUMN GRID) */}
            {relatedBlogs.length > 0 && (
                <section id="related-posts" className="bg-page py-14 sm:py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-xl sm:text-2xl font-display font-extrabold text-ink tracking-tight mb-7">
                            Related Posts:
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 sm:gap-8">
                            {relatedBlogs.slice(0, 3).map((related) => (
                                <Link
                                    key={related.id || related.slug}
                                    href={`/blog/${related.slug}`}
                                    prefetch
                                    className="group block space-y-3.5"
                                >
                                    <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-surface border border-ink/10 shadow-sm">
                                        <img
                                            src={related.cover_image}
                                            alt={related.title}
                                            loading="lazy"
                                            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                                        />
                                    </div>
                                    <h3 className="text-base sm:text-lg font-display font-bold text-ink group-hover:text-primary-ink transition-colors leading-snug line-clamp-2">
                                        {related.title}
                                    </h3>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}
