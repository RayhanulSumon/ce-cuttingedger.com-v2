import React from 'react';
import { ChevronLeft, ChevronRight, ShieldCheck, Star, Award } from 'lucide-react';

interface AwardItem {
    id: string;
    organization: 'G2' | 'Capterra' | 'Software Advice';
    title: string;
    subtitle: string;
    badgeType: 'usability' | 'best-results' | 'capterra' | 'leader-winter' | 'front-runners' | 'leader-spring';
    color: string;
    score: string;
}

export function AwardsShowcase() {
    const awards: AwardItem[] = [
        {
            id: 'g2-best-usability',
            organization: 'G2',
            title: 'Best Usability',
            subtitle: 'Enterprise Spring 2025',
            badgeType: 'usability',
            color: '#f5a623',
            score: '4.9/5',
        },
        {
            id: 'g2-best-results',
            organization: 'G2',
            title: 'Best Results',
            subtitle: 'Mid-Market Summer 2025',
            badgeType: 'best-results',
            color: '#f5a623',
            score: '99.4%',
        },
        {
            id: 'capterra-shortlist',
            organization: 'Capterra',
            title: 'SHORTLIST',
            subtitle: 'Creative & 3D 2025',
            badgeType: 'capterra',
            color: '#38bdf8',
            score: '4.9 ★',
        },
        {
            id: 'g2-leader-winter',
            organization: 'G2',
            title: 'Leader',
            subtitle: 'Enterprise Winter 2025',
            badgeType: 'leader-winter',
            color: '#f5a623',
            score: '#1 Rank',
        },
        {
            id: 'software-advice-frontrunners',
            organization: 'Software Advice',
            title: 'FRONT RUNNERS',
            subtitle: 'Visual Production 2025',
            badgeType: 'front-runners',
            color: '#f59e0b',
            score: '4.9 ★',
        },
        {
            id: 'g2-leader-spring',
            organization: 'G2',
            title: 'Leader',
            subtitle: 'AI & CGI Studio 2026',
            badgeType: 'leader-spring',
            color: '#f5a623',
            score: '#1 Rank',
        },
    ];

    return (
        <section
            id="awards-showcase-section"
            className="relative py-16 sm:py-20 bg-[#08090d] border-t border-white/10 overflow-hidden select-none"
        >
            {/* Warm Gold Ambient Glow matching reference image */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[18rem] bg-accent/[0.06] rounded-full blur-[160px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 xs:px-6 lg:px-8 relative z-10">
                {/* Centered Uppercase Gold Header matching reference image */}
                <div className="text-center mb-10 sm:mb-12">
                    <h2 className="text-sm sm:text-base lg:text-lg font-mono uppercase tracking-[0.35em] text-[#d4a853] font-semibold">
                        JUST A FEW OF OUR AWARDS...
                    </h2>
                </div>

                {/* 6 Dark Luxury Shield & Hexagon Badges Row with Left/Right Chevrons */}
                <div className="relative flex items-center gap-3 sm:gap-4">
                    <div className="hidden lg:flex items-center justify-center w-9 h-9 rounded-full border border-white/10 text-neutral-500 shrink-0">
                        <ChevronLeft className="w-4 h-4" />
                    </div>

                    <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4 lg:gap-5">
                        {awards.map((award) => (
                            <div
                                key={award.id}
                                className="group relative p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#16130d]/90 to-[#0c0d12] hover:from-[#1f1a10] hover:to-[#101218] border border-amber-500/20 hover:border-accent/60 transition-all duration-300 hover:-translate-y-1.5 shadow-[0_15px_35px_rgba(0,0,0,0.75)] flex flex-col items-center justify-between text-center"
                            >
                                <div className="w-full flex justify-center py-1">
                                    <div className="relative w-20 h-24 flex flex-col items-center justify-center">
                                        <svg
                                            viewBox="0 0 100 120"
                                            className="w-full h-full drop-shadow-[0_6px_14px_rgba(0,0,0,0.65)] transition-transform duration-300 group-hover:scale-105"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M50 4L92 20V62C92 90 50 114 50 114C50 114 8 90 8 62V20L50 4Z"
                                                className="fill-[#14120e] stroke-amber-400/35 group-hover:stroke-accent transition-colors"
                                                strokeWidth="2.5"
                                            />
                                            <path
                                                d="M50 10L86 24V60C86 84 50 106 50 106C50 106 14 84 14 60V24L50 10Z"
                                                fill={
                                                    award.badgeType === 'capterra'
                                                        ? '#082f49'
                                                        : award.badgeType === 'front-runners'
                                                        ? '#271a0c'
                                                        : '#1f160a'
                                                }
                                                fillOpacity="0.9"
                                            />
                                            <path
                                                d="M14 26L50 14L86 26V42L50 36L14 42V26Z"
                                                fill={award.color}
                                                fillOpacity="0.88"
                                            />
                                            <text
                                                x="50"
                                                y="32"
                                                textAnchor="middle"
                                                fill="#0a0b0e"
                                                fontFamily="sans-serif"
                                                fontWeight="900"
                                                fontSize="12"
                                                letterSpacing="1"
                                            >
                                                {award.organization === 'G2'
                                                    ? 'G2'
                                                    : award.organization === 'Capterra'
                                                    ? '★ CAP'
                                                    : 'ADVICE'}
                                            </text>
                                            <text
                                                x="50"
                                                y="63"
                                                textAnchor="middle"
                                                fill="#ffffff"
                                                fontFamily="sans-serif"
                                                fontWeight="800"
                                                fontSize="8.5"
                                                letterSpacing="0.5"
                                            >
                                                {award.title.toUpperCase()}
                                            </text>
                                            <circle cx="50" cy="75" r="3" fill={award.color} />
                                            <circle cx="40" cy="75" r="2" fill="#ffffff" fillOpacity="0.4" />
                                            <circle cx="60" cy="75" r="2" fill="#ffffff" fillOpacity="0.4" />
                                            <text
                                                x="50"
                                                y="91"
                                                textAnchor="middle"
                                                fill="#d4a853"
                                                fontFamily="monospace"
                                                fontWeight="600"
                                                fontSize="7"
                                                letterSpacing="0.4"
                                            >
                                                {award.subtitle.toUpperCase()}
                                            </text>
                                        </svg>
                                    </div>
                                </div>

                                <div className="mt-2 pt-2.5 border-t border-white/10 w-full">
                                    <span className="block font-mono text-[10px] uppercase tracking-wider text-accent font-semibold">
                                        {award.score} Verified
                                    </span>
                                    <span className="block text-xs font-bold text-neutral-100 mt-0.5 truncate">
                                        {award.title}
                                    </span>
                                    <span className="block text-[10px] text-neutral-400 font-sans truncate">
                                        {award.subtitle}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="hidden lg:flex items-center justify-center w-9 h-9 rounded-full border border-white/10 text-neutral-500 shrink-0">
                        <ChevronRight className="w-4 h-4" />
                    </div>
                </div>

                {/* Bottom Trust Sub-Note */}
                <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-400 font-mono">
                    <span className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                        <span>Verified Enterprise Buyer Reviews</span>
                    </span>
                    <span className="w-1 h-1 rounded-full bg-neutral-600 hidden sm:inline-block" />
                    <span className="flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 text-accent fill-accent" />
                        <span>4.9 / 5.0 Global Rating (180+ B2B Reviews)</span>
                    </span>
                    <span className="w-1 h-1 rounded-full bg-neutral-600 hidden sm:inline-block" />
                    <span className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-accent" />
                        <span>ISO 27001 &amp; SOC 2 Type II Certified Studio</span>
                    </span>
                </div>
            </div>
        </section>
    );
}
