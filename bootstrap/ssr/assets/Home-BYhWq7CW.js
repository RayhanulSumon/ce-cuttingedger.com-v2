import { useEffect, useMemo, useRef, useState } from "react";
import { Head } from "@inertiajs/react";
import { ArrowUpRight, Check, CheckCircle2, Eye, Maximize2, Palette, RotateCcw, Scissors, ShieldCheck, Sun, Upload, Wand2, X } from "lucide-react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Home.tsx
var HERO_SHOWCASE_PLATES = [
	{
		id: "footwear",
		category: "Footwear",
		badge: "PRECISION PEN-TOOL PATH",
		title: "Multi-Path Cutout & Ground Shadow",
		metric: "300% Zoom Edge Accuracy • Dynamic Studio Shadow",
		image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1800&q=85",
		rawFilter: "brightness(0.78) contrast(0.8) saturate(0.45) sepia(0.15)",
		doneFilter: "brightness(1.05) contrast(1.1) saturate(1.14) drop-shadow(0 28px 26px rgba(15,15,18,0.22))",
		tintColor: "#EEF2FF"
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
		tintColor: "#EAE6DF"
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
		tintColor: "#F3F4F6"
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
var STUDIO_PRODUCTS = [
	{
		id: "footwear",
		label: "Footwear",
		badge: "ATHLETIC RUNNER",
		title: "Performance Multi-Material Sneaker",
		turnaround: "12h Studio SLA",
		image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1200&q=85",
		rawFilter: "brightness(0.82) contrast(0.85) saturate(0.6)",
		swatches: [
			{
				name: "Volt Mint",
				hue: 0,
				hex: "#10B981",
				code: "SKU-VLT-01"
			},
			{
				name: "Cobalt Blue",
				hue: 200,
				hex: "#2563EB",
				code: "SKU-CBL-02"
			},
			{
				name: "Crimson Pulse",
				hue: -120,
				hex: "#EF4444",
				code: "SKU-CRM-03"
			},
			{
				name: "Solar Amber",
				hue: 50,
				hex: "#F59E0B",
				code: "SKU-AMB-04"
			},
			{
				name: "Obsidian Noir",
				hue: 240,
				hex: "#374151",
				code: "SKU-OBS-05"
			}
		]
	},
	{
		id: "timepiece",
		label: "Horology",
		badge: "LUXURY WATCH",
		title: "Minimalist Steel Chronograph",
		turnaround: "12h Studio SLA",
		image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85",
		rawFilter: "brightness(0.78) contrast(0.8) saturate(0.5)",
		swatches: [
			{
				name: "Pure Platinum",
				hue: 0,
				hex: "#94A3B8",
				code: "SKU-PLT-01"
			},
			{
				name: "Midnight Navy",
				hue: 210,
				hex: "#1E3A8A",
				code: "SKU-NVY-02"
			},
			{
				name: "Rose Metallic",
				hue: -45,
				hex: "#FB7185",
				code: "SKU-RSG-03"
			},
			{
				name: "Emerald Sunray",
				hue: 130,
				hex: "#047857",
				code: "SKU-EMR-04"
			},
			{
				name: "Obsidian Black",
				hue: 0,
				hex: "#18181B",
				code: "SKU-OBS-05"
			}
		]
	},
	{
		id: "fragrance",
		label: "Cosmetics",
		badge: "GLASS & LIQUID",
		title: "Refractive Glass & Gold Atomizer",
		turnaround: "6h Express Pilot",
		image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=85",
		rawFilter: "brightness(0.8) contrast(0.82) saturate(0.55)",
		swatches: [
			{
				name: "Solar Amber",
				hue: 0,
				hex: "#F59E0B",
				code: "SKU-AMB-01"
			},
			{
				name: "Rose Petal",
				hue: 320,
				hex: "#EC4899",
				code: "SKU-ROS-02"
			},
			{
				name: "Glacier Mist",
				hue: 190,
				hex: "#06B6D4",
				code: "SKU-GLC-03"
			},
			{
				name: "Verdant Herbal",
				hue: 120,
				hex: "#10B981",
				code: "SKU-VRD-04"
			},
			{
				name: "Royal Plum",
				hue: 275,
				hex: "#8B5CF6",
				code: "SKU-PLM-05"
			}
		]
	}
];
var STUDIO_BACKDROPS = [
	{
		id: "transparent",
		label: "Alpha PNG",
		bgClass: "checkerboard-subtle",
		dotColor: "bg-neutral-300"
	},
	{
		id: "white",
		label: "E-Com #FFF",
		bgClass: "bg-white",
		dotColor: "bg-white border border-neutral-300"
	},
	{
		id: "gray",
		label: "Studio Neutral",
		bgClass: "bg-[#F1F3F5]",
		dotColor: "bg-neutral-300"
	},
	{
		id: "dark",
		label: "Charcoal Noir",
		bgClass: "bg-[#0F0F12]",
		dotColor: "bg-[#0F0F12]"
	}
];
function Home({ clients = [] }) {
	const [heroTabIdx, setHeroTabIdx] = useState(0);
	const currentHero = HERO_SHOWCASE_PLATES[heroTabIdx] || HERO_SHOWCASE_PLATES[0];
	const [splitPos, setSplitPos] = useState(50);
	const [isDraggingSplit, setIsDraggingSplit] = useState(false);
	const [heroFinishMode, setHeroFinishMode] = useState("master");
	const heroStageRef = useRef(null);
	const [expandedAccordion, setExpandedAccordion] = useState(1);
	const [accordionRawMap, setAccordionRawMap] = useState({});
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
	const [globalRawMode, setGlobalRawMode] = useState(false);
	const [hoveredBentoId, setHoveredBentoId] = useState(null);
	const [lightboxItem, setLightboxItem] = useState(null);
	const [selectedCapabilities, setSelectedCapabilities] = useState(["Precision Clipping", "3D Ghost Mannequin"]);
	const [selectedTurnaround, setSelectedTurnaround] = useState("12h Express");
	const [volumeSlider, setVolumeSlider] = useState(250);
	const [trialSubmitted, setTrialSubmitted] = useState(false);
	const [uploadedFiles, setUploadedFiles] = useState([]);
	const fileInputRef = useRef(null);
	useEffect(() => {
		let frameId;
		let start = null;
		const duration = 1400;
		const timer = setTimeout(() => {
			const step = (timestamp) => {
				if (!start) start = timestamp;
				const progress = Math.min((timestamp - start) / duration, 1);
				const offset = Math.sin(progress * Math.PI * 2) * 12;
				setSplitPos(50 + offset);
				if (progress < 1) frameId = requestAnimationFrame(step);
				else setSplitPos(50);
			};
			frameId = requestAnimationFrame(step);
		}, 900);
		return () => {
			clearTimeout(timer);
			cancelAnimationFrame(frameId);
		};
	}, []);
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
		if (e.target.files && e.target.files.length > 0) setUploadedFiles((prev) => [...prev, ...Array.from(e.target.files)]);
	};
	const currentStudioProduct = STUDIO_PRODUCTS[activeStudioProductIdx] || STUDIO_PRODUCTS[0];
	const currentStudioSwatch = currentStudioProduct.swatches[activeSwatchIdx] || currentStudioProduct.swatches[0];
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
			shadowPart = `drop-shadow(0 ${Math.round(24 * sScale)}px ${blur}px rgba(15,15,18,${(.28 * sScale).toFixed(2)}))`;
		}
		return `hue-rotate(${hue}deg) ${polishPart} ${shadowPart}`.trim();
	};
	const volumeTierInfo = useMemo(() => {
		if (volumeSlider < 100) return {
			sla: "6h Rush SLA",
			badge: "⚡ Express Rush",
			desc: "Dedicated Senior Retoucher • Express Pilot"
		};
		if (volumeSlider <= 1e3) return {
			sla: "12h Express Studio SLA",
			badge: "⏱️ Studio SLA",
			desc: "Multi-Desk Production • Dual-Pass Quality Control"
		};
		return {
			sla: "Custom Enterprise SLA",
			badge: "👑 Enterprise SLA",
			desc: "Dedicated Art Director • Automated Slack/FTP API Ingest"
		};
	}, [volumeSlider]);
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-[#F8F9FA] text-[#0F0F12] antialiased selection:bg-[#0F0F12] selection:text-white",
		children: [
			/* @__PURE__ */ jsxs(Head, { children: [/* @__PURE__ */ jsx("title", { children: "CuttingEdger — Creative Digital Post-Production Studio" }), /* @__PURE__ */ jsx("meta", {
				name: "description",
				content: "Visual post-production for modern brands. 3D ghost mannequin, precision clipping, jewelry polish, cosmetics, and multi-SKU colorways."
			})] }),
			/* @__PURE__ */ jsx("div", {
				className: "sticky top-5 z-50 px-4 sm:px-8 pointer-events-none",
				children: /* @__PURE__ */ jsxs("header", {
					className: "max-w-7xl mx-auto h-16 px-6 rounded-full bg-white/90 backdrop-blur-xl border border-neutral-200/80 shadow-[0_8px_30px_rgba(15,15,18,0.04)] flex items-center justify-between pointer-events-auto",
					children: [
						/* @__PURE__ */ jsxs("a", {
							href: "#",
							className: "text-lg font-extrabold tracking-tight text-[#0F0F12] flex items-center gap-2",
							children: [/* @__PURE__ */ jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse" }), /* @__PURE__ */ jsx("span", { children: "CuttingEdger." })]
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
							className: "px-5 py-2.5 rounded-full bg-[#0F0F12] text-white text-xs font-bold hover:bg-neutral-800 transition-all flex items-center gap-1.5 shadow-sm",
							children: [/* @__PURE__ */ jsx("span", { children: "Start Free Trial" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-3.5 h-3.5" })]
						})
					]
				})
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "max-w-7xl mx-auto px-4 sm:px-8 pt-8 pb-14",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "text-center max-w-3xl mx-auto mb-9",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-neutral-200/80 mb-4 shadow-[0_2px_8px_rgba(0,0,0,0.03)]",
							children: [/* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse" }), /* @__PURE__ */ jsx("span", {
								className: "text-[11px] font-extrabold uppercase tracking-widest text-[#0F0F12]",
								children: "DIGITAL POST-PRODUCTION STUDIO"
							})]
						}),
						/* @__PURE__ */ jsx("h1", {
							className: "text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0F0F12] leading-[1.08]",
							children: "Visual Post-Production for Modern Brands."
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-xs sm:text-base text-neutral-500 font-medium mt-3.5 max-w-xl mx-auto leading-relaxed",
							children: "100% hand-drawn pen-tool vector paths, invisible ghost mannequin drape, and colorways with guaranteed 12-hour turnaround."
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap items-center justify-center gap-3 mt-6",
							children: [/* @__PURE__ */ jsxs("a", {
								href: "#free-sample",
								className: "px-6 py-3.5 rounded-full bg-[#0F0F12] text-white text-xs sm:text-sm font-extrabold hover:bg-neutral-800 transition-all flex items-center gap-2 shadow-[0_4px_16px_rgba(15,15,18,0.12)] hover:shadow-[0_8px_24px_rgba(15,15,18,0.2)]",
								children: [/* @__PURE__ */ jsx("span", { children: "Get 3 Free Sample Retouches" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4" })]
							}), /* @__PURE__ */ jsx("a", {
								href: "#interactive-studio",
								className: "px-5 py-3.5 rounded-full bg-white text-neutral-700 hover:text-[#0F0F12] border border-neutral-200/80 text-xs sm:text-sm font-bold transition-all shadow-sm hover:shadow",
								children: "Test Live Playground ↓"
							})]
						})
					]
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
					className: "relative w-full h-[470px] sm:h-[550px] rounded-[32px] overflow-hidden select-none cursor-ew-resize border border-neutral-200/80 shadow-[0_25px_60px_rgba(15,15,18,0.08)] bg-white",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "absolute inset-0 bg-[#F4F4F6]",
							children: /* @__PURE__ */ jsx("img", {
								src: currentHero.image,
								alt: currentHero.title,
								draggable: "false",
								className: "w-full h-full object-cover object-center transition-all duration-700",
								style: { filter: currentHero.doneFilter }
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
							className: "absolute top-0 bottom-0 z-10 w-0.5 bg-white shadow-[0_0_20px_rgba(0,0,0,0.4)] pointer-events-none",
							style: { left: `${splitPos}%` },
							children: /* @__PURE__ */ jsxs("div", {
								className: "absolute top-1/2 -translate-x-1/2 -translate-y-1/2 px-3.5 py-1.5 rounded-full bg-white text-[#0F0F12] shadow-2xl flex items-center gap-1.5 border border-neutral-200 text-[10px] font-black uppercase tracking-wider whitespace-nowrap",
								children: [
									/* @__PURE__ */ jsx("span", { children: "RAW" }),
									/* @__PURE__ */ jsx("span", {
										className: "opacity-30",
										children: "|"
									}),
									/* @__PURE__ */ jsx("span", {
										className: "text-emerald-600 font-extrabold",
										children: "MASTER"
									})
								]
							})
						}),
						/* @__PURE__ */ jsx("div", { className: "absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" }),
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
								/* @__PURE__ */ jsx("span", {
									className: "text-xs text-neutral-300 font-medium mt-1 block",
									children: currentHero.metric
								})
							] }), /* @__PURE__ */ jsx("div", {
								className: "flex items-center gap-1.5 bg-black/50 backdrop-blur-md p-1.5 rounded-full border border-white/20 self-start sm:self-auto",
								children: HERO_SHOWCASE_PLATES.map((plate, index) => /* @__PURE__ */ jsx("button", {
									onClick: () => setHeroTabIdx(index),
									className: `px-3 py-1 rounded-full text-[11px] font-extrabold transition-all ${heroTabIdx === index ? "bg-white text-[#0F0F12] shadow-sm" : "text-neutral-300 hover:text-white"}`,
									children: plate.category
								}, plate.id))
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
										type: "button",
										onClick: (e) => {
											e.stopPropagation();
											setAccordionRawMap((prev) => ({
												...prev,
												[panel.id]: !prev[panel.id]
											}));
										},
										className: `absolute top-4 right-4 z-20 px-4 py-1.5 rounded-full text-xs font-extrabold transition-all shadow-md ${isRaw ? "bg-amber-400 text-[#0F0F12]" : "bg-white text-[#0F0F12] hover:bg-neutral-100"}`,
										children: isRaw ? "Viewing: RAW" : "Viewing: EDITED"
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
						className: "flex flex-col sm:flex-row sm:items-end justify-between mb-7 gap-3",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 mb-1.5",
							children: [/* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse" }), /* @__PURE__ */ jsx("span", {
								className: "text-[11px] font-extrabold uppercase tracking-widest text-emerald-600",
								children: "REAL-TIME POST-PRODUCTION PLAYGROUND"
							})]
						}), /* @__PURE__ */ jsx("h2", {
							className: "text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F0F12]",
							children: "Interactive Retouching Studio"
						})] }), /* @__PURE__ */ jsx("p", {
							className: "text-xs sm:text-sm font-medium text-neutral-500 max-w-md",
							children: "Toggle non-destructive studio layers, test marketplace backdrops, and preview live SKU colorways in real time."
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "lg:col-span-8 flex flex-col rounded-[28px] bg-white border border-neutral-200/80 shadow-sm overflow-hidden",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "px-4 sm:px-6 py-3 border-b border-neutral-200/70 flex flex-wrap items-center justify-between gap-3 bg-white/95 backdrop-blur-md",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "flex items-center gap-1 bg-neutral-100 p-1 rounded-xl",
										children: STUDIO_PRODUCTS.map((prod, idx) => /* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: () => {
												setActiveStudioProductIdx(idx);
												setActiveSwatchIdx(0);
											},
											className: `px-3 py-1 rounded-lg text-xs font-extrabold transition-all ${activeStudioProductIdx === idx ? "bg-[#0F0F12] text-white shadow-xs" : "text-neutral-500 hover:text-[#0F0F12]"}`,
											children: prod.label
										}, prod.id))
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-1.5",
										children: [/* @__PURE__ */ jsx("span", {
											className: "hidden sm:inline text-[11px] font-bold text-neutral-400 mr-0.5",
											children: "Stage:"
										}), STUDIO_BACKDROPS.map((bd) => /* @__PURE__ */ jsxs("button", {
											type: "button",
											onClick: () => setActiveStudioBackdrop(bd.id),
											className: `px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all flex items-center gap-1.5 ${activeStudioBackdrop === bd.id ? "bg-[#0F0F12] text-white border-[#0F0F12] shadow-xs" : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"}`,
											title: bd.title,
											children: [/* @__PURE__ */ jsx("span", { className: `w-2 h-2 rounded-full ${bd.dotColor}` }), /* @__PURE__ */ jsx("span", {
												className: "hidden md:inline",
												children: bd.label
											})]
										}, bd.id))]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-1.5",
										children: [/* @__PURE__ */ jsxs("button", {
											type: "button",
											onMouseDown: () => setIsPeekingRaw(true),
											onMouseUp: () => setIsPeekingRaw(false),
											onTouchStart: () => setIsPeekingRaw(true),
											onTouchEnd: () => setIsPeekingRaw(false),
											onClick: () => setIsPeekingRaw((prev) => !prev),
											className: `px-3 py-1 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 ${isPeekingRaw ? "bg-amber-500 text-white border-amber-500 shadow-xs" : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50"}`,
											title: "Click or hold to view unretouched RAW exposure",
											children: [/* @__PURE__ */ jsx(Eye, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", {
												className: "hidden sm:inline",
												children: isPeekingRaw ? "Viewing RAW" : "Peek RAW"
											})]
										}), /* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: () => {
												setLayerCutout(true);
												setLayerShadow(true);
												setLayerPolish(true);
												setShadowIntensity(85);
												setPolishIntensity(90);
												setActiveSwatchIdx(0);
												setShowVectorPath(false);
												setIsPeekingRaw(false);
												setActiveStudioBackdrop("transparent");
											},
											className: "w-8 h-8 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-[#0F0F12] hover:bg-neutral-50 transition-colors",
											title: "Reset Studio Layers",
											children: /* @__PURE__ */ jsx(RotateCcw, { className: "w-3.5 h-3.5" })
										})]
									})
								]
							}), /* @__PURE__ */ jsxs("div", {
								className: `relative h-[380px] sm:h-[440px] flex items-center justify-center p-6 overflow-hidden transition-colors duration-500 ${isPeekingRaw ? "bg-[#D6D3CD]" : layerCutout ? STUDIO_BACKDROPS.find((b) => b.id === activeStudioBackdrop)?.bgClass || "checkerboard-subtle" : "bg-[#D8D5CE]"}`,
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "relative max-w-full max-h-full flex items-center justify-center",
										children: [/* @__PURE__ */ jsx("img", {
											src: currentStudioProduct.image,
											alt: currentStudioProduct.title,
											className: `max-h-[290px] sm:max-h-[340px] w-auto object-contain transition-all duration-300 ${isPeekingRaw ? "scale-95" : layerCutout ? activeStudioBackdrop === "dark" ? "scale-95" : "mix-blend-multiply scale-95" : "scale-100"}`,
											style: { filter: getPlaygroundFilter() }
										}), showVectorPath && !isPeekingRaw && /* @__PURE__ */ jsxs("svg", {
											className: "absolute inset-0 w-full h-full pointer-events-none drop-shadow-[0_2px_8px_rgba(6,182,212,0.4)]",
											viewBox: "0 0 400 300",
											fill: "none",
											children: [
												/* @__PURE__ */ jsx("path", {
													d: "M 60 170 C 60 120, 110 90, 190 85 C 260 80, 310 115, 340 160 C 355 185, 335 225, 290 230 C 220 235, 120 235, 75 220 C 65 210, 60 190, 60 170 Z",
													stroke: "#06B6D4",
													strokeWidth: "1.75",
													strokeDasharray: "4 3"
												}),
												[
													{
														cx: 60,
														cy: 170
													},
													{
														cx: 120,
														cy: 92
													},
													{
														cx: 190,
														cy: 85
													},
													{
														cx: 260,
														cy: 110
													},
													{
														cx: 340,
														cy: 160
													},
													{
														cx: 330,
														cy: 215
													},
													{
														cx: 290,
														cy: 230
													},
													{
														cx: 180,
														cy: 233
													},
													{
														cx: 75,
														cy: 220
													}
												].map((pt, i) => /* @__PURE__ */ jsxs("g", { children: [/* @__PURE__ */ jsx("circle", {
													cx: pt.cx,
													cy: pt.cy,
													r: "4",
													fill: "#06B6D4",
													stroke: "#ffffff",
													strokeWidth: "1.5"
												}), /* @__PURE__ */ jsx("circle", {
													cx: pt.cx,
													cy: pt.cy,
													r: "6",
													fill: "transparent",
													stroke: "#06B6D4",
													strokeWidth: "0.75",
													opacity: "0.6"
												})] }, i)),
												/* @__PURE__ */ jsx("line", {
													x1: "190",
													y1: "85",
													x2: "160",
													y2: "85",
													stroke: "#06B6D4",
													strokeWidth: "1"
												}),
												/* @__PURE__ */ jsx("line", {
													x1: "190",
													y1: "85",
													x2: "220",
													y2: "85",
													stroke: "#06B6D4",
													strokeWidth: "1"
												}),
												/* @__PURE__ */ jsx("circle", {
													cx: "160",
													cy: "85",
													r: "2.5",
													fill: "#ffffff",
													stroke: "#06B6D4",
													strokeWidth: "1"
												}),
												/* @__PURE__ */ jsx("circle", {
													cx: "220",
													cy: "85",
													r: "2.5",
													fill: "#ffffff",
													stroke: "#06B6D4",
													strokeWidth: "1"
												})
											]
										})]
									}),
									isPeekingRaw && /* @__PURE__ */ jsxs("div", {
										className: "absolute top-4 inset-x-0 mx-auto w-fit px-4 py-1.5 rounded-full bg-amber-500 text-white text-xs font-extrabold shadow-md flex items-center gap-1.5 animate-pulse",
										children: [/* @__PURE__ */ jsx(Eye, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "RAW Unretouched Exposure • All Filters Bypassed" })]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "absolute inset-x-0 bottom-0 px-5 py-3 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-center justify-between text-white text-xs pointer-events-none",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-2",
											children: [
												/* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" }),
												/* @__PURE__ */ jsx("span", {
													className: "font-extrabold text-white",
													children: currentStudioProduct.title
												}),
												/* @__PURE__ */ jsxs("span", {
													className: "hidden sm:inline text-white/70",
													children: ["• ", currentStudioSwatch.name]
												})
											]
										}), /* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-3 font-mono text-[11px] text-white/80",
											children: [
												/* @__PURE__ */ jsx("span", {
													className: "hidden md:inline",
													children: "16-Bit ProPhoto RGB"
												}),
												/* @__PURE__ */ jsx("span", {
													className: "hidden sm:inline",
													children: "300 DPI PSD"
												}),
												/* @__PURE__ */ jsx("span", {
													className: "px-2.5 py-0.5 rounded-full bg-white/20 text-white font-bold backdrop-blur-xs",
													children: layerCutout ? "Vector Isolated" : "Original Background"
												})
											]
										})]
									})
								]
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "lg:col-span-4 rounded-[28px] bg-white border border-neutral-200/80 p-5 sm:p-6 flex flex-col justify-between shadow-sm space-y-4",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "space-y-3.5",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between pb-1 border-b border-neutral-200/60",
										children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
											className: "text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 block",
											children: "STUDIO INSPECTOR"
										}), /* @__PURE__ */ jsx("h3", {
											className: "text-base font-extrabold text-[#0F0F12] -mt-0.5",
											children: "Non-Destructive Layers"
										})] }), /* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-[11px] font-bold",
											children: [/* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" }), /* @__PURE__ */ jsxs("span", { children: [[
												layerCutout,
												layerShadow,
												layerPolish
											].filter(Boolean).length, "/3 Active"] })]
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "p-3 rounded-2xl bg-[#F8F9FA] border border-neutral-200/70 transition-all hover:border-neutral-300/80",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "flex items-center justify-between gap-3",
											children: [/* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-3 min-w-0",
												children: [/* @__PURE__ */ jsx("div", {
													className: `w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${layerCutout ? "bg-emerald-50 text-emerald-600" : "bg-neutral-200/60 text-neutral-400"}`,
													children: /* @__PURE__ */ jsx(Scissors, { className: "w-4 h-4" })
												}), /* @__PURE__ */ jsxs("div", {
													className: "min-w-0",
													children: [/* @__PURE__ */ jsx("div", {
														className: "text-xs font-extrabold text-[#0F0F12] truncate",
														children: "Pen-Tool Vector Cutout"
													}), /* @__PURE__ */ jsx("div", {
														className: "text-[11px] font-medium text-neutral-500",
														children: "300% zoom hand-drawn path"
													})]
												})]
											}), /* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => setLayerCutout(!layerCutout),
												className: `w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 shrink-0 ${layerCutout ? "bg-emerald-500" : "bg-neutral-300"}`,
												"aria-label": "Toggle Pen Tool Cutout",
												children: /* @__PURE__ */ jsx("div", { className: `w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 transform ${layerCutout ? "translate-x-5" : "translate-x-0"}` })
											})]
										}), layerCutout && /* @__PURE__ */ jsxs("div", {
											className: "mt-2.5 pt-2 border-t border-neutral-200/60 flex items-center justify-between text-[11px]",
											children: [/* @__PURE__ */ jsx("span", {
												className: "text-neutral-500 font-medium",
												children: "Bézier Vector Anchors"
											}), /* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => setShowVectorPath(!showVectorPath),
												className: `px-2 py-0.5 rounded-md font-bold text-[10px] transition-all ${showVectorPath ? "bg-emerald-100 text-emerald-800 border border-emerald-200" : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50"}`,
												children: showVectorPath ? "Overlay Active" : "Inspect Path"
											})]
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "p-3 rounded-2xl bg-[#F8F9FA] border border-neutral-200/70 transition-all hover:border-neutral-300/80",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "flex items-center justify-between gap-3",
											children: [/* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-3 min-w-0",
												children: [/* @__PURE__ */ jsx("div", {
													className: `w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${layerShadow ? "bg-emerald-50 text-emerald-600" : "bg-neutral-200/60 text-neutral-400"}`,
													children: /* @__PURE__ */ jsx(Sun, { className: "w-4 h-4" })
												}), /* @__PURE__ */ jsxs("div", {
													className: "min-w-0",
													children: [/* @__PURE__ */ jsx("div", {
														className: "text-xs font-extrabold text-[#0F0F12] truncate",
														children: "Natural Floor Shadow"
													}), /* @__PURE__ */ jsx("div", {
														className: "text-[11px] font-medium text-neutral-500",
														children: "Dual-pass grounded depth"
													})]
												})]
											}), /* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => setLayerShadow(!layerShadow),
												className: `w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 shrink-0 ${layerShadow ? "bg-emerald-500" : "bg-neutral-300"}`,
												"aria-label": "Toggle Floor Shadow",
												children: /* @__PURE__ */ jsx("div", { className: `w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 transform ${layerShadow ? "translate-x-5" : "translate-x-0"}` })
											})]
										}), layerShadow && /* @__PURE__ */ jsxs("div", {
											className: "mt-2.5 pt-2 border-t border-neutral-200/60 flex items-center gap-2",
											children: [
												/* @__PURE__ */ jsx("span", {
													className: "text-[10px] font-semibold text-neutral-400 uppercase tracking-wider shrink-0",
													children: "Depth"
												}),
												/* @__PURE__ */ jsx("input", {
													type: "range",
													min: "20",
													max: "100",
													value: shadowIntensity,
													onChange: (e) => setShadowIntensity(Number(e.target.value)),
													className: "w-full accent-emerald-500 h-1.5 bg-neutral-200 rounded-lg cursor-pointer"
												}),
												/* @__PURE__ */ jsxs("span", {
													className: "text-[11px] font-mono font-bold text-neutral-600 shrink-0 w-8 text-right",
													children: [shadowIntensity, "%"]
												})
											]
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "p-3 rounded-2xl bg-[#F8F9FA] border border-neutral-200/70 transition-all hover:border-neutral-300/80",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "flex items-center justify-between gap-3",
											children: [/* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-3 min-w-0",
												children: [/* @__PURE__ */ jsx("div", {
													className: `w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${layerPolish ? "bg-emerald-50 text-emerald-600" : "bg-neutral-200/60 text-neutral-400"}`,
													children: /* @__PURE__ */ jsx(Wand2, { className: "w-4 h-4" })
												}), /* @__PURE__ */ jsxs("div", {
													className: "min-w-0",
													children: [/* @__PURE__ */ jsx("div", {
														className: "text-xs font-extrabold text-[#0F0F12] truncate",
														children: "Studio Polish & Clarity"
													}), /* @__PURE__ */ jsx("div", {
														className: "text-[11px] font-medium text-neutral-500",
														children: "Dust, glue & reflection cleanup"
													})]
												})]
											}), /* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => setLayerPolish(!layerPolish),
												className: `w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 shrink-0 ${layerPolish ? "bg-emerald-500" : "bg-neutral-300"}`,
												"aria-label": "Toggle Polish",
												children: /* @__PURE__ */ jsx("div", { className: `w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 transform ${layerPolish ? "translate-x-5" : "translate-x-0"}` })
											})]
										}), layerPolish && /* @__PURE__ */ jsxs("div", {
											className: "mt-2.5 pt-2 border-t border-neutral-200/60 flex items-center gap-2",
											children: [
												/* @__PURE__ */ jsx("span", {
													className: "text-[10px] font-semibold text-neutral-400 uppercase tracking-wider shrink-0",
													children: "Clarity"
												}),
												/* @__PURE__ */ jsx("input", {
													type: "range",
													min: "30",
													max: "100",
													value: polishIntensity,
													onChange: (e) => setPolishIntensity(Number(e.target.value)),
													className: "w-full accent-emerald-500 h-1.5 bg-neutral-200 rounded-lg cursor-pointer"
												}),
												/* @__PURE__ */ jsxs("span", {
													className: "text-[11px] font-mono font-bold text-neutral-600 shrink-0 w-8 text-right",
													children: [polishIntensity, "%"]
												})
											]
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "p-3 rounded-2xl bg-[#F8F9FA] border border-neutral-200/70 transition-all hover:border-neutral-300/80",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "flex items-center justify-between mb-2",
											children: [/* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ jsx("div", {
													className: "w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0",
													children: /* @__PURE__ */ jsx(Palette, { className: "w-4 h-4" })
												}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
													className: "text-xs font-extrabold text-[#0F0F12]",
													children: "Instant SKU Color Match"
												}), /* @__PURE__ */ jsx("div", {
													className: "text-[11px] font-medium text-neutral-500",
													children: "Delta-E calibrated colorways"
												})] })]
											}), /* @__PURE__ */ jsx("span", {
												className: "text-[10px] font-mono font-bold text-neutral-600 bg-white px-2 py-0.5 rounded-md border border-neutral-200/80",
												children: currentStudioSwatch.code
											})]
										}), /* @__PURE__ */ jsxs("div", {
											className: "flex items-center justify-between gap-2 pt-1",
											children: [/* @__PURE__ */ jsx("div", {
												className: "flex items-center gap-2",
												children: currentStudioProduct.swatches.map((swatch, idx) => /* @__PURE__ */ jsx("button", {
													type: "button",
													onClick: () => setActiveSwatchIdx(idx),
													className: `relative w-7 h-7 rounded-full transition-all flex items-center justify-center ${activeSwatchIdx === idx ? "scale-110 ring-2 ring-[#0F0F12] ring-offset-2 shadow-xs" : "hover:scale-105 opacity-80 hover:opacity-100"}`,
													style: { backgroundColor: swatch.hex },
													title: `${swatch.name} (${swatch.code})`,
													children: activeSwatchIdx === idx && /* @__PURE__ */ jsx(Check, { className: "w-3 h-3 text-white stroke-[3] drop-shadow-sm" })
												}, swatch.code))
											}), /* @__PURE__ */ jsx("span", {
												className: "text-xs font-bold text-neutral-700 truncate max-w-[110px]",
												children: currentStudioSwatch.name
											})]
										})]
									})
								]
							}), /* @__PURE__ */ jsxs("div", {
								className: "pt-2 border-t border-neutral-200/60 space-y-2.5",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between text-xs text-neutral-500",
									children: [/* @__PURE__ */ jsx("span", {
										className: "font-semibold",
										children: "Turnaround SLA:"
									}), /* @__PURE__ */ jsx("span", {
										className: "font-extrabold text-[#0F0F12]",
										children: currentStudioProduct.turnaround
									})]
								}), /* @__PURE__ */ jsxs("a", {
									href: "#free-sample",
									className: "w-full py-3.5 rounded-full bg-[#0F0F12] text-white text-xs font-extrabold hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 shadow-xs group",
									children: [/* @__PURE__ */ jsx("span", { children: "Test With Your Own Product" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" })]
								})]
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
										children: "Send us up to 3 RAW product images. We retouch them to your exact brand specifications and return master files within hours."
									})
								] }),
								/* @__PURE__ */ jsxs("div", {
									className: "p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3",
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ jsx("span", {
												className: "text-[11px] font-extrabold uppercase tracking-wider text-neutral-400",
												children: "ESTIMATED MONTHLY ASSETS"
											}), /* @__PURE__ */ jsx("span", {
												className: "text-xs font-black text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full",
												children: volumeSlider >= 1e3 ? "1,000+ images/mo" : `${volumeSlider} images/mo`
											})]
										}),
										/* @__PURE__ */ jsx("input", {
											type: "range",
											min: "20",
											max: "1200",
											step: "20",
											value: volumeSlider,
											onChange: (e) => setVolumeSlider(Number(e.target.value)),
											className: "w-full accent-emerald-400 cursor-pointer h-2 bg-white/10 rounded-lg appearance-none"
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-center justify-between text-[11px] font-bold text-neutral-400 pt-1",
											children: [/* @__PURE__ */ jsxs("span", {
												className: "text-white flex items-center gap-1.5",
												children: [
													/* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-400" }),
													volumeTierInfo.badge,
													": ",
													volumeTierInfo.sla
												]
											}), /* @__PURE__ */ jsx("span", {
												className: "opacity-75",
												children: volumeTierInfo.desc
											})]
										})
									]
								}),
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
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-3 pt-1",
									children: [/* @__PURE__ */ jsxs("span", {
										className: "text-xs text-neutral-400 flex items-center gap-1.5",
										children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "w-4 h-4 text-emerald-400" }), "Strict NDA Protection"]
									}), /* @__PURE__ */ jsx("div", {
										className: "flex items-center gap-1.5 opacity-60 text-[10px] font-mono uppercase",
										children: [
											"PSD",
											"TIFF",
											"CR3",
											"NEF",
											"PNG"
										].map((fmt) => /* @__PURE__ */ jsx("span", {
											className: "px-1.5 py-0.5 rounded bg-white/10",
											children: fmt
										}, fmt))
									})]
								})
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
												children: volumeTierInfo.sla
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
