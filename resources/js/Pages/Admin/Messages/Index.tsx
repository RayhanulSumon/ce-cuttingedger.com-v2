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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { MoreHorizontal, Mail, CheckCircle2, Archive, Trash2, Eye } from "lucide-react";
import { ContactMessage } from "@/types/models";

interface MessagesIndexProps {
    messages: ContactMessage[];
}

export default function MessagesIndex({ messages = [] }: MessagesIndexProps) {
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
    const [messageToDelete, setMessageToDelete] = useState<ContactMessage | null>(null);

    const updateStatus = (msg: ContactMessage, status: string) => {
        router.put(route("admin.messages.update", msg.id), { status });
    };

    const handleDelete = () => {
        if (!messageToDelete) return;
        router.delete(route("admin.messages.destroy", messageToDelete.id), {
            onSuccess: () => setMessageToDelete(null),
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "new":
                return <Badge variant="accent">NEW INQUIRY</Badge>;
            case "read":
                return <Badge variant="secondary">REVIEWED</Badge>;
            case "replied":
                return <Badge variant="success">REPLIED</Badge>;
            case "archived":
                return <Badge variant="outline">ARCHIVED</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const columns: Column<ContactMessage>[] = [
        {
            header: "PROSPECT / CONTACT",
            cell: (m) => (
                <div>
                    <div className="font-semibold text-white">{m.name}</div>
                    <div className="text-xs text-neutral-400 font-mono">
                        {m.email} {m.company ? `• ${m.company}` : ""}
                    </div>
                </div>
            ),
        },
        {
            header: "DISCIPLINE & BUDGET",
            cell: (m) => (
                <div>
                    <div className="text-xs text-white font-medium">
                        {m.service_interest || "General Consultation"}
                    </div>
                    <div className="text-[11px] font-mono text-[#d4ff00]">
                        {m.budget || "Budget Unspecified"}
                    </div>
                </div>
            ),
        },
        {
            header: "STATUS",
            cell: (m) => getStatusBadge(m.status),
        },
        {
            header: "RECEIVED",
            cell: (m) => (
                <span className="text-xs font-mono text-neutral-400">
                    {new Date(m.created_at).toLocaleDateString()}
                </span>
            ),
        },
        {
            header: "",
            className: "text-right",
            cell: (m) => (
                <div className="flex items-center justify-end gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            setSelectedMessage(m);
                            if (m.status === "new") updateStatus(m, "read");
                        }}
                        className="gap-1.5 text-xs text-neutral-300 hover:text-white"
                    >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-neutral-400 hover:text-white"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => updateStatus(m, "replied")}
                                className="gap-2 text-emerald-400"
                            >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Mark as Replied</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => updateStatus(m, "archived")}
                                className="gap-2 text-neutral-300"
                            >
                                <Archive className="w-3.5 h-3.5" />
                                <span>Archive</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setMessageToDelete(m)}
                                className="gap-2 text-rose-400 focus:text-rose-400"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Purge</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
        },
    ];

    return (
        <AdminLayout title="INBOUND INQUIRIES">
            <AdminPageHeader
                title="Inquiries Inbox"
                description="Client project requests, budget specifications, and enterprise briefs."
                badge={`${messages.filter((m) => m.status === "new").length} UNREAD`}
            />

            <AdminDataTable
                columns={columns}
                data={messages}
                searchKey="name"
                searchPlaceholder="Search inquiries by prospect name..."
            />

            {/* Inspect Message Modal */}
            <Dialog
                open={!!selectedMessage}
                onOpenChange={(open) => !open && setSelectedMessage(null)}
            >
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Project Brief Dossier</DialogTitle>
                        <DialogDescription>
                            From {selectedMessage?.name} ({selectedMessage?.email})
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 pt-2">
                        <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-white/5 border border-white/10 text-xs font-mono">
                            <div>
                                <span className="text-neutral-500 block">COMPANY</span>
                                <span className="text-white block mt-0.5">
                                    {selectedMessage?.company || "Not provided"}
                                </span>
                            </div>
                            <div>
                                <span className="text-neutral-500 block">BUDGET TIER</span>
                                <span className="text-[#d4ff00] block mt-0.5">
                                    {selectedMessage?.budget || "Not provided"}
                                </span>
                            </div>
                            <div>
                                <span className="text-neutral-500 block">
                                    SERVICE OF INTEREST
                                </span>
                                <span className="text-white block mt-0.5">
                                    {selectedMessage?.service_interest || "General"}
                                </span>
                            </div>
                            <div>
                                <span className="text-neutral-500 block">ORIGIN IP</span>
                                <span className="text-neutral-400 block mt-0.5">
                                    {selectedMessage?.ip_address || "Hidden"}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <span className="text-xs font-mono uppercase text-neutral-400">
                                Prospect Message Brief
                            </span>
                            <div className="p-4 rounded-xl bg-[#0d0f15] border border-white/10 text-sm text-neutral-200 leading-relaxed whitespace-pre-wrap">
                                {selectedMessage?.message}
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-white/10">
                            <a
                                href={`mailto:${selectedMessage?.email}?subject=Cutting Edger // Response to Inquiry`}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#d4ff00] text-black text-xs font-semibold hover:bg-[#bde600]"
                            >
                                <Mail className="w-3.5 h-3.5" />
                                <span>Reply via Work Email</span>
                            </a>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedMessage(null)}
                                >
                                    Close
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Confirm Delete */}
            <AlertDialog
                open={!!messageToDelete}
                onOpenChange={(open) => !open && setMessageToDelete(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Purge Inquiry?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you certain you wish to purge this inquiry from{" "}
                            <span className="text-white font-semibold">
                                {messageToDelete?.name}
                            </span>
                            ?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                            Purge Inquiry
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}
