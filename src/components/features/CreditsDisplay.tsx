// ============================================
// TOOLVAULT PRO — CREDITS DISPLAY
// ============================================
'use client'
import { motion } from 'framer-motion'
import { Zap, TrendingUp } from 'lucide-react'
import { useCredits } from '@/hooks/useCredits'
import { clsx } from 'clsx'

interface CreditsDisplayProps {
  variant?: 'navbar' | 'full' | 'mini'
  className?: string
}

export function CreditsDisplay({
  variant = 'navbar',
  className,
}: CreditsDisplayProps) {
  const { total, daily, bonus, isLow, isEmpty, percentage } = useCredits()

  if (variant === 'mini') {
    return (
      <div
        className={clsx(
          'flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold',
          isEmpty
            ? 'bg-danger-50 text-danger-600'
            : isLow
            ? 'bg-warning-50 text-warning-600'
            : 'bg-primary-50 text-primary-700',
          className
        )}
      >
        <Zap
          size={12}
          className={clsx('fill-current', isEmpty && 'opacity-50')}
        />
        {total}
      </div>
    )
  }

  if (variant === 'navbar') {
    return (
      <div
        className={clsx(
          'flex items-center gap-2 px-3 py-1.5 rounded-xl',
          'bg-surface-100 hover:bg-surface-200 transition-colors',
          'cursor-default',
          className
        )}
        title={`${daily} daily + ${bonus} bonus credits`}
      >
        <Zap
          size={14}
          className={clsx(
            'fill-current',
            isEmpty
              ? 'text-surface-400'
              : isLow
              ? 'text-warning-500'
              : 'text-primary-600'
          )}
        />
        <span
          className={clsx(
            'text-xs font-bold',
            isEmpty
              ? 'text-surface-500'
              : isLow
              ? 'text-warning-600'
              : 'text-surface-800'
          )}
        >
          {total}
        </span>
        <span className="text-xs text-surface-400 hidden sm:block">
          credits
        </span>
      </div>
    )
  }

  // Full variant
  return (
    <div
      className={clsx(
        'card p-5',
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-primary-100 flex items-center justify-center">
            <Zap size={18} className="text-primary-600 fill-current" />
          </div>
          <div>
            <p className="text-sm font-semibold text-surface-900">
              AI Credits
            </p>
            <p className="text-xs text-surface-500">Resets daily</p>
          </div>
        </div>
        <span
          className={clsx(
            'text-2xl font-bold',
            isEmpty
              ? 'text-surface-400'
              : isLow
              ? 'text-warning-600'
              : 'text-primary-700'
          )}
        >
          {total}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-surface-100 rounded-full overflow-hidden mb-3">
        <motion.div
          className={clsx(
            'h-full rounded-full',
            isEmpty
              ? 'bg-surface-300'
              : isLow
              ? 'bg-warning-500'
              : 'bg-primary-500'
          )}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(percentage, 100)}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-surface-500">
        <span>{daily} daily + {bonus} bonus</span>
        <span className="flex items-center gap-1">
          <TrendingUp size={11} />
          Earn more via referrals
        </span>
      </div>

      {isEmpty && (
        <p className="mt-3 text-xs text-danger-600 bg-danger-50 rounded-lg px-3 py-2 text-center">
          No credits left. Come back tomorrow! 🌅
        </p>
      )}
    </div>
  )
}
