import { t as SeoHead } from "./SeoHead-jRblvokC.js";
import { t as PageHero } from "./PageHero-BKafzHM7.js";
import { useState } from "react";
import { Link } from "@inertiajs/react";
import { ArrowUpRight, Briefcase, CheckCircle2, ChevronRight, Globe, MapPin, Sparkles, Zap } from "lucide-react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Careers/Index.tsx
function Index({ openings = [] }) {
	const [selectedDept, setSelectedDept] = useState("All");
	const departments = ["All", ...Array.from(new Set(openings.map((j) => j.department).filter(Boolean)))];
	const filteredJobs = selectedDept === "All" ? openings : openings.filter((j) => j.department === selectedDept);
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(SeoHead, {
			title: "Careers & Open Positions — Cutting Edger",
			description: "Join CuttingEdger. We are looking for relentless creative engineers, master Photoshop retouchers, and 3D spatial designers.",
			breadcrumbs: [{
				name: "Home",
				url: "/"
			}, {
				name: "Careers",
				url: "/careers"
			}]
		}),
		/* @__PURE__ */ jsx(PageHero, {
			compact: true,
			eyebrow: "Careers & Opportunities",
			title: "Build with our",
			highlight: "creative production squad.",
			description: "We work on high-stakes digital catalogs for category-defining global brands. Zero micromanagement, zero pointless meetings, purely craft and velocity.",
			children: /* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center gap-2.5 pt-1",
				children: [
					/* @__PURE__ */ jsxs("span", {
						className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-xs text-neutral-300 font-mono",
						children: [/* @__PURE__ */ jsx(Zap, { className: "w-3.5 h-3.5 text-accent" }), /* @__PURE__ */ jsx("span", { children: "High-Velocity Workflow" })]
					}),
					/* @__PURE__ */ jsxs("span", {
						className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-xs text-neutral-300 font-mono",
						children: [/* @__PURE__ */ jsx(Globe, { className: "w-3.5 h-3.5 text-accent" }), /* @__PURE__ */ jsx("span", { children: "100% Remote & Global Studio" })]
					}),
					/* @__PURE__ */ jsxs("span", {
						className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-xs text-neutral-300 font-mono",
						children: [/* @__PURE__ */ jsx(Sparkles, { className: "w-3.5 h-3.5 text-accent" }), /* @__PURE__ */ jsx("span", { children: "Top 5% Industry Compensation" })]
					})
				]
			})
		}),
		/* @__PURE__ */ jsxs("section", {
			className: "py-12 sm:py-16 bg-[#08090d] relative min-h-[50vh]",
			children: [/* @__PURE__ */ jsx("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[25rem] bg-accent/[0.03] rounded-full blur-[200px] pointer-events-none" }), /* @__PURE__ */ jsxs("div", {
				className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-white/10 gap-4",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ jsxs("span", {
								className: "font-mono text-xs uppercase tracking-widest text-accent font-semibold",
								children: [
									"[ Active Vacancies (",
									openings.length,
									") ]"
								]
							}), /* @__PURE__ */ jsxs("span", {
								className: "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[11px] font-mono text-emerald-400 font-medium",
								children: [/* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" }), "Actively Interviewing"]
							})]
						}), departments.length > 2 && /* @__PURE__ */ jsx("div", {
							className: "flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0",
							children: departments.map((dept) => /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setSelectedDept(dept),
								className: `px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${selectedDept === dept ? "bg-accent text-black font-bold shadow-sm" : "bg-white/[0.03] text-neutral-400 hover:text-white hover:bg-white/[0.06] border border-white/5"}`,
								children: dept
							}, dept))
						})]
					}),
					filteredJobs.length > 0 ? /* @__PURE__ */ jsx("div", {
						className: "space-y-4",
						children: filteredJobs.map((job) => /* @__PURE__ */ jsxs(Link, {
							href: `/careers/${job.slug}`,
							className: "group relative p-6 sm:p-7 rounded-2xl bg-gradient-to-b from-[#11131c]/90 to-[#0b0c11]/90 border border-white/10 hover:border-accent/50 hover:bg-[#141622] hover:shadow-[0_20px_50px_rgba(245,166,35,0.08)] transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden",
							children: [
								/* @__PURE__ */ jsx("div", { className: "absolute left-0 top-0 bottom-0 w-1 bg-accent opacity-0 group-hover:opacity-100 transition-opacity" }),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-2.5 max-w-3xl",
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "flex flex-wrap items-center gap-2",
											children: [
												/* @__PURE__ */ jsx("span", {
													className: "px-2.5 py-1 rounded-md bg-accent/10 border border-accent/25 text-[11px] font-mono font-semibold text-accent uppercase tracking-wider",
													children: job.department
												}),
												/* @__PURE__ */ jsxs("span", {
													className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/5 text-xs font-mono text-neutral-300",
													children: [/* @__PURE__ */ jsx(MapPin, { className: "w-3.5 h-3.5 text-neutral-400" }), /* @__PURE__ */ jsx("span", { children: job.location_type })]
												}),
												/* @__PURE__ */ jsxs("span", {
													className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/5 text-xs font-mono text-neutral-400",
													children: [/* @__PURE__ */ jsx(Briefcase, { className: "w-3.5 h-3.5 text-neutral-400" }), /* @__PURE__ */ jsx("span", { children: job.experience_level })]
												})
											]
										}),
										/* @__PURE__ */ jsxs("h3", {
											className: "text-xl sm:text-2xl font-display font-bold text-white group-hover:text-accent transition-colors flex items-center gap-2",
											children: [/* @__PURE__ */ jsx("span", { children: job.title }), /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4 text-accent opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 hidden sm:inline-block" })]
										}),
										/* @__PURE__ */ jsx("p", {
											className: "text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans line-clamp-2",
											children: job.overview
										}),
										job.responsibilities && job.responsibilities.length > 0 && /* @__PURE__ */ jsx("div", {
											className: "hidden sm:flex flex-wrap items-center gap-2 pt-1",
											children: job.responsibilities.slice(0, 2).map((resp, idx) => /* @__PURE__ */ jsxs("span", {
												className: "inline-flex items-center gap-1 text-[11px] font-mono text-neutral-400 bg-white/[0.02] px-2 py-0.5 rounded border border-white/5",
												children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-3 h-3 text-accent/70" }), /* @__PURE__ */ jsx("span", {
													className: "truncate max-w-xs",
													children: resp
												})]
											}, idx))
										})
									]
								}),
								/* @__PURE__ */ jsx("div", {
									className: "flex items-center gap-3 shrink-0 self-start md:self-center",
									children: /* @__PURE__ */ jsxs("span", {
										className: "px-5 py-2.5 rounded-xl bg-white/[0.04] group-hover:bg-accent group-hover:text-black border border-white/10 group-hover:border-accent text-white font-display font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center gap-2 shadow-sm group-hover:shadow-[0_0_20px_rgba(245,166,35,0.35)]",
										children: [/* @__PURE__ */ jsx("span", { children: "View Role & Apply" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" })]
									})
								})
							]
						}, job.id || job.slug))
					}) : /* @__PURE__ */ jsxs("div", {
						className: "p-12 text-center rounded-2xl bg-white/[0.02] border border-white/10 space-y-3",
						children: [
							/* @__PURE__ */ jsx(Briefcase, { className: "w-8 h-8 text-neutral-500 mx-auto" }),
							/* @__PURE__ */ jsx("p", {
								className: "text-base text-white font-display font-medium",
								children: "No active openings in this department."
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-xs text-neutral-400",
								children: "Select \"All\" to view positions across the studio."
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-10 sm:mt-12 p-6 sm:p-9 rounded-3xl bg-gradient-to-r from-[#11131c] via-[#0d0f15] to-[#11131c] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5 text-center sm:text-left",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent font-mono text-xs uppercase tracking-wider font-semibold",
									children: [/* @__PURE__ */ jsx(Sparkles, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "General Applications" })]
								}),
								/* @__PURE__ */ jsx("h4", {
									className: "text-lg sm:text-xl font-display font-bold text-white",
									children: "Don't see your exact role listed?"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-xs sm:text-sm text-neutral-400 max-w-xl leading-relaxed",
									children: "We are always looking for master Photoshop retouchers, 3D CGI artists, and production engineers. Reach out to our leadership directly."
								})
							]
						}), /* @__PURE__ */ jsx(Link, {
							href: "/contact",
							className: "px-6 py-2.5 rounded-xl bg-accent text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-[#ffb834] transition-all shrink-0 shadow-lg cursor-pointer",
							children: "Submit Portfolio ↗"
						})]
					})
				]
			})]
		})
	] });
}
//#endregion
export { Index as default };
