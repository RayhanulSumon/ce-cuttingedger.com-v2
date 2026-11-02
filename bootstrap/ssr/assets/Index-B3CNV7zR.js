import { a as DropdownMenuItem, i as DropdownMenuContent, n as AdminLayout, o as DropdownMenuTrigger, r as DropdownMenu, t as AdminPageHeader } from "./AdminPageHeader-BF3p_UDa.js";
import { n as Button, t as Input } from "./input-lL3MBuxn.js";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, l as AdminDataTable, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-DsbEgc5R.js";
import { t as Textarea } from "./textarea-DNOgnKpG.js";
import { t as Badge } from "./badge-BgjwAGBP.js";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-C4D4ccTI.js";
import { t as Switch } from "./switch-7-Y_VisU.js";
import { i as SelectItem, n as SelectContent, o as SelectTrigger, s as SelectValue, t as Select } from "./select-DJUEkoYA.js";
import { useState } from "react";
import { router, useForm } from "@inertiajs/react";
import { Edit, ExternalLink, MoreHorizontal, Trash2 } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Admin/Projects/Index.tsx
function ProjectsIndex({ projects = [], categories = [] }) {
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [editingProject, setEditingProject] = useState(null);
	const [projectToDelete, setProjectToDelete] = useState(null);
	const createForm = useForm({
		title: "",
		slug: "",
		client_name: "",
		year: "2026",
		category_id: categories[0]?.id || "",
		summary: "",
		description: "",
		cover_image: "/images/work/project-1.jpg",
		featured: false,
		is_concept: false,
		sort_order: 0,
		live_url: "",
		h1_title: "",
		meta_title: "",
		meta_description: "",
		canonical_url: "",
		is_noindex: false,
		client_challenge: "",
		work_done: "",
		measurable_result: ""
	});
	const editForm = useForm({
		title: "",
		slug: "",
		client_name: "",
		year: "2026",
		category_id: "",
		summary: "",
		description: "",
		cover_image: "",
		featured: false,
		is_concept: false,
		sort_order: 0,
		live_url: "",
		h1_title: "",
		meta_title: "",
		meta_description: "",
		canonical_url: "",
		is_noindex: false,
		client_challenge: "",
		work_done: "",
		measurable_result: ""
	});
	const handleCreate = (e) => {
		e.preventDefault();
		createForm.post(route("admin.projects.store"), { onSuccess: () => {
			setIsCreateOpen(false);
			createForm.reset();
		} });
	};
	const openEdit = (project) => {
		setEditingProject(project);
		editForm.setData({
			title: project.title,
			slug: project.slug || "",
			client_name: project.client_name,
			year: project.year,
			category_id: project.category_id || "",
			summary: project.summary,
			description: project.description || "",
			cover_image: project.cover_image,
			featured: project.featured,
			is_concept: Boolean(project.is_concept),
			sort_order: project.sort_order,
			live_url: project.live_url || "",
			h1_title: project.h1_title || "",
			meta_title: project.meta_title || "",
			meta_description: project.meta_description || "",
			canonical_url: project.canonical_url || "",
			is_noindex: Boolean(project.is_noindex),
			client_challenge: project.client_challenge || "",
			work_done: project.work_done || "",
			measurable_result: project.measurable_result || ""
		});
	};
	const handleUpdate = (e) => {
		e.preventDefault();
		if (!editingProject) return;
		editForm.put(route("admin.projects.update", editingProject.id), { onSuccess: () => {
			setEditingProject(null);
			editForm.reset();
		} });
	};
	const handleDelete = () => {
		if (!projectToDelete) return;
		router.delete(route("admin.projects.destroy", projectToDelete.id), { onSuccess: () => setProjectToDelete(null) });
	};
	return /* @__PURE__ */ jsxs(AdminLayout, {
		title: "PORTFOLIO & FLAGSHIPS",
		children: [
			/* @__PURE__ */ jsx(AdminPageHeader, {
				title: "Projects Management",
				description: "Curate kinetic showcases, digital flagships, and spatial 3D experiences.",
				actionLabel: "Create Project",
				onActionClick: () => setIsCreateOpen(true)
			}),
			/* @__PURE__ */ jsx(AdminDataTable, {
				columns: [
					{
						header: "FLAGSHIP PROJECT",
						cell: (p) => /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ jsx("img", {
								src: p.cover_image,
								alt: p.title,
								className: "w-10 h-10 rounded-lg object-cover bg-neutral-900 border border-white/10",
								onError: (e) => {
									e.target.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80";
								}
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
								className: "font-semibold text-white",
								children: p.title
							}), /* @__PURE__ */ jsxs("div", {
								className: "text-xs text-neutral-400 font-mono",
								children: [
									p.client_name,
									" • ",
									p.year
								]
							})] })]
						})
					},
					{
						header: "DISCIPLINE",
						cell: (p) => /* @__PURE__ */ jsx(Badge, {
							variant: "secondary",
							children: p.category?.name || "Unassigned"
						})
					},
					{
						header: "STATUS",
						cell: (p) => /* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap gap-1",
							children: [p.featured && /* @__PURE__ */ jsx(Badge, {
								variant: "accent",
								children: "FEATURED"
							}), p.is_concept ? /* @__PURE__ */ jsx("span", {
								className: "px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30",
								children: "CONCEPT"
							}) : /* @__PURE__ */ jsx(Badge, {
								variant: "outline",
								children: "CLIENT WORK"
							})]
						})
					},
					{
						header: "ORDER",
						cell: (p) => /* @__PURE__ */ jsxs("span", {
							className: "font-mono text-xs text-neutral-400",
							children: ["#", p.sort_order]
						})
					},
					{
						header: "",
						className: "text-right",
						cell: (p) => /* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-end gap-1",
							children: [p.live_url && /* @__PURE__ */ jsx("a", {
								href: p.live_url,
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
									onClick: () => openEdit(p),
									className: "gap-2",
									children: [/* @__PURE__ */ jsx(Edit, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Edit Project" })]
								}), /* @__PURE__ */ jsxs(DropdownMenuItem, {
									onClick: () => setProjectToDelete(p),
									className: "gap-2 text-rose-400 focus:text-rose-400",
									children: [/* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Purge Project" })]
								})]
							})] })]
						})
					}
				],
				data: projects,
				searchKey: "title",
				searchPlaceholder: "Search projects by title..."
			}),
			/* @__PURE__ */ jsx(Dialog, {
				open: isCreateOpen,
				onOpenChange: setIsCreateOpen,
				children: /* @__PURE__ */ jsxs(DialogContent, {
					className: "max-w-2xl max-h-[90vh] overflow-y-auto",
					children: [/* @__PURE__ */ jsxs(DialogHeader, { children: [/* @__PURE__ */ jsx(DialogTitle, { children: "Commission New Flagship Project" }), /* @__PURE__ */ jsx(DialogDescription, { children: "Define project assets, metadata, client credentials, and deliverables." })] }), /* @__PURE__ */ jsxs("form", {
						onSubmit: handleCreate,
						className: "space-y-5 pt-2",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-2 gap-4",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ jsx("label", {
										className: "text-xs font-mono uppercase text-neutral-400",
										children: "Project Title *"
									}), /* @__PURE__ */ jsx(Input, {
										value: createForm.data.title,
										onChange: (e) => createForm.setData("title", e.target.value),
										placeholder: "e.g. Lumina Hyperdrive",
										required: true
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ jsx("label", {
										className: "text-xs font-mono uppercase text-neutral-400",
										children: "Client / Brand *"
									}), /* @__PURE__ */ jsx(Input, {
										value: createForm.data.client_name,
										onChange: (e) => createForm.setData("client_name", e.target.value),
										placeholder: "e.g. Porsche Digital",
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
										children: "Custom URL Slug (Optional)"
									}), /* @__PURE__ */ jsx(Input, {
										value: createForm.data.slug,
										onChange: (e) => createForm.setData("slug", e.target.value),
										placeholder: "auto-generated-if-empty"
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ jsx("label", {
										className: "text-xs font-mono uppercase text-neutral-400",
										children: "H1 Headline Override"
									}), /* @__PURE__ */ jsx(Input, {
										value: createForm.data.h1_title,
										onChange: (e) => createForm.setData("h1_title", e.target.value),
										placeholder: "Leave empty to use title"
									})]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-3 gap-4",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ jsx("label", {
											className: "text-xs font-mono uppercase text-neutral-400",
											children: "Release Year *"
										}), /* @__PURE__ */ jsx(Input, {
											value: createForm.data.year,
											onChange: (e) => createForm.setData("year", e.target.value),
											required: true
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ jsx("label", {
											className: "text-xs font-mono uppercase text-neutral-400",
											children: "Discipline Category"
										}), /* @__PURE__ */ jsxs(Select, {
											value: createForm.data.category_id || "uncategorized",
											onValueChange: (val) => createForm.setData("category_id", val === "uncategorized" ? "" : val),
											children: [/* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Uncategorized" }) }), /* @__PURE__ */ jsxs(SelectContent, { children: [/* @__PURE__ */ jsx(SelectItem, {
												value: "uncategorized",
												children: "Uncategorized"
											}), categories.map((c) => /* @__PURE__ */ jsx(SelectItem, {
												value: String(c.id),
												children: c.name
											}, c.id))] })]
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ jsx("label", {
											className: "text-xs font-mono uppercase text-neutral-400",
											children: "Display Order"
										}), /* @__PURE__ */ jsx(Input, {
											type: "number",
											value: createForm.data.sort_order,
											onChange: (e) => createForm.setData("sort_order", Number(e.target.value))
										})]
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-mono uppercase text-neutral-400",
									children: "Cover Image Asset Path / URL *"
								}), /* @__PURE__ */ jsx(Input, {
									value: createForm.data.cover_image,
									onChange: (e) => createForm.setData("cover_image", e.target.value),
									placeholder: "https://... or /images/work/project-1.jpg",
									required: true
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-mono uppercase text-neutral-400",
									children: "Executive Summary *"
								}), /* @__PURE__ */ jsx(Textarea, {
									value: createForm.data.summary,
									onChange: (e) => createForm.setData("summary", e.target.value),
									placeholder: "High-impact synopsis for marquee cards...",
									rows: 2,
									required: true
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-4",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "font-mono text-xs uppercase tracking-wider text-accent font-bold block",
										children: "Case Study Narrative (Challenge, Execution & Outcome)"
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ jsx("label", {
											className: "text-xs font-mono uppercase text-neutral-400",
											children: "01. Client Situation & Challenge"
										}), /* @__PURE__ */ jsx(Textarea, {
											value: createForm.data.client_challenge,
											onChange: (e) => createForm.setData("client_challenge", e.target.value),
											placeholder: "Describe the production bottleneck or scale challenge...",
											rows: 2
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ jsx("label", {
											className: "text-xs font-mono uppercase text-neutral-400",
											children: "02. Execution & Work Done"
										}), /* @__PURE__ */ jsx(Textarea, {
											value: createForm.data.work_done,
											onChange: (e) => createForm.setData("work_done", e.target.value),
											placeholder: "Describe the retouching pipelines, pen tool vector clipping, or CGI shaders built...",
											rows: 2
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ jsx("label", {
											className: "text-xs font-mono uppercase text-neutral-400",
											children: "03. Measurable Commercial Result"
										}), /* @__PURE__ */ jsx(Textarea, {
											value: createForm.data.measurable_result,
											onChange: (e) => createForm.setData("measurable_result", e.target.value),
											placeholder: "e.g. Delivered 4,800 SKUs in 48 hours with 99.8% first-pass approval...",
											rows: 2
										})]
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "font-mono text-xs uppercase tracking-wider text-neutral-300 font-bold block",
										children: "Page-Level SEO Metadata"
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ jsx("label", {
											className: "text-xs font-mono uppercase text-neutral-400",
											children: "Meta Title"
										}), /* @__PURE__ */ jsx(Input, {
											value: createForm.data.meta_title,
											onChange: (e) => createForm.setData("meta_title", e.target.value),
											placeholder: "Target Keyword | Cutting Edger"
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ jsx("label", {
											className: "text-xs font-mono uppercase text-neutral-400",
											children: "Meta Description"
										}), /* @__PURE__ */ jsx(Textarea, {
											value: createForm.data.meta_description,
											onChange: (e) => createForm.setData("meta_description", e.target.value),
											placeholder: "Compelling synopsis for SERP snippets...",
											rows: 2
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ jsx("label", {
											className: "text-xs font-mono uppercase text-neutral-400",
											children: "Canonical URL Override (Optional)"
										}), /* @__PURE__ */ jsx(Input, {
											value: createForm.data.canonical_url,
											onChange: (e) => createForm.setData("canonical_url", e.target.value),
											placeholder: "Default: self (/case-studies/...)"
										})]
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-mono uppercase text-neutral-400",
									children: "Live Demonstration URL (Optional)"
								}), /* @__PURE__ */ jsx(Input, {
									type: "url",
									value: createForm.data.live_url,
									onChange: (e) => createForm.setData("live_url", e.target.value),
									placeholder: "https://client-showcase.com"
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
									className: "text-xs font-semibold text-white block",
									children: "Featured Flagship"
								}), /* @__PURE__ */ jsx("span", {
									className: "text-[11px] text-neutral-400 block",
									children: "Promote to home page marquee sticky showcases."
								})] }), /* @__PURE__ */ jsx(Switch, {
									checked: createForm.data.featured,
									onCheckedChange: (val) => createForm.setData("featured", val)
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/20",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
									className: "text-xs font-semibold text-amber-300 block",
									children: "Concept / Speculative Case Study"
								}), /* @__PURE__ */ jsx("span", {
									className: "text-[11px] text-neutral-400 block",
									children: "Tags project as Concept Work to maintain B2B enterprise transparency."
								})] }), /* @__PURE__ */ jsx(Switch, {
									checked: createForm.data.is_concept,
									onCheckedChange: (val) => createForm.setData("is_concept", val)
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between p-3 rounded-xl bg-rose-500/10 border border-rose-500/20",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
									className: "text-xs font-semibold text-rose-300 block",
									children: "Noindex (Exclude from Search Engines)"
								}), /* @__PURE__ */ jsx("span", {
									className: "text-[11px] text-neutral-400 block",
									children: "Prevents crawlers and sitemap inclusion for unreleased or sensitive client work."
								})] }), /* @__PURE__ */ jsx(Switch, {
									checked: createForm.data.is_noindex,
									onCheckedChange: (val) => createForm.setData("is_noindex", val)
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
								children: createForm.processing ? "Publishing..." : "Publish Project"
							})] })
						]
					})]
				})
			}),
			/* @__PURE__ */ jsx(Dialog, {
				open: !!editingProject,
				onOpenChange: (open) => !open && setEditingProject(null),
				children: /* @__PURE__ */ jsxs(DialogContent, {
					className: "max-w-2xl max-h-[90vh] overflow-y-auto",
					children: [/* @__PURE__ */ jsxs(DialogHeader, { children: [/* @__PURE__ */ jsx(DialogTitle, { children: "Modify Project Blueprint" }), /* @__PURE__ */ jsx(DialogDescription, { children: "Revise specifications, live links, and asset references." })] }), /* @__PURE__ */ jsxs("form", {
						onSubmit: handleUpdate,
						className: "space-y-5 pt-2",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-2 gap-4",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ jsx("label", {
										className: "text-xs font-mono uppercase text-neutral-400",
										children: "Project Title *"
									}), /* @__PURE__ */ jsx(Input, {
										value: editForm.data.title,
										onChange: (e) => editForm.setData("title", e.target.value),
										required: true
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ jsx("label", {
										className: "text-xs font-mono uppercase text-neutral-400",
										children: "Client / Brand *"
									}), /* @__PURE__ */ jsx(Input, {
										value: editForm.data.client_name,
										onChange: (e) => editForm.setData("client_name", e.target.value),
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
										children: "Custom URL Slug"
									}), /* @__PURE__ */ jsx(Input, {
										value: editForm.data.slug,
										onChange: (e) => editForm.setData("slug", e.target.value),
										placeholder: "e.g. lumina-hyperdrive"
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ jsx("label", {
										className: "text-xs font-mono uppercase text-neutral-400",
										children: "H1 Headline Override"
									}), /* @__PURE__ */ jsx(Input, {
										value: editForm.data.h1_title,
										onChange: (e) => editForm.setData("h1_title", e.target.value),
										placeholder: "Leave empty to use title"
									})]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-3 gap-4",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ jsx("label", {
											className: "text-xs font-mono uppercase text-neutral-400",
											children: "Release Year *"
										}), /* @__PURE__ */ jsx(Input, {
											value: editForm.data.year,
											onChange: (e) => editForm.setData("year", e.target.value),
											required: true
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ jsx("label", {
											className: "text-xs font-mono uppercase text-neutral-400",
											children: "Discipline Category"
										}), /* @__PURE__ */ jsxs("select", {
											value: editForm.data.category_id,
											onChange: (e) => editForm.setData("category_id", e.target.value),
											className: "w-full h-10 rounded-lg bg-[#0d0f15] border border-white/10 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent",
											children: [/* @__PURE__ */ jsx("option", {
												value: "",
												children: "Uncategorized"
											}), categories.map((c) => /* @__PURE__ */ jsx("option", {
												value: c.id,
												children: c.name
											}, c.id))]
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ jsx("label", {
											className: "text-xs font-mono uppercase text-neutral-400",
											children: "Display Order"
										}), /* @__PURE__ */ jsx(Input, {
											type: "number",
											value: editForm.data.sort_order,
											onChange: (e) => editForm.setData("sort_order", Number(e.target.value))
										})]
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-mono uppercase text-neutral-400",
									children: "Cover Image Asset Path / URL *"
								}), /* @__PURE__ */ jsx(Input, {
									value: editForm.data.cover_image,
									onChange: (e) => editForm.setData("cover_image", e.target.value),
									required: true
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-mono uppercase text-neutral-400",
									children: "Executive Summary *"
								}), /* @__PURE__ */ jsx(Textarea, {
									value: editForm.data.summary,
									onChange: (e) => editForm.setData("summary", e.target.value),
									rows: 2,
									required: true
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-4",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "font-mono text-xs uppercase tracking-wider text-accent font-bold block",
										children: "Case Study Narrative (Challenge, Execution & Outcome)"
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ jsx("label", {
											className: "text-xs font-mono uppercase text-neutral-400",
											children: "01. Client Situation & Challenge"
										}), /* @__PURE__ */ jsx(Textarea, {
											value: editForm.data.client_challenge,
											onChange: (e) => editForm.setData("client_challenge", e.target.value),
											placeholder: "Describe the production bottleneck or scale challenge...",
											rows: 2
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ jsx("label", {
											className: "text-xs font-mono uppercase text-neutral-400",
											children: "02. Execution & Work Done"
										}), /* @__PURE__ */ jsx(Textarea, {
											value: editForm.data.work_done,
											onChange: (e) => editForm.setData("work_done", e.target.value),
											placeholder: "Describe the retouching pipelines, pen tool vector clipping, or CGI shaders built...",
											rows: 2
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ jsx("label", {
											className: "text-xs font-mono uppercase text-neutral-400",
											children: "03. Measurable Commercial Result"
										}), /* @__PURE__ */ jsx(Textarea, {
											value: editForm.data.measurable_result,
											onChange: (e) => editForm.setData("measurable_result", e.target.value),
											placeholder: "e.g. Delivered 4,800 SKUs in 48 hours with 99.8% first-pass approval...",
											rows: 2
										})]
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "font-mono text-xs uppercase tracking-wider text-neutral-300 font-bold block",
										children: "Page-Level SEO Metadata"
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ jsx("label", {
											className: "text-xs font-mono uppercase text-neutral-400",
											children: "Meta Title"
										}), /* @__PURE__ */ jsx(Input, {
											value: editForm.data.meta_title,
											onChange: (e) => editForm.setData("meta_title", e.target.value),
											placeholder: "Target Keyword | Cutting Edger"
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ jsx("label", {
											className: "text-xs font-mono uppercase text-neutral-400",
											children: "Meta Description"
										}), /* @__PURE__ */ jsx(Textarea, {
											value: editForm.data.meta_description,
											onChange: (e) => editForm.setData("meta_description", e.target.value),
											placeholder: "Compelling synopsis for SERP snippets...",
											rows: 2
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ jsx("label", {
											className: "text-xs font-mono uppercase text-neutral-400",
											children: "Canonical URL Override (Optional)"
										}), /* @__PURE__ */ jsx(Input, {
											value: editForm.data.canonical_url,
											onChange: (e) => editForm.setData("canonical_url", e.target.value),
											placeholder: "Default: self (/case-studies/...)"
										})]
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-mono uppercase text-neutral-400",
									children: "Live Demonstration URL (Optional)"
								}), /* @__PURE__ */ jsx(Input, {
									type: "url",
									value: editForm.data.live_url,
									onChange: (e) => editForm.setData("live_url", e.target.value),
									placeholder: "https://client-showcase.com"
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
									className: "text-xs font-semibold text-white block",
									children: "Featured Flagship"
								}), /* @__PURE__ */ jsx("span", {
									className: "text-[11px] text-neutral-400 block",
									children: "Promote to home page marquee sticky showcases."
								})] }), /* @__PURE__ */ jsx(Switch, {
									checked: editForm.data.featured,
									onCheckedChange: (val) => editForm.setData("featured", val)
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/20",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
									className: "text-xs font-semibold text-amber-300 block",
									children: "Concept / Speculative Case Study"
								}), /* @__PURE__ */ jsx("span", {
									className: "text-[11px] text-neutral-400 block",
									children: "Tags project as Concept Work to maintain B2B enterprise transparency."
								})] }), /* @__PURE__ */ jsx(Switch, {
									checked: editForm.data.is_concept,
									onCheckedChange: (val) => editForm.setData("is_concept", val)
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between p-3 rounded-xl bg-rose-500/10 border border-rose-500/20",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
									className: "text-xs font-semibold text-rose-300 block",
									children: "Noindex (Exclude from Search Engines)"
								}), /* @__PURE__ */ jsx("span", {
									className: "text-[11px] text-neutral-400 block",
									children: "Prevents crawlers and sitemap inclusion for unreleased or sensitive client work."
								})] }), /* @__PURE__ */ jsx(Switch, {
									checked: editForm.data.is_noindex,
									onCheckedChange: (val) => editForm.setData("is_noindex", val)
								})]
							}),
							/* @__PURE__ */ jsxs(DialogFooter, { children: [/* @__PURE__ */ jsx(Button, {
								type: "button",
								variant: "outline",
								onClick: () => setEditingProject(null),
								children: "Cancel"
							}), /* @__PURE__ */ jsx(Button, {
								type: "submit",
								disabled: editForm.processing,
								children: editForm.processing ? "Saving..." : "Save Modifications"
							})] })
						]
					})]
				})
			}),
			/* @__PURE__ */ jsx(AlertDialog, {
				open: !!projectToDelete,
				onOpenChange: (open) => !open && setProjectToDelete(null),
				children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [/* @__PURE__ */ jsxs(AlertDialogHeader, { children: [/* @__PURE__ */ jsx(AlertDialogTitle, { children: "Purge Flagship Project?" }), /* @__PURE__ */ jsxs(AlertDialogDescription, { children: [
					"Are you certain you wish to archive project",
					" ",
					/* @__PURE__ */ jsx("span", {
						className: "text-white font-semibold",
						children: projectToDelete?.title
					}),
					"?"
				] })] }), /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [/* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancel" }), /* @__PURE__ */ jsx(AlertDialogAction, {
					onClick: handleDelete,
					children: "Purge Project"
				})] })] })
			})
		]
	});
}
//#endregion
export { ProjectsIndex as default };
