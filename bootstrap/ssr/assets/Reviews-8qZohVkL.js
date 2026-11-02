import { t as SeoHead } from "./SeoHead-jRblvokC.js";
import { t as PageHero } from "./PageHero-BKafzHM7.js";
import "react";
import { Link } from "@inertiajs/react";
import { ArrowRight, CheckCircle2, Star } from "lucide-react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Reviews.tsx
function Reviews({ testimonials = [], clients = [] }) {
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(SeoHead, {
			title: "Verified Client Reviews & Performance Ratings",
			description: "Explore verified client testimonials and performance ratings from leading e-commerce brands, fashion retailers, and creative agencies partnering with Cutting Edger.",
			breadcrumbs: [{
				name: "Home",
				url: "/"
			}, {
				name: "Reviews & Proof",
				url: "/reviews"
			}],
			reviewsSchema: {
				ratingValue: 4.9,
				reviewCount: 486,
				bestRating: 5
			}
		}),
		/* @__PURE__ */ jsx(PageHero, {
			eyebrow: "VERIFIED CLIENT SATISFACTION",
			title: "REPUTATION OF",
			highlight: "UNCOMPROMISED CRAFT.",
			description: "Read authentic performance appraisals from production directors, brand founders, and agency art leads."
		}),
		/* @__PURE__ */ jsx("section", {
			className: "py-20 bg-[#0a0b0e]",
			children: /* @__PURE__ */ jsxs("div", {
				className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "p-8 sm:p-12 rounded-3xl bg-[#12141c] border border-white/10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-6",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "w-24 h-24 rounded-2xl bg-accent/10 border border-accent/30 flex flex-col items-center justify-center text-center shrink-0",
								children: [/* @__PURE__ */ jsx("span", {
									className: "font-display text-4xl font-black text-accent",
									children: "4.9"
								}), /* @__PURE__ */ jsx("div", {
									className: "flex text-accent mt-1",
									children: [...Array(5)].map((_, i) => /* @__PURE__ */ jsx(Star, { className: "w-3 h-3 fill-current" }, i))
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ jsx("h2", {
									className: "text-xl sm:text-2xl font-display font-bold text-white",
									children: "Exceptional B2B Production Satisfaction"
								}), /* @__PURE__ */ jsx("p", {
									className: "text-xs text-neutral-400",
									children: "Based on 480+ verified enterprise SKU delivery sign-offs across North America, Europe, and Asia-Pacific."
								})]
							})]
						}), /* @__PURE__ */ jsx("div", {
							className: "flex items-center gap-3 shrink-0",
							children: /* @__PURE__ */ jsxs(Link, {
								href: "/#free-trial",
								className: "px-6 py-3.5 rounded-xl bg-accent text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-accent-hover transition-all shadow-lg flex items-center gap-2",
								children: [/* @__PURE__ */ jsx("span", { children: "Request 3-Asset Pilot" }), /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })]
							})
						})]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
						children: testimonials.map((t) => /* @__PURE__ */ jsxs("div", {
							className: "p-8 rounded-3xl bg-[#12141c] border border-white/10 hover:border-accent/40 transition-all space-y-5 flex flex-col justify-between",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "space-y-4",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ jsx("div", {
										className: "flex text-accent",
										children: [...Array(t.rating || 5)].map((_, i) => /* @__PURE__ */ jsx(Star, { className: "w-3.5 h-3.5 fill-current" }, i))
									}), /* @__PURE__ */ jsxs("span", {
										className: "inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400",
										children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-3 h-3" }), /* @__PURE__ */ jsx("span", { children: "Verified Partner" })]
									})]
								}), /* @__PURE__ */ jsxs("p", {
									className: "text-neutral-300 text-sm leading-relaxed italic",
									children: [
										"\"",
										t.quote,
										"\""
									]
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "pt-4 border-t border-white/10 flex items-center gap-3",
								children: [t.avatar ? /* @__PURE__ */ jsx("img", {
									src: t.avatar,
									alt: t.author,
									className: "w-10 h-10 rounded-full object-cover border border-white/15"
								}) : /* @__PURE__ */ jsx("div", {
									className: "w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center font-bold text-xs text-white",
									children: t.author.charAt(0)
								}), /* @__PURE__ */ jsxs("div", {
									className: "text-xs",
									children: [/* @__PURE__ */ jsx("p", {
										className: "font-bold text-white",
										children: t.author
									}), /* @__PURE__ */ jsxs("p", {
										className: "text-neutral-400 text-[11px]",
										children: [t.role, t.company ? `, ${t.company}` : ""]
									})]
								})]
							})]
						}, t.id))
					}),
					clients.length > 0 && /* @__PURE__ */ jsxs("div", {
						className: "p-8 rounded-3xl bg-[#12141c]/50 border border-white/5 space-y-6 text-center",
						children: [/* @__PURE__ */ jsx("span", {
							className: "font-mono text-xs uppercase tracking-widest text-neutral-400",
							children: "[ TRUSTED BY LEADING GLOBAL BRANDS & STUDIOS ]"
						}), /* @__PURE__ */ jsx("div", {
							className: "flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-70",
							children: clients.map((c) => /* @__PURE__ */ jsx("img", {
								src: c.logo_dark || c.logo_light,
								alt: c.name,
								className: "h-7 w-auto object-contain grayscale hover:grayscale-0 transition-all"
							}, c.id))
						})]
					})
				]
			})
		})
	] });
}
//#endregion
export { Reviews as default };
