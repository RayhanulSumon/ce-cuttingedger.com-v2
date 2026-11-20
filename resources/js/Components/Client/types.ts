export { OrderStatusBadge } from './OrderStatusBadge';

export interface ClientOrderItem {
    id: number;
    order_number: string;
    order_type: string;
    service_name: string;
    complexity: string;
    quantity: number;
    uploaded_count: number;
    total_price: number;
    currency: string;
    turnaround: string;
    images: string[];
    completed_files: string[];
    digital_twin_download_url?: string | null;
    digital_twin_download_name?: string | null;
    digital_twin_download_size?: number | null;
    specifications: Record<string, any>;
    cloud_link?: string | null;
    instructions?: string | null;
    status: 'pending' | 'in_production' | 'review' | 'completed' | 'cancelled';
    payment_status: string;
    created_at_formatted: string;
}

export interface CreditSummary {
    available_credits: number;
    active_plan_name?: string | null;
    expires_at?: string | null;
    expires_at_formatted?: string | null;
    days_remaining?: number | null;
    is_expired?: boolean;
    total_purchased_credits: number;
    pending_credits: number;
    total_used_credits: number;
}

export interface CreditHistoryEntry {
    id: number;
    order_number: string;
    entry_type: 'purchase' | 'usage';
    title: string;
    subtitle: string;
    credits_delta: number;
    balance_after: number | null;
    is_activated: boolean;
    validity_days?: number | null;
    expires_at_formatted?: string | null;
    status_label: string;
    amount_usd: number;
    created_at_formatted: string;
}

export function formatOrderAmount(order: ClientOrderItem): string {
    if (order.order_type === 'credit_usage' && order.specifications?.credits_spent) {
        return `${Number(order.specifications.credits_spent).toLocaleString()} Credits`;
    }
    if (order.total_price > 0) {
        return `$${order.total_price.toFixed(2)} ${order.currency}`;
    }
    return 'Custom Quote';
}

export function formatCreditExpiryText(
    expiresAtFormatted: string | null | undefined,
    daysRemaining: number | null | undefined,
    isExpired: boolean | undefined,
    fallback: string
): string {
    if (!expiresAtFormatted) {
        return fallback;
    }
    if (isExpired) {
        return `Expired on ${expiresAtFormatted}`;
    }
    if (daysRemaining !== null && daysRemaining !== undefined) {
        return `Expires ${expiresAtFormatted} (${daysRemaining}d left)`;
    }
    return `Expires ${expiresAtFormatted}`;
}
