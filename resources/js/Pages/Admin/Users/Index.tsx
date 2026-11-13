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
import {
    MoreHorizontal,
    UserCheck,
    UserX,
    Trash2,
    Edit,
    ShieldCheck,
    KeyRound,
    Plus,
    CheckCircle2,
} from "lucide-react";

interface UserRecord {
    id: number;
    name: string;
    email: string;
    role_id: number;
    role_name?: string;
    permissions?: string[];
    status: string;
    last_login_at?: string;
    created_at?: string;
}

interface RoleRecord {
    id: number;
    name: string;
    permissions?: string[];
}

interface UsersIndexProps {
    users: UserRecord[];
    roles: RoleRecord[];
    permissions: string[];
}

export default function UsersIndex({
    users = [],
    roles = [],
    permissions = [],
}: UsersIndexProps) {
    const [activeSection, setActiveSection] = useState<"staff" | "roles">("staff");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
    const [userToDelete, setUserToDelete] = useState<UserRecord | null>(null);

    const [isCreateRoleOpen, setIsCreateRoleOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<RoleRecord | null>(null);

    const createForm = useForm({
        name: "",
        email: "",
        role_id: roles[0]?.id || 1,
        status: "active",
        password: "",
    });

    const editForm = useForm({
        name: "",
        email: "",
        role_id: roles[0]?.id || 1,
        status: "active",
        password: "",
    });

    const createRoleForm = useForm({
        name: "",
        permissions: [] as string[],
    });

    const editRoleForm = useForm({
        permissions: [] as string[],
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
        router.post(route("admin.users.toggle-status", user.id), {}, { preserveScroll: true });
    };

    const handleDelete = () => {
        if (!userToDelete) return;
        router.delete(route("admin.users.destroy", userToDelete.id), {
            preserveScroll: true,
            onSuccess: () => setUserToDelete(null),
        });
    };

    const toggleRolePermission = (
        form: typeof createRoleForm | typeof editRoleForm,
        perm: string
    ) => {
        const current = form.data.permissions || [];
        if (current.includes(perm)) {
            form.setData(
                "permissions",
                current.filter((p) => p !== perm)
            );
        } else {
            form.setData("permissions", [...current, perm]);
        }
    };

    const handleCreateRole = (e: React.FormEvent) => {
        e.preventDefault();
        createRoleForm.post(route("admin.roles.store"), {
            onSuccess: () => {
                setIsCreateRoleOpen(false);
                createRoleForm.reset();
            },
        });
    };

    const openEditRoleModal = (role: RoleRecord) => {
        setEditingRole(role);
        editRoleForm.setData("permissions", role.permissions || []);
    };

    const handleUpdateRole = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingRole) return;
        editRoleForm.put(route("admin.roles.update", editingRole.id), {
            onSuccess: () => setEditingRole(null),
        });
    };

    const handleDeleteRole = (role: RoleRecord) => {
        router.delete(route("admin.roles.destroy", role.id), {
            preserveScroll: true,
        });
    };

    const formatRoleLabel = (name?: string) => {
        if (name === "super_admin") return "Super Admin";
        if (name === "admin") return "Studio Admin";
        if (!name) return "Admin";
        return name
            .split("_")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");
    };

    const formatPermissionLabel = (perm: string) =>
        perm
            .split("_")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");

    const columns: Column<UserRecord>[] = [
        {
            header: "Admin User",
            cell: (user) => (
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div className="font-bold text-ink">{user.name}</div>
                        <div className="text-xs text-slate-500">{user.email}</div>
                    </div>
                </div>
            ),
        },
        {
            header: "Spatie Role",
            cell: (user) => {
                const isSuper = user.role_name === "super_admin";
                return (
                    <Badge variant={isSuper ? "accent" : "success"}>
                        {formatRoleLabel(user.role_name)}
                    </Badge>
                );
            },
        },
        {
            header: "Permissions",
            cell: (user) => (
                <div className="flex flex-wrap gap-1 max-w-xs">
                    {user.role_name === "super_admin" ? (
                        <span className="text-xs font-semibold text-primary">
                            All Permissions (Super Admin)
                        </span>
                    ) : (user.permissions || []).length > 0 ? (
                        (user.permissions || []).slice(0, 4).map((p) => (
                            <span
                                key={p}
                                className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium"
                            >
                                {formatPermissionLabel(p)}
                            </span>
                        ))
                    ) : (
                        <span className="text-xs text-slate-400">No permissions</span>
                    )}
                    {(user.permissions || []).length > 4 &&
                        user.role_name !== "super_admin" && (
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-bold">
                                +{(user.permissions || []).length - 4} more
                            </span>
                        )}
                </div>
            ),
        },
        {
            header: "Status",
            cell: (user) => (
                <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        user.status === "active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}
                >
                    <span
                        className={`w-1.5 h-1.5 rounded-full ${
                            user.status === "active" ? "bg-emerald-500" : "bg-rose-500"
                        }`}
                    />
                    <span className="capitalize">{user.status}</span>
                </span>
            ),
        },
        {
            header: "Last Login",
            cell: (user) => (
                <span className="text-xs text-slate-500">
                    {user.last_login_at || "Never"}
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
                            className="h-8 w-8 text-slate-500 hover:text-ink"
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
                            <span>Edit Admin & Role</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => handleToggleStatus(user)}
                            className="gap-2"
                        >
                            {user.status === "active" ? (
                                <>
                                    <UserX className="w-3.5 h-3.5 text-amber-600" />
                                    <span>Suspend Access</span>
                                </>
                            ) : (
                                <>
                                    <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Activate Access</span>
                                </>
                            )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => setUserToDelete(user)}
                            className="gap-2 text-rose-600 focus:text-rose-600"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete Admin</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    return (
        <AdminLayout title="Admin Users & Roles">
            <AdminPageHeader
                title="Admin Staff & Spatie Roles"
                description="Manage internal studio administrators and configure granular Spatie roles & permissions."
                badge="Spatie Permission"
                actionLabel={
                    activeSection === "staff" ? "Add Admin User" : "Create New Role"
                }
                onActionClick={() =>
                    activeSection === "staff"
                        ? setIsCreateOpen(true)
                        : setIsCreateRoleOpen(true)
                }
            />

            {/* Switcher between Admin Staff and Spatie Roles & Permissions */}
            <div className="flex items-center gap-2 mb-6">
                <button
                    type="button"
                    onClick={() => setActiveSection("staff")}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        activeSection === "staff"
                            ? "bg-primary text-white shadow-xs"
                            : "bg-white text-slate-600 border border-slate-200 hover:text-ink"
                    }`}
                >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Admin Staff ({users.length})</span>
                </button>
                <button
                    type="button"
                    onClick={() => setActiveSection("roles")}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        activeSection === "roles"
                            ? "bg-primary text-white shadow-xs"
                            : "bg-white text-slate-600 border border-slate-200 hover:text-ink"
                    }`}
                >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Roles & Permissions ({roles.length})</span>
                </button>
            </div>

            {activeSection === "staff" ? (
                <AdminDataTable
                    columns={columns}
                    data={users}
                    searchKey="name"
                    searchPlaceholder="Search admin staff by name or email..."
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {roles.map((role) => {
                        const isCore =
                            role.name === "super_admin" || role.name === "admin";
                        return (
                            <div
                                key={role.id}
                                className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-2xs"
                            >
                                <div>
                                    <div className="flex items-center justify-between gap-3 mb-3">
                                        <div>
                                            <h3 className="text-base font-extrabold text-ink">
                                                {formatRoleLabel(role.name)}
                                            </h3>
                                            <span className="text-xs font-mono text-slate-400">
                                                guard: web · slug: {role.name}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => openEditRoleModal(role)}
                                            >
                                                Edit Permissions
                                            </Button>
                                            {!isCore && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDeleteRole(role)}
                                                    className="text-rose-600 hover:text-rose-700"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-1.5 mt-4">
                                        {permissions.map((perm) => {
                                            const enabled =
                                                role.name === "super_admin" ||
                                                (role.permissions || []).includes(perm);
                                            return (
                                                <span
                                                    key={perm}
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${
                                                        enabled
                                                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                            : "bg-slate-50 text-slate-400 border-slate-200"
                                                    }`}
                                                >
                                                    {enabled && (
                                                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                                    )}
                                                    {formatPermissionLabel(perm)}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Create Admin Modal */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Admin User</DialogTitle>
                        <DialogDescription>
                            Create an internal administrator account and assign a Spatie role.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleCreate} className="space-y-4 pt-2">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700">
                                Full Name *
                            </label>
                            <Input
                                value={createForm.data.name}
                                onChange={(e) =>
                                    createForm.setData("name", e.target.value)
                                }
                                placeholder="Elena Rostova"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700">
                                Work Email *
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
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700">
                                    Assigned Spatie Role
                                </label>
                                <Select
                                    value={
                                        createForm.data.role_id
                                            ? String(createForm.data.role_id)
                                            : ""
                                    }
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
                                <label className="text-xs font-semibold text-slate-700">
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
                            <label className="text-xs font-semibold text-slate-700">
                                Password *
                            </label>
                            <Input
                                type="password"
                                value={createForm.data.password}
                                onChange={(e) =>
                                    createForm.setData("password", e.target.value)
                                }
                                placeholder="At least 8 characters"
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
                            <Button type="submit" disabled={createForm.processing}>
                                {createForm.processing ? "Creating..." : "Create Admin"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Admin Modal */}
            <Dialog
                open={!!editingUser}
                onOpenChange={(open) => !open && setEditingUser(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Admin User</DialogTitle>
                        <DialogDescription>
                            Modify administrator Spatie role, status, or reset password.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleUpdate} className="space-y-4 pt-2">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700">
                                Full Name *
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
                            <label className="text-xs font-semibold text-slate-700">
                                Work Email *
                            </label>
                            <Input
                                type="email"
                                value={editForm.data.email}
                                onChange={(e) =>
                                    editForm.setData("email", e.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700">
                                    Assigned Spatie Role
                                </label>
                                <Select
                                    value={
                                        editForm.data.role_id
                                            ? String(editForm.data.role_id)
                                            : ""
                                    }
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
                                <label className="text-xs font-semibold text-slate-700">
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
                            <label className="text-xs font-semibold text-slate-700">
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
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditingUser(null)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={editForm.processing}>
                                {editForm.processing ? "Saving..." : "Save Changes"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Create Spatie Role Modal */}
            <Dialog open={isCreateRoleOpen} onOpenChange={setIsCreateRoleOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Spatie Role</DialogTitle>
                        <DialogDescription>
                            Define a custom role and select the permissions it grants.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleCreateRole} className="space-y-4 pt-2">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700">
                                Role Name *
                            </label>
                            <Input
                                value={createRoleForm.data.name}
                                onChange={(e) =>
                                    createRoleForm.setData("name", e.target.value)
                                }
                                placeholder="e.g. Studio Manager"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-700 block">
                                Assign Permissions
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {permissions.map((perm) => (
                                    <label
                                        key={perm}
                                        className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-medium text-ink cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={createRoleForm.data.permissions.includes(
                                                perm
                                            )}
                                            onChange={() =>
                                                toggleRolePermission(createRoleForm, perm)
                                            }
                                            className="rounded border-slate-300 text-primary focus:ring-primary"
                                        />
                                        <span>{formatPermissionLabel(perm)}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCreateRoleOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={createRoleForm.processing}>
                                <Plus className="w-4 h-4 mr-1" />
                                Create Role
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Spatie Role Permissions Modal */}
            <Dialog
                open={!!editingRole}
                onOpenChange={(open) => !open && setEditingRole(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Edit Permissions: {formatRoleLabel(editingRole?.name)}
                        </DialogTitle>
                        <DialogDescription>
                            Toggle the Spatie permissions assigned to this role.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleUpdateRole} className="space-y-4 pt-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {permissions.map((perm) => (
                                <label
                                    key={perm}
                                    className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-medium text-ink cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        disabled={editingRole?.name === "super_admin"}
                                        checked={
                                            editingRole?.name === "super_admin" ||
                                            editRoleForm.data.permissions.includes(perm)
                                        }
                                        onChange={() =>
                                            toggleRolePermission(editRoleForm, perm)
                                        }
                                        className="rounded border-slate-300 text-primary focus:ring-primary"
                                    />
                                    <span>{formatPermissionLabel(perm)}</span>
                                </label>
                            ))}
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditingRole(null)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={editRoleForm.processing}>
                                Save Permissions
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Confirm Delete Alert */}
            <AlertDialog
                open={!!userToDelete}
                onOpenChange={(open) => !open && setUserToDelete(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Admin User?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete{" "}
                            <span className="text-ink font-semibold">
                                {userToDelete?.name}
                            </span>
                            ? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                            Delete Admin
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}
