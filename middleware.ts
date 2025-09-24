import { updateSession } from "@/lib/supabase/middleware"
import { NextResponse, type NextRequest } from "next/server"

// Public, read-only routes (no auth required)
const PUBLIC_PATHS: (string | RegExp)[] = [
  "/",
  "/colleges",
  /^\/colleges\/[^/]+\/departments$/,
  /^\/colleges\/[^/]+\/departments\/[^/]+\/semesters$/,
  /^\/colleges\/[^/]+\/departments\/[^/]+\/semesters\/[^/]+\/subjects$/,
  /^\/colleges\/[^/]+\/departments\/[^/]+\/semesters\/[^/]+\/subjects\/[^/]+\/files$/,
  // Books section (public browse)
  "/books",
  /^\/books\/[\w%\- ]+$/,
  /^\/books\/[\w%\- ]+\/[\w%\- ]+$/,
]

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => (p instanceof RegExp ? p.test(pathname) : p === pathname))
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Always allow public assets
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon.ico") ||
    /\.(svg|png|jpg|jpeg|gif|webp|ico)$/.test(pathname)
  ) {
    return NextResponse.next()
  }

  // Allow public, read-only pages without forcing auth
  if (isPublicPath(pathname)) {
    return NextResponse.next()
  }

  // For all other paths, keep session/auth middleware
  return await updateSession(request)
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
