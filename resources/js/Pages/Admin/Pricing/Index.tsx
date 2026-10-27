import React, { useState } from "react";
import { useForm, router } from "@inertiajs/react";
import { AdminLayout } from "@/Layouts/Admin/AdminLayout";
import { AdminPageHeader } from "@/Components/Admin/UI/AdminPageHeader";
import { AdminDataTable, Column } from "@/Components/Admin/UI/AdminDataTable";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Badge } from "@/Components/ui/badge";
import { Switch } from "@/Components/ui/switch";
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
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { PricingPlan } from "@/types/models";

interface PricingIndexProps {
    plans: PricingPlan[];
}

export default function PricingIndex({ plans = [] }: PricingIndexProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);
    const [planToDelete, setPlanToDelete] = useState<PricingPlan | null>(null);

    const createForm = useForm({
        name: "",
        headline: "",
        price: "$14,500",
        billing_cycle: "per sprint",
        cta_text: "Initiate Sprint",
        is_popular: false,
        sort_order: 0,
    });

    const editForm = useForm({
        name: "",
        headline: "",
        price: "",
        billing_cycle: "",
        cta_text: "",
        is_popular: false,
        sort_order: 0,
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(route("admin.pricing.store"), {
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
            },
        });
    };

    const openEdit = (p: PricingPlan) => {
        setEditingPlan(p);
        editForm.setData({
            name: p.name,
            headline: p.headline,
            price: p.price,
            billing_cycle: p.billing_cycle,
            cta_text: p.cta_text,
            is_popular: p.is_popular,
            sort_order: p.sort_order,
        });
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingPlan) return;
        editForm.put(route("admin.pricing.update", editingPlan.id), {
            onSuccess: () => {
                setEditingPlan(null);
                editForm.reset();
            },
        });
    };

    const handleDelete = () => {
        if (!planToDelete) return;
        router.delete(route("admin.pricing.destroy", planToDelete.id), {
            onSuccess: () => setPlanToDelete(null),
        });
    };

    const columns: Column<PricingPlan>[] = [
        {
            header: "TIER & HEADLINE",
            cell: (p) => (
                <div>
                    <div className="font-semibold text-white">{p.name}</div>
                    <div className="text-xs text-neutral-400 font-mono">
                        {p.headline}
                    </div>
                </div>
            ),
        },
        {
            header: "INVESTMENT",
            cell: (p) => (
                <div className="font-mono text-xs">
                    <span className="text-accent font-bold">{p.price}</span>{" "}
                    <span className="text-neutral-500">/{p.billing_cycle}</span>
                </div>
            ),
        },
        {
            header: "STATUS",
            cell: (p) =>
                p.is_popular ? (
                    <Badge variant="accent">MOST POPULAR</Badge>
                ) : (
                    <Badge variant="outline">STANDARD</Badge>
                ),
        },
        {
            header: "ORDER",
            cell: (p) => (
                <span className="font-mono text-xs text-neutral-400">
                    #{p.sort_order}
                </span>
            ),
        },
        {
            header: "",
            className: "text-right",
            cell: (p) => (
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
                        <DropdownMenuItem onClick={() => openEdit(p)} className="gap-2">
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit Tier</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => setPlanToDelete(p)}
                            className="gap-2 text-rose-400 focus:text-rose-400"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Purge Tier</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    return (
        <AdminLayout title="COMMERCIAL TIERS">
            <AdminPageHeader
                title="Pricing & Sprint Plans"
                description="Studio sprint agreements, recurring retainer terms, and enterprise contracts."
                actionLabel="Create Tier"
                onActionClick={() => setIsCreateOpen(true)}
            />

            <AdminDataTable
                columns={columns}
                data={plans}
                searchKey="name"
                searchPlaceholder="Search tiers by name..."
            />

            {/* Create Plan Modal */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create Commercial Tier</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleCreate} className="space-y-4 pt-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase text-neutral-400">
                                    Tier Name
                                </label>
                                <Input
                                    value={createForm.data.name}
                                    onChange={(e) =>
                                        createForm.setData("name", e.target.value)
                                    }
                                    placeholder="e.g. Velocity Sprint"
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase text-neutral-400">
                                    Price Amount
                                </label>
                                <Input
                                    value={createForm.data.price}
                                    onChange={(e) =>
                                        createForm.setData("price", e.target.value)
                                    }
                                    placeholder="$14,500"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase text-neutral-400">
                                    Billing Cycle
                                </label>
                                <Input
                                    value={createForm.data.billing_cycle}
                                    onChange={(e) =>
                                        createForm.setData(
                                            "billing_cycle",
                                            e.target.value
                                        )
                                    }
                                    placeholder="per sprint / monthly"
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase text-neutral-400">
                                    CTA Button Label
                                </label>
                                <Input
                                    value={createForm.data.cta_text}
                                    onChange={(e) =>
                                        createForm.setData("cta_text", e.target.value)
                                    }
                                    placeholder="Initiate Sprint"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-mono uppercase text-neutral-400">
                                Headline Description
                            </label>
                            <Input
                                value={createForm.data.headline}
                                onChange={(e) =>
                                    createForm.setData("headline", e.target.value)
                                }
                                placeholder="High-velocity 2-week execution block..."
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                            <div>
                                <span className="text-xs font-semibold text-white block">
                                    Flagship / Popular Tier
                                </span>
                                <span className="text-[11px] text-neutral-400 block">
                                    Highlight card with prominent lime accent borders.
                                </span>
                            </div>
                            <Switch
                                checked={createForm.data.is_popular}
                                onCheckedChange={(val) =>
                                    createForm.setData("is_popular", val)
                                }
                            />
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCreateOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={createForm.processing}
                            >
                                {createForm.processing ? "Publishing..." : "Publish Tier"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Plan Modal */}
            <Dialog
                open={!!editingPlan}
                onOpenChange={(open) => !open && setEditingPlan(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Commercial Tier</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleUpdate} className="space-y-4 pt-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase text-neutral-400">
                                    Tier Name
                                </label>
                                <Input
                                    value={editForm.data.name}
                                    onChange={(e) =>
                                        editForm.setData("name", e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase text-neutral-400">
                                    Price Amount
                                </label>
                                <Input
                                    value={editForm.data.price}
                                    onChange={(e) =>
                                        editForm.setData("price", e.target.value)
                                    }
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase text-neutral-400">
                                    Billing Cycle
                                </label>
                                <Input
                                    value={editForm.data.billing_cycle}
                                    onChange={(e) =>
                                        editForm.setData(
                                            "billing_cycle",
                                            e.target.value
                                        )
                                    }
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase text-neutral-400">
                                    CTA Button Label
                                </label>
                                <Input
                                    value={editForm.data.cta_text}
                                    onChange={(e) =>
                                        editForm.setData("cta_text", e.target.value)
                                    }
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-mono uppercase text-neutral-400">
                                Headline Description
                            </label>
                            <Input
                                value={editForm.data.headline}
                                onChange={(e) =>
                                    editForm.setData("headline", e.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                            <div>
                                <span className="text-xs font-semibold text-white block">
                                    Flagship / Popular Tier
                                </span>
                                <span className="text-[11px] text-neutral-400 block">
                                    Highlight card with prominent lime accent borders.
                                </span>
                            </div>
                            <Switch
                                checked={editForm.data.is_popular}
                                onCheckedChange={(val) =>
                                    editForm.setData("is_popular", val)
                                }
                            />
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditingPlan(null)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={editForm.processing}
                            >
                                {editForm.processing ? "Saving..." : "Save Modifications"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Confirm Delete */}
            <AlertDialog
                open={!!planToDelete}
                onOpenChange={(open) => !open && setPlanToDelete(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Purge Commercial Tier?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you certain you wish to purge tier{" "}
                            <span className="text-white font-semibold">
                                {planToDelete?.name}
                            </span>
                            ?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                            Purge
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}
