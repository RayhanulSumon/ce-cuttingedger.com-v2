import React, { useMemo, useState } from 'react';
import { Link } from '@inertiajs/react';
import { Download, Eye, Plus, Search, ShoppingBag } from 'lucide-react';
import { AdminPageHeader } from '@/Components/Admin/UI/AdminPageHeader';
import { ClientOrderDetailModal } from '@/Components/Client/ClientOrderDetailModal';
import {
    ClientOrderItem,
    OrderStatusBadge,
    formatOrderAmount,
} from '@/Components/Client/types';
import { SeoHead } from '@/Components/Common/SeoHead';
import { Button } from '@/Components/ui/button';
import { ClientLayout } from '@/Layouts/Client/ClientLayout';

type OrderStatusFilter = 'all' | 'in_progress' | 'completed';

const IN_PROGRESS_STATUSES: ClientOrderItem['status'][] = ['pending', 'in_production', 'review'];

interface ClientOrdersProps {
    orders: ClientOrderItem[];
}

export default function ClientOrders({ orders = [] }: ClientOrdersProps) {
    const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<ClientOrderItem | null>(null);

    const metrics = useMemo(() => {
        const inProgressCount = orders.filter((o) =>
            IN_PROGRESS_STATUSES.includes(o.status)
        ).length;
        const completedCount = orders.filter((o) => o.status === 'completed').length;
        const deliverablesCount = orders.filter(
            (o) => Array.isArray(o.completed_files) && o.completed_files.length > 0
        ).length;

        return {
            inProgressCount,
            completedCount,
            deliverablesCount,
        };
    }, [orders]);

    const filteredOrders = useMemo(() => {
        const needle = searchTerm.trim().toLowerCase();

        return orders.filter((order) => {
            if (statusFilter === 'in_progress' && !IN_PROGRESS_STATUSES.includes(order.status)) {
                return false;
            }
            if (statusFilter === 'completed' && order.status !== 'completed') {
                return false;
            }
            if (needle !== '') {
                const matchesNumber = order.order_number.toLowerCase().includes(needle);
                const matchesService = order.service_name.toLowerCase().includes(needle);
                return matchesNumber || matchesService;
            }
            return true;
        });
    }, [orders, statusFilter, searchTerm]);

    return (
        <>
            <SeoHead
                title="Orders — Client Workspace"
                description="Track your submitted studio orders, custom quotes, turnaround times, and downloadable deliverables."
            />

            <AdminPageHeader
                title="My Orders & Quotes"
                description="Track your submitted studio orders, custom quotes, turnaround times, and downloadable deliverables."
                actionLabel="New Order / Quote"
                actionHref="/capabilities"
            />

            <div className="space-y-6">
                {/* 4 Summary KPI Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-1.5 rounded-2xl border border-primary/30 bg-white p-5 shadow-xs">
                        <span className="block text-xs font-semibold text-slate-500">
                            Total Orders
                        </span>
                        <div className="text-3xl font-extrabold tabular-nums text-ink">
                            {orders.length.toLocaleString()}
                        </div>
                        <span className="block text-xs text-slate-500">
                            Submitted orders &amp; quotes
                        </span>
                    </div>

                    <div className="space-y-1.5 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
                        <span className="block text-xs font-semibold text-slate-500">
                            In Progress
                        </span>
                        <div className="text-3xl font-extrabold tabular-nums text-amber-700">
                            {metrics.inProgressCount.toLocaleString()}
                        </div>
                        <span className="block text-xs text-slate-500">
                            Pending, in production &amp; QA
                        </span>
                    </div>

                    <div className="space-y-1.5 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
                        <span className="block text-xs font-semibold text-slate-500">
                            Completed
                        </span>
                        <div className="text-3xl font-extrabold tabular-nums text-emerald-700">
                            {metrics.completedCount.toLocaleString()}
                        </div>
                        <span className="block text-xs text-slate-500">
                            Finished studio orders
                        </span>
                    </div>

                    <div className="space-y-1.5 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
                        <span className="block text-xs font-semibold text-slate-500">
                            Deliverables Ready
                        </span>
                        <div className="text-3xl font-extrabold tabular-nums text-ink">
                            {metrics.deliverablesCount.toLocaleString()}
                        </div>
                        <span className="block text-xs text-slate-500">
                            Orders with files to download
                        </span>
                    </div>
                </div>

                {/* Compact Filter & Search Bar */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                        {(
                            [
                                { id: 'all', label: `All (${orders.length})` },
                                {
                                    id: 'in_progress',
                                    label: `In Progress (${metrics.inProgressCount})`,
                                },
                                {
                                    id: 'completed',
                                    label: `Completed (${metrics.completedCount})`,
                                },
                            ] as const
                        ).map((pill) => (
                            <button
                                key={pill.id}
                                type="button"
                                onClick={() => setStatusFilter(pill.id)}
                                className={`cursor-pointer rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                                    statusFilter === pill.id
                                        ? 'bg-primary text-white'
                                        : 'border border-slate-200 bg-white text-slate-600 hover:text-ink'
                                }`}
                            >
                                {pill.label}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full sm:w-64">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search order # or service..."
                            aria-label="Search orders"
                            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-ink placeholder:text-slate-400 focus:border-primary focus:outline-none"
                        />
                    </div>
                </div>

                {/* Structured Orders Table Card */}
                <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
                    {filteredOrders.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="border-b border-slate-200 bg-[#f8fafc] text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                    <tr>
                                        <th className="px-5 py-3.5">Order #</th>
                                        <th className="px-5 py-3.5">Service</th>
                                        <th className="px-5 py-3.5">Turnaround</th>
                                        <th className="px-5 py-3.5">Amount</th>
                                        <th className="px-5 py-3.5">Status</th>
                                        <th className="px-5 py-3.5">Date</th>
                                        <th className="px-5 py-3.5 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredOrders.map((order) => {
                                        const isCreditOrder = order.order_type === 'credit_usage';
                                        const hasDeliverables =
                                            Array.isArray(order.completed_files) &&
                                            order.completed_files.length > 0;

                                        return (
                                            <tr
                                                key={order.id}
                                                className="transition-colors hover:bg-slate-50/70"
                                            >
                                                <td className="whitespace-nowrap px-5 py-4 font-bold text-ink">
                                                    #{order.order_number}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="text-sm font-bold text-ink">
                                                        {order.service_name}
                                                    </div>
                                                    <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-slate-500">
                                                        <span>
                                                            {order.quantity.toLocaleString()} asset(s) ·{' '}
                                                            {order.uploaded_count} file(s)
                                                        </span>
                                                        {isCreditOrder && (
                                                            <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                                                                Paid with Credits
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-700">
                                                    {order.turnaround}
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4">
                                                    <span
                                                        className={`font-extrabold tabular-nums ${
                                                            isCreditOrder ? 'text-primary' : 'text-ink'
                                                        }`}
                                                    >
                                                        {formatOrderAmount(order)}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4">
                                                    <OrderStatusBadge status={order.status} />
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                                                    {order.created_at_formatted}
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4 text-right">
                                                    <div className="inline-flex items-center justify-end gap-2">
                                                        {hasDeliverables && (
                                                            <span
                                                                title="Deliverables ready"
                                                                className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700"
                                                            >
                                                                <Download className="h-3 w-3" />
                                                                <span>{order.completed_files.length}</span>
                                                            </span>
                                                        )}
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setSelectedOrder(order)}
                                                            className="cursor-pointer gap-1 text-xs"
                                                        >
                                                            <Eye className="h-3.5 w-3.5" />
                                                            <span>View</span>
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="space-y-3 p-12 text-center">
                            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                <ShoppingBag className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-ink">No orders or quotes yet</p>
                                <p className="mx-auto mt-1 max-w-md text-xs text-slate-500">
                                    Explore our studio capabilities to place a new order or request a custom project quote.
                                </p>
                            </div>
                            <Link
                                href="/capabilities"
                                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-hover"
                            >
                                <Plus className="h-3.5 w-3.5" />
                                <span>Browse Services &amp; Start Order</span>
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3 p-12 text-center">
                            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                                <Search className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-ink">No matching orders</p>
                                <p className="mx-auto mt-1 max-w-md text-xs text-slate-500">
                                    Try clearing your search or switching the status filter.
                                </p>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setStatusFilter('all');
                                    setSearchTerm('');
                                }}
                                className="cursor-pointer text-xs font-semibold"
                            >
                                Clear Filters
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <ClientOrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
        </>
    );
}

ClientOrders.layout = (page: React.ReactNode) => (
    <ClientLayout title="Orders">{page}</ClientLayout>
);
