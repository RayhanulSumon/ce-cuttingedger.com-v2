import React, { useMemo, useState } from "react";
import { router, useForm } from "@inertiajs/react";
import { Coins, Edit, MoreHorizontal, ShieldCheck, Trash2 } from "lucide-react";
import { AdminDataTable, Column } from "@/Components/Admin/UI/AdminDataTable";
import { AdminPageHeader } from "@/Components/Admin/UI/AdminPageHeader";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/Components/ui/alert-dialog";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Input } from "@/Components/ui/input";
import { Switch } from "@/Components/ui/switch";
import { AdminLayout } from "@/Layouts/Admin/AdminLayout";
import { PricingPlan } from "@/types/models";

interface PricingIndexProps {
    plans: PricingPlan[];
}

interface PlanFormState {
    name: string;
    badge: string;
    headline: string;
    base_credits: number;
    bonus_credits: number;
    price_amount: number;
    validity_days: number;
    cta_text: string;
    features: string[];
    is_popular: boolean;
    sort_order: number;
}

const DEFAULT_FORM_STATE: PlanFormState = {
    name: "",
    badge: "Credit Pack",
    headline: "",
    base_credits: 500,
    bonus_credits: 0,
    price_amount: 250,
    validity_days: 90,
    cta_text: "Buy Plan",
    features: ["Valid for 90 days from activation", "Use across 2D, 3D, DTP & Try-On"],
    is_popular: false,
    sort_order: 0,
};

export default function PricingIndex({ plans = [] }: PricingIndexProps) {
    const [modalOpen, setModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);
    const [planToDelete, setPlanToDelete] = useState<PricingPlan | null>(null);
    const [featuresText, setFeaturesText] = useState(DEFAULT_FORM_STATE.features.join("\n"));

    const form = useForm<PlanFormState>(DEFAULT_FORM_STATE);

    const preview = useMemo(() => {
        const base = Math.max(0, Number(form.data.base_credits) || 0);
        const bonus = Math.max(0, Number(form.data.bonus_credits) || 0);
        const totalCredits = base + bonus;
        const price = Math.max(0, Number(form.data.price_amount) || 0);
        const rate = totalCredits > 0 ? price / totalCredits : 0;
        return { totalCredits, price, rate: rate.toFixed(2) };
    }, [form.data.base_credits, form.data.bonus_credits, form.data.price_amount]);

    const openCreate = () => {
        setEditingPlan(null);
        form.setData({ ...DEFAULT_FORM_STATE, sort_order: plans.length + 1 });
        setFeaturesText(DEFAULT_FORM_STATE.features.join("\n"));
        form.clearErrors();
        setModalOpen(true);
    };

    const openEdit = (plan: PricingPlan) => {
        const features = Array.isArray(plan.features) ? plan.features : [];
        setEditingPlan(plan);
        form.setData({
            name: plan.name,
            badge: plan.badge || (plan.is_popular ? "Most Popular" : "Credit Pack"),
            headline: plan.headline,
            base_credits: plan.base_credits ?? 500,
            bonus_credits: plan.bonus_credits ?? 0,
            price_amount: plan.price_amount ?? 250,
            validity_days: plan.validity_days ?? 90,
            cta_text: plan.cta_text,
            features,
            is_popular: Boolean(plan.is_popular),
            sort_order: plan.sort_order ?? 0,
        });
        setFeaturesText(features.join("\n"));
        form.clearErrors();
        setModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const parsedFeatures = featuresText
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean);

        form.transform((data) => ({
            ...data,
            features: parsedFeatures,
        }));

        if (editingPlan) {
            form.put(route("admin.pricing.update", editingPlan.id), {
                onSuccess: () => {
                    setModalOpen(false);
                    setEditingPlan(null);
                },
            });
            return;
        }

        form.post(route("admin.pricing.store"), {
            onSuccess: () => {
                setModalOpen(false);
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
            header: "PLAN & BADGE",
            cell: (plan) => (
                <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-ink">{plan.name}</span>
                        <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                            {plan.badge || "Credit Pack"}
                        </span>
                    </div>
                    <div className="text-xs text-slate-500 max-w-md truncate">
                        {plan.headline}
                    </div>
                </div>
            ),
        },
        {
            header: "STUDIO CREDITS",
            cell: (plan) => {
                const base = plan.base_credits ?? 0;
                const bonus = plan.bonus_credits ?? 0;
                const total = base + bonus;
                return (
                    <div className="text-xs space-y-0.5">
                        <div className="font-bold text-ink tabular-nums flex items-center gap-1.5">
                            <Coins className="w-3.5 h-3.5 text-primary" />
                            <span>{total.toLocaleString()} Total Credits</span>
                        </div>
                        <div className="text-[11px] text-slate-500 tabular-nums">
                            {base.toLocaleString()} base{bonus > 0 ? ` + ${bonus.toLocaleString()} bonus` : ""} · Valid{" "}
                            {plan.validity_days ?? 90} days
                        </div>
                    </div>
                );
            },
        },
        {
            header: "PRICE & EFFECTIVE RATE",
            cell: (plan) => {
                const total = Math.max(1, (plan.base_credits ?? 0) + (plan.bonus_credits ?? 0));
                const priceAmount = plan.price_amount ?? 0;
                const rate = priceAmount > 0 ? `$${(priceAmount / total).toFixed(2)} / credit` : plan.billing_cycle;
                return (
                    <div className="text-xs space-y-0.5">
                        <div className="font-extrabold text-primary tabular-nums">
                            {priceAmount > 0 ? `$${priceAmount.toLocaleString()}` : plan.price}
                        </div>
                        <div className="text-[11px] text-slate-500 tabular-nums">{rate}</div>
                    </div>
                );
            },
        },
        {
            header: "STATUS",
            cell: (plan) =>
                plan.is_popular ? (
                    <Badge className="bg-primary text-white">MOST POPULAR</Badge>
                ) : (
                    <Badge variant="outline" className="text-slate-600 border-slate-300">
                        STANDARD
                    </Badge>
                ),
        },
        {
            header: "ORDER",
            cell: (plan) => (
                <span className="font-mono text-xs text-slate-500">#{plan.sort_order}</span>
            ),
        },
        {
            header: "",
            className: "text-right",
            cell: (plan) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-500 hover:text-ink"
                        >
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(plan)} className="gap-2 cursor-pointer">
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit Plan</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => setPlanToDelete(plan)}
                            className="gap-2 text-rose-600 focus:text-rose-600 cursor-pointer"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete Plan</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    return (
        <AdminLayout title="PRICING & CREDIT PLANS">
            <AdminPageHeader
                title="Pricing & Credit Plans"
                description="Manage the preset credit packs shown on /pricing. Price and credit edits only affect future purchases."
                actionLabel="Create Credit Plan"
                onActionClick={openCreate}
            />

            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/70 px-5 py-3.5 text-xs text-emerald-900">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                <div>
                    <span className="font-bold">Immutable Purchase Snapshots Active:</span>{" "}
                    Updating or deleting a plan here updates the public{" "}
                    <code className="font-mono font-semibold">/pricing</code> page immediately. All
                    previous client purchases retain their exact price, base/bonus credits, and
                    features snapshot at the time of checkout.
                </div>
            </div>

            <AdminDataTable
                columns={columns}
                data={plans}
                searchKey="name"
                searchPlaceholder="Search credit plans by name..."
            />

            {/* Create / Edit Plan Modal */}
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>
                            {editingPlan ? `Edit ${editingPlan.name}` : "Create Studio Credit Plan"}
                        </DialogTitle>
                        <DialogDescription>
                            Configure credit quantities, bonus credits, USD price, and card display copy.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 pt-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700">Plan Name</label>
                                <Input
                                    value={form.data.name}
                                    onChange={(e) => form.setData("name", e.target.value)}
                                    placeholder="e.g. Studio Credit Pack"
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700">Badge Label</label>
                                <Input
                                    value={form.data.badge}
                                    onChange={(e) => form.setData("badge", e.target.value)}
                                    placeholder="e.g. Most Popular"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700">Base Credits</label>
                                <Input
                                    type="number"
                                    min={10}
                                    max={500000}
                                    value={form.data.base_credits}
                                    onChange={(e) => form.setData("base_credits", Number(e.target.value) || 0)}
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700">Bonus Credits</label>
                                <Input
                                    type="number"
                                    min={0}
                                    max={500000}
                                    value={form.data.bonus_credits}
                                    onChange={(e) => form.setData("bonus_credits", Number(e.target.value) || 0)}
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700">Price (USD)</label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    min={1}
                                    max={500000}
                                    value={form.data.price_amount}
                                    onChange={(e) => form.setData("price_amount", Number(e.target.value) || 0)}
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700">Validity (Days)</label>
                                <Input
                                    type="number"
                                    min={1}
                                    max={3650}
                                    value={form.data.validity_days}
                                    onChange={(e) => form.setData("validity_days", Number(e.target.value) || 1)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs">
                            <span className="text-slate-600">
                                Total Credits:{" "}
                                <strong className="text-ink">{preview.totalCredits.toLocaleString()}</strong>
                            </span>
                            <span className="text-slate-600">
                                Validity:{" "}
                                <strong className="text-ink">{form.data.validity_days} days</strong>
                            </span>
                            <span className="text-slate-600">
                                Effective Rate:{" "}
                                <strong className="text-primary">${preview.rate} / credit</strong>
                            </span>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700">Short Headline</label>
                            <Input
                                value={form.data.headline}
                                onChange={(e) => form.setData("headline", e.target.value)}
                                placeholder="Built for growing fashion and e-commerce brands..."
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700">CTA Button Text</label>
                                <Input
                                    value={form.data.cta_text}
                                    onChange={(e) => form.setData("cta_text", e.target.value)}
                                    placeholder="Buy Studio Plan"
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700">Display Order</label>
                                <Input
                                    type="number"
                                    value={form.data.sort_order}
                                    onChange={(e) => form.setData("sort_order", Number(e.target.value) || 0)}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700">
                                Bullet Features (one per line)
                            </label>
                            <textarea
                                rows={3}
                                value={featuresText}
                                onChange={(e) => setFeaturesText(e.target.value)}
                                placeholder={"500 studio credits never expire\nUse across 2D, 3D, DTP & Try-On"}
                                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-ink focus:border-primary focus:outline-none"
                            />
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                            <div>
                                <span className="text-xs font-semibold text-ink block">
                                    Highlight as Popular Plan
                                </span>
                                <span className="text-[11px] text-slate-500 block">
                                    Adds primary border emphasis on /pricing.
                                </span>
                            </div>
                            <Switch
                                checked={form.data.is_popular}
                                onCheckedChange={(val) => form.setData("is_popular", val)}
                            />
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={form.processing}
                                className="bg-primary hover:bg-primary-hover text-white"
                            >
                                {form.processing
                                    ? "Saving..."
                                    : editingPlan
                                      ? "Save Changes"
                                      : "Publish Credit Plan"}
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
                        <AlertDialogTitle>Delete Credit Plan?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Remove{" "}
                            <span className="font-semibold text-ink">{planToDelete?.name}</span>{" "}
                            from <code className="font-mono">/pricing</code>? Existing client purchases
                            will keep their historical credit snapshot unchanged.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Delete Plan</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}
