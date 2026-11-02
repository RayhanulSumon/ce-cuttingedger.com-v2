import { a as DropdownMenuItem, i as DropdownMenuContent, n as AdminLayout, o as DropdownMenuTrigger, r as DropdownMenu, t as AdminPageHeader } from "./AdminPageHeader-BF3p_UDa.js";
import { n as Button } from "./input-lL3MBuxn.js";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, l as AdminDataTable, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-DsbEgc5R.js";
import { t as Badge } from "./badge-BgjwAGBP.js";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-C4D4ccTI.js";
import { useState } from "react";
import { router } from "@inertiajs/react";
import { Archive, CheckCircle2, Eye, Mail, MoreHorizontal, Trash2 } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Admin/Messages/Index.tsx
function MessagesIndex({ messages = [] }) {
	const [selectedMessage, setSelectedMessage] = useState(null);
	const [messageToDelete, setMessageToDelete] = useState(null);
	const updateStatus = (msg, status) => {
		router.put(route("admin.messages.update", msg.id), { status });
	};
	const handleDelete = () => {
		if (!messageToDelete) return;
		router.delete(route("admin.messages.destroy", messageToDelete.id), { onSuccess: () => setMessageToDelete(null) });
	};
	const getStatusBadge = (status) => {
		switch (status) {
			case "new": return /* @__PURE__ */ jsx(Badge, {
				variant: "accent",
				children: "NEW INQUIRY"
			});
			case "read": return /* @__PURE__ */ jsx(Badge, {
				variant: "secondary",
				children: "REVIEWED"
			});
			case "replied": return /* @__PURE__ */ jsx(Badge, {
				variant: "success",
				children: "REPLIED"
			});
			case "archived": return /* @__PURE__ */ jsx(Badge, {
				variant: "outline",
				children: "ARCHIVED"
			});
			default: return /* @__PURE__ */ jsx(Badge, {
				variant: "secondary",
				children: status
			});
		}
	};
	return /* @__PURE__ */ jsxs(AdminLayout, {
		title: "INBOUND INQUIRIES",
		children: [
			/* @__PURE__ */ jsx(AdminPageHeader, {
				title: "Inquiries Inbox",
				description: "Client project requests, budget specifications, and enterprise briefs.",
				badge: `${messages.filter((m) => m.status === "new").length} UNREAD`
			}),
			/* @__PURE__ */ jsx(AdminDataTable, {
				columns: [
					{
						header: "PROSPECT / CONTACT",
						cell: (m) => /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
							className: "font-semibold text-white",
							children: m.name
						}), /* @__PURE__ */ jsxs("div", {
							className: "text-xs text-neutral-400 font-mono",
							children: [
								m.email,
								" ",
								m.company ? `• ${m.company}` : ""
							]
						})] })
					},
					{
						header: "DISCIPLINE & BUDGET",
						cell: (m) => /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
							className: "text-xs text-white font-medium",
							children: m.service_interest || "General Consultation"
						}), /* @__PURE__ */ jsx("div", {
							className: "text-[11px] font-mono text-accent",
							children: m.budget || "Budget Unspecified"
						})] })
					},
					{
						header: "STATUS",
						cell: (m) => getStatusBadge(m.status)
					},
					{
						header: "RECEIVED",
						cell: (m) => /* @__PURE__ */ jsx("span", {
							className: "text-xs font-mono text-neutral-400",
							children: new Date(m.created_at).toLocaleDateString()
						})
					},
					{
						header: "",
						className: "text-right",
						cell: (m) => /* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-end gap-1",
							children: [/* @__PURE__ */ jsxs(Button, {
								variant: "ghost",
								size: "sm",
								onClick: () => {
									setSelectedMessage(m);
									if (m.status === "new") updateStatus(m, "read");
								},
								className: "gap-1.5 text-xs text-neutral-300 hover:text-white",
								children: [/* @__PURE__ */ jsx(Eye, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Inspect" })]
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
								children: [
									/* @__PURE__ */ jsxs(DropdownMenuItem, {
										onClick: () => updateStatus(m, "replied"),
										className: "gap-2 text-emerald-400",
										children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Mark as Replied" })]
									}),
									/* @__PURE__ */ jsxs(DropdownMenuItem, {
										onClick: () => updateStatus(m, "archived"),
										className: "gap-2 text-neutral-300",
										children: [/* @__PURE__ */ jsx(Archive, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Archive" })]
									}),
									/* @__PURE__ */ jsxs(DropdownMenuItem, {
										onClick: () => setMessageToDelete(m),
										className: "gap-2 text-rose-400 focus:text-rose-400",
										children: [/* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Purge" })]
									})
								]
							})] })]
						})
					}
				],
				data: messages,
				searchKey: "name",
				searchPlaceholder: "Search inquiries by prospect name..."
			}),
			/* @__PURE__ */ jsx(Dialog, {
				open: !!selectedMessage,
				onOpenChange: (open) => !open && setSelectedMessage(null),
				children: /* @__PURE__ */ jsxs(DialogContent, {
					className: "max-w-xl",
					children: [/* @__PURE__ */ jsxs(DialogHeader, { children: [/* @__PURE__ */ jsx(DialogTitle, { children: "Project Brief Dossier" }), /* @__PURE__ */ jsxs(DialogDescription, { children: [
						"From ",
						selectedMessage?.name,
						" (",
						selectedMessage?.email,
						")"
					] })] }), /* @__PURE__ */ jsxs("div", {
						className: "space-y-4 pt-2",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-2 gap-4 p-4 rounded-xl bg-white/5 border border-white/10 text-xs font-mono",
								children: [
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
										className: "text-neutral-500 block",
										children: "COMPANY"
									}), /* @__PURE__ */ jsx("span", {
										className: "text-white block mt-0.5",
										children: selectedMessage?.company || "Not provided"
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
										className: "text-neutral-500 block",
										children: "BUDGET TIER"
									}), /* @__PURE__ */ jsx("span", {
										className: "text-accent block mt-0.5",
										children: selectedMessage?.budget || "Not provided"
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
										className: "text-neutral-500 block",
										children: "SERVICE OF INTEREST"
									}), /* @__PURE__ */ jsx("span", {
										className: "text-white block mt-0.5",
										children: selectedMessage?.service_interest || "General"
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
										className: "text-neutral-500 block",
										children: "ORIGIN IP"
									}), /* @__PURE__ */ jsx("span", {
										className: "text-neutral-400 block mt-0.5",
										children: selectedMessage?.ip_address || "Hidden"
									})] })
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-xs font-mono uppercase text-neutral-400",
									children: "Prospect Message Brief"
								}), /* @__PURE__ */ jsx("div", {
									className: "p-4 rounded-xl bg-[#0d0f15] border border-white/10 text-sm text-neutral-200 leading-relaxed whitespace-pre-wrap",
									children: selectedMessage?.message
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between pt-2 border-t border-white/10",
								children: [/* @__PURE__ */ jsxs("a", {
									href: `mailto:${selectedMessage?.email}?subject=Cutting Edger // Response to Inquiry`,
									className: "inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-black text-xs font-semibold hover:bg-[#bde600]",
									children: [/* @__PURE__ */ jsx(Mail, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Reply via Work Email" })]
								}), /* @__PURE__ */ jsx("div", {
									className: "flex items-center gap-2",
									children: /* @__PURE__ */ jsx(Button, {
										variant: "outline",
										size: "sm",
										onClick: () => setSelectedMessage(null),
										children: "Close"
									})
								})]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ jsx(AlertDialog, {
				open: !!messageToDelete,
				onOpenChange: (open) => !open && setMessageToDelete(null),
				children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [/* @__PURE__ */ jsxs(AlertDialogHeader, { children: [/* @__PURE__ */ jsx(AlertDialogTitle, { children: "Purge Inquiry?" }), /* @__PURE__ */ jsxs(AlertDialogDescription, { children: [
					"Are you certain you wish to purge this inquiry from",
					" ",
					/* @__PURE__ */ jsx("span", {
						className: "text-white font-semibold",
						children: messageToDelete?.name
					}),
					"?"
				] })] }), /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [/* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancel" }), /* @__PURE__ */ jsx(AlertDialogAction, {
					onClick: handleDelete,
					children: "Purge Inquiry"
				})] })] })
			})
		]
	});
}
//#endregion
export { MessagesIndex as default };
