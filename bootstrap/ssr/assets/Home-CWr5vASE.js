import { HomeVariantSwitcher } from "./HomeVariantSwitcher-BXQ09SVq.js";
import { HomeOriginal } from "./HomeOriginal-k4qLB1pA.js";
import { HomeVisual } from "./HomeVisual-FlhyndUS.js";
import { HomeCinematic } from "./HomeCinematic-0qpuSiOI.js";
import { HomeEditorial } from "./HomeEditorial-gndU4Tx7.js";
import { HomeMetric } from "./HomeMetric-B-oSXoCb.js";
import { HomeBold } from "./HomeBold-DZBZ4rgK.js";
import { useEffect, useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Home.tsx
function Home({ clients = [] }) {
	const { url } = usePage();
	const [currentVariant, setCurrentVariant] = useState("1");
	useEffect(() => {
		if (typeof window !== "undefined") {
			const v = new URLSearchParams(window.location.search).get("v");
			if (v && [
				"1",
				"2",
				"3",
				"4",
				"5",
				"6"
			].includes(v)) setCurrentVariant(v);
			else {
				const saved = localStorage.getItem("ce_home_variant");
				if (saved && [
					"1",
					"2",
					"3",
					"4",
					"5",
					"6"
				].includes(saved)) setCurrentVariant(saved);
			}
		}
	}, [url]);
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
			case "3": return /* @__PURE__ */ jsx(HomeCinematic, { clients });
			case "4": return /* @__PURE__ */ jsx(HomeEditorial, { clients });
			case "5": return /* @__PURE__ */ jsx(HomeMetric, { clients });
			case "6": return /* @__PURE__ */ jsx(HomeBold, { clients });
			default: return /* @__PURE__ */ jsx(HomeOriginal, { clients });
		}
	};
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsxs(Head, { children: [/* @__PURE__ */ jsx("title", { children: "CuttingEdger — Radical Digital Agency & Post-Production Atelier" }), /* @__PURE__ */ jsx("meta", {
			name: "description",
			content: "Enterprise-grade e-commerce image post-production, AI headshots, virtual try-on, and ghost mannequin retouching with #de4a2c brand identity."
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
