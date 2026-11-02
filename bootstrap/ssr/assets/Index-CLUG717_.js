import { t as cn } from "./utils-BVTyW6jK.js";
import { a as DropdownMenuItem, i as DropdownMenuContent, n as AdminLayout, o as DropdownMenuTrigger, r as DropdownMenu, t as AdminPageHeader } from "./AdminPageHeader-BF3p_UDa.js";
import { n as Button } from "./input-lL3MBuxn.js";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, l as AdminDataTable, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-DsbEgc5R.js";
import { t as Badge } from "./badge-BgjwAGBP.js";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-C4D4ccTI.js";
import { useState } from "react";
import { router } from "@inertiajs/react";
import { AlertTriangle, CheckCircle2, Clock, Download, ExternalLink, Eye, Folder, Layers, MoreHorizontal, ShoppingBag, Trash2, XCircle } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Admin/Orders/Index.tsx
function OrdersIndex({ orders, stats, currentStatus, currentPaymentStatus, searchTerm }) {
	const [selectedOrder, setSelectedOrder] = useState(null);
	const [isDetailOpen, setIsDetailOpen] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [orderToDelete, setOrderToDelete] = useState(null);
	const [previewImage, setPreviewImage] = useState(null);
	const [adminNote, setAdminNote] = useState("");
	const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
	const handleStatusFilter = (status) => {
		router.get("/admin/orders", {
			...status ? { status } : {},
			...currentPaymentStatus ? { payment_status: currentPaymentStatus } : {},
			...searchTerm ? { search: searchTerm } : {}
		}, { preserveState: true });
	};
	const handleSearch = (query) => {
		router.get("/admin/orders", {
			...currentStatus ? { status: currentStatus } : {},
			...currentPaymentStatus ? { payment_status: currentPaymentStatus } : {},
			...query ? { search: query } : {}
		}, { preserveState: true });
	};
	const handleUpdateStatus = (orderId, newStatus, newPayment, notes) => {
		setIsUpdatingStatus(true);
		router.put(`/admin/orders/${orderId}`, {
			status: newStatus,
			payment_status: newPayment ?? selectedOrder?.payment_status,
			admin_notes: notes ?? adminNote ?? selectedOrder?.admin_notes
		}, {
			onSuccess: () => {
				setIsDetailOpen(false);
				setSelectedOrder(null);
			},
			onFinish: () => setIsUpdatingStatus(false)
		});
	};
	const handleDelete = (order) => {
		setOrderToDelete(order);
		setIsDeleteOpen(true);
	};
	const confirmDelete = () => {
		if (!orderToDelete) return;
		router.delete(`/admin/orders/${orderToDelete.id}`, { onSuccess: () => {
			setIsDeleteOpen(false);
			setOrderToDelete(null);
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
			case "review": return /* @__PURE__ */ jsxs(Badge, {
				className: "bg-purple-500/10 text-purple-400 border border-purple-500/30",
				children: [/* @__PURE__ */ jsx(Eye, { className: "w-3 h-3 mr-1" }), " Quality Review"]
			});
			case "completed": return /* @__PURE__ */ jsxs(Badge, {
				className: "bg-accent/10 text-accent border border-accent/30",
				children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-3 h-3 mr-1" }), " Completed"]
			});
			case "cancelled": return /* @__PURE__ */ jsxs(Badge, {
				className: "bg-red-500/10 text-red-400 border border-red-500/30",
				children: [/* @__PURE__ */ jsx(XCircle, { className: "w-3 h-3 mr-1" }), " Cancelled"]
			});
		}
	};
	const getPaymentBadge = (status) => {
		switch (status) {
			case "paid": return /* @__PURE__ */ jsx(Badge, {
				className: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30",
				children: "Paid"
			});
			case "invoice_sent": return /* @__PURE__ */ jsx(Badge, {
				className: "bg-sky-500/10 text-sky-400 border border-sky-500/30",
				children: "Invoiced"
			});
			default: return /* @__PURE__ */ jsx(Badge, {
				className: "bg-white/10 text-white/60 border border-white/20",
				children: "Unpaid"
			});
		}
	};
	return /* @__PURE__ */ jsxs(AdminLayout, {
		title: "Client Orders",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "space-y-6",
				children: [
					/* @__PURE__ */ jsx(AdminPageHeader, {
						title: "Client Production Orders",
						description: "Manage commercial batch retouching orders, inspect client file uploads, validate quantities, and download production assets."
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-2 sm:grid-cols-5 gap-3",
						children: [
							/* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => handleStatusFilter(void 0),
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
							/* @__PURE__ */ jsxs("div", {
								className: "p-3 rounded-xl border border-white/10 bg-[#12141a] text-left",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-[10px] font-mono uppercase text-emerald-400/70 block",
									children: "Paid Revenue"
								}), /* @__PURE__ */ jsxs("span", {
									className: "text-xl font-bold font-mono text-emerald-400",
									children: ["$", stats.total_revenue.toFixed(2)]
								})]
							})
						]
					}),
					/* @__PURE__ */ jsx(AdminDataTable, {
						columns: [
							{
								header: "Order / Date",
								accessorKey: "order_number",
								cell: (row) => /* @__PURE__ */ jsxs("div", {
									className: "flex flex-col gap-0.5 font-mono",
									children: [/* @__PURE__ */ jsxs("span", {
										className: "font-bold text-white tracking-wider flex items-center gap-1.5",
										children: [/* @__PURE__ */ jsx(ShoppingBag, { className: "w-3.5 h-3.5 text-accent" }), row.order_number]
									}), /* @__PURE__ */ jsx("span", {
										className: "text-[10px] text-white/50",
										children: row.created_at_formatted
									})]
								})
							},
							{
								header: "Client",
								accessorKey: "client_name",
								cell: (row) => /* @__PURE__ */ jsxs("div", {
									className: "flex flex-col gap-0.5",
									children: [/* @__PURE__ */ jsx("span", {
										className: "font-medium text-white",
										children: row.client_name
									}), /* @__PURE__ */ jsx("span", {
										className: "text-[11px] text-[#00f5ff] font-mono",
										children: row.client_email
									})]
								})
							},
							{
								header: "Service & Complexity",
								accessorKey: "service_name",
								cell: (row) => /* @__PURE__ */ jsxs("div", {
									className: "flex flex-col gap-0.5 font-mono text-xs",
									children: [/* @__PURE__ */ jsx("span", {
										className: "font-semibold text-white truncate max-w-[180px]",
										children: row.service_name
									}), /* @__PURE__ */ jsxs("span", {
										className: "text-[10px] text-white/60 capitalize",
										children: [
											row.complexity,
											" complexity • ",
											row.turnaround
										]
									})]
								})
							},
							{
								header: "Files Validation",
								accessorKey: "uploaded_count",
								cell: (row) => {
									const isUnder = row.uploaded_count < row.quantity;
									const isOver = row.uploaded_count > row.quantity;
									return /* @__PURE__ */ jsxs("div", {
										className: "flex flex-col gap-1 font-mono text-xs",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-1.5",
											children: [
												/* @__PURE__ */ jsx("span", {
													className: "font-bold text-white",
													children: row.uploaded_count
												}),
												/* @__PURE__ */ jsx("span", {
													className: "text-white/40",
													children: "/"
												}),
												/* @__PURE__ */ jsxs("span", {
													className: "text-white/70",
													children: [row.quantity, " quoted"]
												})
											]
										}), row.cloud_link ? /* @__PURE__ */ jsxs("a", {
											href: row.cloud_link,
											target: "_blank",
											rel: "noreferrer",
											className: "inline-flex items-center gap-1 text-[10px] text-purple-300 bg-purple-500/15 hover:bg-purple-500/25 px-1.5 py-0.5 rounded border border-purple-500/30 w-fit transition-colors",
											onClick: (e) => e.stopPropagation(),
											children: [/* @__PURE__ */ jsx(Folder, { className: "w-2.5 h-2.5 shrink-0" }), " Drive Link ↗"]
										}) : isUnder ? /* @__PURE__ */ jsxs("span", {
											className: "inline-flex items-center gap-1 text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 w-fit",
											children: [
												/* @__PURE__ */ jsx(AlertTriangle, { className: "w-2.5 h-2.5 shrink-0" }),
												row.quantity - row.uploaded_count,
												" pending"
											]
										}) : isOver ? /* @__PURE__ */ jsxs("span", {
											className: "inline-flex items-center gap-1 text-[10px] text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded border border-sky-500/20 w-fit",
											children: [
												"+",
												row.uploaded_count - row.quantity,
												" extra"
											]
										}) : /* @__PURE__ */ jsxs("span", {
											className: "inline-flex items-center gap-1 text-[10px] text-accent bg-accent/10 px-1.5 py-0.5 rounded border border-accent/20 w-fit",
											children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-2.5 h-2.5 shrink-0" }), " Complete"]
										})]
									});
								}
							},
							{
								header: "Total / Payment",
								accessorKey: "total_price",
								cell: (row) => /* @__PURE__ */ jsxs("div", {
									className: "flex flex-col gap-1 font-mono text-xs",
									children: [/* @__PURE__ */ jsxs("span", {
										className: "font-bold text-accent",
										children: ["$", row.total_price.toFixed(2)]
									}), /* @__PURE__ */ jsx("div", { children: getPaymentBadge(row.payment_status) })]
								})
							},
							{
								header: "Status",
								accessorKey: "status",
								cell: (row) => getStatusBadge(row.status)
							},
							{
								header: "Actions",
								cell: (row) => /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ jsxs(Button, {
											size: "sm",
											variant: "outline",
											onClick: () => {
												setSelectedOrder(row);
												setAdminNote(row.admin_notes || "");
												setIsDetailOpen(true);
											},
											className: "h-8 px-2.5 bg-white/5 border-white/10 hover:bg-white/10 text-white font-mono text-xs",
											children: [/* @__PURE__ */ jsx(Eye, { className: "w-3.5 h-3.5 mr-1 text-[#00f5ff]" }), " Review"]
										}),
										/* @__PURE__ */ jsxs("a", {
											href: `/admin/orders/${row.id}/download-zip`,
											title: "Download All Files (ZIP)",
											className: "inline-flex items-center justify-center h-8 px-2.5 rounded-lg bg-accent/10 border border-accent/30 hover:bg-accent/20 text-accent text-xs font-mono transition-colors",
											children: [/* @__PURE__ */ jsx(Download, { className: "w-3.5 h-3.5 mr-1" }), " ZIP"]
										}),
										/* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
											asChild: true,
											children: /* @__PURE__ */ jsx(Button, {
												size: "sm",
												variant: "ghost",
												className: "h-8 w-8 p-0 text-white/60 hover:text-white",
												children: /* @__PURE__ */ jsx(MoreHorizontal, { className: "w-4 h-4" })
											})
										}), /* @__PURE__ */ jsxs(DropdownMenuContent, {
											align: "end",
											className: "bg-[#12141a] border-white/10 text-white font-mono text-xs",
											children: [
												/* @__PURE__ */ jsxs(DropdownMenuItem, {
													onClick: () => handleUpdateStatus(row.id, "in_production"),
													className: "hover:bg-white/10 cursor-pointer",
													children: [/* @__PURE__ */ jsx(Layers, { className: "w-3.5 h-3.5 mr-2 text-blue-400" }), " Start Production"]
												}),
												/* @__PURE__ */ jsxs(DropdownMenuItem, {
													onClick: () => handleUpdateStatus(row.id, "completed"),
													className: "hover:bg-white/10 cursor-pointer",
													children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5 mr-2 text-accent" }), " Mark Completed"]
												}),
												/* @__PURE__ */ jsxs(DropdownMenuItem, {
													onClick: () => handleDelete(row),
													className: "hover:bg-rose-500/10 text-rose-400 cursor-pointer",
													children: [/* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5 mr-2" }), " Delete Order"]
												})
											]
										})] })
									]
								})
							}
						],
						data: orders.data,
						pagination: orders,
						onSearch: handleSearch,
						searchPlaceholder: "Search by order #, client, email, or service..."
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
						children: [/* @__PURE__ */ jsx(ShoppingBag, { className: "w-4 h-4 text-accent" }), /* @__PURE__ */ jsxs("span", { children: ["Order #", selectedOrder?.order_number] })]
					}), /* @__PURE__ */ jsxs(DialogDescription, {
						className: "text-xs text-white/60 font-mono",
						children: [
							"Created on ",
							selectedOrder?.created_at_formatted,
							" • Source: ",
							selectedOrder?.source?.toUpperCase()
						]
					})] }), selectedOrder && /* @__PURE__ */ jsxs("div", {
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
										children: selectedOrder.client_name
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
										className: "text-[10px] text-white/40 uppercase block",
										children: "Delivery Email"
									}), /* @__PURE__ */ jsx("span", {
										className: "font-semibold text-[#00f5ff]",
										children: selectedOrder.client_email
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
										className: "text-[10px] text-white/40 uppercase block",
										children: "Phone / WhatsApp"
									}), /* @__PURE__ */ jsx("span", {
										className: "text-white/80",
										children: selectedOrder.client_phone || "Not provided"
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
										className: "text-[10px] text-white/40 uppercase block",
										children: "Service Type"
									}), /* @__PURE__ */ jsx("span", {
										className: "text-white font-semibold uppercase",
										children: selectedOrder.service_name
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
										className: "text-[10px] text-white/40 uppercase block",
										children: "Complexity"
									}), /* @__PURE__ */ jsx("span", {
										className: "text-accent font-bold capitalize",
										children: selectedOrder.complexity
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
										className: "text-[10px] text-white/40 uppercase block",
										children: "Turnaround SLA"
									}), /* @__PURE__ */ jsx("span", {
										className: "text-white",
										children: selectedOrder.turnaround
									})] })
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: cn("p-3 rounded-xl border flex items-center justify-between gap-3 font-mono", selectedOrder.uploaded_count < selectedOrder.quantity ? "bg-amber-500/10 border-amber-500/30 text-amber-300" : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"),
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2",
									children: [selectedOrder.uploaded_count < selectedOrder.quantity ? /* @__PURE__ */ jsx(AlertTriangle, { className: "w-4 h-4 text-amber-400 shrink-0" }) : /* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4 text-emerald-400 shrink-0" }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("span", {
										className: "font-bold text-white block",
										children: [
											selectedOrder.uploaded_count,
											" of ",
											selectedOrder.quantity,
											" files uploaded"
										]
									}), /* @__PURE__ */ jsx("span", {
										className: "text-[11px] opacity-80",
										children: selectedOrder.uploaded_count < selectedOrder.quantity ? `Client quoted for ${selectedOrder.quantity} images, but has only uploaded ${selectedOrder.uploaded_count} files (${selectedOrder.quantity - selectedOrder.uploaded_count} pending).` : `All ${selectedOrder.quantity} files received for this production batch.`
									})] })]
								}), /* @__PURE__ */ jsxs("a", {
									href: `/admin/orders/${selectedOrder.id}/download-zip`,
									className: "px-3 py-1.5 rounded-lg bg-accent text-black font-bold text-xs flex items-center gap-1.5 shrink-0 hover:bg-[#b8dd00] transition-colors",
									children: [/* @__PURE__ */ jsx(Download, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Download All (ZIP)" })]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "p-3 rounded-xl bg-black/40 border border-white/10 font-mono flex items-center justify-between text-xs",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
									className: "text-white/50 block text-[10px]",
									children: "Pricing Breakdown"
								}), /* @__PURE__ */ jsxs("span", {
									className: "text-white",
									children: [
										"$",
										selectedOrder.unit_price.toFixed(2),
										"/image × ",
										selectedOrder.quantity,
										" images",
										selectedOrder.discount_percent > 0 && ` (${selectedOrder.discount_percent}% Volume Discount)`
									]
								})] }), /* @__PURE__ */ jsxs("div", {
									className: "text-right",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-white/50 block text-[10px]",
										children: "Total Order Amount"
									}), /* @__PURE__ */ jsxs("span", {
										className: "text-base font-bold text-accent",
										children: [
											"$",
											selectedOrder.total_price.toFixed(2),
											" USD"
										]
									})]
								})]
							}),
							selectedOrder.cloud_link && /* @__PURE__ */ jsxs("div", {
								className: "p-3.5 bg-purple-500/10 rounded-xl border border-purple-500/30 space-y-2",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ jsxs("span", {
										className: "text-xs font-bold text-purple-200 flex items-center gap-1.5 font-mono",
										children: [/* @__PURE__ */ jsx(Folder, { className: "w-4 h-4 text-purple-400" }), "Google Drive / Cloud Folder"]
									}), /* @__PURE__ */ jsxs("a", {
										href: selectedOrder.cloud_link,
										target: "_blank",
										rel: "noreferrer",
										className: "px-2.5 py-1 rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-mono text-xs font-semibold flex items-center gap-1 transition-colors",
										children: [/* @__PURE__ */ jsx("span", { children: "Open Cloud Link" }), /* @__PURE__ */ jsx(ExternalLink, { className: "w-3 h-3" })]
									})]
								}), /* @__PURE__ */ jsx("p", {
									className: "text-[11px] font-mono text-purple-200/90 break-all select-all bg-black/40 p-2 rounded-lg border border-purple-500/20",
									children: selectedOrder.cloud_link
								})]
							}),
							selectedOrder.instructions && /* @__PURE__ */ jsxs("div", {
								className: "p-3 bg-white/5 rounded-xl border border-white/10",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-[10px] text-white/40 uppercase font-mono block mb-1",
									children: "Client Instructions"
								}), /* @__PURE__ */ jsx("p", {
									className: "text-white/90 leading-relaxed font-sans",
									children: selectedOrder.instructions
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ jsxs("span", {
										className: "text-[11px] font-mono text-white/70 uppercase tracking-wider font-bold",
										children: [
											"Client Uploaded Files (",
											selectedOrder.images.length,
											")"
										]
									}), /* @__PURE__ */ jsxs("a", {
										href: `/admin/orders/${selectedOrder.id}/download-zip`,
										className: "text-[10px] font-mono text-accent hover:underline flex items-center gap-1",
										children: [
											/* @__PURE__ */ jsx(Download, { className: "w-3 h-3" }),
											" Download All (",
											selectedOrder.images.length,
											")"
										]
									})]
								}), /* @__PURE__ */ jsx("div", {
									className: "grid grid-cols-2 sm:grid-cols-3 gap-3",
									children: selectedOrder.images.map((imgUrl, i) => /* @__PURE__ */ jsxs("div", {
										className: "group relative rounded-xl border border-white/15 bg-black/50 overflow-hidden",
										children: [/* @__PURE__ */ jsx("div", {
											className: "aspect-square w-full",
											children: /* @__PURE__ */ jsx("img", {
												src: imgUrl,
												alt: `Order file ${i + 1}`,
												className: "w-full h-full object-cover group-hover:scale-105 transition-transform"
											})
										}), /* @__PURE__ */ jsxs("div", {
											className: "p-2 bg-[#12141a] flex items-center justify-between border-t border-white/10 text-[11px] font-mono",
											children: [/* @__PURE__ */ jsxs("span", { children: ["File #", i + 1] }), /* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-1.5",
												children: [/* @__PURE__ */ jsx("button", {
													type: "button",
													onClick: () => setPreviewImage(imgUrl),
													className: "p-1 hover:text-[#00f5ff] text-white/60",
													title: "Preview",
													children: /* @__PURE__ */ jsx(Eye, { className: "w-3 h-3" })
												}), /* @__PURE__ */ jsx("a", {
													href: imgUrl,
													download: true,
													target: "_blank",
													rel: "noreferrer",
													className: "p-1 hover:text-accent text-white/60",
													title: "Download File",
													children: /* @__PURE__ */ jsx(Download, { className: "w-3 h-3" })
												})]
											})]
										})]
									}, i))
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-[10px] font-mono uppercase text-white/60",
									children: "Internal Studio Notes"
								}), /* @__PURE__ */ jsx("textarea", {
									value: adminNote,
									onChange: (e) => setAdminNote(e.target.value),
									placeholder: "Add notes on progress, retouch crew assigned, or delivery links...",
									className: "w-full h-20 bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-accent transition-colors"
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ jsxs(Button, {
										type: "button",
										variant: "outline",
										size: "sm",
										onClick: () => handleUpdateStatus(selectedOrder.id, "in_production", void 0, adminNote),
										disabled: isUpdatingStatus,
										className: "bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20 font-mono text-xs",
										children: [/* @__PURE__ */ jsx(Layers, { className: "w-3.5 h-3.5 mr-1" }), " Set In Production"]
									}), /* @__PURE__ */ jsxs(Button, {
										type: "button",
										variant: "outline",
										size: "sm",
										onClick: () => handleUpdateStatus(selectedOrder.id, "completed", "paid", adminNote),
										disabled: isUpdatingStatus,
										className: "bg-accent/10 border-accent/30 text-accent hover:bg-accent/20 font-mono text-xs",
										children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5 mr-1" }), " Mark Delivered & Paid"]
									})]
								}), /* @__PURE__ */ jsx(Button, {
									type: "button",
									variant: "ghost",
									size: "sm",
									onClick: () => handleUpdateStatus(selectedOrder.id, selectedOrder.status, selectedOrder.payment_status, adminNote),
									disabled: isUpdatingStatus,
									className: "text-white/60 hover:text-white font-mono text-xs",
									children: "Save Notes Only"
								})]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ jsx(Dialog, {
				open: !!previewImage,
				onOpenChange: () => setPreviewImage(null),
				children: /* @__PURE__ */ jsx(DialogContent, {
					className: "max-w-4xl bg-black/95 border-white/20 p-2 text-white",
					children: previewImage && /* @__PURE__ */ jsxs("div", {
						className: "relative flex flex-col items-center",
						children: [/* @__PURE__ */ jsx("img", {
							src: previewImage,
							alt: "Order Asset Preview",
							className: "max-h-[80vh] w-auto object-contain rounded-lg"
						}), /* @__PURE__ */ jsxs("div", {
							className: "mt-2 flex items-center justify-between w-full px-2 text-xs font-mono",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-white/60 truncate max-w-md",
								children: previewImage
							}), /* @__PURE__ */ jsxs("a", {
								href: previewImage,
								download: true,
								target: "_blank",
								rel: "noreferrer",
								className: "px-3 py-1 rounded bg-accent text-black font-semibold flex items-center gap-1",
								children: [/* @__PURE__ */ jsx(Download, { className: "w-3 h-3" }), " Download High-Res"]
							})]
						})]
					})
				})
			}),
			/* @__PURE__ */ jsx(AlertDialog, {
				open: isDeleteOpen,
				onOpenChange: setIsDeleteOpen,
				children: /* @__PURE__ */ jsxs(AlertDialogContent, {
					className: "bg-[#12141a] border-white/10 text-white font-mono",
					children: [/* @__PURE__ */ jsxs(AlertDialogHeader, { children: [/* @__PURE__ */ jsxs(AlertDialogTitle, { children: [
						"Delete Order #",
						orderToDelete?.order_number,
						"?"
					] }), /* @__PURE__ */ jsx(AlertDialogDescription, {
						className: "text-white/60 text-xs",
						children: "This will permanently remove the order record and references to uploaded client files."
					})] }), /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [/* @__PURE__ */ jsx(AlertDialogCancel, {
						className: "bg-white/5 border-white/10 text-white hover:bg-white/10",
						children: "Cancel"
					}), /* @__PURE__ */ jsx(AlertDialogAction, {
						onClick: confirmDelete,
						className: "bg-rose-600 hover:bg-rose-700 text-white",
						children: "Delete Order"
					})] })]
				})
			})
		]
	});
}
//#endregion
export { OrdersIndex as default };
