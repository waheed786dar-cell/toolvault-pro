// ============================================
// TOOLVAULT PRO — USERNAME CHECK API
// ============================================
import { createAdminClient } from '@/lib/supabase/admin'
import { successResponse, serverErrorResponse } from '@/lib/headers'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username')?.toLowerCase().trim()

    if (!username || username.length < 3) {
      return successResponse({ available: false })
    }

    // Reserved usernames
    const RESERVED = [
      'admin', 'support', 'help', 'toolvault', 'api',
      'dashboard', 'profile', 'settings', 'tools',
      'login', 'register', 'signup', 'logout',
    ]

    if (RESERVED.includes(username)) {
      return successResponse({ available: false })
    }

    const admin = createAdminClient()
    const { data } = await admin
      .from('profiles')
      .select('username')
      .eq('username', username)
      .single()

    return successResponse({ available: !data })
  } catch {
    return successResponse({ available: true })
  }
}
