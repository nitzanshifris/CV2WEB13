"use client"

import { useState, useEffect, useRef, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface ViewTransitionProps {
  children: ReactNode
  className?: string
  views: ReactNode[]
  activeIndex: number
  transition?: "fade" | "slide" | "zoom" | "flip"
  duration?: number
  direction?: "up" | "down" | "left" | "right"
}

export function ViewTransition({
  children,
  className,
  views,
  activeIndex,
  transition = "fade",
  duration = 300,
  direction = "left",
}: ViewTransitionProps) {
  const [previousIndex, setPreviousIndex] = useState(activeIndex)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [height, setHeight] = useState<number | "auto">("auto")
  const viewRefs = useRef<(HTMLDivElement | null)[]>([])

  // עדכון אינדקס קודם כאשר האינדקס הפעיל משתנה
  useEffect(() => {
    if (previousIndex !== activeIndex) {
      setIsTransitioning(true)
      setPreviousIndex(activeIndex)

      const timer = setTimeout(() => {
        setIsTransitioning(false)
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [activeIndex, duration, previousIndex])

  // חישוב גובה התצוגה הפעילה
  useEffect(() => {
    if (viewRefs.current[activeIndex]) {
      const activeViewHeight = viewRefs.current[activeIndex]?.scrollHeight || "auto"
      setHeight(activeViewHeight)
    }
  }, [activeIndex, views])

  // קביעת מחלקות CSS בהתאם לסוג המעבר
  const getTransitionClasses = (index: number) => {
    const isActive = index === activeIndex
    const baseClasses = "absolute inset-0 transition-all duration-500 ease-in-out"

    if (!isTransitioning) {
      return cn(baseClasses, isActive ? "opacity-100 z-10" : "opacity-0 z-0")
    }

    switch (transition) {
      case "fade":
        return cn(baseClasses, isActive ? "opacity-100 z-10" : "opacity-0 z-0")
      case "slide":
        return cn(
          baseClasses,
          isActive
            ? "opacity-100 z-10 translate-x-0"
            : direction === "left"
              ? "opacity-0 z-0 translate-x-full"
              : direction === "right"
                ? "opacity-0 z-0 -translate-x-full"
                : direction === "up"
                  ? "opacity-0 z-0 translate-y-full"
                  : "opacity-0 z-0 -translate-y-full",
        )
      case "zoom":
        return cn(baseClasses, isActive ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 scale-90")
      case "flip":
        return cn(baseClasses, isActive ? "opacity-100 z-10 rotateY-0" : "opacity-0 z-0 rotateY-90")
      default:
        return cn(baseClasses, isActive ? "opacity-100 z-10" : "opacity-0 z-0")
    }
  }

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{
        height: typeof height === "number" ? `${height}px` : height,
        transition: `height ${duration}ms ease-in-out`,
      }}
    >
      {views.map((view, index) => (
        <div
          key={index}
          ref={(el) => (viewRefs.current[index] = el)}
          className={getTransitionClasses(index)}
          style={{
            transitionDuration: `${duration}ms`,
          }}
        >
          {view}
        </div>
      ))}
      {children}
    </div>
  )
}
