"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/glassmorphism/glass-card"
import { ScrollReveal } from "@/components/scroll-reveal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { History, Save, RotateCcw, Clock, Download, AlertTriangle, Check, Loader2 } from "lucide-react"

interface VersionHistoryProps {
  websiteId: string
  onRestore: (versionId: string) => Promise<void>
  onSaveVersion: (name: string, notes: string) => Promise<void>
}

type VersionStatus = "published" | "draft" | "restored"

interface Version {
  id: string
  name: string
  notes: string
  date: string
  status: VersionStatus
  changes: number
}

export function VersionHistory({ websiteId, onRestore, onSaveVersion }: VersionHistoryProps) {
  const [activeTab, setActiveTab] = useState("history")
  const [versions, setVersions] = useState<Version[]>([
    {
      id: "v1",
      name: "Initial Version",
      notes: "First draft of the website",
      date: "2023-05-15T14:30:00Z",
      status: "published",
      changes: 24,
    },
    {
      id: "v2",
      name: "Updated Content",
      notes: "Added new projects and skills",
      date: "2023-05-20T10:15:00Z",
      status: "published",
      changes: 12,
    },
    {
      id: "v3",
      name: "Design Refresh",
      notes: "Changed color scheme and layout",
      date: "2023-06-01T16:45:00Z",
      status: "published",
      changes: 18,
    },
    {
      id: "v4",
      name: "Current Version",
      notes: "Latest changes",
      date: "2023-06-10T09:20:00Z",
      status: "draft",
      changes: 7,
    },
  ])
  const [isRestoring, setIsRestoring] = useState(false)
  const [restoringId, setRestoringId] = useState<string | null>(null)
  const [newVersionName, setNewVersionName] = useState("")
  const [newVersionNotes, setNewVersionNotes] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [compareVersions, setCompareVersions] = useState<string[]>([])

  // Function to handle version restore
  const handleRestore = async (versionId: string) => {
    setIsRestoring(true)
    setRestoringId(versionId)

    try {
      await onRestore(versionId)

      // Update versions to mark this one as restored
      setVersions(versions.map((v) => (v.id === versionId ? { ...v, status: "restored" } : v)))
    } catch (error) {
      console.error("Error restoring version:", error)
    } finally {
      setIsRestoring(false)
      setRestoringId(null)
    }
  }

  // Function to handle saving a new version
  const handleSaveVersion = async () => {
    if (!newVersionName) return

    setIsSaving(true)

    try {
      await onSaveVersion(newVersionName, newVersionNotes)

      // Add new version to the list
      const newVersion: Version = {
        id: `v${versions.length + 1}`,
        name: newVersionName,
        notes: newVersionNotes,
        date: new Date().toISOString(),
        status: "draft",
        changes: Math.floor(Math.random() * 10) + 5, // Random number of changes for demo
      }

      setVersions([newVersion, ...versions])
      setNewVersionName("")
      setNewVersionNotes("")
      setSaveSuccess(true)

      // Reset success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error("Error saving version:", error)
    } finally {
      setIsSaving(false)
    }
  }

  // Function to toggle version selection for comparison
  const toggleVersionForComparison = (versionId: string) => {
    if (compareVersions.includes(versionId)) {
      setCompareVersions(compareVersions.filter((id) => id !== versionId))
    } else {
      if (compareVersions.length < 2) {
        setCompareVersions([...compareVersions, versionId])
      }
    }
  }

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // Function to get status badge
  const getStatusBadge = (status: VersionStatus) => {
    switch (status) {
      case "published":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            Published
          </Badge>
        )
      case "draft":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            Draft
          </Badge>
        )
      case "restored":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            Restored
          </Badge>
        )
    }
  }

  return (
    <ScrollReveal>
      <GlassCard className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Version History</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Current Version
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save Current Version</DialogTitle>
                <DialogDescription>
                  Create a snapshot of your current website that you can restore later if needed.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="version-name" className="text-sm font-medium">
                    Version Name
                  </label>
                  <Input
                    id="version-name"
                    value={newVersionName}
                    onChange={(e) => setNewVersionName(e.target.value)}
                    placeholder="e.g., Design Update"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="version-notes" className="text-sm font-medium">
                    Notes (Optional)
                  </label>
                  <Textarea
                    id="version-notes"
                    value={newVersionNotes}
                    onChange={(e) => setNewVersionNotes(e.target.value)}
                    placeholder="Describe what changes you made in this version"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {}}>
                  Cancel
                </Button>
                <Button onClick={handleSaveVersion} disabled={!newVersionName || isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Version"
                  )}
                </Button>
              </DialogFooter>
              {saveSuccess && (
                <div className="mt-2 p-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-md flex items-center">
                  <Check className="h-4 w-4 mr-2" />
                  Version saved successfully!
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              <span>History</span>
            </TabsTrigger>
            <TabsTrigger value="compare" className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              <span>Compare</span>
            </TabsTrigger>
            <TabsTrigger value="backup" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span>Backup</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="history">
            <div className="space-y-4">
              {versions.map((version) => (
                <div key={version.id} className="border rounded-md p-4 hover:border-primary transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{version.name}</h3>
                        {getStatusBadge(version.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {formatDate(version.date)}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRestore(version.id)}
                      disabled={isRestoring || version.status === "restored" || version.status === "draft"}
                    >
                      {isRestoring && restoringId === version.id ? (
                        <>
                          <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                          Restoring...
                        </>
                      ) : (
                        "Restore"
                      )}
                    </Button>
                  </div>
                  {version.notes && <p className="text-sm mt-2 mb-3">{version.notes}</p>}
                  <div className="text-xs text-muted-foreground">
                    {version.changes} {version.changes === 1 ? "change" : "changes"}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="compare">
            <div className="space-y-6">
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Select two versions to compare</h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Choose two versions from your history to see what changed between them.
                </p>

                <div className="space-y-2">
                  {versions.map((version) => (
                    <div
                      key={version.id}
                      className={`border rounded-md p-3 flex items-center justify-between cursor-pointer transition-colors ${
                        compareVersions.includes(version.id)
                          ? "border-primary bg-primary/5"
                          : "hover:border-muted-foreground"
                      }`}
                      onClick={() => toggleVersionForComparison(version.id)}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-medium">{version.name}</h4>
                          <span className="text-xs text-muted-foreground">{formatDate(version.date)}</span>
                        </div>
                      </div>
                      <div className="h-4 w-4 rounded-full border flex items-center justify-center">
                        {compareVersions.includes(version.id) && (
                          <div className="h-2 w-2 rounded-full bg-primary"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {compareVersions.length === 2 && (
                <div className="border rounded-md p-4">
                  <h3 className="text-sm font-medium mb-4">Comparison Results</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-md p-3">
                      <h4 className="text-xs font-medium mb-2">
                        {versions.find((v) => v.id === compareVersions[0])?.name}
                      </h4>
                      <div className="text-xs text-muted-foreground mb-1">
                        {formatDate(versions.find((v) => v.id === compareVersions[0])?.date || "")}
                      </div>
                      <div className="h-32 bg-muted/20 rounded-md flex items-center justify-center text-muted-foreground text-sm">
                        Version Preview
                      </div>
                    </div>

                    <div className="border rounded-md p-3">
                      <h4 className="text-xs font-medium mb-2">
                        {versions.find((v) => v.id === compareVersions[1])?.name}
                      </h4>
                      <div className="text-xs text-muted-foreground mb-1">
                        {formatDate(versions.find((v) => v.id === compareVersions[1])?.date || "")}
                      </div>
                      <div className="h-32 bg-muted/20 rounded-md flex items-center justify-center text-muted-foreground text-sm">
                        Version Preview
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-xs font-medium mb-2">Changes</h4>
                    <div className="space-y-2">
                      <div className="p-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-md text-xs">
                        + Added new project section
                      </div>
                      <div className="p-2 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 rounded-md text-xs">
                        - Removed contact form
                      </div>
                      <div className="p-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 rounded-md text-xs">
                        ~ Modified color scheme
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="backup">
            <div className="space-y-6">
              <div className="border rounded-md p-4">
                <h3 className="text-sm font-medium mb-2">Download Backup</h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Download a complete backup of your website including all content, settings, and assets.
                </p>
                <Button className="w-full flex items-center justify-center gap-2">
                  <Download className="h-4 w-4" />
                  Download Full Backup
                </Button>
              </div>

              <div className="border rounded-md p-4">
                <h3 className="text-sm font-medium mb-2">Scheduled Backups</h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Set up automatic backups to ensure you never lose your work.
                </p>

                <div className="p-3 rounded-md bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300 flex items-start gap-3 mb-4">
                  <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    Scheduled backups are available on the Pro plan. Upgrade to enable this feature.
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  Upgrade to Pro
                </Button>
              </div>

              <div className="border rounded-md p-4">
                <h3 className="text-sm font-medium mb-2">Import Backup</h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Restore your website from a previously downloaded backup file.
                </p>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="backup-file"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Download className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">JSON or ZIP file (max. 50MB)</p>
                    </div>
                    <input id="backup-file" type="file" className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </GlassCard>
    </ScrollReveal>
  )
}
