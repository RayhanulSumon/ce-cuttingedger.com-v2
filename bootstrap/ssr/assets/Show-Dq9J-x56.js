import { t as SeoHead } from "./SeoHead-jRblvokC.js";
import { t as PageHero } from "./PageHero-BKafzHM7.js";
import "react";
import { Link, usePage } from "@inertiajs/react";
import { ArrowRight, Calendar, Check, HelpCircle, Sparkles } from "lucide-react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Services/Show.tsx
function Show({ service, otherServices = [], relatedProjects = [] }) {
	const { settings } = usePage().props;
	settings?.calendly_url;
	const breadcrumbs = [{
		name: "Home",
		url: "/"
	}, {
		name: "Services",
		url: "/services"
	}];
	if (service.parent) breadcrumbs.push({
		name: service.parent.title,
		url: `/services/${service.parent.slug}`
	});
	breadcrumbs.push({
		name: service.title,
		url: service.parent ? `/services/${service.parent.slug}/${service.slug}` : `/services/${service.slug}`
	});
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(SeoHead, {
			title: service.meta_title || `${service.title} Services — Cutting Edger`,
			description: service.meta_description || service.subtitle || service.description,
			breadcrumbs,
			serviceSchema: {
				name: service.title,
				description: service.description,
				serviceType: service.title
			},
			faqSchema: service.faqs || []
		}),
		/* @__PURE__ */ jsx(PageHero, {
			eyebrow: `CAPABILITIES // ${service.marquee_label || "VISUAL PERFORMANCE"}`,
			title: service.h1_title || service.title,
			description: service.subtitle,
			backUrl: service.parent ? `/services/${service.parent.slug}` : "/services",
			backLabel: service.parent ? `Back to ${service.parent.title}` : "All Disciplines"
		}),
		service.children && service.children.length > 0 && /* @__PURE__ */ jsx("div", {
			className: "bg-[#12141c] border-b border-white/10 py-4 px-4 sm:px-6 lg:px-8",
			children: /* @__PURE__ */ jsxs("div", {
				className: "max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 font-mono text-xs",
				children: [/* @__PURE__ */ jsx("span", {
					className: "text-neutral-400 uppercase font-bold",
					children: "Specialized Sub-Services:"
				}), /* @__PURE__ */ jsx("div", {
					className: "flex flex-wrap gap-2",
					children: service.children.map((child) => /* @__PURE__ */ jsx(Link, {
						href: `/services/${service.slug}/${child.slug}`,
						className: "px-3 py-1.5 rounded-lg bg-white/5 hover:bg-accent hover:text-black border border-white/10 text-neutral-300 transition-all",
						children: child.title
					}, child.id || child.slug))
				})]
			})
		}),
		(service.problem_statement || service.solution_statement) && /* @__PURE__ */ jsx("section", {
			className: "py-16 bg-[#090a0d] border-b border-white/10",
			children: /* @__PURE__ */ jsx("div", {
				className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
				children: /* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 md:grid-cols-2 gap-8",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "p-8 rounded-3xl bg-[#12141c] border border-red-500/20 space-y-3",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "font-mono text-xs uppercase tracking-widest text-red-400 font-bold",
								children: "[ THE PRODUCTION BOTTLENECK ]"
							}),
							/* @__PURE__ */ jsx("h3", {
								className: "text-2xl font-display font-bold text-white",
								children: "The Challenge"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-neutral-300 text-sm leading-relaxed",
								children: service.problem_statement || "High-volume product shoots and inconsistent manual editing stall seasonal drops and inflate return rates."
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "p-8 rounded-3xl bg-[#12141c] border border-accent/30 space-y-3",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "font-mono text-xs uppercase tracking-widest text-accent font-bold",
								children: "[ THE CUTTING EDGER RESOLUTION ]"
							}),
							/* @__PURE__ */ jsx("h3", {
								className: "text-2xl font-display font-bold text-white",
								children: "Our Method"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-neutral-300 text-sm leading-relaxed",
								children: service.solution_statement || "We deploy dedicated retouching teams, 100% hand-drawn paths, and automated multi-channel format compliance."
							})
						]
					})]
				})
			})
		}),
		/* @__PURE__ */ jsx("section", {
			className: "py-20 bg-[#0c0d12] border-b border-white/10",
			children: /* @__PURE__ */ jsx("div", {
				className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
				children: /* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 lg:grid-cols-12 gap-12",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "lg:col-span-7 space-y-8",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "font-mono text-xs uppercase tracking-widest text-accent font-bold",
									children: "[ DISCIPLINE ARCHITECTURE ]"
								}),
								/* @__PURE__ */ jsx("h2", {
									className: "text-3xl sm:text-4xl font-display font-extrabold text-white",
									children: "Built for brands that refuse to compromise on visual craft."
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-neutral-300 text-base sm:text-lg leading-relaxed",
									children: service.description
								})
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "pt-4 space-y-4",
							children: [/* @__PURE__ */ jsx("h3", {
								className: "font-display font-bold text-xl text-white",
								children: "Key Service Capabilities & Standards"
							}), /* @__PURE__ */ jsx("div", {
								className: "space-y-3",
								children: service.features?.map((feat, i) => /* @__PURE__ */ jsxs("div", {
									className: "flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5",
									children: [/* @__PURE__ */ jsx("div", {
										className: "w-5 h-5 rounded-full bg-accent/10 border border-accent text-black flex items-center justify-center shrink-0 mt-0.5",
										children: /* @__PURE__ */ jsx(Check, { className: "w-3 h-3 text-accent" })
									}), /* @__PURE__ */ jsx("span", {
										className: "text-neutral-200 text-sm font-medium",
										children: feat
									})]
								}, i))
							})]
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "lg:col-span-5 space-y-6",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "p-8 rounded-3xl bg-[#12141c] border border-white/10 space-y-6 shadow-2xl",
							children: [
								/* @__PURE__ */ jsx("h3", {
									className: "font-display font-bold text-xl text-white",
									children: "Handed Over Deliverables"
								}),
								/* @__PURE__ */ jsx("ul", {
									className: "space-y-3",
									children: service.deliverables?.map((deliv, i) => /* @__PURE__ */ jsxs("li", {
										className: "flex items-center gap-2 text-sm text-neutral-300 font-mono",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-accent font-bold",
											children: "→"
										}), /* @__PURE__ */ jsx("span", { children: deliv })]
									}, i))
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "pt-6 border-t border-white/10 space-y-3",
									children: [/* @__PURE__ */ jsxs(Link, {
										href: "/#free-trial",
										className: "w-full bg-accent text-black font-display font-bold text-xs uppercase tracking-wider py-4 px-6 rounded-2xl flex items-center justify-center gap-2 hover:bg-accent-hover transition-colors shadow-lg",
										children: [/* @__PURE__ */ jsx(Sparkles, { className: "w-4 h-4" }), /* @__PURE__ */ jsx("span", { children: "Test 3 Free Sample Assets" })]
									}), /* @__PURE__ */ jsxs("button", {
										type: "button",
										onClick: () => window.dispatchEvent(new CustomEvent("ce:open-discovery-call")),
										className: "w-full border border-white/15 text-white hover:bg-white/5 font-mono text-xs uppercase tracking-wider py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 transition-colors cursor-pointer",
										children: [/* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4 text-accent" }), /* @__PURE__ */ jsx("span", { children: "Book a 15-Min Discovery Call" })]
									})]
								})
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3",
							children: [/* @__PURE__ */ jsx("span", {
								className: "font-mono text-xs uppercase tracking-widest text-neutral-400 block font-bold",
								children: "Explore Other Service Pillars"
							}), /* @__PURE__ */ jsx("div", {
								className: "space-y-2",
								children: otherServices.map((s) => /* @__PURE__ */ jsxs(Link, {
									href: `/services/${s.slug}`,
									className: "flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 text-xs text-neutral-300 hover:text-accent transition-colors",
									children: [/* @__PURE__ */ jsx("span", {
										className: "font-mono",
										children: s.title
									}), /* @__PURE__ */ jsx(ArrowRight, { className: "w-3.5 h-3.5" })]
								}, s.id || s.slug))
							})]
						})]
					})]
				})
			})
		}),
		service.process_steps && service.process_steps.length > 0 && /* @__PURE__ */ jsx("section", {
			className: "py-20 bg-[#07080a] border-b border-white/10",
			children: /* @__PURE__ */ jsxs("div", {
				className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "text-center max-w-xl mx-auto space-y-2",
					children: [/* @__PURE__ */ jsx("span", {
						className: "font-mono text-xs uppercase tracking-widest text-accent font-bold",
						children: "[ SYSTEMATIC PIPELINE ]"
					}), /* @__PURE__ */ jsx("h2", {
						className: "text-3xl font-display font-bold text-white",
						children: "How We Process Your Assets"
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6",
					children: service.process_steps.map((step, idx) => /* @__PURE__ */ jsxs("div", {
						className: "p-6 rounded-2xl bg-[#12141c] border border-white/10 space-y-3",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "font-display text-3xl font-extrabold text-accent",
								children: step.step
							}),
							/* @__PURE__ */ jsx("h3", {
								className: "font-display font-bold text-base text-white",
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
		service.faqs && service.faqs.length > 0 && /* @__PURE__ */ jsx("section", {
			className: "py-20 bg-[#0c0d12]",
			children: /* @__PURE__ */ jsxs("div", {
				className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "text-center space-y-2",
					children: [/* @__PURE__ */ jsx("span", {
						className: "font-mono text-xs uppercase tracking-widest text-accent font-bold",
						children: "[ FREQUENTLY ASKED QUESTIONS ]"
					}), /* @__PURE__ */ jsxs("h2", {
						className: "text-3xl font-display font-bold text-white",
						children: ["Questions About ", service.title]
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "space-y-4",
					children: service.faqs.map((faq, idx) => /* @__PURE__ */ jsxs("div", {
						className: "p-6 rounded-2xl bg-[#12141c] border border-white/10 space-y-2",
						children: [/* @__PURE__ */ jsxs("h3", {
							className: "text-base font-display font-bold text-white flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(HelpCircle, { className: "w-4 h-4 text-accent shrink-0" }), /* @__PURE__ */ jsx("span", { children: faq.question })]
						}), /* @__PURE__ */ jsx("p", {
							className: "text-neutral-300 text-xs leading-relaxed pl-6",
							children: faq.answer
						})]
					}, idx))
				})]
			})
		})
	] });
}
//#endregion
export { Show as default };
