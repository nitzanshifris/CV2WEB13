"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SimpleLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage(`Login attempt with: ${email}`)

    // Test API call to verify API functionality
    try {
      const response = await fetch("/api/test")
      const data = await response.json()
      setMessage(`API response: ${JSON.stringify(data)}`)
    } catch (error) {
      setMessage(`API error: ${error.message}`)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Simple Login Test</CardTitle>
            <CardDescription className="text-center">Testing basic functionality without NextAuth</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <Button type="submit" className="w-full">
                Test Login
              </Button>
            </form>

            {message && (
              <div className="mt-4 p-3 bg-gray-100 rounded-md">
                <p>{message}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
