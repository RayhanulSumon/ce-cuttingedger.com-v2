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
import { MoreHorizontal, Edit, Trash2, ExternalLink } from "lucide-react";
import { TeamMember } from "@/types/models";

interface TeamIndexProps {
    team: TeamMember[];
}

export default function TeamIndex({ team = [] }: TeamIndexProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
    const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);

    const createForm = useForm({
        name: "",
        email: "",
        role: "",
        bio: "",
        avatar: "/images/team/member-1.jpg",
        since_year: 2022,
        featured: true,
        sort_order: 0,
    });

    const editForm = useForm({
        name: "",
        email: "",
        role: "",
        bio: "",
        avatar: "",
        since_year: 2022,
        featured: true,
        sort_order: 0,
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(route("admin.team.store"), {
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
            },
        });
    };

    const openEdit = (m: TeamMember) => {
        setEditingMember(m);
        editForm.setData({
            name: m.name,
            email: m.email || "",
            role: m.role,
            bio: m.bio,
            avatar: m.avatar,
            since_year: m.since_year,
            featured: m.featured,
            sort_order: m.sort_order,
        });
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingMember) return;
        editForm.put(route("admin.team.update", editingMember.id), {
            onSuccess: () => {
                setEditingMember(null);
                editForm.reset();
            },
        });
    };

    const handleDelete = () => {
        if (!memberToDelete) return;
        router.delete(route("admin.team.destroy", memberToDelete.id), {
            onSuccess: () => setMemberToDelete(null),
        });
    };

    const columns: Column<TeamMember>[] = [
        {
            header: "CREW MEMBER",
            cell: (m) => (
                <div className="flex items-center gap-3">
                    <img
                        src={m.avatar}
                        alt={m.name}
                        className="w-9 h-9 rounded-full object-cover bg-neutral-900 border border-white/10"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src =
                                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80";
                        }}
                    />
                    <div>
                        <div className="font-semibold text-white">{m.name}</div>
                        <div className="text-xs text-neutral-400 font-mono">
                            {m.role}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            header: "TENURE",
            cell: (m) => (
                <span className="font-mono text-xs text-neutral-400">
                    Since {m.since_year}
                </span>
            ),
        },
        {
            header: "STATUS",
            cell: (m) =>
                m.featured ? (
                    <Badge variant="accent">FEATURED</Badge>
                ) : (
                    <Badge variant="outline">CREW</Badge>
                ),
        },
        {
            header: "ORDER",
            cell: (m) => (
                <span className="font-mono text-xs text-neutral-400">
                    #{m.sort_order}
                </span>
            ),
        },
        {
            header: "",
            className: "text-right",
            cell: (m) => (
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
                        <DropdownMenuItem asChild>
                            <a
                                href={`/team/${m.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="gap-2 cursor-pointer"
                            >
                                <ExternalLink className="w-3.5 h-3.5 text-[#d4ff00]" />
                                <span>View Live Single Page</span>
                            </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEdit(m)} className="gap-2">
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit Operative</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => setMemberToDelete(m)}
                            className="gap-2 text-rose-400 focus:text-rose-400"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Purge Operative</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    return (
        <AdminLayout title="CREW & OPERATIVES">
            <AdminPageHeader
                title="Team Members"
                description="Governs studio leaders, kinetic designers, and creative technologist profiles."
                actionLabel="Add Operative"
                onActionClick={() => setIsCreateOpen(true)}
            />

            <AdminDataTable
                columns={columns}
                data={team}
                searchKey="name"
                searchPlaceholder="Search crew by name..."
            />

            {/* Create Team Member Modal */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Commission Crew Member</DialogTitle>
                        <DialogDescription>
                            Profile details, title, and studio tenure.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleCreate} className="space-y-4 pt-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase text-neutral-400">
                                    Full Name
                                </label>
                                <Input
                                    value={createForm.data.name}
                                    onChange={(e) =>
                                        createForm.setData("name", e.target.value)
                                    }
                                    placeholder="e.g. Liam Vance"
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase text-neutral-400">
                                    Role / Title
                                </label>
                                <Input
                                    value={createForm.data.role}
                                    onChange={(e) =>
                                        createForm.setData("role", e.target.value)
                                    }
                                    placeholder="e.g. Principal Creative Technologist"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-mono uppercase text-neutral-400">
                                Email Address (Private / Internal)
                            </label>
                            <Input
                                type="email"
                                value={createForm.data.email}
                                onChange={(e) =>
                                    createForm.setData("email", e.target.value)
                                }
                                placeholder="e.g. operative@cuttingedger.com"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase text-neutral-400">
                                    Tenure Year
                                </label>
                                <Input
                                    type="number"
                                    value={createForm.data.since_year}
                                    onChange={(e) =>
                                        createForm.setData(
                                            "since_year",
                                            Number(e.target.value)
                                        )
                                    }
                                    required
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
                                Avatar Asset Path / URL
                            </label>
                            <Input
                                value={createForm.data.avatar}
                                onChange={(e) =>
                                    createForm.setData("avatar", e.target.value)
                                }
                                placeholder="https://... or /images/team/member-1.jpg"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-mono uppercase text-neutral-400">
                                Biography
                            </label>
                            <Textarea
                                value={createForm.data.bio}
                                onChange={(e) =>
                                    createForm.setData("bio", e.target.value)
                                }
                                placeholder="Short profile background..."
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                            <div>
                                <span className="text-xs font-semibold text-white block">
                                    Featured Crew Member
                                </span>
                                <span className="text-[11px] text-neutral-400 block">
                                    Display in featured team strips across the site.
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
                                {createForm.processing ? "Adding..." : "Add to Crew"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Team Member Modal */}
            <Dialog
                open={!!editingMember}
                onOpenChange={(open) => !open && setEditingMember(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Operative Profile</DialogTitle>
                        <DialogDescription>
                            Revise credentials, role title, and biography.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleUpdate} className="space-y-4 pt-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase text-neutral-400">
                                    Full Name
                                </label>
                                <Input
                                    value={editForm.data.name}
                                    onChange={(e) =>
                                        editForm.setData("name", e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase text-neutral-400">
                                    Role / Title
                                </label>
                                <Input
                                    value={editForm.data.role}
                                    onChange={(e) =>
                                        editForm.setData("role", e.target.value)
                                    }
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-mono uppercase text-neutral-400">
                                Email Address (Private / Internal)
                            </label>
                            <Input
                                type="email"
                                value={editForm.data.email}
                                onChange={(e) =>
                                    editForm.setData("email", e.target.value)
                                }
                                placeholder="e.g. operative@cuttingedger.com"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase text-neutral-400">
                                    Tenure Year
                                </label>
                                <Input
                                    type="number"
                                    value={editForm.data.since_year}
                                    onChange={(e) =>
                                        editForm.setData(
                                            "since_year",
                                            Number(e.target.value)
                                        )
                                    }
                                    required
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
                                Avatar Asset Path / URL
                            </label>
                            <Input
                                value={editForm.data.avatar}
                                onChange={(e) =>
                                    editForm.setData("avatar", e.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-mono uppercase text-neutral-400">
                                Biography
                            </label>
                            <Textarea
                                value={editForm.data.bio}
                                onChange={(e) =>
                                    editForm.setData("bio", e.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                            <div>
                                <span className="text-xs font-semibold text-white block">
                                    Featured Crew Member
                                </span>
                                <span className="text-[11px] text-neutral-400 block">
                                    Display in featured team strips across the site.
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
                                onClick={() => setEditingMember(null)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={editForm.processing}
                            >
                                {editForm.processing ? "Saving..." : "Save Changes"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Confirm Delete */}
            <AlertDialog
                open={!!memberToDelete}
                onOpenChange={(open) => !open && setMemberToDelete(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Purge Operative?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you certain you wish to remove{" "}
                            <span className="text-white font-semibold">
                                {memberToDelete?.name}
                            </span>{" "}
                            from the studio roster?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                            Purge Operative
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}
