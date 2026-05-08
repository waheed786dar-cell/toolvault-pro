// ============================================
// TOOLVAULT PRO — NAVBAR
// ============================================
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap, Search, Bell, Menu, X,
  LayoutDashboard, User, LogOut,
  Trophy, BookOpen, BarChart2, Heart
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useUIStore } from '@/store/uiStore'
import { useCredits } from '@/hooks/useCredits'
import { DarkModeToggle } from '@/components/features/DarkModeToggle'
import { CreditsDisplay } from '@/components/features/CreditsDisplay'
import { clsx } from 'clsx'
import Image from 'next/image'

const NAV_LINKS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { href: '/collections', label: 'Collections', icon: BookOpen },
  { href: '/analytics', label: 'Analytics', icon: BarChart2 },
]

export function Navbar() {
  const pathname = usePathname()
  const { user, profile, signOut, isAuthenticated } = useAuth()
  const { setSearchOpen, language } = useUIStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const isActive = (href: string) => pathname.startsWith(href)

  // Hide on auth pages
  if (pathname.startsWith('/auth') || pathname === '/onboarding') return null

  return (
    <nav className={clsx(
      'sticky top-0 z-50 transition-all duration-300',
      scrolled
        ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-surface-100'
        : 'bg-white border-b border-surface-100'
    )}>
      <div className="container-main flex items-center h-16 gap-4">
        {/* Logo */}
        <Link href={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-hero rounded-xl flex items-center justify-center">
            <Zap size={15} className="text-white fill-current" />
          </div>
          <span className="font-display font-bold text-surface-900 hidden sm:block">
            TOOLVAULT <span className="text-primary-600">PRO</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        {isAuthenticated && (
          <div className="hidden md:flex items-center gap-1 ml-2">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={clsx(
                  'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all',
                  isActive(href)
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
                )}
              >
                <Icon size={14} />
                {label}
              </Link>
            ))}
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-2 bg-surface-100 hover:bg-surface-200 rounded-xl transition-colors"
            title="Search tools (Ctrl+K)"
          >
            <Search size={15} className="text-surface-500" />
            <span className="hidden sm:block text-xs text-surface-400 font-medium">
              Search...
            </span>
            <kbd className="hidden lg:block text-xs bg-white border border-surface-200 px-1.5 py-0.5 rounded text-surface-400 font-mono">
              ⌘K
            </kbd>
          </button>

          {isAuthenticated ? (
            <>
              {/* Credits */}
              <CreditsDisplay variant="mini" className="hidden sm:flex" />

              {/* Dark mode */}
              <DarkModeToggle variant="icon" />

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1 rounded-xl hover:bg-surface-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden ring-2 ring-primary-200">
                    {profile?.avatar_url ? (
                      <Image
                        src={profile.avatar_url}
                        alt={profile.username ?? 'User'}
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-sm font-bold text-primary-700">
                        {(profile?.username ?? user?.email ?? 'U').charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <>
                      <motion.div
                        className="fixed inset-0 z-30"
                        onClick={() => setIsProfileOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-56 card shadow-xl z-40 overflow-hidden py-1"
                      >
                        {/* User info */}
                        <div className="px-4 py-3 border-b border-surface-100">
                          <p className="text-sm font-bold text-surface-900">
                            @{profile?.username ?? 'User'}
                          </p>
                          <p className="text-xs text-surface-500 truncate">
                            {user?.email}
                          </p>
                        </div>

                        {/* Credits in dropdown */}
                        <div className="px-4 py-2 border-b border-surface-100">
                          <CreditsDisplay variant="full" />
                        </div>

                        {/* Links */}
                        {[
                          { href: '/profile', icon: User, label: 'My Profile' },
                          { href: '/dashboard?tab=favorites', icon: Heart, label: 'Favorites' },
                          { href: '/analytics', icon: BarChart2, label: 'Analytics' },
                        ].map(({ href, icon: Icon, label }) => (
                          <Link
                            key={href}
                            href={href}
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-50 text-sm text-surface-700 transition-colors"
                          >
                            <Icon size={15} className="text-surface-400" />
                            {label}
                          </Link>
                        ))}

                        {/* Sign out */}
                        <div className="border-t border-surface-100 mt-1">
                          <button
                            onClick={() => { signOut(); setIsProfileOpen(false) }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-danger-50 text-sm text-danger-600 transition-colors"
                          >
                            <LogOut size={15} />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <>
              <DarkModeToggle variant="icon" />
              <Link href="/auth/login" className="btn-ghost text-sm hidden sm:flex">
                Login
              </Link>
              <Link href="/auth/register" className="btn-primary text-sm">
                Get Started
              </Link>
            </>
          )}

          {/* Mobile menu */}
          {isAuthenticated && (
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-xl hover:bg-surface-100 transition-colors md:hidden"
            >
              {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMenuOpen && isAuthenticated && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-surface-100 overflow-hidden bg-white"
          >
            <div className="container-main py-3 space-y-1">
              {NAV_LINKS.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsMenuOpen(false)}
                  className={clsx(
                    'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all',
                    isActive(href)
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-surface-600 hover:bg-surface-100'
                  )}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              ))}
              <div className="pt-2 border-t border-surface-100">
                <CreditsDisplay variant="full" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
