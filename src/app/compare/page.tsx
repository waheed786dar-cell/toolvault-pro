// ============================================
// TOOLVAULT PRO — COMPARE PAGE
// ============================================
'use client'
import { Navbar } from '@/components/layout/Navbar'
import { ToolComparison } from '@/components/features/ToolComparison'
import { GitCompare } from 'lucide-react'

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-surface-50">
      <Navbar />
      <main className="container-main py-6 max-w-2xl">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <GitCompare size={20} className="text-primary-600" />
            <h1 className="text-2xl font-display font-bold text-surface-900">
              Compare Tools
            </h1>
          </div>
          <p className="text-surface-500 text-sm">
            Side-by-side feature comparison
          </p>
        </div>
        <ToolComparison />
      </main>
    </div>
  )
}
