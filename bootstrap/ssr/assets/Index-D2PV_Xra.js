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
import { Edit, ExternalLink, MoreHorizontal, Trash2 } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Admin/Team/Index.tsx
function TeamIndex({ team = [] }) {
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [editingMember, setEditingMember] = useState(null);
	const [memberToDelete, setMemberToDelete] = useState(null);
	const createForm = useForm({
		name: "",
		email: "",
		role: "",
		bio: "",
		avatar: "/images/team/member-1.jpg",
		since_year: 2022,
		featured: true,
		sort_order: 0
	});
	const editForm = useForm({
		name: "",
		email: "",
		role: "",
		bio: "",
		avatar: "",
		since_year: 2022,
		featured: true,
		sort_order: 0
	});
	const handleCreate = (e) => {
		e.preventDefault();
		createForm.post(route("admin.team.store"), { onSuccess: () => {
			setIsCreateOpen(false);
			createForm.reset();
		} });
	};
	const openEdit = (m) => {
		setEditingMember(m);
		editForm.setData({
			name: m.name,
			email: m.email || "",
			role: m.role,
			bio: m.bio,
			avatar: m.avatar,
			since_year: m.since_year,
			featured: m.featured,
			sort_order: m.sort_order
		});
	};
	const handleUpdate = (e) => {
		e.preventDefault();
		if (!editingMember) return;
		editForm.put(route("admin.team.update", editingMember.id), { onSuccess: () => {
			setEditingMember(null);
			editForm.reset();
		} });
	};
	const handleDelete = () => {
		if (!memberToDelete) return;
		router.delete(route("admin.team.destroy", memberToDelete.id), { onSuccess: () => setMemberToDelete(null) });
	};
	return /* @__PURE__ */ jsxs(AdminLayout, {
		title: "CREW & OPERATIVES",
		children: [
			/* @__PURE__ */ jsx(AdminPageHeader, {
				title: "Team Members",
				description: "Governs studio leaders, kinetic designers, and creative technologist profiles.",
				actionLabel: "Add Operative",
				onActionClick: () => setIsCreateOpen(true)
			}),
			/* @__PURE__ */ jsx(AdminDataTable, {
				columns: [
					{
						header: "CREW MEMBER",
						cell: (m) => /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ jsx("img", {
								src: m.avatar,
								alt: m.name,
								className: "w-9 h-9 rounded-full object-cover bg-neutral-900 border border-white/10",
								onError: (e) => {
									e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80";
								}
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
								className: "font-semibold text-white",
								children: m.name
							}), /* @__PURE__ */ jsx("div", {
								className: "text-xs text-neutral-400 font-mono",
								children: m.role
							})] })]
						})
					},
					{
						header: "TENURE",
						cell: (m) => /* @__PURE__ */ jsxs("span", {
							className: "font-mono text-xs text-neutral-400",
							children: ["Since ", m.since_year]
						})
					},
					{
						header: "STATUS",
						cell: (m) => m.featured ? /* @__PURE__ */ jsx(Badge, {
							variant: "accent",
							children: "FEATURED"
						}) : /* @__PURE__ */ jsx(Badge, {
							variant: "outline",
							children: "CREW"
						})
					},
					{
						header: "ORDER",
						cell: (m) => /* @__PURE__ */ jsxs("span", {
							className: "font-mono text-xs text-neutral-400",
							children: ["#", m.sort_order]
						})
					},
					{
						header: "",
						className: "text-right",
						cell: (m) => /* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
							asChild: true,
							children: /* @__PURE__ */ jsx(Button, {
								variant: "ghost",
								size: "icon",
								className: "h-8 w-8 text-neutral-400 hover:text-white",
								children: /* @__PURE__ */ jsx(MoreHorizontal, { className: "h-4 w-4" })
							})
						}), /* @__PURE__ */ jsxs(DropdownMenuContent, {
							align: "end",
							children: [
								/* @__PURE__ */ jsx(DropdownMenuItem, {
									asChild: true,
									children: /* @__PURE__ */ jsxs("a", {
										href: `/team/${m.slug}`,
										target: "_blank",
										rel: "noopener noreferrer",
										className: "gap-2 cursor-pointer",
										children: [/* @__PURE__ */ jsx(ExternalLink, { className: "w-3.5 h-3.5 text-accent" }), /* @__PURE__ */ jsx("span", { children: "View Live Single Page" })]
									})
								}),
								/* @__PURE__ */ jsxs(DropdownMenuItem, {
									onClick: () => openEdit(m),
									className: "gap-2",
									children: [/* @__PURE__ */ jsx(Edit, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Edit Operative" })]
								}),
								/* @__PURE__ */ jsxs(DropdownMenuItem, {
									onClick: () => setMemberToDelete(m),
									className: "gap-2 text-rose-400 focus:text-rose-400",
									children: [/* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Purge Operative" })]
								})
							]
						})] })
					}
				],
				data: team,
				searchKey: "name",
				searchPlaceholder: "Search crew by name..."
			}),
			/* @__PURE__ */ jsx(Dialog, {
				open: isCreateOpen,
				onOpenChange: setIsCreateOpen,
				children: /* @__PURE__ */ jsxs(DialogContent, { children: [/* @__PURE__ */ jsxs(DialogHeader, { children: [/* @__PURE__ */ jsx(DialogTitle, { children: "Commission Crew Member" }), /* @__PURE__ */ jsx(DialogDescription, { children: "Profile details, title, and studio tenure." })] }), /* @__PURE__ */ jsxs("form", {
					onSubmit: handleCreate,
					className: "space-y-4 pt-2",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-2 gap-4",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-mono uppercase text-neutral-400",
									children: "Full Name"
								}), /* @__PURE__ */ jsx(Input, {
									value: createForm.data.name,
									onChange: (e) => createForm.setData("name", e.target.value),
									placeholder: "e.g. Liam Vance",
									required: true
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-mono uppercase text-neutral-400",
									children: "Role / Title"
								}), /* @__PURE__ */ jsx(Input, {
									value: createForm.data.role,
									onChange: (e) => createForm.setData("role", e.target.value),
									placeholder: "e.g. Principal Creative Technologist",
									required: true
								})]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ jsx("label", {
								className: "text-xs font-mono uppercase text-neutral-400",
								children: "Email Address (Private / Internal)"
							}), /* @__PURE__ */ jsx(Input, {
								type: "email",
								value: createForm.data.email,
								onChange: (e) => createForm.setData("email", e.target.value),
								placeholder: "e.g. operative@cuttingedger.com"
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-2 gap-4",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-mono uppercase text-neutral-400",
									children: "Tenure Year"
								}), /* @__PURE__ */ jsx(Input, {
									type: "number",
									value: createForm.data.since_year,
									onChange: (e) => createForm.setData("since_year", Number(e.target.value)),
									required: true
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
								children: "Avatar Asset Path / URL"
							}), /* @__PURE__ */ jsx(Input, {
								value: createForm.data.avatar,
								onChange: (e) => createForm.setData("avatar", e.target.value),
								placeholder: "https://... or /images/team/member-1.jpg",
								required: true
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ jsx("label", {
								className: "text-xs font-mono uppercase text-neutral-400",
								children: "Biography"
							}), /* @__PURE__ */ jsx(Textarea, {
								value: createForm.data.bio,
								onChange: (e) => createForm.setData("bio", e.target.value),
								placeholder: "Short profile background...",
								required: true
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
								className: "text-xs font-semibold text-white block",
								children: "Featured Crew Member"
							}), /* @__PURE__ */ jsx("span", {
								className: "text-[11px] text-neutral-400 block",
								children: "Display in featured team strips across the site."
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
							children: createForm.processing ? "Adding..." : "Add to Crew"
						})] })
					]
				})] })
			}),
			/* @__PURE__ */ jsx(Dialog, {
				open: !!editingMember,
				onOpenChange: (open) => !open && setEditingMember(null),
				children: /* @__PURE__ */ jsxs(DialogContent, { children: [/* @__PURE__ */ jsxs(DialogHeader, { children: [/* @__PURE__ */ jsx(DialogTitle, { children: "Edit Operative Profile" }), /* @__PURE__ */ jsx(DialogDescription, { children: "Revise credentials, role title, and biography." })] }), /* @__PURE__ */ jsxs("form", {
					onSubmit: handleUpdate,
					className: "space-y-4 pt-2",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-2 gap-4",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-mono uppercase text-neutral-400",
									children: "Full Name"
								}), /* @__PURE__ */ jsx(Input, {
									value: editForm.data.name,
									onChange: (e) => editForm.setData("name", e.target.value),
									required: true
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-mono uppercase text-neutral-400",
									children: "Role / Title"
								}), /* @__PURE__ */ jsx(Input, {
									value: editForm.data.role,
									onChange: (e) => editForm.setData("role", e.target.value),
									required: true
								})]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ jsx("label", {
								className: "text-xs font-mono uppercase text-neutral-400",
								children: "Email Address (Private / Internal)"
							}), /* @__PURE__ */ jsx(Input, {
								type: "email",
								value: editForm.data.email,
								onChange: (e) => editForm.setData("email", e.target.value),
								placeholder: "e.g. operative@cuttingedger.com"
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-2 gap-4",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-mono uppercase text-neutral-400",
									children: "Tenure Year"
								}), /* @__PURE__ */ jsx(Input, {
									type: "number",
									value: editForm.data.since_year,
									onChange: (e) => editForm.setData("since_year", Number(e.target.value)),
									required: true
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
								children: "Avatar Asset Path / URL"
							}), /* @__PURE__ */ jsx(Input, {
								value: editForm.data.avatar,
								onChange: (e) => editForm.setData("avatar", e.target.value),
								required: true
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ jsx("label", {
								className: "text-xs font-mono uppercase text-neutral-400",
								children: "Biography"
							}), /* @__PURE__ */ jsx(Textarea, {
								value: editForm.data.bio,
								onChange: (e) => editForm.setData("bio", e.target.value),
								required: true
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
								className: "text-xs font-semibold text-white block",
								children: "Featured Crew Member"
							}), /* @__PURE__ */ jsx("span", {
								className: "text-[11px] text-neutral-400 block",
								children: "Display in featured team strips across the site."
							})] }), /* @__PURE__ */ jsx(Switch, {
								checked: editForm.data.featured,
								onCheckedChange: (val) => editForm.setData("featured", val)
							})]
						}),
						/* @__PURE__ */ jsxs(DialogFooter, { children: [/* @__PURE__ */ jsx(Button, {
							type: "button",
							variant: "outline",
							onClick: () => setEditingMember(null),
							children: "Cancel"
						}), /* @__PURE__ */ jsx(Button, {
							type: "submit",
							disabled: editForm.processing,
							children: editForm.processing ? "Saving..." : "Save Changes"
						})] })
					]
				})] })
			}),
			/* @__PURE__ */ jsx(AlertDialog, {
				open: !!memberToDelete,
				onOpenChange: (open) => !open && setMemberToDelete(null),
				children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [/* @__PURE__ */ jsxs(AlertDialogHeader, { children: [/* @__PURE__ */ jsx(AlertDialogTitle, { children: "Purge Operative?" }), /* @__PURE__ */ jsxs(AlertDialogDescription, { children: [
					"Are you certain you wish to remove",
					" ",
					/* @__PURE__ */ jsx("span", {
						className: "text-white font-semibold",
						children: memberToDelete?.name
					}),
					" ",
					"from the studio roster?"
				] })] }), /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [/* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancel" }), /* @__PURE__ */ jsx(AlertDialogAction, {
					onClick: handleDelete,
					children: "Purge Operative"
				})] })] })
			})
		]
	});
}
//#endregion
export { TeamIndex as default };
