"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface MouseFollowerProps {
  className?: string
  size?: number
  delay?: number
  color?: string
  showOnlyOnInteractive?: boolean
  pulseOnClick?: boolean
}

export function MouseFollower({
  className,
  size = 20,
  delay = 0.1,
  color = "rgba(var(--primary-rgb), 0.5)",
  showOnlyOnInteractive = false,
  pulseOnClick = true,
}: MouseFollowerProps) {
  const [position, setPosition] = useState({ x: -100, y: -100 })
  const [visible, setVisible] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    // בדיקה אם המכשיר הוא מכשיר מגע
    const checkTouch = () => {
      setIsTouch(window.matchMedia("(hover: none)").matches)
    }

    checkTouch()
    window.addEventListener("resize", checkTouch)

    // אם זה מכשיר מגע, לא מציגים את העוקב
    if (isTouch) return

    const updateMousePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      if (!visible) setVisible(true)
    }

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest("a, button, [role=button], input, select, textarea, [data-hover]")) {
        setIsHovering(true)
      } else {
        setIsHovering(false)
      }
    }

    const handleMouseDown = () => {
      setIsClicking(true)
      setTimeout(() => setIsClicking(false), 300)
    }

    window.addEventListener("mousemove", updateMousePosition)
    window.addEventListener("mouseover", handleMouseEnter)
    window.addEventListener("mousedown", handleMouseDown)

    return () => {
      window.removeEventListener("mousemove", updateMousePosition)
      window.removeEventListener("mouseover", handleMouseEnter)
      window.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("resize", checkTouch)
    }
  }, [visible, isTouch])

  if (isTouch) return null

  return (
    <div
      className={cn(
        "fixed pointer-events-none z-[9999] rounded-full mix-blend-difference transition-transform duration-300 will-change-transform",
        isHovering && "scale-[2.5]",
        isClicking && pulseOnClick && "animate-pulse",
        showOnlyOnInteractive && !isHovering && "opacity-0",
        visible ? "opacity-100" : "opacity-0",
        className,
      )}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        transform: `translate(${position.x - size / 2}px, ${position.y - size / 2}px)`,
        transition: `transform ${delay}s cubic-bezier(0.23, 1, 0.32, 1), width 0.3s ease, height 0.3s ease, opacity 0.3s ease, background-color 0.3s ease`,
      }}
    />
  )
}
