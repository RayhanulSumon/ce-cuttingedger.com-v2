import React from "react";
import { Link } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Plus } from "lucide-react";

interface AdminPageHeaderProps {
    title: string;
    description?: string;
    badge?: string;
    actionLabel?: string;
    actionHref?: string;
    onActionClick?: () => void;
    children?: React.ReactNode;
}

export function AdminPageHeader({
    title,
    description,
    badge,
    actionLabel,
    actionHref,
    onActionClick,
    children,
}: AdminPageHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-white/10 mb-8">
            <div className="space-y-1">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                        {title}
                    </h1>
                    {badge && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#d4ff00]/10 border border-[#d4ff00]/30 text-[#d4ff00] font-mono text-xs font-semibold">
                            {badge}
                        </span>
                    )}
                </div>
                {description && (
                    <p className="text-sm text-neutral-400">{description}</p>
                )}
            </div>

            <div className="flex items-center gap-3">
                {children}

                {actionLabel && (
                    actionHref ? (
                        <Link href={actionHref}>
                            <Button className="gap-2">
                                <Plus className="w-4 h-4" />
                                <span>{actionLabel}</span>
                            </Button>
                        </Link>
                    ) : (
                        <Button onClick={onActionClick} className="gap-2">
                            <Plus className="w-4 h-4" />
                            <span>{actionLabel}</span>
                        </Button>
                    )
                )}
            </div>
        </div>
    );
}
