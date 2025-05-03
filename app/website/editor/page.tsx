"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/glassmorphism/glass-card"
import { GlassButton } from "@/components/glassmorphism/glass-button"
import { Loader2, Save, Eye, Layout, Palette, Type } from "lucide-react"
import { WebsitePreview } from "@/components/website-preview"

// Mock data for development - in production this would come from the database
const mockResumeData = {
  personalInfo: {
    name: "John Doe",
    title: "Senior Software Engineer",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    website: "johndoe.dev",
    summary:
      "Experienced software engineer with a passion for building scalable web applications and solving complex problems.",
  },
  experience: [
    {
      title: "Senior Software Engineer",
      company: "Tech Innovations Inc.",
      location: "San Francisco, CA",
      startDate: "2020-01",
      endDate: "Present",
      description:
        "Lead developer for cloud-based SaaS platform. Implemented microservices architecture and CI/CD pipeline.",
    },
    {
      title: "Software Engineer",
      company: "WebSolutions Co.",
      location: "Boston, MA",
      startDate: "2017-03",
      endDate: "2019-12",
      description: "Developed and maintained multiple client-facing web applications using React and Node.js.",
    },
  ],
  education: [
    {
      degree: "Master of Science in Computer Science",
      institution: "Stanford University",
      location: "Stanford, CA",
      startDate: "2015-09",
      endDate: "2017-06",
    },
    {
      degree: "Bachelor of Science in Computer Engineering",
      institution: "MIT",
      location: "Cambridge, MA",
      startDate: "2011-09",
      endDate: "2015-05",
    },
  ],
  skills: [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Python",
    "AWS",
    "Docker",
    "Kubernetes",
    "GraphQL",
    "REST APIs",
    "MongoDB",
    "PostgreSQL",
    "CI/CD",
    "Agile Methodologies",
  ],
  projects: [
    {
      name: "E-commerce Platform",
      description: "Built a full-stack e-commerce platform with React, Node.js, and MongoDB.",
      url: "https://github.com/johndoe/ecommerce",
    },
    {
      name: "Task Management App",
      description: "Developed a task management application with real-time updates using Socket.io.",
      url: "https://github.com/johndoe/taskmanager",
    },
  ],
}

export default function WebsiteEditorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [resumeData, setResumeData] = useState<any>(null)
  const [template, setTemplate] = useState(searchParams.get("template") || "professional")
  const [activeTab, setActiveTab] = useState("design")
  const [websiteConfig, setWebsiteConfig] = useState({
    colorScheme: "blue",
    fontStyle: "modern",
    layout: "standard",
    effects: "minimal",
    sections: {
      about: true,
      experience: true,
      education: true,
      skills: true,
      projects: true,
      contact: true,
    },
    customizations: {
      headerImage: "/placeholder.svg?key=1fpar",
      profileImage: "/professional-headshot.png",
      backgroundColor: "#ffffff",
      primaryColor: "#3b82f6",
      secondaryColor: "#10b981",
      fontPrimary: "Inter",
      fontSecondary: "Merriweather",
    },
  })
  const [isSaving, setIsSaving] = useState(false)
  const [previewMode, setPreviewMode] = useState<"desktop" | "tablet" | "mobile">("desktop")

  // Check if user is authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/website/editor")
    }
  }, [status, router])

  // Fetch resume data
  useEffect(() => {
    // In a real app, we would fetch the data from the API
    // For now, we'll use mock data
    setTimeout(() => {
      setResumeData(mockResumeData)
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleConfigChange = (section: string, key: string, value: any) => {
    setWebsiteConfig((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value,
      },
    }))
  }

  const handleSectionToggle = (section: string, enabled: boolean) => {
    setWebsiteConfig((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [section]: enabled,
      },
    }))
  }

  const handleSaveWebsite = async () => {
    setIsSaving(true)

    try {
      // In a real app, we would save the configuration to the database
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Redirect to the published website
      router.push(`/website/preview?id=123`)
    } catch (error) {
      console.error("Error saving website:", error)
    } finally {
      setIsSaving(false)
    }
  }

  // Show loading state while checking authentication
  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading editor...</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold glassmorphism-text">Website Editor</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => router.push("/upload")}>
            Back to Upload
          </Button>
          <GlassButton onClick={handleSaveWebsite} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save & Publish
              </>
            )}
          </GlassButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor Panel */}
        <div className="lg:col-span-1">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full mb-4">
              <TabsTrigger value="design" className="flex-1">
                <Palette className="mr-2 h-4 w-4" />
                Design
              </TabsTrigger>
              <TabsTrigger value="content" className="flex-1">
                <Type className="mr-2 h-4 w-4" />
                Content
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex-1">
                <Layout className="mr-2 h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <GlassCard className="p-4">
              <TabsContent value="design">
                <h2 className="text-xl font-semibold mb-4">Design Options</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Color Scheme</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {["blue", "green", "purple", "orange", "red", "teal", "pink", "gray"].map((color) => (
                        <div
                          key={color}
                          className={`h-10 rounded-md cursor-pointer transition-all ${
                            websiteConfig.colorScheme === color
                              ? "ring-2 ring-primary ring-offset-2"
                              : "hover:scale-105"
                          }`}
                          style={{
                            backgroundColor:
                              color === "blue"
                                ? "#3b82f6"
                                : color === "green"
                                  ? "#10b981"
                                  : color === "purple"
                                    ? "#8b5cf6"
                                    : color === "orange"
                                      ? "#f97316"
                                      : color === "red"
                                        ? "#ef4444"
                                        : color === "teal"
                                          ? "#14b8a6"
                                          : color === "pink"
                                            ? "#ec4899"
                                            : "#6b7280",
                          }}
                          onClick={() => handleConfigChange("colorScheme", "", color)}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Font Style</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {["modern", "classic", "minimal", "creative"].map((style) => (
                        <Button
                          key={style}
                          variant={websiteConfig.fontStyle === style ? "default" : "outline"}
                          onClick={() => handleConfigChange("fontStyle", "", style)}
                          className="capitalize"
                        >
                          {style}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Layout</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {["standard", "sidebar", "minimal", "creative"].map((layout) => (
                        <Button
                          key={layout}
                          variant={websiteConfig.layout === layout ? "default" : "outline"}
                          onClick={() => handleConfigChange("layout", "", layout)}
                          className="capitalize"
                        >
                          {layout}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Effects</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {["minimal", "shadows", "glassmorphism", "neomorphism"].map((effect) => (
                        <Button
                          key={effect}
                          variant={websiteConfig.effects === effect ? "default" : "outline"}
                          onClick={() => handleConfigChange("effects", "", effect)}
                          className="capitalize"
                        >
                          {effect}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="content">
                <h2 className="text-xl font-semibold mb-4">Content Options</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Sections</h3>
                    <div className="space-y-2">
                      {Object.entries(websiteConfig.sections).map(([section, enabled]) => (
                        <div key={section} className="flex items-center justify-between">
                          <span className="capitalize">{section}</span>
                          <Button
                            variant={enabled ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleSectionToggle(section, !enabled)}
                          >
                            {enabled ? "Enabled" : "Disabled"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Custom Content</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      You can edit your resume content directly in the preview. Click on any text to edit it.
                    </p>
                    <Button variant="outline" className="w-full">
                      <Eye className="mr-2 h-4 w-4" />
                      Edit Content in Preview
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="settings">
                <h2 className="text-xl font-semibold mb-4">Website Settings</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Domain</h3>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="yourname"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                      <span className="text-muted-foreground">.cvwebsite.com</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Choose a custom subdomain for your website</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">SEO</h3>
                    <div className="space-y-2">
                      <div>
                        <label className="text-sm font-medium">Page Title</label>
                        <input
                          type="text"
                          placeholder="John Doe - Software Engineer"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Meta Description</label>
                        <textarea
                          placeholder="Professional portfolio of John Doe, a Software Engineer specializing in web development."
                          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Privacy</h3>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="privacy"
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <label htmlFor="privacy" className="text-sm">
                        Make website private (password protected)
                      </label>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </GlassCard>
          </Tabs>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-2">
          <GlassCard className="p-4 mb-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Preview</h2>
              <div className="flex space-x-2">
                <Button
                  variant={previewMode === "desktop" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPreviewMode("desktop")}
                >
                  Desktop
                </Button>
                <Button
                  variant={previewMode === "tablet" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPreviewMode("tablet")}
                >
                  Tablet
                </Button>
                <Button
                  variant={previewMode === "mobile" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPreviewMode("mobile")}
                >
                  Mobile
                </Button>
              </div>
            </div>
          </GlassCard>

          <div
            className={`
            border border-border rounded-lg overflow-hidden bg-background transition-all duration-300
            ${previewMode === "desktop" ? "w-full" : previewMode === "tablet" ? "w-[768px] mx-auto" : "w-[375px] mx-auto"}
          `}
          >
            <div className="h-[600px] overflow-auto">
              {resumeData && (
                <WebsitePreview resumeData={resumeData} template={template} config={websiteConfig} isEditable={true} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
