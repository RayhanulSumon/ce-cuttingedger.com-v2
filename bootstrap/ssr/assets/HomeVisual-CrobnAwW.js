import { useState } from "react";
import { ArrowRight, CheckCircle2, Eye, Layers, ShieldCheck, Sparkles, Upload, Wand2 } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/HomeVariants/HomeVisual.tsx
var AI_VISUAL_SERVICES = [
	{
		id: "s1-headshots",
		code: "S1",
		badge: "AI CORPORATE HEADSHOTS",
		target: "HR & Marketing Teams (20–500 Seats)",
		title: "Selfies to Executive Studio Portraits",
		tagline: "Branded professional headshots from 6–10 casual selfies per person, with unified company backdrops and tailored attire.",
		turnaround: "Under 2 hours batch",
		inputVisual: {
			label: "RAW INPUT: 6–10 SELFIES",
			desc: "Smartphone selfies in natural ambient light",
			image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
			badge: "Unedited Mobile Capture"
		},
		outputVisual: {
			label: "STUDIO PRESET: EXECUTIVE PORTRAIT",
			desc: "Corporate lighting, bespoke brand backdrop & crisp attire",
			image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=85",
			badge: "High-Res Studio Output"
		},
		specs: [
			"Consistent company lighting",
			"Custom branded backdrop",
			"Tailored business wardrobe",
			"Identity preservation lock"
		],
		href: "/services/ai-corporate-headshots"
	},
	{
		id: "s2-fashion-models",
		code: "S2",
		badge: "AI FASHION MODELS",
		target: "Apparel Brands, Agencies & Catalogues",
		title: "Flat-Lay / Mannequin to Editorial On-Model",
		tagline: "Transforms flat-lay or ghost mannequin photos into high-fashion model campaigns across varied ethnicities, sizes, and poses.",
		turnaround: "Instant multi-angle set",
		inputVisual: {
			label: "RAW INPUT: GHOST MANNEQUIN",
			desc: "Studio cutout on neutral background",
			image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80",
			badge: "Studio Mannequin Plate"
		},
		outputVisual: {
			label: "OUTPUT: LIVING MODEL IN MOTION",
			desc: "Dynamic fashion editorial with natural fabric fold dynamics",
			image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85",
			badge: "Multi-Pose Runway Model"
		},
		specs: [
			"Zero physical model costs",
			"Adaptive body diversity",
			"Preserved textile texture & drape",
			"Multiple catwalk poses"
		],
		href: "/services/ai-fashion-models"
	},
	{
		id: "s3-virtual-tryon",
		code: "S3",
		badge: "VIRTUAL TRY-ON",
		target: "Fashion Retailers & E-Commerce Flagships",
		title: "Garment + Target Model Instant Synthesis",
		tagline: "Single garment shot plus customer or stock model image generates a photorealistic try-on image, upscaled to ultra-crisp marketplace resolution.",
		turnaround: "Sub-second real-time render",
		inputVisual: {
			label: "INPUT: PRODUCT FLUID SHOT",
			desc: "Independent top or outerwear piece",
			image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80",
			badge: "Isolated SKU Garment"
		},
		outputVisual: {
			label: "OUTPUT: MARKETPLACE RESOLUTION FIT",
			desc: "Anatomically accurate stretch, wrinkle, and seam integration",
			image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85",
			badge: "4K Ultra-Res Try-On"
		},
		specs: [
			"Crease & wrinkle realism",
			"Shoulder & torso accurate drape",
			"Marketplace 4K resolution export",
			"Reduces return rates by up to 38%"
		],
		href: "/services/virtual-try-on"
	},
	{
		id: "s4-product-scene",
		code: "S4",
		badge: "PRODUCT SCENE GENERATION",
		target: "All E-Commerce Sellers (Highest Volume)",
		title: "Background Removal to Lifestyle Context",
		tagline: "Automated background removal, generative AI lifestyle environments, raytraced reflections, and physics-based studio shadows.",
		turnaround: "High-volume batch pipeline",
		inputVisual: {
			label: "RAW INPUT: ISOLATED PRODUCT",
			desc: "Plain white background or raw studio table capture",
			image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80",
			badge: "Raw Product Plate"
		},
		outputVisual: {
			label: "OUTPUT: EDITORIAL LIFESTYLE SCENE",
			desc: "Architectural marble pedestal with natural morning sunlight caustics",
			image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=85",
			badge: "Generative Sunlight Scene"
		},
		specs: [
			"Raytraced contact shadows",
			"Color temperature sync",
			"Amazon, Shopify & Instagram crop presets",
			"Bulk 10,000+ SKU automation"
		],
		href: "/services/product-scene-generation"
	},
	{
		id: "s5-clipping-retouch",
		code: "S5",
		badge: "PRECISION PATHS & RETOUCHING",
		target: "Luxury Maisons, Horology & Fine Jewelry",
		title: "Hand-Drawn Vector Masking & Micro-Polish",
		tagline: "300% zoom vector Bézier pen paths, prong reconstruction, micro-dust ablation, and non-destructive 16-bit PSD delivery.",
		turnaround: "6–12 hour guaranteed SLA",
		inputVisual: {
			label: "RAW CAPTURE: UNEDITED PLATE",
			desc: "Dust specks, studio halo, dull reflection",
			image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
			badge: "Macro RAW Unretouched"
		},
		outputVisual: {
			label: "OUTPUT: SPECULAR FINISH",
			desc: "Flawless gem facet brilliance and laser-cut vector alpha channel",
			image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85",
			badge: "Hand-Crafted Master PSD"
		},
		specs: [
			"±0.25px vector tolerance",
			"Zero halo against dark backdrops",
			"Dual-pass human QA oversight",
			"Layered PSD with separate shadow passes"
		],
		href: "/services/ecommerce-catalog-optimization/clipping-path-service"
	}
];
function HomeVisual({ clients = [] }) {
	const [activeServiceIdx, setActiveServiceIdx] = useState(0);
	const [sliderPosition, setSliderPosition] = useState(50);
	const [isHoldingInput, setIsHoldingInput] = useState(false);
	const [selectedTryoutService, setSelectedTryoutService] = useState("s1-headshots");
	const [formSubmitted, setFormSubmitted] = useState(false);
	const activeService = AI_VISUAL_SERVICES[activeServiceIdx];
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-[#08090C] text-[#F3F4F6] selection:bg-[#de4a2c] selection:text-white font-sans antialiased overflow-x-hidden",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "border-b border-white/10 bg-white/[0.02] backdrop-blur-md sticky top-0 z-40",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-7xl mx-auto px-4 py-2 flex items-center justify-between text-xs overflow-x-auto gap-4 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2 shrink-0",
						children: [/* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-[#de4a2c] animate-pulse" }), /* @__PURE__ */ jsx("span", {
							className: "font-mono font-bold uppercase tracking-wider text-white text-[11px]",
							children: "Visual Transformation Engine:"
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "flex items-center gap-1.5 shrink-0 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
						children: AI_VISUAL_SERVICES.map((s, idx) => /* @__PURE__ */ jsxs("button", {
							onClick: () => {
								setActiveServiceIdx(idx);
								setSliderPosition(50);
							},
							className: `px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold transition-all flex items-center gap-1.5 ${activeServiceIdx === idx ? "bg-[#de4a2c] text-white shadow-[0_0_15px_rgba(222,74,44,0.4)]" : "bg-white/[0.04] text-neutral-400 hover:text-white hover:bg-white/[0.08]"}`,
							children: [/* @__PURE__ */ jsx("span", { children: s.code }), /* @__PURE__ */ jsxs("span", {
								className: "hidden md:inline",
								children: ["• ", s.badge.split(" ")[0]]
							})]
						}, s.id))
					})]
				})
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "relative pt-3 sm:pt-4 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto",
				children: [
					/* @__PURE__ */ jsx("div", { className: "absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#de4a2c]/15 blur-[160px] pointer-events-none rounded-full" }),
					/* @__PURE__ */ jsxs("div", {
						className: "text-center max-w-3xl mx-auto mb-3 sm:mb-4",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 mb-2 backdrop-blur-md",
								children: [/* @__PURE__ */ jsx(Sparkles, { className: "w-3 h-3 text-[#de4a2c]" }), /* @__PURE__ */ jsx("span", {
									className: "text-[10px] font-mono font-bold tracking-widest uppercase text-neutral-300",
									children: "5 INTERACTIVE VISUAL ENGINES"
								})]
							}),
							/* @__PURE__ */ jsxs("h1", {
								className: "text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight",
								children: [
									"Raw Plates to",
									" ",
									/* @__PURE__ */ jsx("span", {
										className: "text-transparent bg-clip-text bg-gradient-to-r from-[#de4a2c] via-[#ff6b4a] to-amber-300",
										children: "Flawless Visuals"
									})
								]
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-1 text-xs sm:text-sm text-neutral-400 max-w-lg mx-auto",
								children: "Drag the split-slider to inspect raw capture vs production-grade output."
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "rounded-3xl p-3 sm:p-5 bg-white/[0.02] border border-white/10 shadow-[0_20px_70px_rgba(0,0,0,0.8)] backdrop-blur-xl relative",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-white/10",
							children: [/* @__PURE__ */ jsx("div", {
								className: "flex items-center gap-1.5 overflow-x-auto py-0.5 max-w-full scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
								children: AI_VISUAL_SERVICES.map((serv, idx) => /* @__PURE__ */ jsxs("button", {
									onClick: () => {
										setActiveServiceIdx(idx);
										setSliderPosition(50);
									},
									className: `px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${activeServiceIdx === idx ? "bg-white text-[#08090C] shadow-md scale-102" : "bg-white/[0.05] text-neutral-300 hover:text-white hover:bg-white/[0.1]"}`,
									children: [
										/* @__PURE__ */ jsx("span", { className: `w-1.5 h-1.5 rounded-full ${activeServiceIdx === idx ? "bg-[#de4a2c]" : "bg-neutral-500"}` }),
										/* @__PURE__ */ jsxs("span", {
											className: "font-mono font-bold text-[#de4a2c]",
											children: [serv.code, ":"]
										}),
										/* @__PURE__ */ jsx("span", {
											className: "text-[11px] sm:text-xs",
											children: serv.badge
										})
									]
								}, serv.id))
							}), /* @__PURE__ */ jsx("div", {
								className: "text-[11px] font-mono text-neutral-400 flex items-center gap-2",
								children: /* @__PURE__ */ jsx("span", {
									className: "text-[#de4a2c] font-bold",
									children: activeService.target
								})
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "mt-4 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center",
							children: [/* @__PURE__ */ jsx("div", {
								className: "lg:col-span-8",
								children: /* @__PURE__ */ jsxs("div", {
									className: "relative rounded-2xl overflow-hidden border border-white/10 bg-neutral-950 h-[300px] sm:h-[380px] lg:h-[420px] select-none group",
									children: [
										/* @__PURE__ */ jsx("img", {
											src: activeService.outputVisual.image,
											alt: activeService.outputVisual.label,
											className: "w-full h-full object-cover object-center"
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "absolute inset-0 overflow-hidden bg-neutral-900",
											style: { clipPath: `inset(0 ${100 - (isHoldingInput ? 100 : sliderPosition)}% 0 0)` },
											children: [/* @__PURE__ */ jsx("img", {
												src: activeService.inputVisual.image,
												alt: activeService.inputVisual.label,
												className: "w-full h-full object-cover object-center filter brightness-90 contrast-95"
											}), /* @__PURE__ */ jsx("div", {
												className: "absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md text-white text-[11px] font-mono font-bold border border-white/20",
												children: activeService.inputVisual.badge
											})]
										}),
										!isHoldingInput && /* @__PURE__ */ jsx("div", {
											className: "absolute top-0 bottom-0 w-0.5 bg-white pointer-events-none shadow-[0_0_15px_rgba(255,255,255,0.8)]",
											style: { left: `${sliderPosition}%` },
											children: /* @__PURE__ */ jsxs("div", {
												className: "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#de4a2c] border-2 border-white text-white text-[10px] font-mono font-black tracking-wider uppercase shadow-xl flex items-center gap-1.5",
												children: [
													/* @__PURE__ */ jsx("span", { children: "RAW" }),
													/* @__PURE__ */ jsx("span", {
														className: "opacity-40",
														children: "|"
													}),
													/* @__PURE__ */ jsx("span", { children: "AI RESULT" })
												]
											})
										}),
										/* @__PURE__ */ jsx("div", {
											className: "absolute top-4 right-4 px-3 py-1.5 rounded-full bg-[#de4a2c] text-white text-[11px] font-mono font-bold shadow-lg",
											children: activeService.outputVisual.badge
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "absolute bottom-4 inset-x-4 p-2.5 rounded-2xl bg-black/75 backdrop-blur-xl border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs",
											children: [/* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-3",
												children: [/* @__PURE__ */ jsxs("button", {
													type: "button",
													onMouseDown: () => setIsHoldingInput(true),
													onMouseUp: () => setIsHoldingInput(false),
													onTouchStart: () => setIsHoldingInput(true),
													onTouchEnd: () => setIsHoldingInput(false),
													className: `px-3 py-1 rounded-xl font-bold flex items-center gap-1.5 transition-all ${isHoldingInput ? "bg-amber-400 text-black" : "bg-white/10 text-white hover:bg-white/20"}`,
													children: [/* @__PURE__ */ jsx(Eye, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: isHoldingInput ? "Viewing Raw Input" : "Hold to View Input" })]
												}), /* @__PURE__ */ jsxs("div", {
													className: "hidden sm:flex items-center gap-2 text-neutral-300 font-mono text-[11px]",
													children: [/* @__PURE__ */ jsx("span", { children: "Drag Slider:" }), /* @__PURE__ */ jsx("input", {
														type: "range",
														min: "5",
														max: "95",
														value: sliderPosition,
														onChange: (e) => setSliderPosition(Number(e.target.value)),
														className: "accent-[#de4a2c] cursor-pointer w-24 h-1.5 bg-white/20 rounded-lg"
													})]
												})]
											}), /* @__PURE__ */ jsxs("span", {
												className: "text-[11px] font-mono text-emerald-400 font-bold",
												children: ["⚡ ", activeService.turnaround]
											})]
										})
									]
								})
							}), /* @__PURE__ */ jsxs("div", {
								className: "lg:col-span-4 flex flex-col justify-between space-y-3 sm:space-y-4",
								children: [/* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsx("div", {
										className: "text-xs font-mono font-bold text-[#de4a2c] uppercase tracking-wider mb-1 flex items-center gap-2",
										children: /* @__PURE__ */ jsxs("span", { children: ["SERVICE SPECIFICATION // ", activeService.code] })
									}),
									/* @__PURE__ */ jsx("h2", {
										className: "text-xl sm:text-2xl font-black text-white leading-tight",
										children: activeService.title
									}),
									/* @__PURE__ */ jsx("p", {
										className: "mt-1.5 text-xs text-neutral-300 leading-relaxed line-clamp-2",
										children: activeService.tagline
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "mt-2.5 p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs",
										children: [/* @__PURE__ */ jsx("div", {
											className: "text-[10px] font-mono text-neutral-400 uppercase font-bold",
											children: "Primary Target Audience:"
										}), /* @__PURE__ */ jsx("div", {
											className: "font-bold text-white mt-0.5",
											children: activeService.target
										})]
									}),
									/* @__PURE__ */ jsx("div", {
										className: "mt-2.5 space-y-1.5",
										children: activeService.specs.map((spec, i) => /* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-2 text-xs text-neutral-300",
											children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4 text-[#de4a2c] shrink-0" }), /* @__PURE__ */ jsx("span", { children: spec })]
										}, i))
									})
								] }), /* @__PURE__ */ jsxs("div", {
									className: "pt-1 flex flex-col sm:flex-row gap-2",
									children: [/* @__PURE__ */ jsxs("a", {
										href: "#interactive-grid",
										className: "flex-1 py-2.5 px-4 rounded-xl bg-[#de4a2c] hover:bg-[#c2381c] text-white text-xs font-bold text-center transition-colors shadow-md flex items-center justify-center gap-1.5",
										children: [/* @__PURE__ */ jsx("span", { children: "Explore All 5 Visuals" }), /* @__PURE__ */ jsx(ArrowRight, { className: "w-3.5 h-3.5" })]
									}), /* @__PURE__ */ jsx("a", {
										href: "#sample-upload",
										className: "py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold text-center transition-colors border border-white/15",
										children: "Test This Service"
									})]
								})]
							})]
						})]
					})
				]
			}),
			/* @__PURE__ */ jsxs("section", {
				id: "interactive-grid",
				className: "py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
						className: "inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#de4a2c] mb-2",
						children: [/* @__PURE__ */ jsx(Layers, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "VISUAL TRANSFORMATION ARCHITECTURE" })]
					}), /* @__PURE__ */ jsx("h2", {
						className: "text-3xl sm:text-5xl font-black tracking-tight text-white",
						children: "The 5 Image Services"
					})] }), /* @__PURE__ */ jsx("p", {
						className: "text-xs sm:text-sm text-neutral-400 max-w-md",
						children: "Side-by-side illustrated cards highlighting each service's real inputs, generative AI workflow, and production deliverables."
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "space-y-12",
					children: AI_VISUAL_SERVICES.map((service, idx) => /* @__PURE__ */ jsxs("div", {
						className: "rounded-3xl p-6 sm:p-8 bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all shadow-xl",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ jsx("span", {
										className: "w-9 h-9 rounded-xl bg-[#de4a2c] text-white font-mono font-black text-sm flex items-center justify-center shadow-md",
										children: service.code
									}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
										className: "text-[10px] font-mono font-bold text-[#de4a2c] uppercase tracking-wider",
										children: service.badge
									}), /* @__PURE__ */ jsx("h3", {
										className: "text-xl sm:text-2xl font-black text-white mt-0.5",
										children: service.title
									})] })]
								}), /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-3 text-xs font-mono",
									children: [/* @__PURE__ */ jsxs("span", {
										className: "px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-neutral-300",
										children: ["Target: ", /* @__PURE__ */ jsx("strong", {
											className: "text-white",
											children: service.target
										})]
									}), /* @__PURE__ */ jsx("span", {
										className: "px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold",
										children: service.turnaround
									})]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "lg:col-span-5 rounded-2xl overflow-hidden border border-white/10 bg-neutral-900 group relative",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "h-64 sm:h-72 overflow-hidden relative",
											children: [/* @__PURE__ */ jsx("img", {
												src: service.inputVisual.image,
												alt: service.inputVisual.label,
												className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90"
											}), /* @__PURE__ */ jsxs("div", {
												className: "absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-[10px] font-mono font-bold text-neutral-300",
												children: ["1. ", service.inputVisual.label]
											})]
										}), /* @__PURE__ */ jsxs("div", {
											className: "p-4 bg-black/40 border-t border-white/10",
											children: [/* @__PURE__ */ jsx("div", {
												className: "text-xs font-bold text-white",
												children: service.inputVisual.badge
											}), /* @__PURE__ */ jsx("div", {
												className: "text-[11px] text-neutral-400 mt-0.5",
												children: service.inputVisual.desc
											})]
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "lg:col-span-2 flex flex-col items-center justify-center py-2 text-center",
										children: [
											/* @__PURE__ */ jsx("div", {
												className: "w-12 h-12 rounded-full bg-white/[0.05] border border-white/15 flex items-center justify-center text-[#de4a2c] shadow-lg mb-2",
												children: /* @__PURE__ */ jsx(Wand2, { className: "w-5 h-5 animate-pulse" })
											}),
											/* @__PURE__ */ jsx("span", {
												className: "text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest",
												children: "AI PIPELINE"
											}),
											/* @__PURE__ */ jsx("span", {
												className: "text-[11px] font-extrabold text-white mt-0.5",
												children: "100% Guaranteed Fidelity"
											})
										]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "lg:col-span-5 rounded-2xl overflow-hidden border-2 border-[#de4a2c]/60 bg-neutral-900 group relative shadow-[0_0_30px_rgba(222,74,44,0.15)]",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "h-64 sm:h-72 overflow-hidden relative",
											children: [/* @__PURE__ */ jsx("img", {
												src: service.outputVisual.image,
												alt: service.outputVisual.label,
												className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
											}), /* @__PURE__ */ jsxs("div", {
												className: "absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#de4a2c] text-[10px] font-mono font-bold text-white shadow-md",
												children: ["2. ", service.outputVisual.label]
											})]
										}), /* @__PURE__ */ jsxs("div", {
											className: "p-4 bg-black/60 border-t border-white/10",
											children: [/* @__PURE__ */ jsx("div", {
												className: "text-xs font-bold text-white",
												children: service.outputVisual.badge
											}), /* @__PURE__ */ jsx("div", {
												className: "text-[11px] text-neutral-300 mt-0.5",
												children: service.outputVisual.desc
											})]
										})]
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4",
								children: [/* @__PURE__ */ jsx("div", {
									className: "flex flex-wrap items-center gap-2",
									children: service.specs.map((sp, sIdx) => /* @__PURE__ */ jsxs("span", {
										className: "px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/10 text-[11px] text-neutral-300",
										children: ["✓ ", sp]
									}, sIdx))
								}), /* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => {
										setSelectedTryoutService(service.id);
										document.getElementById("sample-upload")?.scrollIntoView({ behavior: "smooth" });
									},
									className: "px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-[#de4a2c] text-white text-xs font-bold transition-colors flex items-center gap-1.5",
									children: [/* @__PURE__ */ jsxs("span", { children: [
										"Test ",
										service.code,
										" Free"
									] }), /* @__PURE__ */ jsx(ArrowRight, { className: "w-3.5 h-3.5" })]
								})]
							})
						]
					}, service.id))
				})]
			}),
			/* @__PURE__ */ jsx("section", {
				id: "sample-upload",
				className: "py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10",
				children: /* @__PURE__ */ jsx("div", {
					className: "rounded-[36px] p-8 sm:p-14 bg-gradient-to-br from-white/[0.04] via-white/[0.02] to-transparent border border-[#de4a2c]/30 shadow-2xl relative overflow-hidden",
					children: /* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 lg:grid-cols-12 gap-10 items-center",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "lg:col-span-6 space-y-5",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#de4a2c]/10 border border-[#de4a2c]/30 text-xs font-mono font-bold text-[#de4a2c] uppercase",
									children: [/* @__PURE__ */ jsx(Sparkles, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "COMPLIMENTARY VISUAL PILOT" })]
								}),
								/* @__PURE__ */ jsx("h2", {
									className: "text-3xl sm:text-5xl font-black text-white leading-tight",
									children: "Test Any of the 5 Services Free"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-neutral-300 text-sm sm:text-base leading-relaxed",
									children: "Choose the service matching your catalog need, drop your raw photos or selfies, and our AI visual pipeline will return master deliverables with zero obligation."
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "pt-2",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400 block mb-2",
										children: "Select Visual Service:"
									}), /* @__PURE__ */ jsx("div", {
										className: "grid grid-cols-1 sm:grid-cols-2 gap-2",
										children: AI_VISUAL_SERVICES.map((s) => /* @__PURE__ */ jsxs("button", {
											type: "button",
											onClick: () => setSelectedTryoutService(s.id),
											className: `p-3 rounded-xl border text-left transition-all text-xs flex items-center justify-between ${selectedTryoutService === s.id ? "bg-[#de4a2c] text-white border-[#de4a2c] shadow-md font-bold" : "bg-white/[0.03] text-neutral-300 border-white/10 hover:bg-white/[0.06]"}`,
											children: [/* @__PURE__ */ jsxs("span", {
												className: "truncate",
												children: [
													s.code,
													" • ",
													s.badge
												]
											}), /* @__PURE__ */ jsx("span", {
												className: "text-[10px] font-mono opacity-80 shrink-0 ml-1",
												children: selectedTryoutService === s.id ? "✓" : ""
											})]
										}, s.id))
									})]
								})
							]
						}), /* @__PURE__ */ jsx("div", {
							className: "lg:col-span-6",
							children: !formSubmitted ? /* @__PURE__ */ jsxs("form", {
								onSubmit: (e) => {
									e.preventDefault();
									setFormSubmitted(true);
								},
								className: "space-y-4 p-6 sm:p-8 rounded-3xl bg-black/60 border border-white/15 backdrop-blur-xl",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "border-2 border-dashed border-white/20 hover:border-[#de4a2c] rounded-2xl p-8 text-center cursor-pointer transition-colors bg-white/[0.02]",
										children: [
											/* @__PURE__ */ jsx(Upload, { className: "w-8 h-8 text-[#de4a2c] mx-auto mb-2" }),
											/* @__PURE__ */ jsx("div", {
												className: "text-sm font-bold text-white",
												children: "Drop 1–5 sample images or selfies here"
											}),
											/* @__PURE__ */ jsx("div", {
												className: "text-xs text-neutral-400 mt-1",
												children: "Supports JPG, PNG, PSD, TIFF or smartphone camera RAW"
											})
										]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
										children: [/* @__PURE__ */ jsx("input", {
											type: "text",
											required: true,
											placeholder: "Your Company / Brand Name",
											className: "px-4 py-3 rounded-xl bg-white/[0.06] border border-white/15 text-sm text-white placeholder-neutral-400 focus:outline-none focus:border-[#de4a2c]"
										}), /* @__PURE__ */ jsx("input", {
											type: "email",
											required: true,
											placeholder: "Work Email Address",
											className: "px-4 py-3 rounded-xl bg-white/[0.06] border border-white/15 text-sm text-white placeholder-neutral-400 focus:outline-none focus:border-[#de4a2c]"
										})]
									}),
									/* @__PURE__ */ jsxs("button", {
										type: "submit",
										className: "w-full py-4 rounded-xl bg-[#de4a2c] hover:bg-[#c2381c] text-white font-black text-sm tracking-wide transition-colors shadow-lg flex items-center justify-center gap-2 cursor-pointer",
										children: [/* @__PURE__ */ jsx("span", { children: "Generate Free Sample Batch" }), /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-center gap-4 text-[11px] text-neutral-400 font-mono",
										children: [
											/* @__PURE__ */ jsxs("span", {
												className: "flex items-center gap-1",
												children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "w-3.5 h-3.5 text-emerald-400" }), /* @__PURE__ */ jsx("span", { children: "Strict NDA Protected" })]
											}),
											/* @__PURE__ */ jsx("span", { children: "•" }),
											/* @__PURE__ */ jsx("span", { children: "No Credit Card" })
										]
									})
								]
							}) : /* @__PURE__ */ jsxs("div", {
								className: "p-8 text-center rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-white space-y-3",
								children: [
									/* @__PURE__ */ jsx(CheckCircle2, { className: "w-12 h-12 text-emerald-400 mx-auto" }),
									/* @__PURE__ */ jsx("h3", {
										className: "text-xl font-bold",
										children: "Visual Batch Queued for Generation"
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-xs sm:text-sm text-neutral-300 max-w-md mx-auto",
										children: "Your sample assets have been routed to our dedicated AI visual desk. Master files will be emailed to you shortly."
									}),
									/* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => setFormSubmitted(false),
										className: "text-xs font-bold text-[#de4a2c] underline pt-2 inline-block cursor-pointer",
										children: "Upload another sample batch"
									})
								]
							})
						})]
					})
				})
			})
		]
	});
}
//#endregion
export { HomeVisual };
