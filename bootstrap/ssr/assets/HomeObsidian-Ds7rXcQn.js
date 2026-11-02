import "react";
import { Head, Link } from "@inertiajs/react";
import { ArrowRight, Flame } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/HomeVariants/HomeObsidian.tsx
function HomeObsidian({ clients = [] }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-[#050608] text-[#E0E2EC] selection:bg-[#de4a2c] selection:text-white font-sans antialiased overflow-x-hidden",
		children: [/* @__PURE__ */ jsx(Head, { children: /* @__PURE__ */ jsx("title", { children: "CuttingEdger Obsidian — Stealth Post-Production Craft" }) }), /* @__PURE__ */ jsxs("section", {
			className: "relative pt-36 pb-24 px-4 sm:px-8 max-w-7xl mx-auto",
			children: [/* @__PURE__ */ jsx("div", { className: "absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#de4a2c]/15 blur-[160px] rounded-full pointer-events-none" }), /* @__PURE__ */ jsxs("div", {
				className: "text-center max-w-3xl mx-auto",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-xs font-mono uppercase tracking-widest text-[#de4a2c] mb-6",
						children: [/* @__PURE__ */ jsx(Flame, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Obsidian Edition 05 // #DE4A2C Glow" })]
					}),
					/* @__PURE__ */ jsxs("h1", {
						className: "text-5xl sm:text-7xl font-extrabold tracking-tight text-white leading-tight",
						children: [
							"Stealth Precision.",
							" ",
							/* @__PURE__ */ jsx("span", {
								className: "text-transparent bg-clip-text bg-gradient-to-r from-[#de4a2c] via-[#ff7859] to-white",
								children: "Velvety Obsidian."
							})
						]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-5 text-neutral-400 text-base sm:text-lg max-w-2xl mx-auto",
						children: "Deep-black backdrop contrast, specular highlight carving, and invisible vector isolation crafted for iconic luxury maisons."
					}),
					/* @__PURE__ */ jsx("div", {
						className: "mt-10 flex items-center justify-center gap-4",
						children: /* @__PURE__ */ jsxs(Link, {
							href: "/services/ecommerce-catalog-optimization/clipping-path-service?v=5",
							className: "px-8 py-4 rounded-full bg-[#de4a2c] hover:bg-[#c2381c] text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-[0_0_30px_rgba(222,74,44,0.4)] flex items-center gap-2 cursor-pointer",
							children: [/* @__PURE__ */ jsx("span", { children: "Explore Obsidian Layout" }), /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })]
						})
					})
				]
			})]
		})]
	});
}
//#endregion
export { HomeObsidian };
