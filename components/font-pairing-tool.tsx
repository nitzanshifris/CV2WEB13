"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/glassmorphism/glass-card"
import { ScrollReveal } from "@/components/scroll-reveal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RefreshCw, Type, Check, Star } from "lucide-react"

interface FontPairingToolProps {
  onSelectFonts: (fonts: { heading: string; body: string }) => void
  initialFonts?: { heading: string; body: string }
}

export function FontPairingTool({ onSelectFonts, initialFonts }: FontPairingToolProps) {
  const [activeTab, setActiveTab] = useState("popular")
  const [headingFont, setHeadingFont] = useState(initialFonts?.heading || "Inter")
  const [bodyFont, setBodyFont] = useState(initialFonts?.body || "Inter")
  const [fontSize, setFontSize] = useState(16)
  const [lineHeight, setLineHeight] = useState(1.6)
  const [letterSpacing, setLetterSpacing] = useState(0)
  const [fontWeight, setFontWeight] = useState(400)
  const [useCustom, setUseCustom] = useState(false)
  const [favorites, setFavorites] = useState<Array<{ heading: string; body: string }>>([])

  // Popular font pairings
  const popularPairings = [
    { heading: "Playfair Display", body: "Source Sans Pro" },
    { heading: "Montserrat", body: "Merriweather" },
    { heading: "Raleway", body: "Roboto" },
    { heading: "Oswald", body: "Lato" },
    { heading: "Lora", body: "Open Sans" },
    { heading: "Archivo Black", body: "Judson" },
    { heading: "Roboto Slab", body: "Roboto" },
    { heading: "Poppins", body: "Lora" },
    { heading: "Work Sans", body: "Bitter" },
    { heading: "Nunito", body: "PT Sans" },
  ]

  // Available fonts
  const availableFonts = [
    "Inter",
    "Roboto",
    "Open Sans",
    "Lato",
    "Montserrat",
    "Poppins",
    "Raleway",
    "Oswald",
    "Playfair Display",
    "Merriweather",
    "Source Sans Pro",
    "Roboto Slab",
    "Lora",
    "Work Sans",
    "Nunito",
    "PT Sans",
    "Bitter",
    "Archivo Black",
    "Judson",
    "Fira Sans",
    "Noto Sans",
    "Noto Serif",
    "IBM Plex Sans",
    "IBM Plex Serif",
  ]

  // Function to apply a font pairing
  const applyFontPairing = (heading: string, body: string) => {
    setHeadingFont(heading)
    setBodyFont(body)
    onSelectFonts({ heading, body })
  }

  // Function to generate a random pairing
  const generateRandomPairing = () => {
    const randomHeading = availableFonts[Math.floor(Math.random() * availableFonts.length)]
    let randomBody = availableFonts[Math.floor(Math.random() * availableFonts.length)]

    // Make sure body font is different from heading
    while (randomBody === randomHeading) {
      randomBody = availableFonts[Math.floor(Math.random() * availableFonts.length)]
    }

    applyFontPairing(randomHeading, randomBody)
  }

  // Function to toggle a favorite
  const toggleFavorite = (heading: string, body: string) => {
    const existingIndex = favorites.findIndex((f) => f.heading === heading && f.body === body)

    if (existingIndex >= 0) {
      // Remove from favorites
      setFavorites(favorites.filter((_, i) => i !== existingIndex))
    } else {
      // Add to favorites
      setFavorites([...favorites, { heading, body }])
    }
  }

  // Check if a pairing is in favorites
  const isFavorite = (heading: string, body: string) => {
    return favorites.some((f) => f.heading === heading && f.body === body)
  }

  return (
    <ScrollReveal>
      <GlassCard className="p-6">
        <h2 className="text-xl font-bold mb-4">Font Pairing Tool</h2>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="popular" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              <span>Popular</span>
            </TabsTrigger>
            <TabsTrigger value="custom" className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              <span>Custom</span>
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              <span>Favorites</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="popular">
            <div className="space-y-4">
              <div className="flex justify-between mb-4">
                <h3 className="text-sm font-medium">Popular Font Pairings</h3>
                <Button variant="outline" size="sm" onClick={generateRandomPairing} className="flex items-center gap-1">
                  <RefreshCw className="h-3 w-3" />
                  Random
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {popularPairings.map((pair, index) => (
                  <div
                    key={index}
                    className="border rounded-md p-4 cursor-pointer hover:border-primary transition-colors"
                    onClick={() => applyFontPairing(pair.heading, pair.body)}
                  >
                    <div className="flex justify-between mb-2">
                      <div>
                        <h4 className="text-sm font-medium">
                          {pair.heading} + {pair.body}
                        </h4>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(pair.heading, pair.body)
                        }}
                      >
                        <Star
                          className={`h-4 w-4 ${
                            isFavorite(pair.heading, pair.body) ? "fill-yellow-400 text-yellow-400" : ""
                          }`}
                        />
                      </Button>
                    </div>
                    <div style={{ fontFamily: pair.heading }} className="text-xl font-bold mb-2 truncate">
                      Heading Font: {pair.heading}
                    </div>
                    <div style={{ fontFamily: pair.body }} className="text-sm truncate">
                      Body Font: {pair.body}. This is how your text will look.
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="custom">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Heading Font</label>
                  <Select
                    value={headingFont}
                    onValueChange={(value) => {
                      setHeadingFont(value)
                      onSelectFonts({ heading: value, body: bodyFont })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a font" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableFonts.map((font) => (
                        <SelectItem key={font} value={font}>
                          <span style={{ fontFamily: font }}>{font}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Body Font</label>
                  <Select
                    value={bodyFont}
                    onValueChange={(value) => {
                      setBodyFont(value)
                      onSelectFonts({ heading: headingFont, body: value })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a font" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableFonts.map((font) => (
                        <SelectItem key={font} value={font}>
                          <span style={{ fontFamily: font }}>{font}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="advanced-options" checked={useCustom} onCheckedChange={setUseCustom} />
                <Label htmlFor="advanced-options">Advanced Options</Label>
              </div>

              {useCustom && (
                <div className="space-y-4 p-4 bg-muted/20 rounded-md">
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium">Font Size</label>
                      <span className="text-sm text-muted-foreground">{fontSize}px</span>
                    </div>
                    <Slider
                      value={[fontSize]}
                      min={12}
                      max={24}
                      step={1}
                      onValueChange={(value) => setFontSize(value[0])}
                      className="mb-6"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium">Line Height</label>
                      <span className="text-sm text-muted-foreground">{lineHeight}</span>
                    </div>
                    <Slider
                      value={[lineHeight * 10]}
                      min={10}
                      max={25}
                      step={1}
                      onValueChange={(value) => setLineHeight(value[0] / 10)}
                      className="mb-6"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium">Letter Spacing</label>
                      <span className="text-sm text-muted-foreground">{letterSpacing}px</span>
                    </div>
                    <Slider
                      value={[letterSpacing + 5]}
                      min={0}
                      max={10}
                      step={1}
                      onValueChange={(value) => setLetterSpacing(value[0] - 5)}
                      className="mb-6"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium">Font Weight</label>
                      <span className="text-sm text-muted-foreground">{fontWeight}</span>
                    </div>
                    <Slider
                      value={[fontWeight / 100]}
                      min={3}
                      max={9}
                      step={1}
                      onValueChange={(value) => setFontWeight(value[0] * 100)}
                      className="mb-6"
                    />
                  </div>
                </div>
              )}

              <div className="mt-4 p-4 bg-muted/20 rounded-md">
                <h3 className="text-sm font-medium mb-4">Preview</h3>
                <div>
                  <h4
                    style={{
                      fontFamily: headingFont,
                      fontWeight: useCustom ? fontWeight : 700,
                      letterSpacing: useCustom ? `${letterSpacing}px` : undefined,
                    }}
                    className="text-2xl mb-2"
                  >
                    This is a heading in {headingFont}
                  </h4>
                  <p
                    style={{
                      fontFamily: bodyFont,
                      fontSize: useCustom ? `${fontSize}px` : undefined,
                      lineHeight: useCustom ? lineHeight : undefined,
                      letterSpacing: useCustom ? `${letterSpacing}px` : undefined,
                      fontWeight: useCustom ? fontWeight : 400,
                    }}
                  >
                    This is body text in {bodyFont}. The quick brown fox jumps over the lazy dog. This paragraph
                    demonstrates how your content will look with the selected font pairing. Good typography improves
                    readability and enhances the user experience of your website.
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => toggleFavorite(headingFont, bodyFont)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Star
                    className={`h-4 w-4 ${isFavorite(headingFont, bodyFont) ? "fill-yellow-400 text-yellow-400" : ""}`}
                  />
                  {isFavorite(headingFont, bodyFont) ? "Remove from Favorites" : "Add to Favorites"}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="favorites">
            <div className="space-y-4">
              {favorites.length === 0 ? (
                <div className="text-center py-8">
                  <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add font pairings to your favorites to see them here.
                  </p>
                  <Button onClick={() => setActiveTab("popular")}>Browse Popular Pairings</Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {favorites.map((pair, index) => (
                    <div
                      key={index}
                      className="border rounded-md p-4 cursor-pointer hover:border-primary transition-colors"
                      onClick={() => applyFontPairing(pair.heading, pair.body)}
                    >
                      <div className="flex justify-between mb-2">
                        <div>
                          <h4 className="text-sm font-medium">
                            {pair.heading} + {pair.body}
                          </h4>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFavorite(pair.heading, pair.body)
                          }}
                        >
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        </Button>
                      </div>
                      <div style={{ fontFamily: pair.heading }} className="text-xl font-bold mb-2 truncate">
                        Heading Font: {pair.heading}
                      </div>
                      <div style={{ fontFamily: pair.body }} className="text-sm truncate">
                        Body Font: {pair.body}. This is how your text will look.
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </GlassCard>
    </ScrollReveal>
  )
}
