// ============================================
// TOOLVAULT PRO — SAVE RESULTS ROUTE
// ============================================
import { createClient } from '@/lib/supabase/server'
import { validateInput, saveResultSchema } from '@/lib/sanitize'
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  validationErrorResponse,
  serverErrorResponse,
} from '@/lib/headers'

// POST — Save a result
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return unauthorizedResponse()

    const body = await request.json()
    const validation = validateInput(saveResultSchema, body)
    if (!validation.success) {
      return validationErrorResponse(validation.errors)
    }

    const { tool_slug, title, content, is_public, metadata } =
      validation.data

    // Check save limit (max 50 per user)
    const { count } = await supabase
      .from('saved_results')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if ((count ?? 0) >= 50) {
      return errorResponse(
        'Save limit reached (50 max). Delete some to save more.',
        429
      )
    }

    const { data, error } = await supabase
      .from('saved_results')
      .insert({
        user_id: user.id,
        tool_slug,
        title,
        content,
        is_public,
        metadata,
      })
      .select()
      .single()

    if (error) return errorResponse(error.message, 400)

    return successResponse(data, 'Result saved', 201)
  } catch (error) {
    return serverErrorResponse(error)
  }
}

// GET — Fetch all saved results
export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return unauthorizedResponse()

    const { searchParams } = new URL(request.url)
    const toolSlug = searchParams.get('tool')
    const limit = parseInt(searchParams.get('limit') ?? '20')

    let query = supabase
      .from('saved_results')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (toolSlug) {
      query = query.eq('tool_slug', toolSlug)
    }

    const { data, error } = await query

    if (error) throw error

    return successResponse(data)
  } catch (error) {
    return serverErrorResponse(error)
  }
}
