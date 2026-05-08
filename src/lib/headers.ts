// ============================================
// TOOLVAULT PRO — API RESPONSE HEADERS
// ============================================
import type { ApiResponse } from '@/types'

// ============================================
// SUCCESS RESPONSE
// ============================================
export function successResponse<T>(
  data: T,
  message?: string,
  status: number = 200
): Response {
  const body: ApiResponse<T> = {
    success: true,
    data,
    message,
  }

  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}

// ============================================
// ERROR RESPONSE
// ============================================
export function errorResponse(
  error: string,
  status: number = 400
): Response {
  const body: ApiResponse = {
    success: false,
    error,
  }

  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}

// ============================================
// UNAUTHORIZED RESPONSE
// ============================================
export function unauthorizedResponse(): Response {
  return errorResponse('Unauthorized — please login', 401)
}

// ============================================
// SERVER ERROR RESPONSE
// ============================================
export function serverErrorResponse(
  error?: unknown
): Response {
  const isDev = process.env.NODE_ENV === 'development'
  const message = isDev && error instanceof Error
    ? error.message
    : 'Internal server error'

  return errorResponse(message, 500)
}

// ============================================
// VALIDATION ERROR RESPONSE
// ============================================
export function validationErrorResponse(
  errors: string[]
): Response {
  return new Response(
    JSON.stringify({
      success: false,
      error: 'Validation failed',
      errors,
    }),
    {
      status: 422,
      headers: { 'Content-Type': 'application/json' },
    }
  )
}
