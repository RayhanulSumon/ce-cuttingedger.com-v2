import { t as SeoHead } from "./SeoHead-CXtfHcil.js";
import { t as PageHero } from "./PageHero-KJiKVDpm.js";
import "react";
import { Link } from "@inertiajs/react";
import { ArrowUpRight, MapPin } from "lucide-react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Careers/Index.tsx
function Index({ openings = [] }) {
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(SeoHead, {
			title: "Careers & Open Positions",
			description: "Join CuttingEdger. We are looking for relentless creative engineers, 3D spatial designers, and brand architects."
		}),
		/* @__PURE__ */ jsx(PageHero, {
			eyebrow: "CAREERS & OPPORTUNITIES",
			title: "BUILD WITH THE MOST",
			highlight: "AUDACIOUS CREATIVE SQUAD.",
			description: "We work on high-stakes digital flagships for category-defining brands. No micromanagement, no pointless meetings, purely craft and velocity."
		}),
		/* @__PURE__ */ jsx("section", {
			className: "py-24 bg-[#0a0b0e]",
			children: /* @__PURE__ */ jsxs("div", {
				className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between mb-12 pb-6 border-b border-white/10",
					children: [/* @__PURE__ */ jsxs("span", {
						className: "font-mono text-xs uppercase tracking-widest text-[#d4ff00]",
						children: [
							"[ ACTIVE VACANCIES (",
							openings.length,
							") ]"
						]
					}), /* @__PURE__ */ jsx("span", {
						className: "font-mono text-xs text-neutral-400",
						children: "100% Remote / Global"
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "space-y-6",
					children: openings.map((job) => /* @__PURE__ */ jsxs(Link, {
						href: `/careers/${job.slug}`,
						className: "group p-8 sm:p-10 rounded-3xl bg-[#12141c] border border-white/10 hover:border-[#d4ff00]/50 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-3",
									children: [
										/* @__PURE__ */ jsx("span", {
											className: "px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#d4ff00]",
											children: job.department
										}),
										/* @__PURE__ */ jsxs("span", {
											className: "text-xs font-mono text-neutral-400 flex items-center gap-1",
											children: [/* @__PURE__ */ jsx(MapPin, { className: "w-3.5 h-3.5" }), job.location_type]
										}),
										/* @__PURE__ */ jsxs("span", {
											className: "text-xs font-mono text-neutral-500",
											children: [
												"[",
												job.experience_level,
												"]"
											]
										})
									]
								}),
								/* @__PURE__ */ jsx("h3", {
									className: "text-2xl sm:text-3xl font-display font-bold text-white group-hover:text-[#d4ff00] transition-colors",
									children: job.title
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-sm text-neutral-400 max-w-2xl line-clamp-2",
									children: job.overview
								})
							]
						}), /* @__PURE__ */ jsx("div", {
							className: "flex items-center gap-3 shrink-0",
							children: /* @__PURE__ */ jsxs("span", {
								className: "font-display font-bold text-xs uppercase tracking-wider text-black bg-[#d4ff00] group-hover:bg-[#c2eb00] px-5 py-3 rounded-full transition-colors flex items-center gap-1.5",
								children: [/* @__PURE__ */ jsx("span", { children: "View Role & Apply" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4" })]
							})
						})]
					}, job.id || job.slug))
				})]
			})
		})
	] });
}
//#endregion
export { Index as default };
