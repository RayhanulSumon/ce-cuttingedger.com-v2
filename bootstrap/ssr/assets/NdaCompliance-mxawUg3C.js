import { t as SeoHead } from "./SeoHead-jRblvokC.js";
import { t as PageHero } from "./PageHero-BKafzHM7.js";
import "react";
import { EyeOff, Lock, Server, ShieldCheck } from "lucide-react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Trust/NdaCompliance.tsx
function NdaCompliance() {
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(SeoHead, {
			title: "NDA & Security Compliance Protocols",
			description: "Cutting Edger operates under ironclad non-disclosure and institutional data protection protocols for enterprise brands and agency partners.",
			breadcrumbs: [{
				name: "Home",
				url: "/"
			}, {
				name: "NDA Compliance",
				url: "/nda-compliance"
			}]
		}),
		/* @__PURE__ */ jsx(PageHero, {
			eyebrow: "INSTITUTIONAL SECURITY",
			title: "NDA & CLIENT",
			highlight: "CONFIDENTIALITY.",
			description: "We guard unreleased product collections, embargoed fashion campaigns, and proprietary CAD models with military-grade rigor."
		}),
		/* @__PURE__ */ jsx("section", {
			className: "py-20 bg-[#0a0b0e]",
			children: /* @__PURE__ */ jsxs("div", {
				className: "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 md:grid-cols-3 gap-6",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "p-8 rounded-3xl bg-[#12141c] border border-white/10 space-y-4",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "w-10 h-10 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent",
									children: /* @__PURE__ */ jsx(Lock, { className: "w-5 h-5" })
								}),
								/* @__PURE__ */ jsx("h3", {
									className: "text-lg font-display font-bold text-white",
									children: "Mutual NDA Binding"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-xs text-neutral-400 leading-relaxed",
									children: "Every project is executed under bilateral non-disclosure terms. Every employee signs binding intellectual property assignment and confidentiality clauses."
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "p-8 rounded-3xl bg-[#12141c] border border-white/10 space-y-4",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "w-10 h-10 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent",
									children: /* @__PURE__ */ jsx(Server, { className: "w-5 h-5" })
								}),
								/* @__PURE__ */ jsx("h3", {
									className: "text-lg font-display font-bold text-white",
									children: "Encrypted Transit & Storage"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-xs text-neutral-400 leading-relaxed",
									children: "End-to-end TLS 1.3 encryption in transit and AES-256 encryption at rest across dedicated AWS S3 private buckets and dedicated SFTP servers."
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "p-8 rounded-3xl bg-[#12141c] border border-white/10 space-y-4",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "w-10 h-10 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent",
									children: /* @__PURE__ */ jsx(EyeOff, { className: "w-5 h-5" })
								}),
								/* @__PURE__ */ jsx("h3", {
									className: "text-lg font-display font-bold text-white",
									children: "Air-Gapped Studio Controls"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-xs text-neutral-400 leading-relaxed",
									children: "Strict workstation USB lockdown, biometric facility entrance controls, zero external recording devices allowed on production floors."
								})
							]
						})
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "p-8 sm:p-12 rounded-3xl bg-[#12141c] border border-white/10 space-y-8",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3 pb-6 border-b border-white/10",
							children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "w-6 h-6 text-accent" }), /* @__PURE__ */ jsx("h2", {
								className: "text-2xl font-display font-bold text-white",
								children: "Production Security Safeguards"
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-6 text-sm text-neutral-300",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ jsxs("h3", {
										className: "font-bold text-white flex items-center gap-2",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-accent font-mono",
											children: "01."
										}), "Embargoed Collection Quarantine"]
									}), /* @__PURE__ */ jsx("p", {
										className: "text-xs text-neutral-400 leading-relaxed pl-6",
										children: "Pre-release catalog shoots and prototype renders are partitioned into isolated network segments with role-based access control (RBAC). Only named artists assigned to your project can access working directories."
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ jsxs("h3", {
										className: "font-bold text-white flex items-center gap-2",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-accent font-mono",
											children: "02."
										}), "Automated 30-Day Cryptographic Shredding"]
									}), /* @__PURE__ */ jsx("p", {
										className: "text-xs text-neutral-400 leading-relaxed pl-6",
										children: "Following client sign-off and delivery archive window (standard 30 days), master source files are automatically expunged from production arrays using multi-pass DoD-standard digital wipe protocols."
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ jsxs("h3", {
										className: "font-bold text-white flex items-center gap-2",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-accent font-mono",
											children: "03."
										}), "White-Label Silence Guarantee"]
									}), /* @__PURE__ */ jsx("p", {
										className: "text-xs text-neutral-400 leading-relaxed pl-6",
										children: "We never publish, promote, or display agency partner client deliverables in public portfolios, marketing reels, or case studies without formal written release from your legal counsel."
									})]
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "p-6 rounded-2xl bg-accent/5 border border-accent/20 flex flex-col sm:flex-row items-center justify-between gap-4",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ jsx("h4", {
									className: "font-display font-bold text-white text-sm",
									children: "Need a Signed Mutual NDA?"
								}), /* @__PURE__ */ jsx("p", {
									className: "text-xs text-neutral-400",
									children: "We execute standard DocuSign enterprise NDAs within 2 business hours."
								})]
							}), /* @__PURE__ */ jsx("a", {
								href: "mailto:legal@cuttingedger.com?subject=Enterprise%20NDA%20Request%20-%20Cutting%20Edger",
								className: "px-6 py-3 rounded-xl bg-accent text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-accent-hover transition-colors shrink-0",
								children: "Request NDA Execution"
							})]
						})
					]
				})]
			})
		})
	] });
}
//#endregion
export { NdaCompliance as default };
