import { t as cn } from "./utils-BVTyW6jK.js";
import * as React$1 from "react";
import { Check, ChevronDown } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
import * as SelectPrimitive from "@radix-ui/react-select";
//#region resources/js/Components/ui/select.tsx
var Select = SelectPrimitive.Root;
var SelectGroup = SelectPrimitive.Group;
var SelectValue = SelectPrimitive.Value;
var SelectTrigger = React$1.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(SelectPrimitive.Trigger, {
	ref,
	className: cn("flex h-10 w-full items-center justify-between rounded-lg border border-white/10 bg-[#0d0f15] px-3.5 py-2 text-sm text-white placeholder:text-neutral-500 shadow-sm transition-all duration-150 outline-none focus:outline-none focus:ring-1 focus:ring-accent/60 focus:border-accent/60 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span]:truncate [&>span]:min-w-0 [&>span]:text-left cursor-pointer", className),
	...props,
	children: [children, /* @__PURE__ */ jsx(SelectPrimitive.Icon, {
		asChild: true,
		children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 opacity-50 shrink-0 ml-2" })
	})]
}));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
var SelectContent = React$1.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.Portal, { children: /* @__PURE__ */ jsx(SelectPrimitive.Content, {
	ref,
	className: cn("relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-xl border border-white/10 bg-[#12141c] text-white shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1", className),
	position,
	...props,
	children: /* @__PURE__ */ jsx(SelectPrimitive.Viewport, {
		className: cn("p-1", position === "popper" && "w-full min-w-[var(--radix-select-trigger-width)]"),
		children
	})
}) }));
SelectContent.displayName = SelectPrimitive.Content.displayName;
var SelectLabel = React$1.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", {
	ref,
	className: cn("px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-neutral-400 select-none", className),
	...props
}));
SelectLabel.displayName = "SelectLabel";
var SelectItem = React$1.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(SelectPrimitive.Item, {
	ref,
	className: cn("relative flex w-full cursor-pointer select-none items-center rounded-lg py-2 pl-3 pr-8 text-sm outline-none transition-colors data-[highlighted]:bg-white/10 data-[highlighted]:text-white focus:bg-white/10 focus:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-neutral-200", className),
	...props,
	children: [/* @__PURE__ */ jsx("span", {
		className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ jsx(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4 text-accent" }) })
	}), /* @__PURE__ */ jsx(SelectPrimitive.ItemText, { children })]
}));
SelectItem.displayName = SelectPrimitive.Item.displayName;
var SelectSeparator = React$1.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.Separator, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-white/10", className),
	...props
}));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;
//#endregion
export { SelectLabel as a, SelectItem as i, SelectContent as n, SelectTrigger as o, SelectGroup as r, SelectValue as s, Select as t };
