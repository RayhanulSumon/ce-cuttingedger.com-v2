import { n as Button, t as Input } from "./input-lL3MBuxn.js";
import { t as Textarea } from "./textarea-DNOgnKpG.js";
import { t as Badge } from "./badge-BgjwAGBP.js";
import { t as $ } from "./dist-CEcKwvhn.js";
import { t as Switch } from "./switch-7-Y_VisU.js";
import { a as SelectLabel, i as SelectItem, n as SelectContent, o as SelectTrigger, r as SelectGroup, s as SelectValue, t as Select } from "./select-DJUEkoYA.js";
import React, { useEffect, useRef, useState } from "react";
import { Link, useForm } from "@inertiajs/react";
import { AlertCircle, ArrowLeft, Bold, Bot, Check, CheckCircle2, Code, Copy, CornerDownRight, ExternalLink, Eye, FileText, FolderKanban, Globe, Heading1, Heading2, Heading3, Image, Italic, Layers, Link as Link$1, List, ListOrdered, Loader2, Minus, Quote, Save, Search, Sparkles, Tag, Trash2, UploadCloud, User, X } from "lucide-react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Components/Admin/UI/RichContentEditor.tsx
function RichContentEditor({ value, onChange, placeholder = "Draft article content with rich markdown & html formatting..." }) {
	const textareaRef = useRef(null);
	const insertFormatting = (prefix, suffix = "", defaultText = "") => {
		const textarea = textareaRef.current;
		if (!textarea) return;
		const start = textarea.selectionStart;
		const end = textarea.selectionEnd;
		const selectedText = value.substring(start, end) || defaultText;
		const replacement = `${prefix}${selectedText}${suffix}`;
		onChange(value.substring(0, start) + replacement + value.substring(end));
		setTimeout(() => {
			textarea.focus();
			textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
		}, 10);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "border border-white/10 rounded-md overflow-hidden bg-[#0c0d12] focus-within:border-accent transition-colors",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center gap-1 p-2 bg-[#12131a] border-b border-white/10",
				children: [/* @__PURE__ */ jsx("span", {
					className: "text-[10px] font-mono font-bold text-accent uppercase tracking-wider px-2 py-0.5 border border-accent/30 rounded bg-accent/10 mr-1",
					children: "RICH EDITOR"
				}), [
					{
						icon: Bold,
						title: "Bold (**text**)",
						action: () => insertFormatting("**", "**", "bold text")
					},
					{
						icon: Italic,
						title: "Italic (*text*)",
						action: () => insertFormatting("*", "*", "italic text")
					},
					{
						icon: Heading1,
						title: "Heading 1 (# Title)",
						action: () => insertFormatting("\n# ", "\n", "Main Section Heading")
					},
					{
						icon: Heading2,
						title: "Heading 2 (## Subhead)",
						action: () => insertFormatting("\n## ", "\n", "Subsection Title")
					},
					{
						icon: Heading3,
						title: "Heading 3 (### Sub-bullet)",
						action: () => insertFormatting("\n### ", "\n", "Minor Heading")
					},
					{
						icon: List,
						title: "Bullet List",
						action: () => insertFormatting("\n- ", "\n", "Bullet point")
					},
					{
						icon: ListOrdered,
						title: "Numbered List",
						action: () => insertFormatting("\n1. ", "\n", "Numbered step")
					},
					{
						icon: Quote,
						title: "Blockquote",
						action: () => insertFormatting("\n> ", "\n", "Inspiring editorial quote...")
					},
					{
						icon: Code,
						title: "Code Block",
						action: () => insertFormatting("\n```typescript\n", "\n```\n", "// Code block snippet")
					},
					{
						icon: Link$1,
						title: "Hyperlink",
						action: () => insertFormatting("[", "](https://example.com)", "link title")
					},
					{
						icon: Image,
						title: "Embed Image",
						action: () => insertFormatting("![Alt caption](", ")", "https://images.unsplash.com/...")
					},
					{
						icon: Minus,
						title: "Divider Line",
						action: () => insertFormatting("\n---\n\n", "")
					}
				].map((t, idx) => /* @__PURE__ */ jsx(Button, {
					type: "button",
					variant: "ghost",
					size: "sm",
					title: t.title,
					onClick: t.action,
					className: "h-7 w-7 p-0 text-neutral-300 hover:text-white hover:bg-white/10",
					children: /* @__PURE__ */ jsx(t.icon, { className: "w-3.5 h-3.5" })
				}, idx))]
			}),
			/* @__PURE__ */ jsx("textarea", {
				ref: textareaRef,
				value,
				onChange: (e) => onChange(e.target.value),
				placeholder,
				rows: 12,
				className: "w-full p-4 bg-transparent text-white font-mono text-sm leading-relaxed focus:outline-none resize-y min-h-[220px]"
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between px-3 py-1.5 bg-[#12131a]/60 border-t border-white/5 text-[11px] font-mono text-neutral-400",
				children: [/* @__PURE__ */ jsx("span", { children: "Markdown + HTML formatted syntax" }), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-3",
					children: [
						/* @__PURE__ */ jsxs("span", { children: [value.trim() ? value.trim().split(/\s+/).length : 0, " words"] }),
						/* @__PURE__ */ jsxs("span", { children: [value.length, " chars"] }),
						/* @__PURE__ */ jsxs("span", {
							className: "text-accent",
							children: [
								"~",
								Math.max(1, Math.ceil((value.trim() ? value.trim().split(/\s+/).length : 0) / 200)),
								" min read"
							]
						})
					]
				})]
			})
		]
	});
}
//#endregion
//#region resources/js/Components/Admin/UI/SeoManager.tsx
function SeoManager({ data, onChange, fallbackTitle = "", fallbackDescription = "", fallbackSlug = "", fallbackImage = "" }) {
	const displayTitle = data.meta_title || fallbackTitle || "Article Title — CuttingEdger";
	const displayDesc = data.meta_description || fallbackDescription || "Detailed article excerpt and architectural summary...";
	const displayUrl = data.canonical_url || `https://cuttingedger.com/blog/${fallbackSlug || "article-slug"}`;
	const titleLength = (data.meta_title || "").length;
	const descLength = (data.meta_description || "").length;
	useEffect(() => {
		if (fallbackSlug) {
			const expectedCanonical = `https://cuttingedger.com/blog/${fallbackSlug}`;
			if (!data.canonical_url || data.canonical_url.startsWith("https://cuttingedger.com/blog/")) {
				if (data.canonical_url !== expectedCanonical) onChange("canonical_url", expectedCanonical);
			}
		}
	}, [
		fallbackSlug,
		data.canonical_url,
		onChange
	]);
	useEffect(() => {
		if (fallbackImage !== void 0) {
			const targetOg = fallbackImage || "";
			if (data.og_image !== targetOg) onChange("og_image", targetOg);
		}
	}, [
		fallbackImage,
		data.og_image,
		onChange
	]);
	let score = 0;
	if (titleLength >= 30 && titleLength <= 60) score += 30;
	else if (titleLength > 0) score += 15;
	if (descLength >= 100 && descLength <= 160) score += 35;
	else if (descLength > 0) score += 20;
	if (data.meta_keywords?.trim()) score += 15;
	if (data.canonical_url?.trim() || fallbackSlug) score += 10;
	if (data.og_image?.trim() || fallbackImage) score += 10;
	const handleAutoGenerate = () => {
		if (!data.meta_title && fallbackTitle) onChange("meta_title", `${fallbackTitle} — CuttingEdger Journal`);
		if (!data.meta_description && fallbackDescription) onChange("meta_description", fallbackDescription.slice(0, 155));
		if (fallbackSlug) onChange("canonical_url", `https://cuttingedger.com/blog/${fallbackSlug}`);
		if (fallbackImage) onChange("og_image", fallbackImage);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-4 rounded-lg border border-white/10 bg-[#0c0d12] p-4 text-white",
		children: [
			/* @__PURE__ */ jsx("input", {
				type: "hidden",
				name: "canonical_url",
				value: data.canonical_url || ""
			}),
			/* @__PURE__ */ jsx("input", {
				type: "hidden",
				name: "og_image",
				value: data.og_image || ""
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ jsx(Search, { className: "w-4 h-4 text-accent" }),
						/* @__PURE__ */ jsx("span", {
							className: "font-mono text-xs font-bold uppercase tracking-wider text-white",
							children: "DYNAMIC SEO & OPEN GRAPH SUITE"
						}),
						/* @__PURE__ */ jsxs(Badge, {
							variant: "outline",
							className: `text-[10px] font-mono ${score >= 80 ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : score >= 50 ? "border-amber-500/30 bg-amber-500/10 text-amber-400" : "border-rose-500/30 bg-rose-500/10 text-rose-400"}`,
							children: [
								"SEO Health: ",
								score,
								"%"
							]
						})
					]
				}), /* @__PURE__ */ jsxs("button", {
					type: "button",
					onClick: handleAutoGenerate,
					className: "flex items-center gap-1.5 text-xs font-mono text-accent hover:text-[#b8dd00] bg-accent/10 border border-accent/30 px-2.5 py-1 rounded transition-colors cursor-pointer",
					children: [/* @__PURE__ */ jsx(Sparkles, { className: "w-3.5 h-3.5" }), "Auto-Fill From Post"]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "rounded-md border border-white/5 bg-[#12131a] p-3 space-y-1",
				children: [
					/* @__PURE__ */ jsx("span", {
						className: "text-[10px] font-mono uppercase tracking-wider text-neutral-500",
						children: "SEARCH ENGINE RESULT SNIPPET (SERP PREVIEW)"
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-1.5 text-[11px] text-neutral-400 font-sans",
						children: [/* @__PURE__ */ jsx(Globe, { className: "w-3.5 h-3.5 text-neutral-500" }), /* @__PURE__ */ jsx("span", {
							className: "truncate",
							children: displayUrl
						})]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "text-sm font-medium text-[#8ab4f8] hover:underline cursor-pointer truncate",
						children: displayTitle
					}),
					/* @__PURE__ */ jsx("div", {
						className: "text-xs text-neutral-300 line-clamp-2 leading-relaxed",
						children: displayDesc
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-1 md:grid-cols-2 gap-4 pt-1",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex justify-between items-center text-xs font-mono",
						children: [/* @__PURE__ */ jsx("label", {
							className: "text-neutral-300",
							children: "Meta Title Tag"
						}), /* @__PURE__ */ jsxs("span", {
							className: titleLength > 60 ? "text-rose-400" : titleLength >= 30 ? "text-emerald-400" : "text-neutral-500",
							children: [titleLength, " / 60 chars"]
						})]
					}), /* @__PURE__ */ jsx(Input, {
						placeholder: fallbackTitle || "Optimal length: 50-60 characters",
						value: data.meta_title || "",
						onChange: (e) => onChange("meta_title", e.target.value),
						className: "bg-[#12131a] border-white/10 focus:border-accent"
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ jsx("label", {
						className: "text-xs font-mono text-neutral-300",
						children: "Meta Keywords (Comma separated)"
					}), /* @__PURE__ */ jsx(Input, {
						placeholder: "design engineering, spatial ui, reactive motion",
						value: data.meta_keywords || "",
						onChange: (e) => onChange("meta_keywords", e.target.value),
						className: "bg-[#12131a] border-white/10 focus:border-accent"
					})]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "space-y-1.5",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex justify-between items-center text-xs font-mono",
					children: [/* @__PURE__ */ jsx("label", {
						className: "text-neutral-300",
						children: "Meta Description"
					}), /* @__PURE__ */ jsxs("span", {
						className: descLength > 160 ? "text-rose-400" : descLength >= 110 ? "text-emerald-400" : "text-neutral-500",
						children: [descLength, " / 160 chars"]
					})]
				}), /* @__PURE__ */ jsx(Textarea, {
					rows: 2,
					placeholder: fallbackDescription || "Concise and compelling summary for Google and social previews (110-160 characters)",
					value: data.meta_description || "",
					onChange: (e) => onChange("meta_description", e.target.value),
					className: "bg-[#12131a] border-white/10 focus:border-accent"
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "space-y-1.5 pt-1",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ jsxs("label", {
						className: "text-xs font-mono text-neutral-300 flex items-center gap-1.5",
						children: [/* @__PURE__ */ jsx(Bot, { className: "w-3.5 h-3.5 text-accent" }), /* @__PURE__ */ jsx("span", { children: "Robots Directives" })]
					}), /* @__PURE__ */ jsx("span", {
						className: "text-[10px] font-mono text-neutral-500",
						children: "Crawler index & link rules"
					})]
				}), /* @__PURE__ */ jsxs(Select, {
					value: data.robots || "index, follow",
					onValueChange: (val) => onChange("robots", val),
					children: [/* @__PURE__ */ jsx(SelectTrigger, {
						className: "h-10 bg-[#12131a] border-white/10 hover:border-white/20 focus:border-accent text-white",
						children: /* @__PURE__ */ jsx(SelectValue, {
							placeholder: "Select robots rule",
							children: (data.robots || "index, follow") === "noindex, nofollow" ? /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-rose-400 shrink-0" }),
									/* @__PURE__ */ jsx("span", {
										className: "font-mono text-xs text-white",
										children: "noindex, nofollow"
									}),
									/* @__PURE__ */ jsx("span", {
										className: "text-[10px] text-neutral-400 font-mono hidden sm:inline",
										children: "(Strictly Private)"
									})
								]
							}) : (data.robots || "index, follow") === "noindex, follow" ? /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-amber-400 shrink-0" }),
									/* @__PURE__ */ jsx("span", {
										className: "font-mono text-xs text-white",
										children: "noindex, follow"
									}),
									/* @__PURE__ */ jsx("span", {
										className: "text-[10px] text-neutral-400 font-mono hidden sm:inline",
										children: "(Hidden from Search)"
									})
								]
							}) : /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-400 shrink-0" }),
									/* @__PURE__ */ jsx("span", {
										className: "font-mono text-xs text-white",
										children: "index, follow"
									}),
									/* @__PURE__ */ jsx("span", {
										className: "text-[10px] text-neutral-400 font-mono hidden sm:inline",
										children: "(Standard Public)"
									})
								]
							})
						})
					}), /* @__PURE__ */ jsx(SelectContent, {
						className: "bg-[#0f1118] border-white/15 text-white shadow-2xl min-w-[300px]",
						children: /* @__PURE__ */ jsxs(SelectGroup, { children: [
							/* @__PURE__ */ jsx(SelectLabel, { children: "SEARCH CRAWLER DIRECTIVES" }),
							/* @__PURE__ */ jsx(SelectItem, {
								value: "index, follow",
								className: "py-2.5 px-3 cursor-pointer",
								children: /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2.5",
									children: [/* @__PURE__ */ jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)] shrink-0" }), /* @__PURE__ */ jsxs("div", {
										className: "flex flex-col text-left",
										children: [/* @__PURE__ */ jsx("span", {
											className: "font-medium text-white text-xs font-mono",
											children: "index, follow"
										}), /* @__PURE__ */ jsx("span", {
											className: "text-[11px] text-neutral-400",
											children: "Standard Public • Index article & crawl links"
										})]
									})]
								})
							}),
							/* @__PURE__ */ jsx(SelectItem, {
								value: "noindex, follow",
								className: "py-2.5 px-3 cursor-pointer",
								children: /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2.5",
									children: [/* @__PURE__ */ jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)] shrink-0" }), /* @__PURE__ */ jsxs("div", {
										className: "flex flex-col text-left",
										children: [/* @__PURE__ */ jsx("span", {
											className: "font-medium text-white text-xs font-mono",
											children: "noindex, follow"
										}), /* @__PURE__ */ jsx("span", {
											className: "text-[11px] text-neutral-400",
											children: "Hidden from Search • Hide page, follow links"
										})]
									})]
								})
							}),
							/* @__PURE__ */ jsx(SelectItem, {
								value: "noindex, nofollow",
								className: "py-2.5 cursor-pointer",
								children: /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2.5",
									children: [/* @__PURE__ */ jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.5)] shrink-0" }), /* @__PURE__ */ jsxs("div", {
										className: "flex flex-col text-left",
										children: [/* @__PURE__ */ jsx("span", {
											className: "font-medium text-white text-xs font-mono",
											children: "noindex, nofollow"
										}), /* @__PURE__ */ jsx("span", {
											className: "text-[11px] text-neutral-400",
											children: "Strictly Private • Block index & all links"
										})]
									})]
								})
							})
						] })
					})]
				})]
			})
		]
	});
}
//#endregion
//#region resources/js/Pages/Admin/Blogs/BlogForm.tsx
function BlogForm({ mode, blog, categories = [], authors = [] }) {
	const isEdit = mode === "edit";
	const initialTags = blog?.tags ? Array.isArray(blog.tags) ? blog.tags.join(", ") : String(blog.tags) : "";
	const { data, setData, post, put, processing, errors, isDirty } = useForm({
		title: blog?.title || "",
		slug: blog?.slug || "",
		blog_category_id: blog?.blog_category_id || categories[0]?.id || "",
		subcategory_id: blog?.subcategory_id || "",
		author_id: blog?.author_id || authors[0]?.id || "",
		excerpt: blog?.excerpt || "",
		body: blog?.body || "",
		cover_image: blog?.cover_image || "",
		is_featured: !!blog?.is_featured,
		status: blog?.status || "published",
		tags: initialTags,
		meta_title: blog?.meta_title || "",
		meta_description: blog?.meta_description || "",
		meta_keywords: blog?.meta_keywords || "",
		canonical_url: blog?.canonical_url || "",
		og_image: blog?.og_image || "",
		robots: blog?.robots || "index, follow"
	});
	const [imagePreviewError, setImagePreviewError] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [uploadError, setUploadError] = useState(null);
	const [isDragging, setIsDragging] = useState(false);
	const [uploadedFileName, setUploadedFileName] = useState(null);
	const [isUrlCopied, setIsUrlCopied] = useState(false);
	const fileInputRef = React.useRef(null);
	const handleCopyLiveUrl = () => {
		const fullUrl = `https://cuttingedger.com/blog/${data.slug || "your-slug"}`;
		navigator.clipboard.writeText(fullUrl);
		setIsUrlCopied(true);
		setTimeout(() => setIsUrlCopied(false), 2e3);
	};
	useEffect(() => {
		setImagePreviewError(false);
	}, [data.cover_image]);
	const getCsrfToken = () => {
		const metaTag = document.querySelector("meta[name=\"csrf-token\"]");
		if (metaTag?.content) return metaTag.content;
		const cookieMatch = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
		if (cookieMatch) return decodeURIComponent(cookieMatch[1]);
		return "";
	};
	const handleFileUpload = async (file) => {
		if (!file) return;
		if (!file.type.startsWith("image/")) {
			setUploadError("Only image files (JPG, PNG, WEBP, AVIF, GIF) are allowed.");
			return;
		}
		if (file.size > 10485760) {
			setUploadError("Image size exceeds 10MB limit.");
			return;
		}
		setIsUploading(true);
		setUploadError(null);
		setImagePreviewError(false);
		try {
			const formData = new FormData();
			formData.append("image", file);
			const csrfToken = getCsrfToken();
			const headers = {
				Accept: "application/json",
				"X-Requested-With": "XMLHttpRequest"
			};
			if (csrfToken) headers["X-CSRF-TOKEN"] = csrfToken;
			const response = await fetch($("admin.blogs.upload-cover"), {
				method: "POST",
				headers,
				body: formData
			});
			if (!response.ok) {
				const errorJson = await response.json().catch(() => null);
				throw new Error(errorJson?.errors?.image?.[0] || errorJson?.message || `Upload failed with status ${response.status}`);
			}
			const resData = await response.json();
			if (resData.success && resData.url) {
				setData("cover_image", resData.url);
				setUploadedFileName(resData.filename || file.name);
				setUploadError(null);
			} else throw new Error("Invalid response received from server.");
		} catch (err) {
			console.error("Cover image upload failed:", err);
			setUploadError(err.message || "Failed to upload image. Please try again or paste a URL.");
		} finally {
			setIsUploading(false);
			if (fileInputRef.current) fileInputRef.current.value = "";
		}
	};
	const handleDragOver = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
	};
	const handleDragLeave = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	};
	const handleDrop = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
		if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
			const droppedFile = e.dataTransfer.files[0];
			handleFileUpload(droppedFile);
		}
	};
	const activeSubcategories = categories.find((c) => String(c.id) === String(data.blog_category_id))?.subcategories || [];
	const selectedAuthor = authors.find((a) => String(a.id) === String(data.author_id));
	const selectedCategory = categories.find((c) => String(c.id) === String(data.blog_category_id));
	const selectedSubcategory = activeSubcategories.find((s) => String(s.id) === String(data.subcategory_id));
	const handleGenerateSlug = () => {
		if (!data.title) return;
		const generated = data.title.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
		setData("slug", generated);
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		if (isEdit && blog) put($("admin.blogs.update", blog.id));
		else post($("admin.blogs.store"));
	};
	const tagPills = data.tags.split(",").map((t) => t.trim()).filter(Boolean);
	return /* @__PURE__ */ jsxs("form", {
		onSubmit: handleSubmit,
		className: "space-y-8",
		children: [isDirty && /* @__PURE__ */ jsxs("div", {
			className: "flex items-center justify-between p-3 rounded-lg border border-accent/30 bg-accent/10 text-neutral-200 text-xs font-mono",
			children: [/* @__PURE__ */ jsxs("span", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-accent animate-pulse" }), "You have unsaved changes in this blog post."]
			}), /* @__PURE__ */ jsx("span", {
				className: "text-neutral-400",
				children: "Remember to commit your changes."
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "grid grid-cols-1 lg:grid-cols-12 gap-8 items-start",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "lg:col-span-8 space-y-8",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "rounded-xl border border-white/10 bg-[#12131a] p-6 space-y-6 shadow-xl",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between pb-4 border-b border-white/10",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ jsx(FileText, { className: "w-4 h-4 text-accent" }), /* @__PURE__ */ jsx("span", {
									className: "text-xs font-mono font-bold uppercase tracking-wider text-white",
									children: "CORE ARTICLE ATTRIBUTES"
								})]
							}), /* @__PURE__ */ jsx(Badge, {
								className: "bg-white/5 text-neutral-400 border-white/10 font-mono text-[10px]",
								children: "Markdown & HTML Compatible"
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-4",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "space-y-2",
								children: [
									/* @__PURE__ */ jsxs("label", {
										className: "text-xs font-mono text-neutral-300 flex items-center justify-between",
										children: [/* @__PURE__ */ jsx("span", { children: "Article Headline / Title *" }), /* @__PURE__ */ jsx("span", {
											className: "text-neutral-500 text-[10px]",
											children: "Required"
										})]
									}),
									/* @__PURE__ */ jsx(Input, {
										value: data.title,
										onChange: (e) => setData("title", e.target.value),
										placeholder: "e.g. Kinetic Physics: Sculpting Tactile Interfaces",
										className: "bg-[#0c0d12] border-white/10 focus:border-accent text-lg font-medium text-white placeholder:text-neutral-600 h-12",
										required: true
									}),
									errors.title && /* @__PURE__ */ jsxs("p", {
										className: "text-rose-400 text-xs font-mono flex items-center gap-1.5 mt-1",
										children: [/* @__PURE__ */ jsx(AlertCircle, { className: "w-3.5 h-3.5" }), errors.title]
									})
								]
							}), /* @__PURE__ */ jsxs("div", {
								className: "space-y-2",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ jsxs("label", {
											className: "text-xs font-mono text-neutral-300",
											children: ["URL Slug ", isEdit ? "*" : "(Optional - auto-generated if left blank)"]
										}), /* @__PURE__ */ jsxs(Button, {
											type: "button",
											variant: "ghost",
											size: "sm",
											onClick: handleGenerateSlug,
											disabled: !data.title,
											className: "h-6 px-2 text-[11px] font-mono text-accent hover:text-accent hover:bg-accent/10 gap-1 cursor-pointer",
											children: [/* @__PURE__ */ jsx(Sparkles, { className: "w-3 h-3" }), /* @__PURE__ */ jsx("span", { children: "Generate from Title" })]
										})]
									}),
									/* @__PURE__ */ jsx("div", {
										className: "relative",
										children: /* @__PURE__ */ jsx(Input, {
											value: data.slug,
											onChange: (e) => setData("slug", e.target.value),
											placeholder: "kinetic-physics-tactile-interfaces",
											className: "bg-[#0c0d12] border-white/10 focus:border-accent font-mono text-sm text-neutral-300",
											required: isEdit
										})
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "text-[11px] font-mono text-neutral-500 flex items-center gap-2 flex-wrap",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-1 min-w-0",
											children: [
												/* @__PURE__ */ jsx(Globe, { className: "w-3 h-3 shrink-0 text-neutral-400" }),
												/* @__PURE__ */ jsx("span", { children: "Live URL preview:" }),
												/* @__PURE__ */ jsxs("span", {
													className: "text-accent",
													children: ["https://cuttingedger.com/blog/", data.slug || "your-slug"]
												})
											]
										}), /* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: handleCopyLiveUrl,
											className: "inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-neutral-300 hover:text-white transition-all cursor-pointer text-[10px] font-mono shrink-0",
											title: "Copy live URL to clipboard",
											children: isUrlCopied ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Check, { className: "w-3 h-3 text-emerald-400" }), /* @__PURE__ */ jsx("span", {
												className: "text-emerald-400 font-medium",
												children: "Copied"
											})] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Copy, { className: "w-3 h-3 text-neutral-400" }), /* @__PURE__ */ jsx("span", { children: "Copy" })] })
										})]
									}),
									errors.slug && /* @__PURE__ */ jsxs("p", {
										className: "text-rose-400 text-xs font-mono flex items-center gap-1.5 mt-1",
										children: [/* @__PURE__ */ jsx(AlertCircle, { className: "w-3.5 h-3.5" }), errors.slug]
									})
								]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ jsx("label", {
										className: "text-xs font-mono text-neutral-300",
										children: "Article Summary *"
									}), /* @__PURE__ */ jsxs("span", {
										className: "text-[10px] font-mono text-neutral-500",
										children: [data.excerpt.length, " characters (Recommended: 120-160)"]
									})]
								}),
								/* @__PURE__ */ jsx(Textarea, {
									rows: 3,
									value: data.excerpt,
									onChange: (e) => setData("excerpt", e.target.value),
									placeholder: "A brief 1–2 sentence overview of the article. This appears on blog preview cards and search results.",
									className: "bg-[#0c0d12] border-white/10 focus:border-accent text-sm text-neutral-200 leading-relaxed",
									required: true
								}),
								errors.excerpt && /* @__PURE__ */ jsxs("p", {
									className: "text-rose-400 text-xs font-mono flex items-center gap-1.5 mt-1",
									children: [/* @__PURE__ */ jsx(AlertCircle, { className: "w-3.5 h-3.5" }), errors.excerpt]
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ jsx("label", {
									className: "text-xs font-mono text-neutral-300 block",
									children: "Full Article Body Content *"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "rounded-lg overflow-hidden border border-white/10 bg-[#0c0d12]",
									children: /* @__PURE__ */ jsx(RichContentEditor, {
										value: data.body,
										onChange: (val) => setData("body", val),
										placeholder: "Write your article here using rich markdown or html syntax..."
									})
								}),
								errors.body && /* @__PURE__ */ jsxs("p", {
									className: "text-rose-400 text-xs font-mono flex items-center gap-1.5 mt-1",
									children: [/* @__PURE__ */ jsx(AlertCircle, { className: "w-3.5 h-3.5" }), errors.body]
								})
							]
						})
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "rounded-xl border border-white/10 bg-[#12131a] p-6 space-y-6 shadow-xl",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between pb-4 border-b border-white/10",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(Globe, { className: "w-4 h-4 text-accent" }), /* @__PURE__ */ jsx("span", {
								className: "text-xs font-mono font-bold uppercase tracking-wider text-white",
								children: "DYNAMIC SEARCH ENGINE OPTIMIZATION (SEO)"
							})]
						}), /* @__PURE__ */ jsx("span", {
							className: "text-[10px] font-mono text-neutral-400",
							children: "Live Google SERP & OpenGraph Analyzer"
						})]
					}), /* @__PURE__ */ jsx(SeoManager, {
						data: {
							meta_title: data.meta_title,
							meta_description: data.meta_description,
							meta_keywords: data.meta_keywords,
							canonical_url: data.canonical_url,
							og_image: data.og_image,
							robots: data.robots
						},
						onChange: (field, val) => setData(field, val),
						fallbackTitle: data.title,
						fallbackDescription: data.excerpt,
						fallbackSlug: data.slug,
						fallbackImage: data.cover_image
					})]
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "lg:col-span-4 space-y-6",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "rounded-xl border border-white/10 bg-[#12131a] p-6 space-y-5 shadow-xl",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "pb-3 border-b border-white/10",
								children: /* @__PURE__ */ jsxs("span", {
									className: "text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2",
									children: [/* @__PURE__ */ jsx(Tag, { className: "w-4 h-4 text-[#d4ff00]" }), "CATEGORY & AUTHOR"]
								})
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [
									/* @__PURE__ */ jsxs("label", {
										className: "text-xs font-mono text-neutral-300 flex items-center gap-1.5",
										children: [/* @__PURE__ */ jsx(User, { className: "w-3.5 h-3.5 text-neutral-400" }), /* @__PURE__ */ jsx("span", { children: "Author / Creator *" })]
									}),
									/* @__PURE__ */ jsxs(Select, {
										value: data.author_id ? String(data.author_id) : "",
										onValueChange: (val) => setData("author_id", Number(val) || val),
										children: [/* @__PURE__ */ jsx(SelectTrigger, {
											className: "h-11 bg-[#0c0d12] border-white/10 hover:border-white/20 focus:border-accent text-white",
											children: /* @__PURE__ */ jsx(SelectValue, {
												placeholder: "Select Author",
												children: selectedAuthor ? /* @__PURE__ */ jsxs("div", {
													className: "flex items-center gap-2.5 min-w-0 flex-1 text-left",
													children: [
														selectedAuthor.avatar ? /* @__PURE__ */ jsx("img", {
															src: selectedAuthor.avatar,
															alt: selectedAuthor.name,
															className: "w-5 h-5 rounded-full object-cover border border-white/10 shrink-0"
														}) : /* @__PURE__ */ jsx("span", {
															className: "w-5 h-5 rounded-full bg-accent/10 text-accent border border-accent/30 flex items-center justify-center text-[10px] font-mono font-bold shrink-0",
															children: selectedAuthor.name.charAt(0)
														}),
														/* @__PURE__ */ jsx("span", {
															className: "font-medium text-white truncate text-sm",
															children: selectedAuthor.name
														}),
														/* @__PURE__ */ jsx("span", {
															className: "text-[10px] font-mono text-neutral-400 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded truncate max-w-[140px] shrink-0 hidden sm:inline-block",
															children: selectedAuthor.role
														})
													]
												}) : /* @__PURE__ */ jsx("span", {
													className: "text-neutral-500",
													children: "Select Author"
												})
											})
										}), /* @__PURE__ */ jsx(SelectContent, {
											className: "bg-[#0f1118] border-white/15 text-white shadow-2xl min-w-[290px] max-w-[440px]",
											children: /* @__PURE__ */ jsxs(SelectGroup, { children: [/* @__PURE__ */ jsx(SelectLabel, { children: "EDITORIAL CREW & CONTRIBUTORS" }), authors.map((a) => /* @__PURE__ */ jsx(SelectItem, {
												value: String(a.id),
												className: "py-2.5 px-3 cursor-pointer focus:bg-accent/10 focus:text-white data-[highlighted]:bg-accent/10",
												children: /* @__PURE__ */ jsxs("div", {
													className: "flex items-center gap-3 w-full pr-4",
													children: [a.avatar ? /* @__PURE__ */ jsx("img", {
														src: a.avatar,
														alt: a.name,
														className: "w-7 h-7 rounded-full object-cover border border-white/10 shrink-0"
													}) : /* @__PURE__ */ jsx("div", {
														className: "w-7 h-7 rounded-full bg-accent/10 text-accent border border-accent/30 flex items-center justify-center text-xs font-mono font-bold shrink-0",
														children: a.name.charAt(0)
													}), /* @__PURE__ */ jsxs("div", {
														className: "flex flex-col min-w-0 text-left",
														children: [/* @__PURE__ */ jsx("span", {
															className: "font-medium text-white text-sm truncate",
															children: a.name
														}), /* @__PURE__ */ jsx("span", {
															className: "text-[11px] font-mono text-neutral-400 truncate",
															children: a.role
														})]
													})]
												})
											}, a.id))] })
										})]
									}),
									errors.author_id && /* @__PURE__ */ jsx("p", {
										className: "text-rose-400 text-xs font-mono",
										children: errors.author_id
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [
									/* @__PURE__ */ jsxs("label", {
										className: "text-xs font-mono text-neutral-300 flex items-center gap-1.5",
										children: [/* @__PURE__ */ jsx(FolderKanban, { className: "w-3.5 h-3.5 text-neutral-400" }), /* @__PURE__ */ jsx("span", { children: "Primary Category *" })]
									}),
									/* @__PURE__ */ jsxs(Select, {
										value: data.blog_category_id ? String(data.blog_category_id) : "",
										onValueChange: (val) => {
											setData((prev) => ({
												...prev,
												blog_category_id: Number(val) || val,
												subcategory_id: ""
											}));
										},
										children: [/* @__PURE__ */ jsx(SelectTrigger, {
											className: "h-11 bg-[#0c0d12] border-white/10 hover:border-white/20 focus:border-accent text-white",
											children: /* @__PURE__ */ jsx(SelectValue, {
												placeholder: "Select Category",
												children: selectedCategory ? /* @__PURE__ */ jsxs("div", {
													className: "flex items-center gap-2 min-w-0 flex-1 text-left",
													children: [/* @__PURE__ */ jsx(FolderKanban, { className: "w-4 h-4 text-accent shrink-0" }), /* @__PURE__ */ jsx("span", {
														className: "font-medium text-white truncate text-sm",
														children: selectedCategory.name
													})]
												}) : /* @__PURE__ */ jsx("span", {
													className: "text-neutral-500",
													children: "Select Category"
												})
											})
										}), /* @__PURE__ */ jsx(SelectContent, {
											className: "bg-[#0f1118] border-white/15 text-white shadow-2xl min-w-[270px]",
											children: /* @__PURE__ */ jsxs(SelectGroup, { children: [/* @__PURE__ */ jsx(SelectLabel, { children: "CONTENT CATEGORIES" }), categories.map((c) => /* @__PURE__ */ jsx(SelectItem, {
												value: String(c.id),
												className: "py-2.5 px-3 cursor-pointer focus:bg-accent/10 focus:text-white data-[highlighted]:bg-accent/10",
												children: /* @__PURE__ */ jsxs("div", {
													className: "flex items-center justify-between w-full pr-4 gap-3",
													children: [/* @__PURE__ */ jsxs("div", {
														className: "flex items-center gap-2.5 min-w-0",
														children: [/* @__PURE__ */ jsx(FolderKanban, { className: "w-4 h-4 text-accent shrink-0 opacity-80" }), /* @__PURE__ */ jsx("span", {
															className: "font-medium text-white text-sm truncate",
															children: c.name
														})]
													}), c.subcategories && c.subcategories.length > 0 && /* @__PURE__ */ jsxs("span", {
														className: "text-[10px] font-mono text-accent bg-accent/10 border border-accent/20 px-1.5 py-0.5 rounded shrink-0",
														children: [c.subcategories.length, " sub"]
													})]
												})
											}, c.id))] })
										})]
									}),
									errors.blog_category_id && /* @__PURE__ */ jsx("p", {
										className: "text-rose-400 text-xs font-mono",
										children: errors.blog_category_id
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ jsxs("label", {
											className: "text-xs font-mono text-neutral-300 flex items-center gap-1.5",
											children: [/* @__PURE__ */ jsx(CornerDownRight, { className: "w-3.5 h-3.5 text-neutral-400" }), /* @__PURE__ */ jsx("span", { children: "Subcategory (Optional)" })]
										}), activeSubcategories.length > 0 && /* @__PURE__ */ jsxs("span", {
											className: "text-[10px] font-mono text-accent",
											children: [activeSubcategories.length, " available"]
										})]
									}),
									/* @__PURE__ */ jsxs(Select, {
										value: data.subcategory_id ? String(data.subcategory_id) : "none",
										onValueChange: (val) => setData("subcategory_id", val === "none" ? "" : Number(val) || val),
										disabled: activeSubcategories.length === 0,
										children: [/* @__PURE__ */ jsx(SelectTrigger, {
											className: "h-11 bg-[#0c0d12] border-white/10 hover:border-white/20 focus:border-accent text-white disabled:opacity-50",
											children: /* @__PURE__ */ jsx(SelectValue, {
												placeholder: "Select Subcategory",
												children: /* @__PURE__ */ jsxs("div", {
													className: "flex items-center gap-2 min-w-0 flex-1 text-left",
													children: [/* @__PURE__ */ jsx(CornerDownRight, { className: "w-3.5 h-3.5 text-neutral-400 shrink-0" }), /* @__PURE__ */ jsx("span", {
														className: "text-sm truncate text-white",
														children: selectedSubcategory ? selectedSubcategory.name : activeSubcategories.length === 0 ? "No subcategories available" : "None (Direct in Primary Category)"
													})]
												})
											})
										}), /* @__PURE__ */ jsx(SelectContent, {
											className: "bg-[#0f1118] border-white/15 text-white shadow-2xl min-w-[270px]",
											children: /* @__PURE__ */ jsxs(SelectGroup, { children: [
												/* @__PURE__ */ jsx(SelectLabel, { children: "SUBCATEGORY CLASSIFICATION" }),
												/* @__PURE__ */ jsx(SelectItem, {
													value: "none",
													className: "py-2.5 px-3 cursor-pointer focus:bg-white/10 text-neutral-400 italic",
													children: "None (Direct in Primary Category)"
												}),
												activeSubcategories.map((sub) => /* @__PURE__ */ jsx(SelectItem, {
													value: String(sub.id),
													className: "py-2.5 px-3 cursor-pointer focus:bg-accent/10 focus:text-white data-[highlighted]:bg-accent/10",
													children: /* @__PURE__ */ jsxs("div", {
														className: "flex items-center gap-2.5 pr-4",
														children: [/* @__PURE__ */ jsx(CornerDownRight, { className: "w-3.5 h-3.5 text-accent shrink-0" }), /* @__PURE__ */ jsx("span", {
															className: "text-sm font-medium text-white",
															children: sub.name
														})]
													})
												}, sub.id))
											] })
										})]
									}),
									errors.subcategory_id && /* @__PURE__ */ jsx("p", {
										className: "text-rose-400 text-xs font-mono",
										children: errors.subcategory_id
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-2",
								children: [
									/* @__PURE__ */ jsx("label", {
										className: "text-xs font-mono text-neutral-300",
										children: "Tags (Comma-separated)"
									}),
									/* @__PURE__ */ jsx(Input, {
										placeholder: "Motion, Spatial, UI/UX, Engineering",
										value: data.tags,
										onChange: (e) => setData("tags", e.target.value),
										className: "bg-[#0c0d12] border-white/10 focus:border-accent text-sm"
									}),
									tagPills.length > 0 && /* @__PURE__ */ jsx("div", {
										className: "flex flex-wrap gap-1.5 pt-1",
										children: tagPills.map((tag, idx) => /* @__PURE__ */ jsxs(Badge, {
											className: "bg-white/5 border border-white/10 text-neutral-300 text-[10px] font-mono px-2 py-0.5 h-5",
											children: ["#", tag]
										}, idx))
									}),
									errors.tags && /* @__PURE__ */ jsx("p", {
										className: "text-rose-400 text-xs font-mono",
										children: errors.tags
									})
								]
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "rounded-xl border border-white/10 bg-[#12131a] p-6 space-y-5 shadow-xl",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between pb-3 border-b border-white/10",
								children: [/* @__PURE__ */ jsxs("span", {
									className: "text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2",
									children: [/* @__PURE__ */ jsx(Image, { className: "w-4 h-4 text-accent" }), "COVER MEDIA & BANNER"]
								}), data.cover_image && /* @__PURE__ */ jsx(Badge, {
									className: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-mono px-2 py-0.5",
									children: "● ATTACHED"
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-2",
								children: [
									/* @__PURE__ */ jsxs("label", {
										className: "text-xs font-mono text-neutral-300 flex items-center justify-between",
										children: [/* @__PURE__ */ jsxs("span", {
											className: "flex items-center gap-1.5",
											children: [/* @__PURE__ */ jsx(UploadCloud, { className: "w-3.5 h-3.5 text-neutral-400" }), /* @__PURE__ */ jsx("span", { children: "Upload Image File *" })]
										}), /* @__PURE__ */ jsx("span", {
											className: "text-[10px] font-mono text-neutral-500",
											children: "Max 10MB • Auto-optimized WebP"
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										onDragOver: handleDragOver,
										onDragLeave: handleDragLeave,
										onDrop: handleDrop,
										onClick: () => !isUploading && fileInputRef.current?.click(),
										className: `group relative rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer overflow-hidden p-5 flex flex-col items-center justify-center text-center gap-2.5 ${isDragging ? "border-accent bg-accent/10 shadow-[0_0_25px_rgba(251, 183, 24, 0.2)]" : isUploading ? "border-accent/50 bg-[#0c0d12] opacity-80 cursor-wait" : "border-white/15 bg-[#0c0d12]/70 hover:border-accent/60 hover:bg-[#0c0d12]"}`,
										children: [/* @__PURE__ */ jsx("input", {
											ref: fileInputRef,
											type: "file",
											accept: "image/png,image/jpeg,image/webp,image/avif,image/gif",
											className: "hidden",
											onChange: (e) => {
												if (e.target.files && e.target.files[0]) handleFileUpload(e.target.files[0]);
											}
										}), isUploading ? /* @__PURE__ */ jsxs("div", {
											className: "flex flex-col items-center gap-2 py-2",
											children: [/* @__PURE__ */ jsx(Loader2, { className: "w-8 h-8 text-accent animate-spin" }), /* @__PURE__ */ jsxs("div", {
												className: "flex flex-col items-center gap-0.5",
												children: [/* @__PURE__ */ jsx("span", {
													className: "text-xs font-mono font-bold text-white",
													children: "Optimizing & uploading image..."
												}), /* @__PURE__ */ jsx("span", {
													className: "text-[10px] font-mono text-neutral-400",
													children: "Resizing & encoding via Laravel Intervention"
												})]
											})]
										}) : uploadedFileName || data.cover_image ? /* @__PURE__ */ jsxs("div", {
											className: "flex items-center justify-between w-full p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20",
											children: [/* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-2.5 min-w-0",
												children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4 text-emerald-400 shrink-0" }), /* @__PURE__ */ jsxs("div", {
													className: "flex flex-col text-left min-w-0",
													children: [/* @__PURE__ */ jsx("span", {
														className: "text-xs font-mono text-white truncate max-w-[170px]",
														children: uploadedFileName || data.cover_image.split("/").pop()
													}), /* @__PURE__ */ jsx("span", {
														className: "text-[10px] font-mono text-emerald-400",
														children: "Optimized WebP • Click to replace"
													})]
												})]
											}), /* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-1 shrink-0",
												children: [/* @__PURE__ */ jsx(Button, {
													type: "button",
													variant: "ghost",
													size: "sm",
													onClick: (e) => {
														e.stopPropagation();
														fileInputRef.current?.click();
													},
													className: "h-7 px-2 text-[10px] font-mono text-neutral-300 hover:text-white",
													children: "Replace"
												}), /* @__PURE__ */ jsx(Button, {
													type: "button",
													variant: "ghost",
													size: "sm",
													onClick: (e) => {
														e.stopPropagation();
														setData("cover_image", "");
														setUploadedFileName(null);
													},
													className: "h-7 px-2 text-[10px] font-mono text-rose-400 hover:text-rose-300 hover:bg-rose-500/10",
													title: "Remove cover image",
													children: /* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5" })
												})]
											})]
										}) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
											className: "w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 group-hover:text-accent group-hover:border-accent/40 group-hover:scale-110 transition-all duration-200",
											children: /* @__PURE__ */ jsx(UploadCloud, { className: "w-5 h-5" })
										}), /* @__PURE__ */ jsxs("div", {
											className: "space-y-0.5",
											children: [/* @__PURE__ */ jsxs("p", {
												className: "text-xs font-medium text-white group-hover:text-accent transition-colors",
												children: [
													/* @__PURE__ */ jsx("span", {
														className: "font-bold underline decoration-accent/60 underline-offset-2",
														children: "Click to upload"
													}),
													" ",
													"or drag & drop"
												]
											}), /* @__PURE__ */ jsx("p", {
												className: "text-[11px] font-mono text-neutral-500",
												children: "PNG, JPG, WEBP, AVIF or GIF (16:9 banner)"
											})]
										})] })]
									}),
									uploadError && /* @__PURE__ */ jsxs("div", {
										className: "flex items-start gap-2 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-mono",
										children: [
											/* @__PURE__ */ jsx(AlertCircle, { className: "w-4 h-4 text-rose-400 shrink-0 mt-0.5" }),
											/* @__PURE__ */ jsx("span", {
												className: "flex-1",
												children: uploadError
											}),
											/* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => setUploadError(null),
												className: "text-rose-400 hover:text-rose-200 cursor-pointer",
												children: /* @__PURE__ */ jsx(X, { className: "w-3.5 h-3.5" })
											})
										]
									}),
									errors.cover_image && /* @__PURE__ */ jsxs("p", {
										className: "text-rose-400 text-xs font-mono flex items-center gap-1 mt-1",
										children: [/* @__PURE__ */ jsx(AlertCircle, { className: "w-3.5 h-3.5" }), errors.cover_image]
									})
								]
							}),
							Boolean(data.cover_image) && /* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5 pt-1",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ jsxs("span", {
										className: "text-[10px] font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5",
										children: [/* @__PURE__ */ jsx(Image, { className: "w-3 h-3 text-accent" }), /* @__PURE__ */ jsx("span", { children: "Live 16:9 Cinema Banner Preview" })]
									}), !imagePreviewError && /* @__PURE__ */ jsxs("a", {
										href: data.cover_image,
										target: "_blank",
										rel: "noreferrer",
										className: "text-[10px] font-mono text-neutral-400 hover:text-accent flex items-center gap-1 transition-colors",
										title: "View full resolution image in new tab",
										children: [/* @__PURE__ */ jsx("span", { children: "Full Size" }), /* @__PURE__ */ jsx(ExternalLink, { className: "w-2.5 h-2.5" })]
									})]
								}), /* @__PURE__ */ jsx("div", {
									className: "relative aspect-video w-full rounded-xl overflow-hidden border border-white/10 bg-[#0c0d12] flex items-center justify-center group/preview shadow-inner",
									children: !imagePreviewError ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("img", {
										src: data.cover_image,
										alt: data.title || "Cover preview",
										onError: () => setImagePreviewError(true),
										className: "w-full h-full object-cover transition-transform duration-500 group-hover/preview:scale-[1.02]"
									}), /* @__PURE__ */ jsxs("div", {
										className: "absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-0 group-hover/preview:opacity-100 transition-opacity duration-200 flex items-end justify-between p-3",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-[10px] font-mono text-neutral-300 truncate max-w-[210px]",
											children: uploadedFileName || data.cover_image.split("/").pop()
										}), /* @__PURE__ */ jsxs("button", {
											type: "button",
											onClick: () => {
												setData("cover_image", "");
												setUploadedFileName(null);
											},
											className: "px-2 py-1 rounded bg-rose-500/80 hover:bg-rose-600 text-white text-[10px] font-mono flex items-center gap-1 transition-colors shadow-lg cursor-pointer",
											children: [/* @__PURE__ */ jsx(Trash2, { className: "w-3 h-3" }), /* @__PURE__ */ jsx("span", { children: "Remove" })]
										})]
									})] }) : /* @__PURE__ */ jsxs("div", {
										className: "flex flex-col items-center gap-2 text-neutral-500 font-mono text-xs p-4 text-center",
										children: [
											/* @__PURE__ */ jsx(Image, { className: "w-8 h-8 opacity-30 text-neutral-400" }),
											/* @__PURE__ */ jsx("span", {
												className: "text-rose-400 text-[11px]",
												children: "Failed to load cover image"
											}),
											/* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => {
													setData("cover_image", "");
													setUploadedFileName(null);
												},
												className: "text-[10px] font-mono text-neutral-400 hover:text-white underline cursor-pointer",
												children: "Remove image"
											})
										]
									})
								})]
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "rounded-xl border border-white/10 bg-[#12131a] p-6 space-y-5 shadow-xl",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between pb-3 border-b border-white/10",
								children: [/* @__PURE__ */ jsxs("span", {
									className: "text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2",
									children: [/* @__PURE__ */ jsx(Layers, { className: "w-4 h-4 text-accent" }), "PUBLISHING HUB"]
								}), /* @__PURE__ */ jsx("span", {
									className: `px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider rounded border ${data.status === "published" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : data.status === "draft" ? "border-amber-500/30 bg-amber-500/10 text-amber-400" : "border-neutral-500/30 bg-neutral-500/10 text-neutral-400"}`,
									children: data.status
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-mono text-neutral-300",
									children: "Publication Stage"
								}), /* @__PURE__ */ jsxs(Select, {
									value: data.status,
									onValueChange: (val) => setData("status", val),
									children: [/* @__PURE__ */ jsx(SelectTrigger, {
										className: "h-11 bg-[#0c0d12] border-white/10 hover:border-white/20 focus:border-accent text-white",
										children: /* @__PURE__ */ jsx(SelectValue, { children: /* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-2 text-sm",
											children: [/* @__PURE__ */ jsx("span", { className: `w-2 h-2 rounded-full ${data.status === "published" ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" : data.status === "draft" ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]" : "bg-neutral-400"}` }), /* @__PURE__ */ jsx("span", {
												className: "font-medium text-white",
												children: data.status === "published" ? "Published (Live to Public)" : data.status === "draft" ? "Draft (Private in Studio)" : "Archived (Unlisted)"
											})]
										}) })
									}), /* @__PURE__ */ jsx(SelectContent, {
										className: "bg-[#0f1118] border-white/15 text-white shadow-2xl",
										children: /* @__PURE__ */ jsxs(SelectGroup, { children: [
											/* @__PURE__ */ jsx(SelectLabel, { children: "PUBLICATION STAGES" }),
											/* @__PURE__ */ jsx(SelectItem, {
												value: "published",
												className: "py-2.5 cursor-pointer",
												children: /* @__PURE__ */ jsxs("div", {
													className: "flex items-center gap-2.5",
													children: [/* @__PURE__ */ jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)] shrink-0" }), /* @__PURE__ */ jsxs("div", {
														className: "flex flex-col text-left",
														children: [/* @__PURE__ */ jsx("span", {
															className: "font-medium text-white text-sm",
															children: "Published"
														}), /* @__PURE__ */ jsx("span", {
															className: "text-[11px] font-mono text-neutral-400",
															children: "Live & indexable across public journal"
														})]
													})]
												})
											}),
											/* @__PURE__ */ jsx(SelectItem, {
												value: "draft",
												className: "py-2.5 cursor-pointer",
												children: /* @__PURE__ */ jsxs("div", {
													className: "flex items-center gap-2.5",
													children: [/* @__PURE__ */ jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)] shrink-0" }), /* @__PURE__ */ jsxs("div", {
														className: "flex flex-col text-left",
														children: [/* @__PURE__ */ jsx("span", {
															className: "font-medium text-white text-sm",
															children: "Draft"
														}), /* @__PURE__ */ jsx("span", {
															className: "text-[11px] font-mono text-neutral-400",
															children: "Private to workspace editorial team"
														})]
													})]
												})
											}),
											/* @__PURE__ */ jsx(SelectItem, {
												value: "archived",
												className: "py-2.5 cursor-pointer",
												children: /* @__PURE__ */ jsxs("div", {
													className: "flex items-center gap-2.5",
													children: [/* @__PURE__ */ jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-neutral-400 shrink-0" }), /* @__PURE__ */ jsxs("div", {
														className: "flex flex-col text-left",
														children: [/* @__PURE__ */ jsx("span", {
															className: "font-medium text-white text-sm",
															children: "Archived"
														}), /* @__PURE__ */ jsx("span", {
															className: "text-[11px] font-mono text-neutral-400",
															children: "Unlisted and hidden from search feeds"
														})]
													})]
												})
											})
										] })
									})]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between p-3 rounded-lg border border-white/5 bg-[#0c0d12]/60",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "space-y-0.5",
									children: [/* @__PURE__ */ jsxs("label", {
										className: "text-xs font-mono text-white cursor-pointer flex items-center gap-1.5",
										children: [/* @__PURE__ */ jsx("span", { children: "Featured Article" }), data.is_featured && /* @__PURE__ */ jsx(Badge, {
											className: "bg-accent text-black text-[9px] font-mono font-bold px-1 py-0 h-4",
											children: "HERO"
										})]
									}), /* @__PURE__ */ jsx("p", {
										className: "text-[11px] text-neutral-400 font-mono",
										children: "Pin to top of public journal"
									})]
								}), /* @__PURE__ */ jsx(Switch, {
									checked: data.is_featured,
									onCheckedChange: (checked) => setData("is_featured", checked)
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "pt-2 space-y-2.5",
								children: [
									/* @__PURE__ */ jsxs(Button, {
										type: "submit",
										disabled: processing,
										className: "w-full h-11 bg-accent hover:bg-[#b8dd00] text-black font-mono font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(251, 183, 24, 0.15)] transition-all",
										children: [/* @__PURE__ */ jsx(Save, { className: "w-4 h-4" }), /* @__PURE__ */ jsx("span", { children: processing ? isEdit ? "Saving Updates..." : "Publishing..." : isEdit ? "Save Article Changes" : "Publish Article" })]
									}),
									/* @__PURE__ */ jsx(Link, {
										href: $("admin.blogs.index"),
										className: "block w-full",
										children: /* @__PURE__ */ jsxs(Button, {
											type: "button",
											variant: "outline",
											className: "w-full h-9 border-white/10 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white font-mono text-xs gap-2 cursor-pointer",
											children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Discard & Return to List" })]
										})
									}),
									isEdit && blog && blog.slug && /* @__PURE__ */ jsx("a", {
										href: `/blog/${blog.slug}`,
										target: "_blank",
										rel: "noreferrer",
										className: "block w-full",
										children: /* @__PURE__ */ jsxs(Button, {
											type: "button",
											variant: "ghost",
											className: "w-full h-8 text-[11px] font-mono text-neutral-400 hover:text-white hover:bg-white/5 gap-1.5 cursor-pointer",
											children: [
												/* @__PURE__ */ jsx(Eye, { className: "w-3 h-3 text-accent" }),
												/* @__PURE__ */ jsx("span", { children: "Preview Public Article" }),
												/* @__PURE__ */ jsx(ExternalLink, { className: "w-2.5 h-2.5" })
											]
										})
									})
								]
							})
						]
					})
				]
			})]
		})]
	});
}
//#endregion
export { BlogForm };
