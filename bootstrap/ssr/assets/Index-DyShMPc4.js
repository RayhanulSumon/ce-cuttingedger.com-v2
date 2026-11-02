import { a as DropdownMenuItem, i as DropdownMenuContent, n as AdminLayout, o as DropdownMenuTrigger, r as DropdownMenu, t as AdminPageHeader } from "./AdminPageHeader-BF3p_UDa.js";
import { n as Button, t as Input } from "./input-lL3MBuxn.js";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, l as AdminDataTable, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-DsbEgc5R.js";
import { t as Badge } from "./badge-BgjwAGBP.js";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-C4D4ccTI.js";
import { t as Switch } from "./switch-7-Y_VisU.js";
import { useState } from "react";
import { router, useForm } from "@inertiajs/react";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Admin/Pricing/Index.tsx
function PricingIndex({ plans = [] }) {
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [editingPlan, setEditingPlan] = useState(null);
	const [planToDelete, setPlanToDelete] = useState(null);
	const createForm = useForm({
		name: "",
		headline: "",
		price: "$14,500",
		billing_cycle: "per sprint",
		cta_text: "Initiate Sprint",
		is_popular: false,
		sort_order: 0
	});
	const editForm = useForm({
		name: "",
		headline: "",
		price: "",
		billing_cycle: "",
		cta_text: "",
		is_popular: false,
		sort_order: 0
	});
	const handleCreate = (e) => {
		e.preventDefault();
		createForm.post(route("admin.pricing.store"), { onSuccess: () => {
			setIsCreateOpen(false);
			createForm.reset();
		} });
	};
	const openEdit = (p) => {
		setEditingPlan(p);
		editForm.setData({
			name: p.name,
			headline: p.headline,
			price: p.price,
			billing_cycle: p.billing_cycle,
			cta_text: p.cta_text,
			is_popular: p.is_popular,
			sort_order: p.sort_order
		});
	};
	const handleUpdate = (e) => {
		e.preventDefault();
		if (!editingPlan) return;
		editForm.put(route("admin.pricing.update", editingPlan.id), { onSuccess: () => {
			setEditingPlan(null);
			editForm.reset();
		} });
	};
	const handleDelete = () => {
		if (!planToDelete) return;
		router.delete(route("admin.pricing.destroy", planToDelete.id), { onSuccess: () => setPlanToDelete(null) });
	};
	return /* @__PURE__ */ jsxs(AdminLayout, {
		title: "COMMERCIAL TIERS",
		children: [
			/* @__PURE__ */ jsx(AdminPageHeader, {
				title: "Pricing & Sprint Plans",
				description: "Studio sprint agreements, recurring retainer terms, and enterprise contracts.",
				actionLabel: "Create Tier",
				onActionClick: () => setIsCreateOpen(true)
			}),
			/* @__PURE__ */ jsx(AdminDataTable, {
				columns: [
					{
						header: "TIER & HEADLINE",
						cell: (p) => /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
							className: "font-semibold text-white",
							children: p.name
						}), /* @__PURE__ */ jsx("div", {
							className: "text-xs text-neutral-400 font-mono",
							children: p.headline
						})] })
					},
					{
						header: "INVESTMENT",
						cell: (p) => /* @__PURE__ */ jsxs("div", {
							className: "font-mono text-xs",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-accent font-bold",
									children: p.price
								}),
								" ",
								/* @__PURE__ */ jsxs("span", {
									className: "text-neutral-500",
									children: ["/", p.billing_cycle]
								})
							]
						})
					},
					{
						header: "STATUS",
						cell: (p) => p.is_popular ? /* @__PURE__ */ jsx(Badge, {
							variant: "accent",
							children: "MOST POPULAR"
						}) : /* @__PURE__ */ jsx(Badge, {
							variant: "outline",
							children: "STANDARD"
						})
					},
					{
						header: "ORDER",
						cell: (p) => /* @__PURE__ */ jsxs("span", {
							className: "font-mono text-xs text-neutral-400",
							children: ["#", p.sort_order]
						})
					},
					{
						header: "",
						className: "text-right",
						cell: (p) => /* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
							asChild: true,
							children: /* @__PURE__ */ jsx(Button, {
								variant: "ghost",
								size: "icon",
								className: "h-8 w-8 text-neutral-400 hover:text-white",
								children: /* @__PURE__ */ jsx(MoreHorizontal, { className: "h-4 w-4" })
							})
						}), /* @__PURE__ */ jsxs(DropdownMenuContent, {
							align: "end",
							children: [/* @__PURE__ */ jsxs(DropdownMenuItem, {
								onClick: () => openEdit(p),
								className: "gap-2",
								children: [/* @__PURE__ */ jsx(Edit, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Edit Tier" })]
							}), /* @__PURE__ */ jsxs(DropdownMenuItem, {
								onClick: () => setPlanToDelete(p),
								className: "gap-2 text-rose-400 focus:text-rose-400",
								children: [/* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Purge Tier" })]
							})]
						})] })
					}
				],
				data: plans,
				searchKey: "name",
				searchPlaceholder: "Search tiers by name..."
			}),
			/* @__PURE__ */ jsx(Dialog, {
				open: isCreateOpen,
				onOpenChange: setIsCreateOpen,
				children: /* @__PURE__ */ jsxs(DialogContent, { children: [/* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Create Commercial Tier" }) }), /* @__PURE__ */ jsxs("form", {
					onSubmit: handleCreate,
					className: "space-y-4 pt-2",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-2 gap-4",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-mono uppercase text-neutral-400",
									children: "Tier Name"
								}), /* @__PURE__ */ jsx(Input, {
									value: createForm.data.name,
									onChange: (e) => createForm.setData("name", e.target.value),
									placeholder: "e.g. Velocity Sprint",
									required: true
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-mono uppercase text-neutral-400",
									children: "Price Amount"
								}), /* @__PURE__ */ jsx(Input, {
									value: createForm.data.price,
									onChange: (e) => createForm.setData("price", e.target.value),
									placeholder: "$14,500",
									required: true
								})]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-2 gap-4",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-mono uppercase text-neutral-400",
									children: "Billing Cycle"
								}), /* @__PURE__ */ jsx(Input, {
									value: createForm.data.billing_cycle,
									onChange: (e) => createForm.setData("billing_cycle", e.target.value),
									placeholder: "per sprint / monthly",
									required: true
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-mono uppercase text-neutral-400",
									children: "CTA Button Label"
								}), /* @__PURE__ */ jsx(Input, {
									value: createForm.data.cta_text,
									onChange: (e) => createForm.setData("cta_text", e.target.value),
									placeholder: "Initiate Sprint",
									required: true
								})]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ jsx("label", {
								className: "text-xs font-mono uppercase text-neutral-400",
								children: "Headline Description"
							}), /* @__PURE__ */ jsx(Input, {
								value: createForm.data.headline,
								onChange: (e) => createForm.setData("headline", e.target.value),
								placeholder: "High-velocity 2-week execution block...",
								required: true
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
								className: "text-xs font-semibold text-white block",
								children: "Flagship / Popular Tier"
							}), /* @__PURE__ */ jsx("span", {
								className: "text-[11px] text-neutral-400 block",
								children: "Highlight card with prominent lime accent borders."
							})] }), /* @__PURE__ */ jsx(Switch, {
								checked: createForm.data.is_popular,
								onCheckedChange: (val) => createForm.setData("is_popular", val)
							})]
						}),
						/* @__PURE__ */ jsxs(DialogFooter, { children: [/* @__PURE__ */ jsx(Button, {
							type: "button",
							variant: "outline",
							onClick: () => setIsCreateOpen(false),
							children: "Cancel"
						}), /* @__PURE__ */ jsx(Button, {
							type: "submit",
							disabled: createForm.processing,
							children: createForm.processing ? "Publishing..." : "Publish Tier"
						})] })
					]
				})] })
			}),
			/* @__PURE__ */ jsx(Dialog, {
				open: !!editingPlan,
				onOpenChange: (open) => !open && setEditingPlan(null),
				children: /* @__PURE__ */ jsxs(DialogContent, { children: [/* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Edit Commercial Tier" }) }), /* @__PURE__ */ jsxs("form", {
					onSubmit: handleUpdate,
					className: "space-y-4 pt-2",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-2 gap-4",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-mono uppercase text-neutral-400",
									children: "Tier Name"
								}), /* @__PURE__ */ jsx(Input, {
									value: editForm.data.name,
									onChange: (e) => editForm.setData("name", e.target.value),
									required: true
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-mono uppercase text-neutral-400",
									children: "Price Amount"
								}), /* @__PURE__ */ jsx(Input, {
									value: editForm.data.price,
									onChange: (e) => editForm.setData("price", e.target.value),
									required: true
								})]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-2 gap-4",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-mono uppercase text-neutral-400",
									children: "Billing Cycle"
								}), /* @__PURE__ */ jsx(Input, {
									value: editForm.data.billing_cycle,
									onChange: (e) => editForm.setData("billing_cycle", e.target.value),
									required: true
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-mono uppercase text-neutral-400",
									children: "CTA Button Label"
								}), /* @__PURE__ */ jsx(Input, {
									value: editForm.data.cta_text,
									onChange: (e) => editForm.setData("cta_text", e.target.value),
									required: true
								})]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ jsx("label", {
								className: "text-xs font-mono uppercase text-neutral-400",
								children: "Headline Description"
							}), /* @__PURE__ */ jsx(Input, {
								value: editForm.data.headline,
								onChange: (e) => editForm.setData("headline", e.target.value),
								required: true
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
								className: "text-xs font-semibold text-white block",
								children: "Flagship / Popular Tier"
							}), /* @__PURE__ */ jsx("span", {
								className: "text-[11px] text-neutral-400 block",
								children: "Highlight card with prominent lime accent borders."
							})] }), /* @__PURE__ */ jsx(Switch, {
								checked: editForm.data.is_popular,
								onCheckedChange: (val) => editForm.setData("is_popular", val)
							})]
						}),
						/* @__PURE__ */ jsxs(DialogFooter, { children: [/* @__PURE__ */ jsx(Button, {
							type: "button",
							variant: "outline",
							onClick: () => setEditingPlan(null),
							children: "Cancel"
						}), /* @__PURE__ */ jsx(Button, {
							type: "submit",
							disabled: editForm.processing,
							children: editForm.processing ? "Saving..." : "Save Modifications"
						})] })
					]
				})] })
			}),
			/* @__PURE__ */ jsx(AlertDialog, {
				open: !!planToDelete,
				onOpenChange: (open) => !open && setPlanToDelete(null),
				children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [/* @__PURE__ */ jsxs(AlertDialogHeader, { children: [/* @__PURE__ */ jsx(AlertDialogTitle, { children: "Purge Commercial Tier?" }), /* @__PURE__ */ jsxs(AlertDialogDescription, { children: [
					"Are you certain you wish to purge tier",
					" ",
					/* @__PURE__ */ jsx("span", {
						className: "text-white font-semibold",
						children: planToDelete?.name
					}),
					"?"
				] })] }), /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [/* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancel" }), /* @__PURE__ */ jsx(AlertDialogAction, {
					onClick: handleDelete,
					children: "Purge"
				})] })] })
			})
		]
	});
}
//#endregion
export { PricingIndex as default };
