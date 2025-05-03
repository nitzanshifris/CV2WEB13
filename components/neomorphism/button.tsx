import type React from "react"
import { forwardRef, type ButtonHTMLAttributes } from "react"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

export interface NeomorphButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "outline"
  size?: "sm" | "md" | "lg" | "icon"
  isLoading?: boolean
  loadingText?: string
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
}

const NeomorphButton = forwardRef<HTMLButtonElement, NeomorphButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      isLoading = false,
      loadingText,
      iconLeft,
      iconRight,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const variantClasses = {
      default: "neomorphism-btn text-foreground",
      primary: "neomorphism-btn bg-primary text-primary-foreground hover:bg-primary/90",
      outline: "neomorphism-btn bg-transparent border-2 border-border hover:bg-muted/50",
    }

    const sizeClasses = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 py-2",
      lg: "h-12 px-6 py-3 text-lg",
      icon: "h-10 w-10 p-2",
    }

    return (
      <button
        ref={ref}
        className={cn(
          variantClasses[variant],
          sizeClasses[size],
          "font-medium relative",
          isLoading && "opacity-80 cursor-not-allowed",
          disabled && "opacity-50 cursor-not-allowed pointer-events-none",
          className,
        )}
        disabled={isLoading || disabled}
        {...props}
      >
        <span className="flex items-center justify-center gap-2">
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {!isLoading && iconLeft}
          {isLoading && loadingText ? loadingText : children}
          {!isLoading && iconRight}
        </span>
      </button>
    )
  },
)

NeomorphButton.displayName = "NeomorphButton"

export { NeomorphButton }
