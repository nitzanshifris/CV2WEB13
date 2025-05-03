"use client"

import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { useSearch } from "./search-provider"

export function SearchButton() {
  const { openSearch } = useSearch()

  return (
    <Button
      variant="outline"
      size="sm"
      className="w-full justify-between text-muted-foreground sm:w-64"
      onClick={openSearch}
    >
      <div className="flex items-center">
        <Search className="ml-2 h-4 w-4" />
        <span>Search...</span>
      </div>
      <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs sm:flex">
        <span className="text-xs">⌘</span>K
      </kbd>
    </Button>
  )
}
