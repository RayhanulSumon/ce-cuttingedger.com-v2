import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowUpRight } from 'lucide-react';
import { TeamMember } from '@/types/models';

interface TeamPreviewProps {
    members: TeamMember[];
}

export function TeamPreview({ members }: TeamPreviewProps) {
    return (
        <section className="relative py-28 bg-[#0a0b0e] border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-white/10 gap-6">
                    <div>
                        <span className="font-mono text-xs uppercase tracking-widest text-[#d4ff00] block mb-3">
                            [ 05 // MINDS BEHIND THE MACHINE ]
                        </span>
                        <h2 className="text-4xl sm:text-6xl font-display font-extrabold text-white tracking-tight">
                            LEADERSHIP TEAM.
                        </h2>
                    </div>

                    <Link
                        href="/team"
                        className="group inline-flex items-center gap-2 text-sm font-mono uppercase tracking-wider text-neutral-400 hover:text-[#d4ff00] transition-colors"
                    >
                        <span>Meet All Fellows & Engineers</span>
                        <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </Link>
                </div>

                {/* 5 Member Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                    {members.slice(0, 5).map((member) => (
                        <Link
                            key={member.id || member.slug}
                            href={`/team/${member.slug}`}
                            className="group relative rounded-3xl bg-[#12141c] border border-white/10 overflow-hidden flex flex-col justify-between hover:border-[#d4ff00]/60 transition-all duration-500"
                        >
                            {/* Member Portrait with Hover Zoom & Saturation Transition */}
                            <div className="relative aspect-[4/5] overflow-hidden bg-neutral-900">
                                <img
                                    src={member.avatar}
                                    alt={member.name}
                                    loading="lazy"
                                    className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                                />

                                {/* Since Badge Floating */}
                                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[10px] font-mono uppercase tracking-wider text-[#d4ff00]">
                                    Since {member.since_year}
                                </div>

                                <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-[#d4ff00] text-black opacity-0 group-hover:opacity-100 flex items-center justify-center transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                    <ArrowUpRight className="w-4 h-4" />
                                </div>
                            </div>

                            {/* Member Details */}
                            <div className="p-5 space-y-1">
                                <h3 className="font-display font-bold text-lg text-white group-hover:text-[#d4ff00] transition-colors">
                                    {member.name}
                                </h3>
                                <p className="font-mono text-xs text-neutral-400">
                                    {member.role}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
