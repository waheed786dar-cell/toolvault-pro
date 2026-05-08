// ============================================
// TOOLVAULT PRO — GLOBAL TYPES
// ============================================

// USER & AUTH
export interface Profile {
  id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  email: string | null
  language: 'en' | 'ur'
  heard_from: string | null
  bio: string | null
  is_verified: boolean
  is_banned: boolean
  tools_used_count: number
  onboarding_done: boolean
  created_at: string
  updated_at: string
}

export interface AuthUser {
  id: string
  email: string
  profile: Profile | null
}

// TOOLS
export type ToolCategory =
  | 'ai-writing'
  | 'image-tools'
  | 'seo-tools'
  | 'pdf-tools'
  | 'code-tools'
  | 'business-tools'

export interface Tool {
  slug: string
  name: string
  nameUr: string
  description: string
  descriptionUr: string
  category: ToolCategory
  icon: string
  color: string
  isNew: boolean
  isPopular: boolean
  usageCount: number
}

export interface ToolUsage {
  id: string
  user_id: string
  tool_slug: string
  tool_category: string
  used_at: string
  duration_ms: number | null
  was_successful: boolean
}

// AI
export interface AIGeneration {
  id: string
  user_id: string
  tool_name: string
  prompt: string
  result: string | null
  model_used: string
  tokens_used: number
  duration_ms: number | null
  was_successful: boolean
  created_at: string
}

export interface AIRequest {
  prompt: string
  toolName: string
  language?: 'en' | 'ur'
  maxTokens?: number
}

export interface AIResponse {
  success: boolean
  result?: string
  error?: string
  tokensUsed?: number
}

// SAVED RESULTS
export interface SavedResult {
  id: string
  user_id: string
  tool_slug: string
  title: string
  content: string
  metadata: Record<string, unknown>
  is_public: boolean
  created_at: string
  updated_at: string
}

// FEEDBACK
export interface Feedback {
  id: string
  user_id: string
  tool_slug: string
  rating: number
  message: string | null
  created_at: string
}

// NOTIFICATIONS
export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  is_read: boolean
  created_at: string
}

// AUDIT
export interface AuditLog {
  id: string
  user_id: string | null
  action: string
  resource: string | null
  metadata: Record<string, unknown>
  ip_hash: string | null
  created_at: string
}

// API RESPONSES
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// ONBOARDING
export interface OnboardingData {
  username: string
  heard_from: string
  language: 'en' | 'ur'
  bio?: string
}

// RATE LIMIT
export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

// PAGINATION
export interface PaginationParams {
  page: number
  limit: number
  total?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: PaginationParams
}
