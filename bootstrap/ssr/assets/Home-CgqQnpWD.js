import { HomeVariantSwitcher } from "./HomeVariantSwitcher-Agae20FO.js";
import { HomeOriginal } from "./HomeOriginal-k4qLB1pA.js";
import { HomeFigmaRed } from "./HomeFigmaRed-CAcqEDZV.js";
import { HomeEditorial } from "./HomeEditorial-CjQvAxrM.js";
import { HomeTechnical } from "./HomeTechnical-DXM_o7uB.js";
import { HomeConversion } from "./HomeConversion-B6mdGchQ.js";
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
				"5"
			].includes(v)) setCurrentVariant(v);
			else {
				const saved = localStorage.getItem("ce_home_variant");
				if (saved && [
					"1",
					"2",
					"3",
					"4",
					"5"
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
			case "2": return /* @__PURE__ */ jsx(HomeFigmaRed, { clients });
			case "3": return /* @__PURE__ */ jsx(HomeEditorial, { clients });
			case "4": return /* @__PURE__ */ jsx(HomeTechnical, { clients });
			case "5": return /* @__PURE__ */ jsx(HomeConversion, { clients });
			default: return /* @__PURE__ */ jsx(HomeOriginal, { clients });
		}
	};
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsxs(Head, { children: [/* @__PURE__ */ jsx("title", { children: "CuttingEdger — Radical Digital Agency & Post-Production Atelier" }), /* @__PURE__ */ jsx("meta", {
			name: "description",
			content: "Enterprise-grade e-commerce image post-production, hand-crafted clipping paths, and ghost mannequin retouching with #de4a2c brand identity."
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
