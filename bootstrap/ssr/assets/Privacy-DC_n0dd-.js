import { t as SeoHead } from "./SeoHead-CXtfHcil.js";
import { t as PageHero } from "./PageHero-KJiKVDpm.js";
import "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Privacy.tsx
function Privacy() {
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(SeoHead, {
			title: "Privacy Policy",
			description: "CuttingEdger commitment to user privacy, data security, and zero unauthorized telemetry."
		}),
		/* @__PURE__ */ jsx(PageHero, {
			eyebrow: "LEGAL PROTOCOL",
			title: "PRIVACY",
			highlight: "POLICY.",
			description: "We respect your data. We collect only what is strictly required to deliver high-velocity digital craft."
		}),
		/* @__PURE__ */ jsx("section", {
			className: "py-20 bg-[#0a0b0e]",
			children: /* @__PURE__ */ jsxs("div", {
				className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-invert space-y-8 text-neutral-300 leading-relaxed",
				children: [
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
						className: "text-2xl font-display font-bold text-white mb-3",
						children: "1. Information Collection"
					}), /* @__PURE__ */ jsx("p", { children: "When you submit a contact inquiry or subscribe to our Dispatch, we collect your name, email, and provided company details. We do not sell, rent, or trade your personal information to third parties." })] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
						className: "text-2xl font-display font-bold text-white mb-3",
						children: "2. Telemetry and Analytics"
					}), /* @__PURE__ */ jsx("p", { children: "We use minimal, privacy-friendly telemetry to monitor aggregate site performance and server errors. We do not use cross-site tracking cookies or invasive third-party surveillance scripts." })] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
						className: "text-2xl font-display font-bold text-white mb-3",
						children: "3. Data Retention & Rights"
					}), /* @__PURE__ */ jsx("p", { children: "You may request the deletion of your contact records or unsubscribe from the studio newsletter at any time by sending a notice to privacy@cuttingedger.com." })] })
				]
			})
		})
	] });
}
//#endregion
export { Privacy as default };
