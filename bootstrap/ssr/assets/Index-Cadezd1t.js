import { t as SeoHead } from "./SeoHead-jRblvokC.js";
import { t as PageHero } from "./PageHero-BKafzHM7.js";
import "react";
import { Link } from "@inertiajs/react";
import { ArrowRight, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Services/Index.tsx
function Index({ pillars = [], services = [] }) {
	const displayPillars = pillars.length > 0 ? pillars : services.filter((s) => !s.parent_id);
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(SeoHead, {
			title: "Service Pillars & Visual Production Disciplines",
			description: "Explore Cutting Edger's core offerings: E-Commerce Catalog Optimization, Color Standardization, White-Label Agency Extension, and Virtual 3D CGI Production.",
			breadcrumbs: [{
				name: "Home",
				url: "/"
			}, {
				name: "Services",
				url: "/services"
			}]
		}),
		/* @__PURE__ */ jsx(PageHero, {
			eyebrow: "CAPABILITIES & SERVICE PILLARS",
			title: "AI-DRIVEN VISUAL PERFORMANCE",
			highlight: "AT ENTERPRISE SCALE.",
			description: "Turn raw studio photography and CAD engineering blueprints into marketplace-converting visual assets across hundreds of thousands of SKUs."
		}),
		/* @__PURE__ */ jsx("section", {
			className: "py-24 bg-[#0a0b0e]",
			children: /* @__PURE__ */ jsx("div", {
				className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20",
				children: displayPillars.map((pillar, index) => {
					const pillarHref = `/services/${pillar.slug}`;
					return /* @__PURE__ */ jsx("article", {
						className: "p-8 sm:p-14 rounded-3xl bg-[#12141c] border border-white/10 hover:border-accent/40 transition-all group shadow-2xl relative overflow-hidden",
						children: /* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-1 lg:grid-cols-12 gap-10 items-start",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "lg:col-span-6 space-y-5",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ jsxs("span", {
											className: "font-mono text-xs uppercase tracking-widest text-accent font-bold",
											children: [
												"[ PILLAR 0",
												index + 1,
												" ]"
											]
										}), pillar.children && pillar.children.length > 0 && /* @__PURE__ */ jsxs("span", {
											className: "text-[11px] font-mono text-neutral-400 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10",
											children: [pillar.children.length, " Specialized Sub-Services"]
										})]
									}),
									/* @__PURE__ */ jsx("h2", {
										className: "text-3xl sm:text-4xl font-display font-extrabold text-white leading-tight group-hover:text-accent transition-colors",
										children: /* @__PURE__ */ jsx(Link, {
											href: pillarHref,
											children: pillar.title
										})
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-neutral-300 text-base leading-relaxed",
										children: pillar.description
									}),
									pillar.children && pillar.children.length > 0 && /* @__PURE__ */ jsxs("div", {
										className: "pt-2 space-y-2.5",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-xs font-mono uppercase tracking-wider text-neutral-400 block font-bold",
											children: "Specialized Sub-Page Disciplines:"
										}), /* @__PURE__ */ jsx("div", {
											className: "flex flex-wrap gap-2",
											children: pillar.children.map((child) => /* @__PURE__ */ jsxs(Link, {
												href: `/services/${pillar.slug}/${child.slug}`,
												className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-accent hover:text-black border border-white/10 text-xs font-mono transition-all text-neutral-200",
												children: [/* @__PURE__ */ jsx("span", { children: child.title }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-3 h-3" })]
											}, child.id || child.slug))
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "pt-4 flex items-center gap-4",
										children: [/* @__PURE__ */ jsxs(Link, {
											href: pillarHref,
											className: "inline-flex items-center gap-2 font-display font-bold text-xs uppercase tracking-widest text-black bg-accent hover:bg-accent-hover px-6 py-3.5 rounded-full transition-colors shadow-lg",
											children: [/* @__PURE__ */ jsx("span", { children: "Explore Pillar Architecture" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4" })]
										}), /* @__PURE__ */ jsxs(Link, {
											href: "/#free-trial",
											className: "inline-flex items-center gap-2 font-mono text-xs text-neutral-400 hover:text-white transition-colors",
											children: [/* @__PURE__ */ jsx("span", { children: "Test 3 Free Assets" }), /* @__PURE__ */ jsx(ArrowRight, { className: "w-3.5 h-3.5" })]
										})]
									})
								]
							}), /* @__PURE__ */ jsxs("div", {
								className: "lg:col-span-6 bg-white/[0.02] border border-white/5 rounded-2xl p-6 sm:p-8 space-y-6",
								children: [
									/* @__PURE__ */ jsx("h3", {
										className: "font-display font-bold text-lg text-white",
										children: "Strategic Capabilities & SLA Standards"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "space-y-3",
										children: pillar.features?.map((feat, i) => /* @__PURE__ */ jsxs("div", {
											className: "flex items-start gap-2.5 text-sm text-neutral-300",
											children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4 text-accent shrink-0 mt-0.5" }), /* @__PURE__ */ jsx("span", { children: feat })]
										}, i))
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "pt-4 border-t border-white/10",
										children: [/* @__PURE__ */ jsx("span", {
											className: "font-mono text-xs text-neutral-400 uppercase block mb-3 font-bold",
											children: "Standard Handover Deliverables:"
										}), /* @__PURE__ */ jsx("div", {
											className: "flex flex-wrap gap-2",
											children: pillar.deliverables?.map((deliv, i) => /* @__PURE__ */ jsx("span", {
												className: "text-xs font-mono text-neutral-300 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10",
												children: deliv
											}, i))
										})]
									})
								]
							})]
						})
					}, pillar.id || pillar.slug);
				})
			})
		})
	] });
}
//#endregion
export { Index as default };
