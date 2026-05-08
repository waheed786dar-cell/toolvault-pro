// ============================================
// TOOLVAULT PRO — SUPABASE ADMIN CLIENT
// ============================================
// ⚠️ ONLY use in server-side code / API routes
// NEVER import in client components
// ============================================
import { createClient } from '@supabase/supabase-js'
import { publicEnv, serverEnv } from '../env'
import type { Database } from './types'

// Admin client — bypasses RLS
let adminClient: ReturnType<typeof createClient<Database>> | null = null

export function createAdminClient() {
  if (adminClient) return adminClient

  adminClient = createClient<Database>(
    publicEnv.supabaseUrl,
    serverEnv.supabaseServiceKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )

  return adminClient
}

export default createAdminClient
