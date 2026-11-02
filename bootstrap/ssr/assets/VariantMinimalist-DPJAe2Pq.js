import { useState } from "react";
import { Link } from "@inertiajs/react";
import { ArrowUpRight, Calendar, Check, ChevronDown, FileCheck2, Sliders } from "lucide-react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Services/Variants/VariantMinimalist.tsx
var VariantMinimalist = ({ service, otherServices = [], relatedProjects = [], calendlyUrl }) => {
	const [sliderPos, setSliderPos] = useState(50);
	const [openFaqIdx, setOpenFaqIdx] = useState(0);
	const [isHoveringCompare, setIsHoveringCompare] = useState(false);
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-[#F8F9FA] text-[#0F0F12] antialiased selection:bg-[#0F0F12] selection:text-white pb-32",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "border-b border-neutral-200/80 bg-white/70 backdrop-blur-md sticky top-0 z-40",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-7xl mx-auto px-4 sm:px-8 h-14 flex items-center justify-between text-xs",
					children: [/* @__PURE__ */ jsxs("nav", {
						className: "flex items-center gap-2 text-neutral-500 font-semibold truncate",
						children: [
							/* @__PURE__ */ jsx(Link, {
								href: "/",
								className: "hover:text-[#0F0F12] transition-colors",
								children: "Home"
							}),
							/* @__PURE__ */ jsx("span", { children: "/" }),
							/* @__PURE__ */ jsx(Link, {
								href: "/services",
								className: "hover:text-[#0F0F12] transition-colors",
								children: "Services"
							}),
							service.parent && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", { children: "/" }), /* @__PURE__ */ jsx(Link, {
								href: `/services/${service.parent.slug}`,
								className: "hover:text-[#0F0F12] transition-colors",
								children: service.parent.title
							})] }),
							/* @__PURE__ */ jsx("span", { children: "/" }),
							/* @__PURE__ */ jsx("span", {
								className: "text-[#0F0F12] font-extrabold truncate",
								children: service.title
							})
						]
					}), /* @__PURE__ */ jsx("div", {
						className: "hidden sm:flex items-center gap-3",
						children: /* @__PURE__ */ jsxs("span", {
							className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-[11px]",
							children: [/* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" }), "12h Express Production Ready"]
						})
					})]
				})
			}),
			service.children && service.children.length > 0 && /* @__PURE__ */ jsx("div", {
				className: "border-b border-neutral-200/60 bg-white py-3 px-4 sm:px-8",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar text-xs",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-[11px] font-extrabold uppercase tracking-wider text-neutral-400 shrink-0 mr-2",
						children: "Specialized Modules:"
					}), service.children.map((child) => /* @__PURE__ */ jsx(Link, {
						href: `/services/${service.slug}/${child.slug}`,
						className: "px-3 py-1 rounded-full bg-neutral-100 hover:bg-[#0F0F12] text-neutral-600 hover:text-white font-bold transition-all shrink-0 text-xs",
						children: child.title
					}, child.id || child.slug))]
				})
			}),
			/* @__PURE__ */ jsx("section", {
				className: "pt-12 sm:pt-16 pb-12 px-4 sm:px-8",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-7xl mx-auto",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "max-w-3xl space-y-4",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-neutral-200/80 shadow-xs text-xs font-bold text-neutral-600",
								children: [/* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-500" }), /* @__PURE__ */ jsx("span", { children: service.marquee_label || "PRECISION ATELIER POST-PRODUCTION" })]
							}),
							/* @__PURE__ */ jsx("h1", {
								className: "text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0F0F12] leading-[1.08]",
								children: service.h1_title || service.title
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-base sm:text-lg text-neutral-600 font-medium leading-relaxed max-w-2xl",
								children: service.subtitle || service.description
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex flex-wrap items-center gap-3 pt-3",
								children: [/* @__PURE__ */ jsxs("a", {
									href: "#free-sample",
									className: "px-7 py-3.5 rounded-full bg-[#0F0F12] hover:bg-neutral-800 text-white font-extrabold text-xs sm:text-sm transition-all shadow-md flex items-center gap-2",
									children: [/* @__PURE__ */ jsx("span", { children: "Request 3 Free Sample Assets" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4" })]
								}), /* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => window.dispatchEvent(new CustomEvent("ce:open-discovery-call")),
									className: "px-6 py-3.5 rounded-full bg-white hover:bg-neutral-100 border border-neutral-200 text-[#0F0F12] font-bold text-xs sm:text-sm transition-all flex items-center gap-2",
									children: [/* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4 text-emerald-600" }), /* @__PURE__ */ jsx("span", { children: "Book 15-Min Discovery Call" })]
								})]
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-2 md:grid-cols-4 gap-3 mt-10 pt-8 border-t border-neutral-200/80",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "p-4 rounded-2xl bg-white border border-neutral-200/70 shadow-xs",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "text-[11px] font-bold text-neutral-400 uppercase tracking-wider",
										children: "Turnaround SLA"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-xl font-extrabold text-[#0F0F12] mt-0.5",
										children: "12h Guaranteed"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-xs text-emerald-600 font-semibold mt-1",
										children: "⚡ Rush 6h option available"
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "p-4 rounded-2xl bg-white border border-neutral-200/70 shadow-xs",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "text-[11px] font-bold text-neutral-400 uppercase tracking-wider",
										children: "Path Precision"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-xl font-extrabold text-[#0F0F12] mt-0.5",
										children: "0.1px Vector"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-xs text-neutral-500 font-medium mt-1",
										children: "300% zoom hand-drawn"
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "p-4 rounded-2xl bg-white border border-neutral-200/70 shadow-xs",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "text-[11px] font-bold text-neutral-400 uppercase tracking-wider",
										children: "Studio Capacity"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-xl font-extrabold text-[#0F0F12] mt-0.5",
										children: "10,000 SKUs/Day"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-xs text-neutral-500 font-medium mt-1",
										children: "Multi-desk concurrent flow"
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "p-4 rounded-2xl bg-white border border-neutral-200/70 shadow-xs",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "text-[11px] font-bold text-neutral-400 uppercase tracking-wider",
										children: "Confidentiality"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-xl font-extrabold text-[#0F0F12] mt-0.5",
										children: "Strict NDA"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-xs text-neutral-500 font-medium mt-1",
										children: "Enterprise air-gapped security"
									})
								]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ jsx("section", {
				className: "py-8 px-4 sm:px-8",
				children: /* @__PURE__ */ jsx("div", {
					className: "max-w-7xl mx-auto",
					children: /* @__PURE__ */ jsxs("div", {
						className: "rounded-[32px] bg-white border border-neutral-200/80 p-6 sm:p-8 shadow-sm space-y-6",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex flex-col sm:flex-row sm:items-end justify-between gap-3",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
								className: "text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 block",
								children: "CRAFT VERIFICATION"
							}), /* @__PURE__ */ jsx("h2", {
								className: "text-2xl sm:text-3xl font-extrabold text-[#0F0F12]",
								children: "Interactive Before & After Inspection"
							})] }), /* @__PURE__ */ jsx("p", {
								className: "text-xs sm:text-sm text-neutral-500 font-medium max-w-md",
								children: "Drag the slider or click anywhere to inspect pixel-perfect vector cutouts, contact shadows, and texture recovery."
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "relative h-[360px] sm:h-[480px] rounded-2xl overflow-hidden cursor-ew-resize select-none border border-neutral-200 bg-neutral-100",
							onMouseMove: (e) => {
								const rect = e.currentTarget.getBoundingClientRect();
								const pos = (e.clientX - rect.left) / rect.width * 100;
								setSliderPos(Math.max(5, Math.min(pos, 95)));
							},
							onTouchMove: (e) => {
								if (e.touches[0]) {
									const rect = e.currentTarget.getBoundingClientRect();
									const pos = (e.touches[0].clientX - rect.left) / rect.width * 100;
									setSliderPos(Math.max(5, Math.min(pos, 95)));
								}
							},
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "absolute inset-0 bg-[#FFFFFF] flex items-center justify-center p-6",
									style: {
										backgroundImage: "linear-gradient(45deg, #f3f4f6 25%, transparent 25%), linear-gradient(-45deg, #f3f4f6 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f3f4f6 75%), linear-gradient(-45deg, transparent 75%, #f3f4f6 75%)",
										backgroundSize: "24px 24px",
										backgroundPosition: "0 0, 0 12px, 12px -12px, -12px 0px"
									},
									children: /* @__PURE__ */ jsx("img", {
										src: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1600&q=85",
										alt: "Post-Production Final",
										className: "max-h-full max-w-full object-contain filter drop-shadow-[0_28px_24px_rgba(15,15,18,0.24)]"
									})
								}),
								/* @__PURE__ */ jsx("div", {
									className: "absolute inset-0 bg-[#E5E5E2] overflow-hidden flex items-center justify-center p-6 border-r-2 border-white",
									style: { width: `${sliderPos}%` },
									children: /* @__PURE__ */ jsx("img", {
										src: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1600&q=80",
										alt: "Raw Photographic Plate",
										className: "max-h-full max-w-full object-contain filter brightness-[0.8] contrast-[0.82] saturate-[0.6] sepia-[0.15]"
									})
								}),
								/* @__PURE__ */ jsx("div", {
									className: "absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_12px_rgba(0,0,0,0.4)] pointer-events-none",
									style: { left: `${sliderPos}%` },
									children: /* @__PURE__ */ jsx("div", {
										className: "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#0F0F12] text-white border-2 border-white shadow-xl flex items-center justify-center",
										children: /* @__PURE__ */ jsx(Sliders, { className: "w-3.5 h-3.5" })
									})
								}),
								/* @__PURE__ */ jsx("div", {
									className: "absolute top-4 left-4 px-3 py-1 rounded-full bg-[#0F0F12]/80 backdrop-blur-md text-white font-extrabold text-xs",
									children: "RAW PLATE"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "absolute top-4 right-4 px-3 py-1 rounded-full bg-emerald-500 text-white font-extrabold text-xs shadow-md",
									children: "MASTER RETOUCHED"
								})
							]
						})]
					})
				})
			}),
			/* @__PURE__ */ jsx("section", {
				className: "py-12 px-4 sm:px-8",
				children: /* @__PURE__ */ jsx("div", {
					className: "max-w-7xl mx-auto",
					children: /* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 md:grid-cols-2 gap-6",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "p-8 rounded-[28px] bg-white border border-red-200/80 shadow-xs space-y-4",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-[10px] font-extrabold uppercase tracking-widest text-red-600 block",
									children: "THE PRODUCTION BOTTLENECK"
								}),
								/* @__PURE__ */ jsx("h3", {
									className: "text-xl sm:text-2xl font-extrabold text-[#0F0F12]",
									children: "Automated AI & In-House Clutter"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-sm text-neutral-600 leading-relaxed font-medium",
									children: service.problem_statement || "Automated clipping tools guess boundaries, leaving unsightly fringe and clipped silhouettes. In-house retouchers get overwhelmed during seasonal spikes, stalling collection launches and degrading product conversion."
								}),
								/* @__PURE__ */ jsx("div", {
									className: "pt-2 space-y-2",
									children: [
										"Fuzzy, jagged edges that fail luxury standards",
										"Color halos bleeding onto marketplace backdrops",
										"Unpredictable turnaround and lack of scaling bandwidth"
									].map((item, i) => /* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2.5 text-xs font-semibold text-neutral-700",
										children: [/* @__PURE__ */ jsx("span", {
											className: "w-4 h-4 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 text-[10px]",
											children: "✕"
										}), /* @__PURE__ */ jsx("span", { children: item })]
									}, i))
								})
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "p-8 rounded-[28px] bg-white border border-emerald-300 shadow-xs space-y-4 relative overflow-hidden",
							children: [
								/* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" }),
								/* @__PURE__ */ jsx("span", {
									className: "text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 block",
									children: "THE ATELIER RESOLUTION"
								}),
								/* @__PURE__ */ jsx("h3", {
									className: "text-xl sm:text-2xl font-extrabold text-[#0F0F12]",
									children: "100% Hand-Crafted Studio Discipline"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-sm text-neutral-600 leading-relaxed font-medium",
									children: service.solution_statement || "Every curve is traced by hand at 300% zoom using Bézier pen paths. We combine dedicated senior retouch desks, dual-pass quality audits, and custom enterprise DAM pipelines."
								}),
								/* @__PURE__ */ jsx("div", {
									className: "pt-2 space-y-2",
									children: [
										"Hand-drawn Bézier vectors placed 0.5px inside edge",
										"Calibrated Delta-E color consistency across all SKUs",
										"Guaranteed 12-hour turnaround with dual-pass QC verification"
									].map((item, i) => /* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2.5 text-xs font-semibold text-[#0F0F12]",
										children: [/* @__PURE__ */ jsx("span", {
											className: "w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0",
											children: /* @__PURE__ */ jsx(Check, { className: "w-2.5 h-2.5 stroke-[3]" })
										}), /* @__PURE__ */ jsx("span", { children: item })]
									}, i))
								})
							]
						})]
					})
				})
			}),
			service.process_steps && service.process_steps.length > 0 && /* @__PURE__ */ jsx("section", {
				className: "py-12 px-4 sm:px-8",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-7xl mx-auto space-y-8",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "text-center max-w-xl mx-auto space-y-2",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 block",
								children: "STANDARDIZED WORKFLOW"
							}),
							/* @__PURE__ */ jsx("h2", {
								className: "text-2xl sm:text-3xl font-extrabold text-[#0F0F12]",
								children: "Systematic Production Pipeline"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-xs sm:text-sm text-neutral-500 font-medium",
								children: "From initial secure ingest to multi-format delivery, every asset passes four audited milestones."
							})
						]
					}), /* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
						children: service.process_steps.map((step, idx) => /* @__PURE__ */ jsxs("div", {
							className: "p-6 rounded-2xl bg-white border border-neutral-200/80 shadow-xs hover:border-neutral-300 transition-all space-y-3",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-2xl font-mono font-extrabold text-emerald-600",
									children: step.step
								}),
								/* @__PURE__ */ jsx("h4", {
									className: "font-extrabold text-base text-[#0F0F12]",
									children: step.title
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-xs text-neutral-600 leading-relaxed font-medium",
									children: step.description
								})
							]
						}, idx))
					})]
				})
			}),
			/* @__PURE__ */ jsx("section", {
				className: "py-12 px-4 sm:px-8",
				children: /* @__PURE__ */ jsx("div", {
					className: "max-w-7xl mx-auto",
					children: /* @__PURE__ */ jsxs("div", {
						className: "p-8 sm:p-10 rounded-[32px] bg-white border border-neutral-200/80 shadow-sm space-y-6",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "max-w-2xl space-y-2",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 block",
									children: "DELIVERABLE ARCHITECTURE"
								}),
								/* @__PURE__ */ jsx("h2", {
									className: "text-2xl sm:text-3xl font-extrabold text-[#0F0F12]",
									children: "Production Deliverables & Export Formats"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-xs sm:text-sm text-neutral-500 font-medium",
									children: "Configured to drop directly into your brand DAM, Shopify, Amazon, or ERP catalogs."
								})
							]
						}), /* @__PURE__ */ jsx("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2",
							children: (service.deliverables || [
								"Clipping Path Embedded TIFF & EPS",
								"Transparent PNG with Crisp Alpha Channel",
								"16-Bit ProPhoto Layered PSD Master Files",
								"Optimized Next-Gen WebP / AVIF for Web Performance"
							]).map((deliv, idx) => /* @__PURE__ */ jsxs("div", {
								className: "p-5 rounded-2xl bg-[#F8F9FA] border border-neutral-200/70 space-y-2",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "w-8 h-8 rounded-xl bg-white border border-neutral-200 flex items-center justify-center text-emerald-600 shadow-xs",
										children: /* @__PURE__ */ jsx(FileCheck2, { className: "w-4 h-4" })
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-xs font-extrabold text-[#0F0F12]",
										children: deliv
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-[11px] text-neutral-500 font-medium",
										children: "Certified 300 DPI Color Space"
									})
								]
							}, idx))
						})]
					})
				})
			}),
			service.faqs && service.faqs.length > 0 && /* @__PURE__ */ jsx("section", {
				className: "py-12 px-4 sm:px-8",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-3xl mx-auto space-y-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "text-center space-y-2",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 block",
							children: "KNOWLEDGE BASE"
						}), /* @__PURE__ */ jsx("h2", {
							className: "text-2xl sm:text-3xl font-extrabold text-[#0F0F12]",
							children: "Frequently Asked Questions"
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "space-y-3",
						children: service.faqs.map((faq, idx) => {
							const isOpen = openFaqIdx === idx;
							return /* @__PURE__ */ jsxs("div", {
								className: "rounded-2xl bg-white border border-neutral-200/80 overflow-hidden shadow-xs",
								children: [/* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => setOpenFaqIdx(isOpen ? null : idx),
									className: "w-full p-5 text-left flex items-center justify-between gap-4 font-extrabold text-sm text-[#0F0F12]",
									children: [/* @__PURE__ */ jsx("span", { children: faq.question }), /* @__PURE__ */ jsx(ChevronDown, { className: `w-4 h-4 text-neutral-400 transition-transform ${isOpen ? "rotate-180 text-emerald-600" : ""}` })]
								}), isOpen && /* @__PURE__ */ jsx("div", {
									className: "px-5 pb-5 text-xs sm:text-sm text-neutral-600 font-medium leading-relaxed border-t border-neutral-100 pt-3",
									children: faq.answer
								})]
							}, idx);
						})
					})]
				})
			}),
			/* @__PURE__ */ jsx("section", {
				id: "free-sample",
				className: "py-12 px-4 sm:px-8",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-5xl mx-auto rounded-[32px] bg-[#0F0F12] text-white p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden",
					children: [
						/* @__PURE__ */ jsx("div", { className: "absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" }),
						/* @__PURE__ */ jsx("span", {
							className: "text-xs font-bold uppercase tracking-widest text-emerald-400 block",
							children: "NO RISK • STRICT NDA PROTECTION"
						}),
						/* @__PURE__ */ jsx("h2", {
							className: "text-3xl sm:text-4xl font-extrabold tracking-tight max-w-xl mx-auto",
							children: "Ready to inspect our craft on your own RAW product photos?"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-xs sm:text-sm text-neutral-400 max-w-md mx-auto leading-relaxed",
							children: "Upload up to 3 sample images. We'll return pixel-perfect hand-drawn vector clipping paths and master PSDs in under 12 hours."
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap items-center justify-center gap-3 pt-2",
							children: [/* @__PURE__ */ jsxs(Link, {
								href: "/#free-sample",
								className: "px-8 py-4 rounded-full bg-emerald-400 hover:bg-emerald-300 text-[#0F0F12] font-extrabold text-xs sm:text-sm transition-all shadow-lg flex items-center gap-2",
								children: [/* @__PURE__ */ jsx("span", { children: "Submit Free Test Batch" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4" })]
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => window.dispatchEvent(new CustomEvent("ce:open-discovery-call")),
								className: "px-6 py-4 rounded-full bg-white/10 hover:bg-white/15 text-white font-bold text-xs sm:text-sm transition-all",
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
export { VariantMinimalist };
