// ============================================
// TOOLVAULT PRO — LEADERBOARD PAGE
// ============================================
import type { Metadata } from 'next'
import { getPageMetadata } from '@/lib/seo'
import { LeaderboardClient } from './LeaderboardClient'

export const metadata: Metadata = getPageMetadata(
  'Leaderboard',
  'Top TOOLVAULT PRO users ranked by tools used.',
  '/leaderboard'
)

export default function LeaderboardPage() {
  return <LeaderboardClient />
}
