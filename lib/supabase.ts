import { createClient } from "@supabase/supabase-js"
import { createClientComponentClient as createClientComponentClientHelper } from "@supabase/auth-helpers-nextjs"
import { createServerComponentClient as createServerComponentClientHelper } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// For client-side usage (CSR)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// For client components
export function createClientComponentClient() {
  return createClientComponentClientHelper<Database>()
}

// This function was missing - adding it back for backward compatibility
export function createBrowserSupabaseClient() {
  return createClientComponentClientHelper<Database>()
}

// For server components
export function createServerComponentClient() {
  return createServerComponentClientHelper<Database>({ cookies })
}

// Add this function for backward compatibility
export function createServerSupabaseClient() {
  return createServerComponentClientHelper<Database>({ cookies })
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
