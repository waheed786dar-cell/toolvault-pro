// ============================================
// TOOLVAULT PRO — TERMS OF SERVICE PAGE
// ============================================
import type { Metadata } from 'next'
import { getPageMetadata } from '@/lib/seo'

export const metadata: Metadata = getPageMetadata(
  'Terms of Service',
  'Terms and conditions for using TOOLVAULT PRO platform.',
  '/terms'
)

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-surface-50">
      <div className="bg-gradient-hero text-white py-16">
        <div className="container-main text-center">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">
            Terms of Service
          </h1>
          <p className="text-white/80 text-sm">
            Last updated: {new Date().toLocaleDateString('en-PK', {
              year: 'numeric', month: 'long', day: 'numeric'
            })}
          </p>
        </div>
      </div>

      <div className="container-main py-12 max-w-3xl">
        <div className="card p-8 md:p-12 space-y-8">

          <section>
            <p className="text-surface-600 leading-relaxed">
              By accessing or using <strong>TOOLVAULT PRO</strong>, you agree
              to be bound by these Terms of Service. If you disagree with any
              part of these terms, you may not use our service.
            </p>
          </section>

          {[
            {
              num: '1',
              title: 'Acceptance of Terms',
              content: `
By creating an account or using any TOOLVAULT PRO service, you confirm that:

• You are at least 13 years of age
• You have read and understood these Terms
• You agree to comply with all applicable laws
• If using on behalf of an organization, you have authority to bind that organization
              `,
            },
            {
              num: '2',
              title: 'Use of Services',
              content: `
**Permitted Use:**
You may use TOOLVAULT PRO tools for personal, educational, and commercial projects.

**Prohibited Use:**
You must NOT use our services to:

• Generate illegal, harmful, or offensive content
• Violate intellectual property rights
• Spam, phish, or conduct fraudulent activities
• Attempt to breach our security systems
• Scrape or mass-download content
• Use automated bots without permission
• Resell or redistribute our tools as your own
• Generate content that promotes violence or discrimination
              `,
            },
            {
              num: '3',
              title: 'User Accounts',
              content: `
• You are responsible for maintaining the confidentiality of your account
• You must provide accurate and complete information
• One account per person — multiple accounts may be suspended
• You must notify us immediately of any unauthorized account access
• We reserve the right to suspend or terminate accounts that violate these terms

Username Requirements:
• 3-30 characters
• Letters, numbers, and underscores only
• No impersonation of other users or brands
              `,
            },
            {
              num: '4',
              title: 'AI-Generated Content',
              content: `
Regarding content generated using our AI tools:

• You own the output generated through your prompts
• You are responsible for how you use AI-generated content
• We do not guarantee accuracy of AI outputs
• AI content should be reviewed before professional use
• We store prompts temporarily to improve our service
• Do not input sensitive personal data into AI prompts

TOOLVAULT PRO is not liable for decisions made based on AI-generated content.
              `,
            },
            {
              num: '5',
              title: 'Credits System',
              content: `
• Free users receive 20 AI credits daily, resetting at midnight PKT
• Bonus credits can be earned through referrals
• Credits have no monetary value and cannot be transferred
• Unused daily credits expire at midnight — they do not accumulate
• We reserve the right to modify credit amounts with notice
• Credit abuse or manipulation will result in account suspension
              `,
            },
            {
              num: '6',
              title: 'Intellectual Property',
              content: `
**Our Content:**
TOOLVAULT PRO, its logo, design, and underlying technology are owned by us and protected by intellectual property laws.

**Your Content:**
You retain ownership of content you upload or create. By using our service, you grant us a limited license to process your content solely to provide the requested service.

**Third-Party Content:**
You must not upload content that infringes third-party intellectual property rights.
              `,
            },
            {
              num: '7',
              title: 'Advertisements',
              content: `
• Our service is free and supported by Monetag advertisements
• Ad content is provided by third-party networks
• We are not responsible for advertiser content
• Ad-blocking may limit some functionality
• By using our service, you accept that ads will be displayed
              `,
            },
            {
              num: '8',
              title: 'Disclaimer of Warranties',
              content: `
TOOLVAULT PRO is provided "as is" without warranties of any kind. We do not warrant that:

• The service will be uninterrupted or error-free
• Results will be accurate or reliable
• The service will meet your specific requirements

We are not responsible for any data loss. Always keep backups of important work.
              `,
            },
            {
              num: '9',
              title: 'Limitation of Liability',
              content: `
To the maximum extent permitted by law, TOOLVAULT PRO shall not be liable for:

• Indirect, incidental, or consequential damages
• Loss of data or profits
• Service interruptions
• Third-party actions or content

Our total liability shall not exceed PKR 0 (as the service is free).
              `,
            },
            {
              num: '10',
              title: 'Termination',
              content: `
We may suspend or terminate your account if you:

• Violate these Terms of Service
• Engage in fraudulent or abusive behavior
• Misuse the credit or referral system
• Attempt to harm other users

You may delete your account at any time from Profile Settings. Account deletion is permanent and cannot be undone.
              `,
            },
            {
              num: '11',
              title: 'Changes to Terms',
              content: `
We reserve the right to modify these terms at any time. We will provide notice of significant changes via:

• In-app announcement banner
• Account notification

Continued use after changes constitutes acceptance. If you do not agree to updated terms, please delete your account.
              `,
            },
            {
              num: '12',
              title: 'Governing Law',
              content: `
These Terms are governed by the laws of Pakistan. Any disputes shall be resolved through good-faith negotiation first, and if unresolved, through appropriate legal channels in Lahore, Pakistan.

For any questions regarding these Terms, contact us through the WhatsApp support button on our website.
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
