// ============================================
// TOOLVAULT PRO — TOOL PAGE
// ============================================
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getToolBySlug, ALL_TOOLS } from '@/constants/tools'
import { getToolMetadata } from '@/lib/seo'
import { ToolPageClient } from './ToolPageClient'

export async function generateStaticParams() {
  return ALL_TOOLS.map((tool) => ({ slug: tool.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const tool = getToolBySlug(slug)
  if (!tool) return {}
  return getToolMetadata(tool)
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const tool = getToolBySlug(slug)
  if (!tool) notFound()
  return <ToolPageClient tool={tool} />
}
