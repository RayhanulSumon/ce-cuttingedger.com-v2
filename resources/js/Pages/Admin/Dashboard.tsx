import React from "react";
import { Link } from "@inertiajs/react";
import { AdminLayout } from "@/Layouts/Admin/AdminLayout";
import { AdminPageHeader } from "@/Components/Admin/UI/AdminPageHeader";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { ContactMessage, Project } from "@/types/models";
import {
    ShoppingBag,
    Sparkles,
    Shirt,
    Mail,
    ArrowUpRight,
    MessageSquareText,
    FolderKanban,
    Clock,
    CheckCircle2,
} from "lucide-react";

interface RecentOrderSummary {
    id: number;
    order_number: string;
    order_type: string;
    client_name: string;
    client_email: string;
    service_name: string;
    total_price: number;
    status: string;
    created_at_formatted: string;
}

interface AdminDashboardProps {
    stats: {
        total_orders?: number;
        pending_orders?: number;
        digital_twins_count?: number;
        try_on_looks_count?: number;
        total_projects: number;
        total_capabilities: number;
        new_inquiries: number;
        total_subscribers: number;
        total_chat_leads?: number;
    };
    recentOrders?: RecentOrderSummary[];
    recentInquiries: ContactMessage[];
    featuredProjects: Project[];
}

export default function Dashboard({
    stats,
    recentOrders = [],
    recentInquiries = [],
}: AdminDashboardProps) {
    return (
        <AdminLayout title="Dashboard">
            <AdminPageHeader
                title="Dashboard"
                description="Overview of your Digital Twins, Virtual Try-On quotes, client orders, and customer messages."
            >
                <div className="flex flex-wrap items-center gap-2">
                    <Link href="/admin/digital-twins">
                        <Button
                            variant="outline"
                            className="gap-2 bg-surface border-line text-ink hover:bg-surface-2 font-semibold text-xs"
                        >
                            <Sparkles className="w-3.5 h-3.5 text-primary" />
                            <span>Digital Twins</span>
                        </Button>
                    </Link>
                    <Link href="/admin/try-on-looks">
                        <Button
                            variant="outline"
                            className="gap-2 bg-surface border-line text-ink hover:bg-surface-2 font-semibold text-xs"
                        >
                            <Shirt className="w-3.5 h-3.5 text-primary" />
                            <span>Virtual Try-On</span>
                        </Button>
                    </Link>
                    <Link href="/admin/orders">
                        <Button className="gap-2 bg-primary hover:bg-primary-hover text-primary-foreground font-semibold text-xs">
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>View Orders & Quotes</span>
                        </Button>
                    </Link>
                </div>
            </AdminPageHeader>

            <div className="space-y-8">
                {/* Primary KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link
                        href="/admin/orders"
                        className="p-5 rounded-2xl bg-surface border border-line shadow-xs hover:border-primary/40 transition-all group space-y-2"
                    >
                        <div className="flex items-center justify-between text-subtle">
                            <span className="text-xs font-semibold">Orders & Quotes</span>
                            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                <ShoppingBag className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-3xl font-extrabold text-ink tracking-tight">
                            {stats.total_orders ?? 0}
                        </div>
                        <div className="flex items-center justify-between text-xs pt-1">
                            <span className="text-primary font-semibold">
                                {stats.pending_orders ?? 0} pending review
                            </span>
                            <ArrowUpRight className="w-3.5 h-3.5 text-faint group-hover:text-primary transition-colors" />
                        </div>
                    </Link>

                    <Link
                        href="/admin/digital-twins"
                        className="p-5 rounded-2xl bg-surface border border-line shadow-xs hover:border-primary/40 transition-all group space-y-2"
                    >
                        <div className="flex items-center justify-between text-subtle">
                            <span className="text-xs font-semibold">Digital Twins</span>
                            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                <Sparkles className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-3xl font-extrabold text-ink tracking-tight">
                            {stats.digital_twins_count ?? 6}
                        </div>
                        <div className="flex items-center justify-between text-xs pt-1">
                            <span className="text-subtle">
                                Manage models & attributes
                            </span>
                            <ArrowUpRight className="w-3.5 h-3.5 text-faint group-hover:text-primary transition-colors" />
                        </div>
                    </Link>

                    <Link
                        href="/admin/try-on-looks"
                        className="p-5 rounded-2xl bg-surface border border-line shadow-xs hover:border-primary/40 transition-all group space-y-2"
                    >
                        <div className="flex items-center justify-between text-subtle">
                            <span className="text-xs font-semibold">Virtual Try-On Looks</span>
                            <div className="w-8 h-8 rounded-xl bg-info-soft text-info flex items-center justify-center">
                                <Shirt className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-3xl font-extrabold text-ink tracking-tight">
                            {stats.try_on_looks_count ?? 6}
                        </div>
                        <div className="flex items-center justify-between text-xs pt-1">
                            <span className="text-subtle">
                                Runway models & garment pins
                            </span>
                            <ArrowUpRight className="w-3.5 h-3.5 text-faint group-hover:text-primary transition-colors" />
                        </div>
                    </Link>

                    <Link
                        href="/admin/messages"
                        className="p-5 rounded-2xl bg-surface border border-line shadow-xs hover:border-primary/40 transition-all group space-y-2"
                    >
                        <div className="flex items-center justify-between text-subtle">
                            <span className="text-xs font-semibold">Customer Inbox</span>
                            <div className="w-8 h-8 rounded-xl bg-success-soft text-success flex items-center justify-center">
                                <Mail className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-3xl font-extrabold text-ink tracking-tight">
                            {stats.new_inquiries}
                        </div>
                        <div className="flex items-center justify-between text-xs pt-1">
                            <span className="text-subtle">
                                {stats.total_chat_leads ?? 0} chat leads • {stats.total_subscribers} subscribers
                            </span>
                            <ArrowUpRight className="w-3.5 h-3.5 text-faint group-hover:text-primary transition-colors" />
                        </div>
                    </Link>
                </div>

                {/* Split Overview: Recent Orders & Recent Messages */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left 7 Columns: Recent Orders & Quotes */}
                    <div className="lg:col-span-7 p-6 rounded-2xl bg-surface border border-line shadow-xs space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-line">
                            <div>
                                <h2 className="text-base font-bold text-ink">
                                    Recent Orders & Quotes
                                </h2>
                                <p className="text-xs text-subtle">
                                    Latest Digital Twin orders and Virtual Try-On quote requests
                                </p>
                            </div>
                            <Link
                                href="/admin/orders"
                                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                            >
                                <span>View all</span>
                                <ArrowUpRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        <div className="space-y-2.5">
                            {recentOrders.length > 0 ? (
                                recentOrders.map((ord) => (
                                    <Link
                                        key={ord.id}
                                        href="/admin/orders"
                                        className="p-3.5 rounded-xl bg-surface-2 border border-line hover:border-primary/30 transition-colors flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 sm:gap-4"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-xs text-ink">
                                                    #{ord.order_number}
                                                </span>
                                                <span className="text-xs text-faint">•</span>
                                                <span className="text-xs font-semibold text-ink-2 truncate">
                                                    {ord.client_name}
                                                </span>
                                            </div>
                                            <div className="text-xs text-subtle truncate mt-0.5">
                                                {ord.service_name} • {ord.created_at_formatted}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2.5 shrink-0">
                                            {ord.total_price > 0 ? (
                                                <span className="text-xs font-bold text-ink">
                                                    ${ord.total_price.toFixed(0)}
                                                </span>
                                            ) : (
                                                <span className="text-2xs font-semibold text-primary">
                                                    Custom Quote
                                                </span>
                                            )}

                                            {ord.status === "completed" ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-2xs font-semibold bg-success-soft text-success border border-success/25">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    Completed
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-2xs font-semibold bg-warning-soft text-warning border border-warning/25 capitalize">
                                                    <Clock className="w-3 h-3" />
                                                    {ord.status.replace("_", " ")}
                                                </span>
                                            )}
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="py-10 text-center space-y-2">
                                    <p className="text-sm font-semibold text-muted">
                                        No orders or quotes yet
                                    </p>
                                    <p className="text-xs text-faint">
                                        New Digital Twin orders and Virtual Try-On quotes will appear here automatically.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right 5 Columns: Recent Contact Messages */}
                    <div className="lg:col-span-5 p-6 rounded-2xl bg-surface border border-line shadow-xs space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-line">
                            <div>
                                <h2 className="text-base font-bold text-ink">
                                    Recent Messages
                                </h2>
                                <p className="text-xs text-subtle">
                                    Latest inquiries from the contact form
                                </p>
                            </div>
                            <Link
                                href="/admin/messages"
                                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                            >
                                <span>Open inbox</span>
                                <ArrowUpRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        <div className="space-y-2.5">
                            {recentInquiries.length > 0 ? (
                                recentInquiries.map((inq) => (
                                    <Link
                                        key={inq.id}
                                        href="/admin/messages"
                                        className="p-3.5 rounded-xl bg-surface-2 border border-line hover:border-primary/30 transition-colors flex items-center justify-between gap-3"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <div className="font-semibold text-xs text-ink truncate">
                                                {inq.name}
                                            </div>
                                            <div className="text-xs text-subtle truncate mt-0.5">
                                                {inq.company || inq.email}
                                            </div>
                                        </div>
                                        <Badge
                                            className={
                                                inq.status === "new"
                                                    ? "bg-primary/10 text-primary border border-primary/20"
                                                    : "bg-surface-2 text-muted border border-line"
                                            }
                                        >
                                            {inq.status}
                                        </Badge>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-xs text-faint py-10 text-center">
                                    No pending messages.
                                </p>
                            )}
                        </div>

                        {/* Quick Links Footer */}
                        <div className="pt-3 border-t border-line grid grid-cols-2 sm:grid-cols-3 gap-2">
                            <Link
                                href="/admin/messages"
                                className="p-2.5 rounded-xl bg-surface-2 hover:bg-surface-2 border border-line text-center transition-colors"
                            >
                                <Mail className="w-4 h-4 text-primary mx-auto mb-1" />
                                <span className="text-2xs font-semibold text-ink-2 block">
                                    Messages
                                </span>
                            </Link>
                            <Link
                                href="/admin/chat-sessions"
                                className="p-2.5 rounded-xl bg-surface-2 hover:bg-surface-2 border border-line text-center transition-colors"
                            >
                                <MessageSquareText className="w-4 h-4 text-primary mx-auto mb-1" />
                                <span className="text-2xs font-semibold text-ink-2 block">
                                    Live Chat
                                </span>
                            </Link>
                            <Link
                                href="/admin/projects"
                                className="p-2.5 rounded-xl bg-surface-2 hover:bg-surface-2 border border-line text-center transition-colors"
                            >
                                <FolderKanban className="w-4 h-4 text-primary mx-auto mb-1" />
                                <span className="text-2xs font-semibold text-ink-2 block">
                                    Case Studies
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
