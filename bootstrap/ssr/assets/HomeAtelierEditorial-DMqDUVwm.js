import { useState } from "react";
import { Link } from "@inertiajs/react";
import { ArrowRight, Check, ChevronRight, Eye } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/HomeVariants/HomeAtelierEditorial.tsx
var EDITORIAL_DISCIPLINES = [
	{
		num: "01",
		slug: "headshots",
		title: "AI Corporate Headshots",
		sub: "S1 Atelier / Portraiture",
		quote: "From casual smartphone selfies to executive C-suite portraits with unified corporate illumination.",
		before: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
		after: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=85",
		beforeTag: "Raw Unprocessed Selfie",
		afterTag: "C-Suite Studio Standard",
		spec: "Sub-2h SLA • Identity Preserve Lock"
	},
	{
		num: "02",
		slug: "runway",
		title: "AI Runway Fashion Models",
		sub: "S2 Atelier / Apparel Movement",
		quote: "Converting flat ghost mannequins into dynamic editorial living models across global runway diversity.",
		before: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=80",
		after: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85",
		beforeTag: "Hollow Mannequin Plate",
		afterTag: "Living Runway Editorial",
		spec: "Zero Studio Overhead • Realistic Fabric Drape"
	},
	{
		num: "03",
		slug: "tryon",
		title: "3D Virtual Try-On Synthesis",
		sub: "S3 Atelier / Garment Physics",
		quote: "Photorealistic garment synthesis on customer or brand avatars with micro-wrinkle tension alignment.",
		before: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1200&q=80",
		after: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85",
		beforeTag: "Flat Garment SKU",
		afterTag: "Anatomical Model Fit",
		spec: "4K Ultra-Res • 38% Return Reduction"
	},
	{
		num: "04",
		slug: "scene",
		title: "Architectural Scene Generation",
		sub: "S4 Atelier / Environment Design",
		quote: "Replacing blank product cutouts with bespoke morning sun caustics, travertine marble, and natural air.",
		before: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=80",
		after: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=85",
		beforeTag: "Isolated Studio Product",
		afterTag: "Sunlit Marble Scene",
		spec: "Raytraced Caustics • 10K+ SKU Automation"
	},
	{
		num: "05",
		slug: "paths",
		title: "Hand-Crafted Pen Tool Paths",
		sub: "S5 Atelier / High Jewelry & Retouch",
		quote: "Bespoke ±0.25px vector Bézier paths, micro-dust ablation, and non-destructive 16-bit master PSDs.",
		before: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80",
		after: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85",
		beforeTag: "Macro RAW Unretouched",
		afterTag: "Specular Diamond Master",
		spec: "±0.25px Vector Tolerance • Zero Halos"
	}
];
var LUXURY_HOUSES = [
	"BALENCIAGA",
	"CARTIER",
	"SSENSE",
	"JIL SANDER",
	"ACNE STUDIOS",
	"FARFETCH",
	"MONCLER"
];
function HomeAtelierEditorial({ clients = [] }) {
	const [selectedIdx, setSelectedIdx] = useState(0);
	const [showRaw, setShowRaw] = useState(false);
	const [formSubmitted, setFormSubmitted] = useState(false);
	const active = EDITORIAL_DISCIPLINES[selectedIdx];
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-[#FAF9F5] text-[#121212] selection:bg-[#121212] selection:text-white font-serif antialiased overflow-x-hidden",
		children: [
			/* @__PURE__ */ jsx("header", {
				className: "border-b border-neutral-300/80 px-6 sm:px-12 py-5 font-sans",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-7xl mx-auto flex items-center justify-between text-xs",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-6",
							children: [/* @__PURE__ */ jsx(Link, {
								href: "/",
								className: "font-serif text-2xl font-bold tracking-tight text-neutral-900",
								children: "Cutting Edger"
							}), /* @__PURE__ */ jsx("span", {
								className: "hidden md:inline text-neutral-400 font-mono text-[11px] uppercase tracking-widest",
								children: "// ATELIER ISSUE NO. 24"
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "hidden lg:flex items-center gap-8 font-mono text-[11px] uppercase tracking-wider text-neutral-500",
							children: [
								/* @__PURE__ */ jsx("span", { children: "PARIS" }),
								/* @__PURE__ */ jsx("span", { children: "NEW YORK" }),
								/* @__PURE__ */ jsx("span", { children: "TOKYO" }),
								/* @__PURE__ */ jsx("span", {
									className: "text-[#de4a2c] font-bold",
									children: "5 DISCIPLINES"
								})
							]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "flex items-center gap-4",
							children: /* @__PURE__ */ jsx(Link, {
								href: "/contact",
								className: "px-5 py-2 border border-neutral-900 rounded-none bg-neutral-900 text-white hover:bg-transparent hover:text-neutral-900 text-xs font-mono uppercase tracking-wider transition-all",
								children: "Order Sample"
							})
						})
					]
				})
			}),
			/* @__PURE__ */ jsx("section", {
				className: "px-6 sm:px-12 py-12 sm:py-20 max-w-7xl mx-auto border-b border-neutral-300/70",
				children: /* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "lg:col-span-5 font-sans",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "font-mono text-xs uppercase tracking-widest text-[#de4a2c] block mb-3 font-semibold",
								children: "// THE 2026 VISUAL REPORT"
							}),
							/* @__PURE__ */ jsxs("h1", {
								className: "font-serif text-4xl sm:text-6xl font-normal leading-[1.05] tracking-tight text-neutral-950 mb-6",
								children: [
									"The Pure Architecture ",
									/* @__PURE__ */ jsx("br", {}),
									/* @__PURE__ */ jsx("span", {
										className: "italic font-light",
										children: "of Visual Taste."
									})
								]
							}),
							/* @__PURE__ */ jsx("p", {
								className: "font-serif text-neutral-600 text-base sm:text-lg leading-relaxed mb-8",
								children: active.quote
							}),
							/* @__PURE__ */ jsx("div", {
								className: "space-y-2 border-t border-b border-neutral-200 py-4 mb-8",
								children: EDITORIAL_DISCIPLINES.map((item, idx) => /* @__PURE__ */ jsxs("button", {
									onClick: () => setSelectedIdx(idx),
									className: `w-full flex items-center justify-between text-left py-2 px-3 transition-colors ${selectedIdx === idx ? "bg-neutral-900 text-white font-medium" : "hover:bg-neutral-200/50 text-neutral-700"}`,
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ jsx("span", {
											className: "font-mono text-xs",
											children: item.num
										}), /* @__PURE__ */ jsx("span", {
											className: "text-xs uppercase tracking-wide font-sans",
											children: item.title
										})]
									}), /* @__PURE__ */ jsx(ChevronRight, { className: "w-3.5 h-3.5 opacity-60" })]
								}, item.num))
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-4",
								children: [/* @__PURE__ */ jsxs("button", {
									onMouseDown: () => setShowRaw(true),
									onMouseUp: () => setShowRaw(false),
									onTouchStart: () => setShowRaw(true),
									onTouchEnd: () => setShowRaw(false),
									className: "px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-900 font-mono text-xs uppercase tracking-wider transition-colors flex items-center gap-2 select-none",
									children: [/* @__PURE__ */ jsx(Eye, { className: "w-3.5 h-3.5" }), showRaw ? "Releasing RAW Plate..." : "Press & Hold for RAW"]
								}), /* @__PURE__ */ jsx("span", {
									className: "text-[11px] font-mono text-neutral-500",
									children: active.spec
								})]
							})
						]
					}), /* @__PURE__ */ jsx("div", {
						className: "lg:col-span-7",
						children: /* @__PURE__ */ jsxs("div", {
							className: "relative aspect-[4/5] bg-neutral-200 overflow-hidden shadow-2xl border border-neutral-900/10",
							children: [
								/* @__PURE__ */ jsx("img", {
									src: showRaw ? active.before : active.after,
									alt: active.title,
									className: "w-full h-full object-cover transition-opacity duration-300"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "absolute top-6 left-6 font-mono text-[11px] bg-white/90 backdrop-blur-md px-3 py-1.5 uppercase tracking-wider text-neutral-900 border border-neutral-300",
									children: showRaw ? active.beforeTag : active.afterTag
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "absolute bottom-6 right-6 font-mono text-[11px] bg-neutral-900/80 backdrop-blur-md text-white px-3 py-1.5 uppercase tracking-wider",
									children: [
										active.num,
										" / 05 // ",
										active.sub
									]
								})
							]
						})
					})]
				})
			}),
			/* @__PURE__ */ jsx("section", {
				className: "py-8 border-b border-neutral-300/70 overflow-hidden font-sans",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-7xl mx-auto px-6 sm:px-12 flex items-center justify-between",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-[11px] font-mono text-neutral-400 uppercase tracking-widest hidden sm:inline",
						children: "PRODUCED FOR LUXURY HOUSES:"
					}), /* @__PURE__ */ jsx("div", {
						className: "flex items-center gap-8 sm:gap-14 overflow-x-auto py-2",
						children: LUXURY_HOUSES.map((house, i) => /* @__PURE__ */ jsx("span", {
							className: "font-serif text-xs sm:text-sm tracking-[0.25em] text-neutral-800 uppercase whitespace-nowrap opacity-80",
							children: house
						}, i))
					})]
				})
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "px-6 sm:px-12 py-20 max-w-7xl mx-auto",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "mb-14 font-sans text-center max-w-2xl mx-auto",
					children: [/* @__PURE__ */ jsx("span", {
						className: "font-mono text-xs uppercase tracking-widest text-[#de4a2c] font-bold block mb-2",
						children: "COMPLETE ARCHIVE"
					}), /* @__PURE__ */ jsx("h2", {
						className: "font-serif text-3xl sm:text-5xl font-normal text-neutral-950 tracking-tight",
						children: "Curated Atelier Disciplines"
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "space-y-16",
					children: EDITORIAL_DISCIPLINES.map((item, idx) => /* @__PURE__ */ jsxs("div", {
						className: `grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8 border-t border-neutral-200 ${idx % 2 === 1 ? "lg:flex-row-reverse" : ""}`,
						children: [/* @__PURE__ */ jsx("div", {
							className: `lg:col-span-6 ${idx % 2 === 1 ? "lg:order-2" : ""}`,
							children: /* @__PURE__ */ jsxs("div", {
								className: "relative aspect-[16/10] bg-neutral-200 overflow-hidden shadow-md",
								children: [/* @__PURE__ */ jsx("img", {
									src: item.after,
									alt: item.title,
									className: "w-full h-full object-cover hover:scale-105 transition-transform duration-700"
								}), /* @__PURE__ */ jsxs("div", {
									className: "absolute top-4 left-4 bg-white/95 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-neutral-900 border border-neutral-200",
									children: ["DISCIPLINE ", item.num]
								})]
							})
						}), /* @__PURE__ */ jsxs("div", {
							className: `lg:col-span-6 font-sans ${idx % 2 === 1 ? "lg:order-1" : ""}`,
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "font-mono text-xs text-neutral-400 uppercase tracking-widest mb-1",
									children: item.sub
								}),
								/* @__PURE__ */ jsx("h3", {
									className: "font-serif text-2xl sm:text-3xl text-neutral-950 mb-3",
									children: item.title
								}),
								/* @__PURE__ */ jsx("p", {
									className: "font-serif text-neutral-600 text-sm sm:text-base leading-relaxed mb-6",
									children: item.quote
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "font-mono text-xs text-neutral-500 mb-6 flex items-center gap-2",
									children: [
										/* @__PURE__ */ jsx(Check, { className: "w-3.5 h-3.5 text-[#de4a2c]" }),
										" ",
										item.spec
									]
								}),
								/* @__PURE__ */ jsxs(Link, {
									href: "/contact",
									className: "inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider border-b border-neutral-900 pb-1 hover:text-[#de4a2c] hover:border-[#de4a2c] transition-colors",
									children: ["Request Discipline Sample ", /* @__PURE__ */ jsx(ArrowRight, { className: "w-3.5 h-3.5" })]
								})
							]
						})]
					}, item.num))
				})]
			}),
			/* @__PURE__ */ jsx("section", {
				className: "bg-neutral-900 text-white px-6 sm:px-12 py-20 font-sans",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-4xl mx-auto text-center",
					children: [
						/* @__PURE__ */ jsx("span", {
							className: "font-mono text-xs uppercase tracking-widest text-[#de4a2c] block mb-3",
							children: "ATELIER COMMISSION"
						}),
						/* @__PURE__ */ jsx("h2", {
							className: "font-serif text-3xl sm:text-5xl font-light mb-6",
							children: "Commission Your Test Production"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "font-serif text-neutral-400 text-base max-w-lg mx-auto mb-8",
							children: "Experience our sub-2h turnaround and pixel-clean vector paths on your own raw catalog imagery with zero cost."
						}),
						formSubmitted ? /* @__PURE__ */ jsx("div", {
							className: "p-4 bg-white/10 text-white font-mono text-xs",
							children: "Thank you. Our atelier director will contact you immediately."
						}) : /* @__PURE__ */ jsxs("form", {
							onSubmit: (e) => {
								e.preventDefault();
								setFormSubmitted(true);
							},
							className: "flex flex-col sm:flex-row gap-2 max-w-md mx-auto",
							children: [/* @__PURE__ */ jsx("input", {
								type: "email",
								required: true,
								placeholder: "Work email address",
								className: "flex-1 px-4 py-3 bg-neutral-800 border border-neutral-700 text-white text-xs font-mono focus:outline-none focus:border-white"
							}), /* @__PURE__ */ jsx("button", {
								type: "submit",
								className: "px-6 py-3 bg-white text-neutral-900 font-mono text-xs uppercase tracking-wider font-bold hover:bg-[#de4a2c] hover:text-white transition-colors",
								children: "Inquire Now"
							})]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "mt-12 font-mono text-[10px] text-neutral-500 uppercase tracking-widest",
							children: "© 2026 CUTTING EDGER ATELIER. EDITORIAL PROTOTYPE 10."
						})
					]
				})
			})
		]
	});
}
//#endregion
export { HomeAtelierEditorial };
