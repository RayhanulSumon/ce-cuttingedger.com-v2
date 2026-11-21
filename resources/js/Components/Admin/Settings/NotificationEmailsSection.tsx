import React from "react";
import { BellRing, ChevronDown, X } from "lucide-react";
import { Textarea } from "@/Components/ui/textarea";
import { cn } from "@/lib/utils";

interface NotificationEmailsSectionProps {
    open: boolean;
    onToggle: () => void;
    value: string;
    onChange: (value: string) => void;
    error?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TRIGGERING_FORMS = [
    "Contact / project brief form",
    "Free trial orders",
    "Digital Twin orders",
    "Virtual Try-On orders",
    "Client portal credit orders",
];

function splitEmails(value: string): string[] {
    return value
        .split(/[\s,;]+/)
        .map((email) => email.trim())
        .filter(Boolean);
}

export function NotificationEmailsSection({ open, onToggle, value, onChange, error }: NotificationEmailsSectionProps) {
    const emails = splitEmails(value);
    const uniqueEmails = Array.from(new Set(emails.map((email) => email.toLowerCase())));
    const validCount = uniqueEmails.filter((email) => EMAIL_PATTERN.test(email)).length;

    const removeEmail = (target: string) => {
        onChange(
            uniqueEmails
                .filter((email) => email !== target)
                .join("\n")
        );
    };

    return (
        <section className="overflow-hidden rounded-2xl border border-line bg-surface shadow-xs">
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={open}
                className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-4 text-left transition-colors hover:bg-surface-2 sm:px-6"
            >
                <div className="flex min-w-0 items-center gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-danger-soft text-danger">
                        <BellRing className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                        <h2 className="text-sm font-bold text-ink">Form Notification Emails</h2>
                        <p className="truncate text-xs text-subtle">
                            Who gets an email when a visitor submits a form
                        </p>
                    </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                    <span className="hidden rounded-full bg-surface-2 px-2.5 py-0.5 text-2xs font-semibold text-muted sm:inline-block">
                        {validCount} recipient{validCount === 1 ? "" : "s"}
                    </span>
                    <ChevronDown
                        className={cn("h-4 w-4 text-faint transition-transform duration-200", open ? "rotate-180" : "")}
                    />
                </div>
            </button>

            {open && (
                <div className="space-y-4 border-t border-line px-4 py-5 sm:px-6">
                    <div>
                        <label className="text-xs font-semibold text-ink-2 block mb-1.5">
                            Admin Recipients (one email per line)
                        </label>
                        <Textarea
                            rows={6}
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder={"info@cuttingedger.com\nsales@cuttingedger.com"}
                            className="font-mono text-xs bg-surface border-line text-ink"
                        />
                        {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
                    </div>

                    {uniqueEmails.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {uniqueEmails.map((email) => {
                                const isValid = EMAIL_PATTERN.test(email);

                                return (
                                    <span
                                        key={email}
                                        className={cn(
                                            "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-2xs font-semibold",
                                            isValid
                                                ? "border-success/25 bg-success-soft text-success"
                                                : "border-danger/25 bg-danger-soft text-danger"
                                        )}
                                    >
                                        {email}
                                        <button
                                            type="button"
                                            onClick={() => removeEmail(email)}
                                            aria-label={`Remove ${email}`}
                                            className="cursor-pointer rounded-full hover:opacity-70"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </span>
                                );
                            })}
                        </div>
                    )}

                    {validCount === 0 && (
                        <p className="rounded-xl border border-warning/25 bg-warning-soft px-3 py-2 text-xs font-medium text-warning">
                            No valid recipients — form submissions will not send any admin email.
                        </p>
                    )}

                    <div className="rounded-xl border border-line bg-surface-2 px-4 py-3">
                        <p className="text-2xs font-semibold uppercase tracking-wider text-subtle">
                            Sent to these recipients on
                        </p>
                        <ul className="mt-1.5 grid grid-cols-1 gap-1 text-xs text-muted sm:grid-cols-2">
                            {TRIGGERING_FORMS.map((form) => (
                                <li key={form}>• {form}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </section>
    );
}
