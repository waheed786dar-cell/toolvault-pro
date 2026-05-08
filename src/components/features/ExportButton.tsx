// ============================================
// TOOLVAULT PRO — EXPORT BUTTON
// ============================================
'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, FileText, FileJson, ChevronDown, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { clsx } from 'clsx'

interface ExportButtonProps {
  type: 'usage' | 'saved'
  className?: string
}

export function ExportButton({ type, className }: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isExporting, setIsExporting] = useState<string | null>(null)

  const exportData = async (format: 'csv' | 'json') => {
    setIsExporting(format)
    setIsOpen(false)

    try {
      const res = await fetch(
        `/api/export?type=${type}&format=${format}`
      )

      if (!res.ok) throw new Error('Export failed')

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `toolvault-${type}-${new Date().toISOString().split('T')[0]}.${format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success(`Exported as ${format.toUpperCase()} successfully!`)
    } catch {
      toast.error('Export failed. Please try again.')
    } finally {
      setIsExporting(null)
    }
  }

  const options = [
    {
      format: 'csv' as const,
      icon: FileText,
      label: 'Export as CSV',
      desc: 'Open in Excel or Sheets',
    },
    {
      format: 'json' as const,
      icon: FileJson,
      label: 'Export as JSON',
      desc: 'For developers',
    },
  ]

  return (
    <div className={clsx('relative', className)}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.97 }}
        className="flex items-center gap-2 btn-secondary text-sm"
        disabled={!!isExporting}
      >
        {isExporting ? (
          <Loader2 size={15} className="animate-spin" />
        ) : (
          <Download size={15} />
        )}
        Export
        <ChevronDown
          size={13}
          className={clsx(
            'transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-30"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-52 card shadow-xl z-40 overflow-hidden py-1"
            >
              {options.map(({ format, icon: Icon, label, desc }) => (
                <button
                  key={format}
                  onClick={() => exportData(format)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-50 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-surface-800">
                      {label}
                    </p>
                    <p className="text-xs text-surface-500">{desc}</p>
                  </div>
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
