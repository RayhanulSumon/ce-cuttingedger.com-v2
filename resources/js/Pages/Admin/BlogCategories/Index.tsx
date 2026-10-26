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
                        <div className="flex items-center gap-1.5 text-neutral-400 pl-4 font-mono text-xs">
                            <CornerDownRight className="w-3.5 h-3.5 text-[#d4ff00]" />
                            <span className="text-white font-medium">{c.name}</span>
                            <span className="text-[10px] text-neutral-500 uppercase px-1.5 py-0.5 rounded bg-white/5 border border-white/5">
                                Subcategory of {c.parent?.name}
                            </span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 font-medium text-white">
                            <Tag className="w-3.5 h-3.5 text-[#d4ff00]" />
                            <span>{c.name}</span>
                            {c.subcategories && c.subcategories.length > 0 && (
                                <Badge variant="outline" className="text-[10px] font-mono text-[#d4ff00] border-[#d4ff00]/30 bg-[#d4ff00]/5">
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
                <span className="font-mono text-xs text-neutral-400">
                    /blog?category={c.slug}
                </span>
            ),
        },
        {
            key: "description",
            header: "DESCRIPTION / CONTEXT",
            cell: (c) => (
                <span className="text-xs text-neutral-400 line-clamp-1 max-w-sm">
                    {c.description || "—"}
                </span>
            ),
        },
        {
            key: "blogs_count",
            header: "ARTICLES",
            cell: (c) => (
                <span className="text-xs font-mono text-[#d4ff00]">
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
                                className="h-8 w-8 p-0 text-neutral-400 hover:text-white hover:bg-white/10"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="bg-[#12131a] border-white/10 text-white min-w-[140px]"
                        >
                            <DropdownMenuItem
                                onClick={() => openEdit(c)}
                                className="cursor-pointer text-xs focus:bg-[#d4ff00] focus:text-black"
                            >
                                <Edit className="mr-2 h-3.5 w-3.5" />
                                Edit Category
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setCategoryToDelete(c)}
                                className="cursor-pointer text-xs text-rose-400 focus:bg-rose-500 focus:text-white"
                            >
                                <Trash2 className="mr-2 h-3.5 w-3.5" />
                                Purge Category
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
                    <DialogContent className="sm:max-w-xl bg-[#0c0d12] border-white/10 text-white shadow-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold font-mono tracking-tight text-white flex items-center gap-2">
                                <FolderTree className="w-5 h-5 text-[#d4ff00]" />
                                REGISTER BLOG CATEGORY
                            </DialogTitle>
                            <DialogDescription className="text-neutral-400 text-xs font-mono">
                                Create a primary blog category or nest as a subcategory under an existing parent.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleCreate} className="space-y-4 pt-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-mono text-neutral-300">
                                        Category Name *
                                    </label>
                                    <Input
                                        placeholder="e.g. Design Systems"
                                        value={createForm.data.name}
                                        onChange={(e) =>
                                            createForm.setData("name", e.target.value)
                                        }
                                        className="bg-[#12131a] border-white/10 focus:border-[#d4ff00]"
                                        required
                                    />
                                    {createForm.errors.name && (
                                        <p className="text-rose-400 text-xs font-mono">
                                            {createForm.errors.name}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-mono text-neutral-300">
                                        Slug (Optional - auto-generated)
                                    </label>
                                    <Input
                                        placeholder="e.g. design-systems"
                                        value={createForm.data.slug}
                                        onChange={(e) =>
                                            createForm.setData("slug", e.target.value)
                                        }
                                        className="bg-[#12131a] border-white/10 focus:border-[#d4ff00]"
                                    />
                                    {createForm.errors.slug && (
                                        <p className="text-rose-400 text-xs font-mono">
                                            {createForm.errors.slug}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-mono text-neutral-300">
                                    Parent Category (Select if this is a Subcategory)
                                </label>
                                <select
                                    value={createForm.data.parent_id}
                                    onChange={(e) =>
                                        createForm.setData("parent_id", e.target.value)
                                    }
                                    className="w-full h-10 px-3 rounded-md bg-[#12131a] border border-white/10 text-white text-sm focus:border-[#d4ff00] focus:outline-none"
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
                                <label className="text-xs font-mono text-neutral-300">
                                    Description / Meta Scope
                                </label>
                                <Textarea
                                    rows={3}
                                    placeholder="Brief summary of topics covered in this category for editorial and SEO clarity..."
                                    value={createForm.data.description}
                                    onChange={(e) =>
                                        createForm.setData("description", e.target.value)
                                    }
                                    className="bg-[#12131a] border-white/10 focus:border-[#d4ff00]"
                                />
                            </div>

                            <DialogFooter className="pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsCreateOpen(false)}
                                    className="border-white/10 text-neutral-400 hover:text-white"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={createForm.processing}
                                    className="bg-[#d4ff00] hover:bg-[#b8dd00] text-black font-mono font-bold"
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
                    <DialogContent className="sm:max-w-xl bg-[#0c0d12] border-white/10 text-white shadow-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold font-mono tracking-tight text-white flex items-center gap-2">
                                <Edit className="w-5 h-5 text-[#d4ff00]" />
                                EDIT BLOG CATEGORY
                            </DialogTitle>
                            <DialogDescription className="text-neutral-400 text-xs font-mono">
                                Modify name, URL slug, description, or parent relationship.
                            </DialogDescription>
                        </DialogHeader>

                        {editingCategory && (
                            <form onSubmit={handleUpdate} className="space-y-4 pt-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-mono text-neutral-300">
                                            Category Name *
                                        </label>
                                        <Input
                                            value={editForm.data.name}
                                            onChange={(e) =>
                                                editForm.setData("name", e.target.value)
                                            }
                                            className="bg-[#12131a] border-white/10 focus:border-[#d4ff00]"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-mono text-neutral-300">
                                            Slug *
                                        </label>
                                        <Input
                                            value={editForm.data.slug}
                                            onChange={(e) =>
                                                editForm.setData("slug", e.target.value)
                                            }
                                            className="bg-[#12131a] border-white/10 focus:border-[#d4ff00]"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-mono text-neutral-300">
                                        Parent Category
                                    </label>
                                    <select
                                        value={editForm.data.parent_id}
                                        onChange={(e) =>
                                            editForm.setData("parent_id", e.target.value)
                                        }
                                        className="w-full h-10 px-3 rounded-md bg-[#12131a] border border-white/10 text-white text-sm focus:border-[#d4ff00] focus:outline-none"
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
                                    <label className="text-xs font-mono text-neutral-300">
                                        Description
                                    </label>
                                    <Textarea
                                        rows={3}
                                        value={editForm.data.description}
                                        onChange={(e) =>
                                            editForm.setData("description", e.target.value)
                                        }
                                        className="bg-[#12131a] border-white/10 focus:border-[#d4ff00]"
                                    />
                                </div>

                                <DialogFooter className="pt-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setEditingCategory(null)}
                                        className="border-white/10 text-neutral-400 hover:text-white"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={editForm.processing}
                                        className="bg-[#d4ff00] hover:bg-[#b8dd00] text-black font-mono font-bold"
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
                    <AlertDialogContent className="bg-[#0c0d12] border-white/10 text-white">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="font-mono text-rose-400">
                                PURGE BLOG CATEGORY
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-neutral-400 text-xs font-mono">
                                Are you sure you wish to delete &ldquo;{categoryToDelete?.name}&rdquo;?
                                Articles assigned to this category will remain intact with an unassigned status.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="border-white/10 text-neutral-400 hover:text-white">
                                Abort
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDelete}
                                className="bg-rose-500 hover:bg-rose-600 text-white font-mono font-bold"
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
