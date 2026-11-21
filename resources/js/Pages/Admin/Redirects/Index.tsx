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
                return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-success-soft text-success border border-success/25">301 Permanent</span>;
            case 302:
                return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-warning-soft text-warning border border-warning/25">302 Temporary</span>;
            case 410:
                return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-danger-soft text-danger border border-danger/25">410 Gone</span>;
            case 403:
                return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-info-soft text-info border border-info/25">403 Blocked</span>;
            case 404:
                return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-surface-2 text-muted border border-line">404 Dropped</span>;
            default:
                return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-surface-2 text-ink-2 border border-line">{code}</span>;
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
                            className="min-h-10 sm:min-h-9 border-line bg-surface hover:bg-surface-2 text-xs text-ink-2"
                        >
                            <Download className="w-3.5 h-3.5 mr-1.5" />
                            Export CSV
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setIsImportModalOpen(true)}
                            className="min-h-10 sm:min-h-9 border-line bg-surface hover:bg-surface-2 text-xs text-ink-2"
                        >
                            <Upload className="w-3.5 h-3.5 mr-1.5" />
                            Import CSV
                        </Button>
                        <Button
                            onClick={openCreateModal}
                            className="min-h-10 sm:min-h-9 bg-primary text-primary-foreground hover:bg-primary-hover font-semibold text-xs shadow-xs"
                        >
                            <Plus className="w-4 h-4 mr-1.5" />
                            New Redirect
                        </Button>
                    </div>
                </AdminPageHeader>

                {/* Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-5 rounded-2xl border border-line bg-surface shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs uppercase tracking-wider text-subtle">Total Active Rules</span>
                            <ArrowLeftRight className="w-4 h-4 text-primary" />
                        </div>
                        <div className="text-3xl font-bold text-ink mt-2 tabular-nums">
                            {stats.total_redirects.toLocaleString()}
                        </div>
                        <p className="text-xs text-subtle mt-1">301 / 302 canonical paths preserving pagerank</p>
                    </div>

                    <div className="p-5 rounded-2xl border border-line bg-surface shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs uppercase tracking-wider text-subtle">Total Redirect Hits</span>
                            <CheckCircle2 className="w-4 h-4 text-success" />
                        </div>
                        <div className="text-3xl font-bold text-success mt-2 tabular-nums">
                            {stats.total_hits.toLocaleString()}
                        </div>
                        <p className="text-xs text-subtle mt-1">Traffic preserved without hitting 404 drops</p>
                    </div>

                    <div className="p-5 rounded-2xl border border-line bg-surface shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-mono uppercase tracking-wider text-subtle">Logged 404 Paths</span>
                            <AlertOctagon className="w-4 h-4 text-warning" />
                        </div>
                        <div className="text-3xl font-bold text-warning mt-2 tabular-nums">
                            {stats.total_404s.toLocaleString()}
                        </div>
                        <p className="text-xs text-subtle mt-1">Broken backlink requests waiting for 301 fixes</p>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-3">
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setActiveTab("rules")}
                            className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
                                activeTab === "rules"
                                    ? "bg-primary text-primary-foreground shadow-xs"
                                    : "bg-surface border border-line text-muted hover:text-ink"
                            }`}
                        >
                            Active Redirect Rules ({redirects.total})
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("404s")}
                            className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                                activeTab === "404s"
                                    ? "bg-warning text-white shadow-xs"
                                    : "bg-surface border border-line text-muted hover:text-ink"
                            }`}
                        >
                            <span>404 Monitoring Log</span>
                            {stats.total_404s > 0 && (
                                <span
                                    className={`px-1.5 py-0.5 rounded-full text-2xs font-bold ${
                                        activeTab === "404s"
                                            ? "bg-surface text-warning"
                                            : "bg-warning-soft text-warning"
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
                                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
                                <Input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Filter by source or target..."
                                    className="h-9 sm:h-8 pl-8 text-xs bg-surface border-line w-full sm:w-64 text-ink placeholder:text-faint"
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
                            className="min-h-10 sm:min-h-8 text-xs bg-danger-soft hover:bg-danger-soft text-danger border border-danger/25 self-start sm:self-auto"
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
                                <div className="rounded-2xl border border-line bg-surface px-5 py-10 text-center text-xs text-faint shadow-xs">
                                    No redirect rules found matching your criteria.
                                </div>
                            ) : (
                                redirects.data.map((rule) => (
                                    <div
                                        key={rule.id}
                                        className="rounded-2xl border border-line bg-surface p-4 shadow-xs"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0 flex-1 font-mono font-bold text-sm text-ink break-all">
                                                <span className="text-faint select-none">/</span>
                                                {rule.source_path.replace(/^\//, "")}
                                                {rule.is_regex && (
                                                    <span className="ml-1.5 inline-block px-1.5 py-0.5 rounded text-2xs bg-info-soft text-info border border-info/25">
                                                        REGEX
                                                    </span>
                                                )}
                                            </div>
                                            <div className="shrink-0">{getStatusBadge(rule.status_code)}</div>
                                        </div>

                                        <div className="mt-3 divide-y divide-line border-t border-line text-xs">
                                            <div className="flex items-start justify-between gap-3 py-2">
                                                <span className="text-2xs font-semibold uppercase tracking-wide text-faint shrink-0">
                                                    Target
                                                </span>
                                                <span className="font-mono text-right text-ink-2 break-all">
                                                    {rule.target_url}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between gap-3 py-2">
                                                <span className="text-2xs font-semibold uppercase tracking-wide text-faint">
                                                    Hits &amp; State
                                                </span>
                                                <span className="font-semibold text-ink">
                                                    {rule.hit_count.toLocaleString()} hits · {rule.is_active ? "Active" : "Disabled"}
                                                </span>
                                            </div>
                                            {rule.notes && (
                                                <div className="flex items-start justify-between gap-3 py-2">
                                                    <span className="text-2xs font-semibold uppercase tracking-wide text-faint shrink-0">
                                                        Notes
                                                    </span>
                                                    <span className="text-right text-muted break-words">
                                                        {rule.notes}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-3 pt-3 border-t border-line flex flex-wrap items-center justify-end gap-2">
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleToggle(rule.id)}
                                                className={`min-h-11 px-3 text-xs font-mono gap-1.5 ${
                                                    rule.is_active
                                                        ? "border-success/25 bg-success-soft text-success hover:bg-success-soft"
                                                        : "border-line text-muted"
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
                                                className="min-h-11 px-3 text-xs border-danger/25 text-danger hover:bg-danger-soft"
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
                        <div className="hidden md:block border border-line rounded-2xl overflow-hidden bg-surface shadow-xs">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-surface-2 border-b border-line text-subtle uppercase text-2xs">
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
                                    <tbody className="divide-y divide-line text-ink-2">
                                        {redirects.data.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="text-center py-12 text-faint">
                                                    No redirect rules found matching your criteria.
                                                </td>
                                            </tr>
                                        ) : (
                                            redirects.data.map((rule) => (
                                                <tr key={rule.id} className="hover:bg-surface-2 transition-colors">
                                                    <td className="py-3.5 px-4 font-semibold text-ink max-w-xs truncate">
                                                        <span className="text-faint select-none">/</span>
                                                        {rule.source_path.replace(/^\//, "")}
                                                        {rule.is_regex && (
                                                            <span className="ml-1.5 px-1.5 py-0.5 rounded text-2xs bg-info-soft text-info border border-info/25">
                                                                REGEX
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="py-3.5 px-4 text-muted max-w-xs truncate">
                                                        {rule.target_url}
                                                    </td>
                                                    <td className="py-3.5 px-4 whitespace-nowrap">
                                                        {getStatusBadge(rule.status_code)}
                                                    </td>
                                                    <td className="py-3.5 px-4 text-center font-semibold text-ink tabular-nums">
                                                        {rule.hit_count.toLocaleString()}
                                                    </td>
                                                    <td className="py-3.5 px-4 text-subtle max-w-[200px] truncate">
                                                        {rule.notes || "—"}
                                                    </td>
                                                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleToggle(rule.id)}
                                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-2xs transition-all cursor-pointer ${
                                                                rule.is_active
                                                                    ? "bg-success-soft text-success border border-success/25"
                                                                    : "bg-surface-2 text-subtle border border-line"
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
                                                                className="h-8 px-2.5 text-xs text-muted hover:text-ink"
                                                            >
                                                                Edit
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => handleDelete(rule.id, rule.source_path)}
                                                                className="h-8 px-2 text-xs text-danger hover:text-danger hover:bg-danger-soft"
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
                                                ? "bg-primary text-primary-foreground font-bold"
                                                : link.url
                                                ? "bg-surface border border-line text-muted hover:text-ink hover:bg-surface-2 cursor-pointer"
                                                : "bg-surface-2 border border-line text-faint cursor-not-allowed"
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
                                <div className="rounded-2xl border border-line bg-surface px-5 py-10 text-center text-xs text-faint shadow-xs">
                                    Zero 404 dropped requests currently logged. All crawl pathways clean!
                                </div>
                            ) : (
                                notFoundLogs.map((log) => (
                                    <div
                                        key={log.id}
                                        className="rounded-2xl border border-line bg-surface p-4 shadow-xs"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0 flex-1 font-mono font-bold text-sm text-warning break-all">
                                                {log.path}
                                            </div>
                                            <span className="shrink-0 px-2.5 py-0.5 rounded-full text-2xs font-bold bg-warning-soft text-warning border border-warning/25">
                                                {log.hit_count} hits
                                            </span>
                                        </div>

                                        <div className="mt-3 divide-y divide-line border-t border-line text-xs">
                                            <div className="flex items-start justify-between gap-3 py-2">
                                                <span className="text-2xs font-semibold uppercase tracking-wide text-faint shrink-0">
                                                    Referer
                                                </span>
                                                <span className="font-mono text-right text-muted break-all">
                                                    {log.referer || "Direct / Bookmark / Bot"}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between gap-3 py-2">
                                                <span className="text-2xs font-semibold uppercase tracking-wide text-faint">
                                                    Last Seen
                                                </span>
                                                <span className="text-muted">
                                                    {log.last_seen_at}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-3 pt-3 border-t border-line flex justify-end">
                                            <Button
                                                size="sm"
                                                onClick={() => openResolveModal(log)}
                                                className="min-h-11 w-full sm:w-auto text-xs bg-primary text-primary-foreground hover:bg-primary-hover font-semibold"
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
                        <div className="hidden md:block border border-line rounded-2xl overflow-hidden bg-surface shadow-xs">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-surface-2 border-b border-line text-subtle uppercase text-2xs">
                                        <tr>
                                            <th className="py-3.5 px-4 font-semibold">404 Dropped URL</th>
                                            <th className="py-3.5 px-4 text-center font-semibold">Miss Count</th>
                                            <th className="py-3.5 px-4 font-semibold">Referer / Backlink Source</th>
                                            <th className="py-3.5 px-4 font-semibold">Last Attempt</th>
                                            <th className="py-3.5 px-4 text-right font-semibold">Instant Resolution</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-line text-ink-2">
                                        {notFoundLogs.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="text-center py-12 text-faint">
                                                    Zero 404 dropped requests currently logged. All crawl pathways clean!
                                                </td>
                                            </tr>
                                        ) : (
                                            notFoundLogs.map((log) => (
                                                <tr key={log.id} className="hover:bg-surface-2 transition-colors">
                                                    <td className="py-3.5 px-4 font-semibold text-warning max-w-sm truncate">
                                                        {log.path}
                                                    </td>
                                                    <td className="py-3.5 px-4 text-center font-bold">
                                                        <span className="px-2 py-0.5 rounded-full bg-warning-soft text-warning border border-warning/25">
                                                            {log.hit_count} hits
                                                        </span>
                                                    </td>
                                                    <td className="py-3.5 px-4 text-subtle max-w-xs truncate text-2xs">
                                                        {log.referer || "Direct / Bookmark / Bot Crawler"}
                                                    </td>
                                                    <td className="py-3.5 px-4 text-subtle text-2xs">
                                                        {log.last_seen_at}
                                                    </td>
                                                    <td className="py-3.5 px-4 text-right">
                                                        <Button
                                                            size="sm"
                                                            onClick={() => openResolveModal(log)}
                                                            className="h-8 text-xs bg-primary text-primary-foreground hover:bg-primary-hover font-semibold"
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-2 backdrop-blur-sm">
                    <div className="w-full max-w-lg bg-surface border border-line rounded-2xl p-5 sm:p-6 shadow-2xl relative space-y-5 animate-in fade-in-50 zoom-in-95 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-line pb-4">
                            <div>
                                <h2 className="text-lg font-bold text-ink">
                                    {editingRule ? "Edit Redirect Rule" : "Create Redirect Rule"}
                                </h2>
                                <p className="text-xs text-subtle mt-0.5">
                                    Instantly redirect obsolete or campaign URLs to high-converting destinations.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={closeRuleModal}
                                className="p-1.5 rounded-lg text-faint hover:text-ink hover:bg-surface-2"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={submitRule} className="space-y-4">
                            <div>
                                <label className="block text-xs text-subtle uppercase mb-1 font-bold">
                                    Source Path (What visitors request) *
                                </label>
                                <Input
                                    value={ruleForm.data.source_path}
                                    onChange={(e) => ruleForm.setData("source_path", e.target.value)}
                                    placeholder="/old-portfolio or /photo-editing"
                                    className="bg-surface border-line text-xs text-ink"
                                    required
                                />
                                {ruleForm.errors.source_path && (
                                    <p className="text-xs text-danger mt-1">{ruleForm.errors.source_path}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs text-subtle uppercase mb-1 font-bold">
                                    Target Destination URL *
                                </label>
                                <Input
                                    value={ruleForm.data.target_url}
                                    onChange={(e) => ruleForm.setData("target_url", e.target.value)}
                                    placeholder="/case-studies or https://external-domain.com"
                                    className="bg-surface border-line text-xs text-ink"
                                    required
                                />
                                {ruleForm.errors.target_url && (
                                    <p className="text-xs text-danger mt-1">{ruleForm.errors.target_url}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-subtle uppercase mb-1 font-bold">
                                        HTTP Status Code
                                    </label>
                                    <select
                                        value={ruleForm.data.status_code}
                                        onChange={(e) => ruleForm.setData("status_code", parseInt(e.target.value, 10))}
                                        className="w-full h-10 sm:h-9 rounded-md bg-surface border border-line text-xs text-ink px-3"
                                    >
                                        <option value={301}>301 Permanent (Preserves SEO equity)</option>
                                        <option value={302}>302 Temporary (Campaign / Testing)</option>
                                        <option value={410}>410 Gone (Permanently deleted asset)</option>
                                        <option value={403}>403 Forbidden (Block bad crawlers)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs text-subtle uppercase mb-1 font-bold">
                                        Router Pattern
                                    </label>
                                    <label className="flex items-center gap-2 h-10 sm:h-9 px-3 rounded-md bg-surface-2 border border-line cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={ruleForm.data.is_regex}
                                            onChange={(e) => ruleForm.setData("is_regex", e.target.checked)}
                                            className="rounded border-line-strong text-primary focus:ring-0"
                                        />
                                        <span className="text-xs text-ink-2">Regex Pattern</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs text-subtle uppercase mb-1 font-bold">
                                    Notes / Campaign Reference
                                </label>
                                <Input
                                    value={ruleForm.data.notes}
                                    onChange={(e) => ruleForm.setData("notes", e.target.value)}
                                    placeholder="e.g. 2024 print catalog QR code or Google Ads campaign"
                                    className="bg-surface border-line text-xs text-ink"
                                />
                            </div>

                            <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-line">
                                <Button type="button" variant="outline" onClick={closeRuleModal} className="min-h-10 sm:min-h-9 text-xs">
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={ruleForm.processing}
                                    className="min-h-10 sm:min-h-9 bg-primary text-primary-foreground hover:bg-primary-hover text-xs font-semibold"
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-2 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-surface border border-line rounded-2xl p-5 sm:p-6 shadow-2xl relative space-y-5 animate-in fade-in-50 zoom-in-95 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-line pb-4">
                            <div>
                                <h2 className="text-base font-bold text-ink flex items-center gap-2">
                                    <ArrowLeftRight className="w-4 h-4 text-primary" />
                                    Resolve 404 to 301 Redirect
                                </h2>
                                <p className="text-xs text-subtle mt-1">
                                    Convert dropped traffic into active visitors.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setResolvingLog(null)}
                                className="p-1.5 rounded-lg text-faint hover:text-ink hover:bg-surface-2"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={submitResolve404} className="space-y-4">
                            <div>
                                <label className="block text-xs text-subtle uppercase mb-1 font-bold">
                                    Original 404 Path ({resolvingLog.hit_count} hits recorded)
                                </label>
                                <div className="p-2.5 rounded-lg bg-warning-soft border border-warning/25 font-mono text-xs text-warning break-all">
                                    {resolvingLog.path}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs text-subtle uppercase mb-1 font-bold">
                                    Permanent Target Destination (301) *
                                </label>
                                <Input
                                    value={resolveForm.data.target_url}
                                    onChange={(e) => resolveForm.setData("target_url", e.target.value)}
                                    placeholder="/capabilities or /case-studies"
                                    className="bg-surface border-line text-xs text-ink"
                                    required
                                />
                            </div>

                            <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-line">
                                <Button type="button" variant="outline" onClick={() => setResolvingLog(null)} className="min-h-10 sm:min-h-9 text-xs">
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={resolveForm.processing}
                                    className="min-h-10 sm:min-h-9 bg-primary text-primary-foreground hover:bg-primary-hover text-xs font-semibold"
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-2 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-surface border border-line rounded-2xl p-5 sm:p-6 shadow-2xl relative space-y-5 animate-in fade-in-50 zoom-in-95 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-line pb-4">
                            <div>
                                <h2 className="text-base font-bold text-ink flex items-center gap-2">
                                    <Upload className="w-4 h-4 text-primary" />
                                    Bulk Import Redirects
                                </h2>
                                <p className="text-xs text-subtle mt-1">
                                    Upload a CSV with columns: source_path, target_url, status_code
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsImportModalOpen(false)}
                                className="p-1.5 rounded-lg text-faint hover:text-ink hover:bg-surface-2"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleImportCsv} className="space-y-4">
                            <div className="p-4 rounded-xl border border-dashed border-line-strong bg-surface-2 text-center">
                                <input
                                    type="file"
                                    accept=".csv,.txt"
                                    onChange={(e) => importForm.setData("csv_file", e.target.files?.[0] || null)}
                                    className="block w-full text-xs text-muted file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary-hover cursor-pointer"
                                />
                            </div>

                            <div className="text-2xs text-muted space-y-1 bg-surface-2 p-3 rounded-lg border border-line">
                                <p className="text-ink font-semibold">CSV Column Format Example:</p>
                                <p className="text-subtle">source_path, target_url, status_code</p>
                                <p className="text-success">/old-service, /capabilities/2d/ghost-mannequin, 301</p>
                            </div>

                            <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-line">
                                <Button type="button" variant="outline" onClick={() => setIsImportModalOpen(false)} className="min-h-10 sm:min-h-9 text-xs">
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={!importForm.data.csv_file || importForm.processing}
                                    className="min-h-10 sm:min-h-9 bg-primary text-primary-foreground hover:bg-primary-hover text-xs font-semibold"
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
