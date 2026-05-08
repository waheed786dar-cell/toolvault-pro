// ============================================
// TOOLVAULT PRO — FAVORITE TOGGLE BY SLUG
// ============================================
import { createClient } from '@/lib/supabase/server'
import {
  successResponse,
  unauthorizedResponse,
  serverErrorResponse,
} from '@/lib/headers'

// DELETE — Remove favorite
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return unauthorizedResponse()

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('tool_slug', slug)

    if (error) throw error

    return successResponse(null, 'Removed from favorites')
  } catch (error) {
    return serverErrorResponse(error)
  }
}

// GET — Check if favorited
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return unauthorizedResponse()

    const { data } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('tool_slug', slug)
      .single()

    return successResponse({ isFavorited: !!data })
  } catch (error) {
    return serverErrorResponse(error)
  }
}
