import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import { AdminLayout } from "@/Layouts/Admin/AdminLayout";
import { AdminPageHeader } from "@/Components/Admin/UI/AdminPageHeader";
import { AdminDataTable, Column } from "@/Components/Admin/UI/AdminDataTable";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Badge } from "@/Components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/Components/ui/dialog";
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
import { MoreHorizontal, Edit, Trash2, FolderTree, Tag, CornerDownRight } from "lucide-react";
import { BlogCategory } from "@/types/models";

interface BlogCategoriesIndexProps {
    categories: BlogCategory[];
    parentCategories: BlogCategory[];
}

export default function BlogCategoriesIndex({
    categories = [],
    parentCategories = [],
}: BlogCategoriesIndexProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(null);
    const [categoryToDelete, setCategoryToDelete] = useState<BlogCategory | null>(null);

    const createForm = useForm({
        name: "",
        slug: "",
        parent_id: "" as number | string,
        description: "",
    });

    const editForm = useForm({
        name: "",
        slug: "",
        parent_id: "" as number | string,
        description: "",
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(route("admin.blog-categories.store"), {
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
            },
        });
    };

    const openEdit = (cat: BlogCategory) => {
        setEditingCategory(cat);
        editForm.setData({
            name: cat.name,
            slug: cat.slug,
            parent_id: cat.parent_id || "",
            description: cat.description || "",
        });
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCategory) return;
        editForm.put(route("admin.blog-categories.update", editingCategory.id), {
            onSuccess: () => {
                setEditingCategory(null);
            },
        });
    };

    const handleDelete = () => {
        if (!categoryToDelete) return;
        editForm.delete(route("admin.blog-categories.destroy", categoryToDelete.id), {
            onSuccess: () => {
                setCategoryToDelete(null);
            },
        });
    };

    const columns: Column<BlogCategory>[] = [
        {
            key: "name",
            header: "CATEGORY / TAXONOMY",
            sortable: true,
            cell: (c) => (
                <div className="flex items-center gap-2">
                    {c.parent_id ? (
                        <div className="flex items-center gap-1.5 text-subtle pl-4 text-xs">
                            <CornerDownRight className="w-3.5 h-3.5 text-primary-ink" />
                            <span className="text-ink font-medium">{c.name}</span>
                            <span className="text-2xs text-subtle uppercase px-1.5 py-0.5 rounded bg-surface-2 border border-line">
                                Subcategory of {c.parent?.name}
                            </span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 font-medium text-ink">
                            <Tag className="w-3.5 h-3.5 text-primary-ink" />
                            <span>{c.name}</span>
                            {c.subcategories && c.subcategories.length > 0 && (
                                <Badge variant="outline" className="text-2xs text-primary-ink border-primary/30 bg-primary-soft/60">
                                    {c.subcategories.length} subcategories
                                </Badge>
                            )}
                        </div>
                    )}
                </div>
            ),
        },
        {
            key: "slug",
            header: "URL SLUG",
            cell: (c) => (
                <span className="text-xs text-subtle">
                    /blog?category={c.slug}
                </span>
            ),
        },
        {
            key: "description",
            header: "DESCRIPTION / CONTEXT",
            cell: (c) => (
                <span className="text-xs text-subtle line-clamp-1 max-w-sm">
                    {c.description || "—"}
                </span>
            ),
        },
        {
            key: "blogs_count",
            header: "ARTICLES",
            cell: (c) => (
                <span className="text-xs text-primary-ink">
                    {c.blogs_count ?? 0} Published
                </span>
            ),
        },
        {
            key: "actions",
            header: "ACTION",
            className: "text-right",
            cell: (c) => (
                <div className="flex justify-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-subtle hover:text-ink hover:bg-surface-2"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="bg-surface border-line text-ink min-w-[140px]"
                        >
                            <DropdownMenuItem
                                onClick={() => openEdit(c)}
                                className="cursor-pointer text-xs focus:bg-primary focus:text-primary-foreground"
                            >
                                <Edit className="mr-2 h-3.5 w-3.5" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setCategoryToDelete(c)}
                                className="cursor-pointer text-xs text-danger focus:bg-danger focus:text-white"
                            >
                                <Trash2 className="mr-2 h-3.5 w-3.5" />
                                Move to Trash
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
        },
    ];

    return (
        <AdminLayout title="Blog Categories & Subcategories">
            <div className="space-y-6">
                <AdminPageHeader
                    eyebrow="EDITORIAL TAXONOMY"
                    title="Blog Categories & Subcategories"
                    description="Structure blog posts with top-level blog categories and targeted subcategories for pristine SEO indexing."
                    createLabel="New Blog Category / Subcategory"
                    onCreate={() => setIsCreateOpen(true)}
                />

                <AdminDataTable
                    data={categories}
                    columns={columns}
                    searchKey="name"
                    searchPlaceholder="Filter blog categories by name..."
                />

                {/* CREATE MODAL */}
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogContent className="sm:max-w-xl bg-surface border-line text-ink shadow-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold tracking-tight text-ink flex items-center gap-2">
                                <FolderTree className="w-5 h-5 text-primary-ink" />
                                REGISTER BLOG CATEGORY
                            </DialogTitle>
                            <DialogDescription className="text-subtle text-xs">
                                Create a primary blog category or nest as a subcategory under an existing parent.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleCreate} className="space-y-4 pt-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs text-ink-2">
                                        Category Name *
                                    </label>
                                    <Input
                                        placeholder="e.g. Design Systems"
                                        value={createForm.data.name}
                                        onChange={(e) =>
                                            createForm.setData("name", e.target.value)
                                        }
                                        className="bg-surface border-line focus:border-ring"
                                        required
                                    />
                                    {createForm.errors.name && (
                                        <p className="text-danger text-xs">
                                            {createForm.errors.name}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs text-ink-2">
                                        Slug (Optional - auto-generated)
                                    </label>
                                    <Input
                                        placeholder="e.g. design-systems"
                                        value={createForm.data.slug}
                                        onChange={(e) =>
                                            createForm.setData("slug", e.target.value)
                                        }
                                        className="bg-surface border-line focus:border-ring"
                                    />
                                    {createForm.errors.slug && (
                                        <p className="text-danger text-xs">
                                            {createForm.errors.slug}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs text-ink-2">
                                    Parent Category (Select if this is a Subcategory)
                                </label>
                                <select
                                    value={createForm.data.parent_id}
                                    onChange={(e) =>
                                        createForm.setData("parent_id", e.target.value)
                                    }
                                    className="w-full h-10 px-3 rounded-md bg-surface border border-line text-ink text-sm focus:border-ring focus:outline-none"
                                >
                                    <option value="">None (Primary Root Category)</option>
                                    {parentCategories.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            Parent: {p.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs text-ink-2">
                                    Description / Meta Scope
                                </label>
                                <Textarea
                                    rows={3}
                                    placeholder="Brief summary of topics covered in this category for editorial and SEO clarity..."
                                    value={createForm.data.description}
                                    onChange={(e) =>
                                        createForm.setData("description", e.target.value)
                                    }
                                    className="bg-surface border-line focus:border-ring"
                                />
                            </div>

                            <DialogFooter className="pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsCreateOpen(false)}
                                    className="border-line text-subtle hover:text-ink"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={createForm.processing}
                                    className="bg-primary hover:bg-primary-hover text-primary-foreground font-bold"
                                >
                                    {createForm.processing ? "Saving..." : "Create Category"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* EDIT MODAL */}
                <Dialog
                    open={!!editingCategory}
                    onOpenChange={(open) => !open && setEditingCategory(null)}
                >
                    <DialogContent className="sm:max-w-xl bg-surface border-line text-ink shadow-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold tracking-tight text-ink flex items-center gap-2">
                                <Edit className="w-5 h-5 text-primary-ink" />
                                EDIT BLOG CATEGORY
                            </DialogTitle>
                            <DialogDescription className="text-subtle text-xs">
                                Modify name, URL slug, description, or parent relationship.
                            </DialogDescription>
                        </DialogHeader>

                        {editingCategory && (
                            <form onSubmit={handleUpdate} className="space-y-4 pt-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs text-ink-2">
                                            Category Name *
                                        </label>
                                        <Input
                                            value={editForm.data.name}
                                            onChange={(e) =>
                                                editForm.setData("name", e.target.value)
                                            }
                                            className="bg-surface border-line focus:border-ring"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs text-ink-2">
                                            Slug *
                                        </label>
                                        <Input
                                            value={editForm.data.slug}
                                            onChange={(e) =>
                                                editForm.setData("slug", e.target.value)
                                            }
                                            className="bg-surface border-line focus:border-ring"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs text-ink-2">
                                        Parent Category
                                    </label>
                                    <select
                                        value={editForm.data.parent_id}
                                        onChange={(e) =>
                                            editForm.setData("parent_id", e.target.value)
                                        }
                                        className="w-full h-10 px-3 rounded-md bg-surface border border-line text-ink text-sm focus:border-ring focus:outline-none"
                                    >
                                        <option value="">None (Primary Root Category)</option>
                                        {parentCategories
                                            .filter((p) => p.id !== editingCategory.id)
                                            .map((p) => (
                                                <option key={p.id} value={p.id}>
                                                    Parent: {p.name}
                                                </option>
                                            ))}
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs text-ink-2">
                                        Description
                                    </label>
                                    <Textarea
                                        rows={3}
                                        value={editForm.data.description}
                                        onChange={(e) =>
                                            editForm.setData("description", e.target.value)
                                        }
                                        className="bg-surface border-line focus:border-ring"
                                    />
                                </div>

                                <DialogFooter className="pt-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setEditingCategory(null)}
                                        className="border-line text-subtle hover:text-ink"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={editForm.processing}
                                        className="bg-primary hover:bg-primary-hover text-primary-foreground font-bold"
                                    >
                                        {editForm.processing ? "Updating..." : "Commit Update"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        )}
                    </DialogContent>
                </Dialog>

                {/* DELETE DIALOG */}
                <AlertDialog
                    open={!!categoryToDelete}
                    onOpenChange={(open) => !open && setCategoryToDelete(null)}
                >
                    <AlertDialogContent className="bg-surface border-line text-ink">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-danger">
                                PURGE BLOG CATEGORY
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-subtle text-xs">
                                Are you sure you wish to delete &ldquo;{categoryToDelete?.name}&rdquo;?
                                Articles assigned to this category will remain intact with an unassigned status.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="border-line text-subtle hover:text-ink">
                                Abort
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDelete}
                                className="bg-danger hover:bg-danger-hover text-white font-bold"
                            >
                                Confirm Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AdminLayout>
    );
}
