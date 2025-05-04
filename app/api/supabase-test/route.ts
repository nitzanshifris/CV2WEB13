import { createServerSupabaseClient } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()
    const { data } = await supabase.from("users").select("*").limit(5)

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Supabase test error:", error)
    return NextResponse.json({ success: false, error: "Failed to connect to Supabase" }, { status: 500 })
  }
}
