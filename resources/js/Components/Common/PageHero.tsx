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
    compact?: boolean;
    children?: React.ReactNode;
}

export function PageHero({
    eyebrow,
    title,
    highlight,
    description,
    backUrl,
    backLabel,
    containerMaxWidth,
    compact = false,
    children,
}: PageHeroProps) {
    return (
        <section
            className={`relative ${
                compact ? 'pt-28 pb-10 sm:pt-32 sm:pb-12' : 'pt-36 pb-20'
            } bg-[#f2f2f1] border-b border-[#16191f]/10 overflow-hidden`}
        >
            {/* Ambient Background Aura */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#f5761a]/10 rounded-full blur-[140px] pointer-events-none" />

            <div className={`${containerMaxWidth || 'max-w-7xl'} mx-auto px-4 sm:px-6 lg:px-8 relative z-10`}>
                {backUrl && (
                    <div className="mb-6">
                        <Link
                            href={backUrl}
                            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#4a505b] hover:text-[#c4540a] transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>{backLabel || 'Back'}</span>
                        </Link>
                    </div>
                )}

                <span className="font-mono text-xs uppercase tracking-widest text-[#c4540a] block mb-3">
                    [ {eyebrow} ]
                </span>

                <h1
                    className={`${
                        compact
                            ? 'text-3xl sm:text-4xl lg:text-[44px]'
                            : 'text-4xl sm:text-6xl lg:text-7xl'
                    } font-display font-extrabold text-[#16191f] tracking-tight leading-[1.12] max-w-4xl`}
                >
                    {title}{' '}
                    {highlight && (
                        <span className="text-[#c4540a]">
                            {highlight}
                        </span>
                    )}
                </h1>

                <p
                    className={`${
                        compact ? 'mt-3 sm:mt-4 text-sm sm:text-base' : 'mt-6 text-lg sm:text-xl'
                    } text-[#4a505b] max-w-2xl font-normal leading-relaxed`}
                >
                    {description}
                </p>

                {children && <div className="mt-6">{children}</div>}
            </div>
        </section>
    );
}
