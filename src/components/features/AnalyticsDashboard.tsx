// ============================================
// TOOLVAULT PRO — ANALYTICS DASHBOARD
// ============================================
'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart2, TrendingUp, Zap,
  BookMarked, Clock, Award
} from 'lucide-react'
import { ExportButton } from './ExportButton'
import { clsx } from 'clsx'

interface AnalyticsData {
  overview: {
    totalToolsUsed: number
    periodToolsUsed: number
    savedResults: number
    totalTokensUsed: number
    successRate: number
    memberSince: string
  }
  charts: {
    usageByDay: { date: string; count: number }[]
    usageByCategory: { category: string; count: number }[]
  }
  topTools: { slug: string; count: number }[]
  period: string
}

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('7d')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [period])

  const fetchAnalytics = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/analytics?period=${period}`)
      const result = await res.json()
      if (result.success) setData(result.data)
    } catch {
      // Silent
    } finally {
      setIsLoading(false)
    }
  }

  const stats = [
    {
      icon: Zap,
      label: 'Tools Used (All Time)',
      value: data?.overview.totalToolsUsed ?? 0,
      color: 'text-primary-600',
      bg: 'bg-primary-50',
    },
    {
      icon: Clock,
      label: `Tools Used (${period})`,
      value: data?.overview.periodToolsUsed ?? 0,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      icon: BookMarked,
      label: 'Saved Results',
      value: data?.overview.savedResults ?? 0,
      color: 'text-success-600',
      bg: 'bg-success-50',
    },
    {
      icon: Award,
      label: 'Success Rate',
      value: `${data?.overview.successRate ?? 100}%`,
      color: 'text-warning-600',
      bg: 'bg-warning-50',
    },
  ]

  const maxDay = Math.max(
    ...(data?.charts.usageByDay.map((d) => d.count) ?? [1])
  )

  const maxCat = Math.max(
    ...(data?.charts.usageByCategory.map((d) => d.count) ?? [1])
  )

  const categoryColors: Record<string, string> = {
    'ai-writing':     '#3B82F6',
    'image-tools':    '#EF4444',
    'seo-tools':      '#1E3A8A',
    'pdf-tools':      '#DC2626',
    'code-tools':     '#7C3AED',
    'business-tools': '#059669',
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart2 size={20} className="text-primary-600" />
          <h2 className="text-lg font-bold text-surface-900">Analytics</h2>
        </div>
        <div className="flex items-center gap-2">
          {/* Period selector */}
          <div className="flex gap-1 p-1 bg-surface-100 rounded-xl">
            {(['7d', '30d', '90d'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={clsx(
                  'px-3 py-1.5 text-xs font-semibold rounded-lg transition-all',
                  period === p
                    ? 'bg-white text-primary-700 shadow-sm'
                    : 'text-surface-500 hover:text-surface-700'
                )}
              >
                {p}
              </button>
            ))}
          </div>
          <ExportButton type="usage" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map(({ icon: Icon, label, value, color, bg }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="card p-4"
          >
            <div className={clsx('w-9 h-9 rounded-xl flex items-center justify-center mb-3', bg)}>
              <Icon size={18} className={color} />
            </div>
            <p className="text-2xl font-bold text-surface-900">
              {isLoading ? (
                <span className="skeleton inline-block w-12 h-7 rounded" />
              ) : (
                value.toLocaleString()
              )}
            </p>
            <p className="text-xs text-surface-500 mt-0.5">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Daily Usage Chart */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={16} className="text-primary-600" />
          <h3 className="text-sm font-bold text-surface-900">
            Daily Usage
          </h3>
        </div>

        {isLoading ? (
          <div className="h-24 skeleton rounded-xl" />
        ) : data?.charts.usageByDay.length === 0 ? (
          <div className="h-24 flex items-center justify-center text-surface-400 text-sm">
            No usage data yet
          </div>
        ) : (
          <div className="flex items-end gap-1.5 h-24">
            {data?.charts.usageByDay.slice(-14).map((day, i) => (
              <motion.div
                key={day.date}
                className="flex-1 flex flex-col items-center gap-1 group"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: i * 0.04, origin: 'bottom' }}
                style={{ transformOrigin: 'bottom' }}
              >
                <div
                  className="w-full bg-primary-200 rounded-t-sm group-hover:bg-primary-500 transition-colors relative"
                  style={{
                    height: `${Math.max(4, (day.count / maxDay) * 80)}px`,
                  }}
                  title={`${day.date}: ${day.count} uses`}
                />
                <span className="text-xs text-surface-400 hidden sm:block">
                  {new Date(day.date).getDate()}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Category Breakdown */}
      <div className="card p-5">
        <h3 className="text-sm font-bold text-surface-900 mb-4">
          Usage by Category
        </h3>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton h-8 rounded-lg" />
            ))}
          </div>
        ) : data?.charts.usageByCategory.length === 0 ? (
          <p className="text-sm text-surface-400 text-center py-4">
            No category data yet
          </p>
        ) : (
          <div className="space-y-3">
            {data?.charts.usageByCategory
              .sort((a, b) => b.count - a.count)
              .map((cat, i) => (
                <motion.div
                  key={cat.category}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-surface-700 capitalize">
                      {cat.category.replace('-', ' ')}
                    </span>
                    <span className="text-xs font-bold text-surface-600">
                      {cat.count}
                    </span>
                  </div>
                  <div className="h-2 bg-surface-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        backgroundColor:
                          categoryColors[cat.category] ?? '#3B82F6',
                        width: `${(cat.count / maxCat) * 100}%`,
                      }}
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(cat.count / maxCat) * 100}%`,
                      }}
                      transition={{ duration: 0.8, delay: i * 0.06 }}
                    />
                  </div>
                </motion.div>
              ))}
          </div>
        )}
      </div>

      {/* Top Tools */}
      {data?.topTools && data.topTools.length > 0 && (
        <div className="card p-5">
          <h3 className="text-sm font-bold text-surface-900 mb-4">
            Your Top Tools
          </h3>
          <div className="space-y-2">
            {data.topTools.map((tool, i) => (
              <div
                key={tool.slug}
                className="flex items-center gap-3 py-2 border-b border-surface-50 last:border-0"
              >
                <span className="text-xs font-bold text-surface-400 w-4">
                  {i + 1}
                </span>
                <span className="flex-1 text-sm font-medium text-surface-800 capitalize">
                  {tool.slug.replace(/-/g, ' ')}
                </span>
                <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                  {tool.count}x
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
