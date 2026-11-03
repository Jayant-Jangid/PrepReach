import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ACCESS_TOKEN_KEY = 'prepreach_access_token'

// Route → allowed role(s)
const PROTECTED_ROUTES: Record<string, string[]> = {
  '/student': ['student'],
  '/instructor': ['instructor'],
  '/admin': ['admin'],
}

function getRoleFromToken(token: string): string | null {
  try {
    // JWT payload is base64url-encoded — decode without verification (server-side verify happens in API)
    const payload = token.split('.')[1]
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'))
    return decoded.role ?? null
  } catch {
    return null
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Find matching protected prefix
  const matchedPrefix = Object.keys(PROTECTED_ROUTES).find((prefix) =>
    pathname.startsWith(prefix)
  )

  if (!matchedPrefix) return NextResponse.next()

  const token = request.cookies.get(ACCESS_TOKEN_KEY)?.value

  if (!token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  const role = getRoleFromToken(token)
  const allowedRoles = PROTECTED_ROUTES[matchedPrefix]

  if (!role || !allowedRoles.includes(role)) {
    // Authenticated but wrong role → redirect to their own dashboard
    if (role === 'student') return NextResponse.redirect(new URL('/student/dashboard', request.url))
    if (role === 'instructor') return NextResponse.redirect(new URL('/instructor/dashboard', request.url))
    if (role === 'admin') return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/student/:path*', '/instructor/:path*', '/admin/:path*'],
}
