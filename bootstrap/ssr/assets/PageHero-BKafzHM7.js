import "react";
import { Link } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Components/Common/PageHero.tsx
function PageHero({ eyebrow, title, highlight, description, backUrl, backLabel, containerMaxWidth, compact = false, children }) {
	return /* @__PURE__ */ jsxs("section", {
		className: `relative ${compact ? "pt-28 pb-10 sm:pt-32 sm:pb-12" : "pt-36 pb-20"} bg-[#0a0b0e] border-b border-white/10 overflow-hidden`,
		children: [/* @__PURE__ */ jsx("div", { className: "absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[140px] pointer-events-none" }), /* @__PURE__ */ jsxs("div", {
			className: `${containerMaxWidth || "max-w-7xl"} mx-auto px-4 sm:px-6 lg:px-8 relative z-10`,
			children: [
				backUrl && /* @__PURE__ */ jsx("div", {
					className: "mb-6",
					children: /* @__PURE__ */ jsxs(Link, {
						href: backUrl,
						className: "inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-400 hover:text-accent transition-colors",
						children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4" }), /* @__PURE__ */ jsx("span", { children: backLabel || "Back" })]
					})
				}),
				/* @__PURE__ */ jsxs("span", {
					className: "font-mono text-xs uppercase tracking-widest text-accent block mb-3",
					children: [
						"[ ",
						eyebrow,
						" ]"
					]
				}),
				/* @__PURE__ */ jsxs("h1", {
					className: `${compact ? "text-3xl sm:text-4xl lg:text-[44px]" : "text-4xl sm:text-6xl lg:text-7xl"} font-display font-extrabold text-white tracking-tight leading-[1.12] max-w-4xl`,
					children: [
						title,
						" ",
						highlight && /* @__PURE__ */ jsx("span", {
							className: "text-accent",
							children: highlight
						})
					]
				}),
				/* @__PURE__ */ jsx("p", {
					className: `${compact ? "mt-3 sm:mt-4 text-sm sm:text-base" : "mt-6 text-lg sm:text-xl"} text-neutral-400 max-w-2xl font-normal leading-relaxed`,
					children: description
				}),
				children && /* @__PURE__ */ jsx("div", {
					className: "mt-6",
					children
				})
			]
		})]
	});
}
//#endregion
export { PageHero as t };
