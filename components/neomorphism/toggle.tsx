"use client"

import { useState, forwardRef, type HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

export interface NeomorphToggleProps extends HTMLAttributes<HTMLDivElement> {
  defaultChecked?: boolean
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  label?: string
}

const NeomorphToggle = forwardRef<HTMLDivElement, NeomorphToggleProps>(
  ({ className, defaultChecked, checked, onCheckedChange, disabled, label, ...props }, ref) => {
    const [isChecked, setIsChecked] = useState(defaultChecked || checked || false)

    const handleToggle = () => {
      if (disabled) return

      const newChecked = !isChecked
      setIsChecked(newChecked)
      onCheckedChange?.(newChecked)
    }

    return (
      <div className="flex items-center gap-2" ref={ref} {...props}>
        <div
          className={cn(
            "neomorphism-toggle cursor-pointer",
            isChecked && "active",
            disabled && "opacity-50 cursor-not-allowed",
            className,
          )}
          onClick={handleToggle}
          role="switch"
          aria-checked={isChecked}
          aria-label={label}
        />
        {label && <span className="text-sm">{label}</span>}
      </div>
    )
  },
)

NeomorphToggle.displayName = "NeomorphToggle"

export { NeomorphToggle }
