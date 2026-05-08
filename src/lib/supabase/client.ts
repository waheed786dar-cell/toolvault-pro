// ============================================
// TOOLVAULT PRO — SUPABASE BROWSER CLIENT
// ============================================
import { createBrowserClient } from '@supabase/ssr'
import { publicEnv } from '../env'
import type { Database } from './types'

// Singleton pattern — ek hi instance
let client: ReturnType<typeof createBrowserClient<Database>> | null = null

export function createClient() {
  if (client) return client

  client = createBrowserClient<Database>(
    publicEnv.supabaseUrl,
    publicEnv.supabaseAnonKey,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
      },
      global: {
        headers: {
          'x-app-name': publicEnv.appName,
        },
      },
    }
  )

  return client
}

export default createClient
