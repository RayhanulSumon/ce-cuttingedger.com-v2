import { t as SeoHead } from "./SeoHead-jRblvokC.js";
import { t as PageHero } from "./PageHero-BKafzHM7.js";
import "react";
import { Link, router } from "@inertiajs/react";
import { ArrowUpRight } from "lucide-react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Work/Index.tsx
function Index({ projects = [], categories = [], activeCategory = "all" }) {
	const handleFilter = (slug) => {
		router.get("/case-studies", slug === "all" ? {} : { category: slug }, {
			preserveState: true,
			preserveScroll: true
		});
	};
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(SeoHead, {
			title: "Client Case Studies & Visual Performance Results",
			description: "Explore real-world case studies from Cutting Edger: 4,800+ SKU ghost mannequin rollouts, macro fine jewelry retouching, and 3D furniture CGI modeling.",
			breadcrumbs: [{
				name: "Home",
				url: "/"
			}, {
				name: "Case Studies",
				url: "/case-studies"
			}]
		}),
		/* @__PURE__ */ jsx(PageHero, {
			eyebrow: "PORTFOLIO & CASE STUDIES",
			title: "MEASURABLE VISUAL",
			highlight: "PERFORMANCE PROOF.",
			description: "Explore how Cutting Edger optimizes high-volume catalog production, Delta-E color fidelity, and 3D virtual staging for global commerce brands."
		}),
		/* @__PURE__ */ jsx("section", {
			style: { top: "var(--header-height)" },
			className: "py-8 bg-[#0c0d12] border-b border-white/10 sticky top-[var(--header-height,61px)] z-30 backdrop-blur-xl bg-[#0c0d12]/90",
			children: /* @__PURE__ */ jsx("div", {
				className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none",
					children: [/* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => handleFilter("all"),
						className: `px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${activeCategory === "all" ? "bg-accent text-black font-bold shadow-[0_0_15px_rgba(251, 183, 24, 0.3)]" : "bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/5"}`,
						children: [
							"All Results (",
							projects.length,
							")"
						]
					}), categories.map((cat) => /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => handleFilter(cat.slug),
						className: `px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${activeCategory === cat.slug ? "bg-accent text-black font-bold shadow-[0_0_15px_rgba(251, 183, 24, 0.3)]" : "bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/5"}`,
						children: cat.name
					}, cat.id || cat.slug))]
				})
			})
		}),
		/* @__PURE__ */ jsx("section", {
			className: "py-20 bg-[#0a0b0e]",
			children: /* @__PURE__ */ jsx("div", {
				className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
				children: /* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10",
					children: projects.map((project, idx) => /* @__PURE__ */ jsxs("article", {
						className: "group p-6 sm:p-8 rounded-3xl bg-[#12141c] border border-white/10 hover:border-accent/40 transition-all shadow-xl flex flex-col justify-between",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "relative rounded-2xl overflow-hidden aspect-[16/10] bg-neutral-900 border border-white/5",
									children: [
										/* @__PURE__ */ jsx("img", {
											src: project.cover_image,
											alt: project.title,
											loading: idx < 2 ? "eager" : "lazy",
											className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
										}),
										/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" }),
										/* @__PURE__ */ jsx("div", {
											className: "absolute top-4 left-4 flex flex-wrap gap-2",
											children: project.is_concept ? /* @__PURE__ */ jsx("span", {
												className: "px-3 py-1 rounded-full bg-cyan-400/20 border border-cyan-400/40 text-cyan-300 font-mono text-[11px] font-bold uppercase backdrop-blur-md",
												children: "[ Concept Showcase ]"
											}) : /* @__PURE__ */ jsx("span", {
												className: "px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-[11px] font-bold uppercase backdrop-blur-md",
												children: "✓ Client Case Study"
											})
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-white/90",
											children: [/* @__PURE__ */ jsx("span", {
												className: "font-bold text-accent",
												children: project.client_name
											}), /* @__PURE__ */ jsx("span", { children: project.year })]
										})
									]
								}),
								/* @__PURE__ */ jsx("h2", {
									className: "text-2xl font-display font-bold text-white group-hover:text-accent transition-colors",
									children: /* @__PURE__ */ jsx(Link, {
										href: `/case-studies/${project.slug}`,
										children: project.title
									})
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-neutral-400 text-sm leading-relaxed line-clamp-3",
									children: project.summary
								}),
								project.metrics && project.metrics.length > 0 && /* @__PURE__ */ jsx("div", {
									className: "grid grid-cols-3 gap-2 pt-2 border-t border-white/5",
									children: project.metrics.slice(0, 3).map((m, i) => /* @__PURE__ */ jsxs("div", {
										className: "text-center p-2 rounded-xl bg-white/[0.02]",
										children: [/* @__PURE__ */ jsx("p", {
											className: "font-display font-black text-sm text-accent",
											children: m.value
										}), /* @__PURE__ */ jsx("p", {
											className: "text-[10px] font-mono text-neutral-400 truncate",
											children: m.label
										})]
									}, i))
								})
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "pt-6 mt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-neutral-400",
								children: project.category?.name || "Production"
							}), /* @__PURE__ */ jsxs(Link, {
								href: `/case-studies/${project.slug}`,
								className: "text-accent font-bold inline-flex items-center gap-1 group-hover:underline",
								children: [/* @__PURE__ */ jsx("span", { children: "Read Full Study" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-3.5 h-3.5" })]
							})]
						})]
					}, project.id || project.slug))
				})
			})
		})
	] });
}
//#endregion
export { Index as default };
