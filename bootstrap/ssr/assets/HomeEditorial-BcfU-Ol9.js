import { useRef, useState } from "react";
import { Link } from "@inertiajs/react";
import { ArrowRight, CheckCircle2, Eye, SlidersHorizontal } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/HomeVariants/HomeEditorial.tsx
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
var EDITORIAL_DISCIPLINES = [
	{
		code: "01",
		edition: "PLATE I // HOROLOGY",
		title: "The Specular Geometry of Timepieces",
		subtitle: "Diamond Facets & Metal Luster Retention",
		beforeImg: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80",
		afterImg: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85",
		beforeTag: "RAW STUDIO INGEST",
		afterTag: "SPECULAR MASTER FINISH",
		specs: "±0.25px Vector Paths • 16-Bit Adobe RGB"
	},
	{
		code: "02",
		edition: "PLATE II // COUTURE",
		title: "Sculptural Human Fabric Drape",
		subtitle: "Ghost Mannequin to Living Catwalk Editorial",
		beforeImg: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=80",
		afterImg: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85",
		beforeTag: "HOLLOW MANNEQUIN PLATE",
		afterTag: "LIVING MODEL EDITORIAL",
		specs: "Sub-2h Turnaround • Organic Drape"
	},
	{
		code: "03",
		edition: "PLATE III // PORTRAITURE",
		title: "Executive Studio Illumination",
		subtitle: "Smartphone Selfies to C-Suite Grade",
		beforeImg: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
		afterImg: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=85",
		beforeTag: "CASUAL MOBILE CAPTURE",
		afterTag: "EXECUTIVE STUDIO PORTRAIT",
		specs: "Identity Lock • Bespoke Backdrops"
	},
	{
		code: "04",
		edition: "PLATE IV // STILL LIFE",
		title: "Architectural Sunlit Environments",
		subtitle: "Tabletop Pack to Travertine Marble Caustics",
		beforeImg: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=80",
		afterImg: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=85",
		beforeTag: "PLAIN STUDIO CUTOUT",
		afterTag: "SUNLIT MARBLE ENVIRONMENT",
		specs: "Raytraced Shadows • 10K+ SKU Scale"
	},
	{
		code: "05",
		edition: "PLATE V // PHYSICS",
		title: "3D Anatomical Garment Tension",
		subtitle: "Flat Garment SKU to Digital Avatar Fit",
		beforeImg: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1200&q=80",
		afterImg: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85",
		beforeTag: "FLAT PRODUCT SKU",
		afterTag: "ANATOMICAL MODEL TRY-ON",
		specs: "4K WebGL Assets • 38% Return Reduction"
	}
];
function HomeEditorial({ clients = [] }) {
	const [activeIdx, setActiveIdx] = useState(0);
	const [sliderPos, setSliderPos] = useState(50);
	const [showRawHold, setShowRawHold] = useState(false);
	const [emailSubmitted, setEmailSubmitted] = useState(false);
	const [mouseOffset, setMouseOffset] = useState({
		x: 0,
		y: 0
	});
	const active = EDITORIAL_DISCIPLINES[activeIdx];
	const heroCardRef = useRef(null);
	const handleMouseMove = (e) => {
		if (!heroCardRef.current) return;
		const rect = heroCardRef.current.getBoundingClientRect();
		const x = (e.clientX - rect.left) / rect.width - .5;
		const y = (e.clientY - rect.top) / rect.height - .5;
		setMouseOffset({
			x,
			y
		});
	};
	const handleMouseLeave = () => {
		setMouseOffset({
			x: 0,
			y: 0
		});
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-[#F7F5F0] text-[#1D1B16] selection:bg-[#de4a2c] selection:text-white font-serif antialiased overflow-x-hidden relative",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "fixed inset-0 pointer-events-none select-none flex items-center justify-center opacity-[0.025] font-serif font-black text-[22vw] leading-none text-neutral-900 overflow-hidden",
				style: {
					transform: `translate(${mouseOffset.x * 25}px, ${mouseOffset.y * 25}px)`,
					transition: "transform 0.4s ease-out"
				},
				children: "ATELIER"
			}),
			/* @__PURE__ */ jsx("header", {
				className: "border-b border-[#E2DED4] pt-4 pb-3 px-6 sm:px-12 max-w-7xl mx-auto font-sans",
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between text-[11px] font-mono uppercase tracking-widest text-[#787367]",
					children: [
						/* @__PURE__ */ jsx(Link, {
							href: "/",
							className: "font-serif font-bold text-base tracking-tight text-[#16140F]",
							children: "Cutting Edger"
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "hidden sm:flex items-center gap-6",
							children: [
								/* @__PURE__ */ jsx("span", { children: "ISSUE NO. 03" }),
								/* @__PURE__ */ jsx("span", { children: "•" }),
								/* @__PURE__ */ jsx("span", { children: "PARIS / NEW YORK" }),
								/* @__PURE__ */ jsx("span", { children: "•" }),
								/* @__PURE__ */ jsx("span", {
									className: "text-[#de4a2c] font-bold",
									children: "5 CURATED DISCIPLINES"
								})
							]
						}),
						/* @__PURE__ */ jsx(Link, {
							href: "/contact",
							className: "px-4 py-1.5 rounded-full border border-[#16140F] hover:bg-[#16140F] hover:text-white text-[11px] font-bold uppercase tracking-wider transition-colors",
							children: "Request Batch"
						})
					]
				})
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "pt-4 sm:pt-6 pb-8 sm:pb-12 px-6 sm:px-12 max-w-7xl mx-auto relative z-10",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4 sm:mb-6 font-sans",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
							className: "inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#de4a2c] mb-1",
							children: /* @__PURE__ */ jsx("span", { children: "// ATELIER PHILOSOPHY & CRAFT" })
						}), /* @__PURE__ */ jsxs("h1", {
							className: "text-2xl sm:text-4xl lg:text-5xl font-serif text-[#16140F] leading-tight",
							children: [
								"The Pure Art of ",
								/* @__PURE__ */ jsx("em", {
									className: "italic text-[#de4a2c]",
									children: "Visual Refinement"
								}),
								"."
							]
						})] }), /* @__PURE__ */ jsx("p", {
							className: "text-xs sm:text-sm text-[#5A564C] max-w-sm font-sans leading-relaxed",
							children: "Where artisanal standards merge with enterprise scale. Drag slider below to inspect raw captures against finished plates."
						})]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "flex items-center gap-1.5 overflow-x-auto py-1 mb-4 max-w-full font-sans scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
						children: EDITORIAL_DISCIPLINES.map((item, idx) => /* @__PURE__ */ jsxs("button", {
							onClick: () => {
								setActiveIdx(idx);
								setSliderPos(50);
							},
							className: `px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all shrink-0 flex items-center gap-1.5 ${activeIdx === idx ? "bg-[#16140F] text-white shadow-sm" : "bg-white/80 border border-[#E2DED4] text-[#787367] hover:text-[#16140F] hover:bg-white"}`,
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-[#de4a2c]",
								children: item.code
							}), /* @__PURE__ */ jsx("span", {
								className: "truncate",
								children: item.edition.split("//")[1] || item.edition
							})]
						}, item.code))
					}),
					/* @__PURE__ */ jsxs("div", {
						ref: heroCardRef,
						onMouseMove: handleMouseMove,
						onMouseLeave: handleMouseLeave,
						className: "grid grid-cols-1 lg:grid-cols-12 gap-6 items-center",
						children: [/* @__PURE__ */ jsx("div", {
							className: "lg:col-span-8",
							children: /* @__PURE__ */ jsxs("div", {
								className: "relative rounded-3xl overflow-hidden shadow-2xl border border-[#E5E0D4] bg-white h-[320px] sm:h-[400px] lg:h-[440px] select-none group",
								style: {
									transform: `perspective(1000px) rotateY(${mouseOffset.x * 4}deg) rotateX(${-mouseOffset.y * 4}deg)`,
									transition: "transform 0.2s ease-out"
								},
								children: [
									/* @__PURE__ */ jsx("img", {
										src: active.afterImg,
										alt: active.title,
										className: "w-full h-full object-cover object-center"
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "absolute inset-0 overflow-hidden bg-neutral-900",
										style: { width: `${showRawHold ? 100 : sliderPos}%` },
										children: [/* @__PURE__ */ jsx("img", {
											src: active.beforeImg,
											alt: active.beforeTag,
											className: "w-full h-full object-cover object-center filter brightness-95",
											style: {
												width: `${heroCardRef.current?.clientWidth || 900}px`,
												maxWidth: "none"
											}
										}), /* @__PURE__ */ jsx("div", {
											className: "absolute top-4 left-4 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-[10px] font-mono uppercase tracking-wider font-bold",
											children: active.beforeTag
										})]
									}),
									/* @__PURE__ */ jsx("div", {
										className: "absolute top-4 right-4 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#16140F] text-[10px] font-mono uppercase tracking-wider shadow-sm font-bold border border-[#E5E0D4]",
										children: active.afterTag
									}),
									!showRawHold && /* @__PURE__ */ jsx("div", {
										className: "absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_15px_rgba(0,0,0,0.6)] z-20 pointer-events-none",
										style: { left: `${sliderPos}%` },
										children: /* @__PURE__ */ jsx("div", {
											className: "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-[#16140F] shadow-xl flex items-center justify-center font-bold text-xs border border-neutral-300",
											children: /* @__PURE__ */ jsx(SlidersHorizontal, { className: "w-3.5 h-3.5 text-[#de4a2c]" })
										})
									}),
									/* @__PURE__ */ jsx("input", {
										type: "range",
										min: "0",
										max: "100",
										value: sliderPos,
										onChange: (e) => setSliderPos(Number(e.target.value)),
										className: "absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30",
										"aria-label": "Editorial split slider"
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E5E0D4] shadow-lg flex flex-wrap items-center justify-between gap-3 text-xs font-sans z-20 pointer-events-none",
										style: {
											transform: `translate(${mouseOffset.x * -12}px, ${mouseOffset.y * -8}px)`,
											transition: "transform 0.25s ease-out"
										},
										children: [/* @__PURE__ */ jsxs("div", {
											className: "pointer-events-auto flex items-center gap-2",
											children: [/* @__PURE__ */ jsxs("button", {
												type: "button",
												onMouseDown: () => setShowRawHold(true),
												onMouseUp: () => setShowRawHold(false),
												onTouchStart: () => setShowRawHold(true),
												onTouchEnd: () => setShowRawHold(false),
												className: "px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-[#16140F] font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors select-none",
												children: [/* @__PURE__ */ jsx(Eye, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: showRawHold ? "Viewing Raw" : "Hold for Raw" })]
											}), /* @__PURE__ */ jsxs("span", {
												className: "text-[11px] font-mono text-neutral-500 hidden sm:inline",
												children: [sliderPos, "% Split"]
											})]
										}), /* @__PURE__ */ jsx("div", {
											className: "text-[11px] font-mono text-[#de4a2c] font-bold",
											children: active.specs
										})]
									})
								]
							})
						}), /* @__PURE__ */ jsxs("div", {
							className: "lg:col-span-4 space-y-4 font-sans",
							children: [
								/* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsx("div", {
										className: "text-[11px] font-mono text-[#de4a2c] font-bold uppercase tracking-widest mb-1",
										children: active.edition
									}),
									/* @__PURE__ */ jsx("h2", {
										className: "text-xl sm:text-2xl font-serif text-[#16140F] leading-snug",
										children: active.title
									}),
									/* @__PURE__ */ jsxs("p", {
										className: "text-xs text-[#5A564C] mt-2 leading-relaxed",
										children: [active.subtitle, " — meticulously retouched with vector Bézier pen paths and advanced tonal calibration."]
									})
								] }),
								/* @__PURE__ */ jsxs("div", {
									className: "border-t border-b border-[#E2DED4] py-3 text-xs space-y-2",
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ jsx("span", {
												className: "text-neutral-500 font-mono text-[11px]",
												children: "SLA DELIVERY:"
											}), /* @__PURE__ */ jsx("span", {
												className: "font-bold text-[#16140F] font-mono text-[11px]",
												children: "Sub-12 Hour Batch"
											})]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ jsx("span", {
												className: "text-neutral-500 font-mono text-[11px]",
												children: "COLOR ACCURACY:"
											}), /* @__PURE__ */ jsx("span", {
												className: "font-bold text-[#16140F] font-mono text-[11px]",
												children: "Delta-E < 1.0"
											})]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ jsx("span", {
												className: "text-neutral-500 font-mono text-[11px]",
												children: "HUMAN QA PASS:"
											}), /* @__PURE__ */ jsx("span", {
												className: "font-bold text-emerald-700 font-mono text-[11px]",
												children: "Dual Senior Pass"
											})]
										})
									]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "pt-1 flex flex-col sm:flex-row gap-2",
									children: [/* @__PURE__ */ jsxs(Link, {
										href: "/contact",
										className: "flex-1 px-5 py-2.5 rounded-full bg-[#16140F] hover:bg-[#de4a2c] text-white text-xs font-bold uppercase tracking-wider text-center transition-colors shadow-sm flex items-center justify-center gap-1.5",
										children: [/* @__PURE__ */ jsx("span", { children: "Request Sample" }), /* @__PURE__ */ jsx(ArrowRight, { className: "w-3.5 h-3.5" })]
									}), /* @__PURE__ */ jsx("a", {
										href: "#stories",
										className: "px-5 py-2.5 rounded-full border border-[#D5D0C2] hover:border-[#16140F] text-[#16140F] text-xs font-bold uppercase tracking-wider text-center transition-colors",
										children: "Atelier Notes"
									})]
								})
							]
						})]
					})
				]
			}),
			/* @__PURE__ */ jsx("section", {
				className: "border-y border-[#E2DED4] py-5 font-sans overflow-hidden",
				children: /* @__PURE__ */ jsx("div", {
					className: "max-w-7xl mx-auto px-6 flex items-center justify-between overflow-x-auto gap-8 text-[#787367] text-xs font-mono font-bold tracking-widest uppercase scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
					children: (clients.length > 0 ? clients.map((c) => c.name) : LUXURY_BRANDS).slice(0, 8).map((b, i) => /* @__PURE__ */ jsx("span", {
						className: "hover:text-[#16140F] transition-colors whitespace-nowrap",
						children: b
					}, i))
				})
			}),
			/* @__PURE__ */ jsxs("section", {
				id: "stories",
				className: "py-16 px-6 sm:px-12 max-w-7xl mx-auto font-sans",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "mb-12 text-center max-w-2xl mx-auto",
					children: [
						/* @__PURE__ */ jsx("span", {
							className: "text-xs font-mono uppercase tracking-widest text-[#de4a2c] font-bold block mb-1",
							children: "CURATED TECHNIQUES"
						}),
						/* @__PURE__ */ jsx("h2", {
							className: "text-3xl sm:text-4xl font-serif text-[#16140F]",
							children: "The Atelier Chronicles"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-xs sm:text-sm text-[#5A564C] mt-2 leading-relaxed",
							children: "A closer examination of the rigorous standards we apply across apparel, timepieces, and accessories."
						})
					]
				}), /* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-1 md:grid-cols-3 gap-6",
					children: EDITORIAL_DISCIPLINES.slice(0, 3).map((story, i) => /* @__PURE__ */ jsxs("div", {
						className: "rounded-3xl p-4 bg-white border border-[#E2DED4] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between",
						children: [/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("div", {
								className: "rounded-2xl overflow-hidden aspect-[4/3] bg-neutral-100 mb-4",
								children: /* @__PURE__ */ jsx("img", {
									src: story.afterImg,
									alt: story.title,
									className: "w-full h-full object-cover hover:scale-105 transition-transform duration-700"
								})
							}),
							/* @__PURE__ */ jsx("div", {
								className: "text-[10px] font-mono text-[#de4a2c] font-bold uppercase tracking-wider mb-1",
								children: story.edition
							}),
							/* @__PURE__ */ jsx("h3", {
								className: "text-lg font-serif text-[#16140F] leading-snug mb-2",
								children: story.title
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-xs text-[#5A564C] leading-relaxed line-clamp-2",
								children: story.subtitle
							})
						] }), /* @__PURE__ */ jsxs("div", {
							className: "pt-4 border-t border-[#E2DED4] mt-4 flex items-center justify-between text-xs",
							children: [/* @__PURE__ */ jsx("span", {
								className: "font-mono text-[10px] text-neutral-400",
								children: "12H MASTER SLA"
							}), /* @__PURE__ */ jsxs(Link, {
								href: "/contact",
								className: "font-bold uppercase tracking-wider text-[#16140F] hover:text-[#de4a2c] inline-flex items-center gap-1",
								children: ["Inspect ", /* @__PURE__ */ jsx(ArrowRight, { className: "w-3 h-3" })]
							})]
						})]
					}, i))
				})]
			}),
			/* @__PURE__ */ jsx("section", {
				id: "trial",
				className: "py-16 px-6 sm:px-12 max-w-3xl mx-auto font-sans text-center",
				children: /* @__PURE__ */ jsxs("div", {
					className: "rounded-3xl p-8 sm:p-10 bg-white border border-[#E2DED4] shadow-lg space-y-4",
					children: [
						/* @__PURE__ */ jsx("span", {
							className: "text-xs font-mono uppercase tracking-widest text-[#de4a2c] font-bold",
							children: "COMPLIMENTARY WORKSHOP"
						}),
						/* @__PURE__ */ jsx("h2", {
							className: "text-2xl sm:text-3xl font-serif text-[#16140F]",
							children: "Commission Your Atelier Sample"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-xs sm:text-sm text-[#5A564C] max-w-md mx-auto leading-relaxed",
							children: "Forward your raw product plate. Our senior retouchers return master print-ready assets within 12 hours under strict NDA."
						}),
						!emailSubmitted ? /* @__PURE__ */ jsxs("form", {
							onSubmit: (e) => {
								e.preventDefault();
								setEmailSubmitted(true);
							},
							className: "max-w-md mx-auto flex flex-col sm:flex-row gap-2 pt-2",
							children: [/* @__PURE__ */ jsx("input", {
								type: "email",
								required: true,
								placeholder: "Enter direct studio email...",
								className: "flex-1 px-4 py-2.5 rounded-full bg-[#F7F5F0] border border-[#D5D0C2] text-xs text-[#16140F] placeholder-[#8C877A] focus:outline-none focus:border-[#de4a2c]"
							}), /* @__PURE__ */ jsx("button", {
								type: "submit",
								className: "px-6 py-2.5 rounded-full bg-[#16140F] hover:bg-[#de4a2c] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm",
								children: "Begin Trial"
							})]
						}) : /* @__PURE__ */ jsxs("div", {
							className: "p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-center gap-2",
							children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4 text-emerald-600" }), /* @__PURE__ */ jsx("span", { children: "Invitation dispatched. Our production director will reply shortly." })]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { HomeEditorial };
