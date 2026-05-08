// ============================================
// TOOLVAULT PRO — JSON-LD STRUCTURED DATA
// ============================================
interface JsonLdProps {
  schema: Record<string, unknown> | Record<string, unknown>[]
}

export function JsonLd({ schema }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema, null, 0),
      }}
    />
  )
}

// ============================================
// PREBUILT SCHEMAS
// ============================================
export function WebAppJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'TOOLVAULT PRO',
    url: process.env.NEXT_PUBLIC_APP_URL,
    description: '30+ free professional online tools for writing, images, SEO, PDF, code and business.',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1250',
      bestRating: '5',
      worstRating: '1',
    },
    featureList: [
      'AI Article Writer',
      'Background Remover',
      'PDF Merger',
      'Meta Tag Generator',
      'Code Formatter',
      'Invoice Generator',
      'QR Code Generator',
      'Currency Converter PKR',
    ],
  }
  return <JsonLd schema={schema} />
}

export function ToolJsonLd({
  name,
  description,
  slug,
}: {
  name: string
  description: string
  slug: string
}) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    url: `${baseUrl}/tools/${slug}`,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web Browser',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    isAccessibleForFree: true,
  }
  return <JsonLd schema={schema} />
}

export function FAQJsonLd({
  faqs,
}: {
  faqs: { question: string; answer: string }[]
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
  return <JsonLd schema={schema} />
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[]
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
  return <JsonLd schema={schema} />
}

export function OrganizationJsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'TOOLVAULT PRO',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      availableLanguage: ['English', 'Urdu'],
    },
  }
  return <JsonLd schema={schema} />
}
