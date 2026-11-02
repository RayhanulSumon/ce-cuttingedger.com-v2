import { t as cn } from "./utils-BVTyW6jK.js";
import "react";
import { jsx } from "react/jsx-runtime";
import { cva } from "class-variance-authority";
//#region resources/js/Components/ui/badge.tsx
var badgeVariants = cva("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold font-mono tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
	variants: { variant: {
		default: "border-transparent bg-accent text-black hover:bg-[#bde600]",
		secondary: "border-transparent bg-white/10 text-neutral-200 hover:bg-white/20",
		destructive: "border-transparent bg-rose-500/20 text-rose-400 border border-rose-500/30",
		outline: "text-neutral-300 border-white/20",
		success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
		accent: "border-accent/40 bg-accent/10 text-accent"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
//#endregion
export { Badge as t };
