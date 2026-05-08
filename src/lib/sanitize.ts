// ============================================
// TOOLVAULT PRO — INPUT SANITIZATION
// ============================================
import { z } from 'zod'

// ============================================
// ZOD SCHEMAS — All input validation
// ============================================

// AUTH SCHEMAS
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email required')
    .email('Invalid email format')
    .max(255, 'Email too long')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long'),
  captchaToken: z
    .string()
    .min(1, 'CAPTCHA required'),
})

export const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'Email required')
    .email('Invalid email format')
    .max(255, 'Email too long')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(8, 'Min 8 characters')
    .max(128, 'Password too long')
    .regex(/[A-Z]/, 'Must contain uppercase letter')
    .regex(/[0-9]/, 'Must contain number')
    .regex(/[^A-Za-z0-9]/, 'Must contain special character'),
  confirmPassword: z.string().min(1, 'Please confirm password'),
  captchaToken: z.string().min(1, 'CAPTCHA required'),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }
)

// ONBOARDING SCHEMA
export const onboardingSchema = z.object({
  username: z
    .string()
    .min(3, 'Min 3 characters')
    .max(30, 'Max 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, underscores')
    .toLowerCase()
    .trim(),
  heard_from: z
    .enum([
      'google',
      'youtube',
      'facebook',
      'instagram',
      'friend',
      'twitter',
      'other',
    ]),
  language: z.enum(['en', 'ur']),
  bio: z
    .string()
    .max(160, 'Bio max 160 characters')
    .optional()
    .transform((val) => val?.trim()),
})

// PROFILE UPDATE SCHEMA
export const profileUpdateSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/)
    .optional(),
  full_name: z
    .string()
    .min(1)
    .max(100)
    .trim()
    .optional(),
  bio: z
    .string()
    .max(160)
    .trim()
    .optional(),
  language: z
    .enum(['en', 'ur'])
    .optional(),
})

// AI REQUEST SCHEMA
export const aiRequestSchema = z.object({
  prompt: z
    .string()
    .min(3, 'Prompt too short')
    .max(4000, 'Prompt too long')
    .trim(),
  toolName: z
    .string()
    .min(1)
    .max(50),
  language: z
    .enum(['en', 'ur'])
    .default('en'),
  maxTokens: z
    .number()
    .min(100)
    .max(4000)
    .default(1000),
})

// PDF REQUEST SCHEMA
export const pdfRequestSchema = z.object({
  action: z.enum([
    'merge',
    'split',
    'compress',
    'to-text',
    'image-to-pdf',
  ]),
  options: z.record(z.unknown()).optional(),
})

// FEEDBACK SCHEMA
export const feedbackSchema = z.object({
  tool_slug: z
    .string()
    .min(1)
    .max(50),
  rating: z
    .number()
    .min(1)
    .max(5),
  message: z
    .string()
    .max(500)
    .trim()
    .optional(),
})

// SAVE RESULT SCHEMA
export const saveResultSchema = z.object({
  tool_slug: z.string().min(1).max(50),
  title: z
    .string()
    .min(1, 'Title required')
    .max(100)
    .trim(),
  content: z
    .string()
    .min(1)
    .max(50000),
  is_public: z.boolean().default(false),
  metadata: z.record(z.unknown()).default({}),
})

// ============================================
// SANITIZE HTML — Remove XSS
// ============================================
export function sanitizeHTML(dirty: string): string {
  // Server-side safe sanitization
  return dirty
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/`/g, '&#96;')
    .replace(/=/g, '&#x3D;')
}

// ============================================
// SANITIZE OBJECT — Deep clean
// ============================================
export function sanitizeObject<T extends Record<string, unknown>>(
  obj: T
): T {
  const sanitized: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeHTML(value)
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value as Record<string, unknown>)
    } else {
      sanitized[key] = value
    }
  }

  return sanitized as T
}

// ============================================
// VALIDATE + SANITIZE HELPER
// ============================================
export function validateInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } {
  const result = schema.safeParse(data)

  if (!result.success) {
    const errors = result.error.issues.map(
      (issue) => `${issue.path.join('.')}: ${issue.message}`
    )
    return { success: false, errors }
  }

  return { success: true, data: result.data }
}

// ============================================
// VERIFY HCAPTCHA TOKEN
// ============================================
export async function verifyCaptcha(token: string): Promise<boolean> {
  try {
    const secret = process.env.HCAPTCHA_SECRET_KEY
    if (!secret) return false

    const response = await fetch('https://hcaptcha.com/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${secret}&response=${token}`,
    })

    const data = await response.json()
    return data.success === true
  } catch {
    return false
  }
}

// ============================================
// SANITIZE FILENAME — For uploads
// ============================================
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase()
    .substring(0, 255)
}

// ============================================
// TYPE EXPORTS
// ============================================
export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type OnboardingInput = z.infer<typeof onboardingSchema>
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>
export type AIRequestInput = z.infer<typeof aiRequestSchema>
export type FeedbackInput = z.infer<typeof feedbackSchema>
export type SaveResultInput = z.infer<typeof saveResultSchema>
