import { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { ArrowRight } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/HomeVariants/HomeEditorial.tsx
function HomeEditorial({ clients = [] }) {
	const [activeTab, setActiveTab] = useState(0);
	const EDITORIAL_STORIES = [
		{
			title: "Haute Horlogerie & Specular Reflection",
			category: "Timepieces",
			tag: "COLLECTION 01",
			description: "Precision prong rebuilding, anti-reflective sapphire isolation, and specular metal illumination for the world’s most prestigious watchmakers.",
			image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1600&q=85",
			quote: "“CuttingEdger elevates mechanical watch imagery into pure horological art.”"
		},
		{
			title: "Invisible Sculpting & Garment Flow",
			category: "Haute Couture",
			tag: "COLLECTION 02",
			description: "3D ghost mannequin compositing that preserves the delicate drape, weave, and breath of silk, cashmere, and virgin wool without artificial flatness.",
			image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1600&q=85",
			quote: "“Zero halo. Symmetrical silhouette. The standard our creative director demanded.”"
		},
		{
			title: "Macro Facet Polish & Radiance",
			category: "Fine Jewelry",
			tag: "COLLECTION 03",
			description: "Focus stacking, microscopic dust ablation, and chromatic aberration correction to highlight diamond fire and platinum luster.",
			image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1600&q=85",
			quote: "“Flawless clarity without sacrificing authentic metal grain.”"
		}
	];
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-[#F6F5F0] text-[#161618] selection:bg-[#de4a2c] selection:text-white font-serif antialiased overflow-x-hidden",
		children: [
			/* @__PURE__ */ jsx(Head, { children: /* @__PURE__ */ jsx("title", { children: "CuttingEdger Editorial — High-Fashion Post-Production Atelier" }) }),
			/* @__PURE__ */ jsxs("section", {
				className: "pt-32 pb-20 px-6 sm:px-12 max-w-7xl mx-auto border-b border-[#E5E3DC]",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between text-xs font-mono uppercase tracking-widest text-[#787670] pb-6 border-b border-[#E5E3DC]",
					children: [/* @__PURE__ */ jsx("span", { children: "Issue No. 04 — Post-Production Atelier" }), /* @__PURE__ */ jsx("span", {
						className: "text-[#de4a2c] font-bold",
						children: "Accent Identity: #DE4A2C"
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "mt-12 max-w-4xl",
					children: [
						/* @__PURE__ */ jsx("span", {
							className: "text-xs font-mono font-bold uppercase tracking-widest text-[#de4a2c] block mb-3",
							children: "Atelier Retouching & Vector Pen Paths"
						}),
						/* @__PURE__ */ jsxs("h1", {
							className: "text-5xl sm:text-7xl lg:text-8xl font-normal tracking-tight leading-[1.02] text-[#0D0E12]",
							children: [
								"The Architecture of Visual ",
								/* @__PURE__ */ jsx("em", {
									className: "italic font-serif text-[#de4a2c]",
									children: "Perfection"
								}),
								"."
							]
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-8 text-lg sm:text-xl text-[#5A5852] font-sans max-w-2xl leading-relaxed",
							children: "Where artisanal craftsmanship meets high-volume enterprise e-commerce. Hand-drawn clipping paths and editorial grade retouching for discerning fashion houses."
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-10 flex items-center gap-4 font-sans",
							children: [/* @__PURE__ */ jsxs(Link, {
								href: "/services/ecommerce-catalog-optimization/clipping-path-service?v=2",
								className: "px-8 py-4 rounded-full bg-[#161618] hover:bg-[#de4a2c] text-white font-bold text-xs uppercase tracking-widest transition-colors flex items-center gap-2 shadow-lg",
								children: [/* @__PURE__ */ jsx("span", { children: "Explore Editorial Layout" }), /* @__PURE__ */ jsx(ArrowRight, { className: "w-3.5 h-3.5" })]
							}), /* @__PURE__ */ jsx("a", {
								href: "#manifesto",
								className: "px-6 py-4 rounded-full border border-[#D5D3CB] hover:border-[#161618] text-[#161618] font-bold text-xs uppercase tracking-widest transition-colors",
								children: "Read Atelier Manifesto"
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsx("section", {
				id: "manifesto",
				className: "py-20 px-6 sm:px-12 max-w-7xl mx-auto font-sans",
				children: /* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 lg:grid-cols-12 gap-12 items-center",
					children: [/* @__PURE__ */ jsx("div", {
						className: "lg:col-span-7",
						children: /* @__PURE__ */ jsxs("div", {
							className: "rounded-3xl overflow-hidden shadow-2xl h-[480px] sm:h-[600px] relative border border-[#E5E3DC]",
							children: [/* @__PURE__ */ jsx("img", {
								src: EDITORIAL_STORIES[activeTab].image,
								alt: EDITORIAL_STORIES[activeTab].title,
								className: "w-full h-full object-cover transition-all duration-700"
							}), /* @__PURE__ */ jsx("div", {
								className: "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-8 text-white",
								children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
									className: "text-xs font-mono font-bold uppercase tracking-widest text-[#de4a2c]",
									children: EDITORIAL_STORIES[activeTab].tag
								}), /* @__PURE__ */ jsx("h3", {
									className: "text-2xl sm:text-3xl font-serif mt-1",
									children: EDITORIAL_STORIES[activeTab].title
								})] })
							})]
						})
					}), /* @__PURE__ */ jsxs("div", {
						className: "lg:col-span-5 space-y-6",
						children: [/* @__PURE__ */ jsx("div", {
							className: "text-xs font-mono uppercase tracking-widest text-[#de4a2c] font-bold",
							children: "Curation & Disciplines"
						}), /* @__PURE__ */ jsx("div", {
							className: "space-y-4",
							children: EDITORIAL_STORIES.map((story, idx) => /* @__PURE__ */ jsxs("div", {
								onClick: () => setActiveTab(idx),
								className: `p-6 rounded-2xl border transition-all cursor-pointer ${activeTab === idx ? "bg-white border-[#de4a2c] shadow-lg" : "bg-white/40 border-[#E5E3DC] hover:bg-white hover:border-[#D5D3CB]"}`,
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between text-xs font-mono text-[#787670] mb-1",
										children: [/* @__PURE__ */ jsx("span", { children: story.category }), /* @__PURE__ */ jsxs("span", {
											className: activeTab === idx ? "text-[#de4a2c] font-bold" : "",
											children: ["0", idx + 1]
										})]
									}),
									/* @__PURE__ */ jsx("h4", {
										className: "text-lg font-serif font-bold text-[#161618]",
										children: story.title
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-xs text-[#5A5852] mt-2 leading-relaxed",
										children: story.description
									})
								]
							}, story.title))
						})]
					})]
				})
			})
		]
	});
}
//#endregion
export { HomeEditorial };
