import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { getToken } from "next-auth/jwt"

// רשימת נתיבים מוגנים
const protectedPaths = ["/dashboard", "/profile", "/upload", "/website"]

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const path = req.nextUrl.pathname

  // בדיקה אם הנתיב מוגן
  const isProtectedPath = protectedPaths.some(
    (protectedPath) => path === protectedPath || path.startsWith(`${protectedPath}/`),
  )

  if (isProtectedPath) {
    // Try NextAuth first
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    if (token) {
      return res
    }

    // If no NextAuth token, try Supabase
    const supabase = createMiddlewareClient({ req, res })
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // אם אין סשן תקף, הפנה להתחברות
    if (!session) {
      const url = new URL("/login", req.url)
      url.searchParams.set("callbackUrl", path)
      return NextResponse.redirect(url)
    }
  }

  return res
}

// Add config to specify which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - api/auth (NextAuth API routes)
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api/auth).*)",
  ],
}
