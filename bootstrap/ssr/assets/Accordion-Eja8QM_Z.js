import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Components/UI/Accordion.tsx
function AccordionItem({ id, question, answer, defaultOpen = false }) {
	const [isOpen, setIsOpen] = useState(defaultOpen);
	return /* @__PURE__ */ jsxs("div", {
		className: "border-b border-white/10 group transition-colors",
		children: [/* @__PURE__ */ jsxs("button", {
			type: "button",
			id: `accordion-btn-${id}`,
			"aria-expanded": isOpen,
			"aria-controls": `accordion-panel-${id}`,
			onClick: () => setIsOpen(!isOpen),
			className: "w-full py-6 sm:py-8 flex items-center justify-between text-left cursor-pointer focus:outline-none",
			children: [/* @__PURE__ */ jsx("span", {
				className: "font-display font-bold text-lg sm:text-2xl text-white group-hover:text-[#d4ff00] transition-colors pr-6",
				children: question
			}), /* @__PURE__ */ jsx("div", {
				className: `w-9 h-9 shrink-0 rounded-full border border-white/10 flex items-center justify-center transition-all duration-300 ${isOpen ? "bg-[#d4ff00] text-black border-[#d4ff00]" : "text-neutral-400 group-hover:border-[#d4ff00] group-hover:text-[#d4ff00]"}`,
				children: isOpen ? /* @__PURE__ */ jsx(Minus, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" })
			})]
		}), /* @__PURE__ */ jsx("div", {
			id: `accordion-panel-${id}`,
			role: "region",
			"aria-labelledby": `accordion-btn-${id}`,
			className: `overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 opacity-100 pb-8" : "max-h-0 opacity-0"}`,
			children: /* @__PURE__ */ jsx("p", {
				className: "text-neutral-400 text-sm sm:text-base leading-relaxed max-w-3xl",
				children: answer
			})
		})]
	});
}
function Accordion({ items }) {
	return /* @__PURE__ */ jsx("div", {
		className: "divide-y divide-transparent",
		children: items.map((item, index) => /* @__PURE__ */ jsx(AccordionItem, {
			...item,
			defaultOpen: index === 0
		}, item.id))
	});
}
//#endregion
export { Accordion as t };
