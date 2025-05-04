"use client"

import { useSafeSession } from "@/hooks/use-safe-session"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"
import { RefreshCw, LogOut } from "lucide-react"
import { useState } from "react"

export function SessionStatus() {
  const { isAuthenticated, isLoading, user, isExpired, refreshSession } = useSafeSession()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await refreshSession()
    } finally {
      setIsRefreshing(false)
    }
  }

  if (isLoading) {
    return <Badge variant="outline">טוען...</Badge>
  }

  if (!isAuthenticated) {
    return <Badge variant="outline">לא מחובר</Badge>
  }

  return (
    <div className="flex items-center gap-2">
      <Badge variant={isExpired ? "destructive" : "success"}>{isExpired ? "פג תוקף" : "מחובר"}</Badge>
      <span className="text-sm">{user?.email}</span>
      <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={isRefreshing}>
        <RefreshCw className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => signOut({ callbackUrl: "/login" })}>
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  )
}
