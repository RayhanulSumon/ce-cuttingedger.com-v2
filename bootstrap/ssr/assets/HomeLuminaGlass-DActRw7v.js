import { useRef, useState } from "react";
import { Link } from "@inertiajs/react";
import { ArrowRight, Camera, Scissors, Shirt, SlidersHorizontal, Sparkles, UserCheck } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/HomeVariants/HomeLuminaGlass.tsx
var FIVE_SERVICES = [
	{
		id: "s1",
		code: "01",
		name: "AI Corporate Headshots",
		tag: "HR & Executive Teams",
		headline: "Phone Selfies to C-Suite Portraits",
		desc: "Uniform executive studio lighting and bespoke corporate wardrobes from casual mobile selfies.",
		beforeImg: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
		afterImg: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=85",
		beforeLabel: "Raw Phone Selfie",
		afterLabel: "Executive Studio Grade",
		specs: [
			"Sub-2h Batch SLA",
			"100% Identity Lock",
			"Custom Backdrops"
		],
		icon: UserCheck
	},
	{
		id: "s2",
		code: "02",
		name: "AI Fashion Models",
		tag: "Apparel & Catalogues",
		headline: "Ghost Mannequin to Living Runway",
		desc: "Instant synthesis of flat garment plates into high-fashion editorial models with diverse poses.",
		beforeImg: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=80",
		afterImg: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85",
		beforeLabel: "Hollow Mannequin",
		afterLabel: "Editorial Runway Model",
		specs: [
			"Zero Studio Overhead",
			"Natural Fabric Drape",
			"3 Body Types"
		],
		icon: Shirt
	},
	{
		id: "s3",
		code: "03",
		name: "3D Virtual Try-On",
		tag: "E-Commerce Flagships",
		headline: "Garment SKU to Anatomical Fit",
		desc: "Real-time cloth tension, realistic seam stretch, and drape rendering on consumer avatars.",
		beforeImg: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1200&q=80",
		afterImg: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85",
		beforeLabel: "Isolated Garment SKU",
		afterLabel: "Anatomical Dynamic Fit",
		specs: [
			"4K WebGL Assets",
			"38% Return Reduction",
			"Instant Synthesis"
		],
		icon: Sparkles
	},
	{
		id: "s4",
		code: "04",
		name: "Product Scene Generation",
		tag: "Luxury Brands & FMCG",
		headline: "White Background to Sunlit Marble",
		desc: "Generative physical raytraced shadows, realistic refractions, and architectural lifestyle setups.",
		beforeImg: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=80",
		afterImg: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=85",
		beforeLabel: "Studio Tabletop Pack",
		afterLabel: "Sunlit Marble Scene",
		specs: [
			"Raytraced Caustics",
			"Marketplace Presets",
			"10K+ SKU Batch"
		],
		icon: Camera
	},
	{
		id: "s5",
		code: "05",
		name: "Precision Vector Paths",
		tag: "Horology & Fine Jewelry",
		headline: "Hand-Drawn Pen Tool & Retouch",
		desc: "Sub-pixel Bézier curve isolation, gemstone facet brilliance, and non-destructive 16-bit master PSDs.",
		beforeImg: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80",
		afterImg: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85",
		beforeLabel: "Macro RAW Unretouched",
		afterLabel: "Laser Specular Polish",
		specs: [
			"±0.25px Vector Tolerance",
			"Zero Color Bleed",
			"16-bit Master PSD"
		],
		icon: Scissors
	}
];
function HomeLuminaGlass({ clients = [] }) {
	const [activeServiceIdx, setActiveServiceIdx] = useState(0);
	const [sliderPosition, setSliderPosition] = useState(50);
	const [isLensHovered, setIsLensHovered] = useState(false);
	const [lensPos, setLensPos] = useState({
		x: 50,
		y: 50
	});
	const [formSubmitted, setFormSubmitted] = useState(false);
	const activeService = FIVE_SERVICES[activeServiceIdx];
	const heroImageContainerRef = useRef(null);
	const handleHeroMouseMove = (e) => {
		if (!heroImageContainerRef.current) return;
		const rect = heroImageContainerRef.current.getBoundingClientRect();
		const x = (e.clientX - rect.left) / rect.width * 100;
		const y = (e.clientY - rect.top) / rect.height * 100;
		setLensPos({
			x: Math.max(5, Math.min(95, x)),
			y: Math.max(5, Math.min(95, y))
		});
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-[#F6F8FB] text-[#0F172A] selection:bg-[#de4a2c] selection:text-white font-sans antialiased overflow-x-hidden relative",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "fixed inset-0 pointer-events-none overflow-hidden z-0",
				children: [
					/* @__PURE__ */ jsx("div", { className: "absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-amber-200/30 to-rose-200/20 blur-[130px]" }),
					/* @__PURE__ */ jsx("div", { className: "absolute top-1/3 -right-40 w-[650px] h-[650px] rounded-full bg-gradient-to-bl from-sky-200/30 to-indigo-200/20 blur-[140px]" }),
					/* @__PURE__ */ jsx("div", { className: "absolute -bottom-40 left-1/3 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-emerald-100/30 to-amber-100/20 blur-[120px]" })
				]
			}),
			/* @__PURE__ */ jsx("header", {
				className: "sticky top-2 z-40 max-w-6xl mx-auto px-4",
				children: /* @__PURE__ */ jsxs("div", {
					className: "rounded-full bg-white/75 backdrop-blur-xl border border-white/60 shadow-[0_10px_30px_rgba(0,0,0,0.04)] px-4 py-2 flex items-center justify-between",
					children: [
						/* @__PURE__ */ jsxs(Link, {
							href: "/",
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx("span", {
								className: "w-7 h-7 rounded-full bg-[#de4a2c] text-white flex items-center justify-center font-bold text-xs shadow-md shadow-[#de4a2c]/20",
								children: "CE"
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex flex-col",
								children: [/* @__PURE__ */ jsx("span", {
									className: "font-extrabold text-xs sm:text-sm tracking-tight text-neutral-900 leading-none",
									children: "CUTTING EDGER"
								}), /* @__PURE__ */ jsx("span", {
									className: "text-[9px] uppercase font-mono tracking-widest text-neutral-400",
									children: "Lumina Glass Studio"
								})]
							})]
						}),
						/* @__PURE__ */ jsx("nav", {
							className: "hidden md:flex items-center gap-1 bg-neutral-100/60 p-0.5 rounded-full border border-neutral-200/50 overflow-x-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
							children: FIVE_SERVICES.map((s, idx) => /* @__PURE__ */ jsxs("button", {
								onClick: () => setActiveServiceIdx(idx),
								className: `px-3 py-1 rounded-full text-xs font-medium transition-all ${activeServiceIdx === idx ? "bg-white text-neutral-900 shadow-sm font-semibold" : "text-neutral-500 hover:text-neutral-900"}`,
								children: [
									s.code,
									" ",
									s.name.split(" ")[0]
								]
							}, s.id))
						}),
						/* @__PURE__ */ jsx("div", {
							className: "flex items-center gap-3",
							children: /* @__PURE__ */ jsx(Link, {
								href: "/contact",
								className: "px-4 py-1.5 rounded-full bg-neutral-900 text-white hover:bg-[#de4a2c] text-xs font-semibold tracking-wide transition-colors shadow-sm",
								children: "Start Free Trial"
							})
						})
					]
				})
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "relative z-10 pt-3 sm:pt-4 pb-8 sm:pb-12 px-4 max-w-6xl mx-auto",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "text-center max-w-3xl mx-auto mb-3 sm:mb-4",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-neutral-200/80 shadow-xs mb-1.5 text-[10px] font-mono font-bold text-neutral-700",
							children: [/* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-[#de4a2c] animate-pulse" }), /* @__PURE__ */ jsx("span", { children: "05 FROSTED OPTIC DISCIPLINES" })]
						}),
						/* @__PURE__ */ jsxs("h1", {
							className: "text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-neutral-950 leading-tight",
							children: [
								"Pure Visual Precision,",
								" ",
								/* @__PURE__ */ jsx("span", {
									className: "bg-gradient-to-r from-neutral-900 via-[#de4a2c] to-amber-600 bg-clip-text text-transparent",
									children: "Zero Artificial Noise"
								})
							]
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-1 text-xs sm:text-sm text-neutral-500 max-w-lg mx-auto",
							children: "Drag the split-slider to inspect raw captures against master retouch deliverables."
						})
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "rounded-3xl p-2.5 sm:p-3 bg-white/60 backdrop-blur-2xl border border-white/80 shadow-[0_20px_60px_rgba(15,23,42,0.06)] mb-4",
					children: [/* @__PURE__ */ jsxs("div", {
						ref: heroImageContainerRef,
						onMouseMove: handleHeroMouseMove,
						onMouseEnter: () => setIsLensHovered(true),
						onMouseLeave: () => setIsLensHovered(false),
						className: "relative h-[300px] sm:h-[380px] lg:h-[420px] rounded-2xl overflow-hidden cursor-crosshair select-none bg-neutral-100",
						children: [
							/* @__PURE__ */ jsx("img", {
								src: activeService.afterImg,
								alt: activeService.afterLabel,
								className: "absolute inset-0 w-full h-full object-cover object-center"
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "absolute inset-0 overflow-hidden",
								style: { width: `${sliderPosition}%` },
								children: [/* @__PURE__ */ jsx("img", {
									src: activeService.beforeImg,
									alt: activeService.beforeLabel,
									className: "absolute inset-0 w-full h-full object-cover object-center",
									style: {
										width: `${heroImageContainerRef.current?.clientWidth || 1e3}px`,
										maxWidth: "none"
									}
								}), /* @__PURE__ */ jsx("div", {
									className: "absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-mono uppercase tracking-wider",
									children: activeService.beforeLabel
								})]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "absolute top-4 right-4 px-3 py-1 rounded-full bg-[#de4a2c]/90 backdrop-blur-md text-white text-[11px] font-mono uppercase tracking-wider shadow-sm",
								children: activeService.afterLabel
							}),
							/* @__PURE__ */ jsx("div", {
								className: "absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_rgba(0,0,0,0.5)] z-20 pointer-events-none",
								style: { left: `${sliderPosition}%` },
								children: /* @__PURE__ */ jsx("div", {
									className: "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-neutral-800 shadow-xl flex items-center justify-center font-bold text-xs border border-neutral-200",
									children: /* @__PURE__ */ jsx(SlidersHorizontal, { className: "w-3.5 h-3.5 text-[#de4a2c]" })
								})
							}),
							/* @__PURE__ */ jsx("input", {
								type: "range",
								min: "0",
								max: "100",
								value: sliderPosition,
								onChange: (e) => setSliderPosition(Number(e.target.value)),
								className: "absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30",
								"aria-label": "Before after split slider"
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-sm p-3 rounded-2xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-lg z-20 pointer-events-none",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between mb-0.5",
										children: [/* @__PURE__ */ jsxs("span", {
											className: "text-[10px] font-mono uppercase tracking-wider text-[#de4a2c] font-bold",
											children: [
												"Pillar ",
												activeService.code,
												" // ",
												activeService.tag
											]
										}), /* @__PURE__ */ jsxs("span", {
											className: "text-[10px] font-mono text-neutral-500",
											children: [sliderPosition, "% Split"]
										})]
									}),
									/* @__PURE__ */ jsx("h3", {
										className: "font-bold text-sm text-neutral-900 leading-snug",
										children: activeService.headline
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-[11px] text-neutral-600 mt-0.5 line-clamp-1",
										children: activeService.desc
									}),
									/* @__PURE__ */ jsx("div", {
										className: "flex flex-wrap gap-1 mt-1.5",
										children: activeService.specs.map((spec, i) => /* @__PURE__ */ jsx("span", {
											className: "text-[9px] px-1.5 py-0.5 rounded-md bg-neutral-100 text-neutral-700 font-medium border border-neutral-200/50",
											children: spec
										}, i))
									})
								]
							})
						]
					}), /* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-2 sm:grid-cols-5 gap-1.5 mt-2.5 pt-1 overflow-x-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
						children: FIVE_SERVICES.map((s, idx) => {
							const Icon = s.icon;
							const isSelected = activeServiceIdx === idx;
							return /* @__PURE__ */ jsxs("button", {
								onClick: () => setActiveServiceIdx(idx),
								className: `p-2.5 rounded-xl text-left transition-all relative overflow-hidden border ${isSelected ? "bg-white shadow-sm border-[#de4a2c]/30 ring-2 ring-[#de4a2c]/20" : "bg-white/40 hover:bg-white/70 border-white/60"}`,
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between mb-1",
										children: [/* @__PURE__ */ jsx("span", {
											className: "font-mono text-[10px] font-bold text-[#de4a2c]",
											children: s.code
										}), /* @__PURE__ */ jsx(Icon, { className: `w-3.5 h-3.5 ${isSelected ? "text-[#de4a2c]" : "text-neutral-400"}` })]
									}),
									/* @__PURE__ */ jsx("div", {
										className: "font-bold text-xs text-neutral-900 leading-tight",
										children: s.name
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-[10px] text-neutral-500 truncate mt-0.5",
										children: s.tag
									})
								]
							}, s.id);
						})
					})]
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "relative z-10 py-16 px-4 max-w-6xl mx-auto",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
							className: "text-xs font-mono uppercase tracking-widest text-[#de4a2c] font-bold mb-1",
							children: "DISCIPLINE SHOWCASE"
						}), /* @__PURE__ */ jsx("h2", {
							className: "text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight",
							children: "Five Tailored Visual Engines"
						})] }), /* @__PURE__ */ jsx("p", {
							className: "text-xs sm:text-sm text-neutral-500 max-w-md",
							children: "Each discipline engineered with dedicated machine pipelines and master artists. Zero compromise on fidelity."
						})]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-1 md:grid-cols-3 gap-5",
						children: FIVE_SERVICES.slice(0, 3).map((item) => /* @__PURE__ */ jsxs("div", {
							className: "rounded-3xl p-4 bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_15px_35px_rgba(0,0,0,0.03)] hover:shadow-xl transition-all group flex flex-col justify-between",
							children: [/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsxs("div", {
									className: "relative h-60 rounded-2xl overflow-hidden mb-4 bg-neutral-100",
									children: [/* @__PURE__ */ jsx("img", {
										src: item.afterImg,
										alt: item.name,
										className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
									}), /* @__PURE__ */ jsxs("div", {
										className: "absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-mono font-bold text-neutral-900",
										children: [
											item.code,
											" // ",
											item.name
										]
									})]
								}),
								/* @__PURE__ */ jsx("h3", {
									className: "font-bold text-base text-neutral-900 mb-1",
									children: item.headline
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-xs text-neutral-600 mb-3",
									children: item.desc
								})
							] }), /* @__PURE__ */ jsxs("div", {
								className: "border-t border-neutral-100 pt-3 flex items-center justify-between",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-[11px] font-mono text-neutral-500",
									children: item.specs[0]
								}), /* @__PURE__ */ jsxs(Link, {
									href: "/contact",
									className: "inline-flex items-center gap-1 text-xs font-semibold text-[#de4a2c] hover:underline",
									children: ["Test Sample ", /* @__PURE__ */ jsx(ArrowRight, { className: "w-3 h-3" })]
								})]
							})]
						}, item.id))
					}),
					/* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-1 md:grid-cols-2 gap-5 mt-5",
						children: FIVE_SERVICES.slice(3, 5).map((item) => /* @__PURE__ */ jsxs("div", {
							className: "rounded-3xl p-4 bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_15px_35px_rgba(0,0,0,0.03)] hover:shadow-xl transition-all group flex flex-col justify-between",
							children: [/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsxs("div", {
									className: "relative h-64 rounded-2xl overflow-hidden mb-4 bg-neutral-100",
									children: [/* @__PURE__ */ jsx("img", {
										src: item.afterImg,
										alt: item.name,
										className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
									}), /* @__PURE__ */ jsxs("div", {
										className: "absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-mono font-bold text-neutral-900",
										children: [
											item.code,
											" // ",
											item.name
										]
									})]
								}),
								/* @__PURE__ */ jsx("h3", {
									className: "font-bold text-base text-neutral-900 mb-1",
									children: item.headline
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-xs text-neutral-600 mb-3",
									children: item.desc
								})
							] }), /* @__PURE__ */ jsxs("div", {
								className: "border-t border-neutral-100 pt-3 flex items-center justify-between",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-[11px] font-mono text-neutral-500",
									children: item.specs[0]
								}), /* @__PURE__ */ jsxs(Link, {
									href: "/contact",
									className: "inline-flex items-center gap-1 text-xs font-semibold text-[#de4a2c] hover:underline",
									children: ["Test Sample ", /* @__PURE__ */ jsx(ArrowRight, { className: "w-3 h-3" })]
								})]
							})]
						}, item.id))
					})
				]
			}),
			/* @__PURE__ */ jsx("section", {
				className: "relative z-10 py-12 px-4 max-w-6xl mx-auto",
				children: /* @__PURE__ */ jsx("div", {
					className: "rounded-3xl p-8 bg-gradient-to-r from-white/80 to-white/50 backdrop-blur-2xl border border-white/80 shadow-md",
					children: /* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-2 sm:grid-cols-4 gap-6 text-center",
						children: [
							/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("div", {
									className: "text-3xl sm:text-4xl font-extrabold text-neutral-900 font-mono tracking-tight",
									children: "< 2h"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "text-xs font-semibold text-neutral-800 uppercase tracking-wider mt-1",
									children: "Batch Turnaround"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "text-[11px] text-neutral-500 mt-0.5",
									children: "S1 & S2 rapid turnaround"
								})
							] }),
							/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("div", {
									className: "text-3xl sm:text-4xl font-extrabold text-[#de4a2c] font-mono tracking-tight",
									children: "±0.25px"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "text-xs font-semibold text-neutral-800 uppercase tracking-wider mt-1",
									children: "Vector Precision"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "text-[11px] text-neutral-500 mt-0.5",
									children: "Hand-drawn pen tool paths"
								})
							] }),
							/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("div", {
									className: "text-3xl sm:text-4xl font-extrabold text-neutral-900 font-mono tracking-tight",
									children: "300 DPI"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "text-xs font-semibold text-neutral-800 uppercase tracking-wider mt-1",
									children: "16-Bit Master Files"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "text-[11px] text-neutral-500 mt-0.5",
									children: "Print & billboard certified"
								})
							] }),
							/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("div", {
									className: "text-3xl sm:text-4xl font-extrabold text-neutral-900 font-mono tracking-tight",
									children: "2.4M+"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "text-xs font-semibold text-neutral-800 uppercase tracking-wider mt-1",
									children: "Commercial Frames"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "text-[11px] text-neutral-500 mt-0.5",
									children: "Delivered without returns"
								})
							] })
						]
					})
				})
			}),
			/* @__PURE__ */ jsx("section", {
				className: "relative z-10 py-16 px-4 max-w-4xl mx-auto text-center",
				children: /* @__PURE__ */ jsxs("div", {
					className: "rounded-3xl p-8 sm:p-12 bg-white/80 backdrop-blur-2xl border border-white/80 shadow-[0_20px_60px_rgba(0,0,0,0.05)]",
					children: [
						/* @__PURE__ */ jsx("span", { className: "w-3 h-3 rounded-full bg-emerald-500 inline-block mb-3 animate-ping" }),
						/* @__PURE__ */ jsx("h2", {
							className: "text-3xl sm:text-4xl font-extrabold text-neutral-950 tracking-tight mb-3",
							children: "Test Your First 3 Images For Free"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-neutral-600 text-sm max-w-md mx-auto mb-6",
							children: "Upload any raw photo, flat-lay garment, or jewelry capture. We return retouched master assets within 2 hours."
						}),
						formSubmitted ? /* @__PURE__ */ jsx("div", {
							className: "p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold",
							children: "Thank you! Your trial request has been submitted. Check your inbox for upload instructions."
						}) : /* @__PURE__ */ jsxs("form", {
							onSubmit: (e) => {
								e.preventDefault();
								setFormSubmitted(true);
							},
							className: "flex flex-col sm:flex-row gap-2 max-w-md mx-auto",
							children: [/* @__PURE__ */ jsx("input", {
								type: "email",
								required: true,
								placeholder: "Enter work email for free trial",
								className: "flex-1 px-4 py-3 rounded-full bg-neutral-100 border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#de4a2c]"
							}), /* @__PURE__ */ jsx("button", {
								type: "submit",
								className: "px-6 py-3 rounded-full bg-[#de4a2c] text-white font-bold text-xs tracking-wider uppercase hover:bg-neutral-900 transition-colors shadow-sm",
								children: "Send Mockup"
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-center gap-6 text-[11px] font-mono text-neutral-400 mt-6",
							children: [
								/* @__PURE__ */ jsx("span", { children: "✓ ZERO CREDIT CARD" }),
								/* @__PURE__ */ jsx("span", { children: "✓ STRICT NDA" }),
								/* @__PURE__ */ jsx("span", { children: "✓ SUB-2H TURNAROUND" })
							]
						})
					]
				})
			}),
			/* @__PURE__ */ jsx("footer", {
				className: "relative z-10 border-t border-neutral-200/60 py-8 px-4 text-center text-xs text-neutral-500 font-mono",
				children: /* @__PURE__ */ jsx("p", { children: "© 2026 CUTTING EDGER DIGITAL ATELIER. LUMINA GLASS PROTOTYPE 09." })
			})
		]
	});
}
//#endregion
export { HomeLuminaGlass };
