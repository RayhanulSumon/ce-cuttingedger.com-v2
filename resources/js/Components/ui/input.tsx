import * as React from "react"
import { cn } from "cn"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-10 w-full min-w-0 rounded-lg border border-line-strong bg-surface px-3.5 py-2 text-sm text-ink placeholder:text-faint shadow-xs transition-all duration-150 outline-none",
        "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-danger aria-invalid:ring-1 aria-invalid:ring-danger/40",
        className
      )}
      {...props}
    />
  )
}

export { Input }
