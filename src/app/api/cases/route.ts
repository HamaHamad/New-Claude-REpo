import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const STATUS_MAP: Record<string, string> = {
  Active:       'active',
  Submitted:    'submitted',
  'RFE Received': 'rfe_received',
  Approved:     'approved',
  Denied:       'denied',
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const q         = (req.nextUrl.searchParams.get('q') ?? '').trim()
  const statusRaw = req.nextUrl.searchParams.get('status') ?? 'All'
  const page      = Math.max(1, Number(req.nextUrl.searchParams.get('page') ?? '1'))
  const pageSize  = 25

  const status = STATUS_MAP[statusRaw] ?? null

  // Build where clause — full-text-ish via contains (case-insensitive)
  const where: any = { OR: [{ userId: session.user.id }] }

  // If user is a corporate admin, include org cases
  const user = await prisma.user.findUnique({
    where:  { id: session.user.id },
    select: { role: true, organizationId: true },
  })
  if (user?.role === 'corporate_admin' && user.organizationId) {
    where.OR.push({ organizationId: user.organizationId })
  }

  if (status) {
    where.status = status
  }

  if (q) {
    where.AND = [{
      OR: [
        { applicantName:   { contains: q, mode: 'insensitive' } },
        { visaCategory:    { contains: q, mode: 'insensitive' } },
        { currentStage:    { contains: q, mode: 'insensitive' } },
        { petitionerName:  { contains: q, mode: 'insensitive' } },
        { applicantEmail:  { contains: q, mode: 'insensitive' } },
      ],
    }]
  }

  const [cases, total] = await Promise.all([
    prisma.case.findMany({
      where,
      select: {
        id: true, applicantName: true, visaCategory: true, caseType: true,
        currentStage: true, status: true, approvalProbabilityScore: true,
        estimatedCompletionDate: true, createdAt: true, updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
      skip:    (page - 1) * pageSize,
      take:    pageSize,
    }),
    prisma.case.count({ where }),
  ])

  return NextResponse.json({
    cases,
    total,
    page,
    pageSize,
    hasMore: page * pageSize < total,
  })
}
