"use client"

import { useRef, useEffect, useState, type ReactNode } from "react"

interface ParallaxProps {
  children: ReactNode
  speed?: number
  className?: string
  direction?: "up" | "down"
}

export function ParallaxSection({ children, speed = 0.5, className = "", direction = "up" }: ParallaxProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return

      const { top, height } = sectionRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight

      // Calculate how far the section is from the center of the viewport
      const sectionCenter = top + height / 2
      const viewportCenter = windowHeight / 2
      const distanceFromCenter = sectionCenter - viewportCenter

      // Calculate the parallax offset based on the distance from center
      const parallaxOffset = distanceFromCenter * speed * (direction === "up" ? -1 : 1)

      setOffset(parallaxOffset)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Initial calculation

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [speed, direction])

  return (
    <div ref={sectionRef} className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 w-full h-full" style={{ transform: `translateY(${offset}px)` }}>
        {children}
      </div>
    </div>
  )
}

interface ParallaxLayerProps {
  children: ReactNode
  speed?: number
  className?: string
}

export function ParallaxLayer({ children, speed = 0.2, className = "" }: ParallaxLayerProps) {
  const layerRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setOffset(scrollY * speed)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Initial calculation

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [speed])

  return (
    <div
      ref={layerRef}
      className={`absolute inset-0 will-change-transform ${className}`}
      style={{ transform: `translateY(${offset}px)` }}
    >
      {children}
    </div>
  )
}

interface RevealOnScrollProps {
  children: ReactNode
  className?: string
  threshold?: number
  delay?: number
}

export function RevealOnScroll({ children, className = "", threshold = 0.1, delay = 0 }: RevealOnScrollProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true)
          }, delay)
          observer.unobserve(entry.target)
        }
      },
      { threshold },
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [threshold, delay])

  return (
    <div
      ref={ref}
      className={`reveal-on-scroll ${isVisible ? "revealed" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

interface FloatingElementProps {
  children: ReactNode
  className?: string
  speed?: "slow" | "normal" | "fast"
  delay?: number
}

export function FloatingElement({ children, className = "", speed = "normal", delay = 0 }: FloatingElementProps) {
  const speedClass = speed === "slow" ? "floating-slow" : speed === "fast" ? "floating-fast" : "floating"

  return (
    <div className={`${speedClass} ${className}`} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

export function ParallaxShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Circles */}
      <div
        className="parallax-shape shape-circle bg-primary/10 w-64 h-64 -top-20 -left-20"
        style={{ transform: "translateY(calc(var(--scroll) * 0.2))" }}
      ></div>
      <div
        className="parallax-shape shape-circle bg-secondary/20 w-96 h-96 top-[30%] -right-48"
        style={{ transform: "translateY(calc(var(--scroll) * -0.15))" }}
      ></div>
      <div
        className="parallax-shape shape-circle bg-accent/15 w-72 h-72 bottom-[10%] left-[20%]"
        style={{ transform: "translateY(calc(var(--scroll) * 0.1))" }}
      ></div>

      {/* Squares */}
      <div
        className="parallax-shape shape-square bg-primary/5 w-48 h-48 top-[20%] left-[10%] rotate-12"
        style={{ transform: "translateY(calc(var(--scroll) * -0.1)) rotate(12deg)" }}
      ></div>
      <div
        className="parallax-shape shape-square bg-secondary/10 w-32 h-32 top-[60%] right-[15%] rotate-45"
        style={{ transform: "translateY(calc(var(--scroll) * 0.25)) rotate(45deg)" }}
      ></div>
    </div>
  )
}
