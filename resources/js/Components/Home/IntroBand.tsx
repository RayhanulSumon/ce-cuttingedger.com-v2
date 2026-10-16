import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowUpRight, Asterisk } from 'lucide-react';
import { Marquee } from '@/Components/UI/Marquee';

export function IntroBand() {
    const marqueeItems = [
        'BRAND STRATEGY',
        'KINETIC ENGINEERING',
        'SPATIAL 3D',
        'DESIGN SYSTEMS',
        'CATEGORY CREATION',
        'FULL-STACK VELOCITY',
    ];

    return (
        <section className="relative py-20 border-y border-white/10 bg-[#0c0d12] overflow-hidden">
            {/* Infinite Marquee Strip */}
            <div className="py-4 border-b border-white/10 bg-black/40">
                <Marquee speed="fast" pauseOnHover>
                    {marqueeItems.map((item, index) => (
                        <div key={index} className="flex items-center gap-6 whitespace-nowrap">
                            <span className="font-display font-extrabold text-2xl sm:text-3xl text-neutral-400 tracking-tight hover:text-[#d4ff00] transition-colors">
                                {item}
                            </span>
                            <Asterisk className="w-5 h-5 text-[#d4ff00] animate-spin" style={{ animationDuration: '8s' }} />
                        </div>
                    ))}
                </Marquee>
            </div>

            {/* Editorial Mission Paragraph */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    <div className="lg:col-span-4">
                        <span className="font-mono text-xs uppercase tracking-widest text-[#d4ff00] block mb-2">
                            [ THE CUTTING EDGE MANIFESTO ]
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-display font-bold text-white leading-snug">
                            We discard convention to engineer visceral digital realities.
                        </h2>
                    </div>

                    <div className="lg:col-span-8 space-y-6">
                        <p className="text-xl sm:text-2xl lg:text-3xl font-display font-normal text-neutral-300 leading-relaxed">
                            Most agencies deliver safe, cookie-cutter templates that evaporate from memory. We construct bespoke, high-velocity digital experiences and magnetic brand systems designed to demand attention, trigger dopamine, and build generational brand equity.
                        </p>

                        <div className="pt-2">
                            <Link
                                href="/about"
                                className="group inline-flex items-center gap-2 text-sm sm:text-base font-mono uppercase tracking-wider text-[#d4ff00] hover:text-white transition-colors"
                            >
                                <span>Uncover Our Philosophy & Architecture</span>
                                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
