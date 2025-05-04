import { supabase } from "./supabase"
import { createServerComponentClient } from "./supabase"

export async function getWebsites(userId: string) {
  const { data, error } = await supabase
    .from("websites")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function getWebsiteById(id: string) {
  const { data, error } = await supabase.from("websites").select("*").eq("id", id).single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function createWebsite(userId: string, title: string, content: any, settings: any) {
  const { data, error } = await supabase
    .from("websites")
    .insert([
      {
        user_id: userId,
        title,
        content,
        settings,
        published: false,
      },
    ])
    .select()

  if (error) {
    throw new Error(error.message)
  }

  return data[0]
}

export async function updateWebsite(id: string, updates: any) {
  const { data, error } = await supabase
    .from("websites")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()

  if (error) {
    throw new Error(error.message)
  }

  return data[0]
}

export async function deleteWebsite(id: string) {
  const { error } = await supabase.from("websites").delete().eq("id", id)

  if (error) {
    throw new Error(error.message)
  }

  return true
}

export async function publishWebsite(id: string, domain: string) {
  const { data, error } = await supabase
    .from("websites")
    .update({
      published: true,
      domain,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()

  if (error) {
    throw new Error(error.message)
  }

  return data[0]
}

// פונקציה לשימוש בצד השרת
export async function getPublishedWebsiteByDomain(domain: string) {
  const serverSupabase = createServerComponentClient()

  const { data, error } = await serverSupabase
    .from("websites")
    .select("*")
    .eq("domain", domain)
    .eq("published", true)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}
