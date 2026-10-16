import { t as SeoHead } from "./SeoHead-CXtfHcil.js";
import { t as PageHero } from "./PageHero-KJiKVDpm.js";
import "react";
import { Link } from "@inertiajs/react";
import { ArrowUpRight, Compass, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/About.tsx
function About({ leadership = [] }) {
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(SeoHead, {
			title: "Philosophy & Studio Architecture",
			description: "CuttingEdger is an independent digital agency sculpting brand identities and kinetic software for ambitious category leaders."
		}),
		/* @__PURE__ */ jsx(PageHero, {
			eyebrow: "ABOUT CUTTINGEDGER",
			title: "WE ENGINEER EXPERIENCES THAT",
			highlight: "REFUSE TO BE IGNORED.",
			description: "Founded in 2019, CuttingEdger is a bespoke collective of designers, creative engineers, and brand strategists. We partner with visionaries to build lasting digital dominance."
		}),
		/* @__PURE__ */ jsx("section", {
			className: "py-24 bg-[#0c0d12] border-b border-white/10",
			children: /* @__PURE__ */ jsx("div", {
				className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
				children: /* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 lg:grid-cols-12 gap-12 items-center",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "lg:col-span-5 space-y-4",
						children: [/* @__PURE__ */ jsx("span", {
							className: "font-mono text-xs uppercase tracking-widest text-[#d4ff00]",
							children: "[ OUR CONVICTION ]"
						}), /* @__PURE__ */ jsx("h2", {
							className: "text-3xl sm:text-5xl font-display font-extrabold text-white leading-tight",
							children: "Crafting dopamine through code & form."
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "lg:col-span-7 space-y-6 text-neutral-300 text-lg sm:text-xl font-normal leading-relaxed",
						children: [/* @__PURE__ */ jsx("p", { children: "The contemporary internet is drowning in sea-of-sameness software. SaaS landing pages copy the same three cards; brands adopt the same safe geometric fonts; apps strip away all tactile humanity in pursuit of uninspired efficiency." }), /* @__PURE__ */ jsx("p", {
							className: "text-neutral-400 text-base",
							children: "We believe in the power of visceral emotion. When a user interacts with a button that responds with calculated spring physics, or scrolls through an editorial canvas with synchronized shader lighting, their brain registers genuine craft. That craft transforms casual visitors into fanatical brand evangelists."
						})]
					})]
				})
			})
		}),
		/* @__PURE__ */ jsx("section", {
			className: "py-28 bg-[#0a0b0e]",
			children: /* @__PURE__ */ jsxs("div", {
				className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "text-center max-w-2xl mx-auto mb-16 space-y-3",
					children: [/* @__PURE__ */ jsx("span", {
						className: "font-mono text-xs uppercase tracking-widest text-[#d4ff00]",
						children: "[ FOUNDATIONAL PILLARS ]"
					}), /* @__PURE__ */ jsx("h2", {
						className: "text-3xl sm:text-5xl font-display font-extrabold text-white",
						children: "HOW WE OPERATE."
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8",
					children: [
						{
							icon: Sparkles,
							title: "Radical Craft",
							description: "We reject generic design templates. Every project begins with a blank slate, bespoke typographic explorations, and sculptural spatial design."
						},
						{
							icon: Zap,
							title: "Microsecond Velocity",
							description: "Beauty without speed is a failure. We engineer hyper-optimized code architectures that deliver sub-second global responses and zero layout shifts."
						},
						{
							icon: Compass,
							title: "Unapologetic Character",
							description: "In an internet saturated with safe gray software, distinct brand personality is the only moat that compounds over decades."
						},
						{
							icon: ShieldCheck,
							title: "Military-Grade Engineering",
							description: "Behind the kinetic art is rigorous full-stack architecture, comprehensive automated test coverage, and enterprise-grade resilience."
						}
					].map((pillar, i) => {
						const IconComponent = pillar.icon;
						return /* @__PURE__ */ jsxs("div", {
							className: "p-8 rounded-3xl bg-[#12141c] border border-white/10 hover:border-[#d4ff00]/40 transition-colors flex flex-col justify-between group",
							children: [/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("div", {
									className: "w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-[#d4ff00] group-hover:scale-110 transition-transform",
									children: /* @__PURE__ */ jsx(IconComponent, { className: "w-6 h-6" })
								}),
								/* @__PURE__ */ jsx("h3", {
									className: "text-xl font-display font-bold text-white mb-3",
									children: pillar.title
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-sm text-neutral-400 leading-relaxed",
									children: pillar.description
								})
							] }), /* @__PURE__ */ jsxs("span", {
								className: "font-mono text-[10px] text-neutral-600 uppercase tracking-widest mt-8 block",
								children: ["Pillar // 0", i + 1]
							})]
						}, i);
					})
				})]
			})
		}),
		/* @__PURE__ */ jsx("section", {
			className: "py-24 bg-[#0c0d12] border-t border-white/10",
			children: /* @__PURE__ */ jsxs("div", {
				className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
						className: "font-mono text-xs uppercase tracking-widest text-[#d4ff00] block mb-2",
						children: "[ STUDIO LEADERSHIP ]"
					}), /* @__PURE__ */ jsx("h2", {
						className: "text-3xl sm:text-4xl font-display font-bold text-white",
						children: "The partners steering the ship."
					})] }), /* @__PURE__ */ jsxs(Link, {
						href: "/team",
						className: "inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#d4ff00] hover:text-white transition-colors",
						children: [/* @__PURE__ */ jsx("span", { children: "View Full Collective" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4" })]
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6",
					children: leadership.map((member) => /* @__PURE__ */ jsxs(Link, {
						href: `/team/${member.slug}`,
						className: "group rounded-2xl bg-[#12141c] border border-white/10 overflow-hidden hover:border-[#d4ff00]/40 transition-colors",
						children: [/* @__PURE__ */ jsx("div", {
							className: "aspect-[4/5] bg-neutral-900 overflow-hidden",
							children: /* @__PURE__ */ jsx("img", {
								src: member.avatar,
								alt: member.name,
								className: "w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
							})
						}), /* @__PURE__ */ jsxs("div", {
							className: "p-4 space-y-1",
							children: [/* @__PURE__ */ jsx("h4", {
								className: "font-display font-bold text-white group-hover:text-[#d4ff00] transition-colors",
								children: member.name
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs font-mono text-neutral-400",
								children: member.role
							})]
						})]
					}, member.id))
				})]
			})
		})
	] });
}
//#endregion
export { About as default };
