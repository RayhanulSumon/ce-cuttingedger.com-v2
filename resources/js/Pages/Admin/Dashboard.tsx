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
    CalendarCheck2,
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
        upcoming_consultations?: number;
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
                            className="gap-2 bg-white border-slate-200 text-ink hover:bg-slate-50 font-semibold text-xs"
                        >
                            <Sparkles className="w-3.5 h-3.5 text-primary" />
                            <span>Digital Twins</span>
                        </Button>
                    </Link>
                    <Link href="/admin/try-on-looks">
                        <Button
                            variant="outline"
                            className="gap-2 bg-white border-slate-200 text-ink hover:bg-slate-50 font-semibold text-xs"
                        >
                            <Shirt className="w-3.5 h-3.5 text-primary" />
                            <span>Virtual Try-On</span>
                        </Button>
                    </Link>
                    <Link href="/admin/orders">
                        <Button className="gap-2 bg-primary hover:bg-primary-hover text-white font-semibold text-xs">
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
                        className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-primary/40 transition-all group space-y-2"
                    >
                        <div className="flex items-center justify-between text-slate-500">
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
                            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary transition-colors" />
                        </div>
                    </Link>

                    <Link
                        href="/admin/digital-twins"
                        className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-primary/40 transition-all group space-y-2"
                    >
                        <div className="flex items-center justify-between text-slate-500">
                            <span className="text-xs font-semibold">Digital Twins</span>
                            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                <Sparkles className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-3xl font-extrabold text-ink tracking-tight">
                            {stats.digital_twins_count ?? 6}
                        </div>
                        <div className="flex items-center justify-between text-xs pt-1">
                            <span className="text-slate-500">
                                Manage models & attributes
                            </span>
                            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary transition-colors" />
                        </div>
                    </Link>

                    <Link
                        href="/admin/try-on-looks"
                        className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-primary/40 transition-all group space-y-2"
                    >
                        <div className="flex items-center justify-between text-slate-500">
                            <span className="text-xs font-semibold">Virtual Try-On Looks</span>
                            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                                <Shirt className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-3xl font-extrabold text-ink tracking-tight">
                            {stats.try_on_looks_count ?? 6}
                        </div>
                        <div className="flex items-center justify-between text-xs pt-1">
                            <span className="text-slate-500">
                                Runway models & garment pins
                            </span>
                            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary transition-colors" />
                        </div>
                    </Link>

                    <Link
                        href="/admin/messages"
                        className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-primary/40 transition-all group space-y-2"
                    >
                        <div className="flex items-center justify-between text-slate-500">
                            <span className="text-xs font-semibold">Customer Inbox</span>
                            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <Mail className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-3xl font-extrabold text-ink tracking-tight">
                            {stats.new_inquiries}
                        </div>
                        <div className="flex items-center justify-between text-xs pt-1">
                            <span className="text-slate-500">
                                {stats.upcoming_consultations ?? 0} booked calls • {stats.total_chat_leads ?? 0} chat leads
                            </span>
                            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary transition-colors" />
                        </div>
                    </Link>
                </div>

                {/* Split Overview: Recent Orders & Recent Messages */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left 7 Columns: Recent Orders & Quotes */}
                    <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div>
                                <h2 className="text-base font-bold text-ink">
                                    Recent Orders & Quotes
                                </h2>
                                <p className="text-xs text-slate-500">
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
                                        className="p-3.5 rounded-xl bg-[#f8fafc] border border-slate-200/70 hover:border-primary/30 transition-colors flex items-center justify-between gap-4"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-xs text-ink">
                                                    #{ord.order_number}
                                                </span>
                                                <span className="text-xs text-slate-400">•</span>
                                                <span className="text-xs font-semibold text-slate-700 truncate">
                                                    {ord.client_name}
                                                </span>
                                            </div>
                                            <div className="text-xs text-slate-500 truncate mt-0.5">
                                                {ord.service_name} • {ord.created_at_formatted}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2.5 shrink-0">
                                            {ord.total_price > 0 ? (
                                                <span className="text-xs font-bold text-ink">
                                                    ${ord.total_price.toFixed(0)}
                                                </span>
                                            ) : (
                                                <span className="text-[11px] font-semibold text-primary">
                                                    Custom Quote
                                                </span>
                                            )}

                                            {ord.status === "completed" ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    Completed
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 capitalize">
                                                    <Clock className="w-3 h-3" />
                                                    {ord.status.replace("_", " ")}
                                                </span>
                                            )}
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="py-10 text-center space-y-2">
                                    <p className="text-sm font-semibold text-slate-600">
                                        No orders or quotes yet
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        New Digital Twin orders and Virtual Try-On quotes will appear here automatically.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right 5 Columns: Recent Contact Messages */}
                    <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div>
                                <h2 className="text-base font-bold text-ink">
                                    Recent Messages
                                </h2>
                                <p className="text-xs text-slate-500">
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
                                        className="p-3.5 rounded-xl bg-[#f8fafc] border border-slate-200/70 hover:border-primary/30 transition-colors flex items-center justify-between gap-3"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <div className="font-semibold text-xs text-ink truncate">
                                                {inq.name}
                                            </div>
                                            <div className="text-xs text-slate-500 truncate mt-0.5">
                                                {inq.company || inq.email}
                                            </div>
                                        </div>
                                        <Badge
                                            className={
                                                inq.status === "new"
                                                    ? "bg-primary/10 text-primary border border-primary/20"
                                                    : "bg-slate-100 text-slate-600 border border-slate-200"
                                            }
                                        >
                                            {inq.status}
                                        </Badge>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-xs text-slate-400 py-10 text-center">
                                    No pending messages.
                                </p>
                            )}
                        </div>

                        {/* Quick Links Footer */}
                        <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2">
                            <Link
                                href="/admin/consultations"
                                className="p-2.5 rounded-xl bg-[#f8fafc] hover:bg-slate-100 border border-slate-200/70 text-center transition-colors"
                            >
                                <CalendarCheck2 className="w-4 h-4 text-primary mx-auto mb-1" />
                                <span className="text-[11px] font-semibold text-slate-700 block">
                                    Booked Calls
                                </span>
                            </Link>
                            <Link
                                href="/admin/chat-sessions"
                                className="p-2.5 rounded-xl bg-[#f8fafc] hover:bg-slate-100 border border-slate-200/70 text-center transition-colors"
                            >
                                <MessageSquareText className="w-4 h-4 text-primary mx-auto mb-1" />
                                <span className="text-[11px] font-semibold text-slate-700 block">
                                    Live Chat
                                </span>
                            </Link>
                            <Link
                                href="/admin/projects"
                                className="p-2.5 rounded-xl bg-[#f8fafc] hover:bg-slate-100 border border-slate-200/70 text-center transition-colors"
                            >
                                <FolderKanban className="w-4 h-4 text-primary mx-auto mb-1" />
                                <span className="text-[11px] font-semibold text-slate-700 block">
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
