"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/glassmorphism/glass-card"
import { GlassButton } from "@/components/glassmorphism/glass-button"
import {
  Loader2,
  Save,
  Eye,
  Palette,
  Type,
  Settings,
  BarChart,
  History,
  Share2,
  Accessibility,
  Zap,
  Sparkles,
  Smartphone,
  Download,
  Shield,
  Layout,
  Globe,
  MessageSquare,
} from "lucide-react"
import { WebsitePreview } from "@/components/website-preview"
import { ColorPaletteGenerator } from "@/components/color-palette-generator"
import { FontPairingTool } from "@/components/font-pairing-tool"
import { SeoOptimizer } from "@/components/seo-optimizer"
import { DomainManager } from "@/components/domain-manager"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { ScrollReveal } from "@/components/scroll-reveal"
import { TiltCard } from "@/components/tilt-card"
import { VersionHistory } from "@/components/version-history"
import { SocialMediaIntegrator } from "@/components/social-media-integrator"
import { AccessibilityChecker } from "@/components/accessibility-checker"
import { PerformanceOptimizer } from "@/components/performance-optimizer"
import { AiContentGenerator } from "@/components/ai-content-generator"
import { TemplateGallery } from "@/components/template-gallery"
import { MobileOptimization } from "@/components/mobile-optimization"
import { ExportOptions } from "@/components/export-options"
import { SecuritySettings } from "@/components/security-settings"
import { AiInterviewer } from "@/components/ai-interviewer"

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
    { name: "JavaScript", level: 5 },
    { name: "TypeScript", level: 4 },
    { name: "React", level: 5 },
    { name: "Node.js", level: 4 },
    { name: "Python", level: 3 },
    { name: "AWS", level: 4 },
    { name: "Docker", level: 3 },
    { name: "Kubernetes", level: 3 },
    { name: "GraphQL", level: 4 },
    { name: "REST APIs", level: 5 },
    { name: "MongoDB", level: 4 },
    { name: "PostgreSQL", level: 4 },
    { name: "CI/CD", level: 4 },
    { name: "Agile Methodologies", level: 5 },
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
  const [activeSubTab, setActiveSubTab] = useState<string | null>(null)
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
    seo: {
      title: "",
      description: "",
      keywords: "",
      url: "",
    },
    domain: "",
  })
  const [isSaving, setIsSaving] = useState(false)
  const [previewMode, setPreviewMode] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [interviewFeedback, setInterviewFeedback] = useState<any[]>([])

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

  const handleColorPaletteChange = (colors: string[]) => {
    if (colors.length >= 2) {
      setWebsiteConfig((prev) => ({
        ...prev,
        customizations: {
          ...prev.customizations,
          primaryColor: colors[0],
          secondaryColor: colors[1],
        },
      }))
    }
  }

  const handleFontPairingChange = (fonts: { heading: string; body: string }) => {
    setWebsiteConfig((prev) => ({
      ...prev,
      customizations: {
        ...prev.customizations,
        fontPrimary: fonts.heading,
        fontSecondary: fonts.body,
      },
    }))
  }

  const handleSeoUpdate = (seoData: { title: string; description: string; keywords: string; url: string }) => {
    setWebsiteConfig((prev) => ({
      ...prev,
      seo: seoData,
    }))
  }

  const handleDomainUpdate = (domain: string) => {
    setWebsiteConfig((prev) => ({
      ...prev,
      domain,
    }))
  }

  const handleRestoreVersion = async (versionId: string) => {
    // In a real app, this would restore a specific version from the database
    console.log(`Restoring version ${versionId}`)
    await new Promise((resolve) => setTimeout(resolve, 1500))
  }

  const handleSaveVersion = async (name: string, notes: string) => {
    // In a real app, this would save the current state as a new version
    console.log(`Saving version: ${name}, notes: ${notes}`)
    await new Promise((resolve) => setTimeout(resolve, 1500))
  }

  const handleSocialProfilesUpdate = (profiles: any[]) => {
    // In a real app, this would update social profiles in the database
    console.log("Updating social profiles:", profiles)
  }

  const handleFixAccessibilityIssue = async (issueId: string, fix: string) => {
    // In a real app, this would apply the fix to the website
    console.log(`Fixing accessibility issue ${issueId} with ${fix}`)
    await new Promise((resolve) => setTimeout(resolve, 1500))
  }

  const handleOptimizePerformance = async (optimizationType: string) => {
    // In a real app, this would apply performance optimizations
    console.log(`Optimizing performance: ${optimizationType}`)
    await new Promise((resolve) => setTimeout(resolve, 1500))
  }

  const handleGenerateContent = (content: string, type: string) => {
    // In a real app, this would update the website content
    console.log(`Generated ${type} content:`, content)
  }

  const handleSelectTemplate = (templateId: string) => {
    setTemplate(templateId)
  }

  const handleUpdateMobileSettings = async (settings: any) => {
    // In a real app, this would update mobile settings in the database
    console.log("Updating mobile settings:", settings)
    await new Promise((resolve) => setTimeout(resolve, 1500))
  }

  const handleExport = async (format: string, options: any) => {
    // In a real app, this would export the website in the specified format
    console.log(`Exporting website as ${format} with options:`, options)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Return a mock result
    if (format === "download") {
      return "Website files prepared for download. Click here to download."
    } else if (format === "pdf") {
      return "PDF generated successfully. Click here to download."
    } else if (format === "image") {
      return "Image generated successfully. Click here to download."
    } else if (format === "deploy") {
      return "https://johndoe-portfolio.vercel.app"
    }

    return "Export completed successfully."
  }

  const handleUpdateSecuritySettings = async (settings: any) => {
    // In a real app, this would update security settings in the database
    console.log("Updating security settings:", settings)
    await new Promise((resolve) => setTimeout(resolve, 1500))
  }

  const handleSaveInterviewFeedback = (feedback: any) => {
    setInterviewFeedback((prev) => [...prev, feedback])
    console.log("Saved interview feedback:", feedback)
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

  // Render the appropriate sub-tab content
  const renderSubTabContent = () => {
    switch (activeTab) {
      case "design":
        switch (activeSubTab) {
          case "colors":
            return (
              <ColorPaletteGenerator
                onSelectPalette={handleColorPaletteChange}
                initialColors={[
                  websiteConfig.customizations.primaryColor,
                  websiteConfig.customizations.secondaryColor,
                  "#60a5fa",
                  "#f9fafb",
                  "#1f2937",
                ]}
              />
            )
          case "fonts":
            return (
              <FontPairingTool
                onSelectFonts={handleFontPairingChange}
                initialFonts={{
                  heading: websiteConfig.customizations.fontPrimary,
                  body: websiteConfig.customizations.fontSecondary,
                }}
              />
            )
          case "layout":
            return (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Layout Style</h3>
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
                  <h3 className="text-lg font-medium mb-2">Visual Effects</h3>
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
            )
          case "templates":
            return <TemplateGallery onSelectTemplate={handleSelectTemplate} currentTemplateId={template} />
          default:
            return (
              <div className="space-y-6">
                <h3 className="text-lg font-medium mb-4">Design Options</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TiltCard
                    maxTilt={5}
                    className="border p-4 rounded-lg cursor-pointer"
                    onClick={() => setActiveSubTab("templates")}
                  >
                    <div className="flex flex-col items-center text-center">
                      <Layout className="h-8 w-8 mb-2 text-primary" />
                      <h4 className="font-medium">Templates</h4>
                      <p className="text-sm text-muted-foreground mt-1">Choose from various website templates</p>
                    </div>
                  </TiltCard>
                  <TiltCard
                    maxTilt={5}
                    className="border p-4 rounded-lg cursor-pointer"
                    onClick={() => setActiveSubTab("colors")}
                  >
                    <div className="flex flex-col items-center text-center">
                      <Palette className="h-8 w-8 mb-2 text-primary" />
                      <h4 className="font-medium">Color Palette</h4>
                      <p className="text-sm text-muted-foreground mt-1">Customize your website colors</p>
                    </div>
                  </TiltCard>
                  <TiltCard
                    maxTilt={5}
                    className="border p-4 rounded-lg cursor-pointer"
                    onClick={() => setActiveSubTab("fonts")}
                  >
                    <div className="flex flex-col items-center text-center">
                      <Type className="h-8 w-8 mb-2 text-primary" />
                      <h4 className="font-medium">Typography</h4>
                      <p className="text-sm text-muted-foreground mt-1">Choose fonts and text styles</p>
                    </div>
                  </TiltCard>
                  <TiltCard
                    maxTilt={5}
                    className="border p-4 rounded-lg cursor-pointer"
                    onClick={() => setActiveSubTab("layout")}
                  >
                    <div className="flex flex-col items-center text-center">
                      <Settings className="h-8 w-8 mb-2 text-primary" />
                      <h4 className="font-medium">Layout & Effects</h4>
                      <p className="text-sm text-muted-foreground mt-1">Set layout and visual effects</p>
                    </div>
                  </TiltCard>
                </div>
              </div>
            )
        }
      case "content":
        switch (activeSubTab) {
          case "sections":
            return (
              <div className="space-y-6">
                <h3 className="text-lg font-medium mb-4">Website Sections</h3>
                <div className="space-y-2">
                  {Object.entries(websiteConfig.sections).map(([section, enabled]) => (
                    <div key={section} className="flex items-center justify-between p-3 border rounded-md">
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
            )
          case "ai-generator":
            return <AiContentGenerator onGenerate={handleGenerateContent} />
          case "ai-interviewer":
            return <AiInterviewer resumeData={resumeData} onSaveFeedback={handleSaveInterviewFeedback} />
          default:
            return (
              <div className="space-y-6">
                <h3 className="text-lg font-medium mb-4">Content Options</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <TiltCard
                    maxTilt={5}
                    className="border p-4 rounded-lg cursor-pointer"
                    onClick={() => setActiveSubTab("sections")}
                  >
                    <div className="flex flex-col items-center text-center">
                      <Settings className="h-8 w-8 mb-2 text-primary" />
                      <h4 className="font-medium">Manage Sections</h4>
                      <p className="text-sm text-muted-foreground mt-1">Enable or disable website sections</p>
                    </div>
                  </TiltCard>
                  <TiltCard
                    maxTilt={5}
                    className="border p-4 rounded-lg cursor-pointer"
                    onClick={() => setActiveSubTab("ai-generator")}
                  >
                    <div className="flex flex-col items-center text-center">
                      <Sparkles className="h-8 w-8 mb-2 text-primary" />
                      <h4 className="font-medium">AI Content Generator</h4>
                      <p className="text-sm text-muted-foreground mt-1">Generate professional content with AI</p>
                    </div>
                  </TiltCard>
                  <TiltCard
                    maxTilt={5}
                    className="border p-4 rounded-lg cursor-pointer"
                    onClick={() => setActiveSubTab("ai-interviewer")}
                  >
                    <div className="flex flex-col items-center text-center">
                      <MessageSquare className="h-8 w-8 mb-2 text-primary" />
                      <h4 className="font-medium">AI Interview Simulator</h4>
                      <p className="text-sm text-muted-foreground mt-1">Practice interviews with AI feedback</p>
                    </div>
                  </TiltCard>
                </div>
                <div className="mt-6">
                  <Button variant="outline" className="w-full">
                    <Eye className="mr-2 h-4 w-4" />
                    Edit Content in Preview
                  </Button>
                </div>
              </div>
            )
        }
      case "optimize":
        switch (activeSubTab) {
          case "accessibility":
            return <AccessibilityChecker websiteId="123" onFix={handleFixAccessibilityIssue} />
          case "performance":
            return <PerformanceOptimizer websiteId="123" onOptimize={handleOptimizePerformance} />
          case "mobile":
            return <MobileOptimization onUpdate={handleUpdateMobileSettings} />
          default:
            return (
              <div className="space-y-6">
                <h3 className="text-lg font-medium mb-4">Optimization Tools</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <TiltCard
                    maxTilt={5}
                    className="border p-4 rounded-lg cursor-pointer"
                    onClick={() => setActiveSubTab("accessibility")}
                  >
                    <div className="flex flex-col items-center text-center">
                      <Accessibility className="h-8 w-8 mb-2 text-primary" />
                      <h4 className="font-medium">Accessibility</h4>
                      <p className="text-sm text-muted-foreground mt-1">Make your website accessible to everyone</p>
                    </div>
                  </TiltCard>
                  <TiltCard
                    maxTilt={5}
                    className="border p-4 rounded-lg cursor-pointer"
                    onClick={() => setActiveSubTab("performance")}
                  >
                    <div className="flex flex-col items-center text-center">
                      <Zap className="h-8 w-8 mb-2 text-primary" />
                      <h4 className="font-medium">Performance</h4>
                      <p className="text-sm text-muted-foreground mt-1">Speed up your website loading time</p>
                    </div>
                  </TiltCard>
                  <TiltCard
                    maxTilt={5}
                    className="border p-4 rounded-lg cursor-pointer"
                    onClick={() => setActiveSubTab("mobile")}
                  >
                    <div className="flex flex-col items-center text-center">
                      <Smartphone className="h-8 w-8 mb-2 text-primary" />
                      <h4 className="font-medium">Mobile Optimization</h4>
                      <p className="text-sm text-muted-foreground mt-1">Optimize for mobile devices</p>
                    </div>
                  </TiltCard>
                </div>
              </div>
            )
        }
      case "settings":
        switch (activeSubTab) {
          case "seo":
            return <SeoOptimizer initialData={websiteConfig.seo} onUpdate={handleSeoUpdate} />
          case "domain":
            return <DomainManager initialDomain={websiteConfig.domain} onUpdate={handleDomainUpdate} />
          case "social":
            return <SocialMediaIntegrator onUpdate={handleSocialProfilesUpdate} />
          case "export":
            return <ExportOptions websiteId="123" onExport={handleExport} />
          case "security":
            return <SecuritySettings onUpdate={handleUpdateSecuritySettings} />
          default:
            return (
              <div className="space-y-6">
                <h3 className="text-lg font-medium mb-4">Website Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <TiltCard
                    maxTilt={5}
                    className="border p-4 rounded-lg cursor-pointer"
                    onClick={() => setActiveSubTab("seo")}
                  >
                    <div className="flex flex-col items-center text-center">
                      <Globe className="h-8 w-8 mb-2 text-primary" />
                      <h4 className="font-medium">SEO Settings</h4>
                      <p className="text-sm text-muted-foreground mt-1">Optimize for search engines</p>
                    </div>
                  </TiltCard>
                  <TiltCard
                    maxTilt={5}
                    className="border p-4 rounded-lg cursor-pointer"
                    onClick={() => setActiveSubTab("domain")}
                  >
                    <div className="flex flex-col items-center text-center">
                      <Globe className="h-8 w-8 mb-2 text-primary" />
                      <h4 className="font-medium">Domain Settings</h4>
                      <p className="text-sm text-muted-foreground mt-1">Configure your website domain</p>
                    </div>
                  </TiltCard>
                  <TiltCard
                    maxTilt={5}
                    className="border p-4 rounded-lg cursor-pointer"
                    onClick={() => setActiveSubTab("social")}
                  >
                    <div className="flex flex-col items-center text-center">
                      <Share2 className="h-8 w-8 mb-2 text-primary" />
                      <h4 className="font-medium">Social Media</h4>
                      <p className="text-sm text-muted-foreground mt-1">Connect your social profiles</p>
                    </div>
                  </TiltCard>
                  <TiltCard
                    maxTilt={5}
                    className="border p-4 rounded-lg cursor-pointer"
                    onClick={() => setActiveSubTab("export")}
                  >
                    <div className="flex flex-col items-center text-center">
                      <Download className="h-8 w-8 mb-2 text-primary" />
                      <h4 className="font-medium">Export & Deploy</h4>
                      <p className="text-sm text-muted-foreground mt-1">Export or deploy your website</p>
                    </div>
                  </TiltCard>
                  <TiltCard
                    maxTilt={5}
                    className="border p-4 rounded-lg cursor-pointer"
                    onClick={() => setActiveSubTab("security")}
                  >
                    <div className="flex flex-col items-center text-center">
                      <Shield className="h-8 w-8 mb-2 text-primary" />
                      <h4 className="font-medium">Security</h4>
                      <p className="text-sm text-muted-foreground mt-1">Secure your website</p>
                    </div>
                  </TiltCard>
                </div>
              </div>
            )
        }
      case "analytics":
        return <AnalyticsDashboard websiteId="123" />
      case "history":
        return <VersionHistory websiteId="123" onRestore={handleRestoreVersion} onSaveVersion={handleSaveVersion} />
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <ScrollReveal>
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
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor Panel */}
        <div className="lg:col-span-1">
          <Tabs
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value)
              setActiveSubTab(null)
            }}
          >
            <TabsList className="w-full mb-4">
              <TabsTrigger value="design" className="flex-1">
                <Palette className="mr-2 h-4 w-4" />
                Design
              </TabsTrigger>
              <TabsTrigger value="content" className="flex-1">
                <Type className="mr-2 h-4 w-4" />
                Content
              </TabsTrigger>
              <TabsTrigger value="optimize" className="flex-1">
                <Zap className="mr-2 h-4 w-4" />
                Optimize
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex-1">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <div className="flex justify-between mb-4">
              <div className="flex space-x-2">
                {activeSubTab && (
                  <Button variant="ghost" size="sm" onClick={() => setActiveSubTab(null)}>
                    ← Back
                  </Button>
                )}
                <h2 className="text-xl font-semibold">
                  {activeSubTab
                    ? activeSubTab.charAt(0).toUpperCase() + activeSubTab.slice(1)
                    : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </h2>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="icon" onClick={() => setActiveTab("analytics")}>
                  <BarChart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => setActiveTab("history")}>
                  <History className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <GlassCard className="p-4">{renderSubTabContent()}</GlassCard>
          </Tabs>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-2">
          <TiltCard maxTilt={5} glare={true} glareOpacity={0.2}>
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
          </TiltCard>

          <div
            className={`
            border border-border rounded-lg overflow-hidden bg-background transition-all duration-300
            ${previewMode === "desktop" ? "w-full" : previewMode === "tablet" ? "w-[768px] mx-auto" : "w-[375px] mx-auto"}
          `}
          >
            <div className="h-[600px] overflow-auto">
              {resumeData && (
                <WebsitePreview
                  resumeData={resumeData}
                  templateId={template}
                  onEdit={() => setActiveTab("content")}
                  onCustomize={() => setActiveTab("design")}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
