import { a as DropdownMenuTrigger, i as DropdownMenuItem, n as DropdownMenu, r as DropdownMenuContent, t as AdminLayout } from "./AdminLayout-B_omIhRP.js";
import { n as Button, t as Input } from "./input-lL3MBuxn.js";
import { t as AdminPageHeader } from "./AdminPageHeader-BLzCfjWe.js";
import { t as AdminDataTable } from "./AdminDataTable-DkjiIkNz.js";
import { t as Textarea } from "./textarea-DNOgnKpG.js";
import { t as Badge } from "./badge-BgjwAGBP.js";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-C4D4ccTI.js";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-D8hTrlnh.js";
import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { CornerDownRight, Edit, FolderTree, MoreHorizontal, Tag, Trash2 } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Admin/BlogCategories/Index.tsx
function BlogCategoriesIndex({ categories = [], parentCategories = [] }) {
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [editingCategory, setEditingCategory] = useState(null);
	const [categoryToDelete, setCategoryToDelete] = useState(null);
	const createForm = useForm({
		name: "",
		slug: "",
		parent_id: "",
		description: ""
	});
	const editForm = useForm({
		name: "",
		slug: "",
		parent_id: "",
		description: ""
	});
	const handleCreate = (e) => {
		e.preventDefault();
		createForm.post(route("admin.blog-categories.store"), { onSuccess: () => {
			setIsCreateOpen(false);
			createForm.reset();
		} });
	};
	const openEdit = (cat) => {
		setEditingCategory(cat);
		editForm.setData({
			name: cat.name,
			slug: cat.slug,
			parent_id: cat.parent_id || "",
			description: cat.description || ""
		});
	};
	const handleUpdate = (e) => {
		e.preventDefault();
		if (!editingCategory) return;
		editForm.put(route("admin.blog-categories.update", editingCategory.id), { onSuccess: () => {
			setEditingCategory(null);
		} });
	};
	const handleDelete = () => {
		if (!categoryToDelete) return;
		editForm.delete(route("admin.blog-categories.destroy", categoryToDelete.id), { onSuccess: () => {
			setCategoryToDelete(null);
		} });
	};
	return /* @__PURE__ */ jsx(AdminLayout, {
		title: "Blog Categories & Subcategories",
		children: /* @__PURE__ */ jsxs("div", {
			className: "space-y-6",
			children: [
				/* @__PURE__ */ jsx(AdminPageHeader, {
					eyebrow: "EDITORIAL TAXONOMY",
					title: "Blog Categories & Subcategories",
					description: "Structure blog posts with top-level blog categories and targeted subcategories for pristine SEO indexing.",
					createLabel: "New Blog Category / Subcategory",
					onCreate: () => setIsCreateOpen(true)
				}),
				/* @__PURE__ */ jsx(AdminDataTable, {
					data: categories,
					columns: [
						{
							key: "name",
							header: "CATEGORY / TAXONOMY",
							sortable: true,
							cell: (c) => /* @__PURE__ */ jsx("div", {
								className: "flex items-center gap-2",
								children: c.parent_id ? /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-1.5 text-neutral-400 pl-4 font-mono text-xs",
									children: [
										/* @__PURE__ */ jsx(CornerDownRight, { className: "w-3.5 h-3.5 text-accent" }),
										/* @__PURE__ */ jsx("span", {
											className: "text-white font-medium",
											children: c.name
										}),
										/* @__PURE__ */ jsxs("span", {
											className: "text-[10px] text-neutral-500 uppercase px-1.5 py-0.5 rounded bg-white/5 border border-white/5",
											children: ["Subcategory of ", c.parent?.name]
										})
									]
								}) : /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2 font-medium text-white",
									children: [
										/* @__PURE__ */ jsx(Tag, { className: "w-3.5 h-3.5 text-accent" }),
										/* @__PURE__ */ jsx("span", { children: c.name }),
										c.subcategories && c.subcategories.length > 0 && /* @__PURE__ */ jsxs(Badge, {
											variant: "outline",
											className: "text-[10px] font-mono text-accent border-accent/30 bg-accent/5",
											children: [c.subcategories.length, " subcategories"]
										})
									]
								})
							})
						},
						{
							key: "slug",
							header: "URL SLUG",
							cell: (c) => /* @__PURE__ */ jsxs("span", {
								className: "font-mono text-xs text-neutral-400",
								children: ["/blog?category=", c.slug]
							})
						},
						{
							key: "description",
							header: "DESCRIPTION / CONTEXT",
							cell: (c) => /* @__PURE__ */ jsx("span", {
								className: "text-xs text-neutral-400 line-clamp-1 max-w-sm",
								children: c.description || "—"
							})
						},
						{
							key: "blogs_count",
							header: "ARTICLES",
							cell: (c) => /* @__PURE__ */ jsxs("span", {
								className: "text-xs font-mono text-accent",
								children: [c.blogs_count ?? 0, " Published"]
							})
						},
						{
							key: "actions",
							header: "ACTION",
							className: "text-right",
							cell: (c) => /* @__PURE__ */ jsx("div", {
								className: "flex justify-end",
								children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
									asChild: true,
									children: /* @__PURE__ */ jsx(Button, {
										variant: "ghost",
										size: "sm",
										className: "h-8 w-8 p-0 text-neutral-400 hover:text-white hover:bg-white/10",
										children: /* @__PURE__ */ jsx(MoreHorizontal, { className: "h-4 w-4" })
									})
								}), /* @__PURE__ */ jsxs(DropdownMenuContent, {
									align: "end",
									className: "bg-[#12131a] border-white/10 text-white min-w-[140px]",
									children: [/* @__PURE__ */ jsxs(DropdownMenuItem, {
										onClick: () => openEdit(c),
										className: "cursor-pointer text-xs focus:bg-accent focus:text-black",
										children: [/* @__PURE__ */ jsx(Edit, { className: "mr-2 h-3.5 w-3.5" }), "Edit"]
									}), /* @__PURE__ */ jsxs(DropdownMenuItem, {
										onClick: () => setCategoryToDelete(c),
										className: "cursor-pointer text-xs text-rose-400 focus:bg-rose-500 focus:text-white",
										children: [/* @__PURE__ */ jsx(Trash2, { className: "mr-2 h-3.5 w-3.5" }), "Move to Trash"]
									})]
								})] })
							})
						}
					],
					searchKey: "name",
					searchPlaceholder: "Filter blog categories by name..."
				}),
				/* @__PURE__ */ jsx(Dialog, {
					open: isCreateOpen,
					onOpenChange: setIsCreateOpen,
					children: /* @__PURE__ */ jsxs(DialogContent, {
						className: "sm:max-w-xl bg-[#0c0d12] border-white/10 text-white shadow-2xl",
						children: [/* @__PURE__ */ jsxs(DialogHeader, { children: [/* @__PURE__ */ jsxs(DialogTitle, {
							className: "text-xl font-bold font-mono tracking-tight text-white flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(FolderTree, { className: "w-5 h-5 text-accent" }), "REGISTER BLOG CATEGORY"]
						}), /* @__PURE__ */ jsx(DialogDescription, {
							className: "text-neutral-400 text-xs font-mono",
							children: "Create a primary blog category or nest as a subcategory under an existing parent."
						})] }), /* @__PURE__ */ jsxs("form", {
							onSubmit: handleCreate,
							className: "space-y-4 pt-2",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "grid grid-cols-1 md:grid-cols-2 gap-4",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "space-y-1.5",
										children: [
											/* @__PURE__ */ jsx("label", {
												className: "text-xs font-mono text-neutral-300",
												children: "Category Name *"
											}),
											/* @__PURE__ */ jsx(Input, {
												placeholder: "e.g. Design Systems",
												value: createForm.data.name,
												onChange: (e) => createForm.setData("name", e.target.value),
												className: "bg-[#12131a] border-white/10 focus:border-accent",
												required: true
											}),
											createForm.errors.name && /* @__PURE__ */ jsx("p", {
												className: "text-rose-400 text-xs font-mono",
												children: createForm.errors.name
											})
										]
									}), /* @__PURE__ */ jsxs("div", {
										className: "space-y-1.5",
										children: [
											/* @__PURE__ */ jsx("label", {
												className: "text-xs font-mono text-neutral-300",
												children: "Slug (Optional - auto-generated)"
											}),
											/* @__PURE__ */ jsx(Input, {
												placeholder: "e.g. design-systems",
												value: createForm.data.slug,
												onChange: (e) => createForm.setData("slug", e.target.value),
												className: "bg-[#12131a] border-white/10 focus:border-accent"
											}),
											createForm.errors.slug && /* @__PURE__ */ jsx("p", {
												className: "text-rose-400 text-xs font-mono",
												children: createForm.errors.slug
											})
										]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ jsx("label", {
										className: "text-xs font-mono text-neutral-300",
										children: "Parent Category (Select if this is a Subcategory)"
									}), /* @__PURE__ */ jsxs("select", {
										value: createForm.data.parent_id,
										onChange: (e) => createForm.setData("parent_id", e.target.value),
										className: "w-full h-10 px-3 rounded-md bg-[#12131a] border border-white/10 text-white text-sm focus:border-accent focus:outline-none",
										children: [/* @__PURE__ */ jsx("option", {
											value: "",
											children: "None (Primary Root Category)"
										}), parentCategories.map((p) => /* @__PURE__ */ jsxs("option", {
											value: p.id,
											children: ["Parent: ", p.name]
										}, p.id))]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ jsx("label", {
										className: "text-xs font-mono text-neutral-300",
										children: "Description / Meta Scope"
									}), /* @__PURE__ */ jsx(Textarea, {
										rows: 3,
										placeholder: "Brief summary of topics covered in this category for editorial and SEO clarity...",
										value: createForm.data.description,
										onChange: (e) => createForm.setData("description", e.target.value),
										className: "bg-[#12131a] border-white/10 focus:border-accent"
									})]
								}),
								/* @__PURE__ */ jsxs(DialogFooter, {
									className: "pt-2",
									children: [/* @__PURE__ */ jsx(Button, {
										type: "button",
										variant: "outline",
										onClick: () => setIsCreateOpen(false),
										className: "border-white/10 text-neutral-400 hover:text-white",
										children: "Cancel"
									}), /* @__PURE__ */ jsx(Button, {
										type: "submit",
										disabled: createForm.processing,
										className: "bg-accent hover:bg-[#b8dd00] text-black font-mono font-bold",
										children: createForm.processing ? "Saving..." : "Create Category"
									})]
								})
							]
						})]
					})
				}),
				/* @__PURE__ */ jsx(Dialog, {
					open: !!editingCategory,
					onOpenChange: (open) => !open && setEditingCategory(null),
					children: /* @__PURE__ */ jsxs(DialogContent, {
						className: "sm:max-w-xl bg-[#0c0d12] border-white/10 text-white shadow-2xl",
						children: [/* @__PURE__ */ jsxs(DialogHeader, { children: [/* @__PURE__ */ jsxs(DialogTitle, {
							className: "text-xl font-bold font-mono tracking-tight text-white flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(Edit, { className: "w-5 h-5 text-accent" }), "EDIT BLOG CATEGORY"]
						}), /* @__PURE__ */ jsx(DialogDescription, {
							className: "text-neutral-400 text-xs font-mono",
							children: "Modify name, URL slug, description, or parent relationship."
						})] }), editingCategory && /* @__PURE__ */ jsxs("form", {
							onSubmit: handleUpdate,
							className: "space-y-4 pt-2",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "grid grid-cols-1 md:grid-cols-2 gap-4",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ jsx("label", {
											className: "text-xs font-mono text-neutral-300",
											children: "Category Name *"
										}), /* @__PURE__ */ jsx(Input, {
											value: editForm.data.name,
											onChange: (e) => editForm.setData("name", e.target.value),
											className: "bg-[#12131a] border-white/10 focus:border-accent",
											required: true
										})]
									}), /* @__PURE__ */ jsxs("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ jsx("label", {
											className: "text-xs font-mono text-neutral-300",
											children: "Slug *"
										}), /* @__PURE__ */ jsx(Input, {
											value: editForm.data.slug,
											onChange: (e) => editForm.setData("slug", e.target.value),
											className: "bg-[#12131a] border-white/10 focus:border-accent",
											required: true
										})]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ jsx("label", {
										className: "text-xs font-mono text-neutral-300",
										children: "Parent Category"
									}), /* @__PURE__ */ jsxs("select", {
										value: editForm.data.parent_id,
										onChange: (e) => editForm.setData("parent_id", e.target.value),
										className: "w-full h-10 px-3 rounded-md bg-[#12131a] border border-white/10 text-white text-sm focus:border-accent focus:outline-none",
										children: [/* @__PURE__ */ jsx("option", {
											value: "",
											children: "None (Primary Root Category)"
										}), parentCategories.filter((p) => p.id !== editingCategory.id).map((p) => /* @__PURE__ */ jsxs("option", {
											value: p.id,
											children: ["Parent: ", p.name]
										}, p.id))]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ jsx("label", {
										className: "text-xs font-mono text-neutral-300",
										children: "Description"
									}), /* @__PURE__ */ jsx(Textarea, {
										rows: 3,
										value: editForm.data.description,
										onChange: (e) => editForm.setData("description", e.target.value),
										className: "bg-[#12131a] border-white/10 focus:border-accent"
									})]
								}),
								/* @__PURE__ */ jsxs(DialogFooter, {
									className: "pt-2",
									children: [/* @__PURE__ */ jsx(Button, {
										type: "button",
										variant: "outline",
										onClick: () => setEditingCategory(null),
										className: "border-white/10 text-neutral-400 hover:text-white",
										children: "Cancel"
									}), /* @__PURE__ */ jsx(Button, {
										type: "submit",
										disabled: editForm.processing,
										className: "bg-accent hover:bg-[#b8dd00] text-black font-mono font-bold",
										children: editForm.processing ? "Updating..." : "Commit Update"
									})]
								})
							]
						})]
					})
				}),
				/* @__PURE__ */ jsx(AlertDialog, {
					open: !!categoryToDelete,
					onOpenChange: (open) => !open && setCategoryToDelete(null),
					children: /* @__PURE__ */ jsxs(AlertDialogContent, {
						className: "bg-[#0c0d12] border-white/10 text-white",
						children: [/* @__PURE__ */ jsxs(AlertDialogHeader, { children: [/* @__PURE__ */ jsx(AlertDialogTitle, {
							className: "font-mono text-rose-400",
							children: "PURGE BLOG CATEGORY"
						}), /* @__PURE__ */ jsxs(AlertDialogDescription, {
							className: "text-neutral-400 text-xs font-mono",
							children: [
								"Are you sure you wish to delete “",
								categoryToDelete?.name,
								"”? Articles assigned to this category will remain intact with an unassigned status."
							]
						})] }), /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [/* @__PURE__ */ jsx(AlertDialogCancel, {
							className: "border-white/10 text-neutral-400 hover:text-white",
							children: "Abort"
						}), /* @__PURE__ */ jsx(AlertDialogAction, {
							onClick: handleDelete,
							className: "bg-rose-500 hover:bg-rose-600 text-white font-mono font-bold",
							children: "Confirm Delete"
						})] })]
					})
				})
			]
		})
	});
}
//#endregion
export { BlogCategoriesIndex as default };
