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
                        className="w-16 h-10 rounded object-cover border border-line shrink-0"
                    />
                    <div className="min-w-0 space-y-1">
                        <div className="font-medium text-ink leading-snug break-words">
                            <Link
                                href={route("admin.blogs.edit", b.id)}
                                className="hover:text-primary-ink transition-colors"
                            >
                                {b.title}
                            </Link>
                            {b.is_featured && (
                                <Badge className="bg-primary text-primary-foreground text-2xs font-bold px-1 py-0 h-4 ml-1.5 align-middle inline-flex shrink-0">
                                    FEATURED
                                </Badge>
                            )}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-subtle">
                            <span className="text-primary-ink">
                                {b.category?.parent?.name || b.category?.name || "General"}
                            </span>
                            {b.category?.parent && (
                                <>
                                    <span>/</span>
                                    <span className="text-ink-2">
                                        {b.category.name}
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
                <div className="text-xs text-ink-2">
                    {b.author?.name || "Studio Editor"}
                </div>
            ),
        },
        {
            key: "status",
            header: "STATUS",
            cell: (b) => (
                <span
                    className={`px-2 py-0.5 text-2xs font-bold uppercase tracking-wider rounded border ${
                        b.status === "published"
                            ? "border-success/25 bg-success-soft text-success"
                            : b.status === "draft"
                            ? "border-warning/25 bg-warning-soft text-warning"
                            : "border-line bg-surface-2 text-subtle"
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
                    <div className="flex items-center gap-1.5 text-xs">
                        {hasSeo ? (
                            <span className="flex items-center gap-1 text-success">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Configured
                            </span>
                        ) : (
                            <span className="text-warning">Auto-Fallback</span>
                        )}
                    </div>
                );
            },
        },
        {
            key: "published_at",
            header: "PUBLISHED",
            cell: (b) => (
                <span className="text-xs text-subtle">
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
                        className="p-1.5 text-subtle hover:text-ink rounded hover:bg-surface-2"
                        title="View Public Article"
                    >
                        <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                    <Link
                        href={route("admin.blogs.edit", b.id)}
                        className="p-1.5 text-subtle hover:text-primary rounded hover:bg-surface-2"
                        title="Edit"
                    >
                        <Edit className="h-3.5 w-3.5" />
                    </Link>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-subtle hover:text-ink hover:bg-surface-2 cursor-pointer"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="bg-surface border-line text-ink min-w-[150px]"
                        >
                            <DropdownMenuItem
                                asChild
                                className="cursor-pointer text-xs focus:bg-primary focus:text-primary-foreground"
                            >
                                <Link
                                    href={route("admin.blogs.edit", b.id)}
                                    className="flex items-center w-full"
                                >
                                    <Edit className="mr-2 h-3.5 w-3.5" />
                                    Edit
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setBlogToDelete(b)}
                                className="cursor-pointer text-xs text-danger focus:bg-danger focus:text-white"
                            >
                                <Trash2 className="mr-2 h-3.5 w-3.5" />
                                Move to trash
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
                    title="Blog Posts & Articles"
                    description="Compose long-form essays, assign category & subcategory taxonomies, and manage granular dynamic SEO metadata."
                    actionLabel="New Blog Post"
                    actionHref={route("admin.blogs.create")}
                >
                    <Link href={route("admin.blogs.trash")}>
                        <Button
                            variant="outline"
                            className="gap-2 border-line bg-surface-2 hover:bg-surface-2 text-ink-2 hover:text-ink cursor-pointer"
                        >
                            <Trash2 className="w-4 h-4 text-danger" />
                            <span>Trash</span>
                            {trashedCount > 0 && (
                                <Badge className="bg-danger-soft text-danger border border-danger/25 text-2xs font-bold px-1.5 py-0 h-4">
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
                    <AlertDialogContent className="bg-surface border-line text-ink">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-danger">
                                DELETE BLOG POST
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-subtle text-xs">
                                Are you sure you wish to purge &ldquo;{blogToDelete?.title}&rdquo; to the trash?
                                It will be removed from public view and can be restored or permanently removed from the trash archive.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="border-line text-subtle hover:text-ink cursor-pointer">
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="bg-danger hover:bg-danger-hover text-white font-bold cursor-pointer"
                            >
                                {isDeleting ? "Moving to trash..." : "Confirm"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AdminLayout>
    );
}
