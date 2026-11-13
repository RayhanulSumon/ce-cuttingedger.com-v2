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
            className={`relative overflow-hidden border-b border-[#16191f]/10 bg-[#f2f2f1] ${
                compact ? 'pb-10 pt-28 sm:pb-12 sm:pt-32' : 'pb-16 pt-32 sm:pb-20 sm:pt-40'
            }`}
        >
            <div className={`${containerMaxWidth || 'max-w-7xl'} relative z-10 mx-auto px-4 sm:px-6 lg:px-8`}>
                {backUrl && (
                    <div className="mb-6">
                        <Link
                            href={backUrl}
                            className="inline-flex items-center gap-2 text-xs font-semibold text-[#5d6572] transition-colors hover:text-[#f5761a]"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span>{backLabel || 'Back'}</span>
                        </Link>
                    </div>
                )}

                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#5d6572]">{eyebrow}</p>

                <h1
                    className={`${
                        compact ? 'text-[clamp(30px,4.2vw,52px)]' : 'text-[clamp(34px,5.6vw,76px)]'
                    } max-w-4xl font-extrabold leading-[1.02] tracking-[-0.035em] text-[#16191f]`}
                >
                    {title} {highlight && <span className="text-[#f5761a]">{highlight}</span>}
                </h1>

                <p
                    className={`${
                        compact ? 'mt-3 text-base sm:mt-4 sm:text-lg' : 'mt-6 text-lg sm:text-xl'
                    } max-w-2xl leading-relaxed text-[#2f333a]`}
                >
                    {description}
                </p>

                {children && <div className="mt-6">{children}</div>}
            </div>
        </section>
    );
}
