import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    ArrowUpRight,
    CheckCircle2,
    Clock,
    Coins,
    CreditCard,
    Eye,
    History,
    Plus,
    ShoppingBag,
} from 'lucide-react';
import { AdminPageHeader } from '@/Components/Admin/UI/AdminPageHeader';
import { ClientOrderDetailModal } from '@/Components/Client/ClientOrderDetailModal';
import {
    ClientOrderItem,
    CreditSummary,
    OrderStatusBadge,
    formatCreditExpiryText,
    formatOrderAmount,
} from '@/Components/Client/types';
import { SeoHead } from '@/Components/Common/SeoHead';
import { Button } from '@/Components/ui/button';
import { getClientLayout } from '@/Layouts/Client/ClientLayout';
import { PageProps } from '@/types';

interface ClientDashboardProps {
    orders: ClientOrderItem[];
    stats: {
        total_orders: number;
        in_progress: number;
        completed: number;
        digital_twin_orders?: number;
        try_on_quotes?: number;
    };
    creditSummary?: CreditSummary;
}

export default function ClientDashboard({ orders = [], stats, creditSummary }: ClientDashboardProps) {
    const { auth } = usePage<PageProps>().props;
    const user = auth?.user ?? null;
    const [selectedOrder, setSelectedOrder] = useState<ClientOrderItem | null>(null);

    const availableCredits = creditSummary?.available_credits ?? user?.credits_balance ?? 0;
    const activePlanName = creditSummary?.active_plan_name ?? user?.active_plan_name ?? null;
    const expiresAtFormatted =
        creditSummary?.expires_at_formatted ?? user?.credits_expires_at_formatted ?? null;
    const daysRemaining = creditSummary?.days_remaining ?? null;
    const isExpired = Boolean(creditSummary?.is_expired);
    const totalPurchasedCredits = creditSummary?.total_purchased_credits ?? 0;
    const pendingCredits = creditSummary?.pending_credits ?? 0;
    const totalUsedCredits = creditSummary?.total_used_credits ?? 0;

    return (
        <>
            <SeoHead
                title="Client Workspace — CuttingEdger"
                description="Track your CuttingEdger studio orders, quotes, credits, and deliverables."
            />

            <AdminPageHeader
                title={`Welcome, ${user?.name || 'Client'}`}
                description="Track your active orders, quotes, studio credits, and deliverables."
            >
                <div className="flex flex-wrap items-center gap-2">
                    <Link href="/portal/orders" preserveScroll prefetch>
                        <Button
                            variant="outline"
                            className="cursor-pointer gap-2 border-slate-200 bg-white text-xs font-semibold text-ink hover:bg-slate-50"
                        >
                            <ShoppingBag className="h-3.5 w-3.5 text-primary" />
                            <span>My Orders ({orders.length})</span>
                        </Button>
                    </Link>
                    <Link href="/capabilities">
                        <Button className="cursor-pointer gap-2 bg-primary text-xs font-semibold text-white hover:bg-primary-hover">
                            <Plus className="h-3.5 w-3.5" />
                            <span>New Order / Quote</span>
                        </Button>
                    </Link>
                </div>
            </AdminPageHeader>

            <div className="space-y-8">
                {/* Studio Credit Wallet Banner */}
                <div className="rounded-2xl border border-primary/25 bg-white p-6 shadow-xs">
                    <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                        <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary-ink">
                                    <Coins className="h-3.5 w-3.5" />
                                    Studio Credit Wallet
                                </span>
                                <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600">
                                    {activePlanName || 'No active plan'}
                                </span>
                                {expiresAtFormatted && (
                                    <span
                                        className={`rounded-full border px-3 py-1 text-[11px] font-semibold ${
                                            isExpired
                                                ? 'border-rose-200 bg-rose-50 text-rose-700'
                                                : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                        }`}
                                    >
                                        {formatCreditExpiryText(
                                            expiresAtFormatted,
                                            daysRemaining,
                                            isExpired,
                                            ''
                                        )}
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-wrap items-baseline gap-6 pt-1">
                                <div>
                                    <span className="block text-xs font-medium text-slate-500">
                                        Available Credits
                                    </span>
                                    <span className="text-3xl font-extrabold tracking-tight tabular-nums text-ink">
                                        {availableCredits.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-5 border-l border-slate-200 pl-5 text-xs">
                                    <div>
                                        <span className="block text-slate-400">Purchased</span>
                                        <span className="font-bold tabular-nums text-emerald-700">
                                            +{totalPurchasedCredits.toLocaleString()}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-slate-400">Used</span>
                                        <span className="font-bold tabular-nums text-ink">
                                            {totalUsedCredits.toLocaleString()}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-slate-400">Pending</span>
                                        <span className="font-bold tabular-nums text-amber-700">
                                            {pendingCredits.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5">
                            <Link href="/portal/credits" preserveScroll prefetch>
                                <Button
                                    variant="outline"
                                    className="cursor-pointer gap-2 border-slate-200 bg-white text-xs font-semibold text-ink hover:bg-slate-50"
                                >
                                    <History className="h-3.5 w-3.5 text-primary" />
                                    <span>Credit History</span>
                                </Button>
                            </Link>
                            <Link
                                href="/pricing"
                                className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-xs font-semibold text-ink transition-colors hover:border-primary hover:text-primary"
                            >
                                <CreditCard className="h-3.5 w-3.5" />
                                <span>Buy / Top Up Credits</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Link
                        href="/portal/orders"
                        preserveScroll
                        prefetch
                        className="group space-y-2 rounded-2xl border border-slate-200/90 bg-white p-5 text-left shadow-xs transition-all hover:border-primary/40"
                    >
                        <div className="flex items-center justify-between text-slate-500">
                            <span className="text-xs font-semibold">Total Orders &amp; Quotes</span>
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <ShoppingBag className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="text-3xl font-extrabold tracking-tight text-ink">
                            {stats.total_orders}
                        </div>
                        <div className="flex items-center justify-between pt-1 text-xs">
                            <span className="text-slate-500">All submitted orders</span>
                            <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 transition-colors group-hover:text-primary" />
                        </div>
                    </Link>

                    <Link
                        href="/portal/orders"
                        preserveScroll
                        prefetch
                        className="group space-y-2 rounded-2xl border border-slate-200/90 bg-white p-5 text-left shadow-xs transition-all hover:border-primary/40"
                    >
                        <div className="flex items-center justify-between text-slate-500">
                            <span className="text-xs font-semibold">In Progress / Review</span>
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                                <Clock className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="text-3xl font-extrabold tracking-tight text-ink">
                            {stats.in_progress}
                        </div>
                        <div className="flex items-center justify-between pt-1 text-xs">
                            <span className="font-semibold text-amber-600">Active studio production</span>
                            <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 transition-colors group-hover:text-primary" />
                        </div>
                    </Link>

                    <Link
                        href="/portal/orders"
                        preserveScroll
                        prefetch
                        className="group space-y-2 rounded-2xl border border-slate-200/90 bg-white p-5 text-left shadow-xs transition-all hover:border-primary/40"
                    >
                        <div className="flex items-center justify-between text-slate-500">
                            <span className="text-xs font-semibold">Completed Deliverables</span>
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                <CheckCircle2 className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="text-3xl font-extrabold tracking-tight text-ink">
                            {stats.completed}
                        </div>
                        <div className="flex items-center justify-between pt-1 text-xs">
                            <span className="font-semibold text-emerald-600">Ready for download</span>
                            <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 transition-colors group-hover:text-primary" />
                        </div>
                    </Link>

                    <Link
                        href="/portal/credits"
                        preserveScroll
                        prefetch
                        className="group space-y-2 rounded-2xl border border-slate-200/90 bg-white p-5 text-left shadow-xs transition-all hover:border-primary/40"
                    >
                        <div className="flex items-center justify-between text-slate-500">
                            <span className="text-xs font-semibold">Account Credits</span>
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <Coins className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="text-3xl font-extrabold tracking-tight tabular-nums text-ink">
                            {availableCredits.toLocaleString()}
                        </div>
                        <div className="flex items-center justify-between pt-1 text-xs">
                            <span className="truncate pr-2 font-semibold text-primary">
                                {expiresAtFormatted
                                    ? formatCreditExpiryText(
                                          expiresAtFormatted,
                                          daysRemaining,
                                          isExpired,
                                          'Studio credit balance'
                                      )
                                    : pendingCredits > 0
                                      ? `+${pendingCredits.toLocaleString()} pending approval`
                                      : activePlanName || 'Studio credit balance'}
                            </span>
                            <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-slate-400 transition-colors group-hover:text-primary" />
                        </div>
                    </Link>
                </div>

                {/* Recent Orders & Quotes Card */}
                <div className="space-y-4 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div>
                            <h2 className="text-base font-bold text-ink">Recent Orders &amp; Quotes</h2>
                            <p className="text-xs text-slate-500">
                                Inspect specifications, uploaded files, and production status
                            </p>
                        </div>
                        {orders.length > 0 && (
                            <Link
                                href="/portal/orders"
                                preserveScroll
                                prefetch
                                className="flex cursor-pointer items-center gap-1 text-xs font-semibold text-primary hover:underline"
                            >
                                <span>View all ({orders.length})</span>
                                <ArrowUpRight className="h-3.5 w-3.5" />
                            </Link>
                        )}
                    </div>

                    <div className="space-y-2.5">
                        {orders.length > 0 ? (
                            orders.slice(0, 6).map((order) => (
                                <div
                                    key={order.id}
                                    className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200/70 bg-[#f8fafc] p-4 transition-colors hover:border-primary/30 sm:flex-row sm:items-center"
                                >
                                    <div className="min-w-0 flex-1 space-y-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-xs font-bold text-ink">
                                                #{order.order_number}
                                            </span>
                                            <OrderStatusBadge status={order.status} />
                                            <span className="text-xs text-slate-400">
                                                {order.created_at_formatted}
                                            </span>
                                        </div>
                                        <div className="text-sm font-bold text-ink">{order.service_name}</div>
                                        <div className="text-xs text-slate-500">
                                            Turnaround: <strong>{order.turnaround}</strong> •{' '}
                                            {order.uploaded_count} file(s) attached
                                        </div>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-3">
                                        <div className="text-left sm:text-right">
                                            <span className="block text-[10px] font-bold uppercase text-slate-400">
                                                Amount
                                            </span>
                                            <span className="text-xs font-bold text-ink">
                                                {formatOrderAmount(order)}
                                            </span>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setSelectedOrder(order)}
                                            className="cursor-pointer gap-1.5 text-xs"
                                        >
                                            <Eye className="h-3.5 w-3.5" />
                                            <span>View Details</span>
                                        </Button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="space-y-3 py-12 text-center">
                                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                    <ShoppingBag className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-ink">No orders or quotes yet</p>
                                    <p className="mx-auto mt-0.5 max-w-md text-xs text-slate-500">
                                        Explore our studio capabilities to place a new order or request a custom project quote.
                                    </p>
                                </div>
                                <Link href="/capabilities">
                                    <Button className="cursor-pointer bg-primary text-xs font-semibold text-white hover:bg-primary-hover">
                                        <Plus className="mr-1.5 h-3.5 w-3.5" />
                                        Browse Services &amp; Start Order
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ClientOrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
        </>
    );
}

ClientDashboard.layout = getClientLayout;
