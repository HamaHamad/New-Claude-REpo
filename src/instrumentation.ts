/**
 * Next.js instrumentation hook — runs once on server boot.
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { validateEnv } = await import('./lib/validateEnv')
    validateEnv()
  }
}
