// ============================================
// TOOLVAULT PRO — COOKIE CONSENT (GDPR)
// ============================================
'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, Shield, X } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

export function CookieConsent() {
  const { isAuthenticated } = useAuthStore()
  const [show, setShow] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('tv-cookie-consent')
    if (!consent) {
      setTimeout(() => setShow(true), 2000)
    }
  }, [])

  const saveConsent = async (analytics: boolean, advertising: boolean) => {
    localStorage.setItem(
      'tv-cookie-consent',
      JSON.stringify({ analytics, advertising, date: new Date().toISOString() })
    )

    if (isAuthenticated) {
      try {
        await fetch('/api/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ analytics, advertising }),
        })
      } catch {
        // Silent
      }
    }

    setShow(false)
  }

  const acceptAll = () => saveConsent(true, true)
  const acceptNecessary = () => saveConsent(false, false)

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          className="fixed bottom-4 left-4 right-4 z-50 max-w-lg mx-auto"
        >
          <div className="card p-5 shadow-2xl border-2 border-primary-100">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                <Cookie size={20} className="text-primary-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-surface-900 mb-1">
                  We use cookies 🍪
                </h3>
                <p className="text-xs text-surface-600 leading-relaxed">
                  We use cookies to improve your experience and show relevant ads. 
                  Your data is never sold.
                </p>
              </div>
              <button
                onClick={() => setShow(false)}
                className="p-1 rounded-lg hover:bg-surface-100 text-surface-400 flex-shrink-0"
              >
                <X size={14} />
              </button>
            </div>

            {showDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="mb-4 space-y-2 overflow-hidden"
              >
                {[
                  {
                    label: 'Necessary',
                    desc: 'Required for the site to work',
                    locked: true,
                  },
                  {
                    label: 'Analytics',
                    desc: 'Help us improve the site',
                    locked: false,
                  },
                  {
                    label: 'Advertising',
                    desc: 'Show relevant ads via Monetag',
                    locked: false,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between p-2.5 bg-surface-50 rounded-lg"
                  >
                    <div>
                      <p className="text-xs font-semibold text-surface-800">
                        {item.label}
                      </p>
                      <p className="text-xs text-surface-500">{item.desc}</p>
                    </div>
                    {item.locked ? (
                      <Shield size={14} className="text-success-600" />
                    ) : (
                      <div className="w-8 h-4 bg-primary-500 rounded-full" />
                    )}
                  </div>
                ))}
              </motion.div>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-xs text-surface-500 hover:text-surface-700 underline"
              >
                {showDetails ? 'Hide details' : 'Customize'}
              </button>
              <div className="flex gap-2 ml-auto">
                <button
                  onClick={acceptNecessary}
                  className="btn-secondary text-xs px-3 py-2"
                >
                  Necessary only
                </button>
                <button
                  onClick={acceptAll}
                  className="btn-primary text-xs px-3 py-2"
                >
                  Accept all
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
