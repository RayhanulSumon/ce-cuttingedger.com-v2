import { a as DropdownMenuTrigger, i as DropdownMenuItem, n as DropdownMenu, r as DropdownMenuContent, t as AdminLayout } from "./AdminLayout-B_omIhRP.js";
import { n as Button, t as Input } from "./input-lL3MBuxn.js";
import { t as AdminPageHeader } from "./AdminPageHeader-BLzCfjWe.js";
import { t as AdminDataTable } from "./AdminDataTable-DkjiIkNz.js";
import { t as Textarea } from "./textarea-DNOgnKpG.js";
import { t as Badge } from "./badge-BgjwAGBP.js";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-C4D4ccTI.js";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-D8hTrlnh.js";
import { useState } from "react";
import { router, useForm } from "@inertiajs/react";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Admin/Faqs/Index.tsx
function FaqsIndex({ faqs = [] }) {
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [editingFaq, setEditingFaq] = useState(null);
	const [faqToDelete, setFaqToDelete] = useState(null);
	const createForm = useForm({
		question: "",
		answer: "",
		category: "Engagements",
		sort_order: 0
	});
	const editForm = useForm({
		question: "",
		answer: "",
		category: "",
		sort_order: 0
	});
	const handleCreate = (e) => {
		e.preventDefault();
		createForm.post(route("admin.faqs.store"), { onSuccess: () => {
			setIsCreateOpen(false);
			createForm.reset();
		} });
	};
	const openEdit = (f) => {
		setEditingFaq(f);
		editForm.setData({
			question: f.question,
			answer: f.answer,
			category: f.category,
			sort_order: f.sort_order
		});
	};
	const handleUpdate = (e) => {
		e.preventDefault();
		if (!editingFaq) return;
		editForm.put(route("admin.faqs.update", editingFaq.id), { onSuccess: () => {
			setEditingFaq(null);
			editForm.reset();
		} });
	};
	const handleDelete = () => {
		if (!faqToDelete) return;
		router.delete(route("admin.faqs.destroy", faqToDelete.id), { onSuccess: () => setFaqToDelete(null) });
	};
	return /* @__PURE__ */ jsxs(AdminLayout, {
		title: "FREQUENT INQUIRIES",
		children: [
			/* @__PURE__ */ jsx(AdminPageHeader, {
				title: "FAQs Management",
				description: "Frequently asked queries regarding sprint deliverables, contracts, and IP ownership.",
				actionLabel: "Add FAQ",
				onActionClick: () => setIsCreateOpen(true)
			}),
			/* @__PURE__ */ jsx(AdminDataTable, {
				columns: [
					{
						header: "QUESTION",
						cell: (f) => /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
							className: "font-semibold text-white",
							children: f.question
						}), /* @__PURE__ */ jsx("div", {
							className: "text-xs text-neutral-400 max-w-lg truncate mt-0.5",
							children: f.answer
						})] })
					},
					{
						header: "CATEGORY",
						cell: (f) => /* @__PURE__ */ jsx(Badge, {
							variant: "outline",
							children: f.category
						})
					},
					{
						header: "ORDER",
						cell: (f) => /* @__PURE__ */ jsxs("span", {
							className: "font-mono text-xs text-neutral-400",
							children: ["#", f.sort_order]
						})
					},
					{
						header: "",
						className: "text-right",
						cell: (f) => /* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
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
								onClick: () => openEdit(f),
								className: "gap-2",
								children: [/* @__PURE__ */ jsx(Edit, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Edit FAQ" })]
							}), /* @__PURE__ */ jsxs(DropdownMenuItem, {
								onClick: () => setFaqToDelete(f),
								className: "gap-2 text-rose-400 focus:text-rose-400",
								children: [/* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Purge FAQ" })]
							})]
						})] })
					}
				],
				data: faqs,
				searchKey: "question",
				searchPlaceholder: "Search questions..."
			}),
			/* @__PURE__ */ jsx(Dialog, {
				open: isCreateOpen,
				onOpenChange: setIsCreateOpen,
				children: /* @__PURE__ */ jsxs(DialogContent, { children: [/* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Add Frequently Asked Question" }) }), /* @__PURE__ */ jsxs("form", {
					onSubmit: handleCreate,
					className: "space-y-4 pt-2",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ jsx("label", {
								className: "text-xs font-mono uppercase text-neutral-400",
								children: "Question"
							}), /* @__PURE__ */ jsx(Input, {
								value: createForm.data.question,
								onChange: (e) => createForm.setData("question", e.target.value),
								placeholder: "e.g. How does sprint onboarding function?",
								required: true
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-2 gap-4",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-mono uppercase text-neutral-400",
									children: "Topic Category"
								}), /* @__PURE__ */ jsx(Input, {
									value: createForm.data.category,
									onChange: (e) => createForm.setData("category", e.target.value),
									placeholder: "Engagements / Tech / IP",
									required: true
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-mono uppercase text-neutral-400",
									children: "Display Order"
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
								children: "Comprehensive Answer"
							}), /* @__PURE__ */ jsx(Textarea, {
								value: createForm.data.answer,
								onChange: (e) => createForm.setData("answer", e.target.value),
								rows: 4,
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
							children: createForm.processing ? "Adding..." : "Add FAQ"
						})] })
					]
				})] })
			}),
			/* @__PURE__ */ jsx(Dialog, {
				open: !!editingFaq,
				onOpenChange: (open) => !open && setEditingFaq(null),
				children: /* @__PURE__ */ jsxs(DialogContent, { children: [/* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Edit FAQ" }) }), /* @__PURE__ */ jsxs("form", {
					onSubmit: handleUpdate,
					className: "space-y-4 pt-2",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ jsx("label", {
								className: "text-xs font-mono uppercase text-neutral-400",
								children: "Question"
							}), /* @__PURE__ */ jsx(Input, {
								value: editForm.data.question,
								onChange: (e) => editForm.setData("question", e.target.value),
								required: true
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-2 gap-4",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-mono uppercase text-neutral-400",
									children: "Topic Category"
								}), /* @__PURE__ */ jsx(Input, {
									value: editForm.data.category,
									onChange: (e) => editForm.setData("category", e.target.value),
									required: true
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-mono uppercase text-neutral-400",
									children: "Display Order"
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
								children: "Comprehensive Answer"
							}), /* @__PURE__ */ jsx(Textarea, {
								value: editForm.data.answer,
								onChange: (e) => editForm.setData("answer", e.target.value),
								rows: 4,
								required: true
							})]
						}),
						/* @__PURE__ */ jsxs(DialogFooter, { children: [/* @__PURE__ */ jsx(Button, {
							type: "button",
							variant: "outline",
							onClick: () => setEditingFaq(null),
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
				open: !!faqToDelete,
				onOpenChange: (open) => !open && setFaqToDelete(null),
				children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [/* @__PURE__ */ jsxs(AlertDialogHeader, { children: [/* @__PURE__ */ jsx(AlertDialogTitle, { children: "Purge FAQ?" }), /* @__PURE__ */ jsx(AlertDialogDescription, { children: "Are you certain you wish to purge this inquiry record?" })] }), /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [/* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancel" }), /* @__PURE__ */ jsx(AlertDialogAction, {
					onClick: handleDelete,
					children: "Purge"
				})] })] })
			})
		]
	});
}
//#endregion
export { FaqsIndex as default };
