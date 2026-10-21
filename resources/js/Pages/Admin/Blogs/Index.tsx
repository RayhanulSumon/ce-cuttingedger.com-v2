import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import { AdminLayout } from "@/Layouts/Admin/AdminLayout";
import { AdminPageHeader } from "@/Components/Admin/UI/AdminPageHeader";
import { AdminDataTable, Column } from "@/Components/Admin/UI/AdminDataTable";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Badge } from "@/Components/ui/badge";
import { RichContentEditor } from "@/Components/Admin/UI/RichContentEditor";
import { SeoManager, SeoFieldsData } from "@/Components/Admin/UI/SeoManager";
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
import {
    MoreHorizontal,
    Edit,
    Trash2,
    ExternalLink,
    Clock,
    Calendar,
    Tag,
    Sparkles,
    CheckCircle2,
    FileText,
} from "lucide-react";
import { Blog, BlogCategory, TeamMember } from "@/types/models";

interface BlogsIndexProps {
    blogs: Blog[];
    categories: BlogCategory[];
    allCategories: BlogCategory[];
    authors: TeamMember[];
}

export default function BlogsIndex({
    blogs = [],
    categories = [],
    allCategories = [],
    authors = [],
}: BlogsIndexProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
    const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null);

    const initialSeoData: SeoFieldsData = {
        meta_title: "",
        meta_description: "",
        meta_keywords: "",
        canonical_url: "",
        og_image: "",
        robots: "index, follow",
    };

    const createForm = useForm({
        title: "",
        slug: "",
        blog_category_id: categories[0]?.id || "",
        subcategory_id: "" as number | string,
        author_id: authors[0]?.id || "",
        excerpt: "",
        body: "",
        cover_image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
        reading_time: 5,
        is_featured: false,
        status: "published" as "draft" | "published" | "archived",
        tags: "",
        // SEO fields
        meta_title: "",
        meta_description: "",
        meta_keywords: "",
        canonical_url: "",
        og_image: "",
        robots: "index, follow",
    });

    const editForm = useForm({
        title: "",
        slug: "",
        blog_category_id: "" as number | string,
        subcategory_id: "" as number | string,
        author_id: "" as number | string,
        excerpt: "",
        body: "",
        cover_image: "",
        reading_time: 5,
        is_featured: false,
        status: "published" as "draft" | "published" | "archived",
        tags: "",
        // SEO fields
        meta_title: "",
        meta_description: "",
        meta_keywords: "",
        canonical_url: "",
        og_image: "",
        robots: "index, follow",
    });

    // Subcategories available for selected category in create form
    const createSubcategories =
        categories.find((c) => String(c.id) === String(createForm.data.blog_category_id))
            ?.subcategories || [];

    // Subcategories available for selected category in edit form
    const editSubcategories =
        categories.find((c) => String(c.id) === String(editForm.data.blog_category_id))
            ?.subcategories || [];

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(route("admin.blogs.store"), {
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
            },
        });
    };

    const openEdit = (b: Blog) => {
        setEditingBlog(b);
        editForm.setData({
            title: b.title,
            slug: b.slug,
            blog_category_id: b.blog_category_id || "",
            subcategory_id: b.subcategory_id || "",
            author_id: b.author_id || "",
            excerpt: b.excerpt,
            body: b.body,
            cover_image: b.cover_image,
            reading_time: b.reading_time || 5,
            is_featured: !!b.is_featured,
            status: b.status || "published",
            tags: Array.isArray(b.tags) ? b.tags.join(", ") : "",
            meta_title: b.meta_title || "",
            meta_description: b.meta_description || "",
            meta_keywords: b.meta_keywords || "",
            canonical_url: b.canonical_url || "",
            og_image: b.og_image || "",
            robots: b.robots || "index, follow",
        });
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingBlog) return;
        editForm.put(route("admin.blogs.update", editingBlog.id), {
            onSuccess: () => {
                setEditingBlog(null);
            },
        });
    };

    const handleDelete = () => {
        if (!blogToDelete) return;
        editForm.delete(route("admin.blogs.destroy", blogToDelete.id), {
            onSuccess: () => {
                setBlogToDelete(null);
            },
        });
    };

    const columns: Column<Blog>[] = [
        {
            key: "cover_image",
            header: "ARTICLE / COVER",
            cell: (b) => (
                <div className="flex items-center gap-3">
                    <img
                        src={b.cover_image}
                        alt={b.title}
                        className="w-16 h-10 rounded object-cover border border-white/10 shrink-0"
                    />
                    <div className="min-w-0">
                        <div className="font-medium text-white truncate max-w-sm flex items-center gap-1.5">
                            {b.title}
                            {b.is_featured && (
                                <Badge className="bg-[#d4ff00] text-black text-[9px] font-mono font-bold px-1 py-0 h-4">
                                    FEATURED
                                </Badge>
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
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
                            className="bg-[#12131a] border-white/10 text-white min-w-[150px]"
                        >
                            <DropdownMenuItem
                                onClick={() => openEdit(b)}
                                className="cursor-pointer text-xs focus:bg-[#d4ff00] focus:text-black"
                            >
                                <Edit className="mr-2 h-3.5 w-3.5" />
                                Edit Article & SEO
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
                    createLabel="New Blog Post"
                    onCreate={() => setIsCreateOpen(true)}
                />

                <AdminDataTable
                    data={blogs}
                    columns={columns}
                    searchKey="title"
                    searchPlaceholder="Filter articles by title..."
                />

                {/* CREATE MODAL */}
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0c0d12] border-white/10 text-white shadow-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold font-mono tracking-tight text-white flex items-center gap-2">
                                <FileText className="w-5 h-5 text-[#d4ff00]" />
                                COMPOSE BLOG POST
                            </DialogTitle>
                            <DialogDescription className="text-neutral-400 text-xs font-mono">
                                Publish an article with rich formatting, taxonomy hierarchy, and Google SEO tags.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleCreate} className="space-y-5 pt-2">
                            {/* Primary Details */}
                            <div className="space-y-4 rounded-lg border border-white/10 bg-[#12131a]/40 p-4">
                                <span className="text-[10px] font-mono uppercase tracking-wider text-[#d4ff00]">
                                    CORE ARTICLE ATTRIBUTES
                                </span>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="text-xs font-mono text-neutral-300">
                                            Article Title *
                                        </label>
                                        <Input
                                            placeholder="e.g. Kinetic Physics: Sculpting Tactile Interfaces"
                                            value={createForm.data.title}
                                            onChange={(e) =>
                                                createForm.setData("title", e.target.value)
                                            }
                                            className="bg-[#12131a] border-white/10 focus:border-[#d4ff00] text-base"
                                            required
                                        />
                                        {createForm.errors.title && (
                                            <p className="text-rose-400 text-xs font-mono">
                                                {createForm.errors.title}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-mono text-neutral-300">
                                            Primary Category *
                                        </label>
                                        <select
                                            value={createForm.data.blog_category_id}
                                            onChange={(e) => {
                                                createForm.setData((prev) => ({
                                                    ...prev,
                                                    blog_category_id: e.target.value,
                                                    subcategory_id: "",
                                                }));
                                            }}
                                            className="w-full h-10 px-3 rounded-md bg-[#12131a] border border-white/10 text-white text-sm focus:border-[#d4ff00] focus:outline-none"
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map((c) => (
                                                <option key={c.id} value={c.id}>
                                                    {c.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-mono text-neutral-300">
                                            Subcategory (Optional)
                                        </label>
                                        <select
                                            value={createForm.data.subcategory_id}
                                            onChange={(e) =>
                                                createForm.setData("subcategory_id", e.target.value)
                                            }
                                            className="w-full h-10 px-3 rounded-md bg-[#12131a] border border-white/10 text-white text-sm focus:border-[#d4ff00] focus:outline-none"
                                            disabled={createSubcategories.length === 0}
                                        >
                                            <option value="">
                                                {createSubcategories.length === 0
                                                    ? "No subcategories available"
                                                    : "None (Direct in Primary)"}
                                            </option>
                                            {createSubcategories.map((sub) => (
                                                <option key={sub.id} value={sub.id}>
                                                    ↳ {sub.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-mono text-neutral-300">
                                            Author *
                                        </label>
                                        <select
                                            value={createForm.data.author_id}
                                            onChange={(e) =>
                                                createForm.setData("author_id", e.target.value)
                                            }
                                            className="w-full h-10 px-3 rounded-md bg-[#12131a] border border-white/10 text-white text-sm focus:border-[#d4ff00] focus:outline-none"
                                            required
                                        >
                                            <option value="">Select Author</option>
                                            {authors.map((a) => (
                                                <option key={a.id} value={a.id}>
                                                    {a.name} ({a.role})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-mono text-neutral-300">
                                            Publication Status
                                        </label>
                                        <select
                                            value={createForm.data.status}
                                            onChange={(e) =>
                                                createForm.setData(
                                                    "status",
                                                    e.target.value as "draft" | "published" | "archived"
                                                )
                                            }
                                            className="w-full h-10 px-3 rounded-md bg-[#12131a] border border-white/10 text-white text-sm focus:border-[#d4ff00] focus:outline-none"
                                        >
                                            <option value="published">Published</option>
                                            <option value="draft">Draft</option>
                                            <option value="archived">Archived</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-mono text-neutral-300">
                                            Cover Image URL *
                                        </label>
                                        <Input
                                            value={createForm.data.cover_image}
                                            onChange={(e) =>
                                                createForm.setData("cover_image", e.target.value)
                                            }
                                            className="bg-[#12131a] border-white/10 focus:border-[#d4ff00]"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-mono text-neutral-300">
                                            Tags (Comma-separated)
                                        </label>
                                        <Input
                                            placeholder="Motion, UI, Engineering, Spatial"
                                            value={createForm.data.tags}
                                            onChange={(e) =>
                                                createForm.setData("tags", e.target.value)
                                            }
                                            className="bg-[#12131a] border-white/10 focus:border-[#d4ff00]"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-mono text-neutral-300">
                                        Excerpt / Brief Synopsis *
                                    </label>
                                    <Textarea
                                        rows={2}
                                        placeholder="Hook readers with a sharp 2-sentence summary..."
                                        value={createForm.data.excerpt}
                                        onChange={(e) =>
                                            createForm.setData("excerpt", e.target.value)
                                        }
                                        className="bg-[#12131a] border-white/10 focus:border-[#d4ff00]"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Full WYSIWYG / Markdown Body Editor */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono text-neutral-300">
                                    Full Article Body Content *
                                </label>
                                <RichContentEditor
                                    value={createForm.data.body}
                                    onChange={(val) => createForm.setData("body", val)}
                                    placeholder="Write your article here using rich markdown or html syntax..."
                                />
                                {createForm.errors.body && (
                                    <p className="text-rose-400 text-xs font-mono">
                                        {createForm.errors.body}
                                    </p>
                                )}
                            </div>

                            {/* Dynamic SEO Suite */}
                            <SeoManager
                                data={{
                                    meta_title: createForm.data.meta_title,
                                    meta_description: createForm.data.meta_description,
                                    meta_keywords: createForm.data.meta_keywords,
                                    canonical_url: createForm.data.canonical_url,
                                    og_image: createForm.data.og_image,
                                    robots: createForm.data.robots,
                                }}
                                onChange={(field, val) => createForm.setData(field, val)}
                                fallbackTitle={createForm.data.title}
                                fallbackDescription={createForm.data.excerpt}
                                fallbackSlug={createForm.data.slug}
                                fallbackImage={createForm.data.cover_image}
                            />

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
                                    {createForm.processing ? "Publishing..." : "Publish Article"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* EDIT MODAL */}
                <Dialog
                    open={!!editingBlog}
                    onOpenChange={(open) => !open && setEditingBlog(null)}
                >
                    <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0c0d12] border-white/10 text-white shadow-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold font-mono tracking-tight text-white flex items-center gap-2">
                                <Edit className="w-5 h-5 text-[#d4ff00]" />
                                EDIT ARTICLE & SEO CONFIG
                            </DialogTitle>
                            <DialogDescription className="text-neutral-400 text-xs font-mono">
                                Modify article content, change taxonomies, and optimize metadata.
                            </DialogDescription>
                        </DialogHeader>

                        {editingBlog && (
                            <form onSubmit={handleUpdate} className="space-y-5 pt-2">
                                {/* Primary Details */}
                                <div className="space-y-4 rounded-lg border border-white/10 bg-[#12131a]/40 p-4">
                                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#d4ff00]">
                                        CORE ARTICLE ATTRIBUTES
                                    </span>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5 md:col-span-2">
                                            <label className="text-xs font-mono text-neutral-300">
                                                Article Title *
                                            </label>
                                            <Input
                                                value={editForm.data.title}
                                                onChange={(e) =>
                                                    editForm.setData("title", e.target.value)
                                                }
                                                className="bg-[#12131a] border-white/10 focus:border-[#d4ff00] text-base"
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

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-mono text-neutral-300">
                                                Primary Category *
                                            </label>
                                            <select
                                                value={editForm.data.blog_category_id}
                                                onChange={(e) => {
                                                    editForm.setData((prev) => ({
                                                        ...prev,
                                                        blog_category_id: e.target.value,
                                                        subcategory_id: "",
                                                    }));
                                                }}
                                                className="w-full h-10 px-3 rounded-md bg-[#12131a] border border-white/10 text-white text-sm focus:border-[#d4ff00] focus:outline-none"
                                                required
                                            >
                                                <option value="">Select Category</option>
                                                {categories.map((c) => (
                                                    <option key={c.id} value={c.id}>
                                                        {c.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-mono text-neutral-300">
                                                Subcategory (Optional)
                                            </label>
                                            <select
                                                value={editForm.data.subcategory_id}
                                                onChange={(e) =>
                                                    editForm.setData("subcategory_id", e.target.value)
                                                }
                                                className="w-full h-10 px-3 rounded-md bg-[#12131a] border border-white/10 text-white text-sm focus:border-[#d4ff00] focus:outline-none"
                                                disabled={editSubcategories.length === 0}
                                            >
                                                <option value="">
                                                    {editSubcategories.length === 0
                                                        ? "No subcategories available"
                                                        : "None (Direct in Primary)"}
                                                </option>
                                                {editSubcategories.map((sub) => (
                                                    <option key={sub.id} value={sub.id}>
                                                        ↳ {sub.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-mono text-neutral-300">
                                                Author *
                                            </label>
                                            <select
                                                value={editForm.data.author_id}
                                                onChange={(e) =>
                                                    editForm.setData("author_id", e.target.value)
                                                }
                                                className="w-full h-10 px-3 rounded-md bg-[#12131a] border border-white/10 text-white text-sm focus:border-[#d4ff00] focus:outline-none"
                                                required
                                            >
                                                <option value="">Select Author</option>
                                                {authors.map((a) => (
                                                    <option key={a.id} value={a.id}>
                                                        {a.name} ({a.role})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-mono text-neutral-300">
                                                Publication Status
                                            </label>
                                            <select
                                                value={editForm.data.status}
                                                onChange={(e) =>
                                                    editForm.setData(
                                                        "status",
                                                        e.target.value as "draft" | "published" | "archived"
                                                    )
                                                }
                                                className="w-full h-10 px-3 rounded-md bg-[#12131a] border border-white/10 text-white text-sm focus:border-[#d4ff00] focus:outline-none"
                                            >
                                                <option value="published">Published</option>
                                                <option value="draft">Draft</option>
                                                <option value="archived">Archived</option>
                                            </select>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-mono text-neutral-300">
                                                Cover Image URL *
                                            </label>
                                            <Input
                                                value={editForm.data.cover_image}
                                                onChange={(e) =>
                                                    editForm.setData("cover_image", e.target.value)
                                                }
                                                className="bg-[#12131a] border-white/10 focus:border-[#d4ff00]"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-1.5 md:col-span-2">
                                            <label className="text-xs font-mono text-neutral-300">
                                                Tags (Comma-separated)
                                            </label>
                                            <Input
                                                placeholder="Motion, UI, Engineering, Spatial"
                                                value={editForm.data.tags}
                                                onChange={(e) =>
                                                    editForm.setData("tags", e.target.value)
                                                }
                                                className="bg-[#12131a] border-white/10 focus:border-[#d4ff00]"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-mono text-neutral-300">
                                            Excerpt / Brief Synopsis *
                                        </label>
                                        <Textarea
                                            rows={2}
                                            value={editForm.data.excerpt}
                                            onChange={(e) =>
                                                editForm.setData("excerpt", e.target.value)
                                            }
                                            className="bg-[#12131a] border-white/10 focus:border-[#d4ff00]"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Full WYSIWYG / Markdown Body Editor */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-mono text-neutral-300">
                                        Full Article Body Content *
                                    </label>
                                    <RichContentEditor
                                        value={editForm.data.body}
                                        onChange={(val) => editForm.setData("body", val)}
                                    />
                                </div>

                                {/* Dynamic SEO Suite */}
                                <SeoManager
                                    data={{
                                        meta_title: editForm.data.meta_title,
                                        meta_description: editForm.data.meta_description,
                                        meta_keywords: editForm.data.meta_keywords,
                                        canonical_url: editForm.data.canonical_url,
                                        og_image: editForm.data.og_image,
                                        robots: editForm.data.robots,
                                    }}
                                    onChange={(field, val) => editForm.setData(field, val)}
                                    fallbackTitle={editForm.data.title}
                                    fallbackDescription={editForm.data.excerpt}
                                    fallbackSlug={editForm.data.slug}
                                    fallbackImage={editForm.data.cover_image}
                                />

                                <DialogFooter className="pt-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setEditingBlog(null)}
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
                    open={!!blogToDelete}
                    onOpenChange={(open) => !open && setBlogToDelete(null)}
                >
                    <AlertDialogContent className="bg-[#0c0d12] border-white/10 text-white">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="font-mono text-rose-400">
                                PURGE BLOG DISPATCH
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-neutral-400 text-xs font-mono">
                                Are you sure you wish to permanently purge &ldquo;{blogToDelete?.title}&rdquo;?
                                All analytics, URLs, and SEO indexes associated with this post will be removed.
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
                                Confirm Purge
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AdminLayout>
    );
}
