import { t as AdminLayout } from "./AdminLayout-B_omIhRP.js";
import { n as Button } from "./input-lL3MBuxn.js";
import { t as AdminPageHeader } from "./AdminPageHeader-BLzCfjWe.js";
import { t as AdminDataTable } from "./AdminDataTable-DkjiIkNz.js";
import { t as Badge } from "./badge-BgjwAGBP.js";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-D8hTrlnh.js";
import { useState } from "react";
import { router } from "@inertiajs/react";
import { Download, Trash2 } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Admin/Subscribers/Index.tsx
function SubscribersIndex({ subscribers = [] }) {
	const [subToDelete, setSubToDelete] = useState(null);
	const handleDelete = () => {
		if (!subToDelete) return;
		router.delete(route("admin.subscribers.destroy", subToDelete.id), { onSuccess: () => setSubToDelete(null) });
	};
	const exportCsv = () => {
		const rows = [[
			"Email",
			"Status",
			"Date"
		]];
		subscribers.forEach((s) => {
			rows.push([
				s.email,
				s.status,
				s.created_at
			]);
		});
		const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
		const encodedUri = encodeURI(csvContent);
		const link = document.createElement("a");
		link.setAttribute("href", encodedUri);
		link.setAttribute("download", "subscribers_export.csv");
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};
	return /* @__PURE__ */ jsxs(AdminLayout, {
		title: "DISPATCH SUBSCRIBERS",
		children: [
			/* @__PURE__ */ jsx(AdminPageHeader, {
				title: "Newsletter Subscribers",
				description: "Audience distribution list for studio briefs and design insights.",
				badge: `${subscribers.length} ACTIVE`,
				children: /* @__PURE__ */ jsxs(Button, {
					variant: "outline",
					onClick: exportCsv,
					className: "gap-2 text-xs",
					children: [/* @__PURE__ */ jsx(Download, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ jsx("span", { children: "Export CSV" })]
				})
			}),
			/* @__PURE__ */ jsx(AdminDataTable, {
				columns: [
					{
						header: "SUBSCRIBER RECIPIENT",
						accessorKey: "email",
						cell: (s) => /* @__PURE__ */ jsx("span", {
							className: "font-mono text-sm text-white",
							children: s.email
						})
					},
					{
						header: "STATUS",
						cell: (s) => /* @__PURE__ */ jsx(Badge, {
							variant: s.status === "active" ? "success" : "secondary",
							children: s.status.toUpperCase()
						})
					},
					{
						header: "JOINED DATE",
						cell: (s) => /* @__PURE__ */ jsx("span", {
							className: "text-xs font-mono text-neutral-400",
							children: new Date(s.created_at).toLocaleDateString()
						})
					},
					{
						header: "",
						className: "text-right",
						cell: (s) => /* @__PURE__ */ jsx(Button, {
							variant: "ghost",
							size: "icon",
							onClick: () => setSubToDelete(s),
							className: "h-8 w-8 text-neutral-400 hover:text-rose-400",
							children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
						})
					}
				],
				data: subscribers,
				searchKey: "email",
				searchPlaceholder: "Search subscribers by email..."
			}),
			/* @__PURE__ */ jsx(AlertDialog, {
				open: !!subToDelete,
				onOpenChange: (open) => !open && setSubToDelete(null),
				children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [/* @__PURE__ */ jsxs(AlertDialogHeader, { children: [/* @__PURE__ */ jsx(AlertDialogTitle, { children: "Purge Subscriber?" }), /* @__PURE__ */ jsxs(AlertDialogDescription, { children: [
					"Remove",
					" ",
					/* @__PURE__ */ jsx("span", {
						className: "text-white font-semibold",
						children: subToDelete?.email
					}),
					" ",
					"from the distribution registry?"
				] })] }), /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [/* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancel" }), /* @__PURE__ */ jsx(AlertDialogAction, {
					onClick: handleDelete,
					children: "Remove"
				})] })] })
			})
		]
	});
}
//#endregion
export { SubscribersIndex as default };
