// ============================================
// TOOLVAULT PRO — TOOL STORE (ZUSTAND)
// ============================================
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Tool, ToolCategory, SavedResult } from '@/types'
import {
  ALL_TOOLS,
  searchTools,
  getToolsByCategory,
} from '@/constants/tools'

// ============================================
// STATE INTERFACE
// ============================================
interface ToolState {
  // State
  allTools: Tool[]
  filteredTools: Tool[]
  selectedCategory: ToolCategory | 'all'
  searchQuery: string
  recentTools: string[]
  savedResults: SavedResult[]
  isGenerating: boolean
  currentTool: Tool | null
  generationResult: string | null
  generationError: string | null

  // Actions
  setCategory: (category: ToolCategory | 'all') => void
  setSearchQuery: (query: string) => void
  setCurrentTool: (tool: Tool | null) => void
  addRecentTool: (slug: string) => void
  setSavedResults: (results: SavedResult[]) => void
  addSavedResult: (result: SavedResult) => void
  removeSavedResult: (id: string) => void
  setGenerating: (isGenerating: boolean) => void
  setGenerationResult: (result: string | null) => void
  setGenerationError: (error: string | null) => void
  resetGeneration: () => void
}

// ============================================
// TOOL STORE
// ============================================
export const useToolStore = create<ToolState>()(
  persist(
    (set, get) => ({
      // Initial state
      allTools: ALL_TOOLS,
      filteredTools: ALL_TOOLS,
      selectedCategory: 'all',
      searchQuery: '',
      recentTools: [],
      savedResults: [],
      isGenerating: false,
      currentTool: null,
      generationResult: null,
      generationError: null,

      // Set category filter
      setCategory: (category) => {
        const query = get().searchQuery
        let filtered = category === 'all'
          ? ALL_TOOLS
          : getToolsByCategory(category as ToolCategory)

        if (query) {
          filtered = filtered.filter(
            (t) =>
              t.name.toLowerCase().includes(query.toLowerCase()) ||
              t.description.toLowerCase().includes(query.toLowerCase())
          )
        }

        set({ selectedCategory: category, filteredTools: filtered })
      },

      // Search tools
      setSearchQuery: (query) => {
        const category = get().selectedCategory
        let filtered = query ? searchTools(query) : ALL_TOOLS

        if (category !== 'all') {
          filtered = filtered.filter((t) => t.category === category)
        }

        set({ searchQuery: query, filteredTools: filtered })
      },

      // Set current active tool
      setCurrentTool: (tool) =>
        set({
          currentTool: tool,
          generationResult: null,
          generationError: null,
        }),

      // Add to recent tools (max 10)
      addRecentTool: (slug) => {
        const current = get().recentTools
        const updated = [
          slug,
          ...current.filter((s) => s !== slug),
        ].slice(0, 10)
        set({ recentTools: updated })
      },

      // Saved results
      setSavedResults: (results) => set({ savedResults: results }),

      addSavedResult: (result) =>
        set((state) => ({
          savedResults: [result, ...state.savedResults],
        })),

      removeSavedResult: (id) =>
        set((state) => ({
          savedResults: state.savedResults.filter((r) => r.id !== id),
        })),

      // Generation state
      setGenerating: (isGenerating) => set({ isGenerating }),

      setGenerationResult: (result) =>
        set({
          generationResult: result,
          isGenerating: false,
          generationError: null,
        }),

      setGenerationError: (error) =>
        set({
          generationError: error,
          isGenerating: false,
          generationResult: null,
        }),

      resetGeneration: () =>
        set({
          generationResult: null,
          generationError: null,
          isGenerating: false,
        }),
    }),
    {
      name: 'toolvault-tools',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        recentTools: state.recentTools,
        selectedCategory: state.selectedCategory,
      }),
    }
  )
)

// ============================================
// SELECTORS
// ============================================
export const selectFilteredTools = (s: ToolState) => s.filteredTools
export const selectRecentTools = (s: ToolState) => s.recentTools
export const selectCurrentTool = (s: ToolState) => s.currentTool
export const selectIsGenerating = (s: ToolState) => s.isGenerating
export const selectGenerationResult = (s: ToolState) => s.generationResult
export const selectGenerationError = (s: ToolState) => s.generationError
