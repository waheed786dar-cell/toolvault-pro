// ============================================
// TOOLVAULT PRO — CRON PING ROUTE
// Anti-pause for Supabase free tier
// ============================================
import { createAdminClient } from '@/lib/supabase/admin'
import { successResponse, serverErrorResponse } from '@/lib/headers'

export async function GET(request: Request) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return new Response('Unauthorized', { status: 401 })
    }

    // Ping Supabase
    const admin = createAdminClient()
    const { error } = await admin
      .from('profiles')
      .select('id')
      .limit(1)

    if (error) throw error

    // Cleanup old data
    await admin
      .from('ai_generations')
      .delete()
      .lt(
        'created_at',
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      )

    await admin
      .from('audit_logs')
      .delete()
      .lt(
        'created_at',
        new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
      )

    return successResponse(
      { pinged: true, timestamp: new Date().toISOString() },
      'Supabase pinged successfully'
    )
  } catch (error) {
    return serverErrorResponse(error)
  }
}
