import { t as Button } from "../ssr.js";
import { t as SeoHead } from "./SeoHead-CXtfHcil.js";
import { useEffect, useRef, useState } from "react";
import { Link } from "@inertiajs/react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Asterisk, Compass, Cpu, Flame, Layers, Minus, Plus, Quote, Sparkles, Star } from "lucide-react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Components/Home/SplitHero.tsx
function SplitHero({ onOpenContact }) {
	const rotatingWords = [
		"CATEGORY LEADERS",
		"FEARLESS BRANDS",
		"KINETIC PLATFORMS",
		"RADICAL DIGITAL"
	];
	const [currentWordIndex, setCurrentWordIndex] = useState(0);
	const [reducedMotion, setReducedMotion] = useState(false);
	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
		setReducedMotion(mediaQuery.matches);
		if (mediaQuery.matches) return;
		const interval = setInterval(() => {
			setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
		}, 2800);
		return () => clearInterval(interval);
	}, []);
	const reelCards = [
		{
			title: "Kinetix OS",
			category: "Creative Engineering",
			year: "2026",
			color: "from-purple-900/40 via-violet-950/60 to-black",
			accent: "#d4ff00",
			tag: "Featured Flagship"
		},
		{
			title: "Hyperion Audio",
			category: "Brand & 3D Spatial",
			year: "2025",
			color: "from-emerald-950/50 via-teal-950/70 to-black",
			accent: "#00f5ff",
			tag: "Award Winner"
		},
		{
			title: "Aura Robotics",
			category: "Hardware Interface",
			year: "2025",
			color: "from-amber-950/40 via-neutral-950/80 to-black",
			accent: "#ff9900",
			tag: "Design System"
		}
	];
	const [activeCardIndex, setActiveCardIndex] = useState(0);
	const scrollToWork = () => {
		const workSection = document.getElementById("featured-work");
		if (workSection) workSection.scrollIntoView({ behavior: "smooth" });
	};
	return /* @__PURE__ */ jsxs("section", {
		className: "relative min-h-[92vh] pt-32 pb-20 flex flex-col justify-between overflow-hidden",
		children: [
			/* @__PURE__ */ jsx("div", { className: "absolute top-1/4 left-0 w-96 h-96 bg-[#d4ff00]/10 rounded-full blur-[140px] pointer-events-none" }),
			/* @__PURE__ */ jsx("div", { className: "absolute top-1/3 right-10 w-[30rem] h-[30rem] bg-indigo-500/10 rounded-full blur-[160px] pointer-events-none" }),
			/* @__PURE__ */ jsx("div", {
				className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto",
				children: /* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "lg:col-span-7 space-y-8",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono tracking-wider uppercase text-neutral-300 backdrop-blur-md",
								children: [/* @__PURE__ */ jsxs("span", {
									className: "relative flex h-2 w-2",
									children: [/* @__PURE__ */ jsx("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4ff00] opacity-75" }), /* @__PURE__ */ jsx("span", { className: "relative inline-flex rounded-full h-2 w-2 bg-[#d4ff00]" })]
								}), /* @__PURE__ */ jsx("span", { children: "ACCEPTING SELECT Q3/Q4 COMMISSIONS" })]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ jsxs("h1", {
									className: "text-4xl sm:text-6xl xl:text-7xl font-display font-extrabold tracking-tight leading-[1.05] text-white",
									children: [
										"WE SHAPE ",
										/* @__PURE__ */ jsx("br", {}),
										"UNFAIR ADVANTAGE FOR ",
										/* @__PURE__ */ jsx("br", {}),
										/* @__PURE__ */ jsx("span", {
											className: "relative inline-block overflow-hidden h-[1.15em] align-top text-[#d4ff00]",
											children: /* @__PURE__ */ jsx("span", {
												className: "inline-block transition-transform duration-500 ease-out animate-in slide-in-from-bottom-6",
												children: rotatingWords[currentWordIndex]
											}, currentWordIndex)
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
										className: "block font-display font-extrabold text-2xl text-white",
										children: "100%"
									}), /* @__PURE__ */ jsx("span", {
										className: "text-xs font-mono text-neutral-400 uppercase",
										children: "Independent"
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
										className: "block font-display font-extrabold text-2xl text-[#d4ff00]",
										children: "14+"
									}), /* @__PURE__ */ jsx("span", {
										className: "text-xs font-mono text-neutral-400 uppercase",
										children: "Awwwards / FWA"
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
										className: "block font-display font-extrabold text-2xl text-white",
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
									className: `absolute inset-0 rounded-3xl p-7 border border-white/15 bg-gradient-to-b ${card.color} backdrop-blur-xl shadow-2xl transition-all duration-700 ease-out cursor-pointer flex flex-col justify-between select-none`,
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
													className: "w-16 h-16 rounded-2xl border border-white/20 bg-white/5 flex items-center justify-center mb-6 shadow-inner",
													children: /* @__PURE__ */ jsx(Sparkles, { className: "w-8 h-8 text-[#d4ff00]" })
												}),
												/* @__PURE__ */ jsx("span", {
													className: "font-mono text-xs uppercase tracking-widest text-[#d4ff00]",
													children: card.category
												}),
												/* @__PURE__ */ jsx("h3", {
													className: "text-3xl font-display font-black text-white mt-1",
													children: card.title
												})
											]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-neutral-400",
											children: [/* @__PURE__ */ jsxs("span", { children: ["Case Study 0", idx + 1] }), /* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-1.5 text-white font-medium group-hover:text-[#d4ff00]",
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
				className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-8 flex items-center justify-between text-xs font-mono text-neutral-500",
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
					className: "p-2 rounded-full border border-white/10 hover:border-[#d4ff00] hover:text-[#d4ff00] transition-colors",
					children: /* @__PURE__ */ jsx(ArrowDown, { className: "w-4 h-4 animate-bounce" })
				})]
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
//#region resources/js/Components/Home/IntroBand.tsx
function IntroBand() {
	return /* @__PURE__ */ jsxs("section", {
		className: "relative py-20 border-y border-white/10 bg-[#0c0d12] overflow-hidden",
		children: [/* @__PURE__ */ jsx("div", {
			className: "py-4 border-b border-white/10 bg-black/40",
			children: /* @__PURE__ */ jsx(Marquee, {
				speed: "fast",
				pauseOnHover: true,
				children: [
					"BRAND STRATEGY",
					"KINETIC ENGINEERING",
					"SPATIAL 3D",
					"DESIGN SYSTEMS",
					"CATEGORY CREATION",
					"FULL-STACK VELOCITY"
				].map((item, index) => /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-6 whitespace-nowrap",
					children: [/* @__PURE__ */ jsx("span", {
						className: "font-display font-extrabold text-2xl sm:text-3xl text-neutral-400 tracking-tight hover:text-[#d4ff00] transition-colors",
						children: item
					}), /* @__PURE__ */ jsx(Asterisk, {
						className: "w-5 h-5 text-[#d4ff00] animate-spin",
						style: { animationDuration: "8s" }
					})]
				}, index))
			})
		}), /* @__PURE__ */ jsx("div", {
			className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16",
			children: /* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "lg:col-span-4",
					children: [/* @__PURE__ */ jsx("span", {
						className: "font-mono text-xs uppercase tracking-widest text-[#d4ff00] block mb-2",
						children: "[ THE CUTTING EDGE MANIFESTO ]"
					}), /* @__PURE__ */ jsx("h2", {
						className: "text-2xl sm:text-3xl font-display font-bold text-white leading-snug",
						children: "We discard convention to engineer visceral digital realities."
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "lg:col-span-8 space-y-6",
					children: [/* @__PURE__ */ jsx("p", {
						className: "text-xl sm:text-2xl lg:text-3xl font-display font-normal text-neutral-300 leading-relaxed",
						children: "Most agencies deliver safe, cookie-cutter templates that evaporate from memory. We construct bespoke, high-velocity digital experiences and magnetic brand systems designed to demand attention, trigger dopamine, and build generational brand equity."
					}), /* @__PURE__ */ jsx("div", {
						className: "pt-2",
						children: /* @__PURE__ */ jsxs(Link, {
							href: "/about",
							className: "group inline-flex items-center gap-2 text-sm sm:text-base font-mono uppercase tracking-wider text-[#d4ff00] hover:text-white transition-colors",
							children: [/* @__PURE__ */ jsx("span", { children: "Uncover Our Philosophy & Architecture" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" })]
						})
					})]
				})]
			})
		})]
	});
}
//#endregion
//#region resources/js/Components/Home/StickyWorkCards.tsx
function StickyWorkCards({ projects }) {
	const stickyOffsets = [
		"top-24",
		"top-28",
		"top-32",
		"top-36"
	];
	return /* @__PURE__ */ jsx("section", {
		id: "featured-work",
		className: "relative py-28 bg-[#0a0b0e]",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-white/10 gap-6",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
					className: "font-mono text-xs uppercase tracking-widest text-[#d4ff00] block mb-3",
					children: "[ 01 // SELECTED COMMISSIONS ]"
				}), /* @__PURE__ */ jsx("h2", {
					className: "text-4xl sm:text-6xl font-display font-extrabold text-white tracking-tight",
					children: "ENGINEERED FOR IMPACT."
				})] }), /* @__PURE__ */ jsxs(Link, {
					href: "/work",
					className: "group inline-flex items-center gap-2 text-sm font-mono uppercase tracking-wider text-neutral-400 hover:text-[#d4ff00] transition-colors",
					children: [/* @__PURE__ */ jsx("span", { children: "View All Archives (24+)" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" })]
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "space-y-12 relative pb-12",
				children: projects.map((project, index) => {
					const topClass = stickyOffsets[index % stickyOffsets.length];
					return /* @__PURE__ */ jsx("article", {
						className: `sticky ${topClass} rounded-3xl p-6 sm:p-10 border border-white/10 bg-[#12141c] shadow-2xl backdrop-blur-2xl transition-all duration-300 group overflow-hidden`,
						style: { zIndex: index + 10 },
						children: /* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-1 lg:grid-cols-12 gap-8 items-center",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "lg:col-span-5 space-y-6",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ jsx("span", {
											className: "px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-wider text-[#d4ff00]",
											children: project.category?.name || "Creative Engineering"
										}), /* @__PURE__ */ jsxs("span", {
											className: "text-xs font-mono text-neutral-500",
											children: [
												"[",
												project.year,
												"]"
											]
										})]
									}),
									/* @__PURE__ */ jsx("h3", {
										className: "text-3xl sm:text-5xl font-display font-black text-white leading-tight group-hover:text-[#d4ff00] transition-colors",
										children: /* @__PURE__ */ jsx(Link, {
											href: `/work/${project.slug}`,
											children: project.title
										})
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-neutral-400 text-sm sm:text-base leading-relaxed line-clamp-3",
										children: project.summary
									}),
									/* @__PURE__ */ jsx("div", {
										className: "flex flex-wrap gap-2 pt-2",
										children: project.deliverables?.map((deliv, i) => /* @__PURE__ */ jsx("span", {
											className: "text-[11px] font-mono text-neutral-400 bg-white/5 px-2.5 py-1 rounded-md border border-white/5",
											children: deliv
										}, i))
									}),
									/* @__PURE__ */ jsx("div", {
										className: "pt-4",
										children: /* @__PURE__ */ jsxs(Link, {
											href: `/work/${project.slug}`,
											className: "inline-flex items-center gap-2 font-display font-bold text-xs uppercase tracking-widest text-white group-hover:text-[#d4ff00] transition-colors",
											children: [/* @__PURE__ */ jsx("span", { children: "Explore Full Case Study" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" })]
										})
									})
								]
							}), /* @__PURE__ */ jsx("div", {
								className: "lg:col-span-7",
								children: /* @__PURE__ */ jsxs(Link, {
									href: `/work/${project.slug}`,
									"data-cursor-view": "VIEW",
									className: "block relative rounded-2xl overflow-hidden aspect-[16/10] bg-neutral-900 border border-white/10 group-hover:border-[#d4ff00]/50 transition-all duration-500",
									children: [/* @__PURE__ */ jsx("img", {
										src: project.cover_image,
										alt: project.title,
										loading: "lazy",
										className: "w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105"
									}), /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity duration-300" })]
								})
							})]
						})
					}, project.id || project.slug);
				})
			})]
		})
	});
}
//#endregion
//#region resources/js/Components/Home/ServicesList.tsx
function ServicesList({ services }) {
	const [expandedId, setExpandedId] = useState(services[0]?.id || 1);
	const toggleRow = (id) => {
		setExpandedId((prev) => prev === id ? null : id);
	};
	const icons = [
		Layers,
		Compass,
		Flame,
		Cpu
	];
	return /* @__PURE__ */ jsx("section", {
		className: "relative py-28 bg-[#0c0d12] border-t border-white/10 overflow-hidden",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-white/10 gap-6",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
					className: "font-mono text-xs uppercase tracking-widest text-[#d4ff00] block mb-3",
					children: "[ 02 // CAPABILITIES & DISCIPLINES ]"
				}), /* @__PURE__ */ jsx("h2", {
					className: "text-4xl sm:text-6xl font-display font-extrabold text-white tracking-tight",
					children: "SERVICES AT SCALE."
				})] }), /* @__PURE__ */ jsx("p", {
					className: "text-neutral-400 text-sm max-w-sm",
					children: "High-caliber execution across design, identity, and modern engineering to build distinct competitive monopolies."
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "divide-y divide-white/10",
				children: services.map((service, index) => {
					const isExpanded = expandedId === service.id;
					const ServiceIcon = icons[index % icons.length];
					return /* @__PURE__ */ jsxs("div", {
						className: `group transition-colors duration-300 ${isExpanded ? "bg-white/[0.02]" : "hover:bg-white/[0.01]"}`,
						children: [/* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => toggleRow(service.id),
							"aria-expanded": isExpanded,
							className: "w-full py-8 sm:py-10 flex items-center justify-between text-left cursor-pointer select-none",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-6 sm:gap-12",
								children: [/* @__PURE__ */ jsxs("span", {
									className: "font-mono text-xs sm:text-sm text-neutral-500 group-hover:text-[#d4ff00] transition-colors",
									children: ["0", index + 1]
								}), /* @__PURE__ */ jsx("h3", {
									className: "text-2xl sm:text-4xl lg:text-5xl font-display font-black text-white group-hover:text-[#d4ff00] group-hover:translate-x-2 transition-all duration-300",
									children: service.title
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-4",
								children: [/* @__PURE__ */ jsx("span", {
									className: "hidden sm:inline-block font-mono text-xs uppercase tracking-widest text-neutral-400",
									children: service.marquee_label
								}), /* @__PURE__ */ jsx("div", {
									className: `w-10 h-10 rounded-full border border-white/10 flex items-center justify-center transition-all duration-300 ${isExpanded ? "bg-[#d4ff00] text-black border-[#d4ff00]" : "text-neutral-400 group-hover:border-[#d4ff00] group-hover:text-[#d4ff00]"}`,
									children: isExpanded ? /* @__PURE__ */ jsx(Minus, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" })
								})]
							})]
						}), /* @__PURE__ */ jsx("div", {
							className: `overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? "max-h-[600px] opacity-100 pb-10" : "max-h-0 opacity-0"}`,
							children: /* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4 pl-0 sm:pl-16",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "lg:col-span-3 flex items-start",
										children: /* @__PURE__ */ jsxs("div", {
											className: "relative p-6 rounded-2xl bg-[#141620] border border-white/10 shadow-lg group-hover:border-[#d4ff00]/40 transition-colors animate-float",
											children: [/* @__PURE__ */ jsx(ServiceIcon, { className: "w-12 h-12 text-[#d4ff00]" }), /* @__PURE__ */ jsx("div", { className: "absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-[#d4ff00]/20 blur-md" })]
										})
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "lg:col-span-6 space-y-4",
										children: [
											/* @__PURE__ */ jsx("h4", {
												className: "text-xl font-display font-bold text-white",
												children: service.subtitle
											}),
											/* @__PURE__ */ jsx("p", {
												className: "text-neutral-400 text-sm sm:text-base leading-relaxed",
												children: service.description
											}),
											/* @__PURE__ */ jsx("div", {
												className: "flex flex-wrap gap-2 pt-2",
												children: service.deliverables?.map((deliv, i) => /* @__PURE__ */ jsx("span", {
													className: "text-xs font-mono text-neutral-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full",
													children: deliv
												}, i))
											})
										]
									}),
									/* @__PURE__ */ jsx("div", {
										className: "lg:col-span-3 flex lg:justify-end items-end",
										children: /* @__PURE__ */ jsxs(Link, {
											href: `/services/${service.slug}`,
											className: "inline-flex items-center gap-2 font-display font-bold text-xs uppercase tracking-widest text-black bg-[#d4ff00] hover:bg-[#c2eb00] px-5 py-3 rounded-full transition-colors",
											children: [/* @__PURE__ */ jsx("span", { children: "Deep Dive Discipline" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4" })]
										})
									})
								]
							})
						})]
					}, service.id || service.slug);
				})
			})]
		})
	});
}
//#endregion
//#region resources/js/Components/Home/StatsGrid.tsx
function AnimatedCounter({ value, prefix = "", suffix = "", decimals = 0, label, caption, badge }) {
	const [count, setCount] = useState(0);
	const elementRef = useRef(null);
	const [hasAnimated, setHasAnimated] = useState(false);
	useEffect(() => {
		const observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting && !hasAnimated) {
				setHasAnimated(true);
				if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
					setCount(value);
					return;
				}
				const duration = 2e3;
				const startTime = performance.now();
				const animate = (currentTime) => {
					const elapsed = currentTime - startTime;
					const progress = Math.min(elapsed / duration, 1);
					const currentVal = (1 - Math.pow(1 - progress, 5)) * value;
					setCount(currentVal);
					if (progress < 1) requestAnimationFrame(animate);
					else setCount(value);
				};
				requestAnimationFrame(animate);
			}
		}, { threshold: .25 });
		if (elementRef.current) observer.observe(elementRef.current);
		return () => observer.disconnect();
	}, [value, hasAnimated]);
	const formattedValue = decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toString();
	return /* @__PURE__ */ jsxs("div", {
		ref: elementRef,
		className: "relative p-8 sm:p-10 rounded-3xl bg-[#12141a] border border-white/10 hover:border-[#d4ff00]/40 transition-all duration-300 flex flex-col justify-between group",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between mb-8",
				children: [/* @__PURE__ */ jsx("span", {
					className: "font-mono text-xs uppercase tracking-widest text-neutral-400",
					children: badge
				}), /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-[#d4ff00] opacity-50 group-hover:opacity-100 transition-opacity" })]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "space-y-3",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "text-5xl sm:text-7xl font-display font-black text-white tracking-tight flex items-baseline gap-1",
					children: [
						/* @__PURE__ */ jsx("span", {
							className: "text-[#d4ff00]",
							children: prefix
						}),
						/* @__PURE__ */ jsx("span", { children: formattedValue }),
						/* @__PURE__ */ jsx("span", {
							className: "text-[#d4ff00]",
							children: suffix
						})
					]
				}), /* @__PURE__ */ jsx("h4", {
					className: "text-lg sm:text-xl font-display font-bold text-white",
					children: label
				})]
			}),
			/* @__PURE__ */ jsxs("p", {
				className: "mt-6 pt-6 border-t border-white/10 text-xs sm:text-sm text-neutral-400 font-mono leading-relaxed",
				children: [
					"\"",
					caption,
					"\""
				]
			})
		]
	});
}
function StatsGrid() {
	return /* @__PURE__ */ jsx("section", {
		className: "relative py-28 bg-[#0a0b0e] border-t border-white/10",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "text-center max-w-2xl mx-auto mb-16 space-y-4",
				children: [
					/* @__PURE__ */ jsx("span", {
						className: "font-mono text-xs uppercase tracking-widest text-[#d4ff00] block",
						children: "[ 03 // QUANTIFIABLE PROOF ]"
					}),
					/* @__PURE__ */ jsx("h2", {
						className: "text-4xl sm:text-6xl font-display font-extrabold text-white tracking-tight",
						children: "NUMBERS DON’T LIE."
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-neutral-400 text-sm sm:text-base",
						children: "Behind every kinetic interface and sculptural brand identity is rigorous engineering and cold, hard ROI."
					})
				]
			}), /* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-1 md:grid-cols-3 gap-8",
				children: [
					{
						value: 480,
						prefix: "$",
						suffix: "M+",
						label: "Client Capital Created",
						caption: "Our founders don’t just raise bridge rounds; they architect category-defining monopolies.",
						badge: "Metric // 01"
					},
					{
						value: 99.4,
						suffix: "%",
						decimals: 1,
						label: "On-Time Sprint Velocity",
						caption: "Production deadlines are sacred commitments, not flexible artistic suggestions.",
						badge: "Metric // 02"
					},
					{
						value: 14,
						suffix: "",
						label: "International Honors",
						caption: "Awwwards Site of the Year, FWA of the Day, and prestigious Red Dot accolades.",
						badge: "Metric // 03"
					}
				].map((stat, i) => /* @__PURE__ */ jsx(AnimatedCounter, { ...stat }, i))
			})]
		})
	});
}
//#endregion
//#region resources/js/Components/Home/ClientMarquees.tsx
function ClientMarquees({ clients }) {
	return /* @__PURE__ */ jsxs("section", {
		className: "relative py-28 bg-[#0c0d12] border-t border-white/10 overflow-hidden",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center",
				children: [
					/* @__PURE__ */ jsx("span", {
						className: "font-mono text-xs uppercase tracking-widest text-[#d4ff00] block mb-3",
						children: "[ 04 // TRUSTED BY VISIONARIES ]"
					}),
					/* @__PURE__ */ jsx("h2", {
						className: "text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight",
						children: "TRUSTED BY MARKET PIONEERS."
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-3 text-sm text-neutral-400 font-mono",
						children: "From venture-backed disruptors to generational enterprise titans."
					})
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "py-3 border-y border-white/5 bg-black/20",
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
						className: "group flex items-center gap-3 px-8 py-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-[#d4ff00]/40 hover:bg-white/[0.05] transition-all duration-300 cursor-default",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-lg text-[#d4ff00] group-hover:scale-125 transition-transform duration-300",
							children: item.symbol
						}), /* @__PURE__ */ jsxs("div", {
							className: "text-left",
							children: [/* @__PURE__ */ jsx("span", {
								className: "font-display font-extrabold text-base tracking-wider text-neutral-200 group-hover:text-white transition-colors block",
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
				className: "py-3 border-b border-white/5 bg-black/40 mt-6",
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
						className: "group flex items-center gap-3 px-8 py-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-[#d4ff00]/40 hover:bg-white/[0.05] transition-all duration-300 cursor-default",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-lg text-[#d4ff00] group-hover:scale-125 transition-transform duration-300",
							children: item.symbol
						}), /* @__PURE__ */ jsxs("div", {
							className: "text-left",
							children: [/* @__PURE__ */ jsx("span", {
								className: "font-display font-extrabold text-base tracking-wider text-neutral-200 group-hover:text-white transition-colors block",
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
	return /* @__PURE__ */ jsx("section", {
		className: "relative py-28 bg-[#0a0b0e] border-t border-white/10",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-white/10 gap-6",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
					className: "font-mono text-xs uppercase tracking-widest text-[#d4ff00] block mb-3",
					children: "[ 05 // MINDS BEHIND THE MACHINE ]"
				}), /* @__PURE__ */ jsx("h2", {
					className: "text-4xl sm:text-6xl font-display font-extrabold text-white tracking-tight",
					children: "LEADERSHIP TEAM."
				})] }), /* @__PURE__ */ jsxs(Link, {
					href: "/team",
					className: "group inline-flex items-center gap-2 text-sm font-mono uppercase tracking-wider text-neutral-400 hover:text-[#d4ff00] transition-colors",
					children: [/* @__PURE__ */ jsx("span", { children: "Meet All Fellows & Engineers" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" })]
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6",
				children: members.slice(0, 5).map((member) => /* @__PURE__ */ jsxs(Link, {
					href: `/team/${member.slug}`,
					className: "group relative rounded-3xl bg-[#12141c] border border-white/10 overflow-hidden flex flex-col justify-between hover:border-[#d4ff00]/60 transition-all duration-500",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "relative aspect-[4/5] overflow-hidden bg-neutral-900",
						children: [
							/* @__PURE__ */ jsx("img", {
								src: member.avatar,
								alt: member.name,
								loading: "lazy",
								className: "w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[10px] font-mono uppercase tracking-wider text-[#d4ff00]",
								children: ["Since ", member.since_year]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "absolute bottom-3 right-3 w-8 h-8 rounded-full bg-[#d4ff00] text-black opacity-0 group-hover:opacity-100 flex items-center justify-center transform translate-y-2 group-hover:translate-y-0 transition-all duration-300",
								children: /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4" })
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "p-5 space-y-1",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "font-display font-bold text-lg text-white group-hover:text-[#d4ff00] transition-colors",
							children: member.name
						}), /* @__PURE__ */ jsx("p", {
							className: "font-mono text-xs text-neutral-400",
							children: member.role
						})]
					})]
				}, member.id || member.slug))
			})]
		})
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
		/* @__PURE__ */ jsx(TestimonialsSlider, { testimonials })
	] });
}
//#endregion
export { Home as default };
