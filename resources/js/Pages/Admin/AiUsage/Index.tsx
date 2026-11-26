import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Coins, DollarSign, Layers, Save, Sliders, TrendingUp } from 'lucide-react';
import { AdminPageHeader } from '@/Components/Admin/UI/AdminPageHeader';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
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

interface AiServiceConfigItem {
    model: string;
    base_credits: number;
    provider_cost_usd: number;
}

interface AiConfig {
    provider: string;
    markup_percent: number;
    services: {
        bg_remove: AiServiceConfigItem;
        try_on: AiServiceConfigItem;
    };
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
    aiConfig: AiConfig;
    availableProviders: Array<{ value: string; label: string }>;
    filters: {
        status: string;
        service: string;
    };
}

export default function AdminAiUsageIndex({
    jobs = [],
    summary,
    aiConfig,
    availableProviders = [],
    filters,
}: AdminAiUsageProps) {
    const [configForm, setConfigForm] = useState<AiConfig>(aiConfig);
    const [saving, setSaving] = useState(false);

    const updateFilter = (key: 'status' | 'service', value: string) => {
        router.get(
            '/admin/ai-usage',
            { ...filters, [key]: value },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleSaveSettings = (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        router.post('/admin/ai-usage/settings', configForm as unknown as Record<string, never>, {
            preserveScroll: true,
            onFinish: () => setSaving(false),
        });
    };

    const calcUserCredits = (base: number) =>
        Math.ceil(base * (1 + Number(configForm.markup_percent || 0) / 100));

    const calcBilledUsd = (cost: number) =>
        (cost * (1 + Number(configForm.markup_percent || 0) / 100)).toFixed(4);

    return (
        <AdminLayout title="AI Usage & Profit">
            <Head title="AI Usage & Profit — Admin" />

            <AdminPageHeader
                title="AI Usage, Provider Cost & Profit Margin"
                description="Configure AI provider, exact upstream USD costs, profit markup %, and track net margin across all jobs."
            />

            <div className="space-y-6">
                {/* Dynamic Provider & Pricing Settings */}
                <form
                    onSubmit={handleSaveSettings}
                    className="space-y-4 rounded-2xl border border-line bg-surface p-6 shadow-xs"
                >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-4">
                        <div className="flex items-center gap-2">
                            <Sliders className="h-4 w-4 text-primary" />
                            <div>
                                <h2 className="text-sm font-bold text-ink">
                                    AI Provider &amp; Dynamic Pricing Settings
                                </h2>
                                <p className="text-2xs text-subtle">
                                    Clients are charged upfront (Base Credits + {configForm.markup_percent}%) and automatically refunded if a job fails.
                                </p>
                            </div>
                        </div>
                        <Button
                            type="submit"
                            disabled={saving}
                            className="cursor-pointer gap-1.5 bg-primary text-xs font-semibold text-primary-foreground hover:bg-primary-hover"
                        >
                            <Save className="h-3.5 w-3.5" />
                            <span>{saving ? 'Saving…' : 'Save Settings'}</span>
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-ink">
                                Active AI Provider
                            </label>
                            <select
                                value={configForm.provider}
                                onChange={(e) =>
                                    setConfigForm((prev) => ({
                                        ...prev,
                                        provider: e.target.value,
                                    }))
                                }
                                className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-xs font-semibold text-ink"
                            >
                                {availableProviders.map((p) => (
                                    <option key={p.value} value={p.value}>
                                        {p.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-ink">
                                Profit Markup (%)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                max="500"
                                value={configForm.markup_percent}
                                onChange={(e) =>
                                    setConfigForm((prev) => ({
                                        ...prev,
                                        markup_percent: Number(e.target.value),
                                    }))
                                }
                                className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-xs font-semibold text-ink"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        {/* Background Removal Config */}
                        <div className="space-y-3 rounded-xl border border-line bg-surface-2/40 p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-ink">
                                    Background Removal (bg_remove)
                                </span>
                                <Badge variant="outline" className="text-2xs">
                                    User: {calcUserCredits(configForm.services.bg_remove.base_credits)} cr · ${calcBilledUsd(configForm.services.bg_remove.provider_cost_usd)}
                                </Badge>
                            </div>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                <div className="sm:col-span-3">
                                    <label className="mb-1 block text-2xs font-semibold text-subtle">
                                        Model ID
                                    </label>
                                    <input
                                        type="text"
                                        value={configForm.services.bg_remove.model}
                                        onChange={(e) =>
                                            setConfigForm((prev) => ({
                                                ...prev,
                                                services: {
                                                    ...prev.services,
                                                    bg_remove: {
                                                        ...prev.services.bg_remove,
                                                        model: e.target.value,
                                                    },
                                                },
                                            }))
                                        }
                                        className="w-full rounded-lg border border-line bg-surface px-2.5 py-1.5 text-xs text-ink"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-2xs font-semibold text-subtle">
                                        Base Credits
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={configForm.services.bg_remove.base_credits}
                                        onChange={(e) =>
                                            setConfigForm((prev) => ({
                                                ...prev,
                                                services: {
                                                    ...prev.services,
                                                    bg_remove: {
                                                        ...prev.services.bg_remove,
                                                        base_credits: Number(e.target.value),
                                                    },
                                                },
                                            }))
                                        }
                                        className="w-full rounded-lg border border-line bg-surface px-2.5 py-1.5 text-xs text-ink"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="mb-1 block text-2xs font-semibold text-subtle">
                                        Provider Cost (USD)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.0001"
                                        min="0"
                                        value={configForm.services.bg_remove.provider_cost_usd}
                                        onChange={(e) =>
                                            setConfigForm((prev) => ({
                                                ...prev,
                                                services: {
                                                    ...prev.services,
                                                    bg_remove: {
                                                        ...prev.services.bg_remove,
                                                        provider_cost_usd: Number(e.target.value),
                                                    },
                                                },
                                            }))
                                        }
                                        className="w-full rounded-lg border border-line bg-surface px-2.5 py-1.5 text-xs text-ink"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Virtual Try-On Config */}
                        <div className="space-y-3 rounded-xl border border-line bg-surface-2/40 p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-ink">
                                    Virtual Try-On (try_on)
                                </span>
                                <Badge variant="outline" className="text-2xs">
                                    User: {calcUserCredits(configForm.services.try_on.base_credits)} cr · ${calcBilledUsd(configForm.services.try_on.provider_cost_usd)}
                                </Badge>
                            </div>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                <div className="sm:col-span-3">
                                    <label className="mb-1 block text-2xs font-semibold text-subtle">
                                        Model ID
                                    </label>
                                    <input
                                        type="text"
                                        value={configForm.services.try_on.model}
                                        onChange={(e) =>
                                            setConfigForm((prev) => ({
                                                ...prev,
                                                services: {
                                                    ...prev.services,
                                                    try_on: {
                                                        ...prev.services.try_on,
                                                        model: e.target.value,
                                                    },
                                                },
                                            }))
                                        }
                                        className="w-full rounded-lg border border-line bg-surface px-2.5 py-1.5 text-xs text-ink"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-2xs font-semibold text-subtle">
                                        Base Credits
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={configForm.services.try_on.base_credits}
                                        onChange={(e) =>
                                            setConfigForm((prev) => ({
                                                ...prev,
                                                services: {
                                                    ...prev.services,
                                                    try_on: {
                                                        ...prev.services.try_on,
                                                        base_credits: Number(e.target.value),
                                                    },
                                                },
                                            }))
                                        }
                                        className="w-full rounded-lg border border-line bg-surface px-2.5 py-1.5 text-xs text-ink"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="mb-1 block text-2xs font-semibold text-subtle">
                                        Provider Cost (USD)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.0001"
                                        min="0"
                                        value={configForm.services.try_on.provider_cost_usd}
                                        onChange={(e) =>
                                            setConfigForm((prev) => ({
                                                ...prev,
                                                services: {
                                                    ...prev.services,
                                                    try_on: {
                                                        ...prev.services.try_on,
                                                        provider_cost_usd: Number(e.target.value),
                                                    },
                                                },
                                            }))
                                        }
                                        className="w-full rounded-lg border border-line bg-surface px-2.5 py-1.5 text-xs text-ink"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

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
                            Upstream provider API expense
                        </p>
                    </div>

                    <div className="rounded-2xl border border-primary/30 bg-surface p-5 shadow-xs">
                        <div className="flex items-center justify-between text-xs font-semibold text-subtle">
                            <span>Total Billed (With {summary.markup_percent}%)</span>
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
                            <span>Net Markup Profit</span>
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
                                <th className="px-4 py-3">Provider / Service</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-right">Base Cr</th>
                                <th className="px-4 py-3 text-right">User Charged</th>
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
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-ink">
                                                {job.service_type === 'try_on' ? 'Virtual Try-On' : 'BG Removal'}
                                            </div>
                                            <div className="text-2xs uppercase text-subtle">{job.provider}</div>
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
