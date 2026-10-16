import React from 'react';
import { Marquee } from '@/Components/UI/Marquee';
import { Client } from '@/types/models';

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
        <section className="relative py-28 bg-[#0c0d12] border-t border-white/10 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
                <span className="font-mono text-xs uppercase tracking-widest text-[#d4ff00] block mb-3">
                    [ 04 // TRUSTED BY VISIONARIES ]
                </span>
                <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
                    TRUSTED BY MARKET PIONEERS.
                </h2>
                <p className="mt-3 text-sm text-neutral-400 font-mono">
                    From venture-backed disruptors to generational enterprise titans.
                </p>
            </div>

            {/* Marquee Row 1: Scrolling Left */}
            <div className="py-3 border-y border-white/5 bg-black/20">
                <Marquee direction="left" speed="normal" pauseOnHover>
                    {row1Fallback.map((item, index) => (
                        <div
                            key={index}
                            className="group flex items-center gap-3 px-8 py-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-[#d4ff00]/40 hover:bg-white/[0.05] transition-all duration-300 cursor-default"
                        >
                            <span className="text-lg text-[#d4ff00] group-hover:scale-125 transition-transform duration-300">
                                {item.symbol}
                            </span>
                            <div className="text-left">
                                <span className="font-display font-extrabold text-base tracking-wider text-neutral-200 group-hover:text-white transition-colors block">
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

            {/* Marquee Row 2: Scrolling Right */}
            <div className="py-3 border-b border-white/5 bg-black/40 mt-6">
                <Marquee direction="right" speed="normal" pauseOnHover>
                    {row2Fallback.map((item, index) => (
                        <div
                            key={index}
                            className="group flex items-center gap-3 px-8 py-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-[#d4ff00]/40 hover:bg-white/[0.05] transition-all duration-300 cursor-default"
                        >
                            <span className="text-lg text-[#d4ff00] group-hover:scale-125 transition-transform duration-300">
                                {item.symbol}
                            </span>
                            <div className="text-left">
                                <span className="font-display font-extrabold text-base tracking-wider text-neutral-200 group-hover:text-white transition-colors block">
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
