import React from "react";
import { Link } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Plus } from "lucide-react";

interface AdminPageHeaderProps {
    title: string;
    description?: string;
    badge?: string;
    eyebrow?: string;
    actionLabel?: string;
    actionHref?: string;
    onActionClick?: () => void;
    createLabel?: string;
    onCreate?: () => void;
    children?: React.ReactNode;
}

export function AdminPageHeader({
    title,
    description,
    badge,
    eyebrow,
    actionLabel,
    actionHref,
    onActionClick,
    createLabel,
    onCreate,
    children,
}: AdminPageHeaderProps) {
    const finalActionLabel = actionLabel || createLabel;
    const finalActionClick = onActionClick || onCreate;
    return (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 sm:pb-8 border-b border-line mb-6 sm:mb-8">
            <div className="space-y-1">
                {eyebrow && (
                    <div className="text-xs uppercase tracking-widest text-primary font-bold">
                        {eyebrow}
                    </div>
                )}
                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                    <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
                        {title}
                    </h1>
                    {badge && (
                        <span className="px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-semibold">
                            {badge}
                        </span>
                    )}
                </div>
                {description && (
                    <p className="text-sm text-muted">{description}</p>
                )}
            </div>

            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                {children}

                {finalActionLabel && (
                    actionHref ? (
                        <Link href={actionHref}>
                            <Button className="gap-2 bg-primary hover:bg-primary-hover text-primary-foreground font-bold shadow-xs">
                                <Plus className="w-4 h-4" />
                                <span>{finalActionLabel}</span>
                            </Button>
                        </Link>
                    ) : (
                        <Button onClick={finalActionClick} className="gap-2 bg-primary hover:bg-primary-hover text-primary-foreground font-bold cursor-pointer shadow-xs">
                            <Plus className="w-4 h-4" />
                            <span>{finalActionLabel}</span>
                        </Button>
                    )
                )}
            </div>
        </div>
    );
}
