// ============================================
// TOOLVAULT PRO — PROFILE API ROUTE
// ============================================
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { validateInput, profileUpdateSchema } from '@/lib/sanitize'
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  validationErrorResponse,
  serverErrorResponse,
} from '@/lib/headers'

// GET — Fetch profile
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return unauthorizedResponse()

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) return errorResponse(error.message, 400)

    return successResponse(profile)
  } catch (error) {
    return serverErrorResponse(error)
  }
}

// PATCH — Update profile
export async function PATCH(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return unauthorizedResponse()

    const body = await request.json()
    const validation = validateInput(profileUpdateSchema, body)
    if (!validation.success) {
      return validationErrorResponse(validation.errors)
    }

    const updates = validation.data

    // Check username uniqueness if changing
    if (updates.username) {
      const admin = createAdminClient()
      const { data: existing } = await admin
        .from('profiles')
        .select('id')
        .eq('username', updates.username)
        .neq('id', user.id)
        .single()

      if (existing) {
        return errorResponse('Username already taken', 409)
      }
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single()

    if (error) return errorResponse(error.message, 400)

    return successResponse(data, 'Profile updated')
  } catch (error) {
    return serverErrorResponse(error)
  }
}

// DELETE — Delete account
export async function DELETE() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return unauthorizedResponse()

    const admin = createAdminClient()

    // Delete profile (cascades to all tables)
    await admin
      .from('profiles')
      .delete()
      .eq('id', user.id)

    // Delete auth user
    await admin.auth.admin.deleteUser(user.id)

    return successResponse(null, 'Account deleted successfully')
  } catch (error) {
    return serverErrorResponse(error)
  }
}
