// ============================================
// TOOLVAULT PRO — REFERRAL API
// ============================================
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { nanoid } from 'nanoid'
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  serverErrorResponse,
} from '@/lib/headers'

// GET — Get referral info
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return unauthorizedResponse()

    const admin = createAdminClient()

    // Get or create referral code
    let { data: referral } = await admin
      .from('referrals')
      .select('referral_code')
      .eq('referrer_id', user.id)
      .limit(1)
      .single()

    let code: string

    if (!referral) {
      // Generate unique code
      code = nanoid(8).toUpperCase()
      await admin.from('referrals').insert({
        referrer_id: user.id,
        referred_id: user.id, // placeholder
        referral_code: code,
        status: 'pending',
      })
    } else {
      code = referral.referral_code
    }

    // Count successful referrals
    const { count: totalReferrals } = await admin
      .from('referrals')
      .select('*', { count: 'exact', head: true })
      .eq('referrer_id', user.id)
      .eq('status', 'completed')

    // Total credits earned
    const { data: creditsData } = await admin
      .from('referrals')
      .select('credits_awarded')
      .eq('referrer_id', user.id)
      .eq('status', 'completed')

    const totalCreditsEarned =
      creditsData?.reduce((sum, r) => sum + r.credits_awarded, 0) ?? 0

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL
    const referralLink = `${baseUrl}/auth/register?ref=${code}`

    return successResponse({
      code,
      referralLink,
      totalReferrals: totalReferrals ?? 0,
      totalCreditsEarned,
      creditsPerReferral: 10,
    })
  } catch (error) {
    return serverErrorResponse(error)
  }
}

// POST — Apply referral code
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return unauthorizedResponse()

    const { code } = await request.json()
    if (!code) return errorResponse('Referral code required', 400)

    const admin = createAdminClient()

    // Find referral
    const { data: referral } = await admin
      .from('referrals')
      .select('*')
      .eq('referral_code', code.toUpperCase())
      .single()

    if (!referral) return errorResponse('Invalid referral code', 404)

    // Cant refer yourself
    if (referral.referrer_id === user.id) {
      return errorResponse('Cannot use your own referral code', 400)
    }

    // Already used
    const { data: existing } = await admin
      .from('referrals')
      .select('id')
      .eq('referrer_id', referral.referrer_id)
      .eq('referred_id', user.id)
      .single()

    if (existing) return errorResponse('Referral already applied', 409)

    // Award credits to referrer
    await admin
      .from('credits')
      .update({
        bonus_credits: admin
          .from('credits')
          .select('bonus_credits')
          .eq('user_id', referral.referrer_id),
      })

    // Simpler credit update
    const { data: referrerCredits } = await admin
      .from('credits')
      .select('bonus_credits')
      .eq('user_id', referral.referrer_id)
      .single()

    await admin
      .from('credits')
      .update({
        bonus_credits: (referrerCredits?.bonus_credits ?? 0) + 10,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', referral.referrer_id)

    // Update referral record
    await admin
      .from('referrals')
      .update({
        referred_id: user.id,
        status: 'completed',
        credits_awarded: 10,
      })
      .eq('referral_code', code.toUpperCase())

    // Bonus credits to new user too
    const { data: newUserCredits } = await admin
      .from('credits')
      .select('bonus_credits')
      .eq('user_id', user.id)
      .single()

    await admin
      .from('credits')
      .update({
        bonus_credits: (newUserCredits?.bonus_credits ?? 0) + 5,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)

    return successResponse(
      { creditsAwarded: 5 },
      'Referral applied! You got 5 bonus credits!'
    )
  } catch (error) {
    return serverErrorResponse(error)
  }
}
