import { t as SeoHead } from "./SeoHead-CXtfHcil.js";
import { t as PageHero } from "./PageHero-KJiKVDpm.js";
import "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Terms.tsx
function Terms() {
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(SeoHead, {
			title: "Terms of Service",
			description: "Terms and conditions governing access and commissioning engagements with CuttingEdger."
		}),
		/* @__PURE__ */ jsx(PageHero, {
			eyebrow: "LEGAL PROTOCOL",
			title: "TERMS OF",
			highlight: "SERVICE.",
			description: "General provisions governing studio deliverables, intellectual property rights, and client engagements."
		}),
		/* @__PURE__ */ jsx("section", {
			className: "py-20 bg-[#0a0b0e]",
			children: /* @__PURE__ */ jsxs("div", {
				className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-invert space-y-8 text-neutral-300 leading-relaxed",
				children: [
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
						className: "text-2xl font-display font-bold text-white mb-3",
						children: "1. Intellectual Property & Ownership"
					}), /* @__PURE__ */ jsx("p", { children: "Upon receipt of final milestone payment, full ownership of all custom design artifacts, source code, and brand marks created under an executed Master Services Agreement transfers unconditionally to the client." })] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
						className: "text-2xl font-display font-bold text-white mb-3",
						children: "2. Portfolio Showcase Rights"
					}), /* @__PURE__ */ jsx("p", { children: "CuttingEdger reserves the right to exhibit completed creative work, case studies, and performance benchmarks in our archive and industry awards, unless explicitly protected by an active non-disclosure agreement." })] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
						className: "text-2xl font-display font-bold text-white mb-3",
						children: "3. Warranty & Hypercare"
					}), /* @__PURE__ */ jsx("p", { children: "All production web flagships include a 30-day hypercare warranty against reproducible functional bugs upon DNS cutover." })] })
				]
			})
		})
	] });
}
//#endregion
export { Terms as default };
