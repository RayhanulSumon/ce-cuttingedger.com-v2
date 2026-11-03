import { t as AdminLayout } from "./AdminLayout-B_omIhRP.js";
import { n as Button } from "./input-lL3MBuxn.js";
import { t as AdminPageHeader } from "./AdminPageHeader-BLzCfjWe.js";
import { t as AdminDataTable } from "./AdminDataTable-DkjiIkNz.js";
import { t as Badge } from "./badge-BgjwAGBP.js";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-D8hTrlnh.js";
import { t as $ } from "./dist-CEcKwvhn.js";
import { useState } from "react";
import { Link, router } from "@inertiajs/react";
import { AlertTriangle, ArrowLeft, Clock, RotateCcw, Trash2 } from "lucide-react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Admin/Blogs/Trash.tsx
function BlogsTrash({ blogs = [] }) {
	const [blogToRestore, setBlogToRestore] = useState(null);
	const [blogToForceDelete, setBlogToForceDelete] = useState(null);
	const [isProcessing, setIsProcessing] = useState(false);
	const handleRestore = () => {
		if (!blogToRestore) return;
		setIsProcessing(true);
		router.post($("admin.blogs.restore", blogToRestore.id), {}, {
			preserveScroll: true,
			onFinish: () => {
				setIsProcessing(false);
				setBlogToRestore(null);
			}
		});
	};
	const handleForceDelete = () => {
		if (!blogToForceDelete) return;
		setIsProcessing(true);
		router.delete($("admin.blogs.force-delete", blogToForceDelete.id), {
			preserveScroll: true,
			onFinish: () => {
				setIsProcessing(false);
				setBlogToForceDelete(null);
			}
		});
	};
	return /* @__PURE__ */ jsx(AdminLayout, {
		title: "Blog Trash & Recovery Archive",
		children: /* @__PURE__ */ jsxs("div", {
			className: "space-y-6",
			children: [
				/* @__PURE__ */ jsx(AdminPageHeader, {
					eyebrow: "ARCHIVAL REPOSITORY",
					title: "Soft-Deleted Blog Posts",
					description: "Review soft-deleted blog articles. Restoring an article brings it back to its exact previous state (draft, published, or archived). Hard deleting permanently removes it.",
					children: /* @__PURE__ */ jsx(Link, {
						href: $("admin.blogs.index"),
						children: /* @__PURE__ */ jsxs(Button, {
							variant: "outline",
							className: "gap-2 border-white/10 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white font-mono",
							children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4" }), /* @__PURE__ */ jsx("span", { children: "Back to Blogs" })]
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
									className: "w-16 h-10 rounded object-cover border border-white/10 shrink-0 opacity-80"
								}), /* @__PURE__ */ jsxs("div", {
									className: "min-w-0 space-y-1",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "font-medium text-white leading-snug break-words",
										children: [/* @__PURE__ */ jsx("span", { children: b.title }), b.is_featured && /* @__PURE__ */ jsx(Badge, {
											className: "bg-accent/20 text-accent border border-accent/30 text-[9px] font-mono font-bold px-1 py-0 h-4 ml-1.5 align-middle inline-flex shrink-0",
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
							header: "PREVIOUS STAGE",
							cell: (b) => /* @__PURE__ */ jsxs("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ jsx("span", {
									className: `inline-block px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider rounded border ${b.status === "published" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : b.status === "draft" ? "border-amber-500/30 bg-amber-500/10 text-amber-400" : "border-neutral-500/30 bg-neutral-500/10 text-neutral-400"}`,
									children: b.status || "published"
								}), /* @__PURE__ */ jsxs("div", {
									className: "text-[10px] font-mono text-neutral-500",
									children: ["Restores to ", b.status || "published"]
								})]
							})
						},
						{
							key: "deleted_at",
							header: "DELETED AT",
							cell: (b) => /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-1.5 text-xs font-mono text-neutral-400",
								children: [/* @__PURE__ */ jsx(Clock, { className: "w-3.5 h-3.5 text-neutral-500 shrink-0" }), /* @__PURE__ */ jsx("span", { children: b.deleted_at ? new Date(b.deleted_at).toLocaleString("en-US", {
									month: "short",
									day: "numeric",
									year: "numeric",
									hour: "2-digit",
									minute: "2-digit"
								}) : "Recently" })]
							})
						},
						{
							key: "actions",
							header: "ACTIONS",
							className: "text-right",
							cell: (b) => /* @__PURE__ */ jsxs("div", {
								className: "flex justify-end items-center gap-2",
								children: [/* @__PURE__ */ jsxs(Button, {
									size: "sm",
									variant: "outline",
									onClick: () => setBlogToRestore(b),
									className: "h-8 gap-1.5 border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 font-mono text-xs font-semibold cursor-pointer",
									children: [/* @__PURE__ */ jsx(RotateCcw, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ jsx("span", { children: "Restore" })]
								}), /* @__PURE__ */ jsxs(Button, {
									size: "sm",
									variant: "outline",
									onClick: () => setBlogToForceDelete(b),
									className: "h-8 gap-1.5 border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 font-mono text-xs font-semibold cursor-pointer",
									children: [/* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ jsx("span", { children: "Delete" })]
								})]
							})
						}
					],
					searchKey: "title",
					searchPlaceholder: "Filter trashed articles by title...",
					emptyMessage: "Trash is empty. No soft-deleted articles found."
				}),
				/* @__PURE__ */ jsx(AlertDialog, {
					open: !!blogToRestore,
					onOpenChange: (open) => !open && setBlogToRestore(null),
					children: /* @__PURE__ */ jsxs(AlertDialogContent, {
						className: "bg-[#0c0d12] border-white/10 text-white",
						children: [/* @__PURE__ */ jsxs(AlertDialogHeader, { children: [/* @__PURE__ */ jsxs(AlertDialogTitle, {
							className: "font-mono text-emerald-400 flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(RotateCcw, { className: "w-5 h-5" }), "RESTORE BLOG POST"]
						}), /* @__PURE__ */ jsxs(AlertDialogDescription, {
							className: "text-neutral-400 text-xs font-mono space-y-2",
							children: [/* @__PURE__ */ jsxs("p", { children: [
								"Are you sure you want to restore “",
								blogToRestore?.title,
								"”?"
							] }), /* @__PURE__ */ jsxs("p", {
								className: "text-neutral-300 bg-white/5 p-2.5 rounded border border-white/10",
								children: [
									"This article will be immediately reinstated to its exact previous stage:",
									" ",
									/* @__PURE__ */ jsx("span", {
										className: "text-accent font-bold uppercase",
										children: blogToRestore?.status || "published"
									}),
									blogToRestore?.status === "published" ? " (will be visible on the public site again)." : " (will remain as a draft / archived in the admin index)."
								]
							})]
						})] }), /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [/* @__PURE__ */ jsx(AlertDialogCancel, {
							disabled: isProcessing,
							className: "border-white/10 text-neutral-400 hover:text-white",
							children: "Cancel"
						}), /* @__PURE__ */ jsx(AlertDialogAction, {
							onClick: handleRestore,
							disabled: isProcessing,
							className: "bg-emerald-500 hover:bg-emerald-600 text-black font-mono font-bold",
							children: isProcessing ? "Restoring..." : "Confirm Restore"
						})] })]
					})
				}),
				/* @__PURE__ */ jsx(AlertDialog, {
					open: !!blogToForceDelete,
					onOpenChange: (open) => !open && setBlogToForceDelete(null),
					children: /* @__PURE__ */ jsxs(AlertDialogContent, {
						className: "bg-[#0c0d12] border-white/10 text-white",
						children: [/* @__PURE__ */ jsxs(AlertDialogHeader, { children: [/* @__PURE__ */ jsxs(AlertDialogTitle, {
							className: "font-mono text-rose-400 flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(AlertTriangle, { className: "w-5 h-5 text-rose-500" }), "PERMANENT HARD DELETE"]
						}), /* @__PURE__ */ jsxs(AlertDialogDescription, {
							className: "text-neutral-400 text-xs font-mono space-y-2",
							children: [/* @__PURE__ */ jsxs("p", { children: [
								"Are you sure you wish to permanently delete “",
								blogToForceDelete?.title,
								"”?"
							] }), /* @__PURE__ */ jsx("p", {
								className: "text-rose-400/90 bg-rose-500/10 p-2.5 rounded border border-rose-500/20",
								children: "CRITICAL WARNING: This action is permanent and completely irreversible. The article, content, SEO data, and records will be purged from the database forever."
							})]
						})] }), /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [/* @__PURE__ */ jsx(AlertDialogCancel, {
							disabled: isProcessing,
							className: "border-white/10 text-neutral-400 hover:text-white",
							children: "Abort"
						}), /* @__PURE__ */ jsx(AlertDialogAction, {
							onClick: handleForceDelete,
							disabled: isProcessing,
							className: "bg-rose-600 hover:bg-rose-700 text-white font-mono font-bold",
							children: isProcessing ? "Deleting..." : "Permanently Delete"
						})] })]
					})
				})
			]
		})
	});
}
//#endregion
export { BlogsTrash as default };
