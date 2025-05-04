"use client"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface CursorEffectsProps {
  className?: string
  cursorSize?: number
  cursorBorderSize?: number
  cursorBorderColor?: string
  cursorColor?: string
  trailEffect?: boolean
  magneticEffect?: boolean
  rippleEffect?: boolean
  rippleColor?: string
  rippleSize?: number
  rippleDuration?: number
}

export function CursorEffects({
  className,
  cursorSize = 20,
  cursorBorderSize = 1,
  cursorBorderColor = "rgba(255, 255, 255, 0.5)",
  cursorColor = "rgba(255, 255, 255, 0.2)",
  trailEffect = false,
  magneticEffect = true,
  rippleEffect = true,
  rippleColor = "rgba(255, 255, 255, 0.3)",
  rippleSize = 100,
  rippleDuration = 1000,
}: CursorEffectsProps) {
  const [position, setPosition] = useState({ x: -100, y: -100 })
  const [visible, setVisible] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [isTouch, setIsTouch] = useState(false)
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number; timestamp: number }[]>([])
  const [trails, setTrails] = useState<{ id: number; x: number; y: number; timestamp: number }[]>([])
  const cursorRef = useRef<HTMLDivElement>(null)
  const trailsRef = useRef<HTMLDivElement>(null)
  const ripplesRef = useRef<HTMLDivElement>(null)
  const lastRippleId = useRef(0)
  const lastTrailId = useRef(0)

  // בדיקה אם המכשיר הוא מכשיר מגע
  useEffect(() => {
    const checkTouch = () => {
      setIsTouch(window.matchMedia("(hover: none)").matches)
    }

    checkTouch()
    window.addEventListener("resize", checkTouch)

    return () => {
      window.removeEventListener("resize", checkTouch)
    }
  }, [])

  // טיפול באירועי עכבר
  useEffect(() => {
    if (isTouch) return

    const updateMousePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      if (!visible) setVisible(true)

      // הוספת אפקט שובל
      if (trailEffect) {
        lastTrailId.current += 1
        setTrails((prevTrails) => [
          ...prevTrails,
          { id: lastTrailId.current, x: e.clientX, y: e.clientY, timestamp: Date.now() },
        ])
      }
    }

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest("a, button, [role=button], input, select, textarea, [data-hover]")) {
        setIsHovering(true)
      } else {
        setIsHovering(false)
      }
    }

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicking(true)

      // הוספת אפקט גלים
      if (rippleEffect) {
        lastRippleId.current += 1
        setRipples((prevRipples) => [
          ...prevRipples,
          { id: lastRippleId.current, x: e.clientX, y: e.clientY, timestamp: Date.now() },
        ])
      }
    }

    const handleMouseUp = () => {
      setIsClicking(false)
    }

    // אפקט מגנטי
    const handleMagneticEffect = (e: MouseEvent) => {
      if (!magneticEffect) return

      const target = e.target as HTMLElement
      const magneticElement = target.closest("[data-magnetic]") as HTMLElement

      if (magneticElement) {
        const rect = magneticElement.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const distanceX = e.clientX - centerX
        const distanceY = e.clientY - centerY
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)
        const maxDistance = Math.max(rect.width, rect.height) / 2

        if (distance < maxDistance) {
          const strength = 0.3
          const x = centerX + distanceX * strength
          const y = centerY + distanceY * strength
          setPosition({ x, y })
        }
      }
    }

    window.addEventListener("mousemove", updateMousePosition)
    window.addEventListener("mouseover", handleMouseEnter)
    window.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mouseup", handleMouseUp)
    window.addEventListener("mousemove", handleMagneticEffect)

    return () => {
      window.removeEventListener("mousemove", updateMousePosition)
      window.removeEventListener("mouseover", handleMouseEnter)
      window.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mouseup", handleMouseUp)
      window.removeEventListener("mousemove", handleMagneticEffect)
    }
  }, [isTouch, magneticEffect, rippleEffect, trailEffect, visible])

  // ניקוי אפקטים ישנים
  useEffect(() => {
    if (!trailEffect && !rippleEffect) return

    const cleanupInterval = setInterval(() => {
      const now = Date.now()

      // ניקוי שובלים ישנים
      if (trailEffect) {
        setTrails((prevTrails) => prevTrails.filter((trail) => now - trail.timestamp < 500))
      }

      // ניקוי גלים ישנים
      if (rippleEffect) {
        setRipples((prevRipples) => prevRipples.filter((ripple) => now - ripple.timestamp < rippleDuration))
      }
    }, 100)

    return () => {
      clearInterval(cleanupInterval)
    }
  }, [rippleEffect, rippleDuration, trailEffect])

  if (isTouch) return null

  return (
    <>
      {/* עכבר מותאם אישית */}
      <div
        ref={cursorRef}
        className={cn(
          "fixed pointer-events-none z-[9999] rounded-full mix-blend-difference transition-transform duration-300 will-change-transform",
          isHovering && "scale-[2.5]",
          isClicking && "scale-75",
          visible ? "opacity-100" : "opacity-0",
          className,
        )}
        style={{
          width: `${cursorSize}px`,
          height: `${cursorSize}px`,
          backgroundColor: cursorColor,
          border: `${cursorBorderSize}px solid ${cursorBorderColor}`,
          transform: `translate(${position.x - cursorSize / 2}px, ${position.y - cursorSize / 2}px)`,
          transition: `transform 0.1s cubic-bezier(0.23, 1, 0.32, 1), width 0.3s ease, height 0.3s ease, opacity 0.3s ease, background-color 0.3s ease, scale 0.3s ease`,
        }}
      />

      {/* אפקט שובל */}
      {trailEffect && (
        <div ref={trailsRef} className="fixed inset-0 pointer-events-none z-[9998]">
          {trails.map((trail) => (
            <div
              key={trail.id}
              className="absolute rounded-full opacity-50 pointer-events-none"
              style={{
                left: trail.x,
                top: trail.y,
                width: `${cursorSize / 2}px`,
                height: `${cursorSize / 2}px`,
                backgroundColor: cursorColor,
                transform: "translate(-50%, -50%)",
                opacity: 1 - (Date.now() - trail.timestamp) / 500,
              }}
            />
          ))}
        </div>
      )}

      {/* אפקט גלים */}
      {rippleEffect && (
        <div ref={ripplesRef} className="fixed inset-0 pointer-events-none z-[9997]">
          {ripples.map((ripple) => (
            <div
              key={ripple.id}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: ripple.x,
                top: ripple.y,
                width: `${rippleSize}px`,
                height: `${rippleSize}px`,
                backgroundColor: "transparent",
                border: `2px solid ${rippleColor}`,
                transform: "translate(-50%, -50%) scale(0)",
                opacity: 1 - (Date.now() - ripple.timestamp) / rippleDuration,
                animation: `ripple ${rippleDuration}ms ease-out forwards`,
              }}
            />
          ))}
        </div>
      )}

      <style jsx global>{`
        @keyframes ripple {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0;
          }
        }

        [data-magnetic] {
          transition: transform 0.3s ease;
        }
      `}</style>
    </>
  )
}
