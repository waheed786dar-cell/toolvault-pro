// ============================================
// TOOLVAULT PRO — RATE LIMITING (UPSTASH)
// ============================================
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { serverEnv } from './env'
import type { RateLimitResult } from '@/types'

// ============================================
// REDIS CLIENT
// ============================================
const redis = new Redis({
  url: serverEnv.upstashUrl,
  token: serverEnv.upstashToken,
})

// ============================================
// RATE LIMITERS — Different limits per route
// ============================================

// AI Tools — 10 requests per minute
const aiLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 m'),
  analytics: true,
  prefix: 'toolvault:ai',
})

// Auth — 5 attempts per 15 minutes
const authLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '15 m'),
  analytics: true,
  prefix: 'toolvault:auth',
})

// PDF Tools — 20 requests per 5 minutes
const pdfLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, '5 m'),
  analytics: true,
  prefix: 'toolvault:pdf',
})

// Image Tools — 15 requests per 5 minutes
const imageLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(15, '5 m'),
  analytics: true,
  prefix: 'toolvault:image',
})

// General API — 100 requests per minute
const generalLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 m'),
  analytics: true,
  prefix: 'toolvault:general',
})

// ============================================
// LIMITER TYPE
// ============================================
export type LimiterType = 'ai' | 'auth' | 'pdf' | 'image' | 'general'

function getLimiter(type: LimiterType): Ratelimit {
  switch (type) {
    case 'ai':      return aiLimiter
    case 'auth':    return authLimiter
    case 'pdf':     return pdfLimiter
    case 'image':   return imageLimiter
    case 'general': return generalLimiter
    default:        return generalLimiter
  }
}

// ============================================
// MAIN RATE LIMIT FUNCTION
// ============================================
export async function rateLimit(
  identifier: string,
  type: LimiterType = 'general'
): Promise<RateLimitResult> {
  try {
    const limiter = getLimiter(type)
    const result = await limiter.limit(identifier)

    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    }
  } catch (error) {
    console.error('Rate limit error:', error)
    // Fail open — allow request if Redis is down
    return {
      success: true,
      limit: 100,
      remaining: 99,
      reset: Date.now() + 60000,
    }
  }
}

// ============================================
// GET IP FROM REQUEST
// ============================================
export function getIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')

  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  if (realIP) return realIP

  return 'anonymous'
}

// ============================================
// RATE LIMIT RESPONSE HELPER
// ============================================
export function rateLimitResponse(result: RateLimitResult): Response {
  return new Response(
    JSON.stringify({
      success: false,
      error: 'Too many requests — please try again later',
      reset: new Date(result.reset).toISOString(),
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'X-RateLimit-Limit': result.limit.toString(),
        'X-RateLimit-Remaining': result.remaining.toString(),
        'X-RateLimit-Reset': result.reset.toString(),
        'Retry-After': Math.ceil((result.reset - Date.now()) / 1000).toString(),
      },
    }
  )
}

// ============================================
// COMBINED — CHECK + RESPOND
// ============================================
export async function checkRateLimit(
  request: Request,
  type: LimiterType = 'general'
): Promise<{ limited: boolean; response?: Response }> {
  const ip = getIP(request)
  const result = await rateLimit(ip, type)

  if (!result.success) {
    return {
      limited: true,
      response: rateLimitResponse(result),
    }
  }

  return { limited: false }
}
