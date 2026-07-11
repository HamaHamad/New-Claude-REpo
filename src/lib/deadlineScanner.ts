/**
 * Deadline reminder scanner — runs via Vercel cron alongside /api/regulatory/fetch.
 * Finds upcoming deadlines within their alert window and creates notifications for case owners.
 *
 * Idempotent: uses the existence of a same-day, same-case, same-type notification
 * to avoid spamming users.
 */

import { prisma } from '@/lib/prisma'
import { createNotification } from '@/lib/notifications'

export async function scanDeadlines() {
  const now = new Date()
  const inSevenDays = new Date(now.getTime() + 7 * 86_400_000)

  // Find incomplete deadlines due within 7 days
  const upcoming = await prisma.deadlineEvent.findMany({
    where: {
      completed: false,
      dueDate:  { gte: now, lte: inSevenDays },
    },
    include: {
      case: { select: { id: true, userId: true, applicantName: true } },
    },
  })

  let notified = 0
  for (const dl of upcoming) {
    const daysLeft = Math.ceil((dl.dueDate.getTime() - now.getTime()) / 86_400_000)

    // Only fire on key milestones: 30, 14, 7, 3, 1 (or past due)
    const milestones = [30, 14, 7, 3, 1, 0]
    if (!milestones.includes(daysLeft)) continue

    // Idempotency: skip if a deadline notification for this case+type already exists today
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const existing = await prisma.notification.findFirst({
      where: {
        userId:   dl.case.userId,
        caseId:   dl.case.id,
        type:     'deadline',
        title:    { contains: dl.title },
        createdAt: { gte: todayStart },
      },
      select: { id: true },
    })
    if (existing) continue

    const title = daysLeft === 0
      ? `Deadline today: ${dl.title}`
      : daysLeft < 0
        ? `Deadline overdue: ${dl.title}`
        : `Deadline in ${daysLeft}d: ${dl.title}`

    await createNotification({
      userId:  dl.case.userId,
      caseId:  dl.case.id,
      type:    'deadline',
      title,
      body:    `${dl.title} for ${dl.case.applicantName} is due ${dl.dueDate.toLocaleDateString()}. ${dl.description ?? ''}`.trim(),
      link:    `/case/${dl.case.id}`,
    }).catch(err => console.warn('Deadline notification failed:', err))

    notified++
  }

  return { scanned: upcoming.length, notified }
}
