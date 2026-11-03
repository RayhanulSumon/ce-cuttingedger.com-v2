import { t as SeoHead } from "./SeoHead-jRblvokC.js";
import { VariantSwitcher } from "./VariantSwitcher-DZLUvhJc.js";
import { VariantGlassmorphic } from "./VariantGlassmorphic-CS6okb78.js";
import { VariantEditorial } from "./VariantEditorial-B51efcam.js";
import { VariantParallax } from "./VariantParallax-aZGO3fVB.js";
import { VariantVisualSlider } from "./VariantVisualSlider-DnYHR-El.js";
import { VariantDarkObsidian } from "./VariantDarkObsidian-CestW0eT.js";
import { VariantBentoAtelier } from "./VariantBentoAtelier-CaqX_if1.js";
import { VariantSplitCanvas } from "./VariantSplitCanvas-BRHp3AY5.js";
import { VariantPerspective3D } from "./VariantPerspective3D-e4OCOo0N.js";
import { VariantVisualWall } from "./VariantVisualWall-C1Y-IeCW.js";
import { VariantLookbookStream } from "./VariantLookbookStream-BzP-XP_2.js";
import { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Services/Show.tsx
var parseVariantParam = (param) => {
	if (!param) return "glassmorphic";
	const p = param.toLowerCase().trim();
	if (p === "1" || p === "glassmorphic" || p === "lumina" || p === "minimalist" || p === "studio") return "glassmorphic";
	if (p === "2" || p === "editorial" || p === "lookbook") return "editorial";
	if (p === "3" || p === "parallax" || p === "horizon" || p === "technical" || p === "lab") return "parallax";
	if (p === "4" || p === "slider" || p === "slider-showcase" || p === "cinematic" || p === "conversion") return "slider-showcase";
	if (p === "5" || p === "obsidian" || p === "dark") return "obsidian";
	if (p === "6" || p === "bento" || p === "bento-grid" || p === "atelier") return "bento-grid";
	if (p === "7" || p === "split" || p === "split-canvas" || p === "canvas") return "split-canvas";
	if (p === "8" || p === "3d" || p === "perspective" || p === "perspective-3d") return "perspective-3d";
	if (p === "9" || p === "wall" || p === "visual-wall" || p === "exhibition") return "visual-wall";
	if (p === "10" || p === "stream" || p === "lookbook-stream" || p === "runway") return "lookbook-stream";
	return "glassmorphic";
};
function Show({ service, otherServices = [], relatedProjects = [] }) {
	const { settings } = usePage().props;
	const calendlyUrl = settings?.calendly_url || "https://calendly.com/cuttingedger/discovery-call";
	const [variant, setVariant] = useState("glassmorphic");
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
				variant === "glassmorphic" && /* @__PURE__ */ jsx(VariantGlassmorphic, {
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
				variant === "parallax" && /* @__PURE__ */ jsx(VariantParallax, {
					service,
					otherServices,
					relatedProjects,
					calendlyUrl
				}),
				variant === "slider-showcase" && /* @__PURE__ */ jsx(VariantVisualSlider, {
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
				}),
				variant === "bento-grid" && /* @__PURE__ */ jsx(VariantBentoAtelier, {
					service,
					otherServices,
					relatedProjects,
					calendlyUrl
				}),
				variant === "split-canvas" && /* @__PURE__ */ jsx(VariantSplitCanvas, {
					service,
					otherServices,
					relatedProjects,
					calendlyUrl
				}),
				variant === "perspective-3d" && /* @__PURE__ */ jsx(VariantPerspective3D, {
					service,
					otherServices,
					relatedProjects,
					calendlyUrl
				}),
				variant === "visual-wall" && /* @__PURE__ */ jsx(VariantVisualWall, {
					service,
					otherServices,
					relatedProjects,
					calendlyUrl
				}),
				variant === "lookbook-stream" && /* @__PURE__ */ jsx(VariantLookbookStream, {
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
