import { t as cn } from "./utils-BVTyW6jK.js";
import * as React$1 from "react";
import { jsx } from "react/jsx-runtime";
import * as SwitchPrimitives from "@radix-ui/react-switch";
//#region resources/js/Components/ui/switch.tsx
var Switch = React$1.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SwitchPrimitives.Root, {
	className: cn("peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-accent data-[state=unchecked]:bg-white/20", className),
	...props,
	ref,
	children: /* @__PURE__ */ jsx(SwitchPrimitives.Thumb, { className: cn("pointer-events-none block h-5 w-5 rounded-full bg-black shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0 data-[state=unchecked]:bg-white") })
}));
Switch.displayName = SwitchPrimitives.Root.displayName;
//#endregion
export { Switch as t };
