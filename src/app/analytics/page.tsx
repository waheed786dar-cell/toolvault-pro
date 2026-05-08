// ============================================
// TOOLVAULT PRO — ANALYTICS PAGE
// ============================================
'use client'
import { Navbar } from '@/components/layout/Navbar'
import { AnalyticsDashboard } from '@/components/features/AnalyticsDashboard'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AnalyticsPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/auth/login')
    }
  }, [isAuthenticated, isLoading])

  return (
    <div className="min-h-screen bg-surface-50">
      <Navbar />
      <main className="container-main py-6 max-w-2xl">
        <AnalyticsDashboard />
      </main>
    </div>
  )
}
