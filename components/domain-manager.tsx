"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/glassmorphism/glass-card"
import { ScrollReveal } from "@/components/scroll-reveal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Globe, Lock, ExternalLink, Check, AlertTriangle, Loader2 } from "lucide-react"

interface DomainManagerProps {
  initialDomain?: string
  onUpdate: (domain: string) => void
}

export function DomainManager({ initialDomain, onUpdate }: DomainManagerProps) {
  const [activeTab, setActiveTab] = useState("subdomain")
  const [subdomain, setSubdomain] = useState(initialDomain?.split(".")[0] || "")
  const [customDomain, setCustomDomain] = useState("")
  const [isChecking, setIsChecking] = useState(false)
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [isPrivate, setIsPrivate] = useState(false)
  const [accessCode, setAccessCode] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"none" | "pending" | "connected" | "error">("none")

  // Function to check subdomain availability
  const checkSubdomainAvailability = () => {
    if (!subdomain) return

    setIsChecking(true)
    setIsAvailable(null)

    // Simulate API call with timeout
    setTimeout(() => {
      // For demo purposes, let's say subdomains with length < 4 are taken
      const available = subdomain.length >= 4
      setIsAvailable(available)
      setIsChecking(false)

      if (available) {
        onUpdate(`${subdomain}.cvwebsite.com`)
      }
    }, 1500)
  }

  // Function to connect custom domain
  const connectCustomDomain = () => {
    if (!customDomain) return

    setIsConnecting(true)
    setConnectionStatus("pending")

    // Simulate API call with timeout
    setTimeout(() => {
      setConnectionStatus("connected")
      setIsConnecting(false)
      onUpdate(customDomain)
    }, 2000)
  }

  // Function to validate subdomain
  const validateSubdomain = (value: string) => {
    // Only allow lowercase letters, numbers, and hyphens
    return value.replace(/[^a-z0-9-]/g, "")
  }

  return (
    <ScrollReveal>
      <GlassCard className="p-6">
        <h2 className="text-xl font-bold mb-4">Domain Manager</h2>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="subdomain" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>Subdomain</span>
            </TabsTrigger>
            <TabsTrigger value="custom" className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              <span>Custom Domain</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span>Privacy</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="subdomain">
            <div className="space-y-4">
              <div>
                <Label htmlFor="subdomain" className="text-sm font-medium mb-2 block">
                  Choose your subdomain
                </Label>
                <div className="flex">
                  <Input
                    id="subdomain"
                    value={subdomain}
                    onChange={(e) => setSubdomain(validateSubdomain(e.target.value))}
                    placeholder="yourname"
                    className="rounded-r-none"
                  />
                  <div className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-input bg-muted text-muted-foreground text-sm">
                    .cvwebsite.com
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Choose a unique subdomain for your CV website. Only lowercase letters, numbers, and hyphens are
                  allowed.
                </p>
              </div>

              {isChecking && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Checking availability...
                </div>
              )}

              {!isChecking && isAvailable === true && (
                <div className="flex items-center text-sm text-green-600">
                  <Check className="h-4 w-4 mr-2" />
                  {subdomain}.cvwebsite.com is available!
                </div>
              )}

              {!isChecking && isAvailable === false && (
                <div className="flex items-center text-sm text-red-600">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  {subdomain}.cvwebsite.com is already taken. Please try another.
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-4">
                <Button onClick={checkSubdomainAvailability} disabled={!subdomain || isChecking}>
                  {isChecking ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    "Check Availability"
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="custom">
            <div className="space-y-4">
              <div className="p-4 bg-muted/20 rounded-md mb-4">
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <Badge variant="outline" className="mr-2">
                    PRO
                  </Badge>
                  Custom Domain
                </h3>
                <p className="text-sm text-muted-foreground">
                  Connect your own domain for a more professional look. Use your personal or business domain to enhance
                  your CV website's credibility.
                </p>
              </div>

              <div>
                <Label htmlFor="custom-domain" className="text-sm font-medium mb-2 block">
                  Enter your custom domain
                </Label>
                <Input
                  id="custom-domain"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  placeholder="yourdomain.com"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter your domain without 'http://' or 'https://'. Example: yourdomain.com
                </p>
              </div>

              <div className="border rounded-md p-4 space-y-4">
                <h4 className="text-sm font-medium">DNS Configuration</h4>
                <p className="text-sm text-muted-foreground">
                  To connect your custom domain, you'll need to add the following DNS records at your domain registrar:
                </p>

                <div className="bg-muted p-3 rounded-md text-sm font-mono">
                  <div className="flex justify-between mb-2">
                    <span>Type</span>
                    <span>Name</span>
                    <span>Value</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CNAME</span>
                    <span>www</span>
                    <span>cname.cvwebsite.com</span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span>A</span>
                    <span>@</span>
                    <span>192.168.1.1</span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  DNS changes may take up to 48 hours to propagate. Once you've added these records, click "Connect
                  Domain" to verify.
                </p>
              </div>

              {connectionStatus === "pending" && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Connecting domain...
                </div>
              )}

              {connectionStatus === "connected" && (
                <div className="flex items-center text-sm text-green-600">
                  <Check className="h-4 w-4 mr-2" />
                  Domain connected successfully!
                </div>
              )}

              {connectionStatus === "error" && (
                <div className="flex items-center text-sm text-red-600">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Failed to connect domain. Please check your DNS settings and try again.
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-4">
                <Button onClick={connectCustomDomain} disabled={!customDomain || isConnecting}>
                  {isConnecting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    "Connect Domain"
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="privacy">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="private-toggle" className="text-sm font-medium">
                    Private Website
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Make your CV website private and password-protected
                  </p>
                </div>
                <Switch id="private-toggle" checked={isPrivate} onCheckedChange={setIsPrivate} />
              </div>

              {isPrivate && (
                <div className="space-y-4 p-4 bg-muted/20 rounded-md">
                  <div>
                    <Label htmlFor="access-code" className="text-sm font-medium mb-2 block">
                      Access Code
                    </Label>
                    <Input
                      id="access-code"
                      value={accessCode}
                      onChange={(e) => setAccessCode(e.target.value)}
                      placeholder="Enter an access code"
                      type="text"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      This code will be required to view your CV website. Share it only with people you want to grant
                      access.
                    </p>
                  </div>

                  <div className="p-3 rounded-md bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300 flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      Make sure to remember your access code. If you forget it, you'll need to set a new one.
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-4">
                <Button onClick={() => {}} disabled={isPrivate && !accessCode}>
                  Save Privacy Settings
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </GlassCard>
    </ScrollReveal>
  )
}
