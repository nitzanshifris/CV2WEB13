"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Upload, FileUp, Check, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { NeomorphCard } from "@/components/neomorphism/card"
import { NeomorphInput } from "@/components/neomorphism/input"
import { NeomorphButton } from "@/components/neomorphism/button"
import { TemplatePreview } from "@/components/template-preview"
import { WebsitePreview } from "@/components/website-preview"
import { WebsiteCustomizer } from "@/components/website-customizer"
import { parseResume } from "@/lib/resume-parser"

export default function UploadPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [resumeData, setResumeData] = useState<any>(null)
  const [previewMode, setPreviewMode] = useState<"template" | "website">("template")
  const [selectedTemplate, setSelectedTemplate] = useState("professional")
  const [websiteConfig, setWebsiteConfig] = useState({
    colorScheme: "blue",
    fontStyle: "modern",
    layout: "standard",
    effects: "minimal",
  })

  // Check if user is authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/upload")
    }
  }, [status, router])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setUploadSuccess(false)
      setUploadError(null)

      try {
        // Parse resume locally for immediate preview
        const data = await parseResume(selectedFile)
        setResumeData(data)
      } catch (error) {
        console.error("Error parsing resume:", error)
        setUploadError("Could not parse resume. Please try a different file.")
      }
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setUploadError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      // Send to server for processing
      const response = await fetch("/api/resume/parse", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload resume")
      }

      const data = await response.json()
      setResumeData(data.resumeData)
      setUploadSuccess(true)
      setPreviewMode("website")
    } catch (error) {
      console.error("Upload error:", error)
      setUploadError("Failed to upload resume. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template)
  }

  const handleConfigChange = (config: any) => {
    setWebsiteConfig((prev) => ({ ...prev, ...config }))
  }

  const handleGenerateWebsite = () => {
    // Save the configuration and redirect to the website editor
    if (resumeData) {
      // Here we would typically save the configuration to the database
      // and then redirect to the editor or preview page
      router.push(`/website/editor?template=${selectedTemplate}`)
    }
  }

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading...</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4 space-y-8">
      <h1 className="text-4xl font-bold text-center mb-8 glassmorphism-text">Upload Your Resume</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <NeomorphCard className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Upload Resume</h2>
            <div className="space-y-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="resume">Resume File</Label>
                <NeomorphInput
                  id="resume"
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,.json"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                <p className="text-sm text-muted-foreground mt-1">Supported formats: PDF, Word, TXT, JSON</p>
              </div>

              <NeomorphButton onClick={handleUpload} disabled={!file || isUploading} className="w-full">
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FileUp className="mr-2 h-4 w-4" />
                    Upload Resume
                  </>
                )}
              </NeomorphButton>

              {uploadSuccess && (
                <div className="flex items-center text-green-500">
                  <Check className="mr-2 h-4 w-4" />
                  Resume uploaded successfully!
                </div>
              )}

              {uploadError && (
                <div className="flex items-center text-red-500">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  {uploadError}
                </div>
              )}
            </div>
          </NeomorphCard>

          {resumeData && (
            <div className="space-y-6">
              <div className="flex space-x-2">
                <Button
                  variant={previewMode === "template" ? "default" : "outline"}
                  onClick={() => setPreviewMode("template")}
                >
                  Template Preview
                </Button>
                <Button
                  variant={previewMode === "website" ? "default" : "outline"}
                  onClick={() => setPreviewMode("website")}
                >
                  Website Preview
                </Button>
              </div>

              {previewMode === "website" && (
                <WebsiteCustomizer
                  selectedTemplate={selectedTemplate}
                  config={websiteConfig}
                  onTemplateSelect={handleTemplateSelect}
                  onConfigChange={handleConfigChange}
                />
              )}

              <Button onClick={handleGenerateWebsite} className="w-full" size="lg">
                <Upload className="mr-2 h-4 w-4" />
                Generate Website
              </Button>
            </div>
          )}
        </div>

        <div className="h-[600px] overflow-hidden rounded-lg border border-border shadow-xl">
          {resumeData ? (
            previewMode === "template" ? (
              <TemplatePreview resumeData={resumeData} />
            ) : (
              <WebsitePreview resumeData={resumeData} template={selectedTemplate} config={websiteConfig} />
            )
          ) : (
            <div className="flex flex-col items-center justify-center h-full bg-muted/30">
              <Upload className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium text-muted-foreground">Upload your resume to see a preview</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-md text-center">
                We'll automatically extract information from your resume and generate a website preview.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
