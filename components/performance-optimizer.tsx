"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/glassmorphism/glass-card"
import { ScrollReveal } from "@/components/scroll-reveal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Zap, ImageIcon, FileCode, Database, Globe, Loader2, Check, BarChart } from "lucide-react"

interface PerformanceOptimizerProps {
  websiteId: string
  onOptimize: (optimizationType: string) => Promise<void>
}

interface PerformanceMetric {
  name: string
  value: number
  target: number
  unit: string
  status: "good" | "needs-improvement" | "poor"
}

interface OptimizationIssue {
  id: string
  type: "critical" | "important" | "opportunity"
  title: string
  description: string
  impact: "high" | "medium" | "low"
  category: "images" | "code" | "server" | "assets" | "other"
  autoOptimizable: boolean
  optimized?: boolean
  optimizing?: boolean
}

export function PerformanceOptimizer({ websiteId, onOptimize }: PerformanceOptimizerProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analyzeComplete, setAnalyzeComplete] = useState(false)
  const [performanceScore, setPerformanceScore] = useState(72)
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([
    { name: "First Contentful Paint", value: 1.8, target: 1.8, unit: "s", status: "good" },
    { name: "Largest Contentful Paint", value: 2.9, target: 2.5, unit: "s", status: "needs-improvement" },
    { name: "Cumulative Layout Shift", value: 0.12, target: 0.1, unit: "", status: "needs-improvement" },
    { name: "Total Blocking Time", value: 350, target: 300, unit: "ms", status: "needs-improvement" },
    { name: "Time to Interactive", value: 4.2, target: 3.8, unit: "s", status: "poor" },
  ])
  const [issues, setIssues] = useState<OptimizationIssue[]>([
    {
      id: "issue-1",
      type: "critical",
      title: "Optimize images",
      description: "Several images are not properly sized or compressed, causing slow loading times.",
      impact: "high",
      category: "images",
      autoOptimizable: true,
      optimized: false,
    },
    {
      id: "issue-2",
      type: "important",
      title: "Eliminate render-blocking resources",
      description: "CSS and JavaScript files are blocking the rendering of your page.",
      impact: "high",
      category: "code",
      autoOptimizable: true,
      optimized: false,
    },
    {
      id: "issue-3",
      type: "important",
      title: "Enable text compression",
      description: "Text-based resources should be served with compression (gzip, deflate, or brotli).",
      impact: "medium",
      category: "server",
      autoOptimizable: true,
      optimized: false,
    },
    {
      id: "issue-4",
      type: "opportunity",
      title: "Defer offscreen images",
      description: "Consider lazy-loading offscreen and hidden images after all critical resources have been loaded.",
      impact: "medium",
      category: "images",
      autoOptimizable: true,
      optimized: false,
    },
    {
      id: "issue-5",
      type: "opportunity",
      title: "Reduce unused JavaScript",
      description: "Remove or defer loading of unused JavaScript to improve page load performance.",
      impact: "medium",
      category: "code",
      autoOptimizable: false,
      optimized: false,
    },
  ])
  const [autoOptimizeEnabled, setAutoOptimizeEnabled] = useState(true)
  const [optimizationInProgress, setOptimizationInProgress] = useState(false)

  // Function to start performance analysis
  const startAnalysis = () => {
    setIsAnalyzing(true)
    setAnalyzeComplete(false)

    // Simulate API call with timeout
    setTimeout(() => {
      setIsAnalyzing(false)
      setAnalyzeComplete(true)
      // Reset optimized status for demo purposes
      setIssues(issues.map((issue) => ({ ...issue, optimized: false })))
      calculateScore()
    }, 2500)
  }

  // Function to optimize an issue
  const optimizeIssue = async (issueId: string) => {
    // Find the issue
    const issueIndex = issues.findIndex((issue) => issue.id === issueId)
    if (issueIndex === -1) return

    // Update issue status to optimizing
    const updatedIssues = [...issues]
    updatedIssues[issueIndex] = { ...updatedIssues[issueIndex], optimizing: true }
    setIssues(updatedIssues)

    try {
      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Update issue status to optimized
      updatedIssues[issueIndex] = { ...updatedIssues[issueIndex], optimizing: false, optimized: true }
      setIssues(updatedIssues)

      // Recalculate score
      calculateScore()

      // Call the onOptimize callback
      await onOptimize(updatedIssues[issueIndex].category)
    } catch (error) {
      console.error("Error optimizing issue:", error)

      // Reset optimizing status
      updatedIssues[issueIndex] = { ...updatedIssues[issueIndex], optimizing: false }
      setIssues(updatedIssues)
    }
  }

  // Function to optimize all auto-optimizable issues
  const optimizeAllAuto = async () => {
    // Get all auto-optimizable issues that aren't optimized yet
    const autoOptimizableIssues = issues.filter((issue) => issue.autoOptimizable && !issue.optimized)

    if (autoOptimizableIssues.length === 0) return

    setOptimizationInProgress(true)

    // Update all issues to optimizing status
    const updatedIssues = [...issues]
    autoOptimizableIssues.forEach((issue) => {
      const issueIndex = issues.findIndex((i) => i.id === issue.id)
      updatedIssues[issueIndex] = { ...updatedIssues[issueIndex], optimizing: true }
    })
    setIssues(updatedIssues)

    try {
      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 2500))

      // Update all issues to optimized status
      autoOptimizableIssues.forEach((issue) => {
        const issueIndex = issues.findIndex((i) => i.id === issue.id)
        updatedIssues[issueIndex] = { ...updatedIssues[issueIndex], optimizing: false, optimized: true }
      })
      setIssues(updatedIssues)

      // Recalculate score
      calculateScore()
    } catch (error) {
      console.error("Error optimizing issues:", error)

      // Reset optimizing status
      autoOptimizableIssues.forEach((issue) => {
        const issueIndex = issues.findIndex((i) => i.id === issue.id)
        updatedIssues[issueIndex] = { ...updatedIssues[issueIndex], optimizing: false }
      })
      setIssues(updatedIssues)
    } finally {
      setOptimizationInProgress(false)
    }
  }

  // Function to calculate performance score
  const calculateScore = () => {
    // Count optimized issues
    const optimizedCount = issues.filter((issue) => issue.optimized).length
    const totalIssues = issues.length

    // Calculate score based on optimized issues and their impact
    const baseScore = 60 // Starting score
    const optimizedScore = Math.round((optimizedCount / totalIssues) * 40) // Up to 40 points for optimizing issues

    setPerformanceScore(baseScore + optimizedScore)

    // Update metrics based on optimizations
    if (optimizedCount > 0) {
      const updatedMetrics = [...metrics]

      // Improve LCP if image issues are optimized
      if (issues.some((i) => i.category === "images" && i.optimized)) {
        const lcpIndex = updatedMetrics.findIndex((m) => m.name === "Largest Contentful Paint")
        if (lcpIndex !== -1) {
          updatedMetrics[lcpIndex] = {
            ...updatedMetrics[lcpIndex],
            value: 2.3,
            status: "good",
          }
        }
      }

      // Improve TBT if code issues are optimized
      if (issues.some((i) => i.category === "code" && i.optimized)) {
        const tbtIndex = updatedMetrics.findIndex((m) => m.name === "Total Blocking Time")
        if (tbtIndex !== -1) {
          updatedMetrics[tbtIndex] = {
            ...updatedMetrics[tbtIndex],
            value: 250,
            status: "good",
          }
        }
      }

      // Improve TTI if server issues are optimized
      if (issues.some((i) => i.category === "server" && i.optimized)) {
        const ttiIndex = updatedMetrics.findIndex((m) => m.name === "Time to Interactive")
        if (ttiIndex !== -1) {
          updatedMetrics[ttiIndex] = {
            ...updatedMetrics[ttiIndex],
            value: 3.5,
            status: "needs-improvement",
          }
        }
      }

      setMetrics(updatedMetrics)
    }
  }

  // Function to get issue icon
  const getIssueIcon = (category: string) => {
    switch (category) {
      case "images":
        return <ImageIcon className="h-5 w-5 text-blue-500" />
      case "code":
        return <FileCode className="h-5 w-5 text-purple-500" />
      case "server":
        return <Database className="h-5 w-5 text-green-500" />
      case "assets":
        return <Globe className="h-5 w-5 text-orange-500" />
      default:
        return <Zap className="h-5 w-5 text-gray-500" />
    }
  }

  // Function to get impact badge
  const getImpactBadge = (impact: "high" | "medium" | "low") => {
    switch (impact) {
      case "high":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            High Impact
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            Medium Impact
          </Badge>
        )
      case "low":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            Low Impact
          </Badge>
        )
    }
  }

  // Function to get type badge
  const getTypeBadge = (type: "critical" | "important" | "opportunity") => {
    switch (type) {
      case "critical":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            Critical
          </Badge>
        )
      case "important":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            Important
          </Badge>
        )
      case "opportunity":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            Opportunity
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

  // Function to get metric status color
  const getMetricStatusColor = (status: "good" | "needs-improvement" | "poor") => {
    switch (status) {
      case "good":
        return "text-green-500"
      case "needs-improvement":
        return "text-yellow-500"
      case "poor":
        return "text-red-500"
    }
  }

  return (
    <ScrollReveal>
      <GlassCard className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Performance Optimizer</h2>
          <Button onClick={startAnalysis} disabled={isAnalyzing}>
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze Performance"
            )}
          </Button>
        </div>

        {analyzeComplete && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium">Performance Score</h3>
              <div className="flex items-baseline">
                <span className={`text-2xl font-bold ${getScoreColor(performanceScore)}`}>{performanceScore}</span>
                <span className="text-sm text-muted-foreground ml-1">/100</span>
              </div>
            </div>
            <Progress value={performanceScore} className={getProgressColor(performanceScore)} />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Poor</span>
              <span>Needs Improvement</span>
              <span>Good</span>
            </div>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="opportunities" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span>Opportunities</span>
            </TabsTrigger>
            <TabsTrigger value="diagnostics" className="flex items-center gap-2">
              <FileCode className="h-4 w-4" />
              <span>Diagnostics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="space-y-6">
              {!analyzeComplete && !isAnalyzing ? (
                <div className="text-center py-8">
                  <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Ready to analyze performance</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Click the "Analyze Performance" button to check your website's speed and performance.
                  </p>
                </div>
              ) : isAnalyzing ? (
                <div className="text-center py-8">
                  <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
                  <h3 className="text-lg font-medium mb-2">Analyzing your website...</h3>
                  <p className="text-sm text-muted-foreground">
                    This will only take a moment. We're checking various performance metrics.
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <h3 className="text-sm font-medium mb-4">Core Web Vitals</h3>
                    <div className="space-y-4">
                      {metrics.map((metric, index) => (
                        <div key={index} className="border rounded-md p-4">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="text-sm font-medium">{metric.name}</h4>
                            <div className={`font-medium ${getMetricStatusColor(metric.status)}`}>
                              {metric.value} {metric.unit}
                            </div>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className={`rounded-full h-2 ${
                                metric.status === "good"
                                  ? "bg-green-500"
                                  : metric.status === "needs-improvement"
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                              }`}
                              style={{ width: `${Math.min(100, (metric.value / metric.target) * 100)}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>
                              Target: {metric.target} {metric.unit}
                            </span>
                            <span className={getMetricStatusColor(metric.status)}>
                              {metric.status === "good"
                                ? "Good"
                                : metric.status === "needs-improvement"
                                  ? "Needs Improvement"
                                  : "Poor"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-sm font-medium mb-4">Performance Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-md p-4">
                        <h4 className="text-sm font-medium mb-2">Page Size</h4>
                        <div className="flex items-baseline">
                          <span className="text-2xl font-bold">2.4</span>
                          <span className="text-sm text-muted-foreground ml-1">MB</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Recommended: &lt; 1.5 MB</p>
                      </div>
                      <div className="border rounded-md p-4">
                        <h4 className="text-sm font-medium mb-2">Requests</h4>
                        <div className="flex items-baseline">
                          <span className="text-2xl font-bold">42</span>
                          <span className="text-sm text-muted-foreground ml-1">requests</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Recommended: &lt; 30 requests</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="opportunities">
            <div className="space-y-6">
              {!analyzeComplete && !isAnalyzing ? (
                <div className="text-center py-8">
                  <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Ready to find optimization opportunities</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Click the "Analyze Performance" button to discover ways to improve your website's performance.
                  </p>
                </div>
              ) : isAnalyzing ? (
                <div className="text-center py-8">
                  <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
                  <h3 className="text-lg font-medium mb-2">Analyzing your website...</h3>
                  <p className="text-sm text-muted-foreground">
                    This will only take a moment. We're identifying optimization opportunities.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Auto-optimize when possible</span>
                      <Switch checked={autoOptimizeEnabled} onCheckedChange={setAutoOptimizeEnabled} />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={optimizeAllAuto}
                      disabled={
                        !autoOptimizeEnabled ||
                        optimizationInProgress ||
                        issues.filter((i) => i.autoOptimizable && !i.optimized).length === 0
                      }
                    >
                      {optimizationInProgress ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Optimizing...
                        </>
                      ) : (
                        "Optimize All"
                      )}
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {issues.map((issue) => (
                      <div
                        key={issue.id}
                        className={`border rounded-md p-4 ${
                          issue.optimized ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            {issue.optimized ? (
                              <Check className="h-5 w-5 text-green-500" />
                            ) : (
                              getIssueIcon(issue.category)
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h4 className="text-sm font-medium">{issue.title}</h4>
                              {getTypeBadge(issue.type)}
                              {getImpactBadge(issue.impact)}
                            </div>
                            <p className="text-sm text-muted-foreground">{issue.description}</p>
                          </div>
                          {!issue.optimized && issue.autoOptimizable && autoOptimizeEnabled && (
                            <Button size="sm" onClick={() => optimizeIssue(issue.id)} disabled={issue.optimizing}>
                              {issue.optimizing ? (
                                <>
                                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                  Optimizing...
                                </>
                              ) : (
                                "Optimize"
                              )}
                            </Button>
                          )}
                          {!issue.optimized && !issue.autoOptimizable && (
                            <Button variant="outline" size="sm">
                              Learn More
                            </Button>
                          )}
                          {issue.optimized && (
                            <Badge
                              variant="outline"
                              className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            >
                              Optimized
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

          <TabsContent value="diagnostics">
            <div className="space-y-6">
              {!analyzeComplete && !isAnalyzing ? (
                <div className="text-center py-8">
                  <FileCode className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Ready to diagnose performance issues</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Click the "Analyze Performance" button to get detailed diagnostics about your website's performance.
                  </p>
                </div>
              ) : isAnalyzing ? (
                <div className="text-center py-8">
                  <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
                  <h3 className="text-lg font-medium mb-2">Analyzing your website...</h3>
                  <p className="text-sm text-muted-foreground">
                    This will only take a moment. We're running detailed diagnostics.
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <h3 className="text-sm font-medium mb-4">Resource Breakdown</h3>
                    <div className="border rounded-md p-4">
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Images</span>
                            <span className="text-sm font-medium">1.2 MB (50%)</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-blue-500 rounded-full h-2" style={{ width: "50%" }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">JavaScript</span>
                            <span className="text-sm font-medium">0.8 MB (33%)</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-purple-500 rounded-full h-2" style={{ width: "33%" }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">CSS</span>
                            <span className="text-sm font-medium">0.2 MB (8%)</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-pink-500 rounded-full h-2" style={{ width: "8%" }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Fonts</span>
                            <span className="text-sm font-medium">0.15 MB (6%)</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-yellow-500 rounded-full h-2" style={{ width: "6%" }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Other</span>
                            <span className="text-sm font-medium">0.05 MB (3%)</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-gray-500 rounded-full h-2" style={{ width: "3%" }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-sm font-medium mb-4">Waterfall Chart</h3>
                    <div className="border rounded-md p-4">
                      <div className="h-64 bg-muted/20 rounded-md flex items-center justify-center">
                        <p className="text-muted-foreground">Waterfall chart showing resource loading sequence</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-sm font-medium mb-4">Recommendations</h3>
                    <div className="space-y-4">
                      <div className="p-3 rounded-md bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300 flex items-start gap-3">
                        <Zap className="h-5 w-5 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="font-medium mb-1">Use a Content Delivery Network (CDN)</p>
                          <p>
                            A CDN can significantly improve loading times by serving content from locations closer to
                            your users.
                          </p>
                        </div>
                      </div>
                      <div className="p-3 rounded-md bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300 flex items-start gap-3">
                        <Zap className="h-5 w-5 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="font-medium mb-1">Implement Browser Caching</p>
                          <p>
                            Set appropriate cache headers to allow browsers to cache your assets and reduce load times
                            for returning visitors.
                          </p>
                        </div>
                      </div>
                      <div className="p-3 rounded-md bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300 flex items-start gap-3">
                        <Zap className="h-5 w-5 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="font-medium mb-1">Minimize HTTP Requests</p>
                          <p>
                            Combine multiple CSS and JavaScript files to reduce the number of HTTP requests needed to
                            load your page.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </GlassCard>
    </ScrollReveal>
  )
}
