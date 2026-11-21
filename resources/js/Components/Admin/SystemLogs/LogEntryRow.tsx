import React, { useState } from "react";
import { ChevronRight, Copy } from "lucide-react";
import { toast } from "@/Components/ui/sonner";
import { cn } from "@/lib/utils";

export interface LogEntry {
    id: number;
    datetime: string;
    environment: string;
    level: string;
    message: string;
    details: string;
}

export const LEVEL_STYLES: Record<string, string> = {
    emergency: "bg-danger text-white border-danger",
    alert: "bg-danger text-white border-danger",
    critical: "bg-danger-soft text-danger border-danger/25",
    error: "bg-danger-soft text-danger border-danger/25",
    warning: "bg-warning-soft text-warning border-warning/25",
    notice: "bg-info-soft text-info border-info/25",
    info: "bg-info-soft text-info border-info/25",
    debug: "bg-surface-2 text-muted border-line",
};

function formatDate(datetime: string): string {
    const parsed = new Date(datetime.replace(" ", "T"));

    return Number.isNaN(parsed.getTime()) ? datetime : parsed.toLocaleString();
}

export function LogEntryRow({ entry }: { entry: LogEntry }) {
    const [expanded, setExpanded] = useState(false);

    const copyDetails = async () => {
        await navigator.clipboard.writeText(`[${entry.datetime}] ${entry.environment}.${entry.level.toUpperCase()}: ${entry.details}`);
        toast.success("Log entry copied");
    };

    return (
        <div className="border-b border-line last:border-b-0">
            <button
                type="button"
                onClick={() => setExpanded((prev) => !prev)}
                aria-expanded={expanded}
                className="flex w-full cursor-pointer items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-2"
            >
                <ChevronRight
                    className={cn("mt-0.5 h-4 w-4 shrink-0 text-faint transition-transform", expanded && "rotate-90")}
                />
                <span
                    className={cn(
                        "mt-0.5 w-20 shrink-0 rounded-full border px-2 py-0.5 text-center text-2xs font-bold uppercase",
                        LEVEL_STYLES[entry.level] ?? LEVEL_STYLES.debug
                    )}
                >
                    {entry.level}
                </span>
                <span className="min-w-0 flex-1">
                    <span className="block break-words font-mono text-xs text-ink">{entry.message}</span>
                    <span className="mt-1 block text-2xs text-subtle">
                        {formatDate(entry.datetime)} · {entry.environment}
                    </span>
                </span>
            </button>

            {expanded && (
                <div className="space-y-2 bg-surface-2 px-4 pb-4 pt-1">
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={copyDetails}
                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 py-1 text-2xs font-semibold text-ink-2 hover:bg-surface-2"
                        >
                            <Copy className="h-3 w-3" />
                            Copy
                        </button>
                    </div>
                    <pre className="max-h-[480px] overflow-auto whitespace-pre-wrap break-all rounded-xl border border-line bg-surface p-3 font-mono text-2xs leading-relaxed text-ink-2">
                        {entry.details}
                    </pre>
                </div>
            )}
        </div>
    );
}
