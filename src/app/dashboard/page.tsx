// ============================================
// TOOLVAULT PRO — DASHBOARD PAGE
// ============================================
'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  Search, Zap, Heart, Clock,
  BookOpen, Star, TrendingUp,
  Filter, Grid, List, X
} from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { FavoriteButton } from '@/components/features/FavoriteButton'
import { AnnouncementBanner } from '@/components/features/AnnouncementBanner'
import { useAuth } from '@/hooks/useAuth'
import { useTools } from '@/hooks/useTools'
import { useFavorites } from '@/hooks/useFavorites'
import { useKeyboard } from '@/hooks/useKeyboard'
import { useScrollReveal } from '@/hooks/useAnimation'
import {
  ALL_TOOLS, TOOL_CATEGORIES,
  getToolBySlug
} from '@/constants/tools'
import { clsx } from 'clsx'
import Link from 'next/link'
import type { Tool, ToolCategory } from '@/types'

// ============================================
// TOOL CARD
// ============================================
function ToolCard({
  tool,
  view = 'grid'
}: {
  tool: Tool
  view?: 'grid' | 'list'
}) {
  const { addRecentTool } = useTools()
  const { isFavorited, toggleFavorite } = useFavorites()

  if (view === 'list') {
    return (
      <motion.div
        layout
        className="card p-4 flex items-center gap-4 group"
        whileHover={{ x: 2 }}
      >
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ backgroundColor: `${tool.color}15` }}
        >
          {tool.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-sm font-bold text-surface-900 truncate">
              {tool.name}
            </h3>
            {tool.isNew && <span className="badge-new text-xs">New</span>}
            {tool.isPopular && <span className="badge-blue text-xs">Popular</span>}
          </div>
          <p className="text-xs text-surface-500 truncate">
            {tool.description}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <FavoriteButton slug={tool.slug} size="sm" />
          <Link
            href={`/tools/${tool.slug}`}
            onClick={() => addRecentTool(tool.slug)}
            className="btn-primary text-xs px-3 py-1.5"
          >
            Use
          </Link>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      layout
      className="card p-4 group relative"
      whileHover={{ y: -2 }}
    >
      {/* Favorite */}
      <div className="absolute top-3 right-3">
        <FavoriteButton slug={tool.slug} size="sm" />
      </div>

      {/* Icon */}
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-3"
        style={{ backgroundColor: `${tool.color}15` }}
      >
        {tool.icon}
      </div>

      {/* Badges */}
      <div className="flex gap-1 mb-2">
        {tool.isNew && <span className="badge-new text-xs">New</span>}
        {tool.isPopular && <span className="badge-blue text-xs">Popular</span>}
      </div>

      <h3 className="text-sm font-bold text-surface-900 mb-1">
        {tool.name}
      </h3>
      <p className="text-xs text-surface-500 mb-4 leading-relaxed line-clamp-2">
        {tool.description}
      </p>

      <Link
        href={`/tools/${tool.slug}`}
        onClick={() => addRecentTool(tool.slug)}
        className="btn-primary text-xs py-2 w-full text-center block"
      >
        Use Free Tool
      </Link>
    </motion.div>
  )
}

// ============================================
// DASHBOARD PAGE
// ============================================
export default function DashboardPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { profile, isAuthenticated, isLoading } = useAuth()
  const {
    filteredTools, selectedCategory,
    searchQuery, recentTools,
    setCategory, setSearchQuery,
  } = useTools()
  const { favorites } = useFavorites()
  useKeyboard()

  const containerRef = useRef<HTMLDivElement>(null)
  useScrollReveal('.tool-card-reveal')

  const [activeTab, setActiveTab] = useState(
    searchParams.get('tab') ?? 'all'
  )
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [localSearch, setLocalSearch] = useState('')

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/auth/login')
    }
  }, [isAuthenticated, isLoading])

  const categoryFromParams = searchParams.get('category') as ToolCategory
  useEffect(() => {
    if (categoryFromParams) {
      setCategory(categoryFromParams)
      setActiveTab('all')
    }
  }, [categoryFromParams])

  const handleSearch = (q: string) => {
    setLocalSearch(q)
    setSearchQuery(q)
  }

  // Tab tools
  const getTabTools = () => {
    switch (activeTab) {
      case 'favorites':
        return ALL_TOOLS.filter((t) => favorites.includes(t.slug))
      case 'recent':
        return recentTools
          .map((s) => getToolBySlug(s))
          .filter((t): t is Tool => !!t)
          .slice(0, 20)
      case 'popular':
        return ALL_TOOLS.filter((t) => t.isPopular)
      case 'new':
        return ALL_TOOLS.filter((t) => t.isNew)
      default:
        return filteredTools
    }
  }

  const displayTools = getTabTools()

  const TABS = [
    { id: 'all', label: 'All Tools', icon: Grid, count: ALL_TOOLS.length },
    { id: 'favorites', label: 'Favorites', icon: Heart, count: favorites.length },
    { id: 'recent', label: 'Recent', icon: Clock, count: recentTools.length },
    { id: 'popular', label: 'Popular', icon: Star, count: ALL_TOOLS.filter((t) => t.isPopular).length },
    { id: 'new', label: 'New', icon: TrendingUp, count: ALL_TOOLS.filter((t) => t.isNew).length },
  ]

  return (
    <div className="min-h-screen bg-surface-50">
      <Navbar />

      <main className="container-main py-6">
        {/* Welcome header */}
        <div className="mb-6">
          <h1 className="text-2xl font-display font-bold text-surface-900 mb-1">
            {profile?.language === 'ur'
              ? `خوش آمدید، ${profile?.username ?? 'دوست'} 👋`
              : `Welcome back, ${profile?.username ?? 'there'} 👋`}
          </h1>
          <p className="text-surface-500 text-sm">
            {ALL_TOOLS.length}+ free tools ready to use
          </p>
        </div>

        {/* Search + Filter Bar */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400"
            />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search tools..."
              className="input pl-9 pr-9"
            />
            {localSearch && (
              <button
                onClick={() => handleSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* View toggle */}
          <div className="flex gap-1 p-1 bg-surface-100 rounded-xl">
            {[
              { id: 'grid', icon: Grid },
              { id: 'list', icon: List },
            ].map(({ id, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setView(id as 'grid' | 'list')}
                className={clsx(
                  'p-2 rounded-lg transition-all',
                  view === id
                    ? 'bg-white text-primary-700 shadow-sm'
                    : 'text-surface-400 hover:text-surface-600'
                )}
              >
                <Icon size={15} />
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-4">
          <button
            onClick={() => { setCategory('all'); setActiveTab('all') }}
            className={clsx(
              'flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all',
              selectedCategory === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-surface-200 text-surface-600 hover:border-primary-300'
            )}
          >
            All
          </button>
          {TOOL_CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => {
                setCategory(cat.slug as ToolCategory)
                setActiveTab('all')
              }}
              className={clsx(
                'flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all',
                selectedCategory === cat.slug
                  ? 'bg-primary-600 text-white'
                  : 'bg-white border border-surface-200 text-surface-600 hover:border-primary-300'
              )}
            >
              <span>{cat.icon}</span>
              {cat.name}
              <span className={clsx(
                'px-1.5 py-0.5 rounded-full text-xs',
                selectedCategory === cat.slug
                  ? 'bg-white/20 text-white'
                  : 'bg-surface-100 text-surface-500'
              )}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto scrollbar-hide border-b border-surface-200 mb-6">
          {TABS.map(({ id, label, icon: Icon, count }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold',
                'border-b-2 transition-all whitespace-nowrap',
                activeTab === id
                  ? 'border-primary-600 text-primary-700'
                  : 'border-transparent text-surface-500 hover:text-surface-700'
              )}
            >
              <Icon size={13} />
              {label}
              {count > 0 && (
                <span className={clsx(
                  'px-1.5 py-0.5 rounded-full text-xs',
                  activeTab === id
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-surface-100 text-surface-500'
                )}>
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tools Grid/List */}
        <AnimatePresence mode="wait">
          {displayTools.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="text-5xl mb-4">
                {activeTab === 'favorites' ? '❤️' : '🔍'}
              </div>
              <h3 className="text-base font-bold text-surface-700 mb-2">
                {activeTab === 'favorites'
                  ? 'No favorites yet'
                  : activeTab === 'recent'
                  ? 'No recent tools'
                  : 'No tools found'}
              </h3>
              <p className="text-sm text-surface-500">
                {activeTab === 'favorites'
                  ? 'Click the ❤️ on any tool to save it here'
                  : activeTab === 'recent'
                  ? 'Start using tools to see them here'
                  : 'Try a different search or category'}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={`${activeTab}-${selectedCategory}-${view}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              ref={containerRef}
              className={clsx(
                view === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                  : 'flex flex-col gap-3'
              )}
            >
              {displayTools.map((tool, i) => (
                <motion.div
                  key={tool.slug}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="tool-card-reveal"
                >
                  <ToolCard tool={tool} view={view} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results count */}
        {displayTools.length > 0 && (
          <p className="text-center text-xs text-surface-400 mt-8">
            Showing {displayTools.length} tool{displayTools.length !== 1 ? 's' : ''}
          </p>
        )}
      </main>
    </div>
  )
}
