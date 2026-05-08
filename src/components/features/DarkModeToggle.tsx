// ============================================
// TOOLVAULT PRO — DARK MODE TOGGLE
// ============================================
'use client'
import { useTheme } from 'next-themes'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon, Monitor } from 'lucide-react'
import { useState, useEffect } from 'react'
import { clsx } from 'clsx'

interface DarkModeToggleProps {
  variant?: 'icon' | 'full'
  className?: string
}

export function DarkModeToggle({
  variant = 'icon',
  className,
}: DarkModeToggleProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <div className={clsx('w-9 h-9 rounded-xl bg-surface-100', className)} />
    )
  }

  const themes = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' },
  ] as const

  if (variant === 'icon') {
    const cycleTheme = () => {
      const order = ['light', 'dark', 'system']
      const current = order.indexOf(theme ?? 'system')
      const next = order[(current + 1) % order.length]
      setTheme(next)
    }

    const CurrentIcon =
      theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor

    return (
      <motion.button
        onClick={cycleTheme}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={clsx(
          'p-2 rounded-xl transition-all duration-200',
          'bg-surface-100 hover:bg-surface-200',
          'text-surface-600 hover:text-surface-900',
          'focus:outline-none focus:ring-2 focus:ring-primary-500',
          className
        )}
        aria-label="Toggle theme"
        title={`Theme: ${theme}`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={theme}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CurrentIcon size={18} />
          </motion.div>
        </AnimatePresence>
      </motion.button>
    )
  }

  // Full variant — 3 buttons
  return (
    <div
      className={clsx(
        'flex items-center gap-1 p-1 rounded-xl bg-surface-100',
        className
      )}
    >
      {themes.map(({ value, icon: Icon, label }) => (
        <motion.button
          key={value}
          onClick={() => setTheme(value)}
          whileTap={{ scale: 0.95 }}
          className={clsx(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg',
            'text-xs font-medium transition-all duration-200',
            theme === value
              ? 'bg-white text-primary-700 shadow-sm'
              : 'text-surface-500 hover:text-surface-700'
          )}
        >
          <Icon size={13} />
          {label}
        </motion.button>
      ))}
    </div>
  )
}
