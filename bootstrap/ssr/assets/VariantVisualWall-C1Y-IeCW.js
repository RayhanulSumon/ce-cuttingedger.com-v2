import { useState } from "react";
import { ArrowUpRight, Maximize2, X } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Services/Variants/VariantVisualWall.tsx
var GALLERY_WALL = [
	{
		id: 1,
		title: "Monochrome Editorial Gown",
		cat: "Apparel",
		img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85",
		span: "col-span-1 md:col-span-2 row-span-2 h-[480px]"
	},
	{
		id: 2,
		title: "Bespoke Diamond Solitaire",
		cat: "Jewelry",
		img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=85",
		span: "col-span-1 h-[230px]"
	},
	{
		id: 3,
		title: "Minimalist Titanium Watch",
		cat: "Timepiece",
		img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=85",
		span: "col-span-1 h-[230px]"
	},
	{
		id: 4,
		title: "Handcrafted Suede Loafer",
		cat: "Footwear",
		img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=85",
		span: "col-span-1 h-[230px]"
	},
	{
		id: 5,
		title: "Artisan Glass Flacon",
		cat: "Cosmetics",
		img: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=85",
		span: "col-span-1 h-[230px]"
	},
	{
		id: 6,
		title: "Calfskin Minimalist Tote",
		cat: "Leather",
		img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=85",
		span: "col-span-1 md:col-span-2 h-[320px]"
	},
	{
		id: 7,
		title: "Streetwear Runner Sole",
		cat: "Footwear",
		img: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1200&q=85",
		span: "col-span-1 md:col-span-2 h-[320px]"
	}
];
var VariantVisualWall = ({ service, otherServices = [], relatedProjects = [], calendlyUrl }) => {
	const [activeFilter, setActiveFilter] = useState("All");
	const [lightboxImg, setLightboxImg] = useState(null);
	const filteredItems = activeFilter === "All" ? GALLERY_WALL : GALLERY_WALL.filter((item) => item.cat === activeFilter);
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-[#FAF8F5] text-[#1F1E1D] antialiased selection:bg-[#1F1E1D] selection:text-[#FAF8F5] pb-32",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "border-b border-[#E8E4DD] bg-[#FAF8F5]/90 backdrop-blur-md sticky top-0 z-40",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-7xl mx-auto px-4 sm:px-8 h-12 flex items-center justify-between text-[11px] font-mono tracking-widest uppercase",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "font-bold text-[#1F1E1D] bg-[#E8E4DD] px-2.5 py-0.5 rounded",
								children: "09 // MINIMALIST VISUAL WALL"
							}),
							/* @__PURE__ */ jsx("span", {
								className: "text-[#D3CECE]",
								children: "/"
							}),
							/* @__PURE__ */ jsx("span", {
								className: "font-semibold text-[#1F1E1D] truncate max-w-[200px] sm:max-w-none",
								children: service.title
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3 text-stone-500",
						children: [/* @__PURE__ */ jsx("span", {
							className: "hidden sm:inline",
							children: "EXHIBITION CANVAS"
						}), /* @__PURE__ */ jsx("span", {
							className: "font-bold text-[#1F1E1D]",
							children: "CURATED ATELIER"
						})]
					})]
				})
			}),
			/* @__PURE__ */ jsx("section", {
				className: "pt-8 sm:pt-12 pb-12 px-4 sm:px-8",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-7xl mx-auto space-y-6",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-[#E8E4DD]",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ jsx("span", {
									className: "font-mono text-xs uppercase tracking-[0.25em] text-stone-500 font-bold block",
									children: "VISUAL ESSENCE // NO. 09"
								}), /* @__PURE__ */ jsx("h1", {
									className: "text-3xl sm:text-5xl font-serif tracking-tight text-[#1F1E1D] leading-tight",
									children: service.h1_title || service.title
								})]
							}), /* @__PURE__ */ jsx("div", {
								className: "flex flex-wrap items-center gap-2 font-mono text-xs",
								children: [
									"All",
									"Apparel",
									"Jewelry",
									"Timepiece",
									"Footwear",
									"Leather"
								].map((cat) => /* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => setActiveFilter(cat),
									className: `px-4 py-1.5 rounded-full transition-all ${activeFilter === cat ? "bg-[#1F1E1D] text-[#FAF8F5] font-bold shadow-sm" : "bg-[#EFECE6] hover:bg-[#E8E4DD] text-stone-700 font-medium"}`,
									children: cat
								}, cat))
							})]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "grid grid-cols-1 md:grid-cols-4 gap-5",
							children: filteredItems.map((item) => /* @__PURE__ */ jsxs("div", {
								onClick: () => setLightboxImg(item.img),
								className: `group relative rounded-3xl overflow-hidden bg-[#EFECE6] border border-[#E8E4DD] cursor-pointer hover:shadow-xl transition-all duration-500 ${item.span}`,
								children: [
									/* @__PURE__ */ jsx("img", {
										src: item.img,
										alt: item.title,
										className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "absolute top-4 left-4 px-3 py-1 rounded-full bg-[#1F1E1D]/80 backdrop-blur-md text-[#FAF8F5] font-mono text-[10px] font-bold uppercase tracking-wider",
										children: item.cat
									}),
									/* @__PURE__ */ jsx("div", {
										className: "absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",
										children: /* @__PURE__ */ jsx(Maximize2, { className: "w-4 h-4 text-[#1F1E1D]" })
									}),
									/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-[#1F1E1D]/80 via-transparent to-transparent opacity-70 group-hover:opacity-50 transition-opacity" }),
									/* @__PURE__ */ jsxs("div", {
										className: "absolute bottom-5 inset-x-5 text-[#FAF8F5]",
										children: [/* @__PURE__ */ jsx("h3", {
											className: "font-serif text-lg sm:text-xl font-bold",
											children: item.title
										}), /* @__PURE__ */ jsx("div", {
											className: "font-mono text-[10px] text-stone-300 mt-1 uppercase tracking-widest",
											children: "300 DPI // 100% Vector Pen Mask"
										})]
									})
								]
							}, item.id))
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "p-6 rounded-3xl bg-[#EFECE6] border border-[#E8E4DD] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-emerald-600" }), /* @__PURE__ */ jsx("span", {
									className: "font-bold text-[#1F1E1D]",
									children: "Unlimited fine-tuned revisions included with all enterprise batches."
								})]
							}), /* @__PURE__ */ jsx("div", {
								className: "flex items-center gap-3",
								children: /* @__PURE__ */ jsxs("a", {
									href: "#free-sample",
									className: "px-6 py-3 rounded-full bg-[#1F1E1D] hover:bg-neutral-800 text-[#FAF8F5] font-bold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-sm",
									children: [/* @__PURE__ */ jsx("span", { children: "Request Sample Batch" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4" })]
								})
							})]
						})
					]
				})
			}),
			lightboxImg && /* @__PURE__ */ jsx("div", {
				className: "fixed inset-0 z-50 bg-[#1F1E1D]/85 backdrop-blur-md flex items-center justify-center p-4",
				onClick: () => setLightboxImg(null),
				children: /* @__PURE__ */ jsxs("div", {
					className: "relative max-w-4xl max-h-[90vh] bg-white rounded-3xl overflow-hidden p-2",
					onClick: (e) => e.stopPropagation(),
					children: [/* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => setLightboxImg(null),
						className: "absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[#1F1E1D] text-white flex items-center justify-center",
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
export { VariantVisualWall };
