import { useState } from "react";
import { Check, CheckCircle2, Copy, Palette } from "lucide-react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Services/Variants/VariantSwitcher.tsx
var VARIANT_OPTIONS = [
	{
		id: "minimalist",
		num: "01",
		name: "Minimalist Studio",
		tagline: "Apple Pro / Aesop Studio Luxury (Airy #F8F9FA, Clean Cards)",
		badge: "LUXURY CLEAN",
		accent: "#10B981"
	},
	{
		id: "editorial",
		num: "02",
		name: "Editorial Lookbook",
		tagline: "Vogue / SSENSE High-Fashion (Editorial Typography, Serif Pull Quotes)",
		badge: "FASHION ATELIER",
		accent: "#D97706"
	},
	{
		id: "technical",
		num: "03",
		name: "Technical Lab",
		tagline: "Linear / Figma Workbench (Blueprint Grid, Monospace Specs HUD)",
		badge: "SPEC WORKBENCH",
		accent: "#06B6D4"
	},
	{
		id: "conversion",
		num: "04",
		name: "High-Conversion",
		tagline: "Shopify Plus / SaaS Engine (Dropzone Hero, Trust Scores, SLA Guarantee)",
		badge: "HIGH-VELOCITY E-COM",
		accent: "#2563EB"
	},
	{
		id: "obsidian",
		num: "05",
		name: "Dark Obsidian",
		tagline: "Obsidian Velvet Craft (Ambient Radial Glow, Translucent Glass Cards)",
		badge: "OBSIDIAN LUXURY",
		accent: "#8B5CF6"
	}
];
var VariantSwitcher = ({ currentVariant, onSelectVariant, serviceTitle }) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [copied, setCopied] = useState(false);
	const [confirmedDesign, setConfirmedDesign] = useState(null);
	const activeOption = VARIANT_OPTIONS.find((v) => v.id === currentVariant) || VARIANT_OPTIONS[0];
	const handleCopyLink = () => {
		const url = new URL(window.location.href);
		url.searchParams.set("v", currentVariant);
		navigator.clipboard.writeText(url.toString());
		setCopied(true);
		setTimeout(() => setCopied(false), 2200);
	};
	const handleConfirmDesign = () => {
		setConfirmedDesign(activeOption.name);
		setTimeout(() => setConfirmedDesign(null), 3500);
	};
	return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs("div", {
		className: "fixed bottom-5 inset-x-0 z-50 flex flex-col items-center pointer-events-none px-4",
		children: [confirmedDesign && /* @__PURE__ */ jsxs("div", {
			className: "mb-3 px-5 py-2.5 rounded-full bg-[#0F0F12] text-white border border-emerald-500/50 shadow-2xl flex items-center gap-2.5 text-xs font-bold pointer-events-auto animate-bounce",
			children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4 text-emerald-400" }), /* @__PURE__ */ jsxs("span", { children: [
				"Selected ",
				/* @__PURE__ */ jsx("span", {
					className: "text-emerald-400 font-extrabold",
					children: confirmedDesign
				}),
				" as your preferred service layout!"
			] })]
		}), /* @__PURE__ */ jsx("div", {
			className: "pointer-events-auto max-w-4xl w-full bg-[#0F0F12]/95 backdrop-blur-2xl text-white rounded-2xl sm:rounded-full border border-white/15 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all",
			children: /* @__PURE__ */ jsxs("div", {
				className: "flex flex-col sm:flex-row items-center justify-between gap-2 px-2 py-1",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2.5 shrink-0",
						children: [/* @__PURE__ */ jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" }), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-1.5 text-xs font-extrabold tracking-wide",
							children: [
								/* @__PURE__ */ jsx(Palette, { className: "w-3.5 h-3.5 text-emerald-400" }),
								/* @__PURE__ */ jsx("span", {
									className: "text-neutral-300",
									children: "Layout Variant:"
								}),
								/* @__PURE__ */ jsxs("span", {
									className: "text-white bg-white/10 px-2 py-0.5 rounded-md font-mono text-[11px]",
									children: [activeOption.num, " / 05"]
								})
							]
						})]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "flex items-center gap-1 overflow-x-auto no-scrollbar max-w-full py-1",
						children: VARIANT_OPTIONS.map((opt) => {
							const isActive = opt.id === currentVariant;
							return /* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => onSelectVariant(opt.id),
								className: `px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${isActive ? "bg-white text-[#0F0F12] shadow-md scale-105" : "text-neutral-300 hover:text-white hover:bg-white/10"}`,
								children: [/* @__PURE__ */ jsx("span", {
									className: "w-1.5 h-1.5 rounded-full",
									style: { backgroundColor: opt.accent }
								}), /* @__PURE__ */ jsx("span", { children: opt.name })]
							}, opt.id);
						})
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-1.5 shrink-0",
						children: [/* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: handleCopyLink,
							className: "px-2.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors",
							title: "Copy shareable link with this layout variant",
							children: [copied ? /* @__PURE__ */ jsx(Check, { className: "w-3.5 h-3.5 text-emerald-400" }) : /* @__PURE__ */ jsx(Copy, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", {
								className: "hidden md:inline",
								children: copied ? "Copied" : "Share Link"
							})]
						}), /* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: handleConfirmDesign,
							className: "px-3.5 py-1.5 rounded-full bg-emerald-400 hover:bg-emerald-300 text-[#0F0F12] text-xs font-extrabold transition-all shadow-sm flex items-center gap-1",
							title: "Select this layout style",
							children: [/* @__PURE__ */ jsx(Check, { className: "w-3.5 h-3.5 stroke-[3]" }), /* @__PURE__ */ jsx("span", { children: "Select This" })]
						})]
					})
				]
			})
		})]
	}) });
};
//#endregion
export { VARIANT_OPTIONS, VariantSwitcher };
