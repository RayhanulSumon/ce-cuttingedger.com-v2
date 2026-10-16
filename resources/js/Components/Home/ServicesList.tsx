import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { ArrowUpRight, Plus, Minus, Layers, Cpu, Compass, Flame } from 'lucide-react';
import { Service } from '@/types/models';

interface ServicesListProps {
    services: Service[];
}

export function ServicesList({ services }: ServicesListProps) {
    const [expandedId, setExpandedId] = useState<number | null>(services[0]?.id || 1);

    const toggleRow = (id: number) => {
        setExpandedId((prev) => (prev === id ? null : id));
    };

    const icons = [Layers, Compass, Flame, Cpu];

    return (
        <section className="relative py-28 bg-[#0c0d12] border-t border-white/10 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-white/10 gap-6">
                    <div>
                        <span className="font-mono text-xs uppercase tracking-widest text-[#d4ff00] block mb-3">
                            [ 02 // CAPABILITIES & DISCIPLINES ]
                        </span>
                        <h2 className="text-4xl sm:text-6xl font-display font-extrabold text-white tracking-tight">
                            SERVICES AT SCALE.
                        </h2>
                    </div>

                    <p className="text-neutral-400 text-sm max-w-sm">
                        High-caliber execution across design, identity, and modern engineering to build distinct competitive monopolies.
                    </p>
                </div>

                {/* Expandable Rows */}
                <div className="divide-y divide-white/10">
                    {services.map((service, index) => {
                        const isExpanded = expandedId === service.id;
                        const ServiceIcon = icons[index % icons.length];

                        return (
                            <div
                                key={service.id || service.slug}
                                className={`group transition-colors duration-300 ${
                                    isExpanded ? 'bg-white/[0.02]' : 'hover:bg-white/[0.01]'
                                }`}
                            >
                                {/* Row Header / Clickable Accordion Bar */}
                                <button
                                    type="button"
                                    onClick={() => toggleRow(service.id)}
                                    aria-expanded={isExpanded}
                                    className="w-full py-8 sm:py-10 flex items-center justify-between text-left cursor-pointer select-none"
                                >
                                    <div className="flex items-center gap-6 sm:gap-12">
                                        <span className="font-mono text-xs sm:text-sm text-neutral-500 group-hover:text-[#d4ff00] transition-colors">
                                            0{index + 1}
                                        </span>
                                        <h3 className="text-2xl sm:text-4xl lg:text-5xl font-display font-black text-white group-hover:text-[#d4ff00] group-hover:translate-x-2 transition-all duration-300">
                                            {service.title}
                                        </h3>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <span className="hidden sm:inline-block font-mono text-xs uppercase tracking-widest text-neutral-400">
                                            {service.marquee_label}
                                        </span>
                                        <div
                                            className={`w-10 h-10 rounded-full border border-white/10 flex items-center justify-center transition-all duration-300 ${
                                                isExpanded
                                                    ? 'bg-[#d4ff00] text-black border-[#d4ff00]'
                                                    : 'text-neutral-400 group-hover:border-[#d4ff00] group-hover:text-[#d4ff00]'
                                            }`}
                                        >
                                            {isExpanded ? (
                                                <Minus className="w-4 h-4" />
                                            ) : (
                                                <Plus className="w-4 h-4" />
                                            )}
                                        </div>
                                    </div>
                                </button>

                                {/* Expanded Content Panel */}
                                <div
                                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                                        isExpanded ? 'max-h-[600px] opacity-100 pb-10' : 'max-h-0 opacity-0'
                                    }`}
                                >
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4 pl-0 sm:pl-16">
                                        {/* Floating Abstract Shape / Icon */}
                                        <div className="lg:col-span-3 flex items-start">
                                            <div className="relative p-6 rounded-2xl bg-[#141620] border border-white/10 shadow-lg group-hover:border-[#d4ff00]/40 transition-colors animate-float">
                                                <ServiceIcon className="w-12 h-12 text-[#d4ff00]" />
                                                <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-[#d4ff00]/20 blur-md" />
                                            </div>
                                        </div>

                                        {/* Description & Deliverables */}
                                        <div className="lg:col-span-6 space-y-4">
                                            <h4 className="text-xl font-display font-bold text-white">
                                                {service.subtitle}
                                            </h4>
                                            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
                                                {service.description}
                                            </p>

                                            <div className="flex flex-wrap gap-2 pt-2">
                                                {service.deliverables?.map((deliv, i) => (
                                                    <span
                                                        key={i}
                                                        className="text-xs font-mono text-neutral-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full"
                                                    >
                                                        {deliv}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Action link */}
                                        <div className="lg:col-span-3 flex lg:justify-end items-end">
                                            <Link
                                                href={`/services/${service.slug}`}
                                                className="inline-flex items-center gap-2 font-display font-bold text-xs uppercase tracking-widest text-black bg-[#d4ff00] hover:bg-[#c2eb00] px-5 py-3 rounded-full transition-colors"
                                            >
                                                <span>Deep Dive Discipline</span>
                                                <ArrowUpRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
