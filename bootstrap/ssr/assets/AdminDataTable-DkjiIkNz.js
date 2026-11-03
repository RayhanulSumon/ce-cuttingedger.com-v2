import { t as cn } from "./utils-BVTyW6jK.js";
import { n as Button, t as Input } from "./input-lL3MBuxn.js";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Components/Admin/UI/AdminDataTable.tsx
function AdminDataTable({ columns, data, searchKey, searchPlaceholder = "Search records...", emptyMessage = "No records found." }) {
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const pageSize = 10;
	const filteredData = React.useMemo(() => {
		if (!search || !searchKey) return data;
		return data.filter((item) => {
			const val = item[searchKey];
			if (val === null || val === void 0) return false;
			return String(val).toLowerCase().includes(search.toLowerCase());
		});
	}, [
		data,
		search,
		searchKey
	]);
	const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
	const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-4",
		children: [searchKey && /* @__PURE__ */ jsxs("div", {
			className: "flex items-center justify-between gap-4",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "relative w-full max-w-sm",
				children: [/* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" }), /* @__PURE__ */ jsx(Input, {
					placeholder: searchPlaceholder,
					value: search,
					onChange: (e) => {
						setSearch(e.target.value);
						setPage(1);
					},
					className: "pl-9 bg-[#12141c] border-white/10 text-white placeholder:text-neutral-500"
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "text-xs font-mono text-neutral-400",
				children: [
					"Total ",
					filteredData.length,
					" records"
				]
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "rounded-2xl border border-white/10 bg-[#12141c] overflow-hidden shadow-xl",
			children: [/* @__PURE__ */ jsx("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ jsxs("table", {
					className: "w-full text-left text-sm text-neutral-300",
					children: [/* @__PURE__ */ jsx("thead", {
						className: "bg-[#181b24] text-[11px] font-mono uppercase tracking-wider text-neutral-400 border-b border-white/10",
						children: /* @__PURE__ */ jsx("tr", { children: columns.map((col, idx) => /* @__PURE__ */ jsx("th", {
							className: cn("px-6 py-3.5 font-semibold", col.className),
							children: col.header
						}, idx)) })
					}), /* @__PURE__ */ jsx("tbody", {
						className: "divide-y divide-white/5",
						children: paginatedData.length > 0 ? paginatedData.map((row, rowIdx) => /* @__PURE__ */ jsx("tr", {
							className: "hover:bg-white/[0.02] transition-colors",
							children: columns.map((col, colIdx) => /* @__PURE__ */ jsx("td", {
								className: cn("px-6 py-4 text-neutral-200", col.className),
								children: col.cell ? col.cell(row) : col.render ? col.render(row) : col.accessorKey || col.key ? String(row[col.accessorKey || col.key] ?? "") : null
							}, colIdx))
						}, row.id ?? rowIdx)) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
							colSpan: columns.length,
							className: "px-6 py-12 text-center text-neutral-500 font-mono text-xs",
							children: emptyMessage
						}) })
					})]
				})
			}), totalPages > 1 && /* @__PURE__ */ jsxs("div", {
				className: "px-6 py-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-neutral-400 bg-[#0e1017]",
				children: [/* @__PURE__ */ jsxs("span", { children: [
					"Page ",
					page,
					" of ",
					totalPages
				] }), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsx(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => setPage((p) => Math.max(1, p - 1)),
						disabled: page === 1,
						className: "h-8 px-2.5",
						children: /* @__PURE__ */ jsx(ChevronLeft, { className: "w-4 h-4" })
					}), /* @__PURE__ */ jsx(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => setPage((p) => Math.min(totalPages, p + 1)),
						disabled: page === totalPages,
						className: "h-8 px-2.5",
						children: /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4" })
					})]
				})]
			})]
		})]
	});
}
//#endregion
export { AdminDataTable as t };
