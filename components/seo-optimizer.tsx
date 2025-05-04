"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/glassmorphism/glass-card"
import { ScrollReveal } from "@/components/scroll-reveal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Check, X, Search, Globe, Share2, AlertTriangle, Loader2 } from "lucide-react"

interface SeoOptimizerProps {
  initialData?: {
    title: string
    description: string
    keywords: string
    url: string
  }
  onUpdate: (data: {
    title: string
    description: string
    keywords: string
    url: string
  }) => void
}

export function SeoOptimizer({ initialData, onUpdate }: SeoOptimizerProps) {
  const [activeTab, setActiveTab] = useState("basics")
  const [title, setTitle] = useState(initialData?.title || "")
  const [description, setDescription] = useState(initialData?.description || "")
  const [keywords, setKeywords] = useState(initialData?.keywords || "")
  const [url, setUrl] = useState(initialData?.url || "")
  const [analyzing, setAnalyzing] = useState(false)
  const [results, setResults] = useState<{
    score: number
    suggestions: Array<{ type: "success" | "warning" | "error"; message: string }>
  } | null>(null)

  // Function to analyze SEO
  const analyzeSeo = () => {
    setAnalyzing(true)

    // Simulate API call with timeout
    setTimeout(() => {
      const suggestions: Array<{ type: "success" | "warning" | "error"; message: string }> = []
      let score = 0

      // Title analysis
      if (title.length === 0) {
        suggestions.push({
          type: "error",
          message: "Title is missing. Add a descriptive title for your page.",
        })
      } else if (title.length < 30) {
        suggestions.push({
          type: "warning",
          message: `Title is too short (${title.length} characters). Aim for 50-60 characters.`,
        })
        score += 5
      } else if (title.length > 60) {
        suggestions.push({
          type: "warning",
          message: `Title is too long (${title.length} characters). Keep it under 60 characters.`,
        })
        score += 5
      } else {
        suggestions.push({
          type: "success",
          message: `Title length is optimal (${title.length} characters).`,
        })
        score += 10
      }

      // Description analysis
      if (description.length === 0) {
        suggestions.push({
          type: "error",
          message: "Meta description is missing. Add a compelling description.",
        })
      } else if (description.length < 120) {
        suggestions.push({
          type: "warning",
          message: `Description is too short (${description.length} characters). Aim for 150-160 characters.`,
        })
        score += 5
      } else if (description.length > 160) {
        suggestions.push({
          type: "warning",
          message: `Description is too long (${description.length} characters). Keep it under 160 characters.`,
        })
        score += 5
      } else {
        suggestions.push({
          type: "success",
          message: `Description length is optimal (${description.length} characters).`,
        })
        score += 10
      }

      // Keywords analysis
      if (keywords.length === 0) {
        suggestions.push({
          type: "warning",
          message: "Keywords are missing. Add relevant keywords for better SEO.",
        })
      } else {
        const keywordCount = keywords.split(",").filter((k) => k.trim().length > 0).length
        if (keywordCount < 3) {
          suggestions.push({
            type: "warning",
            message: `Only ${keywordCount} keywords found. Consider adding more relevant keywords.`,
          })
          score += 5
        } else if (keywordCount > 10) {
          suggestions.push({
            type: "warning",
            message: `Too many keywords (${keywordCount}). Focus on 5-7 most relevant keywords.`,
          })
          score += 5
        } else {
          suggestions.push({
            type: "success",
            message: `Good number of keywords (${keywordCount}).`,
          })
          score += 10
        }
      }

      // URL analysis
      if (url.length === 0) {
        suggestions.push({
          type: "warning",
          message: "URL is not set. Consider adding a custom URL for better SEO.",
        })
      } else if (url.includes(" ")) {
        suggestions.push({
          type: "error",
          message: "URL contains spaces. Replace spaces with hyphens.",
        })
      } else if (url.length > 75) {
        suggestions.push({
          type: "warning",
          message: "URL is too long. Keep URLs concise for better SEO.",
        })
        score += 5
      } else {
        suggestions.push({
          type: "success",
          message: "URL format looks good.",
        })
        score += 10
      }

      // Content analysis (simulated)
      if (title && description) {
        const titleWords = title.toLowerCase().split(" ")
        const descWords = description.toLowerCase().split(" ")
        const commonWords = titleWords.filter((word) => descWords.includes(word) && word.length > 3)

        if (commonWords.length > 0) {
          suggestions.push({
            type: "success",
            message: `Good keyword consistency between title and description.`,
          })
          score += 10
        } else {
          suggestions.push({
            type: "warning",
            message: "Title and description don't share common keywords. Consider improving keyword consistency.",
          })
          score += 5
        }
      }

      // Calculate final score (max 50)
      score = Math.min(Math.max(score, 0), 50)

      // Add general suggestions based on score
      if (score < 20) {
        suggestions.push({
          type: "error",
          message: "Your SEO needs significant improvement. Follow the suggestions above.",
        })
      } else if (score < 35) {
        suggestions.push({
          type: "warning",
          message: "Your SEO is average. Implement the suggestions to improve your ranking.",
        })
      } else {
        suggestions.push({
          type: "success",
          message: "Your SEO is good! Keep optimizing for even better results.",
        })
      }

      setResults({ score, suggestions })
      setAnalyzing(false)
    }, 1500)
  }

  // Function to save changes
  const saveChanges = () => {
    onUpdate({
      title,
      description,
      keywords,
      url,
    })
  }

  // Function to get score color
  const getScoreColor = (score: number) => {
    if (score < 20) return "text-red-500"
    if (score < 35) return "text-yellow-500"
    return "text-green-500"
  }

  // Function to get progress color
  const getProgressColor = (score: number) => {
    if (score < 20) return "bg-red-500"
    if (score < 35) return "bg-yellow-500"
    return "bg-green-500"
  }

  return (
    <ScrollReveal>
      <GlassCard className="p-6">
        <h2 className="text-xl font-bold mb-4">SEO Optimizer</h2>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="basics" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span>Basics</span>
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>Preview</span>
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              <span>Analysis</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basics">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Page Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter page title (50-60 characters recommended)"
                  maxLength={70}
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-muted-foreground">
                    {title.length > 0 && (
                      <>
                        {title.length < 30 && "Too short"}
                        {title.length >= 30 && title.length <= 60 && "Optimal length"}
                        {title.length > 60 && "Too long"}
                      </>
                    )}
                  </span>
                  <span className="text-xs text-muted-foreground">{title.length}/70</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Meta Description</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter meta description (150-160 characters recommended)"
                  maxLength={200}
                  rows={3}
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-muted-foreground">
                    {description.length > 0 && (
                      <>
                        {description.length < 120 && "Too short"}
                        {description.length >= 120 && description.length <= 160 && "Optimal length"}
                        {description.length > 160 && "Too long"}
                      </>
                    )}
                  </span>
                  <span className="text-xs text-muted-foreground">{description.length}/200</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Keywords</label>
                <Input
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="Enter keywords separated by commas (5-7 recommended)"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Example: resume builder, cv generator, professional resume
                </p>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Custom URL</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                    yoursite.com/
                  </span>
                  <Input
                    value={url}
                    onChange={(e) => setUrl(e.target.value.replace(/\s+/g, "-").toLowerCase())}
                    placeholder="your-custom-url"
                    className="rounded-l-none"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Use hyphens instead of spaces. Keep it short and relevant.
                </p>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setActiveTab("preview")}>
                  Preview
                </Button>
                <Button onClick={saveChanges}>Save Changes</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview">
            <div className="space-y-6">
              <div className="border rounded-md p-4">
                <h3 className="text-sm font-medium mb-4">Google Search Preview</h3>
                <div className="space-y-2">
                  <div className="text-blue-600 text-xl hover:underline cursor-pointer truncate">
                    {title || "Page Title"}
                  </div>
                  <div className="text-green-700 text-sm">yoursite.com/{url || "page-url"}</div>
                  <div className="text-gray-600 text-sm line-clamp-2">
                    {description ||
                      "Meta description will appear here. Make sure to add a compelling description that summarizes your page content."}
                  </div>
                </div>
              </div>

              <div className="border rounded-md p-4">
                <h3 className="text-sm font-medium mb-4">Social Media Preview</h3>
                <div className="border rounded-md overflow-hidden">
                  <div className="bg-gray-100 h-40 flex items-center justify-center text-gray-400">Featured Image</div>
                  <div className="p-4">
                    <div className="font-medium truncate">{title || "Page Title"}</div>
                    <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {description || "Meta description will appear here."}
                    </div>
                    <div className="text-xs text-gray-400 mt-2">yoursite.com</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setActiveTab("basics")}>
                  Edit
                </Button>
                <Button onClick={() => setActiveTab("analysis")}>Analyze SEO</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analysis">
            <div className="space-y-6">
              {!results && !analyzing && (
                <div className="text-center py-8">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Ready to analyze your SEO</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Click the button below to analyze your SEO settings and get personalized recommendations.
                  </p>
                  <Button onClick={analyzeSeo}>Analyze SEO</Button>
                </div>
              )}

              {analyzing && (
                <div className="text-center py-8">
                  <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
                  <h3 className="text-lg font-medium mb-2">Analyzing your SEO...</h3>
                  <p className="text-sm text-muted-foreground">
                    This will only take a moment. We're checking your title, description, keywords, and more.
                  </p>
                </div>
              )}

              {results && !analyzing && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium">SEO Analysis Results</h3>
                    <div className="flex items-center">
                      <span className={`text-2xl font-bold ${getScoreColor(results.score)}`}>{results.score}</span>
                      <span className="text-sm text-muted-foreground ml-1">/50</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">SEO Score</span>
                      <span className="text-sm text-muted-foreground">{results.score}/50</span>
                    </div>
                    <Progress value={results.score * 2} className={getProgressColor(results.score)} />
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Suggestions</h4>
                    {results.suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-md flex items-start gap-3 ${
                          suggestion.type === "success"
                            ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                            : suggestion.type === "warning"
                              ? "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300"
                              : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                        }`}
                      >
                        {suggestion.type === "success" ? (
                          <Check className="h-5 w-5 mt-0.5 flex-shrink-0" />
                        ) : suggestion.type === "warning" ? (
                          <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                        ) : (
                          <X className="h-5 w-5 mt-0.5 flex-shrink-0" />
                        )}
                        <div>{suggestion.message}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end space-x-2 pt-6">
                    <Button variant="outline" onClick={() => setActiveTab("basics")}>
                      Edit SEO Settings
                    </Button>
                    <Button onClick={analyzeSeo}>Re-analyze</Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </GlassCard>
    </ScrollReveal>
  )
}
