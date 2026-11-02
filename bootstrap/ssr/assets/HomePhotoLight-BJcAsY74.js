import { useState } from "react";
import { ArrowRight, CheckCircle2, Eye, Maximize2, ShieldCheck, Sparkles, Upload, X, Zap } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/HomeVariants/HomePhotoLight.tsx
var LUXURY_BRANDS = [
	"BALENCIAGA",
	"CARTIER",
	"SSENSE",
	"FARFETCH",
	"KITH",
	"JIL SANDER",
	"ACNE STUDIOS",
	"MONCLER"
];
var LIGHT_CATEGORIES = [
	"All Works",
	"AI Headshots",
	"Fashion Models",
	"Virtual Try-On",
	"Product Scenes",
	"High Jewelry"
];
var LOOKBOOK_WORKS = [
	{
		id: "lb-1",
		category: "Fashion Models",
		title: "Ghost Mannequin Cutout to Runway Living Model",
		client: "Acne Studios Catalog",
		turnaround: "2-Hour Batch Pipeline",
		beforeImg: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=80",
		afterImg: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85",
		beforeLabel: "Raw Studio Mannequin",
		afterLabel: "Living Model Editorial",
		accentTag: "S2 • APPAREL",
		specs: [
			"Zero model booking overhead",
			"Organic fabric fold dynamics",
			"3 Body diversity presets"
		]
	},
	{
		id: "lb-2",
		category: "AI Headshots",
		title: "Phone Selfies to Branded Executive Portraits",
		client: "Fintech Leadership (120 Seats)",
		turnaround: "Same-Day Delivery",
		beforeImg: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
		afterImg: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=85",
		beforeLabel: "Casual Phone Capture",
		afterLabel: "Executive Studio Portrait",
		accentTag: "S1 • HEADSHOTS",
		specs: [
			"Unified company lighting",
			"Custom branded backdrop",
			"Tailored business wardrobe"
		]
	},
	{
		id: "lb-3",
		category: "Product Scenes",
		title: "Raw Bottle Cutout to Architectural Sunlit Pedestal",
		client: "Maison Francis Kurkdjian",
		turnaround: "4-Hour Express Ingest",
		beforeImg: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80",
		afterImg: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=85",
		beforeLabel: "Plain Studio Isolation",
		afterLabel: "Natural Morning Sun Scene",
		accentTag: "S4 • SCENE GEN",
		specs: [
			"Raytraced contact shadows",
			"Caustic glass refraction",
			"Shopify & Amazon ready"
		]
	},
	{
		id: "lb-4",
		category: "Virtual Try-On",
		title: "Ghost Garment to Photorealistic Model Stretch Fit",
		client: "SSENSE Menswear",
		turnaround: "Real-Time Render Pipeline",
		beforeImg: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80",
		afterImg: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85",
		beforeLabel: "Flat SKU Garment",
		afterLabel: "Anatomical Model Fit",
		accentTag: "S3 • TRY-ON",
		specs: [
			"Seam & wrinkle alignment",
			"Accurate fabric tension",
			"4K marketplace export"
		]
	},
	{
		id: "lb-5",
		category: "High Jewelry",
		title: "Diamond Micro-Dust Ablation & Specular Facets",
		client: "Cartier Fine Timepieces",
		turnaround: "12-Hour Master SLA",
		beforeImg: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
		afterImg: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=85",
		beforeLabel: "Macro RAW Unretouched",
		afterLabel: "Specular Master Polish",
		accentTag: "S5 • JEWELRY",
		specs: [
			"±0.25px vector mask",
			"Micro-dust removal",
			"Brushed metal retention"
		]
	},
	{
		id: "lb-6",
		category: "Product Scenes",
		title: "Performance Sneaker Multi-Path Dynamic Shadow",
		client: "Nike Global Catalog",
		turnaround: "6-Hour Rush SLA",
		beforeImg: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
		afterImg: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=85",
		beforeLabel: "Raw Product Plate",
		afterLabel: "Dynamic Ground Shadow",
		accentTag: "S4 • FOOTWEAR",
		specs: [
			"Hand-drawn pen paths",
			"Multi-layer PSD alpha",
			"300% zoom edge accuracy"
		]
	}
];
function HomePhotoLight({ clients = [] }) {
	const [activeCategory, setActiveCategory] = useState("All Works");
	const [peekRawId, setPeekRawId] = useState(null);
	const [modalItem, setModalItem] = useState(null);
	const [modalSplit, setModalSplit] = useState(50);
	const [formSubmitted, setFormSubmitted] = useState(false);
	const filteredWorks = activeCategory === "All Works" ? LOOKBOOK_WORKS : LOOKBOOK_WORKS.filter((w) => w.category === activeCategory);
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-[#FBFBFA] text-[#111215] selection:bg-[#de4a2c] selection:text-white font-sans antialiased overflow-x-hidden",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "border-b border-neutral-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-40",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between text-xs",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse" }),
							/* @__PURE__ */ jsx("span", {
								className: "font-extrabold uppercase tracking-wide text-neutral-800",
								children: "Studio Visual Lookbook:"
							}),
							/* @__PURE__ */ jsx("span", {
								className: "text-neutral-500 hidden sm:inline",
								children: "Photo-Based Retouching & AI Synthesis Archive"
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3 font-mono text-[11px] text-neutral-500",
						children: [/* @__PURE__ */ jsx("span", { children: "2.4M+ ASSETS DELIVERED" }), /* @__PURE__ */ jsx("span", {
							className: "text-[#de4a2c] font-bold",
							children: "12H SLA"
						})]
					})]
				})
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "pt-16 pb-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "text-center max-w-3xl mx-auto mb-10",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-neutral-200 text-xs font-bold text-neutral-800 shadow-xs mb-4",
							children: [
								/* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-[#de4a2c]" }),
								/* @__PURE__ */ jsx("span", {
									className: "font-mono tracking-wider uppercase",
									children: "CLEAN LIGHT LOOKBOOK"
								}),
								/* @__PURE__ */ jsx("span", {
									className: "text-neutral-300",
									children: "•"
								}),
								/* @__PURE__ */ jsx("span", {
									className: "text-[#de4a2c]",
									children: "REAL PRODUCTION PROOF"
								})
							]
						}),
						/* @__PURE__ */ jsxs("h1", {
							className: "text-4xl sm:text-6xl font-black tracking-tight text-[#111215] leading-[1.08]",
							children: [
								"E-Commerce Imagery",
								" ",
								/* @__PURE__ */ jsx("span", {
									className: "text-transparent bg-clip-text bg-gradient-to-r from-[#de4a2c] to-[#c2381c]",
									children: "Perfected at Scale"
								})
							]
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-4 text-base sm:text-lg text-neutral-600 max-w-xl mx-auto leading-relaxed",
							children: "Browse real catalog transformations. Inspect raw files against high-fashion AI models, corporate headshots, and luxury jewelry polish."
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-8 flex flex-wrap items-center justify-center gap-3",
							children: [/* @__PURE__ */ jsxs("a", {
								href: "#lookbook-grid",
								className: "px-7 py-3.5 rounded-full bg-[#111215] hover:bg-[#de4a2c] text-white font-bold text-sm tracking-wide transition-all shadow-md flex items-center gap-2",
								children: [/* @__PURE__ */ jsx("span", { children: "Explore Photo Lookbook" }), /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })]
							}), /* @__PURE__ */ jsx("a", {
								href: "#test-sample",
								className: "px-6 py-3.5 rounded-full bg-white hover:bg-neutral-100 text-[#111215] font-bold text-sm transition-all border border-neutral-200 shadow-xs",
								children: "Test 3 Images Free"
							})]
						})
					]
				}), /* @__PURE__ */ jsx("div", {
					id: "lookbook-grid",
					className: "pt-6 flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none",
					children: LIGHT_CATEGORIES.map((cat) => /* @__PURE__ */ jsxs("button", {
						onClick: () => setActiveCategory(cat),
						className: `px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeCategory === cat ? "bg-[#111215] text-white shadow-md font-extrabold scale-102" : "bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-200/80 hover:bg-neutral-50 shadow-xs"}`,
						children: [/* @__PURE__ */ jsx("span", { children: cat }), cat !== "All Works" && /* @__PURE__ */ jsx("span", {
							className: `text-[10px] font-mono px-1.5 py-0.2 rounded-full ${activeCategory === cat ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-600"}`,
							children: LOOKBOOK_WORKS.filter((w) => w.category === cat).length
						})]
					}, cat))
				})]
			}),
			/* @__PURE__ */ jsx("section", {
				className: "pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto",
				children: /* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7",
					children: filteredWorks.map((item) => {
						const isPeeking = peekRawId === item.id;
						return /* @__PURE__ */ jsxs("div", {
							className: "group rounded-3xl overflow-hidden border border-neutral-200/90 bg-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "relative h-[360px] sm:h-[400px] w-full overflow-hidden select-none bg-neutral-100",
								children: [
									/* @__PURE__ */ jsx("img", {
										src: item.afterImg,
										alt: item.title,
										className: "w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
									}),
									/* @__PURE__ */ jsxs("div", {
										className: `absolute inset-0 transition-opacity duration-300 ${isPeeking ? "opacity-100" : "opacity-0"}`,
										children: [/* @__PURE__ */ jsx("img", {
											src: item.beforeImg,
											alt: item.beforeLabel,
											className: "w-full h-full object-cover filter brightness-90 contrast-95"
										}), /* @__PURE__ */ jsx("div", {
											className: "absolute top-4 left-4 px-3 py-1 rounded-full bg-amber-400 text-black text-[10px] font-mono font-black uppercase tracking-wider shadow-md",
											children: item.beforeLabel
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "absolute top-4 inset-x-4 flex items-center justify-between pointer-events-none",
										children: [/* @__PURE__ */ jsx("span", {
											className: "px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-mono font-extrabold text-neutral-800 border border-neutral-200 shadow-xs",
											children: item.accentTag
										}), /* @__PURE__ */ jsx("span", {
											className: "px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-extrabold",
											children: item.turnaround
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "absolute bottom-4 inset-x-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200",
										children: [/* @__PURE__ */ jsxs("button", {
											type: "button",
											onMouseDown: () => setPeekRawId(item.id),
											onMouseUp: () => setPeekRawId(null),
											onTouchStart: () => setPeekRawId(item.id),
											onTouchEnd: () => setPeekRawId(null),
											className: "px-3 py-1.5 rounded-xl bg-white/95 hover:bg-[#de4a2c] hover:text-white text-neutral-900 text-[11px] font-bold backdrop-blur-md flex items-center gap-1.5 transition-colors shadow-md border border-neutral-200",
											children: [/* @__PURE__ */ jsx(Eye, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: isPeeking ? "Showing Raw Input" : "Hold to Peek Raw" })]
										}), /* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: () => {
												setModalItem(item);
												setModalSplit(50);
											},
											className: "w-9 h-9 rounded-xl bg-white hover:bg-[#de4a2c] text-neutral-900 hover:text-white flex items-center justify-center transition-colors shadow-md border border-neutral-200",
											title: "Inspect interactive split slider",
											children: /* @__PURE__ */ jsx(Maximize2, { className: "w-4 h-4" })
										})]
									})
								]
							}), /* @__PURE__ */ jsxs("div", {
								className: "p-6 bg-white border-t border-neutral-100",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between text-xs font-mono text-neutral-400 mb-1.5",
										children: [/* @__PURE__ */ jsxs("span", { children: ["Client: ", /* @__PURE__ */ jsx("strong", {
											className: "text-neutral-800",
											children: item.client
										})] }), /* @__PURE__ */ jsx("span", {
											className: "text-[#de4a2c] font-bold",
											children: "100% Studio QA"
										})]
									}),
									/* @__PURE__ */ jsx("h3", {
										className: "text-lg font-bold text-neutral-900 group-hover:text-[#de4a2c] transition-colors leading-snug",
										children: item.title
									}),
									/* @__PURE__ */ jsx("div", {
										className: "mt-3.5 flex flex-wrap gap-1.5",
										children: item.specs.map((spec, i) => /* @__PURE__ */ jsxs("span", {
											className: "px-2 py-0.5 rounded-md bg-neutral-100 border border-neutral-200 text-[10px] text-neutral-600 font-medium",
											children: ["✓ ", spec]
										}, i))
									})
								]
							})]
						}, item.id);
					})
				})
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "py-10 border-y border-neutral-200 bg-white",
				children: [/* @__PURE__ */ jsx("div", {
					className: "max-w-7xl mx-auto px-4 text-center mb-6",
					children: /* @__PURE__ */ jsx("p", {
						className: "text-xs font-mono font-bold uppercase tracking-widest text-neutral-400",
						children: "Enterprise Post-Production Partner to Global Luxury Brands"
					})
				}), /* @__PURE__ */ jsx("div", {
					className: "max-w-7xl mx-auto px-4 flex items-center justify-center gap-8 sm:gap-14 flex-wrap text-neutral-400 font-mono font-bold text-xs uppercase tracking-widest",
					children: (clients.length > 0 ? clients.map((c) => c.name) : LUXURY_BRANDS).slice(0, 8).map((b, i) => /* @__PURE__ */ jsx("span", {
						className: "hover:text-neutral-900 transition-colors",
						children: b
					}, i))
				})]
			}),
			/* @__PURE__ */ jsx("section", {
				id: "test-sample",
				className: "py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto",
				children: /* @__PURE__ */ jsx("div", {
					className: "rounded-[36px] p-8 sm:p-14 bg-white border border-neutral-200/90 shadow-xl relative overflow-hidden",
					children: /* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 lg:grid-cols-12 gap-10 items-center",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "lg:col-span-6 space-y-4",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#de4a2c]/10 text-[#de4a2c] text-xs font-mono font-bold uppercase",
									children: [/* @__PURE__ */ jsx(Sparkles, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "COMPLIMENTARY CATALOG PILOT" })]
								}),
								/* @__PURE__ */ jsx("h2", {
									className: "text-3xl sm:text-5xl font-black text-[#111215] leading-tight",
									children: "Test 3 Product Images or Selfies Free"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-neutral-600 text-sm sm:text-base leading-relaxed",
									children: "Send us your unedited camera RAW, mannequin shots, or casual team selfies. We return production-ready assets with vector paths or AI scene environments in hours."
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-6 pt-2 text-xs text-neutral-500 font-medium",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-1.5",
										children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "w-4 h-4 text-emerald-600" }), /* @__PURE__ */ jsx("span", { children: "Strict NDA Protected" })]
									}), /* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-1.5",
										children: [/* @__PURE__ */ jsx(Zap, { className: "w-4 h-4 text-[#de4a2c]" }), /* @__PURE__ */ jsx("span", { children: "Same-Day 12H SLA" })]
									})]
								})
							]
						}), /* @__PURE__ */ jsx("div", {
							className: "lg:col-span-6",
							children: !formSubmitted ? /* @__PURE__ */ jsxs("form", {
								onSubmit: (e) => {
									e.preventDefault();
									setFormSubmitted(true);
								},
								className: "space-y-4 p-6 sm:p-8 rounded-3xl bg-[#FBFBFA] border border-neutral-200 shadow-sm",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "border-2 border-dashed border-neutral-300 hover:border-[#de4a2c] rounded-2xl p-8 text-center cursor-pointer transition-colors bg-white",
										children: [
											/* @__PURE__ */ jsx(Upload, { className: "w-8 h-8 text-[#de4a2c] mx-auto mb-2" }),
											/* @__PURE__ */ jsx("div", {
												className: "text-sm font-bold text-neutral-800",
												children: "Drop 1–3 RAW images or selfies here"
											}),
											/* @__PURE__ */ jsx("div", {
												className: "text-xs text-neutral-500 mt-0.5",
												children: "PSD, TIFF, CR3, JPG or PNG • Up to 50MB"
											})
										]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
										children: [/* @__PURE__ */ jsx("input", {
											type: "text",
											required: true,
											placeholder: "Brand or Studio Name",
											className: "px-4 py-3 rounded-xl bg-white border border-neutral-300 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#de4a2c]"
										}), /* @__PURE__ */ jsx("input", {
											type: "email",
											required: true,
											placeholder: "Work Email Address",
											className: "px-4 py-3 rounded-xl bg-white border border-neutral-300 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#de4a2c]"
										})]
									}),
									/* @__PURE__ */ jsxs("button", {
										type: "submit",
										className: "w-full py-4 rounded-xl bg-[#de4a2c] hover:bg-[#c2381c] text-white font-bold text-sm tracking-wide transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer",
										children: [/* @__PURE__ */ jsx("span", { children: "Request Free Sample Batch" }), /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })]
									})
								]
							}) : /* @__PURE__ */ jsxs("div", {
								className: "p-8 text-center rounded-3xl bg-emerald-50 border border-emerald-200 text-neutral-900 space-y-3",
								children: [
									/* @__PURE__ */ jsx(CheckCircle2, { className: "w-12 h-12 text-emerald-600 mx-auto" }),
									/* @__PURE__ */ jsx("h3", {
										className: "text-xl font-bold",
										children: "Sample Request Received"
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-xs sm:text-sm text-neutral-600 max-w-md mx-auto",
										children: "Our lead retoucher is processing your sample assets. Master files will be transmitted to your email within our 12-hour SLA."
									}),
									/* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => setFormSubmitted(false),
										className: "text-xs font-bold text-[#de4a2c] underline pt-2 inline-block cursor-pointer",
										children: "Upload another batch"
									})
								]
							})
						})]
					})
				})
			}),
			modalItem && /* @__PURE__ */ jsx("div", {
				onClick: () => setModalItem(null),
				className: "fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200",
				children: /* @__PURE__ */ jsxs("div", {
					onClick: (e) => e.stopPropagation(),
					className: "relative max-w-5xl w-full rounded-3xl overflow-hidden bg-white shadow-2xl flex flex-col max-h-[90vh]",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "p-4 sm:p-6 border-b border-neutral-200 flex items-center justify-between bg-neutral-50",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("span", {
								className: "text-xs font-mono font-bold text-[#de4a2c] uppercase",
								children: [modalItem.accentTag, " // LOOKBOOK CASE STUDY"]
							}), /* @__PURE__ */ jsx("h3", {
								className: "text-xl sm:text-2xl font-black text-neutral-900 mt-0.5",
								children: modalItem.title
							})] }), /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setModalItem(null),
								className: "w-10 h-10 rounded-full bg-white hover:bg-neutral-100 text-neutral-800 flex items-center justify-center transition-colors border border-neutral-200 shadow-xs",
								children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "relative h-[420px] sm:h-[520px] w-full select-none cursor-ew-resize bg-neutral-900 overflow-hidden",
							children: [
								/* @__PURE__ */ jsx("img", {
									src: modalItem.afterImg,
									alt: "Edited",
									className: "w-full h-full object-cover"
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "absolute inset-0 overflow-hidden",
									style: { clipPath: `inset(0 ${100 - modalSplit}% 0 0)` },
									children: [/* @__PURE__ */ jsx("img", {
										src: modalItem.beforeImg,
										alt: "Raw",
										className: "w-full h-full object-cover filter brightness-90"
									}), /* @__PURE__ */ jsx("span", {
										className: "absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-mono font-bold",
										children: modalItem.beforeLabel
									})]
								}),
								/* @__PURE__ */ jsx("div", {
									className: "absolute top-0 bottom-0 w-0.5 bg-white pointer-events-none shadow-[0_0_15px_rgba(255,255,255,0.8)]",
									style: { left: `${modalSplit}%` },
									children: /* @__PURE__ */ jsxs("div", {
										className: "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#de4a2c] text-white text-[10px] font-mono font-black uppercase tracking-wider shadow-xl flex items-center gap-1 border border-white",
										children: [
											/* @__PURE__ */ jsx("span", { children: "RAW" }),
											/* @__PURE__ */ jsx("span", {
												className: "opacity-40",
												children: "|"
											}),
											/* @__PURE__ */ jsx("span", { children: "EDITED" })
										]
									})
								}),
								/* @__PURE__ */ jsx("span", {
									className: "absolute top-4 right-4 px-3 py-1.5 rounded-full bg-[#de4a2c] text-white text-xs font-mono font-bold shadow-md",
									children: modalItem.afterLabel
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "p-4 sm:p-6 bg-white border-t border-neutral-200 flex flex-wrap items-center justify-between gap-4 text-xs",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ jsx("span", {
									className: "font-mono text-neutral-500 font-bold",
									children: "Drag slider to compare:"
								}), /* @__PURE__ */ jsx("input", {
									type: "range",
									min: "5",
									max: "95",
									value: modalSplit,
									onChange: (e) => setModalSplit(Number(e.target.value)),
									className: "accent-[#de4a2c] cursor-pointer w-44 h-2 bg-neutral-200 rounded-lg"
								})]
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setModalItem(null),
								className: "px-4 py-2 rounded-xl bg-[#de4a2c] hover:bg-[#c2381c] text-white font-bold transition-colors",
								children: "Close Comparison"
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { HomePhotoLight };
