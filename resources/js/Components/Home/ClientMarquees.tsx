import React from 'react';
import { Client } from '@/types/models';
import { ShieldCheck, Cpu, Box, Layers, Sparkles, Film, Aperture, Compass, Palette, Lock } from 'lucide-react';

interface ClientMarqueesProps {
    clients?: Client[];
}

interface TechCapabilityItem {
    name: string;
    subtitle: string;
    badge: string;
    icon: React.ComponentType<{ className?: string }>;
}

const ENTERPRISE_CAPABILITIES_AND_STACK: TechCapabilityItem[] = [
    {
        name: 'UNREAL ENGINE 5',
        subtitle: 'Real-Time Spatial CGI',
        badge: '3D Pipeline',
        icon: Box,
    },
    {
        name: 'AUTODESK MAYA',
        subtitle: 'CAD & Sub-D Modeling',
        badge: 'Digital Twins',
        icon: Compass,
    },
    {
        name: 'NVIDIA OMNIVERSE',
        subtitle: 'Generative AI Workflows',
        badge: 'AI Compute',
        icon: Cpu,
    },
    {
        name: 'ADOBE CREATIVE CLOUD',
        subtitle: 'Enterprise Retouching Suite',
        badge: 'Surgical Prep',
        icon: Layers,
    },
    {
        name: 'SUBSTANCE 3D PBR',
        subtitle: '8K Material Physics',
        badge: 'Shader Lab',
        icon: Sparkles,
    },
    {
        name: 'CINEMA 4D + REDSHIFT',
        subtitle: 'Anamorphic & Broadcast',
        badge: 'Motion CGI',
        icon: Film,
    },
    {
        name: 'CAPTURE ONE PRO',
        subtitle: 'Delta-E Color Calibration',
        badge: 'RAW Mastering',
        icon: Aperture,
    },
    {
        name: 'DAVINCI STUDIO',
        subtitle: 'HDR Commercial Grading',
        badge: 'Color Science',
        icon: Palette,
    },
    {
        name: 'BLENDER STUDIO',
        subtitle: 'Procedural Geometry Nodes',
        badge: 'WebGL & AR',
        icon: Box,
    },
    {
        name: 'ISO 27001 VAULT',
        subtitle: 'Air-Gapped NDA SFTP/S3',
        badge: 'Enterprise Sec',
        icon: Lock,
    },
];

export function ClientMarquees({ clients }: ClientMarqueesProps) {
    // Filter out any legacy dummy placeholder names ("Skill", "Pure", "Design Studio")
    const validClients = (clients || []).filter(
        (c) =>
            c.name &&
            !['skill', 'pure', 'design studio'].includes(c.name.trim().toLowerCase())
    );

    return (
        <section
            id="trust-tech-stack-bar"
            className="relative bg-[#08090d] border-y border-white/10 select-none overflow-hidden"
        >
            {/* Subtle Header Strip */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 border-b border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-400">
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                    <span className="text-neutral-200 font-semibold">
                        Our Core Capabilities &amp; Tech Stack
                    </span>
                </div>
                <div className="flex items-center gap-2 text-neutral-500">
                    <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                    <span>Enterprise NDA Protected • 170+ Global Luxury &amp; Retail Partners</span>
                </div>
            </div>

            {/* 2-Row x 5-Column Dark Architectural Bordered Grid (Exact Reference Layout) */}
            <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-x divide-y divide-white/10 border-b border-white/5 bg-[#090a0f]">
                {ENTERPRISE_CAPABILITIES_AND_STACK.map((item, idx) => {
                    const matchedClient = validClients[idx];
                    const Icon = item.icon;

                    return (
                        <div
                            key={idx}
                            className="group relative h-28 sm:h-32 lg:h-36 px-5 py-4 flex flex-col items-center justify-center text-center bg-[#090a0f] hover:bg-white/[0.03] transition-all duration-300"
                        >
                            {matchedClient && matchedClient.logo_dark ? (
                                <div className="flex flex-col items-center justify-center gap-2 opacity-60 grayscale group-hover:opacity-100 transition-all duration-300">
                                    <img
                                        src={matchedClient.logo_dark}
                                        alt={matchedClient.name}
                                        className="h-8 sm:h-9 w-auto max-w-[140px] object-contain filter brightness-125 contrast-125"
                                    />
                                    <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 group-hover:text-neutral-300">
                                        {matchedClient.name}
                                    </span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center gap-2 opacity-65 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/15 flex items-center justify-center text-neutral-300 group-hover:text-accent group-hover:border-accent/40 transition-colors">
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <span className="font-display font-extrabold text-xs sm:text-sm tracking-wider text-neutral-200 group-hover:text-white uppercase">
                                            {item.name}
                                        </span>
                                    </div>
                                    <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 group-hover:text-neutral-400">
                                        {item.subtitle}
                                    </span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
