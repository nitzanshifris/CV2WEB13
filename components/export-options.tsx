"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/glassmorphism/glass-card"
import { ScrollReveal } from "@/components/scroll-reveal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Download,
  FileText,
  FileImage,
  Globe,
  Loader2,
  Check,
  AlertTriangle,
  Info,
  Copy,
  ExternalLink,
} from "lucide-react"

interface ExportOptionsProps {
  websiteId: string
  onExport: (format: string, options: any) => Promise<string>
}

export function ExportOptions({ websiteId, onExport }: ExportOptionsProps) {
  const [activeTab, setActiveTab] = useState("download")
  const [isExporting, setIsExporting] = useState(false)
  const [exportSuccess, setExportSuccess] = useState<string | null>(null)
  const [exportError, setExportError] = useState<string | null>(null)
  const [downloadOptions, setDownloadOptions] = useState({
    format: "html",
    includeAssets: true,
    minify: false,
    includeSourceCode: true,
  })
  const [pdfOptions, setPdfOptions] = useState({
    paperSize: "a4",
    orientation: "portrait",
    includeHeader: true,
    includeFooter: true,
    highQuality: true,
  })
  const [imageOptions, setImageOptions] = useState({
    format: "png",
    quality: "high",
    deviceType: "desktop",
    fullPage: true,
  })
  const [deployOptions, setDeployOptions] = useState({
    platform: "vercel",
    customDomain: "",
    autoRedeploy: true,
    includeAnalytics: true,
    setupGit: true,
  })
  const [copied, setCopied] = useState(false)

  // Function to handle export
  const handleExport = async (format: string, options: any) => {
    setIsExporting(true)
    setExportSuccess(null)
    setExportError(null)

    try {
      // Call the onExport callback with the selected format and options
      const result = await onExport(format, options)
      setExportSuccess(result)
    } catch (error) {
      console.error("Export error:", error)
      setExportError("An error occurred during export. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  // Function to copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <ScrollReveal>
      <GlassCard className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Export & Deploy</h2>
          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            <Info className="h-3 w-3 mr-1" />
            Multiple formats available
          </Badge>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="download" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Download</span>
            </TabsTrigger>
            <TabsTrigger value="pdf" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">PDF</span>
            </TabsTrigger>
            <TabsTrigger value="image" className="flex items-center gap-2">
              <FileImage className="h-4 w-4" />
              <span className="hidden sm:inline">Image</span>
            </TabsTrigger>
            <TabsTrigger value="deploy" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">Deploy</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="download">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-4">Download Options</h3>
                <div className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="download-format">Format</Label>
                    <Select
                      value={downloadOptions.format}
                      onValueChange={(value) => setDownloadOptions({ ...downloadOptions, format: value })}
                    >
                      <SelectTrigger id="download-format">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="html">HTML/CSS/JS</SelectItem>
                        <SelectItem value="react">React Project</SelectItem>
                        <SelectItem value="next">Next.js Project</SelectItem>
                        <SelectItem value="zip">ZIP Archive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="include-assets">Include Assets</Label>
                      <p className="text-sm text-muted-foreground">Download images, fonts, and other assets</p>
                    </div>
                    <Switch
                      id="include-assets"
                      checked={downloadOptions.includeAssets}
                      onCheckedChange={(checked) => setDownloadOptions({ ...downloadOptions, includeAssets: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="minify">Minify Code</Label>
                      <p className="text-sm text-muted-foreground">
                        Reduce file size by removing whitespace and comments
                      </p>
                    </div>
                    <Switch
                      id="minify"
                      checked={downloadOptions.minify}
                      onCheckedChange={(checked) => setDownloadOptions({ ...downloadOptions, minify: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="include-source">Include Source Code</Label>
                      <p className="text-sm text-muted-foreground">Include original source files for future editing</p>
                    </div>
                    <Switch
                      id="include-source"
                      checked={downloadOptions.includeSourceCode}
                      onCheckedChange={(checked) =>
                        setDownloadOptions({ ...downloadOptions, includeSourceCode: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <Button
                  onClick={() => handleExport("download", downloadOptions)}
                  disabled={isExporting}
                  className="w-full"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Preparing Download...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Download as{" "}
                      {downloadOptions.format === "html"
                        ? "HTML"
                        : downloadOptions.format === "react"
                          ? "React Project"
                          : downloadOptions.format === "next"
                            ? "Next.js Project"
                            : "ZIP Archive"}
                    </>
                  )}
                </Button>

                {downloadOptions.format === "react" || downloadOptions.format === "next" ? (
                  <div className="mt-4 p-3 rounded-md bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300 flex items-start gap-3">
                    <Info className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium mb-1">Project Setup Instructions</p>
                      <ol className="list-decimal list-inside space-y-1">
                        <li>Extract the downloaded ZIP file</li>
                        <li>Open a terminal in the project directory</li>
                        <li>
                          Run <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">npm install</code> to install
                          dependencies
                        </li>
                        <li>
                          Run <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">npm run dev</code> to start
                          the development server
                        </li>
                      </ol>
                    </div>
                  </div>
                ) : null}
              </div>

              {exportSuccess && (
                <div className="border-t pt-6">
                  <div className="p-3 rounded-md bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-300 flex items-center">
                    <Check className="h-5 w-5 mr-2" />
                    {exportSuccess}
                  </div>
                </div>
              )}

              {exportError && (
                <div className="border-t pt-6">
                  <div className="p-3 rounded-md bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-300 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    {exportError}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="pdf">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-4">PDF Export Options</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="paper-size">Paper Size</Label>
                      <Select
                        value={pdfOptions.paperSize}
                        onValueChange={(value) => setPdfOptions({ ...pdfOptions, paperSize: value })}
                      >
                        <SelectTrigger id="paper-size">
                          <SelectValue placeholder="Select paper size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="a4">A4</SelectItem>
                          <SelectItem value="letter">Letter</SelectItem>
                          <SelectItem value="legal">Legal</SelectItem>
                          <SelectItem value="tabloid">Tabloid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="orientation">Orientation</Label>
                      <RadioGroup
                        value={pdfOptions.orientation}
                        onValueChange={(value) =>
                          setPdfOptions({ ...pdfOptions, orientation: value as "portrait" | "landscape" })
                        }
                        className="flex"
                      >
                        <div className="flex items-center space-x-2 mr-4">
                          <RadioGroupItem value="portrait" id="portrait" />
                          <Label htmlFor="portrait">Portrait</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="landscape" id="landscape" />
                          <Label htmlFor="landscape">Landscape</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="include-header">Include Header</Label>
                      <p className="text-sm text-muted-foreground">Add a header with name and contact information</p>
                    </div>
                    <Switch
                      id="include-header"
                      checked={pdfOptions.includeHeader}
                      onCheckedChange={(checked) => setPdfOptions({ ...pdfOptions, includeHeader: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="include-footer">Include Footer</Label>
                      <p className="text-sm text-muted-foreground">Add a footer with page numbers and date</p>
                    </div>
                    <Switch
                      id="include-footer"
                      checked={pdfOptions.includeFooter}
                      onCheckedChange={(checked) => setPdfOptions({ ...pdfOptions, includeFooter: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="high-quality">High Quality</Label>
                      <p className="text-sm text-muted-foreground">Generate a higher quality PDF (larger file size)</p>
                    </div>
                    <Switch
                      id="high-quality"
                      checked={pdfOptions.highQuality}
                      onCheckedChange={(checked) => setPdfOptions({ ...pdfOptions, highQuality: checked })}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <Button onClick={() => handleExport("pdf", pdfOptions)} disabled={isExporting} className="w-full">
                  {isExporting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Export as PDF
                    </>
                  )}
                </Button>
              </div>

              {exportSuccess && (
                <div className="border-t pt-6">
                  <div className="p-3 rounded-md bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-300 flex items-center">
                    <Check className="h-5 w-5 mr-2" />
                    {exportSuccess}
                  </div>
                </div>
              )}

              {exportError && (
                <div className="border-t pt-6">
                  <div className="p-3 rounded-md bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-300 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    {exportError}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="image">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-4">Image Export Options</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="image-format">Image Format</Label>
                      <Select
                        value={imageOptions.format}
                        onValueChange={(value) => setImageOptions({ ...imageOptions, format: value })}
                      >
                        <SelectTrigger id="image-format">
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="png">PNG</SelectItem>
                          <SelectItem value="jpg">JPG</SelectItem>
                          <SelectItem value="webp">WebP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="image-quality">Quality</Label>
                      <Select
                        value={imageOptions.quality}
                        onValueChange={(value) => setImageOptions({ ...imageOptions, quality: value })}
                      >
                        <SelectTrigger id="image-quality">
                          <SelectValue placeholder="Select quality" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low (Smaller File)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="device-type">Device Type</Label>
                    <Select
                      value={imageOptions.deviceType}
                      onValueChange={(value) => setImageOptions({ ...imageOptions, deviceType: value })}
                    >
                      <SelectTrigger id="device-type">
                        <SelectValue placeholder="Select device type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="desktop">Desktop (1920×1080)</SelectItem>
                        <SelectItem value="tablet">Tablet (768×1024)</SelectItem>
                        <SelectItem value="mobile">Mobile (375×667)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="full-page">Capture Full Page</Label>
                      <p className="text-sm text-muted-foreground">
                        Capture the entire page, including content below the fold
                      </p>
                    </div>
                    <Switch
                      id="full-page"
                      checked={imageOptions.fullPage}
                      onCheckedChange={(checked) => setImageOptions({ ...imageOptions, fullPage: checked })}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <Button onClick={() => handleExport("image", imageOptions)} disabled={isExporting} className="w-full">
                  {isExporting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Image...
                    </>
                  ) : (
                    <>
                      <FileImage className="mr-2 h-4 w-4" />
                      Export as {imageOptions.format.toUpperCase()}
                    </>
                  )}
                </Button>
              </div>

              {exportSuccess && (
                <div className="border-t pt-6">
                  <div className="p-3 rounded-md bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-300 flex items-center">
                    <Check className="h-5 w-5 mr-2" />
                    {exportSuccess}
                  </div>
                </div>
              )}

              {exportError && (
                <div className="border-t pt-6">
                  <div className="p-3 rounded-md bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-300 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    {exportError}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="deploy">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-4">Deployment Options</h3>
                <div className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="deploy-platform">Deployment Platform</Label>
                    <Select
                      value={deployOptions.platform}
                      onValueChange={(value) => setDeployOptions({ ...deployOptions, platform: value })}
                    >
                      <SelectTrigger id="deploy-platform">
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vercel">Vercel</SelectItem>
                        <SelectItem value="netlify">Netlify</SelectItem>
                        <SelectItem value="github">GitHub Pages</SelectItem>
                        <SelectItem value="custom">Custom Server</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="custom-domain">Custom Domain (Optional)</Label>
                    <Input
                      id="custom-domain"
                      placeholder="e.g., myportfolio.com"
                      value={deployOptions.customDomain}
                      onChange={(e) => setDeployOptions({ ...deployOptions, customDomain: e.target.value })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-redeploy">Auto-Redeploy on Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically redeploy when you update your website
                      </p>
                    </div>
                    <Switch
                      id="auto-redeploy"
                      checked={deployOptions.autoRedeploy}
                      onCheckedChange={(checked) => setDeployOptions({ ...deployOptions, autoRedeploy: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="include-analytics">Include Analytics</Label>
                      <p className="text-sm text-muted-foreground">Add analytics tracking to monitor website traffic</p>
                    </div>
                    <Switch
                      id="include-analytics"
                      checked={deployOptions.includeAnalytics}
                      onCheckedChange={(checked) => setDeployOptions({ ...deployOptions, includeAnalytics: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="setup-git">Setup Git Repository</Label>
                      <p className="text-sm text-muted-foreground">Create a Git repository for version control</p>
                    </div>
                    <Switch
                      id="setup-git"
                      checked={deployOptions.setupGit}
                      onCheckedChange={(checked) => setDeployOptions({ ...deployOptions, setupGit: checked })}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <Button onClick={() => handleExport("deploy", deployOptions)} disabled={isExporting} className="w-full">
                  {isExporting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deploying...
                    </>
                  ) : (
                    <>
                      <Globe className="mr-2 h-4 w-4" />
                      Deploy to{" "}
                      {deployOptions.platform === "vercel"
                        ? "Vercel"
                        : deployOptions.platform === "netlify"
                          ? "Netlify"
                          : deployOptions.platform === "github"
                            ? "GitHub Pages"
                            : "Custom Server"}
                    </>
                  )}
                </Button>
              </div>

              {exportSuccess && (
                <div className="border-t pt-6">
                  <div className="p-3 rounded-md bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-300">
                    <div className="flex items-center mb-2">
                      <Check className="h-5 w-5 mr-2" />
                      <span className="font-medium">Deployment Successful!</span>
                    </div>
                    <p className="text-sm mb-2">Your website is now live at:</p>
                    <div className="flex items-center justify-between bg-green-100 dark:bg-green-900 p-2 rounded-md">
                      <code className="text-sm">{exportSuccess}</code>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => copyToClipboard(exportSuccess)}
                        >
                          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                          <a href={exportSuccess} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {exportError && (
                <div className="border-t pt-6">
                  <div className="p-3 rounded-md bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-300 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    {exportError}
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
