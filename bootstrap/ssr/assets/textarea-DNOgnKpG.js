import { t as cn } from "./utils-BVTyW6jK.js";
import * as React$1 from "react";
import { jsx } from "react/jsx-runtime";
//#region resources/js/Components/ui/textarea.tsx
var Textarea = React$1.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ jsx("textarea", {
		className: cn("flex min-h-[90px] w-full rounded-lg border border-white/10 bg-[#0d0f15] px-3.5 py-2 text-sm text-white placeholder:text-neutral-500 shadow-sm transition-all duration-150 outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/60 focus-visible:border-accent/60 disabled:cursor-not-allowed disabled:opacity-50", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
//#endregion
export { Textarea as t };
