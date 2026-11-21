import React, { useState, useEffect } from "react";
import { useForm, Link } from "@inertiajs/react";
import { route } from "ziggy-js";
import { Blog, BlogCategory, TeamMember } from "@/types/models";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Switch } from "@/Components/ui/switch";
import { Badge } from "@/Components/ui/badge";
import { RichContentEditor } from "@/Components/Admin/UI/RichContentEditor";
import { SeoManager, SeoFieldsData } from "@/Components/Admin/UI/SeoManager";
import {
    Select,
    SelectGroup,
    SelectContent,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    Sparkles,
    ArrowLeft,
    ExternalLink,
    Save,
    Image as ImageIcon,
    Tag,
    Globe,
    FileText,
    Layers,
    User,
    CheckCircle2,
    AlertCircle,
    Eye,
    FolderKanban,
    CornerDownRight,
    UploadCloud,
    Loader2,
    Check,
    Copy,
    X,
    Trash2,
} from "lucide-react";

interface BlogFormProps {
    mode: "create" | "edit";
    blog?: Blog;
    categories: BlogCategory[];
    authors: TeamMember[];
}

export function BlogForm({ mode, blog, categories = [], authors = [] }: BlogFormProps) {
    const isEdit = mode === "edit";

    // Format tags from model (array or string)
    const initialTags = blog?.tags
        ? Array.isArray(blog.tags)
            ? blog.tags.join(", ")
            : String(blog.tags)
        : "";

    const { data, setData, post, put, processing, errors, isDirty } = useForm({
        title: blog?.title || "",
        slug: blog?.slug || "",
        blog_category_id: blog?.blog_category_id || categories[0]?.id || "",
        subcategory_id: blog?.subcategory_id || "",
        author_id: blog?.author_id || authors[0]?.id || "",
        excerpt: blog?.excerpt || "",
        body: blog?.body || "",
        cover_image: blog?.cover_image || "",
        is_featured: !!blog?.is_featured,
        status: (blog?.status || "published") as "draft" | "published" | "archived",
        tags: initialTags,
        // SEO fields
        meta_title: blog?.meta_title || "",
        meta_description: blog?.meta_description || "",
        meta_keywords: blog?.meta_keywords || "",
        canonical_url: blog?.canonical_url || "",
        og_image: blog?.og_image || "",
        robots: blog?.robots || "index, follow",
    });

    const [imagePreviewError, setImagePreviewError] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
    const [isUrlCopied, setIsUrlCopied] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement | null>(null);

    const handleCopyLiveUrl = () => {
        const slugToCopy = data.slug || "your-slug";
        const fullUrl = `https://cuttingedger.com/blog/${slugToCopy}`;
        navigator.clipboard.writeText(fullUrl);
        setIsUrlCopied(true);
        setTimeout(() => setIsUrlCopied(false), 2000);
    };

    useEffect(() => {
        setImagePreviewError(false);
    }, [data.cover_image]);

    // CSRF helper for file uploads
    const getCsrfToken = (): string => {
        const metaTag = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null;
        if (metaTag?.content) return metaTag.content;
        const cookieMatch = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
        if (cookieMatch) return decodeURIComponent(cookieMatch[1]);
        return "";
    };

    // Upload cover image to storage
    const handleFileUpload = async (file: File) => {
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setUploadError("Only image files (JPG, PNG, WEBP, AVIF, GIF) are allowed.");
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            setUploadError("Image size exceeds 10MB limit.");
            return;
        }

        setIsUploading(true);
        setUploadError(null);
        setImagePreviewError(false);

        try {
            const formData = new FormData();
            formData.append("image", file);

            const csrfToken = getCsrfToken();
            const headers: Record<string, string> = {
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest",
            };
            if (csrfToken) {
                headers["X-CSRF-TOKEN"] = csrfToken;
            }

            const response = await fetch(route("admin.blogs.upload-cover"), {
                method: "POST",
                headers,
                body: formData,
            });

            if (!response.ok) {
                const errorJson = await response.json().catch(() => null);
                throw new Error(
                    errorJson?.errors?.image?.[0] ||
                    errorJson?.message ||
                    `Upload failed with status ${response.status}`
                );
            }

            const resData = await response.json();
            if (resData.success && resData.url) {
                setData("cover_image", resData.url);
                setUploadedFileName(resData.filename || file.name);
                setUploadError(null);
            } else {
                throw new Error("Invalid response received from server.");
            }
        } catch (err: any) {
            console.error("Cover image upload failed:", err);
            setUploadError(err.message || "Failed to upload image. Please try again or paste a URL.");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const droppedFile = e.dataTransfer.files[0];
            handleFileUpload(droppedFile);
        }
    };

    // Active subcategories based on the chosen category
    const activeSubcategories =
        categories.find((c) => String(c.id) === String(data.blog_category_id))
            ?.subcategories || [];

    // Selected entities for custom trigger displays
    const selectedAuthor = authors.find(
        (a) => String(a.id) === String(data.author_id)
    );
    const selectedCategory = categories.find(
        (c) => String(c.id) === String(data.blog_category_id)
    );
    const selectedSubcategory = activeSubcategories.find(
        (s) => String(s.id) === String(data.subcategory_id)
    );

    // Helper: Generate slug from title
    const handleGenerateSlug = () => {
        if (!data.title) return;
        const generated = data.title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/[\s_-]+/g, "-")
            .replace(/^-+|-+$/g, "");
        setData("slug", generated);
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && blog) {
            put(route("admin.blogs.update", blog.id));
        } else {
            post(route("admin.blogs.store"));
        }
    };

    // Parsed tag pills preview
    const tagPills = data.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Top Status Bar if form is dirty */}
            {isDirty && (
                <div className="flex items-center justify-between p-3 rounded-lg border border-primary/30 bg-primary-soft text-ink-2 text-xs">
                    <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        You have unsaved changes in this blog post.
                    </span>
                    <span className="text-subtle">Remember to commit your changes.</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* MAIN EDITORIAL COLUMN (8 cols) */}
                <div className="lg:col-span-8 space-y-8">
                    {/* CORE ARTICLE CARD */}
                    <div className="rounded-xl border border-line bg-surface p-6 space-y-6 shadow-xl">
                        <div className="flex items-center justify-between pb-4 border-b border-line">
                            <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-primary-ink" />
                                <span className="text-xs font-bold uppercase tracking-wider text-ink">
                                    CORE ARTICLE ATTRIBUTES
                                </span>
                            </div>
                            <Badge className="bg-surface-2 text-subtle border-line text-2xs">
                                Markdown & HTML Compatible
                            </Badge>
                        </div>

                        {/* Title & Slug */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs text-ink-2 flex items-center justify-between">
                                    <span>Article Headline / Title *</span>
                                    <span className="text-subtle text-2xs">Required</span>
                                </label>
                                <Input
                                    value={data.title}
                                    onChange={(e) => setData("title", e.target.value)}
                                    placeholder="e.g. Kinetic Physics: Sculpting Tactile Interfaces"
                                    className="bg-surface border-line focus:border-ring text-lg font-medium text-ink placeholder:text-faint h-12"
                                    required
                                />
                                {errors.title && (
                                    <p className="text-danger text-xs flex items-center gap-1.5 mt-1">
                                        <AlertCircle className="w-3.5 h-3.5" />
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs text-ink-2">
                                        URL Slug {isEdit ? "*" : "(Optional - auto-generated if left blank)"}
                                    </label>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleGenerateSlug}
                                        disabled={!data.title}
                                        className="h-6 px-2 text-2xs text-primary-ink hover:text-primary-ink hover:bg-primary-soft gap-1 cursor-pointer"
                                    >
                                        <Sparkles className="w-3 h-3" />
                                        <span>Generate from Title</span>
                                    </Button>
                                </div>
                                <div className="relative">
                                    <Input
                                        value={data.slug}
                                        onChange={(e) => setData("slug", e.target.value)}
                                        placeholder="kinetic-physics-tactile-interfaces"
                                        className="bg-surface border-line focus:border-ring text-sm text-ink-2"
                                        required={isEdit}
                                    />
                                </div>
                                <div className="text-2xs text-subtle flex items-center gap-2 flex-wrap">
                                    <div className="flex items-center gap-1 min-w-0">
                                        <Globe className="w-3 h-3 shrink-0 text-subtle" />
                                        <span>Live URL preview:</span>
                                        <span className="text-primary-ink">
                                            https://cuttingedger.com/blog/{data.slug || "your-slug"}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleCopyLiveUrl}
                                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-surface-2 hover:bg-surface-2 border border-line hover:border-line-strong text-ink-2 hover:text-ink transition-all cursor-pointer text-2xs shrink-0"
                                        title="Copy live URL to clipboard"
                                    >
                                        {isUrlCopied ? (
                                            <>
                                                <Check className="w-3 h-3 text-success" />
                                                <span className="text-success font-medium">Copied</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-3 h-3 text-subtle" />
                                                <span>Copy</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                                {errors.slug && (
                                    <p className="text-danger text-xs flex items-center gap-1.5 mt-1">
                                        <AlertCircle className="w-3.5 h-3.5" />
                                        {errors.slug}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Excerpt */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-xs text-ink-2">
                                    Article Summary *
                                </label>
                                <span className="text-2xs text-subtle">
                                    {data.excerpt.length} characters (Recommended: 120-160)
                                </span>
                            </div>
                            <Textarea
                                rows={3}
                                value={data.excerpt}
                                onChange={(e) => setData("excerpt", e.target.value)}
                                placeholder="A brief 1–2 sentence overview of the article. This appears on blog preview cards and search results."
                                className="bg-surface border-line focus:border-ring text-sm text-ink-2 leading-relaxed"
                                required
                            />
                            {errors.excerpt && (
                                <p className="text-danger text-xs flex items-center gap-1.5 mt-1">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    {errors.excerpt}
                                </p>
                            )}
                        </div>

                        {/* Body Content Editor */}
                        <div className="space-y-2">
                            <label className="text-xs text-ink-2 block">
                                Full Article Body Content *
                            </label>
                            <div className="rounded-lg overflow-hidden border border-line bg-surface">
                                <RichContentEditor
                                    value={data.body}
                                    onChange={(val) => setData("body", val)}
                                    placeholder="Write your article here using rich markdown or html syntax..."
                                />
                            </div>
                            {errors.body && (
                                <p className="text-danger text-xs flex items-center gap-1.5 mt-1">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    {errors.body}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* DYNAMIC SEO MANAGER CARD */}
                    <div className="rounded-xl border border-line bg-surface p-6 space-y-6 shadow-xl">
                        <div className="flex items-center justify-between pb-4 border-b border-line">
                            <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4 text-primary-ink" />
                                <span className="text-xs font-bold uppercase tracking-wider text-ink">
                                    DYNAMIC SEARCH ENGINE OPTIMIZATION (SEO)
                                </span>
                            </div>
                            <span className="text-2xs text-subtle">
                                Live Google SERP & OpenGraph Analyzer
                            </span>
                        </div>

                        <SeoManager
                            data={{
                                meta_title: data.meta_title,
                                meta_description: data.meta_description,
                                meta_keywords: data.meta_keywords,
                                canonical_url: data.canonical_url,
                                og_image: data.og_image,
                                robots: data.robots,
                            }}
                            onChange={(field, val) => setData(field as any, val)}
                            fallbackTitle={data.title}
                            fallbackDescription={data.excerpt}
                            fallbackSlug={data.slug}
                            fallbackImage={data.cover_image}
                        />
                    </div>
                </div>

                {/* SIDEBAR METADATA & ACTIONS (4 cols) */}
                <div className="lg:col-span-4 space-y-6">
                    {/* TAXONOMY & AUTHOR CARD */}
                    <div className="rounded-xl border border-line bg-surface p-6 space-y-5 shadow-xl">
                        <div className="pb-3 border-b border-line">
                            <span className="text-xs font-bold uppercase tracking-wider text-ink flex items-center gap-2">
                                <Tag className="w-4 h-4 text-primary" />
                                CATEGORY & AUTHOR
                            </span>
                        </div>

                        {/* Author */}
                        <div className="space-y-1.5">
                            <label className="text-xs text-ink-2 flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5 text-subtle" />
                                <span>Author / Creator *</span>
                            </label>
                            <Select
                                value={data.author_id ? String(data.author_id) : ""}
                                onValueChange={(val) => setData("author_id", Number(val) || val)}
                            >
                                <SelectTrigger className="h-11 bg-surface border-line hover:border-line-strong focus:border-ring text-ink">
                                    <SelectValue placeholder="Select Author">
                                        {selectedAuthor ? (
                                            <div className="flex items-center gap-2.5 min-w-0 flex-1 text-left">
                                                {selectedAuthor.avatar ? (
                                                    <img
                                                        src={selectedAuthor.avatar}
                                                        alt={selectedAuthor.name}
                                                        className="w-5 h-5 rounded-full object-cover border border-line shrink-0"
                                                    />
                                                ) : (
                                                    <span className="w-5 h-5 rounded-full bg-primary-soft text-primary-ink border border-primary/30 flex items-center justify-center text-2xs font-bold shrink-0">
                                                        {selectedAuthor.name.charAt(0)}
                                                    </span>
                                                )}
                                                <span className="font-medium text-ink truncate text-sm">
                                                    {selectedAuthor.name}
                                                </span>
                                                <span className="text-2xs text-subtle bg-surface-2 border border-line px-1.5 py-0.5 rounded truncate max-w-[140px] shrink-0 hidden sm:inline-block">
                                                    {selectedAuthor.role}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-subtle">Select Author</span>
                                        )}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent className="bg-surface border-line text-ink shadow-2xl min-w-[290px] max-w-[440px]">
                                    <SelectGroup>
                                        <SelectLabel>EDITORIAL CREW & CONTRIBUTORS</SelectLabel>
                                        {authors.map((a) => (
                                            <SelectItem
                                                key={a.id}
                                                value={String(a.id)}
                                                className="py-2.5 px-3 cursor-pointer focus:bg-primary-soft focus:text-ink data-[highlighted]:bg-primary-soft"
                                            >
                                                <div className="flex items-center gap-3 w-full pr-4">
                                                    {a.avatar ? (
                                                        <img
                                                            src={a.avatar}
                                                            alt={a.name}
                                                            className="w-7 h-7 rounded-full object-cover border border-line shrink-0"
                                                        />
                                                    ) : (
                                                        <div className="w-7 h-7 rounded-full bg-primary-soft text-primary-ink border border-primary/30 flex items-center justify-center text-xs font-bold shrink-0">
                                                            {a.name.charAt(0)}
                                                        </div>
                                                    )}
                                                    <div className="flex flex-col min-w-0 text-left">
                                                        <span className="font-medium text-ink text-sm truncate">
                                                            {a.name}
                                                        </span>
                                                        <span className="text-2xs text-subtle truncate">
                                                            {a.role}
                                                        </span>
                                                    </div>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.author_id && (
                                <p className="text-danger text-xs">{errors.author_id}</p>
                            )}
                        </div>

                        {/* Primary Category */}
                        <div className="space-y-1.5">
                            <label className="text-xs text-ink-2 flex items-center gap-1.5">
                                <FolderKanban className="w-3.5 h-3.5 text-subtle" />
                                <span>Primary Category *</span>
                            </label>
                            <Select
                                value={data.blog_category_id ? String(data.blog_category_id) : ""}
                                onValueChange={(val) => {
                                    setData((prev) => ({
                                        ...prev,
                                        blog_category_id: Number(val) || val,
                                        subcategory_id: "",
                                    }));
                                }}
                            >
                                <SelectTrigger className="h-11 bg-surface border-line hover:border-line-strong focus:border-ring text-ink">
                                    <SelectValue placeholder="Select Category">
                                        {selectedCategory ? (
                                            <div className="flex items-center gap-2 min-w-0 flex-1 text-left">
                                                <FolderKanban className="w-4 h-4 text-primary-ink shrink-0" />
                                                <span className="font-medium text-ink truncate text-sm">
                                                    {selectedCategory.name}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-subtle">Select Category</span>
                                        )}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent className="bg-surface border-line text-ink shadow-2xl min-w-[270px]">
                                    <SelectGroup>
                                        <SelectLabel>CONTENT CATEGORIES</SelectLabel>
                                        {categories.map((c) => (
                                            <SelectItem
                                                key={c.id}
                                                value={String(c.id)}
                                                className="py-2.5 px-3 cursor-pointer focus:bg-primary-soft focus:text-ink data-[highlighted]:bg-primary-soft"
                                            >
                                                <div className="flex items-center justify-between w-full pr-4 gap-3">
                                                    <div className="flex items-center gap-2.5 min-w-0">
                                                        <FolderKanban className="w-4 h-4 text-primary-ink shrink-0 opacity-80" />
                                                        <span className="font-medium text-ink text-sm truncate">
                                                            {c.name}
                                                        </span>
                                                    </div>
                                                    {c.subcategories && c.subcategories.length > 0 && (
                                                        <span className="text-2xs text-primary-ink bg-primary-soft border border-primary/20 px-1.5 py-0.5 rounded shrink-0">
                                                            {c.subcategories.length} sub
                                                        </span>
                                                    )}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.blog_category_id && (
                                <p className="text-danger text-xs">
                                    {errors.blog_category_id}
                                </p>
                            )}
                        </div>

                        {/* Subcategory */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-xs text-ink-2 flex items-center gap-1.5">
                                    <CornerDownRight className="w-3.5 h-3.5 text-subtle" />
                                    <span>Subcategory (Optional)</span>
                                </label>
                                {activeSubcategories.length > 0 && (
                                    <span className="text-2xs text-primary-ink">
                                        {activeSubcategories.length} available
                                    </span>
                                )}
                            </div>
                            <Select
                                value={data.subcategory_id ? String(data.subcategory_id) : "none"}
                                onValueChange={(val) =>
                                    setData("subcategory_id", val === "none" ? "" : Number(val) || val)
                                }
                                disabled={activeSubcategories.length === 0}
                            >
                                <SelectTrigger className="h-11 bg-surface border-line hover:border-line-strong focus:border-ring text-ink disabled:opacity-50">
                                    <SelectValue placeholder="Select Subcategory">
                                        <div className="flex items-center gap-2 min-w-0 flex-1 text-left">
                                            <CornerDownRight className="w-3.5 h-3.5 text-subtle shrink-0" />
                                            <span className="text-sm truncate text-ink">
                                                {selectedSubcategory
                                                    ? selectedSubcategory.name
                                                    : activeSubcategories.length === 0
                                                    ? "No subcategories available"
                                                    : "None (Direct in Primary Category)"}
                                            </span>
                                        </div>
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent className="bg-surface border-line text-ink shadow-2xl min-w-[270px]">
                                    <SelectGroup>
                                        <SelectLabel>SUBCATEGORY CLASSIFICATION</SelectLabel>
                                        <SelectItem
                                            value="none"
                                            className="py-2.5 px-3 cursor-pointer focus:bg-surface-2 text-subtle italic"
                                        >
                                            None (Direct in Primary Category)
                                        </SelectItem>
                                        {activeSubcategories.map((sub) => (
                                            <SelectItem
                                                key={sub.id}
                                                value={String(sub.id)}
                                                className="py-2.5 px-3 cursor-pointer focus:bg-primary-soft focus:text-ink data-[highlighted]:bg-primary-soft"
                                            >
                                                <div className="flex items-center gap-2.5 pr-4">
                                                    <CornerDownRight className="w-3.5 h-3.5 text-primary-ink shrink-0" />
                                                    <span className="text-sm font-medium text-ink">{sub.name}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.subcategory_id && (
                                <p className="text-danger text-xs">
                                    {errors.subcategory_id}
                                </p>
                            )}
                        </div>

                        {/* Tags */}
                        <div className="space-y-2">
                            <label className="text-xs text-ink-2">
                                Tags (Comma-separated)
                            </label>
                            <Input
                                placeholder="Motion, Spatial, UI/UX, Engineering"
                                value={data.tags}
                                onChange={(e) => setData("tags", e.target.value)}
                                className="bg-surface border-line focus:border-ring text-sm"
                            />
                            {tagPills.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                    {tagPills.map((tag, idx) => (
                                        <Badge
                                            key={idx}
                                            className="bg-surface-2 border border-line text-ink-2 text-2xs px-2 py-0.5 h-5"
                                        >
                                            #{tag}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                            {errors.tags && (
                                <p className="text-danger text-xs">{errors.tags}</p>
                            )}
                        </div>
                    </div>

                    {/* COVER MEDIA CARD */}
                    <div className="rounded-xl border border-line bg-surface p-6 space-y-5 shadow-xl">
                        <div className="flex items-center justify-between pb-3 border-b border-line">
                            <span className="text-xs font-bold uppercase tracking-wider text-ink flex items-center gap-2">
                                <ImageIcon className="w-4 h-4 text-primary-ink" />
                                COVER MEDIA & BANNER
                            </span>
                            {data.cover_image && (
                                <Badge className="bg-success-soft text-success border border-success/25 text-2xs px-2 py-0.5">
                                    ● ATTACHED
                                </Badge>
                            )}
                        </div>

                        {/* File Upload Dropzone */}
                        <div className="space-y-2">
                            <label className="text-xs text-ink-2 flex items-center justify-between">
                                <span className="flex items-center gap-1.5">
                                    <UploadCloud className="w-3.5 h-3.5 text-subtle" />
                                    <span>Upload Image File *</span>
                                </span>
                                <span className="text-2xs text-subtle">Max 10MB • Auto-optimized WebP</span>
                            </label>

                            <div
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => !isUploading && fileInputRef.current?.click()}
                                className={`group relative rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer overflow-hidden p-5 flex flex-col items-center justify-center text-center gap-2.5 ${
                                    isDragging
                                        ? "border-primary bg-primary-soft shadow-md"
                                        : isUploading
                                        ? "border-primary/50 bg-surface opacity-80 cursor-wait"
                                        : "border-line bg-surface hover:border-primary/60 hover:bg-surface-2"
                                }`}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp,image/avif,image/gif"
                                    className="hidden"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            handleFileUpload(e.target.files[0]);
                                        }
                                    }}
                                />

                                {isUploading ? (
                                    <div className="flex flex-col items-center gap-2 py-2">
                                        <Loader2 className="w-8 h-8 text-primary-ink animate-spin" />
                                        <div className="flex flex-col items-center gap-0.5">
                                            <span className="text-xs font-bold text-ink">
                                                Optimizing & uploading image...
                                            </span>
                                            <span className="text-2xs text-subtle">
                                                Resizing & encoding via Laravel Intervention
                                            </span>
                                        </div>
                                    </div>
                                ) : (uploadedFileName || data.cover_image) ? (
                                    <div className="flex items-center justify-between w-full p-2.5 rounded-lg bg-success-soft border border-success/25">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                                            <div className="flex flex-col text-left min-w-0">
                                                <span className="text-xs text-ink truncate max-w-[170px]">
                                                    {uploadedFileName || data.cover_image.split("/").pop()}
                                                </span>
                                                <span className="text-2xs text-success">
                                                    Optimized WebP • Click to replace
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 shrink-0">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    fileInputRef.current?.click();
                                                }}
                                                className="h-7 px-2 text-2xs text-ink-2 hover:text-ink"
                                            >
                                                Replace
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setData("cover_image", "");
                                                    setUploadedFileName(null);
                                                }}
                                                className="h-7 px-2 text-2xs text-danger hover:text-danger hover:bg-danger-soft"
                                                title="Remove cover image"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-10 h-10 rounded-full bg-surface-2 border border-line flex items-center justify-center text-subtle group-hover:text-primary-ink group-hover:border-primary/40 group-hover:scale-110 transition-all duration-200">
                                            <UploadCloud className="w-5 h-5" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-xs font-medium text-ink group-hover:text-primary-ink transition-colors">
                                                <span className="font-bold underline decoration-primary/60 underline-offset-2">
                                                    Click to upload
                                                </span>{" "}
                                                or drag & drop
                                            </p>
                                            <p className="text-2xs text-subtle">
                                                PNG, JPG, WEBP, AVIF or GIF (16:9 banner)
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>

                            {uploadError && (
                                <div className="flex items-start gap-2 p-2.5 rounded-lg bg-danger-soft border border-danger/25 text-danger text-xs">
                                    <AlertCircle className="w-4 h-4 text-danger shrink-0 mt-0.5" />
                                    <span className="flex-1">{uploadError}</span>
                                    <button
                                        type="button"
                                        onClick={() => setUploadError(null)}
                                        className="text-danger hover:text-danger cursor-pointer"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            )}

                            {errors.cover_image && (
                                <p className="text-danger text-xs flex items-center gap-1 mt-1">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    {errors.cover_image}
                                </p>
                            )}
                        </div>

                        {/* Live Image Preview (Only visible when image is uploaded / exists) */}
                        {Boolean(data.cover_image) && (
                            <div className="space-y-1.5 pt-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-2xs uppercase tracking-wider text-subtle flex items-center gap-1.5">
                                        <ImageIcon className="w-3 h-3 text-primary-ink" />
                                        <span>Live 16:9 Cinema Banner Preview</span>
                                    </span>
                                    {!imagePreviewError && (
                                        <a
                                            href={data.cover_image}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-2xs text-subtle hover:text-primary-ink flex items-center gap-1 transition-colors"
                                            title="View full resolution image in new tab"
                                        >
                                            <span>Full Size</span>
                                            <ExternalLink className="w-2.5 h-2.5" />
                                        </a>
                                    )}
                                </div>

                                <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-line bg-surface flex items-center justify-center group/preview shadow-inner">
                                    {!imagePreviewError ? (
                                        <>
                                            <img
                                                src={data.cover_image}
                                                alt={data.title || "Cover preview"}
                                                onError={() => setImagePreviewError(true)}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover/preview:scale-[1.02]"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-0 group-hover/preview:opacity-100 transition-opacity duration-200 flex items-end justify-between p-3">
                                                <span className="text-2xs text-white truncate max-w-[210px]">
                                                    {uploadedFileName || data.cover_image.split("/").pop()}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setData("cover_image", "");
                                                        setUploadedFileName(null);
                                                    }}
                                                    className="px-2 py-1 rounded bg-danger/90 hover:bg-danger-hover text-white text-2xs flex items-center gap-1 transition-colors shadow-lg cursor-pointer"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                    <span>Remove</span>
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-subtle text-xs p-4 text-center">
                                            <ImageIcon className="w-8 h-8 opacity-30 text-subtle" />
                                            <span className="text-danger text-2xs">
                                                Failed to load cover image
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setData("cover_image", "");
                                                    setUploadedFileName(null);
                                                }}
                                                className="text-2xs text-subtle hover:text-ink underline cursor-pointer"
                                            >
                                                Remove image
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* PUBLISHING HUB CARD */}
                    <div className="rounded-xl border border-line bg-surface p-6 space-y-5 shadow-xl">
                        <div className="flex items-center justify-between pb-3 border-b border-line">
                            <span className="text-xs font-bold uppercase tracking-wider text-ink flex items-center gap-2">
                                <Layers className="w-4 h-4 text-primary-ink" />
                                PUBLISHING HUB
                            </span>
                            <span
                                className={`px-2 py-0.5 text-2xs font-bold uppercase tracking-wider rounded border ${
                                    data.status === "published"
                                        ? "border-success/25 bg-success-soft text-success"
                                        : data.status === "draft"
                                        ? "border-warning/25 bg-warning-soft text-warning"
                                        : "border-line bg-surface-2 text-subtle"
                                }`}
                            >
                                {data.status}
                            </span>
                        </div>

                        {/* Status Select */}
                        <div className="space-y-1.5">
                            <label className="text-xs text-ink-2">
                                Publication Stage
                            </label>
                            <Select
                                value={data.status}
                                onValueChange={(val) =>
                                    setData(
                                        "status",
                                        val as "draft" | "published" | "archived"
                                    )
                                }
                            >
                                <SelectTrigger className="h-11 bg-surface border-line hover:border-line-strong focus:border-ring text-ink">
                                    <SelectValue>
                                        <div className="flex items-center gap-2 text-sm">
                                            <span
                                                className={`w-2 h-2 rounded-full ${
                                                    data.status === "published"
                                                        ? "bg-success shadow-xs"
                                                        : data.status === "draft"
                                                        ? "bg-warning shadow-xs"
                                                        : "bg-faint"
                                                }`}
                                            />
                                            <span className="font-medium text-ink">
                                                {data.status === "published"
                                                    ? "Published (Live to Public)"
                                                    : data.status === "draft"
                                                    ? "Draft (Private in Studio)"
                                                    : "Archived (Unlisted)"}
                                            </span>
                                        </div>
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent className="bg-surface border-line text-ink shadow-2xl">
                                    <SelectGroup>
                                        <SelectLabel>PUBLICATION STAGES</SelectLabel>
                                        <SelectItem value="published" className="py-2.5 cursor-pointer">
                                            <div className="flex items-center gap-2.5">
                                                <span className="w-2.5 h-2.5 rounded-full bg-success shadow-xs shrink-0" />
                                                <div className="flex flex-col text-left">
                                                    <span className="font-medium text-ink text-sm">Published</span>
                                                    <span className="text-2xs text-subtle">Live & indexable across public journal</span>
                                                </div>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="draft" className="py-2.5 cursor-pointer">
                                            <div className="flex items-center gap-2.5">
                                                <span className="w-2.5 h-2.5 rounded-full bg-warning shadow-xs shrink-0" />
                                                <div className="flex flex-col text-left">
                                                    <span className="font-medium text-ink text-sm">Draft</span>
                                                    <span className="text-2xs text-subtle">Private to workspace editorial team</span>
                                                </div>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="archived" className="py-2.5 cursor-pointer">
                                            <div className="flex items-center gap-2.5">
                                                <span className="w-2.5 h-2.5 rounded-full bg-faint shrink-0" />
                                                <div className="flex flex-col text-left">
                                                    <span className="font-medium text-ink text-sm">Archived</span>
                                                    <span className="text-2xs text-subtle">Unlisted and hidden from search feeds</span>
                                                </div>
                                            </div>
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Featured Toggle */}
                        <div className="flex items-center justify-between p-3 rounded-lg border border-line bg-surface-2">
                            <div className="space-y-0.5">
                                <label className="text-xs text-ink cursor-pointer flex items-center gap-1.5">
                                    <span>Featured Article</span>
                                    {data.is_featured && (
                                        <Badge className="bg-primary text-primary-foreground text-2xs font-bold px-1 py-0 h-4">
                                            HERO
                                        </Badge>
                                    )}
                                </label>
                                <p className="text-2xs text-subtle">
                                    Pin to top of public journal
                                </p>
                            </div>
                            <Switch
                                checked={data.is_featured}
                                onCheckedChange={(checked) => setData("is_featured", checked)}
                            />
                        </div>


                        {/* Form Submission Buttons */}
                        <div className="pt-2 space-y-2.5">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="w-full h-11 bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
                            >
                                <Save className="w-4 h-4" />
                                <span>
                                    {processing
                                        ? isEdit
                                            ? "Saving Updates..."
                                            : "Publishing..."
                                        : isEdit
                                        ? "Save Article Changes"
                                        : "Publish Article"}
                                </span>
                            </Button>

                            <Link href={route("admin.blogs.index")} className="block w-full">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full h-9 border-line bg-surface-2 hover:bg-surface-2 text-ink-2 hover:text-ink text-xs gap-2 cursor-pointer"
                                >
                                    <ArrowLeft className="w-3.5 h-3.5" />
                                    <span>Discard & Return to List</span>
                                </Button>
                            </Link>

                            {isEdit && blog && blog.slug && (
                                <a
                                    href={`/blog/${blog.slug}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block w-full"
                                >
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="w-full h-8 text-2xs text-subtle hover:text-ink hover:bg-surface-2 gap-1.5 cursor-pointer"
                                    >
                                        <Eye className="w-3 h-3 text-primary-ink" />
                                        <span>Preview Public Article</span>
                                        <ExternalLink className="w-2.5 h-2.5" />
                                    </Button>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
