import { forwardRef, type HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

export interface NeomorphCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "inset"
}

const NeomorphCard = forwardRef<HTMLDivElement, NeomorphCardProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(variant === "default" ? "neomorphism-card" : "neomorphism-inset", "p-6", className)}
        {...props}
      />
    )
  },
)

NeomorphCard.displayName = "NeomorphCard"

const NeomorphCardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("flex flex-col space-y-1.5 pb-4", className)} {...props} />
  },
)

NeomorphCardHeader.displayName = "NeomorphCardHeader"

const NeomorphCardTitle = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => {
    return <h3 ref={ref} className={cn("font-semibold leading-none tracking-tight", className)} {...props} />
  },
)

NeomorphCardTitle.displayName = "NeomorphCardTitle"

const NeomorphCardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    return <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  },
)

NeomorphCardDescription.displayName = "NeomorphCardDescription"

const NeomorphCardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("pt-0", className)} {...props} />
  },
)

NeomorphCardContent.displayName = "NeomorphCardContent"

const NeomorphCardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("flex items-center pt-4", className)} {...props} />
  },
)

NeomorphCardFooter.displayName = "NeomorphCardFooter"

export {
  NeomorphCard,
  NeomorphCardHeader,
  NeomorphCardTitle,
  NeomorphCardDescription,
  NeomorphCardContent,
  NeomorphCardFooter,
}
