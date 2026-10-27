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
            target_url: "/services",
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
                return <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">301 Permanent</span>;
            case 302:
                return <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">302 Temporary</span>;
            case 410:
                return <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">410 Gone</span>;
            case 403:
                return <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">403 Blocked</span>;
            case 404:
                return <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-neutral-500/10 text-neutral-400 border border-neutral-500/20">404 Dropped</span>;
            default:
                return <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-white/10 text-neutral-300">{code}</span>;
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-8">
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
                            className="border-white/10 bg-neutral-900/60 hover:bg-neutral-800 text-xs text-neutral-300"
                        >
                            <Download className="w-3.5 h-3.5 mr-1.5" />
                            Export CSV
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setIsImportModalOpen(true)}
                            className="border-white/10 bg-neutral-900/60 hover:bg-neutral-800 text-xs text-neutral-300"
                        >
                            <Upload className="w-3.5 h-3.5 mr-1.5" />
                            Import CSV
                        </Button>
                        <Button
                            onClick={openCreateModal}
                            className="bg-accent text-black hover:bg-accent-hover font-semibold text-xs shadow-lg shadow-accent/10"
                        >
                            <Plus className="w-4 h-4 mr-1.5" />
                            New Redirect
                        </Button>
                    </div>
                </AdminPageHeader>

                {/* Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-5 rounded-xl border border-white/10 bg-neutral-900/50 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">Total Active Rules</span>
                            <ArrowLeftRight className="w-4 h-4 text-accent" />
                        </div>
                        <div className="text-3xl font-bold text-white mt-2 font-mono">
                            {stats.total_redirects.toLocaleString()}
                        </div>
                        <p className="text-xs text-neutral-500 mt-1">301 / 302 canonical paths preserving pagerank</p>
                    </div>

                    <div className="p-5 rounded-xl border border-white/10 bg-neutral-900/50 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">Total Redirect Hits</span>
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div className="text-3xl font-bold text-emerald-400 mt-2 font-mono">
                            {stats.total_hits.toLocaleString()}
                        </div>
                        <p className="text-xs text-neutral-500 mt-1">Traffic preserved without hitting 404 drops</p>
                    </div>

                    <div className="p-5 rounded-xl border border-white/10 bg-neutral-900/50 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">Logged 404 Paths</span>
                            <AlertOctagon className="w-4 h-4 text-amber-400" />
                        </div>
                        <div className="text-3xl font-bold text-amber-400 mt-2 font-mono">
                            {stats.total_404s.toLocaleString()}
                        </div>
                        <p className="text-xs text-neutral-500 mt-1">Broken backlink requests waiting for 301 fixes</p>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setActiveTab("rules")}
                            className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all ${
                                activeTab === "rules"
                                    ? "bg-accent text-black shadow-md shadow-accent/10"
                                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                            }`}
                        >
                            Active Redirect Rules ({redirects.total})
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("404s")}
                            className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-2 ${
                                activeTab === "404s"
                                    ? "bg-amber-400 text-black shadow-md shadow-amber-400/10"
                                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                            }`}
                        >
                            <span>404 Monitoring Log</span>
                            {stats.total_404s > 0 && (
                                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === "404s" ? "bg-black text-amber-400" : "bg-amber-500/20 text-amber-300"}`}>
                                    {stats.total_404s}
                                </span>
                            )}
                        </button>
                    </div>

                    {activeTab === "rules" && (
                        <form onSubmit={handleSearch} className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                                <Input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Filter by source or target..."
                                    className="h-8 pl-8 text-xs bg-neutral-900 border-white/10 w-64 text-neutral-200 placeholder:text-neutral-600"
                                />
                            </div>
                            <Button type="submit" size="sm" variant="secondary" className="h-8 text-xs">
                                Search
                            </Button>
                        </form>
                    )}

                    {activeTab === "404s" && notFoundLogs.length > 0 && (
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleClear404s}
                            className="h-8 text-xs bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30"
                        >
                            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                            Clear 404 Logs
                        </Button>
                    )}
                </div>

                {/* Tab: Redirect Rules */}
                {activeTab === "rules" && (
                    <div className="space-y-4">
                        <div className="border border-white/10 rounded-xl overflow-hidden bg-neutral-950/60 backdrop-blur-md">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-white/5 border-b border-white/10 text-neutral-400 font-mono uppercase text-[11px]">
                                        <tr>
                                            <th className="py-3 px-4">Source Path</th>
                                            <th className="py-3 px-4">Target Destination</th>
                                            <th className="py-3 px-4">Code</th>
                                            <th className="py-3 px-4 text-center">Hits</th>
                                            <th className="py-3 px-4">Notes</th>
                                            <th className="py-3 px-4 text-center">Status</th>
                                            <th className="py-3 px-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 text-neutral-300">
                                        {redirects.data.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="text-center py-12 text-neutral-500">
                                                    No redirect rules found matching your criteria.
                                                </td>
                                            </tr>
                                        ) : (
                                            redirects.data.map((rule) => (
                                                <tr key={rule.id} className="hover:bg-white/[0.02] transition-colors">
                                                    <td className="py-3 px-4 font-mono font-medium text-white max-w-xs truncate">
                                                        <span className="text-neutral-500 select-none">/</span>
                                                        {rule.source_path.replace(/^\//, "")}
                                                        {rule.is_regex && (
                                                            <span className="ml-1.5 px-1.5 py-0.2 rounded text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                                                REGEX
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="py-3 px-4 font-mono text-neutral-300 max-w-xs truncate">
                                                        {rule.target_url}
                                                    </td>
                                                    <td className="py-3 px-4 whitespace-nowrap">
                                                        {getStatusBadge(rule.status_code)}
                                                    </td>
                                                    <td className="py-3 px-4 text-center font-mono font-semibold text-neutral-200">
                                                        {rule.hit_count.toLocaleString()}
                                                    </td>
                                                    <td className="py-3 px-4 text-neutral-400 max-w-[200px] truncate">
                                                        {rule.notes || "—"}
                                                    </td>
                                                    <td className="py-3 px-4 text-center whitespace-nowrap">
                                                        <button
                            type="button"
                                                            onClick={() => handleToggle(rule.id)}
                                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono transition-all ${
                                                                rule.is_active
                                                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                                                                    : "bg-neutral-800 text-neutral-400 border border-neutral-700"
                                                            }`}
                                                        >
                                                            <Power className="w-3 h-3" />
                                                            {rule.is_active ? "Active" : "Disabled"}
                                                        </button>
                                                    </td>
                                                    <td className="py-3 px-4 text-right whitespace-nowrap">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => openEditModal(rule)}
                                                                className="h-7 px-2 text-xs text-neutral-400 hover:text-white"
                                                            >
                                                                Edit
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => handleDelete(rule.id, rule.source_path)}
                                                                className="h-7 px-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
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
                            <div className="flex items-center justify-center gap-1 pt-4">
                                {redirects.links.map((link, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => link.url && router.get(link.url)}
                                        disabled={!link.url}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1.5 rounded text-xs font-mono ${
                                            link.active
                                                ? "bg-accent text-black font-bold"
                                                : link.url
                                                ? "text-neutral-400 hover:text-white hover:bg-white/5"
                                                : "text-neutral-600 cursor-not-allowed"
                                        }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Tab: 404 Intelligence Log */}
                {activeTab === "404s" && (
                    <div className="border border-white/10 rounded-xl overflow-hidden bg-neutral-950/60 backdrop-blur-md">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-white/5 border-b border-white/10 text-neutral-400 font-mono uppercase text-[11px]">
                                    <tr>
                                        <th className="py-3 px-4">404 Dropped URL</th>
                                        <th className="py-3 px-4 text-center">Miss Count</th>
                                        <th className="py-3 px-4">Referer / Backlink Source</th>
                                        <th className="py-3 px-4">Last Attempt</th>
                                        <th className="py-3 px-4 text-right">Instant Resolution</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-neutral-300">
                                    {notFoundLogs.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="text-center py-12 text-neutral-500">
                                                Zero 404 dropped requests currently logged. All crawl pathways clean!
                                            </td>
                                        </tr>
                                    ) : (
                                        notFoundLogs.map((log) => (
                                            <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                                                <td className="py-3 px-4 font-mono font-medium text-amber-300 max-w-sm truncate">
                                                    {log.path}
                                                </td>
                                                <td className="py-3 px-4 text-center font-mono font-bold text-white">
                                                    <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                                        {log.hit_count} hits
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-neutral-400 max-w-xs truncate font-mono text-[11px]">
                                                    {log.referer || "Direct / Bookmark / Bot Crawler"}
                                                </td>
                                                <td className="py-3 px-4 text-neutral-500 font-mono text-[11px]">
                                                    {log.last_seen_at}
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => openResolveModal(log)}
                                                        className="h-7 text-xs bg-accent text-black hover:bg-accent-hover font-semibold"
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
                )}
            </div>

            {/* Modal: Add / Edit Rule */}
            {isRuleModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="w-full max-w-lg bg-neutral-950 border border-white/10 rounded-2xl p-6 shadow-2xl relative space-y-5 animate-in fade-in-50 zoom-in-95">
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <div>
                                <h2 className="text-lg font-bold text-white">
                                    {editingRule ? "Edit Redirect Rule" : "Create Redirect Rule"}
                                </h2>
                                <p className="text-xs text-neutral-400 mt-0.5">
                                    Instantly redirect obsolete or campaign URLs to high-converting destinations.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={closeRuleModal}
                                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={submitRule} className="space-y-4">
                            <div>
                                <label className="block text-xs font-mono text-neutral-300 uppercase mb-1">
                                    Source Path (What visitors request) *
                                </label>
                                <Input
                                    value={ruleForm.data.source_path}
                                    onChange={(e) => ruleForm.setData("source_path", e.target.value)}
                                    placeholder="/old-portfolio or /services/photo-editing"
                                    className="bg-neutral-900 border-white/10 text-xs font-mono"
                                    required
                                />
                                {ruleForm.errors.source_path && (
                                    <p className="text-xs text-rose-400 mt-1">{ruleForm.errors.source_path}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-mono text-neutral-300 uppercase mb-1">
                                    Target Destination URL *
                                </label>
                                <Input
                                    value={ruleForm.data.target_url}
                                    onChange={(e) => ruleForm.setData("target_url", e.target.value)}
                                    placeholder="/case-studies or https://external-domain.com"
                                    className="bg-neutral-900 border-white/10 text-xs font-mono"
                                    required
                                />
                                {ruleForm.errors.target_url && (
                                    <p className="text-xs text-rose-400 mt-1">{ruleForm.errors.target_url}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-mono text-neutral-300 uppercase mb-1">
                                        HTTP Status Code
                                    </label>
                                    <select
                                        value={ruleForm.data.status_code}
                                        onChange={(e) => ruleForm.setData("status_code", parseInt(e.target.value, 10))}
                                        className="w-full h-9 rounded-md bg-neutral-900 border border-white/10 text-xs text-white px-3"
                                    >
                                        <option value={301}>301 Permanent (Preserves SEO equity)</option>
                                        <option value={302}>302 Temporary (Campaign / Testing)</option>
                                        <option value={410}>410 Gone (Permanently deleted asset)</option>
                                        <option value={403}>403 Forbidden (Block bad crawlers)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-mono text-neutral-300 uppercase mb-1">
                                        Router Pattern
                                    </label>
                                    <label className="flex items-center gap-2 h-9 px-3 rounded-md bg-neutral-900 border border-white/10 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={ruleForm.data.is_regex}
                                            onChange={(e) => ruleForm.setData("is_regex", e.target.checked)}
                                            className="rounded border-white/20 text-accent focus:ring-0"
                                        />
                                        <span className="text-xs text-neutral-300">Regex Pattern</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-mono text-neutral-300 uppercase mb-1">
                                    Notes / Campaign Reference
                                </label>
                                <Input
                                    value={ruleForm.data.notes}
                                    onChange={(e) => ruleForm.setData("notes", e.target.value)}
                                    placeholder="e.g. 2024 print catalog QR code or Google Ads campaign"
                                    className="bg-neutral-900 border-white/10 text-xs"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                                <Button type="button" variant="ghost" onClick={closeRuleModal} className="text-xs">
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={ruleForm.processing}
                                    className="bg-accent text-black hover:bg-accent-hover text-xs font-semibold"
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-neutral-950 border border-white/10 rounded-2xl p-6 shadow-2xl relative space-y-5 animate-in fade-in-50 zoom-in-95">
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <div>
                                <h2 className="text-base font-bold text-white flex items-center gap-2">
                                    <ArrowLeftRight className="w-4 h-4 text-accent" />
                                    Resolve 404 to 301 Redirect
                                </h2>
                                <p className="text-xs text-neutral-400 mt-1">
                                    Convert dropped traffic into active visitors.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setResolvingLog(null)}
                                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={submitResolve404} className="space-y-4">
                            <div>
                                <label className="block text-xs font-mono text-neutral-400 uppercase mb-1">
                                    Original 404 Path ({resolvingLog.hit_count} hits recorded)
                                </label>
                                <div className="p-2.5 rounded bg-neutral-900 border border-white/10 font-mono text-xs text-amber-300">
                                    {resolvingLog.path}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-mono text-neutral-300 uppercase mb-1">
                                    Permanent Target Destination (301) *
                                </label>
                                <Input
                                    value={resolveForm.data.target_url}
                                    onChange={(e) => resolveForm.setData("target_url", e.target.value)}
                                    placeholder="/services or /case-studies"
                                    className="bg-neutral-900 border-white/10 text-xs font-mono"
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                                <Button type="button" variant="ghost" onClick={() => setResolvingLog(null)} className="text-xs">
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={resolveForm.processing}
                                    className="bg-accent text-black hover:bg-accent-hover text-xs font-semibold"
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-neutral-950 border border-white/10 rounded-2xl p-6 shadow-2xl relative space-y-5 animate-in fade-in-50 zoom-in-95">
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <div>
                                <h2 className="text-base font-bold text-white flex items-center gap-2">
                                    <Upload className="w-4 h-4 text-accent" />
                                    Bulk Import Redirects
                                </h2>
                                <p className="text-xs text-neutral-400 mt-1">
                                    Upload a CSV with columns: source_path, target_url, status_code
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsImportModalOpen(false)}
                                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleImportCsv} className="space-y-4">
                            <div className="p-4 rounded-xl border border-dashed border-white/20 bg-neutral-900/60 text-center">
                                <input
                                    type="file"
                                    accept=".csv,.txt"
                                    onChange={(e) => importForm.setData("csv_file", e.target.files?.[0] || null)}
                                    className="block w-full text-xs text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-accent file:text-black hover:file:bg-[#c2eb00] cursor-pointer"
                                />
                            </div>

                            <div className="text-[11px] font-mono text-neutral-400 space-y-1 bg-black/40 p-3 rounded-lg border border-white/5">
                                <p className="text-neutral-300 font-semibold">CSV Column Format Example:</p>
                                <p className="text-neutral-500">source_path, target_url, status_code</p>
                                <p className="text-emerald-400">/old-service, /services/ecommerce-catalog-optimization, 301</p>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                                <Button type="button" variant="ghost" onClick={() => setIsImportModalOpen(false)} className="text-xs">
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={!importForm.data.csv_file || importForm.processing}
                                    className="bg-accent text-black hover:bg-accent-hover text-xs font-semibold"
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
