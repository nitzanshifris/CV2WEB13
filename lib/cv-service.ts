import { supabase } from "./supabase"
import { createServerComponentClient } from "./supabase"

export async function getCVTemplates(userId: string) {
  const { data, error } = await supabase
    .from("cv_templates")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function getCVTemplateById(id: string) {
  const { data, error } = await supabase.from("cv_templates").select("*").eq("id", id).single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function createCVTemplate(userId: string, title: string, content: any, templateType = "professional") {
  const { data, error } = await supabase
    .from("cv_templates")
    .insert([
      {
        user_id: userId,
        title,
        content,
        template_type: templateType,
        is_public: false,
      },
    ])
    .select()

  if (error) {
    throw new Error(error.message)
  }

  return data[0]
}

export async function updateCVTemplate(id: string, updates: any) {
  const { data, error } = await supabase
    .from("cv_templates")
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

export async function deleteCVTemplate(id: string) {
  const { error } = await supabase.from("cv_templates").delete().eq("id", id)

  if (error) {
    throw new Error(error.message)
  }

  return true
}

// פונקציה לשימוש בצד השרת
export async function getPublicCVTemplates() {
  const serverSupabase = createServerComponentClient()

  const { data, error } = await serverSupabase
    .from("cv_templates")
    .select("*")
    .eq("is_public", true)
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data
}
