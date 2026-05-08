// ============================================
// TOOLVAULT PRO — COLLECTION [ID] ROUTE
// ============================================
import { createClient } from '@/lib/supabase/server'
import {
  successResponse, errorResponse,
  unauthorizedResponse, serverErrorResponse,
} from '@/lib/headers'

// POST — Add tool to collection
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return unauthorizedResponse()

    const { tool_slug } = await request.json()
    if (!tool_slug) return errorResponse('Tool slug required', 400)

    const { error } = await supabase
      .from('collection_tools')
      .insert({ collection_id: id, tool_slug })

    if (error) {
      if (error.code === '23505') return errorResponse('Already in collection', 409)
      throw error
    }

    return successResponse(null, 'Tool added', 201)
  } catch (error) {
    return serverErrorResponse(error)
  }
}

// DELETE — Remove tool or collection
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return unauthorizedResponse()

    const body = await request.json().catch(() => null)

    if (body?.tool_slug) {
      // Remove tool from collection
      await supabase
        .from('collection_tools')
        .delete()
        .eq('collection_id', id)
        .eq('tool_slug', body.tool_slug)

      return successResponse(null, 'Tool removed')
    }

    // Delete entire collection
    await supabase
      .from('collections')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    return successResponse(null, 'Collection deleted')
  } catch (error) {
    return serverErrorResponse(error)
  }
}
