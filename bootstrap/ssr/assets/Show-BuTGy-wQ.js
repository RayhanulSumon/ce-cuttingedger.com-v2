import { t as SeoHead } from "./SeoHead-CXtfHcil.js";
import { t as PageHero } from "./PageHero-KJiKVDpm.js";
import "react";
import { Link } from "@inertiajs/react";
import { Calendar, Clock } from "lucide-react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Blog/Show.tsx
function Show({ post, relatedPosts = [] }) {
	const articleJsonLd = {
		"@context": "https://schema.org",
		"@type": "Article",
		headline: post.title,
		description: post.excerpt,
		image: post.cover_image,
		author: {
			"@type": "Person",
			name: post.author?.name || "CuttingEdger Lead"
		},
		publisher: {
			"@type": "Organization",
			name: "CuttingEdger",
			logo: {
				"@type": "ImageObject",
				url: "https://cuttingedger.com/logo.png"
			}
		},
		datePublished: post.published_at
	};
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(SeoHead, {
			title: post.title,
			description: post.excerpt,
			image: post.cover_image,
			type: "article",
			jsonLd: articleJsonLd
		}),
		/* @__PURE__ */ jsx(PageHero, {
			eyebrow: `DISPATCH // ${post.category?.name || "THEORY"}`,
			title: post.title,
			description: post.excerpt,
			backUrl: "/blog",
			backLabel: "Back to Journal"
		}),
		/* @__PURE__ */ jsx("section", {
			className: "py-6 bg-[#0c0d12] border-b border-white/10",
			children: /* @__PURE__ */ jsx("div", {
				className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8",
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-neutral-400",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-6",
						children: [/* @__PURE__ */ jsxs("span", {
							className: "flex items-center gap-1.5",
							children: [
								/* @__PURE__ */ jsx(Clock, { className: "w-4 h-4 text-[#d4ff00]" }),
								post.reading_time,
								" min read"
							]
						}), /* @__PURE__ */ jsxs("span", {
							className: "flex items-center gap-1.5",
							children: [/* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4 text-[#d4ff00]" }), new Date(post.published_at).toLocaleDateString("en-US", {
								month: "long",
								day: "numeric",
								year: "numeric"
							})]
						})]
					}), post.author && /* @__PURE__ */ jsxs(Link, {
						href: `/team/${post.author.slug}`,
						className: "flex items-center gap-2 hover:text-[#d4ff00] transition-colors",
						children: [/* @__PURE__ */ jsx("img", {
							src: post.author.avatar,
							alt: post.author.name,
							className: "w-6 h-6 rounded-full object-cover border border-white/10"
						}), /* @__PURE__ */ jsxs("span", { children: [
							post.author.name,
							" (",
							post.author.role,
							")"
						] })]
					})]
				})
			})
		}),
		/* @__PURE__ */ jsx("section", {
			className: "py-12 bg-[#0a0b0e]",
			children: /* @__PURE__ */ jsx("div", {
				className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8",
				children: /* @__PURE__ */ jsx("div", {
					className: "rounded-3xl overflow-hidden aspect-[16/9] border border-white/10 bg-neutral-900 shadow-2xl",
					children: /* @__PURE__ */ jsx("img", {
						src: post.cover_image,
						alt: post.title,
						className: "w-full h-full object-cover"
					})
				})
			})
		}),
		/* @__PURE__ */ jsx("article", {
			className: "py-12 bg-[#0a0b0e]",
			children: /* @__PURE__ */ jsxs("div", {
				className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8",
				children: [/* @__PURE__ */ jsx("div", {
					className: "prose prose-invert prose-lg max-w-none text-neutral-300 leading-relaxed space-y-6",
					children: post.body.split("\n\n").map((paragraph, idx) => /* @__PURE__ */ jsx("p", {
						className: "text-lg sm:text-xl font-normal leading-relaxed",
						children: paragraph
					}, idx))
				}), post.author && /* @__PURE__ */ jsxs("div", {
					className: "mt-16 p-8 rounded-3xl bg-[#12141c] border border-white/10 flex flex-col sm:flex-row items-center sm:items-start gap-6",
					children: [/* @__PURE__ */ jsx("img", {
						src: post.author.avatar,
						alt: post.author.name,
						className: "w-16 h-16 rounded-2xl object-cover border border-[#d4ff00]/40 shrink-0"
					}), /* @__PURE__ */ jsxs("div", {
						className: "space-y-2 text-center sm:text-left",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "font-mono text-xs uppercase tracking-widest text-[#d4ff00]",
								children: "Written By"
							}),
							/* @__PURE__ */ jsx("h4", {
								className: "font-display font-bold text-xl text-white",
								children: post.author.name
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-sm text-neutral-400",
								children: post.author.bio
							})
						]
					})]
				})]
			})
		}),
		relatedPosts.length > 0 && /* @__PURE__ */ jsx("section", {
			className: "py-24 bg-[#0c0d12] border-t border-white/10",
			children: /* @__PURE__ */ jsxs("div", {
				className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between mb-12",
					children: [/* @__PURE__ */ jsx("span", {
						className: "font-mono text-xs uppercase tracking-widest text-[#d4ff00]",
						children: "[ CONTINUED READING ]"
					}), /* @__PURE__ */ jsx(Link, {
						href: "/blog",
						className: "font-mono text-xs uppercase tracking-widest text-neutral-400 hover:text-[#d4ff00] transition-colors",
						children: "All Journal Entries →"
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-1 md:grid-cols-2 gap-8",
					children: relatedPosts.map((rel) => /* @__PURE__ */ jsxs(Link, {
						href: `/blog/${rel.slug}`,
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
							children: [/* @__PURE__ */ jsxs("span", {
								className: "text-xs font-mono text-neutral-400 block mb-1",
								children: [rel.reading_time, " min read"]
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
