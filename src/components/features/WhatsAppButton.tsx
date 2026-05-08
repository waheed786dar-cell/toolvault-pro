// ============================================
// TOOLVAULT PRO — WHATSAPP SUPPORT BUTTON
// ============================================
'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send } from 'lucide-react'
import { usePathname } from 'next/navigation'

// ⚠️ Apna WhatsApp number yahan daalo
const WHATSAPP_NUMBER = '923356104360'
const WHATSAPP_MESSAGE = 'Hello! I need help with TOOLVAULT PRO.'

// Pages jahan button hide hoga
const HIDDEN_PATHS = ['/auth/login', '/auth/register', '/onboarding']

export function WhatsAppButton() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')

  if (HIDDEN_PATHS.some((p) => pathname.startsWith(p))) return null

  const openWhatsApp = (customMessage?: string) => {
    const text = encodeURIComponent(customMessage ?? WHATSAPP_MESSAGE)
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`,
      '_blank'
    )
    setIsOpen(false)
  }

  const quickMessages = [
    'I need help with a tool',
    'Report a bug',
    'Suggest a feature',
    'Account issue',
  ]

  return (
    <div className="fixed bottom-6 right-4 z-40 flex flex-col items-end gap-3">
      {/* Quick chat popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
            className="w-72 card shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#25D366] px-4 py-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle size={18} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-bold">TOOLVAULT Support</p>
                <p className="text-white/80 text-xs">Typically replies instantly</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="p-4">
              <p className="text-xs text-surface-600 mb-3">
                👋 Hi! How can we help you today?
              </p>

              {/* Quick options */}
              <div className="space-y-1.5 mb-3">
                {quickMessages.map((msg) => (
                  <button
                    key={msg}
                    onClick={() => openWhatsApp(msg)}
                    className="w-full text-left text-xs px-3 py-2 rounded-lg border border-surface-200 hover:border-[#25D366] hover:bg-green-50 transition-colors text-surface-700 font-medium"
                  >
                    {msg}
                  </button>
                ))}
              </div>

              {/* Custom message */}
              <div className="flex gap-2">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="input text-xs py-2"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && message.trim()) {
                      openWhatsApp(message)
                    }
                  }}
                />
                <button
                  onClick={() => message.trim() && openWhatsApp(message)}
                  className="p-2 bg-[#25D366] text-white rounded-xl hover:bg-[#20BA5C] transition-colors flex-shrink-0"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-14 h-14 bg-[#25D366] rounded-full shadow-lg flex items-center justify-center text-white"
        aria-label="WhatsApp Support"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle size={24} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse ring */}
        {!isOpen && (
          <motion.div
            className="absolute inset-0 rounded-full bg-[#25D366]"
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.button>
    </div>
  )
}
