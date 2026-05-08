// ============================================
// TOOLVAULT PRO — LOGIN API ROUTE
// ============================================
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { checkRateLimit } from '@/lib/rateLimit'
import { validateInput, loginSchema, verifyCaptcha } from '@/lib/sanitize'
import { hash } from '@/lib/encryption'
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  serverErrorResponse,
} from '@/lib/headers'

export async function POST(request: Request) {
  try {
    // 1. Rate limit
    const { limited, response: limitRes } = await checkRateLimit(
      request,
      'auth'
    )
    if (limited) return limitRes!

    // 2. Parse + validate
    const body = await request.json()
    const validation = validateInput(loginSchema, body)
    if (!validation.success) {
      return validationErrorResponse(validation.errors)
    }

    const { email, password, captchaToken } = validation.data

    // 3. Verify CAPTCHA
    const captchaValid = await verifyCaptcha(captchaToken)
    if (!captchaValid) {
      return errorResponse('CAPTCHA verification failed', 400)
    }

    // 4. Sign in
    const supabase = await createClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      // Generic error — don't reveal if email exists
      return errorResponse('Invalid email or password', 401)
    }

    // 5. Check if banned
    const admin = createAdminClient()
    const { data: profile } = await admin
      .from('profiles')
      .select('is_banned, onboarding_done')
      .eq('id', data.user.id)
      .single()

    if (profile?.is_banned) {
      await supabase.auth.signOut()
      return errorResponse('Account suspended', 403)
    }

    // 6. Log audit
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
    const ipHash = await hash(ip)

    await admin.from('audit_logs').insert({
      user_id: data.user.id,
      action: 'user.login',
      resource: 'auth',
      metadata: { method: 'email' },
      ip_hash: ipHash,
    })

    return successResponse(
      {
        session: data.session,
        onboarding_done: profile?.onboarding_done ?? false,
      },
      'Login successful'
    )
  } catch (error) {
    return serverErrorResponse(error)
  }
}
