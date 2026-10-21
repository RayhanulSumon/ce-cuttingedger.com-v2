import React, { useState } from "react";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Column<T> {
    header: string;
    accessorKey?: keyof T;
    key?: string;
    cell?: (item: T) => React.ReactNode;
    render?: (item: T) => React.ReactNode;
    className?: string;
    sortable?: boolean;
}

interface AdminDataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    searchKey?: keyof T;
    searchPlaceholder?: string;
    emptyMessage?: string;
}

export function AdminDataTable<T extends { id?: number | string }>({
    columns,
    data,
    searchKey,
    searchPlaceholder = "Search records...",
    emptyMessage = "No records found.",
}: AdminDataTableProps<T>) {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const pageSize = 10;

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

    return (
        <div className="space-y-4">
            {/* Search Filter Bar */}
            {searchKey && (
                <div className="flex items-center justify-between gap-4">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                        <Input
                            placeholder={searchPlaceholder}
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            className="pl-9 bg-[#12141c] border-white/10 text-white placeholder:text-neutral-500"
                        />
                    </div>

                    <div className="text-xs font-mono text-neutral-400">
                        Total {filteredData.length} records
                    </div>
                </div>
            )}

            {/* Table Container */}
            <div className="rounded-2xl border border-white/10 bg-[#12141c] overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-neutral-300">
                        <thead className="bg-[#181b24] text-[11px] font-mono uppercase tracking-wider text-neutral-400 border-b border-white/10">
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
                        <tbody className="divide-y divide-white/5">
                            {paginatedData.length > 0 ? (
                                paginatedData.map((row, rowIdx) => (
                                    <tr
                                        key={row.id ?? rowIdx}
                                        className="hover:bg-white/[0.02] transition-colors"
                                    >
                                        {columns.map((col, colIdx) => (
                                            <td
                                                key={colIdx}
                                                className={cn(
                                                    "px-6 py-4 text-neutral-200",
                                                    col.className
                                                )}
                                            >
                                                {col.cell
                                                    ? col.cell(row)
                                                    : col.render
                                                    ? col.render(row)
                                                    : (col.accessorKey || col.key)
                                                    ? String(
                                                          row[(col.accessorKey || col.key) as keyof T] ?? ""
                                                      )
                                                    : null}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={columns.length}
                                        className="px-6 py-12 text-center text-neutral-500 font-mono text-xs"
                                    >
                                        {emptyMessage}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination footer */}
                {totalPages > 1 && (
                    <div className="px-6 py-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-neutral-400 bg-[#0e1017]">
                        <span>
                            Page {page} of {totalPages}
                        </span>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="h-8 px-2.5"
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
                                className="h-8 px-2.5"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
