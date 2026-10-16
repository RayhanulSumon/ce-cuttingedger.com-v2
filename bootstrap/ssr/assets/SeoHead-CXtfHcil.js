import "react";
import { Head } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Components/Common/SeoHead.tsx
function SeoHead({ title, description = "CuttingEdger is an elite digital agency engineering kinetic software interfaces, tactile brand identities, and high-performance web applications.", image = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80", canonicalUrl, type = "website", jsonLd }) {
	const siteTitle = title ? `${title} — CuttingEdger` : "CuttingEdger — Radical Digital Agency & Creative Engineering";
	return /* @__PURE__ */ jsxs(Head, { children: [
		/* @__PURE__ */ jsx("title", { children: siteTitle }),
		/* @__PURE__ */ jsx("meta", {
			name: "description",
			content: description
		}),
		/* @__PURE__ */ jsx("meta", {
			property: "og:type",
			content: type
		}),
		/* @__PURE__ */ jsx("meta", {
			property: "og:title",
			content: siteTitle
		}),
		/* @__PURE__ */ jsx("meta", {
			property: "og:description",
			content: description
		}),
		/* @__PURE__ */ jsx("meta", {
			property: "og:image",
			content: image
		}),
		canonicalUrl && /* @__PURE__ */ jsx("meta", {
			property: "og:url",
			content: canonicalUrl
		}),
		/* @__PURE__ */ jsx("meta", {
			name: "twitter:card",
			content: "summary_large_image"
		}),
		/* @__PURE__ */ jsx("meta", {
			name: "twitter:title",
			content: siteTitle
		}),
		/* @__PURE__ */ jsx("meta", {
			name: "twitter:description",
			content: description
		}),
		/* @__PURE__ */ jsx("meta", {
			name: "twitter:image",
			content: image
		}),
		canonicalUrl && /* @__PURE__ */ jsx("link", {
			rel: "canonical",
			href: canonicalUrl
		}),
		/* @__PURE__ */ jsx("script", {
			type: "application/ld+json",
			children: JSON.stringify(jsonLd || {
				"@context": "https://schema.org",
				"@type": "Organization",
				name: "CuttingEdger",
				url: "https://cuttingedger.com",
				logo: "https://cuttingedger.com/logo.png",
				description,
				sameAs: [
					"https://twitter.com/cuttingedger",
					"https://linkedin.com/company/cuttingedger",
					"https://github.com/cuttingedger"
				]
			})
		})
	] });
}
//#endregion
export { SeoHead as t };
