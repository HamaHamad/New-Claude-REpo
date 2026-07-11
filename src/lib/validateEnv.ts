/**
 * Startup environment validation. Import this from instrumentation.ts
 * (Next.js will call it once on server boot) to fail fast on missing config.
 *
 * In non-production we warn; in production we throw to abort boot.
 */

const REQUIRED_IN_PROD = [
  'DATABASE_URL',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
  'NEXT_PUBLIC_APP_URL',
] as const

const RECOMMENDED = [
  'ANTHROPIC_API_KEY',
  'BLOB_READ_WRITE_TOKEN',
  'CRON_SECRET',
] as const

export function validateEnv() {
  if (process.env.NODE_ENV !== 'production') {
    // Dev: warn but don't crash
    for (const key of REQUIRED_IN_PROD) {
      if (!process.env[key]) {
        console.warn(`⚠️  Missing required env var: ${key}`)
      }
    }
    for (const key of RECOMMENDED) {
      if (!process.env[key]) {
        console.warn(`⚠️  Missing recommended env var: ${key} (some features will be disabled)`)
      }
    }
    return
  }

  // Prod: fail fast
  const missing = REQUIRED_IN_PROD.filter(k => !process.env[k])
  if (missing.length > 0) {
    throw new Error(
      `[startup] Aborting — missing required environment variables: ${missing.join(', ')}. ` +
      `Set these in your deployment dashboard and redeploy.`
    )
  }

  // Warn (not throw) on missing recommended
  const missingRecommended = RECOMMENDED.filter(k => !process.env[k])
  if (missingRecommended.length > 0) {
    console.warn(
      `[startup] Missing recommended env vars: ${missingRecommended.join(', ')}. ` +
      `Some features (AI, file storage, cron) will be disabled.`
    )
  }

  // Sanity-check NEXTAUTH_SECRET length
  const secret = process.env.NEXTAUTH_SECRET!
  if (secret.length < 16) {
    console.warn('[startup] NEXTAUTH_SECRET is short (<16 chars). Consider generating a stronger secret.')
  }
}
