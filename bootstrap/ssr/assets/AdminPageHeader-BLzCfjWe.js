import { n as Button } from "./input-lL3MBuxn.js";
import "react";
import { Link } from "@inertiajs/react";
import { Plus } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Components/Admin/UI/AdminPageHeader.tsx
function AdminPageHeader({ title, description, badge, eyebrow, actionLabel, actionHref, onActionClick, createLabel, onCreate, children }) {
	const finalActionLabel = actionLabel || createLabel;
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-white/10 mb-8",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "space-y-1",
			children: [
				eyebrow && /* @__PURE__ */ jsx("div", {
					className: "font-mono text-xs uppercase tracking-widest text-accent",
					children: eyebrow
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ jsx("h1", {
						className: "text-2xl sm:text-3xl font-bold text-white tracking-tight",
						children: title
					}), badge && /* @__PURE__ */ jsx("span", {
						className: "px-2.5 py-0.5 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-xs font-semibold",
						children: badge
					})]
				}),
				description && /* @__PURE__ */ jsx("p", {
					className: "text-sm text-neutral-400",
					children: description
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-3",
			children: [children, finalActionLabel && (actionHref ? /* @__PURE__ */ jsx(Link, {
				href: actionHref,
				children: /* @__PURE__ */ jsxs(Button, {
					className: "gap-2 bg-accent hover:bg-[#b8dd00] text-black font-mono font-bold",
					children: [/* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }), /* @__PURE__ */ jsx("span", { children: finalActionLabel })]
				})
			}) : /* @__PURE__ */ jsxs(Button, {
				onClick: onActionClick || onCreate,
				className: "gap-2 bg-accent hover:bg-[#b8dd00] text-black font-mono font-bold cursor-pointer",
				children: [/* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }), /* @__PURE__ */ jsx("span", { children: finalActionLabel })]
			}))]
		})]
	});
}
//#endregion
export { AdminPageHeader as t };
