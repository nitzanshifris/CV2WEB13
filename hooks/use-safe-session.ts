"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

export function useSafeSession() {
  const sessionResult = useSession()
  const [isExpired, setIsExpired] = useState(false)

  // Provide safe defaults if sessionResult is undefined
  const status = sessionResult?.status || "loading"
  const data = sessionResult?.data || null
  const update = sessionResult?.update || (async () => null)

  // Check if session is expired
  useEffect(() => {
    if (!data?.expires) return

    const checkExpiry = () => {
      const expiryTime = new Date(data.expires).getTime()
      const now = Date.now()
      setIsExpired(now >= expiryTime)
    }

    // Initial check
    checkExpiry()

    // Set up interval for periodic checks
    const intervalId = setInterval(checkExpiry, 60000) // Check every minute

    return () => clearInterval(intervalId)
  }, [data?.expires])

  return {
    ...sessionResult,
    status: isExpired ? "unauthenticated" : status,
    data: isExpired ? null : data,
    update,
    isLoading: status === "loading",
    isAuthenticated: !isExpired && status === "authenticated",
    isUnauthenticated: isExpired || status === "unauthenticated",
    user: isExpired ? null : data?.user || null,
    isExpired,
    refreshSession: update,
  }
}
