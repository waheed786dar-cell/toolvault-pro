// ============================================
// TOOLVAULT PRO — ONBOARDING API ROUTE
// ============================================
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { validateInput, onboardingSchema } from '@/lib/sanitize'
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  validationErrorResponse,
  serverErrorResponse,
} from '@/lib/headers'

export async function POST(request: Request) {
  try {
    // 1. Get authenticated user
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return unauthorizedResponse()
    }

    // 2. Parse + validate
    const body = await request.json()
    const validation = validateInput(onboardingSchema, body)
    if (!validation.success) {
      return validationErrorResponse(validation.errors)
    }

    const { username, heard_from, language, bio } = validation.data

    // 3. Check username uniqueness
    const admin = createAdminClient()
    const { data: existingUsername } = await admin
      .from('profiles')
      .select('username')
      .eq('username', username)
      .neq('id', user.id)
      .single()

    if (existingUsername) {
      return errorResponse('Username already taken', 409)
    }

    // 4. Update profile
    const { error: updateError } = await admin
      .from('profiles')
      .update({
        username,
        heard_from,
        language,
        bio: bio ?? null,
        onboarding_done: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (updateError) {
      return errorResponse(updateError.message, 400)
    }

    // 5. Send welcome notification
    await admin.from('notifications').insert({
      user_id: user.id,
      title: language === 'ur'
        ? 'TOOLVAULT میں خوش آمدید!'
        : 'Welcome to TOOLVAULT PRO!',
      message: language === 'ur'
        ? 'آپ کا اکاؤنٹ تیار ہے۔ ابھی ٹولز استعمال کریں!'
        : 'Your account is ready. Start using 30+ free tools!',
      type: 'success',
    })

    // 6. Log audit
    await admin.from('audit_logs').insert({
      user_id: user.id,
      action: 'user.onboarding_complete',
      resource: 'profile',
      metadata: { username, language, heard_from },
    })

    return successResponse(
      { username, onboarding_done: true },
      'Onboarding complete!'
    )
  } catch (error) {
    return serverErrorResponse(error)
  }
}
