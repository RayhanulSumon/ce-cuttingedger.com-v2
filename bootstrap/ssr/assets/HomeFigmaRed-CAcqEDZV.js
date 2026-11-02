import { useEffect, useMemo, useRef, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { ArrowRight, ArrowUpRight, Check, CheckCircle2, Flame, Palette, RotateCcw, Scissors, SlidersHorizontal, Sparkles, Sun, Upload } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/HomeVariants/HomeFigmaRed.tsx
var HERO_SHOWCASE_PLATES = [
	{
		id: "footwear",
		category: "Footwear",
		badge: "HAND-CRAFTED PEN PATH",
		title: "Multi-Path Cutout & Ground Shadow",
		metric: "300% Zoom Edge Accuracy • Dynamic Studio Shadow",
		image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1800&q=85",
		rawFilter: "brightness(0.78) contrast(0.8) saturate(0.45) sepia(0.15)",
		doneFilter: "brightness(1.05) contrast(1.1) saturate(1.14) drop-shadow(0 28px 26px rgba(15,15,18,0.22))",
		tintColor: "#FDF2F0",
		href: "/services/ecommerce-catalog-optimization/clipping-path-service"
	},
	{
		id: "apparel",
		category: "Apparel",
		badge: "3D GHOST MANNEQUIN",
		title: "Invisible Mannequin & Garment Drape",
		metric: "Natural Volume • Zero Halo Cutout",
		image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1800&q=85",
		rawFilter: "brightness(0.75) contrast(0.82) saturate(0.5) sepia(0.12)",
		doneFilter: "brightness(1.04) contrast(1.08) saturate(1.1)",
		tintColor: "#FBF5F2",
		href: "/services/ghost-mannequin-service"
	},
	{
		id: "jewelry",
		category: "Jewelry",
		badge: "MACRO FOCUS STACKING",
		title: "Micro-Dust Removal & Gem Brilliance",
		metric: "Prong Rebuild • Metal Specular Polish",
		image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1800&q=85",
		rawFilter: "brightness(0.7) contrast(0.78) grayscale(0.45)",
		doneFilter: "brightness(1.08) contrast(1.15) saturate(1.08)",
		tintColor: "#F8F9FA",
		href: "/services/ecommerce-catalog-optimization"
	},
	{
		id: "hardgoods",
		category: "Cosmetics",
		badge: "SPECULAR & REFLECTION GRADE",
		title: "Glass Reflection & Label Rebuild",
		metric: "Clean Highlights • Exact Color Match",
		image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1800&q=85",
		rawFilter: "brightness(0.76) contrast(0.82) saturate(0.5)",
		doneFilter: "brightness(1.06) contrast(1.12) saturate(1.1)",
		tintColor: "#FFF5F3",
		href: "/services/color-standardization"
	}
];
var LUXURY_BRAND_SILHOUETTES = [
	"BALENCIAGA",
	"CARTIER",
	"SSENSE",
	"FARFETCH",
	"KITH",
	"JIL SANDER",
	"ACNE STUDIOS",
	"MONCLER"
];
var ACCORDION_PANELS = [
	{
		id: "acc-1",
		tag: "PRECISION PATH",
		title: "Precision Clipping",
		metric: "100% Hand-Drawn Pen Tool Paths",
		image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=85",
		rawFilter: "brightness(0.75) contrast(0.82) saturate(0.45) sepia(0.2)",
		href: "/services/ecommerce-catalog-optimization/clipping-path-service"
	},
	{
		id: "acc-2",
		tag: "APPAREL STUDIO",
		title: "3D Ghost Mannequin",
		metric: "Symmetrical Drape",
		image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=85",
		rawFilter: "brightness(0.74) contrast(0.8) saturate(0.5)",
		href: "/services/ghost-mannequin-service"
	},
	{
		id: "acc-3",
		tag: "LUXURY MACRO",
		title: "Fine Jewelry Polish",
		metric: "Gem & Metal Clarity",
		image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85",
		rawFilter: "brightness(0.72) contrast(0.78) grayscale(0.45)",
		href: "/services/ecommerce-catalog-optimization"
	},
	{
		id: "acc-4",
		tag: "SKU COLORWAY",
		title: "Multi-SKU Recolor",
		metric: "Zero Reshoot Needed",
		image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=1200&q=85",
		rawFilter: "hue-rotate(140deg) brightness(0.82) saturate(0.75)",
		href: "/services/apparel-colorway-generation"
	},
	{
		id: "acc-5",
		tag: "HARDGOODS",
		title: "Cosmetics & Glass",
		metric: "Specular Highlights",
		image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=85",
		rawFilter: "brightness(0.75) contrast(0.82) saturate(0.55)",
		href: "/services/color-standardization"
	}
];
var STUDIO_PRODUCTS = [{
	id: "nike-free",
	name: "Nike Free RN Flyknit",
	category: "Performance Footwear",
	image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1400&q=85",
	rawFilter: "brightness(0.75) contrast(0.8) saturate(0.45) sepia(0.15)",
	vectorSvgD: "M 140 310 C 180 230, 240 180, 340 150 C 440 120, 560 130, 680 180 C 760 210, 830 260, 850 310 C 860 335, 820 370, 750 395 C 640 435, 480 445, 330 435 C 220 425, 120 370, 140 310 Z",
	swatches: [
		{
			name: "Crimson Original",
			hue: 0,
			hex: "#DE4A2C",
			code: "SKU-RED-01"
		},
		{
			name: "Hyper Royal",
			hue: 215,
			hex: "#3B82F6",
			code: "SKU-BLU-02"
		},
		{
			name: "Cyber Mint",
			hue: 155,
			hex: "#10B981",
			code: "SKU-MNT-03"
		},
		{
			name: "Electric Lilac",
			hue: 260,
			hex: "#A855F7",
			code: "SKU-VIO-04"
		}
	]
}, {
	id: "luxury-bag",
	name: "Grained Calfskin Tote",
	category: "Leather Goods",
	image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1400&q=85",
	rawFilter: "brightness(0.72) contrast(0.8) saturate(0.4) sepia(0.18)",
	vectorSvgD: "M 220 180 C 220 120, 320 110, 480 110 C 640 110, 740 120, 740 180 L 780 430 C 780 470, 720 480, 480 480 C 240 480, 180 470, 180 430 Z",
	swatches: [
		{
			name: "Tuscan Tan",
			hue: 0,
			hex: "#C2845B",
			code: "SKU-TAN-01"
		},
		{
			name: "Onyx Noir",
			hue: 0,
			hex: "#1F2937",
			code: "SKU-BLK-02"
		},
		{
			name: "Vermilion Ember",
			hue: 350,
			hex: "#DE4A2C",
			code: "SKU-VML-03"
		},
		{
			name: "Forest Olive",
			hue: 100,
			hex: "#4D7C0F",
			code: "SKU-OLV-04"
		}
	]
}];
function HomeFigmaRed({ clients = [] }) {
	const [heroTabIdx, setHeroTabIdx] = useState(0);
	const currentHero = HERO_SHOWCASE_PLATES[heroTabIdx] || HERO_SHOWCASE_PLATES[0];
	const [splitPos, setSplitPos] = useState(50);
	const [isDraggingSplit, setIsDraggingSplit] = useState(false);
	const heroStageRef = useRef(null);
	const [expandedAccordion, setExpandedAccordion] = useState(1);
	const [activeStudioProductIdx, setActiveStudioProductIdx] = useState(0);
	const [activeStudioBackdrop, setActiveStudioBackdrop] = useState("transparent");
	const [layerCutout, setLayerCutout] = useState(true);
	const [layerShadow, setLayerShadow] = useState(true);
	const [shadowIntensity, setShadowIntensity] = useState(85);
	const [layerPolish, setLayerPolish] = useState(true);
	const [polishIntensity, setPolishIntensity] = useState(90);
	const [activeSwatchIdx, setActiveSwatchIdx] = useState(0);
	const [showVectorPath, setShowVectorPath] = useState(false);
	const [isPeekingRaw, setIsPeekingRaw] = useState(false);
	const [monthlyVolume, setMonthlyVolume] = useState(250);
	const [trialSubmitted, setTrialSubmitted] = useState(false);
	const [uploadedFiles, setUploadedFiles] = useState([]);
	const [lightboxItem, setLightboxItem] = useState(null);
	const currentStudioProduct = STUDIO_PRODUCTS[activeStudioProductIdx] || STUDIO_PRODUCTS[0];
	const currentStudioSwatch = currentStudioProduct.swatches[activeSwatchIdx] || currentStudioProduct.swatches[0];
	const updateSplitPosition = (clientX) => {
		if (!heroStageRef.current) return;
		const rect = heroStageRef.current.getBoundingClientRect();
		const x = clientX - rect.left;
		const pct = Math.max(0, Math.min(100, x / rect.width * 100));
		setSplitPos(pct);
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
	const getPlaygroundFilter = () => {
		if (isPeekingRaw) return currentStudioProduct.rawFilter;
		const hue = currentStudioSwatch.hue;
		let polishPart = "brightness(1.0) contrast(1.0) saturate(1.0)";
		if (layerPolish) {
			const pScale = polishIntensity / 100;
			polishPart = `brightness(${(1 + .06 * pScale).toFixed(2)}) contrast(${(1 + .12 * pScale).toFixed(2)}) saturate(${(1 + .14 * pScale).toFixed(2)})`;
		} else polishPart = "brightness(0.85) contrast(0.86) saturate(0.65)";
		let shadowPart = "";
		if (layerShadow) {
			const sScale = shadowIntensity / 100;
			const blur = Math.round(28 * sScale);
			shadowPart = `drop-shadow(0 ${Math.round(24 * sScale)}px ${blur}px rgba(15,15,18,${(.24 * sScale).toFixed(2)}))`;
		}
		const huePart = hue !== 0 ? `hue-rotate(${hue}deg)` : "";
		return `${polishPart} ${huePart} ${shadowPart}`.trim();
	};
	const volumeTierInfo = useMemo(() => {
		if (monthlyVolume < 250) return {
			tier: "Studio Starter",
			sla: "12 Hours",
			estSavings: "42%"
		};
		if (monthlyVolume < 1e3) return {
			tier: "Brand Growth",
			sla: "8 Hours",
			estSavings: "54%"
		};
		if (monthlyVolume < 5e3) return {
			tier: "Enterprise Scale",
			sla: "4 Hours",
			estSavings: "68%"
		};
		return {
			tier: "Global Conglomerate",
			sla: "2 Hours Dedicated",
			estSavings: "75%"
		};
	}, [monthlyVolume]);
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-[#07080B] text-[#F3F4F6] selection:bg-[#de4a2c] selection:text-white font-sans antialiased overflow-x-hidden",
		children: [
			/* @__PURE__ */ jsxs(Head, { children: [/* @__PURE__ */ jsx("title", { children: "CuttingEdger — Radical Digital Agency & Post-Production Atelier" }), /* @__PURE__ */ jsx("meta", {
				name: "description",
				content: "Enterprise-grade e-commerce image post-production, hand-crafted clipping paths, and ghost mannequin retouching for luxury brands."
			})] }),
			/* @__PURE__ */ jsxs("section", {
				className: "relative pt-28 pb-16 sm:pt-36 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto",
				children: [
					/* @__PURE__ */ jsx("div", { className: "absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#de4a2c]/12 blur-[140px] rounded-full pointer-events-none" }),
					/* @__PURE__ */ jsx("div", {
						className: "text-center mb-6",
						children: /* @__PURE__ */ jsxs("div", {
							className: "inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-[#de4a2c]/40 text-xs font-mono font-bold tracking-wider uppercase text-white shadow-[0_0_20px_rgba(222,74,44,0.15)]",
							children: [
								/* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-[#de4a2c] animate-pulse" }),
								/* @__PURE__ */ jsx("span", { children: "Figma Prototype Edition" }),
								/* @__PURE__ */ jsx("span", {
									className: "text-neutral-500",
									children: "•"
								}),
								/* @__PURE__ */ jsx("span", {
									className: "text-[#de4a2c]",
									children: "#de4a2c Vermilion Core"
								})
							]
						})
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "text-center max-w-4xl mx-auto mb-10",
						children: [
							/* @__PURE__ */ jsxs("h1", {
								className: "text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]",
								children: [
									"Radical High-Volume",
									" ",
									/* @__PURE__ */ jsx("span", {
										className: "text-transparent bg-clip-text bg-gradient-to-r from-[#de4a2c] via-[#ff6b4a] to-[#de4a2c]",
										children: "Post-Production"
									})
								]
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-5 text-base sm:text-lg text-neutral-300 max-w-2xl mx-auto font-normal leading-relaxed",
								children: "Hand-drawn vector pen paths, invisible ghost mannequin draping, and non-destructive atelier finishing for the world's leading luxury e-commerce brands."
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-8 flex flex-wrap items-center justify-center gap-3",
								children: [/* @__PURE__ */ jsxs("a", {
									href: "#free-sample",
									className: "px-7 py-3.5 rounded-full bg-gradient-to-r from-[#de4a2c] to-[#c2381c] hover:from-[#f86445] hover:to-[#de4a2c] text-white font-extrabold text-sm tracking-wide transition-all shadow-[0_8px_30px_rgba(222,74,44,0.35)] flex items-center gap-2 group cursor-pointer",
									children: [/* @__PURE__ */ jsx("span", { children: "Test 3 Images Free" }), /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4 transition-transform group-hover:translate-x-1" })]
								}), /* @__PURE__ */ jsxs(Link, {
									href: "/services/ecommerce-catalog-optimization/clipping-path-service?v=1",
									className: "px-6 py-3.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 text-white font-bold text-sm transition-all flex items-center gap-2 cursor-pointer",
									children: [/* @__PURE__ */ jsx("span", { children: "Explore 5 Single Page Styles" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4 text-[#de4a2c]" })]
								})]
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "rounded-[32px] p-4 sm:p-6 bg-white/[0.02] border border-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.8)] backdrop-blur-xl relative",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-white/10",
							children: [/* @__PURE__ */ jsx("div", {
								className: "flex items-center gap-2 overflow-x-auto py-1",
								children: HERO_SHOWCASE_PLATES.map((plate, idx) => /* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => setHeroTabIdx(idx),
									className: `px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${heroTabIdx === idx ? "bg-[#de4a2c] text-white shadow-[0_0_20px_rgba(222,74,44,0.4)]" : "bg-white/[0.04] text-neutral-400 hover:text-white hover:bg-white/[0.08]"}`,
									children: [/* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-white" }), /* @__PURE__ */ jsx("span", { children: plate.category })]
								}, plate.id))
							}), /* @__PURE__ */ jsxs("div", {
								className: "text-xs font-mono text-neutral-400 flex items-center gap-2",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "text-[#de4a2c] font-bold",
										children: "100% Non-Destructive"
									}),
									/* @__PURE__ */ jsx("span", { children: "•" }),
									/* @__PURE__ */ jsx("span", { children: "Drag Split Slider" })
								]
							})]
						}), /* @__PURE__ */ jsxs("div", {
							ref: heroStageRef,
							onMouseDown: () => setIsDraggingSplit(true),
							onTouchStart: () => setIsDraggingSplit(true),
							className: "mt-4 relative h-[380px] sm:h-[500px] lg:h-[580px] rounded-2xl overflow-hidden cursor-ew-resize select-none border border-white/10",
							style: { backgroundColor: currentHero.tintColor },
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "absolute inset-0 flex items-center justify-center p-8",
									children: /* @__PURE__ */ jsx("img", {
										src: currentHero.image,
										alt: currentHero.title,
										className: "max-h-full max-w-full object-contain pointer-events-none transition-all duration-300",
										style: { filter: currentHero.doneFilter }
									})
								}),
								/* @__PURE__ */ jsx("div", {
									className: "absolute inset-0 overflow-hidden bg-neutral-900/10 pointer-events-none",
									style: { clipPath: `inset(0 ${100 - splitPos}% 0 0)` },
									children: /* @__PURE__ */ jsx("div", {
										className: "absolute inset-0 flex items-center justify-center p-8",
										children: /* @__PURE__ */ jsx("img", {
											src: currentHero.image,
											alt: "Raw Studio Plate",
											className: "max-h-full max-w-full object-contain transition-all duration-300",
											style: { filter: currentHero.rawFilter }
										})
									})
								}),
								/* @__PURE__ */ jsx("div", {
									className: "absolute top-0 bottom-0 w-[2px] bg-white pointer-events-none shadow-[0_0_15px_rgba(255,255,255,0.8)]",
									style: { left: `${splitPos}%` },
									children: /* @__PURE__ */ jsx("div", {
										className: "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#de4a2c] border-2 border-white text-white flex items-center justify-center shadow-lg",
										children: /* @__PURE__ */ jsx(SlidersHorizontal, { className: "w-4 h-4" })
									})
								}),
								/* @__PURE__ */ jsx("div", {
									className: "absolute top-4 left-4 pointer-events-none px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-mono font-bold uppercase tracking-wider border border-white/10",
									children: "Raw Capture"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "absolute top-4 right-4 pointer-events-none px-3 py-1.5 rounded-full bg-[#de4a2c] text-white text-[11px] font-mono font-bold uppercase tracking-wider shadow-md",
									children: "Atelier Grade"
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "absolute bottom-4 left-4 right-4 sm:right-auto pointer-events-auto p-4 rounded-2xl bg-black/70 backdrop-blur-xl border border-white/15 text-white max-w-md",
									children: [
										/* @__PURE__ */ jsx("div", {
											className: "text-[10px] font-mono font-bold text-[#de4a2c] uppercase tracking-wider",
											children: currentHero.badge
										}),
										/* @__PURE__ */ jsx("div", {
											className: "text-base font-extrabold mt-0.5",
											children: currentHero.title
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "text-xs text-neutral-300 mt-1 flex items-center justify-between gap-4",
											children: [/* @__PURE__ */ jsx("span", { children: currentHero.metric }), /* @__PURE__ */ jsxs(Link, {
												href: currentHero.href,
												className: "text-[#de4a2c] hover:underline font-bold shrink-0 flex items-center gap-1",
												children: [/* @__PURE__ */ jsx("span", { children: "Specs" }), /* @__PURE__ */ jsx(ArrowRight, { className: "w-3 h-3" })]
											})]
										})
									]
								})
							]
						})]
					})
				]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "py-12 border-y border-white/10 bg-white/[0.01]",
				children: [/* @__PURE__ */ jsx("div", {
					className: "max-w-7xl mx-auto px-4 sm:px-6 text-center mb-6",
					children: /* @__PURE__ */ jsx("p", {
						className: "text-xs font-mono font-bold uppercase tracking-widest text-neutral-400",
						children: "Trusted by Enterprise E-Commerce & Luxury Ateliers Worldwide"
					})
				}), /* @__PURE__ */ jsx("div", {
					className: "flex items-center justify-center gap-8 sm:gap-14 flex-wrap max-w-5xl mx-auto px-4 opacity-75",
					children: clients.length > 0 ? clients.slice(0, 8).map((client) => /* @__PURE__ */ jsx("div", {
						className: "text-neutral-400 hover:text-white font-mono font-extrabold text-sm tracking-wider transition-colors",
						children: client.name
					}, client.id)) : LUXURY_BRAND_SILHOUETTES.map((brand) => /* @__PURE__ */ jsx("span", {
						className: "text-neutral-400 hover:text-white font-mono font-extrabold text-sm tracking-wider transition-colors",
						children: brand
					}, brand))
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
						className: "inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#de4a2c] mb-2",
						children: [/* @__PURE__ */ jsx(Sparkles, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Real-Time Studio Controls" })]
					}), /* @__PURE__ */ jsx("h2", {
						className: "text-3xl sm:text-5xl font-extrabold tracking-tight text-white",
						children: "Interactive Retouching Studio"
					})] }), /* @__PURE__ */ jsx("p", {
						className: "text-sm text-neutral-400 max-w-md",
						children: "Toggle non-destructive production layers & live SKU colorways in real time with our proprietary atelier pipeline."
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 lg:grid-cols-12 gap-6 items-start",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "lg:col-span-7 rounded-3xl p-6 bg-white/[0.03] border border-white/10 shadow-2xl relative flex flex-col justify-between min-h-[460px]",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between pb-4 border-b border-white/10 text-xs font-mono",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-[#de4a2c] animate-pulse" }), /* @__PURE__ */ jsx("span", {
										className: "font-bold text-white",
										children: "Live Layer Preview"
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "text-neutral-400",
									children: ["Active SKU: ", /* @__PURE__ */ jsx("span", {
										className: "text-white font-bold",
										children: currentStudioSwatch.name
									})]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: `my-6 h-[320px] rounded-2xl flex items-center justify-center relative overflow-hidden transition-all duration-300 ${activeStudioBackdrop === "white" ? "bg-white" : activeStudioBackdrop === "dark" ? "bg-[#0F0F12]" : activeStudioBackdrop === "gray" ? "bg-[#E5E7EB]" : "bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:16px_16px] bg-[#0C0D12]"}`,
								children: [/* @__PURE__ */ jsx("img", {
									src: currentStudioProduct.image,
									alt: currentStudioProduct.name,
									className: "max-h-[85%] max-w-[85%] object-contain transition-all duration-300",
									style: {
										filter: getPlaygroundFilter(),
										opacity: layerCutout ? 1 : .85
									}
								}), showVectorPath && /* @__PURE__ */ jsx("svg", {
									className: "absolute inset-0 w-full h-full pointer-events-none",
									viewBox: "0 0 1000 600",
									children: /* @__PURE__ */ jsx("path", {
										d: currentStudioProduct.vectorSvgD,
										fill: "none",
										stroke: "#de4a2c",
										strokeWidth: "2.5",
										strokeDasharray: "6 4"
									})
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between pt-4 border-t border-white/10 text-xs font-mono",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-neutral-400",
									children: "Multi-Layer PSD Production Pipeline"
								}), /* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => {
										setLayerCutout(true);
										setLayerShadow(true);
										setLayerPolish(true);
										setActiveSwatchIdx(0);
										setShowVectorPath(false);
									},
									className: "px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors flex items-center gap-1.5",
									children: [/* @__PURE__ */ jsx(RotateCcw, { className: "w-3 h-3" }), /* @__PURE__ */ jsx("span", { children: "Reset to Raw" })]
								})]
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "lg:col-span-5 rounded-3xl p-6 bg-white text-[#0F0F12] shadow-2xl space-y-5",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "pb-3 border-b border-neutral-200",
								children: [/* @__PURE__ */ jsx("div", {
									className: "text-[11px] font-mono font-extrabold uppercase tracking-wider text-[#de4a2c]",
									children: "Studio Finishing Controls"
								}), /* @__PURE__ */ jsx("h3", {
									className: "text-xl font-extrabold tracking-tight mt-0.5",
									children: "Customize Post-Production"
								})]
							}),
							/* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => setLayerCutout(!layerCutout),
								className: `w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${layerCutout ? "bg-[#0F0F12] text-white border-[#0F0F12] shadow-md" : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100"}`,
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ jsx(Scissors, { className: `w-4 h-4 ${layerCutout ? "text-[#de4a2c]" : "text-neutral-400"}` }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
										className: "text-xs font-extrabold",
										children: "Pen-Tool Background Cutout"
									}), /* @__PURE__ */ jsx("div", {
										className: "text-[11px] text-neutral-400",
										children: "300% zoom vector path"
									})] })]
								}), /* @__PURE__ */ jsx(CheckCircle2, { className: `w-5 h-5 ${layerCutout ? "text-[#de4a2c]" : "text-neutral-300"}` })]
							}),
							/* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => setLayerShadow(!layerShadow),
								className: `w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${layerShadow ? "bg-[#0F0F12] text-white border-[#0F0F12] shadow-md" : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100"}`,
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ jsx(Sun, { className: `w-4 h-4 ${layerShadow ? "text-[#de4a2c]" : "text-neutral-400"}` }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
										className: "text-xs font-extrabold",
										children: "Natural Floor Shadow"
									}), /* @__PURE__ */ jsx("div", {
										className: "text-[11px] text-neutral-400",
										children: "Soft grounded studio depth"
									})] })]
								}), /* @__PURE__ */ jsx(CheckCircle2, { className: `w-5 h-5 ${layerShadow ? "text-[#de4a2c]" : "text-neutral-300"}` })]
							}),
							/* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => setLayerPolish(!layerPolish),
								className: `w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${layerPolish ? "bg-[#0F0F12] text-white border-[#0F0F12] shadow-md" : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100"}`,
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ jsx(Sparkles, { className: `w-4 h-4 ${layerPolish ? "text-[#de4a2c]" : "text-neutral-400"}` }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
										className: "text-xs font-extrabold",
										children: "Studio Polish & Contrast"
									}), /* @__PURE__ */ jsx("div", {
										className: "text-[11px] text-neutral-400",
										children: "Dust, glue & crease removal"
									})] })]
								}), /* @__PURE__ */ jsx(CheckCircle2, { className: `w-5 h-5 ${layerPolish ? "text-[#de4a2c]" : "text-neutral-300"}` })]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "pt-2",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between text-xs font-mono mb-2",
									children: [/* @__PURE__ */ jsxs("span", {
										className: "font-bold text-neutral-700 flex items-center gap-1.5",
										children: [/* @__PURE__ */ jsx(Palette, { className: "w-3.5 h-3.5 text-[#de4a2c]" }), /* @__PURE__ */ jsx("span", { children: "Instant SKU Color Match" })]
									}), /* @__PURE__ */ jsx("span", {
										className: "text-neutral-500",
										children: currentStudioSwatch.name
									})]
								}), /* @__PURE__ */ jsx("div", {
									className: "grid grid-cols-4 gap-2",
									children: currentStudioProduct.swatches.map((swatch, sIdx) => /* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => setActiveSwatchIdx(sIdx),
										className: `h-11 rounded-xl transition-all border flex items-center justify-center relative ${activeSwatchIdx === sIdx ? "border-[#0F0F12] ring-2 ring-[#de4a2c]" : "border-neutral-200 hover:scale-102"}`,
										style: { backgroundColor: swatch.hex },
										title: swatch.name,
										children: activeSwatchIdx === sIdx && /* @__PURE__ */ jsx(Check, { className: "w-4 h-4 text-white drop-shadow" })
									}, swatch.name))
								})]
							}),
							/* @__PURE__ */ jsxs("a", {
								href: "#free-sample",
								className: "w-full py-3.5 rounded-full bg-[#0F0F12] hover:bg-neutral-800 text-white font-extrabold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg",
								children: [/* @__PURE__ */ jsx("span", { children: "Test With Your Own Product" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4 text-[#de4a2c]" })]
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "text-center max-w-3xl mx-auto mb-14",
					children: [/* @__PURE__ */ jsx("div", {
						className: "text-xs font-mono font-bold text-[#de4a2c] uppercase tracking-wider mb-2",
						children: "Discipline & Precision"
					}), /* @__PURE__ */ jsx("h2", {
						className: "text-3xl sm:text-5xl font-extrabold text-white",
						children: "High-Precision Production Pillars"
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-1 md:grid-cols-5 gap-3",
					children: ACCORDION_PANELS.map((panel, idx) => {
						const isExpanded = expandedAccordion === idx;
						return /* @__PURE__ */ jsxs("div", {
							onClick: () => setExpandedAccordion(idx),
							className: `rounded-3xl p-6 border transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between ${isExpanded ? "bg-white/[0.06] border-[#de4a2c] shadow-[0_0_30px_rgba(222,74,44,0.2)] md:col-span-2" : "bg-white/[0.02] border-white/10 hover:border-white/25 md:col-span-1"}`,
							children: [/* @__PURE__ */ jsxs("div", {
								className: "relative z-10",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "text-[10px] font-mono font-bold text-[#de4a2c] uppercase tracking-wider",
										children: panel.tag
									}),
									/* @__PURE__ */ jsx("h3", {
										className: "text-xl font-extrabold text-white mt-1",
										children: panel.title
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-xs text-neutral-400 mt-1",
										children: panel.metric
									})
								]
							}), /* @__PURE__ */ jsxs("div", {
								className: "mt-8 rounded-2xl overflow-hidden h-48 relative border border-white/10",
								children: [/* @__PURE__ */ jsx("img", {
									src: panel.image,
									alt: panel.title,
									className: "w-full h-full object-cover",
									style: { filter: isExpanded ? "none" : panel.rawFilter }
								}), /* @__PURE__ */ jsx("div", {
									className: "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4",
									children: /* @__PURE__ */ jsxs(Link, {
										href: panel.href,
										onClick: (e) => e.stopPropagation(),
										className: "px-3 py-1.5 rounded-full bg-[#de4a2c] hover:bg-[#c2381c] text-white text-[11px] font-bold flex items-center gap-1 transition-colors",
										children: [/* @__PURE__ */ jsx("span", { children: "Explore Pillar" }), /* @__PURE__ */ jsx(ArrowRight, { className: "w-3 h-3" })]
									})
								})]
							})]
						}, panel.id);
					})
				})]
			}),
			/* @__PURE__ */ jsx("section", {
				id: "free-sample",
				className: "py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10",
				children: /* @__PURE__ */ jsxs("div", {
					className: "rounded-[36px] p-8 sm:p-14 bg-gradient-to-br from-white/[0.04] via-white/[0.02] to-transparent border border-[#de4a2c]/30 shadow-2xl relative overflow-hidden",
					children: [/* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-[400px] h-[400px] bg-[#de4a2c]/10 blur-[120px] rounded-full pointer-events-none" }), /* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 lg:grid-cols-12 gap-10 items-center",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "lg:col-span-6 space-y-6",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#de4a2c]/10 border border-[#de4a2c]/40 text-xs font-mono font-bold text-[#de4a2c] uppercase",
									children: [/* @__PURE__ */ jsx(Flame, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Zero Obligation Pilot" })]
								}),
								/* @__PURE__ */ jsx("h2", {
									className: "text-3xl sm:text-5xl font-extrabold text-white leading-tight",
									children: "Test 3 Product Images With No Card Required"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-neutral-300 text-sm sm:text-base leading-relaxed",
									children: "Send us your toughest RAW files. We will deliver hand-clipped vector paths, ghost mannequin draping, and non-destructive studio finishing within hours."
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3",
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-center justify-between text-xs font-mono",
											children: [/* @__PURE__ */ jsx("span", {
												className: "text-neutral-300 font-bold",
												children: "Estimated Monthly Volume:"
											}), /* @__PURE__ */ jsxs("span", {
												className: "text-[#de4a2c] font-extrabold text-sm",
												children: [monthlyVolume, " images/mo"]
											})]
										}),
										/* @__PURE__ */ jsx("input", {
											type: "range",
											min: "50",
											max: "10000",
											step: "50",
											value: monthlyVolume,
											onChange: (e) => setMonthlyVolume(Number(e.target.value)),
											className: "w-full accent-[#de4a2c] cursor-pointer"
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-center justify-between text-[11px] font-mono text-neutral-400 pt-1",
											children: [/* @__PURE__ */ jsxs("span", { children: ["SLA: ", /* @__PURE__ */ jsx("strong", {
												className: "text-white",
												children: volumeTierInfo.sla
											})] }), /* @__PURE__ */ jsxs("span", { children: ["Est. Savings: ", /* @__PURE__ */ jsx("strong", {
												className: "text-emerald-400",
												children: volumeTierInfo.estSavings
											})] })]
										})
									]
								})
							]
						}), /* @__PURE__ */ jsx("div", {
							className: "lg:col-span-6",
							children: !trialSubmitted ? /* @__PURE__ */ jsxs("form", {
								onSubmit: (e) => {
									e.preventDefault();
									setTrialSubmitted(true);
								},
								className: "p-6 sm:p-8 rounded-3xl bg-[#0C0D12] border border-white/15 shadow-2xl space-y-4",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "p-8 rounded-2xl border-2 border-dashed border-[#de4a2c]/40 hover:border-[#de4a2c] bg-white/[0.02] text-center transition-colors",
										children: [
											/* @__PURE__ */ jsx(Upload, { className: "w-8 h-8 text-[#de4a2c] mx-auto mb-2" }),
											/* @__PURE__ */ jsx("div", {
												className: "text-xs font-mono font-bold text-white",
												children: "Drag & drop 1-3 test images"
											}),
											/* @__PURE__ */ jsx("div", {
												className: "text-[11px] text-neutral-400 mt-1",
												children: "RAW, PSD, TIFF, PNG, or JPG up to 100MB"
											})
										]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
										children: [/* @__PURE__ */ jsx("input", {
											type: "text",
											required: true,
											placeholder: "Your Name *",
											className: "w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/15 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#de4a2c]"
										}), /* @__PURE__ */ jsx("input", {
											type: "email",
											required: true,
											placeholder: "Work Email *",
											className: "w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/15 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#de4a2c]"
										})]
									}),
									/* @__PURE__ */ jsxs("button", {
										type: "submit",
										className: "w-full py-4 rounded-full bg-gradient-to-r from-[#de4a2c] to-[#c2381c] hover:from-[#f86445] hover:to-[#de4a2c] text-white font-extrabold text-xs tracking-wider uppercase transition-all shadow-[0_8px_25px_rgba(222,74,44,0.4)] flex items-center justify-center gap-2 cursor-pointer",
										children: [/* @__PURE__ */ jsx("span", { children: "Submit Free Test Batch" }), /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })]
									})
								]
							}) : /* @__PURE__ */ jsxs("div", {
								className: "p-10 rounded-3xl bg-[#0C0D12] border border-[#de4a2c]/40 text-center space-y-3",
								children: [
									/* @__PURE__ */ jsx(CheckCircle2, { className: "w-12 h-12 text-[#de4a2c] mx-auto" }),
									/* @__PURE__ */ jsx("h3", {
										className: "text-2xl font-extrabold text-white",
										children: "Test Batch Received"
									}),
									/* @__PURE__ */ jsxs("p", {
										className: "text-xs text-neutral-300 max-w-sm mx-auto",
										children: [
											"Our lead retouchers are processing your test batch. Expect delivery within ",
											/* @__PURE__ */ jsx("span", {
												className: "text-[#de4a2c] font-bold",
												children: volumeTierInfo.sla
											}),
											"."
										]
									}),
									/* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => setTrialSubmitted(false),
										className: "text-xs font-bold text-[#de4a2c] underline pt-2",
										children: "Submit another batch"
									})
								]
							})
						})]
					})]
				})
			})
		]
	});
}
//#endregion
export { HomeFigmaRed };
