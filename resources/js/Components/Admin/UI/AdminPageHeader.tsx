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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-white/10 mb-8">
            <div className="space-y-1">
                {eyebrow && (
                    <div className="font-mono text-xs uppercase tracking-widest text-accent">
                        {eyebrow}
                    </div>
                )}
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                        {title}
                    </h1>
                    {badge && (
                        <span className="px-2.5 py-0.5 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-xs font-semibold">
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

                {finalActionLabel && (
                    actionHref ? (
                        <Link href={actionHref}>
                            <Button className="gap-2 bg-accent hover:bg-[#b8dd00] text-black font-mono font-bold">
                                <Plus className="w-4 h-4" />
                                <span>{finalActionLabel}</span>
                            </Button>
                        </Link>
                    ) : (
                        <Button onClick={finalActionClick} className="gap-2 bg-accent hover:bg-[#b8dd00] text-black font-mono font-bold cursor-pointer">
                            <Plus className="w-4 h-4" />
                            <span>{finalActionLabel}</span>
                        </Button>
                    )
                )}
            </div>
        </div>
    );
}
