// ============================================
// TOOLVAULT PRO — VALIDATED ENV VARIABLES
// ============================================
import { z } from 'zod'

const envSchema = z.object({
  // SUPABASE
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  SUPABASE_JWT_SECRET: z.string().min(1),

  // GROQ
  GROQ_API_KEY: z.string().min(1),

  // UPSTASH
  UPSTASH_REDIS_REST_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),

  // HCAPTCHA
  NEXT_PUBLIC_HCAPTCHA_SITE_KEY: z.string().min(1),
  HCAPTCHA_SECRET_KEY: z.string().min(1),

  // CLOUDINARY
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),

  // ENCRYPTION
  ENCRYPTION_KEY: z.string().min(32),

  // APP
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_APP_NAME: z.string().min(1),
  NODE_ENV: z.enum(['development', 'production', 'test']),
})

type Env = z.infer<typeof envSchema>

function validateEnv(): Env {
  const parsed = envSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    SUPABASE_JWT_SECRET: process.env.SUPABASE_JWT_SECRET,
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    NEXT_PUBLIC_HCAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY,
    HCAPTCHA_SECRET_KEY: process.env.HCAPTCHA_SECRET_KEY,
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NODE_ENV: process.env.NODE_ENV,
  })

  if (!parsed.success) {
    console.error('❌ Invalid environment variables:')
    parsed.error.issues.forEach((issue) => {
      console.error(`  → ${issue.path.join('.')}: ${issue.message}`)
    })
    throw new Error('Invalid environment variables — check .env.local')
  }

  return parsed.data
}

export const env = validateEnv()

// Public env (safe for client)
export const publicEnv = {
  supabaseUrl: env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  hcaptchaSiteKey: env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY,
  cloudinaryCloudName: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  appUrl: env.NEXT_PUBLIC_APP_URL,
  appName: env.NEXT_PUBLIC_APP_NAME,
  isDev: env.NODE_ENV === 'development',
  isProd: env.NODE_ENV === 'production',
} as const

// Server env (never expose to client)
export const serverEnv = {
  supabaseServiceKey: env.SUPABASE_SERVICE_ROLE_KEY,
  supabaseJwtSecret: env.SUPABASE_JWT_SECRET,
  groqApiKey: env.GROQ_API_KEY,
  upstashUrl: env.UPSTASH_REDIS_REST_URL,
  upstashToken: env.UPSTASH_REDIS_REST_TOKEN,
  hcaptchaSecret: env.HCAPTCHA_SECRET_KEY,
  cloudinaryApiKey: env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: env.CLOUDINARY_API_SECRET,
  encryptionKey: env.ENCRYPTION_KEY,
} as const
