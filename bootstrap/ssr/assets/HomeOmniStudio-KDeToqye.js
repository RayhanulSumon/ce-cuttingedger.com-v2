import { useRef, useState } from "react";
import { Link } from "@inertiajs/react";
import { ArrowRight, MoveHorizontal, Shirt, Sliders, Sparkles } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/HomeVariants/HomeOmniStudio.tsx
var MODELS_DATA = {
	female: {
		gender: "female",
		name: "Maya V.",
		specs: "5'11\" (180 cm) • Size Small • Editorial Fashion",
		avatar: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=300&q=80",
		outfits: [
			{
				id: "f-1",
				name: "Terracotta Ribbed Knit",
				category: "Knitwear",
				fabric: "Heavy 7-Gauge 100% Merino Wool",
				flatImage: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=85",
				modelImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=90",
				hotspot: {
					x: 52,
					y: 36,
					label: "Ribbed Knit Drape"
				},
				specs: {
					drape: "99.4% physics match",
					seam: "Sub-millimeter collar ribbing"
				}
			},
			{
				id: "f-2",
				name: "Gabardine Double Trench",
				category: "Outerwear",
				fabric: "Weatherproof Cotton Gabardine",
				flatImage: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=85",
				modelImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=90",
				hotspot: {
					x: 50,
					y: 38,
					label: "Tailored Lapel Fit"
				},
				specs: {
					drape: "99.7% fluid movement",
					seam: "Epaulette & horn button alignment"
				}
			},
			{
				id: "f-3",
				name: "Streetwear Loopback Hoodie",
				category: "Streetwear",
				fabric: "Heavy 420 GSM Loopback Fleece",
				flatImage: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=900&q=85",
				modelImage: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1400&q=90",
				hotspot: {
					x: 50,
					y: 34,
					label: "Oversized Silhouette"
				},
				specs: {
					drape: "98.9% natural slouch",
					seam: "Double-needle kangaroo pocket"
				}
			},
			{
				id: "f-4",
				name: "Editorial Tailored Blazer",
				category: "Tailoring",
				fabric: "14oz High-Twist Wool Crepe",
				flatImage: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=85",
				modelImage: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1400&q=90",
				hotspot: {
					x: 50,
					y: 42,
					label: "Structured Waistline"
				},
				specs: {
					drape: "99.5% canvas form",
					seam: "Flap pocket & peaked lapel"
				}
			},
			{
				id: "f-5",
				name: "Boxy Heavyweight Top",
				category: "Tops",
				fabric: "280 GSM Combed Cotton",
				flatImage: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=85",
				modelImage: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1400&q=90",
				hotspot: {
					x: 50,
					y: 38,
					label: "Drop Shoulder Fit"
				},
				specs: {
					drape: "98.8% relaxed drape",
					seam: "1\" high-density collar band"
				}
			}
		]
	},
	male: {
		gender: "male",
		name: "Leo S.",
		specs: "6'1\" (185 cm) • Size Large • Athletic Modern",
		avatar: "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=300&q=80",
		outfits: [
			{
				id: "m-1",
				name: "French Terry Street Hoodie",
				category: "Streetwear",
				fabric: "Heavy 450 GSM Organic Cotton",
				flatImage: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=900&q=85",
				modelImage: "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=1400&q=90",
				hotspot: {
					x: 50,
					y: 35,
					label: "Chest Tension Fit"
				},
				specs: {
					drape: "99.1% athletic drape",
					seam: "Reinforced ribbed cuffs & hem"
				}
			},
			{
				id: "m-2",
				name: "Tailored Wool Overcoat",
				category: "Outerwear",
				fabric: "Double-Faced Wool Melange",
				flatImage: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=85",
				modelImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1400&q=90",
				hotspot: {
					x: 50,
					y: 40,
					label: "Shoulder Pad Architecture"
				},
				specs: {
					drape: "99.8% razor sharp drop",
					seam: "Hand-finished pick-stitch lapels"
				}
			},
			{
				id: "m-3",
				name: "Terracotta Ribbed Knit",
				category: "Knitwear",
				fabric: "100% Extrafine Merino Wool",
				flatImage: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=85",
				modelImage: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1400&q=90",
				hotspot: {
					x: 50,
					y: 37,
					label: "Textured Knit Drape"
				},
				specs: {
					drape: "99.5% elastic memory",
					seam: "Seamless linked armholes"
				}
			},
			{
				id: "m-4",
				name: "Casual Denim & Heavy Shirt",
				category: "Casual",
				fabric: "12oz Slub Indigo Denim",
				flatImage: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=85",
				modelImage: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1400&q=90",
				hotspot: {
					x: 50,
					y: 44,
					label: "Relaxed Waist & Seams"
				},
				specs: {
					drape: "99.0% natural break",
					seam: "Chainstitched hem & copper rivets"
				}
			},
			{
				id: "m-5",
				name: "Urban Canvas Chore Jacket",
				category: "Workwear",
				fabric: "12oz Washed Duck Canvas",
				flatImage: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=85",
				modelImage: "https://images.unsplash.com/photo-1506634572416-48cdfe530110?auto=format&fit=crop&w=1400&q=90",
				hotspot: {
					x: 50,
					y: 38,
					label: "Boxy Workwear Cut"
				},
				specs: {
					drape: "99.3% canvas fold physics",
					seam: "Triple-needle felled chainstitch"
				}
			}
		]
	}
};
function HomeOmniStudio({ clients = [] }) {
	const [selectedGender, setSelectedGender] = useState("female");
	const [selectedOutfitIndex, setSelectedOutfitIndex] = useState(0);
	const [sliderPosition, setSliderPosition] = useState(50);
	const [isDressingUp, setIsDressingUp] = useState(false);
	const [activeTab, setActiveTab] = useState("All");
	const [showToast, setShowToast] = useState(false);
	const [mousePos, setMousePos] = useState({
		x: 0,
		y: 0,
		pctX: 50,
		pctY: 50
	});
	const stageRef = useRef(null);
	const animFrameRef = useRef(null);
	const currentModel = MODELS_DATA[selectedGender];
	const activeOutfit = currentModel.outfits[selectedOutfitIndex] || currentModel.outfits[0];
	const categories = ["All", ...Array.from(new Set(currentModel.outfits.map((o) => o.category)))];
	const filteredOutfits = activeTab === "All" ? currentModel.outfits : currentModel.outfits.filter((o) => o.category === activeTab);
	const handleSelectOutfit = (outfitId) => {
		const idx = currentModel.outfits.findIndex((o) => o.id === outfitId);
		if (idx === -1 || idx === selectedOutfitIndex) return;
		setIsDressingUp(true);
		setSelectedOutfitIndex(idx);
		setShowToast(true);
		setTimeout(() => {
			setIsDressingUp(false);
		}, 400);
		setTimeout(() => {
			setShowToast(false);
		}, 3200);
	};
	const handleSwitchGender = (g) => {
		if (g === selectedGender) return;
		setIsDressingUp(true);
		setSelectedGender(g);
		setSelectedOutfitIndex(0);
		setActiveTab("All");
		setTimeout(() => {
			setIsDressingUp(false);
		}, 400);
	};
	const handleMouseMove = (e) => {
		if (!stageRef.current) return;
		const rect = stageRef.current.getBoundingClientRect();
		const x = (e.clientX - rect.left) / rect.width - .5;
		const y = (e.clientY - rect.top) / rect.height - .5;
		const pctX = (e.clientX - rect.left) / rect.width * 100;
		const pctY = (e.clientY - rect.top) / rect.height * 100;
		if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
		animFrameRef.current = requestAnimationFrame(() => {
			setMousePos({
				x,
				y,
				pctX,
				pctY
			});
		});
	};
	const handleMouseLeave = () => {
		setMousePos({
			x: 0,
			y: 0,
			pctX: 50,
			pctY: 50
		});
	};
	const handleSliderMove = (clientX, target) => {
		const rect = target.getBoundingClientRect();
		const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
		const percent = Math.round(x / rect.width * 100);
		setSliderPosition(percent);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-[#FDFDFC] text-[#111318] selection:bg-black selection:text-white font-sans antialiased flex flex-col justify-between overflow-x-hidden",
		children: [
			showToast && /* @__PURE__ */ jsx("div", {
				className: "fixed top-20 right-6 z-50 animate-in fade-in slide-in-from-top-3 duration-200 pointer-events-none",
				children: /* @__PURE__ */ jsxs("div", {
					className: "bg-[#111318]/95 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3 text-xs font-mono",
					children: [/* @__PURE__ */ jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-[#10b981] animate-ping" }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
						className: "font-bold text-white",
						children: "4K AI Try-On Fitted: "
					}), /* @__PURE__ */ jsxs("span", {
						className: "text-neutral-300",
						children: [
							activeOutfit.name,
							" on ",
							currentModel.name
						]
					})] })]
				})
			}),
			/* @__PURE__ */ jsxs("header", {
				className: "border-b border-black/[0.06] bg-white/80 backdrop-blur-md sticky top-0 z-40 px-6 sm:px-12 py-3.5 flex items-center justify-between",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3",
						children: [
							/* @__PURE__ */ jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-[#de4a2c] animate-pulse" }),
							/* @__PURE__ */ jsx("span", {
								className: "font-display text-sm sm:text-base font-bold tracking-tight text-neutral-900",
								children: "CUTTING EDGER"
							}),
							/* @__PURE__ */ jsx("span", {
								className: "text-neutral-300",
								children: "/"
							}),
							/* @__PURE__ */ jsx("span", {
								className: "text-xs font-mono uppercase tracking-wider text-neutral-500 hidden sm:inline",
								children: "Virtual Try-On Studio (S3)"
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "inline-flex rounded-full bg-neutral-100 p-1 border border-black/5 text-xs font-mono shadow-inner",
						children: [/* @__PURE__ */ jsxs("button", {
							onClick: () => handleSwitchGender("female"),
							className: `px-4 py-1.5 rounded-full transition-all flex items-center gap-2 ${selectedGender === "female" ? "bg-black text-white font-bold shadow-sm" : "text-neutral-600 hover:text-black"}`,
							children: [/* @__PURE__ */ jsx("span", { children: "♀ Female Model" }), /* @__PURE__ */ jsx("span", {
								className: "text-[10px] text-neutral-400",
								children: "Maya"
							})]
						}), /* @__PURE__ */ jsxs("button", {
							onClick: () => handleSwitchGender("male"),
							className: `px-4 py-1.5 rounded-full transition-all flex items-center gap-2 ${selectedGender === "male" ? "bg-black text-white font-bold shadow-sm" : "text-neutral-600 hover:text-black"}`,
							children: [/* @__PURE__ */ jsx("span", { children: "♂ Male Model" }), /* @__PURE__ */ jsx("span", {
								className: "text-[10px] text-neutral-400",
								children: "Leo"
							})]
						})]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "flex items-center gap-3",
						children: /* @__PURE__ */ jsxs(Link, {
							href: "/#free-sample",
							className: "px-4 py-2 rounded-full bg-[#de4a2c] hover:bg-[#c93f24] text-white text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-sm",
							children: [/* @__PURE__ */ jsx("span", { children: "Test 3 SKUs Free" }), /* @__PURE__ */ jsx(ArrowRight, { className: "w-3.5 h-3.5" })]
						})
					})
				]
			}),
			/* @__PURE__ */ jsxs("main", {
				className: "flex-1 max-w-[1520px] mx-auto w-full px-4 sm:px-8 py-6 sm:py-8 flex flex-col justify-center",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between mb-4 px-2 text-xs font-mono",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2 text-neutral-600",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "font-bold text-neutral-900 uppercase",
								children: "Casting:"
							}),
							/* @__PURE__ */ jsx("span", {
								className: "font-bold text-black",
								children: currentModel.name
							}),
							/* @__PURE__ */ jsx("span", {
								className: "text-neutral-300",
								children: "•"
							}),
							/* @__PURE__ */ jsx("span", {
								className: "text-neutral-500 hidden sm:inline",
								children: currentModel.specs
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2 text-neutral-600",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "font-bold text-neutral-900 uppercase",
								children: "Dressed In:"
							}),
							/* @__PURE__ */ jsx("span", {
								className: "text-[#de4a2c] font-bold",
								children: activeOutfit.name
							}),
							/* @__PURE__ */ jsx("span", {
								className: "text-neutral-300",
								children: "•"
							}),
							/* @__PURE__ */ jsx("span", {
								className: "text-neutral-400 hidden sm:inline",
								children: activeOutfit.specs.drape
							})
						]
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-stretch",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "lg:col-span-8 xl:col-span-8 bg-white rounded-3xl border border-black/10 shadow-2xl p-4 sm:p-6 flex flex-col justify-between relative overflow-hidden",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between pb-3 mb-3 border-b border-black/[0.06] text-xs font-mono",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2 text-neutral-600",
									children: [
										/* @__PURE__ */ jsx(Sliders, { className: "w-4 h-4 text-[#de4a2c]" }),
										/* @__PURE__ */ jsx("span", {
											className: "font-bold text-neutral-900 uppercase",
											children: "Drape & Fabric Inspection:"
										}),
										/* @__PURE__ */ jsx("span", {
											className: "hidden sm:inline",
											children: "Drag split slider or move mouse for 60fps 3D depth"
										})
									]
								}), /* @__PURE__ */ jsxs("div", {
									className: "text-[11px] font-bold text-[#de4a2c] flex items-center gap-1.5",
									children: [/* @__PURE__ */ jsx(MoveHorizontal, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsxs("span", { children: [
										"Split: ",
										sliderPosition,
										"%"
									] })]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								ref: stageRef,
								onMouseMove: handleMouseMove,
								onMouseLeave: handleMouseLeave,
								className: "relative w-full h-[580px] sm:h-[680px] md:h-[740px] xl:h-[780px] rounded-2xl overflow-hidden bg-neutral-900 select-none shadow-2xl border border-black/10 cursor-ew-resize group",
								onMouseDown: (e) => handleSliderMove(e.clientX, stageRef.current),
								onTouchMove: (e) => {
									if (e.touches[0] && stageRef.current) handleSliderMove(e.touches[0].clientX, stageRef.current);
								},
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "absolute inset-0 pointer-events-none z-30 transition-opacity duration-300",
										style: { background: `radial-gradient(circle 420px at ${mousePos.pctX}% ${mousePos.pctY}%, rgba(255,255,255,0.22) 0%, transparent 70%)` }
									}),
									isDressingUp && /* @__PURE__ */ jsx("div", { className: "absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#de4a2c] to-transparent shadow-[0_0_24px_#de4a2c] z-40 animate-pulse top-1/2 -translate-y-1/2 pointer-events-none" }),
									/* @__PURE__ */ jsxs("div", {
										style: {
											transform: `perspective(1200px) rotateY(${mousePos.x * 6}deg) rotateX(${-mousePos.y * 4}deg) scale(1.02)`,
											transition: "transform 0.15s ease-out"
										},
										className: `absolute inset-0 w-full h-full transition-all duration-300 ${isDressingUp ? "opacity-40 scale-[0.99] filter blur-sm" : "opacity-100 scale-100 filter blur-0"}`,
										children: [
											/* @__PURE__ */ jsx("img", {
												src: activeOutfit.modelImage,
												alt: `${currentModel.name} dressed in ${activeOutfit.name}`,
												className: "w-full h-full object-cover object-top select-none pointer-events-none",
												draggable: false
											}),
											/* @__PURE__ */ jsx("div", {
												style: {
													left: `${activeOutfit.hotspot.x}%`,
													top: `${activeOutfit.hotspot.y}%`
												},
												className: "absolute -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none",
												children: /* @__PURE__ */ jsxs("div", {
													className: "relative flex items-center justify-center",
													children: [/* @__PURE__ */ jsx("span", { className: "w-8 h-8 rounded-full bg-white/70 animate-ping absolute" }), /* @__PURE__ */ jsx("span", {
														className: "px-3.5 py-1.5 rounded-full bg-black/85 backdrop-blur-md text-white font-mono text-[11px] font-bold shadow-2xl border border-white/20",
														children: activeOutfit.hotspot.label
													})]
												})
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "absolute top-4 right-4 z-20 px-3.5 py-1.5 rounded-full bg-black/85 backdrop-blur-md text-white font-mono text-xs font-bold shadow-lg flex items-center gap-1.5 border border-white/10",
												children: [/* @__PURE__ */ jsx(Sparkles, { className: "w-3.5 h-3.5 text-[#10b981]" }), /* @__PURE__ */ jsx("span", { children: "4K AI On-Model Fit" })]
											})
										]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "absolute inset-0 overflow-hidden z-20",
										style: { clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` },
										children: [/* @__PURE__ */ jsx("div", {
											className: "w-full h-full bg-[#f4f4f2] flex items-center justify-center p-8 sm:p-14",
											children: /* @__PURE__ */ jsx("img", {
												src: activeOutfit.flatImage,
												alt: activeOutfit.name,
												className: "max-w-[85%] max-h-[85%] object-contain filter drop-shadow-[0_30px_40px_rgba(0,0,0,0.25)] select-none pointer-events-none",
												draggable: false
											})
										}), /* @__PURE__ */ jsxs("div", {
											className: "absolute top-4 left-4 z-20 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-black font-mono text-xs font-bold shadow-lg border border-black/10 flex items-center gap-1.5",
											children: [/* @__PURE__ */ jsx(Shirt, { className: "w-3.5 h-3.5 text-neutral-700" }), /* @__PURE__ */ jsx("span", { children: "Raw Flat SKU" })]
										})]
									}),
									/* @__PURE__ */ jsx("div", {
										className: "absolute top-0 bottom-0 w-[2px] bg-white shadow-[0_0_20px_rgba(0,0,0,0.8)] z-30 pointer-events-none",
										style: { left: `${sliderPosition}%` },
										children: /* @__PURE__ */ jsx("div", {
											className: "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white text-black shadow-2xl border-2 border-black/15 flex items-center justify-center font-mono text-xs font-bold",
											children: "⟷"
										})
									}),
									/* @__PURE__ */ jsx("div", {
										className: "absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full bg-black/80 backdrop-blur-md text-white font-mono text-[11px] pointer-events-none shadow-xl border border-white/10",
										children: /* @__PURE__ */ jsx("span", { children: "Drag left / right to compare flat SKU vs on-model drape" })
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-4 pt-2.5 flex items-center justify-between text-xs font-mono",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ jsx("button", {
											onClick: () => setSliderPosition(0),
											className: `px-3 py-1.5 rounded-lg transition-colors ${sliderPosition === 0 ? "bg-black text-white font-bold" : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"}`,
											children: "Flat SKU"
										}),
										/* @__PURE__ */ jsx("button", {
											onClick: () => setSliderPosition(50),
											className: `px-3 py-1.5 rounded-lg transition-colors ${sliderPosition === 50 ? "bg-black text-white font-bold" : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"}`,
											children: "50 / 50 Split"
										}),
										/* @__PURE__ */ jsx("button", {
											onClick: () => setSliderPosition(100),
											className: `px-3 py-1.5 rounded-lg transition-colors ${sliderPosition === 100 ? "bg-black text-white font-bold" : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"}`,
											children: "Full Fitted"
										})
									]
								}), /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-neutral-400 text-[11px]",
										children: "Slide:"
									}), /* @__PURE__ */ jsx("input", {
										type: "range",
										min: "0",
										max: "100",
										value: sliderPosition,
										onChange: (e) => setSliderPosition(Number(e.target.value)),
										className: "w-28 sm:w-48 h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-[#de4a2c]"
									})]
								})]
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "lg:col-span-4 xl:col-span-4 bg-white rounded-3xl border border-black/10 shadow-xl p-5 sm:p-6 flex flex-col justify-between",
						children: [/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsxs("div", {
								className: "pb-3 border-b border-black/[0.06] flex items-center justify-between",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
									className: "font-display text-lg font-bold text-neutral-900 tracking-tight",
									children: "Dress Up Wardrobe"
								}), /* @__PURE__ */ jsxs("p", {
									className: "text-[11px] font-mono text-neutral-500 mt-0.5",
									children: ["Click any garment to dress ", currentModel.name]
								})] }), /* @__PURE__ */ jsxs("span", {
									className: "px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-800 font-mono text-xs font-bold border border-black/5",
									children: [currentModel.outfits.length, " Outfits"]
								})]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "flex items-center gap-1.5 py-3 overflow-x-auto no-scrollbar text-xs font-mono",
								children: categories.map((cat) => /* @__PURE__ */ jsx("button", {
									onClick: () => setActiveTab(cat),
									className: `px-3 py-1 rounded-full whitespace-nowrap transition-all ${activeTab === cat ? "bg-black text-white font-bold shadow-sm" : "bg-neutral-100 hover:bg-neutral-200 text-neutral-600"}`,
									children: cat
								}, cat))
							}),
							/* @__PURE__ */ jsx("div", {
								className: "space-y-3 max-h-[500px] overflow-y-auto pr-1",
								children: filteredOutfits.map((outfit) => {
									const isSelected = outfit.id === activeOutfit.id;
									return /* @__PURE__ */ jsxs("button", {
										onClick: () => handleSelectOutfit(outfit.id),
										className: `w-full p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3.5 group ${isSelected ? "border-[#de4a2c] bg-orange-50/30 shadow-md ring-2 ring-[#de4a2c]" : "border-black/5 bg-white hover:bg-neutral-50 hover:border-black/20"}`,
										children: [/* @__PURE__ */ jsx("div", {
											className: "w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-neutral-100 p-1 border border-black/5 flex items-center justify-center",
											children: /* @__PURE__ */ jsx("img", {
												src: outfit.flatImage,
												alt: outfit.name,
												className: "w-full h-full object-contain group-hover:scale-105 transition-transform"
											})
										}), /* @__PURE__ */ jsxs("div", {
											className: "flex-1 min-w-0",
											children: [
												/* @__PURE__ */ jsxs("div", {
													className: "flex items-center justify-between",
													children: [/* @__PURE__ */ jsx("span", {
														className: "font-display text-xs sm:text-sm font-bold text-neutral-900 truncate",
														children: outfit.name
													}), isSelected ? /* @__PURE__ */ jsx("span", {
														className: "w-5 h-5 rounded-full bg-[#de4a2c] text-white flex items-center justify-center text-xs font-bold shrink-0",
														children: "✓"
													}) : /* @__PURE__ */ jsx("span", {
														className: "text-[10px] font-mono text-neutral-400 group-hover:text-black",
														children: "Fit on"
													})]
												}),
												/* @__PURE__ */ jsx("div", {
													className: "text-[11px] font-mono text-neutral-500 truncate mt-0.5",
													children: outfit.fabric
												}),
												/* @__PURE__ */ jsx("div", {
													className: "text-[10px] font-mono text-neutral-400 mt-0.5 flex items-center gap-1.5",
													children: /* @__PURE__ */ jsx("span", {
														className: "text-[#10b981] font-semibold",
														children: outfit.specs.drape
													})
												})
											]
										})]
									}, outfit.id);
								})
							})
						] }), /* @__PURE__ */ jsxs("div", {
							className: "mt-6 pt-4 border-t border-black/[0.06]",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "mb-3 px-1 text-xs font-mono text-neutral-500 flex items-center justify-between",
								children: [/* @__PURE__ */ jsx("span", { children: "Enterprise SLA:" }), /* @__PURE__ */ jsx("span", {
									className: "font-bold text-neutral-900",
									children: "24-Hour Batch Turnaround"
								})]
							}), /* @__PURE__ */ jsxs(Link, {
								href: "/#free-sample",
								className: "w-full py-3.5 px-4 rounded-xl bg-black hover:bg-[#de4a2c] text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-md group",
								children: [/* @__PURE__ */ jsx("span", { children: "Upload 3 Garments for Free Try-On" }), /* @__PURE__ */ jsx(ArrowRight, { className: "w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" })]
							})]
						})]
					})]
				})]
			}),
			/* @__PURE__ */ jsx("footer", {
				className: "border-t border-black/[0.06] py-3.5 px-6 text-center text-xs font-mono text-neutral-400",
				children: "Cutting Edger S3 Virtual Try-On Studio • 60 FPS Photorealistic Rendering • Zero Physical Photoshoot Overhead"
			})
		]
	});
}
//#endregion
export { HomeOmniStudio };
