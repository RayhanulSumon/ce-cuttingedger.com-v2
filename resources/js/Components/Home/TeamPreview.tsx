import React, { useState, useRef } from 'react';
import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';
import { TeamMember } from '@/types/models';

interface TeamPreviewProps {
    members: TeamMember[];
}

interface ExecutiveLeader {
    id: number | string;
    name: string;
    slug: string;
    role: string;
    since_year: string | number;
    avatar: string;
    bio: string;
    specialty: string;
}

const DEFAULT_EXECUTIVES: ExecutiveLeader[] = [
    {
        id: 'delwar-hussain',
        name: 'DELWAR HUSSAIN',
        slug: 'delwar-hussain',
        role: 'Founder & Chief Executive Officer',
        since_year: '2014',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=85',
        bio: 'Spearheads global enterprise studio operations, ISO 27001 security governance, and high-velocity B2B production pipelines across 250+ specialists.',
        specialty: 'Enterprise Strategy & ISO Governance',
    },
    {
        id: 'enamul-karim',
        name: 'ENAMUL KARIM',
        slug: 'enamul-karim',
        role: 'Executive Creative & 3D CGI Director',
        since_year: '2016',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=85',
        bio: 'Directs photorealistic 3D spatial CGI, Unreal Engine virtual production, and generative AI visual workflows for luxury retail houses.',
        specialty: '3D Spatial CGI & AI Workflows',
    },
    {
        id: 'afroza-luna',
        name: 'AFROZA LUNA',
        slug: 'afroza-luna',
        role: 'VP of Studio Production & Quality Assurance',
        since_year: '2017',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=85',
        bio: 'Leads 24/6 multi-shift retouching squads, 3-stage surgical QA protocols, and Delta-E color accuracy for high-volume e-commerce catalogs.',
        specialty: 'High-Volume Retouching & 99.8% QA',
    },
];

export function TeamPreview({ members = [] }: TeamPreviewProps) {
    // Ensure Delwar Hussain, Enamul Karim, and Afroza Luna are always prominently represented with full executive titles and bios
    const executives: ExecutiveLeader[] = DEFAULT_EXECUTIVES.map((fallback, idx) => {
        const matched =
            members.find((m) => m.name?.toLowerCase().includes(fallback.name.split(' ')[0].toLowerCase())) ||
            members[idx];

        if (!matched) {
            return fallback;
        }

        return {
            id: matched.id || fallback.id,
            name: matched.name || fallback.name,
            slug: matched.slug || fallback.slug,
            role: matched.role || fallback.role,
            since_year: matched.since_year || fallback.since_year,
            avatar: matched.avatar || fallback.avatar,
            bio: matched.bio || fallback.bio,
            specialty: fallback.specialty,
        };
    });

    const [hoveredMember, setHoveredMember] = useState<ExecutiveLeader | null>(null);
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const sectionRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!sectionRef.current) {
            return;
        }
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
            className="relative py-16 sm:py-22 lg:py-26 bg-[#090a0d] border-t border-white/10 overflow-hidden select-none"
        >
            {/* Ambient Lighting */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[30rem] bg-accent/5 rounded-full blur-[200px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header matching Reference Image + Prompt Section 7 */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 pb-6 border-b border-white/10 gap-5">
                    <div className="space-y-2 max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent/10 border border-accent/25 text-[11px] font-mono uppercase tracking-[0.2em] text-accent font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                            <span>Executive Leadership &amp; Creative Directors</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-white tracking-tight leading-tight">
                            The Team Behind <span className="text-accent">Your Catalogs</span>
                        </h2>
                        <p className="text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed">
                            Veteran executive directors, color scientists, and CGI supervisors governing daily enterprise production.
                        </p>
                    </div>

                    <Link
                        href="/team"
                        className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.04] border border-white/15 text-xs font-mono uppercase tracking-wider text-neutral-300 hover:text-black hover:bg-accent hover:border-accent transition-all duration-300 shadow-sm shrink-0 self-start sm:self-auto cursor-pointer"
                    >
                        <span>View All Leadership</span>
                        <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                </div>

                {/* Executive Leadership Rows matching reference screenshot with rich hover states */}
                <div
                    onMouseLeave={() => setHoveredMember(null)}
                    className="divide-y divide-white/10 border-b border-white/10 relative"
                >
                    {executives.map((member) => {
                        const isHovered = hoveredMember?.id === member.id;

                        return (
                            <Link
                                key={member.id}
                                href={`/team/${member.slug}`}
                                onMouseEnter={() => setHoveredMember(member)}
                                className="group py-6 sm:py-8 px-4 sm:px-6 -mx-4 sm:-mx-6 rounded-2xl hover:bg-white/[0.03] flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-all duration-300 cursor-pointer block relative"
                            >
                                {/* Left: Tenure & Specialty */}
                                <div className="lg:w-[24%] shrink-0 text-left space-y-1">
                                    <span className="font-mono text-xs text-neutral-400 group-hover:text-accent transition-colors uppercase tracking-widest block font-semibold">
                                        Since {member.since_year}
                                    </span>
                                    <span className="font-mono text-[11px] text-neutral-500 group-hover:text-neutral-300 transition-colors block">
                                        {member.specialty}
                                    </span>
                                </div>

                                {/* Center: Condensed Executive Name + Smooth Bio Reveal */}
                                <div className="flex-1 px-0 lg:px-4 text-left lg:text-center min-w-0">
                                    <h3 className="font-display text-2xl sm:text-4xl md:text-[42px] xl:text-[50px] font-black uppercase tracking-[-0.02em] text-neutral-100 group-hover:text-accent transition-colors duration-300 leading-none">
                                        {member.name}
                                    </h3>
                                    <p
                                        className={`mt-2 text-xs sm:text-sm text-neutral-400 font-sans max-w-xl mx-auto leading-relaxed transition-all duration-300 ${
                                            isHovered
                                                ? 'opacity-100 max-h-24'
                                                : 'opacity-75 lg:opacity-60 max-h-20'
                                        }`}
                                    >
                                        {member.bio}
                                    </p>
                                </div>

                                {/* Right: Clear Executive Job Title + Avatar + Arrow */}
                                <div className="lg:w-[28%] shrink-0 flex items-center justify-between lg:justify-end gap-3.5 text-right">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 group-hover:border-accent transition-colors shrink-0">
                                            <img
                                                src={member.avatar}
                                                alt={member.name}
                                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 contrast-115"
                                            />
                                        </div>
                                        <div className="text-left lg:text-right min-w-0">
                                            <span className="font-mono text-xs font-bold text-neutral-200 group-hover:text-white transition-colors uppercase tracking-wider block leading-snug">
                                                {member.role}
                                            </span>
                                            <span className="inline-flex items-center gap-1 font-mono text-[10px] text-accent uppercase tracking-widest mt-0.5">
                                                <ShieldCheck className="w-3 h-3" />
                                                <span>Executive Board</span>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full border border-white/10 group-hover:border-accent group-hover:bg-accent flex items-center justify-center transition-all duration-300 shrink-0">
                                        <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-black transition-colors" />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* FLOATING HOVER PORTRAIT & BIO DOSSIER PREVIEW */}
            <AnimatePresence>
                {hoveredMember && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            x: cursorPos.x + 24,
                            y: Math.max(20, cursorPos.y - 180),
                        }}
                        exit={{ opacity: 0, scale: 0.85 }}
                        transition={{
                            type: 'spring',
                            stiffness: 280,
                            damping: 24,
                            mass: 0.4,
                        }}
                        className="pointer-events-none absolute top-0 left-0 z-40 hidden xl:block"
                    >
                        <div className="w-[290px] rounded-2xl overflow-hidden border border-accent/40 bg-[#0d0f17]/95 shadow-[0_30px_70px_rgba(0,0,0,0.95)] backdrop-blur-xl">
                            <div className="relative h-[240px] overflow-hidden">
                                <img
                                    src={hoveredMember.avatar}
                                    alt={hoveredMember.name}
                                    className="w-full h-full object-cover contrast-115"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f17] via-transparent to-transparent" />
                                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 font-mono text-[10px] uppercase tracking-wider text-accent">
                                    Since {hoveredMember.since_year}
                                </span>
                            </div>
                            <div className="p-4 space-y-1.5">
                                <div className="font-display font-bold text-sm text-white uppercase">
                                    {hoveredMember.name}
                                </div>
                                <div className="font-mono text-[11px] text-accent font-semibold">
                                    {hoveredMember.role}
                                </div>
                                <p className="text-[11px] text-neutral-300 font-sans leading-relaxed line-clamp-3">
                                    {hoveredMember.bio}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
