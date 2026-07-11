import type { Metadata } from 'next'
import './globals.css'
import { SessionProvider } from '@/components/SessionProvider'

export const metadata: Metadata = {
  title: {
    default: 'ImmigAI — Intelligent Immigration Platform',
    template: '%s · ImmigAI',
  },
  description: 'End-to-end AI-powered immigration case management for law firms and corporate immigration teams.',
  keywords: ['immigration', 'AI', 'case management', 'visa', 'legal tech', 'H-1B', 'green card', 'USCIS'],
  authors: [{ name: 'ImmigAI' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://immigai.app'),
  openGraph: {
    type: 'website',
    siteName: 'ImmigAI',
    title: 'ImmigAI — Intelligent Immigration Platform',
    description: 'AI-powered immigration case management for law firms and corporate immigration teams.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'ImmigAI' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ImmigAI — Intelligent Immigration Platform',
    description: 'AI-powered immigration case management for law firms and corporate immigration teams.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
}

export const viewport = {
  themeColor: '#0a9161',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;0,9..144,800;1,9..144,400;1,9..144,500&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
        />
      </head>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-white focus:text-slate-900 focus:shadow-lg"
        >
          Skip to main content
        </a>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
