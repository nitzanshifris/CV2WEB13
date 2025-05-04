"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/components/session-provider"
import { Label } from "@/components/ui/label"
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
import { supabase } from "@/lib/supabase"
import { ProfileImageUploader } from "@/components/profile-image-uploader"

export default function ProfilePage() {
  const router = useRouter()
  const { user, isLoading: isSessionLoading } = useSupabase()

  const [isPageLoading, setIsPageLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [userData, setUserData] = useState<any>(null)
  const [notifications, setNotifications] = useState({
    email: true,
    marketing: false,
    updates: true,
  })

  // טעינת נתוני המשתמש
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return

      try {
        const { data, error } = await supabase.from("users").select("*").eq("id", user.id).single()

        if (error) throw error
        setUserData(data)
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setIsPageLoading(false)
      }
    }

    if (!isSessionLoading) {
      if (!user) {
        router.push("/login?callbackUrl=/profile")
      } else {
        fetchUserData()
      }
    }
  }, [user, isSessionLoading, router])

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setSuccess("")
    setError("")

    try {
      const formData = new FormData(e.currentTarget)
      const name = formData.get("name") as string

      // עדכון נתוני המשתמש
      const { error } = await supabase
        .from("users")
        .update({
          name,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user?.id)

      if (error) throw error

      setSuccess("הפרופיל עודכן בהצלחה")
      setUserData((prev) => ({ ...prev, name }))
    } catch (error) {
      console.error("Error updating profile:", error)
      setError("עדכון הפרופיל נכשל")
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
      setError("הסיסמאות החדשות אינן תואמות")
      setIsLoading(false)
      return
    }

    try {
      // עדכון סיסמה
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) throw error

      setSuccess("הסיסמה עודכנה בהצלחה")
      // איפוס הטופס
      e.currentTarget.reset()
    } catch (error) {
      console.error("Error updating password:", error)
      setError("עדכון הסיסמה נכשל")
    } finally {
      setIsLoading(false)
    }
  }

  // הצגת מצב טעינה
  if (isPageLoading || isSessionLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">טוען פרופיל...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <RevealOnScroll>
          <h1 className="text-3xl font-bold mb-8">הגדרות פרופיל</h1>
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
              פרופיל
            </TabsTrigger>
            <TabsTrigger value="password" className="data-[state=active]:neomorphism-inset">
              סיסמה
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:neomorphism-inset">
              התראות
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <RevealOnScroll delay={100}>
              <NeomorphCard>
                <NeomorphCardHeader>
                  <NeomorphCardTitle>מידע אישי</NeomorphCardTitle>
                  <NeomorphCardDescription>עדכן את פרטי הפרופיל שלך</NeomorphCardDescription>
                </NeomorphCardHeader>
                <form onSubmit={handleProfileUpdate}>
                  <NeomorphCardContent className="space-y-4">
                    <div className="flex justify-center mb-6">
                      <ProfileImageUploader
                        avatarUrl={userData?.avatar_url}
                        name={userData?.name}
                        onUploadComplete={(url) => setUserData((prev) => ({ ...prev, avatar_url: url }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name">שם מלא</Label>
                      <NeomorphInput
                        id="name"
                        name="name"
                        defaultValue={userData?.name || ""}
                        placeholder="ישראל ישראלי"
                        icon={<User className="h-4 w-4" />}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">אימייל</Label>
                      <NeomorphInput
                        id="email"
                        name="email"
                        type="email"
                        defaultValue={userData?.email || ""}
                        placeholder="name@example.com"
                        disabled
                        icon={<Mail className="h-4 w-4" />}
                      />
                      <p className="text-xs text-muted-foreground">כתובת האימייל שלך משמשת להתחברות ולא ניתן לשנותה</p>
                    </div>
                  </NeomorphCardContent>
                  <NeomorphCardFooter>
                    <NeomorphButton type="submit" variant="primary" isLoading={isLoading} loadingText="שומר...">
                      שמור שינויים
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
                  <NeomorphCardTitle>שינוי סיסמה</NeomorphCardTitle>
                  <NeomorphCardDescription>עדכן את סיסמת החשבון שלך</NeomorphCardDescription>
                </NeomorphCardHeader>
                <form onSubmit={handlePasswordUpdate}>
                  <NeomorphCardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">סיסמה נוכחית</Label>
                      <NeomorphInput
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        required
                        icon={<Lock className="h-4 w-4" />}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">סיסמה חדשה</Label>
                      <NeomorphInput
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        required
                        icon={<Lock className="h-4 w-4" />}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">אימות סיסמה חדשה</Label>
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
                    <NeomorphButton type="submit" variant="primary" isLoading={isLoading} loadingText="מעדכן...">
                      עדכן סיסמה
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
                  <NeomorphCardTitle>הגדרות התראות</NeomorphCardTitle>
                  <NeomorphCardDescription>נהל את העדפות ההתראות שלך</NeomorphCardDescription>
                </NeomorphCardHeader>
                <NeomorphCardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">התראות אימייל</h4>
                      <p className="text-sm text-muted-foreground">קבל אימיילים על פעילות בחשבון שלך</p>
                    </div>
                    <NeomorphToggle
                      checked={notifications.email}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">אימיילים שיווקיים</h4>
                      <p className="text-sm text-muted-foreground">קבל אימיילים על תכונות חדשות ומבצעים</p>
                    </div>
                    <NeomorphToggle
                      checked={notifications.marketing}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, marketing: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">עדכוני מוצר</h4>
                      <p className="text-sm text-muted-foreground">קבל עדכונים על שיפורים במוצר</p>
                    </div>
                    <NeomorphToggle
                      checked={notifications.updates}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, updates: checked })}
                    />
                  </div>
                </NeomorphCardContent>
                <NeomorphCardFooter>
                  <NeomorphButton variant="primary">שמור העדפות</NeomorphButton>
                </NeomorphCardFooter>
              </NeomorphCard>
            </RevealOnScroll>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
