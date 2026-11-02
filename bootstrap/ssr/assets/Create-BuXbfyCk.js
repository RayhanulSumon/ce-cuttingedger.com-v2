import { n as AdminLayout, t as AdminPageHeader } from "./AdminPageHeader-BF3p_UDa.js";
import { n as Button } from "./input-lL3MBuxn.js";
import { t as $ } from "./dist-CEcKwvhn.js";
import { BlogForm } from "./BlogForm-D7XPwDB7.js";
import "react";
import { Link } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Admin/Blogs/Create.tsx
function BlogsCreate({ categories = [], authors = [] }) {
	return /* @__PURE__ */ jsx(AdminLayout, {
		title: "Compose Blog Post",
		children: /* @__PURE__ */ jsxs("div", {
			className: "space-y-6",
			children: [/* @__PURE__ */ jsx(AdminPageHeader, {
				title: "Compose Blog Post",
				description: "Draft an authoritative article with typography hierarchy, category taxonomies, and high-performance SEO metadata.",
				children: /* @__PURE__ */ jsx(Link, {
					href: $("admin.blogs.index"),
					children: /* @__PURE__ */ jsxs(Button, {
						variant: "outline",
						className: "gap-2 border-white/10 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white font-mono cursor-pointer",
						children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4" }), /* @__PURE__ */ jsx("span", { children: "Back to Blogs" })]
					})
				})
			}), /* @__PURE__ */ jsx(BlogForm, {
				mode: "create",
				categories,
				authors
			})]
		})
	});
}
//#endregion
export { BlogsCreate as default };
