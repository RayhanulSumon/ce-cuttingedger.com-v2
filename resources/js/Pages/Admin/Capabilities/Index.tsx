import React, { useState } from "react";
import { router, useForm } from "@inertiajs/react";
import { Edit, Plus, Trash2 } from "lucide-react";
import { AdminLayout } from "@/Layouts/Admin/AdminLayout";
import { AdminPageHeader } from "@/Components/Admin/UI/AdminPageHeader";
import { CAPABILITY_ICON_NAMES, capabilityIcon } from "@/Components/Common/capabilityIcons";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
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
    description: string;
    icon: string;
    features: string;
    deliverables: string;
    process_steps: string;
    faqs: string;
    meta_title: string;
    meta_description: string;
    is_active: boolean;
    sort_order: number;
}

const FIELD_LABEL = "text-xs font-mono uppercase text-neutral-400";
const SELECT =
    "w-full h-10 rounded-md border border-white/10 bg-white/[0.03] px-3 text-sm text-white outline-none focus:border-accent";

const lines = (text: string): string[] =>
    text.split("\n").map((line) => line.trim()).filter(Boolean);

/** "Left | Right" lines to pairs. */
const pairs = (text: string): [string, string][] =>
    lines(text).map((line) => {
        const [left, ...rest] = line.split("|");
        return [left.trim(), rest.join("|").trim()];
    });

const emptyForm = (parentId = ""): FormData => ({
    parent_id: parentId,
    title: "",
    slug: "",
    tag: "",
    subtitle: "",
    description: "",
    icon: "Layers",
    features: "",
    deliverables: "",
    process_steps: "",
    faqs: "",
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
    description: capability.description,
    icon: capability.icon,
    features: (capability.features ?? []).join("\n"),
    deliverables: (capability.deliverables ?? []).join("\n"),
    process_steps: (capability.process_steps ?? []).map((s) => `${s.title} | ${s.description}`).join("\n"),
    faqs: (capability.faqs ?? []).map((f) => `${f.question} | ${f.answer}`).join("\n"),
    meta_title: capability.meta_title ?? "",
    meta_description: capability.meta_description ?? "",
    is_active: capability.is_active,
    sort_order: capability.sort_order,
});

export default function CapabilitiesIndex({ capabilities = [] }: CapabilitiesIndexProps) {
    const [editing, setEditing] = useState<Capability | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [toDelete, setToDelete] = useState<Capability | null>(null);

    const form = useForm<FormData>(emptyForm());
    const isSub = form.data.parent_id !== "";

    const openCreate = (parentId = "") => {
        setEditing(null);
        form.setData(emptyForm(parentId));
        form.clearErrors();
        setIsOpen(true);
    };

    const openEdit = (capability: Capability) => {
        setEditing(capability);
        form.setData(toForm(capability));
        form.clearErrors();
        setIsOpen(true);
    };

    const submit = (event: React.FormEvent) => {
        event.preventDefault();

        form.transform((data) => ({
            ...data,
            parent_id: data.parent_id || null,
            tag: data.parent_id ? null : data.tag || null,
            features: lines(data.features),
            deliverables: lines(data.deliverables),
            process_steps: pairs(data.process_steps).map(([title, description]) => ({ title, description })),
            faqs: pairs(data.faqs).map(([question, answer]) => ({ question, answer })),
        }));

        const options = { preserveScroll: true, onSuccess: () => setIsOpen(false) };

        if (editing) {
            form.put(`/admin/capabilities/${editing.id}`, options);
        } else {
            form.post("/admin/capabilities", options);
        }
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

    const row = (capability: Capability, nested: boolean) => {
        const Icon = capabilityIcon(capability.icon);

        return (
            <div
                key={capability.id}
                className={`flex items-center gap-3 ${nested ? "rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3" : ""}`}
            >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/5 text-accent">
                    <Icon size={17} />
                </span>
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">
                        {capability.tag && <span className="mr-2 font-mono text-xs text-accent">{capability.tag}</span>}
                        {capability.title}
                    </p>
                    <p className="truncate text-xs text-neutral-400">{capability.subtitle}</p>
                </div>
                {!capability.is_active && <Badge variant="outline">Hidden</Badge>}
                <Button variant="ghost" size="icon" onClick={() => openEdit(capability)} aria-label={`Edit ${capability.title}`}>
                    <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setToDelete(capability)} aria-label={`Delete ${capability.title}`}>
                    <Trash2 className="h-4 w-4 text-rose-400" />
                </Button>
            </div>
        );
    };

    return (
        <AdminLayout title="CAPABILITIES">
            <AdminPageHeader
                title="Capabilities"
                description="Main capabilities (2D, 3D, DTP, Video) and the sub-capabilities under each. Changes appear on the website, menu and chat straight away."
                actionLabel="Add main capability"
                onActionClick={() => openCreate()}
            />

            <div className="space-y-6">
                {capabilities.map((main) => (
                    <section key={main.id} className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                        {row(main, false)}

                        <div className="space-y-2 border-t border-white/5 pt-4">
                            {(main.children ?? []).map((child) => row(child, true))}
                            <Button variant="outline" size="sm" onClick={() => openCreate(String(main.id))}>
                                <Plus className="mr-1.5 h-4 w-4" />
                                Add sub-capability
                            </Button>
                        </div>
                    </section>
                ))}
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{editing ? `Edit ${editing.title}` : isSub ? "Add sub-capability" : "Add main capability"}</DialogTitle>
                        <DialogDescription>No prices here. Pricing is quoted per project.</DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submit} className="space-y-4 pt-2">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <label className={FIELD_LABEL}>Belongs to</label>
                                <select
                                    className={SELECT}
                                    value={form.data.parent_id}
                                    onChange={(e) => form.setData("parent_id", e.target.value)}
                                >
                                    <option value="">Nothing (main capability)</option>
                                    {capabilities
                                        .filter((main) => main.id !== editing?.id)
                                        .map((main) => (
                                            <option key={main.id} value={main.id}>
                                                {main.title}
                                            </option>
                                        ))}
                                </select>
                                {form.errors.parent_id && <p className="text-xs text-rose-400">{form.errors.parent_id}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <label className={FIELD_LABEL}>Icon</label>
                                <select className={SELECT} value={form.data.icon} onChange={(e) => form.setData("icon", e.target.value)}>
                                    {CAPABILITY_ICON_NAMES.map((name) => (
                                        <option key={name} value={name}>
                                            {name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-[1fr_8rem]">
                            <div className="space-y-1.5">
                                <label className={FIELD_LABEL}>Title</label>
                                <Input value={form.data.title} onChange={(e) => form.setData("title", e.target.value)} required />
                                {form.errors.title && <p className="text-xs text-rose-400">{form.errors.title}</p>}
                            </div>
                            {!isSub && (
                                <div className="space-y-1.5">
                                    <label className={FIELD_LABEL}>Short tag</label>
                                    <Input value={form.data.tag} onChange={(e) => form.setData("tag", e.target.value)} placeholder="2D" maxLength={20} />
                                </div>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className={FIELD_LABEL}>Page address (optional)</label>
                            <Input value={form.data.slug} onChange={(e) => form.setData("slug", e.target.value)} placeholder="made from the title if left empty" />
                            {form.errors.slug && <p className="text-xs text-rose-400">{form.errors.slug}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className={FIELD_LABEL}>One-line summary</label>
                            <Input value={form.data.subtitle} onChange={(e) => form.setData("subtitle", e.target.value)} required />
                            {form.errors.subtitle && <p className="text-xs text-rose-400">{form.errors.subtitle}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className={FIELD_LABEL}>Description</label>
                            <Textarea rows={4} value={form.data.description} onChange={(e) => form.setData("description", e.target.value)} required />
                            {form.errors.description && <p className="text-xs text-rose-400">{form.errors.description}</p>}
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <label className={FIELD_LABEL}>What you get (one per line)</label>
                                <Textarea rows={4} value={form.data.features} onChange={(e) => form.setData("features", e.target.value)} />
                            </div>
                            <div className="space-y-1.5">
                                <label className={FIELD_LABEL}>Deliverables (one per line)</label>
                                <Textarea rows={4} value={form.data.deliverables} onChange={(e) => form.setData("deliverables", e.target.value)} />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className={FIELD_LABEL}>How it works (one step per line: Title | Description)</label>
                            <Textarea rows={4} value={form.data.process_steps} onChange={(e) => form.setData("process_steps", e.target.value)} />
                        </div>

                        <div className="space-y-1.5">
                            <label className={FIELD_LABEL}>Questions (one per line: Question | Answer)</label>
                            <Textarea rows={4} value={form.data.faqs} onChange={(e) => form.setData("faqs", e.target.value)} />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <label className={FIELD_LABEL}>Search title (optional)</label>
                                <Input value={form.data.meta_title} onChange={(e) => form.setData("meta_title", e.target.value)} />
                            </div>
                            <div className="space-y-1.5">
                                <label className={FIELD_LABEL}>Search description (optional)</label>
                                <Input value={form.data.meta_description} onChange={(e) => form.setData("meta_description", e.target.value)} />
                            </div>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                            <label className="flex cursor-pointer items-center gap-2 text-sm text-neutral-200">
                                <input
                                    type="checkbox"
                                    checked={form.data.is_active}
                                    onChange={(e) => form.setData("is_active", e.target.checked)}
                                    className="h-4 w-4 accent-[var(--color-accent)]"
                                />
                                Show on the website
                            </label>
                            <div className="flex items-center gap-2">
                                <label className={FIELD_LABEL}>Order</label>
                                <Input
                                    type="number"
                                    min={0}
                                    className="w-20"
                                    value={form.data.sort_order}
                                    onChange={(e) => form.setData("sort_order", Number(e.target.value))}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={form.processing}>
                                {form.processing ? "Saving…" : editing ? "Save changes" : "Create"}
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
                                ? `This also deletes its ${(toDelete.children ?? []).length} sub-capabilities. `
                                : ""}
                            Visitors who open its old address are redirected to the capabilities page.
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
