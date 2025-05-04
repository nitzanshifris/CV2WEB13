"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/glassmorphism/glass-card"
import { ScrollReveal } from "@/components/scroll-reveal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Github,
  Youtube,
  Globe,
  MessageSquare,
  Loader2,
  Check,
  AlertTriangle,
} from "lucide-react"

interface SocialMediaIntegratorProps {
  initialProfiles?: SocialProfile[]
  onUpdate: (profiles: SocialProfile[]) => void
}

interface SocialProfile {
  platform: string
  username: string
  url: string
  enabled: boolean
}

interface SocialShareTemplate {
  title: string
  description: string
  hashtags: string
  image: string
}

export function SocialMediaIntegrator({ initialProfiles, onUpdate }: SocialMediaIntegratorProps) {
  const [activeTab, setActiveTab] = useState("profiles")
  const [profiles, setProfiles] = useState<SocialProfile[]>(
    initialProfiles || [
      { platform: "linkedin", username: "johndoe", url: "https://linkedin.com/in/johndoe", enabled: true },
      { platform: "github", username: "johndoe", url: "https://github.com/johndoe", enabled: true },
      { platform: "twitter", username: "johndoe", url: "https://twitter.com/johndoe", enabled: false },
      { platform: "instagram", username: "", url: "", enabled: false },
      { platform: "facebook", username: "", url: "", enabled: false },
      { platform: "youtube", username: "", url: "", enabled: false },
    ],
  )
  const [newPlatform, setNewPlatform] = useState("")
  const [newUsername, setNewUsername] = useState("")
  const [newUrl, setNewUrl] = useState("")
  const [shareTemplate, setShareTemplate] = useState<SocialShareTemplate>({
    title: "Check out my professional portfolio",
    description: "I've just updated my online portfolio with my latest projects and skills. Take a look!",
    hashtags: "portfolio,developer,design",
    image: "",
  })
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null)
  const [isSharing, setIsSharing] = useState(false)
  const [shareSuccess, setShareSuccess] = useState(false)
  const [autoShare, setAutoShare] = useState(false)
  const [shareSchedule, setShareSchedule] = useState("immediately")

  // Function to handle profile update
  const handleProfileUpdate = (index: number, field: keyof SocialProfile, value: string | boolean) => {
    const updatedProfiles = [...profiles]
    updatedProfiles[index] = {
      ...updatedProfiles[index],
      [field]: value,
    }
    setProfiles(updatedProfiles)
    onUpdate(updatedProfiles)
  }

  // Function to add new profile
  const handleAddProfile = () => {
    if (!newPlatform || !newUsername || !newUrl) return

    const newProfile: SocialProfile = {
      platform: newPlatform,
      username: newUsername,
      url: newUrl,
      enabled: true,
    }

    const updatedProfiles = [...profiles, newProfile]
    setProfiles(updatedProfiles)
    onUpdate(updatedProfiles)

    // Reset form
    setNewPlatform("")
    setNewUsername("")
    setNewUrl("")
  }

  // Function to remove profile
  const handleRemoveProfile = (index: number) => {
    const updatedProfiles = profiles.filter((_, i) => i !== index)
    setProfiles(updatedProfiles)
    onUpdate(updatedProfiles)
  }

  // Function to test connection
  const handleTestConnection = () => {
    setIsTesting(true)
    setTestResult(null)

    // Simulate API call with timeout
    setTimeout(() => {
      // For demo purposes, let's say it's successful
      setTestResult("success")
      setIsTesting(false)
    }, 1500)
  }

  // Function to share now
  const handleShareNow = () => {
    setIsSharing(true)

    // Simulate API call with timeout
    setTimeout(() => {
      setIsSharing(false)
      setShareSuccess(true)

      // Reset success message after 3 seconds
      setTimeout(() => setShareSuccess(false), 3000)
    }, 2000)
  }

  // Function to get platform icon
  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "facebook":
        return <Facebook className="h-5 w-5" />
      case "twitter":
        return <Twitter className="h-5 w-5" />
      case "linkedin":
        return <Linkedin className="h-5 w-5" />
      case "instagram":
        return <Instagram className="h-5 w-5" />
      case "github":
        return <Github className="h-5 w-5" />
      case "youtube":
        return <Youtube className="h-5 w-5" />
      default:
        return <Globe className="h-5 w-5" />
    }
  }

  // Function to get platform color
  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "facebook":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "twitter":
        return "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-300"
      case "linkedin":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300"
      case "instagram":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300"
      case "github":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      case "youtube":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <ScrollReveal>
      <GlassCard className="p-6">
        <h2 className="text-xl font-bold mb-4">Social Media Integration</h2>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="profiles" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>Profiles</span>
            </TabsTrigger>
            <TabsTrigger value="sharing" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              <span>Sharing</span>
            </TabsTrigger>
            <TabsTrigger value="feed" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>Social Feed</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profiles">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-4">Your Social Profiles</h3>
                <div className="space-y-3">
                  {profiles.map((profile, index) => (
                    <div key={index} className="border rounded-md p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-md ${getPlatformColor(profile.platform)}`}>
                          {getPlatformIcon(profile.platform)}
                        </div>
                        <div>
                          <h4 className="text-sm font-medium capitalize">{profile.platform}</h4>
                          {profile.username ? (
                            <p className="text-xs text-muted-foreground">@{profile.username}</p>
                          ) : (
                            <p className="text-xs text-muted-foreground">Not connected</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={profile.enabled}
                          onCheckedChange={(checked) => handleProfileUpdate(index, "enabled", checked)}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => handleRemoveProfile(index)}
                        >
                          <span className="sr-only">Remove</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                          </svg>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-sm font-medium mb-4">Add New Profile</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Platform</label>
                    <Select value={newPlatform} onValueChange={setNewPlatform}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="twitter">Twitter</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="github">GitHub</SelectItem>
                        <SelectItem value="youtube">YouTube</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Username</label>
                    <Input
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder="e.g., johndoe"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Profile URL</label>
                    <Input
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      placeholder="e.g., https://twitter.com/johndoe"
                    />
                  </div>
                </div>
                <Button onClick={handleAddProfile} disabled={!newPlatform || !newUsername || !newUrl}>
                  Add Profile
                </Button>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-sm font-medium mb-4">Test Connections</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Verify that your social media profiles are correctly connected and accessible.
                </p>
                <Button onClick={handleTestConnection} disabled={isTesting}>
                  {isTesting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    "Test All Connections"
                  )}
                </Button>

                {testResult === "success" && (
                  <div className="mt-4 p-3 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-md flex items-center">
                    <Check className="h-5 w-5 mr-2" />
                    All connections are working properly!
                  </div>
                )}

                {testResult === "error" && (
                  <div className="mt-4 p-3 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 rounded-md flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Some connections failed. Please check your profile URLs and try again.
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sharing">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-4">Share Your Website</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Customize how your website appears when shared on social media platforms.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Share Title</label>
                    <Input
                      value={shareTemplate.title}
                      onChange={(e) => setShareTemplate({ ...shareTemplate, title: e.target.value })}
                      placeholder="Enter a catchy title"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Share Description</label>
                    <Textarea
                      value={shareTemplate.description}
                      onChange={(e) => setShareTemplate({ ...shareTemplate, description: e.target.value })}
                      placeholder="Describe your website in a few sentences"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Hashtags</label>
                    <Input
                      value={shareTemplate.hashtags}
                      onChange={(e) => setShareTemplate({ ...shareTemplate, hashtags: e.target.value })}
                      placeholder="e.g., portfolio,developer,design"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Separate hashtags with commas</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Share Image</label>
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="share-image"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            className="w-8 h-8 mb-3 text-muted-foreground"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            ></path>
                          </svg>
                          <p className="mb-2 text-sm text-muted-foreground">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground">PNG, JPG or GIF (MAX. 2MB)</p>
                        </div>
                        <input id="share-image" type="file" className="hidden" />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-sm font-medium mb-4">Share Options</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-share" className="text-sm font-medium">
                        Auto-share updates
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Automatically share when you make significant updates to your website
                      </p>
                    </div>
                    <Switch id="auto-share" checked={autoShare} onCheckedChange={setAutoShare} />
                  </div>

                  {autoShare && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">Share Schedule</label>
                      <Select value={shareSchedule} onValueChange={setShareSchedule}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select when to share" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="immediately">Immediately after updates</SelectItem>
                          <SelectItem value="daily">Daily digest</SelectItem>
                          <SelectItem value="weekly">Weekly digest</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Button onClick={handleShareNow} disabled={isSharing}>
                      {isSharing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sharing...
                        </>
                      ) : (
                        "Share Now"
                      )}
                    </Button>
                    <Button variant="outline">Preview</Button>
                  </div>

                  {shareSuccess && (
                    <div className="p-3 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-md flex items-center">
                      <Check className="h-5 w-5 mr-2" />
                      Your website has been shared successfully!
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-sm font-medium mb-4">Share Analytics</h3>
                <div className="p-3 rounded-md bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300 flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    Share analytics are available on the Pro plan. Upgrade to see how your shares are performing.
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="feed">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-4">Social Feed Integration</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Display your latest social media posts directly on your website.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {profiles
                    .filter((p) => p.enabled)
                    .map((profile, index) => (
                      <div key={index} className="border rounded-md p-4">
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`p-2 rounded-md ${getPlatformColor(profile.platform)}`}>
                            {getPlatformIcon(profile.platform)}
                          </div>
                          <div>
                            <h4 className="text-sm font-medium capitalize">{profile.platform}</h4>
                            <p className="text-xs text-muted-foreground">@{profile.username}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm">Show latest posts</span>
                          <Switch checked={true} />
                        </div>
                      </div>
                    ))}
                </div>

                <div className="border rounded-md p-4">
                  <h4 className="text-sm font-medium mb-2">Feed Preview</h4>
                  <div className="h-64 bg-muted/20 rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground">Your social feed will appear here</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-sm font-medium mb-4">Feed Settings</h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Number of Posts</label>
                    <Select defaultValue="3">
                      <SelectTrigger>
                        <SelectValue placeholder="Select number of posts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 post</SelectItem>
                        <SelectItem value="3">3 posts</SelectItem>
                        <SelectItem value="5">5 posts</SelectItem>
                        <SelectItem value="10">10 posts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Layout</label>
                    <Select defaultValue="grid">
                      <SelectTrigger>
                        <SelectValue placeholder="Select layout" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grid">Grid</SelectItem>
                        <SelectItem value="carousel">Carousel</SelectItem>
                        <SelectItem value="list">List</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="show-captions" className="text-sm font-medium">
                        Show Captions
                      </Label>
                    </div>
                    <Switch id="show-captions" defaultChecked={true} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="show-likes" className="text-sm font-medium">
                        Show Likes & Comments
                      </Label>
                    </div>
                    <Switch id="show-likes" defaultChecked={true} />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </GlassCard>
    </ScrollReveal>
  )
}
