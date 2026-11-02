import { i as useTheme } from "../ssr.js";
import { useEffect, useRef, useState } from "react";
import { Link } from "@inertiajs/react";
import { ArrowRight, ArrowUpRight, CheckCircle2, Moon, Pause, Play, Scissors, Sliders, Sparkles, Sun } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/HomeVariants/HomeRetouchStudio.tsx
var SERVICES_11 = [
	{
		id: "jewelry",
		number: "01",
		name: "Jewelry Retouch",
		tag: "Diamond & Gemstone Refraction",
		metric: "99.8% Facet Clarity",
		image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=90",
		rawImage: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80",
		turnaround: "12h Rush",
		category: "Luxury"
	},
	{
		id: "model-high",
		number: "02",
		name: "High End Model Retouch",
		tag: "16-Bit Frequency Separation",
		metric: "100% Skin Pores Kept",
		image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=90",
		rawImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80",
		turnaround: "12h Rush",
		category: "Fashion"
	},
	{
		id: "automobile",
		number: "03",
		name: "Automobile Retouch",
		tag: "Metallic Studio Reflections",
		metric: "Zero Rig Glare",
		image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=90",
		rawImage: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80",
		turnaround: "24h SLA",
		category: "Automotive"
	},
	{
		id: "ghost-mannequin",
		number: "04",
		name: "Ghost Mannequin",
		tag: "3D Invisible Neck Joint",
		metric: "Seamless 360° Drape",
		image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=90",
		rawImage: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80",
		turnaround: "8h Fast",
		category: "Apparel"
	},
	{
		id: "shoe-retouch",
		number: "05",
		name: "Shoe Retouch",
		tag: "Suede & Leather Finishing",
		metric: "Outsole & Sole Mirror",
		image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=90",
		rawImage: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=1200&q=80",
		turnaround: "8h Fast",
		category: "Footwear"
	},
	{
		id: "accessories",
		number: "06",
		name: "Accessories Retouch",
		tag: "Luxury Watches & Handbags",
		metric: "Brushed Metal Balancer",
		image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=90",
		rawImage: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80",
		turnaround: "12h Rush",
		category: "Luxury"
	},
	{
		id: "background-removal",
		number: "07",
		name: "Background Removal",
		tag: "Hand-Drawn Pen Tool Clipping",
		metric: "0.5px Feathered Bezier",
		image: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=90",
		rawImage: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80",
		turnaround: "4h Express",
		category: "Volume"
	},
	{
		id: "hollow-man",
		number: "08",
		name: "Hollow Man Service",
		tag: "360° Apparel Volume & Inseam",
		metric: "Inseam Joint Precision",
		image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=90",
		rawImage: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=80",
		turnaround: "8h Fast",
		category: "Apparel"
	},
	{
		id: "lifestyle-retouch",
		number: "09",
		name: "Lifestyle Retouch",
		tag: "Contact Shadows & Color Harmony",
		metric: "Natural Decay Shadows",
		image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=90",
		rawImage: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80",
		turnaround: "12h Rush",
		category: "Editorial"
	},
	{
		id: "regular-model",
		number: "10",
		name: "Regular Model Retouch",
		tag: "Catalog Blemish & Flyaway Cleanup",
		metric: "Batch Uniformity Grade",
		image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=90",
		rawImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=80",
		turnaround: "6h Express",
		category: "Catalog"
	},
	{
		id: "calendar-model",
		number: "11",
		name: "Calendar Model Retouch",
		tag: "Glamour Lighting & Glossy Pop",
		metric: "High Dynamic Contrast",
		image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=90",
		rawImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
		turnaround: "12h Rush",
		category: "Glamour"
	}
];
function ParallaxMouseCard({ service, isDark, onInspect }) {
	const cardRef = useRef(null);
	const [coords, setCoords] = useState({
		x: .5,
		y: .5
	});
	const [isHovered, setIsHovered] = useState(false);
	const [showRawPeek, setShowRawPeek] = useState(false);
	const animRef = useRef(null);
	const handleMouseMove = (e) => {
		if (!cardRef.current) return;
		const rect = cardRef.current.getBoundingClientRect();
		const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
		const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
		if (animRef.current) cancelAnimationFrame(animRef.current);
		animRef.current = requestAnimationFrame(() => {
			setCoords({
				x,
				y
			});
		});
	};
	const handleMouseEnter = () => setIsHovered(true);
	const handleMouseLeave = () => {
		setIsHovered(false);
		setShowRawPeek(false);
		setCoords({
			x: .5,
			y: .5
		});
	};
	const rotateY = isHovered ? (coords.x - .5) * 18 : 0;
	const rotateX = isHovered ? (coords.y - .5) * -18 : 0;
	const imgShiftX = isHovered ? (coords.x - .5) * -24 : 0;
	const imgShiftY = isHovered ? (coords.y - .5) * -24 : 0;
	return /* @__PURE__ */ jsxs("div", {
		ref: cardRef,
		onMouseMove: handleMouseMove,
		onMouseEnter: handleMouseEnter,
		onMouseLeave: handleMouseLeave,
		style: {
			transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) ${isHovered ? "translateY(-10px) scale(1.02)" : "translateY(0) scale(1)"}`,
			transition: isHovered ? "transform 0.08s ease-out" : "transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1)"
		},
		className: `group relative rounded-3xl overflow-hidden border shadow-2xl cursor-pointer will-change-transform ${isDark ? "bg-neutral-900/90 border-white/10 hover:border-[#de4a2c]/70 hover:shadow-[0_25px_50px_rgba(222,74,44,0.25)]" : "bg-white border-black/10 hover:border-[#de4a2c]/70 hover:shadow-[0_25px_50px_rgba(222,74,44,0.2)]"}`,
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "absolute inset-0 pointer-events-none z-30 transition-opacity duration-200",
				style: {
					background: isHovered ? `radial-gradient(circle 260px at ${coords.x * 100}% ${coords.y * 100}%, rgba(255,255,255,0.24) 0%, transparent 65%)` : "none",
					opacity: isHovered ? 1 : 0
				}
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "relative w-full h-[380px] sm:h-[440px] overflow-hidden bg-black",
				children: [
					/* @__PURE__ */ jsx("img", {
						src: showRawPeek ? service.rawImage : service.image,
						alt: service.name,
						style: {
							transform: `scale(${isHovered ? 1.12 : 1}) translate(${imgShiftX}px, ${imgShiftY}px)`,
							transition: isHovered ? "transform 0.1s ease-out" : "transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)"
						},
						className: `w-full h-full object-cover object-center select-none pointer-events-none ${showRawPeek ? "filter sepia-[0.1] contrast-90 brightness-95" : ""}`
					}),
					/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent pointer-events-none" }),
					/* @__PURE__ */ jsxs("div", {
						className: "absolute top-4 inset-x-4 flex items-center justify-between z-20 pointer-events-none",
						children: [/* @__PURE__ */ jsxs("span", {
							className: "px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-white font-mono text-[11px] font-bold border border-white/20 shadow-lg flex items-center gap-1.5",
							children: [/* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" }), /* @__PURE__ */ jsxs("span", { children: [
								service.number,
								". ",
								service.category
							] })]
						}), /* @__PURE__ */ jsx("span", {
							className: "px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono text-neutral-300 border border-white/15",
							children: service.turnaround
						})]
					}),
					/* @__PURE__ */ jsx("div", {
						style: {
							transform: `translateZ(30px) translate(${imgShiftX * .5}px, ${imgShiftY * .5}px)`,
							transition: "transform 0.1s ease-out"
						},
						className: "absolute top-16 right-4 z-20 px-3 py-1 rounded-full bg-[#de4a2c] text-white font-mono text-[10px] font-bold shadow-2xl border border-white/20 pointer-events-none",
						children: service.metric
					}),
					/* @__PURE__ */ jsx("button", {
						onClick: (e) => {
							e.stopPropagation();
							setShowRawPeek(!showRawPeek);
						},
						className: `absolute bottom-20 left-4 z-20 px-3 py-1 rounded-full font-mono text-[10px] font-bold transition-all border shadow-lg ${showRawPeek ? "bg-[#de4a2c] text-white border-white/20" : "bg-black/80 text-neutral-300 hover:text-white border-white/15"}`,
						children: showRawPeek ? "Showing: Raw Plate" : "Hold / Click: Peek Raw"
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "p-5 relative z-20 flex items-end justify-between gap-4",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
					className: "font-display text-lg font-bold text-white group-hover:text-[#de4a2c] transition-colors",
					children: service.name
				}), /* @__PURE__ */ jsx("p", {
					className: "text-xs font-mono text-neutral-300 mt-1",
					children: service.tag
				})] }), /* @__PURE__ */ jsx("button", {
					onClick: (e) => {
						e.stopPropagation();
						onInspect();
					},
					className: "w-10 h-10 rounded-full bg-white text-black hover:bg-[#de4a2c] hover:text-white transition-all flex items-center justify-center shrink-0 shadow-xl group/btn",
					"aria-label": `Inspect ${service.name}`,
					children: /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" })
				})]
			})
		]
	});
}
function HomeRetouchStudio({ clients = [] }) {
	const { isDark, toggleTheme } = useTheme();
	const [heroSplit, setHeroSplit] = useState(50);
	const [activeHeroSubject, setActiveHeroSubject] = useState(0);
	const [isHeroAutoSliding, setIsHeroAutoSliding] = useState(true);
	const [isUserHoveringHero, setIsUserHoveringHero] = useState(false);
	const heroAutoSlideAnimRef = useRef(null);
	const [mousePos, setMousePos] = useState({
		x: 0,
		y: 0,
		pctX: 50,
		pctY: 50
	});
	const [scrollY, setScrollY] = useState(0);
	const heroRef = useRef(null);
	useRef(null);
	const [activeStudioIndex, setActiveStudioIndex] = useState(0);
	const [studioSplit, setStudioSplit] = useState(50);
	const [isAutoSliding, setIsAutoSliding] = useState(true);
	const [isUserHoveringLab, setIsUserHoveringLab] = useState(false);
	const autoSlideAnimRef = useRef(null);
	useEffect(() => {
		let ticking = false;
		const handleScroll = () => {
			if (!ticking) {
				requestAnimationFrame(() => {
					setScrollY(window.scrollY);
					ticking = false;
				});
				ticking = true;
			}
		};
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);
	const handleHeroSectionMouseMove = (e) => {
		if (!heroRef.current) return;
		const rect = heroRef.current.getBoundingClientRect();
		const x = (e.clientX - rect.left) / rect.width - .5;
		const y = (e.clientY - rect.top) / rect.height - .5;
		const pctX = (e.clientX - rect.left) / rect.width * 100;
		const pctY = (e.clientY - rect.top) / rect.height * 100;
		setMousePos({
			x,
			y,
			pctX,
			pctY
		});
	};
	useEffect(() => {
		if (!isHeroAutoSliding || isUserHoveringHero) {
			if (heroAutoSlideAnimRef.current) cancelAnimationFrame(heroAutoSlideAnimRef.current);
			return;
		}
		let startTime = performance.now();
		const animateHeroAutoSlide = (currentTime) => {
			const elapsed = currentTime - startTime;
			const val = 50 + Math.sin(elapsed / 1300) * 31;
			setHeroSplit(Math.round(val));
			heroAutoSlideAnimRef.current = requestAnimationFrame(animateHeroAutoSlide);
		};
		heroAutoSlideAnimRef.current = requestAnimationFrame(animateHeroAutoSlide);
		return () => {
			if (heroAutoSlideAnimRef.current) cancelAnimationFrame(heroAutoSlideAnimRef.current);
		};
	}, [isHeroAutoSliding, isUserHoveringHero]);
	useEffect(() => {
		if (!isAutoSliding || isUserHoveringLab) {
			if (autoSlideAnimRef.current) cancelAnimationFrame(autoSlideAnimRef.current);
			return;
		}
		let startTime = performance.now();
		const animateAutoSlide = (currentTime) => {
			const elapsed = currentTime - startTime;
			const value = 50 + Math.sin(elapsed / 1200) * 32;
			setStudioSplit(Math.round(value));
			autoSlideAnimRef.current = requestAnimationFrame(animateAutoSlide);
		};
		autoSlideAnimRef.current = requestAnimationFrame(animateAutoSlide);
		return () => {
			if (autoSlideAnimRef.current) cancelAnimationFrame(autoSlideAnimRef.current);
		};
	}, [isAutoSliding, isUserHoveringLab]);
	const handleHeroStageMouseMove = (e) => {
		const rect = e.currentTarget.getBoundingClientRect();
		const clientX = e.clientX;
		const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
		const percent = Math.round(x / rect.width * 100);
		setHeroSplit(percent);
		const normX = (clientX - rect.left) / rect.width - .5;
		const normY = (e.clientY - rect.top) / rect.height - .5;
		const pctX = x / rect.width * 100;
		const pctY = (e.clientY - rect.top) / rect.height * 100;
		setMousePos({
			x: normX,
			y: normY,
			pctX,
			pctY
		});
	};
	const handleStudioSplitMove = (clientX, target) => {
		setIsAutoSliding(false);
		const rect = target.getBoundingClientRect();
		const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
		setStudioSplit(Math.round(x / rect.width * 100));
	};
	const scrollToLabWithIndex = (idx) => {
		setActiveStudioIndex(idx);
		setStudioSplit(50);
		const el = document.getElementById("studio-lab");
		if (el) el.scrollIntoView({ behavior: "smooth" });
	};
	const heroShowcase = [
		{
			title: "Jewelry Refraction",
			subtitle: "Sub-micron diamond facet clarity",
			retouched: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1600&q=95",
			raw: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1600&q=80",
			badge: "01. JEWELRY"
		},
		{
			title: "High-Fashion Model",
			subtitle: "16-bit frequency separation with raw pores",
			retouched: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1600&q=95",
			raw: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1600&q=80",
			badge: "02. MODEL"
		},
		{
			title: "Automotive Finish",
			subtitle: "Specular metallic curve & alloy pop",
			retouched: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=95",
			raw: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1600&q=80",
			badge: "03. AUTOMOBILE"
		},
		{
			title: "Luxury Timepiece",
			subtitle: "Brushed metal & lens reflection control",
			retouched: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1600&q=95",
			raw: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1600&q=80",
			badge: "06. ACCESSORIES"
		}
	];
	const currentHero = heroShowcase[activeHeroSubject];
	const currentStudio = SERVICES_11[activeStudioIndex];
	return /* @__PURE__ */ jsxs("div", {
		className: `min-h-screen transition-colors duration-300 font-sans antialiased overflow-x-hidden selection:bg-[#de4a2c] selection:text-white ${isDark ? "bg-[#07080B] text-[#F3F4F6]" : "bg-[#F8F9FA] text-[#111318]"}`,
		children: [
			/* @__PURE__ */ jsxs("header", {
				className: `border-b sticky top-0 z-50 px-4 sm:px-8 lg:px-12 py-2.5 flex items-center justify-between transition-colors backdrop-blur-xl ${isDark ? "bg-[#07080B]/90 border-white/[0.08]" : "bg-white/90 border-black/[0.08] shadow-sm"}`,
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3",
						children: [
							/* @__PURE__ */ jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-[#de4a2c] animate-pulse" }),
							/* @__PURE__ */ jsx(Link, {
								href: "/",
								className: "font-display text-sm sm:text-base font-bold tracking-tight hover:opacity-80 transition-opacity",
								children: "CUTTING EDGER"
							}),
							/* @__PURE__ */ jsx("span", {
								className: isDark ? "text-white/20" : "text-black/20",
								children: "/"
							}),
							/* @__PURE__ */ jsx("span", {
								className: `text-xs font-mono uppercase tracking-wider hidden sm:inline ${isDark ? "text-neutral-400" : "text-neutral-500"}`,
								children: "Retouch Atelier (V8)"
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "hidden md:flex items-center gap-2",
						children: [
							/* @__PURE__ */ jsx("a", {
								href: "#parallax-runway",
								className: `px-3 py-1 rounded-full text-xs font-mono transition-colors border ${isDark ? "bg-white/5 hover:bg-white/10 text-neutral-300 border-white/5" : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border-black/5"}`,
								children: "Parallax Runway"
							}),
							/* @__PURE__ */ jsx("a", {
								href: "#studio-lab",
								className: `px-3 py-1 rounded-full text-xs font-mono transition-colors border ${isDark ? "bg-white/5 hover:bg-white/10 text-neutral-300 border-white/5" : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border-black/5"}`,
								children: "Auto-Slide Lab"
							}),
							/* @__PURE__ */ jsx("a", {
								href: "#services",
								className: `px-3 py-1 rounded-full text-xs font-mono transition-colors border ${isDark ? "bg-white/5 hover:bg-white/10 text-neutral-300 border-white/5" : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border-black/5"}`,
								children: "11 Services"
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ jsx("button", {
							onClick: toggleTheme,
							"aria-label": "Toggle Light and Dark Mode",
							className: `p-2 rounded-full border transition-all flex items-center justify-center ${isDark ? "bg-white/5 border-white/10 text-yellow-400 hover:bg-white/10" : "bg-neutral-100 border-black/10 text-neutral-800 hover:bg-neutral-200 shadow-sm"}`,
							children: isDark ? /* @__PURE__ */ jsx(Sun, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(Moon, { className: "w-4 h-4" })
						}), /* @__PURE__ */ jsxs(Link, {
							href: "/#free-sample",
							className: "px-4 py-1.5 rounded-full bg-[#de4a2c] hover:bg-[#c93f24] text-white text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-md shadow-[#de4a2c]/20",
							children: [/* @__PURE__ */ jsx("span", { children: "Test 3 Free" }), /* @__PURE__ */ jsx(ArrowRight, { className: "w-3.5 h-3.5" })]
						})]
					})
				]
			}),
			/* @__PURE__ */ jsxs("section", {
				ref: heroRef,
				onMouseMove: handleHeroSectionMouseMove,
				className: "relative max-w-[1520px] mx-auto px-4 sm:px-8 py-3 sm:py-4 flex flex-col justify-center overflow-hidden min-h-[calc(100vh-65px)]",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "absolute inset-0 pointer-events-none opacity-30 transition-opacity duration-300",
						style: { background: `radial-gradient(circle 480px at ${mousePos.pctX}% ${mousePos.pctY}%, rgba(222, 74, 44, 0.3) 0%, transparent 70%)` }
					}),
					/* @__PURE__ */ jsx("div", {
						className: `absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[12vw] font-display font-black tracking-tighter select-none pointer-events-none whitespace-nowrap transition-transform duration-100 ${isDark ? "text-white/[0.02]" : "text-black/[0.02]"}`,
						style: { transform: `translate(calc(-50% + ${mousePos.x * -35}px), calc(-50% + ${mousePos.y * -25}px))` },
						children: "RETOUCH ATELIER"
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2.5 relative z-20",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 text-xs font-mono text-[#de4a2c] font-bold tracking-wider",
							children: [
								/* @__PURE__ */ jsx(Sparkles, { className: "w-3.5 h-3.5" }),
								/* @__PURE__ */ jsx("span", { children: "Commercial Image Editing & Finishing" }),
								/* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-[#10b981] animate-ping" })
							]
						}), /* @__PURE__ */ jsx("h1", {
							className: "font-display text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight mt-0.5",
							children: "Visual Perfection at Commerce Velocity"
						})] }), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 flex-wrap",
							children: [/* @__PURE__ */ jsxs("button", {
								onClick: () => setIsHeroAutoSliding(!isHeroAutoSliding),
								className: `px-3 py-1 rounded-full text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all ${isHeroAutoSliding && !isUserHoveringHero ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm" : "bg-neutral-200 dark:bg-white/10 text-neutral-600 dark:text-neutral-400"}`,
								children: [isHeroAutoSliding && !isUserHoveringHero ? /* @__PURE__ */ jsx(Pause, { className: "w-3 h-3" }) : /* @__PURE__ */ jsx(Play, { className: "w-3 h-3" }), /* @__PURE__ */ jsx("span", { children: isHeroAutoSliding && !isUserHoveringHero ? "Auto-Scan Active" : "Hover / Manual" })]
							}), /* @__PURE__ */ jsx("div", {
								className: `flex items-center gap-1 p-1 rounded-2xl border text-xs font-mono ${isDark ? "bg-white/5 border-white/10" : "bg-white border-black/10 shadow-sm"}`,
								children: heroShowcase.map((item, idx) => /* @__PURE__ */ jsx("button", {
									onClick: () => {
										setActiveHeroSubject(idx);
										setHeroSplit(50);
									},
									className: `px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${activeHeroSubject === idx ? "bg-[#de4a2c] text-white font-bold shadow-md" : isDark ? "text-neutral-400 hover:text-white" : "text-neutral-600 hover:text-black"}`,
									children: item.badge
								}, item.badge))
							})]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						onMouseEnter: () => setIsUserHoveringHero(true),
						onMouseLeave: () => {
							setIsUserHoveringHero(false);
							setMousePos({
								x: 0,
								y: 0,
								pctX: 50,
								pctY: 50
							});
						},
						onMouseMove: handleHeroStageMouseMove,
						onTouchMove: (e) => {
							if (e.touches[0]) {
								const rect = e.currentTarget.getBoundingClientRect();
								const x = Math.max(0, Math.min(rect.width, e.touches[0].clientX - rect.left));
								setHeroSplit(Math.round(x / rect.width * 100));
							}
						},
						style: {
							transform: `perspective(1200px) rotateY(${mousePos.x * 4}deg) rotateX(${-mousePos.y * 3}deg)`,
							transition: isUserHoveringHero ? "transform 0.08s ease-out" : "transform 0.3s ease-out"
						},
						className: `relative w-full h-[440px] sm:h-[500px] md:h-[540px] lg:h-[580px] xl:h-[620px] max-h-[66vh] rounded-3xl overflow-hidden select-none border shadow-2xl cursor-ew-resize group z-10 transition-colors ${isDark ? "bg-black border-white/15 shadow-[0_20px_70px_rgba(222,74,44,0.15)]" : "bg-neutral-100 border-black/10 shadow-[0_20px_60px_rgba(0,0,0,0.1)]"}`,
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "absolute inset-0 w-full h-full",
								children: [/* @__PURE__ */ jsx("img", {
									src: currentHero.retouched,
									alt: currentHero.title,
									className: "w-full h-full object-cover object-center select-none pointer-events-none",
									draggable: false
								}), /* @__PURE__ */ jsxs("div", {
									className: "absolute top-4 right-4 z-20 px-3.5 py-1.5 rounded-full bg-black/85 backdrop-blur-md text-white font-mono text-xs font-bold border border-white/20 shadow-2xl flex items-center gap-1.5",
									children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5 text-[#10b981]" }), /* @__PURE__ */ jsxs("span", { children: ["Finished: ", currentHero.title] })]
								})]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "absolute inset-0 overflow-hidden z-20",
								style: { clipPath: `polygon(0 0, ${heroSplit}% 0, ${heroSplit}% 100%, 0 100%)` },
								children: /* @__PURE__ */ jsxs("div", {
									className: "w-full h-full relative",
									children: [/* @__PURE__ */ jsx("img", {
										src: currentHero.raw,
										alt: currentHero.title,
										className: "w-full h-full object-cover object-center select-none pointer-events-none filter sepia-[0.1] contrast-90 brightness-95 blur-[0.2px]",
										draggable: false
									}), /* @__PURE__ */ jsxs("div", {
										className: "absolute top-4 left-4 z-20 px-3.5 py-1.5 rounded-full bg-neutral-900/90 backdrop-blur-md text-neutral-300 font-mono text-xs font-bold border border-white/10 shadow-2xl flex items-center gap-1.5",
										children: [/* @__PURE__ */ jsx(Scissors, { className: "w-3.5 h-3.5 text-neutral-400" }), /* @__PURE__ */ jsx("span", { children: "Raw Unprocessed Plate" })]
									})]
								})
							}),
							/* @__PURE__ */ jsx("div", {
								className: "absolute top-0 bottom-0 w-[2px] bg-white shadow-[0_0_20px_#de4a2c,0_0_40px_#de4a2c] z-30 pointer-events-none",
								style: { left: `${heroSplit}%` },
								children: /* @__PURE__ */ jsx("div", {
									className: "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white text-black shadow-2xl border-2 border-black/20 flex items-center justify-center font-mono text-xs font-bold ring-4 ring-[#de4a2c]/30",
									children: "⟷"
								})
							}),
							/* @__PURE__ */ jsx("div", {
								className: "absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full bg-black/85 backdrop-blur-md text-white font-mono text-[11px] pointer-events-none shadow-2xl border border-white/15 text-center",
								children: /* @__PURE__ */ jsx("span", { children: isUserHoveringHero ? "Cursor Active: Move mouse horizontally to inspect" : `${currentHero.subtitle} • Hover to control` })
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: `flex items-center justify-between mt-3 px-1 text-xs font-mono ${isDark ? "text-neutral-400" : "text-neutral-600"}`,
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ jsx("button", {
									onClick: () => {
										setIsHeroAutoSliding(false);
										setHeroSplit(0);
									},
									className: `px-3 py-1 rounded-lg transition-colors ${heroSplit === 0 ? "bg-[#de4a2c] text-white font-bold" : isDark ? "bg-white/5 hover:bg-white/10" : "bg-neutral-200 hover:bg-neutral-300"}`,
									children: "Finished (100%)"
								}),
								/* @__PURE__ */ jsx("button", {
									onClick: () => {
										setIsHeroAutoSliding(false);
										setHeroSplit(50);
									},
									className: `px-3 py-1 rounded-lg transition-colors ${heroSplit === 50 ? "bg-[#de4a2c] text-white font-bold" : isDark ? "bg-white/5 hover:bg-white/10" : "bg-neutral-200 hover:bg-neutral-300"}`,
									children: "50 / 50 Split"
								}),
								/* @__PURE__ */ jsx("button", {
									onClick: () => {
										setIsHeroAutoSliding(false);
										setHeroSplit(100);
									},
									className: `px-3 py-1 rounded-lg transition-colors ${heroSplit === 100 ? "bg-[#de4a2c] text-white font-bold" : isDark ? "bg-white/5 hover:bg-white/10" : "bg-neutral-200 hover:bg-neutral-300"}`,
									children: "Raw (100%)"
								})
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsxs("span", {
								className: "text-[11px]",
								children: [
									"Split: ",
									heroSplit,
									"%"
								]
							}), /* @__PURE__ */ jsx("input", {
								type: "range",
								min: "0",
								max: "100",
								value: heroSplit,
								onChange: (e) => setHeroSplit(Number(e.target.value)),
								className: "w-24 sm:w-44 h-1.5 rounded-lg appearance-none cursor-pointer accent-[#de4a2c]"
							})]
						})]
					})
				]
			}),
			/* @__PURE__ */ jsxs("section", {
				id: "studio-lab",
				className: `py-16 sm:py-20 px-4 sm:px-8 max-w-[1520px] mx-auto border-t transition-colors ${isDark ? "border-white/[0.08]" : "border-black/[0.08]"}`,
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4",
					children: [/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 text-xs font-mono text-[#de4a2c] uppercase font-bold tracking-wider",
							children: [
								/* @__PURE__ */ jsx(Sliders, { className: "w-3.5 h-3.5" }),
								/* @__PURE__ */ jsx("span", { children: "Precision Studio Lab" }),
								/* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-[#10b981] animate-ping" })
							]
						}),
						/* @__PURE__ */ jsxs("h2", {
							className: "font-display text-2xl sm:text-4xl font-bold tracking-tight mt-1",
							children: [
								currentStudio.number,
								". ",
								currentStudio.name
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: `text-xs font-mono mt-1 ${isDark ? "text-neutral-400" : "text-neutral-600"}`,
							children: [
								currentStudio.tag,
								" • Key Metric: ",
								/* @__PURE__ */ jsx("span", {
									className: "text-[#de4a2c] font-bold",
									children: currentStudio.metric
								})
							]
						})
					] }), /* @__PURE__ */ jsx("div", {
						className: "flex items-center gap-2 overflow-x-auto no-scrollbar py-1",
						children: SERVICES_11.map((s, idx) => /* @__PURE__ */ jsx("button", {
							onClick: () => {
								setActiveStudioIndex(idx);
								setStudioSplit(50);
							},
							className: `px-3 py-1.5 rounded-full text-xs font-mono whitespace-nowrap transition-all ${activeStudioIndex === idx ? "bg-[#de4a2c] text-white font-bold shadow-md scale-105" : isDark ? "bg-white/5 text-neutral-400 hover:text-white" : "bg-neutral-200 text-neutral-700 hover:text-black"}`,
							children: /* @__PURE__ */ jsxs("span", { children: [
								s.number,
								". ",
								s.name.split(" ")[0]
							] })
						}, s.id))
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: `relative max-w-5xl mx-auto rounded-3xl border shadow-2xl p-4 sm:p-6 transition-colors ${isDark ? "bg-neutral-900 border-white/10" : "bg-white border-black/10"}`,
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between pb-3 mb-3 border-b border-black/[0.06] dark:border-white/[0.08] text-xs font-mono",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ jsx("span", {
									className: "font-bold uppercase",
									children: "Dynamic Finishing Inspection:"
								}), /* @__PURE__ */ jsxs("span", {
									className: "text-[#de4a2c] font-bold",
									children: [studioSplit, "% Scan Width"]
								})]
							}), /* @__PURE__ */ jsxs("button", {
								onClick: () => setIsAutoSliding(!isAutoSliding),
								className: `px-3 py-1 rounded-full text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all ${isAutoSliding ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm" : "bg-neutral-200 dark:bg-white/10 text-neutral-600 dark:text-neutral-400"}`,
								children: [isAutoSliding ? /* @__PURE__ */ jsx(Pause, { className: "w-3 h-3" }) : /* @__PURE__ */ jsx(Play, { className: "w-3 h-3" }), /* @__PURE__ */ jsx("span", { children: isAutoSliding ? "Auto-Slide Scanning (Active)" : "Auto-Slide Paused" })]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "relative w-full h-[460px] sm:h-[560px] md:h-[620px] rounded-2xl overflow-hidden bg-black select-none border border-black/10 cursor-ew-resize group shadow-inner",
							onMouseEnter: () => setIsUserHoveringLab(true),
							onMouseLeave: () => setIsUserHoveringLab(false),
							onMouseDown: (e) => handleStudioSplitMove(e.clientX, e.currentTarget),
							onTouchMove: (e) => {
								if (e.touches[0]) handleStudioSplitMove(e.touches[0].clientX, e.currentTarget);
							},
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "absolute inset-0 w-full h-full",
									children: [
										/* @__PURE__ */ jsx("img", {
											src: currentStudio.image,
											alt: currentStudio.name,
											className: "w-full h-full object-cover object-center select-none pointer-events-none",
											draggable: false
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "absolute top-4 right-4 z-20 px-3.5 py-1.5 rounded-full bg-black/85 backdrop-blur-md text-white font-mono text-xs font-bold border border-white/20 shadow-xl flex items-center gap-1.5",
											children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5 text-[#10b981]" }), /* @__PURE__ */ jsx("span", { children: "Finished 16-Bit Retouch" })]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "absolute bottom-4 right-4 z-20 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-[#10b981] font-mono text-xs font-bold border border-white/10 shadow-lg",
											children: ["✓ ", currentStudio.metric]
										})
									]
								}),
								/* @__PURE__ */ jsx("div", {
									className: "absolute inset-0 overflow-hidden z-20",
									style: { clipPath: `polygon(0 0, ${studioSplit}% 0, ${studioSplit}% 100%, 0 100%)` },
									children: /* @__PURE__ */ jsxs("div", {
										className: "w-full h-full relative",
										children: [/* @__PURE__ */ jsx("img", {
											src: currentStudio.rawImage,
											alt: currentStudio.name,
											className: "w-full h-full object-cover object-center select-none pointer-events-none filter sepia-[0.1] contrast-90 brightness-95 blur-[0.2px]",
											draggable: false
										}), /* @__PURE__ */ jsxs("div", {
											className: "absolute top-4 left-4 z-20 px-3.5 py-1.5 rounded-full bg-neutral-900/90 backdrop-blur-md text-neutral-300 font-mono text-xs font-bold border border-white/10 shadow-xl flex items-center gap-1.5",
											children: [/* @__PURE__ */ jsx(Scissors, { className: "w-3.5 h-3.5 text-neutral-400" }), /* @__PURE__ */ jsx("span", { children: "Raw Capture Plate" })]
										})]
									})
								}),
								/* @__PURE__ */ jsx("div", {
									className: "absolute top-0 bottom-0 w-[2px] bg-white shadow-[0_0_24px_rgba(255,255,255,1)] z-30 pointer-events-none",
									style: { left: `${studioSplit}%` },
									children: /* @__PURE__ */ jsx("div", {
										className: "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white text-black shadow-2xl border-2 border-black/20 flex items-center justify-center font-mono text-xs font-bold",
										children: "⟷"
									})
								}),
								/* @__PURE__ */ jsx("div", {
									className: "absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full bg-black/80 backdrop-blur-md text-white font-mono text-[11px] pointer-events-none shadow-xl border border-white/10",
									children: /* @__PURE__ */ jsx("span", { children: isAutoSliding && !isUserHoveringLab ? "Auto-Scanning • Hover or drag to pause" : "Drag left / right to inspect" })
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: `mt-4 pt-2.5 flex items-center justify-between text-xs font-mono ${isDark ? "text-neutral-400" : "text-neutral-600"}`,
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ jsx("button", {
										onClick: () => {
											setIsAutoSliding(false);
											setStudioSplit(0);
										},
										className: `px-3 py-1.5 rounded-lg transition-colors ${studioSplit === 0 ? "bg-[#de4a2c] text-white font-bold" : isDark ? "bg-white/5 hover:bg-white/10" : "bg-neutral-200 hover:bg-neutral-300"}`,
										children: "100% Finished"
									}),
									/* @__PURE__ */ jsx("button", {
										onClick: () => {
											setIsAutoSliding(false);
											setStudioSplit(50);
										},
										className: `px-3 py-1.5 rounded-lg transition-colors ${studioSplit === 50 ? "bg-[#de4a2c] text-white font-bold" : isDark ? "bg-white/5 hover:bg-white/10" : "bg-neutral-200 hover:bg-neutral-300"}`,
										children: "50 / 50 Split"
									}),
									/* @__PURE__ */ jsx("button", {
										onClick: () => {
											setIsAutoSliding(false);
											setStudioSplit(100);
										},
										className: `px-3 py-1.5 rounded-lg transition-colors ${studioSplit === 100 ? "bg-[#de4a2c] text-white font-bold" : isDark ? "bg-white/5 hover:bg-white/10" : "bg-neutral-200 hover:bg-neutral-300"}`,
										children: "100% Raw"
									})
								]
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ jsxs("span", {
									className: "text-[11px]",
									children: [
										"Slide: ",
										studioSplit,
										"%"
									]
								}), /* @__PURE__ */ jsx("input", {
									type: "range",
									min: "0",
									max: "100",
									value: studioSplit,
									onChange: (e) => {
										setIsAutoSliding(false);
										setStudioSplit(Number(e.target.value));
									},
									className: "w-24 sm:w-44 h-1.5 rounded-lg appearance-none cursor-pointer accent-[#de4a2c]"
								})]
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				id: "parallax-runway",
				className: `py-20 px-4 sm:px-8 max-w-[1520px] mx-auto border-t transition-colors ${isDark ? "border-white/[0.08]" : "border-black/[0.08]"}`,
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-3",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						className: "text-xs font-mono text-[#de4a2c] uppercase font-bold tracking-wider",
						children: "Interactive 3D Mouse Parallax"
					}), /* @__PURE__ */ jsx("h2", {
						className: "font-display text-2xl sm:text-4xl font-bold tracking-tight",
						children: "The Parallax Runway"
					})] }), /* @__PURE__ */ jsx("div", {
						className: `text-xs font-mono ${isDark ? "text-neutral-500" : "text-neutral-400"}`,
						children: "Move mouse over any card to trigger 3D perspective tilt & depth reflection"
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-start",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "space-y-6 sm:space-y-8 transition-transform duration-100 ease-out",
							style: { transform: `translateY(${scrollY * -.05}px)` },
							children: SERVICES_11.slice(0, 4).map((s) => /* @__PURE__ */ jsx(ParallaxMouseCard, {
								service: s,
								isDark,
								onInspect: () => {
									const idx = SERVICES_11.findIndex((item) => item.id === s.id);
									scrollToLabWithIndex(idx);
								}
							}, s.id))
						}),
						/* @__PURE__ */ jsx("div", {
							className: "space-y-6 sm:space-y-8 transition-transform duration-100 ease-out md:mt-14",
							style: { transform: `translateY(${scrollY * .07}px)` },
							children: SERVICES_11.slice(4, 8).map((s) => /* @__PURE__ */ jsx(ParallaxMouseCard, {
								service: s,
								isDark,
								onInspect: () => {
									const idx = SERVICES_11.findIndex((item) => item.id === s.id);
									scrollToLabWithIndex(idx);
								}
							}, s.id))
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-6 sm:space-y-8 transition-transform duration-100 ease-out md:-mt-8",
							style: { transform: `translateY(${scrollY * -.08}px)` },
							children: [SERVICES_11.slice(8, 11).map((s) => /* @__PURE__ */ jsx(ParallaxMouseCard, {
								service: s,
								isDark,
								onInspect: () => {
									const idx = SERVICES_11.findIndex((item) => item.id === s.id);
									scrollToLabWithIndex(idx);
								}
							}, s.id)), /* @__PURE__ */ jsxs("div", {
								className: "p-8 rounded-3xl bg-gradient-to-br from-[#de4a2c] via-[#b8371c] to-[#801e0a] text-white shadow-2xl flex flex-col justify-between h-[360px] border border-white/20",
								children: [/* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsx("span", {
										className: "text-xs font-mono uppercase tracking-wider bg-black/25 px-3 py-1 rounded-full",
										children: "Complimentary Evaluation"
									}),
									/* @__PURE__ */ jsx("h3", {
										className: "font-display text-2xl font-bold mt-4",
										children: "Test Your Own 3 RAW Images"
									}),
									/* @__PURE__ */ jsx("p", {
										className: "font-mono text-xs text-white/85 mt-2 leading-relaxed",
										children: "Experience non-destructive 16-bit finishing on your active product line. 24h SLA."
									})
								] }), /* @__PURE__ */ jsxs(Link, {
									href: "/#free-sample",
									className: "w-full py-3.5 px-4 rounded-xl bg-white text-black hover:bg-black hover:text-white font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xl",
									children: [/* @__PURE__ */ jsx("span", { children: "Upload 3 Test Files" }), /* @__PURE__ */ jsx(ArrowRight, { className: "w-3.5 h-3.5" })]
								})]
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				id: "services",
				className: `py-20 px-4 sm:px-8 max-w-[1520px] mx-auto border-t transition-colors ${isDark ? "border-white/[0.08]" : "border-black/[0.08]"}`,
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between mb-8",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						className: "text-xs font-mono text-[#de4a2c] uppercase font-bold tracking-wider",
						children: "Service Catalog"
					}), /* @__PURE__ */ jsx("h2", {
						className: "font-display text-2xl sm:text-4xl font-bold tracking-tight",
						children: "11 Specialist Disciplines"
					})] }), /* @__PURE__ */ jsx("span", {
						className: `text-xs font-mono ${isDark ? "text-neutral-500" : "text-neutral-400"}`,
						children: "Click any tile to inspect in Lab"
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4",
					children: SERVICES_11.map((service, idx) => /* @__PURE__ */ jsxs("button", {
						onClick: () => scrollToLabWithIndex(idx),
						className: `group p-3 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1.5 ${isDark ? "bg-neutral-900 border-white/10 hover:border-[#de4a2c]" : "bg-white border-black/10 hover:border-[#de4a2c] shadow-sm"}`,
						children: [/* @__PURE__ */ jsxs("div", {
							className: "relative w-full h-36 rounded-xl overflow-hidden bg-black mb-3",
							children: [/* @__PURE__ */ jsx("img", {
								src: service.image,
								alt: service.name,
								className: "w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
							}), /* @__PURE__ */ jsx("span", {
								className: "absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-mono text-[#de4a2c] font-bold",
								children: service.number
							})]
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
							className: "font-display text-xs font-bold group-hover:text-[#de4a2c] transition-colors truncate",
							children: service.name
						}), /* @__PURE__ */ jsx("div", {
							className: `text-[10px] font-mono truncate mt-0.5 ${isDark ? "text-neutral-400" : "text-neutral-500"}`,
							children: service.tag
						})] })]
					}, service.id))
				})]
			}),
			/* @__PURE__ */ jsx("section", {
				className: `py-20 px-4 sm:px-8 max-w-[1520px] mx-auto border-t transition-colors ${isDark ? "border-white/[0.08]" : "border-black/[0.08]"}`,
				children: /* @__PURE__ */ jsxs("div", {
					className: `max-w-3xl mx-auto text-center rounded-3xl border p-8 sm:p-12 shadow-2xl transition-colors ${isDark ? "bg-neutral-900 border-white/10" : "bg-white border-black/10 shadow-lg"}`,
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: `inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono mb-4 border ${isDark ? "bg-white/5 border-white/10 text-neutral-300" : "bg-neutral-100 border-black/10 text-neutral-700"}`,
							children: [/* @__PURE__ */ jsx(Sparkles, { className: "w-3.5 h-3.5 text-[#de4a2c]" }), /* @__PURE__ */ jsx("span", { children: "Complimentary Pilot Evaluation" })]
						}),
						/* @__PURE__ */ jsx("h2", {
							className: "font-display text-3xl sm:text-4xl font-bold mb-3",
							children: "Test 3 Images on Us."
						}),
						/* @__PURE__ */ jsx("p", {
							className: `font-mono text-xs mb-6 max-w-md mx-auto ${isDark ? "text-neutral-400" : "text-neutral-600"}`,
							children: "Drop 3 files. Receive hand-finished 16-bit layered proofs within 24 hours. Zero commitment."
						}),
						/* @__PURE__ */ jsxs(Link, {
							href: "/#free-sample",
							className: "inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#de4a2c] hover:bg-[#c93f24] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-xl shadow-[#de4a2c]/20",
							children: [/* @__PURE__ */ jsx("span", { children: "Upload 3 Test Images" }), /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })]
						})
					]
				})
			}),
			/* @__PURE__ */ jsxs("footer", {
				className: `border-t py-6 px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-between text-xs font-mono gap-4 transition-colors ${isDark ? "border-white/[0.08] text-neutral-500" : "border-black/[0.08] text-neutral-500"}`,
				children: [/* @__PURE__ */ jsx("div", { children: "Cutting Edger • 11 Commercial Image Editing Services • 16-Bit Non-Destructive" }), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-4",
					children: [
						/* @__PURE__ */ jsx("a", {
							href: "#parallax-runway",
							className: "hover:opacity-80 transition-opacity",
							children: "Parallax Runway"
						}),
						/* @__PURE__ */ jsx("span", {
							className: "opacity-30",
							children: "•"
						}),
						/* @__PURE__ */ jsx("a", {
							href: "#studio-lab",
							className: "hover:opacity-80 transition-opacity",
							children: "Auto-Slide Lab"
						}),
						/* @__PURE__ */ jsx("span", {
							className: "opacity-30",
							children: "•"
						}),
						/* @__PURE__ */ jsx("a", {
							href: "#services",
							className: "hover:opacity-80 transition-opacity",
							children: "11 Services"
						})
					]
				})]
			})
		]
	});
}
//#endregion
export { HomeRetouchStudio };
