import React from "react";
import { Link } from "@inertiajs/react";
import { AdminLayout } from "@/Layouts/Admin/AdminLayout";
import { AdminPageHeader } from "@/Components/Admin/UI/AdminPageHeader";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Project, ContactMessage } from "@/types/models";
import {
    FolderKanban,
    Layers,
    Mail,
    Send,
    ArrowUpRight,
    Sparkles,
    CheckCircle2,
    Users,
} from "lucide-react";

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
        <AdminLayout title="COMMAND CENTER">
            <AdminPageHeader
                title="Command Center"
                description="Studio telemetry, flagship deployment registry, and prospect inquiry alerts."
                badge="REALTIME ENGINE"
            >
                <Link href="/admin/projects">
                    <Button className="gap-2">
                        <FolderKanban className="w-4 h-4" />
                        <span>Manage Flagships</span>
                    </Button>
                </Link>
            </AdminPageHeader>

            <div className="space-y-10">
                {/* KPI Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="p-6 rounded-2xl bg-[#12141c] border border-white/10 space-y-3 relative overflow-hidden group hover:border-[#d4ff00]/40 transition-colors">
                        <div className="flex items-center justify-between text-neutral-400">
                            <span className="font-mono text-xs uppercase tracking-wider">
                                Live Projects
                            </span>
                            <FolderKanban className="w-4 h-4 text-[#d4ff00]" />
                        </div>
                        <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                            {stats.total_projects}
                        </div>
                        <span className="text-xs font-mono text-[#d4ff00] block">
                            Flagship 2D/3D builds
                        </span>
                    </div>

                    <div className="p-6 rounded-2xl bg-[#12141c] border border-white/10 space-y-3 relative overflow-hidden group hover:border-[#d4ff00]/40 transition-colors">
                        <div className="flex items-center justify-between text-neutral-400">
                            <span className="font-mono text-xs uppercase tracking-wider">
                                Capabilities
                            </span>
                            <Layers className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                            {stats.total_services}
                        </div>
                        <span className="text-xs font-mono text-emerald-400 block">
                            Disciplines active
                        </span>
                    </div>

                    <div className="p-6 rounded-2xl bg-[#12141c] border border-white/10 space-y-3 relative overflow-hidden group hover:border-[#d4ff00]/40 transition-colors">
                        <div className="flex items-center justify-between text-neutral-400">
                            <span className="font-mono text-xs uppercase tracking-wider">
                                New Inquiries
                            </span>
                            <Mail className="w-4 h-4 text-amber-400" />
                        </div>
                        <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                            {stats.new_inquiries}
                        </div>
                        <span className="text-xs font-mono text-amber-400 block">
                            Awaiting response
                        </span>
                    </div>

                    <div className="p-6 rounded-2xl bg-[#12141c] border border-white/10 space-y-3 relative overflow-hidden group hover:border-[#d4ff00]/40 transition-colors">
                        <div className="flex items-center justify-between text-neutral-400">
                            <span className="font-mono text-xs uppercase tracking-wider">
                                Subscribers
                            </span>
                            <Send className="w-4 h-4 text-sky-400" />
                        </div>
                        <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                            {stats.total_subscribers}
                        </div>
                        <span className="text-xs font-mono text-sky-400 block">
                            Dispatch audience
                        </span>
                    </div>
                </div>

                {/* Split Overview: Inquiries & Flagships */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Inquiries */}
                    <div className="p-6 rounded-2xl bg-[#12141c] border border-white/10 space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b border-white/10">
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-[#d4ff00]" />
                                <h2 className="text-sm font-mono uppercase tracking-wider text-white font-bold">
                                    Recent Inquiries Inbox
                                </h2>
                            </div>
                            <Link
                                href="/admin/messages"
                                className="text-xs font-mono text-[#d4ff00] hover:underline flex items-center gap-1"
                            >
                                <span>View all</span>
                                <ArrowUpRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        <div className="space-y-3">
                            {recentInquiries.length > 0 ? (
                                recentInquiries.map((inq) => (
                                    <div
                                        key={inq.id}
                                        className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors flex items-center justify-between"
                                    >
                                        <div>
                                            <div className="font-semibold text-sm text-white">
                                                {inq.name}
                                            </div>
                                            <div className="text-xs text-neutral-400 font-mono">
                                                {inq.company || inq.email} •{" "}
                                                <span className="text-[#d4ff00]">
                                                    {inq.budget || "Custom"}
                                                </span>
                                            </div>
                                        </div>
                                        <Badge
                                            variant={
                                                inq.status === "new"
                                                    ? "accent"
                                                    : "secondary"
                                            }
                                        >
                                            {inq.status.toUpperCase()}
                                        </Badge>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-neutral-500 font-mono py-8 text-center">
                                    No pending inquiries.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Featured Projects */}
                    <div className="p-6 rounded-2xl bg-[#12141c] border border-white/10 space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b border-white/10">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-[#d4ff00]" />
                                <h2 className="text-sm font-mono uppercase tracking-wider text-white font-bold">
                                    Featured Flagships
                                </h2>
                            </div>
                            <Link
                                href="/admin/projects"
                                className="text-xs font-mono text-[#d4ff00] hover:underline flex items-center gap-1"
                            >
                                <span>Curate</span>
                                <ArrowUpRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        <div className="space-y-3">
                            {featuredProjects.length > 0 ? (
                                featuredProjects.map((proj) => (
                                    <div
                                        key={proj.id}
                                        className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={proj.cover_image}
                                                alt={proj.title}
                                                className="w-10 h-10 rounded-lg object-cover bg-neutral-900 border border-white/10"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src =
                                                        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80";
                                                }}
                                            />
                                            <div>
                                                <div className="font-semibold text-sm text-white">
                                                    {proj.title}
                                                </div>
                                                <div className="text-xs text-neutral-400 font-mono">
                                                    {proj.client_name} • {proj.year}
                                                </div>
                                            </div>
                                        </div>
                                        <Badge variant="outline">
                                            #{proj.sort_order}
                                        </Badge>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-neutral-500 font-mono py-8 text-center">
                                    No featured projects assigned.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
