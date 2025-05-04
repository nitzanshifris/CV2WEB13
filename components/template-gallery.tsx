"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/glassmorphism/glass-card"
import { ScrollReveal } from "@/components/scroll-reveal"
import { TiltCard } from "@/components/tilt-card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Loader2, Search, Filter, Tag, ArrowRight, Crown, Heart } from "lucide-react"

interface TemplateGalleryProps {
  onSelectTemplate: (templateId: string) => void
  currentTemplateId?: string
}

interface Template {
  id: string
  name: string
  category: string
  tags: string[]
  imageUrl: string
  isPremium: boolean
  isNew: boolean
  isFavorite: boolean
  description: string
}

export function TemplateGallery({ onSelectTemplate, currentTemplateId }: TemplateGalleryProps) {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [filters, setFilters] = useState({
    showPremium: true,
    showFree: true,
    favorites: false,
  })

  // Sample template data
  const templates: Template[] = [
    {
      id: "professional",
      name: "Professional",
      category: "business",
      tags: ["clean", "corporate", "minimal"],
      imageUrl: "/placeholder.svg?key=2khkf",
      isPremium: false,
      isNew: false,
      isFavorite: true,
      description: "A clean, professional template perfect for corporate environments and traditional industries.",
    },
    {
      id: "creative",
      name: "Creative",
      category: "creative",
      tags: ["colorful", "modern", "artistic"],
      imageUrl: "/placeholder.svg?key=vfd0t",
      isPremium: false,
      isNew: false,
      isFavorite: false,
      description: "A vibrant, eye-catching template designed for creative professionals and artists.",
    },
    {
      id: "minimal",
      name: "Minimal",
      category: "minimal",
      tags: ["simple", "clean", "elegant"],
      imageUrl: "/placeholder.svg?key=9t24m",
      isPremium: false,
      isNew: false,
      isFavorite: false,
      description: "A minimalist template with plenty of whitespace, focusing on content clarity.",
    },
    {
      id: "tech",
      name: "Tech Innovator",
      category: "tech",
      tags: ["modern", "tech", "dark mode"],
      imageUrl: "/placeholder.svg?key=nd0ei",
      isPremium: true,
      isNew: true,
      isFavorite: false,
      description: "A cutting-edge template for tech professionals with modern design elements and dark mode support.",
    },
    {
      id: "academic",
      name: "Academic",
      category: "education",
      tags: ["formal", "research", "detailed"],
      imageUrl: "/placeholder.svg?key=svsvb",
      isPremium: true,
      isNew: false,
      isFavorite: true,
      description:
        "A comprehensive template for academics, researchers, and educators with sections for publications and research.",
    },
    {
      id: "startup",
      name: "Startup Founder",
      category: "business",
      tags: ["modern", "bold", "entrepreneurial"],
      imageUrl: "/placeholder.svg?key=xhr6b",
      isPremium: true,
      isNew: true,
      isFavorite: false,
      description: "A bold template for entrepreneurs and startup founders highlighting achievements and vision.",
    },
    {
      id: "portfolio",
      name: "Portfolio Showcase",
      category: "creative",
      tags: ["gallery", "visual", "projects"],
      imageUrl: "/placeholder.svg?key=dhgfj",
      isPremium: true,
      isNew: false,
      isFavorite: false,
      description: "A visually-focused template with extensive portfolio sections for showcasing your work.",
    },
    {
      id: "consultant",
      name: "Consultant",
      category: "business",
      tags: ["professional", "service", "expertise"],
      imageUrl: "/placeholder.svg?height=300&width=400&query=consultant resume template with professional design",
      isPremium: false,
      isNew: true,
      isFavorite: true,
      description: "A trustworthy template for consultants and advisors emphasizing expertise and client results.",
    },
  ]

  // Filter templates based on active tab, search query, and filters
  const filteredTemplates = templates.filter((template) => {
    // Filter by tab/category
    if (activeTab !== "all" && template.category !== activeTab) return false

    // Filter by selected category dropdown
    if (selectedCategory !== "all" && template.category !== selectedCategory) return false

    // Filter by search query
    if (
      searchQuery &&
      !template.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) &&
      !template.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false

    // Filter by premium/free status
    if (!filters.showPremium && template.isPremium) return false
    if (!filters.showFree && !template.isPremium) return false

    // Filter by favorites
    if (filters.favorites && !template.isFavorite) return false

    return true
  })

  // Function to handle template selection
  const handleSelectTemplate = (templateId: string) => {
    setIsLoading(true)

    // Simulate loading
    setTimeout(() => {
      onSelectTemplate(templateId)
      setIsLoading(false)
    }, 800)
  }

  // Function to toggle favorite status
  const toggleFavorite = (templateId: string, event: React.MouseEvent) => {
    event.stopPropagation() // Prevent triggering the card click

    // In a real app, this would update the database
    console.log(`Toggling favorite status for template: ${templateId}`)
  }

  return (
    <ScrollReveal>
      <GlassCard className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Template Gallery</h2>
          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            {templates.length} Templates Available
          </Badge>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="md:w-3/4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="business">Business</TabsTrigger>
                <TabsTrigger value="creative">Creative</TabsTrigger>
                <TabsTrigger value="tech">Tech</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="minimal">Minimal</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="md:w-1/4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by category" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="creative">Creative</SelectItem>
                <SelectItem value="tech">Tech</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="minimal">Minimal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="show-premium"
              checked={filters.showPremium}
              onCheckedChange={(checked) => setFilters({ ...filters, showPremium: checked as boolean })}
            />
            <Label htmlFor="show-premium" className="text-sm">
              Premium
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="show-free"
              checked={filters.showFree}
              onCheckedChange={(checked) => setFilters({ ...filters, showFree: checked as boolean })}
            />
            <Label htmlFor="show-free" className="text-sm">
              Free
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="favorites"
              checked={filters.favorites}
              onCheckedChange={(checked) => setFilters({ ...filters, favorites: checked as boolean })}
            />
            <Label htmlFor="favorites" className="text-sm">
              Favorites
            </Label>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading template...</span>
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="text-center py-12 border rounded-md">
            <p className="text-muted-foreground mb-2">No templates found matching your criteria</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setActiveTab("all")
                setSelectedCategory("all")
                setFilters({ showPremium: true, showFree: true, favorites: false })
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <TiltCard
                key={template.id}
                maxTilt={5}
                className={`border rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  currentTemplateId === template.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => handleSelectTemplate(template.id)}
              >
                <div className="relative">
                  <img
                    src={template.imageUrl || "/placeholder.svg"}
                    alt={template.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-1">
                    {template.isPremium && (
                      <Badge className="bg-amber-500 hover:bg-amber-600">
                        <Crown className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                    {template.isNew && <Badge className="bg-green-500 hover:bg-green-600">New</Badge>}
                  </div>
                  <button
                    className="absolute top-2 left-2 p-1.5 bg-background/80 rounded-full hover:bg-background transition-colors"
                    onClick={(e) => toggleFavorite(template.id, e)}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        template.isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"
                      }`}
                    />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-medium">{template.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{template.description}</p>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {template.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-xs text-muted-foreground flex items-center">
                      <Tag className="h-3 w-3 mr-1" />
                      {template.category}
                    </span>
                    <Button size="sm" variant={currentTemplateId === template.id ? "default" : "outline"}>
                      {currentTemplateId === template.id ? "Selected" : "Select"}
                      {currentTemplateId !== template.id && <ArrowRight className="ml-1 h-3 w-3" />}
                    </Button>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        )}
      </GlassCard>
    </ScrollReveal>
  )
}
