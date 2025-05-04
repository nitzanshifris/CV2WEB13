"use client"

import { useState, useEffect, useRef } from "react"
import type { ParsedResume } from "@/lib/resume-parser"
import type { WebsiteConfig } from "@/lib/website-generator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GlassCard } from "@/components/glassmorphism/glass-card"
import { GlassButton } from "@/components/glassmorphism/glass-button"
import { TiltCard } from "@/components/tilt-card"
import { ScrollReveal } from "@/components/scroll-reveal"
import {
  Loader2,
  ComputerIcon as Desktop,
  Tablet,
  Smartphone,
  Code,
  Download,
  Eye,
  Share2,
  Copy,
  Check,
} from "lucide-react"

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
  const [copied, setCopied] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
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

  // Function to copy the HTML code
  const copyToClipboard = () => {
    navigator.clipboard.writeText(previewHtml)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Function to toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  return (
    <div className={`w-full ${isFullscreen ? "fixed inset-0 z-50 bg-background p-4" : ""}`}>
      <div className="flex justify-between items-center mb-4">
        <ScrollReveal>
          <h2 className="text-xl font-bold gradient-text">Website Preview</h2>
        </ScrollReveal>
        <div className="flex gap-2">
          {onEdit && (
            <ScrollReveal delay={100}>
              <GlassButton variant="outline" size="sm" onClick={onEdit} className="gap-1">
                <Eye className="h-4 w-4" />
                Edit Resume
              </GlassButton>
            </ScrollReveal>
          )}
          {onCustomize && (
            <ScrollReveal delay={200}>
              <GlassButton size="sm" onClick={onCustomize} className="gap-1">
                <Download className="h-4 w-4" />
                Customize
              </GlassButton>
            </ScrollReveal>
          )}
        </div>
      </div>

      <ScrollReveal delay={300}>
        <TiltCard className="overflow-hidden" maxTilt={5} glare={true} glareOpacity={0.2} disabled={isFullscreen}>
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
              <div className="flex gap-2">
                <GlassButton variant="outline" size="sm" onClick={toggleFullscreen} className="gap-1">
                  <Eye className="h-4 w-4" />
                  {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                </GlassButton>
                {viewMode === "code" && (
                  <GlassButton variant="outline" size="sm" onClick={copyToClipboard} className="gap-1">
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Copied!" : "Copy Code"}
                  </GlassButton>
                )}
                <GlassButton variant="outline" size="sm" className="gap-1">
                  <Share2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Share</span>
                </GlassButton>
              </div>
            </div>

            <div
              className={`bg-muted rounded-md overflow-hidden ${getPreviewContainerClass()} transition-all duration-300`}
            >
              {isLoading ? (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <span className="text-muted-foreground animate-pulse">Generating preview...</span>
                  <div className="mt-4 text-sm text-muted-foreground max-w-md text-center">
                    Creating a professional website preview based on your resume data. This may take a moment as we
                    optimize the layout and styling.
                  </div>
                </div>
              ) : viewMode === "code" ? (
                <div className="w-full h-full overflow-auto bg-black text-white p-4 font-mono text-sm">
                  <pre className="whitespace-pre-wrap">{previewHtml}</pre>
                </div>
              ) : (
                <iframe
                  ref={iframeRef}
                  srcDoc={previewHtml}
                  className="w-full h-full border-0 transition-all duration-300"
                  onLoad={handleIframeLoad}
                  title="Website Preview"
                  sandbox="allow-same-origin allow-scripts"
                />
              )}
            </div>

            {!isLoading && viewMode !== "code" && (
              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">Template:</span>{" "}
                  {templateId.charAt(0).toUpperCase() + templateId.slice(1)}
                </div>
                <div className="flex gap-2">
                  <GlassButton variant="outline" size="sm" className="gap-1">
                    <Download className="h-4 w-4" />
                    Download HTML
                  </GlassButton>
                  <GlassButton size="sm" className="gap-1">
                    <Eye className="h-4 w-4" />
                    Deploy Website
                  </GlassButton>
                </div>
              </div>
            )}
          </GlassCard>
        </TiltCard>
      </ScrollReveal>
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
      position: relative;
      overflow: hidden;
    }
    
    header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.1) 100%);
      z-index: 1;
    }
    
    header .content {
      position: relative;
      z-index: 2;
    }
    
    header h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
      animation: fadeInDown 1s ease-out;
    }
    
    header .title {
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
      opacity: 0.9;
      animation: fadeInUp 1s ease-out 0.3s forwards;
      opacity: 0;
    }
    
    .contact-info {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1rem;
      animation: fadeInUp 1s ease-out 0.6s forwards;
      opacity: 0;
    }
    
    .contact-info p {
      margin: 0;
    }
    
    .contact-info a {
      color: white;
      text-decoration: none;
      border-bottom: 1px dotted rgba(255, 255, 255, 0.7);
      transition: border-color 0.3s;
    }
    
    .contact-info a:hover {
      border-color: white;
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
      transition: transform 0.3s, box-shadow 0.3s;
    }
    
    section:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
    
    h2 {
      font-size: 1.8rem;
      margin-bottom: 1.5rem;
      color: var(--primary-color);
      border-bottom: 2px solid var(--border-color);
      padding-bottom: 0.5rem;
      position: relative;
    }
    
    h2::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 50px;
      height: 2px;
      background-color: var(--primary-color);
    }
    
    .timeline-item {
      margin-bottom: 2rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid var(--border-color);
      position: relative;
    }
    
    .timeline-item:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }
    
    .timeline-item::before {
      content: '';
      position: absolute;
      left: -2rem;
      top: 0.5rem;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background-color: var(--primary-color);
      display: none;
    }
    
    @media (min-width: 768px) {
      .timeline {
        position: relative;
        padding-left: 2rem;
      }
      
      .timeline::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 2px;
        background-color: var(--border-color);
      }
      
      .timeline-item::before {
        display: block;
      }
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
      transition: transform 0.3s, box-shadow 0.3s;
    }
    
    .skill-item:hover {
      transform: translateY(-3px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
      transition: width 1s ease;
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
    
    @keyframes fadeInDown {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
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
      <div class="content">
        <h1>${resumeData.personalInfo.name}</h1>
        <p class="title">${resumeData.personalInfo.title}</p>
        <div class="contact-info">
          <p>${resumeData.personalInfo.email}</p>
          ${resumeData.personalInfo.phone ? `<p>${resumeData.personalInfo.phone}</p>` : ""}
          ${resumeData.personalInfo.location ? `<p>${resumeData.personalInfo.location}</p>` : ""}
          ${resumeData.personalInfo.website ? `<p><a href="${resumeData.personalInfo.website}">${resumeData.personalInfo.website}</a></p>` : ""}
        </div>
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

  <script>
    // Simple animation to reveal skill levels on scroll
    document.addEventListener('DOMContentLoaded', function() {
      const skillLevels = document.querySelectorAll('.skill-level');
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      
      skillLevels.forEach(skill => {
        observer.observe(skill);
      });
    });
  </script>
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
      position: relative;
      overflow: hidden;
    }
    
    .sidebar::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, transparent 0%, rgba(0, 0, 0, 0.03) 100%);
      z-index: 1;
    }
    
    .sidebar > * {
      position: relative;
      z-index: 2;
    }
    
    .main-content {
      width: 70%;
      padding: 2rem;
    }
    
    .profile {
      text-align: center;
      margin-bottom: 2rem;
      animation: fadeIn 1s ease-out;
    }
    
    .profile-image {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      object-fit: cover;
      margin: 0 auto 1rem;
      border: 3px solid var(--primary-color);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s, box-shadow 0.3s;
    }
    
    .profile-image:hover {
      transform: scale(1.05);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
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
      animation: fadeIn 1s ease-out 0.3s forwards;
      opacity: 0;
    }
    
    .contact-info h2 {
      font-size: 1.4rem;
      margin-bottom: 1rem;
      color: var(--primary-color);
      border-bottom: 2px solid var(--border-color);
      padding-bottom: 0.5rem;
      position: relative;
    }
    
    .contact-info h2::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 50px;
      height: 2px;
      background-color: var(--primary-color);
    }
    
    .contact-item {
      display: flex;
      align-items: center;
      margin-bottom: 0.75rem;
      transition: transform 0.3s;
    }
    
    .contact-item:hover {
      transform: translateX(5px);
    }
    
    .contact-item .icon {
      width: 20px;
      margin-right: 0.75rem;
      color: var(--primary-color);
    }
    
    .section {
      margin-bottom: 2.5rem;
      animation: fadeIn 1s ease-out;
    }
    
    .section h2 {
      font-size: 1.6rem;
      margin-bottom: 1.5rem;
      color: var(--primary-color);
      border-bottom: 2px solid var(--border-color);
      padding-bottom: 0.5rem;
      position: relative;
    }
    
    .section h2::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 50px;
      height: 2px;
      background-color: var(--primary-color);
    }
    
    .experience-item, .education-item {
      margin-bottom: 1.5rem;
      padding: 1.5rem;
      border-radius: 8px;
      background-color: #f9fafb;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      transition: transform 0.3s, box-shadow 0.3s;
    }
    
    .experience-item:hover, .education-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
    
    .experience-item h3, .education-item h3 {
      font-size: 1.3rem;
      margin-bottom: 0.25rem;
      color: var(--text-color);
    }
    
    .company, .institution {
      font-weight: 500;
      color: var(--secondary-color);
    }
    
    .date {
      font-size: 0.9rem;
      color: #6b7280;
      margin-bottom: 0.75rem;
      display: inline-block;
      padding: 0.25rem 0.5rem;
      background-color: var(--primary-color);
      color: white;
      border-radius: 4px;
      margin-top: 0.5rem;
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
      animation: fadeIn 1s ease-out 0.6s forwards;
      opacity: 0;
    }
    
    .skill-tag {
      background-color: var(--primary-color);
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.9rem;
      transition: transform 0.3s, box-shadow 0.3s;
    }
    
    .skill-tag:hover {
      transform: translateY(-3px);
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
    }
    
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
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
          (exp, index) => `
      <div class="experience-item" style="animation: fadeIn 1s ease-out ${0.3 + index * 0.2}s forwards; opacity: 0;">
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
          (edu, index) => `
      <div class="education-item" style="animation: fadeIn 1s ease-out ${0.3 + index * 0.2}s forwards; opacity: 0;">
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
          (project, index) => `
      <div class="experience-item" style="animation: fadeIn 1s ease-out ${0.3 + index * 0.2}s forwards; opacity: 0;">
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
          (cert, index) => `
      <div class="experience-item" style="animation: fadeIn 1s ease-out ${0.3 + index * 0.2}s forwards; opacity: 0;">
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
      --primary-color: ${primaryColor};-secondary-color: ${secondaryColor};
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
      background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='white' fillOpacity='0.1' fillRule='evenodd'/%3E%3C/svg%3E");
      z-index: 1;
    }
    
    .hero-content {
      position: relative;
      z-index: 2;
      max-width: 800px;
      padding: 0 2rem;
    }
    
    .hero h1 {
      font-size: 3.5rem;
      margin-bottom: 1rem;
      animation: fadeInDown 1s ease-out;
    }
    
    .hero p {
      font-size: 1.5rem;
      margin-bottom: 2rem;
      opacity: 0.9;
      animation: fadeInUp 1s ease-out 0.3s forwards;
      opacity: 0;
    }
    
    .hero-image {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      object-fit: cover;
      border: 4px solid white;
      margin-bottom: 2rem;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      animation: fadeIn 1s ease-out;
    }
    
    .contact-links {
      display: flex;
      justify-content: center;
      gap: 1.5rem;
      margin-top: 2rem;
      animation: fadeInUp 1s ease-out 0.6s forwards;
      opacity: 0;
    }
    
    .contact-links a {
      color: white;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border-radius: 30px;
      background-color: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(5px);
      transition: all 0.3s;
    }
    
    .contact-links a:hover {
      background-color: rgba(255, 255, 255, 0.2);
      transform: translateY(-3px);
    }
    
    .main-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 4rem 2rem;
    }
    
    .section {
      margin-bottom: 5rem;
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 1s, transform 1s;
    }
    
    .section.visible {
      opacity: 1;
      transform: translateY(0);
    }
    
    .section-title {
      font-size: 2.5rem;
      margin-bottom: 2rem;
      color: var(--primary-color);
      position: relative;
      display: inline-block;
    }
    
    .section-title::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 0;
      width: 50px;
      height: 4px;
      background-color: var(--primary-color);
    }
    
    .about-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      align-items: center;
    }
    
    .about-image {
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }
    
    .about-image img {
      width: 100%;
      height: auto;
      display: block;
      transition: transform 0.5s;
    }
    
    .about-image:hover img {
      transform: scale(1.05);
    }
    
    .experience-grid, .education-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 2rem;
    }
    
    .experience-card, .education-card {
      background-color: var(--section-bg-color);
      border-radius: 10px;
      padding: 2rem;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
      transition: transform 0.3s, box-shadow 0.3s;
      position: relative;
      overflow: hidden;
    }
    
    .experience-card::before, .education-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 5px;
      height: 100%;
      background-color: var(--primary-color);
    }
    
    .experience-card:hover, .education-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
    }
    
    .card-title {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
      color: var(--text-color);
    }
    
    .card-subtitle {
      font-size: 1.1rem;
      color: var(--primary-color);
      margin-bottom: 1rem;
    }
    
    .card-date {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      background-color: var(--primary-color);
      color: white;
      border-radius: 20px;
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }
    
    .skills-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 2rem;
    }
    
    .skill-category {
      background-color: var(--section-bg-color);
      border-radius: 10px;
      padding: 2rem;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    }
    
    .skill-category h3 {
      font-size: 1.3rem;
      margin-bottom: 1.5rem;
      color: var(--primary-color);
    }
    
    .skill-item {
      margin-bottom: 1rem;
    }
    
    .skill-name {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }
    
    .skill-bar {
      height: 8px;
      background-color: #e5e7eb;
      border-radius: 4px;
      overflow: hidden;
    }
    
    .skill-progress {
      height: 100%;
      background-color: var(--primary-color);
      border-radius: 4px;
      width: 0;
      transition: width 1s ease;
    }
    
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
    }
    
    .project-card {
      background-color: var(--section-bg-color);
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
      transition: transform 0.3s, box-shadow 0.3s;
    }
    
    .project-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
    }
    
    .project-image {
      height: 200px;
      overflow: hidden;
    }
    
    .project-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s;
    }
    
    .project-card:hover .project-image img {
      transform: scale(1.1);
    }
    
    .project-content {
      padding: 1.5rem;
    }
    
    .project-title {
      font-size: 1.3rem;
      margin-bottom: 0.5rem;
      color: var(--text-color);
    }
    
    .project-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 1rem;
    }
    
    .project-tag {
      padding: 0.25rem 0.5rem;
      background-color: var(--primary-color);
      color: white;
      border-radius: 4px;
      font-size: 0.8rem;
    }
    
    .project-link {
      display: inline-block;
      margin-top: 1rem;
      color: var(--primary-color);
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s;
    }
    
    .project-link:hover {
      color: var(--secondary-color);
    }
    
    footer {
      background-color: var(--primary-color);
      color: white;
      padding: 3rem 0;
      text-align: center;
    }
    
    .footer-content {
      max-width: 800px;
      margin: 0 auto;
      padding: 0 2rem;
    }
    
    .footer-title {
      font-size: 2rem;
      margin-bottom: 1rem;
    }
    
    .footer-text {
      margin-bottom: 2rem;
      opacity: 0.9;
    }
    
    .footer-links {
      display: flex;
      justify-content: center;
      gap: 1.5rem;
      margin-top: 2rem;
    }
    
    .footer-links a {
      color: white;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border-radius: 30px;
      background-color: rgba(255, 255, 255, 0.1);
      transition: all 0.3s;
    }
    
    .footer-links a:hover {
      background-color: rgba(255, 255, 255, 0.2);
      transform: translateY(-3px);
    }
    
    .copyright {
      margin-top: 3rem;
      font-size: 0.9rem;
      opacity: 0.7;
    }
    
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    
    @keyframes fadeInDown {
      from {
        opacity: 0;
        transform: translateY(-30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @media (max-width: 768px) {
      .hero h1 {
        font-size: 2.5rem;
      }
      
      .hero p {
        font-size: 1.2rem;
      }
      
      .about-content {
        grid-template-columns: 1fr;
      }
      
      .experience-grid, .education-grid, .skills-container, .projects-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <section class="hero">
    <div class="hero-content">
      ${
        resumeData.personalInfo.profileImage
          ? `<img src="${resumeData.personalInfo.profileImage}" alt="${resumeData.personalInfo.name}" class="hero-image">`
          : `<div class="hero-image" style="background-color: var(--primary-color); display: flex; align-items: center; justify-content: center; color: white; font-size: 3rem;">${resumeData.personalInfo.name.charAt(0)}</div>`
      }
      <h1>${resumeData.personalInfo.name}</h1>
      <p>${resumeData.personalInfo.title}</p>
      
      <div class="contact-links">
        <a href="mailto:${resumeData.personalInfo.email}">
          <span>📧</span> Email
        </a>
        ${
          resumeData.personalInfo.phone
            ? `
        <a href="tel:${resumeData.personalInfo.phone}">
          <span>📱</span> Phone
        </a>
        `
            : ""
        }
        ${
          resumeData.personalInfo.website
            ? `
        <a href="${resumeData.personalInfo.website}" target="_blank">
          <span>🌐</span> Website
        </a>
        `
            : ""
        }
      </div>
    </div>
  </section>
  
  <main class="main-content">
    ${
      resumeData.personalInfo.summary
        ? `
    <section id="about" class="section">
      <h2 class="section-title">About Me</h2>
      <div class="about-content">
        <div>
          <p>${resumeData.personalInfo.summary}</p>
        </div>
        <div class="about-image">
          <img src="https://source.unsplash.com/random/600x400/?professional" alt="About me">
        </div>
      </div>
    </section>
    `
        : ""
    }
    
    <section id="experience" class="section">
      <h2 class="section-title">Experience</h2>
      <div class="experience-grid">
        ${resumeData.experience
          .map(
            (exp) => `
        <div class="experience-card">
          <h3 class="card-title">${exp.position}</h3>
          <p class="card-subtitle">${exp.company}</p>
          <span class="card-date">${exp.startDate} - ${exp.endDate || "Present"}</span>
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
    
    <section id="skills" class="section">
      <h2 class="section-title">Skills</h2>
      <div class="skills-container">
        <div class="skill-category">
          <h3>Technical Skills</h3>
          ${resumeData.skills
            .map(
              (skill) => `
          <div class="skill-item">
            <div class="skill-name">
              <span>${skill.name}</span>
              ${skill.level ? `<span>${skill.level}/5</span>` : ""}
            </div>
            ${
              skill.level
                ? `
            <div class="skill-bar">
              <div class="skill-progress" style="width: ${skill.level * 20}%;"></div>
            </div>
            `
                : ""
            }
          </div>
          `,
            )
            .join("")}
        </div>
        
        ${
          resumeData.languages && resumeData.languages.length > 0
            ? `
        <div class="skill-category">
          <h3>Languages</h3>
          ${resumeData.languages
            .map(
              (lang) => `
          <div class="skill-item">
            <div class="skill-name">
              <span>${lang.language}</span>
              ${lang.proficiency ? `<span>${lang.proficiency}</span>` : ""}
            </div>
          </div>
          `,
            )
            .join("")}
        </div>
        `
            : ""
        }
      </div>
    </section>
    
    <section id="education" class="section">
      <h2 class="section-title">Education</h2>
      <div class="education-grid">
        ${resumeData.education
          .map(
            (edu) => `
        <div class="education-card">
          <h3 class="card-title">${edu.degree}${edu.field ? `, ${edu.field}` : ""}</h3>
          <p class="card-subtitle">${edu.institution}</p>
          <span class="card-date">${edu.startDate} - ${edu.endDate || "Present"}</span>
          ${edu.description ? `<p>${edu.description}</p>` : ""}
        </div>
        `,
          )
          .join("")}
      </div>
    </section>
    
    ${
      resumeData.projects && resumeData.projects.length > 0
        ? `
    <section id="projects" class="section">
      <h2 class="section-title">Projects</h2>
      <div class="projects-grid">
        ${resumeData.projects
          .map(
            (project) => `
        <div class="project-card">
          <div class="project-image">
            <img src="https://source.unsplash.com/random/600x400/?project" alt="${project.name}">
          </div>
          <div class="project-content">
            <h3 class="project-title">${project.name}</h3>
            <p>${project.description}</p>
            ${
              project.highlights && project.highlights.length > 0
                ? `
            <div class="project-tags">
              ${project.highlights.map((highlight) => `<span class="project-tag">${highlight}</span>`).join("")}
            </div>
            `
                : ""
            }
            ${project.url ? `<a href="${project.url}" class="project-link" target="_blank">View Project</a>` : ""}
          </div>
        </div>
        `,
          )
          .join("")}
      </div>
    </section>
    `
        : ""
    }
  </main>
  
  <footer>
    <div class="footer-content">
      <h2 class="footer-title">Get In Touch</h2>
      <p class="footer-text">Feel free to reach out for collaborations or just a friendly hello!</p>
      
      <div class="footer-links">
        <a href="mailto:${resumeData.personalInfo.email}">
          <span>📧</span> Email
        </a>
        ${
          resumeData.personalInfo.phone
            ? `
        <a href="tel:${resumeData.personalInfo.phone}">
          <span>📱</span> Phone
        </a>
        `
            : ""
        }
        ${
          resumeData.personalInfo.website
            ? `
        <a href="${resumeData.personalInfo.website}" target="_blank">
          <span>🌐</span> Website
        </a>
        `
            : ""
        }
      </div>
      
      <p class="copyright">&copy; ${new Date().getFullYear()} ${resumeData.personalInfo.name}. All rights reserved.</p>
    </div>
  </footer>

  <script>
    // Reveal sections on scroll
    document.addEventListener('DOMContentLoaded', function() {
      const sections = document.querySelectorAll('.section');
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      }, { threshold: 0.1 });
      
      sections.forEach(section => {
        observer.observe(section);
      });
      
      // Initialize skill bars
      const skillBars = document.querySelectorAll('.skill-progress');
      setTimeout(() => {
        skillBars.forEach(bar => {
          bar.style.width = bar.parentElement.getAttribute('data-width') || bar.style.width;
        });
      }, 500);
    });
  </script>
</body>
</html>
      `
      break
  }

  return html
}
