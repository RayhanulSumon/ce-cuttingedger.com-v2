import { t as SeoHead } from "./SeoHead-CXtfHcil.js";
import { t as PageHero } from "./PageHero-KJiKVDpm.js";
import "react";
import { Link } from "@inertiajs/react";
import { ArrowUpRight, CheckCircle } from "lucide-react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Work/Show.tsx
function Show({ project, relatedProjects = [] }) {
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(SeoHead, {
			title: `${project.title} — Case Study`,
			description: project.summary,
			image: project.cover_image
		}),
		/* @__PURE__ */ jsx(PageHero, {
			eyebrow: `CASE STUDY // ${project.client_name}`,
			title: project.title,
			description: project.summary,
			backUrl: "/work",
			backLabel: "Back to Work Index"
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
							className: "text-[#d4ff00] font-medium text-sm",
							children: project.category?.name || "Flagship"
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
							className: "text-neutral-500 uppercase block mb-1",
							children: "Timeline & Year"
						}), /* @__PURE__ */ jsx("span", {
							className: "text-white font-medium text-sm",
							children: project.year
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
							className: "text-neutral-500 uppercase block mb-1",
							children: "Live URL"
						}), project.live_url ? /* @__PURE__ */ jsxs("a", {
							href: project.live_url,
							target: "_blank",
							rel: "noopener noreferrer",
							className: "text-white hover:text-[#d4ff00] inline-flex items-center gap-1 font-medium text-sm transition-colors",
							children: [/* @__PURE__ */ jsx("span", { children: "Launch Flagship" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-3.5 h-3.5 text-[#d4ff00]" })]
						}) : /* @__PURE__ */ jsx("span", {
							className: "text-neutral-500",
							children: "Private Enterprise"
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
						alt: project.title,
						className: "w-full h-full object-cover"
					})
				})
			})
		}),
		/* @__PURE__ */ jsx("section", {
			className: "py-20 bg-[#0a0b0e]",
			children: /* @__PURE__ */ jsx("div", {
				className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
				children: /* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 lg:grid-cols-12 gap-12",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "lg:col-span-8 space-y-12",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "font-mono text-xs uppercase tracking-widest text-[#d4ff00]",
									children: "[ 01 // ARCHITECTURAL CONTEXT ]"
								}),
								/* @__PURE__ */ jsx("h2", {
									className: "text-3xl sm:text-4xl font-display font-bold text-white",
									children: "The Challenge & Vision"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-neutral-300 text-lg leading-relaxed",
									children: project.description
								})
							]
						}), project.gallery && project.gallery.length > 0 && /* @__PURE__ */ jsxs("div", {
							className: "space-y-8 pt-6",
							children: [/* @__PURE__ */ jsx("span", {
								className: "font-mono text-xs uppercase tracking-widest text-[#d4ff00]",
								children: "[ 02 // ARTIFACT EXPLORATIONS ]"
							}), /* @__PURE__ */ jsx("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-6",
								children: project.gallery.map((img, i) => /* @__PURE__ */ jsx("div", {
									className: "rounded-2xl overflow-hidden border border-white/10 aspect-[4/3] bg-neutral-900",
									children: /* @__PURE__ */ jsx("img", {
										src: img,
										alt: `${project.title} gallery ${i + 1}`,
										loading: "lazy",
										className: "w-full h-full object-cover hover:scale-105 transition-transform duration-500"
									})
								}, i))
							})]
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "lg:col-span-4 space-y-8",
						children: [project.metrics && project.metrics.length > 0 && /* @__PURE__ */ jsxs("div", {
							className: "p-8 rounded-3xl bg-[#12141c] border border-white/10 space-y-6",
							children: [/* @__PURE__ */ jsx("span", {
								className: "font-mono text-xs uppercase tracking-widest text-[#d4ff00] block",
								children: "[ MEASURABLE PERFORMANCE ]"
							}), /* @__PURE__ */ jsx("div", {
								className: "divide-y divide-white/10",
								children: project.metrics.map((m, idx) => /* @__PURE__ */ jsxs("div", {
									className: "py-4 first:pt-0 last:pb-0",
									children: [/* @__PURE__ */ jsx("span", {
										className: "block text-3xl font-display font-black text-white",
										children: m.value
									}), /* @__PURE__ */ jsx("span", {
										className: "font-mono text-xs text-neutral-400 uppercase",
										children: m.label
									})]
								}, idx))
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "p-8 rounded-3xl bg-[#12141c] border border-white/10 space-y-4",
							children: [/* @__PURE__ */ jsx("span", {
								className: "font-mono text-xs uppercase tracking-widest text-neutral-400 block",
								children: "Deliverables Included"
							}), /* @__PURE__ */ jsx("ul", {
								className: "space-y-2.5",
								children: project.deliverables?.map((deliv, i) => /* @__PURE__ */ jsxs("li", {
									className: "flex items-center gap-2 text-xs font-mono text-neutral-300",
									children: [/* @__PURE__ */ jsx(CheckCircle, { className: "w-3.5 h-3.5 text-[#d4ff00]" }), /* @__PURE__ */ jsx("span", { children: deliv })]
								}, i))
							})]
						})]
					})]
				})
			})
		}),
		relatedProjects.length > 0 && /* @__PURE__ */ jsx("section", {
			className: "py-24 bg-[#0c0d12] border-t border-white/10",
			children: /* @__PURE__ */ jsxs("div", {
				className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between mb-12",
					children: [/* @__PURE__ */ jsx("span", {
						className: "font-mono text-xs uppercase tracking-widest text-[#d4ff00]",
						children: "[ EXPLORE MORE COMMISSIONS ]"
					}), /* @__PURE__ */ jsx(Link, {
						href: "/work",
						className: "font-mono text-xs uppercase tracking-widest text-neutral-400 hover:text-[#d4ff00] transition-colors",
						children: "View Complete Archive →"
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-1 md:grid-cols-2 gap-8",
					children: relatedProjects.map((rel) => /* @__PURE__ */ jsxs(Link, {
						href: `/work/${rel.slug}`,
						className: "group rounded-3xl bg-[#12141c] border border-white/10 overflow-hidden hover:border-[#d4ff00]/40 transition-colors",
						children: [/* @__PURE__ */ jsx("div", {
							className: "aspect-[16/9] bg-neutral-900 overflow-hidden",
							children: /* @__PURE__ */ jsx("img", {
								src: rel.cover_image,
								alt: rel.title,
								className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
							})
						}), /* @__PURE__ */ jsxs("div", {
							className: "p-6",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-xs font-mono text-neutral-400 block mb-1",
								children: rel.client_name
							}), /* @__PURE__ */ jsx("h3", {
								className: "text-2xl font-display font-bold text-white group-hover:text-[#d4ff00] transition-colors",
								children: rel.title
							})]
						})]
					}, rel.id))
				})]
			})
		})
	] });
}
//#endregion
export { Show as default };
