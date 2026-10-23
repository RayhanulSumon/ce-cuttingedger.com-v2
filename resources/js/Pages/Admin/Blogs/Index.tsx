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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
    MoreHorizontal,
    Edit,
    Trash2,
    ExternalLink,
    CheckCircle2,
} from "lucide-react";
import { Blog, BlogCategory, TeamMember } from "@/types/models";

interface BlogsIndexProps {
    blogs: Blog[];
    categories?: BlogCategory[];
    allCategories?: BlogCategory[];
    authors?: TeamMember[];
    trashedCount?: number;
}

export default function BlogsIndex({
    blogs = [],
    trashedCount = 0,
}: BlogsIndexProps) {
    const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        if (!blogToDelete) return;
        setIsDeleting(true);
        router.delete(route("admin.blogs.destroy", blogToDelete.id), {
            preserveScroll: true,
            onFinish: () => {
                setIsDeleting(false);
                setBlogToDelete(null);
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
                        className="w-16 h-10 rounded object-cover border border-white/10 shrink-0"
                    />
                    <div className="min-w-0 space-y-1">
                        <div className="font-medium text-white leading-snug break-words">
                            <Link
                                href={route("admin.blogs.edit", b.id)}
                                className="hover:text-[#d4ff00] transition-colors"
                            >
                                {b.title}
                            </Link>
                            {b.is_featured && (
                                <Badge className="bg-[#d4ff00] text-black text-[9px] font-mono font-bold px-1 py-0 h-4 ml-1.5 align-middle inline-flex shrink-0">
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
            header: "STATUS",
            cell: (b) => (
                <span
                    className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider rounded border ${
                        b.status === "published"
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                            : b.status === "draft"
                            ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                            : "border-neutral-500/30 bg-neutral-500/10 text-neutral-400"
                    }`}
                >
                    {b.status || "published"}
                </span>
            ),
        },
        {
            key: "seo_status",
            header: "SEO SUITE",
            cell: (b) => {
                const hasSeo = b.meta_title && b.meta_description;
                return (
                    <div className="flex items-center gap-1.5 text-xs font-mono">
                        {hasSeo ? (
                            <span className="flex items-center gap-1 text-emerald-400">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Configured
                            </span>
                        ) : (
                            <span className="text-amber-400">Auto-Fallback</span>
                        )}
                    </div>
                );
            },
        },
        {
            key: "published_at",
            header: "PUBLISHED",
            cell: (b) => (
                <span className="text-xs font-mono text-neutral-400">
                    {b.published_at
                        ? new Date(b.published_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                          })
                        : "Draft"}
                </span>
            ),
        },
        {
            key: "actions",
            header: "ACTION",
            className: "text-right",
            cell: (b) => (
                <div className="flex justify-end items-center gap-1">
                    <a
                        href={`/blog/${b.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-white/5"
                        title="View Public Article"
                    >
                        <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                    <Link
                        href={route("admin.blogs.edit", b.id)}
                        className="p-1.5 text-neutral-400 hover:text-[#d4ff00] rounded hover:bg-white/5"
                        title="Edit Article & SEO"
                    >
                        <Edit className="h-3.5 w-3.5" />
                    </Link>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-neutral-400 hover:text-white hover:bg-white/10 cursor-pointer"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="bg-[#12131a] border-white/10 text-white min-w-[150px]"
                        >
                            <DropdownMenuItem
                                asChild
                                className="cursor-pointer text-xs focus:bg-[#d4ff00] focus:text-black"
                            >
                                <Link
                                    href={route("admin.blogs.edit", b.id)}
                                    className="flex items-center w-full"
                                >
                                    <Edit className="mr-2 h-3.5 w-3.5" />
                                    Edit Article & SEO
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setBlogToDelete(b)}
                                className="cursor-pointer text-xs text-rose-400 focus:bg-rose-500 focus:text-white"
                            >
                                <Trash2 className="mr-2 h-3.5 w-3.5" />
                                Purge Article
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
        },
    ];

    return (
        <AdminLayout title="Blog Posts & Editorial Suite">
            <div className="space-y-6">
                <AdminPageHeader
                    eyebrow="EDITORIAL CONTENT ENGINE"
                    title="Blog Posts & Dispatches"
                    description="Compose long-form essays, assign category & subcategory taxonomies, and manage granular dynamic SEO metadata."
                    actionLabel="New Blog Post"
                    actionHref={route("admin.blogs.create")}
                >
                    <Link href={route("admin.blogs.trash")}>
                        <Button
                            variant="outline"
                            className="gap-2 border-white/10 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white font-mono cursor-pointer"
                        >
                            <Trash2 className="w-4 h-4 text-rose-400" />
                            <span>Trash</span>
                            {trashedCount > 0 && (
                                <Badge className="bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-mono font-bold px-1.5 py-0 h-4">
                                    {trashedCount}
                                </Badge>
                            )}
                        </Button>
                    </Link>
                </AdminPageHeader>

                <AdminDataTable
                    data={blogs}
                    columns={columns}
                    searchKey="title"
                    searchPlaceholder="Filter articles by title..."
                />

                {/* DELETE CONFIRMATION DIALOG */}
                <AlertDialog
                    open={!!blogToDelete}
                    onOpenChange={(open) => !open && setBlogToDelete(null)}
                >
                    <AlertDialogContent className="bg-[#0c0d12] border-white/10 text-white">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="font-mono text-rose-400">
                                PURGE BLOG DISPATCH
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-neutral-400 text-xs font-mono">
                                Are you sure you wish to purge &ldquo;{blogToDelete?.title}&rdquo; to the trash?
                                It will be removed from public view and can be restored or permanently removed from the trash archive.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="border-white/10 text-neutral-400 hover:text-white cursor-pointer">
                                Abort
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="bg-rose-500 hover:bg-rose-600 text-white font-mono font-bold cursor-pointer"
                            >
                                {isDeleting ? "Purging..." : "Confirm Purge"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AdminLayout>
    );
}
