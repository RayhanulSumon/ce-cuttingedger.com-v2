import { t as SeoHead } from "./SeoHead-CXtfHcil.js";
import "react";
import { Link } from "@inertiajs/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Admin/Dashboard.tsx
function Dashboard({ stats, recentInquiries = [], featuredProjects = [] }) {
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(SeoHead, { title: "Studio Command Center — Admin" }), /* @__PURE__ */ jsx("div", {
		className: "min-h-screen pt-32 pb-20 bg-[#08090c] text-white",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-white/10",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
						className: "font-mono text-xs uppercase tracking-widest text-[#d4ff00]",
						children: "[ STUDIO OPERATIONS // LEVEL 1 ACCESS ]"
					}), /* @__PURE__ */ jsx("h1", {
						className: "text-3xl sm:text-5xl font-display font-extrabold text-white mt-1",
						children: "Command Center."
					})] }), /* @__PURE__ */ jsx("div", {
						className: "flex items-center gap-3",
						children: /* @__PURE__ */ jsxs("span", {
							className: "px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2",
							children: [/* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-400 animate-pulse" }), /* @__PURE__ */ jsx("span", { children: "Engine Active (Laravel 13 + Inertia)" })]
						})
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "p-6 rounded-3xl bg-[#12141c] border border-white/10 space-y-2",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "font-mono text-xs text-neutral-400 uppercase",
									children: "Live 2D/3D Projects"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "text-4xl font-display font-black text-white",
									children: stats.total_projects
								}),
								/* @__PURE__ */ jsx("span", {
									className: "text-xs font-mono text-[#d4ff00]",
									children: "Curated flagships"
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "p-6 rounded-3xl bg-[#12141c] border border-white/10 space-y-2",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "font-mono text-xs text-neutral-400 uppercase",
									children: "Core Disciplines"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "text-4xl font-display font-black text-white",
									children: stats.total_services
								}),
								/* @__PURE__ */ jsx("span", {
									className: "text-xs font-mono text-neutral-400",
									children: "2D, 3D & Engineering"
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "p-6 rounded-3xl bg-[#12141c] border border-white/10 space-y-2",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "font-mono text-xs text-neutral-400 uppercase",
									children: "Pending Inbound Briefs"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "text-4xl font-display font-black text-[#d4ff00]",
									children: stats.new_inquiries
								}),
								/* @__PURE__ */ jsx("span", {
									className: "text-xs font-mono text-neutral-400",
									children: "Awaiting partner review"
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "p-6 rounded-3xl bg-[#12141c] border border-white/10 space-y-2",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "font-mono text-xs text-neutral-400 uppercase",
									children: "Journal Subscribers"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "text-4xl font-display font-black text-white",
									children: stats.total_subscribers
								}),
								/* @__PURE__ */ jsx("span", {
									className: "text-xs font-mono text-neutral-400",
									children: "Active email digest"
								})
							]
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "p-8 rounded-3xl bg-[#12141c] border border-white/10 space-y-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
							className: "text-2xl font-display font-bold text-white",
							children: "Recent Commission Transmissions"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-neutral-400 font-mono mt-0.5",
							children: "Project briefs submitted via contact terminal and slide-out panel"
						})] }), /* @__PURE__ */ jsx("span", {
							className: "font-mono text-xs text-neutral-500",
							children: "Latest 5 Records"
						})]
					}), recentInquiries.length === 0 ? /* @__PURE__ */ jsx("div", {
						className: "py-12 text-center text-sm font-mono text-neutral-500",
						children: "No new commission inquiries recorded."
					}) : /* @__PURE__ */ jsx("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ jsxs("table", {
							className: "w-full text-left text-sm",
							children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
								className: "border-b border-white/10 text-xs font-mono text-neutral-400 uppercase",
								children: [
									/* @__PURE__ */ jsx("th", {
										className: "py-3 px-4",
										children: "Client Name"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-3 px-4",
										children: "Email"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-3 px-4",
										children: "Company"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-3 px-4",
										children: "Discipline"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-3 px-4",
										children: "Budget Tier"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-3 px-4",
										children: "Status"
									})
								]
							}) }), /* @__PURE__ */ jsx("tbody", {
								className: "divide-y divide-white/5 font-mono text-xs",
								children: recentInquiries.map((inq) => /* @__PURE__ */ jsxs("tr", {
									className: "hover:bg-white/[0.02]",
									children: [
										/* @__PURE__ */ jsx("td", {
											className: "py-3.5 px-4 font-sans font-bold text-white",
											children: inq.name
										}),
										/* @__PURE__ */ jsx("td", {
											className: "py-3.5 px-4 text-neutral-300",
											children: inq.email
										}),
										/* @__PURE__ */ jsx("td", {
											className: "py-3.5 px-4 text-neutral-400",
											children: inq.company || "Private"
										}),
										/* @__PURE__ */ jsx("td", {
											className: "py-3.5 px-4 text-[#d4ff00]",
											children: inq.service_interest || "General"
										}),
										/* @__PURE__ */ jsx("td", {
											className: "py-3.5 px-4 text-neutral-300",
											children: inq.budget || "Custom"
										}),
										/* @__PURE__ */ jsx("td", {
											className: "py-3.5 px-4",
											children: /* @__PURE__ */ jsx("span", {
												className: "px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]",
												children: inq.status
											})
										})
									]
								}, inq.id))
							})]
						})
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "p-8 rounded-3xl bg-[#12141c] border border-white/10 space-y-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
							className: "text-2xl font-display font-bold text-white",
							children: "Showcase Flagship Queue"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-neutral-400 font-mono mt-0.5",
							children: "Pinned sticky cards featured on the homepage"
						})] }), /* @__PURE__ */ jsx(Link, {
							href: "/work",
							className: "text-xs font-mono uppercase text-[#d4ff00] hover:text-white transition-colors",
							children: "Preview Live Portfolio →"
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6",
						children: featuredProjects.map((p, idx) => /* @__PURE__ */ jsxs("div", {
							className: "p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3",
							children: [/* @__PURE__ */ jsx("div", {
								className: "aspect-[16/10] rounded-xl overflow-hidden bg-neutral-900 border border-white/5",
								children: /* @__PURE__ */ jsx("img", {
									src: p.cover_image,
									alt: p.title,
									className: "w-full h-full object-cover"
								})
							}), /* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsxs("span", {
									className: "text-[10px] font-mono text-[#d4ff00] uppercase block",
									children: [
										"Slot 0",
										idx + 1,
										" // ",
										p.category?.name
									]
								}),
								/* @__PURE__ */ jsx("h4", {
									className: "font-display font-bold text-base text-white",
									children: p.title
								}),
								/* @__PURE__ */ jsxs("p", {
									className: "text-xs text-neutral-400 font-mono",
									children: [
										p.client_name,
										" [",
										p.year,
										"]"
									]
								})
							] })]
						}, p.id))
					})]
				})
			]
		})
	})] });
}
//#endregion
export { Dashboard as default };
