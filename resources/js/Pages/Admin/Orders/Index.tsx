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
    ShoppingBag,
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
    AlertTriangle,
    DollarSign,
    CreditCard,
    FileArchive,
    Folder,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderItem {
    id: number;
    order_number: string;
    chat_session_id?: string;
    client_name: string;
    client_email: string;
    client_phone?: string;
    service_name: string;
    service_slug: string;
    complexity: string;
    quantity: number;
    uploaded_count: number;
    unit_price: number;
    discount_percent: number;
    total_price: number;
    currency: string;
    turnaround: string;
    images: string[];
    completed_files: string[];
    cloud_link?: string | null;
    instructions?: string;
    admin_notes?: string;
    status: "pending" | "in_production" | "review" | "completed" | "cancelled";
    payment_status: "unpaid" | "paid" | "invoice_sent";
    source: string;
    created_at: string;
    created_at_formatted: string;
}

interface PageProps {
    orders: {
        data: OrderItem[];
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
        total_revenue: number;
    };
    currentStatus?: string;
    currentPaymentStatus?: string;
    searchTerm?: string;
}

export default function OrdersIndex({
    orders,
    stats,
    currentStatus,
    currentPaymentStatus,
    searchTerm,
}: PageProps) {
    const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState<OrderItem | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [adminNote, setAdminNote] = useState("");
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    const handleStatusFilter = (status?: string) => {
        router.get(
            "/admin/orders",
            {
                ...(status ? { status } : {}),
                ...(currentPaymentStatus ? { payment_status: currentPaymentStatus } : {}),
                ...(searchTerm ? { search: searchTerm } : {}),
            },
            { preserveState: true }
        );
    };

    const handleSearch = (query: string) => {
        router.get(
            "/admin/orders",
            {
                ...(currentStatus ? { status: currentStatus } : {}),
                ...(currentPaymentStatus ? { payment_status: currentPaymentStatus } : {}),
                ...(query ? { search: query } : {}),
            },
            { preserveState: true }
        );
    };

    const handleUpdateStatus = (
        orderId: number,
        newStatus: OrderItem["status"],
        newPayment?: OrderItem["payment_status"],
        notes?: string
    ) => {
        setIsUpdatingStatus(true);
        router.put(
            `/admin/orders/${orderId}`,
            {
                status: newStatus,
                payment_status: newPayment ?? selectedOrder?.payment_status,
                admin_notes: notes ?? adminNote ?? selectedOrder?.admin_notes,
            },
            {
                onSuccess: () => {
                    setIsDetailOpen(false);
                    setSelectedOrder(null);
                },
                onFinish: () => setIsUpdatingStatus(false),
            }
        );
    };

    const handleDelete = (order: OrderItem) => {
        setOrderToDelete(order);
        setIsDeleteOpen(true);
    };

    const confirmDelete = () => {
        if (!orderToDelete) return;
        router.delete(`/admin/orders/${orderToDelete.id}`, {
            onSuccess: () => {
                setIsDeleteOpen(false);
                setOrderToDelete(null);
            },
        });
    };

    const getStatusBadge = (status: OrderItem["status"]) => {
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
            case "review":
                return (
                    <Badge className="bg-purple-500/10 text-purple-400 border border-purple-500/30">
                        <Eye className="w-3 h-3 mr-1" /> Quality Review
                    </Badge>
                );
            case "completed":
                return (
                    <Badge className="bg-accent/10 text-accent border border-accent/30">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Completed
                    </Badge>
                );
            case "cancelled":
                return (
                    <Badge className="bg-red-500/10 text-red-400 border border-red-500/30">
                        <XCircle className="w-3 h-3 mr-1" /> Cancelled
                    </Badge>
                );
        }
    };

    const getPaymentBadge = (status: OrderItem["payment_status"]) => {
        switch (status) {
            case "paid":
                return (
                    <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        Paid
                    </Badge>
                );
            case "invoice_sent":
                return (
                    <Badge className="bg-sky-500/10 text-sky-400 border border-sky-500/30">
                        Invoiced
                    </Badge>
                );
            default:
                return (
                    <Badge className="bg-white/10 text-white/60 border border-white/20">
                        Unpaid
                    </Badge>
                );
        }
    };

    // Columns configuration for DataTable
    const columns: Column<OrderItem>[] = [
        {
            header: "Order / Date",
            accessorKey: "order_number",
            cell: (row) => (
                <div className="flex flex-col gap-0.5 font-mono">
                    <span className="font-bold text-white tracking-wider flex items-center gap-1.5">
                        <ShoppingBag className="w-3.5 h-3.5 text-accent" />
                        {row.order_number}
                    </span>
                    <span className="text-[10px] text-white/50">{row.created_at_formatted}</span>
                </div>
            ),
        },
        {
            header: "Client",
            accessorKey: "client_name",
            cell: (row) => (
                <div className="flex flex-col gap-0.5">
                    <span className="font-medium text-white">{row.client_name}</span>
                    <span className="text-[11px] text-[#00f5ff] font-mono">{row.client_email}</span>
                </div>
            ),
        },
        {
            header: "Service & Complexity",
            accessorKey: "service_name",
            cell: (row) => (
                <div className="flex flex-col gap-0.5 font-mono text-xs">
                    <span className="font-semibold text-white truncate max-w-[180px]">{row.service_name}</span>
                    <span className="text-[10px] text-white/60 capitalize">
                        {row.complexity} complexity • {row.turnaround}
                    </span>
                </div>
            ),
        },
        {
            header: "Files Validation",
            accessorKey: "uploaded_count",
            cell: (row) => {
                const isUnder = row.uploaded_count < row.quantity;
                const isOver = row.uploaded_count > row.quantity;
                return (
                    <div className="flex flex-col gap-1 font-mono text-xs">
                        <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white">{row.uploaded_count}</span>
                            <span className="text-white/40">/</span>
                            <span className="text-white/70">{row.quantity} quoted</span>
                        </div>
                        {row.cloud_link ? (
                            <a
                                href={row.cloud_link}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[10px] text-purple-300 bg-purple-500/15 hover:bg-purple-500/25 px-1.5 py-0.5 rounded border border-purple-500/30 w-fit transition-colors"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Folder className="w-2.5 h-2.5 shrink-0" /> Drive Link ↗
                            </a>
                        ) : isUnder ? (
                            <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 w-fit">
                                <AlertTriangle className="w-2.5 h-2.5 shrink-0" />
                                {row.quantity - row.uploaded_count} pending
                            </span>
                        ) : isOver ? (
                            <span className="inline-flex items-center gap-1 text-[10px] text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded border border-sky-500/20 w-fit">
                                +{row.uploaded_count - row.quantity} extra
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] text-accent bg-accent/10 px-1.5 py-0.5 rounded border border-accent/20 w-fit">
                                <CheckCircle2 className="w-2.5 h-2.5 shrink-0" /> Complete
                            </span>
                        )}
                    </div>
                );
            },
        },
        {
            header: "Total / Payment",
            accessorKey: "total_price",
            cell: (row) => (
                <div className="flex flex-col gap-1 font-mono text-xs">
                    <span className="font-bold text-accent">${row.total_price.toFixed(2)}</span>
                    <div>{getPaymentBadge(row.payment_status)}</div>
                </div>
            ),
        },
        {
            header: "Status",
            accessorKey: "status",
            cell: (row) => getStatusBadge(row.status),
        },
        {
            header: "Actions",
            cell: (row) => (
                <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                            setSelectedOrder(row);
                            setAdminNote(row.admin_notes || "");
                            setIsDetailOpen(true);
                        }}
                        className="h-8 px-2.5 bg-white/5 border-white/10 hover:bg-white/10 text-white font-mono text-xs"
                    >
                        <Eye className="w-3.5 h-3.5 mr-1 text-[#00f5ff]" /> Review
                    </Button>

                    <a
                        href={`/admin/orders/${row.id}/download-zip`}
                        title="Download All Files (ZIP)"
                        className="inline-flex items-center justify-center h-8 px-2.5 rounded-lg bg-accent/10 border border-accent/30 hover:bg-accent/20 text-accent text-xs font-mono transition-colors"
                    >
                        <Download className="w-3.5 h-3.5 mr-1" /> ZIP
                    </a>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-white/60 hover:text-white"
                            >
                                <MoreHorizontal className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#12141a] border-white/10 text-white font-mono text-xs">
                            <DropdownMenuItem
                                onClick={() => handleUpdateStatus(row.id, "in_production")}
                                className="hover:bg-white/10 cursor-pointer"
                            >
                                <Layers className="w-3.5 h-3.5 mr-2 text-blue-400" /> Start Production
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleUpdateStatus(row.id, "completed")}
                                className="hover:bg-white/10 cursor-pointer"
                            >
                                <CheckCircle2 className="w-3.5 h-3.5 mr-2 text-accent" /> Mark Completed
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleDelete(row)}
                                className="hover:bg-rose-500/10 text-rose-400 cursor-pointer"
                            >
                                <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete Order
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
        },
    ];

    return (
        <AdminLayout title="Client Orders">
            <div className="space-y-6">
                <AdminPageHeader
                    title="Client Production Orders"
                    description="Manage commercial batch retouching orders, inspect client file uploads, validate quantities, and download production assets."
                />

                {/* Metric Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <button
                        type="button"
                        onClick={() => handleStatusFilter(undefined)}
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
                                ? "bg-accent/15 border-accent/40 shadow-md"
                                : "bg-[#12141a] border-white/10 hover:border-white/20"
                        )}
                    >
                        <span className="text-[10px] font-mono uppercase text-accent/70 block">Completed</span>
                        <span className="text-xl font-bold font-mono text-accent">{stats.completed}</span>
                    </button>

                    <div className="p-3 rounded-xl border border-white/10 bg-[#12141a] text-left">
                        <span className="text-[10px] font-mono uppercase text-emerald-400/70 block">Paid Revenue</span>
                        <span className="text-xl font-bold font-mono text-emerald-400">
                            ${stats.total_revenue.toFixed(2)}
                        </span>
                    </div>
                </div>

                {/* Orders Data Table */}
                <AdminDataTable
                    columns={columns}
                    data={orders.data}
                    pagination={orders}
                    onSearch={handleSearch}
                    searchPlaceholder="Search by order #, client, email, or service..."
                />
            </div>

            {/* Order Detail & Process Modal */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="max-w-2xl bg-[#0f1117] border-white/15 text-white max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-base font-bold">
                            <ShoppingBag className="w-4 h-4 text-accent" />
                            <span>Order #{selectedOrder?.order_number}</span>
                        </DialogTitle>
                        <DialogDescription className="text-xs text-white/60 font-mono">
                            Created on {selectedOrder?.created_at_formatted} • Source: {selectedOrder?.source?.toUpperCase()}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedOrder && (
                        <div className="space-y-4 py-2 text-xs">
                            {/* Client & Production Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 bg-white/5 p-3 rounded-xl border border-white/10 font-mono">
                                <div>
                                    <span className="text-[10px] text-white/40 uppercase block">Client Name</span>
                                    <span className="font-semibold text-white">{selectedOrder.client_name}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-white/40 uppercase block">Delivery Email</span>
                                    <span className="font-semibold text-[#00f5ff]">{selectedOrder.client_email}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-white/40 uppercase block">Phone / WhatsApp</span>
                                    <span className="text-white/80">{selectedOrder.client_phone || "Not provided"}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-white/40 uppercase block">Service Type</span>
                                    <span className="text-white font-semibold uppercase">{selectedOrder.service_name}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-white/40 uppercase block">Complexity</span>
                                    <span className="text-accent font-bold capitalize">{selectedOrder.complexity}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-white/40 uppercase block">Turnaround SLA</span>
                                    <span className="text-white">{selectedOrder.turnaround}</span>
                                </div>
                            </div>

                            {/* Quantity Validation Banner */}
                            <div className={cn(
                                "p-3 rounded-xl border flex items-center justify-between gap-3 font-mono",
                                selectedOrder.uploaded_count < selectedOrder.quantity
                                    ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                                    : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                            )}>
                                <div className="flex items-center gap-2">
                                    {selectedOrder.uploaded_count < selectedOrder.quantity ? (
                                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                                    ) : (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                    )}
                                    <div>
                                        <span className="font-bold text-white block">
                                            {selectedOrder.uploaded_count} of {selectedOrder.quantity} files uploaded
                                        </span>
                                        <span className="text-[11px] opacity-80">
                                            {selectedOrder.uploaded_count < selectedOrder.quantity
                                                ? `Client quoted for ${selectedOrder.quantity} images, but has only uploaded ${selectedOrder.uploaded_count} files (${selectedOrder.quantity - selectedOrder.uploaded_count} pending).`
                                                : `All ${selectedOrder.quantity} files received for this production batch.`}
                                        </span>
                                    </div>
                                </div>

                                <a
                                    href={`/admin/orders/${selectedOrder.id}/download-zip`}
                                    className="px-3 py-1.5 rounded-lg bg-accent text-black font-bold text-xs flex items-center gap-1.5 shrink-0 hover:bg-[#b8dd00] transition-colors"
                                >
                                    <Download className="w-3.5 h-3.5" />
                                    <span>Download All (ZIP)</span>
                                </a>
                            </div>

                            {/* Financial Summary */}
                            <div className="p-3 rounded-xl bg-black/40 border border-white/10 font-mono flex items-center justify-between text-xs">
                                <div>
                                    <span className="text-white/50 block text-[10px]">Pricing Breakdown</span>
                                    <span className="text-white">
                                        ${selectedOrder.unit_price.toFixed(2)}/image × {selectedOrder.quantity} images
                                        {selectedOrder.discount_percent > 0 && ` (${selectedOrder.discount_percent}% Volume Discount)`}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="text-white/50 block text-[10px]">Total Order Amount</span>
                                    <span className="text-base font-bold text-accent">${selectedOrder.total_price.toFixed(2)} USD</span>
                                </div>
                            </div>

                            {/* Cloud Drive / Google Drive Folder */}
                            {selectedOrder.cloud_link && (
                                <div className="p-3.5 bg-purple-500/10 rounded-xl border border-purple-500/30 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-purple-200 flex items-center gap-1.5 font-mono">
                                            <Folder className="w-4 h-4 text-purple-400" />
                                            Google Drive / Cloud Folder
                                        </span>
                                        <a
                                            href={selectedOrder.cloud_link}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="px-2.5 py-1 rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-mono text-xs font-semibold flex items-center gap-1 transition-colors"
                                        >
                                            <span>Open Cloud Link</span>
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </div>
                                    <p className="text-[11px] font-mono text-purple-200/90 break-all select-all bg-black/40 p-2 rounded-lg border border-purple-500/20">
                                        {selectedOrder.cloud_link}
                                    </p>
                                </div>
                            )}

                            {/* Client Instructions */}
                            {selectedOrder.instructions && (
                                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                                    <span className="text-[10px] text-white/40 uppercase font-mono block mb-1">
                                        Client Instructions
                                    </span>
                                    <p className="text-white/90 leading-relaxed font-sans">{selectedOrder.instructions}</p>
                                </div>
                            )}

                            {/* Uploaded Images Gallery */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-mono text-white/70 uppercase tracking-wider font-bold">
                                        Client Uploaded Files ({selectedOrder.images.length})
                                    </span>
                                    <a
                                        href={`/admin/orders/${selectedOrder.id}/download-zip`}
                                        className="text-[10px] font-mono text-accent hover:underline flex items-center gap-1"
                                    >
                                        <Download className="w-3 h-3" /> Download All ({selectedOrder.images.length})
                                    </a>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {selectedOrder.images.map((imgUrl, i) => (
                                        <div
                                            key={i}
                                            className="group relative rounded-xl border border-white/15 bg-black/50 overflow-hidden"
                                        >
                                            <div className="aspect-square w-full">
                                                <img
                                                    src={imgUrl}
                                                    alt={`Order file ${i + 1}`}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                />
                                            </div>
                                            <div className="p-2 bg-[#12141a] flex items-center justify-between border-t border-white/10 text-[11px] font-mono">
                                                <span>File #{i + 1}</span>
                                                <div className="flex items-center gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => setPreviewImage(imgUrl)}
                                                        className="p-1 hover:text-[#00f5ff] text-white/60"
                                                        title="Preview"
                                                    >
                                                        <Eye className="w-3 h-3" />
                                                    </button>
                                                    <a
                                                        href={imgUrl}
                                                        download
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="p-1 hover:text-accent text-white/60"
                                                        title="Download File"
                                                    >
                                                        <Download className="w-3 h-3" />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Internal Studio Notes */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-mono uppercase text-white/60">
                                    Internal Studio Notes
                                </label>
                                <textarea
                                    value={adminNote}
                                    onChange={(e) => setAdminNote(e.target.value)}
                                    placeholder="Add notes on progress, retouch crew assigned, or delivery links..."
                                    className="w-full h-20 bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-accent transition-colors"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleUpdateStatus(selectedOrder.id, "in_production", undefined, adminNote)}
                                        disabled={isUpdatingStatus}
                                        className="bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20 font-mono text-xs"
                                    >
                                        <Layers className="w-3.5 h-3.5 mr-1" /> Set In Production
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleUpdateStatus(selectedOrder.id, "completed", "paid", adminNote)}
                                        disabled={isUpdatingStatus}
                                        className="bg-accent/10 border-accent/30 text-accent hover:bg-accent/20 font-mono text-xs"
                                    >
                                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Mark Delivered & Paid
                                    </Button>
                                </div>

                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleUpdateStatus(selectedOrder.id, selectedOrder.status, selectedOrder.payment_status, adminNote)}
                                    disabled={isUpdatingStatus}
                                    className="text-white/60 hover:text-white font-mono text-xs"
                                >
                                    Save Notes Only
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Image Preview Modal */}
            <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
                <DialogContent className="max-w-4xl bg-black/95 border-white/20 p-2 text-white">
                    {previewImage && (
                        <div className="relative flex flex-col items-center">
                            <img
                                src={previewImage}
                                alt="Order Asset Preview"
                                className="max-h-[80vh] w-auto object-contain rounded-lg"
                            />
                            <div className="mt-2 flex items-center justify-between w-full px-2 text-xs font-mono">
                                <span className="text-white/60 truncate max-w-md">{previewImage}</span>
                                <a
                                    href={previewImage}
                                    download
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-3 py-1 rounded bg-accent text-black font-semibold flex items-center gap-1"
                                >
                                    <Download className="w-3 h-3" /> Download High-Res
                                </a>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Alert Dialog */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent className="bg-[#12141a] border-white/10 text-white font-mono">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Order #{orderToDelete?.order_number}?</AlertDialogTitle>
                        <AlertDialogDescription className="text-white/60 text-xs">
                            This will permanently remove the order record and references to uploaded client files.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-rose-600 hover:bg-rose-700 text-white"
                        >
                            Delete Order
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}
