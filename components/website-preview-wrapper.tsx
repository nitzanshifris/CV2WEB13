"use client"

import { WebsitePreview } from "@/components/website-preview"
import type { ParsedResume } from "@/lib/resume-parser"

interface WebsitePreviewWrapperProps {
  resumeData: ParsedResume
  templateId: string
}

export function WebsitePreviewWrapper({ resumeData, templateId }: WebsitePreviewWrapperProps) {
  // Handle the event handlers here in the client component
  const handleEdit = () => {
    console.log("Edit clicked")
    // Add your edit logic here
  }

  const handleCustomize = () => {
    console.log("Customize clicked")
    // Add your customize logic here
  }

  return (
    <WebsitePreview resumeData={resumeData} templateId={templateId} onEdit={handleEdit} onCustomize={handleCustomize} />
  )
}
