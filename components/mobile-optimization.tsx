"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/glassmorphism/glass-card"
import { ScrollReveal } from "@/components/scroll-reveal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Smartphone, Tablet, Monitor, Loader2, Check, Menu, Save } from "lucide-react"

interface MobileOptimizationProps {
  onUpdate: (settings: MobileSettings) => void
  initialSettings?: MobileSettings
}

interface MobileSettings {
  responsiveImages: boolean
  fontSizeAdjustment: number
  menuType: "hamburger" | "tabbed" | "dropdown"
  contentPriority: string[]
  touchTargetSize: "default" | "large" | "extra-large"
  reduceAnimations: boolean
  enableSwipeNavigation: boolean
  adaptiveLayout: boolean
  useMobileSpecificImages: boolean
  optimizeForLowBandwidth: boolean
}

export function MobileOptimization({ onUpdate, initialSettings }: MobileOptimizationProps) {
  const [activeTab, setActiveTab] = useState("preview")
  const [isApplying, setIsApplying] = useState(false)
  const [settings, setSettings] = useState<MobileSettings>(
    initialSettings || {
      responsiveImages: true,
      fontSizeAdjustment: 0,
      menuType: "hamburger",
      contentPriority: ["about", "experience", "skills", "contact", "education", "projects"],
      touchTargetSize: "default",
      reduceAnimations: false,
      enableSwipeNavigation: true,
      adaptiveLayout: true,
      useMobileSpecificImages: false,
      optimizeForLowBandwidth: false,
    },
  )
  const [previewDevice, setPreviewDevice] = useState<"mobile" | "tablet" | "desktop">("mobile")

  // Function to update settings
  const updateSettings = (key: keyof MobileSettings, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // Function to apply settings
  const applySettings = async () => {
    setIsApplying(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      onUpdate(settings)
    } catch (error) {
      console.error("Error applying mobile settings:", error)
    } finally {
      setIsApplying(false)
    }
  }

  // Function to move content priority up
  const moveContentUp = (index: number) => {
    if (index <= 0) return

    const newContentPriority = [...settings.contentPriority]
    const temp = newContentPriority[index]
    newContentPriority[index] = newContentPriority[index - 1]
    newContentPriority[index - 1] = temp

    updateSettings("contentPriority", newContentPriority)
  }

  // Function to move content priority down
  const moveContentDown = (index: number) => {
    if (index >= settings.contentPriority.length - 1) return

    const newContentPriority = [...settings.contentPriority]
    const temp = newContentPriority[index]
    newContentPriority[index] = newContentPriority[index + 1]
    newContentPriority[index + 1] = temp

    updateSettings("contentPriority", newContentPriority)
  }

  return (
    <ScrollReveal>
      <GlassCard className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Mobile Optimization</h2>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className={previewDevice === "mobile" ? "bg-primary/10" : ""}
              onClick={() => setPreviewDevice("mobile")}
            >
              <Smartphone className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={previewDevice === "tablet" ? "bg-primary/10" : ""}
              onClick={() => setPreviewDevice("tablet")}
            >
              <Tablet className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={previewDevice === "desktop" ? "bg-primary/10" : ""}
              onClick={() => setPreviewDevice("desktop")}
            >
              <Monitor className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="preview">
            <div className="space-y-6">
              <div className="flex justify-center">
                <div
                  className={`border rounded-lg overflow-hidden bg-background transition-all duration-300 ${
                    previewDevice === "mobile"
                      ? "w-[320px] h-[568px]"
                      : previewDevice === "tablet"
                        ? "w-[768px] h-[500px]"
                        : "w-full h-[500px]"
                  }`}
                >
                  <div className="w-full h-full flex flex-col">
                    {/* Mock header */}
                    <div className="p-4 border-b flex items-center justify-between">
                      <div className="font-bold">John Doe</div>
                      {settings.menuType === "hamburger" ? (
                        <Menu className="h-5 w-5" />
                      ) : settings.menuType === "tabbed" ? (
                        <div className="flex space-x-2">
                          <div className="text-xs">Home</div>
                          <div className="text-xs">About</div>
                          <div className="text-xs">Contact</div>
                        </div>
                      ) : (
                        <Select defaultValue="home">
                          <SelectTrigger className="w-24 h-7">
                            <SelectValue placeholder="Menu" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="home">Home</SelectItem>
                            <SelectItem value="about">About</SelectItem>
                            <SelectItem value="contact">Contact</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>

                    {/* Mock content */}
                    <div className="flex-1 overflow-auto p-4">
                      <div className="space-y-4">
                        {settings.contentPriority.map((section) => (
                          <div key={section} className="border rounded-md p-3">
                            <h3 className="capitalize font-medium">{section}</h3>
                            <div
                              className={`mt-2 h-16 bg-muted/20 rounded flex items-center justify-center ${
                                settings.touchTargetSize === "large"
                                  ? "min-h-[48px]"
                                  : settings.touchTargetSize === "extra-large"
                                    ? "min-h-[64px]"
                                    : "min-h-[32px]"
                              }`}
                            >
                              <span className="text-muted-foreground text-sm">
                                {section.charAt(0).toUpperCase() + section.slice(1)} content
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  <Check className="h-3 w-3 mr-1" />
                  {previewDevice === "mobile"
                    ? "Mobile view"
                    : previewDevice === "tablet"
                      ? "Tablet view"
                      : "Desktop view"}
                </Badge>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-medium mb-2">Current Mobile Optimizations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center">
                    <Badge
                      variant="outline"
                      className={`mr-2 ${
                        settings.responsiveImages
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      }`}
                    >
                      {settings.responsiveImages ? <Check className="h-3 w-3" /> : "✕"}
                    </Badge>
                    Responsive Images
                  </div>
                  <div className="flex items-center">
                    <Badge
                      variant="outline"
                      className={`mr-2 ${
                        settings.adaptiveLayout
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      }`}
                    >
                      {settings.adaptiveLayout ? <Check className="h-3 w-3" /> : "✕"}
                    </Badge>
                    Adaptive Layout
                  </div>
                  <div className="flex items-center">
                    <Badge
                      variant="outline"
                      className={`mr-2 ${
                        settings.enableSwipeNavigation
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      }`}
                    >
                      {settings.enableSwipeNavigation ? <Check className="h-3 w-3" /> : "✕"}
                    </Badge>
                    Swipe Navigation
                  </div>
                  <div className="flex items-center">
                    <Badge
                      variant="outline"
                      className={`mr-2 ${
                        settings.touchTargetSize !== "default"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                      }`}
                    >
                      {settings.touchTargetSize !== "default" ? <Check className="h-3 w-3" /> : "!"}
                    </Badge>
                    Touch-friendly Targets
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-4">Layout & Navigation</h3>
                <div className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="menu-type">Menu Type</Label>
                    <Select value={settings.menuType} onValueChange={(value) => updateSettings("menuType", value)}>
                      <SelectTrigger id="menu-type">
                        <SelectValue placeholder="Select menu type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hamburger">Hamburger Menu</SelectItem>
                        <SelectItem value="tabbed">Tabbed Navigation</SelectItem>
                        <SelectItem value="dropdown">Dropdown Menu</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="touch-target-size">Touch Target Size</Label>
                    <Select
                      value={settings.touchTargetSize}
                      onValueChange={(value) => updateSettings("touchTargetSize", value as any)}
                    >
                      <SelectTrigger id="touch-target-size">
                        <SelectValue placeholder="Select touch target size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default (32px)</SelectItem>
                        <SelectItem value="large">Large (48px)</SelectItem>
                        <SelectItem value="extra-large">Extra Large (64px)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="swipe-navigation">Enable Swipe Navigation</Label>
                      <p className="text-sm text-muted-foreground">Allow swiping between sections</p>
                    </div>
                    <Switch
                      id="swipe-navigation"
                      checked={settings.enableSwipeNavigation}
                      onCheckedChange={(checked) => updateSettings("enableSwipeNavigation", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="adaptive-layout">Adaptive Layout</Label>
                      <p className="text-sm text-muted-foreground">Automatically adjust layout based on screen size</p>
                    </div>
                    <Switch
                      id="adaptive-layout"
                      checked={settings.adaptiveLayout}
                      onCheckedChange={(checked) => updateSettings("adaptiveLayout", checked)}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-sm font-medium mb-4">Content Priority</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Drag to reorder sections based on importance for mobile users
                </p>

                <div className="space-y-2">
                  {settings.contentPriority.map((section, index) => (
                    <div key={section} className="flex items-center justify-between p-2 border rounded-md">
                      <span className="capitalize">{section}</span>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => moveContentUp(index)}
                          disabled={index === 0}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <path d="m18 15-6-6-6 6" />
                          </svg>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => moveContentDown(index)}
                          disabled={index === settings.contentPriority.length - 1}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <path d="m6 9 6 6 6-6" />
                          </svg>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-sm font-medium mb-4">Performance & Media</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="responsive-images">Responsive Images</Label>
                      <p className="text-sm text-muted-foreground">Load appropriately sized images for each device</p>
                    </div>
                    <Switch
                      id="responsive-images"
                      checked={settings.responsiveImages}
                      onCheckedChange={(checked) => updateSettings("responsiveImages", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="mobile-specific-images">Use Mobile-Specific Images</Label>
                      <p className="text-sm text-muted-foreground">Use different images optimized for mobile devices</p>
                    </div>
                    <Switch
                      id="mobile-specific-images"
                      checked={settings.useMobileSpecificImages}
                      onCheckedChange={(checked) => updateSettings("useMobileSpecificImages", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="reduce-animations">Reduce Animations</Label>
                      <p className="text-sm text-muted-foreground">
                        Simplify animations for better performance on mobile
                      </p>
                    </div>
                    <Switch
                      id="reduce-animations"
                      checked={settings.reduceAnimations}
                      onCheckedChange={(checked) => updateSettings("reduceAnimations", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="low-bandwidth">Optimize for Low Bandwidth</Label>
                      <p className="text-sm text-muted-foreground">Reduce data usage for users on slow connections</p>
                    </div>
                    <Switch
                      id="low-bandwidth"
                      checked={settings.optimizeForLowBandwidth}
                      onCheckedChange={(checked) => updateSettings("optimizeForLowBandwidth", checked)}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="font-size">Font Size Adjustment</Label>
                      <span className="text-sm text-muted-foreground">
                        {settings.fontSizeAdjustment > 0
                          ? `+${settings.fontSizeAdjustment}`
                          : settings.fontSizeAdjustment}
                        px
                      </span>
                    </div>
                    <Slider
                      id="font-size"
                      min={-4}
                      max={8}
                      step={1}
                      value={[settings.fontSizeAdjustment]}
                      onValueChange={(value) => updateSettings("fontSizeAdjustment", value[0])}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Smaller</span>
                      <span>Default</span>
                      <span>Larger</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6 flex justify-end">
                <Button onClick={applySettings} disabled={isApplying}>
                  {isApplying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Applying...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Apply Settings
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </GlassCard>
    </ScrollReveal>
  )
}
