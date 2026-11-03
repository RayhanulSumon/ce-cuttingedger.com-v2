import { t as AdminLayout } from "./AdminLayout-B_omIhRP.js";
import { n as Button } from "./input-lL3MBuxn.js";
import { t as AdminPageHeader } from "./AdminPageHeader-BLzCfjWe.js";
import { t as Badge } from "./badge-BgjwAGBP.js";
import "react";
import { Link } from "@inertiajs/react";
import { ArrowUpRight, CalendarCheck2, FolderKanban, Layers, Mail, MessageSquareText, Send, Sparkles } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Admin/Dashboard.tsx
function Dashboard({ stats, recentInquiries = [], featuredProjects = [] }) {
	return /* @__PURE__ */ jsxs(AdminLayout, {
		title: "COMMAND CENTER",
		children: [/* @__PURE__ */ jsx(AdminPageHeader, {
			title: "Command Center",
			description: "Studio telemetry, flagship deployment registry, and prospect inquiry alerts.",
			badge: "REALTIME ENGINE",
			children: /* @__PURE__ */ jsx(Link, {
				href: "/admin/projects",
				children: /* @__PURE__ */ jsxs(Button, {
					className: "gap-2",
					children: [/* @__PURE__ */ jsx(FolderKanban, { className: "w-4 h-4" }), /* @__PURE__ */ jsx("span", { children: "Manage Flagships" })]
				})
			})
		}), /* @__PURE__ */ jsxs("div", {
			className: "space-y-10",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "p-6 rounded-2xl bg-[#12141c] border border-white/10 space-y-3 relative overflow-hidden group hover:border-accent/40 transition-colors",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between text-neutral-400",
								children: [/* @__PURE__ */ jsx("span", {
									className: "font-mono text-xs uppercase tracking-wider",
									children: "Live Projects"
								}), /* @__PURE__ */ jsx(FolderKanban, { className: "w-4 h-4 text-accent" })]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "text-3xl sm:text-4xl font-extrabold text-white tracking-tight",
								children: stats.total_projects
							}),
							/* @__PURE__ */ jsx("span", {
								className: "text-xs font-mono text-accent block",
								children: "Flagship 2D/3D builds"
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "p-6 rounded-2xl bg-[#12141c] border border-white/10 space-y-3 relative overflow-hidden group hover:border-accent/40 transition-colors",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between text-neutral-400",
								children: [/* @__PURE__ */ jsx("span", {
									className: "font-mono text-xs uppercase tracking-wider",
									children: "Capabilities"
								}), /* @__PURE__ */ jsx(Layers, { className: "w-4 h-4 text-emerald-400" })]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "text-3xl sm:text-4xl font-extrabold text-white tracking-tight",
								children: stats.total_services
							}),
							/* @__PURE__ */ jsx("span", {
								className: "text-xs font-mono text-emerald-400 block",
								children: "Disciplines active"
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "p-6 rounded-2xl bg-[#12141c] border border-white/10 space-y-3 relative overflow-hidden group hover:border-accent/40 transition-colors",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between text-neutral-400",
								children: [/* @__PURE__ */ jsx("span", {
									className: "font-mono text-xs uppercase tracking-wider",
									children: "New Inquiries"
								}), /* @__PURE__ */ jsx(Mail, { className: "w-4 h-4 text-amber-400" })]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "text-3xl sm:text-4xl font-extrabold text-white tracking-tight",
								children: stats.new_inquiries
							}),
							/* @__PURE__ */ jsx("span", {
								className: "text-xs font-mono text-amber-400 block",
								children: "Awaiting response"
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "p-6 rounded-2xl bg-[#12141c] border border-white/10 space-y-3 relative overflow-hidden group hover:border-accent/40 transition-colors",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between text-neutral-400",
								children: [/* @__PURE__ */ jsx("span", {
									className: "font-mono text-xs uppercase tracking-wider",
									children: "Subscribers"
								}), /* @__PURE__ */ jsx(Send, { className: "w-4 h-4 text-sky-400" })]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "text-3xl sm:text-4xl font-extrabold text-white tracking-tight",
								children: stats.total_subscribers
							}),
							/* @__PURE__ */ jsx("span", {
								className: "text-xs font-mono text-sky-400 block",
								children: "Dispatch audience"
							})
						]
					}),
					/* @__PURE__ */ jsxs(Link, {
						href: "/admin/consultations",
						className: "block p-6 rounded-2xl bg-[#12141c] border border-white/10 space-y-3 relative overflow-hidden group hover:border-[#00f5ff]/40 transition-colors",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between text-neutral-400",
								children: [/* @__PURE__ */ jsx("span", {
									className: "font-mono text-xs uppercase tracking-wider",
									children: "Booked Calls"
								}), /* @__PURE__ */ jsx(CalendarCheck2, { className: "w-4 h-4 text-[#00f5ff]" })]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "text-3xl sm:text-4xl font-extrabold text-[#00f5ff] tracking-tight",
								children: stats.upcoming_consultations ?? 0
							}),
							/* @__PURE__ */ jsxs("span", {
								className: "text-xs font-mono text-[#00f5ff] flex items-center gap-1",
								children: [/* @__PURE__ */ jsx("span", { children: "Upcoming calls" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-3 h-3" })]
							})
						]
					}),
					/* @__PURE__ */ jsxs(Link, {
						href: "/admin/chat-sessions",
						className: "block p-6 rounded-2xl bg-[#12141c] border border-white/10 space-y-3 relative overflow-hidden group hover:border-accent/40 transition-colors",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between text-neutral-400",
								children: [/* @__PURE__ */ jsx("span", {
									className: "font-mono text-xs uppercase tracking-wider",
									children: "Chat Leads"
								}), /* @__PURE__ */ jsx(MessageSquareText, { className: "w-4 h-4 text-accent" })]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "text-3xl sm:text-4xl font-extrabold text-accent tracking-tight",
								children: stats.total_chat_leads ?? 0
							}),
							/* @__PURE__ */ jsxs("span", {
								className: "text-xs font-mono text-accent flex items-center gap-1",
								children: [/* @__PURE__ */ jsx("span", { children: "View Transcripts" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-3 h-3" })]
							})
						]
					})
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-1 lg:grid-cols-2 gap-8",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "p-6 rounded-2xl bg-[#12141c] border border-white/10 space-y-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between pb-4 border-b border-white/10",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(Mail, { className: "w-4 h-4 text-accent" }), /* @__PURE__ */ jsx("h2", {
								className: "text-sm font-mono uppercase tracking-wider text-white font-bold",
								children: "Recent Inquiries Inbox"
							})]
						}), /* @__PURE__ */ jsxs(Link, {
							href: "/admin/messages",
							className: "text-xs font-mono text-accent hover:underline flex items-center gap-1",
							children: [/* @__PURE__ */ jsx("span", { children: "View all" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-3.5 h-3.5" })]
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "space-y-3",
						children: recentInquiries.length > 0 ? recentInquiries.map((inq) => /* @__PURE__ */ jsxs("div", {
							className: "p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors flex items-center justify-between",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
								className: "font-semibold text-sm text-white",
								children: inq.name
							}), /* @__PURE__ */ jsxs("div", {
								className: "text-xs text-neutral-400 font-mono",
								children: [
									inq.company || inq.email,
									" •",
									" ",
									/* @__PURE__ */ jsx("span", {
										className: "text-accent",
										children: inq.budget || "Custom"
									})
								]
							})] }), /* @__PURE__ */ jsx(Badge, {
								variant: inq.status === "new" ? "accent" : "secondary",
								children: inq.status.toUpperCase()
							})]
						}, inq.id)) : /* @__PURE__ */ jsx("p", {
							className: "text-xs text-neutral-500 font-mono py-8 text-center",
							children: "No pending inquiries."
						})
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "p-6 rounded-2xl bg-[#12141c] border border-white/10 space-y-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between pb-4 border-b border-white/10",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(Sparkles, { className: "w-4 h-4 text-accent" }), /* @__PURE__ */ jsx("h2", {
								className: "text-sm font-mono uppercase tracking-wider text-white font-bold",
								children: "Featured Flagships"
							})]
						}), /* @__PURE__ */ jsxs(Link, {
							href: "/admin/projects",
							className: "text-xs font-mono text-accent hover:underline flex items-center gap-1",
							children: [/* @__PURE__ */ jsx("span", { children: "Curate" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-3.5 h-3.5" })]
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "space-y-3",
						children: featuredProjects.length > 0 ? featuredProjects.map((proj) => /* @__PURE__ */ jsxs("div", {
							className: "p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors flex items-center justify-between",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ jsx("img", {
									src: proj.cover_image,
									alt: proj.title,
									className: "w-10 h-10 rounded-lg object-cover bg-neutral-900 border border-white/10",
									onError: (e) => {
										e.target.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80";
									}
								}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
									className: "font-semibold text-sm text-white",
									children: proj.title
								}), /* @__PURE__ */ jsxs("div", {
									className: "text-xs text-neutral-400 font-mono",
									children: [
										proj.client_name,
										" • ",
										proj.year
									]
								})] })]
							}), /* @__PURE__ */ jsxs(Badge, {
								variant: "outline",
								children: ["#", proj.sort_order]
							})]
						}, proj.id)) : /* @__PURE__ */ jsx("p", {
							className: "text-xs text-neutral-500 font-mono py-8 text-center",
							children: "No featured projects assigned."
						})
					})]
				})]
			})]
		})]
	});
}
//#endregion
export { Dashboard as default };
