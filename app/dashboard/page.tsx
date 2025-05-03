"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Globe, Settings, Share2, Plus, Loader2 } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const session = useSession()
  const [activeTab, setActiveTab] = useState("websites")
  const [isLoading, setIsLoading] = useState(true)

  // Handle session loading state
  useEffect(() => {
    if (session.status !== "loading") {
      setIsLoading(false)
    }

    // Redirect to login if unauthenticated
    if (session.status === "unauthenticated") {
      router.push("/login")
    }
  }, [session.status, router])

  // Show loading state
  if (isLoading || session.status === "loading") {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  // Safe access to user data
  const userData = session.data?.user
  const userName = userData?.name || "User"

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, {userName}</p>
        </div>
        <Link href="/upload">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create New Website
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="websites" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-3">
          <TabsTrigger value="websites">My Websites</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="websites" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>Professional CV</CardTitle>
                  <Badge>Live</Badge>
                </div>
                <CardDescription>Created on May 1, 2025</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-4">
                  <Globe className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">yourname-professional.cvgenerator.com</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </CardFooter>
            </Card>

            {/* Placeholder for empty state */}
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle>Create a new website</CardTitle>
                <CardDescription>Upload your CV to generate a new website</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center py-8">
                <Link href="/upload">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Upload CV
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Templates</CardTitle>
                <CardDescription>Browse and select templates for your CV website</CardDescription>
              </CardHeader>
              <CardContent>
                <p>This feature is coming soon. Check back later for template options.</p>
              </CardContent>
              <CardFooter>
                <Link href="/examples">
                  <Button variant="outline">View Examples</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Account Information</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Name:</div>
                    <div>{userData?.name || "Not provided"}</div>
                    <div className="text-muted-foreground">Email:</div>
                    <div>{userData?.email || "Not provided"}</div>
                  </div>
                </div>

                <div className="pt-4">
                  <Link href="/profile">
                    <Button variant="outline">Edit Profile</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
