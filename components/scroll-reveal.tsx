"use client"

import React from "react"

import { useRef, useEffect, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  threshold?: number
  delay?: number
  direction?: "up" | "down" | "left" | "right" | "none"
  distance?: number
  duration?: number
  once?: boolean
  staggerChildren?: boolean
  staggerDelay?: number
}

export function ScrollReveal({
  children,
  className,
  threshold = 0.1,
  delay = 0,
  direction = "up",
  distance = 30,
  duration = 800,
  once = true,
  staggerChildren = false,
  staggerDelay = 100,
  ...props
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // התחלתי של אנימציה בהתאם לכיוון
  const getInitialTransform = () => {
    if (hasAnimated && once) return "translate3d(0, 0, 0)"
    if (!isVisible) {
      switch (direction) {
        case "up":
          return `translate3d(0, ${distance}px, 0)`
        case "down":
          return `translate3d(0, -${distance}px, 0)`
        case "left":
          return `translate3d(${distance}px, 0, 0)`
        case "right":
          return `translate3d(-${distance}px, 0, 0)`
        case "none":
          return "translate3d(0, 0, 0)"
        default:
          return `translate3d(0, ${distance}px, 0)`
      }
    }
    return "translate3d(0, 0, 0)"
  }

  useEffect(() => {
    if (typeof window === "undefined" || !ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once) {
            setHasAnimated(true)
          }
        } else if (!once) {
          setIsVisible(false)
        }
      },
      {
        threshold,
        rootMargin: "0px",
      },
    )

    observer.observe(ref.current)

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [threshold, once])

  // טיפול בילדים עם אפקט מדורג
  const childrenWithStagger = () => {
    if (!staggerChildren || !children) return children

    return React.Children.map(children, (child, index) => {
      if (!React.isValidElement(child)) return child

      return React.cloneElement(child as React.ReactElement<any>, {
        style: {
          ...((child as React.ReactElement<any>).props.style || {}),
          transitionDelay: `${delay + index * staggerDelay}ms`,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translate3d(0, 0, 0)" : getInitialTransform(),
        },
        className: cn("transition-all", (child as React.ReactElement<any>).props.className),
      })
    })
  }

  return (
    <div
      ref={ref}
      className={cn("transition-all will-change-transform", className)}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translate3d(0, 0, 0)" : getInitialTransform(),
        transitionProperty: "transform, opacity",
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: "var(--animation-smooth)",
        transitionDelay: staggerChildren ? "0ms" : `${delay}ms`,
      }}
      {...props}
    >
      {staggerChildren ? childrenWithStagger() : children}
    </div>
  )
}
