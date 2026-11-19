import React, { useMemo, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { ArrowDownLeft, ArrowUpRight, Coins, CreditCard, Eye } from 'lucide-react';
import { AdminPageHeader } from '@/Components/Admin/UI/AdminPageHeader';
import { ClientOrderDetailModal } from '@/Components/Client/ClientOrderDetailModal';
import {
    ClientOrderItem,
    CreditHistoryEntry,
    CreditSummary,
    formatCreditExpiryText,
} from '@/Components/Client/types';
import { SeoHead } from '@/Components/Common/SeoHead';
import { Button } from '@/Components/ui/button';
import { ClientLayout } from '@/Layouts/Client/ClientLayout';
import { PageProps } from '@/types';

interface ClientCreditsProps {
    orders: ClientOrderItem[];
    creditSummary?: CreditSummary;
    creditHistory: CreditHistoryEntry[];
}

export default function ClientCredits({
    orders = [],
    creditSummary,
    creditHistory = [],
}: ClientCreditsProps) {
    const { auth } = usePage<PageProps>().props;
    const user = auth?.user ?? null;

    const [creditFilter, setCreditFilter] = useState<'all' | 'purchase' | 'usage'>('all');
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

    const filteredCreditHistory = useMemo(() => {
        if (creditFilter === 'all') {
            return creditHistory;
        }
        return creditHistory.filter((entry) => entry.entry_type === creditFilter);
    }, [creditHistory, creditFilter]);

    return (
        <>
            <SeoHead
                title="Credits & Plans — Client Workspace"
                description="Track your credit plan purchases, approvals, redemptions, and studio credit balance."
            />

            <AdminPageHeader
                title="Credits & Plan History"
                description="Track your credit plan purchases, admin approvals, order redemptions, and remaining studio balance."
            >
                <div className="flex flex-wrap items-center gap-2">
                    <Link
                        href="/pricing"
                        className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-ink transition-colors hover:border-primary hover:text-primary"
                    >
                        <CreditCard className="h-3.5 w-3.5" />
                        <span>Buy / Top Up Credits</span>
                    </Link>
                </div>
            </AdminPageHeader>

            <div className="space-y-6">
                {/* 4 Summary Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-1.5 rounded-2xl border border-primary/30 bg-white p-5 shadow-xs">
                        <span className="block text-xs font-semibold text-slate-500">
                            Available Balance
                        </span>
                        <div className="text-3xl font-extrabold tabular-nums text-ink">
                            {availableCredits.toLocaleString()}
                        </div>
                        <span className="block text-xs font-semibold text-primary">
                            {activePlanName || 'No active plan'}
                        </span>
                        {expiresAtFormatted && (
                            <span
                                className={`block text-[11px] font-semibold ${
                                    isExpired ? 'text-rose-600' : 'text-emerald-700'
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

                    <div className="space-y-1.5 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
                        <span className="block text-xs font-semibold text-slate-500">
                            Total Purchased (Credited)
                        </span>
                        <div className="text-3xl font-extrabold tabular-nums text-emerald-700">
                            +{totalPurchasedCredits.toLocaleString()}
                        </div>
                        <span className="block text-xs text-slate-500">
                            Activated across approved plans
                        </span>
                    </div>

                    <div className="space-y-1.5 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
                        <span className="block text-xs font-semibold text-slate-500">
                            Total Used on Orders
                        </span>
                        <div className="text-3xl font-extrabold tabular-nums text-ink">
                            {totalUsedCredits.toLocaleString()}
                        </div>
                        <span className="block text-xs text-slate-500">
                            Redeemed on production orders
                        </span>
                    </div>

                    <div className="space-y-1.5 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
                        <span className="block text-xs font-semibold text-slate-500">
                            Pending Approval
                        </span>
                        <div className="text-3xl font-extrabold tabular-nums text-amber-700">
                            {pendingCredits.toLocaleString()}
                        </div>
                        <span className="block text-xs text-slate-500">
                            Awaiting payment confirmation
                        </span>
                    </div>
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap items-center gap-2">
                    {(
                        [
                            { id: 'all', label: `All Activity (${creditHistory.length})` },
                            {
                                id: 'purchase',
                                label: `Plan Purchases (${creditHistory.filter((e) => e.entry_type === 'purchase').length})`,
                            },
                            {
                                id: 'usage',
                                label: `Credit Usages (${creditHistory.filter((e) => e.entry_type === 'usage').length})`,
                            },
                        ] as const
                    ).map((pill) => (
                        <button
                            key={pill.id}
                            type="button"
                            onClick={() => setCreditFilter(pill.id)}
                            className={`cursor-pointer rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                                creditFilter === pill.id
                                    ? 'bg-primary text-white'
                                    : 'border border-slate-200 bg-white text-slate-600 hover:text-ink'
                            }`}
                        >
                            {pill.label}
                        </button>
                    ))}
                </div>

                {/* Credit Purchase & Usage History Table */}
                <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
                    {filteredCreditHistory.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="border-b border-slate-200 bg-[#f8fafc] text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                    <tr>
                                        <th className="px-5 py-3.5">Reference</th>
                                        <th className="px-5 py-3.5">Type</th>
                                        <th className="px-5 py-3.5">Details</th>
                                        <th className="px-5 py-3.5">Credits</th>
                                        <th className="px-5 py-3.5">Status</th>
                                        <th className="px-5 py-3.5">Date</th>
                                        <th className="px-5 py-3.5 text-right">Order</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredCreditHistory.map((entry) => {
                                        const isPurchase = entry.entry_type === 'purchase';
                                        const matchingOrder = !isPurchase
                                            ? orders.find((o) => o.id === entry.id) || null
                                            : null;

                                        return (
                                            <tr
                                                key={`${entry.entry_type}-${entry.id}`}
                                                className="transition-colors hover:bg-slate-50/70"
                                            >
                                                <td className="whitespace-nowrap px-5 py-4 font-bold text-ink">
                                                    #{entry.order_number}
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4">
                                                    {isPurchase ? (
                                                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                                                            <ArrowDownLeft className="h-3 w-3" />
                                                            Plan Purchase
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800">
                                                            <ArrowUpRight className="h-3 w-3" />
                                                            Credit Usage
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="text-sm font-bold text-ink">
                                                        {entry.title}
                                                    </div>
                                                    <div className="mt-0.5 text-slate-500">
                                                        {entry.subtitle}
                                                        {entry.amount_usd > 0 && (
                                                            <span className="ml-2 font-semibold text-slate-700">
                                                                · ${entry.amount_usd.toFixed(2)} USD
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4">
                                                    <span
                                                        className={`text-sm font-extrabold tabular-nums ${
                                                            entry.credits_delta >= 0
                                                                ? 'text-emerald-700'
                                                                : 'text-rose-600'
                                                        }`}
                                                    >
                                                        {entry.credits_delta >= 0
                                                            ? `+${entry.credits_delta.toLocaleString()}`
                                                            : entry.credits_delta.toLocaleString()}{' '}
                                                        Credits
                                                    </span>
                                                    {entry.balance_after !== null && (
                                                        <span className="mt-0.5 block text-[11px] tabular-nums text-slate-500">
                                                            Balance after:{' '}
                                                            {entry.balance_after.toLocaleString()}
                                                        </span>
                                                    )}
                                                    {isPurchase && entry.validity_days && (
                                                        <span className="mt-0.5 block text-[11px] text-slate-500">
                                                            Valid {entry.validity_days} days ·{' '}
                                                            {entry.expires_at_formatted
                                                                ? `Expires ${entry.expires_at_formatted}`
                                                                : 'Starts on approval'}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4">
                                                    <span
                                                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
                                                            entry.status_label === 'Credited' ||
                                                            entry.status_label === 'Completed'
                                                                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                                                : entry.status_label === 'Pending Approval'
                                                                  ? 'border-amber-200 bg-amber-50 text-amber-700'
                                                                  : entry.status_label === 'Cancelled'
                                                                    ? 'border-rose-200 bg-rose-50 text-rose-700'
                                                                    : 'border-sky-200 bg-sky-50 text-sky-700'
                                                        }`}
                                                    >
                                                        {entry.status_label}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                                                    {entry.created_at_formatted}
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4 text-right">
                                                    {matchingOrder && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setSelectedOrder(matchingOrder)}
                                                            className="cursor-pointer gap-1 text-xs"
                                                        >
                                                            <Eye className="h-3.5 w-3.5" />
                                                            <span>View</span>
                                                        </Button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="space-y-3 p-12 text-center">
                            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                <Coins className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-ink">No credit transactions yet</p>
                                <p className="mx-auto mt-1 max-w-md text-xs text-slate-500">
                                    Purchase a preset or custom credit bundle on our pricing page to start redeeming studio credits on orders.
                                </p>
                            </div>
                            <Link
                                href="/pricing"
                                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-hover"
                            >
                                <CreditCard className="h-3.5 w-3.5" />
                                <span>Browse Credit Plans</span>
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            <ClientOrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
        </>
    );
}

ClientCredits.layout = (page: React.ReactNode) => (
    <ClientLayout title="Credits & Plans">{page}</ClientLayout>
);
