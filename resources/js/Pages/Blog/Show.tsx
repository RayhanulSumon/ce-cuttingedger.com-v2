import React from 'react';
import { Link } from '@inertiajs/react';
import { SeoHead } from '@/Components/Common/SeoHead';
import { PageHero } from '@/Components/Common/PageHero';
import { Blog } from '@/types/models';
import { Clock, Calendar, ArrowUpRight, Share2, Tag, CornerDownRight } from 'lucide-react';

interface BlogShowProps {
    blog: Blog;
    relatedBlogs: Blog[];
}

export default function Show({ blog, relatedBlogs = [] }: BlogShowProps) {
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

            <PageHero
                eyebrow={`DISPATCH // ${blog.category?.name || 'EDITORIAL'}${blog.subcategory ? ` // ${blog.subcategory.name}` : ''}`}
                title={blog.title}
                description={blog.excerpt}
                backUrl="/blog"
                backLabel="Back to Journal"
            />

            {/* Article Meta Strip */}
            <section className="py-6 bg-[#0c0d12] border-b border-white/10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-neutral-400">
                        <div className="flex items-center gap-6">
                            <span className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4 text-[#d4ff00]" />
                                {blog.reading_time} min read
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4 text-[#d4ff00]" />
                                {blog.published_at
                                    ? new Date(blog.published_at).toLocaleDateString('en-US', {
                                          month: 'long',
                                          day: 'numeric',
                                          year: 'numeric',
                                      })
                                    : 'Draft Preview'}
                            </span>
                        </div>

                        {blog.author && (
                            <Link
                                href={`/team/${blog.author.slug}`}
                                className="flex items-center gap-2 hover:text-[#d4ff00] transition-colors"
                            >
                                <img
                                    src={blog.author.avatar}
                                    alt={blog.author.name}
                                    className="w-6 h-6 rounded-full object-cover border border-white/10"
                                />
                                <span>
                                    {blog.author.name} ({blog.author.role})
                                </span>
                            </Link>
                        )}
                    </div>
                </div>
            </section>

            {/* Featured Cover Image */}
            <section className="py-12 bg-[#0a0b0e]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="rounded-3xl overflow-hidden aspect-[16/9] border border-white/10 bg-neutral-900 shadow-2xl">
                        <img
                            src={blog.cover_image}
                            alt={blog.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </section>

            {/* Main Article Body Content */}
            <article className="py-12 bg-[#0a0b0e]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Render paragraphs, headers, and code */}
                    <div className="prose prose-invert prose-lg max-w-none text-neutral-300 leading-relaxed space-y-6">
                        {blog.body.split('\n\n').map((block, idx) => {
                            const trimmed = block.trim();
                            if (trimmed.startsWith('# ')) {
                                return (
                                    <h2 key={idx} className="text-3xl font-display font-bold text-white pt-6 pb-2 border-b border-white/10">
                                        {trimmed.replace(/^#\s+/, '')}
                                    </h2>
                                );
                            }
                            if (trimmed.startsWith('## ')) {
                                return (
                                    <h3 key={idx} className="text-2xl font-display font-bold text-[#d4ff00] pt-4">
                                        {trimmed.replace(/^##\s+/, '')}
                                    </h3>
                                );
                            }
                            if (trimmed.startsWith('### ')) {
                                return (
                                    <h4 key={idx} className="text-xl font-display font-semibold text-white pt-2">
                                        {trimmed.replace(/^###\s+/, '')}
                                    </h4>
                                );
                            }
                            if (trimmed.startsWith('> ')) {
                                return (
                                    <blockquote key={idx} className="border-l-2 border-[#d4ff00] pl-6 py-2 my-6 font-display italic text-xl text-neutral-200 bg-white/[0.02] rounded-r-lg">
                                        {trimmed.replace(/^>\s+/, '')}
                                    </blockquote>
                                );
                            }
                            if (trimmed.startsWith('```')) {
                                const codeContent = trimmed.replace(/^```[a-z]*\n?/, '').replace(/\n?```$/, '');
                                return (
                                    <pre key={idx} className="p-4 rounded-xl bg-[#08090d] border border-white/10 font-mono text-sm text-[#d4ff00] overflow-x-auto">
                                        <code>{codeContent}</code>
                                    </pre>
                                );
                            }
                            return (
                                <p key={idx} className="text-lg sm:text-xl font-normal leading-relaxed text-neutral-300">
                                    {trimmed}
                                </p>
                            );
                        })}
                    </div>

                    {/* Tags section */}
                    {Array.isArray(blog.tags) && blog.tags.length > 0 && (
                        <div className="mt-12 pt-6 border-t border-white/10 flex flex-wrap items-center gap-2">
                            <span className="text-xs font-mono text-neutral-500 uppercase flex items-center gap-1 mr-2">
                                <Tag className="w-3.5 h-3.5 text-[#d4ff00]" />
                                Topics:
                            </span>
                            {blog.tags.map((tag, i) => (
                                <span
                                    key={i}
                                    className="text-xs font-mono px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Author Profile Footer Card */}
                    {blog.author && (
                        <div className="mt-16 p-8 rounded-3xl bg-[#12141c] border border-white/10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                            <img
                                src={blog.author.avatar}
                                alt={blog.author.name}
                                className="w-16 h-16 rounded-2xl object-cover border border-[#d4ff00]/40 shrink-0"
                            />
                            <div className="space-y-2 text-center sm:text-left">
                                <span className="font-mono text-xs uppercase tracking-widest text-[#d4ff00]">
                                    Authored By
                                </span>
                                <h4 className="font-display font-bold text-xl text-white">
                                    {blog.author.name}
                                </h4>
                                <p className="text-sm text-neutral-400">
                                    {blog.author.bio}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </article>

            {/* Related Blogs */}
            {relatedBlogs.length > 0 && (
                <section className="py-24 bg-[#0c0d12] border-t border-white/10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between mb-12">
                            <span className="font-mono text-xs uppercase tracking-widest text-[#d4ff00]">
                                [ CONTINUED READING ]
                            </span>
                            <Link
                                href="/blog"
                                className="font-mono text-xs uppercase tracking-widest text-neutral-400 hover:text-[#d4ff00] transition-colors"
                            >
                                All Journal Entries →
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {relatedBlogs.map((rel) => (
                                <Link
                                    key={rel.id}
                                    href={`/blog/${rel.slug}`}
                                    className="group rounded-3xl bg-[#12141c] border border-white/10 overflow-hidden hover:border-[#d4ff00]/40 transition-colors"
                                >
                                    <div className="aspect-[16/9] bg-neutral-900 overflow-hidden">
                                        <img
                                            src={rel.cover_image}
                                            alt={rel.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-6 space-y-2">
                                        <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                                            <span className="text-[#d4ff00]">
                                                {rel.category?.name || 'Dispatch'}
                                            </span>
                                            <span>{rel.reading_time} min read</span>
                                        </div>
                                        <h3 className="text-xl font-display font-bold text-white group-hover:text-[#d4ff00] transition-colors line-clamp-2">
                                            {rel.title}
                                        </h3>
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
