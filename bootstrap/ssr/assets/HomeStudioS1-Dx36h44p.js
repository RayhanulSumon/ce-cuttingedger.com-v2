import { useState } from "react";
import { Link } from "@inertiajs/react";
import { ArrowRight, CheckCircle2, UserCheck } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/HomeVariants/HomeStudioS1.tsx
var PRESETS = [
	{
		id: "executive-slate",
		name: "Executive Slate & Navy",
		backdropDesc: "Architectural Charcoal & Soft Keylight",
		attire: "Bespoke Tailored Blazer",
		tag: "BOARDROOM GRADE",
		outputImg: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=85",
		selfieInput: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
		personName: "Elena Vance",
		personRole: "Chief Operating Officer"
	},
	{
		id: "modern-white",
		name: "Silicon Valley Minimal",
		backdropDesc: "High-Key Studio Diffused White",
		attire: "Merino Wool Crewneck",
		tag: "TECH LEADERSHIP",
		outputImg: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1200&q=85",
		selfieInput: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
		personName: "David Marcus",
		personRole: "Head of Engineering"
	},
	{
		id: "warm-loft",
		name: "Natural Sunlit Loft",
		backdropDesc: "Warm Bokeh Daylight & Organic Wood",
		attire: "Smart Casual Structured Linen",
		tag: "CREATIVE DIRECTOR",
		outputImg: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=1200&q=85",
		selfieInput: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
		personName: "Amina Diallo",
		personRole: "VP of Global Brand"
	}
];
function HomeStudioS1({ clients = [] }) {
	const [activePresetId, setActivePresetId] = useState("executive-slate");
	const [sliderPos, setSliderPos] = useState(50);
	const [teamSeats, setTeamSeats] = useState(50);
	const [isHoldingSelfie, setIsHoldingSelfie] = useState(false);
	const activePreset = PRESETS.find((p) => p.id === activePresetId) || PRESETS[0];
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-[#FAFAF9] text-[#111215] selection:bg-[#de4a2c] selection:text-white font-sans antialiased overflow-x-hidden",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "border-b border-neutral-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-40",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-[#de4a2c] animate-pulse" }),
							/* @__PURE__ */ jsx("span", {
								className: "font-mono font-bold tracking-wider text-neutral-800 uppercase",
								children: "SERVICE S1 // AI CORPORATE HEADSHOTS"
							}),
							/* @__PURE__ */ jsx("span", {
								className: "hidden md:inline text-neutral-400",
								children: "• HR & Marketing Teams (20–500 Seats)"
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-4 text-[11px] font-mono text-neutral-500 font-bold",
						children: [/* @__PURE__ */ jsx("span", {
							className: "hidden sm:inline",
							children: "6–10 SELFIES PER PERSON"
						}), /* @__PURE__ */ jsx("span", {
							className: "text-[#de4a2c]",
							children: "UNIFIED PRESET IN 2H"
						})]
					})]
				})
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "pt-16 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "max-w-3xl mx-auto text-center mb-12",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-neutral-200 text-xs font-bold text-neutral-800 shadow-xs mb-4",
							children: [
								/* @__PURE__ */ jsx(UserCheck, { className: "w-3.5 h-3.5 text-[#de4a2c]" }),
								/* @__PURE__ */ jsx("span", {
									className: "font-mono uppercase",
									children: "ZERO STUDIO VISITS"
								}),
								/* @__PURE__ */ jsx("span", {
									className: "text-neutral-300",
									children: "•"
								}),
								/* @__PURE__ */ jsx("span", {
									className: "text-[#de4a2c]",
									children: "100% IDENTITY FIDELITY"
								})
							]
						}),
						/* @__PURE__ */ jsxs("h1", {
							className: "text-4xl sm:text-6xl font-black tracking-tight text-[#111215] leading-[1.08]",
							children: [
								"Turn Phone Selfies into",
								" ",
								/* @__PURE__ */ jsx("span", {
									className: "text-transparent bg-clip-text bg-gradient-to-r from-[#de4a2c] via-[#ff6b4a] to-[#de4a2c]",
									children: "Unified Executive Headshots"
								})
							]
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-4 text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed",
							children: "Eliminate photographer booking, physical studio logistics, and uneven lighting for distributed teams. Upload 6–10 casual selfies per employee to receive uniform, company-branded executive portraits."
						})
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "rounded-[32px] p-6 sm:p-10 bg-white border border-neutral-200 shadow-xl max-w-5xl mx-auto",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-200 gap-4",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
							className: "text-[10px] font-mono font-extrabold text-[#de4a2c] uppercase tracking-wider block",
							children: "STEP 1 // SELECT COMPANY PRESET"
						}), /* @__PURE__ */ jsx("h2", {
							className: "text-lg font-bold text-neutral-900 mt-0.5",
							children: "Brand Attire & Backdrop Presets"
						})] }), /* @__PURE__ */ jsx("div", {
							className: "flex items-center gap-2 overflow-x-auto pb-1",
							children: PRESETS.map((preset) => {
								const isActive = activePresetId === preset.id;
								return /* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => setActivePresetId(preset.id),
									className: `px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${isActive ? "bg-[#111215] text-white shadow-md" : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"}`,
									children: [/* @__PURE__ */ jsx("span", { className: `w-1.5 h-1.5 rounded-full ${isActive ? "bg-[#de4a2c]" : "bg-neutral-400"}` }), /* @__PURE__ */ jsx("span", { children: preset.name })]
								}, preset.id);
							})
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "lg:col-span-4 space-y-4",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "p-5 rounded-2xl bg-[#FAFAF9] border border-neutral-200",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between mb-3",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-[10px] font-mono font-bold text-neutral-500 uppercase",
											children: "INPUT: 6–10 PHONE SELFIES"
										}), /* @__PURE__ */ jsx("span", {
											className: "text-[10px] font-mono text-[#de4a2c] font-bold",
											children: "ANY CASUAL ANGLE"
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "relative aspect-[4/5] rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100 shadow-inner",
										children: [
											/* @__PURE__ */ jsx("img", {
												src: activePreset.selfieInput,
												alt: "Phone selfie",
												className: "w-full h-full object-cover filter contrast-90"
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-white text-[11px] font-mono",
												children: [/* @__PURE__ */ jsx("div", { children: activePreset.personName }), /* @__PURE__ */ jsx("div", {
													className: "text-neutral-300 text-[10px]",
													children: activePreset.personRole
												})]
											}),
											/* @__PURE__ */ jsx("div", {
												className: "absolute top-3 left-3 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[9px] font-mono text-white",
												children: "RAW SELFIE 01/08"
											})
										]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "mt-3 text-[11px] text-neutral-500 space-y-1",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-1.5",
											children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5 text-emerald-600" }), /* @__PURE__ */ jsx("span", { children: "Preserves exact facial structure & likeness" })]
										}), /* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-1.5",
											children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5 text-emerald-600" }), /* @__PURE__ */ jsx("span", { children: "Swaps casual t-shirt for company wardrobe" })]
										})]
									})
								]
							}), /* @__PURE__ */ jsxs("div", {
								className: "p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2 text-xs",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-neutral-500",
											children: "Backdrop:"
										}), /* @__PURE__ */ jsx("span", {
											className: "font-bold text-neutral-900",
											children: activePreset.backdropDesc
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-neutral-500",
											children: "Attire:"
										}), /* @__PURE__ */ jsx("span", {
											className: "font-bold text-neutral-900",
											children: activePreset.attire
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-neutral-500",
											children: "Standardization:"
										}), /* @__PURE__ */ jsx("span", {
											className: "font-bold text-emerald-600",
											children: "Company-Wide Preset Lock"
										})]
									})
								]
							})]
						}), /* @__PURE__ */ jsx("div", {
							className: "lg:col-span-8",
							children: /* @__PURE__ */ jsxs("div", {
								className: "relative rounded-2xl overflow-hidden border border-neutral-200 shadow-md h-[440px] sm:h-[500px] bg-neutral-900 select-none",
								children: [
									/* @__PURE__ */ jsx("img", {
										src: activePreset.outputImg,
										alt: activePreset.name,
										className: "w-full h-full object-cover object-top"
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "absolute inset-0 overflow-hidden",
										style: { clipPath: `inset(0 ${100 - (isHoldingSelfie ? 100 : sliderPos)}% 0 0)` },
										children: [/* @__PURE__ */ jsx("img", {
											src: activePreset.selfieInput,
											alt: "Raw Phone Selfie",
											className: "w-full h-full object-cover object-top filter brightness-95"
										}), /* @__PURE__ */ jsx("div", {
											className: "absolute top-4 left-4 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-[11px] font-mono font-bold",
											children: "RAW SMARTPHONE SELFIE"
										})]
									}),
									!isHoldingSelfie && /* @__PURE__ */ jsx("div", {
										className: "absolute top-0 bottom-0 w-0.5 bg-white pointer-events-none shadow-[0_0_15px_rgba(255,255,255,0.8)]",
										style: { left: `${sliderPos}%` },
										children: /* @__PURE__ */ jsxs("div", {
											className: "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#de4a2c] text-white text-[10px] font-mono font-black uppercase tracking-wider shadow-xl flex items-center gap-1 border border-white",
											children: [
												/* @__PURE__ */ jsx("span", { children: "SELFIE" }),
												/* @__PURE__ */ jsx("span", {
													className: "opacity-40",
													children: "|"
												}),
												/* @__PURE__ */ jsx("span", { children: "PORTRAIT" })
											]
										})
									}),
									/* @__PURE__ */ jsx("div", {
										className: "absolute top-4 right-4 px-3 py-1 rounded-full bg-[#111215] text-white text-[11px] font-mono font-bold shadow-md",
										children: activePreset.tag
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "absolute bottom-4 inset-x-4 p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-neutral-200/90 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-800 shadow-lg",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-3",
											children: [/* @__PURE__ */ jsx("button", {
												type: "button",
												onMouseDown: () => setIsHoldingSelfie(true),
												onMouseUp: () => setIsHoldingSelfie(false),
												onTouchStart: () => setIsHoldingSelfie(true),
												onTouchEnd: () => setIsHoldingSelfie(false),
												className: `px-3 py-1.5 rounded-xl font-bold transition-all text-xs flex items-center gap-1.5 ${isHoldingSelfie ? "bg-amber-400 text-black" : "bg-neutral-100 hover:bg-neutral-200 text-neutral-800"}`,
												children: /* @__PURE__ */ jsx("span", { children: isHoldingSelfie ? "Viewing Raw Selfie" : "Hold to View Selfie" })
											}), /* @__PURE__ */ jsxs("div", {
												className: "hidden sm:flex items-center gap-2",
												children: [/* @__PURE__ */ jsx("span", {
													className: "font-mono text-neutral-500 font-bold",
													children: "Slide:"
												}), /* @__PURE__ */ jsx("input", {
													type: "range",
													min: "5",
													max: "95",
													value: sliderPos,
													onChange: (e) => setSliderPos(Number(e.target.value)),
													className: "accent-[#de4a2c] cursor-pointer w-28 h-1.5 bg-neutral-200 rounded-lg"
												})]
											})]
										}), /* @__PURE__ */ jsx("span", {
											className: "text-[#de4a2c] font-bold font-mono",
											children: "⚡ Under 2-Hour Batch Turnaround"
										})]
									})
								]
							})
						})]
					})]
				})]
			}),
			/* @__PURE__ */ jsx("section", {
				className: "py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto",
				children: /* @__PURE__ */ jsxs("div", {
					className: "rounded-3xl p-8 sm:p-12 bg-white border border-neutral-200 text-center space-y-8 shadow-sm",
					children: [
						/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("span", {
								className: "text-xs font-mono font-bold text-[#de4a2c] uppercase tracking-wider block mb-1",
								children: "BUDGET & SCHEDULING ROI CALCULATOR"
							}),
							/* @__PURE__ */ jsx("h2", {
								className: "text-2xl sm:text-4xl font-black text-neutral-900",
								children: "Calculate Your Enterprise Headshot Savings"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-sm text-neutral-600 max-w-lg mx-auto mt-2",
								children: "Compare the cost and turnaround of traditional studio bookings against our AI employee onboarding pipeline."
							})
						] }),
						/* @__PURE__ */ jsxs("div", {
							className: "max-w-md mx-auto space-y-3",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between text-xs font-bold text-neutral-800",
									children: [/* @__PURE__ */ jsx("span", { children: "Team Seats (HR Roster):" }), /* @__PURE__ */ jsxs("span", {
										className: "px-3.5 py-1 rounded-full bg-[#de4a2c]/10 text-[#de4a2c] font-mono text-sm",
										children: [teamSeats, " Team Members"]
									})]
								}),
								/* @__PURE__ */ jsx("input", {
									type: "range",
									min: "20",
									max: "500",
									step: "10",
									value: teamSeats,
									onChange: (e) => setTeamSeats(Number(e.target.value)),
									className: "w-full accent-[#de4a2c] cursor-pointer h-2 bg-neutral-200 rounded-lg"
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex justify-between text-[11px] text-neutral-500 font-mono",
									children: [
										/* @__PURE__ */ jsx("span", { children: "20 Seats" }),
										/* @__PURE__ */ jsx("span", { children: "250 Seats" }),
										/* @__PURE__ */ jsx("span", { children: "500 Seats (Enterprise)" })
									]
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto text-left",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "p-5 rounded-2xl bg-neutral-50 border border-neutral-200",
									children: [
										/* @__PURE__ */ jsx("span", {
											className: "text-[10px] font-mono text-neutral-400 uppercase font-bold",
											children: "Traditional Photographer"
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "text-2xl font-bold text-neutral-400 line-through mt-1",
											children: ["$", teamSeats * 250]
										}),
										/* @__PURE__ */ jsx("div", {
											className: "text-xs text-neutral-500 mt-1",
											children: "3–4 weeks scheduling delay"
										})
									]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "p-5 rounded-2xl bg-[#de4a2c]/5 border border-[#de4a2c]/30",
									children: [
										/* @__PURE__ */ jsx("span", {
											className: "text-[10px] font-mono text-[#de4a2c] uppercase font-bold",
											children: "CuttingEdger S1 Pipeline"
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "text-3xl font-black text-[#de4a2c] mt-1",
											children: ["$", teamSeats * 25]
										}),
										/* @__PURE__ */ jsx("div", {
											className: "text-xs text-emerald-700 font-bold mt-1",
											children: "Guaranteed 2-hour delivery"
										})
									]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "p-5 rounded-2xl bg-emerald-50 border border-emerald-200",
									children: [
										/* @__PURE__ */ jsx("span", {
											className: "text-[10px] font-mono text-emerald-700 uppercase font-bold",
											children: "Total Budget Saved"
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "text-3xl font-black text-emerald-700 mt-1",
											children: ["$", teamSeats * 225]
										}),
										/* @__PURE__ */ jsx("div", {
											className: "text-xs text-emerald-800 font-bold mt-1",
											children: "90% Direct Cost Reduction"
										})
									]
								})
							]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "pt-2",
							children: /* @__PURE__ */ jsxs(Link, {
								href: "/contact",
								className: "px-8 py-4 rounded-full bg-[#111215] hover:bg-[#de4a2c] text-white text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-2 shadow-md",
								children: [/* @__PURE__ */ jsxs("span", { children: [
									"Onboard Your ",
									teamSeats,
									"-Seat Team Free"
								] }), /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })]
							})
						})
					]
				})
			})
		]
	});
}
//#endregion
export { HomeStudioS1 };
