import { n as AdminLayout, t as AdminPageHeader } from "./AdminPageHeader-BF3p_UDa.js";
import { n as Button } from "./input-lL3MBuxn.js";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, l as AdminDataTable, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-DsbEgc5R.js";
import { t as Badge } from "./badge-BgjwAGBP.js";
import { n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-C4D4ccTI.js";
import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import { AlertTriangle, Bot, CheckCircle2, ExternalLink, Eye, Loader2, Mail, MessageSquareText, Radio, Send, Sparkles, Trash2, User, UserCheck } from "lucide-react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Admin/ChatSessions/Index.tsx
function ChatSessionsIndex({ sessions, stats, currentStatus }) {
	const [activeSessionId, setActiveSessionId] = useState(null);
	const [transcript, setTranscript] = useState(null);
	const [isLoadingTranscript, setIsLoadingTranscript] = useState(false);
	const [replyText, setReplyText] = useState("");
	const [isSendingReply, setIsSendingReply] = useState(false);
	const [isTogglingTakeover, setIsTogglingTakeover] = useState(false);
	const [sessionToDelete, setSessionToDelete] = useState(null);
	const [bulkDeleteType, setBulkDeleteType] = useState(null);
	const playAdminChime = () => {
		try {
			const AudioContextClass = window.AudioContext || window.webkitAudioContext;
			if (!AudioContextClass) return;
			const ctx = new AudioContextClass();
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();
			osc.type = "sine";
			osc.frequency.setValueAtTime(523.25, ctx.currentTime);
			osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + .12);
			gain.gain.setValueAtTime(.12, ctx.currentTime);
			gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .35);
			osc.connect(gain);
			gain.connect(ctx.destination);
			osc.start();
			osc.stop(ctx.currentTime + .35);
		} catch {}
	};
	useEffect(() => {
		if (!activeSessionId) return;
		const interval = setInterval(async () => {
			try {
				const highestId = transcript?.messages?.reduce((max, m) => m.id > max ? m.id : max, 0) || 0;
				const data = await (await fetch(`/admin/chat-sessions/${activeSessionId}/poll?after_id=${highestId}`, { headers: { Accept: "application/json" } })).json();
				if (data.session) setTranscript((prev) => {
					if (!prev) return prev;
					return {
						...prev,
						session: {
							...prev.session,
							...data.session
						}
					};
				});
				if (data.messages && data.messages.length > 0) {
					playAdminChime();
					setTranscript((prev) => {
						if (!prev) return prev;
						const existingIds = new Set(prev.messages.map((m) => m.id));
						const newOnes = data.messages.filter((m) => !existingIds.has(m.id));
						if (newOnes.length === 0) return prev;
						return {
							...prev,
							messages: [...prev.messages, ...newOnes]
						};
					});
				}
			} catch {}
		}, 2500);
		return () => clearInterval(interval);
	}, [activeSessionId, transcript]);
	const openTranscript = async (session) => {
		setActiveSessionId(session.id);
		setIsLoadingTranscript(true);
		setReplyText("");
		try {
			const data = await (await fetch(route("admin.chat-sessions.show", session.id), { headers: { Accept: "application/json" } })).json();
			setTranscript(data);
		} catch (err) {
			console.error("Error loading transcript:", err);
		} finally {
			setIsLoadingTranscript(false);
		}
	};
	const handleTakeover = async () => {
		if (!activeSessionId || isTogglingTakeover) return;
		setIsTogglingTakeover(true);
		try {
			const csrfToken = document.querySelector("meta[name=\"csrf-token\"]")?.content || "";
			const data = await (await fetch(`/admin/chat-sessions/${activeSessionId}/takeover`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-CSRF-TOKEN": csrfToken,
					Accept: "application/json"
				}
			})).json();
			if (data.session) setTranscript((prev) => {
				if (!prev) return prev;
				return {
					...prev,
					session: {
						...prev.session,
						...data.session
					},
					messages: data.announcement ? [...prev.messages, data.announcement] : prev.messages
				};
			});
		} catch (err) {
			console.error(err);
		} finally {
			setIsTogglingTakeover(false);
		}
	};
	const handleRelease = async () => {
		if (!activeSessionId || isTogglingTakeover) return;
		setIsTogglingTakeover(true);
		try {
			const csrfToken = document.querySelector("meta[name=\"csrf-token\"]")?.content || "";
			const data = await (await fetch(`/admin/chat-sessions/${activeSessionId}/release`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-CSRF-TOKEN": csrfToken,
					Accept: "application/json"
				}
			})).json();
			if (data.session) setTranscript((prev) => {
				if (!prev) return prev;
				return {
					...prev,
					session: {
						...prev.session,
						...data.session
					},
					messages: data.announcement ? [...prev.messages, data.announcement] : prev.messages
				};
			});
		} catch (err) {
			console.error(err);
		} finally {
			setIsTogglingTakeover(false);
		}
	};
	const handleSendReply = async () => {
		if (!activeSessionId || !replyText.trim() || isSendingReply) return;
		setIsSendingReply(true);
		try {
			const csrfToken = document.querySelector("meta[name=\"csrf-token\"]")?.content || "";
			const data = await (await fetch(`/admin/chat-sessions/${activeSessionId}/reply`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-CSRF-TOKEN": csrfToken,
					Accept: "application/json"
				},
				body: JSON.stringify({ content: replyText.trim() })
			})).json();
			if (data.message) {
				setTranscript((prev) => {
					if (!prev) return prev;
					return {
						...prev,
						session: {
							...prev.session,
							mode: "operator"
						},
						messages: [...prev.messages, data.message]
					};
				});
				setReplyText("");
			}
		} catch (err) {
			console.error(err);
		} finally {
			setIsSendingReply(false);
		}
	};
	const handleDelete = () => {
		if (!sessionToDelete) return;
		router.delete(route("admin.chat-sessions.destroy", sessionToDelete.id), {
			preserveScroll: true,
			onSuccess: () => setSessionToDelete(null)
		});
	};
	const handleBulkDelete = () => {
		if (!bulkDeleteType) return;
		router.delete(route("admin.chat-sessions.destroy-all"), {
			data: { type: bulkDeleteType },
			preserveScroll: true,
			onSuccess: () => setBulkDeleteType(null)
		});
	};
	const getStatusBadge = (status) => {
		switch (status) {
			case "converted": return /* @__PURE__ */ jsx(Badge, {
				variant: "accent",
				className: "font-mono",
				children: "LEAD CONVERTED"
			});
			case "active": return /* @__PURE__ */ jsx(Badge, {
				variant: "success",
				className: "font-mono",
				children: "ACTIVE"
			});
			case "idle": return /* @__PURE__ */ jsx(Badge, {
				variant: "secondary",
				className: "font-mono",
				children: "IDLE"
			});
			case "abandoned": return /* @__PURE__ */ jsx(Badge, {
				variant: "destructive",
				className: "font-mono",
				children: "ABANDONED"
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
				title: "Live Chat Sessions & Transcripts",
				description: "Monitor real-time visitor inquiries, captured leads, image quote calculations, and live human operator takeover.",
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ jsxs(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => router.post(route("admin.chat-sessions.mark-all-read"), {}, { preserveScroll: true }),
							className: "border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-mono text-xs gap-1.5 h-9",
							title: "Mark all new chat leads as acknowledged / read",
							children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Mark Leads Read" })]
						}),
						/* @__PURE__ */ jsxs(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => setBulkDeleteType("empty"),
							className: "border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-mono text-xs gap-1.5 h-9",
							title: "Delete all empty sessions with 0 messages",
							children: [/* @__PURE__ */ jsx(Sparkles, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Clear 0-Msg Sessions" })]
						}),
						/* @__PURE__ */ jsxs(Button, {
							variant: "destructive",
							size: "sm",
							onClick: () => setBulkDeleteType("all"),
							className: "bg-rose-500/20 border border-rose-500/30 hover:bg-rose-600 text-rose-300 hover:text-white font-mono text-xs gap-1.5 h-9",
							title: "Delete all visitor chat sessions and transcripts",
							children: [/* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Delete All" })]
						})
					]
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-2 md:grid-cols-4 gap-4",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "bg-[#12141a] border border-white/5 rounded-2xl p-4",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1",
							children: "Total Visitor Chats"
						}), /* @__PURE__ */ jsx("div", {
							className: "text-2xl font-bold font-mono text-white",
							children: stats.total_sessions
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "bg-[#12141a] border border-accent/30 rounded-2xl p-4",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-[10px] font-mono uppercase tracking-wider text-accent block mb-1",
							children: "Captured Leads"
						}), /* @__PURE__ */ jsx("div", {
							className: "text-2xl font-bold font-mono text-accent",
							children: stats.captured_leads
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: `rounded-2xl p-4 border transition-all ${(stats.needs_human ?? 0) > 0 ? "bg-rose-500/10 border-rose-500/40 shadow-lg shadow-rose-500/10" : "bg-[#12141a] border-white/5"}`,
						children: [/* @__PURE__ */ jsxs("span", {
							className: "text-[10px] font-mono uppercase tracking-wider text-rose-400 block mb-1 flex items-center gap-1.5",
							children: [(stats.needs_human ?? 0) > 0 && /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-rose-500 animate-ping" }), "Needs Human Specialist"]
						}), /* @__PURE__ */ jsx("div", {
							className: `text-2xl font-bold font-mono ${(stats.needs_human ?? 0) > 0 ? "text-rose-400" : "text-neutral-400"}`,
							children: stats.needs_human ?? 0
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "bg-[#12141a] border border-[#00f5ff]/20 rounded-2xl p-4",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-[10px] font-mono uppercase tracking-wider text-[#00f5ff] block mb-1",
							children: "Live Operator Active"
						}), /* @__PURE__ */ jsx("div", {
							className: "text-2xl font-bold font-mono text-[#00f5ff]",
							children: stats.operator_active ?? 0
						})]
					})
				]
			}),
			/* @__PURE__ */ jsx(AdminDataTable, {
				data: sessions.data,
				columns: [
					{
						header: "Client / Visitor",
						accessorKey: "lead_name",
						cell: (row) => /* @__PURE__ */ jsxs("div", {
							className: "space-y-0.5",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "font-semibold text-white flex items-center gap-1.5",
								children: [
									/* @__PURE__ */ jsx(User, { className: "w-3.5 h-3.5 text-accent" }),
									/* @__PURE__ */ jsx("span", { children: row.lead_name }),
									row.has_consultation && /* @__PURE__ */ jsx("span", {
										className: "text-[9px] font-mono font-bold bg-[#00f5ff]/20 text-[#00f5ff] px-1.5 py-0.2 rounded",
										children: "CALL BOOKED"
									})
								]
							}), /* @__PURE__ */ jsxs("div", {
								className: "text-xs text-neutral-400 font-mono flex items-center gap-1.5",
								children: [/* @__PURE__ */ jsx(Mail, { className: "w-3 h-3 text-neutral-500" }), /* @__PURE__ */ jsx("span", { children: row.lead_email || "Not shared yet" })]
							})]
						})
					},
					{
						header: "Phone / WhatsApp",
						accessorKey: "lead_phone",
						cell: (row) => /* @__PURE__ */ jsx("span", {
							className: "text-xs font-mono text-neutral-300",
							children: row.lead_phone || /* @__PURE__ */ jsx("span", {
								className: "text-neutral-600",
								children: "—"
							})
						})
					},
					{
						header: "Quote Estimate",
						accessorKey: "estimated_price",
						cell: (row) => /* @__PURE__ */ jsx("div", {
							className: "font-mono text-xs",
							children: row.estimated_price ? /* @__PURE__ */ jsxs("span", {
								className: "font-bold text-accent",
								children: ["$", row.estimated_price]
							}) : /* @__PURE__ */ jsx("span", {
								className: "text-neutral-600",
								children: "—"
							})
						})
					},
					{
						header: "Messages",
						accessorKey: "messages_count",
						cell: (row) => /* @__PURE__ */ jsxs("span", {
							className: "font-mono text-xs text-neutral-300",
							children: [row.messages_count, " msgs"]
						})
					},
					{
						header: "Mode & Status",
						accessorKey: "status",
						cell: (row) => /* @__PURE__ */ jsxs("div", {
							className: "flex flex-col gap-1 items-start",
							children: [row.needs_human && /* @__PURE__ */ jsxs("span", {
								className: "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse",
								children: [/* @__PURE__ */ jsx(AlertTriangle, { className: "w-2.5 h-2.5" }), "NEEDS HUMAN"]
							}), row.mode === "operator" ? /* @__PURE__ */ jsxs("span", {
								className: "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#00f5ff]/20 text-[#00f5ff] border border-[#00f5ff]/30",
								children: [/* @__PURE__ */ jsx(Radio, { className: "w-2.5 h-2.5 animate-pulse" }), "OPERATOR LIVE"]
							}) : getStatusBadge(row.status)]
						})
					},
					{
						header: "Last Active",
						accessorKey: "last_active_at",
						cell: (row) => /* @__PURE__ */ jsx("div", {
							className: "text-xs font-mono text-neutral-400",
							children: row.last_active_formatted
						})
					},
					{
						header: "Actions",
						id: "actions",
						cell: (row) => /* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-end gap-1",
							children: [/* @__PURE__ */ jsx(Button, {
								variant: "default",
								size: "sm",
								onClick: () => openTranscript(row),
								className: `h-8 px-2.5 text-xs font-mono gap-1.5 transition-all cursor-pointer ${row.needs_human ? "bg-rose-500 text-white hover:bg-rose-600 animate-pulse font-bold" : row.mode === "operator" ? "bg-[#00f5ff] text-black hover:bg-[#00d0db] font-bold" : "bg-white/10 hover:bg-accent hover:text-black text-white"}`,
								title: "Open Live Chat Console & Take Over",
								children: row.needs_human ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Radio, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Join Live" })] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Eye, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: row.mode === "operator" ? "Live Chat" : "Transcript" })] })
							}), /* @__PURE__ */ jsx(Button, {
								variant: "ghost",
								size: "sm",
								onClick: () => setSessionToDelete(row),
								className: "h-8 w-8 p-0 text-neutral-500 hover:text-rose-400 cursor-pointer",
								title: "Delete transcript",
								children: /* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5" })
							})]
						})
					}
				],
				searchPlaceholder: "Search visitor name, email, or company...",
				searchKey: "lead_name"
			}),
			/* @__PURE__ */ jsx(Dialog, {
				open: !!activeSessionId,
				onOpenChange: (open) => {
					if (!open) {
						setActiveSessionId(null);
						setTranscript(null);
						setReplyText("");
					}
				},
				children: /* @__PURE__ */ jsxs(DialogContent, {
					className: "max-w-3xl bg-[#0b0c10] border border-white/10 text-white max-h-[90vh] flex flex-col p-0 overflow-hidden shadow-2xl",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "p-4 border-b border-white/10 bg-[#12141a] flex flex-wrap items-center justify-between gap-3 shrink-0",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs(DialogTitle, {
								className: "flex items-center gap-2 text-sm",
								children: [
									/* @__PURE__ */ jsx(MessageSquareText, { className: "w-4 h-4 text-accent" }),
									/* @__PURE__ */ jsx("span", { children: "Live Client Chat Console" }),
									transcript?.session?.needs_human && /* @__PURE__ */ jsx(Badge, {
										variant: "destructive",
										className: "font-mono text-[10px] animate-pulse",
										children: "NEEDS OPERATOR"
									}),
									transcript?.session?.mode === "operator" && /* @__PURE__ */ jsxs(Badge, {
										variant: "accent",
										className: "font-mono text-[10px] bg-[#00f5ff]/20 text-[#00f5ff] border-[#00f5ff]/30",
										children: [
											"OPERATOR ACTIVE (",
											transcript.session.operator_name || "You",
											")"
										]
									})
								]
							}), /* @__PURE__ */ jsx(DialogDescription, {
								className: "text-xs text-neutral-400 font-mono mt-0.5",
								children: transcript?.session?.lead_email ? `Lead: ${transcript.session.lead_email} (${transcript.session.lead_name || "Visitor"})` : `Anonymous Visitor • IP: ${transcript?.session?.ip_address || "Unknown"}`
							})] }), /* @__PURE__ */ jsx("div", {
								className: "flex items-center gap-2",
								children: transcript?.session?.mode === "operator" ? /* @__PURE__ */ jsxs(Button, {
									variant: "outline",
									size: "sm",
									onClick: handleRelease,
									disabled: isTogglingTakeover,
									className: "h-8 px-3 text-xs font-mono border-white/10 text-neutral-300 hover:text-white hover:bg-white/10 cursor-pointer",
									title: "Hand chat back to automated assistant",
									children: [/* @__PURE__ */ jsx(Bot, { className: "w-3.5 h-3.5 mr-1 text-accent" }), /* @__PURE__ */ jsx("span", { children: "Release to Bot" })]
								}) : /* @__PURE__ */ jsxs(Button, {
									variant: "default",
									size: "sm",
									onClick: handleTakeover,
									disabled: isTogglingTakeover,
									className: "h-8 px-3 text-xs font-mono bg-[#00f5ff] hover:bg-[#00d0db] text-black font-bold cursor-pointer",
									title: "Take over this conversation and chat live",
									children: [/* @__PURE__ */ jsx(Radio, { className: "w-3.5 h-3.5 mr-1" }), /* @__PURE__ */ jsx("span", { children: "Take Over Chat" })]
								})
							})]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin scrollbar-thumb-white/10 min-h-[340px]",
							children: isLoadingTranscript ? /* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-center py-20 text-neutral-400 gap-2 font-mono text-xs",
								children: [/* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin text-accent" }), /* @__PURE__ */ jsx("span", { children: "Loading conversation stream..." })]
							}) : transcript?.messages && transcript.messages.length > 0 ? transcript.messages.map((m) => {
								const isUser = m.sender === "user";
								const isOperator = m.sender === "operator";
								return /* @__PURE__ */ jsxs("div", {
									className: `flex flex-col ${isUser ? "items-end" : "items-start"}`,
									children: [/* @__PURE__ */ jsx("div", {
										className: "flex items-center gap-1.5 mb-1 text-[10px] text-neutral-500 font-mono",
										children: isUser ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", { children: m.created_at_formatted }), /* @__PURE__ */ jsx("span", {
											className: "text-white font-semibold",
											children: "Client"
										})] }) : isOperator ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("span", {
											className: "text-[#00f5ff] font-semibold flex items-center gap-1",
											children: [
												/* @__PURE__ */ jsx(UserCheck, { className: "w-3 h-3 text-[#00f5ff]" }),
												"Operator (",
												transcript.session?.operator_name || "You",
												")"
											]
										}), /* @__PURE__ */ jsx("span", { children: m.created_at_formatted })] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", {
											className: "text-accent font-semibold",
											children: "Assistant Bot"
										}), /* @__PURE__ */ jsx("span", { children: m.created_at_formatted })] })
									}), /* @__PURE__ */ jsxs("div", {
										className: `max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${isUser ? "bg-accent text-black font-medium rounded-br-xs" : isOperator ? "bg-[#0e1b29] text-white border border-[#00f5ff]/40 rounded-bl-xs shadow-md shadow-[#00f5ff]/5" : "bg-[#151720] text-white/90 border border-white/5 rounded-bl-xs"}`,
										children: [
											m.attachments && m.attachments.length > 0 && /* @__PURE__ */ jsx("div", {
												className: "mb-2 flex flex-wrap gap-1.5",
												children: m.attachments.map((url, i) => /* @__PURE__ */ jsxs("a", {
													href: url,
													target: "_blank",
													rel: "noreferrer",
													className: "relative group/att block",
													children: [/* @__PURE__ */ jsx("img", {
														src: url,
														alt: "Uploaded attachment",
														className: "w-16 h-16 object-cover rounded-lg border border-white/20"
													}), /* @__PURE__ */ jsx("span", {
														className: "absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/att:opacity-100 transition-opacity rounded-lg",
														children: /* @__PURE__ */ jsx(ExternalLink, { className: "w-3.5 h-3.5 text-white" })
													})]
												}, i))
											}),
											/* @__PURE__ */ jsx("p", {
												className: "whitespace-pre-wrap",
												children: m.content
											}),
											m.tool_results && m.tool_results.length > 0 && /* @__PURE__ */ jsx("div", {
												className: "mt-2 pt-2 border-t border-white/10 space-y-1 font-mono text-[11px]",
												children: m.tool_results.map((res, rIdx) => /* @__PURE__ */ jsxs("div", {
													className: "bg-black/30 p-2 rounded-lg border border-white/5",
													children: [
														/* @__PURE__ */ jsxs("span", {
															className: "text-accent block text-[10px] uppercase font-bold",
															children: ["Tool Executed: ", res.type]
														}),
														res.service_name && /* @__PURE__ */ jsxs("div", { children: [
															"Service: ",
															res.service_name,
															" • ",
															res.quantity,
															" imgs • $",
															res.total_price,
															" USD"
														] }),
														res.datetime_formatted && /* @__PURE__ */ jsxs("div", { children: ["Booked for: ", res.datetime_formatted] })
													]
												}, rIdx))
											})
										]
									})]
								}, m.id);
							}) : /* @__PURE__ */ jsx("p", {
								className: "text-center text-neutral-500 py-12 text-xs font-mono",
								children: "No transcript messages recorded for this session."
							})
						}),
						/* @__PURE__ */ jsx("div", {
							className: "p-3 border-t border-white/10 bg-[#12141a] shrink-0",
							children: /* @__PURE__ */ jsxs("form", {
								onSubmit: (e) => {
									e.preventDefault();
									handleSendReply();
								},
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ jsx("input", {
									type: "text",
									value: replyText,
									onChange: (e) => setReplyText(e.target.value),
									placeholder: transcript?.session?.mode === "operator" ? "Type live message to client... (Press Enter to send)" : "Type message to take over and reply directly...",
									disabled: isSendingReply,
									className: "flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#00f5ff] transition-colors font-mono"
								}), /* @__PURE__ */ jsx(Button, {
									type: "submit",
									disabled: !replyText.trim() || isSendingReply,
									className: "h-9 px-4 bg-[#00f5ff] hover:bg-[#00d0db] text-black font-mono font-bold text-xs gap-1.5 cursor-pointer disabled:opacity-40",
									children: isSendingReply ? /* @__PURE__ */ jsx(Loader2, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Send, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Send" })] })
								})]
							})
						})
					]
				})
			}),
			/* @__PURE__ */ jsx(AlertDialog, {
				open: !!sessionToDelete,
				onOpenChange: (open) => !open && setSessionToDelete(null),
				children: /* @__PURE__ */ jsxs(AlertDialogContent, {
					className: "bg-[#0b0c10] border border-white/10 text-white",
					children: [/* @__PURE__ */ jsxs(AlertDialogHeader, { children: [/* @__PURE__ */ jsx(AlertDialogTitle, {
						className: "text-white",
						children: "Delete Chat Transcript?"
					}), /* @__PURE__ */ jsx(AlertDialogDescription, {
						className: "text-neutral-400",
						children: "This will permanently remove this visitor session and all conversation logs."
					})] }), /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [/* @__PURE__ */ jsx(AlertDialogCancel, {
						className: "bg-white/5 border-white/10 text-white hover:bg-white/10",
						children: "Cancel"
					}), /* @__PURE__ */ jsx(AlertDialogAction, {
						onClick: handleDelete,
						className: "bg-rose-500 hover:bg-rose-600 text-white",
						children: "Delete Transcript"
					})] })]
				})
			}),
			/* @__PURE__ */ jsx(AlertDialog, {
				open: !!bulkDeleteType,
				onOpenChange: (open) => !open && setBulkDeleteType(null),
				children: /* @__PURE__ */ jsxs(AlertDialogContent, {
					className: "bg-[#0b0c10] border border-white/10 text-white",
					children: [/* @__PURE__ */ jsxs(AlertDialogHeader, { children: [/* @__PURE__ */ jsxs(AlertDialogTitle, {
						className: "text-white flex items-center gap-2",
						children: [/* @__PURE__ */ jsx(Trash2, { className: "w-5 h-5 text-rose-400" }), bulkDeleteType === "empty" ? "Clear Empty Visitor Sessions?" : "Delete All Chat Transcripts?"]
					}), /* @__PURE__ */ jsx(AlertDialogDescription, {
						className: "text-neutral-400",
						children: bulkDeleteType === "empty" ? "This will delete all visitor chat sessions that have 0 messages and no captured email leads, cleaning up phantom rows." : "Are you sure you want to delete ALL chat sessions? All visitor conversations, leads, and transcripts will be permanently purged."
					})] }), /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [/* @__PURE__ */ jsx(AlertDialogCancel, {
						className: "bg-white/5 border-white/10 text-white hover:bg-white/10",
						children: "Cancel"
					}), /* @__PURE__ */ jsx(AlertDialogAction, {
						onClick: handleBulkDelete,
						className: "bg-rose-600 hover:bg-rose-700 text-white font-mono font-bold",
						children: bulkDeleteType === "empty" ? "Clear Empty Sessions" : "Yes, Delete All"
					})] })]
				})
			})
		]
	}) });
}
//#endregion
export { ChatSessionsIndex as default };
