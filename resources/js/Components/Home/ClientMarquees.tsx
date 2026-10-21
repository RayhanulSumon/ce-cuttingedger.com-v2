import React from 'react';
import { Marquee } from '@/Components/ui/Marquee';
import { Client } from '@/types/models';
import { Sparkles } from 'lucide-react';

interface ClientMarqueesProps {
    clients?: Client[];
}

export function ClientMarquees({ clients }: ClientMarqueesProps) {
    const row1Fallback = [
        { name: 'VERTEX LABS', symbol: '▲', industry: 'Autonomous AI' },
        { name: 'NEBULA PAY', symbol: '◈', industry: 'Fintech Protocol' },
        { name: 'CHRONOS DYNAMICS', symbol: '⧖', industry: 'Aerospace' },
        { name: 'SYNAPSE BIO', symbol: '◎', industry: 'Neuroscience' },
        { name: 'STRATA CLOUD', symbol: '◼', industry: 'Infrastructure' },
        { name: 'VALENCE ENERGY', symbol: '⚡', industry: 'Clean Power' },
    ];

    const row2Fallback = [
        { name: 'HYPERION AUDIO', symbol: '◆', industry: 'Acoustic Hardware' },
        { name: 'QUANTUM OS', symbol: '❖', industry: 'Compute Platform' },
        { name: 'ORBITAL VENTURES', symbol: '●', industry: 'Seed Capital' },
        { name: 'PULSE ROBOTICS', symbol: '✦', industry: 'Industrial Tech' },
        { name: 'AETHER APPAREL', symbol: '⬡', industry: 'Performance Gear' },
        { name: 'SONAR CRYPTO', symbol: '◇', industry: 'Decentralized Tech' },
    ];

    return (
        <section
            id="collaborators-section"
            className="relative py-28 sm:py-36 bg-[#090a0d] border-t border-white/10 overflow-hidden select-none"
        >
            {/* Ambient Lighting */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[25rem] bg-[#d4ff00]/5 rounded-full blur-[190px] pointer-events-none" />

            <div className="w-full max-w-[96%] xl:max-w-[1560px] 2xl:max-w-[1750px] mx-auto px-4 sm:px-8 mb-16 text-center">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-widest text-[#d4ff00] mb-4">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>[ COLLABORATORS ]</span>
                </div>
                <h2 className="text-4xl sm:text-6xl lg:text-7xl font-['Antonio',_'Bebas_Neue',_'Syne',_sans-serif] uppercase font-bold text-white tracking-tight leading-none">
                    Collaborators
                </h2>
                <p className="mt-3 text-sm text-neutral-400 font-sans max-w-xl mx-auto">
                    Powering visionary startups and global leaders with high-conviction creative engineering.
                </p>
            </div>

            {/* Marquee Row 1: Scrolling Left (Agntix des-brand-moving-top) */}
            <div className="py-3.5 border-y border-white/5 bg-black/20">
                <Marquee direction="left" speed="normal" pauseOnHover>
                    {row1Fallback.map((item, index) => (
                        <div
                            key={index}
                            className="group flex items-center gap-4 px-8 py-4 mx-3 rounded-2xl border border-white/10 bg-white/[0.03] hover:border-[#d4ff00]/50 hover:bg-white/[0.06] transition-all duration-300 cursor-default"
                        >
                            <span className="text-2xl text-[#d4ff00] group-hover:scale-125 transition-transform duration-300">
                                {item.symbol}
                            </span>
                            <div className="text-left">
                                <span className="font-['Antonio',_'Bebas_Neue',_sans-serif] font-bold text-xl sm:text-2xl tracking-wider text-neutral-200 group-hover:text-white transition-colors block leading-tight">
                                    {item.name}
                                </span>
                                <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest block">
                                    {item.industry}
                                </span>
                            </div>
                        </div>
                    ))}
                </Marquee>
            </div>

            {/* Marquee Row 2: Scrolling Right (Agntix des-brand-moving-bottom) */}
            <div className="py-3.5 border-b border-white/5 bg-black/40 mt-4">
                <Marquee direction="right" speed="normal" pauseOnHover>
                    {row2Fallback.map((item, index) => (
                        <div
                            key={index}
                            className="group flex items-center gap-4 px-8 py-4 mx-3 rounded-2xl border border-white/10 bg-white/[0.03] hover:border-[#d4ff00]/50 hover:bg-white/[0.06] transition-all duration-300 cursor-default"
                        >
                            <span className="text-2xl text-[#d4ff00] group-hover:scale-125 transition-transform duration-300">
                                {item.symbol}
                            </span>
                            <div className="text-left">
                                <span className="font-['Antonio',_'Bebas_Neue',_sans-serif] font-bold text-xl sm:text-2xl tracking-wider text-neutral-200 group-hover:text-white transition-colors block leading-tight">
                                    {item.name}
                                </span>
                                <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest block">
                                    {item.industry}
                                </span>
                            </div>
                        </div>
                    ))}
                </Marquee>
            </div>
        </section>
    );
}
