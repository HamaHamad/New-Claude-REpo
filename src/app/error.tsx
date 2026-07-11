'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // In production this should pipe to Sentry / LogRocket.
    console.error('Route error boundary:', error)
  }, [error])

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'var(--bg)', fontFamily: 'var(--font-body)' }}
    >
      <div className="w-full max-w-md text-center">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)' }}
        >
          <AlertTriangle className="w-7 h-7" style={{ color: 'var(--danger)' }} />
        </div>
        <h1
          className="font-display font-bold text-2xl mb-2"
          style={{ color: 'var(--text-1)', letterSpacing: '-0.03em' }}
        >
          Something went wrong
        </h1>
        <p className="text-sm mb-6" style={{ color: 'var(--text-3)' }}>
          An unexpected error occurred while rendering this page. Our team has been notified.
          You can try again, or return to the dashboard.
        </p>

        {process.env.NODE_ENV === 'development' && (
          <pre
            className="text-left text-xs p-3 rounded-lg mb-4 overflow-x-auto"
            style={{
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border)',
              color: 'var(--text-2)',
            }}
          >
            {error.message}
            {error.digest ? `\nDigest: ${error.digest}` : ''}
          </pre>
        )}

        <div className="flex items-center justify-center gap-3">
          <button onClick={reset} className="btn-primary">
            <RefreshCw className="w-4 h-4" /> Try again
          </button>
          <Link href="/dashboard" className="btn-secondary">
            <Home className="w-4 h-4" /> Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
