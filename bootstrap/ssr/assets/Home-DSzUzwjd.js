import { useEffect, useRef, useState } from "react";
import { Head } from "@inertiajs/react";
import { ArrowUpRight, Check, CheckCircle2, Maximize2, Palette, Scissors, SlidersHorizontal, Sun, Upload, Wand2, X } from "lucide-react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Home.tsx
var HERO_SHOWCASE_PLATES = [
	{
		id: "apparel",
		category: "Apparel & Fashion",
		badge: "3D GHOST MANNEQUIN & EDITORIAL",
		title: "Invisible Mannequin & Garment Drape",
		metric: "Natural Volume • Zero Halo Cutout",
		image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1800&q=85",
		rawFilter: "brightness(0.75) contrast(0.82) saturate(0.5) sepia(0.12)",
		doneFilter: "brightness(1.04) contrast(1.08) saturate(1.1)",
		tintColor: "#EAE6DF"
	},
	{
		id: "footwear",
		category: "Footwear",
		badge: "PRECISION PEN-TOOL PATH",
		title: "Multi-Path Cutout & Ground Shadow",
		metric: "300% Zoom Edge Accuracy",
		image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1800&q=85",
		rawFilter: "brightness(0.78) contrast(0.8) saturate(0.45) sepia(0.15)",
		doneFilter: "brightness(1.05) contrast(1.1) saturate(1.14) drop-shadow(0 28px 26px rgba(15,15,18,0.22))",
		tintColor: "#EEF2FF"
	},
	{
		id: "jewelry",
		category: "Fine Jewelry",
		badge: "MACRO FOCUS STACKING",
		title: "Micro-Dust Removal & Gem Brilliance",
		metric: "Prong Rebuild • Metal Specular Polish",
		image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1800&q=85",
		rawFilter: "brightness(0.7) contrast(0.78) grayscale(0.45)",
		doneFilter: "brightness(1.08) contrast(1.15) saturate(1.08)",
		tintColor: "#F3F4F6"
	},
	{
		id: "hardgoods",
		category: "Hard Goods & Beauty",
		badge: "SPECULAR & REFLECTION GRADE",
		title: "Glass Reflection & Label Rebuild",
		metric: "Clean Highlights • Color Match",
		image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1800&q=85",
		rawFilter: "brightness(0.76) contrast(0.82) saturate(0.5)",
		doneFilter: "brightness(1.06) contrast(1.12) saturate(1.1)",
		tintColor: "#FDF2F8"
	}
];
var ACCORDION_PANELS = [
	{
		id: "acc-1",
		tag: "PRECISION PATH",
		title: "Precision Clipping",
		metric: "100% Hand-Drawn Pen Tool Paths",
		image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=85",
		rawFilter: "brightness(0.75) contrast(0.82) saturate(0.45) sepia(0.2)"
	},
	{
		id: "acc-2",
		tag: "APPAREL STUDIO",
		title: "3D Ghost Mannequin",
		metric: "Symmetrical Drape",
		image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=85",
		rawFilter: "brightness(0.74) contrast(0.8) saturate(0.5)"
	},
	{
		id: "acc-3",
		tag: "LUXURY MACRO",
		title: "Fine Jewelry Polish",
		metric: "Gem & Metal Clarity",
		image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85",
		rawFilter: "brightness(0.72) contrast(0.78) grayscale(0.45)"
	},
	{
		id: "acc-4",
		tag: "COLOR ACCURACY",
		title: "Multi-SKU Recolor",
		metric: "Zero Reshoot Needed",
		image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=1200&q=85",
		rawFilter: "hue-rotate(140deg) brightness(0.82) saturate(0.75)"
	},
	{
		id: "acc-5",
		tag: "SPECULAR FINISH",
		title: "Cosmetics & Glass",
		metric: "Specular Highlights",
		image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=85",
		rawFilter: "brightness(0.75) contrast(0.82) saturate(0.55)"
	}
];
var BENTO_PORTFOLIO = [
	{
		id: "bento-1",
		span: "lg:col-span-7",
		height: "h-[420px]",
		tag: "FOOTWEAR COMPOSITE",
		title: "Dynamic Levitation & Floor Shadow",
		turnaround: "6h Express Turnaround",
		image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1400&q=85",
		rawFilter: "brightness(0.76) contrast(0.82) saturate(0.45) sepia(0.15)"
	},
	{
		id: "bento-2",
		span: "lg:col-span-5",
		height: "h-[420px]",
		tag: "HOROLOGY & METALS",
		title: "Chronograph Anti-Glare Polish",
		turnaround: "12h Studio SLA",
		image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85",
		rawFilter: "brightness(0.72) contrast(0.78) saturate(0.4)"
	},
	{
		id: "bento-3",
		span: "lg:col-span-5",
		height: "h-[420px]",
		tag: "BOTANICAL & GLASS",
		title: "Translucent Glass & Drop Refraction",
		turnaround: "12h Studio SLA",
		image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=85",
		rawFilter: "brightness(0.75) contrast(0.8) grayscale(0.45)"
	},
	{
		id: "bento-4",
		span: "lg:col-span-7",
		height: "h-[420px]",
		tag: "HIGH-FASHION EDITORIAL",
		title: "Color Grading & Fabric Texture Recovery",
		turnaround: "Custom Campaign SLA",
		image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1400&q=85",
		rawFilter: "brightness(0.74) contrast(0.8) saturate(0.5)"
	}
];
var SKU_SWATCHES = [
	{
		name: "Crimson Original",
		hue: 0,
		hex: "#EF4444"
	},
	{
		name: "Cobalt Electric",
		hue: 215,
		hex: "#2563EB"
	},
	{
		name: "Emerald Volt",
		hue: 125,
		hex: "#10B981"
	},
	{
		name: "Sunset Violet",
		hue: 285,
		hex: "#8B5CF6"
	}
];
function Home(_props) {
	const [heroTabIdx, setHeroTabIdx] = useState(0);
	const currentHero = HERO_SHOWCASE_PLATES[heroTabIdx];
	const [splitPos, setSplitPos] = useState(50);
	const [isDraggingSplit, setIsDraggingSplit] = useState(false);
	const [heroFinishMode, setHeroFinishMode] = useState("master");
	const heroStageRef = useRef(null);
	const [expandedAccordion, setExpandedAccordion] = useState(1);
	const [accordionRawMap, setAccordionRawMap] = useState({});
	const [layerCutout, setLayerCutout] = useState(true);
	const [layerShadow, setLayerShadow] = useState(true);
	const [layerPolish, setLayerPolish] = useState(true);
	const [activeSwatchIdx, setActiveSwatchIdx] = useState(0);
	const [globalRawMode, setGlobalRawMode] = useState(false);
	const [hoveredBentoId, setHoveredBentoId] = useState(null);
	const [lightboxItem, setLightboxItem] = useState(null);
	const [selectedCapabilities, setSelectedCapabilities] = useState(["Precision Clipping", "3D Ghost Mannequin"]);
	const [selectedTurnaround, setSelectedTurnaround] = useState("12h Express");
	const [trialSubmitted, setTrialSubmitted] = useState(false);
	const [uploadedFiles, setUploadedFiles] = useState([]);
	const fileInputRef = useRef(null);
	const updateSplitPosition = (clientX) => {
		if (!heroStageRef.current) return;
		const rect = heroStageRef.current.getBoundingClientRect();
		const x = Math.max(12, Math.min(clientX - rect.left, rect.width - 12));
		setSplitPos(x / rect.width * 100);
	};
	useEffect(() => {
		const onMove = (e) => {
			if (isDraggingSplit) updateSplitPosition(e.clientX);
		};
		const onTouch = (e) => {
			if (isDraggingSplit && e.touches[0]) updateSplitPosition(e.touches[0].clientX);
		};
		const onUp = () => setIsDraggingSplit(false);
		if (isDraggingSplit) {
			window.addEventListener("mousemove", onMove);
			window.addEventListener("touchmove", onTouch);
			window.addEventListener("mouseup", onUp);
			window.addEventListener("touchend", onUp);
		}
		return () => {
			window.removeEventListener("mousemove", onMove);
			window.removeEventListener("touchmove", onTouch);
			window.removeEventListener("mouseup", onUp);
			window.removeEventListener("touchend", onUp);
		};
	}, [isDraggingSplit]);
	const toggleCapabilityPill = (cap) => {
		setSelectedCapabilities((prev) => prev.includes(cap) ? prev.filter((item) => item !== cap) : [...prev, cap]);
	};
	const handleFileChange = (e) => {
		if (e.target.files && e.target.files.length > 0) setUploadedFiles(Array.from(e.target.files));
	};
	const getPlaygroundFilter = () => {
		return `hue-rotate(${SKU_SWATCHES[activeSwatchIdx].hue}deg) ${layerPolish ? "brightness(1.06) contrast(1.1) saturate(1.12)" : "brightness(0.84) contrast(0.86) saturate(0.65)"} ${layerShadow ? "drop-shadow(0 32px 24px rgba(15,15,18,0.28))" : "drop-shadow(0 2px 4px rgba(15,15,18,0.06))"}`;
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-[#F8F9FA] text-[#0F0F12] antialiased selection:bg-[#0F0F12] selection:text-white",
		children: [
			/* @__PURE__ */ jsxs(Head, { children: [/* @__PURE__ */ jsx("title", { children: "CuttingEdger — Creative Digital Post-Production Studio" }), /* @__PURE__ */ jsx("meta", {
				name: "description",
				content: "Visual post-production for modern brands. 3D ghost mannequin, precision clipping, jewelry polish, cosmetics, and multi-SKU colorways."
			})] }),
			/* @__PURE__ */ jsx("style", { children: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        body {
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .checkerboard-subtle {
          background-color: #ffffff;
          background-image: 
            linear-gradient(45deg, #f1f5f9 25%, transparent 25%), 
            linear-gradient(-45deg, #f1f5f9 25%, transparent 25%), 
            linear-gradient(45deg, transparent 75%, #f1f5f9 75%), 
            linear-gradient(-45deg, transparent 75%, #f1f5f9 75%);
          background-size: 24px 24px;
          background-position: 0 0, 0 12px, 12px -12px, -12px 0px;
        }
      ` }),
			/* @__PURE__ */ jsx("div", {
				className: "sticky top-5 z-50 px-4 sm:px-8 pointer-events-none",
				children: /* @__PURE__ */ jsxs("header", {
					className: "max-w-7xl mx-auto h-16 px-6 rounded-full bg-white/90 backdrop-blur-xl border border-neutral-200/80 shadow-[0_8px_30px_rgba(15,15,18,0.04)] flex items-center justify-between pointer-events-auto",
					children: [
						/* @__PURE__ */ jsxs("a", {
							href: "#",
							className: "text-lg font-extrabold tracking-tight text-[#0F0F12] flex items-center gap-2",
							children: [/* @__PURE__ */ jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" }), /* @__PURE__ */ jsx("span", { children: "CuttingEdger." })]
						}),
						/* @__PURE__ */ jsxs("nav", {
							className: "hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-neutral-500",
							children: [
								/* @__PURE__ */ jsx("a", {
									href: "#capabilities",
									className: "hover:text-[#0F0F12] transition-colors",
									children: "Capabilities"
								}),
								/* @__PURE__ */ jsx("a", {
									href: "#interactive-studio",
									className: "hover:text-[#0F0F12] transition-colors",
									children: "Interactive Studio"
								}),
								/* @__PURE__ */ jsx("a", {
									href: "#portfolio",
									className: "hover:text-[#0F0F12] transition-colors",
									children: "Portfolio"
								}),
								/* @__PURE__ */ jsx("a", {
									href: "#free-sample",
									className: "hover:text-[#0F0F12] transition-colors",
									children: "Free Sample"
								})
							]
						}),
						/* @__PURE__ */ jsxs("a", {
							href: "#free-sample",
							className: "px-5 py-2.5 rounded-full bg-[#0F0F12] text-white text-xs font-bold hover:bg-neutral-800 transition-all flex items-center gap-1.5",
							children: [/* @__PURE__ */ jsx("span", { children: "Start Free Trial" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-3.5 h-3.5" })]
						})
					]
				})
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "max-w-7xl mx-auto px-4 sm:px-8 pt-10 pb-12",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-7",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
						className: "text-[11px] font-extrabold uppercase tracking-widest text-emerald-600 block mb-2",
						children: "CREATIVE DIGITAL POST-PRODUCTION STUDIO"
					}), /* @__PURE__ */ jsx("h1", {
						className: "text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0F0F12] leading-[1.08]",
						children: "Visual Post-Production for Modern Brands."
					})] }), /* @__PURE__ */ jsx("div", {
						className: "flex flex-wrap items-center gap-2",
						children: HERO_SHOWCASE_PLATES.map((plate, index) => {
							return /* @__PURE__ */ jsx("button", {
								onClick: () => {
									setHeroTabIdx(index);
									setHeroFinishMode("master");
								},
								className: `px-4 py-2.5 rounded-full text-xs font-bold transition-all ${heroTabIdx === index ? "bg-[#0F0F12] text-white shadow-sm" : "bg-white text-neutral-600 hover:text-[#0F0F12] border border-neutral-200/80"}`,
								children: plate.category
							}, plate.id);
						})
					})]
				}), /* @__PURE__ */ jsxs("div", {
					ref: heroStageRef,
					onMouseDown: (e) => {
						setIsDraggingSplit(true);
						updateSplitPosition(e.clientX);
					},
					onTouchStart: (e) => {
						setIsDraggingSplit(true);
						if (e.touches[0]) updateSplitPosition(e.touches[0].clientX);
					},
					className: "relative w-full h-[460px] sm:h-[540px] rounded-[32px] overflow-hidden select-none cursor-ew-resize border border-neutral-200/80 shadow-[0_20px_50px_rgba(15,15,18,0.06)] bg-white",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: `absolute inset-0 transition-colors duration-500 ${heroFinishMode === "white" ? "checkerboard-subtle" : ""}`,
							style: heroFinishMode === "tint" ? { backgroundColor: currentHero.tintColor } : void 0,
							children: /* @__PURE__ */ jsx("img", {
								src: currentHero.image,
								alt: currentHero.title,
								draggable: "false",
								className: `w-full h-full object-cover object-center transition-all duration-700 ${heroFinishMode === "white" || heroFinishMode === "tint" ? "mix-blend-multiply scale-95 object-contain" : ""}`,
								style: { filter: heroFinishMode === "raw" ? currentHero.rawFilter : currentHero.doneFilter }
							}, `hero-after-${currentHero.id}`)
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "absolute inset-0 overflow-hidden bg-[#D6D3CD]",
							style: { clipPath: `inset(0 ${100 - splitPos}% 0 0)` },
							children: [/* @__PURE__ */ jsx("img", {
								src: currentHero.image,
								alt: "Unedited Raw",
								draggable: "false",
								className: "w-full h-full object-cover object-center transition-all duration-700",
								style: { filter: currentHero.rawFilter }
							}, `hero-before-${currentHero.id}`), /* @__PURE__ */ jsx("span", {
								className: "absolute top-5 left-5 px-3.5 py-1.5 rounded-full bg-black/65 backdrop-blur-md text-white text-[11px] font-extrabold tracking-wide",
								children: "RAW CAPTURE"
							})]
						}),
						/* @__PURE__ */ jsx("div", {
							onClick: (e) => e.stopPropagation(),
							onMouseDown: (e) => e.stopPropagation(),
							className: "absolute top-5 right-5 z-20 flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-full shadow-md border border-neutral-200/80",
							children: [
								{
									id: "master",
									label: "Studio Master"
								},
								{
									id: "white",
									label: "Cutout View"
								},
								{
									id: "tint",
									label: "Editorial Backdrop"
								},
								{
									id: "raw",
									label: "Full Raw"
								}
							].map((mode) => /* @__PURE__ */ jsx("button", {
								onClick: () => setHeroFinishMode(mode.id),
								className: `px-3 py-1 rounded-full text-[11px] font-extrabold transition-all ${heroFinishMode === mode.id ? "bg-[#0F0F12] text-white" : "text-neutral-600 hover:text-[#0F0F12]"}`,
								children: mode.label
							}, mode.id))
						}),
						/* @__PURE__ */ jsx("div", {
							className: "absolute top-0 bottom-0 z-10 w-0.5 bg-white/90 shadow-[0_0_16px_rgba(0,0,0,0.35)] pointer-events-none",
							style: { left: `${splitPos}%` },
							children: /* @__PURE__ */ jsx("div", {
								className: "absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white text-[#0F0F12] shadow-xl flex items-center justify-center border border-neutral-200",
								children: /* @__PURE__ */ jsx(SlidersHorizontal, { className: "w-4 h-4" })
							})
						}),
						/* @__PURE__ */ jsx("div", { className: "absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" }),
						/* @__PURE__ */ jsxs("div", {
							onClick: (e) => e.stopPropagation(),
							onMouseDown: (e) => e.stopPropagation(),
							className: "absolute bottom-0 inset-x-0 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white z-20",
							children: [/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-[11px] font-extrabold uppercase tracking-wider text-emerald-300 block",
									children: currentHero.badge
								}),
								/* @__PURE__ */ jsx("h2", {
									className: "text-xl sm:text-2xl font-extrabold tracking-tight mt-0.5",
									children: currentHero.title
								}),
								/* @__PURE__ */ jsxs("span", {
									className: "text-xs text-neutral-300 font-medium mt-1 block",
									children: [currentHero.metric, " • Drag anywhere to compare RAW vs. Master"]
								})
							] }), /* @__PURE__ */ jsxs("a", {
								href: "#free-sample",
								className: "px-5 py-3 rounded-full bg-white text-[#0F0F12] text-xs font-extrabold hover:bg-emerald-400 transition-colors flex items-center gap-2 self-start sm:self-auto shadow-lg",
								children: [/* @__PURE__ */ jsx("span", { children: "Request Free Sample" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4" })]
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsx("section", {
				id: "capabilities",
				className: "py-12 px-4 sm:px-8",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-7xl mx-auto",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex flex-col sm:flex-row sm:items-end justify-between mb-7 gap-2",
						children: [/* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h2", {
							className: "text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F0F12]",
							children: "Core Studio Capabilities"
						}) }), /* @__PURE__ */ jsx("p", {
							className: "text-xs sm:text-sm font-semibold text-neutral-500",
							children: "Hover or tap any vertical panel to expand • Click badge to flip RAW / DONE"
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "flex flex-col lg:flex-row gap-3.5 h-auto lg:h-[500px]",
						children: ACCORDION_PANELS.map((panel, idx) => {
							const isExpanded = expandedAccordion === idx;
							const isRaw = !!accordionRawMap[panel.id];
							return /* @__PURE__ */ jsxs("div", {
								onMouseEnter: () => setExpandedAccordion(idx),
								onClick: () => setExpandedAccordion(idx),
								className: `relative rounded-[28px] overflow-hidden cursor-pointer transition-all duration-500 ease-out border border-neutral-200/80 bg-white ${isExpanded ? "lg:flex-[3.5] h-[380px] lg:h-full shadow-xl" : "lg:flex-[1] h-[120px] lg:h-full opacity-95 hover:opacity-100"}`,
								children: [
									/* @__PURE__ */ jsx("img", {
										src: panel.image,
										alt: panel.title,
										className: "w-full h-full object-cover object-center transition-all duration-500",
										style: { filter: isRaw ? panel.rawFilter : "brightness(1.04) contrast(1.06)" }
									}),
									/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" }),
									isExpanded && /* @__PURE__ */ jsx("button", {
										onClick: (e) => {
											e.stopPropagation();
											setAccordionRawMap((prev) => ({
												...prev,
												[panel.id]: !prev[panel.id]
											}));
										},
										className: `absolute top-4 right-4 z-20 px-4 py-1.5 rounded-full text-xs font-extrabold transition-all shadow-md ${isRaw ? "bg-amber-400 text-[#0F0F12]" : "bg-white text-[#0F0F12] hover:bg-neutral-100"}`,
										children: isRaw ? "Viewing: RAW (Click for Edited)" : "Viewing: EDITED (Click for Raw)"
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "absolute bottom-0 inset-x-0 p-5 sm:p-6 flex items-end justify-between text-white",
										children: [/* @__PURE__ */ jsxs("div", { children: [
											/* @__PURE__ */ jsx("span", {
												className: "text-[11px] font-extrabold uppercase tracking-wider text-emerald-300 block",
												children: panel.tag
											}),
											/* @__PURE__ */ jsx("h3", {
												className: `font-extrabold tracking-tight transition-all ${isExpanded ? "text-xl sm:text-2xl mt-0.5" : "text-base"}`,
												children: panel.title
											}),
											isExpanded && /* @__PURE__ */ jsx("span", {
												className: "text-xs text-neutral-300 font-medium mt-1 block",
												children: panel.metric
											})
										] }), isExpanded && /* @__PURE__ */ jsx("a", {
											href: "#free-sample",
											onClick: (e) => e.stopPropagation(),
											className: "w-10 h-10 rounded-full bg-white text-[#0F0F12] flex items-center justify-center hover:bg-emerald-400 transition-colors shrink-0 shadow-md",
											title: "Try this capability",
											children: /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4" })
										})]
									})
								]
							}, panel.id);
						})
					})]
				})
			}),
			/* @__PURE__ */ jsx("section", {
				id: "interactive-studio",
				className: "py-12 px-4 sm:px-8",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-7xl mx-auto",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex flex-col sm:flex-row sm:items-end justify-between mb-7 gap-2",
						children: [/* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h2", {
							className: "text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F0F12]",
							children: "Interactive Retouching Studio"
						}) }), /* @__PURE__ */ jsx("p", {
							className: "text-xs sm:text-sm font-semibold text-neutral-500",
							children: "Toggle non-destructive studio layers & live SKU colorways in real time"
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch",
						children: [/* @__PURE__ */ jsxs("div", {
							className: `lg:col-span-8 relative h-[420px] sm:h-[460px] rounded-[28px] overflow-hidden border border-neutral-200/80 shadow-sm flex items-center justify-center transition-colors duration-500 ${layerCutout ? "checkerboard-subtle" : "bg-[#D8D5CE]"}`,
							children: [
								/* @__PURE__ */ jsx("img", {
									src: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1400&q=85",
									alt: "Interactive Studio Sample",
									className: `w-full h-full object-cover object-center transition-all duration-500 ${layerCutout ? "mix-blend-multiply scale-90 object-contain" : ""}`,
									style: { filter: getPlaygroundFilter() }
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "absolute top-4 right-4 px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-neutral-200/80 text-xs font-extrabold text-[#0F0F12] shadow-sm",
									children: ["Active SKU: ", SKU_SWATCHES[activeSwatchIdx].name]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/75 via-black/25 to-transparent flex items-end justify-between text-white",
									children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
										className: "text-[11px] font-extrabold uppercase tracking-wider text-emerald-300 block",
										children: "LIVE LAYER PREVIEW"
									}), /* @__PURE__ */ jsx("h3", {
										className: "text-xl font-extrabold tracking-tight mt-0.5",
										children: "Multi-Layer PSD Production Pipeline"
									})] }), /* @__PURE__ */ jsx("button", {
										onClick: () => {
											setLayerCutout(false);
											setLayerShadow(false);
											setLayerPolish(false);
											setActiveSwatchIdx(0);
										},
										className: "px-3.5 py-1.5 rounded-full bg-white/20 hover:bg-white text-white hover:text-[#0F0F12] text-xs font-bold backdrop-blur-md transition-colors",
										children: "Reset to Raw"
									})]
								})
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "lg:col-span-4 rounded-[28px] bg-white border border-neutral-200/80 p-6 flex flex-col justify-between shadow-sm",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "space-y-3",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 block",
										children: "STUDIO FINISHING CONTROLS"
									}),
									/* @__PURE__ */ jsx("h3", {
										className: "text-lg font-extrabold text-[#0F0F12]",
										children: "Customize Post-Production"
									}),
									/* @__PURE__ */ jsxs("button", {
										type: "button",
										onClick: () => setLayerCutout(!layerCutout),
										className: `w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${layerCutout ? "bg-[#0F0F12] text-white border-[#0F0F12]" : "bg-[#F8F9FA] text-[#0F0F12] border-neutral-200/80"}`,
										children: [/* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-3",
											children: [/* @__PURE__ */ jsx(Scissors, { className: "w-4 h-4 text-emerald-400 shrink-0" }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
												className: "text-xs font-extrabold",
												children: "Pen-Tool Background Cutout"
											}), /* @__PURE__ */ jsx("div", {
												className: "text-[11px] opacity-70",
												children: "300% zoom vector path"
											})] })]
										}), /* @__PURE__ */ jsx("div", {
											className: `w-5 h-5 rounded-full flex items-center justify-center ${layerCutout ? "bg-emerald-400 text-[#0F0F12]" : "bg-neutral-200"}`,
											children: layerCutout && /* @__PURE__ */ jsx(Check, { className: "w-3 h-3 stroke-[3]" })
										})]
									}),
									/* @__PURE__ */ jsxs("button", {
										type: "button",
										onClick: () => setLayerShadow(!layerShadow),
										className: `w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${layerShadow ? "bg-[#0F0F12] text-white border-[#0F0F12]" : "bg-[#F8F9FA] text-[#0F0F12] border-neutral-200/80"}`,
										children: [/* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-3",
											children: [/* @__PURE__ */ jsx(Sun, { className: "w-4 h-4 text-emerald-400 shrink-0" }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
												className: "text-xs font-extrabold",
												children: "Natural Floor Shadow"
											}), /* @__PURE__ */ jsx("div", {
												className: "text-[11px] opacity-70",
												children: "Soft grounded studio depth"
											})] })]
										}), /* @__PURE__ */ jsx("div", {
											className: `w-5 h-5 rounded-full flex items-center justify-center ${layerShadow ? "bg-emerald-400 text-[#0F0F12]" : "bg-neutral-200"}`,
											children: layerShadow && /* @__PURE__ */ jsx(Check, { className: "w-3 h-3 stroke-[3]" })
										})]
									}),
									/* @__PURE__ */ jsxs("button", {
										type: "button",
										onClick: () => setLayerPolish(!layerPolish),
										className: `w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${layerPolish ? "bg-[#0F0F12] text-white border-[#0F0F12]" : "bg-[#F8F9FA] text-[#0F0F12] border-neutral-200/80"}`,
										children: [/* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-3",
											children: [/* @__PURE__ */ jsx(Wand2, { className: "w-4 h-4 text-emerald-400 shrink-0" }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
												className: "text-xs font-extrabold",
												children: "Studio Polish & Contrast"
											}), /* @__PURE__ */ jsx("div", {
												className: "text-[11px] opacity-70",
												children: "Dust, glue & crease removal"
											})] })]
										}), /* @__PURE__ */ jsx("div", {
											className: `w-5 h-5 rounded-full flex items-center justify-center ${layerPolish ? "bg-emerald-400 text-[#0F0F12]" : "bg-neutral-200"}`,
											children: layerPolish && /* @__PURE__ */ jsx(Check, { className: "w-3 h-3 stroke-[3]" })
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "p-3.5 rounded-2xl bg-[#F8F9FA] border border-neutral-200/80",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "flex items-center justify-between mb-2.5",
											children: [/* @__PURE__ */ jsxs("span", {
												className: "text-xs font-extrabold flex items-center gap-1.5",
												children: [/* @__PURE__ */ jsx(Palette, { className: "w-3.5 h-3.5 text-emerald-600" }), "Instant SKU Color Match"]
											}), /* @__PURE__ */ jsx("span", {
												className: "text-[11px] font-semibold text-neutral-500",
												children: SKU_SWATCHES[activeSwatchIdx].name
											})]
										}), /* @__PURE__ */ jsx("div", {
											className: "flex items-center gap-2.5",
											children: SKU_SWATCHES.map((swatch, idx) => /* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => setActiveSwatchIdx(idx),
												className: `h-8 flex-1 rounded-xl transition-all border-2 ${activeSwatchIdx === idx ? "border-[#0F0F12] scale-105 shadow-sm" : "border-transparent opacity-75 hover:opacity-100"}`,
												style: { backgroundColor: swatch.hex },
												title: swatch.name
											}, swatch.name))
										})]
									})
								]
							}), /* @__PURE__ */ jsxs("a", {
								href: "#free-sample",
								className: "mt-5 w-full py-3.5 rounded-full bg-[#0F0F12] text-white text-xs font-extrabold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2",
								children: [/* @__PURE__ */ jsx("span", { children: "Test With Your Own Product" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4" })]
							})]
						})]
					})]
				})
			}),
			/* @__PURE__ */ jsx("section", {
				id: "portfolio",
				className: "py-12 px-4 sm:px-8",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-7xl mx-auto",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex flex-col sm:flex-row sm:items-end justify-between mb-7 gap-4",
						children: [/* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h2", {
							className: "text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F0F12]",
							children: "Curated Studio Lookbook"
						}) }), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 bg-white p-1.5 rounded-full border border-neutral-200/80 self-start sm:self-auto shadow-sm",
							children: [/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setGlobalRawMode(false),
								className: `px-4 py-1.5 rounded-full text-xs font-extrabold transition-all ${!globalRawMode ? "bg-[#0F0F12] text-white" : "text-neutral-500 hover:text-[#0F0F12]"}`,
								children: "Viewing: ALL EDITED"
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setGlobalRawMode(true),
								className: `px-4 py-1.5 rounded-full text-xs font-extrabold transition-all ${globalRawMode ? "bg-amber-400 text-[#0F0F12]" : "text-neutral-500 hover:text-[#0F0F12]"}`,
								children: "Viewing: ALL RAW"
							})]
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-1 lg:grid-cols-12 gap-5",
						children: BENTO_PORTFOLIO.map((card) => {
							const isHovered = hoveredBentoId === card.id;
							const showRaw = globalRawMode ? !isHovered : isHovered;
							return /* @__PURE__ */ jsxs("div", {
								onMouseEnter: () => setHoveredBentoId(card.id),
								onMouseLeave: () => setHoveredBentoId(null),
								onClick: () => setLightboxItem(card),
								className: `${card.span} ${card.height} relative rounded-[28px] overflow-hidden cursor-pointer border border-neutral-200/80 bg-white group shadow-sm hover:shadow-xl transition-all duration-500`,
								children: [
									/* @__PURE__ */ jsx("img", {
										src: card.image,
										alt: card.title,
										className: "w-full h-full object-cover object-center transition-all duration-700 group-hover:scale-105",
										style: { filter: showRaw ? card.rawFilter : "brightness(1.04) contrast(1.08)" }
									}),
									/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" }),
									/* @__PURE__ */ jsx("span", {
										className: `absolute top-4 right-4 px-4 py-1.5 rounded-full text-xs font-extrabold shadow-md transition-colors ${showRaw ? "bg-amber-400 text-[#0F0F12]" : "bg-white text-[#0F0F12]"}`,
										children: showRaw ? "Viewing: RAW (Hover for Edited)" : "Viewing: EDITED (Hover for Raw)"
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "absolute bottom-0 inset-x-0 p-6 flex items-end justify-between text-white",
										children: [/* @__PURE__ */ jsxs("div", { children: [
											/* @__PURE__ */ jsx("span", {
												className: "text-[11px] font-extrabold uppercase tracking-wider text-emerald-300 block",
												children: card.tag
											}),
											/* @__PURE__ */ jsx("h3", {
												className: "text-xl sm:text-2xl font-extrabold tracking-tight mt-0.5",
												children: card.title
											}),
											/* @__PURE__ */ jsx("span", {
												className: "text-xs text-neutral-300 font-medium mt-1 block",
												children: card.turnaround
											})
										] }), /* @__PURE__ */ jsx("div", {
											className: "w-10 h-10 rounded-full bg-white text-[#0F0F12] flex items-center justify-center group-hover:bg-emerald-400 transition-colors shrink-0 shadow-md",
											children: /* @__PURE__ */ jsx(Maximize2, { className: "w-4 h-4" })
										})]
									})
								]
							}, card.id);
						})
					})]
				})
			}),
			/* @__PURE__ */ jsx("section", {
				id: "free-sample",
				className: "py-12 px-4 sm:px-8",
				children: /* @__PURE__ */ jsx("div", {
					className: "max-w-7xl mx-auto rounded-[32px] bg-[#0F0F12] text-white p-7 sm:p-12 border border-neutral-800 shadow-xl",
					children: /* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 lg:grid-cols-12 gap-10 items-center",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "lg:col-span-6 space-y-6",
							children: [
								/* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsx("span", {
										className: "text-[11px] font-extrabold uppercase tracking-wider text-emerald-400 block",
										children: "COMPLIMENTARY STUDIO TEST"
									}),
									/* @__PURE__ */ jsx("h2", {
										className: "text-2xl sm:text-4xl font-extrabold tracking-tight mt-1",
										children: "Experience Our Quality With a Free Sample."
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-neutral-400 text-xs sm:text-sm mt-2 leading-relaxed",
										children: "Send us up to 3 RAW product or editorial images. We will retouch them to your exact brand specifications and return master files within hours."
									})
								] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
									className: "text-[11px] font-extrabold uppercase tracking-wider text-neutral-400 block mb-2.5",
									children: "1. SELECT DESIRED CAPABILITIES"
								}), /* @__PURE__ */ jsx("div", {
									className: "flex flex-wrap gap-2",
									children: [
										"Precision Clipping",
										"3D Ghost Mannequin",
										"Fine Jewelry Polish",
										"Multi-SKU Recolor",
										"Cosmetics & Glass"
									].map((cap) => {
										const active = selectedCapabilities.includes(cap);
										return /* @__PURE__ */ jsxs("button", {
											type: "button",
											onClick: () => toggleCapabilityPill(cap),
											className: `px-4 py-2 rounded-full text-xs font-extrabold transition-all flex items-center gap-1.5 ${active ? "bg-emerald-400 text-[#0F0F12]" : "bg-white/10 text-neutral-300 hover:bg-white/15"}`,
											children: [active && /* @__PURE__ */ jsx(Check, { className: "w-3.5 h-3.5 stroke-[3]" }), /* @__PURE__ */ jsx("span", { children: cap })]
										}, cap);
									})
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
									className: "text-[11px] font-extrabold uppercase tracking-wider text-neutral-400 block mb-2.5",
									children: "2. PREFERRED DELIVERY SLA"
								}), /* @__PURE__ */ jsx("div", {
									className: "grid grid-cols-3 gap-2.5",
									children: [
										"6h Rush SLA",
										"12h Express",
										"Custom Enterprise"
									].map((sla) => /* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => setSelectedTurnaround(sla),
										className: `py-2.5 px-3 rounded-2xl text-xs font-extrabold border transition-all ${selectedTurnaround === sla ? "bg-white text-[#0F0F12] border-white" : "bg-white/5 text-neutral-300 border-white/10 hover:bg-white/10"}`,
										children: sla
									}, sla))
								})] })
							]
						}), /* @__PURE__ */ jsx("div", {
							className: "lg:col-span-6",
							children: !trialSubmitted ? /* @__PURE__ */ jsxs("form", {
								onSubmit: (e) => {
									e.preventDefault();
									setTrialSubmitted(true);
								},
								className: "rounded-[26px] bg-white/5 border border-white/10 p-6 sm:p-8 space-y-4",
								children: [
									/* @__PURE__ */ jsxs("label", {
										onClick: () => fileInputRef.current?.click(),
										className: "block border-2 border-dashed border-white/20 hover:border-emerald-400 rounded-2xl p-7 text-center cursor-pointer transition-colors bg-white/5",
										children: [
											/* @__PURE__ */ jsx("input", {
												ref: fileInputRef,
												type: "file",
												multiple: true,
												className: "hidden",
												onChange: handleFileChange
											}),
											/* @__PURE__ */ jsx("div", {
												className: "w-11 h-11 rounded-full bg-emerald-400/20 text-emerald-300 flex items-center justify-center mx-auto mb-3",
												children: /* @__PURE__ */ jsx(Upload, { className: "w-5 h-5" })
											}),
											/* @__PURE__ */ jsx("span", {
												className: "text-sm font-extrabold text-white block",
												children: uploadedFiles.length > 0 ? `${uploadedFiles.length} RAW file(s) attached` : "Drop RAW files here or click to browse"
											}),
											/* @__PURE__ */ jsx("span", {
												className: "text-xs text-neutral-400 mt-1 block",
												children: "Supports PSD, TIFF, CR3, NEF, PNG & JPG • Strict NDA Protection"
											})
										]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
										children: [/* @__PURE__ */ jsx("input", {
											type: "email",
											required: true,
											placeholder: "Work email address...",
											className: "w-full px-4 py-3.5 rounded-xl bg-white/10 border border-white/15 text-xs sm:text-sm text-white placeholder-neutral-400 focus:outline-none focus:border-emerald-400"
										}), /* @__PURE__ */ jsx("input", {
											type: "text",
											placeholder: "Brand / Studio URL (optional)",
											className: "w-full px-4 py-3.5 rounded-xl bg-white/10 border border-white/15 text-xs sm:text-sm text-white placeholder-neutral-400 focus:outline-none focus:border-emerald-400"
										})]
									}),
									/* @__PURE__ */ jsxs("button", {
										type: "submit",
										className: "w-full py-4 rounded-full bg-emerald-400 text-[#0F0F12] font-extrabold text-xs sm:text-sm hover:bg-emerald-300 transition-colors flex items-center justify-center gap-2 shadow-lg",
										children: [/* @__PURE__ */ jsx("span", { children: "Submit Free Sample Request" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4" })]
									})
								]
							}) : /* @__PURE__ */ jsxs("div", {
								className: "rounded-[26px] bg-white/5 border border-emerald-400/30 p-8 text-center space-y-3",
								children: [
									/* @__PURE__ */ jsx(CheckCircle2, { className: "w-11 h-11 text-emerald-400 mx-auto" }),
									/* @__PURE__ */ jsx("h3", {
										className: "text-xl font-extrabold",
										children: "Sample Request Received"
									}),
									/* @__PURE__ */ jsxs("p", {
										className: "text-xs sm:text-sm text-neutral-300 max-w-md mx-auto",
										children: [
											"Our senior retouching desk has queued your sample for",
											" ",
											/* @__PURE__ */ jsx("span", {
												className: "text-emerald-300 font-bold",
												children: selectedTurnaround
											}),
											" ",
											"turnaround."
										]
									}),
									/* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => {
											setTrialSubmitted(false);
											setUploadedFiles([]);
										},
										className: "text-xs font-extrabold text-emerald-400 underline pt-2",
										children: "Upload another batch"
									})
								]
							})
						})]
					})
				})
			}),
			lightboxItem && /* @__PURE__ */ jsx("div", {
				onClick: () => setLightboxItem(null),
				className: "fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4",
				children: /* @__PURE__ */ jsxs("div", {
					onClick: (e) => e.stopPropagation(),
					className: "relative max-w-4xl w-full rounded-[28px] overflow-hidden bg-white shadow-2xl",
					children: [/* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => setLightboxItem(null),
						className: "absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white text-[#0F0F12] flex items-center justify-center shadow-md hover:bg-neutral-100",
						children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
					}), /* @__PURE__ */ jsxs("div", {
						className: "h-[480px] sm:h-[540px] relative",
						children: [/* @__PURE__ */ jsx("img", {
							src: lightboxItem.image,
							alt: lightboxItem.title,
							className: "w-full h-full object-cover"
						}), /* @__PURE__ */ jsxs("div", {
							className: "absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 via-black/30 to-transparent text-white",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-[11px] font-extrabold uppercase tracking-wider text-emerald-300",
								children: lightboxItem.tag
							}), /* @__PURE__ */ jsx("h3", {
								className: "text-2xl font-extrabold mt-0.5",
								children: lightboxItem.title
							})]
						})]
					})]
				})
			}),
			/* @__PURE__ */ jsx("footer", {
				className: "py-10 px-4 sm:px-8 border-t border-neutral-200/80",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-neutral-500",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 text-[#0F0F12] font-extrabold",
							children: [/* @__PURE__ */ jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" }), /* @__PURE__ */ jsx("span", { children: "CuttingEdger.com" })]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex gap-6",
							children: [
								/* @__PURE__ */ jsx("a", {
									href: "#capabilities",
									className: "hover:text-[#0F0F12] transition-colors",
									children: "Capabilities"
								}),
								/* @__PURE__ */ jsx("a", {
									href: "#interactive-studio",
									className: "hover:text-[#0F0F12] transition-colors",
									children: "Interactive Studio"
								}),
								/* @__PURE__ */ jsx("a", {
									href: "#portfolio",
									className: "hover:text-[#0F0F12] transition-colors",
									children: "Portfolio"
								}),
								/* @__PURE__ */ jsx("a", {
									href: "#free-sample",
									className: "hover:text-[#0F0F12] transition-colors",
									children: "Free Sample"
								})
							]
						}),
						/* @__PURE__ */ jsxs("span", { children: [
							"© ",
							(/* @__PURE__ */ new Date()).getFullYear(),
							" CuttingEdger Studio"
						] })
					]
				})
			})
		]
	});
}
Home.layout = (page) => /* @__PURE__ */ jsx(Fragment, { children: page });
//#endregion
export { Home as default };
