// ============================================
// TOOLVAULT PRO — LEADERBOARD COMPONENT
// ============================================
'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Zap, Crown, Medal } from 'lucide-react'
import Image from 'next/image'
import { clsx } from 'clsx'

interface LeaderboardEntry {
  rank: number
  user_id: string
  username: string
  avatar_url: string | null
  tools_count: number
  isCurrentUser: boolean
}

interface LeaderboardData {
  leaderboard: LeaderboardEntry[]
  myRank: number | null
  total: number
}

export function Leaderboard() {
  const [data, setData] = useState<LeaderboardData | null>(null)
  const [period, setPeriod] = useState<'weekly' | 'alltime'>('weekly')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboard()
  }, [period])

  const fetchLeaderboard = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/leaderboard?period=${period}&limit=20`)
      const result = await res.json()
      if (result.success) setData(result.data)
    } catch {
      // Silent
    } finally {
      setIsLoading(false)
    }
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown size={16} className="text-yellow-500" />
    if (rank === 2) return <Medal size={16} className="text-surface-400" />
    if (rank === 3) return <Medal size={16} className="text-amber-600" />
    return null
  }

  const getRankBg = (rank: number, isCurrentUser: boolean) => {
    if (isCurrentUser) return 'bg-primary-50 border-primary-200'
    if (rank === 1) return 'bg-yellow-50 border-yellow-200'
    if (rank === 2) return 'bg-surface-50 border-surface-200'
    if (rank === 3) return 'bg-amber-50 border-amber-200'
    return 'bg-white border-surface-100'
  }

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-surface-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy size={20} className="text-yellow-500" />
            <h3 className="font-bold text-surface-900">Leaderboard</h3>
          </div>
          {data?.myRank && (
            <span className="badge-blue text-xs">
              Your rank: #{data.myRank}
            </span>
          )}
        </div>

        {/* Period Toggle */}
        <div className="flex gap-1 p-1 bg-surface-100 rounded-xl">
          {(['weekly', 'alltime'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={clsx(
                'flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200',
                period === p
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-surface-500 hover:text-surface-700'
              )}
            >
              {p === 'weekly' ? '📅 This Week' : '🏆 All Time'}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="divide-y divide-surface-50">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-4 animate-pulse">
              <div className="skeleton w-8 h-5 rounded" />
              <div className="skeleton w-9 h-9 rounded-full" />
              <div className="flex-1">
                <div className="skeleton h-3 w-24 rounded mb-1" />
                <div className="skeleton h-2 w-16 rounded" />
              </div>
              <div className="skeleton h-4 w-12 rounded" />
            </div>
          ))
        ) : data?.leaderboard.length === 0 ? (
          <div className="py-10 text-center text-surface-400">
            <Trophy size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">No data yet this week</p>
          </div>
        ) : (
          data?.leaderboard.slice(0, 10).map((entry, i) => (
            <motion.div
              key={entry.user_id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className={clsx(
                'flex items-center gap-3 px-4 py-3 border-l-2',
                getRankBg(entry.rank, entry.isCurrentUser)
              )}
            >
              {/* Rank */}
              <div className="w-7 flex items-center justify-center flex-shrink-0">
                {getRankIcon(entry.rank) ?? (
                  <span className="text-xs font-bold text-surface-500">
                    #{entry.rank}
                  </span>
                )}
              </div>

              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                {entry.avatar_url ? (
                  <Image
                    src={entry.avatar_url}
                    alt={entry.username}
                    width={36}
                    height={36}
                    className="object-cover"
                  />
                ) : (
                  <span className="text-sm font-bold text-primary-700">
                    {entry.username.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className={clsx(
                  'text-sm font-semibold truncate',
                  entry.isCurrentUser
                    ? 'text-primary-700'
                    : 'text-surface-900'
                )}>
                  {entry.username}
                  {entry.isCurrentUser && (
                    <span className="ml-1.5 text-xs text-primary-500">(you)</span>
                  )}
                </p>
              </div>

              {/* Count */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <Zap size={12} className="text-primary-500" />
                <span className="text-sm font-bold text-surface-700">
                  {entry.tools_count.toLocaleString()}
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Footer */}
      {data && data.total > 10 && (
        <div className="p-4 border-t border-surface-100 text-center">
          <p className="text-xs text-surface-500">
            {data.total} total users ranked
          </p>
        </div>
      )}
    </div>
  )
}
