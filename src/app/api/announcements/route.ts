// ============================================
// TOOLVAULT PRO — ANNOUNCEMENTS API
// ============================================
import { createAdminClient } from '@/lib/supabase/admin'
import {
  successResponse,
  serverErrorResponse,
} from '@/lib/headers'

export async function GET() {
  try {
    const admin = createAdminClient()
    const now = new Date().toISOString()

    const { data, error } = await admin
      .from('announcements')
      .select('*')
      .eq('is_active', true)
      .lte('starts_at', now)
      .or(`ends_at.is.null,ends_at.gte.${now}`)
      .order('created_at', { ascending: false })
      .limit(3)

    if (error) throw error

    return successResponse(data ?? [])
  } catch (error) {
    return serverErrorResponse(error)
  }
}
