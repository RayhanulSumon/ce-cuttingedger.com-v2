import React, { useMemo, useState } from 'react';
import { Link } from '@inertiajs/react';
import { Eye, Plus } from 'lucide-react';
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

interface ClientOrdersProps {
    orders: ClientOrderItem[];
}

export default function ClientOrders({ orders = [] }: ClientOrdersProps) {
    const [orderFilter, setOrderFilter] = useState<string>('all');
    const [selectedOrder, setSelectedOrder] = useState<ClientOrderItem | null>(null);

    const orderServiceFilters = useMemo(
        () => Array.from(new Set(orders.map((o) => o.service_name))).filter(Boolean),
        [orders]
    );

    const filteredOrders = useMemo(() => {
        if (orderFilter === 'all') {
            return orders;
        }
        return orders.filter((o) => o.service_name === orderFilter);
    }, [orders, orderFilter]);

    return (
        <>
            <SeoHead
                title="Orders — Client Workspace"
                description="View all submitted orders, custom quotes, specifications, and downloadable deliverables."
            />

            <AdminPageHeader
                title="My Orders & Quotes"
                description="View all your submitted orders, custom quotes, specifications, and downloadable deliverables."
                actionLabel="New Order / Quote"
                actionHref="/capabilities"
            />

            {orderServiceFilters.length > 1 && (
                <div className="mb-6 flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setOrderFilter('all')}
                        className={`cursor-pointer rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                            orderFilter === 'all'
                                ? 'bg-primary text-white'
                                : 'border border-slate-200 bg-white text-slate-600 hover:text-ink'
                        }`}
                    >
                        All ({orders.length})
                    </button>
                    {orderServiceFilters.map((srv) => (
                        <button
                            key={srv}
                            type="button"
                            onClick={() => setOrderFilter(srv)}
                            className={`cursor-pointer rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                                orderFilter === srv
                                    ? 'bg-primary text-white'
                                    : 'border border-slate-200 bg-white text-slate-600 hover:text-ink'
                            }`}
                        >
                            {srv}
                        </button>
                    ))}
                </div>
            )}

            <div className="space-y-3">
                {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                        <div
                            key={order.id}
                            className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-colors hover:border-primary/40 sm:flex-row sm:items-center"
                        >
                            <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="rounded-lg bg-ink px-2.5 py-0.5 text-xs font-bold text-white">
                                        #{order.order_number}
                                    </span>
                                    <OrderStatusBadge status={order.status} />
                                    <span className="text-xs text-slate-400">
                                        {order.created_at_formatted}
                                    </span>
                                </div>
                                <h3 className="text-base font-bold text-ink">{order.service_name}</h3>
                                <p className="text-xs text-slate-500">
                                    Turnaround: <strong>{order.turnaround}</strong> ·{' '}
                                    {order.uploaded_count} file(s) attached
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="text-left sm:text-right">
                                    <span className="block text-[10px] font-bold uppercase text-slate-400">
                                        Total / Estimate
                                    </span>
                                    <span className="text-sm font-extrabold text-ink">
                                        {formatOrderAmount(order)}
                                    </span>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedOrder(order)}
                                    className="cursor-pointer gap-1.5 text-xs"
                                >
                                    <Eye size={14} />
                                    <span>View Spec &amp; Files</span>
                                </Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="space-y-3 rounded-2xl border border-slate-200/90 bg-white p-12 text-center">
                        <p className="text-sm font-bold text-ink">No orders found.</p>
                        <Link href="/capabilities">
                            <Button className="cursor-pointer bg-primary text-xs font-semibold text-white hover:bg-primary-hover">
                                <Plus className="mr-1.5 h-3.5 w-3.5" />
                                Browse Services &amp; Start Order
                            </Button>
                        </Link>
                    </div>
                )}
            </div>

            <ClientOrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
        </>
    );
}

ClientOrders.layout = (page: React.ReactNode) => (
    <ClientLayout title="Orders">{page}</ClientLayout>
);
