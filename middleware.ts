import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the path is a protected route
  const isProtectedRoute = ["/dashboard", "/upload", "/profile", "/settings"].some((route) =>
    pathname.startsWith(route),
  )

  try {
    // Check if the user is authenticated
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    const isAuthenticated = !!token

    // Redirect unauthenticated users to the login page
    if (isProtectedRoute && !isAuthenticated) {
      const url = new URL("/login", request.url)
      url.searchParams.set("callbackUrl", encodeURI(pathname))
      return NextResponse.redirect(url)
    }

    // Redirect authenticated users from auth pages
    if ((pathname === "/login" || pathname === "/register") && isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  } catch (error) {
    console.error("Auth middleware error:", error)

    // In case of auth error on protected routes, redirect to login
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

// Configure paths to match
export const config = {
  matcher: ["/dashboard/:path*", "/upload/:path*", "/profile/:path*", "/settings/:path*", "/login", "/register"],
}
