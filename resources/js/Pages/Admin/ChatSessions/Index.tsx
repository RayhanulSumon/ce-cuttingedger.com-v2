import React, { useState } from "react";
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
    ip_address?: string;
    messages_count: number;
    has_consultation: boolean;
    last_active_at?: string;
    last_active_formatted: string;
    created_at: string;
}

interface TranscriptMessage {
    id: number;
    sender: "user" | "assistant" | "system";
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
    const [sessionToDelete, setSessionToDelete] = useState<ChatSessionItem | null>(null);

    const openTranscript = async (session: ChatSessionItem) => {
        setActiveSessionId(session.id);
        setIsLoadingTranscript(true);
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

    const handleDelete = () => {
        if (!sessionToDelete) return;
        router.delete(route("admin.chat-sessions.destroy", sessionToDelete.id), {
            preserveScroll: true,
            onSuccess: () => setSessionToDelete(null),
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
                        <User className="w-3.5 h-3.5 text-[#d4ff00]" />
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
                        <span className="font-bold text-[#d4ff00]">
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
            header: "Status",
            accessorKey: "status",
            cell: (row) => getStatusBadge(row.status),
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
                        className="h-8 px-2.5 bg-white/10 hover:bg-[#d4ff00] hover:text-black text-white text-xs font-mono gap-1.5 transition-all"
                        title="View Full Conversation Transcript"
                    >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Transcript</span>
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSessionToDelete(row)}
                        className="h-8 w-8 p-0 text-neutral-500 hover:text-rose-400"
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
                    description="Monitor real-time visitor inquiries, captured leads, image quote calculations, and complete conversation logs."
                />

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
                    <div className="bg-[#12141a] border border-[#d4ff00]/30 rounded-2xl p-4">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#d4ff00] block mb-1">
                            Captured Leads
                        </span>
                        <div className="text-2xl font-bold font-mono text-[#d4ff00]">
                            {stats.captured_leads}
                        </div>
                    </div>
                    <div className="bg-[#12141a] border border-emerald-500/20 rounded-2xl p-4">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 block mb-1">
                            Converted Funnels
                        </span>
                        <div className="text-2xl font-bold font-mono text-emerald-400">
                            {stats.converted}
                        </div>
                    </div>
                    <div className="bg-[#12141a] border border-white/5 rounded-2xl p-4">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                            Active in Last 24h
                        </span>
                        <div className="text-2xl font-bold font-mono text-neutral-300">
                            {stats.active_recent}
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

                {/* Full Transcript Modal */}
                <Dialog
                    open={!!activeSessionId}
                    onOpenChange={(open) => {
                        if (!open) {
                            setActiveSessionId(null);
                            setTranscript(null);
                        }
                    }}
                >
                    <DialogContent className="max-w-2xl bg-[#0b0c10] border border-white/10 text-white max-h-[85vh] flex flex-col p-0 overflow-hidden">
                        {/* Header */}
                        <div className="p-4 border-b border-white/10 bg-[#12141a] flex items-center justify-between shrink-0">
                            <div>
                                <DialogTitle className="flex items-center gap-2 text-sm">
                                    <MessageSquareText className="w-4 h-4 text-[#d4ff00]" />
                                    <span>Client Conversation Transcript</span>
                                </DialogTitle>
                                <DialogDescription className="text-xs text-neutral-400 font-mono mt-0.5">
                                    {transcript?.session?.lead_email
                                        ? `Lead: ${transcript.session.lead_email} (${transcript.session.lead_name || 'Visitor'})`
                                        : `Anonymous Visitor • IP: ${transcript?.session?.ip_address || 'Unknown'}`}
                                </DialogDescription>
                            </div>
                        </div>

                        {/* Transcript Dialogue Scroll Container */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin scrollbar-thumb-white/10 min-h-[300px]">
                            {isLoadingTranscript ? (
                                <div className="flex items-center justify-center py-20 text-neutral-400 gap-2 font-mono text-xs">
                                    <Loader2 className="w-4 h-4 animate-spin text-[#d4ff00]" />
                                    <span>Loading conversation stream...</span>
                                </div>
                            ) : transcript?.messages && transcript.messages.length > 0 ? (
                                transcript.messages.map((m) => {
                                    const isUser = m.sender === "user";
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
                                                ) : (
                                                    <>
                                                        <span className="text-[#d4ff00] font-semibold">Assistant</span>
                                                        <span>{m.created_at_formatted}</span>
                                                    </>
                                                )}
                                            </div>

                                            <div
                                                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                                                    isUser
                                                        ? "bg-[#d4ff00] text-black font-medium rounded-br-xs"
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
                                                                <span className="text-[#d4ff00] block text-[10px] uppercase font-bold">
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
            </div>
        </AdminLayout>
    );
}
