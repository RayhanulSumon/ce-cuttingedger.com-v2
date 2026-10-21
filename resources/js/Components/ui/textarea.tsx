import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, ...props }, ref) => {
        return (
            <textarea
                className={cn(
                    "flex min-h-[90px] w-full rounded-lg border border-white/10 bg-[#0d0f15] px-3.5 py-2 text-sm text-white placeholder:text-neutral-500 shadow-sm transition-all duration-150 outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#d4ff00]/60 focus-visible:border-[#d4ff00]/60 disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Textarea.displayName = "Textarea";

export { Textarea };
