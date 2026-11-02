import { t as getAttributionData } from "../ssr.js";
import { t as SeoHead } from "./SeoHead-jRblvokC.js";
import { t as PageHero } from "./PageHero-BKafzHM7.js";
import { t as Accordion } from "./Accordion-B3zTmci_.js";
import { useEffect, useRef, useState } from "react";
import { Link, useForm } from "@inertiajs/react";
import { AlertTriangle, ArrowLeft, ArrowRight, ArrowUpRight, Box, Briefcase, Building2, Calendar, Check, Cpu, FileImage, Globe, Layers, Loader2, Lock, RotateCw, Send, ShieldCheck, ShoppingBag, Sparkles, UploadCloud, Users, X, Zap } from "lucide-react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Components/Pricing/PricingCardsSection.tsx
function PricingCardsSection() {
	const [activeTab, setActiveTab] = useState("2d");
	const currentTiers = activeTab === "2d" ? [
		{
			id: "starter-2d",
			name: "Essential Studio",
			badge: "Catalog Prep",
			icon: Layers,
			description: "Spotless product cutouts, vector clipping paths, and clean catalog delivery.",
			pricingLabel: "Per-Asset Volume Quote",
			pricingSubtext: "No monthly minimum • Pay as you go",
			sla: "24h Standard SLA",
			capacity: "Up to 500 assets/day",
			buttonText: "Request Volume Quote",
			features: [
				{
					bold: "100% Hand-drawn",
					text: "pen clipping paths & alpha masks"
				},
				{
					bold: "Pure white (RGB 255)",
					text: "& transparent format exports"
				},
				{
					bold: "Natural drop shadows",
					text: "& studio reflection sculpting"
				},
				{
					bold: "3-Stage human QA",
					text: "with unlimited free revisions"
				}
			]
		},
		{
			id: "pro-2d",
			name: "Pro Commercial",
			badge: "High-Velocity Retail",
			popular: true,
			icon: Sparkles,
			description: "Master retouching for fashion, apparel brands, and fast-moving creative agencies.",
			pricingLabel: "Studio Monthly Retainer",
			pricingSubtext: "Guaranteed daily throughput • Priority rush",
			sla: "12–18h Rush SLA",
			capacity: "500 to 3,000+ assets/day",
			buttonText: "Request Retainer Quote",
			features: [
				{
					bold: "Everything in Essential",
					text: "included as standard"
				},
				{
					bold: "3D Ghost mannequin",
					text: "neckline jointing & symmetry"
				},
				{
					bold: "Frequency separation",
					text: "high-end skin & apparel retouching"
				},
				{
					bold: "Colorway swaps",
					text: "& delta-E fabric swatch matching"
				}
			]
		},
		{
			id: "enterprise-2d",
			name: "Enterprise Vanguard",
			badge: "Bespoke 24/7",
			icon: ShieldCheck,
			description: "Dedicated infrastructure for global retailers, marketplaces, and high-volume catalogs.",
			pricingLabel: "Custom Enterprise Contract",
			pricingSubtext: "Dedicated artist squad • Executive SLA",
			sla: "Sub-6h Priority SLA",
			capacity: "Unlimited dedicated shifts",
			buttonText: "Contact Enterprise",
			features: [
				{
					bold: "Everything in Pro Commercial",
					text: "included"
				},
				{
					bold: "Dedicated 24/7 squad",
					text: "synchronized across global timezones"
				},
				{
					bold: "Automated SFTP / S3",
					text: "& direct API pipeline integration"
				},
				{
					bold: "Guaranteed peak burst",
					text: "capacity during seasonal drops"
				}
			]
		}
	] : [
		{
			id: "starter-3d",
			name: "3D Product Modeling",
			badge: "CAD & Mesh Topology",
			icon: Box,
			description: "High-fidelity 3D mesh reconstruction from industrial CAD, sketches, or 2D photo references.",
			pricingLabel: "Per-Model Volume Quote",
			pricingSubtext: "Commercial ownership • Multi-format exports",
			sla: "48h Initial Turnaround",
			capacity: "Up to 50 models/month",
			buttonText: "Request 3D Model Quote",
			features: [
				{
					bold: "Industrial CAD conversion",
					text: "from STEP, IGES, Rhino & SolidWorks"
				},
				{
					bold: "Clean quad topology",
					text: "optimized for real-time web & mobile"
				},
				{
					bold: "Accurate micron scale",
					text: "exact dimension matching to spec sheets"
				},
				{
					bold: "Multi-format exports",
					text: "GLTF, USDZ, FBX, OBJ & Blender source"
				}
			]
		},
		{
			id: "pro-3d",
			name: "Photorealistic CGI",
			badge: "Virtual Photography",
			popular: true,
			icon: Sparkles,
			description: "Hyper-realistic virtual studio renders with infinite camera angles and zero physical reshoots.",
			pricingLabel: "CGI Catalog Retainer",
			pricingSubtext: "Multi-angle batch outputs • Photoreal 8K PBR",
			sla: "24–48h Render Delivery",
			capacity: "100 to 500+ renders/month",
			buttonText: "Request CGI Quote",
			features: [
				{
					bold: "Everything in 3D Modeling",
					text: "included"
				},
				{
					bold: "8K PBR material maps",
					text: "procedural leather, glass, metals & fabrics"
				},
				{
					bold: "Virtual studio lighting",
					text: "cyclorama, architectural & studio HDRI"
				},
				{
					bold: "Infinite colorway swaps",
					text: "instant digital variations on demand"
				}
			]
		},
		{
			id: "enterprise-3d",
			name: "3D Configurator & AR",
			badge: "Spatial & Web3D",
			icon: Cpu,
			description: "Interactive web 3D product configurators, 360° spin viewers, and Apple Vision / iOS AR spatial assets.",
			pricingLabel: "Custom Spatial Contract",
			pricingSubtext: "Dedicated 3D pipeline squad • Engine integration",
			sla: "Continuous Sprint SLA",
			capacity: "Full enterprise integration",
			buttonText: "Contact Spatial Team",
			features: [
				{
					bold: "Everything in Photorealistic CGI",
					text: "included"
				},
				{
					bold: "Interactive 3D viewers",
					text: "lightweight WebGL / Three.js / Babylon"
				},
				{
					bold: "QuickLook & WebXR AR",
					text: "instant 1-tap mobile augmented reality"
				},
				{
					bold: "Headless PIM / CMS",
					text: "automated 3D asset syndication"
				}
			]
		}
	];
	const handleOpenContact = (planName) => {
		if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("ce:open-contact", { detail: { plan: planName } }));
	};
	return /* @__PURE__ */ jsxs("section", {
		id: "pricing-plans-section",
		className: "relative py-16 sm:py-20 bg-[#08090d] border-t border-white/[0.06] select-none overflow-hidden",
		children: [/* @__PURE__ */ jsx("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[25rem] bg-accent/[0.04] rounded-full blur-[180px] pointer-events-none" }), /* @__PURE__ */ jsxs("div", {
			className: "max-w-7xl mx-auto px-4 xs:px-6 lg:px-8 relative z-10",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "text-center max-w-4xl mx-auto mb-10 sm:mb-12 space-y-3",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono uppercase tracking-[0.2em] text-accent font-semibold",
							children: /* @__PURE__ */ jsx("span", { children: "Production Capacity & SLAs" })
						}),
						/* @__PURE__ */ jsxs("h2", {
							className: "text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight",
							children: ["Bespoke ", /* @__PURE__ */ jsx("span", {
								className: "text-accent",
								children: "Production Tiers"
							})]
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-sm sm:text-base text-neutral-400 font-sans leading-relaxed max-w-2xl mx-auto",
							children: "Select between high-volume 2D catalog retouching or full 3D CGI and spatial asset pipelines."
						}),
						/* @__PURE__ */ jsx("div", {
							className: "pt-4 flex items-center justify-center",
							children: /* @__PURE__ */ jsxs("div", {
								className: "inline-flex p-1.5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md shadow-lg",
								children: [/* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => setActiveTab("2d"),
									className: `flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider font-bold transition-all duration-300 cursor-pointer ${activeTab === "2d" ? "bg-accent text-black shadow-[0_0_20px_rgba(245,166,35,0.35)]" : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"}`,
									children: [/* @__PURE__ */ jsx(Layers, { className: "w-4 h-4" }), /* @__PURE__ */ jsx("span", { children: "2D Retouching (3 Tiers)" })]
								}), /* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => setActiveTab("3d"),
									className: `flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider font-bold transition-all duration-300 cursor-pointer ${activeTab === "3d" ? "bg-accent text-black shadow-[0_0_20px_rgba(245,166,35,0.35)]" : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"}`,
									children: [/* @__PURE__ */ jsx(Box, { className: "w-4 h-4" }), /* @__PURE__ */ jsx("span", { children: "3D CGI & Spatial (3 Tiers)" })]
								})]
							})
						})
					]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch",
					children: currentTiers.map((tier) => {
						const isFeatured = tier.popular;
						const Icon = tier.icon;
						return /* @__PURE__ */ jsxs("div", {
							className: `relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${isFeatured ? "bg-gradient-to-b from-[#141724] to-[#0e1017] border-2 border-accent/50 shadow-[0_0_40px_rgba(245,166,35,0.12)]" : "bg-gradient-to-b from-[#11131a] to-[#0c0d12] border border-white/[0.08] hover:border-white/20"}`,
							children: [
								isFeatured && /* @__PURE__ */ jsx("div", {
									className: "absolute -top-3.5 left-1/2 -translate-x-1/2 z-20",
									children: /* @__PURE__ */ jsxs("span", {
										className: "inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-accent text-black text-[10px] font-mono uppercase tracking-widest font-black shadow-lg",
										children: [/* @__PURE__ */ jsx(Zap, { className: "w-3 h-3 fill-black text-black" }), /* @__PURE__ */ jsx("span", { children: "Most Requested Tier" })]
									})
								}),
								/* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between gap-3 mb-4",
										children: [/* @__PURE__ */ jsx("div", {
											className: "w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-accent",
											children: /* @__PURE__ */ jsx(Icon, { className: "w-5 h-5" })
										}), /* @__PURE__ */ jsx("span", {
											className: "text-[10px] font-mono uppercase tracking-wider text-neutral-400 px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.06]",
											children: tier.badge
										})]
									}),
									/* @__PURE__ */ jsx("h3", {
										className: "text-xl sm:text-2xl font-display font-bold text-white mb-2",
										children: tier.name
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed mb-6",
										children: tier.description
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] mb-5",
										children: [/* @__PURE__ */ jsx("div", {
											className: "text-sm sm:text-base font-display font-bold text-white",
											children: tier.pricingLabel
										}), /* @__PURE__ */ jsx("div", {
											className: "text-[11px] font-sans text-neutral-400 mt-0.5",
											children: tier.pricingSubtext
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "grid grid-cols-2 gap-3 p-3 rounded-xl bg-black/30 border border-white/[0.05] mb-6 text-xs font-mono",
										children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
											className: "text-[10px] text-neutral-400 uppercase tracking-wider block mb-0.5",
											children: "Turnaround SLA"
										}), /* @__PURE__ */ jsx("span", {
											className: "text-white font-bold",
											children: tier.sla
										})] }), /* @__PURE__ */ jsxs("div", {
											className: "border-l border-white/[0.07] pl-3",
											children: [/* @__PURE__ */ jsx("span", {
												className: "text-[10px] text-neutral-400 uppercase tracking-wider block mb-0.5",
												children: "Throughput"
											}), /* @__PURE__ */ jsx("span", {
												className: "text-white font-bold",
												children: tier.capacity
											})]
										})]
									}),
									/* @__PURE__ */ jsx("div", {
										className: "space-y-2.5 mb-6",
										children: tier.features.map((feature, idx) => /* @__PURE__ */ jsxs("div", {
											className: "flex items-start gap-2.5 text-xs sm:text-[13px] text-neutral-300 font-sans leading-snug",
											children: [/* @__PURE__ */ jsx(Check, { className: "w-3.5 h-3.5 text-accent shrink-0 mt-0.5" }), /* @__PURE__ */ jsxs("span", { children: [
												/* @__PURE__ */ jsx("strong", {
													className: "text-white font-medium",
													children: feature.bold
												}),
												" ",
												feature.text
											] })]
										}, idx))
									})
								] }),
								/* @__PURE__ */ jsx("div", {
									className: "pt-3",
									children: /* @__PURE__ */ jsxs("button", {
										type: "button",
										onClick: () => handleOpenContact(tier.name),
										className: `group w-full py-3.5 px-5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${isFeatured ? "bg-accent text-black hover:bg-white shadow-[0_4px_20px_rgba(245,166,35,0.3)] hover:shadow-[0_4px_25px_rgba(255,255,255,0.4)]" : "bg-white/[0.05] hover:bg-white hover:text-black text-white border border-white/10 hover:border-white"}`,
										children: [/* @__PURE__ */ jsx("span", { children: tier.buttonText }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" })]
									})
								})
							]
						}, tier.id);
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-12 p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ jsx("div", {
							className: "w-9 h-9 rounded-xl bg-accent/10 border border-accent/25 flex items-center justify-center text-accent shrink-0",
							children: /* @__PURE__ */ jsx(ShieldCheck, { className: "w-4 h-4 text-accent" })
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
							className: "text-xs sm:text-sm font-display font-bold text-white",
							children: "Risk-Free Proof Of Concept Pilot"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-[11px] sm:text-xs text-neutral-400 font-sans",
							children: "Test our turnaround and precision on 3 of your actual production files with zero commitment."
						})] })]
					}), /* @__PURE__ */ jsx("a", {
						href: "#free-trial",
						className: "px-4 py-2 rounded-xl bg-white/5 hover:bg-accent hover:text-black border border-white/10 hover:border-accent text-xs font-mono uppercase tracking-wider text-white font-semibold transition-all duration-300 shrink-0 cursor-pointer",
						children: "Try 3 Files Free →"
					})]
				})
			]
		})]
	});
}
//#endregion
//#region resources/js/Components/Pricing/EnterpriseSolutionsSection.tsx
function EnterpriseSolutionsSection() {
	const handleOpenDiscoveryCall = () => {
		window.dispatchEvent(new CustomEvent("ce:open-discovery-call"));
	};
	return /* @__PURE__ */ jsxs("section", {
		className: "py-16 sm:py-20 bg-[#090a0e] relative overflow-hidden border-t border-white/10",
		children: [/* @__PURE__ */ jsx("div", { className: "absolute top-1/3 left-1/2 -translate-x-1/2 w-[50rem] h-[20rem] bg-accent/[0.03] rounded-full blur-[200px] pointer-events-none" }), /* @__PURE__ */ jsxs("div", {
			className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "text-center max-w-2xl mx-auto mb-12 sm:mb-14 space-y-2.5",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-mono uppercase tracking-[0.18em] text-accent font-semibold",
							children: [/* @__PURE__ */ jsx(Sparkles, { className: "w-3 h-3" }), /* @__PURE__ */ jsx("span", { children: "Enterprise Capacity" })]
						}),
						/* @__PURE__ */ jsxs("h2", {
							className: "text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-white tracking-tight",
							children: ["Enterprise & ", /* @__PURE__ */ jsx("span", {
								className: "text-accent",
								children: "Volume Partnerships"
							})]
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed",
							children: "Dedicated retouching pods, custom rush SLAs, and direct pipeline integrations for high-volume catalogs."
						})
					]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-10 sm:mb-12",
					children: [
						{
							icon: Users,
							badge: "Dedicated Pods",
							title: "Dedicated Artist Squads",
							description: "Photoshop artists calibrated exclusively to your brand guidelines, lighting ratios, and custom PSD action sets.",
							tags: [
								"Named Senior QA Lead",
								"Zero Style Drift",
								"Dedicated Allocation"
							]
						},
						{
							icon: Cpu,
							badge: "Headless Flow",
							title: "Automated Pipeline & API",
							description: "Hands-free asset synchronization via automated SFTP hotfolders, AWS S3 buckets, or our direct REST API.",
							tags: [
								"SFTP / S3 Hotfolders",
								"REST API & Webhooks",
								"Raw & TIFF Batches"
							]
						},
						{
							icon: Zap,
							badge: "24/7 Production",
							title: "Guaranteed Rush SLAs",
							description: "Round-the-clock shifts across global timezones with sub-6h priority delivery during peak seasonal launches.",
							tags: [
								"Sub-6h Emergency SLA",
								"10K+ Daily Volume",
								"Overnight Delivery"
							]
						},
						{
							icon: ShieldCheck,
							badge: "Enterprise Compliance",
							title: "Security & Corporate Terms",
							description: "Enterprise-grade security with bilateral NDAs, encrypted cloud vaults, and consolidated Net-30 monthly billing.",
							tags: [
								"Strict Mutual NDA",
								"Encrypted TLS Vault",
								"Net-30 Corporate Terms"
							]
						}
					].map((pillar, idx) => {
						const Icon = pillar.icon;
						return /* @__PURE__ */ jsxs("div", {
							className: "group rounded-2xl sm:rounded-3xl border border-white/10 bg-[#0f1118]/90 hover:bg-[#131520] hover:border-accent/40 transition-all duration-300 p-6 sm:p-7 relative flex flex-col justify-between hover:shadow-[0_15px_40px_rgba(245,166,35,0.08)]",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "space-y-3",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ jsx("div", {
											className: "w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-black transition-colors duration-300",
											children: /* @__PURE__ */ jsx(Icon, { className: "w-5 h-5" })
										}), /* @__PURE__ */ jsx("span", {
											className: "px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/10 text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-medium",
											children: pillar.badge
										})]
									}),
									/* @__PURE__ */ jsx("h3", {
										className: "text-lg sm:text-xl font-display font-bold text-white group-hover:text-accent transition-colors",
										children: pillar.title
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans",
										children: pillar.description
									})
								]
							}), /* @__PURE__ */ jsx("div", {
								className: "flex flex-wrap items-center gap-2 pt-5 mt-4 border-t border-white/5",
								children: pillar.tags.map((tag, i) => /* @__PURE__ */ jsx("span", {
									className: "px-2.5 py-1 rounded-md bg-white/[0.02] border border-white/5 text-[11px] font-mono text-neutral-300",
									children: tag
								}, i))
							})]
						}, idx);
					})
				}),
				/* @__PURE__ */ jsx("div", {
					className: "rounded-2xl sm:rounded-3xl border border-accent/40 bg-gradient-to-r from-[#12141e] via-[#0d0f16] to-[#12141e] p-6 sm:p-8 relative overflow-hidden shadow-[0_15px_50px_rgba(245,166,35,0.08)]",
					children: /* @__PURE__ */ jsxs("div", {
						className: "flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5 text-center lg:text-left",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-[10px] font-mono uppercase tracking-widest text-accent font-bold",
									children: "[ Tailored B2B Consultation ]"
								}),
								/* @__PURE__ */ jsx("h3", {
									className: "text-xl sm:text-2xl font-display font-bold text-white tracking-tight",
									children: "Need a custom volume contract or dedicated SLA?"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-xs sm:text-sm text-neutral-400 max-w-xl",
									children: "Speak directly with our production director to calibrate a custom pilot around your exact drop schedule."
								})
							]
						}), /* @__PURE__ */ jsx("div", {
							className: "flex flex-col sm:flex-row items-center gap-3 shrink-0",
							children: /* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: handleOpenDiscoveryCall,
								className: "w-full sm:w-auto px-6 py-3 rounded-xl bg-accent text-black font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#ffb834] hover:shadow-[0_0_25px_rgba(245,166,35,0.35)] transition-all cursor-pointer",
								children: [
									/* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4" }),
									/* @__PURE__ */ jsx("span", { children: "Book 15-Min Discovery Call" }),
									/* @__PURE__ */ jsx(ArrowUpRight, { className: "w-3.5 h-3.5" })
								]
							})
						})]
					})
				})
			]
		})]
	});
}
//#endregion
//#region resources/js/Components/Home/FreeTrialDropzone.tsx
var SERVICE_PILLARS = [
	"E-Commerce Catalog Optimization",
	"Clipping Path & Multipath Service",
	"Image Masking (Alpha / Hair)",
	"Ghost Mannequin & Neck Joint",
	"Color Standardization & Swatches",
	"White-Label Agency Extension",
	"Virtual Production & CGI Studio",
	"3D Furniture Modeling & AR"
];
var VOLUME_TIERS = [
	"50 – 200 SKUs / month",
	"200 – 1,000 SKUs / month",
	"1,000 – 5,000 SKUs / month",
	"5,000+ SKUs / month (Enterprise)"
];
var PLATFORMS = [
	"Shopify / Shopify Plus",
	"Amazon Storefront / Seller Central",
	"Magento / Adobe Commerce",
	"BigCommerce",
	"WooCommerce",
	"Custom Headless / Other"
];
function FreeTrialDropzone() {
	const fileInputRef = useRef(null);
	const [step, setStep] = useState(1);
	const [selectedFiles, setSelectedFiles] = useState([]);
	const [isDragOver, setIsDragOver] = useState(false);
	const { data, setData, post, processing, errors, reset, clearErrors, transform } = useForm({
		name: "",
		email: "",
		phone: "",
		company: "",
		role: "",
		website: "",
		service: SERVICE_PILLARS[0],
		monthly_volume: VOLUME_TIERS[1],
		platform: PLATFORMS[0],
		instructions: "",
		attachments: [],
		honeypot: "",
		captcha_answer: "",
		captcha_token: "",
		landing_page_url: "",
		submission_page_url: "",
		utm_source: "",
		utm_medium: "",
		utm_campaign: "",
		utm_term: "",
		utm_content: "",
		click_id: ""
	});
	const [captchaQuestion, setCaptchaQuestion] = useState("");
	const refreshCaptcha = () => {
		fetch("/api/captcha/math").then((res) => res.json()).then((res) => {
			if (res.question && res.token) {
				setCaptchaQuestion(res.question);
				setData((prev) => ({
					...prev,
					captcha_token: res.token,
					captcha_answer: ""
				}));
			}
		}).catch(() => {});
	};
	useEffect(() => {
		const attr = getAttributionData();
		setData((prev) => ({
			...prev,
			landing_page_url: attr.landing_page_url,
			submission_page_url: attr.submission_page_url,
			utm_source: attr.utm_source || "",
			utm_medium: attr.utm_medium || "",
			utm_campaign: attr.utm_campaign || "",
			utm_term: attr.utm_term || "",
			utm_content: attr.utm_content || "",
			click_id: attr.click_id || ""
		}));
		refreshCaptcha();
	}, []);
	useEffect(() => {
		if (errors.email || errors.name || errors.trial_exhausted || errors["captcha_answer"] || errors.phone || errors.company || errors.website || errors.service || errors.monthly_volume || errors.platform) setStep(2);
		else if (errors["attachments"] || errors["attachments.0"]) setStep(1);
		if (errors["captcha_answer"]) refreshCaptcha();
	}, [errors]);
	const handleFilesAdded = (files) => {
		if (!files) return;
		const validFiles = Array.from(files).filter((file) => file.size <= 26214400);
		const combined = [...selectedFiles, ...validFiles].slice(0, 3);
		setSelectedFiles(combined);
		setData("attachments", combined);
		if (errors["attachments"]) clearErrors("attachments");
	};
	const removeFile = (indexToRemove) => {
		const filtered = selectedFiles.filter((_, idx) => idx !== indexToRemove);
		setSelectedFiles(filtered);
		setData("attachments", filtered);
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		const attr = getAttributionData();
		transform((currentData) => ({
			...currentData,
			submission_page_url: window.location.href,
			landing_page_url: attr.landing_page_url || currentData.landing_page_url || window.location.href,
			utm_source: attr.utm_source || currentData.utm_source || "",
			utm_medium: attr.utm_medium || currentData.utm_medium || "",
			utm_campaign: attr.utm_campaign || currentData.utm_campaign || "",
			utm_term: attr.utm_term || currentData.utm_term || "",
			utm_content: attr.utm_content || currentData.utm_content || "",
			click_id: attr.click_id || currentData.click_id || ""
		}));
		post("/free-trial", {
			forceFormData: true,
			preserveScroll: true,
			onError: () => {
				setStep(2);
			}
		});
	};
	return /* @__PURE__ */ jsxs("section", {
		id: "free-trial",
		className: "relative py-20 sm:py-28 bg-[#07080a] border-t border-white/10 overflow-hidden select-none",
		children: [/* @__PURE__ */ jsx("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[48rem] h-[28rem] bg-accent/5 rounded-full blur-[240px] pointer-events-none" }), /* @__PURE__ */ jsxs("div", {
			className: "w-full max-w-4xl mx-auto px-4 xs:px-6 lg:px-8 relative z-10",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "text-center max-w-3xl mx-auto mb-8 sm:mb-12 space-y-3",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/25 text-[11px] font-mono uppercase tracking-[0.2em] text-accent",
						children: [/* @__PURE__ */ jsx(Sparkles, { className: "w-3 h-3" }), /* @__PURE__ */ jsx("span", { children: "Free 3-Asset Test Pilot" })]
					}),
					/* @__PURE__ */ jsxs("h2", {
						className: "text-2xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight whitespace-normal sm:whitespace-nowrap",
						children: ["Test our craft on ", /* @__PURE__ */ jsx("span", {
							className: "text-accent",
							children: "your raw files."
						})]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-neutral-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto",
						children: "Upload up to 3 test files. Receive retouched master files in under 24 hours with zero commitment."
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-center gap-2 sm:gap-3 pt-3 font-mono text-xs",
						children: [
							/* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => setStep(1),
								className: `flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all ${step === 1 ? "bg-accent/15 border-accent text-accent font-bold" : "border-white/10 text-neutral-400 hover:text-white"}`,
								children: [/* @__PURE__ */ jsx("span", { children: "01. Sample Uploads" }), selectedFiles.length > 0 && /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-accent" })]
							}),
							/* @__PURE__ */ jsx("span", {
								className: "text-neutral-600",
								children: "→"
							}),
							/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => {
									if (selectedFiles.length > 0) setStep(2);
								},
								className: `flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all ${step === 2 ? "bg-accent/15 border-accent text-accent font-bold" : "border-white/10 text-neutral-400"}`,
								children: /* @__PURE__ */ jsx("span", { children: "02. Brand & Specs" })
							})
						]
					})
				]
			}), /* @__PURE__ */ jsxs("form", {
				onSubmit: handleSubmit,
				className: "bg-[#0f1117] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl",
				children: [
					/* @__PURE__ */ jsx("input", {
						type: "text",
						name: "website_url",
						value: data.honeypot,
						onChange: (e) => setData("honeypot", e.target.value),
						tabIndex: -1,
						autoComplete: "off",
						className: "hidden",
						"aria-hidden": "true"
					}),
					step === 1 && /* @__PURE__ */ jsxs("div", {
						className: "space-y-6",
						children: [
							/* @__PURE__ */ jsxs("div", {
								onDragOver: (e) => {
									e.preventDefault();
									setIsDragOver(true);
								},
								onDragLeave: () => setIsDragOver(false),
								onDrop: (e) => {
									e.preventDefault();
									setIsDragOver(false);
									handleFilesAdded(e.dataTransfer.files);
								},
								onClick: () => fileInputRef.current?.click(),
								className: `border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-4 ${isDragOver ? "border-accent bg-accent/10 scale-[0.99]" : "border-white/15 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.04]"}`,
								children: [
									/* @__PURE__ */ jsx("input", {
										ref: fileInputRef,
										type: "file",
										multiple: true,
										accept: ".jpg,.jpeg,.png,.webp,.tiff,.tif,.psd,.pdf,.zip",
										onChange: (e) => handleFilesAdded(e.target.files),
										className: "hidden"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "w-16 h-16 rounded-2xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent",
										children: /* @__PURE__ */ jsx(UploadCloud, { className: "w-8 h-8" })
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ jsxs("p", {
											className: "text-white font-display font-bold text-base sm:text-lg",
											children: ["Drop your raw photos here, or ", /* @__PURE__ */ jsx("span", {
												className: "text-accent underline",
												children: "browse files"
											})]
										}), /* @__PURE__ */ jsx("p", {
											className: "text-neutral-400 text-xs font-mono",
											children: "Upload up to 3 test files (Max 25MB each). Formats: PSD, TIFF, RAW, JPG, PNG, ZIP."
										})]
									})
								]
							}),
							selectedFiles.length > 0 && /* @__PURE__ */ jsxs("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between text-xs font-mono text-neutral-400 px-1",
									children: [/* @__PURE__ */ jsxs("span", { children: [
										"Selected Assets (",
										selectedFiles.length,
										" / 3)"
									] }), /* @__PURE__ */ jsx("span", { children: "Ready for upload" })]
								}), /* @__PURE__ */ jsx("div", {
									className: "grid grid-cols-1 sm:grid-cols-3 gap-3",
									children: selectedFiles.map((file, idx) => /* @__PURE__ */ jsxs("div", {
										className: "p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-2 text-xs",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-2 truncate",
											children: [/* @__PURE__ */ jsx(FileImage, { className: "w-4 h-4 text-accent shrink-0" }), /* @__PURE__ */ jsx("span", {
												className: "text-white truncate font-mono text-[11px]",
												children: file.name
											})]
										}), /* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: (e) => {
												e.stopPropagation();
												removeFile(idx);
											},
											className: "text-neutral-400 hover:text-red-400 p-1",
											children: /* @__PURE__ */ jsx(X, { className: "w-3.5 h-3.5" })
										})]
									}, idx))
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between pt-4 border-t border-white/10",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2 text-xs font-mono text-neutral-400",
									children: [/* @__PURE__ */ jsx(Lock, { className: "w-3.5 h-3.5 text-accent" }), /* @__PURE__ */ jsx("span", { children: "Protected under Mutual Non-Disclosure" })]
								}), /* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => setStep(2),
									className: "px-6 py-3 rounded-xl bg-accent text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-accent-hover transition-all flex items-center gap-2 shadow-lg",
									children: [/* @__PURE__ */ jsx("span", { children: "Next: Brand Coordinates" }), /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })]
								})]
							})
						]
					}),
					step === 2 && /* @__PURE__ */ jsxs("div", {
						className: "space-y-6",
						children: [
							/* @__PURE__ */ jsx("input", {
								type: "hidden",
								name: "captcha_token",
								value: data.captcha_token
							}),
							errors.trial_exhausted && /* @__PURE__ */ jsxs("div", {
								className: "p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs sm:text-sm space-y-3",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-start gap-3",
									children: [/* @__PURE__ */ jsx(AlertTriangle, { className: "w-5 h-5 text-amber-400 shrink-0 mt-0.5" }), /* @__PURE__ */ jsxs("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ jsx("p", {
											className: "font-bold text-amber-300",
											children: "Free Pilot Quota Notice"
										}), /* @__PURE__ */ jsx("p", {
											className: "text-neutral-300 text-xs sm:text-sm leading-relaxed",
											children: errors.trial_exhausted
										})]
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "flex flex-wrap items-center gap-2.5 pt-2 border-t border-amber-500/20",
									children: [/* @__PURE__ */ jsx(Link, {
										href: "/pricing",
										className: "px-4 py-2 rounded-xl bg-accent text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-accent-hover transition-all",
										children: "Explore Production Pricing ($0.49/img)"
									}), /* @__PURE__ */ jsx(Link, {
										href: "/contact",
										className: "px-4 py-2 rounded-xl border border-white/20 text-white font-mono text-xs hover:border-white transition-colors",
										children: "Contact Studio Team"
									})]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "space-y-1.5",
										children: [
											/* @__PURE__ */ jsx("label", {
												className: "text-xs font-mono uppercase text-neutral-300 font-bold flex items-center gap-1.5",
												children: /* @__PURE__ */ jsx("span", { children: "Full Name *" })
											}),
											/* @__PURE__ */ jsx("input", {
												type: "text",
												required: true,
												value: data.name,
												onChange: (e) => setData("name", e.target.value),
												placeholder: "Alex Mercer",
												className: "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-accent"
											}),
											errors.name && /* @__PURE__ */ jsx("p", {
												className: "text-xs text-red-400",
												children: errors.name
											})
										]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "space-y-1.5",
										children: [
											/* @__PURE__ */ jsx("label", {
												className: "text-xs font-mono uppercase text-neutral-300 font-bold flex items-center gap-1.5",
												children: /* @__PURE__ */ jsx("span", { children: "Work Email Address *" })
											}),
											/* @__PURE__ */ jsx("input", {
												type: "email",
												required: true,
												value: data.email,
												onChange: (e) => setData("email", e.target.value),
												placeholder: "alex@company.com",
												className: "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-accent"
											}),
											(errors.email || errors.trial_exhausted) && /* @__PURE__ */ jsx("p", {
												className: "text-xs text-red-400 font-mono",
												children: errors.email || errors.trial_exhausted
											})
										]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ jsxs("label", {
											className: "text-xs font-mono uppercase text-neutral-300 font-bold flex items-center gap-1.5",
											children: [/* @__PURE__ */ jsx(Building2, { className: "w-3.5 h-3.5 text-accent" }), /* @__PURE__ */ jsx("span", { children: "Company Name" })]
										}), /* @__PURE__ */ jsx("input", {
											type: "text",
											value: data.company,
											onChange: (e) => setData("company", e.target.value),
											placeholder: "Acme Footwear Co.",
											className: "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-accent"
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ jsxs("label", {
											className: "text-xs font-mono uppercase text-neutral-300 font-bold flex items-center gap-1.5",
											children: [/* @__PURE__ */ jsx(Briefcase, { className: "w-3.5 h-3.5 text-accent" }), /* @__PURE__ */ jsx("span", { children: "Your Role" })]
										}), /* @__PURE__ */ jsx("input", {
											type: "text",
											value: data.role,
											onChange: (e) => setData("role", e.target.value),
											placeholder: "Head of Visual Production / Founder",
											className: "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-accent"
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ jsxs("label", {
											className: "text-xs font-mono uppercase text-neutral-300 font-bold flex items-center gap-1.5",
											children: [/* @__PURE__ */ jsx(Globe, { className: "w-3.5 h-3.5 text-accent" }), /* @__PURE__ */ jsx("span", { children: "Store / Website URL" })]
										}), /* @__PURE__ */ jsx("input", {
											type: "url",
											value: data.website,
											onChange: (e) => setData("website", e.target.value),
											placeholder: "https://acme.com",
											className: "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-accent"
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ jsxs("label", {
											className: "text-xs font-mono uppercase text-neutral-300 font-bold flex items-center gap-1.5",
											children: [/* @__PURE__ */ jsx(ShoppingBag, { className: "w-3.5 h-3.5 text-accent" }), /* @__PURE__ */ jsx("span", { children: "Primary Platform" })]
										}), /* @__PURE__ */ jsx("select", {
											value: data.platform,
											onChange: (e) => setData("platform", e.target.value),
											className: "w-full px-4 py-3 bg-[#161822] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-accent",
											children: PLATFORMS.map((p) => /* @__PURE__ */ jsx("option", {
												value: p,
												children: p
											}, p))
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ jsx("label", {
											className: "text-xs font-mono uppercase text-neutral-300 font-bold",
											children: "Primary Service Needed"
										}), /* @__PURE__ */ jsx("select", {
											value: data.service,
											onChange: (e) => setData("service", e.target.value),
											className: "w-full px-4 py-3 bg-[#161822] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-accent",
											children: SERVICE_PILLARS.map((s) => /* @__PURE__ */ jsx("option", {
												value: s,
												children: s
											}, s))
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ jsx("label", {
											className: "text-xs font-mono uppercase text-neutral-300 font-bold",
											children: "Estimated Monthly Volume"
										}), /* @__PURE__ */ jsx("select", {
											value: data.monthly_volume,
											onChange: (e) => setData("monthly_volume", e.target.value),
											className: "w-full px-4 py-3 bg-[#161822] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-accent",
											children: VOLUME_TIERS.map((v) => /* @__PURE__ */ jsx("option", {
												value: v,
												children: v
											}, v))
										})]
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-mono uppercase text-neutral-300 font-bold",
									children: "Retouching Instructions / Style Notes (Optional)"
								}), /* @__PURE__ */ jsx("textarea", {
									rows: 3,
									value: data.instructions,
									onChange: (e) => setData("instructions", e.target.value),
									placeholder: "e.g. Pure white 255 background, subtle contact shadow, preserve natural fabric texture, crop 1000x1000.",
									className: "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-accent"
								})]
							}),
							captchaQuestion && /* @__PURE__ */ jsxs("div", {
								className: "p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-4",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "space-y-0.5",
									children: [/* @__PURE__ */ jsxs("span", {
										className: "text-xs font-mono text-neutral-300 font-bold flex items-center gap-1.5",
										children: [
											/* @__PURE__ */ jsx(ShieldCheck, { className: "w-3.5 h-3.5 text-accent" }),
											/* @__PURE__ */ jsxs("span", { children: [
												"Security Verification: What is ",
												captchaQuestion,
												" ?"
											] }),
											/* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: refreshCaptcha,
												title: "Generate new question",
												className: "p-1 text-neutral-500 hover:text-accent transition-colors",
												children: /* @__PURE__ */ jsx(RotateCw, { className: "w-3 h-3" })
											})
										]
									}), /* @__PURE__ */ jsx("span", {
										className: "text-[11px] text-neutral-500 font-mono",
										children: "Solve the math problem to submit."
									})]
								}), /* @__PURE__ */ jsx("input", {
									type: "text",
									required: true,
									value: data.captcha_answer,
									onChange: (e) => setData("captcha_answer", e.target.value),
									placeholder: "Answer",
									className: "w-24 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-center text-white focus:outline-none focus:border-accent"
								})]
							}),
							errors["captcha_answer"] && /* @__PURE__ */ jsx("p", {
								className: "text-xs text-rose-400 font-mono",
								children: errors["captcha_answer"]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between pt-4 border-t border-white/10",
								children: [/* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => setStep(1),
									className: "px-4 py-2.5 rounded-xl border border-white/10 text-neutral-300 hover:text-white flex items-center gap-1.5 text-xs font-mono",
									children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Back to Files" })]
								}), /* @__PURE__ */ jsx("button", {
									type: "submit",
									disabled: processing,
									className: "px-8 py-3.5 rounded-xl bg-accent text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-accent-hover transition-all flex items-center gap-2 shadow-xl disabled:opacity-50",
									children: processing ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }), /* @__PURE__ */ jsx("span", { children: "Transmitting Assets..." })] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Send, { className: "w-4 h-4" }), /* @__PURE__ */ jsx("span", { children: "Submit Free 3-Asset Pilot" })] })
								})]
							})
						]
					})
				]
			})]
		})]
	});
}
//#endregion
//#region resources/js/Pages/Pricing.tsx
function Pricing({ plans = [], faqs = [] }) {
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(SeoHead, {
			title: "Engagement Models & Investment Pricing",
			description: "Transparent, value-aligned pricing for design sprints, full flagship builds, and ongoing studio retainers."
		}),
		/* @__PURE__ */ jsx(PageHero, {
			compact: true,
			eyebrow: "High-Volume Transparency",
			title: "Predictable retouching pricing.",
			highlight: "High-speed turnaround.",
			description: "Tailored bespoke volume tiers. No hidden setup fees or contract lock-ins. Free unlimited revisions with 24/7 round-the-clock studio capacity."
		}),
		/* @__PURE__ */ jsx(PricingCardsSection, {}),
		/* @__PURE__ */ jsx(EnterpriseSolutionsSection, {}),
		/* @__PURE__ */ jsx(FreeTrialDropzone, {}),
		faqs.length > 0 && /* @__PURE__ */ jsx("section", {
			className: "py-24 bg-[#0c0d12] border-t border-white/10",
			children: /* @__PURE__ */ jsxs("div", {
				className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "text-center mb-16 space-y-3",
					children: [/* @__PURE__ */ jsx("span", {
						className: "font-mono text-xs uppercase tracking-widest text-accent",
						children: "[ FINANCIAL & SCOPE QUESTIONS ]"
					}), /* @__PURE__ */ jsx("h2", {
						className: "text-3xl sm:text-4xl font-display font-bold text-white",
						children: "Pricing Clarity."
					})]
				}), /* @__PURE__ */ jsx(Accordion, { items: faqs.map((f) => ({
					id: f.id,
					question: f.question,
					answer: f.answer
				})) })]
			})
		})
	] });
}
//#endregion
export { Pricing as default };
