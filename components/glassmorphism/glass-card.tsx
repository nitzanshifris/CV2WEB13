"use client"

import type React from "react"

import { forwardRef, useState, type HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  depth?: 1 | 2 | 3 | 4
  color?: "default" | "blue" | "purple" | "amber" | "emerald" | "rose"
  shimmer?: boolean
  acceptFiles?: boolean
  onFileReceived?: (file: File) => void
  acceptedFileTypes?: string
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      className,
      depth = 2,
      color = "default",
      shimmer = false,
      acceptFiles = false,
      onFileReceived,
      acceptedFileTypes = ".pdf,.doc,.docx,.txt,.rtf,.odt",
      children,
      ...props
    },
    ref,
  ) => {
    const [isDragging, setIsDragging] = useState(false)

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      if (acceptFiles) {
        e.preventDefault()
        setIsDragging(true)
      }
    }

    const handleDragLeave = () => {
      setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      if (acceptFiles) {
        e.preventDefault()
        setIsDragging(false)

        const files = e.dataTransfer.files
        if (files.length > 0) {
          onFileReceived?.(files[0])
        }
      }
    }

    return (
      <div
        ref={ref}
        className={cn(
          "glass-card p-6",
          `glass-depth-${depth}`,
          color !== "default" && `glass-${color}`,
          shimmer && "glass-shimmer",
          isDragging && "ring-2 ring-primary",
          acceptFiles && "cursor-pointer transition-all duration-200",
          className,
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        {...props}
      >
        {acceptFiles && isDragging && (
          <div className="absolute inset-0 bg-primary/10 flex items-center justify-center rounded-lg z-10">
            <p className="text-primary font-medium">Drop your CV file here</p>
          </div>
        )}
        {children}
        {acceptFiles && !isDragging && (
          <div className="mt-2 text-xs text-muted-foreground">
            <p>Drag and drop your CV file here, or click to select</p>
            <p>Accepted formats: {acceptedFileTypes.replace(/\./g, " ")}</p>
          </div>
        )}
      </div>
    )
  },
)

GlassCard.displayName = "GlassCard"

const GlassCardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("flex flex-col space-y-1.5 pb-4", className)} {...props} />
})

GlassCardHeader.displayName = "GlassCardHeader"

const GlassCardTitle = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => {
    return <h3 ref={ref} className={cn("font-semibold leading-none tracking-tight", className)} {...props} />
  },
)

GlassCardTitle.displayName = "GlassCardTitle"

const GlassCardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    return <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  },
)

GlassCardDescription.displayName = "GlassCardDescription"

const GlassCardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("pt-0", className)} {...props} />
})

GlassCardContent.displayName = "GlassCardContent"

const GlassCardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("flex items-center pt-4", className)} {...props} />
})

GlassCardFooter.displayName = "GlassCardFooter"

export { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardDescription, GlassCardContent, GlassCardFooter }
