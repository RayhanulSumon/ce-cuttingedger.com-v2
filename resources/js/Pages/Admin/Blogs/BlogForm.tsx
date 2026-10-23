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
    Clock,
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
        cover_image:
            blog?.cover_image ||
            "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
        reading_time: blog?.reading_time || 5,
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

    useEffect(() => {
        setImagePreviewError(false);
    }, [data.cover_image]);

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

    // Helper: Auto-estimate reading time based on word count
    const handleEstimateReadingTime = () => {
        const text = data.body.replace(/<[^>]*>/g, " ").trim();
        const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
        const estimated = Math.max(1, Math.ceil(words / 200));
        setData("reading_time", estimated);
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
                <div className="flex items-center justify-between p-3 rounded-lg border border-[#d4ff00]/30 bg-[#d4ff00]/10 text-neutral-200 text-xs font-mono">
                    <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#d4ff00] animate-pulse" />
                        You have unsaved changes in this article dispatch.
                    </span>
                    <span className="text-neutral-400">Remember to commit your changes.</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* MAIN EDITORIAL COLUMN (8 cols) */}
                <div className="lg:col-span-8 space-y-8">
                    {/* CORE ARTICLE CARD */}
                    <div className="rounded-xl border border-white/10 bg-[#12131a] p-6 space-y-6 shadow-xl">
                        <div className="flex items-center justify-between pb-4 border-b border-white/10">
                            <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-[#d4ff00]" />
                                <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                                    CORE ARTICLE ATTRIBUTES
                                </span>
                            </div>
                            <Badge className="bg-white/5 text-neutral-400 border-white/10 font-mono text-[10px]">
                                Markdown & HTML Compatible
                            </Badge>
                        </div>

                        {/* Title & Slug */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-mono text-neutral-300 flex items-center justify-between">
                                    <span>Article Headline / Title *</span>
                                    <span className="text-neutral-500 text-[10px]">Required</span>
                                </label>
                                <Input
                                    value={data.title}
                                    onChange={(e) => setData("title", e.target.value)}
                                    placeholder="e.g. Kinetic Physics: Sculpting Tactile Interfaces"
                                    className="bg-[#0c0d12] border-white/10 focus:border-[#d4ff00] text-lg font-medium text-white placeholder:text-neutral-600 h-12"
                                    required
                                />
                                {errors.title && (
                                    <p className="text-rose-400 text-xs font-mono flex items-center gap-1.5 mt-1">
                                        <AlertCircle className="w-3.5 h-3.5" />
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-mono text-neutral-300">
                                        URL Slug {isEdit ? "*" : "(Optional - auto-generated if left blank)"}
                                    </label>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleGenerateSlug}
                                        disabled={!data.title}
                                        className="h-6 px-2 text-[11px] font-mono text-[#d4ff00] hover:text-[#d4ff00] hover:bg-[#d4ff00]/10 gap-1 cursor-pointer"
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
                                        className="bg-[#0c0d12] border-white/10 focus:border-[#d4ff00] font-mono text-sm text-neutral-300"
                                        required={isEdit}
                                    />
                                </div>
                                <div className="text-[11px] font-mono text-neutral-500 truncate flex items-center gap-1">
                                    <Globe className="w-3 h-3 shrink-0 text-neutral-400" />
                                    <span>Live URL preview:</span>
                                    <span className="text-[#d4ff00]">
                                        https://cuttingedger.com/blog/{data.slug || "your-slug"}
                                    </span>
                                </div>
                                {errors.slug && (
                                    <p className="text-rose-400 text-xs font-mono flex items-center gap-1.5 mt-1">
                                        <AlertCircle className="w-3.5 h-3.5" />
                                        {errors.slug}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Excerpt */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-mono text-neutral-300">
                                    Executive Excerpt / Synopsis *
                                </label>
                                <span className="text-[10px] font-mono text-neutral-500">
                                    {data.excerpt.length} characters (Recommended: 120-160)
                                </span>
                            </div>
                            <Textarea
                                rows={3}
                                value={data.excerpt}
                                onChange={(e) => setData("excerpt", e.target.value)}
                                placeholder="Hook readers with a sharp, punchy 2-sentence synopsis. This excerpt also serves as the default fallback for SEO search snippets."
                                className="bg-[#0c0d12] border-white/10 focus:border-[#d4ff00] text-sm text-neutral-200 leading-relaxed"
                                required
                            />
                            {errors.excerpt && (
                                <p className="text-rose-400 text-xs font-mono flex items-center gap-1.5 mt-1">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    {errors.excerpt}
                                </p>
                            )}
                        </div>

                        {/* Body Content Editor */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-mono text-neutral-300">
                                    Full Article Body Content *
                                </label>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleEstimateReadingTime}
                                    className="h-6 px-2 text-[11px] font-mono text-neutral-400 hover:text-white hover:bg-white/10 gap-1 cursor-pointer"
                                >
                                    <Clock className="w-3 h-3 text-[#d4ff00]" />
                                    <span>Recalculate Read Time</span>
                                </Button>
                            </div>
                            <div className="rounded-lg overflow-hidden border border-white/10 bg-[#0c0d12]">
                                <RichContentEditor
                                    value={data.body}
                                    onChange={(val) => setData("body", val)}
                                    placeholder="Write your article here using rich markdown or html syntax..."
                                />
                            </div>
                            {errors.body && (
                                <p className="text-rose-400 text-xs font-mono flex items-center gap-1.5 mt-1">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    {errors.body}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* DYNAMIC SEO MANAGER CARD */}
                    <div className="rounded-xl border border-white/10 bg-[#12131a] p-6 space-y-6 shadow-xl">
                        <div className="flex items-center justify-between pb-4 border-b border-white/10">
                            <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4 text-[#d4ff00]" />
                                <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                                    DYNAMIC SEARCH ENGINE OPTIMIZATION (SEO)
                                </span>
                            </div>
                            <span className="text-[10px] font-mono text-neutral-400">
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
                    {/* PUBLISHING HUB CARD */}
                    <div className="rounded-xl border border-white/10 bg-[#12131a] p-6 space-y-5 shadow-xl">
                        <div className="flex items-center justify-between pb-3 border-b border-white/10">
                            <span className="text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
                                <Layers className="w-4 h-4 text-[#d4ff00]" />
                                PUBLISHING HUB
                            </span>
                            <span
                                className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider rounded border ${
                                    data.status === "published"
                                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                                        : data.status === "draft"
                                        ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                                        : "border-neutral-500/30 bg-neutral-500/10 text-neutral-400"
                                }`}
                            >
                                {data.status}
                            </span>
                        </div>

                        {/* Status Select */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-mono text-neutral-300">
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
                                <SelectTrigger className="h-11 bg-[#0c0d12] border-white/10 hover:border-white/20 focus:border-[#d4ff00] text-white">
                                    <SelectValue>
                                        <div className="flex items-center gap-2 text-sm">
                                            <span
                                                className={`w-2 h-2 rounded-full ${
                                                    data.status === "published"
                                                        ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                                                        : data.status === "draft"
                                                        ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                                                        : "bg-neutral-400"
                                                }`}
                                            />
                                            <span className="font-medium text-white">
                                                {data.status === "published"
                                                    ? "Published (Live to Public)"
                                                    : data.status === "draft"
                                                    ? "Draft (Private in Studio)"
                                                    : "Archived (Unlisted)"}
                                            </span>
                                        </div>
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent className="bg-[#0f1118] border-white/15 text-white shadow-2xl">
                                    <SelectGroup>
                                        <SelectLabel>PUBLICATION STAGES</SelectLabel>
                                        <SelectItem value="published" className="py-2.5 cursor-pointer">
                                            <div className="flex items-center gap-2.5">
                                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)] shrink-0" />
                                                <div className="flex flex-col text-left">
                                                    <span className="font-medium text-white text-sm">Published</span>
                                                    <span className="text-[11px] font-mono text-neutral-400">Live & indexable across public journal</span>
                                                </div>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="draft" className="py-2.5 cursor-pointer">
                                            <div className="flex items-center gap-2.5">
                                                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)] shrink-0" />
                                                <div className="flex flex-col text-left">
                                                    <span className="font-medium text-white text-sm">Draft</span>
                                                    <span className="text-[11px] font-mono text-neutral-400">Private to workspace editorial team</span>
                                                </div>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="archived" className="py-2.5 cursor-pointer">
                                            <div className="flex items-center gap-2.5">
                                                <span className="w-2.5 h-2.5 rounded-full bg-neutral-400 shrink-0" />
                                                <div className="flex flex-col text-left">
                                                    <span className="font-medium text-white text-sm">Archived</span>
                                                    <span className="text-[11px] font-mono text-neutral-400">Unlisted and hidden from search feeds</span>
                                                </div>
                                            </div>
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Featured Toggle */}
                        <div className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-[#0c0d12]/60">
                            <div className="space-y-0.5">
                                <label className="text-xs font-mono text-white cursor-pointer flex items-center gap-1.5">
                                    <span>Featured Article</span>
                                    {data.is_featured && (
                                        <Badge className="bg-[#d4ff00] text-black text-[9px] font-mono font-bold px-1 py-0 h-4">
                                            HERO
                                        </Badge>
                                    )}
                                </label>
                                <p className="text-[11px] text-neutral-400 font-mono">
                                    Pin to top of public journal
                                </p>
                            </div>
                            <Switch
                                checked={data.is_featured}
                                onCheckedChange={(checked) => setData("is_featured", checked)}
                            />
                        </div>

                        {/* Estimated Reading Time */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-mono text-neutral-300 flex items-center justify-between">
                                <span>Estimated Reading Time</span>
                                <span className="text-[10px] font-mono text-neutral-500">Minutes</span>
                            </label>
                            <div className="relative flex items-center">
                                <Clock className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
                                <Input
                                    type="number"
                                    min={1}
                                    max={120}
                                    value={data.reading_time}
                                    onChange={(e) =>
                                        setData("reading_time", parseInt(e.target.value) || 1)
                                    }
                                    className="pl-9 bg-[#0c0d12] border-white/10 focus:border-[#d4ff00] font-mono text-sm"
                                />
                            </div>
                        </div>

                        {/* Form Submission Buttons */}
                        <div className="pt-2 space-y-2.5">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="w-full h-11 bg-[#d4ff00] hover:bg-[#b8dd00] text-black font-mono font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(212,255,0,0.15)] transition-all"
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
                                    className="w-full h-9 border-white/10 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white font-mono text-xs gap-2 cursor-pointer"
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
                                        className="w-full h-8 text-[11px] font-mono text-neutral-400 hover:text-white hover:bg-white/5 gap-1.5 cursor-pointer"
                                    >
                                        <Eye className="w-3 h-3 text-[#d4ff00]" />
                                        <span>Preview Public Article</span>
                                        <ExternalLink className="w-2.5 h-2.5" />
                                    </Button>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* TAXONOMY & AUTHOR CARD */}
                    <div className="rounded-xl border border-white/10 bg-[#12131a] p-6 space-y-5 shadow-xl">
                        <div className="pb-3 border-b border-white/10">
                            <span className="text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
                                <Tag className="w-4 h-4 text-[#d4ff00]" />
                                TAXONOMY & ATTRIBUTION
                            </span>
                        </div>

                        {/* Author */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-mono text-neutral-300 flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5 text-neutral-400" />
                                <span>Author / Creator *</span>
                            </label>
                            <Select
                                value={data.author_id ? String(data.author_id) : ""}
                                onValueChange={(val) => setData("author_id", Number(val) || val)}
                            >
                                <SelectTrigger className="h-11 bg-[#0c0d12] border-white/10 hover:border-white/20 focus:border-[#d4ff00] text-white">
                                    <SelectValue placeholder="Select Author">
                                        {selectedAuthor ? (
                                            <div className="flex items-center gap-2.5 min-w-0 flex-1 text-left">
                                                {selectedAuthor.avatar ? (
                                                    <img
                                                        src={selectedAuthor.avatar}
                                                        alt={selectedAuthor.name}
                                                        className="w-5 h-5 rounded-full object-cover border border-white/10 shrink-0"
                                                    />
                                                ) : (
                                                    <span className="w-5 h-5 rounded-full bg-[#d4ff00]/10 text-[#d4ff00] border border-[#d4ff00]/30 flex items-center justify-center text-[10px] font-mono font-bold shrink-0">
                                                        {selectedAuthor.name.charAt(0)}
                                                    </span>
                                                )}
                                                <span className="font-medium text-white truncate text-sm">
                                                    {selectedAuthor.name}
                                                </span>
                                                <span className="text-[10px] font-mono text-neutral-400 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded truncate max-w-[140px] shrink-0 hidden sm:inline-block">
                                                    {selectedAuthor.role}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-neutral-500">Select Author</span>
                                        )}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent className="bg-[#0f1118] border-white/15 text-white shadow-2xl min-w-[290px] max-w-[440px]">
                                    <SelectGroup>
                                        <SelectLabel>EDITORIAL CREW & CONTRIBUTORS</SelectLabel>
                                        {authors.map((a) => (
                                            <SelectItem
                                                key={a.id}
                                                value={String(a.id)}
                                                className="py-2.5 px-3 cursor-pointer focus:bg-[#d4ff00]/10 focus:text-white data-[highlighted]:bg-[#d4ff00]/10"
                                            >
                                                <div className="flex items-center gap-3 w-full pr-4">
                                                    {a.avatar ? (
                                                        <img
                                                            src={a.avatar}
                                                            alt={a.name}
                                                            className="w-7 h-7 rounded-full object-cover border border-white/10 shrink-0"
                                                        />
                                                    ) : (
                                                        <div className="w-7 h-7 rounded-full bg-[#d4ff00]/10 text-[#d4ff00] border border-[#d4ff00]/30 flex items-center justify-center text-xs font-mono font-bold shrink-0">
                                                            {a.name.charAt(0)}
                                                        </div>
                                                    )}
                                                    <div className="flex flex-col min-w-0 text-left">
                                                        <span className="font-medium text-white text-sm truncate">
                                                            {a.name}
                                                        </span>
                                                        <span className="text-[11px] font-mono text-neutral-400 truncate">
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
                                <p className="text-rose-400 text-xs font-mono">{errors.author_id}</p>
                            )}
                        </div>

                        {/* Primary Category */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-mono text-neutral-300 flex items-center gap-1.5">
                                <FolderKanban className="w-3.5 h-3.5 text-neutral-400" />
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
                                <SelectTrigger className="h-11 bg-[#0c0d12] border-white/10 hover:border-white/20 focus:border-[#d4ff00] text-white">
                                    <SelectValue placeholder="Select Category">
                                        {selectedCategory ? (
                                            <div className="flex items-center gap-2 min-w-0 flex-1 text-left">
                                                <FolderKanban className="w-4 h-4 text-[#d4ff00] shrink-0" />
                                                <span className="font-medium text-white truncate text-sm">
                                                    {selectedCategory.name}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-neutral-500">Select Category</span>
                                        )}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent className="bg-[#0f1118] border-white/15 text-white shadow-2xl min-w-[270px]">
                                    <SelectGroup>
                                        <SelectLabel>CONTENT CATEGORIES</SelectLabel>
                                        {categories.map((c) => (
                                            <SelectItem
                                                key={c.id}
                                                value={String(c.id)}
                                                className="py-2.5 px-3 cursor-pointer focus:bg-[#d4ff00]/10 focus:text-white data-[highlighted]:bg-[#d4ff00]/10"
                                            >
                                                <div className="flex items-center justify-between w-full pr-4 gap-3">
                                                    <div className="flex items-center gap-2.5 min-w-0">
                                                        <FolderKanban className="w-4 h-4 text-[#d4ff00] shrink-0 opacity-80" />
                                                        <span className="font-medium text-white text-sm truncate">
                                                            {c.name}
                                                        </span>
                                                    </div>
                                                    {c.subcategories && c.subcategories.length > 0 && (
                                                        <span className="text-[10px] font-mono text-[#d4ff00] bg-[#d4ff00]/10 border border-[#d4ff00]/20 px-1.5 py-0.5 rounded shrink-0">
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
                                <p className="text-rose-400 text-xs font-mono">
                                    {errors.blog_category_id}
                                </p>
                            )}
                        </div>

                        {/* Subcategory */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-mono text-neutral-300 flex items-center gap-1.5">
                                    <CornerDownRight className="w-3.5 h-3.5 text-neutral-400" />
                                    <span>Subcategory (Optional)</span>
                                </label>
                                {activeSubcategories.length > 0 && (
                                    <span className="text-[10px] font-mono text-[#d4ff00]">
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
                                <SelectTrigger className="h-11 bg-[#0c0d12] border-white/10 hover:border-white/20 focus:border-[#d4ff00] text-white disabled:opacity-50">
                                    <SelectValue placeholder="Select Subcategory">
                                        <div className="flex items-center gap-2 min-w-0 flex-1 text-left">
                                            <CornerDownRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                                            <span className="text-sm truncate text-white">
                                                {selectedSubcategory
                                                    ? selectedSubcategory.name
                                                    : activeSubcategories.length === 0
                                                    ? "No subcategories available"
                                                    : "None (Direct in Primary Category)"}
                                            </span>
                                        </div>
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent className="bg-[#0f1118] border-white/15 text-white shadow-2xl min-w-[270px]">
                                    <SelectGroup>
                                        <SelectLabel>SUBCATEGORY CLASSIFICATION</SelectLabel>
                                        <SelectItem
                                            value="none"
                                            className="py-2.5 px-3 cursor-pointer focus:bg-white/10 text-neutral-400 italic"
                                        >
                                            None (Direct in Primary Category)
                                        </SelectItem>
                                        {activeSubcategories.map((sub) => (
                                            <SelectItem
                                                key={sub.id}
                                                value={String(sub.id)}
                                                className="py-2.5 px-3 cursor-pointer focus:bg-[#d4ff00]/10 focus:text-white data-[highlighted]:bg-[#d4ff00]/10"
                                            >
                                                <div className="flex items-center gap-2.5 pr-4">
                                                    <CornerDownRight className="w-3.5 h-3.5 text-[#d4ff00] shrink-0" />
                                                    <span className="text-sm font-medium text-white">{sub.name}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.subcategory_id && (
                                <p className="text-rose-400 text-xs font-mono">
                                    {errors.subcategory_id}
                                </p>
                            )}
                        </div>

                        {/* Tags */}
                        <div className="space-y-2">
                            <label className="text-xs font-mono text-neutral-300">
                                Tags (Comma-separated)
                            </label>
                            <Input
                                placeholder="Motion, Spatial, UI/UX, Engineering"
                                value={data.tags}
                                onChange={(e) => setData("tags", e.target.value)}
                                className="bg-[#0c0d12] border-white/10 focus:border-[#d4ff00] text-sm"
                            />
                            {tagPills.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                    {tagPills.map((tag, idx) => (
                                        <Badge
                                            key={idx}
                                            className="bg-white/5 border border-white/10 text-neutral-300 text-[10px] font-mono px-2 py-0.5 h-5"
                                        >
                                            #{tag}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                            {errors.tags && (
                                <p className="text-rose-400 text-xs font-mono">{errors.tags}</p>
                            )}
                        </div>
                    </div>

                    {/* COVER MEDIA CARD */}
                    <div className="rounded-xl border border-white/10 bg-[#12131a] p-6 space-y-4 shadow-xl">
                        <div className="pb-3 border-b border-white/10">
                            <span className="text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
                                <ImageIcon className="w-4 h-4 text-[#d4ff00]" />
                                COVER MEDIA & BANNER
                            </span>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-mono text-neutral-300">
                                Image URL *
                            </label>
                            <Input
                                value={data.cover_image}
                                onChange={(e) => setData("cover_image", e.target.value)}
                                placeholder="https://images.unsplash.com/..."
                                className="bg-[#0c0d12] border-white/10 focus:border-[#d4ff00] text-xs font-mono"
                                required
                            />
                            {errors.cover_image && (
                                <p className="text-rose-400 text-xs font-mono">
                                    {errors.cover_image}
                                </p>
                            )}
                        </div>

                        {/* Live Image Preview */}
                        <div className="space-y-1.5">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                                Live Media Preview
                            </span>
                            <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-white/10 bg-[#0c0d12] flex items-center justify-center">
                                {data.cover_image && !imagePreviewError ? (
                                    <img
                                        src={data.cover_image}
                                        alt={data.title || "Cover preview"}
                                        onError={() => setImagePreviewError(true)}
                                        className="w-full h-full object-cover transition-opacity duration-300"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center gap-1.5 text-neutral-600 font-mono text-xs">
                                        <ImageIcon className="w-8 h-8 opacity-40" />
                                        <span>
                                            {imagePreviewError
                                                ? "Failed to load image from URL"
                                                : "Provide image URL above"}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
