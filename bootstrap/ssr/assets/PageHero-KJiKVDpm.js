import "react";
import { Link } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Components/Common/PageHero.tsx
function PageHero({ eyebrow, title, highlight, description, backUrl, backLabel }) {
	return /* @__PURE__ */ jsxs("section", {
		className: "relative pt-36 pb-20 bg-[#0a0b0e] border-b border-white/10 overflow-hidden",
		children: [/* @__PURE__ */ jsx("div", { className: "absolute top-1/4 left-1/4 w-96 h-96 bg-[#d4ff00]/10 rounded-full blur-[140px] pointer-events-none" }), /* @__PURE__ */ jsxs("div", {
			className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10",
			children: [
				backUrl && /* @__PURE__ */ jsx("div", {
					className: "mb-8",
					children: /* @__PURE__ */ jsxs(Link, {
						href: backUrl,
						className: "inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-400 hover:text-[#d4ff00] transition-colors",
						children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4" }), /* @__PURE__ */ jsx("span", { children: backLabel || "Back" })]
					})
				}),
				/* @__PURE__ */ jsxs("span", {
					className: "font-mono text-xs uppercase tracking-widest text-[#d4ff00] block mb-4",
					children: [
						"[ ",
						eyebrow,
						" ]"
					]
				}),
				/* @__PURE__ */ jsxs("h1", {
					className: "text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold text-white tracking-tight leading-[1.05] max-w-4xl",
					children: [
						title,
						" ",
						highlight && /* @__PURE__ */ jsx("span", {
							className: "text-[#d4ff00] underline decoration-[#d4ff00]/40 underline-offset-8",
							children: highlight
						})
					]
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-6 text-lg sm:text-xl text-neutral-400 max-w-2xl font-normal leading-relaxed",
					children: description
				})
			]
		})]
	});
}
//#endregion
export { PageHero as t };
