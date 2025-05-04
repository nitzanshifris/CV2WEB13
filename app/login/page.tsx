"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { signIn } from "@/lib/auth"
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, Lock } from "lucide-react"
import { FloatLabelInput } from "@/components/float-label-input"
import { GlassCard } from "@/components/glassmorphism/glass-card"
import { GlassButton } from "@/components/glassmorphism/glass-button"
import { ScrollReveal } from "@/components/scroll-reveal"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      await signIn(email, password)
      router.push(callbackUrl)
    } catch (error) {
      console.error("Login error:", error)
      setError("התחברות נכשלה. אנא בדוק את האימייל והסיסמה שלך.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center relative">
      {/* רקע דינמי */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="parallax-shape shape-circle bg-primary/5 w-96 h-96 -top-48 -left-48 absolute"></div>
        <div className="parallax-shape shape-square bg-secondary/5 w-80 h-80 -bottom-40 -right-40 absolute rotate-12"></div>
      </div>

      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <ScrollReveal>
          <GlassCard className="border-none" depth={3}>
            <CardHeader>
              <CardTitle className="text-2xl text-center">התחברות</CardTitle>
              <CardDescription className="text-center">הזן את פרטי ההתחברות שלך להמשך</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <FloatLabelInput
                    id="email"
                    type="email"
                    label="אימייל"
                    icon={<Mail className="h-4 w-4" />}
                    variant="glass"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <FloatLabelInput
                    id="password"
                    type="password"
                    label="סיסמה"
                    icon={<Lock className="h-4 w-4" />}
                    variant="glass"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <div className="flex justify-end">
                    <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                      שכחת סיסמה?
                    </Link>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <GlassButton type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      מתחבר...
                    </>
                  ) : (
                    "התחבר"
                  )}
                </GlassButton>
                <div className="text-center text-sm">
                  אין לך חשבון?{" "}
                  <Link href="/register" className="text-primary hover:underline">
                    הירשם
                  </Link>
                </div>
              </CardFooter>
            </form>
          </GlassCard>
        </ScrollReveal>
      </div>
    </div>
  )
}
