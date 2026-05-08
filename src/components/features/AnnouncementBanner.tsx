// ============================================
// TOOLVAULT PRO — ANNOUNCEMENT BANNER
// ============================================
'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Info, CheckCircle, AlertTriangle } from 'lucide-react'
import { useUIStore } from '@/store/uiStore'
import { clsx } from 'clsx'

interface Announcement {
  id: string
  title: string
  title_ur: string | null
  message: string
  message_ur: string | null
  type: 'info' | 'success' | 'warning'
}

export function AnnouncementBanner() {
  const { language } = useUIStore()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [dismissed, setDismissed] = useState<string[]>([])
  const [current, setCurrent] = useState<Announcement | null>(null)

  useEffect(() => {
    // Load dismissed from localStorage
    const saved = localStorage.getItem('tv-dismissed-announcements')
    const dismissedIds = saved ? JSON.parse(saved) : []
    setDismissed(dismissedIds)
    fetchAnnouncements(dismissedIds)
  }, [])

  const fetchAnnouncements = async (dismissedIds: string[]) => {
    try {
      const res = await fetch('/api/announcements')
      const data = await res.json()
      if (data.success) {
        const active = data.data.filter(
          (a: Announcement) => !dismissedIds.includes(a.id)
        )
        setAnnouncements(active)
        if (active.length > 0) setCurrent(active[0])
      }
    } catch {
      // Silent
    }
  }

  const dismiss = (id: string) => {
    const updated = [...dismissed, id]
    setDismissed(updated)
    localStorage.setItem(
      'tv-dismissed-announcements',
      JSON.stringify(updated)
    )
    setCurrent(null)
  }

  const typeConfig = {
    info: {
      bg: 'bg-primary-600',
      icon: Info,
    },
    success: {
      bg: 'bg-success-600',
      icon: CheckCircle,
    },
    warning: {
      bg: 'bg-warning-500',
      icon: AlertTriangle,
    },
  }

  if (!current) return null

  const config = typeConfig[current.type]
  const Icon = config.icon
  const title =
    language === 'ur' && current.title_ur ? current.title_ur : current.title
  const message =
    language === 'ur' && current.message_ur
      ? current.message_ur
      : current.message

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={clsx(config.bg, 'text-white overflow-hidden')}
      >
        <div className="container-main py-2.5">
          <div className="flex items-center gap-3">
            <Icon size={16} className="flex-shrink-0 opacity-90" />
            <p
              className={clsx(
                'flex-1 text-xs sm:text-sm font-medium',
                language === 'ur' && 'font-urdu text-right'
              )}
            >
              <span className="font-bold">{title}: </span>
              {message}
            </p>
            <button
              onClick={() => dismiss(current.id)}
              className="p-1 rounded-full hover:bg-white/20 transition-colors flex-shrink-0"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
