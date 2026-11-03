import { a as DropdownMenuTrigger, i as DropdownMenuItem, n as DropdownMenu, r as DropdownMenuContent, t as AdminLayout } from "./AdminLayout-B_omIhRP.js";
import { n as Button } from "./input-lL3MBuxn.js";
import { t as AdminPageHeader } from "./AdminPageHeader-BLzCfjWe.js";
import { t as AdminDataTable } from "./AdminDataTable-DkjiIkNz.js";
import { t as Badge } from "./badge-BgjwAGBP.js";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-D8hTrlnh.js";
import { t as $ } from "./dist-CEcKwvhn.js";
import { useState } from "react";
import { Link, router } from "@inertiajs/react";
import { CheckCircle2, Edit, ExternalLink, MoreHorizontal, Trash2 } from "lucide-react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Admin/Blogs/Index.tsx
function BlogsIndex({ blogs = [], trashedCount = 0 }) {
	const [blogToDelete, setBlogToDelete] = useState(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const handleDelete = () => {
		if (!blogToDelete) return;
		setIsDeleting(true);
		router.delete($("admin.blogs.destroy", blogToDelete.id), {
			preserveScroll: true,
			onFinish: () => {
				setIsDeleting(false);
				setBlogToDelete(null);
			}
		});
	};
	return /* @__PURE__ */ jsx(AdminLayout, {
		title: "Blog Posts & Editorial Suite",
		children: /* @__PURE__ */ jsxs("div", {
			className: "space-y-6",
			children: [
				/* @__PURE__ */ jsx(AdminPageHeader, {
					title: "Blog Posts & Articles",
					description: "Compose long-form essays, assign category & subcategory taxonomies, and manage granular dynamic SEO metadata.",
					actionLabel: "New Blog Post",
					actionHref: $("admin.blogs.create"),
					children: /* @__PURE__ */ jsx(Link, {
						href: $("admin.blogs.trash"),
						children: /* @__PURE__ */ jsxs(Button, {
							variant: "outline",
							className: "gap-2 border-white/10 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white font-mono cursor-pointer",
							children: [
								/* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4 text-rose-400" }),
								/* @__PURE__ */ jsx("span", { children: "Trash" }),
								trashedCount > 0 && /* @__PURE__ */ jsx(Badge, {
									className: "bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-mono font-bold px-1.5 py-0 h-4",
									children: trashedCount
								})
							]
						})
					})
				}),
				/* @__PURE__ */ jsx(AdminDataTable, {
					data: blogs,
					columns: [
						{
							key: "cover_image",
							header: "ARTICLE / COVER",
							cell: (b) => /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-3 py-1",
								children: [/* @__PURE__ */ jsx("img", {
									src: b.cover_image,
									alt: b.title,
									className: "w-16 h-10 rounded object-cover border border-white/10 shrink-0"
								}), /* @__PURE__ */ jsxs("div", {
									className: "min-w-0 space-y-1",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "font-medium text-white leading-snug break-words",
										children: [/* @__PURE__ */ jsx(Link, {
											href: $("admin.blogs.edit", b.id),
											className: "hover:text-accent transition-colors",
											children: b.title
										}), b.is_featured && /* @__PURE__ */ jsx(Badge, {
											className: "bg-accent text-black text-[9px] font-mono font-bold px-1 py-0 h-4 ml-1.5 align-middle inline-flex shrink-0",
											children: "FEATURED"
										})]
									}), /* @__PURE__ */ jsxs("div", {
										className: "flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs font-mono text-neutral-400",
										children: [
											/* @__PURE__ */ jsx("span", {
												className: "text-accent",
												children: b.category?.name || "General"
											}),
											b.subcategory && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", { children: "/" }), /* @__PURE__ */ jsx("span", {
												className: "text-neutral-300",
												children: b.subcategory.name
											})] }),
											/* @__PURE__ */ jsx("span", { children: "•" }),
											/* @__PURE__ */ jsxs("span", { children: [b.reading_time, " min read"] })
										]
									})]
								})]
							})
						},
						{
							key: "author",
							header: "AUTHOR",
							cell: (b) => /* @__PURE__ */ jsx("div", {
								className: "text-xs font-mono text-neutral-300",
								children: b.author?.name || "Studio Editor"
							})
						},
						{
							key: "status",
							header: "STATUS",
							cell: (b) => /* @__PURE__ */ jsx("span", {
								className: `px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider rounded border ${b.status === "published" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : b.status === "draft" ? "border-amber-500/30 bg-amber-500/10 text-amber-400" : "border-neutral-500/30 bg-neutral-500/10 text-neutral-400"}`,
								children: b.status || "published"
							})
						},
						{
							key: "seo_status",
							header: "SEO SUITE",
							cell: (b) => {
								const hasSeo = b.meta_title && b.meta_description;
								return /* @__PURE__ */ jsx("div", {
									className: "flex items-center gap-1.5 text-xs font-mono",
									children: hasSeo ? /* @__PURE__ */ jsxs("span", {
										className: "flex items-center gap-1 text-emerald-400",
										children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5" }), "Configured"]
									}) : /* @__PURE__ */ jsx("span", {
										className: "text-amber-400",
										children: "Auto-Fallback"
									})
								});
							}
						},
						{
							key: "published_at",
							header: "PUBLISHED",
							cell: (b) => /* @__PURE__ */ jsx("span", {
								className: "text-xs font-mono text-neutral-400",
								children: b.published_at ? new Date(b.published_at).toLocaleDateString("en-US", {
									month: "short",
									day: "numeric",
									year: "numeric"
								}) : "Draft"
							})
						},
						{
							key: "actions",
							header: "ACTION",
							className: "text-right",
							cell: (b) => /* @__PURE__ */ jsxs("div", {
								className: "flex justify-end items-center gap-1",
								children: [
									/* @__PURE__ */ jsx("a", {
										href: `/blog/${b.slug}`,
										target: "_blank",
										rel: "noreferrer",
										className: "p-1.5 text-neutral-400 hover:text-white rounded hover:bg-white/5",
										title: "View Public Article",
										children: /* @__PURE__ */ jsx(ExternalLink, { className: "h-3.5 w-3.5" })
									}),
									/* @__PURE__ */ jsx(Link, {
										href: $("admin.blogs.edit", b.id),
										className: "p-1.5 text-neutral-400 hover:text-[#d4ff00] rounded hover:bg-white/5",
										title: "Edit",
										children: /* @__PURE__ */ jsx(Edit, { className: "h-3.5 w-3.5" })
									}),
									/* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
										asChild: true,
										children: /* @__PURE__ */ jsx(Button, {
											variant: "ghost",
											size: "sm",
											className: "h-8 w-8 p-0 text-neutral-400 hover:text-white hover:bg-white/10 cursor-pointer",
											children: /* @__PURE__ */ jsx(MoreHorizontal, { className: "h-4 w-4" })
										})
									}), /* @__PURE__ */ jsxs(DropdownMenuContent, {
										align: "end",
										className: "bg-[#12131a] border-white/10 text-white min-w-[150px]",
										children: [/* @__PURE__ */ jsx(DropdownMenuItem, {
											asChild: true,
											className: "cursor-pointer text-xs focus:bg-accent focus:text-black",
											children: /* @__PURE__ */ jsxs(Link, {
												href: $("admin.blogs.edit", b.id),
												className: "flex items-center w-full",
												children: [/* @__PURE__ */ jsx(Edit, { className: "mr-2 h-3.5 w-3.5" }), "Edit"]
											})
										}), /* @__PURE__ */ jsxs(DropdownMenuItem, {
											onClick: () => setBlogToDelete(b),
											className: "cursor-pointer text-xs text-rose-400 focus:bg-rose-500 focus:text-white",
											children: [/* @__PURE__ */ jsx(Trash2, { className: "mr-2 h-3.5 w-3.5" }), "Move to trash"]
										})]
									})] })
								]
							})
						}
					],
					searchKey: "title",
					searchPlaceholder: "Filter articles by title..."
				}),
				/* @__PURE__ */ jsx(AlertDialog, {
					open: !!blogToDelete,
					onOpenChange: (open) => !open && setBlogToDelete(null),
					children: /* @__PURE__ */ jsxs(AlertDialogContent, {
						className: "bg-[#0c0d12] border-white/10 text-white",
						children: [/* @__PURE__ */ jsxs(AlertDialogHeader, { children: [/* @__PURE__ */ jsx(AlertDialogTitle, {
							className: "font-mono text-rose-400",
							children: "DELETE BLOG POST"
						}), /* @__PURE__ */ jsxs(AlertDialogDescription, {
							className: "text-neutral-400 text-xs font-mono",
							children: [
								"Are you sure you wish to purge “",
								blogToDelete?.title,
								"” to the trash? It will be removed from public view and can be restored or permanently removed from the trash archive."
							]
						})] }), /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [/* @__PURE__ */ jsx(AlertDialogCancel, {
							className: "border-white/10 text-neutral-400 hover:text-white cursor-pointer",
							children: "Cancel"
						}), /* @__PURE__ */ jsx(AlertDialogAction, {
							onClick: handleDelete,
							disabled: isDeleting,
							className: "bg-rose-500 hover:bg-rose-600 text-white font-mono font-bold cursor-pointer",
							children: isDeleting ? "Moving to trash..." : "Confirm"
						})] })]
					})
				})
			]
		})
	});
}
//#endregion
export { BlogsIndex as default };
