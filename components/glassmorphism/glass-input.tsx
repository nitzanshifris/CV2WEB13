import type React from "react"
import { forwardRef, type InputHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

export interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
  depth?: 1 | 2 | 3 | 4
  color?: "default" | "blue" | "purple" | "amber" | "emerald" | "rose"
}

const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ className, icon, type, depth = 2, color = "default", ...props }, ref) => {
    return (
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">{icon}</div>}
        <input
          type={type}
          className={cn(
            "glass-input w-full px-4 py-2 text-foreground",
            `glass-depth-${depth}`,
            color !== "default" && `glass-${color}`,
            icon && "pl-10",
            "focus:outline-none focus:ring-2 focus:ring-primary/30",
            className,
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  },
)

GlassInput.displayName = "GlassInput"

export { GlassInput }
