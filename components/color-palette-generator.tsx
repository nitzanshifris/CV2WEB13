"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/glassmorphism/glass-card"
import { ScrollReveal } from "@/components/scroll-reveal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Copy, Check, RefreshCw, Palette, Droplet, Sparkles, ImageIcon } from "lucide-react"

interface ColorPaletteProps {
  onSelectPalette: (colors: string[]) => void
  initialColors?: string[]
}

export function ColorPaletteGenerator({ onSelectPalette, initialColors = [] }: ColorPaletteProps) {
  const [colors, setColors] = useState<string[]>(
    initialColors.length >= 5 ? initialColors : ["#3b82f6", "#1e40af", "#60a5fa", "#f9fafb", "#1f2937"],
  )
  const [activeTab, setActiveTab] = useState("palette")
  const [baseColor, setBaseColor] = useState("#3b82f6")
  const [harmonyType, setHarmonyType] = useState<
    "analogous" | "monochromatic" | "triadic" | "complementary" | "custom"
  >("analogous")
  const [copied, setCopied] = useState<number | null>(null)
  const [imageUrl, setImageUrl] = useState("")
  const [extracting, setExtracting] = useState(false)
  const [hue, setHue] = useState(210) // Default blue hue
  const [saturation, setSaturation] = useState(90)
  const [lightness, setLightness] = useState(60)

  // Generate a palette based on the base color and harmony type
  useEffect(() => {
    if (harmonyType === "custom") return

    const newColors = generateColorHarmony(baseColor, harmonyType)
    setColors(newColors)
    onSelectPalette(newColors)
  }, [baseColor, harmonyType, onSelectPalette])

  // Update base color when HSL values change
  useEffect(() => {
    const newBaseColor = hslToHex(hue, saturation, lightness)
    setBaseColor(newBaseColor)
  }, [hue, saturation, lightness])

  // Function to generate color harmonies
  const generateColorHarmony = (
    base: string,
    type: "analogous" | "monochromatic" | "triadic" | "complementary" | "custom",
  ): string[] => {
    const { h, s, l } = hexToHsl(base)

    switch (type) {
      case "analogous":
        return [
          hslToHex(h, s, l), // Base color
          hslToHex((h + 30) % 360, s, l), // +30 degrees
          hslToHex((h + 60) % 360, s, l), // +60 degrees
          hslToHex((h - 30 + 360) % 360, s, l), // -30 degrees
          hslToHex((h - 60 + 360) % 360, s, l), // -60 degrees
        ]
      case "monochromatic":
        return [
          hslToHex(h, s, l), // Base color
          hslToHex(h, s, Math.max(l - 30, 10)), // Darker
          hslToHex(h, s, Math.min(l + 30, 90)), // Lighter
          hslToHex(h, Math.max(s - 30, 10), l), // Less saturated
          hslToHex(h, Math.min(s + 30, 100), l), // More saturated
        ]
      case "triadic":
        return [
          hslToHex(h, s, l), // Base color
          hslToHex((h + 120) % 360, s, l), // +120 degrees
          hslToHex((h + 240) % 360, s, l), // +240 degrees
          hslToHex(h, s, Math.max(l - 20, 10)), // Darker base
          hslToHex(h, s, Math.min(l + 20, 90)), // Lighter base
        ]
      case "complementary":
        return [
          hslToHex(h, s, l), // Base color
          hslToHex((h + 180) % 360, s, l), // Complementary
          hslToHex(h, s, Math.max(l - 20, 10)), // Darker base
          hslToHex(h, s, Math.min(l + 20, 90)), // Lighter base
          hslToHex((h + 180) % 360, s, Math.max(l - 20, 10)), // Darker complementary
        ]
      default:
        return colors
    }
  }

  // Function to convert hex to HSL
  const hexToHsl = (hex: string): { h: number; s: number; l: number } => {
    // Remove the # if present
    hex = hex.replace(/^#/, "")

    // Parse the hex values
    const r = Number.parseInt(hex.substring(0, 2), 16) / 255
    const g = Number.parseInt(hex.substring(2, 4), 16) / 255
    const b = Number.parseInt(hex.substring(4, 6), 16) / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0,
      s = 0,
      l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
      }

      h /= 6
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    }
  }

  // Function to convert HSL to hex
  const hslToHex = (h: number, s: number, l: number): string => {
    h /= 360
    s /= 100
    l /= 100

    let r, g, b

    if (s === 0) {
      r = g = b = l
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1 / 6) return p + (q - p) * 6 * t
        if (t < 1 / 2) return q
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
        return p
      }

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q

      r = hue2rgb(p, q, h + 1 / 3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1 / 3)
    }

    const toHex = (x: number) => {
      const hex = Math.round(x * 255).toString(16)
      return hex.length === 1 ? "0" + hex : hex
    }

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
  }

  // Function to generate a random color palette
  const generateRandomPalette = () => {
    const randomHue = Math.floor(Math.random() * 360)
    setHue(randomHue)
    const newBaseColor = hslToHex(randomHue, saturation, lightness)
    setBaseColor(newBaseColor)
  }

  // Function to extract colors from an image
  const extractColorsFromImage = async () => {
    if (!imageUrl) return

    setExtracting(true)

    try {
      // In a real implementation, this would call an API to extract colors
      // For now, we'll simulate it with a timeout and random colors
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate 5 "extracted" colors (simulated)
      const extractedColors = Array(5)
        .fill(0)
        .map(() => {
          const h = Math.floor(Math.random() * 360)
          const s = 70 + Math.floor(Math.random() * 30)
          const l = 40 + Math.floor(Math.random() * 40)
          return hslToHex(h, s, l)
        })

      setColors(extractedColors)
      onSelectPalette(extractedColors)
      setHarmonyType("custom")
    } catch (error) {
      console.error("Error extracting colors:", error)
    } finally {
      setExtracting(false)
    }
  }

  // Function to handle color change
  const handleColorChange = (index: number, newColor: string) => {
    const newColors = [...colors]
    newColors[index] = newColor
    setColors(newColors)
    setHarmonyType("custom")
    onSelectPalette(newColors)
  }

  // Function to copy color to clipboard
  const copyToClipboard = (color: string, index: number) => {
    navigator.clipboard.writeText(color)
    setCopied(index)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <ScrollReveal>
      <GlassCard className="p-6">
        <h2 className="text-xl font-bold mb-4">Color Palette Generator</h2>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="palette" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span>Palette</span>
            </TabsTrigger>
            <TabsTrigger value="adjust" className="flex items-center gap-2">
              <Droplet className="h-4 w-4" />
              <span>Adjust</span>
            </TabsTrigger>
            <TabsTrigger value="extract" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              <span>Extract</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="palette">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {["analogous", "monochromatic", "triadic", "complementary"].map((type) => (
                  <Button
                    key={type}
                    variant={harmonyType === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setHarmonyType(type as any)}
                    className="capitalize"
                  >
                    {type}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateRandomPalette}
                  className="ml-auto flex items-center gap-1"
                >
                  <RefreshCw className="h-3 w-3" />
                  Random
                </Button>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {colors.map((color, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className="w-full aspect-square rounded-md mb-2 cursor-pointer relative group"
                      style={{ backgroundColor: color }}
                      onClick={() => copyToClipboard(color, index)}
                    >
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                        {copied === index ? (
                          <Check className="h-6 w-6 text-white" />
                        ) : (
                          <Copy className="h-5 w-5 text-white" />
                        )}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Input
                        type="color"
                        value={color}
                        onChange={(e) => handleColorChange(index, e.target.value)}
                        className="w-6 h-6 p-0 border-0 rounded-full overflow-hidden"
                        style={{ backgroundColor: "transparent" }}
                      />
                      <Input
                        type="text"
                        value={color}
                        onChange={(e) => handleColorChange(index, e.target.value)}
                        className="w-full h-7 text-xs ml-1"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-4 bg-muted/20 rounded-md">
                <h3 className="text-sm font-medium mb-2">Preview</h3>
                <div className="space-y-2">
                  <div className="h-8 rounded-md" style={{ backgroundColor: colors[0] }}></div>
                  <div className="flex gap-2">
                    <div className="h-8 flex-1 rounded-md" style={{ backgroundColor: colors[1] }}></div>
                    <div className="h-8 flex-1 rounded-md" style={{ backgroundColor: colors[2] }}></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 flex-1 rounded-md" style={{ backgroundColor: colors[3] }}></div>
                    <div className="h-8 flex-1 rounded-md" style={{ backgroundColor: colors[4] }}></div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="adjust">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium">Hue</label>
                  <span className="text-sm text-muted-foreground">{hue}°</span>
                </div>
                <Slider
                  value={[hue]}
                  min={0}
                  max={360}
                  step={1}
                  onValueChange={(value) => setHue(value[0])}
                  className="mb-6"
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium">Saturation</label>
                  <span className="text-sm text-muted-foreground">{saturation}%</span>
                </div>
                <Slider
                  value={[saturation]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => setSaturation(value[0])}
                  className="mb-6"
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium">Lightness</label>
                  <span className="text-sm text-muted-foreground">{lightness}%</span>
                </div>
                <Slider
                  value={[lightness]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => setLightness(value[0])}
                  className="mb-6"
                />
              </div>

              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-md"
                  style={{ backgroundColor: baseColor }}
                  onClick={() => copyToClipboard(baseColor, -1)}
                ></div>
                <div>
                  <p className="font-medium">{baseColor}</p>
                  <p className="text-sm text-muted-foreground">
                    HSL: {hue}°, {saturation}%, {lightness}%
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="extract">
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter image URL"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={extractColorsFromImage} disabled={!imageUrl || extracting}>
                  {extracting ? "Extracting..." : "Extract"}
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>Upload or enter the URL of an image to extract a color palette.</p>
                <p className="mt-1">
                  Tip: Choose images with distinct colors for the best results. Photos of nature, art, or design work
                  well.
                </p>
              </div>

              {imageUrl && (
                <div className="mt-4 relative rounded-md overflow-hidden">
                  <img
                    src={imageUrl || "/placeholder.svg"}
                    alt="Source for color extraction"
                    className="w-full h-auto max-h-48 object-cover"
                    onError={() => {
                      setImageUrl("")
                      alert("Error loading image. Please check the URL and try again.")
                    }}
                  />
                  {extracting && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <div className="flex flex-col items-center">
                        <Sparkles className="h-8 w-8 text-white animate-pulse" />
                        <p className="text-white mt-2">Extracting colors...</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {colors.length > 0 && harmonyType === "custom" && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Extracted Colors</h3>
                  <div className="grid grid-cols-5 gap-2">
                    {colors.map((color, index) => (
                      <div
                        key={index}
                        className="aspect-square rounded-md cursor-pointer relative group"
                        style={{ backgroundColor: color }}
                        onClick={() => copyToClipboard(color, index)}
                      >
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                          {copied === index ? (
                            <Check className="h-6 w-6 text-white" />
                          ) : (
                            <Copy className="h-5 w-5 text-white" />
                          )}
                        </div>
                      </div>
                    ))}
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
