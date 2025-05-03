"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function SessionDebugger() {
  const [isOpen, setIsOpen] = useState(false)

  // Safely use useSession with fallback values
  const sessionResult = useSession()
  const status = sessionResult?.status || "loading"
  const session = sessionResult?.data || null
  const update = sessionResult?.update || (() => {})

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsOpen(true)}
          className="bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200"
        >
          Debug Session
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)]">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base">Session Debugger</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-6 w-6 p-0">
              ✕
            </Button>
          </div>
          <CardDescription>
            Session Status: <span className="font-medium">{status}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-md overflow-auto max-h-60">
            <pre className="text-xs">{JSON.stringify(session, null, 2)}</pre>
          </div>
        </CardContent>
        <CardFooter className="pt-2 flex gap-2">
          <Button size="sm" variant="outline" onClick={() => update()}>
            Refresh Session
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => {
              localStorage.clear()
              sessionStorage.clear()
              window.location.reload()
            }}
          >
            Clear Storage
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
