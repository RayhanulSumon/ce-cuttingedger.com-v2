import React from 'react';
import { CheckCircle2, Clock, Eye, Layers } from 'lucide-react';
import { ClientOrderItem } from './types';

/** Status pill matching order lifecycle across Overview, Orders, and Modal views. */
export function OrderStatusBadge({ status }: { status: ClientOrderItem['status'] }) {
    switch (status) {
        case 'completed':
            return (
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                    <CheckCircle2 size={12} />
                    Completed
                </span>
            );
        case 'in_production':
            return (
                <span className="inline-flex items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-0.5 text-[11px] font-semibold text-sky-700">
                    <Layers size={12} />
                    In Production
                </span>
            );
        case 'review':
            return (
                <span className="inline-flex items-center gap-1 rounded-full border border-purple-200 bg-purple-50 px-2.5 py-0.5 text-[11px] font-semibold text-purple-700">
                    <Eye size={12} />
                    Quality Review
                </span>
            );
        default:
            return (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700">
                    <Clock size={12} />
                    Pending Review
                </span>
            );
    }
}
