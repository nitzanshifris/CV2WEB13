"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"

interface ParallaxImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  intensity?: number
}

export function ParallaxImage({
  src,
  alt,
  width = 500,
  height = 300,
  className = "",
  intensity = 0.1,
}: ParallaxImageProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return

      const { left, top, width, height } = ref.current.getBoundingClientRect()
      const x = (e.clientX - left) / width - 0.5
      const y = (e.clientY - top) / height - 0.5

      setPosition({ x, y })
    }

    const element = ref.current
    if (element) {
      element.addEventListener("mousemove", handleMouseMove)
    }

    return () => {
      if (element) {
        element.removeEventListener("mousemove", handleMouseMove)
      }
    }
  }, [])

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <div
        className="relative w-full h-full transition-transform duration-200"
        style={{
          transform: `perspective(1000px) rotateX(${position.y * intensity * 10}deg) rotateY(${
            position.x * intensity * -10
          }deg) scale(1.05)`,
        }}
      >
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-full object-cover"
          style={{
            transform: `translateX(${position.x * intensity * -20}px) translateY(${position.y * intensity * -20}px)`,
          }}
        />
      </div>
    </div>
  )
}
