import React from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Project } from '@/types/models';

interface StickyWorkCardsProps {
    projects: Project[];
}

export function StickyWorkCards({ projects }: StickyWorkCardsProps) {
    const stickyOffsets = ['top-24', 'top-28', 'top-32', 'top-36'];

    return (
        <section id="featured-work" className="relative py-28 bg-[#0a0b0e]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-white/10 gap-6"
                >
                    <div>
                        <span className="font-mono text-xs uppercase tracking-widest text-[#d4ff00] block mb-3">
                            [ 01 // 2D & 3D SELECTED COMMISSIONS ]
                        </span>
                        <h2 className="text-5xl sm:text-7xl font-['Antonio',_'Bebas_Neue',_'Syne',_sans-serif] uppercase font-bold text-white tracking-tight">
                            ENGINEERED FOR IMPACT.
                        </h2>
                    </div>

                    <Link
                        href="/work"
                        className="group inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-400 hover:text-[#d4ff00] transition-colors"
                    >
                        <span>View All Archives (24+)</span>
                        <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </Link>
                </motion.div>

                {/* Sticky Stacked Cards List */}
                <div className="space-y-12 relative pb-12">
                    {projects.map((project, index) => {
                        const topClass = stickyOffsets[index % stickyOffsets.length];

                        return (
                            <motion.article
                                key={project.id || project.slug}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-60px' }}
                                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                className={`sticky ${topClass} rounded-3xl p-6 sm:p-10 border border-white/10 bg-[#12141c] shadow-2xl backdrop-blur-2xl transition-all duration-300 group overflow-hidden`}
                                style={{
                                    zIndex: index + 10,
                                }}
                            >
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                                    {/* Left Details */}
                                    <div className="lg:col-span-5 space-y-6">
                                        <div className="flex items-center gap-3">
                                            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-wider text-[#d4ff00]">
                                                {project.category?.name || 'Creative Engineering'}
                                            </span>
                                            <span className="text-xs font-mono text-neutral-500">
                                                [{project.year}]
                                            </span>
                                        </div>

                                        <h3 className="text-3xl sm:text-5xl font-['Antonio',_'Syne',_sans-serif] uppercase font-bold text-white leading-none group-hover:text-[#d4ff00] transition-colors">
                                            <Link href={`/work/${project.slug}`}>
                                                {project.title}
                                            </Link>
                                        </h3>

                                        <p className="text-neutral-400 text-sm sm:text-base leading-relaxed line-clamp-3">
                                            {project.summary}
                                        </p>

                                        {/* Deliverables tags */}
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {project.deliverables?.map((deliv, i) => (
                                                <span
                                                    key={i}
                                                    className="text-[11px] font-mono text-neutral-300 bg-white/5 px-2.5 py-1 rounded-md border border-white/5"
                                                >
                                                    {deliv}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="pt-4">
                                            <Link
                                                href={`/work/${project.slug}`}
                                                className="inline-flex items-center gap-2 font-display font-bold text-xs uppercase tracking-widest text-white group-hover:text-[#d4ff00] transition-colors"
                                            >
                                                <span>Explore Full Case Study</span>
                                                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Right Project Imagery with Cursor "VIEW" Reveal */}
                                    <div className="lg:col-span-7">
                                        <Link
                                            href={`/work/${project.slug}`}
                                            data-cursor-view="VIEW"
                                            className="block relative rounded-2xl overflow-hidden aspect-[16/10] bg-neutral-900 border border-white/10 group-hover:border-[#d4ff00]/50 transition-all duration-500"
                                        >
                                            <motion.img
                                                src={project.cover_image}
                                                alt={project.title}
                                                loading="lazy"
                                                whileHover={{ scale: 1.05 }}
                                                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                                className="w-full h-full object-cover object-center"
                                            />
                                            {/* Subtle gradient vignette */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none" />
                                        </Link>
                                    </div>
                                </div>
                            </motion.article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
