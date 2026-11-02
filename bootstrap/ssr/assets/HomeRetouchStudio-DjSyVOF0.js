import { useEffect, useRef, useState } from "react";
import { Link } from "@inertiajs/react";
import { ArrowRight, CheckCircle2, Scissors, Sparkles } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/HomeVariants/HomeRetouchStudio.tsx
var SERVICES_11 = [
	{
		id: "jewelry",
		number: "01",
		name: "Jewelry Retouch",
		tag: "Diamond & Gemstone Refraction",
		image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=90",
		rawImage: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80",
		turnaround: "12h"
	},
	{
		id: "model-high",
		number: "02",
		name: "High End Model Retouch",
		tag: "16-Bit Frequency Separation",
		image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=90",
		rawImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80",
		turnaround: "12h"
	},
	{
		id: "automobile",
		number: "03",
		name: "Automobile Retouch",
		tag: "Metallic Studio Reflections",
		image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=90",
		rawImage: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80",
		turnaround: "24h"
	},
	{
		id: "ghost-mannequin",
		number: "04",
		name: "Ghost Mannequin",
		tag: "3D Invisible Neck Joint",
		image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=90",
		rawImage: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80",
		turnaround: "8h"
	},
	{
		id: "shoe-retouch",
		number: "05",
		name: "Shoe Retouch",
		tag: "Suede & Leather Finishing",
		image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=90",
		rawImage: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=1200&q=80",
		turnaround: "8h"
	},
	{
		id: "accessories",
		number: "06",
		name: "Accessories Retouch",
		tag: "Luxury Watches & Handbags",
		image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=90",
		rawImage: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80",
		turnaround: "12h"
	},
	{
		id: "background-removal",
		number: "07",
		name: "Background Removal",
		tag: "Hand-Drawn Pen Tool Clipping",
		image: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=90",
		rawImage: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80",
		turnaround: "4h"
	},
	{
		id: "hollow-man",
		number: "08",
		name: "Hollow Man Service",
		tag: "360° Apparel Volume & Inseam",
		image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=90",
		rawImage: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=80",
		turnaround: "8h"
	},
	{
		id: "lifestyle-retouch",
		number: "09",
		name: "Lifestyle Retouch",
		tag: "Contact Shadows & Color Harmony",
		image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=90",
		rawImage: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80",
		turnaround: "12h"
	},
	{
		id: "regular-model",
		number: "10",
		name: "Regular Model Retouch",
		tag: "Catalog Blemish & Flyaway Cleanup",
		image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=90",
		rawImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=80",
		turnaround: "6h"
	},
	{
		id: "calendar-model",
		number: "11",
		name: "Calendar Model Retouch",
		tag: "Glamour Lighting & Glossy Pop",
		image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=90",
		rawImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
		turnaround: "12h"
	}
];
function HomeRetouchStudio({ clients = [] }) {
	const [heroSplit, setHeroSplit] = useState(50);
	const [activeHeroSubject, setActiveHeroSubject] = useState(0);
	const [mousePos, setMousePos] = useState({
		x: 0,
		y: 0,
		pctX: 50,
		pctY: 50
	});
	const [scrollY, setScrollY] = useState(0);
	const heroRef = useRef(null);
	const animFrameRef = useRef(null);
	const [activeStudioIndex, setActiveStudioIndex] = useState(0);
	const [studioSplit, setStudioSplit] = useState(50);
	useEffect(() => {
		const handleScroll = () => {
			setScrollY(window.scrollY);
		};
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);
	const handleMouseMove = (e) => {
		if (!heroRef.current) return;
		const rect = heroRef.current.getBoundingClientRect();
		const x = (e.clientX - rect.left) / rect.width - .5;
		const y = (e.clientY - rect.top) / rect.height - .5;
		const pctX = (e.clientX - rect.left) / rect.width * 100;
		const pctY = (e.clientY - rect.top) / rect.height * 100;
		if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
		animFrameRef.current = requestAnimationFrame(() => {
			setMousePos({
				x,
				y,
				pctX,
				pctY
			});
		});
	};
	const handleHeroSplitMove = (clientX, target) => {
		const rect = target.getBoundingClientRect();
		const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
		setHeroSplit(Math.round(x / rect.width * 100));
	};
	const handleStudioSplitMove = (clientX, target) => {
		const rect = target.getBoundingClientRect();
		const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
		setStudioSplit(Math.round(x / rect.width * 100));
	};
	const heroShowcase = [
		{
			title: "Jewelry Refraction",
			subtitle: "Sub-micron diamond facet clarity",
			retouched: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1600&q=95",
			raw: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1600&q=80",
			badge: "04. JEWELRY"
		},
		{
			title: "High-Fashion Model",
			subtitle: "16-bit frequency separation with raw pores",
			retouched: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1600&q=95",
			raw: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1600&q=80",
			badge: "06. MODEL"
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
			badge: "02. ACCESSORIES"
		}
	];
	const currentHero = heroShowcase[activeHeroSubject];
	const currentStudio = SERVICES_11[activeStudioIndex];
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-[#07080B] text-[#F3F4F6] selection:bg-[#de4a2c] selection:text-white font-sans antialiased overflow-x-hidden",
		children: [
			/* @__PURE__ */ jsxs("header", {
				className: "border-b border-white/[0.08] bg-[#07080B]/85 backdrop-blur-xl sticky top-0 z-50 px-6 sm:px-12 py-3 flex items-center justify-between",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3",
						children: [
							/* @__PURE__ */ jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-[#de4a2c] animate-pulse" }),
							/* @__PURE__ */ jsx(Link, {
								href: "/",
								className: "font-display text-sm sm:text-base font-bold tracking-tight text-white hover:text-neutral-300 transition-colors",
								children: "CUTTING EDGER"
							}),
							/* @__PURE__ */ jsx("span", {
								className: "text-white/20",
								children: "/"
							}),
							/* @__PURE__ */ jsx("span", {
								className: "text-xs font-mono uppercase tracking-wider text-neutral-400 hidden sm:inline",
								children: "Retouch Atelier"
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "hidden md:flex items-center gap-2",
						children: [
							/* @__PURE__ */ jsx("a", {
								href: "#parallax-runway",
								className: "px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-xs font-mono text-neutral-300 transition-colors border border-white/5",
								children: "Parallax Runway"
							}),
							/* @__PURE__ */ jsx("a", {
								href: "#services-deck",
								className: "px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-xs font-mono text-neutral-300 transition-colors border border-white/5",
								children: "11 Services"
							}),
							/* @__PURE__ */ jsx("a", {
								href: "#studio-lab",
								className: "px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-xs font-mono text-neutral-300 transition-colors border border-white/5",
								children: "Live Lab"
							})
						]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "flex items-center gap-3",
						children: /* @__PURE__ */ jsxs(Link, {
							href: "/#free-sample",
							className: "px-4 py-2 rounded-full bg-[#de4a2c] hover:bg-[#c93f24] text-white text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-[#de4a2c]/20",
							children: [/* @__PURE__ */ jsx("span", { children: "Test 3 Free" }), /* @__PURE__ */ jsx(ArrowRight, { className: "w-3.5 h-3.5" })]
						})
					})
				]
			}),
			/* @__PURE__ */ jsxs("section", {
				ref: heroRef,
				onMouseMove: handleMouseMove,
				className: "relative min-h-[92vh] flex flex-col justify-center px-4 sm:px-8 py-8 max-w-[1520px] mx-auto overflow-hidden",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "absolute inset-0 pointer-events-none opacity-40 transition-opacity duration-300",
						style: { background: `radial-gradient(circle 500px at ${mousePos.pctX}% ${mousePos.pctY}%, rgba(222, 74, 44, 0.25) 0%, transparent 70%)` }
					}),
					/* @__PURE__ */ jsx("div", {
						className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[14vw] font-display font-black text-white/[0.02] tracking-tighter select-none pointer-events-none whitespace-nowrap",
						style: { transform: `translate(calc(-50% + ${mousePos.x * -40}px), calc(-50% + ${mousePos.y * -30}px))` },
						children: "RETOUCH ATELIER"
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 relative z-20",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 text-xs font-mono text-[#de4a2c] uppercase font-bold tracking-wider",
							children: [/* @__PURE__ */ jsx(Sparkles, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "11 Specialized Commercial Services" })]
						}), /* @__PURE__ */ jsx("h1", {
							className: "font-display text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mt-1",
							children: "Visual Perfection at Scale."
						})] }), /* @__PURE__ */ jsx("div", {
							className: "flex items-center gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/10 text-xs font-mono",
							children: heroShowcase.map((item, idx) => /* @__PURE__ */ jsx("button", {
								onClick: () => {
									setActiveHeroSubject(idx);
									setHeroSplit(50);
								},
								className: `px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${activeHeroSubject === idx ? "bg-[#de4a2c] text-white font-bold shadow-md" : "text-neutral-400 hover:text-white"}`,
								children: item.badge
							}, item.badge))
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						style: {
							transform: `perspective(1200px) rotateY(${mousePos.x * 5}deg) rotateX(${-mousePos.y * 3.5}deg)`,
							transition: "transform 0.15s ease-out"
						},
						className: "relative w-full h-[520px] sm:h-[640px] md:h-[700px] xl:h-[740px] rounded-3xl overflow-hidden bg-black select-none border border-white/15 shadow-2xl cursor-ew-resize group z-10",
						onMouseDown: (e) => handleHeroSplitMove(e.clientX, e.currentTarget),
						onTouchMove: (e) => {
							if (e.touches[0]) handleHeroSplitMove(e.touches[0].clientX, e.currentTarget);
						},
						children: [
							/* @__PURE__ */ jsx("div", { className: "absolute inset-0 pointer-events-none z-30 transition-opacity duration-300" }),
							/* @__PURE__ */ jsxs("div", {
								className: "absolute inset-0 w-full h-full",
								children: [/* @__PURE__ */ jsx("img", {
									src: currentHero.retouched,
									alt: currentHero.title,
									className: "w-full h-full object-cover object-center select-none pointer-events-none",
									draggable: false
								}), /* @__PURE__ */ jsxs("div", {
									className: "absolute top-5 right-5 z-20 px-3.5 py-1.5 rounded-full bg-black/85 backdrop-blur-md text-white font-mono text-xs font-bold border border-white/20 shadow-2xl flex items-center gap-1.5",
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
										className: "absolute top-5 left-5 z-20 px-3.5 py-1.5 rounded-full bg-neutral-900/90 backdrop-blur-md text-neutral-300 font-mono text-xs font-bold border border-white/10 shadow-2xl flex items-center gap-1.5",
										children: [/* @__PURE__ */ jsx(Scissors, { className: "w-3.5 h-3.5 text-neutral-400" }), /* @__PURE__ */ jsx("span", { children: "Raw Unprocessed Plate" })]
									})]
								})
							}),
							/* @__PURE__ */ jsx("div", {
								className: "absolute top-0 bottom-0 w-[2px] bg-white shadow-[0_0_20px_rgba(255,255,255,1)] z-30 pointer-events-none",
								style: { left: `${heroSplit}%` },
								children: /* @__PURE__ */ jsx("div", {
									className: "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white text-black shadow-2xl border-2 border-black/20 flex items-center justify-center font-mono text-xs font-bold",
									children: "⟷"
								})
							}),
							/* @__PURE__ */ jsx("div", {
								className: "absolute bottom-5 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full bg-black/80 backdrop-blur-md text-white font-mono text-[11px] pointer-events-none shadow-2xl border border-white/10",
								children: /* @__PURE__ */ jsxs("span", { children: [currentHero.subtitle, " • Drag to compare"] })
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between mt-4 px-2 text-xs font-mono text-neutral-400",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ jsx("button", {
									onClick: () => setHeroSplit(0),
									className: `px-3 py-1 rounded-lg transition-colors ${heroSplit === 0 ? "bg-[#de4a2c] text-white font-bold" : "bg-white/5 hover:bg-white/10 text-neutral-300"}`,
									children: "Finished"
								}),
								/* @__PURE__ */ jsx("button", {
									onClick: () => setHeroSplit(50),
									className: `px-3 py-1 rounded-lg transition-colors ${heroSplit === 50 ? "bg-[#de4a2c] text-white font-bold" : "bg-white/5 hover:bg-white/10 text-neutral-300"}`,
									children: "50/50"
								}),
								/* @__PURE__ */ jsx("button", {
									onClick: () => setHeroSplit(100),
									className: `px-3 py-1 rounded-lg transition-colors ${heroSplit === 100 ? "bg-[#de4a2c] text-white font-bold" : "bg-white/5 hover:bg-white/10 text-neutral-300"}`,
									children: "Raw"
								})
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsxs("span", {
								className: "text-[11px] text-neutral-500",
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
								className: "w-24 sm:w-44 h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#de4a2c]"
							})]
						})]
					})
				]
			}),
			/* @__PURE__ */ jsxs("section", {
				id: "parallax-runway",
				className: "py-24 px-4 sm:px-8 max-w-[1520px] mx-auto border-t border-white/[0.08] relative",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						className: "text-xs font-mono text-[#de4a2c] uppercase font-bold tracking-wider mb-1",
						children: "Multi-Layer Depth"
					}), /* @__PURE__ */ jsx("h2", {
						className: "font-display text-3xl sm:text-5xl font-bold tracking-tight text-white",
						children: "The Parallax Runway"
					})] }), /* @__PURE__ */ jsx("div", {
						className: "text-xs font-mono text-neutral-500",
						children: "Scroll to experience dual-speed depth layers"
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-start",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "space-y-6 sm:space-y-8 transition-transform duration-100 ease-out",
							style: { transform: `translateY(${scrollY * -.06}px)` },
							children: SERVICES_11.slice(0, 4).map((s) => /* @__PURE__ */ jsxs("div", {
								className: "group relative rounded-3xl overflow-hidden bg-neutral-900 border border-white/10 shadow-2xl hover:border-white/30 transition-all duration-300",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "relative w-full h-[360px] sm:h-[440px] overflow-hidden",
									children: [/* @__PURE__ */ jsx("img", {
										src: s.image,
										alt: s.name,
										className: "w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
									}), /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" })]
								}), /* @__PURE__ */ jsxs("div", {
									className: "absolute bottom-5 left-5 right-5 z-20 flex items-end justify-between",
									children: [/* @__PURE__ */ jsxs("div", { children: [
										/* @__PURE__ */ jsx("div", {
											className: "text-xs font-mono text-[#de4a2c] font-bold",
											children: s.number
										}),
										/* @__PURE__ */ jsx("div", {
											className: "font-display text-lg font-bold text-white",
											children: s.name
										}),
										/* @__PURE__ */ jsx("div", {
											className: "text-[11px] font-mono text-neutral-400 mt-0.5",
											children: s.tag
										})
									] }), /* @__PURE__ */ jsx("span", {
										className: "px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono text-white border border-white/10 shrink-0",
										children: s.turnaround
									})]
								})]
							}, s.id))
						}),
						/* @__PURE__ */ jsx("div", {
							className: "space-y-6 sm:space-y-8 transition-transform duration-100 ease-out md:mt-16",
							style: { transform: `translateY(${scrollY * .08}px)` },
							children: SERVICES_11.slice(4, 8).map((s) => /* @__PURE__ */ jsxs("div", {
								className: "group relative rounded-3xl overflow-hidden bg-neutral-900 border border-white/10 shadow-2xl hover:border-white/30 transition-all duration-300",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "relative w-full h-[360px] sm:h-[440px] overflow-hidden",
									children: [/* @__PURE__ */ jsx("img", {
										src: s.image,
										alt: s.name,
										className: "w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
									}), /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" })]
								}), /* @__PURE__ */ jsxs("div", {
									className: "absolute bottom-5 left-5 right-5 z-20 flex items-end justify-between",
									children: [/* @__PURE__ */ jsxs("div", { children: [
										/* @__PURE__ */ jsx("div", {
											className: "text-xs font-mono text-[#de4a2c] font-bold",
											children: s.number
										}),
										/* @__PURE__ */ jsx("div", {
											className: "font-display text-lg font-bold text-white",
											children: s.name
										}),
										/* @__PURE__ */ jsx("div", {
											className: "text-[11px] font-mono text-neutral-400 mt-0.5",
											children: s.tag
										})
									] }), /* @__PURE__ */ jsx("span", {
										className: "px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono text-white border border-white/10 shrink-0",
										children: s.turnaround
									})]
								})]
							}, s.id))
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-6 sm:space-y-8 transition-transform duration-100 ease-out md:-mt-8",
							style: { transform: `translateY(${scrollY * -.09}px)` },
							children: [SERVICES_11.slice(8, 11).map((s) => /* @__PURE__ */ jsxs("div", {
								className: "group relative rounded-3xl overflow-hidden bg-neutral-900 border border-white/10 shadow-2xl hover:border-white/30 transition-all duration-300",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "relative w-full h-[360px] sm:h-[440px] overflow-hidden",
									children: [/* @__PURE__ */ jsx("img", {
										src: s.image,
										alt: s.name,
										className: "w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
									}), /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" })]
								}), /* @__PURE__ */ jsxs("div", {
									className: "absolute bottom-5 left-5 right-5 z-20 flex items-end justify-between",
									children: [/* @__PURE__ */ jsxs("div", { children: [
										/* @__PURE__ */ jsx("div", {
											className: "text-xs font-mono text-[#de4a2c] font-bold",
											children: s.number
										}),
										/* @__PURE__ */ jsx("div", {
											className: "font-display text-lg font-bold text-white",
											children: s.name
										}),
										/* @__PURE__ */ jsx("div", {
											className: "text-[11px] font-mono text-neutral-400 mt-0.5",
											children: s.tag
										})
									] }), /* @__PURE__ */ jsx("span", {
										className: "px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono text-white border border-white/10 shrink-0",
										children: s.turnaround
									})]
								})]
							}, s.id)), /* @__PURE__ */ jsxs("div", {
								className: "p-8 rounded-3xl bg-gradient-to-br from-[#de4a2c] to-[#992510] text-white shadow-2xl flex flex-col justify-between h-[360px]",
								children: [/* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsx("span", {
										className: "text-xs font-mono uppercase tracking-wider bg-black/20 px-3 py-1 rounded-full",
										children: "Instant Access"
									}),
									/* @__PURE__ */ jsx("h3", {
										className: "font-display text-2xl font-bold mt-4",
										children: "Test Your Own 3 RAW Images Free"
									}),
									/* @__PURE__ */ jsx("p", {
										className: "font-mono text-xs text-white/80 mt-2",
										children: "No credit card required. Receive non-destructive proofs in 24 hours."
									})
								] }), /* @__PURE__ */ jsxs(Link, {
									href: "/#free-sample",
									className: "w-full py-3 px-4 rounded-xl bg-white text-black hover:bg-black hover:text-white font-mono text-xs font-bold transition-all flex items-center justify-center gap-2",
									children: [/* @__PURE__ */ jsx("span", { children: "Upload 3 Test Files" }), /* @__PURE__ */ jsx(ArrowRight, { className: "w-3.5 h-3.5" })]
								})]
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				id: "services-deck",
				className: "py-20 px-4 sm:px-8 max-w-[1520px] mx-auto border-t border-white/[0.08]",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between mb-8",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						className: "text-xs font-mono text-[#de4a2c] uppercase font-bold tracking-wider",
						children: "Service Catalog"
					}), /* @__PURE__ */ jsx("h2", {
						className: "font-display text-2xl sm:text-4xl font-bold tracking-tight text-white",
						children: "All 11 Specialist Disciplines"
					})] }), /* @__PURE__ */ jsx("span", {
						className: "text-xs font-mono text-neutral-500",
						children: "11 of 11 Active"
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4",
					children: SERVICES_11.map((service, idx) => /* @__PURE__ */ jsxs("button", {
						onClick: () => {
							setActiveStudioIndex(idx);
							const el = document.getElementById("studio-lab");
							if (el) el.scrollIntoView({ behavior: "smooth" });
						},
						className: "group p-3 rounded-2xl bg-neutral-900 border border-white/10 hover:border-[#de4a2c] text-left transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "relative w-full h-36 rounded-xl overflow-hidden bg-black mb-3",
							children: [/* @__PURE__ */ jsx("img", {
								src: service.image,
								alt: service.name,
								className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
							}), /* @__PURE__ */ jsx("span", {
								className: "absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-mono text-[#de4a2c] font-bold",
								children: service.number
							})]
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
							className: "font-display text-xs font-bold text-white group-hover:text-[#de4a2c] transition-colors truncate",
							children: service.name
						}), /* @__PURE__ */ jsx("div", {
							className: "text-[10px] font-mono text-neutral-400 truncate mt-0.5",
							children: service.tag
						})] })]
					}, service.id))
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				id: "studio-lab",
				className: "py-20 px-4 sm:px-8 max-w-[1520px] mx-auto border-t border-white/[0.08]",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4",
					children: [/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsx("div", {
							className: "text-xs font-mono text-[#de4a2c] uppercase font-bold tracking-wider",
							children: "Precision Studio Lab"
						}),
						/* @__PURE__ */ jsxs("h2", {
							className: "font-display text-2xl sm:text-4xl font-bold tracking-tight text-white mt-1",
							children: [
								currentStudio.number,
								". ",
								currentStudio.name
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "text-xs font-mono text-neutral-400 mt-1",
							children: [
								currentStudio.tag,
								" • Standard SLA: ",
								currentStudio.turnaround
							]
						})
					] }), /* @__PURE__ */ jsx("div", {
						className: "flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1",
						children: SERVICES_11.map((s, idx) => /* @__PURE__ */ jsx("button", {
							onClick: () => {
								setActiveStudioIndex(idx);
								setStudioSplit(50);
							},
							className: `px-3 py-1.5 rounded-full text-xs font-mono whitespace-nowrap transition-all ${activeStudioIndex === idx ? "bg-white text-black font-bold" : "bg-white/5 text-neutral-400 hover:text-white"}`,
							children: s.number
						}, s.id))
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "relative max-w-5xl mx-auto bg-neutral-900 rounded-3xl border border-white/10 shadow-2xl p-4 sm:p-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "relative w-full h-[460px] sm:h-[580px] md:h-[650px] rounded-2xl overflow-hidden bg-black select-none border border-white/10 cursor-ew-resize group shadow-inner",
						onMouseDown: (e) => handleStudioSplitMove(e.clientX, e.currentTarget),
						onTouchMove: (e) => {
							if (e.touches[0]) handleStudioSplitMove(e.touches[0].clientX, e.currentTarget);
						},
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "absolute inset-0 w-full h-full",
								children: [/* @__PURE__ */ jsx("img", {
									src: currentStudio.image,
									alt: currentStudio.name,
									className: "w-full h-full object-cover object-center select-none pointer-events-none",
									draggable: false
								}), /* @__PURE__ */ jsxs("div", {
									className: "absolute top-4 right-4 z-20 px-3.5 py-1.5 rounded-full bg-black/85 backdrop-blur-md text-white font-mono text-xs font-bold border border-white/20 shadow-xl flex items-center gap-1.5",
									children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5 text-[#10b981]" }), /* @__PURE__ */ jsx("span", { children: "Finished Retouch" })]
								})]
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
										children: [/* @__PURE__ */ jsx(Scissors, { className: "w-3.5 h-3.5 text-neutral-400" }), /* @__PURE__ */ jsx("span", { children: "Raw Capture" })]
									})]
								})
							}),
							/* @__PURE__ */ jsx("div", {
								className: "absolute top-0 bottom-0 w-[2px] bg-white shadow-[0_0_20px_rgba(255,255,255,1)] z-30 pointer-events-none",
								style: { left: `${studioSplit}%` },
								children: /* @__PURE__ */ jsx("div", {
									className: "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white text-black shadow-2xl border-2 border-black/20 flex items-center justify-center font-mono text-xs font-bold",
									children: "⟷"
								})
							}),
							/* @__PURE__ */ jsx("div", {
								className: "absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full bg-black/80 backdrop-blur-md text-white font-mono text-[11px] pointer-events-none shadow-xl border border-white/10",
								children: /* @__PURE__ */ jsx("span", { children: "Drag left / right to inspect seam & edge precision" })
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "mt-4 pt-2.5 flex items-center justify-between text-xs font-mono text-neutral-400",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ jsx("button", {
									onClick: () => setStudioSplit(0),
									className: `px-3 py-1.5 rounded-lg transition-colors ${studioSplit === 0 ? "bg-[#de4a2c] text-white font-bold" : "bg-white/5 hover:bg-white/10 text-neutral-300"}`,
									children: "100% Finished"
								}),
								/* @__PURE__ */ jsx("button", {
									onClick: () => setStudioSplit(50),
									className: `px-3 py-1.5 rounded-lg transition-colors ${studioSplit === 50 ? "bg-[#de4a2c] text-white font-bold" : "bg-white/5 hover:bg-white/10 text-neutral-300"}`,
									children: "50 / 50 Split"
								}),
								/* @__PURE__ */ jsx("button", {
									onClick: () => setStudioSplit(100),
									className: `px-3 py-1.5 rounded-lg transition-colors ${studioSplit === 100 ? "bg-[#de4a2c] text-white font-bold" : "bg-white/5 hover:bg-white/10 text-neutral-300"}`,
									children: "100% Raw"
								})
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsxs("span", {
								className: "text-[11px] text-neutral-500",
								children: [
									"Split: ",
									studioSplit,
									"%"
								]
							}), /* @__PURE__ */ jsx("input", {
								type: "range",
								min: "0",
								max: "100",
								value: studioSplit,
								onChange: (e) => setStudioSplit(Number(e.target.value)),
								className: "w-24 sm:w-44 h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#de4a2c]"
							})]
						})]
					})]
				})]
			}),
			/* @__PURE__ */ jsx("section", {
				className: "py-20 px-4 sm:px-8 max-w-[1520px] mx-auto border-t border-white/[0.08]",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-3xl mx-auto text-center rounded-3xl bg-neutral-900 border border-white/10 p-8 sm:p-12 shadow-2xl",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-xs font-mono text-neutral-300 mb-4 border border-white/10",
							children: [/* @__PURE__ */ jsx(Sparkles, { className: "w-3.5 h-3.5 text-[#de4a2c]" }), /* @__PURE__ */ jsx("span", { children: "Complimentary Pilot Evaluation" })]
						}),
						/* @__PURE__ */ jsx("h2", {
							className: "font-display text-3xl sm:text-4xl font-bold text-white mb-3",
							children: "Test 3 Images on Us."
						}),
						/* @__PURE__ */ jsx("p", {
							className: "font-mono text-xs text-neutral-400 mb-6 max-w-md mx-auto",
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
				className: "border-t border-white/[0.08] py-6 px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-neutral-500 gap-4",
				children: [/* @__PURE__ */ jsx("div", { children: "Cutting Edger • 11 Commercial Image Editing Services • 16-Bit Non-Destructive" }), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-4",
					children: [
						/* @__PURE__ */ jsx("a", {
							href: "#parallax-runway",
							className: "hover:text-white transition-colors",
							children: "Parallax Runway"
						}),
						/* @__PURE__ */ jsx("span", {
							className: "text-white/20",
							children: "•"
						}),
						/* @__PURE__ */ jsx("a", {
							href: "#services-deck",
							className: "hover:text-white transition-colors",
							children: "11 Services"
						}),
						/* @__PURE__ */ jsx("span", {
							className: "text-white/20",
							children: "•"
						}),
						/* @__PURE__ */ jsx("a", {
							href: "#studio-lab",
							className: "hover:text-white transition-colors",
							children: "Live Lab"
						})
					]
				})]
			})
		]
	});
}
//#endregion
export { HomeRetouchStudio };
