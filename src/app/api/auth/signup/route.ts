import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { sanitizeUserText } from '@/lib/sanitize'
import { rateLimit, rateLimitHeaders } from '@/lib/rateLimit'

const signupSchema = z.object({
  email:          z.string().email('Valid email required'),
  password:       z.string().min(8, 'Password must be at least 8 characters').max(128),
  name:           z.string().min(2, 'Name must be at least 2 characters').max(100),
  firm:           z.string().max(100).optional(),
  organizationId: z.string().uuid().optional(),
})

export async function POST(req: NextRequest) {
  // Rate limit: 5 signups / hour per IP
  const rl = rateLimit({ req, key: 'signup', limit: 5, windowMs: 60 * 60 * 1000 })
  if (rl.limited) {
    return NextResponse.json(
      { error: 'Too many signup attempts. Please try again later.' },
      { status: 429, headers: rateLimitHeaders(rl) }
    )
  }

  try {
    const formData = await req.formData()
    const raw = {
      email:          String(formData.get('email') ?? '').toLowerCase().trim(),
      password:       String(formData.get('password') ?? ''),
      name:           String(formData.get('name') ?? ''),
      firm:           String(formData.get('firm') ?? '') || undefined,
      organizationId: String(formData.get('organizationId') ?? '') || undefined,
    }

    const parsed = signupSchema.safeParse(raw)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } })
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 })
    }

    const hashed = await bcrypt.hash(parsed.data.password, 12)
    await prisma.user.create({
      data: {
        email:          parsed.data.email,
        password:       hashed,
        name:           sanitizeUserText(parsed.data.name),
        firm:           parsed.data.firm ? sanitizeUserText(parsed.data.firm) : null,
        organizationId: parsed.data.organizationId ?? null,
        role:           'attorney',
      },
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Signup error:', err)
    return NextResponse.json({ error: 'Sign up failed' }, { status: 500 })
  }
}
