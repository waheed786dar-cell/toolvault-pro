// ============================================
// TOOLVAULT PRO — AUTH STORE (ZUSTAND)
// ============================================
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Profile, AuthUser } from '@/types'

// ============================================
// STATE INTERFACE
// ============================================
interface AuthState {
  // State
  user: AuthUser | null
  profile: Profile | null
  isLoading: boolean
  isAuthenticated: boolean
  isOnboarded: boolean

  // Actions
  setUser: (user: AuthUser | null) => void
  setProfile: (profile: Profile | null) => void
  setLoading: (loading: boolean) => void
  updateProfile: (updates: Partial<Profile>) => void
  incrementToolsUsed: () => void
  reset: () => void
}

// ============================================
// INITIAL STATE
// ============================================
const initialState = {
  user: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,
  isOnboarded: false,
}

// ============================================
// AUTH STORE
// ============================================
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          isLoading: false,
        }),

      setProfile: (profile) =>
        set({
          profile,
          isOnboarded: profile?.onboarding_done ?? false,
        }),

      setLoading: (isLoading) => set({ isLoading }),

      updateProfile: (updates) => {
        const current = get().profile
        if (!current) return
        set({
          profile: { ...current, ...updates },
          isOnboarded: updates.onboarding_done ?? current.onboarding_done,
        })
      },

      incrementToolsUsed: () => {
        const current = get().profile
        if (!current) return
        set({
          profile: {
            ...current,
            tools_used_count: current.tools_used_count + 1,
          },
        })
      },

      reset: () =>
        set({
          ...initialState,
          isLoading: false,
        }),
    }),
    {
      name: 'toolvault-auth',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
        isAuthenticated: state.isAuthenticated,
        isOnboarded: state.isOnboarded,
      }),
    }
  )
)

// ============================================
// SELECTORS
// ============================================
export const selectUser = (state: AuthState) => state.user
export const selectProfile = (state: AuthState) => state.profile
export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated
export const selectIsOnboarded = (state: AuthState) => state.isOnboarded
export const selectIsLoading = (state: AuthState) => state.isLoading
