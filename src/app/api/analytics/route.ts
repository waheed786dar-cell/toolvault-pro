// ============================================
// TOOLVAULT PRO — ANALYTICS API
// ============================================
import { createClient } from '@/lib/supabase/server'
import {
  successResponse,
  unauthorizedResponse,
  serverErrorResponse,
} from '@/lib/headers'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return unauthorizedResponse()

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') ?? '7d'

    // Calculate date range
    const days = period === '30d' ? 30 : period === '90d' ? 90 : 7
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Tool usage over time
    // Line ~20 ke paas, usageData query replace karo:
    const { data: usageData } = await supabase
      .from('tool_usage')
      .select('tool_slug, tool_category, used_at, was_successful')
      .eq('user_id', user.id)
      .gte('used_at', startDate.toISOString())
      .order('used_at', { ascending: true })
      .returns<{ tool_slug: string; tool_category: string; used_at: string; was_successful: boolean }[]>()
    // AI generations
     const { data: aiData } = await supabase
      .from('ai_generations')
      .select('tool_name, tokens_used, created_at, was_successful')
      .eq('user_id', user.id)
      .gte('created_at', startDate.toISOString())
      .returns<{ tool_name: string; tokens_used: number; created_at: string; was_successful: boolean }[]>()
    // Saved results count
    const { count: savedCount } = await supabase
      .from('saved_results')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    // Profile stats
    const { data: profile } = await supabase
      .from('profiles')
      .select('tools_used_count, created_at')
      .eq('id', user.id)
      .single()

    // Group usage by day
    const usageByDay: Record<string, number> = {}
    usageData?.forEach((u) => {
      const day = u.used_at.split('T')[0]
      usageByDay[day] = (usageByDay[day] ?? 0) + 1
    })

    // Group by category
    const usageByCategory: Record<string, number> = {}
    usageData?.forEach((u) => {
      usageByCategory[u.tool_category] =
        (usageByCategory[u.tool_category] ?? 0) + 1
    })

    // Top tools
    const toolCounts: Record<string, number> = {}
    usageData?.forEach((u) => {
      toolCounts[u.tool_slug] = (toolCounts[u.tool_slug] ?? 0) + 1
    })

    const topTools = Object.entries(toolCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([slug, count]) => ({ slug, count }))

    // Total tokens used
    const totalTokens =
      aiData?.reduce((sum, g) => sum + (g.tokens_used ?? 0), 0) ?? 0

    // Success rate
    const totalUsage = usageData?.length ?? 0
    const successfulUsage =
      usageData?.filter((u) => u.was_successful).length ?? 0
    const successRate =
      totalUsage > 0
        ? Math.round((successfulUsage / totalUsage) * 100)
        : 100

    return successResponse({
      overview: {
        totalToolsUsed: profile?.tools_used_count ?? 0,
        periodToolsUsed: totalUsage,
        savedResults: savedCount ?? 0,
        totalTokensUsed: totalTokens,
        successRate,
        memberSince: profile?.created_at,
      },
      charts: {
        usageByDay: Object.entries(usageByDay).map(([date, count]) => ({
          date,
          count,
        })),
        usageByCategory: Object.entries(usageByCategory).map(
          ([category, count]) => ({ category, count })
        ),
      },
      topTools,
      period,
    })
  } catch (error) {
    return serverErrorResponse(error)
  }
}
