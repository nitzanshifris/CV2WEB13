"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function AuthErrorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  useEffect(() => {
    // Log the error for debugging purposes
    if (error) {
      console.error("Authentication error:", error)
    }
  }, [error])

  const errorMessages = {
    default: "An authentication error occurred",
    configuration: "There is a problem with the server configuration",
    accessdenied: "You do not have permission to sign in",
    verification: "The verification link was invalid or has expired",
    "signin-callback": "There was a problem signing you in",
    "oauth-callback": "There was a problem with the OAuth provider",
    "client-fetch": "There was a network problem fetching your session",
    "session-required": "You must be signed in to access this page",
  }

  const errorMessage =
    error && error in errorMessages ? errorMessages[error as keyof typeof errorMessages] : errorMessages.default

  const handleRetry = () => {
    router.push("/login")
  }

  const handleHome = () => {
    router.push("/")
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Authentication Error</CardTitle>
          <CardDescription>There was a problem with your authentication</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md text-red-800 dark:text-red-300 text-sm mb-4">
            <p className="font-medium">Error details:</p>
            <p className="mt-1">{errorMessage}</p>
            {error && <p className="mt-1 text-xs opacity-70">Error code: {error}</p>}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            You can try signing in again or return to the home page.
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleHome}>
            Go to Home
          </Button>
          <Button onClick={handleRetry}>Try Again</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
