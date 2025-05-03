"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { GlassButton } from "@/components/glassmorphism/glass-button"
import { Loader2, ArrowLeft, Download, Globe, Share2, Copy } from "lucide-react"
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

const mockWebsiteConfig = {
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
    headerImage: "/placeholder.svg?key=1br4q",
    profile: "",
  },
}

export default function Page() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [websiteUrl, setWebsiteUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (searchParams.has("websiteUrl")) {
      setWebsiteUrl(searchParams.get("websiteUrl") as string)
    }
  }, [searchParams])

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Please wait, loading...
      </div>
    )
  }

  if (status === "unauthenticated") {
    router.push("/")
    return null
  }

  const handleBack = () => {
    router.back()
  }

  const handleDownload = () => {
    // Trigger download logic here
    alert("Download functionality not implemented yet.")
  }

  const handleShare = () => {
    // Trigger share logic here
    alert("Share functionality not implemented yet.")
  }

  const handleCopy = () => {
    // Trigger copy logic here
    alert("Copy functionality not implemented yet.")
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <Button variant="outline" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex space-x-2">
          <GlassButton onClick={handleDownload}>
            <Download className="h-4 w-4" />
          </GlassButton>
          <GlassButton onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </GlassButton>
          <GlassButton onClick={handleCopy}>
            <Copy className="h-4 w-4" />
          </GlassButton>
          <GlassButton>
            <Globe className="h-4 w-4" />
          </GlassButton>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="mr-2 h-6 w-6 animate-spin" />
          Loading website preview...
        </div>
      ) : (
        <WebsitePreview websiteUrl={websiteUrl} resumeData={mockResumeData} websiteConfig={mockWebsiteConfig} />
      )}
    </div>
  )
}
