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
    DialogFooter,
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
    Sparkles,
    Download,
    Eye,
    Clock,
    User,
    Mail,
    Phone,
    MoreHorizontal,
    CheckCircle2,
    XCircle,
    Trash2,
    Layers,
    FileText,
    ExternalLink,
    AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FreeTrialItem {
    id: number;
    chat_session_id?: string;
    name: string;
    email: string;
    phone?: string;
    service: string;
    images: string[];
    images_count: number;
    instructions?: string;
    status: "pending" | "in_production" | "completed" | "rejected";
    admin_notes?: string;
    created_at: string;
    created_at_formatted: string;
}

interface PageProps {
    trials: {
        data: FreeTrialItem[];
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
        from: number;
        to: number;
    };
    stats: {
        total: number;
        pending: number;
        in_production: number;
        completed: number;
        rejected: number;
    };
    currentStatus?: string;
    searchTerm?: string;
}

export default function FreeTrialsIndex({
    trials,
    stats,
    currentStatus,
    searchTerm,
}: PageProps) {
    const [selectedTrial, setSelectedTrial] = useState<FreeTrialItem | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [trialToDelete, setTrialToDelete] = useState<FreeTrialItem | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [adminNote, setAdminNote] = useState("");
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    const handleStatusFilter = (status?: string) => {
        router.get(
            "/admin/free-trials",
            {
                ...(status ? { status } : {}),
                ...(searchTerm ? { search: searchTerm } : {}),
            },
            { preserveState: true }
        );
    };

    const handleSearch = (query: string) => {
        router.get(
            "/admin/free-trials",
            {
                ...(currentStatus ? { status: currentStatus } : {}),
                ...(query ? { search: query } : {}),
            },
            { preserveState: true }
        );
    };

    const handleUpdateStatus = (
        trialId: number,
        newStatus: "pending" | "in_production" | "completed" | "rejected",
        notes?: string
    ) => {
        setIsUpdatingStatus(true);
        router.put(
            `/admin/free-trials/${trialId}`,
            {
                status: newStatus,
                admin_notes: notes ?? selectedTrial?.admin_notes,
            },
            {
                onSuccess: () => {
                    setIsDetailOpen(false);
                    setSelectedTrial(null);
                },
                onFinish: () => setIsUpdatingStatus(false),
            }
        );
    };

    const handleDelete = (trial: FreeTrialItem) => {
        setTrialToDelete(trial);
        setIsDeleteOpen(true);
    };

    const confirmDelete = () => {
        if (!trialToDelete) return;
        router.delete(`/admin/free-trials/${trialToDelete.id}`, {
            onSuccess: () => {
                setIsDeleteOpen(false);
                setTrialToDelete(null);
            },
        });
    };

    const getStatusBadge = (status: FreeTrialItem["status"]) => {
        switch (status) {
            case "pending":
                return (
                    <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/30">
                        <Clock className="w-3 h-3 mr-1" /> Pending Review
                    </Badge>
                );
            case "in_production":
                return (
                    <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/30">
                        <Layers className="w-3 h-3 mr-1" /> In Production
                    </Badge>
                );
            case "completed":
                return (
                    <Badge className="bg-[#d4ff00]/10 text-[#d4ff00] border border-[#d4ff00]/30">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Delivered / Done
                    </Badge>
                );
            case "rejected":
                return (
                    <Badge className="bg-red-500/10 text-red-400 border border-red-500/30">
                        <XCircle className="w-3 h-3 mr-1" /> Rejected
                    </Badge>
                );
            default:
                return <Badge>{status}</Badge>;
        }
    };

    const columns: Column<FreeTrialItem>[] = [
        {
            key: "id",
            label: "Order / Date",
            render: (trial) => (
                <div>
                    <div className="font-mono text-xs font-bold text-white flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#d4ff00]" />
                        <span>TRIAL #{trial.id}</span>
                    </div>
                    <span className="text-[11px] text-white/50 font-mono">
                        {trial.created_at_formatted}
                    </span>
                </div>
            ),
        },
        {
            key: "name",
            label: "Client / Email",
            render: (trial) => (
                <div className="space-y-0.5">
                    <p className="font-semibold text-white text-xs">{trial.name || "Guest Client"}</p>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#00f5ff] font-mono">
                        <Mail className="w-3 h-3 shrink-0" />
                        <span>{trial.email}</span>
                    </div>
                    {trial.phone && (
                        <div className="flex items-center gap-1.5 text-[10px] text-white/50 font-mono">
                            <Phone className="w-2.5 h-2.5 shrink-0" />
                            <span>{trial.phone}</span>
                        </div>
                    )}
                </div>
            ),
        },
        {
            key: "images",
            label: "Sample Images",
            render: (trial) => (
                <div className="flex items-center gap-2">
                    <div className="flex items-center -space-x-2 overflow-hidden">
                        {trial.images.map((img, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => setPreviewImage(img)}
                                className="w-9 h-9 rounded-lg border-2 border-[#12141a] overflow-hidden bg-black/60 hover:scale-110 transition-transform cursor-pointer relative"
                                title="Click to view full preview"
                            >
                                <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                    <span className="text-[11px] font-mono text-white/70">
                        {trial.images_count} {trial.images_count === 1 ? "img" : "imgs"}
                    </span>
                    {trial.images.length > 0 && (
                        <a
                            href={trial.images[0]}
                            download={`trial-${trial.id}-sample-1`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                            title="Download Sample Image"
                        >
                            <Download className="w-3.5 h-3.5" />
                        </a>
                    )}
                </div>
            ),
        },
        {
            key: "service",
            label: "Service",
            render: (trial) => (
                <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-wider border-white/15 text-white/80">
                    {trial.service.replace(/-/g, " ")}
                </Badge>
            ),
        },
        {
            key: "status",
            label: "Status",
            render: (trial) => getStatusBadge(trial.status),
        },
        {
            key: "actions",
            label: "Actions",
            render: (trial) => (
                <div className="flex items-center justify-end gap-1">
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                            setSelectedTrial(trial);
                            setAdminNote(trial.admin_notes || "");
                            setIsDetailOpen(true);
                        }}
                        className="h-8 px-2 text-xs text-white/70 hover:text-white hover:bg-white/10"
                    >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        <span>Manage</span>
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-white/50 hover:text-white hover:bg-white/10"
                            >
                                <MoreHorizontal className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#12141a] border-white/10 text-white">
                            <DropdownMenuItem
                                onClick={() => handleUpdateStatus(trial.id, "in_production")}
                                className="text-xs hover:bg-white/10 cursor-pointer"
                            >
                                <Layers className="w-3.5 h-3.5 mr-2 text-blue-400" />
                                <span>Move to Production</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleUpdateStatus(trial.id, "completed")}
                                className="text-xs hover:bg-white/10 cursor-pointer"
                            >
                                <CheckCircle2 className="w-3.5 h-3.5 mr-2 text-[#d4ff00]" />
                                <span>Mark as Completed</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleUpdateStatus(trial.id, "rejected")}
                                className="text-xs hover:bg-white/10 cursor-pointer text-amber-400"
                            >
                                <XCircle className="w-3.5 h-3.5 mr-2 text-amber-400" />
                                <span>Mark as Rejected</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleDelete(trial)}
                                className="text-xs hover:bg-red-500/20 text-red-400 cursor-pointer"
                            >
                                <Trash2 className="w-3.5 h-3.5 mr-2" />
                                <span>Delete Record</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
        },
    ];

    return (
        <AdminLayout title="Free Trial Sample Orders">
            <div className="space-y-6">
                <AdminPageHeader
                    title="Free Trial Orders"
                    description="Review incoming 3-image trial retouching requests, download master files, and process delivery."
                />

                {/* KPI Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <button
                        type="button"
                        onClick={() => handleStatusFilter()}
                        className={cn(
                            "p-3 rounded-xl border text-left transition-all cursor-pointer",
                            !currentStatus
                                ? "bg-white/10 border-white/30 shadow-md"
                                : "bg-[#12141a] border-white/10 hover:border-white/20"
                        )}
                    >
                        <span className="text-[10px] font-mono uppercase text-white/50 block">All Orders</span>
                        <span className="text-xl font-bold font-mono text-white">{stats.total}</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => handleStatusFilter("pending")}
                        className={cn(
                            "p-3 rounded-xl border text-left transition-all cursor-pointer",
                            currentStatus === "pending"
                                ? "bg-amber-500/15 border-amber-500/40 shadow-md"
                                : "bg-[#12141a] border-white/10 hover:border-white/20"
                        )}
                    >
                        <span className="text-[10px] font-mono uppercase text-amber-400/70 block">Pending Review</span>
                        <span className="text-xl font-bold font-mono text-amber-400">{stats.pending}</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => handleStatusFilter("in_production")}
                        className={cn(
                            "p-3 rounded-xl border text-left transition-all cursor-pointer",
                            currentStatus === "in_production"
                                ? "bg-blue-500/15 border-blue-500/40 shadow-md"
                                : "bg-[#12141a] border-white/10 hover:border-white/20"
                        )}
                    >
                        <span className="text-[10px] font-mono uppercase text-blue-400/70 block">In Production</span>
                        <span className="text-xl font-bold font-mono text-blue-400">{stats.in_production}</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => handleStatusFilter("completed")}
                        className={cn(
                            "p-3 rounded-xl border text-left transition-all cursor-pointer",
                            currentStatus === "completed"
                                ? "bg-[#d4ff00]/15 border-[#d4ff00]/40 shadow-md"
                                : "bg-[#12141a] border-white/10 hover:border-white/20"
                        )}
                    >
                        <span className="text-[10px] font-mono uppercase text-[#d4ff00]/70 block">Completed</span>
                        <span className="text-xl font-bold font-mono text-[#d4ff00]">{stats.completed}</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => handleStatusFilter("rejected")}
                        className={cn(
                            "p-3 rounded-xl border text-left transition-all cursor-pointer",
                            currentStatus === "rejected"
                                ? "bg-red-500/15 border-red-500/40 shadow-md"
                                : "bg-[#12141a] border-white/10 hover:border-white/20"
                        )}
                    >
                        <span className="text-[10px] font-mono uppercase text-red-400/70 block">Rejected</span>
                        <span className="text-xl font-bold font-mono text-red-400">{stats.rejected}</span>
                    </button>
                </div>

                {/* Data Table */}
                <AdminDataTable
                    columns={columns}
                    data={trials.data}
                    pagination={trials}
                    onSearch={handleSearch}
                    searchPlaceholder="Search by client, email, or service..."
                />
            </div>

            {/* Trial Detail & Process Modal */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="max-w-2xl bg-[#0f1117] border-white/15 text-white max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-base font-bold">
                            <Sparkles className="w-4 h-4 text-[#d4ff00]" />
                            <span>Process Free Trial Order #{selectedTrial?.id}</span>
                        </DialogTitle>
                        <DialogDescription className="text-xs text-white/60 font-mono">
                            Submitted on {selectedTrial?.created_at_formatted} • 100% Free Sample Trial
                        </DialogDescription>
                    </DialogHeader>

                    {selectedTrial && (
                        <div className="space-y-4 py-2 text-xs">
                            {/* Client Info Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 bg-white/5 p-3 rounded-xl border border-white/10 font-mono">
                                <div>
                                    <span className="text-[10px] text-white/40 uppercase block">Client Name</span>
                                    <span className="font-semibold text-white">{selectedTrial.name}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-white/40 uppercase block">Delivery Email</span>
                                    <span className="font-semibold text-[#00f5ff]">{selectedTrial.email}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-white/40 uppercase block">Phone / WhatsApp</span>
                                    <span className="text-white/80">{selectedTrial.phone || "Not provided"}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-white/40 uppercase block">Service Type</span>
                                    <span className="text-white font-semibold uppercase">{selectedTrial.service}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-white/40 uppercase block">Images Count</span>
                                    <span className="text-[#d4ff00] font-bold">{selectedTrial.images_count} submitted</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-white/40 uppercase block">Current Status</span>
                                    <div className="mt-0.5">{getStatusBadge(selectedTrial.status)}</div>
                                </div>
                            </div>

                            {/* Submitted Images Gallery */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-mono text-white/70 uppercase tracking-wider font-bold">
                                        Client Submitted Images ({selectedTrial.images.length})
                                    </span>
                                    <span className="text-[10px] font-mono text-white/40">Click any image to enlarge</span>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {selectedTrial.images.map((imgUrl, i) => (
                                        <div
                                            key={i}
                                            className="group relative rounded-xl border border-white/15 bg-black/50 overflow-hidden"
                                        >
                                            <div className="aspect-square w-full">
                                                <img
                                                    src={imgUrl}
                                                    alt={`Upload ${i + 1}`}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                />
                                            </div>
                                            <div className="p-2 bg-[#12141a] flex items-center justify-between border-t border-white/10 text-[11px] font-mono">
                                                <span>Image #{i + 1}</span>
                                                <div className="flex items-center gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => setPreviewImage(imgUrl)}
                                                        className="p-1 rounded hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                                                        title="Zoom Preview"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                    </button>
                                                    <a
                                                        href={imgUrl}
                                                        download={`trial-${selectedTrial.id}-img-${i + 1}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="p-1 rounded hover:bg-white/10 text-[#d4ff00] transition-colors cursor-pointer"
                                                        title="Download File"
                                                    >
                                                        <Download className="w-3.5 h-3.5" />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Internal Notes / Status Action */}
                            <div className="space-y-2 pt-2 border-t border-white/10">
                                <label className="text-[11px] font-mono uppercase text-white/70 block">
                                    Internal Admin Notes & Delivery Log
                                </label>
                                <textarea
                                    value={adminNote}
                                    onChange={(e) => setAdminNote(e.target.value)}
                                    placeholder="Add notes e.g., 'Retouching finished by Team Alpha. Master PSD sent to client inbox.'"
                                    rows={3}
                                    className="w-full p-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#d4ff00] font-mono"
                                />
                            </div>

                            {/* Status Quick Buttons */}
                            <div className="space-y-1.5 pt-2 border-t border-white/10">
                                <span className="text-[10px] font-mono uppercase text-white/50 block">Update Order Status</span>
                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleUpdateStatus(selectedTrial.id, "in_production", adminNote)}
                                        disabled={isUpdatingStatus}
                                        className="h-8 text-xs border-blue-500/40 text-blue-400 hover:bg-blue-500/20 cursor-pointer"
                                    >
                                        <Layers className="w-3.5 h-3.5 mr-1" />
                                        <span>Mark In Production</span>
                                    </Button>
                                    <Button
                                        type="button"
                                        size="sm"
                                        onClick={() => handleUpdateStatus(selectedTrial.id, "completed", adminNote)}
                                        disabled={isUpdatingStatus}
                                        className="h-8 text-xs bg-[#d4ff00] hover:bg-[#c2eb00] text-black font-semibold cursor-pointer"
                                    >
                                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                                        <span>Complete & Sent</span>
                                    </Button>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleUpdateStatus(selectedTrial.id, "rejected", adminNote)}
                                        disabled={isUpdatingStatus}
                                        className="h-8 text-xs border-red-500/40 text-red-400 hover:bg-red-500/20 cursor-pointer"
                                    >
                                        <XCircle className="w-3.5 h-3.5 mr-1" />
                                        <span>Reject Request</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Image Preview Lightbox */}
            {previewImage && (
                <div
                    onClick={() => setPreviewImage(null)}
                    className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
                >
                    <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-white/20">
                        <img src={previewImage} alt="Full Preview" className="max-w-full max-h-[85vh] object-contain" />
                        <div className="p-3 bg-[#12141a] flex items-center justify-between">
                            <span className="text-xs font-mono text-white/70">Client Submission Full View</span>
                            <a
                                href={previewImage}
                                download
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="py-1 px-3 rounded-lg bg-[#d4ff00] text-black font-mono text-xs font-semibold flex items-center gap-1.5"
                            >
                                <Download className="w-3.5 h-3.5" />
                                <span>Download Full Resolution</span>
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Alert */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent className="bg-[#12141a] border-white/10 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Free Trial Request?</AlertDialogTitle>
                        <AlertDialogDescription className="text-white/60">
                            Are you sure you want to delete Trial Order #{trialToDelete?.id} for{" "}
                            {trialToDelete?.email}? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-white/5 border-white/10 hover:bg-white/10 text-white">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-red-500 hover:bg-red-600 text-white"
                        >
                            Delete Order
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}
