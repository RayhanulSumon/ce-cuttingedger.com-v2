import React, { useState } from "react";
import { useForm, router } from "@inertiajs/react";
import { AdminLayout } from "@/Layouts/Admin/AdminLayout";
import { AdminPageHeader } from "@/Components/Admin/UI/AdminPageHeader";
import { AdminDataTable, Column } from "@/Components/Admin/UI/AdminDataTable";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Badge } from "@/Components/ui/badge";
import { Switch } from "@/Components/ui/switch";
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
import { MoreHorizontal, Edit, Trash2, Star } from "lucide-react";
import { Testimonial } from "@/types/models";

interface TestimonialsIndexProps {
    testimonials: Testimonial[];
}

export default function TestimonialsIndex({ testimonials = [] }: TestimonialsIndexProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
    const [itemToDelete, setItemToDelete] = useState<Testimonial | null>(null);

    const createForm = useForm({
        client_name: "",
        client_role: "",
        client_company: "",
        quote: "",
        rating: 5,
        featured: true,
        avatar: "/images/team/member-1.jpg",
    });

    const editForm = useForm({
        client_name: "",
        client_role: "",
        client_company: "",
        quote: "",
        rating: 5,
        featured: true,
        avatar: "",
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(route("admin.testimonials.store"), {
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
            },
        });
    };

    const openEdit = (t: Testimonial) => {
        setEditingItem(t);
        editForm.setData({
            client_name: t.client_name,
            client_role: t.client_role,
            client_company: t.client_company,
            quote: t.quote,
            rating: t.rating,
            featured: t.featured,
            avatar: t.avatar || "",
        });
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingItem) return;
        editForm.put(route("admin.testimonials.update", editingItem.id), {
            onSuccess: () => {
                setEditingItem(null);
                editForm.reset();
            },
        });
    };

    const handleDelete = () => {
        if (!itemToDelete) return;
        router.delete(route("admin.testimonials.destroy", itemToDelete.id), {
            onSuccess: () => setItemToDelete(null),
        });
    };

    const columns: Column<Testimonial>[] = [
        {
            header: "ENDORSER / CLIENT",
            cell: (t) => (
                <div>
                    <div className="font-semibold text-white">{t.client_name}</div>
                    <div className="text-xs text-neutral-400 font-mono">
                        {t.client_role} • {t.client_company}
                    </div>
                </div>
            ),
        },
        {
            header: "STATEMENT",
            cell: (t) => (
                <div className="text-xs text-neutral-300 max-w-md truncate italic">
                    "{t.quote}"
                </div>
            ),
        },
        {
            header: "RATING",
            cell: (t) => (
                <div className="flex items-center gap-1 text-accent">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="font-mono text-xs">{t.rating}.0</span>
                </div>
            ),
        },
        {
            header: "STATUS",
            cell: (t) =>
                t.featured ? (
                    <Badge variant="accent">FEATURED</Badge>
                ) : (
                    <Badge variant="outline">ARCHIVE</Badge>
                ),
        },
        {
            header: "",
            className: "text-right",
            cell: (t) => (
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
                        <DropdownMenuItem onClick={() => openEdit(t)} className="gap-2">
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit Testimonial</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => setItemToDelete(t)}
                            className="gap-2 text-rose-400 focus:text-rose-400"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Purge Testimonial</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    return (
        <AdminLayout title="CLIENT ENDORSEMENTS">
            <AdminPageHeader
                title="Client Testimonials"
                description="Verified enterprise endorsements and client feedback accolades."
                actionLabel="Add Endorsement"
                onActionClick={() => setIsCreateOpen(true)}
            />

            <AdminDataTable
                columns={columns}
                data={testimonials}
                searchKey="client_name"
                searchPlaceholder="Search endorsers by name..."
            />

            {/* Create Testimonial Modal */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Record Client Endorsement</DialogTitle>
                        <DialogDescription>
                            Testimonial quote, client credentials, and rating score.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleCreate} className="space-y-4 pt-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase text-neutral-400">
                                    Client Name
                                </label>
                                <Input
                                    value={createForm.data.client_name}
                                    onChange={(e) =>
                                        createForm.setData("client_name", e.target.value)
                                    }
                                    placeholder="e.g. Marc Jacobs"
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase text-neutral-400">
                                    Company
                                </label>
                                <Input
                                    value={createForm.data.client_company}
                                    onChange={(e) =>
                                        createForm.setData(
                                            "client_company",
                                            e.target.value
                                        )
                                    }
                                    placeholder="e.g. Acme Corp"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase text-neutral-400">
                                    Role / Designation
                                </label>
                                <Input
                                    value={createForm.data.client_role}
                                    onChange={(e) =>
                                        createForm.setData("client_role", e.target.value)
                                    }
                                    placeholder="e.g. VP of Product"
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase text-neutral-400">
                                    Star Rating (1 - 5)
                                </label>
                                <Input
                                    type="number"
                                    min={1}
                                    max={5}
                                    value={createForm.data.rating}
                                    onChange={(e) =>
                                        createForm.setData(
                                            "rating",
                                            Number(e.target.value)
                                        )
                                    }
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-mono uppercase text-neutral-400">
                                Testimonial Quote
                            </label>
                            <Textarea
                                value={createForm.data.quote}
                                onChange={(e) =>
                                    createForm.setData("quote", e.target.value)
                                }
                                placeholder="Impactful client statement..."
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                            <div>
                                <span className="text-xs font-semibold text-white block">
                                    Featured Endorsement
                                </span>
                                <span className="text-[11px] text-neutral-400 block">
                                    Display in public testimonial carousels.
                                </span>
                            </div>
                            <Switch
                                checked={createForm.data.featured}
                                onCheckedChange={(val) =>
                                    createForm.setData("featured", val)
                                }
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
                                {createForm.processing ? "Saving..." : "Record"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Testimonial Modal */}
            <Dialog
                open={!!editingItem}
                onOpenChange={(open) => !open && setEditingItem(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Client Endorsement</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleUpdate} className="space-y-4 pt-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase text-neutral-400">
                                    Client Name
                                </label>
                                <Input
                                    value={editForm.data.client_name}
                                    onChange={(e) =>
                                        editForm.setData("client_name", e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase text-neutral-400">
                                    Company
                                </label>
                                <Input
                                    value={editForm.data.client_company}
                                    onChange={(e) =>
                                        editForm.setData(
                                            "client_company",
                                            e.target.value
                                        )
                                    }
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase text-neutral-400">
                                    Role / Designation
                                </label>
                                <Input
                                    value={editForm.data.client_role}
                                    onChange={(e) =>
                                        editForm.setData("client_role", e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase text-neutral-400">
                                    Star Rating (1 - 5)
                                </label>
                                <Input
                                    type="number"
                                    min={1}
                                    max={5}
                                    value={editForm.data.rating}
                                    onChange={(e) =>
                                        editForm.setData(
                                            "rating",
                                            Number(e.target.value)
                                        )
                                    }
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-mono uppercase text-neutral-400">
                                Testimonial Quote
                            </label>
                            <Textarea
                                value={editForm.data.quote}
                                onChange={(e) =>
                                    editForm.setData("quote", e.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                            <div>
                                <span className="text-xs font-semibold text-white block">
                                    Featured Endorsement
                                </span>
                                <span className="text-[11px] text-neutral-400 block">
                                    Display in public testimonial carousels.
                                </span>
                            </div>
                            <Switch
                                checked={editForm.data.featured}
                                onCheckedChange={(val) =>
                                    editForm.setData("featured", val)
                                }
                            />
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditingItem(null)}
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
                open={!!itemToDelete}
                onOpenChange={(open) => !open && setItemToDelete(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Purge Endorsement?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you certain you wish to purge feedback from{" "}
                            <span className="text-white font-semibold">
                                {itemToDelete?.client_name}
                            </span>
                            ?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                            Purge
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}
