import { useRef, useState } from "react";
import { ArrowUpRight, Compass, Maximize2, X } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Services/Variants/VariantParallax.tsx
var PARALLAX_PORTFOLIO = [
	{
		id: 1,
		title: "Bespoke Tailored Overcoat",
		category: "Fine Fiber Edge Isolation",
		beforeImg: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85",
		afterImg: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1200&q=85",
		badge: "WOOL MASK"
	},
	{
		id: 2,
		title: "Titanium Chronograph",
		category: "Reflective Surface Multi-Path",
		beforeImg: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=85",
		afterImg: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85",
		badge: "32 PATHS"
	},
	{
		id: 3,
		title: "Leather Satchel Silhouette",
		category: "Hardware & Strap Isolation",
		beforeImg: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85",
		afterImg: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=85",
		badge: "CALFSKIN"
	},
	{
		id: 4,
		title: "Crystal Stemware Goblet",
		category: "Refraction Alpha Channel",
		beforeImg: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=85",
		afterImg: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=85",
		badge: "GLASS ALPHA"
	}
];
var VariantParallax = ({ service, otherServices = [], relatedProjects = [], calendlyUrl }) => {
	const [tilt, setTilt] = useState({
		x: 0,
		y: 0
	});
	const [splitPos, setSplitPos] = useState(50);
	const [activeLightbox, setActiveLightbox] = useState(null);
	const heroCardRef = useRef(null);
	const handleHeroMouseMove = (e) => {
		if (!heroCardRef.current) return;
		const rect = heroCardRef.current.getBoundingClientRect();
		const x = ((e.clientX - rect.left) / rect.width - .5) * 20;
		const y = ((e.clientY - rect.top) / rect.height - .5) * 20;
		setTilt({
			x,
			y
		});
	};
	const handleMouseLeave = () => {
		setTilt({
			x: 0,
			y: 0
		});
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-[#FDFBF7] text-stone-900 antialiased selection:bg-stone-900 selection:text-[#FDFBF7] pb-32",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "border-b border-stone-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-40",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-7xl mx-auto px-4 sm:px-8 h-12 flex items-center justify-between text-[11px] font-mono tracking-widest text-stone-600",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "font-bold text-amber-700 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20",
								children: "PARALLAX HORIZON // 03"
							}),
							/* @__PURE__ */ jsx("span", {
								className: "text-stone-300",
								children: "/"
							}),
							/* @__PURE__ */ jsx("span", {
								className: "truncate max-w-[200px] sm:max-w-none text-stone-900 font-semibold",
								children: service.title
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ jsx("span", {
							className: "hidden sm:inline text-stone-400",
							children: "DEPTH SEPARATION ENGINE"
						}), /* @__PURE__ */ jsx("span", {
							className: "font-bold text-stone-900",
							children: "STUDIO MASTER"
						})]
					})]
				})
			}),
			/* @__PURE__ */ jsx("section", {
				className: "pt-10 sm:pt-16 pb-16 px-4 sm:px-8",
				children: /* @__PURE__ */ jsx("div", {
					className: "max-w-7xl mx-auto space-y-8",
					children: /* @__PURE__ */ jsxs("div", {
						ref: heroCardRef,
						onMouseMove: handleHeroMouseMove,
						onMouseLeave: handleMouseLeave,
						className: "relative rounded-3xl overflow-hidden bg-gradient-to-b from-stone-100 to-stone-200/60 border border-stone-200 shadow-xl transition-all duration-300 ease-out",
						style: { perspective: "1000px" },
						children: [/* @__PURE__ */ jsx("div", {
							className: "absolute inset-0 pointer-events-none transition-transform duration-200 ease-out opacity-25",
							style: {
								backgroundImage: "radial-gradient(circle at 1px 1px, #78716c 1px, transparent 0)",
								backgroundSize: "24px 24px",
								transform: `translate(${tilt.x * -.5}px, ${tilt.y * -.5}px)`
							}
						}), /* @__PURE__ */ jsxs("div", {
							className: "relative z-10 p-8 sm:p-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "lg:col-span-5 space-y-6",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900 text-stone-100 text-xs font-mono tracking-wider",
										children: [/* @__PURE__ */ jsx(Compass, {
											className: "w-3.5 h-3.5 text-amber-400 animate-spin",
											style: { animationDuration: "8s" }
										}), /* @__PURE__ */ jsx("span", { children: "KINETIC DEPTH ISOLATION" })]
									}),
									/* @__PURE__ */ jsx("h1", {
										className: "text-3xl sm:text-5xl font-serif tracking-tight text-stone-900 leading-[1.08]",
										children: service.h1_title || service.title
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-base text-stone-600 font-sans leading-relaxed",
										children: service.subtitle || "Multi-plane vector silhouette separation. Zero digital fringe artifacts, guaranteed sub-millimeter precision."
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "grid grid-cols-3 gap-2 text-center pt-2 font-mono",
										children: [
											/* @__PURE__ */ jsxs("div", {
												className: "p-3 rounded-2xl bg-white/80 border border-stone-200/80 shadow-sm",
												children: [/* @__PURE__ */ jsx("div", {
													className: "text-[10px] text-stone-400 font-bold uppercase",
													children: "TOLERANCE"
												}), /* @__PURE__ */ jsx("div", {
													className: "text-sm font-bold text-stone-900 mt-0.5",
													children: "0.1px"
												})]
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "p-3 rounded-2xl bg-white/80 border border-stone-200/80 shadow-sm",
												children: [/* @__PURE__ */ jsx("div", {
													className: "text-[10px] text-stone-400 font-bold uppercase",
													children: "MASKING"
												}), /* @__PURE__ */ jsx("div", {
													className: "text-sm font-bold text-stone-900 mt-0.5",
													children: "Alpha 16b"
												})]
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "p-3 rounded-2xl bg-white/80 border border-stone-200/80 shadow-sm",
												children: [/* @__PURE__ */ jsx("div", {
													className: "text-[10px] text-stone-400 font-bold uppercase",
													children: "BATCH SLA"
												}), /* @__PURE__ */ jsx("div", {
													className: "text-sm font-bold text-stone-900 mt-0.5",
													children: "< 12 Hours"
												})]
											})
										]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex flex-wrap items-center gap-3 pt-3",
										children: [/* @__PURE__ */ jsxs("a", {
											href: "#free-sample",
											className: "px-6 py-3.5 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-50 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg",
											children: [/* @__PURE__ */ jsx("span", { children: "Instant Sample Run" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4" })]
										}), /* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: () => window.dispatchEvent(new CustomEvent("ce:open-discovery-call")),
											className: "px-6 py-3.5 rounded-full bg-white hover:bg-stone-50 text-stone-800 font-bold text-xs uppercase tracking-wider transition-all border border-stone-300",
											children: "Atelier Booking"
										})]
									})
								]
							}), /* @__PURE__ */ jsx("div", {
								className: "lg:col-span-7",
								children: /* @__PURE__ */ jsxs("div", {
									className: "relative h-[420px] sm:h-[480px] rounded-3xl overflow-hidden bg-white shadow-2xl border border-stone-200 transition-transform duration-200 ease-out select-none",
									style: { transform: `rotateY(${tilt.x * .4}deg) rotateX(${tilt.y * -.4}deg)` },
									children: [/* @__PURE__ */ jsxs("div", {
										className: "relative w-full h-full overflow-hidden",
										children: [
											/* @__PURE__ */ jsxs("div", {
												className: "absolute inset-0 bg-stone-50 flex items-center justify-center",
												children: [
													/* @__PURE__ */ jsx("div", {
														className: "absolute inset-0 opacity-20",
														style: {
															backgroundImage: "linear-gradient(45deg, #000 25%, transparent 25%), linear-gradient(-45deg, #000 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #000 75%), linear-gradient(-45deg, transparent 75%, #000 75%)",
															backgroundSize: "24px 24px",
															backgroundPosition: "0 0, 0 12px, 12px -12px, -12px 0px"
														}
													}),
													/* @__PURE__ */ jsx("img", {
														src: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=85",
														alt: "Hand-drawn vector cutout",
														className: "w-full h-full object-cover relative z-10"
													}),
													/* @__PURE__ */ jsx("div", {
														className: "absolute bottom-4 right-4 z-20 px-3 py-1.5 rounded-full bg-stone-900/80 backdrop-blur-md text-white font-mono text-[10px] font-bold tracking-wider",
														children: "STUDIO VECTOR ISOLATION"
													})
												]
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "absolute inset-0 overflow-hidden",
												style: { clipPath: `polygon(0 0, ${splitPos}% 0, ${splitPos}% 100%, 0 100%)` },
												children: [/* @__PURE__ */ jsx("img", {
													src: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=85",
													alt: "Raw capture",
													className: "w-full h-full object-cover filter brightness-90 contrast-95"
												}), /* @__PURE__ */ jsx("div", {
													className: "absolute bottom-4 left-4 z-20 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-md text-stone-900 font-mono text-[10px] font-bold tracking-wider border border-stone-200",
													children: "RAW CAPTURE"
												})]
											}),
											/* @__PURE__ */ jsx("div", {
												className: "absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-30 shadow-[0_0_15px_rgba(0,0,0,0.4)]",
												style: { left: `${splitPos}%` },
												children: /* @__PURE__ */ jsx("div", {
													className: "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center shadow-lg border-2 border-white text-xs",
													children: "↔"
												})
											}),
											/* @__PURE__ */ jsx("input", {
												type: "range",
												min: "5",
												max: "95",
												value: splitPos,
												onChange: (e) => setSplitPos(Number(e.target.value)),
												className: "absolute inset-0 opacity-0 cursor-ew-resize z-40 w-full h-full"
											})
										]
									}), /* @__PURE__ */ jsxs("div", {
										className: "absolute top-4 inset-x-4 z-30 flex items-center justify-between pointer-events-none",
										children: [/* @__PURE__ */ jsx("span", {
											className: "px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-stone-800 text-[10px] font-mono font-bold border border-stone-200 shadow-sm",
											children: "INTERACTIVE SPLIT: DRAG HORIZON"
										}), /* @__PURE__ */ jsx("span", {
											className: "px-3 py-1 rounded-full bg-amber-500/90 text-stone-950 text-[10px] font-mono font-bold shadow-sm",
											children: "DEPTH ACCELERATED"
										})]
									})]
								})
							})]
						})]
					})
				})
			}),
			/* @__PURE__ */ jsx("section", {
				className: "py-12 px-4 sm:px-8 border-t border-stone-200 bg-white",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-7xl mx-auto space-y-8",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex flex-col sm:flex-row sm:items-end justify-between gap-4",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
							className: "font-mono text-xs uppercase tracking-widest text-amber-700 font-bold block mb-1",
							children: "EXHIBITION PROOF"
						}), /* @__PURE__ */ jsx("h2", {
							className: "text-2xl sm:text-3xl font-serif text-stone-900 tracking-tight",
							children: "Depth-Separated Work Showcase"
						})] }), /* @__PURE__ */ jsxs("div", {
							className: "text-xs font-mono text-stone-500 flex items-center gap-2",
							children: [/* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-500" }), /* @__PURE__ */ jsx("span", { children: "CLICK TO EXPAND HIGH-RES ATELIER PLATE" })]
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-1 md:grid-cols-2 gap-8",
						children: PARALLAX_PORTFOLIO.map((item) => /* @__PURE__ */ jsx("div", {
							onClick: () => setActiveLightbox(item.afterImg),
							className: "group relative rounded-3xl overflow-hidden bg-stone-100 border border-stone-200 cursor-pointer hover:shadow-2xl transition-all duration-500",
							children: /* @__PURE__ */ jsxs("div", {
								className: "relative h-80 sm:h-96 w-full overflow-hidden",
								children: [
									/* @__PURE__ */ jsx("img", {
										src: item.afterImg,
										alt: item.title,
										className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "absolute top-4 left-4 px-3 py-1 rounded-full bg-stone-900/80 backdrop-blur-md text-white font-mono text-[10px] font-bold",
										children: item.badge
									}),
									/* @__PURE__ */ jsx("div", {
										className: "absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",
										children: /* @__PURE__ */ jsx(Maximize2, { className: "w-4 h-4 text-stone-900" })
									}),
									/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" }),
									/* @__PURE__ */ jsxs("div", {
										className: "absolute bottom-5 inset-x-5 text-white",
										children: [/* @__PURE__ */ jsx("span", {
											className: "font-mono text-[10px] uppercase tracking-wider text-amber-300 font-semibold block",
											children: item.category
										}), /* @__PURE__ */ jsx("h3", {
											className: "font-serif text-xl sm:text-2xl font-bold mt-0.5",
											children: item.title
										})]
									})
								]
							})
						}, item.id))
					})]
				})
			}),
			activeLightbox && /* @__PURE__ */ jsx("div", {
				className: "fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4",
				onClick: () => setActiveLightbox(null),
				children: /* @__PURE__ */ jsxs("div", {
					className: "relative max-w-4xl max-h-[90vh] bg-white rounded-3xl overflow-hidden p-2",
					onClick: (e) => e.stopPropagation(),
					children: [/* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => setActiveLightbox(null),
						className: "absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-stone-900 text-white flex items-center justify-center",
						children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
					}), /* @__PURE__ */ jsx("img", {
						src: activeLightbox,
						alt: "Expanded",
						className: "max-h-[82vh] w-auto object-contain rounded-2xl mx-auto"
					})]
				})
			})
		]
	});
};
//#endregion
export { VariantParallax };
