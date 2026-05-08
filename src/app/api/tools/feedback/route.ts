// ============================================
// TOOLVAULT PRO — FEEDBACK API ROUTE
// ============================================
import { createClient } from '@/lib/supabase/server'
import { validateInput, feedbackSchema } from '@/lib/sanitize'
import { checkRateLimit } from '@/lib/rateLimit'
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  validationErrorResponse,
  serverErrorResponse,
} from '@/lib/headers'

// POST — Submit feedback
export async function POST(request: Request) {
  try {
    // 1. Rate limit
    const { limited, response: limitRes } = await checkRateLimit(
      request,
      'general'
    )
    if (limited) return limitRes!

    // 2. Auth
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return unauthorizedResponse()

    // 3. Validate
    const body = await request.json()
    const validation = validateInput(feedbackSchema, body)
    if (!validation.success) {
      return validationErrorResponse(validation.errors)
    }

    const { tool_slug, rating, message } = validation.data

    // 4. Check existing feedback for this tool
    const { data: existing } = await supabase
      .from('feedback')
      .select('id')
      .eq('user_id', user.id)
      .eq('tool_slug', tool_slug)
      .single()

    if (existing) {
      // Update existing
      const { error } = await supabase
        .from('feedback')
        .update({ rating, message: message ?? null })
        .eq('id', existing.id)

      if (error) return errorResponse(error.message, 400)
      return successResponse(null, 'Feedback updated')
    }

    // 5. Insert new feedback
    const { error } = await supabase
      .from('feedback')
      .insert({
        user_id: user.id,
        tool_slug,
        rating,
        message: message ?? null,
      })

    if (error) return errorResponse(error.message, 400)

    return successResponse(null, 'Feedback submitted', 201)
  } catch (error) {
    return serverErrorResponse(error)
  }
}

// GET — Get feedback for a tool
export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return unauthorizedResponse()

    const { searchParams } = new URL(request.url)
    const toolSlug = searchParams.get('tool')

    if (!toolSlug) {
      return errorResponse('Tool slug required', 400)
    }

    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .eq('user_id', user.id)
      .eq('tool_slug', toolSlug)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    return successResponse(data ?? null)
  } catch (error) {
    return serverErrorResponse(error)
  }
}
