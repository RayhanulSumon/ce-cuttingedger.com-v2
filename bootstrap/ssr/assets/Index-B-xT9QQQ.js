import { t as cn } from "./utils-BVTyW6jK.js";
import { a as DropdownMenuItem, i as DropdownMenuContent, n as AdminLayout, o as DropdownMenuTrigger, r as DropdownMenu, t as AdminPageHeader } from "./AdminPageHeader-BF3p_UDa.js";
import { n as Button } from "./input-lL3MBuxn.js";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, l as AdminDataTable, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-DsbEgc5R.js";
import { t as Badge } from "./badge-BgjwAGBP.js";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-C4D4ccTI.js";
import { useState } from "react";
import { router } from "@inertiajs/react";
import { CheckCircle2, Clock, Download, Eye, Layers, Mail, MoreHorizontal, Phone, Sparkles, Trash2, XCircle } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Admin/FreeTrials/Index.tsx
function FreeTrialsIndex({ trials, stats, currentStatus, searchTerm }) {
	const [selectedTrial, setSelectedTrial] = useState(null);
	const [isDetailOpen, setIsDetailOpen] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [trialToDelete, setTrialToDelete] = useState(null);
	const [previewImage, setPreviewImage] = useState(null);
	const [adminNote, setAdminNote] = useState("");
	const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
	const handleStatusFilter = (status) => {
		router.get("/admin/free-trials", {
			...status ? { status } : {},
			...searchTerm ? { search: searchTerm } : {}
		}, { preserveState: true });
	};
	const handleSearch = (query) => {
		router.get("/admin/free-trials", {
			...currentStatus ? { status: currentStatus } : {},
			...query ? { search: query } : {}
		}, { preserveState: true });
	};
	const handleUpdateStatus = (trialId, newStatus, notes) => {
		setIsUpdatingStatus(true);
		router.put(`/admin/free-trials/${trialId}`, {
			status: newStatus,
			admin_notes: notes ?? selectedTrial?.admin_notes
		}, {
			onSuccess: () => {
				setIsDetailOpen(false);
				setSelectedTrial(null);
			},
			onFinish: () => setIsUpdatingStatus(false)
		});
	};
	const handleDelete = (trial) => {
		setTrialToDelete(trial);
		setIsDeleteOpen(true);
	};
	const confirmDelete = () => {
		if (!trialToDelete) return;
		router.delete(`/admin/free-trials/${trialToDelete.id}`, { onSuccess: () => {
			setIsDeleteOpen(false);
			setTrialToDelete(null);
		} });
	};
	const getStatusBadge = (status) => {
		switch (status) {
			case "pending": return /* @__PURE__ */ jsxs(Badge, {
				className: "bg-amber-500/10 text-amber-400 border border-amber-500/30",
				children: [/* @__PURE__ */ jsx(Clock, { className: "w-3 h-3 mr-1" }), " Pending Review"]
			});
			case "in_production": return /* @__PURE__ */ jsxs(Badge, {
				className: "bg-blue-500/10 text-blue-400 border border-blue-500/30",
				children: [/* @__PURE__ */ jsx(Layers, { className: "w-3 h-3 mr-1" }), " In Production"]
			});
			case "completed": return /* @__PURE__ */ jsxs(Badge, {
				className: "bg-accent/10 text-accent border border-accent/30",
				children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-3 h-3 mr-1" }), " Delivered / Done"]
			});
			case "rejected": return /* @__PURE__ */ jsxs(Badge, {
				className: "bg-red-500/10 text-red-400 border border-red-500/30",
				children: [/* @__PURE__ */ jsx(XCircle, { className: "w-3 h-3 mr-1" }), " Rejected"]
			});
			default: return /* @__PURE__ */ jsx(Badge, { children: status });
		}
	};
	return /* @__PURE__ */ jsxs(AdminLayout, {
		title: "Free Trial Sample Orders",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "space-y-6",
				children: [
					/* @__PURE__ */ jsx(AdminPageHeader, {
						title: "Free Trial Orders",
						description: "Review incoming 3-image trial retouching requests, download master files, and process delivery."
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-2 sm:grid-cols-5 gap-3",
						children: [
							/* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => handleStatusFilter(),
								className: cn("p-3 rounded-xl border text-left transition-all cursor-pointer", !currentStatus ? "bg-white/10 border-white/30 shadow-md" : "bg-[#12141a] border-white/10 hover:border-white/20"),
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-[10px] font-mono uppercase text-white/50 block",
									children: "All Orders"
								}), /* @__PURE__ */ jsx("span", {
									className: "text-xl font-bold font-mono text-white",
									children: stats.total
								})]
							}),
							/* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => handleStatusFilter("pending"),
								className: cn("p-3 rounded-xl border text-left transition-all cursor-pointer", currentStatus === "pending" ? "bg-amber-500/15 border-amber-500/40 shadow-md" : "bg-[#12141a] border-white/10 hover:border-white/20"),
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-[10px] font-mono uppercase text-amber-400/70 block",
									children: "Pending Review"
								}), /* @__PURE__ */ jsx("span", {
									className: "text-xl font-bold font-mono text-amber-400",
									children: stats.pending
								})]
							}),
							/* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => handleStatusFilter("in_production"),
								className: cn("p-3 rounded-xl border text-left transition-all cursor-pointer", currentStatus === "in_production" ? "bg-blue-500/15 border-blue-500/40 shadow-md" : "bg-[#12141a] border-white/10 hover:border-white/20"),
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-[10px] font-mono uppercase text-blue-400/70 block",
									children: "In Production"
								}), /* @__PURE__ */ jsx("span", {
									className: "text-xl font-bold font-mono text-blue-400",
									children: stats.in_production
								})]
							}),
							/* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => handleStatusFilter("completed"),
								className: cn("p-3 rounded-xl border text-left transition-all cursor-pointer", currentStatus === "completed" ? "bg-accent/15 border-accent/40 shadow-md" : "bg-[#12141a] border-white/10 hover:border-white/20"),
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-[10px] font-mono uppercase text-accent/70 block",
									children: "Completed"
								}), /* @__PURE__ */ jsx("span", {
									className: "text-xl font-bold font-mono text-accent",
									children: stats.completed
								})]
							}),
							/* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => handleStatusFilter("rejected"),
								className: cn("p-3 rounded-xl border text-left transition-all cursor-pointer", currentStatus === "rejected" ? "bg-red-500/15 border-red-500/40 shadow-md" : "bg-[#12141a] border-white/10 hover:border-white/20"),
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-[10px] font-mono uppercase text-red-400/70 block",
									children: "Rejected"
								}), /* @__PURE__ */ jsx("span", {
									className: "text-xl font-bold font-mono text-red-400",
									children: stats.rejected
								})]
							})
						]
					}),
					/* @__PURE__ */ jsx(AdminDataTable, {
						columns: [
							{
								key: "id",
								label: "Order / Date",
								render: (trial) => /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
									className: "font-mono text-xs font-bold text-white flex items-center gap-1.5",
									children: [/* @__PURE__ */ jsx(Sparkles, { className: "w-3.5 h-3.5 text-accent" }), /* @__PURE__ */ jsxs("span", { children: ["TRIAL #", trial.id] })]
								}), /* @__PURE__ */ jsx("span", {
									className: "text-[11px] text-white/50 font-mono",
									children: trial.created_at_formatted
								})] })
							},
							{
								key: "name",
								label: "Client / Email",
								render: (trial) => /* @__PURE__ */ jsxs("div", {
									className: "space-y-0.5",
									children: [
										/* @__PURE__ */ jsx("p", {
											className: "font-semibold text-white text-xs",
											children: trial.name || "Guest Client"
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-1.5 text-[11px] text-[#00f5ff] font-mono",
											children: [/* @__PURE__ */ jsx(Mail, { className: "w-3 h-3 shrink-0" }), /* @__PURE__ */ jsx("span", { children: trial.email })]
										}),
										trial.phone && /* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-1.5 text-[10px] text-white/50 font-mono",
											children: [/* @__PURE__ */ jsx(Phone, { className: "w-2.5 h-2.5 shrink-0" }), /* @__PURE__ */ jsx("span", { children: trial.phone })]
										})
									]
								})
							},
							{
								key: "images",
								label: "Sample Images",
								render: (trial) => /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ jsx("div", {
											className: "flex items-center -space-x-2 overflow-hidden",
											children: trial.images.map((img, i) => /* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => setPreviewImage(img),
												className: "w-9 h-9 rounded-lg border-2 border-[#12141a] overflow-hidden bg-black/60 hover:scale-110 transition-transform cursor-pointer relative",
												title: "Click to view full preview",
												children: /* @__PURE__ */ jsx("img", {
													src: img,
													alt: "Thumb",
													className: "w-full h-full object-cover"
												})
											}, i))
										}),
										/* @__PURE__ */ jsxs("span", {
											className: "text-[11px] font-mono text-white/70",
											children: [
												trial.images_count,
												" ",
												trial.images_count === 1 ? "img" : "imgs"
											]
										}),
										trial.images.length > 0 && /* @__PURE__ */ jsx("a", {
											href: trial.images[0],
											download: `trial-${trial.id}-sample-1`,
											target: "_blank",
											rel: "noreferrer",
											className: "p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer",
											title: "Download Sample Image",
											children: /* @__PURE__ */ jsx(Download, { className: "w-3.5 h-3.5" })
										})
									]
								})
							},
							{
								key: "service",
								label: "Service",
								render: (trial) => /* @__PURE__ */ jsx(Badge, {
									variant: "outline",
									className: "font-mono text-[10px] uppercase tracking-wider border-white/15 text-white/80",
									children: trial.service.replace(/-/g, " ")
								})
							},
							{
								key: "status",
								label: "Status",
								render: (trial) => getStatusBadge(trial.status)
							},
							{
								key: "actions",
								label: "Actions",
								render: (trial) => /* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-end gap-1",
									children: [/* @__PURE__ */ jsxs(Button, {
										size: "sm",
										variant: "ghost",
										onClick: () => {
											setSelectedTrial(trial);
											setAdminNote(trial.admin_notes || "");
											setIsDetailOpen(true);
										},
										className: "h-8 px-2 text-xs text-white/70 hover:text-white hover:bg-white/10",
										children: [/* @__PURE__ */ jsx(Eye, { className: "w-3.5 h-3.5 mr-1" }), /* @__PURE__ */ jsx("span", { children: "Manage" })]
									}), /* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
										asChild: true,
										children: /* @__PURE__ */ jsx(Button, {
											size: "sm",
											variant: "ghost",
											className: "h-8 w-8 p-0 text-white/50 hover:text-white hover:bg-white/10",
											children: /* @__PURE__ */ jsx(MoreHorizontal, { className: "w-4 h-4" })
										})
									}), /* @__PURE__ */ jsxs(DropdownMenuContent, {
										align: "end",
										className: "bg-[#12141a] border-white/10 text-white",
										children: [
											/* @__PURE__ */ jsxs(DropdownMenuItem, {
												onClick: () => handleUpdateStatus(trial.id, "in_production"),
												className: "text-xs hover:bg-white/10 cursor-pointer",
												children: [/* @__PURE__ */ jsx(Layers, { className: "w-3.5 h-3.5 mr-2 text-blue-400" }), /* @__PURE__ */ jsx("span", { children: "Move to Production" })]
											}),
											/* @__PURE__ */ jsxs(DropdownMenuItem, {
												onClick: () => handleUpdateStatus(trial.id, "completed"),
												className: "text-xs hover:bg-white/10 cursor-pointer",
												children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5 mr-2 text-accent" }), /* @__PURE__ */ jsx("span", { children: "Mark as Completed" })]
											}),
											/* @__PURE__ */ jsxs(DropdownMenuItem, {
												onClick: () => handleUpdateStatus(trial.id, "rejected"),
												className: "text-xs hover:bg-white/10 cursor-pointer text-amber-400",
												children: [/* @__PURE__ */ jsx(XCircle, { className: "w-3.5 h-3.5 mr-2 text-amber-400" }), /* @__PURE__ */ jsx("span", { children: "Mark as Rejected" })]
											}),
											/* @__PURE__ */ jsxs(DropdownMenuItem, {
												onClick: () => handleDelete(trial),
												className: "text-xs hover:bg-red-500/20 text-red-400 cursor-pointer",
												children: [/* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5 mr-2" }), /* @__PURE__ */ jsx("span", { children: "Delete Record" })]
											})
										]
									})] })]
								})
							}
						],
						data: trials.data,
						pagination: trials,
						onSearch: handleSearch,
						searchPlaceholder: "Search by client, email, or service..."
					})
				]
			}),
			/* @__PURE__ */ jsx(Dialog, {
				open: isDetailOpen,
				onOpenChange: setIsDetailOpen,
				children: /* @__PURE__ */ jsxs(DialogContent, {
					className: "max-w-2xl bg-[#0f1117] border-white/15 text-white max-h-[90vh] overflow-y-auto",
					children: [/* @__PURE__ */ jsxs(DialogHeader, { children: [/* @__PURE__ */ jsxs(DialogTitle, {
						className: "flex items-center gap-2 text-base font-bold",
						children: [/* @__PURE__ */ jsx(Sparkles, { className: "w-4 h-4 text-accent" }), /* @__PURE__ */ jsxs("span", { children: ["Process Free Trial Order #", selectedTrial?.id] })]
					}), /* @__PURE__ */ jsxs(DialogDescription, {
						className: "text-xs text-white/60 font-mono",
						children: [
							"Submitted on ",
							selectedTrial?.created_at_formatted,
							" • 100% Free Sample Trial"
						]
					})] }), selectedTrial && /* @__PURE__ */ jsxs("div", {
						className: "space-y-4 py-2 text-xs",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-2 sm:grid-cols-3 gap-2.5 bg-white/5 p-3 rounded-xl border border-white/10 font-mono",
								children: [
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
										className: "text-[10px] text-white/40 uppercase block",
										children: "Client Name"
									}), /* @__PURE__ */ jsx("span", {
										className: "font-semibold text-white",
										children: selectedTrial.name
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
										className: "text-[10px] text-white/40 uppercase block",
										children: "Delivery Email"
									}), /* @__PURE__ */ jsx("span", {
										className: "font-semibold text-[#00f5ff]",
										children: selectedTrial.email
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
										className: "text-[10px] text-white/40 uppercase block",
										children: "Phone / WhatsApp"
									}), /* @__PURE__ */ jsx("span", {
										className: "text-white/80",
										children: selectedTrial.phone || "Not provided"
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
										className: "text-[10px] text-white/40 uppercase block",
										children: "Service Type"
									}), /* @__PURE__ */ jsx("span", {
										className: "text-white font-semibold uppercase",
										children: selectedTrial.service
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
										className: "text-[10px] text-white/40 uppercase block",
										children: "Images Count"
									}), /* @__PURE__ */ jsxs("span", {
										className: "text-accent font-bold",
										children: [selectedTrial.images_count, " submitted"]
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
										className: "text-[10px] text-white/40 uppercase block",
										children: "Current Status"
									}), /* @__PURE__ */ jsx("div", {
										className: "mt-0.5",
										children: getStatusBadge(selectedTrial.status)
									})] })
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ jsxs("span", {
										className: "text-[11px] font-mono text-white/70 uppercase tracking-wider font-bold",
										children: [
											"Client Submitted Images (",
											selectedTrial.images.length,
											")"
										]
									}), /* @__PURE__ */ jsx("span", {
										className: "text-[10px] font-mono text-white/40",
										children: "Click any image to enlarge"
									})]
								}), /* @__PURE__ */ jsx("div", {
									className: "grid grid-cols-2 sm:grid-cols-3 gap-3",
									children: selectedTrial.images.map((imgUrl, i) => /* @__PURE__ */ jsxs("div", {
										className: "group relative rounded-xl border border-white/15 bg-black/50 overflow-hidden",
										children: [/* @__PURE__ */ jsx("div", {
											className: "aspect-square w-full",
											children: /* @__PURE__ */ jsx("img", {
												src: imgUrl,
												alt: `Upload ${i + 1}`,
												className: "w-full h-full object-cover group-hover:scale-105 transition-transform"
											})
										}), /* @__PURE__ */ jsxs("div", {
											className: "p-2 bg-[#12141a] flex items-center justify-between border-t border-white/10 text-[11px] font-mono",
											children: [/* @__PURE__ */ jsxs("span", { children: ["Image #", i + 1] }), /* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-1.5",
												children: [/* @__PURE__ */ jsx("button", {
													type: "button",
													onClick: () => setPreviewImage(imgUrl),
													className: "p-1 rounded hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer",
													title: "Zoom Preview",
													children: /* @__PURE__ */ jsx(Eye, { className: "w-3.5 h-3.5" })
												}), /* @__PURE__ */ jsx("a", {
													href: imgUrl,
													download: `trial-${selectedTrial.id}-img-${i + 1}`,
													target: "_blank",
													rel: "noreferrer",
													className: "p-1 rounded hover:bg-white/10 text-accent transition-colors cursor-pointer",
													title: "Download File",
													children: /* @__PURE__ */ jsx(Download, { className: "w-3.5 h-3.5" })
												})]
											})]
										})]
									}, i))
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-2 pt-2 border-t border-white/10",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-[11px] font-mono uppercase text-white/70 block",
									children: "Internal Admin Notes & Delivery Log"
								}), /* @__PURE__ */ jsx("textarea", {
									value: adminNote,
									onChange: (e) => setAdminNote(e.target.value),
									placeholder: "Add notes e.g., 'Retouching finished by Team Alpha. Master PSD sent to client inbox.'",
									rows: 3,
									className: "w-full p-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder-white/30 focus:outline-none focus:border-accent font-mono"
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5 pt-2 border-t border-white/10",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-[10px] font-mono uppercase text-white/50 block",
									children: "Update Order Status"
								}), /* @__PURE__ */ jsxs("div", {
									className: "flex flex-wrap gap-2",
									children: [
										/* @__PURE__ */ jsxs(Button, {
											type: "button",
											size: "sm",
											variant: "outline",
											onClick: () => handleUpdateStatus(selectedTrial.id, "in_production", adminNote),
											disabled: isUpdatingStatus,
											className: "h-8 text-xs border-blue-500/40 text-blue-400 hover:bg-blue-500/20 cursor-pointer",
											children: [/* @__PURE__ */ jsx(Layers, { className: "w-3.5 h-3.5 mr-1" }), /* @__PURE__ */ jsx("span", { children: "Mark In Production" })]
										}),
										/* @__PURE__ */ jsxs(Button, {
											type: "button",
											size: "sm",
											onClick: () => handleUpdateStatus(selectedTrial.id, "completed", adminNote),
											disabled: isUpdatingStatus,
											className: "h-8 text-xs bg-accent hover:bg-accent-hover text-black font-semibold cursor-pointer",
											children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5 mr-1" }), /* @__PURE__ */ jsx("span", { children: "Complete & Sent" })]
										}),
										/* @__PURE__ */ jsxs(Button, {
											type: "button",
											size: "sm",
											variant: "outline",
											onClick: () => handleUpdateStatus(selectedTrial.id, "rejected", adminNote),
											disabled: isUpdatingStatus,
											className: "h-8 text-xs border-red-500/40 text-red-400 hover:bg-red-500/20 cursor-pointer",
											children: [/* @__PURE__ */ jsx(XCircle, { className: "w-3.5 h-3.5 mr-1" }), /* @__PURE__ */ jsx("span", { children: "Reject Request" })]
										})
									]
								})]
							})
						]
					})]
				})
			}),
			previewImage && /* @__PURE__ */ jsx("div", {
				onClick: () => setPreviewImage(null),
				className: "fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer",
				children: /* @__PURE__ */ jsxs("div", {
					className: "relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-white/20",
					children: [/* @__PURE__ */ jsx("img", {
						src: previewImage,
						alt: "Full Preview",
						className: "max-w-full max-h-[85vh] object-contain"
					}), /* @__PURE__ */ jsxs("div", {
						className: "p-3 bg-[#12141a] flex items-center justify-between",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-xs font-mono text-white/70",
							children: "Client Submission Full View"
						}), /* @__PURE__ */ jsxs("a", {
							href: previewImage,
							download: true,
							target: "_blank",
							rel: "noreferrer",
							onClick: (e) => e.stopPropagation(),
							className: "py-1 px-3 rounded-lg bg-accent text-black font-mono text-xs font-semibold flex items-center gap-1.5",
							children: [/* @__PURE__ */ jsx(Download, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Download Full Resolution" })]
						})]
					})]
				})
			}),
			/* @__PURE__ */ jsx(AlertDialog, {
				open: isDeleteOpen,
				onOpenChange: setIsDeleteOpen,
				children: /* @__PURE__ */ jsxs(AlertDialogContent, {
					className: "bg-[#12141a] border-white/10 text-white",
					children: [/* @__PURE__ */ jsxs(AlertDialogHeader, { children: [/* @__PURE__ */ jsx(AlertDialogTitle, { children: "Delete Free Trial Request?" }), /* @__PURE__ */ jsxs(AlertDialogDescription, {
						className: "text-white/60",
						children: [
							"Are you sure you want to delete Trial Order #",
							trialToDelete?.id,
							" for",
							" ",
							trialToDelete?.email,
							"? This action cannot be undone."
						]
					})] }), /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [/* @__PURE__ */ jsx(AlertDialogCancel, {
						className: "bg-white/5 border-white/10 hover:bg-white/10 text-white",
						children: "Cancel"
					}), /* @__PURE__ */ jsx(AlertDialogAction, {
						onClick: confirmDelete,
						className: "bg-red-500 hover:bg-red-600 text-white",
						children: "Delete Order"
					})] })]
				})
			})
		]
	});
}
//#endregion
export { FreeTrialsIndex as default };
