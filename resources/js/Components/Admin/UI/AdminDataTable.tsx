import React, { useState } from "react";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Column<T> {
    id?: string;
    header: string;
    accessorKey?: keyof T;
    key?: string;
    cell?: (item: T) => React.ReactNode;
    render?: (item: T) => React.ReactNode;
    className?: string;
    sortable?: boolean;
    mobileRole?: "title" | "status" | "meta" | "actions" | "hidden";
    mobileLabel?: string;
}

interface AdminDataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    searchKey?: keyof T;
    searchPlaceholder?: string;
    emptyMessage?: string;
    pageSize?: number;
    renderMobileCard?: (row: T) => React.ReactNode;
}

function renderColumnCell<T>(col: Column<T>, row: T): React.ReactNode {
    if (col.cell) return col.cell(row);
    if (col.render) return col.render(row);
    const field = (col.accessorKey || col.key) as keyof T | undefined;
    if (field) return String(row[field] ?? "");
    return null;
}

export function AdminDataTable<T extends { id?: number | string }>({
    columns,
    data,
    searchKey,
    searchPlaceholder = "Search records...",
    emptyMessage = "No records found.",
    pageSize = 10,
    renderMobileCard,
}: AdminDataTableProps<T>) {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const filteredData = React.useMemo(() => {
        if (!search || !searchKey) return data;
        return data.filter((item) => {
            const val = item[searchKey];
            if (val === null || val === undefined) return false;
            return String(val).toLowerCase().includes(search.toLowerCase());
        });
    }, [data, search, searchKey]);

    const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
    const paginatedData = filteredData.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    const { titleCol, statusCol, metaCols, actionsCol } = React.useMemo(() => {
        const isActionColumn = (col: Column<T>, idx: number) =>
            col.mobileRole === "actions" ||
            col.id === "actions" ||
            col.key === "actions" ||
            /^actions?$/i.test(col.header.trim()) ||
            (idx === columns.length - 1 && col.header.trim() === "");

        const actionCandidate =
            columns.find((col, idx) => isActionColumn(col, idx)) ?? null;
        const visibleCols = columns.filter(
            (col) => col !== actionCandidate && col.mobileRole !== "hidden"
        );
        const titleCandidate =
            visibleCols.find((col) => col.mobileRole === "title") ??
            visibleCols[0] ??
            null;
        const statusCandidate =
            visibleCols.find(
                (col) =>
                    col !== titleCandidate &&
                    (col.mobileRole === "status" || /status/i.test(col.header))
            ) ?? null;
        const meta = visibleCols.filter(
            (col) => col !== titleCandidate && col !== statusCandidate
        );

        return {
            titleCol: titleCandidate,
            statusCol: statusCandidate,
            metaCols: meta,
            actionsCol:
                actionCandidate && actionCandidate.mobileRole !== "hidden"
                    ? actionCandidate
                    : null,
        };
    }, [columns]);

    return (
        <div className="space-y-4">
            {/* Search Filter Bar */}
            {searchKey && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="relative w-full sm:max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder={searchPlaceholder}
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            className="pl-9 bg-white border-slate-200 text-ink placeholder:text-slate-400"
                        />
                    </div>

                    <div className="text-xs font-mono text-slate-500">
                        Total {filteredData.length} records
                    </div>
                </div>
            )}

            {/* Mobile Card List (< md) */}
            <div className="md:hidden space-y-3">
                {paginatedData.length > 0 ? (
                    paginatedData.map((row, rowIdx) =>
                        renderMobileCard ? (
                            <React.Fragment key={row.id ?? rowIdx}>
                                {renderMobileCard(row)}
                            </React.Fragment>
                        ) : (
                            <div
                                key={row.id ?? rowIdx}
                                className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs"
                            >
                                {(titleCol || statusCol) && (
                                    <div className="flex items-start justify-between gap-3">
                                        {titleCol && (
                                            <div className="min-w-0 flex-1 text-sm text-ink break-words">
                                                {renderColumnCell(titleCol, row)}
                                            </div>
                                        )}
                                        {statusCol && (
                                            <div className="shrink-0">
                                                {renderColumnCell(statusCol, row)}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {metaCols.length > 0 && (
                                    <div className="mt-3 divide-y divide-slate-100 border-t border-slate-100">
                                        {metaCols.map((col, colIdx) => {
                                            const label = col.mobileLabel ?? col.header;
                                            return (
                                                <div
                                                    key={colIdx}
                                                    className="flex items-start justify-between gap-3 py-2 text-xs"
                                                >
                                                    {label && (
                                                        <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 shrink-0 pt-0.5">
                                                            {label}
                                                        </span>
                                                    )}
                                                    <div className="min-w-0 flex-1 text-right text-slate-700 break-words flex justify-end">
                                                        {renderColumnCell(col, row)}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {actionsCol && (
                                    <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-end gap-2 [&_button]:min-h-11 [&_button]:min-w-11 [&_a]:min-h-11">
                                        {renderColumnCell(actionsCol, row)}
                                    </div>
                                )}
                            </div>
                        )
                    )
                ) : (
                    <div className="rounded-2xl border border-slate-200/90 bg-white px-5 py-10 text-center text-xs font-mono text-slate-400 shadow-xs">
                        {emptyMessage}
                    </div>
                )}
            </div>

            {/* Desktop Table Container (md+) */}
            <div className="hidden md:block rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-700">
                        <thead className="bg-[#f8fafc] text-[11px] font-mono uppercase tracking-wider text-slate-500 border-b border-slate-200">
                            <tr>
                                {columns.map((col, idx) => (
                                    <th
                                        key={idx}
                                        className={cn(
                                            "px-6 py-3.5 font-semibold",
                                            col.className
                                        )}
                                    >
                                        {col.header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {paginatedData.length > 0 ? (
                                paginatedData.map((row, rowIdx) => (
                                    <tr
                                        key={row.id ?? rowIdx}
                                        className="hover:bg-slate-50/80 transition-colors"
                                    >
                                        {columns.map((col, colIdx) => (
                                            <td
                                                key={colIdx}
                                                className={cn(
                                                    "px-6 py-4 text-slate-700",
                                                    col.className
                                                )}
                                            >
                                                {renderColumnCell(col, row)}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={columns.length}
                                        className="px-6 py-12 text-center text-slate-400 font-mono text-xs"
                                    >
                                        {emptyMessage}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Client Pagination Footer */}
            {totalPages > 1 && (
                <div className="rounded-2xl border border-slate-200/90 bg-[#f8fafc] px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs font-mono text-slate-500 shadow-xs">
                    <span>
                        Page {page} of {totalPages}
                    </span>
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="min-h-10 sm:min-h-8 px-3 sm:px-2.5"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                setPage((p) => Math.min(totalPages, p + 1))
                            }
                            disabled={page === totalPages}
                            className="min-h-10 sm:min-h-8 px-3 sm:px-2.5"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
