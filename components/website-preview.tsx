"use client"

import { useState, useEffect, useRef } from "react"
import type { ParsedResume } from "@/lib/resume-parser"
import type { WebsiteConfig } from "@/lib/website-generator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GlassCard } from "@/components/glassmorphism/glass-card"
import { GlassButton } from "@/components/glassmorphism/glass-button"
import { Loader2, ComputerIcon as Desktop, Tablet, Smartphone, Code, Download, Eye } from "lucide-react"

interface WebsitePreviewProps {
  resumeData: ParsedResume
  templateId: string
  onEdit?: () => void
  onCustomize?: () => void
}

export function WebsitePreview({ resumeData, templateId, onEdit, onCustomize }: WebsitePreviewProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [previewHtml, setPreviewHtml] = useState<string>("")
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile" | "code">("desktop")
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Configuration for the website
  const websiteConfig: Partial<WebsiteConfig> = {
    template: templateId,
    colorScheme: "blue", // Default color scheme
  }

  useEffect(() => {
    async function generatePreview() {
      setIsLoading(true)
      try {
        // In a real implementation, this would call an API endpoint
        // For now, we'll simulate a delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Generate a simple preview HTML
        const html = generateSimplePreview(resumeData, websiteConfig)
        setPreviewHtml(html)
      } catch (error) {
        console.error("Error generating preview:", error)
      } finally {
        setIsLoading(false)
      }
    }

    generatePreview()
  }, [resumeData, templateId])

  // Function to handle iframe load event
  const handleIframeLoad = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      // You can interact with the iframe content here if needed
    }
  }

  // Get the preview container class based on the view mode
  const getPreviewContainerClass = () => {
    switch (viewMode) {
      case "desktop":
        return "w-full h-[600px]"
      case "tablet":
        return "w-[768px] h-[600px] mx-auto"
      case "mobile":
        return "w-[375px] h-[600px] mx-auto"
      case "code":
        return "w-full h-[600px]"
      default:
        return "w-full h-[600px]"
    }
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Website Preview</h2>
        <div className="flex gap-2">
          {onEdit && (
            <GlassButton variant="outline" size="sm" onClick={onEdit} className="gap-1">
              <Eye className="h-4 w-4" />
              Edit Resume
            </GlassButton>
          )}
          {onCustomize && (
            <GlassButton size="sm" onClick={onCustomize} className="gap-1">
              <Download className="h-4 w-4" />
              Customize
            </GlassButton>
          )}
        </div>
      </div>

      <GlassCard className="p-4 overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)} className="w-full">
            <TabsList className="grid grid-cols-4 w-[400px]">
              <TabsTrigger value="desktop" className="flex items-center gap-2">
                <Desktop className="h-4 w-4" />
                <span className="hidden sm:inline">Desktop</span>
              </TabsTrigger>
              <TabsTrigger value="tablet" className="flex items-center gap-2">
                <Tablet className="h-4 w-4" />
                <span className="hidden sm:inline">Tablet</span>
              </TabsTrigger>
              <TabsTrigger value="mobile" className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                <span className="hidden sm:inline">Mobile</span>
              </TabsTrigger>
              <TabsTrigger value="code" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                <span className="hidden sm:inline">Code</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className={`bg-muted rounded-md overflow-hidden ${getPreviewContainerClass()}`}>
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Generating preview...</span>
            </div>
          ) : viewMode === "code" ? (
            <div className="w-full h-full overflow-auto bg-black text-white p-4 font-mono text-sm">
              <pre>{previewHtml}</pre>
            </div>
          ) : (
            <iframe
              ref={iframeRef}
              srcDoc={previewHtml}
              className="w-full h-full border-0"
              onLoad={handleIframeLoad}
              title="Website Preview"
              sandbox="allow-same-origin allow-scripts"
            />
          )}
        </div>
      </GlassCard>
    </div>
  )
}

// Helper function to generate a simple preview HTML
// In a real implementation, this would be replaced by the actual website generator
function generateSimplePreview(resumeData: ParsedResume, config: Partial<WebsiteConfig>): string {
  const template = config.template || "minimal"
  const colorScheme = config.colorScheme || "blue"

  // Define color variables based on the color scheme
  let primaryColor = "#3b82f6" // Default blue
  let secondaryColor = "#1e40af"
  let accentColor = "#60a5fa"

  switch (colorScheme) {
    case "purple":
      primaryColor = "#8b5cf6"
      secondaryColor = "#6d28d9"
      accentColor = "#a78bfa"
      break
    case "emerald":
      primaryColor = "#10b981"
      secondaryColor = "#059669"
      accentColor = "#6ee7b7"
      break
    case "amber":
      primaryColor = "#f59e0b"
      secondaryColor = "#d97706"
      accentColor = "#fbbf24"
      break
    case "rose":
      primaryColor = "#f43f5e"
      secondaryColor = "#e11d48"
      accentColor = "#fb7185"
      break
  }

  // Generate HTML based on the template
  let html = ""

  switch (template) {
    case "minimal":
      html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${resumeData.personalInfo.name} - ${resumeData.personalInfo.title}</title>
  <style>
    :root {
      --primary-color: ${primaryColor};
      --secondary-color: ${secondaryColor};
      --accent-color: ${accentColor};
      --text-color: #1f2937;
      --background-color: #ffffff;
      --section-bg-color: #f9fafb;
      --border-color: #e5e7eb;
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: 'Inter', sans-serif;
      color: var(--text-color);
      background-color: var(--background-color);
      line-height: 1.6;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }
    
    header {
      background-color: var(--primary-color);
      color: white;
      padding: 4rem 0;
      text-align: center;
    }
    
    header h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }
    
    header .title {
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
      opacity: 0.9;
    }
    
    .contact-info {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1rem;
    }
    
    .contact-info p {
      margin: 0;
    }
    
    .contact-info a {
      color: white;
      text-decoration: none;
      border-bottom: 1px dotted rgba(255, 255, 255, 0.7);
    }
    
    main {
      padding: 3rem 0;
    }
    
    section {
      margin-bottom: 3rem;
      padding: 2rem;
      background-color: var(--section-bg-color);
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }
    
    h2 {
      font-size: 1.8rem;
      margin-bottom: 1.5rem;
      color: var(--primary-color);
      border-bottom: 2px solid var(--border-color);
      padding-bottom: 0.5rem;
    }
    
    .timeline-item {
      margin-bottom: 2rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid var(--border-color);
    }
    
    .timeline-item:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }
    
    .timeline-header {
      margin-bottom: 1rem;
    }
    
    .timeline-header h3 {
      font-size: 1.3rem;
      margin-bottom: 0.25rem;
    }
    
    .company, .institution {
      font-weight: 500;
      color: var(--secondary-color);
    }
    
    .date {
      font-size: 0.9rem;
      color: #6b7280;
    }
    
    ul {
      margin-top: 1rem;
      padding-left: 1.5rem;
    }
    
    li {
      margin-bottom: 0.5rem;
    }
    
    .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1.5rem;
    }
    
    .skill-item {
      padding: 1rem;
      background-color: white;
      border-radius: 6px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    .skill-level {
      height: 8px;
      background-color: #e5e7eb;
      border-radius: 4px;
      margin-top: 0.5rem;
      overflow: hidden;
      position: relative;
    }
    
    .skill-level::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      background-color: var(--primary-color);
      width: 0;
      transition: width 0.3s ease;
    }
    
    .skill-level[data-level="1"]::after { width: 20%; }
    .skill-level[data-level="2"]::after { width: 40%; }
    .skill-level[data-level="3"]::after { width: 60%; }
    .skill-level[data-level="4"]::after { width: 80%; }
    .skill-level[data-level="5"]::after { width: 100%; }
    
    footer {
      background-color: #f3f4f6;
      padding: 2rem 0;
      text-align: center;
      font-size: 0.9rem;
      color: #6b7280;
    }
    
    @media (max-width: 768px) {
      header {
        padding: 3rem 0;
      }
      
      header h1 {
        font-size: 2rem;
      }
      
      header .title {
        font-size: 1.2rem;
      }
      
      .contact-info {
        flex-direction: column;
        gap: 0.5rem;
      }
      
      section {
        padding: 1.5rem;
      }
      
      .skills-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <header>
    <div class="container">
      <h1>${resumeData.personalInfo.name}</h1>
      <p class="title">${resumeData.personalInfo.title}</p>
      <div class="contact-info">
        <p>${resumeData.personalInfo.email}</p>
        ${resumeData.personalInfo.phone ? `<p>${resumeData.personalInfo.phone}</p>` : ""}
        ${resumeData.personalInfo.location ? `<p>${resumeData.personalInfo.location}</p>` : ""}
        ${resumeData.personalInfo.website ? `<p><a href="${resumeData.personalInfo.website}">${resumeData.personalInfo.website}</a></p>` : ""}
      </div>
    </div>
  </header>
  
  <main>
    <div class="container">
      ${
        resumeData.personalInfo.summary
          ? `
      <section id="about">
        <h2>About</h2>
        <p>${resumeData.personalInfo.summary}</p>
      </section>
      `
          : ""
      }
      
      <section id="experience">
        <h2>Experience</h2>
        <div class="timeline">
          ${resumeData.experience
            .map(
              (exp) => `
          <div class="timeline-item">
            <div class="timeline-header">
              <h3>${exp.position}</h3>
              <p class="company">${exp.company}</p>
              <p class="date">${exp.startDate} - ${exp.endDate || "Present"}</p>
            </div>
            <p>${exp.description}</p>
            ${
              exp.highlights && exp.highlights.length > 0
                ? `
            <ul>
              ${exp.highlights.map((highlight) => `<li>${highlight}</li>`).join("")}
            </ul>
            `
                : ""
            }
          </div>
          `,
            )
            .join("")}
        </div>
      </section>
      
      <section id="skills">
        <h2>Skills</h2>
        <div class="skills-grid">
          ${resumeData.skills
            .map(
              (skill) => `
          <div class="skill-item">
            <h3>${skill.name}</h3>
            ${skill.level ? `<div class="skill-level" data-level="${skill.level}"></div>` : ""}
          </div>
          `,
            )
            .join("")}
        </div>
      </section>
    </div>
  </main>
  
  <footer>
    <div class="container">
      <p>&copy; ${new Date().getFullYear()} ${resumeData.personalInfo.name}. All rights reserved.</p>
    </div>
  </footer>
</body>
</html>
      `
      break

    case "professional":
      html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${resumeData.personalInfo.name} - ${resumeData.personalInfo.title}</title>
  <style>
    :root {
      --primary-color: ${primaryColor};
      --secondary-color: ${secondaryColor};
      --accent-color: ${accentColor};
      --text-color: #1f2937;
      --background-color: #ffffff;
      --sidebar-bg-color: #f8fafc;
      --border-color: #e5e7eb;
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: 'Inter', sans-serif;
      color: var(--text-color);
      background-color: var(--background-color);
      line-height: 1.6;
      display: flex;
      min-height: 100vh;
    }
    
    .sidebar {
      width: 30%;
      background-color: var(--sidebar-bg-color);
      padding: 2rem;
      border-right: 1px solid var(--border-color);
    }
    
    .main-content {
      width: 70%;
      padding: 2rem;
    }
    
    .profile {
      text-align: center;
      margin-bottom: 2rem;
    }
    
    .profile-image {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      object-fit: cover;
      margin: 0 auto 1rem;
      border: 3px solid var(--primary-color);
    }
    
    .profile h1 {
      font-size: 1.8rem;
      margin-bottom: 0.5rem;
      color: var(--primary-color);
    }
    
    .profile .title {
      font-size: 1.2rem;
      color: var(--secondary-color);
      margin-bottom: 1rem;
    }
    
    .contact-info {
      margin-bottom: 2rem;
    }
    
    .contact-info h2 {
      font-size: 1.4rem;
      margin-bottom: 1rem;
      color: var(--primary-color);
      border-bottom: 2px solid var(--border-color);
      padding-bottom: 0.5rem;
    }
    
    .contact-item {
      display: flex;
      align-items: center;
      margin-bottom: 0.75rem;
    }
    
    .contact-item .icon {
      width: 20px;
      margin-right: 0.75rem;
      color: var(--primary-color);
    }
    
    .section {
      margin-bottom: 2.5rem;
    }
    
    .section h2 {
      font-size: 1.6rem;
      margin-bottom: 1.5rem;
      color: var(--primary-color);
      border-bottom: 2px solid var(--border-color);
      padding-bottom: 0.5rem;
    }
    
    .experience-item, .education-item {
      margin-bottom: 1.5rem;
    }
    
    .experience-item h3, .education-item h3 {
      font-size: 1.3rem;
      margin-bottom: 0.25rem;
    }
    
    .company, .institution {
      font-weight: 500;
      color: var(--secondary-color);
    }
    
    .date {
      font-size: 0.9rem;
      color: #6b7280;
      margin-bottom: 0.75rem;
    }
    
    ul {
      padding-left: 1.5rem;
      margin-top: 0.75rem;
    }
    
    li {
      margin-bottom: 0.5rem;
    }
    
    .skills-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }
    
    .skill-tag {
      background-color: var(--primary-color);
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.9rem;
    }
    
    @media (max-width: 768px) {
      body {
        flex-direction: column;
      }
      
      .sidebar, .main-content {
        width: 100%;
      }
      
      .sidebar {
        border-right: none;
        border-bottom: 1px solid var(--border-color);
      }
    }
  </style>
</head>
<body>
  <div class="sidebar">
    <div class="profile">
      ${
        resumeData.personalInfo.profileImage
          ? `<img src="${resumeData.personalInfo.profileImage}" alt="${resumeData.personalInfo.name}" class="profile-image">`
          : `<div class="profile-image" style="background-color: var(--primary-color); display: flex; align-items: center; justify-content: center; color: white; font-size: 3rem;">${resumeData.personalInfo.name.charAt(0)}</div>`
      }
      <h1>${resumeData.personalInfo.name}</h1>
      <p class="title">${resumeData.personalInfo.title}</p>
    </div>
    
    <div class="contact-info">
      <h2>Contact</h2>
      <div class="contact-item">
        <span class="icon">📧</span>
        <span>${resumeData.personalInfo.email}</span>
      </div>
      ${
        resumeData.personalInfo.phone
          ? `
      <div class="contact-item">
        <span class="icon">📱</span>
        <span>${resumeData.personalInfo.phone}</span>
      </div>
      `
          : ""
      }
      ${
        resumeData.personalInfo.location
          ? `
      <div class="contact-item">
        <span class="icon">📍</span>
        <span>${resumeData.personalInfo.location}</span>
      </div>
      `
          : ""
      }
      ${
        resumeData.personalInfo.website
          ? `
      <div class="contact-item">
        <span class="icon">🌐</span>
        <span><a href="${resumeData.personalInfo.website}" style="color: var(--primary-color); text-decoration: none;">${resumeData.personalInfo.website}</a></span>
      </div>
      `
          : ""
      }
    </div>
    
    <div class="skills">
      <h2>Skills</h2>
      <div class="skills-list">
        ${resumeData.skills
          .map(
            (skill) => `
        <span class="skill-tag">${skill.name}</span>
        `,
          )
          .join("")}
      </div>
    </div>
    
    ${
      resumeData.languages && resumeData.languages.length > 0
        ? `
    <div class="languages" style="margin-top: 2rem;">
      <h2>Languages</h2>
      <ul style="list-style: none; padding-left: 0;">
        ${resumeData.languages
          .map(
            (lang) => `
        <li style="margin-bottom: 0.5rem;">
          <strong>${lang.language}</strong>
          ${lang.proficiency ? ` - ${lang.proficiency}` : ""}
        </li>
        `,
          )
          .join("")}
      </ul>
    </div>
    `
        : ""
    }
  </div>
  
  <div class="main-content">
    ${
      resumeData.personalInfo.summary
        ? `
    <div class="section">
      <h2>About</h2>
      <p>${resumeData.personalInfo.summary}</p>
    </div>
    `
        : ""
    }
    
    <div class="section">
      <h2>Experience</h2>
      ${resumeData.experience
        .map(
          (exp) => `
      <div class="experience-item">
        <h3>${exp.position}</h3>
        <p class="company">${exp.company}</p>
        <p class="date">${exp.startDate} - ${exp.endDate || "Present"}</p>
        <p>${exp.description}</p>
        ${
          exp.highlights && exp.highlights.length > 0
            ? `
        <ul>
          ${exp.highlights.map((highlight) => `<li>${highlight}</li>`).join("")}
        </ul>
        `
            : ""
        }
      </div>
      `,
        )
        .join("")}
    </div>
    
    <div class="section">
      <h2>Education</h2>
      ${resumeData.education
        .map(
          (edu) => `
      <div class="education-item">
        <h3>${edu.degree}${edu.field ? `, ${edu.field}` : ""}</h3>
        <p class="institution">${edu.institution}</p>
        <p class="date">${edu.startDate} - ${edu.endDate || "Present"}</p>
        ${edu.description ? `<p>${edu.description}</p>` : ""}
      </div>
      `,
        )
        .join("")}
    </div>
    
    ${
      resumeData.projects && resumeData.projects.length > 0
        ? `
    <div class="section">
      <h2>Projects</h2>
      ${resumeData.projects
        .map(
          (project) => `
      <div class="experience-item">
        <h3>${project.name}</h3>
        <p>${project.description}</p>
        ${project.url ? `<p><a href="${project.url}" style="color: var(--primary-color);">${project.url}</a></p>` : ""}
        ${
          project.highlights && project.highlights.length > 0
            ? `
        <ul>
          ${project.highlights.map((highlight) => `<li>${highlight}</li>`).join("")}
        </ul>
        `
            : ""
        }
      </div>
      `,
        )
        .join("")}
    </div>
    `
        : ""
    }
    
    ${
      resumeData.certifications && resumeData.certifications.length > 0
        ? `
    <div class="section">
      <h2>Certifications</h2>
      ${resumeData.certifications
        .map(
          (cert) => `
      <div class="experience-item">
        <h3>${cert.name}</h3>
        <p>${cert.issuer}${cert.date ? ` - ${cert.date}` : ""}</p>
        ${cert.url ? `<p><a href="${cert.url}" style="color: var(--primary-color);">${cert.url}</a></p>` : ""}
      </div>
      `,
        )
        .join("")}
    </div>
    `
        : ""
    }
  </div>
</body>
</html>
      `
      break

    case "creative":
      html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${resumeData.personalInfo.name} - ${resumeData.personalInfo.title}</title>
  <style>
    :root {
      --primary-color: ${primaryColor};
      --secondary-color: ${secondaryColor};
      --accent-color: ${accentColor};
      --text-color: #1f2937;
      --background-color: #ffffff;
      --section-bg-color: #f9fafb;
      --border-color: #e5e7eb;
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: 'Poppins', sans-serif;
      color: var(--text-color);
      background-color: var(--background-color);
      line-height: 1.6;
    }
    
    .hero {
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      color: white;
      position: relative;
      overflow: hidden;
    }
    
    .hero::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fillOpacity='0.1' fillRule='evenodd'/%3E%3C/svg%3E");
      opacity: 0.5;
    }
    
    .hero-content {
      position: relative;
      z-index: 1;
      max-width: 800px;
      padding: 0 2rem;
    }
    
    .hero h1 {
      font-size: 4rem;
      margin-bottom: 1rem;
      letter-spacing: 2px;
    }
    
    .hero .title {
      font-size: 1.8rem;
      margin-bottom: 2rem;
      opacity: 0.9;
    }
    
    .scroll-down {
      position: absolute;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      animation: bounce 2s infinite;
      color: white;
      font-size: 2rem;
    }
    
    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% {
        transform: translateY(0) translateX(-50%);
      }
      40% {
        transform: translateY(-20px) translateX(-50%);
      }
      60% {
        transform: translateY(-10px) translateX(-50%);
      }
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 4rem 2rem;
    }
    
    .section-title {
      text-align: center;
      margin-bottom: 3rem;
      position: relative;
    }
    
    .section-title h2 {
      font-size: 2.5rem;
      color: var(--primary-color);
      display: inline-block;
    }
    
    .section-title h2::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 100px;
      height: 4px;
      background: var(--accent-color);
      border-radius: 2px;
    }
    
    .about {
      background-color: var(--section-bg-color);
      padding: 6rem 0;
    }
    
    .about-content {
      max-width: 800px;
      margin: 0 auto;
      font-size: 1.2rem;
      line-height: 1.8;
    }
    
    .experience, .education, .skills, .projects {
      padding: 6rem 0;
    }
    
    .experience:nth-child(odd), .education:nth-child(odd), .skills:nth-child(odd), .projects:nth-child(odd) {
      background-color: var(--section-bg-color);
    }
    
    .timeline {
      position: relative;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .timeline::after {
      content: '';
      position: absolute;
      width: 4px;
      background-color: var(--primary-color);
      top: 0;
      bottom: 0;
      left: 50%;
      margin-left: -2px;
    }
    
    .timeline-item {
      padding: 10px 40px;
      position: relative;
      width: 50%;
      box-sizing: border-box;
    }
    
    .timeline-item::after {
      content: '';
      position: absolute;
      width: 20px;
      height: 20px;
      background-color: white;
      border: 4px solid var(--primary-color);
      top: 15px;
      border-radius: 50%;
      z-index: 1;
    }
    
    .left {
      left: 0;
    }
    
    .right {
      left: 50%;
    }
    
    .left::after {
      right: -10px;
    }
    
    .right::after {
      left: -10px;
    }
    
    .timeline-content {
      padding: 20px;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    
    .timeline-content h3 {
      font-size: 1.3rem;
      margin-bottom: 0.25rem;
      color: var(--primary-color);
    }
    
    .company, .institution {
      font-weight: 500;
      color: var(--secondary-color);
    }
    
    .date {
      font-size: 0.9rem;
      color: #6b7280;
      margin-bottom: 0.75rem;
    }
    
    .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 2rem;
    }
    
    .skill-card {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      padding: 1.5rem;
      transition: transform 0.3s ease;
    }
    
    .skill-card:hover {
      transform: translateY(-5px);
    }
    
    .skill-card h3 {
      font-size: 1.3rem;
      margin-bottom: 0.75rem;
      color: var(--primary-color);
    }
    
    .skill-level {
      height: 8px;
      background-color: #e5e7eb;
      border-radius: 4px;
      margin-top: 0.75rem;
      overflow: hidden;
      position: relative;
    }
    
    .skill-level::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      background-color: var(--primary-color);
      border-radius: 4px;
    }
    
    .skill-level[data-level="1"]::after { width: 20%; }
    .skill-level[data-level="2"]::after { width: 40%; }
    .skill-level[data-level="3"]::after { width: 60%; }
    .skill-level[data-level="4"]::after { width: 80%; }
    .skill-level[data-level="5"]::after { width: 100%; }
    
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
    }
    
    .project-card {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      transition: transform 0.3s ease;
    }
    
    .project-card:hover {
      transform: translateY(-5px);
    }
    
    .project-card-content {
      padding: 1.5rem;
    }
    
    .project-card h3 {
      font-size: 1.3rem;
      margin-bottom: 0.75rem;
      color: var(--primary-color);
    }
    
    .project-link {
      display: inline-block;
      margin-top: 1rem;
      color: var(--primary-color);
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s ease;
    }
    
    .project-link:hover {
      color: var(--secondary-color);
    }
    
    footer {
      background-color: var(--primary-color);
      color: white;
      padding: 4rem 0;
      text-align: center;
    }
    
    .contact-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
      max-width: 800px;
      margin: 0 auto 3rem;
    }
    
    .contact-item {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .contact-icon {
      font-size: 2rem;
      margin-bottom: 1rem;
    }
    
    .contact-text {
      font-size: 1.1rem;
    }
    
    .contact-text a {
      color: white;
      text-decoration: none;
      border-bottom: 1px dotted rgba(255, 255, 255, 0.7);
      transition: border-color 0.3s ease;
    }
    
    .contact-text a:hover {
      border-color: white;
    }
    
    .copyright {
      margin-top: 3rem;
      font-size: 0.9rem;
      opacity: 0.8;
    }
    
    @media (max-width: 768px) {
      .hero h1 {
        font-size: 3rem;
      }
      
      .hero .title {
        font-size: 1.4rem;
      }
      
      .timeline::after {
        left: 31px;
      }
      
      .timeline-item {
        width: 100%;
        padding-left: 70px;
        padding-right: 25px;
      }
      
      .timeline-item::after {
        left: 21px;
      }
      
      .left::after, .right::after {
        left: 21px;
      }
      
      .right {
        left: 0;
      }
      
      .skills-grid, .projects-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <section class="hero">
    <div class="hero-content">
      <h1>${resumeData.personalInfo.name}</h1>
      <p class="title">${resumeData.personalInfo.title}</p>
    </div>
    <div class="scroll-down">↓</div>
  </section>
  
  ${
    resumeData.personalInfo.summary
      ? `
  <section class="about">
    <div class="container">
      <div class="section-title">
        <h2>About Me</h2>
      </div>
      <div class="about-content">
        <p>${resumeData.personalInfo.summary}</p>
      </div>
    </div>
  </section>
  `
      : ""
  }
  
  <section class="experience">
    <div class="container">
      <div class="section-title">
        <h2>Experience</h2>
      </div>
      <div class="timeline">
        ${resumeData.experience
          .map(
            (exp, index) => `
        <div class="timeline-item ${index % 2 === 0 ? "left" : "right"}">
          <div class="timeline-content">
            <h3>${exp.position}</h3>
            <p class="company">${exp.company}</p>
            <p class="date">${exp.startDate} - ${exp.endDate || "Present"}</p>
            <p>${exp.description}</p>
            ${
              exp.highlights && exp.highlights.length > 0
                ? `
            <ul>
              ${exp.highlights.map((highlight) => `<li>${highlight}</li>`).join("")}
            </ul>
            `
                : ""
            }
          </div>
        </div>
        `,
          )
          .join("")}
      </div>
    </div>
  </section>
  
  <section class="skills">
    <div class="container">
      <div class="section-title">
        <h2>Skills</h2>
      </div>
      <div class="skills-grid">
        ${resumeData.skills
          .map(
            (skill) => `
        <div class="skill-card">
          <h3>${skill.name}</h3>
          ${skill.level ? `<div class="skill-level" data-level="${skill.level}"></div>` : ""}
        </div>
        `,
          )
          .join("")}
      </div>
    </div>
  </section>
  
  ${
    resumeData.projects && resumeData.projects.length > 0
      ? `
  <section class="projects">
    <div class="container">
      <div class="section-title">
        <h2>Projects</h2>
      </div>
      <div class="projects-grid">
        ${resumeData.projects
          .map(
            (project) => `
        <div class="project-card">
          <div class="project-card-content">
            <h3>${project.name}</h3>
            <p>${project.description}</p>
            ${project.url ? `<a href="${project.url}" class="project-link" target="_blank">View Project</a>` : ""}
          </div>
        </div>
        `,
          )
          .join("")}
      </div>
    </div>
  </section>
  `
      : ""
  }
  
  <footer>
    <div class="container">
      <div class="contact-grid">
        <div class="contact-item">
          <div class="contact-icon">📧</div>
          <div class="contact-text">${resumeData.personalInfo.email}</div>
        </div>
        ${
          resumeData.personalInfo.phone
            ? `
        <div class="contact-item">
          <div class="contact-icon">📱</div>
          <div class="contact-text">${resumeData.personalInfo.phone}</div>
        </div>
        `
            : ""
        }
        ${
          resumeData.personalInfo.location
            ? `
        <div class="contact-item">
          <div class="contact-icon">📍</div>
          <div class="contact-text">${resumeData.personalInfo.location}</div>
        </div>
        `
            : ""
        }
        ${
          resumeData.personalInfo.website
            ? `
        <div class="contact-item">
          <div class="contact-icon">🌐</div>
          <div class="contact-text"><a href="${resumeData.personalInfo.website}">${resumeData.personalInfo.website}</a></div>
        </div>
        `
            : ""
        }
      </div>
      <div class="copyright">
        <p>&copy; ${new Date().getFullYear()} ${resumeData.personalInfo.name}. All rights reserved.</p>
      </div>
    </div>
  </footer>
</body>
</html>
      `
      break
  }

  return html
}
