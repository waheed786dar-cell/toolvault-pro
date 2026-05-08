// ============================================
// TOOLVAULT PRO — ONBOARDING PAGE
// ============================================
'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  User, Globe, Zap, ArrowRight,
  ArrowLeft, Check, Sparkles,
  MessageSquare, Heart
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useUIStore } from '@/store/uiStore'
import { clsx } from 'clsx'

// ============================================
// STEP CONFIG
// ============================================
const STEPS = [
  { id: 1, title: 'Choose Username',    icon: User },
  { id: 2, title: 'Your Language',      icon: Globe },
  { id: 3, title: 'How did you find us', icon: Heart },
  { id: 4, title: 'Short Bio',          icon: MessageSquare },
]

const HEARD_FROM_OPTIONS = [
  { value: 'google',    label: 'Google Search',   icon: '🔍' },
  { value: 'youtube',   label: 'YouTube',          icon: '▶️' },
  { value: 'facebook',  label: 'Facebook',         icon: '📘' },
  { value: 'instagram', label: 'Instagram',        icon: '📸' },
  { value: 'friend',    label: 'Friend / Referral', icon: '👥' },
  { value: 'twitter',   label: 'Twitter / X',      icon: '🐦' },
  { value: 'other',     label: 'Other',            icon: '✨' },
]

// ============================================
// STEP INDICATOR
// ============================================
function StepIndicator({
  currentStep,
  totalSteps,
}: {
  currentStep: number
  totalSteps: number
}) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {STEPS.map((step, i) => {
        const isCompleted = currentStep > step.id
        const isCurrent = currentStep === step.id
        const Icon = step.icon

        return (
          <div key={step.id} className="flex items-center">
            <motion.div
              className={clsx(
                'w-9 h-9 rounded-full flex items-center justify-center',
                'transition-all duration-300',
                isCompleted
                  ? 'bg-success-500 text-white'
                  : isCurrent
                  ? 'bg-primary-600 text-white'
                  : 'bg-surface-100 text-surface-400'
              )}
              animate={{ scale: isCurrent ? 1.1 : 1 }}
            >
              {isCompleted ? (
                <Check size={16} />
              ) : (
                <Icon size={16} />
              )}
            </motion.div>

            {i < STEPS.length - 1 && (
              <div
                className={clsx(
                  'w-8 h-0.5 mx-1 transition-all duration-500',
                  isCompleted ? 'bg-success-400' : 'bg-surface-200'
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ============================================
// MAIN PAGE
// ============================================
export default function OnboardingPage() {
  const router = useRouter()
  const { user, profile, completeOnboarding, isAuthenticated, isLoading } = useAuth()
  const { setLanguage } = useUIStore()

  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [username, setUsername] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [language, setLocalLanguage] = useState<'en' | 'ur'>('en')
  const [heardFrom, setHeardFrom] = useState('')
  const [bio, setBio] = useState('')

  // Redirect if not authenticated or already onboarded
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/auth/login')
    }
    if (!isLoading && profile?.onboarding_done) {
      router.replace('/dashboard')
    }
  }, [isAuthenticated, isLoading, profile])

  // Prefill if Google user
  useEffect(() => {
    if (profile?.full_name) {
      const suggested = profile.full_name
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_]/g, '')
        .substring(0, 20)
      setUsername(suggested)
    }
  }, [profile])

  // ============================================
  // USERNAME VALIDATION
  // ============================================
  const validateUsername = async (value: string) => {
    setUsername(value)
    setUsernameError('')

    if (value.length < 3) {
      setUsernameError('Username must be at least 3 characters')
      return
    }

    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      setUsernameError('Only letters, numbers, and underscores allowed')
      return
    }

    setIsCheckingUsername(true)
    try {
      const res = await fetch(`/api/auth/check-username?username=${value}`)
      const data = await res.json()
      if (!data.available) {
        setUsernameError('Username already taken — try another')
      }
    } catch {
      // Silent
    } finally {
      setIsCheckingUsername(false)
    }
  }

  // ============================================
  // NAVIGATION
  // ============================================
  const canProceed = () => {
    switch (step) {
      case 1:
        return username.length >= 3 && !usernameError && !isCheckingUsername
      case 2:
        return !!language
      case 3:
        return !!heardFrom
      case 4:
        return true
      default:
        return false
    }
  }

  const nextStep = () => {
    if (!canProceed()) return
    if (step < STEPS.length) {
      setDirection(1)
      setStep(step + 1)
    } else {
      handleSubmit()
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setDirection(-1)
      setStep(step - 1)
    }
  }

  // ============================================
  // SUBMIT
  // ============================================
  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const result = await completeOnboarding({
        username: username.toLowerCase(),
        heard_from: heardFrom,
        language,
        bio: bio || undefined,
      })

      if (result.success) {
        setLanguage(language)
        // Success animation then redirect
        setStep(5)
        setTimeout(() => router.replace('/dashboard'), 2000)
      }
    } catch {
      // Silent
    } finally {
      setIsSubmitting(false)
    }
  }

  // ============================================
  // STEP CONTENT
  // ============================================
  const stepVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 60 : -60,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({
      x: dir > 0 ? -60 : 60,
      opacity: 0,
    }),
  }

  const renderStep = () => {
    // Success step
    if (step === 5) {
      return (
        <motion.div
          key="success"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-24 h-24 bg-success-50 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <span className="text-5xl">🎉</span>
          </motion.div>
          <h2 className="text-2xl font-display font-bold text-surface-900 mb-3">
            Welcome aboard, {username}!
          </h2>
          <p className="text-surface-500 text-sm mb-4">
            Your account is ready. Taking you to your dashboard...
          </p>
          <div className="flex items-center justify-center gap-2 text-primary-600">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Zap size={16} className="fill-current" />
            </motion.div>
            <span className="text-sm font-medium">
              You have 20 free AI credits waiting!
            </span>
          </div>
        </motion.div>
      )
    }

    return (
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={stepVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {/* STEP 1 — Username */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <User size={28} className="text-primary-600" />
                </div>
                <h2 className="text-xl font-display font-bold text-surface-900 mb-2">
                  Choose your username
                </h2>
                <p className="text-surface-500 text-sm">
                  This will be your unique identifier on TOOLVAULT PRO
                </p>
              </div>

              <div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 text-sm font-medium">
                    @
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => validateUsername(e.target.value)}
                    placeholder="your_username"
                    className={clsx(
                      'input pl-8',
                      usernameError && 'input-error',
                      !usernameError && username.length >= 3 && !isCheckingUsername && 'border-success-500'
                    )}
                    maxLength={30}
                    autoFocus
                    autoComplete="off"
                    spellCheck={false}
                  />
                  {isCheckingUsername && (
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full"
                      />
                    </div>
                  )}
                  {!isCheckingUsername && username.length >= 3 && !usernameError && (
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                      <Check size={15} className="text-success-600" />
                    </div>
                  )}
                </div>

                <AnimatePresence>
                  {usernameError && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-2 text-xs text-danger-600"
                    >
                      {usernameError}
                    </motion.p>
                  )}
                </AnimatePresence>

                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs text-surface-400">
                    Letters, numbers, underscores only
                  </p>
                  <p className="text-xs text-surface-400">
                    {username.length}/30
                  </p>
                </div>
              </div>

              {/* Suggestions */}
              {profile?.email && (
                <div>
                  <p className="text-xs font-medium text-surface-500 mb-2">
                    Suggestions:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      profile.email.split('@')[0].replace(/[^a-z0-9]/gi, '_'),
                      `${profile.email.split('@')[0].replace(/[^a-z0-9]/gi, '')}_pro`,
                      `tool_${Math.random().toString(36).substring(2, 6)}`,
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => validateUsername(suggestion.substring(0, 20))}
                        className="text-xs px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full font-medium hover:bg-primary-100 transition-colors"
                      >
                        @{suggestion.substring(0, 20)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2 — Language */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Globe size={28} className="text-primary-600" />
                </div>
                <h2 className="text-xl font-display font-bold text-surface-900 mb-2">
                  Choose your language
                </h2>
                <p className="text-surface-500 text-sm">
                  You can change this anytime from your profile
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    value: 'en',
                    label: 'English',
                    flag: '🇬🇧',
                    desc: 'Full English interface',
                  },
                  {
                    value: 'ur',
                    label: 'اردو',
                    flag: '🇵🇰',
                    desc: 'مکمل اردو انٹرفیس',
                  },
                ].map((lang) => (
                  <motion.button
                    key={lang.value}
                    onClick={() => setLocalLanguage(lang.value as 'en' | 'ur')}
                    whileTap={{ scale: 0.97 }}
                    className={clsx(
                      'p-5 rounded-2xl border-2 text-center transition-all duration-200',
                      language === lang.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-surface-200 bg-white hover:border-primary-300'
                    )}
                  >
                    <span className="text-4xl mb-3 block">{lang.flag}</span>
                    <p className={clsx(
                      'font-bold text-base mb-1',
                      language === lang.value
                        ? 'text-primary-700'
                        : 'text-surface-800'
                    )}>
                      {lang.label}
                    </p>
                    <p className="text-xs text-surface-500">{lang.desc}</p>
                    {language === lang.value && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="mt-2 w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center mx-auto"
                      >
                        <Check size={11} className="text-white" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3 — Heard From */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Heart size={28} className="text-primary-600" />
                </div>
                <h2 className="text-xl font-display font-bold text-surface-900 mb-2">
                  How did you find us?
                </h2>
                <p className="text-surface-500 text-sm">
                  Help us understand how to reach more people
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {HEARD_FROM_OPTIONS.map((option) => (
                  <motion.button
                    key={option.value}
                    onClick={() => setHeardFrom(option.value)}
                    whileTap={{ scale: 0.97 }}
                    className={clsx(
                      'flex items-center gap-3 p-3.5 rounded-xl border-2',
                      'text-left transition-all duration-200',
                      heardFrom === option.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-surface-200 bg-white hover:border-primary-300'
                    )}
                  >
                    <span className="text-xl flex-shrink-0">{option.icon}</span>
                    <span className={clsx(
                      'text-xs font-semibold',
                      heardFrom === option.value
                        ? 'text-primary-700'
                        : 'text-surface-700'
                    )}>
                      {option.label}
                    </span>
                    {heardFrom === option.value && (
                      <Check size={13} className="text-primary-600 ml-auto flex-shrink-0" />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4 — Bio */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MessageSquare size={28} className="text-primary-600" />
                </div>
                <h2 className="text-xl font-display font-bold text-surface-900 mb-2">
                  Tell us about yourself
                </h2>
                <p className="text-surface-500 text-sm">
                  Optional — you can skip this step
                </p>
              </div>

              <div>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value.substring(0, 160))}
                  placeholder="I'm a freelancer / developer / content creator..."
                  rows={4}
                  className="input resize-none"
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-surface-400">
                    Max 160 characters
                  </p>
                  <p className={clsx(
                    'text-xs font-medium',
                    bio.length > 140 ? 'text-warning-600' : 'text-surface-400'
                  )}>
                    {bio.length}/160
                  </p>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-surface-50 rounded-xl p-4 border border-surface-200">
                <p className="text-xs font-bold text-surface-700 mb-3 flex items-center gap-1.5">
                  <Sparkles size={12} className="text-primary-600" />
                  Your account summary
                </p>
                <div className="space-y-2">
                  {[
                    { label: 'Username', value: `@${username}` },
                    {
                      label: 'Language',
                      value: language === 'en' ? '🇬🇧 English' : '🇵🇰 اردو',
                    },
                    {
                      label: 'Referred via',
                      value: HEARD_FROM_OPTIONS.find(
                        (o) => o.value === heardFrom
                      )?.label,
                    },
                    { label: 'Daily AI Credits', value: '⚡ 20 credits' },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between"
                    >
                      <span className="text-xs text-surface-500">{label}</span>
                      <span className="text-xs font-semibold text-surface-800">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    )
  }

  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-hero rounded-xl flex items-center justify-center">
              <Zap size={17} className="text-white fill-current" />
            </div>
            <span className="font-display font-bold text-surface-900 text-lg">
              TOOLVAULT <span className="text-primary-600">PRO</span>
            </span>
          </div>
        </div>

        {/* Card */}
        <div className="card p-6 md:p-8">
          {/* Step indicator */}
          {step <= 4 && (
            <StepIndicator currentStep={step} totalSteps={STEPS.length} />
          )}

          {/* Step label */}
          {step <= 4 && (
            <p className="text-center text-xs font-semibold text-primary-600 bg-primary-50 px-3 py-1.5 rounded-full w-fit mx-auto mb-6">
              Step {step} of {STEPS.length}
            </p>
          )}

          {/* Content */}
          <div className="min-h-[320px] flex flex-col justify-center">
            {renderStep()}
          </div>

          {/* Navigation */}
          {step <= 4 && (
            <div className="flex items-center gap-3 mt-8">
              {step > 1 && (
                <motion.button
                  onClick={prevStep}
                  whileTap={{ scale: 0.97 }}
                  className="btn-secondary flex items-center gap-2 text-sm px-4 py-2.5"
                >
                  <ArrowLeft size={15} />
                  Back
                </motion.button>
              )}

              <motion.button
                onClick={nextStep}
                disabled={!canProceed() || isSubmitting}
                whileTap={{ scale: 0.97 }}
                className={clsx(
                  'flex-1 btn-primary flex items-center justify-center gap-2 text-sm py-3',
                  (!canProceed() || isSubmitting) && 'opacity-60 cursor-not-allowed'
                )}
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    Setting up...
                  </>
                ) : step === STEPS.length ? (
                  <>
                    <Sparkles size={15} />
                    Complete Setup
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight size={15} />
                  </>
                )}
              </motion.button>
            </div>
          )}

          {/* Skip bio */}
          {step === 4 && !isSubmitting && (
            <button
              onClick={handleSubmit}
              className="w-full text-center text-xs text-surface-400 hover:text-surface-600 mt-3 transition-colors"
            >
              Skip bio and complete setup →
            </button>
          )}
        </div>

        {/* Progress bar */}
        {step <= 4 && (
          <div className="mt-4 h-1.5 bg-surface-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-primary rounded-full"
              animate={{ width: `${(step / STEPS.length) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
