// ============================================
// TOOLVAULT PRO — CREDITS API
// ============================================
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  serverErrorResponse,
} from '@/lib/headers'

// GET — Fetch credits
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return unauthorizedResponse()

    const admin = createAdminClient()
    const today = new Date().toISOString().split('T')[0]

    // Get or create credits record
    let { data: credits } = await admin
      .from('credits')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!credits) {
      const { data: newCredits } = await admin
        .from('credits')
        .insert({ user_id: user.id, daily_credits: 20, bonus_credits: 0 })
        .select()
        .single()
      credits = newCredits
    }

    // Reset daily credits if new day
    if (credits && credits.last_reset !== today) {
      const { data: resetCredits } = await admin
        .from('credits')
        .update({
          daily_credits: 20,
          last_reset: today,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .select()
        .single()
      credits = resetCredits
    }

    return successResponse({
      daily: credits?.daily_credits ?? 0,
      bonus: credits?.bonus_credits ?? 0,
      total: (credits?.daily_credits ?? 0) + (credits?.bonus_credits ?? 0),
      totalUsed: credits?.total_used ?? 0,
      lastReset: credits?.last_reset,
    })
  } catch (error) {
    return serverErrorResponse(error)
  }
}

// POST — Consume credits
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return unauthorizedResponse()

    const { amount = 1 } = await request.json()
    const admin = createAdminClient()

    const { data: credits } = await admin
      .from('credits')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!credits) return errorResponse('Credits not found', 404)

    const totalAvailable =
      credits.daily_credits + credits.bonus_credits

    if (totalAvailable < amount) {
      return errorResponse(
        'Insufficient credits. Come back tomorrow for free credits!',
        402
      )
    }

    // Deduct from daily first, then bonus
    let newDaily = credits.daily_credits
    let newBonus = credits.bonus_credits

    if (newDaily >= amount) {
      newDaily -= amount
    } else {
      const remaining = amount - newDaily
      newDaily = 0
      newBonus -= remaining
    }

    await admin
      .from('credits')
      .update({
        daily_credits: newDaily,
        bonus_credits: newBonus,
        total_used: credits.total_used + amount,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)

    return successResponse({
      consumed: amount,
      remaining: newDaily + newBonus,
      daily: newDaily,
      bonus: newBonus,
    })
  } catch (error) {
    return serverErrorResponse(error)
  }
}
