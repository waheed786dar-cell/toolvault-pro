// ============================================
// TOOLVAULT PRO — TOOLS HOOK
// ============================================
'use client'
import { useCallback } from 'react'
import { useToolStore } from '@/store/toolStore'
import { useAuthStore } from '@/store/authStore'
import { getToolBySlug, getPopularTools, getNewTools } from '@/constants/tools'
import type { Tool, AIRequest } from '@/types'

export function useTools() {
  const {
    filteredTools,
    selectedCategory,
    searchQuery,
    recentTools,
    savedResults,
    isGenerating,
    currentTool,
    generationResult,
    generationError,
    setCategory,
    setSearchQuery,
    setCurrentTool,
    addRecentTool,
    setSavedResults,
    addSavedResult,
    removeSavedResult,
    setGenerating,
    setGenerationResult,
    setGenerationError,
    resetGeneration,
  } = useToolStore()

  const { user, incrementToolsUsed } = useAuthStore()

  // ============================================
  // SELECT TOOL
  // ============================================
  const selectTool = useCallback((slug: string) => {
    const tool = getToolBySlug(slug)
    if (!tool) return
    setCurrentTool(tool)
    addRecentTool(slug)
  }, [])

  // ============================================
  // GENERATE AI CONTENT
  // ============================================
  const generateContent = useCallback(async (
    request: AIRequest
  ) => {
    if (!user) return { success: false, error: 'Please login first' }

    setGenerating(true)
    resetGeneration()

    try {
      const startTime = Date.now()

      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      })

      const data = await response.json()

      if (!response.ok) {
        setGenerationError(data.error ?? 'Generation failed')
        return { success: false, error: data.error }
      }

      setGenerationResult(data.data.result)
      incrementToolsUsed()

      // Log usage
      await logToolUsage(
        request.toolName,
        'ai-writing',
        Date.now() - startTime,
        true
      )

      return { success: true, result: data.data.result }
    } catch (error) {
      const msg = error instanceof Error
        ? error.message
        : 'Generation failed'
      setGenerationError(msg)
      return { success: false, error: msg }
    }
  }, [user])

  // ============================================
  // LOG TOOL USAGE
  // ============================================
  const logToolUsage = useCallback(async (
    toolSlug: string,
    category: string,
    durationMs: number,
    wasSuccessful: boolean
  ) => {
    try {
      await fetch('/api/tools/usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool_slug: toolSlug,
          tool_category: category,
          duration_ms: durationMs,
          was_successful: wasSuccessful,
        }),
      })
    } catch {
      // Silent fail — non-critical
    }
  }, [])

  // ============================================
  // SAVE RESULT
  // ============================================
  const saveResult = useCallback(async (
    toolSlug: string,
    title: string,
    content: string,
    isPublic: boolean = false
  ) => {
    if (!user) return { success: false, error: 'Please login' }

    try {
      const response = await fetch('/api/tools/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool_slug: toolSlug,
          title,
          content,
          is_public: isPublic,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.error }
      }

      addSavedResult(data.data)
      return { success: true }
    } catch {
      return { success: false, error: 'Save failed' }
    }
  }, [user])

  // ============================================
  // DELETE SAVED RESULT
  // ============================================
  const deleteSavedResult = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/tools/save/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) return { success: false }

      removeSavedResult(id)
      return { success: true }
    } catch {
      return { success: false }
    }
  }, [])

  // ============================================
  // FETCH SAVED RESULTS
  // ============================================
  const fetchSavedResults = useCallback(async () => {
    if (!user) return

    try {
      const response = await fetch('/api/tools/save')
      const data = await response.json()

      if (response.ok) {
        setSavedResults(data.data ?? [])
      }
    } catch {
      // Silent fail
    }
  }, [user])

  // ============================================
  // SUBMIT FEEDBACK
  // ============================================
  const submitFeedback = useCallback(async (
    toolSlug: string,
    rating: number,
    message?: string
  ) => {
    try {
      const response = await fetch('/api/tools/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool_slug: toolSlug, rating, message }),
      })

      return response.ok
        ? { success: true }
        : { success: false }
    } catch {
      return { success: false }
    }
  }, [])

  // ============================================
  // GET RECENT TOOLS (with metadata)
  // ============================================
  const getRecentToolsWithMeta = useCallback((): Tool[] => {
    return recentTools
      .map((slug) => getToolBySlug(slug))
      .filter((t): t is Tool => !!t)
  }, [recentTools])

  return {
    // State
    filteredTools,
    selectedCategory,
    searchQuery,
    recentTools,
    savedResults,
    isGenerating,
    currentTool,
    generationResult,
    generationError,

    // Computed
    popularTools: getPopularTools(),
    newTools: getNewTools(),
    recentToolsWithMeta: getRecentToolsWithMeta(),

    // Actions
    setCategory,
    setSearchQuery,
    selectTool,
    generateContent,
    saveResult,
    deleteSavedResult,
    fetchSavedResults,
    submitFeedback,
    resetGeneration,
    logToolUsage,
  }
}
