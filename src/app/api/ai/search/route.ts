// ============================================
// TOOLVAULT PRO — AI SEARCH API
// ============================================
import { createClient } from '@/lib/supabase/server'
import { generateAI } from '@/lib/groq'
import { checkRateLimit } from '@/lib/rateLimit'
import { ALL_TOOLS } from '@/constants/tools'
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  serverErrorResponse,
} from '@/lib/headers'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return unauthorizedResponse()

    const { limited, response: limitRes } = await checkRateLimit(
      request,
      'general'
    )
    if (limited) return limitRes!

    const { query } = await request.json()
    if (!query || query.length < 2) {
      return errorResponse('Query too short', 400)
    }

    // Build tools list for AI context
    const toolsList = ALL_TOOLS.map(
      (t) => `${t.slug}: ${t.name} — ${t.description}`
    ).join('\n')

    // Ask Groq to match tools
    const result = await generateAI({
      prompt: `
User is searching for: "${query}"

Available tools:
${toolsList}

Return a JSON array of the best matching tool slugs (max 5), ordered by relevance.
Example: ["ai-writer", "paraphraser", "email-writer"]
Return ONLY the JSON array, nothing else.
      `,
      toolName: 'ai-search',
      language: 'en',
      maxTokens: 200,
    })

    if (!result.success || !result.result) {
      // Fallback to text search
      const q = query.toLowerCase()
      const fallback = ALL_TOOLS
        .filter(
          (t) =>
            t.name.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q) ||
            t.category.includes(q)
        )
        .slice(0, 5)
        .map((t) => t.slug)

      return successResponse({ slugs: fallback, source: 'text' })
    }

    // Parse AI response
    try {
      const cleaned = result.result
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim()
      const slugs = JSON.parse(cleaned) as string[]

      // Validate slugs exist
      const validSlugs = slugs.filter((s) =>
        ALL_TOOLS.some((t) => t.slug === s)
      )

      return successResponse({ slugs: validSlugs, source: 'ai' })
    } catch {
      // Fallback
      const q = query.toLowerCase()
      const fallback = ALL_TOOLS
        .filter(
          (t) =>
            t.name.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q)
        )
        .slice(0, 5)
        .map((t) => t.slug)

      return successResponse({ slugs: fallback, source: 'text' })
    }
  } catch (error) {
    return serverErrorResponse(error)
  }
}
