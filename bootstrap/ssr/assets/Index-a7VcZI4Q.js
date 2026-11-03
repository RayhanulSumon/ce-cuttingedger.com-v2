import { a as DropdownMenuTrigger, i as DropdownMenuItem, n as DropdownMenu, r as DropdownMenuContent, t as AdminLayout } from "./AdminLayout-B_omIhRP.js";
import { n as Button, t as Input } from "./input-lL3MBuxn.js";
import { t as AdminPageHeader } from "./AdminPageHeader-BLzCfjWe.js";
import { t as AdminDataTable } from "./AdminDataTable-DkjiIkNz.js";
import { t as Textarea } from "./textarea-DNOgnKpG.js";
import { t as Badge } from "./badge-BgjwAGBP.js";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-C4D4ccTI.js";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-D8hTrlnh.js";
import { t as Switch } from "./switch-7-Y_VisU.js";
import { useState } from "react";
import { router, useForm } from "@inertiajs/react";
import { Edit, MoreHorizontal, Star, Trash2 } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Admin/Testimonials/Index.tsx
function TestimonialsIndex({ testimonials = [] }) {
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [editingItem, setEditingItem] = useState(null);
	const [itemToDelete, setItemToDelete] = useState(null);
	const createForm = useForm({
		client_name: "",
		client_role: "",
		client_company: "",
		quote: "",
		rating: 5,
		featured: true,
		avatar: "/images/team/member-1.jpg"
	});
	const editForm = useForm({
		client_name: "",
		client_role: "",
		client_company: "",
		quote: "",
		rating: 5,
		featured: true,
		avatar: ""
	});
	const handleCreate = (e) => {
		e.preventDefault();
		createForm.post(route("admin.testimonials.store"), { onSuccess: () => {
			setIsCreateOpen(false);
			createForm.reset();
		} });
	};
	const openEdit = (t) => {
		setEditingItem(t);
		editForm.setData({
			client_name: t.client_name,
			client_role: t.client_role,
			client_company: t.client_company,
			quote: t.quote,
			rating: t.rating,
			featured: t.featured,
			avatar: t.avatar || ""
		});
	};
	const handleUpdate = (e) => {
		e.preventDefault();
		if (!editingItem) return;
		editForm.put(route("admin.testimonials.update", editingItem.id), { onSuccess: () => {
			setEditingItem(null);
			editForm.reset();
		} });
	};
	const handleDelete = () => {
		if (!itemToDelete) return;
		router.delete(route("admin.testimonials.destroy", itemToDelete.id), { onSuccess: () => setItemToDelete(null) });
	};
	return /* @__PURE__ */ jsxs(AdminLayout, {
		title: "CLIENT ENDORSEMENTS",
		children: [
			/* @__PURE__ */ jsx(AdminPageHeader, {
				title: "Client Testimonials",
				description: "Verified enterprise endorsements and client feedback accolades.",
				actionLabel: "Add Endorsement",
				onActionClick: () => setIsCreateOpen(true)
			}),
			/* @__PURE__ */ jsx(AdminDataTable, {
				columns: [
					{
						header: "ENDORSER / CLIENT",
						cell: (t) => /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
							className: "font-semibold text-white",
							children: t.client_name
						}), /* @__PURE__ */ jsxs("div", {
							className: "text-xs text-neutral-400 font-mono",
							children: [
								t.client_role,
								" • ",
								t.client_company
							]
						})] })
					},
					{
						header: "STATEMENT",
						cell: (t) => /* @__PURE__ */ jsxs("div", {
							className: "text-xs text-neutral-300 max-w-md truncate italic",
							children: [
								"\"",
								t.quote,
								"\""
							]
						})
					},
					{
						header: "RATING",
						cell: (t) => /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-1 text-accent",
							children: [/* @__PURE__ */ jsx(Star, { className: "w-3.5 h-3.5 fill-current" }), /* @__PURE__ */ jsxs("span", {
								className: "font-mono text-xs",
								children: [t.rating, ".0"]
							})]
						})
					},
					{
						header: "STATUS",
						cell: (t) => t.featured ? /* @__PURE__ */ jsx(Badge, {
							variant: "accent",
							children: "FEATURED"
						}) : /* @__PURE__ */ jsx(Badge, {
							variant: "outline",
							children: "ARCHIVE"
						})
					},
					{
						header: "",
						className: "text-right",
						cell: (t) => /* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
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
								onClick: () => openEdit(t),
								className: "gap-2",
								children: [/* @__PURE__ */ jsx(Edit, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Edit Testimonial" })]
							}), /* @__PURE__ */ jsxs(DropdownMenuItem, {
								onClick: () => setItemToDelete(t),
								className: "gap-2 text-rose-400 focus:text-rose-400",
								children: [/* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Purge Testimonial" })]
							})]
						})] })
					}
				],
				data: testimonials,
				searchKey: "client_name",
				searchPlaceholder: "Search endorsers by name..."
			}),
			/* @__PURE__ */ jsx(Dialog, {
				open: isCreateOpen,
				onOpenChange: setIsCreateOpen,
				children: /* @__PURE__ */ jsxs(DialogContent, { children: [/* @__PURE__ */ jsxs(DialogHeader, { children: [/* @__PURE__ */ jsx(DialogTitle, { children: "Record Client Endorsement" }), /* @__PURE__ */ jsx(DialogDescription, { children: "Testimonial quote, client credentials, and rating score." })] }), /* @__PURE__ */ jsxs("form", {
					onSubmit: handleCreate,
					className: "space-y-4 pt-2",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-2 gap-4",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-mono uppercase text-neutral-400",
									children: "Client Name"
								}), /* @__PURE__ */ jsx(Input, {
									value: createForm.data.client_name,
									onChange: (e) => createForm.setData("client_name", e.target.value),
									placeholder: "e.g. Marc Jacobs",
									required: true
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-mono uppercase text-neutral-400",
									children: "Company"
								}), /* @__PURE__ */ jsx(Input, {
									value: createForm.data.client_company,
									onChange: (e) => createForm.setData("client_company", e.target.value),
									placeholder: "e.g. Acme Corp",
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
									children: "Role / Designation"
								}), /* @__PURE__ */ jsx(Input, {
									value: createForm.data.client_role,
									onChange: (e) => createForm.setData("client_role", e.target.value),
									placeholder: "e.g. VP of Product",
									required: true
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-mono uppercase text-neutral-400",
									children: "Star Rating (1 - 5)"
								}), /* @__PURE__ */ jsx(Input, {
									type: "number",
									min: 1,
									max: 5,
									value: createForm.data.rating,
									onChange: (e) => createForm.setData("rating", Number(e.target.value))
								})]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ jsx("label", {
								className: "text-xs font-mono uppercase text-neutral-400",
								children: "Testimonial Quote"
							}), /* @__PURE__ */ jsx(Textarea, {
								value: createForm.data.quote,
								onChange: (e) => createForm.setData("quote", e.target.value),
								placeholder: "Impactful client statement...",
								required: true
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
								className: "text-xs font-semibold text-white block",
								children: "Featured Endorsement"
							}), /* @__PURE__ */ jsx("span", {
								className: "text-[11px] text-neutral-400 block",
								children: "Display in public testimonial carousels."
							})] }), /* @__PURE__ */ jsx(Switch, {
								checked: createForm.data.featured,
								onCheckedChange: (val) => createForm.setData("featured", val)
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
							children: createForm.processing ? "Saving..." : "Record"
						})] })
					]
				})] })
			}),
			/* @__PURE__ */ jsx(Dialog, {
				open: !!editingItem,
				onOpenChange: (open) => !open && setEditingItem(null),
				children: /* @__PURE__ */ jsxs(DialogContent, { children: [/* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Edit Client Endorsement" }) }), /* @__PURE__ */ jsxs("form", {
					onSubmit: handleUpdate,
					className: "space-y-4 pt-2",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-2 gap-4",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-mono uppercase text-neutral-400",
									children: "Client Name"
								}), /* @__PURE__ */ jsx(Input, {
									value: editForm.data.client_name,
									onChange: (e) => editForm.setData("client_name", e.target.value),
									required: true
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-mono uppercase text-neutral-400",
									children: "Company"
								}), /* @__PURE__ */ jsx(Input, {
									value: editForm.data.client_company,
									onChange: (e) => editForm.setData("client_company", e.target.value),
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
									children: "Role / Designation"
								}), /* @__PURE__ */ jsx(Input, {
									value: editForm.data.client_role,
									onChange: (e) => editForm.setData("client_role", e.target.value),
									required: true
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-mono uppercase text-neutral-400",
									children: "Star Rating (1 - 5)"
								}), /* @__PURE__ */ jsx(Input, {
									type: "number",
									min: 1,
									max: 5,
									value: editForm.data.rating,
									onChange: (e) => editForm.setData("rating", Number(e.target.value))
								})]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ jsx("label", {
								className: "text-xs font-mono uppercase text-neutral-400",
								children: "Testimonial Quote"
							}), /* @__PURE__ */ jsx(Textarea, {
								value: editForm.data.quote,
								onChange: (e) => editForm.setData("quote", e.target.value),
								required: true
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
								className: "text-xs font-semibold text-white block",
								children: "Featured Endorsement"
							}), /* @__PURE__ */ jsx("span", {
								className: "text-[11px] text-neutral-400 block",
								children: "Display in public testimonial carousels."
							})] }), /* @__PURE__ */ jsx(Switch, {
								checked: editForm.data.featured,
								onCheckedChange: (val) => editForm.setData("featured", val)
							})]
						}),
						/* @__PURE__ */ jsxs(DialogFooter, { children: [/* @__PURE__ */ jsx(Button, {
							type: "button",
							variant: "outline",
							onClick: () => setEditingItem(null),
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
				open: !!itemToDelete,
				onOpenChange: (open) => !open && setItemToDelete(null),
				children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [/* @__PURE__ */ jsxs(AlertDialogHeader, { children: [/* @__PURE__ */ jsx(AlertDialogTitle, { children: "Purge Endorsement?" }), /* @__PURE__ */ jsxs(AlertDialogDescription, { children: [
					"Are you certain you wish to purge feedback from",
					" ",
					/* @__PURE__ */ jsx("span", {
						className: "text-white font-semibold",
						children: itemToDelete?.client_name
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
export { TestimonialsIndex as default };
