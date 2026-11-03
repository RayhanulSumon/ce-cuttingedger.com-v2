import { useState } from "react";
import { ArrowUpRight, Maximize2, Palette, X } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Services/Variants/VariantLookbookStream.tsx
var SWATCHES = [
	{
		name: "Studio White",
		color: "#FFFFFF",
		border: "#E2E8F0",
		dark: true
	},
	{
		name: "Warm Cashmere",
		color: "#F5F1E9",
		border: "#E5DFD3",
		dark: true
	},
	{
		name: "Mineral Sage",
		color: "#EBF0EC",
		border: "#D5DFD7",
		dark: true
	},
	{
		name: "Nordic Slate",
		color: "#E2E8F0",
		border: "#CBD5E1",
		dark: true
	},
	{
		name: "Obsidian Velvet",
		color: "#18181B",
		border: "#27272A",
		dark: false
	}
];
var LOOKBOOK_ITEMS = [
	{
		id: 1,
		title: "Architectural Trench Cut",
		category: "Haute Couture Isolation",
		img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80",
		tag: "RUNWAY"
	},
	{
		id: 2,
		title: "Sapphire Solitaire Ring",
		category: "Micro-Facet Prongs",
		img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=80",
		tag: "JEWELRY"
	},
	{
		id: 3,
		title: "Grained Calfskin Satchel",
		category: "Stitch Contour Vector",
		img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80",
		tag: "LEATHER"
	},
	{
		id: 4,
		title: "Precision Horology Bezel",
		category: "Multi-Path Reflections",
		img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80",
		tag: "TIMEPIECE"
	}
];
var VariantLookbookStream = ({ service, otherServices = [], relatedProjects = [], calendlyUrl }) => {
	const [activeSwatch, setActiveSwatch] = useState(SWATCHES[1]);
	const [lightboxImg, setLightboxImg] = useState(null);
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-[#F7F7F8] text-[#111113] antialiased selection:bg-[#111113] selection:text-white pb-32",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "border-b border-neutral-200 bg-white/90 backdrop-blur-md sticky top-0 z-40",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-7xl mx-auto px-4 sm:px-8 h-12 flex items-center justify-between text-[11px] font-mono tracking-wider text-neutral-600",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded border border-rose-200",
								children: "10 // STUDIO LOOKBOOK STREAM"
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
							children: "HIGH-FASHION ATELIER"
						}), /* @__PURE__ */ jsx("span", {
							className: "font-bold text-neutral-900",
							children: "PARIS • NYC"
						})]
					})]
				})
			}),
			/* @__PURE__ */ jsx("section", {
				className: "pt-8 sm:pt-12 pb-12 px-4 sm:px-8",
				children: /* @__PURE__ */ jsx("div", {
					className: "max-w-7xl mx-auto space-y-8",
					children: /* @__PURE__ */ jsx("div", {
						className: "rounded-3xl p-8 sm:p-14 bg-white border border-neutral-200 shadow-sm relative overflow-hidden",
						children: /* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-1 lg:grid-cols-12 gap-10 items-center",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "lg:col-span-5 space-y-6",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "font-mono text-xs uppercase tracking-[0.25em] text-rose-600 font-bold block",
										children: "CAPABILITY ESSAY // NO. 10"
									}),
									/* @__PURE__ */ jsx("h1", {
										className: "text-3xl sm:text-5xl font-serif tracking-tight text-[#111113] leading-tight",
										children: service.h1_title || service.title
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-base text-neutral-600 font-sans leading-relaxed",
										children: service.subtitle || "Master craft vector silhouetting for luxury houses and global editorial fashion portals."
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2.5",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "flex items-center justify-between text-xs font-mono",
											children: [/* @__PURE__ */ jsxs("span", {
												className: "font-bold text-neutral-700 flex items-center gap-1.5",
												children: [/* @__PURE__ */ jsx(Palette, { className: "w-3.5 h-3.5 text-rose-600" }), /* @__PURE__ */ jsx("span", { children: "Backdrop Colorway:" })]
											}), /* @__PURE__ */ jsx("span", {
												className: "font-bold text-neutral-900",
												children: activeSwatch.name
											})]
										}), /* @__PURE__ */ jsx("div", {
											className: "flex items-center gap-2",
											children: SWATCHES.map((swatch) => /* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => setActiveSwatch(swatch),
												className: `w-7 h-7 rounded-full border-2 transition-all ${activeSwatch.name === swatch.name ? "ring-2 ring-rose-500 scale-110 shadow-sm" : "hover:scale-105"}`,
												style: {
													backgroundColor: swatch.color,
													borderColor: swatch.border
												},
												title: swatch.name
											}, swatch.name))
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex flex-wrap items-center gap-3 pt-2",
										children: [/* @__PURE__ */ jsxs("a", {
											href: "#free-sample",
											className: "px-6 py-3.5 rounded-full bg-[#111113] hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm",
											children: [/* @__PURE__ */ jsx("span", { children: "Request Lookbook Batch" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4" })]
										}), /* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: () => window.dispatchEvent(new CustomEvent("ce:open-discovery-call")),
											className: "px-6 py-3.5 rounded-full bg-white hover:bg-neutral-50 text-neutral-800 font-bold text-xs uppercase tracking-wider transition-all border border-neutral-300",
											children: "Atelier Booking"
										})]
									})
								]
							}), /* @__PURE__ */ jsx("div", {
								className: "lg:col-span-7",
								children: /* @__PURE__ */ jsxs("div", {
									className: "relative rounded-3xl h-[420px] sm:h-[480px] p-6 flex items-center justify-center border border-neutral-200 shadow-xl transition-colors duration-500 overflow-hidden",
									style: { backgroundColor: activeSwatch.color },
									children: [
										/* @__PURE__ */ jsx("img", {
											src: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=85",
											alt: service.title,
											className: "max-h-[85%] max-w-[85%] object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
										}),
										/* @__PURE__ */ jsx("div", {
											className: "absolute top-4 left-4 px-3 py-1 rounded-full bg-white/80 backdrop-blur-md text-neutral-900 font-mono text-[10px] font-bold border border-neutral-200",
											children: "LIVE COLORWAY RENDER"
										}),
										/* @__PURE__ */ jsx("div", {
											className: "absolute bottom-4 right-4 px-3 py-1 rounded-full bg-[#111113]/80 backdrop-blur-md text-white font-mono text-[10px] font-bold",
											children: "300 DPI // ZERO HALO"
										})
									]
								})
							})]
						})
					})
				})
			}),
			/* @__PURE__ */ jsx("section", {
				className: "py-12 px-4 sm:px-8 border-t border-neutral-200 bg-white",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-7xl mx-auto space-y-8",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex flex-col sm:flex-row sm:items-end justify-between gap-4",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
							className: "font-mono text-xs uppercase tracking-widest text-rose-600 font-bold block mb-1",
							children: "EDITORIAL LOOKBOOK PROOF"
						}), /* @__PURE__ */ jsx("h2", {
							className: "text-2xl sm:text-3xl font-serif text-neutral-900 tracking-tight",
							children: "Luxury Fashion & Catalog Repertoire"
						})] }), /* @__PURE__ */ jsx("div", {
							className: "text-xs font-mono text-neutral-500",
							children: "ACCURACY GUARANTEE • 12H TURNAROUND"
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6",
						children: LOOKBOOK_ITEMS.map((item) => /* @__PURE__ */ jsx("div", {
							onClick: () => setLightboxImg(item.img),
							className: "group relative rounded-3xl overflow-hidden bg-neutral-100 border border-neutral-200 cursor-pointer hover:shadow-xl transition-all duration-300",
							children: /* @__PURE__ */ jsxs("div", {
								className: "relative h-72 w-full overflow-hidden",
								children: [
									/* @__PURE__ */ jsx("img", {
										src: item.img,
										alt: item.title,
										className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",
										children: /* @__PURE__ */ jsx(Maximize2, { className: "w-4 h-4 text-neutral-900" })
									}),
									/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" }),
									/* @__PURE__ */ jsxs("div", {
										className: "absolute bottom-4 inset-x-4 text-white",
										children: [/* @__PURE__ */ jsx("span", {
											className: "font-mono text-[10px] uppercase text-rose-300 font-semibold block",
											children: item.tag
										}), /* @__PURE__ */ jsx("h3", {
											className: "font-bold text-sm mt-0.5",
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
				className: "fixed inset-0 z-50 bg-[#111113]/85 backdrop-blur-md flex items-center justify-center p-4",
				onClick: () => setLightboxImg(null),
				children: /* @__PURE__ */ jsxs("div", {
					className: "relative max-w-4xl max-h-[90vh] bg-white rounded-3xl overflow-hidden p-2",
					onClick: (e) => e.stopPropagation(),
					children: [/* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => setLightboxImg(null),
						className: "absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[#111113] text-white flex items-center justify-center",
						children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
					}), /* @__PURE__ */ jsx("img", {
						src: lightboxImg,
						alt: "Preview",
						className: "max-h-[82vh] w-auto object-contain rounded-2xl mx-auto"
					})]
				})
			})
		]
	});
};
//#endregion
export { VariantLookbookStream };
