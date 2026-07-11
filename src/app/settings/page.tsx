import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { SettingsClient } from '@/components/settings/SettingsClient'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Settings', robots: { index: false, follow: false } }

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/login')

  const [user, prefs] = await Promise.all([
    prisma.user.findUnique({
      where:   { id: session.user.id },
      select:  { name: true, email: true, firm: true, phone: true, barNumber: true, title: true },
    }),
    prisma.notificationPreference.findUnique({ where: { userId: session.user.id } }),
  ])

  if (!user) redirect('/login')

  return (
    <SettingsClient
      initialUser={user}
      initialPrefs={prefs ?? {
        rfe: true, deadline: true, approval: true,
        regulatory: true, client: true, weekly: false,
        emailEnabled: true, inAppEnabled: true,
      }}
    />
  )
}
