// ============================================
// TOOLVAULT PRO — REFERRAL CARD
// ============================================
'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Gift, Copy, Check, Share2,
  Users, Zap, TrendingUp, ExternalLink
} from 'lucide-react'
import { toast } from 'sonner'
import { clsx } from 'clsx'

interface ReferralData {
  code: string
  referralLink: string
  totalReferrals: number
  totalCreditsEarned: number
  creditsPerReferral: number
}

export function ReferralCard() {
  const [data, setData] = useState<ReferralData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [copied, setCopied] = useState<'code' | 'link' | null>(null)

  useEffect(() => {
    fetchReferralData()
  }, [])

  const fetchReferralData = async () => {
    try {
      const res = await fetch('/api/referral')
      const result = await res.json()
      if (result.success) setData(result.data)
    } catch {
      toast.error('Failed to load referral data')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text: string, type: 'code' | 'link') => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      toast.success(type === 'code' ? 'Code copied!' : 'Link copied!')
      setTimeout(() => setCopied(null), 2000)
    } catch {
      toast.error('Failed to copy')
    }
  }

  const shareWhatsApp = () => {
    if (!data) return
    const text = encodeURIComponent(
      `🚀 Join TOOLVAULT PRO — 30+ FREE professional tools!\n\nUse my referral link: ${data.referralLink}\n\nYou'll get 5 bonus AI credits! 🎁`
    )
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  if (isLoading) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="skeleton h-6 w-32 mb-4 rounded" />
        <div className="skeleton h-12 w-full rounded-xl mb-3" />
        <div className="skeleton h-10 w-full rounded-xl" />
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-hero p-5 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Gift size={20} />
          </div>
          <div>
            <h3 className="font-bold text-base">Referral Program</h3>
            <p className="text-white/70 text-xs">
              Earn {data.creditsPerReferral} credits per friend you invite
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              icon: Users,
              label: 'Friends Invited',
              value: data.totalReferrals,
            },
            {
              icon: Zap,
              label: 'Credits Earned',
              value: data.totalCreditsEarned,
            },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="bg-white/10 rounded-xl p-3 text-center"
            >
              <Icon size={16} className="mx-auto mb-1 opacity-80" />
              <p className="text-xl font-bold">{value}</p>
              <p className="text-white/70 text-xs">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">
        {/* Referral Code */}
        <div>
          <p className="label">Your Referral Code</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center justify-center py-3 px-4 bg-surface-50 border-2 border-dashed border-primary-200 rounded-xl">
              <span className="text-xl font-bold tracking-widest text-primary-700 font-mono">
                {data.code}
              </span>
            </div>
            <motion.button
              onClick={() => copyToClipboard(data.code, 'code')}
              whileTap={{ scale: 0.9 }}
              className={clsx(
                'p-3 rounded-xl transition-all duration-200',
                copied === 'code'
                  ? 'bg-success-500 text-white'
                  : 'bg-surface-100 text-surface-600 hover:bg-primary-100 hover:text-primary-700'
              )}
            >
              <AnimatePresence mode="wait">
                {copied === 'code' ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Check size={18} />
                  </motion.div>
                ) : (
                  <motion.div key="copy">
                    <Copy size={18} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Referral Link */}
        <div>
          <p className="label">Referral Link</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 px-3 py-2.5 bg-surface-50 border border-surface-200 rounded-xl overflow-hidden">
              <p className="text-xs text-surface-600 truncate font-mono">
                {data.referralLink}
              </p>
            </div>
            <motion.button
              onClick={() => copyToClipboard(data.referralLink, 'link')}
              whileTap={{ scale: 0.9 }}
              className={clsx(
                'p-2.5 rounded-xl transition-all duration-200',
                copied === 'link'
                  ? 'bg-success-500 text-white'
                  : 'bg-surface-100 text-surface-600 hover:bg-primary-100 hover:text-primary-700'
              )}
            >
              {copied === 'link' ? <Check size={16} /> : <Copy size={16} />}
            </motion.button>
          </div>
        </div>

        {/* Share buttons */}
        <div className="flex gap-2">
          <button
            onClick={shareWhatsApp}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#25D366] text-white rounded-xl text-sm font-semibold hover:bg-[#20BA5C] transition-colors"
          >
            <Share2 size={15} />
            Share on WhatsApp
          </button>
        </div>

        {/* How it works */}
        <div className="bg-surface-50 rounded-xl p-4">
          <p className="text-xs font-bold text-surface-700 mb-2 flex items-center gap-1.5">
            <TrendingUp size={13} className="text-primary-600" />
            How it works
          </p>
          <ol className="space-y-1.5 text-xs text-surface-600">
            {[
              'Share your referral link or code',
              'Friend registers using your link',
              'They get 5 bonus credits 🎁',
              `You get ${data.creditsPerReferral} bonus credits ⚡`,
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-primary-100 text-primary-700 text-xs flex items-center justify-center flex-shrink-0 font-bold">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}
