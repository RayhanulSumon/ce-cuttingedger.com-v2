import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold font-mono tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-[#d4ff00] text-black hover:bg-[#bde600]",
                secondary:
                    "border-transparent bg-white/10 text-neutral-200 hover:bg-white/20",
                destructive:
                    "border-transparent bg-rose-500/20 text-rose-400 border border-rose-500/30",
                outline: "text-neutral-300 border-white/20",
                success:
                    "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
                accent:
                    "border-[#d4ff00]/40 bg-[#d4ff00]/10 text-[#d4ff00]",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    );
}

export { Badge, badgeVariants };
