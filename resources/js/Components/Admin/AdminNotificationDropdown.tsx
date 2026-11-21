import React, { useState, useEffect, useCallback } from "react";
import { router } from "@inertiajs/react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
} from "@/Components/ui/dropdown-menu";
import { Button } from "@/Components/ui/button";
import {
    Bell,
    Sparkles,
    MessageSquareText,
    CheckCheck,
    Trash2,
    ExternalLink,
    X,
    Loader2,
    CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationItem {
    id: string;
    type: string;
    title: string;
    message: string;
    url?: string | null;
    data: Record<string, any>;
    is_read: boolean;
    read_at?: string | null;
    created_at: string;
    created_at_formatted: string;
}

export function AdminNotificationDropdown() {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Fetch notifications from server
    const fetchNotifications = useCallback(async () => {
        try {
            const res = await fetch("/admin/notifications", {
                headers: {
                    Accept: "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                },
            });
            if (res.ok) {
                const data = await res.json();
                setNotifications(data.notifications || []);
                setUnreadCount(data.unread_count || 0);
            }
        } catch (err) {
            // Silently handle
        }
    }, []);

    // Initial load and periodic refresh
    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 25000);
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    // Refresh when opened
    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen, fetchNotifications]);

    // Mark single notification as read
    const markAsRead = async (id: string, url?: string | null) => {
        try {
            await fetch(`/admin/notifications/${id}/read`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRF-TOKEN":
                        (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || "",
                },
            });

            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
            );
            setUnreadCount((c) => Math.max(0, c - 1));

            if (url) {
                setIsOpen(false);
                router.visit(url);
            }
        } catch (err) {
            // Silently handle
        }
    };

    // Mark all as read
    const markAllRead = async () => {
        try {
            await fetch("/admin/notifications/mark-all-read", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRF-TOKEN":
                        (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || "",
                },
            });

            setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
            setUnreadCount(0);
        } catch (err) {
            // Silently handle
        }
    };

    // Delete single notification
    const deleteNotification = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        try {
            await fetch(`/admin/notifications/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRF-TOKEN":
                        (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || "",
                },
            });

            setNotifications((prev) => {
                const target = prev.find((n) => n.id === id);
                if (target && !target.is_read) {
                    setUnreadCount((c) => Math.max(0, c - 1));
                }
                return prev.filter((n) => n.id !== id);
            });
        } catch (err) {
            // Silently handle
        }
    };

    // Clear all notifications
    const clearAll = async () => {
        try {
            await fetch("/admin/notifications/clear-all", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRF-TOKEN":
                        (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || "",
                },
            });

            setNotifications([]);
            setUnreadCount(0);
        } catch (err) {
            // Silently handle
        }
    };

    // Get icon badge based on notification type
    const getNotificationIcon = (type: string) => {
        if (type.includes("lead")) {
            return (
                <div className="w-8 h-8 rounded-lg bg-primary-soft border border-primary/30 text-primary-ink flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                </div>
            );
        }
        if (type.includes("chat")) {
            return (
                <div className="w-8 h-8 rounded-lg bg-warning-soft border border-warning/25 text-warning flex items-center justify-center shrink-0">
                    <MessageSquareText className="w-4 h-4" />
                </div>
            );
        }
        return (
            <div className="w-8 h-8 rounded-lg bg-surface-2 border border-line text-ink-2 flex items-center justify-center shrink-0">
                <Bell className="w-4 h-4" />
            </div>
        );
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    className="relative p-2 rounded-xl bg-surface-2 hover:bg-surface-3 border border-line text-muted hover:text-ink transition-all cursor-pointer focus:outline-hidden"
                    title="Real-time Admin Notifications"
                >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-2xs shadow-sm animate-pulse">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    )}
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="w-84 sm:w-96 bg-surface border border-line rounded-2xl shadow-xl p-0 overflow-hidden text-ink z-50 flex flex-col"
            >
                {/* Header */}
                <div className="p-3.5 px-4 border-b border-line bg-surface-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-ink">Notifications</span>
                        {unreadCount > 0 ? (
                            <span className="px-1.5 py-0.2 rounded-full bg-primary/10 text-primary text-2xs font-bold border border-primary/25">
                                {unreadCount} new
                            </span>
                        ) : (
                            <span className="text-xs text-faint">All read</span>
                        )}
                    </div>

                    <div className="flex items-center gap-1">
                        {unreadCount > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={markAllRead}
                                className="h-7 px-2 text-2xs text-muted hover:text-ink hover:bg-surface-2 gap-1"
                                title="Mark all as read"
                            >
                                <CheckCheck className="w-3.5 h-3.5 text-primary" />
                                <span>Mark read</span>
                            </Button>
                        )}
                        {notifications.length > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearAll}
                                className="h-7 w-7 p-0 text-faint hover:text-danger hover:bg-danger-soft"
                                title="Clear all notifications"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                        )}
                    </div>
                </div>

                {/* Body / Notification Items List */}
                <div className="max-h-[380px] overflow-y-auto divide-y divide-line scrollbar-thin scrollbar-thumb-white/10">
                    {notifications.length === 0 ? (
                        <div className="py-12 px-6 text-center space-y-2">
                            <div className="w-10 h-10 rounded-full bg-surface-2 border border-line text-subtle flex items-center justify-center mx-auto">
                                <CheckCircle2 className="w-5 h-5 text-subtle" />
                            </div>
                            <p className="text-sm font-semibold text-ink-2">All caught up!</p>
                            <p className="text-xs text-subtle">
                                No unread inquiries or captured leads at this moment.
                            </p>
                        </div>
                    ) : (
                        notifications.map((n) => (
                            <div
                                key={n.id}
                                onClick={() => markAsRead(n.id, n.url)}
                                className={cn(
                                    "p-3.5 px-4 flex items-start gap-3 transition-colors cursor-pointer group relative",
                                    n.is_read
                                        ? "bg-transparent hover:bg-surface-2 text-subtle"
                                        : "bg-primary-soft/60 hover:bg-primary-soft text-ink"
                                )}
                            >
                                {/* Left icon */}
                                {getNotificationIcon(n.type)}

                                {/* Content */}
                                <div className="flex-1 min-w-0 pr-5">
                                    <div className="flex items-center gap-1.5 mb-0.5">
                                        <span className="font-semibold text-xs text-ink truncate block">
                                            {n.title}
                                        </span>
                                        {!n.is_read && (
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                        )}
                                    </div>
                                    <p className="text-xs text-subtle line-clamp-2 leading-relaxed">
                                        {n.message}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1.5 text-2xs text-subtle">
                                        <span>{n.created_at_formatted}</span>
                                        {n.url && (
                                            <span className="text-info flex items-center gap-0.5 group-hover:underline">
                                                <span>View details</span>
                                                <ExternalLink className="w-2.5 h-2.5" />
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Delete single button */}
                                <button
                                    type="button"
                                    onClick={(e) => deleteNotification(e, n.id)}
                                    className="absolute top-3 right-3 p-1 rounded-md text-muted hover:text-danger hover:bg-danger-soft opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Delete notification"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                    <div className="p-2.5 px-4 border-t border-line bg-surface flex items-center justify-between text-2xs text-subtle">
                        <span>Real-time ops monitoring active</span>
                        <button
                            type="button"
                            onClick={() => {
                                setIsOpen(false);
                                router.visit("/admin/messages");
                            }}
                            className="text-primary-ink hover:underline"
                        >
                            View Inbox →
                        </button>
                    </div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
