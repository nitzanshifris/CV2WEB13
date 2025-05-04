"use client"

import { useRef, useEffect, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface SmoothScrollViewProps {
  children: ReactNode
  className?: string
  speed?: number
  disabled?: boolean
  direction?: "vertical" | "horizontal"
  threshold?: number
}

export function SmoothScrollView({
  children,
  className,
  speed = 0.1,
  disabled = false,
  direction = "vertical",
  threshold = 0.1,
}: SmoothScrollViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const requestRef = useRef<number>()
  const previousScrollRef = useRef<number>(0)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [scrollPos, setScrollPos] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  // בדיקה אם המכשיר הוא מכשיר נייד
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // עדכון מימדי התוכן
  useEffect(() => {
    if (!contentRef.current || !containerRef.current) return

    const updateDimensions = () => {
      if (contentRef.current && containerRef.current) {
        setDimensions({
          width: contentRef.current.scrollWidth,
          height: contentRef.current.scrollHeight,
        })
      }
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [children])

  // אנימציית גלילה חלקה
  useEffect(() => {
    if (disabled || isMobile || !containerRef.current || !contentRef.current) return

    let currentScroll = 0
    let targetScroll = 0

    const onScroll = () => {
      if (containerRef.current) {
        targetScroll = direction === "vertical" ? window.scrollY : window.scrollX
      }
    }

    const smoothScroll = () => {
      currentScroll = currentScroll + (targetScroll - currentScroll) * speed
      if (contentRef.current) {
        if (direction === "vertical") {
          contentRef.current.style.transform = `translate3d(0, ${-currentScroll}px, 0)`
        } else {
          contentRef.current.style.transform = `translate3d(${-currentScroll}px, 0, 0)`
        }
      }
      setScrollPos(currentScroll)
      requestRef.current = requestAnimationFrame(smoothScroll)
    }

    window.addEventListener("scroll", onScroll)
    requestRef.current = requestAnimationFrame(smoothScroll)

    return () => {
      window.removeEventListener("scroll", onScroll)
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [disabled, direction, isMobile, speed])

  // הגדרת גובה הדף לאפשר גלילה
  useEffect(() => {
    if (disabled || isMobile || !containerRef.current) return

    const setBodyHeight = () => {
      if (containerRef.current) {
        const height = direction === "vertical" ? dimensions.height : dimensions.width
        document.body.style.height = `${height}px`
      }
    }

    setBodyHeight()
    return () => {
      document.body.style.height = ""
    }
  }, [dimensions, disabled, direction, isMobile])

  // אפקט פרלקס לאלמנטים בתוך התצוגה
  useEffect(() => {
    if (disabled || isMobile || !contentRef.current) return

    const parallaxElements = contentRef.current.querySelectorAll("[data-parallax]")

    const updateParallaxElements = () => {
      parallaxElements.forEach((element) => {
        const speed = Number.parseFloat(element.getAttribute("data-parallax") || "0.1")
        const offset = scrollPos * speed

        if (direction === "vertical") {
          element.setAttribute("style", `transform: translate3d(0, ${offset}px, 0)`)
        } else {
          element.setAttribute("style", `transform: translate3d(${offset}px, 0, 0)`)
        }
      })
    }

    updateParallaxElements()
  }, [scrollPos, disabled, direction, isMobile])

  return (
    <div
      ref={containerRef}
      className={cn("fixed top-0 left-0 w-full h-screen overflow-hidden", className)}
      style={{ display: disabled || isMobile ? "none" : "block" }}
    >
      <div
        ref={contentRef}
        className="will-change-transform"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          willChange: "transform",
        }}
      >
        {children}
      </div>
      {(disabled || isMobile) && <div className={className}>{children}</div>}
    </div>
  )
}
