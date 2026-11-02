import { t as getAttributionData } from "../ssr.js";
import { t as SeoHead } from "./SeoHead-jRblvokC.js";
import { useEffect, useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import { ArrowRight, Calendar, Check, CheckCircle2, Clock, Copy, Loader2, Lock, Mail, MapPin, Phone, RotateCw, ShieldCheck, Users } from "lucide-react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Contact.tsx
var SERVICES = [
	"Catalog Retouching",
	"Clipping & Masking",
	"Ghost Mannequin",
	"Color Matching",
	"3D CGI / AR",
	"Agency White-Label"
];
function Contact() {
	const { settings, flash } = usePage().props;
	const contactEmail = settings?.contact_email || "hello@cuttingedger.com";
	const contactPhone = settings?.contact_phone || "+1 (409) 995-2565";
	const contactAddress = settings?.company_address || "Artisan Center, Panthapath, Dhaka 1215";
	const [copiedEmail, setCopiedEmail] = useState(false);
	const { data, setData, post, processing, errors, reset, transform } = useForm({
		name: "",
		email: "",
		company: "",
		role: "",
		website: "",
		monthly_volume: "500 – 2,000 SKUs / month",
		platform: "Shopify / Shopify Plus",
		service_interest: SERVICES[0],
		budget: "$1,500 – $5,000 / mo Retainer",
		message: "",
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
	const handleCopyEmail = () => {
		navigator.clipboard.writeText(contactEmail);
		setCopiedEmail(true);
		setTimeout(() => setCopiedEmail(false), 2e3);
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
		post("/contact", {
			preserveScroll: true,
			onSuccess: () => {
				reset("name", "email", "company", "website", "message", "captcha_answer");
				refreshCaptcha();
			},
			onError: () => refreshCaptcha()
		});
	};
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(SeoHead, {
		title: "Contact Production Studio — Cutting Edger",
		description: "Connect directly with Cutting Edger directors. Request custom catalog volume pricing, SLA agreements, or schedule a technical call.",
		breadcrumbs: [{
			name: "Home",
			url: "/"
		}, {
			name: "Contact",
			url: "/contact"
		}]
	}), /* @__PURE__ */ jsxs("section", {
		className: "relative py-16 sm:py-24 lg:py-28 bg-[#08090d] min-h-[90vh] flex items-center overflow-hidden",
		children: [
			/* @__PURE__ */ jsx("div", { className: "absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[48rem] h-[28rem] bg-accent/[0.04] rounded-full blur-[220px] pointer-events-none" }),
			/* @__PURE__ */ jsx("div", { className: "absolute bottom-1/4 right-1/4 translate-x-1/3 translate-y-1/3 w-[36rem] h-[24rem] bg-white/[0.015] rounded-full blur-[200px] pointer-events-none" }),
			/* @__PURE__ */ jsx("div", {
				className: "absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ jsx("div", {
				className: "max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10",
				children: /* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "lg:col-span-5 space-y-8",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-3.5",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/25 text-[11px] font-mono uppercase tracking-[0.18em] text-accent font-semibold",
										children: [/* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" }), /* @__PURE__ */ jsx("span", { children: "Direct Studio Inquiry" })]
									}),
									/* @__PURE__ */ jsxs("h1", {
										className: "text-3xl sm:text-4xl lg:text-[46px] font-display font-extrabold text-white tracking-tight leading-[1.12]",
										children: ["Let’s scale your ", /* @__PURE__ */ jsx("span", {
											className: "text-accent",
											children: "product imagery."
										})]
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-neutral-400 text-sm sm:text-base leading-relaxed max-w-md",
										children: "Whether ramping up for a seasonal catalog drop, standardizing multi-category color specs, or securing dedicated studio bandwidth, our directors respond within 24 business hours."
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-3 pt-2",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-3 min-w-0",
											children: [/* @__PURE__ */ jsx("div", {
												className: "w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0",
												children: /* @__PURE__ */ jsx(Mail, { className: "w-4 h-4" })
											}), /* @__PURE__ */ jsxs("div", {
												className: "min-w-0",
												children: [/* @__PURE__ */ jsx("p", {
													className: "text-[10px] font-mono uppercase tracking-wider text-neutral-400",
													children: "Direct Email"
												}), /* @__PURE__ */ jsx("a", {
													href: `mailto:${contactEmail}`,
													className: "text-white hover:text-accent font-mono text-xs sm:text-sm truncate block transition-colors font-medium",
													children: contactEmail
												})]
											})]
										}), /* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: handleCopyEmail,
											"aria-label": "Copy studio email address",
											className: "px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs font-mono text-neutral-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ml-2",
											children: copiedEmail ? /* @__PURE__ */ jsxs("span", {
												className: "text-accent flex items-center gap-1 font-semibold",
												children: [/* @__PURE__ */ jsx(Check, { className: "w-3.5 h-3.5" }), " Copied"]
											}) : /* @__PURE__ */ jsxs("span", {
												className: "flex items-center gap-1 text-neutral-400 hover:text-white",
												children: [/* @__PURE__ */ jsx(Copy, { className: "w-3.5 h-3.5" }), " Copy"]
											})
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										onClick: () => window.dispatchEvent(new CustomEvent("ce:open-discovery-call")),
										className: "group flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-accent/40 hover:bg-accent/[0.02] transition-all cursor-pointer",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-3 min-w-0",
											children: [/* @__PURE__ */ jsx("div", {
												className: "w-9 h-9 rounded-xl bg-white/[0.04] border border-white/10 group-hover:bg-accent group-hover:text-black group-hover:border-accent flex items-center justify-center text-neutral-300 transition-all shrink-0",
												children: /* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4" })
											}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
												className: "text-[10px] font-mono uppercase tracking-wider text-accent font-semibold",
												children: "Live Screen-Share"
											}), /* @__PURE__ */ jsx("p", {
												className: "text-white group-hover:text-accent text-xs sm:text-sm font-medium transition-colors",
												children: "Book 15-Min Discovery Call"
											})] })]
										}), /* @__PURE__ */ jsx("span", {
											className: "text-neutral-500 group-hover:text-accent group-hover:translate-x-1 transition-all text-xs font-mono",
											children: "→"
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1",
											children: [/* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-1.5 text-neutral-400 text-[10px] font-mono uppercase tracking-wider",
												children: [/* @__PURE__ */ jsx(Phone, { className: "w-3 h-3 text-accent" }), /* @__PURE__ */ jsx("span", { children: "Studio Line" })]
											}), /* @__PURE__ */ jsx("p", {
												className: "text-neutral-200 font-mono text-xs font-medium",
												children: contactPhone
											})]
										}), /* @__PURE__ */ jsxs("div", {
											className: "p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1",
											children: [/* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-1.5 text-neutral-400 text-[10px] font-mono uppercase tracking-wider",
												children: [/* @__PURE__ */ jsx(MapPin, { className: "w-3 h-3 text-neutral-400" }), /* @__PURE__ */ jsx("span", { children: "Studio Hub" })]
											}), /* @__PURE__ */ jsx("p", {
												className: "text-neutral-300 text-xs truncate",
												title: contactAddress,
												children: contactAddress
											})]
										})]
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "pt-2 border-t border-white/10 space-y-2.5",
								children: [/* @__PURE__ */ jsx("p", {
									className: "text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-medium",
									children: "Studio Commitments"
								}), /* @__PURE__ */ jsxs("div", {
									className: "space-y-2 text-xs",
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-start gap-2.5 text-neutral-300",
											children: [/* @__PURE__ */ jsx(Clock, { className: "w-4 h-4 text-accent shrink-0 mt-0.5" }), /* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("strong", {
												className: "text-white font-medium",
												children: "24-Hour Production SLA:"
											}), " Guaranteed delivery on scheduled catalog drops."] })]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-start gap-2.5 text-neutral-300",
											children: [/* @__PURE__ */ jsx(Lock, { className: "w-4 h-4 text-accent shrink-0 mt-0.5" }), /* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("strong", {
												className: "text-white font-medium",
												children: "Mutual Non-Disclosure Agreement:"
											}), " Secure IP protection for unreleased collections."] })]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-start gap-2.5 text-neutral-300",
											children: [/* @__PURE__ */ jsx(Users, { className: "w-4 h-4 text-accent shrink-0 mt-0.5" }), /* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("strong", {
												className: "text-white font-medium",
												children: "Dedicated Retoucher Pod:"
											}), " Assigned senior colorists aligned to your guidelines."] })]
										})
									]
								})]
							})
						]
					}), /* @__PURE__ */ jsx("div", {
						className: "lg:col-span-7",
						children: /* @__PURE__ */ jsxs("form", {
							onSubmit: handleSubmit,
							className: "relative p-6 sm:p-9 lg:p-10 rounded-3xl bg-gradient-to-b from-[#11131c]/95 to-[#0b0c11]/95 border border-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.7)] backdrop-blur-2xl space-y-5 overflow-hidden",
							children: [
								/* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-accent/70 to-transparent" }),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between pb-3.5 border-b border-white/10",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ jsx("h2", {
											className: "text-lg sm:text-xl font-display font-bold text-white tracking-tight",
											children: "Project Inquiry"
										}), /* @__PURE__ */ jsx("p", {
											className: "text-xs text-neutral-400",
											children: "Tell us about your requirements. Zero spam, ever."
										})]
									}), /* @__PURE__ */ jsxs("span", {
										className: "hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[10px] font-mono uppercase tracking-wider text-neutral-400",
										children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "w-3 h-3 text-accent" }), /* @__PURE__ */ jsx("span", { children: "Confidential" })]
									})]
								}),
								flash?.success && /* @__PURE__ */ jsxs("div", {
									className: "p-4 rounded-2xl bg-accent/10 border border-accent/30 flex items-start gap-3.5 text-white animate-in fade-in duration-300",
									children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5 text-accent shrink-0 mt-0.5" }), /* @__PURE__ */ jsxs("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ jsx("p", {
											className: "text-sm font-bold text-accent",
											children: "Inquiry Transmitted Successfully"
										}), /* @__PURE__ */ jsx("p", {
											className: "text-xs text-neutral-300 leading-relaxed",
											children: flash.success
										})]
									})]
								}),
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
								/* @__PURE__ */ jsx("input", {
									type: "hidden",
									name: "captcha_token",
									value: data.captcha_token
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "space-y-1.5",
										children: [
											/* @__PURE__ */ jsxs("label", {
												className: "text-xs text-neutral-300 font-medium flex items-center justify-between",
												children: [/* @__PURE__ */ jsx("span", { children: "Your Name" }), /* @__PURE__ */ jsx("span", {
													className: "text-accent",
													children: "*"
												})]
											}),
											/* @__PURE__ */ jsx("input", {
												type: "text",
												required: true,
												value: data.name,
												onChange: (e) => setData("name", e.target.value),
												placeholder: "Alex Mercer",
												className: "w-full px-3.5 py-2.5 bg-white/[0.03] border border-white/10 hover:border-white/20 focus:border-accent focus:bg-accent/[0.02] focus:ring-1 focus:ring-accent/30 rounded-xl text-sm text-white placeholder-neutral-500 transition-all outline-none"
											}),
											errors.name && /* @__PURE__ */ jsx("p", {
												className: "text-xs text-rose-400 font-mono",
												children: errors.name
											})
										]
									}), /* @__PURE__ */ jsxs("div", {
										className: "space-y-1.5",
										children: [
											/* @__PURE__ */ jsxs("label", {
												className: "text-xs text-neutral-300 font-medium flex items-center justify-between",
												children: [/* @__PURE__ */ jsx("span", { children: "Work Email" }), /* @__PURE__ */ jsx("span", {
													className: "text-accent",
													children: "*"
												})]
											}),
											/* @__PURE__ */ jsx("input", {
												type: "email",
												required: true,
												value: data.email,
												onChange: (e) => setData("email", e.target.value),
												placeholder: "alex@company.com",
												className: "w-full px-3.5 py-2.5 bg-white/[0.03] border border-white/10 hover:border-white/20 focus:border-accent focus:bg-accent/[0.02] focus:ring-1 focus:ring-accent/30 rounded-xl text-sm text-white placeholder-neutral-500 transition-all outline-none"
											}),
											errors.email && /* @__PURE__ */ jsx("p", {
												className: "text-xs text-rose-400 font-mono",
												children: errors.email
											})
										]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ jsxs("label", {
											className: "text-xs text-neutral-400 font-medium",
											children: ["Company / Brand ", /* @__PURE__ */ jsx("span", {
												className: "text-neutral-500 font-normal",
												children: "(Optional)"
											})]
										}), /* @__PURE__ */ jsx("input", {
											type: "text",
											value: data.company,
											onChange: (e) => setData("company", e.target.value),
											placeholder: "Acme Footwear",
											className: "w-full px-3.5 py-2.5 bg-white/[0.03] border border-white/10 hover:border-white/20 focus:border-accent focus:bg-accent/[0.02] focus:ring-1 focus:ring-accent/30 rounded-xl text-sm text-white placeholder-neutral-500 transition-all outline-none"
										})]
									}), /* @__PURE__ */ jsxs("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ jsxs("label", {
											className: "text-xs text-neutral-400 font-medium",
											children: ["Store / Website ", /* @__PURE__ */ jsx("span", {
												className: "text-neutral-500 font-normal",
												children: "(Optional)"
											})]
										}), /* @__PURE__ */ jsx("input", {
											type: "url",
											value: data.website,
											onChange: (e) => setData("website", e.target.value),
											placeholder: "https://acme.com",
											className: "w-full px-3.5 py-2.5 bg-white/[0.03] border border-white/10 hover:border-white/20 focus:border-accent focus:bg-accent/[0.02] focus:ring-1 focus:ring-accent/30 rounded-xl text-sm text-white placeholder-neutral-500 transition-all outline-none"
										})]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ jsx("label", {
										className: "text-xs text-neutral-300 font-medium block",
										children: "Service Needed"
									}), /* @__PURE__ */ jsx("div", {
										className: "flex flex-wrap gap-2",
										children: SERVICES.map((srv) => {
											const active = data.service_interest === srv;
											return /* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => setData("service_interest", srv),
												className: `px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${active ? "bg-accent text-black font-bold shadow-[0_0_15px_rgba(245,166,35,0.35)] scale-[1.02]" : "bg-white/[0.03] border border-white/10 text-neutral-300 hover:border-white/25 hover:text-white"}`,
												children: srv
											}, srv);
										})
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5",
									children: [
										/* @__PURE__ */ jsxs("label", {
											className: "text-xs text-neutral-300 font-medium flex items-center justify-between",
											children: [/* @__PURE__ */ jsx("span", { children: "Project Scope & Timeline" }), /* @__PURE__ */ jsx("span", {
												className: "text-accent",
												children: "*"
											})]
										}),
										/* @__PURE__ */ jsx("textarea", {
											required: true,
											rows: 3,
											value: data.message,
											onChange: (e) => setData("message", e.target.value),
											placeholder: "Briefly describe your image volume, desired background specs, or turnaround deadline...",
											className: "w-full px-3.5 py-2.5 bg-white/[0.03] border border-white/10 hover:border-white/20 focus:border-accent focus:bg-accent/[0.02] focus:ring-1 focus:ring-accent/30 rounded-xl text-sm text-white placeholder-neutral-500 transition-all outline-none leading-relaxed"
										}),
										errors.message && /* @__PURE__ */ jsx("p", {
											className: "text-xs text-rose-400 font-mono",
											children: errors.message
										})
									]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/10",
									children: [captchaQuestion ? /* @__PURE__ */ jsxs("div", {
										className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono text-neutral-300 self-start sm:self-auto",
										children: [
											/* @__PURE__ */ jsx("span", {
												className: "text-neutral-400 text-[11px]",
												children: "Security:"
											}),
											/* @__PURE__ */ jsxs("span", {
												className: "text-accent font-semibold",
												children: [captchaQuestion, " ="]
											}),
											/* @__PURE__ */ jsx("input", {
												type: "text",
												required: true,
												value: data.captcha_answer,
												onChange: (e) => setData("captcha_answer", e.target.value),
												placeholder: "?",
												className: "w-12 px-2 py-0.5 bg-white/[0.06] border border-white/15 focus:border-accent rounded-md text-xs text-center text-white font-mono focus:outline-none"
											}),
											/* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: refreshCaptcha,
												title: "Refresh challenge",
												className: "text-neutral-500 hover:text-accent transition-colors p-0.5 cursor-pointer",
												children: /* @__PURE__ */ jsx(RotateCw, { className: "w-3.5 h-3.5" })
											})
										]
									}) : /* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-1.5 text-xs text-neutral-400 font-mono",
										children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "w-3.5 h-3.5 text-accent" }), /* @__PURE__ */ jsx("span", { children: "Protected under Mutual NDA" })]
									}), /* @__PURE__ */ jsx("button", {
										type: "submit",
										disabled: processing,
										className: "px-6 py-2.5 rounded-xl bg-accent text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-[#ffb834] hover:shadow-[0_0_20px_rgba(245,166,35,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer shrink-0",
										children: processing ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Loader2, { className: "w-3.5 h-3.5 animate-spin" }), /* @__PURE__ */ jsx("span", { children: "Transmitting..." })] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", { children: "Send Inquiry" }), /* @__PURE__ */ jsx(ArrowRight, { className: "w-3.5 h-3.5" })] })
									})]
								}),
								errors.captcha_answer && /* @__PURE__ */ jsx("p", {
									className: "text-xs text-rose-400 font-mono",
									children: errors.captcha_answer
								})
							]
						})
					})]
				})
			})
		]
	})] });
}
//#endregion
export { Contact as default };
