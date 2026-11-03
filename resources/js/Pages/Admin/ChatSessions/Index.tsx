import React, { useState, useEffect, useRef, useCallback } from "react";
import { router } from "@inertiajs/react";
import { AdminLayout } from "@/Layouts/Admin/AdminLayout";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/Components/ui/alert-dialog";
import {
    MessageSquare,
    Search,
    Send,
    Bot,
    User,
    Check,
    CheckCheck,
    ExternalLink,
    Maximize2,
    Trash2,
    Radio,
    Clock,
    Shield,
    Sparkles,
    Calendar,
    Paperclip,
    ArrowDown,
    RefreshCw,
    UserCheck,
    AlertTriangle,
    Mail,
    Phone,
    MapPin,
    Building2,
} from "lucide-react";
import { echo } from "@laravel/echo-react";
import { cn } from "@/lib/utils";

interface ChatSessionItem {
    id: string;
    lead_name: string;
    lead_email?: string | null;
    lead_phone?: string | null;
    company?: string | null;
    service_interest?: string | null;
    estimated_price?: string | null;
    status: "active" | "idle" | "converted" | "abandoned";
    mode?: "bot" | "operator";
    needs_human?: boolean;
    operator_id?: number | null;
    operator_name?: string | null;
    is_assigned_to_me?: boolean;
    ip_address?: string | null;
    messages_count: number;
    unread_count?: number;
    last_message?: string;
    last_message_sender?: string;
    last_message_time?: string;
    has_consultation: boolean;
    last_active_at?: string;
    last_active_formatted: string;
    created_at: string;
}

interface TranscriptMessage {
    id: number | string;
    sender: "user" | "assistant" | "system" | "operator";
    content: string;
    attachments?: string[];
    tool_calls?: any[];
    tool_results?: any[];
    is_read?: boolean;
    created_at?: string;
    created_at_formatted: string;
}

interface ChatSessionsIndexProps {
    sessions: {
        data: ChatSessionItem[];
        current_page: number;
        last_page: number;
        total: number;
    };
    stats: {
        total_sessions: number;
        captured_leads: number;
        converted: number;
        active_recent: number;
        needs_human?: number;
        operator_active?: number;
    };
    currentStatus?: string;
    initialSessionId?: string;
    currentAdmin?: {
        id: number;
        name: string;
        email: string;
    };
}

const QUICK_REPLIES = [
    "👋 Hello! Welcome to CuttingEdger Studio. How can I assist you with your images today?",
    "💰 Our commercial base rates: Hand-drawn Clipping Paths from $0.45/image, Ghost Mannequin from $0.99, and Retouching from $1.99.",
    "🎁 You can test our quality right now with 3 Free Sample Edits with zero commitment!",
    "⏱️ Our turnaround SLA is standard 12–24 hours, with an express rush option of 6 hours.",
    "📅 Would you like to schedule a quick 15-minute technical consultation call with our team?",
];

export default function ChatSessionsIndex({
    sessions,
    stats,
    currentStatus,
    initialSessionId,
    currentAdmin,
}: ChatSessionsIndexProps) {
    const sessionList = sessions.data || [];
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
        initialSessionId || (sessionList.length > 0 ? sessionList[0].id : null)
    );

    const [searchQuery, setSearchQuery] = useState("");
    const [filterTab, setFilterTab] = useState<"all" | "needs_human" | "operator" | "bot">(
        (currentStatus as any) || "all"
    );

    const [activeSession, setActiveSession] = useState<ChatSessionItem | null>(null);
    const [messages, setMessages] = useState<TranscriptMessage[]>([]);
    const [isLoadingTranscript, setIsLoadingTranscript] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [isUserTyping, setIsUserTyping] = useState(false);
    const [showScrollBottomBtn, setShowScrollBottomBtn] = useState(false);
    const [deleteSessionId, setDeleteSessionId] = useState<string | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastTypingSentRef = useRef<number>(0);

    // Filter sessions locally or by tab
    const filteredSessions = sessionList.filter((s) => {
        if (filterTab === "needs_human" && !s.needs_human) return false;
        if (filterTab === "operator" && s.mode !== "operator") return false;
        if (filterTab === "bot" && (s.mode === "operator" || s.needs_human)) return false;

        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
            (s.lead_name && s.lead_name.toLowerCase().includes(q)) ||
            (s.lead_email && s.lead_email.toLowerCase().includes(q)) ||
            (s.ip_address && s.ip_address.toLowerCase().includes(q)) ||
            (s.last_message && s.last_message.toLowerCase().includes(q))
        );
    });

    // Update activeSession object when selectedSessionId changes
    useEffect(() => {
        if (!selectedSessionId) {
            setActiveSession(null);
            setMessages([]);
            return;
        }
        const item = sessionList.find((s) => s.id === selectedSessionId);
        if (item) {
            setActiveSession(item);
        }
        loadTranscript(selectedSessionId);
    }, [selectedSessionId, sessionList]);

    // Load full message transcript from server
    const loadTranscript = async (sessionId: string) => {
        setIsLoadingTranscript(true);
        try {
            const res = await fetch(`/admin/chat-sessions/${sessionId}`, {
                headers: {
                    Accept: "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                },
            });
            const data = await res.json();
            if (data.session) {
                setActiveSession((prev) => ({
                    ...(prev || {}),
                    id: data.session.id,
                    lead_name: data.session.lead_name || "Anonymous Visitor",
                    lead_email: data.session.lead_email,
                    lead_phone: data.session.lead_phone,
                    company: data.session.company,
                    mode: data.session.mode,
                    needs_human: Boolean(data.session.needs_human),
                    operator_id: data.session.operator_id,
                    operator_name: data.session.operator_name,
                    is_assigned_to_me: data.session.operator_id === currentAdmin?.id,
                    status: data.session.status,
                    ip_address: data.session.ip_address,
                    messages_count: (data.messages || []).length,
                    has_consultation: prev?.has_consultation ?? false,
                    last_active_formatted: prev?.last_active_formatted ?? "Just now",
                    created_at: prev?.created_at ?? new Date().toISOString(),
                }));
            }
            if (data.messages) {
                setMessages(data.messages);
            }
        } catch (err) {
            console.error("Failed to load chat transcript", err);
        } finally {
            setIsLoadingTranscript(false);
            setTimeout(() => scrollToBottom("auto"), 60);
        }
    };

    // Auto-scroll handler
    const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
        messagesEndRef.current?.scrollIntoView({ behavior });
    };

    // Native mouse wheel scroll handler on the message container
    useEffect(() => {
        const el = scrollContainerRef.current;
        if (!el) return;
        const handleWheel = (e: WheelEvent) => {
            e.stopPropagation();
            el.scrollTop += e.deltaY;
        };
        el.addEventListener("wheel", handleWheel, { passive: true });
        return () => el.removeEventListener("wheel", handleWheel);
    }, [selectedSessionId]);

    const handleScroll = () => {
        const el = scrollContainerRef.current;
        if (!el) return;
        const isUp = el.scrollHeight - el.scrollTop - el.clientHeight > 140;
        setShowScrollBottomBtn(isUp);
    };

    // Echo WebSocket listener for the selected session
    useEffect(() => {
        if (!selectedSessionId) return;

        try {
            const echoInstance = echo();
            if (!echoInstance) return;

            const channel = echoInstance.channel(`chat.${selectedSessionId}`);

            const onMessageSent = (data: any) => {
                const newMsg = data.message || data;
                setMessages((prev) => {
                    if (prev.some((m) => String(m.id) === String(newMsg.id))) return prev;
                    return [...prev, newMsg];
                });
                scrollToBottom("smooth");
            };

            const onMessageRead = (data: any) => {
                const ids = data.message_ids || [];
                setMessages((prev) =>
                    prev.map((m) =>
                        ids.length === 0 || ids.includes(m.id) ? { ...m, is_read: true } : m
                    )
                );
            };

            const onUserTyping = (data: any) => {
                if (data.sender === "user" && data.is_typing) {
                    setIsUserTyping(true);
                    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
                    typingTimeoutRef.current = setTimeout(() => setIsUserTyping(false), 3500);
                } else if (data.sender === "user" && !data.is_typing) {
                    setIsUserTyping(false);
                }
            };

            channel.listen("ChatMessageSent", onMessageSent);
            channel.listen(".ChatMessageSent", onMessageSent);
            channel.listen("ChatMessageRead", onMessageRead);
            channel.listen(".ChatMessageRead", onMessageRead);
            channel.listen("ChatUserTyping", onUserTyping);
            channel.listen(".ChatUserTyping", onUserTyping);

            return () => {
                echoInstance.leaveChannel(`chat.${selectedSessionId}`);
            };
        } catch (err) {
            console.warn("Reverb WebSocket connection", err);
        }
    }, [selectedSessionId]);

    // Send operator reply
    const handleSendReply = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const text = replyText.trim();
        if (!text || isSending || !selectedSessionId) return;

        setIsSending(true);
        setReplyText("");

        try {
            const res = await fetch(`/admin/chat-sessions/${selectedSessionId}/reply`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRF-TOKEN":
                        (document.querySelector('meta[name="csrf-token"]') as any)?.content || "",
                },
                body: JSON.stringify({ content: text }),
            });
            const data = await res.json();
            if (data.message) {
                setMessages((prev) => {
                    if (prev.some((m) => String(m.id) === String(data.message.id))) return prev;
                    return [...prev, data.message];
                });
                setActiveSession((prev) =>
                    prev
                        ? {
                              ...prev,
                              mode: "operator",
                              operator_name: currentAdmin?.name || "Super Admin",
                              is_assigned_to_me: true,
                          }
                        : null
                );
                scrollToBottom("smooth");
            }
        } catch (err) {
            console.error("Failed to send operator reply", err);
        } finally {
            setIsSending(false);
        }
    };

    // Operator typing trigger
    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setReplyText(e.target.value);
        if (!selectedSessionId) return;

        const now = Date.now();
        if (now - lastTypingSentRef.current > 1500) {
            lastTypingSentRef.current = now;
            fetch(`/admin/chat-sessions/${selectedSessionId}/typing`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRF-TOKEN":
                        (document.querySelector('meta[name="csrf-token"]') as any)?.content || "",
                },
                body: JSON.stringify({ is_typing: true }),
            }).catch(() => {});
        }
    };

    // Takeover chat
    const handleTakeover = async () => {
        if (!selectedSessionId) return;
        try {
            const res = await fetch(`/admin/chat-sessions/${selectedSessionId}/takeover`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRF-TOKEN":
                        (document.querySelector('meta[name="csrf-token"]') as any)?.content || "",
                },
            });
            const data = await res.json();
            if (data.session) {
                setActiveSession((prev) =>
                    prev
                        ? {
                              ...prev,
                              mode: "operator",
                              needs_human: false,
                              operator_name: data.session.operator_name,
                              is_assigned_to_me: true,
                          }
                        : null
                );
            }
            if (data.announcement) {
                setMessages((prev) => [...prev, data.announcement]);
                scrollToBottom("smooth");
            }
        } catch (err) {
            console.error("Failed to takeover chat", err);
        }
    };

    // Release to bot
    const handleRelease = async () => {
        if (!selectedSessionId) return;
        try {
            const res = await fetch(`/admin/chat-sessions/${selectedSessionId}/release`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRF-TOKEN":
                        (document.querySelector('meta[name="csrf-token"]') as any)?.content || "",
                },
            });
            const data = await res.json();
            if (data.session) {
                setActiveSession((prev) =>
                    prev
                        ? {
                              ...prev,
                              mode: "bot",
                              needs_human: false,
                              operator_name: null,
                              is_assigned_to_me: false,
                          }
                        : null
                );
            }
            if (data.announcement) {
                setMessages((prev) => [...prev, data.announcement]);
                scrollToBottom("smooth");
            }
        } catch (err) {
            console.error("Failed to release chat", err);
        }
    };

    // Pop into Floating Multi-Chat Dock
    const handlePopToFloating = () => {
        if (!activeSession) return;
        window.dispatchEvent(
            new CustomEvent("open-admin-floating-chat", {
                detail: {
                    sessionId: activeSession.id,
                    leadName: activeSession.lead_name,
                },
            })
        );
    };

    // Delete session
    const handleDeleteSession = () => {
        if (!deleteSessionId) return;
        router.delete(`/admin/chat-sessions/${deleteSessionId}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteSessionId(null);
                if (selectedSessionId === deleteSessionId) {
                    const remaining = sessionList.filter((s) => s.id !== deleteSessionId);
                    setSelectedSessionId(remaining.length > 0 ? remaining[0].id : null);
                }
            },
        });
    };

    return (
        <AdminLayout title="Messenger & Live Studio Console">
            {/* Top Stat Pills */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="p-3 rounded-xl bg-[#0f111a] border border-white/10 flex items-center justify-between">
                    <div>
                        <div className="text-[11px] font-mono uppercase text-neutral-400">Total Conversations</div>
                        <div className="text-xl font-bold text-white mt-0.5">{stats.total_sessions}</div>
                    </div>
                    <div className="p-2 rounded-lg bg-white/5 text-neutral-400">
                        <MessageSquare className="w-4 h-4" />
                    </div>
                </div>

                <div className="p-3 rounded-xl bg-[#0f111a] border border-white/10 flex items-center justify-between">
                    <div>
                        <div className="text-[11px] font-mono uppercase text-neutral-400">Captured Leads</div>
                        <div className="text-xl font-bold text-amber-400 mt-0.5">{stats.captured_leads}</div>
                    </div>
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                        <Sparkles className="w-4 h-4" />
                    </div>
                </div>

                <div className="p-3 rounded-xl bg-[#0f111a] border border-white/10 flex items-center justify-between">
                    <div>
                        <div className="text-[11px] font-mono uppercase text-neutral-400">Needs Human</div>
                        <div className="text-xl font-bold text-rose-400 mt-0.5">{stats.needs_human || 0}</div>
                    </div>
                    <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
                        <Radio className="w-4 h-4 animate-pulse" />
                    </div>
                </div>

                <div className="p-3 rounded-xl bg-[#0f111a] border border-white/10 flex items-center justify-between">
                    <div>
                        <div className="text-[11px] font-mono uppercase text-neutral-400">Live Operators</div>
                        <div className="text-xl font-bold text-cyan-400 mt-0.5">{stats.operator_active || 0}</div>
                    </div>
                    <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                        <UserCheck className="w-4 h-4" />
                    </div>
                </div>
            </div>

            {/* Messenger 2-Pane Container */}
            <div className="h-[calc(100vh-190px)] min-h-[580px] flex rounded-2xl border border-white/10 bg-[#0b0c13] overflow-hidden shadow-2xl">
                {/* LEFT PANE: Conversation List */}
                <div className="w-80 md:w-96 flex flex-col border-r border-white/10 bg-[#0c0e15] shrink-0">
                    {/* Search & Tabs */}
                    <div className="p-3 border-b border-white/10 space-y-2.5 bg-[#0e1018]">
                        <div className="relative">
                            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search visitor, email, or message..."
                                className="w-full pl-8 pr-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-accent transition-colors"
                            />
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-black/40 border border-white/5 text-[11px]">
                            <button
                                onClick={() => setFilterTab("all")}
                                className={cn(
                                    "flex-1 py-1 rounded-md font-medium transition-colors text-center cursor-pointer",
                                    filterTab === "all"
                                        ? "bg-white/15 text-white font-semibold"
                                        : "text-neutral-400 hover:text-white"
                                )}
                            >
                                All ({sessionList.length})
                            </button>
                            <button
                                onClick={() => setFilterTab("needs_human")}
                                className={cn(
                                    "flex-1 py-1 rounded-md font-medium transition-colors text-center flex items-center justify-center gap-1 cursor-pointer",
                                    filterTab === "needs_human"
                                        ? "bg-rose-500/20 text-rose-300 font-semibold"
                                        : "text-neutral-400 hover:text-rose-300"
                                )}
                            >
                                <span>🚨</span>
                                <span>Human ({stats.needs_human || 0})</span>
                            </button>
                            <button
                                onClick={() => setFilterTab("operator")}
                                className={cn(
                                    "flex-1 py-1 rounded-md font-medium transition-colors text-center cursor-pointer",
                                    filterTab === "operator"
                                        ? "bg-cyan-500/20 text-cyan-300 font-semibold"
                                        : "text-neutral-400 hover:text-cyan-300"
                                )}
                            >
                                Live ({stats.operator_active || 0})
                            </button>
                        </div>
                    </div>

                    {/* Scrollable Conversation Items */}
                    <div className="flex-1 overflow-y-auto divide-y divide-white/5">
                        {filteredSessions.length === 0 ? (
                            <div className="p-8 text-center text-xs text-neutral-500 font-mono">
                                No conversations found matching filters.
                            </div>
                        ) : (
                            filteredSessions.map((s) => {
                                const isSelected = s.id === selectedSessionId;
                                const isNeedsHuman = s.needs_human;
                                const isLive = s.mode === "operator";

                                return (
                                    <button
                                        key={s.id}
                                        onClick={() => setSelectedSessionId(s.id)}
                                        className={cn(
                                            "w-full text-left p-3.5 transition-all flex items-start gap-3 cursor-pointer group relative",
                                            isSelected
                                                ? "bg-accent/10 border-l-4 border-accent text-white"
                                                : "hover:bg-white/5 text-neutral-300"
                                        )}
                                    >
                                        {/* Avatar with Status Dot */}
                                        <div className="relative shrink-0 mt-0.5">
                                            <div
                                                className={cn(
                                                    "w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-md",
                                                    isNeedsHuman
                                                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                                                        : isLive
                                                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                                                        : "bg-white/10 text-neutral-300 border border-white/10"
                                                )}
                                            >
                                                {s.lead_name ? s.lead_name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                                            </div>
                                            <span
                                                className={cn(
                                                    "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0c0e15]",
                                                    isNeedsHuman
                                                        ? "bg-rose-500 animate-pulse"
                                                        : isLive
                                                        ? "bg-cyan-400 animate-pulse"
                                                        : "bg-emerald-500"
                                                )}
                                            />
                                        </div>

                                        {/* Content Preview */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-1">
                                                <span className="text-xs font-bold text-white truncate">
                                                    {s.lead_name || "Anonymous Visitor"}
                                                </span>
                                                <span className="text-[10px] font-mono text-neutral-400 shrink-0">
                                                    {s.last_message_time || s.last_active_formatted}
                                                </span>
                                            </div>

                                            <div className="text-[11px] text-neutral-400 truncate mt-0.5 font-normal">
                                                {s.last_message ? (
                                                    <span>{s.last_message}</span>
                                                ) : (
                                                    <span className="italic text-neutral-500">No messages yet</span>
                                                )}
                                            </div>

                                            {/* Badges */}
                                            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                                                {isNeedsHuman && (
                                                    <span className="px-1.5 py-0.2 rounded-md bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[9px] font-mono font-bold animate-pulse">
                                                        🚨 NEEDS HUMAN
                                                    </span>
                                                )}
                                                {isLive && (
                                                    <span className="px-1.5 py-0.2 rounded-md bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[9px] font-mono font-bold">
                                                        ⚡ LIVE: {s.operator_name || "Operator"}
                                                    </span>
                                                )}
                                                {s.is_assigned_to_me && (
                                                    <span className="px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-300 text-[9px] font-mono font-bold">
                                                        You
                                                    </span>
                                                )}
                                                {s.unread_count && s.unread_count > 0 ? (
                                                    <span className="ml-auto px-1.5 py-0.2 rounded-full bg-accent text-black text-[10px] font-bold font-mono">
                                                        {s.unread_count} new
                                                    </span>
                                                ) : null}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* RIGHT PANE: Full Conversation Workspace */}
                <div className="flex-1 flex flex-col bg-[#08090e] min-w-0">
                    {!activeSession ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-neutral-500">
                            <MessageSquare className="w-12 h-12 text-white/10 mb-3" />
                            <div className="text-sm font-semibold text-neutral-300">Select a Conversation</div>
                            <div className="text-xs text-neutral-500 max-w-sm mt-1">
                                Choose a visitor session from the left pane to view full transcripts, take over live, or reply in real time.
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Conversation Header */}
                            <div className="p-3.5 border-b border-white/10 bg-[#0f111a] flex items-center justify-between shrink-0">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center font-bold text-sm shrink-0">
                                        {activeSession.lead_name ? activeSession.lead_name.charAt(0).toUpperCase() : "V"}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-white truncate">
                                                {activeSession.lead_name || "Anonymous Visitor"}
                                            </span>
                                            {activeSession.needs_human && (
                                                <Badge variant="destructive" className="text-[10px] py-0 px-1.5 animate-pulse">
                                                    Needs Human
                                                </Badge>
                                            )}
                                            {activeSession.mode === "operator" && (
                                                <Badge variant="outline" className="text-[10px] py-0 px-1.5 text-cyan-400 border-cyan-400/40 bg-cyan-950/40">
                                                    Live: {activeSession.operator_name || "Specialist"}
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-3 text-[11px] text-neutral-400 font-mono mt-0.5 truncate">
                                            {activeSession.lead_email && (
                                                <span className="flex items-center gap-1">
                                                    <Mail className="w-3 h-3 text-neutral-500" />
                                                    {activeSession.lead_email}
                                                </span>
                                            )}
                                            {activeSession.ip_address && (
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-3 h-3 text-neutral-500" />
                                                    {activeSession.ip_address}
                                                </span>
                                            )}
                                            <span>• {messages.length} messages</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Header Action Buttons */}
                                <div className="flex items-center gap-2 shrink-0">
                                    {activeSession.mode === "operator" ? (
                                        <Button
                                            onClick={handleRelease}
                                            variant="outline"
                                            size="sm"
                                            className="text-xs h-8 border-cyan-500/40 bg-cyan-950/20 text-cyan-300 hover:bg-cyan-950/40 cursor-pointer"
                                        >
                                            <Bot className="w-3.5 h-3.5 mr-1.5" />
                                            Release to Bot
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={handleTakeover}
                                            size="sm"
                                            className="text-xs h-8 bg-amber-500 hover:bg-amber-400 text-black font-bold shadow-md shadow-amber-500/20 cursor-pointer"
                                        >
                                            <Radio className="w-3.5 h-3.5 mr-1.5 animate-pulse" />
                                            Take Over Live
                                        </Button>
                                    )}

                                    <Button
                                        onClick={handlePopToFloating}
                                        variant="outline"
                                        size="sm"
                                        title="Pop into dockable floating window"
                                        className="text-xs h-8 border-white/10 text-neutral-300 hover:text-white hover:bg-white/5 cursor-pointer"
                                    >
                                        <Maximize2 className="w-3.5 h-3.5 mr-1" />
                                        <span>Dock</span>
                                    </Button>

                                    <Button
                                        onClick={() => setDeleteSessionId(activeSession.id)}
                                        variant="ghost"
                                        size="sm"
                                        title="Delete chat session"
                                        className="h-8 w-8 p-0 text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            </div>

                            {/* Scrollable Message Feed */}
                            <div
                                ref={scrollContainerRef}
                                onScroll={handleScroll}
                                className="flex-1 overflow-y-auto p-4 space-y-3 relative"
                            >
                                {isLoadingTranscript ? (
                                    <div className="h-full flex items-center justify-center text-xs text-neutral-400 font-mono">
                                        Loading conversation transcript...
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="h-full flex items-center justify-center text-xs text-neutral-500 font-mono">
                                        No messages in this chat session yet.
                                    </div>
                                ) : (
                                    messages.map((m) => {
                                        const isUser = m.sender === "user";
                                        const isOperator = m.sender === "operator";

                                        return (
                                            <div
                                                key={m.id}
                                                className={cn(
                                                    "flex flex-col max-w-[78%]",
                                                    isUser ? "ml-auto items-end" : "mr-auto items-start"
                                                )}
                                            >
                                                {/* Sender Header Label */}
                                                <div className="text-[10px] font-mono text-neutral-400 mb-1 px-1 flex items-center gap-1.5">
                                                    <span>
                                                        {isUser
                                                            ? "Client (Visitor)"
                                                            : isOperator
                                                            ? `Operator (${activeSession.operator_name || "Live Specialist"})`
                                                            : "CuttingEdger AI Bot"}
                                                    </span>
                                                    <span>•</span>
                                                    <span>{m.created_at_formatted}</span>
                                                </div>

                                                {/* Chat Bubble */}
                                                <div
                                                    className={cn(
                                                        "p-3.5 rounded-2xl text-xs leading-relaxed break-words shadow-sm",
                                                        isUser
                                                            ? "bg-gradient-to-r from-amber-500/20 to-amber-600/15 border border-amber-500/30 text-amber-50 rounded-tr-xs"
                                                            : isOperator
                                                            ? "bg-gradient-to-r from-cyan-950/60 to-cyan-900/30 border border-cyan-500/30 text-cyan-50 rounded-tl-xs"
                                                            : "bg-[#151722] text-neutral-200 border border-white/10 rounded-tl-xs"
                                                    )}
                                                >
                                                    <div className="whitespace-pre-wrap">{m.content}</div>

                                                    {/* Tool Cards summary if present */}
                                                    {m.tool_results && m.tool_results.length > 0 && (
                                                        <div className="mt-2 pt-2 border-t border-white/10 text-[11px] text-accent font-mono">
                                                            📋 Embedded Tool Card: {m.tool_results[0].tool_type || "Interactive Card"}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Read Receipt */}
                                                {isUser && (
                                                    <div className="flex items-center gap-1 text-[10px] text-neutral-500 mt-0.5 px-1 font-mono">
                                                        <span>
                                                            {m.is_read ? (
                                                                <span className="text-cyan-400 flex items-center gap-0.5">
                                                                    <CheckCheck className="w-3.5 h-3.5" /> Read
                                                                </span>
                                                            ) : (
                                                                <span className="text-neutral-500 flex items-center gap-0.5">
                                                                    <Check className="w-3 h-3" /> Delivered
                                                                </span>
                                                            )}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                )}

                                {/* Real-Time User Typing Indicator */}
                                {isUserTyping && (
                                    <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs w-fit font-mono animate-in fade-in duration-200">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                                        <span>Client is typing...</span>
                                        <span className="flex gap-1 ml-0.5">
                                            <span className="w-1 h-1 rounded-full bg-amber-400 animate-bounce" />
                                            <span className="w-1 h-1 rounded-full bg-amber-400 animate-bounce [animation-delay:150ms]" />
                                            <span className="w-1 h-1 rounded-full bg-amber-400 animate-bounce [animation-delay:300ms]" />
                                        </span>
                                    </div>
                                )}

                                <div ref={messagesEndRef} />

                                {/* Floating Jump to Bottom Button */}
                                {showScrollBottomBtn && (
                                    <button
                                        onClick={() => scrollToBottom("smooth")}
                                        className="sticky bottom-2 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-accent text-black font-bold text-xs shadow-xl flex items-center gap-1.5 hover:bg-accent-hover transition-all cursor-pointer"
                                    >
                                        <ArrowDown className="w-3.5 h-3.5" />
                                        <span>Jump to latest</span>
                                    </button>
                                )}
                            </div>

                            {/* Operator Reply & Canned Responses Area */}
                            <div className="p-3 border-t border-white/10 bg-[#0e1018] shrink-0 space-y-2">
                                {/* Canned Responses Quick Pills */}
                                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
                                    <span className="text-neutral-500 shrink-0 font-mono text-[10px]">Canned:</span>
                                    {QUICK_REPLIES.map((reply, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setReplyText(reply)}
                                            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-neutral-300 hover:text-white transition-colors truncate max-w-[200px] shrink-0 cursor-pointer"
                                            title={reply}
                                        >
                                            {reply}
                                        </button>
                                    ))}
                                </div>

                                {/* Textarea & Send Button */}
                                <form onSubmit={handleSendReply} className="flex items-end gap-2">
                                    <textarea
                                        value={replyText}
                                        onChange={handleTextareaChange}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendReply();
                                            }
                                        }}
                                        rows={2}
                                        placeholder={`Reply to ${activeSession.lead_name || "visitor"}... (Enter to send, Shift+Enter for newline)`}
                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                                    />
                                    <Button
                                        type="submit"
                                        disabled={!replyText.trim() || isSending}
                                        className="h-10 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold disabled:opacity-30 transition-all cursor-pointer shadow-md shadow-cyan-500/20"
                                    >
                                        <Send className="w-4 h-4 mr-1.5" />
                                        <span>Send</span>
                                    </Button>
                                </form>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Delete Session Confirmation Dialog */}
            <AlertDialog
                open={!!deleteSessionId}
                onOpenChange={(open) => !open && setDeleteSessionId(null)}
            >
                <AlertDialogContent className="bg-[#12141f] border border-white/10 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Chat Session?</AlertDialogTitle>
                        <AlertDialogDescription className="text-neutral-400 text-xs">
                            This action will permanently delete this conversation and all associated visitor messages.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteSession}
                            className="bg-rose-500 hover:bg-rose-600 text-white font-bold"
                        >
                            Delete Transcript
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}
