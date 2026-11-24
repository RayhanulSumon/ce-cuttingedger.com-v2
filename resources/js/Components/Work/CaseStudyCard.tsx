import React, { useRef, useState } from 'react';
import { Link } from '@inertiajs/react';
import { Project } from '@/types/models';
import { ArrowUpRight, CheckCircle2, SlidersHorizontal } from 'lucide-react';

interface CaseStudyCardProps {
    project: Project;
    priority?: boolean;
}

export function CaseStudyCard({ project, priority = false }: CaseStudyCardProps) {
    const [sliderPos, setSliderPos] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Secondary image candidate for Before / After comparison
    const beforeImage =
        project.before_after_images?.[0]?.before ||
        project.gallery?.[1] ||
        null;
    const afterImage =
        project.before_after_images?.[0]?.after ||
        project.cover_image;

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current || !beforeImage) return;
        const rect = containerRef.current.getBoundingClientRect();
        const clientX = e.clientX;
        const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
        setSliderPos(pct);
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!containerRef.current || !beforeImage || e.touches.length === 0) return;
        const rect = containerRef.current.getBoundingClientRect();
        const clientX = e.touches[0].clientX;
        const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
        setSliderPos(pct);
    };

    const handleMouseLeave = () => {
        setSliderPos(null);
    };

    return (
        <article className="group rounded-3xl bg-surface border border-ink/10 hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-2xl flex flex-col justify-between overflow-hidden">
            <div className="p-6 sm:p-7 space-y-5">
                {/* Interactive Before / After Image Stage */}
                <div
                    ref={containerRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleMouseLeave}
                    className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-surface-2 border border-ink/10 select-none cursor-ew-resize group/stage"
                >
                    {/* Base Image (After / Retouched Outcome) */}
                    <img
                        src={afterImage}
                        alt={`${project.title} - Retouched result`}
                        loading={priority ? 'eager' : 'lazy'}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/stage:scale-[1.02]"
                    />

                    {/* Reveal Image (Before / Raw Capture) when hovered and beforeImage is available */}
                    {beforeImage && sliderPos !== null && (
                        <div
                            className="absolute inset-y-0 left-0 overflow-hidden pointer-events-none"
                            style={{ width: `${sliderPos}%` }}
                        >
                            <img
                                src={beforeImage}
                                alt={`${project.title} - Raw capture before editing`}
                                className="absolute inset-y-0 left-0 h-full max-w-none object-cover"
                                style={{
                                    width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
                                }}
                            />
                            {/* Divider line */}
                            <div className="absolute right-0 inset-y-0 w-0.5 bg-white shadow-[0_0_12px_rgba(0,0,0,0.5)]">
                                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg border border-white/80">
                                    <SlidersHorizontal className="w-3.5 h-3.5" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Gradient Overlay for bottom badges */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20 pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2 pointer-events-none">
                        <div className="flex flex-wrap gap-2">
                            {project.is_concept ? (
                                <span className="px-2.5 py-1 rounded-full bg-surface/90 border border-info/30 text-info text-2xs font-bold uppercase backdrop-blur-md">
                                    Concept Prototype
                                </span>
                            ) : (
                                <span className="px-2.5 py-1 rounded-full bg-surface/90 border border-success/30 text-success text-2xs font-bold uppercase backdrop-blur-md flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3 text-success" />
                                    <span>Client Study</span>
                                </span>
                            )}
                            {project.category?.name && (
                                <span className="px-2.5 py-1 rounded-full bg-surface/90 border border-ink/10 text-ink text-2xs font-bold uppercase backdrop-blur-md">
                                    {project.category.name}
                                </span>
                            )}
                        </div>

                        {beforeImage && (
                            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 text-white/90 text-2xs uppercase tracking-wider backdrop-blur-sm transition-opacity group-hover/stage:opacity-90">
                                {sliderPos !== null ? 'Slide to Compare' : 'Hover Before/After'}
                            </span>
                        )}
                    </div>

                    {/* Bottom Metadata Bar */}
                    <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between text-xs text-white/95 pointer-events-none">
                        <span className="font-bold text-white tracking-wide">{project.client_name}</span>
                        <span className="text-white/80 font-mono text-2xs">{project.year}</span>
                    </div>
                </div>

                {/* Title & Summary */}
                <div className="space-y-2">
                    <h2 className="text-xl sm:text-2xl font-display font-bold text-ink group-hover:text-primary-ink transition-colors leading-snug">
                        <Link href={`/case-studies/${project.slug}`} className="hover:underline">
                            {project.title}
                        </Link>
                    </h2>
                    <p className="text-muted text-sm leading-relaxed line-clamp-2">
                        {project.summary}
                    </p>
                </div>

                {/* High-Impact Metrics Grid */}
                {project.metrics && project.metrics.length > 0 && (
                    <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-ink/10">
                        {project.metrics.slice(0, 3).map((m, i) => (
                            <div
                                key={i}
                                className="p-2.5 rounded-xl bg-surface-2/80 border border-ink/5 hover:border-primary/20 transition-colors text-center"
                            >
                                <p className="font-display font-black text-base sm:text-lg text-primary-ink tracking-tight">
                                    {m.value}
                                </p>
                                <p className="text-2xs font-medium text-subtle truncate mt-0.5">
                                    {m.label}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Card Footer with CTA */}
            <div className="px-6 sm:px-7 py-4 bg-surface-2/40 border-t border-ink/10 flex items-center justify-between text-xs">
                <span className="text-muted font-medium">Production Benchmark</span>
                <Link
                    href={`/case-studies/${project.slug}`}
                    className="text-primary-ink font-bold inline-flex items-center gap-1.5 hover:gap-2 transition-all group-hover:text-primary"
                >
                    <span>Inspect Results</span>
                    <ArrowUpRight className="w-4 h-4 text-primary-ink" />
                </Link>
            </div>
        </article>
    );
}
