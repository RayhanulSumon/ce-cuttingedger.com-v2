import { a as DropdownMenuItem, i as DropdownMenuContent, n as AdminLayout, o as DropdownMenuTrigger, r as DropdownMenu, t as AdminPageHeader } from "./AdminPageHeader-BF3p_UDa.js";
import { n as Button, t as Input } from "./input-lL3MBuxn.js";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, l as AdminDataTable, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-DsbEgc5R.js";
import { t as Badge } from "./badge-BgjwAGBP.js";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-C4D4ccTI.js";
import { i as SelectItem, n as SelectContent, o as SelectTrigger, s as SelectValue, t as Select } from "./select-DJUEkoYA.js";
import { useState } from "react";
import { router, useForm } from "@inertiajs/react";
import { Edit, MoreHorizontal, Trash2, UserCheck, UserX } from "lucide-react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Admin/Users/Index.tsx
function UsersIndex({ users = [], roles = [] }) {
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [editingUser, setEditingUser] = useState(null);
	const [userToDelete, setUserToDelete] = useState(null);
	const createForm = useForm({
		name: "",
		email: "",
		role_id: roles[0]?.id || 1,
		status: "active",
		password: ""
	});
	const editForm = useForm({
		name: "",
		email: "",
		role_id: 1,
		status: "active",
		password: ""
	});
	const handleCreate = (e) => {
		e.preventDefault();
		createForm.post(route("admin.users.store"), { onSuccess: () => {
			setIsCreateOpen(false);
			createForm.reset();
		} });
	};
	const openEditModal = (user) => {
		setEditingUser(user);
		editForm.setData({
			name: user.name,
			email: user.email,
			role_id: user.role_id,
			status: user.status,
			password: ""
		});
	};
	const handleUpdate = (e) => {
		e.preventDefault();
		if (!editingUser) return;
		editForm.put(route("admin.users.update", editingUser.id), { onSuccess: () => {
			setEditingUser(null);
			editForm.reset();
		} });
	};
	const handleToggleStatus = (user) => {
		router.post(route("admin.users.toggle-status", user.id));
	};
	const handleDelete = () => {
		if (!userToDelete) return;
		router.delete(route("admin.users.destroy", userToDelete.id), { onSuccess: () => setUserToDelete(null) });
	};
	const formatRoleLabel = (name) => {
		if (!name) return "Unknown";
		return name.split("_").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(" ");
	};
	return /* @__PURE__ */ jsxs(AdminLayout, {
		title: "OPERATIVE CLEARANCES",
		children: [
			/* @__PURE__ */ jsx(AdminPageHeader, {
				title: "User & Role Management",
				description: "Commission operatives, govern clearance tiers, and regulate system authorization.",
				badge: "SUPER ADMIN ONLY",
				actionLabel: "Commission User",
				onActionClick: () => setIsCreateOpen(true)
			}),
			/* @__PURE__ */ jsx(AdminDataTable, {
				columns: [
					{
						header: "USER / AGENT",
						cell: (user) => /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ jsx("div", {
								className: "w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-mono text-xs font-bold text-white",
								children: user.name.charAt(0).toUpperCase()
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
								className: "font-semibold text-white",
								children: user.name
							}), /* @__PURE__ */ jsx("div", {
								className: "text-xs text-neutral-400 font-mono",
								children: user.email
							})] })]
						})
					},
					{
						header: "ROLE CLEARANCE",
						cell: (user) => {
							const isSuper = user.role_name === "super_admin";
							const isAdmin = user.role_name === "admin";
							return /* @__PURE__ */ jsx(Badge, {
								variant: isSuper ? "accent" : isAdmin ? "success" : "secondary",
								children: formatRoleLabel(user.role_name)
							});
						}
					},
					{
						header: "STATUS",
						cell: (user) => /* @__PURE__ */ jsxs("span", {
							className: `inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium ${user.status === "active" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"}`,
							children: [/* @__PURE__ */ jsx("span", { className: `w-1.5 h-1.5 rounded-full ${user.status === "active" ? "bg-emerald-400" : "bg-rose-400"}` }), /* @__PURE__ */ jsx("span", {
								className: "capitalize",
								children: user.status
							})]
						})
					},
					{
						header: "LAST LOGIN",
						cell: (user) => /* @__PURE__ */ jsx("span", {
							className: "text-xs font-mono text-neutral-400",
							children: user.last_login_at || "Never"
						})
					},
					{
						header: "JOINED",
						cell: (user) => /* @__PURE__ */ jsx("span", {
							className: "text-xs font-mono text-neutral-400",
							children: user.created_at || "—"
						})
					},
					{
						header: "",
						className: "text-right",
						cell: (user) => /* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
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
								/* @__PURE__ */ jsxs(DropdownMenuItem, {
									onClick: () => openEditModal(user),
									className: "gap-2",
									children: [/* @__PURE__ */ jsx(Edit, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Edit Clearance" })]
								}),
								/* @__PURE__ */ jsx(DropdownMenuItem, {
									onClick: () => handleToggleStatus(user),
									className: "gap-2",
									children: user.status === "active" ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(UserX, { className: "w-3.5 h-3.5 text-amber-400" }), /* @__PURE__ */ jsx("span", { children: "Suspend Access" })] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(UserCheck, { className: "w-3.5 h-3.5 text-emerald-400" }), /* @__PURE__ */ jsx("span", { children: "Activate Access" })] })
								}),
								/* @__PURE__ */ jsxs(DropdownMenuItem, {
									onClick: () => setUserToDelete(user),
									className: "gap-2 text-rose-400 focus:text-rose-400",
									children: [/* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Purge Account" })]
								})
							]
						})] })
					}
				],
				data: users,
				searchKey: "name",
				searchPlaceholder: "Search operatives by name or email..."
			}),
			/* @__PURE__ */ jsx(Dialog, {
				open: isCreateOpen,
				onOpenChange: setIsCreateOpen,
				children: /* @__PURE__ */ jsxs(DialogContent, { children: [/* @__PURE__ */ jsxs(DialogHeader, { children: [/* @__PURE__ */ jsx(DialogTitle, { children: "Commission New User Account" }), /* @__PURE__ */ jsx(DialogDescription, { children: "Create an operative identity and assign clearance privileges." })] }), /* @__PURE__ */ jsxs("form", {
					onSubmit: handleCreate,
					className: "space-y-4 pt-2",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5",
							children: [
								/* @__PURE__ */ jsx("label", {
									className: "text-xs font-mono uppercase text-neutral-400",
									children: "Full Name"
								}),
								/* @__PURE__ */ jsx(Input, {
									value: createForm.data.name,
									onChange: (e) => createForm.setData("name", e.target.value),
									placeholder: "e.g. Elena Rostova",
									required: true
								}),
								createForm.errors.name && /* @__PURE__ */ jsx("p", {
									className: "text-xs text-rose-400",
									children: createForm.errors.name
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5",
							children: [
								/* @__PURE__ */ jsx("label", {
									className: "text-xs font-mono uppercase text-neutral-400",
									children: "Work Email"
								}),
								/* @__PURE__ */ jsx(Input, {
									type: "email",
									value: createForm.data.email,
									onChange: (e) => createForm.setData("email", e.target.value),
									placeholder: "elena@cuttingedger.com",
									required: true
								}),
								createForm.errors.email && /* @__PURE__ */ jsx("p", {
									className: "text-xs text-rose-400",
									children: createForm.errors.email
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-2 gap-4",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-mono uppercase text-neutral-400",
									children: "Assigned Role"
								}), /* @__PURE__ */ jsxs(Select, {
									value: createForm.data.role_id ? String(createForm.data.role_id) : "",
									onValueChange: (val) => createForm.setData("role_id", Number(val)),
									children: [/* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select role" }) }), /* @__PURE__ */ jsx(SelectContent, { children: roles.map((r) => /* @__PURE__ */ jsx(SelectItem, {
										value: String(r.id),
										children: formatRoleLabel(r.name)
									}, r.id)) })]
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-mono uppercase text-neutral-400",
									children: "Status"
								}), /* @__PURE__ */ jsxs(Select, {
									value: createForm.data.status,
									onValueChange: (val) => createForm.setData("status", val),
									children: [/* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select status" }) }), /* @__PURE__ */ jsxs(SelectContent, { children: [/* @__PURE__ */ jsx(SelectItem, {
										value: "active",
										children: "Active"
									}), /* @__PURE__ */ jsx(SelectItem, {
										value: "suspended",
										children: "Suspended"
									})] })]
								})]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5",
							children: [
								/* @__PURE__ */ jsx("label", {
									className: "text-xs font-mono uppercase text-neutral-400",
									children: "Temporary Password"
								}),
								/* @__PURE__ */ jsx(Input, {
									type: "password",
									value: createForm.data.password,
									onChange: (e) => createForm.setData("password", e.target.value),
									placeholder: "••••••••••••",
									required: true
								}),
								createForm.errors.password && /* @__PURE__ */ jsx("p", {
									className: "text-xs text-rose-400",
									children: createForm.errors.password
								})
							]
						}),
						/* @__PURE__ */ jsxs(DialogFooter, { children: [/* @__PURE__ */ jsx(Button, {
							type: "button",
							variant: "outline",
							onClick: () => setIsCreateOpen(false),
							children: "Cancel"
						}), /* @__PURE__ */ jsx(Button, {
							type: "submit",
							disabled: createForm.processing,
							children: createForm.processing ? "Creating..." : "Create Operative"
						})] })
					]
				})] })
			}),
			/* @__PURE__ */ jsx(Dialog, {
				open: !!editingUser,
				onOpenChange: (open) => !open && setEditingUser(null),
				children: /* @__PURE__ */ jsxs(DialogContent, { children: [/* @__PURE__ */ jsxs(DialogHeader, { children: [/* @__PURE__ */ jsx(DialogTitle, { children: "Edit Operative Clearance" }), /* @__PURE__ */ jsx(DialogDescription, { children: "Modify user role or update account credentials." })] }), /* @__PURE__ */ jsxs("form", {
					onSubmit: handleUpdate,
					className: "space-y-4 pt-2",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5",
							children: [
								/* @__PURE__ */ jsx("label", {
									className: "text-xs font-mono uppercase text-neutral-400",
									children: "Full Name"
								}),
								/* @__PURE__ */ jsx(Input, {
									value: editForm.data.name,
									onChange: (e) => editForm.setData("name", e.target.value),
									required: true
								}),
								editForm.errors.name && /* @__PURE__ */ jsx("p", {
									className: "text-xs text-rose-400",
									children: editForm.errors.name
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5",
							children: [
								/* @__PURE__ */ jsx("label", {
									className: "text-xs font-mono uppercase text-neutral-400",
									children: "Work Email"
								}),
								/* @__PURE__ */ jsx(Input, {
									type: "email",
									value: editForm.data.email,
									onChange: (e) => editForm.setData("email", e.target.value),
									required: true
								}),
								editForm.errors.email && /* @__PURE__ */ jsx("p", {
									className: "text-xs text-rose-400",
									children: editForm.errors.email
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-2 gap-4",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-mono uppercase text-neutral-400",
									children: "Assigned Role"
								}), /* @__PURE__ */ jsxs(Select, {
									value: editForm.data.role_id ? String(editForm.data.role_id) : "",
									onValueChange: (val) => editForm.setData("role_id", Number(val)),
									children: [/* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select role" }) }), /* @__PURE__ */ jsx(SelectContent, { children: roles.map((r) => /* @__PURE__ */ jsx(SelectItem, {
										value: String(r.id),
										children: formatRoleLabel(r.name)
									}, r.id)) })]
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-mono uppercase text-neutral-400",
									children: "Status"
								}), /* @__PURE__ */ jsxs(Select, {
									value: editForm.data.status,
									onValueChange: (val) => editForm.setData("status", val),
									children: [/* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select status" }) }), /* @__PURE__ */ jsxs(SelectContent, { children: [/* @__PURE__ */ jsx(SelectItem, {
										value: "active",
										children: "Active"
									}), /* @__PURE__ */ jsx(SelectItem, {
										value: "suspended",
										children: "Suspended"
									})] })]
								})]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5",
							children: [
								/* @__PURE__ */ jsx("label", {
									className: "text-xs font-mono uppercase text-neutral-400",
									children: "Reset Password (leave blank to retain)"
								}),
								/* @__PURE__ */ jsx(Input, {
									type: "password",
									value: editForm.data.password,
									onChange: (e) => editForm.setData("password", e.target.value),
									placeholder: "Leave blank to keep current",
									autoComplete: "new-password"
								}),
								editForm.errors.password && /* @__PURE__ */ jsx("p", {
									className: "text-xs text-rose-400",
									children: editForm.errors.password
								})
							]
						}),
						/* @__PURE__ */ jsxs(DialogFooter, { children: [/* @__PURE__ */ jsx(Button, {
							type: "button",
							variant: "outline",
							onClick: () => setEditingUser(null),
							children: "Cancel"
						}), /* @__PURE__ */ jsx(Button, {
							type: "submit",
							disabled: editForm.processing,
							children: editForm.processing ? "Saving..." : "Save Clearance"
						})] })
					]
				})] })
			}),
			/* @__PURE__ */ jsx(AlertDialog, {
				open: !!userToDelete,
				onOpenChange: (open) => !open && setUserToDelete(null),
				children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [/* @__PURE__ */ jsxs(AlertDialogHeader, { children: [/* @__PURE__ */ jsx(AlertDialogTitle, { children: "Purge Operative Clearance?" }), /* @__PURE__ */ jsxs(AlertDialogDescription, { children: [
					"Are you certain you wish to delete",
					" ",
					/* @__PURE__ */ jsx("span", {
						className: "text-white font-semibold",
						children: userToDelete?.name
					}),
					"? This action cannot be undone."
				] })] }), /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [/* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancel" }), /* @__PURE__ */ jsx(AlertDialogAction, {
					onClick: handleDelete,
					children: "Purge Account"
				})] })] })
			})
		]
	});
}
//#endregion
export { UsersIndex as default };
