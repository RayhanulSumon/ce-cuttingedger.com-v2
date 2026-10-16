import { t as SeoHead } from "./SeoHead-CXtfHcil.js";
import { t as PageHero } from "./PageHero-KJiKVDpm.js";
import "react";
import { Link } from "@inertiajs/react";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Services/Index.tsx
function Index({ services = [] }) {
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(SeoHead, {
			title: "Capabilities & Studio Disciplines",
			description: "Explore CuttingEdger's core offerings across Product Design, Brand Architecture, Kinetic 3D, and Full-Stack Engineering."
		}),
		/* @__PURE__ */ jsx(PageHero, {
			eyebrow: "CAPABILITIES & DISCIPLINES",
			title: "RADICAL EXECUTION ACROSS",
			highlight: "EVERY DIGITAL TOUCHPOINT.",
			description: "We partner with founding teams and enterprise innovators to craft category-defining digital assets from zero to launch."
		}),
		/* @__PURE__ */ jsx("section", {
			className: "py-24 bg-[#0a0b0e]",
			children: /* @__PURE__ */ jsx("div", {
				className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16",
				children: services.map((service, index) => /* @__PURE__ */ jsx("article", {
					className: "p-8 sm:p-14 rounded-3xl bg-[#12141c] border border-white/10 hover:border-[#d4ff00]/40 transition-colors group",
					children: /* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 lg:grid-cols-12 gap-8 items-start",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "lg:col-span-5 space-y-4",
							children: [
								/* @__PURE__ */ jsxs("span", {
									className: "font-mono text-xs uppercase tracking-widest text-[#d4ff00]",
									children: [
										"[ DISCIPLINE 0",
										index + 1,
										" ]"
									]
								}),
								/* @__PURE__ */ jsx("h2", {
									className: "text-3xl sm:text-5xl font-display font-extrabold text-white leading-tight group-hover:text-[#d4ff00] transition-colors",
									children: /* @__PURE__ */ jsx(Link, {
										href: `/services/${service.slug}`,
										children: service.title
									})
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-neutral-400 text-base leading-relaxed",
									children: service.description
								}),
								/* @__PURE__ */ jsx("div", {
									className: "pt-4",
									children: /* @__PURE__ */ jsxs(Link, {
										href: `/services/${service.slug}`,
										className: "inline-flex items-center gap-2 font-display font-bold text-xs uppercase tracking-widest text-black bg-[#d4ff00] hover:bg-[#c2eb00] px-6 py-3.5 rounded-full transition-colors",
										children: [/* @__PURE__ */ jsx("span", { children: "Explore Discipline Details" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4" })]
									})
								})
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "lg:col-span-7 bg-white/[0.02] border border-white/5 rounded-2xl p-6 sm:p-8 space-y-6",
							children: [
								/* @__PURE__ */ jsx("h3", {
									className: "font-display font-bold text-lg text-white",
									children: "Key Focus & Deliverables"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
									children: service.features?.map((feat, i) => /* @__PURE__ */ jsxs("div", {
										className: "flex items-start gap-2.5 text-sm text-neutral-300",
										children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4 text-[#d4ff00] shrink-0 mt-0.5" }), /* @__PURE__ */ jsx("span", { children: feat })]
									}, i))
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "pt-4 border-t border-white/10",
									children: [/* @__PURE__ */ jsx("span", {
										className: "font-mono text-xs text-neutral-500 uppercase block mb-3",
										children: "Handed Over Artifacts:"
									}), /* @__PURE__ */ jsx("div", {
										className: "flex flex-wrap gap-2",
										children: service.deliverables?.map((deliv, i) => /* @__PURE__ */ jsx("span", {
											className: "text-xs font-mono text-neutral-300 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10",
											children: deliv
										}, i))
									})]
								})
							]
						})]
					})
				}, service.id || service.slug))
			})
		})
	] });
}
//#endregion
export { Index as default };
