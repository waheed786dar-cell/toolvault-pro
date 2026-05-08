// ============================================
// TOOLVAULT PRO — AUTH HOOK
// ============================================
'use client'
import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/authStore'
import type { OnboardingData, ProfileUpdateInput } from '@/types'

export function useAuth() {
  const router = useRouter()
  const supabase = createClient()
  const {
    user,
    profile,
    isLoading,
    isAuthenticated,
    isOnboarded,
    setUser,
    setProfile,
    setLoading,
    updateProfile,
    reset,
  } = useAuthStore()

  // ============================================
  // INITIALIZE AUTH STATE
  // ============================================
  useEffect(() => {
    let mounted = true

    async function initAuth() {
      try {
        setLoading(true)

        // Get current session
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser()

        if (!mounted) return

        if (authUser) {
          // Fetch profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single()

          setUser({
            id: authUser.id,
            email: authUser.email ?? '',
            profile: profileData,
          })
          setProfile(profileData)
        } else {
          setUser(null)
          setProfile(null)
        }
      } catch (error) {
        console.error('Auth init error:', error)
        setUser(null)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    initAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return

      if (event === 'SIGNED_IN' && session?.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        setUser({
          id: session.user.id,
          email: session.user.email ?? '',
          profile: profileData,
        })
        setProfile(profileData)
      }

      if (event === 'SIGNED_OUT') {
        reset()
        router.push('/auth/login')
      }

      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed')
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  // ============================================
  // SIGN UP WITH EMAIL
  // ============================================
  const signUp = useCallback(async (
    email: string,
    password: string,
    captchaToken: string
  ) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, captchaToken }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.error }
      }

      return { success: true, data }
    } catch {
      return { success: false, error: 'Registration failed' }
    }
  }, [])

  // ============================================
  // SIGN IN WITH EMAIL
  // ============================================
  const signIn = useCallback(async (
    email: string,
    password: string,
    captchaToken: string
  ) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, captchaToken }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.error }
      }

      // Refresh session client side
      await supabase.auth.setSession({
        access_token: data.data.session.access_token,
        refresh_token: data.data.session.refresh_token,
      })

      return { success: true }
    } catch {
      return { success: false, error: 'Login failed' }
    }
  }, [])

  // ============================================
  // SIGN IN WITH GOOGLE
  // ============================================
  const signInWithGoogle = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      if (error) return { success: false, error: error.message }
      return { success: true }
    } catch {
      return { success: false, error: 'Google sign in failed' }
    }
  }, [])

  // ============================================
  // SIGN OUT
  // ============================================
  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut()
      reset()
      router.push('/')
      return { success: true }
    } catch {
      return { success: false, error: 'Sign out failed' }
    }
  }, [])

  // ============================================
  // COMPLETE ONBOARDING
  // ============================================
  const completeOnboarding = useCallback(async (
    data: OnboardingData
  ) => {
    if (!user) return { success: false, error: 'Not authenticated' }

    try {
      const response = await fetch('/api/auth/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        return { success: false, error: result.error }
      }

      updateProfile({
        username: data.username,
        heard_from: data.heard_from,
        language: data.language,
        onboarding_done: true,
      })

      return { success: true }
    } catch {
      return { success: false, error: 'Onboarding failed' }
    }
  }, [user])

  // ============================================
  // UPDATE PROFILE
  // ============================================
  const updateUserProfile = useCallback(async (
    updates: ProfileUpdateInput
  ) => {
    if (!user) return { success: false, error: 'Not authenticated' }

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)

      if (error) return { success: false, error: error.message }

      updateProfile(updates as Partial<typeof profile>)
      return { success: true }
    } catch {
      return { success: false, error: 'Update failed' }
    }
  }, [user])

  // ============================================
  // UPLOAD AVATAR
  // ============================================
  const uploadAvatar = useCallback(async (file: File) => {
    if (!user) return { success: false, error: 'Not authenticated' }

    try {
      const formData = new FormData()
      formData.append('avatar', file)

      const response = await fetch('/api/profile/avatar', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        return { success: false, error: result.error }
      }

      updateProfile({ avatar_url: result.data.url })
      return { success: true, url: result.data.url }
    } catch {
      return { success: false, error: 'Avatar upload failed' }
    }
  }, [user])

  return {
    // State
    user,
    profile,
    isLoading,
    isAuthenticated,
    isOnboarded,

    // Actions
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    completeOnboarding,
    updateUserProfile,
    uploadAvatar,
  }
}
