// This file is only used in app/ directory components
// It's placed in app/api/_lib to ensure it's only loaded in the app/ directory
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"

// Create a Supabase client for app/ directory
export function createAppServerClient() {
  const cookieStore = cookies()
  return createServerComponentClient<Database>({ cookies: () => cookieStore })
}

// Get the session in app/ directory
export async function getAppServerSession() {
  const supabase = createAppServerClient()
  const { data } = await supabase.auth.getSession()
  return data.session
}
