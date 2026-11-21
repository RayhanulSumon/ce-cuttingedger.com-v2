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
import { getClientLayout } from '@/Layouts/Client/ClientLayout';

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
            (o) =>
                Boolean(o.digital_twin_download_url) ||
                (Array.isArray(o.completed_files) && o.completed_files.length > 0)
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
                    <div className="space-y-1.5 rounded-2xl border border-primary/30 bg-surface p-5 shadow-xs">
                        <span className="block text-xs font-semibold text-subtle">
                            Total Orders
                        </span>
                        <div className="text-3xl font-extrabold tabular-nums text-ink">
                            {orders.length.toLocaleString()}
                        </div>
                        <span className="block text-xs text-subtle">
                            Submitted orders &amp; quotes
                        </span>
                    </div>

                    <div className="space-y-1.5 rounded-2xl border border-line bg-surface p-5 shadow-xs">
                        <span className="block text-xs font-semibold text-subtle">
                            In Progress
                        </span>
                        <div className="text-3xl font-extrabold tabular-nums text-warning">
                            {metrics.inProgressCount.toLocaleString()}
                        </div>
                        <span className="block text-xs text-subtle">
                            Pending, in production &amp; QA
                        </span>
                    </div>

                    <div className="space-y-1.5 rounded-2xl border border-line bg-surface p-5 shadow-xs">
                        <span className="block text-xs font-semibold text-subtle">
                            Completed
                        </span>
                        <div className="text-3xl font-extrabold tabular-nums text-success">
                            {metrics.completedCount.toLocaleString()}
                        </div>
                        <span className="block text-xs text-subtle">
                            Finished studio orders
                        </span>
                    </div>

                    <div className="space-y-1.5 rounded-2xl border border-line bg-surface p-5 shadow-xs">
                        <span className="block text-xs font-semibold text-subtle">
                            Deliverables Ready
                        </span>
                        <div className="text-3xl font-extrabold tabular-nums text-ink">
                            {metrics.deliverablesCount.toLocaleString()}
                        </div>
                        <span className="block text-xs text-subtle">
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
                                        ? 'bg-primary text-primary-foreground'
                                        : 'border border-line bg-surface text-muted hover:text-ink'
                                }`}
                            >
                                {pill.label}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full sm:w-64">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-faint" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search order # or service..."
                            aria-label="Search orders"
                            className="w-full rounded-xl border border-line bg-surface py-2 pl-9 pr-3 text-xs text-ink placeholder:text-faint focus:border-ring focus:outline-none"
                        />
                    </div>
                </div>

                {/* Structured Orders: Mobile Cards (< md) + Desktop Table (md+) */}
                {filteredOrders.length > 0 ? (
                    <>
                        {/* Mobile Card Stack (< md) */}
                        <div className="md:hidden space-y-3">
                            {filteredOrders.map((order) => {
                                const isCreditOrder = order.order_type === 'credit_usage';
                                const hasDeliverables =
                                    Boolean(order.digital_twin_download_url) ||
                                    (Array.isArray(order.completed_files) &&
                                        order.completed_files.length > 0);

                                return (
                                    <div
                                        key={order.id}
                                        className="rounded-2xl border border-line bg-surface p-4 shadow-xs"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0 flex-1">
                                                <div className="text-xs font-bold text-subtle">
                                                    #{order.order_number}
                                                </div>
                                                <div className="mt-0.5 text-sm font-bold text-ink break-words">
                                                    {order.service_name}
                                                </div>
                                            </div>
                                            <div className="shrink-0">
                                                <OrderStatusBadge status={order.status} />
                                            </div>
                                        </div>

                                        <div className="mt-3 divide-y divide-line border-t border-line text-xs">
                                            <div className="flex items-center justify-between gap-3 py-2">
                                                <span className="text-2xs font-semibold uppercase tracking-wide text-faint">
                                                    Assets &amp; Turnaround
                                                </span>
                                                <span className="text-right font-medium text-ink-2">
                                                    {order.quantity.toLocaleString()} asset(s) · {order.turnaround}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between gap-3 py-2">
                                                <span className="text-2xs font-semibold uppercase tracking-wide text-faint">
                                                    Amount
                                                </span>
                                                <span
                                                    className={`font-extrabold tabular-nums ${
                                                        isCreditOrder ? 'text-primary' : 'text-ink'
                                                    }`}
                                                >
                                                    {formatOrderAmount(order)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between gap-3 py-2">
                                                <span className="text-2xs font-semibold uppercase tracking-wide text-faint">
                                                    Date
                                                </span>
                                                <span className="text-muted">
                                                    {order.created_at_formatted}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-3 pt-3 border-t border-line flex flex-wrap items-center justify-between gap-2">
                                            <div className="flex flex-wrap items-center gap-1.5">
                                                {isCreditOrder && (
                                                    <span className="rounded-md bg-primary/10 px-2 py-1 text-2xs font-semibold text-primary">
                                                        Paid with Credits
                                                    </span>
                                                )}
                                                {hasDeliverables && (
                                                    order.digital_twin_download_url ? (
                                                        <a
                                                            href={order.digital_twin_download_url}
                                                            className="inline-flex items-center gap-1 rounded-lg bg-success px-2.5 py-1.5 text-2xs font-bold text-white hover:bg-success/90"
                                                        >
                                                            <Download className="h-3 w-3" />
                                                            <span>Download ZIP</span>
                                                        </a>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 rounded-lg border border-success/25 bg-success-soft px-2 py-1 text-2xs font-semibold text-success">
                                                            <Download className="h-3 w-3" />
                                                            <span>{order.completed_files.length} Ready</span>
                                                        </span>
                                                    )
                                                )}
                                            </div>

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setSelectedOrder(order)}
                                                className="min-h-11 flex-1 sm:flex-none cursor-pointer gap-1.5 px-4 text-xs font-semibold"
                                            >
                                                <Eye className="h-4 w-4" />
                                                <span>View Details</span>
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Desktop Table Card (md+) */}
                        <div className="hidden md:block overflow-hidden rounded-2xl border border-line bg-surface shadow-xs">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="border-b border-line bg-surface-2 text-2xs font-bold uppercase tracking-wider text-subtle">
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
                                    <tbody className="divide-y divide-line">
                                        {filteredOrders.map((order) => {
                                            const isCreditOrder = order.order_type === 'credit_usage';
                                            const hasDeliverables =
                                                Boolean(order.digital_twin_download_url) ||
                                                (Array.isArray(order.completed_files) &&
                                                    order.completed_files.length > 0);

                                            return (
                                                <tr
                                                    key={order.id}
                                                    className="transition-colors hover:bg-surface-2"
                                                >
                                                    <td className="whitespace-nowrap px-5 py-4 font-bold text-ink">
                                                        #{order.order_number}
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <div className="text-sm font-bold text-ink">
                                                            {order.service_name}
                                                        </div>
                                                        <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-subtle">
                                                            <span>
                                                                {order.quantity.toLocaleString()} asset(s) ·{' '}
                                                                {order.uploaded_count} file(s)
                                                            </span>
                                                            {isCreditOrder && (
                                                                <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-2xs font-semibold text-primary">
                                                                    Paid with Credits
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-5 py-4 font-medium text-ink-2">
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
                                                    <td className="whitespace-nowrap px-5 py-4 text-subtle">
                                                        {order.created_at_formatted}
                                                    </td>
                                                    <td className="whitespace-nowrap px-5 py-4 text-right">
                                                        <div className="inline-flex items-center justify-end gap-2">
                                                            {hasDeliverables && (
                                                                order.digital_twin_download_url ? (
                                                                    <a
                                                                        href={order.digital_twin_download_url}
                                                                        className="inline-flex items-center gap-1 rounded-lg bg-success px-2.5 py-1.5 text-2xs font-bold text-white hover:bg-success/90"
                                                                    >
                                                                        <Download className="h-3 w-3" />
                                                                        <span>ZIP</span>
                                                                    </a>
                                                                ) : (
                                                                    <span
                                                                        title="Deliverables ready"
                                                                        className="inline-flex items-center gap-1 rounded-lg border border-success/25 bg-success-soft px-2 py-1 text-2xs font-semibold text-success"
                                                                    >
                                                                        <Download className="h-3 w-3" />
                                                                        <span>{order.completed_files.length}</span>
                                                                    </span>
                                                                )
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
                        </div>
                    </>
                ) : orders.length === 0 ? (
                    <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-xs">
                        <div className="space-y-3 p-10 sm:p-12 text-center">
                            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                <ShoppingBag className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-ink">No orders or quotes yet</p>
                                <p className="mx-auto mt-1 max-w-md text-xs text-subtle">
                                    Explore our studio capabilities to place a new order or request a custom project quote.
                                </p>
                            </div>
                            <Link
                                href="/capabilities"
                                className="inline-flex min-h-11 sm:min-h-9 items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-hover"
                            >
                                <Plus className="h-3.5 w-3.5" />
                                <span>Browse Services &amp; Start Order</span>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-xs">
                        <div className="space-y-3 p-10 sm:p-12 text-center">
                            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-surface-2 text-subtle">
                                <Search className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-ink">No matching orders</p>
                                <p className="mx-auto mt-1 max-w-md text-xs text-subtle">
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
                                className="min-h-11 sm:min-h-9 cursor-pointer text-xs font-semibold"
                            >
                                Clear Filters
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <ClientOrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
        </>
    );
}

ClientOrders.layout = getClientLayout;
