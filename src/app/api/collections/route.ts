// ============================================
// TOOLVAULT PRO — COLLECTIONS API
// ============================================
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { validateInput } from '@/lib/sanitize'
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  validationErrorResponse,
  serverErrorResponse,
} from '@/lib/headers'

const collectionSchema = z.object({
  name: z.string().min(1).max(50).trim(),
  description: z.string().max(200).optional(),
  is_public: z.boolean().default(false),
  color: z.string().regex(/^#[0-9A-F]{6}$/i).default('#2563EB'),
})

// GET — All collections
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return unauthorizedResponse()

    const { data, error } = await supabase
      .from('collections')
      .select(`
        *,
        collection_tools (tool_slug)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return successResponse(data)
  } catch (error) {
    return serverErrorResponse(error)
  }
}

// POST — Create collection
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return unauthorizedResponse()

    // Max 10 collections
    const { count } = await supabase
      .from('collections')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if ((count ?? 0) >= 10) {
      return errorResponse('Max 10 collections allowed', 429)
    }

    const body = await request.json()
    const validation = validateInput(collectionSchema, body)
    if (!validation.success) {
      return validationErrorResponse(validation.errors)
    }

    const { data, error } = await supabase
      .from('collections')
      .insert({ user_id: user.id, ...validation.data })
      .select()
      .single()

    if (error) throw error

    return successResponse(data, 'Collection created', 201)
  } catch (error) {
    return serverErrorResponse(error)
  }
}
