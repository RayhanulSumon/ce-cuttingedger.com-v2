import React, { useState } from "react";
import { router, useForm } from "@inertiajs/react";
import { AdminLayout } from "@/Layouts/Admin/AdminLayout";
import { AdminPageHeader } from "@/Components/Admin/UI/AdminPageHeader";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import {
    ArrowLeftRight,
    Plus,
    Trash2,
    Power,
    Search,
    Download,
    Upload,
    AlertOctagon,
    CheckCircle2,
    AlertCircle,
    X,
    ExternalLink,
    Filter,
} from "lucide-react";

interface RedirectRule {
    id: number;
    source_path: string;
    target_url: string;
    status_code: number;
    hit_count: number;
    is_regex: boolean;
    is_active: boolean;
    notes?: string;
    last_accessed_at?: string;
    created_at: string;
}

interface NotFoundLog {
    id: number;
    path: string;
    referer?: string;
    user_agent?: string;
    hit_count: number;
    last_seen_at: string;
}

interface PaginatedData<T> {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
    total: number;
    current_page: number;
    last_page: number;
}

interface RedirectsIndexProps {
    redirects: PaginatedData<RedirectRule>;
    notFoundLogs: NotFoundLog[];
    filters: {
        search?: string;
    };
    stats: {
        total_redirects: number;
        total_hits: number;
        total_404s: number;
    };
}

export default function RedirectsIndex({
    redirects,
    notFoundLogs = [],
    filters = {},
    stats,
}: RedirectsIndexProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || "");
    const [activeTab, setActiveTab] = useState<"rules" | "404s">("rules");

    // Modal state for Add/Edit Rule
    const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
    const [editingRule, setEditingRule] = useState<RedirectRule | null>(null);

    // Modal state for CSV Import
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

    // Modal state for Resolving a 404
    const [resolvingLog, setResolvingLog] = useState<NotFoundLog | null>(null);

    // Add / Edit Rule Form
    const ruleForm = useForm({
        source_path: "",
        target_url: "",
        status_code: 301,
        is_regex: false,
        is_active: true,
        notes: "",
    });

    // 404 Resolution Form
    const resolveForm = useForm({
        target_url: "",
        status_code: 301,
    });

    // CSV Import Form
    const importForm = useForm<{ csv_file: File | null }>({
        csv_file: null,
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route("admin.redirects.index"),
            { search: searchQuery },
            { preserveState: true, replace: true }
        );
    };

    const openCreateModal = () => {
        setEditingRule(null);
        ruleForm.reset();
        ruleForm.setData({
            source_path: "",
            target_url: "",
            status_code: 301,
            is_regex: false,
            is_active: true,
            notes: "",
        });
        setIsRuleModalOpen(true);
    };

    const openEditModal = (rule: RedirectRule) => {
        setEditingRule(rule);
        ruleForm.setData({
            source_path: rule.source_path,
            target_url: rule.target_url,
            status_code: rule.status_code,
            is_regex: rule.is_regex,
            is_active: rule.is_active,
            notes: rule.notes || "",
        });
        setIsRuleModalOpen(true);
    };

    const closeRuleModal = () => {
        setIsRuleModalOpen(false);
        setEditingRule(null);
        ruleForm.reset();
    };

    const submitRule = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingRule) {
            ruleForm.put(route("admin.redirects.update", editingRule.id), {
                onSuccess: () => closeRuleModal(),
            });
        } else {
            ruleForm.post(route("admin.redirects.store"), {
                onSuccess: () => closeRuleModal(),
            });
        }
    };

    const handleToggle = (id: number) => {
        router.post(route("admin.redirects.toggle", id));
    };

    const handleDelete = (id: number, source: string) => {
        if (confirm(`Delete redirect for "${source}"? This will stop routing traffic for this path immediately.`)) {
            router.delete(route("admin.redirects.destroy", id));
        }
    };

    const openResolveModal = (log: NotFoundLog) => {
        setResolvingLog(log);
        resolveForm.setData({
            target_url: "/capabilities",
            status_code: 301,
        });
    };

    const submitResolve404 = (e: React.FormEvent) => {
        e.preventDefault();
        if (!resolvingLog) return;
        resolveForm.post(route("admin.redirects.resolve-404", resolvingLog.id), {
            onSuccess: () => setResolvingLog(null),
        });
    };

    const handleClear404s = () => {
        if (confirm("Clear all recorded 404 error logs? This cannot be undone.")) {
            router.delete(route("admin.redirects.clear-404s"));
        }
    };

    const handleImportCsv = (e: React.FormEvent) => {
        e.preventDefault();
        importForm.post(route("admin.redirects.import"), {
            onSuccess: () => {
                setIsImportModalOpen(false);
                importForm.reset();
            },
        });
    };

    const getStatusBadge = (code: number) => {
        switch (code) {
            case 301:
                return <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">301 Permanent</span>;
            case 302:
                return <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200">302 Temporary</span>;
            case 410:
                return <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200">410 Gone</span>;
            case 403:
                return <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-50 text-purple-700 border border-purple-200">403 Blocked</span>;
            case 404:
                return <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-100 text-slate-600 border border-slate-200">404 Dropped</span>;
            default:
                return <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">{code}</span>;
        }
    };

    return (
        <AdminLayout title="Redirects & 404 Engine">
            <div className="space-y-6 sm:space-y-8">
                {/* Header */}
                <AdminPageHeader
                    title="Traffic & Redirect Engine"
                    description="Self-serve 301/302 link preservation, regex router, and real-time 404 error intelligence."
                    badge="SEO Engine"
                    eyebrow="Indexing & Link Equity"
                >
                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={() => window.open(route("admin.redirects.export"), "_blank")}
                            className="min-h-10 sm:min-h-9 border-slate-200 bg-white hover:bg-slate-50 text-xs text-slate-700"
                        >
                            <Download className="w-3.5 h-3.5 mr-1.5" />
                            Export CSV
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setIsImportModalOpen(true)}
                            className="min-h-10 sm:min-h-9 border-slate-200 bg-white hover:bg-slate-50 text-xs text-slate-700"
                        >
                            <Upload className="w-3.5 h-3.5 mr-1.5" />
                            Import CSV
                        </Button>
                        <Button
                            onClick={openCreateModal}
                            className="min-h-10 sm:min-h-9 bg-primary text-white hover:bg-primary-hover font-semibold text-xs shadow-xs"
                        >
                            <Plus className="w-4 h-4 mr-1.5" />
                            New Redirect
                        </Button>
                    </div>
                </AdminPageHeader>

                {/* Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-5 rounded-2xl border border-slate-200/90 bg-white shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-mono uppercase tracking-wider text-slate-500">Total Active Rules</span>
                            <ArrowLeftRight className="w-4 h-4 text-primary" />
                        </div>
                        <div className="text-3xl font-bold text-ink mt-2 font-mono tabular-nums">
                            {stats.total_redirects.toLocaleString()}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">301 / 302 canonical paths preserving pagerank</p>
                    </div>

                    <div className="p-5 rounded-2xl border border-slate-200/90 bg-white shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-mono uppercase tracking-wider text-slate-500">Total Redirect Hits</span>
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div className="text-3xl font-bold text-emerald-700 mt-2 font-mono tabular-nums">
                            {stats.total_hits.toLocaleString()}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Traffic preserved without hitting 404 drops</p>
                    </div>

                    <div className="p-5 rounded-2xl border border-slate-200/90 bg-white shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-mono uppercase tracking-wider text-slate-500">Logged 404 Paths</span>
                            <AlertOctagon className="w-4 h-4 text-amber-600" />
                        </div>
                        <div className="text-3xl font-bold text-amber-700 mt-2 font-mono tabular-nums">
                            {stats.total_404s.toLocaleString()}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Broken backlink requests waiting for 301 fixes</p>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setActiveTab("rules")}
                            className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
                                activeTab === "rules"
                                    ? "bg-primary text-white shadow-xs"
                                    : "bg-white border border-slate-200 text-slate-600 hover:text-ink"
                            }`}
                        >
                            Active Redirect Rules ({redirects.total})
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("404s")}
                            className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                                activeTab === "404s"
                                    ? "bg-amber-500 text-white shadow-xs"
                                    : "bg-white border border-slate-200 text-slate-600 hover:text-ink"
                            }`}
                        >
                            <span>404 Monitoring Log</span>
                            {stats.total_404s > 0 && (
                                <span
                                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                                        activeTab === "404s"
                                            ? "bg-white text-amber-700"
                                            : "bg-amber-100 text-amber-700"
                                    }`}
                                >
                                    {stats.total_404s}
                                </span>
                            )}
                        </button>
                    </div>

                    {activeTab === "rules" && (
                        <form onSubmit={handleSearch} className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">
                            <div className="relative flex-1 sm:flex-none">
                                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <Input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Filter by source or target..."
                                    className="h-9 sm:h-8 pl-8 text-xs bg-white border-slate-200 w-full sm:w-64 text-ink placeholder:text-slate-400"
                                />
                            </div>
                            <Button type="submit" size="sm" variant="outline" className="min-h-10 sm:min-h-8 text-xs">
                                Search
                            </Button>
                        </form>
                    )}

                    {activeTab === "404s" && notFoundLogs.length > 0 && (
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleClear404s}
                            className="min-h-10 sm:min-h-8 text-xs bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 self-start sm:self-auto"
                        >
                            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                            Clear 404 Logs
                        </Button>
                    )}
                </div>

                {/* Tab: Redirect Rules */}
                {activeTab === "rules" && (
                    <div className="space-y-4">
                        {/* Mobile Cards (< md) */}
                        <div className="md:hidden space-y-3">
                            {redirects.data.length === 0 ? (
                                <div className="rounded-2xl border border-slate-200/90 bg-white px-5 py-10 text-center text-xs font-mono text-slate-400 shadow-xs">
                                    No redirect rules found matching your criteria.
                                </div>
                            ) : (
                                redirects.data.map((rule) => (
                                    <div
                                        key={rule.id}
                                        className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0 flex-1 font-mono font-bold text-sm text-ink break-all">
                                                <span className="text-slate-400 select-none">/</span>
                                                {rule.source_path.replace(/^\//, "")}
                                                {rule.is_regex && (
                                                    <span className="ml-1.5 inline-block px-1.5 py-0.5 rounded text-[10px] bg-purple-50 text-purple-700 border border-purple-200">
                                                        REGEX
                                                    </span>
                                                )}
                                            </div>
                                            <div className="shrink-0">{getStatusBadge(rule.status_code)}</div>
                                        </div>

                                        <div className="mt-3 divide-y divide-slate-100 border-t border-slate-100 text-xs">
                                            <div className="flex items-start justify-between gap-3 py-2">
                                                <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 shrink-0">
                                                    Target
                                                </span>
                                                <span className="font-mono text-right text-slate-700 break-all">
                                                    {rule.target_url}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between gap-3 py-2">
                                                <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                                    Hits &amp; State
                                                </span>
                                                <span className="font-mono font-semibold text-ink">
                                                    {rule.hit_count.toLocaleString()} hits · {rule.is_active ? "Active" : "Disabled"}
                                                </span>
                                            </div>
                                            {rule.notes && (
                                                <div className="flex items-start justify-between gap-3 py-2">
                                                    <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 shrink-0">
                                                        Notes
                                                    </span>
                                                    <span className="text-right text-slate-600 break-words">
                                                        {rule.notes}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-end gap-2">
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleToggle(rule.id)}
                                                className={`min-h-11 px-3 text-xs font-mono gap-1.5 ${
                                                    rule.is_active
                                                        ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                                        : "border-slate-200 text-slate-600"
                                                }`}
                                            >
                                                <Power className="w-3.5 h-3.5" />
                                                <span>{rule.is_active ? "Active" : "Disabled"}</span>
                                            </Button>
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                onClick={() => openEditModal(rule)}
                                                className="min-h-11 px-3.5 text-xs font-semibold"
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleDelete(rule.id, rule.source_path)}
                                                className="min-h-11 px-3 text-xs border-rose-200 text-rose-600 hover:bg-rose-50"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                                <span>Delete</span>
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Desktop Table (md+) */}
                        <div className="hidden md:block border border-slate-200/90 rounded-2xl overflow-hidden bg-white shadow-xs">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-[#f8fafc] border-b border-slate-200 text-slate-500 font-mono uppercase text-[11px]">
                                        <tr>
                                            <th className="py-3.5 px-4 font-semibold">Source Path</th>
                                            <th className="py-3.5 px-4 font-semibold">Target Destination</th>
                                            <th className="py-3.5 px-4 font-semibold">Code</th>
                                            <th className="py-3.5 px-4 text-center font-semibold">Hits</th>
                                            <th className="py-3.5 px-4 font-semibold">Notes</th>
                                            <th className="py-3.5 px-4 text-center font-semibold">Status</th>
                                            <th className="py-3.5 px-4 text-right font-semibold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-slate-700">
                                        {redirects.data.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="text-center py-12 text-slate-400">
                                                    No redirect rules found matching your criteria.
                                                </td>
                                            </tr>
                                        ) : (
                                            redirects.data.map((rule) => (
                                                <tr key={rule.id} className="hover:bg-slate-50/80 transition-colors">
                                                    <td className="py-3.5 px-4 font-mono font-semibold text-ink max-w-xs truncate">
                                                        <span className="text-slate-400 select-none">/</span>
                                                        {rule.source_path.replace(/^\//, "")}
                                                        {rule.is_regex && (
                                                            <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] bg-purple-50 text-purple-700 border border-purple-200">
                                                                REGEX
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="py-3.5 px-4 font-mono text-slate-600 max-w-xs truncate">
                                                        {rule.target_url}
                                                    </td>
                                                    <td className="py-3.5 px-4 whitespace-nowrap">
                                                        {getStatusBadge(rule.status_code)}
                                                    </td>
                                                    <td className="py-3.5 px-4 text-center font-mono font-semibold text-ink tabular-nums">
                                                        {rule.hit_count.toLocaleString()}
                                                    </td>
                                                    <td className="py-3.5 px-4 text-slate-500 max-w-[200px] truncate">
                                                        {rule.notes || "—"}
                                                    </td>
                                                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleToggle(rule.id)}
                                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono transition-all cursor-pointer ${
                                                                rule.is_active
                                                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                                    : "bg-slate-100 text-slate-500 border border-slate-200"
                                                            }`}
                                                        >
                                                            <Power className="w-3 h-3" />
                                                            {rule.is_active ? "Active" : "Disabled"}
                                                        </button>
                                                    </td>
                                                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => openEditModal(rule)}
                                                                className="h-8 px-2.5 text-xs text-slate-600 hover:text-ink"
                                                            >
                                                                Edit
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => handleDelete(rule.id, rule.source_path)}
                                                                className="h-8 px-2 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Pagination */}
                        {redirects.links && redirects.links.length > 3 && (
                            <div className="flex flex-wrap items-center justify-center gap-1 pt-2">
                                {redirects.links.map((link, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => link.url && router.get(link.url)}
                                        disabled={!link.url}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`min-h-10 sm:min-h-8 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                                            link.active
                                                ? "bg-primary text-white font-bold"
                                                : link.url
                                                ? "bg-white border border-slate-200 text-slate-600 hover:text-ink hover:bg-slate-50 cursor-pointer"
                                                : "bg-slate-50 border border-slate-100 text-slate-300 cursor-not-allowed"
                                        }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Tab: 404 Intelligence Log */}
                {activeTab === "404s" && (
                    <>
                        {/* Mobile Cards (< md) */}
                        <div className="md:hidden space-y-3">
                            {notFoundLogs.length === 0 ? (
                                <div className="rounded-2xl border border-slate-200/90 bg-white px-5 py-10 text-center text-xs font-mono text-slate-400 shadow-xs">
                                    Zero 404 dropped requests currently logged. All crawl pathways clean!
                                </div>
                            ) : (
                                notFoundLogs.map((log) => (
                                    <div
                                        key={log.id}
                                        className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0 flex-1 font-mono font-bold text-sm text-amber-800 break-all">
                                                {log.path}
                                            </div>
                                            <span className="shrink-0 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                                {log.hit_count} hits
                                            </span>
                                        </div>

                                        <div className="mt-3 divide-y divide-slate-100 border-t border-slate-100 text-xs">
                                            <div className="flex items-start justify-between gap-3 py-2">
                                                <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 shrink-0">
                                                    Referer
                                                </span>
                                                <span className="font-mono text-right text-slate-600 break-all">
                                                    {log.referer || "Direct / Bookmark / Bot"}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between gap-3 py-2">
                                                <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                                    Last Seen
                                                </span>
                                                <span className="font-mono text-slate-600">
                                                    {log.last_seen_at}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-3 pt-3 border-t border-slate-100 flex justify-end">
                                            <Button
                                                size="sm"
                                                onClick={() => openResolveModal(log)}
                                                className="min-h-11 w-full sm:w-auto text-xs bg-primary text-white hover:bg-primary-hover font-semibold"
                                            >
                                                <ArrowLeftRight className="w-3.5 h-3.5 mr-1.5" />
                                                Resolve with 301
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Desktop Table (md+) */}
                        <div className="hidden md:block border border-slate-200/90 rounded-2xl overflow-hidden bg-white shadow-xs">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-[#f8fafc] border-b border-slate-200 text-slate-500 font-mono uppercase text-[11px]">
                                        <tr>
                                            <th className="py-3.5 px-4 font-semibold">404 Dropped URL</th>
                                            <th className="py-3.5 px-4 text-center font-semibold">Miss Count</th>
                                            <th className="py-3.5 px-4 font-semibold">Referer / Backlink Source</th>
                                            <th className="py-3.5 px-4 font-semibold">Last Attempt</th>
                                            <th className="py-3.5 px-4 text-right font-semibold">Instant Resolution</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-slate-700">
                                        {notFoundLogs.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="text-center py-12 text-slate-400">
                                                    Zero 404 dropped requests currently logged. All crawl pathways clean!
                                                </td>
                                            </tr>
                                        ) : (
                                            notFoundLogs.map((log) => (
                                                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                                                    <td className="py-3.5 px-4 font-mono font-semibold text-amber-800 max-w-sm truncate">
                                                        {log.path}
                                                    </td>
                                                    <td className="py-3.5 px-4 text-center font-mono font-bold">
                                                        <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                                                            {log.hit_count} hits
                                                        </span>
                                                    </td>
                                                    <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate font-mono text-[11px]">
                                                        {log.referer || "Direct / Bookmark / Bot Crawler"}
                                                    </td>
                                                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                                                        {log.last_seen_at}
                                                    </td>
                                                    <td className="py-3.5 px-4 text-right">
                                                        <Button
                                                            size="sm"
                                                            onClick={() => openResolveModal(log)}
                                                            className="h-8 text-xs bg-primary text-white hover:bg-primary-hover font-semibold"
                                                        >
                                                            <ArrowLeftRight className="w-3 h-3 mr-1" />
                                                            Resolve with 301
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Modal: Add / Edit Rule */}
            {isRuleModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-2xl relative space-y-5 animate-in fade-in-50 zoom-in-95 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                            <div>
                                <h2 className="text-lg font-bold text-ink">
                                    {editingRule ? "Edit Redirect Rule" : "Create Redirect Rule"}
                                </h2>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Instantly redirect obsolete or campaign URLs to high-converting destinations.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={closeRuleModal}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-ink hover:bg-slate-100"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={submitRule} className="space-y-4">
                            <div>
                                <label className="block text-xs font-mono text-slate-500 uppercase mb-1 font-bold">
                                    Source Path (What visitors request) *
                                </label>
                                <Input
                                    value={ruleForm.data.source_path}
                                    onChange={(e) => ruleForm.setData("source_path", e.target.value)}
                                    placeholder="/old-portfolio or /photo-editing"
                                    className="bg-white border-slate-200 text-xs font-mono text-ink"
                                    required
                                />
                                {ruleForm.errors.source_path && (
                                    <p className="text-xs text-rose-600 mt-1">{ruleForm.errors.source_path}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-mono text-slate-500 uppercase mb-1 font-bold">
                                    Target Destination URL *
                                </label>
                                <Input
                                    value={ruleForm.data.target_url}
                                    onChange={(e) => ruleForm.setData("target_url", e.target.value)}
                                    placeholder="/case-studies or https://external-domain.com"
                                    className="bg-white border-slate-200 text-xs font-mono text-ink"
                                    required
                                />
                                {ruleForm.errors.target_url && (
                                    <p className="text-xs text-rose-600 mt-1">{ruleForm.errors.target_url}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-mono text-slate-500 uppercase mb-1 font-bold">
                                        HTTP Status Code
                                    </label>
                                    <select
                                        value={ruleForm.data.status_code}
                                        onChange={(e) => ruleForm.setData("status_code", parseInt(e.target.value, 10))}
                                        className="w-full h-10 sm:h-9 rounded-md bg-white border border-slate-200 text-xs text-ink px-3"
                                    >
                                        <option value={301}>301 Permanent (Preserves SEO equity)</option>
                                        <option value={302}>302 Temporary (Campaign / Testing)</option>
                                        <option value={410}>410 Gone (Permanently deleted asset)</option>
                                        <option value={403}>403 Forbidden (Block bad crawlers)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-mono text-slate-500 uppercase mb-1 font-bold">
                                        Router Pattern
                                    </label>
                                    <label className="flex items-center gap-2 h-10 sm:h-9 px-3 rounded-md bg-slate-50 border border-slate-200 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={ruleForm.data.is_regex}
                                            onChange={(e) => ruleForm.setData("is_regex", e.target.checked)}
                                            className="rounded border-slate-300 text-primary focus:ring-0"
                                        />
                                        <span className="text-xs text-slate-700">Regex Pattern</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-mono text-slate-500 uppercase mb-1 font-bold">
                                    Notes / Campaign Reference
                                </label>
                                <Input
                                    value={ruleForm.data.notes}
                                    onChange={(e) => ruleForm.setData("notes", e.target.value)}
                                    placeholder="e.g. 2024 print catalog QR code or Google Ads campaign"
                                    className="bg-white border-slate-200 text-xs text-ink"
                                />
                            </div>

                            <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-200">
                                <Button type="button" variant="outline" onClick={closeRuleModal} className="min-h-10 sm:min-h-9 text-xs">
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={ruleForm.processing}
                                    className="min-h-10 sm:min-h-9 bg-primary text-white hover:bg-primary-hover text-xs font-semibold"
                                >
                                    {editingRule ? "Update Rule" : "Create Redirect"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Resolve 404 */}
            {resolvingLog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-2xl relative space-y-5 animate-in fade-in-50 zoom-in-95 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                            <div>
                                <h2 className="text-base font-bold text-ink flex items-center gap-2">
                                    <ArrowLeftRight className="w-4 h-4 text-primary" />
                                    Resolve 404 to 301 Redirect
                                </h2>
                                <p className="text-xs text-slate-500 mt-1">
                                    Convert dropped traffic into active visitors.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setResolvingLog(null)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-ink hover:bg-slate-100"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={submitResolve404} className="space-y-4">
                            <div>
                                <label className="block text-xs font-mono text-slate-500 uppercase mb-1 font-bold">
                                    Original 404 Path ({resolvingLog.hit_count} hits recorded)
                                </label>
                                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 font-mono text-xs text-amber-800 break-all">
                                    {resolvingLog.path}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-mono text-slate-500 uppercase mb-1 font-bold">
                                    Permanent Target Destination (301) *
                                </label>
                                <Input
                                    value={resolveForm.data.target_url}
                                    onChange={(e) => resolveForm.setData("target_url", e.target.value)}
                                    placeholder="/capabilities or /case-studies"
                                    className="bg-white border-slate-200 text-xs font-mono text-ink"
                                    required
                                />
                            </div>

                            <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-slate-200">
                                <Button type="button" variant="outline" onClick={() => setResolvingLog(null)} className="min-h-10 sm:min-h-9 text-xs">
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={resolveForm.processing}
                                    className="min-h-10 sm:min-h-9 bg-primary text-white hover:bg-primary-hover text-xs font-semibold"
                                >
                                    Save 301 Redirect
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: CSV Import */}
            {isImportModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-2xl relative space-y-5 animate-in fade-in-50 zoom-in-95 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                            <div>
                                <h2 className="text-base font-bold text-ink flex items-center gap-2">
                                    <Upload className="w-4 h-4 text-primary" />
                                    Bulk Import Redirects
                                </h2>
                                <p className="text-xs text-slate-500 mt-1">
                                    Upload a CSV with columns: source_path, target_url, status_code
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsImportModalOpen(false)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-ink hover:bg-slate-100"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleImportCsv} className="space-y-4">
                            <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-center">
                                <input
                                    type="file"
                                    accept=".csv,.txt"
                                    onChange={(e) => importForm.setData("csv_file", e.target.files?.[0] || null)}
                                    className="block w-full text-xs text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-hover cursor-pointer"
                                />
                            </div>

                            <div className="text-[11px] font-mono text-slate-600 space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-200">
                                <p className="text-ink font-semibold">CSV Column Format Example:</p>
                                <p className="text-slate-500">source_path, target_url, status_code</p>
                                <p className="text-emerald-700">/old-service, /capabilities/2d/ghost-mannequin, 301</p>
                            </div>

                            <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-slate-200">
                                <Button type="button" variant="outline" onClick={() => setIsImportModalOpen(false)} className="min-h-10 sm:min-h-9 text-xs">
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={!importForm.data.csv_file || importForm.processing}
                                    className="min-h-10 sm:min-h-9 bg-primary text-white hover:bg-primary-hover text-xs font-semibold"
                                >
                                    Upload & Ingest
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
