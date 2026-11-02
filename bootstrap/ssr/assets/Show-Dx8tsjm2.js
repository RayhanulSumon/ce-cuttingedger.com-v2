import { t as SeoHead } from "./SeoHead-jRblvokC.js";
import { VariantSwitcher } from "./VariantSwitcher-8YpK3TN_.js";
import { VariantMinimalist } from "./VariantMinimalist-DPJAe2Pq.js";
import { VariantEditorial } from "./VariantEditorial-B51efcam.js";
import { VariantTechnical } from "./VariantTechnical-xusV4Kh6.js";
import { VariantHighConversion } from "./VariantHighConversion-2ezNnkUp.js";
import { VariantDarkObsidian } from "./VariantDarkObsidian-CestW0eT.js";
import { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Services/Show.tsx
var parseVariantParam = (param) => {
	if (!param) return "minimalist";
	const p = param.toLowerCase().trim();
	if (p === "1" || p === "minimalist" || p === "studio") return "minimalist";
	if (p === "2" || p === "editorial" || p === "lookbook") return "editorial";
	if (p === "3" || p === "technical" || p === "lab") return "technical";
	if (p === "4" || p === "conversion" || p === "ecommerce") return "conversion";
	if (p === "5" || p === "obsidian" || p === "dark") return "obsidian";
	return "minimalist";
};
function Show({ service, otherServices = [], relatedProjects = [] }) {
	const { settings } = usePage().props;
	const calendlyUrl = settings?.calendly_url || "https://calendly.com/cuttingedger/discovery-call";
	const [variant, setVariant] = useState("minimalist");
	useEffect(() => {
		if (typeof window !== "undefined") {
			const urlParams = new URLSearchParams(window.location.search);
			const urlV = urlParams.get("v") || urlParams.get("variant");
			if (urlV) setVariant(parseVariantParam(urlV));
			else {
				const stored = localStorage.getItem("ce_service_page_variant");
				if (stored) setVariant(parseVariantParam(stored));
			}
		}
	}, []);
	const handleSelectVariant = (newVariant) => {
		setVariant(newVariant);
		if (typeof window !== "undefined") {
			const url = new URL(window.location.href);
			url.searchParams.set("v", newVariant);
			window.history.replaceState({}, "", url.toString());
			localStorage.setItem("ce_service_page_variant", newVariant);
		}
	};
	const breadcrumbs = [{
		name: "Home",
		url: "/"
	}, {
		name: "Services",
		url: "/services"
	}];
	if (service.parent) breadcrumbs.push({
		name: service.parent.title,
		url: `/services/${service.parent.slug}`
	});
	breadcrumbs.push({
		name: service.title,
		url: service.parent ? `/services/${service.parent.slug}/${service.slug}` : `/services/${service.slug}`
	});
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(SeoHead, {
			title: service.meta_title || `${service.title} Services — Cutting Edger`,
			description: service.meta_description || service.subtitle || service.description,
			breadcrumbs,
			serviceSchema: {
				name: service.title,
				description: service.description,
				serviceType: service.title
			},
			faqSchema: service.faqs || []
		}),
		/* @__PURE__ */ jsxs("main", {
			className: "relative transition-all duration-300",
			children: [
				variant === "minimalist" && /* @__PURE__ */ jsx(VariantMinimalist, {
					service,
					otherServices,
					relatedProjects,
					calendlyUrl
				}),
				variant === "editorial" && /* @__PURE__ */ jsx(VariantEditorial, {
					service,
					otherServices,
					relatedProjects,
					calendlyUrl
				}),
				variant === "technical" && /* @__PURE__ */ jsx(VariantTechnical, {
					service,
					otherServices,
					relatedProjects,
					calendlyUrl
				}),
				variant === "conversion" && /* @__PURE__ */ jsx(VariantHighConversion, {
					service,
					otherServices,
					relatedProjects,
					calendlyUrl
				}),
				variant === "obsidian" && /* @__PURE__ */ jsx(VariantDarkObsidian, {
					service,
					otherServices,
					relatedProjects,
					calendlyUrl
				})
			]
		}),
		/* @__PURE__ */ jsx(VariantSwitcher, {
			currentVariant: variant,
			onSelectVariant: handleSelectVariant,
			serviceTitle: service.title
		})
	] });
}
//#endregion
export { Show as default };
