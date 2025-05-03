"use client"

import { useSession } from "next-auth/react"

export function useSafeSession() {
  const sessionResult = useSession()

  // Provide safe defaults if sessionResult is undefined
  const status = sessionResult?.status || "loading"
  const data = sessionResult?.data || null
  const update = sessionResult?.update || (async () => null)

  return {
    ...sessionResult,
    status,
    data,
    update,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    isUnauthenticated: status === "unauthenticated",
    user: data?.user || null,
  }
}
