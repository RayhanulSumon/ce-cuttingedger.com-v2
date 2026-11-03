import { useState } from "react";
import { Link } from "@inertiajs/react";
import { Terminal } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/HomeVariants/HomeArchitectBlueprint.tsx
var BLUEPRINT_DISCIPLINES = [
	{
		code: "SPEC-01",
		name: "AI Corporate Headshots",
		system: "S1-HR/EXEC",
		tolerance: "100% Identity Lock",
		sla: "&lt; 120min",
		deliverables: "16-bit Master PSD, 300 DPI, CMYK & sRGB",
		beforeImg: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
		afterImg: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=85",
		notes: "Eliminates studio travel. Standardizes C-suite branding across global hubs."
	},
	{
		code: "SPEC-02",
		name: "AI Fashion Runway Models",
		system: "S2-APPAREL",
		tolerance: "Anatomical Dynamic Drape",
		sla: "Batch Auto-Stream",
		deliverables: "Multi-angle WebP & 4K TIFF",
		beforeImg: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=80",
		afterImg: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85",
		notes: "Replaces expensive casting calls. Preserves weave pattern and stitch fidelity."
	},
	{
		code: "SPEC-03",
		name: "3D Virtual Try-On Synthesis",
		system: "S3-SIMULATION",
		tolerance: "Physics Cloth Tension",
		sla: "Real-Time 60FPS",
		deliverables: "GLTF / USDZ / 4K JPG",
		beforeImg: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1200&q=80",
		afterImg: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85",
		notes: "Decreases return rates up to 38% on e-commerce flagship storefronts."
	},
	{
		code: "SPEC-04",
		name: "Product Scene Generation",
		system: "S4-CAUSTICS",
		tolerance: "Raytraced Shadow Alignment",
		sla: "4-Hour Bulk Pipeline",
		deliverables: "Isolated Layered Alpha PSD",
		beforeImg: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=80",
		afterImg: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=85",
		notes: "Synthesizes realistic sunlight, travertine pedestals, and caustic water reflections."
	},
	{
		code: "SPEC-05",
		name: "Precision Vector Paths",
		system: "S5-MICROPOLISH",
		tolerance: "±0.25px Bézier Pen Tool",
		sla: "6-Hour Rush Available",
		deliverables: "Vector Path Embedded TIFF & PSD",
		beforeImg: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80",
		afterImg: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85",
		notes: "100% human-drawn vector pen paths. Zero automated jagged fringe or halo artifacts."
	}
];
function HomeArchitectBlueprint({ clients = [] }) {
	const [activeIdx, setActiveIdx] = useState(0);
	const [isXray, setIsXray] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const active = BLUEPRINT_DISCIPLINES[activeIdx];
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-[#F9FAFB] text-[#0A0D14] selection:bg-[#de4a2c] selection:text-white font-mono antialiased overflow-x-hidden",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "fixed inset-0 pointer-events-none opacity-[0.035]",
				style: {
					backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
					backgroundSize: "32px 32px"
				}
			}),
			/* @__PURE__ */ jsx("header", {
				className: "border-b border-neutral-300 bg-white/95 sticky top-0 z-40 px-6 py-3",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-7xl mx-auto flex items-center justify-between text-xs",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ jsxs(Link, {
								href: "/",
								className: "font-black text-sm tracking-tighter text-neutral-900 flex items-center gap-2",
								children: [/* @__PURE__ */ jsx("span", { className: "w-2.5 h-2.5 bg-[#de4a2c]" }), "CUTTING_EDGER.SYS // V13"]
							}), /* @__PURE__ */ jsx("span", {
								className: "text-[10px] text-neutral-400 hidden sm:inline",
								children: "[LAT: 40.7128° N // LON: 74.0060° W]"
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "hidden md:flex items-center gap-6 text-[11px] text-neutral-500",
							children: [
								/* @__PURE__ */ jsx("span", { children: "PIPELINE: ACTIVE" }),
								/* @__PURE__ */ jsx("span", { children: "TOLERANCE: ±0.25PX" }),
								/* @__PURE__ */ jsx("span", {
									className: "text-emerald-600 font-bold",
									children: "● NODE READY"
								})
							]
						}),
						/* @__PURE__ */ jsx(Link, {
							href: "/contact",
							className: "px-4 py-1.5 border border-neutral-900 bg-neutral-900 text-white hover:bg-[#de4a2c] hover:border-[#de4a2c] text-xs font-bold transition-colors",
							children: "EXECUTE_TEST_ORDER"
						})
					]
				})
			}),
			/* @__PURE__ */ jsx("section", {
				className: "py-12 px-6 max-w-7xl mx-auto border-b border-neutral-300",
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col lg:flex-row gap-8 items-start",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "w-full lg:w-5/12 space-y-4",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "border border-neutral-300 bg-white p-5 shadow-xs",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "text-[10px] text-[#de4a2c] font-bold uppercase mb-1",
									children: "// SYSTEM ARCHITECTURE"
								}),
								/* @__PURE__ */ jsx("h1", {
									className: "text-2xl sm:text-3xl font-black text-neutral-950 uppercase tracking-tight mb-2",
									children: "Precision Post-Production Engine"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-xs text-neutral-600 mb-4 leading-relaxed",
									children: "Industrial-grade digital image manufacturing. 5 core disciplines operating under strict SLA tolerance standards."
								}),
								/* @__PURE__ */ jsx("div", {
									className: "space-y-1.5",
									children: BLUEPRINT_DISCIPLINES.map((d, idx) => /* @__PURE__ */ jsxs("button", {
										onClick: () => setActiveIdx(idx),
										className: `w-full text-left p-3 border transition-all flex items-center justify-between text-xs ${activeIdx === idx ? "border-neutral-950 bg-neutral-950 text-white font-bold" : "border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-800"}`,
										children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("span", {
											className: "text-[10px] opacity-70 block",
											children: [
												d.code,
												" // ",
												d.system
											]
										}), /* @__PURE__ */ jsx("span", { children: d.name })] }), /* @__PURE__ */ jsx("span", {
											className: "text-[10px] font-mono opacity-80",
											children: d.sla
										})]
									}, d.code))
								})
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "border border-neutral-300 bg-white p-4 text-xs space-y-2",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex justify-between border-b border-neutral-100 pb-1.5",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-neutral-500",
										children: "TOLERANCE SPEC:"
									}), /* @__PURE__ */ jsx("span", {
										className: "font-bold text-neutral-900",
										children: active.tolerance
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex justify-between border-b border-neutral-100 pb-1.5",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-neutral-500",
										children: "DELIVERABLES:"
									}), /* @__PURE__ */ jsx("span", {
										className: "font-bold text-neutral-900",
										children: active.deliverables
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-neutral-500",
										children: "HUMAN QA PASS:"
									}), /* @__PURE__ */ jsx("span", {
										className: "text-emerald-600 font-bold",
										children: "PASS (DUAL OVERSIGHT)"
									})]
								})
							]
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "w-full lg:w-7/12 border border-neutral-300 bg-white p-3 shadow-sm",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between px-3 py-2 bg-neutral-100 border border-neutral-200 text-xs mb-3",
								children: [/* @__PURE__ */ jsxs("span", {
									className: "text-[11px] font-bold text-neutral-800",
									children: [
										"FRAME_BUFFER: ",
										active.code,
										" // ",
										active.name.toUpperCase()
									]
								}), /* @__PURE__ */ jsx("button", {
									onClick: () => setIsXray(!isXray),
									className: `px-3 py-1 text-[10px] font-bold uppercase transition-colors border ${isXray ? "bg-[#de4a2c] text-white border-[#de4a2c]" : "bg-white text-neutral-900 border-neutral-300 hover:bg-neutral-200"}`,
									children: isXray ? "● X-RAY_RAW_ACTIVE" : "○ TOGGLE_X-RAY_RAW"
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "relative h-[380px] sm:h-[480px] overflow-hidden border border-neutral-200 bg-neutral-900",
								children: [
									/* @__PURE__ */ jsx("img", {
										src: isXray ? active.beforeImg : active.afterImg,
										alt: active.name,
										className: "w-full h-full object-cover"
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "absolute top-4 left-4 text-[10px] bg-black/70 text-emerald-400 p-2 font-mono border border-emerald-500/30",
										children: [
											"[X: 1920, Y: 1080] ",
											/* @__PURE__ */ jsx("br", {}),
											"CALIBRATION: DELTA_E < 1.0 ",
											/* @__PURE__ */ jsx("br", {}),
											"STATUS: ",
											isXray ? "RAW_SOURCE_INGEST" : "RENDER_MASTER_VERIFIED"
										]
									}),
									/* @__PURE__ */ jsx("div", {
										className: "absolute bottom-4 right-4 text-[10px] bg-white/90 text-neutral-900 px-3 py-1 font-bold border border-neutral-400",
										children: active.tolerance
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "p-3 text-xs text-neutral-600 border-t border-neutral-200 mt-2",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "font-bold text-neutral-900",
										children: "SYSTEM NOTE:"
									}),
									" ",
									active.notes
								]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "py-16 px-6 max-w-7xl mx-auto",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between mb-8",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						className: "text-[10px] text-[#de4a2c] font-bold uppercase mb-0.5",
						children: "// PRODUCTION CAPABILITIES"
					}), /* @__PURE__ */ jsx("h2", {
						className: "text-xl sm:text-2xl font-black text-neutral-950 uppercase",
						children: "Automated & Manual Pipeline Matrix"
					})] }), /* @__PURE__ */ jsx("span", {
						className: "text-xs text-neutral-400 hidden sm:inline",
						children: "5 DEDICATED ATELIER STATIONS"
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-1 md:grid-cols-5 gap-3",
					children: BLUEPRINT_DISCIPLINES.map((d) => /* @__PURE__ */ jsxs("div", {
						className: "border border-neutral-300 bg-white p-4 flex flex-col justify-between hover:border-neutral-900 transition-colors",
						children: [/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("span", {
								className: "text-[10px] text-[#de4a2c] font-bold block mb-1",
								children: d.code
							}),
							/* @__PURE__ */ jsx("h3", {
								className: "text-sm font-bold text-neutral-900 mb-2 leading-tight",
								children: d.name
							}),
							/* @__PURE__ */ jsx("div", {
								className: "text-[11px] text-neutral-500 mb-4 line-clamp-3",
								children: d.notes
							})
						] }), /* @__PURE__ */ jsxs("div", {
							className: "border-t border-neutral-200 pt-3 text-[10px] space-y-1 text-neutral-600",
							children: [/* @__PURE__ */ jsxs("div", { children: ["SLA: ", /* @__PURE__ */ jsx("span", {
								className: "font-bold text-neutral-900",
								children: d.sla
							})] }), /* @__PURE__ */ jsxs("div", { children: ["ACC: ", /* @__PURE__ */ jsx("span", {
								className: "font-bold text-neutral-900",
								children: d.tolerance
							})] })]
						})]
					}, d.code))
				})]
			}),
			/* @__PURE__ */ jsx("footer", {
				className: "border-t border-neutral-300 bg-white py-14 px-6 text-xs",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-3xl mx-auto border border-neutral-300 bg-neutral-50 p-6 shadow-xs text-center",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-center gap-2 mb-2 text-neutral-500 text-[11px]",
							children: [/* @__PURE__ */ jsx(Terminal, { className: "w-3.5 h-3.5 text-[#de4a2c]" }), /* @__PURE__ */ jsx("span", { children: "TERMINAL COMMAND // INGEST FREE TEST BATCH" })]
						}),
						/* @__PURE__ */ jsx("h2", {
							className: "text-xl font-black text-neutral-950 uppercase mb-2",
							children: "Submit Test Specification Under NDA"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-neutral-600 mb-6 text-xs max-w-md mx-auto",
							children: "Input enterprise email to receive secure encrypted ingest credentials. First 3 master files processed complimentary."
						}),
						submitted ? /* @__PURE__ */ jsx("div", {
							className: "p-3 bg-neutral-900 text-white font-mono text-xs",
							children: "> STATUS 200 OK: Ingest token generated. Check email protocol."
						}) : /* @__PURE__ */ jsxs("form", {
							onSubmit: (e) => {
								e.preventDefault();
								setSubmitted(true);
							},
							className: "flex flex-col sm:flex-row gap-2 max-w-md mx-auto",
							children: [/* @__PURE__ */ jsx("input", {
								type: "email",
								required: true,
								placeholder: "ENTER_WORK_EMAIL",
								className: "flex-1 px-4 py-2.5 bg-white border border-neutral-400 text-xs focus:outline-none focus:border-neutral-950"
							}), /* @__PURE__ */ jsx("button", {
								type: "submit",
								className: "px-5 py-2.5 bg-neutral-950 hover:bg-[#de4a2c] text-white font-bold uppercase transition-colors",
								children: "EXECUTE_TOKEN"
							})]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "mt-8 text-[10px] text-neutral-400 border-t border-neutral-200 pt-4",
							children: "© 2026 CUTTING EDGER DIGITAL SYSTEMS. ARCHITECT BLUEPRINT PROTOTYPE 13."
						})
					]
				})
			})
		]
	});
}
//#endregion
export { HomeArchitectBlueprint };
