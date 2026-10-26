import React, { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { AdminLayout } from "@/Layouts/Admin/AdminLayout";
import { AdminPageHeader } from "@/Components/Admin/UI/AdminPageHeader";
import { AdminDataTable, Column } from "@/Components/Admin/UI/AdminDataTable";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/Components/ui/dialog";
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
    MessageSquareText,
    Eye,
    Trash2,
    User,
    Mail,
    Phone,
    Calendar,
    Tag,
    Clock,
    Sparkles,
    Bot,
    ExternalLink,
    Paperclip,
    Shield,
    Loader2,
    CheckCircle2,
    Radio,
    Send,
    UserCheck,
    AlertTriangle,
} from "lucide-react";

interface ChatSessionItem {
    id: string;
    lead_name: string;
    lead_email?: string;
    lead_phone?: string;
    company?: string;
    service_interest?: string;
    estimated_price?: string;
    status: "active" | "idle" | "converted" | "abandoned";
    mode?: "bot" | "operator";
    needs_human?: boolean;
    operator_name?: string;
    ip_address?: string;
    messages_count: number;
    has_consultation: boolean;
    last_active_at?: string;
    last_active_formatted: string;
    created_at: string;
}

interface TranscriptMessage {
    id: number;
    sender: "user" | "assistant" | "system" | "operator";
    content: string;
    attachments: string[];
    tool_calls?: any[];
    tool_results?: any[];
    created_at_formatted: string;
}

interface ChatSessionsIndexProps {
    sessions: {
        data: ChatSessionItem[];
        current_page: number;
        last_page: number;
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
}

export default function ChatSessionsIndex({
    sessions,
    stats,
    currentStatus,
}: ChatSessionsIndexProps) {
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
    const [transcript, setTranscript] = useState<{
        session: any;
        messages: TranscriptMessage[];
    } | null>(null);
    const [isLoadingTranscript, setIsLoadingTranscript] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [isSendingReply, setIsSendingReply] = useState(false);
    const [isTogglingTakeover, setIsTogglingTakeover] = useState(false);
    const [sessionToDelete, setSessionToDelete] = useState<ChatSessionItem | null>(null);
    const [bulkDeleteType, setBulkDeleteType] = useState<"empty" | "all" | null>(null);

    // Synthesized Web Audio chime for live incoming visitor messages
    const playAdminChime = () => {
        try {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContextClass) return;
            const ctx = new AudioContextClass();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
            osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.12); // G5
            gain.gain.setValueAtTime(0.12, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.35);
        } catch {
            // Audio context not allowed or supported
        }
    };

    // Live Polling while transcript modal is open
    useEffect(() => {
        if (!activeSessionId) return;

        const interval = setInterval(async () => {
            try {
                const highestId = transcript?.messages?.reduce((max, m) => (m.id > max ? m.id : max), 0) || 0;
                const res = await fetch(`/admin/chat-sessions/${activeSessionId}/poll?after_id=${highestId}`, {
                    headers: { Accept: "application/json" },
                });
                const data = await res.json();

                if (data.session) {
                    setTranscript((prev) => {
                        if (!prev) return prev;
                        return {
                            ...prev,
                            session: {
                                ...prev.session,
                                ...data.session,
                            },
                        };
                    });
                }

                if (data.messages && data.messages.length > 0) {
                    playAdminChime();
                    setTranscript((prev) => {
                        if (!prev) return prev;
                        const existingIds = new Set(prev.messages.map((m) => m.id));
                        const newOnes = data.messages.filter((m: any) => !existingIds.has(m.id));
                        if (newOnes.length === 0) return prev;
                        return {
                            ...prev,
                            messages: [...prev.messages, ...newOnes],
                        };
                    });
                }
            } catch {
                // Background poll silent fallback
            }
        }, 2500);

        return () => clearInterval(interval);
    }, [activeSessionId, transcript]);

    const openTranscript = async (session: ChatSessionItem) => {
        setActiveSessionId(session.id);
        setIsLoadingTranscript(true);
        setReplyText("");
        try {
            const res = await fetch(route("admin.chat-sessions.show", session.id), {
                headers: {
                    Accept: "application/json",
                },
            });
            const data = await res.json();
            setTranscript(data);
        } catch (err) {
            console.error("Error loading transcript:", err);
        } finally {
            setIsLoadingTranscript(false);
        }
    };

    const handleTakeover = async () => {
        if (!activeSessionId || isTogglingTakeover) return;
        setIsTogglingTakeover(true);
        try {
            const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || "";
            const res = await fetch(`/admin/chat-sessions/${activeSessionId}/takeover`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                    Accept: "application/json",
                },
            });
            const data = await res.json();
            if (data.session) {
                setTranscript((prev) => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        session: { ...prev.session, ...data.session },
                        messages: data.announcement ? [...prev.messages, data.announcement] : prev.messages,
                    };
                });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsTogglingTakeover(false);
        }
    };

    const handleRelease = async () => {
        if (!activeSessionId || isTogglingTakeover) return;
        setIsTogglingTakeover(true);
        try {
            const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || "";
            const res = await fetch(`/admin/chat-sessions/${activeSessionId}/release`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                    Accept: "application/json",
                },
            });
            const data = await res.json();
            if (data.session) {
                setTranscript((prev) => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        session: { ...prev.session, ...data.session },
                        messages: data.announcement ? [...prev.messages, data.announcement] : prev.messages,
                    };
                });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsTogglingTakeover(false);
        }
    };

    const handleSendReply = async () => {
        if (!activeSessionId || !replyText.trim() || isSendingReply) return;
        setIsSendingReply(true);
        try {
            const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || "";
            const res = await fetch(`/admin/chat-sessions/${activeSessionId}/reply`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                    Accept: "application/json",
                },
                body: JSON.stringify({ content: replyText.trim() }),
            });
            const data = await res.json();
            if (data.message) {
                setTranscript((prev) => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        session: {
                            ...prev.session,
                            mode: "operator",
                        },
                        messages: [...prev.messages, data.message],
                    };
                });
                setReplyText("");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSendingReply(false);
        }
    };

    const handleDelete = () => {
        if (!sessionToDelete) return;
        router.delete(route("admin.chat-sessions.destroy", sessionToDelete.id), {
            preserveScroll: true,
            onSuccess: () => setSessionToDelete(null),
        });
    };

    const handleBulkDelete = () => {
        if (!bulkDeleteType) return;
        router.delete(route("admin.chat-sessions.destroy-all"), {
            data: { type: bulkDeleteType },
            preserveScroll: true,
            onSuccess: () => setBulkDeleteType(null),
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "converted":
                return <Badge variant="accent" className="font-mono">LEAD CONVERTED</Badge>;
            case "active":
                return <Badge variant="success" className="font-mono">ACTIVE</Badge>;
            case "idle":
                return <Badge variant="secondary" className="font-mono">IDLE</Badge>;
            case "abandoned":
                return <Badge variant="destructive" className="font-mono">ABANDONED</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const columns: Column<ChatSessionItem>[] = [
        {
            header: "Client / Visitor",
            accessorKey: "lead_name",
            cell: (row) => (
                <div className="space-y-0.5">
                    <div className="font-semibold text-white flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-accent" />
                        <span>{row.lead_name}</span>
                        {row.has_consultation && (
                            <span className="text-[9px] font-mono font-bold bg-[#00f5ff]/20 text-[#00f5ff] px-1.5 py-0.2 rounded">
                                CALL BOOKED
                            </span>
                        )}
                    </div>
                    <div className="text-xs text-neutral-400 font-mono flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-neutral-500" />
                        <span>{row.lead_email || "Not shared yet"}</span>
                    </div>
                </div>
            ),
        },
        {
            header: "Phone / WhatsApp",
            accessorKey: "lead_phone",
            cell: (row) => (
                <span className="text-xs font-mono text-neutral-300">
                    {row.lead_phone || <span className="text-neutral-600">—</span>}
                </span>
            ),
        },
        {
            header: "Quote Estimate",
            accessorKey: "estimated_price",
            cell: (row) => (
                <div className="font-mono text-xs">
                    {row.estimated_price ? (
                        <span className="font-bold text-accent">
                            ${row.estimated_price}
                        </span>
                    ) : (
                        <span className="text-neutral-600">—</span>
                    )}
                </div>
            ),
        },
        {
            header: "Messages",
            accessorKey: "messages_count",
            cell: (row) => (
                <span className="font-mono text-xs text-neutral-300">
                    {row.messages_count} msgs
                </span>
            ),
        },
        {
            header: "Mode & Status",
            accessorKey: "status",
            cell: (row) => (
                <div className="flex flex-col gap-1 items-start">
                    {row.needs_human && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
                            <AlertTriangle className="w-2.5 h-2.5" />
                            NEEDS HUMAN
                        </span>
                    )}
                    {row.mode === "operator" ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#00f5ff]/20 text-[#00f5ff] border border-[#00f5ff]/30">
                            <Radio className="w-2.5 h-2.5 animate-pulse" />
                            OPERATOR LIVE
                        </span>
                    ) : (
                        getStatusBadge(row.status)
                    )}
                </div>
            ),
        },
        {
            header: "Last Active",
            accessorKey: "last_active_at",
            cell: (row) => (
                <div className="text-xs font-mono text-neutral-400">
                    {row.last_active_formatted}
                </div>
            ),
        },
        {
            header: "Actions",
            id: "actions",
            cell: (row) => (
                <div className="flex items-center justify-end gap-1">
                    <Button
                        variant="default"
                        size="sm"
                        onClick={() => openTranscript(row)}
                        className={`h-8 px-2.5 text-xs font-mono gap-1.5 transition-all cursor-pointer ${
                            row.needs_human
                                ? "bg-rose-500 text-white hover:bg-rose-600 animate-pulse font-bold"
                                : row.mode === "operator"
                                ? "bg-[#00f5ff] text-black hover:bg-[#00d0db] font-bold"
                                : "bg-white/10 hover:bg-accent hover:text-black text-white"
                        }`}
                        title="Open Live Chat Console & Take Over"
                    >
                        {row.needs_human ? (
                            <>
                                <Radio className="w-3.5 h-3.5" />
                                <span>Join Live</span>
                            </>
                        ) : (
                            <>
                                <Eye className="w-3.5 h-3.5" />
                                <span>{row.mode === "operator" ? "Live Chat" : "Transcript"}</span>
                            </>
                        )}
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSessionToDelete(row)}
                        className="h-8 w-8 p-0 text-neutral-500 hover:text-rose-400 cursor-pointer"
                        title="Delete transcript"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <AdminLayout>
            <div className="space-y-6">
                <AdminPageHeader
                    title="Live Chat Sessions & Transcripts"
                    description="Monitor real-time visitor inquiries, captured leads, image quote calculations, and live human operator takeover."
                >
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.post(route("admin.chat-sessions.mark-all-read"), {}, { preserveScroll: true })}
                            className="border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-mono text-xs gap-1.5 h-9"
                            title="Mark all new chat leads as acknowledged / read"
                        >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Mark Leads Read</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setBulkDeleteType("empty")}
                            className="border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-mono text-xs gap-1.5 h-9"
                            title="Delete all empty sessions with 0 messages"
                        >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Clear 0-Msg Sessions</span>
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setBulkDeleteType("all")}
                            className="bg-rose-500/20 border border-rose-500/30 hover:bg-rose-600 text-rose-300 hover:text-white font-mono text-xs gap-1.5 h-9"
                            title="Delete all visitor chat sessions and transcripts"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete All</span>
                        </Button>
                    </div>
                </AdminPageHeader>

                {/* KPI Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-[#12141a] border border-white/5 rounded-2xl p-4">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                            Total Visitor Chats
                        </span>
                        <div className="text-2xl font-bold font-mono text-white">
                            {stats.total_sessions}
                        </div>
                    </div>
                    <div className="bg-[#12141a] border border-accent/30 rounded-2xl p-4">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-accent block mb-1">
                            Captured Leads
                        </span>
                        <div className="text-2xl font-bold font-mono text-accent">
                            {stats.captured_leads}
                        </div>
                    </div>
                    <div className={`rounded-2xl p-4 border transition-all ${
                        (stats.needs_human ?? 0) > 0
                            ? "bg-rose-500/10 border-rose-500/40 shadow-lg shadow-rose-500/10"
                            : "bg-[#12141a] border-white/5"
                    }`}>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 block mb-1 flex items-center gap-1.5">
                            {(stats.needs_human ?? 0) > 0 && <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />}
                            Needs Human Specialist
                        </span>
                        <div className={`text-2xl font-bold font-mono ${(stats.needs_human ?? 0) > 0 ? "text-rose-400" : "text-neutral-400"}`}>
                            {stats.needs_human ?? 0}
                        </div>
                    </div>
                    <div className="bg-[#12141a] border border-[#00f5ff]/20 rounded-2xl p-4">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#00f5ff] block mb-1">
                            Live Operator Active
                        </span>
                        <div className="text-2xl font-bold font-mono text-[#00f5ff]">
                            {stats.operator_active ?? 0}
                        </div>
                    </div>
                </div>

                {/* Main Table */}
                <AdminDataTable
                    data={sessions.data}
                    columns={columns}
                    searchPlaceholder="Search visitor name, email, or company..."
                    searchKey="lead_name"
                />

                {/* Full Live Operator Console Modal */}
                <Dialog
                    open={!!activeSessionId}
                    onOpenChange={(open) => {
                        if (!open) {
                            setActiveSessionId(null);
                            setTranscript(null);
                            setReplyText("");
                        }
                    }}
                >
                    <DialogContent className="max-w-3xl bg-[#0b0c10] border border-white/10 text-white max-h-[90vh] flex flex-col p-0 overflow-hidden shadow-2xl">
                        {/* Header with Live Takeover Controls */}
                        <div className="p-4 border-b border-white/10 bg-[#12141a] flex flex-wrap items-center justify-between gap-3 shrink-0">
                            <div>
                                <DialogTitle className="flex items-center gap-2 text-sm">
                                    <MessageSquareText className="w-4 h-4 text-accent" />
                                    <span>Live Client Chat Console</span>
                                    {transcript?.session?.needs_human && (
                                        <Badge variant="destructive" className="font-mono text-[10px] animate-pulse">
                                            NEEDS OPERATOR
                                        </Badge>
                                    )}
                                    {transcript?.session?.mode === "operator" && (
                                        <Badge variant="accent" className="font-mono text-[10px] bg-[#00f5ff]/20 text-[#00f5ff] border-[#00f5ff]/30">
                                            OPERATOR ACTIVE ({transcript.session.operator_name || 'You'})
                                        </Badge>
                                    )}
                                </DialogTitle>
                                <DialogDescription className="text-xs text-neutral-400 font-mono mt-0.5">
                                    {transcript?.session?.lead_email
                                        ? `Lead: ${transcript.session.lead_email} (${transcript.session.lead_name || 'Visitor'})`
                                        : `Anonymous Visitor • IP: ${transcript?.session?.ip_address || 'Unknown'}`}
                                </DialogDescription>
                            </div>

                            {/* Takeover Control Buttons */}
                            <div className="flex items-center gap-2">
                                {transcript?.session?.mode === "operator" ? (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleRelease}
                                        disabled={isTogglingTakeover}
                                        className="h-8 px-3 text-xs font-mono border-white/10 text-neutral-300 hover:text-white hover:bg-white/10 cursor-pointer"
                                        title="Hand chat back to automated assistant"
                                    >
                                        <Bot className="w-3.5 h-3.5 mr-1 text-accent" />
                                        <span>Release to Bot</span>
                                    </Button>
                                ) : (
                                    <Button
                                        variant="default"
                                        size="sm"
                                        onClick={handleTakeover}
                                        disabled={isTogglingTakeover}
                                        className="h-8 px-3 text-xs font-mono bg-[#00f5ff] hover:bg-[#00d0db] text-black font-bold cursor-pointer"
                                        title="Take over this conversation and chat live"
                                    >
                                        <Radio className="w-3.5 h-3.5 mr-1" />
                                        <span>Take Over Chat</span>
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Transcript Dialogue Scroll Container */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin scrollbar-thumb-white/10 min-h-[340px]">
                            {isLoadingTranscript ? (
                                <div className="flex items-center justify-center py-20 text-neutral-400 gap-2 font-mono text-xs">
                                    <Loader2 className="w-4 h-4 animate-spin text-accent" />
                                    <span>Loading conversation stream...</span>
                                </div>
                            ) : transcript?.messages && transcript.messages.length > 0 ? (
                                transcript.messages.map((m) => {
                                    const isUser = m.sender === "user";
                                    const isOperator = m.sender === "operator";

                                    return (
                                        <div
                                            key={m.id}
                                            className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                                        >
                                            <div className="flex items-center gap-1.5 mb-1 text-[10px] text-neutral-500 font-mono">
                                                {isUser ? (
                                                    <>
                                                        <span>{m.created_at_formatted}</span>
                                                        <span className="text-white font-semibold">Client</span>
                                                    </>
                                                ) : isOperator ? (
                                                    <>
                                                        <span className="text-[#00f5ff] font-semibold flex items-center gap-1">
                                                            <UserCheck className="w-3 h-3 text-[#00f5ff]" />
                                                            Operator ({transcript.session?.operator_name || 'You'})
                                                        </span>
                                                        <span>{m.created_at_formatted}</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="text-accent font-semibold">Assistant Bot</span>
                                                        <span>{m.created_at_formatted}</span>
                                                    </>
                                                )}
                                            </div>

                                            <div
                                                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                                                    isUser
                                                        ? "bg-accent text-black font-medium rounded-br-xs"
                                                        : isOperator
                                                        ? "bg-[#0e1b29] text-white border border-[#00f5ff]/40 rounded-bl-xs shadow-md shadow-[#00f5ff]/5"
                                                        : "bg-[#151720] text-white/90 border border-white/5 rounded-bl-xs"
                                                }`}
                                            >
                                                {/* Attachments */}
                                                {m.attachments && m.attachments.length > 0 && (
                                                    <div className="mb-2 flex flex-wrap gap-1.5">
                                                        {m.attachments.map((url, i) => (
                                                            <a
                                                                key={i}
                                                                href={url}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="relative group/att block"
                                                            >
                                                                <img
                                                                    src={url}
                                                                    alt="Uploaded attachment"
                                                                    className="w-16 h-16 object-cover rounded-lg border border-white/20"
                                                                />
                                                                <span className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/att:opacity-100 transition-opacity rounded-lg">
                                                                    <ExternalLink className="w-3.5 h-3.5 text-white" />
                                                                </span>
                                                            </a>
                                                        ))}
                                                    </div>
                                                )}

                                                <p className="whitespace-pre-wrap">{m.content}</p>

                                                {/* Tool results / Quote details */}
                                                {m.tool_results && m.tool_results.length > 0 && (
                                                    <div className="mt-2 pt-2 border-t border-white/10 space-y-1 font-mono text-[11px]">
                                                        {m.tool_results.map((res: any, rIdx: number) => (
                                                            <div key={rIdx} className="bg-black/30 p-2 rounded-lg border border-white/5">
                                                                <span className="text-accent block text-[10px] uppercase font-bold">
                                                                    Tool Executed: {res.type}
                                                                </span>
                                                                {res.service_name && (
                                                                    <div>Service: {res.service_name} • {res.quantity} imgs • ${res.total_price} USD</div>
                                                                )}
                                                                {res.datetime_formatted && (
                                                                    <div>Booked for: {res.datetime_formatted}</div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-center text-neutral-500 py-12 text-xs font-mono">
                                    No transcript messages recorded for this session.
                                </p>
                            )}
                        </div>

                        {/* Live Operator Reply Input Bar */}
                        <div className="p-3 border-t border-white/10 bg-[#12141a] shrink-0">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSendReply();
                                }}
                                className="flex items-center gap-2"
                            >
                                <input
                                    type="text"
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder={
                                        transcript?.session?.mode === "operator"
                                            ? "Type live message to client... (Press Enter to send)"
                                            : "Type message to take over and reply directly..."
                                    }
                                    disabled={isSendingReply}
                                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#00f5ff] transition-colors font-mono"
                                />
                                <Button
                                    type="submit"
                                    disabled={!replyText.trim() || isSendingReply}
                                    className="h-9 px-4 bg-[#00f5ff] hover:bg-[#00d0db] text-black font-mono font-bold text-xs gap-1.5 cursor-pointer disabled:opacity-40"
                                >
                                    {isSendingReply ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                        <>
                                            <Send className="w-3.5 h-3.5" />
                                            <span>Send</span>
                                        </>
                                    )}
                                </Button>
                            </form>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Alert */}
                <AlertDialog
                    open={!!sessionToDelete}
                    onOpenChange={(open) => !open && setSessionToDelete(null)}
                >
                    <AlertDialogContent className="bg-[#0b0c10] border border-white/10 text-white">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-white">Delete Chat Transcript?</AlertDialogTitle>
                            <AlertDialogDescription className="text-neutral-400">
                                This will permanently remove this visitor session and all conversation logs.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDelete}
                                className="bg-rose-500 hover:bg-rose-600 text-white"
                            >
                                Delete Transcript
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* Bulk Delete Confirmation Alert */}
                <AlertDialog
                    open={!!bulkDeleteType}
                    onOpenChange={(open) => !open && setBulkDeleteType(null)}
                >
                    <AlertDialogContent className="bg-[#0b0c10] border border-white/10 text-white">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-white flex items-center gap-2">
                                <Trash2 className="w-5 h-5 text-rose-400" />
                                {bulkDeleteType === "empty" ? "Clear Empty Visitor Sessions?" : "Delete All Chat Transcripts?"}
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-neutral-400">
                                {bulkDeleteType === "empty"
                                    ? "This will delete all visitor chat sessions that have 0 messages and no captured email leads, cleaning up phantom rows."
                                    : "Are you sure you want to delete ALL chat sessions? All visitor conversations, leads, and transcripts will be permanently purged."}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleBulkDelete}
                                className="bg-rose-600 hover:bg-rose-700 text-white font-mono font-bold"
                            >
                                {bulkDeleteType === "empty" ? "Clear Empty Sessions" : "Yes, Delete All"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AdminLayout>
    );
}
