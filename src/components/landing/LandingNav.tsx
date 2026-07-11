'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, ArrowRight } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Platform', href: '#platform' },
  { label: 'Pricing',  href: '#pricing'  },
]

/**
 * Client-side nav wrapper that owns the mobile menu state.
 * The rest of the landing page can stay a server component.
 */
export function LandingNav() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav
      className="fixed top-0 w-full z-50 backdrop-blur-xl"
      style={{ background: 'var(--bg-overlay)', borderBottom: '1px solid var(--border)' }}
      aria-label="Marketing navigation"
    >
      <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5" aria-label="ImmigAI home">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--brand)' }}>
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M16 16l3-8 3 8c-2 1.5-4 1.5-6 0" />
              <path d="M2 16l3-8 3 8c-2 1.5-4 1.5-6 0" />
              <path d="M7 21h10M12 3v18M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
            </svg>
          </div>
          <span className="font-display font-bold text-lg" style={{ color: 'var(--text-1)', letterSpacing: '-0.03em' }}>
            ImmigAI
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(l => (
            <a key={l.label} href={l.href} className="nav-link">{l.label}</a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="btn-ghost" style={{ color: 'var(--text-2)' }}>Sign In</Link>
          <Link href="/dashboard" className="btn-primary">
            Get Started <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ color: 'var(--text-2)' }}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-menu"
        >
          {mobileOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          id="mobile-nav-menu"
          className="md:hidden px-5 pb-5 space-y-2"
          style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-card)' }}
        >
          {NAV_LINKS.map(l => (
            <a key={l.label} href={l.href} className="block py-2.5 nav-link" onClick={() => setMobileOpen(false)}>{l.label}</a>
          ))}
          <div className="pt-3 flex flex-col gap-2" style={{ borderTop: '1px solid var(--border)' }}>
            <Link href="/login" className="btn-secondary text-center">Sign In</Link>
            <Link href="/dashboard" className="btn-primary justify-center">Get Started</Link>
          </div>
        </div>
      )}
    </nav>
  )
}
