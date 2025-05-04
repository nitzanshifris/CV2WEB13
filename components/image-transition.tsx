"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ImageTransitionProps {
  images: string[]
  interval?: number
  className?: string
  alt?: string
  width?: number
  height?: number
  fill?: boolean
  transition?: "fade" | "slide" | "zoom" | "flip"
  autoplay?: boolean
  priority?: boolean
}

export function ImageTransition({
  images,
  interval = 5000,
  className,
  alt = "Image",
  width,
  height,
  fill = false,
  transition = "fade",
  autoplay = true,
  priority = false,
}: ImageTransitionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [direction, setDirection] = useState<"next" | "prev">("next")
  const timerRef = useRef<NodeJS.Timeout>()

  // טיפול במעבר בין תמונות
  const goToNext = () => {
    setDirection("next")
    setIsTransitioning(true)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const goToPrev = () => {
    setDirection("prev")
    setIsTransitioning(true)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  // אוטופליי
  useEffect(() => {
    if (autoplay && images.length > 1) {
      timerRef.current = setInterval(goToNext, interval)
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [autoplay, interval, images.length])

  // איפוס מצב המעבר
  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(false)
      }, 500) // משך האנימציה
      return () => clearTimeout(timer)
    }
  }, [isTransitioning])

  // קביעת מחלקות CSS בהתאם לסוג המעבר
  const getTransitionClasses = (index: number) => {
    const isActive = index === currentIndex
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
            : direction === "next"
              ? "opacity-0 z-0 translate-x-full"
              : "opacity-0 z-0 -translate-x-full",
        )
      case "zoom":
        return cn(baseClasses, isActive ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 scale-110")
      case "flip":
        return cn(baseClasses, isActive ? "opacity-100 z-10 rotateY-0" : "opacity-0 z-0 rotateY-90")
      default:
        return cn(baseClasses, isActive ? "opacity-100 z-10" : "opacity-0 z-0")
    }
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {images.map((src, index) => (
        <div key={src} className={getTransitionClasses(index)}>
          <Image
            src={src || "/placeholder.svg"}
            alt={`${alt} ${index + 1}`}
            width={width}
            height={height}
            fill={fill}
            className="object-cover"
            priority={priority && index === 0}
          />
        </div>
      ))}

      {images.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
          {images.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                index === currentIndex ? "bg-white scale-125" : "bg-white/50",
              )}
              onClick={() => {
                setDirection(index > currentIndex ? "next" : "prev")
                setIsTransitioning(true)
                setCurrentIndex(index)
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {images.length > 1 && (
        <>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white z-20 hover:bg-black/40 transition-colors"
            onClick={goToPrev}
            aria-label="Previous image"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white z-20 hover:bg-black/40 transition-colors"
            onClick={goToNext}
            aria-label="Next image"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </>
      )}
    </div>
  )
}
