// ============================================
// TOOLVAULT PRO — PRIVACY POLICY PAGE
// ============================================
import type { Metadata } from 'next'
import { getPageMetadata } from '@/lib/seo'
import { WebAppJsonLd } from '@/components/seo/JsonLd'

export const metadata: Metadata = getPageMetadata(
  'Privacy Policy',
  'How TOOLVAULT PRO collects, uses and protects your personal data.',
  '/privacy'
)

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-surface-50">
      <WebAppJsonLd />

      {/* Header */}
      <div className="bg-gradient-hero text-white py-16">
        <div className="container-main text-center">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">
            Privacy Policy
          </h1>
          <p className="text-white/80 text-sm">
            Last updated: {new Date().toLocaleDateString('en-PK', {
              year: 'numeric', month: 'long', day: 'numeric'
            })}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container-main py-12 max-w-3xl">
        <div className="card p-8 md:p-12 space-y-8">

          {/* Intro */}
          <section>
            <p className="text-surface-600 leading-relaxed">
              At <strong>TOOLVAULT PRO</strong>, we are committed to protecting
              your privacy. This Privacy Policy explains how we collect, use,
              disclose, and safeguard your information when you use our platform.
              Please read this policy carefully.
            </p>
          </section>

          {[
            {
              num: '1',
              title: 'Information We Collect',
              content: `
We collect the following types of information:

**Account Information:** When you register, we collect your email address, username, and password (encrypted).

**Profile Information:** Full name, bio, profile photo, and language preference that you voluntarily provide.

**Usage Data:** Tools you use, frequency of use, and interaction patterns to improve our service.

**Technical Data:** IP address (hashed), browser type, device information, and cookies.

**Communications:** Feedback and support messages you send us.

We do NOT collect payment information as all tools are free.
              `,
            },
            {
              num: '2',
              title: 'How We Use Your Information',
              content: `
We use collected information to:

• Provide, operate, and maintain our services
• Create and manage your account
• Personalize your experience
• Send service-related notifications
• Respond to support requests
• Analyze usage patterns to improve tools
• Display relevant advertisements via Monetag
• Prevent fraud and ensure security
• Comply with legal obligations

We do NOT sell your personal data to third parties.
              `,
            },
            {
              num: '3',
              title: 'Data Storage & Security',
              content: `
Your data is stored securely using:

• **Supabase** — PostgreSQL database with Row Level Security (RLS), ensuring only you can access your data
• **AES-256-GCM encryption** for sensitive information
• **HTTPS/TLS** for all data transmission
• **Hashed IP addresses** — we never store raw IPs
• Regular security audits and updates

Our servers are located in **Singapore** (Southeast Asia region) for optimal performance in Pakistan and surrounding regions.

We retain your data as long as your account is active. You may request deletion at any time.
              `,
            },
            {
              num: '4',
              title: 'Cookies & Tracking',
              content: `
We use cookies for:

**Necessary Cookies:** Session management, authentication, and security. These cannot be disabled.

**Analytics Cookies:** Understanding how users interact with our platform (only with your consent).

**Advertising Cookies:** Showing relevant ads via Monetag (only with your consent).

You can manage cookie preferences through our Cookie Consent panel. Refusing optional cookies will not affect core functionality.
              `,
            },
            {
              num: '5',
              title: 'Third-Party Services',
              content: `
We use the following third-party services:

| Service | Purpose | Privacy Policy |
|---------|---------|---------------|
| Supabase | Database & Auth | supabase.com/privacy |
| Google OAuth | Sign-in | policies.google.com/privacy |
| Cloudinary | Image storage | cloudinary.com/privacy |
| Groq AI | AI generation | groq.com/privacy |
| Monetag | Advertisements | monetag.com/privacy |
| Upstash | Rate limiting | upstash.com/privacy |
| hCaptcha | Bot protection | hcaptcha.com/privacy |

Each service has their own privacy policy governing their data practices.
              `,
            },
            {
              num: '6',
              title: 'Your Rights (GDPR & PDPA)',
              content: `
You have the following rights regarding your data:

• **Right to Access** — Request a copy of your personal data
• **Right to Rectification** — Correct inaccurate data
• **Right to Erasure** — Delete your account and all associated data
• **Right to Portability** — Export your data in CSV or JSON format
• **Right to Restrict Processing** — Limit how we use your data
• **Right to Object** — Object to data processing for advertising

To exercise these rights, go to **Profile → Settings → Data & Privacy** or contact us via WhatsApp support.

We will respond to all requests within **30 days**.
              `,
            },
            {
              num: '7',
              title: 'Children\'s Privacy',
              content: `
TOOLVAULT PRO is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.

If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately and we will delete such information from our servers.
              `,
            },
            {
              num: '8',
              title: 'Advertising',
              content: `
We display advertisements through **Monetag** to keep our service free. These ads may use cookies to show relevant content based on your browsing behavior.

You can opt out of personalized advertising through our Cookie Consent settings. Non-personalized ads will still be shown.

We do not allow advertisers to collect your personal data directly from our platform.
              `,
            },
            {
              num: '9',
              title: 'Changes to This Policy',
              content: `
We may update this Privacy Policy from time to time. We will notify you of significant changes by:

• Displaying an announcement banner on the site
• Sending a notification to your account
• Requiring re-acceptance if changes are material

Continued use of TOOLVAULT PRO after changes constitutes acceptance of the updated policy.
              `,
            },
            {
              num: '10',
              title: 'Contact Us',
              content: `
If you have questions about this Privacy Policy or your data:

• **WhatsApp:** Use the support button on our website
• **Email:** privacy@toolvault.pro (if available)
• **Response time:** Within 48 hours

This Privacy Policy is governed by the laws of Pakistan and applicable international data protection regulations.
              `,
            },
          ].map((section) => (
            <section key={section.num} className="space-y-3">
              <h2 className="text-lg font-bold text-surface-900 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {section.num}
                </span>
                {section.title}
              </h2>
              <div className="text-sm text-surface-600 leading-relaxed whitespace-pre-line pl-9">
                {section.content.trim()}
              </div>
            </section>
          ))}

        </div>
      </div>
    </main>
  )
}
