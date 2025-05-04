"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signUp } from "@/lib/auth"
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, Lock, User } from "lucide-react"
import { FloatLabelInput } from "@/components/float-label-input"
import { GlassCard } from "@/components/glassmorphism/glass-card"
import { GlassButton } from "@/components/glassmorphism/glass-button"
import { ScrollReveal } from "@/components/scroll-reveal"

export default function RegisterPage() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)

    // בדיקת התאמת סיסמאות
    if (password !== confirmPassword) {
      setError("הסיסמאות אינן תואמות")
      setIsLoading(false)
      return
    }

    try {
      await signUp(email, password, name)
      setSuccessMessage("ההרשמה הושלמה בהצלחה! אנא אמת את האימייל שלך כדי להמשיך.")
      // לא מעבירים ישירות לדף הבית כי צריך לאמת אימייל
    } catch (error) {
      console.error("Registration error:", error)
      setError("ההרשמה נכשלה. ייתכן שהאימייל כבר קיים במערכת.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center relative">
      {/* רקע דינמי */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="parallax-shape shape-circle bg-primary/5 w-96 h-96 -top-48 -right-48 absolute"></div>
        <div className="parallax-shape shape-circle bg-secondary/5 w-80 h-80 -bottom-40 -left-40 absolute"></div>
      </div>

      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <ScrollReveal>
          <GlassCard className="border-none" depth={3}>
            <CardHeader>
              <CardTitle className="text-2xl text-center">הרשמה</CardTitle>
              <CardDescription className="text-center">צור חשבון חדש כדי להתחיל</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {successMessage && (
                  <Alert className="bg-green-50 border-green-200">
                    <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <FloatLabelInput
                    id="name"
                    label="שם מלא"
                    icon={<User className="h-4 w-4" />}
                    variant="glass"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

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

                <div className="space-y-4">
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
                </div>

                <div className="space-y-4">
                  <FloatLabelInput
                    id="confirmPassword"
                    type="password"
                    label="אימות סיסמה"
                    icon={<Lock className="h-4 w-4" />}
                    variant="glass"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <GlassButton type="submit" className="w-full" disabled={isLoading || !!successMessage}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      נרשם...
                    </>
                  ) : (
                    "הירשם"
                  )}
                </GlassButton>
                <div className="text-center text-sm">
                  כבר יש לך חשבון?{" "}
                  <Link href="/login" className="text-primary hover:underline">
                    התחבר
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
