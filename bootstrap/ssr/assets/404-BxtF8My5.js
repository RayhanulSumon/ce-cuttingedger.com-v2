import { t as SeoHead } from "./SeoHead-CXtfHcil.js";
import "react";
import { Link } from "@inertiajs/react";
import { ArrowLeft, Home } from "lucide-react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Errors/404.tsx
function NotFound() {
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(SeoHead, {
		title: "404 — Void Trajectory",
		description: "The requested coordinate does not exist in our digital perimeter."
	}), /* @__PURE__ */ jsxs("section", {
		className: "min-h-[85vh] flex items-center justify-center py-20 px-4 bg-[#0a0b0e] relative overflow-hidden",
		children: [/* @__PURE__ */ jsx("div", { className: "absolute w-96 h-96 bg-[#d4ff00]/10 rounded-full blur-[160px] pointer-events-none" }), /* @__PURE__ */ jsxs("div", {
			className: "text-center max-w-lg space-y-6 relative z-10",
			children: [
				/* @__PURE__ */ jsx("span", {
					className: "font-mono text-xs uppercase tracking-widest text-[#d4ff00] block",
					children: "[ ERROR 404 // VOID ]"
				}),
				/* @__PURE__ */ jsx("h1", {
					className: "text-7xl sm:text-9xl font-display font-black text-white tracking-tighter",
					children: "404."
				}),
				/* @__PURE__ */ jsx("h2", {
					className: "text-2xl font-display font-bold text-neutral-200",
					children: "Signal Lost Beyond Perimeter."
				}),
				/* @__PURE__ */ jsx("p", {
					className: "text-neutral-400 text-sm leading-relaxed",
					children: "The requested page has either migrated to another realm, been decommissioned, or never existed in this dimension."
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "pt-4 flex items-center justify-center gap-4",
					children: [/* @__PURE__ */ jsxs(Link, {
						href: "/",
						className: "bg-[#d4ff00] text-black font-display font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-full flex items-center gap-2 hover:bg-[#c2eb00] transition-colors",
						children: [/* @__PURE__ */ jsx(Home, { className: "w-4 h-4" }), /* @__PURE__ */ jsx("span", { children: "Return to Flagship" })]
					}), /* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => window.history.back(),
						className: "border border-white/20 text-white font-mono text-xs uppercase tracking-wider py-3.5 px-6 rounded-full flex items-center gap-2 hover:border-[#d4ff00] hover:text-[#d4ff00] transition-colors",
						children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4" }), /* @__PURE__ */ jsx("span", { children: "Step Back" })]
					})]
				})
			]
		})]
	})] });
}
//#endregion
export { NotFound as default };
