"use client"

import type React from "react"

import { useState, useRef, useEffect, type InputHTMLAttributes, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface FloatLabelInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon?: ReactNode
  variant?: "default" | "glass" | "neomorphism"
}

export function FloatLabelInput({
  label,
  icon,
  variant = "default",
  className,
  id,
  required,
  value,
  onChange,
  onFocus,
  onBlur,
  ...props
}: FloatLabelInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [hasValue, setHasValue] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // בדיקה אם יש ערך בשדה
  useEffect(() => {
    if (value !== undefined) {
      setHasValue(value.toString().length > 0)
    }
  }, [value])

  // טיפול באירועי פוקוס
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true)
    if (onFocus) onFocus(e)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false)
    if (onBlur) onBlur(e)
  }

  // טיפול בשינוי ערך
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(e.target.value.length > 0)
    if (onChange) onChange(e)
  }

  // בחירת סגנון בהתאם לוריאנט
  const getInputClassName = () => {
    const baseClasses = "w-full px-4 py-2 text-foreground transition-all duration-300 focus:outline-none"

    switch (variant) {
      case "glass":
        return cn(baseClasses, "glass-input focus:ring-2 focus:ring-primary/30", icon && "pl-10", className)
      case "neomorphism":
        return cn(baseClasses, "neomorphism-input focus:ring-2 focus:ring-primary/30", icon && "pl-10", className)
      default:
        return cn(
          baseClasses,
          "border-b-2 border-muted bg-transparent focus:border-primary",
          icon && "pl-10",
          className,
        )
    }
  }

  const isActive = isFocused || hasValue

  return (
    <div className="relative w-full">
      {icon && <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">{icon}</div>}
      <input
        ref={inputRef}
        id={id}
        className={getInputClassName()}
        placeholder=" " // רווח בודד כדי לאפשר את אפקט הצף
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        value={value}
        required={required}
        {...props}
      />
      <label
        htmlFor={id}
        className={cn(
          "absolute left-4 top-0 px-1 pointer-events-none transition-all duration-300",
          icon && "left-10",
          isActive
            ? "transform -translate-y-[calc(100%+0.25rem)] scale-90 text-primary"
            : "translate-y-[calc(50%-0.25rem)] text-muted-foreground",
        )}
      >
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
    </div>
  )
}
