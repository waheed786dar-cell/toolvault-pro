// ============================================
// TOOLVAULT PRO — CREDITS STORE
// ============================================
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface CreditsState {
  daily: number
  bonus: number
  total: number
  totalUsed: number
  lastReset: string | null
  isLoading: boolean
  setCredits: (data: {
    daily: number
    bonus: number
    total: number
    totalUsed: number
    lastReset: string
  }) => void
  consumeCredits: (amount: number) => void
  setLoading: (loading: boolean) => void
  reset: () => void
}

export const useCreditsStore = create<CreditsState>()(
  persist(
    (set, get) => ({
      daily: 20,
      bonus: 0,
      total: 20,
      totalUsed: 0,
      lastReset: null,
      isLoading: false,

      setCredits: (data) =>
        set({
          daily: data.daily,
          bonus: data.bonus,
          total: data.total,
          totalUsed: data.totalUsed,
          lastReset: data.lastReset,
        }),

      consumeCredits: (amount) => {
        const { daily, bonus } = get()
        let newDaily = daily
        let newBonus = bonus

        if (newDaily >= amount) {
          newDaily -= amount
        } else {
          const remaining = amount - newDaily
          newDaily = 0
          newBonus = Math.max(0, newBonus - remaining)
        }

        set({
          daily: newDaily,
          bonus: newBonus,
          total: newDaily + newBonus,
          totalUsed: get().totalUsed + amount,
        })
      },

      setLoading: (isLoading) => set({ isLoading }),

      reset: () =>
        set({
          daily: 20,
          bonus: 0,
          total: 20,
          totalUsed: 0,
          lastReset: null,
        }),
    }),
    {
      name: 'toolvault-credits',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        daily: state.daily,
        bonus: state.bonus,
        total: state.total,
        lastReset: state.lastReset,
      }),
    }
  )
)
