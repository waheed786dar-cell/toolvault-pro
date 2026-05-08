// ============================================
// TOOLVAULT PRO — TOOL COMPARISON
// ============================================
'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GitCompare, X, Check, Minus, ChevronDown, Sparkles } from 'lucide-react'
import { ALL_TOOLS } from '@/constants/tools'
import { clsx } from 'clsx'
import type { Tool } from '@/types'

const FEATURES = [
  { key: 'ai_powered', label: 'AI Powered' },
  { key: 'free', label: '100% Free' },
  { key: 'no_signup', label: 'No Signup Needed' },
  { key: 'download', label: 'Download Output' },
  { key: 'bilingual', label: 'Urdu Support' },
  { key: 'fast', label: 'Instant Results' },
  { key: 'save', label: 'Save Results' },
  { key: 'mobile', label: 'Mobile Friendly' },
]

// Tool feature matrix
const TOOL_FEATURES: Record<string, Record<string, boolean>> = {
  'ai-writer':        { ai_powered: true,  free: true, no_signup: false, download: true,  bilingual: true,  fast: true,  save: true,  mobile: true },
  'email-writer':     { ai_powered: true,  free: true, no_signup: false, download: true,  bilingual: true,  fast: true,  save: true,  mobile: true },
  'bg-remover':       { ai_powered: true,  free: true, no_signup: false, download: true,  bilingual: false, fast: false, save: false, mobile: true },
  'image-compressor': { ai_powered: false, free: true, no_signup: true,  download: true,  bilingual: false, fast: true,  save: false, mobile: true },
  'pdf-merger':       { ai_powered: false, free: true, no_signup: false, download: true,  bilingual: false, fast: true,  save: false, mobile: true },
  'meta-generator':   { ai_powered: true,  free: true, no_signup: false, download: false, bilingual: true,  fast: true,  save: true,  mobile: true },
  'word-counter':     { ai_powered: false, free: true, no_signup: true,  download: false, bilingual: false, fast: true,  save: false, mobile: true },
  'code-formatter':   { ai_powered: false, free: true, no_signup: false, download: true,  bilingual: false, fast: true,  save: true,  mobile: true },
  'qr-generator':     { ai_powered: false, free: true, no_signup: true,  download: true,  bilingual: false, fast: true,  save: false, mobile: true },
  'invoice-generator':{ ai_powered: false, free: true, no_signup: false, download: true,  bilingual: true,  fast: true,  save: true,  mobile: true },
}

function ToolSelector({
  selected,
  onSelect,
  exclude,
  label,
}: {
  selected: Tool | null
  onSelect: (tool: Tool) => void
  exclude?: string
  label: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = ALL_TOOLS.filter(
    (t) =>
      t.slug !== exclude &&
      (t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.category.includes(search.toLowerCase()))
  )

  return (
    <div className="relative flex-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          'w-full flex items-center gap-3 p-3 rounded-xl border-2',
          'transition-all duration-200 text-left',
          selected
            ? 'border-primary-200 bg-primary-50'
            : 'border-dashed border-surface-300 bg-surface-50 hover:border-primary-300'
        )}
      >
        {selected ? (
          <>
            <span className="text-xl">{selected.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-surface-900 truncate">
                {selected.name}
              </p>
              <p className="text-xs text-surface-500 truncate">
                {selected.category}
              </p>
            </div>
          </>
        ) : (
          <p className="text-sm text-surface-400 flex-1">{label}</p>
        )}
        <ChevronDown
          size={15}
          className={clsx(
            'text-surface-400 transition-transform flex-shrink-0',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-30"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute top-full mt-1 left-0 right-0 z-40 card shadow-xl overflow-hidden"
            >
              <div className="p-2 border-b border-surface-100">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search tools..."
                  className="input text-xs py-2"
                  autoFocus
                />
              </div>
              <div className="max-h-48 overflow-y-auto py-1">
                {filtered.map((tool) => (
                  <button
                    key={tool.slug}
                    onClick={() => {
                      onSelect(tool)
                      setIsOpen(false)
                      setSearch('')
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-surface-50 text-left"
                  >
                    <span>{tool.icon}</span>
                    <span className="text-xs font-medium text-surface-800">
                      {tool.name}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export function ToolComparison() {
  const [toolA, setToolA] = useState<Tool | null>(null)
  const [toolB, setToolB] = useState<Tool | null>(null)

  const featuresA = toolA ? TOOL_FEATURES[toolA.slug] ?? {} : {}
  const featuresB = toolB ? TOOL_FEATURES[toolB.slug] ?? {} : {}

  const scoreA = Object.values(featuresA).filter(Boolean).length
  const scoreB = Object.values(featuresB).filter(Boolean).length

  const getRecommendation = () => {
    if (!toolA || !toolB) return null
    if (scoreA > scoreB) return toolA.name
    if (scoreB > scoreA) return toolB.name
    return 'Both tools are equally featured!'
  }

  const recommendation = getRecommendation()

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-surface-100">
        <div className="flex items-center gap-2 mb-4">
          <GitCompare size={18} className="text-primary-600" />
          <h3 className="font-bold text-surface-900">Compare Tools</h3>
        </div>

        {/* Selectors */}
        <div className="flex items-center gap-2">
          <ToolSelector
            selected={toolA}
            onSelect={setToolA}
            exclude={toolB?.slug}
            label="Select first tool..."
          />
          <div className="w-8 h-8 rounded-full bg-surface-100 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-surface-500">VS</span>
          </div>
          <ToolSelector
            selected={toolB}
            onSelect={setToolB}
            exclude={toolA?.slug}
            label="Select second tool..."
          />
        </div>
      </div>

      {/* Comparison Table */}
      <AnimatePresence>
        {toolA && toolB && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {/* Score */}
            <div className="grid grid-cols-3 gap-0 border-b border-surface-100">
              <div className="p-3 text-center bg-primary-50">
                <p className="text-2xl font-bold text-primary-700">{scoreA}</p>
                <p className="text-xs text-primary-600">/{FEATURES.length}</p>
              </div>
              <div className="p-3 text-center flex items-center justify-center">
                <span className="text-xs font-bold text-surface-400">SCORE</span>
              </div>
              <div className="p-3 text-center bg-surface-50">
                <p className="text-2xl font-bold text-surface-700">{scoreB}</p>
                <p className="text-xs text-surface-500">/{FEATURES.length}</p>
              </div>
            </div>

            {/* Feature rows */}
            {FEATURES.map((feature, i) => {
              const hasA = featuresA[feature.key] ?? false
              const hasB = featuresB[feature.key] ?? false
              return (
                <motion.div
                  key={feature.key}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="grid grid-cols-3 border-b border-surface-50"
                >
                  <div className={clsx(
                    'p-3 flex items-center justify-center',
                    hasA ? 'bg-success-50' : 'bg-surface-50'
                  )}>
                    {hasA
                      ? <Check size={16} className="text-success-600" />
                      : <Minus size={16} className="text-surface-300" />
                    }
                  </div>
                  <div className="p-3 flex items-center justify-center">
                    <span className="text-xs text-surface-600 text-center font-medium">
                      {feature.label}
                    </span>
                  </div>
                  <div className={clsx(
                    'p-3 flex items-center justify-center',
                    hasB ? 'bg-success-50' : 'bg-surface-50'
                  )}>
                    {hasB
                      ? <Check size={16} className="text-success-600" />
                      : <Minus size={16} className="text-surface-300" />
                    }
                  </div>
                </motion.div>
              )
            })}

            {/* Recommendation */}
            {recommendation && (
              <div className="p-4 bg-primary-50 border-t border-primary-100">
                <p className="text-xs text-primary-700 flex items-center gap-1.5">
                  <Sparkles size={13} />
                  <span>
                    <strong>Recommendation:</strong>{' '}
                    {recommendation === toolA.name || recommendation === toolB.name
                      ? `${recommendation} has more features for your needs!`
                      : recommendation}
                  </span>
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {(!toolA || !toolB) && (
        <div className="py-10 text-center text-surface-400">
          <GitCompare size={32} className="mx-auto mb-2 opacity-30" />
          <p className="text-sm">Select two tools to compare</p>
        </div>
      )}
    </div>
  )
}
