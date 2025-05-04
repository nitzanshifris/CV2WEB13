// This file is only used in app/ directory
import { cookies } from "next/headers"
import { createServerComponentClient as createNextServerClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"

// Re-export the createServerComponentClient function for app/ directory
export function createAppServerClient() {
  const cookieStore = cookies()
  return createNextServerClient<Database>({ cookies: () => cookieStore })
}

// This function is used in app/ directory components
export async function getServerSession() {
  const supabase = createAppServerClient()
  const { data } = await supabase.auth.getSession()
  return data.session
}
