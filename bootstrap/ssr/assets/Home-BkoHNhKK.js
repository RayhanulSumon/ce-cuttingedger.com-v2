import { HomeVariantSwitcher } from "./HomeVariantSwitcher-B_d5n1eC.js";
import { HomeOriginal } from "./HomeOriginal-k4qLB1pA.js";
import { HomeVisual } from "./HomeVisual-FlhyndUS.js";
import { HomeEditorial } from "./HomeEditorial-gndU4Tx7.js";
import { HomeRetouchStudio } from "./HomeRetouchStudio-BrhNzPpZ.js";
import { HomeLuminaGlass } from "./HomeLuminaGlass-C3UsRXoI.js";
import { HomeAtelierEditorial } from "./HomeAtelierEditorial-DMqDUVwm.js";
import { HomeParallaxHorizon } from "./HomeParallaxHorizon-DOMD065g.js";
import { HomeArchitectBlueprint } from "./HomeArchitectBlueprint-C5un7YmA.js";
import { useEffect, useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Home.tsx
function Home({ clients = [], variant = "1" }) {
	const { url } = usePage();
	const valid = [
		"1",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"8"
	];
	const resolveVariant = (raw) => {
		if (!raw) return "1";
		const legacyMap = {
			"4": "3",
			"8": "4",
			"9": "5",
			"10": "6",
			"11": "7",
			"13": "8"
		};
		if (valid.includes(raw)) return raw;
		if (legacyMap[raw]) return legacyMap[raw];
		return "1";
	};
	const getInitialVariant = () => {
		if (variant) {
			const mapped = resolveVariant(variant);
			if (mapped) return mapped;
		}
		if (typeof window !== "undefined") {
			const v = new URLSearchParams(window.location.search).get("v");
			if (v) return resolveVariant(v);
			const saved = localStorage.getItem("ce_home_variant");
			if (saved) return resolveVariant(saved);
		}
		return "1";
	};
	const [currentVariant, setCurrentVariant] = useState(getInitialVariant);
	useEffect(() => {
		let v = null;
		if (url && url.includes("?")) {
			const search = url.split("?")[1];
			v = new URLSearchParams(search).get("v");
		}
		if (!v && typeof window !== "undefined") v = new URLSearchParams(window.location.search).get("v");
		if (!v && variant) v = variant;
		const resolved = resolveVariant(v);
		setCurrentVariant(resolved);
		if (typeof window !== "undefined") try {
			localStorage.setItem("ce_home_variant", resolved);
		} catch (e) {}
	}, [url, variant]);
	const handleVariantChange = (id) => {
		const resolved = resolveVariant(id);
		setCurrentVariant(resolved);
		if (typeof window !== "undefined") {
			try {
				localStorage.setItem("ce_home_variant", resolved);
			} catch (e) {}
			const newUrl = new URL(window.location.href);
			newUrl.searchParams.set("v", resolved);
			window.history.pushState({}, "", newUrl.toString());
			window.scrollTo({
				top: 0,
				behavior: "smooth"
			});
		}
	};
	const renderVariantContent = () => {
		switch (currentVariant) {
			case "2": return /* @__PURE__ */ jsx(HomeVisual, { clients });
			case "3": return /* @__PURE__ */ jsx(HomeEditorial, { clients });
			case "4": return /* @__PURE__ */ jsx(HomeRetouchStudio, { clients });
			case "5": return /* @__PURE__ */ jsx(HomeLuminaGlass, { clients });
			case "6": return /* @__PURE__ */ jsx(HomeAtelierEditorial, { clients });
			case "7": return /* @__PURE__ */ jsx(HomeParallaxHorizon, { clients });
			case "8": return /* @__PURE__ */ jsx(HomeArchitectBlueprint, { clients });
			default: return /* @__PURE__ */ jsx(HomeOriginal, { clients });
		}
	};
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsxs(Head, { children: [/* @__PURE__ */ jsx("title", { children: "CuttingEdger — Radical Digital Agency & Post-Production Atelier" }), /* @__PURE__ */ jsx("meta", {
			name: "description",
			content: "Enterprise-grade e-commerce image post-production, AI corporate headshots, virtual try-on, AI fashion models, and hand-crafted clipping paths."
		})] }),
		renderVariantContent(),
		/* @__PURE__ */ jsx(HomeVariantSwitcher, {
			currentVariant,
			onVariantChange: handleVariantChange
		})
	] });
}
//#endregion
export { Home as default };
