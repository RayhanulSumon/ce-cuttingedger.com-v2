import "react";
import { Head, usePage } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Components/Common/SeoHead.tsx
function SeoHead({ title, description = "Cutting Edger is an AI-driven visual performance agency specializing in e-commerce catalog retouching, color standardization, white-label production, and 3D CGI virtual studio staging.", keywords, noindex = false, robots, image = "https://cuttingedger.com/images/ce/ce_og_banner.jpg", canonicalUrl, type = "website", breadcrumbs, serviceSchema, articleSchema, faqSchema, reviewsSchema, jsonLd }) {
	const { url } = usePage();
	const siteTitle = title ? `${title} — Cutting Edger` : "Cutting Edger — AI-Driven Visual Performance Agency";
	const currentUrl = canonicalUrl || (typeof window !== "undefined" ? window.location.href : `https://cuttingedger.com${url}`);
	const robotsContent = robots || (noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
	const graph = [{
		"@context": "https://schema.org",
		"@type": "Organization",
		"@id": "https://cuttingedger.com/#organization",
		name: "Cutting Edger",
		url: "https://cuttingedger.com",
		logo: {
			"@type": "ImageObject",
			url: "https://cuttingedger.com/images/ce/ce_logo_word.png",
			width: 600,
			height: 120
		},
		description,
		telephone: "+1 (409) 995-2565",
		email: "hello@cuttingedger.com",
		address: {
			"@type": "PostalAddress",
			streetAddress: "Artisan Center, Level-7, House# 57/9, West Panthapath",
			addressLocality: "Dhaka",
			postalCode: "1215",
			addressCountry: "BD"
		},
		sameAs: [
			"https://facebook.com/CuttingEdgerInc",
			"https://twitter.com/cutting_edger",
			"https://instagram.com/cuttingedgerinc",
			"https://linkedin.com/company/cutting-edger",
			"https://youtube.com/channel/UCJS-gaoOogk-552jQfRYPBQ"
		]
	}];
	if (breadcrumbs && breadcrumbs.length > 0) graph.push({
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: breadcrumbs.map((b, idx) => ({
			"@type": "ListItem",
			position: idx + 1,
			name: b.name,
			item: b.url.startsWith("http") ? b.url : `https://cuttingedger.com${b.url}`
		}))
	});
	if (serviceSchema) graph.push({
		"@context": "https://schema.org",
		"@type": "Service",
		name: serviceSchema.name,
		description: serviceSchema.description,
		serviceType: serviceSchema.serviceType || serviceSchema.name,
		url: serviceSchema.url || currentUrl,
		provider: { "@id": "https://cuttingedger.com/#organization" },
		areaServed: [
			"US",
			"CA",
			"GB",
			"EU",
			"AU"
		]
	});
	if (articleSchema) graph.push({
		"@context": "https://schema.org",
		"@type": "Article",
		headline: articleSchema.headline,
		description: articleSchema.description || description,
		image: articleSchema.image || image,
		author: {
			"@type": "Organization",
			name: articleSchema.author || "Cutting Edger Studio"
		},
		publisher: { "@id": "https://cuttingedger.com/#organization" },
		datePublished: articleSchema.datePublished || "2026-01-01",
		dateModified: articleSchema.dateModified || articleSchema.datePublished || "2026-10-23",
		mainEntityOfPage: currentUrl
	});
	if (faqSchema && faqSchema.length > 0) graph.push({
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: faqSchema.map((faq) => ({
			"@type": "Question",
			name: faq.question,
			acceptedAnswer: {
				"@type": "Answer",
				text: faq.answer
			}
		}))
	});
	if (reviewsSchema) graph.push({
		"@context": "https://schema.org",
		"@type": "ProfessionalService",
		name: "Cutting Edger",
		image,
		aggregateRating: {
			"@type": "AggregateRating",
			ratingValue: reviewsSchema.ratingValue.toFixed(1),
			reviewCount: reviewsSchema.reviewCount,
			bestRating: reviewsSchema.bestRating || 5,
			worstRating: 1
		}
	});
	if (jsonLd) graph.push(jsonLd);
	return /* @__PURE__ */ jsxs(Head, { children: [
		/* @__PURE__ */ jsx("title", { children: siteTitle }),
		/* @__PURE__ */ jsx("meta", {
			name: "description",
			content: description
		}),
		keywords && /* @__PURE__ */ jsx("meta", {
			name: "keywords",
			content: keywords
		}),
		/* @__PURE__ */ jsx("meta", {
			name: "robots",
			content: robotsContent
		}),
		/* @__PURE__ */ jsx("link", {
			rel: "canonical",
			href: currentUrl
		}),
		/* @__PURE__ */ jsx("meta", {
			property: "og:type",
			content: type
		}),
		/* @__PURE__ */ jsx("meta", {
			property: "og:site_name",
			content: "Cutting Edger"
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
		/* @__PURE__ */ jsx("meta", {
			property: "og:url",
			content: currentUrl
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
		/* @__PURE__ */ jsx("script", {
			type: "application/ld+json",
			children: JSON.stringify({
				"@context": "https://schema.org",
				"@graph": graph
			})
		})
	] });
}
//#endregion
export { SeoHead as t };
