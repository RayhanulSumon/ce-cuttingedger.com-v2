import React, { useState } from "react";
import { router } from "@inertiajs/react";
import { AdminLayout } from "@/Layouts/Admin/AdminLayout";
import { AdminPageHeader } from "@/Components/Admin/UI/AdminPageHeader";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { LEVEL_STYLES, LogEntry, LogEntryRow } from "@/Components/Admin/SystemLogs/LogEntryRow";
import { cn } from "@/lib/utils";
import { AlertTriangle, Download, FileText, RefreshCw, Search, Trash2, XCircle } from "lucide-react";

interface LogFile {
    name: string;
    size: number;
    modified_at: string;
}

interface PaginatedEntries {
    data: LogEntry[];
    links: { url: string | null; label: string; active: boolean }[];
    total: number;
}

interface SystemLogsIndexProps {
    files: LogFile[];
    currentFile: string | null;
    entries: PaginatedEntries;
    levelCounts: Record<string, number>;
    totalEntries: number;
    truncated: boolean;
    filters: { level?: string | null; search?: string | null };
}

const LEVELS = ["emergency", "alert", "critical", "error", "warning", "notice", "info", "debug"];
const ERROR_LEVELS = ["emergency", "alert", "critical", "error"];

function formatBytes(bytes: number): string {
    if (bytes < 1024) {
        return `${bytes} B`;
    }
    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function SystemLogsIndex({
    files = [],
    currentFile,
    entries,
    levelCounts = {},
    totalEntries,
    truncated,
    filters = {},
}: SystemLogsIndexProps) {
    const [search, setSearch] = useState(filters.search ?? "");

    const errorCount = ERROR_LEVELS.reduce((sum, level) => sum + (levelCounts[level] ?? 0), 0);
    const currentFileInfo = files.find((file) => file.name === currentFile);

    const visit = (params: Record<string, string | null | undefined>) => {
        router.get(
            route("admin.system-logs.index"),
            {
                file: currentFile,
                level: filters.level,
                search: filters.search,
                ...params,
            },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    const submitSearch = (e: React.FormEvent) => {
        e.preventDefault();
        visit({ search: search || null });
    };

    const clearLog = () => {
        if (currentFile && confirm(`Clear all entries from ${currentFile}? This cannot be undone.`)) {
            router.delete(route("admin.system-logs.clear"), { data: { file: currentFile } });
        }
    };

    return (
        <AdminLayout title="System Logs">
            <div className="space-y-6">
                <AdminPageHeader
                    title="System Logs"
                    description="Laravel application logs, exceptions, and stack traces from storage/logs."
                    badge="Super Admin"
                    eyebrow="Error Monitoring"
                >
                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={() => router.reload()}
                            className="min-h-10 sm:min-h-9 border-line bg-surface hover:bg-surface-2 text-xs text-ink-2"
                        >
                            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                            Refresh
                        </Button>
                        {currentFile && (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={() => window.open(route("admin.system-logs.download", { file: currentFile }), "_blank")}
                                    className="min-h-10 sm:min-h-9 border-line bg-surface hover:bg-surface-2 text-xs text-ink-2"
                                >
                                    <Download className="w-3.5 h-3.5 mr-1.5" />
                                    Download
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={clearLog}
                                    className="min-h-10 sm:min-h-9 border-danger/25 bg-danger-soft text-danger hover:bg-danger-soft text-xs"
                                >
                                    <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                                    Clear Log
                                </Button>
                            </>
                        )}
                    </div>
                </AdminPageHeader>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-5 rounded-2xl border border-line bg-surface shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs uppercase tracking-wider text-subtle">Errors &amp; Critical</span>
                            <XCircle className="w-4 h-4 text-danger" />
                        </div>
                        <div className="text-3xl font-bold text-danger mt-2 tabular-nums">{errorCount.toLocaleString()}</div>
                    </div>
                    <div className="p-5 rounded-2xl border border-line bg-surface shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs uppercase tracking-wider text-subtle">Warnings</span>
                            <AlertTriangle className="w-4 h-4 text-warning" />
                        </div>
                        <div className="text-3xl font-bold text-warning mt-2 tabular-nums">
                            {(levelCounts.warning ?? 0).toLocaleString()}
                        </div>
                    </div>
                    <div className="p-5 rounded-2xl border border-line bg-surface shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs uppercase tracking-wider text-subtle">Total Entries</span>
                            <FileText className="w-4 h-4 text-primary" />
                        </div>
                        <div className="text-3xl font-bold text-ink mt-2 tabular-nums">{totalEntries.toLocaleString()}</div>
                        {currentFileInfo && (
                            <p className="text-xs text-subtle mt-1">
                                {currentFileInfo.name} · {formatBytes(currentFileInfo.size)}
                            </p>
                        )}
                    </div>
                </div>

                {/* Filters */}
                <div className="space-y-3 rounded-2xl border border-line bg-surface p-4 shadow-xs">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <select
                            value={currentFile ?? ""}
                            onChange={(e) => visit({ file: e.target.value, level: null, search: null, page: null })}
                            className="h-9 rounded-lg border border-line bg-surface px-3 text-xs text-ink"
                        >
                            {files.length === 0 && <option value="">No log files</option>}
                            {files.map((file) => (
                                <option key={file.name} value={file.name}>
                                    {file.name} ({formatBytes(file.size)})
                                </option>
                            ))}
                        </select>

                        <form onSubmit={submitSearch} className="flex flex-1 items-center gap-2">
                            <div className="relative flex-1">
                                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
                                <Input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search message or stack trace..."
                                    className="h-9 pl-8 text-xs bg-surface border-line text-ink placeholder:text-faint"
                                />
                            </div>
                            <Button type="submit" size="sm" variant="outline" className="min-h-9 text-xs">
                                Search
                            </Button>
                        </form>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                        <button
                            type="button"
                            onClick={() => visit({ level: null, page: null })}
                            className={cn(
                                "cursor-pointer rounded-full border px-3 py-1 text-2xs font-bold uppercase transition-colors",
                                !filters.level ? "bg-primary text-primary-foreground border-primary" : "bg-surface border-line text-muted hover:text-ink"
                            )}
                        >
                            All ({totalEntries})
                        </button>
                        {LEVELS.filter((level) => (levelCounts[level] ?? 0) > 0).map((level) => (
                            <button
                                key={level}
                                type="button"
                                onClick={() => visit({ level, page: null })}
                                className={cn(
                                    "cursor-pointer rounded-full border px-3 py-1 text-2xs font-bold uppercase transition-opacity",
                                    LEVEL_STYLES[level],
                                    filters.level && filters.level !== level ? "opacity-50 hover:opacity-100" : ""
                                )}
                            >
                                {level} ({levelCounts[level]})
                            </button>
                        ))}
                    </div>

                    {truncated && (
                        <p className="text-2xs text-subtle">
                            Large file — showing entries from the newest 5 MB only. Download the file for the full history.
                        </p>
                    )}
                </div>

                {/* Entries */}
                <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-xs">
                    {entries.data.length === 0 ? (
                        <div className="px-5 py-12 text-center text-xs text-faint">
                            No log entries found{filters.level || filters.search ? " for the current filters" : ""}.
                        </div>
                    ) : (
                        entries.data.map((entry) => <LogEntryRow key={`${currentFile}-${entry.id}`} entry={entry} />)
                    )}
                </div>

                {entries.links.length > 3 && (
                    <div className="flex flex-wrap items-center justify-center gap-1 pt-2">
                        {entries.links.map((link, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => link.url && router.get(link.url, {}, { preserveScroll: true })}
                                disabled={!link.url}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={cn(
                                    "min-h-10 sm:min-h-8 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors",
                                    link.active
                                        ? "bg-primary text-primary-foreground font-bold"
                                        : link.url
                                          ? "bg-surface border border-line text-muted hover:text-ink hover:bg-surface-2 cursor-pointer"
                                          : "bg-surface-2 border border-line text-faint cursor-not-allowed"
                                )}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
