import React, { useState } from "react";
import { Link, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import { AdminLayout } from "@/Layouts/Admin/AdminLayout";
import { AdminPageHeader } from "@/Components/Admin/UI/AdminPageHeader";
import { AdminDataTable, Column } from "@/Components/Admin/UI/AdminDataTable";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
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
    RotateCcw,
    Trash2,
    ArrowLeft,
    Clock,
    AlertTriangle,
} from "lucide-react";
import { Blog } from "@/types/models";

interface BlogsTrashProps {
    blogs: Blog[];
}

export default function BlogsTrash({ blogs = [] }: BlogsTrashProps) {
    const [blogToRestore, setBlogToRestore] = useState<Blog | null>(null);
    const [blogToForceDelete, setBlogToForceDelete] = useState<Blog | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleRestore = () => {
        if (!blogToRestore) return;
        setIsProcessing(true);
        router.post(
            route("admin.blogs.restore", blogToRestore.id),
            {},
            {
                preserveScroll: true,
                onFinish: () => {
                    setIsProcessing(false);
                    setBlogToRestore(null);
                },
            }
        );
    };

    const handleForceDelete = () => {
        if (!blogToForceDelete) return;
        setIsProcessing(true);
        router.delete(route("admin.blogs.force-delete", blogToForceDelete.id), {
            preserveScroll: true,
            onFinish: () => {
                setIsProcessing(false);
                setBlogToForceDelete(null);
            },
        });
    };

    const columns: Column<Blog>[] = [
        {
            key: "cover_image",
            header: "ARTICLE / COVER",
            cell: (b) => (
                <div className="flex items-center gap-3 py-1">
                    <img
                        src={b.cover_image}
                        alt={b.title}
                        className="w-16 h-10 rounded object-cover border border-white/10 shrink-0 opacity-80"
                    />
                    <div className="min-w-0 space-y-1">
                        <div className="font-medium text-white leading-snug break-words">
                            <span>{b.title}</span>
                            {b.is_featured && (
                                <Badge className="bg-[#d4ff00]/20 text-[#d4ff00] border border-[#d4ff00]/30 text-[9px] font-mono font-bold px-1 py-0 h-4 ml-1.5 align-middle inline-flex shrink-0">
                                    FEATURED
                                </Badge>
                            )}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs font-mono text-neutral-400">
                            <span className="text-[#d4ff00]">
                                {b.category?.name || "General"}
                            </span>
                            {b.subcategory && (
                                <>
                                    <span>/</span>
                                    <span className="text-neutral-300">
                                        {b.subcategory.name}
                                    </span>
                                </>
                            )}
                            <span>•</span>
                            <span>{b.reading_time} min read</span>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            key: "author",
            header: "AUTHOR",
            cell: (b) => (
                <div className="text-xs font-mono text-neutral-300">
                    {b.author?.name || "Studio Editor"}
                </div>
            ),
        },
        {
            key: "status",
            header: "PREVIOUS STAGE",
            cell: (b) => (
                <div className="space-y-1">
                    <span
                        className={`inline-block px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider rounded border ${
                            b.status === "published"
                                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                                : b.status === "draft"
                                ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                                : "border-neutral-500/30 bg-neutral-500/10 text-neutral-400"
                        }`}
                    >
                        {b.status || "published"}
                    </span>
                    <div className="text-[10px] font-mono text-neutral-500">
                        Restores to {b.status || "published"}
                    </div>
                </div>
            ),
        },
        {
            key: "deleted_at",
            header: "DELETED AT",
            cell: (b) => (
                <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-400">
                    <Clock className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                    <span>
                        {b.deleted_at
                            ? new Date(b.deleted_at).toLocaleString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                              })
                            : "Recently"}
                    </span>
                </div>
            ),
        },
        {
            key: "actions",
            header: "ACTIONS",
            className: "text-right",
            cell: (b) => (
                <div className="flex justify-end items-center gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setBlogToRestore(b)}
                        className="h-8 gap-1.5 border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 font-mono text-xs font-semibold cursor-pointer"
                    >
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span>Restore</span>
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setBlogToForceDelete(b)}
                        className="h-8 gap-1.5 border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 font-mono text-xs font-semibold cursor-pointer"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Delete</span>
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <AdminLayout title="Blog Trash & Recovery Archive">
            <div className="space-y-6">
                <AdminPageHeader
                    eyebrow="ARCHIVAL REPOSITORY"
                    title="Soft-Deleted Blog Posts"
                    description="Review soft-deleted blog articles. Restoring an article brings it back to its exact previous state (draft, published, or archived). Hard deleting permanently removes it."
                >
                    <Link href={route("admin.blogs.index")}>
                        <Button
                            variant="outline"
                            className="gap-2 border-white/10 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white font-mono"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Back to Blogs</span>
                        </Button>
                    </Link>
                </AdminPageHeader>

                <AdminDataTable
                    data={blogs}
                    columns={columns}
                    searchKey="title"
                    searchPlaceholder="Filter trashed articles by title..."
                    emptyMessage="Trash is empty. No soft-deleted articles found."
                />

                {/* RESTORE DIALOG */}
                <AlertDialog
                    open={!!blogToRestore}
                    onOpenChange={(open) => !open && setBlogToRestore(null)}
                >
                    <AlertDialogContent className="bg-[#0c0d12] border-white/10 text-white">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="font-mono text-emerald-400 flex items-center gap-2">
                                <RotateCcw className="w-5 h-5" />
                                RESTORE BLOG POST
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-neutral-400 text-xs font-mono space-y-2">
                                <p>
                                    Are you sure you want to restore &ldquo;{blogToRestore?.title}&rdquo;?
                                </p>
                                <p className="text-neutral-300 bg-white/5 p-2.5 rounded border border-white/10">
                                    This article will be immediately reinstated to its exact previous stage:{" "}
                                    <span className="text-[#d4ff00] font-bold uppercase">
                                        {blogToRestore?.status || "published"}
                                    </span>
                                    {blogToRestore?.status === "published"
                                        ? " (will be visible on the public site again)."
                                        : " (will remain as a draft / archived in the admin index)."}
                                </p>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel
                                disabled={isProcessing}
                                className="border-white/10 text-neutral-400 hover:text-white"
                            >
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleRestore}
                                disabled={isProcessing}
                                className="bg-emerald-500 hover:bg-emerald-600 text-black font-mono font-bold"
                            >
                                {isProcessing ? "Restoring..." : "Confirm Restore"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* HARD DELETE (FORCE DELETE) DIALOG */}
                <AlertDialog
                    open={!!blogToForceDelete}
                    onOpenChange={(open) => !open && setBlogToForceDelete(null)}
                >
                    <AlertDialogContent className="bg-[#0c0d12] border-white/10 text-white">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="font-mono text-rose-400 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-rose-500" />
                                PERMANENT HARD DELETE
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-neutral-400 text-xs font-mono space-y-2">
                                <p>
                                    Are you sure you wish to permanently delete &ldquo;{blogToForceDelete?.title}&rdquo;?
                                </p>
                                <p className="text-rose-400/90 bg-rose-500/10 p-2.5 rounded border border-rose-500/20">
                                    CRITICAL WARNING: This action is permanent and completely irreversible. The article, content, SEO data, and records will be purged from the database forever.
                                </p>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel
                                disabled={isProcessing}
                                className="border-white/10 text-neutral-400 hover:text-white"
                            >
                                Abort
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleForceDelete}
                                disabled={isProcessing}
                                className="bg-rose-600 hover:bg-rose-700 text-white font-mono font-bold"
                            >
                                {isProcessing ? "Deleting..." : "Permanently Delete"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AdminLayout>
    );
}
