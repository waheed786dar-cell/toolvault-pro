// ============================================
// TOOLVAULT PRO — COLLECTIONS PAGE
// ============================================
'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import {
  BookOpen, Plus, Trash2, Globe,
  Lock, Pencil, X, Check, Loader2
} from 'lucide-react'
import { useCollectionsStore } from '@/store/collectionsStore'
import { ALL_TOOLS, getToolBySlug } from '@/constants/tools'
import { toast } from 'sonner'
import { clsx } from 'clsx'
import Link from 'next/link'
import type { Tool } from '@/types'

const COLORS = [
  '#2563EB', '#7C3AED', '#DC2626',
  '#059669', '#D97706', '#0891B2',
]

export default function CollectionsPage() {
  const {
    collections, setCollections,
    addCollection, removeCollection,
    updateCollection, addToolToCollection,
    removeToolFromCollection,
  } = useCollectionsStore()

  const [isLoading, setIsLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newColor, setNewColor] = useState(COLORS[0])
  const [isPublic, setIsPublic] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [activeCollection, setActiveCollection] = useState<string | null>(null)
  const [toolSearch, setToolSearch] = useState('')

  useEffect(() => { fetchCollections() }, [])

  const fetchCollections = async () => {
    try {
      const res = await fetch('/api/collections')
      const data = await res.json()
      if (data.success) setCollections(data.data)
    } catch {
      toast.error('Failed to load collections')
    } finally {
      setIsLoading(false)
    }
  }

  const createCollection = async () => {
    if (!newName.trim()) return
    setIsCreating(true)
    try {
      const res = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName,
          description: newDesc,
          color: newColor,
          is_public: isPublic,
        }),
      })
      const data = await res.json()
      if (data.success) {
        addCollection(data.data)
        setShowCreate(false)
        setNewName('')
        setNewDesc('')
        toast.success('Collection created!')
      } else {
        toast.error(data.error)
      }
    } finally {
      setIsCreating(false)
    }
  }

  const deleteCollection = async (id: string) => {
    try {
      await fetch(`/api/collections/${id}`, { method: 'DELETE' })
      removeCollection(id)
      toast.success('Collection deleted')
      if (activeCollection === id) setActiveCollection(null)
    } catch {
      toast.error('Delete failed')
    }
  }

  const toggleTool = async (collectionId: string, slug: string) => {
    const collection = collections.find((c) => c.id === collectionId)
    if (!collection) return

    const hasIt = collection.collection_tools.some((t) => t.tool_slug === slug)

    if (hasIt) {
      await fetch(`/api/collections/${collectionId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool_slug: slug }),
      })
      removeToolFromCollection(collectionId, slug)
    } else {
      await fetch(`/api/collections/${collectionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool_slug: slug }),
      })
      addToolToCollection(collectionId, slug)
    }
  }

  const filteredTools = ALL_TOOLS.filter((t) =>
    t.name.toLowerCase().includes(toolSearch.toLowerCase())
  )

  const activeCol = collections.find((c) => c.id === activeCollection)

  return (
    <div className="min-h-screen bg-surface-50">
      <Navbar />
      <main className="container-main py-6 max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BookOpen size={20} className="text-primary-600" />
              <h1 className="text-2xl font-display font-bold text-surface-900">
                Collections
              </h1>
            </div>
            <p className="text-surface-500 text-sm">
              Organize tools into custom groups
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <Plus size={15} />
            New Collection
          </button>
        </div>

        {/* Create Modal */}
        <AnimatePresence>
          {showCreate && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="card p-5 mb-5 border-2 border-primary-200"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-surface-900">New Collection</h3>
                <button onClick={() => setShowCreate(false)}>
                  <X size={16} className="text-surface-400" />
                </button>
              </div>

              <div className="space-y-3">
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Collection name..."
                  className="input"
                  autoFocus
                  maxLength={50}
                />
                <input
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Description (optional)"
                  className="input"
                  maxLength={200}
                />

                {/* Color picker */}
                <div>
                  <p className="text-xs font-medium text-surface-600 mb-2">Color</p>
                  <div className="flex gap-2">
                    {COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => setNewColor(color)}
                        className="w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                        style={{ backgroundColor: color }}
                      >
                        {newColor === color && (
                          <Check size={13} className="text-white" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Public toggle */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    onClick={() => setIsPublic(!isPublic)}
                    className={clsx(
                      'w-10 h-5 rounded-full transition-colors duration-200 relative',
                      isPublic ? 'bg-primary-600' : 'bg-surface-300'
                    )}
                  >
                    <div className={clsx(
                      'absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200',
                      isPublic ? 'left-5' : 'left-0.5'
                    )} />
                  </div>
                  <span className="text-xs font-medium text-surface-700">
                    {isPublic ? '🌐 Public collection' : '🔒 Private collection'}
                  </span>
                </label>

                <button
                  onClick={createCollection}
                  disabled={!newName.trim() || isCreating}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  {isCreating ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Plus size={15} />
                  )}
                  Create Collection
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collections List */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-5 animate-pulse">
                <div className="skeleton h-5 w-32 rounded mb-2" />
                <div className="skeleton h-3 w-48 rounded" />
              </div>
            ))}
          </div>
        ) : collections.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen size={40} className="mx-auto mb-3 text-surface-300" />
            <h3 className="font-bold text-surface-700 mb-2">No collections yet</h3>
            <p className="text-sm text-surface-500 mb-4">
              Create your first collection to organize tools
            </p>
            <button
              onClick={() => setShowCreate(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus size={15} />
              Create Collection
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {collections.map((col) => (
              <motion.div
                key={col.id}
                layout
                className="card overflow-hidden"
              >
                {/* Collection Header */}
                <div
                  className="p-4 flex items-center gap-3 cursor-pointer hover:bg-surface-50 transition-colors"
                  onClick={() => setActiveCollection(
                    activeCollection === col.id ? null : col.id
                  )}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex-shrink-0"
                    style={{ backgroundColor: `${col.color}20`, borderLeft: `3px solid ${col.color}` }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-surface-900 text-sm truncate">
                        {col.name}
                      </h3>
                      {col.is_public ? (
                        <Globe size={12} className="text-success-600 flex-shrink-0" />
                      ) : (
                        <Lock size={12} className="text-surface-400 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-surface-500">
                      {col.collection_tools.length} tools
                      {col.description && ` · ${col.description}`}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteCollection(col.id)
                    }}
                    className="p-1.5 rounded-lg hover:bg-danger-50 text-surface-400 hover:text-danger-600 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Tool Pills */}
                {col.collection_tools.length > 0 && activeCollection !== col.id && (
                  <div className="px-4 pb-3 flex flex-wrap gap-1.5">
                    {col.collection_tools.slice(0, 6).map(({ tool_slug }) => {
                      const tool = getToolBySlug(tool_slug)
                      if (!tool) return null
                      return (
                        <Link
                          key={tool_slug}
                          href={`/tools/${tool_slug}`}
                          className="flex items-center gap-1 text-xs bg-surface-100 hover:bg-primary-50 text-surface-700 hover:text-primary-700 px-2.5 py-1 rounded-full transition-colors"
                        >
                          <span>{tool.icon}</span>
                          {tool.name}
                        </Link>
                      )
                    })}
                    {col.collection_tools.length > 6 && (
                      <span className="text-xs text-surface-400 px-2 py-1">
                        +{col.collection_tools.length - 6} more
                      </span>
                    )}
                  </div>
                )}

                {/* Add Tools Panel */}
                <AnimatePresence>
                  {activeCollection === col.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-surface-100 overflow-hidden"
                    >
                      <div className="p-4">
                        <p className="text-xs font-bold text-surface-700 mb-3">
                          Add / Remove Tools
                        </p>
                        <input
                          value={toolSearch}
                          onChange={(e) => setToolSearch(e.target.value)}
                          placeholder="Search tools..."
                          className="input text-xs py-2 mb-3"
                        />
                        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                          {filteredTools.map((tool) => {
                            const hasIt = col.collection_tools.some(
                              (t) => t.tool_slug === tool.slug
                            )
                            return (
                              <button
                                key={tool.slug}
                                onClick={() => toggleTool(col.id, tool.slug)}
                                className={clsx(
                                  'flex items-center gap-2 p-2 rounded-xl border text-left text-xs font-medium transition-all',
                                  hasIt
                                    ? 'border-primary-300 bg-primary-50 text-primary-700'
                                    : 'border-surface-200 text-surface-700 hover:border-primary-200'
                                )}
                              >
                                <span>{tool.icon}</span>
                                <span className="truncate flex-1">{tool.name}</span>
                                {hasIt && <Check size={11} className="flex-shrink-0" />}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
