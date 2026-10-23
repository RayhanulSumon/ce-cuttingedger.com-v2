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
    });

    const editForm = useForm({
        title: "",
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
            client_name: project.client_name,
            year: project.year,
            category_id: project.category_id || "",
            summary: project.summary,
            description: project.description || "",
            cover_image: project.cover_image,
            featured: project.featured,
            is_concept: Boolean((project as any).is_concept),
            sort_order: project.sort_order,
            live_url: project.live_url || "",
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
                        className="w-10 h-10 rounded-lg object-cover bg-neutral-900 border border-white/10"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src =
                                "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80";
                        }}
                    />
                    <div>
                        <div className="font-semibold text-white">{p.title}</div>
                        <div className="text-xs text-neutral-400 font-mono">
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
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
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
                <span className="font-mono text-xs text-neutral-400">
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
                            className="p-1.5 text-neutral-400 hover:text-white transition-colors"
                        >
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    )}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-neutral-400 hover:text-white"
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
                                className="gap-2 text-rose-400 focus:text-rose-400"
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
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Commission New Flagship Project</DialogTitle>
                        <DialogDescription>
                            Define project assets, metadata, client credentials, and deliverables.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleCreate} className="space-y-4 pt-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase text-neutral-400">
                                    Project Title
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
                                <label className="text-xs font-mono uppercase text-neutral-400">
                                    Client / Brand
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

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase text-neutral-400">
                                    Release Year
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
                                <label className="text-xs font-mono uppercase text-neutral-400">
                                    Discipline Category
                                </label>
                                <Select
                                    value={createForm.data.category_id || "uncategorized"}
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
                                <label className="text-xs font-mono uppercase text-neutral-400">
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
                            <label className="text-xs font-mono uppercase text-neutral-400">
                                Cover Image Asset Path / URL
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
                            <label className="text-xs font-mono uppercase text-neutral-400">
                                Executive Summary
                            </label>
                            <Textarea
                                value={createForm.data.summary}
                                onChange={(e) =>
                                    createForm.setData("summary", e.target.value)
                                }
                                placeholder="High-impact synopsis for marquee cards..."
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-mono uppercase text-neutral-400">
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

                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                            <div>
                                <span className="text-xs font-semibold text-white block">
                                    Featured Flagship
                                </span>
                                <span className="text-[11px] text-neutral-400 block">
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

                        <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                            <div>
                                <span className="text-xs font-semibold text-amber-300 block">
                                    Concept / Speculative Case Study
                                </span>
                                <span className="text-[11px] text-neutral-400 block">
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
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Modify Project Blueprint</DialogTitle>
                        <DialogDescription>
                            Revise specifications, live links, and asset references.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleUpdate} className="space-y-4 pt-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase text-neutral-400">
                                    Project Title
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
                                <label className="text-xs font-mono uppercase text-neutral-400">
                                    Client / Brand
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

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase text-neutral-400">
                                    Release Year
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
                                <label className="text-xs font-mono uppercase text-neutral-400">
                                    Discipline Category
                                </label>
                                <select
                                    value={editForm.data.category_id}
                                    onChange={(e) =>
                                        editForm.setData("category_id", e.target.value)
                                    }
                                    className="w-full h-10 rounded-lg bg-[#0d0f15] border border-white/10 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#d4ff00]"
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
                                <label className="text-xs font-mono uppercase text-neutral-400">
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
                            <label className="text-xs font-mono uppercase text-neutral-400">
                                Cover Image Asset Path / URL
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
                            <label className="text-xs font-mono uppercase text-neutral-400">
                                Executive Summary
                            </label>
                            <Textarea
                                value={editForm.data.summary}
                                onChange={(e) =>
                                    editForm.setData("summary", e.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-mono uppercase text-neutral-400">
                                Live Demonstration URL
                            </label>
                            <Input
                                type="url"
                                value={editForm.data.live_url}
                                onChange={(e) =>
                                    editForm.setData("live_url", e.target.value)
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                            <div>
                                <span className="text-xs font-semibold text-white block">
                                    Featured Flagship
                                </span>
                                <span className="text-[11px] text-neutral-400 block">
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

                        <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                            <div>
                                <span className="text-xs font-semibold text-amber-300 block">
                                    Concept / Speculative Case Study
                                </span>
                                <span className="text-[11px] text-neutral-400 block">
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
                            <span className="text-white font-semibold">
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
