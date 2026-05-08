// ============================================
// TOOLVAULT PRO — UI STORE (ZUSTAND)
// ============================================
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// ============================================
// STATE INTERFACE
// ============================================
interface UIState {
  // State
  language: 'en' | 'ur'
  isSidebarOpen: boolean
  isModalOpen: boolean
  modalContent: string | null
  notifications: number
  isPageLoading: boolean
  searchOpen: boolean

  // Actions
  setLanguage: (lang: 'en' | 'ur') => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  openModal: (content: string) => void
  closeModal: () => void
  setNotifications: (count: number) => void
  decrementNotifications: () => void
  setPageLoading: (loading: boolean) => void
  toggleSearch: () => void
  setSearchOpen: (open: boolean) => void
}

// ============================================
// UI STORE
// ============================================
export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // Initial state
      language: 'en',
      isSidebarOpen: false,
      isModalOpen: false,
      modalContent: null,
      notifications: 0,
      isPageLoading: false,
      searchOpen: false,

      // Language
      setLanguage: (language) => set({ language }),

      // Sidebar
      toggleSidebar: () =>
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

      setSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),

      // Modal
      openModal: (content) =>
        set({ isModalOpen: true, modalContent: content }),

      closeModal: () =>
        set({ isModalOpen: false, modalContent: null }),

      // Notifications
      setNotifications: (notifications) => set({ notifications }),

      decrementNotifications: () =>
        set((state) => ({
          notifications: Math.max(0, state.notifications - 1),
        })),

      // Page loading
      setPageLoading: (isPageLoading) => set({ isPageLoading }),

      // Search
      toggleSearch: () =>
        set((state) => ({ searchOpen: !state.searchOpen })),

      setSearchOpen: (searchOpen) => set({ searchOpen }),
    }),
    {
      name: 'toolvault-ui',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        language: state.language,
      }),
    }
  )
)

// ============================================
// SELECTORS
// ============================================
export const selectLanguage = (s: UIState) => s.language
export const selectIsSidebarOpen = (s: UIState) => s.isSidebarOpen
export const selectIsModalOpen = (s: UIState) => s.isModalOpen
export const selectNotifications = (s: UIState) => s.notifications
export const selectIsPageLoading = (s: UIState) => s.isPageLoading
export const selectSearchOpen = (s: UIState) => s.searchOpen
