// ============================================
// TOOLVAULT PRO — ROBOTS.TXT
// ============================================
import type { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://toolvault.vercel.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/tools/',
          '/leaderboard',
          '/collections',
          '/compare',
        ],
        disallow: [
          '/api/',
          '/dashboard',
          '/profile',
          '/analytics',
          '/onboarding',
          '/auth/',
          '/_next/',
        ],
      },
      {
        // Block AI scrapers
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'CCBot',
          'anthropic-ai',
          'Claude-Web',
        ],
        disallow: ['/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
