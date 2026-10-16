import React from 'react';
import { Link } from '@inertiajs/react';
import { SeoHead } from '@/Components/Common/SeoHead';
import { PageHero } from '@/Components/Common/PageHero';
import { Project } from '@/types/models';
import { ArrowUpRight, Globe, Layers, CheckCircle } from 'lucide-react';

interface WorkShowProps {
    project: Project;
    relatedProjects: Project[];
}

export default function Show({ project, relatedProjects = [] }: WorkShowProps) {
    return (
        <>
            <SeoHead
                title={`${project.title} — Case Study`}
                description={project.summary}
                image={project.cover_image}
            />

            <PageHero
                eyebrow={`CASE STUDY // ${project.client_name}`}
                title={project.title}
                description={project.summary}
                backUrl="/work"
                backLabel="Back to Work Index"
            />

            {/* Case Study Meta Strip */}
            <section className="py-8 bg-[#0c0d12] border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs font-mono">
                        <div>
                            <span className="text-neutral-500 uppercase block mb-1">Client Partner</span>
                            <span className="text-white font-medium text-sm">{project.client_name}</span>
                        </div>
                        <div>
                            <span className="text-neutral-500 uppercase block mb-1">Discipline</span>
                            <span className="text-[#d4ff00] font-medium text-sm">{project.category?.name || 'Flagship'}</span>
                        </div>
                        <div>
                            <span className="text-neutral-500 uppercase block mb-1">Timeline & Year</span>
                            <span className="text-white font-medium text-sm">{project.year}</span>
                        </div>
                        <div>
                            <span className="text-neutral-500 uppercase block mb-1">Live URL</span>
                            {project.live_url ? (
                                <a
                                    href={project.live_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white hover:text-[#d4ff00] inline-flex items-center gap-1 font-medium text-sm transition-colors"
                                >
                                    <span>Launch Flagship</span>
                                    <ArrowUpRight className="w-3.5 h-3.5 text-[#d4ff00]" />
                                </a>
                            ) : (
                                <span className="text-neutral-500">Private Enterprise</span>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Hero Imagery */}
            <section className="py-12 bg-[#0a0b0e]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative rounded-3xl overflow-hidden aspect-[16/9] border border-white/10 bg-neutral-900 shadow-2xl">
                        <img
                            src={project.cover_image}
                            alt={project.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </section>

            {/* Narrative & Metrics */}
            <section className="py-20 bg-[#0a0b0e]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Narrative */}
                        <div className="lg:col-span-8 space-y-12">
                            <div className="space-y-4">
                                <span className="font-mono text-xs uppercase tracking-widest text-[#d4ff00]">
                                    [ 01 // ARCHITECTURAL CONTEXT ]
                                </span>
                                <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
                                    The Challenge & Vision
                                </h2>
                                <p className="text-neutral-300 text-lg leading-relaxed">
                                    {project.description}
                                </p>
                            </div>

                            {/* Additional Gallery Images */}
                            {project.gallery && project.gallery.length > 0 && (
                                <div className="space-y-8 pt-6">
                                    <span className="font-mono text-xs uppercase tracking-widest text-[#d4ff00]">
                                        [ 02 // ARTIFACT EXPLORATIONS ]
                                    </span>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {project.gallery.map((img, i) => (
                                            <div key={i} className="rounded-2xl overflow-hidden border border-white/10 aspect-[4/3] bg-neutral-900">
                                                <img
                                                    src={img}
                                                    alt={`${project.title} gallery ${i + 1}`}
                                                    loading="lazy"
                                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar: Metrics & Deliverables */}
                        <div className="lg:col-span-4 space-y-8">
                            {/* Metrics Box */}
                            {project.metrics && project.metrics.length > 0 && (
                                <div className="p-8 rounded-3xl bg-[#12141c] border border-white/10 space-y-6">
                                    <span className="font-mono text-xs uppercase tracking-widest text-[#d4ff00] block">
                                        [ MEASURABLE PERFORMANCE ]
                                    </span>
                                    <div className="divide-y divide-white/10">
                                        {project.metrics.map((m, idx) => (
                                            <div key={idx} className="py-4 first:pt-0 last:pb-0">
                                                <span className="block text-3xl font-display font-black text-white">
                                                    {m.value}
                                                </span>
                                                <span className="font-mono text-xs text-neutral-400 uppercase">
                                                    {m.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Deliverables Box */}
                            <div className="p-8 rounded-3xl bg-[#12141c] border border-white/10 space-y-4">
                                <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 block">
                                    Deliverables Included
                                </span>
                                <ul className="space-y-2.5">
                                    {project.deliverables?.map((deliv, i) => (
                                        <li key={i} className="flex items-center gap-2 text-xs font-mono text-neutral-300">
                                            <CheckCircle className="w-3.5 h-3.5 text-[#d4ff00]" />
                                            <span>{deliv}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Work */}
            {relatedProjects.length > 0 && (
                <section className="py-24 bg-[#0c0d12] border-t border-white/10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between mb-12">
                            <span className="font-mono text-xs uppercase tracking-widest text-[#d4ff00]">
                                [ EXPLORE MORE COMMISSIONS ]
                            </span>
                            <Link
                                href="/work"
                                className="font-mono text-xs uppercase tracking-widest text-neutral-400 hover:text-[#d4ff00] transition-colors"
                            >
                                View Complete Archive →
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {relatedProjects.map((rel) => (
                                <Link
                                    key={rel.id}
                                    href={`/work/${rel.slug}`}
                                    className="group rounded-3xl bg-[#12141c] border border-white/10 overflow-hidden hover:border-[#d4ff00]/40 transition-colors"
                                >
                                    <div className="aspect-[16/9] bg-neutral-900 overflow-hidden">
                                        <img
                                            src={rel.cover_image}
                                            alt={rel.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <span className="text-xs font-mono text-neutral-400 block mb-1">
                                            {rel.client_name}
                                        </span>
                                        <h3 className="text-2xl font-display font-bold text-white group-hover:text-[#d4ff00] transition-colors">
                                            {rel.title}
                                        </h3>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}
