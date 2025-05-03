"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SearchIcon, X, ArrowLeft } from "lucide-react"
import { useSearch } from "./search-provider"
import { searchContent } from "@/lib/search"

export function SearchDialog() {
  const { isOpen, closeSearch, searchQuery, setSearchQuery, openSearch } = useSearch()
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Handle search input changes
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      setIsLoading(true)
      const timer = setTimeout(() => {
        const searchResults = searchContent(searchQuery)
        setResults(searchResults)
        setIsLoading(false)
      }, 300)

      return () => clearTimeout(timer)
    } else {
      setResults([])
    }
  }, [searchQuery])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open search with Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        if (!isOpen) {
          openSearch()
        }
      }
      // Close with Escape
      if (e.key === "Escape" && isOpen) {
        closeSearch()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, closeSearch, openSearch])

  const handleResultClick = (result: SearchResult) => {
    closeSearch()
    router.push(result.url)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeSearch()}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0">
        <div className="flex items-center border-b p-4">
          <SearchIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            placeholder="Search CSS techniques..."
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          <Button variant="ghost" size="sm" className="mr-2" onClick={closeSearch}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        {searchQuery.trim().length > 1 && (
          <div className="px-4 py-2 text-sm text-muted-foreground">
            {isLoading ? "Searching..." : `${results.length} results for "${searchQuery}"`}
          </div>
        )}

        {results.length > 0 && (
          <ScrollArea className="max-h-[50vh] overflow-y-auto">
            <div className="p-4">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-1 p-3 rounded-md hover:bg-muted cursor-pointer"
                  onClick={() => handleResultClick(result)}
                >
                  <div className="font-medium">{result.title}</div>
                  <div className="text-sm text-muted-foreground">{result.section}</div>
                  <div className="text-sm mt-1">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: highlightText(result.content, searchQuery),
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        {searchQuery.trim().length > 1 && results.length === 0 && !isLoading && (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
          </div>
        )}

        <div className="p-4 border-t text-sm text-muted-foreground flex items-center justify-between">
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-muted rounded text-xs">ESC</kbd>
            <span>to close</span>
          </div>
          <div className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>to select</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Helper function to highlight search terms in results
function highlightText(text: string, query: string): string {
  if (!query.trim()) return text

  const regex = new RegExp(`(${escapeRegExp(query)})`, "gi")
  return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">$1</mark>')
}

// Helper function to escape special characters in regex
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

// Types
export interface SearchResult {
  title: string
  section: string
  content: string
  url: string
}
