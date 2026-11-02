import { HomeVariantSwitcher } from "./HomeVariantSwitcher-DxDS2Tim.js";
import { HomeOriginal } from "./HomeOriginal-k4qLB1pA.js";
import { HomeVisual } from "./HomeVisual-FlhyndUS.js";
import { HomePortfolio } from "./HomePortfolio-CLVFgukR.js";
import { HomeEditorial } from "./HomeEditorial-gndU4Tx7.js";
import { HomePhotoLight } from "./HomePhotoLight-BJcAsY74.js";
import { HomeStudioS1 } from "./HomeStudioS1-Dx36h44p.js";
import { HomeOmniStudio } from "./HomeOmniStudio-KDeToqye.js";
import { HomeRetouchStudio } from "./HomeRetouchStudio-BrhNzPpZ.js";
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
	const getInitialVariant = () => {
		if (variant && valid.includes(variant)) return variant;
		if (typeof window !== "undefined") {
			const v = new URLSearchParams(window.location.search).get("v");
			if (v && valid.includes(v)) return v;
			const saved = localStorage.getItem("ce_home_variant");
			if (saved && valid.includes(saved)) return saved;
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
		if (!v && variant && valid.includes(variant)) v = variant;
		if (v && valid.includes(v)) {
			setCurrentVariant(v);
			if (typeof window !== "undefined") try {
				localStorage.setItem("ce_home_variant", v);
			} catch (e) {}
		} else if (typeof window !== "undefined") {
			const saved = localStorage.getItem("ce_home_variant");
			if (saved && valid.includes(saved)) setCurrentVariant(saved);
		}
	}, [url, variant]);
	const handleVariantChange = (id) => {
		setCurrentVariant(id);
		if (typeof window !== "undefined") {
			try {
				localStorage.setItem("ce_home_variant", id);
			} catch (e) {}
			const newUrl = new URL(window.location.href);
			newUrl.searchParams.set("v", id);
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
			case "3": return /* @__PURE__ */ jsx(HomePortfolio, { clients });
			case "4": return /* @__PURE__ */ jsx(HomeEditorial, { clients });
			case "5": return /* @__PURE__ */ jsx(HomePhotoLight, { clients });
			case "6": return /* @__PURE__ */ jsx(HomeStudioS1, { clients });
			case "7": return /* @__PURE__ */ jsx(HomeOmniStudio, { clients });
			case "8": return /* @__PURE__ */ jsx(HomeRetouchStudio, { clients });
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
