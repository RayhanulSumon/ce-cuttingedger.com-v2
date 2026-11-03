import { useState } from "react";
import { Link } from "@inertiajs/react";
import { ArrowRight, ArrowUpRight, Camera, ChevronLeft, ChevronRight, Scissors, Shirt, SlidersHorizontal, Sparkles, UserCheck } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/HomeVariants/HomeParallaxHorizon.tsx
var PANORAMIC_SLIDES = [
	{
		id: "s1",
		code: "01",
		discipline: "AI Corporate Headshots",
		tagline: "Uniform Executive Portraits from Everyday Selfies",
		desc: "Transforms 6–10 natural selfies into high-end executive studio portraits with custom corporate backdrops.",
		beforeImg: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1400&q=80",
		afterImg: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1400&q=85",
		accent: "#3b82f6",
		icon: UserCheck
	},
	{
		id: "s2",
		code: "02",
		discipline: "AI Fashion Runway Models",
		tagline: "Ghost Mannequin Plates into Living Catwalk Models",
		desc: "Breathes dynamic human motion, tailored body diversity, and natural fabric creases into flat apparel cutouts.",
		beforeImg: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1400&q=80",
		afterImg: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=85",
		accent: "#ec4899",
		icon: Shirt
	},
	{
		id: "s3",
		code: "03",
		discipline: "3D Virtual Try-On Engine",
		tagline: "Instant Garment Tension & Anatomical Synthesis",
		desc: "Real-time 3D cloth wrap and seam tension simulation on digital avatars, lowering returns by 38%.",
		beforeImg: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1400&q=80",
		afterImg: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1400&q=85",
		accent: "#8b5cf6",
		icon: Sparkles
	},
	{
		id: "s4",
		code: "04",
		discipline: "Product Scene Generation",
		tagline: "Isolated Packs into Sunlit Travertine Environments",
		desc: "Generative physical caustics, architectural studio pedestals, and raytraced reflections for luxury goods.",
		beforeImg: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1400&q=80",
		afterImg: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1400&q=85",
		accent: "#f59e0b",
		icon: Camera
	},
	{
		id: "s5",
		code: "05",
		discipline: "Precision Pen Tool & Retouch",
		tagline: "Hand-Crafted Vector Paths & Specular Facets",
		desc: "300% zoom Bézier pen paths, micro-dust elimination, and non-destructive 16-bit delivery under strict NDAs.",
		beforeImg: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1400&q=80",
		afterImg: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1400&q=85",
		accent: "#10b981",
		icon: Scissors
	}
];
function HomeParallaxHorizon({ clients = [] }) {
	const [currentSlide, setCurrentSlide] = useState(0);
	const [sliderPos, setSliderPos] = useState(50);
	const [expandedCol, setExpandedCol] = useState(0);
	const [isAutoPlay, setIsAutoPlay] = useState(false);
	const [formDone, setFormDone] = useState(false);
	const active = PANORAMIC_SLIDES[currentSlide];
	const handleNext = () => {
		setCurrentSlide((prev) => (prev + 1) % PANORAMIC_SLIDES.length);
	};
	const handlePrev = () => {
		setCurrentSlide((prev) => (prev - 1 + PANORAMIC_SLIDES.length) % PANORAMIC_SLIDES.length);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-[#F4F5F7] text-[#0A0D14] selection:bg-[#de4a2c] selection:text-white font-sans antialiased overflow-x-hidden",
		children: [
			/* @__PURE__ */ jsx("header", {
				className: "border-b border-neutral-200/90 bg-white/90 backdrop-blur-md sticky top-0 z-40 px-6 py-3.5",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-7xl mx-auto flex items-center justify-between text-xs",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ jsxs(Link, {
							href: "/",
							className: "font-extrabold text-base tracking-tight text-neutral-900 flex items-center gap-2",
							children: [/* @__PURE__ */ jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-[#de4a2c]" }), "CUTTING EDGER"]
						}), /* @__PURE__ */ jsx("span", {
							className: "text-[11px] font-mono text-neutral-400 border-l border-neutral-300 pl-3 hidden sm:inline",
							children: "PARALLAX HORIZON // 05 DISCIPLINES"
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-6",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "hidden md:flex items-center gap-4 font-mono text-[11px] text-neutral-500",
							children: [
								/* @__PURE__ */ jsx("span", { children: "SLA: < 2H" }),
								/* @__PURE__ */ jsx("span", { children: "VECTOR: ±0.25PX" }),
								/* @__PURE__ */ jsx("span", {
									className: "text-emerald-600 font-bold",
									children: "● ACTIVE LAB"
								})
							]
						}), /* @__PURE__ */ jsx(Link, {
							href: "/contact",
							className: "px-4 py-2 rounded-full bg-neutral-900 text-white text-xs font-semibold hover:bg-[#de4a2c] transition-colors",
							children: "Book Free Trial"
						})]
					})]
				})
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "py-10 px-4 sm:px-8 max-w-7xl mx-auto",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between mb-6",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
							className: "text-xs font-mono uppercase tracking-widest text-[#de4a2c] font-bold",
							children: "CINEMATIC FILMSTRIP EXHIBITION"
						}), /* @__PURE__ */ jsx("h1", {
							className: "text-2xl sm:text-4xl font-black tracking-tight text-neutral-900 mt-0.5",
							children: "Interactive 5-Pillar Horizon"
						})] }), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ jsxs("span", {
									className: "font-mono text-xs text-neutral-500 mr-2",
									children: [active.code, " / 05"]
								}),
								/* @__PURE__ */ jsx("button", {
									onClick: handlePrev,
									className: "w-9 h-9 rounded-full bg-white border border-neutral-300 shadow-xs flex items-center justify-center hover:bg-neutral-100 transition-colors",
									"aria-label": "Previous slide",
									children: /* @__PURE__ */ jsx(ChevronLeft, { className: "w-4 h-4" })
								}),
								/* @__PURE__ */ jsx("button", {
									onClick: handleNext,
									className: "w-9 h-9 rounded-full bg-neutral-900 text-white shadow-xs flex items-center justify-center hover:bg-[#de4a2c] transition-colors",
									"aria-label": "Next slide",
									children: /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4" })
								})
							]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "relative h-[480px] sm:h-[600px] rounded-3xl overflow-hidden bg-neutral-900 shadow-2xl border border-neutral-300/80 group",
						children: [
							/* @__PURE__ */ jsx("img", {
								src: active.afterImg,
								alt: active.tagline,
								className: "absolute inset-0 w-full h-full object-cover object-center"
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "absolute inset-0 overflow-hidden",
								style: { width: `${sliderPos}%` },
								children: [/* @__PURE__ */ jsx("img", {
									src: active.beforeImg,
									alt: "Raw Input",
									className: "absolute inset-0 w-full h-full object-cover object-center",
									style: {
										width: "100vw",
										maxWidth: "none"
									}
								}), /* @__PURE__ */ jsx("div", {
									className: "absolute top-5 left-5 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-white text-[11px] font-mono uppercase tracking-wider",
									children: "RAW CAPTURE"
								})]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "absolute top-5 right-5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-neutral-900 text-[11px] font-mono uppercase tracking-wider shadow-md",
								children: "MASTER ATELIER FINISH"
							}),
							/* @__PURE__ */ jsx("div", {
								className: "absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_20px_rgba(0,0,0,0.8)] z-20 pointer-events-none",
								style: { left: `${sliderPos}%` },
								children: /* @__PURE__ */ jsx("div", {
									className: "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-neutral-900 shadow-xl flex items-center justify-center text-xs font-bold border border-neutral-300",
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
								"aria-label": "Split slider"
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-white/90 backdrop-blur-xl border border-white/80 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-20 pointer-events-none",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2 mb-1",
									children: [/* @__PURE__ */ jsxs("span", {
										className: "px-2 py-0.5 rounded-md bg-[#de4a2c] text-white font-mono text-[10px] font-bold",
										children: ["PILLAR ", active.code]
									}), /* @__PURE__ */ jsx("span", {
										className: "font-mono text-xs text-neutral-500 uppercase tracking-wide",
										children: active.discipline
									})]
								}), /* @__PURE__ */ jsx("h2", {
									className: "text-lg sm:text-xl font-extrabold text-neutral-950",
									children: active.tagline
								})] }), /* @__PURE__ */ jsx("div", {
									className: "pointer-events-auto flex items-center gap-3",
									children: /* @__PURE__ */ jsxs(Link, {
										href: "/contact",
										className: "px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-[#de4a2c] text-white text-xs font-semibold tracking-wide transition-colors shadow-sm inline-flex items-center gap-2",
										children: ["Order Free Test ", /* @__PURE__ */ jsx(ArrowRight, { className: "w-3.5 h-3.5" })]
									})
								})]
							})
						]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-5 gap-3 mt-4",
						children: PANORAMIC_SLIDES.map((s, idx) => /* @__PURE__ */ jsxs("button", {
							onClick: () => setCurrentSlide(idx),
							className: `h-20 sm:h-24 rounded-2xl overflow-hidden relative border transition-all text-left group ${currentSlide === idx ? "ring-2 ring-[#de4a2c] border-[#de4a2c]" : "opacity-70 hover:opacity-100 border-neutral-300"}`,
							children: [/* @__PURE__ */ jsx("img", {
								src: s.afterImg,
								alt: s.discipline,
								className: "w-full h-full object-cover"
							}), /* @__PURE__ */ jsxs("div", {
								className: "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-2 flex flex-col justify-end text-white",
								children: [/* @__PURE__ */ jsx("span", {
									className: "font-mono text-[10px] font-bold text-amber-400",
									children: s.code
								}), /* @__PURE__ */ jsx("span", {
									className: "text-[11px] font-bold leading-tight truncate",
									children: s.discipline
								})]
							})]
						}, s.id))
					})
				]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "py-16 px-4 sm:px-8 max-w-7xl mx-auto",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "mb-8",
					children: [/* @__PURE__ */ jsx("div", {
						className: "text-xs font-mono uppercase tracking-widest text-[#de4a2c] font-bold mb-1",
						children: "FULL SERVICE SPECTRUM"
					}), /* @__PURE__ */ jsx("h2", {
						className: "text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight",
						children: "Hover to Expand Any Pillar"
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "h-[460px] flex flex-col sm:flex-row gap-2 rounded-3xl overflow-hidden bg-neutral-200 p-2 shadow-inner",
					children: PANORAMIC_SLIDES.map((col, idx) => {
						const isExp = expandedCol === idx;
						return /* @__PURE__ */ jsxs("div", {
							onMouseEnter: () => setExpandedCol(idx),
							className: `relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ease-out flex flex-col justify-end p-6 ${isExp ? "sm:flex-[4] flex-[3]" : "sm:flex-[1] flex-[1]"}`,
							children: [
								/* @__PURE__ */ jsx("img", {
									src: col.afterImg,
									alt: col.discipline,
									className: "absolute inset-0 w-full h-full object-cover"
								}),
								/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" }),
								/* @__PURE__ */ jsxs("div", {
									className: "relative z-10 text-white",
									children: [
										/* @__PURE__ */ jsxs("span", {
											className: "font-mono text-xs font-bold text-[#de4a2c] block mb-1",
											children: [col.code, " //"]
										}),
										/* @__PURE__ */ jsx("h3", {
											className: "font-bold text-lg sm:text-xl leading-tight mb-2",
											children: col.discipline
										}),
										isExp && /* @__PURE__ */ jsxs("div", {
											className: "animate-in fade-in duration-300",
											children: [/* @__PURE__ */ jsx("p", {
												className: "text-xs text-neutral-300 max-w-md mb-4 line-clamp-2",
												children: col.desc
											}), /* @__PURE__ */ jsxs(Link, {
												href: "/contact",
												className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-neutral-900 text-xs font-bold hover:bg-[#de4a2c] hover:text-white transition-colors",
												children: ["Explore Service ", /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-3.5 h-3.5" })]
											})]
										})
									]
								})
							]
						}, col.id);
					})
				})]
			}),
			/* @__PURE__ */ jsx("footer", {
				className: "border-t border-neutral-300/80 bg-white py-16 px-6",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-4xl mx-auto text-center",
					children: [
						/* @__PURE__ */ jsx("h2", {
							className: "text-2xl sm:text-3xl font-extrabold text-neutral-950 mb-3",
							children: "Start Your First Free Batch Now"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-neutral-500 text-sm max-w-md mx-auto mb-6",
							children: "Upload up to 3 test files. Our artists and automated pipeline deliver master PSDs under strict NDA."
						}),
						formDone ? /* @__PURE__ */ jsx("div", {
							className: "p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold font-mono",
							children: "Request received. An engineer will initiate your upload channel."
						}) : /* @__PURE__ */ jsxs("form", {
							onSubmit: (e) => {
								e.preventDefault();
								setFormDone(true);
							},
							className: "flex flex-col sm:flex-row gap-2 max-w-md mx-auto",
							children: [/* @__PURE__ */ jsx("input", {
								type: "email",
								required: true,
								placeholder: "Work email address",
								className: "flex-1 px-4 py-3 rounded-xl bg-neutral-100 border border-neutral-300 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#de4a2c]"
							}), /* @__PURE__ */ jsx("button", {
								type: "submit",
								className: "px-6 py-3 rounded-xl bg-[#de4a2c] text-white font-bold text-xs uppercase tracking-wider hover:bg-neutral-900 transition-colors",
								children: "Send 3 Free Test"
							})]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "text-[11px] font-mono text-neutral-400 mt-8",
							children: "© 2026 CUTTING EDGER ATELIER. PARALLAX HORIZON PROTOTYPE 11."
						})
					]
				})
			})
		]
	});
}
//#endregion
export { HomeParallaxHorizon };
