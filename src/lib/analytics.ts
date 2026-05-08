// ============================================
// TOOLVAULT PRO — GOOGLE ANALYTICS
// ============================================

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? ''

// ============================================
// PAGE VIEW
// ============================================
export function pageview(url: string) {
  if (!GA_ID || typeof window === 'undefined') return
  window.gtag('config', GA_ID, { page_path: url })
}

// ============================================
// EVENT TRACKING
// ============================================
export function event({
  action,
  category,
  label,
  value,
}: {
  action: string
  category: string
  label?: string
  value?: number
}) {
  if (!GA_ID || typeof window === 'undefined') return
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
  })
}

// ============================================
// TOOL EVENTS
// ============================================
export const trackToolUse = (toolSlug: string) =>
  event({ action: 'tool_use', category: 'Tools', label: toolSlug })

export const trackToolSave = (toolSlug: string) =>
  event({ action: 'tool_save', category: 'Tools', label: toolSlug })

export const trackAIGenerate = (toolSlug: string) =>
  event({ action: 'ai_generate', category: 'AI', label: toolSlug })

export const trackSignUp = (method: string) =>
  event({ action: 'sign_up', category: 'Auth', label: method })

export const trackLogin = (method: string) =>
  event({ action: 'login', category: 'Auth', label: method })

export const trackSearch = (query: string) =>
  event({ action: 'search', category: 'Search', label: query })

export const trackFavorite = (toolSlug: string) =>
  event({ action: 'favorite', category: 'Tools', label: toolSlug })

export const trackExport = (format: string) =>
  event({ action: 'export', category: 'Data', label: format })

export const trackShare = (method: string) =>
  event({ action: 'share', category: 'Social', label: method })

// ============================================
// GTAG TYPE
// ============================================
declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string,
      config?: Record<string, unknown>
    ) => void
  }
}
