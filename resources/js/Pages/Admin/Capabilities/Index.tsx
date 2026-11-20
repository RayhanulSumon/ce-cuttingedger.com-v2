import React, { useEffect, useMemo, useState } from "react";
import { router, useForm } from "@inertiajs/react";
import { ChevronDown, Edit, ImagePlus, Plus, Search, Trash2, X } from "lucide-react";
import { AdminLayout } from "@/Layouts/Admin/AdminLayout";
import { AdminPageHeader } from "@/Components/Admin/UI/AdminPageHeader";
import { CAPABILITY_ICON_NAMES, capabilityIcon } from "@/Components/Common/capabilityIcons";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/Components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { cn } from "@/lib/utils";
import { Capability } from "@/types/models";

interface CapabilitiesIndexProps {
    capabilities: Capability[];
}

interface FormData {
    parent_id: string;
    title: string;
    slug: string;
    tag: string;
    subtitle: string;
    icon: string;
    image_file: File | null;
    remove_image: boolean;
    meta_title: string;
    meta_description: string;
    is_active: boolean;
    sort_order: number;
}

const FIELD_LABEL = "text-xs font-semibold text-slate-700 block mb-1.5";
const SELECT =
    "w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/15";

const emptyForm = (parentId = ""): FormData => ({
    parent_id: parentId,
    title: "",
    slug: "",
    tag: "",
    subtitle: "",
    icon: "Layers",
    image_file: null,
    remove_image: false,
    meta_title: "",
    meta_description: "",
    is_active: true,
    sort_order: 0,
});

const toForm = (capability: Capability): FormData => ({
    parent_id: capability.parent_id ? String(capability.parent_id) : "",
    title: capability.title,
    slug: capability.slug,
    tag: capability.tag ?? "",
    subtitle: capability.subtitle,
    icon: capability.icon,
    image_file: null,
    remove_image: false,
    meta_title: capability.meta_title ?? "",
    meta_description: capability.meta_description ?? "",
    is_active: capability.is_active,
    sort_order: capability.sort_order,
});

export default function CapabilitiesIndex({ capabilities = [] }: CapabilitiesIndexProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<number | "all">("all");
    const [openIds, setOpenIds] = useState<Record<number, boolean>>(() =>
        capabilities[0]?.id ? { [capabilities[0].id]: true } : {}
    );

    const [editing, setEditing] = useState<Capability | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [toDelete, setToDelete] = useState<Capability | null>(null);
    const [imageError, setImageError] = useState<string | null>(null);
    const [objectPreview, setObjectPreview] = useState<string | null>(null);

    const form = useForm<FormData>(emptyForm());
    const isSub = form.data.parent_id !== "";

    useEffect(() => {
        return () => {
            if (objectPreview) {
                URL.revokeObjectURL(objectPreview);
            }
        };
    }, [objectPreview]);

    const resetImageState = () => {
        setImageError(null);
        if (objectPreview) {
            URL.revokeObjectURL(objectPreview);
        }
        setObjectPreview(null);
    };

    const openCreate = (parentId = "") => {
        setEditing(null);
        setShowAdvanced(false);
        resetImageState();
        form.setData(emptyForm(parentId));
        form.clearErrors();
        setIsOpen(true);
    };

    const openEdit = (capability: Capability) => {
        setEditing(capability);
        setShowAdvanced(false);
        resetImageState();
        form.setData(toForm(capability));
        form.clearErrors();
        setIsOpen(true);
    };

    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {
            setImageError("Please select a valid image file (JPG, PNG, WebP, AVIF, or GIF).");
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            setImageError("Image must be 10 MB or smaller.");
            return;
        }

        setImageError(null);
        if (objectPreview) {
            URL.revokeObjectURL(objectPreview);
        }
        setObjectPreview(URL.createObjectURL(file));
        form.setData((prev) => ({ ...prev, image_file: file, remove_image: false }));
    };

    const clearImage = () => {
        resetImageState();
        form.setData((prev) => ({ ...prev, image_file: null, remove_image: Boolean(editing?.image) }));
    };

    const submit = (event: React.FormEvent) => {
        event.preventDefault();

        form.transform((data) => ({
            ...data,
            ...(editing ? { _method: "PUT" } : {}),
            parent_id: data.parent_id || null,
            tag: data.parent_id ? null : data.tag || null,
        }));

        const options = {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                resetImageState();
                setIsOpen(false);
            },
        };

        form.post(editing ? `/admin/capabilities/${editing.id}` : "/admin/capabilities", options);
    };

    const confirmDelete = () => {
        if (!toDelete) {
            return;
        }
        router.delete(`/admin/capabilities/${toDelete.id}`, {
            preserveScroll: true,
            onFinish: () => setToDelete(null),
        });
    };

    const toggleCategory = (id: number) => {
        setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const allExpanded =
        capabilities.length > 0 && capabilities.every((c) => Boolean(openIds[c.id]));

    const toggleAllCategories = () => {
        const next = !allExpanded;
        const updated: Record<number, boolean> = {};
        capabilities.forEach((c) => {
            updated[c.id] = next;
        });
        setOpenIds(updated);
    };

    const filteredCapabilities = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        return capabilities
            .filter((main) => categoryFilter === "all" || main.id === categoryFilter)
            .map((main) => {
                const children = main.children ?? [];
                if (!q) {
                    return { main, children };
                }
                const mainMatches =
                    main.title.toLowerCase().includes(q) ||
                    (main.tag || "").toLowerCase().includes(q) ||
                    main.subtitle.toLowerCase().includes(q);

                if (mainMatches) {
                    return { main, children };
                }

                const matchingChildren = children.filter(
                    (child) =>
                        child.title.toLowerCase().includes(q) ||
                        child.subtitle.toLowerCase().includes(q)
                );

                return matchingChildren.length > 0
                    ? { main, children: matchingChildren }
                    : null;
            })
            .filter((entry): entry is { main: Capability; children: Capability[] } => entry !== null);
    }, [capabilities, categoryFilter, searchQuery]);

    const activePreview = objectPreview ?? (!form.data.remove_image ? editing?.image ?? null : null);
    const isSearching = searchQuery.trim().length > 0;

    return (
        <AdminLayout title="Capabilities">
            <AdminPageHeader
                title="Capabilities"
                description="Manage main service categories and the capabilities listed under each."
                actionLabel="Add Category"
                onActionClick={() => openCreate()}
            >
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={toggleAllCategories}
                    className="min-h-10 sm:min-h-9 border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                    {allExpanded ? "Collapse All" : "Expand All"}
                </Button>
            </AdminPageHeader>

            <div className="space-y-4">
                {/* Search & Category Filter Pills */}
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-wrap items-center gap-1.5">
                        <button
                            type="button"
                            onClick={() => setCategoryFilter("all")}
                            className={`cursor-pointer rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                                categoryFilter === "all"
                                    ? "bg-ink text-white"
                                    : "border border-slate-200 bg-white text-slate-600 hover:text-ink"
                            }`}
                        >
                            All ({capabilities.length})
                        </button>
                        {capabilities.map((cat) => (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => {
                                    setCategoryFilter(cat.id);
                                    setOpenIds((prev) => ({ ...prev, [cat.id]: true }));
                                }}
                                className={`cursor-pointer rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                                    categoryFilter === cat.id
                                        ? "bg-ink text-white"
                                        : "border border-slate-200 bg-white text-slate-600 hover:text-ink"
                                }`}
                            >
                                {cat.tag || cat.title} ({(cat.children ?? []).length})
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full lg:w-72">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search categories or services..."
                            className="bg-white pl-9 border-slate-200 text-ink"
                        />
                    </div>
                </div>

                {/* Collapsible Category Cards */}
                {filteredCapabilities.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200/90 bg-white px-6 py-12 text-center shadow-xs">
                        <p className="text-sm font-bold text-ink">No matching capabilities</p>
                        <p className="mt-1 text-xs text-slate-500">
                            Try clearing your search or choosing "All" categories above.
                        </p>
                    </div>
                ) : (
                    filteredCapabilities.map(({ main, children }) => {
                        const MainIcon = capabilityIcon(main.icon);
                        const isExpanded = isSearching || categoryFilter !== "all" || !!openIds[main.id];

                        return (
                            <section
                                key={main.id}
                                className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs"
                            >
                                {/* Category Header Bar */}
                                <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                                    <button
                                        type="button"
                                        onClick={() => toggleCategory(main.id)}
                                        aria-expanded={isExpanded}
                                        className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-left"
                                    >
                                        {main.image ? (
                                            <img
                                                src={main.image}
                                                alt={main.title}
                                                className="h-11 w-9 shrink-0 rounded-lg border border-slate-200 object-cover"
                                            />
                                        ) : (
                                            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                                                <MainIcon size={18} />
                                            </span>
                                        )}

                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                {main.tag && (
                                                    <span className="rounded-md bg-primary/10 px-2 py-0.5 font-mono text-[11px] font-bold text-primary">
                                                        {main.tag}
                                                    </span>
                                                )}
                                                <h2 className="truncate text-sm font-bold text-ink sm:text-base">
                                                    {main.title}
                                                </h2>
                                                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                                                    {children.length} services
                                                </span>
                                                {!main.is_active && (
                                                    <Badge variant="outline" className="text-[10px]">
                                                        Hidden
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="mt-0.5 truncate text-xs text-slate-500">
                                                {main.subtitle}
                                            </p>
                                        </div>

                                        <ChevronDown
                                            className={cn(
                                                "h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200",
                                                isExpanded ? "rotate-180" : ""
                                            )}
                                        />
                                    </button>

                                    <div className="flex flex-wrap items-center gap-1.5 self-end sm:self-center shrink-0">
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            onClick={() => openCreate(String(main.id))}
                                            className="min-h-10 sm:min-h-8 border-slate-200 bg-white text-xs font-semibold text-ink hover:bg-slate-50 cursor-pointer"
                                        >
                                            <Plus className="mr-1 h-3.5 w-3.5 text-primary" />
                                            Add Service
                                        </Button>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => openEdit(main)}
                                            aria-label={`Edit ${main.title}`}
                                            className="min-h-10 min-w-10 sm:min-h-8 sm:min-w-8 p-0 text-slate-600 hover:bg-slate-100 hover:text-ink cursor-pointer"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => setToDelete(main)}
                                            aria-label={`Delete ${main.title}`}
                                            className="min-h-10 min-w-10 sm:min-h-8 sm:min-w-8 p-0 text-rose-600 hover:bg-rose-50 hover:text-rose-700 cursor-pointer"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Sub-Capabilities List */}
                                {isExpanded && (
                                    <div className="divide-y divide-slate-100 border-t border-slate-100 bg-[#fafbfd]">
                                        {children.length === 0 ? (
                                            <div className="px-5 py-6 text-center text-xs text-slate-500">
                                                No services added under this category yet.
                                            </div>
                                        ) : (
                                            children.map((child) => {
                                                const ChildIcon = capabilityIcon(child.icon);
                                                return (
                                                    <div
                                                        key={child.id}
                                                        className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5 hover:bg-slate-50/90 transition-colors"
                                                    >
                                                        <div className="flex min-w-0 flex-1 items-center gap-3">
                                                            {child.image ? (
                                                                <img
                                                                    src={child.image}
                                                                    alt={child.title}
                                                                    className="h-10 w-8 shrink-0 rounded-lg border border-slate-200 object-cover"
                                                                />
                                                            ) : (
                                                                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-slate-200 bg-white text-primary">
                                                                    <ChildIcon size={16} />
                                                                </span>
                                                            )}

                                                            <div className="min-w-0 flex-1">
                                                                <div className="flex flex-wrap items-center gap-2">
                                                                    <p className="truncate text-sm font-semibold text-ink">
                                                                        {child.title}
                                                                    </p>
                                                                    {!child.is_active && (
                                                                        <Badge variant="outline" className="text-[10px]">
                                                                            Hidden
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                                <p className="truncate text-xs text-slate-500">
                                                                    {child.subtitle}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="flex shrink-0 items-center gap-1">
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => openEdit(child)}
                                                                aria-label={`Edit ${child.title}`}
                                                                className="min-h-10 min-w-10 sm:min-h-8 sm:min-w-8 p-0 text-slate-600 hover:bg-slate-200/60 hover:text-ink cursor-pointer"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => setToDelete(child)}
                                                                aria-label={`Delete ${child.title}`}
                                                                className="min-h-10 min-w-10 sm:min-h-8 sm:min-w-8 p-0 text-rose-600 hover:bg-rose-50 hover:text-rose-700 cursor-pointer"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                )}
                            </section>
                        );
                    })
                )}
            </div>

            {/* Create / Edit Modal */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>
                            {editing ? `Edit ${editing.title}` : isSub ? "Add Service" : "Add Category"}
                        </DialogTitle>
                        <DialogDescription>
                            Changes update the navigation menu, service pages, and AI chat immediately.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submit} className="space-y-4 pt-2">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className={FIELD_LABEL}>Category</label>
                                <select
                                    className={SELECT}
                                    value={form.data.parent_id}
                                    onChange={(e) => form.setData("parent_id", e.target.value)}
                                >
                                    <option value="">Main Category</option>
                                    {capabilities
                                        .filter((main) => main.id !== editing?.id)
                                        .map((main) => (
                                            <option key={main.id} value={main.id}>
                                                {main.title}
                                            </option>
                                        ))}
                                </select>
                                {form.errors.parent_id && (
                                    <p className="mt-1 text-xs text-rose-600">{form.errors.parent_id}</p>
                                )}
                            </div>
                            <div>
                                <label className={FIELD_LABEL}>Icon</label>
                                <select
                                    className={SELECT}
                                    value={form.data.icon}
                                    onChange={(e) => form.setData("icon", e.target.value)}
                                >
                                    {CAPABILITY_ICON_NAMES.map((name) => (
                                        <option key={name} value={name}>
                                            {name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-[1fr_8rem]">
                            <div>
                                <label className={FIELD_LABEL}>Title *</label>
                                <Input
                                    value={form.data.title}
                                    onChange={(e) => form.setData("title", e.target.value)}
                                    className="bg-white border-slate-200 text-ink"
                                    required
                                />
                                {form.errors.title && (
                                    <p className="mt-1 text-xs text-rose-600">{form.errors.title}</p>
                                )}
                            </div>
                            {!isSub && (
                                <div>
                                    <label className={FIELD_LABEL}>Short Tag</label>
                                    <Input
                                        value={form.data.tag}
                                        onChange={(e) => form.setData("tag", e.target.value)}
                                        placeholder="2D"
                                        maxLength={20}
                                        className="bg-white border-slate-200 text-ink"
                                    />
                                </div>
                            )}
                        </div>

                        <div>
                            <label className={FIELD_LABEL}>Short Summary *</label>
                            <Input
                                value={form.data.subtitle}
                                onChange={(e) => form.setData("subtitle", e.target.value)}
                                className="bg-white border-slate-200 text-ink"
                                required
                            />
                            {form.errors.subtitle && (
                                <p className="mt-1 text-xs text-rose-600">{form.errors.subtitle}</p>
                            )}
                        </div>

                        {/* Cover Image Card */}
                        <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <span className="text-xs font-bold text-ink block">Cover Image</span>
                                    <p className="mt-0.5 text-xs text-slate-500">
                                        Portrait 3:4 recommended · Auto-converted to WebP
                                    </p>
                                </div>
                                {activePreview && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearImage}
                                        className="h-8 text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                                    >
                                        <X className="mr-1 h-3.5 w-3.5" />
                                        Remove
                                    </Button>
                                )}
                            </div>

                            <div className="flex items-center gap-4">
                                {activePreview ? (
                                    <img
                                        src={activePreview}
                                        alt="Capability preview"
                                        className="aspect-[3/4] w-16 shrink-0 rounded-lg border border-slate-200 object-cover bg-white"
                                    />
                                ) : (
                                    <div className="grid aspect-[3/4] w-16 shrink-0 place-items-center rounded-lg border border-dashed border-slate-300 bg-white text-slate-400">
                                        <ImagePlus className="h-5 w-5" />
                                    </div>
                                )}

                                <label className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-ink shadow-xs transition-colors hover:border-primary hover:text-primary">
                                    <ImagePlus className="h-4 w-4 text-primary" />
                                    <span>{activePreview ? "Replace image" : "Upload image"}</span>
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
                                        className="sr-only"
                                        onChange={handleImageSelect}
                                    />
                                </label>
                            </div>

                            {(imageError || form.errors.image_file) && (
                                <p className="text-xs text-rose-600">{imageError || form.errors.image_file}</p>
                            )}
                        </div>

                        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-ink">
                            <input
                                type="checkbox"
                                checked={form.data.is_active}
                                onChange={(e) => form.setData("is_active", e.target.checked)}
                                className="h-4 w-4 rounded border-slate-300 accent-[var(--color-primary)]"
                            />
                            Show on the website
                        </label>

                        {/* Collapsible Advanced & SEO Section */}
                        <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50/70">
                            <button
                                type="button"
                                onClick={() => setShowAdvanced((v) => !v)}
                                className="flex w-full cursor-pointer items-center justify-between px-4 py-3 text-left text-xs font-semibold text-slate-700 hover:bg-slate-100/70"
                            >
                                <span>Advanced &amp; SEO (Optional)</span>
                                <ChevronDown
                                    className={cn(
                                        "h-4 w-4 text-slate-400 transition-transform",
                                        showAdvanced ? "rotate-180" : ""
                                    )}
                                />
                            </button>

                            {showAdvanced && (
                                <div className="space-y-3 border-t border-slate-200 bg-white p-4">
                                    <div className="grid gap-3 sm:grid-cols-[1fr_7rem]">
                                        <div>
                                            <label className={FIELD_LABEL}>URL Slug</label>
                                            <Input
                                                value={form.data.slug}
                                                onChange={(e) => form.setData("slug", e.target.value)}
                                                placeholder="auto-generated-from-title"
                                                className="bg-white border-slate-200 text-ink"
                                            />
                                            {form.errors.slug && (
                                                <p className="mt-1 text-xs text-rose-600">{form.errors.slug}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className={FIELD_LABEL}>Order</label>
                                            <Input
                                                type="number"
                                                min={0}
                                                value={form.data.sort_order}
                                                onChange={(e) => form.setData("sort_order", Number(e.target.value))}
                                                className="bg-white border-slate-200 text-ink"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <div>
                                            <label className={FIELD_LABEL}>Search Title</label>
                                            <Input
                                                value={form.data.meta_title}
                                                onChange={(e) => form.setData("meta_title", e.target.value)}
                                                className="bg-white border-slate-200 text-ink"
                                            />
                                        </div>
                                        <div>
                                            <label className={FIELD_LABEL}>Search Description</label>
                                            <Input
                                                value={form.data.meta_description}
                                                onChange={(e) => form.setData("meta_description", e.target.value)}
                                                className="bg-white border-slate-200 text-ink"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-2 border-t border-slate-200 pt-3">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setIsOpen(false)}
                                className="min-h-10 sm:min-h-9 cursor-pointer text-xs text-slate-600 hover:bg-slate-100 hover:text-ink"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={form.processing}
                                className="min-h-10 sm:min-h-9 cursor-pointer bg-primary text-xs font-semibold text-white hover:bg-primary-hover"
                            >
                                {form.processing ? "Saving..." : editing ? "Save Changes" : "Create"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <AlertDialog open={toDelete !== null} onOpenChange={(open) => !open && setToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete {toDelete?.title}?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {toDelete && !toDelete.parent_id && (toDelete.children ?? []).length > 0
                                ? `This also deletes its ${(toDelete.children ?? []).length} services under this category. `
                                : ""}
                            Visitors opening its old link will be redirected to the capabilities page.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}
