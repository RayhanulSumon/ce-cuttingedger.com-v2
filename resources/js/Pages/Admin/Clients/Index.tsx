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
import { Client } from "@/types/models";

interface ClientsIndexProps {
    clients: Client[];
}

export default function ClientsIndex({ clients = [] }: ClientsIndexProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

    const createForm = useForm({
        name: "",
        logo_dark: "/images/clients/client-1.svg",
        logo_light: "",
        url: "",
        marquee_row: 1,
        sort_order: 0,
    });

    const editForm = useForm({
        name: "",
        logo_dark: "",
        logo_light: "",
        url: "",
        marquee_row: 1,
        sort_order: 0,
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(route("admin.clients.store"), {
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
            },
        });
    };

    const openEdit = (c: Client) => {
        setEditingClient(c);
        editForm.setData({
            name: c.name,
            logo_dark: c.logo_dark || "",
            logo_light: c.logo_light || "",
            url: c.url || "",
            marquee_row: c.marquee_row,
            sort_order: c.sort_order,
        });
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingClient) return;
        editForm.put(route("admin.clients.update", editingClient.id), {
            onSuccess: () => {
                setEditingClient(null);
                editForm.reset();
            },
        });
    };

    const handleDelete = () => {
        if (!clientToDelete) return;
        router.delete(route("admin.clients.destroy", clientToDelete.id), {
            onSuccess: () => setClientToDelete(null),
        });
    };

    const columns: Column<Client>[] = [
        {
            header: "PARTNER BRAND",
            cell: (c) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-mono font-bold text-xs text-white">
                        {c.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <div className="font-semibold text-white">{c.name}</div>
                        <div className="text-xs text-neutral-400 font-mono">
                            {c.url || "No link"}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            header: "MARQUEE TRACK",
            cell: (c) => (
                <Badge variant="outline">
                    ROW {c.marquee_row}
                </Badge>
            ),
        },
        {
            header: "SORT ORDER",
            cell: (c) => (
                <span className="font-mono text-xs text-neutral-400">
                    #{c.sort_order}
                </span>
            ),
        },
        {
            header: "",
            className: "text-right",
            cell: (c) => (
                <div className="flex items-center justify-end gap-1">
                    {c.url && (
                        <a
                            href={c.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-neutral-400 hover:text-white transition-colors"
                        >
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    )}
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
                                <span>Edit Brand</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setClientToDelete(c)}
                                className="gap-2 text-rose-400 focus:text-rose-400"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Remove Brand</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
        },
    ];

    return (
        <AdminLayout title="CLIENTS & LOGO MARQUEE">
            <AdminPageHeader
                title="Clients & Marquee Logos"
                description="Manage enterprise brand partnerships and infinite ribbon marquee rows."
                actionLabel="Add Partner"
                onActionClick={() => setIsCreateOpen(true)}
            />

            <AdminDataTable
                columns={columns}
                data={clients}
                searchKey="name"
                searchPlaceholder="Search client partners..."
            />

            {/* Create Client Modal */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Register Brand Partner</DialogTitle>
                        <DialogDescription>
                            Logo assets, website link, and marquee row slot.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleCreate} className="space-y-4 pt-2">
                        <div className="space-y-1.5">
                            <label className="text-xs font-mono uppercase text-neutral-400">
                                Client / Company Name
                            </label>
                            <Input
                                value={createForm.data.name}
                                onChange={(e) =>
                                    createForm.setData("name", e.target.value)
                                }
                                placeholder="e.g. Stripe, OpenAI, Nike"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-mono uppercase text-neutral-400">
                                Logo Dark Vector Asset Path / SVG
                            </label>
                            <Input
                                value={createForm.data.logo_dark}
                                onChange={(e) =>
                                    createForm.setData("logo_dark", e.target.value)
                                }
                                placeholder="/images/clients/logo-1.svg"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-mono uppercase text-neutral-400">
                                Brand Official Website URL
                            </label>
                            <Input
                                type="url"
                                value={createForm.data.url}
                                onChange={(e) =>
                                    createForm.setData("url", e.target.value)
                                }
                                placeholder="https://partner.com"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase text-neutral-400">
                                    Marquee Ribbon Row
                                </label>
                                <select
                                    value={createForm.data.marquee_row}
                                    onChange={(e) =>
                                        createForm.setData(
                                            "marquee_row",
                                            Number(e.target.value)
                                        )
                                    }
                                    className="w-full h-10 rounded-lg bg-[#0d0f15] border border-white/10 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent"
                                >
                                    <option value={1}>Row 1 (Top Ribbon)</option>
                                    <option value={2}>Row 2 (Bottom Ribbon)</option>
                                </select>
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
                                {createForm.processing ? "Adding..." : "Add Partner"}
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
                        <DialogTitle>Edit Brand Partner</DialogTitle>
                        <DialogDescription>
                            Revise brand metadata, row track, and logo reference.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleUpdate} className="space-y-4 pt-2">
                        <div className="space-y-1.5">
                            <label className="text-xs font-mono uppercase text-neutral-400">
                                Client / Company Name
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
                                Logo Dark Vector Asset Path / SVG
                            </label>
                            <Input
                                value={editForm.data.logo_dark}
                                onChange={(e) =>
                                    editForm.setData("logo_dark", e.target.value)
                                }
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-mono uppercase text-neutral-400">
                                Brand Official Website URL
                            </label>
                            <Input
                                type="url"
                                value={editForm.data.url}
                                onChange={(e) =>
                                    editForm.setData("url", e.target.value)
                                }
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase text-neutral-400">
                                    Marquee Ribbon Row
                                </label>
                                <select
                                    value={editForm.data.marquee_row}
                                    onChange={(e) =>
                                        editForm.setData(
                                            "marquee_row",
                                            Number(e.target.value)
                                        )
                                    }
                                    className="w-full h-10 rounded-lg bg-[#0d0f15] border border-white/10 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent"
                                >
                                    <option value={1}>Row 1 (Top Ribbon)</option>
                                    <option value={2}>Row 2 (Bottom Ribbon)</option>
                                </select>
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

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditingClient(null)}
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
                open={!!clientToDelete}
                onOpenChange={(open) => !open && setClientToDelete(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remove Brand Partner?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you certain you wish to purge{" "}
                            <span className="text-white font-semibold">
                                {clientToDelete?.name}
                            </span>{" "}
                            from the client marquee?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                            Remove Partner
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}
