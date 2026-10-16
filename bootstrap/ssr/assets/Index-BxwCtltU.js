import { t as SeoHead } from "./SeoHead-CXtfHcil.js";
import { t as PageHero } from "./PageHero-KJiKVDpm.js";
import "react";
import { Link, router } from "@inertiajs/react";
import { ArrowUpRight, Clock } from "lucide-react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Blog/Index.tsx
function Index({ posts = [], categories = [], activeCategory = "all" }) {
	const handleCategoryFilter = (slug) => {
		router.get("/blog", slug === "all" ? {} : { category: slug }, {
			preserveState: true,
			preserveScroll: true
		});
	};
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(SeoHead, {
			title: "Dispatch Journal & Technical Insights",
			description: "Essays, engineering deep dives, and design theory from the partners at CuttingEdger."
		}),
		/* @__PURE__ */ jsx(PageHero, {
			eyebrow: "DISPATCH JOURNAL",
			title: "THOUGHTS ON KINETICS,",
			highlight: "CODE & BRAND GRAVITY.",
			description: "Long-form essays, technical post-mortems, and design manifestos dissecting what works on the modern web."
		}),
		/* @__PURE__ */ jsx("section", {
			className: "py-8 bg-[#0c0d12] border-b border-white/10 sticky top-[72px] z-30 backdrop-blur-xl bg-[#0c0d12]/90",
			children: /* @__PURE__ */ jsx("div", {
				className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none",
					children: [/* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => handleCategoryFilter("all"),
						className: `px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${activeCategory === "all" ? "bg-[#d4ff00] text-black font-bold shadow-[0_0_15px_rgba(212,255,0,0.3)]" : "bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/5"}`,
						children: [
							"All Essays (",
							posts.length,
							")"
						]
					}), categories.map((cat) => /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => handleCategoryFilter(cat.slug),
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
					children: posts.map((post) => /* @__PURE__ */ jsxs("article", {
						className: "group rounded-3xl bg-[#12141c] border border-white/10 overflow-hidden flex flex-col justify-between hover:border-[#d4ff00]/50 transition-all duration-300",
						children: [/* @__PURE__ */ jsxs(Link, {
							href: `/blog/${post.slug}`,
							className: "block relative aspect-[16/10] overflow-hidden bg-neutral-900",
							children: [/* @__PURE__ */ jsx("img", {
								src: post.cover_image,
								alt: post.title,
								loading: "lazy",
								className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
							}), /* @__PURE__ */ jsx("div", {
								className: "absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-mono text-[#d4ff00]",
								children: post.category?.name || "Insight"
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "p-8 space-y-4",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-4 text-xs font-mono text-neutral-500",
									children: [/* @__PURE__ */ jsxs("span", {
										className: "flex items-center gap-1",
										children: [
											/* @__PURE__ */ jsx(Clock, { className: "w-3.5 h-3.5 text-[#d4ff00]" }),
											post.reading_time,
											" min read"
										]
									}), post.author && /* @__PURE__ */ jsxs("span", { children: ["By ", post.author.name] })]
								}),
								/* @__PURE__ */ jsx("h3", {
									className: "text-2xl sm:text-3xl font-display font-bold text-white group-hover:text-[#d4ff00] transition-colors leading-snug",
									children: /* @__PURE__ */ jsx(Link, {
										href: `/blog/${post.slug}`,
										children: post.title
									})
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-neutral-400 text-sm line-clamp-3 leading-relaxed",
									children: post.excerpt
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "pt-4 border-t border-white/10 flex items-center justify-between",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-xs font-mono text-neutral-500",
										children: new Date(post.published_at).toLocaleDateString("en-US", {
											month: "short",
											day: "numeric",
											year: "numeric"
										})
									}), /* @__PURE__ */ jsxs(Link, {
										href: `/blog/${post.slug}`,
										className: "inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#d4ff00] group-hover:text-white transition-colors",
										children: [/* @__PURE__ */ jsx("span", { children: "Read Essay" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4" })]
									})]
								})
							]
						})]
					}, post.id || post.slug))
				})
			})
		})
	] });
}
//#endregion
export { Index as default };
