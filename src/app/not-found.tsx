import Link from 'next/link'
import { Compass } from 'lucide-react'

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'var(--bg)', fontFamily: 'var(--font-body)' }}
    >
      <div className="w-full max-w-md text-center">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{ background: 'var(--brand-dim)', border: '1px solid var(--brand-glow)' }}
        >
          <Compass className="w-7 h-7" style={{ color: 'var(--brand)' }} />
        </div>
        <h1
          className="font-display font-bold text-5xl mb-2"
          style={{ color: 'var(--text-1)', letterSpacing: '-0.04em' }}
        >
          404
        </h1>
        <p className="text-sm mb-6" style={{ color: 'var(--text-3)' }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/" className="btn-secondary">
            Home
          </Link>
          <Link href="/dashboard" className="btn-primary">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
