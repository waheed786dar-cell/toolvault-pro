// ============================================
// TOOLVAULT PRO — EMAIL VERIFY PAGE
// ============================================
'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Mail, ArrowRight, RefreshCw, Zap } from 'lucide-react'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function VerifyPage() {
  const [isResending, setIsResending] = useState(false)
  const [email, setEmail] = useState('')

  const resendEmail = async () => {
    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    setIsResending(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      })

      if (error) throw error
      toast.success('Verification email sent! Check your inbox.')
    } catch {
      toast.error('Failed to resend. Please try again.')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-hero rounded-xl flex items-center justify-center">
              <Zap size={17} className="text-white fill-current" />
            </div>
            <span className="font-display font-bold text-surface-900 text-lg">
              TOOLVAULT <span className="text-primary-600">PRO</span>
            </span>
          </Link>
        </div>

        <div className="card p-8 text-center">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Mail size={36} className="text-primary-600" />
          </motion.div>

          <h1 className="text-2xl font-display font-bold text-surface-900 mb-3">
            Verify your email 📧
          </h1>

          <p className="text-surface-500 text-sm leading-relaxed mb-8">
            We've sent a verification link to your email address.
            Please check your inbox and click the link to continue.
          </p>

          {/* Steps */}
          <div className="bg-surface-50 rounded-xl p-4 mb-8 text-left">
            <p className="text-xs font-bold text-surface-700 mb-3">
              Didn't receive the email?
            </p>
            <ul className="space-y-2 text-xs text-surface-600">
              <li className="flex items-start gap-2">
                <span className="text-primary-500 font-bold">1.</span>
                Check your spam or junk folder
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-500 font-bold">2.</span>
                Make sure you entered the correct email
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-500 font-bold">3.</span>
                Use the resend option below
              </li>
            </ul>
          </div>

          {/* Resend section */}
          <div className="space-y-3 mb-6">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email to resend"
              className="input text-sm"
            />
            <button
              onClick={resendEmail}
              disabled={isResending}
              className="w-full btn-secondary flex items-center justify-center gap-2 text-sm"
            >
              <RefreshCw
                size={15}
                className={isResending ? 'animate-spin' : ''}
              />
              {isResending ? 'Sending...' : 'Resend verification email'}
            </button>
          </div>

          <Link
            href="/auth/login"
            className="flex items-center justify-center gap-2 text-sm text-primary-600 font-semibold hover:underline"
          >
            Back to Login
            <ArrowRight size={14} />
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
