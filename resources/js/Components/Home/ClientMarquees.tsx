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

    // Partition real clients by marquee_row or fallback
    const row1Clients = clients && clients.length > 0 
        ? clients.filter(c => c.marquee_row === 1 || !c.marquee_row)
        : null;
    const row2Clients = clients && clients.length > 0
        ? clients.filter(c => c.marquee_row === 2)
        : null;

    return (
        <section
            id="collaborators-section"
            className="relative py-16 sm:py-20 lg:py-24 bg-[#090a0d] border-t border-white/10 overflow-hidden select-none"
        >
            {/* Ambient Lighting */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[25rem] bg-accent/5 rounded-full blur-[190px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 xs:px-6 lg:px-8 mb-10 sm:mb-14 text-center">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-widest text-accent mb-4">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>[ TRUSTED BY 173+ ENTERPRISES ]</span>
                </div>
                <h2 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-display font-extrabold text-white tracking-tight leading-tight">
                    Global Collaborators
                </h2>
                <p className="mt-3 text-sm sm:text-base text-neutral-400 font-sans max-w-xl mx-auto">
                    Powering e-commerce leaders, luxury fashion houses, and automotive brands with high-throughput post-production.
                </p>
            </div>

            {/* Marquee Row 1: Scrolling Left */}
            <div className="py-3.5 border-y border-white/5 bg-black/20">
                <Marquee direction="left" speed="normal" pauseOnHover>
                    {row1Clients && row1Clients.length > 0
                        ? row1Clients.map((client, index) => (
                            <a
                                key={client.id || index}
                                href={client.url || '#'}
                                target={client.url ? '_blank' : undefined}
                                rel="noopener noreferrer"
                                className="group flex items-center gap-4 px-8 py-4 mx-3 rounded-2xl border border-white/10 bg-white/[0.03] hover:border-accent/50 hover:bg-white/[0.06] transition-all duration-300"
                            >
                                {client.logo_dark ? (
                                    <img 
                                        src={client.logo_dark} 
                                        alt={client.name} 
                                        className="h-9 w-auto max-w-[130px] object-contain opacity-75 group-hover:opacity-100 filter brightness-110 contrast-125 transition-all duration-300" 
                                    />
                                ) : (
                                    <span className="text-2xl text-accent group-hover:scale-125 transition-transform duration-300">★</span>
                                )}
                                <div className="text-left">
                                    <span className="font-display font-bold text-lg sm:text-xl tracking-wider text-neutral-200 group-hover:text-white transition-colors block leading-tight">
                                        {client.name}
                                    </span>
                                    <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest block">
                                        Enterprise Partner
                                    </span>
                                </div>
                            </a>
                        ))
                        : row1Fallback.map((item, index) => (
                            <div
                                key={index}
                                className="group flex items-center gap-4 px-8 py-4 mx-3 rounded-2xl border border-white/10 bg-white/[0.03] hover:border-accent/50 hover:bg-white/[0.06] transition-all duration-300 cursor-default"
                            >
                                <span className="text-2xl text-accent group-hover:scale-125 transition-transform duration-300">
                                    {item.symbol}
                                </span>
                                <div className="text-left">
                                    <span className="font-display font-bold text-xl sm:text-2xl tracking-wider text-neutral-200 group-hover:text-white transition-colors block leading-tight">
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
            <div className="py-3.5 border-b border-white/5 bg-black/40 mt-4">
                <Marquee direction="right" speed="normal" pauseOnHover>
                    {row2Clients && row2Clients.length > 0
                        ? row2Clients.map((client, index) => (
                            <a
                                key={client.id || index}
                                href={client.url || '#'}
                                target={client.url ? '_blank' : undefined}
                                rel="noopener noreferrer"
                                className="group flex items-center gap-4 px-8 py-4 mx-3 rounded-2xl border border-white/10 bg-white/[0.03] hover:border-accent/50 hover:bg-white/[0.06] transition-all duration-300"
                            >
                                {client.logo_dark ? (
                                    <img 
                                        src={client.logo_dark} 
                                        alt={client.name} 
                                        className="h-9 w-auto max-w-[130px] object-contain opacity-75 group-hover:opacity-100 filter brightness-110 contrast-125 transition-all duration-300" 
                                    />
                                ) : (
                                    <span className="text-2xl text-accent group-hover:scale-125 transition-transform duration-300">◈</span>
                                )}
                                <div className="text-left">
                                    <span className="font-display font-bold text-lg sm:text-xl tracking-wider text-neutral-200 group-hover:text-white transition-colors block leading-tight">
                                        {client.name}
                                    </span>
                                    <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest block">
                                        Enterprise Partner
                                    </span>
                                </div>
                            </a>
                        ))
                        : row2Fallback.map((item, index) => (
                            <div
                                key={index}
                                className="group flex items-center gap-4 px-8 py-4 mx-3 rounded-2xl border border-white/10 bg-white/[0.03] hover:border-accent/50 hover:bg-white/[0.06] transition-all duration-300 cursor-default"
                            >
                                <span className="text-2xl text-accent group-hover:scale-125 transition-transform duration-300">
                                    {item.symbol}
                                </span>
                                <div className="text-left">
                                    <span className="font-display font-bold text-xl sm:text-2xl tracking-wider text-neutral-200 group-hover:text-white transition-colors block leading-tight">
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
