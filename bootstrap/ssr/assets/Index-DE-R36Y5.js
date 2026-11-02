import { t as cn } from "./utils-BVTyW6jK.js";
import { a as DropdownMenuItem, i as DropdownMenuContent, n as AdminLayout, o as DropdownMenuTrigger, r as DropdownMenu, t as AdminPageHeader } from "./AdminPageHeader-BF3p_UDa.js";
import { n as Button } from "./input-lL3MBuxn.js";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, l as AdminDataTable, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-DsbEgc5R.js";
import { t as Badge } from "./badge-BgjwAGBP.js";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-C4D4ccTI.js";
import { useState } from "react";
import { router } from "@inertiajs/react";
import { Calendar, CalendarCheck2, CalendarClock, CheckCircle2, Clock, FileText, Mail, MoreHorizontal, Phone, Trash2, User, XCircle } from "lucide-react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Admin/Consultations/Index.tsx
function ConsultationsIndex({ consultations = [], stats, currentStatus }) {
	const [selectedConsultation, setSelectedConsultation] = useState(null);
	const [consultationToDelete, setConsultationToDelete] = useState(null);
	const [consultationToReschedule, setConsultationToReschedule] = useState(null);
	const [rescheduleDatetime, setRescheduleDatetime] = useState("");
	const [rescheduleNotes, setRescheduleNotes] = useState("");
	const [isSubmittingReschedule, setIsSubmittingReschedule] = useState(false);
	const updateStatus = (item, newStatus) => {
		router.put(route("admin.consultations.update", item.id), { status: newStatus }, {
			preserveScroll: true,
			onSuccess: () => {
				if (selectedConsultation?.id === item.id) setSelectedConsultation(null);
			}
		});
	};
	const openRescheduleModal = (item) => {
		setConsultationToReschedule(item);
		const dateObj = new Date(item.scheduled_at);
		const pad = (n) => n.toString().padStart(2, "0");
		const formatted = `${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(dateObj.getDate())}T${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}`;
		setRescheduleDatetime(formatted);
		setRescheduleNotes("");
	};
	const handleRescheduleSubmit = (e) => {
		e.preventDefault();
		if (!consultationToReschedule || !rescheduleDatetime) return;
		setIsSubmittingReschedule(true);
		router.put(route("admin.consultations.update", consultationToReschedule.id), {
			scheduled_at: rescheduleDatetime,
			notes: rescheduleNotes,
			status: "confirmed"
		}, {
			preserveScroll: true,
			onSuccess: () => {
				setConsultationToReschedule(null);
				setIsSubmittingReschedule(false);
				if (selectedConsultation?.id === consultationToReschedule.id) setSelectedConsultation(null);
			},
			onError: () => {
				setIsSubmittingReschedule(false);
			}
		});
	};
	const handleDelete = () => {
		if (!consultationToDelete) return;
		router.delete(route("admin.consultations.destroy", consultationToDelete.id), {
			preserveScroll: true,
			onSuccess: () => setConsultationToDelete(null)
		});
	};
	const getStatusBadge = (status, isUpcoming) => {
		switch (status) {
			case "pending": return /* @__PURE__ */ jsx(Badge, {
				className: "font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30",
				children: "PENDING REVIEW"
			});
			case "confirmed": return isUpcoming ? /* @__PURE__ */ jsx(Badge, {
				variant: "accent",
				className: "font-mono",
				children: "UPCOMING"
			}) : /* @__PURE__ */ jsx(Badge, {
				variant: "secondary",
				className: "font-mono",
				children: "CONFIRMED"
			});
			case "completed": return /* @__PURE__ */ jsx(Badge, {
				variant: "success",
				className: "font-mono",
				children: "COMPLETED"
			});
			case "cancelled": return /* @__PURE__ */ jsx(Badge, {
				variant: "destructive",
				className: "font-mono",
				children: "CANCELLED"
			});
			default: return /* @__PURE__ */ jsx(Badge, {
				variant: "outline",
				children: status
			});
		}
	};
	return /* @__PURE__ */ jsx(AdminLayout, { children: /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ jsx(AdminPageHeader, {
				title: "Client Consultations & Bookings",
				description: "Review and manage 15-minute technical intake calls scheduled via the smart chat assistant."
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "bg-[#12141a] border border-white/5 rounded-2xl p-4",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1",
							children: "Total Bookings"
						}), /* @__PURE__ */ jsx("div", {
							className: "text-2xl font-bold font-mono text-white",
							children: stats.total
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: cn("rounded-2xl p-4 border transition-colors", stats.pending > 0 ? "bg-amber-500/10 border-amber-500/40 text-amber-300 shadow-sm" : "bg-[#12141a] border-white/5 text-neutral-400"),
						children: [/* @__PURE__ */ jsxs("span", {
							className: "text-[10px] font-mono uppercase tracking-wider block mb-1 font-semibold flex items-center justify-between",
							children: [/* @__PURE__ */ jsx("span", { children: "Pending Review" }), stats.pending > 0 && /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-amber-400 animate-pulse" })]
						}), /* @__PURE__ */ jsx("div", {
							className: "text-2xl font-bold font-mono text-amber-300",
							children: stats.pending
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "bg-[#12141a] border border-accent/30 rounded-2xl p-4",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-[10px] font-mono uppercase tracking-wider text-accent block mb-1",
							children: "Upcoming Calls"
						}), /* @__PURE__ */ jsx("div", {
							className: "text-2xl font-bold font-mono text-accent",
							children: stats.upcoming
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "bg-[#12141a] border border-emerald-500/20 rounded-2xl p-4",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-[10px] font-mono uppercase tracking-wider text-emerald-400 block mb-1",
							children: "Completed"
						}), /* @__PURE__ */ jsx("div", {
							className: "text-2xl font-bold font-mono text-emerald-400",
							children: stats.completed
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "bg-[#12141a] border border-white/5 rounded-2xl p-4",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1",
							children: "Cancelled"
						}), /* @__PURE__ */ jsx("div", {
							className: "text-2xl font-bold font-mono text-neutral-400",
							children: stats.cancelled
						})]
					})
				]
			}),
			/* @__PURE__ */ jsx(AdminDataTable, {
				data: consultations,
				columns: [
					{
						header: "Invitee / Client",
						accessorKey: "name",
						cell: (row) => /* @__PURE__ */ jsxs("div", {
							className: "space-y-0.5",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "font-semibold text-white flex items-center gap-1.5",
								children: [/* @__PURE__ */ jsx(User, { className: "w-3.5 h-3.5 text-accent" }), /* @__PURE__ */ jsx("span", { children: row.name })]
							}), /* @__PURE__ */ jsxs("div", {
								className: "text-xs text-neutral-400 flex items-center gap-1.5 font-mono",
								children: [/* @__PURE__ */ jsx(Mail, { className: "w-3 h-3 text-neutral-500" }), /* @__PURE__ */ jsx("span", { children: row.email })]
							})]
						})
					},
					{
						header: "Phone / WhatsApp",
						accessorKey: "phone",
						cell: (row) => /* @__PURE__ */ jsx("div", {
							className: "text-xs font-mono text-neutral-300 flex items-center gap-1.5",
							children: row.phone ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Phone, { className: "w-3.5 h-3.5 text-[#00f5ff]" }), /* @__PURE__ */ jsx("span", { children: row.phone })] }) : /* @__PURE__ */ jsx("span", {
								className: "text-neutral-600",
								children: "—"
							})
						})
					},
					{
						header: "Topic & Client Concern",
						accessorKey: "service_name",
						cell: (row) => /* @__PURE__ */ jsxs("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ jsx("div", {
								className: "text-xs text-neutral-200 font-medium",
								children: row.service_name
							}), row.notes && /* @__PURE__ */ jsxs("div", {
								className: "text-[11px] text-neutral-300 font-mono bg-white/[0.04] px-2 py-1 rounded border border-white/5 line-clamp-2 max-w-xs",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "text-[#00f5ff] font-bold text-[9px] uppercase tracking-wider block",
										children: "Client Concern:"
									}),
									"\"",
									row.notes,
									"\""
								]
							})]
						})
					},
					{
						header: "Scheduled Time",
						accessorKey: "scheduled_at",
						cell: (row) => /* @__PURE__ */ jsxs("div", {
							className: "space-y-0.5 font-mono text-xs",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "text-white font-semibold flex items-center gap-1.5",
								children: [/* @__PURE__ */ jsx(Calendar, { className: "w-3.5 h-3.5 text-accent" }), /* @__PURE__ */ jsx("span", { children: row.scheduled_at_formatted })]
							}), /* @__PURE__ */ jsxs("div", {
								className: "text-[10px] text-neutral-500",
								children: ["Timezone: ", row.timezone]
							})]
						})
					},
					{
						header: "Status",
						accessorKey: "status",
						cell: (row) => getStatusBadge(row.status, row.is_upcoming)
					},
					{
						header: "Actions",
						id: "actions",
						cell: (row) => /* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-end gap-1",
							children: [/* @__PURE__ */ jsx(Button, {
								variant: "ghost",
								size: "sm",
								onClick: () => setSelectedConsultation(row),
								className: "h-8 px-2 text-neutral-400 hover:text-white",
								title: "View details & notes",
								children: /* @__PURE__ */ jsx(FileText, { className: "w-4 h-4" })
							}), /* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
								asChild: true,
								children: /* @__PURE__ */ jsx(Button, {
									variant: "ghost",
									size: "sm",
									className: "h-8 w-8 p-0 text-neutral-400 hover:text-white",
									children: /* @__PURE__ */ jsx(MoreHorizontal, { className: "w-4 h-4" })
								})
							}), /* @__PURE__ */ jsxs(DropdownMenuContent, {
								align: "end",
								className: "w-52 bg-[#12141c] border border-white/10 text-white",
								children: [
									row.status === "pending" && /* @__PURE__ */ jsxs(DropdownMenuItem, {
										onClick: () => updateStatus(row, "confirmed"),
										className: "cursor-pointer gap-2 text-accent focus:text-accent font-semibold",
										children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4 text-accent" }), /* @__PURE__ */ jsx("span", { children: "Confirm & Acknowledge" })]
									}),
									/* @__PURE__ */ jsxs(DropdownMenuItem, {
										onClick: () => openRescheduleModal(row),
										className: "cursor-pointer gap-2 text-[#00f5ff] focus:text-[#00f5ff]",
										children: [/* @__PURE__ */ jsx(CalendarClock, { className: "w-4 h-4 text-[#00f5ff]" }), /* @__PURE__ */ jsx("span", { children: "Reschedule Call" })]
									}),
									row.status !== "completed" && /* @__PURE__ */ jsxs(DropdownMenuItem, {
										onClick: () => updateStatus(row, "completed"),
										className: "cursor-pointer gap-2 text-emerald-400 focus:text-emerald-400",
										children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4 text-emerald-400" }), /* @__PURE__ */ jsx("span", { children: "Mark as Completed" })]
									}),
									row.status !== "cancelled" && /* @__PURE__ */ jsxs(DropdownMenuItem, {
										onClick: () => updateStatus(row, "cancelled"),
										className: "cursor-pointer gap-2 text-amber-400 focus:text-amber-400",
										children: [/* @__PURE__ */ jsx(XCircle, { className: "w-4 h-4 text-amber-400" }), /* @__PURE__ */ jsx("span", { children: "Mark as Cancelled" })]
									}),
									/* @__PURE__ */ jsxs(DropdownMenuItem, {
										onClick: () => setConsultationToDelete(row),
										className: "cursor-pointer gap-2 text-rose-400 focus:text-rose-400",
										children: [/* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4 text-rose-400" }), /* @__PURE__ */ jsx("span", { children: "Delete Record" })]
									})
								]
							})] })]
						})
					}
				],
				searchPlaceholder: "Search client name, email, or service...",
				searchKey: "name"
			}),
			/* @__PURE__ */ jsx(Dialog, {
				open: !!selectedConsultation,
				onOpenChange: (open) => !open && setSelectedConsultation(null),
				children: /* @__PURE__ */ jsxs(DialogContent, {
					className: "max-w-lg bg-[#0b0c10] border border-white/10 text-white",
					children: [/* @__PURE__ */ jsxs(DialogHeader, { children: [/* @__PURE__ */ jsxs(DialogTitle, {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ jsx(CalendarCheck2, { className: "w-5 h-5 text-accent" }), /* @__PURE__ */ jsx("span", { children: "Consultation Booking Details" })]
					}), /* @__PURE__ */ jsx(DialogDescription, {
						className: "text-neutral-400",
						children: "15-minute technical review call scheduled through live chat."
					})] }), selectedConsultation && /* @__PURE__ */ jsxs("div", {
						className: "space-y-4 pt-2 font-mono text-xs",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-2 gap-3 bg-white/5 p-3 rounded-xl border border-white/5",
								children: [
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
										className: "text-neutral-500 block text-[10px]",
										children: "CLIENT"
									}), /* @__PURE__ */ jsx("span", {
										className: "text-white font-semibold",
										children: selectedConsultation.name
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
										className: "text-neutral-500 block text-[10px]",
										children: "EMAIL"
									}), /* @__PURE__ */ jsx("span", {
										className: "text-white",
										children: selectedConsultation.email
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
										className: "text-neutral-500 block text-[10px]",
										children: "PHONE / WA"
									}), /* @__PURE__ */ jsx("span", {
										className: "text-white",
										children: selectedConsultation.phone || "N/A"
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
										className: "text-neutral-500 block text-[10px]",
										children: "STATUS"
									}), /* @__PURE__ */ jsx("span", {
										className: "uppercase text-accent font-bold",
										children: selectedConsultation.status
									})] })
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "bg-white/5 p-3 rounded-xl border border-white/5 space-y-1",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "text-neutral-500 block text-[10px]",
										children: "SCHEDULED DATE & TIME"
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "text-sm font-bold text-white flex items-center gap-2",
										children: [/* @__PURE__ */ jsx(Clock, { className: "w-4 h-4 text-[#00f5ff]" }), /* @__PURE__ */ jsxs("span", { children: [
											selectedConsultation.scheduled_at_formatted,
											" (",
											selectedConsultation.timezone,
											")"
										] })]
									}),
									/* @__PURE__ */ jsxs("span", {
										className: "text-neutral-400 text-[11px] block mt-1",
										children: ["Service: ", selectedConsultation.service_name]
									})
								]
							}),
							selectedConsultation.notes && /* @__PURE__ */ jsxs("div", {
								className: "bg-white/5 p-3 rounded-xl border border-white/5",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-neutral-500 block text-[10px] mb-1",
									children: "INTAKE NOTES / SCOPE"
								}), /* @__PURE__ */ jsx("p", {
									className: "text-white/80 whitespace-pre-wrap",
									children: selectedConsultation.notes
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "pt-3 border-t border-white/10 flex flex-wrap items-center gap-2 justify-end",
								children: [
									selectedConsultation.status === "pending" && /* @__PURE__ */ jsxs(Button, {
										size: "sm",
										onClick: () => updateStatus(selectedConsultation, "confirmed"),
										className: "bg-accent hover:bg-[#b8dd00] text-black font-mono font-bold text-xs gap-1.5",
										children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Confirm & Acknowledge" })]
									}),
									/* @__PURE__ */ jsxs(Button, {
										variant: "outline",
										size: "sm",
										onClick: () => openRescheduleModal(selectedConsultation),
										className: "border-[#00f5ff]/30 bg-[#00f5ff]/10 hover:bg-[#00f5ff]/20 text-[#00f5ff] font-mono text-xs gap-1.5",
										children: [/* @__PURE__ */ jsx(CalendarClock, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Reschedule Call" })]
									}),
									selectedConsultation.status !== "completed" && /* @__PURE__ */ jsxs(Button, {
										variant: "ghost",
										size: "sm",
										onClick: () => updateStatus(selectedConsultation, "completed"),
										className: "text-emerald-400 hover:bg-emerald-500/10 font-mono text-xs gap-1.5",
										children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Mark Completed" })]
									}),
									selectedConsultation.status !== "cancelled" && /* @__PURE__ */ jsxs(Button, {
										variant: "ghost",
										size: "sm",
										onClick: () => updateStatus(selectedConsultation, "cancelled"),
										className: "text-rose-400 hover:bg-rose-500/10 font-mono text-xs gap-1.5",
										children: [/* @__PURE__ */ jsx(XCircle, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Cancel" })]
									})
								]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ jsx(Dialog, {
				open: !!consultationToReschedule,
				onOpenChange: (open) => !open && setConsultationToReschedule(null),
				children: /* @__PURE__ */ jsxs(DialogContent, {
					className: "max-w-md bg-[#0c0e14] border border-white/10 text-white rounded-2xl",
					children: [/* @__PURE__ */ jsxs(DialogHeader, { children: [/* @__PURE__ */ jsxs(DialogTitle, {
						className: "flex items-center gap-2 text-base",
						children: [/* @__PURE__ */ jsx(CalendarClock, { className: "w-5 h-5 text-[#00f5ff]" }), /* @__PURE__ */ jsx("span", { children: "Reschedule Technical Consultation" })]
					}), /* @__PURE__ */ jsxs(DialogDescription, {
						className: "text-neutral-400 text-xs font-mono",
						children: [
							"Select a new date and time for ",
							consultationToReschedule?.name,
							"."
						]
					})] }), consultationToReschedule && /* @__PURE__ */ jsxs("form", {
						onSubmit: handleRescheduleSubmit,
						className: "space-y-4 pt-2",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "p-3 bg-white/5 border border-white/5 rounded-xl space-y-1 text-xs font-mono",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-neutral-500 block text-[10px]",
									children: "CURRENT SCHEDULED TIME"
								}), /* @__PURE__ */ jsxs("div", {
									className: "text-white font-semibold flex items-center gap-1.5",
									children: [/* @__PURE__ */ jsx(Clock, { className: "w-3.5 h-3.5 text-neutral-400" }), /* @__PURE__ */ jsxs("span", { children: [
										consultationToReschedule.scheduled_at_formatted,
										" (",
										consultationToReschedule.timezone,
										")"
									] })]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-[11px] font-mono text-neutral-300 block uppercase",
									children: "New Date & Time"
								}), /* @__PURE__ */ jsx("input", {
									type: "datetime-local",
									required: true,
									value: rescheduleDatetime,
									onChange: (e) => setRescheduleDatetime(e.target.value),
									className: "w-full bg-[#12141c] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-hidden focus:border-[#00f5ff] transition-colors"
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-[11px] font-mono text-neutral-300 block uppercase",
									children: "Reschedule Reason / Notes (Optional)"
								}), /* @__PURE__ */ jsx("textarea", {
									rows: 2,
									value: rescheduleNotes,
									onChange: (e) => setRescheduleNotes(e.target.value),
									placeholder: "e.g. Client requested to move call to afternoon via WhatsApp...",
									className: "w-full bg-[#12141c] border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-neutral-600 focus:outline-hidden focus:border-[#00f5ff] transition-colors resize-none"
								})]
							}),
							/* @__PURE__ */ jsxs(DialogFooter, {
								className: "pt-2 gap-2",
								children: [/* @__PURE__ */ jsx(Button, {
									type: "button",
									variant: "ghost",
									onClick: () => setConsultationToReschedule(null),
									className: "font-mono text-xs text-neutral-400 hover:text-white",
									children: "Cancel"
								}), /* @__PURE__ */ jsx(Button, {
									type: "submit",
									disabled: isSubmittingReschedule,
									className: "bg-[#00f5ff] hover:bg-[#00d0db] text-black font-mono font-bold text-xs gap-1.5 cursor-pointer",
									children: isSubmittingReschedule ? /* @__PURE__ */ jsx("span", { children: "Rescheduling..." }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(CalendarClock, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Save & Confirm Reschedule" })] })
								})]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ jsx(AlertDialog, {
				open: !!consultationToDelete,
				onOpenChange: (open) => !open && setConsultationToDelete(null),
				children: /* @__PURE__ */ jsxs(AlertDialogContent, {
					className: "bg-[#0b0c10] border border-white/10 text-white",
					children: [/* @__PURE__ */ jsxs(AlertDialogHeader, { children: [/* @__PURE__ */ jsx(AlertDialogTitle, {
						className: "text-white",
						children: "Delete Booking Record?"
					}), /* @__PURE__ */ jsxs(AlertDialogDescription, {
						className: "text-neutral-400",
						children: [
							"This will remove the consultation booking record for",
							" ",
							/* @__PURE__ */ jsx("strong", {
								className: "text-white",
								children: consultationToDelete?.name
							}),
							". This action cannot be undone."
						]
					})] }), /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [/* @__PURE__ */ jsx(AlertDialogCancel, {
						className: "bg-white/5 border-white/10 text-white hover:bg-white/10",
						children: "Cancel"
					}), /* @__PURE__ */ jsx(AlertDialogAction, {
						onClick: handleDelete,
						className: "bg-rose-500 hover:bg-rose-600 text-white",
						children: "Delete"
					})] })]
				})
			})
		]
	}) });
}
//#endregion
export { ConsultationsIndex as default };
