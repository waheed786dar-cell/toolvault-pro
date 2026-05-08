// ============================================
// TOOLVAULT PRO — SUPABASE DATABASE TYPES
// ============================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
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
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          email?: string | null
          language?: 'en' | 'ur'
          heard_from?: string | null
          bio?: string | null
          is_verified?: boolean
          is_banned?: boolean
          tools_used_count?: number
          onboarding_done?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          email?: string | null
          language?: 'en' | 'ur'
          heard_from?: string | null
          bio?: string | null
          is_verified?: boolean
          is_banned?: boolean
          tools_used_count?: number
          onboarding_done?: boolean
          updated_at?: string
        }
      }
      tool_usage: {
        Row: {
          id: string
          user_id: string
          tool_slug: string
          tool_category: string
          used_at: string
          duration_ms: number | null
          was_successful: boolean
          ip_hash: string | null
        }
        Insert: {
          id?: string
          user_id: string
          tool_slug: string
          tool_category: string
          used_at?: string
          duration_ms?: number | null
          was_successful?: boolean
          ip_hash?: string | null
        }
        Update: {
          was_successful?: boolean
          duration_ms?: number | null
        }
      }
      ai_generations: {
        Row: {
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
        Insert: {
          id?: string
          user_id: string
          tool_name: string
          prompt: string
          result?: string | null
          model_used?: string
          tokens_used?: number
          duration_ms?: number | null
          was_successful?: boolean
          created_at?: string
        }
        Update: {
          result?: string | null
          tokens_used?: number
          was_successful?: boolean
          duration_ms?: number | null
        }
      }
      saved_results: {
        Row: {
          id: string
          user_id: string
          tool_slug: string
          title: string
          content: string
          metadata: Json
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tool_slug: string
          title: string
          content: string
          metadata?: Json
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          content?: string
          metadata?: Json
          is_public?: boolean
          updated_at?: string
        }
      }
      feedback: {
        Row: {
          id: string
          user_id: string
          tool_slug: string
          rating: number
          message: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tool_slug: string
          rating: number
          message?: string | null
          created_at?: string
        }
        Update: {
          rating?: number
          message?: string | null
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: 'info' | 'success' | 'warning' | 'error'
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type?: 'info' | 'success' | 'warning' | 'error'
          is_read?: boolean
          created_at?: string
        }
        Update: {
          is_read?: boolean
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          resource: string | null
          metadata: Json
          ip_hash: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          resource?: string | null
          metadata?: Json
          ip_hash?: string | null
          created_at?: string
        }
        Update: Record<string, never>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
