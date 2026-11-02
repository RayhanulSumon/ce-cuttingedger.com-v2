import { n as AdminLayout, t as AdminPageHeader } from "./AdminPageHeader-BF3p_UDa.js";
import { n as Button, t as Input } from "./input-lL3MBuxn.js";
import { useState } from "react";
import { router, useForm } from "@inertiajs/react";
import { AlertOctagon, ArrowLeftRight, CheckCircle2, Download, Plus, Power, Search, Trash2, Upload, X } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Admin/Redirects/Index.tsx
function RedirectsIndex({ redirects, notFoundLogs = [], filters = {}, stats }) {
	const [searchQuery, setSearchQuery] = useState(filters.search || "");
	const [activeTab, setActiveTab] = useState("rules");
	const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
	const [editingRule, setEditingRule] = useState(null);
	const [isImportModalOpen, setIsImportModalOpen] = useState(false);
	const [resolvingLog, setResolvingLog] = useState(null);
	const ruleForm = useForm({
		source_path: "",
		target_url: "",
		status_code: 301,
		is_regex: false,
		is_active: true,
		notes: ""
	});
	const resolveForm = useForm({
		target_url: "",
		status_code: 301
	});
	const importForm = useForm({ csv_file: null });
	const handleSearch = (e) => {
		e.preventDefault();
		router.get(route("admin.redirects.index"), { search: searchQuery }, {
			preserveState: true,
			replace: true
		});
	};
	const openCreateModal = () => {
		setEditingRule(null);
		ruleForm.reset();
		ruleForm.setData({
			source_path: "",
			target_url: "",
			status_code: 301,
			is_regex: false,
			is_active: true,
			notes: ""
		});
		setIsRuleModalOpen(true);
	};
	const openEditModal = (rule) => {
		setEditingRule(rule);
		ruleForm.setData({
			source_path: rule.source_path,
			target_url: rule.target_url,
			status_code: rule.status_code,
			is_regex: rule.is_regex,
			is_active: rule.is_active,
			notes: rule.notes || ""
		});
		setIsRuleModalOpen(true);
	};
	const closeRuleModal = () => {
		setIsRuleModalOpen(false);
		setEditingRule(null);
		ruleForm.reset();
	};
	const submitRule = (e) => {
		e.preventDefault();
		if (editingRule) ruleForm.put(route("admin.redirects.update", editingRule.id), { onSuccess: () => closeRuleModal() });
		else ruleForm.post(route("admin.redirects.store"), { onSuccess: () => closeRuleModal() });
	};
	const handleToggle = (id) => {
		router.post(route("admin.redirects.toggle", id));
	};
	const handleDelete = (id, source) => {
		if (confirm(`Delete redirect for "${source}"? This will stop routing traffic for this path immediately.`)) router.delete(route("admin.redirects.destroy", id));
	};
	const openResolveModal = (log) => {
		setResolvingLog(log);
		resolveForm.setData({
			target_url: "/services",
			status_code: 301
		});
	};
	const submitResolve404 = (e) => {
		e.preventDefault();
		if (!resolvingLog) return;
		resolveForm.post(route("admin.redirects.resolve-404", resolvingLog.id), { onSuccess: () => setResolvingLog(null) });
	};
	const handleClear404s = () => {
		if (confirm("Clear all recorded 404 error logs? This cannot be undone.")) router.delete(route("admin.redirects.clear-404s"));
	};
	const handleImportCsv = (e) => {
		e.preventDefault();
		importForm.post(route("admin.redirects.import"), { onSuccess: () => {
			setIsImportModalOpen(false);
			importForm.reset();
		} });
	};
	const getStatusBadge = (code) => {
		switch (code) {
			case 301: return /* @__PURE__ */ jsx("span", {
				className: "px-2 py-0.5 rounded text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
				children: "301 Permanent"
			});
			case 302: return /* @__PURE__ */ jsx("span", {
				className: "px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20",
				children: "302 Temporary"
			});
			case 410: return /* @__PURE__ */ jsx("span", {
				className: "px-2 py-0.5 rounded text-xs font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20",
				children: "410 Gone"
			});
			case 403: return /* @__PURE__ */ jsx("span", {
				className: "px-2 py-0.5 rounded text-xs font-mono font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20",
				children: "403 Blocked"
			});
			case 404: return /* @__PURE__ */ jsx("span", {
				className: "px-2 py-0.5 rounded text-xs font-mono font-bold bg-neutral-500/10 text-neutral-400 border border-neutral-500/20",
				children: "404 Dropped"
			});
			default: return /* @__PURE__ */ jsx("span", {
				className: "px-2 py-0.5 rounded text-xs font-mono font-bold bg-white/10 text-neutral-300",
				children: code
			});
		}
	};
	return /* @__PURE__ */ jsxs(AdminLayout, { children: [
		/* @__PURE__ */ jsxs("div", {
			className: "space-y-8",
			children: [
				/* @__PURE__ */ jsx(AdminPageHeader, {
					title: "Traffic & Redirect Engine",
					description: "Self-serve 301/302 link preservation, regex router, and real-time 404 error intelligence.",
					badge: "SEO Engine",
					eyebrow: "Indexing & Link Equity",
					children: /* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ jsxs(Button, {
								variant: "outline",
								onClick: () => window.open(route("admin.redirects.export"), "_blank"),
								className: "border-white/10 bg-neutral-900/60 hover:bg-neutral-800 text-xs text-neutral-300",
								children: [/* @__PURE__ */ jsx(Download, { className: "w-3.5 h-3.5 mr-1.5" }), "Export CSV"]
							}),
							/* @__PURE__ */ jsxs(Button, {
								variant: "outline",
								onClick: () => setIsImportModalOpen(true),
								className: "border-white/10 bg-neutral-900/60 hover:bg-neutral-800 text-xs text-neutral-300",
								children: [/* @__PURE__ */ jsx(Upload, { className: "w-3.5 h-3.5 mr-1.5" }), "Import CSV"]
							}),
							/* @__PURE__ */ jsxs(Button, {
								onClick: openCreateModal,
								className: "bg-accent text-black hover:bg-accent-hover font-semibold text-xs shadow-lg shadow-accent/10",
								children: [/* @__PURE__ */ jsx(Plus, { className: "w-4 h-4 mr-1.5" }), "New Redirect"]
							})
						]
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "p-5 rounded-xl border border-white/10 bg-neutral-900/50 backdrop-blur-sm",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-xs font-mono uppercase tracking-wider text-neutral-400",
										children: "Total Active Rules"
									}), /* @__PURE__ */ jsx(ArrowLeftRight, { className: "w-4 h-4 text-accent" })]
								}),
								/* @__PURE__ */ jsx("div", {
									className: "text-3xl font-bold text-white mt-2 font-mono",
									children: stats.total_redirects.toLocaleString()
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-xs text-neutral-500 mt-1",
									children: "301 / 302 canonical paths preserving pagerank"
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "p-5 rounded-xl border border-white/10 bg-neutral-900/50 backdrop-blur-sm",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-xs font-mono uppercase tracking-wider text-neutral-400",
										children: "Total Redirect Hits"
									}), /* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4 text-emerald-400" })]
								}),
								/* @__PURE__ */ jsx("div", {
									className: "text-3xl font-bold text-emerald-400 mt-2 font-mono",
									children: stats.total_hits.toLocaleString()
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-xs text-neutral-500 mt-1",
									children: "Traffic preserved without hitting 404 drops"
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "p-5 rounded-xl border border-white/10 bg-neutral-900/50 backdrop-blur-sm",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-xs font-mono uppercase tracking-wider text-neutral-400",
										children: "Logged 404 Paths"
									}), /* @__PURE__ */ jsx(AlertOctagon, { className: "w-4 h-4 text-amber-400" })]
								}),
								/* @__PURE__ */ jsx("div", {
									className: "text-3xl font-bold text-amber-400 mt-2 font-mono",
									children: stats.total_404s.toLocaleString()
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-xs text-neutral-500 mt-1",
									children: "Broken backlink requests waiting for 301 fixes"
								})
							]
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between border-b border-white/10 pb-3",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => setActiveTab("rules"),
								className: `px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all ${activeTab === "rules" ? "bg-accent text-black shadow-md shadow-accent/10" : "text-neutral-400 hover:text-white hover:bg-white/5"}`,
								children: [
									"Active Redirect Rules (",
									redirects.total,
									")"
								]
							}), /* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => setActiveTab("404s"),
								className: `px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-2 ${activeTab === "404s" ? "bg-amber-400 text-black shadow-md shadow-amber-400/10" : "text-neutral-400 hover:text-white hover:bg-white/5"}`,
								children: [/* @__PURE__ */ jsx("span", { children: "404 Monitoring Log" }), stats.total_404s > 0 && /* @__PURE__ */ jsx("span", {
									className: `px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === "404s" ? "bg-black text-amber-400" : "bg-amber-500/20 text-amber-300"}`,
									children: stats.total_404s
								})]
							})]
						}),
						activeTab === "rules" && /* @__PURE__ */ jsxs("form", {
							onSubmit: handleSearch,
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "relative",
								children: [/* @__PURE__ */ jsx(Search, { className: "w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" }), /* @__PURE__ */ jsx(Input, {
									value: searchQuery,
									onChange: (e) => setSearchQuery(e.target.value),
									placeholder: "Filter by source or target...",
									className: "h-8 pl-8 text-xs bg-neutral-900 border-white/10 w-64 text-neutral-200 placeholder:text-neutral-600"
								})]
							}), /* @__PURE__ */ jsx(Button, {
								type: "submit",
								size: "sm",
								variant: "secondary",
								className: "h-8 text-xs",
								children: "Search"
							})]
						}),
						activeTab === "404s" && notFoundLogs.length > 0 && /* @__PURE__ */ jsxs(Button, {
							variant: "destructive",
							size: "sm",
							onClick: handleClear404s,
							className: "h-8 text-xs bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30",
							children: [/* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5 mr-1.5" }), "Clear 404 Logs"]
						})
					]
				}),
				activeTab === "rules" && /* @__PURE__ */ jsxs("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ jsx("div", {
						className: "border border-white/10 rounded-xl overflow-hidden bg-neutral-950/60 backdrop-blur-md",
						children: /* @__PURE__ */ jsx("div", {
							className: "overflow-x-auto",
							children: /* @__PURE__ */ jsxs("table", {
								className: "w-full text-left text-xs",
								children: [/* @__PURE__ */ jsx("thead", {
									className: "bg-white/5 border-b border-white/10 text-neutral-400 font-mono uppercase text-[11px]",
									children: /* @__PURE__ */ jsxs("tr", { children: [
										/* @__PURE__ */ jsx("th", {
											className: "py-3 px-4",
											children: "Source Path"
										}),
										/* @__PURE__ */ jsx("th", {
											className: "py-3 px-4",
											children: "Target Destination"
										}),
										/* @__PURE__ */ jsx("th", {
											className: "py-3 px-4",
											children: "Code"
										}),
										/* @__PURE__ */ jsx("th", {
											className: "py-3 px-4 text-center",
											children: "Hits"
										}),
										/* @__PURE__ */ jsx("th", {
											className: "py-3 px-4",
											children: "Notes"
										}),
										/* @__PURE__ */ jsx("th", {
											className: "py-3 px-4 text-center",
											children: "Status"
										}),
										/* @__PURE__ */ jsx("th", {
											className: "py-3 px-4 text-right",
											children: "Actions"
										})
									] })
								}), /* @__PURE__ */ jsx("tbody", {
									className: "divide-y divide-white/5 text-neutral-300",
									children: redirects.data.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
										colSpan: 7,
										className: "text-center py-12 text-neutral-500",
										children: "No redirect rules found matching your criteria."
									}) }) : redirects.data.map((rule) => /* @__PURE__ */ jsxs("tr", {
										className: "hover:bg-white/[0.02] transition-colors",
										children: [
											/* @__PURE__ */ jsxs("td", {
												className: "py-3 px-4 font-mono font-medium text-white max-w-xs truncate",
												children: [
													/* @__PURE__ */ jsx("span", {
														className: "text-neutral-500 select-none",
														children: "/"
													}),
													rule.source_path.replace(/^\//, ""),
													rule.is_regex && /* @__PURE__ */ jsx("span", {
														className: "ml-1.5 px-1.5 py-0.2 rounded text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30",
														children: "REGEX"
													})
												]
											}),
											/* @__PURE__ */ jsx("td", {
												className: "py-3 px-4 font-mono text-neutral-300 max-w-xs truncate",
												children: rule.target_url
											}),
											/* @__PURE__ */ jsx("td", {
												className: "py-3 px-4 whitespace-nowrap",
												children: getStatusBadge(rule.status_code)
											}),
											/* @__PURE__ */ jsx("td", {
												className: "py-3 px-4 text-center font-mono font-semibold text-neutral-200",
												children: rule.hit_count.toLocaleString()
											}),
											/* @__PURE__ */ jsx("td", {
												className: "py-3 px-4 text-neutral-400 max-w-[200px] truncate",
												children: rule.notes || "—"
											}),
											/* @__PURE__ */ jsx("td", {
												className: "py-3 px-4 text-center whitespace-nowrap",
												children: /* @__PURE__ */ jsxs("button", {
													type: "button",
													onClick: () => handleToggle(rule.id),
													className: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono transition-all ${rule.is_active ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" : "bg-neutral-800 text-neutral-400 border border-neutral-700"}`,
													children: [/* @__PURE__ */ jsx(Power, { className: "w-3 h-3" }), rule.is_active ? "Active" : "Disabled"]
												})
											}),
											/* @__PURE__ */ jsx("td", {
												className: "py-3 px-4 text-right whitespace-nowrap",
												children: /* @__PURE__ */ jsxs("div", {
													className: "flex items-center justify-end gap-1.5",
													children: [/* @__PURE__ */ jsx(Button, {
														size: "sm",
														variant: "ghost",
														onClick: () => openEditModal(rule),
														className: "h-7 px-2 text-xs text-neutral-400 hover:text-white",
														children: "Edit"
													}), /* @__PURE__ */ jsx(Button, {
														size: "sm",
														variant: "ghost",
														onClick: () => handleDelete(rule.id, rule.source_path),
														className: "h-7 px-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10",
														children: /* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5" })
													})]
												})
											})
										]
									}, rule.id))
								})]
							})
						})
					}), redirects.links && redirects.links.length > 3 && /* @__PURE__ */ jsx("div", {
						className: "flex items-center justify-center gap-1 pt-4",
						children: redirects.links.map((link, idx) => /* @__PURE__ */ jsx("button", {
							onClick: () => link.url && router.get(link.url),
							disabled: !link.url,
							dangerouslySetInnerHTML: { __html: link.label },
							className: `px-3 py-1.5 rounded text-xs font-mono ${link.active ? "bg-accent text-black font-bold" : link.url ? "text-neutral-400 hover:text-white hover:bg-white/5" : "text-neutral-600 cursor-not-allowed"}`
						}, idx))
					})]
				}),
				activeTab === "404s" && /* @__PURE__ */ jsx("div", {
					className: "border border-white/10 rounded-xl overflow-hidden bg-neutral-950/60 backdrop-blur-md",
					children: /* @__PURE__ */ jsx("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ jsxs("table", {
							className: "w-full text-left text-xs",
							children: [/* @__PURE__ */ jsx("thead", {
								className: "bg-white/5 border-b border-white/10 text-neutral-400 font-mono uppercase text-[11px]",
								children: /* @__PURE__ */ jsxs("tr", { children: [
									/* @__PURE__ */ jsx("th", {
										className: "py-3 px-4",
										children: "404 Dropped URL"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-3 px-4 text-center",
										children: "Miss Count"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-3 px-4",
										children: "Referer / Backlink Source"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-3 px-4",
										children: "Last Attempt"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "py-3 px-4 text-right",
										children: "Instant Resolution"
									})
								] })
							}), /* @__PURE__ */ jsx("tbody", {
								className: "divide-y divide-white/5 text-neutral-300",
								children: notFoundLogs.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
									colSpan: 5,
									className: "text-center py-12 text-neutral-500",
									children: "Zero 404 dropped requests currently logged. All crawl pathways clean!"
								}) }) : notFoundLogs.map((log) => /* @__PURE__ */ jsxs("tr", {
									className: "hover:bg-white/[0.02] transition-colors",
									children: [
										/* @__PURE__ */ jsx("td", {
											className: "py-3 px-4 font-mono font-medium text-amber-300 max-w-sm truncate",
											children: log.path
										}),
										/* @__PURE__ */ jsx("td", {
											className: "py-3 px-4 text-center font-mono font-bold text-white",
											children: /* @__PURE__ */ jsxs("span", {
												className: "px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20",
												children: [log.hit_count, " hits"]
											})
										}),
										/* @__PURE__ */ jsx("td", {
											className: "py-3 px-4 text-neutral-400 max-w-xs truncate font-mono text-[11px]",
											children: log.referer || "Direct / Bookmark / Bot Crawler"
										}),
										/* @__PURE__ */ jsx("td", {
											className: "py-3 px-4 text-neutral-500 font-mono text-[11px]",
											children: log.last_seen_at
										}),
										/* @__PURE__ */ jsx("td", {
											className: "py-3 px-4 text-right",
											children: /* @__PURE__ */ jsxs(Button, {
												size: "sm",
												onClick: () => openResolveModal(log),
												className: "h-7 text-xs bg-accent text-black hover:bg-accent-hover font-semibold",
												children: [/* @__PURE__ */ jsx(ArrowLeftRight, { className: "w-3 h-3 mr-1" }), "Resolve with 301"]
											})
										})
									]
								}, log.id))
							})]
						})
					})
				})
			]
		}),
		isRuleModalOpen && /* @__PURE__ */ jsx("div", {
			className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm",
			children: /* @__PURE__ */ jsxs("div", {
				className: "w-full max-w-lg bg-neutral-950 border border-white/10 rounded-2xl p-6 shadow-2xl relative space-y-5 animate-in fade-in-50 zoom-in-95",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between border-b border-white/10 pb-4",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
						className: "text-lg font-bold text-white",
						children: editingRule ? "Edit Redirect Rule" : "Create Redirect Rule"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-xs text-neutral-400 mt-0.5",
						children: "Instantly redirect obsolete or campaign URLs to high-converting destinations."
					})] }), /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: closeRuleModal,
						className: "p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5",
						children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
					})]
				}), /* @__PURE__ */ jsxs("form", {
					onSubmit: submitRule,
					className: "space-y-4",
					children: [
						/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("label", {
								className: "block text-xs font-mono text-neutral-300 uppercase mb-1",
								children: "Source Path (What visitors request) *"
							}),
							/* @__PURE__ */ jsx(Input, {
								value: ruleForm.data.source_path,
								onChange: (e) => ruleForm.setData("source_path", e.target.value),
								placeholder: "/old-portfolio or /services/photo-editing",
								className: "bg-neutral-900 border-white/10 text-xs font-mono",
								required: true
							}),
							ruleForm.errors.source_path && /* @__PURE__ */ jsx("p", {
								className: "text-xs text-rose-400 mt-1",
								children: ruleForm.errors.source_path
							})
						] }),
						/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("label", {
								className: "block text-xs font-mono text-neutral-300 uppercase mb-1",
								children: "Target Destination URL *"
							}),
							/* @__PURE__ */ jsx(Input, {
								value: ruleForm.data.target_url,
								onChange: (e) => ruleForm.setData("target_url", e.target.value),
								placeholder: "/case-studies or https://external-domain.com",
								className: "bg-neutral-900 border-white/10 text-xs font-mono",
								required: true
							}),
							ruleForm.errors.target_url && /* @__PURE__ */ jsx("p", {
								className: "text-xs text-rose-400 mt-1",
								children: ruleForm.errors.target_url
							})
						] }),
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-2 gap-4",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "block text-xs font-mono text-neutral-300 uppercase mb-1",
								children: "HTTP Status Code"
							}), /* @__PURE__ */ jsxs("select", {
								value: ruleForm.data.status_code,
								onChange: (e) => ruleForm.setData("status_code", parseInt(e.target.value, 10)),
								className: "w-full h-9 rounded-md bg-neutral-900 border border-white/10 text-xs text-white px-3",
								children: [
									/* @__PURE__ */ jsx("option", {
										value: 301,
										children: "301 Permanent (Preserves SEO equity)"
									}),
									/* @__PURE__ */ jsx("option", {
										value: 302,
										children: "302 Temporary (Campaign / Testing)"
									}),
									/* @__PURE__ */ jsx("option", {
										value: 410,
										children: "410 Gone (Permanently deleted asset)"
									}),
									/* @__PURE__ */ jsx("option", {
										value: 403,
										children: "403 Forbidden (Block bad crawlers)"
									})
								]
							})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "block text-xs font-mono text-neutral-300 uppercase mb-1",
								children: "Router Pattern"
							}), /* @__PURE__ */ jsxs("label", {
								className: "flex items-center gap-2 h-9 px-3 rounded-md bg-neutral-900 border border-white/10 cursor-pointer",
								children: [/* @__PURE__ */ jsx("input", {
									type: "checkbox",
									checked: ruleForm.data.is_regex,
									onChange: (e) => ruleForm.setData("is_regex", e.target.checked),
									className: "rounded border-white/20 text-accent focus:ring-0"
								}), /* @__PURE__ */ jsx("span", {
									className: "text-xs text-neutral-300",
									children: "Regex Pattern"
								})]
							})] })]
						}),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "block text-xs font-mono text-neutral-300 uppercase mb-1",
							children: "Notes / Campaign Reference"
						}), /* @__PURE__ */ jsx(Input, {
							value: ruleForm.data.notes,
							onChange: (e) => ruleForm.setData("notes", e.target.value),
							placeholder: "e.g. 2024 print catalog QR code or Google Ads campaign",
							className: "bg-neutral-900 border-white/10 text-xs"
						})] }),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-end gap-3 pt-4 border-t border-white/10",
							children: [/* @__PURE__ */ jsx(Button, {
								type: "button",
								variant: "ghost",
								onClick: closeRuleModal,
								className: "text-xs",
								children: "Cancel"
							}), /* @__PURE__ */ jsx(Button, {
								type: "submit",
								disabled: ruleForm.processing,
								className: "bg-accent text-black hover:bg-accent-hover text-xs font-semibold",
								children: editingRule ? "Update Rule" : "Create Redirect"
							})]
						})
					]
				})]
			})
		}),
		resolvingLog && /* @__PURE__ */ jsx("div", {
			className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm",
			children: /* @__PURE__ */ jsxs("div", {
				className: "w-full max-w-md bg-neutral-950 border border-white/10 rounded-2xl p-6 shadow-2xl relative space-y-5 animate-in fade-in-50 zoom-in-95",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between border-b border-white/10 pb-4",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h2", {
						className: "text-base font-bold text-white flex items-center gap-2",
						children: [/* @__PURE__ */ jsx(ArrowLeftRight, { className: "w-4 h-4 text-accent" }), "Resolve 404 to 301 Redirect"]
					}), /* @__PURE__ */ jsx("p", {
						className: "text-xs text-neutral-400 mt-1",
						children: "Convert dropped traffic into active visitors."
					})] }), /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => setResolvingLog(null),
						className: "p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5",
						children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
					})]
				}), /* @__PURE__ */ jsxs("form", {
					onSubmit: submitResolve404,
					className: "space-y-4",
					children: [
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
							className: "block text-xs font-mono text-neutral-400 uppercase mb-1",
							children: [
								"Original 404 Path (",
								resolvingLog.hit_count,
								" hits recorded)"
							]
						}), /* @__PURE__ */ jsx("div", {
							className: "p-2.5 rounded bg-neutral-900 border border-white/10 font-mono text-xs text-amber-300",
							children: resolvingLog.path
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "block text-xs font-mono text-neutral-300 uppercase mb-1",
							children: "Permanent Target Destination (301) *"
						}), /* @__PURE__ */ jsx(Input, {
							value: resolveForm.data.target_url,
							onChange: (e) => resolveForm.setData("target_url", e.target.value),
							placeholder: "/services or /case-studies",
							className: "bg-neutral-900 border-white/10 text-xs font-mono",
							required: true
						})] }),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-end gap-3 pt-3 border-t border-white/10",
							children: [/* @__PURE__ */ jsx(Button, {
								type: "button",
								variant: "ghost",
								onClick: () => setResolvingLog(null),
								className: "text-xs",
								children: "Cancel"
							}), /* @__PURE__ */ jsx(Button, {
								type: "submit",
								disabled: resolveForm.processing,
								className: "bg-accent text-black hover:bg-accent-hover text-xs font-semibold",
								children: "Save 301 Redirect"
							})]
						})
					]
				})]
			})
		}),
		isImportModalOpen && /* @__PURE__ */ jsx("div", {
			className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm",
			children: /* @__PURE__ */ jsxs("div", {
				className: "w-full max-w-md bg-neutral-950 border border-white/10 rounded-2xl p-6 shadow-2xl relative space-y-5 animate-in fade-in-50 zoom-in-95",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between border-b border-white/10 pb-4",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h2", {
						className: "text-base font-bold text-white flex items-center gap-2",
						children: [/* @__PURE__ */ jsx(Upload, { className: "w-4 h-4 text-accent" }), "Bulk Import Redirects"]
					}), /* @__PURE__ */ jsx("p", {
						className: "text-xs text-neutral-400 mt-1",
						children: "Upload a CSV with columns: source_path, target_url, status_code"
					})] }), /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => setIsImportModalOpen(false),
						className: "p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5",
						children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
					})]
				}), /* @__PURE__ */ jsxs("form", {
					onSubmit: handleImportCsv,
					className: "space-y-4",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "p-4 rounded-xl border border-dashed border-white/20 bg-neutral-900/60 text-center",
							children: /* @__PURE__ */ jsx("input", {
								type: "file",
								accept: ".csv,.txt",
								onChange: (e) => importForm.setData("csv_file", e.target.files?.[0] || null),
								className: "block w-full text-xs text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-accent file:text-black hover:file:bg-[#c2eb00] cursor-pointer"
							})
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "text-[11px] font-mono text-neutral-400 space-y-1 bg-black/40 p-3 rounded-lg border border-white/5",
							children: [
								/* @__PURE__ */ jsx("p", {
									className: "text-neutral-300 font-semibold",
									children: "CSV Column Format Example:"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-neutral-500",
									children: "source_path, target_url, status_code"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-emerald-400",
									children: "/old-service, /services/ecommerce-catalog-optimization, 301"
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-end gap-3 pt-3 border-t border-white/10",
							children: [/* @__PURE__ */ jsx(Button, {
								type: "button",
								variant: "ghost",
								onClick: () => setIsImportModalOpen(false),
								className: "text-xs",
								children: "Cancel"
							}), /* @__PURE__ */ jsx(Button, {
								type: "submit",
								disabled: !importForm.data.csv_file || importForm.processing,
								className: "bg-accent text-black hover:bg-accent-hover text-xs font-semibold",
								children: "Upload & Ingest"
							})]
						})
					]
				})]
			})
		})
	] });
}
//#endregion
export { RedirectsIndex as default };
