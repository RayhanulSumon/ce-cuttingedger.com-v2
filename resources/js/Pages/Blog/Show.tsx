import React from 'react';
import { Link } from '@inertiajs/react';
import { SeoHead } from '@/Components/Common/SeoHead';
import { PageHero } from '@/Components/Common/PageHero';
import { Post } from '@/types/models';
import { Clock, Calendar, ArrowUpRight, Share2 } from 'lucide-react';

interface BlogShowProps {
    post: Post;
    relatedPosts: Post[];
}

export default function Show({ post, relatedPosts = [] }: BlogShowProps) {
    const articleJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.excerpt,
        image: post.cover_image,
        author: {
            '@type': 'Person',
            name: post.author?.name || 'CuttingEdger Lead',
        },
        publisher: {
            '@type': 'Organization',
            name: 'CuttingEdger',
            logo: {
                '@type': 'ImageObject',
                url: 'https://cuttingedger.com/logo.png',
            },
        },
        datePublished: post.published_at,
    };

    return (
        <>
            <SeoHead
                title={post.title}
                description={post.excerpt}
                image={post.cover_image}
                type="article"
                jsonLd={articleJsonLd}
            />

            <PageHero
                eyebrow={`DISPATCH // ${post.category?.name || 'THEORY'}`}
                title={post.title}
                description={post.excerpt}
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
                                {post.reading_time} min read
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4 text-[#d4ff00]" />
                                {new Date(post.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </span>
                        </div>

                        {post.author && (
                            <Link
                                href={`/team/${post.author.slug}`}
                                className="flex items-center gap-2 hover:text-[#d4ff00] transition-colors"
                            >
                                <img
                                    src={post.author.avatar}
                                    alt={post.author.name}
                                    className="w-6 h-6 rounded-full object-cover border border-white/10"
                                />
                                <span>{post.author.name} ({post.author.role})</span>
                            </Link>
                        )}
                    </div>
                </div>
            </section>

            {/* Featured Image */}
            <section className="py-12 bg-[#0a0b0e]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="rounded-3xl overflow-hidden aspect-[16/9] border border-white/10 bg-neutral-900 shadow-2xl">
                        <img
                            src={post.cover_image}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </section>

            {/* Main Article Body Content */}
            <article className="py-12 bg-[#0a0b0e]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="prose prose-invert prose-lg max-w-none text-neutral-300 leading-relaxed space-y-6">
                        {post.body.split('\n\n').map((paragraph, idx) => (
                            <p key={idx} className="text-lg sm:text-xl font-normal leading-relaxed">
                                {paragraph}
                            </p>
                        ))}
                    </div>

                    {/* Author Footer Card */}
                    {post.author && (
                        <div className="mt-16 p-8 rounded-3xl bg-[#12141c] border border-white/10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                            <img
                                src={post.author.avatar}
                                alt={post.author.name}
                                className="w-16 h-16 rounded-2xl object-cover border border-[#d4ff00]/40 shrink-0"
                            />
                            <div className="space-y-2 text-center sm:text-left">
                                <span className="font-mono text-xs uppercase tracking-widest text-[#d4ff00]">
                                    Written By
                                </span>
                                <h4 className="font-display font-bold text-xl text-white">
                                    {post.author.name}
                                </h4>
                                <p className="text-sm text-neutral-400">
                                    {post.author.bio}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </article>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {relatedPosts.map((rel) => (
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
                                    <div className="p-6">
                                        <span className="text-xs font-mono text-neutral-400 block mb-1">
                                            {rel.reading_time} min read
                                        </span>
                                        <h3 className="text-2xl font-display font-bold text-white group-hover:text-[#d4ff00] transition-colors">
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
