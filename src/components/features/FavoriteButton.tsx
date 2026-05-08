// ============================================
// TOOLVAULT PRO — FAVORITE BUTTON
// ============================================
'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart } from 'lucide-react'
import { useFavorites } from '@/hooks/useFavorites'
import { clsx } from 'clsx'

interface FavoriteButtonProps {
  slug: string
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

export function FavoriteButton({
  slug,
  size = 'md',
  showLabel = false,
  className,
}: FavoriteButtonProps) {
  const { isFavorited, toggleFavorite } = useFavorites()
  const favorited = isFavorited(slug)

  const sizeClasses = {
    sm: 'p-1.5 text-xs',
    md: 'p-2 text-sm',
    lg: 'p-2.5 text-base',
  }

  const iconSize = {
    sm: 14,
    md: 16,
    lg: 20,
  }

  return (
    <motion.button
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleFavorite(slug)
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.85 }}
      className={clsx(
        'relative flex items-center gap-1.5 rounded-full',
        'transition-all duration-200 focus:outline-none',
        'focus:ring-2 focus:ring-primary-500 focus:ring-offset-1',
        favorited
          ? 'text-red-500 bg-red-50 hover:bg-red-100'
          : 'text-surface-400 bg-surface-100 hover:bg-surface-200 hover:text-red-400',
        sizeClasses[size],
        className
      )}
      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
      title={favorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={favorited ? 'filled' : 'empty'}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <Heart
            size={iconSize[size]}
            className={clsx(
              'transition-all duration-200',
              favorited && 'fill-current'
            )}
          />
        </motion.div>
      </AnimatePresence>

      {showLabel && (
        <span className="font-medium">
          {favorited ? 'Saved' : 'Save'}
        </span>
      )}

      {/* Burst animation */}
      <AnimatePresence>
        {favorited && (
          <motion.div
            className="absolute inset-0 rounded-full bg-red-400"
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 2.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        )}
      </AnimatePresence>
    </motion.button>
  )
}
