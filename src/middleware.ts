// ============================================
// TOOLVAULT PRO — MIDDLEWARE
// Auth Guard + Security Headers + Rate Limit
// ============================================
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ============================================
// PROTECTED ROUTES
// ============================================
const PROTECTED_ROUTES = [
  '/dashboard',
  '/profile',
  '/tools',
  '/saved',
  '/settings',
]

// ============================================
// AUTH ROUTES (redirect if logged in)
// ============================================
const AUTH_ROUTES = [
  '/auth/login',
  '/auth/register',
]

// ============================================
// PUBLIC ROUTES (always accessible)
// ============================================
const PUBLIC_ROUTES = [
  '/',
  '/auth/callback',
  '/auth/verify',
]

// ============================================
// SECURITY HEADERS
// ============================================
function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.hcaptcha.com https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://*.cloudinary.com https://*.supabase.co",
      "connect-src 'self' https://*.supabase.co https://api.groq.com https://hcaptcha.com",
      "frame-src https://js.hcaptcha.com",
    ].join('; ')
  )
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  )
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains'
  )
  return response
}

// ============================================
// RATE LIMIT — Edge (lightweight)
// ============================================
const requestCounts = new Map<string, { count: number; reset: number }>()

function edgeRateLimit(ip: string): boolean {
  const now = Date.now()
  const windowMs = 60 * 1000 // 1 minute
  const maxRequests = 120

  const current = requestCounts.get(ip)

  if (!current || now > current.reset) {
    requestCounts.set(ip, { count: 1, reset: now + windowMs })
    return true
  }

  if (current.count >= maxRequests) return false

  current.count++
  return true
}

// ============================================
// GET IP
// ============================================
function getClientIP(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    request.headers.get('x-real-ip') ??
    'anonymous'
  )
}

// ============================================
// MAIN MIDDLEWARE
// ============================================
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const ip = getClientIP(request)

  // 1. Edge Rate Limit Check
  if (!edgeRateLimit(ip)) {
    return new NextResponse(
      JSON.stringify({
        success: false,
        error: 'Too many requests',
      }),
      {
        status: 429,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }

  // 2. Create response
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  // 3. Supabase auth client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 4. Get session
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 5. Protected route — redirect to login
  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  )

  if (isProtected && !user) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return addSecurityHeaders(NextResponse.redirect(loginUrl))
  }

  // 6. Auth route — redirect to dashboard if logged in
  const isAuthRoute = AUTH_ROUTES.some((route) =>
    pathname.startsWith(route)
  )

  if (isAuthRoute && user) {
    return addSecurityHeaders(
      NextResponse.redirect(new URL('/dashboard', request.url))
    )
  }

  // 7. Check onboarding
  if (user && pathname.startsWith('/dashboard')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_done, is_banned')
      .eq('id', user.id)
      .single()

    // Banned user
    if (profile?.is_banned) {
      await supabase.auth.signOut()
      return addSecurityHeaders(
        NextResponse.redirect(new URL('/auth/login?banned=true', request.url))
      )
    }

    // Onboarding not done
    if (!profile?.onboarding_done && pathname !== '/onboarding') {
      return addSecurityHeaders(
        NextResponse.redirect(new URL('/onboarding', request.url))
      )
    }
  }

  // 8. Add security headers to all responses
  return addSecurityHeaders(response)
}

// ============================================
// MATCHER — Which routes middleware runs on
// ============================================
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
