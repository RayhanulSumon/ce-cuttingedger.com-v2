import { t as SeoHead } from "./SeoHead-jRblvokC.js";
import "react";
import { Link } from "@inertiajs/react";
import { ArrowLeft, Briefcase, Compass, Home, Layers, Sparkles, Zap } from "lucide-react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Errors/404.tsx
function NotFound() {
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(SeoHead, {
		title: "404 — Void Trajectory",
		description: "The requested coordinate does not exist in our digital perimeter.",
		noindex: true
	}), /* @__PURE__ */ jsxs("section", {
		className: "relative min-h-[90vh] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 bg-[#0a0b0e] overflow-hidden",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "absolute inset-0 opacity-[0.03] pointer-events-none",
				style: {
					backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
					backgroundSize: "40px 40px"
				}
			}),
			/* @__PURE__ */ jsx("div", { className: "absolute top-1/4 left-1/2 -translate-x-1/2 w-[38rem] h-[22rem] bg-accent/10 rounded-full blur-[180px] pointer-events-none" }),
			/* @__PURE__ */ jsx("div", { className: "absolute bottom-10 right-10 w-80 h-80 bg-[#00f5ff]/5 rounded-full blur-[160px] pointer-events-none" }),
			/* @__PURE__ */ jsxs("div", {
				className: "max-w-4xl w-full mx-auto relative z-10 text-center space-y-10",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-xs font-mono uppercase tracking-widest text-accent",
						children: [/* @__PURE__ */ jsx(Compass, {
							className: "w-3.5 h-3.5 animate-spin",
							style: { animationDuration: "8s" }
						}), /* @__PURE__ */ jsx("span", { children: "ERROR 404 // VOID TRAJECTORY" })]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "relative inline-block",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-8xl sm:text-9xl lg:text-[11rem] font-display font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-200 to-neutral-700 leading-none select-none",
									children: "404"
								}), /* @__PURE__ */ jsx("span", {
									className: "absolute -bottom-2 right-2 text-xs font-mono text-accent uppercase tracking-wider bg-black/80 px-2 py-0.5 rounded border border-accent/40",
									children: "SIGNAL_LOST"
								})]
							}),
							/* @__PURE__ */ jsx("h1", {
								className: "text-2xl sm:text-3xl font-display font-bold text-white tracking-tight",
								children: "The coordinate you requested is beyond our perimeter."
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-neutral-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed",
								children: "The URL may have moved during our platform optimization, been decommissioned, or entered as a typo. Use the radar below to resume your course."
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap items-center justify-center gap-4",
						children: [/* @__PURE__ */ jsxs(Link, {
							href: "/",
							className: "bg-accent text-black font-display font-bold text-xs uppercase tracking-wider py-3.5 px-7 rounded-full flex items-center gap-2 hover:bg-accent-hover hover:shadow-[0_0_25px_rgba(251, 183, 24, 0.35)] transition-all",
							children: [/* @__PURE__ */ jsx(Home, { className: "w-4 h-4" }), /* @__PURE__ */ jsx("span", { children: "Return to Flagship" })]
						}), /* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => window.history.back(),
							className: "border border-white/20 text-white font-mono text-xs uppercase tracking-wider py-3.5 px-6 rounded-full flex items-center gap-2 hover:border-accent hover:text-accent transition-colors",
							children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4" }), /* @__PURE__ */ jsx("span", { children: "Step Back" })]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "pt-6 border-t border-white/10 text-left",
						children: [/* @__PURE__ */ jsx("p", {
							className: "text-center font-mono text-xs uppercase tracking-widest text-neutral-500 mb-6",
							children: "// RECOMMENDED VECTOR NAVIGATION"
						}), /* @__PURE__ */ jsx("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
							children: [
								{
									title: "Production Services",
									desc: "Hand-drawn clipping paths, ghost mannequin, and jewelry retouching.",
									href: "/services",
									icon: Layers,
									badge: "Core Engine"
								},
								{
									title: "Case Studies",
									desc: "Real-world enterprise batch workflows and quality metrics.",
									href: "/case-studies",
									icon: Briefcase,
									badge: "Proof"
								},
								{
									title: "Transparent Pricing",
									desc: "Volume e-commerce rates starting from $0.35 per asset.",
									href: "/pricing",
									icon: Zap,
									badge: "SLA Tiers"
								},
								{
									title: "Free 3-Image Trial",
									desc: "Test our quality on your own RAW files with zero upfront cost.",
									href: "/contact",
									icon: Sparkles,
									badge: "Complimentary"
								}
							].map((item) => {
								const Icon = item.icon;
								return /* @__PURE__ */ jsxs(Link, {
									href: item.href,
									className: "group p-5 rounded-2xl bg-[#12141c]/80 border border-white/10 hover:border-accent/50 hover:bg-[#161924] transition-all flex flex-col justify-between",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "space-y-3",
										children: [
											/* @__PURE__ */ jsxs("div", {
												className: "flex items-center justify-between",
												children: [/* @__PURE__ */ jsx("div", {
													className: "w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-300 group-hover:text-accent group-hover:border-accent/30 transition-colors",
													children: /* @__PURE__ */ jsx(Icon, { className: "w-4 h-4" })
												}), /* @__PURE__ */ jsx("span", {
													className: "text-[10px] font-mono uppercase tracking-wider text-accent px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20",
													children: item.badge
												})]
											}),
											/* @__PURE__ */ jsx("h3", {
												className: "text-sm font-display font-bold text-white group-hover:text-accent transition-colors",
												children: item.title
											}),
											/* @__PURE__ */ jsx("p", {
												className: "text-xs text-neutral-400 line-clamp-2 leading-relaxed",
												children: item.desc
											})
										]
									}), /* @__PURE__ */ jsx("span", {
										className: "mt-4 inline-flex items-center gap-1 text-[11px] font-mono text-neutral-400 group-hover:text-white transition-colors",
										children: "Open Route →"
									})]
								}, item.href);
							})
						})]
					})
				]
			})
		]
	})] });
}
//#endregion
export { NotFound as default };
