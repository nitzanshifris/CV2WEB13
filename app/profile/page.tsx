"use client"

// הגדרת הדף כדינמי ישירות בקובץ
export const dynamic = "force-dynamic"

import type React from "react"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Mail, Lock, Loader2 } from "lucide-react"
import {
  NeomorphCard,
  NeomorphCardHeader,
  NeomorphCardTitle,
  NeomorphCardDescription,
  NeomorphCardContent,
  NeomorphCardFooter,
} from "@/components/neomorphism/card"
import { NeomorphButton } from "@/components/neomorphism/button"
import { NeomorphInput } from "@/components/neomorphism/input"
import { NeomorphToggle } from "@/components/neomorphism/toggle"
import { RevealOnScroll } from "@/components/parallax-effect"

export default function ProfilePage() {
  const router = useRouter()
  const session = useSession()
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [notifications, setNotifications] = useState({
    email: true,
    marketing: false,
    updates: true,
  })

  // Check authentication status
  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/login?callbackUrl=/profile")
    } else if (session.status !== "loading") {
      setIsPageLoading(false)
    }
  }, [session.status, router])

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setSuccess("")
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSuccess("Profile updated successfully")
    } catch (error) {
      setError("Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setSuccess("")
    setError("")

    const formData = new FormData(e.currentTarget)
    const currentPassword = formData.get("currentPassword") as string
    const newPassword = formData.get("newPassword") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSuccess("Password updated successfully")

      // Reset form
      e.currentTarget.reset()
    } catch (error) {
      setError("Failed to update password")
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading state
  if (isPageLoading || session.status === "loading") {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  // Safe access to user data
  const userData = session.data?.user

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <RevealOnScroll>
          <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>
        </RevealOnScroll>

        {success && (
          <Alert className="mb-6">
            <AlertDescription className="text-green-600">{success}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 neomorphism">
            <TabsTrigger value="profile" className="data-[state=active]:neomorphism-inset">
              Profile
            </TabsTrigger>
            <TabsTrigger value="password" className="data-[state=active]:neomorphism-inset">
              Password
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:neomorphism-inset">
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <RevealOnScroll delay={100}>
              <NeomorphCard>
                <NeomorphCardHeader>
                  <NeomorphCardTitle>Profile Information</NeomorphCardTitle>
                  <NeomorphCardDescription>Update your account profile information</NeomorphCardDescription>
                </NeomorphCardHeader>
                <form onSubmit={handleProfileUpdate}>
                  <NeomorphCardContent className="space-y-4">
                    <div className="flex justify-center mb-6">
                      <div className="neomorphism-icon h-24 w-24 p-1">
                        <Avatar className="h-full w-full">
                          <AvatarImage src={userData?.image || ""} alt={userData?.name || "User"} />
                          <AvatarFallback className="bg-primary/10">{userData?.name?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <NeomorphInput
                        id="name"
                        name="name"
                        defaultValue={userData?.name || ""}
                        placeholder="John Doe"
                        icon={<User className="h-4 w-4" />}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <NeomorphInput
                        id="email"
                        name="email"
                        type="email"
                        defaultValue={userData?.email || ""}
                        placeholder="name@example.com"
                        disabled
                        icon={<Mail className="h-4 w-4" />}
                      />
                      <p className="text-xs text-muted-foreground">
                        Your email address is used for login and cannot be changed
                      </p>
                    </div>
                  </NeomorphCardContent>
                  <NeomorphCardFooter>
                    <NeomorphButton type="submit" variant="primary" isLoading={isLoading} loadingText="Saving...">
                      Save Changes
                    </NeomorphButton>
                  </NeomorphCardFooter>
                </form>
              </NeomorphCard>
            </RevealOnScroll>
          </TabsContent>

          <TabsContent value="password">
            <RevealOnScroll delay={100}>
              <NeomorphCard>
                <NeomorphCardHeader>
                  <NeomorphCardTitle>Change Password</NeomorphCardTitle>
                  <NeomorphCardDescription>Update your account password</NeomorphCardDescription>
                </NeomorphCardHeader>
                <form onSubmit={handlePasswordUpdate}>
                  <NeomorphCardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <NeomorphInput
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        required
                        icon={<Lock className="h-4 w-4" />}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <NeomorphInput
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        required
                        icon={<Lock className="h-4 w-4" />}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <NeomorphInput
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        icon={<Lock className="h-4 w-4" />}
                      />
                    </div>
                  </NeomorphCardContent>
                  <NeomorphCardFooter>
                    <NeomorphButton type="submit" variant="primary" isLoading={isLoading} loadingText="Updating...">
                      Update Password
                    </NeomorphButton>
                  </NeomorphCardFooter>
                </form>
              </NeomorphCard>
            </RevealOnScroll>
          </TabsContent>

          <TabsContent value="notifications">
            <RevealOnScroll delay={100}>
              <NeomorphCard>
                <NeomorphCardHeader>
                  <NeomorphCardTitle>Notification Settings</NeomorphCardTitle>
                  <NeomorphCardDescription>Manage your notification preferences</NeomorphCardDescription>
                </NeomorphCardHeader>
                <NeomorphCardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-muted-foreground">Receive emails about your account activity</p>
                    </div>
                    <NeomorphToggle
                      checked={notifications.email}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Marketing Emails</h4>
                      <p className="text-sm text-muted-foreground">Receive emails about new features and offers</p>
                    </div>
                    <NeomorphToggle
                      checked={notifications.marketing}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, marketing: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Product Updates</h4>
                      <p className="text-sm text-muted-foreground">Receive updates about product improvements</p>
                    </div>
                    <NeomorphToggle
                      checked={notifications.updates}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, updates: checked })}
                    />
                  </div>
                </NeomorphCardContent>
                <NeomorphCardFooter>
                  <NeomorphButton variant="primary">Save Preferences</NeomorphButton>
                </NeomorphCardFooter>
              </NeomorphCard>
            </RevealOnScroll>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
