"use client"

import { useState, useEffect, type ReactNode } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface PageTransitionProps {
  children: ReactNode
  className?: string
  duration?: number
  animation?: "fade" | "slide" | "scale" | "flip" | "none"
  direction?: "up" | "down" | "left" | "right"
}

export function PageTransition({
  children,
  className,
  duration = 300,
  animation = "fade",
  direction = "up",
}: PageTransitionProps) {
  const pathname = usePathname()
  const [displayChildren, setDisplayChildren] = useState(children)
  const [transitionStage, setTransitionStage] = useState("fadeIn")

  useEffect(() => {
    if (pathname) {
      setTransitionStage("fadeOut")
      const timeout = setTimeout(() => {
        setDisplayChildren(children)
        setTransitionStage("fadeIn")
      }, duration)

      return () => clearTimeout(timeout)
    }
  }, [pathname, children, duration])

  const getAnimationClass = () => {
    if (animation === "none") return ""

    const baseClass = "transition-all will-change-transform"
    const durationClass = `duration-${duration}`

    const stageClasses = {
      fadeIn: {
        fade: "opacity-100",
        slide:
          direction === "up"
            ? "opacity-100 translate-y-0"
            : direction === "down"
              ? "opacity-100 translate-y-0"
              : direction === "left"
                ? "opacity-100 translate-x-0"
                : "opacity-100 translate-x-0",
        scale: "opacity-100 scale-100",
        flip: "opacity-100 rotateY-0",
      },
      fadeOut: {
        fade: "opacity-0",
        slide:
          direction === "up"
            ? "opacity-0 -translate-y-8"
            : direction === "down"
              ? "opacity-0 translate-y-8"
              : direction === "left"
                ? "opacity-0 -translate-x-8"
                : "opacity-0 translate-x-8",
        scale: "opacity-0 scale-95",
        flip: "opacity-0 rotateY-90",
      },
    }

    return cn(baseClass, durationClass, stageClasses[transitionStage as keyof typeof stageClasses][animation])
  }

  return (
    <div
      className={cn("transition-all", getAnimationClass(), className)}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {displayChildren}
    </div>
  )
}
