"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // If authentication fails, redirect to login
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status !== "loading") {
      setIsLoading(false)
    }
  }, [status, router])

  if (status === "loading" || isLoading) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="w-full">
              <CardHeader>
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-28" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const userName = session?.user?.name || "User"

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Welcome, {userName}!</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your CV Websites</CardTitle>
            <CardDescription>Manage your created CV websites</CardDescription>
          </CardHeader>
          <CardContent>
            <p>You have 0 CV websites created.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push("/upload")}>Create New</Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Templates</CardTitle>
            <CardDescription>Browse available templates</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Explore our collection of professional templates.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => router.push("/examples")}>
              Browse Templates
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your account settings</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Update your profile and preferences.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => router.push("/profile")}>
              Profile Settings
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
