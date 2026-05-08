// ============================================
// TOOLVAULT PRO — FAVORITES STORE
// ============================================
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface FavoritesState {
  favorites: string[]
  isLoading: boolean
  setFavorites: (slugs: string[]) => void
  addFavorite: (slug: string) => void
  removeFavorite: (slug: string) => void
  isFavorited: (slug: string) => boolean
  setLoading: (loading: boolean) => void
  reset: () => void
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      isLoading: false,

      setFavorites: (favorites) => set({ favorites }),

      addFavorite: (slug) =>
        set((state) => ({
          favorites: state.favorites.includes(slug)
            ? state.favorites
            : [...state.favorites, slug],
        })),

      removeFavorite: (slug) =>
        set((state) => ({
          favorites: state.favorites.filter((s) => s !== slug),
        })),

      isFavorited: (slug) => get().favorites.includes(slug),

      setLoading: (isLoading) => set({ isLoading }),

      reset: () => set({ favorites: [], isLoading: false }),
    }),
    {
      name: 'toolvault-favorites',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
