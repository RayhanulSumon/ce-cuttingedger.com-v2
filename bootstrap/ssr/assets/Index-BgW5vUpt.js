import { t as SeoHead } from "./SeoHead-CXtfHcil.js";
import { t as PageHero } from "./PageHero-KJiKVDpm.js";
import "react";
import { Link } from "@inertiajs/react";
import { ArrowUpRight } from "lucide-react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Team/Index.tsx
function Index({ members = [] }) {
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(SeoHead, {
			title: "Leadership & Creative Fellows",
			description: "Meet the founders, creative directors, and systems architects behind CuttingEdger."
		}),
		/* @__PURE__ */ jsx(PageHero, {
			eyebrow: "STUDIO COLLECTIVE",
			title: "THE MINDS BEHIND",
			highlight: "THE MACHINE.",
			description: "A multidisciplinary squad of senior designers, software architects, and brand strategists operating with zero corporate bloat."
		}),
		/* @__PURE__ */ jsx("section", {
			className: "py-24 bg-[#0a0b0e]",
			children: /* @__PURE__ */ jsx("div", {
				className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
				children: /* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8",
					children: members.map((member) => /* @__PURE__ */ jsxs(Link, {
						href: `/team/${member.slug}`,
						className: "group rounded-3xl bg-[#12141c] border border-white/10 overflow-hidden flex flex-col justify-between hover:border-[#d4ff00]/50 transition-all duration-300",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "relative aspect-[4/5] bg-neutral-900 overflow-hidden",
							children: [
								/* @__PURE__ */ jsx("img", {
									src: member.avatar,
									alt: member.name,
									loading: "lazy",
									className: "w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 ease-out"
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[11px] font-mono uppercase tracking-wider text-[#d4ff00]",
									children: ["Since ", member.since_year]
								}),
								/* @__PURE__ */ jsx("div", {
									className: "absolute bottom-4 right-4 w-9 h-9 rounded-full bg-[#d4ff00] text-black opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300",
									children: /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-5 h-5" })
								})
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "p-6 space-y-2",
							children: [
								/* @__PURE__ */ jsx("h3", {
									className: "font-display font-bold text-2xl text-white group-hover:text-[#d4ff00] transition-colors",
									children: member.name
								}),
								/* @__PURE__ */ jsx("p", {
									className: "font-mono text-xs text-neutral-400",
									children: member.role
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-xs text-neutral-500 line-clamp-2 pt-2 leading-relaxed",
									children: member.bio
								})
							]
						})]
					}, member.id || member.slug))
				})
			})
		})
	] });
}
//#endregion
export { Index as default };
