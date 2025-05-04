"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { signOut } from "next-auth/react"
import { Loader2 } from "lucide-react"

// Session timeout settings
const WARNING_TIME = 5 * 60 * 1000 // 5 minutes before expiry to show warning
const CHECK_INTERVAL = 60 * 1000 // Check every minute
const DEFAULT_SESSION_LENGTH = 30 * 60 * 1000 // 30 minutes (fallback if we can't determine from JWT)

export function SessionTimeoutHandler({ children }) {
  const { data: session, status, update } = useSession()
  const router = useRouter()

  const [showWarning, setShowWarning] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Function to extract expiry time from session
  const getSessionExpiry = useCallback(() => {
    if (!session) return null

    // Try to get expiry from token if available
    if (session.expires) {
      return new Date(session.expires).getTime()
    }

    // Fallback: estimate based on current time + default session length
    return Date.now() + DEFAULT_SESSION_LENGTH
  }, [session])

  // Function to refresh the session
  const refreshSession = async () => {
    setIsRefreshing(true)
    try {
      await update()
      setShowWarning(false)
    } catch (error) {
      console.error("Failed to refresh session:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  // Function to handle logout
  const handleLogout = () => {
    signOut({ redirect: true, callbackUrl: "/login" })
  }

  // Check session expiry periodically
  useEffect(() => {
    if (status !== "authenticated") return

    const checkSessionExpiry = () => {
      const expiryTime = getSessionExpiry()
      if (!expiryTime) return

      const now = Date.now()
      const timeLeft = expiryTime - now

      setTimeRemaining(Math.max(0, Math.floor(timeLeft / 1000)))

      // Show warning if session is about to expire
      if (timeLeft <= WARNING_TIME && timeLeft > 0) {
        setShowWarning(true)
      } else if (timeLeft <= 0) {
        // Session expired, redirect to login
        handleLogout()
      } else {
        setShowWarning(false)
      }
    }

    // Initial check
    checkSessionExpiry()

    // Set up interval for periodic checks
    const intervalId = setInterval(checkSessionExpiry, CHECK_INTERVAL)

    return () => clearInterval(intervalId)
  }, [status, getSessionExpiry])

  // Format remaining time for display
  const formatTimeRemaining = () => {
    const minutes = Math.floor(timeRemaining / 60)
    const seconds = timeRemaining % 60
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <>
      {children}

      <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>פג תוקף החיבור שלך בקרוב</AlertDialogTitle>
            <AlertDialogDescription>
              החיבור שלך יפוג בעוד {formatTimeRemaining()}. האם ברצונך להישאר מחובר?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleLogout}>התנתק</AlertDialogCancel>
            <AlertDialogAction onClick={refreshSession} disabled={isRefreshing}>
              {isRefreshing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  מרענן...
                </>
              ) : (
                "הישאר מחובר"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
