import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  const checks: Record<string, { ok: boolean; ms?: number; error?: string }> = {}

  // ── Process uptime ─────────────────────────────────────
  checks.process = { ok: true }

  // ── Required env vars ──────────────────────────────────
  const requiredEnv = ['DATABASE_URL', 'NEXTAUTH_SECRET', 'NEXTAUTH_URL']
  const missing = requiredEnv.filter(v => !process.env[v])
  checks.env = { ok: missing.length === 0, error: missing.length ? `Missing: ${missing.join(', ')}` : undefined }

  // ── Database connectivity ──────────────────────────────
  const dbStart = Date.now()
  try {
    await prisma.$queryRaw`SELECT 1`
    checks.database = { ok: true, ms: Date.now() - dbStart }
  } catch (err: any) {
    checks.database = { ok: false, ms: Date.now() - dbStart, error: err.message }
  }

  // ── Optional services ──────────────────────────────────
  checks.anthropic = { ok: !!process.env.ANTHROPIC_API_KEY }
  checks.blob       = { ok: !!process.env.BLOB_READ_WRITE_TOKEN }
  checks.smtp       = { ok: !!(process.env.SMTP_HOST && process.env.SMTP_PORT) }

  const allOk = Object.values(checks).every(c => c.ok)
  const status = allOk ? 200 : 503

  return NextResponse.json(
    {
      status:   allOk ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      checks,
    },
    { status }
  )
}
