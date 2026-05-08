// ============================================
// TOOLVAULT PRO — AI GENERATION API ROUTE
// ============================================
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { generateAI } from '@/lib/groq'
import { checkRateLimit } from '@/lib/rateLimit'
import { validateInput, aiRequestSchema } from '@/lib/sanitize'
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  validationErrorResponse,
  serverErrorResponse,
} from '@/lib/headers'

export async function POST(request: Request) {
  const startTime = Date.now()

  try {
    // 1. Auth check
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return unauthorizedResponse()

    // 2. Rate limit
    const { limited, response: limitRes } = await checkRateLimit(
      request,
      'ai'
    )
    if (limited) return limitRes!

    // 3. Validate input
    const body = await request.json()
    const validation = validateInput(aiRequestSchema, body)
    if (!validation.success) {
      return validationErrorResponse(validation.errors)
    }

const {
  prompt,
  toolName,
  language,
  maxTokens,
} = validation.data as {
  prompt: string
  toolName?: string
  language?: string
  maxTokens?: number
}

    // 4. Generate with Groq
    const result = await generateAI({
      prompt,
      toolName,
      language,
      maxTokens,
    })

    const duration = Date.now() - startTime

    // 5. Log generation
    const admin = createAdminClient()
    await admin.from('ai_generations').insert({
      user_id: user.id,
      tool_name: toolName,
      prompt,
      result: result.result ?? null,
      tokens_used: result.tokensUsed ?? 0,
      duration_ms: duration,
      was_successful: result.success,
    })

    if (!result.success) {
      return errorResponse(result.error ?? 'Generation failed', 500)
    }

    return successResponse(
      {
        result: result.result,
        tokensUsed: result.tokensUsed,
        duration,
      },
      'Generated successfully'
    )
  } catch (error) {
    return serverErrorResponse(error)
  }
}
