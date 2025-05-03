"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Github, Loader2, Mail } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard"
  const errorType = searchParams?.get("error")

  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState("")

  // טיפול בהודעות שגיאה מפרמטרי URL
  let errorMessage = ""
  if (errorType) {
    switch (errorType) {
      case "CredentialsSignin":
        errorMessage = "אימייל או סיסמה לא תקינים"
        break
      case "OAuthSignin":
      case "OAuthCallback":
        errorMessage = "שגיאה בכניסה עם ספק OAuth"
        break
      default:
        errorMessage = "אירעה שגיאה במהלך הכניסה"
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setFormError("")

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email")
    const password = formData.get("password")

    if (!email || !password) {
      setFormError("נא להזין אימייל וסיסמה")
      setIsLoading(false)
      return
    }

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        setFormError("אימייל או סיסמה לא תקינים")
        setIsLoading(false)
        return
      }

      // כניסה מוצלחת
      router.push(callbackUrl)
    } catch (error) {
      console.error("Login error:", error)
      setFormError("אירעה שגיאה. נסה שוב.")
      setIsLoading(false)
    }
  }

  const handleOAuthSignIn = (provider) => {
    setIsLoading(true)
    // שימוש בזרימת הפניה עבור OAuth כדי למנוע שגיאות בצד הלקוח
    signIn(provider, { callbackUrl })
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">התחברות לחשבון שלך</CardTitle>
            <CardDescription className="text-center">הזן את האימייל והסיסמה שלך כדי להתחבר לחשבון שלך</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {(errorMessage || formError) && (
              <Alert variant="destructive">
                <AlertDescription>{formError || errorMessage}</AlertDescription>
              </Alert>
            )}

            <Tabs defaultValue="credentials" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="credentials">אימייל</TabsTrigger>
                <TabsTrigger value="oauth">OAuth</TabsTrigger>
              </TabsList>

              <TabsContent value="credentials">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">אימייל</Label>
                    <Input id="email" name="email" type="email" placeholder="name@example.com" required />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">סיסמה</Label>
                      <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                        שכחת סיסמה?
                      </Link>
                    </div>
                    <Input id="password" name="password" type="password" required />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        מתחבר...
                      </>
                    ) : (
                      "התחבר"
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="oauth">
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleOAuthSignIn("google")}
                    disabled={isLoading}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    התחבר עם Google
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleOAuthSignIn("github")}
                    disabled={isLoading}
                  >
                    <Github className="mr-2 h-4 w-4" />
                    התחבר עם GitHub
                  </Button>
                  {isLoading && (
                    <div className="text-center text-sm text-muted-foreground">
                      <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                      מתחבר לספק...
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              אין לך חשבון?{" "}
              <Link href="/register" className="text-primary hover:underline">
                הירשם
              </Link>
            </div>
            <div className="text-center text-xs text-muted-foreground">
              בהתחברות, אתה מסכים ל{" "}
              <Link href="/terms" className="hover:underline">
                תנאי השירות
              </Link>{" "}
              ו{" "}
              <Link href="/privacy" className="hover:underline">
                מדיניות הפרטיות
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
