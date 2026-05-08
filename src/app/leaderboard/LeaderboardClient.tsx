'use client'
import { Navbar } from '@/components/layout/Navbar'
import { Leaderboard } from '@/components/features/Leaderboard'
import { ReferralCard } from '@/components/features/ReferralCard'
import { Trophy } from 'lucide-react'

export function LeaderboardClient() {
  return (
    <div className="min-h-screen bg-surface-50">
      <Navbar />
      <main className="container-main py-6 max-w-2xl">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Trophy size={22} className="text-yellow-500" />
            <h1 className="text-2xl font-display font-bold text-surface-900">
              Leaderboard
            </h1>
          </div>
          <p className="text-surface-500 text-sm">
            Top users ranked by tools used
          </p>
        </div>
        <div className="space-y-5">
          <Leaderboard />
          <ReferralCard />
        </div>
      </main>
    </div>
  )
}
