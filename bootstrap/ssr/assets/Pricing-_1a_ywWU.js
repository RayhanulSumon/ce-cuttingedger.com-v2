import { t as SeoHead } from "./SeoHead-CXtfHcil.js";
import { t as PageHero } from "./PageHero-KJiKVDpm.js";
import { t as Accordion } from "./Accordion-Eja8QM_Z.js";
import "react";
import { Link } from "@inertiajs/react";
import { ArrowUpRight, Check, Sparkles } from "lucide-react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Pricing.tsx
function Pricing({ plans = [], faqs = [] }) {
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(SeoHead, {
			title: "Engagement Models & Investment Pricing",
			description: "Transparent, value-aligned pricing for design sprints, full flagship builds, and ongoing studio retainers."
		}),
		/* @__PURE__ */ jsx(PageHero, {
			eyebrow: "TRANSPARENT VALUE",
			title: "PREDICTABLE INVESTMENT.",
			highlight: "UNMATCHED RETURN.",
			description: "No vague estimates or hidden line items. We engage through focused sprints and milestone-anchored flagships designed for maximum ROI."
		}),
		/* @__PURE__ */ jsx("section", {
			className: "py-24 bg-[#0a0b0e]",
			children: /* @__PURE__ */ jsx("div", {
				className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
				children: /* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch",
					children: plans.map((plan) => /* @__PURE__ */ jsxs("div", {
						className: `relative rounded-3xl p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 ${plan.is_popular ? "bg-[#141622] border-2 border-[#d4ff00] shadow-[0_0_35px_rgba(212,255,0,0.15)] md:-translate-y-4" : "bg-[#12141c] border border-white/10 hover:border-white/20"}`,
						children: [
							plan.is_popular && /* @__PURE__ */ jsxs("div", {
								className: "absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-[#d4ff00] text-black font-display font-bold text-[11px] uppercase tracking-widest px-4 py-1 rounded-full flex items-center gap-1 shadow-md",
								children: [/* @__PURE__ */ jsx(Sparkles, { className: "w-3 h-3" }), /* @__PURE__ */ jsx("span", { children: "Most Popular Engagement" })]
							}),
							/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("div", {
									className: "flex items-center justify-between mb-4",
									children: /* @__PURE__ */ jsx("h3", {
										className: "font-display font-extrabold text-2xl text-white",
										children: plan.name
									})
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-xs text-neutral-400 font-mono mb-6",
									children: plan.headline
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "pb-8 mb-8 border-b border-white/10 flex items-baseline gap-2",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-4xl sm:text-5xl font-display font-black text-white",
										children: plan.price
									}), /* @__PURE__ */ jsx("span", {
										className: "text-xs font-mono text-neutral-400",
										children: plan.billing_cycle
									})]
								}),
								/* @__PURE__ */ jsx("ul", {
									className: "space-y-3.5 mb-8",
									children: plan.features?.map((feat, i) => /* @__PURE__ */ jsxs("li", {
										className: "flex items-start gap-3 text-sm text-neutral-300",
										children: [/* @__PURE__ */ jsx("div", {
											className: "w-4 h-4 rounded-full bg-[#d4ff00]/20 flex items-center justify-center shrink-0 mt-0.5",
											children: /* @__PURE__ */ jsx(Check, { className: "w-3 h-3 text-[#d4ff00]" })
										}), /* @__PURE__ */ jsx("span", { children: feat })]
									}, i))
								})
							] }),
							/* @__PURE__ */ jsxs(Link, {
								href: "/contact",
								className: `w-full py-4 px-6 rounded-2xl font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${plan.is_popular ? "bg-[#d4ff00] text-black hover:bg-[#c2eb00] shadow-[0_0_20px_rgba(212,255,0,0.3)]" : "bg-white/10 text-white hover:bg-white/20"}`,
								children: [/* @__PURE__ */ jsx("span", { children: plan.cta_text }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4" })]
							})
						]
					}, plan.id || plan.slug))
				})
			})
		}),
		faqs.length > 0 && /* @__PURE__ */ jsx("section", {
			className: "py-24 bg-[#0c0d12] border-t border-white/10",
			children: /* @__PURE__ */ jsxs("div", {
				className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "text-center mb-16 space-y-3",
					children: [/* @__PURE__ */ jsx("span", {
						className: "font-mono text-xs uppercase tracking-widest text-[#d4ff00]",
						children: "[ FINANCIAL & SCOPE QUESTIONS ]"
					}), /* @__PURE__ */ jsx("h2", {
						className: "text-3xl sm:text-4xl font-display font-bold text-white",
						children: "Pricing Clarity."
					})]
				}), /* @__PURE__ */ jsx(Accordion, { items: faqs.map((f) => ({
					id: f.id,
					question: f.question,
					answer: f.answer
				})) })]
			})
		})
	] });
}
//#endregion
export { Pricing as default };
