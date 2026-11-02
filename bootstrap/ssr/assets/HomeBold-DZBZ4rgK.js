import { useState } from "react";
import { Link } from "@inertiajs/react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/HomeVariants/HomeBold.tsx
var BOLD_DISCIPLINES = [
	{
		num: "01",
		name: "CLIPPING PATHS",
		detail: "HAND-DRAWN PEN TOOL / ZERO AI HALOS",
		tag: "±0.25px BEZIER",
		href: "/services/ecommerce-catalog-optimization/clipping-path-service"
	},
	{
		num: "02",
		name: "GHOST MANNEQUIN",
		detail: "3D ANATOMICAL DRAPE / NATURAL WEAVE",
		tag: "360° SYMMETRY",
		href: "/services/ghost-mannequin-service"
	},
	{
		num: "03",
		name: "JEWELRY POLISH",
		detail: "MACRO GEM CLARITY / MICRO DUST ABLATION",
		tag: "SPECULAR FINISH",
		href: "/services/ecommerce-catalog-optimization"
	},
	{
		num: "04",
		name: "COLORWAYS",
		detail: "INFINITE SKU HARMONY / PHYSICAL SWATCH ACCURACY",
		tag: "ΔE < 0.8",
		href: "/services/apparel-colorway-generation"
	}
];
function HomeBold({ clients = [] }) {
	const [emailValue, setEmailValue] = useState("");
	const [hasClaimed, setHasClaimed] = useState(false);
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-white text-[#0A0A0A] selection:bg-[#0A0A0A] selection:text-white font-sans antialiased overflow-x-hidden",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "bg-[#de4a2c] text-white py-2 px-4 text-center text-xs font-mono font-bold tracking-wider uppercase",
				children: "⚡ 12-HOUR GUARANTEED SLA • 100% NON-DESTRUCTIVE PSD • FREE 3-IMAGE TRIAL"
			}),
			/* @__PURE__ */ jsx("section", {
				className: "pt-20 pb-16 px-4 sm:px-8 max-w-7xl mx-auto border-b-4 border-[#0A0A0A]",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-5xl",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "inline-flex items-center gap-2 px-3 py-1 bg-[#0A0A0A] text-white text-xs font-mono font-bold tracking-widest uppercase mb-8",
							children: [/* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-[#de4a2c] animate-ping" }), /* @__PURE__ */ jsx("span", { children: "RADICAL PRODUCTION PROTOCOL" })]
						}),
						/* @__PURE__ */ jsxs("h1", {
							className: "text-5xl sm:text-7xl lg:text-9xl font-black tracking-tighter uppercase leading-[0.9]",
							children: [
								"WE CUT.",
								/* @__PURE__ */ jsx("br", {}),
								/* @__PURE__ */ jsx("span", {
									className: "text-[#de4a2c]",
									children: "WE RETOUCH."
								}),
								/* @__PURE__ */ jsx("br", {}),
								"WE DELIVER."
							]
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-8 text-lg sm:text-2xl font-bold max-w-2xl text-[#0A0A0A] leading-tight",
							children: "Hand-drawn vector clipping, invisible ghost mannequin, and luxury jewelry retouching for high-volume catalogs. No compromises."
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-10 flex flex-wrap items-center gap-4",
							children: [/* @__PURE__ */ jsxs("a", {
								href: "#instant-claim",
								className: "px-8 py-5 rounded-none bg-[#0A0A0A] text-white hover:bg-[#de4a2c] text-sm sm:text-base font-black uppercase tracking-wider transition-colors flex items-center gap-3 border-2 border-[#0A0A0A]",
								children: [/* @__PURE__ */ jsx("span", { children: "CLAIM 3 FREE RETOUCHES" }), /* @__PURE__ */ jsx(ArrowRight, { className: "w-5 h-5" })]
							}), /* @__PURE__ */ jsx("a", {
								href: "#disciplines",
								className: "px-8 py-5 rounded-none bg-white text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white text-sm sm:text-base font-black uppercase tracking-wider transition-colors border-2 border-[#0A0A0A]",
								children: "EXPLORE PROTOCOLS"
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ jsx("div", {
				className: "bg-[#0A0A0A] text-white py-6 overflow-hidden",
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between gap-8 max-w-7xl mx-auto px-4 font-mono font-black text-xs sm:text-sm tracking-widest uppercase",
					children: [
						/* @__PURE__ */ jsx("span", { children: "2,400,000+ RETOUCHED" }),
						/* @__PURE__ */ jsx("span", { children: "•" }),
						/* @__PURE__ */ jsx("span", { children: "99.98% ACCURACY SLA" }),
						/* @__PURE__ */ jsx("span", { children: "•" }),
						/* @__PURE__ */ jsx("span", {
							className: "text-[#de4a2c]",
							children: "ZERO HALO PEN-TOOL PATHS"
						}),
						/* @__PURE__ */ jsx("span", { children: "•" }),
						/* @__PURE__ */ jsx("span", { children: "DUAL-PASS QC" })
					]
				})
			}),
			/* @__PURE__ */ jsxs("section", {
				id: "disciplines",
				className: "py-20 px-4 sm:px-8 max-w-7xl mx-auto",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "mb-12 flex items-baseline justify-between border-b-4 border-[#0A0A0A] pb-4",
					children: [/* @__PURE__ */ jsx("h2", {
						className: "text-3xl sm:text-5xl font-black uppercase tracking-tight",
						children: "CORE DISCIPLINES"
					}), /* @__PURE__ */ jsx("span", {
						className: "text-xs font-mono font-bold text-neutral-500 uppercase",
						children: "[ SELECT TO INSPECT ]"
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "divide-y-2 divide-[#0A0A0A] border-y-2 border-[#0A0A0A]",
					children: BOLD_DISCIPLINES.map((d, i) => /* @__PURE__ */ jsxs(Link, {
						href: d.href,
						className: "group py-8 sm:py-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#0A0A0A] hover:text-white px-4 sm:px-6 transition-colors duration-150",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-start sm:items-center gap-6",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-xl sm:text-2xl font-mono font-black text-[#de4a2c] group-hover:text-white",
								children: d.num
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
								className: "text-2xl sm:text-4xl font-black tracking-tight uppercase",
								children: d.name
							}), /* @__PURE__ */ jsx("div", {
								className: "text-xs sm:text-sm font-mono font-bold text-neutral-500 group-hover:text-neutral-300 mt-1",
								children: d.detail
							})] })]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-4",
							children: [/* @__PURE__ */ jsx("span", {
								className: "px-3 py-1 text-xs font-mono font-black border-2 border-[#0A0A0A] group-hover:border-white",
								children: d.tag
							}), /* @__PURE__ */ jsx(ArrowRight, { className: "w-6 h-6 text-[#de4a2c] group-hover:text-white group-hover:translate-x-2 transition-transform" })]
						})]
					}, i))
				})]
			}),
			/* @__PURE__ */ jsx("section", {
				id: "instant-claim",
				className: "py-20 px-4 sm:px-8 max-w-7xl mx-auto",
				children: /* @__PURE__ */ jsx("div", {
					className: "p-8 sm:p-16 bg-[#0A0A0A] text-white border-4 border-[#0A0A0A]",
					children: /* @__PURE__ */ jsxs("div", {
						className: "max-w-3xl space-y-6",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "inline-flex items-center gap-2 px-3 py-1 bg-[#de4a2c] text-white text-xs font-mono font-black uppercase",
								children: /* @__PURE__ */ jsx("span", { children: "ZERO-RISK PILOT" })
							}),
							/* @__PURE__ */ jsx("h2", {
								className: "text-4xl sm:text-6xl font-black uppercase tracking-tight leading-none",
								children: "SEND 3 IMAGES. WE RETOUCH THEM FREE."
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-base sm:text-xl font-medium text-neutral-300",
								children: "No contracts. No card details. Receive fully layered PSD master files with hand-drawn paths in 4-12 hours."
							}),
							!hasClaimed ? /* @__PURE__ */ jsxs("form", {
								onSubmit: (e) => {
									e.preventDefault();
									setHasClaimed(true);
								},
								className: "flex flex-col sm:flex-row gap-3 pt-4",
								children: [/* @__PURE__ */ jsx("input", {
									type: "email",
									required: true,
									value: emailValue,
									onChange: (e) => setEmailValue(e.target.value),
									placeholder: "ENTER WORK EMAIL...",
									className: "flex-1 px-5 py-4 bg-white text-[#0A0A0A] placeholder-neutral-500 font-bold text-sm focus:outline-none rounded-none"
								}), /* @__PURE__ */ jsx("button", {
									type: "submit",
									className: "px-8 py-4 bg-[#de4a2c] hover:bg-white hover:text-[#0A0A0A] text-white font-black text-sm uppercase tracking-wider transition-colors rounded-none",
									children: "START FREE TEST"
								})]
							}) : /* @__PURE__ */ jsxs("div", {
								className: "p-6 bg-white text-[#0A0A0A] font-black text-base flex items-center gap-3",
								children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-6 h-6 text-[#de4a2c]" }), /* @__PURE__ */ jsx("span", { children: "PILOT QUEUED. CHECK YOUR INBOX FOR DIRECT UPLOAD PORTAL." })]
							})
						]
					})
				})
			})
		]
	});
}
//#endregion
export { HomeBold };
