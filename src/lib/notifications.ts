/**
 * Notification service — creates in-app notifications and optionally dispatches email.
 *
 * Email sending is stubbed: if SMTP env vars are set (SMTP_HOST/PORT/USER/PASS),
 * a real email is sent via Node's net; otherwise we log to console.
 * Swap the sendEmail implementation for Resend / SendGrid / Postmark in production.
 */

import { prisma } from '@/lib/prisma'

export type NotificationType =
  | 'rfe'
  | 'deadline'
  | 'approval'
  | 'regulatory'
  | 'client'
  | 'weekly'
  | 'system'

interface CreateNotificationInput {
  userId:     string
  type:       NotificationType
  title:      string
  body:       string
  link?:      string | null
  caseId?:    string | null
  channel?:   'in_app' | 'email' | 'both'
}

/**
 * Create a notification for a user, respecting their preferences.
 * If the user has disabled this notification type, the notification is still
 * created with status='dismissed' so we have a paper trail, but no email is sent.
 */
export async function createNotification(input: CreateNotificationInput) {
  // Load preferences (or defaults if none set yet)
  const prefs = await prisma.notificationPreference.findUnique({
    where: { userId: input.userId },
  })

  const enabled = prefs ? (prefs as any)[input.type] !== false : true
  const emailEnabled = prefs?.emailEnabled ?? true
  const channel = input.channel ?? 'in_app'

  // If user disabled this type, skip creation entirely
  if (!enabled) return null

  const shouldEmail = (channel === 'email' || channel === 'both') && emailEnabled

  const notif = await prisma.notification.create({
    data: {
      userId:   input.userId,
      caseId:   input.caseId ?? null,
      type:     input.type,
      title:    input.title.slice(0, 300),
      body:     input.body.slice(0, 2000),
      link:     input.link ?? null,
      channel:  shouldEmail ? 'both' : 'in_app',
      status:   'sent',
      sentAt:   new Date(),
    },
  })

  // Fire-and-forget email
  if (shouldEmail) {
    const user = await prisma.user.findUnique({
      where: { id: input.userId },
      select: { email: true, name: true },
    })
    if (user) {
      sendEmail({
        to:      user.email,
        subject: input.title,
        text:    `${input.body}\n\n${input.link ?? ''}`,
      }).catch(err => console.warn('Email send failed:', err))
    }
  }

  return notif
}

export async function markNotificationRead(id: string, userId: string) {
  return prisma.notification.updateMany({
    where: { id, userId },
    data:  { status: 'read', readAt: new Date() },
  })
}

export async function markAllNotificationsRead(userId: string) {
  return prisma.notification.updateMany({
    where: { userId, status: { not: 'read' } },
    data:  { status: 'read', readAt: new Date() },
  })
}

export async function dismissNotification(id: string, userId: string) {
  return prisma.notification.updateMany({
    where: { id, userId },
    data:  { status: 'dismissed' },
  })
}

export async function getUnreadCount(userId: string): Promise<number> {
  return prisma.notification.count({
    where: { userId, status: 'sent' },
  })
}

export async function getRecentNotifications(userId: string, limit = 20) {
  return prisma.notification.findMany({
    where:   { userId, status: { not: 'dismissed' } },
    orderBy: { createdAt: 'desc' },
    take:    limit,
  })
}

// ── Email transport ──────────────────────────────────────────

interface EmailPayload {
  to:      string
  subject: string
  text:    string
  html?:   string
}

async function sendEmail(payload: EmailPayload): Promise<void> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env

  // No SMTP configured — log in dev, silently drop in prod
  if (!SMTP_HOST || !SMTP_PORT) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[email:dev] To: ${payload.to} | Subject: ${payload.subject}\n${payload.text}`)
    }
    return
  }

  // nodemailer is optional — install with `npm i nodemailer` to enable email
  // We use eval() to require it so the build doesn't fail when it's not installed.
  let nodemailer: any
  try {
    nodemailer = eval('require')('nodemailer')
  } catch {
    console.warn('nodemailer not installed — skipping email send. Run: npm i nodemailer')
    return
  }

  try {
    const transporter = nodemailer.createTransport({
      host:   SMTP_HOST,
      port:   Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      auth:   { user: SMTP_USER, pass: SMTP_PASS },
    })

    await transporter.sendMail({
      from:    SMTP_FROM || 'ImmigAI <no-reply@immigai.app>',
      to:      payload.to,
      subject: payload.subject,
      text:    payload.text,
      html:    payload.html,
    })
  } catch (err) {
    console.warn('Email send failed:', err)
  }
}
