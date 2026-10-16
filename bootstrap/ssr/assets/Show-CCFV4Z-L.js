import { t as SeoHead } from "./SeoHead-CXtfHcil.js";
import { t as PageHero } from "./PageHero-KJiKVDpm.js";
import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Careers/Show.tsx
function Show({ job }) {
	const [applied, setApplied] = useState(false);
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(SeoHead, {
			title: `${job.title} — Careers`,
			description: job.overview
		}),
		/* @__PURE__ */ jsx(PageHero, {
			eyebrow: `CAREERS // ${job.department}`,
			title: job.title,
			description: job.overview,
			backUrl: "/careers",
			backLabel: "All Open Positions"
		}),
		/* @__PURE__ */ jsx("section", {
			className: "py-20 bg-[#0a0b0e]",
			children: /* @__PURE__ */ jsx("div", {
				className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
				children: /* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 lg:grid-cols-12 gap-12",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "lg:col-span-8 space-y-12",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-4",
								children: [/* @__PURE__ */ jsx("h3", {
									className: "text-2xl font-display font-bold text-white",
									children: "What You Will Champion"
								}), /* @__PURE__ */ jsx("ul", {
									className: "space-y-3",
									children: job.responsibilities?.map((item, i) => /* @__PURE__ */ jsxs("li", {
										className: "flex items-start gap-3 text-sm sm:text-base text-neutral-300",
										children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5 text-[#d4ff00] shrink-0 mt-0.5" }), /* @__PURE__ */ jsx("span", { children: item })]
									}, i))
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-4 pt-6 border-t border-white/10",
								children: [/* @__PURE__ */ jsx("h3", {
									className: "text-2xl font-display font-bold text-white",
									children: "What You Bring To The Table"
								}), /* @__PURE__ */ jsx("ul", {
									className: "space-y-3",
									children: job.requirements?.map((req, i) => /* @__PURE__ */ jsxs("li", {
										className: "flex items-start gap-3 text-sm sm:text-base text-neutral-300",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-[#d4ff00] font-mono font-bold",
											children: "→"
										}), /* @__PURE__ */ jsx("span", { children: req })]
									}, i))
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-4 pt-6 border-t border-white/10",
								children: [/* @__PURE__ */ jsx("h3", {
									className: "text-2xl font-display font-bold text-white",
									children: "Perks & Compensation"
								}), /* @__PURE__ */ jsx("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
									children: job.benefits?.map((ben, i) => /* @__PURE__ */ jsx("div", {
										className: "p-4 rounded-xl bg-white/[0.02] border border-white/5 text-sm text-neutral-300 font-mono",
										children: ben
									}, i))
								})]
							})
						]
					}), /* @__PURE__ */ jsx("div", {
						className: "lg:col-span-4",
						children: /* @__PURE__ */ jsxs("div", {
							className: "sticky top-28 p-8 rounded-3xl bg-[#12141c] border border-white/10 space-y-6",
							children: [/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("span", {
									className: "font-mono text-xs uppercase tracking-widest text-[#d4ff00] block mb-2",
									children: "READY TO APPLY?"
								}),
								/* @__PURE__ */ jsx("h4", {
									className: "text-xl font-display font-bold text-white",
									children: "Send Your Portfolio"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-xs text-neutral-400 mt-1",
									children: "Send your GitHub, live flagships, or Figma file directly to our talent team."
								})
							] }), applied ? /* @__PURE__ */ jsx("div", {
								className: "p-4 rounded-xl bg-[#d4ff00]/10 border border-[#d4ff00] text-[#d4ff00] text-xs font-mono",
								children: "Application link received! We will inspect your portfolio within 48 hours."
							}) : /* @__PURE__ */ jsxs("form", {
								onSubmit: (e) => {
									e.preventDefault();
									setApplied(true);
								},
								className: "space-y-4",
								children: [
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-xs font-mono text-neutral-400 mb-1",
										children: "Full Name"
									}), /* @__PURE__ */ jsx("input", {
										type: "text",
										required: true,
										placeholder: "Ada Lovelace",
										className: "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d4ff00]"
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-xs font-mono text-neutral-400 mb-1",
										children: "Email"
									}), /* @__PURE__ */ jsx("input", {
										type: "email",
										required: true,
										placeholder: "ada@domain.com",
										className: "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d4ff00]"
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-xs font-mono text-neutral-400 mb-1",
										children: "Portfolio / GitHub URL"
									}), /* @__PURE__ */ jsx("input", {
										type: "url",
										required: true,
										placeholder: "https://github.com/...",
										className: "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d4ff00]"
									})] }),
									/* @__PURE__ */ jsxs("button", {
										type: "submit",
										className: "w-full bg-[#d4ff00] text-black font-display font-bold py-3.5 px-6 rounded-xl hover:bg-[#c2eb00] flex items-center justify-center gap-2 transition-colors cursor-pointer",
										children: [/* @__PURE__ */ jsx("span", { children: "Transmit Application" }), /* @__PURE__ */ jsx(Send, { className: "w-4 h-4" })]
									})
								]
							})]
						})
					})]
				})
			})
		})
	] });
}
//#endregion
export { Show as default };
