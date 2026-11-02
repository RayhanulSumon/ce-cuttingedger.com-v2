import { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { ArrowRight, Terminal } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/HomeVariants/HomeTechnical.tsx
function HomeTechnical({ clients = [] }) {
	const [selectedSpec, setSelectedSpec] = useState("tolerance");
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-[#08090C] text-[#E2E8F0] selection:bg-[#de4a2c] selection:text-white font-mono antialiased overflow-x-hidden",
		children: [/* @__PURE__ */ jsx(Head, { children: /* @__PURE__ */ jsx("title", { children: "CuttingEdger Tech — High-Throughput Post-Production Pipeline" }) }), /* @__PURE__ */ jsxs("div", {
			className: "pt-28 pb-16 px-4 sm:px-8 max-w-7xl mx-auto",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-[#de4a2c]/50 text-xs text-[#de4a2c] mb-6",
					children: [/* @__PURE__ */ jsx(Terminal, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "PRODUCTION TELEMETRY HUD // BUILD 2026.11" })]
				}),
				/* @__PURE__ */ jsxs("h1", {
					className: "text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight font-sans",
					children: [
						"Algorithmic Routing.",
						" ",
						/* @__PURE__ */ jsx("span", {
							className: "text-transparent bg-clip-text bg-gradient-to-r from-[#de4a2c] via-[#ff6b4a] to-white",
							children: "Human Precision."
						})
					]
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-4 text-neutral-400 font-sans text-base sm:text-lg max-w-2xl",
					children: "Zero-tolerance vector path precision, automated metadata injection, and guaranteed turnaround SLAs via our distributed production clusters."
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "p-4 rounded-xl bg-white/[0.03] border border-white/10",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "text-[10px] text-neutral-400 uppercase",
									children: "Vector Path Tolerance"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "text-2xl font-bold text-[#de4a2c] mt-1",
									children: "±0.25 px"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "text-[10px] text-neutral-500 mt-0.5",
									children: "300% zoom verification"
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "p-4 rounded-xl bg-white/[0.03] border border-white/10",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "text-[10px] text-neutral-400 uppercase",
									children: "Throughput Capacity"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "text-2xl font-bold text-white mt-1",
									children: "20,000+"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "text-[10px] text-neutral-500 mt-0.5",
									children: "Images / 24-hr cycle"
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "p-4 rounded-xl bg-white/[0.03] border border-white/10",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "text-[10px] text-neutral-400 uppercase",
									children: "Color Drift Threshold"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "text-2xl font-bold text-emerald-400 mt-1",
									children: "ΔE < 0.8"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "text-[10px] text-neutral-500 mt-0.5",
									children: "X-Rite Pantone standard"
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "p-4 rounded-xl bg-white/[0.03] border border-white/10",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "text-[10px] text-neutral-400 uppercase",
									children: "SLA Adherence Rate"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "text-2xl font-bold text-[#de4a2c] mt-1",
									children: "99.98%"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "text-[10px] text-neutral-500 mt-0.5",
									children: "Enterprise contract backed"
								})
							]
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-12 p-6 rounded-2xl bg-[#0F1117] border border-white/10 shadow-2xl",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between pb-4 border-b border-white/10 text-xs",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-[#de4a2c] animate-ping" }), /* @__PURE__ */ jsx("span", {
								className: "font-bold text-white font-sans",
								children: "CLUSTER STATUS: OPERATIONAL"
							})]
						}), /* @__PURE__ */ jsxs(Link, {
							href: "/services/ecommerce-catalog-optimization/clipping-path-service?v=3",
							className: "text-[#de4a2c] hover:underline flex items-center gap-1 font-bold",
							children: [/* @__PURE__ */ jsx("span", { children: "View Technical Single Page (Variant 03)" }), /* @__PURE__ */ jsx(ArrowRight, { className: "w-3.5 h-3.5" })]
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "py-8 grid grid-cols-1 md:grid-cols-3 gap-6 font-sans",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "p-5 rounded-xl bg-white/[0.02] border border-white/10",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "text-xs font-mono text-[#de4a2c] font-bold",
										children: "STAGE 01 // INGESTION"
									}),
									/* @__PURE__ */ jsx("h4", {
										className: "text-base font-bold text-white mt-1",
										children: "Asset De-Bayering & Audit"
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-xs text-neutral-400 mt-2",
										children: "Automated checksum validation, color profile extraction (sRGB, Adobe RGB 1998, Display P3), and metadata tagging."
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "p-5 rounded-xl bg-white/[0.02] border border-white/10",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "text-xs font-mono text-[#de4a2c] font-bold",
										children: "STAGE 02 // VECTORIZING"
									}),
									/* @__PURE__ */ jsx("h4", {
										className: "text-base font-bold text-white mt-1",
										children: "Hand Pen-Tool Masking"
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-xs text-neutral-400 mt-2",
										children: "Manual Bezier path anchor distribution with smart tangent handles to prevent stair-stepping or pixel halos on high-res displays."
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "p-5 rounded-xl bg-white/[0.02] border border-white/10",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "text-xs font-mono text-[#de4a2c] font-bold",
										children: "STAGE 03 // DISPATCH"
									}),
									/* @__PURE__ */ jsx("h4", {
										className: "text-base font-bold text-white mt-1",
										children: "S3 / FTP Cloud Delivery"
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-xs text-neutral-400 mt-2",
										children: "Layered PSD, transparent alpha PNG, and WebP web-optimized packages delivered directly to brand CDN or storage buckets."
									})
								]
							})
						]
					})]
				})
			]
		})]
	});
}
//#endregion
export { HomeTechnical };
