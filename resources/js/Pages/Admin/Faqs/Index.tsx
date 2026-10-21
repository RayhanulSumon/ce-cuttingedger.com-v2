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
import { Faq } from "@/types/models";

interface FaqsIndexProps {
    faqs: Faq[];
}

export default function FaqsIndex({ faqs = [] }: FaqsIndexProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
    const [faqToDelete, setFaqToDelete] = useState<Faq | null>(null);

    const createForm = useForm({
        question: "",
        answer: "",
        category: "Engagements",
        sort_order: 0,
    });

    const editForm = useForm({
        question: "",
        answer: "",
        category: "",
        sort_order: 0,
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(route("admin.faqs.store"), {
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
            },
        });
    };

    const openEdit = (f: Faq) => {
        setEditingFaq(f);
        editForm.setData({
            question: f.question,
            answer: f.answer,
            category: f.category,
            sort_order: f.sort_order,
        });
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingFaq) return;
        editForm.put(route("admin.faqs.update", editingFaq.id), {
            onSuccess: () => {
                setEditingFaq(null);
                editForm.reset();
            },
        });
    };

    const handleDelete = () => {
        if (!faqToDelete) return;
        router.delete(route("admin.faqs.destroy", faqToDelete.id), {
            onSuccess: () => setFaqToDelete(null),
        });
    };

    const columns: Column<Faq>[] = [
        {
            header: "QUESTION",
            cell: (f) => (
                <div>
                    <div className="font-semibold text-white">{f.question}</div>
                    <div className="text-xs text-neutral-400 max-w-lg truncate mt-0.5">
                        {f.answer}
                    </div>
                </div>
            ),
        },
        {
            header: "CATEGORY",
            cell: (f) => (
                <Badge variant="outline">
                    {f.category}
                </Badge>
            ),
        },
        {
            header: "ORDER",
            cell: (f) => (
                <span className="font-mono text-xs text-neutral-400">
                    #{f.sort_order}
                </span>
            ),
        },
        {
            header: "",
            className: "text-right",
            cell: (f) => (
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
                        <DropdownMenuItem onClick={() => openEdit(f)} className="gap-2">
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit FAQ</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => setFaqToDelete(f)}
                            className="gap-2 text-rose-400 focus:text-rose-400"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Purge FAQ</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    return (
        <AdminLayout title="FREQUENT INQUIRIES">
            <AdminPageHeader
                title="FAQs Management"
                description="Frequently asked queries regarding sprint deliverables, contracts, and IP ownership."
                actionLabel="Add FAQ"
                onActionClick={() => setIsCreateOpen(true)}
            />

            <AdminDataTable
                columns={columns}
                data={faqs}
                searchKey="question"
                searchPlaceholder="Search questions..."
            />

            {/* Create FAQ Modal */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Frequently Asked Question</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleCreate} className="space-y-4 pt-2">
                        <div className="space-y-1.5">
                            <label className="text-xs font-mono uppercase text-neutral-400">
                                Question
                            </label>
                            <Input
                                value={createForm.data.question}
                                onChange={(e) =>
                                    createForm.setData("question", e.target.value)
                                }
                                placeholder="e.g. How does sprint onboarding function?"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase text-neutral-400">
                                    Topic Category
                                </label>
                                <Input
                                    value={createForm.data.category}
                                    onChange={(e) =>
                                        createForm.setData("category", e.target.value)
                                    }
                                    placeholder="Engagements / Tech / IP"
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase text-neutral-400">
                                    Display Order
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
                                Comprehensive Answer
                            </label>
                            <Textarea
                                value={createForm.data.answer}
                                onChange={(e) =>
                                    createForm.setData("answer", e.target.value)
                                }
                                rows={4}
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
                                {createForm.processing ? "Adding..." : "Add FAQ"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit FAQ Modal */}
            <Dialog
                open={!!editingFaq}
                onOpenChange={(open) => !open && setEditingFaq(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit FAQ</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleUpdate} className="space-y-4 pt-2">
                        <div className="space-y-1.5">
                            <label className="text-xs font-mono uppercase text-neutral-400">
                                Question
                            </label>
                            <Input
                                value={editForm.data.question}
                                onChange={(e) =>
                                    editForm.setData("question", e.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase text-neutral-400">
                                    Topic Category
                                </label>
                                <Input
                                    value={editForm.data.category}
                                    onChange={(e) =>
                                        editForm.setData("category", e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-mono uppercase text-neutral-400">
                                    Display Order
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
                                Comprehensive Answer
                            </label>
                            <Textarea
                                value={editForm.data.answer}
                                onChange={(e) =>
                                    editForm.setData("answer", e.target.value)
                                }
                                rows={4}
                                required
                            />
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditingFaq(null)}
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
                open={!!faqToDelete}
                onOpenChange={(open) => !open && setFaqToDelete(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Purge FAQ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you certain you wish to purge this inquiry record?
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
