import { useState } from "react";
import { ArrowUpRight, Check, CheckCircle2, ChevronDown, ShieldCheck, Sparkles, Star, Upload } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Services/Variants/VariantHighConversion.tsx
var VariantHighConversion = ({ service, otherServices = [], relatedProjects = [], calendlyUrl }) => {
	const [sliderPos, setSliderPos] = useState(50);
	const [uploadedFiles, setUploadedFiles] = useState([]);
	const [sampleSubmitted, setSampleSubmitted] = useState(false);
	const [openFaq, setOpenFaq] = useState(0);
	const handleFileChange = (e) => {
		if (e.target.files && e.target.files.length > 0) setUploadedFiles((prev) => [...prev, ...Array.from(e.target.files)]);
	};
	const handleFormSubmit = (e) => {
		e.preventDefault();
		setSampleSubmitted(true);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-white text-[#0F172A] antialiased selection:bg-emerald-500 selection:text-white pb-36",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "bg-[#0F172A] text-white py-2.5 px-4 text-center text-xs font-semibold flex items-center justify-center gap-2",
				children: [
					/* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-400 animate-pulse" }),
					/* @__PURE__ */ jsx("span", { children: "Try Before You Commit: 3 Free Pilot Assets Returned in Under 12 Hours." }),
					/* @__PURE__ */ jsx("a", {
						href: "#trial-box",
						className: "underline font-bold text-emerald-300 hover:text-white transition-colors",
						children: "Upload Free Batch →"
					})
				]
			}),
			/* @__PURE__ */ jsx("section", {
				className: "pt-12 sm:pt-16 pb-16 px-4 sm:px-8 border-b border-neutral-100 bg-[#F8FAFC]",
				children: /* @__PURE__ */ jsx("div", {
					className: "max-w-7xl mx-auto",
					children: /* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 lg:grid-cols-12 gap-10 items-center",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "lg:col-span-7 space-y-6",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-neutral-200 shadow-xs text-xs font-bold text-neutral-700",
									children: [/* @__PURE__ */ jsx("div", {
										className: "flex text-amber-400",
										children: [...Array(5)].map((_, i) => /* @__PURE__ */ jsx(Star, { className: "w-3.5 h-3.5 fill-current" }, i))
									}), /* @__PURE__ */ jsx("span", { children: "4.9/5 from 350+ Enterprise E-Commerce Brands" })]
								}),
								/* @__PURE__ */ jsx("h1", {
									className: "text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0F172A] leading-[1.08]",
									children: service.h1_title || service.title
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-base sm:text-lg text-neutral-600 leading-relaxed font-normal max-w-xl",
									children: service.subtitle || "Turn raw studio shoots into ready-to-sell catalog assets in under 12 hours. 100% hand-crafted vector accuracy, zero automated fuzziness."
								}),
								/* @__PURE__ */ jsx("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2",
									children: [
										"100% Hand-Drawn Pen Tool Vectors",
										"Guaranteed 12-Hour SLA Turnaround",
										"Calibrated Delta-E Swatch Consistency",
										"Dedicated Senior Retoucher Pod"
									].map((feat, i) => /* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2.5 text-xs font-bold text-[#0F172A]",
										children: [/* @__PURE__ */ jsx("div", {
											className: "w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0",
											children: /* @__PURE__ */ jsx(Check, { className: "w-2.5 h-2.5 stroke-[3]" })
										}), /* @__PURE__ */ jsx("span", { children: feat })]
									}, i))
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-4 pt-4 border-t border-neutral-200",
									children: [/* @__PURE__ */ jsx("div", {
										className: "flex -space-x-2",
										children: [
											"https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
											"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
											"https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
										].map((src, i) => /* @__PURE__ */ jsx("img", {
											src,
											alt: "Client",
											className: "w-8 h-8 rounded-full border-2 border-white object-cover"
										}, i))
									}), /* @__PURE__ */ jsxs("div", {
										className: "text-xs text-neutral-500",
										children: ["Trusted by Art Directors at ", /* @__PURE__ */ jsx("span", {
											className: "font-bold text-[#0F172A]",
											children: "Nike, Farfetch, SSENSE, and Kith"
										})]
									})]
								})
							]
						}), /* @__PURE__ */ jsx("div", {
							id: "trial-box",
							className: "lg:col-span-5",
							children: /* @__PURE__ */ jsxs("div", {
								className: "rounded-3xl bg-white border border-neutral-200 p-6 sm:p-8 shadow-xl space-y-5",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "space-y-1",
									children: [
										/* @__PURE__ */ jsx("div", {
											className: "inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-extrabold uppercase tracking-wide",
											children: "ZERO COST PILOT"
										}),
										/* @__PURE__ */ jsx("h3", {
											className: "text-xl font-extrabold text-[#0F172A]",
											children: "Test 3 Free Assets Now"
										}),
										/* @__PURE__ */ jsx("p", {
											className: "text-xs text-neutral-500",
											children: "Upload your toughest RAW files. Receive full PSD masters within 12h."
										})
									]
								}), !sampleSubmitted ? /* @__PURE__ */ jsxs("form", {
									onSubmit: handleFormSubmit,
									className: "space-y-3.5",
									children: [
										/* @__PURE__ */ jsxs("label", {
											className: "block p-5 border-2 border-dashed border-neutral-300 hover:border-emerald-500 rounded-2xl text-center cursor-pointer transition-colors bg-neutral-50/50",
											children: [
												/* @__PURE__ */ jsx("input", {
													type: "file",
													multiple: true,
													className: "hidden",
													onChange: handleFileChange
												}),
												/* @__PURE__ */ jsx("div", {
													className: "w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2",
													children: /* @__PURE__ */ jsx(Upload, { className: "w-5 h-5" })
												}),
												/* @__PURE__ */ jsx("span", {
													className: "text-xs font-extrabold text-[#0F172A] block",
													children: uploadedFiles.length > 0 ? `${uploadedFiles.length} file(s) attached` : "Drop RAW, PSD, TIFF or JPG here"
												}),
												/* @__PURE__ */ jsx("span", {
													className: "text-[10px] text-neutral-400 mt-0.5 block",
													children: "Up to 3 free sample assets • Protected under NDA"
												})
											]
										}),
										/* @__PURE__ */ jsx("input", {
											type: "email",
											required: true,
											placeholder: "Your work email...",
											className: "w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-[#0F172A] placeholder-neutral-400 focus:outline-none focus:border-emerald-500 font-medium"
										}),
										/* @__PURE__ */ jsxs("button", {
											type: "submit",
											className: "w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer",
											children: [/* @__PURE__ */ jsx(Sparkles, { className: "w-4 h-4" }), /* @__PURE__ */ jsx("span", { children: "Request Free Sample Retouch" })]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-center justify-center gap-2 text-[10px] text-neutral-400 font-medium pt-1",
											children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "w-3.5 h-3.5 text-emerald-500" }), /* @__PURE__ */ jsx("span", { children: "No credit card required • Strict confidentiality guarantee" })]
										})
									]
								}) : /* @__PURE__ */ jsxs("div", {
									className: "p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3",
									children: [
										/* @__PURE__ */ jsx(CheckCircle2, { className: "w-10 h-10 text-emerald-500 mx-auto" }),
										/* @__PURE__ */ jsx("h4", {
											className: "font-extrabold text-base text-[#0F172A]",
											children: "Sample Batch Received"
										}),
										/* @__PURE__ */ jsx("p", {
											className: "text-xs text-neutral-600",
											children: "Our senior retouching desk has queued your sample for 12h turnaround."
										}),
										/* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: () => {
												setSampleSubmitted(false);
												setUploadedFiles([]);
											},
											className: "text-xs font-bold text-emerald-600 underline",
											children: "Upload another sample"
										})
									]
								})]
							})
						})]
					})
				})
			}),
			/* @__PURE__ */ jsx("section", {
				className: "py-8 bg-white border-b border-neutral-100",
				children: /* @__PURE__ */ jsx("div", {
					className: "max-w-7xl mx-auto px-4 sm:px-8",
					children: /* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-2 lg:grid-cols-4 gap-6 text-center",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ jsx("div", {
									className: "text-3xl sm:text-4xl font-extrabold text-[#0F172A]",
									children: "99.8%"
								}), /* @__PURE__ */ jsx("div", {
									className: "text-xs font-bold text-neutral-500 uppercase tracking-wide",
									children: "First-Pass Approval"
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ jsx("div", {
									className: "text-3xl sm:text-4xl font-extrabold text-emerald-600",
									children: "12 Hours"
								}), /* @__PURE__ */ jsx("div", {
									className: "text-xs font-bold text-neutral-500 uppercase tracking-wide",
									children: "Contractual SLA"
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ jsx("div", {
									className: "text-3xl sm:text-4xl font-extrabold text-[#0F172A]",
									children: "15,000+"
								}), /* @__PURE__ */ jsx("div", {
									className: "text-xs font-bold text-neutral-500 uppercase tracking-wide",
									children: "Daily SKU Bandwidth"
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ jsx("div", {
									className: "text-3xl sm:text-4xl font-extrabold text-[#0F172A]",
									children: "$0.00"
								}), /* @__PURE__ */ jsx("div", {
									className: "text-xs font-bold text-neutral-500 uppercase tracking-wide",
									children: "Setup or Ingest Fee"
								})]
							})
						]
					})
				})
			}),
			/* @__PURE__ */ jsx("section", {
				className: "py-16 px-4 sm:px-8 bg-[#F8FAFC] border-b border-neutral-100",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-5xl mx-auto space-y-8",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "text-center space-y-2",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "text-xs font-extrabold uppercase tracking-widest text-emerald-600 block",
								children: "RESULTS PROVEN"
							}),
							/* @__PURE__ */ jsx("h2", {
								className: "text-2xl sm:text-4xl font-extrabold text-[#0F172A]",
								children: "Drag to Inspect the Quality Leap"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-xs sm:text-sm text-neutral-500 max-w-md mx-auto",
								children: "Compare unretouched studio camera raw against our hand-crafted, production-ready master."
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "relative h-[360px] sm:h-[460px] rounded-3xl overflow-hidden cursor-ew-resize select-none border border-neutral-200 shadow-lg bg-neutral-100",
						onMouseMove: (e) => {
							const rect = e.currentTarget.getBoundingClientRect();
							const pos = (e.clientX - rect.left) / rect.width * 100;
							setSliderPos(Math.max(5, Math.min(pos, 95)));
						},
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "absolute inset-0 bg-white flex items-center justify-center p-6",
								children: /* @__PURE__ */ jsx("img", {
									src: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1400&q=85",
									alt: "Retouched",
									className: "max-h-full max-w-full object-contain filter drop-shadow-[0_28px_24px_rgba(15,15,18,0.22)]"
								})
							}),
							/* @__PURE__ */ jsx("div", {
								className: "absolute inset-0 bg-[#E5E5E2] overflow-hidden flex items-center justify-center p-6 border-r-2 border-white",
								style: { width: `${sliderPos}%` },
								children: /* @__PURE__ */ jsx("img", {
									src: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1400&q=80",
									alt: "Raw",
									className: "max-h-full max-w-full object-contain filter brightness-75 contrast-75 saturate-50"
								})
							}),
							/* @__PURE__ */ jsx("div", {
								className: "absolute top-0 bottom-0 w-0.5 bg-white shadow-lg pointer-events-none",
								style: { left: `${sliderPos}%` },
								children: /* @__PURE__ */ jsx("div", {
									className: "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center shadow-xl border-2 border-white",
									children: "↔"
								})
							}),
							/* @__PURE__ */ jsx("div", {
								className: "absolute top-4 left-4 px-3 py-1 bg-black/70 text-white rounded-full text-xs font-bold",
								children: "Camera RAW"
							}),
							/* @__PURE__ */ jsx("div", {
								className: "absolute top-4 right-4 px-3 py-1 bg-emerald-500 text-white rounded-full text-xs font-bold shadow-md",
								children: "CuttingEdger Master"
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ jsx("section", {
				className: "py-16 px-4 sm:px-8 border-b border-neutral-100",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-5xl mx-auto space-y-8",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "text-center space-y-2",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-xs font-extrabold uppercase tracking-widest text-emerald-600 block",
							children: "ROI & EFFICIENCY"
						}), /* @__PURE__ */ jsx("h2", {
							className: "text-2xl sm:text-4xl font-extrabold text-[#0F172A]",
							children: "In-House Bottlenecks vs CuttingEdger Advantage"
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 md:grid-cols-2 gap-6",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "p-6 sm:p-8 rounded-3xl bg-neutral-50 border border-neutral-200 space-y-4",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-xs font-bold text-red-500 uppercase tracking-wide",
								children: "Doing It In-House or Generic Platforms"
							}), /* @__PURE__ */ jsxs("ul", {
								className: "space-y-3 text-xs sm:text-sm text-neutral-600 font-medium",
								children: [
									/* @__PURE__ */ jsxs("li", {
										className: "flex items-start gap-2.5",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-red-500 font-bold shrink-0",
											children: "✕"
										}), /* @__PURE__ */ jsx("span", { children: "Photographers & retouchers burn hours on manual clipping instead of creative shoots" })]
									}),
									/* @__PURE__ */ jsxs("li", {
										className: "flex items-start gap-2.5",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-red-500 font-bold shrink-0",
											children: "✕"
										}), /* @__PURE__ */ jsx("span", { children: "Seasonal drop spikes create multi-week catalog publication delays" })]
									}),
									/* @__PURE__ */ jsxs("li", {
										className: "flex items-start gap-2.5",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-red-500 font-bold shrink-0",
											children: "✕"
										}), /* @__PURE__ */ jsx("span", { children: "High payroll overhead for idle retouchers between campaign launches" })]
									})
								]
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "p-6 sm:p-8 rounded-3xl bg-emerald-50/50 border border-emerald-200 space-y-4",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-xs font-bold text-emerald-600 uppercase tracking-wide",
								children: "With CuttingEdger Retouching Retainer"
							}), /* @__PURE__ */ jsxs("ul", {
								className: "space-y-3 text-xs sm:text-sm text-[#0F172A] font-medium",
								children: [
									/* @__PURE__ */ jsxs("li", {
										className: "flex items-start gap-2.5",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-emerald-600 font-bold shrink-0",
											children: "✓"
										}), /* @__PURE__ */ jsx("span", { children: "Guaranteed 12-hour turnaround so new collections hit Shopify on schedule" })]
									}),
									/* @__PURE__ */ jsxs("li", {
										className: "flex items-start gap-2.5",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-emerald-600 font-bold shrink-0",
											children: "✓"
										}), /* @__PURE__ */ jsx("span", { children: "Elastic capacity: scale from 20 to 10,000 SKUs overnight without hiring" })]
									}),
									/* @__PURE__ */ jsxs("li", {
										className: "flex items-start gap-2.5",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-emerald-600 font-bold shrink-0",
											children: "✓"
										}), /* @__PURE__ */ jsx("span", { children: "Zero setup fees, transparent volume pricing, and contractual NDA safety" })]
									})
								]
							})]
						})]
					})]
				})
			}),
			service.faqs && service.faqs.length > 0 && /* @__PURE__ */ jsx("section", {
				className: "py-16 px-4 sm:px-8 border-b border-neutral-100 bg-[#F8FAFC]",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-3xl mx-auto space-y-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "text-center space-y-2",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-xs font-extrabold uppercase tracking-widest text-emerald-600 block",
							children: "FREQUENTLY ASKED"
						}), /* @__PURE__ */ jsx("h2", {
							className: "text-2xl sm:text-3xl font-extrabold text-[#0F172A]",
							children: "Common Questions"
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "space-y-3",
						children: service.faqs.map((faq, idx) => {
							const isOpen = openFaq === idx;
							return /* @__PURE__ */ jsxs("div", {
								className: "p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs",
								children: [/* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => setOpenFaq(isOpen ? null : idx),
									className: "w-full text-left flex items-center justify-between gap-4 font-bold text-sm text-[#0F172A]",
									children: [/* @__PURE__ */ jsx("span", { children: faq.question }), /* @__PURE__ */ jsx(ChevronDown, { className: `w-4 h-4 text-neutral-400 transition-transform ${isOpen ? "rotate-180 text-emerald-600" : ""}` })]
								}), isOpen && /* @__PURE__ */ jsx("p", {
									className: "text-xs text-neutral-600 leading-relaxed pt-3 border-t border-neutral-100 mt-3 font-normal",
									children: faq.answer
								})]
							}, idx);
						})
					})]
				})
			}),
			/* @__PURE__ */ jsx("div", {
				className: "fixed bottom-20 inset-x-0 z-40 pointer-events-none px-4 flex justify-center",
				children: /* @__PURE__ */ jsxs("div", {
					className: "pointer-events-auto bg-[#0F172A] text-white px-5 py-3 rounded-full shadow-2xl border border-white/20 flex items-center gap-4 text-xs",
					children: [/* @__PURE__ */ jsx("span", {
						className: "hidden sm:inline font-bold",
						children: "Ready to test with 3 free assets?"
					}), /* @__PURE__ */ jsxs("a", {
						href: "#trial-box",
						className: "px-4 py-2 rounded-full bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold transition-all flex items-center gap-1.5 shadow-md",
						children: [/* @__PURE__ */ jsx("span", { children: "Upload Free Sample Batch" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-3.5 h-3.5" })]
					})]
				})
			})
		]
	});
};
//#endregion
export { VariantHighConversion };
