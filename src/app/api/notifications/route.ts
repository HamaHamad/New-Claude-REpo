import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getRecentNotifications, getUnreadCount } from '@/lib/notifications'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const limit = Math.min(Number(req.nextUrl.searchParams.get('limit') ?? '20'), 50)

  const [notifications, unreadCount] = await Promise.all([
    getRecentNotifications(session.user.id, limit),
    getUnreadCount(session.user.id),
  ])

  return NextResponse.json({ notifications, unreadCount })
}
