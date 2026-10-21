import React, { useState } from "react";
import { router } from "@inertiajs/react";
import { AdminLayout } from "@/Layouts/Admin/AdminLayout";
import { AdminPageHeader } from "@/Components/Admin/UI/AdminPageHeader";
import { AdminDataTable, Column } from "@/Components/Admin/UI/AdminDataTable";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
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
import { Trash2, Download } from "lucide-react";
import { NewsletterSubscriber } from "@/types/models";

interface SubscribersIndexProps {
    subscribers: NewsletterSubscriber[];
}

export default function SubscribersIndex({ subscribers = [] }: SubscribersIndexProps) {
    const [subToDelete, setSubToDelete] = useState<NewsletterSubscriber | null>(null);

    const handleDelete = () => {
        if (!subToDelete) return;
        router.delete(route("admin.subscribers.destroy", subToDelete.id), {
            onSuccess: () => setSubToDelete(null),
        });
    };

    const exportCsv = () => {
        const rows = [["Email", "Status", "Date"]];
        subscribers.forEach((s) => {
            rows.push([s.email, s.status, s.created_at]);
        });
        const csvContent =
            "data:text/csv;charset=utf-8," +
            rows.map((e) => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "subscribers_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const columns: Column<NewsletterSubscriber>[] = [
        {
            header: "SUBSCRIBER RECIPIENT",
            accessorKey: "email",
            cell: (s) => (
                <span className="font-mono text-sm text-white">{s.email}</span>
            ),
        },
        {
            header: "STATUS",
            cell: (s) => (
                <Badge
                    variant={s.status === "active" ? "success" : "secondary"}
                >
                    {s.status.toUpperCase()}
                </Badge>
            ),
        },
        {
            header: "JOINED DATE",
            cell: (s) => (
                <span className="text-xs font-mono text-neutral-400">
                    {new Date(s.created_at).toLocaleDateString()}
                </span>
            ),
        },
        {
            header: "",
            className: "text-right",
            cell: (s) => (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSubToDelete(s)}
                    className="h-8 w-8 text-neutral-400 hover:text-rose-400"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            ),
        },
    ];

    return (
        <AdminLayout title="DISPATCH SUBSCRIBERS">
            <AdminPageHeader
                title="Newsletter Subscribers"
                description="Audience distribution list for studio briefs and design insights."
                badge={`${subscribers.length} ACTIVE`}
            >
                <Button
                    variant="outline"
                    onClick={exportCsv}
                    className="gap-2 text-xs"
                >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                </Button>
            </AdminPageHeader>

            <AdminDataTable
                columns={columns}
                data={subscribers}
                searchKey="email"
                searchPlaceholder="Search subscribers by email..."
            />

            <AlertDialog
                open={!!subToDelete}
                onOpenChange={(open) => !open && setSubToDelete(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Purge Subscriber?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Remove{" "}
                            <span className="text-white font-semibold">
                                {subToDelete?.email}
                            </span>{" "}
                            from the distribution registry?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                            Remove
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}
