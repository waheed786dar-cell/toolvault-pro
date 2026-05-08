// ============================================
// TOOLVAULT PRO — TOOL USAGE LOGGING ROUTE
// ============================================
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { hash } from '@/lib/encryption'
import {
  successResponse,
  unauthorizedResponse,
  serverErrorResponse,
} from '@/lib/headers'

export async function POST(request: Request) {
  try {
    // 1. Auth
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return unauthorizedResponse()

    // 2. Parse
    const { tool_slug, tool_category, duration_ms, was_successful } =
      await request.json()

    if (!tool_slug || !tool_category) {
      return successResponse(null) // Silent fail
    }

    // 3. Hash IP
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
    const ipHash = await hash(ip)

    // 4. Insert usage
    const admin = createAdminClient()
    await admin.from('tool_usage').insert({
      user_id: user.id,
      tool_slug,
      tool_category,
      duration_ms: duration_ms ?? null,
      was_successful: was_successful ?? true,
      ip_hash: ipHash,
    })

    return successResponse(null, 'Usage logged')
  } catch (error) {
    return serverErrorResponse(error)
  }
}

// GET — Fetch user usage history
export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return unauthorizedResponse()

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') ?? '20')
    const page = parseInt(searchParams.get('page') ?? '1')
    const offset = (page - 1) * limit

    const { data, count, error } = await supabase
      .from('tool_usage')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('used_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    return successResponse({
      data,
      pagination: { page, limit, total: count ?? 0 },
    })
  } catch (error) {
    return serverErrorResponse(error)
  }
}
