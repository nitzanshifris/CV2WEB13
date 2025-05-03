import type React from "react"
import { forwardRef, type InputHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

export interface NeomorphInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
}

const NeomorphInput = forwardRef<HTMLInputElement, NeomorphInputProps>(({ className, icon, type, ...props }, ref) => {
  return (
    <div className="relative">
      {icon && <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">{icon}</div>}
      <input
        type={type}
        className={cn(
          "neomorphism-input w-full px-4 py-2 text-foreground",
          icon && "pl-10",
          "focus:outline-none focus:ring-2 focus:ring-primary/30",
          className,
        )}
        ref={ref}
        {...props}
      />
    </div>
  )
})

NeomorphInput.displayName = "NeomorphInput"

export { NeomorphInput }
