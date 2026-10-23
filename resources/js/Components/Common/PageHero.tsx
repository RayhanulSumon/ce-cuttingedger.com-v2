import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface PageHeroProps {
    eyebrow: string;
    title: string;
    highlight?: string;
    description: string;
    backUrl?: string;
    backLabel?: string;
    containerMaxWidth?: string;
}

export function PageHero({
    eyebrow,
    title,
    highlight,
    description,
    backUrl,
    backLabel,
    containerMaxWidth,
}: PageHeroProps) {
    return (
        <section className="relative pt-36 pb-20 bg-[#0a0b0e] border-b border-white/10 overflow-hidden">
            {/* Ambient Background Aura */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#d4ff00]/10 rounded-full blur-[140px] pointer-events-none" />

            <div className={`${containerMaxWidth || 'max-w-7xl'} mx-auto px-4 sm:px-6 lg:px-8 relative z-10`}>
                {backUrl && (
                    <div className="mb-8">
                        <Link
                            href={backUrl}
                            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-400 hover:text-[#d4ff00] transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>{backLabel || 'Back'}</span>
                        </Link>
                    </div>
                )}

                <span className="font-mono text-xs uppercase tracking-widest text-[#d4ff00] block mb-4">
                    [ {eyebrow} ]
                </span>

                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold text-white tracking-tight leading-[1.05] max-w-4xl">
                    {title}{' '}
                    {highlight && (
                        <span className="text-[#d4ff00] underline decoration-[#d4ff00]/40 underline-offset-8">
                            {highlight}
                        </span>
                    )}
                </h1>

                <p className="mt-6 text-lg sm:text-xl text-neutral-400 max-w-2xl font-normal leading-relaxed">
                    {description}
                </p>
            </div>
        </section>
    );
}
