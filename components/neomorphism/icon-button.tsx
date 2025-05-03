import { forwardRef, type ButtonHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

export interface NeomorphIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg"
  variant?: "default" | "primary"
}

const NeomorphIconButton = forwardRef<HTMLButtonElement, NeomorphIconButtonProps>(
  ({ className, size = "md", variant = "default", children, ...props }, ref) => {
    const sizeClasses = {
      sm: "h-8 w-8",
      md: "h-10 w-10",
      lg: "h-12 w-12",
    }

    const variantClasses = {
      default: "neomorphism-icon text-foreground",
      primary: "neomorphism-icon bg-primary text-primary-foreground hover:bg-primary/90",
    }

    return (
      <button
        ref={ref}
        className={cn(variantClasses[variant], sizeClasses[size], "flex items-center justify-center", className)}
        {...props}
      >
        {children}
      </button>
    )
  },
)

NeomorphIconButton.displayName = "NeomorphIconButton"

export { NeomorphIconButton }
