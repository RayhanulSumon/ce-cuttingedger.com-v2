import { t as cn } from "./utils-BVTyW6jK.js";
import { n as Button, r as buttonVariants, t as Input } from "./input-lL3MBuxn.js";
import * as React$1 from "react";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
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
//#region resources/js/Components/ui/alert-dialog.tsx
var AlertDialog = AlertDialogPrimitive.Root;
var AlertDialogPortal = AlertDialogPrimitive.Portal;
var AlertDialogOverlay = React$1.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AlertDialogPrimitive.Overlay, {
	className: cn("fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;
var AlertDialogContent = React$1.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxs(AlertDialogPortal, { children: [/* @__PURE__ */ jsx(AlertDialogOverlay, {}), /* @__PURE__ */ jsx(AlertDialogPrimitive.Content, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-white/10 bg-[#12141c] p-6 shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-2xl text-white", className),
	...props,
	children: props.children
})] }));
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;
var AlertDialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsx("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
AlertDialogHeader.displayName = "AlertDialogHeader";
var AlertDialogFooter = ({ className, ...props }) => /* @__PURE__ */ jsx("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4 border-t border-white/10", className),
	...props
});
AlertDialogFooter.displayName = "AlertDialogFooter";
var AlertDialogTitle = React$1.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AlertDialogPrimitive.Title, {
	ref,
	className: cn("text-lg font-semibold text-white", className),
	...props
}));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;
var AlertDialogDescription = React$1.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AlertDialogPrimitive.Description, {
	ref,
	className: cn("text-sm text-neutral-400", className),
	...props
}));
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;
var AlertDialogAction = React$1.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AlertDialogPrimitive.Action, {
	ref,
	className: cn(buttonVariants({ variant: "destructive" }), className),
	...props
}));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;
var AlertDialogCancel = React$1.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AlertDialogPrimitive.Cancel, {
	ref,
	className: cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className),
	...props
}));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;
//#endregion
export { AlertDialogDescription as a, AlertDialogTitle as c, AlertDialogContent as i, AdminDataTable as l, AlertDialogAction as n, AlertDialogFooter as o, AlertDialogCancel as r, AlertDialogHeader as s, AlertDialog as t };
