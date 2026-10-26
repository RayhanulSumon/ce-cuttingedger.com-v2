import React, { useState, useRef } from 'react';
import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { TeamMember } from '@/types/models';

interface TeamPreviewProps {
    members: TeamMember[];
}

export function TeamPreview({ members }: TeamPreviewProps) {
    const defaultMembers = [
        {
            id: 1,
            name: 'Logan Dang',
            slug: 'logan-dang',
            role: 'CEO Founder',
            since_year: '2009',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        },
        {
            id: 2,
            name: 'Rahat Chowhury',
            slug: 'rahat-chowhury',
            role: 'Web Designer',
            since_year: '2004',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
        },
        {
            id: 3,
            name: 'Thomas Finlan',
            slug: 'thomas-finlan',
            role: 'Marketing Director',
            since_year: '2012',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
        },
        {
            id: 4,
            name: 'Farhan Firoz',
            slug: 'farhan-firoz',
            role: 'UI/UX Designer',
            since_year: '2010',
            avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80',
        },
        {
            id: 5,
            name: 'Billy Craft',
            slug: 'billy-craft',
            role: 'Motion Designer',
            since_year: '2016',
            avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
        },
    ];

    const displayMembers = members && members.length >= 4 ? members : (defaultMembers as unknown as TeamMember[]);

    const [hoveredMember, setHoveredMember] = useState<TeamMember | null>(null);
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const sectionRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!sectionRef.current) return;
        const rect = sectionRef.current.getBoundingClientRect();
        setCursorPos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    return (
        <section
            ref={sectionRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredMember(null)}
            className="relative py-16 sm:py-20 lg:py-24 bg-[#090a0d] border-t border-white/10 overflow-hidden select-none"
        >
            {/* Ambient Lighting */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[30rem] bg-[#d4ff00]/5 rounded-full blur-[200px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 pb-6 border-b border-white/10 gap-6">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-widest text-[#d4ff00]">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>[ 05 // LEADERSHIP VANGUARD ]</span>
                        </div>
                        <h2 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-['Antonio',_'Bebas_Neue',_'Syne',_sans-serif] uppercase font-bold text-white tracking-tight leading-tight">
                            Passionate Minds Behind the Studio
                        </h2>
                    </div>

                    <Link
                        href="/team"
                        className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-widest text-neutral-300 hover:text-black hover:bg-[#d4ff00] hover:border-[#d4ff00] transition-all duration-300 shadow-sm shrink-0 self-start sm:self-auto"
                    >
                        <span>Meet All Collective (12+)</span>
                        <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </Link>
                </div>

                {/* AGNTIX DESIGN STUDIO EDITORIAL TEAM LIST (container-1750) */}
                <div className="divide-y divide-white/10 relative">
                    {displayMembers.slice(0, 5).map((member) => (
                        <Link
                            key={member.id || member.slug}
                            href={`/team/${member.slug}`}
                            onMouseEnter={() => setHoveredMember(member)}
                            className="group py-5 sm:py-8 lg:py-9 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 transition-colors duration-300 cursor-pointer block relative"
                        >
                            {/* Left: Since Year (hidden on mobile, shown inline with role) */}
                            <div className="hidden sm:block sm:w-1/4">
                                <span className="font-mono text-xs sm:text-sm text-neutral-500 group-hover:text-[#d4ff00] transition-colors uppercase tracking-widest">
                                    Since {member.since_year || '2009'}
                                </span>
                            </div>

                            {/* Center: Large Condensed Name (Agntix des-team-title) */}
                            <div className="sm:w-2/4 text-left sm:text-center">
                                <h3 className="font-['Antonio',_'Bebas_Neue',_'Syne',_sans-serif] text-3xl sm:text-5xl md:text-6xl lg:text-[84px] xl:text-[96px] font-bold uppercase tracking-tight text-neutral-300 group-hover:text-white transition-all duration-300 group-hover:scale-[1.02] inline-block leading-none break-words">
                                    {member.name}
                                </h3>
                            </div>

                            {/* Right: Role / Title + Mobile Mini Profile Preview */}
                            <div className="sm:w-1/4 flex items-center justify-between sm:justify-end gap-3">
                                <div className="flex items-center gap-3">
                                    {/* Mobile Avatar Thumb */}
                                    <div className="sm:hidden w-8 h-8 rounded-full overflow-hidden border border-white/20 shrink-0">
                                        <img
                                            src={member.avatar}
                                            alt={member.name}
                                            className="w-full h-full object-cover grayscale contrast-125"
                                        />
                                    </div>
                                    <div className="flex flex-col sm:block">
                                        <span className="font-mono text-xs sm:text-sm text-neutral-400 group-hover:text-neutral-200 transition-colors uppercase tracking-wider">
                                            {member.role}
                                        </span>
                                        <span className="sm:hidden font-mono text-[10px] text-neutral-500 uppercase tracking-widest">
                                            Since {member.since_year || '2009'}
                                        </span>
                                    </div>
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-[#d4ff00] transition-colors" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* FLOATING HOVER PORTRAIT PREVIEW (EXACT AGNTIX des-team-reveal-img 300x400) */}
            <AnimatePresence>
                {hoveredMember && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.4 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            x: cursorPos.x - 150,
                            y: cursorPos.y - 200,
                        }}
                        exit={{ opacity: 0, scale: 0.4 }}
                        transition={{
                            type: 'spring',
                            stiffness: 280,
                            damping: 24,
                            mass: 0.45,
                        }}
                        className="pointer-events-none absolute top-0 left-0 z-40 hidden md:block"
                    >
                        <div className="w-[300px] h-[400px] rounded-2xl overflow-hidden border border-white/20 bg-neutral-900 shadow-[0_30px_70px_rgba(0,0,0,0.95)] backdrop-blur-md relative">
                            <img
                                src={hoveredMember.avatar}
                                alt={hoveredMember.name}
                                className="w-full h-full object-cover grayscale contrast-125 brightness-95"
                            />
                            {/* Subtle dark gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                            <div className="absolute bottom-4 left-4 right-4 text-center">
                                <span className="font-mono text-xs uppercase tracking-widest text-[#d4ff00] font-semibold">
                                    View Full Dossier &rarr;
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
