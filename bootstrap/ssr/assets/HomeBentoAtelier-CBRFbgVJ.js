import { useState } from "react";
import { Link } from "@inertiajs/react";
import { Camera, Eye, Scissors, Shirt, Sparkles, UserCheck } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/HomeVariants/HomeBentoAtelier.tsx
function HomeBentoAtelier({ clients = [] }) {
	const [activeGarment, setActiveGarment] = useState("coat");
	const garmentImages = {
		coat: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85",
		blouse: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85",
		jacket: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1000&q=85"
	};
	const [headshotSplit, setHeadshotSplit] = useState(50);
	const [activeEnv, setActiveEnv] = useState("marble");
	const envImages = {
		marble: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=85",
		sand: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1000&q=80",
		neon: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=85"
	};
	const [modelPose, setModelPose] = useState("runway");
	const [showWireframe, setShowWireframe] = useState(false);
	const [trialEmail, setTrialEmail] = useState("");
	const [trialSubmitted, setTrialSubmitted] = useState(false);
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-[#F8F9FA] text-[#0F172A] selection:bg-[#de4a2c] selection:text-white font-sans antialiased overflow-x-hidden",
		children: [
			/* @__PURE__ */ jsx("header", {
				className: "sticky top-4 z-40 max-w-7xl mx-auto px-4",
				children: /* @__PURE__ */ jsxs("div", {
					className: "rounded-2xl bg-white/90 backdrop-blur-md border border-neutral-200/80 shadow-xs px-6 py-3.5 flex items-center justify-between",
					children: [
						/* @__PURE__ */ jsxs(Link, {
							href: "/",
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx("span", {
								className: "w-7 h-7 rounded-lg bg-[#de4a2c] text-white flex items-center justify-center font-bold text-xs",
								children: "CE"
							}), /* @__PURE__ */ jsxs("span", {
								className: "font-extrabold text-sm tracking-tight text-neutral-900",
								children: ["CUTTING EDGER ", /* @__PURE__ */ jsx("span", {
									className: "font-mono text-neutral-400 font-normal text-xs ml-1",
									children: "Bento Atelier"
								})]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "hidden md:flex items-center gap-6 text-xs font-mono text-neutral-500",
							children: [
								/* @__PURE__ */ jsx("span", { children: "5 INTERACTIVE TILES" }),
								/* @__PURE__ */ jsx("span", { children: "< 2H BATCH SLA" }),
								/* @__PURE__ */ jsx("span", {
									className: "text-[#de4a2c] font-bold",
									children: "● 100% VECTOR PATHS"
								})
							]
						}),
						/* @__PURE__ */ jsx(Link, {
							href: "/contact",
							className: "px-4 py-2 rounded-xl bg-neutral-900 hover:bg-[#de4a2c] text-white text-xs font-semibold transition-colors",
							children: "Start Free Test"
						})
					]
				})
			}),
			/* @__PURE__ */ jsxs("main", {
				className: "py-12 px-4 sm:px-6 max-w-7xl mx-auto",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "text-center max-w-2xl mx-auto mb-10",
					children: [
						/* @__PURE__ */ jsx("span", {
							className: "text-xs font-mono uppercase tracking-widest text-[#de4a2c] font-bold inline-block mb-2",
							children: "INTERACTIVE BENTO WORKBENCH"
						}),
						/* @__PURE__ */ jsx("h1", {
							className: "text-3xl sm:text-5xl font-black tracking-tight text-neutral-950 mb-3",
							children: "Touch The Craft. Inspect The Output."
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-neutral-600 text-sm sm:text-base",
							children: "Every bento block below is a live simulation of our 5 production engines. Click toggles and drag handles to test precision."
						})
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "md:col-span-2 lg:col-span-2 md:row-span-2 rounded-3xl bg-white p-6 border border-neutral-200/90 shadow-sm flex flex-col justify-between relative overflow-hidden group",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "relative z-10",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between mb-3",
										children: [/* @__PURE__ */ jsxs("span", {
											className: "px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-mono text-[11px] font-bold border border-indigo-100 flex items-center gap-1.5",
											children: [/* @__PURE__ */ jsx(Sparkles, { className: "w-3 h-3" }), " S3 • 3D VIRTUAL TRY-ON"]
										}), /* @__PURE__ */ jsx("span", {
											className: "text-xs font-mono text-neutral-400",
											children: "4K WebGL Render"
										})]
									}),
									/* @__PURE__ */ jsx("h2", {
										className: "text-xl sm:text-2xl font-bold text-neutral-900 mb-1",
										children: "Anatomical Garment Fit Synthesis"
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-xs text-neutral-500 mb-4",
										children: "Toggle garments to witness dynamic seam tension and fabric drape on avatar."
									}),
									/* @__PURE__ */ jsx("div", {
										className: "flex items-center gap-2 mb-4",
										children: [
											"coat",
											"blouse",
											"jacket"
										].map((item) => /* @__PURE__ */ jsx("button", {
											onClick: () => setActiveGarment(item),
											className: `px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${activeGarment === item ? "bg-neutral-900 text-white shadow-sm" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"}`,
											children: item
										}, item))
									})
								]
							}), /* @__PURE__ */ jsxs("div", {
								className: "relative h-64 sm:h-80 rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-100 shadow-inner",
								children: [/* @__PURE__ */ jsx("img", {
									src: garmentImages[activeGarment],
									alt: "3D Try on",
									className: "w-full h-full object-cover transition-opacity duration-300"
								}), /* @__PURE__ */ jsxs("div", {
									className: "absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md text-[11px] font-mono font-bold text-neutral-800 shadow-xs",
									children: [
										"Active SKU: ",
										activeGarment.toUpperCase(),
										" // 0.2s Real-Time"
									]
								})]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "rounded-3xl bg-white p-5 border border-neutral-200/90 shadow-sm flex flex-col justify-between",
							children: [
								/* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between mb-2",
										children: [/* @__PURE__ */ jsx("span", {
											className: "px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-mono text-[10px] font-bold border border-blue-100",
											children: "S1 • AI HEADSHOTS"
										}), /* @__PURE__ */ jsx(UserCheck, { className: "w-4 h-4 text-blue-600" })]
									}),
									/* @__PURE__ */ jsx("h3", {
										className: "font-bold text-base text-neutral-900",
										children: "Selfie to Executive Studio"
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-[11px] text-neutral-500 mt-0.5 mb-3",
										children: "Drag slider to inspect lighting lock."
									})
								] }),
								/* @__PURE__ */ jsxs("div", {
									className: "relative h-44 rounded-2xl overflow-hidden bg-neutral-100 select-none",
									children: [
										/* @__PURE__ */ jsx("img", {
											src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=85",
											alt: "Executive",
											className: "absolute inset-0 w-full h-full object-cover"
										}),
										/* @__PURE__ */ jsx("div", {
											className: "absolute inset-0 overflow-hidden",
											style: { width: `${headshotSplit}%` },
											children: /* @__PURE__ */ jsx("img", {
												src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
												alt: "Selfie",
												className: "absolute inset-0 w-full h-full object-cover",
												style: {
													width: "280px",
													maxWidth: "none"
												}
											})
										}),
										/* @__PURE__ */ jsx("input", {
											type: "range",
											min: "0",
											max: "100",
											value: headshotSplit,
											onChange: (e) => setHeadshotSplit(Number(e.target.value)),
											className: "absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20",
											"aria-label": "Headshot slider"
										}),
										/* @__PURE__ */ jsx("div", {
											className: "absolute top-0 bottom-0 w-0.5 bg-white z-10 pointer-events-none",
											style: { left: `${headshotSplit}%` }
										})
									]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between text-[10px] font-mono text-neutral-400 mt-2",
									children: [/* @__PURE__ */ jsx("span", { children: "RAW SELFIE" }), /* @__PURE__ */ jsx("span", { children: "STUDIO GRADE" })]
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "rounded-3xl bg-white p-5 border border-neutral-200/90 shadow-sm flex flex-col justify-between",
							children: [/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between mb-2",
									children: [/* @__PURE__ */ jsx("span", {
										className: "px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-mono text-[10px] font-bold border border-amber-100",
										children: "S4 • SCENE GEN"
									}), /* @__PURE__ */ jsx(Camera, { className: "w-4 h-4 text-amber-600" })]
								}),
								/* @__PURE__ */ jsx("h3", {
									className: "font-bold text-base text-neutral-900",
									children: "Atmosphere Switcher"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "flex gap-1.5 my-2",
									children: [
										"marble",
										"sand",
										"neon"
									].map((env) => /* @__PURE__ */ jsx("button", {
										onClick: () => setActiveEnv(env),
										className: `px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all ${activeEnv === env ? "bg-neutral-900 text-white font-bold" : "bg-neutral-100 text-neutral-600"}`,
										children: env
									}, env))
								})
							] }), /* @__PURE__ */ jsxs("div", {
								className: "relative h-44 rounded-2xl overflow-hidden bg-neutral-100",
								children: [/* @__PURE__ */ jsx("img", {
									src: envImages[activeEnv],
									alt: "Product scene",
									className: "w-full h-full object-cover transition-all duration-300"
								}), /* @__PURE__ */ jsxs("div", {
									className: "absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-white font-mono text-[9px] uppercase",
									children: [activeEnv, " Setup"]
								})]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "rounded-3xl bg-white p-5 border border-neutral-200/90 shadow-sm flex flex-col justify-between",
							children: [/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between mb-2",
									children: [/* @__PURE__ */ jsx("span", {
										className: "px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 font-mono text-[10px] font-bold border border-rose-100",
										children: "S2 • RUNWAY"
									}), /* @__PURE__ */ jsx(Shirt, { className: "w-4 h-4 text-rose-600" })]
								}),
								/* @__PURE__ */ jsx("h3", {
									className: "font-bold text-base text-neutral-900",
									children: "Living Runway Diversity"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-[11px] text-neutral-500 mt-0.5 mb-3",
									children: "No casting or studio logistics needed."
								})
							] }), /* @__PURE__ */ jsxs("div", {
								className: "relative h-44 rounded-2xl overflow-hidden bg-neutral-100",
								children: [/* @__PURE__ */ jsx("img", {
									src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=85",
									alt: "Runway model",
									className: "w-full h-full object-cover hover:scale-105 transition-transform duration-500"
								}), /* @__PURE__ */ jsxs("div", {
									className: "absolute bottom-2 left-2 right-2 px-2.5 py-1 rounded-xl bg-white/90 backdrop-blur-md text-[10px] font-mono text-neutral-800 flex justify-between items-center",
									children: [/* @__PURE__ */ jsx("span", { children: "ETHNICITY: ADAPTIVE" }), /* @__PURE__ */ jsx("span", {
										className: "text-emerald-600 font-bold",
										children: "100% DRAPE"
									})]
								})]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "rounded-3xl bg-white p-5 border border-neutral-200/90 shadow-sm flex flex-col justify-between",
							children: [/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between mb-2",
									children: [/* @__PURE__ */ jsx("span", {
										className: "px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold border border-emerald-100",
										children: "S5 • PEN TOOL"
									}), /* @__PURE__ */ jsx(Scissors, { className: "w-4 h-4 text-emerald-600" })]
								}),
								/* @__PURE__ */ jsx("h3", {
									className: "font-bold text-base text-neutral-900",
									children: "±0.25px Vector Paths"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "flex items-center gap-2 my-2",
									children: /* @__PURE__ */ jsxs("button", {
										onClick: () => setShowWireframe(!showWireframe),
										className: "px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[10px] font-mono uppercase font-bold flex items-center gap-1",
										children: [/* @__PURE__ */ jsx(Eye, { className: "w-3 h-3" }), showWireframe ? "Show Polished" : "Inspect Path"]
									})
								})
							] }), /* @__PURE__ */ jsxs("div", {
								className: "relative h-44 rounded-2xl overflow-hidden bg-neutral-900",
								children: [/* @__PURE__ */ jsx("img", {
									src: showWireframe ? "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80" : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=85",
									alt: "Jewelry",
									className: "w-full h-full object-cover"
								}), /* @__PURE__ */ jsx("div", {
									className: "absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/70 text-white font-mono text-[9px]",
									children: showWireframe ? "RAW BÉZIER" : "16-BIT RETOUCH"
								})]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "md:col-span-2 lg:col-span-2 rounded-3xl bg-neutral-900 text-white p-6 shadow-md flex flex-col justify-between",
							children: [/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2 mb-2",
									children: [/* @__PURE__ */ jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" }), /* @__PURE__ */ jsx("span", {
										className: "font-mono text-xs text-neutral-400 uppercase tracking-wider",
										children: "RAPID FREE TRIAL LAB"
									})]
								}),
								/* @__PURE__ */ jsx("h3", {
									className: "text-xl sm:text-2xl font-bold mb-2",
									children: "Send 3 Test Images. Delivered In 2 Hours."
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-neutral-400 text-xs sm:text-sm mb-4",
									children: "No payment or commitment required. Test our human pen tool artists and neural engines on your real inventory."
								})
							] }), trialSubmitted ? /* @__PURE__ */ jsx("div", {
								className: "p-3.5 rounded-xl bg-white/10 text-emerald-400 font-mono text-xs font-bold",
								children: "✓ Check your inbox: upload link sent."
							}) : /* @__PURE__ */ jsxs("form", {
								onSubmit: (e) => {
									e.preventDefault();
									setTrialSubmitted(true);
								},
								className: "flex gap-2",
								children: [/* @__PURE__ */ jsx("input", {
									type: "email",
									required: true,
									value: trialEmail,
									onChange: (e) => setTrialEmail(e.target.value),
									placeholder: "name@company.com",
									className: "flex-1 px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#de4a2c]"
								}), /* @__PURE__ */ jsx("button", {
									type: "submit",
									className: "px-5 py-3 rounded-xl bg-[#de4a2c] hover:bg-white hover:text-neutral-900 text-white text-xs font-bold uppercase tracking-wider transition-colors",
									children: "Start Test"
								})]
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsx("footer", {
				className: "py-10 border-t border-neutral-200 text-center font-mono text-xs text-neutral-400",
				children: "© 2026 CUTTING EDGER ATELIER. BENTO ATELIER PROTOTYPE 12."
			})
		]
	});
}
//#endregion
export { HomeBentoAtelier };
