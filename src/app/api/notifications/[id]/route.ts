import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import {
  markNotificationRead,
  markAllNotificationsRead,
  dismissNotification,
} from '@/lib/notifications'

const patchSchema = z.object({
  action: z.enum(['read', 'read_all', 'dismiss']),
  id:     z.string().uuid().optional(),
})

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const parsed = patchSchema.safeParse(await req.json().catch(() => ({})))
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { action, id } = parsed.data

  if (action === 'read_all') {
    await markAllNotificationsRead(session.user.id)
    return NextResponse.json({ success: true })
  }
  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 })
  }
  if (action === 'read') {
    await markNotificationRead(id, session.user.id)
  } else if (action === 'dismiss') {
    await dismissNotification(id, session.user.id)
  }
  return NextResponse.json({ success: true })
}
