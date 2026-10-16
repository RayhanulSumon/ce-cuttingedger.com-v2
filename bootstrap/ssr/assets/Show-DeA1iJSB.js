import { t as SeoHead } from "./SeoHead-CXtfHcil.js";
import { t as PageHero } from "./PageHero-KJiKVDpm.js";
import "react";
import { Link } from "@inertiajs/react";
import { ArrowUpRight } from "lucide-react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Team/Show.tsx
function Show({ member }) {
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(SeoHead, {
			title: `${member.name} — ${member.role}`,
			description: member.bio,
			image: member.avatar
		}),
		/* @__PURE__ */ jsx(PageHero, {
			eyebrow: `COLLECTIVE // SINCE ${member.since_year}`,
			title: member.name,
			description: member.role,
			backUrl: "/team",
			backLabel: "Back to Collective"
		}),
		/* @__PURE__ */ jsx("section", {
			className: "py-20 bg-[#0a0b0e]",
			children: /* @__PURE__ */ jsx("div", {
				className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
				children: /* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 lg:grid-cols-12 gap-12 items-start",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "lg:col-span-5",
						children: [/* @__PURE__ */ jsx("div", {
							className: "rounded-3xl overflow-hidden border border-white/10 bg-neutral-900 aspect-[4/5] shadow-2xl",
							children: /* @__PURE__ */ jsx("img", {
								src: member.avatar,
								alt: member.name,
								className: "w-full h-full object-cover contrast-110"
							})
						}), /* @__PURE__ */ jsxs("div", {
							className: "mt-6 p-6 rounded-2xl bg-[#12141c] border border-white/10 flex items-center justify-between",
							children: [/* @__PURE__ */ jsx("span", {
								className: "font-mono text-xs uppercase tracking-widest text-neutral-400",
								children: "Direct Channels"
							}), /* @__PURE__ */ jsx("div", {
								className: "flex items-center gap-4 text-xs font-mono uppercase",
								children: Object.entries(member.social_links || {}).map(([network, url]) => /* @__PURE__ */ jsx("a", {
									href: url,
									target: "_blank",
									rel: "noopener noreferrer",
									className: "text-white hover:text-[#d4ff00] transition-colors",
									children: network
								}, network))
							})]
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "lg:col-span-7 space-y-10",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "font-mono text-xs uppercase tracking-widest text-[#d4ff00]",
									children: "[ BIOGRAPHY & BACKGROUND ]"
								}),
								/* @__PURE__ */ jsx("h2", {
									className: "text-3xl font-display font-bold text-white",
									children: "Obsessed with high-velocity aesthetics."
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-neutral-300 text-lg leading-relaxed",
									children: member.bio
								})
							]
						}), member.posts && member.posts.length > 0 && /* @__PURE__ */ jsxs("div", {
							className: "pt-8 border-t border-white/10 space-y-6",
							children: [/* @__PURE__ */ jsx("span", {
								className: "font-mono text-xs uppercase tracking-widest text-neutral-400 block",
								children: "Authored Articles & Research"
							}), /* @__PURE__ */ jsx("div", {
								className: "space-y-4",
								children: member.posts.map((post) => /* @__PURE__ */ jsxs(Link, {
									href: `/blog/${post.slug}`,
									className: "group p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#d4ff00]/40 flex items-center justify-between transition-colors",
									children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
										className: "font-display font-bold text-white group-hover:text-[#d4ff00] transition-colors",
										children: post.title
									}), /* @__PURE__ */ jsxs("span", {
										className: "text-xs font-mono text-neutral-500",
										children: [post.reading_time, " min read"]
									})] }), /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4 text-neutral-500 group-hover:text-[#d4ff00]" })]
								}, post.id))
							})]
						})]
					})]
				})
			})
		})
	] });
}
//#endregion
export { Show as default };
