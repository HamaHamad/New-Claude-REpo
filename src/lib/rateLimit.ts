/**
 * In-memory rate limiter for API routes.
 *
 * Uses a sliding-window counter per (identifier, route) tuple.
 * Suitable for single-instance Vercel deployments. For multi-instance
 * production, swap the `Map` for an Upstash Redis client.
 *
 * Usage:
 *   import { rateLimit } from '@/lib/rateLimit'
 *   const limited = rateLimit({ req, key: 'login', limit: 10, windowMs: 60_000 })
 *   if (limited) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
 */

import type { NextRequest } from 'next/server'

interface Bucket {
  count: number
  resetAt: number
}

const store = new Map<string, Bucket>()

// GC entries older than this every N calls
const GC_INTERVAL_MS = 60_000
let lastGcAt = 0

interface RateLimitOptions {
  req: NextRequest
  /** Logical name for the route being limited, e.g. 'login', 'chat'. */
  key: string
  /** Max requests allowed within `windowMs`. */
  limit: number
  /** Window length in milliseconds. */
  windowMs: number
}

interface RateLimitResult {
  limited: boolean
  remaining: number
  resetAt: number
}

export function rateLimit(opts: RateLimitOptions): RateLimitResult {
  const id = getClientId(opts.req)
  const bucketKey = `${opts.key}:${id}`

  const now = Date.now()

  // Periodic GC to prevent memory leak
  if (now - lastGcAt > GC_INTERVAL_MS) {
    store.forEach((b, k) => {
      if (b.resetAt < now) store.delete(k)
    })
    lastGcAt = now
  }

  const existing = store.get(bucketKey)
  let bucket: Bucket

  if (!existing || existing.resetAt < now) {
    bucket = { count: 1, resetAt: now + opts.windowMs }
    store.set(bucketKey, bucket)
    return { limited: false, remaining: opts.limit - 1, resetAt: bucket.resetAt }
  }

  bucket = existing
  bucket.count += 1

  const limited = bucket.count > opts.limit
  return {
    limited,
    remaining: Math.max(0, opts.limit - bucket.count),
    resetAt: bucket.resetAt,
  }
}

/** Extract a stable client identifier. Falls back to 'anon' if nothing useful. */
function getClientId(req: NextRequest): string {
  // Prefer the authenticated user id if the route has resolved it
  // (we don't have access to the session here, so rely on IP / forwarded for)
  const xff = req.headers.get('x-forwarded-for')
  if (xff) {
    return xff.split(',')[0]!.trim()
  }
  const xRealIp = req.headers.get('x-real-ip')
  if (xRealIp) return xRealIp.trim()
  return 'anon'
}

/** Helper that returns standard rate-limit headers for a 429 response. */
export function rateLimitHeaders(result: { remaining: number; resetAt: number }): Record<string, string> {
  return {
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': String(Math.ceil(result.resetAt / 1000)),
    'Retry-After': String(Math.max(1, Math.ceil((result.resetAt - Date.now()) / 1000))),
  }
}
