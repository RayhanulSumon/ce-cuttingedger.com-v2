import { a as DropdownMenuItem, i as DropdownMenuContent, n as AdminLayout, o as DropdownMenuTrigger, r as DropdownMenu, t as AdminPageHeader } from "./AdminPageHeader-BF3p_UDa.js";
import { n as Button, t as Input } from "./input-lL3MBuxn.js";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, l as AdminDataTable, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-DsbEgc5R.js";
import { t as Textarea } from "./textarea-DNOgnKpG.js";
import { t as Badge } from "./badge-BgjwAGBP.js";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-C4D4ccTI.js";
import { t as Switch } from "./switch-7-Y_VisU.js";
import { useState } from "react";
import { router, useForm } from "@inertiajs/react";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Admin/Careers/Index.tsx
function CareersIndex({ careers = [] }) {
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [editingRole, setEditingRole] = useState(null);
	const [roleToDelete, setRoleToDelete] = useState(null);
	const createForm = useForm({
		title: "",
		department: "Engineering",
		location_type: "Remote",
		experience_level: "Senior",
		overview: "",
		is_open: true
	});
	const editForm = useForm({
		title: "",
		department: "",
		location_type: "",
		experience_level: "",
		overview: "",
		is_open: true
	});
	const handleCreate = (e) => {
		e.preventDefault();
		createForm.post(route("admin.careers.store"), { onSuccess: () => {
			setIsCreateOpen(false);
			createForm.reset();
		} });
	};
	const openEdit = (c) => {
		setEditingRole(c);
		editForm.setData({
			title: c.title,
			department: c.department,
			location_type: c.location_type,
			experience_level: c.experience_level,
			overview: c.overview,
			is_open: c.is_open
		});
	};
	const handleUpdate = (e) => {
		e.preventDefault();
		if (!editingRole) return;
		editForm.put(route("admin.careers.update", editingRole.id), { onSuccess: () => {
			setEditingRole(null);
			editForm.reset();
		} });
	};
	const handleDelete = () => {
		if (!roleToDelete) return;
		router.delete(route("admin.careers.destroy", roleToDelete.id), { onSuccess: () => setRoleToDelete(null) });
	};
	return /* @__PURE__ */ jsxs(AdminLayout, {
		title: "TALENT & CAREERS",
		children: [
			/* @__PURE__ */ jsx(AdminPageHeader, {
				title: "Career Openings",
				description: "Manage open disciplines, remote engineering billets, and creative auditions.",
				actionLabel: "Create Opening",
				onActionClick: () => setIsCreateOpen(true)
			}),
			/* @__PURE__ */ jsx(AdminDataTable, {
				columns: [
					{
						header: "POSITION / ROLE",
						cell: (c) => /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
							className: "font-semibold text-white",
							children: c.title
						}), /* @__PURE__ */ jsxs("div", {
							className: "text-xs text-neutral-400 font-mono",
							children: [
								c.department,
								" • ",
								c.location_type
							]
						})] })
					},
					{
						header: "LEVEL",
						cell: (c) => /* @__PURE__ */ jsx(Badge, {
							variant: "outline",
							children: c.experience_level
						})
					},
					{
						header: "STATUS",
						cell: (c) => c.is_open ? /* @__PURE__ */ jsx(Badge, {
							variant: "success",
							children: "RECRUITING"
						}) : /* @__PURE__ */ jsx(Badge, {
							variant: "secondary",
							children: "CLOSED"
						})
					},
					{
						header: "",
						className: "text-right",
						cell: (c) => /* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
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
								onClick: () => openEdit(c),
								className: "gap-2",
								children: [/* @__PURE__ */ jsx(Edit, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Edit Opening" })]
							}), /* @__PURE__ */ jsxs(DropdownMenuItem, {
								onClick: () => setRoleToDelete(c),
								className: "gap-2 text-rose-400 focus:text-rose-400",
								children: [/* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Purge Opening" })]
							})]
						})] })
					}
				],
				data: careers,
				searchKey: "title",
				searchPlaceholder: "Search career roles..."
			}),
			/* @__PURE__ */ jsx(Dialog, {
				open: isCreateOpen,
				onOpenChange: setIsCreateOpen,
				children: /* @__PURE__ */ jsxs(DialogContent, { children: [/* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Open New Career Billet" }) }), /* @__PURE__ */ jsxs("form", {
					onSubmit: handleCreate,
					className: "space-y-4 pt-2",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ jsx("label", {
								className: "text-xs font-mono uppercase text-neutral-400",
								children: "Position Title"
							}), /* @__PURE__ */ jsx(Input, {
								value: createForm.data.title,
								onChange: (e) => createForm.setData("title", e.target.value),
								placeholder: "e.g. Lead WebGL Shader Engineer",
								required: true
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-3 gap-4",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ jsx("label", {
										className: "text-xs font-mono uppercase text-neutral-400",
										children: "Department"
									}), /* @__PURE__ */ jsx(Input, {
										value: createForm.data.department,
										onChange: (e) => createForm.setData("department", e.target.value),
										required: true
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ jsx("label", {
										className: "text-xs font-mono uppercase text-neutral-400",
										children: "Location"
									}), /* @__PURE__ */ jsx(Input, {
										value: createForm.data.location_type,
										onChange: (e) => createForm.setData("location_type", e.target.value),
										required: true
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ jsx("label", {
										className: "text-xs font-mono uppercase text-neutral-400",
										children: "Experience"
									}), /* @__PURE__ */ jsx(Input, {
										value: createForm.data.experience_level,
										onChange: (e) => createForm.setData("experience_level", e.target.value),
										required: true
									})]
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ jsx("label", {
								className: "text-xs font-mono uppercase text-neutral-400",
								children: "Position Overview"
							}), /* @__PURE__ */ jsx(Textarea, {
								value: createForm.data.overview,
								onChange: (e) => createForm.setData("overview", e.target.value),
								placeholder: "High-impact mission brief for candidates...",
								required: true
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
								className: "text-xs font-semibold text-white block",
								children: "Recruiting Status"
							}), /* @__PURE__ */ jsx("span", {
								className: "text-[11px] text-neutral-400 block",
								children: "Active for public applications."
							})] }), /* @__PURE__ */ jsx(Switch, {
								checked: createForm.data.is_open,
								onCheckedChange: (val) => createForm.setData("is_open", val)
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
							children: createForm.processing ? "Publishing..." : "Publish Opening"
						})] })
					]
				})] })
			}),
			/* @__PURE__ */ jsx(Dialog, {
				open: !!editingRole,
				onOpenChange: (open) => !open && setEditingRole(null),
				children: /* @__PURE__ */ jsxs(DialogContent, { children: [/* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Edit Career Opening" }) }), /* @__PURE__ */ jsxs("form", {
					onSubmit: handleUpdate,
					className: "space-y-4 pt-2",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ jsx("label", {
								className: "text-xs font-mono uppercase text-neutral-400",
								children: "Position Title"
							}), /* @__PURE__ */ jsx(Input, {
								value: editForm.data.title,
								onChange: (e) => editForm.setData("title", e.target.value),
								required: true
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-3 gap-4",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ jsx("label", {
										className: "text-xs font-mono uppercase text-neutral-400",
										children: "Department"
									}), /* @__PURE__ */ jsx(Input, {
										value: editForm.data.department,
										onChange: (e) => editForm.setData("department", e.target.value),
										required: true
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ jsx("label", {
										className: "text-xs font-mono uppercase text-neutral-400",
										children: "Location"
									}), /* @__PURE__ */ jsx(Input, {
										value: editForm.data.location_type,
										onChange: (e) => editForm.setData("location_type", e.target.value),
										required: true
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ jsx("label", {
										className: "text-xs font-mono uppercase text-neutral-400",
										children: "Experience"
									}), /* @__PURE__ */ jsx(Input, {
										value: editForm.data.experience_level,
										onChange: (e) => editForm.setData("experience_level", e.target.value),
										required: true
									})]
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ jsx("label", {
								className: "text-xs font-mono uppercase text-neutral-400",
								children: "Position Overview"
							}), /* @__PURE__ */ jsx(Textarea, {
								value: editForm.data.overview,
								onChange: (e) => editForm.setData("overview", e.target.value),
								required: true
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
								className: "text-xs font-semibold text-white block",
								children: "Recruiting Status"
							}), /* @__PURE__ */ jsx("span", {
								className: "text-[11px] text-neutral-400 block",
								children: "Active for public applications."
							})] }), /* @__PURE__ */ jsx(Switch, {
								checked: editForm.data.is_open,
								onCheckedChange: (val) => editForm.setData("is_open", val)
							})]
						}),
						/* @__PURE__ */ jsxs(DialogFooter, { children: [/* @__PURE__ */ jsx(Button, {
							type: "button",
							variant: "outline",
							onClick: () => setEditingRole(null),
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
				open: !!roleToDelete,
				onOpenChange: (open) => !open && setRoleToDelete(null),
				children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [/* @__PURE__ */ jsxs(AlertDialogHeader, { children: [/* @__PURE__ */ jsx(AlertDialogTitle, { children: "Purge Career Opening?" }), /* @__PURE__ */ jsxs(AlertDialogDescription, { children: [
					"Are you certain you want to purge opening",
					" ",
					/* @__PURE__ */ jsx("span", {
						className: "text-white font-semibold",
						children: roleToDelete?.title
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
export { CareersIndex as default };
