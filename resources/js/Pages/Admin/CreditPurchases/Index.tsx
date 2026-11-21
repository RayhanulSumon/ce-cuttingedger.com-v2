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
    Coins,
    Eye,
    Clock,
    MoreHorizontal,
    CheckCircle2,
    XCircle,
    Trash2,
    Search,
    ChevronLeft,
    ChevronRight,
    FileText,
    ShieldCheck,
    CalendarClock,
    CreditCard,
    RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CreditPurchaseItem {
    id: number;
    reference_number: string;
    user_id: number;
    client_name: string;
    client_email: string;
    client_company?: string | null;
    client_phone?: string | null;
    client_credits_balance: number;
    pricing_plan_id?: number | null;
    plan_name: string;
    billing_type: "one_time" | "monthly" | string;
    base_credits: number;
    bonus_credits: number;
    total_credits: number;
    amount_usd: number;
    currency: string;
    effective_rate_per_credit: number;
    validity_days: number;
    features_snapshot: string[];
    payment_provider: "manual" | "stripe" | string;
    payment_status: "unpaid" | "invoice_sent" | "paid" | "failed" | "refunded" | string;
    status: "pending" | "active" | "expired" | "cancelled" | "refunded" | string;
    stripe_customer_id?: string | null;
    stripe_checkout_session_id?: string | null;
    stripe_payment_intent_id?: string | null;
    stripe_subscription_id?: string | null;
    stripe_invoice_id?: string | null;
    credits_activated: boolean;
    activated_at_formatted?: string | null;
    expires_at_formatted?: string | null;
    is_expired: boolean;
    approver_name?: string | null;
    client_notes?: string | null;
    admin_notes?: string | null;
    created_at_formatted: string;
}

interface PageProps {
    purchases: {
        data: CreditPurchaseItem[];
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
        active: number;
        one_time_count: number;
        monthly_count: number;
        manual_count: number;
        stripe_count: number;
        total_credits_issued: number;
        paid_revenue: number;
    };
    currentStatus?: string;
    currentBillingType?: string;
    currentProvider?: string;
    searchTerm?: string;
}

export default function CreditPurchasesIndex({
    purchases,
    stats,
    currentStatus,
    currentBillingType,
    currentProvider,
    searchTerm,
}: PageProps) {
    const [selectedPurchase, setSelectedPurchase] = useState<CreditPurchaseItem | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [purchaseToDelete, setPurchaseToDelete] = useState<CreditPurchaseItem | null>(null);
    const [adminNote, setAdminNote] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [searchQuery, setSearchQuery] = useState(searchTerm || "");

    useEffect(() => {
        setSearchQuery(searchTerm || "");
    }, [searchTerm]);

    const visitWithFilters = (overrides: Record<string, string | number | undefined>) => {
        const merged: Record<string, string | number> = {};
        const nextStatus = "status" in overrides ? overrides.status : currentStatus;
        const nextBilling =
            "billing_type" in overrides ? overrides.billing_type : currentBillingType;
        const nextProvider =
            "payment_provider" in overrides ? overrides.payment_provider : currentProvider;
        const nextSearch = "search" in overrides ? overrides.search : searchTerm;
        const nextPage = overrides.page;

        if (nextStatus) merged.status = nextStatus;
        if (nextBilling) merged.billing_type = nextBilling;
        if (nextProvider) merged.payment_provider = nextProvider;
        if (nextSearch && String(nextSearch).trim() !== "") merged.search = String(nextSearch).trim();
        if (nextPage) merged.page = nextPage;

        router.get("/admin/credit-purchases", merged, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleApprove = (purchase: CreditPurchaseItem, notes?: string) => {
        setIsProcessing(true);
        router.post(
            `/admin/credit-purchases/${purchase.id}/approve`,
            notes !== undefined ? { admin_notes: notes } : {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsDetailOpen(false);
                    setSelectedPurchase(null);
                },
                onFinish: () => setIsProcessing(false),
            }
        );
    };

    const handleUpdate = (
        purchaseId: number,
        newStatus: string,
        newPaymentStatus?: string,
        notes?: string
    ) => {
        setIsProcessing(true);
        const payload: Record<string, string> = {
            status: newStatus,
        };
        if (newPaymentStatus !== undefined) {
            payload.payment_status = newPaymentStatus;
        }
        if (notes !== undefined) {
            payload.admin_notes = notes;
        }

        router.put(`/admin/credit-purchases/${purchaseId}`, payload, {
            preserveScroll: true,
            onSuccess: () => {
                setIsDetailOpen(false);
                setSelectedPurchase(null);
            },
            onFinish: () => setIsProcessing(false),
        });
    };

    const confirmDelete = () => {
        if (!purchaseToDelete) return;
        router.delete(`/admin/credit-purchases/${purchaseToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleteOpen(false);
                setPurchaseToDelete(null);
            },
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "pending":
                return (
                    <Badge className="bg-warning-soft text-warning border border-warning/25">
                        <Clock className="w-3 h-3 mr-1" /> Pending Approval
                    </Badge>
                );
            case "active":
                return (
                    <Badge className="bg-success-soft text-success border border-success/25">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Active
                    </Badge>
                );
            case "expired":
                return (
                    <Badge className="bg-surface-2 text-muted border border-line">
                        <Clock className="w-3 h-3 mr-1" /> Expired
                    </Badge>
                );
            case "cancelled":
                return (
                    <Badge className="bg-danger-soft text-danger border border-danger/25">
                        <XCircle className="w-3 h-3 mr-1" /> Cancelled
                    </Badge>
                );
            case "refunded":
                return (
                    <Badge className="bg-info-soft text-info border border-info/25">
                        Refunded
                    </Badge>
                );
            default:
                return (
                    <Badge className="bg-surface-2 text-muted border border-line">
                        {status}
                    </Badge>
                );
        }
    };

    const getPaymentBadge = (paymentStatus: string) => {
        switch (paymentStatus) {
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
            case "failed":
                return (
                    <Badge className="bg-danger-soft text-danger border border-danger/25">
                        Failed
                    </Badge>
                );
            case "refunded":
                return (
                    <Badge className="bg-info-soft text-info border border-info/25">
                        Refunded
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

    const columns: Column<CreditPurchaseItem>[] = [
        {
            header: "Reference / Date",
            accessorKey: "reference_number",
            cell: (row) => (
                <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-ink tracking-wide flex items-center gap-1.5 text-xs">
                        {row.billing_type === "monthly" ? (
                            <RefreshCw className="w-3.5 h-3.5 text-primary shrink-0" />
                        ) : (
                            <Coins className="w-3.5 h-3.5 text-primary shrink-0" />
                        )}
                        {row.reference_number}
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
            header: "Plan & Billing",
            accessorKey: "plan_name",
            cell: (row) => (
                <div className="flex flex-col gap-1 text-xs">
                    <span className="font-semibold text-ink truncate max-w-[210px]">
                        {row.plan_name}
                    </span>
                    <div className="flex items-center gap-1.5">
                        <span className="text-2xs text-subtle">
                            {row.billing_type === "monthly"
                                ? "Monthly Subscription"
                                : "One-Time Pack"}
                        </span>
                        <span
                            className={cn(
                                "px-1.5 py-0.5 rounded-md text-2xs font-bold uppercase border",
                                row.payment_provider === "stripe"
                                    ? "bg-info-soft text-info border-info/25"
                                    : "bg-surface-2 text-muted border-line"
                            )}
                        >
                            {row.payment_provider === "stripe" ? "Stripe" : "Manual"}
                        </span>
                    </div>
                </div>
            ),
        },
        {
            header: "Credits & Validity",
            accessorKey: "total_credits",
            cell: (row) => (
                <div className="flex flex-col gap-0.5 text-xs">
                    <span className="font-bold text-ink tabular-nums">
                        {row.total_credits.toLocaleString()} Credits
                    </span>
                    {row.bonus_credits > 0 && (
                        <span className="text-2xs text-subtle tabular-nums">
                            {row.base_credits.toLocaleString()} +{" "}
                            {row.bonus_credits.toLocaleString()} bonus
                        </span>
                    )}
                    <span className="text-2xs text-subtle">
                        {row.credits_activated && row.expires_at_formatted
                            ? row.is_expired
                                ? `Expired ${row.expires_at_formatted}`
                                : `Expires ${row.expires_at_formatted}`
                            : `Valid ${row.validity_days} days`}
                    </span>
                </div>
            ),
        },
        {
            header: "Amount / Payment",
            accessorKey: "amount_usd",
            cell: (row) => (
                <div className="flex flex-col gap-1 text-xs">
                    <span className="font-bold text-ink tabular-nums">
                        ${row.amount_usd.toFixed(2)}
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
            cell: (row) => {
                const canApprove =
                    !row.credits_activated &&
                    row.status !== "cancelled" &&
                    row.status !== "refunded";

                return (
                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                                setSelectedPurchase(row);
                                setAdminNote(row.admin_notes || "");
                                setIsDetailOpen(true);
                            }}
                            className="h-8 px-2.5 border-line bg-surface hover:bg-surface-2 text-ink text-xs"
                        >
                            <Eye className="w-3.5 h-3.5 mr-1 text-subtle" /> Review
                        </Button>

                        {canApprove ? (
                            <Button
                                size="sm"
                                onClick={() => handleApprove(row)}
                                disabled={isProcessing}
                                className="h-8 px-2.5 bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-semibold"
                            >
                                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Approve Credits
                            </Button>
                        ) : row.credits_activated ? (
                            <span className="inline-flex items-center gap-1 h-8 px-2.5 rounded-lg bg-success-soft border border-success/25 text-success text-xs font-semibold">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Credited
                            </span>
                        ) : null}

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
                                {canApprove && (
                                    <>
                                        <DropdownMenuItem
                                            onClick={() => handleApprove(row)}
                                            className="cursor-pointer text-success font-semibold"
                                        >
                                            <CheckCircle2 className="w-3.5 h-3.5 mr-2" /> Approve
                                            &amp; Activate Credits
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() =>
                                                handleUpdate(row.id, row.status, "invoice_sent")
                                            }
                                            className="cursor-pointer"
                                        >
                                            <FileText className="w-3.5 h-3.5 mr-2 text-info" />{" "}
                                            Mark Invoice Sent
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() =>
                                                handleUpdate(row.id, "cancelled", row.payment_status)
                                            }
                                            className="cursor-pointer text-danger"
                                        >
                                            <XCircle className="w-3.5 h-3.5 mr-2" /> Cancel Request
                                        </DropdownMenuItem>
                                    </>
                                )}
                                <DropdownMenuItem
                                    onClick={() => {
                                        setPurchaseToDelete(row);
                                        setIsDeleteOpen(true);
                                    }}
                                    className="text-danger focus:text-danger cursor-pointer"
                                >
                                    <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete Record
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
        },
    ];

    const selectedCanApprove = selectedPurchase
        ? !selectedPurchase.credits_activated &&
          selectedPurchase.status !== "cancelled" &&
          selectedPurchase.status !== "refunded"
        : false;

    return (
        <AdminLayout title="Credit Purchases & Subscriptions">
            <div className="space-y-6">
                <AdminPageHeader
                    title="Credit Purchases & Subscriptions"
                    description="Dedicated billing ledger for studio credit packs and monthly subscriptions—isolated from production orders and structured for Stripe integration."
                />

                {/* Metric Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <button
                        type="button"
                        onClick={() => visitWithFilters({ status: undefined, page: undefined })}
                        className={cn(
                            "p-3.5 rounded-2xl border text-left transition-all cursor-pointer",
                            !currentStatus
                                ? "bg-surface border-primary ring-2 ring-primary/15 shadow-xs"
                                : "bg-surface border-line hover:border-line-strong"
                        )}
                    >
                        <span className="text-2xs font-semibold uppercase tracking-wide text-subtle block">
                            All Purchases
                        </span>
                        <span className="text-2xl font-extrabold text-ink tabular-nums mt-0.5 block">
                            {stats.total}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => visitWithFilters({ status: "pending", page: undefined })}
                        className={cn(
                            "p-3.5 rounded-2xl border text-left transition-all cursor-pointer",
                            currentStatus === "pending"
                                ? "bg-warning-soft border-warning/40 ring-2 ring-warning/15 shadow-xs"
                                : "bg-surface border-line hover:border-line-strong"
                        )}
                    >
                        <span className="text-2xs font-semibold uppercase tracking-wide text-warning block">
                            Pending Approval
                        </span>
                        <span className="text-2xl font-extrabold text-warning tabular-nums mt-0.5 block">
                            {stats.pending}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => visitWithFilters({ status: "active", page: undefined })}
                        className={cn(
                            "p-3.5 rounded-2xl border text-left transition-all cursor-pointer",
                            currentStatus === "active"
                                ? "bg-success-soft border-success/40 ring-2 ring-success/15 shadow-xs"
                                : "bg-surface border-line hover:border-line-strong"
                        )}
                    >
                        <span className="text-2xs font-semibold uppercase tracking-wide text-success block">
                            Active Plans
                        </span>
                        <span className="text-2xl font-extrabold text-success tabular-nums mt-0.5 block">
                            {stats.active}
                        </span>
                    </button>

                    <div className="p-3.5 rounded-2xl border border-line bg-surface text-left">
                        <span className="text-2xs font-semibold uppercase tracking-wide text-subtle block">
                            Credits Issued
                        </span>
                        <span className="text-2xl font-extrabold text-ink tabular-nums mt-0.5 block">
                            {stats.total_credits_issued.toLocaleString()}
                        </span>
                    </div>

                    <div className="p-3.5 rounded-2xl border border-line bg-surface text-left">
                        <span className="text-2xs font-semibold uppercase tracking-wide text-success block">
                            Paid Revenue
                        </span>
                        <span className="text-2xl font-extrabold text-success tabular-nums mt-0.5 block">
                            ${stats.paid_revenue.toFixed(2)}
                        </span>
                    </div>
                </div>

                {/* Billing Type & Payment Provider Filter Pills */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                        {[
                            { key: undefined, label: `All Plans (${stats.total})` },
                            { key: "one_time", label: `One-Time Packs (${stats.one_time_count})` },
                            {
                                key: "monthly",
                                label: `Monthly Subscriptions (${stats.monthly_count})`,
                            },
                        ].map((tab) => {
                            const active = (currentBillingType || undefined) === tab.key;
                            return (
                                <button
                                    key={tab.key ?? "all"}
                                    type="button"
                                    onClick={() =>
                                        visitWithFilters({ billing_type: tab.key, page: undefined })
                                    }
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

                    <div className="flex flex-wrap items-center gap-1.5">
                        {[
                            { key: undefined, label: "All Providers" },
                            { key: "manual", label: `Manual (${stats.manual_count})` },
                            { key: "stripe", label: `Stripe (${stats.stripe_count})` },
                        ].map((providerTab) => {
                            const active = (currentProvider || undefined) === providerTab.key;
                            return (
                                <button
                                    key={providerTab.key ?? "all-providers"}
                                    type="button"
                                    onClick={() =>
                                        visitWithFilters({
                                            payment_provider: providerTab.key,
                                            page: undefined,
                                        })
                                    }
                                    className={cn(
                                        "px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer",
                                        active
                                            ? "bg-ink text-surface border-ink"
                                            : "bg-surface text-muted border-line hover:border-line-strong hover:text-ink"
                                    )}
                                >
                                    {providerTab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Server-side Search Form */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        visitWithFilters({ search: searchQuery, page: undefined });
                    }}
                    className="flex flex-wrap items-center justify-between gap-3"
                >
                    <div className="flex flex-wrap items-center gap-2 w-full sm:max-w-md">
                        <div className="relative flex-1 min-w-[200px]">
                            <Search className="w-4 h-4 text-faint absolute left-3 top-1/2 -translate-y-1/2" />
                            <Input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by ref #, client, email, plan, or Stripe ID..."
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
                                    visitWithFilters({ search: "", page: undefined });
                                }}
                                className="min-h-10 sm:min-h-9 px-3 text-subtle hover:text-ink"
                            >
                                Clear
                            </Button>
                        )}
                    </div>

                    <div className="text-xs text-subtle">
                        Showing {purchases.from ?? 0}–{purchases.to ?? purchases.data.length} of{" "}
                        {purchases.total} records
                    </div>
                </form>

                {/* Purchases Data Table */}
                <AdminDataTable
                    columns={columns}
                    data={purchases.data}
                    pageSize={purchases.per_page || 15}
                    emptyMessage="No credit purchases or subscriptions match the current filters."
                />

                {/* Server Pagination Footer */}
                {purchases.last_page > 1 && (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-line bg-surface px-4 py-3 text-xs text-muted">
                        <span className="">
                            Page {purchases.current_page} of {purchases.last_page}
                        </span>
                        <div className="flex items-center gap-2 self-end sm:self-auto">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    visitWithFilters({ page: purchases.current_page - 1 })
                                }
                                disabled={purchases.current_page <= 1}
                                className="min-h-10 sm:min-h-8 px-3 sm:px-2.5"
                            >
                                <ChevronLeft className="w-4 h-4 mr-1" /> Prev
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    visitWithFilters({ page: purchases.current_page + 1 })
                                }
                                disabled={purchases.current_page >= purchases.last_page}
                                className="min-h-10 sm:min-h-8 px-3 sm:px-2.5"
                            >
                                Next <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Credit Purchase Review Modal */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="max-w-2xl bg-surface border-line text-ink max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-base font-bold text-ink">
                            <Coins className="w-4 h-4 text-primary" />
                            <span>Purchase #{selectedPurchase?.reference_number}</span>
                        </DialogTitle>
                        <DialogDescription className="text-xs text-subtle">
                            Submitted on {selectedPurchase?.created_at_formatted} • Provider:{" "}
                            {selectedPurchase?.payment_provider?.toUpperCase()}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedPurchase && (
                        <div className="space-y-4 py-2 text-xs">
                            {/* Client Summary Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-surface-2 p-3.5 rounded-xl border border-line">
                                <div>
                                    <span className="text-2xs text-faint uppercase font-semibold block">
                                        Client Name
                                    </span>
                                    <span className="font-semibold text-ink">
                                        {selectedPurchase.client_name}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-2xs text-faint uppercase font-semibold block">
                                        Client Email
                                    </span>
                                    <span className="font-semibold text-primary-ink break-all">
                                        {selectedPurchase.client_email}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-2xs text-faint uppercase font-semibold block">
                                        Current Wallet Balance
                                    </span>
                                    <span className="font-bold text-ink tabular-nums">
                                        {selectedPurchase.client_credits_balance.toLocaleString()}{" "}
                                        Credits
                                    </span>
                                </div>
                                <div>
                                    <span className="text-2xs text-faint uppercase font-semibold block">
                                        Plan Name
                                    </span>
                                    <span className="font-semibold text-ink">
                                        {selectedPurchase.plan_name}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-2xs text-faint uppercase font-semibold block">
                                        Billing Mode
                                    </span>
                                    <span className="font-bold text-primary-ink">
                                        {selectedPurchase.billing_type === "monthly"
                                            ? "Monthly Subscription"
                                            : "One-Time Pack"}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-2xs text-faint uppercase font-semibold block">
                                        Company / Phone
                                    </span>
                                    <span className="text-ink-2">
                                        {selectedPurchase.client_company ||
                                            selectedPurchase.client_phone ||
                                            "Not provided"}
                                    </span>
                                </div>
                            </div>

                            {/* Activation Banner */}
                            {selectedPurchase.credits_activated ? (
                                <div className="p-3 rounded-xl bg-success-soft border border-success/25 flex items-start gap-2.5 text-success">
                                    <ShieldCheck className="w-4 h-4 text-success shrink-0 mt-0.5" />
                                    <div>
                                        <div className="font-bold">
                                            Credits Activated —{" "}
                                            {selectedPurchase.total_credits.toLocaleString()} studio
                                            credits credited
                                        </div>
                                        <div className="text-2xs text-success mt-0.5">
                                            Activated {selectedPurchase.activated_at_formatted || "—"}
                                            {selectedPurchase.approver_name &&
                                                ` by ${selectedPurchase.approver_name}`}
                                            {selectedPurchase.expires_at_formatted &&
                                                ` · Valid until ${selectedPurchase.expires_at_formatted}`}
                                        </div>
                                    </div>
                                </div>
                            ) : selectedPurchase.status === "cancelled" ||
                              selectedPurchase.status === "refunded" ? (
                                <div className="p-3 rounded-xl bg-danger-soft border border-danger/25 flex items-start gap-2.5 text-danger">
                                    <XCircle className="w-4 h-4 text-danger shrink-0 mt-0.5" />
                                    <div>
                                        <div className="font-bold capitalize">
                                            Purchase {selectedPurchase.status}
                                        </div>
                                        <div className="text-2xs text-danger mt-0.5">
                                            No credits were added to the client wallet for this
                                            record.
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-3 rounded-xl bg-warning-soft border border-warning/25 flex items-start gap-2.5 text-warning">
                                    <Clock className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                                    <div>
                                        <div className="font-bold">
                                            Pending Approval &amp; Activation
                                        </div>
                                        <div className="text-2xs text-warning mt-0.5">
                                            Approving will atomically add{" "}
                                            <strong>
                                                {selectedPurchase.total_credits.toLocaleString()}
                                            </strong>{" "}
                                            studio credits to{" "}
                                            <strong>{selectedPurchase.client_name}</strong>
                                            &apos;s wallet and start the{" "}
                                            <strong>{selectedPurchase.validity_days}-day</strong>{" "}
                                            validity window.
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Immutable Snapshot Breakdown */}
                            <div className="p-4 rounded-xl border border-line bg-surface space-y-3">
                                <span className="text-2xs font-bold uppercase tracking-wider text-subtle block">
                                    Immutable Checkout Snapshot
                                </span>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                    <div className="p-2.5 rounded-lg bg-surface-2 border border-line">
                                        <span className="text-2xs text-subtle uppercase font-semibold block">
                                            Base Credits
                                        </span>
                                        <span className="text-sm font-bold text-ink tabular-nums">
                                            {selectedPurchase.base_credits.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="p-2.5 rounded-lg bg-surface-2 border border-line">
                                        <span className="text-2xs text-subtle uppercase font-semibold block">
                                            Bonus Credits
                                        </span>
                                        <span className="text-sm font-bold text-success tabular-nums">
                                            +{selectedPurchase.bonus_credits.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="p-2.5 rounded-lg bg-surface-2 border border-line">
                                        <span className="text-2xs text-subtle uppercase font-semibold block">
                                            Total Credits
                                        </span>
                                        <span className="text-sm font-bold text-primary-ink tabular-nums">
                                            {selectedPurchase.total_credits.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="p-2.5 rounded-lg bg-surface-2 border border-line">
                                        <span className="text-2xs text-subtle uppercase font-semibold block">
                                            Total Price
                                        </span>
                                        <span className="text-sm font-bold text-ink tabular-nums block">
                                            ${selectedPurchase.amount_usd.toFixed(2)}{" "}
                                            {selectedPurchase.currency}
                                        </span>
                                        <span className="text-2xs text-subtle">
                                            ${selectedPurchase.effective_rate_per_credit.toFixed(2)}
                                            /credit
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-3 text-2xs text-muted bg-surface-2 px-3 py-2 rounded-lg border border-line">
                                    <span className="inline-flex items-center gap-1">
                                        <CalendarClock className="w-3.5 h-3.5 text-faint" />
                                        {selectedPurchase.validity_days} days validity
                                    </span>
                                    <span>•</span>
                                    <span>
                                        {selectedPurchase.credits_activated &&
                                        selectedPurchase.expires_at_formatted
                                            ? `Expires ${selectedPurchase.expires_at_formatted}`
                                            : "Starts on activation"}
                                    </span>
                                </div>

                                {Array.isArray(selectedPurchase.features_snapshot) &&
                                    selectedPurchase.features_snapshot.length > 0 && (
                                        <div className="space-y-1.5">
                                            <span className="text-2xs uppercase font-bold tracking-wider text-subtle block">
                                                Snapshot Terms at Checkout
                                            </span>
                                            <ul className="space-y-1 text-ink-2">
                                                {selectedPurchase.features_snapshot.map(
                                                    (feature, idx) => (
                                                        <li
                                                            key={idx}
                                                            className="flex items-start gap-2 text-2xs"
                                                        >
                                                            <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                                                            <span>{feature}</span>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    )}
                            </div>

                            {/* Stripe & Payment Provider Details */}
                            <div className="p-3.5 rounded-xl bg-surface-2 border border-line space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-2xs uppercase font-bold tracking-wider text-subtle flex items-center gap-1.5">
                                        <CreditCard className="w-3.5 h-3.5 text-faint" />
                                        Billing Provider Metadata
                                    </span>
                                    <span className="text-2xs font-bold uppercase px-2 py-0.5 rounded bg-surface border border-line text-ink">
                                        {selectedPurchase.payment_provider}
                                    </span>
                                </div>
                                {selectedPurchase.stripe_customer_id ||
                                selectedPurchase.stripe_subscription_id ||
                                selectedPurchase.stripe_invoice_id ||
                                selectedPurchase.stripe_payment_intent_id ||
                                selectedPurchase.stripe_checkout_session_id ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-2xs text-ink-2">
                                        {selectedPurchase.stripe_customer_id && (
                                            <div>Customer: {selectedPurchase.stripe_customer_id}</div>
                                        )}
                                        {selectedPurchase.stripe_subscription_id && (
                                            <div>
                                                Subscription:{" "}
                                                {selectedPurchase.stripe_subscription_id}
                                            </div>
                                        )}
                                        {selectedPurchase.stripe_invoice_id && (
                                            <div>Invoice: {selectedPurchase.stripe_invoice_id}</div>
                                        )}
                                        {selectedPurchase.stripe_payment_intent_id && (
                                            <div>
                                                PaymentIntent:{" "}
                                                {selectedPurchase.stripe_payment_intent_id}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-2xs text-subtle">
                                        Manual invoice / bank approval flow (Stripe customer,
                                        checkout session, payment intent, invoice, and subscription
                                        IDs automatically populate when Stripe webhooks go live).
                                    </p>
                                )}
                            </div>

                            {selectedPurchase.client_notes && (
                                <div className="p-3 bg-surface-2 rounded-xl border border-line">
                                    <span className="text-2xs text-subtle uppercase font-semibold block mb-1">
                                        Client Checkout Note
                                    </span>
                                    <p className="text-ink-2 leading-relaxed">
                                        {selectedPurchase.client_notes}
                                    </p>
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label className="text-2xs font-semibold uppercase text-subtle">
                                    Internal Admin Notes
                                </label>
                                <textarea
                                    value={adminNote}
                                    onChange={(e) => setAdminNote(e.target.value)}
                                    placeholder="Add invoice reference, wire confirmation, or activation notes..."
                                    className="w-full h-20 bg-surface border border-line rounded-xl p-2.5 text-xs text-ink focus:outline-none focus:border-ring transition-colors"
                                />
                            </div>

                            <div className="pt-2 border-t border-line flex flex-wrap items-center justify-between gap-2">
                                <div className="flex flex-wrap items-center gap-2">
                                    {selectedCanApprove ? (
                                        <>
                                            <Button
                                                type="button"
                                                size="sm"
                                                onClick={() =>
                                                    handleApprove(selectedPurchase, adminNote)
                                                }
                                                disabled={isProcessing}
                                                className="bg-primary text-primary-foreground hover:bg-primary-hover text-xs font-semibold"
                                            >
                                                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />{" "}
                                                Approve &amp; Activate Credits
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    handleUpdate(
                                                        selectedPurchase.id,
                                                        selectedPurchase.status,
                                                        "invoice_sent",
                                                        adminNote
                                                    )
                                                }
                                                disabled={isProcessing}
                                                className="text-xs"
                                            >
                                                <FileText className="w-3.5 h-3.5 mr-1 text-info" />{" "}
                                                Mark Invoice Sent
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    handleUpdate(
                                                        selectedPurchase.id,
                                                        "cancelled",
                                                        selectedPurchase.payment_status,
                                                        adminNote
                                                    )
                                                }
                                                disabled={isProcessing}
                                                className="border-danger/25 text-danger hover:bg-danger-soft text-xs"
                                            >
                                                <XCircle className="w-3.5 h-3.5 mr-1" /> Cancel
                                                Request
                                            </Button>
                                        </>
                                    ) : selectedPurchase.credits_activated ? (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-success-soft border border-success/25 text-success text-xs font-semibold">
                                            <CheckCircle2 className="w-3.5 h-3.5" /> Credits
                                            Activated
                                        </span>
                                    ) : null}
                                </div>

                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                        handleUpdate(
                                            selectedPurchase.id,
                                            selectedPurchase.status,
                                            selectedPurchase.payment_status,
                                            adminNote
                                        )
                                    }
                                    disabled={isProcessing}
                                    className="text-muted hover:text-ink text-xs"
                                >
                                    Save Notes Only
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Alert Dialog */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Delete Purchase #{purchaseToDelete?.reference_number}?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This permanently deletes the credit purchase record from billing
                            history. Already-credited balances on the user account are not altered.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-danger text-white">
                            Delete Record
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}
