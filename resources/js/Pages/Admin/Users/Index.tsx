import React, { useState } from "react";
import { useForm, router } from "@inertiajs/react";
import { AdminLayout } from "@/Layouts/Admin/AdminLayout";
import { AdminPageHeader } from "@/Components/Admin/UI/AdminPageHeader";
import { AdminDataTable, Column } from "@/Components/Admin/UI/AdminDataTable";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
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
import { Shield, MoreHorizontal, UserCheck, UserX, Trash2, Edit } from "lucide-react";

interface UserRecord {
    id: number;
    name: string;
    email: string;
    role_id: number;
    role_name?: string;
    status: string;
    last_login_at?: string;
    created_at?: string;
}

interface RoleRecord {
    id: number;
    name: string;
}

interface UsersIndexProps {
    users: UserRecord[];
    roles: RoleRecord[];
}

export default function UsersIndex({ users = [], roles = [] }: UsersIndexProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
    const [userToDelete, setUserToDelete] = useState<UserRecord | null>(null);

    // Create form
    const createForm = useForm({
        name: "",
        email: "",
        role_id: roles[0]?.id || 1,
        status: "active",
        password: "",
    });

    // Edit form
    const editForm = useForm({
        name: "",
        email: "",
        role_id: 1,
        status: "active",
        password: "",
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(route("admin.users.store"), {
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
            },
        });
    };

    const openEditModal = (user: UserRecord) => {
        setEditingUser(user);
        editForm.setData({
            name: user.name,
            email: user.email,
            role_id: user.role_id,
            status: user.status,
            password: "",
        });
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;
        editForm.put(route("admin.users.update", editingUser.id), {
            onSuccess: () => {
                setEditingUser(null);
                editForm.reset();
            },
        });
    };

    const handleToggleStatus = (user: UserRecord) => {
        router.post(route("admin.users.toggle-status", user.id));
    };

    const handleDelete = () => {
        if (!userToDelete) return;
        router.delete(route("admin.users.destroy", userToDelete.id), {
            onSuccess: () => setUserToDelete(null),
        });
    };

    const formatRoleLabel = (name?: string) => {
        if (!name) return "Unknown";
        return name
            .split("_")
            .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
            .join(" ");
    };

    const columns: Column<UserRecord>[] = [
        {
            header: "USER / AGENT",
            cell: (user) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-mono text-xs font-bold text-white">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div className="font-semibold text-white">{user.name}</div>
                        <div className="text-xs text-neutral-400 font-mono">
                            {user.email}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            header: "ROLE CLEARANCE",
            cell: (user) => {
                const isSuper = user.role_name === "super_admin";
                const isAdmin = user.role_name === "admin";
                return (
                    <Badge
                        variant={isSuper ? "accent" : isAdmin ? "success" : "secondary"}
                    >
                        {formatRoleLabel(user.role_name)}
                    </Badge>
                );
            },
        },
        {
            header: "STATUS",
            cell: (user) => (
                <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium ${
                        user.status === "active"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                    }`}
                >
                    <span
                        className={`w-1.5 h-1.5 rounded-full ${
                            user.status === "active"
                                ? "bg-emerald-400"
                                : "bg-rose-400"
                        }`}
                    />
                    <span className="capitalize">{user.status}</span>
                </span>
            ),
        },
        {
            header: "LAST LOGIN",
            cell: (user) => (
                <span className="text-xs font-mono text-neutral-400">
                    {user.last_login_at || "Never"}
                </span>
            ),
        },
        {
            header: "JOINED",
            cell: (user) => (
                <span className="text-xs font-mono text-neutral-400">
                    {user.created_at || "—"}
                </span>
            ),
        },
        {
            header: "",
            className: "text-right",
            cell: (user) => (
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
                        <DropdownMenuItem
                            onClick={() => openEditModal(user)}
                            className="gap-2"
                        >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit Clearance</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => handleToggleStatus(user)}
                            className="gap-2"
                        >
                            {user.status === "active" ? (
                                <>
                                    <UserX className="w-3.5 h-3.5 text-amber-400" />
                                    <span>Suspend Access</span>
                                </>
                            ) : (
                                <>
                                    <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>Activate Access</span>
                                </>
                            )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => setUserToDelete(user)}
                            className="gap-2 text-rose-400 focus:text-rose-400"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Purge Account</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    return (
        <AdminLayout title="OPERATIVE CLEARANCES">
            <AdminPageHeader
                title="User & Role Management"
                description="Commission operatives, govern clearance tiers, and regulate system authorization."
                badge="SUPER ADMIN ONLY"
                actionLabel="Commission User"
                onActionClick={() => setIsCreateOpen(true)}
            />

            <AdminDataTable
                columns={columns}
                data={users}
                searchKey="name"
                searchPlaceholder="Search operatives by name or email..."
            />

            {/* Create Operative Modal */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Commission New User Account</DialogTitle>
                        <DialogDescription>
                            Create an operative identity and assign clearance privileges.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleCreate} className="space-y-4 pt-2">
                        <div className="space-y-1.5">
                            <label className="text-xs font-mono uppercase text-neutral-400">
                                Full Name
                            </label>
                            <Input
                                value={createForm.data.name}
                                onChange={(e) =>
                                    createForm.setData("name", e.target.value)
                                }
                                placeholder="e.g. Elena Rostova"
                                required
                            />
                            {createForm.errors.name && (
                                <p className="text-xs text-rose-400">
                                    {createForm.errors.name}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-mono uppercase text-neutral-400">
                                Work Email
                            </label>
                            <Input
                                type="email"
                                value={createForm.data.email}
                                onChange={(e) =>
                                    createForm.setData("email", e.target.value)
                                }
                                placeholder="elena@cuttingedger.com"
                                required
                            />
                            {createForm.errors.email && (
                                <p className="text-xs text-rose-400">
                                    {createForm.errors.email}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase text-neutral-400">
                                    Assigned Role
                                </label>
                                <Select
                                    value={createForm.data.role_id ? String(createForm.data.role_id) : ""}
                                    onValueChange={(val) =>
                                        createForm.setData("role_id", Number(val))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roles.map((r) => (
                                            <SelectItem key={r.id} value={String(r.id)}>
                                                {formatRoleLabel(r.name)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase text-neutral-400">
                                    Status
                                </label>
                                <Select
                                    value={createForm.data.status}
                                    onValueChange={(val) =>
                                        createForm.setData("status", val)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="suspended">Suspended</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-mono uppercase text-neutral-400">
                                Temporary Password
                            </label>
                            <Input
                                type="password"
                                value={createForm.data.password}
                                onChange={(e) =>
                                    createForm.setData("password", e.target.value)
                                }
                                placeholder="••••••••••••"
                                required
                            />
                            {createForm.errors.password && (
                                <p className="text-xs text-rose-400">
                                    {createForm.errors.password}
                                </p>
                            )}
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
                                {createForm.processing
                                    ? "Creating..."
                                    : "Create Operative"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Operative Modal */}
            <Dialog
                open={!!editingUser}
                onOpenChange={(open) => !open && setEditingUser(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Operative Clearance</DialogTitle>
                        <DialogDescription>
                            Modify user role or update account credentials.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleUpdate} className="space-y-4 pt-2">
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
                            {editForm.errors.name && (
                                <p className="text-xs text-rose-400">
                                    {editForm.errors.name}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-mono uppercase text-neutral-400">
                                Work Email
                            </label>
                            <Input
                                type="email"
                                value={editForm.data.email}
                                onChange={(e) =>
                                    editForm.setData("email", e.target.value)
                                }
                                required
                            />
                            {editForm.errors.email && (
                                <p className="text-xs text-rose-400">
                                    {editForm.errors.email}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase text-neutral-400">
                                    Assigned Role
                                </label>
                                <Select
                                    value={editForm.data.role_id ? String(editForm.data.role_id) : ""}
                                    onValueChange={(val) =>
                                        editForm.setData("role_id", Number(val))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roles.map((r) => (
                                            <SelectItem key={r.id} value={String(r.id)}>
                                                {formatRoleLabel(r.name)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase text-neutral-400">
                                    Status
                                </label>
                                <Select
                                    value={editForm.data.status}
                                    onValueChange={(val) =>
                                        editForm.setData("status", val)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="suspended">Suspended</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-mono uppercase text-neutral-400">
                                Reset Password (leave blank to retain)
                            </label>
                            <Input
                                type="password"
                                value={editForm.data.password}
                                onChange={(e) =>
                                    editForm.setData("password", e.target.value)
                                }
                                placeholder="Leave blank to keep current"
                                autoComplete="new-password"
                            />
                            {editForm.errors.password && (
                                <p className="text-xs text-rose-400">
                                    {editForm.errors.password}
                                </p>
                            )}
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditingUser(null)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={editForm.processing}
                            >
                                {editForm.processing
                                    ? "Saving..."
                                    : "Save Clearance"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Confirm Purge Alert */}
            <AlertDialog
                open={!!userToDelete}
                onOpenChange={(open) => !open && setUserToDelete(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Purge Operative Clearance?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you certain you wish to delete{" "}
                            <span className="text-white font-semibold">
                                {userToDelete?.name}
                            </span>
                            ? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                            Purge Account
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}
