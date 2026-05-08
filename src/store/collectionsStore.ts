// ============================================
// TOOLVAULT PRO — COLLECTIONS STORE
// ============================================
import { create } from 'zustand'

interface Collection {
  id: string
  user_id: string
  name: string
  description: string | null
  is_public: boolean
  color: string
  created_at: string
  collection_tools: { tool_slug: string }[]
}

interface CollectionsState {
  collections: Collection[]
  activeCollection: Collection | null
  isLoading: boolean
  setCollections: (collections: Collection[]) => void
  addCollection: (collection: Collection) => void
  removeCollection: (id: string) => void
  updateCollection: (id: string, updates: Partial<Collection>) => void
  setActiveCollection: (collection: Collection | null) => void
  addToolToCollection: (collectionId: string, toolSlug: string) => void
  removeToolFromCollection: (collectionId: string, toolSlug: string) => void
  setLoading: (loading: boolean) => void
}

export const useCollectionsStore = create<CollectionsState>()((set, get) => ({
  collections: [],
  activeCollection: null,
  isLoading: false,

  setCollections: (collections) => set({ collections }),

  addCollection: (collection) =>
    set((state) => ({
      collections: [collection, ...state.collections],
    })),

  removeCollection: (id) =>
    set((state) => ({
      collections: state.collections.filter((c) => c.id !== id),
    })),

  updateCollection: (id, updates) =>
    set((state) => ({
      collections: state.collections.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    })),

  setActiveCollection: (activeCollection) => set({ activeCollection }),

  addToolToCollection: (collectionId, toolSlug) =>
    set((state) => ({
      collections: state.collections.map((c) =>
        c.id === collectionId
          ? {
              ...c,
              collection_tools: [
                ...c.collection_tools,
                { tool_slug: toolSlug },
              ],
            }
          : c
      ),
    })),

  removeToolFromCollection: (collectionId, toolSlug) =>
    set((state) => ({
      collections: state.collections.map((c) =>
        c.id === collectionId
          ? {
              ...c,
              collection_tools: c.collection_tools.filter(
                (t) => t.tool_slug !== toolSlug
              ),
            }
          : c
      ),
    })),

  setLoading: (isLoading) => set({ isLoading }),
}))
