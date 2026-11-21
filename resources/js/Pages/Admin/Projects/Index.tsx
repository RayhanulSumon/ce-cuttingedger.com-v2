import React, { useState } from "react";
import { useForm, router } from "@inertiajs/react";
import { AdminLayout } from "@/Layouts/Admin/AdminLayout";
import { AdminPageHeader } from "@/Components/Admin/UI/AdminPageHeader";
import { AdminDataTable, Column } from "@/Components/Admin/UI/AdminDataTable";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Badge } from "@/Components/ui/badge";
import { Switch } from "@/Components/ui/switch";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/Components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/Components/ui/alert-dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, ExternalLink } from "lucide-react";
import { Project, Category } from "@/types/models";

interface ProjectsIndexProps {
    projects: Project[];
    categories: Category[];
}

export default function ProjectsIndex({ projects = [], categories = [] }: ProjectsIndexProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

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
        measurable_result: "",
    });

    const editForm = useForm({
        title: "",
        slug: "",
        client_name: "",
        year: "2026",
        category_id: "" as number | string,
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
        measurable_result: "",
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(route("admin.projects.store"), {
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
            },
        });
    };

    const openEdit = (project: Project) => {
        setEditingProject(project);
        editForm.setData({
            title: project.title,
            slug: project.slug || "",
            client_name: project.client_name,
            year: String(project.year ?? "2026"),
            category_id: project.category_id ?? "",
            summary: project.summary || "",
            description: project.description || "",
            cover_image: project.cover_image || "",
            featured: Boolean(project.featured),
            is_concept: Boolean(project.is_concept),
            sort_order: Number(project.sort_order ?? 0),
            live_url: project.live_url || "",
            h1_title: project.h1_title || "",
            meta_title: project.meta_title || "",
            meta_description: project.meta_description || "",
            canonical_url: project.canonical_url || "",
            is_noindex: Boolean(project.is_noindex),
            client_challenge: project.client_challenge || "",
            work_done: project.work_done || "",
            measurable_result: project.measurable_result || "",
        });
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProject) return;
        editForm.put(route("admin.projects.update", editingProject.id), {
            onSuccess: () => {
                setEditingProject(null);
                editForm.reset();
            },
        });
    };

    const handleDelete = () => {
        if (!projectToDelete) return;
        router.delete(route("admin.projects.destroy", projectToDelete.id), {
            onSuccess: () => setProjectToDelete(null),
        });
    };

    const columns: Column<Project>[] = [
        {
            header: "FLAGSHIP PROJECT",
            cell: (p) => (
                <div className="flex items-center gap-3">
                    <img
                        src={p.cover_image}
                        alt={p.title}
                        className="w-10 h-10 rounded-lg object-cover bg-surface-2 border border-line"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src =
                                "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80";
                        }}
                    />
                    <div>
                        <div className="font-semibold text-ink">{p.title}</div>
                        <div className="text-xs text-subtle">
                            {p.client_name} • {p.year}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            header: "DISCIPLINE",
            cell: (p) => (
                <Badge variant="secondary">
                    {p.category?.name || "Unassigned"}
                </Badge>
            ),
        },
        {
            header: "STATUS",
            cell: (p) => (
                <div className="flex flex-wrap gap-1">
                    {p.featured && <Badge variant="accent">FEATURED</Badge>}
                    {(p as any).is_concept ? (
                        <span className="px-2 py-0.5 rounded text-2xs font-bold bg-warning-soft text-warning border border-warning/25">
                            CONCEPT
                        </span>
                    ) : (
                        <Badge variant="outline">CLIENT WORK</Badge>
                    )}
                </div>
            ),
        },
        {
            header: "ORDER",
            cell: (p) => (
                <span className="text-xs text-subtle">
                    #{p.sort_order}
                </span>
            ),
        },
        {
            header: "",
            className: "text-right",
            cell: (p) => (
                <div className="flex items-center justify-end gap-1">
                    {p.live_url && (
                        <a
                            href={p.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-subtle hover:text-ink transition-colors"
                        >
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    )}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-subtle hover:text-ink"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => openEdit(p)}
                                className="gap-2"
                            >
                                <Edit className="w-3.5 h-3.5" />
                                <span>Edit Project</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setProjectToDelete(p)}
                                className="gap-2 text-danger focus:text-danger"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Purge Project</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
        },
    ];

    return (
        <AdminLayout title="PORTFOLIO & FLAGSHIPS">
            <AdminPageHeader
                title="Projects Management"
                description="Curate kinetic showcases, digital flagships, and spatial 3D experiences."
                actionLabel="Create Project"
                onActionClick={() => setIsCreateOpen(true)}
            />

            <AdminDataTable
                columns={columns}
                data={projects}
                searchKey="title"
                searchPlaceholder="Search projects by title..."
            />

            {/* Create Project Modal */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Commission New Flagship Project</DialogTitle>
                        <DialogDescription>
                            Define project assets, metadata, client credentials, and deliverables.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleCreate} className="space-y-5 pt-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs uppercase text-subtle">
                                    Project Title *
                                </label>
                                <Input
                                    value={createForm.data.title}
                                    onChange={(e) =>
                                        createForm.setData("title", e.target.value)
                                    }
                                    placeholder="e.g. Lumina Hyperdrive"
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs uppercase text-subtle">
                                    Client / Brand *
                                </label>
                                <Input
                                    value={createForm.data.client_name}
                                    onChange={(e) =>
                                        createForm.setData("client_name", e.target.value)
                                    }
                                    placeholder="e.g. Porsche Digital"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs uppercase text-subtle">
                                    Custom URL Slug (Optional)
                                </label>
                                <Input
                                    value={createForm.data.slug}
                                    onChange={(e) =>
                                        createForm.setData("slug", e.target.value)
                                    }
                                    placeholder="auto-generated-if-empty"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs uppercase text-subtle">
                                    H1 Headline Override
                                </label>
                                <Input
                                    value={createForm.data.h1_title}
                                    onChange={(e) =>
                                        createForm.setData("h1_title", e.target.value)
                                    }
                                    placeholder="Leave empty to use title"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs uppercase text-subtle">
                                    Release Year *
                                </label>
                                <Input
                                    value={createForm.data.year}
                                    onChange={(e) =>
                                        createForm.setData("year", e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs uppercase text-subtle">
                                    Discipline Category
                                </label>
                                <Select
                                    value={
                                        createForm.data.category_id
                                            ? String(createForm.data.category_id)
                                            : "uncategorized"
                                    }
                                    onValueChange={(val) =>
                                        createForm.setData("category_id", val === "uncategorized" ? "" : val)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Uncategorized" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="uncategorized">Uncategorized</SelectItem>
                                        {categories.map((c) => (
                                             <SelectItem key={c.id} value={String(c.id)}>
                                                 {c.name}
                                             </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs uppercase text-subtle">
                                    Display Order
                                </label>
                                <Input
                                    type="number"
                                    value={createForm.data.sort_order}
                                    onChange={(e) =>
                                        createForm.setData(
                                            "sort_order",
                                            Number(e.target.value)
                                        )
                                    }
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs uppercase text-subtle">
                                Cover Image Asset Path / URL *
                            </label>
                            <Input
                                value={createForm.data.cover_image}
                                onChange={(e) =>
                                    createForm.setData("cover_image", e.target.value)
                                }
                                placeholder="https://... or /images/work/project-1.jpg"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs uppercase text-subtle">
                                Executive Summary *
                            </label>
                            <Textarea
                                value={createForm.data.summary}
                                onChange={(e) =>
                                    createForm.setData("summary", e.target.value)
                                }
                                placeholder="High-impact synopsis for marquee cards..."
                                rows={2}
                                required
                            />
                        </div>

                        {/* B2B Case Study Narrative (§6.2 Outline) */}
                        <div className="p-4 rounded-xl bg-surface-2 border border-line space-y-4">
                            <span className="text-xs uppercase tracking-wider text-primary-ink font-bold block">
                                Case Study Narrative (Challenge, Execution & Outcome)
                            </span>

                            <div className="space-y-1.5">
                                <label className="text-xs uppercase text-subtle">
                                    01. Client Situation & Challenge
                                </label>
                                <Textarea
                                    value={createForm.data.client_challenge}
                                    onChange={(e) =>
                                        createForm.setData("client_challenge", e.target.value)
                                    }
                                    placeholder="Describe the production bottleneck or scale challenge..."
                                    rows={2}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs uppercase text-subtle">
                                    02. Execution & Work Done
                                </label>
                                <Textarea
                                    value={createForm.data.work_done}
                                    onChange={(e) =>
                                        createForm.setData("work_done", e.target.value)
                                    }
                                    placeholder="Describe the retouching pipelines, pen tool vector clipping, or CGI shaders built..."
                                    rows={2}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs uppercase text-subtle">
                                    03. Measurable Commercial Result
                                </label>
                                <Textarea
                                    value={createForm.data.measurable_result}
                                    onChange={(e) =>
                                        createForm.setData("measurable_result", e.target.value)
                                    }
                                    placeholder="e.g. Delivered 4,800 SKUs in 48 hours with 99.8% first-pass approval..."
                                    rows={2}
                                />
                            </div>
                        </div>

                        {/* SEO Metadata */}
                        <div className="p-4 rounded-xl bg-surface-2 border border-line space-y-3">
                            <span className="text-xs uppercase tracking-wider text-ink-2 font-bold block">
                                Page-Level SEO Metadata
                            </span>

                            <div className="space-y-1.5">
                                <label className="text-xs uppercase text-subtle">
                                    Meta Title
                                </label>
                                <Input
                                    value={createForm.data.meta_title}
                                    onChange={(e) =>
                                        createForm.setData("meta_title", e.target.value)
                                    }
                                    placeholder="Target Keyword | Cutting Edger"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs uppercase text-subtle">
                                    Meta Description
                                </label>
                                <Textarea
                                    value={createForm.data.meta_description}
                                    onChange={(e) =>
                                        createForm.setData("meta_description", e.target.value)
                                    }
                                    placeholder="Compelling synopsis for SERP snippets..."
                                    rows={2}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs uppercase text-subtle">
                                    Canonical URL Override (Optional)
                                </label>
                                <Input
                                    value={createForm.data.canonical_url}
                                    onChange={(e) =>
                                        createForm.setData("canonical_url", e.target.value)
                                    }
                                    placeholder="Default: self (/case-studies/...)"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs uppercase text-subtle">
                                Live Demonstration URL (Optional)
                            </label>
                            <Input
                                type="url"
                                value={createForm.data.live_url}
                                onChange={(e) =>
                                    createForm.setData("live_url", e.target.value)
                                }
                                placeholder="https://client-showcase.com"
                            />
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-surface-2 border border-line">
                            <div>
                                <span className="text-xs font-semibold text-ink block">
                                    Featured Flagship
                                </span>
                                <span className="text-2xs text-subtle block">
                                    Promote to home page marquee sticky showcases.
                                </span>
                            </div>
                            <Switch
                                checked={createForm.data.featured}
                                onCheckedChange={(val) =>
                                    createForm.setData("featured", val)
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-warning-soft border border-warning/25">
                            <div>
                                <span className="text-xs font-semibold text-warning block">
                                    Concept / Speculative Case Study
                                </span>
                                <span className="text-2xs text-subtle block">
                                    Tags project as Concept Work to maintain B2B enterprise transparency.
                                </span>
                            </div>
                            <Switch
                                checked={createForm.data.is_concept}
                                onCheckedChange={(val) =>
                                    createForm.setData("is_concept", val)
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-danger-soft border border-danger/25">
                            <div>
                                <span className="text-xs font-semibold text-danger block">
                                    Noindex (Exclude from Search Engines)
                                </span>
                                <span className="text-2xs text-subtle block">
                                    Prevents crawlers and sitemap inclusion for unreleased or sensitive client work.
                                </span>
                            </div>
                            <Switch
                                checked={createForm.data.is_noindex}
                                onCheckedChange={(val) =>
                                    createForm.setData("is_noindex", val)
                                }
                            />
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCreateOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={createForm.processing}
                            >
                                {createForm.processing ? "Publishing..." : "Publish Project"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Project Modal */}
            <Dialog
                open={!!editingProject}
                onOpenChange={(open) => !open && setEditingProject(null)}
            >
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Modify Project Blueprint</DialogTitle>
                        <DialogDescription>
                            Revise specifications, live links, and asset references.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleUpdate} className="space-y-5 pt-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs uppercase text-subtle">
                                    Project Title *
                                </label>
                                <Input
                                    value={editForm.data.title}
                                    onChange={(e) =>
                                        editForm.setData("title", e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs uppercase text-subtle">
                                    Client / Brand *
                                </label>
                                <Input
                                    value={editForm.data.client_name}
                                    onChange={(e) =>
                                        editForm.setData("client_name", e.target.value)
                                    }
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs uppercase text-subtle">
                                    Custom URL Slug
                                </label>
                                <Input
                                    value={editForm.data.slug}
                                    onChange={(e) =>
                                        editForm.setData("slug", e.target.value)
                                    }
                                    placeholder="e.g. lumina-hyperdrive"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs uppercase text-subtle">
                                    H1 Headline Override
                                </label>
                                <Input
                                    value={editForm.data.h1_title}
                                    onChange={(e) =>
                                        editForm.setData("h1_title", e.target.value)
                                    }
                                    placeholder="Leave empty to use title"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs uppercase text-subtle">
                                    Release Year *
                                </label>
                                <Input
                                    value={editForm.data.year}
                                    onChange={(e) =>
                                        editForm.setData("year", e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs uppercase text-subtle">
                                    Discipline Category
                                </label>
                                <select
                                    value={editForm.data.category_id}
                                    onChange={(e) =>
                                        editForm.setData("category_id", e.target.value)
                                    }
                                    className="w-full h-10 rounded-lg bg-surface-2 border border-line px-3 text-sm text-ink focus:outline-none focus:ring-1 focus:ring-ring"
                                >
                                    <option value="">Uncategorized</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs uppercase text-subtle">
                                    Display Order
                                </label>
                                <Input
                                    type="number"
                                    value={editForm.data.sort_order}
                                    onChange={(e) =>
                                        editForm.setData(
                                            "sort_order",
                                            Number(e.target.value)
                                        )
                                    }
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs uppercase text-subtle">
                                Cover Image Asset Path / URL *
                            </label>
                            <Input
                                value={editForm.data.cover_image}
                                onChange={(e) =>
                                    editForm.setData("cover_image", e.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs uppercase text-subtle">
                                Executive Summary *
                            </label>
                            <Textarea
                                value={editForm.data.summary}
                                onChange={(e) =>
                                    editForm.setData("summary", e.target.value)
                                }
                                rows={2}
                                required
                            />
                        </div>

                        {/* B2B Case Study Narrative (§6.2 Outline) */}
                        <div className="p-4 rounded-xl bg-surface-2 border border-line space-y-4">
                            <span className="text-xs uppercase tracking-wider text-primary-ink font-bold block">
                                Case Study Narrative (Challenge, Execution & Outcome)
                            </span>

                            <div className="space-y-1.5">
                                <label className="text-xs uppercase text-subtle">
                                    01. Client Situation & Challenge
                                </label>
                                <Textarea
                                    value={editForm.data.client_challenge}
                                    onChange={(e) =>
                                        editForm.setData("client_challenge", e.target.value)
                                    }
                                    placeholder="Describe the production bottleneck or scale challenge..."
                                    rows={2}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs uppercase text-subtle">
                                    02. Execution & Work Done
                                </label>
                                <Textarea
                                    value={editForm.data.work_done}
                                    onChange={(e) =>
                                        editForm.setData("work_done", e.target.value)
                                    }
                                    placeholder="Describe the retouching pipelines, pen tool vector clipping, or CGI shaders built..."
                                    rows={2}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs uppercase text-subtle">
                                    03. Measurable Commercial Result
                                </label>
                                <Textarea
                                    value={editForm.data.measurable_result}
                                    onChange={(e) =>
                                        editForm.setData("measurable_result", e.target.value)
                                    }
                                    placeholder="e.g. Delivered 4,800 SKUs in 48 hours with 99.8% first-pass approval..."
                                    rows={2}
                                />
                            </div>
                        </div>

                        {/* SEO Metadata */}
                        <div className="p-4 rounded-xl bg-surface-2 border border-line space-y-3">
                            <span className="text-xs uppercase tracking-wider text-ink-2 font-bold block">
                                Page-Level SEO Metadata
                            </span>

                            <div className="space-y-1.5">
                                <label className="text-xs uppercase text-subtle">
                                    Meta Title
                                </label>
                                <Input
                                    value={editForm.data.meta_title}
                                    onChange={(e) =>
                                        editForm.setData("meta_title", e.target.value)
                                    }
                                    placeholder="Target Keyword | Cutting Edger"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs uppercase text-subtle">
                                    Meta Description
                                </label>
                                <Textarea
                                    value={editForm.data.meta_description}
                                    onChange={(e) =>
                                        editForm.setData("meta_description", e.target.value)
                                    }
                                    placeholder="Compelling synopsis for SERP snippets..."
                                    rows={2}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs uppercase text-subtle">
                                    Canonical URL Override (Optional)
                                </label>
                                <Input
                                    value={editForm.data.canonical_url}
                                    onChange={(e) =>
                                        editForm.setData("canonical_url", e.target.value)
                                    }
                                    placeholder="Default: self (/case-studies/...)"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs uppercase text-subtle">
                                Live Demonstration URL (Optional)
                            </label>
                            <Input
                                type="url"
                                value={editForm.data.live_url}
                                onChange={(e) =>
                                    editForm.setData("live_url", e.target.value)
                                }
                                placeholder="https://client-showcase.com"
                            />
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-surface-2 border border-line">
                            <div>
                                <span className="text-xs font-semibold text-ink block">
                                    Featured Flagship
                                </span>
                                <span className="text-2xs text-subtle block">
                                    Promote to home page marquee sticky showcases.
                                </span>
                            </div>
                            <Switch
                                checked={editForm.data.featured}
                                onCheckedChange={(val) =>
                                    editForm.setData("featured", val)
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-warning-soft border border-warning/25">
                            <div>
                                <span className="text-xs font-semibold text-warning block">
                                    Concept / Speculative Case Study
                                </span>
                                <span className="text-2xs text-subtle block">
                                    Tags project as Concept Work to maintain B2B enterprise transparency.
                                </span>
                            </div>
                            <Switch
                                checked={editForm.data.is_concept}
                                onCheckedChange={(val) =>
                                    editForm.setData("is_concept", val)
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-danger-soft border border-danger/25">
                            <div>
                                <span className="text-xs font-semibold text-danger block">
                                    Noindex (Exclude from Search Engines)
                                </span>
                                <span className="text-2xs text-subtle block">
                                    Prevents crawlers and sitemap inclusion for unreleased or sensitive client work.
                                </span>
                            </div>
                            <Switch
                                checked={editForm.data.is_noindex}
                                onCheckedChange={(val) =>
                                    editForm.setData("is_noindex", val)
                                }
                            />
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditingProject(null)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={editForm.processing}
                            >
                                {editForm.processing ? "Saving..." : "Save Modifications"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Confirm Delete */}
            <AlertDialog
                open={!!projectToDelete}
                onOpenChange={(open) => !open && setProjectToDelete(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Purge Flagship Project?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you certain you wish to archive project{" "}
                            <span className="text-ink font-semibold">
                                {projectToDelete?.title}
                            </span>
                            ?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                            Purge Project
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}
