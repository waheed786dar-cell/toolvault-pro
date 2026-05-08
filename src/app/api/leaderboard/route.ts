// ============================================
// TOOLVAULT PRO — LEADERBOARD API
// ============================================
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
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
    const period = searchParams.get('period') ?? 'weekly'
    const limit = parseInt(searchParams.get('limit') ?? '50')

    const admin = createAdminClient()

    // Get top users by tools used
    let query

    if (period === 'weekly') {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)

      // Weekly leaderboard from tool_usage
      const { data: weeklyData } = await admin
        .from('tool_usage')
        .select('user_id')
        .gte('used_at', weekAgo.toISOString())

      // Count per user
      const userCounts: Record<string, number> = {}
      weeklyData?.forEach((u) => {
        userCounts[u.user_id] = (userCounts[u.user_id] ?? 0) + 1
      })

      // Get top user IDs
      const topUserIds = Object.entries(userCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, limit)
        .map(([id]) => id)

      // Fetch profiles
      const { data: profiles } = await admin
        .from('profiles')
        .select('id, username, avatar_url, tools_used_count')
        .in('id', topUserIds)

      // Merge counts with profiles
      const leaderboard = topUserIds
        .map((id, index) => {
          const profile = profiles?.find((p) => p.id === id)
          return {
            rank: index + 1,
            user_id: id,
            username: profile?.username ?? 'Anonymous',
            avatar_url: profile?.avatar_url ?? null,
            tools_count: userCounts[id],
            isCurrentUser: id === user.id,
          }
        })
        .filter((u) => u.username !== 'Anonymous')

      // Find current user rank
      const myRank = leaderboard.findIndex(
        (u) => u.user_id === user.id
      ) + 1

      return successResponse({
        leaderboard,
        myRank: myRank > 0 ? myRank : null,
        period: 'weekly',
        total: leaderboard.length,
      })
    } else {
      // All time leaderboard
      const { data: profiles } = await admin
        .from('profiles')
        .select('id, username, avatar_url, tools_used_count')
        .order('tools_used_count', { ascending: false })
        .limit(limit)
        .gt('tools_used_count', 0)

      const leaderboard = profiles?.map((p, index) => ({
        rank: index + 1,
        user_id: p.id,
        username: p.username ?? 'Anonymous',
        avatar_url: p.avatar_url,
        tools_count: p.tools_used_count,
        isCurrentUser: p.id === user.id,
      }))

      const myRank =
        leaderboard?.findIndex((u) => u.user_id === user.id) + 1

      return successResponse({
        leaderboard,
        myRank: myRank > 0 ? myRank : null,
        period: 'alltime',
        total: leaderboard?.length ?? 0,
      })
    }
  } catch (error) {
    return serverErrorResponse(error)
  }
}
