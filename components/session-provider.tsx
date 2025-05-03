"use client"

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react"
import { useState, useEffect } from "react"

export function SessionProvider({ children }) {
  const [mounted, setMounted] = useState(false)

  // Only render the session provider after mounting to avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <>{children}</>
  }

  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
}
