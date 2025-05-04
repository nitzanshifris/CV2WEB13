"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/glassmorphism/glass-card"
import { ScrollReveal } from "@/components/scroll-reveal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Eye, AlertTriangle, Check, X, Loader2, Lightbulb, Accessibility, Sparkles, Zap } from "lucide-react"

interface AccessibilityCheckerProps {
  websiteId: string
  onFix: (issueId: string, fix: string) => Promise<void>
}

interface AccessibilityIssue {
  id: string
  type: "error" | "warning" | "info"
  title: string
  description: string
  impact: "high" | "medium" | "low"
  location: string
  wcag?: string
  autoFixable: boolean
  fixed?: boolean
  fixing?: boolean
}

export function AccessibilityChecker({ websiteId, onFix }: AccessibilityCheckerProps) {
  const [activeTab, setActiveTab] = useState("issues")
  const [isScanning, setIsScanning] = useState(false)
  const [scanComplete, setScanComplete] = useState(false)
  const [accessibilityScore, setAccessibilityScore] = useState(78)
  const [issues, setIssues] = useState<AccessibilityIssue[]>([
    {
      id: "issue-1",
      type: "error",
      title: "Missing alt text on images",
      description: "5 images on your website are missing alternative text, which is essential for screen readers.",
      impact: "high",
      location: "Home page, About section",
      wcag: "1.1.1 Non-text Content (Level A)",
      autoFixable: true,
      fixed: false,
    },
    {
      id: "issue-2",
      type: "error",
      title: "Insufficient color contrast",
      description: "The text color against the background doesn't meet the minimum contrast ratio of 4.5:1.",
      impact: "high",
      location: "Contact section",
      wcag: "1.4.3 Contrast (Minimum) (Level AA)",
      autoFixable: true,
      fixed: false,
    },
    {
      id: "issue-3",
      type: "warning",
      title: "Missing form labels",
      description: "Form fields in the contact form don't have associated labels.",
      impact: "medium",
      location: "Contact form",
      wcag: "3.3.2 Labels or Instructions (Level A)",
      autoFixable: true,
      fixed: false,
    },
    {
      id: "issue-4",
      type: "warning",
      title: "Heading hierarchy is not sequential",
      description: "Headings should follow a proper hierarchy (H1, H2, H3, etc.) without skipping levels.",
      impact: "medium",
      location: "Projects section",
      wcag: "1.3.1 Info and Relationships (Level A)",
      autoFixable: false,
      fixed: false,
    },
    {
      id: "issue-5",
      type: "info",
      title: "Consider adding keyboard shortcuts",
      description: "Adding keyboard shortcuts can improve navigation for keyboard-only users.",
      impact: "low",
      location: "Global",
      autoFixable: false,
      fixed: false,
    },
  ])
  const [autoFixEnabled, setAutoFixEnabled] = useState(true)
  const [highContrastMode, setHighContrastMode] = useState(false)
  const [largeTextMode, setLargeTextMode] = useState(false)
  const [keyboardNavigationMode, setKeyboardNavigationMode] = useState(false)

  // Function to start accessibility scan
  const startScan = () => {
    setIsScanning(true)
    setScanComplete(false)

    // Simulate API call with timeout
    setTimeout(() => {
      setIsScanning(false)
      setScanComplete(true)
      // Reset fixed status for demo purposes
      setIssues(issues.map((issue) => ({ ...issue, fixed: false })))
      calculateScore()
    }, 2500)
  }

  // Function to fix an issue
  const fixIssue = async (issueId: string) => {
    // Find the issue
    const issueIndex = issues.findIndex((issue) => issue.id === issueId)
    if (issueIndex === -1) return

    // Update issue status to fixing
    const updatedIssues = [...issues]
    updatedIssues[issueIndex] = { ...updatedIssues[issueIndex], fixing: true }
    setIssues(updatedIssues)

    try {
      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Update issue status to fixed
      updatedIssues[issueIndex] = { ...updatedIssues[issueIndex], fixing: false, fixed: true }
      setIssues(updatedIssues)

      // Recalculate score
      calculateScore()

      // Call the onFix callback
      await onFix(issueId, "auto-fix")
    } catch (error) {
      console.error("Error fixing issue:", error)

      // Reset fixing status
      updatedIssues[issueIndex] = { ...updatedIssues[issueIndex], fixing: false }
      setIssues(updatedIssues)
    }
  }

  // Function to fix all auto-fixable issues
  const fixAllAutoFixable = async () => {
    // Get all auto-fixable issues that aren't fixed yet
    const autoFixableIssues = issues.filter((issue) => issue.autoFixable && !issue.fixed)

    // Update all issues to fixing status
    const updatedIssues = [...issues]
    autoFixableIssues.forEach((issue) => {
      const issueIndex = issues.findIndex((i) => i.id === issue.id)
      updatedIssues[issueIndex] = { ...updatedIssues[issueIndex], fixing: true }
    })
    setIssues(updatedIssues)

    try {
      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 2500))

      // Update all issues to fixed status
      autoFixableIssues.forEach((issue) => {
        const issueIndex = issues.findIndex((i) => i.id === issue.id)
        updatedIssues[issueIndex] = { ...updatedIssues[issueIndex], fixing: false, fixed: true }
      })
      setIssues(updatedIssues)

      // Recalculate score
      calculateScore()
    } catch (error) {
      console.error("Error fixing issues:", error)

      // Reset fixing status
      autoFixableIssues.forEach((issue) => {
        const issueIndex = issues.findIndex((i) => i.id === issue.id)
        updatedIssues[issueIndex] = { ...updatedIssues[issueIndex], fixing: false }
      })
      setIssues(updatedIssues)
    }
  }

  // Function to calculate accessibility score
  const calculateScore = () => {
    // Count fixed issues
    const fixedCount = issues.filter((issue) => issue.fixed).length
    const totalIssues = issues.length

    // Calculate score based on fixed issues and their impact
    const baseScore = 60 // Starting score
    const fixedScore = Math.round((fixedCount / totalIssues) * 40) // Up to 40 points for fixing issues

    setAccessibilityScore(baseScore + fixedScore)
  }

  // Function to get issue icon
  const getIssueIcon = (type: "error" | "warning" | "info") => {
    switch (type) {
      case "error":
        return <X className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "info":
        return <Lightbulb className="h-5 w-5 text-blue-500" />
    }
  }

  // Function to get impact badge
  const getImpactBadge = (impact: "high" | "medium" | "low") => {
    switch (impact) {
      case "high":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            High
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            Medium
          </Badge>
        )
      case "low":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            Low
          </Badge>
        )
    }
  }

  // Function to get score color
  const getScoreColor = (score: number) => {
    if (score < 70) return "text-red-500"
    if (score < 90) return "text-yellow-500"
    return "text-green-500"
  }

  // Function to get progress color
  const getProgressColor = (score: number) => {
    if (score < 70) return "bg-red-500"
    if (score < 90) return "bg-yellow-500"
    return "bg-green-500"
  }

  return (
    <ScrollReveal>
      <GlassCard className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Accessibility Checker</h2>
          <Button onClick={startScan} disabled={isScanning}>
            {isScanning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scanning...
              </>
            ) : (
              "Scan Website"
            )}
          </Button>
        </div>

        {scanComplete && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium">Accessibility Score</h3>
              <div className="flex items-baseline">
                <span className={`text-2xl font-bold ${getScoreColor(accessibilityScore)}`}>{accessibilityScore}</span>
                <span className="text-sm text-muted-foreground ml-1">/100</span>
              </div>
            </div>
            <Progress value={accessibilityScore} className={getProgressColor(accessibilityScore)} />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Needs Improvement</span>
              <span>Good</span>
              <span>Excellent</span>
            </div>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="issues" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span>Issues</span>
            </TabsTrigger>
            <TabsTrigger value="tools" className="flex items-center gap-2">
              <Accessibility className="h-4 w-4" />
              <span>Tools</span>
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              <span>Recommendations</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="issues">
            <div className="space-y-6">
              {!scanComplete && !isScanning ? (
                <div className="text-center py-8">
                  <Accessibility className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Ready to check accessibility</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Click the "Scan Website" button to analyze your website for accessibility issues.
                  </p>
                </div>
              ) : isScanning ? (
                <div className="text-center py-8">
                  <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
                  <h3 className="text-lg font-medium mb-2">Scanning your website...</h3>
                  <p className="text-sm text-muted-foreground">
                    This will only take a moment. We're checking for common accessibility issues.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Auto-fix issues when possible</span>
                      <Switch checked={autoFixEnabled} onCheckedChange={setAutoFixEnabled} />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={fixAllAutoFixable}
                      disabled={!autoFixEnabled || issues.filter((i) => i.autoFixable && !i.fixed).length === 0}
                    >
                      Fix All Auto-fixable Issues
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {issues.map((issue) => (
                      <div
                        key={issue.id}
                        className={`border rounded-md p-4 ${
                          issue.fixed ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            {issue.fixed ? <Check className="h-5 w-5 text-green-500" /> : getIssueIcon(issue.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium">{issue.title}</h4>
                              {getImpactBadge(issue.impact)}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{issue.description}</p>
                            <div className="flex items-center text-xs text-muted-foreground mt-2">
                              <span className="mr-3">Location: {issue.location}</span>
                              {issue.wcag && <span>WCAG: {issue.wcag}</span>}
                            </div>
                          </div>
                          {!issue.fixed && issue.autoFixable && autoFixEnabled && (
                            <Button size="sm" onClick={() => fixIssue(issue.id)} disabled={issue.fixing}>
                              {issue.fixing ? (
                                <>
                                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                  Fixing...
                                </>
                              ) : (
                                "Auto-fix"
                              )}
                            </Button>
                          )}
                          {!issue.fixed && !issue.autoFixable && (
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          )}
                          {issue.fixed && (
                            <Badge
                              variant="outline"
                              className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            >
                              Fixed
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="tools">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-4">Accessibility Tools</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Enable these tools to simulate how your website appears to users with different abilities.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <Label htmlFor="high-contrast" className="text-sm font-medium">
                        High Contrast Mode
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Increases contrast to make text more readable
                      </p>
                    </div>
                    <Switch id="high-contrast" checked={highContrastMode} onCheckedChange={setHighContrastMode} />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <Label htmlFor="large-text" className="text-sm font-medium">
                        Large Text Mode
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">Increases font size for better readability</p>
                    </div>
                    <Switch id="large-text" checked={largeTextMode} onCheckedChange={setLargeTextMode} />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <Label htmlFor="keyboard-navigation" className="text-sm font-medium">
                        Keyboard Navigation Mode
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Highlights focusable elements for keyboard users
                      </p>
                    </div>
                    <Switch
                      id="keyboard-navigation"
                      checked={keyboardNavigationMode}
                      onCheckedChange={setKeyboardNavigationMode}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-sm font-medium mb-4">Preview with Accessibility Tools</h3>

                <div className="border rounded-md p-4">
                  <div className="h-64 bg-muted/20 rounded-md flex items-center justify-center">
                    {highContrastMode || largeTextMode || keyboardNavigationMode ? (
                      <div className="text-center">
                        <p
                          className={`${largeTextMode ? "text-xl" : "text-base"} ${highContrastMode ? "text-black dark:text-white font-bold" : ""}`}
                        >
                          Preview with accessibility tools enabled
                        </p>
                        <div className="flex flex-wrap justify-center gap-2 mt-4">
                          {highContrastMode && (
                            <Badge variant="outline" className="bg-black text-white dark:bg-white dark:text-black">
                              High Contrast
                            </Badge>
                          )}
                          {largeTextMode && (
                            <Badge
                              variant="outline"
                              className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                            >
                              Large Text
                            </Badge>
                          )}
                          {keyboardNavigationMode && (
                            <Badge
                              variant="outline"
                              className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                            >
                              Keyboard Navigation
                            </Badge>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Enable tools to preview accessibility features</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-sm font-medium mb-4">Screen Reader Testing</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Test how your website sounds when read by a screen reader.
                </p>

                <Button className="w-full flex items-center justify-center gap-2">
                  <Eye className="h-4 w-4" />
                  Test with Screen Reader
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="recommendations">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-4">Accessibility Recommendations</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Follow these recommendations to improve your website's accessibility.
                </p>

                <div className="space-y-4">
                  <div className="p-4 border rounded-md">
                    <div className="flex items-start gap-3">
                      <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium">Use semantic HTML elements</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Use semantic HTML elements like &lt;header&gt;, &lt;nav&gt;, &lt;main&gt;, and &lt;footer&gt;
                          to provide better structure for screen readers.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-md">
                    <div className="flex items-start gap-3">
                      <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium">Ensure keyboard navigability</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Make sure all interactive elements are accessible via keyboard and have visible focus states.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-md">
                    <div className="flex items-start gap-3">
                      <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium">Add ARIA attributes when necessary</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Use ARIA attributes to enhance accessibility when HTML semantics aren't sufficient.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-md">
                    <div className="flex items-start gap-3">
                      <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium">Provide text alternatives for non-text content</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Add alt text to images and provide transcripts for audio and video content.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-md">
                    <div className="flex items-start gap-3">
                      <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium">Ensure sufficient color contrast</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Maintain a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-sm font-medium mb-4">Resources</h3>
                <div className="space-y-2">
                  <a href="#" className="flex items-center text-sm text-primary hover:underline">
                    <Zap className="h-4 w-4 mr-2" />
                    Web Content Accessibility Guidelines (WCAG)
                  </a>
                  <a href="#" className="flex items-center text-sm text-primary hover:underline">
                    <Zap className="h-4 w-4 mr-2" />
                    A11Y Project Checklist
                  </a>
                  <a href="#" className="flex items-center text-sm text-primary hover:underline">
                    <Zap className="h-4 w-4 mr-2" />
                    MDN Web Docs: Accessibility
                  </a>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </GlassCard>
    </ScrollReveal>
  )
}
