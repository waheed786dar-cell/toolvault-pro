// ============================================
// TOOLVAULT PRO — LEGAL API
// ============================================
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import {
  successResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from '@/lib/headers'

// GET — Fetch latest policy
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') ?? 'privacy'

    const admin = createAdminClient()
    const { data, error } = await admin
      .from('legal_documents')
      .select('*')
      .eq('type', type)
      .eq('is_active', true)
      .order('version', { ascending: false })
      .limit(1)
      .single()

    if (error) throw error

    return successResponse(data)
  } catch (error) {
    return serverErrorResponse(error)
  }
}

// POST — User accepts policy
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return unauthorizedResponse()

    const { policy_type, version } = await request.json()

    const admin = createAdminClient()
    await admin.from('policy_acceptances').upsert({
      user_id: user.id,
      policy_type,
      version,
      accepted_at: new Date().toISOString(),
      ip_hash: null,
    })

    // Update profile
    await admin
      .from('profiles')
      .update({
        [`${policy_type}_accepted`]: true,
        [`${policy_type}_accepted_at`]: new Date().toISOString(),
      })
      .eq('id', user.id)

    return successResponse(null, 'Policy accepted')
  } catch (error) {
    return serverErrorResponse(error)
  }
}
