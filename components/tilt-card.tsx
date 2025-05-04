"use client"

import type React from "react"

import { useState, useRef, useEffect, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface TiltCardProps {
  children: ReactNode
  className?: string
  perspective?: number
  maxTilt?: number
  scale?: number
  speed?: number
  axis?: "both" | "x" | "y"
  reset?: boolean
  disabled?: boolean
  glare?: boolean
  glareOpacity?: number
  gyroscope?: boolean
}

export function TiltCard({
  children,
  className,
  perspective = 1000,
  maxTilt = 15,
  scale = 1.05,
  speed = 500,
  axis = "both",
  reset = true,
  disabled = false,
  glare = false,
  glareOpacity = 0.35,
  gyroscope = false,
}: TiltCardProps) {
  const [tiltX, setTiltX] = useState(0)
  const [tiltY, setTiltY] = useState(0)
  const [glarePosition, setGlarePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const glareRef = useRef<HTMLDivElement>(null)

  // טיפול באירועי עכבר
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const mouseX = e.clientX - centerX
    const mouseY = e.clientY - centerY

    // חישוב זווית ההטיה
    const percentX = mouseX / (rect.width / 2)
    const percentY = mouseY / (rect.height / 2)

    // הגבלת ההטיה למקסימום
    const tiltLimitedX = Math.max(Math.min(percentX * maxTilt, maxTilt), -maxTilt)
    const tiltLimitedY = Math.max(Math.min(percentY * maxTilt, maxTilt), -maxTilt)

    // הגדרת ההטיה בהתאם לציר שנבחר
    const newTiltX = axis === "x" || axis === "both" ? tiltLimitedY : 0
    const newTiltY = axis === "y" || axis === "both" ? tiltLimitedX : 0

    setTiltX(newTiltX)
    setTiltY(newTiltY)

    // עדכון מיקום הברק
    if (glare) {
      setGlarePosition({
        x: (percentX + 1) / 2, // נרמול ל-0-1
        y: (percentY + 1) / 2, // נרמול ל-0-1
      })
    }
  }

  const handleMouseEnter = () => {
    setIsHovering(true)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    if (reset) {
      setTiltX(0)
      setTiltY(0)
      setGlarePosition({ x: 0.5, y: 0.5 })
    }
  }

  // טיפול בחיישן ג'ירוסקופ במכשירים ניידים
  useEffect(() => {
    if (!gyroscope || disabled || typeof window === "undefined" || !window.DeviceOrientationEvent) return

    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta === null || e.gamma === null || !cardRef.current) return

      // המרת נתוני הג'ירוסקופ לזוויות הטיה
      const beta = Math.min(Math.max(e.beta, -45), 45) // הגבלה ל-45 מעלות
      const gamma = Math.min(Math.max(e.gamma, -45), 45) // הגבלה ל-45 מעלות

      const tiltLimitedX = (beta / 45) * maxTilt
      const tiltLimitedY = (gamma / 45) * maxTilt

      // הגדרת ההטיה בהתאם לציר שנבחר
      const newTiltX = axis === "x" || axis === "both" ? tiltLimitedX : 0
      const newTiltY = axis === "y" || axis === "both" ? tiltLimitedY : 0

      setTiltX(newTiltX)
      setTiltY(newTiltY)

      // עדכון מיקום הברק
      if (glare) {
        setGlarePosition({
          x: (gamma / 45 + 1) / 2, // נרמול ל-0-1
          y: (beta / 45 + 1) / 2, // נרמול ל-0-1
        })
      }
    }

    window.addEventListener("deviceorientation", handleDeviceOrientation)

    return () => {
      window.removeEventListener("deviceorientation", handleDeviceOrientation)
    }
  }, [axis, disabled, glare, gyroscope, maxTilt])

  return (
    <div
      ref={cardRef}
      className={cn("relative overflow-hidden transition-transform will-change-transform", className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: `${perspective}px`,
        transformStyle: "preserve-3d",
        transform: `
          perspective(${perspective}px)
          rotateX(${tiltX}deg)
          rotateY(${tiltY}deg)
          scale3d(${isHovering ? scale : 1}, ${isHovering ? scale : 1}, 1)
        `,
        transition: isHovering ? "none" : `transform ${speed}ms ease-out`,
      }}
    >
      {children}
      {glare && (
        <div
          ref={glareRef}
          className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit] z-10"
          style={{
            opacity: isHovering ? glareOpacity : 0,
            transition: `opacity ${speed}ms ease-out`,
          }}
        >
          <div
            className="absolute inset-0 bg-gradient-radial from-white/80 to-transparent"
            style={{
              transform: `translate(
                ${(glarePosition.x - 0.5) * 100 * 2}%,
                ${(glarePosition.y - 0.5) * 100 * 2}%
              )`,
              width: "200%",
              height: "200%",
              left: "-50%",
              top: "-50%",
            }}
          />
        </div>
      )}
    </div>
  )
}
