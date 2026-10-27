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
import { Service } from "@/types/models";

interface ParentService {
    id: number;
    title: string;
    slug: string;
}

interface ServicesIndexProps {
    services: (Service & {
        parent?: { id: number; title: string; slug: string } | null;
        parent_id?: number | null;
    })[];
    parentServices?: ParentService[];
}

export default function ServicesIndex({
    services = [],
    parentServices = [],
}: ServicesIndexProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingService, setEditingService] = useState<any>(null);
    const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);

    const createForm = useForm({
        parent_id: "" as number | string,
        title: "",
        marquee_label: "",
        subtitle: "",
        description: "",
        icon: "Layers",
        accent_color: "#f5a623",
        sort_order: 0,
    });

    const editForm = useForm({
        parent_id: "" as number | string,
        title: "",
        marquee_label: "",
        subtitle: "",
        description: "",
        icon: "Layers",
        accent_color: "#f5a623",
        sort_order: 0,
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(route("admin.services.store"), {
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
            },
        });
    };

    const openEdit = (service: any) => {
        setEditingService(service);
        editForm.setData({
            parent_id: service.parent_id || "",
            title: service.title,
            marquee_label: service.marquee_label,
            subtitle: service.subtitle,
            description: service.description,
            icon: service.icon || "Layers",
            accent_color: service.accent_color || "#f5a623",
            sort_order: service.sort_order,
        });
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingService) return;
        editForm.put(route("admin.services.update", editingService.id), {
            onSuccess: () => {
                setEditingService(null);
                editForm.reset();
            },
        });
    };

    const handleDelete = () => {
        if (!serviceToDelete) return;
        router.delete(route("admin.services.destroy", serviceToDelete.id), {
            onSuccess: () => setServiceToDelete(null),
        });
    };

    const columns: Column<Service>[] = [
        {
            header: "DISCIPLINE / SERVICE",
            cell: (s) => (
                <div className="flex items-center gap-3">
                    <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-black shrink-0"
                        style={{
                            backgroundColor: `${s.accent_color || "#f5a623"}20`,
                            color: s.accent_color || "#f5a623",
                            border: `1px solid ${s.accent_color || "#f5a623"}40`,
                        }}
                    >
                        {s.icon?.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <div className="font-semibold text-white">{s.title}</div>
                        <div className="text-xs text-neutral-400 font-mono">
                            {s.subtitle}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            header: "PILLAR / HIERARCHY",
            cell: (s: any) =>
                s.parent ? (
                    <div className="flex items-center gap-1.5 font-mono text-xs text-neutral-300">
                        <span className="text-accent">↳</span>
                        <span className="font-semibold">{s.parent.title}</span>
                    </div>
                ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-accent/10 text-accent border border-accent/30 whitespace-nowrap">
                        ★ CORE PILLAR
                    </span>
                ),
        },
        {
            header: "MARQUEE LABEL",
            cell: (s) => (
                <Badge variant="outline" className="font-mono">
                    {s.marquee_label}
                </Badge>
            ),
        },
        {
            header: "ACCENT TONE",
            cell: (s) => (
                <div className="flex items-center gap-2">
                    <span
                        className="w-3.5 h-3.5 rounded-full border border-white/20"
                        style={{ backgroundColor: s.accent_color || "#f5a623" }}
                    />
                    <span className="font-mono text-xs text-neutral-300">
                        {s.accent_color || "#f5a623"}
                    </span>
                </div>
            ),
        },
        {
            header: "ORDER",
            cell: (s) => (
                <span className="font-mono text-xs text-neutral-400">
                    #{s.sort_order}
                </span>
            ),
        },
        {
            header: "",
            className: "text-right",
            cell: (s) => (
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
                        <DropdownMenuItem onClick={() => openEdit(s)} className="gap-2">
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit Discipline</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => setServiceToDelete(s)}
                            className="gap-2 text-rose-400 focus:text-rose-400"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete Discipline</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    return (
        <AdminLayout title="DISCIPLINES & CAPABILITIES">
            <AdminPageHeader
                title="Services Management"
                description="Govern studio engineering disciplines, kinetic branding modules, and deliverables."
                actionLabel="Create Discipline"
                onActionClick={() => setIsCreateOpen(true)}
            />

            <AdminDataTable
                columns={columns}
                data={services}
                searchKey="title"
                searchPlaceholder="Search services..."
            />

            {/* Create Service Modal */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Commission New Discipline</DialogTitle>
                        <DialogDescription>
                            Define service taxonomy, marquee titles, and accents.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleCreate} className="space-y-4 pt-2">
                        <div className="space-y-1.5 p-3 rounded-xl bg-white/[0.04] border border-white/10">
                            <label className="text-xs font-mono uppercase text-accent font-bold block">
                                Service Parent Pillar (Hierarchy)
                            </label>
                            <p className="text-[11px] text-neutral-400">
                                Leave as "Top-Level Core Pillar" for primary disciplines, or select a parent to create a specialized child sub-service.
                            </p>
                            <select
                                value={createForm.data.parent_id}
                                onChange={(e) =>
                                    createForm.setData(
                                        "parent_id",
                                        e.target.value === "" ? "" : Number(e.target.value)
                                    )
                                }
                                className="w-full h-9 rounded-md bg-neutral-900 border border-white/15 text-xs text-white px-3 font-mono"
                            >
                                <option value="">★ Top-Level Core Pillar (No Parent)</option>
                                {parentServices.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        ↳ Sub-service of: {p.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-mono uppercase text-neutral-400">
                                Discipline Title
                            </label>
                            <Input
                                value={createForm.data.title}
                                onChange={(e) =>
                                    createForm.setData("title", e.target.value)
                                }
                                placeholder="e.g. 3D Generative Realtime"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase text-neutral-400">
                                    Marquee Ribbon Label
                                </label>
                                <Input
                                    value={createForm.data.marquee_label}
                                    onChange={(e) =>
                                        createForm.setData("marquee_label", e.target.value)
                                    }
                                    placeholder="e.g. WEBGL // SHADERS"
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase text-neutral-400">
                                    Icon Token
                                </label>
                                <Input
                                    value={createForm.data.icon}
                                    onChange={(e) =>
                                        createForm.setData("icon", e.target.value)
                                    }
                                    placeholder="Layers"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase text-neutral-400">
                                    Accent Hex Color
                                </label>
                                <Input
                                    value={createForm.data.accent_color}
                                    onChange={(e) =>
                                        createForm.setData("accent_color", e.target.value)
                                    }
                                    placeholder="#f5a623"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase text-neutral-400">
                                    Sort Order
                                </label>
                                <Input
                                    type="number"
                                    value={createForm.data.sort_order}
                                    onChange={(e) =>
                                        createForm.setData(
                                            "sort_order",
                                            Number(e.target.value)
                                        )
                                    }
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-mono uppercase text-neutral-400">
                                Subtitle / Hook
                            </label>
                            <Input
                                value={createForm.data.subtitle}
                                onChange={(e) =>
                                    createForm.setData("subtitle", e.target.value)
                                }
                                placeholder="e.g. Kinetic web architectures engineered for scale"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-mono uppercase text-neutral-400">
                                In-Depth Description
                            </label>
                            <Textarea
                                value={createForm.data.description}
                                onChange={(e) =>
                                    createForm.setData("description", e.target.value)
                                }
                                placeholder="Full capability overview..."
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
                                {createForm.processing ? "Commissioning..." : "Commission"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Service Modal */}
            <Dialog
                open={!!editingService}
                onOpenChange={(open) => !open && setEditingService(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Discipline</DialogTitle>
                        <DialogDescription>
                            Revise capability metadata, palette, or order.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleUpdate} className="space-y-4 pt-2">
                        <div className="space-y-1.5 p-3 rounded-xl bg-white/[0.04] border border-white/10">
                            <label className="text-xs font-mono uppercase text-accent font-bold block">
                                Service Parent Pillar (Hierarchy)
                            </label>
                            <p className="text-[11px] text-neutral-400">
                                Leave as "Top-Level Core Pillar" for primary disciplines, or select a parent to nest under a pillar.
                            </p>
                            <select
                                value={editForm.data.parent_id}
                                onChange={(e) =>
                                    editForm.setData(
                                        "parent_id",
                                        e.target.value === "" ? "" : Number(e.target.value)
                                    )
                                }
                                className="w-full h-9 rounded-md bg-neutral-900 border border-white/15 text-xs text-white px-3 font-mono"
                            >
                                <option value="">★ Top-Level Core Pillar (No Parent)</option>
                                {parentServices
                                    .filter((p) => p.id !== editingService?.id)
                                    .map((p) => (
                                        <option key={p.id} value={p.id}>
                                            ↳ Sub-service of: {p.title}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-mono uppercase text-neutral-400">
                                Discipline Title
                            </label>
                            <Input
                                value={editForm.data.title}
                                onChange={(e) =>
                                    editForm.setData("title", e.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase text-neutral-400">
                                    Marquee Ribbon Label
                                </label>
                                <Input
                                    value={editForm.data.marquee_label}
                                    onChange={(e) =>
                                        editForm.setData("marquee_label", e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase text-neutral-400">
                                    Icon Token
                                </label>
                                <Input
                                    value={editForm.data.icon}
                                    onChange={(e) =>
                                        editForm.setData("icon", e.target.value)
                                    }
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase text-neutral-400">
                                    Accent Hex Color
                                </label>
                                <Input
                                    value={editForm.data.accent_color}
                                    onChange={(e) =>
                                        editForm.setData("accent_color", e.target.value)
                                    }
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase text-neutral-400">
                                    Sort Order
                                </label>
                                <Input
                                    type="number"
                                    value={editForm.data.sort_order}
                                    onChange={(e) =>
                                        editForm.setData(
                                            "sort_order",
                                            Number(e.target.value)
                                        )
                                    }
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-mono uppercase text-neutral-400">
                                Subtitle / Hook
                            </label>
                            <Input
                                value={editForm.data.subtitle}
                                onChange={(e) =>
                                    editForm.setData("subtitle", e.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-mono uppercase text-neutral-400">
                                In-Depth Description
                            </label>
                            <Textarea
                                value={editForm.data.description}
                                onChange={(e) =>
                                    editForm.setData("description", e.target.value)
                                }
                                required
                            />
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditingService(null)}
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
                open={!!serviceToDelete}
                onOpenChange={(open) => !open && setServiceToDelete(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Purge Discipline?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you certain you want to remove discipline{" "}
                            <span className="text-white font-semibold">
                                {serviceToDelete?.title}
                            </span>
                            ?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                            Purge Discipline
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}
