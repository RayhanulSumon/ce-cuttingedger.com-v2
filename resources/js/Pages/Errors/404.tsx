import React from 'react';
import { Link } from '@inertiajs/react';
import { SeoHead } from '@/Components/Common/SeoHead';
import {
    ArrowLeft,
    Home,
    Layers,
    Sparkles,
    Briefcase,
    Zap,
    Search,
    Compass
} from 'lucide-react';

export default function NotFound() {
    const quickLinks = [
        {
            title: 'Production Services',
            desc: 'Hand-drawn clipping paths, ghost mannequin, and jewelry retouching.',
            href: '/services',
            icon: Layers,
            badge: 'Core Engine',
        },
        {
            title: 'Case Studies',
            desc: 'Real-world enterprise batch workflows and quality metrics.',
            href: '/case-studies',
            icon: Briefcase,
            badge: 'Proof',
        },
        {
            title: 'Transparent Pricing',
            desc: 'Volume e-commerce rates starting from $0.35 per asset.',
            href: '/pricing',
            icon: Zap,
            badge: 'SLA Tiers',
        },
        {
            title: 'Free 3-Image Trial',
            desc: 'Test our quality on your own RAW files with zero upfront cost.',
            href: '/contact',
            icon: Sparkles,
            badge: 'Complimentary',
        },
    ];

    return (
        <>
            <SeoHead
                title="404 — Void Trajectory"
                description="The requested coordinate does not exist in our digital perimeter."
                noindex={true}
            />

            <section className="relative min-h-[90vh] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 bg-[#0a0b0e] overflow-hidden">
                {/* Tech Grid Background */}
                <div
                    className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{
                        backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
                        backgroundSize: '40px 40px',
                    }}
                />

                {/* Ambient Radial Glows */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[38rem] h-[22rem] bg-[#d4ff00]/10 rounded-full blur-[180px] pointer-events-none" />
                <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#00f5ff]/5 rounded-full blur-[160px] pointer-events-none" />

                <div className="max-w-4xl w-full mx-auto relative z-10 text-center space-y-10">
                    {/* Status Pill */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d4ff00]/10 border border-[#d4ff00]/30 text-xs font-mono uppercase tracking-widest text-[#d4ff00]">
                        <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
                        <span>ERROR 404 // VOID TRAJECTORY</span>
                    </div>

                    {/* Main Headline */}
                    <div className="space-y-4">
                        <div className="relative inline-block">
                            <span className="text-8xl sm:text-9xl lg:text-[11rem] font-display font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-200 to-neutral-700 leading-none select-none">
                                404
                            </span>
                            <span className="absolute -bottom-2 right-2 text-xs font-mono text-[#d4ff00] uppercase tracking-wider bg-black/80 px-2 py-0.5 rounded border border-[#d4ff00]/40">
                                SIGNAL_LOST
                            </span>
                        </div>

                        <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                            The coordinate you requested is beyond our perimeter.
                        </h1>

                        <p className="text-neutral-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                            The URL may have moved during our platform optimization, been decommissioned, or entered as a typo. Use the radar below to resume your course.
                        </p>
                    </div>

                    {/* Primary Action Buttons */}
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link
                            href="/"
                            className="bg-[#d4ff00] text-black font-display font-bold text-xs uppercase tracking-wider py-3.5 px-7 rounded-full flex items-center gap-2 hover:bg-[#c2eb00] hover:shadow-[0_0_25px_rgba(212,255,0,0.35)] transition-all"
                        >
                            <Home className="w-4 h-4" />
                            <span>Return to Flagship</span>
                        </Link>

                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="border border-white/20 text-white font-mono text-xs uppercase tracking-wider py-3.5 px-6 rounded-full flex items-center gap-2 hover:border-[#d4ff00] hover:text-[#d4ff00] transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Step Back</span>
                        </button>
                    </div>

                    {/* Quick Course Correction Cards */}
                    <div className="pt-6 border-t border-white/10 text-left">
                        <p className="text-center font-mono text-xs uppercase tracking-widest text-neutral-500 mb-6">
                            // RECOMMENDED VECTOR NAVIGATION
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {quickLinks.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="group p-5 rounded-2xl bg-[#12141c]/80 border border-white/10 hover:border-[#d4ff00]/50 hover:bg-[#161924] transition-all flex flex-col justify-between"
                                    >
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-300 group-hover:text-[#d4ff00] group-hover:border-[#d4ff00]/30 transition-colors">
                                                    <Icon className="w-4 h-4" />
                                                </div>
                                                <span className="text-[10px] font-mono uppercase tracking-wider text-[#d4ff00] px-2 py-0.5 rounded-full bg-[#d4ff00]/10 border border-[#d4ff00]/20">
                                                    {item.badge}
                                                </span>
                                            </div>

                                            <h3 className="text-sm font-display font-bold text-white group-hover:text-[#d4ff00] transition-colors">
                                                {item.title}
                                            </h3>

                                            <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                                                {item.desc}
                                            </p>
                                        </div>

                                        <span className="mt-4 inline-flex items-center gap-1 text-[11px] font-mono text-neutral-400 group-hover:text-white transition-colors">
                                            Open Route &rarr;
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
