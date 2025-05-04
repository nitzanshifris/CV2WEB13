"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/glassmorphism/glass-card"
import { ScrollReveal } from "@/components/scroll-reveal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, LineChart, PieChart } from "lucide-react"

interface AnalyticsDashboardProps {
  websiteId: string
}

export function AnalyticsDashboard({ websiteId }: AnalyticsDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [timeRange, setTimeRange] = useState("7d")
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching analytics data
    const fetchAnalytics = async () => {
      setIsLoading(true)

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Generate mock data based on time range
      const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90
      const mockData = generateMockAnalytics(days)

      setAnalyticsData(mockData)
      setIsLoading(false)
    }

    fetchAnalytics()
  }, [timeRange, websiteId])

  // Function to generate mock analytics data
  const generateMockAnalytics = (days: number) => {
    // Generate daily visitors (random between 10-100)
    const visitors = Array.from({ length: days }, () => Math.floor(Math.random() * 90) + 10)

    // Generate page views (1.5-3x visitors)
    const pageViews = visitors.map((v) => Math.floor(v * (1.5 + Math.random() * 1.5)))

    // Generate dates for the last N days
    const dates = Array.from({ length: days }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (days - 1 - i))
      return date.toISOString().split("T")[0]
    })

    // Traffic sources
    const trafficSources = {
      Direct: Math.floor(Math.random() * 40) + 10,
      Search: Math.floor(Math.random() * 30) + 10,
      Social: Math.floor(Math.random() * 20) + 5,
      Referral: Math.floor(Math.random() * 15) + 5,
      Email: Math.floor(Math.random() * 10) + 1,
    }

    // Devices
    const devices = {
      Desktop: Math.floor(Math.random() * 50) + 30,
      Mobile: Math.floor(Math.random() * 40) + 20,
      Tablet: Math.floor(Math.random() * 20) + 5,
    }

    // Countries (top 5)
    const countries = {
      "United States": Math.floor(Math.random() * 40) + 20,
      "United Kingdom": Math.floor(Math.random() * 20) + 10,
      Germany: Math.floor(Math.random() * 15) + 5,
      Canada: Math.floor(Math.random() * 10) + 5,
      Australia: Math.floor(Math.random() * 10) + 5,
    }

    return {
      totalVisitors: visitors.reduce((a, b) => a + b, 0),
      totalPageViews: pageViews.reduce((a, b) => a + b, 0),
      averageTimeOnSite: Math.floor(Math.random() * 180) + 60, // 1-4 minutes in seconds
      bounceRate: Math.floor(Math.random() * 40) + 30, // 30-70%
      dailyData: dates.map((date, i) => ({
        date,
        visitors: visitors[i],
        pageViews: pageViews[i],
      })),
      trafficSources,
      devices,
      countries,
    }
  }

  // Function to render the overview tab
  const renderOverview = () => {
    if (isLoading || !analyticsData) {
      return (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-pulse text-center">
            <div className="h-8 w-32 bg-muted rounded mx-auto mb-4"></div>
            <div className="h-4 w-48 bg-muted rounded mx-auto"></div>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 border rounded-md">
            <div className="text-sm text-muted-foreground mb-1">Total Visitors</div>
            <div className="text-2xl font-bold">{analyticsData.totalVisitors.toLocaleString()}</div>
          </div>
          <div className="p-4 border rounded-md">
            <div className="text-sm text-muted-foreground mb-1">Page Views</div>
            <div className="text-2xl font-bold">{analyticsData.totalPageViews.toLocaleString()}</div>
          </div>
          <div className="p-4 border rounded-md">
            <div className="text-sm text-muted-foreground mb-1">Avg. Time on Site</div>
            <div className="text-2xl font-bold">
              {Math.floor(analyticsData.averageTimeOnSite / 60)}m {analyticsData.averageTimeOnSite % 60}s
            </div>
          </div>
          <div className="p-4 border rounded-md">
            <div className="text-sm text-muted-foreground mb-1">Bounce Rate</div>
            <div className="text-2xl font-bold">{analyticsData.bounceRate}%</div>
          </div>
        </div>

        <div className="border rounded-md p-4">
          <h3 className="text-sm font-medium mb-4">Visitors & Page Views</h3>
          <div className="h-64 relative">
            {/* This would be a real chart in a production app */}
            <div className="absolute inset-0 flex items-center justify-center">
              <LineChart className="h-32 w-32 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Function to render the traffic sources tab
  const renderTrafficSources = () => {
    if (isLoading || !analyticsData) {
      return (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-pulse text-center">
            <div className="h-8 w-32 bg-muted rounded mx-auto mb-4"></div>
            <div className="h-4 w-48 bg-muted rounded mx-auto"></div>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-md p-4">
            <h3 className="text-sm font-medium mb-4">Traffic Sources</h3>
            <div className="h-64 relative">
              {/* This would be a real chart in a production app */}
              <div className="absolute inset-0 flex items-center justify-center">
                <PieChart className="h-32 w-32 text-muted-foreground" />
              </div>
            </div>
          </div>

          <div className="border rounded-md p-4">
            <h3 className="text-sm font-medium mb-4">Traffic Sources Breakdown</h3>
            <div className="space-y-4">
              {Object.entries(analyticsData.trafficSources).map(([source, value]: [string, any]) => (
                <div key={source}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">{source}</span>
                    <span className="text-sm font-medium">{value}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary rounded-full h-2" style={{ width: `${value}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border rounded-md p-4">
          <h3 className="text-sm font-medium mb-4">Referrers</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium">Source</th>
                  <th className="text-right py-2 font-medium">Visitors</th>
                  <th className="text-right py-2 font-medium">% of Total</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2">google.com</td>
                  <td className="text-right py-2">{Math.floor(analyticsData.totalVisitors * 0.4)}</td>
                  <td className="text-right py-2">40%</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">linkedin.com</td>
                  <td className="text-right py-2">{Math.floor(analyticsData.totalVisitors * 0.2)}</td>
                  <td className="text-right py-2">20%</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">twitter.com</td>
                  <td className="text-right py-2">{Math.floor(analyticsData.totalVisitors * 0.15)}</td>
                  <td className="text-right py-2">15%</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">facebook.com</td>
                  <td className="text-right py-2">{Math.floor(analyticsData.totalVisitors * 0.1)}</td>
                  <td className="text-right py-2">10%</td>
                </tr>
                <tr>
                  <td className="py-2">github.com</td>
                  <td className="text-right py-2">{Math.floor(analyticsData.totalVisitors * 0.05)}</td>
                  <td className="text-right py-2">5%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  // Function to render the audience tab
  const renderAudience = () => {
    if (isLoading || !analyticsData) {
      return (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-pulse text-center">
            <div className="h-8 w-32 bg-muted rounded mx-auto mb-4"></div>
            <div className="h-4 w-48 bg-muted rounded mx-auto"></div>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-md p-4">
            <h3 className="text-sm font-medium mb-4">Devices</h3>
            <div className="h-64 relative">
              {/* This would be a real chart in a production app */}
              <div className="absolute inset-0 flex items-center justify-center">
                <PieChart className="h-32 w-32 text-muted-foreground" />
              </div>
            </div>
          </div>

          <div className="border rounded-md p-4">
            <h3 className="text-sm font-medium mb-4">Countries</h3>
            <div className="h-64 relative">
              {/* This would be a real chart in a production app */}
              <div className="absolute inset-0 flex items-center justify-center">
                <BarChart className="h-32 w-32 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>

        <div className="border rounded-md p-4">
          <h3 className="text-sm font-medium mb-4">Top Countries</h3>
          <div className="space-y-4">
            {Object.entries(analyticsData.countries).map(([country, value]: [string, any]) => (
              <div key={country}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">{country}</span>
                  <span className="text-sm font-medium">{value}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary rounded-full h-2" style={{ width: `${value}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <ScrollReveal>
      <GlassCard className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Analytics Dashboard</h2>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="traffic">Traffic Sources</TabsTrigger>
            <TabsTrigger value="audience">Audience</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">{renderOverview()}</TabsContent>

          <TabsContent value="traffic">{renderTrafficSources()}</TabsContent>

          <TabsContent value="audience">{renderAudience()}</TabsContent>
        </Tabs>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Data last updated: {new Date().toLocaleString()}</p>
        </div>
      </GlassCard>
    </ScrollReveal>
  )
}
