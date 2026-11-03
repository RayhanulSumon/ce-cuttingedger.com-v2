import { useState } from "react";
import { ArrowUpRight, Maximize2, Palette, X, Zap } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Services/Variants/VariantBentoAtelier.tsx
var BACKDROPS = [
	{
		id: "white",
		name: "Pure White",
		bg: "#FFFFFF",
		textDark: true
	},
	{
		id: "checker",
		name: "Alpha Checker",
		bg: "repeating-conic-gradient(#e2e8f0 0% 25%, #ffffff 0% 50%) 50% / 20px 20px",
		textDark: true
	},
	{
		id: "linen",
		name: "Warm Atelier Linen",
		bg: "#F4EFEB",
		textDark: true
	},
	{
		id: "neon",
		name: "Vibrant Studio",
		bg: "#06B6D4",
		textDark: false
	}
];
var TEXTURE_TILES = [
	{
		title: "Polished Platinum Chrono",
		sub: "Metal Edge Reflection",
		img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80",
		tag: "METAL"
	},
	{
		title: "Fine Silk Organza",
		sub: "Translucent Drape",
		img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80",
		tag: "SHEER"
	},
	{
		title: "Grained Calfskin Tote",
		sub: "Intricate Edge Stitching",
		img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80",
		tag: "LEATHER"
	},
	{
		title: "Facet Solitaire Ring",
		sub: "Prong Retention Mask",
		img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=80",
		tag: "JEWELRY"
	},
	{
		title: "Italian Suede Loafers",
		sub: "Soft Pile Separation",
		img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=80",
		tag: "SUEDE"
	},
	{
		title: "Parfum Crystal Flacon",
		sub: "Liquid Interior Bounds",
		img: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=80",
		tag: "GLASS"
	}
];
var VariantBentoAtelier = ({ service, otherServices = [], relatedProjects = [], calendlyUrl }) => {
	const [activeBackdrop, setActiveBackdrop] = useState(BACKDROPS[0]);
	const [lightboxImg, setLightboxImg] = useState(null);
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-[#F6F7F9] text-slate-900 antialiased selection:bg-slate-900 selection:text-white pb-32",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-40",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-7xl mx-auto px-4 sm:px-8 h-12 flex items-center justify-between text-[11px] font-mono tracking-wider text-slate-600",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "font-bold text-violet-700 bg-violet-50 px-2.5 py-0.5 rounded border border-violet-200",
								children: "06 // VISUAL BENTO ATELIER"
							}),
							/* @__PURE__ */ jsx("span", {
								className: "text-slate-300",
								children: "/"
							}),
							/* @__PURE__ */ jsx("span", {
								className: "font-semibold text-slate-800 truncate max-w-[200px] sm:max-w-none",
								children: service.title
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ jsx("span", {
							className: "hidden sm:inline",
							children: "MODULAR IMAGE GRID"
						}), /* @__PURE__ */ jsx("span", {
							className: "font-bold text-slate-900",
							children: "STUDIO ARCHITECTURE"
						})]
					})]
				})
			}),
			/* @__PURE__ */ jsx("section", {
				className: "pt-8 sm:pt-12 pb-12 px-4 sm:px-8",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-7xl mx-auto space-y-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex flex-col md:flex-row md:items-end justify-between gap-4",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
							className: "text-xs font-mono uppercase tracking-widest text-violet-600 font-bold block mb-1",
							children: "MULTI-TILE IMAGE SHOWCASE"
						}), /* @__PURE__ */ jsx("h1", {
							className: "text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight",
							children: service.h1_title || service.title
						})] }), /* @__PURE__ */ jsx("div", {
							className: "flex items-center gap-3",
							children: /* @__PURE__ */ jsxs("a", {
								href: "#free-sample",
								className: "px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm",
								children: [/* @__PURE__ */ jsx("span", { children: "Request Sample Batch" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4" })]
							})
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 md:grid-cols-12 gap-5",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "md:col-span-8 rounded-3xl p-6 sm:p-8 bg-white border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex flex-wrap items-center justify-between gap-3 mb-6 relative z-10",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "font-mono text-xs uppercase tracking-wider text-slate-500 font-bold flex items-center gap-2",
									children: [/* @__PURE__ */ jsx(Palette, { className: "w-4 h-4 text-violet-600" }), /* @__PURE__ */ jsx("span", { children: "TEST BACKDROP COLORWAY:" })]
								}), /* @__PURE__ */ jsx("div", {
									className: "flex items-center gap-1.5 p-1 rounded-full bg-slate-100 border border-slate-200",
									children: BACKDROPS.map((bd) => /* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => setActiveBackdrop(bd),
										className: `px-3 py-1 rounded-full text-xs font-medium transition-all ${activeBackdrop.id === bd.id ? "bg-white text-slate-900 shadow-sm font-bold" : "text-slate-600 hover:text-slate-900"}`,
										children: bd.name
									}, bd.id))
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "relative h-[360px] sm:h-[420px] rounded-2xl overflow-hidden border border-slate-200 flex items-center justify-center transition-all duration-500",
								style: { background: activeBackdrop.bg },
								children: [/* @__PURE__ */ jsx("img", {
									src: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=85",
									alt: service.title,
									className: "max-h-[85%] max-w-[85%] object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500"
								}), /* @__PURE__ */ jsx("div", {
									className: "absolute bottom-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white font-mono text-[10px] font-bold",
									children: "0.1px BEZIER CURVE // 100% HAND ISOLATED"
								})]
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "md:col-span-4 flex flex-col gap-5",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex-1 rounded-3xl p-6 bg-white border border-slate-200 shadow-sm flex flex-col justify-between overflow-hidden relative group",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "relative h-44 rounded-2xl overflow-hidden bg-slate-100",
									children: [/* @__PURE__ */ jsx("img", {
										src: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
										alt: "Precision detail",
										className: "w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
									}), /* @__PURE__ */ jsx("div", {
										className: "absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-slate-900/80 text-white font-mono text-[9px] font-bold",
										children: "SUB-PIXEL NODES"
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "pt-4",
									children: [/* @__PURE__ */ jsx("div", {
										className: "text-xs font-mono uppercase tracking-wider text-violet-600 font-bold",
										children: "Sub-Pixel Anchor Placement"
									}), /* @__PURE__ */ jsx("div", {
										className: "text-sm font-bold text-slate-800 mt-1",
										children: "Zero Jagged Stairs or Halo Bleed"
									})]
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "rounded-3xl p-6 bg-slate-900 text-white shadow-sm flex flex-col justify-between",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between mb-4",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-xs font-mono tracking-widest text-violet-400 font-bold uppercase",
										children: "STUDIO CAPACITY"
									}), /* @__PURE__ */ jsx(Zap, { className: "w-4 h-4 text-amber-400" })]
								}), /* @__PURE__ */ jsxs("div", {
									className: "space-y-3 font-mono",
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-center justify-between border-b border-slate-800 pb-2",
											children: [/* @__PURE__ */ jsx("span", {
												className: "text-xs text-slate-400",
												children: "Daily Velocity"
											}), /* @__PURE__ */ jsx("span", {
												className: "text-sm font-bold text-white",
												children: "5,000+ Assets"
											})]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-center justify-between border-b border-slate-800 pb-2",
											children: [/* @__PURE__ */ jsx("span", {
												className: "text-xs text-slate-400",
												children: "Express Turnaround"
											}), /* @__PURE__ */ jsx("span", {
												className: "text-sm font-bold text-emerald-400",
												children: "6 to 12 Hours"
											})]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ jsx("span", {
												className: "text-xs text-slate-400",
												children: "Path Quality"
											}), /* @__PURE__ */ jsx("span", {
												className: "text-sm font-bold text-white",
												children: "100% Pen Tool"
											})]
										})
									]
								})]
							})]
						})]
					})]
				})
			}),
			/* @__PURE__ */ jsx("section", {
				className: "py-12 px-4 sm:px-8 border-t border-slate-200 bg-white",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-7xl mx-auto space-y-8",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex flex-col sm:flex-row sm:items-end justify-between gap-4",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
							className: "font-mono text-xs uppercase tracking-widest text-violet-600 font-bold block mb-1",
							children: "MATERIAL TEXTURE ARCHIVE"
						}), /* @__PURE__ */ jsx("h2", {
							className: "text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight",
							children: "Complex Surface Silhouette Isolation"
						})] }), /* @__PURE__ */ jsx("div", {
							className: "text-xs font-mono text-slate-500",
							children: "6 CORE CATEGORIES • ZERO ARTIFACTS"
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
						children: TEXTURE_TILES.map((tile, i) => /* @__PURE__ */ jsx("div", {
							onClick: () => setLightboxImg(tile.img),
							className: "group relative rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer hover:shadow-lg transition-all",
							children: /* @__PURE__ */ jsxs("div", {
								className: "relative h-72 w-full overflow-hidden",
								children: [
									/* @__PURE__ */ jsx("img", {
										src: tile.img,
										alt: tile.title,
										className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/70 backdrop-blur-md text-white font-mono text-[10px] font-bold",
										children: tile.tag
									}),
									/* @__PURE__ */ jsx("div", {
										className: "absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",
										children: /* @__PURE__ */ jsx(Maximize2, { className: "w-4 h-4 text-slate-800" })
									}),
									/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-75 group-hover:opacity-50 transition-opacity" }),
									/* @__PURE__ */ jsxs("div", {
										className: "absolute bottom-4 inset-x-4 text-white",
										children: [/* @__PURE__ */ jsx("span", {
											className: "font-mono text-[10px] uppercase text-violet-300 font-semibold block",
											children: tile.sub
										}), /* @__PURE__ */ jsx("h3", {
											className: "font-bold text-base mt-0.5",
											children: tile.title
										})]
									})
								]
							})
						}, i))
					})]
				})
			}),
			lightboxImg && /* @__PURE__ */ jsx("div", {
				className: "fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4",
				onClick: () => setLightboxImg(null),
				children: /* @__PURE__ */ jsxs("div", {
					className: "relative max-w-4xl max-h-[90vh] bg-white rounded-3xl overflow-hidden p-2",
					onClick: (e) => e.stopPropagation(),
					children: [/* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => setLightboxImg(null),
						className: "absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center",
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
export { VariantBentoAtelier };
