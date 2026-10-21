import * as React from "react"
import { cn } from "cn"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-10 w-full min-w-0 rounded-lg border border-white/10 bg-[#0d0f15] px-3.5 py-2 text-sm text-white placeholder:text-neutral-500 shadow-sm transition-all duration-150 outline-none",
        "focus-visible:border-[#d4ff00]/60 focus-visible:ring-1 focus-visible:ring-[#d4ff00]/60",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-rose-500 aria-invalid:ring-1 aria-invalid:ring-rose-500/50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
