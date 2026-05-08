// ============================================
// TOOLVAULT PRO — ISR REVALIDATION
// ============================================
import { revalidatePath, revalidateTag } from 'next/cache'
import { successResponse, serverErrorResponse } from '@/lib/headers'

export async function POST(request: Request) {
  try {
    const secret = request.headers.get('x-revalidate-secret')

    if (secret !== process.env.CRON_SECRET) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { path, tag } = await request.json()

    if (tag) {
      revalidateTag(tag)
    }

    if (path) {
      revalidatePath(path)
    }

    // Revalidate common pages
    revalidatePath('/')
    revalidatePath('/dashboard')
    revalidatePath('/leaderboard')

    return successResponse(
      { revalidated: true, timestamp: new Date().toISOString() },
      'Cache revalidated'
    )
  } catch (error) {
    return serverErrorResponse(error)
  }
}
