// ============================================
// TOOLVAULT PRO — AUTH CALLBACK PAGE
// ============================================
'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function CallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = createClient()

      const { data: { session }, error } = await supabase.auth.getSession()

      if (error || !session) {
        router.replace('/auth/login?error=oauth_failed')
        return
      }

      // Check onboarding
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_done')
        .eq('id', session.user.id)
        .single()

      if (!profile?.onboarding_done) {
        router.replace('/onboarding')
      } else {
        router.replace('/dashboard')
      }
    }

    handleCallback()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-14 h-14 bg-gradient-hero rounded-2xl flex items-center justify-center mx-auto mb-4"
        >
          <Zap size={24} className="text-white fill-current" />
        </motion.div>
        <p className="text-surface-500 text-sm font-medium">
          Signing you in...
        </p>
      </motion.div>
    </div>
  )
}
