import { createServerSupabaseClient, supabase } from "@/lib/supabase"

export async function getSession() {
  const serverSupabase = createServerSupabaseClient()

  try {
    const {
      data: { session },
    } = await serverSupabase.auth.getSession()

    return session
  } catch (error) {
    console.error("Error getting session:", error)
    return null
  }
}

export async function getUserDetails() {
  const session = await getSession()

  if (!session?.user) {
    return null
  }

  const serverSupabase = createServerSupabaseClient()

  try {
    const { data: user } = await serverSupabase.from("users").select("*").eq("id", session.user.id).single()

    return user
  } catch (error) {
    console.error("Error getting user details:", error)
    return null
  }
}

export async function signOut() {
  const serverSupabase = createServerSupabaseClient()
  await serverSupabase.auth.signOut()
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function signUp(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}
