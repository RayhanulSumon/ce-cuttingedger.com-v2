import { i as useTheme } from "../ssr.js";
import { useEffect, useRef, useState } from "react";
import { Link } from "@inertiajs/react";
import { ArrowRight, ArrowUpRight, Camera, CheckCircle2, ChevronLeft, ChevronRight, Moon, Pause, Play, Scissors, Sliders, Sparkles, Sun } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/HomeVariants/HomeArvenStudio.tsx
var HERO_SLIDES = [
	{
		id: "slide-1",
		number: "01",
		tagline: "Arven Studio // Discipline 01",
		heading: "Live this amazing world and life.",
		quote: "Look deep into nature, and then you will understand everything better.",
		ctaText: "See the Gallery",
		ctaLink: "#gallery",
		badge: "16-Bit Frequency Separation",
		image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=95",
		rawImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=2000&q=80"
	},
	{
		id: "slide-2",
		number: "02",
		tagline: "Arven Studio // Discipline 02",
		heading: "Go extreme. There’s no turning back.",
		quote: "The world is more colorful than the physical eye can see.",
		ctaText: "Explore Portfolio",
		ctaLink: "#disciplines-carousel",
		badge: "Diamond & Gemstone Refraction",
		image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=2000&q=95",
		rawImage: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=2000&q=80"
	},
	{
		id: "slide-3",
		number: "03",
		tagline: "Arven Studio // Discipline 03",
		heading: "Our passion is capturing moments.",
		quote: "To capture ten thousand words in the blink of a moment.",
		ctaText: "Discover Atelier",
		ctaLink: "#split-viewer",
		badge: "Metallic Studio Reflections",
		image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2000&q=95",
		rawImage: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=2000&q=80"
	},
	{
		id: "slide-4",
		number: "04",
		tagline: "Arven Studio // Discipline 04",
		heading: "Pixel-perfect clarity, timeless form.",
		quote: "Crafted with hand-drawn pen vector paths and seamless 360° apparel volume.",
		ctaText: "Test 3 Free Images",
		ctaLink: "/#free-sample",
		badge: "Ghost Mannequin & Suede Mirror",
		image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=2000&q=95",
		rawImage: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=2000&q=80"
	}
];
var CAROUSEL_SERVICES = [
	{
		id: "c-jewelry",
		number: "01",
		title: "Jewelry Refraction",
		category: "Luxury",
		metric: "99.8% Facet Clarity",
		turnaround: "12h Rush",
		image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=90",
		rawImage: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80",
		description: "Sub-micron diamond prism sharpness, dust eradication & metallic brilliance."
	},
	{
		id: "c-model",
		number: "02",
		title: "High-End Model Retouch",
		category: "Fashion",
		metric: "100% Skin Pores Kept",
		turnaround: "12h Rush",
		image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=90",
		rawImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80",
		description: "16-bit non-destructive frequency separation without plastic blurring."
	},
	{
		id: "c-automobile",
		number: "03",
		title: "Automobile Studio Retouch",
		category: "Automotive",
		metric: "Zero Rig Glare",
		turnaround: "24h SLA",
		image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=90",
		rawImage: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80",
		description: "Specular metallic highlights, glass tone perfection and alloy reflection control."
	},
	{
		id: "c-ghost",
		number: "04",
		title: "Ghost Mannequin 3D Joint",
		category: "Apparel",
		metric: "Seamless 360° Drape",
		turnaround: "8h Fast",
		image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=90",
		rawImage: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80",
		description: "Invisible neck and collar fusion with realistic volume, folds and hem geometry."
	},
	{
		id: "c-shoes",
		number: "05",
		title: "Footwear & Leather Finishing",
		category: "Footwear",
		metric: "Suede Texture Retained",
		turnaround: "8h Fast",
		image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=90",
		rawImage: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=1200&q=80",
		description: "Outsole blemish cleanup, lace alignment, and mirror reflection grounding."
	},
	{
		id: "c-accessories",
		number: "06",
		title: "Luxury Timepieces & Bags",
		category: "Luxury",
		metric: "Brushed Metal Balancer",
		turnaround: "12h Rush",
		image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=90",
		rawImage: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80",
		description: "Sapphire crystal glare extraction and hand-stitched leather contrast tuning."
	},
	{
		id: "c-clipping",
		number: "07",
		title: "Vector Hand Clipping Path",
		category: "Volume",
		metric: "0.5px Feathered Bezier",
		turnaround: "4h Express",
		image: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=90",
		rawImage: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80",
		description: "100% manual pen-tool bezier curves with multipath color separation."
	},
	{
		id: "c-lifestyle",
		number: "08",
		title: "Editorial Lifestyle Color",
		category: "Editorial",
		metric: "Natural Decay Shadows",
		turnaround: "12h Rush",
		image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=90",
		rawImage: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80",
		description: "Atmospheric color grading, soft contact shadows and commercial tone alignment."
	}
];
var GALLERY_ITEMS = [
	{
		id: "g-1",
		title: "Vogue Scandinavia Editorial",
		category: "Fashion",
		client: "Drykorn",
		image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=90",
		aspect: "aspect-[3/4]"
	},
	{
		id: "g-2",
		title: "Solitaire Diamond High Jewelry",
		category: "Jewelry",
		client: "Melie Bianco",
		image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=90",
		aspect: "aspect-square"
	},
	{
		id: "g-3",
		title: "GT Hypercar Dynamic Studio",
		category: "Automotive",
		client: "Felgenoutlet",
		image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=90",
		aspect: "aspect-[16/10]"
	},
	{
		id: "g-4",
		title: "Nordic Technical Outerwear",
		category: "Apparel",
		client: "Haglöfs",
		image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=90",
		aspect: "aspect-[3/4]"
	},
	{
		id: "g-5",
		title: "Monochrome Chronograph Dial",
		category: "Jewelry",
		client: "D1 Milano",
		image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=90",
		aspect: "aspect-square"
	},
	{
		id: "g-6",
		title: "Contemporary Sneaker Capsule",
		category: "Footwear",
		client: "Bambini Fashion",
		image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=90",
		aspect: "aspect-[4/3]"
	}
];
function HomeArvenStudio({ clients = [] }) {
	const { isDark, toggleTheme } = useTheme();
	const [heroIndex, setHeroIndex] = useState(0);
	const [isHeroHovered, setIsHeroHovered] = useState(false);
	const [isHeroPlaying, setIsHeroPlaying] = useState(true);
	const [heroProgress, setHeroProgress] = useState(0);
	const HERO_CYCLE_MS = 3e3;
	useEffect(() => {
		if (!isHeroPlaying || isHeroHovered) return;
		const intervalStep = 25;
		const progressIncrement = intervalStep / HERO_CYCLE_MS * 100;
		const timer = setInterval(() => {
			setHeroProgress((prev) => {
				if (prev >= 100) {
					setHeroIndex((idx) => (idx + 1) % HERO_SLIDES.length);
					return 0;
				}
				return prev + progressIncrement;
			});
		}, intervalStep);
		return () => clearInterval(timer);
	}, [isHeroPlaying, isHeroHovered]);
	const handleHeroNext = () => {
		setHeroProgress(0);
		setHeroIndex((idx) => (idx + 1) % HERO_SLIDES.length);
	};
	const handleHeroPrev = () => {
		setHeroProgress(0);
		setHeroIndex((idx) => (idx - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
	};
	const selectHeroSlide = (idx) => {
		setHeroProgress(0);
		setHeroIndex(idx);
	};
	const [carouselIndex, setCarouselIndex] = useState(0);
	const [isCarouselHovered, setIsCarouselHovered] = useState(false);
	const [carouselProgress, setCarouselProgress] = useState(0);
	const CAROUSEL_CYCLE_MS = 3e3;
	useEffect(() => {
		if (isCarouselHovered) return;
		const tick = 25;
		const increment = tick / CAROUSEL_CYCLE_MS * 100;
		const timer = setInterval(() => {
			setCarouselProgress((prev) => {
				if (prev >= 100) {
					setCarouselIndex((idx) => (idx + 1) % CAROUSEL_SERVICES.length);
					return 0;
				}
				return prev + increment;
			});
		}, tick);
		return () => clearInterval(timer);
	}, [isCarouselHovered]);
	const handleCarouselNext = () => {
		setCarouselProgress(0);
		setCarouselIndex((idx) => (idx + 1) % CAROUSEL_SERVICES.length);
	};
	const handleCarouselPrev = () => {
		setCarouselProgress(0);
		setCarouselIndex((idx) => (idx - 1 + CAROUSEL_SERVICES.length) % CAROUSEL_SERVICES.length);
	};
	const [centeredIndex, setCenteredIndex] = useState(0);
	const [isCenteredHovered, setIsCenteredHovered] = useState(false);
	useEffect(() => {
		if (isCenteredHovered) return;
		const interval = setInterval(() => {
			setCenteredIndex((prev) => (prev + 1) % CAROUSEL_SERVICES.length);
		}, 3e3);
		return () => clearInterval(interval);
	}, [isCenteredHovered]);
	const [splitPos, setSplitPos] = useState(50);
	const splitRef = useRef(null);
	const handleSplitMouseMove = (e) => {
		if (!splitRef.current) return;
		const rect = splitRef.current.getBoundingClientRect();
		const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
		setSplitPos(Math.round(x / rect.width * 100));
	};
	const [activeCategory, setActiveCategory] = useState("All");
	const categories = [
		"All",
		"Fashion",
		"Jewelry",
		"Automotive",
		"Apparel",
		"Footwear"
	];
	const filteredGallery = activeCategory === "All" ? GALLERY_ITEMS : GALLERY_ITEMS.filter((item) => item.category === activeCategory);
	const currentSlide = HERO_SLIDES[heroIndex];
	return /* @__PURE__ */ jsxs("div", {
		className: `min-h-screen font-sans antialiased transition-colors duration-300 selection:bg-[#de4a2c] selection:text-white ${isDark ? "bg-[#07080B] text-[#F3F4F6]" : "bg-[#FAFAFA] text-[#111318]"}`,
		children: [
			/* @__PURE__ */ jsxs("header", {
				className: `sticky top-0 z-50 border-b backdrop-blur-xl px-4 sm:px-8 lg:px-12 py-3 flex items-center justify-between transition-colors ${isDark ? "bg-[#07080B]/90 border-white/[0.08]" : "bg-white/90 border-black/[0.06] shadow-xs"}`,
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3",
						children: [
							/* @__PURE__ */ jsxs(Link, {
								href: "/",
								className: "flex items-center gap-2 group",
								children: [/* @__PURE__ */ jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-[#de4a2c] group-hover:scale-125 transition-transform" }), /* @__PURE__ */ jsx("span", {
									className: "font-display text-sm sm:text-base font-bold tracking-tight",
									children: "CUTTING EDGER"
								})]
							}),
							/* @__PURE__ */ jsx("span", {
								className: isDark ? "text-white/20" : "text-black/20",
								children: "/"
							}),
							/* @__PURE__ */ jsx("span", {
								className: `text-[11px] font-mono uppercase tracking-wider hidden md:inline ${isDark ? "text-neutral-400" : "text-neutral-500"}`,
								children: "Arven Lookbook (V9)"
							})
						]
					}),
					/* @__PURE__ */ jsxs("nav", {
						className: "hidden lg:flex items-center gap-6 text-xs font-mono",
						children: [
							/* @__PURE__ */ jsx("a", {
								href: "#showcase",
								className: "hover:text-[#de4a2c] transition-colors",
								children: "Showcase (3s)"
							}),
							/* @__PURE__ */ jsx("a", {
								href: "#disciplines-carousel",
								className: "hover:text-[#de4a2c] transition-colors",
								children: "Auto-Carousel (3s)"
							}),
							/* @__PURE__ */ jsx("a", {
								href: "#centered-focus",
								className: "hover:text-[#de4a2c] transition-colors",
								children: "Spotlight"
							}),
							/* @__PURE__ */ jsx("a", {
								href: "#gallery",
								className: "hover:text-[#de4a2c] transition-colors",
								children: "Gallery"
							}),
							/* @__PURE__ */ jsx("a", {
								href: "#split-viewer",
								className: "hover:text-[#de4a2c] transition-colors",
								children: "Before/After"
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ jsx("button", {
							onClick: toggleTheme,
							"aria-label": "Toggle Light and Dark Mode",
							className: `p-2 rounded-full border transition-all flex items-center justify-center ${isDark ? "bg-white/5 border-white/10 text-yellow-400 hover:bg-white/10" : "bg-neutral-100 border-black/10 text-neutral-800 hover:bg-neutral-200"}`,
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
				id: "showcase",
				onMouseEnter: () => setIsHeroHovered(true),
				onMouseLeave: () => setIsHeroHovered(false),
				className: "relative w-full h-[88vh] min-h-[580px] max-h-[920px] overflow-hidden select-none bg-black text-white",
				children: [
					HERO_SLIDES.map((slide, idx) => {
						const isActive = idx === heroIndex;
						return /* @__PURE__ */ jsxs("div", {
							className: `absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`,
							children: [
								/* @__PURE__ */ jsx("img", {
									src: slide.image,
									alt: slide.heading,
									className: `w-full h-full object-cover object-center transition-transform duration-[4000ms] ease-out ${isActive ? "scale-105" : "scale-100"}`
								}),
								/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30 pointer-events-none" }),
								/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-radial from-transparent via-black/20 to-black/60 pointer-events-none" })
							]
						}, slide.id);
					}),
					/* @__PURE__ */ jsx("div", {
						className: "absolute top-0 inset-x-0 h-1 bg-white/15 z-30 overflow-hidden",
						children: /* @__PURE__ */ jsx("div", {
							className: "h-full bg-gradient-to-r from-[#de4a2c] via-[#ff6b4a] to-[#de4a2c] transition-all ease-linear",
							style: { width: `${heroProgress}%` }
						})
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "absolute inset-0 z-20 flex flex-col justify-end p-6 sm:p-12 lg:p-16 max-w-5xl",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-3 mb-3",
								children: [/* @__PURE__ */ jsxs("span", {
									className: "px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[#de4a2c] font-mono text-xs font-bold border border-white/15 flex items-center gap-2",
									children: [/* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-[#10b981] animate-ping" }), /* @__PURE__ */ jsx("span", { children: currentSlide.tagline })]
								}), /* @__PURE__ */ jsx("span", {
									className: "px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white/90 font-mono text-xs hidden sm:inline border border-white/10",
									children: currentSlide.badge
								})]
							}),
							/* @__PURE__ */ jsx("h1", {
								className: "font-display text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-white leading-[1.08] drop-shadow-md",
								children: currentSlide.heading
							}),
							/* @__PURE__ */ jsxs("p", {
								className: "font-serif italic text-base sm:text-xl text-white/85 mt-3 max-w-2xl font-light leading-relaxed",
								children: [
									"\"",
									currentSlide.quote,
									"\""
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-4 mt-6",
								children: [/* @__PURE__ */ jsxs("a", {
									href: currentSlide.ctaLink,
									className: "px-6 py-3 rounded-full bg-white text-black hover:bg-[#de4a2c] hover:text-white font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-xl group/btn",
									children: [/* @__PURE__ */ jsx("span", { children: currentSlide.ctaText }), /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4 group-hover/btn:translate-x-1 transition-transform" })]
								}), /* @__PURE__ */ jsx("a", {
									href: "#gallery",
									className: "px-5 py-3 rounded-full bg-black/60 hover:bg-black/80 text-white font-mono text-xs border border-white/20 backdrop-blur-md transition-all flex items-center gap-2",
									children: /* @__PURE__ */ jsx("span", { children: "View All Disciplines" })
								})]
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "absolute bottom-6 sm:bottom-12 right-6 sm:right-12 z-30 flex items-center gap-4",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-xs font-mono text-white/80",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "text-[#de4a2c] font-bold",
										children: "Auto 3s:"
									}),
									/* @__PURE__ */ jsxs("span", { children: [Math.round(heroProgress / 100 * 3), "s"] }),
									/* @__PURE__ */ jsx("button", {
										onClick: () => setIsHeroPlaying(!isHeroPlaying),
										className: "ml-1 text-white hover:text-[#de4a2c] transition-colors",
										"aria-label": isHeroPlaying ? "Pause autoplay" : "Resume autoplay",
										children: isHeroPlaying && !isHeroHovered ? /* @__PURE__ */ jsx(Pause, { className: "w-3 h-3" }) : /* @__PURE__ */ jsx(Play, { className: "w-3 h-3" })
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "px-3.5 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-xs font-mono text-white flex items-center gap-1.5",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "text-[#de4a2c] font-bold",
										children: currentSlide.number
									}),
									/* @__PURE__ */ jsx("span", {
										className: "text-white/40",
										children: "/"
									}),
									/* @__PURE__ */ jsx("span", {
										className: "text-white/70",
										children: "04"
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ jsx("button", {
									onClick: handleHeroPrev,
									"aria-label": "Previous Slide",
									className: "w-10 h-10 rounded-full bg-black/75 hover:bg-[#de4a2c] text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all shadow-xl",
									children: /* @__PURE__ */ jsx(ChevronLeft, { className: "w-5 h-5" })
								}), /* @__PURE__ */ jsx("button", {
									onClick: handleHeroNext,
									"aria-label": "Next Slide",
									className: "w-10 h-10 rounded-full bg-black/75 hover:bg-[#de4a2c] text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all shadow-xl",
									children: /* @__PURE__ */ jsx(ChevronRight, { className: "w-5 h-5" })
								})]
							})
						]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "absolute top-1/2 -translate-y-1/2 right-6 z-30 hidden lg:flex flex-col gap-2.5",
						children: HERO_SLIDES.map((slide, idx) => /* @__PURE__ */ jsx("button", {
							onClick: () => selectHeroSlide(idx),
							"aria-label": `Go to slide ${idx + 1}`,
							className: `w-2.5 transition-all rounded-full ${heroIndex === idx ? "h-8 bg-[#de4a2c] shadow-lg shadow-[#de4a2c]/50" : "h-2.5 bg-white/30 hover:bg-white/60"}`
						}, slide.id))
					})
				]
			}),
			/* @__PURE__ */ jsxs("section", {
				id: "disciplines-carousel",
				onMouseEnter: () => setIsCarouselHovered(true),
				onMouseLeave: () => setIsCarouselHovered(false),
				className: `py-16 sm:py-20 px-4 sm:px-8 max-w-[1520px] mx-auto border-b transition-colors ${isDark ? "border-white/[0.08]" : "border-black/[0.08]"}`,
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4",
					children: [/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 text-xs font-mono text-[#de4a2c] uppercase font-bold tracking-wider",
							children: [
								/* @__PURE__ */ jsx(Camera, { className: "w-3.5 h-3.5" }),
								/* @__PURE__ */ jsx("span", { children: "Multi-Item Carousel • Auto-Slides Every 3s" }),
								/* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-[#10b981] animate-ping" })
							]
						}),
						/* @__PURE__ */ jsx("h2", {
							className: "font-display text-2xl sm:text-4xl font-bold tracking-tight mt-1",
							children: "Commercial Photography Disciplines"
						}),
						/* @__PURE__ */ jsx("p", {
							className: `font-mono text-xs mt-1 max-w-xl ${isDark ? "text-neutral-400" : "text-neutral-600"}`,
							children: "Continuously transitioning every 3 seconds. Hover to freeze and inspect 16-bit retouching details."
						})
					] }), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3 shrink-0",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: `px-3 py-1.5 rounded-full border text-xs font-mono flex items-center gap-2 ${isDark ? "bg-white/5 border-white/10 text-neutral-300" : "bg-white border-black/10 text-neutral-700 shadow-sm"}`,
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "text-[#de4a2c] font-bold",
										children: "Auto 3s:"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "w-16 h-1.5 rounded-full bg-neutral-200 dark:bg-white/10 overflow-hidden",
										children: /* @__PURE__ */ jsx("div", {
											className: "h-full bg-[#de4a2c] transition-all ease-linear",
											style: { width: `${carouselProgress}%` }
										})
									}),
									/* @__PURE__ */ jsx("span", {
										className: "text-[10px] text-neutral-400",
										children: isCarouselHovered ? "Paused" : `${Math.round(carouselProgress / 100 * 3)}s`
									})
								]
							}),
							/* @__PURE__ */ jsx("button", {
								onClick: handleCarouselPrev,
								"aria-label": "Previous carousel item",
								className: `w-10 h-10 rounded-full border flex items-center justify-center transition-all ${isDark ? "bg-neutral-900 border-white/10 hover:border-[#de4a2c] hover:bg-neutral-800 text-white" : "bg-white border-black/10 hover:border-[#de4a2c] hover:bg-neutral-100 text-black shadow-sm"}`,
								children: /* @__PURE__ */ jsx(ChevronLeft, { className: "w-5 h-5" })
							}),
							/* @__PURE__ */ jsx("button", {
								onClick: handleCarouselNext,
								"aria-label": "Next carousel item",
								className: `w-10 h-10 rounded-full border flex items-center justify-center transition-all ${isDark ? "bg-neutral-900 border-white/10 hover:border-[#de4a2c] hover:bg-neutral-800 text-white" : "bg-white border-black/10 hover:border-[#de4a2c] hover:bg-neutral-100 text-black shadow-sm"}`,
								children: /* @__PURE__ */ jsx(ChevronRight, { className: "w-5 h-5" })
							})
						]
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6",
					children: [
						0,
						1,
						2,
						3
					].map((offset) => {
						const item = CAROUSEL_SERVICES[(carouselIndex + offset) % CAROUSEL_SERVICES.length];
						return /* @__PURE__ */ jsxs("div", {
							className: `group rounded-3xl overflow-hidden border shadow-xl transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between ${isDark ? "bg-neutral-900/90 border-white/10 hover:border-[#de4a2c]" : "bg-white border-black/10 hover:border-[#de4a2c] shadow-md"}`,
							children: [/* @__PURE__ */ jsxs("div", {
								className: "relative w-full h-64 sm:h-72 overflow-hidden bg-black",
								children: [
									/* @__PURE__ */ jsx("img", {
										src: item.image,
										alt: item.title,
										className: "w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 select-none"
									}),
									/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" }),
									/* @__PURE__ */ jsxs("div", {
										className: "absolute top-3 inset-x-3 flex items-center justify-between",
										children: [/* @__PURE__ */ jsxs("span", {
											className: "px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-[10px] font-mono font-bold text-white border border-white/15",
											children: [
												item.number,
												". ",
												item.category
											]
										}), /* @__PURE__ */ jsx("span", {
											className: "px-2 py-0.5 rounded-full bg-[#de4a2c] text-white text-[10px] font-mono font-bold",
											children: item.turnaround
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-[#10b981] text-[10px] font-mono font-bold border border-white/10",
										children: ["✓ ", item.metric]
									})
								]
							}), /* @__PURE__ */ jsxs("div", {
								className: "p-5 flex flex-col justify-between grow",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
									className: "font-display text-base font-bold group-hover:text-[#de4a2c] transition-colors",
									children: item.title
								}), /* @__PURE__ */ jsx("p", {
									className: `font-mono text-xs mt-1.5 leading-relaxed ${isDark ? "text-neutral-400" : "text-neutral-600"}`,
									children: item.description
								})] }), /* @__PURE__ */ jsxs("div", {
									className: "mt-4 pt-3 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between",
									children: [/* @__PURE__ */ jsx("span", {
										className: `text-[11px] font-mono ${isDark ? "text-neutral-500" : "text-neutral-400"}`,
										children: "16-Bit Master"
									}), /* @__PURE__ */ jsxs(Link, {
										href: "/#free-sample",
										className: "inline-flex items-center gap-1 text-xs font-mono font-bold text-[#de4a2c] group-hover:underline",
										children: [/* @__PURE__ */ jsx("span", { children: "Order Proof" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-3.5 h-3.5" })]
									})]
								})]
							})]
						}, `${item.id}-${offset}`);
					})
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				id: "centered-focus",
				onMouseEnter: () => setIsCenteredHovered(true),
				onMouseLeave: () => setIsCenteredHovered(false),
				className: `py-20 px-4 sm:px-8 max-w-[1520px] mx-auto border-b transition-colors overflow-hidden ${isDark ? "border-white/[0.08]" : "border-black/[0.08]"}`,
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "text-center max-w-2xl mx-auto mb-10",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono text-[#de4a2c] uppercase font-bold tracking-wider mb-2",
								children: [/* @__PURE__ */ jsx(Sparkles, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Arven Home 2 Centered Spotlight (3s Timer)" })]
							}),
							/* @__PURE__ */ jsx("h2", {
								className: "font-display text-3xl sm:text-5xl font-bold tracking-tight",
								children: "Curated Post-Production Spotlight"
							}),
							/* @__PURE__ */ jsx("p", {
								className: `font-mono text-xs mt-2 ${isDark ? "text-neutral-400" : "text-neutral-600"}`,
								children: "Focusing on one hero discipline while adjacent portfolios rest in peripheral view."
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "relative flex items-center justify-center gap-4 sm:gap-8 overflow-hidden py-4",
						children: [
							(() => {
								const leftItem = CAROUSEL_SERVICES[(centeredIndex - 1 + CAROUSEL_SERVICES.length) % CAROUSEL_SERVICES.length];
								return /* @__PURE__ */ jsx("div", {
									onClick: () => setCenteredIndex((idx) => (idx - 1 + CAROUSEL_SERVICES.length) % CAROUSEL_SERVICES.length),
									className: "hidden md:block w-72 sm:w-80 h-96 rounded-3xl overflow-hidden opacity-40 hover:opacity-75 transition-all duration-700 cursor-pointer scale-90 shrink-0 border border-black/10 dark:border-white/10",
									children: /* @__PURE__ */ jsx("img", {
										src: leftItem.image,
										alt: leftItem.title,
										className: "w-full h-full object-cover"
									})
								});
							})(),
							(() => {
								const centerItem = CAROUSEL_SERVICES[centeredIndex];
								return /* @__PURE__ */ jsxs("div", {
									className: `w-full max-w-xl rounded-3xl overflow-hidden border shadow-2xl transition-all duration-700 shrink-0 relative ${isDark ? "bg-neutral-900 border-white/20" : "bg-white border-black/15 shadow-2xl"}`,
									children: [/* @__PURE__ */ jsxs("div", {
										className: "relative h-80 sm:h-96 w-full overflow-hidden bg-black",
										children: [
											/* @__PURE__ */ jsx("img", {
												src: centerItem.image,
												alt: centerItem.title,
												className: "w-full h-full object-cover select-none"
											}),
											/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" }),
											/* @__PURE__ */ jsxs("div", {
												className: "absolute top-4 left-4 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-white font-mono text-xs font-bold border border-white/20",
												children: [
													centerItem.number,
													". ",
													centerItem.category
												]
											}),
											/* @__PURE__ */ jsx("div", {
												className: "absolute top-4 right-4 px-3 py-1 rounded-full bg-[#de4a2c] text-white font-mono text-xs font-bold",
												children: centerItem.turnaround
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "absolute bottom-4 inset-x-4",
												children: [/* @__PURE__ */ jsxs("span", {
													className: "text-[#de4a2c] font-mono text-xs font-bold",
													children: ["✓ ", centerItem.metric]
												}), /* @__PURE__ */ jsx("h3", {
													className: "font-display text-2xl font-bold text-white mt-0.5",
													children: centerItem.title
												})]
											})
										]
									}), /* @__PURE__ */ jsxs("div", {
										className: "p-6 flex items-center justify-between",
										children: [/* @__PURE__ */ jsx("p", {
											className: `font-mono text-xs max-w-sm ${isDark ? "text-neutral-400" : "text-neutral-600"}`,
											children: centerItem.description
										}), /* @__PURE__ */ jsxs(Link, {
											href: "/#free-sample",
											className: "px-5 py-2.5 rounded-full bg-[#de4a2c] hover:bg-[#c93f24] text-white font-mono text-xs font-bold transition-all shadow-md flex items-center gap-1.5",
											children: [/* @__PURE__ */ jsx("span", { children: "Test 3 Free" }), /* @__PURE__ */ jsx(ArrowRight, { className: "w-3.5 h-3.5" })]
										})]
									})]
								});
							})(),
							(() => {
								const rightItem = CAROUSEL_SERVICES[(centeredIndex + 1) % CAROUSEL_SERVICES.length];
								return /* @__PURE__ */ jsx("div", {
									onClick: () => setCenteredIndex((idx) => (idx + 1) % CAROUSEL_SERVICES.length),
									className: "hidden md:block w-72 sm:w-80 h-96 rounded-3xl overflow-hidden opacity-40 hover:opacity-75 transition-all duration-700 cursor-pointer scale-90 shrink-0 border border-black/10 dark:border-white/10",
									children: /* @__PURE__ */ jsx("img", {
										src: rightItem.image,
										alt: rightItem.title,
										className: "w-full h-full object-cover"
									})
								});
							})()
						]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "flex items-center justify-center gap-2 mt-6",
						children: CAROUSEL_SERVICES.map((s, idx) => /* @__PURE__ */ jsx("button", {
							onClick: () => setCenteredIndex(idx),
							"aria-label": `Jump to item ${idx + 1}`,
							className: `h-2 rounded-full transition-all ${centeredIndex === idx ? "w-8 bg-[#de4a2c]" : isDark ? "w-2 bg-white/20 hover:bg-white/40" : "w-2 bg-black/20 hover:bg-black/40"}`
						}, s.id))
					})
				]
			}),
			/* @__PURE__ */ jsxs("section", {
				id: "gallery",
				className: `py-20 px-4 sm:px-8 max-w-[1520px] mx-auto border-b transition-colors ${isDark ? "border-white/[0.08]" : "border-black/[0.08]"}`,
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						className: "text-xs font-mono text-[#de4a2c] uppercase font-bold tracking-wider",
						children: "Editorial Lookbook Archive"
					}), /* @__PURE__ */ jsx("h2", {
						className: "font-display text-3xl sm:text-5xl font-bold tracking-tight mt-1",
						children: "Selected Works & Plates"
					})] }), /* @__PURE__ */ jsx("div", {
						className: "flex items-center gap-2 overflow-x-auto no-scrollbar py-1",
						children: categories.map((cat) => /* @__PURE__ */ jsx("button", {
							onClick: () => setActiveCategory(cat),
							className: `px-4 py-1.5 rounded-full text-xs font-mono font-bold whitespace-nowrap transition-all border ${activeCategory === cat ? "bg-[#de4a2c] text-white border-[#de4a2c] shadow-md shadow-[#de4a2c]/20" : isDark ? "bg-white/5 border-white/10 text-neutral-400 hover:text-white" : "bg-white border-black/10 text-neutral-600 hover:text-black shadow-xs"}`,
							children: cat
						}, cat))
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8",
					children: filteredGallery.map((item) => /* @__PURE__ */ jsx("div", {
						className: `group relative rounded-3xl overflow-hidden border shadow-lg cursor-pointer ${isDark ? "bg-neutral-900 border-white/10" : "bg-white border-black/10"}`,
						children: /* @__PURE__ */ jsxs("div", {
							className: `relative w-full ${item.aspect} overflow-hidden bg-black`,
							children: [
								/* @__PURE__ */ jsx("img", {
									src: item.image,
									alt: item.title,
									className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 select-none"
								}),
								/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" }),
								/* @__PURE__ */ jsx("div", {
									className: "absolute top-4 left-4 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-white font-mono text-[11px] border border-white/15",
									children: item.category
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "absolute bottom-4 inset-x-4 flex items-end justify-between",
									children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("span", {
										className: "text-[11px] font-mono text-[#de4a2c] font-bold",
										children: ["Client // ", item.client]
									}), /* @__PURE__ */ jsx("h3", {
										className: "font-display text-lg font-bold text-white mt-0.5",
										children: item.title
									})] }), /* @__PURE__ */ jsx("span", {
										className: "w-9 h-9 rounded-full bg-white text-black group-hover:bg-[#de4a2c] group-hover:text-white transition-all flex items-center justify-center shrink-0 shadow-lg",
										children: /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4" })
									})]
								})
							]
						})
					}, item.id))
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				id: "split-viewer",
				className: `py-20 px-4 sm:px-8 max-w-[1520px] mx-auto border-b transition-colors ${isDark ? "border-white/[0.08]" : "border-black/[0.08]"}`,
				children: [/* @__PURE__ */ jsxs("div", {
					className: "text-center max-w-2xl mx-auto mb-10",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono text-[#de4a2c] uppercase font-bold tracking-wider mb-2",
							children: [/* @__PURE__ */ jsx(Sliders, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Interactive RAW vs Finished Master" })]
						}),
						/* @__PURE__ */ jsx("h2", {
							className: "font-display text-3xl sm:text-5xl font-bold tracking-tight",
							children: "Non-Destructive Proofing Lab"
						}),
						/* @__PURE__ */ jsx("p", {
							className: `font-mono text-xs mt-2 ${isDark ? "text-neutral-400" : "text-neutral-600"}`,
							children: "Slide your mouse over the canvas to inspect 16-bit frequency separation and color harmonization."
						})
					]
				}), /* @__PURE__ */ jsxs("div", {
					ref: splitRef,
					onMouseMove: handleSplitMouseMove,
					className: "relative max-w-4xl mx-auto h-[480px] sm:h-[560px] md:h-[620px] rounded-3xl overflow-hidden border shadow-2xl select-none cursor-ew-resize group",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "absolute inset-0 w-full h-full",
							children: [/* @__PURE__ */ jsx("img", {
								src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1600&q=95",
								alt: "Finished Master",
								className: "w-full h-full object-cover",
								draggable: false
							}), /* @__PURE__ */ jsxs("div", {
								className: "absolute top-4 right-4 px-3.5 py-1.5 rounded-full bg-black/80 backdrop-blur-md text-white font-mono text-xs font-bold border border-white/20 shadow-xl flex items-center gap-1.5",
								children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5 text-[#10b981]" }), /* @__PURE__ */ jsx("span", { children: "Finished: High-End Model Master" })]
							})]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "absolute inset-0 overflow-hidden z-20",
							style: { clipPath: `polygon(0 0, ${splitPos}% 0, ${splitPos}% 100%, 0 100%)` },
							children: /* @__PURE__ */ jsxs("div", {
								className: "w-full h-full relative",
								children: [/* @__PURE__ */ jsx("img", {
									src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1600&q=80",
									alt: "Raw Unprocessed Plate",
									className: "w-full h-full object-cover filter sepia-[0.1] contrast-90 brightness-95",
									draggable: false
								}), /* @__PURE__ */ jsxs("div", {
									className: "absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-neutral-900/90 backdrop-blur-md text-neutral-300 font-mono text-xs font-bold border border-white/10 shadow-xl flex items-center gap-1.5",
									children: [/* @__PURE__ */ jsx(Scissors, { className: "w-3.5 h-3.5 text-neutral-400" }), /* @__PURE__ */ jsx("span", { children: "Raw Unprocessed Plate" })]
								})]
							})
						}),
						/* @__PURE__ */ jsx("div", {
							className: "absolute top-0 bottom-0 w-[2px] bg-white shadow-[0_0_24px_rgba(255,255,255,1)] z-30 pointer-events-none",
							style: { left: `${splitPos}%` },
							children: /* @__PURE__ */ jsx("div", {
								className: "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white text-black shadow-2xl border-2 border-black/20 flex items-center justify-center font-mono text-xs font-bold ring-4 ring-[#de4a2c]/30",
								children: "⟷"
							})
						}),
						/* @__PURE__ */ jsx("div", {
							className: "absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full bg-black/80 backdrop-blur-md text-white font-mono text-xs pointer-events-none shadow-xl border border-white/15",
							children: /* @__PURE__ */ jsxs("span", { children: [
								"Split: ",
								splitPos,
								"% • Move mouse horizontally to inspect"
							] })
						})
					]
				})]
			}),
			/* @__PURE__ */ jsx("section", {
				className: `py-16 px-4 sm:px-8 max-w-[1520px] mx-auto border-b transition-colors ${isDark ? "border-white/[0.08]" : "border-black/[0.08]"}`,
				children: /* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-2 md:grid-cols-4 gap-6",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: `p-6 rounded-2xl border transition-colors ${isDark ? "bg-neutral-900/70 border-white/10" : "bg-white border-black/10"}`,
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "font-display text-3xl sm:text-4xl font-bold text-[#de4a2c]",
									children: "16-Bit"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "font-display text-sm font-bold mt-1",
									children: "Non-Destructive Precision"
								}),
								/* @__PURE__ */ jsx("p", {
									className: `font-mono text-xs mt-1 ${isDark ? "text-neutral-400" : "text-neutral-500"}`,
									children: "Full raw color gamut & natural skin pore preservation."
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: `p-6 rounded-2xl border transition-colors ${isDark ? "bg-neutral-900/70 border-white/10" : "bg-white border-black/10"}`,
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "font-display text-3xl sm:text-4xl font-bold text-[#de4a2c]",
									children: "0.5px"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "font-display text-sm font-bold mt-1",
									children: "Hand-Drawn Bezier Path"
								}),
								/* @__PURE__ */ jsx("p", {
									className: `font-mono text-xs mt-1 ${isDark ? "text-neutral-400" : "text-neutral-500"}`,
									children: "Sub-pixel pen tool isolation with zero jagged halo edges."
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: `p-6 rounded-2xl border transition-colors ${isDark ? "bg-neutral-900/70 border-white/10" : "bg-white border-black/10"}`,
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "font-display text-3xl sm:text-4xl font-bold text-[#de4a2c]",
									children: "ΔE < 1"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "font-display text-sm font-bold mt-1",
									children: "Delta-E Color Calibration"
								}),
								/* @__PURE__ */ jsx("p", {
									className: `font-mono text-xs mt-1 ${isDark ? "text-neutral-400" : "text-neutral-500"}`,
									children: "Physical swatch & Pantone alignment for return reduction."
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: `p-6 rounded-2xl border transition-colors ${isDark ? "bg-neutral-900/70 border-white/10" : "bg-white border-black/10"}`,
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "font-display text-3xl sm:text-4xl font-bold text-[#de4a2c]",
									children: "24h"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "font-display text-sm font-bold mt-1",
									children: "Guaranteed SLA Turnaround"
								}),
								/* @__PURE__ */ jsx("p", {
									className: `font-mono text-xs mt-1 ${isDark ? "text-neutral-400" : "text-neutral-500"}`,
									children: "Overnight batch processing with 4h rush options available."
								})
							]
						})
					]
				})
			}),
			/* @__PURE__ */ jsxs("section", {
				className: `py-12 px-4 sm:px-8 max-w-[1520px] mx-auto border-b transition-colors overflow-hidden ${isDark ? "border-white/[0.08]" : "border-black/[0.08]"}`,
				children: [/* @__PURE__ */ jsx("div", {
					className: "text-center mb-6",
					children: /* @__PURE__ */ jsx("span", {
						className: `text-xs font-mono uppercase tracking-widest ${isDark ? "text-neutral-500" : "text-neutral-400"}`,
						children: "Trusted by Global Commercial Brands & Studios"
					})
				}), /* @__PURE__ */ jsx("div", {
					className: "flex items-center justify-center gap-8 sm:gap-14 flex-wrap opacity-70",
					children: clients.slice(0, 7).map((client) => /* @__PURE__ */ jsx("div", {
						className: "flex items-center gap-2 grayscale hover:grayscale-0 transition-all",
						children: /* @__PURE__ */ jsx("span", {
							className: "font-display text-sm sm:text-base font-bold tracking-tight",
							children: client.name
						})
					}, client.id))
				})]
			}),
			/* @__PURE__ */ jsx("section", {
				className: `py-20 px-4 sm:px-8 max-w-[1520px] mx-auto border-b transition-colors ${isDark ? "border-white/[0.08]" : "border-black/[0.08]"}`,
				children: /* @__PURE__ */ jsxs("div", {
					className: `max-w-3xl mx-auto text-center rounded-3xl border p-8 sm:p-14 shadow-2xl transition-colors ${isDark ? "bg-neutral-900 border-white/10" : "bg-white border-black/10 shadow-lg"}`,
					children: [
						/* @__PURE__ */ jsxs("span", {
							className: "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono text-[#de4a2c] bg-[#de4a2c]/10 border border-[#de4a2c]/20 mb-4 font-bold",
							children: [/* @__PURE__ */ jsx(Sparkles, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Complimentary Trial Pilot" })]
						}),
						/* @__PURE__ */ jsx("h2", {
							className: "font-display text-3xl sm:text-5xl font-bold tracking-tight mb-3",
							children: "Test 3 Images on Us."
						}),
						/* @__PURE__ */ jsx("p", {
							className: `font-mono text-xs sm:text-sm max-w-md mx-auto mb-8 ${isDark ? "text-neutral-400" : "text-neutral-600"}`,
							children: "Upload 3 RAW or studio plates. Receive hand-finished 16-bit layered masters within 24 hours. Zero risk, zero commitment."
						}),
						/* @__PURE__ */ jsxs(Link, {
							href: "/#free-sample",
							className: "inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#de4a2c] hover:bg-[#c93f24] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-xl shadow-[#de4a2c]/20",
							children: [/* @__PURE__ */ jsx("span", { children: "Upload 3 Test Files" }), /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })]
						})
					]
				})
			}),
			/* @__PURE__ */ jsxs("footer", {
				className: `py-8 px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-between text-xs font-mono gap-4 transition-colors ${isDark ? "text-neutral-500" : "text-neutral-500"}`,
				children: [/* @__PURE__ */ jsx("div", { children: "© 2026 Cutting Edger Atelier • Inspired by Arven Editorial Photography Theme" }), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-4",
					children: [
						/* @__PURE__ */ jsx("a", {
							href: "#showcase",
							className: "hover:opacity-80 transition-opacity",
							children: "Showcase"
						}),
						/* @__PURE__ */ jsx("span", {
							className: "opacity-30",
							children: "•"
						}),
						/* @__PURE__ */ jsx("a", {
							href: "#disciplines-carousel",
							className: "hover:opacity-80 transition-opacity",
							children: "Auto-Carousel"
						}),
						/* @__PURE__ */ jsx("span", {
							className: "opacity-30",
							children: "•"
						}),
						/* @__PURE__ */ jsx("a", {
							href: "#gallery",
							className: "hover:opacity-80 transition-opacity",
							children: "Gallery"
						}),
						/* @__PURE__ */ jsx("span", {
							className: "opacity-30",
							children: "•"
						}),
						/* @__PURE__ */ jsx("a", {
							href: "#split-viewer",
							className: "hover:opacity-80 transition-opacity",
							children: "Before/After"
						})
					]
				})]
			})
		]
	});
}
//#endregion
export { HomeArvenStudio };
