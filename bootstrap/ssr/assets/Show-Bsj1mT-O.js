import { t as SeoHead } from "./SeoHead-jRblvokC.js";
import { t as PageHero } from "./PageHero-BKafzHM7.js";
import "react";
import { Link, usePage } from "@inertiajs/react";
import { ArrowUpRight, Calendar, CheckCircle2, Sparkles } from "lucide-react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Work/Show.tsx
function Show({ project, relatedProjects = [] }) {
	const { settings } = usePage().props;
	settings?.calendly_url;
	const breadcrumbs = [
		{
			name: "Home",
			url: "/"
		},
		{
			name: "Case Studies",
			url: "/case-studies"
		},
		{
			name: project.title,
			url: `/case-studies/${project.slug}`
		}
	];
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(SeoHead, {
			title: project.meta_title || `${project.title} — Case Study | Cutting Edger`,
			description: project.meta_description || project.summary,
			image: project.cover_image,
			breadcrumbs,
			articleSchema: {
				headline: project.title,
				description: project.summary,
				image: project.cover_image,
				datePublished: `${project.year}-01-15`,
				dateModified: "2026-10-23"
			}
		}),
		/* @__PURE__ */ jsx(PageHero, {
			eyebrow: `CASE STUDY // ${project.client_name}`,
			title: project.h1_title || project.title,
			description: project.summary,
			backUrl: "/case-studies",
			backLabel: "Back to All Case Studies"
		}),
		project.is_concept && /* @__PURE__ */ jsx("div", {
			className: "bg-cyan-950/40 border-b border-cyan-500/20 py-3 px-4 sm:px-6 lg:px-8 text-center text-xs font-mono text-cyan-300",
			children: /* @__PURE__ */ jsxs("span", { children: [
				"💡 ",
				/* @__PURE__ */ jsx("strong", { children: "Concept Showcase Work:" }),
				" This study represents a virtual CGI prototype and pipeline benchmark engineered by Cutting Edger Studio."
			] })
		}),
		/* @__PURE__ */ jsx("section", {
			className: "py-8 bg-[#0c0d12] border-b border-white/10",
			children: /* @__PURE__ */ jsx("div", {
				className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
				children: /* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-2 md:grid-cols-4 gap-6 text-xs font-mono",
					children: [
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
							className: "text-neutral-500 uppercase block mb-1",
							children: "Client Partner"
						}), /* @__PURE__ */ jsx("span", {
							className: "text-white font-medium text-sm",
							children: project.client_name
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
							className: "text-neutral-500 uppercase block mb-1",
							children: "Discipline"
						}), /* @__PURE__ */ jsx("span", {
							className: "text-accent font-medium text-sm",
							children: project.category?.name || "Production"
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
							className: "text-neutral-500 uppercase block mb-1",
							children: "Year & Timeline"
						}), /* @__PURE__ */ jsx("span", {
							className: "text-white font-medium text-sm",
							children: project.year
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
							className: "text-neutral-500 uppercase block mb-1",
							children: "Store / Live URL"
						}), project.live_url ? /* @__PURE__ */ jsxs("a", {
							href: project.live_url,
							target: "_blank",
							rel: "noopener noreferrer",
							className: "text-white hover:text-accent inline-flex items-center gap-1 font-medium text-sm transition-colors",
							children: [/* @__PURE__ */ jsx("span", { children: "Visit Client Website" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-3.5 h-3.5 text-accent" })]
						}) : /* @__PURE__ */ jsx("span", {
							className: "text-neutral-500",
							children: "Private Enterprise Retainer"
						})] })
					]
				})
			})
		}),
		/* @__PURE__ */ jsx("section", {
			className: "py-12 bg-[#0a0b0e]",
			children: /* @__PURE__ */ jsx("div", {
				className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
				children: /* @__PURE__ */ jsx("div", {
					className: "relative rounded-3xl overflow-hidden aspect-[16/9] border border-white/10 bg-neutral-900 shadow-2xl",
					children: /* @__PURE__ */ jsx("img", {
						src: project.cover_image,
						alt: `${project.title} - Main production outcome for ${project.client_name}`,
						className: "w-full h-full object-cover"
					})
				})
			})
		}),
		project.metrics && project.metrics.length > 0 && /* @__PURE__ */ jsx("section", {
			className: "py-12 bg-[#0c0d12] border-y border-white/10",
			children: /* @__PURE__ */ jsx("div", {
				className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
				children: /* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-1 sm:grid-cols-3 gap-6",
					children: project.metrics.map((metric, i) => /* @__PURE__ */ jsxs("div", {
						className: "p-8 rounded-2xl bg-[#12141c] border border-white/10 text-center space-y-2",
						children: [/* @__PURE__ */ jsx("p", {
							className: "font-display font-black text-4xl sm:text-5xl text-accent",
							children: metric.value
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs font-mono uppercase tracking-widest text-neutral-300 font-bold",
							children: metric.label
						})]
					}, i))
				})
			})
		}),
		/* @__PURE__ */ jsx("section", {
			className: "py-20 bg-[#0a0b0e]",
			children: /* @__PURE__ */ jsxs("div", {
				className: "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "p-8 sm:p-10 rounded-3xl bg-[#12141c] border border-white/10 space-y-4",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "font-mono text-xs uppercase tracking-widest text-red-400 font-bold",
								children: "[ 01. THE SITUATION & CHALLENGE ]"
							}),
							/* @__PURE__ */ jsx("h2", {
								className: "text-2xl sm:text-3xl font-display font-bold text-white",
								children: "Client Challenge"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-neutral-300 text-base leading-relaxed",
								children: project.client_challenge || project.summary
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "p-8 sm:p-10 rounded-3xl bg-[#12141c] border border-white/10 space-y-4",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "font-mono text-xs uppercase tracking-widest text-accent font-bold",
								children: "[ 02. EXECUTION & WORK COMPLETED ]"
							}),
							/* @__PURE__ */ jsx("h2", {
								className: "text-2xl sm:text-3xl font-display font-bold text-white",
								children: "What We Delivered"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-neutral-300 text-base leading-relaxed",
								children: project.work_done || project.description
							}),
							project.deliverables && /* @__PURE__ */ jsxs("div", {
								className: "pt-4 border-t border-white/10 space-y-3",
								children: [/* @__PURE__ */ jsx("span", {
									className: "font-mono text-xs uppercase tracking-wider text-neutral-400 font-bold block",
									children: "Production Assets Handed Over:"
								}), /* @__PURE__ */ jsx("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
									children: project.deliverables.map((deliv, idx) => /* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2 text-xs font-mono text-neutral-200",
										children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4 text-accent shrink-0" }), /* @__PURE__ */ jsx("span", { children: deliv })]
									}, idx))
								})]
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "p-8 sm:p-10 rounded-3xl bg-[#12141c] border border-emerald-500/30 space-y-4",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "font-mono text-xs uppercase tracking-widest text-emerald-400 font-bold",
								children: "[ 03. MEASURABLE COMMERCIAL OUTCOME ]"
							}),
							/* @__PURE__ */ jsx("h2", {
								className: "text-2xl sm:text-3xl font-display font-bold text-white",
								children: "Measurable Impact"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-neutral-300 text-base leading-relaxed",
								children: project.measurable_result || "Reduced turnaround times by over 60% while elevating marketplace approval and click-through rates."
							})
						]
					}),
					project.gallery && project.gallery.length > 0 && /* @__PURE__ */ jsxs("div", {
						className: "space-y-6 pt-6",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "font-display font-bold text-2xl text-white",
							children: "Production Asset Gallery"
						}), /* @__PURE__ */ jsx("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-6",
							children: project.gallery.map((imgUrl, idx) => /* @__PURE__ */ jsx("div", {
								className: "rounded-2xl overflow-hidden aspect-[4/3] border border-white/10 bg-neutral-900 group",
								children: /* @__PURE__ */ jsx("img", {
									src: imgUrl,
									alt: `${project.title} detailed asset render ${idx + 1}`,
									loading: "lazy",
									className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
								})
							}, idx))
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#12141c] to-[#0a0b0e] border border-accent/40 text-center space-y-6 shadow-2xl",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "font-mono text-xs uppercase tracking-widest text-accent font-bold",
								children: "[ ACHIEVE SIMILAR RESULTS FOR YOUR CATALOG ]"
							}),
							/* @__PURE__ */ jsx("h3", {
								className: "text-3xl sm:text-4xl font-display font-bold text-white",
								children: "Test Our Production Quality on 3 Free Assets"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-neutral-300 text-sm max-w-xl mx-auto leading-relaxed",
								children: "Upload 3 of your most complex raw images. We will return retouched, marketplace-ready master files in under 24 hours."
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex flex-col sm:flex-row items-center justify-center gap-4 pt-2",
								children: [/* @__PURE__ */ jsxs(Link, {
									href: "/#free-trial",
									className: "px-8 py-3.5 rounded-xl bg-accent text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-accent-hover transition-all shadow-lg flex items-center gap-2",
									children: [/* @__PURE__ */ jsx(Sparkles, { className: "w-4 h-4" }), /* @__PURE__ */ jsx("span", { children: "Request Free 3-Asset Pilot" })]
								}), /* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => window.dispatchEvent(new CustomEvent("ce:open-discovery-call")),
									className: "px-8 py-3.5 rounded-xl border border-white/20 text-white hover:bg-white/5 font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer",
									children: [/* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4 text-accent" }), /* @__PURE__ */ jsx("span", { children: "Book 15-Min Discovery Call" })]
								})]
							})
						]
					})
				]
			})
		})
	] });
}
//#endregion
export { Show as default };
