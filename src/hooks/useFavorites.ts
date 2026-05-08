// ============================================
// TOOLVAULT PRO — FAVORITES HOOK
// ============================================
'use client'
import { useEffect, useCallback } from 'react'
import { useFavoritesStore } from '@/store/favoritesStore'
import { useAuthStore } from '@/store/authStore'
import { toast } from 'sonner'

export function useFavorites() {
  const { isAuthenticated } = useAuthStore()
  const {
    favorites,
    isLoading,
    setFavorites,
    addFavorite,
    removeFavorite,
    isFavorited,
    setLoading,
  } = useFavoritesStore()

  // Fetch favorites on mount
  useEffect(() => {
    if (!isAuthenticated) return
    fetchFavorites()
  }, [isAuthenticated])

  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/favorites')
      const data = await res.json()
      if (data.success) {
        setFavorites(data.data.map((f: { tool_slug: string }) => f.tool_slug))
      }
    } catch {
      // Silent fail
    } finally {
      setLoading(false)
    }
  }, [])

  const toggleFavorite = useCallback(
    async (slug: string) => {
      if (!isAuthenticated) {
        toast.error('Please login to save favorites')
        return
      }

      const alreadyFav = isFavorited(slug)

      // Optimistic update
      if (alreadyFav) {
        removeFavorite(slug)
      } else {
        addFavorite(slug)
      }

      try {
        if (alreadyFav) {
          const res = await fetch(`/api/favorites/${slug}`, {
            method: 'DELETE',
          })
          if (!res.ok) {
            addFavorite(slug) // Rollback
            toast.error('Failed to remove favorite')
          } else {
            toast.success('Removed from favorites')
          }
        } else {
          const res = await fetch('/api/favorites', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tool_slug: slug }),
          })
          if (!res.ok) {
            removeFavorite(slug) // Rollback
            const data = await res.json()
            toast.error(data.error ?? 'Failed to add favorite')
          } else {
            toast.success('Added to favorites! ❤️')
          }
        }
      } catch {
        // Rollback on error
        if (alreadyFav) addFavorite(slug)
        else removeFavorite(slug)
        toast.error('Something went wrong')
      }
    },
    [isAuthenticated, isFavorited]
  )

  return {
    favorites,
    isLoading,
    isFavorited,
    toggleFavorite,
    fetchFavorites,
    favoritesCount: favorites.length,
  }
}
