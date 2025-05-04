"use client"

import { useRef, useEffect, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface SplitTextProps {
  children: string
  className?: string
  type?: "chars" | "words" | "lines"
  animation?: "fade" | "slide" | "scale" | "none"
  staggerDelay?: number
  startDelay?: number
  duration?: number
  onAnimationComplete?: () => void
}

export function SplitText({
  children,
  className,
  type = "chars",
  animation = "fade",
  staggerDelay = 0.05,
  startDelay = 0,
  duration = 0.5,
  onAnimationComplete,
}: SplitTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [elements, setElements] = useState<ReactNode[]>([])
  const [isAnimated, setIsAnimated] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    // פיצול הטקסט לפי הסוג הנבחר
    const splitContent = () => {
      const text = children.toString()
      let result: ReactNode[] = []

      switch (type) {
        case "chars":
          result = text.split("").map((char, index) => (
            <span
              key={`char-${index}`}
              className="inline-block"
              style={{
                animationDelay: `${startDelay + index * staggerDelay}s`,
                animationDuration: `${duration}s`,
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))
          break
        case "words":
          result = text.split(" ").map((word, index) => (
            <span
              key={`word-${index}`}
              className="inline-block"
              style={{
                animationDelay: `${startDelay + index * staggerDelay}s`,
                animationDuration: `${duration}s`,
              }}
            >
              {word}
              {index !== text.split(" ").length - 1 && "\u00A0"}
            </span>
          ))
          break
        case "lines":
          // בפועל, פיצול לשורות דורש חישוב מורכב יותר
          // כאן נשתמש בפיצול פשוט לפי שורות חדשות
          result = text.split("\n").map((line, index) => (
            <div
              key={`line-${index}`}
              className="block"
              style={{
                animationDelay: `${startDelay + index * staggerDelay}s`,
                animationDuration: `${duration}s`,
              }}
            >
              {line}
            </div>
          ))
          break
      }

      setElements(result)
    }

    splitContent()
  }, [children, type, staggerDelay, startDelay, duration])

  useEffect(() => {
    if (elements.length > 0 && !isAnimated) {
      setIsAnimated(true)

      // הפעלת callback בסיום האנימציה
      if (onAnimationComplete) {
        const totalDuration = startDelay + (elements.length - 1) * staggerDelay + duration
        setTimeout(onAnimationComplete, totalDuration * 1000)
      }
    }
  }, [elements, isAnimated, onAnimationComplete, startDelay, staggerDelay, duration])

  // בחירת אנימציה
  const getAnimationClass = () => {
    switch (animation) {
      case "fade":
        return "animate-fade-in"
      case "slide":
        return "animate-slide-in-up"
      case "scale":
        return "animate-scale-in"
      default:
        return ""
    }
  }

  return (
    <div ref={containerRef} className={cn("inline", className)} style={{ perspective: "1000px" }}>
      {elements.map((element, index) => (
        <span key={index} className={cn("inline-block opacity-0", animation !== "none" && getAnimationClass())}>
          {element}
        </span>
      ))}
    </div>
  )
}
