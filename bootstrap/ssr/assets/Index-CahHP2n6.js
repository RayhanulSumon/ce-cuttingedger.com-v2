import { a as DropdownMenuItem, i as DropdownMenuContent, n as AdminLayout, o as DropdownMenuTrigger, r as DropdownMenu, t as AdminPageHeader } from "./AdminPageHeader-BF3p_UDa.js";
import { n as Button, t as Input } from "./input-lL3MBuxn.js";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, l as AdminDataTable, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-DsbEgc5R.js";
import { t as Textarea } from "./textarea-DNOgnKpG.js";
import { t as Badge } from "./badge-BgjwAGBP.js";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-C4D4ccTI.js";
import { useState } from "react";
import { router, useForm } from "@inertiajs/react";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Admin/Services/Index.tsx
function ServicesIndex({ services = [], parentServices = [] }) {
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [editingService, setEditingService] = useState(null);
	const [serviceToDelete, setServiceToDelete] = useState(null);
	const createForm = useForm({
		parent_id: "",
		title: "",
		marquee_label: "",
		subtitle: "",
		description: "",
		icon: "Layers",
		accent_color: "#f5a623",
		sort_order: 0
	});
	const editForm = useForm({
		parent_id: "",
		title: "",
		marquee_label: "",
		subtitle: "",
		description: "",
		icon: "Layers",
		accent_color: "#f5a623",
		sort_order: 0
	});
	const handleCreate = (e) => {
		e.preventDefault();
		createForm.post(route("admin.services.store"), { onSuccess: () => {
			setIsCreateOpen(false);
			createForm.reset();
		} });
	};
	const openEdit = (service) => {
		setEditingService(service);
		editForm.setData({
			parent_id: service.parent_id || "",
			title: service.title,
			marquee_label: service.marquee_label,
			subtitle: service.subtitle,
			description: service.description,
			icon: service.icon || "Layers",
			accent_color: service.accent_color || "#f5a623",
			sort_order: service.sort_order
		});
	};
	const handleUpdate = (e) => {
		e.preventDefault();
		if (!editingService) return;
		editForm.put(route("admin.services.update", editingService.id), { onSuccess: () => {
			setEditingService(null);
			editForm.reset();
		} });
	};
	const handleDelete = () => {
		if (!serviceToDelete) return;
		router.delete(route("admin.services.destroy", serviceToDelete.id), { onSuccess: () => setServiceToDelete(null) });
	};
	return /* @__PURE__ */ jsxs(AdminLayout, {
		title: "DISCIPLINES & CAPABILITIES",
		children: [
			/* @__PURE__ */ jsx(AdminPageHeader, {
				title: "Services Management",
				description: "Govern studio engineering disciplines, kinetic branding modules, and deliverables.",
				actionLabel: "Create Discipline",
				onActionClick: () => setIsCreateOpen(true)
			}),
			/* @__PURE__ */ jsx(AdminDataTable, {
				columns: [
					{
						header: "DISCIPLINE / SERVICE",
						cell: (s) => /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ jsx("div", {
								className: "w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-black shrink-0",
								style: {
									backgroundColor: `${s.accent_color || "#f5a623"}20`,
									color: s.accent_color || "#f5a623",
									border: `1px solid ${s.accent_color || "#f5a623"}40`
								},
								children: s.icon?.substring(0, 2).toUpperCase()
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
								className: "font-semibold text-white",
								children: s.title
							}), /* @__PURE__ */ jsx("div", {
								className: "text-xs text-neutral-400 font-mono",
								children: s.subtitle
							})] })]
						})
					},
					{
						header: "PILLAR / HIERARCHY",
						cell: (s) => s.parent ? /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-1.5 font-mono text-xs text-neutral-300",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-accent",
								children: "↳"
							}), /* @__PURE__ */ jsx("span", {
								className: "font-semibold",
								children: s.parent.title
							})]
						}) : /* @__PURE__ */ jsx("span", {
							className: "px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-accent/10 text-accent border border-accent/30 whitespace-nowrap",
							children: "★ CORE PILLAR"
						})
					},
					{
						header: "MARQUEE LABEL",
						cell: (s) => /* @__PURE__ */ jsx(Badge, {
							variant: "outline",
							className: "font-mono",
							children: s.marquee_label
						})
					},
					{
						header: "ACCENT TONE",
						cell: (s) => /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx("span", {
								className: "w-3.5 h-3.5 rounded-full border border-white/20",
								style: { backgroundColor: s.accent_color || "#f5a623" }
							}), /* @__PURE__ */ jsx("span", {
								className: "font-mono text-xs text-neutral-300",
								children: s.accent_color || "#f5a623"
							})]
						})
					},
					{
						header: "ORDER",
						cell: (s) => /* @__PURE__ */ jsxs("span", {
							className: "font-mono text-xs text-neutral-400",
							children: ["#", s.sort_order]
						})
					},
					{
						header: "",
						className: "text-right",
						cell: (s) => /* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
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
								onClick: () => openEdit(s),
								className: "gap-2",
								children: [/* @__PURE__ */ jsx(Edit, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Edit Discipline" })]
							}), /* @__PURE__ */ jsxs(DropdownMenuItem, {
								onClick: () => setServiceToDelete(s),
								className: "gap-2 text-rose-400 focus:text-rose-400",
								children: [/* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Delete Discipline" })]
							})]
						})] })
					}
				],
				data: services,
				searchKey: "title",
				searchPlaceholder: "Search services..."
			}),
			/* @__PURE__ */ jsx(Dialog, {
				open: isCreateOpen,
				onOpenChange: setIsCreateOpen,
				children: /* @__PURE__ */ jsxs(DialogContent, { children: [/* @__PURE__ */ jsxs(DialogHeader, { children: [/* @__PURE__ */ jsx(DialogTitle, { children: "Commission New Discipline" }), /* @__PURE__ */ jsx(DialogDescription, { children: "Define service taxonomy, marquee titles, and accents." })] }), /* @__PURE__ */ jsxs("form", {
					onSubmit: handleCreate,
					className: "space-y-4 pt-2",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5 p-3 rounded-xl bg-white/[0.04] border border-white/10",
							children: [
								/* @__PURE__ */ jsx("label", {
									className: "text-xs font-mono uppercase text-accent font-bold block",
									children: "Service Parent Pillar (Hierarchy)"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-[11px] text-neutral-400",
									children: "Leave as \"Top-Level Core Pillar\" for primary disciplines, or select a parent to create a specialized child sub-service."
								}),
								/* @__PURE__ */ jsxs("select", {
									value: createForm.data.parent_id,
									onChange: (e) => createForm.setData("parent_id", e.target.value === "" ? "" : Number(e.target.value)),
									className: "w-full h-9 rounded-md bg-neutral-900 border border-white/15 text-xs text-white px-3 font-mono",
									children: [/* @__PURE__ */ jsx("option", {
										value: "",
										children: "★ Top-Level Core Pillar (No Parent)"
									}), parentServices.map((p) => /* @__PURE__ */ jsxs("option", {
										value: p.id,
										children: ["↳ Sub-service of: ", p.title]
									}, p.id))]
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ jsx("label", {
								className: "text-xs font-mono uppercase text-neutral-400",
								children: "Discipline Title"
							}), /* @__PURE__ */ jsx(Input, {
								value: createForm.data.title,
								onChange: (e) => createForm.setData("title", e.target.value),
								placeholder: "e.g. 3D Generative Realtime",
								required: true
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-2 gap-4",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-mono uppercase text-neutral-400",
									children: "Marquee Ribbon Label"
								}), /* @__PURE__ */ jsx(Input, {
									value: createForm.data.marquee_label,
									onChange: (e) => createForm.setData("marquee_label", e.target.value),
									placeholder: "e.g. WEBGL // SHADERS",
									required: true
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-mono uppercase text-neutral-400",
									children: "Icon Token"
								}), /* @__PURE__ */ jsx(Input, {
									value: createForm.data.icon,
									onChange: (e) => createForm.setData("icon", e.target.value),
									placeholder: "Layers",
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
									children: "Accent Hex Color"
								}), /* @__PURE__ */ jsx(Input, {
									value: createForm.data.accent_color,
									onChange: (e) => createForm.setData("accent_color", e.target.value),
									placeholder: "#f5a623"
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-mono uppercase text-neutral-400",
									children: "Sort Order"
								}), /* @__PURE__ */ jsx(Input, {
									type: "number",
									value: createForm.data.sort_order,
									onChange: (e) => createForm.setData("sort_order", Number(e.target.value))
								})]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ jsx("label", {
								className: "text-xs font-mono uppercase text-neutral-400",
								children: "Subtitle / Hook"
							}), /* @__PURE__ */ jsx(Input, {
								value: createForm.data.subtitle,
								onChange: (e) => createForm.setData("subtitle", e.target.value),
								placeholder: "e.g. Kinetic web architectures engineered for scale",
								required: true
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ jsx("label", {
								className: "text-xs font-mono uppercase text-neutral-400",
								children: "In-Depth Description"
							}), /* @__PURE__ */ jsx(Textarea, {
								value: createForm.data.description,
								onChange: (e) => createForm.setData("description", e.target.value),
								placeholder: "Full capability overview...",
								required: true
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
							children: createForm.processing ? "Commissioning..." : "Commission"
						})] })
					]
				})] })
			}),
			/* @__PURE__ */ jsx(Dialog, {
				open: !!editingService,
				onOpenChange: (open) => !open && setEditingService(null),
				children: /* @__PURE__ */ jsxs(DialogContent, { children: [/* @__PURE__ */ jsxs(DialogHeader, { children: [/* @__PURE__ */ jsx(DialogTitle, { children: "Edit Discipline" }), /* @__PURE__ */ jsx(DialogDescription, { children: "Revise capability metadata, palette, or order." })] }), /* @__PURE__ */ jsxs("form", {
					onSubmit: handleUpdate,
					className: "space-y-4 pt-2",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5 p-3 rounded-xl bg-white/[0.04] border border-white/10",
							children: [
								/* @__PURE__ */ jsx("label", {
									className: "text-xs font-mono uppercase text-accent font-bold block",
									children: "Service Parent Pillar (Hierarchy)"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-[11px] text-neutral-400",
									children: "Leave as \"Top-Level Core Pillar\" for primary disciplines, or select a parent to nest under a pillar."
								}),
								/* @__PURE__ */ jsxs("select", {
									value: editForm.data.parent_id,
									onChange: (e) => editForm.setData("parent_id", e.target.value === "" ? "" : Number(e.target.value)),
									className: "w-full h-9 rounded-md bg-neutral-900 border border-white/15 text-xs text-white px-3 font-mono",
									children: [/* @__PURE__ */ jsx("option", {
										value: "",
										children: "★ Top-Level Core Pillar (No Parent)"
									}), parentServices.filter((p) => p.id !== editingService?.id).map((p) => /* @__PURE__ */ jsxs("option", {
										value: p.id,
										children: ["↳ Sub-service of: ", p.title]
									}, p.id))]
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ jsx("label", {
								className: "text-xs font-mono uppercase text-neutral-400",
								children: "Discipline Title"
							}), /* @__PURE__ */ jsx(Input, {
								value: editForm.data.title,
								onChange: (e) => editForm.setData("title", e.target.value),
								required: true
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-2 gap-4",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-mono uppercase text-neutral-400",
									children: "Marquee Ribbon Label"
								}), /* @__PURE__ */ jsx(Input, {
									value: editForm.data.marquee_label,
									onChange: (e) => editForm.setData("marquee_label", e.target.value),
									required: true
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-mono uppercase text-neutral-400",
									children: "Icon Token"
								}), /* @__PURE__ */ jsx(Input, {
									value: editForm.data.icon,
									onChange: (e) => editForm.setData("icon", e.target.value),
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
									children: "Accent Hex Color"
								}), /* @__PURE__ */ jsx(Input, {
									value: editForm.data.accent_color,
									onChange: (e) => editForm.setData("accent_color", e.target.value)
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-mono uppercase text-neutral-400",
									children: "Sort Order"
								}), /* @__PURE__ */ jsx(Input, {
									type: "number",
									value: editForm.data.sort_order,
									onChange: (e) => editForm.setData("sort_order", Number(e.target.value))
								})]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ jsx("label", {
								className: "text-xs font-mono uppercase text-neutral-400",
								children: "Subtitle / Hook"
							}), /* @__PURE__ */ jsx(Input, {
								value: editForm.data.subtitle,
								onChange: (e) => editForm.setData("subtitle", e.target.value),
								required: true
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ jsx("label", {
								className: "text-xs font-mono uppercase text-neutral-400",
								children: "In-Depth Description"
							}), /* @__PURE__ */ jsx(Textarea, {
								value: editForm.data.description,
								onChange: (e) => editForm.setData("description", e.target.value),
								required: true
							})]
						}),
						/* @__PURE__ */ jsxs(DialogFooter, { children: [/* @__PURE__ */ jsx(Button, {
							type: "button",
							variant: "outline",
							onClick: () => setEditingService(null),
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
				open: !!serviceToDelete,
				onOpenChange: (open) => !open && setServiceToDelete(null),
				children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [/* @__PURE__ */ jsxs(AlertDialogHeader, { children: [/* @__PURE__ */ jsx(AlertDialogTitle, { children: "Purge Discipline?" }), /* @__PURE__ */ jsxs(AlertDialogDescription, { children: [
					"Are you certain you want to remove discipline",
					" ",
					/* @__PURE__ */ jsx("span", {
						className: "text-white font-semibold",
						children: serviceToDelete?.title
					}),
					"?"
				] })] }), /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [/* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancel" }), /* @__PURE__ */ jsx(AlertDialogAction, {
					onClick: handleDelete,
					children: "Purge Discipline"
				})] })] })
			})
		]
	});
}
//#endregion
export { ServicesIndex as default };
