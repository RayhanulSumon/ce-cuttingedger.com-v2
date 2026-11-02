import { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { ArrowRight, CheckCircle2, Upload, Zap } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/HomeVariants/HomeConversion.tsx
function HomeConversion({ clients = [] }) {
	const [submitted, setSubmitted] = useState(false);
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-white text-[#0F172A] selection:bg-[#de4a2c] selection:text-white font-sans antialiased overflow-x-hidden",
		children: [/* @__PURE__ */ jsx(Head, { children: /* @__PURE__ */ jsx("title", { children: "CuttingEdger — Scale Your E-Commerce Visuals" }) }), /* @__PURE__ */ jsxs("section", {
			className: "pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "text-center max-w-3xl mx-auto mb-8",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#de4a2c]/10 text-[#de4a2c] text-xs font-bold uppercase tracking-wider mb-4",
							children: [/* @__PURE__ */ jsx(Zap, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Over 2,400,000+ Product Images Delivered" })]
						}),
						/* @__PURE__ */ jsxs("h1", {
							className: "text-4xl sm:text-6xl font-extrabold tracking-tight text-neutral-900 leading-tight",
							children: [
								"Flawless Product Cutouts & Retouching.",
								" ",
								/* @__PURE__ */ jsx("span", {
									className: "text-[#de4a2c]",
									children: "Delivered in 4 Hours."
								})
							]
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-4 text-neutral-600 text-base sm:text-lg",
							children: "Stop waiting days for catalog assets. Get hand-drawn clipping paths, invisible mannequins, and color matching with zero risk."
						})
					]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "max-w-2xl mx-auto p-8 rounded-3xl bg-neutral-50 border border-neutral-200 shadow-xl",
					children: !submitted ? /* @__PURE__ */ jsxs("form", {
						onSubmit: (e) => {
							e.preventDefault();
							setSubmitted(true);
						},
						className: "space-y-4",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "p-8 rounded-2xl border-2 border-dashed border-[#de4a2c]/40 hover:border-[#de4a2c] bg-white text-center cursor-pointer transition-colors",
								children: [
									/* @__PURE__ */ jsx(Upload, { className: "w-8 h-8 text-[#de4a2c] mx-auto mb-2" }),
									/* @__PURE__ */ jsx("div", {
										className: "text-sm font-bold text-neutral-800",
										children: "Drop 1-3 Sample Files Here"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-xs text-neutral-500 mt-1",
										children: "Get free retouched files in hours"
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
								children: [/* @__PURE__ */ jsx("input", {
									type: "text",
									required: true,
									placeholder: "Your Name",
									className: "px-4 py-3 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#de4a2c]"
								}), /* @__PURE__ */ jsx("input", {
									type: "email",
									required: true,
									placeholder: "Work Email",
									className: "px-4 py-3 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#de4a2c]"
								})]
							}),
							/* @__PURE__ */ jsxs("button", {
								type: "submit",
								className: "w-full py-4 rounded-full bg-[#de4a2c] hover:bg-[#c2381c] text-white font-extrabold text-sm tracking-wide transition-colors shadow-lg flex items-center justify-center gap-2 cursor-pointer",
								children: [/* @__PURE__ */ jsx("span", { children: "Get Free Sample Batch" }), /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })]
							})
						]
					}) : /* @__PURE__ */ jsxs("div", {
						className: "p-8 text-center space-y-3",
						children: [
							/* @__PURE__ */ jsx(CheckCircle2, { className: "w-12 h-12 text-emerald-500 mx-auto" }),
							/* @__PURE__ */ jsx("h3", {
								className: "text-2xl font-bold",
								children: "Files Queued for Free Retouching"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-sm text-neutral-600",
								children: "Our studio team is working on your batch right now."
							}),
							/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setSubmitted(false),
								className: "text-xs font-bold text-[#de4a2c] underline",
								children: "Upload more images"
							})
						]
					})
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-8 text-center",
					children: /* @__PURE__ */ jsxs(Link, {
						href: "/services/ecommerce-catalog-optimization/clipping-path-service?v=4",
						className: "text-xs font-bold text-[#de4a2c] hover:underline inline-flex items-center gap-1",
						children: [/* @__PURE__ */ jsx("span", { children: "Preview Conversion Service Layout (Variant 04)" }), /* @__PURE__ */ jsx(ArrowRight, { className: "w-3.5 h-3.5" })]
					})
				})
			]
		})]
	});
}
//#endregion
export { HomeConversion };
