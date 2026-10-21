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
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { CareerOpening } from "@/types/models";

interface CareersIndexProps {
    careers: CareerOpening[];
}

export default function CareersIndex({ careers = [] }: CareersIndexProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<CareerOpening | null>(null);
    const [roleToDelete, setRoleToDelete] = useState<CareerOpening | null>(null);

    const createForm = useForm({
        title: "",
        department: "Engineering",
        location_type: "Remote",
        experience_level: "Senior",
        overview: "",
        is_open: true,
    });

    const editForm = useForm({
        title: "",
        department: "",
        location_type: "",
        experience_level: "",
        overview: "",
        is_open: true,
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(route("admin.careers.store"), {
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
            },
        });
    };

    const openEdit = (c: CareerOpening) => {
        setEditingRole(c);
        editForm.setData({
            title: c.title,
            department: c.department,
            location_type: c.location_type,
            experience_level: c.experience_level,
            overview: c.overview,
            is_open: c.is_open,
        });
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingRole) return;
        editForm.put(route("admin.careers.update", editingRole.id), {
            onSuccess: () => {
                setEditingRole(null);
                editForm.reset();
            },
        });
    };

    const handleDelete = () => {
        if (!roleToDelete) return;
        router.delete(route("admin.careers.destroy", roleToDelete.id), {
            onSuccess: () => setRoleToDelete(null),
        });
    };

    const columns: Column<CareerOpening>[] = [
        {
            header: "POSITION / ROLE",
            cell: (c) => (
                <div>
                    <div className="font-semibold text-white">{c.title}</div>
                    <div className="text-xs text-neutral-400 font-mono">
                        {c.department} • {c.location_type}
                    </div>
                </div>
            ),
        },
        {
            header: "LEVEL",
            cell: (c) => (
                <Badge variant="outline">
                    {c.experience_level}
                </Badge>
            ),
        },
        {
            header: "STATUS",
            cell: (c) =>
                c.is_open ? (
                    <Badge variant="success">RECRUITING</Badge>
                ) : (
                    <Badge variant="secondary">CLOSED</Badge>
                ),
        },
        {
            header: "",
            className: "text-right",
            cell: (c) => (
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
                        <DropdownMenuItem onClick={() => openEdit(c)} className="gap-2">
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit Opening</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => setRoleToDelete(c)}
                            className="gap-2 text-rose-400 focus:text-rose-400"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Purge Opening</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    return (
        <AdminLayout title="TALENT & CAREERS">
            <AdminPageHeader
                title="Career Openings"
                description="Manage open disciplines, remote engineering billets, and creative auditions."
                actionLabel="Create Opening"
                onActionClick={() => setIsCreateOpen(true)}
            />

            <AdminDataTable
                columns={columns}
                data={careers}
                searchKey="title"
                searchPlaceholder="Search career roles..."
            />

            {/* Create Career Modal */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Open New Career Billet</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleCreate} className="space-y-4 pt-2">
                        <div className="space-y-1.5">
                            <label className="text-xs font-mono uppercase text-neutral-400">
                                Position Title
                            </label>
                            <Input
                                value={createForm.data.title}
                                onChange={(e) =>
                                    createForm.setData("title", e.target.value)
                                }
                                placeholder="e.g. Lead WebGL Shader Engineer"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase text-neutral-400">
                                    Department
                                </label>
                                <Input
                                    value={createForm.data.department}
                                    onChange={(e) =>
                                        createForm.setData("department", e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase text-neutral-400">
                                    Location
                                </label>
                                <Input
                                    value={createForm.data.location_type}
                                    onChange={(e) =>
                                        createForm.setData("location_type", e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase text-neutral-400">
                                    Experience
                                </label>
                                <Input
                                    value={createForm.data.experience_level}
                                    onChange={(e) =>
                                        createForm.setData("experience_level", e.target.value)
                                    }
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-mono uppercase text-neutral-400">
                                Position Overview
                            </label>
                            <Textarea
                                value={createForm.data.overview}
                                onChange={(e) =>
                                    createForm.setData("overview", e.target.value)
                                }
                                placeholder="High-impact mission brief for candidates..."
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                            <div>
                                <span className="text-xs font-semibold text-white block">
                                    Recruiting Status
                                </span>
                                <span className="text-[11px] text-neutral-400 block">
                                    Active for public applications.
                                </span>
                            </div>
                            <Switch
                                checked={createForm.data.is_open}
                                onCheckedChange={(val) =>
                                    createForm.setData("is_open", val)
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
                                {createForm.processing ? "Publishing..." : "Publish Opening"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Career Modal */}
            <Dialog
                open={!!editingRole}
                onOpenChange={(open) => !open && setEditingRole(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Career Opening</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleUpdate} className="space-y-4 pt-2">
                        <div className="space-y-1.5">
                            <label className="text-xs font-mono uppercase text-neutral-400">
                                Position Title
                            </label>
                            <Input
                                value={editForm.data.title}
                                onChange={(e) =>
                                    editForm.setData("title", e.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase text-neutral-400">
                                    Department
                                </label>
                                <Input
                                    value={editForm.data.department}
                                    onChange={(e) =>
                                        editForm.setData("department", e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase text-neutral-400">
                                    Location
                                </label>
                                <Input
                                    value={editForm.data.location_type}
                                    onChange={(e) =>
                                        editForm.setData("location_type", e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase text-neutral-400">
                                    Experience
                                </label>
                                <Input
                                    value={editForm.data.experience_level}
                                    onChange={(e) =>
                                        editForm.setData("experience_level", e.target.value)
                                    }
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-mono uppercase text-neutral-400">
                                Position Overview
                            </label>
                            <Textarea
                                value={editForm.data.overview}
                                onChange={(e) =>
                                    editForm.setData("overview", e.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                            <div>
                                <span className="text-xs font-semibold text-white block">
                                    Recruiting Status
                                </span>
                                <span className="text-[11px] text-neutral-400 block">
                                    Active for public applications.
                                </span>
                            </div>
                            <Switch
                                checked={editForm.data.is_open}
                                onCheckedChange={(val) =>
                                    editForm.setData("is_open", val)
                                }
                            />
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditingRole(null)}
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
                open={!!roleToDelete}
                onOpenChange={(open) => !open && setRoleToDelete(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Purge Career Opening?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you certain you want to purge opening{" "}
                            <span className="text-white font-semibold">
                                {roleToDelete?.title}
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
