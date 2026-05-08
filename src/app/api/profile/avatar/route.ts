// ============================================
// TOOLVAULT PRO — AVATAR UPLOAD ROUTE
// ============================================
import { createClient } from '@/lib/supabase/server'
import { uploadAvatar } from '@/lib/cloudinary'
import { sanitizeFilename } from '@/lib/sanitize'
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  serverErrorResponse,
} from '@/lib/headers'

export async function POST(request: Request) {
  try {
    // 1. Auth
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return unauthorizedResponse()

    // 2. Parse form data
    const formData = await request.formData()
    const file = formData.get('avatar') as File | null

    if (!file) {
      return errorResponse('No file provided', 400)
    }

    // 3. Validate file
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return errorResponse('Invalid file type. Use JPG, PNG or WebP', 400)
    }

    const maxSize = 2 * 1024 * 1024 // 2MB
    if (file.size > maxSize) {
      return errorResponse('File too large. Max 2MB allowed', 400)
    }

    // 4. Convert to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`

    // 5. Upload to Cloudinary
    const result = await uploadAvatar(base64, user.id)

    if (!result.success) {
      return errorResponse(result.error ?? 'Upload failed', 500)
    }

    // 6. Update profile
    await supabase
      .from('profiles')
      .update({
        avatar_url: result.url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    return successResponse(
      { url: result.url },
      'Avatar uploaded successfully'
    )
  } catch (error) {
    return serverErrorResponse(error)
  }
}
