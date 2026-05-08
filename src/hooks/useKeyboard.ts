// ============================================
// TOOLVAULT PRO — KEYBOARD SHORTCUTS HOOK
// ============================================
'use client'
import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useUIStore } from '@/store/uiStore'

export interface Shortcut {
  key: string
  ctrl?: boolean
  shift?: boolean
  description: string
  action: () => void
}

export function useKeyboard() {
  const router = useRouter()
  const { toggleSearch, setSidebarOpen, setSearchOpen } = useUIStore()

  const shortcuts: Shortcut[] = [
    {
      key: 'k',
      ctrl: true,
      description: 'Open AI Search',
      action: () => setSearchOpen(true),
    },
    {
      key: 'd',
      ctrl: true,
      description: 'Go to Dashboard',
      action: () => router.push('/dashboard'),
    },
    {
      key: 'f',
      ctrl: true,
      description: 'Go to Favorites',
      action: () => router.push('/dashboard?tab=favorites'),
    },
    {
      key: 'h',
      ctrl: true,
      description: 'Go to Home',
      action: () => router.push('/'),
    },
    {
      key: 'l',
      ctrl: true,
      description: 'Go to Leaderboard',
      action: () => router.push('/leaderboard'),
    },
    {
      key: 'e',
      ctrl: true,
      description: 'Go to Analytics',
      action: () => router.push('/analytics'),
    },
    {
      key: 'b',
      ctrl: true,
      description: 'Toggle Sidebar',
      action: () => setSidebarOpen(true),
    },
    {
      key: 'Escape',
      description: 'Close / Go back',
      action: () => {
        setSearchOpen(false)
        setSidebarOpen(false)
      },
    },
  ]

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Ignore when typing in inputs
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        // Allow Escape even in inputs
        if (e.key !== 'Escape') return
      }

      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrl
          ? e.ctrlKey || e.metaKey
          : true
        const shiftMatch = shortcut.shift ? e.shiftKey : true
        const keyMatch =
          e.key.toLowerCase() === shortcut.key.toLowerCase()

        if (ctrlMatch && shiftMatch && keyMatch) {
          // Prevent default for ctrl shortcuts
          if (shortcut.ctrl) e.preventDefault()
          shortcut.action()
          break
        }
      }
    },
    [router, toggleSearch, setSidebarOpen, setSearchOpen]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return { shortcuts }
}

// ============================================
// SHORTCUT DISPLAY HELPER
// ============================================
export function formatShortcut(shortcut: Shortcut): string {
  const parts: string[] = []
  if (shortcut.ctrl) parts.push('Ctrl')
  if (shortcut.shift) parts.push('Shift')
  parts.push(shortcut.key.toUpperCase())
  return parts.join(' + ')
}
