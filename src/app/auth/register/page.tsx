// ============================================
// TOOLVAULT PRO — REGISTER PAGE
// ============================================
'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import HCaptcha from '@hcaptcha/react-hcaptcha'
import {
  Eye, EyeOff, Mail, Lock, Zap,
  AlertCircle, Loader2, ArrowRight,
  Shield, Check, X
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { trackSignUp } from '@/lib/analytics'
import { clsx } from 'clsx'

// Password strength checker
function getPasswordStrength(password: string): {
  score: number
  label: string
  color: string
  checks: { label: string; passed: boolean }[]
} {
  const checks = [
    { label: 'At least 8 characters', passed: password.length >= 8 },
    { label: 'Uppercase letter', passed: /[A-Z]/.test(password) },
    { label: 'Number', passed: /[0-9]/.test(password) },
    { label: 'Special character', passed: /[^A-Za-z0-9]/.test(password) },
  ]

  const score = checks.filter((c) => c.passed).length

  const config = {
    0: { label: 'Too weak', color: 'bg-danger-500' },
    1: { label: 'Weak', color: 'bg-danger-400' },
    2: { label: 'Fair', color: 'bg-warning-500' },
    3: { label: 'Good', color: 'bg-success-400' },
    4: { label: 'Strong', color: 'bg-success-600' },
  }

  return { score, ...config[score as keyof typeof config], checks }
}

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signUp, signInWithGoogle, isAuthenticated, isLoading } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [captchaToken, setCaptchaToken] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [showPasswordChecks, setShowPasswordChecks] = useState(false)
  const captchaRef = useRef<HCaptcha>(null)

  const refCode = searchParams.get('ref') ?? ''
  const strength = getPasswordStrength(password)
  const passwordsMatch = password === confirmPassword && confirmPassword !== ''

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.replace('/onboarding')
    }
  }, [isAuthenticated, isLoading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (strength.score < 3) {
      setError('Password is too weak. Please make it stronger.')
      return
    }

    if (!captchaToken) {
      setError('Please complete the CAPTCHA')
      return
    }

    setIsSubmitting(true)

    try {
      const result = await signUp(email, password, captchaToken)

      if (!result.success) {
        setError(result.error ?? 'Registration failed')
        captchaRef.current?.resetCaptcha()
        setCaptchaToken('')
        return
      }

      // Apply referral if exists
      if (refCode) {
        try {
          await fetch('/api/referral', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: refCode }),
          })
        } catch {
          // Silent fail
        }
      }

      trackSignUp('email')
      setIsSuccess(true)
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
        trackSignUp('google')
      }
    } finally {
      setIsGoogleLoading(false)
    }
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50 p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md text-center"
        >
          <div className="card p-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="w-20 h-20 bg-success-50 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Check size={36} className="text-success-600" />
            </motion.div>

            <h2 className="text-2xl font-display font-bold text-surface-900 mb-3">
              Check your email! 📬
            </h2>
            <p className="text-surface-500 text-sm leading-relaxed mb-6">
              We've sent a verification link to{' '}
              <strong className="text-surface-800">{email}</strong>.
              Click the link to activate your account.
            </p>

            <div className="bg-surface-50 rounded-xl p-4 mb-6 text-left">
              <p className="text-xs font-bold text-surface-700 mb-2">
                What's next:
              </p>
              {[
                'Check your inbox (and spam folder)',
                'Click the verification link',
                'Complete your profile setup',
                'Get 20 free AI credits!',
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-2 mb-1.5">
                  <span className="w-4 h-4 rounded-full bg-primary-100 text-primary-700 text-xs flex items-center justify-center font-bold flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-xs text-surface-600">{step}</span>
                </div>
              ))}
            </div>

            <Link href="/auth/login" className="btn-primary w-full">
              Go to Login
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
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
              Join 50,000+
              <br />
              <span className="text-yellow-300">professionals</span>
            </h2>
            <p className="text-white/70 text-base leading-relaxed">
              Get free access to 30+ AI-powered professional tools.
              No credit card required — ever.
            </p>
          </motion.div>

          {/* Benefits */}
          <div className="space-y-3">
            {[
              { icon: '⚡', text: '20 free AI credits every day' },
              { icon: '🔧', text: '30+ professional tools' },
              { icon: '💾', text: 'Save and export your results' },
              { icon: '🎁', text: 'Earn credits by referring friends' },
              { icon: '🌐', text: 'English + Urdu support' },
              { icon: '🔒', text: 'Enterprise-grade security' },
            ].map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="flex items-center gap-3"
              >
                <span className="text-lg">{benefit.icon}</span>
                <span className="text-white/85 text-sm font-medium">
                  {benefit.text}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Referral badge */}
          {refCode && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-yellow-400/20 border border-yellow-400/40 rounded-xl p-4"
            >
              <p className="text-yellow-300 text-sm font-bold mb-1">
                🎁 Referral Bonus!
              </p>
              <p className="text-white/80 text-xs">
                You'll get 5 bonus AI credits when you sign up with referral code:{' '}
                <span className="font-mono font-bold text-yellow-300">
                  {refCode}
                </span>
              </p>
            </motion.div>
          )}
        </div>

        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white overflow-y-auto">
        <motion.div
          className="w-full max-w-md py-6"
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
              Create free account 🚀
            </h1>
            <p className="text-surface-500 text-sm">
              Get instant access to 30+ professional tools
            </p>
            {refCode && (
              <div className="mt-3 flex items-center gap-2 text-xs text-success-700 bg-success-50 px-3 py-2 rounded-lg">
                <Check size={13} />
                Referral code applied: <strong>{refCode}</strong>
              </div>
            )}
          </div>

          {/* Error */}
          <AnimatePresence>
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

          {/* Google */}
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
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            Continue with Google
          </motion.button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-surface-200" />
            <span className="text-xs text-surface-400 font-medium">
              or register with email
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
                  className={clsx(
                    'input pr-10',
                    focusedField === 'email' && 'ring-2 ring-primary-500 border-primary-500'
                  )}
                  autoComplete="email"
                  required
                />
                <Mail size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => {
                    setFocusedField('password')
                    setShowPasswordChecks(true)
                  }}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Create a strong password"
                  className={clsx(
                    'input pr-10',
                    focusedField === 'password' && 'ring-2 ring-primary-500 border-primary-500'
                  )}
                  autoComplete="new-password"
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

              {/* Password strength */}
              <AnimatePresence>
                {showPasswordChecks && password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 overflow-hidden"
                  >
                    {/* Strength bar */}
                    <div className="flex gap-1 mb-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={clsx(
                            'flex-1 h-1.5 rounded-full transition-all duration-300',
                            i <= strength.score
                              ? strength.color
                              : 'bg-surface-200'
                          )}
                        />
                      ))}
                    </div>

                    <p className={clsx(
                      'text-xs font-semibold mb-2',
                      strength.score >= 3 ? 'text-success-600' : 'text-warning-600'
                    )}>
                      {strength.label}
                    </p>

                    <div className="grid grid-cols-2 gap-1">
                      {strength.checks.map((check) => (
                        <div
                          key={check.label}
                          className="flex items-center gap-1.5"
                        >
                          {check.passed ? (
                            <Check size={11} className="text-success-600 flex-shrink-0" />
                          ) : (
                            <X size={11} className="text-surface-300 flex-shrink-0" />
                          )}
                          <span className={clsx(
                            'text-xs',
                            check.passed ? 'text-success-700' : 'text-surface-400'
                          )}>
                            {check.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="label">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onFocus={() => setFocusedField('confirm')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Repeat your password"
                  className={clsx(
                    'input pr-10',
                    focusedField === 'confirm' && 'ring-2 ring-primary-500 border-primary-500',
                    confirmPassword && !passwordsMatch && 'input-error',
                    confirmPassword && passwordsMatch && 'border-success-500'
                  )}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
                >
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              <AnimatePresence>
                {confirmPassword && !passwordsMatch && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mt-1.5 text-xs text-danger-600"
                  >
                    Passwords do not match
                  </motion.p>
                )}
              </AnimatePresence>
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

            {/* Terms agreement */}
            <p className="text-xs text-surface-500 text-center leading-relaxed">
              By creating an account, you agree to our{' '}
              <Link href="/terms" target="_blank" className="text-primary-600 hover:underline font-medium">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" target="_blank" className="text-primary-600 hover:underline font-medium">
                Privacy Policy
              </Link>
            </p>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={
                isSubmitting ||
                !captchaToken ||
                !passwordsMatch ||
                strength.score < 3
              }
              whileTap={{ scale: 0.98 }}
              className={clsx(
                'w-full btn-primary py-3.5 flex items-center justify-center gap-2',
                (isSubmitting || !captchaToken || !passwordsMatch || strength.score < 3) &&
                  'opacity-60 cursor-not-allowed'
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Free Account
                  <ArrowRight size={16} />
                </>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="mt-6 space-y-4">
            <p className="text-center text-sm text-surface-500">
              Already have an account?{' '}
              <Link
                href="/auth/login"
                className="text-primary-600 font-semibold hover:underline"
              >
                Sign in
              </Link>
            </p>

            <div className="flex items-center justify-center gap-1 text-xs text-surface-400">
              <Shield size={11} />
              <span>Protected by hCaptcha · No spam ever</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
