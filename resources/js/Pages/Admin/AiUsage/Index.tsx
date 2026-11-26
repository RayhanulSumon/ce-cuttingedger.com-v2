import React from 'react';
import { Head, router } from '@inertiajs/react';
import { Coins, DollarSign, Layers, TrendingUp } from 'lucide-react';
import { AdminPageHeader } from '@/Components/Admin/UI/AdminPageHeader';
import { Badge } from '@/Components/ui/badge';
import { AdminLayout } from '@/Layouts/Admin/AdminLayout';

interface AdminAiJobRow {
    id: number;
    user_name: string;
    user_email: string;
    provider: string;
    service_type: string;
    status: string;
    base_credits: number;
    markup_percent: number;
    credits_charged: number;
    provider_cost_usd: number;
    billed_amount_usd: number;
    profit_usd: number;
    error_message?: string | null;
    created_at?: string | null;
}

interface AdminAiUsageProps {
    jobs: AdminAiJobRow[];
    summary: {
        total_jobs: number;
        completed_jobs: number;
        failed_jobs: number;
        total_base_credits: number;
        total_credits_charged: number;
        total_provider_cost_usd: number;
        total_billed_usd: number;
        total_profit_usd: number;
        markup_percent: number;
    };
    filters: {
        status: string;
        service: string;
    };
}

export default function AdminAiUsageIndex({ jobs = [], summary, filters }: AdminAiUsageProps) {
    const updateFilter = (key: 'status' | 'service', value: string) => {
        router.get(
            '/admin/ai-usage',
            { ...filters, [key]: value },
            { preserveState: true, preserveScroll: true }
        );
    };

    return (
        <AdminLayout title="AI Usage & Profit">
            <Head title="AI Usage & Profit — Admin" />

            <AdminPageHeader
                title="AI Usage, Provider Cost & 25% Markup Ledger"
                description="Track every AI token/credit expense, upstream provider cost, 25% markup, and net profit."
            />

            <div className="space-y-6">
                {/* Summary KPI Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-2xl border border-line bg-surface p-5 shadow-xs">
                        <div className="flex items-center justify-between text-xs font-semibold text-subtle">
                            <span>User Credits Spent</span>
                            <Coins className="h-4 w-4 text-primary" />
                        </div>
                        <div className="mt-2 text-2xl font-extrabold tabular-nums text-ink">
                            {summary.total_credits_charged.toLocaleString()}
                        </div>
                        <p className="mt-1 text-2xs text-subtle">
                            Base: {summary.total_base_credits.toLocaleString()} cr (+{summary.markup_percent}% markup)
                        </p>
                    </div>

                    <div className="rounded-2xl border border-line bg-surface p-5 shadow-xs">
                        <div className="flex items-center justify-between text-xs font-semibold text-subtle">
                            <span>Provider Cost (Actual API)</span>
                            <DollarSign className="h-4 w-4 text-muted" />
                        </div>
                        <div className="mt-2 text-2xl font-extrabold tabular-nums text-ink">
                            ${summary.total_provider_cost_usd.toFixed(4)}
                        </div>
                        <p className="mt-1 text-2xs text-subtle">
                            Upstream Fal.ai API expense
                        </p>
                    </div>

                    <div className="rounded-2xl border border-primary/30 bg-surface p-5 shadow-xs">
                        <div className="flex items-center justify-between text-xs font-semibold text-subtle">
                            <span>Total Billed (With 25%)</span>
                            <Layers className="h-4 w-4 text-primary" />
                        </div>
                        <div className="mt-2 text-2xl font-extrabold tabular-nums text-ink">
                            ${summary.total_billed_usd.toFixed(4)}
                        </div>
                        <p className="mt-1 text-2xs text-subtle">
                            {summary.completed_jobs} completed · {summary.failed_jobs} failed/refunded
                        </p>
                    </div>

                    <div className="rounded-2xl border border-success/30 bg-surface p-5 shadow-xs">
                        <div className="flex items-center justify-between text-xs font-semibold text-subtle">
                            <span>Net 25% Markup Profit</span>
                            <TrendingUp className="h-4 w-4 text-success" />
                        </div>
                        <div className="mt-2 text-2xl font-extrabold tabular-nums text-success">
                            +${summary.total_profit_usd.toFixed(4)}
                        </div>
                        <p className="mt-1 text-2xs text-subtle">
                            Total across {summary.total_jobs} AI jobs
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-surface p-4">
                    <select
                        value={filters.service}
                        onChange={(e) => updateFilter('service', e.target.value)}
                        className="rounded-xl border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink"
                    >
                        <option value="all">All Services</option>
                        <option value="try_on">Virtual Try-On</option>
                        <option value="bg_remove">Background Removal</option>
                    </select>

                    <select
                        value={filters.status}
                        onChange={(e) => updateFilter('status', e.target.value)}
                        className="rounded-xl border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink"
                    >
                        <option value="all">All Statuses</option>
                        <option value="completed">Completed</option>
                        <option value="processing">Processing</option>
                        <option value="queued">Queued</option>
                        <option value="failed">Failed (Refunded)</option>
                    </select>
                </div>

                {/* Ledger Table */}
                <div className="overflow-x-auto rounded-2xl border border-line bg-surface shadow-xs">
                    <table className="w-full text-left text-xs">
                        <thead className="border-b border-line bg-surface-2 text-2xs font-bold uppercase tracking-wider text-subtle">
                            <tr>
                                <th className="px-4 py-3">Job</th>
                                <th className="px-4 py-3">Client</th>
                                <th className="px-4 py-3">Service</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-right">Base Cr</th>
                                <th className="px-4 py-3 text-right">User Charged (+25%)</th>
                                <th className="px-4 py-3 text-right">Provider Cost</th>
                                <th className="px-4 py-3 text-right">Total Billed</th>
                                <th className="px-4 py-3 text-right">Net Profit</th>
                                <th className="px-4 py-3">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-line">
                            {jobs.length === 0 ? (
                                <tr>
                                    <td colSpan={10} className="px-4 py-8 text-center text-subtle">
                                        No AI jobs recorded yet.
                                    </td>
                                </tr>
                            ) : (
                                jobs.map((job) => (
                                    <tr key={job.id} className="hover:bg-surface-2/40">
                                        <td className="px-4 py-3 font-bold text-ink">#{job.id}</td>
                                        <td className="px-4 py-3">
                                            <div className="font-semibold text-ink">{job.user_name}</div>
                                            <div className="text-2xs text-subtle">{job.user_email}</div>
                                        </td>
                                        <td className="px-4 py-3 font-medium text-ink">
                                            {job.service_type === 'try_on' ? 'Virtual Try-On' : 'BG Removal'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge variant="outline" className="text-2xs capitalize">
                                                {job.status}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-right tabular-nums text-subtle">
                                            {job.base_credits}
                                        </td>
                                        <td className="px-4 py-3 text-right font-bold tabular-nums text-ink">
                                            {job.credits_charged} cr
                                        </td>
                                        <td className="px-4 py-3 text-right tabular-nums text-subtle">
                                            ${job.provider_cost_usd.toFixed(4)}
                                        </td>
                                        <td className="px-4 py-3 text-right font-semibold tabular-nums text-ink">
                                            ${job.billed_amount_usd.toFixed(4)}
                                        </td>
                                        <td className="px-4 py-3 text-right font-bold tabular-nums text-success">
                                            +${job.profit_usd.toFixed(4)}
                                        </td>
                                        <td className="px-4 py-3 text-2xs text-subtle">
                                            {job.created_at}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
