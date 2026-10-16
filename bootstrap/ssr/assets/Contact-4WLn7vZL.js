import { t as SeoHead } from "./SeoHead-CXtfHcil.js";
import { t as PageHero } from "./PageHero-KJiKVDpm.js";
import "react";
import { useForm } from "@inertiajs/react";
import { CheckCircle2, Mail, MapPin, Phone, Send } from "lucide-react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Contact.tsx
function Contact() {
	const { data, setData, post, processing, wasSuccessful, reset } = useForm({
		name: "",
		email: "",
		company: "",
		budget: "$25k - $50k",
		service_interest: "Product Design & Web",
		message: "",
		honeypot: ""
	});
	const budgetTiers = [
		"< $15k",
		"$15k - $30k",
		"$30k - $60k",
		"$60k+"
	];
	const serviceOptions = [
		"Product Design & UX",
		"Brand Architecture",
		"Kinetic 3D & Motion",
		"Creative Full-Stack Web",
		"Complete Flagship Build"
	];
	const handleSubmit = (e) => {
		e.preventDefault();
		post("/contact", {
			preserveScroll: true,
			onSuccess: () => reset()
		});
	};
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(SeoHead, {
			title: "Initiate Project Commission",
			description: "Connect with the partners at CuttingEdger. Let's discuss your next digital flagship or category transformation."
		}),
		/* @__PURE__ */ jsx(PageHero, {
			eyebrow: "DIRECT ACCESS",
			title: "LET’S INVENT THE",
			highlight: "NEXT FRONTIER.",
			description: "We partner with a maximum of 4 clients concurrently to guarantee undivided focus, velocity, and uncompromised craft."
		}),
		/* @__PURE__ */ jsx("section", {
			className: "py-24 bg-[#0a0b0e]",
			children: /* @__PURE__ */ jsx("div", {
				className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
				children: /* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 lg:grid-cols-12 gap-12",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "lg:col-span-7 p-8 sm:p-12 rounded-3xl bg-[#12141c] border border-white/10 shadow-2xl",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "font-mono text-xs uppercase tracking-widest text-[#d4ff00] block mb-2",
								children: "[ TRANSMISSION PROTOCOL ]"
							}),
							/* @__PURE__ */ jsx("h2", {
								className: "text-3xl font-display font-bold text-white mb-8",
								children: "Project Brief"
							}),
							wasSuccessful ? /* @__PURE__ */ jsxs("div", {
								className: "p-8 rounded-2xl bg-[#d4ff00]/10 border border-[#d4ff00] text-center space-y-4",
								children: [
									/* @__PURE__ */ jsx(CheckCircle2, { className: "w-12 h-12 text-[#d4ff00] mx-auto" }),
									/* @__PURE__ */ jsx("h3", {
										className: "text-2xl font-display font-bold text-white",
										children: "Transmission Acknowledged."
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-neutral-300 text-sm max-w-md mx-auto",
										children: "Your brief has landed in our studio terminal. Elena or Marcus will review your parameters and follow up within 24 business hours."
									})
								]
							}) : /* @__PURE__ */ jsxs("form", {
								onSubmit: handleSubmit,
								className: "space-y-6",
								children: [
									/* @__PURE__ */ jsx("input", {
										type: "text",
										name: "website_url",
										value: data.honeypot,
										onChange: (e) => setData("honeypot", e.target.value),
										tabIndex: -1,
										autoComplete: "off",
										className: "hidden",
										"aria-hidden": "true"
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "grid grid-cols-1 sm:grid-cols-2 gap-6",
										children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
											className: "block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2",
											children: "Your Name *"
										}), /* @__PURE__ */ jsx("input", {
											type: "text",
											required: true,
											value: data.name,
											onChange: (e) => setData("name", e.target.value),
											placeholder: "Dr. Jessica Vance",
											className: "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#d4ff00] transition-colors"
										})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
											className: "block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2",
											children: "Email Address *"
										}), /* @__PURE__ */ jsx("input", {
											type: "email",
											required: true,
											value: data.email,
											onChange: (e) => setData("email", e.target.value),
											placeholder: "jessica@quantum.io",
											className: "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#d4ff00] transition-colors"
										})] })]
									}),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2",
										children: "Company / Venture Name"
									}), /* @__PURE__ */ jsx("input", {
										type: "text",
										value: data.company,
										onChange: (e) => setData("company", e.target.value),
										placeholder: "Quantum Dynamics Inc.",
										className: "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#d4ff00] transition-colors"
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2",
										children: "Primary Discipline"
									}), /* @__PURE__ */ jsx("div", {
										className: "flex flex-wrap gap-2",
										children: serviceOptions.map((opt) => /* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: () => setData("service_interest", opt),
											className: `px-3.5 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer ${data.service_interest === opt ? "bg-[#d4ff00] text-black font-bold" : "bg-white/5 text-neutral-400 border border-white/10 hover:border-white/20"}`,
											children: opt
										}, opt))
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2",
										children: "Anticipated Capital Allocation"
									}), /* @__PURE__ */ jsx("div", {
										className: "grid grid-cols-2 sm:grid-cols-4 gap-2",
										children: budgetTiers.map((b) => /* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: () => setData("budget", b),
											className: `px-3 py-2.5 rounded-lg text-xs font-mono text-center transition-colors cursor-pointer ${data.budget === b ? "bg-[#d4ff00] text-black font-bold" : "bg-white/5 text-neutral-400 border border-white/10 hover:border-white/20"}`,
											children: b
										}, b))
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2",
										children: "Project Vision & Scope *"
									}), /* @__PURE__ */ jsx("textarea", {
										required: true,
										rows: 4,
										value: data.message,
										onChange: (e) => setData("message", e.target.value),
										placeholder: "Tell us about the problem, timeline, references, and ideal outcome...",
										className: "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#d4ff00] transition-colors"
									})] }),
									/* @__PURE__ */ jsxs("button", {
										type: "submit",
										disabled: processing,
										className: "w-full bg-[#d4ff00] text-black font-display font-bold py-4 px-6 rounded-xl hover:bg-[#c2eb00] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_25px_rgba(212,255,0,0.25)] disabled:opacity-50",
										children: [/* @__PURE__ */ jsx("span", { children: processing ? "Transmitting..." : "Dispatch Project Brief" }), /* @__PURE__ */ jsx(Send, { className: "w-4 h-4" })]
									})
								]
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "lg:col-span-5 space-y-8",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "p-8 rounded-3xl bg-[#12141c] border border-white/10 space-y-6",
							children: [/* @__PURE__ */ jsx("span", {
								className: "font-mono text-xs uppercase tracking-widest text-[#d4ff00] block",
								children: "[ PHYSICAL & DIGITAL PRESENCE ]"
							}), /* @__PURE__ */ jsxs("div", {
								className: "space-y-4",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-start gap-3",
										children: [/* @__PURE__ */ jsx("div", {
											className: "p-2.5 rounded-xl bg-white/5 text-[#d4ff00] mt-0.5",
											children: /* @__PURE__ */ jsx(MapPin, { className: "w-5 h-5" })
										}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
											className: "font-mono text-xs text-neutral-400 uppercase block",
											children: "San Francisco Studio"
										}), /* @__PURE__ */ jsx("p", {
											className: "text-white text-sm font-medium",
											children: "742 Mission St, Design District, San Francisco, CA 94103"
										})] })]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-start gap-3",
										children: [/* @__PURE__ */ jsx("div", {
											className: "p-2.5 rounded-xl bg-white/5 text-[#d4ff00] mt-0.5",
											children: /* @__PURE__ */ jsx(Mail, { className: "w-5 h-5" })
										}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
											className: "font-mono text-xs text-neutral-400 uppercase block",
											children: "Inbound Commissions"
										}), /* @__PURE__ */ jsx("a", {
											href: "mailto:hello@cuttingedger.com",
											className: "text-white hover:text-[#d4ff00] text-sm font-medium transition-colors",
											children: "hello@cuttingedger.com"
										})] })]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-start gap-3",
										children: [/* @__PURE__ */ jsx("div", {
											className: "p-2.5 rounded-xl bg-white/5 text-[#d4ff00] mt-0.5",
											children: /* @__PURE__ */ jsx(Phone, { className: "w-5 h-5" })
										}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
											className: "font-mono text-xs text-neutral-400 uppercase block",
											children: "Studio Switchboard"
										}), /* @__PURE__ */ jsx("a", {
											href: "tel:+18005553343",
											className: "text-white hover:text-[#d4ff00] text-sm font-medium transition-colors",
											children: "+1 (800) 555-EDGE"
										})] })]
									})
								]
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "relative rounded-3xl overflow-hidden border border-white/10 bg-[#0e1018] p-6 text-center space-y-4",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "font-mono text-xs uppercase tracking-widest text-neutral-400 block",
									children: "Studio Radar Coordinates"
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "relative w-full aspect-[16/10] bg-[#0c0d12] rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center",
									children: [
										/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-grain opacity-40" }),
										/* @__PURE__ */ jsx("div", { className: "absolute inset-0 [background:radial-gradient(#2d3345_1px,transparent_1px)] [background-size:16px_16px]" }),
										/* @__PURE__ */ jsx("div", {
											className: "w-32 h-32 rounded-full border border-white/10 flex items-center justify-center animate-ping",
											style: { animationDuration: "4s" }
										}),
										/* @__PURE__ */ jsx("div", { className: "absolute w-24 h-24 rounded-full border border-[#d4ff00]/30 flex items-center justify-center" }),
										/* @__PURE__ */ jsx("div", { className: "absolute w-3 h-3 rounded-full bg-[#d4ff00] shadow-[0_0_15px_#d4ff00]" }),
										/* @__PURE__ */ jsx("div", {
											className: "absolute bottom-3 left-3 bg-black/80 px-2.5 py-1 rounded text-[10px] font-mono text-[#d4ff00]",
											children: "37.7749° N, 122.4194° W"
										})
									]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-xs text-neutral-500 font-mono",
									children: "In-person studio workshops by appointment only."
								})
							]
						})]
					})]
				})
			})
		})
	] });
}
//#endregion
export { Contact as default };
