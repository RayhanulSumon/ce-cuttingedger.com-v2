import React from 'react';
import { Link } from '@inertiajs/react';
import { SeoHead } from '@/Components/Common/SeoHead';
import { PageHero } from '@/Components/Common/PageHero';
import { TeamMember } from '@/types/models';
import { ArrowUpRight } from 'lucide-react';

interface TeamIndexProps {
    members: TeamMember[];
}

export default function Index({ members = [] }: TeamIndexProps) {
    return (
        <>
            <SeoHead
                title="Leadership & Creative Fellows"
                description="Meet the founders, creative directors, and systems architects behind CuttingEdger."
            />

            <PageHero
                eyebrow="STUDIO COLLECTIVE"
                title="THE MINDS BEHIND"
                highlight="THE MACHINE."
                description="A multidisciplinary squad of senior designers, software architects, and brand strategists operating with zero corporate bloat."
            />

            <section className="py-24 bg-[#0a0b0e]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {members.map((member) => (
                            <Link
                                key={member.id || member.slug}
                                href={`/team/${member.slug}`}
                                className="group rounded-3xl bg-[#12141c] border border-white/10 overflow-hidden flex flex-col justify-between hover:border-[#d4ff00]/50 transition-all duration-300"
                            >
                                <div className="relative aspect-[4/5] bg-neutral-900 overflow-hidden">
                                    <img
                                        src={member.avatar}
                                        alt={member.name}
                                        loading="lazy"
                                        className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 ease-out"
                                    />
                                    <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[11px] font-mono uppercase tracking-wider text-[#d4ff00]">
                                        Since {member.since_year}
                                    </div>
                                    <div className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-[#d4ff00] text-black opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                                        <ArrowUpRight className="w-5 h-5" />
                                    </div>
                                </div>

                                <div className="p-6 space-y-2">
                                    <h3 className="font-display font-bold text-2xl text-white group-hover:text-[#d4ff00] transition-colors">
                                        {member.name}
                                    </h3>
                                    <p className="font-mono text-xs text-neutral-400">
                                        {member.role}
                                    </p>
                                    <p className="text-xs text-neutral-500 line-clamp-2 pt-2 leading-relaxed">
                                        {member.bio}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
