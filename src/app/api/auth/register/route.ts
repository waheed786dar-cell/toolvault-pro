// ============================================
// TOOLVAULT PRO — REGISTER API ROUTE
// ============================================
import { createAdminClient } from '@/lib/supabase/admin'
import { checkRateLimit } from '@/lib/rateLimit'
import { validateInput, registerSchema, verifyCaptcha } from '@/lib/sanitize'
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

    // 2. Parse body
    const body = await request.json()

    // 3. Validate input
    const validation = validateInput(registerSchema, body)
    if (!validation.success) {
      return validationErrorResponse(validation.errors)
    }

    const { email, password, captchaToken } = validation.data

    // 4. Verify CAPTCHA
    const captchaValid = await verifyCaptcha(captchaToken)
    if (!captchaValid) {
      return errorResponse('CAPTCHA verification failed', 400)
    }

    // 5. Check if email exists
    const supabase = createAdminClient()
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', email)
      .single()

    if (existingUser) {
      return errorResponse('Email already registered', 409)
    }

    // 6. Create user
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: false,
    })

    if (error) {
      return errorResponse(error.message, 400)
    }

    // 7. Send confirmation email
    await supabase.auth.admin.generateLink({
      type: 'signup',
      email,
    })

    // 8. Log audit
    await supabase.from('audit_logs').insert({
      user_id: data.user?.id,
      action: 'user.register',
      resource: 'auth',
      metadata: { email, method: 'email' },
    })

    return successResponse(
      { userId: data.user?.id },
      'Registration successful! Please check your email.',
      201
    )
  } catch (error) {
    return serverErrorResponse(error)
  }
}
