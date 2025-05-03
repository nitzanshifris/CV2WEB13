"use client"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import {
  GlassDropdownMenu,
  GlassDropdownMenuContent,
  GlassDropdownMenuItem,
  GlassDropdownMenuTrigger,
} from "@/components/glassmorphism/glass-dropdown"
import { GlassButton } from "@/components/glassmorphism/glass-button"

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <GlassDropdownMenu>
      <GlassDropdownMenuTrigger asChild>
        <GlassButton size="icon" className="relative" variant="outline">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </GlassButton>
      </GlassDropdownMenuTrigger>
      <GlassDropdownMenuContent align="end" depth={3}>
        <GlassDropdownMenuItem onClick={() => setTheme("light")}>Light</GlassDropdownMenuItem>
        <GlassDropdownMenuItem onClick={() => setTheme("dark")}>Dark</GlassDropdownMenuItem>
        <GlassDropdownMenuItem onClick={() => setTheme("system")}>System</GlassDropdownMenuItem>
      </GlassDropdownMenuContent>
    </GlassDropdownMenu>
  )
}
