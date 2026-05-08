// ============================================
// TOOLVAULT PRO — SINGLE SAVED RESULT ROUTE
// ============================================
import { createClient } from '@/lib/supabase/server'
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  serverErrorResponse,
} from '@/lib/headers'

// DELETE — Remove saved result
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return unauthorizedResponse()

    const { error } = await supabase
      .from('saved_results')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) return errorResponse(error.message, 400)

    return successResponse(null, 'Deleted successfully')
  } catch (error) {
    return serverErrorResponse(error)
  }
}

// PATCH — Update saved result
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return unauthorizedResponse()

    const { title, is_public } = await request.json()

    const { data, error } = await supabase
      .from('saved_results')
      .update({ title, is_public, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) return errorResponse(error.message, 400)

    return successResponse(data, 'Updated successfully')
  } catch (error) {
    return serverErrorResponse(error)
  }
}
