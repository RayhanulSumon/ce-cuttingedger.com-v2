import { t as SeoHead } from "./SeoHead-CXtfHcil.js";
import { t as PageHero } from "./PageHero-KJiKVDpm.js";
import "react";
import { Link } from "@inertiajs/react";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Services/Show.tsx
function Show({ service, otherServices = [], relatedProjects = [] }) {
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(SeoHead, {
			title: `${service.title} — Capabilities`,
			description: service.subtitle
		}),
		/* @__PURE__ */ jsx(PageHero, {
			eyebrow: `CAPABILITIES // ${service.marquee_label}`,
			title: service.title,
			description: service.subtitle,
			backUrl: "/services",
			backLabel: "All Disciplines"
		}),
		/* @__PURE__ */ jsx("section", {
			className: "py-24 bg-[#0c0d12] border-b border-white/10",
			children: /* @__PURE__ */ jsx("div", {
				className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
				children: /* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 lg:grid-cols-12 gap-12",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "lg:col-span-7 space-y-6",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "font-mono text-xs uppercase tracking-widest text-[#d4ff00]",
								children: "[ DISCIPLINE OVERVIEW ]"
							}),
							/* @__PURE__ */ jsx("h2", {
								className: "text-3xl sm:text-4xl font-display font-bold text-white",
								children: "Built for market leaders who demand precision."
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-neutral-300 text-lg leading-relaxed",
								children: service.description
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "pt-6 space-y-4",
								children: [/* @__PURE__ */ jsx("h3", {
									className: "font-display font-bold text-xl text-white",
									children: "Strategic Pillars & Principles"
								}), /* @__PURE__ */ jsx("div", {
									className: "space-y-3",
									children: service.features?.map((feat, i) => /* @__PURE__ */ jsxs("div", {
										className: "flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5",
										children: [/* @__PURE__ */ jsx("div", {
											className: "w-5 h-5 rounded-full bg-[#d4ff00]/10 border border-[#d4ff00] text-black flex items-center justify-center shrink-0 mt-0.5",
											children: /* @__PURE__ */ jsx(Check, { className: "w-3 h-3 text-[#d4ff00]" })
										}), /* @__PURE__ */ jsx("span", {
											className: "text-neutral-200 text-sm font-medium",
											children: feat
										})]
									}, i))
								})]
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "lg:col-span-5 space-y-8",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "p-8 rounded-3xl bg-[#12141c] border border-white/10 space-y-6",
							children: [
								/* @__PURE__ */ jsx("h3", {
									className: "font-display font-bold text-xl text-white",
									children: "What We Hand Over"
								}),
								/* @__PURE__ */ jsx("ul", {
									className: "space-y-3",
									children: service.deliverables?.map((deliv, i) => /* @__PURE__ */ jsxs("li", {
										className: "flex items-center gap-2 text-sm text-neutral-300 font-mono",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-[#d4ff00]",
											children: "→"
										}), /* @__PURE__ */ jsx("span", { children: deliv })]
									}, i))
								}),
								/* @__PURE__ */ jsx("div", {
									className: "pt-6 border-t border-white/10",
									children: /* @__PURE__ */ jsxs(Link, {
										href: "/contact",
										className: "w-full bg-[#d4ff00] text-black font-display font-bold text-sm tracking-wider uppercase py-4 px-6 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#c2eb00] transition-colors",
										children: [/* @__PURE__ */ jsx("span", { children: "Commission This Discipline" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4" })]
									})
								})
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "p-6 rounded-2xl bg-white/[0.02] border border-white/5",
							children: [/* @__PURE__ */ jsx("span", {
								className: "font-mono text-xs uppercase tracking-widest text-neutral-400 block mb-3",
								children: "Explore Other Disciplines"
							}), /* @__PURE__ */ jsx("div", {
								className: "space-y-2",
								children: otherServices.map((s) => /* @__PURE__ */ jsxs(Link, {
									href: `/services/${s.slug}`,
									className: "flex items-center justify-between p-2.5 rounded-lg hover:bg-white/5 text-sm text-neutral-300 hover:text-[#d4ff00] transition-colors",
									children: [/* @__PURE__ */ jsx("span", { children: s.title }), /* @__PURE__ */ jsx(ArrowRight, { className: "w-3.5 h-3.5" })]
								}, s.id))
							})]
						})]
					})]
				})
			})
		})
	] });
}
//#endregion
export { Show as default };
