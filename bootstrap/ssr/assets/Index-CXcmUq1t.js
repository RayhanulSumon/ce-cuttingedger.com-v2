import { a as DropdownMenuItem, i as DropdownMenuContent, n as AdminLayout, o as DropdownMenuTrigger, r as DropdownMenu, t as AdminPageHeader } from "./AdminPageHeader-BF3p_UDa.js";
import { n as Button, t as Input } from "./input-lL3MBuxn.js";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, l as AdminDataTable, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-DsbEgc5R.js";
import { t as Badge } from "./badge-BgjwAGBP.js";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-C4D4ccTI.js";
import { useState } from "react";
import { router, useForm } from "@inertiajs/react";
import { Edit, ExternalLink, MoreHorizontal, Trash2 } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Admin/Clients/Index.tsx
function ClientsIndex({ clients = [] }) {
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [editingClient, setEditingClient] = useState(null);
	const [clientToDelete, setClientToDelete] = useState(null);
	const createForm = useForm({
		name: "",
		logo_dark: "/images/clients/client-1.svg",
		logo_light: "",
		url: "",
		marquee_row: 1,
		sort_order: 0
	});
	const editForm = useForm({
		name: "",
		logo_dark: "",
		logo_light: "",
		url: "",
		marquee_row: 1,
		sort_order: 0
	});
	const handleCreate = (e) => {
		e.preventDefault();
		createForm.post(route("admin.clients.store"), { onSuccess: () => {
			setIsCreateOpen(false);
			createForm.reset();
		} });
	};
	const openEdit = (c) => {
		setEditingClient(c);
		editForm.setData({
			name: c.name,
			logo_dark: c.logo_dark || "",
			logo_light: c.logo_light || "",
			url: c.url || "",
			marquee_row: c.marquee_row,
			sort_order: c.sort_order
		});
	};
	const handleUpdate = (e) => {
		e.preventDefault();
		if (!editingClient) return;
		editForm.put(route("admin.clients.update", editingClient.id), { onSuccess: () => {
			setEditingClient(null);
			editForm.reset();
		} });
	};
	const handleDelete = () => {
		if (!clientToDelete) return;
		router.delete(route("admin.clients.destroy", clientToDelete.id), { onSuccess: () => setClientToDelete(null) });
	};
	return /* @__PURE__ */ jsxs(AdminLayout, {
		title: "CLIENTS & LOGO MARQUEE",
		children: [
			/* @__PURE__ */ jsx(AdminPageHeader, {
				title: "Clients & Marquee Logos",
				description: "Manage enterprise brand partnerships and infinite ribbon marquee rows.",
				actionLabel: "Add Partner",
				onActionClick: () => setIsCreateOpen(true)
			}),
			/* @__PURE__ */ jsx(AdminDataTable, {
				columns: [
					{
						header: "PARTNER BRAND",
						cell: (c) => /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ jsx("div", {
								className: "w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-mono font-bold text-xs text-white",
								children: c.name.substring(0, 2).toUpperCase()
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
								className: "font-semibold text-white",
								children: c.name
							}), /* @__PURE__ */ jsx("div", {
								className: "text-xs text-neutral-400 font-mono",
								children: c.url || "No link"
							})] })]
						})
					},
					{
						header: "MARQUEE TRACK",
						cell: (c) => /* @__PURE__ */ jsxs(Badge, {
							variant: "outline",
							children: ["ROW ", c.marquee_row]
						})
					},
					{
						header: "SORT ORDER",
						cell: (c) => /* @__PURE__ */ jsxs("span", {
							className: "font-mono text-xs text-neutral-400",
							children: ["#", c.sort_order]
						})
					},
					{
						header: "",
						className: "text-right",
						cell: (c) => /* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-end gap-1",
							children: [c.url && /* @__PURE__ */ jsx("a", {
								href: c.url,
								target: "_blank",
								rel: "noopener noreferrer",
								className: "p-1.5 text-neutral-400 hover:text-white transition-colors",
								children: /* @__PURE__ */ jsx(ExternalLink, { className: "w-4 h-4" })
							}), /* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
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
									children: [/* @__PURE__ */ jsx(Edit, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Edit Brand" })]
								}), /* @__PURE__ */ jsxs(DropdownMenuItem, {
									onClick: () => setClientToDelete(c),
									className: "gap-2 text-rose-400 focus:text-rose-400",
									children: [/* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Remove Brand" })]
								})]
							})] })]
						})
					}
				],
				data: clients,
				searchKey: "name",
				searchPlaceholder: "Search client partners..."
			}),
			/* @__PURE__ */ jsx(Dialog, {
				open: isCreateOpen,
				onOpenChange: setIsCreateOpen,
				children: /* @__PURE__ */ jsxs(DialogContent, { children: [/* @__PURE__ */ jsxs(DialogHeader, { children: [/* @__PURE__ */ jsx(DialogTitle, { children: "Register Brand Partner" }), /* @__PURE__ */ jsx(DialogDescription, { children: "Logo assets, website link, and marquee row slot." })] }), /* @__PURE__ */ jsxs("form", {
					onSubmit: handleCreate,
					className: "space-y-4 pt-2",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ jsx("label", {
								className: "text-xs font-mono uppercase text-neutral-400",
								children: "Client / Company Name"
							}), /* @__PURE__ */ jsx(Input, {
								value: createForm.data.name,
								onChange: (e) => createForm.setData("name", e.target.value),
								placeholder: "e.g. Stripe, OpenAI, Nike",
								required: true
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ jsx("label", {
								className: "text-xs font-mono uppercase text-neutral-400",
								children: "Logo Dark Vector Asset Path / SVG"
							}), /* @__PURE__ */ jsx(Input, {
								value: createForm.data.logo_dark,
								onChange: (e) => createForm.setData("logo_dark", e.target.value),
								placeholder: "/images/clients/logo-1.svg"
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ jsx("label", {
								className: "text-xs font-mono uppercase text-neutral-400",
								children: "Brand Official Website URL"
							}), /* @__PURE__ */ jsx(Input, {
								type: "url",
								value: createForm.data.url,
								onChange: (e) => createForm.setData("url", e.target.value),
								placeholder: "https://partner.com"
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-2 gap-4",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-mono uppercase text-neutral-400",
									children: "Marquee Ribbon Row"
								}), /* @__PURE__ */ jsxs("select", {
									value: createForm.data.marquee_row,
									onChange: (e) => createForm.setData("marquee_row", Number(e.target.value)),
									className: "w-full h-10 rounded-lg bg-[#0d0f15] border border-white/10 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent",
									children: [/* @__PURE__ */ jsx("option", {
										value: 1,
										children: "Row 1 (Top Ribbon)"
									}), /* @__PURE__ */ jsx("option", {
										value: 2,
										children: "Row 2 (Bottom Ribbon)"
									})]
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
						/* @__PURE__ */ jsxs(DialogFooter, { children: [/* @__PURE__ */ jsx(Button, {
							type: "button",
							variant: "outline",
							onClick: () => setIsCreateOpen(false),
							children: "Cancel"
						}), /* @__PURE__ */ jsx(Button, {
							type: "submit",
							disabled: createForm.processing,
							children: createForm.processing ? "Adding..." : "Add Partner"
						})] })
					]
				})] })
			}),
			/* @__PURE__ */ jsx(Dialog, {
				open: !!editingClient,
				onOpenChange: (open) => !open && setEditingClient(null),
				children: /* @__PURE__ */ jsxs(DialogContent, { children: [/* @__PURE__ */ jsxs(DialogHeader, { children: [/* @__PURE__ */ jsx(DialogTitle, { children: "Edit Brand Partner" }), /* @__PURE__ */ jsx(DialogDescription, { children: "Revise brand metadata, row track, and logo reference." })] }), /* @__PURE__ */ jsxs("form", {
					onSubmit: handleUpdate,
					className: "space-y-4 pt-2",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ jsx("label", {
								className: "text-xs font-mono uppercase text-neutral-400",
								children: "Client / Company Name"
							}), /* @__PURE__ */ jsx(Input, {
								value: editForm.data.name,
								onChange: (e) => editForm.setData("name", e.target.value),
								required: true
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ jsx("label", {
								className: "text-xs font-mono uppercase text-neutral-400",
								children: "Logo Dark Vector Asset Path / SVG"
							}), /* @__PURE__ */ jsx(Input, {
								value: editForm.data.logo_dark,
								onChange: (e) => editForm.setData("logo_dark", e.target.value)
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ jsx("label", {
								className: "text-xs font-mono uppercase text-neutral-400",
								children: "Brand Official Website URL"
							}), /* @__PURE__ */ jsx(Input, {
								type: "url",
								value: editForm.data.url,
								onChange: (e) => editForm.setData("url", e.target.value)
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-2 gap-4",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-mono uppercase text-neutral-400",
									children: "Marquee Ribbon Row"
								}), /* @__PURE__ */ jsxs("select", {
									value: editForm.data.marquee_row,
									onChange: (e) => editForm.setData("marquee_row", Number(e.target.value)),
									className: "w-full h-10 rounded-lg bg-[#0d0f15] border border-white/10 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent",
									children: [/* @__PURE__ */ jsx("option", {
										value: 1,
										children: "Row 1 (Top Ribbon)"
									}), /* @__PURE__ */ jsx("option", {
										value: 2,
										children: "Row 2 (Bottom Ribbon)"
									})]
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
						/* @__PURE__ */ jsxs(DialogFooter, { children: [/* @__PURE__ */ jsx(Button, {
							type: "button",
							variant: "outline",
							onClick: () => setEditingClient(null),
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
				open: !!clientToDelete,
				onOpenChange: (open) => !open && setClientToDelete(null),
				children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [/* @__PURE__ */ jsxs(AlertDialogHeader, { children: [/* @__PURE__ */ jsx(AlertDialogTitle, { children: "Remove Brand Partner?" }), /* @__PURE__ */ jsxs(AlertDialogDescription, { children: [
					"Are you certain you wish to purge",
					" ",
					/* @__PURE__ */ jsx("span", {
						className: "text-white font-semibold",
						children: clientToDelete?.name
					}),
					" ",
					"from the client marquee?"
				] })] }), /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [/* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancel" }), /* @__PURE__ */ jsx(AlertDialogAction, {
					onClick: handleDelete,
					children: "Remove Partner"
				})] })] })
			})
		]
	});
}
//#endregion
export { ClientsIndex as default };
