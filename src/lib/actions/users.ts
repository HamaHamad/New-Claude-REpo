'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sanitizeUserText } from '@/lib/sanitize'

async function requireAuth() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/login')
  return session.user
}

// ─────────────────────────────────────────────────────────────
// signup()
// ─────────────────────────────────────────────────────────────
const signupSchema = z.object({
  email:           z.string().email('Valid email required'),
  password:        z.string().min(8, 'Password must be at least 8 characters').max(128),
  name:            z.string().min(2, 'Name must be at least 2 characters').max(100),
  firm:            z.string().max(100).optional(),
  organizationId:  z.string().uuid().optional(),
})

export async function signup(formData: FormData) {
  const raw = {
    email:          String(formData.get('email') ?? '').toLowerCase().trim(),
    password:       String(formData.get('password') ?? ''),
    name:           String(formData.get('name') ?? ''),
    firm:           String(formData.get('firm') ?? '') || undefined,
    organizationId: String(formData.get('organizationId') ?? '') || undefined,
  }
  const parsed = signupSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message }
  }

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } })
  if (existing) {
    return { success: false, error: 'An account with this email already exists' }
  }

  const hashed = await bcrypt.hash(parsed.data.password, 12)
  await prisma.user.create({
    data: {
      email:           parsed.data.email,
      password:        hashed,
      name:            sanitizeUserText(parsed.data.name),
      firm:            parsed.data.firm ? sanitizeUserText(parsed.data.firm) : null,
      organizationId:  parsed.data.organizationId ?? null,
      role:            'attorney',
    },
  })

  // Create default notification preferences
  // (will be created lazily on first read if not done here)
  redirect('/login?registered=1')
}

// ─────────────────────────────────────────────────────────────
// requestPasswordReset()
// ─────────────────────────────────────────────────────────────
export async function requestPasswordReset(email: string) {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } })
  if (!user) {
    // Don't reveal whether the email exists — return success
    return { success: true }
  }

  // Generate a one-time token (32 bytes hex) + expiry (1 hour)
  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

  // Store token as a User field — we use a JSON column on a dedicated model
  // For simplicity, store in the `firm` field prefixed with `reset:` (no — use proper table)
  // Actually, we'll use a lightweight approach: store the token hash in the user's `barNumber` field
  // is not clean. Instead, create a PasswordReset record inline.
  // Since we don't have a model, we'll embed the token in a Notification with type='system'
  // ... Better: skip DB storage and email a one-time magic link valid for 1 hour
  // encoded as JWT-like signed token.
  const secret = process.env.NEXTAUTH_SECRET || 'fallback-dev-secret'
  const signed = `${user.id}.${expiresAt.getTime()}.${crypto
    .createHmac('sha256', secret)
    .update(`${user.id}.${expiresAt.getTime()}.${token}`)
    .digest('hex')}`

  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || ''}/reset-password?token=${encodeURIComponent(signed)}`
  console.log(`[password-reset] Requested for ${user.email}. Reset URL: ${resetUrl}`)

  // TODO: send email with resetUrl once SMTP is configured
  // For now, log it in dev mode

  return { success: true }
}

// ─────────────────────────────────────────────────────────────
// updateProfile()
// ─────────────────────────────────────────────────────────────
const profileSchema = z.object({
  name:       z.string().min(2).max(100).optional(),
  firm:       z.string().max(100).optional(),
  phone:      z.string().max(32).optional(),
  barNumber:  z.string().max(64).optional(),
  title:      z.string().max(100).optional(),
})

export async function updateProfile(formData: FormData) {
  const user = await requireAuth()
  const raw = {
    name:      String(formData.get('name') ?? '') || undefined,
    firm:      String(formData.get('firm') ?? '') || undefined,
    phone:     String(formData.get('phone') ?? '') || undefined,
    barNumber: String(formData.get('barNumber') ?? '') || undefined,
    title:     String(formData.get('title') ?? '') || undefined,
  }
  const parsed = profileSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message }
  }

  const data: Record<string, string | null> = {}
  if (parsed.data.name      !== undefined) data.name      = sanitizeUserText(parsed.data.name)
  if (parsed.data.firm      !== undefined) data.firm      = sanitizeUserText(parsed.data.firm) || null
  if (parsed.data.phone     !== undefined) data.phone     = sanitizeUserText(parsed.data.phone) || null
  if (parsed.data.barNumber !== undefined) data.barNumber = sanitizeUserText(parsed.data.barNumber) || null
  if (parsed.data.title     !== undefined) data.title     = sanitizeUserText(parsed.data.title) || null

  await prisma.user.update({ where: { id: user.id }, data })

  revalidatePath('/settings')
  return { success: true }
}

// ─────────────────────────────────────────────────────────────
// changePassword()
// ─────────────────────────────────────────────────────────────
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword:     z.string().min(8, 'New password must be at least 8 characters').max(128),
})

export async function changePassword(formData: FormData) {
  const user = await requireAuth()
  const raw = {
    currentPassword: String(formData.get('currentPassword') ?? ''),
    newPassword:     String(formData.get('newPassword') ?? ''),
  }
  const parsed = changePasswordSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message }
  }

  const dbUser = await prisma.user.findUnique({ where: { id: user.id }, select: { password: true } })
  if (!dbUser) return { success: false, error: 'User not found' }

  const valid = await bcrypt.compare(parsed.data.currentPassword, dbUser.password)
  if (!valid) return { success: false, error: 'Current password is incorrect' }

  const hashed = await bcrypt.hash(parsed.data.newPassword, 12)
  await prisma.user.update({ where: { id: user.id }, data: { password: hashed } })

  return { success: true }
}

// ─────────────────────────────────────────────────────────────
// updateNotificationPreferences()
// ─────────────────────────────────────────────────────────────
const notifPrefsSchema = z.object({
  rfe:          z.boolean().optional(),
  deadline:     z.boolean().optional(),
  approval:     z.boolean().optional(),
  regulatory:   z.boolean().optional(),
  client:       z.boolean().optional(),
  weekly:       z.boolean().optional(),
  emailEnabled: z.boolean().optional(),
  inAppEnabled: z.boolean().optional(),
})

export async function updateNotificationPreferences(prefs: z.infer<typeof notifPrefsSchema>) {
  const user = await requireAuth()
  const parsed = notifPrefsSchema.safeParse(prefs)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message }
  }

  await prisma.notificationPreference.upsert({
    where:  { userId: user.id },
    create: { userId: user.id, ...parsed.data },
    update: parsed.data,
  })

  revalidatePath('/settings')
  return { success: true }
}

// ─────────────────────────────────────────────────────────────
// getNotificationPreferences()
// ─────────────────────────────────────────────────────────────
export async function getNotificationPreferences() {
  const user = await requireAuth()
  const prefs = await prisma.notificationPreference.findUnique({ where: { userId: user.id } })
  return prefs ?? {
    rfe: true, deadline: true, approval: true,
    regulatory: true, client: true, weekly: false,
    emailEnabled: true, inAppEnabled: true,
  }
}

// ─────────────────────────────────────────────────────────────
// getTeamMembers() — for org admins
// ─────────────────────────────────────────────────────────────
export async function getTeamMembers() {
  const user = await requireAuth()
  if (user.role !== 'corporate_admin' || !user.organizationId) {
    return []
  }
  return prisma.user.findMany({
    where:   { organizationId: user.organizationId },
    select:  { id: true, name: true, email: true, role: true, title: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  })
}
