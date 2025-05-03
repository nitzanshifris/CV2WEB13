"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { signIn } from "next-auth/react"

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class AuthErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(error: Error): State {
    // Only catch auth-related errors
    if (
      error.message.includes("auth") ||
      error.message.includes("session") ||
      error.message.includes("CSRF") ||
      error.message.includes("token")
    ) {
      return { hasError: true, error }
    }

    // Re-throw other errors
    throw error
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Authentication error:", error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Authentication Error</CardTitle>
              <CardDescription>There was a problem with your authentication session</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {this.state.error?.message || "An unknown authentication error occurred"}
              </p>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button variant="outline" onClick={() => this.setState({ hasError: false })}>
                Try Again
              </Button>
              <Button onClick={() => signIn()}>Sign In Again</Button>
            </CardFooter>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
