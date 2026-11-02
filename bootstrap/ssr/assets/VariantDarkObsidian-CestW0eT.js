import { useState } from "react";
import { Link } from "@inertiajs/react";
import { ArrowUpRight, Calendar, Check, ChevronDown, Sparkles, Wand2 } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Services/Variants/VariantDarkObsidian.tsx
var VariantDarkObsidian = ({ service, otherServices = [], relatedProjects = [], calendlyUrl }) => {
	const [openFaq, setOpenFaq] = useState(0);
	const [polishActive, setPolishActive] = useState(true);
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-[#07080B] text-neutral-200 antialiased selection:bg-emerald-400 selection:text-black pb-36 relative overflow-hidden",
		children: [
			/* @__PURE__ */ jsx("div", { className: "absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-emerald-500/10 via-cyan-500/5 to-transparent rounded-full blur-[140px] pointer-events-none" }),
			/* @__PURE__ */ jsx("div", { className: "absolute top-[800px] right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" }),
			/* @__PURE__ */ jsx("div", {
				className: "border-b border-white/10 bg-[#07080B]/80 backdrop-blur-xl sticky top-0 z-40",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-7xl mx-auto px-4 sm:px-8 h-12 flex items-center justify-between text-xs font-mono",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2.5 text-neutral-400",
						children: [
							/* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10B981]" }),
							/* @__PURE__ */ jsx("span", {
								className: "text-white font-bold tracking-wider",
								children: "OBSIDIAN ATELIER"
							}),
							/* @__PURE__ */ jsx("span", {
								className: "text-neutral-600",
								children: "/"
							}),
							/* @__PURE__ */ jsx("span", {
								className: "text-emerald-400 truncate max-w-xs",
								children: service.title
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3 text-neutral-400 text-[11px]",
						children: [/* @__PURE__ */ jsx("span", {
							className: "hidden sm:inline",
							children: "16-BIT PROPHOTO • 300 DPI"
						}), /* @__PURE__ */ jsx("span", {
							className: "px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold",
							children: "12H RUSH READY"
						})]
					})]
				})
			}),
			/* @__PURE__ */ jsx("section", {
				className: "pt-16 pb-20 px-4 sm:px-8 relative",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-7xl mx-auto",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "max-w-3xl space-y-6",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/15 text-xs text-neutral-300 backdrop-blur-md",
								children: [/* @__PURE__ */ jsx(Sparkles, { className: "w-3.5 h-3.5 text-emerald-400" }), /* @__PURE__ */ jsx("span", {
									className: "font-mono text-[11px] tracking-wider uppercase",
									children: service.marquee_label || "OBSIDIAN PRECISION CRAFT"
								})]
							}),
							/* @__PURE__ */ jsx("h1", {
								className: "text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.05]",
								children: service.h1_title || service.title
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-base sm:text-lg text-neutral-400 leading-relaxed max-w-2xl font-light",
								children: service.subtitle || service.description
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex flex-wrap items-center gap-4 pt-4",
								children: [/* @__PURE__ */ jsxs("a", {
									href: "#free-sample",
									className: "px-8 py-4 rounded-full bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-[0_0_30px_rgba(16,185,129,0.35)] flex items-center gap-2",
									children: [/* @__PURE__ */ jsx("span", { children: "Request 3 Free Master Assets" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4" })]
								}), /* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => window.dispatchEvent(new CustomEvent("ce:open-discovery-call")),
									className: "px-6 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2",
									children: [/* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4 text-emerald-400" }), /* @__PURE__ */ jsx("span", { children: "Discovery Call" })]
								})]
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-2 md:grid-cols-4 gap-3 mt-12 pt-8 border-t border-white/10",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-1",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold",
										children: "TURNAROUND"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-2xl font-extrabold text-white",
										children: "12 Hours"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-xs text-emerald-400 font-medium",
										children: "Guaranteed SLA"
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-1",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold",
										children: "ACCURACY"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-2xl font-extrabold text-white",
										children: "0.1px Bezier"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-xs text-neutral-400 font-medium",
										children: "Sub-pixel curvature"
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-1",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold",
										children: "CAPACITY"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-2xl font-extrabold text-white",
										children: "10k+ SKUs"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-xs text-neutral-400 font-medium",
										children: "Daily throughput"
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md space-y-1",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold",
										children: "SECURITY"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-2xl font-extrabold text-white",
										children: "Strict NDA"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-xs text-neutral-400 font-medium",
										children: "Air-gapped production"
									})
								]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ jsx("section", {
				className: "py-12 px-4 sm:px-8",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-7xl mx-auto rounded-3xl bg-white/[0.02] border border-white/10 p-6 sm:p-10 backdrop-blur-2xl space-y-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
							className: "text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold block",
							children: "OBSIDIAN CRAFT VIEWER"
						}), /* @__PURE__ */ jsx("h2", {
							className: "text-2xl sm:text-3xl font-extrabold text-white",
							children: "Live Specular Polish & Vector Clean"
						})] }), /* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => setPolishActive(!polishActive),
							className: `px-5 py-2.5 rounded-full text-xs font-bold font-mono transition-all flex items-center gap-2 border ${polishActive ? "bg-emerald-400 text-black border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]" : "bg-white/10 text-white border-white/20"}`,
							children: [/* @__PURE__ */ jsx(Wand2, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: polishActive ? "Specular Polish: ACTIVE" : "Bypass Polish: RAW" })]
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "relative h-[360px] sm:h-[460px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#141620] to-[#0A0B10] flex items-center justify-center p-6 border border-white/10",
						children: [/* @__PURE__ */ jsx("img", {
							src: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1400&q=85",
							alt: "Specular Preview",
							className: `max-h-full max-w-full object-contain transition-all duration-500 ${polishActive ? "filter brightness-105 contrast-110 saturate-110 drop-shadow-[0_32px_28px_rgba(16,185,129,0.25)]" : "filter brightness-75 contrast-85 saturate-60"}`
						}), /* @__PURE__ */ jsx("div", {
							className: "absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 border border-white/10 backdrop-blur-md text-xs font-mono text-white",
							children: polishActive ? "✦ Frequency Separation & Specular Polish" : "● Raw Studio Camera Exposure"
						})]
					})]
				})
			}),
			/* @__PURE__ */ jsx("section", {
				className: "py-16 px-4 sm:px-8",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "p-8 rounded-3xl bg-red-950/10 border border-red-500/20 space-y-4 relative overflow-hidden backdrop-blur-md",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "text-xs font-mono uppercase tracking-widest text-red-400 font-bold block",
								children: "[ THE PRODUCTION DEFECT ]"
							}),
							/* @__PURE__ */ jsx("h3", {
								className: "text-2xl font-bold text-white",
								children: "Automated Clipping Flaws"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-sm text-neutral-400 leading-relaxed",
								children: service.problem_statement || "Off-the-shelf AI removers destroy fine details, create jagged pixel edges, and introduce background color cast that severely degrades luxury brand perception."
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "p-8 rounded-3xl bg-emerald-950/10 border border-emerald-500/30 space-y-4 relative overflow-hidden backdrop-blur-md",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold block",
								children: "[ THE OBSIDIAN RESOLUTION ]"
							}),
							/* @__PURE__ */ jsx("h3", {
								className: "text-2xl font-bold text-white",
								children: "100% Hand-Crafted Pen Tool Vectors"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-sm text-neutral-300 leading-relaxed",
								children: service.solution_statement || "Every silhouette is outlined manually at 300% zoom with clean Bézier anchor points. Calibrated Delta-E swatches guarantee consistent colors across all devices."
							})
						]
					})]
				})
			}),
			service.process_steps && service.process_steps.length > 0 && /* @__PURE__ */ jsx("section", {
				className: "py-16 px-4 sm:px-8 border-t border-white/10",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-7xl mx-auto space-y-8",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "text-center max-w-xl mx-auto space-y-2",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold block",
							children: "PRODUCTION PIPELINE"
						}), /* @__PURE__ */ jsx("h2", {
							className: "text-3xl font-extrabold text-white",
							children: "Four-Stage Master Protocol"
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
						children: service.process_steps.map((step, idx) => /* @__PURE__ */ jsxs("div", {
							className: "p-6 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-md space-y-3",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-3xl font-mono font-extrabold text-emerald-400",
									children: step.step
								}),
								/* @__PURE__ */ jsx("h4", {
									className: "font-bold text-base text-white",
									children: step.title
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-xs text-neutral-400 leading-relaxed",
									children: step.description
								})
							]
						}, idx))
					})]
				})
			}),
			/* @__PURE__ */ jsx("section", {
				className: "py-16 px-4 sm:px-8 border-t border-white/10",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-5xl mx-auto space-y-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold block",
							children: "ASSET OUTPUTS"
						}), /* @__PURE__ */ jsx("h2", {
							className: "text-3xl font-extrabold text-white",
							children: "Handed-Over Deliverable Formats"
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
						children: (service.deliverables || [
							"Clipping Path Embedded TIFF & EPS",
							"Layered 16-Bit ProPhoto PSD",
							"Lossless Alpha PNG with Ground Shadow",
							"Next-Gen Compressed WebP for Web Performance"
						]).map((deliv, idx) => /* @__PURE__ */ jsxs("div", {
							className: "p-5 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center gap-3",
							children: [/* @__PURE__ */ jsx("div", {
								className: "w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0",
								children: /* @__PURE__ */ jsx(Check, { className: "w-4 h-4 stroke-[3]" })
							}), /* @__PURE__ */ jsx("div", {
								className: "text-sm font-bold text-white",
								children: deliv
							})]
						}, idx))
					})]
				})
			}),
			service.faqs && service.faqs.length > 0 && /* @__PURE__ */ jsx("section", {
				className: "py-16 px-4 sm:px-8 border-t border-white/10",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-3xl mx-auto space-y-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "text-center space-y-2",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold block",
							children: "INQUIRIES"
						}), /* @__PURE__ */ jsx("h2", {
							className: "text-3xl font-extrabold text-white",
							children: "Frequently Addressed Inquiries"
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "space-y-3",
						children: service.faqs.map((faq, idx) => {
							const isOpen = openFaq === idx;
							return /* @__PURE__ */ jsxs("div", {
								className: "p-5 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-md",
								children: [/* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => setOpenFaq(isOpen ? null : idx),
									className: "w-full text-left flex items-center justify-between gap-4 font-bold text-sm text-white",
									children: [/* @__PURE__ */ jsx("span", { children: faq.question }), /* @__PURE__ */ jsx(ChevronDown, { className: `w-4 h-4 text-neutral-400 transition-transform ${isOpen ? "rotate-180 text-emerald-400" : ""}` })]
								}), isOpen && /* @__PURE__ */ jsx("p", {
									className: "text-xs text-neutral-400 leading-relaxed pt-3 border-t border-white/5 mt-3",
									children: faq.answer
								})]
							}, idx);
						})
					})]
				})
			}),
			/* @__PURE__ */ jsx("section", {
				id: "free-sample",
				className: "py-20 px-4 sm:px-8 border-t border-white/10",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-4xl mx-auto rounded-3xl bg-gradient-to-b from-white/[0.05] to-transparent border border-emerald-500/30 p-8 sm:p-14 text-center space-y-6 shadow-[0_0_80px_rgba(16,185,129,0.15)] relative",
					children: [
						/* @__PURE__ */ jsx("span", {
							className: "text-xs font-mono text-emerald-400 font-bold uppercase tracking-widest block",
							children: "CONFIDENTIAL TRIAL PILOT"
						}),
						/* @__PURE__ */ jsx("h2", {
							className: "text-3xl sm:text-5xl font-extrabold text-white max-w-xl mx-auto",
							children: "Experience the Obsidian craft on your own RAW files."
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-xs sm:text-sm text-neutral-400 max-w-md mx-auto leading-relaxed",
							children: "Upload 3 test images. Receive master hand-drawn vector paths and color-calibrated PSDs within 12 hours."
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap items-center justify-center gap-4 pt-3",
							children: [/* @__PURE__ */ jsxs(Link, {
								href: "/#free-sample",
								className: "px-8 py-4 rounded-full bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(16,185,129,0.4)] flex items-center gap-2",
								children: [/* @__PURE__ */ jsx("span", { children: "Submit Free Test Batch" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4" })]
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => window.dispatchEvent(new CustomEvent("ce:open-discovery-call")),
								className: "px-6 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-xs uppercase tracking-wider transition-all",
								children: "Book Discovery Call"
							})]
						})
					]
				})
			})
		]
	});
};
//#endregion
export { VariantDarkObsidian };
