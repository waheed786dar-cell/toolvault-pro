// ============================================
// TOOLVAULT PRO — SEO METADATA SYSTEM
// ============================================
import type { Metadata } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://toolvault.vercel.app'
const APP_NAME = 'TOOLVAULT PRO'
const APP_DESCRIPTION = '30+ free professional SaaS tools — AI Writing, Image Editing, SEO, PDF, Code & Business tools. Free forever, no signup required for basic tools.'

// ============================================
// DEFAULT METADATA
// ============================================
export const defaultMetadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: `${APP_NAME} — 30+ Free Professional Tools`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: [
    'free online tools',
    'AI writing tools',
    'image editor online',
    'PDF tools free',
    'SEO tools',
    'code formatter',
    'business tools',
    'free SaaS tools',
    'online tools Pakistan',
    'مفت آن لائن ٹولز',
  ],
  authors: [{ name: 'TOOLVAULT PRO', url: BASE_URL }],
  creator: 'TOOLVAULT PRO',
  publisher: 'TOOLVAULT PRO',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['ur_PK'],
    url: BASE_URL,
    siteName: APP_NAME,
    title: `${APP_NAME} — 30+ Free Professional Tools`,
    description: APP_DESCRIPTION,
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: `${APP_NAME} — Free Online Tools`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${APP_NAME} — 30+ Free Professional Tools`,
    description: APP_DESCRIPTION,
    images: [`${BASE_URL}/og-image.png`],
    creator: '@toolvaultpro',
  },
  alternates: {
    canonical: BASE_URL,
    languages: {
      'en-US': `${BASE_URL}/en`,
      'ur-PK': `${BASE_URL}/ur`,
    },
  },
  category: 'technology',
  classification: 'Business/Productivity',
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION ?? '',
  },
}

// ============================================
// TOOL PAGE METADATA
// ============================================
export function getToolMetadata(tool: {
  name: string
  nameUr: string
  description: string
  descriptionUr: string
  slug: string
  category: string
}): Metadata {
  const title = `${tool.name} — Free Online Tool`
  const url = `${BASE_URL}/tools/${tool.slug}`

  return {
    title,
    description: tool.description,
    keywords: [
      tool.name.toLowerCase(),
      `free ${tool.name.toLowerCase()}`,
      `online ${tool.name.toLowerCase()}`,
      tool.category,
      'free tool',
      'online tool',
    ],
    openGraph: {
      title,
      description: tool.description,
      url,
      type: 'website',
      images: [
        {
          url: `${BASE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: tool.description,
    },
    alternates: {
      canonical: url,
    },
  }
}

// ============================================
// PAGE METADATA HELPER
// ============================================
export function getPageMetadata(
  title: string,
  description: string,
  path: string = ''
): Metadata {
  const url = `${BASE_URL}${path}`

  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${APP_NAME}`,
      description,
      url,
      images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${APP_NAME}`,
      description,
    },
    alternates: { canonical: url },
  }
}

// ============================================
// JSON-LD SCHEMAS
// ============================================

// WebApplication Schema
export function getWebAppSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: APP_NAME,
    url: BASE_URL,
    description: APP_DESCRIPTION,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'AI Writing Tools',
      'Image Editing Tools',
      'SEO Tools',
      'PDF Tools',
      'Code Tools',
      'Business Tools',
    ],
    screenshot: `${BASE_URL}/og-image.png`,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1250',
      bestRating: '5',
    },
  }
}

// Tool Schema
export function getToolSchema(tool: {
  name: string
  description: string
  slug: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: tool.description,
    url: `${BASE_URL}/tools/${tool.slug}`,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  }
}

// FAQ Schema
export function getFAQSchema(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  }
}

// BreadcrumbList Schema
export function getBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

// Organization Schema
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: APP_NAME,
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    sameAs: [
      'https://twitter.com/toolvaultpro',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      availableLanguage: ['English', 'Urdu'],
    },
  }
}
