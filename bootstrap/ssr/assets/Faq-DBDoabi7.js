import { t as SeoHead } from "./SeoHead-CXtfHcil.js";
import { t as PageHero } from "./PageHero-KJiKVDpm.js";
import { t as Accordion } from "./Accordion-Eja8QM_Z.js";
import { useState } from "react";
import { Link } from "@inertiajs/react";
import { ArrowUpRight, HelpCircle } from "lucide-react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Faq.tsx
function FaqPage({ faqs = [], categories = [] }) {
	const [selectedCat, setSelectedCat] = useState("All");
	const filteredFaqs = selectedCat === "All" ? faqs : faqs.filter((f) => f.category === selectedCat);
	const allCategories = ["All", ...categories];
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(SeoHead, {
			title: "Frequently Asked Questions",
			description: "Everything you need to know about partnering with CuttingEdger, our process, technical stack, and engagement models."
		}),
		/* @__PURE__ */ jsx(PageHero, {
			eyebrow: "ANSWERS & PROTOCOLS",
			title: "COMMON QUESTIONS,",
			highlight: "UNFILTERED CLARITY.",
			description: "Everything you need to know about our design philosophy, development velocity, contracts, and communication protocols."
		}),
		/* @__PURE__ */ jsx("section", {
			className: "py-8 bg-[#0c0d12] border-b border-white/10 sticky top-[72px] z-30 backdrop-blur-xl bg-[#0c0d12]/90",
			children: /* @__PURE__ */ jsx("div", {
				className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8",
				children: /* @__PURE__ */ jsx("div", {
					className: "flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none",
					children: allCategories.map((cat) => /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => setSelectedCat(cat),
						className: `px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${selectedCat === cat ? "bg-[#d4ff00] text-black font-bold shadow-[0_0_15px_rgba(212,255,0,0.3)]" : "bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/5"}`,
						children: cat
					}, cat))
				})
			})
		}),
		/* @__PURE__ */ jsx("section", {
			className: "py-20 bg-[#0a0b0e]",
			children: /* @__PURE__ */ jsxs("div", {
				className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8",
				children: [/* @__PURE__ */ jsx(Accordion, { items: filteredFaqs.map((f) => ({
					id: f.id,
					question: f.question,
					answer: f.answer,
					category: f.category
				})) }), /* @__PURE__ */ jsxs("div", {
					className: "mt-20 p-8 sm:p-12 rounded-3xl bg-[#12141c] border border-white/10 text-center space-y-4",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "w-12 h-12 rounded-full bg-[#d4ff00]/10 border border-[#d4ff00]/40 text-[#d4ff00] flex items-center justify-center mx-auto",
							children: /* @__PURE__ */ jsx(HelpCircle, { className: "w-6 h-6" })
						}),
						/* @__PURE__ */ jsx("h3", {
							className: "text-2xl font-display font-bold text-white",
							children: "Still have an unanswered question?"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-sm text-neutral-400 max-w-md mx-auto",
							children: "We pride ourselves on transparent communication. Speak directly with a principal partner today."
						}),
						/* @__PURE__ */ jsx("div", {
							className: "pt-2",
							children: /* @__PURE__ */ jsxs(Link, {
								href: "/contact",
								className: "inline-flex items-center gap-2 font-display font-bold text-xs uppercase tracking-widest text-black bg-[#d4ff00] hover:bg-[#c2eb00] px-6 py-3.5 rounded-full transition-colors",
								children: [/* @__PURE__ */ jsx("span", { children: "Direct Inquiry Channel" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4" })]
							})
						})
					]
				})]
			})
		})
	] });
}
//#endregion
export { FaqPage as default };
