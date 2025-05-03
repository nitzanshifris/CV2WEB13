import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // בדיקה אם הנתיב הוא נתיב מוגן
  const isProtectedRoute = ["/dashboard", "/upload", "/profile", "/settings"].some((route) =>
    pathname.startsWith(route),
  )

  try {
    // בדיקה אם המשתמש מאומת
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET || "development-secret-do-not-use-in-production",
    })

    const isAuthenticated = !!token

    // הפניית משתמשים לא מאומתים לדף הכניסה
    if (isProtectedRoute && !isAuthenticated) {
      const url = new URL("/login", request.url)
      url.searchParams.set("callbackUrl", encodeURI(pathname))
      return NextResponse.redirect(url)
    }

    // הפניית משתמשים מאומתים מדפי אימות
    if ((pathname === "/login" || pathname === "/register") && isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  } catch (error) {
    console.error("Auth middleware error:", error)

    // במקרה של שגיאת אימות בנתיבים מוגנים, הפנייה לדף הכניסה
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

// הגדרת נתיבים להתאמה
export const config = {
  matcher: ["/dashboard/:path*", "/upload/:path*", "/profile/:path*", "/settings/:path*", "/login", "/register"],
}
