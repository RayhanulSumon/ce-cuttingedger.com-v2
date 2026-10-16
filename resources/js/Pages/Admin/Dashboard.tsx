import React from 'react';
import { Link } from '@inertiajs/react';
import { SeoHead } from '@/Components/Common/SeoHead';
import { Project, ContactMessage } from '@/types/models';
import { Layers, Mail, Users, ArrowUpRight, CheckCircle2, Clock, Sparkles } from 'lucide-react';

interface AdminDashboardProps {
    stats: {
        total_projects: number;
        total_services: number;
        new_inquiries: number;
        total_subscribers: number;
    };
    recentInquiries: ContactMessage[];
    featuredProjects: Project[];
}

export default function Dashboard({
    stats,
    recentInquiries = [],
    featuredProjects = [],
}: AdminDashboardProps) {
    return (
        <>
            <SeoHead title="Studio Command Center — Admin" />

            <div className="min-h-screen pt-32 pb-20 bg-[#08090c] text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-white/10">
                        <div>
                            <span className="font-mono text-xs uppercase tracking-widest text-[#d4ff00]">
                                [ STUDIO OPERATIONS // LEVEL 1 ACCESS ]
                            </span>
                            <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white mt-1">
                                Command Center.
                            </h1>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span>Engine Active (Laravel 13 + Inertia)</span>
                            </span>
                        </div>
                    </div>

                    {/* KPI Stat Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="p-6 rounded-3xl bg-[#12141c] border border-white/10 space-y-2">
                            <span className="font-mono text-xs text-neutral-400 uppercase">Live 2D/3D Projects</span>
                            <div className="text-4xl font-display font-black text-white">
                                {stats.total_projects}
                            </div>
                            <span className="text-xs font-mono text-[#d4ff00]">Curated flagships</span>
                        </div>

                        <div className="p-6 rounded-3xl bg-[#12141c] border border-white/10 space-y-2">
                            <span className="font-mono text-xs text-neutral-400 uppercase">Core Disciplines</span>
                            <div className="text-4xl font-display font-black text-white">
                                {stats.total_services}
                            </div>
                            <span className="text-xs font-mono text-neutral-400">2D, 3D & Engineering</span>
                        </div>

                        <div className="p-6 rounded-3xl bg-[#12141c] border border-white/10 space-y-2">
                            <span className="font-mono text-xs text-neutral-400 uppercase">Pending Inbound Briefs</span>
                            <div className="text-4xl font-display font-black text-[#d4ff00]">
                                {stats.new_inquiries}
                            </div>
                            <span className="text-xs font-mono text-neutral-400">Awaiting partner review</span>
                        </div>

                        <div className="p-6 rounded-3xl bg-[#12141c] border border-white/10 space-y-2">
                            <span className="font-mono text-xs text-neutral-400 uppercase">Journal Subscribers</span>
                            <div className="text-4xl font-display font-black text-white">
                                {stats.total_subscribers}
                            </div>
                            <span className="text-xs font-mono text-neutral-400">Active email digest</span>
                        </div>
                    </div>

                    {/* Inbound Commission Briefs Table */}
                    <div className="p-8 rounded-3xl bg-[#12141c] border border-white/10 space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-display font-bold text-white">
                                    Recent Commission Transmissions
                                </h2>
                                <p className="text-xs text-neutral-400 font-mono mt-0.5">
                                    Project briefs submitted via contact terminal and slide-out panel
                                </p>
                            </div>

                            <span className="font-mono text-xs text-neutral-500">
                                Latest 5 Records
                            </span>
                        </div>

                        {recentInquiries.length === 0 ? (
                            <div className="py-12 text-center text-sm font-mono text-neutral-500">
                                No new commission inquiries recorded.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-white/10 text-xs font-mono text-neutral-400 uppercase">
                                            <th className="py-3 px-4">Client Name</th>
                                            <th className="py-3 px-4">Email</th>
                                            <th className="py-3 px-4">Company</th>
                                            <th className="py-3 px-4">Discipline</th>
                                            <th className="py-3 px-4">Budget Tier</th>
                                            <th className="py-3 px-4">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 font-mono text-xs">
                                        {recentInquiries.map((inq) => (
                                            <tr key={inq.id} className="hover:bg-white/[0.02]">
                                                <td className="py-3.5 px-4 font-sans font-bold text-white">
                                                    {inq.name}
                                                </td>
                                                <td className="py-3.5 px-4 text-neutral-300">
                                                    {inq.email}
                                                </td>
                                                <td className="py-3.5 px-4 text-neutral-400">
                                                    {inq.company || 'Private'}
                                                </td>
                                                <td className="py-3.5 px-4 text-[#d4ff00]">
                                                    {inq.service_interest || 'General'}
                                                </td>
                                                <td className="py-3.5 px-4 text-neutral-300">
                                                    {inq.budget || 'Custom'}
                                                </td>
                                                <td className="py-3.5 px-4">
                                                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
                                                        {inq.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Featured 2D/3D Projects Control */}
                    <div className="p-8 rounded-3xl bg-[#12141c] border border-white/10 space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-display font-bold text-white">
                                    Showcase Flagship Queue
                                </h2>
                                <p className="text-xs text-neutral-400 font-mono mt-0.5">
                                    Pinned sticky cards featured on the homepage
                                </p>
                            </div>
                            <Link
                                href="/work"
                                className="text-xs font-mono uppercase text-[#d4ff00] hover:text-white transition-colors"
                            >
                                Preview Live Portfolio →
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featuredProjects.map((p, idx) => (
                                <div
                                    key={p.id}
                                    className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3"
                                >
                                    <div className="aspect-[16/10] rounded-xl overflow-hidden bg-neutral-900 border border-white/5">
                                        <img
                                            src={p.cover_image}
                                            alt={p.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-mono text-[#d4ff00] uppercase block">
                                            Slot 0{idx + 1} // {p.category?.name}
                                        </span>
                                        <h4 className="font-display font-bold text-base text-white">
                                            {p.title}
                                        </h4>
                                        <p className="text-xs text-neutral-400 font-mono">
                                            {p.client_name} [{p.year}]
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
