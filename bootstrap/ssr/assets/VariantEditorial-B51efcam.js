import { useState } from "react";
import { Link } from "@inertiajs/react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Services/Variants/VariantEditorial.tsx
var VariantEditorial = ({ service, otherServices = [], relatedProjects = [], calendlyUrl }) => {
	const [openFaq, setOpenFaq] = useState(0);
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-[#F6F5F0] text-[#141416] antialiased selection:bg-[#141416] selection:text-[#F6F5F0] pb-32",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "border-b border-[#141416]/15 bg-[#F6F5F0] sticky top-0 z-40",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-7xl mx-auto px-4 sm:px-8 h-12 flex items-center justify-between text-[11px] font-mono tracking-widest uppercase",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "font-bold text-[#141416]",
								children: "ATELIER DOSSIER"
							}),
							/* @__PURE__ */ jsx("span", {
								className: "text-[#141416]/30",
								children: "/"
							}),
							/* @__PURE__ */ jsx("span", {
								className: "text-[#141416]/70 truncate max-w-[200px] sm:max-w-none",
								children: service.title
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-4 text-[#141416]/70",
						children: [/* @__PURE__ */ jsx("span", {
							className: "hidden sm:inline",
							children: "PARIS • NEW YORK • TOKYO"
						}), /* @__PURE__ */ jsx("span", {
							className: "font-bold text-[#141416]",
							children: "VOL. 26"
						})]
					})]
				})
			}),
			/* @__PURE__ */ jsx("section", {
				className: "pt-16 pb-16 px-4 sm:px-8 border-b border-[#141416]/15",
				children: /* @__PURE__ */ jsx("div", {
					className: "max-w-7xl mx-auto",
					children: /* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 lg:grid-cols-12 gap-8 items-start",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "lg:col-span-7 space-y-6",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ jsxs("span", {
										className: "font-mono text-xs uppercase tracking-[0.25em] text-[#141416]/60 font-semibold block",
										children: ["CAPABILITY ESSAY // NO. ", service.id || "07"]
									}), /* @__PURE__ */ jsx("h1", {
										className: "text-4xl sm:text-6xl font-serif tracking-tight text-[#141416] leading-[1.05]",
										children: service.h1_title || service.title
									})]
								}),
								/* @__PURE__ */ jsxs("p", {
									className: "text-lg sm:text-xl font-serif text-[#141416]/80 leading-relaxed italic border-l-2 border-[#141416] pl-6 py-1",
									children: [
										"\"",
										service.subtitle || "The standard of luxury visual merchandising is defined by sub-millimeter precision.",
										"\""
									]
								}),
								/* @__PURE__ */ jsx("div", {
									className: "text-sm text-[#141416]/75 leading-relaxed space-y-4 pt-2",
									children: /* @__PURE__ */ jsxs("p", { children: [/* @__PURE__ */ jsx("span", {
										className: "float-left text-5xl font-serif font-bold pr-3 leading-none text-[#141416]",
										children: service.description ? service.description.charAt(0) : "W"
									}), service.description ? service.description.slice(1) : "e treat every digital asset as a bespoke architectural plate. In luxury e-commerce, automated cuts destroy brand prestige."] })
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex flex-wrap items-center gap-3 pt-4 font-mono text-xs uppercase tracking-wider",
									children: [/* @__PURE__ */ jsxs("a", {
										href: "#free-sample",
										className: "px-6 py-3.5 bg-[#141416] hover:bg-neutral-800 text-[#F6F5F0] font-bold transition-colors flex items-center gap-2",
										children: [/* @__PURE__ */ jsx("span", { children: "Request Atelier Sample Batch" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4" })]
									}), /* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => window.dispatchEvent(new CustomEvent("ce:open-discovery-call")),
										className: "px-6 py-3.5 border border-[#141416] hover:bg-[#141416]/5 text-[#141416] font-bold transition-colors",
										children: "Schedule Private Consultation"
									})]
								})
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "lg:col-span-5 space-y-4",
							children: [/* @__PURE__ */ jsx("div", {
								className: "relative rounded-2xl overflow-hidden border border-[#141416]/20 bg-[#E8E6DF] p-3 shadow-sm",
								children: /* @__PURE__ */ jsxs("div", {
									className: "relative h-[420px] rounded-xl overflow-hidden bg-neutral-200",
									children: [
										/* @__PURE__ */ jsx("img", {
											src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85",
											alt: service.title,
											className: "w-full h-full object-cover grayscale contrast-110 hover:grayscale-0 transition-all duration-700"
										}),
										/* @__PURE__ */ jsx("div", {
											className: "absolute top-4 left-4 px-3 py-1 bg-[#141416] text-[#F6F5F0] font-mono text-[10px] tracking-widest uppercase",
											children: "FIG. 01 — PLATE ARCHIVE"
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "absolute bottom-4 inset-x-4 p-4 bg-white/90 backdrop-blur-md border border-[#141416]/10 text-xs space-y-1",
											children: [/* @__PURE__ */ jsxs("div", {
												className: "font-serif font-bold text-sm text-[#141416]",
												children: [service.title, " • 300 DPI Atelier Master"]
											}), /* @__PURE__ */ jsx("div", {
												className: "font-mono text-[10px] text-[#141416]/60",
												children: "100% Hand-Rolled Vector Paths • Zero Artifact Halos"
											})]
										})
									]
								})
							}), /* @__PURE__ */ jsxs("div", {
								className: "p-4 rounded-xl border border-[#141416]/15 bg-white/60 font-mono text-xs grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
									className: "text-[#141416]/40 uppercase text-[10px] block font-bold",
									children: "PRODUCTION SLA"
								}), /* @__PURE__ */ jsx("span", {
									className: "font-bold text-[#141416]",
									children: "12h Guaranteed"
								})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
									className: "text-[#141416]/40 uppercase text-[10px] block font-bold",
									children: "VECTOR ACCURACY"
								}), /* @__PURE__ */ jsx("span", {
									className: "font-bold text-[#141416]",
									children: "0.1px Hand-Drawn"
								})] })]
							})]
						})]
					})
				})
			}),
			/* @__PURE__ */ jsx("div", {
				className: "py-6 border-b border-[#141416]/15 bg-[#EFECE4] overflow-hidden",
				children: /* @__PURE__ */ jsx("div", {
					className: "max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between gap-6 overflow-x-auto no-scrollbar font-serif text-sm tracking-[0.2em] text-[#141416]/60 font-semibold",
					children: [
						"BALENCIAGA",
						"CARTIER",
						"SSENSE",
						"MONCLER",
						"KITH",
						"JIL SANDER",
						"ACNE STUDIOS"
					].map((brand, i) => /* @__PURE__ */ jsx("span", {
						className: "hover:text-[#141416] transition-colors shrink-0",
						children: brand
					}, i))
				})
			}),
			/* @__PURE__ */ jsx("section", {
				className: "py-20 px-4 sm:px-8 border-b border-[#141416]/15",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-7xl mx-auto space-y-12",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "max-w-2xl space-y-2",
						children: [/* @__PURE__ */ jsx("span", {
							className: "font-mono text-xs uppercase tracking-[0.25em] text-[#141416]/60 font-semibold block",
							children: "DIAGNOSTIC DISCOURSE"
						}), /* @__PURE__ */ jsx("h2", {
							className: "text-3xl sm:text-4xl font-serif text-[#141416]",
							children: "The Aesthetic Dilemma & Our Resolution"
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 md:grid-cols-2 gap-12 items-start",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "space-y-4 border-t-2 border-[#141416] pt-6",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "font-mono text-xs uppercase tracking-widest text-[#141416]/50 block font-bold",
									children: "[ 01 // THE PRODUCTION COMPROMISE ]"
								}),
								/* @__PURE__ */ jsx("h3", {
									className: "text-2xl font-serif font-bold text-[#141416]",
									children: "Why Off-the-Shelf AI Destroys Luxury Perception"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-sm text-[#141416]/75 leading-relaxed font-serif",
									children: service.problem_statement || "Algorithmic cutouts soften silhouettes, trim essential garment seams, and introduce color contamination. High-end clientele notice sub-pixel degradation immediately, leading to high return rates and eroded trust."
								}),
								/* @__PURE__ */ jsxs("ul", {
									className: "space-y-2 pt-2 font-mono text-xs text-[#141416]/70",
									children: [/* @__PURE__ */ jsxs("li", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ jsx("span", { children: "—" }), /* @__PURE__ */ jsx("span", { children: "Fuzzy feathered contours instead of crisp architectural lines" })]
									}), /* @__PURE__ */ jsxs("li", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ jsx("span", { children: "—" }), /* @__PURE__ */ jsx("span", { children: "Inconsistent lighting and uncalibrated skin/fabric hues" })]
									})]
								})
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "space-y-4 border-t-2 border-[#141416] pt-6",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "font-mono text-xs uppercase tracking-widest text-[#141416]/50 block font-bold",
									children: "[ 02 // THE MASTER CRAFT METHOD ]"
								}),
								/* @__PURE__ */ jsx("h3", {
									className: "text-2xl font-serif font-bold text-[#141416]",
									children: "Hand-Crafted Precision by Senior Artisans"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-sm text-[#141416]/75 leading-relaxed font-serif",
									children: service.solution_statement || "Our retouchers manually guide every Bézier anchor point with 300% zoom vector paths. Dual-pass quality control checks ensure pure non-destructive PSD deliverables certified for both print and high-density screens."
								}),
								/* @__PURE__ */ jsxs("ul", {
									className: "space-y-2 pt-2 font-mono text-xs text-[#141416]/70",
									children: [/* @__PURE__ */ jsxs("li", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-emerald-700 font-bold",
											children: "✓"
										}), /* @__PURE__ */ jsx("span", { children: "100% hand-drawn vector paths placed 1px inside the edge" })]
									}), /* @__PURE__ */ jsxs("li", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-emerald-700 font-bold",
											children: "✓"
										}), /* @__PURE__ */ jsx("span", { children: "Delta-E certified color accuracy across diverse lighting" })]
									})]
								})
							]
						})]
					})]
				})
			}),
			service.process_steps && service.process_steps.length > 0 && /* @__PURE__ */ jsx("section", {
				className: "py-20 px-4 sm:px-8 border-b border-[#141416]/15",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-7xl mx-auto space-y-12",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#141416]/15 pb-6",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
							className: "font-mono text-xs uppercase tracking-[0.25em] text-[#141416]/60 font-semibold block",
							children: "SYSTEMATIC PROTOCOL"
						}), /* @__PURE__ */ jsx("h2", {
							className: "text-3xl font-serif text-[#141416]",
							children: "The Four-Stage Atelier Pipeline"
						})] }), /* @__PURE__ */ jsx("span", {
							className: "font-mono text-xs text-[#141416]/60 uppercase tracking-widest",
							children: "VERIFIED SLA: 12-HOUR CYCLE"
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8",
						children: service.process_steps.map((step, idx) => /* @__PURE__ */ jsxs("div", {
							className: "space-y-3",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "font-serif text-4xl text-[#141416]/30 font-bold",
									children: step.step
								}),
								/* @__PURE__ */ jsx("h4", {
									className: "font-serif font-bold text-lg text-[#141416] border-b border-[#141416]/20 pb-2",
									children: step.title
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-xs text-[#141416]/70 leading-relaxed font-serif",
									children: step.description
								})
							]
						}, idx))
					})]
				})
			}),
			/* @__PURE__ */ jsx("section", {
				className: "py-20 px-4 sm:px-8 border-b border-[#141416]/15",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-7xl mx-auto space-y-8",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "max-w-xl space-y-2",
						children: [/* @__PURE__ */ jsx("span", {
							className: "font-mono text-xs uppercase tracking-[0.25em] text-[#141416]/60 font-semibold block",
							children: "DELIVERABLE SPECIFICATION"
						}), /* @__PURE__ */ jsx("h2", {
							className: "text-3xl font-serif text-[#141416]",
							children: "Master Plate Deliverables"
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-1 md:grid-cols-3 gap-6",
						children: (service.deliverables || [
							"Clipping Path Embedded TIFF",
							"Layered 16-Bit ProPhoto PSD",
							"Crisp Alpha PNG Master Assets"
						]).map((deliv, idx) => /* @__PURE__ */ jsxs("div", {
							className: "p-6 bg-white border border-[#141416]/15 rounded-xl space-y-3",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "font-mono text-xs text-[#141416]/40 uppercase font-bold",
									children: ["ARCHIVE REF // 0", idx + 1]
								}),
								/* @__PURE__ */ jsx("div", {
									className: "font-serif font-bold text-lg text-[#141416]",
									children: deliv
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-xs text-[#141416]/60 font-serif leading-relaxed",
									children: "Certified for luxury editorial catalog ingest, web-optimized asset delivery, and high-resolution print."
								})
							]
						}, idx))
					})]
				})
			}),
			service.faqs && service.faqs.length > 0 && /* @__PURE__ */ jsx("section", {
				className: "py-20 px-4 sm:px-8 border-b border-[#141416]/15",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-4xl mx-auto space-y-8",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "text-center space-y-2",
						children: [/* @__PURE__ */ jsx("span", {
							className: "font-mono text-xs uppercase tracking-[0.25em] text-[#141416]/60 font-semibold block",
							children: "CONSULTATIVE INQUIRIES"
						}), /* @__PURE__ */ jsx("h2", {
							className: "text-3xl font-serif text-[#141416]",
							children: "Frequently Addressed Inquiries"
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "space-y-4",
						children: service.faqs.map((faq, idx) => {
							const isOpen = openFaq === idx;
							return /* @__PURE__ */ jsxs("div", {
								className: "border-b border-[#141416]/20 pb-4",
								children: [/* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => setOpenFaq(isOpen ? null : idx),
									className: "w-full text-left flex items-center justify-between gap-4 font-serif font-bold text-lg text-[#141416] py-2",
									children: [/* @__PURE__ */ jsx("span", { children: faq.question }), /* @__PURE__ */ jsx(ChevronDown, { className: `w-4 h-4 text-[#141416]/50 transition-transform ${isOpen ? "rotate-180 text-[#141416]" : ""}` })]
								}), isOpen && /* @__PURE__ */ jsx("p", {
									className: "text-sm font-serif text-[#141416]/75 leading-relaxed pt-2",
									children: faq.answer
								})]
							}, idx);
						})
					})]
				})
			}),
			/* @__PURE__ */ jsx("section", {
				id: "free-sample",
				className: "py-20 px-4 sm:px-8",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-4xl mx-auto text-center space-y-6",
					children: [
						/* @__PURE__ */ jsx("span", {
							className: "font-mono text-xs uppercase tracking-[0.25em] text-[#141416]/60 font-semibold block",
							children: "BESPOKE COMMISSION"
						}),
						/* @__PURE__ */ jsx("h2", {
							className: "text-3xl sm:text-5xl font-serif text-[#141416] max-w-2xl mx-auto leading-tight",
							children: "Commission a complimentary three-asset evaluation batch."
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-sm sm:text-base font-serif text-[#141416]/70 max-w-lg mx-auto leading-relaxed",
							children: "Witness our hand-drawn precision directly on your collection's most demanding silhouettes."
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap items-center justify-center gap-4 pt-4 font-mono text-xs uppercase tracking-wider",
							children: [/* @__PURE__ */ jsxs(Link, {
								href: "/#free-sample",
								className: "px-8 py-4 bg-[#141416] hover:bg-neutral-800 text-[#F6F5F0] font-bold transition-all flex items-center gap-2",
								children: [/* @__PURE__ */ jsx("span", { children: "Submit Evaluation Batch" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4" })]
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => window.dispatchEvent(new CustomEvent("ce:open-discovery-call")),
								className: "px-8 py-4 border border-[#141416] hover:bg-[#141416]/5 text-[#141416] font-bold transition-colors",
								children: "Arrange Discovery Call"
							})]
						})
					]
				})
			})
		]
	});
};
//#endregion
export { VariantEditorial };
