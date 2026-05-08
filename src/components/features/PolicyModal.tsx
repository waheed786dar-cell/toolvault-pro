// ============================================
// TOOLVAULT PRO — POLICY ACCEPT MODAL
// ============================================
'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, FileText, Check, ExternalLink, X } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { toast } from 'sonner'
import Link from 'next/link'

export function PolicyModal() {
  const { user, profile, updateProfile } = useAuthStore()
  const [show, setShow] = useState(false)
  const [privacyChecked, setPrivacyChecked] = useState(false)
  const [termsChecked, setTermsChecked] = useState(false)
  const [isAccepting, setIsAccepting] = useState(false)
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>('privacy')
  const [privacyContent, setPrivacyContent] = useState('')
  const [termsContent, setTermsContent] = useState('')
  const [contentLoaded, setContentLoaded] = useState(false)

  useEffect(() => {
    if (!user || !profile) return

    // Show if policies not accepted
    const needsAcceptance =
      !profile.privacy_accepted || !profile.terms_accepted

    if (needsAcceptance) {
      setShow(true)
      fetchPolicies()
    }
  }, [user, profile])

  const fetchPolicies = async () => {
    try {
      const [privacyRes, termsRes] = await Promise.all([
        fetch('/api/legal?type=privacy'),
        fetch('/api/legal?type=terms'),
      ])

      const [privacyData, termsData] = await Promise.all([
        privacyRes.json(),
        termsRes.json(),
      ])

      if (privacyData.success) setPrivacyContent(privacyData.data.content)
      if (termsData.success) setTermsContent(termsData.data.content)
      setContentLoaded(true)
    } catch {
      setContentLoaded(true)
    }
  }

  const handleAccept = async () => {
    if (!privacyChecked || !termsChecked) {
      toast.error('Please accept both Privacy Policy and Terms of Service')
      return
    }

    setIsAccepting(true)

    try {
      await Promise.all([
        fetch('/api/legal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ policy_type: 'privacy', version: '1.0' }),
        }),
        fetch('/api/legal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ policy_type: 'terms', version: '1.0' }),
        }),
      ])

      updateProfile({
        privacy_accepted: true,
        terms_accepted: true,
      } as Parameters<typeof updateProfile>[0])

      toast.success('Thank you for accepting our policies!')
      setShow(false)
    } catch {
      toast.error('Failed to save acceptance. Please try again.')
    } finally {
      setIsAccepting(false)
    }
  }

  const handleDecline = () => {
    toast.error(
      'You must accept our policies to use TOOLVAULT PRO.',
      { duration: 5000 }
    )
  }

  if (!show) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop — cannot dismiss */}
        <div className="absolute inset-0 bg-surface-900/80 backdrop-blur-sm" />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-lg"
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
        >
          <div className="card overflow-hidden shadow-2xl">

            {/* Header */}
            <div className="bg-gradient-hero p-6 text-white">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Shield size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold">
                    Before you continue
                  </h2>
                  <p className="text-white/70 text-xs">
                    Please review and accept our policies
                  </p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-surface-200">
              {[
                { id: 'privacy', label: 'Privacy Policy', icon: Shield },
                { id: 'terms', label: 'Terms of Service', icon: FileText },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as 'privacy' | 'terms')}
                  className={`
                    flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold
                    border-b-2 transition-all duration-200
                    ${activeTab === id
                      ? 'border-primary-600 text-primary-700 bg-primary-50'
                      : 'border-transparent text-surface-500 hover:text-surface-700'
                    }
                  `}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="h-64 overflow-y-auto p-5 bg-surface-50">
              {!contentLoaded ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full" />
                </div>
              ) : (
                <div className="text-xs text-surface-600 leading-relaxed whitespace-pre-line">
                  {activeTab === 'privacy'
                    ? privacyContent || 'Loading privacy policy...'
                    : termsContent || 'Loading terms of service...'}
                </div>
              )}
            </div>

            {/* Full policy links */}
            <div className="flex gap-4 px-5 py-2 border-t border-surface-100 bg-surface-50">
              <Link
                href="/privacy"
                target="_blank"
                className="flex items-center gap-1 text-xs text-primary-600 hover:underline"
              >
                <ExternalLink size={11} />
                Full Privacy Policy
              </Link>
              <Link
                href="/terms"
                target="_blank"
                className="flex items-center gap-1 text-xs text-primary-600 hover:underline"
              >
                <ExternalLink size={11} />
                Full Terms of Service
              </Link>
            </div>

            {/* Checkboxes */}
            <div className="p-5 space-y-3 border-t border-surface-200">
              {[
                {
                  id: 'privacy',
                  checked: privacyChecked,
                  onChange: setPrivacyChecked,
                  label: 'I have read and agree to the',
                  link: 'Privacy Policy',
                  href: '/privacy',
                },
                {
                  id: 'terms',
                  checked: termsChecked,
                  onChange: setTermsChecked,
                  label: 'I have read and agree to the',
                  link: 'Terms of Service',
                  href: '/terms',
                },
              ].map((item) => (
                <label
                  key={item.id}
                  className="flex items-start gap-3 cursor-pointer group"
                >
                  <div className="relative mt-0.5">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={(e) => item.onChange(e.target.checked)}
                      className="sr-only"
                    />
                    <motion.div
                      className={`
                        w-5 h-5 rounded-md border-2 flex items-center justify-center
                        transition-all duration-200
                        ${item.checked
                          ? 'bg-primary-600 border-primary-600'
                          : 'border-surface-300 bg-white group-hover:border-primary-400'
                        }
                      `}
                      whileTap={{ scale: 0.9 }}
                    >
                      {item.checked && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.15 }}
                        >
                          <Check size={12} className="text-white" />
                        </motion.div>
                      )}
                    </motion.div>
                  </div>
                  <span className="text-xs text-surface-700 leading-relaxed">
                    {item.label}{' '}
                    <Link
                      href={item.href}
                      target="_blank"
                      className="text-primary-600 font-semibold hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {item.link}
                    </Link>
                    {' '}of TOOLVAULT PRO
                  </span>
                </label>
              ))}
            </div>

            {/* Actions */}
            <div className="px-5 pb-5 flex gap-3">
              <button
                onClick={handleDecline}
                className="btn-secondary flex-1 text-sm"
              >
                Decline
              </button>
              <motion.button
                onClick={handleAccept}
                disabled={!privacyChecked || !termsChecked || isAccepting}
                whileTap={{ scale: 0.97 }}
                className="btn-primary flex-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAccepting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Check size={15} />
                    I Accept Both Policies
                  </span>
                )}
              </motion.button>
            </div>

            {/* Note */}
            <p className="text-center text-xs text-surface-400 pb-4 px-5">
              You must accept both policies to continue using TOOLVAULT PRO.
              Declining will limit your access to the platform.
            </p>

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
