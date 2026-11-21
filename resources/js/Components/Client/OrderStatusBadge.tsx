import React from 'react';
import { CheckCircle2, Clock, Eye, Layers } from 'lucide-react';
import { ClientOrderItem } from './types';

/** Status pill matching order lifecycle across Overview, Orders, and Modal views. */
export function OrderStatusBadge({ status }: { status: ClientOrderItem['status'] }) {
    switch (status) {
        case 'completed':
            return (
                <span className="inline-flex items-center gap-1 rounded-full border border-success/25 bg-success-soft px-2.5 py-0.5 text-2xs font-semibold text-success">
                    <CheckCircle2 size={12} />
                    Completed
                </span>
            );
        case 'in_production':
            return (
                <span className="inline-flex items-center gap-1 rounded-full border border-info/25 bg-info-soft px-2.5 py-0.5 text-2xs font-semibold text-info">
                    <Layers size={12} />
                    In Production
                </span>
            );
        case 'review':
            return (
                <span className="inline-flex items-center gap-1 rounded-full border border-info/25 bg-info-soft px-2.5 py-0.5 text-2xs font-semibold text-info">
                    <Eye size={12} />
                    Quality Review
                </span>
            );
        default:
            return (
                <span className="inline-flex items-center gap-1 rounded-full border border-warning/25 bg-warning-soft px-2.5 py-0.5 text-2xs font-semibold text-warning">
                    <Clock size={12} />
                    Pending Review
                </span>
            );
    }
}
