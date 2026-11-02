import { t as SeoHead } from "./SeoHead-jRblvokC.js";
import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { ArrowRight, Calendar, Check, CheckCircle2, Clock, Copy, DownloadCloud, FileImage, Shield, Sparkles } from "lucide-react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/ThankYou.tsx
function ThankYou() {
	const { settings, flash } = usePage().props;
	const orderNumber = flash?.order_number;
	const isPilot = Boolean(orderNumber);
	const contactEmail = settings?.contact_email || "hello@cuttingedger.com";
	const [copied, setCopied] = useState(false);
	const handleCopy = () => {
		if (orderNumber) {
			navigator.clipboard.writeText(orderNumber);
			setCopied(true);
			setTimeout(() => setCopied(false), 2e3);
		}
	};
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(SeoHead, {
		title: "Request Confirmed — Cutting Edger",
		description: "Your visual production request has been received by our studio team.",
		noindex: true
	}), /* @__PURE__ */ jsxs("section", {
		className: "relative min-h-[85vh] flex items-center justify-center py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#07080a] overflow-hidden",
		children: [/* @__PURE__ */ jsx("div", { className: "absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[38rem] h-[22rem] bg-accent/5 rounded-full blur-[200px] pointer-events-none" }), /* @__PURE__ */ jsxs("div", {
			className: "max-w-3xl w-full mx-auto relative z-10 text-center space-y-8",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "w-14 h-14 mx-auto rounded-2xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent shadow-[0_0_35px_rgba(251, 183, 24, 0.18)]",
					children: /* @__PURE__ */ jsx(CheckCircle2, { className: "w-7 h-7" })
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ jsxs("h1", {
						className: "text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight",
						children: ["Request ", /* @__PURE__ */ jsx("span", {
							className: "text-accent",
							children: "Confirmed."
						})]
					}), /* @__PURE__ */ jsx("p", {
						className: "text-neutral-400 text-sm sm:text-base max-w-md mx-auto",
						children: isPilot ? "Confirmation email sent. Your raw files are now in our studio production queue." : "Confirmation email sent. Our studio directors are reviewing your project requirements."
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "p-6 sm:p-8 rounded-3xl bg-[#0e1017] border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-xl",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 sm:grid-cols-3 gap-6 relative",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex flex-col items-center sm:items-start text-center sm:text-left space-y-2 relative",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ jsx("div", {
											className: "w-8 h-8 rounded-xl bg-accent/15 border border-accent/40 flex items-center justify-center text-accent",
											children: /* @__PURE__ */ jsx(Check, { className: "w-4 h-4 stroke-[3]" })
										}), /* @__PURE__ */ jsx("span", {
											className: "text-[11px] font-mono uppercase tracking-wider text-accent font-bold",
											children: "01 · Received"
										})]
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-white text-sm font-bold",
										children: isPilot ? "Files Logged" : "Brief Logged"
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-xs text-neutral-400",
										children: isPilot ? "Confirmation email sent" : "Direct studio notification"
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex flex-col items-center sm:items-start text-center sm:text-left space-y-2 relative",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ jsx("div", {
											className: "w-8 h-8 rounded-xl bg-accent text-black flex items-center justify-center font-bold shadow-[0_0_20px_rgba(251, 183, 24, 0.35)] animate-pulse",
											children: /* @__PURE__ */ jsx(Sparkles, { className: "w-4 h-4" })
										}), /* @__PURE__ */ jsx("span", {
											className: "text-[11px] font-mono uppercase tracking-wider text-white font-bold",
											children: isPilot ? "02 · In Queue" : "02 · In Review"
										})]
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-white text-sm font-bold",
										children: isPilot ? "Senior Artisan" : "Studio Director"
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-xs text-neutral-400",
										children: isPilot ? "Manual clipping & color work" : "Scope & capacity assessment"
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex flex-col items-center sm:items-start text-center sm:text-left space-y-2 relative",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ jsx("div", {
											className: "w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400",
											children: /* @__PURE__ */ jsx(DownloadCloud, { className: "w-4 h-4" })
										}), /* @__PURE__ */ jsx("span", {
											className: "text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-bold",
											children: isPilot ? "03 · Delivery" : "03 · Response"
										})]
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-neutral-300 text-sm font-bold",
										children: "< 24h Turnaround"
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-xs text-neutral-400",
										children: isPilot ? "Layered PSD & web previews" : "Custom estimate & next steps"
									})
								]
							})
						]
					}), orderNumber && /* @__PURE__ */ jsxs("div", {
						className: "mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-neutral-500",
									children: "REF:"
								}),
								/* @__PURE__ */ jsx("span", {
									className: "text-white font-bold px-2.5 py-1 rounded-lg bg-white/5 border border-white/10",
									children: orderNumber
								}),
								/* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: handleCopy,
									title: "Copy Order ID",
									className: "p-1.5 rounded-md hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer",
									children: copied ? /* @__PURE__ */ jsx(Check, { className: "w-3.5 h-3.5 text-accent" }) : /* @__PURE__ */ jsx(Copy, { className: "w-3.5 h-3.5" })
								})
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-4 text-neutral-400 text-[11px]",
							children: [
								/* @__PURE__ */ jsxs("span", {
									className: "inline-flex items-center gap-1.5",
									children: [/* @__PURE__ */ jsx(Clock, { className: "w-3 h-3 text-accent" }), " 24h SLA"]
								}),
								/* @__PURE__ */ jsxs("span", {
									className: "inline-flex items-center gap-1.5",
									children: [/* @__PURE__ */ jsx(Shield, { className: "w-3 h-3 text-accent" }), " NDA Protected"]
								}),
								/* @__PURE__ */ jsxs("span", {
									className: "inline-flex items-center gap-1.5",
									children: [/* @__PURE__ */ jsx(FileImage, { className: "w-3 h-3 text-accent" }), " Layered PSD"]
								})
							]
						})]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "space-y-0.5",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-[11px] font-mono text-accent font-bold uppercase tracking-wider",
							children: "Need High Volume or Custom SLAs?"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-sm font-bold text-white",
							children: "Book an optional 15-min technical alignment call"
						})]
					}), /* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => window.dispatchEvent(new CustomEvent("ce:open-discovery-call")),
						className: "inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-accent-hover transition-all shadow-md shrink-0 cursor-pointer self-start sm:self-center",
						children: [/* @__PURE__ */ jsx(Calendar, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Schedule Call" })]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "pt-2 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-neutral-400",
					children: [
						/* @__PURE__ */ jsx(Link, {
							href: "/",
							className: "hover:text-white transition-colors",
							children: "← Return Home"
						}),
						/* @__PURE__ */ jsx("span", {
							className: "text-neutral-700",
							children: "·"
						}),
						/* @__PURE__ */ jsxs(Link, {
							href: "/services",
							className: "hover:text-white transition-colors flex items-center gap-1",
							children: [/* @__PURE__ */ jsx("span", { children: "View Services" }), /* @__PURE__ */ jsx(ArrowRight, { className: "w-3 h-3" })]
						}),
						/* @__PURE__ */ jsx("span", {
							className: "text-neutral-700",
							children: "·"
						}),
						/* @__PURE__ */ jsxs("a", {
							href: `mailto:${contactEmail}`,
							className: "hover:text-white transition-colors",
							children: [
								"Direct Support (",
								contactEmail,
								")"
							]
						})
					]
				})
			]
		})]
	})] });
}
//#endregion
export { ThankYou as default };
