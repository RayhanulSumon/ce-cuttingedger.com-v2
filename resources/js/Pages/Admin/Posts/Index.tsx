import React, { useState } from "react";
import { useForm, router } from "@inertiajs/react";
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
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Post, Category, TeamMember } from "@/types/models";

interface PostsIndexProps {
    posts: Post[];
    categories: Category[];
    authors: TeamMember[];
}

export default function PostsIndex({
    posts = [],
    categories = [],
    authors = [],
}: PostsIndexProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [postToDelete, setPostToDelete] = useState<Post | null>(null);

    const createForm = useForm({
        title: "",
        category_id: categories[0]?.id || "",
        author_id: authors[0]?.id || "",
        excerpt: "",
        body: "",
        cover_image: "/images/blog/article-1.jpg",
        reading_time: 5,
    });

    const editForm = useForm({
        title: "",
        category_id: "" as number | string,
        author_id: "" as number | string,
        excerpt: "",
        body: "",
        cover_image: "",
        reading_time: 5,
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(route("admin.posts.store"), {
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
            },
        });
    };

    const openEdit = (p: Post) => {
        setEditingPost(p);
        editForm.setData({
            title: p.title,
            category_id: p.category_id || "",
            author_id: p.author_id || "",
            excerpt: p.excerpt,
            body: p.body,
            cover_image: p.cover_image,
            reading_time: p.reading_time,
        });
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingPost) return;
        editForm.put(route("admin.posts.update", editingPost.id), {
            onSuccess: () => {
                setEditingPost(null);
                editForm.reset();
            },
        });
    };

    const handleDelete = () => {
        if (!postToDelete) return;
        router.delete(route("admin.posts.destroy", postToDelete.id), {
            onSuccess: () => setPostToDelete(null),
        });
    };

    const columns: Column<Post>[] = [
        {
            header: "ARTICLE / ESSAY",
            cell: (p) => (
                <div>
                    <div className="font-semibold text-white">{p.title}</div>
                    <div className="text-xs text-neutral-400 font-mono">
                        {p.category?.name || "General"} • {p.reading_time} min read
                    </div>
                </div>
            ),
        },
        {
            header: "AUTHOR",
            cell: (p) => (
                <span className="text-xs font-mono text-neutral-300">
                    {p.author?.name || "Studio Collective"}
                </span>
            ),
        },
        {
            header: "PUBLISHED",
            cell: (p) => (
                <span className="text-xs font-mono text-neutral-400">
                    {p.published_at
                        ? new Date(p.published_at).toLocaleDateString()
                        : "Draft"}
                </span>
            ),
        },
        {
            header: "",
            className: "text-right",
            cell: (p) => (
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
                        <DropdownMenuItem onClick={() => openEdit(p)} className="gap-2">
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit Article</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => setPostToDelete(p)}
                            className="gap-2 text-rose-400 focus:text-rose-400"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Purge Article</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    return (
        <AdminLayout title="DISPATCH // ESSAYS">
            <AdminPageHeader
                title="Blog Posts & Dispatches"
                description="Studio design essays, kinetic research papers, and technical perspectives."
                actionLabel="Draft Article"
                onActionClick={() => setIsCreateOpen(true)}
            />

            <AdminDataTable
                columns={columns}
                data={posts}
                searchKey="title"
                searchPlaceholder="Search articles..."
            />

            {/* Create Post Modal */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Draft New Studio Article</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleCreate} className="space-y-4 pt-2">
                        <div className="space-y-1.5">
                            <label className="text-xs font-mono uppercase text-neutral-400">
                                Article Title
                            </label>
                            <Input
                                value={createForm.data.title}
                                onChange={(e) =>
                                    createForm.setData("title", e.target.value)
                                }
                                placeholder="e.g. Kinetic WebGL Pipelines in 2026"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase text-neutral-400">
                                    Discipline Category
                                </label>
                                <select
                                    value={createForm.data.category_id}
                                    onChange={(e) =>
                                        createForm.setData("category_id", e.target.value)
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
                                    Author
                                </label>
                                <select
                                    value={createForm.data.author_id}
                                    onChange={(e) =>
                                        createForm.setData("author_id", e.target.value)
                                    }
                                    className="w-full h-10 rounded-lg bg-[#0d0f15] border border-white/10 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#d4ff00]"
                                >
                                    <option value="">Studio Collective</option>
                                    {authors.map((a) => (
                                        <option key={a.id} value={a.id}>
                                            {a.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase text-neutral-400">
                                    Reading Minutes
                                </label>
                                <Input
                                    type="number"
                                    value={createForm.data.reading_time}
                                    onChange={(e) =>
                                        createForm.setData(
                                            "reading_time",
                                            Number(e.target.value)
                                        )
                                    }
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-mono uppercase text-neutral-400">
                                Cover Asset Path
                            </label>
                            <Input
                                value={createForm.data.cover_image}
                                onChange={(e) =>
                                    createForm.setData("cover_image", e.target.value)
                                }
                                placeholder="/images/blog/article-1.jpg"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-mono uppercase text-neutral-400">
                                Excerpt / Teaser
                            </label>
                            <Textarea
                                value={createForm.data.excerpt}
                                onChange={(e) =>
                                    createForm.setData("excerpt", e.target.value)
                                }
                                placeholder="Summary for article index..."
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-mono uppercase text-neutral-400">
                                Full Article Body (Markdown)
                            </label>
                            <Textarea
                                value={createForm.data.body}
                                onChange={(e) =>
                                    createForm.setData("body", e.target.value)
                                }
                                placeholder="Full essay content..."
                                rows={6}
                                required
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
                                {createForm.processing ? "Publishing..." : "Publish Article"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Post Modal */}
            <Dialog
                open={!!editingPost}
                onOpenChange={(open) => !open && setEditingPost(null)}
            >
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Article</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleUpdate} className="space-y-4 pt-2">
                        <div className="space-y-1.5">
                            <label className="text-xs font-mono uppercase text-neutral-400">
                                Article Title
                            </label>
                            <Input
                                value={editForm.data.title}
                                onChange={(e) =>
                                    editForm.setData("title", e.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
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
                                    Author
                                </label>
                                <select
                                    value={editForm.data.author_id}
                                    onChange={(e) =>
                                        editForm.setData("author_id", e.target.value)
                                    }
                                    className="w-full h-10 rounded-lg bg-[#0d0f15] border border-white/10 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#d4ff00]"
                                >
                                    <option value="">Studio Collective</option>
                                    {authors.map((a) => (
                                        <option key={a.id} value={a.id}>
                                            {a.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase text-neutral-400">
                                    Reading Minutes
                                </label>
                                <Input
                                    type="number"
                                    value={editForm.data.reading_time}
                                    onChange={(e) =>
                                        editForm.setData(
                                            "reading_time",
                                            Number(e.target.value)
                                        )
                                    }
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-mono uppercase text-neutral-400">
                                Cover Asset Path
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
                                Excerpt / Teaser
                            </label>
                            <Textarea
                                value={editForm.data.excerpt}
                                onChange={(e) =>
                                    editForm.setData("excerpt", e.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-mono uppercase text-neutral-400">
                                Full Article Body
                            </label>
                            <Textarea
                                value={editForm.data.body}
                                onChange={(e) =>
                                    editForm.setData("body", e.target.value)
                                }
                                rows={6}
                                required
                            />
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditingPost(null)}
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
                open={!!postToDelete}
                onOpenChange={(open) => !open && setPostToDelete(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Purge Article?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you certain you wish to purge{" "}
                            <span className="text-white font-semibold">
                                {postToDelete?.title}
                            </span>
                            ?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                            Purge Article
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}
