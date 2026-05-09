// ============================================
// TOOLVAULT PRO — MIDDLEWARE (FIXED)
// ============================================
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED_ROUTES = [
  '/dashboard',
  '/profile',
  '/tools',
  '/saved',
  '/settings',
  '/analytics',
  '/collections',
  '/compare',
  '/leaderboard',
  '/onboarding',
]

const AUTH_ROUTES = [
  '/auth/login',
  '/auth/register',
]

function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  return response
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  // Check env vars exist
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    // Env missing — allow all routes, dont crash
    return addSecurityHeaders(NextResponse.next())
  }

  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  try {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    })

    const { data: { user } } = await supabase.auth.getUser()

    const isProtected = PROTECTED_ROUTES.some((route) =>
      pathname.startsWith(route)
    )
    const isAuthRoute = AUTH_ROUTES.some((route) =>
      pathname.startsWith(route)
    )

    // Not logged in + protected route → login
    if (isProtected && !user) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return addSecurityHeaders(NextResponse.redirect(loginUrl))
    }

    // Logged in + auth route → dashboard
    if (isAuthRoute && user) {
      return addSecurityHeaders(
        NextResponse.redirect(new URL('/dashboard', request.url))
      )
    }

    // Onboarding check
    if (user && pathname.startsWith('/dashboard')) {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_done, is_banned')
          .eq('id', user.id)
          .single()

        if (profile?.is_banned) {
          await supabase.auth.signOut()
          return addSecurityHeaders(
            NextResponse.redirect(
              new URL('/auth/login?banned=true', request.url)
            )
          )
        }

        if (!profile?.onboarding_done && pathname !== '/onboarding') {
          return addSecurityHeaders(
            NextResponse.redirect(new URL('/onboarding', request.url))
          )
        }
      } catch {
        // DB error — allow through
      }
    }
  } catch {
    // Middleware crash — allow through safely
    return addSecurityHeaders(NextResponse.next())
  }

  return addSecurityHeaders(response)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
