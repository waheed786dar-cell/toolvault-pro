// ============================================
// TOOLVAULT PRO — AI SEARCH BAR
// ============================================
'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Sparkles, X, Loader2, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useUIStore } from '@/store/uiStore'
import { ALL_TOOLS } from '@/constants/tools'
import { clsx } from 'clsx'

export function AISearchBar() {
  const router = useRouter()
  const { searchOpen, setSearchOpen } = useUIStore()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<typeof ALL_TOOLS>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isAI, setIsAI] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<NodeJS.Timeout>()

  // Focus input when opened
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setQuery('')
      setResults([])
    }
  }, [searchOpen])

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([])
      return
    }

    // Text search first (instant)
    const textResults = ALL_TOOLS.filter(
      (t) =>
        t.name.toLowerCase().includes(q.toLowerCase()) ||
        t.description.toLowerCase().includes(q.toLowerCase()) ||
        t.category.includes(q.toLowerCase())
    ).slice(0, 5)

    setResults(textResults)

    // AI search for natural language
    if (q.length > 4) {
      setIsSearching(true)
      try {
        const res = await fetch('/api/ai/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: q }),
        })
        const data = await res.json()

        if (data.success && data.data.source === 'ai') {
          const aiResults = data.data.slugs
            .map((slug: string) => ALL_TOOLS.find((t) => t.slug === slug))
            .filter(Boolean) as typeof ALL_TOOLS

          if (aiResults.length > 0) {
            setResults(aiResults)
            setIsAI(true)
          }
        }
      } catch {
        // Keep text results
      } finally {
        setIsSearching(false)
      }
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setQuery(val)
    setIsAI(false)

    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(val), 300)
  }

  const handleSelect = (slug: string) => {
    setSearchOpen(false)
    router.push(`/tools/${slug}`)
  }

  if (!searchOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-surface-900/50 backdrop-blur-sm"
          onClick={() => setSearchOpen(false)}
        />

        {/* Search Box */}
        <motion.div
          className="relative w-full max-w-xl"
          initial={{ scale: 0.95, y: -20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {/* Input */}
          <div className="relative bg-white rounded-2xl shadow-2xl border border-surface-200 overflow-hidden">
            <div className="flex items-center px-4 py-3.5 border-b border-surface-100">
              <Search size={18} className="text-surface-400 flex-shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={handleChange}
                placeholder="Search tools or describe what you need..."
                className="flex-1 mx-3 text-sm font-medium text-surface-900 placeholder-surface-400 bg-transparent outline-none"
              />
              <div className="flex items-center gap-2">
                {isSearching && (
                  <Loader2
                    size={16}
                    className="animate-spin text-primary-500"
                  />
                )}
                {isAI && !isSearching && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                    <Sparkles size={10} />
                    AI
                  </span>
                )}
                <button
                  onClick={() => setSearchOpen(false)}
                  className="p-1 rounded-lg hover:bg-surface-100 text-surface-400"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Results */}
            <AnimatePresence>
              {results.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="py-2"
                >
                  {results.map((tool, i) => (
                    <motion.button
                      key={tool.slug}
                      onClick={() => handleSelect(tool.slug)}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={clsx(
                        'w-full flex items-center gap-3 px-4 py-3',
                        'hover:bg-surface-50 transition-colors text-left',
                        'group'
                      )}
                    >
                      <span
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                        style={{ backgroundColor: `${tool.color}15` }}
                      >
                        {tool.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-surface-900 truncate">
                          {tool.name}
                        </p>
                        <p className="text-xs text-surface-500 truncate">
                          {tool.description}
                        </p>
                      </div>
                      <ArrowRight
                        size={14}
                        className="text-surface-300 group-hover:text-primary-500 transition-colors flex-shrink-0"
                      />
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Empty state */}
            {query && results.length === 0 && !isSearching && (
              <div className="py-8 text-center text-surface-400">
                <Search size={24} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">No tools found for "{query}"</p>
              </div>
            )}

            {/* Shortcuts hint */}
            {!query && (
              <div className="px-4 py-3 flex items-center gap-4 text-xs text-surface-400">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-surface-100 font-mono text-xs">↵</kbd>
                  Select
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-surface-100 font-mono text-xs">Esc</kbd>
                  Close
                </span>
                <span className="flex items-center gap-1 ml-auto">
                  <Sparkles size={11} className="text-primary-400" />
                  AI-powered search
                </span>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
