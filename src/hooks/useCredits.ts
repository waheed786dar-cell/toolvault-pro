// ============================================
// TOOLVAULT PRO — CREDITS HOOK
// ============================================
'use client'
import { useEffect, useCallback } from 'react'
import { useCreditsStore } from '@/store/creditsStore'
import { useAuthStore } from '@/store/authStore'
import { toast } from 'sonner'

export function useCredits() {
  const { isAuthenticated } = useAuthStore()
  const {
    daily,
    bonus,
    total,
    totalUsed,
    lastReset,
    isLoading,
    setCredits,
    consumeCredits,
    setLoading,
  } = useCreditsStore()

  useEffect(() => {
    if (!isAuthenticated) return
    fetchCredits()
  }, [isAuthenticated])

  const fetchCredits = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/credits')
      const data = await res.json()
      if (data.success) {
        setCredits(data.data)
      }
    } catch {
      // Silent
    } finally {
      setLoading(false)
    }
  }, [])

  const useCredit = useCallback(
    async (amount: number = 1): Promise<boolean> => {
      if (total < amount) {
        toast.error(
          `Not enough credits! You have ${total} credits left. Come back tomorrow for 20 free credits!`,
          { duration: 4000 }
        )
        return false
      }

      // Optimistic
      consumeCredits(amount)

      try {
        const res = await fetch('/api/credits', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount }),
        })

        const data = await res.json()

        if (!res.ok) {
          // Rollback — refetch
          await fetchCredits()
          toast.error(data.error ?? 'Failed to use credits')
          return false
        }

        // Show warning if low
        const remaining = data.data.remaining
        if (remaining <= 3 && remaining > 0) {
          toast.warning(`Only ${remaining} credits remaining today!`)
        } else if (remaining === 0) {
          toast.error('No credits left! Come back tomorrow for 20 free credits.')
        }

        return true
      } catch {
        await fetchCredits()
        return false
      }
    },
    [total, consumeCredits, fetchCredits]
  )

  const isLow = total <= 5
  const isEmpty = total === 0
  const percentage = Math.round((total / 20) * 100)

  return {
    daily,
    bonus,
    total,
    totalUsed,
    lastReset,
    isLoading,
    isLow,
    isEmpty,
    percentage,
    useCredit,
    fetchCredits,
  }
}
