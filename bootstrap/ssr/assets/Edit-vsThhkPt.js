import { t as AdminLayout } from "./AdminLayout-B_omIhRP.js";
import { n as Button } from "./input-lL3MBuxn.js";
import { t as AdminPageHeader } from "./AdminPageHeader-BLzCfjWe.js";
import { t as $ } from "./dist-CEcKwvhn.js";
import { BlogForm } from "./BlogForm-D7XPwDB7.js";
import "react";
import { Link } from "@inertiajs/react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Admin/Blogs/Edit.tsx
function BlogsEdit({ blog, categories = [], authors = [] }) {
	return /* @__PURE__ */ jsx(AdminLayout, {
		title: `Edit: ${blog.title}`,
		children: /* @__PURE__ */ jsxs("div", {
			className: "space-y-6",
			children: [/* @__PURE__ */ jsx(AdminPageHeader, {
				title: "Edit Blog Article",
				description: `Editing "${blog.title}". Modify content, calibrate category taxonomies, and tune search metadata.`,
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ jsx(Link, {
						href: $("admin.blogs.index"),
						children: /* @__PURE__ */ jsxs(Button, {
							variant: "outline",
							className: "gap-2 border-white/10 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white font-mono cursor-pointer",
							children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4" }), /* @__PURE__ */ jsx("span", { children: "Back to Blogs" })]
						})
					}), blog.slug && /* @__PURE__ */ jsx("a", {
						href: `/blog/${blog.slug}`,
						target: "_blank",
						rel: "noreferrer",
						children: /* @__PURE__ */ jsxs(Button, {
							variant: "outline",
							className: "gap-2 border-white/10 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white font-mono cursor-pointer",
							children: [/* @__PURE__ */ jsx(ExternalLink, { className: "w-4 h-4 text-accent" }), /* @__PURE__ */ jsx("span", { children: "View Live" })]
						})
					})]
				})
			}), /* @__PURE__ */ jsx(BlogForm, {
				mode: "edit",
				blog,
				categories,
				authors
			})]
		})
	});
}
//#endregion
export { BlogsEdit as default };
