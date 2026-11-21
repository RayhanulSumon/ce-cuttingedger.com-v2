import React, { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import { AdminLayout } from "@/Layouts/Admin/AdminLayout";
import { AdminPageHeader } from "@/Components/Admin/UI/AdminPageHeader";
import { AdminDataTable, Column } from "@/Components/Admin/UI/AdminDataTable";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Input } from "@/Components/ui/input";
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
    MoreHorizontal,
    CheckCircle2,
    XCircle,
    Trash2,
    Layers,
    ExternalLink,
    AlertTriangle,
    Folder,
    Search,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderItem {
    id: number;
    order_number: string;
    order_type?: string;
    digital_twin_id?: number | null;
    try_on_look_id?: number | null;
    chat_session_id?: string;
    client_name: string;
    client_email: string;
    client_phone?: string;
    company?: string;
    monthly_volume?: string;
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
    specifications?: Record<string, any>;
    completed_files: string[];
    cloud_link?: string | null;
    instructions?: string;
    admin_notes?: string;
    status: "pending" | "in_production" | "review" | "completed" | "cancelled";
    payment_status: "unpaid" | "paid" | "invoice_sent" | "free_trial";
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
        digital_twin_orders?: number;
        try_on_orders?: number;
        credit_orders?: number;
        total_trials?: number;
        total_revenue: number;
    };
    currentStatus?: string;
    currentPaymentStatus?: string;
    currentType?: string;
    searchTerm?: string;
}

export default function OrdersIndex({
    orders,
    stats,
    currentStatus,
    currentPaymentStatus,
    currentType,
    searchTerm,
}: PageProps) {
    const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState<OrderItem | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [adminNote, setAdminNote] = useState("");
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const [searchQuery, setSearchQuery] = useState(searchTerm || "");

    useEffect(() => {
        setSearchQuery(searchTerm || "");
    }, [searchTerm]);

    const visitWithFilters = (overrides: Record<string, string | number | undefined>) => {
        const merged: Record<string, string | number> = {};
        const nextType = "type" in overrides ? overrides.type : currentType;
        const nextStatus = "status" in overrides ? overrides.status : currentStatus;
        const nextPayment =
            "payment_status" in overrides ? overrides.payment_status : currentPaymentStatus;
        const nextSearch = "search" in overrides ? overrides.search : searchTerm;
        const nextPage = overrides.page;

        if (nextType) merged.type = nextType;
        if (nextStatus) merged.status = nextStatus;
        if (nextPayment) merged.payment_status = nextPayment;
        if (nextSearch && String(nextSearch).trim() !== "") merged.search = String(nextSearch).trim();
        if (nextPage) merged.page = nextPage;

        router.get("/admin/orders", merged, { preserveState: true, preserveScroll: true });
    };

    const handleStatusFilter = (status?: string) => {
        visitWithFilters({ status, page: undefined });
    };

    const handleTypeFilter = (type?: string) => {
        visitWithFilters({ type, page: undefined });
    };

    const handleSearch = (query: string) => {
        visitWithFilters({ search: query, page: undefined });
    };

    const handlePageChange = (page: number) => {
        visitWithFilters({ page });
    };

    const handleUpdateStatus = (
        orderId: number,
        newStatus: OrderItem["status"],
        newPayment?: OrderItem["payment_status"],
        notes?: string
    ) => {
        setIsUpdatingStatus(true);
        const payload: Record<string, string> = {
            status: newStatus,
        };
        if (newPayment !== undefined) {
            payload.payment_status = newPayment;
        }
        if (notes !== undefined) {
            payload.admin_notes = notes;
        }

        router.put(`/admin/orders/${orderId}`, payload, {
            preserveScroll: true,
            onSuccess: () => {
                setIsDetailOpen(false);
                setSelectedOrder(null);
            },
            onFinish: () => setIsUpdatingStatus(false),
        });
    };

    const handleDelete = (order: OrderItem) => {
        setOrderToDelete(order);
        setIsDeleteOpen(true);
    };

    const confirmDelete = () => {
        if (!orderToDelete) return;
        router.delete(`/admin/orders/${orderToDelete.id}`, {
            preserveScroll: true,
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
                    <Badge className="bg-warning-soft text-warning border border-warning/25">
                        <Clock className="w-3 h-3 mr-1" /> Pending Review
                    </Badge>
                );
            case "in_production":
                return (
                    <Badge className="bg-info-soft text-info border border-info/25">
                        <Layers className="w-3 h-3 mr-1" /> In Production
                    </Badge>
                );
            case "review":
                return (
                    <Badge className="bg-info-soft text-info border border-info/25">
                        <Eye className="w-3 h-3 mr-1" /> Quality Review
                    </Badge>
                );
            case "completed":
                return (
                    <Badge className="bg-success-soft text-success border border-success/25">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Completed
                    </Badge>
                );
            case "cancelled":
                return (
                    <Badge className="bg-danger-soft text-danger border border-danger/25">
                        <XCircle className="w-3 h-3 mr-1" /> Cancelled
                    </Badge>
                );
        }
    };

    const getPaymentBadge = (status: OrderItem["payment_status"]) => {
        switch (status) {
            case "paid":
                return (
                    <Badge className="bg-success-soft text-success border border-success/25">
                        Paid
                    </Badge>
                );
            case "invoice_sent":
                return (
                    <Badge className="bg-info-soft text-info border border-info/25">
                        Invoiced
                    </Badge>
                );
            case "free_trial":
                return (
                    <Badge className="bg-info-soft text-info border border-info/25">
                        Free Trial
                    </Badge>
                );
            default:
                return (
                    <Badge className="bg-surface-2 text-muted border border-line">
                        Unpaid
                    </Badge>
                );
        }
    };

    const getOrderTypeBadge = (order: OrderItem) => {
        if (order.payment_status === "free_trial" || order.source === "web_trial" || order.source === "chat_trial") {
            return (
                <Badge className="bg-info-soft text-info border border-info/25 w-fit text-2xs">
                    Free Trial
                </Badge>
            );
        }
        if (order.order_type?.startsWith("digital_twin")) {
            return (
                <Badge className="bg-primary/10 text-primary-ink border border-primary/25 w-fit text-2xs">
                    Digital Twin
                </Badge>
            );
        }
        if (order.order_type === "virtual_try_on_order") {
            return (
                <Badge className="bg-info-soft text-info border border-info/25 w-fit text-2xs">
                    Virtual Try-On
                </Badge>
            );
        }
        if (order.order_type === "credit_usage") {
            return (
                <Badge className="bg-success-soft text-success border border-success/25 w-fit text-2xs">
                    Credit Order
                </Badge>
            );
        }

        return (
            <Badge className="bg-surface-2 text-muted border border-line w-fit text-2xs">
                Custom Order
            </Badge>
        );
    };

    const columns: Column<OrderItem>[] = [
        {
            header: "Order / Date",
            accessorKey: "order_number",
            cell: (row) => (
                <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-ink tracking-wide flex items-center gap-1.5 text-xs">
                        <ShoppingBag className="w-3.5 h-3.5 text-primary shrink-0" />
                        {row.order_number}
                    </span>
                    <span className="text-2xs text-subtle">{row.created_at_formatted}</span>
                </div>
            ),
        },
        {
            header: "Client",
            accessorKey: "client_name",
            cell: (row) => (
                <div className="flex flex-col gap-0.5">
                    <span className="font-semibold text-ink text-xs">{row.client_name}</span>
                    <span className="text-2xs text-subtle">{row.client_email}</span>
                </div>
            ),
        },
        {
            header: "Service & Complexity",
            accessorKey: "service_name",
            cell: (row) => (
                <div className="flex flex-col gap-1 text-xs">
                    <span className="font-semibold text-ink truncate max-w-[200px]">
                        {row.service_name}
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                        {getOrderTypeBadge(row)}
                        <span className="text-2xs text-subtle capitalize">
                            {row.complexity} • {row.turnaround}
                        </span>
                    </div>
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
                    <div className="flex flex-col gap-1 text-xs">
                        <div className="flex items-center gap-1.5">
                            <span className="font-bold text-ink">{row.uploaded_count}</span>
                            <span className="text-faint">/</span>
                            <span className="text-muted">{row.quantity} ordered</span>
                        </div>
                        {row.cloud_link ? (
                            <a
                                href={row.cloud_link}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-2xs text-info bg-info-soft hover:bg-info-soft px-1.5 py-0.5 rounded border border-info/25 w-fit transition-colors"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Folder className="w-2.5 h-2.5 shrink-0" /> Drive Link ↗
                            </a>
                        ) : isUnder ? (
                            <span className="inline-flex items-center gap-1 text-2xs text-warning bg-warning-soft px-1.5 py-0.5 rounded border border-warning/25 w-fit">
                                <AlertTriangle className="w-2.5 h-2.5 shrink-0" />
                                {row.quantity - row.uploaded_count} pending
                            </span>
                        ) : isOver ? (
                            <span className="inline-flex items-center gap-1 text-2xs text-info bg-info-soft px-1.5 py-0.5 rounded border border-info/25 w-fit">
                                +{row.uploaded_count - row.quantity} extra
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 text-2xs text-success bg-success-soft px-1.5 py-0.5 rounded border border-success/25 w-fit">
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
                <div className="flex flex-col gap-1 text-xs">
                    <span className="font-bold text-ink tabular-nums">
                        {row.order_type === "credit_usage" && row.specifications?.credits_spent
                            ? `${Number(row.specifications.credits_spent).toLocaleString()} Credits`
                            : row.total_price > 0
                              ? `$${row.total_price.toFixed(2)}`
                              : "Custom Order"}
                    </span>
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
                        className="h-8 px-2.5 border-line bg-surface hover:bg-surface-2 text-ink text-xs"
                    >
                        <Eye className="w-3.5 h-3.5 mr-1 text-subtle" /> Review
                    </Button>

                    <a
                        href={`/admin/orders/${row.id}/download-zip`}
                        title="Download All Files (ZIP)"
                        className="inline-flex items-center justify-center h-8 px-2.5 rounded-lg bg-surface-2 border border-line hover:bg-surface-3 text-ink text-xs font-medium transition-colors"
                    >
                        <Download className="w-3.5 h-3.5 mr-1 text-subtle" /> ZIP
                    </a>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-subtle hover:text-ink"
                            >
                                <MoreHorizontal className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="text-xs">
                            <DropdownMenuItem
                                onClick={() => handleUpdateStatus(row.id, "in_production")}
                                className="cursor-pointer"
                            >
                                <Layers className="w-3.5 h-3.5 mr-2 text-info" /> Start
                                Production
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleUpdateStatus(row.id, "completed")}
                                className="cursor-pointer"
                            >
                                <CheckCircle2 className="w-3.5 h-3.5 mr-2 text-success" /> Mark
                                Completed
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleDelete(row)}
                                className="text-danger focus:text-danger cursor-pointer"
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
        <AdminLayout title="Orders">
            <div className="space-y-6">
                <AdminPageHeader
                    title="Orders"
                    description="Manage Digital Twin orders, Virtual Try-On orders, credit orders, inspect client uploads, and download production assets."
                />

                {/* Metric Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <button
                        type="button"
                        onClick={() => handleStatusFilter(undefined)}
                        className={cn(
                            "p-3.5 rounded-2xl border text-left transition-all cursor-pointer",
                            !currentStatus
                                ? "bg-surface border-primary ring-2 ring-primary/15 shadow-xs"
                                : "bg-surface border-line hover:border-line-strong"
                        )}
                    >
                        <span className="text-2xs font-semibold uppercase tracking-wide text-subtle block">
                            All Orders
                        </span>
                        <span className="text-2xl font-extrabold text-ink tabular-nums mt-0.5 block">
                            {stats.total}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => handleStatusFilter("pending")}
                        className={cn(
                            "p-3.5 rounded-2xl border text-left transition-all cursor-pointer",
                            currentStatus === "pending"
                                ? "bg-warning-soft border-warning/40 ring-2 ring-warning/15 shadow-xs"
                                : "bg-surface border-line hover:border-line-strong"
                        )}
                    >
                        <span className="text-2xs font-semibold uppercase tracking-wide text-warning block">
                            Pending Review
                        </span>
                        <span className="text-2xl font-extrabold text-warning tabular-nums mt-0.5 block">
                            {stats.pending}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => handleStatusFilter("in_production")}
                        className={cn(
                            "p-3.5 rounded-2xl border text-left transition-all cursor-pointer",
                            currentStatus === "in_production"
                                ? "bg-info-soft border-info/40 ring-2 ring-info/15 shadow-xs"
                                : "bg-surface border-line hover:border-line-strong"
                        )}
                    >
                        <span className="text-2xs font-semibold uppercase tracking-wide text-info block">
                            In Production
                        </span>
                        <span className="text-2xl font-extrabold text-info tabular-nums mt-0.5 block">
                            {stats.in_production}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => handleStatusFilter("completed")}
                        className={cn(
                            "p-3.5 rounded-2xl border text-left transition-all cursor-pointer",
                            currentStatus === "completed"
                                ? "bg-success-soft border-success/40 ring-2 ring-success/15 shadow-xs"
                                : "bg-surface border-line hover:border-line-strong"
                        )}
                    >
                        <span className="text-2xs font-semibold uppercase tracking-wide text-success block">
                            Completed
                        </span>
                        <span className="text-2xl font-extrabold text-success tabular-nums mt-0.5 block">
                            {stats.completed}
                        </span>
                    </button>

                    <div className="p-3.5 rounded-2xl border border-line bg-surface text-left">
                        <span className="text-2xs font-semibold uppercase tracking-wide text-success block">
                            Paid Revenue
                        </span>
                        <span className="text-2xl font-extrabold text-success tabular-nums mt-0.5 block">
                            ${stats.total_revenue.toFixed(2)}
                        </span>
                    </div>
                </div>

                {/* Order Type Filter Pills */}
                <div className="flex flex-wrap items-center gap-2">
                    {[
                        { key: undefined, label: `All Orders (${stats.total})` },
                        {
                            key: "digital_twin",
                            label: `Digital Twins (${stats.digital_twin_orders ?? 0})`,
                        },
                        {
                            key: "virtual_try_on",
                            label: `Virtual Try-On (${stats.try_on_orders ?? 0})`,
                        },
                        {
                            key: "credit_usage",
                            label: `Credit Orders (${stats.credit_orders ?? 0})`,
                        },
                        { key: "free_trial", label: `Free Trials (${stats.total_trials ?? 0})` },
                    ].map((tab) => {
                        const active = (currentType || undefined) === tab.key;
                        return (
                            <button
                                key={tab.key ?? "all"}
                                type="button"
                                onClick={() => handleTypeFilter(tab.key)}
                                className={cn(
                                    "px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer",
                                    active
                                        ? "bg-primary text-primary-foreground border-primary shadow-xs"
                                        : "bg-surface text-muted border-line hover:border-line-strong hover:text-ink"
                                )}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Server-side Search Form */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSearch(searchQuery);
                    }}
                    className="flex flex-wrap items-center justify-between gap-3"
                >
                    <div className="flex flex-wrap items-center gap-2 w-full sm:max-w-md">
                        <div className="relative flex-1 min-w-[200px]">
                            <Search className="w-4 h-4 text-faint absolute left-3 top-1/2 -translate-y-1/2" />
                            <Input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by order #, client, email, or service..."
                                className="pl-9 bg-surface border-line text-ink"
                            />
                        </div>
                        <Button type="submit" variant="outline" size="sm" className="min-h-10 sm:min-h-9 px-3.5">
                            Search
                        </Button>
                        {(searchTerm || searchQuery) && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setSearchQuery("");
                                    handleSearch("");
                                }}
                                className="min-h-10 sm:min-h-9 px-3 text-subtle hover:text-ink"
                            >
                                Clear
                            </Button>
                        )}
                    </div>

                    <div className="text-xs text-subtle">
                        Showing {orders.from ?? 0}–{orders.to ?? orders.data.length} of{" "}
                        {orders.total} orders
                    </div>
                </form>

                {/* Orders Data Table */}
                <AdminDataTable
                    columns={columns}
                    data={orders.data}
                    pageSize={orders.per_page || 15}
                    emptyMessage="No orders match the current filters."
                />

                {/* Server Pagination Footer */}
                {orders.last_page > 1 && (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-line bg-surface px-4 py-3 text-xs text-muted">
                        <span className="">
                            Page {orders.current_page} of {orders.last_page}
                        </span>
                        <div className="flex items-center gap-2 self-end sm:self-auto">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(orders.current_page - 1)}
                                disabled={orders.current_page <= 1}
                                className="min-h-10 sm:min-h-8 px-3 sm:px-2.5"
                            >
                                <ChevronLeft className="w-4 h-4 mr-1" /> Prev
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(orders.current_page + 1)}
                                disabled={orders.current_page >= orders.last_page}
                                className="min-h-10 sm:min-h-8 px-3 sm:px-2.5"
                            >
                                Next <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Order Detail & Process Modal */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="max-w-2xl bg-surface border-line text-ink max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-base font-bold text-ink">
                            <ShoppingBag className="w-4 h-4 text-primary" />
                            <span>Order #{selectedOrder?.order_number}</span>
                        </DialogTitle>
                        <DialogDescription className="text-xs text-subtle">
                            Created on {selectedOrder?.created_at_formatted} • Source:{" "}
                            {selectedOrder?.source?.toUpperCase()}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedOrder && (
                        <div className="space-y-4 py-2 text-xs">
                            {/* Client & Production Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-surface-2 p-3.5 rounded-xl border border-line">
                                <div>
                                    <span className="text-2xs text-faint uppercase font-semibold block">
                                        Client Name
                                    </span>
                                    <span className="font-semibold text-ink">
                                        {selectedOrder.client_name}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-2xs text-faint uppercase font-semibold block">
                                        Delivery Email
                                    </span>
                                    <span className="font-semibold text-primary-ink break-all">
                                        {selectedOrder.client_email}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-2xs text-faint uppercase font-semibold block">
                                        Phone / WhatsApp
                                    </span>
                                    <span className="text-ink-2">
                                        {selectedOrder.client_phone || "Not provided"}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-2xs text-faint uppercase font-semibold block">
                                        Service Type
                                    </span>
                                    <span className="text-ink font-semibold">
                                        {selectedOrder.service_name}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-2xs text-faint uppercase font-semibold block">
                                        Complexity
                                    </span>
                                    <span className="text-primary-ink font-bold capitalize">
                                        {selectedOrder.complexity}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-2xs text-faint uppercase font-semibold block">
                                        Turnaround SLA
                                    </span>
                                    <span className="text-ink">{selectedOrder.turnaround}</span>
                                </div>
                            </div>

                            {/* Quantity Validation Banner */}
                            <div
                                className={cn(
                                    "p-3 rounded-xl border flex items-center justify-between gap-3",
                                    selectedOrder.uploaded_count < selectedOrder.quantity
                                        ? "bg-warning-soft border-warning/25 text-warning"
                                        : "bg-success-soft border-success/25 text-success"
                                )}
                            >
                                <div className="flex items-center gap-2">
                                    {selectedOrder.uploaded_count < selectedOrder.quantity ? (
                                        <AlertTriangle className="w-4 h-4 text-warning shrink-0" />
                                    ) : (
                                        <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                                    )}
                                    <div>
                                        <span className="font-bold text-ink block">
                                            {selectedOrder.uploaded_count} of {selectedOrder.quantity}{" "}
                                            files uploaded
                                        </span>
                                        <span className="text-2xs text-muted">
                                            {selectedOrder.uploaded_count < selectedOrder.quantity
                                                ? `Client ordered ${selectedOrder.quantity} images, and has uploaded ${selectedOrder.uploaded_count} files (${selectedOrder.quantity - selectedOrder.uploaded_count} pending).`
                                                : `All ${selectedOrder.quantity} files received for this production batch.`}
                                        </span>
                                    </div>
                                </div>

                                <a
                                    href={`/admin/orders/${selectedOrder.id}/download-zip`}
                                    className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-bold text-xs flex items-center gap-1.5 shrink-0 hover:bg-primary-hover transition-colors"
                                >
                                    <Download className="w-3.5 h-3.5" />
                                    <span>Download All (ZIP)</span>
                                </a>
                            </div>

                            {/* Financial Summary */}
                            <div className="p-3 rounded-xl bg-surface-2 border border-line flex items-center justify-between text-xs">
                                <div>
                                    <span className="text-subtle block text-2xs uppercase font-semibold">
                                        Pricing Breakdown
                                    </span>
                                    <span className="text-ink font-medium">
                                        ${selectedOrder.unit_price.toFixed(2)}/image ×{" "}
                                        {selectedOrder.quantity} images
                                        {selectedOrder.discount_percent > 0 &&
                                            ` (${selectedOrder.discount_percent}% Volume Discount)`}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="text-subtle block text-2xs uppercase font-semibold">
                                        Total Order Amount
                                    </span>
                                    <span className="text-base font-bold text-primary-ink">
                                        ${selectedOrder.total_price.toFixed(2)} USD
                                    </span>
                                </div>
                            </div>

                            {/* Specifications Breakdown (Digital Twin or Virtual Try-On) */}
                            {selectedOrder.specifications &&
                                Object.keys(selectedOrder.specifications).length > 0 && (
                                    <div className="p-3.5 rounded-xl bg-surface-2 border border-line space-y-2.5">
                                        <span className="text-2xs font-bold uppercase tracking-wider text-primary-ink block">
                                            {selectedOrder.order_type?.startsWith("digital_twin")
                                                ? "Digital Twin Specification & Custom Attributes"
                                                : selectedOrder.order_type === "virtual_try_on_order"
                                                  ? "Virtual Try-On Model & Garment Slots"
                                                  : "Order Specifications"}
                                        </span>

                                        {selectedOrder.order_type?.startsWith("digital_twin") && (
                                            <div className="space-y-2 text-xs">
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <span className="text-subtle text-2xs block">
                                                            Order Mode
                                                        </span>
                                                        <span className="text-primary-ink font-bold uppercase">
                                                            {selectedOrder.specifications.mode}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-subtle text-2xs block">
                                                            Reference / Licensed Twin
                                                        </span>
                                                        <span className="text-ink font-semibold">
                                                            {selectedOrder.specifications
                                                                .reference_twin_name ||
                                                                "Build from scratch"}
                                                        </span>
                                                    </div>
                                                </div>

                                                {Array.isArray(
                                                    selectedOrder.specifications.selected_poses
                                                ) &&
                                                    selectedOrder.specifications.selected_poses
                                                        .length > 0 && (
                                                        <div>
                                                            <span className="text-subtle text-2xs block">
                                                                Requested Pose Angles
                                                            </span>
                                                            <span className="text-ink">
                                                                {selectedOrder.specifications.selected_poses.join(
                                                                    ", "
                                                                )}
                                                            </span>
                                                        </div>
                                                    )}

                                                {selectedOrder.specifications.attributes &&
                                                    Object.keys(
                                                        selectedOrder.specifications.attributes
                                                    ).length > 0 && (
                                                        <div className="pt-2 border-t border-line grid grid-cols-2 gap-2">
                                                            {Object.entries(
                                                                selectedOrder.specifications
                                                                    .attributes
                                                            ).map(([attrKey, attrVal]) => (
                                                                <div
                                                                    key={attrKey}
                                                                    className="bg-surface p-2 rounded-lg border border-line"
                                                                >
                                                                    <span className="text-2xs text-subtle block">
                                                                        {attrKey}
                                                                    </span>
                                                                    <span className="text-ink font-semibold">
                                                                        {typeof attrVal === "object" &&
                                                                        attrVal !== null
                                                                            ? Object.entries(attrVal)
                                                                                  .map(
                                                                                      ([k, v]) =>
                                                                                          `${k}: ${v}`
                                                                                  )
                                                                                  .join(" | ")
                                                                            : String(attrVal)}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                            </div>
                                        )}

                                        {selectedOrder.order_type === "virtual_try_on_order" && (
                                            <div className="space-y-2 text-xs">
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <span className="text-subtle text-2xs block">
                                                            Model Source
                                                        </span>
                                                        <span className="text-primary-ink font-bold uppercase">
                                                            {selectedOrder.specifications
                                                                .model_source === "our_model"
                                                                ? "Our Studio Model"
                                                                : "Client Uploaded Model"}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-subtle text-2xs block">
                                                            Selected Model / Look
                                                        </span>
                                                        <span className="text-ink font-semibold">
                                                            {selectedOrder.specifications
                                                                .selected_model_name
                                                                ? `${selectedOrder.specifications.selected_model_name} (${selectedOrder.specifications.selected_look_name})`
                                                                : selectedOrder.specifications
                                                                      .selected_look_name ||
                                                                  "Client Custom Talent"}
                                                        </span>
                                                    </div>
                                                </div>

                                                {selectedOrder.specifications.labeled_files && (
                                                    <div className="pt-2 border-t border-line grid grid-cols-2 sm:grid-cols-4 gap-2">
                                                        {Object.entries(
                                                            selectedOrder.specifications
                                                                .labeled_files
                                                        ).map(([slotKey, fileUrl]) => (
                                                            <a
                                                                key={slotKey}
                                                                href={String(fileUrl)}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="bg-surface hover:bg-surface-2 p-2 rounded-lg border border-line flex flex-col gap-1 transition-colors"
                                                            >
                                                                <span className="text-2xs uppercase text-primary-ink font-bold">
                                                                    {slotKey.replace("_", " ")}
                                                                </span>
                                                                <span className="text-2xs text-info underline">
                                                                    View / Download ↗
                                                                </span>
                                                            </a>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                            {/* Cloud Drive / Google Drive Folder */}
                            {selectedOrder.cloud_link && (
                                <div className="p-3.5 bg-info-soft rounded-xl border border-info/25 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-info flex items-center gap-1.5">
                                            <Folder className="w-4 h-4 text-info" />
                                            Google Drive / Cloud Folder
                                        </span>
                                        <a
                                            href={selectedOrder.cloud_link}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="px-2.5 py-1 rounded-lg bg-info hover:bg-info/90 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                                        >
                                            <span>Open Cloud Link</span>
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </div>
                                    <p className="text-2xs text-info break-all select-all bg-surface p-2 rounded-lg border border-info/25">
                                        {selectedOrder.cloud_link}
                                    </p>
                                </div>
                            )}

                            {/* Client Instructions */}
                            {selectedOrder.instructions && (
                                <div className="p-3 bg-surface-2 rounded-xl border border-line">
                                    <span className="text-2xs text-subtle uppercase font-semibold block mb-1">
                                        Client Instructions
                                    </span>
                                    <p className="text-ink-2 leading-relaxed">
                                        {selectedOrder.instructions}
                                    </p>
                                </div>
                            )}

                            {/* Uploaded Images Gallery */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-2xs text-muted uppercase tracking-wider font-bold">
                                        Client Uploaded Files ({selectedOrder.images.length})
                                    </span>
                                    <a
                                        href={`/admin/orders/${selectedOrder.id}/download-zip`}
                                        className="text-2xs font-semibold text-primary-ink hover:underline flex items-center gap-1"
                                    >
                                        <Download className="w-3 h-3" /> Download All (
                                        {selectedOrder.images.length})
                                    </a>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {selectedOrder.images.map((imgUrl, i) => (
                                        <div
                                            key={i}
                                            className="group relative rounded-xl border border-line bg-surface-2 overflow-hidden"
                                        >
                                            <div className="aspect-square w-full">
                                                <img
                                                    src={imgUrl}
                                                    alt={`Order file ${i + 1}`}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                />
                                            </div>
                                            <div className="p-2 bg-surface flex items-center justify-between border-t border-line text-2xs">
                                                <span>File #{i + 1}</span>
                                                <div className="flex items-center gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => setPreviewImage(imgUrl)}
                                                        className="p-1 hover:text-primary text-subtle"
                                                        title="Preview"
                                                    >
                                                        <Eye className="w-3 h-3" />
                                                    </button>
                                                    <a
                                                        href={imgUrl}
                                                        download
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="p-1 hover:text-primary text-subtle"
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
                                <label className="text-2xs font-semibold uppercase text-subtle">
                                    Internal Studio Notes
                                </label>
                                <textarea
                                    value={adminNote}
                                    onChange={(e) => setAdminNote(e.target.value)}
                                    placeholder="Add notes on progress, retouch crew assigned, or delivery links..."
                                    className="w-full h-20 bg-surface border border-line rounded-xl p-2.5 text-xs text-ink focus:outline-none focus:border-ring transition-colors"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-2 border-t border-line flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            handleUpdateStatus(
                                                selectedOrder.id,
                                                "in_production",
                                                selectedOrder.payment_status,
                                                adminNote
                                            )
                                        }
                                        disabled={isUpdatingStatus}
                                        className="bg-info-soft border-info/25 text-info hover:bg-info-soft text-xs"
                                    >
                                        <Layers className="w-3.5 h-3.5 mr-1" /> Set In Production
                                    </Button>

                                    <Button
                                        type="button"
                                        size="sm"
                                        onClick={() =>
                                            handleUpdateStatus(
                                                selectedOrder.id,
                                                "completed",
                                                "paid",
                                                adminNote
                                            )
                                        }
                                        disabled={isUpdatingStatus}
                                        className="bg-primary text-primary-foreground hover:bg-primary-hover text-xs font-semibold"
                                    >
                                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Mark Delivered
                                        &amp; Paid
                                    </Button>
                                </div>

                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                        handleUpdateStatus(
                                            selectedOrder.id,
                                            selectedOrder.status,
                                            selectedOrder.payment_status,
                                            adminNote
                                        )
                                    }
                                    disabled={isUpdatingStatus}
                                    className="text-muted hover:text-ink text-xs"
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
                <DialogContent className="max-w-4xl bg-surface border-line p-3 text-ink">
                    {previewImage && (
                        <div className="relative flex flex-col items-center">
                            <img
                                src={previewImage}
                                alt="Order Asset Preview"
                                className="max-h-[80vh] w-auto object-contain rounded-lg"
                            />
                            <div className="mt-2 flex items-center justify-between w-full px-2 text-xs">
                                <span className="text-subtle truncate max-w-md">
                                    {previewImage}
                                </span>
                                <a
                                    href={previewImage}
                                    download
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-semibold flex items-center gap-1"
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
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Order #{orderToDelete?.order_number}?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently remove the order record and references to uploaded
                            client files.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-danger text-white">
                            Delete Order
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}
