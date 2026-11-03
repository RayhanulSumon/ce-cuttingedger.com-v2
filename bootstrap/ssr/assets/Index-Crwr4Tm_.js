import { t as AdminLayout } from "./AdminLayout-B_omIhRP.js";
import { n as Button, t as Input } from "./input-lL3MBuxn.js";
import { t as AdminPageHeader } from "./AdminPageHeader-BLzCfjWe.js";
import { t as Textarea } from "./textarea-DNOgnKpG.js";
import "react";
import { useForm } from "@inertiajs/react";
import { Calendar, Globe, Save, Search, Terminal } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Admin/Settings/Index.tsx
function SettingsIndex({ settings = [] }) {
	const initialMap = {};
	settings.forEach((s) => {
		initialMap[s.key] = s.value || "";
	});
	const { data, setData, post, processing } = useForm({ settings: {
		brand_name: initialMap["brand_name"] || "Cutting Edger",
		tagline: initialMap["tagline"] || "AI-Driven Visual Performance & Post-Production Agency.",
		contact_email: initialMap["contact_email"] || "hello@cuttingedger.com",
		contact_phone: initialMap["contact_phone"] || "+1 (409) 995-2565",
		office_address: initialMap["office_address"] || "Artisan Center, Level-7, House# 57/9, West Panthapath, Dhaka 1215",
		default_meta_title: initialMap["default_meta_title"] || "Cutting Edger — AI-Driven Visual Performance Agency",
		default_meta_description: initialMap["default_meta_description"] || "High-volume e-commerce catalog retouching, color standardization, white-label agency bandwidth, and 3D CGI virtual production studio.",
		robots_txt_content: initialMap["robots_txt_content"] || "User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\nDisallow: /thank-you\n\nSitemap: https://cuttingedger.com/sitemap.xml",
		calendly_url: initialMap["calendly_url"] || "https://calendly.com/cuttingedger/discovery-call",
		social_linkedin: initialMap["social_linkedin"] || "https://linkedin.com/company/cutting-edger",
		social_twitter: initialMap["social_twitter"] || "https://twitter.com/cutting_edger",
		social_instagram: initialMap["social_instagram"] || "https://instagram.com/cuttingedgerinc"
	} });
	const submit = (e) => {
		e.preventDefault();
		post(route("admin.settings.update"));
	};
	return /* @__PURE__ */ jsxs(AdminLayout, {
		title: "SYSTEM ARCHITECTURE // SETTINGS",
		children: [/* @__PURE__ */ jsx(AdminPageHeader, {
			title: "System & Brand Settings",
			description: "Governs global metadata, brand identity tags, search crawlers (robots.txt), and Calendly endpoints.",
			badge: "SUPER ADMIN ONLY"
		}), /* @__PURE__ */ jsxs("form", {
			onSubmit: submit,
			className: "max-w-4xl space-y-8 pb-12",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "p-6 rounded-2xl bg-[#12141c] border border-white/10 space-y-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2 pb-4 border-b border-white/10",
						children: [/* @__PURE__ */ jsx(Globe, { className: "w-4 h-4 text-accent" }), /* @__PURE__ */ jsx("h2", {
							className: "text-sm font-mono uppercase tracking-wider text-white font-bold",
							children: "Identity & Global Agency Metadata"
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ jsx("label", {
								className: "text-xs font-mono uppercase text-neutral-400",
								children: "Global Brand Name"
							}), /* @__PURE__ */ jsx(Input, {
								value: data.settings.brand_name,
								onChange: (e) => setData("settings", {
									...data.settings,
									brand_name: e.target.value
								}),
								required: true
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ jsx("label", {
								className: "text-xs font-mono uppercase text-neutral-400",
								children: "Mission & Tagline"
							}), /* @__PURE__ */ jsx(Textarea, {
								value: data.settings.tagline,
								onChange: (e) => setData("settings", {
									...data.settings,
									tagline: e.target.value
								}),
								rows: 2,
								required: true
							})]
						})]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "p-6 rounded-2xl bg-[#12141c] border border-white/10 space-y-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2 pb-4 border-b border-white/10",
						children: [/* @__PURE__ */ jsx(Search, { className: "w-4 h-4 text-accent" }), /* @__PURE__ */ jsx("h2", {
							className: "text-sm font-mono uppercase tracking-wider text-white font-bold",
							children: "Search Engine Optimization & Crawler Rules"
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-1 md:grid-cols-2 gap-4",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-mono uppercase text-neutral-400",
									children: "Default Meta Title Template"
								}), /* @__PURE__ */ jsx(Input, {
									value: data.settings.default_meta_title,
									onChange: (e) => setData("settings", {
										...data.settings,
										default_meta_title: e.target.value
									}),
									placeholder: "Brand — Tagline"
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-mono uppercase text-neutral-400",
									children: "Default Meta Description"
								}), /* @__PURE__ */ jsx(Input, {
									value: data.settings.default_meta_description,
									onChange: (e) => setData("settings", {
										...data.settings,
										default_meta_description: e.target.value
									}),
									placeholder: "High-volume catalog retouching..."
								})]
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ jsx("label", {
										className: "text-xs font-mono uppercase text-neutral-400",
										children: "robots.txt Direct Editor"
									}), /* @__PURE__ */ jsx("span", {
										className: "text-[11px] font-mono text-accent",
										children: "Live at /robots.txt"
									})]
								}),
								/* @__PURE__ */ jsx(Textarea, {
									value: data.settings.robots_txt_content,
									onChange: (e) => setData("settings", {
										...data.settings,
										robots_txt_content: e.target.value
									}),
									rows: 6,
									className: "font-mono text-xs bg-black/40 border-white/15 text-neutral-200"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-[11px] text-neutral-500 font-mono",
									children: "Directly controls crawl directives and references the XML sitemap. Changes take effect instantly without deployment."
								})
							]
						})]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "p-6 rounded-2xl bg-[#12141c] border border-white/10 space-y-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2 pb-4 border-b border-white/10",
						children: [/* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4 text-accent" }), /* @__PURE__ */ jsx("h2", {
							className: "text-sm font-mono uppercase tracking-wider text-white font-bold",
							children: "Lead Capture & Booking Integrations"
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "space-y-4",
						children: /* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5",
							children: [
								/* @__PURE__ */ jsx("label", {
									className: "text-xs font-mono uppercase text-neutral-400",
									children: "Calendly Discovery Call URL"
								}),
								/* @__PURE__ */ jsx(Input, {
									type: "url",
									value: data.settings.calendly_url,
									onChange: (e) => setData("settings", {
										...data.settings,
										calendly_url: e.target.value
									}),
									placeholder: "https://calendly.com/your-org/discovery-call",
									required: true
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-[11px] text-neutral-500 font-mono",
									children: "Embedded on Thank-You page, Service CTAs, and in client confirmation emails."
								})
							]
						})
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "p-6 rounded-2xl bg-[#12141c] border border-white/10 space-y-6",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 pb-4 border-b border-white/10",
							children: [/* @__PURE__ */ jsx(Terminal, { className: "w-4 h-4 text-accent" }), /* @__PURE__ */ jsx("h2", {
								className: "text-sm font-mono uppercase tracking-wider text-white font-bold",
								children: "Studio Coordinates & Organization Schema"
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-1 md:grid-cols-2 gap-4",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-mono uppercase text-neutral-400",
									children: "Inbound Leads Notification Email"
								}), /* @__PURE__ */ jsx(Input, {
									type: "email",
									value: data.settings.contact_email,
									onChange: (e) => setData("settings", {
										...data.settings,
										contact_email: e.target.value
									}),
									required: true
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-mono uppercase text-neutral-400",
									children: "Studio Phone"
								}), /* @__PURE__ */ jsx(Input, {
									value: data.settings.contact_phone,
									onChange: (e) => setData("settings", {
										...data.settings,
										contact_phone: e.target.value
									})
								})]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ jsx("label", {
								className: "text-xs font-mono uppercase text-neutral-400",
								children: "Physical Headquarters Address"
							}), /* @__PURE__ */ jsx(Input, {
								value: data.settings.office_address,
								onChange: (e) => setData("settings", {
									...data.settings,
									office_address: e.target.value
								})
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-1 md:grid-cols-3 gap-4 pt-2",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ jsx("label", {
										className: "text-xs font-mono uppercase text-neutral-400",
										children: "LinkedIn Profile"
									}), /* @__PURE__ */ jsx(Input, {
										type: "url",
										value: data.settings.social_linkedin,
										onChange: (e) => setData("settings", {
											...data.settings,
											social_linkedin: e.target.value
										}),
										placeholder: "https://linkedin.com/..."
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ jsx("label", {
										className: "text-xs font-mono uppercase text-neutral-400",
										children: "Twitter / X Profile"
									}), /* @__PURE__ */ jsx(Input, {
										type: "url",
										value: data.settings.social_twitter,
										onChange: (e) => setData("settings", {
											...data.settings,
											social_twitter: e.target.value
										}),
										placeholder: "https://twitter.com/..."
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ jsx("label", {
										className: "text-xs font-mono uppercase text-neutral-400",
										children: "Instagram Profile"
									}), /* @__PURE__ */ jsx(Input, {
										type: "url",
										value: data.settings.social_instagram,
										onChange: (e) => setData("settings", {
											...data.settings,
											social_instagram: e.target.value
										}),
										placeholder: "https://instagram.com/..."
									})]
								})
							]
						})
					]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "flex justify-end pt-4",
					children: /* @__PURE__ */ jsxs(Button, {
						type: "submit",
						disabled: processing,
						className: "gap-2 px-8 h-12 text-sm font-display font-bold uppercase tracking-wider bg-accent text-black hover:bg-accent-hover",
						children: [/* @__PURE__ */ jsx(Save, { className: "w-4 h-4" }), /* @__PURE__ */ jsx("span", { children: processing ? "Saving..." : "Save Configuration" })]
					})
				})
			]
		})]
	});
}
//#endregion
export { SettingsIndex as default };
