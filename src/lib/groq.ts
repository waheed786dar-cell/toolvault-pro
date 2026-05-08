// ============================================
// TOOLVAULT PRO — GROQ AI CLIENT
// ============================================
import Groq from 'groq-sdk'
import { serverEnv } from './env'
import type { AIRequest, AIResponse } from '@/types'

// ============================================
// GROQ CLIENT — Singleton
// ============================================
let groqClient: Groq | null = null

function getGroqClient(): Groq {
  if (groqClient) return groqClient
  groqClient = new Groq({
    apiKey: serverEnv.groqApiKey,
  })
  return groqClient
}

// ============================================
// MODELS
// ============================================
export const GROQ_MODELS = {
  DEFAULT: 'llama-3.3-70b-versatile',
  FAST:    'llama-3.1-8b-instant',
  CODE:    'llama-3.3-70b-versatile',
} as const

// ============================================
// TOOL SYSTEM PROMPTS
// ============================================
const SYSTEM_PROMPTS: Record<string, string> = {
  'ai-writer': `You are an expert content writer. Write clear, 
    engaging, and professional content. Return only the 
    written content without any explanation.`,

  'email-writer': `You are an expert email writer. Write 
    professional, clear, and concise emails. Include 
    subject line and body. Return only the email.`,

  'bio-generator': `You are an expert bio writer. Write 
    compelling, professional bios in third person. 
    Return only the bio text.`,

  'caption-maker': `You are a social media expert. Write 
    engaging captions with relevant hashtags. 
    Return only the caption.`,

  'paraphraser': `You are an expert editor. Rewrite the 
    given text to be clearer and more professional 
    while keeping the original meaning. Return only 
    the rewritten text.`,

  'seo-meta': `You are an SEO expert. Generate optimized 
    meta titles and descriptions. Return JSON format:
    {"title": "...", "description": "..."}`,

  'code-explainer': `You are a senior developer. Explain 
    code clearly and concisely. Use simple language.
    Return only the explanation.`,

  'default': `You are a helpful AI assistant for TOOLVAULT PRO.
    Be concise, accurate, and professional.`,
}

// ============================================
// MAIN AI GENERATE FUNCTION
// ============================================
export async function generateAI(
  request: AIRequest
): Promise<AIResponse> {
  const startTime = Date.now()

  try {
    const groq = getGroqClient()
    const systemPrompt =
      SYSTEM_PROMPTS[request.toolName] ?? SYSTEM_PROMPTS['default']

    // Language instruction
    const langInstruction =
      request.language === 'ur'
        ? '\n\nIMPORTANT: Respond in Urdu language.'
        : '\n\nIMPORTANT: Respond in English.'

    const completion = await groq.chat.completions.create({
      model: GROQ_MODELS.DEFAULT,
      max_tokens: request.maxTokens ?? 1000,
      temperature: 0.7,
      top_p: 0.9,
      messages: [
        {
          role: 'system',
          content: systemPrompt + langInstruction,
        },
        {
          role: 'user',
          content: request.prompt,
        },
      ],
    })

    const result = completion.choices[0]?.message?.content ?? ''
    const tokensUsed = completion.usage?.total_tokens ?? 0
    const duration = Date.now() - startTime

    return {
      success: true,
      result,
      tokensUsed,
      duration,
    }
  } catch (error) {
    const duration = Date.now() - startTime
    console.error('Groq AI error:', error)

    return {
      success: false,
      error: error instanceof Error
        ? error.message
        : 'AI generation failed',
      duration,
    }
  }
}

// ============================================
// STREAMING AI (for long content)
// ============================================
export async function generateAIStream(
  request: AIRequest
): Promise<ReadableStream> {
  const groq = getGroqClient()
  const systemPrompt =
    SYSTEM_PROMPTS[request.toolName] ?? SYSTEM_PROMPTS['default']

  const stream = await groq.chat.completions.create({
    model: GROQ_MODELS.DEFAULT,
    max_tokens: request.maxTokens ?? 2000,
    temperature: 0.7,
    stream: true,
    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: request.prompt,
      },
    ],
  })

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content ?? ''
          if (text) {
            controller.enqueue(new TextEncoder().encode(text))
          }
        }
        controller.close()
      } catch (error) {
        controller.error(error)
      }
    },
  })
}

// ============================================
// SPECIFIC TOOL FUNCTIONS
// ============================================

// Article Writer
export async function generateArticle(
  topic: string,
  language: 'en' | 'ur' = 'en'
): Promise<AIResponse> {
  return generateAI({
    prompt: `Write a comprehensive, SEO-friendly article about: ${topic}`,
    toolName: 'ai-writer',
    language,
    maxTokens: 2000,
  })
}

// Email Writer
export async function generateEmail(
  context: string,
  language: 'en' | 'ur' = 'en'
): Promise<AIResponse> {
  return generateAI({
    prompt: `Write a professional email for: ${context}`,
    toolName: 'email-writer',
    language,
    maxTokens: 800,
  })
}

// Bio Generator
export async function generateBio(
  details: string,
  language: 'en' | 'ur' = 'en'
): Promise<AIResponse> {
  return generateAI({
    prompt: `Generate a professional bio for: ${details}`,
    toolName: 'bio-generator',
    language,
    maxTokens: 400,
  })
}

// Caption Maker
export async function generateCaption(
  context: string,
  platform: string = 'instagram',
  language: 'en' | 'ur' = 'en'
): Promise<AIResponse> {
  return generateAI({
    prompt: `Write a ${platform} caption for: ${context}`,
    toolName: 'caption-maker',
    language,
    maxTokens: 300,
  })
}

// Paraphraser
export async function paraphraseText(
  text: string,
  language: 'en' | 'ur' = 'en'
): Promise<AIResponse> {
  return generateAI({
    prompt: `Paraphrase this text: ${text}`,
    toolName: 'paraphraser',
    language,
    maxTokens: text.length * 2,
  })
}

// SEO Meta Generator
export async function generateSEOMeta(
  pageContent: string
): Promise<AIResponse> {
  return generateAI({
    prompt: `Generate SEO meta tags for: ${pageContent}`,
    toolName: 'seo-meta',
    language: 'en',
    maxTokens: 300,
  })
}
