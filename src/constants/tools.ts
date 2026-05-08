// ============================================
// TOOLVAULT PRO — TOOLS REGISTRY
// ============================================
import type { Tool, ToolCategory } from '@/types'

// ============================================
// ALL TOOLS
// ============================================
export const ALL_TOOLS: Tool[] = [

  // ==========================================
  // AI WRITING TOOLS
  // ==========================================
  {
    slug: 'ai-writer',
    name: 'AI Article Writer',
    nameUr: 'اے آئی مضمون نویس',
    description: 'Generate SEO-friendly articles instantly',
    descriptionUr: 'فوری طور پر SEO دوست مضامین بنائیں',
    category: 'ai-writing',
    icon: '✍️',
    color: '#3B82F6',
    isNew: false,
    isPopular: true,
    usageCount: 0,
  },
  {
    slug: 'email-writer',
    name: 'AI Email Writer',
    nameUr: 'اے آئی ای میل رائٹر',
    description: 'Write professional emails in seconds',
    descriptionUr: 'سیکنڈوں میں پیشہ ورانہ ای میل لکھیں',
    category: 'ai-writing',
    icon: '📧',
    color: '#8B5CF6',
    isNew: false,
    isPopular: true,
    usageCount: 0,
  },
  {
    slug: 'bio-generator',
    name: 'AI Bio Generator',
    nameUr: 'اے آئی بائیو جنریٹر',
    description: 'Create compelling professional bios',
    descriptionUr: 'پیشہ ورانہ بائیو بنائیں',
    category: 'ai-writing',
    icon: '👤',
    color: '#06B6D4',
    isNew: false,
    isPopular: false,
    usageCount: 0,
  },
  {
    slug: 'caption-maker',
    name: 'AI Caption Maker',
    nameUr: 'اے آئی کیپشن میکر',
    description: 'Generate viral social media captions',
    descriptionUr: 'وائرل سوشل میڈیا کیپشن بنائیں',
    category: 'ai-writing',
    icon: '📱',
    color: '#F59E0B',
    isNew: true,
    isPopular: true,
    usageCount: 0,
  },
  {
    slug: 'paraphraser',
    name: 'AI Paraphraser',
    nameUr: 'اے آئی پیرافریزر',
    description: 'Rewrite content uniquely and clearly',
    descriptionUr: 'مواد کو منفرد انداز میں دوبارہ لکھیں',
    category: 'ai-writing',
    icon: '🔄',
    color: '#10B981',
    isNew: false,
    isPopular: false,
    usageCount: 0,
  },

  // ==========================================
  // IMAGE TOOLS
  // ==========================================
  {
    slug: 'bg-remover',
    name: 'Background Remover',
    nameUr: 'بیک گراؤنڈ ریموور',
    description: 'Remove image backgrounds instantly',
    descriptionUr: 'فوری طور پر تصویر کا پس منظر ہٹائیں',
    category: 'image-tools',
    icon: '🖼️',
    color: '#EF4444',
    isNew: false,
    isPopular: true,
    usageCount: 0,
  },
  {
    slug: 'image-compressor',
    name: 'Image Compressor',
    nameUr: 'امیج کمپریسر',
    description: 'Compress images without quality loss',
    descriptionUr: 'معیار کھوئے بغیر تصاویر کمپریس کریں',
    category: 'image-tools',
    icon: '📦',
    color: '#F97316',
    isNew: false,
    isPopular: true,
    usageCount: 0,
  },
  {
    slug: 'image-resizer',
    name: 'Image Resizer',
    nameUr: 'امیج ریسائزر',
    description: 'Resize images to any dimension',
    descriptionUr: 'تصاویر کو کسی بھی سائز میں تبدیل کریں',
    category: 'image-tools',
    icon: '📐',
    color: '#84CC16',
    isNew: false,
    isPopular: false,
    usageCount: 0,
  },
  {
    slug: 'image-converter',
    name: 'Image Converter',
    nameUr: 'امیج کنورٹر',
    description: 'Convert between JPG, PNG, WebP formats',
    descriptionUr: 'JPG، PNG، WebP فارمیٹس کے درمیان تبدیل کریں',
    category: 'image-tools',
    icon: '🔃',
    color: '#6366F1',
    isNew: false,
    isPopular: false,
    usageCount: 0,
  },
  {
    slug: 'watermark-adder',
    name: 'Watermark Adder',
    nameUr: 'واٹر مارک ایڈر',
    description: 'Add watermarks to protect your images',
    descriptionUr: 'اپنی تصاویر کو محفوظ کرنے کے لیے واٹر مارک لگائیں',
    category: 'image-tools',
    icon: '💧',
    color: '#0EA5E9',
    isNew: true,
    isPopular: false,
    usageCount: 0,
  },

  // ==========================================
  // SEO TOOLS
  // ==========================================
  {
    slug: 'meta-generator',
    name: 'Meta Tag Generator',
    nameUr: 'میٹا ٹیگ جنریٹر',
    description: 'Generate SEO-optimized meta tags',
    descriptionUr: 'SEO کے لیے بہترین میٹا ٹیگز بنائیں',
    category: 'seo-tools',
    icon: '🏷️',
    color: '#1E3A8A',
    isNew: false,
    isPopular: true,
    usageCount: 0,
  },
  {
    slug: 'keyword-density',
    name: 'Keyword Density Checker',
    nameUr: 'کی ورڈ ڈینسٹی چیکر',
    description: 'Analyze keyword usage in your content',
    descriptionUr: 'اپنے مواد میں کی ورڈ استعمال کا تجزیہ کریں',
    category: 'seo-tools',
    icon: '🔑',
    color: '#7C3AED',
    isNew: false,
    isPopular: false,
    usageCount: 0,
  },
  {
    slug: 'word-counter',
    name: 'Word Counter',
    nameUr: 'ورڈ کاؤنٹر',
    description: 'Count words, characters and reading time',
    descriptionUr: 'الفاظ، حروف اور پڑھنے کا وقت گنیں',
    category: 'seo-tools',
    icon: '🔢',
    color: '#059669',
    isNew: false,
    isPopular: true,
    usageCount: 0,
  },
  {
    slug: 'readability-checker',
    name: 'Readability Checker',
    nameUr: 'ریڈیبلٹی چیکر',
    description: 'Check content readability score',
    descriptionUr: 'مواد کی پڑھنے کی آسانی کا اسکور چیک کریں',
    category: 'seo-tools',
    icon: '📊',
    color: '#DC2626',
    isNew: true,
    isPopular: false,
    usageCount: 0,
  },
  {
    slug: 'plagiarism-checker',
    name: 'Plagiarism Checker',
    nameUr: 'سرقہ چیکر',
    description: 'Check content originality instantly',
    descriptionUr: 'فوری طور پر مواد کی اصلیت چیک کریں',
    category: 'seo-tools',
    icon: '🔍',
    color: '#B45309',
    isNew: false,
    isPopular: true,
    usageCount: 0,
  },

  // ==========================================
  // PDF TOOLS
  // ==========================================
  {
    slug: 'pdf-merger',
    name: 'PDF Merger',
    nameUr: 'پی ڈی ایف مرجر',
    description: 'Merge multiple PDFs into one file',
    descriptionUr: 'متعدد PDF فائلوں کو ایک میں ملائیں',
    category: 'pdf-tools',
    icon: '📄',
    color: '#DC2626',
    isNew: false,
    isPopular: true,
    usageCount: 0,
  },
  {
    slug: 'pdf-splitter',
    name: 'PDF Splitter',
    nameUr: 'پی ڈی ایف اسپلٹر',
    description: 'Split PDF into separate pages',
    descriptionUr: 'PDF کو الگ صفحات میں تقسیم کریں',
    category: 'pdf-tools',
    icon: '✂️',
    color: '#7C3AED',
    isNew: false,
    isPopular: false,
    usageCount: 0,
  },
  {
    slug: 'pdf-to-text',
    name: 'PDF to Text',
    nameUr: 'پی ڈی ایف ٹو ٹیکسٹ',
    description: 'Extract text content from PDF files',
    descriptionUr: 'PDF فائلوں سے متن نکالیں',
    category: 'pdf-tools',
    icon: '📝',
    color: '#0284C7',
    isNew: false,
    isPopular: true,
    usageCount: 0,
  },
  {
    slug: 'pdf-compressor',
    name: 'PDF Compressor',
    nameUr: 'پی ڈی ایف کمپریسر',
    description: 'Reduce PDF file size efficiently',
    descriptionUr: 'PDF فائل کا سائز مؤثر طریقے سے کم کریں',
    category: 'pdf-tools',
    icon: '🗜️',
    color: '#059669',
    isNew: false,
    isPopular: false,
    usageCount: 0,
  },
  {
    slug: 'image-to-pdf',
    name: 'Image to PDF',
    nameUr: 'امیج ٹو پی ڈی ایف',
    description: 'Convert images to PDF format',
    descriptionUr: 'تصاویر کو PDF فارمیٹ میں تبدیل کریں',
    category: 'pdf-tools',
    icon: '🖼️',
    color: '#F59E0B',
    isNew: true,
    isPopular: true,
    usageCount: 0,
  },

  // ==========================================
  // CODE TOOLS
  // ==========================================
  {
    slug: 'code-formatter',
    name: 'Code Formatter',
    nameUr: 'کوڈ فارمیٹر',
    description: 'Format code in any language instantly',
    descriptionUr: 'کسی بھی زبان میں کوڈ فوری فارمیٹ کریں',
    category: 'code-tools',
    icon: '💻',
    color: '#1E3A8A',
    isNew: false,
    isPopular: true,
    usageCount: 0,
  },
  {
    slug: 'json-validator',
    name: 'JSON Validator',
    nameUr: 'JSON ویلیڈیٹر',
    description: 'Validate and format JSON data',
    descriptionUr: 'JSON ڈیٹا کی تصدیق اور فارمیٹنگ کریں',
    category: 'code-tools',
    icon: '{ }',
    color: '#F59E0B',
    isNew: false,
    isPopular: true,
    usageCount: 0,
  },
  {
    slug: 'base64-encoder',
    name: 'Base64 Encoder',
    nameUr: 'Base64 انکوڈر',
    description: 'Encode and decode Base64 strings',
    descriptionUr: 'Base64 سٹرنگز انکوڈ اور ڈیکوڈ کریں',
    category: 'code-tools',
    icon: '🔐',
    color: '#10B981',
    isNew: false,
    isPopular: false,
    usageCount: 0,
  },
  {
    slug: 'regex-tester',
    name: 'Regex Tester',
    nameUr: 'Regex ٹیسٹر',
    description: 'Test and debug regular expressions',
    descriptionUr: 'ریگولر ایکسپریشنز ٹیسٹ اور ڈیبگ کریں',
    category: 'code-tools',
    icon: '🔎',
    color: '#8B5CF6',
    isNew: false,
    isPopular: false,
    usageCount: 0,
  },
  {
    slug: 'color-picker',
    name: 'Color Picker',
    nameUr: 'کلر پکر',
    description: 'Pick colors and get HEX, RGB, HSL codes',
    descriptionUr: 'رنگ منتخب کریں اور HEX، RGB، HSL کوڈ حاصل کریں',
    category: 'code-tools',
    icon: '🎨',
    color: '#EC4899',
    isNew: true,
    isPopular: false,
    usageCount: 0,
  },

  // ==========================================
  // BUSINESS TOOLS
  // ==========================================
  {
    slug: 'invoice-generator',
    name: 'Invoice Generator',
    nameUr: 'انوائس جنریٹر',
    description: 'Create professional invoices instantly',
    descriptionUr: 'فوری طور پر پیشہ ورانہ انوائس بنائیں',
    category: 'business-tools',
    icon: '🧾',
    color: '#1E3A8A',
    isNew: false,
    isPopular: true,
    usageCount: 0,
  },
  {
    slug: 'qr-generator',
    name: 'QR Code Generator',
    nameUr: 'QR کوڈ جنریٹر',
    description: 'Generate QR codes for any content',
    descriptionUr: 'کسی بھی مواد کے لیے QR کوڈ بنائیں',
    category: 'business-tools',
    icon: '📲',
    color: '#0F172A',
    isNew: false,
    isPopular: true,
    usageCount: 0,
  },
  {
    slug: 'password-generator',
    name: 'Password Generator',
    nameUr: 'پاس ورڈ جنریٹر',
    description: 'Generate strong secure passwords',
    descriptionUr: 'مضبوط اور محفوظ پاس ورڈ بنائیں',
    category: 'business-tools',
    icon: '🔑',
    color: '#DC2626',
    isNew: false,
    isPopular: true,
    usageCount: 0,
  },
  {
    slug: 'loan-calculator',
    name: 'Loan Calculator',
    nameUr: 'قرض کیلکولیٹر',
    description: 'Calculate loan EMI and total interest',
    descriptionUr: 'قرض کی EMI اور کل سود حساب کریں',
    category: 'business-tools',
    icon: '💰',
    color: '#059669',
    isNew: false,
    isPopular: false,
    usageCount: 0,
  },
  {
    slug: 'currency-converter',
    name: 'Currency Converter',
    nameUr: 'کرنسی کنورٹر',
    description: 'Convert PKR and world currencies live',
    descriptionUr: 'PKR اور عالمی کرنسیوں کو لائیو تبدیل کریں',
    category: 'business-tools',
    icon: '💱',
    color: '#F59E0B',
    isNew: true,
    isPopular: true,
    usageCount: 0,
  },
]

// ============================================
// CATEGORIES
// ============================================
export const TOOL_CATEGORIES: {
  slug: ToolCategory
  name: string
  nameUr: string
  icon: string
  color: string
  count: number
}[] = [
  {
    slug: 'ai-writing',
    name: 'AI Writing',
    nameUr: 'اے آئی رائٹنگ',
    icon: '✍️',
    color: '#3B82F6',
    count: ALL_TOOLS.filter((t) => t.category === 'ai-writing').length,
  },
  {
    slug: 'image-tools',
    name: 'Image Tools',
    nameUr: 'امیج ٹولز',
    icon: '🖼️',
    color: '#EF4444',
    count: ALL_TOOLS.filter((t) => t.category === 'image-tools').length,
  },
  {
    slug: 'seo-tools',
    name: 'SEO Tools',
    nameUr: 'SEO ٹولز',
    icon: '📈',
    color: '#1E3A8A',
    count: ALL_TOOLS.filter((t) => t.category === 'seo-tools').length,
  },
  {
    slug: 'pdf-tools',
    name: 'PDF Tools',
    nameUr: 'PDF ٹولز',
    icon: '📄',
    color: '#DC2626',
    count: ALL_TOOLS.filter((t) => t.category === 'pdf-tools').length,
  },
  {
    slug: 'code-tools',
    name: 'Code Tools',
    nameUr: 'کوڈ ٹولز',
    icon: '💻',
    color: '#7C3AED',
    count: ALL_TOOLS.filter((t) => t.category === 'code-tools').length,
  },
  {
    slug: 'business-tools',
    name: 'Business Tools',
    nameUr: 'بزنس ٹولز',
    icon: '💼',
    color: '#059669',
    count: ALL_TOOLS.filter((t) => t.category === 'business-tools').length,
  },
]

// ============================================
// HELPERS
// ============================================
export function getToolBySlug(slug: string): Tool | undefined {
  return ALL_TOOLS.find((t) => t.slug === slug)
}

export function getToolsByCategory(category: ToolCategory): Tool[] {
  return ALL_TOOLS.filter((t) => t.category === category)
}

export function getPopularTools(limit: number = 6): Tool[] {
  return ALL_TOOLS.filter((t) => t.isPopular).slice(0, limit)
}

export function getNewTools(limit: number = 4): Tool[] {
  return ALL_TOOLS.filter((t) => t.isNew).slice(0, limit)
}

export function searchTools(query: string): Tool[] {
  const q = query.toLowerCase().trim()
  return ALL_TOOLS.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.category.includes(q)
  )
}

// STATS
export const TOOL_STATS = {
  total: ALL_TOOLS.length,
  categories: TOOL_CATEGORIES.length,
  popular: ALL_TOOLS.filter((t) => t.isPopular).length,
  new: ALL_TOOLS.filter((t) => t.isNew).length,
}
