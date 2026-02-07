import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Public routes that don't require authentication
const publicRoutes = [
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
  "/api/auth",
]

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ["/sign-in", "/sign-up", "/forgot-password"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if route is public
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  // Get auth token from cookie or header
  const token = request.cookies.get("accessToken")?.value

  // If accessing auth routes while logged in, redirect to dashboard
  if (authRoutes.includes(pathname) && token) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // If accessing protected route without token, redirect to sign-in
  if (!isPublicRoute && !token) {
    const signInUrl = new URL("/sign-in", request.url)
    signInUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.).*)",
  ],
}
