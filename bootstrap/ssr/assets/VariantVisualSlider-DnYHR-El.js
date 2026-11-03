import { useEffect, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Maximize2, Pause, Play, X } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Services/Variants/VariantVisualSlider.tsx
var HERO_SLIDES = [
	{
		id: 1,
		title: "High-Jewelry Multi-Path",
		subtitle: "Sapphire & Platinum Micro-Bezel Isolation",
		image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1400&q=85",
		spec: "0.1px Vector Nodes // 100% Alpha Channel",
		tag: "HAUTE JOAILLERIE"
	},
	{
		id: 2,
		title: "Runway Silk Organza",
		subtitle: "Ultra-Fine Edge Masking & Retain Transparency",
		image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1400&q=85",
		spec: "Preserved Sheer Drape // Zero Halo Edge",
		tag: "EDITORIAL ATELIER"
	},
	{
		id: 3,
		title: "Sculpted Leather Handbag",
		subtitle: "Precision Stitch Contour & Ground Contact Shadow",
		image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1400&q=85",
		spec: "Multipath Hardware Isolation // PSD Delivery",
		tag: "LUXURY LEATHER"
	},
	{
		id: 4,
		title: "Precision Swiss Chrono",
		subtitle: "Metallic Bezel & Domed Crystal Isolation",
		image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1400&q=85",
		spec: "Sub-Pixel Bezier Accuracy // 12h SLA",
		tag: "TIMEPIECE MASTER"
	}
];
var PORTFOLIO_ILLUSTRATIONS = [
	{
		id: 1,
		title: "Eyewear Acetate & Lens Refraction",
		category: "Optical Transparency",
		image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=80",
		type: "eyewear"
	},
	{
		id: 2,
		title: "Footwear Knit & Textured Rubber",
		category: "Intricate Perimeter",
		image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80",
		type: "footwear"
	},
	{
		id: 3,
		title: "Cosmetic Glass & Dropper Flacon",
		category: "Liquid Boundary Cutout",
		image: "https://images.unsplash.com/photo-1608248597359-566b693836d5?auto=format&fit=crop&w=1000&q=80",
		type: "cosmetics"
	},
	{
		id: 4,
		title: "Fine Diamond Ring Cluster",
		category: "Micro-Prong Retention",
		image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=80",
		type: "jewelry"
	},
	{
		id: 5,
		title: "Cashmere Tailored Trench",
		category: "Wool Surface Masking",
		image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1000&q=80",
		type: "apparel"
	},
	{
		id: 6,
		title: "Minimalist Ceramic Bottle",
		category: "Geometric Curvature Isolation",
		image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=1000&q=80",
		type: "cosmetics"
	}
];
var VariantVisualSlider = ({ service, otherServices = [], relatedProjects = [], calendlyUrl }) => {
	const [currentSlide, setCurrentSlide] = useState(0);
	const [isAutoPlaying, setIsAutoPlaying] = useState(true);
	const [activeCategory, setActiveCategory] = useState("all");
	const [lightboxImg, setLightboxImg] = useState(null);
	useEffect(() => {
		if (!isAutoPlaying) return;
		const timer = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
		}, 5e3);
		return () => clearInterval(timer);
	}, [isAutoPlaying]);
	const activeSlide = HERO_SLIDES[currentSlide];
	const filteredPortfolio = activeCategory === "all" ? PORTFOLIO_ILLUSTRATIONS : PORTFOLIO_ILLUSTRATIONS.filter((item) => item.type === activeCategory);
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-[#FAFAFA] text-neutral-900 antialiased selection:bg-neutral-900 selection:text-white pb-32",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "border-b border-neutral-200 bg-white/90 backdrop-blur-md sticky top-0 z-40",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-7xl mx-auto px-4 sm:px-8 h-12 flex items-center justify-between text-[11px] font-mono tracking-wider text-neutral-600",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200",
								children: "04 // VISUAL SLIDER SHOWCASE"
							}),
							/* @__PURE__ */ jsx("span", {
								className: "text-neutral-300",
								children: "/"
							}),
							/* @__PURE__ */ jsx("span", {
								className: "font-semibold text-neutral-800 truncate max-w-[200px] sm:max-w-none",
								children: service.title
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ jsx("span", {
							className: "hidden sm:inline",
							children: "HIGH-VELOCITY IMAGE SUITE"
						}), /* @__PURE__ */ jsx("span", {
							className: "font-bold text-neutral-900",
							children: "4K ATELIER REELS"
						})]
					})]
				})
			}),
			/* @__PURE__ */ jsx("section", {
				className: "pt-8 sm:pt-12 pb-12 px-4 sm:px-8",
				children: /* @__PURE__ */ jsx("div", {
					className: "max-w-7xl mx-auto",
					children: /* @__PURE__ */ jsxs("div", {
						className: "relative rounded-3xl overflow-hidden shadow-2xl bg-neutral-950 text-white min-h-[520px] sm:min-h-[580px] flex flex-col justify-end",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "absolute inset-0 z-0",
								children: [HERO_SLIDES.map((slide, index) => /* @__PURE__ */ jsx("div", {
									className: `absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"}`,
									children: /* @__PURE__ */ jsx("img", {
										src: slide.image,
										alt: slide.title,
										className: "w-full h-full object-cover brightness-[0.75]"
									})
								}, slide.id)), /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" })]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "relative z-10 p-6 sm:p-10 flex items-center justify-between mb-auto",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-mono tracking-widest uppercase",
									children: [/* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-400 animate-pulse" }), /* @__PURE__ */ jsx("span", { children: activeSlide.tag })]
								}), /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: () => setIsAutoPlaying(!isAutoPlaying),
											className: "w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center transition-colors",
											title: isAutoPlaying ? "Pause Auto-Slide" : "Play Auto-Slide",
											children: isAutoPlaying ? /* @__PURE__ */ jsx(Pause, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ jsx(Play, { className: "w-3.5 h-3.5 ml-0.5" })
										}),
										/* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: () => setCurrentSlide((prev) => prev === 0 ? HERO_SLIDES.length - 1 : prev - 1),
											className: "w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center transition-colors",
											children: /* @__PURE__ */ jsx(ChevronLeft, { className: "w-4 h-4" })
										}),
										/* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: () => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length),
											className: "w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center transition-colors",
											children: /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4" })
										})
									]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "relative z-10 p-6 sm:p-12 space-y-4 max-w-3xl",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "font-mono text-xs tracking-widest text-emerald-400 uppercase font-semibold",
										children: activeSlide.spec
									}),
									/* @__PURE__ */ jsx("h1", {
										className: "text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight",
										children: activeSlide.title
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-sm sm:text-base text-neutral-300 font-normal",
										children: activeSlide.subtitle
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex flex-wrap items-center gap-3 pt-2",
										children: [/* @__PURE__ */ jsxs("a", {
											href: "#free-sample",
											className: "px-6 py-3 rounded-full bg-white text-neutral-950 font-bold text-xs uppercase tracking-wider hover:bg-neutral-100 transition-colors flex items-center gap-2 shadow-lg",
											children: [/* @__PURE__ */ jsx("span", { children: "Request Atelier Sample Batch" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4" })]
										}), /* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: () => window.dispatchEvent(new CustomEvent("ce:open-discovery-call")),
											className: "px-6 py-3 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 text-white font-bold text-xs uppercase tracking-wider transition-colors",
											children: "Schedule Technical Brief"
										})]
									}),
									/* @__PURE__ */ jsx("div", {
										className: "flex items-center gap-2 pt-6",
										children: HERO_SLIDES.map((slide, i) => /* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: () => setCurrentSlide(i),
											className: "group relative flex-1 h-1.5 rounded-full overflow-hidden bg-white/20 transition-all",
											children: /* @__PURE__ */ jsx("div", { className: `h-full bg-white transition-all duration-300 ${i === currentSlide ? "w-full" : "w-0"}` })
										}, slide.id))
									})
								]
							})
						]
					})
				})
			}),
			/* @__PURE__ */ jsx("section", {
				className: "py-12 px-4 sm:px-8 border-t border-neutral-200 bg-white",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-7xl mx-auto space-y-8",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex flex-col md:flex-row md:items-end justify-between gap-6",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
							className: "font-mono text-xs uppercase tracking-widest text-blue-600 font-bold block mb-1",
							children: "PORTFOLIO PROOF REPERTOIRE"
						}), /* @__PURE__ */ jsx("h2", {
							className: "text-2xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight",
							children: "Service Illustrations & Showcase"
						})] }), /* @__PURE__ */ jsx("div", {
							className: "flex flex-wrap items-center gap-2 font-mono text-xs",
							children: [
								{
									id: "all",
									label: "All Catalogues"
								},
								{
									id: "jewelry",
									label: "Jewelry"
								},
								{
									id: "apparel",
									label: "Apparel"
								},
								{
									id: "footwear",
									label: "Footwear"
								},
								{
									id: "cosmetics",
									label: "Cosmetics"
								}
							].map((cat) => /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setActiveCategory(cat.id),
								className: `px-4 py-1.5 rounded-full transition-all ${activeCategory === cat.id ? "bg-neutral-900 text-white font-bold shadow-sm" : "bg-neutral-100 hover:bg-neutral-200 text-neutral-600 font-medium"}`,
								children: cat.label
							}, cat.id))
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
						children: filteredPortfolio.map((item) => /* @__PURE__ */ jsx("div", {
							onClick: () => setLightboxImg(item.image),
							className: "group relative rounded-3xl overflow-hidden bg-neutral-100 border border-neutral-200 cursor-pointer hover:shadow-xl transition-all duration-300",
							children: /* @__PURE__ */ jsxs("div", {
								className: "relative h-80 w-full overflow-hidden",
								children: [
									/* @__PURE__ */ jsx("img", {
										src: item.image,
										alt: item.title,
										className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",
										children: /* @__PURE__ */ jsx(Maximize2, { className: "w-4 h-4 text-neutral-900" })
									}),
									/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70 group-hover:opacity-50 transition-opacity" }),
									/* @__PURE__ */ jsxs("div", {
										className: "absolute bottom-4 inset-x-4 text-white",
										children: [/* @__PURE__ */ jsx("span", {
											className: "font-mono text-[10px] uppercase tracking-wider text-blue-300 font-semibold block",
											children: item.category
										}), /* @__PURE__ */ jsx("h3", {
											className: "font-bold text-base mt-0.5",
											children: item.title
										})]
									})
								]
							})
						}, item.id))
					})]
				})
			}),
			lightboxImg && /* @__PURE__ */ jsx("div", {
				className: "fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4",
				onClick: () => setLightboxImg(null),
				children: /* @__PURE__ */ jsxs("div", {
					className: "relative max-w-4xl max-h-[90vh] bg-white rounded-3xl overflow-hidden p-2",
					onClick: (e) => e.stopPropagation(),
					children: [/* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => setLightboxImg(null),
						className: "absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-neutral-900 text-white flex items-center justify-center",
						children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
					}), /* @__PURE__ */ jsx("img", {
						src: lightboxImg,
						alt: "Expanded preview",
						className: "max-h-[82vh] w-auto object-contain rounded-2xl mx-auto"
					})]
				})
			})
		]
	});
};
//#endregion
export { VariantVisualSlider };
