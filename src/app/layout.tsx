// ============================================
// TOOLVAULT PRO — ROOT LAYOUT
// ============================================
import type { Metadata, Viewport } from 'next'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics'
import { AnnouncementBanner } from '@/components/features/AnnouncementBanner'
import { CookieConsent } from '@/components/features/CookieConsent'
import { WhatsAppButton } from '@/components/features/WhatsAppButton'
import { PolicyModal } from '@/components/features/PolicyModal'
import { AISearchBar } from '@/components/features/AISearchBar'
import { WebAppJsonLd, OrganizationJsonLd } from '@/components/seo/JsonLd'
import { defaultMetadata } from '@/lib/seo'
import './globals.css'

export const metadata: Metadata = defaultMetadata

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#2563EB' },
    { media: '(prefers-color-scheme: dark)', color: '#1E3A8A' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&family=Noto+Nastaliq+Urdu:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <WebAppJsonLd />
        <OrganizationJsonLd />
      </head>
      <body className="min-h-screen bg-white antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          {/* Global UI */}
          <AnnouncementBanner />
          <AISearchBar />
          <PolicyModal />

          {/* Main content */}
          {children}

          {/* Global overlays */}
          <WhatsAppButton />
          <CookieConsent />

          {/* Notifications */}
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              duration: 3000,
              style: {
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
              },
            }}
          />
        </ThemeProvider>

        {/* Google Analytics */}
        <GoogleAnalytics />
      </body>
    </html>
  )
}
