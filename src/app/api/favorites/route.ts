// ============================================
// TOOLVAULT PRO — FAVORITES API
// ============================================
import { createClient } from '@/lib/supabase/server'
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  serverErrorResponse,
} from '@/lib/headers'

// GET — All favorites
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return unauthorizedResponse()

    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return successResponse(data)
  } catch (error) {
    return serverErrorResponse(error)
  }
}

// POST — Add favorite
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return unauthorizedResponse()

    const { tool_slug } = await request.json()
    if (!tool_slug) return errorResponse('Tool slug required', 400)

    // Max 30 favorites
    const { count } = await supabase
      .from('favorites')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if ((count ?? 0) >= 30) {
      return errorResponse('Max 30 favorites allowed', 429)
    }

    const { data, error } = await supabase
      .from('favorites')
      .insert({ user_id: user.id, tool_slug })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return errorResponse('Already in favorites', 409)
      }
      throw error
    }

    return successResponse(data, 'Added to favorites', 201)
  } catch (error) {
    return serverErrorResponse(error)
  }
}
