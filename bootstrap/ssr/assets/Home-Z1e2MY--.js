import { t as SeoHead } from "./SeoHead-CXtfHcil.js";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@inertiajs/react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, ChevronDown, Compass, Cpu, Flame, Layers, Quote, Sparkles, Star } from "lucide-react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { AnimatePresence, motion, useInView, useScroll, useTransform } from "framer-motion";
//#region resources/js/Components/UI/Button.tsx
var Button = forwardRef(({ variant = "primary", size = "md", withArrow = false, href, isExternal = false, className = "", children, ...props }, ref) => {
	const baseClasses = `group relative inline-flex items-center justify-center gap-2 rounded-full transition-all duration-300 overflow-hidden select-none cursor-pointer ${{
		sm: "px-4 py-2 text-xs font-semibold tracking-wider uppercase",
		md: "px-6 py-3.5 text-xs md:text-sm font-bold tracking-wider uppercase",
		lg: "px-8 py-4 text-sm md:text-base font-bold tracking-wider uppercase"
	}[size]} ${{
		primary: "bg-[#d4ff00] text-black hover:bg-[#c2eb00] hover:shadow-[0_0_25px_rgba(212,255,0,0.35)] font-display active:scale-95",
		secondary: "bg-white/10 dark:bg-white/5 text-neutral-900 dark:text-white border border-black/10 dark:border-white/10 hover:border-[#d4ff00]/60 hover:text-[#d4ff00] dark:hover:text-[#d4ff00] backdrop-blur-md active:scale-95",
		outline: "border border-black/20 dark:border-white/20 text-neutral-900 dark:text-white hover:border-[#d4ff00] hover:text-[#d4ff00] bg-transparent active:scale-95",
		ghost: "text-neutral-700 dark:text-neutral-300 hover:text-[#d4ff00] dark:hover:text-[#d4ff00] bg-transparent"
	}[variant]} ${className}`;
	const content = /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs("span", {
		className: "relative z-10 flex items-center gap-2",
		children: [children, withArrow && /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" })]
	}) });
	if (href) {
		if (isExternal) return /* @__PURE__ */ jsx("a", {
			href,
			target: "_blank",
			rel: "noopener noreferrer",
			className: baseClasses,
			children: content
		});
		return /* @__PURE__ */ jsx(Link, {
			href,
			className: baseClasses,
			children: content
		});
	}
	return /* @__PURE__ */ jsx("button", {
		ref,
		className: baseClasses,
		...props,
		children: content
	});
});
Button.displayName = "Button";
//#endregion
//#region resources/js/Components/Home/SplitHero.tsx
function SplitHero({ onOpenContact }) {
	const heroRef = useRef(null);
	const cardRefs = useRef([]);
	const activeAnimsRef = useRef([]);
	const mousePosRef = useRef({
		x: 0,
		y: 0
	});
	const cacheMousePosRef = useRef({
		x: 0,
		y: 0
	});
	const lastMousePosRef = useRef({
		x: 0,
		y: 0
	});
	const isInsideRef = useRef(false);
	const cardIndexRef = useRef(0);
	const zIndexCounterRef = useRef(1);
	const rotatingWords = [
		"3D SPATIAL CGI",
		"2D BRAND IDENTITY",
		"KINETIC SHADERS",
		"MOTION DIRECTION"
	];
	const [currentWordIndex, setCurrentWordIndex] = useState(0);
	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
		}, 3200);
		return () => clearInterval(interval);
	}, [rotatingWords.length]);
	const gallery = [
		{
			title: "Kinetix OS",
			category: "3D Spatial Shaders",
			image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=700&q=80"
		},
		{
			title: "Hyperion Audio",
			category: "Acoustic CGI Modeling",
			image: "https://images.unsplash.com/photo-1546776310-eef45dd6d63c?auto=format&fit=crop&w=700&q=80"
		},
		{
			title: "Vortex Protocol",
			category: "Brand Architecture",
			image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80"
		},
		{
			title: "Aura Dynamics",
			category: "Telemetry Interface",
			image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80"
		},
		{
			title: "Sculptural Modern",
			category: "3D Spatial CGI",
			image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=700&q=80"
		},
		{
			title: "Neon Horizon",
			category: "Editorial Visuals",
			image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=80"
		},
		{
			title: "Kinetic Shaders",
			category: "WebGL Direction",
			image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=700&q=80"
		},
		{
			title: "Ethereal Motion",
			category: "Generative Art",
			image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=700&q=80"
		},
		{
			title: "Monolith Brutalism",
			category: "Spatial Identity",
			image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=700&q=80"
		},
		{
			title: "Vektor Studio",
			category: "Dynamic Systems",
			image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=700&q=80"
		},
		{
			title: "Chromatic Shift",
			category: "Light Shaders",
			image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=700&q=80"
		},
		{
			title: "Cyber Matrix",
			category: "Procedural CGI",
			image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=700&q=80"
		},
		{
			title: "Prism Optics",
			category: "Kinetic Glass",
			image: "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&w=700&q=80"
		},
		{
			title: "Typographic Grid",
			category: "Creative Direction",
			image: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=700&q=80"
		},
		{
			title: "Synapse Interface",
			category: "Product Systems",
			image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=700&q=80"
		},
		{
			title: "Collective Edge",
			category: "Team Vanguard",
			image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=700&q=80"
		}
	];
	const showNextImage = useCallback(() => {
		zIndexCounterRef.current += 1;
		const idx = cardIndexRef.current;
		cardIndexRef.current = (cardIndexRef.current + 1) % gallery.length;
		const el = cardRefs.current[idx];
		if (!el) return;
		if (activeAnimsRef.current[idx]) activeAnimsRef.current[idx]?.cancel();
		const cardW = 250;
		const cardH = 225;
		const startX = cacheMousePosRef.current.x - cardW / 2;
		const startY = cacheMousePosRef.current.y - cardH / 2;
		const endX = mousePosRef.current.x - cardW / 2;
		const endY = mousePosRef.current.y - cardH / 2;
		el.style.zIndex = String(zIndexCounterRef.current);
		const anim = el.animate([
			{
				opacity: 1,
				transform: `translate3d(${startX}px, ${startY}px, 0) scale(1)`,
				easing: "cubic-bezier(0.25, 1, 0.5, 1)",
				offset: 0
			},
			{
				opacity: 1,
				transform: `translate3d(${endX}px, ${endY}px, 0) scale(1)`,
				easing: "cubic-bezier(0.16, 1, 0.3, 1)",
				offset: .5
			},
			{
				opacity: 0,
				transform: `translate3d(${endX}px, ${endY}px, 0) scale(0.2)`,
				offset: 1
			}
		], {
			duration: 800,
			fill: "forwards"
		});
		activeAnimsRef.current[idx] = anim;
		anim.onfinish = () => {
			if (activeAnimsRef.current[idx] === anim) activeAnimsRef.current[idx] = null;
		};
	}, [gallery.length]);
	useEffect(() => {
		let animationFrameId;
		const lerp = (a, b, n) => (1 - n) * a + n * b;
		const render = () => {
			if (isInsideRef.current) {
				cacheMousePosRef.current.x = lerp(cacheMousePosRef.current.x || mousePosRef.current.x, mousePosRef.current.x, .1);
				cacheMousePosRef.current.y = lerp(cacheMousePosRef.current.y || mousePosRef.current.y, mousePosRef.current.y, .1);
				if (Math.hypot(mousePosRef.current.x - lastMousePosRef.current.x, mousePosRef.current.y - lastMousePosRef.current.y) > 75) {
					lastMousePosRef.current = { ...mousePosRef.current };
					showNextImage();
				}
			}
			animationFrameId = requestAnimationFrame(render);
		};
		animationFrameId = requestAnimationFrame(render);
		return () => cancelAnimationFrame(animationFrameId);
	}, [showNextImage]);
	const handleMouseEnter = useCallback((e) => {
		if (!heroRef.current) return;
		const rect = heroRef.current.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		isInsideRef.current = true;
		mousePosRef.current = {
			x,
			y
		};
		cacheMousePosRef.current = {
			x,
			y
		};
		lastMousePosRef.current = {
			x,
			y
		};
	}, []);
	const handleMouseMove = useCallback((e) => {
		if (!heroRef.current) return;
		const rect = heroRef.current.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		if (!isInsideRef.current) {
			isInsideRef.current = true;
			cacheMousePosRef.current = {
				x,
				y
			};
			lastMousePosRef.current = {
				x,
				y
			};
		}
		mousePosRef.current = {
			x,
			y
		};
	}, []);
	const handleMouseLeave = useCallback(() => {
		isInsideRef.current = false;
	}, []);
	const reelCards = [
		{
			title: "Kinetix OS",
			category: "3D Spatial Shaders",
			year: "2026",
			color: "from-purple-950/60 via-[#10121a] to-black",
			accent: "#d4ff00",
			tag: "3D Real-Time WebGL",
			preview: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"
		},
		{
			title: "Hyperion Audio",
			category: "Acoustic 3D Renderings",
			year: "2025",
			color: "from-emerald-950/60 via-[#10121a] to-black",
			accent: "#00f5ff",
			tag: "CGI Product Modeling",
			preview: "https://images.unsplash.com/photo-1546776310-eef45dd6d63c?auto=format&fit=crop&w=800&q=80"
		},
		{
			title: "Vortex Capital",
			category: "2D Vector Identity",
			year: "2025",
			color: "from-amber-950/60 via-[#10121a] to-black",
			accent: "#ff9900",
			tag: "Brand Architecture",
			preview: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=800&q=80"
		}
	];
	const [activeCardIndex, setActiveCardIndex] = useState(0);
	const scrollToWork = () => {
		const workSection = document.getElementById("featured-work");
		if (workSection) {
			if (typeof window !== "undefined" && window.lenis) window.lenis.scrollTo(workSection, { offset: -30 });
			else workSection.scrollIntoView({ behavior: "smooth" });
		}
	};
	return /* @__PURE__ */ jsxs("section", {
		ref: heroRef,
		onMouseEnter: handleMouseEnter,
		onMouseMove: handleMouseMove,
		onMouseLeave: handleMouseLeave,
		className: "relative min-h-[94vh] pt-32 pb-16 flex flex-col justify-between overflow-hidden bg-[#090a0d] text-white select-none",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "absolute inset-0 pointer-events-none",
				children: [/* @__PURE__ */ jsx("div", { className: "absolute top-1/4 left-0 w-[36rem] h-[36rem] bg-[#d4ff00]/10 rounded-full blur-[170px]" }), /* @__PURE__ */ jsx("div", { className: "absolute top-1/3 right-10 w-[40rem] h-[40rem] bg-indigo-600/15 rounded-full blur-[190px]" })]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "absolute inset-0 pointer-events-none z-10 overflow-hidden",
				children: gallery.map((item, idx) => /* @__PURE__ */ jsxs("div", {
					ref: (el) => {
						cardRefs.current[idx] = el;
					},
					style: {
						opacity: 0,
						transform: "translate3d(-9999px, -9999px, 0)"
					},
					className: "pointer-events-none absolute w-[240px] sm:w-[250px] h-[215px] sm:h-[225px] rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_20px_rgba(212,255,0,0.1)] border border-white/20 will-change-transform bg-neutral-900",
					children: [/* @__PURE__ */ jsx("img", {
						src: item.image,
						alt: item.title,
						className: "w-full h-full object-cover object-center scale-105"
					}), /* @__PURE__ */ jsxs("div", {
						className: "absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-3.5",
						children: [/* @__PURE__ */ jsx("span", {
							className: "font-mono text-[10px] uppercase tracking-widest text-[#d4ff00]",
							children: item.category
						}), /* @__PURE__ */ jsx("span", {
							className: "font-['Antonio',_'Bebas_Neue',_sans-serif] uppercase text-sm font-bold text-white tracking-wider",
							children: item.title
						})]
					})]
				}, idx))
			}),
			/* @__PURE__ */ jsx("div", {
				className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto relative z-20",
				children: /* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "lg:col-span-7 space-y-8",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-neutral-300",
								children: [/* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-[#d4ff00] animate-pulse" }), /* @__PURE__ */ jsx("span", {
									className: "uppercase tracking-widest",
									children: "AVAILABLE FOR COMMISSIONS // 2026 ARCHITECTURE"
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-4",
								children: [/* @__PURE__ */ jsxs("h1", {
									className: "text-5xl sm:text-7xl lg:text-[5.5rem] font-['Antonio',_'Bebas_Neue',_'Syne',_sans-serif] uppercase font-bold text-white tracking-tight leading-[1.02]",
									children: [
										"WE SCULPT ",
										/* @__PURE__ */ jsx("br", {}),
										"UNFAIR ADVANTAGE FOR ",
										/* @__PURE__ */ jsx("br", {}),
										/* @__PURE__ */ jsx("span", {
											className: "overflow-hidden h-[1.25em] relative block text-[#d4ff00] pt-1",
											children: /* @__PURE__ */ jsx(AnimatePresence, {
												mode: "wait",
												children: /* @__PURE__ */ jsxs(motion.span, {
													initial: {
														y: 35,
														opacity: 0
													},
													animate: {
														y: 0,
														opacity: 1
													},
													exit: {
														y: -35,
														opacity: 0
													},
													transition: {
														duration: .45,
														ease: [
															.16,
															1,
															.3,
															1
														]
													},
													className: "block whitespace-nowrap",
													children: ["IN ", rotatingWords[currentWordIndex]]
												}, rotatingWords[currentWordIndex])
											})
										})
									]
								}), /* @__PURE__ */ jsx("p", {
									className: "text-lg sm:text-xl text-neutral-400 max-w-xl font-normal leading-relaxed pt-2",
									children: "CuttingEdger is a boundary-pushing design & technology agency. We transform audacious founders and global brands into untouchable market forces."
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex flex-wrap items-center gap-4 pt-2",
								children: [/* @__PURE__ */ jsx(Button, {
									variant: "primary",
									size: "lg",
									onClick: scrollToWork,
									withArrow: true,
									children: "Explore Selected Work"
								}), /* @__PURE__ */ jsx(Button, {
									variant: "secondary",
									size: "lg",
									onClick: onOpenContact,
									children: "Initiate Project"
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "pt-6 border-t border-white/10 grid grid-cols-3 gap-6 max-w-lg",
								children: [
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
										className: "block font-['Antonio',_'Bebas_Neue',_sans-serif] font-bold text-3xl text-white",
										children: "100%"
									}), /* @__PURE__ */ jsx("span", {
										className: "text-xs font-mono text-neutral-400 uppercase",
										children: "Independent"
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
										className: "block font-['Antonio',_'Bebas_Neue',_sans-serif] font-bold text-3xl text-[#d4ff00]",
										children: "14+"
									}), /* @__PURE__ */ jsx("span", {
										className: "text-xs font-mono text-neutral-400 uppercase",
										children: "Awwwards / FWA"
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
										className: "block font-['Antonio',_'Bebas_Neue',_sans-serif] font-bold text-3xl text-white",
										children: "<0.5s"
									}), /* @__PURE__ */ jsx("span", {
										className: "text-xs font-mono text-neutral-400 uppercase",
										children: "Edge Velocity"
									})] })
								]
							})
						]
					}), /* @__PURE__ */ jsx("div", {
						className: "lg:col-span-5 relative flex justify-center items-center py-8",
						children: /* @__PURE__ */ jsx("div", {
							className: "relative w-full max-w-md h-[430px]",
							children: reelCards.map((card, idx) => {
								const offset = (idx - activeCardIndex + reelCards.length) % reelCards.length;
								return /* @__PURE__ */ jsxs("div", {
									onClick: () => setActiveCardIndex((prev) => (prev + 1) % reelCards.length),
									"data-cursor-view": "CLICK TO SHUFFLE",
									className: `absolute inset-0 rounded-3xl p-7 border border-white/15 bg-gradient-to-b ${card.color} backdrop-blur-xl shadow-2xl transition-all duration-700 ease-out cursor-pointer flex flex-col justify-between select-none group`,
									style: {
										transform: `translateY(${offset * 18}px) scale(${1 - offset * .06})`,
										zIndex: reelCards.length - offset,
										opacity: 1 - offset * .2
									},
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ jsx("span", {
												className: "font-mono text-[11px] uppercase tracking-widest px-3 py-1 rounded-full bg-white/10 text-white/90 border border-white/10",
												children: card.tag
											}), /* @__PURE__ */ jsxs("span", {
												className: "font-mono text-xs text-neutral-400",
												children: [
													"[",
													card.year,
													"]"
												]
											})]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "my-auto py-8",
											children: [
												/* @__PURE__ */ jsx("div", {
													className: "w-16 h-16 rounded-2xl border border-white/20 bg-white/5 flex items-center justify-center mb-6 shadow-inner group-hover:bg-[#d4ff00]/10 transition-colors",
													children: /* @__PURE__ */ jsx(Sparkles, { className: "w-8 h-8 text-[#d4ff00]" })
												}),
												/* @__PURE__ */ jsx("span", {
													className: "font-mono text-xs uppercase tracking-widest text-[#d4ff00]",
													children: card.category
												}),
												/* @__PURE__ */ jsx("h3", {
													className: "text-3xl font-['Antonio',_'Bebas_Neue',_sans-serif] uppercase font-bold text-white mt-1",
													children: card.title
												})
											]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-neutral-400",
											children: [/* @__PURE__ */ jsxs("span", { children: ["Case Study 0", idx + 1] }), /* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-1.5 text-white font-medium group-hover:text-[#d4ff00] transition-colors",
												children: [/* @__PURE__ */ jsx("span", { children: "Shuffle Next" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4 text-[#d4ff00]" })]
											})]
										})
									]
								}, card.title);
							})
						})
					})]
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-8 flex items-center justify-between text-xs font-mono text-neutral-500 relative z-20",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-[#d4ff00]" }), /* @__PURE__ */ jsx("span", {
						className: "uppercase tracking-widest",
						children: "SCROLL TO REVEAL"
					})]
				}), /* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: scrollToWork,
					"aria-label": "Scroll down",
					className: "p-2 rounded-full border border-white/10 hover:border-[#d4ff00] hover:text-[#d4ff00] transition-colors cursor-pointer",
					children: /* @__PURE__ */ jsx(ArrowDown, { className: "w-4 h-4 animate-bounce" })
				})]
			})
		]
	});
}
//#endregion
//#region resources/js/Components/Home/IntroBand.tsx
function InvertLine({ text }) {
	const lineRef = useRef(null);
	const { scrollYProgress } = useScroll({
		target: lineRef,
		offset: ["start 0.88", "end 0.45"]
	});
	const backgroundPosition = useTransform(scrollYProgress, [0, 1], ["100% 0%", "0% 0%"]);
	return /* @__PURE__ */ jsx("span", {
		ref: lineRef,
		className: "block w-full overflow-hidden py-0.5 sm:py-1 text-center",
		children: /* @__PURE__ */ jsx(motion.span, {
			style: {
				backgroundImage: "linear-gradient(to right, #f9f4e8 50%, #383c3e 50%)",
				backgroundSize: "200% 100%",
				backgroundPosition,
				WebkitBackgroundClip: "text",
				WebkitTextFillColor: "transparent",
				backgroundClip: "text",
				color: "transparent",
				display: "inline-block",
				transform: "translateZ(0)"
			},
			className: "will-change-[background-position] font-['MangoGrotesque',_'Antonio',_'Roboto_Condensed',_sans-serif] text-[20px] xs:text-[24px] sm:text-[34px] md:text-[46px] lg:text-[58px] xl:text-[68px] font-normal tracking-[0.5px] sm:tracking-[1px] leading-[1.08] sm:leading-[1.12] whitespace-nowrap",
			children: text
		})
	});
}
function IntroBand() {
	const sectionRef = useRef(null);
	const { scrollYProgress: marqueeScroll } = useScroll({
		target: sectionRef,
		offset: ["start end", "end start"]
	});
	const xTop = useTransform(marqueeScroll, [0, 1], ["0%", "-30%"]);
	const xBottom = useTransform(marqueeScroll, [0, 1], ["-30%", "0%"]);
	const marqueeRow1 = [
		"Digital Experience",
		"Online Interaction",
		"Virtual Engagement",
		"Digital Experience",
		"Online Interaction"
	];
	const marqueeRow2 = [
		"Virtual Engagement",
		"Digital Experience",
		"Online Interaction",
		"Virtual Engagement",
		"Digital Experience"
	];
	const manifestoLines = [
		"With over 10 years of experience as a versatile Front-End and",
		"Full-Stack Developer, I excel in crafting a wide range of solutions,",
		"from dynamic web applications and interactive configurators to",
		"robust backend automation software, ensuring innovative and",
		"effective outcomes for any project."
	];
	return /* @__PURE__ */ jsxs("section", {
		ref: sectionRef,
		className: "relative pt-24 sm:pt-28 pb-32 sm:pb-40 border-y border-white/10 bg-[#090a0d] overflow-hidden select-none",
		children: [
			/* @__PURE__ */ jsx("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[30rem] bg-[#d4ff00]/5 rounded-full blur-[180px] pointer-events-none" }),
			/* @__PURE__ */ jsxs("div", {
				className: "space-y-4 pb-20 sm:pb-28 overflow-hidden",
				children: [/* @__PURE__ */ jsx("div", {
					className: "py-3 bg-black/40 border-y border-white/5 overflow-hidden",
					children: /* @__PURE__ */ jsx(motion.div, {
						style: { x: xTop },
						className: "flex items-center gap-10 whitespace-nowrap will-change-transform",
						children: [
							...marqueeRow1,
							...marqueeRow1,
							...marqueeRow1
						].map((item, idx) => /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-10",
							children: [/* @__PURE__ */ jsx("span", {
								className: "font-['Antonio',_'Bebas_Neue',_'Syne',_sans-serif] uppercase font-bold text-5xl sm:text-7xl md:text-8xl lg:text-[100px] text-neutral-300 tracking-tight leading-none hover:text-[#d4ff00] transition-colors",
								children: item
							}), /* @__PURE__ */ jsx("span", { className: "w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#d4ff00] shadow-[0_0_15px_rgba(212,255,0,0.8)] shrink-0" })]
						}, `r1-${idx}`))
					})
				}), /* @__PURE__ */ jsx("div", {
					className: "py-3 bg-black/60 border-b border-white/5 overflow-hidden",
					children: /* @__PURE__ */ jsx(motion.div, {
						style: { x: xBottom },
						className: "flex items-center gap-10 whitespace-nowrap will-change-transform",
						children: [
							...marqueeRow2,
							...marqueeRow2,
							...marqueeRow2
						].map((item, idx) => /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-10",
							children: [/* @__PURE__ */ jsx("span", {
								className: "font-['Antonio',_'Bebas_Neue',_'Syne',_sans-serif] uppercase font-bold text-5xl sm:text-7xl md:text-8xl lg:text-[100px] text-neutral-400 hover:text-white transition-colors tracking-tight leading-none",
								children: item
							}), /* @__PURE__ */ jsx("span", { className: "w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#ff5e36] shadow-[0_0_15px_rgba(255,94,54,0.8)] shrink-0" })]
						}, `r2-${idx}`))
					})
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 text-center space-y-8 sm:space-y-10",
				children: [/* @__PURE__ */ jsx("div", {
					className: "flex flex-col items-center w-full space-y-0 sm:space-y-0.5",
					children: manifestoLines.map((line, index) => /* @__PURE__ */ jsx(InvertLine, { text: line }, index))
				}), /* @__PURE__ */ jsx("div", {
					className: "pt-4 flex justify-center",
					children: /* @__PURE__ */ jsx(Link, {
						href: "/about",
						className: "inline-block px-8 py-2.5 rounded-[6px] border border-white/20 bg-neutral-950/80 hover:bg-[#f9f4e8] hover:text-black hover:border-[#f9f4e8] text-base sm:text-lg font-['MangoGrotesque',_'Antonio',_'Roboto_Condensed',_sans-serif] tracking-wider text-[#f9f4e8] transition-all duration-300 shadow-sm",
						children: "More About Us"
					})
				})]
			})
		]
	});
}
//#endregion
//#region resources/js/Components/Home/StickyWorkCards.tsx
var AGNTIX_WORKS = [
	{
		id: 1,
		title: "Electro Hub",
		slug: "electro-hub",
		image: "/images/portfolio/portfolio-1.jpg",
		categories: ["Web Design", "Web Development"],
		year: 2025
	},
	{
		id: 2,
		title: "Creative Vision",
		slug: "creative-vision",
		image: "/images/portfolio/portfolio-2.jpg",
		categories: ["Web Design", "Web Development"],
		year: 2025
	},
	{
		id: 3,
		title: "Design Essence",
		slug: "design-essence",
		image: "/images/portfolio/portfolio-3.jpg",
		categories: ["Spatial CGI", "3D WebGL"],
		year: 2025
	},
	{
		id: 4,
		title: "Innovative Works",
		slug: "innovative-works",
		image: "/images/portfolio/portfolio-4.jpg",
		categories: ["Brand Architecture", "Motion Design"],
		year: 2026
	}
];
function CardView({ item, style, zIndex }) {
	const [mousePos, setMousePos] = useState({
		x: 0,
		y: 0
	});
	const [isHovered, setIsHovered] = useState(false);
	const handleMouseMove = (e) => {
		const rect = e.currentTarget.getBoundingClientRect();
		setMousePos({
			x: e.clientX - rect.left,
			y: e.clientY - rect.top
		});
	};
	return /* @__PURE__ */ jsxs(motion.article, {
		style: {
			...style,
			zIndex,
			transformOrigin: "top center"
		},
		onMouseEnter: () => setIsHovered(true),
		onMouseLeave: () => setIsHovered(false),
		onMouseMove: handleMouseMove,
		className: "absolute inset-0 w-full h-full rounded-[24px] sm:rounded-[36px] overflow-hidden border border-white/15 bg-neutral-950 shadow-[0_25px_70px_rgba(0,0,0,0.85)] group select-none will-change-transform",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "absolute inset-0 z-0",
				children: [/* @__PURE__ */ jsx("img", {
					src: item.image,
					alt: item.title,
					loading: "lazy",
					className: "w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
				}), /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40 pointer-events-none" })]
			}),
			/* @__PURE__ */ jsx(Link, {
				href: `/work/${item.slug}`,
				className: "absolute inset-0 z-20",
				"aria-label": `View ${item.title} demo`
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "relative z-30 p-6 sm:p-10 lg:p-12 flex items-center justify-between pointer-events-none",
				children: [/* @__PURE__ */ jsx("div", {
					className: "flex flex-wrap items-center gap-2 sm:gap-3",
					children: item.categories.map((cat, cIdx) => /* @__PURE__ */ jsx("span", {
						className: "px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-sans uppercase tracking-wider text-white font-medium shadow-sm group-hover:border-white/40 transition-colors",
						children: cat
					}, cIdx))
				}), /* @__PURE__ */ jsx("span", {
					className: "px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-mono text-white font-semibold shadow-sm",
					children: item.year
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "absolute bottom-10 sm:bottom-14 lg:bottom-16 inset-x-0 z-30 text-center px-4 pointer-events-none",
				children: /* @__PURE__ */ jsx("h3", {
					className: "font-['Antonio',_'Bebas_Neue',_'Syne',_sans-serif] text-5xl sm:text-7xl md:text-8xl lg:text-[120px] xl:text-[145px] font-bold uppercase text-[#f9f4e8] tracking-tight leading-none group-hover:text-[#d4ff00] transition-colors drop-shadow-[0_15px_30px_rgba(0,0,0,0.95)]",
					children: item.title
				})
			}),
			isHovered && /* @__PURE__ */ jsx(motion.div, {
				initial: {
					opacity: 0,
					scale: .5
				},
				animate: {
					opacity: 1,
					scale: 1,
					x: mousePos.x - 45,
					y: mousePos.y - 45
				},
				exit: {
					opacity: 0,
					scale: .5
				},
				transition: {
					type: "spring",
					stiffness: 350,
					damping: 25,
					mass: .2
				},
				className: "pointer-events-none absolute top-0 left-0 z-40 hidden sm:flex items-center justify-center w-[90px] h-[90px] rounded-full bg-[#d4ff00] text-black font-['Antonio',_'Bebas_Neue',_sans-serif] text-sm uppercase font-bold tracking-wider leading-tight text-center shadow-[0_0_30px_rgba(212,255,0,0.6)]",
				children: /* @__PURE__ */ jsxs("span", { children: [
					"View ",
					/* @__PURE__ */ jsx("br", {}),
					" Demo"
				] })
			})
		]
	});
}
function StickyWorkCards({ projects }) {
	const containerRef = useRef(null);
	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ["start start", "end end"]
	});
	const progress = scrollYProgress;
	const card0Scale = useTransform(progress, [
		0,
		.12,
		.36,
		.4,
		.64,
		.68,
		.92
	], [
		1,
		1,
		.86,
		.86,
		.76,
		.76,
		.68
	]);
	const card0Y = useTransform(progress, [
		0,
		.12,
		.36,
		.4,
		.64,
		.68,
		.92
	], [
		0,
		0,
		-32,
		-32,
		-56,
		-56,
		-76
	]);
	const card0Opacity = useTransform(progress, [
		0,
		.12,
		.36,
		.4,
		.64
	], [
		1,
		1,
		.6,
		.6,
		.3
	]);
	const card0Brightness = useTransform(progress, [
		0,
		.12,
		.36,
		.4,
		.64
	], [
		"100%",
		"100%",
		"65%",
		"65%",
		"40%"
	]);
	const card1TranslateY = useTransform(progress, [
		0,
		.12,
		.36
	], [
		"105%",
		"105%",
		"0%"
	]);
	const card1Scale = useTransform(progress, [
		.36,
		.4,
		.64,
		.68,
		.92
	], [
		1,
		1,
		.86,
		.86,
		.76
	]);
	const card1Y = useTransform(progress, [
		.36,
		.4,
		.64,
		.68,
		.92
	], [
		0,
		0,
		-32,
		-32,
		-56
	]);
	const card1Opacity = useTransform(progress, [
		.36,
		.4,
		.64
	], [
		1,
		1,
		.6
	]);
	const card1Brightness = useTransform(progress, [
		.36,
		.4,
		.64
	], [
		"100%",
		"100%",
		"65%"
	]);
	const card2TranslateY = useTransform(progress, [
		0,
		.4,
		.64
	], [
		"105%",
		"105%",
		"0%"
	]);
	const card2Scale = useTransform(progress, [
		.64,
		.68,
		.92
	], [
		1,
		1,
		.86
	]);
	const card2Y = useTransform(progress, [
		.64,
		.68,
		.92
	], [
		0,
		0,
		-32
	]);
	const card2Opacity = useTransform(progress, [
		.64,
		.68,
		.92
	], [
		1,
		1,
		.6
	]);
	const card2Brightness = useTransform(progress, [
		.64,
		.68,
		.92
	], [
		"100%",
		"100%",
		"65%"
	]);
	const card3TranslateY = useTransform(progress, [
		0,
		.68,
		.92
	], [
		"105%",
		"105%",
		"0%"
	]);
	return /* @__PURE__ */ jsxs("section", {
		id: "featured-work",
		className: "relative py-20 sm:py-28 bg-[#090a0d] border-t border-white/10 select-none",
		children: [/* @__PURE__ */ jsx("div", { className: "absolute top-1/4 right-0 w-[55rem] h-[55rem] bg-[#d4ff00]/5 rounded-full blur-[220px] pointer-events-none" }), /* @__PURE__ */ jsxs("div", {
			className: "w-full max-w-[96%] xl:max-w-[1560px] 2xl:max-w-[1750px] mx-auto px-4 sm:px-6 lg:px-8",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 pb-6 border-b border-white/10 gap-6",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "space-y-3",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-widest text-[#d4ff00]",
						children: [/* @__PURE__ */ jsx(Sparkles, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "[ 01 // SELECTED COMMISSIONS ]" })]
					}), /* @__PURE__ */ jsx("h2", {
						className: "text-4xl sm:text-6xl lg:text-7xl font-['Antonio',_'Bebas_Neue',_'Syne',_sans-serif] uppercase font-bold text-white tracking-tight leading-none",
						children: "ENGINEERED FOR IMPACT."
					})]
				}), /* @__PURE__ */ jsxs(Link, {
					href: "/work",
					className: "group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-widest text-neutral-300 hover:text-black hover:bg-[#d4ff00] hover:border-[#d4ff00] transition-all duration-300 shadow-sm",
					children: [/* @__PURE__ */ jsx("span", { children: "View All Archives (24+)" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" })]
				})]
			}), /* @__PURE__ */ jsx("div", {
				ref: containerRef,
				className: "relative h-[320vh] sm:h-[360vh]",
				children: /* @__PURE__ */ jsxs("div", {
					className: "sticky top-16 sm:top-20 lg:top-24 h-[65vh] sm:h-[75vh] lg:h-[82vh] min-h-[480px] max-h-[850px] w-full rounded-[24px] sm:rounded-[36px] overflow-visible",
					children: [
						/* @__PURE__ */ jsx(CardView, {
							item: AGNTIX_WORKS[0],
							zIndex: 10,
							style: {
								scale: card0Scale,
								y: card0Y,
								opacity: card0Opacity,
								filter: `brightness(${card0Brightness})`
							}
						}),
						/* @__PURE__ */ jsx(motion.div, {
							style: {
								y: card1TranslateY,
								zIndex: 20
							},
							className: "absolute inset-0 w-full h-full pointer-events-auto",
							children: /* @__PURE__ */ jsx(CardView, {
								item: AGNTIX_WORKS[1],
								zIndex: 20,
								style: {
									scale: card1Scale,
									y: card1Y,
									opacity: card1Opacity,
									filter: `brightness(${card1Brightness})`
								}
							})
						}),
						/* @__PURE__ */ jsx(motion.div, {
							style: {
								y: card2TranslateY,
								zIndex: 30
							},
							className: "absolute inset-0 w-full h-full pointer-events-auto",
							children: /* @__PURE__ */ jsx(CardView, {
								item: AGNTIX_WORKS[2],
								zIndex: 30,
								style: {
									scale: card2Scale,
									y: card2Y,
									opacity: card2Opacity,
									filter: `brightness(${card2Brightness})`
								}
							})
						}),
						/* @__PURE__ */ jsx(motion.div, {
							style: {
								y: card3TranslateY,
								zIndex: 40
							},
							className: "absolute inset-0 w-full h-full pointer-events-auto",
							children: /* @__PURE__ */ jsx(CardView, {
								item: AGNTIX_WORKS[3],
								zIndex: 40,
								style: {
									scale: 1,
									y: 0
								}
							})
						})
					]
				})
			})]
		})]
	});
}
//#endregion
//#region resources/js/Components/Home/ServicesList.tsx
function ServicesList({ services }) {
	const containerRef = useRef(null);
	const bannerRef = useRef(null);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ["start end", "end start"]
	});
	const smoothScroll = scrollYProgress;
	const xRow1 = useTransform(smoothScroll, [0, 1], ["5%", "-40%"]);
	const xRow2 = useTransform(smoothScroll, [0, 1], ["-40%", "5%"]);
	const xRow3 = useTransform(smoothScroll, [0, 1], ["8%", "-35%"]);
	const xRow4 = useTransform(smoothScroll, [0, 1], ["-35%", "8%"]);
	const { scrollYProgress: bannerScroll } = useScroll({
		target: bannerRef,
		offset: ["start end", "end start"]
	});
	const bannerImgY = useTransform(bannerScroll, [0, 1], ["-12%", "12%"]);
	const row1Items = [
		"Product Design",
		"Product Design",
		"Product Design",
		"Product Design",
		"Product Design"
	];
	const row2Items = [
		"Brand Design",
		"Brand Design",
		"Brand Design",
		"Brand Design",
		"Brand Design"
	];
	const row3Items = [
		"Motion Design",
		"Motion Design",
		"Motion Design",
		"Motion Design",
		"Motion Design"
	];
	const row4Items = [
		"Web Development",
		"Web Development",
		"Web Development",
		"Web Development",
		"Web Development"
	];
	const iconMap = {
		Layers,
		Compass,
		Flame,
		Cpu
	};
	return /* @__PURE__ */ jsxs("section", {
		ref: containerRef,
		id: "services-section",
		className: "relative pt-28 sm:pt-36 bg-[#090a0d] border-t border-white/10 overflow-hidden select-none",
		children: [
			/* @__PURE__ */ jsx("div", { className: "absolute top-1/4 left-1/4 w-[45rem] h-[30rem] bg-[#ff5e36]/5 rounded-full blur-[180px] pointer-events-none" }),
			/* @__PURE__ */ jsx("div", { className: "absolute bottom-1/4 right-1/4 w-[45rem] h-[30rem] bg-[#00e5a3]/5 rounded-full blur-[180px] pointer-events-none" }),
			/* @__PURE__ */ jsxs("div", {
				className: "max-w-4xl mx-auto px-4 sm:px-6 text-center mb-16 sm:mb-20",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-widest text-[#d4ff00] mb-4",
						children: [/* @__PURE__ */ jsx(Sparkles, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "[ 02 // CAPABILITIES & DISCIPLINES ]" })]
					}),
					/* @__PURE__ */ jsx("h3", {
						className: "text-2xl sm:text-3xl lg:text-4xl font-['Antonio',_'Bebas_Neue',_'Syne',_sans-serif] uppercase tracking-wide text-neutral-100 font-bold",
						children: "We can help you with"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-xs sm:text-sm font-sans text-neutral-400 mt-2 font-normal",
						children: "Check out some of my projects by area of expertise"
					})
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "py-2.5 overflow-hidden border-y border-white/5 bg-black/20",
				children: /* @__PURE__ */ jsx(motion.div, {
					style: { x: xRow1 },
					className: "flex items-center whitespace-nowrap will-change-transform",
					children: [...row1Items, ...row1Items].map((item, idx) => /* @__PURE__ */ jsxs("div", {
						className: "flex items-center",
						children: [/* @__PURE__ */ jsx("span", { className: "inline-block w-4 h-4 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full bg-[#ff5e36] shrink-0 mx-4 sm:mx-8 shadow-[0_0_18px_rgba(255,94,54,0.7)]" }), /* @__PURE__ */ jsx("span", {
							onClick: () => setIsDrawerOpen(true),
							className: "font-['Antonio',_'Bebas_Neue',_'Syne',_sans-serif] uppercase font-bold text-5xl sm:text-7xl md:text-8xl lg:text-[110px] xl:text-[130px] text-white tracking-tight leading-none hover:text-[#ff5e36] transition-colors cursor-pointer",
							children: item
						})]
					}, `r1-${idx}`))
				})
			}),
			/* @__PURE__ */ jsx("div", {
				className: "relative my-8 sm:my-10 flex items-center justify-center border-t border-white/10 w-full px-4",
				children: /* @__PURE__ */ jsxs("button", {
					type: "button",
					onClick: () => setIsDrawerOpen((prev) => !prev),
					className: "absolute bg-[#090a0d] px-6 sm:px-8 py-2.5 rounded-full border border-white/15 hover:border-[#d4ff00] text-neutral-300 hover:text-[#d4ff00] text-xs sm:text-sm font-sans transition-all duration-300 inline-flex items-center gap-2.5 cursor-pointer shadow-lg group hover:shadow-[0_0_20px_rgba(212,255,0,0.25)] select-none",
					"aria-expanded": isDrawerOpen,
					"aria-controls": "services-tray",
					children: [/* @__PURE__ */ jsx("span", {
						className: "tracking-wide",
						children: "Click to view Services"
					}), /* @__PURE__ */ jsx(ChevronDown, { className: `w-4 h-4 transition-transform duration-300 ${isDrawerOpen ? "rotate-180 text-[#d4ff00]" : "text-neutral-400 group-hover:text-[#d4ff00]"}` })]
				})
			}),
			/* @__PURE__ */ jsx("div", {
				className: "py-2.5 overflow-hidden border-y border-white/5 bg-black/30",
				children: /* @__PURE__ */ jsx(motion.div, {
					style: { x: xRow2 },
					className: "flex items-center whitespace-nowrap will-change-transform",
					children: [...row2Items, ...row2Items].map((item, idx) => /* @__PURE__ */ jsxs("div", {
						className: "flex items-center",
						children: [/* @__PURE__ */ jsx("span", { className: "inline-block w-4 h-4 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full bg-[#00e5a3] shrink-0 mx-4 sm:mx-8 shadow-[0_0_18px_rgba(0,229,163,0.7)]" }), /* @__PURE__ */ jsx("span", {
							onClick: () => setIsDrawerOpen(true),
							className: "font-['Antonio',_'Bebas_Neue',_'Syne',_sans-serif] uppercase font-bold text-5xl sm:text-7xl md:text-8xl lg:text-[110px] xl:text-[130px] text-white tracking-tight leading-none hover:text-[#00e5a3] transition-colors cursor-pointer",
							children: item
						})]
					}, `r2-${idx}`))
				})
			}),
			/* @__PURE__ */ jsx("div", {
				className: "py-2.5 overflow-hidden border-b border-white/5 bg-black/20",
				children: /* @__PURE__ */ jsx(motion.div, {
					style: { x: xRow3 },
					className: "flex items-center whitespace-nowrap will-change-transform",
					children: [...row3Items, ...row3Items].map((item, idx) => /* @__PURE__ */ jsxs("div", {
						className: "flex items-center",
						children: [/* @__PURE__ */ jsx("span", { className: "inline-block w-4 h-4 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full bg-[#ffd000] shrink-0 mx-4 sm:mx-8 shadow-[0_0_18px_rgba(255,208,0,0.7)]" }), /* @__PURE__ */ jsx("span", {
							onClick: () => setIsDrawerOpen(true),
							className: "font-['Antonio',_'Bebas_Neue',_'Syne',_sans-serif] uppercase font-bold text-5xl sm:text-7xl md:text-8xl lg:text-[110px] xl:text-[130px] text-white tracking-tight leading-none hover:text-[#ffd000] transition-colors cursor-pointer",
							children: item
						})]
					}, `r3-${idx}`))
				})
			}),
			/* @__PURE__ */ jsx("div", {
				className: "py-2.5 overflow-hidden border-b border-white/5 bg-black/40",
				children: /* @__PURE__ */ jsx(motion.div, {
					style: { x: xRow4 },
					className: "flex items-center whitespace-nowrap will-change-transform",
					children: [...row4Items, ...row4Items].map((item, idx) => /* @__PURE__ */ jsxs("div", {
						className: "flex items-center",
						children: [/* @__PURE__ */ jsx("span", { className: "inline-block w-4 h-4 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full bg-[#ff3b80] shrink-0 mx-4 sm:mx-8 shadow-[0_0_18px_rgba(255,59,128,0.7)]" }), /* @__PURE__ */ jsx("span", {
							onClick: () => setIsDrawerOpen(true),
							className: "font-['Antonio',_'Bebas_Neue',_'Syne',_sans-serif] uppercase font-bold text-5xl sm:text-7xl md:text-8xl lg:text-[110px] xl:text-[130px] text-white tracking-tight leading-none hover:text-[#ff3b80] transition-colors cursor-pointer",
							children: item
						})]
					}, `r4-${idx}`))
				})
			}),
			/* @__PURE__ */ jsx(AnimatePresence, { children: isDrawerOpen && /* @__PURE__ */ jsx(motion.div, {
				id: "services-tray",
				initial: {
					opacity: 0,
					height: 0
				},
				animate: {
					opacity: 1,
					height: "auto"
				},
				exit: {
					opacity: 0,
					height: 0
				},
				transition: {
					duration: .45,
					ease: [
						.16,
						1,
						.3,
						1
					]
				},
				className: "overflow-hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16",
				children: /* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-1 md:grid-cols-2 gap-6",
					children: services.map((service, idx) => {
						const IconComponent = iconMap[service.icon] || Layers;
						const padIndex = String(idx + 1).padStart(2, "0");
						return /* @__PURE__ */ jsxs("article", {
							className: "p-8 sm:p-10 rounded-3xl bg-[#11131a] border border-white/10 hover:border-[#d4ff00]/40 transition-all duration-300 flex flex-col justify-between group shadow-xl",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "space-y-4",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ jsxs("span", {
											className: "font-mono text-xs uppercase tracking-widest text-neutral-500 group-hover:text-[#d4ff00] transition-colors",
											children: [
												"[ ",
												padIndex,
												" // DISCIPLINE ]"
											]
										}), /* @__PURE__ */ jsx("div", {
											className: "w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#d4ff00] group-hover:bg-[#d4ff00] group-hover:text-black transition-colors",
											children: /* @__PURE__ */ jsx(IconComponent, { className: "w-5 h-5" })
										})]
									}),
									/* @__PURE__ */ jsx("h4", {
										className: "text-3xl sm:text-4xl font-['Antonio',_'Bebas_Neue',_sans-serif] uppercase font-bold text-white group-hover:text-[#d4ff00] transition-colors",
										children: service.title
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-neutral-400 text-sm leading-relaxed font-sans",
										children: service.description
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "pt-2",
										children: [/* @__PURE__ */ jsx("span", {
											className: "font-mono text-[10px] uppercase tracking-widest text-neutral-500 block mb-2",
											children: "Deliverables:"
										}), /* @__PURE__ */ jsx("div", {
											className: "flex flex-wrap gap-2",
											children: service.deliverables?.map((deliv, dIdx) => /* @__PURE__ */ jsxs("span", {
												className: "text-xs font-mono uppercase tracking-wider text-neutral-300 bg-black/40 border border-white/10 px-3 py-1 rounded-md",
												children: ["● ", deliv]
											}, dIdx))
										})]
									})
								]
							}), /* @__PURE__ */ jsxs("div", {
								className: "pt-8 flex items-center justify-between border-t border-white/10 mt-6",
								children: [/* @__PURE__ */ jsx("span", {
									className: "font-mono text-xs uppercase tracking-wider text-neutral-400",
									children: service.marquee_label
								}), /* @__PURE__ */ jsxs(Link, {
									href: `/services/${service.slug}`,
									className: "inline-flex items-center gap-2 font-['Antonio',_'Bebas_Neue',_sans-serif] text-sm uppercase tracking-wider font-bold text-black bg-[#d4ff00] hover:bg-[#c2eb00] px-5 py-2.5 rounded-full transition-all duration-300 shadow-md hover:shadow-[0_0_18px_rgba(212,255,0,0.4)]",
									children: [/* @__PURE__ */ jsx("span", { children: "Deep Dive" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4 stroke-[2.5]" })]
								})]
							})]
						}, service.id || service.slug);
					})
				})
			}) }),
			/* @__PURE__ */ jsxs("div", {
				ref: bannerRef,
				className: "relative w-full h-[450px] sm:h-[600px] lg:h-[750px] overflow-hidden mt-16 sm:mt-24 border-t-8 border-[#ff5e36]",
				children: [
					/* @__PURE__ */ jsx(motion.div, {
						style: { y: bannerImgY },
						className: "absolute inset-x-0 -top-24 -bottom-24 w-full h-[125%]",
						children: /* @__PURE__ */ jsx("img", {
							src: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=2200&q=85",
							alt: "Agntix Design Studio Creative Vanguard",
							className: "w-full h-full object-cover object-center filter brightness-90 contrast-110",
							loading: "lazy"
						})
					}),
					/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" }),
					/* @__PURE__ */ jsx("div", {
						className: "absolute bottom-8 right-8 z-10 hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs font-mono uppercase tracking-widest text-[#d4ff00]",
						children: /* @__PURE__ */ jsx("span", { children: "[ SPATIAL VISIONS // ARCHIVED ]" })
					})
				]
			})
		]
	});
}
//#endregion
//#region resources/js/Components/Home/StatsGrid.tsx
function FunFactRow({ value, suffix = "", badge, title, subtitle }) {
	const [count, setCount] = useState(0);
	const rowRef = useRef(null);
	const isInView = useInView(rowRef, {
		once: true,
		margin: "-10% 0px"
	});
	useEffect(() => {
		if (!isInView) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			setCount(value);
			return;
		}
		const duration = 2e3;
		const startTime = performance.now();
		const animate = (currentTime) => {
			const elapsed = currentTime - startTime;
			const progress = Math.min(elapsed / duration, 1);
			const eased = 1 - Math.pow(1 - progress, 5);
			const currentVal = Math.floor(eased * value);
			setCount(currentVal);
			if (progress < 1) requestAnimationFrame(animate);
			else setCount(value);
		};
		requestAnimationFrame(animate);
	}, [isInView, value]);
	return /* @__PURE__ */ jsxs("div", {
		ref: rowRef,
		className: "group py-10 sm:py-14 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-colors duration-300 hover:border-white/25",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-baseline",
			children: [/* @__PURE__ */ jsx("span", {
				className: "font-['Antonio',_'Bebas_Neue',_'Syne',_sans-serif] text-7xl sm:text-8xl lg:text-[110px] xl:text-[125px] font-bold tracking-tight text-white leading-none select-none group-hover:text-[#d4ff00] transition-colors tabular-nums",
				children: count
			}), suffix && /* @__PURE__ */ jsx("span", {
				className: "font-['Antonio',_'Bebas_Neue',_'Syne',_sans-serif] text-5xl sm:text-6xl lg:text-8xl font-bold text-[#d4ff00] leading-none ml-1 select-none",
				children: suffix
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "sm:text-right space-y-2.5",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-widest text-[#d4ff00]",
					children: /* @__PURE__ */ jsx("span", { children: badge })
				}),
				/* @__PURE__ */ jsx("h3", {
					className: "text-2xl sm:text-3xl lg:text-4xl font-['Antonio',_'Bebas_Neue',_'Syne',_sans-serif] uppercase font-bold text-neutral-200 group-hover:text-white transition-colors tracking-tight leading-tight",
					children: title
				}),
				subtitle && /* @__PURE__ */ jsx("p", {
					className: "text-xs sm:text-sm font-sans text-neutral-400 font-normal max-w-sm sm:ml-auto",
					children: subtitle
				})
			]
		})]
	});
}
function StatsGrid() {
	return /* @__PURE__ */ jsxs("section", {
		id: "fun-facts-section",
		className: "relative py-28 sm:py-36 bg-[#090a0d] border-t border-white/10 overflow-hidden select-none",
		children: [
			/* @__PURE__ */ jsx("div", { className: "absolute top-1/3 left-10 w-[40rem] h-[40rem] bg-[#d4ff00]/5 rounded-full blur-[200px] pointer-events-none" }),
			/* @__PURE__ */ jsx("div", { className: "absolute bottom-10 right-10 w-[35rem] h-[35rem] bg-[#ff5e36]/5 rounded-full blur-[200px] pointer-events-none" }),
			/* @__PURE__ */ jsx("div", {
				className: "w-full max-w-[96%] xl:max-w-[1560px] 2xl:max-w-[1750px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10",
				children: /* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "lg:col-span-5 lg:sticky lg:top-32 space-y-6",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-widest text-[#d4ff00]",
								children: [/* @__PURE__ */ jsx(Sparkles, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Fun Facts" })]
							}),
							/* @__PURE__ */ jsx("h2", {
								className: "text-5xl sm:text-6xl md:text-7xl lg:text-[76px] xl:text-[88px] font-['Antonio',_'Bebas_Neue',_'Syne',_sans-serif] uppercase font-bold text-white tracking-tight leading-[0.95]",
								children: "Numbers that Speak Volumes"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-base sm:text-lg text-neutral-400 font-sans leading-relaxed pt-2 max-w-lg",
								children: "We are a team of passionate and crazy individuals dedicated to bringing your ideas to life. With a keen eye for aesthetics, attention to detail, & a deep understanding of design principles, we strive to deliver exceptional results that exceed your expectations!"
							}),
							/* @__PURE__ */ jsx("div", {
								className: "pt-4",
								children: /* @__PURE__ */ jsxs("a", {
									href: "#site-footer",
									className: "group inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 bg-white/5 hover:bg-[#d4ff00] hover:text-black hover:border-[#d4ff00] text-xs font-mono uppercase tracking-widest text-white transition-all duration-300",
									children: [/* @__PURE__ */ jsx("span", { children: "Start A Conversation" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" })]
								})
							})
						]
					}), /* @__PURE__ */ jsx("div", {
						className: "lg:col-span-7 divide-y divide-white/10",
						children: [
							{
								value: 120,
								suffix: "+",
								badge: "[ Nice! ]",
								title: "Projects Completed",
								subtitle: "Delivered across North America, Europe, and Asia-Pacific."
							},
							{
								value: 16,
								suffix: "+",
								badge: "[ Holy Moly! ]",
								title: "Years of Experience",
								subtitle: "Proven track record of high-stakes digital craftsmanship."
							},
							{
								value: 185,
								suffix: "%",
								badge: "[ Ho Ho! ]",
								title: "Growing Agency",
								subtitle: "Year-over-year client recurring revenue acceleration."
							}
						].map((stat, idx) => /* @__PURE__ */ jsx(FunFactRow, { ...stat }, idx))
					})]
				})
			})
		]
	});
}
//#endregion
//#region resources/js/Components/UI/Marquee.tsx
function Marquee({ children, direction = "left", speed = "normal", pauseOnHover = true, className = "" }) {
	const speedClass = {
		slow: "duration-[45s]",
		normal: "duration-[28s]",
		fast: "duration-[16s]"
	}[speed];
	const animationClass = direction === "left" ? "animate-marquee-left" : "animate-marquee-right";
	return /* @__PURE__ */ jsxs("div", {
		className: `marquee-container relative flex overflow-hidden select-none ${pauseOnHover ? "hover:[&_.marquee-track]:[animation-play-state:paused]" : ""} ${className}`,
		children: [/* @__PURE__ */ jsxs("div", {
			className: `marquee-track flex shrink-0 items-center gap-8 ${animationClass} ${speedClass}`,
			style: { willChange: "transform" },
			children: [children, children]
		}), /* @__PURE__ */ jsxs("div", {
			"aria-hidden": "true",
			className: `marquee-track flex shrink-0 items-center gap-8 ${animationClass} ${speedClass}`,
			style: { willChange: "transform" },
			children: [children, children]
		})]
	});
}
//#endregion
//#region resources/js/Components/Home/ClientMarquees.tsx
function ClientMarquees({ clients }) {
	return /* @__PURE__ */ jsxs("section", {
		id: "collaborators-section",
		className: "relative py-28 sm:py-36 bg-[#090a0d] border-t border-white/10 overflow-hidden select-none",
		children: [
			/* @__PURE__ */ jsx("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[25rem] bg-[#d4ff00]/5 rounded-full blur-[190px] pointer-events-none" }),
			/* @__PURE__ */ jsxs("div", {
				className: "w-full max-w-[96%] xl:max-w-[1560px] 2xl:max-w-[1750px] mx-auto px-4 sm:px-8 mb-16 text-center",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-widest text-[#d4ff00] mb-4",
						children: [/* @__PURE__ */ jsx(Sparkles, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "[ COLLABORATORS ]" })]
					}),
					/* @__PURE__ */ jsx("h2", {
						className: "text-4xl sm:text-6xl lg:text-7xl font-['Antonio',_'Bebas_Neue',_'Syne',_sans-serif] uppercase font-bold text-white tracking-tight leading-none",
						children: "Collaborators"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-3 text-sm text-neutral-400 font-sans max-w-xl mx-auto",
						children: "Powering visionary startups and global leaders with high-conviction creative engineering."
					})
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "py-3.5 border-y border-white/5 bg-black/20",
				children: /* @__PURE__ */ jsx(Marquee, {
					direction: "left",
					speed: "normal",
					pauseOnHover: true,
					children: [
						{
							name: "VERTEX LABS",
							symbol: "▲",
							industry: "Autonomous AI"
						},
						{
							name: "NEBULA PAY",
							symbol: "◈",
							industry: "Fintech Protocol"
						},
						{
							name: "CHRONOS DYNAMICS",
							symbol: "⧖",
							industry: "Aerospace"
						},
						{
							name: "SYNAPSE BIO",
							symbol: "◎",
							industry: "Neuroscience"
						},
						{
							name: "STRATA CLOUD",
							symbol: "◼",
							industry: "Infrastructure"
						},
						{
							name: "VALENCE ENERGY",
							symbol: "⚡",
							industry: "Clean Power"
						}
					].map((item, index) => /* @__PURE__ */ jsxs("div", {
						className: "group flex items-center gap-4 px-8 py-4 mx-3 rounded-2xl border border-white/10 bg-white/[0.03] hover:border-[#d4ff00]/50 hover:bg-white/[0.06] transition-all duration-300 cursor-default",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-2xl text-[#d4ff00] group-hover:scale-125 transition-transform duration-300",
							children: item.symbol
						}), /* @__PURE__ */ jsxs("div", {
							className: "text-left",
							children: [/* @__PURE__ */ jsx("span", {
								className: "font-['Antonio',_'Bebas_Neue',_sans-serif] font-bold text-xl sm:text-2xl tracking-wider text-neutral-200 group-hover:text-white transition-colors block leading-tight",
								children: item.name
							}), /* @__PURE__ */ jsx("span", {
								className: "font-mono text-[10px] text-neutral-500 uppercase tracking-widest block",
								children: item.industry
							})]
						})]
					}, index))
				})
			}),
			/* @__PURE__ */ jsx("div", {
				className: "py-3.5 border-b border-white/5 bg-black/40 mt-4",
				children: /* @__PURE__ */ jsx(Marquee, {
					direction: "right",
					speed: "normal",
					pauseOnHover: true,
					children: [
						{
							name: "HYPERION AUDIO",
							symbol: "◆",
							industry: "Acoustic Hardware"
						},
						{
							name: "QUANTUM OS",
							symbol: "❖",
							industry: "Compute Platform"
						},
						{
							name: "ORBITAL VENTURES",
							symbol: "●",
							industry: "Seed Capital"
						},
						{
							name: "PULSE ROBOTICS",
							symbol: "✦",
							industry: "Industrial Tech"
						},
						{
							name: "AETHER APPAREL",
							symbol: "⬡",
							industry: "Performance Gear"
						},
						{
							name: "SONAR CRYPTO",
							symbol: "◇",
							industry: "Decentralized Tech"
						}
					].map((item, index) => /* @__PURE__ */ jsxs("div", {
						className: "group flex items-center gap-4 px-8 py-4 mx-3 rounded-2xl border border-white/10 bg-white/[0.03] hover:border-[#d4ff00]/50 hover:bg-white/[0.06] transition-all duration-300 cursor-default",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-2xl text-[#d4ff00] group-hover:scale-125 transition-transform duration-300",
							children: item.symbol
						}), /* @__PURE__ */ jsxs("div", {
							className: "text-left",
							children: [/* @__PURE__ */ jsx("span", {
								className: "font-['Antonio',_'Bebas_Neue',_sans-serif] font-bold text-xl sm:text-2xl tracking-wider text-neutral-200 group-hover:text-white transition-colors block leading-tight",
								children: item.name
							}), /* @__PURE__ */ jsx("span", {
								className: "font-mono text-[10px] text-neutral-500 uppercase tracking-widest block",
								children: item.industry
							})]
						})]
					}, index))
				})
			})
		]
	});
}
//#endregion
//#region resources/js/Components/Home/TeamPreview.tsx
function TeamPreview({ members }) {
	const displayMembers = members && members.length >= 4 ? members : [
		{
			id: 1,
			name: "Logan Dang",
			slug: "logan-dang",
			role: "CEO Founder",
			since_year: "2009",
			avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
		},
		{
			id: 2,
			name: "Rahat Chowhury",
			slug: "rahat-chowhury",
			role: "Web Designer",
			since_year: "2004",
			avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80"
		},
		{
			id: 3,
			name: "Thomas Finlan",
			slug: "thomas-finlan",
			role: "Marketing Director",
			since_year: "2012",
			avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80"
		},
		{
			id: 4,
			name: "Farhan Firoz",
			slug: "farhan-firoz",
			role: "UI/UX Designer",
			since_year: "2010",
			avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80"
		},
		{
			id: 5,
			name: "Billy Craft",
			slug: "billy-craft",
			role: "Motion Designer",
			since_year: "2016",
			avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80"
		}
	];
	const [hoveredMember, setHoveredMember] = useState(null);
	const [cursorPos, setCursorPos] = useState({
		x: 0,
		y: 0
	});
	const sectionRef = useRef(null);
	const handleMouseMove = (e) => {
		if (!sectionRef.current) return;
		const rect = sectionRef.current.getBoundingClientRect();
		setCursorPos({
			x: e.clientX - rect.left,
			y: e.clientY - rect.top
		});
	};
	return /* @__PURE__ */ jsxs("section", {
		ref: sectionRef,
		onMouseMove: handleMouseMove,
		onMouseLeave: () => setHoveredMember(null),
		className: "relative py-28 sm:py-36 bg-[#090a0d] border-t border-white/10 overflow-hidden select-none",
		children: [
			/* @__PURE__ */ jsx("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[30rem] bg-[#d4ff00]/5 rounded-full blur-[200px] pointer-events-none" }),
			/* @__PURE__ */ jsxs("div", {
				className: "w-full max-w-[96%] xl:max-w-[1560px] 2xl:max-w-[1750px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-white/10 gap-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "space-y-3",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-widest text-[#d4ff00]",
							children: [/* @__PURE__ */ jsx(Sparkles, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "[ 05 // LEADERSHIP VANGUARD ]" })]
						}), /* @__PURE__ */ jsx("h2", {
							className: "text-4xl sm:text-6xl lg:text-7xl font-['Antonio',_'Bebas_Neue',_'Syne',_sans-serif] uppercase font-bold text-white tracking-tight leading-none",
							children: "Passionate Minds Behind the Studio"
						})]
					}), /* @__PURE__ */ jsxs(Link, {
						href: "/team",
						className: "group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-widest text-neutral-300 hover:text-black hover:bg-[#d4ff00] hover:border-[#d4ff00] transition-all duration-300 shadow-sm",
						children: [/* @__PURE__ */ jsx("span", { children: "Meet All Collective (12+)" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" })]
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "divide-y divide-white/10 relative",
					children: displayMembers.slice(0, 5).map((member) => /* @__PURE__ */ jsxs(Link, {
						href: `/team/${member.slug}`,
						onMouseEnter: () => setHoveredMember(member),
						className: "group py-10 sm:py-14 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors duration-300 cursor-pointer block relative",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "sm:w-1/4",
								children: /* @__PURE__ */ jsxs("span", {
									className: "font-mono text-xs sm:text-sm text-neutral-500 group-hover:text-[#d4ff00] transition-colors uppercase tracking-widest",
									children: ["Since ", member.since_year || "2009"]
								})
							}),
							/* @__PURE__ */ jsx("div", {
								className: "sm:w-2/4 text-left sm:text-center",
								children: /* @__PURE__ */ jsx("h3", {
									className: "font-['Antonio',_'Bebas_Neue',_'Syne',_sans-serif] text-5xl sm:text-7xl lg:text-[84px] xl:text-[96px] font-bold uppercase tracking-tight text-neutral-300 group-hover:text-white transition-all duration-300 group-hover:scale-[1.02] inline-block leading-none",
									children: member.name
								})
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "sm:w-1/4 flex sm:justify-end items-center gap-3",
								children: [/* @__PURE__ */ jsx("span", {
									className: "font-mono text-xs sm:text-sm text-neutral-400 group-hover:text-neutral-200 transition-colors uppercase tracking-wider",
									children: member.role
								}), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4 text-neutral-600 group-hover:text-[#d4ff00] transition-colors hidden sm:inline-block" })]
							})
						]
					}, member.id || member.slug))
				})]
			}),
			/* @__PURE__ */ jsx(AnimatePresence, { children: hoveredMember && /* @__PURE__ */ jsx(motion.div, {
				initial: {
					opacity: 0,
					scale: .4
				},
				animate: {
					opacity: 1,
					scale: 1,
					x: cursorPos.x - 150,
					y: cursorPos.y - 200
				},
				exit: {
					opacity: 0,
					scale: .4
				},
				transition: {
					type: "spring",
					stiffness: 280,
					damping: 24,
					mass: .45
				},
				className: "pointer-events-none absolute top-0 left-0 z-40 hidden md:block",
				children: /* @__PURE__ */ jsxs("div", {
					className: "w-[300px] h-[400px] rounded-2xl overflow-hidden border border-white/20 bg-neutral-900 shadow-[0_30px_70px_rgba(0,0,0,0.95)] backdrop-blur-md relative",
					children: [
						/* @__PURE__ */ jsx("img", {
							src: hoveredMember.avatar,
							alt: hoveredMember.name,
							className: "w-full h-full object-cover grayscale contrast-125 brightness-95"
						}),
						/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" }),
						/* @__PURE__ */ jsx("div", {
							className: "absolute bottom-4 left-4 right-4 text-center",
							children: /* @__PURE__ */ jsx("span", {
								className: "font-mono text-xs uppercase tracking-widest text-[#d4ff00] font-semibold",
								children: "View Full Dossier →"
							})
						})
					]
				})
			}) })
		]
	});
}
//#endregion
//#region resources/js/Components/Home/RecentWorkShowcase.tsx
function RecentWorkShowcase({ projects }) {
	const sectionRef = useRef(null);
	const { scrollYProgress: sectionScroll } = useScroll({
		target: sectionRef,
		offset: ["start end", "end start"]
	});
	const recentX = useTransform(sectionScroll, [0, 1], [-80, 80]);
	const items = [
		{
			id: 1,
			title: "automap",
			subtitle: "Research, UX, UI Design",
			category: "Spatial Telemetry & Autonomous Mobility",
			year: "2026",
			deliverables: [
				"Spatial OS",
				"Real-Time Telemetry",
				"3D WebGL Interface"
			],
			image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=85",
			slug: "automap",
			accent: "#00f5ff"
		},
		{
			id: 2,
			title: "kashtech\ndoyel",
			subtitle: "Fintech Protocol, UX, UI Design",
			category: "Algorithmic Financial Infrastructure",
			year: "2025",
			deliverables: [
				"Design Architecture",
				"Biometric App",
				"High-Frequency UX"
			],
			image: "https://images.unsplash.com/photo-1546776310-eef45dd6d63c?auto=format&fit=crop&w=1200&q=85",
			slug: "kashtech-doyel",
			accent: "#d4ff00"
		},
		{
			id: 3,
			title: "rebrand",
			subtitle: "Brand Strategy, Visual Identity",
			category: "Luxury Acoustic & Spatial Computing",
			year: "2025",
			deliverables: [
				"Generative Identity",
				"Packaging System",
				"Sound Architecture"
			],
			image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=85",
			slug: "rebrand",
			accent: "#ff5e36"
		},
		{
			id: 4,
			title: "vortex\nspatial",
			subtitle: "WebGL Shaders, 3D Direction",
			category: "Autonomous Deep Ocean Telemetry",
			year: "2026",
			deliverables: [
				"GPU Shaders",
				"Volumetric Shaders",
				"Interactive Canvas"
			],
			image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=85",
			slug: "vortex-spatial",
			accent: "#a855f7"
		}
	].map((item, idx) => {
		if (projects && projects[idx]) {
			const p = projects[idx];
			return {
				...item,
				title: p.title.toLowerCase(),
				subtitle: p.deliverables?.slice(0, 3).join(", ") || item.subtitle,
				category: p.category?.name || item.category,
				year: p.year || item.year,
				deliverables: p.deliverables || item.deliverables,
				image: p.cover_image || item.image,
				slug: p.slug || item.slug
			};
		}
		return item;
	});
	return /* @__PURE__ */ jsxs("section", {
		ref: sectionRef,
		className: "relative py-28 sm:py-36 lg:py-44 bg-[#08090b] text-white overflow-hidden border-t border-white/10",
		children: [
			/* @__PURE__ */ jsx("div", { className: "absolute top-1/4 right-0 w-[55rem] h-[55rem] bg-[#00f5ff]/5 rounded-full blur-[220px] pointer-events-none" }),
			/* @__PURE__ */ jsx("div", { className: "absolute bottom-1/4 left-0 w-[50rem] h-[50rem] bg-[#d4ff00]/5 rounded-full blur-[200px] pointer-events-none" }),
			/* @__PURE__ */ jsxs("div", {
				className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col lg:flex-row lg:items-end justify-between mb-24 sm:mb-32 lg:mb-40 gap-8",
					children: [/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsxs("div", {
							className: "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-widest text-[#00f5ff] mb-6",
							children: [/* @__PURE__ */ jsx(Sparkles, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "[ 02 // RECENT COMMISSIONS ]" })]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "overflow-visible select-none",
							children: /* @__PURE__ */ jsxs("h2", {
								className: "text-6xl sm:text-8xl lg:text-[9.5rem] font-['Antonio',_'Bebas_Neue',_sans-serif] uppercase font-bold text-white tracking-tighter leading-[0.88]",
								children: [/* @__PURE__ */ jsx(motion.span, {
									style: { x: recentX },
									className: "block whitespace-nowrap will-change-transform text-white/90",
									children: "RECENT"
								}), /* @__PURE__ */ jsxs("span", {
									className: "inline-flex items-center whitespace-nowrap text-[#e0eeee]",
									children: [/* @__PURE__ */ jsx("span", { children: "WOR" }), /* @__PURE__ */ jsx("span", {
										className: "inline-flex items-center relative text-white",
										children: /* @__PURE__ */ jsxs("svg", {
											viewBox: "0 0 78 95",
											fill: "currentColor",
											className: "inline-block h-[0.84em] w-auto align-baseline fill-current text-white -ml-0.5",
											"aria-label": "K",
											children: [
												/* @__PURE__ */ jsx("rect", {
													x: "0",
													y: "0",
													width: "18",
													height: "95"
												}),
												/* @__PURE__ */ jsx("polygon", { points: "18,48 55,0 78,0 35,52" }),
												/* @__PURE__ */ jsx("polygon", { points: "32,48 76,55 58,68 78,95 56,95 40,74 24,76 18,52" })
											]
										})
									})]
								})]
							})
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-lg sm:text-2xl text-neutral-400 font-medium max-w-sm mt-8 leading-snug tracking-tight",
							children: "In the creative wilderness, clients find our work truly beloved."
						})
					] }), /* @__PURE__ */ jsx("div", {
						className: "lg:pb-4",
						children: /* @__PURE__ */ jsxs(Link, {
							href: "/work",
							className: "inline-flex items-center gap-3 px-8 py-4 rounded-full border border-white/20 text-xs sm:text-sm font-mono uppercase tracking-widest text-white hover:bg-white hover:text-black hover:border-white transition-all duration-300 group shadow-lg",
							children: [/* @__PURE__ */ jsx("span", { children: "Explore work" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" })]
						})
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "space-y-28 sm:space-y-36 lg:space-y-48",
					children: items.map((item, index) => {
						const isEven = index % 2 === 1;
						return /* @__PURE__ */ jsx(ShowcaseRow, {
							item,
							isEven,
							index
						}, item.id);
					})
				})]
			})
		]
	});
}
function ShowcaseRow({ item, isEven, index }) {
	const rowRef = useRef(null);
	const [mousePos, setMousePos] = useState({
		x: .5,
		y: .5
	});
	const [isHovered, setIsHovered] = useState(false);
	const { scrollYProgress } = useScroll({
		target: rowRef,
		offset: ["start end", "center center"]
	});
	const initialX = isEven ? -360 : 360;
	const initialRot = isEven ? -10 : 10;
	const scrollX = useTransform(scrollYProgress, [0, 1], [initialX, 0]);
	const scrollRotate = useTransform(scrollYProgress, [0, 1], [initialRot, 0]);
	const handleMouseMove = (e) => {
		const rect = e.currentTarget.getBoundingClientRect();
		const x = (e.clientX - rect.left) / rect.width;
		const y = (e.clientY - rect.top) / rect.height;
		setMousePos({
			x,
			y
		});
	};
	const tiltX = isHovered ? (mousePos.y - .5) * -12 : 0;
	const tiltY = isHovered ? (mousePos.x - .5) * 12 : 0;
	return /* @__PURE__ */ jsxs("div", {
		ref: rowRef,
		className: "grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center",
		children: [/* @__PURE__ */ jsxs("div", {
			className: `order-2 ${isEven ? "lg:col-span-5 lg:order-2 lg:pl-8" : "lg:col-span-5 lg:order-1 lg:pr-8"} space-y-6`,
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ jsxs("span", {
							className: "font-mono text-xs text-neutral-400 uppercase tracking-widest block",
							children: [
								"[ Case Study 0",
								index + 1,
								" // ",
								item.year,
								" ]"
							]
						}),
						/* @__PURE__ */ jsx("h3", {
							className: "text-5xl sm:text-7xl lg:text-[5rem] font-['Antonio',_'Bebas_Neue',_sans-serif] font-normal text-[#e0eeee] hover:text-white transition-colors lowercase leading-[0.9] tracking-tight whitespace-pre-line",
							children: /* @__PURE__ */ jsx(Link, {
								href: `/work/${item.slug}`,
								children: item.title
							})
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-xl sm:text-2xl font-medium text-neutral-300 tracking-tight pt-1",
							children: item.subtitle
						}),
						/* @__PURE__ */ jsxs("p", {
							className: "text-sm sm:text-base text-neutral-400 font-normal leading-relaxed max-w-md pt-2",
							children: [item.category, ". Engineered with precision architecture and kinetic interactivity."]
						})
					]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "flex flex-wrap gap-2 pt-2 pb-4",
					children: item.deliverables.map((deliv, dIdx) => /* @__PURE__ */ jsx("span", {
						className: "px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-wider text-neutral-300",
						children: deliv
					}, dIdx))
				}),
				/* @__PURE__ */ jsx("div", {
					className: "pt-2",
					children: /* @__PURE__ */ jsxs(Link, {
						href: `/work/${item.slug}`,
						className: "inline-flex items-center gap-2.5 px-7 py-3 rounded-full border border-sky-400/40 text-xs font-mono uppercase tracking-widest text-sky-300 hover:bg-sky-400 hover:text-black hover:border-sky-400 transition-all duration-300 group",
						children: [/* @__PURE__ */ jsx("span", { children: "View project" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-3.5 h-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" })]
					})
				})
			]
		}), /* @__PURE__ */ jsx("div", {
			className: `order-1 ${isEven ? "lg:col-span-7 lg:order-1" : "lg:col-span-7 lg:order-2"}`,
			children: /* @__PURE__ */ jsx(motion.div, {
				style: {
					x: scrollX,
					rotate: scrollRotate
				},
				className: "w-full will-change-transform",
				children: /* @__PURE__ */ jsx(motion.div, {
					onMouseMove: handleMouseMove,
					onMouseEnter: () => setIsHovered(true),
					onMouseLeave: () => {
						setIsHovered(false);
						setMousePos({
							x: .5,
							y: .5
						});
					},
					animate: {
						rotateX: tiltX,
						rotateY: tiltY,
						scale: isHovered ? 1.02 : 1
					},
					transition: {
						type: "spring",
						stiffness: 280,
						damping: 24
					},
					style: { transformStyle: "preserve-3d" },
					className: "relative rounded-[28px] sm:rounded-[36px] overflow-hidden border border-white/15 bg-neutral-900 shadow-[0_30px_80px_rgba(0,0,0,0.85)] group cursor-pointer select-none",
					children: /* @__PURE__ */ jsxs(Link, {
						href: `/work/${item.slug}`,
						className: "block relative aspect-[16/11] w-full overflow-hidden",
						children: [
							/* @__PURE__ */ jsx("img", {
								src: item.image,
								alt: item.title,
								className: "w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-106 will-change-transform"
							}),
							/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-25 transition-opacity duration-500" }),
							/* @__PURE__ */ jsx("div", {
								className: "absolute inset-0 pointer-events-none transition-opacity duration-300",
								style: {
									opacity: isHovered ? .35 : 0,
									background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(255,255,255,0.3) 0%, transparent 60%)`
								}
							}),
							/* @__PURE__ */ jsxs(motion.div, {
								initial: {
									opacity: 0,
									scale: .8
								},
								animate: {
									opacity: isHovered ? 1 : 0,
									scale: isHovered ? 1 : .8
								},
								transition: { duration: .25 },
								className: "absolute bottom-6 right-6 px-4 py-2 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-xs font-mono uppercase tracking-widest text-[#00f5ff] flex items-center gap-2 shadow-2xl",
								children: [/* @__PURE__ */ jsx("span", { children: "Explore Case Study" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-3.5 h-3.5 text-[#00f5ff]" })]
							})
						]
					})
				})
			})
		})]
	});
}
//#endregion
//#region resources/js/Components/Home/TestimonialsSlider.tsx
function TestimonialsSlider({ testimonials }) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const prevSlide = () => {
		setCurrentIndex((prev) => prev === 0 ? testimonials.length - 1 : prev - 1);
	};
	const nextSlide = () => {
		setCurrentIndex((prev) => prev === testimonials.length - 1 ? 0 : prev + 1);
	};
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === "ArrowLeft") prevSlide();
			else if (e.key === "ArrowRight") nextSlide();
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [testimonials.length]);
	if (!testimonials || testimonials.length === 0) return null;
	const current = testimonials[currentIndex];
	return /* @__PURE__ */ jsx("section", {
		className: "relative py-28 bg-[#0c0d12] border-t border-white/10 overflow-hidden",
		"aria-label": "Client Testimonials Carousel",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col sm:flex-row sm:items-end justify-between mb-16 pb-6 border-b border-white/10 gap-6",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
					className: "font-mono text-xs uppercase tracking-widest text-[#d4ff00] block mb-3",
					children: "[ 06 // CLIENT ENDORSEMENTS ]"
				}), /* @__PURE__ */ jsx("h2", {
					className: "text-4xl sm:text-6xl font-display font-extrabold text-white tracking-tight",
					children: "WHAT THEY SAY."
				})] }), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: prevSlide,
						"aria-label": "Previous testimonial",
						className: "p-3.5 rounded-full border border-white/10 hover:border-[#d4ff00] hover:text-[#d4ff00] text-neutral-300 transition-colors",
						children: /* @__PURE__ */ jsx(ArrowLeft, { className: "w-5 h-5" })
					}), /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: nextSlide,
						"aria-label": "Next testimonial",
						className: "p-3.5 rounded-full border border-white/10 hover:border-[#d4ff00] hover:text-[#d4ff00] text-neutral-300 transition-colors",
						children: /* @__PURE__ */ jsx(ArrowRight, { className: "w-5 h-5" })
					})]
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "relative rounded-3xl p-8 sm:p-14 border border-white/10 bg-[#12141c] backdrop-blur-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-500",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between mb-8",
						children: [/* @__PURE__ */ jsx("div", {
							className: "flex items-center gap-1",
							children: [...Array(current.rating || 5)].map((_, i) => /* @__PURE__ */ jsx(Star, { className: "w-4 h-4 fill-[#d4ff00] text-[#d4ff00]" }, i))
						}), /* @__PURE__ */ jsxs("span", {
							className: "font-mono text-xs text-neutral-500",
							children: [
								"0",
								currentIndex + 1,
								" / 0",
								testimonials.length
							]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "relative mb-10",
						children: [/* @__PURE__ */ jsx(Quote, { className: "w-12 h-12 text-[#d4ff00]/20 absolute -top-6 -left-4 -z-10" }), /* @__PURE__ */ jsxs("blockquote", {
							className: "text-xl sm:text-3xl lg:text-4xl font-display font-medium text-white leading-relaxed",
							children: [
								"\"",
								current.quote,
								"\""
							]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between pt-8 border-t border-white/10",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-4",
							children: [current.avatar && /* @__PURE__ */ jsx("img", {
								src: current.avatar,
								alt: current.client_name,
								className: "w-12 h-12 rounded-full object-cover border border-[#d4ff00]/40"
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
								className: "font-display font-bold text-lg text-white",
								children: current.client_name
							}), /* @__PURE__ */ jsxs("p", {
								className: "font-mono text-xs text-neutral-400",
								children: [
									current.client_role,
									" · ",
									/* @__PURE__ */ jsx("span", {
										className: "text-[#d4ff00]",
										children: current.client_company
									})
								]
							})] })]
						}), /* @__PURE__ */ jsx("div", {
							className: "hidden sm:flex items-center gap-2",
							children: testimonials.map((_, dotIdx) => /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setCurrentIndex(dotIdx),
								"aria-label": `Go to slide ${dotIdx + 1}`,
								className: `w-2.5 h-2.5 rounded-full transition-all duration-300 ${dotIdx === currentIndex ? "w-8 bg-[#d4ff00]" : "bg-white/20 hover:bg-white/40"}`
							}, dotIdx))
						})]
					})
				]
			}, currentIndex)]
		})
	});
}
//#endregion
//#region resources/js/Pages/Home.tsx
function Home({ featuredProjects = [], services = [], teamMembers = [], testimonials = [], clients = [] }) {
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(SeoHead, {
			title: "Radical Digital Agency & Creative Engineering",
			description: "CuttingEdger builds high-octane brand systems, kinetic software interfaces, and immersive web platforms for visionary innovators."
		}),
		/* @__PURE__ */ jsx(SplitHero, {}),
		/* @__PURE__ */ jsx(IntroBand, {}),
		/* @__PURE__ */ jsx(StickyWorkCards, { projects: featuredProjects }),
		/* @__PURE__ */ jsx(ServicesList, { services }),
		/* @__PURE__ */ jsx(StatsGrid, {}),
		/* @__PURE__ */ jsx(ClientMarquees, { clients }),
		/* @__PURE__ */ jsx(TeamPreview, { members: teamMembers }),
		/* @__PURE__ */ jsx(RecentWorkShowcase, { projects: featuredProjects }),
		/* @__PURE__ */ jsx(TestimonialsSlider, { testimonials })
	] });
}
//#endregion
export { Home as default };
