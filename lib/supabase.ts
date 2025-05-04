import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Basic client for client-side usage
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// For client-side usage
export function createBrowserSupabaseClient() {
  return createClient<Database>(supabaseUrl, supabaseAnonKey)
}

// For backward compatibility
export function createClientComponentClient() {
  return createBrowserSupabaseClient()
}

// For server-side usage in pages/ directory (Pages Router)
export function createServerSupabaseClient(context?: { req: any; res: any }) {
  // If no context is provided or we're on the client side, return a basic client
  if (!context?.req || typeof window !== "undefined") {
    return createClient<Database>(supabaseUrl, supabaseAnonKey)
  }

  // For server-side in pages/ directory, use the cookies from the request
  const { createServerComponentClient: createServerClient } = require("@supabase/auth-helpers-nextjs")

  return createServerClient<Database>({
    cookies: {
      getAll: () => {
        const cookies = context.req.cookies
        return Object.entries(cookies).map(([name, value]) => ({
          name,
          value,
        }))
      },
      get: (name: string) => {
        const cookies = context.req.cookies
        const value = cookies[name]
        return value ? { name, value } : undefined
      },
      set: () => {}, // Not needed for read operations
      remove: () => {}, // Not needed for read operations
    },
  })
}

// For backward compatibility
export function createServerComponentClient(context?: { req: any; res: any }) {
  return createServerSupabaseClient(context)
}

// Mock function to get public templates
export function getPublicTemplates() {
  return [
    {
      id: 1,
      title: "Professional Resume",
      description: "A clean, professional template for corporate positions",
      image: "/professional-headshot.png",
      category: "professional",
      template_type: "professional",
      preview_image: "/professional-headshot.png",
    },
    {
      id: 2,
      title: "Creative Portfolio",
      description: "Showcase your creative work with this modern template",
      image: "/minimal-website-template.png",
      category: "creative",
      template_type: "creative",
      preview_image: "/minimal-website-template.png",
    },
    {
      id: 3,
      title: "Minimal CV",
      description: "A minimalist approach for a clean, focused presentation",
      image: "/abstract-geometric-shapes.png",
      category: "minimal",
      template_type: "minimal",
      preview_image: "/abstract-geometric-shapes.png",
    },
  ]
}
