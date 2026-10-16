import React from 'react';
import { Link } from '@inertiajs/react';
import { SeoHead } from '@/Components/Common/SeoHead';
import { PageHero } from '@/Components/Common/PageHero';
import { TeamMember, Post } from '@/types/models';
import { ArrowUpRight } from 'lucide-react';

interface TeamShowProps {
    member: TeamMember & { posts?: Post[] };
}

export default function Show({ member }: TeamShowProps) {
    return (
        <>
            <SeoHead
                title={`${member.name} — ${member.role}`}
                description={member.bio}
                image={member.avatar}
            />

            <PageHero
                eyebrow={`COLLECTIVE // SINCE ${member.since_year}`}
                title={member.name}
                description={member.role}
                backUrl="/team"
                backLabel="Back to Collective"
            />

            <section className="py-20 bg-[#0a0b0e]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                        {/* Member Portrait */}
                        <div className="lg:col-span-5">
                            <div className="rounded-3xl overflow-hidden border border-white/10 bg-neutral-900 aspect-[4/5] shadow-2xl">
                                <img
                                    src={member.avatar}
                                    alt={member.name}
                                    className="w-full h-full object-cover contrast-110"
                                />
                            </div>

                            {/* Socials & Credentials */}
                            <div className="mt-6 p-6 rounded-2xl bg-[#12141c] border border-white/10 flex items-center justify-between">
                                <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
                                    Direct Channels
                                </span>
                                <div className="flex items-center gap-4 text-xs font-mono uppercase">
                                    {Object.entries(member.social_links || {}).map(([network, url]) => (
                                        <a
                                            key={network}
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-white hover:text-[#d4ff00] transition-colors"
                                        >
                                            {network}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Bio & Written Thoughts */}
                        <div className="lg:col-span-7 space-y-10">
                            <div className="space-y-4">
                                <span className="font-mono text-xs uppercase tracking-widest text-[#d4ff00]">
                                    [ BIOGRAPHY & BACKGROUND ]
                                </span>
                                <h2 className="text-3xl font-display font-bold text-white">
                                    Obsessed with high-velocity aesthetics.
                                </h2>
                                <p className="text-neutral-300 text-lg leading-relaxed">
                                    {member.bio}
                                </p>
                            </div>

                            {/* Authored Articles */}
                            {member.posts && member.posts.length > 0 && (
                                <div className="pt-8 border-t border-white/10 space-y-6">
                                    <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 block">
                                        Authored Articles & Research
                                    </span>
                                    <div className="space-y-4">
                                        {member.posts.map((post) => (
                                            <Link
                                                key={post.id}
                                                href={`/blog/${post.slug}`}
                                                className="group p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#d4ff00]/40 flex items-center justify-between transition-colors"
                                            >
                                                <div>
                                                    <h4 className="font-display font-bold text-white group-hover:text-[#d4ff00] transition-colors">
                                                        {post.title}
                                                    </h4>
                                                    <span className="text-xs font-mono text-neutral-500">
                                                        {post.reading_time} min read
                                                    </span>
                                                </div>
                                                <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-[#d4ff00]" />
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
