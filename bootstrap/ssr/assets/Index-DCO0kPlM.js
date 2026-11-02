import { n as AdminLayout, t as AdminPageHeader } from "./AdminPageHeader-BF3p_UDa.js";
import { n as Button, t as Input } from "./input-lL3MBuxn.js";
import { t as Textarea } from "./textarea-DNOgnKpG.js";
import { useState } from "react";
import { router, useForm } from "@inertiajs/react";
import { Code2, Plus, Power, Trash2 } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Admin/TrackingScripts/Index.tsx
function TrackingScriptsIndex({ scripts = [] }) {
	const [isCreating, setIsCreating] = useState(false);
	const [editingScript, setEditingScript] = useState(null);
	const { data, setData, post, put, reset, processing, errors } = useForm({
		name: "",
		type: "custom",
		placement: "head",
		code: "",
		target_scope: "all",
		is_active: true,
		sort_order: 0
	});
	const openCreate = () => {
		setEditingScript(null);
		reset();
		setIsCreating(true);
	};
	const openEdit = (script) => {
		setEditingScript(script);
		setData({
			name: script.name,
			type: script.type,
			placement: script.placement,
			code: script.code,
			target_scope: script.target_scope,
			is_active: script.is_active,
			sort_order: script.sort_order
		});
		setIsCreating(true);
	};
	const closeForm = () => {
		setIsCreating(false);
		setEditingScript(null);
		reset();
	};
	const submit = (e) => {
		e.preventDefault();
		if (editingScript) put(route("admin.tracking-scripts.update", editingScript.id), { onSuccess: () => closeForm() });
		else post(route("admin.tracking-scripts.store"), { onSuccess: () => closeForm() });
	};
	const handleToggle = (id) => {
		router.post(route("admin.tracking-scripts.toggle", id));
	};
	const handleDelete = (id, name) => {
		if (confirm(`Remove tracking script "${name}"? This takes effect immediately across all pages.`)) router.delete(route("admin.tracking-scripts.destroy", id));
	};
	const applyPreset = (preset) => {
		if (preset === "gtm") setData({
			name: "Google Tag Manager",
			type: "tag_manager",
			placement: "head",
			code: `<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');<\/script>
<!-- End Google Tag Manager -->`,
			target_scope: "all",
			is_active: true,
			sort_order: 1
		});
		else if (preset === "clarity") setData({
			name: "Microsoft Clarity Telemetry",
			type: "analytics",
			placement: "head",
			code: `<script type="text/javascript">
(function(c,l,a,r,i,t,y){
c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "CLARITY_PROJECT_ID");
<\/script>`,
			target_scope: "all",
			is_active: true,
			sort_order: 2
		});
		else if (preset === "gsc") setData({
			name: "Search Console Verification Tag",
			type: "verification",
			placement: "head",
			code: `<meta name="google-site-verification" content="YOUR_VERIFICATION_STRING" />`,
			target_scope: "all",
			is_active: true,
			sort_order: 3
		});
	};
	return /* @__PURE__ */ jsxs(AdminLayout, {
		title: "SEO & TRACKING SCRIPTS",
		children: [
			/* @__PURE__ */ jsx(AdminPageHeader, {
				title: "Scripts & Telemetry Management",
				description: "Inject and manage Google Tag Manager, GA4, Microsoft Clarity, Meta pixels, and verification meta tags without codebase deployments.",
				badge: "MARKETING & SEO SELF-SERVE",
				actions: /* @__PURE__ */ jsxs(Button, {
					onClick: openCreate,
					className: "gap-2 bg-accent text-black font-bold hover:bg-accent-hover",
					children: [/* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }), /* @__PURE__ */ jsx("span", { children: "Add Tracking Script" })]
				})
			}),
			isCreating && /* @__PURE__ */ jsxs("div", {
				className: "mb-8 p-6 sm:p-8 rounded-3xl bg-[#12141c] border border-accent/40 shadow-2xl space-y-6",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between pb-4 border-b border-white/10",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ jsx(Code2, { className: "w-5 h-5 text-accent" }), /* @__PURE__ */ jsx("h2", {
							className: "text-lg font-display font-bold text-white",
							children: editingScript ? `Edit: ${editingScript.name}` : "Configure New Tracking Script"
						})]
					}), !editingScript && /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2 font-mono text-xs",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "text-neutral-400",
								children: "Presets:"
							}),
							/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => applyPreset("gtm"),
								className: "px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300",
								children: "+ GTM"
							}),
							/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => applyPreset("clarity"),
								className: "px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300",
								children: "+ Clarity"
							}),
							/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => applyPreset("gsc"),
								className: "px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300",
								children: "+ Search Console"
							})
						]
					})]
				}), /* @__PURE__ */ jsxs("form", {
					onSubmit: submit,
					className: "space-y-6",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5 sm:col-span-1",
									children: [
										/* @__PURE__ */ jsx("label", {
											className: "text-xs font-mono uppercase text-neutral-400 font-bold",
											children: "Script Label *"
										}),
										/* @__PURE__ */ jsx(Input, {
											value: data.name,
											onChange: (e) => setData("name", e.target.value),
											placeholder: "e.g. Google Tag Manager",
											required: true
										}),
										errors.name && /* @__PURE__ */ jsx("p", {
											className: "text-xs text-red-400",
											children: errors.name
										})
									]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5 sm:col-span-1",
									children: [/* @__PURE__ */ jsx("label", {
										className: "text-xs font-mono uppercase text-neutral-400 font-bold",
										children: "Script Category"
									}), /* @__PURE__ */ jsxs("select", {
										value: data.type,
										onChange: (e) => setData("type", e.target.value),
										className: "w-full px-4 py-2.5 bg-[#161822] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-accent",
										children: [
											/* @__PURE__ */ jsx("option", {
												value: "tag_manager",
												children: "Tag Manager (GTM / Tealium)"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "analytics",
												children: "Analytics (GA4 / Clarity / Plausible)"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "pixel",
												children: "Ad Pixel (Meta / Google Ads / LinkedIn)"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "verification",
												children: "Search Engine Verification Tag"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "custom",
												children: "Custom Utility Script"
											})
										]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-1.5 sm:col-span-1",
									children: [/* @__PURE__ */ jsx("label", {
										className: "text-xs font-mono uppercase text-neutral-400 font-bold",
										children: "HTML Injection Placement *"
									}), /* @__PURE__ */ jsxs("select", {
										value: data.placement,
										onChange: (e) => setData("placement", e.target.value),
										className: "w-full px-4 py-2.5 bg-[#161822] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-accent",
										children: [
											/* @__PURE__ */ jsx("option", {
												value: "head",
												children: "<head> (Standard for tags and verification)"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "body_start",
												children: "Start of <body> (GTM noscript)"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "footer",
												children: "End of <body> / Footer (Non-critical pixels)"
											})
										]
									})]
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5",
							children: [
								/* @__PURE__ */ jsx("label", {
									className: "text-xs font-mono uppercase text-neutral-400 font-bold",
									children: "Script / HTML Snippet *"
								}),
								/* @__PURE__ */ jsx(Textarea, {
									rows: 7,
									value: data.code,
									onChange: (e) => setData("code", e.target.value),
									placeholder: "Paste your <script>...<\/script> or <meta ... /> tags here.",
									className: "font-mono text-xs leading-relaxed",
									required: true
								}),
								errors.code && /* @__PURE__ */ jsx("p", {
									className: "text-xs text-red-400",
									children: errors.code
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between pt-2",
							children: [/* @__PURE__ */ jsxs("label", {
								className: "flex items-center gap-2 cursor-pointer font-mono text-xs",
								children: [/* @__PURE__ */ jsx("input", {
									type: "checkbox",
									checked: data.is_active,
									onChange: (e) => setData("is_active", e.target.checked),
									className: "w-4 h-4 rounded accent-accent"
								}), /* @__PURE__ */ jsx("span", {
									className: "text-neutral-300",
									children: "Active (Injected into HTML on live site)"
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ jsx(Button, {
									type: "button",
									variant: "outline",
									onClick: closeForm,
									children: "Cancel"
								}), /* @__PURE__ */ jsx(Button, {
									type: "submit",
									disabled: processing,
									className: "bg-accent text-black font-bold hover:bg-accent-hover",
									children: processing ? "Persisting..." : editingScript ? "Update Script" : "Save & Activate"
								})]
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "rounded-2xl bg-[#12141c] border border-white/10 overflow-hidden shadow-xl",
				children: /* @__PURE__ */ jsxs("table", {
					className: "w-full text-left text-xs font-mono",
					children: [/* @__PURE__ */ jsx("thead", {
						className: "border-b border-white/10 text-neutral-400 uppercase tracking-wider bg-white/[0.02]",
						children: /* @__PURE__ */ jsxs("tr", { children: [
							/* @__PURE__ */ jsx("th", {
								className: "py-3.5 px-6",
								children: "Script Label"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "py-3.5 px-4",
								children: "Placement"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "py-3.5 px-4",
								children: "Type"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "py-3.5 px-4",
								children: "State"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "py-3.5 px-6 text-right",
								children: "Actions"
							})
						] })
					}), /* @__PURE__ */ jsx("tbody", {
						className: "divide-y divide-white/5",
						children: scripts.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
							colSpan: 5,
							className: "py-8 text-center text-neutral-500",
							children: "No tracking or telemetry scripts configured yet. Click \"Add Tracking Script\" above."
						}) }) : scripts.map((script) => /* @__PURE__ */ jsxs("tr", {
							className: "hover:bg-white/[0.02] transition-colors",
							children: [
								/* @__PURE__ */ jsx("td", {
									className: "py-4 px-6 font-bold text-white",
									children: /* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ jsx(Code2, { className: "w-4 h-4 text-accent" }), /* @__PURE__ */ jsx("span", { children: script.name })]
									})
								}),
								/* @__PURE__ */ jsx("td", {
									className: "py-4 px-4",
									children: /* @__PURE__ */ jsxs("span", {
										className: "px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-neutral-300",
										children: [
											"<",
											script.placement,
											">"
										]
									})
								}),
								/* @__PURE__ */ jsx("td", {
									className: "py-4 px-4 text-neutral-400 capitalize",
									children: script.type.replace("_", " ")
								}),
								/* @__PURE__ */ jsx("td", {
									className: "py-4 px-4",
									children: /* @__PURE__ */ jsxs("span", {
										className: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${script.is_active ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-neutral-500/10 text-neutral-400 border border-neutral-500/20"}`,
										children: [/* @__PURE__ */ jsx("span", { className: `w-1.5 h-1.5 rounded-full ${script.is_active ? "bg-emerald-400" : "bg-neutral-500"}` }), /* @__PURE__ */ jsx("span", { children: script.is_active ? "Live" : "Disabled" })]
									})
								}),
								/* @__PURE__ */ jsx("td", {
									className: "py-4 px-6 text-right",
									children: /* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-end gap-2",
										children: [
											/* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => handleToggle(script.id),
												className: `p-2 rounded-lg border transition-colors ${script.is_active ? "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10" : "border-white/10 text-neutral-400 hover:text-white hover:bg-white/5"}`,
												title: script.is_active ? "Disable Script" : "Enable Script",
												children: /* @__PURE__ */ jsx(Power, { className: "w-3.5 h-3.5" })
											}),
											/* @__PURE__ */ jsx(Button, {
												variant: "outline",
												size: "sm",
												onClick: () => openEdit(script),
												className: "h-8 px-2.5 text-xs",
												children: "Edit"
											}),
											/* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => handleDelete(script.id, script.name),
												className: "p-2 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors",
												title: "Delete Script",
												children: /* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5" })
											})
										]
									})
								})
							]
						}, script.id))
					})]
				})
			})
		]
	});
}
//#endregion
export { TrackingScriptsIndex as default };
