// ============================================
// TOOLVAULT PRO — TAILWIND CONFIG
// ============================================
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // ========================================
      // COLORS — Clean Professional Palette
      // ========================================
      colors: {
        primary: {
          50:  '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
          950: '#172554',
        },
        surface: {
          50:  '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },
        success: {
          50:  '#F0FDF4',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
        },
        warning: {
          50:  '#FFFBEB',
          500: '#F59E0B',
          600: '#D97706',
        },
        danger: {
          50:  '#FEF2F2',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
        },
      },

      // ========================================
      // TYPOGRAPHY
      // ========================================
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Fira Code', 'monospace'],
        urdu:    ['Noto Nastaliq Urdu', 'serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
        xs:    ['0.75rem',  { lineHeight: '1rem' }],
        sm:    ['0.875rem', { lineHeight: '1.25rem' }],
        base:  ['1rem',     { lineHeight: '1.5rem' }],
        lg:    ['1.125rem', { lineHeight: '1.75rem' }],
        xl:    ['1.25rem',  { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem',   { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem',  { lineHeight: '2.5rem' }],
        '5xl': ['3rem',     { lineHeight: '1.15' }],
        '6xl': ['3.75rem',  { lineHeight: '1.1' }],
        '7xl': ['4.5rem',   { lineHeight: '1.05' }],
      },

      // ========================================
      // SPACING
      // ========================================
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },

      // ========================================
      // BORDER RADIUS
      // ========================================
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },

      // ========================================
      // BOX SHADOW
      // ========================================
      boxShadow: {
        'soft':   '0 2px 15px -3px rgba(0,0,0,0.07), 0 10px 20px -2px rgba(0,0,0,0.04)',
        'card':   '0 4px 24px rgba(15,23,42,0.08)',
        'card-hover': '0 12px 40px rgba(15,23,42,0.12)',
        'blue':   '0 0 40px rgba(37,99,235,0.15)',
        'blue-sm':'0 0 20px rgba(37,99,235,0.1)',
        'inner-blue': 'inset 0 2px 8px rgba(37,99,235,0.1)',
        'glow':   '0 0 60px rgba(59,130,246,0.2)',
      },

      // ========================================
      // BACKGROUND IMAGE
      // ========================================
      backgroundImage: {
        'gradient-hero':    'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)',
        'gradient-primary': 'linear-gradient(90deg, #1E3A8A 0%, #3B82F6 100%)',
        'gradient-light':   'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
        'gradient-card':    'linear-gradient(145deg, #FFFFFF 0%, #F8FAFC 100%)',
        'gradient-text':    'linear-gradient(90deg, #1E3A8A 0%, #60A5FA 100%)',
        'dot-pattern':      'radial-gradient(circle, #CBD5E1 1px, transparent 1px)',
        'grid-pattern':     'linear-gradient(#E2E8F0 1px, transparent 1px), linear-gradient(90deg, #E2E8F0 1px, transparent 1px)',
      },

      // ========================================
      // ANIMATIONS
      // ========================================
      animation: {
        'fade-in':       'fadeIn 0.5s ease forwards',
        'fade-up':       'fadeUp 0.6s ease forwards',
        'slide-right':   'slideRight 0.4s ease forwards',
        'scale-in':      'scaleIn 0.3s ease forwards',
        'float':         'float 3s ease-in-out infinite',
        'pulse-blue':    'pulseBlue 2s ease-in-out infinite',
        'shimmer':       'shimmer 2s linear infinite',
        'spin-slow':     'spin 3s linear infinite',
        'bounce-slow':   'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideRight: {
          '0%':   { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        pulseBlue: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(37,99,235,0.1)' },
          '50%':      { boxShadow: '0 0 40px rgba(37,99,235,0.3)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },

      // ========================================
      // TRANSITIONS
      // ========================================
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
        '400': '400ms',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },

      // ========================================
      // SCREENS (Mobile First)
      // ========================================
      screens: {
        'xs':  '375px',
        'sm':  '640px',
        'md':  '768px',
        'lg':  '1024px',
        'xl':  '1280px',
        '2xl': '1536px',
      },

      // ========================================
      // Z-INDEX
      // ========================================
      zIndex: {
        '60':  '60',
        '70':  '70',
        '80':  '80',
        '90':  '90',
        '100': '100',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
