import { t as SeoHead } from "./SeoHead-jRblvokC.js";
import "react";
import { Link, router } from "@inertiajs/react";
import { ArrowUpRight, Calendar, ChevronRight, Clock, CornerDownRight, Sparkles, Tag } from "lucide-react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Blog/Index.tsx
function Index({ blogs = [], categories = [], activeCategory = "all", activeSubcategory = "all" }) {
	const handleCategoryFilter = (catSlug, subSlug) => {
		const params = {};
		if (catSlug !== "all") params.category = catSlug;
		if (subSlug && subSlug !== "all") params.subcategory = subSlug;
		router.get("/blog", params, {
			preserveState: true,
			preserveScroll: true
		});
	};
	const currentCategory = categories.find((c) => c.slug === activeCategory);
	const subcategories = currentCategory?.subcategories || [];
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(SeoHead, {
			title: "Latest Blogs & Technical Insights",
			description: "Essays, engineering deep dives, design theory, and kinetic software architecture from the team at CuttingEdger.",
			keywords: "web development, design theory, laravel 13, react 19, kinetic animation, software architecture",
			canonicalUrl: "https://cuttingedger.com/blog"
		}),
		/* @__PURE__ */ jsxs("section", {
			className: "relative pt-28 sm:pt-32 pb-10 sm:pb-12 bg-[#0a0b0e] border-b border-white/10 overflow-hidden text-center select-none",
			children: [
				/* @__PURE__ */ jsx("div", { className: "absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[140px] pointer-events-none" }),
				/* @__PURE__ */ jsx("div", { className: "absolute top-1/3 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-[140px] pointer-events-none" }),
				/* @__PURE__ */ jsxs("div", {
					className: "max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center justify-center",
					children: [/* @__PURE__ */ jsx("h1", {
						className: "text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-wider uppercase font-display",
						children: "LATEST BLOG"
					}), /* @__PURE__ */ jsxs("nav", {
						"aria-label": "Breadcrumb",
						className: "mt-2.5 flex items-center justify-center gap-1.5 text-sm sm:text-base font-medium",
						children: [
							/* @__PURE__ */ jsx(Link, {
								href: "/",
								className: "text-accent hover:underline transition-all cursor-pointer font-medium",
								children: "Home"
							}),
							/* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4 text-neutral-500 shrink-0" }),
							/* @__PURE__ */ jsx("span", {
								className: "text-white/90",
								children: "Blog"
							})
						]
					})]
				})
			]
		}),
		/* @__PURE__ */ jsx("section", {
			style: { top: "var(--header-height)" },
			className: "py-5 bg-[#0c0d12] border-b border-white/10 sticky top-[var(--header-height,61px)] z-30 backdrop-blur-xl bg-[#0c0d12]/90 space-y-3",
			children: /* @__PURE__ */ jsxs("div", {
				className: "max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none",
					children: [/* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => handleCategoryFilter("all"),
						className: `px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${activeCategory === "all" ? "bg-accent text-black font-bold shadow-[0_0_15px_rgba(251, 183, 24, 0.3)]" : "bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/5"}`,
						children: [/* @__PURE__ */ jsx("span", { children: "All Essays" }), /* @__PURE__ */ jsx("span", {
							className: `text-[10px] px-1.5 py-0.2 rounded-full ${activeCategory === "all" ? "bg-black/20 text-black" : "bg-white/10 text-neutral-400"}`,
							children: blogs.length
						})]
					}), categories.map((cat) => /* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => handleCategoryFilter(cat.slug),
						className: `px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${activeCategory === cat.slug ? "bg-accent text-black font-bold shadow-[0_0_15px_rgba(251, 183, 24, 0.3)]" : "bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/5"}`,
						children: [/* @__PURE__ */ jsx("span", { children: cat.name }), typeof cat.blogs_count === "number" && /* @__PURE__ */ jsx("span", {
							className: `text-[10px] px-1.5 py-0.2 rounded-full ${activeCategory === cat.slug ? "bg-black/20 text-black" : "bg-white/10 text-neutral-400"}`,
							children: cat.blogs_count
						})]
					}, cat.id))]
				}), subcategories.length > 0 && /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2 pt-2 border-t border-white/5 overflow-x-auto scrollbar-none",
					children: [
						/* @__PURE__ */ jsxs("span", {
							className: "text-[11px] font-mono text-neutral-500 uppercase flex items-center gap-1 shrink-0",
							children: [/* @__PURE__ */ jsx(CornerDownRight, { className: "w-3 h-3 text-accent" }), "Subtopics:"]
						}),
						/* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => handleCategoryFilter(activeCategory, "all"),
							className: `px-3 py-1 rounded text-xs font-mono transition-all cursor-pointer ${activeSubcategory === "all" ? "bg-white/20 text-white font-bold" : "text-neutral-400 hover:text-white"}`,
							children: ["All ", currentCategory?.name]
						}),
						subcategories.map((sub) => /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => handleCategoryFilter(activeCategory, sub.slug),
							className: `px-3 py-1 rounded text-xs font-mono transition-all cursor-pointer ${activeSubcategory === sub.slug ? "bg-accent/20 text-accent border border-accent/30 font-bold" : "text-neutral-400 hover:text-white border border-white/5"}`,
							children: sub.name
						}, sub.id))
					]
				})]
			})
		}),
		/* @__PURE__ */ jsx("section", {
			className: "py-12 sm:py-16 bg-[#0a0b0e]",
			children: /* @__PURE__ */ jsx("div", {
				className: "max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8",
				children: blogs.length === 0 ? /* @__PURE__ */ jsxs("div", {
					className: "text-center py-20 border border-dashed border-white/10 rounded-2xl p-8 bg-[#0c0d14]/40",
					children: [
						/* @__PURE__ */ jsx(Tag, { className: "w-8 h-8 text-neutral-600 mx-auto mb-3" }),
						/* @__PURE__ */ jsx("h3", {
							className: "text-base font-mono font-bold text-white",
							children: "No blogs found"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-neutral-500 text-xs font-mono mt-1",
							children: "No articles in this taxonomy category yet. Check back soon."
						})
					]
				}) : /* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 xl:gap-8",
					children: blogs.map((blog) => /* @__PURE__ */ jsxs("article", {
						className: "group relative rounded-2xl bg-gradient-to-b from-[#12141d] to-[#0c0e16] border border-white/10 overflow-hidden flex flex-col justify-between hover:border-accent/50 hover:shadow-[0_16px_36px_rgba(0,0,0,0.65),0_0_28px_rgba(251, 183, 24, 0.08)] transition-all duration-300 hover:-translate-y-1.5",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs(Link, {
							href: `/blog/${blog.slug}`,
							className: "block relative aspect-[16/9] overflow-hidden bg-neutral-950",
							children: [
								/* @__PURE__ */ jsx("img", {
									src: blog.cover_image,
									alt: blog.title,
									loading: "lazy",
									className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
								}),
								/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-[#12141d] via-black/25 to-transparent pointer-events-none" }),
								/* @__PURE__ */ jsxs("div", {
									className: "absolute top-2.5 left-2.5 flex flex-wrap items-center gap-1.5",
									children: [/* @__PURE__ */ jsx("span", {
										className: "bg-black/75 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/15 text-[10px] font-mono text-accent font-medium tracking-wide",
										children: blog.category?.name || "Blog"
									}), blog.subcategory && /* @__PURE__ */ jsx("span", {
										className: "bg-black/75 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 text-[10px] font-mono text-neutral-300",
										children: blog.subcategory.name
									})]
								}),
								blog.is_featured && /* @__PURE__ */ jsx("div", {
									className: "absolute top-2.5 right-2.5",
									children: /* @__PURE__ */ jsxs("span", {
										className: "bg-accent/15 backdrop-blur-md border border-accent/40 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold text-accent tracking-wider flex items-center gap-1",
										children: [/* @__PURE__ */ jsx(Sparkles, { className: "w-2.5 h-2.5 text-accent" }), "FEATURED"]
									})
								})
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "p-4 sm:p-5 space-y-2.5",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2.5 text-[11px] font-mono text-neutral-400",
									children: [blog.reading_time ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("span", {
										className: "flex items-center gap-1.5 text-neutral-300",
										children: [
											/* @__PURE__ */ jsx(Clock, { className: "w-3 h-3 text-accent" }),
											blog.reading_time,
											" min read"
										]
									}), /* @__PURE__ */ jsx("span", {
										className: "text-neutral-600",
										children: "•"
									})] }) : null, /* @__PURE__ */ jsxs("span", {
										className: "flex items-center gap-1 text-neutral-400",
										children: [/* @__PURE__ */ jsx(Calendar, { className: "w-3 h-3 text-neutral-500" }), new Date(blog.published_at).toLocaleDateString("en-US", {
											month: "short",
											day: "numeric",
											year: "numeric"
										})]
									})]
								}),
								/* @__PURE__ */ jsx("h3", {
									className: "text-base sm:text-lg font-display font-bold text-white group-hover:text-accent transition-colors leading-snug line-clamp-2",
									children: /* @__PURE__ */ jsx(Link, {
										href: `/blog/${blog.slug}`,
										children: blog.title
									})
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-neutral-400 text-xs sm:text-[13px] line-clamp-2 leading-relaxed",
									children: blog.excerpt
								}),
								Array.isArray(blog.tags) && blog.tags.length > 0 && /* @__PURE__ */ jsx("div", {
									className: "flex flex-wrap gap-1 pt-0.5",
									children: blog.tags.slice(0, 3).map((tag, i) => /* @__PURE__ */ jsxs("span", {
										className: "text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/5 text-neutral-400 hover:text-white transition-colors",
										children: ["#", tag]
									}, i))
								})
							]
						})] }), /* @__PURE__ */ jsxs("div", {
							className: "px-4 sm:px-5 py-2.5 border-t border-white/5 bg-[#0b0c12]/60 flex items-center justify-between mt-auto",
							children: [blog.author ? /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [blog.author.avatar ? /* @__PURE__ */ jsx("img", {
									src: blog.author.avatar,
									alt: blog.author.name,
									className: "w-5 h-5 rounded-full object-cover border border-accent/40"
								}) : /* @__PURE__ */ jsx("span", {
									className: "w-5 h-5 rounded-full bg-accent/10 text-accent border border-accent/30 flex items-center justify-center text-[9px] font-mono font-bold",
									children: blog.author.name.charAt(0)
								}), /* @__PURE__ */ jsx("span", {
									className: "text-xs font-mono text-neutral-300 truncate max-w-[180px]",
									children: blog.author.name
								})]
							}) : /* @__PURE__ */ jsx("span", {
								className: "text-xs font-mono text-neutral-500",
								children: "Editorial"
							}), /* @__PURE__ */ jsxs(Link, {
								href: `/blog/${blog.slug}`,
								className: "inline-flex items-center gap-1 text-xs font-mono font-bold text-accent group-hover:text-white transition-colors",
								children: [/* @__PURE__ */ jsx("span", { children: "Read" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" })]
							})]
						})]
					}, blog.id || blog.slug))
				})
			})
		})
	] });
}
//#endregion
export { Index as default };
