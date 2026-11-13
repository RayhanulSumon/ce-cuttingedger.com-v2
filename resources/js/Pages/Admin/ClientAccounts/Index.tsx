import React, { useState } from "react";
import { Link, useForm, router } from "@inertiajs/react";
import { AdminLayout } from "@/Layouts/Admin/AdminLayout";
import { AdminPageHeader } from "@/Components/Admin/UI/AdminPageHeader";
import { AdminDataTable, Column } from "@/Components/Admin/UI/AdminDataTable";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
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
    CheckCircle2,
    Clock,
    Building2,
    Phone,
    ShoppingBag,
} from "lucide-react";

interface ClientAccountRecord {
    id: number;
    name: string;
    email: string;
    company?: string | null;
    phone?: string | null;
    avatar?: string | null;
    google_linked?: boolean;
    status: string;
    email_verified?: boolean;
    email_verified_at?: string | null;
    orders_count?: number;
    last_login_at?: string;
    created_at?: string;
}

interface ClientAccountsIndexProps {
    clients: ClientAccountRecord[];
    clientRoleId: number;
}

export default function ClientAccountsIndex({
    clients = [],
    clientRoleId,
}: ClientAccountsIndexProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<ClientAccountRecord | null>(null);
    const [clientToDelete, setClientToDelete] = useState<ClientAccountRecord | null>(null);

    const createForm = useForm({
        name: "",
        email: "",
        company: "",
        phone: "",
        role_id: clientRoleId,
        status: "active",
        email_verified: true,
        password: "",
    });

    const editForm = useForm({
        name: "",
        email: "",
        company: "",
        phone: "",
        role_id: clientRoleId,
        status: "active",
        email_verified: true,
        password: "",
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(route("admin.client-accounts.store"), {
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
            },
        });
    };

    const openEditModal = (client: ClientAccountRecord) => {
        setEditingClient(client);
        editForm.setData({
            name: client.name,
            email: client.email,
            company: client.company || "",
            phone: client.phone || "",
            role_id: clientRoleId,
            status: client.status,
            email_verified: !!client.email_verified,
            password: "",
        });
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingClient) return;
        editForm.put(route("admin.client-accounts.update", editingClient.id), {
            onSuccess: () => {
                setEditingClient(null);
                editForm.reset();
            },
        });
    };

    const handleToggleStatus = (client: ClientAccountRecord) => {
        router.post(
            route("admin.client-accounts.toggle-status", client.id),
            {},
            { preserveScroll: true }
        );
    };

    const handleVerifyEmail = (client: ClientAccountRecord) => {
        router.post(
            route("admin.client-accounts.verify-email", client.id),
            {},
            { preserveScroll: true }
        );
    };

    const handleDelete = () => {
        if (!clientToDelete) return;
        router.delete(route("admin.client-accounts.destroy", clientToDelete.id), {
            preserveScroll: true,
            onSuccess: () => setClientToDelete(null),
        });
    };

    const columns: Column<ClientAccountRecord>[] = [
        {
            header: "Client",
            cell: (client) => (
                <div className="flex items-center gap-3">
                    {client.avatar ? (
                        <img
                            src={client.avatar}
                            alt={client.name}
                            className="w-9 h-9 rounded-full object-cover border border-slate-200"
                        />
                    ) : (
                        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                            {client.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div>
                        <div className="font-bold text-ink flex items-center gap-1.5">
                            <span>{client.name}</span>
                            {client.google_linked && (
                                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-200">
                                    Google
                                </span>
                            )}
                        </div>
                        <div className="text-xs text-slate-500">{client.email}</div>
                    </div>
                </div>
            ),
        },
        {
            header: "Brand / Phone",
            cell: (client) => (
                <div className="space-y-0.5 text-xs">
                    {client.company ? (
                        <div className="font-semibold text-ink flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            <span>{client.company}</span>
                        </div>
                    ) : (
                        <span className="text-slate-400">—</span>
                    )}
                    {client.phone && (
                        <div className="text-slate-500 flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{client.phone}</span>
                        </div>
                    )}
                </div>
            ),
        },
        {
            header: "Email Verification",
            cell: (client) =>
                client.email_verified ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Verified
                    </span>
                ) : (
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            Unverified
                        </span>
                        <button
                            type="button"
                            onClick={() => handleVerifyEmail(client)}
                            className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                        >
                            Verify Now
                        </button>
                    </div>
                ),
        },
        {
            header: "Orders",
            cell: (client) => (
                <Link
                    href="/admin/orders"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-xs font-bold text-ink transition-colors"
                >
                    <ShoppingBag className="w-3.5 h-3.5 text-primary" />
                    <span>{client.orders_count ?? 0} Orders</span>
                </Link>
            ),
        },
        {
            header: "Status",
            cell: (client) => (
                <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        client.status === "active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}
                >
                    <span
                        className={`w-1.5 h-1.5 rounded-full ${
                            client.status === "active" ? "bg-emerald-500" : "bg-rose-500"
                        }`}
                    />
                    <span className="capitalize">{client.status}</span>
                </span>
            ),
        },
        {
            header: "Joined",
            cell: (client) => (
                <span className="text-xs text-slate-500">{client.created_at || "—"}</span>
            ),
        },
        {
            header: "",
            className: "text-right",
            cell: (client) => (
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
                            onClick={() => openEditModal(client)}
                            className="gap-2"
                        >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit Client</span>
                        </DropdownMenuItem>
                        {!client.email_verified && (
                            <DropdownMenuItem
                                onClick={() => handleVerifyEmail(client)}
                                className="gap-2 text-emerald-600"
                            >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Mark Email Verified</span>
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                            onClick={() => handleToggleStatus(client)}
                            className="gap-2"
                        >
                            {client.status === "active" ? (
                                <>
                                    <UserX className="w-3.5 h-3.5 text-amber-600" />
                                    <span>Suspend Client</span>
                                </>
                            ) : (
                                <>
                                    <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Activate Client</span>
                                </>
                            )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => setClientToDelete(client)}
                            className="gap-2 text-rose-600 focus:text-rose-600"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete Client</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    return (
        <AdminLayout title="Client Accounts">
            <AdminPageHeader
                title="Registered Client Accounts"
                description="Manage registered clients, verify email addresses, and inspect client portal accounts."
                badge={`${clients.length} Clients`}
                actionLabel="Add Client Account"
                onActionClick={() => setIsCreateOpen(true)}
            />

            <AdminDataTable
                columns={columns}
                data={clients}
                searchKey="name"
                searchPlaceholder="Search clients by name, email, or brand..."
            />

            {/* Create Client Modal */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Client Account</DialogTitle>
                        <DialogDescription>
                            Create a client account with immediate access to the Client Portal and order studios.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleCreate} className="space-y-4 pt-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700">
                                    Full Name *
                                </label>
                                <Input
                                    value={createForm.data.name}
                                    onChange={(e) =>
                                        createForm.setData("name", e.target.value)
                                    }
                                    placeholder="Clara Vance"
                                    required
                                />
                                {createForm.errors.name && (
                                    <p className="text-xs text-rose-600">
                                        {createForm.errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700">
                                    Email Address *
                                </label>
                                <Input
                                    type="email"
                                    value={createForm.data.email}
                                    onChange={(e) =>
                                        createForm.setData("email", e.target.value)
                                    }
                                    placeholder="clara@brand.com"
                                    required
                                />
                                {createForm.errors.email && (
                                    <p className="text-xs text-rose-600">
                                        {createForm.errors.email}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700">
                                    Brand / Company
                                </label>
                                <Input
                                    value={createForm.data.company}
                                    onChange={(e) =>
                                        createForm.setData("company", e.target.value)
                                    }
                                    placeholder="Vance Atelier"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700">
                                    Phone / WhatsApp
                                </label>
                                <Input
                                    value={createForm.data.phone}
                                    onChange={(e) =>
                                        createForm.setData("phone", e.target.value)
                                    }
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700">
                                    Account Status
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
                                {createForm.errors.password && (
                                    <p className="text-xs text-rose-600">
                                        {createForm.errors.password}
                                    </p>
                                )}
                            </div>
                        </div>

                        <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={createForm.data.email_verified}
                                onChange={(e) =>
                                    createForm.setData("email_verified", e.target.checked)
                                }
                                className="rounded border-slate-300 text-primary focus:ring-primary"
                            />
                            <span>Mark email address as verified immediately</span>
                        </label>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCreateOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={createForm.processing}>
                                {createForm.processing ? "Creating..." : "Create Client"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Client Modal */}
            <Dialog
                open={!!editingClient}
                onOpenChange={(open) => !open && setEditingClient(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Client Account</DialogTitle>
                        <DialogDescription>
                            Update client contact details, verification status, or reset password.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleUpdate} className="space-y-4 pt-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                    Email Address *
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
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700">
                                    Brand / Company
                                </label>
                                <Input
                                    value={editForm.data.company}
                                    onChange={(e) =>
                                        editForm.setData("company", e.target.value)
                                    }
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700">
                                    Phone / WhatsApp
                                </label>
                                <Input
                                    value={editForm.data.phone}
                                    onChange={(e) =>
                                        editForm.setData("phone", e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700">
                                    Account Status
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

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700">
                                    Reset Password (optional)
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
                        </div>

                        <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={editForm.data.email_verified}
                                onChange={(e) =>
                                    editForm.setData("email_verified", e.target.checked)
                                }
                                className="rounded border-slate-300 text-primary focus:ring-primary"
                            />
                            <span>Email address verified</span>
                        </label>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditingClient(null)}
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

            {/* Confirm Delete Alert */}
            <AlertDialog
                open={!!clientToDelete}
                onOpenChange={(open) => !open && setClientToDelete(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Client Account?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete{" "}
                            <span className="text-ink font-semibold">
                                {clientToDelete?.name}
                            </span>
                            ? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                            Delete Client
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}

