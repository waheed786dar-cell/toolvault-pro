// ============================================
// TOOLVAULT PRO — LOGIN PAGE
// ============================================
'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import HCaptcha from '@hcaptcha/react-hcaptcha'
import {
  Eye, EyeOff, Mail, Lock, Zap,
  AlertCircle, Loader2, ArrowRight,
  Shield, Chrome
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useUIStore } from '@/store/uiStore'
import { trackLogin } from '@/lib/analytics'
import { clsx } from 'clsx'
import type { Metadata } from 'next'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signIn, signInWithGoogle, isAuthenticated, isLoading } = useAuth()
  const { language } = useUIStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [captchaToken, setCaptchaToken] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const captchaRef = useRef<HCaptcha>(null)

  const redirect = searchParams.get('redirect') ?? '/dashboard'
  const isBanned = searchParams.get('banned') === 'true'
  const oauthError = searchParams.get('error') === 'oauth_failed'

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.replace(redirect)
    }
  }, [isAuthenticated, isLoading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    if (!captchaToken) {
      setError('Please complete the CAPTCHA')
      return
    }

    setIsSubmitting(true)

    try {
      const result = await signIn(email, password, captchaToken)

      if (!result.success) {
        setError(result.error ?? 'Login failed')
        captchaRef.current?.resetCaptcha()
        setCaptchaToken('')
        return
      }

      trackLogin('email')
      router.replace(redirect)
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogle = async () => {
    setIsGoogleLoading(true)
    setError('')
    try {
      const result = await signInWithGoogle()
      if (!result.success) {
        setError(result.error ?? 'Google sign in failed')
      } else {
        trackLogin('google')
      }
    } finally {
      setIsGoogleLoading(false)
    }
  }

  const inputClass = (field: string, hasError: boolean) =>
    clsx(
      'input pr-10 transition-all duration-200',
      focusedField === field && 'ring-2 ring-primary-500 border-primary-500',
      hasError && 'input-error'
    )

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 hero-bg flex-col justify-between p-12 relative overflow-hidden">
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <Zap size={18} className="text-white fill-current" />
            </div>
            <span className="font-display font-bold text-white text-xl">
              TOOLVAULT PRO
            </span>
          </Link>
        </div>

        <div className="relative z-10 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4 leading-tight">
              Welcome back to your
              <br />
              <span className="text-yellow-300">professional toolkit</span>
            </h2>
            <p className="text-white/70 text-base leading-relaxed">
              Access 30+ free AI-powered tools, track your usage, and
              save your results — all in one place.
            </p>
          </motion.div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2">
            {[
              '✍️ AI Writing',
              '🖼️ Image Tools',
              '📄 PDF Tools',
              '💻 Code Tools',
              '📈 SEO Tools',
              '💼 Business Tools',
            ].map((item, i) => (
              <motion.span
                key={item}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="text-xs font-medium bg-white/15 backdrop-blur-sm text-white px-3 py-1.5 rounded-full border border-white/20"
              >
                {item}
              </motion.span>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: '30+', label: 'Free Tools' },
              { value: '50K+', label: 'Users' },
              { value: '20', label: 'Daily Credits' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-white/60 text-xs">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Dot pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-gradient-hero rounded-xl flex items-center justify-center">
              <Zap size={15} className="text-white fill-current" />
            </div>
            <span className="font-display font-bold text-surface-900">
              TOOLVAULT <span className="text-primary-600">PRO</span>
            </span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-display font-bold text-surface-900 mb-2">
              Welcome back 👋
            </h1>
            <p className="text-surface-500 text-sm">
              Sign in to access your tools and saved results
            </p>
          </div>

          {/* Alerts */}
          <AnimatePresence>
            {isBanned && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-start gap-3 p-4 bg-danger-50 border border-danger-200 rounded-xl mb-6"
              >
                <AlertCircle size={16} className="text-danger-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-danger-700 font-medium">
                  Your account has been suspended. Contact support for assistance.
                </p>
              </motion.div>
            )}

            {oauthError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-start gap-3 p-4 bg-warning-50 border border-warning-200 rounded-xl mb-6"
              >
                <AlertCircle size={16} className="text-warning-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-warning-700 font-medium">
                  Google sign in failed. Please try again or use email/password.
                </p>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-start gap-3 p-4 bg-danger-50 border border-danger-200 rounded-xl mb-6"
              >
                <AlertCircle size={16} className="text-danger-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-danger-700 font-medium">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Google Button */}
          <motion.button
            onClick={handleGoogle}
            disabled={isGoogleLoading}
            whileTap={{ scale: 0.98 }}
            className={clsx(
              'w-full flex items-center justify-center gap-3 py-3.5 px-4',
              'border-2 border-surface-200 rounded-xl font-semibold text-sm',
              'text-surface-700 hover:border-primary-300 hover:bg-primary-50',
              'transition-all duration-200 mb-6',
              isGoogleLoading && 'opacity-70 cursor-not-allowed'
            )}
          >
            {isGoogleLoading ? (
              <Loader2 size={18} className="animate-spin text-primary-600" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            Continue with Google
          </motion.button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-surface-200" />
            <span className="text-xs text-surface-400 font-medium">
              or sign in with email
            </span>
            <div className="flex-1 h-px bg-surface-200" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="you@example.com"
                  className={inputClass('email', false)}
                  autoComplete="email"
                  required
                />
                <Mail
                  size={15}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-surface-400"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label mb-0">Password</label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-primary-600 hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your password"
                  className={inputClass('password', false)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* hCaptcha */}
            <div className="flex justify-center">
              <HCaptcha
                ref={captchaRef}
                sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY ?? ''}
                onVerify={(token) => setCaptchaToken(token)}
                onExpire={() => setCaptchaToken('')}
                size="normal"
              />
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isSubmitting || !captchaToken}
              whileTap={{ scale: 0.98 }}
              className={clsx(
                'w-full btn-primary py-3.5 flex items-center justify-center gap-2',
                (isSubmitting || !captchaToken) && 'opacity-60 cursor-not-allowed'
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={16} />
                </>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="mt-6 space-y-4">
            <p className="text-center text-sm text-surface-500">
              Don't have an account?{' '}
              <Link
                href="/auth/register"
                className="text-primary-600 font-semibold hover:underline"
              >
                Create free account
              </Link>
            </p>

            <div className="flex items-center justify-center gap-1 text-xs text-surface-400">
              <Shield size={11} />
              <span>Protected by hCaptcha · </span>
              <Link href="/privacy" className="hover:text-surface-600 underline">
                Privacy Policy
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
