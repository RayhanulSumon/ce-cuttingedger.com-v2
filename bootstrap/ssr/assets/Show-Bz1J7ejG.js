import { t as SeoHead } from "./SeoHead-jRblvokC.js";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "@inertiajs/react";
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Calendar, Check, ChevronRight, Clock, Copy, CornerDownRight, ExternalLink, FileText, Quote, Share2, Sparkles, Tag } from "lucide-react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Blog/Show.tsx
/**
* Slugify a heading string into a valid URL anchor id
*/
function slugify(text) {
	return text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
/**
* Renders inline markdown text (bold, italic, links, inline code)
*/
function renderInlineFormatting(text) {
	return text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`|\[.*?\]\(.*?\))/g).map((part, index) => {
		if (part.startsWith("**") && part.endsWith("**")) return /* @__PURE__ */ jsx("strong", {
			className: "text-white font-semibold",
			children: part.slice(2, -2)
		}, index);
		if (part.startsWith("*") && part.endsWith("*")) return /* @__PURE__ */ jsx("em", {
			className: "italic text-neutral-200",
			children: part.slice(1, -1)
		}, index);
		if (part.startsWith("`") && part.endsWith("`")) return /* @__PURE__ */ jsx("code", {
			className: "px-1.5 py-0.5 rounded bg-[#12131a] text-accent border border-white/10 font-mono text-[0.875em]",
			children: part.slice(1, -1)
		}, index);
		const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
		if (linkMatch) {
			const [, linkText, linkUrl] = linkMatch;
			const isExternal = linkUrl.startsWith("http");
			return /* @__PURE__ */ jsxs("a", {
				href: linkUrl,
				target: isExternal ? "_blank" : void 0,
				rel: isExternal ? "noopener noreferrer" : void 0,
				className: "text-accent underline decoration-accent/40 hover:decoration-accent underline-offset-4 transition-colors font-medium inline-flex items-center gap-0.5",
				children: [/* @__PURE__ */ jsx("span", { children: linkText }), isExternal && /* @__PURE__ */ jsx(ExternalLink, { className: "w-3 h-3 inline-block" })]
			}, index);
		}
		return part;
	});
}
/**
* Interactive Code Snippet with Copy Confirmation
*/
function CodeBlock({ code, language }) {
	const [copied, setCopied] = useState(false);
	const handleCopy = () => {
		navigator.clipboard.writeText(code);
		setCopied(true);
		setTimeout(() => setCopied(false), 2e3);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "my-6 rounded-2xl overflow-hidden border border-white/10 bg-[#07080c] shadow-2xl group",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center justify-between px-4 py-2.5 bg-[#0d0f16] border-b border-white/10 text-xs font-mono text-neutral-400",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ jsxs("span", {
					className: "flex gap-1.5",
					children: [
						/* @__PURE__ */ jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-rose-500/80" }),
						/* @__PURE__ */ jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-amber-500/80" }),
						/* @__PURE__ */ jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-emerald-500/80" })
					]
				}), /* @__PURE__ */ jsx("span", {
					className: "ml-2 uppercase text-[11px] font-semibold text-accent",
					children: language || "CODE SNIPPET"
				})]
			}), /* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: handleCopy,
				className: "flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors cursor-pointer text-[11px]",
				title: "Copy snippet",
				children: copied ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Check, { className: "w-3.5 h-3.5 text-emerald-400" }), /* @__PURE__ */ jsx("span", {
					className: "text-emerald-400 font-bold",
					children: "Copied!"
				})] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Copy, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Copy" })] })
			})]
		}), /* @__PURE__ */ jsx("pre", {
			className: "p-5 font-mono text-xs sm:text-sm text-neutral-200 overflow-x-auto leading-relaxed",
			children: /* @__PURE__ */ jsx("code", { children: code })
		})]
	});
}
function Show({ blog, relatedBlogs = [] }) {
	const [copiedLink, setCopiedLink] = useState(false);
	const [readingProgress, setReadingProgress] = useState(0);
	const wordCount = useMemo(() => {
		if (!blog.body) return 0;
		return blog.body.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;
	}, [blog.body]);
	useEffect(() => {
		const handleScroll = () => {
			const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
			if (totalHeight > 0) {
				const progress = Math.min(100, Math.max(0, window.scrollY / totalHeight * 100));
				setReadingProgress(progress);
			}
		};
		window.addEventListener("scroll", handleScroll, { passive: true });
		handleScroll();
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);
	const handleCopyUrl = useCallback(() => {
		if (typeof window !== "undefined") {
			navigator.clipboard.writeText(window.location.href);
			setCopiedLink(true);
			setTimeout(() => setCopiedLink(false), 2200);
		}
	}, []);
	const shareUrl = typeof window !== "undefined" ? window.location.href : `https://cuttingedger.com/blog/${blog.slug}`;
	const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(shareUrl)}`;
	const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
	const formattedPublishDate = useMemo(() => {
		if (!blog.published_at) return "Draft Blog";
		return new Date(blog.published_at).toLocaleDateString("en-US", {
			month: "long",
			day: "numeric",
			year: "numeric"
		});
	}, [blog.published_at]);
	const articleJsonLd = {
		"@context": "https://schema.org",
		"@type": "Article",
		headline: blog.meta_title || blog.title,
		description: blog.meta_description || blog.excerpt,
		image: blog.og_image || blog.cover_image,
		keywords: blog.meta_keywords || (Array.isArray(blog.tags) ? blog.tags.join(", ") : ""),
		author: {
			"@type": "Person",
			name: blog.author?.name || "CuttingEdger Lead Architect"
		},
		publisher: {
			"@type": "Organization",
			name: "CuttingEdger",
			logo: {
				"@type": "ImageObject",
				url: "https://cuttingedger.com/logo.png"
			}
		},
		datePublished: blog.published_at,
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": blog.canonical_url || `https://cuttingedger.com/blog/${blog.slug}`
		}
	};
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(SeoHead, {
			title: blog.meta_title || blog.title,
			description: blog.meta_description || blog.excerpt,
			keywords: blog.meta_keywords,
			robots: blog.robots || "index, follow",
			canonicalUrl: blog.canonical_url || `https://cuttingedger.com/blog/${blog.slug}`,
			image: blog.og_image || blog.cover_image,
			type: "article",
			jsonLd: articleJsonLd
		}),
		/* @__PURE__ */ jsx("div", {
			className: "fixed top-0 left-0 right-0 h-[3px] bg-transparent z-[60] pointer-events-none",
			children: /* @__PURE__ */ jsx("div", {
				className: "h-full bg-accent shadow-[0_0_12px_rgba(251, 183, 24, 0.8)] transition-all duration-100 ease-out",
				style: { width: `${readingProgress}%` }
			})
		}),
		/* @__PURE__ */ jsxs("header", {
			className: "relative pt-24 sm:pt-28 pb-8 sm:pb-10 bg-[#0a0b0e] border-b border-white/10 overflow-hidden",
			children: [
				/* @__PURE__ */ jsx("div", { className: "absolute -top-24 left-1/2 -translate-x-1/2 w-[750px] h-[320px] bg-gradient-to-b from-accent/15 via-accent/5 to-transparent rounded-full blur-[110px] pointer-events-none" }),
				/* @__PURE__ */ jsx("div", { className: "absolute top-1/4 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-[130px] pointer-events-none" }),
				/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(251, 183, 24, 0.06),rgba(255,255,255,0))] pointer-events-none" }),
				/* @__PURE__ */ jsxs("div", {
					className: "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap items-center justify-between gap-3 mb-4 text-xs font-mono",
							children: [/* @__PURE__ */ jsxs(Link, {
								href: "/blog",
								className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition-all group shadow-xs text-[11px]",
								children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "w-3 h-3 text-accent group-hover:-translate-x-1 transition-transform" }), /* @__PURE__ */ jsx("span", { children: "Return to Blog" })]
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2 text-neutral-400 bg-black/40 px-3 py-1 rounded-full border border-white/5 backdrop-blur-xs text-[11px]",
								children: [
									/* @__PURE__ */ jsx(Link, {
										href: "/",
										className: "text-accent hover:underline font-medium transition-colors",
										children: "Home"
									}),
									/* @__PURE__ */ jsx(ChevronRight, { className: "w-3 h-3 text-neutral-600" }),
									/* @__PURE__ */ jsx(Link, {
										href: "/blog",
										className: "text-white/90 hover:text-white transition-colors",
										children: "Blog"
									}),
									blog.category && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(ChevronRight, { className: "w-3 h-3 text-neutral-600" }), /* @__PURE__ */ jsx(Link, {
										href: `/blog?category=${blog.category.slug}`,
										className: "text-accent hover:underline",
										children: blog.category.name
									})] })
								]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap items-center gap-2 mb-3.5",
							children: [
								blog.category && /* @__PURE__ */ jsxs(Link, {
									href: `/blog?category=${blog.category.slug}`,
									className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase bg-accent/10 text-accent border border-accent/30 hover:bg-accent hover:text-black transition-all shadow-[0_0_12px_rgba(245,166,35,0.15)] group",
									children: [/* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_6px_var(--color-accent)] group-hover:bg-black transition-colors" }), /* @__PURE__ */ jsx("span", { children: blog.category.name })]
								}),
								blog.subcategory && /* @__PURE__ */ jsxs("span", {
									className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono tracking-wider uppercase bg-white/[0.04] text-neutral-300 border border-white/10 backdrop-blur-xs",
									children: [/* @__PURE__ */ jsx(CornerDownRight, { className: "w-3 h-3 text-accent" }), /* @__PURE__ */ jsx("span", { children: blog.subcategory.name })]
								}),
								blog.is_featured && /* @__PURE__ */ jsxs("span", {
									className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase bg-amber-400/10 text-amber-300 border border-amber-400/30 shadow-[0_0_12px_rgba(251,191,36,0.15)]",
									children: [/* @__PURE__ */ jsx(Sparkles, { className: "w-3 h-3 text-amber-300" }), /* @__PURE__ */ jsx("span", { children: "FEATURED BLOG" })]
								})
							]
						}),
						/* @__PURE__ */ jsx("h1", {
							className: "text-2xl sm:text-4xl lg:text-[42px] font-display font-extrabold tracking-tight leading-[1.14] max-w-3xl bg-gradient-to-br from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent",
							children: blog.title
						}),
						blog.excerpt && /* @__PURE__ */ jsxs("div", {
							className: "relative mt-4 sm:mt-5 p-4 sm:p-5 rounded-xl bg-gradient-to-r from-accent/[0.08] via-white/[0.02] to-transparent border-l-4 border-accent border-y border-r border-white/10 backdrop-blur-md shadow-md max-w-3xl",
							children: [/* @__PURE__ */ jsxs("span", {
								className: "text-[9px] font-mono text-accent uppercase tracking-widest block mb-1 font-bold flex items-center gap-1.5",
								children: [/* @__PURE__ */ jsx(Quote, { className: "w-2.5 h-2.5 rotate-180 inline-block text-accent" }), "EXECUTIVE SYNOPSIS"]
							}), /* @__PURE__ */ jsx("p", {
								className: "text-sm sm:text-base text-neutral-200 font-light leading-relaxed",
								children: blog.excerpt
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-5 sm:mt-6 p-2.5 sm:p-3 px-4 rounded-xl bg-[#0e1017]/90 border border-white/10 backdrop-blur-xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4",
							children: [
								blog.author ? /* @__PURE__ */ jsxs(Link, {
									href: `/team/${blog.author.slug}`,
									className: "group flex items-center gap-3 text-left shrink-0",
									children: [blog.author.avatar ? /* @__PURE__ */ jsxs("div", {
										className: "relative",
										children: [/* @__PURE__ */ jsx("img", {
											src: blog.author.avatar,
											alt: blog.author.name,
											className: "w-9 h-9 rounded-full object-cover border border-accent/40 group-hover:border-accent transition-colors shadow-[0_0_8px_rgba(251, 183, 24, 0.2)]"
										}), /* @__PURE__ */ jsx("span", {
											className: "absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-[#0e1017]",
											title: "Verified Author"
										})]
									}) : /* @__PURE__ */ jsx("div", {
										className: "w-9 h-9 rounded-full bg-accent/10 border border-accent/40 flex items-center justify-center text-accent font-mono font-bold text-xs shadow-[0_0_8px_rgba(251, 183, 24, 0.15)]",
										children: blog.author.name.charAt(0)
									}), /* @__PURE__ */ jsxs("div", {
										className: "space-y-0.5",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "text-xs sm:text-sm font-display font-bold text-white group-hover:text-accent transition-colors flex items-center gap-1",
											children: [/* @__PURE__ */ jsx("span", { children: blog.author.name }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-accent" })]
										}), /* @__PURE__ */ jsx("div", {
											className: "text-[10px] font-mono text-neutral-400",
											children: blog.author.role
										})]
									})]
								}) : /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2.5 shrink-0",
									children: [/* @__PURE__ */ jsx("div", {
										className: "w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-accent font-mono font-bold text-[10px]",
										children: "CE"
									}), /* @__PURE__ */ jsx("div", {
										className: "text-[11px] font-mono text-neutral-400",
										children: "Editorial Team • CuttingEdger"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center flex-wrap gap-2 text-[11px] font-mono text-neutral-300 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5",
									children: [
										/* @__PURE__ */ jsxs("span", {
											className: "flex items-center gap-1.5",
											children: [/* @__PURE__ */ jsx(Calendar, { className: "w-3 h-3 text-accent" }), /* @__PURE__ */ jsx("span", { children: formattedPublishDate })]
										}),
										/* @__PURE__ */ jsx("span", {
											className: "text-neutral-600 font-bold",
											children: "•"
										}),
										/* @__PURE__ */ jsxs("span", {
											className: "flex items-center gap-1.5",
											children: [/* @__PURE__ */ jsx(Clock, { className: "w-3 h-3 text-accent" }), /* @__PURE__ */ jsxs("span", { children: [blog.reading_time || 5, " min read"] })]
										}),
										wordCount > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", {
											className: "text-neutral-600 font-bold",
											children: "•"
										}), /* @__PURE__ */ jsxs("span", {
											className: "flex items-center gap-1.5",
											children: [/* @__PURE__ */ jsx(FileText, { className: "w-3 h-3 text-neutral-400" }), /* @__PURE__ */ jsxs("span", { children: [wordCount.toLocaleString(), " words"] })]
										})] })
									]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-1.5 shrink-0",
									children: [
										/* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: handleCopyUrl,
											className: "h-8 px-3 rounded-lg bg-white/5 hover:bg-accent text-neutral-200 hover:text-black border border-white/10 hover:border-accent font-mono text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs group",
											title: "Copy article URL",
											children: copiedLink ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Check, { className: "w-3 h-3 text-emerald-400 group-hover:text-black" }), /* @__PURE__ */ jsx("span", {
												className: "text-emerald-400 group-hover:text-black font-bold",
												children: "Copied!"
											})] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Copy, { className: "w-3 h-3 text-accent group-hover:text-black" }), /* @__PURE__ */ jsx("span", { children: "Copy Link" })] })
										}),
										/* @__PURE__ */ jsx("a", {
											href: twitterShareUrl,
											target: "_blank",
											rel: "noopener noreferrer",
											className: "w-8 h-8 rounded-lg bg-white/5 hover:bg-accent text-neutral-300 hover:text-black border border-white/10 hover:border-accent flex items-center justify-center transition-all cursor-pointer shadow-xs",
											title: "Share on X (Twitter)",
											"aria-label": "Share on X",
											children: /* @__PURE__ */ jsx("svg", {
												viewBox: "0 0 24 24",
												fill: "currentColor",
												className: "w-3 h-3",
												children: /* @__PURE__ */ jsx("path", { d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" })
											})
										}),
										/* @__PURE__ */ jsx("a", {
											href: linkedinShareUrl,
											target: "_blank",
											rel: "noopener noreferrer",
											className: "w-8 h-8 rounded-lg bg-white/5 hover:bg-accent text-neutral-300 hover:text-black border border-white/10 hover:border-accent flex items-center justify-center transition-all cursor-pointer shadow-xs",
											title: "Share on LinkedIn",
											"aria-label": "Share on LinkedIn",
											children: /* @__PURE__ */ jsx("svg", {
												viewBox: "0 0 24 24",
												fill: "currentColor",
												className: "w-3 h-3",
												children: /* @__PURE__ */ jsx("path", { d: "M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.3a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" })
											})
										})
									]
								})
							]
						})
					]
				})
			]
		}),
		/* @__PURE__ */ jsx("main", {
			className: "py-10 lg:py-14 bg-[#0a0b0e]",
			children: /* @__PURE__ */ jsx("div", {
				className: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8",
				children: /* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start",
					children: [/* @__PURE__ */ jsxs("article", {
						className: "lg:col-span-8 space-y-8",
						children: [
							blog.cover_image && /* @__PURE__ */ jsxs("div", {
								className: "relative group",
								children: [/* @__PURE__ */ jsx("div", { className: "absolute -inset-1 bg-gradient-to-r from-accent/15 via-cyan-500/10 to-accent/15 rounded-2xl sm:rounded-3xl blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-700 pointer-events-none" }), /* @__PURE__ */ jsxs("div", {
									className: "relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-[16/9] border border-white/15 bg-neutral-950 shadow-[0_16px_40px_rgba(0,0,0,0.7)]",
									children: [/* @__PURE__ */ jsx("img", {
										src: blog.cover_image,
										alt: blog.title,
										className: "w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.01]"
									}), /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" })]
								})]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "space-y-6 text-neutral-200 font-sans text-base sm:text-lg lg:text-[19px] leading-[1.8] font-normal",
								children: blog.body.split("\n\n").map((block, idx) => {
									const trimmed = block.trim();
									if (!trimmed) return null;
									if (trimmed.startsWith("<") && trimmed.endsWith(">")) return /* @__PURE__ */ jsx("div", {
										dangerouslySetInnerHTML: { __html: trimmed },
										className: "prose-html space-y-4"
									}, idx);
									if (trimmed.startsWith("# ")) {
										const headingText = trimmed.replace(/^#\s+/, "");
										const headingId = slugify(headingText);
										return /* @__PURE__ */ jsxs("h2", {
											id: headingId,
											className: "scroll-mt-32 text-2xl sm:text-4xl font-display font-extrabold text-white pt-8 pb-3 border-b border-white/10 group flex items-center justify-between",
											children: [/* @__PURE__ */ jsx("span", { children: headingText }), /* @__PURE__ */ jsx("a", {
												href: `#${headingId}`,
												className: "opacity-0 group-hover:opacity-100 text-accent text-sm font-mono transition-opacity ml-2",
												title: "Direct section link",
												children: "#"
											})]
										}, idx);
									}
									if (trimmed.startsWith("## ")) {
										const headingText = trimmed.replace(/^##\s+/, "");
										const headingId = slugify(headingText);
										return /* @__PURE__ */ jsxs("h3", {
											id: headingId,
											className: "scroll-mt-32 text-xl sm:text-2xl lg:text-3xl font-display font-bold text-white pt-6 pb-1 text-accent group flex items-center justify-between",
											children: [/* @__PURE__ */ jsx("span", { children: headingText }), /* @__PURE__ */ jsx("a", {
												href: `#${headingId}`,
												className: "opacity-0 group-hover:opacity-100 text-accent text-xs font-mono transition-opacity ml-2",
												title: "Direct section link",
												children: "#"
											})]
										}, idx);
									}
									if (trimmed.startsWith("### ")) {
										const headingText = trimmed.replace(/^###\s+/, "");
										const headingId = slugify(headingText);
										return /* @__PURE__ */ jsx("h4", {
											id: headingId,
											className: "scroll-mt-32 text-lg sm:text-xl font-display font-semibold text-white pt-4",
											children: headingText
										}, idx);
									}
									if (trimmed.startsWith("> ")) {
										const quoteText = trimmed.replace(/^>\s+/, "");
										return /* @__PURE__ */ jsxs("blockquote", {
											className: "relative my-8 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-accent/10 via-white/[0.02] to-transparent border-l-4 border-accent border-y border-r border-white/5",
											children: [/* @__PURE__ */ jsx(Quote, { className: "w-8 h-8 text-accent/40 absolute top-4 right-4 pointer-events-none" }), /* @__PURE__ */ jsxs("p", {
												className: "font-display italic text-lg sm:text-xl text-neutral-100 leading-relaxed",
												children: [
													"“",
													quoteText,
													"”"
												]
											})]
										}, idx);
									}
									if (trimmed.startsWith("```")) {
										const firstLineEnd = trimmed.indexOf("\n");
										const lang = firstLineEnd !== -1 ? trimmed.slice(3, firstLineEnd).trim() : "";
										const codeContent = trimmed.replace(/^```[a-z]*\n?/, "").replace(/\n?```$/, "");
										return /* @__PURE__ */ jsx(CodeBlock, {
											code: codeContent,
											language: lang
										}, idx);
									}
									if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
										const items = trimmed.split("\n").map((l) => l.replace(/^[-*]\s+/, "").trim()).filter(Boolean);
										return /* @__PURE__ */ jsx("ul", {
											className: "my-6 space-y-3 pl-2",
											children: items.map((item, itemIdx) => /* @__PURE__ */ jsxs("li", {
												className: "flex items-start gap-3 text-neutral-300",
												children: [/* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-accent mt-2.5 shrink-0 shadow-[0_0_6px_var(--color-accent)]" }), /* @__PURE__ */ jsx("span", {
													className: "flex-1",
													children: renderInlineFormatting(item)
												})]
											}, itemIdx))
										}, idx);
									}
									return /* @__PURE__ */ jsx("p", {
										className: "leading-relaxed",
										children: renderInlineFormatting(trimmed)
									}, idx);
								})
							}),
							Array.isArray(blog.tags) && blog.tags.length > 0 && /* @__PURE__ */ jsxs("div", {
								className: "mt-14 pt-8 border-t border-white/10 space-y-3",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-400",
									children: [/* @__PURE__ */ jsx(Tag, { className: "w-3.5 h-3.5 text-accent" }), /* @__PURE__ */ jsx("span", { children: "Categorized Topics & Tags" })]
								}), /* @__PURE__ */ jsx("div", {
									className: "flex flex-wrap gap-2",
									children: blog.tags.map((tag, i) => /* @__PURE__ */ jsxs(Link, {
										href: `/blog?category=all`,
										className: "px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-accent/10 border border-white/10 hover:border-accent/40 text-neutral-300 hover:text-accent font-mono text-xs transition-all",
										children: ["#", tag]
									}, i))
								})]
							}),
							blog.author && /* @__PURE__ */ jsxs("div", {
								className: "mt-14 p-8 rounded-3xl bg-gradient-to-br from-[#12141c] via-[#0d0f15] to-[#0a0b0e] border border-white/10 shadow-2xl relative overflow-hidden group",
								children: [/* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[80px] pointer-events-none" }), /* @__PURE__ */ jsxs("div", {
									className: "flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10 text-center sm:text-left",
									children: [blog.author.avatar ? /* @__PURE__ */ jsx("img", {
										src: blog.author.avatar,
										alt: blog.author.name,
										className: "w-20 h-20 rounded-2xl object-cover border-2 border-accent/40 group-hover:border-accent transition-colors shrink-0 shadow-xl"
									}) : /* @__PURE__ */ jsx("div", {
										className: "w-20 h-20 rounded-2xl bg-accent/10 border border-accent/40 flex items-center justify-center text-accent font-mono font-bold text-xl shrink-0",
										children: blog.author.name.charAt(0)
									}), /* @__PURE__ */ jsxs("div", {
										className: "space-y-3 flex-1 min-w-0",
										children: [
											/* @__PURE__ */ jsxs("div", {
												className: "space-y-1",
												children: [/* @__PURE__ */ jsx("h3", {
													className: "font-display font-extrabold text-2xl text-white",
													children: blog.author.name
												}), /* @__PURE__ */ jsx("p", {
													className: "text-xs font-mono text-neutral-400",
													children: blog.author.role
												})]
											}),
											blog.author.bio && /* @__PURE__ */ jsx("p", {
												className: "text-sm text-neutral-300 leading-relaxed",
												children: blog.author.bio
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3",
												children: [
													/* @__PURE__ */ jsxs(Link, {
														href: `/team/${blog.author.slug}`,
														className: "inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-accent text-black font-mono text-xs font-bold hover:bg-[#b8dd00] transition-all shadow-md",
														children: [/* @__PURE__ */ jsx("span", { children: "View Member Profile" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-3.5 h-3.5" })]
													}),
													blog.author.social_links?.twitter && /* @__PURE__ */ jsx("a", {
														href: blog.author.social_links.twitter,
														target: "_blank",
														rel: "noopener noreferrer",
														className: "w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 transition-colors",
														"aria-label": "Author Twitter",
														children: /* @__PURE__ */ jsx("svg", {
															viewBox: "0 0 24 24",
															fill: "currentColor",
															className: "w-3.5 h-3.5",
															children: /* @__PURE__ */ jsx("path", { d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" })
														})
													}),
													blog.author.social_links?.linkedin && /* @__PURE__ */ jsx("a", {
														href: blog.author.social_links.linkedin,
														target: "_blank",
														rel: "noopener noreferrer",
														className: "w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 transition-colors",
														"aria-label": "Author LinkedIn",
														children: /* @__PURE__ */ jsx("svg", {
															viewBox: "0 0 24 24",
															fill: "currentColor",
															className: "w-3.5 h-3.5",
															children: /* @__PURE__ */ jsx("path", { d: "M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.3a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" })
														})
													})
												]
											})
										]
									})]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-14 p-6 sm:p-8 rounded-3xl bg-[#0e1017] border border-white/10 shadow-xl space-y-6 relative overflow-hidden group",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ jsx("div", {
											className: "w-9 h-9 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent shrink-0",
											children: /* @__PURE__ */ jsx(Share2, { className: "w-4 h-4" })
										}), /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h4", {
											className: "font-display font-bold text-xl text-white",
											children: "Share Article"
										}) })]
									}), /* @__PURE__ */ jsx("p", {
										className: "text-xs text-neutral-400 font-mono",
										children: "Distribute this blog across your network"
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "grid grid-cols-1 sm:grid-cols-3 gap-3",
									children: [
										/* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: handleCopyUrl,
											className: "h-11 rounded-xl bg-white/5 hover:bg-accent text-neutral-200 hover:text-black border border-white/10 hover:border-accent font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm group",
											children: copiedLink ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Check, { className: "w-4 h-4 text-emerald-400 group-hover:text-black" }), /* @__PURE__ */ jsx("span", {
												className: "text-emerald-400 group-hover:text-black font-bold",
												children: "Link Copied!"
											})] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Copy, { className: "w-4 h-4 text-accent group-hover:text-black" }), /* @__PURE__ */ jsx("span", { children: "Copy Link" })] })
										}),
										/* @__PURE__ */ jsxs("a", {
											href: twitterShareUrl,
											target: "_blank",
											rel: "noopener noreferrer",
											className: "h-11 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 hover:border-white/20 font-mono text-xs flex items-center justify-center gap-2 transition-all",
											children: [/* @__PURE__ */ jsx("svg", {
												viewBox: "0 0 24 24",
												fill: "currentColor",
												className: "w-3.5 h-3.5",
												children: /* @__PURE__ */ jsx("path", { d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" })
											}), /* @__PURE__ */ jsx("span", { children: "Share on X" })]
										}),
										/* @__PURE__ */ jsxs("a", {
											href: linkedinShareUrl,
											target: "_blank",
											rel: "noopener noreferrer",
											className: "h-11 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 hover:border-white/20 font-mono text-xs flex items-center justify-center gap-2 transition-all",
											children: [/* @__PURE__ */ jsx("svg", {
												viewBox: "0 0 24 24",
												fill: "currentColor",
												className: "w-3.5 h-3.5",
												children: /* @__PURE__ */ jsx("path", { d: "M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.3a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" })
											}), /* @__PURE__ */ jsx("span", { children: "Share on LinkedIn" })]
										})
									]
								})]
							})
						]
					}), /* @__PURE__ */ jsx("aside", {
						className: "lg:col-span-4 sticky top-28 space-y-6",
						children: /* @__PURE__ */ jsxs("div", {
							className: "p-6 rounded-3xl bg-[#0e1017] border border-white/10 shadow-2xl relative overflow-hidden space-y-5",
							children: [
								/* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-44 h-44 bg-accent/5 rounded-full blur-[60px] pointer-events-none" }),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between pb-4 border-b border-white/10 relative z-10",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2.5",
										children: [/* @__PURE__ */ jsx("div", {
											className: "w-8 h-8 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center text-accent",
											children: /* @__PURE__ */ jsx(BookOpen, { className: "w-4 h-4" })
										}), /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h3", {
											className: "font-display font-bold text-base text-white",
											children: "Other Blogs"
										}) })]
									}), /* @__PURE__ */ jsxs(Link, {
										href: "/blog",
										className: "text-[11px] font-mono text-neutral-400 hover:text-accent flex items-center gap-1 transition-colors",
										children: [/* @__PURE__ */ jsx("span", { children: "View All" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-3 h-3" })]
									})]
								}),
								/* @__PURE__ */ jsx("div", {
									className: "space-y-3 relative z-10",
									children: relatedBlogs.length > 0 ? relatedBlogs.map((otherBlog) => /* @__PURE__ */ jsxs(Link, {
										href: `/blog/${otherBlog.slug}`,
										className: "group flex gap-3.5 p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-accent/40 transition-all duration-300",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "w-20 h-20 rounded-xl overflow-hidden bg-neutral-900 border border-white/10 shrink-0 relative",
											children: [otherBlog.cover_image ? /* @__PURE__ */ jsx("img", {
												src: otherBlog.cover_image,
												alt: otherBlog.title,
												className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
											}) : /* @__PURE__ */ jsx("div", {
												className: "w-full h-full bg-neutral-900 flex items-center justify-center text-neutral-600",
												children: /* @__PURE__ */ jsx(FileText, { className: "w-5 h-5" })
											}), otherBlog.category && /* @__PURE__ */ jsx("span", {
												className: "absolute bottom-1 left-1 right-1 px-1 py-0.5 rounded bg-black/80 backdrop-blur-xs text-[8px] font-mono text-accent uppercase tracking-wider truncate text-center",
												children: otherBlog.category.name
											})]
										}), /* @__PURE__ */ jsxs("div", {
											className: "flex-1 min-w-0 flex flex-col justify-between py-0.5",
											children: [/* @__PURE__ */ jsxs("div", {
												className: "space-y-1",
												children: [/* @__PURE__ */ jsxs("div", {
													className: "flex items-center gap-1.5 text-[10px] font-mono text-neutral-400",
													children: [
														/* @__PURE__ */ jsx(Clock, { className: "w-3 h-3 text-accent" }),
														/* @__PURE__ */ jsxs("span", { children: [otherBlog.reading_time || 5, "m read"] }),
														otherBlog.author && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", { children: "•" }), /* @__PURE__ */ jsx("span", {
															className: "truncate",
															children: otherBlog.author.name
														})] })
													]
												}), /* @__PURE__ */ jsx("h4", {
													className: "font-display font-bold text-xs sm:text-sm text-neutral-100 group-hover:text-accent transition-colors line-clamp-2 leading-snug",
													children: otherBlog.title
												})]
											}), /* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-1 text-[10px] font-mono text-neutral-400 group-hover:text-white transition-colors pt-1",
												children: [/* @__PURE__ */ jsx("span", { children: "Read Article" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-3 h-3 text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" })]
											})]
										})]
									}, otherBlog.id)) : /* @__PURE__ */ jsxs("div", {
										className: "p-6 text-center space-y-3 rounded-2xl bg-white/[0.02] border border-white/5",
										children: [/* @__PURE__ */ jsx(BookOpen, { className: "w-8 h-8 text-neutral-600 mx-auto" }), /* @__PURE__ */ jsx("p", {
											className: "text-xs font-mono text-neutral-400",
											children: "No additional blogs available."
										})]
									})
								}),
								/* @__PURE__ */ jsx("div", {
									className: "pt-2 relative z-10",
									children: /* @__PURE__ */ jsxs(Link, {
										href: "/blog",
										className: "w-full h-10 rounded-xl bg-white/5 hover:bg-accent text-neutral-300 hover:text-black border border-white/10 hover:border-accent font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all duration-300 group",
										children: [/* @__PURE__ */ jsx("span", { children: "Explore Complete Journal" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-3.5 h-3.5 text-accent group-hover:text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" })]
									})
								})
							]
						})
					})]
				})
			})
		}),
		/* @__PURE__ */ jsxs("section", {
			className: "py-16 sm:py-20 bg-[#07080b] border-t border-white/10 relative overflow-hidden",
			children: [/* @__PURE__ */ jsx("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[250px] bg-gradient-to-r from-accent/10 to-cyan-500/10 rounded-full blur-[140px] pointer-events-none" }), /* @__PURE__ */ jsxs("div", {
				className: "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-neutral-300",
						children: [/* @__PURE__ */ jsx(Sparkles, { className: "w-3.5 h-3.5 text-accent" }), /* @__PURE__ */ jsx("span", { children: "CONTINUE EXPLORING ARCHITECTURAL BLOGS" })]
					}),
					/* @__PURE__ */ jsx("h2", {
						className: "text-2xl sm:text-4xl font-display font-extrabold text-white tracking-tight",
						children: "Dive Deeper Into Kinetic Code & Brand Gravity"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "max-w-2xl mx-auto text-sm sm:text-base text-neutral-400 font-light leading-relaxed",
						children: "Browse our full archive of long-form essays, system post-mortems, and engineering manifestos."
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "pt-2 flex flex-wrap items-center justify-center gap-3",
						children: [/* @__PURE__ */ jsxs(Link, {
							href: "/blog",
							className: "px-6 py-3 rounded-full bg-accent hover:bg-[#b8dd00] text-black font-mono text-xs font-bold transition-all shadow-[0_0_20px_rgba(251, 183, 24, 0.3)] inline-flex items-center gap-2",
							children: [/* @__PURE__ */ jsx("span", { children: "Browse All Blogs" }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4" })]
						}), blog.category && /* @__PURE__ */ jsxs(Link, {
							href: `/blog?category=${blog.category.slug}`,
							className: "px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-200 hover:text-white font-mono text-xs font-medium transition-all inline-flex items-center gap-2",
							children: [/* @__PURE__ */ jsxs("span", { children: ["More in ", blog.category.name] }), /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4 text-accent" })]
						})]
					})
				]
			})]
		})
	] });
}
//#endregion
export { Show as default };
