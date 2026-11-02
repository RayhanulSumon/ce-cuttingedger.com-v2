import { t as SeoHead } from "./SeoHead-jRblvokC.js";
import { t as PageHero } from "./PageHero-BKafzHM7.js";
import "react";
import { Cookie, Database, Shield } from "lucide-react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Legal/CookiePolicy.tsx
function CookiePolicy() {
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(SeoHead, {
			title: "Cookie & Tracking Policy",
			description: "Understand how Cutting Edger uses essential, performance, and analytics cookies to optimize client visual workflows.",
			breadcrumbs: [{
				name: "Home",
				url: "/"
			}, {
				name: "Cookie Policy",
				url: "/cookie-policy"
			}]
		}),
		/* @__PURE__ */ jsx(PageHero, {
			eyebrow: "TRANSPARENT GOVERNANCE",
			title: "COOKIE & TRACKING",
			highlight: "DISCLOSURE.",
			description: "We believe in zero covert tracking. Learn how cookies and telemetry tokens function across our platform."
		}),
		/* @__PURE__ */ jsx("section", {
			className: "py-20 bg-[#0a0b0e]",
			children: /* @__PURE__ */ jsxs("div", {
				className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "p-8 rounded-3xl bg-[#12141c] border border-white/10 space-y-6",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3 pb-4 border-b border-white/10",
							children: [/* @__PURE__ */ jsx(Cookie, { className: "w-5 h-5 text-accent" }), /* @__PURE__ */ jsx("h2", {
								className: "text-xl font-display font-bold text-white",
								children: "1. Scope and Objective"
							})]
						}), /* @__PURE__ */ jsx("p", {
							className: "text-neutral-300 text-sm leading-relaxed",
							children: "This Cookie Policy outlines how Cutting Edger (\"we\", \"our\", or \"us\") uses cookies, local storage tokens, and web beacons when you navigate cuttingedger.com. This policy is aligned with GDPR, UK Data Protection Act 2018, and California Consumer Privacy Act (CCPA) regulations."
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "p-8 rounded-3xl bg-[#12141c] border border-white/10 space-y-6",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3 pb-4 border-b border-white/10",
							children: [/* @__PURE__ */ jsx(Database, { className: "w-5 h-5 text-accent" }), /* @__PURE__ */ jsx("h2", {
								className: "text-xl font-display font-bold text-white",
								children: "2. Categorization of Cookies Deployed"
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "space-y-4 text-sm text-neutral-300",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1",
									children: [/* @__PURE__ */ jsx("h3", {
										className: "font-bold text-white",
										children: "A. Strictly Necessary (Essential)"
									}), /* @__PURE__ */ jsx("p", {
										className: "text-xs text-neutral-400",
										children: "Required for the core functionality of the website, including session authentication, CSRF security verification, and the preservation of theme and consent preferences. These cannot be disabled."
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1",
									children: [/* @__PURE__ */ jsx("h3", {
										className: "font-bold text-white",
										children: "B. Analytical & Performance Telemetry"
									}), /* @__PURE__ */ jsx("p", {
										className: "text-xs text-neutral-400",
										children: "Measures aggregated visitor metrics (such as Google Analytics 4 and Microsoft Clarity session analytics) to detect edge loading bottlenecks, core web vitals, and checkout drop-offs. No individual identity is linked."
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1",
									children: [/* @__PURE__ */ jsx("h3", {
										className: "font-bold text-white",
										children: "C. Marketing & Attribution Tokens"
									}), /* @__PURE__ */ jsx("p", {
										className: "text-xs text-neutral-400",
										children: "Tracks first-touch campaign attribution (UTMs and Google/Bing click identifiers) so our agency can understand which acquisition channels produce enterprise B2B inquiries."
									})]
								})
							]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "p-8 rounded-3xl bg-[#12141c] border border-white/10 space-y-6",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3 pb-4 border-b border-white/10",
							children: [/* @__PURE__ */ jsx(Shield, { className: "w-5 h-5 text-accent" }), /* @__PURE__ */ jsx("h2", {
								className: "text-xl font-display font-bold text-white",
								children: "3. Specific Cookie Inventory"
							})]
						}), /* @__PURE__ */ jsx("div", {
							className: "overflow-x-auto",
							children: /* @__PURE__ */ jsxs("table", {
								className: "w-full text-left text-xs font-mono text-neutral-300",
								children: [/* @__PURE__ */ jsx("thead", {
									className: "border-b border-white/10 text-white font-bold uppercase tracking-wider",
									children: /* @__PURE__ */ jsxs("tr", { children: [
										/* @__PURE__ */ jsx("th", {
											className: "py-3 px-4",
											children: "Cookie Token"
										}),
										/* @__PURE__ */ jsx("th", {
											className: "py-3 px-4",
											children: "Provider"
										}),
										/* @__PURE__ */ jsx("th", {
											className: "py-3 px-4",
											children: "Purpose"
										}),
										/* @__PURE__ */ jsx("th", {
											className: "py-3 px-4",
											children: "Lifespan"
										})
									] })
								}), /* @__PURE__ */ jsxs("tbody", {
									className: "divide-y divide-white/5",
									children: [
										/* @__PURE__ */ jsxs("tr", { children: [
											/* @__PURE__ */ jsx("td", {
												className: "py-3 px-4 text-accent",
												children: "XSRF-TOKEN"
											}),
											/* @__PURE__ */ jsx("td", {
												className: "py-3 px-4",
												children: "Cutting Edger"
											}),
											/* @__PURE__ */ jsx("td", {
												className: "py-3 px-4",
												children: "Cross-Site Request Forgery security shield"
											}),
											/* @__PURE__ */ jsx("td", {
												className: "py-3 px-4",
												children: "2 Hours"
											})
										] }),
										/* @__PURE__ */ jsxs("tr", { children: [
											/* @__PURE__ */ jsx("td", {
												className: "py-3 px-4 text-accent",
												children: "cuttingedger_session"
											}),
											/* @__PURE__ */ jsx("td", {
												className: "py-3 px-4",
												children: "Cutting Edger"
											}),
											/* @__PURE__ */ jsx("td", {
												className: "py-3 px-4",
												children: "Encrypted client session state & trial dropzone"
											}),
											/* @__PURE__ */ jsx("td", {
												className: "py-3 px-4",
												children: "Session"
											})
										] }),
										/* @__PURE__ */ jsxs("tr", { children: [
											/* @__PURE__ */ jsx("td", {
												className: "py-3 px-4 text-accent",
												children: "_ga / _ga_*"
											}),
											/* @__PURE__ */ jsx("td", {
												className: "py-3 px-4",
												children: "Google Analytics"
											}),
											/* @__PURE__ */ jsx("td", {
												className: "py-3 px-4",
												children: "Anonymized session traffic aggregation"
											}),
											/* @__PURE__ */ jsx("td", {
												className: "py-3 px-4",
												children: "2 Years"
											})
										] }),
										/* @__PURE__ */ jsxs("tr", { children: [
											/* @__PURE__ */ jsx("td", {
												className: "py-3 px-4 text-accent",
												children: "_clck / _clsk"
											}),
											/* @__PURE__ */ jsx("td", {
												className: "py-3 px-4",
												children: "Microsoft Clarity"
											}),
											/* @__PURE__ */ jsx("td", {
												className: "py-3 px-4",
												children: "Heatmap & UI rendering diagnostics"
											}),
											/* @__PURE__ */ jsx("td", {
												className: "py-3 px-4",
												children: "1 Year"
											})
										] })
									]
								})]
							})
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "p-8 rounded-3xl bg-[#12141c] border border-white/10 space-y-4",
						children: [/* @__PURE__ */ jsx("h2", {
							className: "text-lg font-display font-bold text-white",
							children: "4. Controlling Cookie Preferences"
						}), /* @__PURE__ */ jsxs("p", {
							className: "text-neutral-300 text-sm leading-relaxed",
							children: [
								"You can adjust or revoke your cookie choices at any time via the Cookie Consent Banner or by clearing your browser cache. For inquiries regarding cookie telemetry, contact ",
								/* @__PURE__ */ jsx("a", {
									href: "mailto:privacy@cuttingedger.com",
									className: "text-accent underline",
									children: "privacy@cuttingedger.com"
								}),
								"."
							]
						})]
					})
				]
			})
		})
	] });
}
//#endregion
export { CookiePolicy as default };
