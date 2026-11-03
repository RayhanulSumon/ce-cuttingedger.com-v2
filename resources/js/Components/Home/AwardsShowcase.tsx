import React from 'react';
import { Trophy, Star, ShieldCheck, Award } from 'lucide-react';

interface AwardItem {
    id: string;
    organization: 'G2' | 'Capterra' | 'Software Advice';
    title: string;
    subtitle: string;
    badgeType: 'high-performer' | 'best-results' | 'capterra' | 'leader-winter' | 'front-runners' | 'leader-spring';
    color: string;
    score?: string;
}

export function AwardsShowcase() {
    const awards: AwardItem[] = [
        {
            id: 'g2-high-performer',
            organization: 'G2',
            title: 'High Performer',
            subtitle: 'Mid-Market Spring 2024',
            badgeType: 'high-performer',
            color: '#10B981', // Emerald
            score: '4.9/5',
        },
        {
            id: 'g2-best-results',
            organization: 'G2',
            title: 'Best Results',
            subtitle: 'Mid-Market Summer 2024',
            badgeType: 'best-results',
            color: '#3B82F6', // Blue
            score: '99.4%',
        },
        {
            id: 'capterra-shortlist',
            organization: 'Capterra',
            title: 'SHORTLIST',
            subtitle: 'Retouching & 3D 2024',
            badgeType: 'capterra',
            color: '#0284C7', // Cyan
            score: '4.9 ★',
        },
        {
            id: 'g2-leader-winter',
            organization: 'G2',
            title: 'Leader',
            subtitle: 'Enterprise Winter 2023',
            badgeType: 'leader-winter',
            color: '#F59E0B', // Amber
            score: '#1 Rank',
        },
        {
            id: 'software-advice-frontrunners',
            organization: 'Software Advice',
            title: 'FRONT RUNNERS',
            subtitle: 'Creative Production 2024',
            badgeType: 'front-runners',
            color: '#6366F1', // Indigo
            score: '4.8 ★',
        },
        {
            id: 'g2-leader-spring',
            organization: 'G2',
            title: 'Leader',
            subtitle: 'Creative Services Spring 2024',
            badgeType: 'leader-spring',
            color: '#EC4899', // Pink / Coral
            score: '#1 Rank',
        },
    ];

    return (
        <section
            id="awards-showcase-section"
            className="relative py-14 sm:py-18 lg:py-20 bg-[#08090d] border-t border-white/10 overflow-hidden select-none"
        >
            {/* Ambient Lighting Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[55rem] h-[18rem] bg-accent/[0.04] rounded-full blur-[160px] pointer-events-none" />
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 xs:px-6 lg:px-8 relative z-10">
                {/* Section Eyebrow & Header */}
                <div className="text-center mb-10 sm:mb-12 space-y-3">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/25 text-xs font-mono uppercase tracking-[0.2em] text-accent font-semibold">
                        <Trophy className="w-3.5 h-3.5 text-accent animate-pulse" />
                        <span>VERIFIED INDUSTRY EXCELLENCE</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-white tracking-tight flex items-center justify-center gap-3">
                        <span>Just a few of our</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-accent to-amber-500">
                            awards...
                        </span>
                    </h2>
                    <p className="text-xs sm:text-sm text-neutral-400 font-sans max-w-xl mx-auto">
                        Ranked consistently at the top of independent buyer reviews for precision retouching, SLA velocity, and catalog accuracy.
                    </p>
                </div>

                {/* 6 Dark Luxury Shield Badges Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
                    {awards.map((award) => (
                        <div
                            key={award.id}
                            className="group relative p-4 sm:p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-accent/40 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_32px_rgba(0,0,0,0.6),0_0_20px_rgba(251,183,24,0.1)] flex flex-col items-center justify-between text-center"
                        >
                            {/* Subtle inner card top glow */}
                            <div className="absolute top-0 inset-x-4 h-px bg-gradient-to-r from-transparent via-white/15 group-hover:via-accent/40 to-transparent transition-colors" />

                            {/* Badge Emblem Graphic */}
                            <div className="w-full flex justify-center py-2">
                                <div className="relative w-20 h-24 flex flex-col items-center justify-center">
                                    {/* SVG Shield Base */}
                                    <svg
                                        viewBox="0 0 100 120"
                                        className="w-full h-full drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-105"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        {/* Outer Shield Frame */}
                                        <path
                                            d="M50 4L92 20V62C92 90 50 114 50 114C50 114 8 90 8 62V20L50 4Z"
                                            className="fill-[#11131a] stroke-white/20 group-hover:stroke-accent/60 transition-colors"
                                            strokeWidth="2.5"
                                        />
                                        {/* Inner Shield Gradient Fill */}
                                        <path
                                            d="M50 10L86 24V60C86 84 50 106 50 106C50 106 14 84 14 60V24L50 10Z"
                                            fill={award.badgeType === 'capterra' ? '#003554' : award.badgeType === 'front-runners' ? '#1e1b4b' : '#1e1014'}
                                            fillOpacity="0.8"
                                        />

                                        {/* Header Branding Ribbon Banner */}
                                        <path
                                            d="M14 26L50 14L86 26V42L50 36L14 42V26Z"
                                            fill={award.color}
                                            fillOpacity="0.85"
                                        />

                                        {/* G2 / Capterra / SA Logo text inside banner */}
                                        <text
                                            x="50"
                                            y="32"
                                            textAnchor="middle"
                                            fill="#ffffff"
                                            fontFamily="sans-serif"
                                            fontWeight="900"
                                            fontSize="13"
                                            letterSpacing="1"
                                        >
                                            {award.organization === 'G2' ? 'G2' : award.organization === 'Capterra' ? '★ CAP' : 'ADVICE'}
                                        </text>

                                        {/* Title text */}
                                        <text
                                            x="50"
                                            y="64"
                                            textAnchor="middle"
                                            fill="#ffffff"
                                            fontFamily="sans-serif"
                                            fontWeight="800"
                                            fontSize="9"
                                            letterSpacing="0.5"
                                        >
                                            {award.title.toUpperCase()}
                                        </text>

                                        {/* Star / Laurel / Divider */}
                                        <circle cx="50" cy="76" r="3" fill={award.color} />
                                        <circle cx="40" cy="76" r="2" fill="#ffffff" fillOpacity="0.4" />
                                        <circle cx="60" cy="76" r="2" fill="#ffffff" fillOpacity="0.4" />

                                        {/* Season / Year */}
                                        <text
                                            x="50"
                                            y="92"
                                            textAnchor="middle"
                                            fill="#94a3b8"
                                            fontFamily="monospace"
                                            fontWeight="600"
                                            fontSize="7.5"
                                            letterSpacing="0.5"
                                        >
                                            {award.subtitle.toUpperCase()}
                                        </text>
                                    </svg>
                                </div>
                            </div>

                            {/* Badge Metadata */}
                            <div className="mt-3 pt-3 border-t border-white/5 w-full">
                                <span className="block font-mono text-[10px] uppercase tracking-wider text-accent font-semibold">
                                    {award.score} Verified
                                </span>
                                <span className="block text-xs font-semibold text-neutral-200 mt-0.5 truncate">
                                    {award.title}
                                </span>
                                <span className="block text-[11px] text-neutral-400 font-sans truncate">
                                    {award.subtitle}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Trust Sub-Note */}
                <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-400 font-mono">
                    <span className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                        <span>100% Unbiased Peer Review Badges</span>
                    </span>
                    <span className="w-1 h-1 rounded-full bg-neutral-600 hidden sm:inline-block" />
                    <span className="flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 text-accent fill-accent" />
                        <span>4.9 / 5.0 Global Rating (180+ Reviews)</span>
                    </span>
                    <span className="w-1 h-1 rounded-full bg-neutral-600 hidden sm:inline-block" />
                    <span className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-accent" />
                        <span>ISO 9001 & SOC 2 Type II Certified Studio</span>
                    </span>
                </div>
            </div>
        </section>
    );
}

