// ============================================
// TOOLVAULT PRO — LANDING PAGE
// ============================================
import type { Metadata } from 'next'
import Link from 'next/link'
import { defaultMetadata } from '@/lib/seo'
import {
  WebAppJsonLd,
  FAQJsonLd,
  BreadcrumbJsonLd,
} from '@/components/seo/JsonLd'
import { ALL_TOOLS, TOOL_CATEGORIES, getPopularTools } from '@/constants/tools'
import {
  ArrowRight, Zap, Shield, Globe,
  Star, Users, TrendingUp, Check,
  Sparkles, ChevronRight
} from 'lucide-react'

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'TOOLVAULT PRO — 30+ Free Professional Online Tools',
  description:
    'Free AI writing, image editing, SEO, PDF, code and business tools. No subscription needed. Used by 50,000+ professionals worldwide.',
}

const FAQS = [
  {
    question: 'Are all tools on TOOLVAULT PRO really free?',
    answer:
      'Yes! All 30+ tools are completely free to use. We are supported by non-intrusive advertisements that keep our service free for everyone.',
  },
  {
    question: 'Do I need to create an account to use the tools?',
    answer:
      'Some tools work without an account, but creating a free account unlocks AI-powered tools, saves your results, and gives you 20 daily AI credits.',
  },
  {
    question: 'How many AI credits do I get per day?',
    answer:
      'Every free account gets 20 AI credits daily, automatically reset at midnight. You can earn bonus credits by referring friends.',
  },
  {
    question: 'Is my data safe on TOOLVAULT PRO?',
    answer:
      'Absolutely. We use AES-256 encryption, Supabase Row Level Security, and never sell your data. Files uploaded for processing are deleted after 24 hours.',
  },
  {
    question: 'Do the tools work on mobile?',
    answer:
      'Yes! TOOLVAULT PRO is built mobile-first. You can also install it as a PWA (Progressive Web App) on your phone for offline access.',
  },
  {
    question: 'Is there an Urdu language option?',
    answer:
      'Yes! TOOLVAULT PRO fully supports both English and Urdu (اردو). Switch languages anytime from the navbar or your profile settings.',
  },
]

const STATS = [
  { value: '30+', label: 'Free Tools', icon: Zap },
  { value: '50K+', label: 'Monthly Users', icon: Users },
  { value: '6', label: 'Tool Categories', icon: TrendingUp },
  { value: '4.8★', label: 'User Rating', icon: Star },
]

export default function LandingPage() {
  const popularTools = getPopularTools(6)

  return (
    <main className="min-h-screen">
      <WebAppJsonLd />
      <FAQJsonLd faqs={FAQS.map((f) => ({ question: f.question, answer: f.answer }))} />
      <BreadcrumbJsonLd items={[{ name: 'Home', url: process.env.NEXT_PUBLIC_APP_URL ?? '' }]} />

      {/* ========================================
          NAVBAR
      ======================================== */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-surface-100 shadow-sm">
        <div className="container-main flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-hero rounded-xl flex items-center justify-center">
              <Zap size={16} className="text-white fill-current" />
            </div>
            <span className="font-display font-bold text-surface-900 text-lg">
              TOOLVAULT <span className="text-primary-600">PRO</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {['Tools', 'Categories', 'Leaderboard'].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="text-sm font-medium text-surface-600 hover:text-primary-600 transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link href="/auth/login" className="btn-ghost text-sm hidden sm:flex">
              Login
            </Link>
            <Link href="/auth/register" className="btn-primary text-sm">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ========================================
          HERO SECTION
      ======================================== */}
      <section className="hero-bg py-20 md:py-32 relative">
        <div className="container-main text-center relative z-10">

          {/* Badge */}
          <div className="hero-badge inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 text-white text-xs font-semibold px-4 py-2 rounded-full mb-6">
            <Sparkles size={12} className="text-yellow-300" />
            30+ Free Professional Tools — No Credit Card Required
          </div>

          {/* Headline */}
          <h1 className="hero-title text-4xl sm:text-5xl md:text-6xl font-display font-bold text-white mb-6 text-balance leading-tight">
            All-in-One{' '}
            <span className="text-yellow-300">Free</span>{' '}
            SaaS Tools Platform
          </h1>

          {/* Subheadline */}
          <p className="hero-subtitle text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            AI Writing, Image Editing, SEO, PDF, Code & Business tools —
            all free, all professional. Used by 50,000+ creators worldwide.
          </p>

          {/* CTA Buttons */}
          <div className="hero-cta flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/auth/register"
              className="flex items-center gap-2 bg-white text-primary-700 px-8 py-4 rounded-2xl font-bold text-base hover:bg-primary-50 transition-all duration-200 shadow-lg hover:shadow-xl w-full sm:w-auto justify-center"
            >
              <Zap size={18} className="fill-current" />
              Start Using Free Tools
              <ArrowRight size={16} />
            </Link>
            <Link
              href="#tools"
              className="flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white border border-white/30 px-8 py-4 rounded-2xl font-semibold text-base hover:bg-white/25 transition-all duration-200 w-full sm:w-auto justify-center"
            >
              Browse All Tools
            </Link>
          </div>

          {/* Stats */}
          <div className="hero-image grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {STATS.map(({ value, label, icon: Icon }) => (
              <div
                key={label}
                className="glass-card px-4 py-3 text-center"
              >
                <Icon size={16} className="text-white/70 mx-auto mb-1" />
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-white/70 text-xs">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Dot pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
      </section>

      {/* ========================================
          TOOL CATEGORIES
      ======================================== */}
      <section className="section bg-surface-50">
        <div className="container-main">
          <div className="text-center mb-12">
            <span className="badge-blue mb-3">6 Categories</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-surface-900 mb-4">
              Everything You Need in One Place
            </h2>
            <p className="text-surface-500 max-w-xl mx-auto">
              Professional tools across 6 categories — all free, all powerful
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {TOOL_CATEGORIES.map((cat, i) => (
              <Link
                key={cat.slug}
                href={`/dashboard?category=${cat.slug}`}
                className="card p-5 group cursor-pointer"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4 transition-transform duration-200 group-hover:scale-110"
                  style={{ backgroundColor: `${cat.color}15` }}
                >
                  {cat.icon}
                </div>
                <h3 className="font-bold text-surface-900 mb-1 text-sm">
                  {cat.name}
                </h3>
                <p className="text-xs text-surface-500 mb-3">
                  {cat.count} free tools
                </p>
                <div className="flex items-center gap-1 text-xs font-semibold text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore
                  <ChevronRight size={12} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================
          POPULAR TOOLS
      ======================================== */}
      <section id="tools" className="section">
        <div className="container-main">
          <div className="text-center mb-12">
            <span className="badge-blue mb-3">Most Used</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-surface-900 mb-4">
              Popular Free Tools
            </h2>
            <p className="text-surface-500 max-w-xl mx-auto">
              Trusted by thousands of professionals every day
            </p>
          </div>

          <div className="tool-grid mb-10">
            {popularTools.map((tool, i) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="card p-5 group cursor-pointer"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${tool.color}15` }}
                  >
                    {tool.icon}
                  </div>
                  <div className="flex gap-1">
                    {tool.isNew && (
                      <span className="badge-new text-xs">New</span>
                    )}
                    {tool.isPopular && (
                      <span className="badge-blue text-xs">Popular</span>
                    )}
                  </div>
                </div>
                <h3 className="font-bold text-surface-900 mb-1.5 text-sm">
                  {tool.name}
                </h3>
                <p className="text-xs text-surface-500 mb-4 leading-relaxed">
                  {tool.description}
                </p>
                <div className="flex items-center gap-1 text-xs font-semibold text-primary-600 group-hover:gap-2 transition-all">
                  Use Free
                  <ArrowRight size={12} />
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/auth/register"
              className="btn-outline inline-flex items-center gap-2"
            >
              View All {ALL_TOOLS.length}+ Free Tools
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================
          WHY TOOLVAULT
      ======================================== */}
      <section className="section bg-surface-50">
        <div className="container-main">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-surface-900 mb-4">
              Why Choose TOOLVAULT PRO?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: '🆓',
                title: 'Always Free',
                desc: 'No hidden fees, no credit card required. All 30+ tools are free forever, supported by non-intrusive ads.',
                points: ['No subscription', 'No credit card', 'No limits on basic tools'],
              },
              {
                icon: '🤖',
                title: 'AI-Powered',
                desc: 'Cutting-edge Groq AI with Llama 3.3 model — faster than GPT-4, completely free for registered users.',
                points: ['20 free AI credits daily', 'Earn more via referrals', 'Urdu + English support'],
              },
              {
                icon: '🔒',
                title: 'Secure & Private',
                desc: 'Enterprise-grade security with AES-256 encryption. Your data is never sold or shared.',
                points: ['AES-256 encryption', 'GDPR compliant', 'Data auto-deleted in 24h'],
              },
            ].map((feature, i) => (
              <div key={i} className="card p-6">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold text-surface-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-surface-600 mb-4 leading-relaxed">
                  {feature.desc}
                </p>
                <ul className="space-y-2">
                  {feature.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-center gap-2 text-xs text-surface-700"
                    >
                      <Check size={13} className="text-success-600 flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================
          FAQ SECTION — Google Rich Results
      ======================================== */}
      <section className="section">
        <div className="container-main max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-surface-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-surface-500">
              Everything you need to know about TOOLVAULT PRO
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <details
                key={i}
                className="card p-5 group"
              >
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <h3 className="text-sm font-bold text-surface-900 pr-4">
                    {faq.question}
                  </h3>
                  <ChevronRight
                    size={16}
                    className="text-surface-400 flex-shrink-0 group-open:rotate-90 transition-transform duration-200"
                  />
                </summary>
                <p className="mt-3 text-sm text-surface-600 leading-relaxed border-t border-surface-100 pt-3">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================
          CTA SECTION
      ======================================== */}
      <section className="section hero-bg relative overflow-hidden">
        <div className="container-main text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Start Using Free Tools Today
          </h2>
          <p className="text-white/80 mb-8 max-w-lg mx-auto">
            Join 50,000+ professionals. No credit card. No subscription.
            Just powerful free tools.
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 bg-white text-primary-700 px-10 py-4 rounded-2xl font-bold text-base hover:bg-primary-50 transition-all shadow-lg hover:shadow-xl"
          >
            <Zap size={18} className="fill-current" />
            Create Free Account
            <ArrowRight size={16} />
          </Link>
          <p className="text-white/50 text-xs mt-4">
            Free forever · No credit card · Instant access
          </p>
        </div>
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
      </section>

      {/* ========================================
          FOOTER
      ======================================== */}
      <footer className="bg-surface-900 text-white py-12">
        <div className="container-main">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">

            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary-600 rounded-xl flex items-center justify-center">
                  <Zap size={16} className="text-white fill-current" />
                </div>
                <span className="font-bold text-lg">TOOLVAULT PRO</span>
              </div>
              <p className="text-surface-400 text-xs leading-relaxed mb-4">
                30+ free professional online tools for everyone. AI-powered,
                mobile-friendly, and always free.
              </p>
              <div className="flex items-center gap-1">
                <Globe size={12} className="text-surface-500" />
                <span className="text-xs text-surface-500">
                  English · اردو
                </span>
              </div>
            </div>

            {/* Tools */}
            <div>
              <h4 className="font-bold text-sm mb-4">Popular Tools</h4>
              <ul className="space-y-2">
                {[
                  { name: 'AI Article Writer', slug: 'ai-writer' },
                  { name: 'Background Remover', slug: 'bg-remover' },
                  { name: 'PDF Merger', slug: 'pdf-merger' },
                  { name: 'Meta Tag Generator', slug: 'meta-generator' },
                  { name: 'QR Code Generator', slug: 'qr-generator' },
                ].map((tool) => (
                  <li key={tool.slug}>
                    <Link
                      href={`/tools/${tool.slug}`}
                      className="text-xs text-surface-400 hover:text-white transition-colors"
                    >
                      {tool.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="font-bold text-sm mb-4">Categories</h4>
              <ul className="space-y-2">
                {TOOL_CATEGORIES.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={`/dashboard?category=${cat.slug}`}
                      className="text-xs text-surface-400 hover:text-white transition-colors"
                    >
                      {cat.icon} {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-bold text-sm mb-4">Legal</h4>
              <ul className="space-y-2">
                {[
                  { name: 'Privacy Policy', href: '/privacy' },
                  { name: 'Terms of Service', href: '/terms' },
                  { name: 'Cookie Policy', href: '/privacy#cookies' },
                  { name: 'Leaderboard', href: '/leaderboard' },
                  { name: 'Referral Program', href: '/referral' },
                ].map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-xs text-surface-400 hover:text-white transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-surface-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-surface-500">
              © {new Date().getFullYear()} TOOLVAULT PRO. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-xs text-surface-500 flex items-center gap-1">
                <Shield size={11} />
                Secure & Private
              </span>
              <span className="text-xs text-surface-500 flex items-center gap-1">
                <Zap size={11} />
                Free Forever
              </span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
