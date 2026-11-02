import { useMemo, useState } from "react";
import { Link } from "@inertiajs/react";
import { ArrowUpRight, ChevronDown, FileCode2, Sliders, Terminal } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Services/Variants/VariantTechnical.tsx
var VariantTechnical = ({ service, otherServices = [], relatedProjects = [], calendlyUrl }) => {
	const [skuVolume, setSkuVolume] = useState(300);
	const [openFaqIdx, setOpenFaqIdx] = useState(0);
	const [activeLayerTab, setActiveLayerTab] = useState("layer0");
	const volumeEstimate = useMemo(() => {
		if (skuVolume <= 100) return {
			hours: "4 - 6 Hours",
			team: "1 Dedicated Senior Artisan",
			tier: "Express Pilot SLA"
		};
		if (skuVolume <= 500) return {
			hours: "12 Hours",
			team: "3 Artisans + 1 QA Lead",
			tier: "Standard Studio SLA"
		};
		if (skuVolume <= 1500) return {
			hours: "18 - 24 Hours",
			team: "6 Artisans + 2 QA Leads",
			tier: "Enterprise Batch SLA"
		};
		return {
			hours: "Custom Continuous Ingest",
			team: "Dedicated 12-Desk Production Pod",
			tier: "Dedicated Retainer SLA"
		};
	}, [skuVolume]);
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-[#0A0B0E] text-[#E2E8F0] antialiased selection:bg-[#00F5FF] selection:text-[#0A0B0E] font-sans pb-32",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "border-b border-cyan-500/20 bg-[#0E1015] sticky top-0 z-40 backdrop-blur-md",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-7xl mx-auto px-4 sm:px-8 h-12 flex items-center justify-between font-mono text-xs",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3",
						children: [
							/* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-cyan-400 animate-ping" }),
							/* @__PURE__ */ jsx("span", {
								className: "text-cyan-400 font-bold tracking-wider",
								children: "SPEC LAB // SYS_V3.8"
							}),
							/* @__PURE__ */ jsx("span", {
								className: "text-neutral-600 hidden sm:inline",
								children: "|"
							}),
							/* @__PURE__ */ jsxs("span", {
								className: "text-neutral-400 hidden sm:inline truncate max-w-sm",
								children: ["ENGINE: ", service.title.toUpperCase()]
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-4 text-[11px] text-neutral-400",
						children: [/* @__PURE__ */ jsx("span", {
							className: "hidden md:inline font-bold text-emerald-400",
							children: "● 100% VECTOR PRECISION"
						}), /* @__PURE__ */ jsx("span", {
							className: "bg-white/5 border border-white/10 px-2 py-0.5 rounded text-neutral-300",
							children: "QC: PASSED"
						})]
					})]
				})
			}),
			/* @__PURE__ */ jsx("section", {
				className: "pt-14 pb-16 px-4 sm:px-8 border-b border-white/10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,245,255,0.08),rgba(255,255,255,0))]",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-7xl mx-auto space-y-8",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex flex-col lg:flex-row lg:items-end justify-between gap-6",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "max-w-3xl space-y-4",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-950/60 border border-cyan-500/30 font-mono text-xs text-cyan-300",
									children: [/* @__PURE__ */ jsx(Terminal, { className: "w-3.5 h-3.5 text-cyan-400" }), /* @__PURE__ */ jsxs("span", { children: ["SPECIFICATION // ", service.marquee_label || "HIGH-PRECISION ASSET PIPELINE"] })]
								}),
								/* @__PURE__ */ jsx("h1", {
									className: "text-3xl sm:text-5xl font-mono font-extrabold tracking-tight text-white leading-tight",
									children: service.h1_title || service.title
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-sm sm:text-base text-neutral-400 leading-relaxed max-w-2xl font-mono",
									children: service.subtitle || service.description
								})
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap items-center gap-3 font-mono text-xs",
							children: [/* @__PURE__ */ jsxs("a", {
								href: "#calculator",
								className: "px-6 py-3.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold transition-all shadow-[0_0_20px_rgba(0,245,255,0.3)] flex items-center gap-2",
								children: [/* @__PURE__ */ jsx(Sliders, { className: "w-4 h-4" }), /* @__PURE__ */ jsx("span", { children: "Estimate Batch SLA" })]
							}), /* @__PURE__ */ jsxs("a", {
								href: "#free-sample",
								className: "px-6 py-3.5 rounded-lg border border-white/20 hover:border-white/40 text-white font-bold transition-all flex items-center gap-2 bg-white/5",
								children: [/* @__PURE__ */ jsx("span", { children: "Upload Test Files" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4" })]
							})]
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-2 md:grid-cols-4 gap-3 pt-6",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "p-4 rounded-xl bg-[#12141C] border border-cyan-500/20 font-mono space-y-1",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "text-[10px] uppercase text-cyan-400/70 font-bold",
										children: "VECTOR TOLERANCE"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-xl font-extrabold text-white",
										children: "≤ 0.1px Bezier"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-[11px] text-neutral-400",
										children: "Sub-pixel curvature"
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "p-4 rounded-xl bg-[#12141C] border border-white/10 font-mono space-y-1",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "text-[10px] uppercase text-neutral-400 font-bold",
										children: "CALIBRATED DELTA-E"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-xl font-extrabold text-emerald-400",
										children: "< 1.0 Strict"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-[11px] text-neutral-400",
										children: "D65 Master Colorimeter"
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "p-4 rounded-xl bg-[#12141C] border border-white/10 font-mono space-y-1",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "text-[10px] uppercase text-neutral-400 font-bold",
										children: "BATCH THROUGHPUT"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-xl font-extrabold text-white",
										children: "10,000 SKUs/Day"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-[11px] text-neutral-400",
										children: "Automated queue balancing"
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "p-4 rounded-xl bg-[#12141C] border border-white/10 font-mono space-y-1",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "text-[10px] uppercase text-neutral-400 font-bold",
										children: "SECURITY ENCRYPTION"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-xl font-extrabold text-white",
										children: "AES-256 + NDA"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-[11px] text-neutral-400",
										children: "Air-gapped production pod"
									})
								]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ jsx("section", {
				id: "calculator",
				className: "py-16 px-4 sm:px-8 border-b border-white/10 bg-[#0D0F14]",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-5xl mx-auto rounded-2xl bg-[#13151D] border border-cyan-500/30 p-6 sm:p-10 shadow-2xl space-y-8",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
								className: "font-mono text-xs uppercase text-cyan-400 font-bold block",
								children: "PRODUCTION CALCULATOR"
							}), /* @__PURE__ */ jsx("h2", {
								className: "text-2xl sm:text-3xl font-mono font-extrabold text-white",
								children: "Live Turnaround & Capacity Estimator"
							})] }), /* @__PURE__ */ jsxs("span", {
								className: "font-mono text-xs px-3 py-1.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/40",
								children: ["TIER: ", volumeEstimate.tier]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between font-mono text-sm",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-neutral-400",
										children: "Select Monthly or Batch SKU Volume:"
									}), /* @__PURE__ */ jsxs("span", {
										className: "text-xl font-extrabold text-cyan-300 bg-white/5 px-4 py-1 rounded border border-white/10",
										children: [skuVolume.toLocaleString(), " SKUs"]
									})]
								}),
								/* @__PURE__ */ jsx("input", {
									type: "range",
									min: "50",
									max: "3000",
									step: "50",
									value: skuVolume,
									onChange: (e) => setSkuVolume(Number(e.target.value)),
									className: "w-full accent-cyan-400 h-2 bg-neutral-800 rounded-lg cursor-pointer"
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex justify-between font-mono text-[11px] text-neutral-500",
									children: [
										/* @__PURE__ */ jsx("span", { children: "50 SKUs (Sample Pilot)" }),
										/* @__PURE__ */ jsx("span", { children: "1,000 SKUs (Catalog Drop)" }),
										/* @__PURE__ */ jsx("span", { children: "3,000+ SKUs (Continuous Retainer)" })
									]
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 font-mono",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "p-4 rounded-lg bg-black/40 border border-white/10",
									children: [
										/* @__PURE__ */ jsx("span", {
											className: "text-[10px] text-neutral-400 block font-bold",
											children: "ESTIMATED CYCLE SLA"
										}),
										/* @__PURE__ */ jsx("span", {
											className: "text-xl font-extrabold text-white mt-1 block",
											children: volumeEstimate.hours
										}),
										/* @__PURE__ */ jsx("span", {
											className: "text-xs text-emerald-400",
											children: "100% On-Time Guarantee"
										})
									]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "p-4 rounded-lg bg-black/40 border border-white/10",
									children: [
										/* @__PURE__ */ jsx("span", {
											className: "text-[10px] text-neutral-400 block font-bold",
											children: "ALLOCATED DESK FORCE"
										}),
										/* @__PURE__ */ jsx("span", {
											className: "text-xl font-extrabold text-white mt-1 block",
											children: volumeEstimate.team
										}),
										/* @__PURE__ */ jsx("span", {
											className: "text-xs text-neutral-400",
											children: "Dual-Pass QC Verification"
										})
									]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "p-4 rounded-lg bg-black/40 border border-white/10",
									children: [
										/* @__PURE__ */ jsx("span", {
											className: "text-[10px] text-neutral-400 block font-bold",
											children: "INGEST ARCHITECTURE"
										}),
										/* @__PURE__ */ jsx("span", {
											className: "text-xl font-extrabold text-cyan-300 mt-1 block",
											children: "SFTP / S3 / API"
										}),
										/* @__PURE__ */ jsx("span", {
											className: "text-xs text-neutral-400",
											children: "Automated Drop Watcher"
										})
									]
								})
							]
						})
					]
				})
			}),
			/* @__PURE__ */ jsx("section", {
				className: "py-16 px-4 sm:px-8 border-b border-white/10",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-5xl mx-auto space-y-8 font-mono",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "text-center space-y-2",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-xs text-cyan-400 uppercase font-bold tracking-wider",
							children: "BENCHMARK AUDIT"
						}), /* @__PURE__ */ jsx("h2", {
							className: "text-2xl sm:text-3xl font-extrabold text-white",
							children: "Technical Specification Matrix"
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "overflow-x-auto rounded-xl border border-white/10 bg-[#12141C]",
						children: /* @__PURE__ */ jsxs("table", {
							className: "w-full text-left text-xs",
							children: [/* @__PURE__ */ jsx("thead", {
								className: "bg-white/5 border-b border-white/10 text-neutral-400",
								children: /* @__PURE__ */ jsxs("tr", { children: [
									/* @__PURE__ */ jsx("th", {
										className: "p-4",
										children: "SPECIFICATION PARAMETER"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "p-4 text-neutral-400",
										children: "GENERIC / AUTOMATED AI"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "p-4 text-cyan-300 bg-cyan-950/30",
										children: "CUTTINGEDGER SPEC LAB"
									})
								] })
							}), /* @__PURE__ */ jsxs("tbody", {
								className: "divide-y divide-white/5 text-neutral-300",
								children: [
									/* @__PURE__ */ jsxs("tr", { children: [
										/* @__PURE__ */ jsx("td", {
											className: "p-4 font-bold text-white",
											children: "Path Generation Method"
										}),
										/* @__PURE__ */ jsx("td", {
											className: "p-4 text-red-400",
											children: "Automated Alpha Guessing"
										}),
										/* @__PURE__ */ jsx("td", {
											className: "p-4 text-emerald-400 font-bold bg-cyan-950/20",
											children: "100% Hand-Crafted Pen Tool Bezier"
										})
									] }),
									/* @__PURE__ */ jsxs("tr", { children: [
										/* @__PURE__ */ jsx("td", {
											className: "p-4 font-bold text-white",
											children: "Edge Placement Accuracy"
										}),
										/* @__PURE__ */ jsx("td", {
											className: "p-4 text-neutral-400",
											children: "Fuzzy ± 2.0px artifact spread"
										}),
										/* @__PURE__ */ jsx("td", {
											className: "p-4 text-emerald-400 font-bold bg-cyan-950/20",
											children: "Exact 0.5px sub-pixel inward tuck"
										})
									] }),
									/* @__PURE__ */ jsxs("tr", { children: [
										/* @__PURE__ */ jsx("td", {
											className: "p-4 font-bold text-white",
											children: "Layer Deliverables"
										}),
										/* @__PURE__ */ jsx("td", {
											className: "p-4 text-neutral-400",
											children: "Flattened JPG or simple PNG"
										}),
										/* @__PURE__ */ jsx("td", {
											className: "p-4 text-cyan-300 font-bold bg-cyan-950/20",
											children: "Layered PSD (Shadow, Mask, Polish, Recolor)"
										})
									] }),
									/* @__PURE__ */ jsxs("tr", { children: [
										/* @__PURE__ */ jsx("td", {
											className: "p-4 font-bold text-white",
											children: "Color Space Integrity"
										}),
										/* @__PURE__ */ jsx("td", {
											className: "p-4 text-neutral-400",
											children: "sRGB compressed, shifted hues"
										}),
										/* @__PURE__ */ jsx("td", {
											className: "p-4 text-cyan-300 font-bold bg-cyan-950/20",
											children: "16-Bit ProPhoto / Adobe RGB / Delta-E calibrated"
										})
									] }),
									/* @__PURE__ */ jsxs("tr", { children: [
										/* @__PURE__ */ jsx("td", {
											className: "p-4 font-bold text-white",
											children: "SLA Enforcement"
										}),
										/* @__PURE__ */ jsx("td", {
											className: "p-4 text-neutral-400",
											children: "Best-effort, frequent delays"
										}),
										/* @__PURE__ */ jsx("td", {
											className: "p-4 text-emerald-400 font-bold bg-cyan-950/20",
											children: "Contractual 12-Hour SLA with audit logs"
										})
									] })
								]
							})]
						})
					})]
				})
			}),
			service.process_steps && service.process_steps.length > 0 && /* @__PURE__ */ jsx("section", {
				className: "py-16 px-4 sm:px-8 border-b border-white/10 font-mono",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-7xl mx-auto space-y-8",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-xs text-cyan-400 uppercase font-bold tracking-wider",
							children: "EXECUTION PIPELINE"
						}), /* @__PURE__ */ jsx("h2", {
							className: "text-2xl sm:text-3xl font-extrabold text-white",
							children: "Four-Stage Audited Protocol"
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
						children: service.process_steps.map((step, idx) => /* @__PURE__ */ jsxs("div", {
							className: "p-5 rounded-xl bg-[#12141C] border border-white/10 space-y-3 relative overflow-hidden",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between text-xs text-neutral-500",
									children: [/* @__PURE__ */ jsxs("span", { children: ["STAGE ", step.step] }), /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-cyan-400" })]
								}),
								/* @__PURE__ */ jsx("h4", {
									className: "font-extrabold text-sm text-white",
									children: step.title
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-xs text-neutral-400 leading-relaxed font-sans",
									children: step.description
								})
							]
						}, idx))
					})]
				})
			}),
			/* @__PURE__ */ jsx("section", {
				className: "py-16 px-4 sm:px-8 border-b border-white/10 font-mono",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-5xl mx-auto space-y-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-xs text-cyan-400 uppercase font-bold tracking-wider",
							children: "ASSET SPECIFICATIONS"
						}), /* @__PURE__ */ jsx("h2", {
							className: "text-2xl sm:text-3xl font-extrabold text-white",
							children: "Export Manifest & File Payloads"
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
						children: (service.deliverables || [
							"Embedded Clipping Path (TIFF / EPS)",
							"16-Bit ProPhoto Layered PSD",
							"Lossless Alpha Channel PNG",
							"Compressed Next-Gen WebP 300 DPI"
						]).map((deliv, idx) => /* @__PURE__ */ jsxs("div", {
							className: "p-4 rounded-xl bg-[#12141C] border border-white/10 flex items-center gap-3 text-xs",
							children: [/* @__PURE__ */ jsx(FileCode2, { className: "w-5 h-5 text-cyan-400 shrink-0" }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
								className: "font-bold text-white",
								children: deliv
							}), /* @__PURE__ */ jsx("div", {
								className: "text-[11px] text-neutral-400",
								children: "DAM & E-Com compliant manifest"
							})] })]
						}, idx))
					})]
				})
			}),
			service.faqs && service.faqs.length > 0 && /* @__PURE__ */ jsx("section", {
				className: "py-16 px-4 sm:px-8 border-b border-white/10 font-mono",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-4xl mx-auto space-y-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-xs text-cyan-400 uppercase font-bold tracking-wider",
							children: "SYSTEM DOCUMENTATION"
						}), /* @__PURE__ */ jsx("h2", {
							className: "text-2xl sm:text-3xl font-extrabold text-white",
							children: "Technical FAQ"
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "space-y-3",
						children: service.faqs.map((faq, idx) => {
							const isOpen = openFaqIdx === idx;
							return /* @__PURE__ */ jsxs("div", {
								className: "rounded-xl bg-[#12141C] border border-white/10 overflow-hidden",
								children: [/* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => setOpenFaqIdx(isOpen ? null : idx),
									className: "w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-xs text-white",
									children: [/* @__PURE__ */ jsxs("span", { children: ["// ", faq.question] }), /* @__PURE__ */ jsx(ChevronDown, { className: `w-4 h-4 text-cyan-400 transition-transform ${isOpen ? "rotate-180" : ""}` })]
								}), isOpen && /* @__PURE__ */ jsx("div", {
									className: "px-4 pb-4 text-xs text-neutral-400 font-sans leading-relaxed border-t border-white/5 pt-3",
									children: faq.answer
								})]
							}, idx);
						})
					})]
				})
			}),
			/* @__PURE__ */ jsx("section", {
				id: "free-sample",
				className: "py-16 px-4 sm:px-8 font-mono",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-4xl mx-auto rounded-2xl bg-cyan-950/30 border border-cyan-500/40 p-8 sm:p-12 text-center space-y-6",
					children: [
						/* @__PURE__ */ jsx("span", {
							className: "text-xs text-cyan-400 font-bold uppercase tracking-widest",
							children: "ZERO LATENCY • AIR-GAPPED EVALUATION"
						}),
						/* @__PURE__ */ jsx("h2", {
							className: "text-3xl sm:text-4xl font-extrabold text-white",
							children: "Trigger an automated test batch evaluation."
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-xs sm:text-sm text-neutral-300 max-w-md mx-auto leading-relaxed font-sans",
							children: "Submit 3 RAW assets. Receive audited Photoshop vector paths and color-calibrated masters within 12 hours."
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap items-center justify-center gap-3 pt-2",
							children: [/* @__PURE__ */ jsxs(Link, {
								href: "/#free-sample",
								className: "px-8 py-4 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs transition-all shadow-[0_0_20px_rgba(0,245,255,0.4)] flex items-center gap-2",
								children: [/* @__PURE__ */ jsx("span", { children: "Initialize Test Batch" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4" })]
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => window.dispatchEvent(new CustomEvent("ce:open-discovery-call")),
								className: "px-6 py-4 rounded-lg border border-white/20 text-white font-bold text-xs hover:bg-white/5 transition-all",
								children: "Schedule Tech Architecture Call"
							})]
						})
					]
				})
			})
		]
	});
};
//#endregion
export { VariantTechnical };
