"use client"

import { useState } from "react"
import type { ParsedResume } from "@/lib/resume-parser"
import type { WebsiteConfig } from "@/lib/website-generator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GlassCard } from "@/components/glassmorphism/glass-card"
import { GlassButton } from "@/components/glassmorphism/glass-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Check, Palette, Layout, Type, Settings } from "lucide-react"

interface WebsiteCustomizerProps {
  resumeData: ParsedResume
  initialConfig: Partial<WebsiteConfig>
  onConfigChange: (config: Partial<WebsiteConfig>) => void
}

export function WebsiteCustomizer({ resumeData, initialConfig, onConfigChange }: WebsiteCustomizerProps) {
  const [config, setConfig] = useState<Partial<WebsiteConfig>>(initialConfig)

  // Available color schemes
  const colorSchemes = [
    { id: "blue", name: "Blue", primary: "#3b82f6", secondary: "#1e40af" },
    { id: "purple", name: "Purple", primary: "#8b5cf6", secondary: "#6d28d9" },
    { id: "emerald", name: "Emerald", primary: "#10b981", secondary: "#059669" },
    { id: "amber", name: "Amber", primary: "#f59e0b", secondary: "#d97706" },
    { id: "rose", name: "Rose", primary: "#f43f5e", secondary: "#e11d48" },
  ]

  // Available fonts
  const fonts = [
    { id: "Inter, sans-serif", name: "Inter" },
    { id: "Poppins, sans-serif", name: "Poppins" },
    { id: "Roboto, sans-serif", name: "Roboto" },
    { id: "Montserrat, sans-serif", name: "Montserrat" },
    { id: "Open Sans, sans-serif", name: "Open Sans" },
  ]

  // Available sections
  const availableSections = [
    { id: "header", name: "Header", default: true },
    { id: "about", name: "About", default: true },
    { id: "experience", name: "Experience", default: true },
    { id: "education", name: "Education", default: true },
    { id: "skills", name: "Skills", default: true },
    { id: "projects", name: "Projects", default: true },
    { id: "certifications", name: "Certifications", default: true },
    { id: "languages", name: "Languages", default: true },
    { id: "contact", name: "Contact", default: true },
  ]

  // Handle config changes
  const handleConfigChange = (key: keyof WebsiteConfig, value: any) => {
    const newConfig = { ...config, [key]: value }
    setConfig(newConfig)
    onConfigChange(newConfig)
  }

  // Handle section toggle
  const handleSectionToggle = (sectionId: string, enabled: boolean) => {
    const currentSections = config.sections || availableSections.filter((s) => s.default).map((s) => s.id)
    let newSections: string[]

    if (enabled) {
      newSections = [...currentSections, sectionId]
    } else {
      newSections = currentSections.filter((id) => id !== sectionId)
    }

    handleConfigChange("sections", newSections)
  }

  // Check if a section is enabled
  const isSectionEnabled = (sectionId: string) => {
    const currentSections = config.sections || availableSections.filter((s) => s.default).map((s) => s.id)
    return currentSections.includes(sectionId)
  }

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4">Customize Your Website</h2>

      <Tabs defaultValue="design" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="design" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span>Design</span>
          </TabsTrigger>
          <TabsTrigger value="layout" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            <span>Layout</span>
          </TabsTrigger>
          <TabsTrigger value="typography" className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            <span>Typography</span>
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Advanced</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="design">
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold mb-4">Color Scheme</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              {colorSchemes.map((scheme) => (
                <div
                  key={scheme.id}
                  className={`cursor-pointer rounded-md overflow-hidden border-2 transition-all ${
                    config.colorScheme === scheme.id
                      ? "border-primary scale-105"
                      : "border-transparent hover:border-muted"
                  }`}
                  onClick={() => handleConfigChange("colorScheme", scheme.id)}
                >
                  <div
                    className="h-20"
                    style={{ background: `linear-gradient(135deg, ${scheme.primary}, ${scheme.secondary})` }}
                  ></div>
                  <div className="p-2 text-center bg-background">
                    <div className="flex items-center justify-center gap-2">
                      {config.colorScheme === scheme.id && <Check className="h-4 w-4 text-primary" />}
                      <span>{scheme.name}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="text-lg font-semibold mb-4">Template Style</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                className={`cursor-pointer rounded-md overflow-hidden border-2 transition-all ${
                  config.template === "minimal" ? "border-primary scale-105" : "border-transparent hover:border-muted"
                }`}
                onClick={() => handleConfigChange("template", "minimal")}
              >
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <div className="w-3/4 h-3/4 bg-background rounded-md p-2">
                    <div className="w-full h-1/4 bg-primary mb-2 rounded"></div>
                    <div className="w-full h-1/6 bg-muted mb-1 rounded"></div>
                    <div className="w-3/4 h-1/6 bg-muted rounded"></div>
                  </div>
                </div>
                <div className="p-2 text-center bg-background">
                  <div className="flex items-center justify-center gap-2">
                    {config.template === "minimal" && <Check className="h-4 w-4 text-primary" />}
                    <span>Minimal</span>
                  </div>
                </div>
              </div>

              <div
                className={`cursor-pointer rounded-md overflow-hidden border-2 transition-all ${
                  config.template === "professional"
                    ? "border-primary scale-105"
                    : "border-transparent hover:border-muted"
                }`}
                onClick={() => handleConfigChange("template", "professional")}
              >
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <div className="w-3/4 h-3/4 bg-background rounded-md p-2 flex">
                    <div className="w-1/3 h-full bg-primary/20 mr-2 rounded"></div>
                    <div className="w-2/3 h-full flex flex-col">
                      <div className="w-full h-1/4 bg-muted mb-2 rounded"></div>
                      <div className="w-full h-1/6 bg-muted mb-1 rounded"></div>
                      <div className="w-3/4 h-1/6 bg-muted rounded"></div>
                    </div>
                  </div>
                </div>
                <div className="p-2 text-center bg-background">
                  <div className="flex items-center justify-center gap-2">
                    {config.template === "professional" && <Check className="h-4 w-4 text-primary" />}
                    <span>Professional</span>
                  </div>
                </div>
              </div>

              <div
                className={`cursor-pointer rounded-md overflow-hidden border-2 transition-all ${
                  config.template === "creative" ? "border-primary scale-105" : "border-transparent hover:border-muted"
                }`}
                onClick={() => handleConfigChange("template", "creative")}
              >
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <div className="w-3/4 h-3/4 bg-background rounded-md p-2">
                    <div className="w-full h-1/3 bg-gradient-to-r from-primary to-secondary mb-2 rounded flex items-center justify-center">
                      <div className="w-1/2 h-1/2 bg-white/30 rounded"></div>
                    </div>
                    <div className="w-full h-1/6 bg-muted mb-1 rounded"></div>
                    <div className="w-3/4 h-1/6 bg-muted rounded"></div>
                  </div>
                </div>
                <div className="p-2 text-center bg-background">
                  <div className="flex items-center justify-center gap-2">
                    {config.template === "creative" && <Check className="h-4 w-4 text-primary" />}
                    <span>Creative</span>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </TabsContent>

        <TabsContent value="layout">
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold mb-4">Sections</h3>
            <div className="space-y-4">
              {availableSections.map((section) => (
                <div key={section.id} className="flex items-center justify-between">
                  <Label htmlFor={`section-${section.id}`} className="cursor-pointer">
                    {section.name}
                  </Label>
                  <Switch
                    id={`section-${section.id}`}
                    checked={isSectionEnabled(section.id)}
                    onCheckedChange={(checked) => handleSectionToggle(section.id, checked)}
                  />
                </div>
              ))}
            </div>
          </GlassCard>
        </TabsContent>

        <TabsContent value="typography">
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold mb-4">Font Family</h3>
            <div className="mb-6">
              <Select
                value={config.fontFamily || fonts[0].id}
                onValueChange={(value) => handleConfigChange("fontFamily", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a font" />
                </SelectTrigger>
                <SelectContent>
                  {fonts.map((font) => (
                    <SelectItem key={font.id} value={font.id}>
                      <span style={{ fontFamily: font.id }}>{font.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <h3 className="text-lg font-semibold mb-4">Font Preview</h3>
            <div className="space-y-4 p-4 bg-muted/20 rounded-md">
              <div style={{ fontFamily: config.fontFamily || fonts[0].id }}>
                <p className="text-3xl font-bold">Heading 1</p>
                <p className="text-2xl font-bold">Heading 2</p>
                <p className="text-xl font-bold">Heading 3</p>
                <p className="text-base mt-4">
                  This is a paragraph of text that demonstrates how the selected font looks in a body of text. The quick
                  brown fox jumps over the lazy dog.
                </p>
              </div>
            </div>
          </GlassCard>
        </TabsContent>

        <TabsContent value="advanced">
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold mb-4">Custom CSS</h3>
            <div className="mb-6">
              <Label htmlFor="custom-css" className="mb-2 block">
                Add custom CSS to further customize your website
              </Label>
              <textarea
                id="custom-css"
                className="w-full h-32 p-2 border rounded-md font-mono text-sm"
                placeholder="/* Add your custom CSS here */"
                value={(config.customizations?.css as string) || ""}
                onChange={(e) =>
                  handleConfigChange("customizations", { ...config.customizations, css: e.target.value })
                }
              ></textarea>
            </div>

            <h3 className="text-lg font-semibold mb-4">Meta Information</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="meta-title" className="mb-2 block">
                  Page Title
                </Label>
                <Input
                  id="meta-title"
                  placeholder="My Professional Website"
                  value={
                    (config.customizations?.metaTitle as string) ||
                    `${resumeData.personalInfo.name} - ${resumeData.personalInfo.title}`
                  }
                  onChange={(e) =>
                    handleConfigChange("customizations", { ...config.customizations, metaTitle: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="meta-description" className="mb-2 block">
                  Meta Description
                </Label>
                <Input
                  id="meta-description"
                  placeholder="Professional website showcasing my skills and experience"
                  value={
                    (config.customizations?.metaDescription as string) ||
                    `${resumeData.personalInfo.name} - ${resumeData.personalInfo.title}. Professional website showcasing skills and experience.`
                  }
                  onChange={(e) =>
                    handleConfigChange("customizations", { ...config.customizations, metaDescription: e.target.value })
                  }
                />
              </div>
            </div>
          </GlassCard>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex justify-end">
        <GlassButton onClick={() => onConfigChange(config)} className="gap-2">
          <Check className="h-4 w-4" />
          Apply Changes
        </GlassButton>
      </div>
    </div>
  )
}
