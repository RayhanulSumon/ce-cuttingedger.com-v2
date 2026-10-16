import { t as SeoHead } from "./SeoHead-CXtfHcil.js";
import { t as PageHero } from "./PageHero-KJiKVDpm.js";
import "react";
import { Link, router } from "@inertiajs/react";
import { ArrowUpRight } from "lucide-react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Work/Index.tsx
function Index({ projects = [], categories = [], activeCategory = "all" }) {
	const handleFilter = (slug) => {
		router.get("/work", slug === "all" ? {} : { category: slug }, {
			preserveState: true,
			preserveScroll: true
		});
	};
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(SeoHead, {
			title: "Work Archives & Case Studies",
			description: "Explore selected client commissions in software architecture, brand systems, and 3D spatial experiences."
		}),
		/* @__PURE__ */ jsx(PageHero, {
			eyebrow: "SELECTED ARCHIVES",
			title: "CATALOG OF RADICAL",
			highlight: "DIGITAL CRAFT.",
			description: "A curated index of production flagships engineered for venture-backed founders and ambitious category leaders."
		}),
		/* @__PURE__ */ jsx("section", {
			className: "py-8 bg-[#0c0d12] border-b border-white/10 sticky top-[72px] z-30 backdrop-blur-xl bg-[#0c0d12]/90",
			children: /* @__PURE__ */ jsx("div", {
				className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none",
					children: [/* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => handleFilter("all"),
						className: `px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${activeCategory === "all" ? "bg-[#d4ff00] text-black font-bold shadow-[0_0_15px_rgba(212,255,0,0.3)]" : "bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/5"}`,
						children: [
							"All Commissions (",
							projects.length,
							")"
						]
					}), categories.map((cat) => /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => handleFilter(cat.slug),
						className: `px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${activeCategory === cat.slug ? "bg-[#d4ff00] text-black font-bold shadow-[0_0_15px_rgba(212,255,0,0.3)]" : "bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/5"}`,
						children: cat.name
					}, cat.id))]
				})
			})
		}),
		/* @__PURE__ */ jsx("section", {
			className: "py-20 bg-[#0a0b0e]",
			children: /* @__PURE__ */ jsx("div", {
				className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
				children: /* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-1 md:grid-cols-2 gap-10",
					children: projects.map((project, index) => /* @__PURE__ */ jsxs("article", {
						className: "group relative rounded-3xl bg-[#12141c] border border-white/10 overflow-hidden flex flex-col justify-between hover:border-[#d4ff00]/50 transition-all duration-500",
						children: [/* @__PURE__ */ jsxs(Link, {
							href: `/work/${project.slug}`,
							"data-cursor-view": "EXPLORE",
							className: "block relative aspect-[16/10] overflow-hidden bg-neutral-900",
							children: [
								/* @__PURE__ */ jsx("img", {
									src: project.cover_image,
									alt: project.title,
									loading: "lazy",
									className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-mono text-[#d4ff00]",
									children: project.category?.name || "Commission"
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-mono text-neutral-400",
									children: [
										"[",
										project.year,
										"]"
									]
								})
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "p-8 space-y-4",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-start justify-between gap-4",
									children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
										className: "font-mono text-xs uppercase text-neutral-400 block mb-1",
										children: project.client_name
									}), /* @__PURE__ */ jsx("h3", {
										className: "text-2xl sm:text-3xl font-display font-black text-white group-hover:text-[#d4ff00] transition-colors",
										children: /* @__PURE__ */ jsx(Link, {
											href: `/work/${project.slug}`,
											children: project.title
										})
									})] }), /* @__PURE__ */ jsx(Link, {
										href: `/work/${project.slug}`,
										className: "w-10 h-10 rounded-full border border-white/10 group-hover:border-[#d4ff00] group-hover:bg-[#d4ff00] group-hover:text-black flex items-center justify-center transition-all shrink-0 mt-1",
										children: /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-5 h-5" })
									})]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-sm text-neutral-400 line-clamp-2 leading-relaxed",
									children: project.summary
								}),
								/* @__PURE__ */ jsx("div", {
									className: "pt-2 flex flex-wrap gap-2",
									children: project.deliverables?.map((deliv, i) => /* @__PURE__ */ jsx("span", {
										className: "text-[11px] font-mono text-neutral-400 bg-white/5 px-2.5 py-1 rounded border border-white/5",
										children: deliv
									}, i))
								})
							]
						})]
					}, project.id || project.slug))
				})
			})
		})
	] });
}
//#endregion
export { Index as default };
