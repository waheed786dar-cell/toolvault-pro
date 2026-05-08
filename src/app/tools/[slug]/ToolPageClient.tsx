// ============================================
// TOOLVAULT PRO — TOOL PAGE CLIENT
// ============================================
'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Copy, Check, Save,
  Star, Loader2, Zap, AlertCircle,
  Download, RefreshCw
} from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { FavoriteButton } from '@/components/features/FavoriteButton'
import { ToolJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import { useTools } from '@/hooks/useTools'
import { useCredits } from '@/hooks/useCredits'
import { useAuth } from '@/hooks/useAuth'
import { useUIStore } from '@/store/uiStore'
import { trackAIGenerate, trackToolUse } from '@/lib/analytics'
import { toast } from 'sonner'
import Link from 'next/link'
import { clsx } from 'clsx'
import type { Tool } from '@/types'

// ============================================
// AI TOOL UI
// ============================================
function AIToolUI({ tool }: { tool: Tool }) {
  const { generateContent, isGenerating, generationResult, generationError, resetGeneration } = useTools()
  const { useCredit, total, isLow } = useCredits()
  const { isAuthenticated } = useAuth()
  const { language } = useUIStore()
  const [prompt, setPrompt] = useState('')
  const [copied, setCopied] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const placeholders: Record<string, string> = {
    'ai-writer': 'Write an article about artificial intelligence in Pakistan...',
    'email-writer': 'Write a professional email requesting a meeting with a client...',
    'bio-generator': 'Software developer with 5 years experience in React and Node.js...',
    'caption-maker': 'Beautiful sunset at Lahore\'s Badshahi Mosque...',
    'paraphraser': 'Paste your text here to rewrite it in a clearer way...',
  }

  const handleGenerate = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to use AI tools')
      return
    }

    if (!prompt.trim()) {
      toast.error('Please enter a prompt')
      return
    }

    const creditOk = await useCredit(1)
    if (!creditOk) return

    const result = await generateContent({
      prompt,
      toolName: tool.slug,
      language,
      maxTokens: 1500,
    })

    if (result.success) {
      trackAIGenerate(tool.slug)
      trackToolUse(tool.slug)
    }
  }

  const handleCopy = async () => {
    if (!generationResult) return
    await navigator.clipboard.writeText(generationResult)
    setCopied(true)
    toast.success('Copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSave = async () => {
    if (!generationResult) return
    setIsSaving(true)
    try {
      const res = await fetch('/api/tools/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool_slug: tool.slug,
          title: prompt.substring(0, 60),
          content: generationResult,
        }),
      })
      if (res.ok) {
        toast.success('Result saved!')
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleDownload = () => {
    if (!generationResult) return
    const blob = new Blob([generationResult], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${tool.slug}-result.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      {/* Credits warning */}
      {isLow && (
        <div className="flex items-center gap-2 p-3 bg-warning-50 border border-warning-200 rounded-xl text-xs text-warning-700">
          <AlertCircle size={14} />
          Only {total} credits remaining today
        </div>
      )}

      {/* Prompt Input */}
      <div>
        <label className="label">Your Prompt</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={placeholders[tool.slug] ?? 'Describe what you want to generate...'}
          rows={5}
          className="input resize-none"
          maxLength={4000}
        />
        <div className="flex justify-between mt-1.5">
          <span className="text-xs text-surface-400">
            {prompt.length}/4000 characters
          </span>
          <span className="text-xs text-surface-400 flex items-center gap-1">
            <Zap size={11} className="text-primary-500" />
            1 credit per generation
          </span>
        </div>
      </div>

      {/* Generate Button */}
      <motion.button
        onClick={handleGenerate}
        disabled={isGenerating || !prompt.trim()}
        whileTap={{ scale: 0.98 }}
        className={clsx(
          'w-full btn-primary py-3.5 flex items-center justify-center gap-2',
          (isGenerating || !prompt.trim()) && 'opacity-60 cursor-not-allowed'
        )}
      >
        {isGenerating ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Generating with AI...
          </>
        ) : (
          <>
            <Zap size={16} className="fill-current" />
            Generate
          </>
        )}
      </motion.button>

      {/* Result */}
      <AnimatePresence>
        {generationResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="card p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-surface-700">
                ✨ Generated Result
              </p>
              <div className="flex gap-1.5">
                <button onClick={resetGeneration} className="p-1.5 hover:bg-surface-100 rounded-lg transition-colors" title="Clear">
                  <RefreshCw size={13} className="text-surface-400" />
                </button>
                <button onClick={handleDownload} className="p-1.5 hover:bg-surface-100 rounded-lg transition-colors" title="Download">
                  <Download size={13} className="text-surface-400" />
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="p-1.5 hover:bg-primary-50 rounded-lg transition-colors text-surface-400 hover:text-primary-600"
                  title="Save"
                >
                  <Save size={13} />
                </button>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-xs font-semibold hover:bg-primary-100 transition-colors"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
            <div className="bg-surface-50 rounded-xl p-4 max-h-80 overflow-y-auto">
              <p className="text-sm text-surface-800 whitespace-pre-wrap leading-relaxed">
                {generationResult}
              </p>
            </div>
          </motion.div>
        )}

        {generationError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-start gap-3 p-4 bg-danger-50 border border-danger-200 rounded-xl"
          >
            <AlertCircle size={16} className="text-danger-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-danger-700 mb-1">Generation failed</p>
              <p className="text-xs text-danger-600">{generationError}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================
// STATIC TOOL UI (PDF, Image, Code etc.)
// ============================================
function StaticToolUI({ tool }: { tool: Tool }) {
  return (
    <div className="card p-8 text-center">
      <div
        className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-4"
        style={{ backgroundColor: `${tool.color}15` }}
      >
        {tool.icon}
      </div>
      <h3 className="text-lg font-bold text-surface-900 mb-2">
        {tool.name}
      </h3>
      <p className="text-sm text-surface-500 mb-6 max-w-xs mx-auto">
        {tool.description}
      </p>
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-xl text-xs font-semibold">
        <Zap size={13} />
        Tool interface coming soon — check back!
      </div>
    </div>
  )
}

// ============================================
// MAIN TOOL PAGE CLIENT
// ============================================
const AI_TOOLS = [
  'ai-writer', 'email-writer', 'bio-generator',
  'caption-maker', 'paraphraser', 'meta-generator',
]

export function ToolPageClient({ tool }: { tool: Tool }) {
  const { submitFeedback } = useTools()
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [ratingSubmitted, setRatingSubmitted] = useState(false)
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''

  const handleRate = async (r: number) => {
    setRating(r)
    await submitFeedback(tool.slug, r)
    setRatingSubmitted(true)
    toast.success('Thanks for your feedback!')
  }

  const isAI = AI_TOOLS.includes(tool.slug)

  return (
    <div className="min-h-screen bg-surface-50">
      <Navbar />

      {/* JSON-LD */}
      <ToolJsonLd
        name={tool.name}
        description={tool.description}
        slug={tool.slug}
      />
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: baseUrl },
        { name: 'Tools', url: `${baseUrl}/dashboard` },
        { name: tool.name, url: `${baseUrl}/tools/${tool.slug}` },
      ]} />

      <main className="container-main py-6 max-w-2xl">
        {/* Back + Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-xs text-surface-500 hover:text-surface-700 mb-3 transition-colors"
            >
              <ArrowLeft size={13} />
              Back to Dashboard
            </Link>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                style={{ backgroundColor: `${tool.color}15` }}
              >
                {tool.icon}
              </div>
              <div>
                <h1 className="text-xl font-display font-bold text-surface-900">
                  {tool.name}
                </h1>
                <p className="text-xs text-surface-500 capitalize">
                  {tool.category.replace('-', ' ')}
                </p>
              </div>
            </div>
          </div>
          <FavoriteButton slug={tool.slug} size="lg" showLabel />
        </div>

        {/* Description */}
        <p className="text-sm text-surface-600 mb-6 leading-relaxed">
          {tool.description}
        </p>

        {/* Tool UI */}
        <div className="mb-8">
          {isAI ? (
            <AIToolUI tool={tool} />
          ) : (
            <StaticToolUI tool={tool} />
          )}
        </div>

        {/* Rating */}
        <div className="card p-5">
          <p className="text-sm font-bold text-surface-900 mb-3">
            Rate this tool
          </p>
          {ratingSubmitted ? (
            <div className="flex items-center gap-2 text-success-600 text-sm">
              <Check size={16} />
              Thanks for your feedback!
            </div>
          ) : (
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRate(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={24}
                    className={clsx(
                      'transition-colors',
                      star <= (hoverRating || rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-surface-300'
                    )}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
