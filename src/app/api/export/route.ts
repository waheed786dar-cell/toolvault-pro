// ============================================
// TOOLVAULT PRO — EXPORT API
// ============================================
import { createClient } from '@/lib/supabase/server'
import {
  unauthorizedResponse,
  errorResponse,
  serverErrorResponse,
} from '@/lib/headers'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return unauthorizedResponse()

    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') ?? 'csv'
    const type = searchParams.get('type') ?? 'usage'

    if (type === 'usage') {
      // Fetch usage history
      const { data } = await supabase
        .from('tool_usage')
        .select('tool_slug, tool_category, used_at, was_successful')
        .eq('user_id', user.id)
        .order('used_at', { ascending: false })
        .limit(1000)

      if (format === 'csv') {
        const headers = 'Tool,Category,Date,Successful\n'
        const rows = data
          ?.map(
            (r) =>
              `${r.tool_slug},${r.tool_category},${r.used_at},${r.was_successful}`
          )
          .join('\n') ?? ''

        return new Response(headers + rows, {
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition':
              'attachment; filename="toolvault-usage.csv"',
          },
        })
      }

      if (format === 'json') {
        return new Response(JSON.stringify(data, null, 2), {
          headers: {
            'Content-Type': 'application/json',
            'Content-Disposition':
              'attachment; filename="toolvault-usage.json"',
          },
        })
      }
    }

    if (type === 'saved') {
      const { data } = await supabase
        .from('saved_results')
        .select('title, tool_slug, content, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (format === 'csv') {
        const headers = 'Title,Tool,Date\n'
        const rows = data
          ?.map((r) => `"${r.title}",${r.tool_slug},${r.created_at}`)
          .join('\n') ?? ''

        return new Response(headers + rows, {
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition':
              'attachment; filename="toolvault-saved.csv"',
          },
        })
      }

      if (format === 'json') {
        return new Response(JSON.stringify(data, null, 2), {
          headers: {
            'Content-Type': 'application/json',
            'Content-Disposition':
              'attachment; filename="toolvault-saved.json"',
          },
        })
      }
    }

    return errorResponse('Invalid format or type', 400)
  } catch (error) {
    return serverErrorResponse(error)
  }
}
