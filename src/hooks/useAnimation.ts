// ============================================
// TOOLVAULT PRO — ANIMATION HOOK
// ============================================
'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// ============================================
// FRAMER MOTION VARIANTS
// ============================================
export const variants = {
  // Page transition
  page: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: 'easeInOut' },
  },

  // Fade up
  fadeUp: {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: 'easeOut' },
  },

  // Fade in
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.4 },
  },

  // Scale in
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.2 },
  },

  // Slide in from right
  slideRight: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.4 },
  },

  // Slide in from left
  slideLeft: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.4 },
  },

  // Stagger container
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  },

  // Stagger item
  staggerItem: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  },

  // Modal
  modal: {
    initial: { opacity: 0, scale: 0.95, y: 10 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 10 },
    transition: { duration: 0.2 },
  },

  // Card hover
  cardHover: {
    whileHover: {
      y: -4,
      transition: { duration: 0.2 },
    },
    whileTap: { scale: 0.98 },
  },
}

// ============================================
// HOOK — SCROLL REVEAL
// ============================================
export function useScrollReveal(selector: string) {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const elements = gsap.utils.toArray(selector)

    ScrollTrigger.batch(elements as Element[], {
      onEnter: (batch) =>
        gsap.from(batch, {
          opacity: 0,
          y: 40,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power2.out',
        }),
      once: true,
      start: 'top 85%',
    })

    return () => ScrollTrigger.getAll().forEach((t) => t.kill())
  }, [selector])
}

// ============================================
// HOOK — COUNTER ANIMATION
// ============================================
export function useCounter(
  endValue: number,
  duration: number = 2,
  suffix: string = ''
) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const obj = { value: 0 }

    gsap.to(obj, {
      value: endValue,
      duration,
      ease: 'power2.out',
      onUpdate: () => {
        if (ref.current) {
          ref.current.textContent =
            Math.round(obj.value).toLocaleString() + suffix
        }
      },
      scrollTrigger: {
        trigger: ref.current,
        start: 'top 80%',
        once: true,
      },
    })
  }, [endValue, duration, suffix])

  return ref
}

// ============================================
// HOOK — HERO ANIMATION
// ============================================
export function useHeroAnimation() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const tl = gsap.timeline({ delay: 0.2 })

    tl.from('.hero-badge', {
      opacity: 0,
      y: -20,
      duration: 0.5,
      ease: 'power2.out',
    })
      .from('.hero-title', {
        opacity: 0,
        y: 60,
        duration: 0.8,
        ease: 'power3.out',
      }, '-=0.2')
      .from('.hero-subtitle', {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: 'power2.out',
      }, '-=0.4')
      .from('.hero-cta', {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power2.out',
      }, '-=0.3')
      .from('.hero-image', {
        opacity: 0,
        scale: 0.95,
        duration: 0.8,
        ease: 'power2.out',
      }, '-=0.5')

    return () => { tl.kill() }
  }, [])
}

// ============================================
// HOOK — STAGGER ITEMS
// ============================================
export function useStaggerAnimation(
  containerRef: React.RefObject<HTMLElement>,
  itemSelector: string
) {
  useEffect(() => {
    if (!containerRef.current) return

    const items = containerRef.current.querySelectorAll(itemSelector)

    gsap.from(items, {
      opacity: 0,
      y: 30,
      stagger: 0.08,
      duration: 0.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        once: true,
      },
    })
  }, [itemSelector])
}
