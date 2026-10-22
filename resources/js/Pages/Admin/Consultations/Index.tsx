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
import {
    CalendarCheck2,
    Calendar,
    Clock,
    User,
    Mail,
    Phone,
    MoreHorizontal,
    CheckCircle2,
    XCircle,
    Trash2,
    FileText,
} from "lucide-react";

interface ConsultationItem {
    id: number;
    chat_session_id?: string;
    name: string;
    email: string;
    phone?: string;
    service_name: string;
    scheduled_at: string;
    scheduled_at_formatted: string;
    is_upcoming: boolean;
    timezone: string;
    status: "confirmed" | "completed" | "cancelled";
    notes?: string;
    created_at: string;
}

interface ConsultationsIndexProps {
    consultations: ConsultationItem[];
    stats: {
        total: number;
        upcoming: number;
        completed: number;
        cancelled: number;
    };
    currentStatus?: string;
}

export default function ConsultationsIndex({
    consultations = [],
    stats,
    currentStatus,
}: ConsultationsIndexProps) {
    const [selectedConsultation, setSelectedConsultation] =
        useState<ConsultationItem | null>(null);
    const [consultationToDelete, setConsultationToDelete] =
        useState<ConsultationItem | null>(null);

    const updateStatus = (item: ConsultationItem, newStatus: string) => {
        router.put(
            route("admin.consultations.update", item.id),
            { status: newStatus },
            { preserveScroll: true }
        );
    };

    const handleDelete = () => {
        if (!consultationToDelete) return;
        router.delete(route("admin.consultations.destroy", consultationToDelete.id), {
            preserveScroll: true,
            onSuccess: () => setConsultationToDelete(null),
        });
    };

    const getStatusBadge = (status: string, isUpcoming: boolean) => {
        switch (status) {
            case "confirmed":
                return isUpcoming ? (
                    <Badge variant="accent" className="font-mono">
                        UPCOMING
                    </Badge>
                ) : (
                    <Badge variant="secondary" className="font-mono">
                        CONFIRMED
                    </Badge>
                );
            case "completed":
                return (
                    <Badge variant="success" className="font-mono">
                        COMPLETED
                    </Badge>
                );
            case "cancelled":
                return (
                    <Badge variant="destructive" className="font-mono">
                        CANCELLED
                    </Badge>
                );
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const columns: Column<ConsultationItem>[] = [
        {
            header: "Invitee / Client",
            accessorKey: "name",
            cell: (row) => (
                <div className="space-y-0.5">
                    <div className="font-semibold text-white flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#d4ff00]" />
                        <span>{row.name}</span>
                    </div>
                    <div className="text-xs text-neutral-400 flex items-center gap-1.5 font-mono">
                        <Mail className="w-3 h-3 text-neutral-500" />
                        <span>{row.email}</span>
                    </div>
                </div>
            ),
        },
        {
            header: "Phone / WhatsApp",
            accessorKey: "phone",
            cell: (row) => (
                <div className="text-xs font-mono text-neutral-300 flex items-center gap-1.5">
                    {row.phone ? (
                        <>
                            <Phone className="w-3.5 h-3.5 text-[#00f5ff]" />
                            <span>{row.phone}</span>
                        </>
                    ) : (
                        <span className="text-neutral-600">—</span>
                    )}
                </div>
            ),
        },
        {
            header: "Service Topic",
            accessorKey: "service_name",
            cell: (row) => (
                <div className="text-xs text-neutral-200 font-medium">
                    {row.service_name}
                </div>
            ),
        },
        {
            header: "Scheduled Time",
            accessorKey: "scheduled_at",
            cell: (row) => (
                <div className="space-y-0.5 font-mono text-xs">
                    <div className="text-white font-semibold flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#d4ff00]" />
                        <span>{row.scheduled_at_formatted}</span>
                    </div>
                    <div className="text-[10px] text-neutral-500">
                        Timezone: {row.timezone}
                    </div>
                </div>
            ),
        },
        {
            header: "Status",
            accessorKey: "status",
            cell: (row) => getStatusBadge(row.status, row.is_upcoming),
        },
        {
            header: "Actions",
            id: "actions",
            cell: (row) => (
                <div className="flex items-center justify-end gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedConsultation(row)}
                        className="h-8 px-2 text-neutral-400 hover:text-white"
                        title="View details & notes"
                    >
                        <FileText className="w-4 h-4" />
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-neutral-400 hover:text-white"
                            >
                                <MoreHorizontal className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                                onClick={() => updateStatus(row, "completed")}
                                className="cursor-pointer gap-2"
                            >
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                <span>Mark as Completed</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => updateStatus(row, "confirmed")}
                                className="cursor-pointer gap-2"
                            >
                                <CalendarCheck2 className="w-4 h-4 text-[#d4ff00]" />
                                <span>Mark as Confirmed</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => updateStatus(row, "cancelled")}
                                className="cursor-pointer gap-2 text-amber-400"
                            >
                                <XCircle className="w-4 h-4 text-amber-400" />
                                <span>Mark as Cancelled</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setConsultationToDelete(row)}
                                className="cursor-pointer gap-2 text-rose-400 focus:text-rose-400"
                            >
                                <Trash2 className="w-4 h-4 text-rose-400" />
                                <span>Delete Record</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
        },
    ];

    return (
        <AdminLayout>
            <div className="space-y-6">
                <AdminPageHeader
                    title="Client Consultations & Bookings"
                    description="Review and manage 15-minute technical intake calls scheduled via the smart chat assistant."
                />

                {/* KPI Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-[#12141a] border border-white/5 rounded-2xl p-4">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                            Total Bookings
                        </span>
                        <div className="text-2xl font-bold font-mono text-white">
                            {stats.total}
                        </div>
                    </div>
                    <div className="bg-[#12141a] border border-[#d4ff00]/30 rounded-2xl p-4">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#d4ff00] block mb-1">
                            Upcoming Calls
                        </span>
                        <div className="text-2xl font-bold font-mono text-[#d4ff00]">
                            {stats.upcoming}
                        </div>
                    </div>
                    <div className="bg-[#12141a] border border-emerald-500/20 rounded-2xl p-4">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 block mb-1">
                            Completed
                        </span>
                        <div className="text-2xl font-bold font-mono text-emerald-400">
                            {stats.completed}
                        </div>
                    </div>
                    <div className="bg-[#12141a] border border-white/5 rounded-2xl p-4">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                            Cancelled
                        </span>
                        <div className="text-2xl font-bold font-mono text-neutral-400">
                            {stats.cancelled}
                        </div>
                    </div>
                </div>

                {/* Main Table */}
                <AdminDataTable
                    data={consultations}
                    columns={columns}
                    searchPlaceholder="Search client name, email, or service..."
                    searchKey="name"
                />

                {/* Consultation Details & Notes Dialog */}
                <Dialog
                    open={!!selectedConsultation}
                    onOpenChange={(open) => !open && setSelectedConsultation(null)}
                >
                    <DialogContent className="max-w-lg bg-[#0b0c10] border border-white/10 text-white">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <CalendarCheck2 className="w-5 h-5 text-[#d4ff00]" />
                                <span>Consultation Booking Details</span>
                            </DialogTitle>
                            <DialogDescription className="text-neutral-400">
                                15-minute technical review call scheduled through live chat.
                            </DialogDescription>
                        </DialogHeader>

                        {selectedConsultation && (
                            <div className="space-y-4 pt-2 font-mono text-xs">
                                <div className="grid grid-cols-2 gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                                    <div>
                                        <span className="text-neutral-500 block text-[10px]">CLIENT</span>
                                        <span className="text-white font-semibold">{selectedConsultation.name}</span>
                                    </div>
                                    <div>
                                        <span className="text-neutral-500 block text-[10px]">EMAIL</span>
                                        <span className="text-white">{selectedConsultation.email}</span>
                                    </div>
                                    <div>
                                        <span className="text-neutral-500 block text-[10px]">PHONE / WA</span>
                                        <span className="text-white">{selectedConsultation.phone || 'N/A'}</span>
                                    </div>
                                    <div>
                                        <span className="text-neutral-500 block text-[10px]">STATUS</span>
                                        <span className="uppercase text-[#d4ff00] font-bold">{selectedConsultation.status}</span>
                                    </div>
                                </div>

                                <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
                                    <span className="text-neutral-500 block text-[10px]">SCHEDULED DATE & TIME</span>
                                    <div className="text-sm font-bold text-white flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-[#00f5ff]" />
                                        <span>{selectedConsultation.scheduled_at_formatted} ({selectedConsultation.timezone})</span>
                                    </div>
                                    <span className="text-neutral-400 text-[11px] block mt-1">
                                        Service: {selectedConsultation.service_name}
                                    </span>
                                </div>

                                {selectedConsultation.notes && (
                                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                        <span className="text-neutral-500 block text-[10px] mb-1">INTAKE NOTES / SCOPE</span>
                                        <p className="text-white/80 whitespace-pre-wrap">{selectedConsultation.notes}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Alert */}
                <AlertDialog
                    open={!!consultationToDelete}
                    onOpenChange={(open) => !open && setConsultationToDelete(null)}
                >
                    <AlertDialogContent className="bg-[#0b0c10] border border-white/10 text-white">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-white">Delete Booking Record?</AlertDialogTitle>
                            <AlertDialogDescription className="text-neutral-400">
                                This will remove the consultation booking record for{" "}
                                <strong className="text-white">{consultationToDelete?.name}</strong>. This action cannot be undone.
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
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AdminLayout>
    );
}
