"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/glassmorphism/glass-card"
import { ScrollReveal } from "@/components/scroll-reveal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Check,
  AlertTriangle,
  RefreshCw,
  Copy,
  FileText,
  UserCheck,
} from "lucide-react"

interface SecuritySettingsProps {
  onUpdate: (settings: SecuritySettings) => Promise<void>
  initialSettings?: SecuritySettings
}

interface SecuritySettings {
  passwordProtection: boolean
  password?: string
  twoFactorAuth: boolean
  contentRestriction: "none" | "email" | "password"
  privacyMode: boolean
  dataEncryption: boolean
  backupFrequency: "daily" | "weekly" | "monthly" | "never"
  activityLogging: boolean
  securityHeaders: boolean
  contentSecurityPolicy: boolean
}

export function SecuritySettings({ onUpdate, initialSettings }: SecuritySettingsProps) {
  const [activeTab, setActiveTab] = useState("access")
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [updateError, setUpdateError] = useState<string | null>(null)
  const [settings, setSettings] = useState<SecuritySettings>(
    initialSettings || {
      passwordProtection: false,
      password: "",
      twoFactorAuth: false,
      contentRestriction: "none",
      privacyMode: false,
      dataEncryption: true,
      backupFrequency: "weekly",
      activityLogging: true,
      securityHeaders: true,
      contentSecurityPolicy: true,
    },
  )
  const [showPassword, setShowPassword] = useState(false)
  const [securityScore, setSecurityScore] = useState(0)
  const [copied, setCopied] = useState(false)

  // Calculate security score whenever settings change
  useState(() => {
    calculateSecurityScore()
  })

  // Function to update settings
  const updateSettings = (key: keyof SecuritySettings, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
    calculateSecurityScore()
  }

  // Function to calculate security score
  const calculateSecurityScore = () => {
    let score = 0

    // Password protection
    if (settings.passwordProtection) {
      score += 20
      // Strong password check (simplified)
      if (settings.password && settings.password.length >= 8) score += 10
    }

    // Two-factor authentication
    if (settings.twoFactorAuth) score += 20

    // Content restriction
    if (settings.contentRestriction === "email") score += 10
    if (settings.contentRestriction === "password") score += 15

    // Privacy mode
    if (settings.privacyMode) score += 5

    // Data encryption
    if (settings.dataEncryption) score += 10

    // Backup frequency
    if (settings.backupFrequency === "daily") score += 10
    else if (settings.backupFrequency === "weekly") score += 5
    else if (settings.backupFrequency === "monthly") score += 2

    // Activity logging
    if (settings.activityLogging) score += 5

    // Security headers
    if (settings.securityHeaders) score += 5

    // Content security policy
    if (settings.contentSecurityPolicy) score += 5

    setSecurityScore(score)
  }

  // Function to apply settings
  const applySettings = async () => {
    setIsUpdating(true)
    setUpdateSuccess(false)
    setUpdateError(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      await onUpdate(settings)
      setUpdateSuccess(true)

      // Reset success message after 3 seconds
      setTimeout(() => setUpdateSuccess(false), 3000)
    } catch (error) {
      console.error("Error updating security settings:", error)
      setUpdateError("An error occurred while updating security settings. Please try again.")
    } finally {
      setIsUpdating(false)
    }
  }

  // Function to generate a strong password
  const generateStrongPassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]:;?><,./-="
    let password = ""
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    updateSettings("password", password)
  }

  // Function to copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Function to get security score color
  const getScoreColor = (score: number) => {
    if (score < 40) return "text-red-500"
    if (score < 70) return "text-yellow-500"
    return "text-green-500"
  }

  // Function to get progress color
  const getProgressColor = (score: number) => {
    if (score < 40) return "bg-red-500"
    if (score < 70) return "bg-yellow-500"
    return "bg-green-500"
  }

  return (
    <ScrollReveal>
      <GlassCard className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Security Settings</h2>
          <Badge
            variant="outline"
            className={`${
              securityScore < 40
                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                : securityScore < 70
                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                  : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
            }`}
          >
            <Shield className="h-3 w-3 mr-1" />
            Security Score: {securityScore}/100
          </Badge>
        </div>

        <div className="mb-6">
          <Progress value={securityScore} className={getProgressColor(securityScore)} />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Weak</span>
            <span>Moderate</span>
            <span>Strong</span>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="access" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span>Access Control</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              <span>Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Advanced</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="access">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-4">Website Access Protection</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="password-protection">Password Protection</Label>
                      <p className="text-sm text-muted-foreground">Require a password to access your website</p>
                    </div>
                    <Switch
                      id="password-protection"
                      checked={settings.passwordProtection}
                      onCheckedChange={(checked) => updateSettings("passwordProtection", checked)}
                    />
                  </div>

                  {settings.passwordProtection && (
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="password">Website Password</Label>
                      <div className="flex">
                        <div className="relative flex-1">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={settings.password}
                            onChange={(e) => updateSettings("password", e.target.value)}
                            placeholder="Enter a strong password"
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        <Button variant="outline" className="ml-2" onClick={generateStrongPassword}>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Generate
                        </Button>
                      </div>
                      {settings.password && (
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center">
                            <span className="text-xs mr-2">Password strength:</span>
                            <Badge
                              variant="outline"
                              className={
                                settings.password.length < 8
                                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                  : settings.password.length < 12
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                    : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              }
                            >
                              {settings.password.length < 8
                                ? "Weak"
                                : settings.password.length < 12
                                  ? "Moderate"
                                  : "Strong"}
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8"
                            onClick={() => copyToClipboard(settings.password || "")}
                          >
                            {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                            {copied ? "Copied" : "Copy"}
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security with 2FA</p>
                    </div>
                    <Switch
                      id="two-factor"
                      checked={settings.twoFactorAuth}
                      onCheckedChange={(checked) => updateSettings("twoFactorAuth", checked)}
                    />
                  </div>

                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="content-restriction">Content Restriction</Label>
                    <Select
                      value={settings.contentRestriction}
                      onValueChange={(value) =>
                        updateSettings("contentRestriction", value as "none" | "email" | "password")
                      }
                    >
                      <SelectTrigger id="content-restriction">
                        <SelectValue placeholder="Select restriction type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Restriction</SelectItem>
                        <SelectItem value="email">Email Registration Required</SelectItem>
                        <SelectItem value="password">Password Required</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">Control who can access your website content</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-sm font-medium mb-4">Access Logs</h3>
                <div className="h-32 border rounded-md p-3 overflow-auto">
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">2023-06-10 14:32:05</span>
                      <span>Successful login from 192.168.1.1</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">2023-06-10 10:15:22</span>
                      <span>Failed login attempt from 203.0.113.42</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">2023-06-09 18:45:11</span>
                      <span>Password changed</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">2023-06-08 09:22:37</span>
                      <span>Successful login from 192.168.1.1</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-2">
                  <Button variant="outline" size="sm">
                    <FileText className="h-3 w-3 mr-1" />
                    View Full Logs
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="privacy">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-4">Privacy Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="privacy-mode">Privacy Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Hide your website from search engines and public directories
                      </p>
                    </div>
                    <Switch
                      id="privacy-mode"
                      checked={settings.privacyMode}
                      onCheckedChange={(checked) => updateSettings("privacyMode", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="data-encryption">Data Encryption</Label>
                      <p className="text-sm text-muted-foreground">Encrypt sensitive data stored in your website</p>
                    </div>
                    <Switch
                      id="data-encryption"
                      checked={settings.dataEncryption}
                      onCheckedChange={(checked) => updateSettings("dataEncryption", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="activity-logging">Activity Logging</Label>
                      <p className="text-sm text-muted-foreground">Track and log user activity on your website</p>
                    </div>
                    <Switch
                      id="activity-logging"
                      checked={settings.activityLogging}
                      onCheckedChange={(checked) => updateSettings("activityLogging", checked)}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-sm font-medium mb-4">Data Backup</h3>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="backup-frequency">Backup Frequency</Label>
                  <Select
                    value={settings.backupFrequency}
                    onValueChange={(value) =>
                      updateSettings("backupFrequency", value as "daily" | "weekly" | "monthly" | "never")
                    }
                  >
                    <SelectTrigger id="backup-frequency">
                      <SelectValue placeholder="Select backup frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    How often your website data should be automatically backed up
                  </p>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-sm font-medium mb-4">Privacy Policy</h3>
                <div className="p-3 rounded-md bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300 flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium mb-1">Privacy Policy Recommended</p>
                    <p>If you collect any user data, it's recommended to add a privacy policy to your website.</p>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Privacy Policy
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-4">Advanced Security Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="security-headers">Security Headers</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable HTTP security headers to protect against common web vulnerabilities
                      </p>
                    </div>
                    <Switch
                      id="security-headers"
                      checked={settings.securityHeaders}
                      onCheckedChange={(checked) => updateSettings("securityHeaders", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="content-security">Content Security Policy</Label>
                      <p className="text-sm text-muted-foreground">
                        Restrict which resources can be loaded on your website
                      </p>
                    </div>
                    <Switch
                      id="content-security"
                      checked={settings.contentSecurityPolicy}
                      onCheckedChange={(checked) => updateSettings("contentSecurityPolicy", checked)}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-sm font-medium mb-4">SSL Certificate</h3>
                <div className="p-3 border rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Status</span>
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Type</span>
                    <span className="text-sm">TLS 1.3 (Let's Encrypt)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Expires</span>
                    <span className="text-sm">2023-09-15</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-sm font-medium mb-4">Security Recommendations</h3>
                <div className="space-y-3">
                  <div className="p-3 rounded-md bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-300 flex items-start gap-3">
                    <Check className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium">HTTPS Enabled</p>
                      <p>Your website is served over a secure connection.</p>
                    </div>
                  </div>

                  {!settings.twoFactorAuth && (
                    <div className="p-3 rounded-md bg-yellow-50 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300 flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <p className="font-medium">Enable Two-Factor Authentication</p>
                        <p>Add an extra layer of security to your account.</p>
                      </div>
                    </div>
                  )}

                  {settings.passwordProtection && settings.password && settings.password.length < 12 && (
                    <div className="p-3 rounded-md bg-yellow-50 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300 flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <p className="font-medium">Use a Stronger Password</p>
                        <p>Your current password could be more secure. Consider using a longer password.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="border-t mt-6 pt-6 flex justify-end">
          <Button onClick={applySettings} disabled={isUpdating}>
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Apply Security Settings
              </>
            )}
          </Button>
        </div>

        {updateSuccess && (
          <div className="mt-4 p-3 rounded-md bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-300 flex items-center">
            <Check className="h-5 w-5 mr-2" />
            Security settings updated successfully!
          </div>
        )}

        {updateError && (
          <div className="mt-4 p-3 rounded-md bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-300 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            {updateError}
          </div>
        )}
      </GlassCard>
    </ScrollReveal>
  )
}
