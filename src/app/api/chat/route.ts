import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { v4 as uuidv4 } from 'uuid'
import {
  buildSystemPrompt, generateDemoResponse, SUPPORTED_LANGUAGES,
  WELCOME_MESSAGES, extractIntakeFromMessages,
  type LanguageCode,
} from '@/lib/chatEngine'
import { rateLimit, rateLimitHeaders } from '@/lib/rateLimit'
import { sanitizeUserText } from '@/lib/sanitize'
import type { ChatMessage, IntakeData } from '@/types/prisma'

const ANTHROPIC_API = 'https://api.anthropic.com/v1/messages'

const SUPPORTED_LANG_CODES = Object.keys(SUPPORTED_LANGUAGES) as [LanguageCode, ...LanguageCode[]]

const chatSchema = z.object({
  sessionId: z.string().uuid().optional(),
  message:   z.string().min(1, 'Message is required').max(8_000, 'Message too long (max 8000 chars)'),
  language:  z.enum(SUPPORTED_LANG_CODES).default('en'),
  caseId:    z.string().uuid().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // ── Rate limit: 30 messages / 5 min per IP (anonymous OR authenticated) ──
    const userId = session?.user?.id
    const rlKey = userId ? `chat:${userId}` : 'chat:anon'
    const rl = rateLimit({ req, key: rlKey, limit: 30, windowMs: 5 * 60 * 1000 })
    if (rl.limited) {
      return NextResponse.json(
        { error: 'Too many messages. Please slow down.' },
        { status: 429, headers: rateLimitHeaders(rl) }
      )
    }

    const raw = await req.json().catch(() => ({}))
    const parsed = chatSchema.safeParse(raw)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? 'Invalid request' },
        { status: 400 }
      )
    }
    const { sessionId, language, caseId } = parsed.data
    const message = sanitizeUserText(parsed.data.message)
    if (!message.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // ── Get or create session ────────────────────────────────
    let session_rec = sessionId
      ? await prisma.chatSession.findUnique({ where: { id: sessionId } })
      : null

    if (session_rec && userId && session_rec.userId && session_rec.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (!session_rec) {
      session_rec = await prisma.chatSession.create({
        data: {
          userId:     userId ?? null,
          caseId:     caseId ?? null,
          language,
          messages:   '[]',
          intakeData: '{}',
        },
      })
    }

    // Parse stored messages and intake
    const messages: ChatMessage[] = JSON.parse(session_rec.messages)
    const intakeData: IntakeData  = JSON.parse(session_rec.intakeData)

    // Add user message
    const userMsg: ChatMessage = {
      id:        uuidv4(),
      role:      'user',
      content:   message,
      contentEn: message, // assume English input for now; could translate if needed
      timestamp: new Date().toISOString(),
    }
    messages.push(userMsg)

    // ── Build AI conversation history ────────────────────────
    const apiKey      = process.env.ANTHROPIC_API_KEY
    let assistantText = ''
    let aiSource: 'ai' | 'demo' = 'demo'

    if (apiKey) {
      // Real AI response
      const systemPrompt = buildSystemPrompt(language as LanguageCode, intakeData)

      // Build messages for Anthropic API (using English content for continuity)
      const apiMessages = messages.slice(-20).map(m => ({
        role:    m.role === 'assistant' ? 'assistant' : 'user',
        content: m.contentEn || m.content,
      }))

      const res = await fetch(ANTHROPIC_API, {
        method: 'POST',
        headers: {
          'Content-Type':       'application/json',
          'x-api-key':          apiKey,
          'anthropic-version':  '2023-06-01',
        },
        body: JSON.stringify({
          model:      'claude-sonnet-4-20250514',
          max_tokens: 1024,
          system:     systemPrompt,
          messages:   apiMessages,
        }),
      })

      if (res.ok) {
        const data      = await res.json()
        assistantText = data.content?.[0]?.text?.trim() ?? ''
        aiSource = 'ai'
      } else {
        assistantText = generateDemoResponse(message, language as LanguageCode, intakeData)
      }
    } else {
      // Demo fallback
      assistantText = generateDemoResponse(message, language as LanguageCode, intakeData)
    }

    // Add assistant message
    const assistantMsg: ChatMessage = {
      id:        uuidv4(),
      role:      'assistant',
      content:   assistantText,
      contentEn: assistantText,
      timestamp: new Date().toISOString(),
    }
    messages.push(assistantMsg)

    // Extract any intake data from the conversation
    const updatedIntake = extractIntakeFromMessages(messages, intakeData)

    // Auto-generate session title from first user message
    const title = session_rec.title ?? message.slice(0, 60)

    // Save updated session
    await prisma.chatSession.update({
      where: { id: session_rec.id },
      data: {
        messages:   JSON.stringify(messages),
        intakeData: JSON.stringify(updatedIntake),
        language,
        title,
        updatedAt:  new Date(),
      },
    })

    return NextResponse.json({
      sessionId: session_rec.id,
      message:   assistantMsg,
      intakeData: updatedIntake,
      source:    aiSource,
    })
  } catch (err: any) {
    console.error('Chat error:', err)
    return NextResponse.json({ error: 'Chat failed' }, { status: 500 })
  }
}

// ── Start new session (GET welcome message) ──────────────────
export async function GET(req: NextRequest) {
  // Rate limit session creation too
  const rl = rateLimit({ req, key: 'chat-init', limit: 20, windowMs: 5 * 60 * 1000 })
  if (rl.limited) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: rateLimitHeaders(rl) }
    )
  }

  const language = (req.nextUrl.searchParams.get('language') ?? 'en') as LanguageCode
  if (!SUPPORTED_LANGUAGES[language]) {
    return NextResponse.json({ error: 'Unsupported language' }, { status: 400 })
  }
  const session  = await getServerSession(authOptions)
  const caseId   = req.nextUrl.searchParams.get('caseId')
  const validCaseId = caseId && /^[0-9a-f-]{36}$/i.test(caseId) ? caseId : null

  const welcome: ChatMessage = {
    id:        uuidv4(),
    role:      'assistant',
    content:   WELCOME_MESSAGES[language] ?? WELCOME_MESSAGES.en,
    contentEn: WELCOME_MESSAGES.en,
    timestamp: new Date().toISOString(),
  }

  // Create session
  const chatSession = await prisma.chatSession.create({
    data: {
      userId:     session?.user?.id ?? null,
      caseId:     validCaseId,
      language,
      messages:   JSON.stringify([welcome]),
      intakeData: '{}',
    },
  })

  return NextResponse.json({
    sessionId: chatSession.id,
    message:   welcome,
  })
}
